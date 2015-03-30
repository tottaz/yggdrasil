<?php
	
	// if they didn't use the form, they want one card

$number= 1; // get the number of tickets they wanted
if(isset($_POST['print1'])) { $sec = 1800;}
if(isset($_POST['print2'])) { $sec = 3600;}
if(isset($_POST['print3'])) { $sec = 7200;}
if(!isset($sec)) { die('Something just aint right here');}

// get the time attribute
$min= ($sec/60);
?>
																																	   
