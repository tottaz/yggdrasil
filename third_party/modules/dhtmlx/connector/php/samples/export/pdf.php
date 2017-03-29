<?php
	require_once("../config.php");
	$res=mysql_connect($mysql_server,$mysql_user,$mysql_pass);
	mysql_select_db($mysql_db);
	

	require("../../codebase/grid_connector.php");
	require("../../codebase/convert.php");
	
	$convert = new ConvertService("http://dhtmlxgrid.appspot.com/export/pdf");
	
	$grid = new GridConnector($res);
	$config = new GridConfiguration();
	
	$config->set_convert_mode(true);
	$grid->set_config($config);
	$grid->render_table("grid50");
?>