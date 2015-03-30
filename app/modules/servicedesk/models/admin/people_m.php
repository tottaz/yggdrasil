<?php

class Programme_m extends App_Model 
{
	
	/**
     * @var	string	The name of the clients table
     */
	protected $table = 'programmes';

	// Get all media_contacts from the database
	public function get_all_programme() 
	{

		return $this->db
			->select("id as id, title", false)
			->order_by('id','asc')
			->get('programmes')
			->result_array();
	}
			
	// Add a new media_contacts
	public function add_programme($user, $programme) 
	{
		// Check to see if the name already exists
		if ($query = $this->db->get_where('programmes', Array('title' => $programme))) {
			if ($row = $query->row_array()) {
				// Return existing id
				return $row['id'];
			} else {
				// Create new entry
				if ($this->db->insert('programmes', Array(
					'title' => $programme,
					'date_created' => time()
					))) 
				{
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
	public function edit_programme($id, $user, $programme) {
		if ($this->db->update('programmes', Array(
			'title' => $programme
			), Array('id' => $id))) {
			
			return true;
		} else {
			return false;
		}
	}
	
	// Get a media_contacts
	public function get_programme($id) {
		if ($query = $this->db->get_where('programmes', Array('id' => $id))) {	
			return $query->row_array();
		} else {
			return false;
		}
	}
	
	// Remove a media_contacts
	public function delete_programme($id) {
		if ($this->db->delete('programmes', Array('id' => $id))) {	
			return true;
		} else {
			return false;
		}
	}
}
?>