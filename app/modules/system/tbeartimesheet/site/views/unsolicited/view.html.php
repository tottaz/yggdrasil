<?php
/**
 * @package JobBoard
 * @copyright Copyright (c)2010 Tandolin
 * @license GNU General Public License version 2, or later
 */

defined('_JEXEC') or die('Restricted access');


jimport('joomla.application.component.view');

class JobboardViewUnsolicited extends JView
{
	function display($tpl = null)
	{
 	   	$this->_addScripts();
        $this->assign('catid', JRequest::getVar('catid',''));
        $this->assign('errors', JRequest::getVar('errors',''));

        $document =& JFactory::getDocument();
        $document->setTitle('Submit your CV');
        $document->setMetaData('robots', 'index,nofollow');
        $document->setMetaData('keywords', 'submit, job, cv, resume');
        $document->setMetaData('description', 'Submit your cv online');
        $document->setGenerator('Job Board for Joomla!1.5.x by www.tandolin.co.za');
		parent::display($tpl);
	}

	function _addScripts()
	{
	    $document =& JFactory::getDocument();
	    $document->addStyleSheet('components/com_jobboard/css/base.css');
	    $document->addStyleSheet('components/com_jobboard/css/unsolicited_cv.css');
	    $document->addScript('components/com_jobboard/js/submit.js');
	}
	
}

?>