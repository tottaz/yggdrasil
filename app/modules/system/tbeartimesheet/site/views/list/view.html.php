<?php
/**
 * @package JobBoard
 * @copyright Copyright (c)2010 Tandolin
 * @license GNU General Public License version 2, or later
 */

defined('_JEXEC') or die('Restricted access');

jimport('joomla.application.component.view');

class JobboardViewList extends JView
{
	function display($tpl = null)
	{

        jimport('joomla.utilities.date');

        global $mainframe;

        $daterange = $mainframe->getUserStateFromRequest("$option.daterange", 'daterange', 0, 'int');
		$layout = $mainframe->getUserStateFromRequest('jb_list.layout','layout','');
        $this->_addScripts($layout);
        $data =& $this->get('data');
		$search = $this->get('search');
        $this->assignRef('data', $data);
        $this->assignRef('categories', JRequest::getVar('categories',''));
		$this->assign('daterange', intval($daterange));
        $this->assign('selcat', JRequest::getVar('selcat',''));
		$this->assign('search', $search);
		$this->assign('keysrch', JRequest::getVar('keysrch',''));
		$this->assign('locsrch', JRequest::getVar('locsrch',''));

        $document =& JFactory::getDocument();

		parent::display($tpl);
	}

	function _addScripts($layout)
	{
	    JHTML::_('behavior.mootools');
	    $layout = ($layout == '')? "table" : $layout;
	    $document =& JFactory::getDocument();
	    $document->addStyleSheet('components/com_jobboard/css/base.css');
	    $document->addStyleSheet('components/com_jobboard/css/'.$layout.'_layout.css');
	    $document->addScript('components/com_jobboard/js/list.js');
        $document->setMetaData('robots', 'index,nofollow');
        $document->setGenerator('Job Board for Joomla!1.5.x by www.tandolin.co.za');
	}
}

?>