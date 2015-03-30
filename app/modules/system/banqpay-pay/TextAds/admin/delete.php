<?php
$type = $_GET['type'];
$id = $_GET['id'];

include '../config.php';
include 'auth.php';
$return = $_GET['return'];

$sql="delete from $type where ID='$id'";

mysql_query("$sql")or die("Connect Error: ".mysql_error());

$variable = "$return.php";
include 'resend.php';

?>
