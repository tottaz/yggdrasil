<?php
$ip = $_SERVER["REMOTE_ADDR"];
include '../config.php';
include 'default.css';

$username = $_POST['1'];
$password = $_POST['2'];
$cpassword = $_POST['3'];
$email = $_POST['4'];

$SQL = "SELECT * from CLIENTS WHERE USERNAME = '$username'";
$result = mysql_query( $SQL );
while( $row = mysql_fetch_array( $result ) ) {
$check = $row["USERNAME"];
$ipchecker = $row["IP"];}

if ($username == $check) {$error = 'This username already exists, please click your browsers back button and choose another.'; include 'error.php'; die();}
if ($password == $cpassword) {}else{$error = 'Passwords do not match, click your browsers back button and try again.'; include 'error.php'; die();}

$sql = "INSERT INTO CLIENTS SET USERNAME='$username', PASSWORD='$password', EMAIL='$email', IP='$ip'";
$query = mysql_query($sql) or die("Cannot query the database.<br>" . mysql_error());

?>

<html>
<head>
<title>Untitled Document</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<script language="JavaScript">
<!--
function MM_goToURL() { //v3.0
  var i, args=MM_goToURL.arguments; document.MM_returnValue = false;
  for (i=0; i<(args.length-1); i+=2) eval(args[i]+".location='"+args[i+1]+"'");
}
//-->
</script>
</head>

<body bgcolor="#FFFFFF" text="#000000" onLoad="MM_goToURL('parent','cp.php?greeting=You have been signed up, please log in');return document.MM_returnValue">
</body>
</html>
