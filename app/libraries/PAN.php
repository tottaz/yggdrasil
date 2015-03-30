<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * App  
 *
 * A simple, fast, contact and software licenses software
 *
 * @package		App
 * @author		App Dev Team
// ------------------------------------------------------------------------
*/
class PAN {

	/**
	 * Holds the CodeIgniter object
	 *
	 * @access		public
	 * @staticvar	$CI
	 */
	public static $CI;

	public function __construct() {
		// Load the global object
		self::$CI =& CI_Controller::get_instance();
	}

	/**
	 * Clone
	 *
	 * This is set to private to block cloning of the Singleton.
	 *
	 * @access	private
	 * @return	void
	 */
	private function __clone() { }

	/**
	 * Retrieves an application setting
	 *
	 * @access	public
	 * @param	string	The name of the setting
	 * @return	string
	 */
	public static function setting($name) {
		return Settings::get($name);
	}
}