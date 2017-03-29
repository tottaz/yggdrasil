<?php
	require_once("../config.php");
	$res=mysql_connect($mysql_server,$mysql_user,$mysql_pass);
	mysql_select_db($mysql_db);

	function check_data($action){
		if ($action->get_value("item_cd")=="" || $action->get_value("item_nm")=="")
			$action->invalid();
	}
	require("../../codebase/grid_connector.php");
	$grid = new GridConnector($res);
	
	$grid->dynamic_loading(100);
	$grid->event->attach("beforeProcessing",check_data);
	$grid->render_table("grid50000","item_id","item_nm,item_cd");
?>