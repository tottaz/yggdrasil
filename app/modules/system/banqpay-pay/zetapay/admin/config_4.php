<?
if ($_POST['change2'] && $action == 'config'){
	$a_int = array(
		'ulist_page','charge_signup','banner_days','b_width','b_height','aff_levels'
	);
	$a_percent = array(
		'referral_payout', 'dep_pp_percent','dep_sp_percent', 'dep_cc_percent','dep_eg_percent',
		'dep_np_percent','special_discount','transfer_percent','escrow_percent', 'dep_anet_percent','dep_qc_percent'
	);
	$a_float = array(
		'signup_bonus',  
		'minimal_transfer','minimal_escrow', 'dep_pp_fee','dep_sp_fee', 'dep_cc_fee','dep_anet_fee','dep_eg_fee',
		'dep_np_fee','dep_check_fee', 'minimal_deposit','wdr_pp_fee','wdr_eg_fee','wdr_check_fee', 'wdr_wire_fee',
		'minimal_withdrawal','signup_fee','ex_rate','transfer_fee','escrow_fee','banner_fee','nv_limit',
		'dep_qc_fee'
	);
	$a_string = array(
		'paypal_id','stormpay_id', 'tocheckout_sid','egold_sid','netpay_sid','sales_tax','currency',
		'dcolor','bcolor','scolor','gcolor','pcolor','anet_sid','anet_pwd','qchex_sid'
	);
	$a_check = array(
		'dep_notify', 'wdr_notify','paypal_use', 'paypal_auto_deposit', 'egold_auto_deposit','allow_verify',
		'cc_use', 'check_use','multi_special','multi_levels','eg_use','enforce_co','enforce_do','enforce_sub','enforce_es',
		'np_use','send_i','send_r','anet_use','affil_on','w_pp','w_eg','bannerads','qchex_use'
	);
	$a_textarea = array(
		'dep_check'
	);
	$str = "<?\n";
	mysql_query("DELETE FROM zetapay_config2");
	while ($a = each($_POST)){
		if (substr($a[0], 0, 9) == 'separator'){
			$str .= "\n// $a[1]\n";
		}elseif (in_array($a[0], $a_int)){
#			$str .= '$'."{$a[0]} = ".(int)$a[1].";\n";
			$name = $a[0];
			$value = (int)$a[1];
		}elseif (in_array($a[0], $a_percent)){
			$x = (double)$a[1];
			if ($x < 0 || $x > 100) $x = 0;
#			$str .= '$'."{$a[0]} = $x;\n";
			$name = $a[0];
			$value = $x;
		}elseif (in_array($a[0], $a_float)){
			$str .= '$'."{$a[0]} = ".number_format($a[1], 2, '.', '').";\n";
			$name = $a[0];
			$value = number_format($a[1], 2, '.', '');
		}elseif (in_array($a[0], $a_string)){
			$str .= '$'."{$a[0]} = \"".preg_replace("/[\"\\\\]/", "\\\\\\0", $a[1])."\";\n";
			$name = $a[0];
			$value = preg_replace("/[\"\\\\]/", "\\\\\\0", $a[1]);
		}elseif (in_array($a[0], $a_check)){
			$str .= '$'."{$a[0]} = ".($a[1] ? '1' : '0').";\n";
			$name = $a[0];
			$value = ($a[1] ? '1' : '0');
		}elseif (in_array($a[0], $a_textarea)){
#			$str .= '$'."{$a[0]} = \"".str_replace(array("\r","\n"), array("","\\n"), preg_replace("/[\"\\\\]/", "\\\\\\0", $a[1]))."\";\n";
			$name = $a[0];
			$value = str_replace(
						array("\r","\n"), array("","\\n"), 
						preg_replace("/[\"\\\\]/", "\\\\\\0", $a[1])
					);
		}
		if($name){
			mysql_query("INSERT INTO zetapay_config2 SET name='$name',value='$value'");
		}
	}
	$str .= "\n?>";
	echo "<div style='color: red;'>Update variables successful.</div><br>";
/*
	$f = fopen("config2.php", "w");
	if ($f){
		fwrite($f, $str);
		fclose($f);
		echo "<div style='color: red;'>Update variables successful.</div><br>";
	}else{
		echo "<div style='color: red;'>Update variables failed. Check write permissions for file \"config2.php\".</div><br>";
	}
*/
	include("config2.php");
}
// 2checkout only allows this type of script for escrow services. Make sure the site is actually completely changed if you use this.
$include2co = 0;
?>
<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
Currency Options
</b></div>
<!------\\\\\\\\\\\\\\\--->
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding-left:10px;">&nbsp;</td>
	<TD>
		<TABLE class=design width=100% cellspacing=0>
			<TR><TD width=60%><b>currency</b> - Currency sign (e.g. "$").
				<TD><input type=text size=10 name=currency value="<?=htmlspecialchars($currency)?>">
