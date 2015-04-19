<?php

defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * App  
 *
 * A simple, fast, contact and software licenses software
 *
 * @package		App
 * @author		App Dev Team
*/

// ------------------------------------------------------------------------

/**
 * Fixes a .htaccess bug
 *
 * @subpackage	URI
 */
class My_URI extends CI_URI {
    
    function __construct() {
        parent::__construct();
    }

    function _fetch_uri_string() {
        if (strtoupper($this->config->item('uri_protocol')) == 'AUTO') {
            // Let's try ORIG_PATH_INFO! This is an edge case, and in most cases won't be necessary,
            // but we need to try it first, because on servers where REQUEST_URI does not work,
            // CI still thinks it worked, and doesn't check the alternatives.
            $path = (isset($_SERVER['ORIG_PATH_INFO'])) ? $_SERVER['ORIG_PATH_INFO'] : @getenv('ORIG_PATH_INFO');
	    $path = (substr($path, 0, 10) == '/index.php') ? substr($path, 10) : $path;
	    $path = (substr($path, 0, 1) == '/') ? substr($path, 1) : $path;
	    
	    # To fix another bug, we have to remove index.php from the thing completely. First, let's add a slash to the end if it needs one.
	    $path = (substr($path, -1) == '/') ? $path : $path.'/';
	    $path = str_ireplace('/index.php/', '/', $path);
            
	    # Now, let's see if the start of $path is in the end of $url.
	    $strlen = strlen($path);
	    while ($strlen > 0) {
		if (substr(BASE_URL, -$strlen) == substr($path, 0, $strlen)) {
		    $path = str_ireplace(substr($path, 0, $strlen), '', substr($path, 0, $strlen));
		    break;
		}
		
		$strlen--;
	    }
	    
            if (trim($path, '/') != '') {
                $this->uri_string = $path;
                return;
            }
        }
        
        parent::_fetch_uri_string();
	
	if (substr($this->uri_string, 0, 10) == 'index.php/') {
	    $this->uri_string = substr($this->uri_string, 10);
	}
    }

}