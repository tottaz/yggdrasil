<script type="text/javascript" src="http://www.google.com/jsapi"></script>

<script type="text/javascript">
	google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);

function drawChart() {
var data = google.visualization.arrayToDataTable([
['Date', 'HTTP Total MB'],<?php foreach ($total_mb as $total_mbs) { ?>
	['<?php echo $total_mbs['date']; ?>',<?php echo $total_mbs['http_total_mb']; ?>],<?php } ?>
	]);

	var options = {
		title : 'CDN Usage Total MB',
		hAxis : {
			title : 'Date',
			titleTextStyle : {
				color : 'red'
			}
		}
	};

	var chart = new google.visualization.AreaChart(document.getElementById('chart_total_mb'));
	chart.draw(data, options);
	}
</script>

<script type="text/javascript">
	google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawM95);

function drawM95() {
var data = google.visualization.arrayToDataTable([
['Date', '95/5 '],<?php foreach ($m95 as $m95s) { ?>
	['<?php echo $m95s['date']; ?>',<?php echo $m95s['m95_mbps']; ?>],<?php } ?>
	]);

	var options = {
		title : '95/5 in Megabits per second',
		hAxis : {
			title : 'Date',
			titleTextStyle : {
				color : 'red'
			}
		}
	};

	var chart = new google.visualization.AreaChart(document.getElementById('chart_m95'));
	chart.draw(data, options);
	}
</script>

<script type="text/javascript">
	google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawTotalHits);

function drawTotalHits() {
var data = google.visualization.arrayToDataTable([
['Date','Total Hits'],<?php foreach ($total_hits as $total_hitss) { ?>
	['<?php echo $total_hitss['date']; ?>',<?php echo $total_hitss['total_hits']; ?>],<?php } ?>
	]);

	var options = {
		title : 'Total Hits by date',
		hAxis : {
			title : 'Date',
			titleTextStyle : {
				color : 'red'
			}
		}
	};

	var chart = new google.visualization.AreaChart(document.getElementById('chart_total_hits'));
	chart.draw(data, options);
	}
</script>

<h1 style='width:95%; padding:20px; font-family:Tahoma;font-weight:normal;background:#f2f3f4;'>Service Desk details for torbjornzetterlund.com</h1>

<div id="chart_total_mb" style="width: 550px; height: 400px; border: 1px solid; float: left;"></div>

<div id="chart_m95" style="width: 550px; height: 400px; border: 1px solid; float: left;"></div>

<div id="chart_total_hits" style="width: 550px; height: 500px; border: 1px solid; float: left;"></div>