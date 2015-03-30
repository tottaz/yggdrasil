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
 * The admin controller for the dashboard
 *
 * @subpackage	Controllers
 * @category	Dashboard
 */
class Dashboard extends Admin_Controller {

	public function __construct() {
		parent::__construct();

		$this -> load -> helper('array');
	}

	public function index() {

		$this -> template->title($this -> module_details['name']) 
						->append_css('module::droptiles.css') 
						->append_js('module::Combined.js');
		$this -> template -> build('dashboard');
	}

	public function sdashboard() {


        $this->load->model('Data');

        // get the config values
        $config = $this->Data->get_config_by_id();

        $this->load->helper('array');

        $onboard = $this->Data->onboard($config['shipid']);
        $expected = $this->Data->expected_onboard($config['shipid']);
        $birthdays = $this->Data->upcoming_birthdays($config['shipid']);

//       $data['graph'] = $this->Data->get_graph_date();        
//        $this->template->graph = $data;
        $this->template->onboard = $onboard;
        // $this->template->expected = $expected;
        $this->template->birthdays = $birthdays;
        $this->template->build('sdashboard');
    }

    public function rdashboard() {

        $this -> template->title($this -> module_details['name']) 
                        ->append_css('module::bootstrap.css')
                        ->append_css('module::font-awesome.css')
                        ->append_css('module::style.css')
                        ->append_css('module::prettify.css')
                        ->append_css('module::bootstrap-wysihtml5.css')
                        ->append_css('module::doc.css')
                        ->append_css('module::bootstrap-responsive.min.css')
//                        ->append_js('module::jquery.js')
//                        ->append_js('module::bootstrap.js')
                        ->append_js('module::ui.js');

        $this->template->build('rdashboard');
    }

    public function tdashboard() {

        $this -> template->title($this -> module_details['name']) 
//                        ->append_css('module::bootstrap.css')
                        ->append_css('module::bootstrap-responsive.min.css')
                        ->append_css('module::tstyle.css')
                        ->append_css('module::style-responsive.css');

        $this->template->build('tdashboard');
    }
}
