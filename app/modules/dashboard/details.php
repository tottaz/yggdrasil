<?php defined('BASEPATH') or exit('No direct script access allowed');

class Module_Dashboard extends Module {

	public $version = '1.0';

	public function info() {	
		return array(
			'name' => array(
				'en' => 'Dashboard',
			),
			'description' => array(
				'en' => 'Dashboard',
			),
			'frontend' => NULL,
			'backend'  => TRUE,
			'menu'	  => NULL,
			'roles'     => array('create', 'view', 'edit', 'change_status'),
		);
	}
}