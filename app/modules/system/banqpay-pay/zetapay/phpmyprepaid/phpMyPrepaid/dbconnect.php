<?php
// this file sets up the database connection
// rename to dbconnect.php and put in your doc root.
// You will also have to change config.inc.php to point to it.
// fill in values for your database
$my_host = "localhost"; // your database host
$my_user = "root";              // your database user account
$my_pass = "";// your database pass
$my_dbase = "prepaid";  // your database name

/* Changed to english by Carl Peterson */
mysql_connect($my_host, $my_user, $my_pass) or die ("Couldn't connect to mysql server");
mysql_select_db($my_dbase) or die ("Couldn't select database");

?>

