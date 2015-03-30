<?php

$PROD_LIST = "product_list";
$LEAD_MANAGER_LIST = "lead_manager_list";
$SALES_AGENT_LIST = "sales_agent_list";
$OPERATIONS_LIST = "operations_list";
$SALES_LIST = "sales_list";
$SICCODE_LIST = "sic_code_list";
$MCCCODE_LIST = "mcc_code_list";
$TCCCODE_LIST = "tcc_code_list";
$TAXES_LIST = "tax_list";
$ORDER_STATUS_LIST = "order_status_list";

function getNextStatusString($oldStatus, $orderStatus, $operator="OR"){
	$oldStatus = trim($oldStatus);
	$orderStatus = trim($orderStatus);
	$orderStatusList = getOrderStatusList();		
	$mask = $orderStatusList[$orderStatus]['mask'];
	//var_dump($orderStatusList);
	//echo "#@$@#$@ ".$orderStatus;
	$mask = trim($mask);		
	$mask = chunk_split($mask, 1, " ");
	$oldStatus = chunk_split($oldStatus, 1, " ");
	$mask = explode(' ', $mask, strlen($oldStatus)+1);
	$mask[count($mask)-1]="";
	$oldStatus = explode(' ', $oldStatus);
	$strBuffer = "";
	
	foreach($mask as $index=>$bin){
		if(count($oldStatus)-2<$index)break;
		if($bin!= "0" && $bin!= "1" )continue;
		if(trim(strtoupper($operator)) == "OR"){
			$strBuffer .= ($bin==1||$oldStatus[$index]==1?"1":"0" );
		}else{
			$strBuffer .= ($bin==1&&$oldStatus[$index]==1?"1":"0" );
		}			
	}
	return  $strBuffer;
}	

