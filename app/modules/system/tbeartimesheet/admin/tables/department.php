<?php
/**
* @version 1.0
* @package TEAR:JOBS 1.0
* @copyright (C) 2009 by ThunderBear Design - All rights reserved!
* @license http://www.thunderbeardesign.com Copyrighted Commercial Software
*/

defined('_JEXEC') or die('Restricted access');

class TableDepartment extends JTable {
	var $id = null;
	var $name = null;
	var $contact_name = null;
	var $contact_email = null;
	var $notify = null;
	var $notify_admin = null;
    var $acceptance_notify = null;
    var $rejection_notify = null;

	function __construct(&$db) {
		parent::__construct('#__tbearjobs_departments','id',$db);
	}
}
?>
