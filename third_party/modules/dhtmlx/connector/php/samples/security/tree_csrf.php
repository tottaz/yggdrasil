<?php
	require_once("../config.php");

	$res=mysql_connect($mysql_server,$mysql_user,$mysql_pass);
	mysql_select_db($mysql_db);

	require("../../codebase/tree_connector.php");

	ConnectorSecurity::$security_key = true;

	$grid = new TreeConnector($res);
	$grid->render_table("tasks","taskId","taskName","","parentId");
?>