/*-------This function is last updated on 4 April Modified Ver is commented Below----*/
	function fetchProductList($name, $class, $extraOptions=false, $onchange, $writeCombo=true, $termList = false){
		global $zetadb;
		global $PROD_LIST;	
		$prod_list = $_SESSION['$PROD_LIST'];
		if($prod_list == null || sizeof($prod_list) <1){
			$select_qry = "SELECT cps_prod_id, cps_prod_name from ".TBL_ORDER_PRODUCT_SERVICE." WHERE active = 'Y' ORDER BY cps_prod_name";
			$result = $zetadb->Execute($select_qry);
	
			while($data = $result->FetchRow()){
					$prod_list[$data['cps_prod_id']]= $data['cps_prod_name'];
			}
	
			$_SESSION['$PROD_LIST']=$prod_list;
		}		
		
		if($writeCombo){
			$tempList = $prod_list;
			if($termList){
				$tempList = array();
				foreach($prod_list as $id=>$termname){
					if(array_key_exists($id, $termList)){
						$tempList[$id]=$termname;
					}
				}
			}
			
			return writecombo($tempList, $name,$extraOptions,"", 0, $onchange ,"class=".$class,"");
		}
		return "";
	}
	
	/*	Sandeep is working  on it 5th April
	 * 
	 * function fetchProductList($name, $class, $extraOptions=false, $onchange, $writeCombo=true, $termList = false){
		global $zetadb;
		global $PROD_LIST;	
		$prod_list = $_SESSION['$PROD_LIST'];
		if($prod_list == null || sizeof($prod_list) <1){
			$select_qry = "SELECT DISTINCT cps_prod_id, cps_prod_name from ".TBL_TRANS_DEVICE_ASSIGNMENT." AS DVA". 
							" LEFT JOIN ".TBL_ORDER_PRODUCT_SERVICE." PROD ON cps_prod_id=dva_product_id and PROD.active='Y' ".
							" WHERE dva_status='".TERM_AVAILABLE."' and DVA.active='Y' AND COALESCE(cps_prod_id,'NULL')!='NULL' ORDER BY cps_prod_name";
							
//			echo "$select_qry";
			$result = $zetadb->Execute($select_qry);
	
			while($data = $result->FetchRow()){
					$prod_list[$data['cps_prod_id']]= $data['cps_prod_name'];
			}
	
			$_SESSION['$PROD_LIST']=$prod_list;
		}		
		
		if($writeCombo){
			$tempList = $prod_list;
			if($termList){
				$tempList = array();
				foreach($prod_list as $id=>$termname){
					if(array_key_exists($id, $termList)){
						$tempList[$id]=$termname;
					}
				}
			}
			
			return writecombo($tempList, $name,$extraOptions,"", 0, $onchange ,"class=".$class,"");
		}
		return "";
	}*/


	function fetchSICCodes($name, $class, $extraOptions=false,$selSICCode){
		global $zetadb;
		global $SICCODE_LIST;
	
		$siccode_list = $_SESSION['$SICCODE_LIST'];
		if($siccode_list == null || sizeof($siccode_list) <1){
			$select_qry = "SELECT code, description from ".TBL_ORDER_MERCHANT_SIC_CODES." WHERE active='Y' ORDER BY description ASC ";
			//	echo $select_qry ;
			$result = $zetadb->Execute($select_qry);
		   $siccode_list=array(""=>"");
			while($data = $result->FetchRow()){
					$siccode_list[$data['code']]= $data['description'];
			}
	
			$_SESSION['$SICCODE_LIST']=$siccode_list;
		}
		
		return writecombo($siccode_list, $name,$extraOptions,$selSICCode, 0, "","class=".$class,"",$addOption);
	}
	
	function fetchMCCCodes(){//$name, $class, $extraOptions=false,$selSICCode){
		global $zetadb;
		global $MCCCODE_LIST;
	
		$mcccode_list = $_SESSION[$MCCCODE_LIST];
		if($mcccode_list == null || sizeof($mcccode_list) <1){
			$select_qry = "SELECT code, description from ".TBL_ORDER_MCC_CODES." WHERE active='Y' ORDER BY description ";
			//	echo $select_qry ;
			$result = $zetadb->Execute($select_qry);
		   $mcccode_list=array(""=>"");
			while($data = $result->FetchRow()){
					$mcccode_list[$data['code']]= $data['description'];
			}
	
			$_SESSION[$MCCCODE_LIST]=$mcccode_list;
		}
		
		return ;
//		return writecombo($mcccode_list, $name,$extraOptions,$selSICCode, 0, "","class=".$class,"",$addOption);
	}
	
	function createMCCJSList(){
		global $MCCCODE_LIST;
		$strBuffer = " $MCCCODE_LIST = new Array();\n";
		foreach($_SESSION[$MCCCODE_LIST] as $code => $desc){
			$strBuffer .= " ".$MCCCODE_LIST."['".$code."']=\"".$desc."\";\n";
		}
		return  $strBuffer;
	}
	
	function createTCCJSList(){
		global $TCCCODE_LIST;
		$strBuffer = " $TCCCODE_LIST = new Array();\n";
		foreach($_SESSION[$TCCCODE_LIST] as $code => $desc){
			$strBuffer .= " ".$TCCCODE_LIST."['".$code."']=\"".$desc."\";\n";
		}
		return  $strBuffer;
	}
	
	function fetchTCCCodes(){//$name, $class, $extraOptions=false,$selSICCode){
		global $zetadb;
		global $TCCCODE_LIST;
	
		$tcccode_list = $_SESSION[$TCCCODE_LIST];
		if($tcccode_list == null || sizeof($tcccode_list) <1){
			$select_qry = "SELECT code, description from ".TBL_ORDER_TCC_CODES." WHERE active='Y' ORDER BY description ";
			//	echo $select_qry ;
			$result = $zetadb->Execute($select_qry);
		   $tcccode_list=array(""=>"");
			while($data = $result->FetchRow()){
					$tcccode_list[$data['code']]= $data['description'];
			}
	
			$_SESSION[$TCCCODE_LIST]=$tcccode_list;
		}
		
		return ;
//		return writecombo($mcccode_list, $name,$extraOptions,$selSICCode, 0, "","class=".$class,"",$addOption);
	}
	
	function fetchCampaignInfo($name, $class,$extraOptions=false){
		global $zetadb;
		global $CAMP_INFO;
	
		$camp_info = $_SESSION['$CAMP_INFO'];
		if($camp_info  == null || sizeof($camp_info ) <1){
			$select_qry = "SELECT cch_campaign_id, cch_campaign_name from ".TBL_ORDER_CAMPAIGN_HISTORY." WHERE active='Y' ORDER BY cch_campaign_name  ";
			//	echo $select_qry ;
			$result = $zetadb->Execute($select_qry);
	
			$camp_info ['']= '';
			while($data = $result->FetchRow()){
					$camp_info [$data['cch_campaign_id']]= $data['cch_campaign_name'];
			}
	
			$_SESSION['$CAMP_INFO']=$camp_info ;
		}
	
		return writecombo($camp_info , $name,$extraOptions,"", 0, "","class=".$class,"",$addOption);
	}
	
	function extractDateFromTime($date)  //used in Salesagent and Operation Module
   {
	   
	 /*  $y=substr($date,0,4);
   	   $m=substr($date,4,2);
   	   $d=substr($date,6,2);
	   $date=$y."-".$m."-".$d;*/
	 	
	   $date=substr($date,0,10);
	   return $date;
		
   }
   function extractTimeFromDate($date)
   {
  	 	$date=substr($date,10,18);
	   return $date;
   }
   
   
