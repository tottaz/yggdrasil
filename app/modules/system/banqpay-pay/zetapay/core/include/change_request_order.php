<?php
	include ("cpos/modules/operation/operation_function.inc.php");
	include ("cpos/modules/sale/sales_common_ch.inc.php");
	
	 
	$userType = $_SESSION['usergroup'];
	$userName = $_SESSION['username'];
	//echo $userType." ".$userName;
	//print $_REQUEST['getClientInfo']."=". $base->input['client_id']."==".$base->input['order_id']."<br>";
	
	$terminalTypeInfo = createJSArray($terminalTypes,"terminalTypes");	
//print $_REQUEST['getClientInfo'].$base->input['order_id'] ." &&". $base->input['client_id'];
	
// Modified 31-Mar Sandeep	
	if($_REQUEST['btnMarkQuality']!= "" || $_REQUEST['documentCheckDone']== "true"  || array_key_exists('cardInfoVerification',$_REQUEST)){
		echo "1";
		$currStatus = ($_REQUEST['btnMarkQuality']!= ""||$_REQUEST['documentCheckDone']== "true")?NEW_ORDER:CARD_INFO_PENDING;
		$nextStatus = VERIFICATION_PENDING;				
		//modifyOrderStatus($nextStatus,$_REQUEST['client_id'], $_REQUEST['order_id']);		
		processVerificationStatus($currStatus, $nextStatus, $_REQUEST['client_id'], $_REQUEST['order_id']);		
		echo "<script>location.href='index.php';</script>";
	}
// Modified 31-Mar Sandeep
		
	if($_SESSION[SER_FEE_DET] == "" || $_REQUEST['resetServices'] != "false"){
		echo "2";
		$serviceDetailsArray = fetchAllServices();
		$serviceDetailsArray = setDebitDefaultService($serviceDetailsArray);	
		//<!-- Modified Sandeep 31 Mar -->
		$serviceDetailsArray = setMailDefaultService($serviceDetailsArray);		
		//<!-- Modified Sandeep 31 Mar -->
		$_SESSION[SER_FEE_DET] = serialize($serviceDetailsArray);	
		$_SESSION[SER_SUMMARY] = getAllServicesSummary($serviceDetailsArray);
		
	}
	
 	if($_REQUEST['fetchServicedetails']== "true"){
 		echo "3";
 		$serviceDetailsArray = array();
 		//echo "Fetch Services";
		$serviceDetailsArray = fetchAllServices();
		$serviceDetailsArray = fetchServiceDetailsForClient($serviceDetailsArray, $_REQUEST['client_id'], $_REQUEST['order_id']);
		$_SESSION[SER_FEE_DET] = serialize($serviceDetailsArray);
		$_SESSION[SER_SUMMARY] = getAllServicesSummary(unserialize($_SESSION[SER_FEE_DET]));		  
 	} 	 	
 		
 	if($_REQUEST['btnUpdateOrder']!= "" && $isTokenValid){
 		echo "4";
 		// Update Order	
 		
 		updateOrder( unserialize($_SESSION[SER_FEE_DET]), $base->input['client_id'], $base->input['order_id'], true,$base->input['recordStatus'],$base->input['selOrderType']);
 			
 	}else if($_REQUEST['btnCreateNewOrder']!= "" && $isTokenValid){
 		echo "5"; 		
 		// Create Order	
 		createOrder(unserialize($_SESSION[SER_FEE_DET]), $base->input['client_id'], $base->input['order_id'], $base->input['clm_lead_id'],$base->input['recordStatus'],$base->input['selOrderType']);
 		
 		if($base->input['clm_lead_id'] != ""){
 			//Order created from prsopect
 			// Change lead status to order
 			modifyLeadStatus($base->input['clm_lead_id'],"order");
 		}	
 	}
 		
 	
 	if($_REQUEST['getLeadInfo'] == "true" && $base->input['clm_lead_id'] != ""){
 		echo "6"; 
 		$base->input['order_id'] ="";
 		$base->input['client_id'] ="";
 		//echo "Lead - ".$base->input['clm_lead_id'];
 		$data = array();
 		$data = getDeliveryInfoForOrder($base->input['clm_lead_id']);
 		
 		//Prefill delivery data same as the Billing data
 		$deliviryData = array();
 		$deliviryData = getDeliveryInfoForOrder($base->input['clm_lead_id']);
 		
 		$clientData = array();
 		fillDataFromLeadMaster($base->input['clm_lead_id'], $clientData);
 		$ownerShipInfo = "";
 		$equipmentInfo = ""; 		
 		$commData="";
 		$finData=""; 		
 		$clearJSArrays= "\nownersArray = new Array();\nequipmentArray = new Array();\n"; 		
 		$serviceDetailsArray = fetchAllServices();
		$serviceDetailsArray = setDebitDefaultService($serviceDetailsArray);	
		//<!-- Modified Sandeep 31 Mar -->
		$serviceDetailsArray = setMailDefaultService($serviceDetailsArray);		
		//<!-- Modified Sandeep 31 Mar -->
		
		$_SESSION[SER_FEE_DET] = serialize($serviceDetailsArray);	
		$_SESSION[SER_SUMMARY] = getAllServicesSummary($serviceDetailsArray);
 	}else if($base->input['order_id'] !="" && $base->input['client_id'] !="")
    {
		echo "7"; 
		// Record Status is added $base->input['recordStatus']
		$base->input['recordStatus']==''?$recordStatus='Y':$recordStatus=$base->input['recordStatus'];
		$clientData = getBusinessInfoForOrder($base->input['client_id'], $base->input['order_id'],'',$recordStatus);	
				
		$data = getBillingInfoForOrder($base->input['client_id'], $base->input['order_id'],$recordStatus);
		
		$deliviryData = getDeliveryInfoForOrder($base->input['client_id'], $base->input['order_id'],$recordStatus);			
	
		$ownerShipInfo = getOwnershipInfoForOrder($base->input['client_id'], $base->input['order_id'],$recordStatus);
		
		//$equipmentInfo = getEquipmentInfoForOrder($base->input['client_id'], $base->input['order_id'],$recordStatus);
		
		$equipmentTotalsData = getEquipmentTotalsInfoForOrder($base->input['client_id'], $base->input['order_id'],$recordStatus);			
				
		$commData = getCommunicationsInfoForOrder($base->input['client_id'], $base->input['order_id'],$recordStatus);
		
		$finData = getFinancialInfoForOrder($base->input['client_id'], $base->input['order_id'],$recordStatus);
		
		$termFeatures = getTerminalFeaturesForClient($base->input['client_id'], $base->input['order_id'],$recordStatus);
					
   }else if($_REQUEST['getClientInfo']== "true" && $base->input['client_id'] != ""){
   		echo "8";  		

		$base->input['recordStatus']==''?$base->input['recordStatus']='Y':$base->input['recordStatus'];	
  	
  		$order_id= getOrderIdForClient($base->input['client_id'],$base->input['recordStatus']);		
	
  		$order_id= getOrderIdForClient($base->input['client_id'],$base->input['recordStatus']);  		
	
		$clientData = getBusinessInfoForOrder($base->input['client_id'], $order_id,'',$base->input['recordStatus']);
		
		$clientData['ord_order_date']="";
	
		$data = getBillingInfoForOrder($base->input['client_id'], $order_id,$base->input['recordStatus']);
		
		$deliviryData = getDeliveryInfoForOrder($base->input['client_id'], $order_id,$base->input['recordStatus']);			
	
		$ownerShipInfo = getOwnershipInfoForOrder($base->input['client_id'], $order_id,$base->input['recordStatus']);
		
		$equipmentTotalsData = getEquipmentTotalsInfoForOrder($base->input['client_id'], $order_id,$base->input['recordStatus']);
		
		$finData = getFinancialInfoForOrder($base->input['client_id'], $order_id,$base->input['recordStatus']);
		
		$termFeatures = getTerminalFeaturesForClient($base->input['client_id'], $order_id,$base->input['recordStatus']);
	
		$order_id="";
					
		$serviceDetailsArray = unserialize($_SESSION[SER_FEE_DET]);
		$serviceDetailsArray = fetchServiceDetailsForClient($serviceDetailsArray, $_REQUEST['client_id'], $_REQUEST['order_id'],$base->input['recordStatus']);
		$_SESSION[SER_FEE_DET] = serialize($serviceDetailsArray);
		$_SESSION[SER_SUMMARY] = getAllServicesSummary(unserialize($_SESSION[SER_FEE_DET]));	
  
  }  
  
