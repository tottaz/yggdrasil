<?php (defined('BASEPATH')) OR exit('No direct script access allowed');

/* load the MX_Loader class */
require APPPATH."third_party/MX/Loader.php";

//class MY_Loader extends MX_Loader {}

/**
 * App  
 *
 * A simple, fast, contact and software licenses software
 *
 * @package		App
 * @author		App Dev Team
*/


class My_Loader extends MX_Loader {
    
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