<?
	chdir('../../');
	require('core/include/common.php');

    $amount = $_GET['amount'];
    $fee = myround($amount * $dep_pp_percent / 100);
	if ($amount >= $minimal_deposit){
?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<HTML>
<HEAD>
<META http-equiv='pragma' content='no-cache'>
<META http-equiv='expires' content='-1'>
<TITLE>Redirecting...</TITLE>
<SCRIPT language=javascript type='text/javascript'>
<!--
function go() {
	var f0 = document.getElementById('f');
	f0.submit();
}
//-->
</SCRIPT>
</HEAD>

<BODY onLoad='go();'>
<FORM id=f method=post action="https://www.paypal.com/cgi-bin/webscr">
	<INPUT type=HIDDEN name="cmd" value="_xclick">
    <INPUT type=hidden name=method value='PAYPAL'>
	<INPUT type=HIDDEN name="business" value="<?=$paypal_id?>">
	<INPUT type=HIDDEN name="item_name" value="<? echo "$sitename Deposit"; ?>">
	<INPUT type=HIDDEN name="no_shipping" value="1">
	<INPUT type=HIDDEN name="notify_url" value="<? echo "$siteurl/zetapay/core/payment/deposit_paypal.php"; ?>">
	<INPUT type=HIDDEN name="return" value="<? echo "$siteurl/"; ?>">
	<INPUT type=HIDDEN name="custom" value="<?=$suid?>|<?=myround($amount)?>">
	<INPUT type=HIDDEN name="no_note" value="1">
	<INPUT type=HIDDEN name="amount" value="<?=myround($amount)?>">
    <INPUT type=HIDDEN name=redirect value='zetapay/help/closewin.html'>
</FORM>

<?
	    $processed = 1;
	}else{
			errform('Sorry, but the minimum amount you can deposit is '.$currency.$minimal_deposit);
	}

?>
</BODY>
</HTML>