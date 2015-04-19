<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * Ananas  
 *
 * A simple web app framework, to convert spreadsheets into web applications
 *  open source software licenses software
 *
 * @package		Ananas
 * @author		Ananas Dev Team
// ------------------------------------------------------------------------

/**
 * User Main Controller
 *
 * @subpackage	Controller
 * @category	Users
 */


	global $apiConfig;
 
class Admin extends Admin_Controller {

	/**
	 * @var	array	All the methods that require user to be logged in
	 */
	protected $secured_methods = array('index', 'change_password', 'create_user', 'activate', 'deactivate');
	
	protected $section = 'users';

	// ------------------------------------------------------------------------

	/**
	 * Load all the dependencies
	 *
	 * @return	void
	 */
	public function __construct()
	{
		parent::__construct();

		#enable query strings for this class
		parse_str($_SERVER['QUERY_STRING'],$_GET);

		$this->load->library('form_validation');
		$this->load->helper('array');
		$this->load->model('users/user_m');
		$this->lang->load('groups');
	}

	// ------------------------------------------------------------------------
	/**
	 * List all the users
	 *
	 * @return	void
	 */
	public function index() 
	{
		$this->template->users = $this->ion_auth->get_users_array();
		$this->template->build('admin/index');
	}

	// ------------------------------------------------------------------------

	/**
	 * Login the user
	 *
	 * @return	void
	 */
	public function login() 
	{
		// Check post and session for the redirect place
		$redirect_to = ($this->input->post('redirect_to')) 
			? trim(urldecode($this->input->post('redirect_to')))
			: $this->session->userdata('redirect_to');
		// Any idea where we are heading after login?
		if ( ! $_POST AND $args = func_get_args())
		{
			$this->session->set_userdata('redirect_to', $redirect_to = implode('/', $args));
		}

		// This persists the login redirect
		$this->session->set_userdata('login_redirect', $this->session->userdata('login_redirect'));

		//validate form input
		$this->form_validation->set_rules('username', 'Username', 'required');
		$this->form_validation->set_rules('password', 'Password', 'required');

		// If the validation worked, or the user is already logged in
		if ($this->form_validation->run() or $this->current_user) 
		{

//		if ($this->form_validation->run()) {

			// Kill the session
			$this->session->unset_userdata('redirect_to');

			// trigger a post login event for third party
			Events::trigger('post_user_login');

			$remember = ($this->input->post('remember') == 1) ? TRUE : FALSE;

			if ($this->ion_auth->login($this->input->post('username'), $this->input->post('password'), $remember, 0)) 
			{
				$redirect = $this->session->userdata('login_redirect') ? $this->session->userdata('login_redirect') : 'admin';
				$this->session->set_userdata('success', $this->ion_auth->messages());
				redirect($redirect, 'refresh');
			}
		}
		$this->template
			->set_layout('login')
			// Set the layout
			->build('login');
	}

	/**
	 * Changes the user's password
	 *
	 * @return	void
	 */
	public function change_password() {
		
		$this->form_validation->set_rules('old_password', 'Old password', 'required');
		$this->form_validation->set_rules('new_password', 'New Password', 'required|min_length['.$this->config->item('min_password_length', 'ion_auth').']|max_length['.$this->config->item('max_password_length', 'ion_auth').']|matches[new_password_confirm]');
		$this->form_validation->set_rules('new_password_confirm', 'Confirm New Password', 'required');

		$user = $this->ion_auth->get_user($this->session->userdata('user_id'));

		if ($this->form_validation->run())
		{
			$identity = $this->session->userdata($this->config->item('identity', 'ion_auth'));

			$change = $this->ion_auth->change_password($identity, $this->input->post('old_password'), $this->input->post('new_password'));

			if ($change) {
				$this->logout('success', 'Your password has been changed. Please login again.');
			} else {
				$this->session->set_userdata('error', $this->ion_auth->errors());
				redirect('admin/users/change_password', 'refresh');
			}
		}

		$this->template->user_id = $user->id;
		$this->template->build('change_password');
	}

	// ------------------------------------------------------------------------

