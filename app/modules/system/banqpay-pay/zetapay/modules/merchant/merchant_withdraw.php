<?
    global $zetadb;

	$source = $_POST['source'];
	$amount = (float)$_POST['amount'];
	if (!$step) $step = 1;
	$balance = balance($user);
	if($allow_verify){
		$veri = verified($user);
		if ($veri < 1){
			$old_time = mktime (0,0,0,date("m"),date("d")-30,date("Y"));
			$time2 = mktime (0,0,0,date("m"),date("d"),date("Y"));
			$qr1 = $zetadb->Execute("SELECT sum(amount) AS amount FROM ".TBL_USER_TRANSACTIONS." WHERE (paidby=$user) AND (paidto<101) AND UNIX_TIMESTAMP(trdate)>$old_time AND UNIX_TIMESTAMP(trdate)<$time2 ORDER BY trdate");
			$a = $qr1->FetchNextObject();
			$tot_w = $a->AMOUNT;
			if ($tot_w == ""){
				$tot_w = "0.00";
			}
			if ($tot_w > $nv_limit){
				echo ("<br><br><br><li>You are not a verified member of $sitename.");
				echo ("<li>You cannot withdraw more than $".myround($nv_limit)." in interval of 30 days which is the limit for a non-verified member.");
				echo ("<li>You have already made $ $tot_w  withdrawal in last 30 days.");
				echo ("<li>To become verified member - <a href=index.php?a=merchant_add_card&$id><b>Click here</b></a>");
				echo ("<br><br><br>");
				if ( !@file_exists('footer.htm') ){
					include('footer.php');
				}else{
					include('footer.htm');
				}
				exit;
			}
		}
	}
	$proceed = 1;
	if($source){
		if($_POST['proceed1']){
			if($use_pin){
				if (strlen($_POST['pincode']) < 1){
					errform('Please enter your pincode.'); // #err
					$proceed = 0;
				}
				if($data->pin != $_POST['pincode']){
					errform('Please enter a valid pincode.'); // #err
					$proceed = 0;
				}
			}
		}
	}
	if($source && $proceed){
		// PayPal processing
		if ($w_pp && $source == 'paypal'){
			$fee = $wdr_pp_fee;
			if ($amount >= $minimal_withdrawal + $fee && $balance >= $amount){
				$step = 2;
				$fields = array(
					array("x_email", "PayPal E-mail")
				);
				$title = "PayPal Recipient Information";
				if ($_POST['proceed2'])
					$step = 3;
				if ($_POST['proceed3'])
					$step = 4;
			}else{
				if ($balance < $amount)
					errform("Sorry, but you do not have sufficient funds in your account to conduct this transaction.");
				else
					errform('The minimum amount of funds you may withdraw is '.$currency.($minimal_withdrawal + $fee));
				$step = 1;
			}
		}else if ($w_eg && $source == 'egold'){
			$fee = $wdr_eg_fee;
			if ($amount >= $minimal_withdrawal + $fee && $balance >= $amount){
				$step = 2;
				$fields = array(
					array("x_account", "E-gold Account")
				);
				$title = "E-Gold Recipient Information";
				if ($_POST['proceed2'])
					$step = 3;
				if ($_POST['proceed3'])
					$step = 4;
			}else{
				if ($balance < $amount)
					errform("Sorry, but you do not have sufficient funds in your account to conduct this transaction.");
				else
					errform('The minimum amount of funds you may withdraw is '.$currency.($minimal_withdrawal + $fee));
				$step = 1;
			}
		}elseif ($source == 'wire'){
			// Wire transfer processing
			$fee = $wdr_wire_fee;
			if ($amount >= $minimal_withdrawal + $fee && $balance >= $amount){
				$step = 2;
				$fields = array(
					array("x_name", "Account Holder's Name", 30),
					array("x_bank", "Bank Name", 30),
					array("x_address", "Bank Street Address", 40),
					array("x_address2", "", 40, 1),
					array("x_city", "Bank City", 30),
					array("x_state", "Bank State/Province", 30),
					array("x_country", "Bank Country", 30),
					array("x_postcode", "Bank Zip/Postal Code", 10),
					array("x_accno", "Bank Account Number", 20),
					array("x_swift", "Bank Routing/Swift Code", 20),
					array("x_acctype", "Bank Account Type", -1),
					array("x_info", "Additional Information", -2)
				);
				$title = "Provide Bank Information";
				if ($_POST['proceed2'])
					$step = 3;
				if ($_POST['proceed3'])
					$step = 4;
			}else{
				if ($balance < $amount)
					errform("Sorry, but you do not have sufficient funds in your account to conduct this transaction.");
				else
					errform('The minimum amount of funds you may withdraw is '.$currency.($minimal_withdrawal + $fee));
				$step = 1;
			}
		}elseif ($check_use && $source == 'check'){
			// Check processing
			$fee = $wdr_check_fee;
			if ($amount >= $minimal_withdrawal + $fee && $balance >= $amount){
				$step = 2;
				$fields = array(
					array("x_cname", "Check Payable To"),
					array("x_caddress", "Address"),
					array("x_ccity", "City, State/Province, Country"),
					array("x_cpostcode", "Zip/Postal Code")
				);
				$title = "Provide check information";
				if ($_POST['proceed2'])
					$step = 3;
				if ($_POST['proceed3'])
					$step = 4;
			}else{
				if ($balance < $amount)
					errform("Sorry, but you do not have sufficient funds in your account to conduct this transaction.");
				else
					errform('The minimum amount of funds you may withdraw is '.$currency.($minimal_withdrawal + $fee));
				$step = 1;
			}
		}elseif ($_POST['proceed1']){
			errform('Please select a payment method');
			$step = 1;
		}
	}
