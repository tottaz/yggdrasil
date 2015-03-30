<table width="100%" border="0" align="center" bgcolor="#FFFFFF">
<tr>
	<td bgcolor="#FFFFFF">
		<table width="100%" border="0" align="center" cellpadding="3" cellspacing="3" bgcolor="#FFFFFF">
		<tr>
			<td width=20> </td>
			<td valign="top">
				<table width="100%" border="0" cellspacing="0" cellpadding="3" bgcolor="#FFFFFF">
				<tr>
					<td>
						<span class="text4">Deposit Money</span><br>
						<hr width="100%" size="1"><br>
					</td>
				</tr>
				<tr>
					<td> </td>
				</tr>
				<tr>
					<td bgcolor="#FFFFFF">
<?
	$source = $_POST['source'];
	$amount = (float)$_POST['amount'];
	$processed = 0;

	if($source){
		if( !$_POST['step'] ){
			if($use_pin){
				if (strlen($_POST['pincode']) < 1){
					errform('Please enter your pincode.'); // #err
				}else if($data->pin != $_POST['pincode']){
					errform('Please enter a valid pincode.'); // #err
				}
			}
		}
		// PayPal processing
		if ($paypal_use && $source == 'paypal'){
			include("core/payment/paypal.php");
		}elseif ($cc_use && $source == 'cc'){
			// 2CheckOut Credit card processing
			include("core/payment/2checkout.php");
		}elseif ($anet_use && $source == 'anet'){
			// Authorize.Net Credit card processing
			include("core/payment/anet.php");
		}elseif ($anet_use && $source == 'anetc'){
			// Authorize.Net Credit card processing
			include("core/payment/anetcheck.php");
		}elseif ($eg_use && $source == 'eg'){
			// E-Gold processing
			include("core/payment/egold.php");
		}elseif ($np_use && $source == 'np'){
			// Netpay processing
			include("core/payment/netpay.php");
		}elseif ($qchex_use && $source == 'qchex'){
			// Check processing
			include("core/payment/qchex.php");
		}elseif ($check_use && $source == 'check'){
			// Check processing
			include("core/payment/check.php");
		}
	}
	if (!$processed){
		// Generate form
?>
		<P><FONT COLOR="#FF0000" FACE="Verdana,Tahoma,Arial,Helvetica,Sans-serif,sans-serif"><B>
		Please choose which method you prefer to fund your <?=$sitename?> account with.
		</B></FONT><B></B></P>
		<P><FONT SIZE="-2" FACE="Verdana,Tahoma,Arial,Helvetica,Sans-serif,sans-serif">
		Funding of your account usually occurs in less than 1 hour (during business hours), but could take up to 
		12 hours unless stated as "instant funding method".
		</FONT></P><center>
		<TABLE class=design cellspacing=0>
		<FORM method=post>
		<TR><TH colspan=2>Deposit Funds to Your Account</TH</TR>
		<TR><TD>Amount to deposit:</TD>
			<TD><?=$currency?> <input type=text size=7 maxLength=7 name=amount></TD></TR>
<?	if($use_pin){	?>
		<TR><TD>Your pincode:</TD>
			<TD><INPUT type=password name=pincode size=6 maxLength=6></TD></TR>
<?	}	?>
		<TR><TD valign="top">Payment method:</TD>
		<TD>
<?
  		// PayPal
  		if ($paypal_use){
    			echo "<input type=radio class=checkbox name=source value='paypal' ",($source == 'paypal' ? 'checked' : ''),">","Paypal";
    			if ($dep_pp_percent || $dep_pp_fee){
    	  			echo " <span class=small>(cost: ",
					($dep_pp_percent ? "$dep_pp_percent%" : ""),
					($dep_pp_percent && $dep_pp_fee ? " + " : ""),
					($dep_pp_fee ? $currency.$dep_pp_fee : ""),
					")</span>";
			}
			echo "<br>\n";
		}
  		// 2CheckOut
  		if ($cc_use){
    			echo "<input type=radio class=checkbox name=source value='cc' ",($source == 'cc' ? 'checked' : ''),">","Credit Card / Online Check";
    			if ($dep_cc_percent || $dep_cc_fee){
      			echo " <span class=small>(cost: ",
					 ($dep_cc_percent ? "$dep_cc_percent%" : ""),
					 ($dep_cc_percent && $dep_cc_fee ? " + " : ""),
					 ($dep_cc_fee ? $currency.$dep_cc_fee : ""),
           			")</span>";
           	}
    			echo "<br>\n";
  		}
		// Authorize.Net
		if ($anet_use){
			echo "<input type=radio class=checkbox name=source value='anet' ",($source == 'anet' ? 'checked' : ''),">",
			"Credit Card";
			if ($dep_anet_percent || $dep_anet_fee)
				echo " <span class=small>(cost: ",
				($dep_anet_percent ? "$dep_anet_percent%" : ""),
				($dep_anet_percent && $dep_anet_fee ? " + " : ""),
				($dep_anet_fee ? $currency.$dep_anet_fee : ""),
				")</span>";
			echo "<br>\n";
			echo "<input type=radio class=checkbox name=source value='anetc' ",($source == 'anetc' ? 'checked' : ''),">",
			"Deposit from Bank Account";
			if ($dep_anet_percent || $dep_anet_fee)
				echo " <span class=small>(cost: ",
				($dep_anet_percent ? "$dep_anet_percent%" : ""),
				($dep_anet_percent && $dep_anet_fee ? " + " : ""),
				($dep_anet_fee ? $currency.$dep_anet_fee : ""),
				")</span>";
			echo "<br>\n";
		}
  		// E-Gold
  		if ($eg_use){
    			echo "<input type=radio class=checkbox name=source value='eg' ",($source == 'eg' ? 'checked' : ''),">","E-Gold";
    			if ($dep_eg_percent || $dep_eg_fee){
      			echo " <span class=small>(cost: ",
					 ($dep_eg_percent ? "$dep_eg_percent%" : ""),
					 ($dep_eg_percent && $dep_eg_fee ? " + " : ""),
					 ($dep_eg_fee ? $currency.$dep_eg_fee : ""),
           			")</span>";
           	}
    			echo "<br>\n";
  		}
  		// NetPay
  		if ($np_use){
    			echo "<input type=radio class=checkbox name=source value='np' ",($source == 'np' ? 'checked' : ''),">","NetPay";
    			if ($dep_np_percent || $dep_np_fee){
      			echo " <span class=small>(cost: ",
					 ($dep_np_percent ? "$dep_np_percent%" : ""),
					 ($dep_np_percent && $dep_np_fee ? " + " : ""),
					 ($dep_np_fee ? $currency.$dep_np_fee : ""),
           			")</span>";
           	}
    			echo "<br>\n";
  		}
  		// QChex
  		if ($qchex_use){
    			echo "<input type=radio class=checkbox name=source value='qchex' ",($source == 'qchex' ? 'checked' : ''),">","Check";
    			if ($dep_qc_percent || $dep_qc_fee){
      			echo " <span class=small>(cost: ",
					 ($dep_qc_percent ? "$dep_qc_percent%" : ""),
					 ($dep_qc_percent && $dep_qc_fee ? " + " : ""),
					 ($dep_qc_fee ? $currency.$dep_qc_fee : ""),
           			")</span>";
           	}
    			echo "<br>\n";
  		}
  		// Check
  		if ($check_use){
			echo "<input type=radio class=checkbox name=source value='check' ",($source == 'check' ? 'checked' : ''),">","Regular Mail";
			if ($dep_check_percent || $dep_check_fee){
				echo " <span class=small>(cost: ",
					($dep_check_percent ? "$dep_check_percent%" : ""),
					($dep_check_percent && $dep_check_fee ? " + " : ""),
					($dep_check_fee ? $currency.$dep_check_fee : ""),
					")</span>";
			}
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
			</td>
		</tr>
		</table>
	</td>
</tr>
</table>
</table>