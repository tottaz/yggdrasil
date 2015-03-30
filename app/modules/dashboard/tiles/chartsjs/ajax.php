<?php

header('Content-Type: application/json');

if (isset($_GET['start']) AND isset($_GET['end'])) {
	
	$start = $_GET['start'];
	$end = $_GET['end'];
	$data = array();

	// Select the results with Idiorm
	$results = ORM::for_table('chart_sales')
			->where_gte('date', $start)
			->where_lte('date', $end)
			->order_by_desc('date')
			->find_array();


	// Build a new array with the data
	foreach ($results as $key => $value) {
		$data[$key]['label'] = $value['date'];
		$data[$key]['value'] = $value['sales_order'];
	}

	echo json_encode($data);
}
