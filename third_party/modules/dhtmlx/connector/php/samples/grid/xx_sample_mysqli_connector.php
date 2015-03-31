<?php

	require("../config.php");
	require("../../codebase/db_mysqli.php");
	require("../../codebase/grid_connector.php");

	$mysqli = new mysqli($server, $user, $pass, $mysql_db); 
	if (mysqli_connect_errno()) { 
		printf("Подключение к серверу MySQL невозможно. Код ошибки: %s\n", mysqli_connect_error()); 
		exit; 
	} 

	$grid = new GridConnector($mysqli, "MySQLi");
	
	$grid->render_table("events","event_id","event_name,details");
?>