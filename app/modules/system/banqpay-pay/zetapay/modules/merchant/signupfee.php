<?

$source = $_POST['source'];
$amount = (float)$_POST['amount'];
$processed = 0;

// PayPal processing
if ($paypal_use && $source == 'paypal')
{
  $fee = myround($amount * $dep_pp_percent / 100, 2) + $dep_pp_fee;
  if ($amount >= $signup_fee){
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
	<INPUT type=HIDDEN name="item_name" value="<? echo "$sitename Signup Fee"; ?>">
	<INPUT type=HIDDEN name="no_shipping" value="1">
	<INPUT type=HIDDEN name="return" value="<? echo "$siteurl/zetapay/admin/deposit_paypal.php"; ?>">
	<INPUT type=HIDDEN name="custom" value="<?=$suid?>">
	<INPUT type=HIDDEN name="no_note" value="1">
	<INPUT type=HIDDEN name="amount" value="<?=($amount + $fee)?>">
		<INPUT type=submit class=button value='Deposit Money'>
</FORM>
</DIV>
</B>

<?
    $processed = 1;
  }
  else
    errform('Sorry, but the minimum amount you can deposit is '.$currency.$minimal_deposit);
}
// Credit card processing
elseif ($cc_use && $source == 'cc')
{
  $fee = myround($amount * $dep_cc_percent / 100, 2) + $dep_cc_fee;
  if ($amount >= $signup_fee){
?>

<DIV class=large>Credit Card Payments</DIV>
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
<FORM method=post action="https://www.2checkout.com/cgi-bin/sbuyers/cartpurchase.2c">
	<INPUT type=HIDDEN name=sid value="<?=$tocheckout_sid?>"> 
	<INPUT type=HIDDEN name=cart_order_id value="<?=$suid?>">
	<INPUT type=HIDDEN name=total value="<?=($amount + $fee)?>">
		<INPUT type=submit class=button value='Deposit Money'>
</FORM>
</DIV>
</B>

<?
    $processed = 1;
  }
  else
    errform('Sorry, but the minimum amount you can deposit is '.$currency.$minimal_deposit);
}
// Check processing
elseif ($check_use && $source == 'check')
{
  $fee = myround($amount * $dep_check_percent / 100, 2) + $dep_check_fee;
  if ($amount >= $signup_fee){
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
  }
  else
    errform('Sorry, but the minimum amount you can deposit is '.$currency.$minimal_deposit);
}

if (!$processed)
{
  // Generate form
?>
<DIV class=large>Pay Signup Fee of <?=$currency?> <?=floatval2($signup_fee)?></DIV>
<BR>
<BR>
<CENTER>
<TABLE class=design cellspacing=0>
<FORM method=post>
<TR><TH colspan=2>Pay Signup Fee</TH</TR>
<TR><TD>Amount to deposit:</TD>
	<TD><a onFocus="this.blur()"><?=$currency?> <input type=text size=7 maxLength=7 name=amount value="<?=$signup_fee?>" onFocus="blur();"></a></TD></TR>
<TR><TD>Payment method:</TD>
	<TD>
<?
  // PayPal
  if ($paypal_use)
  {
    echo "<input type=radio class=checkbox name=source value='paypal' ",($source == 'paypal' ? 'checked' : ''),">",
         "Paypal";
    if ($dep_pp_percent || $dep_pp_fee)
      echo " <span class=small>(cost: ",
           ($dep_pp_percent ? "$dep_pp_percent%" : ""),
           ($dep_pp_percent && $dep_pp_fee ? " + " : ""),
           ($dep_pp_fee ? $currency.$dep_pp_fee : ""),
           ")</span>";
    echo "<br>\n";
  }
  // Credit card
  if ($cc_use)
  {
    echo "<input type=radio class=checkbox name=source value='cc' ",($source == 'cc' ? 'checked' : ''),">",
         "Credit Card";
    if ($dep_cc_percent || $dep_cc_fee)
      echo " <span class=small>(cost: ",
           ($dep_cc_percent ? "$dep_cc_percent%" : ""),
           ($dep_cc_percent && $dep_cc_fee ? " + " : ""),
           ($dep_cc_fee ? $currency.$dep_cc_fee : ""),
           ")</span>";
    echo "<br>\n";
  }
  // Check
  if ($check_use)
  {
    echo "<input type=radio class=checkbox name=source value='check' ",($source == 'check' ? 'checked' : ''),">",
         "Regular Mail";
    if ($dep_check_percent || $dep_check_fee)
      echo " <span class=small>(cost: ",
           ($dep_check_percent ? "$dep_check_percent%" : ""),
           ($dep_check_percent && $dep_check_fee ? " + " : ""),
           ($dep_check_fee ? $currency.$dep_check_fee : ""),
           ")</span>";
    echo "<br>\n";
  }
?>
</TD></TR>
<TR><TH colspan=2 class=submit>
	<INPUT type=submit class=button value='Deposit >>'></TH>
  <?=$id_post?>
</FORM>
</TABLE>
</CENTER>
  
<?
}
?>