<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * Yggdrasil
 *
 * @package		Yggdrasil
 * @author		Yggdrasil Dev Team
 */
// http://localhost/yggdrasil/api/1/users?apikey=ixZePbqTLpCfiVvkTwLPEHb8kmekJeGJiQRAIAoQ
//

class Users extends REST_Controller {
	public function __construct() {
		parent::__construct();
		
		$this->load->model('users/user_m');
		$this->load->model('users/ion_auth_model');
	}

	// /api/v1/users
	// limit = 5
	// start = 0
	// sort_by = email (default: id)
	// sort_dir = asc (default: asc)
	// user_d = asc (default: asc)
	public function index_get()
	{
		$sort_by = $this->get('sort_by') ? $this->get('sort_by') : 'id';
		$sort_dir = $this->get('sort_dir') ? $this->get('sort_dir') : 'asc';

		$users = $this->user_m
			 ->select('*, null as password, FROM_UNIXTIME(created_on) as created_on, FROM_UNIXTIME(last_login) as last_login', FALSE)
			->order_by($sort_by, $sort_dir)
			->limit($this->get('limit'), $this->get('start'))
			->get_all();
			
		foreach ($users as &$user)
		{
			$user->id = (int) $user->id;
			$user->group_id = (int) $user->group_id;
			$user->active = (bool) $user->active;
		}
		
		$count = count($users);
		$this->response(array(
			'status' => true,
			'message' => "Found $count users",
			'users' => $users,
			'count' => $count
		), 200);
	}

	
	/**
	 * Show User
	 * 
	 * @link   /api/1/users/show   GET Request
	 */
	public function show_get()
	{
		if ( ! $this->get('id'))
		{
			$err_msg = 'No id was provided.';
			$this->response(array('status' => false, 'message' => $err_msg, 'error_message' => $err_msg), 400);
		}
		
		$user = $this->user_m
					->select('*, null as password, FROM_UNIXTIME(created_on) as created_on, FROM_UNIXTIME(last_login) as last_login', FALSE)
					->get($this->get('id'));
			
		if (empty($user))	
		{
			$err_msg = 'This user could not be found.';
			$this->response(array('status' => false, 'message' => $err_msg, 'error_message' => $err_msg), 404);
		}
		else
		{
			$user->id = (int) $user->id;
			$user->group_id = (int) $user->group_id;
			$user->active = (bool) $user->active;
			$this->response(array('status' => true, 'user' => $user, 'message' => 'Found user #'.$user->id), 200);
		}
	}
	
	/**
	 * Create New User
	 * 
	 * @link   /api/1/users/new   POST Request
	 */
	public function new_post()
	{
		if (empty($_POST))
		{
			$err_msg = 'No details were provided.';
			$this->response(array('status' => false, 'message' => $err_msg, 'error_message' => $err_msg), 400);
		}

		// Set validation rules above and validate
		if ( ! $this->user_m->set_validate($this->users_validation)->validate($this->input->post()))
		{
			$err_msg = current($this->validation_errors());
			$this->response(array('status' => false, 'message' => $err_msg, 'error_message' => $err_msg), 400);
		}
		
		$this->load->helper('array');
		$user = elements_exist($this->users_insert_columns, $this->input->post());
		foreach (array('username', 'email', 'password') as $key)
		{
			$$key = $user[$key];
			unset($user[$key]);
		}

		// Default Group Name to admin
		$group_name = 'admin';
		if (isset($user['group_name']))
		{
			$group_name = $user['group_name'];
			unset($user['group_name']);
		}

		// Register this user!
		$id = $this->ion_auth_model->register($username, $password, $email, $user, $group_name);

		// Registration Failed
		if ( ! $id)
		{
			$this->ion_auth->set_error_delimiters('', '');

			$err_msg = $this->ion_auth->errors();
			$this->response(array('status' => false, 'message' => $err_msg, 'error_message' => $err_msg), 400);
		}
		// Registartion Succeeded
		else
		{
			$this->response(array('status' => true, 'id' => $id, 'message' => sprintf('User #%s has been created.', $id)), 200);
		}
	}
}