<?php defined('BASEPATH') OR exit('No direct script access allowed');

$config['system.cache_protected_folders'] = array('simplepie', 'cloud_cache', 'page_m', 'theme_m');
$config['system.cannot_remove_folders'] = array('assets', 'codeigniter', 'cron_log');

// An array of database tables that are eligible to be exported.
$config['system.export_tables'] = array('logs', 'modules', 'settings', 'users');