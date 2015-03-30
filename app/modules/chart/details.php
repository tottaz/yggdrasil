<?php defined('BASEPATH') or exit('No direct script access allowed');

class Module_Chart extends Module {

	public $version = '1.0';

	public function info() {	
		return array(
			'name' => array(
				'en' => 'Chart',
			),
			'description' => array(
				'en' => 'Chart',
			),
			'frontend' => NULL,
			'backend'  => TRUE,
			'menu'	  => NULL,
			'roles'     => array('create', 'view', 'edit', 'change_status'),
		);
	}
}