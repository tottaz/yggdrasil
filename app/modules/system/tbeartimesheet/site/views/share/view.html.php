<?php
/**
 * @package JobBoard
 * @copyright Copyright (c)2010 Tandolin
 * @license GNU General Public License version 2, or later
 */

defined('_JEXEC') or die('Restricted access');


jimport('joomla.application.component.view');

class JobboardViewShare extends JView
{
	function display($tpl = null)
	{
 	   	$this->_addScripts();
        $this->assignRef('data', JRequest::getVar('data',''));
        $this->assign('id', JRequest::getVar('job_id',''));
        $this->assign('catid', JRequest::getVar('catid',''));
        $this->assign('msg', JRequest::getVar('msg',''));

        $document =& JFactory::getDocument();
        $document->setTitle(JText::_('Email job').': '.$this->data->job_title. ', '.$this->data->city);
        $document->setGenerator('Job Board for Joomla!1.5.x by www.tandolin.co.za');
		parent::display($tpl);
	}

	function _addScripts()
	{
	    $document =& JFactory::getDocument();
	    $document->addStyleSheet('components/com_jobboard/css/base.css');
	    $document->addStyleSheet('components/com_jobboard/css/share.css');
	}
}

?>