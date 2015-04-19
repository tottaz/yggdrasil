<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * APP  
 *
 * A simple, fast, contact and software licenses software
 *
 * @package		App
 * @author		App Dev Team
// ------------------------------------------------------------------------

/**
 * The javascript controller
 *
 * @subpackage	Controllers
 * @category	Javascript
 */
class Ajax extends My_Controller {
    
	/**
	 * Used in a javascript callback url.
	 * 
	 * Basically this is just an interface to url_title() defined 
	 * in /system/cms/helpers/My_url_helper.php.
	 * 
	 * @see /system/cms/modules/files/js/functions.js, url_title()
	 */
    public function url_title()
    {
        $this->load->helper('text');

        $slug = trim(url_title($this->input->post('title'), 'dash', true), '-');

        $this->output->set_output($slug);
    }    
    	
    public function hide_notification($notification_id) {
        if (logged_in()) {
            hide_notification($notification_id);
        }
    }
}