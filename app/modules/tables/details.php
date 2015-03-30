<?php defined('BASEPATH') or exit('No direct script access allowed');

class Module_Tables extends Module {

	public $version = '1.0.0';

	public function info() {	
		return array(
			'name' => array(
				'en' => 'Tables',
			),
			'description' => array(
				'en' => 'Allows to add and edit suporting tables in the application',
			),
			'frontend' => NULL,
			'backend'  => TRUE,
			'menu'	  => NULL,
			'roles'     => array('create', 'view', 'edit', 'change_status'),
		);
	}
}