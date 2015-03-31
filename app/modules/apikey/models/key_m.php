<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * Yggdrasil
 *
 * A simple, fast, contact and software licenses software
 *
 * @package		Yggdrasil
 * @author		Yggdrasil Dev Team
// ------------------------------------------------------------------------

/**
 * The Key Model
 *
 * @subpackage	Models
 * @category	Key
 */
class Key_m extends App_Model {
	/**
	 * @var string	The name of the settings table
	 */
	protected $table = 'keys';

	/**
	 * @var bool	Tells the model to skip auto validation
	 */
	protected $skip_validation = TRUE;
	
	public function update_keys($keys, $notes) {
		$this->db->trans_begin();

		foreach ($keys as $id => $key) {
			// Missing key
			if ( ! $key) {
				$this->db->delete($this->table, array('id' => $id));
			}
			
			$this->db->where('id', $id)->update($this->table, array(
				'key' => $key,
				'note' => $notes[$id], 
			));
		}

		if ($this->db->trans_status() === FALSE) {
			$this->db->trans_rollback();
			return FALSE;
		}

		$this->db->trans_commit();
		return TRUE;
	}

	public function insert_keys($keys, $notes) {
		$this->db->trans_begin();

		foreach ($keys as $id => $key) {
			if ($key) {
				$this->db->insert($this->table, array(
					'key' => $key,
					'note' => $notes[$id],
					'level' => 0,
					'date_created' => now(),
				));
			}
		}

		if ($this->db->trans_status() === FALSE) {
			$this->db->trans_rollback();
			return FALSE;
		}

		$this->db->trans_commit();
		return TRUE;
	}
}