function rowPerPage($recperpage,$getRowPerPage) //used in Salesagent and Operation Module
{
?>		 
				<table width="100%" cellspacing="0" cellpadding="0" border="0">
					<tr width="100%" align="right">
						<td>Rows per Page&nbsp; 
							<select name="rowsPerPage" id="rowsPerPage"  onchange="form.submit()" class="inputMin">
							  <?for($i=0;$i<$recperpage;$i++)
								{	
									$v+=10;
									if($getRowPerPage==$v)
										$sel='selected';
									else
										$sel='';
							  ?>
									<option value="<? echo $v?>" <? echo $sel?>><? echo $v?></option>
							  <?}?>
							</select>
						</td>
					</tr>
				</table>
		
<?
}

function rowTotalPage($res_count_record,$recperpage,$selpage,$tot_per_pg) //used in Salesagent and Operation Module
{
?>
	</table>		
		<table align="center" border="0" width="100%" cellspacing="2" cellpadding="0"  >
		<tr>	
			<td align=left > <? if ($tot_per_pg=='Y') 
								{
							?>
									<B>Total Record Found : <?echo number_format($res_count_record)?></B>
							<? }else{?>&nbsp;<? }?>
			</td>
			<td align=right colspan=8>

			 <B>Page No : </B>
			 <select name="selpage" onchange="form.submit()">
				<?
				  for($i=0;$i<$recperpage;$i++)
				  {
						if($selpage==$i)
							$sel='selected';
						else
							$sel='';
			  ?>
					<option value="<? echo $i?>" <? echo $sel?>><? echo $i+1?></option>
						
			 <?  }
				?>
			  </select>
			</td>
		  </tr>
	</table>		
<?
	}
	
function fetchSalesList($name, $class, $extraOptions=false, $createCombo= true, $onChange=""){
	global $zetadb;
	global $SALES_LIST;
	$loginid = $_SESSION['loginid'];

	$sales_list = $_SESSION['$SALES_LIST'];
	if($sales_list == null || sizeof($sales_list) <1){
		$select_qry = "SELECT loginid, firstname, lastname from ".TBL_SYSTEM_USER_DETAIL." where type='sale' AND active='Y' ORDER BY firstname, lastname";
		//	echo $select_qry ;
		$result = $zetadb->Execute($select_qry);

		while($data = $result->FetchRow()){
				$sales_list[$data['loginid']]= $data['firstname']." ".$data['lastname'];
				//echo $sales_list[$data['loginid']];
		}

		$_SESSION['$SALES_LIST']=$sales_list;
	}
	
	if($createCombo){
		return writecombo($sales_list, $name,$extraOptions,"", 0, $onChange,"class=".$class,"",$addOption, "");		
	}else{
		return $sales_list;
	}	
}

