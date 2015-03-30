<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| File and Directory Modes
|--------------------------------------------------------------------------
|
| These prefs are used when checking and setting modes when working
| with the file system.  The defaults are fine on servers with proper
| security, but you may wish (or even need) to change the values in
| certain environments (Apache running a separate process for each
| user, PHP under CGI with Apache suEXEC, etc.).  Octal values should
| always be used to set the mode correctly.
|
*/
define('FILE_READ_MODE', 0644);
define('FILE_WRITE_MODE', 0666);
define('DIR_READ_MODE', 0755);
define('DIR_WRITE_MODE', 0777);

/*
|--------------------------------------------------------------------------
| File Stream Modes
|--------------------------------------------------------------------------
|
| These modes are used when working with fopen()/popen()
|
*/

define('FOPEN_READ',							'rb');
define('FOPEN_READ_WRITE',						'r+b');
define('FOPEN_WRITE_CREATE_DESTRUCTIVE',		'wb'); // truncates existing file data, use with care
define('FOPEN_READ_WRITE_CREATE_DESTRUCTIVE',	'w+b'); // truncates existing file data, use with care
define('FOPEN_WRITE_CREATE',					'ab');
define('FOPEN_READ_WRITE_CREATE',				'a+b');
define('FOPEN_WRITE_CREATE_STRICT',				'xb');
define('FOPEN_READ_WRITE_CREATE_STRICT',		'x+b');