// Modified 31-Mar Sandeep Moved from top to here	
	if($_REQUEST['verifyOrder']== "true" || $_REQUEST['btnVerifyOrder']!=""){  //this will done by operation person
		echo "9";
  		updateOrderDetailsVerification($_REQUEST['client_id'], $_REQUEST['order_id'], $clientData, unserialize($_SESSION[SER_FEE_DET]));
  		if($_SESSION['status_msg']== "")echo "<script>location.href='index.php';</script>";
	}
// Modified 31-Mar Sandeep
  
  
  	if($_REQUEST['selOrderType']!="" ){
  		echo "10";  		
  		$clientData['ord_ordertype'] = $_REQUEST['selOrderType'];
  	}
  
  
  	$script = getServiceNames(unserialize($_SESSION[SER_FEE_DET]));
	$processingInfo = "document.getElementById('processingInfoMainTable').innerHTML=\"<table cellspacing=0 cellpadding=0 border=0 width='100%'>".$_SESSION[SER_SUMMARY]."</table>\"; ";
  

?>
<script>
<?
echo "\n"; 
//var_dump(unserialize($_SESSION[SER_FEE_DET]));
echo "\n";
echo $terminalTypeInfo ;
echo $clearJSArrays; 
?>
priceList = new Array();
taxInfo = new Array();
<?
	fetchPriceListForAgent($_SESSION['loginid']);
	echo createPriceListJSArray($_SESSION[PRICE_LIST]);	
?>

</script>
<? echo $base->input['client_id']." ".$base->input['order_id']; ?>
<form name='frmneworder' method="post" >
 <? renderHiddenCommonFields(); ?> 
 <input type="hidden" name="ownerRowCount" id="ownerRowCount" value="<? echo ($base->input['ownerRowCount'] ==""?1: $base->input['ownerRowCount']);?>"/>
 <input type="hidden" name="equipRowCount" id="equipRowCount" value="<? echo ($base->input['equipRowCount'] ==""?1: $base->input['equipRowCount']);?>"/>
 <!-- Modified Sandeep 31 Mar -->
 <?
 	if($_REQUEST['verifyCardInfo'] =="true"){
 		echo '<input type="hidden" name="cardInfoVerification" value="'.$clientData['ord_verification_status'].'"/>';
 	}
 ?> 
 <input type="hidden" name="ord_verification_status" value="<? echo $clientData['ord_verification_status'] ?>"/>
 <input type="hidden" name="ord_status" value="<? echo $clientData['ord_status']; ?>"/>
 <input type="hidden" name="selOrderType" value="<? echo $_REQUEST['selOrderType']; ?>"/>
 <input type="hidden" name="documentCheckDone" id="documentCheckDone" value="false"/> 
 <!--<input type="hidden" name="documentationStatus" value="<? echo $_REQUEST['documentationStatus']; ?>"/>-->
 <!-- Modified Sandeep 31 Mar --> 
 
 <input type="hidden" name="resetServices" id="resetServices" value="false"/>
 <input type="hidden" name="selectedService" id="selectedService" value=""/>
 <input type="hidden" name="clm_lead_id" id="clm_lead_id" value="<? echo $base->input['clm_lead_id']; ?>"/>
 <input type="hidden" name="verifyCardInfo" id="verifyCardInfo" value="<? echo $base->input['verifyCardInfo']; ?>"/>
 <input type="hidden" name="getLeadInfo" id="getLeadInfo" value="false"/>
 <input type="hidden" name="recordStatus" id="recordStatus" value="C"/> 		
 <input type="hidden" name="selOrderType" id="selOrderType" value="<?echo $_REQUEST['selOrderType']?>" /> 		
 <input type="hidden" name="getClientInfo" id="getClientInfo" value='false' /> 
<table border="0" cellspacing="0" align="center" cellpadding="0" width="100%">
	<?
		if($_SESSION['status_msg'] != null && $_SESSION['status_msg'] != ""){?>
	<tr height="20" valign="bottom">
		<td width="100%"><? echo $_SESSION['status_msg']; ?></td>
	</tr>
	<? }
		$_SESSION['status_msg']="";
	?>
	
	<tr valign="top"><td class="subtitle">Change Request</td></tr>
	<?if($base->input['markQuality'] =="true" ){
//<!-- Modified Sandeep 31 Mar -->		
		$qualityButton = "<input type='hidden' value='false' name='markQuality'/><input class='inputBtnMed' type='submit' name='btnMarkQuality' id='btnMarkQuality' value='Quality Check OK' onclick=\"javascript:return markQualityCheck(document.forms[0], '".$popupwindow."');\">&nbsp;";
	}else if($_REQUEST['veripendingstatus']=="verification" || array_key_exists('verifyOrder', $_REQUEST) ){
		$verifyButton =  "<input type='hidden' value='false' name='verifyOrder'/><input class='inputBtnMed' type='submit' name='btnVerifyOrder' id='btnVerifyOrder' value='Order Verified' onclick=\"javascript:return completeOrderVerification(document.forms[0], '".$popupwindow."');\">&nbsp;"; 
		
	}?>	
	<? if($base->input['order_id'] !="" && $base->input['client_id'] !=""){ ?>
		<tr valign="top"><td align="right"><? echo $qualityButton ?><? echo $verifyButton ?><input class="inputBtnMed" type="submit" name="btnUpdateOrder"  value="Update Order" onclick="javascript:return updateNewChangeReqOrder(document.forms[0],'operation','change_request_order');"></td></tr>
	<?}else{?>
		<tr valign="top"><td align="right"><input class="inputBtnMed" type="submit" name="btnCreateNewOrder" value="Create New Order" onclick="javascript:return createNewChangeReqOrder(document.forms[0],'operation','change_request_order');"></td></tr>
//<!-- Modified Sandeep 31 Mar -->		
	<?}?>
<!-- Modified Sandeep 31 Mar -->			
	<tr valign="top"><td><img src="cpos/images/1x1.gif" height="5" /></td></tr>
