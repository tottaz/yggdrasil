<?php
/**
 * @package JobBoard
 * @copyright Copyright (c)2010 Tandolin
 * @license GNU General Public License version 2, or later
 */

defined('_JEXEC') or die('Restricted access');


jimport('joomla.application.component.view');

class JobboardViewFeedback extends JView
{
	function display($tpl = null)
	{
 	   	$this->_addScripts();
        // $this->assignRef('data', JRequest::getVar('data',''));
        $this->assign('first_name', JRequest::getVar('first_name',''));
        $this->assign('filename', JRequest::getVar('filename',''));
        $this->assign('post', JRequest::getVar('post',''));
        $this->assign('result', JRequest::getVar('result',''));
		parent::display($tpl);
	}

	function _addScripts()
	{
	    $document =& JFactory::getDocument();
	    $document->addStyleSheet('components/com_jobboard/css/base.css');
	}
	
}

?>