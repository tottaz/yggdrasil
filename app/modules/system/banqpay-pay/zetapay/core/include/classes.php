<?php

class ServiceDetail{
	public $servicePlanColName= "";
	public $servicePlanTableName= "";
	public $serviceFeeArray= array();
	public $serviceMandatoryFeeArray= array();
	public $servicePlanDisplayName= "";
	public $servicePlanSelected= false;
	
	public function ServiceDetail($servicePlanColName, $servicePlanTableName ,$serviceFeeArray, $serviceMandatoryFeeArray,$servicePlanDisplayName){
		$this->servicePlanColName= $servicePlanColName;
		$this->serviceFeeArray= $serviceFeeArray;
		$this->serviceMandatoryFeeArray = $serviceMandatoryFeeArray;
		$this->servicePlanDisplayName= $servicePlanDisplayName;
		$this->servicePlanTableName = $servicePlanTableName;					
	}
	
	public function renderServiceTable(){		
		if( $this->servicePlanColName != 'spd_services_creditcards' && $this->servicePlanColName != 'spd_services_monthly_stat' && $this->servicePlanColName != 'spd_services_interact'){
			$strBuffer  = "<script>document.getElementById('selectService').options[i++]=new Option('".$this->servicePlanDisplayName."','"."sel-".$this->servicePlanColName."');</script>";
			$strBuffer .="<tr id='sel-".$this->servicePlanColName."' style=' display:none; '><td width='100%'>" .
						 "	<table cellspacing='0' cellpadding='0' width='100%'>";		
			$strBuffer .="		<tr valign='top'>" .
						"			<td  ><table cellspacing='0' cellpadding='0' width='100%'><tr><td width='50%' class='heading'>$this->servicePlanDisplayName</td><td align='left'><input type='checkbox' ".($this->servicePlanSelected?" checked ":"")." id='cb-".$this->servicePlanColName."-".$this->serviceFeeArray[0]."' name='cb-".$this->servicePlanColName."-".$this->serviceFeeArray[0]."' onclick='javascript:toggleDisplay(this.checked, document.getElementById(\"".$this->servicePlanColName."\"));'></td></tr></table></td>" .
						"		</tr>";
			//if($this->servicePlanColName=="spd_services_new_1"){echo "<script>";var_dump($this->serviceFeeArray);echo "</script>";}			
			foreach($this->serviceFeeArray as $service => $feeArray ){
			//if($this->servicePlanColName=="spd_services_new_1"){echo "<script>";var_dump($feeArray);echo "</script>";}	
				if(is_array($feeArray)){
					$strBuffer .= 						
						"	<tr valign='top' id='".$this->servicePlanColName."' ".($this->servicePlanSelected?"":"style=' display:none; '")."><td class='heading' >\n" .
						"		<table align='center' width='100%' cellspacing='0' cellpadding='0' border=0 >\n" .							
						"			<tr valign='top' ><td>\n" .
						"				<table align='center' width='100%' cellspacing='2' cellpadding='1' border=0 class='outerTable'>\n" ;
						
					foreach($feeArray as $index => $feeStruct){
						$strBuffer .=$feeStruct->renderFeeTable($this->servicePlanColName,$service,$feeStruct->feeColumnName, false, $this->servicePlanSelected, $this->serviceFeeArray);
					}
					$strBuffer .= 
						"				</table>\n" .
						"			</td></tr>\n" .
						"		</table>\n" .
						"	</td></tr>\n";
					
				}
			}
			$strBuffer .="</table></td></tr>";
		}else{		
			$strBuffer = "<script>document.getElementById('selectService').options[i++]=new Option('".$this->servicePlanDisplayName."','"."sel-".$this->servicePlanColName."');</script>";
			$strBuffer .="<tr id='sel-".$this->servicePlanColName."' style=' display:none; '><td width='100%'>" .
						 "	<table cellspacing='0' cellpadding='0' width='100%' border='0'>";
			$strBuffer .="		<tr valign='top' >" .
						"			<td class='heading' ><table cellspacing='0' cellpadding='0' width='100%'><tr><td width='50%' class='heading' >$this->servicePlanDisplayName</td><td align='left'><input type='checkbox' ".($this->servicePlanSelected?" checked ":"")." id='cb-".$this->servicePlanColName."' name='cb-".$this->servicePlanColName."' onclick='javascript:toggleDisplay(this.checked, document.getElementById(\"".$this->servicePlanColName."\"));toggleMandatoryServices(this.checked, \"cb-".$this->servicePlanColName."\");' ></td></tr></table></td>" .
						"		</tr>";
			$strBuffer .=
				"	<tr valign='top' id='".$this->servicePlanColName."' ".($this->servicePlanSelected?"":" style=' display:none; ' ")." ><td class='heading' colspan='2'>\n" .
				"		<table align='center' width='100%' cellspacing='0' cellpadding='0' border='0' >\n" ;			
			foreach($this->serviceFeeArray as $service => $feeArray ){
				$checked=false;
				if(is_array($feeArray)){
					if(array_key_exists($service."_selected",$this->serviceFeeArray) && $this->serviceFeeArray[$service."_selected"]){
						$checked=true;
					}
										
					$mandatoryServiceFee = in_array($service,$this->serviceMandatoryFeeArray)?true:false;
					$strBufferService =
								"<tr valign='top'>" .
								"	<td class='heading'><table cellspacing='0' cellpadding='0' border='0' width='100%'><tr><td width='20%' >$service</td><td>".($mandatoryServiceFee?"<i>(Required)<input type='hidden' id='cb-".$this->servicePlanColName."-".$service."' name='cb-".$this->servicePlanColName."-".$service."' value='off'/></i>":"<input type='checkbox' ".($checked?" checked ":"")." id='cb-".$this->servicePlanColName."-".$service."' name='cb-".$this->servicePlanColName."-".$service."' onclick='javascript:toggleDisplay(this.checked, document.getElementById(\"".$service."\"));'/>")."</td></tr></table></td>" .
								"</tr>" .
								"<tr valign='top' id=\"".$service."\" ".(($mandatoryServiceFee||$checked)?"[STYLE]":"style=' display:none; ' ")."><td>" .
								"	<table align='center' width='100%' cellspacing='2' border='0' cellpadding='1' class='outerTable' >\n";															
					$allUneditable = true;			
					foreach($feeArray as $index => $feeStruct){
						if($feeStruct->feeEditable){							
							$allUneditable = false;
						}												
						$strBufferService .=$feeStruct->renderFeeTable($this->servicePlanColName,$service,$feeStruct->feeColumnName, true);											
					}
					
					if($allUneditable){
						
						$strBufferService = str_ireplace("this.checked"," false ",$strBufferService );
						$strBufferService = str_ireplace("[STYLE]"," style=' display:none; ' ",$strBufferService );
					}else{
						$strBufferService = str_ireplace("[STYLE]","",$strBufferService );
					}
					
					$strBufferService .="	</table>" .
							"	</td></tr>" ;
					$strBuffer .= $strBufferService;
				}
			}
			$strBuffer .= "	</table>\n" .
				"	</td></tr>\n";
			$strBuffer .="</table></td></tr>";
			
		}		
		return $strBuffer;
		
	}
	
