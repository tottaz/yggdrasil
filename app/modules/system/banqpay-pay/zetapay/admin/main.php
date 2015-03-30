<?
session_start();
if($_SESSION['suid']){$suid = $_SESSION['suid'];$id = "suid=$suid";}
?>
<link rel=stylesheet type=text/css href=style.css>
<?
chdir('..');
require('core/include/common.php');

($userip = $_SERVER['HTTP_X_FORWARDED_FOR']) or ($userip = $_SERVER['REMOTE_ADDR']);
if(!$suid){
	($suid = $_POST['suid']) or ($suid = $_GET['suid']);
	$id = "suid=$suid";
	$suidline = "suid=$suid";
}
if($securelogin){
	$qr1 = mysql_fetch_row(mysql_query("SELECT id FROM zetapay_users WHERE id=3 AND suid='".addslashes($suid)."' AND NOW()<DATE_ADD(lastlogin, INTERVAL $session_mins MINUTE) AND lastip='$userip'"));
}else{
	$qr1 = mysql_fetch_row(mysql_query("SELECT id FROM zetapay_users WHERE id=3 AND suid='".addslashes($suid)."'")); //  AND lastip='$userip' AND NOW()<DATE_ADD(lastlogin, INTERVAL $session_mins MINUTE)
}
if (!$qr1) die("<a href=index.php target=_top style='color: white;'>Please login again</a>");
mysql_query("UPDATE zetapay_users SET lastlogin=NOW() WHERE id=3");

$reload_left = "<script>parent.menu.location.reload();</script>";

// -----------
$tr_sources = array(
  11 => "PayPal",
  12 => "Check",
  15 => "E-Gold",
  14 => "Bank Wire",
  17 => "Authorize.Net",
  18 => "NetPay",
  97 => "Advertising",
  98 => "Transfer",
  99 => "Referral"
);
$del_confirm = "onClick=\"return confirm('Are you sure want to delete this object ?');\"";
$max_elements = 50;
// -----------

($action = $_GET['a']) or ($action = $_POST['a']) or ($action = 'default');
$id_post = "<input type=hidden name=suid value=$suid>\n<input type=hidden name=a value=$action>";
?>
	<div align="center">
		<table width=90% cellpadding=0 cellspacing=0>
		<tr>
			<td>
<?
	include("admin/a_$action.php");
?>
			</td>
		</tr>
		</table>
	</div>