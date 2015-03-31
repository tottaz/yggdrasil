<?php  defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * Ananas  
 *
 * A simple, fast, contact and software licenses software
 *
 * @package		Ananas
 * @author		Ananas Dev Team
*/
class Grid_m extends App_Model {

		// here you should place all your functions
		var $date;
		var $total_mb;
		var $m95_mbps;
		var $peak_mbps;
		var $total_hits;
		var $http_total_mb;
		var $stream_total_mb;

		function __construct()
		{
			parent::__construct();
		}

		//returns an array with data
		function get($request){
			$query = $this->db->get("it_cdn_data");
			return $query->result_array();
		}
		
		//the function takes values of the row data
		protected function get_values($action){
			$this->date				= $action->get_value("date");
			$this->total_mb			= $action->get_value("total_mb");
			$this->m95_mbps			= $action->get_value("m95_mbps");
			$this->peak_mbps		= $action->get_value("peak_mbps");
			$this->total_hits		= $action->get_value("total_hits");
			$this->http_total_mb	= $action->get_value("http_total_mb");
			$this->stream_total_mb	= $action->get_value("stream_total_mb");
		}
		
		//insets a new record
		function insert($action, $skip_validation = false){
			$this->get_values($action);
		
			if ($this->validate($action)){ 
				$this->db->insert("it_cdn_data", $this);
				$action->success($this->db->insert_id());
			}
		}
		
		//updates an event
		function update($action, $data = 0, $skip_validation = false){
			$this->get_values($action);
		
			if ($this->validate($action)){ 
				$this->db->update("it_cdn_data", $this, array("cdn_id" => $action->get_id()));
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
			$this->db->delete("it_cdn_data", array("cdn_id" => $action->get_id()));
			$action->success();
		}
		
		public function get_cdn_data() {
		
			return $this->db
				->select("date, total_mb, total_hits, http_total_mb", false)
				->order_by('date asc')
				->get('it_cdn_data')
				->result_array();
		}
		
		public function get_cdn_total_mb() {
		
			return $this->db
				->select("date, http_total_mb", false)
				->order_by('date asc')
				->get('it_cdn_data')
				->result_array();
		}
		
		public function get_cdn_m95() {
		
			return $this->db
				->select("date, m95_mbps", false)
				->order_by('date asc')
				->get('it_cdn_data')
				->result_array();
		}
		
		public function get_cdn_totalhits() {
		
			return $this->db
				->select("date, total_hits", false)
				->order_by('date asc')
				->get('it_cdn_data')
				->result_array();
		}
		
		
		public function get_cdn_data_record($id) {
		
			return $this->db
				->select('*', false)
				->where('cdn_id', $id)
				->get('it_cdn_data')
				->row_array();
			}
		}