	public function renderServiceSummary(){		
		global $popupwindow;
		 
		$spacer = "<tr><td width='100%'><img src='cpos/images/1x1.gif' height='5'/></td></tr>";
				
		$strBuffer ="<table cellspacing='0' cellpadding='0' border='0' width='100%'>";
			
		foreach($this->serviceFeeArray as $feeName => $feeDetailsArray){			
			if(is_array($feeDetailsArray)){				
				if(($this->servicePlanColName != "spd_services_creditcards" && $this->servicePlanColName != "spd_services_monthly_stat") || $this->serviceFeeArray[$feeName."_selected"]== true ){										
					$strBufferServiceRow ="<tr><td width='100%'>";
					//$strBufferServiceRow .="<script> var ".$this->servicePlanColName." ='".$this->servicePlanColName."'; </script>";
					$strBufferServiceRow .="<table cellspacing='2' cellpadding='1' class='outerTable' border='0' width='100%'>";
					$strBufferServiceRow .= "<tr>";					
					$strBufferServiceRow .= "<td width='5%' align='left' class='formLabel'><a class='serviceNameLink' onclick='javascript:modifyService(".$this->servicePlanColName.");'>".$feeName."</a></td>";
										 

					$strBufferFeeRows ="";
					foreach($feeDetailsArray as $index=> $feeDetails){
						//var_dump($feeDetails);
						if((in_array($feeName,$this->serviceMandatoryFeeArray) || $feeDetails->feeSelected) && ($feeDetails->feeEditable ||  $feeDetails->feeDefaultValue >0)){
							$strBufferFeeRows .= "<td width='20%' align='center'>".$feeDetails->feeDisplayName."</td>";	
						}				
					}
					if(strlen($strBufferFeeRows) ==0 )
						continue;
					$strBufferFeeRows .= "<td>&nbsp;</td></tr><tr><td>&nbsp;</td>";					 
					foreach($feeDetailsArray as $index=> $feeDetails){
						//var_dump($feeDetails);
						if(in_array($feeName,$this->serviceMandatoryFeeArray) || $feeDetails->feeSelected ){
							$strBufferFeeRows .= $feeDetails->renderFeeSummary($feeName);
						}				
					}			
					
					$strBufferServiceRow .=$strBufferFeeRows;
					$strBufferServiceRow .= "<td>&nbsp;</td></tr>";
					$strBufferServiceRow .="</table>";
					$strBufferServiceRow .="</td></tr>";	
					if(strlen($strBufferFeeRows) >0){					
						$strBufferServiceRow .=$spacer;
						$strBuffer .= $strBufferServiceRow;
					}else{
						$strBufferServiceRow ="";
					}	
				}			
			}			
		}
		$strBuffer .="</table>";
			
		return $strBuffer;
	}
	
}
class FeeDetail{
	public $feeColumnName="";
	public $feeTableName="";
	public $feeDisplayName= "";
	public $feeValue= 0;
	public $feeDefaultValue= 0;
	public $feeSelected = false;
	public $feeEditable = true;
	public $feeType = "";
	public $feeDisabledIndicator = "N";
	
