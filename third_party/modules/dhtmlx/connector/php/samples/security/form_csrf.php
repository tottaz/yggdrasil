<?php
	require_once("../config.php");

	$res=mysql_connect($mysql_server,$mysql_user,$mysql_pass);
	mysql_select_db($mysql_db);

	require("../../codebase/form_connector.php");

	ConnectorSecurity::$security_key = true;

	$_GET["id"] = 810;

	$grid = new FormConnector($res);
	$grid->render_table("grid50000","item_id","item_nm,item_cd");
?>