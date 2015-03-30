<?php
/**
* @version 2010-12-03
* @package  TBEAR:JOBS
* @file administrator/components/com_tbearjobs/uninstall.tbearjobs.php
* @copyright Copyright (C) 2010 ThunderBear Design. All rights reserved.
* @link http://www.thunderbeardesign.com
* @license    GNU/GPL
*/

// Protect from unauthorized access
defined('_JEXEC') or die('Restricted Access');

jimport('joomla.application.component.controller');

// Get the view and controller from the request, or set to default if they weren't set
 JRequest::setVar('view', JRequest::getCmd('view','query'));
 JRequest::setVar('cont', JRequest::getCmd('view','query')); // Get controller based on the selected view

jimport('joomla.filesystem.file');

// Load the appropriate controller
$cont = JRequest::getCmd('cont','query');
$path = JPATH_COMPONENT.DS.'controllers'.DS.$cont.'.php';
if(JFile::exists($path)) {
	// The requested controller exists and there you load it...
	require_once($path);
} else {
	// Invalid controller was passed
	JError::raiseError('500',JText::_('Unknown controller' . $path));
}
?>