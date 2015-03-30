<?
	$fee = myround($amount * $dep_pp_percent / 100) + $dep_pp_fee;
	if ($amount >= $minimal_deposit){
?>
		<DIV class=large>PayPal Payments</div><br>
		<BR>
		<B><DIV width=100% class=highlight>Please confirm the following before depositing funds:
		<BR>
		<BR>
			Your transfer amount: <?=dpsumm($amount)?>
		<BR>
			Processing Fee: -<?=dpsumm($fee)?>
		<BR>
			Total Credit Card Debit: <?=dpsumm($amount + $fee)?>
		<BR>
		</DIV>
		<CENTER>
		<FORM method=post action="https://www.paypal.com/cgi-bin/webscr">
			<INPUT type=HIDDEN name="cmd" value="_xclick">
			<INPUT type=HIDDEN name="business" value="<?=$paypal_id?>">
			<INPUT type=HIDDEN name="item_name" value="<? echo "$sitename Deposit"; ?>">
			<INPUT type=HIDDEN name="no_shipping" value="1">
			<INPUT type=HIDDEN name="notify_url" value="<? echo "$siteurl/zetapay/admin/deposit_paypal.php"; ?>">
			<INPUT type=HIDDEN name="return" value="<? echo "$siteurl/"; ?>">
			<INPUT type=HIDDEN name="custom" value="<?=$suid?>|<?=myround($amount)?>">
			<INPUT type=HIDDEN name="no_note" value="1">
			<INPUT type=HIDDEN name="amount" value="<?=myround($amount + $fee)?>">
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