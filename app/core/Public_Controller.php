<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * App
 *
 * @package		App
 * @author		App Dev Team
 * @since		Version 1.0
 */

// ------------------------------------------------------------------------

/**
 * All public controllers should extend this library
 *
 * @subpackage	Controllers
 */
class Public_Controller extends App_Controller {
	/**
	 * @var	array 	An array of methods to be secured by login
	 */
	protected $secured_methods = array();
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
	public function __construct() {
		parent::__construct();

		$this -> benchmark -> mark('public_controller_start');

		Events::trigger('public_controller');

		// Check the frontend hasnt been disabled by an admin
//		if (!$this -> settings -> frontend_enabled && (empty($this -> current_user) OR $this -> current_user -> group != 'admin')) {
//			header('Retry-After: 600');

//			$error = $this -> settings -> unavailable_message ? $this -> settings -> unavailable_message : lang('cms_fatal_error');
//			show_error($error, 503);
//		}

		// Load the current theme so we can set the assets right away
		ci() -> theme = $this -> theme_m -> get();

		if (empty($this -> theme -> slug)) {
			show_error('This site has been set to use a theme that does not exist. If you are an administrator please ' . anchor('admin/themes', 'change the theme') . '.');
		}

		// Set the theme as a path for Asset library
		Asset::add_path('theme', $this -> theme -> path . '/');
		Asset::set_path('theme');

		// Support CDN URL's like Amazon CloudFront
//		if (Settings::get('cdn_domain')) {
//			$protocol = (!empty($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS']) !== 'off') ? 'https' : 'http';

//			Asset::set_url($protocol . '://' . rtrim(Settings::get('cdn_domain'), '/') . '/');
//		}

		// Set the theme view folder
		$this -> template -> set_theme($this -> theme -> slug) -> append_metadata('
				<script type="text/javascript">
					var APPPATH_URI = "' . APPPATH_URI . '";
					var BASE_URI = "' . BASE_URI . '";
				</script>'
				);

		// Is there a layout file for this module?
		if ($this -> template -> layout_exists($this -> module . '.html')) {
			$this -> template -> set_layout($this -> module . '.html');
		}

		// Nope, just use the default layout
		elseif ($this -> template -> layout_exists('default.html')) {
			$this -> template -> set_layout('default.html');
		}

		// Make sure whatever page the user loads it by, its telling search robots the correct formatted URL
		//		$this -> template -> set_metadata('canonical', site_url($this -> uri -> uri_string()), 'link');

		// grab the theme options if there are any
		//		$this -> theme -> options = $this -> appcache -> model('theme_m', 'get_values_by', array( array('theme' => $this -> theme -> slug)));

		//		$this -> template -> settings = $this -> settings -> get_all();
		$this -> template -> server = $_SERVER;
		$this -> template -> theme = $this -> theme;
		//		$this -> benchmark -> mark('public_controller_end');
	}

}
