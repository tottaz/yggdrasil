<?php
	
	// if they didn't use the form, they want one card

$number=$_POST['AnzahlSeiten']; // get the number of tickets they wanted
if(!is_numeric($number)) { die('Please enter a number like 6'); }
if($number > $max) {
	$num = $number;
	$number = $max;
	echo("You asked for $num cards but the maximum is set to $max.<br>");
	}

$sec = $_POST['zeit'];
if(!is_numeric($sec)) { die('Did you select a time limit?'); }
if($sec < $mintime) { die("The shortest ticket is $mintime Min."); }
if($sec > $maxtime) { die("The shortest ticket is $maxtime Min."); }

// get the time attribute
$min= ($sec/60);
?>
																																	   
