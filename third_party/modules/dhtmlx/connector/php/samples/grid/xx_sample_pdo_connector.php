<?php
	require_once("../config.php");
	$dbh = new PDO('mysql:host='.$mysql_server.';dbname='.$mysql_db, $mysql_user, $mysql_pass);
	
	require("../../codebase/grid_connector.php");
	require("../../codebase/db_pdo.php");
	
	$grid = new GridConnector($dbh,"PDO");
	
	$grid->dynamic_loading(100);
	$grid->render_table("grid50000","item_id","item_nm,item_cd");
?>