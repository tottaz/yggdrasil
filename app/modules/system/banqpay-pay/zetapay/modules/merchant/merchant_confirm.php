<?
	chdir('..');
	require('core/include/common.php');
	$proceed = 0;
    $zetadb->Execute("DELETE FROM zetapay_merchant_signups WHERE NOW()>expire");
	if($_POST['id'])$_GET['id'] = $_POST['id'];
    $rs = $zetadb->Execute("SELECT * FROM zetapay_merchant_signups WHERE id='".addslashes($_GET['id'])."'");
    $r = $rs->FetchNextObject();
	if (!$r){
		ob_start();
		header("Location: ../../index.php");
		exit;
	}
	$pincode = $_POST['pincode'];
	if($pincode){
        if($r->PIN != $pincode){
			$_POST['proceed'] = "";
			errform("Invalid PinCode");
		}else{
			$proceed = 1;
		}
	}

    $rs = $zetadb->Execute("SELECT merchant_id FROM zetapay_merchant_users WHERE email='$r->EMAIL'");
    $a = $rs->FetchNextObject();
	if ($a){
		$user = $a->MERCHANT_ID;
		$zetadb->Execute("UPDATE zetapay_merchant_users SET email='$r->EMAIL' WHERE merchant_id=$user");
		$zetadb->Execute("DELETE FROM zetapay_merchant_signups WHERE email='$r->EMAIL'");
		if (!$allow_same_email){
			$zetadb->Execute("DELETE FROM zetapay_merchant_signups WHERE email='$r->EMAIL'");
		}
		($userip = $_SERVER['HTTP_X_FORWARDED_FOR']) or ($userip = $_SERVER['REMOTE_ADDR']);
		$merchant_suid = substr( md5($userip.time()), 8, 16 );
		$zetadb->Execute("UPDATE zetapay_merchant_users SET lastlogin=NOW(),lastip='$userip',suid='$merchant_suid' WHERE id=$user");

		$zetadb->Execute("DELETE FROM zetapay_visitors WHERE ip='$userip'");
		setcookie("c_merchant", "$r->EMAIL");
		$merchant_data->EMAIL = $r->EMAIL;
		ob_start();
		header("Location: ../../../index.php?a=merchant_edit&merchant_suid=$merchant_suid");
		exit;
	}


	if(!$proceed){
		if ( !@file_exists('header.htm') ){
			include('header.php');
		}else{
			include('header.htm');
		}
?>
<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
<tr>
    <td width="20"></td>
    <td width="510" valign="top">
		<BR>
		<CENTER>
		<p>
			Hello, <?=$r->EMAIL?><br>
		</p>
		<TABLE class=design cellspacing=0 width=75%>
		<FORM method=post>
		<input type="hidden" name="id" value="<?=$_GET['id']?>">
		<TR><TH colspan=2>New Merchant Registration</TH></TR>
		<TR>
			<TD>Enter Your Pin that we e-mailed you:</TD>
			<TD>
				<INPUT type=text name=pincode size=16 maxLength=16>
			</TD>
		</TR>
		<TR>
			<TH colspan=2 class=submit>
				<INPUT type="submit" name=merchant_proceed class=button value='Sign up >>'>
			</TH>
		</TR>
		</FORM>
		</TABLE>
		<BR>
		</CENTER>
	</td>
</tr>
</table>
<?
		if ( !@file_exists('footer.htm') ){
			include('footer.php');
		}else{
			include('footer.htm');
		}
	}else{
        $rs = $zetadb->Execute("SELECT merchant_id FROM zetapay_merchant_users WHERE email='$r->EMAIL'");
        $a = $rs->FetchNextObject();
		if (!$a){
            $rs = $zetadb->Execute("SELECT merchant_id FROM zetapay_merchant_users WHERE merchant_id='$r->referredby'");
            $a = $rs->FetchNextObject();
			$referer = ($a->MERCHANT_ID ? $a->MERCHANT_ID : "NULL");
			$sql = "INSERT INTO zetapay_merchant_users SET username='$r->EMAIL', email='$r->EMAIL',password='$r->PASSWORD',pin='$r->PIN',referredby='$referer',signed_on=NOW()";
			$zetadb->Execute($sql);
            $user = $zetadb->Insert_ID();
			if ($signup_bonus && $signup_bonus != 0){
				merchant_transact(1,$user,$signup_bonus,"Account signup bonus");
			}
			$rs = $zetadb->Execute("SELECT * FROM zetapay_merchant_hold WHERE paidto='{$r->email}'");
			while ($a = $rs->FetchNextObject()){
				$afrom = dpmerchantObj($a->PAIDBY);
				$from = $afrom->NAME." ( ".$afrom->EMAIL." )";
				$amount = $a->AMOUNT;
				if($transfer_percent || $transfer_fee){
					$fee = myround($amount * $transfer_percent / 100, 2) + $transfer_fee;
					$amount = $amount - $fee;
				}
				transact(98,$user,$amount,"Money Transfer From $from",'',$fee);
			}
/*
			if ($r->referredby){
				$ref = myround($signup_bonus * $referral_payout / 100, 2);
				if ($ref){
					transact(1,$r->referredby,$ref,"Referral for $r->user",$pid);
				}
			}
*/
		}else{
			$user = $a[0];
			$zetadb->Execute("UPDATE zetapay_merchant_users SET email='$r->EMAIL' WHERE merchant_id=$user");
		}
		($userip = $_SERVER['HTTP_X_FORWARDED_FOR']) or ($userip = $_SERVER['REMOTE_ADDR']);
		$merchant_suid = substr( md5($userip.time()), 8, 16 );
		$zetadb->Execute("UPDATE zetapay_merchant_users SET lastlogin=NOW(),lastip='$userip',suid='$merchant_suid' WHERE merchant_id=$user");
		setcookie("c_merchant", "$r->EMAIL");
        $rs = $zetadb->Execute("SELECT * FROM zetapay_merchant_signups WHERE id='".addslashes($_GET['id'])."'");
        $r = $rs->FetchNextObject();
		$merchant_data->EMAIL = $r->EMAIL;
		wrapmail($adminemail, "$sitename New User", gettemplate("email_new_user", "$siteurl/index.php?a=uview&user=$EMAIL", $r->EMAIL,$r->NAME), $defaultmail);
		$zetadb->Execute("DELETE FROM zetapay_merchant_signups WHERE email='$r->EMAIL'");
		if (!$allow_same_email){
			$zetadb->Execute("DELETE FROM zetapay_merchant_signups WHERE email='$r->EMAIL'");
		}
		$zetadb->Execute("DELETE FROM zetapay_visitors WHERE ip='$userip'");
		ob_start();
		header("Location: ../../../index.php?a=merchant_edit&merchant_suid=$merchant_suid");
	}
?>