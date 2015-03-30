<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * App  
 *
 * A simple, fast, contact and software licenses software
 *
 * @package		App
 * @author		App Dev Team
// ------------------------------------------------------------------------

/**
 * All public controllers should extend this library
 *
 * @subpackage	Libraries
 * @category	Libraries
 * @author		Sean Drumm
 */
class Email_Template {
	private $_theme_path;
	
	/**
	 * Constructor, actually not needed in this case, maybe future
	 * 
	 * @return void
	 */
	function __construct() {
		if(isset($this->template)) {
			$this->_theme_path = $this->template->get_theme_path();
		}
	}
	
	/**
	 * Parse template text (variables)
	 * @param string Email tempalte
	 * @param array Replacement variables
	 * @return type	parsed text
	 */
	private function parse_text($input, $array) {
		$search = preg_match_all('/{.*?}/', $input, $matches);
		for($i = 0; $i < $search; $i++) {
			$matches[0][$i] = str_replace(array('{', '}'), null, $matches[0][$i]);
		}
		
		foreach($matches[0] as $value) {
			//$replace = str_replace(array("\n","\t","\r")," ", $array[$value]);
			//die(print_r($array));
		    if (isset($array[$value])) {
			$input = str_replace('{' . $value . '}', $array[$value], $input);
		    }
		}
		
		return $input;
	}
	
	/**
	 * Build (return) the email template, will return false if the file is
	 * not found
	 * 
	 * @param string $view
	 * @return string|bool Email template text or false when file is not found
	 */
	public function build($view, $content) {
	    $CI = &get_instance();
	    
	    # Change the theme to the frontend theme to get the email template contents.
	    $CI->template->set_theme(PAN::setting('theme'));
		$CI->_theme_path	= $CI->template->get_theme_path();
		$file_location		= $CI->_theme_path . 'views/emails/' . $view . '.php';
		
		if(file_exists($file_location)) {
			$email_content = file_get_contents($file_location);
			$email_content = Email_Template::parse_text($email_content, array('content' => $content));
			 # Change the theme back to the admin theme to keep things running smoothly.
			$CI->template->set_theme('admin/'.PAN::setting('admin_theme'));
			return $email_content;
		} else {
			show_error('Could not send the email. '.$file_location.' does not exist.');
			return false;
		}
	}
}