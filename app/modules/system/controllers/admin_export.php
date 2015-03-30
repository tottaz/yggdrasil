<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 *
 * Export SQL Admin controller for the System module
 * 
 * @author 	
 * @link	
 */
class Admin_export extends Admin_Controller
{
	protected $section = 'export';

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
	 * Run a Query and display the results
	 *
	 * @access	public
	 * @return 	void
	 */
	public function index()
	{
		// Do SQL export
		if ($this->input->post())
		{
			$this->load->dbutil();

			// Filename
			if ( ! $filename = $this->input->post('filename'))
			{
				$filename = 'dbbackup_'.date('Ymd').'.sql';
			}

			// Can't find a way around this.
			switch($this->input->post('newline'))
			{
				case 'n':
					$newline = "\n";
					break;
				case 'r':
					$newline = "\r";
					break;
				case 'r_n':
					$newline = "\r\n";
					break;
				default:
					$newline = "\n";
			}

			$backup_prefs = array(
				'tables'      => $this->input->post('action_to'),
				'format'      => $this->input->post('format'),
				'filename'	  => $filename,
				'add_drop'    => $this->input->post('add_drop'),
				'add_insert'  => $this->input->post('add_insert'),
				'newline'     => $newline
			);


			$this->load->helper('download');
			force_download($filename.'.'.$this->input->post('format'), $this->dbutil->backup($backup_prefs));
		}

		$data = array();

		$this->load->helper(array('form', 'number'));

		// Dropdown options
		$data['file_formats'] = array('gzip' => 'gzip', 'zip' => 'zip', 'txt' => 'txt');
		$data['true_false'] = array(1 => lang('global:yes'), 0 => lang('global:no'));
		$data['newlines'] = array('n' => '\n', 'r' => '\r', 'r_n' => '\r\n');

		// Get the tables
		$data['tables'] = $this->db->query('SHOW TABLE STATUS')->result();			

		$this->template->build('admin/export_options', $data);	
	}
}