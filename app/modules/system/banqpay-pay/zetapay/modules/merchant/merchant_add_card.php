<?
// Get balance and last transaction
$balance = balance($user, 1);
$rs = $zetadb->Execute("SELECT paidto,amount,comment,trdate FROM zetapay_buyer_transactions WHERE (paidto=$user OR paidby=$user) AND pending=0 ORDER BY trdate DESC LIMIT 1");
$r = $rs->FetchNextObject();
if ($r && $r->PAIDTO != $user) $r->AMOUNT = -$r->AMOUNT;
$show = 1;
if( ($charge_signup) ){
	$show = 0;
	if( ($data->fee) ){
		$show = 1;
	}
}
?>
<table width="100%" border="0" align="center" bgcolor="#FFFFFF">
<tr>
	<td bgcolor="#FFFFFF">
		<table width="100%" border="0" align="center" cellpadding="3" cellspacing="3" bgcolor="#FFFFFF">
		<tr>
			<td width=20> </td>
			<td width="519" valign="top">
				<table width="100%" border="0" cellspacing="0" cellpadding="3" bgcolor="#FFFFFF">
				<tr>
					<td>
						<span class="text4">Verify My Account</span><br>
						<hr width="100%" size="1"><br>
					</td>
				</tr>
				<tr>
					<td> </td>
				</tr>
				<tr>
					<td bgcolor="#FFFFFF">
<?
    $rs = $zetadb->Execute("SELECT COUNT(*) FROM zetapay_buyer_verify WHERE user='$user'");
    $r1 = $rs->FetchRow();
	if ($r1[0] > 0){
        $rs = $zetadb->Execute("SELECT admin_verified FROM zetapay_buyer_verify WHERE user='$user'");
        $r2 = $rs->FetchRow();
		$admin_verify = $r2->admin_verfied;
		if ($admin_verify == 0){
			echo ("<br><br><br><center><b>Your Card Details Submitted For admin's Approval. </b><br><br><br>");
		}else{
			if( $_POST['amount'] ){
				$amount = $_POST['amount'];
                $rs = $zetadb->Execute("SELECT COUNT(*) FROM zetapay_buyer_verify WHERE user='$user' and check_amount='$amount'");
                $r1 = $rs->FetchRow();
				$res = $r1[0];
				if ($res > 0){
					$q = "UPDATE zetapay_verify SET verified=1 WHERE user='$user'";
					$zetadb->Execute($q);
					echo ("<br><br><br><center>Congrats! You Have Become $sitename's Verified Member! </center><br><br><br>");
				}else{
					echo ("<br><br><br><br><b>Your amount does not match with the admins approval.</b><br><br>");
				}
			}else{
				include("g_buyer_verify_card.php");
			}
		}
	}else{
		if($_POST['agreement'] == "YES"){
			while(list($key,$value) = each($_POST)){
				$$key = $value;
			}
			$expiry = $month."/".$year;
			$q  = "INSERT INTO zetapay_verify set ";
			$q .= "name='$name', chk_number='$chk_number',bank_name='$bank_name', bank_address='$bank_address', ";
			$q .= "bank_city='$bank_city',bank_phone_ext='$bank_phone_ext',bank_phone_number='$bank_phone_number',";
			$q .= "aba_number='$aba_number',account_number='$account_number',routing_number='$routing_number',";
			$q .= "verified=0,user='$user',admin_verified=0,acc_address='$acc_address',acc_phone='$acc_phone'";
			$zetadb->Execute($q);
			echo ("<li>Your Details Submitted To $sitename's Verification.<br>");
			echo ("<li>Your account information  will be validated by a small amount($1.00 - $3.00)");
			echo ("<li>After you receive the bank statements you need to come again to Verify account section and enter the amount taken from your account.  ");
			echo ("<li>Once you enter the amount correctly, then you become the $sitename's Verified Member");
			echo ("<br><br><br>");
		}else{
			include("g_buyer_add_card.php");
		}
	}
?>
					</td>
				</tr>
				</table>
			</td>
	</tr>
	</table>
		</td>
</tr>
</table>