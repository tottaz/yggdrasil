<?
include_once("merchant_function.inc.php");

$prefix_dis=array('MR.'=>'MR.','MRS.'=>'MRS.','MISS'=>'MISS','MS.'=>'MS.','DR.'=>'DR.','PROF.'=>'PROF.');
$language=array('English'=>'English','French'=>'French');
$uname=explode(" ",$_SESSION['username']);

//$country_arr=GetCountry();
//$country_iso_code=$country_arr[1];

//$state_arr=GetState();
//$state_code=$state_arr[1];

$image_path="cpos/images/";

if(isset($base->input['update']))
{
	   $client_id=$base->input['client_id_combo'];
	   $update_location="update ".TBL_CLIENT_LOCATION_DETAILS." set
								ltn_street_number='".$base->input[billingstreetno]."',
								ltn_street_name='".$base->input[billingstreetname]."',
								ltn_street_type='".$base->input[billingstreettype]."'  ,
								ltn_street_direction='".$base->input[billingstreetdirection]."',
								ltn_suite_type='".$base->input[billingsuitetype]."' ,
								ltn_suite_number='".$base->input[billingsuiteno]."',
								ltn_supplementary_address='".$base->input[billingsuppaddress]."',
								ltn_legal_land_description='".$base->input[billinglanddesc]."',
								ltn_post_office_box_type='".$base->input[billingboxno]."',
								ltn_city='".$base->input[billingcity]."',
								ltn_state_code='".$base->input[billingstate]."',
							    ltn_country_code='".$base->input[billingcountry]."',
							    ltn_location_open_date='".$base->input[billingopendate]."',
								ltn_postal='".$base->input[billingpostal]."' where client_id='$client_id' and location_id=2 and active='Y' ";

		$zetadb->Execute($update_location);


		$update_contact="update ".TBL_CLIENT_CONTACTS." set
						cnt_name_prefix='".$base->input[billingnameprefix]."',
						cnt_first_name='".$base->input[billingfirstname]."',
						cnt_middle_initial='".$base->input[billingmiddlename]."',
						cnt_last_name='".$base->input[billinglastname]."',
						cnt_name_suffix='".$base->input[billingnamesuffix]."',
						cnt_title='".$base->input[title]."',
						cnt_language='".$base->input[billinglanguage]."',
						cnt_phone_number='".$base->input[billingphonenumber]."',
						cnt_phone_extension='".$base->input[billingphoneextn]."',
						cnt_fax_number='".$base->input[billingfaxnumber]."',
						cnt_email='".$base->input[billingemail]."' where client_id='$client_id' and location_id=2 and active='Y'";

//and location_id=2 for Billing 1 for delivery
		 $zetadb->Execute($update_contact);

		 $msg="Record Is Updated Successfully";
		?><!-- <META HTTP-EQUIV="refresh" content="2;URL=index.php?directory=modules&subdirectory=merchant&function=merchant_support&menu_type=change_billaddr"> --><?
}


	$rs=AccountNo();				//find the client id for logged in user
	//$rs_data=$rs->FetchNextObject();
	
	if($_SESSION['admin_cli_id']=="")
		  $client_id=$rs;
	else
		  $client_id=$base->input['client_id_combo'];
	  
	 //$sql_sel="select * from ".TBL_CLIENT_CONTACTS." c,".TBL_CLIENT_LOCATION_DETAILS." l where c.client_id=l.client_id and  l.client_id in 	
		//			('".$client_id."') and l.location_id=2";  //2 for billing add
	  
	  $sql_sel="select * from ".TBL_CLIENT_CONTACTS." c,".TBL_CLIENT_LOCATION_DETAILS." l where l.client_id=c.client_id and " .
	  		   " l.location_id=c.location_id and l.location_id=2 and l.client_id in ('".$client_id."') and l.active='Y' and c.active='Y'"; 

	  $rs_sel=$zetadb->Execute($sql_sel);
	  $data=$rs_sel->FetchNextObject();

	  $cli_id=createclientcombo($client_id);// for creating the combo
		$base->input[billingcountry] = $data->LTN_COUNTRY_CODE;
		$base->input[billingstate] = $data->LTN_STATE_CODE;
?>

<script src="cpos/core/lib/date-picker.js"></script>

