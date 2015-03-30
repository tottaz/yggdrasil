<?php defined('BASEPATH') or exit('No direct script access allowed');

/**
 * Contact module
 *
 * @author  Totta
 * @package greengarden\core\modules\analysis
 */
class Module_Analysis extends Module
{

	public $version = '1.0.0';

	public function info()
	{
		return array(
			'name' => array(
				'en' => 'Analysis',
				'se' => 'Analyst'
			),
			'description' => array(
				'en' => 'Analyzing data',
				'se' => 'Analyzing'
			),
			'frontend' => false,
			'backend' => false,
			'menu' => false,
			'roles'     => array('create', 'view', 'edit', 'change_status'),
		);
	}
}