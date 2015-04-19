<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * App  
 *
 * A simple, fast, contact and software licenses software
 *
 * @package		App
 * @author		App Dev Team
*/

require APPPATH."third_party/MX/Lang.php";

/**
 * General Language library class for using in App
 */
class My_Lang extends MX_Lang
{

	/**
	 * Fetch a single line of text from the language array
	 *
	 * @param string $line the language line
	 * @return string
	 */
	public function line($line = '', $log_errors = true)
	{
		$translation = ($line == '' OR !isset($this->language[$line])) ? FALSE : $this->language[$line];

		// Because killer robots like unicorns!
		if ($translation === FALSE)
		{
			log_message('debug', 'Could not find the language line "'.$line.'"');
		}

		return $translation;
	}

}