<!-- Modified Sandeep 31 Mar -->	
	<tr valign="top">
		  <td >
		    <table align="center" width="100%" cellspacing="2" cellpadding="1" class="outerTable" border=0>
 	        <tr>
		       <td class="formLabel" width="15%">Order Type</td>
		       <!-- Modified Sandeep 31 Mar -->
		       <td class="formFieldRequired">
		       <!-- Modified -->
		       		<!--<script>
		       			document.write(renderOrderTypeCombo('ord_ordertype','','inputLong',''));
		       			document.getElementById('ord_ordertype').value="<? echo $clientData['ord_ordertype']; ?>";
		       		</script>
		       		-->
		       		<!-- Modified Sandeep 31 Mar -->
		       		<?
		       			$clientData['ord_ordertype'] = getOrderTypeCode($clientData['ord_ordertype']);
		       			/*
		       			if($clientData['ord_ordertype']=="lease"){
		       				$clientData['ord_ordertype']= LEASE;
		       			}else if($clientData['ord_ordertype']=="buy"){
		       				$clientData['ord_ordertype']= BUY;
		       			}else if($clientData['ord_ordertype']=="changerequest"){
		       				$clientData['ord_ordertype']= 230000000;
		       			}else if($clientData['ord_ordertype']=="other"){
		       				$clientData['ord_ordertype']= 240000000;
		       			}
		       			*/
		       		?>
		       		<!-- Modified -->
		       		<input type="hidden" class="inputLong" id="ord_ordertype" name="ord_ordertype"  value="<? echo $clientData['ord_ordertype']; ?>"/>
		       		<input type="text" readOnly class="inputLong" id="ord_ordertype_name" name="ord_ordertype_name"  value="<? echo getOrderTypeText($clientData['ord_ordertype']); ?>"/>
			   </td> 		 
		       <td class="formLabel" width="15%">Client Number</td>
		       <td class="formFieldRequired" width="35%">
 				<input type="text" name='txt_client_id' class="inputLong" readonly value="<? echo $clientData['client_id']==""?$base->input['client_id']:$clientData['client_id'];?>">&nbsp;
		       </td>
		    </tr>
		    <tr>
		       <td class="formLabel">Captured By</td>
			   <td class="formFieldRequired" width="35%" style=" padding-left: 3px;" >
				<span class="required">*</span>
				<!-- Modified Sandeep 31 Mar -->
			   <?			   		
			   		/*if($userType == "sale"){
			   			if($clientData['ord_order_credit_id']!=""){
			   				$tempList = fetchSalesAgentList("","",false,false,"");
			   				echo "<input type='text' class='inputLong' name='ord_order_credit_id_name' id='ord_order_credit_id_name' value='".$tempList[$clientData['ord_order_credit_id']]."' readOnly />";
			   				echo "<input type='hidden' class='inputLong' name='ord_order_credit_id' id='ord_order_credit_id' value='".$clientData['ord_order_credit_id']."' />";
			   				echo "<script>" .
			   					 "	priceList = updatePriceList(document.forms[0].ord_order_credit_id.value, priceListAll);" .
			   					 "</script>";
			   			}else{
			   				fetchSalesAgentList("ord_order_credit_id", "inputLong", false, true," onchange='javascript:priceList=updatePriceList(this.value, priceListAll);' ");
				   			echo "<script>" .
				   				"	document.forms[0].ord_order_credit_id.value='".$clientData['ord_order_credit_id']."';" .
				   				"	priceList = updatePriceList(document.forms[0].ord_order_credit_id.value, priceListAll);" .
				   				"</script>";
			   			}
			   		}else if($userType == "operation" ){			   			
			   			fetchSalesAgentList("ord_order_credit_id", "inputLong", false, true," onchange='javascript:priceList=updatePriceList(this.value, priceListAll);' ");
			   			echo "<script>" .
			   				"	document.forms[0].ord_order_credit_id.value='".$clientData['ord_order_credit_id']."';" .
			   				"	priceList = updatePriceList(document.forms[0].ord_order_credit_id.value, priceListAll);" .
			   				"</script>";
			   		}else{			   			
						fetchSalesAgentList("ord_order_credit_id", "inputLong", false, true," onchange='javascript:priceList=updatePriceList(this.value, priceListAll);' ");
			   			echo "<script>" .
			   				"	document.forms[0].ord_order_credit_id.value='".$clientData['ord_order_credit_id']."';" .
			   				"	priceList = updatePriceList(document.forms[0].ord_order_credit_id.value, priceListAll);" .
			   				"</script>";
			   		}*/
			   		echo "<input type='text' class='inputLong' name='ord_order_credit_id' id='ord_order_credit_id' value='".$userName."' readOnly />";
			   				
			   	?>
			   <!-- Modified -->
		  		
			   </td> 	
		       <td class="formLabel" >Order Date</td>
		       <td class="formFieldRequired" >
	       			<table border="0" cellspacing ="0" cellpadding="0"><tr valign="top"><td><img src="cpos/images/1x1.gif" height="5px" width="1px"/><br/>
	       			<!-- Modified Sandeep 31 Mar -->
	       			<?
	       				$clientData['ord_order_date']= $clientData['ord_order_date']==""?date("Y-m-d"):$clientData['ord_order_date'];
	       			?>
	       			<!-- Modified -->
					<input type="text" readonly name="ord_order_date" id="ord_order_date" maxlength="10" class="inputLong" value="<? echo $clientData['ord_order_date']?>" onkeydown="javascript: blur()" onclick="javascript: blur()" title="Click on the icon to fill date." />
					</td><td>
				  	<table border="0" cellspacing ="0" cellpadding="0"><tr valign="top"><td colspan="2"><img src="cpos/images/1x1.gif" height="1px" width="1px"/></td></tr>
				  	<tr><td><img name="imMF_1" class="smallImage" src="cpos/images/small-calendar.jpg" border="0" onClick="javascript:show_calendar('frmneworder.ord_order_date');"><!--  <i>(yyyy-mm-dd)</i> --></td><td>
				  	</td></tr></table>
					</td></tr></table>         
		       
			   </td>
		    </tr>
		    <tr>
		       <td class="formLabel">Assigned To</td>
			   <td class="formFieldRequired" width="35%" style=" padding-left: 3px;" >
			<span class="required">*</span>
			  <!-- Modified Sandeep 31 Mar -->	
			   <select name="ord_assigned_to" class="inputLong">
			     <option value="manager">Manager</option>
			    </select>		   
			   <?
			   		//fetchAgentOperationSalesList("ord_assigned_to", "inputLong", false, true," onchange=''");
			   		/*
			   		if($userType == "sale" || $userType == "operation"){
			   			if($base->input['order_id'] !="" && $base->input['client_id'] !=""){			   					
			   				if($base->input['markQuality'] =="true" || $base->input['verifyCardInfo'] =="true" ){
			   					//fetchOperationsList("ord_assigned_to", "inputLong", false, true," onchange=''");
			   					fetchOperationSalesList("ord_assigned_to", "inputLong", false, true," onchange=''");			   				
			   				}else{
			   					$assignedTo = $clientData['ord_assigned_to'];
			   				if( $assignedTo =="")
			   					$assignedTo = $userName;			   				
			   				echo "<input type='text' class='inputLong' id='ord_assigned_to' name='ord_assigned_to' value='".$assignedTo."' readOnly />";
			   				}
			   				
			   			}else{
			   				fetchSalesList("ord_assigned_to", "inputLong", false, true," onchange=''");
			   				echo "<script>	       				       			
		       						document.forms[0].ord_assigned_to.value='".$clientData['ord_assigned_to']." ?>';
		       					</script>";			   				
			   			}
			   		}else{			   					   			
			   			fetchSalesList("ord_assigned_to", "inputLong", false, true," onchange=''");
			   			echo "<script>	       				       			
		       						document.forms[0].ord_assigned_to.value='".$clientData['ord_assigned_to']."';
		       				 </script>";
			   		}
			   		*/
			   ?>	
		       		<!-- Modified -->
			   </td> 	
		       <td class="formLabel" >Prepared By</td>
		       <?
		       		$preparedBy = $clientData['ord_prepared_by_id'];
	   				if( $preparedBy =="")
	   					$preparedBy = $_SESSION['loginid'];
		       ?>
		       <td class="formFieldRequired"  style=" padding-left: 3px;" >
					<span class="required">*</span>
					<input type='text' class='inputLong' id='preparedBy' name='preparedBy' value='<?echo $userName?>' readOnly /><input type="hidden" name="ord_prepared_by_id" id="ord_prepared_by_id" value="<? echo $preparedBy; ?>"/></td>
		    </tr>
		</table><br/>
		</td></tr>
<!-- Modified Sandeep 31 Mar --> 		
		<tr valign="top">
			<td class="heading" width='100%'><table cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td width="30%" class="heading" align="left" style="padding-left:0px; " >Business Information</td></tr></table> 
				</td>
		</tr>
   		<tr valign="top" id="table-business_information">
	  	<td >
		  <table align="center" width="100%" cellspacing="2" cellpadding="1" class="outerTable" border=0>
 	        <tr>
<!-- Modified Sandeep 31 Mar -->  	        
	       <td class="formLabel" width="15%">Legal Name (Merchant)</td>
	       <td class="formFieldRequired" style=" padding-left: 3px;" >
			<span class="required">*</span>
			<input type="text" name="cli_business_text" id="cli_business_text" class="inputLong" maxlength="30"  value="<? echo $clientData['cli_business_text']; ?>"   onkeypress="javascript:return validateValue(this, event, 'ANS');">	        
	       </td>
	       <td class="formLabel" width="15%">DBA Name</td>
	       <td class="formFieldRequired" width="35%" style=" padding-left: 3px;" >
						<span class="required">*</span>
			 <input type="text" name="cli_operating_text" id="cli_operating_text"  class="inputLong" maxlength="30" value="<? echo $clientData['cli_operating_text']; ?>"  onkeypress="javascript:return validateValue(this, event, 'ANS');">
			</td>