if (isset($_SERVER['HTTP_HOST'])) {
    $base_url = (isset($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS']) == 'on') ? 'https' : 'http';
    $base_url .= '://' . $_SERVER['HTTP_HOST'] . '/';

    $path = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : (isset($_SERVER['ORIG_PATH_INFO']) ? $_SERVER['ORIG_PATH_INFO'] : (basename($_SERVER['SCRIPT_NAME'])));

    # On some hosts, $path = [path-to-index.php]/index.php/path
    # If absolute path to index.php ends with [path-to-index.php]/index.php, then remove it from $path.
    if (stristr($path, '/index.php') !== false) {
        $buffer = explode('/index.php', $path);
        if (substr($_SERVER['SCRIPT_FILENAME'], -strlen($buffer[0] . '/index.php'))) {
            # Remove [path-to-index.php] from $path.
            $path = str_ireplace($buffer[0], '', $path);
        }
    }

    if (stristr($_SERVER['SCRIPT_NAME'], 'index.php') !== false) {
        $script_name = explode('index.php', $_SERVER['SCRIPT_NAME']);
        $path = $script_name[0] . str_replace(array($path), '', $script_name[1]);
    } else {
        $path = str_replace(array($path, 'index.php'), '', $_SERVER['SCRIPT_NAME']);
    }

    if (substr($path, 0, 1) == '/') {
        $path = substr($path, 1, strlen($path) - 1);
    }
    $base_url .= $path;

    if (isset($_SERVER['SCRIPT_URI']) and !empty($_SERVER['SCRIPT_URI'])) {
        $base_url = $_SERVER['SCRIPT_URI'];
        if (!empty($_SERVER['PATH_INFO'])) {
            if (substr($_SERVER['PATH_INFO'], -10) == '/index.php') {
                # This path info ends with index.php, it doesn't include request data.
                if (isset($_SERVER['QUERY_STRING'])) {
                    if (substr($base_url, -strlen($_SERVER['QUERY_STRING'])) == $_SERVER['QUERY_STRING']) {
                        $base_url = substr($base_url, 0, -strlen($_SERVER['QUERY_STRING']));
                    }
                }
            } else {
                # Remove path info from base url.
                if (substr($base_url, -strlen($_SERVER['PATH_INFO'])) == $_SERVER['PATH_INFO']) {
                    $base_url = substr($base_url, 0, -strlen($_SERVER['PATH_INFO']));
                }

                # Remove index.php from the end of the base URL, if necessary.
                if (substr($base_url, -10) == '/index.php') {
                    $base_url = substr($base_url, 0, -10);
                }
            }
        } elseif (!empty($_SERVER['REQUEST_URI'])) {
            $buffer = (substr($_SERVER['REQUEST_URI'], -1, 1) == '/') ? $_SERVER['REQUEST_URI'] : $_SERVER['REQUEST_URI'] . '/';
            $base_url = (substr($base_url, -1, 1) == '/') ? $base_url : $base_url . '/';

            # Sometimes, the buffer might include the folder to which the app belongs.
            # So. We'll find the script name, remove the index.php from it, that'll leave the path to the script.
            # Then, we remove the path to the script from the start of $buffer, that means that $buffer will only be the -proper- REQUEST_URI.
            $script_name_buffer = $_SERVER['SCRIPT_NAME'];
            if (substr($script_name_buffer, -9) == 'index.php') {
                $script_name_buffer = substr($script_name_buffer, 0, -9);
            }

            if (substr($buffer, 0, strlen($script_name_buffer)) == $script_name_buffer) {
                $buffer = substr($buffer, strlen($script_name_buffer)) . '';
            }

            if (substr($base_url, -strlen($buffer)) == $buffer) {
                $base_url = substr($base_url, 0, -strlen($buffer));
            }
        }
    }

    # Add the forward slash, always.
    $base_url = (substr($base_url, -1, 1) == '/') ? $base_url : $base_url . '/';
    
    // Base URI (It's different to base URL!)
    $base_uri = parse_url($base_url, PHP_URL_PATH);
    if (substr($base_uri, 0, 1) != '/')
            $base_uri = '/' . $base_uri;
    if (substr($base_uri, -1, 1) != '/')
            $base_uri .= '/';
    
} else {
    $base_url = 'http://localhost/';
    $base_uri = '/';        
}

// Define these values to be used later on

$guessed_base_url = (substr($base_url, -1) != '/') ? $base_url . '/' : $base_url;
$base_url_file = FCPATH . 'uploads/base_url.txt';

if (stristr($guessed_base_url, 'localhost') === false) {
    # Store the base URL. This is not localhost, so odds are, it's correct.
    file_put_contents($base_url_file, $guessed_base_url);
    define('BASE_URL', $guessed_base_url);
} else {
    # Base URL is being identified as localhost, so we will not store the base URL, because it's probably being called from a cron. 
    # Instead, we will use the CURRENT stored URL, if one exists. Otherwise we'll use the guessed base URL.
    # If a current stored URL exists, we know this is a cron job. Otherwise, we know it's just an installation running on localhost.
    if (file_exists($base_url_file)) {
        $base = file_get_contents($base_url_file);
        $base = trim($base);
        define('BASE_URL', $base);
    } else {
        define('BASE_URL', $guessed_base_url);
    }
}

// Define these values to be used later on
define('BASE_URI', $base_uri);
define('APPPATH_URI', BASE_URI.APPPATH);

# Setting this here to sort out a bug that crops up with using date('Y') before setting a timezone.
# This is overriden as App is loading, so it's not a problem.
date_default_timezone_set('Europe/London');
define('COPYRIGHT_YEAR', date('Y'));

// We dont need these variables any more
unset($base_uri, $base_url);

# Upload Errors
define('NOT_ALLOWED', 'NOT_ALLOWED');


/*
|--------------------------------------------------------------------------
| App Version
|--------------------------------------------------------------------------
|
| Which version of App is currently running?
|
*/

define('APP_VERSION', '2.1');

/*
|--------------------------------------------------------------------------
| APP Edition
|--------------------------------------------------------------------------
|
| Media, Reporting, MIS & Online Media?
|
*/

define('APP_EDITION', 'Media');

/*
|--------------------------------------------------------------------------
| APP Release Date
|--------------------------------------------------------------------------
|
| When was the current version of APP released?
|
*/

define('APP_DATE', '2013-03-05');

/*
|--------------------------------------------------------------------------
| APP FRAME Campaign ID
|--------------------------------------------------------------------------
|
| The ID for the Frame Campaign
|
*/
define('FRAME_CAMPAIGN', 24);