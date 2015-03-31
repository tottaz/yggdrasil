<?php
	require_once("../config.php");
	$dbh = new PDO('pgsql:host=localhost;dbname='.$mysql_db.";user=root;password=1234");
	
	require("../../codebase/grid_connector.php");
	require("../../codebase/db_pdo.php");
	
	$grid = new GridConnector($dbh,"PDO");
	
	$grid->dynamic_loading(100);
	$grid->render_table("grid50000","item_id","item_nm,item_cd");
?>