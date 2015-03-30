<?
	$fee = myround($amount * $dep_eg_percent / 100) + $dep_eg_fee;
	if ($amount >= $minimal_deposit){
		// http://order.kagi.com/cgi-bin/store.cgi?storeID=4XH&&
		$time = time();
?>
		<DIV class=large>E-Gold Payments</DIV>
		<BR>
		<BR>
		<B><DIV width=100% class=highlight>Please confirm the following before depositing funds:<br>
		<BR>
			Your transfer amount: <?=dpsumm($amount)?>
		<BR>
			Processing Fee: -<?=dpsumm($fee)?>
		<BR>
			Total Account Debit: <?=dpsumm($amount + $fee)?>
		<BR>
		</DIV>
		<CENTER>
		<form action="https://www.e-gold.com/sci_asp/payments.asp" method="POST" target=_top>
			<input type="hidden" name="PAYEE_ACCOUNT" value="<?=$egold_sid?>">
			<input type="hidden" name="PAYEE_NAME" value="<?=$sitename." (".$siteurl.")"?>">
			<input type=hidden name="PAYMENT_UNITS" value=1>
			<input type=hidden name="PAYMENT_METAL_ID" value=1>
			<input type=hidden name="PAYMENT_AMOUNT" value=<?=myround($amount + $fee)?>>
			<input type="hidden" name="NOPAYMENT_URL" value="<? echo "$siteurl"?>">
			<input type="hidden" name="NOPAYMENT_URL_METHOD" value="LINK">
			<input type="hidden" name="PAYMENT_URL" value="<? echo "$siteurl/zetapay/admin/deposit_egold.php"; ?>">
			<input type="hidden" name="PAYMENT_URL_METHOD" value="POST">
			<input type="hidden" name="BAGGAGE_FIELDS" value="uid HASH CHECKSUM origamount">
			<input type=hidden name=uid value=<?=$suid?>>
			<input type=hidden name=origamount value=<?=myround($amount)?>>
			<input type="hidden" name="HASH" value="<?=md5("abdo".$time.$suid);?>"> 
			<input type="hidden" name="CHECKSUM" value="<?=$time?>">
			<INPUT type=submit class=button value='Deposit Money'>
		</FORM>

		</DIV>
		</B>

<?
		$processed = 1;
	}else{
		errform('Sorry, but the minimum amount you can deposit is '.$currency.$minimal_deposit);
	}
?>