<form name='frmbilling' method="post" action="<?echo $PHP_SELF //$formAction?>">
<input type="hidden" name="clm_lead_id" id="clm_lead_id" value="<? echo $base->input['clm_lead_id']; ?>"/>
<input type="hidden" name="getLeadInfo" id="getLeadInfo" value="<?echo $_REQUEST[getLeadInfo]?>"/>
<table border="0" cellspacing="0" align="center" cellpadding="0" width="100%">
<tr height ="40" valign="top">
		<td width="100%">
		<table border="0" cellspacing="0" cellpadding="0" width="100%">
			<tr>
				<td class="subtitle">&nbsp;</td>
			</tr>
		</table>
		</td>
	</tr>
	<tr height = "40" valign="top">
		<td width="100%"> 
		   <table width="100%" cellspacing="2" cellpadding="1" class="outerTable" border=0>
		  	<tr>
				<td class="formLabel" width='15%'>Select Order Type</td>
				<td class="formFieldRequired" width='85%'>
					<select name="selOrderType" onchange="changeDisplay(this.value,this.name,'','buy','lease')" class="inputLong">
						<option value="buy" selected>Buy</option>
						<option value="lease" >Lease</option>
						<option value="changerequest">Change Request</option>
						<option value="other">Other</option>									
					</select>
				</td>
			</tr>
	     <table>
	 </td>
	</tr>
	</table>
	<tr  valign="top" >
		<td width="100%"> 
		   <table width="100%" cellspacing="2" cellpadding="1" class="outerTable" id="selOrderType1">
			 <tr>
				<td class="formLabel" width="15%">Client Id</td>
		       	<td class="formFieldRequired" width="85%">
			     <input type="text" name='sel_client_id' id="sel_client_id" class="inputLong" readonly value="<? echo $clientData['client_id'];?>">&nbsp;
			     <input type="hidden" id='client_id' name='client_id' />
				 <a href="#" onclick="javascript:openBrWindow('<?echo $popupwindow?>find_merchant.php','FindClients',' width=820, height=580, menubar=false,  toolbar=0, scrollbars=1');"  title="Existing User Select Client Id From Here">Client Id</a>  
			    </td>
			 </tr>
		   <table>
		 </td>
	</tr>
	</table>
	<tr>
		<td align='right'>
			<input class="inputBtnMed" type="submit" name="frmsumbit" value="Submit" onclick="return chk('<?echo $moduleType?>')"/>
		</td>
   </tr>
   <input type="hidden" name="getClientInfo" id="getClientInfo" value='false' /> 
   </form>
</table>
<script>
document.getElementById('selOrderType1').style.display='none';
function chk(module)
{
	 if((document.frmbilling.selOrderType.value!="buy" && document.frmbilling.selOrderType.value!="lease")  &&  document.frmbilling.sel_client_id.value=="" )
	 {
	 	alert("Please Select The Client Id");
	 	return false;
	 }
	 else
	 {
	 	if(module=="operation"){
		 	if(document.frmbilling.selOrderType.value=="buy" || document.frmbilling.selOrderType.value=="lease")
		 	{
		 		document.frmbilling.action="index.php?directory=modules&subdirectory=operation&function=oper_order&menu_type=oper_new_order";
		 		frmbilling.submit();
		 	}
		 	else if(document.frmbilling.selOrderType.value=="changerequest")
		 	{
		 		document.frmbilling.getClientInfo.value="true";
		 		document.frmbilling.client_id.value=document.frmbilling.sel_client_id.value;
		 		document.frmbilling.action="index.php?directory=modules&subdirectory=operation&function=oper_order&menu_type=change_request_order";
		 		frmbilling.submit();
		 	}
		 	else if(document.frmbilling.selOrderType.value=="other")
		 	{
		 		document.frmbilling.getClientInfo.value="true";
		 		document.frmbilling.client_id.value=document.frmbilling.sel_client_id.value;
		 		document.frmbilling.action="index.php?directory=modules&subdirectory=operation&function=oper_order&menu_type=others_order";
		 		frmbilling.submit();
		 	}
	 	}else if(module=="sale"){	 		
	 		if(document.frmbilling.selOrderType.value=="buy" || document.frmbilling.selOrderType.value=="lease")
		 	{
		 		document.frmbilling.action="index.php?directory=modules&subdirectory=sale&function=create_order&menu_type=new_order";
		 		frmbilling.submit();
		 	}
		 	else if(document.frmbilling.selOrderType.value=="changerequest")
		 	{
		 		document.frmbilling.getClientInfo.value="true";
		 		document.frmbilling.client_id.value=document.frmbilling.sel_client_id.value;
		 		document.frmbilling.action="index.php?directory=modules&subdirectory=sale&function=create_order&menu_type=change_request_order";
		 		frmbilling.submit();
		 	}
		 	else if(document.frmbilling.selOrderType.value=="other")
		 	{
		 		document.frmbilling.getClientInfo.value="true";
		 		document.frmbilling.client_id.value=document.frmbilling.sel_client_id.value;
		 		document.frmbilling.action="index.php?directory=modules&subdirectory=sale&function=create_order&menu_type=others_order";
		 		frmbilling.submit();
		 	}
	 	}
	 	else if(module=="saleagent")
	 	{	 		
	 		if(document.frmbilling.selOrderType.value=="buy" || document.frmbilling.selOrderType.value=="lease")
		 	{
		 		document.frmbilling.action="index.php?directory=modules&subdirectory=salesagent&function=sagent_order&menu_type=sagent_new_order";
		 		frmbilling.submit();
		 	}
		 	else if(document.frmbilling.selOrderType.value=="changerequest")
		 	{
		 		document.frmbilling.getClientInfo.value="true";
		 		document.frmbilling.client_id.value=document.frmbilling.sel_client_id.value;
		 		document.frmbilling.action="index.php?directory=modules&subdirectory=salesagent&function=sagent_order&menu_type=change_request_order";
		 		frmbilling.submit();
		 	}
		 	else if(document.frmbilling.selOrderType.value=="other")
		 	{
		 		document.frmbilling.getClientInfo.value="true";
		 		document.frmbilling.client_id.value=document.frmbilling.sel_client_id.value;
		 		document.frmbilling.action="index.php?directory=modules&subdirectory=salesagent&function=sagent_order&menu_type=others_order";
		 		frmbilling.submit();
		 	}
	 	}
	 	else if(module=="insidesale")
	 	{	 		
	 		if(document.frmbilling.selOrderType.value=="buy" || document.frmbilling.selOrderType.value=="lease")
		 	{
		 		document.frmbilling.action="index.php?directory=modules&subdirectory=insidesale&function=insale_create_order&menu_type=insale_new_order";
		 		frmbilling.submit();
		 	}
		 	else if(document.frmbilling.selOrderType.value=="changerequest")
		 	{
		 		document.frmbilling.getClientInfo.value="true";
		 		document.frmbilling.client_id.value=document.frmbilling.sel_client_id.value;
		 		document.frmbilling.action="index.php?directory=modules&subdirectory=insidesale&function=insale_create_order&menu_type=change_request_order";
		 		frmbilling.submit();
		 	}
		 	else if(document.frmbilling.selOrderType.value=="other")
		 	{
		 		document.frmbilling.getClientInfo.value="true";
		 		document.frmbilling.client_id.value=document.frmbilling.sel_client_id.value;
		 		document.frmbilling.action="index.php?directory=modules&subdirectory=insidesale&function=insale_create_order&menu_type=others_order";
		 		frmbilling.submit();
		 	}
 		}
	 	
	 }
	 return true;
}
</script>