	/**
	 * Log the user out and set a message, then redirect to login.
	 *
	 * @access	public
	 * @param	string	The name of the userdata message
	 * @param	string	The userdata message
	 * @return	void
	 */
	public function logout($message_name = NULL, $message = '') 
	{
		$logout = $this->ion_auth->logout();
		if ($message_name !== NULL) 
		{
			$this->session->set_userdata($message_name, $message);
		}
		redirect('admin/users/login', 'refresh');
	}
	// ------------------------------------------------------------------------
	/**
	 * Starts the "forgotten password" process.
	 *
	 * @access	public
	 * @return	void
	 */
	public function forgot_password() 
	{
		// Set the layout
		$this->template->set_layout('login');
		$this->form_validation->set_rules('email', 'Email Address', 'required');
		if ($this->form_validation->run())
		{
			$username = $this->user_m->getUsernameByEmail($this->input->post('email'));
			if (empty($username)) 
			{
				$this->session->set_userdata('error', 'Could not find any user with the following email: '.$this->input->post('email'));
				redirect("admin/users/forgot_password", 'refresh');
			}
			
			if ($this->ion_auth->forgotten_password($username))
			{
				$this->session->set_userdata('success', $this->ion_auth->messages());
				redirect("admin/users/login", 'refresh');
			}
			else
			{
				$this->session->set_userdata('error', $this->ion_auth->errors(). '<p>for '.$username.'</p>');
				redirect("admin/users/forgot_password", 'refresh');
			}
		}
		$this->template->email = array(
			'name'	   => 'email',
			'id'	   => 'email',
		);
		$this->template->build('forgot_password');
	}

	// ------------------------------------------------------------------------

	/**
	 * Resets a user's password.  This is the final step for forgotten
	 * passwords.
	 *
	 * @access	public
	 * @param	string	The password reset code
	 * @return	void
	 */
	public function reset_password($code) {
	
		$reset = $this->ion_auth->forgotten_password_complete($code);

		if ($reset) {
			$this->session->set_userdata('success', $this->ion_auth->messages());
			redirect("admin/users/login", 'refresh');
		} else {
			$this->session->set_userdata('error', $this->ion_auth->errors());
			redirect("admin/users/forgot_password", 'refresh');
		}
	}

	// ------------------------------------------------------------------------

	/**
	 * Activate a User
	 *
	 * @access	public
	 * @param	int		The User ID
	 * @param	string	The activation code
	 * @return	void
	 */
	public function activate($id, $code = FALSE)
	{
		group_has_role('users', 'change_status') or access_denied();
		
		$activation = $this->ion_auth->activate($id, $code);

		if ($activation)
		{
			//redirect them to the auth page
			$this->session->set_userdata('success', $this->ion_auth->messages());
			redirect("admin/users", 'refresh');
		}
		else
		{
			$this->session->set_userdata('error', $this->ion_auth->errors());
			redirect("admin/users/forgot_password", 'refresh');
		}
	}

	// ------------------------------------------------------------------------

	/**
	 * Deactivate a User
	 *
	 * @access	public
	 * @param	int		The User ID
	 * @return	void
	 */
	public function deactivate($id = NULL)
	{	
		group_has_role('users', 'change_status') or access_denied();
		
		$id = (int) $id;

		if ($_POST)
		{
			if ($this->_valid_csrf_nonce() === FALSE)
			{
				show_404();
			}
			if ($this->ion_auth->logged_in() AND $this->ion_auth->is_sadmin())
			{
				$this->ion_auth->deactivate($id);
				$this->session->set_userdata('success', 'The user has been deactivated.');
			}
			redirect('admin/users','refresh');
		}

		$this->template->csrf = $this->_get_csrf_nonce();
		$this->template->user = (array) $this->ion_auth->get_user($id);
		$this->template->build('deactivate_user');
	}

	// ------------------------------------------------------------------------

