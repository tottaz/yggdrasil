<?php

defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * Emily
 *
 * A simple, fast, contact and software licenses software
 *
 * @package		Emiily
 * @author		Emily Dev Team
 */
// ------------------------------------------------------------------------

/**
 * The User Model
 *
 * @subpackage	Models
 * @category	agents
 */
class Ranks_m extends App_Model {
	
	protected $table = 'rank';

	public function __construct() {
		global $config;
		$this -> load -> model('Data');
		$this -> load -> helper('array');
		$config = $this -> Data -> get_config_by_id();
//		$this -> load -> database('default', 'db');
		// load database in config
	}

	function get_all_updates() 
	{
		return $types = $this -> db -> get('rank') -> result_array();
	}
	
	function ranks_sync($record) 
	{
	// -----------------------------------------------------------------------
		// http://dev.mysql.com/doc/refman/5.0/en/insert-on-duplicate.html
		//

		$CI =& get_instance();
		$connection = $CI->db->conn_id;
		
		$record['abbrev_rank'] = mysqli_real_escape_string($connection, $record['abbrev_rank']); 
		$record['rank'] = mysqli_real_escape_string($connection, $record['rank']);
		$record['default_username'] = mysqli_real_escape_string($connection, $record['default_username']); 
		
		$query = "INSERT INTO `rank` (`id`, `rank`, `sortorder`, `abbrev_rank`, `type`, `default_username`) VALUES
					('" . $record['id'] . "', 
					'" . addslashes($record['rank']) . "', 
					'" . $record['sortorder'] . "', 
					'" . addslashes($record['abbrev_rank']) . "',
					'" . $record['type'] . "',
					'" . addslashes($record['default_username']) . "')
					ON DUPLICATE KEY UPDATE 
					id = '" . $record['id'] . "',
					rank = '" . $record['rank'] . "',
					sortorder = '" . $record['sortorder'] . "',
					abbrev_rank = '" . $record['abbrev_rank'] . "',
					type = '" . $record['type'] . "',
					default_username = '" . $record['default_username'] . "'";
		$this -> db -> query($query);
	}
}
