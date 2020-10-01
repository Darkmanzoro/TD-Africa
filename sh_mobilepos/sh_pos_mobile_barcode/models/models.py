# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies.
from odoo import fields,models,api,_

class PosConfig(models.Model):
    _inherit = 'pos.config'

    sh_pos_barcode_mobile_type = fields.Selection([
        ('int_ref','Internal Reference'),
        ('barcode','Barcode'),
        ('sh_qr_code','QR code'),        
        ('all','All')
        ], string='Product Scan Options In Mobile (Point of Sale)', translate=True,readonly = False, default='barcode')


    sh_pos_bm_is_cont_scan = fields.Boolean('Continuously Scan?', translate=True,readonly = False)
    
    sh_pos_bm_is_notify_on_success = fields.Boolean(string='Notification On Product Succeed?', translate=True,readonly = False)
     
    sh_pos_bm_is_notify_on_fail = fields.Boolean(string='Notification On Product Failed?', translate=True,readonly = False)
     
    sh_pos_bm_is_sound_on_success = fields.Boolean('Play Sound On Product Succeed?', translate=True, readonly = False)
    
    sh_pos_bm_is_sound_on_fail = fields.Boolean('Play Sound On Product Failed?', translate=True, readonly = False)
        
