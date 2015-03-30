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
function logged_in() {
	static $ci;
	isset($ci) OR $ci = & get_instance();

	return $ci->ion_auth->logged_in();
}

// ------------------------------------------------------------------------

/**
 * Checks if the user is an admin
 *
 * @access	public
 * @return	bool	Admin status
 */
function is_sadmin() {
	static $ci;
	isset($ci) OR $ci = & get_instance();

	return $ci->ion_auth->is_sadmin();
}

// ------------------------------------------------------------------------

/**
 * Checks if the user is a member of a certain group
 *
 * @access	public
 * @param	string	The group name
 * @return	bool	Group membership status
 */
function is_group($group_name) {
	static $ci;
	isset($ci) OR $ci = & get_instance();

	return $ci->ion_auth->is_group($group_name);
}