<?php defined('BASEPATH') or exit('No direct script access allowed');

/**
 * Ananas  
 *
 * A simple, fast, development framework for web applications and software licenses software
 *
 * @package		Ananas
 * @author		Ananas Dev Team
// ------------------------------------------------------------------------
*/

class Settings_m extends App_Model {

    
        protected $table = 'settings';
        
	/**
	 * Get
	 *
	 * Gets a setting based on the $where param.  $where can be either a string
	 * containing a slug name or an array of WHERE options.
	 *
	 * @access	public
	 * @param	mixed	$where
	 * @return	object
	 */
	public function get($where)
	{
		if ( ! is_array($where))
		{
			$where = array('slug' => $where);
		}

		return $this->db
			->select('*, IF(`value` = "", `default`, `value`) as `value`', FALSE)
			->where($where)
			->get($this->table)
			->row();
	}

	/**
	 * Get Many By
	 *
	 * Gets all settings based on the $where param.  $where can be either a string
	 * containing a module name or an array of WHERE options.
	 *
	 * @access	public
	 * @param	mixed	$where
	 * @return	object
	 */
	public function get_many_by($where = array())
	{
		if ( ! is_array($where))
		{
			$where = array('module' => $where);
		}

		return $this
			->select('*, IF(`value` = "", `default`, `value`) as `value`', FALSE)
			->where($where)
			->order_by('`order`', 'DESC')
			->get_all();
	}

	/**
	 * Update
	 *
	 * Updates a setting for a given $slug.
	 *
	 * @access	public
	 * @param	string	$slug
	 * @param	array	$params
	 * @return	bool
	 */
	public function update($slug = '', $params = array(), $skip_validation = false)
	{
		return $this->db->update($this->table, $params, array('slug' => $slug));
	}

	/**
	 * Sections
	 *
	 * Gets all the sections (modules) from the settings table.
	 *
	 * @access	public
	 * @return	array
	 */
	public function sections()
	{
		$sections = $this->select('module')
			->distinct()
			->where('module != ""')
			->get_all();

		$result = array();

		foreach ($sections as $section)
		{
			$result[] = $section->module;
		}
		return $result;
	}
}