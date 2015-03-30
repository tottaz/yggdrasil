<?php defined('BASEPATH') or exit('No direct script access allowed');

class Module_Servicedesk extends Module {

	public $version = '1.0.0';

	public function info() {	
		return array(
			'name' => array(
				'en' => 'Service Desk',
			),
			'description' => array(
				'en' => 'Exprimental Module for IT Service Desk',
			),
			'frontend' => NULL,
			'backend'  => TRUE,
			'menu'	  => NULL,
			'roles'     => array('create', 'view', 'edit', 'change_status'),
		);
	}
}