	public function FeeDetail($feeColumnName, $feeTableName, $feeDisplayName, $feeValue, $feeEditable, $feeDisabledIndicator, $feeType, $feeFormat){		
		$this->feeColumnName=$feeColumnName;
		$this->feeTableName=$feeTableName;
		$this->feeDisplayName= $feeDisplayName;
		$this->feeValue= $feeValue;
		$this->feeDefaultValue= $feeValue;
		$this->feeEditable = $feeEditable;
		$this->feeFormat = $feeFormat;
		$this->feeDisabledIndicator = $feeDisabledIndicator;
		$this->feeType = $feeType;		
	} 
	
	public function renderFeeTable($parentCategory, $serviceFee =0, $feeName =0 , $multipleSubFees = false, $display=false){
		
		if(!$multipleSubFees){				
				if($this->feeEditable){
					$strBuffer =
						"					<tr valign='top'>\n" .
						"						<td class='formLabel' width='30%'>$this->feeDisplayName</td>\n" .
						"						<td class='formFieldRequired' width='70%'>" .
						"							<span style=' padding-left:10px; '>" .
						($this->feeType=="INPUT"?	"<input type='text' class='inputLong' id='"."txt-".$parentCategory."-".$serviceFee."-".$feeName."' name='"."txt-".$parentCategory."-".$serviceFee."-".$feeName."' value='".$this->feeValue."' /><input type='checkbox' id='cb-".$parentCategory."-".$serviceFee."-".$feeName."' name='cb-".$parentCategory."-".$serviceFee."-".$feeName."' onclick='javascript:toggleEditStatus(this.checked, \""."txt-".$parentCategory."-".$serviceFee."-".$feeName."\");'  onkeypress='javascript:return validateValue(this, event, \"ND\");' >":
													"<select class='inputLong' id='"."txt-".$parentCategory."-".$serviceFee."-".$feeName."' name='"."txt-".$parentCategory."-".$serviceFee."-".$feeName."' ></select><script>loadBankList(document.getElementById('"."txt-".$parentCategory."-".$serviceFee."-".$feeName."'),'".$serviceFee."');document.getElementById('"."txt-".$parentCategory."-".$serviceFee."-".$feeName."').value='".$this->feeValue."';</script>") .						
						"							</span>" .
						"						</td>\n" .
						"					</tr>\n" ;
						
				}else{										
					$strBuffer .= "<input type='hidden' id='"."txt-".$parentCategory."-".$serviceFee."-".$feeName."' name='"."txt-".$parentCategory."-".$serviceFee."-".$feeName."' value='".$this->feeValue."' />";
				}
		}else{
			if($this->feeEditable){								
			$strBuffer =			
				"			<tr valign='top' id='".$parentCategory."-".$serviceFee."-".$feeName."' ><td>\n" .
				"				<table align='center' width='100%' cellspacing='0' cellpadding='0' border=0 >\n" .
				"					<tr valign='top'>\n" .
				"						<td class='formLabel' width='30%'>$this->feeDisplayName</td>\n" .
				"						<td class='formFieldRequired' width='70%'>" .
				"							<span style=' padding-left:10px; '>" .
				($this->feeType=="INPUT"?	"<input type='text' class='inputLong' id='"."txt-".$parentCategory."-".$serviceFee."-".$feeName."' name='"."txt-".$parentCategory."-".$serviceFee."-".$feeName."' value='".$this->feeValue."' /><input type='checkbox' id='cb-".$parentCategory."-".$serviceFee."-".$feeName."' name='cb-".$parentCategory."-".$serviceFee."-".$feeName."' onclick='javascript:toggleEditStatus(this.checked, \""."txt-".$parentCategory."-".$serviceFee."-".$feeName."\");'  onkeypress='javascript:return validateValue(this, event, \"ND\");' >":
											"<select class='inputLong' id='"."txt-".$parentCategory."-".$serviceFee."-".$feeName."' name='"."txt-".$parentCategory."-".$serviceFee."-".$feeName."' ></select><script>loadBankList(document.getElementById('"."txt-".$parentCategory."-".$serviceFee."-".$feeName."'),'".$serviceFee."');document.getElementById('"."txt-".$parentCategory."-".$serviceFee."-".$feeName."').value='".$this->feeValue."';</script>") .						
				"							</span>" .
				"						</td>\n" .
				"					</tr>\n" .
				"				</table>\n" .
				"			</td></tr>\n" ;
			}else{
				$strBuffer = "<input type='hidden' id='"."txt-".$parentCategory."-".$serviceFee."-".$feeName."' name='"."txt-".$parentCategory."-".$serviceFee."-".$feeName."' value='".$this->feeValue."' />";
			}
				
		}
		return $strBuffer;
	}
	
	public function renderFeeSummary($subService){
		$string = getFormattedString($this->feeValue, $this->feeFormat);		
		return "<td align='center' >".$string."</td>";	
	}
	
	
}

?>
