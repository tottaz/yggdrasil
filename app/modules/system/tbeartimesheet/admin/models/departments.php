<?php
/**
* @version 2010-12-03
* @package  TBEAR:JOBS
* @copyright Copyright (C) 2010 ThunderBear Design. All rights reserved.
* @link http://www.thunderbeardesign.com
* @license    GNU/GPL
*/

defined('_JEXEC') or die('Restricted access');
jimport('joomla.application.component.model');

class TbeartimesheetModelDepartments extends JModel {
	var $_total = null;
	var $_pagination = null;
	var $_search = null;
	var $_query = null;
	var $data = null;

	function __construct() {
		parent::__construct();
 		$this->_buildQuery();
        global $mainframe, $option;
 
        // Get pagination request variables
        $limit = $mainframe->getUserStateFromRequest('global.list.limit', 'limit', $mainframe->getCfg('list_limit'), 'int');
        $limitstart = JRequest::getVar('limitstart', 0, '', 'int');
 
        // In case limit has been changed, adjust it
        $limitstart = ($limit != 0 ? (floor($limitstart / $limit) * $limit) : 0);
 
        $this->setState('limit', $limit);
        $this->setState('limitstart', $limitstart);
	}

	function getTotal() {
		// Load the content if it doesn't already exist
		if (empty($this->_total)) {
			$this->_total = $this->_getListCount($this->_query);    
		}
		return $this->_total;
	}
	
	function getPagination() {
        // Load the content if it doesn't already exist
        if (empty($this->_pagination)) {
            jimport('joomla.html.pagination');
            $this->_pagination = new JPagination($this->getTotal(), $this->getState('limitstart'), $this->getState('limit') );
        }
        return $this->_pagination;
	}

	function getData() {
		global $mainframe;
		
		if(empty($this->data)) {
			$this->data = $this->_getList($this->_query, $this->getState('limitstart'), $this->getState('limit'));
			$this->count = $this->getTotal();
			$mainframe->setUserState('jbcllist.count',$this->count);
		}
		return $this->data;
	}
	
	function getSearch() {
		if(!$this->_search) {
			global $mainframe, $option;
			$search = $mainframe->getUserStateFromRequest("$option.search", 'search', '', 'string');
			$this->_search = JString::strtolower($search);
		}
		return $this->_search;
	}

	function _buildQuery() {
		
		global $mainframe;
		$db =& JFactory::getDBO();
		
		$filter = JRequest::getVar('tb_filter');
		$page_level_filter=JRequest::getVar('tb_page_level_filter');
		
		$sortOrder=JRequest::getVar('filter_order_Dir','asc');
		$sortColumn=JRequest::getVar('filter_order','name');
		
		$this->_query="SELECT * "
						."FROM #__tbeartimesheet_departments "
						."WHERE (name LIKE '%".$db->getEscaped($filter)."%' OR contact_name LIKE '%".$db->getEscaped($filter)."%') "
						."ORDER BY $sortColumn $sortOrder ";
	}
}
?>