	/**
	 * Create a User
	 *
	 * @access	public
	 * @return	void
	 */
	public function create()
	{
		group_has_role('users', 'create') or access_denied();

		//validate form input
		$this->form_validation->set_rules('first_name', 'First Name', 'required|xss_clean');
		$this->form_validation->set_rules('last_name', 'Last Name', 'required|xss_clean');
		$this->form_validation->set_rules('username', 'Username', 'required|xss_clean');
		$this->form_validation->set_rules('email', 'Email Address', 'required|valid_email');
		$this->form_validation->set_rules('group', 'Group', 'required|xss_clean');
		$this->form_validation->set_rules('password', 'Password', 'required|min_length['.$this->config->item('min_password_length', 'ion_auth').']|max_length['.$this->config->item('max_password_length', 'ion_auth').']|matches[password_confirm]');
		$this->form_validation->set_rules('password_confirm', 'Password Confirmation', 'required');

		if ($this->form_validation->run())
		{
			$username	= $this->input->post('username');
			$email		= $this->input->post('email');
			$password	= $this->input->post('password');
			$group		= $this->input->post('group');

			$additional_data = array(
				'first_name'	=> $this->input->post('first_name'),
				'last_name'	=> $this->input->post('last_name'),
                                'via_ldap'      => 'local',
                                'ldap_data'     => '',        
			);
			if ($this->ion_auth->register($username, $password, $email, $additional_data, $group))
			{
				$this->session->set_userdata('success', 'The user has been created.');
				redirect("admin/users", 'refresh');
			}
		}

		$groups = array();
		foreach ($this->ion_auth->get_groups() as $group)
		{
			$groups[$group->name] = $group->description;
		}

		$this->template
			->set('groups', $groups)
			->build('admin/create');
	}
	
	/**
	 * Edit an existing user
	 *
	 * @param int $id The ID of the user to edit
	 * @return void
	 */
	public function edit($id = 0)
	{
		group_has_role('users', 'edit') or access_denied();
		
		// Get the user's data
		$member = $this->ion_auth->get_user($id);

		// Got user?
		if ( ! $member)
		{
			$this->session->set_userdata('error', $this->lang->line('user_edit_user_not_found_error'));
			redirect('admin/users');
		}

		// Check to see if we are changing emails
		if ($member->email != $this->input->post('email'))
		{
			// TODO Check to make sure changed emails are unique
			// $this->validation_rules[5]['rules'] .= '|callback__email_check';
		}

		// Get the POST data
		$update_data['first_name'] = $this->input->post('first_name');
		$update_data['last_name'] = $this->input->post('last_name');
		$update_data['email'] = $this->input->post('email');
		$update_data['active'] = $this->input->post('active');
		$update_data['group_id'] = $this->input->post('group_id');
		
		// Password provided, hash it for storage
		if ($this->input->post('password'))
		{
			$update_data['password'] = $this->input->post('password');
		}
		
		if ($_POST)
		{
			// Run the validation
			if ($this->user_m->validate($update_data))
			{
				if ($this->ion_auth->update_user($id, $update_data))
				{
					$this->session->set_userdata('success', $this->ion_auth->messages());
				}
				else
				{
					$this->session->set_userdata('error', $this->ion_auth->errors());
				}

				redirect('admin/users');
			}
			else
			{
				// Dirty hack that fixes the issue of having to re-add all data upon an error
				$member = (object) array_merge($member, $_POST);
				$member->full_name = $member->first_name.' '.$member->last_name;
			}
		}
		
		$groups = array();
		foreach ($this->ion_auth->get_groups() as $group)
		{
			$groups[$group->id] = $group->description;
		}

		$this->template
			->title($this->module_details['name'], sprintf(lang('user_edit_title'), $member->first_name.' '.$member->last_name))
			->set('member', $member)
			->set('groups', $groups)
			->build('admin/form');
	}

	// ------------------------------------------------------------------------

	/**
	 * Creates a CSRF nonce to stop CSRF attacks
	 *
	 * @return	array
	 */
	private function _get_csrf_nonce()
	{
		$this->load->helper('string');

		$key	= random_string('alnum', 8);
		$value	= random_string('alnum', 20);
		$this->session->set_userdata('csrfkey', $key);
		$this->session->set_userdata('csrfvalue', $value);

		return array($key=>$value);
	}

	// ------------------------------------------------------------------------

	/**
	 * Check if the CSRF nonce exists and is valid
	 *
	 * @return	bool
	 */
	private function _valid_csrf_nonce() {
           return true;
	}               
}
