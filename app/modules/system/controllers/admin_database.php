<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 *
 * Index controller - view basic table stats.
 * 
 * @author 	
 * @link	
 */
class Admin_database extends Admin_Controller
{
	protected $section = 'database';

	// --------------------------------------------------------------------------	

	/**
	 * Constructor method
	 *
	 * @access public
	 * @return void
	 */
	public function __construct()
	{
		parent::__construct();
		
		$this->load->language('database');
	}

	// --------------------------------------------------------------------------	
	
	/**
	 * Show general table stats
	 *
	 * @access	public
	 */
	public function index()
	{
		// -------------------------------------
		// Get basic info
		// -------------------------------------

 		$CI =& get_instance();
        //$CI->load->database();
		$connection = $CI->db->conn_id;

		$raw_stats = explode('  ', mysqli_stat($connection));

		$data = array();

		$data['stats'] = array();
		
		foreach ($raw_stats as $stat)
		{
			$break = explode(':', $stat);
			
			$data['stats'][trim($break[0])] = 	trim($break[1]);		
		}

		// -------------------------------------
		// Get Processes
		// -------------------------------------
	
		$this->load->helper('number');
	
		$data['processes'] = $this->db->query('SHOW PROCESSLIST')->result();
				
		// -------------------------------------
		$this->template->connection = $connection;
		$this->template->build('admin/overview', $data);
	}	
}