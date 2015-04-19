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
/**
 * Translates the given key, optionally with variables.
 *
 * __('Hello :1! Today is :2.', array('Joe', 'Friday'));
 *
 * In this example, your language files would look like this:
 *
 * $lang['Hello :1! Today is :2.'] = 'Hello :1! Today is :2.';
 *
 * @access	public
 * @param	string	The language line to translate
 * @param	array	An optional array of variables
 * @return	string
 */
function __($line, $vars = array()) {
    
	$translated = PAN::$CI->lang->line($line);

	$line = $translated ? $translated : $line;

	for ($i = 0; $i < count($vars); $i++) {
		$line = str_replace(':'.($i + 1), $vars[$i], $line);
	}

	return $line;
}

function get_supported_lang()
{
	$supported_lang = Settings::get('supported_languages');

	$arr = array();
	foreach ($supported_lang as $key => $lang)
	{
		$arr[] = $key . '=' . $lang['name'];
	}

	return $arr;
}

/**
 * Language Label
 *
 * Takes a string and checks for lang: at the beginning. If the
 * string does not have lang:, it outputs it. If it does, then
 * it will remove lang: and use the rest as the language line key.
 *
 * @param 	string
 * @return 	string
 */
if ( ! function_exists('lang_label'))
{
	function lang_label($key)
	{
		if (substr($key, 0, 5) == 'lang:')
		{
			return lang(substr($key, 5));
		}
		else
		{
			return $key;
		}
	}
}

// ------------------------------------------------------------------------

if ( ! function_exists('sprintf_lang'))
{
    function sprintf_lang($line, $variables = array())
    {
        array_unshift($variables, lang($line));
        return call_user_func_array('sprintf', $variables);
    }
}