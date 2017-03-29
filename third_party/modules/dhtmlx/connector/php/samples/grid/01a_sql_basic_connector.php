<?php
	require_once("../config.php");
	$res=mysql_connect($mysql_server,$mysql_user,$mysql_pass);
	mysql_select_db($mysql_db);

	require("../../codebase/grid_connector.php");


$gridConn = new GridConnector($res);
$sql = "SELECT * FROM grid50";
$gridConn->render_sql($sql,"item_id","item_nm,item_cd");

?>