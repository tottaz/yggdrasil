<? ?>
<table width="100%" border="0" align="center" >
<tr valign="top"><td width="100%">
<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
	<tr>
		<td >
			<span class="subtitle">Edit Your Information</span><br>
		</td>
	</tr>
</table>

</td></tr>

<?
	$_SESSION['msg_change_info_status'] ='';
	if ($base->input['buyer_edit']){
		$posterr = 0;
		if($data->PASSWORD){
			$old = $base->input['old_password'];
			if($data->PASSWORD != $old){
				errform('You have entered an invalid password. Please enter your current password in order to update your profile<br>'); // #err
			}
		}

		// Check email
		if (!email_check($base->input['email']) ){
			errform('You have entered an invalid email address.'); // #err
			$base->input['email'] = $data->EMAIL;
		}
		// Check name
		if ($base->input['firstname']  == '' ){
			errform('You have entered an invalid Name.'); // #err
			$base->input['name'] = $data->NAME;
		}
		// Check address
		if ($base->input['address']  == '' ){
			errform('You have entered an invalid address.'); // #err
			$base->input['address'] = $data->ADDRESS;
		}
		// Check city
		if ($base->input['city']  == '' ){
			errform('You have entered an invalid city.'); // #err
			$base->input['city'] = $data->CITY;
		}
		// Check zipcode
		if ($base->input['zipcode']  == '' ){
			errform('You have entered an invalid zipcode.'); // #err
			$base->input['zipcode'] = $data->ZIPCODE;
		}
		// Check country
		if ($base->input['country']  == '' ){
			errform('You have entered an invalid country.'); // #err
			$base->input['country'] = $data->COUNTRY;
		}
		// Check state
		if ($base->input['state']  == '' ){
			errform('You have entered an invalid state.'); // #err
			$base->input['state'] = $data->STATE;
		}
		// Check phone
		if ($base->input['phone']  == '' ){
			errform('You have entered an invalid phone.'); // #err
			$base->input['phone'] = $data->PHONE1;
		}
	}else{
		// Fill with current data
		$base->input['email'] = $data->EMAIL;
		$base->input['firstname'] = $data->FIRSTNAME;
		$base->input['lastname'] = $data->LASTNAME;
		$base->input['regnum'] = $data->REGNUM;
		$base->input['notify'] = $data->NOTIFY;
		$base->input['address'] = $data->ADDRESS;
		$base->input['city'] = $data->CITY;
		$base->input['zipcode'] = $data->ZIPCODE;
		$base->input['country'] = $data->COUNTRY;
		$base->input['state'] = $data->STATE;
		$base->input['phone'] = $data->PHONE1;
		$base->input['fax'] = $data->FAX;
	}

	if ($base->input['buyer_edit'] && !$posterr){
		$loginid= $_SESSION['loginid'];
		$update_columns['notify'] = ($base->input['notify'] ? 1 : 0);
		$update_columns['password'] = $base->input['old_password'];
		$update_columns['email'] = addslashes($base->input['email']);
		$update_columns['firstname'] = addslashes($base->input['firstname']);
		$update_columns['lastname'] = addslashes($base->input['lastname']);
		$update_columns['regnum'] = addslashes($base->input['regnum']);
		$update_columns['notify'] = ($base->input['notify']?1:0);
		$update_columns['address'] = addslashes($base->input['address']);
		$update_columns['country'] = addslashes($base->input['country']);
		$update_columns['state'] = addslashes($base->input['state']);
		$update_columns['city'] = addslashes($base->input['city']);
		$update_columns['phone1'] = addslashes($base->input['phone']);
		$update_columns['fax'] = addslashes($base->input['fax']);
		$update_columns['zipcode'] = addslashes($base->input['zipcode']);


		// Update database
		$status = $zetadb->AutoExecute(TBL_SYSTEM_USER_DETAIL, $update_columns, "UPDATE", " loginid='$loginid' and active='Y'") or die( $zetadb->Error() );
		if($status){
			$_SESSION['msg_change_info_status'] = "<span class='successmsg'>Account info modified successfully</span>" ;
		}else{
			$_SESSION['msg_change_info_status'] = "<span class='errormsg'>Error: Account info not modified.</span>" ;
		}

	}
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
	var mychoice = "<?=$base->input['state']?>";
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
<?	if($_SESSION['msg_change_info_status'] != ""){ ?>
	<tr valign="top" height="30"><td>
	<table align="center" width="100%" cellspacing=0 cellpadding=0>
		<tr>
			<td align="center"class="subtitle">&nbsp;<? echo $_SESSION['msg_change_info_status'] ?>
			</td>
		</tr>
		</table>
		</td></tr>
<?	}  ?>
		<tr valign="top"><td>
<table align="left" width="100%" cellspacing=0 cellpadding=0>
<tr>
	<td >
		<img src="cpos/images/lock.gif">
		<b>All the information that you input here is securely stored and will not be misused in any way.</b>
	</td>
