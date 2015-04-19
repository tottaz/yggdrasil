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
// ------------------------------------------------------------------------

/**
 * Log an action executed in App
 * 
 *
 * @param string $action
 * @param integer $item_id
 * @param string $message 
 * @return boolean
 */
function log_action($action, $item_id = 0, $message = '') {
    
    $CI = &get_instance();
    
    $item_id = (int) $item_id;
    $user_id = (int) $CI->template->current_user->id;
    $time = time();
    
    # Get the message. If a custom message has been provided in $message, use it.
    # Otherwise, use the one from the language files.
    $message = empty($message) ? lang($action) : $message;
    
    if (empty($message)) {
        trigger_error('Action message does not exist for '.$action.'. Create it in /language/My_lang.php.');
    }
    
    return $CI->db->insert('action_logs', array(
        'timestamp' => $time,
        'user_id' => $user_id,
        'action' => $action,
        'message' => $message,
        'item_id' => $item_id
    ));
}

/**
 * Get an array containing logged actions.
 * 
 * If $action is left empty but $item_id is not, or if the $action is an integer,
 * it retrieves all the actions pertaining to $item_id.
 * 
 * If $action is NOT empty but $item_id is, it retrieves all the $action actions in the DB.
 * 
 * If both $action and $item_id have a value, it returns all $action actions pertaining to $item_id.
 * 
 * Returns an array. Triggers an error if the action does not exist in My_lang.
 * 
 * Usage:
 * 
 * 
 * @staticvar array $userIdCache
 * @param string|integer $action
 * @param integer $item_id
 * @return array 
 */
function get_logged_actions($action = '', $item_id = 0) {
    
    # In order to increase performance, whenever the function gets the username
    # of a given user_id, it'll cache it, so that it won't need to go query the DB
    # again for the duration of the request.
    static $userIdCache = array();    
    
    if (!empty($action) and !is_int($action) and !lang($action)) {
        trigger_error('Action message does not exist for '.$action.'. Create it in /language/My_lang.php.');
    }
    
    $CI = &get_instance();
    $CI->load->model('users/user_m');
    
    $where = array();
    
    if (!empty($item_id)) {
        $where['item_id'] = $item_id;
    }
    
    if (is_int($action)) {
        $where['item_id'] = $action;
    } elseif (!empty($action)) {
        $where['action'] = $action;
    }
    
    $buffer = $CI->db->get_where('action_logs', $where)->result_array();
    
    foreach ($buffer as $key => $row) {
        $variables = array(
            'timeago' => strtolower(timespan($row['timestamp']).' ago')
        );
        
        if ($row['user_id'] != 0) {
            if (!isset($userIdCache[$row['user_id']])) {
            $userBuffer = $CI->user_m->select('username')->get($row['user_id']);
            $userBuffer = $userBuffer->username;
            } else {
                $userBuffer = $userIdCache[$row['user_id']];
            }
            $variables['username'] = $userBuffer;
        }
        
        if ($row['item_id'] != 0) {
            $variables['item_id'] = $row['item_id'];
        }
        
        foreach ($variables as $variable => $value) {
            $buffer[$key]['message'] = str_ireplace('{'.$variable.'}', $value, $buffer[$key]['message']);
        }
    }
    
    return $buffer;
}