<!-- Modified Sandeep 31 Mar --> 			
	     </tr>
		 <tr>
	       <td class="formLabel">Years in Business</td>
	       <td class="formFieldRequired">
        	<input type="text" name="cli_yrs_in_business" id="cli_yrs_in_business" maxlength="4" class="inputLong" value="<? echo $clientData['cli_yrs_in_business'] ?>"   onkeypress="javascript:return validateValue(this, event, 'N');">
	       </td>
	       <td class="formLabel">SIC Code</td>
	       <td class="formFieldRequired" style=" padding-left: 3px;" >
			<span class="required">*</span>
			  <?  $selSICCode=$clientData['cli_sic'];
			  echo fetchSICCodes("cli_sic", "inputLong",$selSICCode);  ?>
			<script>
				document.forms[0].cli_sic.value= "<? echo $clientData['cli_sic'] ?>";
			</script>
	       </td>
	     </tr>
		 <tr>	       
	       <td class="formLabel" width="15%">MCC Code</td>
	       <td class="formFieldRequired" width="35%">
				<select name="cli_mcc" id="cli_mcc" class="inputLong" >
			</select>
			<script>
				
				loadMCCCodes(document.getElementById('cli_mcc'));
				document.forms[0].cli_mcc.value = "<? echo $clientData['cli_mcc'] ?>";
			</script>		       
			</td>
	       <td class="formLabel">TCC Code</td>
	       <td class="formFieldRequired" >
			<select name="cli_tcc" id="cli_tcc" class="inputLong" >
			</select>
			<script>
				
				loadTCCCodes(document.getElementById('cli_tcc'));
				document.forms[0].cli_tcc.value = "<? echo $clientData['cli_tcc'] ?>";
			</script>	       
	       </td>
	     </tr>
	     <tr>       
	       <td class="formLabel">TimeZone</td>
	       <td class="formFieldRequired" style=" padding-left: 3px;" >
			<span class="required">*</span>
	       <script>document.write(renderTimeZonesCombo("cli_timezone_name", "inputLong","cli_timezone"));</script>
	       <input type="hidden" id="cli_timezone" name="cli_timezone"  />
	       <script>
	       		loadTimeZones(document.forms[0].cli_timezone_name);
	       		document.forms[0].cli_timezone.value= "<? echo $clientData['cli_timezone'] ?>";
	       		document.forms[0].cli_timezone_name.value= "<? echo $clientData['cli_timezone_name'] ?>";	       		
	       </script>
		   </td>
	       <td class="formLabel">Ownership</td>
	       <td class="formFieldRequired"  style=" padding-left: 3px;" >
			<span class="required">*</span>
		      <select name="cli_ownership" id="cli_ownership" class="inputLong">
		      </select>
		      <script>
		      	loadOwnership(document.forms[0].cli_ownership);
		      	document.forms[0].cli_ownership.value= "<? echo $clientData['cli_ownership'] ?>";
		      </script>
	       </td>
	       </tr>
		 <tr>  
 		   <td class="formLabel" width="15%">Title</td>
	       <td class="formFieldRequired" width="35%"style=" padding-left: 3px;" >
			<span class="required">*</span>
	         <input type="text" name="billcnttitle" id="billcnttitle" maxlength="" class="inputLong" maxlength="20"  value="<? echo $data->CNT_TITLE?>"   onkeypress="javascript:return validateValue(this, event, 'AS');">
	       </td>
	       <td class="formLabel" width="15%">Language </td>
	       <td class="formFieldRequired" width="35%">
	         <select name="billinglanguage" id="billinglanguage" class="inputLong">
				  <script>
					locationLanguage(document.getElementById('billinglanguage'));
					selectComboValue(document.getElementById("billinglanguage"), "<? echo $data->CNT_LANGUAGE ?>")
				 </script>
	         </select>
	       </td>	      
	    </tr>
		<tr>	
			 <td class="formLabel" width="15%">First Name 
	       		</td>
	       <td class="formFieldRequired" width="35%" style=" padding-left: 3px;" >
			<span class="required">*</span>      	    
	        	<select name="billingnameprefix" id="billingnameprefix" class="inputMin">	         		
	         	</select>
	         	<script>
	         		prefix(document.getElementById('billingnameprefix'));
	         		document.getElementById('billingnameprefix').value="<? echo $data->CNT_NAME_PREFIX; ?>";
	         	</script>	         	
	         	<input type="text" name="billingfirstname" id="billingfirstname" class="inputMed" maxlength="30" style=" width:145px; " value="<? echo $data->CNT_FIRST_NAME?>" onkeypress="javascript:return validateValue(this, event, 'ANS');">
	        </td>        
	       <td class="formLabel" width="15%">Last Name</td>
	       <td class="formFieldRequired" width="35%" align="left">
	       	<input type="text" name="billinglastname" id="billinglastname" class="inputLong" maxlength="30" value="<? echo $data->CNT_LAST_NAME?>"></td>
	       </td>	       
	     </tr>
 	     <tr>
	       <td class="formLabel">E-Mail Address</td>
	       <td class="formFieldRequired" >
	         <input type="text" name="billingemail" id="billingemail" maxlength="50" class="inputLong" maxlength="0" value="<? echo $data->CNT_EMAIL?>" onblur="javascript:checkEmailFormat(this);" />
	       </td>
		   <td class="formLabel">Phone Number</td>
		   <td class="formFieldRequired" style=" padding-left: 3px;" >
			<span class="required">*</span>
			<input type="text" name="billingphonenumber" id="billingphonenumber" class="inputMed" style=" width:117px; " value="<? echo $data->CNT_PHONE_NUMBER?>" onkeypress="javascript:return validateValue(this, event, 'NS');"/>
			<i>(Extn)</i> <input type="text" name="billingphoneextn" id="billingphoneextn"  class="inputMin" style=" width:45px; "  value="<? echo $data->CNT_PHONE_EXTENSION?>" onkeypress="javascript:return validateValue(this, event, 'N');"/>
		   	</td>	       
	     </tr>
 	     <tr>
	       <td class="formLabel">Fax Number</td>
	       <td class="formFieldRequired">
        	<input type="text" name="billingfaxnumber" id="billingfaxnumber" maxlength="25" class="inputLong" value="<? echo $data->CNT_FAX_NUMBER?>" onkeypress="javascript:return validateValue(this, event, 'NS');"/>
	       </td>
			<td class="formLabel" width="15%">Street Name</td>
	       <td class="formFieldRequired" width="35%" style=" padding-left: 3px;" >
			<span class="required">*</span>
	         <input type="text" name="billingstreetname" id="billingstreetname" maxlength="25" class="inputLong" value="<? echo $data->LTN_STREET_NAME?>"/>
	       </td>
	     </tr>
<!--	     
 	     <tr>
	       <td class="formLabel">Street Type</td>
	       <td class="formFieldRequired" >
		    <select name='billingstreettype' id='billingstreettype' class="inputLong">
				 <script>locationStreetType(document.getElementById('billingstreettype'));
				 selectComboValue(document.getElementById("billingstreettype"), "<? echo $data->LTN_STREET_TYPE?>")</script>
			 </select>	        
	       </td>
	       <td class="formLabel">Street Direction</td>
	       <td class="formFieldRequired" >
		   <select name="billingstreetdirection" id="billingstreetdirection" maxlength="20" class="inputLong">
	         <script>locationStreetDirection(document.getElementById('billingstreetdirection'));
					 document.getElementById("billingstreetdirection").value="<? echo $data->LTN_STREET_DIRECTION ?>";</script>
  		  </select>	        
	       </td>
	     </tr>     
 	     <tr>
	       <td class="formLabel">Suite Type</td>
	       <td class="formFieldRequired" >
		    <select name="billingsuitetype" id="billingsuitetype" maxlength="20" class="inputLong">
	         <script>locationSuiteType(document.getElementById('billingsuitetype'));
			 selectComboValue(document.getElementById("billingsuitetype"), "<? echo $data->LTN_SUITE_TYPE ?>")</script>
  		  </select>	         
	       </td>
	       <td class="formLabel">Suite Number</td>
	       <td class="formFieldRequired" >
	         <input type="text" name="billingsuiteno" id="billingsuiteno" maxlength="25" class="inputLong" value="<? echo $data->LTN_SUITE_NUMBER?>"/>
	       </td>
	     </tr>
-->	     
	     <tr>
	       <td class="formLabel" width="15%">P.O.Box</td>	       
	       <td class="formFieldRequired" width="35%">
	         <input type="text" name="billingboxno" id="billingboxno" maxlength="20" class="inputLong" value="<? echo $data->LTN_POSTAL?>"/>
	       </td>
	       <td class="formLabel">City</td>
	       <td class="formFieldRequired" style=" padding-left: 3px;" >
			<span class="required">*</span>
	         <input type="text" name="billingcity" id="billingcity" maxlength="20" class="inputLong" value="<? echo $data->LTN_CITY?>"/>
	       </td>
		</tr>
 	     <tr>	       	     	       	       
	       <td class="formLabel">Province </td>
	       <td class="formFieldRequired" style=" padding-left: 3px;" >
			<span class="required">*</span>
	         <select name="billingstate" id="billingstate" class="inputLong" onchange="taxInfo = billingProvinceChanged(this, true);">
			  <script>loadProvinces(document.getElementById('billingstate'),"<? echo $data->LTN_COUNTRY_CODE ?>");
			 		 document.getElementById("billingstate").value= "<? echo $data->LTN_STATE_CODE ?>";			 		 
			  </script>
			</select>
	       </td>
	       <td class="formLabel">Postal</td>
	       <td class="formFieldRequired" >
	         <input type="text" name="billingpostal" id="billingpostal" maxlength="20" class="inputLong" value="<? echo $data->LTN_POSTAL?>"/>
	       </td>
		</tr>
 	    <tr>
	       <td class="formLabel">Country</td>
	       <td class="formFieldRequired"style=" padding-left: 3px;" >
			<span class="required">*</span>
	         <select name="billingcountry" id="billingcountry" maxlength="20" class="inputLong" onchange="loadProvinces(document.getElementById('billingstate'),this.value);changeTimeZone('cli_timezone_name', 'cli_timezone','billingcountry', 'billingstate');">
	         </select>
	         <script>loadCountries(document.getElementById('billingcountry'));
					 document.getElementById("billingcountry").value = "<? echo $data->LTN_COUNTRY_CODE ?>";
					 taxInfo = billingProvinceChanged(document.getElementById('billingstate'), false);
			 		 //alert(taxInfo['GST']);
			  </script>
	       </td>
	       <td class="formLabel">&nbsp;</td>
	       <td class="formFieldRequired" style=" padding-left: 3px;" >&nbsp;</td>	       
	     </tr>
		</table><br/>
		</td></tr>