?>
<table width="100%" border="0" align="center" bgcolor="#FFFFFF">
<tr>
	<td>
		<table width="100%" border="0" align="center" cellpadding="3" cellspacing="3" bgcolor="#FFFFFF">
		<tr>
			<td width=20> </td>
			<td width="519" valign="top">
				<table width="100%" border="0" cellspacing="0" cellpadding="3">
				<tr>
					<td>
						<span class="text4">Withdraw Money</span>
<?						if ($step <= 3) echo "<span class=small><b>(Step $step of 3)</span>";	?>
						<BR>
						<hr width="100%" size="1"><br>
					</td>
				</tr>
				<tr>
					<td>
<?
	switch ($step){
		case 2:
echo <<<END
			<SCRIPT language=JavaScript>
				function setCookie(name, value, minutes) {
					if (minutes) { now = new Date(); now.setTime(now.getTime() + minutes*60*1000); }
					var curCookie = name + "=" + escape(value) + ((minutes) ? "; expires=" + now.toGMTString() : "");
					document.cookie = curCookie;
				}
				function getCookie(name) {
					var prefix = name + "=";
					var cStartIdx = document.cookie.indexOf(prefix);
					if (cStartIdx == -1) return '';
					var cEndIdx = document.cookie.indexOf(";", cStartIdx+prefix.length);
					if (cEndIdx == -1) cEndIdx = document.cookie.length;
					return unescape( document.cookie.substring(cStartIdx + prefix.length, cEndIdx) );
				}
			</SCRIPT>
END;
			// Generate form
			echo "<BR><CENTER>",
				"<TABLE class=design cellspacing=0><FORM method=post name=form1>",
				"<tr><th colspan=2>",$title;
			while ($a = each($fields)){
				$x = $a[1];
				$set .= "setCookie('$x[0]',form1.$x[0].value);";
				$get .= "form1.$x[0].value=getCookie('$x[0]');";
				if ($x[1])
				echo "<TR><TD>$x[1]<TD>";
				else
				echo "<BR>";
				switch ($x[2]){
					case -1:
						echo 	"<SELECT name=$x[0]><OPTION>Personal Checking<OPTION>Personal Savings",
								"<OPTION>Business Checking<OPTION>Business Savings</SELECT>";
						break;
					case -2:
						echo "<TEXTAREA name=$x[0] cols=40 rows=4></TEXTAREA>";
						break;
					default:
						echo "<INPUT type=text name=$x[0] size=$x[2]>";
				}
			}
			echo "<TR><TH colspan=2 class=submit>",
				 "<INPUT type=submit class=button onClick=\"$set\" name=proceed2 value='Proceed >>'></TH>",
				 "<INPUT type=hidden name=source value=$source>",
				 "<INPUT type=hidden name=amount value=$amount>",
				 $id_post,
				 "</FORM></TABLE>",
				 "</CENTER><BR>",
				 "<SCRIPT language=JavaScript>$get</SCRIPT>";
			break;
		case 3:
			$i = 0;
			$str = '';
			while ($a = each($_POST)){
				if (substr($a[0], 0, 2) == 'x_'){
					if ($fields[$i][1]){
						$value = $fields[$i][1].": ".$a[1];
					}else{
						$value = ", ".$a[1];
					}
					$str .= htmlspecialchars($value);
					$hidden .= $value;
					$i++;
					if (!$fields[$i][3]){
						$str .= "<br>";
						$hidden .= "\n";
					}
				}
			}
?>
			<BR>
			<B><div width=100% class=highlight>Please confirm the following before withdrawing funds:<br>
			<BR>Received: <?=dpsumm($amount - $fee)?><BR>
				Fee: +<?=dpsumm($fee)?><BR>
				Total Withdrawn: <?=dpsumm($amount)?><BR>
				<br>
				<?=$str?>
			  </DIV>
			  <CENTER>
			  <FORM method=post>
				<INPUT type=hidden name=source value=<?=$source?>>
				<INPUT type=hidden name=amount value=<?=$amount?>>
				<INPUT type=hidden name=addinfo value="<?=htmlspecialchars($hidden)?>">
				<INPUT type=submit class=button name=proceed3 value='Withdraw Money'>
				<?=$id_post?>
			  </FORM>
			  </CENTER>
			  </B>
<?
	  			break;
		case 4:
			// Update database
			//settype($fee, 'integer');
			$charge = $amount;
			$amount -= $fee;

			$rs = $zetadb->Execute("SELECT id FROM ".TBL_SYSTEM_USERS." WHERE username='".addslashes($source)."'");
			$a = $rs->FetchNextObject();

			if ($a){
				$addinfo = addslashes($_POST['addinfo']);
			}
			transact($user,$a->ID,$amount,'Withdrawal','',$fee,1,$addinfo);
			$action = 'account';
			// Notify admin
			$message = $GLOBALS[$data->type]." $data->email has just withdrawn {$currency}$charge !";
			if ($wdr_notify){
				wrapmail($adminemail, "$sitename Withdrawal", $message, $defaultmail);
			}
			ob_start();
			header("Location: index.php?a=merchant_account&suid=$merchant_suid");
			break;
		default:
		{
?>
			<BR>
			<CENTER>
			<TABLE class=design cellspacing=0>
			<FORM method=post>
			<TR><TH colspan=2>Withdraw funds from your account</TH>
			<TR><TD>Amount to withdraw:</TD>
				<TD><?=$currency?> <INPUT type=text size=5 maxLength=5 name=amount value="<?=myround($_POST['amount'])?>">
<?	if($use_pin){	?>
			<TR><TD>Your pincode:</TD>
				<TD><INPUT type=password name=pincode size=6 maxLength=6></TD></TR>
<?	}	?>
			<TR><TD>Payment method:</TD>
				<TD>
<?
			// PayPal
			if ($w_pp){
				echo 	"<INPUT type=radio class=checkbox name=source value='paypal' ",($source == 'paypal' ? 'checked' : ''),">",
						"PayPal",
						" <SPAN class=small>(cost: ",dpsumm($wdr_pp_fee),")</SPAN><BR>\n";
			}
			// E-Gold
			if ($w_eg){
				echo 	"<INPUT type=radio class=checkbox name=source value='egold' ",($source == 'egold' ? 'checked' : ''),">",
						"E-gold",
						" <SPAN class=small>(cost: ",dpsumm($wdr_eg_fee),")</SPAN><BR>\n";
			}
			// Wire
			echo 	"<INPUT type=radio class=checkbox name=source value='wire' ",($source == 'wire' ? 'checked' : ''),">",
					"Wire transfer",
					" <SPAN class=small>(cost: ",dpsumm($wdr_wire_fee),")</SPAN><BR>\n";
			// Check
			if ($check_use){
				echo 	"<INPUT type=radio class=checkbox name=source value='check' ",($source == 'check' ? 'checked' : ''),">",
						"Regular Mail",
						" <SPAN class=small>(cost: ",dpsumm($wdr_check_fee),")</SPAN><BR>\n";
			}
?>
			<TR><TH colspan=2 class=submit><INPUT type=submit class=button name=proceed1 value='Proceed >>'></TH>
  			<?=$id_post?>
			</TR>
			</FORM>
			</TABLE>
			</CENTER>

<?
		}
	}
?>
			</td>
		</tr>
		</table>
	</td>
</tr>
</table>
</table>