# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.
{
    "name": "POS Mobile Barcode/QRCode Scanner",
    
    "author": "Softhealer Technologies",
    
    "website": "https://www.softhealer.com",

    "support": "support@softhealer.com",
        
    "version": "13.0.1",
    
    "category": "Point Of Sale",
    
    "summary": "   Scan POS Product Mobile Barcode Module, Scan POS Product Mobile QRCode, Point Of Sale Mobile QRCode Scanner App, Point Of Sale Product QR Scanner Odoo",
        
    "description": """  
Do you want to scan POS(Point Of Sale) products by Barcode or QRCode on your mobile? Do your time-wasting in POS(Point Of Sale) operations by manual product selection? So here are the solutions these modules useful do quick operations of POS mobile Barcode or QRCode scanner. You no need to select the product and do one by one. scan it and you do! So be very quick in all operations of odoo in mobile and cheers!
POS Mobile Barcode Scanner Odoo, Point Of Sale QRCode Scanner Odoo
 Scan POS Product By Mobile Barcode Module, POS Product Mobile QRCode Scanner, Point Of Sale Mobile QRCode Scanner, Point Of Sale Product Mobile QR Scanner Odoo
   Scan POS Product Mobile Barcode Module, Scan POS Product Mobile QRCode, Point Of Sale Mobile QRCode Scanner App, Point Of Sale Product QR Scanner Odoo
POS Mobile Scanner de código de barras Odoo, Punto de venta QRCode Scanner Odoo
 Escanear producto de punto de venta por módulo de código de barras móvil, escáner de código QR móvil de producto de punto de venta, escáner de código QR móvil de punto de venta, producto de punto de venta escáner de código QR móvil Odoo
   Módulo de código de barras móvil Scan Product Product, Scan POS Product Mobile QRCode, punto de venta Mobile QRCode Scanner App, punto de venta Product QR Scanner Odoo


 """,
     
    "depends": ['point_of_sale','base','web','sh_product_qrcode_generator'],
    
    "data": [
        "views/views.xml",
       "static/src/xml/templates.xml"
    ],    
    "qweb":[  "static/src/xml/*.xml",],
    "images": [],
    "installable": True,
    "auto_install": False,
    "application": True,
    'images': ['static/description/background.png', ], 
    "live_test_url": "https://youtu.be/yTQ4GeVs6Ww",
    "price": 60,
    "currency": "EUR"       
}
