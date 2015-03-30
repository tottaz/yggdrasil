<?php
$id = $_GET['id'];
include '../config.php';
include 'default.css';

$name = $_POST['1'];
$title = $_POST['2'];
$description = $_POST['3'];
$url = $_POST['4'];
$dispurl = $_POST['5'];
$impressions = $_POST['8'];
$username = $_POST['6'];
$status = $_POST['7'];

if (empty($name)) {$error = 'You must enter a name'; include 'error.php'; die();}
if (empty($title)) {$error = 'You must enter a title'; include 'error.php'; die();}
if (empty($description)) {$error = 'You must enter a description'; include 'error.php'; die();}
if (empty($url)) {$error = 'You must enter an URL'; include 'error.php'; die();}
if (empty($dispurl)) {$error = 'You must enter a display URL'; include 'error.php'; die();}
if (empty($impressions)) {$error = 'You must choose how many impressions you would like or order'; include 'error.php'; die();}

$SQL = "SELECT * from ADS WHERE NAME = '$name' AND CLIENT = '$username'";
$result = mysql_query( $SQL );
while( $row = mysql_fetch_array( $result ) ) {
$check = $row["NAME"];}

if ($edit == tru) {
$x = 'UPDATE ADS SET';
$where = "where ID = '$id'";
}else{
if ($check == $name) {$error = 'This campaign already exists, please choose a new name.'; include 'error.php'; die();}
$x = 'INSERT INTO ADS SET';
}

$sql = "$x
TITLE='$title',
DESCC='$description',
URL='$url',
DISPURL='$dispurl',
MAXIMPRESSIONS='$impressions',
IMPRESSIONS='0',
CLIENT='$username',
STATUS='$status',
NAME='$name' $where";
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

<body bgcolor="#FFFFFF" text="#000000" onLoad="MM_goToURL('parent','cp.php?username=<?php echo $username; ?>');return document.MM_returnValue">
</body>
</html>
