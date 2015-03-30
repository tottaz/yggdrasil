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
 * @category	Calendar
 */
class Calendar extends Admin_Controller {

	public function __construct() {
		parent::__construct();

		$this -> load -> helper('array');
	}

	public function index() {

		$this -> template->title($this -> module_details['name']) 
		//				->append_css('module::bootstrap.css')
						->append_css('module::font-awesome.css')
						->append_css('module::style.css')
						->append_css('module::fullcalendar.css')
						->append_css('module::fullcalendar.print.css')
						->append_css('module::bootstrap-responsive.min.css')
						->append_js('module::jquery.js')
						->append_js('module::bootstrap.js')
						->append_js('module::jquery.custom.min.js')
						->append_js('module::fullcalendar.min.js')
						->append_js('module::calendar.js');
						
		$this -> template -> build('calendar');
	}

	public function scalendar() {

		$this -> template->title($this -> module_details['name']) 
		//				->append_css('module::bootstrap.css')
						->append_css('module::bootstrap-responsive.min.css')
						->append_css('module::style.css')
						->append_css('module::style-responsive.css');
						
		$this -> template -> build('scalendar');
	}
}
