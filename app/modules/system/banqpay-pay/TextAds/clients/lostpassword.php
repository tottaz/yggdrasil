<?php
include '../config.php';
include 'default.css';

$lost = $_POST['lost'];

$SQL = "SELECT * from CLIENTS WHERE EMAIL = '$lost'";
$result = mysql_query( $SQL );
while( $row = mysql_fetch_array( $result ) ) {
$email = $row["EMAIL"];
$username = $row["USERNAME"];
$password = $row["PASSWORD"];
}

$to="$email";
$headers.= "MIME-Version: 1.0\r\n";
$headers.= "Content-type: text/html; ";
$headers.= "charset=iso-8859-1\r\n";

$headers.= "From: $from";

$subject = "Text Ads Lost Password Delivery";

$body = "
We have found the following login information under this email address : <br><br>
Username : $username<br>
Password : $password<br>
";

$send_check=mail($to,$subject,$body,$headers);
if ($send_check!=true) {
die($error = "We could not find your email address");
}

$error = "Your password has been sent"; include 'error.php';
?>
