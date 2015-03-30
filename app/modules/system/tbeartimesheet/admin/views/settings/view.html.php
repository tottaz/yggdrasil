<?php
/**
* @version 1.0
* @package TEAR:JOBS 1.0
* @copyright (C) 2009 by ThunderBear Design - All rights reserved!
* @license http://www.thunderbeardesign.com Copyrighted Commercial Software
*/


defined( '_JEXEC' ) or die( 'Restricted access' ); 
jimport( 'joomla.application.component.view');
jimport( 'joomla.application.component.model' );

class TbeartimesheetViewsettings extends JView {

	function display($tpl = null) {
		global $mainframe;
		
		$db = & JFactory::getDBO();		
		
		JSubMenuHelper::addEntry(JText::_('TBEARTIMESHEET_MENU_DASHBOARD'), 'index.php?option=com_tbeartimesheet');
		JSubMenuHelper::addEntry(JText::_('TBEARTIMESHEET_MENU_DEPARTMENTS'), 'index.php?option=com_tbeartimesheet&task=departments');
		JSubMenuHelper::addEntry(JText::_('TBEARTIMESHEET_MENU_SETTINGS'), 'index.php?option=com_tbeartimesheet&task=editsettings',true); 
		
		$task=JRequest::getVar('task','','request');
		$document 	= & JFactory::getDocument();

		switch($task) {
			case 'editsettings': {

				// Get behaviors
				JHTML::_('behavior.modal');
				JHTML::_('behavior.mootools');
				JHTML::_('behavior.tooltip');
				JHTML::_('behavior.switcher');

				// Import JPane
				jimport('joomla.html.pane');
				
				$params = array();
				$params['startOffset'] = JRequest::getInt('tabposition', 0);
				$pane =& JPane::getInstance('Tabs',$params,true);

				// Import Editor
				$editor =& JFactory::getEditor();
			
				JToolBarHelper::title(JText::_('TBEARTIMESHEET_SETTINGS'),'generic.png');
				JToolBarHelper::save();
				JToolBarHelper::cancel();
				JToolBarHelper::divider();
				JToolBarHelper::custom('tbeartimesheet','preview.png','preview_f2.png',JText::_('TBEARTIMESHEET_PRODUCT'),false);
				
				$task = JRequest::getVar('task', '');
				
				$ConfigList=$this->get('data');

				$avoidDuplicate[]=JHTML::_('select.option', '3','No duplicates on the DB');
				$avoidDuplicate[]=JHTML::_('select.option', '128','No duplicates on the same sections');
				$avoidDuplicate[]=JHTML::_('select.option', '254','Allow Duplicates');

				$lists['avoid.duplicate'] = JHTML::_('select.genericlist',  $avoidDuplicate, 'tbeartimesheetConfig[avoid.duplicate]', 'size="1" class="inputbox"', 'value', 'text', $ConfigList['avoid.duplicate']);
				  
				$sleepTime[] = JHTML::_('select.option', '1', '1 sec.');
				$sleepTime[] = JHTML::_('select.option', '3', '3 sec.');
				$sleepTime[] = JHTML::_('select.option', '5', '5 sec.');
				$sleepTime[] = JHTML::_('select.option', '10', '10 sec.');
				$sleepTime[] = JHTML::_('select.option', '15', '15 sec.');
				$sleepTime[] = JHTML::_('select.option', '20', '20 sec.');
				  
				$lists['sleep.time'] = JHTML::_('select.genericlist',  $sleepTime, 'tbeartimesheetConfig[sleep.time]', 'size="1" class="inputbox"', 'value', 'text', $ConfigList['sleep.time']);
				  
				$maxLoad[] = JHTML::_('select.option', '1', '1 processes' );
				$maxLoad[] = JHTML::_('select.option', '2', '2 processes' );
				$maxLoad[] = JHTML::_('select.option', '4', '4 processes' );
				$maxLoad[] = JHTML::_('select.option', '6', '6 processes' );
				$maxLoad[] = JHTML::_('select.option', '8', '8 processes' );
				$maxLoad[] = JHTML::_('select.option', '10', '10 processes');
				$maxLoad[] = JHTML::_('select.option', '12', '12 processes');

				$lists['server.maxload'] = JHTML::_('select.genericlist',  $maxLoad, 'tbeartimesheetConfig[server.maxload]', 'size="1" class="inputbox"', 'value', 'text', $ConfigList['server.maxload']);
				
				$elapsedDays[] = JHTML::_('select.option', '0', '0 days' );
				$elapsedDays[] = JHTML::_('select.option', '1', '1 days' );
				$elapsedDays[] = JHTML::_('select.option', '2', '2 days' );
				$elapsedDays[] = JHTML::_('select.option', '3', '3 days' );
				$elapsedDays[] = JHTML::_('select.option', '7', '7 days' );
				$elapsedDays[] = JHTML::_('select.option', '30', '30 days' );
				$elapsedDays[] = JHTML::_('select.option', '60', '60 days' );
		  
				$lists['elapsed.days'] = JHTML::_('select.genericlist',  $elapsedDays, 'tbeartimesheetConfig[elapsed.days]', 'size="1" class="inputbox"', 'value', 'text', $ConfigList['elapsed.days']);

				// Department
				
				$query="SELECT id, name FROM #__tbeartimesheet_departments";
				$db->setQuery($query);
				$dept_list = $db->loadObjectList();

				foreach ($dept_list as $deptpage) {
					$deptgrp[]=JHTML::_("select.option",$deptpage->id,$deptpage->name,"value","text");
				}
				$lists['default.dept']=JHTML::_("select.genericlist",$deptgrp,'tbeartimesheetConfig[default.dept]',"class='inputbox'","value","text",$ConfigList['default.dept']);

				// Country
				$query="SELECT country_id, country_name FROM #__tbeartimesheet_countries";
				$db->setQuery($query);
				$country_list = $db->loadObjectList();

				foreach ($country_list as $countrypage) {
					$countrygrp[]=JHTML::_("select.option",$countrypage->country_id,$countrypage->country_name,"value","text");
				}
				$lists['default.country']=JHTML::_("select.genericlist",$countrygrp,'tbeartimesheetConfig[default.country]',"class='inputbox'","value","text",$ConfigList['default.country']);

				// Job Types
				$query="SELECT id, type FROM #__tbeartimesheet_types";
				$db->setQuery($query);
				$types_list = $db->loadObjectList();

				foreach ($types_list as $typespage) {
					$typegrp[]=JHTML::_("select.option",$typespage->id,$typespage->type,"value","text");
				}
				$lists['default.jobtype']=JHTML::_("select.genericlist",$typegrp,'tbeartimesheetConfig[default.jobtype]',"class='inputbox'","value","text",$ConfigList['default.jobtype']);
				
				// Careers
				$query="SELECT id, description FROM #__tbeartimesheet_career_levels";
				$db->setQuery($query);
				$career_list = $db->loadObjectList();

				foreach ($career_list as $careerpage) {
					$careergrp[]=JHTML::_("select.option",$careerpage->id,$careerpage->description,"value","text");
				}
				$lists['default.career']=JHTML::_("select.genericlist",$careergrp,'tbeartimesheetConfig[default.career]',"class='inputbox'","value","text",$ConfigList['default.career']);

				// Education
				$query="SELECT id, level FROM #__tbeartimesheet_education";
				$db->setQuery($query);
				$edu_list = $db->loadObjectList();

				foreach ($edu_list as $edupage) {
					$edugrp[]=JHTML::_("select.option",$edupage->id,$edupage->level,"value","text");
				}
				$lists['default.education']=JHTML::_("select.genericlist",$edugrp,'tbeartimesheetConfig[default.education]',"class='inputbox'","value","text",$ConfigList['default.education']);

				// Categories
				$query="SELECT id, type FROM #__tbeartimesheet_categories";
				$db->setQuery($query);
				$cat_list = $db->loadObjectList();

				foreach ($cat_list as $catpage) {
					$catgrp[]=JHTML::_("select.option",$catpage->id,$catpage->type,"value","text");
				}				
				$lists['default.category']=JHTML::_("select.genericlist",$catgrp,'tbeartimesheetConfig[default.category]',"class='inputbox'","value","text",$ConfigList['default.category']);
							
				$this->assignRef('lists',$lists);
				$this->assignRef('data',$ConfigList);
				$this->assignRef( 'pane', $pane );
			
			} break;	
		}		
		parent::display($tpl);
	}
}