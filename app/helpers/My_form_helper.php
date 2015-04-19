<?php
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
 * Set Value
 *
 * We have removed the part using form validation.
 * And added support for POST field arrays.
 *
 * @access	public
 * @param	string
 * @return	mixed
 */
function set_value($field = '', $default = '') {
    if (stristr($field, '[') !== false) {
        # It uses field arrays, let's work with that.
        $field = explode('[', $field);
        $arrayIndex = str_ireplace(']', '', $field[1]);
        $field = $field[0];

        return (isset($_POST[$field][$arrayIndex])) ? form_prep($_POST[$field][$arrayIndex], $field) : $default;
    } else {
        return (isset($_POST[$field])) ? form_prep($_POST[$field], $field) : $default;
    }
}
