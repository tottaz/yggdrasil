<?php
	require_once("../config.php");
	$res=mysql_connect($mysql_server,$mysql_user,$mysql_pass);
	mysql_select_db($mysql_db);
	
	require("../../codebase/combo_connector.php");
	$combo = new ComboConnector($res);
	//$combo->enable_log("temp.log");
	$combo->render_sql("SELECT * FROM country_data  WHERE country_id >40 ","country_id","name");
?>