<!--
			<TR><TD width=60%><b>credit value</b> - How much is one credit worth? (e.g. "1.0").
				<TD><input type=text size=10 name=ex_rate value="<?=$ex_rate?>">
-->
		</TABLE>
	</TD>
</tr>
</table>
<BR>
<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
Signup Options
</b></div>
<!------///////////////--->
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding-left:10px;">&nbsp;</td>
	<TD>
		<TABLE class=design width=100% cellspacing=0>
			<TR><TD width=60%><b>Signup Bonus</b> - Amount to credit newly registered members. Default: "1"</TD>
				<TD><input type=text size=10 name=signup_bonus value="<?=htmlspecialchars($signup_bonus)?>"></TD></TR>
		</TABLE>
	</td>
</tr>
</table>
<BR>
<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
Payments and Charges
</b></div>
<!------///////////////--->
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding-left:10px;">&nbsp;</td>
	<TD>
		<TABLE class=design width=100% cellspacing=0>
			<input type=hidden name=separator4 value="$">
			<TR><TD width=60%><b>Sales Tax</b> - If applicable. Default: "0"</TD>
				<TD><input type=text size=10 name=sales_tax value="<?=htmlspecialchars($sales_tax)?>"></TD></TR>
			<TR><TD width=60%><b>Send Invoices</b> - If you wish to send an invoice after each financial transaction</TD>
			<td><input type=checkbox class=checkbox name=send_i value=1 <? if ($send_i) echo 'checked'; ?>></TD></TR>
			<TR><TD width=60%><b>Send Receipts</b> - If you wish to send a receipt along with each invoice</TD>
				<td><input type=checkbox class=checkbox name=send_r value=1 <? if ($send_r) echo 'checked'; ?>></TD></TR>
		</TABLE>
	</td>
</tr>
</table>
<BR>
<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
Referall System
</b></div>
<!------///////////////--->
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding-left:10px;">&nbsp;</td>
	<TD>
		<TABLE class=design width=100% cellspacing=0>
			<input type=hidden name=separator18 value="referralls">
			<TR><TD width=60%><b>Referall System</b> - Turn Affiliate System on or off. <br><FONT COLOR="#008000"><b>We recommend: Enable</b></FONT></TD>
				<TD><input type=checkbox class=checkbox name=affil_on value=1 <? if ($affil_on) echo 'checked'; ?>></TD></TR>
			<TR><TD width=60%><b>Referral Payout</b> - Payout for referred users by registered members. The percentage of the income from a registered member that is given to the person that referred him. Reasonable values are 0 - 50.</TD>
				<TD><input type=text size=10 name=referral_payout value="<?=htmlspecialchars($referral_payout)?>"></TD></TR>
			<TR><TD width=60%><b>Referral Levels</b> - How many tiers do you wish the referrall system to use. Default value is 6.</TD>
				<TD><input type=text size=10 name=aff_levels value="<?=htmlspecialchars($aff_levels)?>"></TD></TR>
		</TABLE>
	</td>
