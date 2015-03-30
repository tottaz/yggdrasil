<?PHP

//----------------------------------------
// Enter Your Database Connection Info    #
//----------------------------------------

$host = "localhost";
$user = "zetaman";
$pass = "5d7u1b2ai";
$database = "zetapay";

//----------------------------------------
// Choose An Admin Username & Password    #
//----------------------------------------

$aun = "admin";
$apw = "admin";
$ae = "admin@domain.com";

//----------------
// Edit Nothing Below This Line          #
//----------------------------------------

$con=mysql_connect("$host","$user","$pass")or die("Connect Error: ".mysql_error()); $db="$database"; mysql_select_db($db, $con);

?>