$SALES_OPERATION_LIST = "sales_operation_list";

function fetchOperationSalesList($name, $class, $extraOptions=false, $createCombo= true, $onChange="",$all=''){
	global $zetadb;
	global $SALES_OPERATION_LIST;
	$loginid = $_SESSION['loginid'];

	$sales_oper_list = $_SESSION['$SALES_OPERATION_LIST'];
	if($sales_oper_list == null || sizeof($sales_oper_list) <1){
		$select_qry = "SELECT loginid, firstname, lastname from ".TBL_SYSTEM_USER_DETAIL." where type in ('sale','operation') AND active='Y' ORDER BY firstname, lastname";
		//	echo $select_qry ;
		$result = $zetadb->Execute($select_qry);
        
        if($all=='Yes')
        	$sales_oper_list=array(""=>"");
        	
		while($data = $result->FetchRow()){
				$sales_oper_list[$data['loginid']]= $data['firstname']." ".$data['lastname'];
				//echo $sales_list[$data['loginid']];
		}

		$_SESSION['$SALES_OPERATION_LIST']=$sales_oper_list;
	}
	
	if($createCombo){
		return writecombo($sales_oper_list, $name,$extraOptions,"", 0, $onChange,"class=".$class,"",$addOption, "");		
	}else{
		return $sales_oper_list;
	}	
}


function fetchSalesAgentList($name, $class, $extraOptions=false, $createCombo= true, $onChange=""){
	global $zetadb;
	global $SALES_AGENT_LIST;
	$loginid = $_SESSION['loginid'];

	$salesagent_list = $_SESSION[$SALES_AGENT_LIST];
	if($salesagent_list == null || sizeof($salesagent_list) <1){
		$select_qry = "SELECT loginid, firstname, lastname from ".TBL_SYSTEM_USER_DETAIL." where type='salesagent' AND active='Y' ORDER BY firstname, lastname ";
		//	echo $select_qry ;
		$result = $zetadb->Execute($select_qry);

		while($data = $result->FetchRow()){
				$salesagent_list[$data['loginid']]= $data['firstname']." ".$data['lastname'];
				//echo $sales_list[$data['loginid']];
		}

		$_SESSION[$SALES_AGENT_LIST]=$salesagent_list;
	}
	
	if($createCombo){
		return writecombo($salesagent_list, $name,$extraOptions,"", 0, $onChange,"class=".$class,"",$addOption, "");		
	}else{
		return $salesagent_list;
	}	
}

$AGENT_SALES_OPERATION_LIST = "agent_sales_operation_list";

function fetchAgentOperationSalesList($name, $class, $extraOptions=false, $createCombo= true, $onChange="",$all=''){
	global $zetadb;
	global $AGENT_SALES_OPERATION_LIST;
	$loginid = $_SESSION['loginid'];

	$agent_sales_oper_list = $_SESSION[$AGENT_SALES_OPERATION_LIST];
	if($agent_sales_oper_list == null || sizeof($agent_sales_oper_list) <1){
		$select_qry = "SELECT loginid, firstname, lastname from ".TBL_SYSTEM_USER_DETAIL." where type in ('sale','operation', 'salesagent', 'insidesale') AND active='Y' ORDER BY firstname, lastname";
		//	echo $select_qry ;
		$result = $zetadb->Execute($select_qry);
        
        if($all=='Yes')
        	$agent_sales_oper_list=array(""=>"");
        	
		while($data = $result->FetchRow()){
				$agent_sales_oper_list[$data['loginid']]= $data['firstname']." ".$data['lastname'];
				//echo $sales_list[$data['loginid']];
		}

		$_SESSION[$AGENT_SALES_OPERATION_LIST]=$agent_sales_oper_list;
	}
	
	if($createCombo){
		return writecombo($agent_sales_oper_list, $name,$extraOptions,"", 0, $onChange,"class=".$class,"",$addOption, "");		
	}else{
		return $agent_sales_oper_list;
	}	
}

