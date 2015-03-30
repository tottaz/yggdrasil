<?php
/**
* @version 2010-12-03
* @package  TBEAR:TIMESHEET
* @copyright Copyright (C) 2010 ThunderBear Design. All rights reserved.
* @link http://www.thunderbeardesign.com
* @license    GNU/GPL
*/

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );


class TbeartimesheetControllersettings extends tbeartimesheetController {

	function __construct() {
		parent::__construct();
		// Register Extra tasks
		$this->registerTask( 'add' , 'edit' );
		$this->registerTask('apply' ,  'save');
	}

	/**
	 * save a record (and redirect to main page)
	 * @return void
	 */
	function save() {
		global $mainframe;
		
//		$model = $this->getModel('settings');
		$db = & JFactory::getDBO();
		$post = JRequest::get('post',JREQUEST_ALLOWRAW);
		$tbeartimesheetConfigPost = $post['tbeartimesheetConfig'];

		$organisation = $post['organisation'];
		$city = $post['city'];
		$from = $post['from'];
		$reply = $post['reply'];
		
		$db->setQuery("SELECT * FROM `#__tbeartimesheet_config`");
		$tbeartimesheetConfigDb = $db->loadObjectList();
		foreach ($tbeartimesheetConfigDb as $objConfig) {  
			if(isset($tbeartimesheetConfigPost[$objConfig->ConfigName])) {
				$db->setQuery("UPDATE #__tbeartimesheet_config SET ConfigValue='".$tbeartimesheetConfigPost[$objConfig->ConfigName]."' WHERE ConfigName='".$objConfig->ConfigName."'");
				$db->query();
				$tbeartimesheetConfig[$objConfig->ConfigName] = $tbeartimesheetConfigPost[$objConfig->ConfigName];
			}
		}
//
//		Work around to fit text updates from settings as they are not in the array on arrival
//		
		$db->setQuery("UPDATE #__tbeartimesheet_config SET ConfigValue='".$organisation."' WHERE ConfigName='organisation'");
		$db->query();
		$db->setQuery("UPDATE #__tbeartimesheet_config SET ConfigValue='".$from."' WHERE ConfigName='from.mail'");
		$db->query();
		$db->setQuery("UPDATE #__tbeartimesheet_config SET ConfigValue='".$city."' WHERE ConfigName='default.city'");
		$db->query();
		$db->setQuery("UPDATE #__tbeartimesheet_config SET ConfigValue='".$reply."' WHERE ConfigName='reply.to'");
		$db->query();
		
		$mainframe->setUserState('tbeartimesheetConfig',$tbeartimesheetConfig);
		$msg = JText::_('TBEARJOBS_SETTINGS_SAVE');
		$tabposition = JRequest::getInt('tabposition', 0);
		$link = 'index.php?option=com_tbeartimesheet&task=editsettings&tabposition='.$tabposition;
		$this->setRedirect($link, $msg);
	}	
	
	function close() {
		$this->setRedirect( 'index.php?option=com_tbeartimesheet');
	}
	
	function cancel() {
		$this->setRedirect( 'index.php?option=com_tbeartimesheet');
	}
}