</tr>
</table>
<BR>
<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
Banner Ads
</b></div>
<!------///////////////--->
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding-left:10px;">&nbsp;</td>
	<TD>
		<TABLE class=design width=100% cellspacing=0>
			<input type=hidden name=separator15 value="ads">
			<TR><TD width=60%><b>Allow Banner Ads?</b> - Allow users to pay to advertise their banners. <br><FONT COLOR="#008000"><b>We recommend: Enable</b></FONT></TD>
				<TD><input type=checkbox class=checkbox name=bannerads value=1 <? if ($bannerads) echo 'checked'; ?>></TD></TR>
			<TR><TD width=60%><b>Banner Fee</b> - Amount to charge users to post banner ads. (This amount is automatically taken out of their accounts).</TD>
				<TD><input type=text size=10 name=banner_fee value="<?=htmlspecialchars($banner_fee)?>"></TD></TR>
			<TR><TD width=60%><b>Banner Days</b> - How long to allow people to advertise for?.</TD>
				<TD><input type=text size=10 name=banner_days value="<?=htmlspecialchars($banner_days)?>"></TD></TR>
			<TR><TD width=60%><b>Image Dimensions</b> - Image Dimension size for banners.</TD>
				<TD>
					Width: <input type=text size=6 name=b_width value="<?=htmlspecialchars($b_width)?>"> &nbsp;
					Height: <input type=text size=6 name=b_height value="<?=htmlspecialchars($b_height)?>"></TD</TR>
		</TABLE>
	</td>
</table>
<BR>
<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
Verify Users<input type=hidden name=separator17 value="VERIFY">
</b></div>
<!------///////////////--->
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding-left:10px;">&nbsp;</td>
	<TD>
		<TABLE class=design width=100% cellspacing=0>
			<TR><TD width=60%><b>Allow Verify</b> - Enable this to allow users to become verified. <br><FONT COLOR="#008000"><b>We recommend: Enable</b></FONT></TD>
				<TD><input type=checkbox class=checkbox name=allow_verify value=1 <? if ($allow_verify) echo 'checked'; ?>></TD></TR>
			<TR><TD width=60%><b>Non-verified Withdrawal Limit</b> - The amount non-verified users can withdraw a month. Default: "50" ($50.00)</TD>
				<TD><input type=text size=10 name=nv_limit value="<?=htmlspecialchars($nv_limit)?>"></TD></TR>
		</TABLE>
	</td>
</table>
<BR>
<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
Transfers<input type=hidden name=separator19 value="TRANSFER">
</b></div>
<!------///////////////--->
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding-left:10px;">&nbsp;</td>
	<TD>
		<TABLE class=design width=100% cellspacing=0>
			<TR><TD width=60%><b>Minimum Transfer</b> - Minimum transfer amount (dollars). Default: "5"</TD>
				<TD><input type=text size=10 name=minimal_transfer value="<?=htmlspecialchars($minimal_transfer)?>"></TD></TR>
			<TR><TD width=60%><b>Transfer Fee</b> - Percentage to charge individuals when they receive money. Default: "5"</TD>
				<TD><input type=text size=10 name=transfer_percent value="<?=htmlspecialchars($transfer_percent)?>"></TD></TR>
			<TR><TD width=60%><b>Transfer Fee</b> - Fee to charge individuals when they receive money (dollars). Default: "5"</TD>
				<TD><input type=text size=10 name=transfer_fee value="<?=htmlspecialchars($transfer_fee)?>"></TD></TR>
			<TR><TD width=60%><b>Enforce on Buy Now</b> - Enable this to make Buy Now buttons require the Minimum Transfer amount listed above. <br><FONT COLOR="#008000"><b>We recommend: Enable</b></FONT></TD>
				<TD><input type=checkbox class=checkbox name=enforce_co value=1 <? if ($enforce_co) echo 'checked'; ?>></TD></TR>
			<TR><TD width=60%><b>Enforce on Donations</b> - Enable this to make Donation buttons require the Minimum Transfer amount listed above. <br><FONT COLOR="#008000"><b>We recommend: Enable</b></FONT></TD>
				<TD><input type=checkbox class=checkbox name=enforce_do value=1 <? if ($enforce_do) echo 'checked'; ?>></TD></TR>
			<TR><TD width=60%><b>Enforce on Subscription</b> - Enable this to make Buy Now buttons require the Minimum Transfer amount listed above. <br><FONT COLOR="#008000"><b>We recommend: Enable</b></FONT></TD>
				<TD><input type=checkbox class=checkbox name=enforce_sub value=1 <? if ($enforce_sub) echo 'checked'; ?>></TD></TR>
		</TABLE>
	</td>