<!-- Modified Sandeep 31 Mar --> 		
		<tr valign="top"><td class="heading"><table cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td width="30%" class="heading" align="left" style="padding-left:0px; ">Ownership Information</td><td  align="left">&nbsp;<!--<input type="checkbox" style="" onclick="javascript:toggleDisplay(this.checked,document.getElementById('table-ownership_info'), document.getElementById('table-ownership_more'), document.getElementById('table-ownership_button'), document.getElementById('table-ownership_button_spacer')  );" />--></td></tr></table>
		</td></tr>
		<tr valign="top" id="table-ownership_info" ><td id="ownershipinfotable">
		<table cellspacing="0" cellpadding="0" id="ownershipinfotable-0" width="100%">
		<tr valign="top" width="100%" id="owner-selection-0"><td class='heading'>Owner <input type='checkbox' id="cb-owner-selected-0" name="cb-owner-selected-0" checked onclick="javascript:removeOwnerRow(document.getElementById('ownershipInfoMainTable'),'-0');"/></td></tr>
		<tr valign="top" width="100%" id=""><td>
	<!-- Modified Sandeep 31 Mar -->
		    	
		    	<table align="center" width="100%" cellspacing="2" cellpadding="1" class="outerTable" border=0>
	 	        	<tr>
						<td class="formLabel" width="15%">Principal's Name</td>
				       	<td class="formFieldRequired" width="35%" style=" padding-left: 3px;" >
						<span class="required">*</span>
					         <input type="text" name="own-principalname-0" id="own-principalname-0" maxlength="20" class="inputLong"   onkeypress="javascript:return validateValue(this, event, 'ANS');" >
					    </td>						
					   <td class="formLabel" width="15%">Title</td>
					    <td class="formFieldRequired" width="35%" style=" padding-left: 3px;" >
						<span class="required">*</span>
							<input type="text" name="own-ownershiptitle-0" id="own-ownershiptitle-0" maxlength="" class="inputLong"   onkeypress="javascript:return validateValue(this, event, 'AS');"> 	       
						</td>
				     </tr>
					 <tr>
						<td class="formLabel">%Ownership</td>
						<td class="formFieldRequired" style=" padding-left: 3px;" >
						<span class="required">*</span>
							<input type="text" name='own-ownershippercent-0' id="own-ownershippercent-0" class="inputLong"   onkeypress="javascript:return validateValue(this, event, 'N');">
						</td>
						<td class="formLabel">SIN</td>
						<td class="formFieldRequired" style=" padding-left: 3px;" >
						<span class="required">*</span>
							<input type="text" name="own-ownershipsin-0" id="own-ownershipsin-0" maxlength="25" class="inputLong"   onkeypress="javascript:return validateValue(this, event, 'N');"> 
						</td>
				     </tr>
					  <tr>
					 	<td class="formLabel">Date of Birth</td>
				        <td class="formFieldRequired"  style=" padding-left: 3px;" >
							
					        <table border="0" cellspacing ="0" cellpadding="0"><tr valign="top"><td><img src="cpos/images/1x1.gif" height="5px" width="1px"/><br/>			       			
							<span class="required">* </span><input type="text" readonly name="own-ownerdob-0" id="own-ownerdob-0" maxlength="10" class="inputLong" onkeydown="javascript: blur()" onclick="javascript: blur()" title="Click on the icon to fill date." />
							</td><td>
						  	<table border="0" cellspacing ="0" cellpadding="0"><tr valign="top"><td colspan="2"><img src="cpos/images/1x1.gif" height="1px" width="1px"/></td></tr>
						  	<script>
						  		var str = "frmneworder.elements['own-ownerdob-0']";						  		
						  	</script>
						  	<tr><td><img name="imMF_2" class="smallImage" src="cpos/images/small-calendar.jpg" border="0" onClick="javascript:show_calendar(str);"><!--  <i>(yyyy-mm-dd)</i> --></td><td>
						  	</td></tr></table>
							</td></tr></table>
				        </td>
				        <td class="formLabel">Home Address (Street)</td>
				        <td class="formFieldRequired"  style=" padding-left: 3px;" >
							<span class="required">*</span>
				         	<input type="text" name='own-ownershipstreet-0' id='own-ownershipstreet-0' class="inputLong" maxlength="50" >
				        </td>
				     </tr>
					 <tr>
					  <td class="formLabel">Home Phone</td>
				       <td class="formFieldRequired" style=" padding-left: 3px;" >
						<span class="required">*</span>
				         <input type="text" name="own-ownershipphone-0" id="own-ownershipphone-0" maxlength="20" class="inputLong"   onkeypress="javascript:return validateValue(this, event, 'NS');" />
				       </td>
				       <td class="formLabel">City</td>
				       <td class="formFieldRequired" style=" padding-left: 3px;" >
						<span class="required">*</span>
			        	 <input type="text" name='own-ownershipcity-0' id='own-ownershipcity-0' class="inputLong"   onkeypress="javascript:return validateValue(this, event, 'AS');" >
				       </td>
				     </tr>
					 <tr>
					   <td class="formLabel">Postal</td>
				       <td class="formFieldRequired" style=" padding-left: 3px;" >
						<span class="required">*</span>
				         <input type="text" name="own-ownershippostal-0" id="own-ownershippostal-0" maxlength="20" class="inputLong" />
				       </td>		       
					   <td class="formLabel">Province</td>
				       <td class="formFieldRequired" style=" padding-left: 3px;" >
						<span class="required">*</span>
				         <select name="own-ownershipstate-0" id="own-ownershipstate-0" class="inputLong" >			         
						  <script>loadProvinces(document.getElementById('own-ownershipstate-0'),'');
						 </script>
						</select>
				       </td>
					 </tr>
					 <tr>
				       <td class="formLabel">Country</td>
				       <td class="formFieldRequired" style=" padding-left: 3px;" >
						<span class="required">*</span>
						<select name="own-ownershipcountry-0" id="own-ownershipcountry-0" class="inputLong" onchange="javascript:loadProvinces(document.getElementById('own-ownershipstate-0'),this.value, '');">
				       <script>loadCountries(document.getElementById('own-ownershipcountry-0'));</script>
				       </select>			       
				       </td>
				       <td class="formLabel">&nbsp;</td>
				       <td class="formFieldRequired" >&nbsp;</td>				       
				     </tr>
				 </table>
<!-- Modified Sandeep 31 Mar -->				 
		    </td></tr> 
		   <tr valign="top"><td><img src="cpos/images/1x1.gif" height="5" /></td></tr>
		</table>		
		<tr valign="top" id="table-ownership_more" ><td id="ownershipInfoMainTable" >
		<!-- Rows Go here -->
		</td></tr>				
	<? echo $ownerShipInfo; ?>
	<tr valign="top" id="table-ownership_button" ><td align="right"><input type="button" value="Add Owner" class="inputBtnMed" onclick="javascript:addOwnerRow(document.getElementById('ownershipInfoMainTable'),document.getElementById('ownershipinfotable').innerHTML);"/></td></tr>	
	<tr valign="top" id="table-ownership_spacer" ><td width="100%"><img src="cpos/images/1x1.gif" height="10" border="0"></td></tr>
	<tr id="table-term_features_title" ><td class="heading" >Terminal Features</td></tr>
	<tr valign="top"  id="table-term_features"><td>
		<table align="center" width="100%" cellspacing="2" cellpadding="1" class="outerTable" border=0>
		<tr>
	       <td class="formLabel" width="15%">Phone Cards</td>
	       <td class="formFieldRequired" width="35%" >
	       		<input type="checkbox" name="phonecards" id="phonecards" <? echo ($termFeatures['spd_services_phone_cards']=='Y'?"checked":""); ?> >		      
			</td>
	       <td class="formLabel" width="15%" >Tipping</td>
	       <td class="formFieldRequired" width="35%" >
				<input type="checkbox" name="tipping" id="tipping" <? echo ($termFeatures['spd_services_tips']=='Y'?"checked":""); ?> >
		   </td>
		</tr> 
		<tr>
	       <td class="formLabel" width="15%">Employee Reports</td>
	       <td class="formFieldRequired" width="35%" >
	       		<input type="checkbox" name="empreports" id="empreports" <? echo ($termFeatures['spd_services_emp_reports']=='Y'?"checked":""); ?> >		      
			</td>
	       <td class="formLabel" width="15%" >Gift Cards</td>
	       <td class="formFieldRequired" width="35%" >
				<input type="checkbox" name="giftcards" id="giftcards" <? echo ($termFeatures['spd_services_new_3']=='Y'?"checked":""); ?> >
		   </td>
		</tr> 
		</table>
	</td></tr>  
