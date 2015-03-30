<?php
/**
* @version 2010-12-03
* @package  TBEAR:JOBS
* @copyright Copyright (C) 2010 ThunderBear Design. All rights reserved.
* @link http://www.thunderbeardesign.com
* @license    GNU/GPL
*/

// Protect from unauthorized access
defined('_JEXEC') or die('Restricted Access');
 
//JTable::addIncludePath(JPATH_COMPONENT.DS.'tables');
jimport('joomla.application.component.controller');

class TbeartimesheetControllerDepartments extends JController {

	/**
	 * constructor (registers additional tasks to methods)
	 * @return void
	 */
	function __construct() {
		parent::__construct();

		// Register Extra tasks
		$this->registerTask( 'add' , 'edit' );
		$this->registerTask('apply' ,  'save');
	}
	 
	function save() {
	// Check for request forgeries
		JRequest::checkToken() or die( 'Invalid Token' );

		$id   =  JRequest::getVar('id','','post','int');		
		$post = JRequest::get('post',JREQUEST_ALLOWRAW);
		$row = & JTable::getInstance('Department','Table');

		if(!$row->bind($post)) {
			return JError::raiseWarning(500, $row->getError());
		}
	
		if ($row->store()) {
			$msg = JText::_('TBEARJOBS_DEPARTMENT_SAVE' );
		} else {
			JError::raiseWarning(500, $row->getError());
			$msg = JText::_('TBEARJOBS_DEPARTMENT_SAVE_ERROR' );
		}

		switch(JRequest::getCmd('task')) {
			case 'apply' :
					$link = 'index.php?option=com_tbeartimesheet&task=editdep&cid='.$row->id;
			break;
			
			case 'save' :
					$link = 'index.php?option=com_tbeartimesheet&task=departments';
			break;
		}
		$this->setRedirect($link, $msg);		
	}
	
	function remove() {
        $cid = JRequest::getVar('cid', false, 'DEFAULT', 'array');
        
		if($cid) $id = $cid[0];
        else $id = JRequest::getInt('id', 0);

        if($id == 1) {
				$msg = JText::_('TBEARFILL_CANNOT_DELETE' );
				$this->setRedirect( 'index.php?option=com_tbeartimesheet&task=departments', $msg , 'error'); 				
        } else {
          $table = JTable::getInstance('departments', 'Table');
           if (!$table->delete($id)) {
				$msg = JText::_('TBEARFILL_FAILED_DELETE' );
				$this->setRedirect( 'index.php?option=com_tbeartimesheet&task=departments', $msg , 'error'); 				
          } else {
			$msg = JText::_('TBEARFILL_LEVEL_DELETE' );
			$this->setRedirect( 'index.php?option=com_tbeartimesheet&task=departments', $msg ); 		  
          }
        }
	}
	
	function edit() {
	    $doc =& JFactory::getDocument();
        $style = " .icon-48-applicant_details {background-image:url(components/com_tbeartimesheet/images/applicant_details.png); no-repeat; }";
        $doc->addStyleDeclaration( $style );

        $status_model =& $this->getModel('Statuses');
        $statuses = $status_model->getStatuses();
        $departments = $status_model->getDepartments();
        JRequest::setVar('statuses', $statuses);
        JRequest::setVar('departments', $departments);
		
		JRequest::setVar('view','applicant');
	}

	function close() {
		$this->setRedirect( 'index.php?option=com_tbeartimesheet');
	}
	
	function cancel() {
		$this->setRedirect( 'index.php?option=com_tbeartimesheet');
	}
}
?>