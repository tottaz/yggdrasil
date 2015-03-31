<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	http://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There area two reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router what URI segments to use if those provided
| in the URL cannot be matched to a valid route.
|
*/

$route['default_controller'] = "dashboard";
//$route['default_controller'] = "staticpage/flipboard";
$route['404_override'] = 'dashboard';

/**
 * @var	array	All the routable controller and module names
 */
$routable_controllers = array('ajax', 'javascript', 'cron', 'api', 'timeline', 'users', 'analysis', 'dashboard' );

$route['admin'] = "dashboard";
$route['admin/([a-zA-Z_-]+)/(:any)'] = "$1/admin/$2";
$route['admin/([a-zA-Z_-]+)'] = "$1/admin/index";

$route['api/1/(:any)'] = 'api_1/$1';
$route['api/ajax/(:any)']          	    = 'api/ajax/$1';
$route['api/([a-zA-Z0-9_-]+)/(:any)']	    = '$1/api/$2';
$route['api/([a-zA-Z0-9_-]+)']              = '$1/api/index';

foreach ($routable_controllers as $controller) {
	$route[$controller.'(:any)'] = $controller.'$1';
}