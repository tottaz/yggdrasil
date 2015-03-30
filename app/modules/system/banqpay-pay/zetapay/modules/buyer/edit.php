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
					<span class="text4">Edit Your Information</span><br>
					<hr width="100%" size="1"><br>
				</td>
			</tr>
			<tr>
				<td bgcolor="#FFFFFF">
<?
	if ($_POST['edit']){
		$posterr = 0;
		if($data->PASSWORD){
			$old = $_POST['old_password'];
            $encryptedpassword=md5($old); //encrypt the password
			if($data->PASSWORD != $encryptedpassword){
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
			$_POST['new_password'] = $data->PASSWORD;
		}
		if (!preg_match("/^[\\w\\-]{1,16}$/i", $_POST['new_password'])){
			errform('The password should consist of letters and digits only.'); // #err
			$_POST['new_password'] = $data->PASSWORD;
		}

		// Check email
		if (!email_check($_POST['email']) ){
			errform('You have entered an invalid email address.'); // #err
			$_POST['email'] = $data->EMAIL;
		}
		// Check name
		if ($_POST['firstname']  == '' ){
			errform('You have entered an invalid First Name.'); // #err
			$_POST['firstname'] = $data->FIRSTNAME;
		}
		if ($_POST['lastname']  == '' ){
			errform('You have entered an invalid Last Name.'); // #err
			$_POST['lastname'] = $data->LASTNAME;
		}
		// Check address
		if ($_POST['address']  == '' ){
			errform('You have entered an invalid address.'); // #err
			$_POST['address'] = $data->ADDRESS;
		}
		// Check city
		if ($_POST['city']  == '' ){
			errform('You have entered an invalid city.'); // #err
			$_POST['city'] = $data->CITY;
		}
		// Check zipcode
		if ($_POST['zipcode']  == '' ){
			errform('You have entered an invalid zipcode.'); // #err
			$_POST['zipcode'] = $data->ZIPCODE;
		}
		// Check country
		if ($_POST['country']  == '' ){
			errform('You have entered an invalid country.'); // #err
			$_POST['country'] = $data->COUNTRY;
		}
		// Check state
		if ($_POST['state']  == '' ){
			errform('You have entered an invalid state.'); // #err
			$_POST['state'] = $data->STATE;
		}
		// Check phone
		if ($_POST['phone']  == '' ){
			errform('You have entered an invalid phone.'); // #err
			$_POST['phone'] = $data->PHONE1;
		}
	}else{
		// Fill with current data
//		$_POST['password'] = $data->password;
		$_POST['email'] = $data->EMAIL;
		$_POST['firstname'] = $data->FIRSTNAME;
		$_POST['lastname'] = $data->LASTNAME;
		$_POST['regnum'] = $data->REGNUM;
		$_POST['notify'] = $data->NOTIFY;
		$_POST['address'] = $data->ADDRESS;
		$_POST['city'] = $data->CITY;
		$_POST['zipcode'] = $data->ZIPCODE;
		$_POST['country'] = $data->COUNTRY;
		$_POST['state'] = $data->STATE;
		$_POST['phone'] = $data->PHONE1;
		$_POST['fax'] = $data->FAX;
	}

	if ($_POST['edit'] && !$posterr){
		$_POST['notify'] = ($_POST['notify'] ? 1 : 0);
		$_POST['password'] = $_POST['new_password'];
		if(!$_POST['password']){
			$_POST['password'] = $data->PASSWORD;
		}
		// Update database
        $encryptedpassword=md5($_POST['password']); //encrypt the password
		$query = "UPDATE ".TBL_SYSTEM_USERS." SET email='".addslashes($_POST['email'])."', firstname='".addslashes($_POST['firstname'])."', lastname='".addslashes($_POST['lastname'])."', regnum='".addslashes($_POST['regnum'])."',password='$encryptedpassword',notify={$_POST['notify']},address='".addslashes($_POST['address'])."',country='".addslashes($_POST['country'])."',state='".addslashes($_POST['state'])."',city='".addslashes($_POST['city'])."',phone1='".addslashes($_POST['phone'])."',fax='".addslashes($_POST['fax'])."',zipcode='".addslashes($_POST['zipcode'])."' WHERE id=$user";
		$zetadb->Execute($query) or die( $zetadb->Error() );

		if ($_POST['email'] != $data->EMAIL){
			$uid = substr( md5(time()), 8, 16 );
			$zetadb->Execute("INSERT INTO ".TBL_SYSTEM_SIGNUPS." SET
							id='$uid',
							email='{$_POST['email']}',
							expire=DATE_ADD(NOW(),INTERVAL 3 DAY)") or die( $zetadb->Error() );
			mail($_POST['email'], "Confirm E-mail for $sitename",
			$emailtop.gettemplate("email_edit", "$siteurl/zetapay/admin/confirmmail.php?id=$uid").$emailbottom,
			$defaultmail);
			prpage("html_edit");
		}else{
			// Go to account
			$action = 'account';
            $rs = $zetadb->Execute("SELECT * FROM ".TBL_SYSTEM_USERS." WHERE id=$user");
			$data = $rs->FetchNextObject();
			include('account_statement.php');
		}
	}else{
?>
<CENTER>
<TABLE class=design cellspacing=0 width=100%>
<TR>
	<TD>
		<img src="zetapay/images/lock.gif">
		All the information that you input here is securely stored and will not be abused in any way.
	</TD>
</tr>
</table>
<br><br>
<TABLE class=design cellspacing=0 width=100%>
	<FORM method=post enctype='multipart/form-data' name="form1">
<TR><TD>Current Password:</TD>
	<TD><INPUT type=password name=old_password size=16 maxLength=16 value=""></TD></TR>
<TR><TD>New Password:</TD>
	<TD><INPUT type=password name=new_password size=16 maxLength=16 value="<?=$_POST['new_password']?>"></TD></TR>
<TR><TD>Re-Type Password:</TD>
	<TD><INPUT type=password name=new_password2 size=16 maxLength=16 value="<?=$_POST['new_password2']?>"></TD></TR>
<TR><TD>Email address:<BR>
      <DIV class=tiny>(<a href=index.php?read=privacy.htm&<?=$id?>>Privacy Policy</a>)</DIV></TD>
	<TD><INPUT type=text name=email size=30 value="<?=$_POST['email']?>"></TD></TR>
    
<TR><TD>First Name:<BR>
      <TD><INPUT type=text name=firstname size=40 maxLength=40 value="<?=htmlspecialchars($_POST['firstname'])?>"></TD></TR>
<TR><TD>Last Name:<BR>
	<TD><INPUT type=text name=lastname size=40 maxLength=40 value="<?=htmlspecialchars($_POST['lastname'])?>"></TD></TR>
    <TR><TD>Address:<BR></TD>
	<TD><input type=text name=address size=40 maxLength=40 value="<?=htmlspecialchars($_POST['address'])?>"></TD></TR>
<TR><TD>City:<BR></TD>
	<TD><input type=text name=city size=40 maxLength=40 value="<?=htmlspecialchars($_POST['city'])?>"></TD></TR>
<TR><TD>State/Province:<BR></TD>
	<TD><input type=text name=state size=40 maxLength=40 value="<?=htmlspecialchars($_POST['zipcode'])?>"></TD></TR>
    <TR><TD>Country:<BR></TD>
   <td><SELECT name=country style='width:220px;' size=1>
<!-- country list -->
<OPTION value='00'>Select your country</OPTION>
<?
    $rs = $zetadb->Execute("SELECT * FROM ".TBL_SYSTEM_COUNTRIES."");
    while($a = $rs->FetchNextObject()) {
	if ($a->COUNTRIES_NAME == ($_POST['country'])) {
	    $sel = "selected";
	} else {
        $sel = "";
	}                        
        echo "<OPTION value=$a->COUNTRIES_NAME $sel>$a->COUNTRIES_NAME</OPTION>";
    }
?>
<!-- country list -->
   </SELECT>
    </td></tr>
    
<TR><TD>Postal Code:<BR></TD>
	<TD><input type=text name=zipcode size=40 maxLength=40 value="<?=htmlspecialchars($_POST['zipcode'])?>"></TD></TR>
<TR><TD>Phone:<BR></TD>
	<TD><input type=text name=phone size=40 maxLength=40 value="<?=htmlspecialchars($_POST['phone'])?>"></TD></TR>
<TR><TD>Fax:<BR></TD>
	<TD><input type=text name=fax size=40 maxLength=40 value="<?=htmlspecialchars($_POST['fax'])?>"></TD></TR>
<TR><TH colspan=2 class=submit><INPUT type=submit class=button name=edit value='Change info >>'></TH></TR>
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