<?php  defined('BASEPATH') OR exit('No direct script access allowed');

$route['users/admin/groups(:any)?']	= 'admin_groups$1';
// Admin Routes
$route['users/admin/fields(/:any)?']	= 'admin_fields$1';