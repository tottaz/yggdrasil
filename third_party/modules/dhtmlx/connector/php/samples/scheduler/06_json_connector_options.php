<?php
	include ('../../codebase/scheduler_connector.php');
	include ('../config.php');
	$res=mysql_connect($mysql_server,$mysql_user,$mysql_pass);
    mysql_select_db($mysql_db);

	$list = new JSONOptionsConnector($res);
	$list->render_table("types","typeid","typeid(value),name(label)");

	$scheduler = new JSONSchedulerConnector($res);
//	$scheduler->enable_log("log.txt",true);

	$scheduler->set_options("type", $list);
	$scheduler->render_table("tevents","event_id","start_date,end_date,event_name,type");
?>