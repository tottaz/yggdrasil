<?
	chdir('..');
	require('src/common.php');
	$proceed = 0;
	mysql_query("DELETE FROM zetapay_signups WHERE NOW()>expire");
	if($_POST['id'])$_GET['id'] = $_POST['id'];
#echo "---[p> ".$_POST['id']."<br>";
#echo "---[g> ".$_GET['id']."<Br>";
	$r = mysql_fetch_object(mysql_query("SELECT * FROM zetapay_signups WHERE id='".addslashes($_GET['id'])."'"));
	if (!$r){
		ob_start();
		header("Location: ../../index.php");
		exit;
	}
	$pincode = $_POST['pincode'];
	if($pincode){
		if($r->pin != $pincode){
			$_POST['proceed'] = "";
			errform("Invalid PinCode");
		}else{
			$proceed = 1;
		}
	}

	$a = mysql_fetch_row(mysql_query("SELECT id,type FROM zetapay_users WHERE username='$r->user'"));
	if ($a){
		$user = $a[0];
		mysql_query("UPDATE zetapay_users SET email='$r->email' WHERE id=$user");
		$r->type = $a[1];
		mysql_query("DELETE FROM zetapay_signups WHERE user='$r->user'");
		if (!$allow_same_email){
			mysql_query("DELETE FROM zetapay_signups WHERE email='$r->email'");
		}
		($userip = $_SERVER['HTTP_X_FORWARDED_FOR']) or ($userip = $_SERVER['REMOTE_ADDR']);
		$suid = substr( md5($userip.time()), 8, 16 );
		mysql_query("UPDATE zetapay_users SET lastlogin=NOW(),lastip='$userip',suid='$suid' WHERE id=$user");

		mysql_query("DELETE FROM zetapay_visitors WHERE ip='$userip'");
		setcookie("c_user".$r->type, "$r->user");
		$data->username = $r->user;
		ob_start();
		header("Location: ../../index.php?a=edit&suid=$suid");
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
<tr bgcolor="#FFFFFF">
    <td width="20"></td>
    <td width="510" valign="top">
		<BR>
		<CENTER>
		<p>
			Hello, <?=$r->user?><br>
		</p>
		<TABLE class=design cellspacing=0 width=75%>
		<FORM method=post>
		<input type="hidden" name="id" value="<?=$_GET['id']?>">
		<TR><TH colspan=2>New Users Registration</TH></TR>
		<TR>
			<TD>Enter Your Pin that we e-mailed you:</TD>
			<TD>
				<INPUT type=text name=pincode size=16 maxLength=16>
			</TD>
		</TR>
		<TR>
			<TH colspan=2 class=submit>
				<INPUT type="submit" name=proceed class=button value='Sign up >>'>
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
		$a = mysql_fetch_row(mysql_query("SELECT id,type FROM zetapay_users WHERE username='$r->user'"));
		if (!$a){
			$a = mysql_fetch_row(mysql_query("SELECT id FROM zetapay_users WHERE id=$r->referredby"));
			$referer = ($a[0] ? $a[0] : "NULL");
			$sql = "INSERT INTO zetapay_users SET username='$r->user',type='$r->type',email='$r->email',password='$r->password',pin='$r->pin',referredby='$referer',signed_on=NOW()";
			mysql_query($sql) or die( mysql_error()."<br>$sql<br>" );
			$user = mysql_insert_id();
			if ($signup_bonus && $signup_bonus != 0){
				transact(1,$user,$signup_bonus,"Account signup bonus");
			}
			$r = mysql_query("SELECT * FROM zetapay_hold WHERE paidto='{$r->email}'");
			while ($a = mysql_fetch_object($r)){
				$afrom = dpuserObj($a->paidby);
				$from = $afrom->name." ( ".$afrom->email." )";
				$amount = $a->amount;
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
			mysql_query("UPDATE zetapay_users SET email='$r->email' WHERE id=$user");
		}
		($userip = $_SERVER['HTTP_X_FORWARDED_FOR']) or ($userip = $_SERVER['REMOTE_ADDR']);
		$suid = substr( md5($userip.time()), 8, 16 );
		mysql_query("UPDATE zetapay_users SET lastlogin=NOW(),lastip='$userip',suid='$suid' WHERE id=$user");
		setcookie("c_user", "$r->user");
		$r = mysql_fetch_object(mysql_query("SELECT * FROM zetapay_signups WHERE id='".addslashes($_GET['id'])."'"));
		$data->username = $r->user;
//echo "---> ".$r-email."<br>";
//echo "---> ".$r-user."<br>";
		wrapmail($adminemail, "$sitename New User",
			gettemplate("email_new_user", "$siteurl/index.php?a=uview&user=$user", $r->email,$r->user), 
			$defaultmail);
		mysql_query("DELETE FROM zetapay_signups WHERE user='$r->user'");
		if (!$allow_same_email){
			mysql_query("DELETE FROM zetapay_signups WHERE email='$r->email'");
		}
		mysql_query("DELETE FROM zetapay_visitors WHERE ip='$userip'");
		ob_start();
		header("Location: ../../index.php?a=edit&suid=$suid");
	}
?>