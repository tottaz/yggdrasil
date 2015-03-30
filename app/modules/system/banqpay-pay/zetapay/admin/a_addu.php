<?
	$r = mysql_fetch_object(mysql_query("SELECT * FROM zetapay_users WHERE username='".addslashes($_GET['id'])."' OR id='".addslashes($_GET['id'])."'"));
	if ($r->type == 'sys') exit;

	$tt = $_GET['id'];
	$_GET['id'] = $_GET['ed'];
	$_fpr_add = 1;
	require_once("admin/g_uedit.php");
	if ($_fpr_err) exit;
	$r = mysql_fetch_object(mysql_query("SELECT * FROM zetapay_users WHERE username='".addslashes($tt)."'")); 
?>