<table border="0" cellspacing="0" align=center cellpadding="0" width="100%">
	<tr valign="top"><td width="100%">
	<table border="0" cellspacing="0" align=center cellpadding="0" width="100%">
		<tr valign="top">
			<td align="center" class="subtitle"><font color=green><?=$msg?>&nbsp;</font></td>
		</tr>
	</table>
	</td></tr>
	<tr valign="top"><td>
	<table border="0" cellspacing="0" align=center cellpadding="0" width="100%">
		<tr valign="top">
			<td class="subtitle">Change Billing Address</td>
		</tr>
	</table>
      </td>
    </tr>
   <form name="ChangeBillingAddress" method="post" action="index.php?directory=modules&subdirectory=merchant&function=merchant_support&menu_type=change_billaddr" >
	<tr>
	  <td>
	<table align="center" width="100%" cellspacing="2" cellpadding="1" class="outerTable" border=0>
 		   <tr>
				<td width='15%' class="formLabel"> Select Client Id :</td>
				<td class="formFieldRequired">
					<?writecombo($cli_id,"client_id_combo","",$base->input['client_id_combo'],'','','onchange="form.submit()"')?>
				</td>
		  </tr>
	  </table>
	  </td>
	</tr>
 
    <tr valign="top"><td >
		  <table align="center" width="100%" cellspacing="2" cellpadding="1" class="outerTable" border=0>
 	     <tr>
	       <td class="formLabel" width="15%">Name </td>
	       <td class="formFieldRequired" width="85%" colspan="3">
	       <table cellspacing="0" cellpadding="0" border="0" width="100%">
	       <tr><td rowspan="2" valign="top" align="left" width="10%">
	         <select name="billingnameprefix" id="billingnameprefix">
	         	<script>prefix(document.getElementById('billingnameprefix'));</script>
	         </select><br/><i>(Prefix)</i></td>
	         <td align="right"><i>(First Name)</i></td>
				 <td align="left">
					<input type="text" name="billingfirstname" id="billingfirstname" class="inputMed" value="<?=$data->CNT_FIRST_NAME?>">
				 </td>
			 	 <td align="right"><i>(Middle Name)</i></td>
				 <td align="left">
					<input type="text" name="billingmiddlename" id="billingmiddlename" class="inputMed" value="<?=$data->CNT_MIDDLE_INITIAL?>" maxlength=1></td>
				 <td width="15%" rowspan="2"></td>
			</tr>

	       <tr><td align="right"><i>(Last Name)</i></td><td ><input type="text" name="billinglastname" id="billinglastname" class="inputMed" value="<?=$data->CNT_LAST_NAME?>"></td><td align="right"><i>(Name Suffix)</i></td><td align="left"><input type="text" name="billingnamesuffix" id="billingnamesuffix" class="inputMed" value="<?=$data->CNT_NAME_SUFFIX?>"></td></tr>
	       </table>

	       </td>
	     </tr>

 	     <tr>
	       <td class="formLabel" width="15%">Title</td>
	       <td class="formFieldRequired" width="35%">
	         <input type="text" name="title" id="title" maxlength="20" class="inputMed"  value="<?=$data->CNT_TITLE?>">
	       </td>
	       <td class="formLabel" width="15%">Language </td>
	       <td class="formFieldRequired" width="35%">
	         <select name="billinglanguage" id="billinglanguage" class="inputLong">
				  <script>
					locationLanguage(document.getElementById('billinglanguage'));
					selectComboValue(document.getElementById("billinglanguage"), "<? echo $base->input['billinglanguage'] ?>")
				 </script>
	         </select>
	       </td>
	     </tr>
 	     <tr>
	       <td class="formLabel">E-Mail Address</td>
	       <td class="formFieldRequired" >
	         <input type="text" name="billingemail" id="billingemail" maxlength="50" class="inputMed" value="<?=$data->CNT_EMAIL?>"/>
	       </td>
	       <td class="formLabel">Fax Number</td>
	       <td class="formFieldRequired">
        	<input type="text" name="billingfaxnumber" id="billingfaxnumber" maxlength="25" class="inputLong" value="<?=$data->CNT_FAX_NUMBER?>"/>
	       </td>
	     </tr>
 	     <tr>
		   <td class="formLabel">Phone Number</td>
		   <td class="formFieldRequired" style=" padding-left: 3px;" >
			<span class="required">*</span>
			<input type="text" name="billingphonenumber" id="billingphonenumber" maxlength="25" class="inputMed" value="<?=$data->CNT_PHONE_NUMBER?>"/>
			<i>(Extn)</i> <input type="text" name="billingphoneextn" id="billingphoneextn" maxlength="25" class="inputMin" value="<?=$data->CNT_PHONE_EXTENSION?>"/>
		   </td>

	       <td class="formLabel">&nbsp;</td>
	       <td class="formFieldRequired" >
	         &nbsp;
	       </td>
	     </tr>
		</table><br/>
		<table align="center" width="100%" cellspacing="2" cellpadding="1" class="outerTable" border=0>
 	     <tr>
	       <td class="formLabel" width="15%">Street No.</td>
	       <td class="formFieldRequired" width="35%"style=" padding-left: 3px;" >
			<span class="required">*</span>
	         <input type="text" name="billingstreetno" id="billingstreetno" maxlength="20" class="inputMed" value="<?=$data->LTN_STREET_NUMBER?>"/>
	       </td>
	       <td class="formLabel" width="15%">Street Name</td>
	       <td class="formFieldRequired" width="35%"style=" padding-left: 3px;" >
			<span class="required">*</span>
	         <input type="text" name="billingstreetname" id="billingstreetname" maxlength="25" class="inputLong" value="<?=$data->LTN_STREET_NAME?>"/>
	       </td>
	     </tr>
 	     <tr>
	       <td class="formLabel">Street Type</td>
	       <td class="formFieldRequired" >
		    <select name='billingstreettype' class="inputLong">
				<!-- <script>locationStreetType(document.getElementById('billingstreettype'));
				 selectComboValue(document.getElementById("billingstreettype"), "<? echo $base->input['billingstreettype'] ?>")</script>-->
			 </select>
	        <!--  <input type="text" name="billingstreettype" id="billingstreettype" maxlength="20" class="inputMed" value="<?=$data->LTN_STREET_TYPE?>"/> -->
	       </td>
	       <td class="formLabel">Street Direction</td>
	       <td class="formFieldRequired" >
		   <select name="billingstreetdirection" id="billingstreetdirection" maxlength="20" class="inputLong">
	         <script>locationStreetDirection(document.getElementById('billingstreetdirection'));
			 selectComboValue(document.getElementById("billingstreetdirection"), "<? echo $base->input['billingstreetdirection'] ?>")</script>
  		  </select>
	        <!--  <input type="text" name="billingstreetdirection" id="billingstreetdirection" maxlength="25" class="inputLong" value="<?=$data->LTN_STREET_DIRECTION?>"/> -->
	       </td>
	     </tr>
 	     <tr>
	       <td class="formLabel">Suite Type</td>
	       <td class="formFieldRequired" >
		    <select name="billingsuitetype" id="billingsuitetype" maxlength="20" class="inputLong">
	         <script>locationSuiteType(document.getElementById('billingsuitetype'));
			 selectComboValue(document.getElementById("billingsuitetype"), "<? echo $base->input['billingsuitetype'] ?>")</script>
  		  </select>
	         <!-- <input type="text" name="billingsuitetype" id="billingsuitetype" maxlength="20" class="inputMed" value="<?=$data->LTN_SUITE_TYPE?>"/> -->
	       </td>
	       <td class="formLabel">Suite Number</td>
	       <td class="formFieldRequired" >
	         <input type="text" name="billingsuiteno" id="billingsuiteno" maxlength="25" class="inputLong" value="<?=$data->LTN_SUITE_NUMBER?>"/>
	       </td>
	     </tr>
 	     <tr>
	       <td class="formLabel">Supplementary Address :</td>
	       <td class="formFieldRequired" colspan="3">
	         <textarea name="billingsuppaddress" id="billingsuppaddress" maxlength="20" class="inputLong" style=" height: 50px;" cols="24" wrap="soft" ><?=$data->LTN_SUPPLEMENTARY_ADDRESS?></textarea>
	       </td>
	     </tr>
		</table><br/>
		<table align="center" width="100%" cellspacing="2" cellpadding="1" class="outerTable" border=0>
 	     <tr>
	       <td class="formLabel" width="15%">P.O.Box/RR #</td>
	       <td class="formFieldRequired" width="35%">
	         <input type="text" name="billingboxno" id="billingboxno" maxlength="20" class="inputMed" value="<?=$data->LTN_POST_OFFICE_BOX_TYPE?>"/>
	       </td>
	       <td class="formLabel" width="15%">Legal Land Description</td>
	       <td class="formFieldRequired" width="35%">
	         <input type="text" name="billinglanddesc" id="billinglanddesc" maxlength="25" class="inputLong" value="<?=$data->LTN_LEGAL_LAND_DESCRIPTION?>"/>
	       </td>
	     </tr>
 	     <tr>
	       <td class="formLabel">City</td>
	       <td class="formFieldRequired" style=" padding-left: 3px;" >
			<span class="required">*</span>
	         <input type="text" name="billingcity" id="billingcity" maxlength="20" class="inputMed" value="<?=$data->LTN_CITY?>"/>
	       </td>
	        
	       <td class="formLabel">Province</td>
	       <td class="formFieldRequired" style=" padding-left: 3px;" >
			<span class="required">*</span>
	         <select name="billingstate" id="billingstate" class="inputMed" >
	          </select>
			 <script>loadProvinces(document.getElementById('billingstate'),"<? echo $base->input['billingcountry'] ?>");
			 		 document.getElementById("billingstate").value= "<? echo $base->input['billingstate'] ?>";			 		 
			  </script> 
	       </td>
	     </tr>
 	     <tr>
	       <td class="formLabel">Postal</td>
	       <td class="formFieldRequired" style=" padding-left: 3px;" >
			<span class="required">*</span>
	         <input type="text" name="billingpostal" id="billingpostal" maxlength="20" class="inputMed" value="<?=$data->LTN_POSTAL?>"/>
	       </td>
	       <td class="formLabel">Open date</td>
	       <td class="formFieldRequired" >
	         <input type="text" readonly name="billingopendate" id="billingopendate" maxlength="10" class="inputMed" value="<?=$data->LTN_LOCATION_OPEN_DATE?>"/><img name="imMF_1" src="cpos/images/small-calendar.jpg" border="0" onClick="javascript:show_calendar('ChangeBillingAddress.billingopendate');"><!--  <i>(yyyy-mm-dd)</i> -->
	       </td>
	     </tr>
 	     <tr>
	       <td class="formLabel">Country</td>
	       <td class="formFieldRequired"style=" padding-left: 3px;" >
			<span class="required">*</span>
	         <select name="billingcountry" id="billingcountry" maxlength="20" class="inputLong"
	          onchange="javascript: loadProvinces(document.getElementById('billingstate'), this.value)">
	        	 
	         </select>
	         
	         <script>loadCountries(document.getElementById('billingcountry'));
					 selectCountryByCode(document.getElementById("billingcountry"), "<? echo $base->input['billingcountry'] ?>");
			 </script> 
	       </td>
	       <td class="formLabel">&nbsp;</td>
		   	       <td class="formFieldRequired" >
		   	         &nbsp;
	       </td>
	     </tr>
       </table>
 	  <table align="center" width="100%" cellspacing="2" cellpadding="1" border=0>
	    <tr>
		      <td align=right><input type="submit" name="update" value="Update" class='inputBtnMed' onclick="return chk()"></td>
		</tr>
     </table>

  </td>
 </tr>
 
 <input type="hidden" name="hcountrystr" value="<?echo $str?>">
 <input type="hidden" name="hcountryvalue" value="<?echo $val?>">
 </form>
