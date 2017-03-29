<?php
	require_once("../config.php");
	$res=mysql_connect($mysql_server,$mysql_user,$mysql_pass);
	mysql_select_db($mysql_db);
	require("../../codebase/grid_connector.php");
	
	
	
	$grid = new GridConnector($res);
	
	$grid->dynamic_loading(100);
	
	/*$filter1 = new OptionsConnector($res);
	$filter1->render_table("countries","item_id","item_id(value),item_nm(label)");
	$grid->set_options("item_nm",$filter1);*/
	
	$filter1 = new OptionsConnector($res);
	$filter1->render_sql("SELECT  DISTINCT SUBSTR(item_nm,1,2) as value from grid50000","item_id","item_nm(value)");
	$grid->set_options("item_nm",$filter1);
	
	$grid->render_table("grid50000","item_id","item_nm,item_cd");
?>