<?php

class Feedtype_m extends App_Model {

/**
	* @var	string	The name of the clients table
	*/
	protected $table = 'feedtypes';

	// Get all media_contacts from the database
	public function get_feedtypes() {

			return $this->db
				->select("id as id, title", false)
				->order_by('id','asc')
				->get('feedtypes')
				->result_array();
	}
			
	// Add a new media_contacts
	public function add_feedtype($feed, $issue) {

		// Check to see if the name already exists
		if ($query = $this->db->get_where('feedtypes', Array('title' => $issue))) {
			if ($row = $query->row_array()) {
				// Return existing id
				return $row['id'];
			} else {
				// Create new entry
				if ($this->db->insert('feedtypes', Array(
					'title' => $issue,
					'date_created' => time()
					))) {
					return $this->db->insert_id();
				} else {
					return false;
				}
			}
		} else {
			return false;
		}
	}
	
	// Edit a media_contacts
	public function edit_feedtype($id, $user, $issue) {
		if ($this->db->update('feedtypes', Array(
			'title' => $issue
			), Array('id' => $id))) 
		{
			return true;
		} else {
			return false;
		}
	}
	
	// Get a media_contacts
	public function get_feedtype($id) {
		if ($query = $this->db->get_where('feedtypes', Array('id' => $id))) {	
			return $query->row_array();
		} else {
			return false;
		}
	}
	
	// Remove a media_contacts
	public function delete_feedtype($id) {
		if ($this->db->delete('feedtypes', Array('id' => $id))) {	
			return true;
		} else {
			return false;
		}
	}
}
?>