</table>

<script>
createCountryCombo(document.ChangeBillingAddress,document.ChangeBillingAddress.billingcountry,document.ChangeBillingAddress.billingstate,37);

function chk()
{
	if(document.ChangeBillingAddress.client_id_combo.value=="0" || document.ChangeBillingAddress.client_id_combo.value=="1")
	{
		alert("Please Select Client Id");
		document.ChangeBillingAddress.client_id_combo.focus();
		return false;
	}
	if(document.ChangeBillingAddress.billingphonenumber.value=="")
	{
		alert("Please Enter The Phone No");
		document.ChangeBillingAddress.billingphonenumber.focus();
		return false;
	}

	if(document.ChangeBillingAddress.billingstreetno.value=="")
	{
		alert("Please Enter The Street No");
		document.ChangeBillingAddress.billingstreetno.focus();
		return false;
	}

	if(document.ChangeBillingAddress.billingstreetname.value=="")
	{
		alert("Please Enter The Street Name");
		document.ChangeBillingAddress.billingstreetname.focus();
		return false;
	}

	if(document.ChangeBillingAddress.billingcity.value=="")
	{
		alert("Please Enter The City");
		document.ChangeBillingAddress.billingcity.focus();
		return false;
	}

	if(document.ChangeBillingAddress.billingpostal.value=="")
	{
		alert("Please Enter The Postal Code");
		document.ChangeBillingAddress.billingpostal.focus();
		return false;
	}
	return true;
}



</script>