function fetchInsideSaleList($name, $class, $extraOptions=false, $createCombo= true, $onChange=""){
	global $zetadb;
	global $INSIDE_SALES_LIST;
	$loginid = $_SESSION['loginid'];

	$insidesales_list = $_SESSION[$INSIDE_SALES_LIST];
	if($insidesales_list == null || sizeof($insidesales_list) <1){
		$select_qry = "SELECT loginid, firstname, lastname from ".TBL_SYSTEM_USER_DETAIL." where type='insidesale' AND active='Y' ORDER BY firstname, lastname";
		//	echo $select_qry ;
		$result = $zetadb->Execute($select_qry);

		while($data = $result->FetchRow()){
				$insidesales_list[$data['loginid']]= $data['firstname']." ".$data['lastname'];
				//echo $sales_list[$data['loginid']];
		}

		$_SESSION[$INSIDE_SALES_LIST]=$insidesales_list;
	}
	
	if($createCombo){
		return writecombo($insidesales_list, $name,$extraOptions,"", 0, $onChange,"class=".$class,"",$addOption, "");		
	}else{
		return $insidesales_list;
	}	
}

function fetchOperationsList($name, $class, $extraOptions=false, $createCombo= true, $onChange=""){
	global $zetadb;
	global $OPERATIONS_LIST;
	$loginid = $_SESSION['loginid'];

	$operations_list = $_SESSION[$OPERATIONS_LIST];
	if($operations_list == null || sizeof($operations_list) <1){
		$select_qry = "SELECT loginid, firstname, lastname from ".TBL_SYSTEM_USER_DETAIL." where type='operation' AND active='Y' ORDER BY firstname, lastname";
		//	echo $select_qry ;
		$result = $zetadb->Execute($select_qry);

		while($data = $result->FetchRow()){
				$operations_list[$data['loginid']]= $data['firstname']." ".$data['lastname'];
				//echo $sales_list[$data['loginid']];
		}

		$_SESSION[$OPERATIONS_LIST]=$operations_list;
	}
	
	if($createCombo){
		return writecombo($operations_list, $name,$extraOptions,"", 0, $onChange,"class=".$class,"",$addOption, "");		
	}else{
		return $operations_list;
	}	
}

function removeSpecialChars($input){
	$output = $input;
	$output  = str_ireplace("'","", $output);
	$output  = str_ireplace("\"","", $output);
	$output  = str_ireplace("\n"," ", $output);
	$output  = str_ireplace("\r"," ", $output);
	//if(strpos($output,"\n") > 0)
	//	$output = "hello";
	return $output; 	
}
	
	/*---------------For Getting the Card Available Used in Merchant,Salesagent,Operation----------------------*/
	
//	$sql_card="select short_name from ". TBL_CARD_TYPE ." where status=1 and description ='CR'";
//	$rs=$zetadb->Execute($sql_card);
//	if($zetadb->Affected_Rows()>0)
//	{
//			while($rr=$rs->FetchRow())
//			{
//				$possibleCardType[]=$rr['short_name'];
//				$possibleCardTypeAssoc[$rr['short_name']]=$rr['short_name'];
//			}
//			
//	}
//	asort($possibleCardType);
//	$possibleDebitCardTypeAssoc=array("IDP-CB"=>"IDP-CB","IDP"=>"IDP","SURCHARGE"=>"SURCHARGE"
//								,"MAINT"=>"MAINT","STMT"=>"STMT","OTHER"=>"OTHER",
//								"CREQ"=>"CREQ","MISC"=>"MISC"); 
	
