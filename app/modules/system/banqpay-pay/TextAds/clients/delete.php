<?php

$id = $_GET['id'];

include '../config.php';

$sql="delete from $type where ID='$id'";

mysql_query("$sql")or die("Connect Error: ".mysql_error());

$variable = "$return.php";
include 'resend.php';

?>
