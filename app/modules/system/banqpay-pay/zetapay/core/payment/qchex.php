<?
	$afrom = dpuserObj($user);
	$from = $afrom->email;
	$fee = myround($amount * $dep_qc_percent / 100) + $dep_qc_fee;
	if ($amount >= $minimal_deposit){
		// http://order.kagi.com/cgi-bin/store.cgi?storeID=4XH&&
		$time = time();
?>
		<B><DIV width=100% class=highlight>Please confirm the following before depositing funds:<br>
		<BR>
			Your transfer amount: <?=dpsumm($amount)?>
		<BR>
			Processing Fee: -<?=dpsumm($fee)?>
		<BR>
			Total Account Debit: <?=dpsumm($amount + $fee)?>
		<BR>
		</DIV>
		Your deposit will be added to your account only after <?=$sitename?> Verifies that your deposit 
		has reached them.
		<CENTER>
			<br><br><br><b>Continue Your Deposit Via Qchex<br>
			<FORM ACTION="https://www.qchex.com/pay.asp" METHOD="POST"> 
			<INPUT TYPE="HIDDEN" Name="ReturnTo" value="<?=$siteurl?>">
			<INPUT TYPE="HIDDEN" Name="MerchantID" value="<?=$qchex_sid?>">
			<TABLE class=design cellspacing=0>
			<TR><TH colspan=2>Billing Information</TH></TR>
			<TR><TD>Email address:<BR>
				<DIV class=small>(<a href=index.php?read=privacy.htm&<?=$id?>>Privacy Policy</a>)</DIV></TD>
				<td><INPUT type="text" Name="PayorEmail" value="<?=$data->email?>" readonly>  </td>
			</tr>
			<tr>
				<td>Your Name : </td>
				<td><INPUT type="text" Name="PayorName" > </td>
			</tr>
			<tr>
				<td>Your Address : </td>
				<td><INPUT type="text" Name="PayorAddress" size=50></td>
			</tr>
			<tr>
				<td>City Name : </td>
				<td><INPUT type="text" Name="PayorCity">   </td>
			</tr>
			<tr>
				<td>Your State : </td>
				<td><INPUT type="text" Name="PayorState">  </td>
			</tr>
			<tr>
				<td>Zip Code : </td>
				<td><INPUT type="text" Name="PayorZipcode">  </td>
			</tr>
			<tr>
				<td>Amount : </td>
				<td><INPUT type="text" Name="Amount" value="<?=myround($amount + $fee)?>" readonly></td>
			</tr>
			<tr>
				<td colspan=2 align=center><br><br>
					<INPUT type=submit class=button value='Deposit Money'>
				</td>
			</tr>
			</table>
			</form>
		</FORM>
		</DIV>
		</B>

<?
		$processed = 1;
	}else{
		errform('Sorry, but the minimum amount you can deposit is '.$currency.$minimal_deposit);
	}
?>