//	$possibleDebitCardType=array("IDP-CB","IDP","SURCHARGE","MAINT","STMT","OTHER","CREQ","MISC");							
//	$DebitCard=array("IDP-CB"=>"IDP-CB","IDP"=>"IDP","OTHER"=>"OTHER");//Billing Schedule
	
/*function getBillingCard()
 {	global $zetadb;
 	
	$sql="select distinct das_processing_code from ".TBL_CGI_TRANSACTION_SUMMARY;
	$r=$zetadb->Execute($sql);
	$str=array(""=>"");
	
	while($rr=$r->FetchRow())
	{
		$str[$rr[das_processing_code]]=$rr[das_processing_code];
	}

 	return $str;
 }*/
	
	/*---------------End----------------------*/
	
function fetchSalesAndSAgentList($name, $class, $extraOptions=false, $createCombo= true, $onChange=""){
	global $zetadb;
	global $SALES_AGENT_LIST;
	$loginid = $_SESSION['loginid'];

	$salesagent_list = $_SESSION[$SALES_AGENT_LIST];
	if($salesagent_list == null || sizeof($salesagent_list) <1){
		$select_qry = "SELECT loginid, firstname, lastname from ".TBL_SYSTEM_USER_DETAIL." where (type='salesagent' or type='sale') " .
					  "AND active='Y' order by type";
		//	echo $select_qry ;
		$result = $zetadb->Execute($select_qry);

		while($data = $result->FetchRow()){
				$salesagent_list[$data['loginid']]= $data['firstname']." ".$data['lastname'];
				//echo $sales_list[$data['loginid']];
		}

		$_SESSION[$SALES_AGENT_LIST]=$salesagent_list;
	}
	
	if($createCombo){
		return writecombo($salesagent_list, $name,$extraOptions,"", 0, $onChange,"class=".$class,"",$addOption, "");		
	}else{
		return $salesagent_list;
	}	
}	
function fetchInsideSaleStatus($name, $class, $extraOptions=false,$selvalue, $onchange){
	global $zetadb;
	global $INSALE_STATUS_LIST, $INSALE_STATUS_TABLE;

	 $status_list = $_SESSION['$INSALE_STATUS_LIST'];
	if($status_list == null || sizeof($status_list) <1){
		$select_qry = "SELECT * from ".TBL_LEAD_STATUS_CODES." where used_in not in ('prospect')";
		$result = $zetadb->Execute($select_qry);

		while($data = $result->FetchRow()){
				$status_list[$data['cls_status_cd']]= $data['cls_status_name'];
		}

		$_SESSION['$INSALE_STATUS_LIST']=$status_list;
	}
	
	createStatusToArrayMap($status_list);
	$selvalue=strtolower($selvalue);
	return writecombo($status_list, $name, $extraOptions, $selvalue, 0, "","class=".$class,$onchange );
} 
function getOrderId()
 {	
 	global $zetadb;
 	global $str_order;
 	
 		$sql="select order_id from ".TBL_ORDER_DETAILS." where  active='Y'";
		$r=$zetadb->Execute($sql);
		$str_order=array(""=>"");
	
		while($rr=$r->FetchRow())
		{
			$str_order[$rr[order_id]]=$rr[order_id];
		}

 	return $str_order;
 }

function fetchTaxes(){
	global $zetadb;
	global $TAXES_LIST;

	$taxes_list = $_SESSION[$TAXES_LIST];
	if($taxes_list == null || sizeof($taxes_list) <1){
		$select_qry = "SELECT ct_province, ct_country , ct_tax_type, ct_tax_applicable, ct_tax from ".TBL_SYSTEM_TAXES." ORDER BY ct_country, ct_province, ct_tax_type ";
		//	echo $select_qry ;
		$result = $zetadb->Execute($select_qry);
	   	$taxes_list=array(""=>"");
		while($data = $result->FetchRow()){
				if(!is_array($taxes_list[$data['ct_country']][$data['ct_province']])){
					$taxes_list[$data['ct_country']][$data['ct_province']] = array("GST"=>"0.00","HST"=>"0.00","PST"=>"0.00");
				}
				$taxes_list[$data['ct_country']][$data['ct_province']][$data['ct_tax_type']]= $data['ct_tax'];
		}

		$_SESSION[$TAXES_LIST]=$taxes_list;
	}
	
	return ;
}

