<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * Ananas  
 *
 * A simple, fast, development framework for web applications and software licenses software
 *
 * @package		Ananas
 * @author		Ananas Dev Team
// ------------------------------------------------------------------------
*/
class Plugin_Settings extends Plugin
{
	/**
	 * Load a variable
	 *
	 * Magic method to get the setting.
	 *
	 * @param string $name
	 * @param array $data
	 *
	 * @return string
	 */
	function __call($name, $data)
	{
		return $this->settings->get($name);
	}
}