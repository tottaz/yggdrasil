<?php

	require_once("../../codebase/dataview_connector.php");
	require_once("../config.php");
	
	$conn = mysql_connect($mysql_server,$mysql_user,$mysql_pass);
	mysql_select_db($mysql_db);
	
	$data = new DataViewConnector($conn);
	$data->dynamic_loading(50);
	$data->render_table("packages_plain","Id","Package,Version,Maintainer");
?>