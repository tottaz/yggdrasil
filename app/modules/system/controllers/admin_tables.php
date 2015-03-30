<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 *
 * Tables controller - reqair/optimize tables and see
 * basic table data.
 * 
 * @author
 */
class Admin_tables extends Admin_Controller
{
	protected $section = 'tables';

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
	 * Show Tables
	 *
	 * With option to repair/optimize.
	 * 
	 * @access	public
	 * @return 	void
	 */
	public function index()
	{
		if ($this->input->post('repair'))
		{
			$this->_perform_operation('repair');
		}
		elseif ($this->input->post('optimize'))
		{
			$this->_perform_operation('optimize');
		}

		$data = array();
	
		$this->load->helper(array('form', 'number'));
	
		$data['tables'] = $this->db->query('SHOW TABLE STATUS')->result();	
				
		$this->template->build('admin/list_tables', $data);
	}

	// --------------------------------------------------------------------------	

	/**
	 * View a Table
	 *
	 * @access	public
	 * @return 	void
	 */
	public function table()
	{
		$this->load->helper('number');

		$table_name = $this->uri->segment(5);

		// Is this a core table?
		if ($is_core = substr($table_name, 0, 5) == 'core_')
		{
			$this->db->set_dbprefix('core_');
		}
		
		if ( ! $table_name or ! $this->db->table_exists($table_name))
		{
			show_error(lang('pyrodb.invalid_table_name'));
		}
	
		// -------------------------------------
		// Get field data
		// -------------------------------------

		$data = array();

		$data['fields'] = $this->db->field_data($table_name);
		$data['table_name'] = $table_name;

		if ($is_core) $this->db->set_dbprefix(SITE_REF.'_');

		$this->template->build('admin/list_table_structure', $data);
	}

	// --------------------------------------------------------------------------	
	
	/**
	 * Perform an operation (repair or optimize)
	 *
	 * @access	private
	 * @return 	void
	 */
	private function _perform_operation($type)
	{
		// -------------------------------------
		// Easy out if there ain't no data
		// -------------------------------------

		if ( ! $this->input->post('action_to'))
		{	
			$this->session->set_flashdata('notice', lang('pyrodb:must_select_table'));
			redirect('admin/system/tables');
		}

		// -------------------------------------
		// Repair/Optimize the Tables
		// -------------------------------------

		if ($type == 'repair')
		{
			$action = 'repair_table';
			$lang 	= 'repaired';
		}
		else
		{
			$action = 'optimize_table';
			$lang	= 'optimized';
		}
		
		$this->load->dbutil();
		
		$outcome = lang('pyrodb:following_tables')." $lang:\n\n";
	
		foreach ($this->input->post('action_to') as $table)
		{
			$outcome .= $table.' (';	
		
			$this->dbutil->repair_table('table_name') ? $outcome .= lang('success_label') : $outcome .= lang('pyrodb:failure');
			
			$outcome .= ")\n";
		}
		
		$this->session->set_flashdata('success', $outcome);
		redirect('admin/system/tables');
	}

}