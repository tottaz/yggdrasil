<?php

//@ini_set('memory_limit', '128M');
ini_set('memory_limit', '-1');
ini_set('max_execution_time', 12000);

# This is here to fix an odd CI bug with special characters.
$post_buffer = $_POST;

define('SELF', str_replace('\\', '/', pathinfo(__FILE__, PATHINFO_BASENAME)));
define('FCPATH', str_replace(SELF, '',str_replace('\\', '/', __FILE__)));
define('EXT', '.php');

date_default_timezone_set('UTC');

/*
 *---------------------------------------------------------------
 * APPLICATION ENVIRONMENT
 *---------------------------------------------------------------
 *
 * You can load different configurations depending on your
 * current environment. Setting the environment also influences
 * things like logging and error reporting.
 *
 * This can be set to anything, but default usage is:
 *
 *     development
 *     testing
 *     production
 *
 * NOTE: If you change these, also change the error_reporting() code below
 *
 */

define('DEVELOPMENT', 'development');
define('STAGING', 'staging');
define('PRODUCTION', 'production');

define('ENVIRONMENT', (isset($_SERVER['APP_ENV']) ? $_SERVER['APP_ENV'] : DEVELOPMENT));

/*
 *---------------------------------------------------------------
 * ERROR REPORTING
 *---------------------------------------------------------------
 *
 * Different environments will require different levels of error reporting.
 * By default development will show errors but testing and live will hide them.
 */

	switch (ENVIRONMENT)
	{
		case 'development':
			ini_set('display_errors', TRUE);
			error_reporting(E_ALL);
		break;

		case 'staging':
		case 'production':
			ini_set('display_errors', FALSE);
			error_reporting(0);
		break;

		default:
			exit('The environment is not set correctly. ENVIRONMENT = '.ENVIRONMENT.'.');
	}

/*
 *---------------------------------------------------------------
 * SYSTEM FOLDER NAME
 *---------------------------------------------------------------
 *
 * This variable must contain the name of your "system" folder.
 * Include the path if the folder is not in the same  directory
 * as this file.
 *
 */
	$system_path = "system/codeigniter";
	
/*
 *---------------------------------------------------------------
 * Connect to Wordpress
 *---------------------------------------------------------------
 *
 * This variable must contain the name of your "system" folder.
 * Include the path if the folder is not in the same  directory
 * as this file.
 *
 */

//	require_once $_SERVER['DOCUMENT_ROOT'] . '/wordpress/wp-load.php'; //change wp-load.php location according to your setup

/*
 *---------------------------------------------------------------
 * APPLICATION FOLDER NAME
 *---------------------------------------------------------------
 *
 * If you want this front controller to use a different "application"
 * folder then the default one you can set its name here. The folder
 * can also be renamed or relocated anywhere on your server.  If
 * you do, use a full server path. For more info please see the user guide:
 * http://codeigniter.com/user_guide/general/managing_apps.html
 *
 * NO TRAILING SLASH!
 *
 */
	$application_folder = "app"; 

// No database? Send to installer so we can make one 

if (is_file($application_folder.'/config/database.php')) {
    file_get_contents($application_folder.'/config/database.php') or $application_folder = FCPATH."installer"; 
} else {
    $application_folder = FCPATH."installer";
}

define('INSTALLING_GREENGARDEN', ($application_folder == FCPATH."installer"));


/*
 * --------------------------------------------------------------------
 * DEFAULT CONTROLLER
 * --------------------------------------------------------------------
 *
 * Normally you will set your default controller in the routes.php file.
 * You can, however, force a custom routing by hard-coding a
 * specific controller class/function here.  For most applications, you
 * WILL NOT set your routing here, but it's an option for those
 * special instances where you might want to override the standard
 * routing in a specific front controller that shares a common CI installation.
 *
 * IMPORTANT:  If you set the routing here, NO OTHER controller will be
 * callable. In essence, this preference limits your application to ONE
 * specific controller.  Leave the function name blank if you need
 * to call functions dynamically via the URI.
 *
 * Un-comment the $routing array below to use this feature
 *
 */
	// The directory name, relative to the "controllers" folder.  Leave blank
	// if your controller is not in a sub-folder within the "controllers" folder
	// $routing['directory'] = '';

	// The controller class file name.  Example:  Mycontroller.php
	// $routing['controller'] = '';

	// The controller function you wish to be called.
	// $routing['function']	= '';

// --------------------------------------------------------------------
// END OF USER CONFIGURABLE SETTINGS.  DO NOT EDIT BELOW THIS LINE
// --------------------------------------------------------------------
/**
 * If $server is a string, it assumes it's a base64_encoded serialized dump of $_SERVER
 * and alters $_SERVER to match it. Used for debugging installation errors in APP.
 * 
 * If $server is an array, it'll return it in a debuggable format.
 * 
 * @param string $server 
 * @param boolean $process
 * @return string
 */
function debug_server($server) {
    
    # Destroy base_url.txt for testing purposes.
    @unlink(FCPATH.'/uploads/base_url.txt');
    
    if (is_array($server)) {
	return chunk_split(base64_encode(serialize($server)));
    } else {
	$server = trim($server);
	$server = base64_decode($server);
	if (@unserialize($server) !== false) {
	    $_SERVER = @unserialize($server);
	}
    }
}

/*
 * ---------------------------------------------------------------
 *  Resolve the system path for increased reliability
 * ---------------------------------------------------------------
 */
	if (realpath($system_path) !== FALSE) {
		$system_path = realpath($system_path).'/';
	}
	
	// ensure there's a trailing slash
	$system_path = rtrim($system_path, '/').'/';
	
	// Is the system path correct?
	if ( ! is_dir($system_path))
	{
		exit("Your system folder path does not appear to be set correctly. Please open the following file and correct this: ".pathinfo(__FILE__, PATHINFO_BASENAME));	           
        }

/*
 * -------------------------------------------------------------------
 *  Now that we know the path, set the main path constants
 * -------------------------------------------------------------------
 */
	
	// The site ref. Used for building site specific paths
	define('SITE_REF', 'default');
					
	// Path to uploaded files for this site
	define('UPLOAD_PATH', 'uploads/'.SITE_REF.'/');
	// Path to the system folder
	define('BASEPATH', str_replace("\\", "/", $system_path));

	// Name of the "system folder"
	define('SYSDIR', trim(strrchr(trim(BASEPATH, '/'), '/'), '/'));
        
	// The path to the "application" folder
	if (is_dir($application_folder)) {
	    define('APPPATH', $application_folder.'/');
	} else {
		exit("Your application folder path does not appear to be set correctly. Please open the following file and correct this: ".SELF);
	}

/* --------------------------------------------------------------------
 * LOAD THE DATAMAPPER BOOTSTRAP FILE
 * --------------------------------------------------------------------
 */
//require_once FCPATH.'third_party/modules/datamapper/bootstrap.php';        

        
    define('APP_DEMO', (file_exists(FCPATH.'DEMO')));        
/*
 * --------------------------------------------------------------------
 * LOAD THE BOOTSTRAP FILE
 * --------------------------------------------------------------------
 *
 * And away we go...
 *
 */
require_once BASEPATH.'core/CodeIgniter'.EXT;