<?php
/**
* @version 1.1
* @package TEAR:FILL 1.1
 * @copyright (C) 2009 by ThunderBear Design - All rights reserved!
 * @license http://www.thunderbeardesign.com Copyrighted Commercial Software
*/

defined('_JEXEC') or die();
 
jimport( 'joomla.application.component.model' );

class tbearfillModelFeeds extends JModel {
	var $_query;
	var $_data;
	var $_total=null;
	var $_pagination=null;
	var $_componentList=null;
	
	function _buildQuery() {
		global $mainframe;
		$db =& JFactory::getDBO();
		$filter = JRequest::getVar('tb_filter');
		$md5_descr = JRequest::getVar('md5_descr');
		$md5_title = JRequest::getVar('md5_title');
		$page_level_filter=JRequest::getVar('tb_page_level_filter');
				
		if(!empty($md5_descr))
			$descr_filter = " AND MD5(fulltext) = '".$db->getEscaped($md5_descr)."' ";
		else
			$descr_filter = "";

		if(!empty($md5_title))
			$title_filter = " AND MD5(title) = '".$db->getEscaped($md5_title)."' ";
		else
			$title_filter = "";
		
		$status_filter=JRequest::getVar('tb_status_filter');
		if($status_filter!=null)
			$status_query="AND published = '".$db->getEscaped($status_filter)."'";
		else
			$status_query="";
		
		$sortOrder=JRequest::getVar('filter_order_Dir','asc');
		$sortColumn=JRequest::getVar('filter_order','title');
		
		$this->_query="SELECT `id`, `published`, `feed_url`, `created`, `sectionid`, `keywords`, `checked_out`, `checked_out_time`, `catid`, `validfor`, `twittertext`, `autounpublish`, `twitter`, `delay`, `fulltext`, `title`, `posterid`, `origdate`, `imgremove`, `negkey`, `username`, `password`, `createddate`, `tags`, `linkremove`, `origauthor`, `acgroup`, `removetext`, `texttitle`, `tweets` "
						."FROM #__tbearfill_entries "
						."WHERE (feed_url LIKE '%".$db->getEscaped($filter)."%' OR title LIKE '%".$db->getEscaped($filter)."%') $status_query $descr_filter $title_filter"
						."ORDER BY $sortColumn $sortOrder ";
		//echo $this->_query;
	}
	
	function __construct() {	
		parent::__construct();
		$this->_buildQuery();
		global $mainframe, $option;

		// Get pagination request variables
		$limit = $mainframe->getUserStateFromRequest($option.'.tbearfill.limit', 'limit', $mainframe->getCfg('list_limit'), 'int');
		$limitstart = $mainframe->getUserStateFromRequest($option.'.tbearfill.limitstart', 'limitstart', 0, 'int');

		// In case limit has been changed, adjust it
		$limitstart = ($limit != 0 ? (floor($limitstart / $limit) * $limit) : 0);

		$this->setState($option.'.tbearfill.limit', $limit);
		$this->setState($option.'.tbearfill.limitstart', $limitstart);
	}
	
	function getData() {
		global $option;
		if (empty($this->_data)) {
			$this->_data=$this->_getList($this->_query,$this->getState($option.'.tbearfill.limitstart'), $this->getState($option.'.tbearfill.limit'));
		}
		return $this->_data;
	}
	
	function getTotal() {
		// Load the content if it doesn't already exist
		if (empty($this->_total)) {
			$this->_total = $this->_getListCount($this->_query);	
		}
		return $this->_total;
	}
	function getPagination() {
		global $option;
		// Load the content if it doesn't already exist
		if (empty($this->_pagination)) {
			jimport('joomla.html.pagination');
			$this->_pagination = new JPagination($this->getTotal(), $this->getState($option.'.tbearfill.limitstart'), $this->getState($option.'.tbearfill.limit'));
		}
		return $this->_pagination;
	}
	
	function getPage() {
		$cid= JRequest::getVar('cid',0,'request');
		if(is_array($cid)) $cid=$cid[0];
		$row= & JTable::getInstance('Tbearfill','Table');
		$row->load($cid);
		
		return $row;
	}
}