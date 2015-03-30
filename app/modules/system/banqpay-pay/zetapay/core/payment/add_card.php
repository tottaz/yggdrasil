<script>
function validate(){
	dm = document.verify;
	if (dm.elements['name'].value == ""){
		alert ("Enter Your Name");
		dm.name.focus();
		return false;
	}

	if (dm.elements['chk_number'].value == ""){
		alert ("Enter Your Cheque Number");
		dm.chk_number.focus();
		return false;
	}

	if (dm.elements['bank_name'].value == ""){
		alert ("Enter Your Bank Name");
		dm.bank_name.focus();
		return false;
	}

	if (dm.elements['bank_address'].value == ""){
		alert ("Enter Your Bank Address");
		dm.bank_address.focus();
		return false;
	}

	if (dm.elements['bank_city'].value == ""){
		alert ("Enter Your Bank City Name");
		dm.bank_city.focus();
		return false;
	}

	if (dm.elements['bank_phone_ext'].value == ""){
		alert ("Enter Your bank phone extension number");
		dm.bank_phone_ext.focus();
		return false;
	}

	if (dm.elements['bank_phone_number'].value == ""){
		alert ("Enter Your bank phone  number");
		dm.bank_phone_number.focus();
		return false;
	}

	if (dm.elements['aba_number'].value == ""){
		alert ("Enter Your ABA fractional Number");
		dm.aba_number.focus();
		return false;
	}

	if (dm.elements['routing_number'].value == ""){
		alert ("Enter Your Routing Number");
		dm.routing_number.focus();
		return false;
	}

	if (dm.elements['account_number'].value == ""){
		alert ("Enter Your Account Number");
		dm.account_number.focus();
		return false;
	}

	if (dm.elements['acc_address'].value == ""){
		alert ("Enter your Address");
		dm.acc_address.focus();
		return false;
	}

	if (dm.elements['acc_phone'].value == ""){
		alert ("Enter your phone number");
		dm.acc_phone.focus();
		return false;
	}

	if (dm.agreement.checked == false){
		alert ("You cannot proceed without accepting to the agreements");
		return false;
	}
}
</script>
<center><u>
<b>Verify Your Account With <?=$sitename?></b></u> </center>
<br>
<b><u>Benefits Of Verified Members</u></b>
<li>Can withdraw more than $50.00 at a time.
<li>Can send over $100.00 to any other account at a time.
<br><br>
<li><b>All Fields marked with * are required </b>
<form method=post name=verify onsubmit="return validate()" >
<TABLE class=design cellspacing=0>
<tr>
	<td colspan=3>
		Please use this form to Verify your <?=$sitename?>
		account.Enter Information from Your Check (see example below)</font></td>
</tr>
<tr>
	<td>Account Holder's Name:</td>
	<td>
		<input maxLength="100" size="40" name="name"></font><span class=tiny>*
		<br>(as printed on your Check)</font></td>
</tr>
<tr>
	<td>Check Number:</td>
	<td>
		<input maxLength="10" size="10" name="chk_number"></font><span class=tiny>*
		(record this check in your check book)</font></td>
</tr>
<tr>
	<td>Bank Name:</td>
	<td><input maxLength="40" size="40" name="bank_name"></font><span class=tiny>*</font></td>
</tr>
<tr>
	<td>Bank Street Address</td>
	<td><input maxLength="100" size="40" name="bank_address"></font><span class=tiny>*</font></td>
</tr>
<tr>
	<td>Bank City, State or Province:</td>
	<td><input maxLength="40" size="40" name="bank_city"></font><span class=tiny>*</font></td>
</tr>
<tr>
	<td>Bank Phone: </td>
	<td><span class=tiny>(</font><input maxLength="4" size="5" name="bank_phone_ext"><span class=tiny>)- </font>
		<input maxLength="20" name="bank_phone_number" size="20"><span class=tiny>*</font></td>
</tr>
<tr>
	<td>Fractional ABA number:</td>
	<td><input maxLength="20" name="aba_number" size="20"></font><span class=tiny>*(looks like 91-210/1225)</font></td>
</tr>
<tr>
	<td>&nbsp;Bank Routing Number:</td>
	<td><input maxLength="10" name="routing_number" size="20"></font><span class=tiny>*(9 numeric digits ONLY)<br>
		</font><span class=tiny>(All funds are US Dollars Only.
		Canadians MUST put a hyphen in the 6th position)</font></td>
</tr>
<tr>
	<td>Your Account Number:</td>
	<td>
		<input maxLength="30" name="account_number" size="20"></font><span class=tiny>*
		(include spaces and hyphens)</font></td>
</tr>
<tr>
	<td>Amount of Check:</td>
	<td><input maxLength="20" name="Amount" size="20" value="$1.00 to $3.00" readonly></font><span class=tiny>*</font></td>
</tr>
<tr>
	<td>Your Address:</td>
	<td><textarea name=acc_address rows=5 cols=35></textarea><span class=tiny>*</font></td>
</tr>
<tr>
	<td>Your Phone Number:</td>
	<td><input maxLength="20" name="acc_phone" size="20"></font><span class=tiny>*</font></td>
</tr>
<tr>
	<td align="middle" colSpan="2" height="281"><br><br>
	<img src="zetapay/img/routing.gif" border="0" width="398" height="281"><p>&nbsp;</td>
</tr>
<tr>
	<td width="100%" colSpan="2" valign="top"><span class=tiny>
		<br><br>Check Authorization Agreement: I choose to Verify my <?=$sitename?> 
		account by submitting my checking account details and I have filled in all of 
		the check information fields above. I authorize <?=$sitename?> to draft my bank 
		account electronically for a amount of $1.00 - $3.00 for verification purposes. I 
		also understand that once I receive the details of the exact amount debited from 
		my account that it is my responsibility to come back to my <?=$sitename?> members 
		area and insert the correct amount debited to complete the verification process.&nbsp; I
		understand that when I submit this form, my Internet protocol (IP) address
		will considered my authorization signature on this check. I understand that
		the check will show up just like any other check on my monthly bank
		statement With a memo (<?=$sitename?>).</p>
		<p>I understand that in the event my check is returned unpaid, I will be
		subject to a $15.00 processing fee.</p>
		<p>Upon submittal of this form to <?=$sitename?> Admin, You will be able to either
		call your bank in 3 days, or wait for your checking statement to get the
		exact amount we charged to your account. The amount will be between $1.00 -
		$3.00 Upon you receiving said amounts either by phone or your monthly
		statement you are required to come back to your <?=$sitename?> account and enter
		the correct amount charged to your account. Upon successfully entering the
		correct amount your account will instantly become verified and all
		restrictions lifted.</p>
		<p>
		<input type="checkbox" value="YES" name="agreement"></font><span class=tiny>
		I accept this agreement.<br>
		(Your order will NOT be processed UNLESS this box is CHECKED)
		<br><center><br><br><input type=submit name=submit value="Submit">
	</td>
</tr>
</table>
</form>