<?php
include '../config.php';
include '../default.css';
$ip = $_SERVER["REMOTE_ADDR"];
global $PHP_SELF;

$SQL = "SELECT * from SETTINGS";
$result = mysql_query( $SQL );
while( $row = mysql_fetch_array( $result ) ) {
$un = $row["USERNAME"];
$pw = $row["PASSWORD"];
$adminip = $row["IP"];}

if ($ip == $adminip) {
}else{
include 'authform.php';

$user = $_POST['user'];
$pass = $_POST['pass'];

if ($user == $un) {}else{die();}
if ($pass == $pw) {}else{die();}

$sql = "UPDATE SETTINGS SET IP ='$ip'";
$query = mysql_query($sql) or die("Cannot query the database.<br>" . mysql_error());

include 'li.php';
}

?>
