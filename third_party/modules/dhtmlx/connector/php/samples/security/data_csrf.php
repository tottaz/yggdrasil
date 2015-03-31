<?php
	require_once("../config.php");

	$res=mysql_connect($mysql_server,$mysql_user,$mysql_pass);
	mysql_select_db($mysql_db);

	require("../../codebase/data_connector.php");

	ConnectorSecurity::$security_key = true;

	$grid = new JSONDataConnector($res);
	$grid->set_limit(10);
	$grid->render_table("grid50000","item_id","item_nm,item_cd");
?>