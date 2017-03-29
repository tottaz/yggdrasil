<?php
	require_once("../config.php");
	$res=mysql_connect($mysql_server,$mysql_user,$mysql_pass);
	mysql_select_db($mysql_db);

	require("../../codebase/grid_connector.php");
	$grid = new GridConnector($res);
	
	$config = new GridConfiguration();
	$config->setHeader("ID,First Name,Last Name,Title,Office,Extn,Mobile,Email");
	$config->setColTypes("ro,ed,ed,ed,ed,ed,ed,ed");
	$grid->set_config($config);
   
	$grid->render_table("grid50");
?>