</table>
<BR>
<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
Escrow<input type=hidden name=separator49 value="ESCROW">
</b></div>
<!------///////////////--->
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding-left:10px;">&nbsp;</td>
	<TD>
		<TABLE class=design width=100% cellspacing=0>
			<TR><TD width=60%><b>Minimum Escrow</b> - Minimum escrow amount (dollars). Default: "5"</TD>
				<TD><input type=text size=10 name=minimal_escrow value="<?=htmlspecialchars($minimal_escrow)?>"></TD></TR>
			<TR><TD width=60%><b>Escrow Fee</b> - Percentage to charge individuals when they receive money via Escrow. Default: "5"</TD>
				<TD><input type=text size=10 name=escrow_percent value="<?=htmlspecialchars($escrow_percent)?>"></TD></TR>
			<TR><TD width=60%><b>Escrow Fee</b> - Fee to charge individuals when they receive money via Escrow (dollars). Default: "5"</TD>
				<TD><input type=text size=10 name=escrow_fee value="<?=htmlspecialchars($escrow_fee)?>"></TD></TR>
		</TABLE>
	</td>
</table>
<BR>
<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
Deposits<input type=hidden name=separator5 value="DEPOSIT">
</b></div>
<!------///////////////--->
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding-left:10px;">&nbsp;</td>
	<TD>
		<TABLE class=design width=100% cellspacing=0>
			<TR><TD width=60%><b>Deposits - Notify</b> - Notify admin for all deposit events.  <br><FONT COLOR="#008000"><b>We recommend: Enable</b></FONT></TD>
				<TD><input type=checkbox class=checkbox name=dep_notify value=1 <? if ($dep_notify) echo 'checked'; ?>></TD></TR>
			<TR><TD width=60%><b>Minimum deposit</B> - Minimum amount that a member can deposit into account. Default: "10" ($10.00)</TD>
				<TD><input type=text size=10 name=minimal_deposit value="<?=htmlspecialchars($minimal_deposit)?>"></TD></TR>
		</TABLE>
	</td>
</table>
<BR>
<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
Withdrawals<input type=hidden name=separator6 value="WITHDRAW">
</b></div>
<!------///////////////--->
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding-left:10px;">&nbsp;</td>
	<TD>
		<TABLE class=design width=100% cellspacing=0>
			<TR><TD width=50%><b>Notification</b> - Notify admin for all withdrawal events. <br><FONT COLOR="#008000"><b>We recommend: Enable</b></FONT></TD>
				<TD><input type=checkbox class=checkbox name=wdr_notify value=1 <? if ($wdr_notify) echo 'checked'; ?>></TD></TR>
			<TR><TD width=60%><b>Withdrawal Minimum</b> - Minimu, withdrawal amount. This is the minimum withdrawal amount (not counting the comissions). Default: "30" ($30.00)</TD>
				<TD><input type=text size=10 name=minimal_withdrawal value="<?=htmlspecialchars($minimal_withdrawal)?>"></TD></TR>
			<TR><TD width=60%><b>Withdrawal Wire Transfer</b> - Amount to charge for withdrawals via wire transfer. Default: "21.0"</TD>
				<TD><input type=text size=10 name=wdr_wire_fee value="<?=htmlspecialchars($wdr_wire_fee)?>"></TD></TR>
		</TABLE>
	</td>
