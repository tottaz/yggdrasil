<?
	if ($_POST['merchant_edit']){
		$posterr = 0;
		if($merchant_data->PASSWORD){
			$old = $_POST['old_password'];
			if($merchant_data->PASSWORD != $old){
				errform('You have entered an invalid password. Please enter your current password in order to update your profile<br>'); // #err
			}
		}
		$newpass = $_POST['new_password'];
		$newpass2 = $_POST['new_password2'];
		if( $newpass != $newpass2 ){
			errform('the new password must match what you re-type'); // #err
		}

		// Check password
		if (strlen($_POST['new_password']) < 1){
			errform('Please enter a password.'); // #err
			$_POST['new_password'] = $merchant_data->PASSWORD;
		}
		if (!preg_match("/^[\\w\\-]{1,16}$/i", $_POST['new_password'])){
			errform('The password should consist of letters and digits only.'); // #err
			$_POST['new_password'] = $merchant_data->PASSWORD;
		}

	}else{
		// Fill with current data
		$_POST['password'] = $data->PASSWORD;
	}

	if ($_POST['merchant_edit'] && !$posterr){
		$_POST['notify'] = ($_POST['notify'] ? 1 : 0);
		$_POST['password'] = $_POST['new_password'];
		if(!$_POST['password']){
			$_POST['password'] = $merchant_data->PASSWORD;
		}
		// Update database
		    $query = "UPDATE zetapay_merchant_users SET password='{$_POST['password']}' WHERE merchant_id=$user";
		    $zetadb->Execute($query);
		// Go to account
		    $action = 'merchant_account';
            $rs = $zetadb->Execute("SELECT * FROM zetapay_merchant_users WHERE merchant_id=$user");
            $merchant_data = $rs->FetchNextObject();
			include('merchant/a_merchant_account.php');
		}
	else{
?>
<CENTER>
<TABLE class=design cellspacing=0 width=100%>

	<FORM method=post enctype='multipart/form-data' name="form1">
<TR><TD>Current Password:</TD>
	<TD><INPUT type=password name=old_password size=16 maxLength=16 value=""></TD></TR>
<TR><TD>New Password:</TD>
	<TD><INPUT type=password name=new_password size=16 maxLength=16 value="<?=$_POST['new_password']?>"></TD></TR>
<TR><TD>Re-Type Password:</TD>
	<TD><INPUT type=password name=new_password2 size=16 maxLength=16 value="<?=$_POST['new_password2']?>"></TD></TR>
</FORM>
</TABLE>
</CENTER>
<?
	}
?>