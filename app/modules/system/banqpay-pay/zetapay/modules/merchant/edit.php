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
<SCRIPT LANGUAGE="JavaScript">
<?
	while (list($key) = @each($country_values)) {
		if ($key == "0"){continue;}
?>
		var <?=$key?>_array  =  new Array(
<?
		$states = $state_values[$key];
		$total = sizeof($states);
		$i = 0;
		while ( list($key, $val) = @each($states) ) {
			$i++;
			echo "\"$key:$val\"";
			if($i < $total) {
				echo ",\n";
			}
		}
		echo ");\n";
	}
?>
function populate(selected) {
	document.form1.elements['state'].selectedIndex = 0;
	var mychoice = "<?=$_POST['state']?>";
	var nochoice = 1;
	if ( eval(selected+"_array") ){
		var selectedArray = eval(selected+"_array");
		while (selectedArray.length < document.form1.elements['state'].options.length) {
			document.form1.elements['state'].options[(document.form1.elements['state'].options.length - 1)] = null;
		}
		eval("document.form1.elements['state'].options[0]=" + "new Option('--')");
		document.form1.elements['state'].options[0].value="0";
		for (var i=1; i < selectedArray.length; i++) {
			var id = selectedArray[i].substring(0,selectedArray[i].indexOf(":"));
			var val = selectedArray[i].substring(selectedArray[i].indexOf(":")+1, selectedArray[i].length);
			document.form1.elements['state'].options[i]=new Option(val);
			document.form1.elements['state'].options[i].value=id;
			if (id == mychoice){
				document.form1.elements['state'].selectedIndex = i;
				nochoice = 0;
			}
		}
	}else{
		document.form1.elements['state'].options[(document.form1.elements['state'].options.length - 1)] = null;
		eval("document.form1.elements['state'].options[0]=" + "new Option('--')");
		document.form1.elements['state'].options[0].value="0";
	}
	if (nochoice){
		document.form1.elements['state'].selectedIndex = 0;
	}
}
</script>
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
<TR><TD>Company:<BR>
	<TD><INPUT type=text name=company size=50 maxLength=100 value="<?=htmlspecialchars($_POST['company'])?>"></TD></TR>
<TR><TD>Name:<BR>
	<TD><INPUT type=text name=name size=50 maxLength=100 value="<?=htmlspecialchars($_POST['name'])?>"></TD></TR>
<TR><TD>Email address:<BR>
      <DIV class=tiny>(<a href=index.php?read=privacy.htm&<?=$id?>>Privacy Policy</a>)</DIV></TD>
	<TD><INPUT type=text name=email size=30 value="<?=$_POST['email']?>"></TD></TR>
<TR><TD>Address:<BR></TD>
	<TD><input type=text name=address size=40 maxLength=40 value="<?=htmlspecialchars($_POST['address'])?>"></TD></TR>
<TR><TD>City:<BR></TD>
	<TD><input type=text name=city size=40 maxLength=40 value="<?=htmlspecialchars($_POST['city'])?>"></TD></TR>
<TR><TD>Country:<BR></TD>
	<TD><? WriteCombo($country_values, "country", $_POST['country'], 0,"onChange=\"populate(document.form1.country.options[document.form1.country.selectedIndex].value)\"");?></TD></TR>
<TR><TD>State / Province:<BR></TD>
<?
	if ($_POST['country']){
		$state_array = $state_values[ $_POST['country'] ];
	}
	if (!$state_array){
		$state_array = $state_values;
	}
?>
	<TD><? WriteCombo($state_array, "state", $_POST['state'], 0);?></TD></TR>
<TR><TD>Zip/Postal Code:<BR></TD>
	<TD><input type=text name=zipcode size=40 maxLength=40 value="<?=htmlspecialchars($_POST['zipcode'])?>"></TD></TR>
<TR><TD>Phone:<BR></TD>
	<TD><input type=text name=phone size=40 maxLength=40 value="<?=htmlspecialchars($_POST['phone'])?>"></TD></TR>
<TR><TD>Fax:<BR></TD>
	<TD><input type=text name=fax size=40 maxLength=40 value="<?=htmlspecialchars($_POST['fax'])?>"></TD></TR>
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