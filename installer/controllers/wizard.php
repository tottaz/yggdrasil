<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * Greengarden
 *
 * @package		Greengarden
 * @author		Greengarden Dev Team
 * @copyright	Copyright (c) 2010, Greengarden
 * @since		Version 1.0
 */

// ------------------------------------------------------------------------

/**
 * The install wizard controller
 *
 * @subpackage	Controllers
 * @category	Wizard
 */
class Wizard extends CI_Controller {

	/**
	 * @var	string	The path to the config folder
	 */
	private $config_path;

	/**
	 * @var	string	The path to the uploads folder
	 */
	private $upload_path;

	// ------------------------------------------------------------------------

	public function __construct()
	{
		parent::__construct();
		$this->config_path = FCPATH.'app/config';
		$this->upload_path = FCPATH.'uploads/';
		
		include_once FCPATH.'app/libraries/Asset.php';
		Asset::add_path(APPPATH.'assets/', BASE_URL);
		Asset::set_asset_url(BASE_URL);
	}

	public function index()
	{
		$this->session->set_userdata('last_step', '0');
		$this->_output_step('steps/welcome');
	}

	public function step1()
	{
		$data['config_writable'] = is_really_writable($this->config_path) ? TRUE : FALSE;
		$data['upload_writable'] = is_really_writable($this->upload_path) ? TRUE : FALSE;
		$data['curl_installed'] = function_exists('curl_init');
		$data['php_version'] = (phpversion() >= 5.2);
		$data['can_continue'] = ($data['config_writable'] AND $data['upload_writable'] AND $data['php_version'] AND $data['curl_installed']);
		if ($data['can_continue'])
		{
			$this->session->set_userdata('last_step', '1');
		}
		$this->_output_step('steps/step1', $data);
	}

	public function step2()
	{
		if ($this->session->userdata('last_step') != '1')
		{
			redirect('wizard/step1');
		}
		$data['hostname']	= $this->input->post('hostname');
		$data['database']	= $this->input->post('database');
		$data['dbprefix']	= $this->input->post('dbprefix') ? $this->input->post('dbprefix') : '';
		$data['username']	= $this->input->post('username');
		$data['password']	= $this->input->post('password');
		$data['port']		= $this->input->post('port');
		if ($_POST)
		{
			$data['port'] = ( ! $data['port']) ? '3306' : $data['port'];

			$link = @mysql_connect($data['hostname'].':'.$data['port'], $data['username'], $data['password'], TRUE);

            if ($link)
			{
                // If the database is not there create it
                mysql_query('CREATE DATABASE IF NOT EXISTS '.$data['database'], $link);
            }
			
			if ($link AND @mysql_select_db($data['database'], $link))
			{
				$this->session->set_userdata('hostname', $data['hostname']);
				$this->session->set_userdata('username', $data['username']);
				$this->session->set_userdata('database', $data['database']);
				$this->session->set_userdata('dbprefix', $data['dbprefix']);
				$this->session->set_userdata('username', $data['username']);
				$this->session->set_userdata('password', $data['password']);
				$this->session->set_userdata('port', $data['port']);
				$this->session->set_userdata('last_step', '2');
				redirect('wizard/step3');
			}
			else
			{
				$data['error'] = 'Database Error: '.mysql_error();
			}
		}
		$this->_output_step('steps/step2', $data);
	}

	public function step3()
	{
		$valid = TRUE;
		if ($this->session->userdata('last_step') != '2')
		{
			redirect('wizard/step2');
		}
		$this->load->library('form_validation');

		$this->form_validation->set_rules('first_name', 'First Name', 'required|xss_clean');
		$this->form_validation->set_rules('last_name', 'Last Name', 'required|xss_clean');
		$this->form_validation->set_rules('username', 'Username', 'required|xss_clean');
		$this->form_validation->set_rules('notify_email', 'Notify Email', 'required|valid_email');
		$this->form_validation->set_rules('password', 'Password', 'required|min_length[5]|max_length[20]|matches[password_confirm]');
		$this->form_validation->set_rules('password_confirm', 'Password Confirmation', 'required');

		if ($this->form_validation->run())
		{
			$this->session->set_userdata('install_data', $_POST);
			$this->session->set_userdata('last_step', '3');
			redirect('wizard/complete', 'refresh');
		}
                				
		$this->_output_step('steps/step3');
	}

	public function complete()
	{
		if ($this->session->userdata('last_step') != '3')
		{
			redirect('wizard/step3');
		}

		$this->load->library('installer');

		$data = $this->session->userdata('install_data');
		$data['salt'] = substr(md5(uniqid(rand(), true)), 0, 10);
		$data['password'] = sha1($data['password'] . $data['salt']);

		// This will ensure they won't have to redo the entire install on an error
		if ($this->installer->install($data))
		{
			$this->session->set_userdata('last_step', '0');
		}

		$this->_output_step('steps/complete');
	}

	public function error()
	{
		$this->_output_step('error');
	}

	private function _output_step($view, $data = array())
	{
		$content = $this->load->view($view, $data, TRUE);

		$this->load->view('template', array('content' => $content));
	}
}

/* End of file wizard.php */