</table>
<BR>
<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
Payments & Credit Card Transactions<input type=hidden name=separator5 value="GATEWAYS">
</b></div>
<!------///////////////--->
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding-left:10px;">&nbsp;</td>
	<TD>
		<TABLE style="background-color: #EFEFEF;border-color: #5F7493 #5F7493 #5F7493 #5F7493 ;border-style: solid;border-width: 1px;padding: 3px; " width=100% cellspacing=0>
		<TR><TD colspan=2 align=left style="padding-left:10px;">
			<!------///////////////--->
			<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
			PayPal<input type=hidden name=separator7 value="PAYPAL">
			</b></div>
			<!------///////////////--->
			<TABLE width=100% cellspacing=0>
			<tr>
				<td style="padding-left:10px;">&nbsp;</td>
				<TD>
					<TABLE class=design width=90% cellspacing=0>
						<TR><TD width=60%><b>PaypPal Option</b> - Use PayPal processing. <br><FONT COLOR="#008000"><b>We recommend: Enable</b></FONT></TD>
							<TD><input type=checkbox class=checkbox name=paypal_use value=1 <? if ($paypal_use) echo 'checked'; ?>></TD></TR>
						<TR><TD width=60%><b>PayPal ID</b> - Your PayPal ID. This ID will be used for PayPal transactions.</TD>
							<TD><input type=text size=40 name=paypal_id value="<?=htmlspecialchars($paypal_id)?>"></TD></TR>
						<TR><TD width=60%><b>PayPal Auto Deposit</b> - Fully automated PayPal deposits. <br><FONT COLOR="#008000"><b>We recommend: Enable</b></FONT></TD>
							<TD><input type=checkbox class=checkbox name=paypal_auto_deposit value=1 <? if ($paypal_auto_deposit) echo 'checked'; ?>></TD></TR>
						<TR><TD width=60%><b>PayPal Transaction Fees</b> - Percentage to charge PayPal users. Default: "3.2"</TD>
							<TD><input type=text size=10 name=dep_pp_percent value="<?=htmlspecialchars($dep_pp_percent)?>"></TD></TR>
						<TR><TD width=60%><b>Additional PayPal Transaction Fees</b> - Additional admin transaction fee for PayPal users. Default: "0.3" ($0.30)</TD>
							<TD><input type=text size=10 name=dep_pp_fee value="<?=htmlspecialchars($dep_pp_fee)?>"></TD></TR>
						<TR><TD width=60%><b>Allow Withdrawals Via PayPal</b> - Allow people to use PayPal for withdrawals. <br><FONT COLOR="#008000"><b>We recommend: Enable</b></FONT></TD>
							<TD><input type=checkbox class=checkbox name=w_pp value=1 <? if ($w_pp) echo 'checked'; ?>></TD></TR>
						<TR><TD width=60%><b>Withdrawal Fee PayPal</b> - Amount to charge for withdrawals using PayPal. Default: "0.0"</TD>
							<TD><input type=text size=10 name=wdr_pp_fee value="<?=htmlspecialchars($wdr_pp_fee)?>"></TD></TR>
					</TABLE>
				</td>
			</table>
			<br>
