<?php

		require_once("third_party/modules/dhtmlx/connector/grid_connector.php");
		require_once("third_party/modules/dhtmlx/connector/combo_connector.php");
		require_once("third_party/modules/dhtmlx/connector/db_phpci.php");
		DataProcessor::$action_param ="dhx_editor_status"; 

class Admin extends Admin_Controller {

	public function __construct() {
		parent::__construct();

		$this->load->database();

		$this->load->library('form_validation');
		$this->load->helper('url');
		$this->load->helper('array');
		$this->load->language('servicedesk');
 
	}
	
	public function vendor($offset = 0) {
		// Load the models
		$this->load->model('admin/Vendor_m', '', true);

		// Actions
		if (array_key_exists('mode', $_POST)) {
			if ($_POST['mode'] == 'add_vendor') {
				$this->Vendor_m->add_vendor($this->current_user->id, $_POST['vendor']);
			}
		}
		else if (array_key_exists('mode', $_GET)) {
			if ($_GET['mode'] == 'delete_vendor') {
				$this->Vendor_m->delete_vendor($_GET['delete']);
			}
		}
		if (isset($_POST['mode']) && $_POST['mode'] == 'ajaxedit') {
			
			// Get the input
			$id = $_POST['id'];
			$user = $this->current_user->id;
			$name = $_POST['name'];
			
			// Update the keyword and get the response message
			if ($this->Vendor_m->edit_vendor($id, $user, $name)) $message = 'Saved';
			else $message = 'Could not save vendor!';
			
			// Print the content
//			echo $this->load->view('header', $header, true);
			printf(
				'<script>$(window).load(function() {$("#%s", window.parent.document).text("%s");});</script>',
				'save_status_' . $id,
				$message
			);
			die();
		}
		$this->template->count = $this->Vendor_m->count_all();
		
		// Create pagination links
		$this->template->pagination = create_pagination('admin/servicedesk/vendors', $this->Vendor_m->count_all());
		$this->template->vendors = $this->Vendor_m->limit($this->pagination_config['per_page'], $offset)->get_vendors(true);
		
		$this->template
			->title($this->module_details['name'])
			->append_js('module::general.js');
				
		// Load the views
		$this->template->build('admin/vendors');
	}
	
	public function department($offset = 0) 
	{
		// Load the models
		$this->load->model('admin/Department_m', '', true);
		
		// Actions
		if (array_key_exists('mode', $_POST)) {
			if ($_POST['mode'] == 'add_department') {
				$this->Department_m->add_department($this->current_user->id, $_POST['department']);
			}
		}
		else if (array_key_exists('mode', $_GET)) {
			if ($_GET['mode'] == 'delete_department') {
				$this->Department_m->delete_department($_GET['delete']);
			}
		}
		if (isset($_POST['mode']) && $_POST['mode'] == 'ajaxedit') {
			
			// Get the input
			$id = $_POST['id'];
			$user = $this->current_user->id;
			$title = $_POST['title'];
			
			// Update the keyword and get the response message
			if ($this->Department_m->edit_department($id, $user, $title)) $message = 'Saved';
			else $message = 'Could not save department!';
			
			// Print the content
//			echo $this->load->view('header', $header, true);
			printf(
				'<script>$(window).load(function() {$("#%s", window.parent.document).text("%s");});</script>',
				'save_status_' . $id,
				$message
			);
			die();
		}
		
			$this->template->count = $this->Department_m->count_all() - 1;
			
		// Create pagination links
		$this->template->pagination = create_pagination('admin/servicedesk/departments', $this->Department_m->count_all());

		$this->template->departments = $this->Department_m->limit($this->pagination_config['per_page'], $offset)->get_departments(true);
		$message = '';
		
		$this->template->message = $message;
		
		$this->template
				->title($this->module_details['name'])
				->append_js('module::general.js');
		
		// Load the views
		$this->template->build('admin/department');
	}

	public function people($offset = 0) {
	
		// Load the models
		$this->load->model('admin/People_m', '', true);

		// Actions
		if (array_key_exists('mode', $_POST)) {
			if ($_POST['mode'] == 'add_people') {
				$this->People_m->add_people($this->current_user->id, $_POST['people']);
			}
		}
		else if (array_key_exists('mode', $_GET)) {
			if ($_GET['mode'] == 'delete_people') {
				$this->People_m->delete_people($_GET['delete']);
			}
		}
		if (isset($_POST['mode']) && $_POST['mode'] == 'ajaxedit') {
			
			// Get the input
			$id = $_POST['id'];
			$user = $this->current_user->id;
			$title = $_POST['title'];
			
			// Update the keyword and get the response message
			if ($this->People_m->edit_people($id, $user, $title)) $message = 'Saved';
			else $message = 'Could not save media_contacts!';
			
			// Print the content
			printf(
				'<script>$(window).load(function() {$("#%s", window.parent.document).text("%s");});</script>',
				'save_status_' . $id,
				$message
			);
			die();
		}
		
		$count = $this->People_m->count_all();
		$peoples = $this->People_m->limit($this->pagination_config['per_page'], $offset)->get_all_people();

		// Start up the pagination 
		$this->load->library('pagination');
		$this->pagination_config['base_url'] = site_url('media/servicedesk/people/');
		$this->pagination_config['uri_segment'] = 4;
		$this->pagination_config['total_rows'] = $count;
		$this->pagination->initialize($this->pagination_config);

		$this->template
			->title($this->module_details['name'])
			->append_js('module::general.js');
			
		// Load the views
		$this->template->build('admin/people', Array(
			'peoples' => $peoples,
			'count' => $count,
		));
	}

