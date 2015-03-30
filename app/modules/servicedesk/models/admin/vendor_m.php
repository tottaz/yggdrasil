<?php

class Vendor_m extends App_Model {

	/**
	 * @var	string	The name of the clients table
	 */
	protected $table = 'vendors';

	// Get all vendor from the database
	public function get_vendors() 
	{
		return $this -> db -> select('vendor_id, vendor_name', false) -> order_by('vendor_name') -> get('vendors') -> result_array();
	}

	// Add a new journalist
	public function add_vendor($user, $vendor) 
	{
		// Check to see if the name already exists
		if ($row = $this -> db -> get_where('vendors', Array('name' => $vendor)) -> result_array()) {
			// Return existing id
			return $row['id'];
		} else {
			if ($this -> db -> insert('vendors', Array('user' => $user, 'vendor_name' => $vendor, 'date_created' => time()))) {
				return $this -> db -> insert_id();
			} else {
				return false;
			}
		}
		return false;
	}

	// Edit a journalist
	public function edit_vendor($id, $user, $name) {

		$this -> db -> where(array('id' => $id, ));

		return ($this -> db -> update('vendors', Array('user' => $user, 'vendor_name' => $name)));
	}

	// Get a journalist
	public function get_vendor($id) {

		return $this -> db -> get_where('vendors', Array('vendor_id' => $id));

	}

	// Remove a journalist
	public function delete_vendor($id) {

		return $this -> db -> delete('it_servicedesk_vendor', Array('id' => $id));
	}

}
?>