<!-- Modified Sandeep 31 Mar --> 
	<tr valign="top"><td class="heading" ><table cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td width="30%" class="heading" align="left" style="padding-left:0px; "><a id="processing-anchor" name="processing-anchor" style=" text-decoration:none; ">&nbsp;</a>Processing Information</td><td  align="left">&nbsp;<!--<input type="checkbox" name="cb_showprocessinginfo" id="cb_showprocessinginfo" <? echo ($_SESSION[SER_SUMMARY]!=""?" checked ":" "); ?> onclick="javascript:toggleDisplay(this.checked, document.getElementById('table-processing_info'), document.getElementById('table-processing_info_button'));" title="Click Here To Expand">--></td></tr></table>
<!-- Modified Sandeep-->
	</td></tr>
	<tr valign="top" id="table-processing_info"  ><td> 	
	   <table align="center" width="100%" cellspacing="2" cellpadding="1" class="outerTable" border=0 id="showprocessinginfo1" >
		<tr valign="top">
			<td align=left class="heading" width="50%" colspan="2">List of Payment Processing Fees</td>
		</tr>
		<tr valign="top"><td align=left width="50%" colspan="2" id="processingInfoMainTable">		
			</td>
		</tr>
		</table>	
 </td></tr> 
 <tr valign="top" id="table-equip_details_totals_spacer_3"><td><img src="cpos/images/1x1.gif" height="5" /></td></tr>
 <tr valign="top" id="table-processing_info_button"><td align="right"><input type="button" value="Add Services" class="inputBtnMed" onclick="javascript:openBrWindow('<?echo $popupwindow?>add_services.php','AddServices','width=390,height=610,scrollbars=1');"/></td></tr>
 <script>
 <? echo $processingInfo; ?>
 </script>
 <!-- Modified Sandeep 31 Mar --> 
 <?
		if($base->input['verifyCardInfo'] =="true" ){
			echo "<script>location.hash='processing-anchor'</script>";
		}
 ?>
 <!-- Modified Sandeep-->
 <tr valign="top"><td class="heading" width='100%'>Financial Information</td></tr>
 <tr><td width="100%" class="heading">Fee Applied</td></tr>
  <tr valign="top" id="table-Fee">
    <td >
	  <table align="center" width="100%" cellspacing="2" cellpadding="1" class="outerTable" border=0>		  
 	    <tr>
	       <td class="formLabel" width="15%">Total Fee</td>
	       <td class="formFieldRequired" style=" padding-left: 3px;" width="35%" >
			<span class="required">*</span>
	         <input type="text" name="grandtotal" id="grandtotal"  class="inputLong"  value="<? echo $equipmentTotalsData ['ord_grand_total']; ?>"  onkeypress="javascript:return validateValue(this, event, 'ND');">
	       </td>
	       <td class="formLabel" width="15%">&nbsp;</td>
	       <td class="formFieldRequired" width="35%" >&nbsp;</td>
	     </tr>
 		</table>
 	</td>
 </tr>		
 <tr><td width="100%" class="heading">Deposit Account</td></tr>
  <tr valign="top" id="table-financial_information_1"><td >
		  <table align="center" width="100%" cellspacing="2" cellpadding="1" class="outerTable" border=0>		  
 	      <tr>
	       <td class="formLabel" width="15%">Account Num</td>
	       <td class="formFieldRequired" style=" padding-left: 3px;" width="35%" >
			<span class="required">*</span>
	         <input type="text" name="account_num_1" id="account_num_1"  maxlength='16' class="inputLong"  value="<? echo $finData['cpd_account_number']; ?>"  onkeypress="javascript:return validateValue(this, event, 'AN');">
	       </td>
	       <td class="formLabel" width="15%">Route Num</td>
	       <td class="formFieldRequired" width="35%" style=" padding-left: 3px;">
			<span class="required">*</span>
				<input type="text" name="route_num_1" id="route_num_1" maxlength='3' class="inputLong"  value="<? echo $finData['cpd_route_number']; ?>"  onkeypress="javascript:return validateValue(this, event, 'AN');"> 
			</td>
	     </tr>
	     <tr>
	       <td class="formLabel" width="15%">Transit Num</td>
	       <td class="formFieldRequired" style=" padding-left: 3px;" width="35%" >
			<span class="required">*</span>
	         <input type="text" name="transit_num_1" id="transit_num_1"  maxlength='5' class="inputLong"  value="<? echo $finData['cpd_transit_number']; ?>"  onkeypress="javascript:return validateValue(this, event, 'AN');"> 
	       </td>
	       <td class="formLabel" width="15%">&nbsp;</td>
	       <td class="formFieldRequired" width="35%">&nbsp;</td>
	     </tr>
	     </table>
</td></tr>
<?
	if( trim($finData['dcd_merch_account_number']) !="" ||
		trim($finData['dcd_merch_cheque']) !="" ||
		trim($finData['dcd_merch_transit_number']) !="" ){
			$checkedScript = " document.getElementById('cb-use_diff_billing_account').checked=true;\ntoggleDisplay(true,document.getElementById('table-financial_information_2'));\n";
		}
?>
 <tr><td width="100%" class="heading"><table cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td width="30%" class="heading" align="left" style="padding-left:0px; ">Billing Account</td><td  align="left"><input id="cb-use_diff_billing_account" name="cb-use_diff_billing_account" type="checkbox" style="" onclick="javascript:toggleDisplay(this.checked,document.getElementById('table-financial_information_2'));" <? echo $checked ; ?> /></td></tr></table></td></tr>
<tr valign="top" id="table-financial_information_2" style=" display:none; "><td >
		  <table align="center" width="100%" cellspacing="2" cellpadding="1" class="outerTable" border=0>		  
 	      <tr>
	       <td class="formLabel" width="15%">Account Num</td>
	       <td class="formFieldRequired"  style=" padding-left: 3px;">
			<span class="required">*</span>
	         <input type="text" name="account_num_2" id="account_num_2"  maxlength='16' class="inputLong"  value="<? echo $finData['dcd_merch_account_number']; ?>"  onkeypress="javascript:return validateValue(this, event, 'AN');">
	       </td>
	       <td class="formLabel" width="15%">Route Num</td>
	       <td class="formFieldRequired" width="35%"  style=" padding-left: 3px;">
			<span class="required">*</span>
				<input type="text" name="route_num_2" id="route_num_2"  maxlength='3' class="inputLong"  value="<? echo $finData['dcd_merch_cheque']; ?>"  onkeypress="javascript:return validateValue(this, event, 'AN');">	       
			</td>
	     </tr>
	     <tr>
	       <td class="formLabel" width="15%">Transit Num</td>
	       <td class="formFieldRequired" width="35%"  style=" padding-left: 3px;">
			<span class="required">*</span>			
	         <input type="text" name="transit_num_2" id="transit_num_2"  maxlength='5' class="inputLong"  value="<? echo $finData['dcd_merch_transit_number']; ?>"  onkeypress="javascript:return validateValue(this, event, 'AN');">
	       </td>
	       <td class="formLabel" width="15%">&nbsp;</td>
	       <td class="formFieldRequired" width="35%">&nbsp;</td>
	     </tr>
	     </table>
