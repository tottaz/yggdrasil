<?php

	require_once("../config.php");
	$res=mysql_connect($mysql_server,$mysql_user,$mysql_pass);
	mysql_select_db($mysql_db);

	require("../../codebase/treegroup_connector.php");
	$tree = new TreeGroupConnector($res);
	$tree->render_table("products", "id", "product_name", "", "category");

?>