function createTAXJSList(){
	global $TAXES_LIST;
	$strBuffer = " $TAXES_LIST = new Array();\n";
	foreach($_SESSION[$TAXES_LIST] as $country => $cntryDetails){
		$strBuffer .= " ".$TAXES_LIST."['".$country."'] = new Array(); ";
		foreach($cntryDetails as $prov=>$provDetails){
			$strBuffer .= " ".$TAXES_LIST."['".$country."']['".$prov."'] = new Array(); ";
			foreach($provDetails as $taxType=>$taxValue){				
				$strBuffer .= " ".$TAXES_LIST."['".$country."']['".$prov."']['".$taxType."']='".$taxValue."';\n";
			}
		}
	}
	return  $strBuffer;
}


$ORDER_TYPE_CODES = array();
$ORDER_TYPE_CODES["buy"] = array(0=>"Buy",BUY);
$ORDER_TYPE_CODES["lease"] = array(0=>"Lease",LEASE);
$ORDER_TYPE_CODES["changerequest"] = array(0=>"Change Request", CHANGE_REQUEST);
$ORDER_TYPE_CODES["other"] = array(0=>"Other",OTHER);

function getOrderTypeText($code){
	global $ORDER_TYPE_CODES;
	foreach($ORDER_TYPE_CODES as $textCode=>$typeDetails){
		if(in_array($code, $typeDetails)){
			return $typeDetails[0];
		}
	}
	
	return "order type code '".$code."' not found";	
}

function getOrderTypeCode($strOrderType){
	global $ORDER_TYPE_CODES;
	return $ORDER_TYPE_CODES[$strOrderType][1]==""?$strOrderType:$ORDER_TYPE_CODES[$strOrderType][1];
}

function checkIfStageCleared($bitmap, $key, $mask){
	$mask = chunk_split($mask, 1, " ");
	$mask = explode(" ", $mask);	
	foreach($mask as $index=> $bin){
		if($index > strlen($bitmap)-1)break;
		if($bin=="1"){
			if($bitmap[$index])return true;
			else return false;
		}
	}
}

function getIncompleteStatusesList($verificationStatus, $returnString=false){
	global $orderStatusIcons;
	
	$list = array();	
	$strBuffer = "";
	$verificationStatus = chunk_split($verificationStatus, 1, " ");
	$verificationStatus = explode(" ", $verificationStatus);
	
	$orderStatusList = getOrderStatusList();
	$verification_icons = array_slice($orderStatusIcons, 0, 3); ///exclude Verification stage
	foreach($verification_icons as $key => $iconDetails){
		$mask = $orderStatusList[$iconDetails[0]]['mask'];
		$index = stripos($mask, "1");
		if($verificationStatus[$index]=="0"){
			if($returnString){
				$strBuffer .=$orderStatusList[$iconDetails[0]]['description'].", ";
			}else{
				$list[] = $key;
			}
		}
	}
	
	$strBuffer = rtrim($strBuffer, ", ");
	if($returnString){
		return $strBuffer;
	}
	return (($returnString)?$strBuffer:(count($list)>0)?$list:null);
	
}

