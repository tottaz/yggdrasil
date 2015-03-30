<?php

/**
 * Set Value
 *
 * We have removed the part using form validation.
 *
 * @access	public
 * @param	string
 * @return	mixed
 */
function set_value($field = '', $default = '')
{
	if ( ! isset($_POST[$field]))
	{
		return $default;
	}
	return form_prep($_POST[$field], $field);
}
