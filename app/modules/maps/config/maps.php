<?php defined('BASEPATH') OR exit('No direct script access allowed');

$route['maps/(:any)?'] = 'maps/$1$2';
$route['api/1/(:any)'] = 'maps/$1';
$route['maps/([a-zA-Z0-9_-]+)/(:any)']	 = '$1/maps/$2';
$route['maps/([a-zA-Z0-9_-]+)']			= '$1/maps/index';

/* End of file routes.php */