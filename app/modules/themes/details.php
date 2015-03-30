<?php defined('BASEPATH') or exit('No direct script access allowed');

/**
 * Themes Module
 *
 */
class Module_Themes extends Module {

	public $version = '1.0';

	public function info()
	{
		$info = array(
			'name' => array(
				'en' => 'Themes',
                                'se' => 'Teman'
			),
			'description' => array(
				'en' => 'Allows admins and staff to switch themes and manage theme options.',
                                'se' => 'Hantera webbplatsens utseende genom teman och hantera temainställningar.'
			),
			'frontend' => false,
			'backend'  => true,
			'menu'	  => 'design',
			'roles'     => array('create', 'view', 'edit', 'change_status')
		);

		return $info;
	}

}