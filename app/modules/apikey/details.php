<?php defined('BASEPATH') or exit('No direct script access allowed');

class Module_Apikey extends Module
{
	public $version = '1.0';

	public function info()
	{	
		return array(
			'name' => array(
				'en' => 'Apikey',
			),
			'description' => array(
				'en' => 'Module to get an API Key.',
			),
			'frontend' => TRUE,
			'backend'  => TRUE,
			'menu'	  => 'admin',
			
			'roles' => array(
				'view', 'create', 'edit', 'delete',
			),			
		);
	}
}
/* End of file details.php */