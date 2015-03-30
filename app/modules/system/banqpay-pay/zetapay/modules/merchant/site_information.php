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
	if ($_POST['merchant_edit']){
		$posterr = 0;

		// Check email
		if (!email_check($_POST['email']) ){
			errform('You have entered an invalid email address.'); // #err
			$_POST['email'] = $merchant_data->EMAIL;
		}

		// Check name
		if ($_POST['company']  == '' ){
			errform('You have entered an invalid Company Name.'); // #err
			$_POST['company'] = $merchant_data->COMPANY;
		}

		// Check name
		if ($_POST['name']  == '' ){
			errform('You have entered an invalid Name.'); // #err
			$_POST['name'] = $merchant_data->NAME;
		}
		// Check address
		if ($_POST['address']  == '' ){
			errform('You have entered an invalid address.'); // #err
			$_POST['address'] = $merchant_data->ADDRESS;
		}
		// Check city
		if ($_POST['city']  == '' ){
			errform('You have entered an invalid city.'); // #err
			$_POST['city'] = $merchant_data->CITY;
		}
		// Check zipcode
		if ($_POST['zipcode']  == '' ){
			errform('You have entered an invalid zipcode.'); // #err
			$_POST['zipcode'] = $merchant_data->ZIPCODE;
		}
		// Check country
		if ($_POST['country']  == '' ){
			errform('You have entered an invalid country.'); // #err
			$_POST['country'] = $merchant_data->COUNTRY;
		}
		// Check state
		if ($_POST['state']  == '' ){
			errform('You have entered an invalid state.'); // #err
			$_POST['state'] = $merchant_data->STATE;
		}
		// Check phone
		if ($_POST['phone']  == '' ){
			errform('You have entered an invalid phone.'); // #err
			$_POST['phone'] = $merchant_data->PHONE1;
		}
	}else{
		// Fill with current data
		$_POST['company'] = $data->COMPANY;
		$_POST['email'] = $merchant_data->EMAIL;
		$_POST['name'] = $merchant_data->NAME;
		$_POST['regnum'] = $merchant_data->REGNUM;
		$_POST['notify'] = $merchant_data->NOTIFY;
		$_POST['address'] = $merchant_data->ADDRESS;
		$_POST['city'] = $merchant_data->CITY;
		$_POST['zipcode'] = $merchant_data->ZIPCODE;
		$_POST['country'] = $merchant_data->COUNTRY;
		$_POST['state'] = $merchant_data->STATE;
		$_POST['phone'] = $merchant_data->PHONE1;
		$_POST['fax'] = $merchant_data->FAX;
	}

	if ($_POST['merchant_edit'] && !$posterr){
		$_POST['notify'] = ($_POST['notify'] ? 1 : 0);

		// Update database
		$query = "UPDATE zetapay_merchant_users SET email='".addslashes($_POST['email'])."', name='".addslashes($_POST['name'])."', regnum='".addslashes($_POST['regnum'])."',notify={$_POST['notify']},address='".addslashes($_POST['address'])."',country='".addslashes($_POST['country'])."',state='".addslashes($_POST['state'])."',city='".addslashes($_POST['city'])."',phone1='".addslashes($_POST['phone'])."',fax='".addslashes($_POST['fax'])."',zipcode='".addslashes($_POST['zipcode'])."' WHERE merchant_id=$user";
		$zetadb->Execute($query) or die( $zetadb->Error() );

		if ($_POST['email'] != $merchant_data->EMAIL){
			$uid = substr( md5(time()), 8, 16 );
			$zetadb->Execute("INSERT INTO zetapay_merchant_signups SET
							id='$uid',
							email='{$_POST['email']}',
							expire=DATE_ADD(NOW(),INTERVAL 3 DAY)") or die( $zetadb->Error() );
			mail($_POST['email'], "Confirm E-mail for $sitename",
			$emailtop.gettemplate("email_edit", "$siteurl/zetapay/admin/confirmmail.php?id=$uid").$emailbottom, $defaultmail);
			prpage("html_edit");
		}else{
			// Go to account
			$action = 'merchant_account';
            $rs = $zetadb->Execute("SELECT * FROM zetapay_merchant_users WHERE merchant_id=$user");
            $merchant_data = $rs->FetchNextObject();
			include('merchant/a_merchant_account.php');
		}
	}else{
?>
<CENTER>
<TABLE class=design cellspacing=0 width=100%>
<TR>
	<TD>
		<img src="<?=$siteurl?>/zetapay/img/lock.gif">
		All the information that you input here is securely stored and will not be abused in any way.
	</TD>
</tr>
</table>
<br><br>
<TABLE class=design cellspacing=0 width=100%>
	<FORM method=post enctype='multipart/form-data' name="form1">
<TR><TD>Domain:<BR>
	<TD><INPUT type=text name=domain size=50 maxLength=100 value="<?=htmlspecialchars($_POST['domain'])?>"></TD></TR>
<TR><TD>Name:<BR>
	<TD><INPUT type=text name=name size=50 maxLength=100 value="<?=htmlspecialchars($_POST['name'])?>"></TD></TR>
<TR><TD>Logo:<BR>
	<TD><INPUT type=text name=logo size=30 value="<?=$_POST['logo']?>"></TD></TR>
<TR><TD>Description:<BR></TD>
	<TD><input type=text name=description size=40 maxLength=40 value="<?=htmlspecialchars($_POST['description'])?>"></TD></TR>
<TR><TD>Site Availability:<BR></TD>
	<TD><input type=box name=description size=40 maxLength=40 value="<?=htmlspecialchars($_POST['description'])?>"></TD></TR>
    Site is available
    site is temporarily unavailable
    

<TR><TH colspan=2 class=submit><INPUT type=submit class=button name=merchant_edit value='Change info >>'></TH></TR>
  <?=$merchant_id_post?>
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