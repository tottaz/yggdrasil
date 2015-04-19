<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * Ananas  
 *
 * A simple, fast, contact and software licenses software
 *
 * @package		Ananas
 * @author		Ananas Dev Team
// ------------------------------------------------------------------------

/**
 * The User Model
 *
 * @subpackage	Models
 * @category	Users
 */
class User_m extends My_Model
{
	/**
	 * @var	string	The name of the clients table
	 */
	protected $table = 'users';
	
	public function insert($input, $skip_validation = FALSE)
	{
		$this->validate = array(
			array(
				'field'	  => 'username',
				'rules'	  => 'required',
			),
			array(
				'field'	  => 'email',
				'rules'	  => 'required|valid_email'
			),
			array(
				'field'	  => 'password',
				'rules'	  => 'required'
			),
			array(
				'field'	  => 'password_confirm',
				'rules'	  => 'required|matches[password]'
			),
		);
		
		return parent::insert($input);
	}
	
	public function update($id, $input, $skip_validation = FALSE)
	{
		$this->validate = array(
			array(
				'field'	  => 'email',
				'rules'	  => 'required|valid_email',
			),
			array(
				'field'	  => 'password',
				'rules'	  => '',
			),
			array(
				'field'	  => 'password_confirm',
				'rules'	  => 'matches[password]',
			),
		);
		
		return parent::update($id, $input);
	}
	        
        function getUserById($id) {
            $buffer = $this->db->where('id', $id)->get('users')->row_array();
	    return (isset($buffer['username']) and !empty($buffer['username'])) ? $buffer : array();
        }
	
	function getUsernameByEmail($email) {
	    $buffer = $this->db->select('username')->where('email', $email)->get('users')->row_array();
	    return isset($buffer['username']) ? $buffer['username'] : '';
	}
        
        function get_full_name($id) {
            $buffer = $this->getUserById($id);
            if (isset($buffer['first_name'])) {
                return $buffer['first_name'].' '.$buffer['last_name'];
            }
        }
}

/* End of file: user_m.php */