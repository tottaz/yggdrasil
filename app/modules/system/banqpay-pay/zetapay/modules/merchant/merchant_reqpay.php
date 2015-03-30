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
						<span class="text4">Request Money</span><br>
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

		// Check funds
		if ($_POST['amount'] < 0)
			errform('Please enter a valid amount', 'amount');
		if ($_POST['amount'] >= $minimal_transfer){
			// asdfasdfsdaafd
		}else{
			errform('Sorry, but the minimum amount you can transfer is '.$currency.$minimal_transfer,'amount');
		}
		// Check username
		$r = mysql_fetch_row(mysql_query(
			"SELECT id FROM zetapay_users WHERE (username='".addslashes($_POST['username'])."' OR email='".addslashes($_POST['username'])."')"
		));
		if (!$r){
//			errform("There are no users with the specified username", 'username');
		}
	}

	if ($_POST['transfer'] && !$posterr){
		$amount = $_POST['amount'];
		$afrom = dpObj($user);
		$from = $afrom->email;
		$_POST['username'] = str_replace("\r\n",",",$_POST['username']);
		$users = explode(",",$_POST['username']);
		while( list(,$duser) = each($users) ){
			if($_POST['memo']){
				$comments = $_POST['memo'];  
			}else{
				$comments = "Request For Money from ".$afrom->user;
			}
			echo "Sending Request to: $duser<br>";			
			// send mail to user
			$r = mysql_fetch_row(mysql_query(
				"SELECT id FROM zetapay_users WHERE (username='".addslashes($duser)."' OR email='".addslashes($duser)."')"
			));
			if (!$r){
				// unknown user
				$info = $from."@@".$amount;
				wrapmail($duser, "Request For Money From $sitename", 
					$emailtop.
					gettemplate("reqpay_unknown", "$siteurl?a=signup&semail=".$duser,$info).
					$emailbottom, 
					$defaultmail
				);
			}else{
				// known user
				$info = $from."@@".$amount;
				wrapmail($duser, "Request For Money From $sitename", 
					$emailtop.
					gettemplate("reqpay_email", "$siteurl/",$info).
					$emailbottom, 
					$defaultmail
				); 
			}
		}
		echo "Request has been sent<br>";
//		$action = 'account';
//		header("Location:?a=account");
	}else{
?>
		<CENTER>
		<P><FONT COLOR="#FF0000" FACE="Verdana,Tahoma,Arial,Helvetica,Sans-serif,sans-serif"><B>
 		Bill customers, individuals or groups by email, even if they don't have a <?=$sitename?> 
 		account! The recipient will receive an email with instructions on how to pay you using 
 		<?=$sitename?>. 
		</B></FONT></p>
		<TABLE class=design cellspacing=0 width=100%>
		<form method=post>
		<TR>
			<TH colspan=2>Request Money from Another Account</TH>
		</TR>
		<TR>
			<TD>Recipient's Email:<br></TD>
<?	if($use_mass){	?>
			<TD><textarea name="username" cols="30" rows="6"><?=$_POST['username']?></textarea></TD>
<?	}else{	?>
			<TD><INPUT type=text name=username size=16 maxLength=40 value="<?=$_POST['username']?>"></TD>
<?	}	?>
		<TR>
			<TD>Amount:</TD>
			<TD><?=$currency?> <INPUT type=text name=amount size=5 maxLength=5 value="<?=$_POST['amount']?>"></TD></TR>
<?	if($use_pin){	?>
		<TR><TD>Your pincode:</TD>
			<TD><INPUT type=password name=pincode size=6 maxLength=6></TD></TR>
<?	}	?>
		<TR><TD>Notes: (optional)</TD>
			<TD><textarea name="memo" cols="30" rows="6"><?=$_POST['SUGGESTED_MEMO']?></textarea></TD></TR>
		<TR>
			<TH class=submit colspan=2><input type=submit name=transfer value='Request >>'></TH>
		</TR>
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