	public function offices($offset = 0) {
		
		$this->load->model('admin/Offices_m', '', true);
		
		$edit_office = false;
		
		// Actions
		if (array_key_exists('mode', $_POST)) {
			if ($_POST['mode'] == 'add_office') {
				$this->Offices_m->create_office(
					$_POST['title'],
					$this->current_user->id
				);
			}
			else if ($_POST['mode'] == 'edit_office') {
				
				$this->Offices_m->change_office(
					$_POST['id'],
					$_POST['title'],
					$this->current_user->id
				);
			}
		}
		else if (array_key_exists('mode', $_GET)) {
			if ($_GET['mode'] == 'delete_office') {
				$this->Offices_m->remove_office($_GET['delete']);
			}
			else if ($_GET['mode'] == 'edit_office') {
				$edit_office = $this->Offices_m->get_office($_GET['edit'], '*');
			}
		}
		if (isset($_POST['mode']) && $_POST['mode'] == 'ajaxedit') {
			
			// Get the input
			$id = $_POST['id'];
			$title = $_POST['title'];
			$user = $this->current_user->id;
			
			// Update the keyword and get the response message
			if ($this->Offices_m->change_office($id, $title, $user)) $message = 'Saved';
			else $message = 'Could not save office!';
			
			// Print the content
//			echo $this->load->view('header', $header, true);
			printf(
				'<script>$(window).load(function() {$("#%s", window.parent.document).text("%s");});</script>',
				'save_status_' . $id,
				$message
			);
			die();
		}
		
		$count = $this->Offices_m->count_all();
		$offices = $this->Offices_m->limit($this->pagination_config['per_page'], $offset)->get_all_offices('*');
		// Start up the pagination 
		$this->load->library('pagination');
		$this->pagination_config['base_url'] = site_url('media/servicedesk/offices/');
		$this->pagination_config['uri_segment'] = 4;
		$this->pagination_config['total_rows'] = $count;
		$this->pagination->initialize($this->pagination_config);

		// Load the views
		$this->template->build('admin/offices', Array(
			'offices' => $offices,
			'edit_office' => $edit_office,
			'count' => $count,
		));
	}
	
	public function type($offset = 0) 
	{
		// Load the models
		$this->load->model('admin/Type_m', '', true);
		
		// Actions
		if (array_key_exists('mode', $_POST)) {
			if ($_POST['mode'] == 'add_type') {
				$this->Type_m->add_type($this->current_user->id, $_POST['type']);
			}
		}
		else if (array_key_exists('mode', $_GET)) {
			if ($_GET['mode'] == 'delete_type') {
				$this->Type_m->delete_type($_GET['delete']);
			}
		}
		if (isset($_POST['mode']) && $_POST['mode'] == 'ajaxedit') {
			
			// Get the input
			$id = $_POST['id'];
			$user = $this->current_user->id;
			$title = $_POST['title'];
			
			// Update the keyword and get the response message
			if ($this->Type_m->edit_feed_type($id, $user, $title)) $message = 'Saved';
			else $message = 'Could not save media_type!';
			
			// Print the content
//			echo $this->load->view('header', $header, true);
			printf(
				'<script>$(window).load(function() {$("#%s", window.parent.document).text("%s");});</script>',
				'save_status_' . $id,
				$message
			);
			die();
		}
		
		$count = $this->Type_m->count_all();
		$types = $this->Type_m->limit($this->pagination_config['per_page'], $offset)->get_types();
		// Start up the pagination 
		$this->load->library('pagination');
		$this->pagination_config['base_url'] = site_url('media/servicedesk/type/');
		$this->pagination_config['uri_segment'] = 4;
		$this->pagination_config['total_rows'] = $count;
		$this->pagination->initialize($this->pagination_config);
		
		$this->template
			->title($this->module_details['name'])
			->append_js('module::general.js');
			
		// Load the views
		$this->template->build('admin/type', Array(
			'feedtypes' => $feedtypes,
			'count' => $count,
		));
	}
}
?>