<?php
	require_once("../config.php");
	
	$db = new SQLite3('mysqlitedb.db');

	require("../../codebase/grid_connector.php");
	require("../../codebase/db_sqlite3.php");
	
	$grid = new GridConnector($db,"SQLite3");
	$grid->render_table("grid50000","item_id","item_nm,item_cd");
	
?>