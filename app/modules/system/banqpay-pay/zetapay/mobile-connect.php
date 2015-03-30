<?
//@mysql_connect('localhost', 'zetaman', '55Z78Pqr5') or die('Cannot connect to MySQL server');
//@mysql_connect('localhost', 'root', '') or die('Cannot connect to MySQL server');
//@mysql_select_db('zetapay');
include('core/adodb/adodb.inc.php');
$zetadb = NewADOConnection('mysql');
$zetadb->Connect('localhost', 'root', '', 'zetapay');
?>