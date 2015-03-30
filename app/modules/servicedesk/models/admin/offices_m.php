<?php

class Offices_m extends App_Model {
    
    /**
     * @var	string	The name of the clients table
     */
    protected $table = 'offices';

	// Get all offices
	public function get_all_offices($select = '*') 
	{
		return $this->db
			->select($select, false)
			->order_by('title')
			->get('offices')
			->result_array();
	}
	
	// Get one office by id
	public function get_office($id, $select) 
	{
		return $this->db
			->select($select, false)
			->where('id', $id)
			->get('offices')
			->row_array();
	}
	
	// Create an office
	public function create_office($title, $user = 0) 
	{
		if ($this->db->insert('offices', Array(
			'title' => $title,
			'user' => $user,
			'date_created' => time()
			))) {
			
			return $this->db->insert_id();
		}
		else {
			return false;
		}
	}
	
	// Change an office
	public function change_office($id, $title, $user = 0) 
	{
		$this->db->where(array(
			'id' => $id,
		));
		return ($this->db->update('offices', Array(
			'title' => $title,
			'user' => $user
			), Array('id' => $id)));
	}
	
	// Remove an office
	public function remove_office($id) 
	{
		
		return ($this->db->delete('offices', Array('id' => $id)));
	}
}
?>