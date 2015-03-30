<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * Maintain a central list of keywords to label and organize your content.
 *
*
* Ananas  
*
* A simple, fast, development framework for web applications and software licenses software
*
* @package		Ananas
* @author		Ananas Dev Team
// ------------------------------------------------------------------------
*/
		require_once("third_party/modules/dhtmlx/connector/grid_connector.php");
		require_once("third_party/modules/dhtmlx/connector/combo_connector.php");
		require_once("third_party/modules/dhtmlx/connector/db_phpci.php");
		DataProcessor::$action_param ="dhx_editor_status"; 
		
class Servicedesk extends Admin_Controller 
{

	public function __construct() {
		parent::__construct();
		$this->load->language('servicedesk');
	}
	
	public function beforeRender($action)
	{
		// formatting data before output
		// $date = date("YYYY-mm-dd", strtotime($action->get_value("date")));
		// $action->set_value("date", $date);
	}
	
	public function beforeUpdate($action)
	{
		//validation before saving
		if ($action->get_value("date") == "")
		{
			$action->invalid();
			$action->set_response_attribute("details", "Empty data not allowed");
		}
	}
	
	// here you should place all your functions
	public function index()
	{

		$this->load->model("Servicedesk_m");

		$this->template->total_mb = $this->Servicedesk_m->get_servicedesk_total_mb();
		$this->template->m95 = $this->Servicedesk_m->get_servicedesk_m95();
		$this->template->total_hits = $this->Servicedesk_m->get_servicedesk_totalhits();
		$this->template->build('servicedesk');
	}

	// here you should place all your functions
	public function googlecp()
	{
		$this->template->build('googlecp');
	}

	public function servicedeskgrid()
	{
		$this->template->build('servicedeskgrid');
	}

	public function servicedeskd() 
	{
		$this->load->model("Servicedesk_m");
		
		$this->template->total_mb = $this->Servicedesk_m->get_servicedesk_total_mb();
		$this->template->m95 = $this->Servicedesk_m->get_servicedesk_m95();
		$this->template->total_hits = $this->Servicedesk_m->get_servicedesk_totalhits();
		
		// Load the views
		$this->template->build('servicedesk');
	}

	public function data()
	{
		//data feed
		$this->load->database();
		$this->load->model("Servicedesk_m");
		
		$connector = new GridConnector($this->db, "phpCI");
		$connector->configure("it_servicedesk_data", "servicedesk_id", "date, asset_name,
								asset_type, asset_price, asset_department, asset_serial_no, asset_vendor");
		$connector->useModel($this->Servicedesk_m);
		$connector->event->attach($this);
		$connector->render();
	}

	public function options()
	{
		//data feed
		$this->load->database();
		$this->load->model("Servicedesk_m");
		
		$connector = new GridConnector($this->db, "phpCI");
		$connector->configure("id", "title");
		$connector->useModel($this->Servicedesk_m);
		$connector->event->attach($this);
		$connector->render();
	}
		
	public function department_data()
	{
		//data feed
		$this->load->database();
		$combo = new ComboConnector($this->db, "phpCI");
		$combo->render_sql("SELECT * FROM departments order by department_name asc","department_id","department_name");
		$action->success();
	}
	
	public function type_data()
	{
		//data feed
		$this->load->database();
		$combo = new ComboConnector($this->db, "phpCI");
		$combo->render_sql("SELECT * FROM types order by type asc","type_id","type"); 
		$action->success();
	} 
	
	public function vendor_data()
	{
		//data feed
		$this->load->database();
		$combo = new ComboConnector($this->db, "phpCI");
		$combo->render_sql("SELECT * FROM vendors order by vendor_name asc","vendor_id","vendor_name");
			$action->success();
	}		
		
	}