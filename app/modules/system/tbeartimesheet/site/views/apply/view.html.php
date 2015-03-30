<?php
/**
 * @package JobBoard
 * @copyright Copyright (c)2010 Tandolin
 * @license GNU General Public License version 2, or later
 */

defined('_JEXEC') or die('Restricted access');


jimport('joomla.application.component.view');

class JobboardViewApply extends JView
{
	function display($tpl = null)
	{
 	   	$this->_addScripts();
        $this->assignRef('data', JRequest::getVar('data',''));
        $this->assign('appl', JRequest::getVar('appl',''));
        $this->assign('id', JRequest::getVar('job_id',''));
        $this->assign('catid', JRequest::getVar('catid',''));
        $this->assign('errors', JRequest::getVar('errors',''));

        $document =& JFactory::getDocument();
        $document->setTitle($this->data->job_title. ', '.$this->data->city.' '.$this->data->post_date.' (UTC)');
        $document->setMetaData('robots', 'index,nofollow');
        $document->setMetaData('keywords', 'apply, job, '.$this->data->job_title.', '.$this->data->city);
        $document->setMetaData('description', 'Apply online for the job: '.$this->data->job_title.', '.$this->data->city);
        $document->setGenerator('Job Board for Joomla!1.5.x by www.tandolin.co.za');
		parent::display($tpl);
	}

	function _addScripts()
	{
	    $document =& JFactory::getDocument();
	    $document->addStyleSheet('components/com_jobboard/css/base.css');
	    $document->addStyleSheet('components/com_jobboard/css/apply.css');
	    $document->addScript('components/com_jobboard/js/submit.js');
	}
	
}

?>