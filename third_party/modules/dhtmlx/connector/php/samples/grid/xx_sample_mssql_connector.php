<?php
	require_once("../config.php");
	$res=mssql_connect('.\SQLEXPRESS',"sa","1",false);
	mssql_select_db("sampleDB");

	require("../../codebase/grid_connector.php");
	require("../../codebase/db_mssql.php");
	
	$grid = new GridConnector($res,"MsSQL");
	
	$grid->dynamic_loading(100);
	$grid->render_table("grid50000","item_id","item_nm,item_cd");
?>