<?php
	require_once("../config.php");

	$res=mysql_connect($mysql_server,$mysql_user,$mysql_pass);
	mysql_select_db($mysql_db);

	require("../../codebase/scheduler_connector.php");

	ConnectorSecurity::$security_key = true;

	$_GET["id"] = 810;

	$grid = new JSONSchedulerConnector($res);
	$grid->render_table("events","event_id","start_date, end_date, event_name");
?>