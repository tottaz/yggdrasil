<?php

defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * App  
 *
 * A simple, fast, contact and software licenses software
 *
 * @package		App
 * @author		App Dev Team
*/

/**
 * The admin and public base controllers extend this library
 *
 * @subpackage	Controllers
 */
class My_Controller extends CI_Controller {

	/**
     * @var array	An array of methods to be secured by login
     */
	protected $secured_methods = array();

	/**
	 * The construct loads sets up items needed application wide.
	 *
	 * @access	public
	 * @return	void
	 */
	public function __construct() 
	{
		global $post_buffer;
		
		parent::__construct();
		
		$this->benchmark->mark('my_controller_start');
		$this->method = $this->router->fetch_method();
		
		// No record? Probably DNS'ed but not added to multisite
		if ( ! defined('SITE_REF'))
		{
			show_error('This domain is not set up correctly. Please go to '.anchor('sites') .' and log in to add this site.');
		}

		// Load the cache library now that we know the siteref
		$this->load->library('appcache');
		// Migrate DB to the latest version
//		$this->load->library('migration');
		# If App was just automatically updated, the update system will force a refresh.
		// With that done, load settings
		$this->load->library(array('session', 'settings/settings'));
		// Lock front-end language
		if ( ! (is_a($this, 'Admin_Controller') && ($site_lang = AUTO_LANGUAGE)))
		{
			$site_public_lang = explode(',', Settings::get('site_public_lang'));
			if (in_array(AUTO_LANGUAGE, $site_public_lang))
			{
				$site_lang = AUTO_LANGUAGE;
			}
			else
			{
				$site_lang = Settings::get('site_lang');
			}
		}

		// What language us being used
		defined('CURRENT_LANGUAGE') or define('CURRENT_LANGUAGE', $site_lang);
		
		$langs = $this->config->item('supported_languages');
		
		$sitelang['lang'] = $langs[CURRENT_LANGUAGE];
		$sitelang['lang']['code'] = CURRENT_LANGUAGE;
		$this->load->vars($sitelang);
		
		// Set php locale time
		if (isset($langs[CURRENT_LANGUAGE]['codes']) && sizeof($locale = (array) $langs[CURRENT_LANGUAGE]['codes']) > 1)
		{
			array_unshift($locale, LC_TIME);
			call_user_func_array('setlocale', $locale);
			unset($locale);
		}
		
		// Reload languages
		if (AUTO_LANGUAGE !== CURRENT_LANGUAGE)
		{
			$this->config->set_item('language', $langs[CURRENT_LANGUAGE]['folder']);
			$this->lang->is_loaded = array();
			$this->lang->load(array('errors', 'global', 'users/user', 'settings/settings'));
		}
		else
		{
			$this->lang->load(array('global', 'users/user'));
		}
		
		$this->load->library(array('events', 'users/ion_auth'));
		$this->output->enable_profiler(FALSE);
		
		define('IS_AJAX', isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');
		define('IS_CLI', defined('STDIN'));
		
		// Create a hook point with access to instance but before custom code
//		$this->hooks->_call_hook('post_core_controller_constructor');
		
		$this->current_user = $this->template->current_user = $this->ion_auth->get_user();
		// Work out module, controller and method and make them accessable throught the CI instance
		$this->module = $this->module = $this->router->fetch_module();
		$this->controller = $this->controller = $this->router->fetch_class();
		$this->method = $this->method = $this->router->fetch_method();
		// Loaded after $this->current_user is set so that data can be used everywhere
		$this->load->model(array(
			'users/permission_m',
			'modules/module_m',
			'themes/theme_m',
		));                
		// List available module permissions for this user
		$this->permissions = $this->current_user ? $this->permission_m->get_group($this->current_user->group_id) : array();
		// ! empty($this->permissions['users']['']);
		// Get meta data for the module
		$this->template->module_details = $this->module_details = $this->module_m->get( $this->router->fetch_module() );
		// If the module is disabled, then show a 404.
		empty($this->module_details['enabled']) AND show_404();
		
		if ( ! $this->module_details['skip_xss'])
		{
			$_POST = $this->security->xss_clean($_POST);
		}
		
		if ($this->module and isset($this->module_details['path']))
		{
			Asset::add_path('module', $this->module_details['path'].'/');
		}
		
		$this->load->vars($sitelang);
		
		$this->benchmark->mark('my_controller_end');
		log_message('debug', "My_Controller Class Initialized");
		$_POST = $this->process_input($_POST, $post_buffer);
		unset($post_buffer);
		
		# Fix a bug with send_x_days_before.
		if (!Settings::get('send_x_days_before')) {
			Settings::create('send_x_days_before', 7);
			}
		}

	public function process_input($post, $post_buffer) {
		$return = array();
		
		foreach ($post as $key => $item) 
		{
			if (is_array($item)) {
				$item = $this->process_input($item, $post_buffer[$key]);
			} else {
			if (function_exists('get_magic_quotes_gpc') AND get_magic_quotes_gpc()) {
				$post_buffer[$key] = stripslashes($post_buffer[$key]);
			}
			if (strpos($post_buffer[$key], "\r") !== FALSE) {
				$post_buffer[$key] = str_replace(array("\r\n", "\r", "\r\n\n"), PHP_EOL, $post_buffer[$key]);
			}
			$item = $post_buffer[$key];
			}
			$return[$key] = $item;
		}
		return $return;
	}
}
/**
 * Returns the CodeIgniter object.
 *
 * Example: ci()->db->get('table');
 *
 * @return \CI_Controller
 */
function ci()
{
	return get_instance();
}