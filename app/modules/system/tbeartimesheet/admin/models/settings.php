<?php
/**
* @version 2010-12-03
* @package  TBEAR:JOBS
* @copyright Copyright (C) 2010 ThunderBear Design. All rights reserved.
* @link http://www.thunderbeardesign.com
* @license    GNU/GPL
*/
defined('_JEXEC') or die();
 
jimport( 'joomla.application.component.model' );

class TbeartimesheetModelsettings extends JModel {
	var $_query;
	var $_data;
	var $_total=null;
	var $_pagination=null;
	var $_componentList=null;
	
	function _buildQuery() {
		$this->_query="SELECT IdConfig as RecordId, ConfigName , ConfigValue FROM #__tbeartimesheet_config";
	}
	
	function __construct() {	
		parent::__construct();
		$this->_buildQuery();
		global $mainframe, $option;
	}
	
	function getData() {
		if (empty($this->_data)) {
			$this->_data=$this->_getList($this->_query);
		}
		
		$tbeartimesheetConfig = array();
		foreach($this->_data as $i => $objConfig) {
			$tbeartimesheetConfig[$objConfig->ConfigName] = $objConfig->ConfigValue;
		}
		return $tbeartimesheetConfig;
	}
}