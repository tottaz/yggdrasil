<?php defined('BASEPATH') or exit('No direct script access allowed');

class Module_Maps extends Module {

	public $version = '1.0';
	
	public function info() {
		return array(
			'name' => array(
				'en' => 'Ships location Map',
			),
			'description' => array(
				'en' => 'Ships location map',
			),
			'frontend' => FALSE,
			'backend'  => TRUE,
			'menu'	  => 'users',
			'roles'     => array('create', 'view', 'edit', 'change_status'),
		);
	}
}