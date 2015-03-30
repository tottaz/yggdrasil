<?php  if (!defined('BASEPATH')) exit('No direct script access allowed');
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
| 	www.your-site.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	http://www.codeigniter.com/user_guide/general/routing.html
*/

// Admin
$route['system/admin/database(/:any)?']	= 'admin_database$1';
$route['system/admin/tables(/:any)?']	= 'admin_tables$1';
$route['system/admin/query(/:any)?']	= 'admin_query$1';
$route['system/admin/export(/:any)?']	= 'admin_export$1';
$route['system/admin/monitoring(/:any)?']	= 'admin_monitoring$1';
$route['system/admin(:any)?'] 	= 'admin$1';
