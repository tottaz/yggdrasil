<?php
	require_once("../config.php");
	$postrgre_connection = "host=192.168.1.251 port=5432 dbname=sampledb user=pguser password=pgpass";
	$res=pg_connect($postrgre_connection);
	
	require("../../codebase/grid_connector.php");
	require("../../codebase/db_postgre.php");
	
	$grid = new GridConnector($res,"Postgre");
	
	$grid->dynamic_loading(100);
	$grid->render_table("grid50000","item_id","item_nm,item_cd");
?>