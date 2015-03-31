<?php
	require_once("../config.php");
	$res = oci_connect($oci_dbuser,$oci_dbpass,$oci_dbname);
		
	
	
	require("../../codebase/grid_connector.php");
	require("../../codebase/db_oracle.php");
	
	$grid = new GridConnector($res,"Oracle");
	
	$grid->dynamic_loading(50);
	$grid->sql->sequence("EMPLOYEES_INC.nextVal");
	$grid->render_table("EMPLOYEES","EMPLOYEE_ID","FIRST_NAME,LAST_NAME");

?>