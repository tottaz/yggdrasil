<?php
/**
 * @package JobBoard
 * @copyright Copyright (c)2010 Tandolin
 * @license GNU General Public License version 2, or later
 */

defined('_JEXEC') or die('Restricted access');

jimport('joomla.application.component.view');

class JobboardViewQuery extends JView
{
	function display($tpl = null)
	{

        global $mainframe,$option;

        $config = JRequest::getVar('config','');
        $default_daterange = $config->default_post_range;
        $daterange = $mainframe->getUserStateFromRequest("$option.daterange", 'daterange', $default_daterange, 'int');
		$layout = $mainframe->getUserStateFromRequest('jb_list.layout','layout','list', 'string');
        $this->_addScripts($layout);

        $this->assignRef('categories', JRequest::getVar('categories',''));
		$this->assignRef('config', $config);
		$this->assign('daterange', intval($daterange));
        $this->assign('selcat', JRequest::getVar('selcat',''));
		$this->assign('search', JRequest::getVar('search',''));
		$this->assign('keysrch', JRequest::getVar('keysrch',''));
		$this->assign('locsrch', JRequest::getVar('locsrch',''));
		$this->assign('layout', $layout);

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