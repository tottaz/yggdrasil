<?php
// THIS FILE SELECTS TOTAL USAGE JUST FOR FUN
$query="SELECT SUM(AcctSessionTime) AS TotalSessionTime
FROM `radacct`";
$result = mysql_query($query) or die(mysql_error());
while($row = mysql_fetch_object($result)) {
	$sec = $row->TotalSessionTime; // number of seconds
               $min = ($sec /60); // devide by 60
	       $hour =($min /60); 
		}
?>

