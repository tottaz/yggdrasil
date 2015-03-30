<?php
/**
* @version 2010-12-03
* @package  TBEAR:JOBS
* @copyright Copyright (C) 2010 ThunderBear Design. All rights reserved.
* @link http://www.thunderbeardesign.com
* @license    GNU/GPL
*/

// Check to ensure this file is included in Joomla!
defined('_JEXEC') or die( 'Restricted access' );

jimport('joomla.application.component.controller');

class TbeartimesheetController extends JController {

	var $_params;
	
	function __construct() 	{

		global $mainframe;
		parent::__construct();
		$db = & JFactory::getDBO();
		$this->_params=& JComponentHelper::getParams('com_tbearjobs');
		
		$db->setQuery("SELECT * FROM `#__tbearjobs_config`");
		$tbearjobsConfigDb = $db->loadObjectList();
		
		$tbearjobsConfig = array();
		foreach ($tbearjobsConfigDb as $rowConfig) {
			$tbearjobsConfig[$rowConfig->ConfigName] = $rowConfig->ConfigValue;
		}
		//sets the tbearjobsConfig object in to the session
		$mainframe->setuserState('tbearjobsConfig',$tbearjobsConfig);	
	}

// Display the view
	function display() {
			parent::display();
	}	
	
// Departments	
	function departments() {
		JRequest::setVar('view','departments');
		JRequest::setVar('layout','default');
		parent::display();
	}

	function editdep() {
		JRequest::setVar('view','departments');
		JRequest::setVar('layout','edit');
		parent::display();
	}
	
	function listfeeds() {
		JRequest::setVar('view','feeds');
		JRequest::setVar('layout','default');
		parent::display();
	}
	
	function editfeeds() {
		JRequest::setVar('view','feeds');
		JRequest::setVar('layout','edit');
		parent::display();
	}

	function viewfeeds() {
		JRequest::setVar('view','feeds');
		JRequest::setVar('layout','viewfeed');
		parent::display();
	}	
//Settings
	function editsettings() {
		JRequest::setVar('view','settings');
		JRequest::setVar('layout','default');
		parent::display();
	}
}