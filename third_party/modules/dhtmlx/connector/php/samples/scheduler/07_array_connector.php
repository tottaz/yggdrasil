<?php
	include ('../../codebase/scheduler_connector.php');

    $data = array(
    	array("event_id" => 1, "start_date" => "2012-05-24 00:00", "end_date" => "2012-05-25 00:00", "event_name" => "creation time"),
    	array("event_id" => 2, "start_date" => "2010-02-16", "end_date" => "2084-06-08", "event_name" => "second part")
    );

	$scheduler = new SchedulerConnector();
	$scheduler->render_array($data,"event_id","start_date,end_date,event_name");
?>