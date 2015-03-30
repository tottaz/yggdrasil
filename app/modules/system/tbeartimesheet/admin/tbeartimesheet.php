<?php
/**
* @version 2010-12-03
* @package  TBEAR:JOBS
* @copyright Copyright (C) 2010 ThunderBear Design. All rights reserved.
* @link http://www.thunderbeardesign.com
* @license    GNU/GPL
*/

defined('_JEXEC') or die('Restricted Access');

global $mainframe;

define('TBEARTIMESHEET_PRODUCT','TBEAR:JOBS');
define('TBEARTIMESHEET_VERSION','1.0');
define('TBEARTIMESHEET_REVISION','0');
define('TBEARTIMESHEET_COPYRIGHT','&copy;2010 www.thunderbeardesign.com');
define('TBEARTIMESHEET_LICENSE','GPL License');
define('TBEARTIMESHEET_AUTHOR','<a href="http://www.thunderbeardesign.com" target="_blank">www.thunderbeardesign.com</a>');

if(JRequest::getVar( 'task' ) != 'main' || JRequest::getVar( 'task' ) != 'tbeartimesheet' || JRequest::getVar( 'task' ) != '')

if(version_compare('5.0.0',PHP_VERSION,'<') == false)
	if(!JRequest::getVar( 'php' ))
			$mainframe->redirect('index.php?option=com_tbeartimesheet&php=1',JText::_('TBEAR_ONLY_PHP5'));
	else return;

// Require the base controller
require_once(JPATH_SITE.DS.'administrator'.DS.'components'.DS.'com_tbeartimesheet'.DS.'controllers'.DS.'controller.php' );
//require_once(JPATH_SITE.DS.'administrator'.DS.'components'.DS.'com_tbeartimesheet'.DS.'helpers'.DS.'helper.php');

//require the database tables
JTable::addIncludePath(JPATH_COMPONENT_ADMINISTRATOR.DS.'tables');

$tbeartimesheetConfig = $mainframe->getUserState('tbeartimesheetConfig');

if($tbeartimesheetConfig['enable.debug']) {
	error_reporting(E_ALL);
	ini_set('display_errors',true);
}

// Require specific controller if requested
if ($controller = JRequest::getWord('controller')) {
	$path = JPATH_COMPONENT.DS.'controllers'.DS.$controller.'.php';
	if (file_exists($path)) {
		require_once $path;
	} else {
		$controller = '';
	}
}

// Create the controller
$classname	= 'TbeartimesheetController'.$controller;
$controller	= new $classname();

print_r($controller);

$document =& JFactory::getDocument();
$document->addStyleSheet(JURI :: root().'administrator/components/com_tbeartimesheet/assets/css/style.css');	

// Perform the Request task
$controller->execute( JRequest::getVar( 'task' ) );

// Redirect if set by the controller
$controller->redirect();