<?	if($include2co){	?>
			<!------///////////////--->
			<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
			2CheckOut<input type=hidden name=separator9 value="CC">
			</b></div>
			<!------///////////////--->
			<TABLE width=100% cellspacing=0>
			<tr>
				<td style="padding-left:10px;">&nbsp;</td>
				<TD>
					<TABLE class=design width=90% cellspacing=0>
						<TR><TD width=60%><b>2Checkout Option</b> - Use credit card processing. We recommend: Enable</b></TD>
							<td><input type=checkbox class=checkbox name=cc_use value=1 <? if ($cc_use) echo 'checked'; ?>></TD></TR>
						<TR><TD width=60%><b>2Checkout ID</b> - 2CheckOut ID. This ID will be used for 2CheckOut transactions.</TD>
							<td><input type=text size=40 name=tocheckout_sid value="<?=htmlspecialchars($tocheckout_sid)?>"></TD></TR>
						<TR><TD width=60%><b>2Checkout Transation Fees</b> - Percentage to charge individuals using 2Checkout. Default: "5.5"</TD>
							<TD><input type=text size=10 name=dep_cc_percent value="<?=htmlspecialchars($dep_cc_percent)?>"></TD></TR>
						<TR><TD width=60%><b>Additional 2Checkout Transaction Fees</b> - Additional admin transaction fee for 2Checkout. Default: "0.5" ($0.50)</TD>
							<TD><input type=text size=10 name=dep_cc_fee value="<?=htmlspecialchars($dep_cc_fee)?>"></TD></TR>
					</TABLE>
				</td>
			</table>
			<BR>
<?	}	?>
			<!------///////////////--->
			<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
			Authorize.Net<input type=hidden name=separator10 value="AN">
			</b></div>
			<!------///////////////--->
			<TABLE width=100% cellspacing=0>
			<tr>
				<td style="padding-left:10px;">&nbsp;</td>
				<TD>
					<TABLE class=design width=90% cellspacing=0>
						<TR><TD width=60%><b>Authorize.Net Payment Option</b> - For credit card processing.
							<FONT COLOR="#008000"><br><FONT COLOR="#008000"><b>We recommend: Enable</b></FONT></FONT><BR>
							<td><input type=checkbox class=checkbox name=anet_use value=1 <? if ($anet_use) echo 'checked'; ?>></TD></TR>
						<TR><TD width=60%><b>Authorize.Net ID</b> - Authorize.net ID. This ID will be used for Authorize.net transactions.</TD>
							<td><input type=text size=40 name=anet_sid value="<?=htmlspecialchars($anet_sid)?>"></TD></TR>
						<TR><TD width=60%><b>Authorize.Net Password</b> - Authorize.net Password. This Password will be used for Authorize.net transactions.</TD>
							<td><input type=text size=40 name=anet_pwd value="<?=htmlspecialchars($anet_pwd)?>"></TD></TR>
						<TR><TD width=60%><b>Authorize.Net Transation Fees</b> - Percentage to charge individuals using Authorize.Net. Default: "5.5"</TD>
							<TD><input type=text size=10 name=dep_anet_percent value="<?=htmlspecialchars($dep_anet_percent)?>"></TD></TR>
						<TR><TD width=60%><b>Additional Authorize.Net Transaction Fees</b> - Additional admin transaction fee for Authorize.Net. Default: "0.5" ($0.50)</TD>
							<TD><input type=text size=10 name=dep_anet_fee value="<?=htmlspecialchars($dep_anet_fee)?>"></TD></TR>
					</TABLE>
				</td>
			</table>
			<BR>
			<!------///////////////--->
			<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
			E-Gold<input type=hidden name=separator12 value="EGOLD">
			</b></div>
			<!------///////////////--->
			<TABLE width=100% cellspacing=0>
			<tr>
				<td style="padding-left:10px;">&nbsp;</td>
				<TD>
					<TABLE class=design width=90% cellspacing=0>
						<TR><TD width=60%><b>E-Gold Option</b> - Use E-Gold processing. We recommend: Enable</b></TD>
							<td><input type=checkbox class=checkbox name=eg_use value=1 <? if ($eg_use) echo 'checked'; ?>></TD></TR>
						<TR><TD width=60%><b>E-Gold ID</b> - E-Gold ID. This ID will be used for E-Gold transactions.</TD>
							<td><input type=text size=40 name=egold_sid value="<?=htmlspecialchars($egold_sid)?>"></TD></TR>
						<TR><TD width=60%><b>E-Gold Auto Deposit</b> - Fully automated E-Gold deposits. <br><FONT COLOR="#008000"><b>We recommend: Enable</b></FONT></TD>
							<TD><input type=checkbox class=checkbox name=egold_auto_deposit value=1 <? if ($egold_auto_deposit) echo 'checked'; ?>></TD></TR>
						<TR><TD width=60%><b>E-Gold Transation Fees</b> - Percentage to charge individuals using E-Gold. Default: "5.5"</TD>
							<TD><input type=text size=10 name=dep_eg_percent value="<?=htmlspecialchars($dep_eg_percent)?>"></TD></TR>
						<TR><TD width=60%><b>Additional E-Gold Transaction Fees</b> - Additional admin transaction fee for E-Gold. Default: "0.5" ($0.50)</TD>
							<TD><input type=text size=10 name=dep_eg_fee value="<?=htmlspecialchars($dep_eg_fee)?>"></TD></TR>
						<TR><TD width=60%><b>Allow Withdrawals Via E-Gold</b> - Allow people to use E-Gold for withdrawals. <br><FONT COLOR="#008000"><b>We recommend: Enable</b></FONT></TD>
							<TD><input type=checkbox class=checkbox name=w_eg value=1 <? if ($w_eg) echo 'checked'; ?>></TD></TR>
						<TR><TD width=60%><b>Withdrawal Fee E-Gold</b> - Amount to charge for withdrawals using E-Gold. Default: "0.0"</TD>
							<TD><input type=text size=10 name=wdr_eg_fee value="<?=htmlspecialchars($wdr_eg_fee)?>"></TD></TR>
					</TABLE>
				</td>
			</table>
			<BR>
			<!------///////////////--->
			<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
			NetPay<input type=hidden name=separator13 value="NETPAY">
			</b></div>
			<!------///////////////--->
			<TABLE width=100% cellspacing=0>
			<tr>
				<td style="padding-left:10px;">&nbsp;</td>
				<TD>
					<TABLE class=design width=90% cellspacing=0>
						<TR><TD width=60%><b>NetPay Option</b> - Use NetPay processing. We recommend: Enable</b></TD>
							<td><input type=checkbox class=checkbox name=np_use value=1 <? if ($np_use) echo 'checked'; ?>></TD></TR>
						<TR><TD width=60%><b>NetPay ID</b> - NetPay ID. This ID will be used for NetPay transactions.</TD>
							<td><input type=text size=40 name=netpay_sid value="<?=htmlspecialchars($netpay_sid)?>"></TD></TR>
						<TR><TD width=60%><b>NetPay Transation Fees</b> - Percentage to charge individuals using NetPay. Default: "5.5"</TD>
							<TD><input type=text size=10 name=dep_np_percent value="<?=htmlspecialchars($dep_np_percent)?>"></TD></TR>
						<TR><TD width=60%><b>Additional NetPay Transaction Fees</b> - Additional admin transaction fee for NetPay. Default: "0.5" ($0.50)</TD>
							<TD><input type=text size=10 name=dep_np_fee value="<?=htmlspecialchars($dep_np_fee)?>"></TD></TR>
					</TABLE>
				</td>
			</table>
			<BR>
			<!------///////////////--->
			<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
			Qchex<input type=hidden name=separator33 value="QCHEX">
			</b></div>
			<!------///////////////--->
			<TABLE width=100% cellspacing=0>
			<tr>
				<td style="padding-left:10px;">&nbsp;</td>
				<TD>
					<TABLE class=design width=90% cellspacing=0>
						<TR><TD width=60%><b>Qchex Option</b> - Use Qchex for check handling.</b></TD>
							<td><input type=checkbox class=checkbox name=qchex_use value=1 <? if ($qchex_use) echo 'checked'; ?>></TD></TR>
						<TR><TD width=60%><b>Qchex Merchant ID</b> - This ID will be used for Qchex transactions.</TD>
							<td><input type=text size=40 name=qchex_sid value="<?=htmlspecialchars($qchex_sid)?>"></TD></TR>
						<TR><TD width=60%><b>Qchex Transation Fees</b> - Percentage to charge individuals using Qchex. Default: "5.5"</TD>
							<TD><input type=text size=10 name=dep_qc_percent value="<?=htmlspecialchars($dep_qc_percent)?>"></TD></TR>
						<TR><TD width=60%><b>Additional Qchex Transaction Fees</b> - Additional admin transaction fee for Qchex. Default: "0.5" ($0.50)</TD>
							<TD><input type=text size=10 name=dep_qc_fee value="<?=htmlspecialchars($dep_qc_fee)?>"></TD></TR>
					</TABLE>
				</td>
			</table>
			<BR>
			<!------///////////////--->
			<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
			Checks<input type=hidden name=separator14 value="CHECK">
			</b></div>
			<!------///////////////--->
			<TABLE width=100% cellspacing=0>
			<tr>
				<td style="padding-left:10px;">&nbsp;</td>
				<TD>
					<TABLE class=design width=90% cellspacing=0>
						<TR><TD width=60%><b>Check Option</b> - Use check processing. <br><FONT COLOR="#008000"><b>We recommend: Enable</b></FONT></TD>
							<td><input type=checkbox class=checkbox name=check_use value=1 <? if ($check_use) echo 'checked'; ?>></TD></TR>
						<TR><TD width=60%><b>Check Deposit Info</b> - Mailing address for check deposits. Place each value on a new row in the following order: Company, Address, City/State/Country, Postcode</TD>
							<TD><textarea name=dep_check cols=40 rows=4><?=htmlspecialchars($dep_check)?></textarea></TD></TR>
						<TR><TD width=60%><b>Deposit by Cheque or Bank Draft</b> - Additional admin transaction fee for indviduals using checks. Default: "1.0" ($1.00)</TD>
							<TD><input type=text size=10 name=dep_check_fee value="<?=htmlspecialchars($dep_check_fee)?>"></TD></TR>
						<TR><TD width=60%><b>Withdrawal Fee Check</b> - Amount to charge for withdrawals via checks. Default: "1.0"</TD>
							<TD><input type=text size=10 name=wdr_check_fee value="<?=htmlspecialchars($wdr_check_fee)?>"></TD></TR></TD></TR>
					</TABLE>
				</td>
			</table>
		</td>
	</table>
	<br>
</TD></TR>
</TABLE>
<br>
<TABLE class=design width=100% cellspacing=0>
<TR><th colspan=2 class=submit><input type=submit name=change2 value="Update variables">
</TABLE>
</TD>