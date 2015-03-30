<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * App  
 *
 * A simple, fast, contact and software licenses software
 *
 * @package		App
 * @author		App Dev Team
// ------------------------------------------------------------------------
*/
/**
 * All controllers should extend this library
 *
 * @subpackage	Controllers
 */
class Admin_Controller extends App_Controller {
/**
	 * @var	array 	An array of methods to be secured by login
	 */
	protected $secured_methods = array('_all_');

	/**
	 * @var	array	The pagination class config array
	 */
	protected $pagination_config = array();

	/**
	 * @var	array   Controllers can have sections, normally an arbitrary string
	 */
	protected $section = NULL;


	// ------------------------------------------------------------------------

	/**
	 * The construct checks for authorization then loads in settings for
	 * all of the admin controllers.
	 *
	 * @access	public
	 * @return	void
	 */
	public function __construct() 
	{
		parent::__construct();

		// Load the Language files ready for output
		$this->lang->load('admin');
		$this->lang->load('buttons');

		if ((in_array($this->method, $this->secured_methods) || in_array('_all_', $this->secured_methods))) 
		{
			if ( ! $this->ion_auth->logged_in() and $this->method != 'no_internet_access') 
			{
				$this->session->set_flashdata('login_redirect', $this->uri->uri_string());
				redirect('admin/users/login');
			}
		// Be an admin or have access to this module a bit
			$module = $this->router->fetch_module();
			if ( ! $this->ion_auth->is_sadmin() and (empty($this->permissions) or ($module !== 'dashboard' and empty($this->permissions[$module])))) 
			{
				$this->session->set_flashdata('error', lang('cp_access_denied'));
				redirect('dashboard');
			// show_error('Permission Denied');
			}
			 
//			if($this->uri->uri_string = 'admin/users/login') 
//			{
				// set default uri string to dashboard
//				$this->uri->uri_string = 'dashboard';
//			}
		}
		// If the setting is enabled redirect request to HTTPS
		if ($this->settings->admin_force_https and strtolower(substr(current_url(), 4, 1)) != 's')
		{
			redirect(str_replace('http:', 'https:', current_url()).'?session='.session_id());
		}

		$this->load->helper('admin_theme');
		
		ci()->admin_theme = $this->theme_m->get_admin();
		
		// Using a bad slug? Weak
		if (empty($this->admin_theme->slug))
		{
			show_error('This site has been set to use an admin theme that does not exist.');
		}
		// make a constant as this is used in a lot of places
		defined('ADMIN_THEME') or define('ADMIN_THEME', $this->admin_theme->slug);
		$this->load->library('form_validation');

		// Set the location of assets
		Asset::add_path('theme', $this->admin_theme->web_path.'/');
		Asset::set_path('theme');

		// grab the theme options if there are any
		ci()->theme_options = $this->appcache->model('theme_m', 'get_values_by', array(array('theme' => ADMIN_THEME) ));

		// Active Admin Section (might be null, but who cares)
		$this->template->active_section = $this->section;

		Events::trigger('admin_controller');

		// Template configuration
		$this->template
			->enable_parser(FALSE)
			->set('theme_options', $this->theme_options)
			->set_theme(''.PAN::setting('admin_theme'))
			->set_layout('index');

		$this->template->set_partial('notifications', 'partials/notifications');

		$this->template->module = $this->router->fetch_module();

		// Active Admin Section (might be null, but who cares)
		$this->template->active_section = $this->section;
		// Get the diskspace library
		$this->load->library('system/diskSpace');
		// Get detils about the server
		$dUsage = new diskSpace( "." );
		$this->template->perentagefree = $dUsage->percentage_free;
		// will output: Percentage Free: 93%  
		$this->template->percentageused = $dUsage->percentage_used;

		// Setting up the base pagination config
		$this->pagination_config['per_page'] = Settings::get('items_per_page');
		$this->pagination_config['num_links'] = 5;
		$this->pagination_config['full_tag_open'] = '';
		$this->pagination_config['full_tag_close'] = '';
		$this->pagination_config['first_tag_open'] = '';
		$this->pagination_config['first_tag_close'] = '';
		$this->pagination_config['last_tag_open'] = '';
		$this->pagination_config['last_tag_close'] = '';
		$this->pagination_config['prev_tag_open'] = '';
		$this->pagination_config['prev_tag_close'] = '';
		$this->pagination_config['next_tag_open'] = '';
		$this->pagination_config['next_tag_close'] = '';
		$this->pagination_config['cur_tag_open'] = '';
		$this->pagination_config['cur_tag_close'] = '';
		$this->pagination_config['num_tag_open'] = '';
		$this->pagination_config['num_tag_close'] = '';

		// Try to determine the pagination base_url
		$segments = $this->uri->segment_array();

		if ($this->uri->total_segments() >= 4) {
			array_pop($segments);
		}

		if(Settings::get('application_debug') == true)
		{
			$this->output->enable_profiler(true);
		} else {
			$this->output->enable_profiler(false);
		}

		$this->pagination_config['base_url'] = site_url(implode('/', $segments));
		$this->pagination_config['uri_segment'] = 4;

		// Add the theme path to the asset paths
		// trigger the run() method in the selected admin theme - 
		$class = 'Theme_'.ucfirst($this->admin_theme->slug);
		call_user_func(array(new $class, 'run'));		
		log_message('debug', "Main_Controller Class Initialized");
	}
}