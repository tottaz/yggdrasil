<?php

include '../config.php';

$sql = "CREATE TABLE ADPACKAGES (".
  "ID int(6) NOT NULL auto_increment,".
  "IMPRESSIONS varchar(255) NOT NULL default '',".
  "COST varchar(255) NOT NULL default '',".
  "NAME varchar(255) NOT NULL default '',".
  "PRIMARY KEY  (ID))";
mysql_query($sql)or die("<center>Error: ADPackages Table </center>".mysql_error());



$sql1 = "CREATE TABLE ADS (".
  "ID int(6) NOT NULL auto_increment,".
  "TITLE varchar(255) NOT NULL default '',".
  "DESCC text NOT NULL,".
  "URL varchar(255) NOT NULL default '',".
  "DISPURL varchar(255) NOT NULL default '',".
  "IMPRESSIONS varchar(10) NOT NULL default '',".
  "MAXIMPRESSIONS varchar(255) NOT NULL default '',".
  "CLICKS varchar(10) NOT NULL default '',".
  "CLIENT varchar(255) NOT NULL default '',".
  "STATUS varchar(10) NOT NULL default '',".
  "NAME varchar(255) NOT NULL default '',".
  "PRIMARY KEY  (ID))";
mysql_query($sql1)or die("<center>Error:  ADS Table </center>".mysql_error());

$sql2 ="CREATE TABLE CLIENTS (".
  "ID int(6) NOT NULL auto_increment,".
  "USERNAME varchar(255) NOT NULL default '',".
  "EMAIL varchar(255) NOT NULL default '',".
  "PASSWORD varchar(255) NOT NULL default '',".
  "IP varchar(255) NOT NULL default '',".
  "PRIMARY KEY  (ID))";
mysql_query($sql2)or die("<center>Error:  Clients Table </center>".mysql_error());


$sql3 ="CREATE TABLE PREFERENCES (".
  "ID int(6) NOT NULL auto_increment,".
  "MAXADS char(4) NOT NULL default '',".
  "PRIMARY KEY  (ID))";
mysql_query($sql3)or die("<center>Error:  Preferences Table </center>".mysql_error());


$sql4 ="CREATE TABLE SETTINGS (".
  "USERNAME varchar(255) NOT NULL default '',".
  "PASSWORD varchar(255) NOT NULL default '',".
  "IP varchar(255) NOT NULL default '',".
  "PATH varchar(255) NOT NULL default '',".
  "ID int(6) NOT NULL auto_increment,".
  "RECEIVER_EMAIL varchar(255) NOT NULL default '',".
  "CURRENCY varchar(20) NOT NULL default '',".
  "LOGO_URL varchar(255) NOT NULL default '',".
  "SUCCESS_URL varchar(255) NOT NULL default '',".
  "CANCEL_URL varchar(255) NOT NULL default '',".
  "MAXADS char(2) NOT NULL default '',".
  "PRIMARY KEY  (ID))";
mysql_query($sql4)or die("<center>Error:  Settings Table </center>".mysql_error());

$sql5 = "INSERT INTO SETTINGS SET USERNAME ='$aun', PASSWORD='$apw'";
$query = mysql_query($sql5) or die("Cannot query the database.<br>" . mysql_error());

?>

<html>
<head>
<title>TextAds Install Script v1.0</title>
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

<body bgcolor="#FFFFFF" text="#000000" onLoad="MM_goToURL('parent','../admin/');return document.MM_returnValue">
<center><br>TextAds Install Script v1.0 by: <a href="http://www.mirndtsoft.com">Mirndtsoft</a>
</center>
</body>
</html>
