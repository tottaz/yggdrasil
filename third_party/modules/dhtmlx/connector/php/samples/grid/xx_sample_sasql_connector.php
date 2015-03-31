<?php
	require_once("../config.php");
	$res = sasql_connect($sasql_conn); 

	require("../../codebase/grid_connector.php");
	require("../../codebase/db_sasql.php");
	$grid = new GridConnector($res, "SaSQL");
	$grid->enable_log("temp.log",true);
	$grid->dynamic_loading(100);
	$grid->render_table("Contacts","ID","Surname,GivenName,Title");
?>