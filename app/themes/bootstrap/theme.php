<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Theme_Bootstrap extends Theme
{
  public $version			= '1.0';

  public $name				= 'Bootstrap';
  public $author			= 'Torbjorn Zetterlund';
  public $author_website	= 'http://torbjornzetterlund.com';
  public $description		=  'Admin HTML responsive template, based on Bootstrap.';
  public $website			= 'http://bootswatch.com';
  public $options 			= array(
		'show_breadcrumbs' 	=> array(
		'title'         => 'Do you want to show breadcrumbs?',
		'description'   => 'If selected it shows a string of breadcrumbs at the top of the page.',
		'default'       => 'Yes',
		'type'          => 'radio',
		'options'       => 'yes=Yes|no=No',
		'is_required'   => TRUE
		),
	);
	/**
	 * Run() is triggered when the theme is loaded for use
	 *
	 * This should contain the main logic for the theme.
	 *
	 * @access	public
	 * @return	void
	 */
	public function run()
	{
	}  
}