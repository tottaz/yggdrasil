<?php defined('BASEPATH') or exit('No direct script access allowed');

/**
 * Contact module
 *
 * @author  Totta
 * @package core\modules\analysis
 */
class Module_Newssearch extends Module
{

	public $version = '1.0.0';

	public function info()
	{
		return array(
			'name' => array(
				'en' => 'Search News',
				'se' => 'Sok Nyheter'
			),
			'description' => array(
				'en' => 'Search News',
				'se' => 'Sok Nyheter'
			),
			'frontend' => false,
			'backend' => false,
			'menu' => false,
			'roles'     => array('create', 'view', 'edit', 'change_status'),
		);
	}
}