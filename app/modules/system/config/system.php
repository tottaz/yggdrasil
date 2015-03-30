<?php defined('BASEPATH') OR exit('No direct script access allowed');

$config['system.cache_protected_folders'] = array('simplepie', 'cloud_cache', 'page_m', 'theme_m', 'navigation_m');
$config['system.cannot_remove_folders'] = array('assets', 'codeigniter', 'media', 'cron_log');

// An array of database tables that are eligible to be exported.
$config['system.export_tables'] = array('action', 'campaigns', 'journalists','feeds', 'geo_country', 'keyword', 'logs', 'modules', 'medias', 'news_items', 'news_item_data', 'offices', 'programmes', 'settings', 'wires','users');