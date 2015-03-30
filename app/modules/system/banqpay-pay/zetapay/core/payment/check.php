<?
	$fee = myround($amount * $dep_check_percent / 100) + $dep_check_fee;
	if ($amount >= $minimal_deposit){
?>
		<DIV class=large>Regular Mail Payments</DIV>
		<BR>
			Please forward a current check in the amount of <?=dpsumm($amount + $fee)?> to the following address:<br>
		<BR>
		<DIV class=highlight width=100%>
		  <?=nl2br($dep_check)?>
		</DIV>
		<BR>
		<FONT color=red><B>Please Note:</B></FONT> Include a note with your username (<?=$data->username?>) and the email address you registered with (<?=$data->email?>), so we can credit your account accordingly.<BR>
		Thank you.
<?
			$processed = 1;
	}else{
			errform('Sorry, but the minimum amount you can deposit is '.$currency.$minimal_deposit);
	}
?>