</tr>
</table>
</td></tr>
<tr valign="top"><td>
<table class="outerTable" cellspacing="2" cellpadding="1" width="100%">
	<form method=post enctype='multipart/form-data' name="form1">
<tr><td width="15%" class="formLabel">Current Password:</td>
	<td width="85%" class="formFieldRequired">
	<INPUT type=password name="disp_password" id="disp_password" class="inputMed" maxLength=16 onclick="javascript:setPassword(document.getElementById('old_password'), this.value)"  onblur="javascript:setPassword(document.getElementById('old_password'), this.value)"  onchange="javascript:setPassword(document.getElementById('old_password'), this.value)">
	<input type="hidden" name="old_password" id="old_password" />
	</td></tr>
<tr><td class="formLabel">Email address:</td>
	<td class="formFieldRequired">
	<INPUT type=text name=email class="inputMax" value="<?=$base->input['email']?>" onblur="javascript:checkEmailFormat(this);">
	(<a href="cpos/help/privacy.htm" target="_BLANK">Privacy Policy</a>)</td></tr>
<tr><td class="formLabel">Name:<BR>
	<td class="formFieldRequired" style=" padding-left: 3px;" >
			<span class="required">*</span>
			<INPUT type=text name="firstname" id="firstname" class="inputMax" maxLength=40 value="<?=htmlspecialchars($base->input['firstname'])?>" onkeypress="javascript:return validateValue(this, event, 'ANS');"><i>(First Name)</i>
	<br/>&nbsp;&nbsp;&nbsp;<INPUT type=text name="lastname" id="lastname" class="inputMax" maxLength=40 value="<?=htmlspecialchars($base->input['lastname'])?>" onkeypress="javascript:return validateValue(this, event, 'ANS');"><i>(Last Name)</i></td></tr>
<tr><td class="formLabel">Address:<BR></td>
	<td class="formFieldRequired" style=" padding-left: 3px;" >
			<span class="required">*</span>
			<input type=text name=address class="inputMax" maxLength=40 value="<?=htmlspecialchars($base->input['address'])?>"></td></tr>
<tr><td class="formLabel">City:<BR></td>
	<td class="formFieldRequired" style=" padding-left: 3px;" >
			<span class="required">*</span>
			<input type=text name=city class="inputMax" maxLength=40 value="<?=htmlspecialchars($base->input['city'])?>"  onkeypress="javascript:return validateValue(this, event, 'AS');"></td></tr>
<tr><td class="formLabel">Province </td>
	       <td class="formFieldRequired" style=" padding-left: 3px;" >
			<span class="required">*</span>
	      			 <select name="state" id="state" class="inputMed" >		 	  
			<!--<script>
				loadProvinces(document.getElementById(state),this.form.country.value);
		   </script>
			  <script>loadProvinces(document.getElementById('state'));
			 selectComboValue(document.getElementById("state"), "<?// echo $base->input['state'] ?>")</script>
			</select>-->
			<?if($base->input['country']=="")
				$base->input['country']="CA";
			  if($base->input['state']=="")
				$base->input['state']="ON";
			  ?>
			<script>loadProvinces(document.getElementById('state'),"<? echo $base->input['country'] ?>");
			 		 document.getElementById("state").value= "<? echo $base->input['state'] ?>";			 		 
			  </script>
	       </td></tr>
<tr><td class="formLabel">Country:<BR></td>
	<td class="formFieldRequired" style=" padding-left: 3px;" >
			<span class="required">*</span>
	
	<select name="country" id="country" class="inputMax" onchange="javascript: loadProvinces(document.getElementById('state'), this.value)">	
	</select>
	<!--<script>loadCountries(document.getElementById("country"));
     
	selectCountryByCode(document.getElementById("country"), "<? //echo $base->input['country'] ?>");</script>-->
	
	<script>
			loadCountries(document.getElementById('country'));
		    selectCountryByCode(document.getElementById("country"), "<? echo $base->input['country'] ?>");
	 </script> 
	</td></tr>
<tr><td class="formLabel">Postal Code:<BR></td>
	<td class="formFieldRequired" style=" padding-left: 3px;" >
			<span class="required">*</span>
			<input type=text name=zipcode class="inputMax" maxLength=40 value="<?=htmlspecialchars($base->input['zipcode'])?>"></td></tr>
<tr><td class="formLabel">Phone:<BR></td>
	<td class="formFieldRequired" style=" padding-left: 3px;" >
			<span class="required">*</span>
			<input type=text name=phone class="inputMax" maxLength=40 value="<?=htmlspecialchars($base->input['phone'])?>"></td></tr>
<tr><td class="formLabel">Fax:<BR></td>
	<td class="formFieldRequired"><input type=text name=fax class="inputMax" maxLength=40 value="<?=htmlspecialchars($base->input['fax'])?>"></td></tr>
</table>
</td></tr>
<tr valign="top" align="right"><td>
<INPUT type=submit class=button name=buyer_edit class="inputMed" value='Change info >>' onclick="return submitChangeAcntInfo(document.forms[0],document.getElementById('disp_password').value);">

			</td>
		</tr>
		</table>


</form>