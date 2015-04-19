<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * Roles controller for the groups module
 *
 * @author PancakeApp Dev Team
 * @package PancakeApp
 * @subpackage Groups Module
 * @category Modules
 *
 */
class Admin_groups extends Admin_Controller
{
	protected $section = 'groups';
	
	/**
	 * Constructor method
	 *
	 * @access public
	 * @return void
	 */
	public function __construct()
	{
		parent::__construct();

		// Load the required classes
		$this->load->model('group_m');
		$this->lang->load('groups');
		
		is_sadmin() or access_denied();
	}

	/**
	 * Create a new group role
	 *
	 * @access public
	 * @return void
	 */
	public function index($offset = 0)
	{
        $count = $this->group_m->count_all();
		$groups = $this->group_m->order_by('description')->limit($this->pagination_config['per_page'], $offset)->get_all();
        
        // Start up the pagination 
		$this->load->library('pagination');
                $this->pagination_config['base_url'] = site_url('admin/users/groups/index/');
		$this->pagination_config['uri_segment'] = 5;
		$this->pagination_config['total_rows'] = $count;
		$this->pagination->initialize($this->pagination_config);

                $this->template
		->title($this->module_details['name'])
		->set('groups', $groups)
    		->build('admin/groups/index');
	}

	/**
	 * Create a new group role
	 *
	 * @access public
	 * @return void
	 */
	public function add() {
		if ($_POST) {
			if (($group_id = $this->group_m->insert($this->input->post()))) {
				$this->permission_m->save($group_id, $this->input->post('modules'), $this->input->post('module_roles'));
				
				$this->session->set_userdata('success', sprintf(lang('groups:add_success'), $this->input->post('name')));
				
				redirect('admin/users/groups');
			} else {
				$this->template->error = validation_errors();
			}
		}
		
		$edit_permissions = array();//$this->permission_m->get_group($group->id);
		$permission_modules = $this->module_m->get_all();

		foreach ($permission_modules as &$module) {
			$module['roles'] = $this->module_m->roles($module['slug']);
		}

		// Loop through each validation rule
		foreach ($this->group_m->validate as $rule) {
			$group->{$rule['field']} = set_value($rule['field']);
		}

		$this->template
			->title($this->module_details['name'], lang('permissions:permissions'))
			->set('edit_permissions', $edit_permissions)
			->set('permission_modules', $permission_modules)
			->set('group', $group)
			->build('admin/groups/form');
	}


	/**
	 * Edit a group role
	 *
	 * @access public
	 * @param int $id The ID of the group to edit
	 * @return void
	 */
	public function edit($id = 0)
	{
		$group = $this->group_m->get($id) or redirect('admin/groups');

		if ($_POST)
		{
			// Got validation?
			if ($group->name == 'admin' OR $group->name == 'user')
			{
				//if they're changing description on admin or user save the old name
				$_POST['name'] = $group->name;
				
				$this->group_m->validate = array(
					'field' => 'description',
					'label' => 'lang:groups:description',
					'rules' => 'trim|required|max_length[250]'
				);
			}
			
			if ($this->group_m->update($group->id, $this->input->post()))
			{
				$this->permission_m->save($group->id, $this->input->post('modules'), $this->input->post('module_roles'));
				
				$this->session->set_userdata('success', sprintf(lang('groups:edit_success'), $this->input->post('name')));
				redirect('admin/users/groups');
			}
			
			else
			{
				$this->template->error = validation_errors();
			}
		}
		
		$edit_permissions = $this->permission_m->get_group($group->id);
		$permission_modules = $this->module_m->get_all();

		foreach ($permission_modules as &$module)
		{
			$module['roles'] = $this->module_m->roles($module['slug']);
		}

		$this->template
			->title($this->module_details['name'], sprintf(lang('groups:edit_title'), $group->name))
			->set('group', $group)
			->set('edit_permissions', $edit_permissions)
			->set('permission_modules', $permission_modules)
			->build('admin/groups/form');
	}

	/**
	 * Delete group role(s)
	 *
	 * @access public
	 * @param int $id The ID of the group to delete
	 * @return void
	 */
	public function delete($id = 0)
	{
		$this->group_m->delete($id)
			? $this->session->set_userdata('success', lang('groups:delete_success'))
			: $this->session->set_userdata('error', lang('groups:delete_error'));

		redirect('admin/users/groups');
	}
}
