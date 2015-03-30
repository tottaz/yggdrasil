<?php  defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * Ananas  
 *
 * A simple, fast, contact and software licenses software
 *
 * @package		Ananas
 * @author		Ananas Dev Team
*/
class Servicedesk_m extends App_Model {

		// here you should place all your functions
		var $date;
		var $asset_name;
		var $asset_type;
		var $asset_price;
		var $asset_department;
		var $asset_serial_no;
		var $asset_vendor;

		function __construct()
		{
			parent::__construct();
		}

		//returns an array with data
		function get($request){
			$query = $this->db->get("it_servicedesk_data");
			return $query->result_array();
		}
		
		//the function takes values of the row data
		protected function get_values($action){
			$this->date				= $action->get_value("date");
			$this->asset_name		= $action->get_value("asset_name");
			$this->asset_type		= $action->get_value("asset_type");
			$this->asset_price		= $action->get_value("asset_price");
			$this->asset_department	= $action->get_value("asset_department");
			$this->asset_serial_no	= $action->get_value("asset_serial_no");
			$this->asset_vendor		= $action->get_value("asset_vendor");
		}
		
		//insets a new record
		function insert($action, $skip_validation = false){
			$this->get_values($action);
		
			if ($this->validate($action)){ 
				$this->db->insert("it_servicedesk_data", $this);
				$action->success($this->db->insert_id());
			}
		}
		
		//updates an event
		function update($action, $data = 0, $skip_validation = false){
			$this->get_values($action);
		
			if ($this->validate($action)){ 
				$this->db->update("it_servicedesk_data", $this, array("servicedesk_id" => $action->get_id()));
				$action->success();
			}
		}
		
		// validate an record before saving
		function validate($action){
			if ($this->date == ""){
				$action->invalid();
				$action->set_response_attribute("details","Empty text is not allowed");
		
				return false;
			}
			return true;
		}
		
		//deletes an event
		function delete($action){
			$this->db->delete("it_servicedesk_data", array("servicedesk_id" => $action->get_id()));
			$action->success();
		}
		
		public function get_servicedesk_data() {
		
			return $this->db
				->select("date, total_mb, total_hits, http_total_mb", false)
				->order_by('date asc')
				->get('it_servicedesk_data')
				->result_array();
		}
		
		public function get_servicedesk_total_mb() {
		
			return $this->db
				->select("date, http_total_mb", false)
				->order_by('date asc')
				->get('it_servicedesk_data')
				->result_array();
		}
		
		public function get_servicedesk_m95() {
		
			return $this->db
				->select("date, m95_mbps", false)
				->order_by('date asc')
				->get('it_servicedesk_data')
				->result_array();
		}
		
		public function get_servicedesk_totalhits() {
		
			return $this->db
				->select("date, total_hits", false)
				->order_by('date asc')
				->get('it_servicedesk_data')
				->result_array();
		}
		
		
		public function get_servicedesk_data_record($id) {
		
			return $this->db
				->select('*', false)
				->where('servicedesk_id', $id)
				->get('it_servicedesk_data')
				->row_array();
			}
		}