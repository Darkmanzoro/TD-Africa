odoo.define('sh_pos_mobile_barcode.qr_scan', function (require) {
"use strict";

var core = require('web.core');
var screens = require('point_of_sale.screens');
var models = require('point_of_sale.models');
var DB = require('point_of_sale.DB');

var _t = core._t;
var QWeb = core.qweb;
var counter = 0;

models.load_fields("product.product",['sh_qr_code']);
models.load_fields("product.template",['sh_qr_code']);
models.load_fields("pos.config", ['sh_pos_barcode_mobile_type','sh_pos_bm_is_cont_scan','sh_pos_bm_is_notify_on_success','sh_pos_bm_is_notify_on_fail','sh_pos_bm_is_sound_on_success','sh_pos_bm_is_sound_on_fail']);


DB.include({
    init: function(options) {
        this._super.apply(this, arguments);
        this.product_by_default_code = {};
        this.product_by_qr = {};
        
    },
    add_products: function(products) {
        var self = this;
        this._super(products);
        var defined_product = false;
        for(var i = 0, len = products.length; i < len; i++){
        	var product = products[i];
            if(product.default_code){
                this.product_by_default_code[product.default_code] = product;
            }
            if(product.sh_qr_code){
                this.product_by_qr[product.sh_qr_code] = product;
            }
        }
    },
    get_product_by_default_code: function(default_code){
        if(this.product_by_default_code[default_code]){
            return this.product_by_default_code[default_code];
        } else {
            return undefined;
        }
    },
    get_product_by_qr: function(sh_qr_code){
        if(this.product_by_qr[sh_qr_code]){
            return this.product_by_qr[sh_qr_code];
        } else {
            return undefined;
        }
    },
    
});


var QRButton = screens.ActionButtonWidget.extend({
    template: 'QRButton',
    button_click: function(){
        var self = this;
        let selectedDeviceId;
        
        const codeReader = new ZXing.BrowserMultiFormatReader()
        var contents = $('.product-list');
        
        codeReader.getVideoInputDevices()
        .then(function(result) {
        	//THEN METHOD START HERE
        	const sourceSelect = document.getElementById('js_id_sh_sale_barcode_mobile_cam_select');
        	
        	$("#js_id_sh_sale_barcode_mobile_cam_select option").remove();
        	
        	
            _.each(result, function(item) {
                const sourceOption = document.createElement('option')
                sourceOption.text = item.label
                sourceOption.value = item.deviceId
                sourceSelect.appendChild(sourceOption)
            });
            $('#js_id_sh_sale_barcode_mobile_cam_select').change(function(e){
            	selectedDeviceId = sourceSelect.value; 
            });
        });
       
        if(counter==0){
        	//SHOW VIDEO
    		$('#js_id_sh_sale_barcode_mobile_vid_div').show();    
    		
    		//SHOW STOP/ HIDE START BUTTON
    		$("#js_id_sh_sale_barcode_mobile_reset_btn").show();
    		$("#js_id_sh_sale_barcode_mobile_start_btn").hide();
    		
    		//CALL METHOD
			//CONTINUOUS SCAN OR NOT.SystrayMenu
			if( self.pos.config.sh_pos_bm_is_cont_scan){
				self.decodeContinuously(codeReader, selectedDeviceId);	
			}else{
	              self.decodeOnce(codeReader, selectedDeviceId);
			}    		
        	
			// SHOW CAMERA AND HIDE PRODUCTS
        	$(self.chrome.screens.products.el.querySelector('.camera-list')).show();
    		$(self.chrome.screens.products.el.querySelector('.product-list')).hide();
    		$(self.chrome.screens.products.el.querySelector('.category-list')).hide();
    		$("#js_id_sh_sale_barcode_mobile_reset_btn").css("display","block");
        	counter = 1;
        }
        this.$('.stop_barcode').click(function(e) {
        	
     		//RESET READER
             codeReader.reset();
             
     		//HIDE VIDEO
     		$('#js_id_sh_sale_barcode_mobile_vid_div').hide();  
        		
     		//HIDE STOP / SHOW START BUTTON
     		$("#js_id_sh_sale_barcode_mobile_reset_btn").hide();    	
     		$("#js_id_sh_sale_barcode_mobile_start_btn").show();
     		
     		// HIDE CAMERA AND OPEN PRODUCTS
            $(self.chrome.screens.products.el.querySelector('.camera-list')).hide();
  			$(self.chrome.screens.products.el.querySelector('.product-list')).show();
  			$(self.chrome.screens.products.el.querySelector('.category-list')).show();
  			
        });
        this.$('.start_barcode').click(function(e) {
            console.log(self.pos)
    		//SHOW VIDEO
    		$('#js_id_sh_sale_barcode_mobile_vid_div').show();    
    		
    		//SHOW STOP/ HIDE START BUTTON
    		$("#js_id_sh_sale_barcode_mobile_reset_btn").show();
    		$("#js_id_sh_sale_barcode_mobile_start_btn").hide();
    		
    		//CALL METHOD
			//CONTINUOUS SCAN OR NOT.SystrayMenu
			if( self.pos.config.sh_pos_bm_is_cont_scan){
				self.decodeContinuously(codeReader, selectedDeviceId);	
				 
			}else{
	              self.decodeOnce(codeReader, selectedDeviceId);
			}    		
        	
			// SHOW CAMERA AND HIDE PRODUCTS
        	$(self.chrome.screens.products.el.querySelector('.camera-list')).show();
    		$(self.chrome.screens.products.el.querySelector('.product-list')).hide();
    		$(self.chrome.screens.products.el.querySelector('.category-list')).hide();
    		
    		$("#js_id_sh_sale_barcode_mobile_reset_btn").css("display","block");
         });
       
    },
    decodeContinuously: function(codeReader, selectedDeviceId) {
    	var self = this;
        codeReader.decodeFromInputVideoDeviceContinuously(selectedDeviceId, 'video', (result, err) => {
        	
        	//RESULT
          if (result) {
        	  
        	  var product = '' 
        		  
        	  if(self.pos.config.sh_pos_barcode_mobile_type == 'barcode'){
        		  product = this.pos.db.get_product_by_barcode(result.text);
        	  }
        	  else if(self.pos.config.sh_pos_barcode_mobile_type == 'int_ref'){
        		  product = this.pos.db.get_product_by_default_code(result.text);
        	  }
        	  else if(self.pos.config.sh_pos_barcode_mobile_type == 'sh_qr_code'){
        		  product = this.pos.db.get_product_by_qr(result.text);
        	  }
        	 
        	  else if(self.pos.config.sh_pos_barcode_mobile_type == 'all'){
        		  if(this.pos.db.get_product_by_barcode(result.text)){
            		  product = this.pos.db.get_product_by_barcode(result.text);
            	  }
            	  else if(this.pos.db.get_product_by_default_code(result.text)){
            		  product = this.pos.db.get_product_by_default_code(result.text);
            	  }
            	  else if(this.pos.db.get_product_by_qr(result.text)){
            		  product = this.pos.db.get_product_by_qr(result.text);
            	  }
        	  }
        	  if(product){
        		  this.pos.get_order().add_product(product);
        		  if(this.pos.config.sh_pos_bm_is_notify_on_success){
        			  $.iaoAlert({msg: "Product: "+product.display_name +" Added to cart successfully.",
                          type: "notification",
                          mode: "dark",
                          autoHide:true,
                          alertTime:"3000",
                          closeButton: true,
                          })
        		  }
        		  if(this.pos.config.sh_pos_bm_is_sound_on_success){
        			  this.gui.play_sound('bell');
        		  }
        		  
        	  }else{
        		  
        		  if(this.pos.config.sh_pos_bm_is_notify_on_fail){
	                  $.iaoAlert({msg: "Warning: Scanned Internal Reference/Barcode not exist in any product!",
	                   type: "error",
	                   autoHide:true,
	                   alertTime:"3000",
	                   closeButton: true,
	                   mode: "dark",})
        		  }
        		  if(this.pos.config.sh_pos_bm_is_sound_on_fail){
        			  this.gui.play_sound('error');
        		  }
        	  }

        	  $('#js_id_sh_sale_barcode_mobile_vid_div').hide(); 
              $('#js_id_sh_sale_barcode_mobile_vid_div').show(); 
			
        	  
          }

          if (err) {
            // As long as this error belongs into one of the following categories
            // the code reader is going to continue as excepted. Any other error
            // will stop the decoding loop.
            //
            // Excepted Exceptions:
            //
            //  - NotFoundException
            //  - ChecksumException
            //  - FormatException

            if (err instanceof ZXing.NotFoundException) {
            	console.log('No QR code found.')
	          	//EMPTY INPUT
	      	              
            }

            if (err instanceof ZXing.ChecksumException) {
              console.log('A code was found, but it\'s read value was not valid.')
            }

            if (err instanceof ZXing.FormatException) {
              console.log('A code was found, but it was in a invalid format.')
            }
          }
        })
      }	,

    decodeOnce: function(codeReader, selectedDeviceId) {
    	var self = this;
        codeReader.decodeFromInputVideoDevice(selectedDeviceId, 'video').then((result) => {
        	//RESULT
        	var product = ''
          	  if(self.pos.config.sh_pos_barcode_mobile_type == 'barcode'){
          		  product = this.pos.db.get_product_by_barcode(result.text);
          	  }
          	  else if(self.pos.config.sh_pos_barcode_mobile_type == 'int_ref'){
          		  product = this.pos.db.get_product_by_default_code(result.text);
          	  }
          	  else if(self.pos.config.sh_pos_barcode_mobile_type == 'sh_qr_code'){
          		  product = this.pos.db.get_product_by_qr(result.text);
          	  }
          	  else if(self.pos.config.sh_pos_barcode_mobile_type == 'all'){
          		  if(this.pos.db.get_product_by_barcode(result.text)){
              		  product = this.pos.db.get_product_by_barcode(result.text);
              	  }
              	  else if(this.pos.db.get_product_by_default_code(result.text)){
              		  product = this.pos.db.get_product_by_default_code(result.text);
              	  }
              	  else if(this.pos.db.get_product_by_qr(result.text)){
              		  product = this.pos.db.get_product_by_qr(result.text);
              	  }
          	  }
          	  if(product){
          		  this.pos.get_order().add_product(product);
	          		if(this.pos.config.sh_pos_bm_is_notify_on_success){
	          		  $.iaoAlert({msg: "Product: "+product.display_name +" Added to cart successfully.",
	                        type: "notification",
	                        mode: "dark",
	                        autoHide:true,
	                        alertTime:"3000",
	                        closeButton: true,
	                        })
	          		}  
	          		if(this.pos.config.sh_pos_bm_is_sound_on_success){
	        			 this.gui.play_sound('bell');
	        		 }
	        		  
          	  }else{
          		  if(this.pos.config.sh_pos_bm_is_notify_on_fail){
                    $.iaoAlert({msg: "Warning: Scanned Internal Reference/Barcode not exist in any product!",
                     type: "error",
                     autoHide:true,
                     alertTime:"3000",
                     closeButton: true,
                     mode: "dark",})
          		  }
          		  if(this.pos.config.sh_pos_bm_is_sound_on_fail){
	      			  this.gui.play_sound('error');
	      		  }
          	  }
    		//RESET READER
            codeReader.reset();
            
    		//HIDE VIDEO
    		$('#js_id_sh_sale_barcode_mobile_vid_div').hide();  
       		
    		//HIDE STOP/ SHOW START BUTTON
    		$("#js_id_sh_sale_barcode_mobile_reset_btn").hide();  
    		$("#js_id_sh_sale_barcode_mobile_start_btn").show();
    		
    		// HIDE CAMERA AND OPEN PRODUCTS
    		$(self.chrome.screens.products.el.querySelector('.camera-list')).hide();
   			$(self.chrome.screens.products.el.querySelector('.product-list')).show();
   			$(self.chrome.screens.products.el.querySelector('.category-list')).show();
            
        }).catch((err) => {
          console.error(err)

        })
      },

    
});

screens.define_action_button({
    'name': 'qr_button',
    'widget': QRButton,
   
});

return {
	QRButton: QRButton,
}

});
