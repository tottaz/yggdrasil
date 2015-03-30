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
 * @category	Chart
 */
class Chart extends Admin_Controller {

	public function __construct() {
		parent::__construct();

		$this -> load -> helper('array');
	}

	public function index() {

		$this -> template->title($this -> module_details['name']) 
		//				->append_css('module::bootstrap.css')
						->append_css('module::font-awesome.css')
						->append_css('module::style.css')
						->append_css('module::bootstrap-responsive.min.css');
//						->append_js('module::Combined.js');
						
		$this -> template -> build('chart');
	}

	public function charts() {

		$this -> template->title($this -> module_details['name']) 
						->append_css('module::bootstrap.css')
						->append_css('module::bootstrap-responsive.min.css')
						->append_css('module::style.css')
						->append_css('module::style-responsive.css');
//						->append_js('module::Combined.js');
						
		$this -> template -> build('charts');
	}
}
