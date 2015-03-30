<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * App  
 *
 * A simple, fast, development framework for web applications and software licenses software
 *
 * @package		App
 * @author		App Dev Team
// ------------------------------------------------------------------------
*/

if (!function_exists('parse_markdown'))
{
	/**
	 * Parse a block of markdown and get HTML back
	 *
	 * @param string $markdown The markdown text.
	 * @return string The HTML 
	 */
	function parse_markdown($markdown)
	{
		$ci = & get_instance();
		$ci->load->library('markdown_parser');

		return Markdown($markdown);
	}

}