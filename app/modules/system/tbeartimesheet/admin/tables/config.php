<?php
/**
* @version 1.0
* @package TEAR:JOBS 1.0
* @copyright (C) 2009 by ThunderBear Design - All rights reserved!
* @license http://www.thunderbeardesign.com Copyrighted Commercial Software
*/

defined('_JEXEC') or die('Restricted access');

class TableConfig extends JTable {
	var $id = null;
	var $from_mail = null;
	var $organisation = null;
	var $reply_to = null;
	var $default_dept = null;
	var $default_country = null;
	var $default_city = null;
    var $default_jobtype = null;
    var $default_career = null;
    var $default_edu = null;
	var $default_category = null;
	var $default_post_range = null;
	var $allow_unsolicited = null;
	var $dept_notify_admin = null;
	var $dept_notify_contact = null;

	function __construct(&$db) {
		parent::__construct('#__tbearjobs_config','id',$db);
	}
}
?>