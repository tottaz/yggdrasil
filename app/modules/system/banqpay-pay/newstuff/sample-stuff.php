<?php
  // Build the request string 
$request = $varname1."=". urlencode($var1); 
$request .= "&".$varname2."=" . urlencode($var2); 

// Build the header 
$header = "POST /page.htm HTTP/1.0\r\n"; 
$header .= "Content-type: application/x-www-form-urlencoded\r\n"; 
$header .= "Content-length: " . strlen($request) . "\r\n\r\n"; 

$fp = fsockopen('www.site.com', 80, &$err_num, &$err_msg, 30); 
if ($fp) 
{ 
// Send everything 
fputs($fp, $header . $request); 
// Get the response 
while (!feof($fp)) 
$response .= fgets($fp, 128); 
} 
fclose ($fp);
//parse the header portion of the response - find all content b4 the first tag
$response=substr ($response, 0, strpos($response, "<"));
header ($response);  

 <!--
javascript: openWin('test.script.php?header=<?=urlencode ($response)?>')
//-->  

// Get headers from response
$headers = substr($response, 0, strpos($response, "\r\n\r\n"));

$list = explode("\r\n", $headers);

for($i = 0, $count = sizeof($list); $i < $count; ++$i)
{
if(stristr($list[$i], "set-cookie")) // Optional
{
header($list[$i]);
}
} 
?>


 <?php

header("Cache-control: private"); //IE 6 Fix
session_start();
include('db.private');



?>

<?php

if( (!$user_name) or (!$pass_word) ){
header("Location:http://bookchin.cms.gre.ac.uk/~hs12...mbers/login.php");
exit();
}
?>
<?php
include 'http://stuweb.cms.gre.ac.uk/~hs127/onlinegig/top.php';
?>
<?php
$connection = mysql_connect($hostname,$username,$password);
$rs = mysql_select_db($databaseName, $connection);

$md5_pass_word =md5($pass_word);
$sql="SELECT * FROM gig_users WHERE user_name='$user_name' and pass_word = '$md5_pass_word'";

$rs=mysql_query($sql, $connection)
or die("could not execute query");

$num = mysql_numrows ($rs);

if($num != 0)
{ $msg = "$user_name";

$_SESSION['username_session'] = $user_name;
// echo "<font size= face=Verdana, Arial, Helvetica, sans-serif>";
// echo "<link href=http://bookchin.cms.gre.ac.uk/~hs127/onlinegig/register.css rel=stylesheet type=text/css>";
// echo "<body class=blacktxt>";
echo "<div align=right></div>";
echo "<table width=800 border=0 align=center>";
echo "<tr>";
echo "<td width=36>";
echo "&nbsp";
echo "</td>";
echo "<td width=560>";
echo "&nbsp";
echo "</td>";
echo "<td width=190>";
echo "<font size=1 face=Verdana, Arial, Helvetica, sans-serif>";
echo "" .$_SESSION["username_session"];
echo " is logged in ";
echo "<a href=logout.php>logout</a>";
echo "</td>";
echo "</tr>";
echo "</table>";
echo "</font>";
}
else if($num ==0)
{ session_unregister("username_session");
session_unregister("username_session");
session_destroy();
session_unset();
header("Location:http://bookchin.cms.gre.ac.uk/~hs12...mbers/login.php");

}


?> 

<?php
header("Cache-control: private"); //IE 6 Fix
session_start();
include('db.private');

?>

if( (!$user_name) or (!$pass_word) ){
header("Location:[url]http://bookchin.cms.gre.ac.uk/~hs12...mbers/login.php[/url]");
exit();
}

?>
<?php
include 'http://stuweb.cms.gre.ac.uk/~hs127/onlinegig/top.php';
?>

<?
  //Send Downloadable File(s) To Browser...

  $data="blah blah blah";
  header ("Pragma: public");
  header ("Expires: 0"); // set expiration time
  header ("Cache-Control: must-revalidate, post-check=0, pre-check=0");
  header ("Content-Type: application/force-download");
  header ("Content-Type: application/octet-stream");
  header ("Content-Type: application/download");
 
  header ("Content-Disposition: attachment; filename=\"testcase1.txt\";");
  header ("Content-Length: ".strlen($data)); 
  header ("Content-Transfer-Encoding: binary");

  print($data);

  exit();
?>

<?


  //=======================================================
  //Send Downloadable File(s) To Browser...

  $data="blah blah blah";
  header ("Pragma: public");
  header ("Expires: 0"); // set expiration time
  header ("Cache-Control: must-revalidate, post-check=0, pre-check=0");
  header ("Content-Type: application/force-download");
  header ("Content-Type: application/octet-stream");
  header ("Content-Type: application/download");
 
  header ("Content-Disposition: attachment; filename=\"testcase1.txt\";");
  header ("Content-Length: ".strlen($data)); 
  header ("Content-Transfer-Encoding: binary");

  print($data);

  exit();
  //=======================================================

  //=======================================================
  //Close Browser's Window...
  header ("Transfer-Encoding: chunked");
  header ("Content-Type: text/html");

  echo <<<EOM
  
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
 <head>
  <title></title>
  <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">

  <script type="text/javascript">
   window.focus();
   window.close();
  </script>
 </head>
 <body>
 </body>
</html>

EOM;
  //=======================================================
?>
<?
//Browser #1
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<title></title>
</head>
<body></body>
</html>

//Browser #2
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<HTML>
<HEAD>
<META http-equiv=Content-Type content="text/html; charset=windows-1252">
</HEAD>
<BODY>
</BODY>
</HTML>

?>
<?
  //Send Downloadable File(s) To Browser...

  $data="blah blah blah";
  header ("Pragma: public");
  header ("Expires: 0"); // set expiration time
  header ("Cache-Control: must-revalidate, post-check=0, pre-check=0");
  header ("Content-Type: application/force-download");
  header ("Content-Type: application/octet-stream");
  header ("Content-Type: application/download");
 
  header ("Content-Disposition: attachment; filename=\"testcase1.txt\";");
  header ("Content-Length: ".strlen($data)); 
  header ("Content-Transfer-Encoding: binary");

  print($data);

  exit();
?>

    
  