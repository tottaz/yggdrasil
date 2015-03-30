<?php

class Department_m extends App_Model {
	/**
     * @var	string	The name of the clients table
     */
	protected $table = 'departments';

	// Get all campaigns from the database
	public function get_departments() 
	{
		return $this->db->select('department_id, department_name', false)
			->order_by('department_name')
			->get('departments')
			->result_array();
	}
			
	// Add a new campaign
	public function add_department($user, $campaign) {
		// Check to see if the name already exists
		if ($row = $this->db->get_where('departments', Array('title' => $department))->result_array()) {
		// Return existing id
		return $row['id'];
		} else {
			// Create new entry
			if ($this->db->insert('departments', Array(
				'user' => $user,
				'title' => $department,
				'date_created' => time()
				))) {
			
				return $this->db->insert_id();
			} else {
				return false;
			}
		}
		return false;
	}
	
	// Edit a department
	public function edit_department($id, $user, $department) {

		$this->db->where(array(
			'department_id' => $id
		));

		return $this->db->update('departments', Array(
			'user' => $user,
			'title' => $department
			));
	}
	
	// Get a department
	public function get_department($id) {
		return $this->db->get_where('departments', Array('department_id' => $id))->result_array();
	}
	
	// Remove a department
	public function delete_department($id) {
		
		return $this->db->delete('departments', Array('department_id' => $id));
	}
}
?>