</td></tr>
<script>
<? echo $checkedScript; ?>
</script>
<?
if($deliviryData->CNT_FIRST_NAME != "" || $deliviryData->CNT_LAST_NAME !="" ){
	$deliveryChecked = "checked";	
}
?>
<!-- Modified Sandeep 31 Mar --> 
<!-- ---------------------Delivery----------------------- -->
 	<tr valign="top"><td class="heading"><table cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td width="30%" class="heading" align="left" style="padding-left:0px; ">Delivery Information</td><td  align="left"><input type="checkbox" style="" name="chk_delivery" <?echo $deliveryChecked; ?> onclick="javascript:toggleDisplay(this.checked,document.getElementById('table-del_contact_info'));" /></td></tr></table>
 	</td></tr>	
	<tr valign="top" id="table-del_contact_info" style=" <? echo $deliveryChecked==""?"display:none":"" ; ?>"><td><!--display:none -->
		  <table align="center" width="100%" cellspacing="2" cellpadding="1" class="outerTable" border=0>
		  <tr>  
 		   <td class="formLabel" width="15%">Title</td>
	       <td class="formFieldRequired" width="35%"style=" padding-left: 3px;" >
			<span class="required">*</span>
	         <input type="text" name="deliverytitle" id="deliverytitle" maxlength="" class="inputLong"  value="<? echo $deliviryData->CNT_TITLE?>">
	       </td>
	        <td class="formLabel" width="15%">Language </td>
	       <td class="formFieldRequired" width="35%">
	         <select name="deliverylanguage" id="deliverylanguage" class="inputLong">
		       <script>
					locationLanguage(document.getElementById('deliverylanguage'));
					document.getElementById("deliverylanguage").value= "<? echo $deliviryData->CNT_LANGUAGE ?>";
			   </script>
	         </select>
	       </td>   
	    </tr>	     
 	     <tr>
 	     <td class="formLabel" width="15%">First Name 
	       		</td>
	       <td class="formFieldRequired" width="35%" style=" padding-left: 3px;" >
			<span class="required">*</span>      	    
	        	<select name="deliverynameprefix" id="deliverynameprefix" class="inputMin">
	         	</select>
	         	<script>
	         		prefix(document.getElementById('deliverynameprefix'));
	         		document.getElementById('deliverynameprefix').value="<? echo $deliviryData->CNT_NAME_PREFIX; ?>";
	         	</script>	  
	         	<input type="text" name="deliveryfirstname" id="deliveryfirstname" class="inputMed" style=" width:145px; " value="<? echo $deliviryData->CNT_FIRST_NAME?>"   onkeypress="javascript:return validateValue(this, event, 'ANS');">
	        </td>
	        <td class="formLabel" width="15%">Last Name</td>
	       <td class="formFieldRequired" width="35%" align="left">
	       	<input type="text" name="deliverylastname" id="deliverylastname" class="inputLong" value="<? echo $deliviryData->CNT_LAST_NAME?>"   onkeypress="javascript:return validateValue(this, event, 'AN');"></td>
	       </td>
	      
	     </tr>
 	     <tr>
	       <td class="formLabel">E-Mail Address</td>
	       <td class="formFieldRequired" >
	         <input type="text" name="deliveryemail" id="deliveryemail" maxlength="" class="inputLong" value="<? echo $deliviryData->CNT_EMAIL?>" onblur="javascript:checkEmailFormat(this);"/>
	       </td>
			<td class="formLabel">Phone Number</td>
		   <td class="formFieldRequired" style=" padding-left: 3px;" >
			<span class="required">*</span>
			<input type="text" name="deliveryphonenumber" id="deliveryphonenumber" maxlength="25" class="inputMed" value="<? echo $deliviryData->CNT_PHONE_NUMBER?>"  onkeypress="javascript:return validateValue(this, event, 'NS');"/>
			<i>(Extn)</i> <input type="text" name="deliveryphoneextn" id="deliveryphoneextn" maxlength="25" class="inputMin" value="<? echo $deliviryData->CNT_PHONE_EXTENSION?>"  onkeypress="javascript:return validateValue(this, event, 'N');" />
		   </td>
	     </tr>
 	     <tr>
	       <td class="formLabel">Fax Number</td>
	       <td class="formFieldRequired">
        	<input type="text" name="deliveryfaxnumber" id="deliveryfaxnumber" maxlength="" class="inputLong" value="<? echo $deliviryData->CNT_FAX_NUMBER?>"  onkeypress="javascript:return validateValue(this, event, 'NS');"/>
	       </td>
		   
		   <td class="formLabel" width="15%">Street Name</td>
	       <td class="formFieldRequired" width="35%"style=" padding-left: 3px;" >
			<span class="required">*</span>
	         <input type="text" name="deliverystreetname" id="deliverystreetname" maxlength="25" class="inputLong" value="<? echo $deliviryData->LTN_STREET_NAME?>"/>
	       </td>			
	     </tr>
 	     <tr>
	       <td class="formLabel">Street Type</td>
	       <td class="formFieldRequired" >	         
			<select name='deliverystreettype' id='deliverystreettype' class="inputLong">
				 <script>locationStreetType(document.getElementById('deliverystreettype'));
						 document.getElementById("deliverystreettype").value="<? echo $deliviryData->LTN_STREET_TYPE?>";</script>
			 </select>
	       </td>
	       <td class="formLabel">Street Direction</td>
	       <td class="formFieldRequired" >
		     <select name="deliverystreetdirection" id="deliverystreetdirection" maxlength="20" class="inputLong">
	         <script>locationStreetDirection(document.getElementById('deliverystreetdirection'));
					 document.getElementById("deliverystreetdirection").value="<? echo $deliviryData->LTN_STREET_DIRECTION ?>";</script>
  		  </select>	        
	       </td>
	     </tr>
 	     <tr>
	       <td class="formLabel">Suite Type</td>
	       <td class="formFieldRequired" >
		   <select name="deliverysuitetype" id="deliverysuitetype" maxlength="20" class="inputLong">
	         <script>locationSuiteType(document.getElementById('deliverysuitetype'));
					 document.getElementById("deliverysuitetype").value="<? echo $deliviryData->LTN_SUITE_TYPE ?>";
			</script>
  		  </select>	        
	       </td>
	       <td class="formLabel">Suite Number</td>
	       <td class="formFieldRequired" >
	         <input type="text" name="deliverysuiteno" id="deliverysuiteno" maxlength="25" class="inputLong" value="<? echo $deliviryData->LTN_SUITE_NUMBER?>"/>
	       </td>
	     </tr>
 	     <tr>
	       <td class="formLabel" width="15%">P.O.Box</td>
	       <td class="formFieldRequired" width="35%">
	         <input type="text" name="deliveryboxno" id="deliveryboxno" maxlength="20" class="inputLong" value="<? echo $deliviryData->LTN_POSTAL?> "/>
	       </td>	      
		   <td class="formLabel">City</td>
	       <td class="formFieldRequired" style=" padding-left: 3px;" >
			<span class="required">*</span>
	         <input type="text" name="deliverycity" id="deliverycity" maxlength="20" class="inputLong" value="<? echo $deliviryData->LTN_CITY?> "  onkeypress="javascript:return validateValue(this, event, 'ANS');"/>
	       </td>
	     </tr>
 	     <tr>
	      <td class="formLabel">Province </td>
	       <td class="formFieldRequired" style=" padding-left: 3px;" >
			<span class="required">*</span>
	         <select name="deliverystate" id="deliverystate" class="inputLong" >
			  <script>loadProvinces(document.getElementById('deliverystate'),"<? echo $deliviryData->LTN_COUNTRY_CODE ?>");
			 		 document.getElementById("deliverystate").value= "<? echo $deliviryData->LTN_STATE_CODE ?>";</script>
			</select>
	       </td>
			<td class="formLabel">Postal</td>
	       <td class="formFieldRequired" style=" padding-left: 3px;" >
			<span class="required">*</span>
	         <input type="text" name="deliverypostal" id="deliverypostal" maxlength="20" class="inputLong" value="<? echo $deliviryData->LTN_POSTAL?> "/>
	       </td>
	     </tr>	    
 	     <tr>
	       <td class="formLabel">Country</td>
	       <td class="formFieldRequired"style=" padding-left: 3px;" >
			<span class="required">*</span>
	         <select name="deliverycountry" id="deliverycountry" maxlength="20" class="inputLong" onchange="loadProvinces(document.getElementById('deliverystate'),this.value);">
	         </select>
	         <script>loadCountries(document.getElementById('deliverycountry'));
					 document.getElementById("deliverycountry").value= "<? echo $deliviryData->LTN_COUNTRY_CODE ?>";
			 </script>
	       </td>	       
	     </tr>
		</table>
	</td></tr>
