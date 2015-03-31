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
		
class Itreports extends Admin_Controller {
			
		public function beforeRender($action){
			// formatting data before output
			// $date = date("YYYY-mm-dd", strtotime($action->get_value("date")));
			// $action->set_value("date", $date);
		}
		
		public function beforeUpdate($action){
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

			$this->load->model("Grid_m");

			$this->template->total_mb = $this->Grid_m->get_cdn_total_mb();
			$this->template->m95 = $this->Grid_m->get_cdn_m95();
			$this->template->total_hits = $this->Grid_m->get_cdn_totalhits();
			$this->template->build('cdn');
		}

		// here you should place all your functions
		public function googlecp()
		{
			$this->template->build('googlecp');
		}

		public function cdngrid()
		{
			$this->template->build('cdngrid');
		}

		public function cdn() {

			$this->load->model("Grid_m");
			
			$this->template->total_mb = $this->Grid_m->get_cdn_total_mb();
			$this->template->m95 = $this->Grid_m->get_cdn_m95();
			$this->template->total_hits = $this->Grid_m->get_cdn_totalhits();
			
			// Load the views
			$this->template->build('cdn');
		}

		public function data()
		{
			//data feed
			$this->load->database();
			$this->load->model("Grid_m");
			
			$connector = new GridConnector($this->db, "phpCI");
			$connector->configure("default_it_cdn_data", "cdn_id", "date, total_mb,
									m95_mbps, peak_mbps, total_hits, http_total_mb, stream_total_mb");
			$connector->useModel($this->Grid_m);
			$connector->event->attach($this);
			$connector->render();
		}

		public function options()
		{
			//data feed
			$this->load->database();
			$this->load->model("Grid_m");
			
			$connector = new GridConnector($this->db, "phpCI");
			$connector->configure("id", "title");
			$connector->useModel($this->Grid_m);
			$connector->event->attach($this);
			$connector->render();
		}
	}