function getIconStringForStatus($client_id, $ordStatus, $orderType, $clientsUsingCreditCards, $orderVerificationStatus){
	global $orderStatusIcons;
	
	$iconString = "";
	$statusSet  = false;
	$orderStatusList = getOrderStatusList();
	$verification_icons = array_slice($orderStatusIcons, 0, 4);
	$orderVerificationStatus = chunk_split($orderVerificationStatus, 1, " ");
	$orderVerificationStatus = explode(" ", $orderVerificationStatus);
	foreach($verification_icons as $key=>$iconDetails){
		if($iconDetails[0] == $ordStatus){
			$statusSet= true;
		}
		if($key == "lease" ){
				if($orderType != LEASE){	
					continue;
				}	
		}else if($key == "creditinfo"){
			if( !array_key_exists($client_id, $clientsUsingCreditCards)){
				continue;
			}
		}		
		if(checkIfStageCleared($orderVerificationStatus, $iconDetails, $orderStatusList[$iconDetails[0]]['mask'])){
			$iconString .=$iconDetails[3];
		}else{
			$iconString .=$iconDetails[4];
			
		}
	}
	$other_icons = array_slice($orderStatusIcons, 4 );
	foreach($other_icons as $key=>$iconDetails){
		
 		if($iconDetails[0]==$ordStatus){			 			
 			$statusSet = true;
 			$iconString .=$iconDetails[4];
 		}else{
 			if($statusSet){
 				$iconString .=$iconDetails[2];
 			}else{
 				$iconString .=$iconDetails[3];
 			}
 		}
 	}
 	
 	return $iconString;
}

function getOrderStatusList(){
	global $zetadb, $ORDER_STATUS_LIST;	

	$orderStatusList = $_SESSION[$ORDER_STATUS_LIST];
	if($orderStatusList == null || count($orderStatusList) <1){		
		$rs = $zetadb->Execute(" select * from ".TBL_ORDER_STATUS." ");
		if($data = $rs->FetchRow()){
			$orderStatusList = array();
			do{
				$orderStatusList[$data['status_id']]=array("status_id"=>$data['status_id'], "description"=>$data['description'], "mask"=>$data['mask']);
			}while($data = $rs->FetchRow());
		}
		$_SESSION[$ORDER_STATUS_LIST]=$orderStatusList;
	}
	
	return $orderStatusList;
}

function errorMsg($msg){
	$_SESSION['status_msg']= "<span class='errormsg'>".$msg."</span>";
}

function successMsg($msg){
	$_SESSION['status_msg']= "<span class='successmsg'>".$msg."</span>";
}
function fetchProductCategory($cat =CAT_TERMINAL){
	global $zetadb;
	$list = $_SESSION[$cat];
	if($list == null || count($list)<1){
		$sql = " select cps_prod_id from ".TBL_ORDER_PRODUCT_SERVICE." where cps_prod_cat='".$cat."' and active='Y'";
		$rs = $zetadb->Execute($sql);		
		if($data = $rs->FetchRow()){
			do{				
				$list[$data['cps_prod_id']]=array(0=>$data['cps_prod_id']);
			}while($data = $rs->FetchRow());
		}
		$_SESSION[$cat] = $list;
	}	
//	var_dump($list)	;
	return $list;
}

function fetchData($columnsToFetch, $tablename, $key, $rowCount=1){
	global $zetadb;
	$columnsToFetch = strlen(trim($columnsToFetch))==0?" * ":$columnsToFetch;
	$limitSQL = $rowCount!='ALL'?" LIMIT ".$rowCount:" ";
	
	$sql = " SELECT ".$columnsToFetch." FROM ".$tablename." WHERE ".$key.$limitSQL;
	
	$rs=  $zetadb->Execute($sql);
	$result = array();
	if($data = $rs->FetchRow()){
		do{
			$result[] = $data;
		}while($data = $rs->FetchRow());
	}
	return $result;
}

//$terminalTypes = fetchProductCategory(CAT_TERMINAL);

//fetchTaxes();
//fetchMCCCodes();
//fetchTCCCodes();
//echo "<script>".createTAXJSList()."</script>";
//echo "<script>".createMCCJSList()."</script>";
//echo "<script>".createTCCJSList()."</script>";



?>