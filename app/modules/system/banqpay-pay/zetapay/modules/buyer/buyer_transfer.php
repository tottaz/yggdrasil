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
						<span class="text4">Send Money</span><br>
						<hr width="100%" size="1"><br>
					</td>
				</tr>
				<tr>
					<td>
<?
	$balance = balance($user);
	if ($_POST['transfer']){
		$posterr = 0;
		$_POST['amount'] = myround($_POST['amount']);
		if($use_pin){
			if (strlen($_POST['pincode']) < 1){
				errform('Please enter your pincode.'); // #err
			}
			if($data->pin != $_POST['pincode']){
				errform('Please enter a valid pincode.'); // #err
			}
		}
		$_POST['dusername'] = str_replace("\r\n",",",$_POST['username']);
		$users = explode(",",$_POST['dusername']);
		$uCnt = sizeof($users);
#		while( list(,$duser) = each($users) ){
#		}
		$_POST['amountChk'] = $_POST['amount'] * $uCnt;
		// Check funds
		if ($balance < $_POST['amountChk']){
			errform('You do not have enough money in your account -- $'.$balance.' -- Amount Needed: $'.$_POST['amountChk'], 'amount');
		}
		if ($_POST['amount'] < 0)
			errform('Please enter a valid amount', 'amount');
		if ($_POST['amount'] >= $minimal_transfer){
			// asdfasdfsdaafd
		}else{
			errform('Sorry, but the minimum amount you can transfer is '.$currency.$minimal_transfer,'amount');
		}

		$_POST['dusername'] = str_replace("\r\n",",",$_POST['username']);
		$users = explode(",",$_POST['dusername']);
		$uCnt = sizeof($users);
		while( list(,$duser) = each($users) ){
			// Check username
            $rs = $zetadb->Execute("SELECT buyer_id FROM zetapay_buyers_users WHERE (email='".addslashes($duser)."')");
            $r = rs->FetchNextObject();
			if($r->BUYER_ID == $user){
				errform("You cannot send money to yourself", 'username');
			}
			$afrom = dpuserObj($user);
			$from = $afrom->email;
			$username = $afrom->username;
			if($username == $duser || $from == $duser){
				errform("You cannot send money to yourself", 'username');
			}
		}
	}

	if ($_POST['transfer'] && !$posterr){
		$amount = $_POST['amount'];
		$afrom = dpuserObj($user);
		$from = $afrom->email;
		if($transfer_percent || $transfer_fee){
			$fee = myround($amount * $transfer_percent / 100, 2) + $transfer_fee;
			$amount = $amount - $fee;
		}
		$_POST['dusername'] = str_replace("\r\n",",",$_POST['username']);
		$users = explode(",",$_POST['dusername']);
		$uCnt = sizeof($users);
		while( list(,$duser) = each($users) ){
#			$comments = $_POST['memo'];
			$comments = "Money Transfer To ".$duser;
            $rs = $zetadb->Execute("SELECT buyer_id, email, suspended FROM zetapay_buyers_users WHERE (email='".addslashes($duser)."')");
            $r = rs->FetchNextObject();
			if (!$r){
				// unknown user
#				transact($user,98,$amount,"Transfer to {$duser}",'',$fee);
#				transact($user,98,$amount,"Transfer to {$duser}",'',$fee,'',$_POST['memo']);
				transact($user,98,$amount,$comments,'',$fee,0,$_POST['memo']);

				$zetadb->Execute("INSERT INTO zetapay_hold(paidby,paidto,amount) VALUES($user,'{$duser}',$amount)");
				$info = $from."@@".$amount;
				wrapmail($duser, "Money Transfer From $sitename",
					$emailtop.
					gettemplate("transfer_unknown", "$siteurl?a=signup&semail=".$duser,$info).
					$emailbottom,
					$defaultmail
				);
			}else{
				// known user
				if($r[2]){
					errform("You cannot send money to a suspended user --- $duser", 'username');
				}else{
					transact($user,$r[0],$amount,$comments,'',$fee,0,$_POST['memo']);
					$info = $from."@@".$amount;
					wrapmail($r[1], "Money Transfer From $sitename",
						$emailtop.
						gettemplate("transfer_email", "$siteurl",$info).
						$emailbottom,
						$defaultmail
					);
				}
			}
		}
		$action = 'account';
		header("Location:?a=account");
	}else{
?>
		<CENTER>
		<P><FONT COLOR="#FF0000" FACE="Verdana,Tahoma,Arial,Helvetica,Sans-serif,sans-serif"><B>
		You must add funds to your account before you can send payments. If you have already added funds to your account then proceed by clicking on one of the links below. 
		</B></FONT></p>
		<TABLE class=design cellspacing=0>
		<form method=post>
		<TR><TH colspan=2>Send Money to Another Account</TH></TR>
		<TR><TD>Send Money To:</TD>
<?	if($use_mass){	?>
			<TD><textarea name="username" cols="30" rows="6"><?=$_POST['username']?></textarea></TD>
<?	}else{	?>
			<TD><INPUT type=text name=username size=16 maxLength=40 value="<?=$_POST['username']?>"></TD>
<?	}	?>
		<TR><TD>Amount to transfer:</TD>
			<TD><?=$currency?> <INPUT type=text name=amount size=5 maxLength=5 value="<?=$_POST['amount']?>"></TD></TR>
<?	if($use_pin){	?>
		<TR><TD>Your pincode:</TD>
			<TD><INPUT type=password name=pincode size=6 maxLength=6></TD></TR>
<?	}	?>
		<TR><TD>Notes: (optional)</TD>
			<TD><textarea name="memo" cols="30" rows="6"><?=$_POST['SUGGESTED_MEMO']?></textarea></TD></TR>
		<TR><TH class=submit colspan=2><input type=submit name=transfer value='Transfer >>'></TH></TR>
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