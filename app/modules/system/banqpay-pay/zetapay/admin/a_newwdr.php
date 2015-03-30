<?
	$_add = 1;
	include("admin/g_withdraw.php");
	if (!$formerr)
		echo "$currency{$form['amount']} was deducted from user's account.",$reload_left;
?>