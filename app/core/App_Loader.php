<?php (defined('BASEPATH')) OR exit('No direct script access allowed');

/* load the MX_Loader class */
require APPPATH."libraries/MX/Loader.php";

/**
 * App  
 *
 * A simple, fast, contact and software licenses software
 *
 * @package		App
 * @author		App Dev Team
*/


class App_Loader extends MX_Loader {
    /**
     * Keep track of which sparks are loaded. This will come in handy for being
     *  speedy about loading files later.
     *
     * @var array
     */
    var $_ci_loaded_sparks = array();

    /**
     * Constructor. Define SPARKPATH if it doesn't exist, initialize parent
     */
    function __construct() {
        if(!defined('SPARKPATH')) {
            define('SPARKPATH', APPPATH.'sparks/');
        }

        parent::__construct();
    }

    
	/**
	 * Since parent::_ci_view_paths is protected we use this setter to allow
	 * things like plugins to set a view location.
	 *
	 * @param string $path
	 */
	public function set_view_path($path)
	{
		if (is_array($path))
		{
			// if we're restoring saved paths we'll do them all
			$this->_ci_view_paths = $path;
		}
		else
		{
			// otherwise we'll just add the specified one
			$this->_ci_view_paths = array($path => TRUE);
		}
	}

	/**
	 * Since parent::_ci_view_paths is protected we use this to retrieve them.
	 *
	 * @return array
	 */
	public function get_view_paths()
	{
		// return the full array of paths
		return $this->_ci_view_paths;
	}


	/**
	 * To accomodate CI 2.1.0, we override the initialize() method instead of
	 * the ci_autoloader() method. Once sparks is integrated into CI, we can
	 * avoid the awkward version-specific logic.
	 *
	 * @return \MY_Loader
	 */
	function initialize()
	{
		parent::initialize();

		$this->ci_autoloader();

		return $this;
	}
    
    /**
     * Load a spark by it's path within the sparks directory defined by
     *  SPARKPATH, such as 'markdown/1.0'
     * @param string $spark The spark path withint he sparks directory
     * @param <type> $autoload An optional array of items to autoload
     *  in the format of:
     *   array (
     *     'helper' => array('somehelper')
     *   )
     * @return <type>
     */
    function spark($spark, $autoload = array()) {
        if(is_array($spark)) {
            foreach($spark as $s) {
                $this->spark($s);
            }
        }

        $spark = ltrim($spark, '/');
        $spark = rtrim($spark, '/');

        $spark_path = SPARKPATH . $spark . '/';
        $parts      = explode('/', $spark);
        $spark_slug = strtolower($parts[0]);

        # If we've already loaded this spark, bail
        if(array_key_exists($spark_slug, $this->_ci_loaded_sparks)) {
            return true;
        }

        # Check that it exists. CI Doesn't check package existence by itself
        if(!file_exists($spark_path)) {
            show_error("Cannot find spark path at $spark_path");
        }

        if(count($parts) == 2)
        {
            $this->_ci_loaded_sparks[$spark_slug] = $spark;
        }

        $this->add_package_path($spark_path);

        foreach($autoload as $type => $read)
        {
            if($type == 'library')
                $this->library($read);
            elseif($type == 'model')
                $this->model($read);
            elseif($type == 'config')
                $this->config($read);
            elseif($type == 'helper')
                $this->helper($read);
            elseif($type == 'view')
                $this->view($read);
            else
                show_error ("Could not autoload object of type '$type' ($read) for spark $spark");
        }

        // Looks for a spark's specific autoloader
        $this->_ci_autoloader($spark_path);

        return true;
    }

	/**
	 * Pre-CI 2.0.3 method for backward compatility.
	 *
	 * @deprecated
	 * @param null $basepath
	 * @return void
	 */
	function _ci_autoloader($basepath = NULL)
	{
		log_message('warning',__METHOD__.'() is deprecated.  Update your code to use '
		                     .__CLASS__.'::ci_autoloader(). (no leading underscore)');
		$this->ci_autoloader($basepath);
	}

	/**
	 *
	 * The config/autoload.php file contains an array that permits sub-systems,
	 * libraries, and helpers to be loaded automatically.
	 *
	 * @param array|null $basepath
	 * @return void
	 */
	function ci_autoloader($basepath = NULL)
	{
        if($basepath !== NULL)
        {
            $autoload_path = $basepath.'config/autoload'.EXT;
        }
        else
        {
            $autoload_path = APPPATH.'config/autoload'.EXT;
        }

        if(! file_exists($autoload_path))
        {
            return FALSE;
        }

		include_once($autoload_path);

		if ( ! isset($autoload))
		{
			return FALSE;
		}

		// Autoload packages
		if (isset($autoload['packages']))
		{
			foreach ($autoload['packages'] as $package_path)
			{
				$this->add_package_path($package_path);
			}
		}

        // Autoload sparks
		if (isset($autoload['sparks']))
		{
			foreach ($autoload['sparks'] as $spark)
			{
				$this->spark($spark);
			}
		}

        if (isset($autoload['config']))
		{
            // Load any custom config file
            if (count($autoload['config']) > 0)
            {
                $CI =& get_instance();
                foreach ($autoload['config'] as $key => $val)
                {
                    $CI->config->load($val);
                }
            }
        }

		// Autoload helpers and languages
		foreach (array('helper', 'language') as $type)
		{
			if (isset($autoload[$type]) AND count($autoload[$type]) > 0)
			{
				$this->$type($autoload[$type]);
			}
		}

		// A little tweak to remain backward compatible
		// The $autoload['core'] item was deprecated
		if ( ! isset($autoload['libraries']) AND isset($autoload['core']))
		{
			$autoload['libraries'] = $autoload['core'];
		}

		// Load libraries
		if (isset($autoload['libraries']) AND count($autoload['libraries']) > 0)
		{
			// Load the database driver.
			if (in_array('database', $autoload['libraries']))
			{
				$this->database();
				$autoload['libraries'] = array_diff($autoload['libraries'], array('database'));
			}

			// Load all other libraries
			foreach ($autoload['libraries'] as $item)
			{
				$this->library($item);
			}
		}

		// Autoload models
		if (isset($autoload['model']))
		{
			$this->model($autoload['model']);
		}
	}

	/**
	 * Get Variables
	 *
	 * Retrieve all loaded variables
	 *
	 * @return	array
	 */
	public function get_vars()
	{
		return $this->_ci_cached_vars;
	}
}