<!-- Modified Sandeep 31 Mar --> 
	<? $commCheck = ( ($commData['com_comm_type_dial_up'] != "" || $commData['com_comm_type_tcpip'] != "" || $commData['com_comm_type_cellular'] != "" || $commData['com_comm_type_wireless'] != "" )?"checked":""); ?>
 <tr valign="top"><td class="heading"><table cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td width="30%" class="heading" align="left" style="padding-left:0px; ">Communications</td><td  align="left"><input type="checkbox" style="" <? echo $commCheck ?> onclick="javascript:toggleDisplay(this.checked,document.getElementById('table-communication_details'));" /></td></tr></table>
	</td></tr>
	<tr id="table-communication_details" <? echo ($commCheck== ""?'style=" display:none; "':''); ?> ><td>
	<table align='center' width="100%" border="0" cellspacing="2" cellpadding="1" class="outerTable" >
	<!--Dial up -->
	   <tr><td class="heading">Dial Up<span style=" padding-left: 48px; ">
	   			<input type="checkbox" <? echo ($commData['com_comm_type_dial_up'] != ""?"checked":"") ?> name="cb_showdialupdetail"  id="cb_showdialupdetail" onclick="javascript:toggleDisplay(document.forms[0].cb_showdialupdetail.checked,document.getElementById('dialupdetailstable'));" title="Click Here To Expand"></span></td></tr>
				<tr valign="top" id="dialupdetailstable"><td>
					<table width="100%" border="0" cellspacing="2" cellpadding="1" class="outerTable" >
						<tr>
							<td  class="formLabel" width='15%'>Tel. Sys. Provider</td>
							<td  class="formFieldRequired" width='35%'>
							<select id="com_tel_system_provider" name="com_tel_system_provider" class="inputLong"></select>
							<script>
									loadTelSysProviders(document.getElementById('com_tel_system_provider'));
									document.forms[0].com_tel_system_provider.value="<? echo $commData['com_tel_system_provider']; ?>";
							</script>
							</td>							
							<td  class="formLabel" width='15%'>Call Waiting</td>
							<td  class="formFieldRequired" width='35%'><input type="text" id="com_call_waiting" name="com_call_waiting"  value="<? echo $commData['com_call_waiting']; ?>"  class="inputLong"  onkeypress="javascript:return validateValue(this, event, 'A');" /></td>
						</tr>
						<tr>
							<td  class="formLabel" width='15%'>Dial Prefix</td>
							<td  class="formFieldRequired" width='35%'><input type="text" id="com_outside_line" name="com_outside_line"   value="<? echo $commData['com_outside_line']; ?>"   class="inputLong"  onkeypress="javascript:return validateValue(this, event, 'N');" /></td>
							<td  class="formLabel" width='15%'>Call Forwarding</td>
							<td  class="formFieldRequired" width='35%'><input type="text" id="com_call_forwarding" name="com_call_forwarding"  value="<? echo $commData['com_call_forwarding']; ?>"  class="inputLong"  onkeypress="javascript:return validateValue(this, event, 'A');" /></td>
						</tr>
					</table>
				</td></tr>
		</td></tr>
		
		<!--TCP IP-->
		 <tr><td class="heading">TCP / IP<span style=" padding-left: 40px; ">
	   			<input type="checkbox" <? echo ($commData['com_comm_type_tcpip'] != ""?"checked":"") ?> name="cb_showtcpipdetail" id="cb_showtcpipdetail" onclick="javascript:toggleDisplay(document.forms[0].cb_showtcpipdetail.checked,document.getElementById('tcpipdetailstable'));" title="Click Here To Expand"></span></td></tr>
				<tr valign="top" id="tcpipdetailstable"><td>
					<table width="100%" border="0" cellspacing="2" cellpadding="1" class="outerTable" >
						<tr>
							<td  class="formLabel" width='15%'>Is This a Dedicated Line ?</td>
							<td  class="formFieldRequired" width='35%'><select id="com_dedicated_line" name="com_dedicated_line"  class="inputLong" ><option value="Y">Yes</option><option value="N">No</option></select>
							<script>
								document.forms[0].com_dedicated_line.value="<? echo $commData['com_dedicated_line']; ?>";
							</script>
							</td>
							<td  class="formLabel" width='15%'>ISP</td>
							<td  class="formFieldRequired" width='35%'>
							<select id="com_tcpip_isp" name="com_tcpip_isp" class="inputLong" >
							<script>
									loadISPList(document.getElementById('com_tcpip_isp'));
							</script>	
							</select> 
							<script>
									//alert(document.forms[0].com_tcpip_isp.options[2].value);							
									document.forms[0].com_tcpip_isp.value="<? echo $commData['com_tcpip_isp']; ?>";
							</script>						
							</td>
						</tr>
						<tr>
							<td  class="formLabel" width='15%'>Static\Dynamic</td>
							<td  class="formFieldRequired" width='35%'>
							<select id="com_ip_type" name="com_ip_type" class="inputLong" >
								<option value="Static">Static</option>
								<option value="Dynamic">Dynamic</option>
							</select>
							<script>
									document.forms[0].com_ip_type.value="<? echo $commData['com_ip_type']; ?>";
							</script>	
							</td>
							<td  class="formLabel" width='15%'>&nbsp;</td>
							<td  class="formFieldRequired" width='35%'>&nbsp;</td>
						</tr>						
					</table>
				</td></tr>
		</td></tr>
		
		<!-- Cellular -->
		 <tr><td class="heading">Cellular<span style=" padding-left: 44px; ">
	   			<input type="checkbox" <? echo ($commData['com_comm_type_cellular'] != ""?"checked":"") ?> id="cb_showmobiledetail" name="cb_showmobiledetail" onclick="javascript:toggleDisplay(document.forms[0].cb_showmobiledetail.checked,document.getElementById('mobiledetailstable'));" title="Click Here To Expand"></span></td></tr>
				<tr valign="top" id="mobiledetailstable"><td>
					<table width="100%" border="0" cellspacing="2" cellpadding="1" class="outerTable" >
						<tr>
							<td  class="formLabel" width='15%'>Mobile Provider</td>
							<td  class="formFieldRequired" width='35%'>
							<select id="com_cellular_provider" name="com_cellular_provider" class="inputLong" />
							<script>
									loadCellOperatorList(document.getElementById('com_cellular_provider'));
									document.forms[0].com_cellular_provider.value="<? echo $commData['com_cellular_provider']; ?>";
							</script>
							</td>
							<td  class="formLabel" width='15%'>&nbsp;</td>
							<td  class="formFieldRequired" width='35%'>&nbsp;</td>
						</tr>										
					</table>
				</td></tr>
		</td></tr>	
		
		<!--CordLess-->
		<tr><td class="heading">Cordless<span style=" padding-left: 38px; ">
	   			<input type="checkbox" <? echo ($commData['com_comm_type_wireless'] != ""?"checked":"") ?> name="cb_showcordlessdetail" id="cb_showcordlessdetail" onclick="" title=""></span></td></tr>	   							
		</td></tr>					
	</table>	
	</td></tr>
	<tr valign="top"><td><img src="cpos/images/1x1.gif" height="5" /></td></tr>
	<? if($base->input['order_id'] !="" && $base->input['client_id'] !=""){ ?>
		<tr valign="top"><td align="right"><? echo $qualityButton ?><input class="inputBtnMed" type="submit" name="btnUpdateOrder"  value="Update Order" onclick="javascript:return updateNewChangeReqOrder(document.forms[0],'operation','change_request_order');"></td></tr>
	<?}else{?>
		<tr valign="top"><td align="right"><input class="inputBtnMed" type="submit" name="btnCreateNewOrder" value="Create New Order" onclick="javascript:return createNewChangeReqOrder(document.forms[0],'operation','change_request_order');"></td></tr>
	<?}?>		
</table>

<input type='hidden' value="<? echo $base->input['order_id']?>" name="order_id" id="order_id">
<input type='hidden' value="<? echo $base->input['client_id']?>" name="client_id" id="client_id">
<!--<input type="hidden" value="<? echo $base->input['formaction']?>" name="querytype">-->

 
</form>
<script>
<? echo $script; ?>
//onload script
//document.forms[0].shippingnotes.value = "<temp>"+document.getElementById('equipmentMainTable').innerHTML+"</temp>";
toggleDisplay(document.forms[0].cb_showdialupdetail.checked,document.getElementById('dialupdetailstable'));
toggleDisplay(document.forms[0].cb_showtcpipdetail.checked,document.getElementById('tcpipdetailstable'));
toggleDisplay(document.forms[0].cb_showmobiledetail.checked,document.getElementById('mobiledetailstable'));
document.getElementById('cb-owner-selected-0').style.display ='none';
//document.getElementById('cb-equipment-selected-0').style.display ='none';


loadDefaultCountry('billingcountry', 'billingstate');
loadDefaultCountry('deliverycountry', 'deliverystate');
loadDefaultCountry('own-ownershipcountry-0', 'own-ownershipstate-0');
if(document.forms[0].cli_timezone.value == ""){
 	//Set default timezone
	defaultTimeZone('cli_timezone_name', 'cli_timezone','billingcountry', 'billingstate');
 }


</script>
 
