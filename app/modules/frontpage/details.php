<?php defined('BASEPATH') or exit('No direct script access allowed');

/**
 * Settings module
 *
 * Ananas  
 *
 * A simple, fast, development framework for web applications and software licenses software
 *
 * @package		Ananas
 * @author		Ananas Dev Team
// ------------------------------------------------------------------------
*/
class Module_Frontpage extends Module {

	public $version = '1.0';

	public function info()
	{
		return array(
			'name' => array(
				'en' => 'Frontpage',
			),
			'description' => array(
				'en' => 'The Static Home Page',
			)
                    );
	}        
}