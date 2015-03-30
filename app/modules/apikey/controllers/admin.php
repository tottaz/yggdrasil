<?php

defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * Emily
 *
 * A simple, fast, contact and software licenses software
 *
 * @package		Emily
 * @author		Emily Dev Team
// ------------------------------------------------------------------------

/**
 * The admin controller for Settings
 *
 * @subpackage	Controllers
 * @category	Settings
 */
class Admin extends Admin_Controller {

    function __construct() {
        parent::__construct();

        if (!is_sadmin()) {
            show_error('Access Denied. You are not an admin. Get out of here.');
        }
    }

    /**
     * Lets the user edit the settings
     *
     * @access	public
     * @return	void
     */
    public function index($action = '') {
        $this->load->library('form_validation');
        $this->load->model('key_m');
            
        // API Keys
        if ($this->input->post('key_key') AND $this->input->post('key_note')) {
            $this->key_m->update_keys($this->input->post('key_key'), $this->input->post('key_note'));
        }
        if ($this->input->post('new_key')) {
            $this->key_m->insert_keys($this->input->post('new_key'), $this->input->post('new_key_note'));
        }

        unset($_POST['key_key'], $_POST['key_note'], $_POST['new_key'], $_POST['new_key_note']);                        
        
        $this->template->api_keys = $this->key_m->get_all();
        
        $this->template->build('index');
    }
}