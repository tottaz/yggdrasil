<?php

	include ('../config.php');
	include ('../../codebase/scheduler_connector.php');

    $res=mysql_connect($mysql_server,$mysql_user,$mysql_pass); 
    mysql_select_db($mysql_db); 

	$scheduler = new JSONSchedulerConnector($res);
	$scheduler->render_table("events","event_id","start_date,end_date,event_name,details");
?>