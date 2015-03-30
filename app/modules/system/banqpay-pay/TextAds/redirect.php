<?php
$id = $_GET['id'];
$url = $_GET['url'];
include 'config.php';

$SQL = "SELECT * from ADS WHERE ID = '$id'";
$result = mysql_query( $SQL );
while( $row = mysql_fetch_array( $result ) ) {
$clicks = $row["CLICKS"]+1;
}

$sql = "UPDATE ADS SET CLICKS ='$clicks' where ID = '$id'";
$query = mysql_query($sql) or die("Cannot query the database.<br>" . mysql_error());
?>

<html>
<head>
<title></title>
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

<body bgcolor="#FFFFFF" text="#000000" onLoad="MM_goToURL('parent','<?php echo $url; ?>');return document.MM_returnValue">
</body>
</html>
