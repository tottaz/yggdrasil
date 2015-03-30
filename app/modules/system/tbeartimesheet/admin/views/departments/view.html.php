<?php
/**
* @version 1.0
* @package TEAR:JOBS 1.0
* @copyright (C) 2009 by ThunderBear Design - All rights reserved!
* @license http://www.thunderbeardesign.com Copyrighted Commercial Software
*/

defined('_JEXEC') or die('Restricted access');

jimport( 'joomla.application.component.view');
jimport( 'joomla.application.component.model' );

class TbeartimesheetViewDepartments extends JView {
	function display($tpl = null) {
		global $mainframe, $option;
				
		JSubMenuHelper::addEntry(JText::_('TBEARTIMESHEET_MENU_DASHBOARD'), 'index.php?option=com_tbeartimesheet');
		JSubMenuHelper::addEntry(JText::_('TBEARTIMESHEET_MENU_DEPARTMENTS'), 'index.php?option=com_tbeartimesheet&task=departments',true);
		JSubMenuHelper::addEntry(JText::_('TBEARTIMESHEET_MENU_CONFIGURATION'), 'index.php?option=com_tbeartimesheet&task=editsettings');
		
		$task = JRequest::getVar('task','','request');
		$document 	= & JFactory::getDocument();
		
		switch($task) {
			case 'departments': {
		
				JToolBarHelper::title(JText::_('TBEARTIMESHEET_DEPARTMENTS'),'generic.png');
						
				JToolBarHelper::addNewX('editdep');
				JToolBarHelper::editListX('editdep');
				JToolBarHelper::deleteList("Are you sure you want to delete?", 'remove' , "Delete");
				JToolBarHelper::divider();

				JToolBarHelper::custom('tbeartimesheet','preview.png','preview_f2.png',JText::_('TBEARTIMESHEET_PRODUCT'),false);

				$filter		   = JRequest::getVar('tb_filter');
				$status_filter = JRequest::getVar('tb_status_filter');

				$sortColumn	=JRequest::getVar('filter_order','name');
				$sortOrder	=JRequest::getVar('filter_order_Dir','asc');
				
				$pagination =& $this->get('pagination');
				$rows =& $this->get('data');
			
				$this->assignRef('lists', $lists);
				$this->assignRef('filter',$filter);
				$this->assignRef('sortColumn',$sortColumn);
				$this->assignRef('sortOrder',$sortOrder);
				$this->assignRef('rows',$rows);			
				$this->assignRef('pagination',$pagination);
				$this->assignRef('tbeartimesheetConfig',$mainframe->getuserState('tbeartimesheetConfig'));
				
			} break;
			case 'editdep': {

				$doc =& JFactory::getDocument();
				$style = " .icon-48-applicant_details {background-image:url(components/com_tbeartimesheet/images/applicant_details.png); no-repeat; }";
				$doc->addStyleDeclaration( $style );
				
				JToolBarHelper::title(JText::_('TBEARTIMESHEET_DEPARTMENTS'),'generic.png');
				JToolBarHelper::save();
				JToolBarHelper::cancel();
				JToolBarHelper::divider();
				JToolBarHelper::custom('tbeartimesheet','preview.png','preview_f2.png',JText::_('TBEARTIMESHEET_PRODUCT'),false);						
			
				$task = JRequest::getVar('task', '');
				$row =& JTable::getInstance('Department','Table');
				$cid = JRequest::getVar('cid', array(0), '', 'array');
				$id = intval($cid[0]);
				$row->load($id);
				if ($id < 1) {                
					$config =& JTable::getInstance('Config','Table');
					$config->load(1);
					$this->assignRef('config',$config);
				}
				$layout = JRequest::setVar('layout','edit');

				$this->assignRef('row',$row);
			}
		}
		parent::display($tpl);
	}
}
?>