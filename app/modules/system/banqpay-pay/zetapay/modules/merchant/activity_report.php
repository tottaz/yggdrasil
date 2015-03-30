<?
$_SESSION['global_str']="";
  include_once("merchant_function.inc.php");

 if(!$base->input['generateButton'])
  {

	$rs=AccountNo();				//find the client id for logged in user
	//$rs_data=$rs->FetchNextObject();

	if($_SESSION['admin_cli_id']=="")
	{
	   $client_id=$rs;
	   $readonly="readonly";

	   $sql_sel1="select cli_operating_text,client_id from ".TBL_CLIENT_DETAIL." where client_id in ('".$client_id."') and active='Y' and cli_status in ('A','P')";
	   $rs_sel1=$zetadb->Execute($sql_sel1);
	   $data1=$rs_sel1->FetchNextObject();
	   $storename=$data1->CLI_OPERATING_TEXT;
	   $sel_merchant_id=$client_id;

	   /*$sql_sel="select cnt_email from ".TBL_CLIENT_CONTACTS." where client_id in ('".$client_id."') and location_id=2";
	   $rs_sel=$zetadb->Execute($sql_sel);
	   $data=$rs_sel->FetchNextObject();
	   $email=$data->CNT_EMAIL;
	    */
	}
	else
	{
	  $readonly="";
	  $client_id=$base->input['merchantTxnId'];

		//for remebering the search

	  if($base->input['storename']!="")
		  $storename=$base->input['storename'];
	  else
		  $storename="";


	  /*if($base->input['email']!="")
		  $email=$base->input['email'];
	  else
		  $email="";*/

	  //$email="";
  	  $sel_merchant_id=$client_id;
	}

	$cli_id=createclientcombo($client_id,'yes');// for creating the combo

    if($base->input['exact']=="contains")
	   $sel_first="selected";
    else
	    $sel_cont="selected";

	 if($base->input['search']=='active')
		 $sel_active='checked';
	 elseif($base->input['search']=='debit_credit')
		 $sel_credit='checked';
	 else
		  $sel_active='checked';
			
?>
<form name="activity" id="activity" method="POST" action="">
<table border="0" cellspacing="0" align=center cellpadding="0" width="100%" height="320" >
<tr valign="top"><td width="100%">
<table border="0" cellspacing="0" align=center cellpadding="0" width="100%">
	<tr>
		<td align="center" class="subtitle"><font color=red><?=$error?></font></td>
	</tr>
</table>
<table align="left" width="100%" cellspacing="2" cellpadding="1" class="outerTable">
	<tr>
		<td class="formLabel" width="15%" >Merchant ID</td>
		<td class="formField" style="padding-left:15px;" width="85%" ><?writecombo($cli_id,"merchantTxnId",'',$sel_merchant_id)?></td>

	</tr>
</table>
</td></tr>
<tr valign="top"><td width="100%">
<table border="0" cellspacing="0" align=center cellpadding="0" width="100%">
	<tr>
		<td class="subtitle">  <input type=radio name="search" value="active" <?=$sel_active?>>   Activity Report</td>
		<td align="right" class="trimText">
		<table border="0" cellspacing="0" cellpadding="0">
			<tr>
				<td style="padding-right:3px;"><img src="cpos/images/world.gif" vspace="0" border="0"></td>
				<td>Time Zone: US/Eastern</td>
			</tr>
		</table>
		</td>
	</tr>
</table>
</td></tr>
<tr valign="top"><td>
	

<table align="left" width="100%" cellspacing="2" cellpadding="1" class="outerTable">
	<tr>
		<td class="formLabel">Merchant Name</td>
		<td class="formField" style="padding-left:15px;"  colspan="3">
		  <select name="match" class="inputShort" >
			<option value="contains" <?=$sel_cont?>>Contains</option>
			<option value="exact" <?=$sel_first?>>Is Exactly</option>
		  </select>&nbsp;
			<input type="text" name="storename" value="<?=$storename?>" maxlength="100"   class="inputLong" <?=$readonly?>>
		</td>
	</tr>

	<tr>
		<td class="formLabel" width=15%>Sequence Number</td>
		<td class="formField" style="padding-left:15px;"  ><input type="text" name="sequenceno" value="<?=$base->input['sequenceno']?>"   class="inputMed" /></td>

		 <!-- <td class="formLabel" width="15%">Email</td>
		<td class="formField" style="padding-left:15px;"  width="35%"><input type="text" name="email" value="<?=$email?>"  class="inputLong" <?=$readonly?>/></td>  -->
	</tr>
	<tr>
        <td class="formLabel" width="15%">Amount</td>
		<td class="formField" style="padding-left:15px;" colspan=3 >
			<input type="text" name="amount" value="<?=$base->input['amount']?>" maxlength="10"   class="inputMed" title='Please Enter The Exact Amount Of The Transaction' />
		</td>
	</tr>
	<tr>
		<td class="formLabel">Start Date</td>
		<td class="formField" style="padding-left:15px;" >
			<input type='input' name='fromDate' value='' readonly>&nbsp;<img name="imMF_1"  src="cpos/images/small-calendar.jpg" border="0" onClick="javascript:show_calendar('activity.fromDate');">
			</td>
			<td class="formLabel">End Date</td>
			<td class="formField" style="padding-left:15px;" ><input type='text' name='toDate' value='' readonly>&nbsp;<img name="imMF_1" src="cpos/images/small-calendar.jpg" border="0" onClick="javascript:show_calendar('activity.toDate');">
	</tr>

	    <!-- <tr>
		<td class="formLabel">To Date</td>
		<td class="formField" style="padding-left:15px;"  colspan="3" ><input type='text' name='toDate' value='' readonly><img name="imMF_1" src="cpos/images/gnome-clock_run.gif" border="0" onClick="javascript:show_calendar('activity.toDate');">
			 <select name="toDateMonth" id="toDateMonth"></select>
              <script>loadMonths(document.getElementById('toDateMonth'));
				 selectComboValue(document.getElementById("toDateMonth"), "<? echo $base->input['toDateMonth'] ?>")
			  </script>

			 <select name="toDateDay" id="toDateDay"></select>
		   <script>loadDayofMonth(document.getElementById('toDateDay'));
				selectComboValue(document.getElementById("toDateDay"), "<? echo $base->input['toDateDay'] ?>")
			</script>
			<select name="toDateYear" id="toDateYear"></select>
              <script>loadYears(document.getElementById('toDateYear'),1997,'<?=date(Y)?>' );
				selectComboValue(document.getElementById("toDateYear"), "<? echo $base->input['toDateYear'] ?>")
				</script>
                -
			<select name="toDateHour" id="toDateHour"></select>
			<script>loadHours(document.getElementById('toDateHour'));
			selectComboValue(document.getElementById("toDateHour"), "<? echo $base->input['toDateHour'] ?>")
			</script>
                   hr
			<select name="toDateMin" id="toDateMin"></select>
			<script>loadMinutes(document.getElementById('toDateMin'));
			selectComboValue(document.getElementById("toDateMin"), "<? echo $base->input['toDateMin'] ?>")
			</script>
                   min
			<select name="toDateSec" id="toDateSec"></select>
			<script>loadSeconds(document.getElementById('toDateSec'));
			selectComboValue(document.getElementById("toDateSec"), "<? echo $base->input['toDateSec'] ?>")
			</script>
                   sec
		</td>
	</tr> -->
	<!-- <tr>
		<td class="formLabel">Time Zone</td>
		<td class="formField" style="padding-left:15px;"  colspan="3">
            <select name="timezone" id="timezone"></select>
            <script>loadTimeZones(document.getElementById('timezone'));</script>
		</td>

	</tr> -->
</table>
</td></tr>

<tr valign="top"><td>
<br  />
<table align="center" width="100%" cellspacing="2" cellpadding="1" class="outerTable" >
<tr>
	<div class="heading">  <input type=radio name="search" value="debit_credit" <?=$sel_credit?>> Debit / Credit Card Search
	<!--<img src="cpos/images/credit_on.jpg" vspace="0" hspace="0" border="0" />-->
  </div>
</tr>
	<tr>
		<td class="formLabel" width="15%">Select Search Type</td>
		<td class="formField" style="padding-left:15px;"  width="85%" colspan="3">
 				<select name=searchtype onchange="changeDisplay(this.value,this.name,'Credit','','')" class="inputMed">
	               <?if($base->input['searchtype']=='Debit')
						$sel_dr="selected";
					 elseif($base->input['searchtype']=='Credit')
						$sel_cr="selected";
					// else
						// $sel="selected";
				   ?>
					<!-- <option value="" <?=$sel?>>--Select--</option> -->
				   <option value='Credit' <?=$sel_cr?>>Credit</option>
	               <option value='Debit' <?=$sel_dr?>>Debit</option>
	            </select>
		 </td>
	</tr>
	<tr >
		<td class="formLabel" width="15%">Card Number</td>
		<td class="formField" style="padding-left:15px;"  width="85%" colspan="3"><input type="text" name="cardnumber" value="<?=$base->input['cardnumber']?>" tabindex="28" class="inputLong" maxlength="18" /></td>
	</tr>
	<tr  id="searchtype1">
			<td class="formLabel" valign="top">Card Type<br/><i>(CTRL-Click for multi-select)</i></td>
			<td class="formField" style="padding-left:15px;"  colspan="3">
				<select name="cardType[]" size="5" multiple class="inputLong">
					<option value="Amex" >American Express&nbsp;</option>
					<option value="Diners" >Diners Club&nbsp;</option>
					<option value="Discover" >Discover&nbsp;</option>
					<option value="JCB" >JCB&nbsp;</option>
					<option value="MasterCard" >MasterCard&nbsp;</option>
					<option value="Visa" >Visa&nbsp;</option>
				</select>
			</td>
		</tr>
	 
	<!-- <tr>
		<td class="formLabel">Funding Options</td>
		<td class="formField" style="padding-left:15px;"  colspan="3">
			<select name="qualifier" size="1" class="inputLong">
				<option value=""></option>
				<option value="NONE" >No Option</option>

				<option value="G" >Guaranteed&nbsp;</option>

				<option value="CFVS" >Cleared Funding Verification&nbsp;</option>

			</select>
		</td>
	</tr> -->
	<tr>
		<td class="formLabel">Transaction Status</td>
		<td class="formField" style="padding-left:15px;"  colspan="3">
			<select name="txnStatus" class="inputLong">
				<option value=""></option>
				<option value="00" >Approved or Completed Successfully</option>
				<option value="05" >Declined,Do not honour</option>
				<option value="63" >MAC Security Failure</option>
				<option value="81" >Invalid PIN Block</option>
				<option value="51" >Insufficiant Funds</option>
			</select>
		</td>
	</tr>
</table>
</td></tr>

<tr valign="top"><td>
<table align="center" width="100%" cellspacing="0" cellpadding="0">
	<tr>
		<td align="right">
			<table cellpadding="0" cellspacing="0" align="right">
				<tr>
					<td align="right"><!-- <input type="checkbox" name="remember" value="true" title="When enabled the system will remember your previous search criteria" checked> --></td>
					<td align="right"><!--  Remember my search criteria --></td>
					<td width="10">&nbsp;</td>
					<td align="right" height="38">

							<input type="reset" class="inputBtnMed" name="resetButton" value="Reset Form" />
							<input type="submit" class="inputBtnMed" name="generateButton" value="Generate Report" onclick="return SubmitForm(this.form)"><!-- onClick="setActivityEvent();validateActivity(); -->

					</td>
				</tr>
			</table>
		</td>
	</tr>
</table>
</div>
</td></tr>

<tr valign="top"><td>

</td>
</tr></table>
</form>
<?
}

if($base->input['generateButton'])
{

   include("activity_report.inc.php");
   $no_of_record=$zetadb->Affected_Rows();	
	if($no_of_record>0)
	{
		$i=0;
		$n=0;
		while($res_qry=$rs_query->FetchRow())
		{
			$m=0;$j=0;

			$currency=$res_qry['dad_currency_code'];
			 $dad_local_datetime=substr($res_qry[dad_local_datetime],0,4)."-".substr($res_qry[dad_local_datetime],4,2)."-".substr($res_qry[dad_local_datetime],6,2);
			$local_time=substr($res_qry[dad_local_datetime],8,2).":".substr($res_qry[dad_local_datetime],10,2).":".substr($res_qry[dad_local_datetime],12,2);
			
			if($res_qry[dad_network_code]=='CRD')		
				$card_type="Credit";
			else
				$card_type="Debit";
			
			if($res_qry['dad_response_code']=='00')   
			{
				 $valid_transaction[$i][$j++]=$dad_local_datetime;
				 $valid_transaction[$i][$j++]=$local_time;
				 $valid_transaction[$i][$j++]=$res_qry[dad_pan];
				 $valid_transaction[$i][$j++]=$res_qry[dad_transaction_amount];
				 $valid_transaction[$i][$j++]=$res_qry[dad_cardissuer_amount];
				 $valid_transaction[$i][$j++]=$res_qry[dad_settlement_amount];
				 $valid_transaction[$i][$j++]=$card_type;
				 $valid_transaction[$i][$j++]=$res_qry[dad_card_acceptor_name];
				 $i++;
			}
			else
			{
				 $txn_status=getTransactionResult($res_qry['dad_response_code']);
				 $invalid_transaction[$n][$m++]=$dad_local_datetime;
				 $invalid_transaction[$n][$m++]=$local_time;
				 $invalid_transaction[$n][$m++]=$res_qry[dad_pan];
				 $invalid_transaction[$n][$m++]=str_replace(",","",$txn_status);
				 $invalid_transaction[$n][$m++]=$res_qry[dad_transaction_amount];
				 $invalid_transaction[$n][$m++]=$res_qry[dad_cardissuer_amount];
				 $invalid_transaction[$n][$m++]=$res_qry[dad_settlement_amount];
				 $invalid_transaction[$n][$m++]=$card_type;
				 $invalid_transaction[$n][$m++]=$res_qry[dad_card_acceptor_name];
				 $n++;
			} 
					
		}
				
		$valid_count=count($valid_transaction);
		$invalid_count=count($invalid_transaction);
	}
	else
	{
		$valid_count=0;
		$invalid_count=0;
	}
	?>
<form name="activityaftersubmit" method="post" action="">
<table align="center" width="100%" cellspacing="2" cellpadding="1"  >
  <tr>
	<div class="heading" align=center>Search Result</div>
</tr>
<tr>
	<div class="heading" align=center><font color='red'><?=$error?></font></div>
</tr>
<tr>	
  <td>
	<table align="center" width="100%" cellspacing="2" cellpadding="1" class="outerTable">
		<tr>
			<div class="heading" align=left>Card Transaction Summary</div>
		</tr>
		<?
		if($base->input['storename']==""){
		 $sql="select cli_operating_text from ".TBL_CLIENT_DETAIL." where client_id='".$base->input['merchantTxnId']."' and active='Y'";
		 $r=$zetadb->Execute($sql);
		 $rr=$r->FetchNextObject();
		 $op_text_name=$rr->CLI_OPERATING_TEXT;	
		}
		else
	   {   
			 $op_text_name= $base->input['storename'];
	   }
		if($base->input['search']=='active'){
		?>	
		<tr valign="top">
		 <td>
			<td class="formLabel" width=15%>Merchant ID</td>
			<?
			
		     if($base->input['merchantTxnId']==1) 
				$m_id="All Merchant";
			  else
				  $m_id=$base->input['merchantTxnId'];
			 ?>	
			<td class="formField" style="padding-left:15px;"><?=$m_id?></td>
			<?if($base->input['fromDateMonth']!="")
				 $sep_date="-";
			 if($base->input['fromDateMin']!="")
				 $sep_time=":";
			?>
			<td class="formLabel" width="15%">Start Date</td>
			<td class="formField" style="padding-left:15px;"  width="35%" align='right'>
			<?=$base->input['fromDate']?>
			</td>
		 </tr>
		<tr valign="top">
		 <td>
			<td class="formLabel" width=15%>Merchant Name</td>
			<td class="formField" style="padding-left:15px;"><?=$op_text_name?></td>
			<?if($base->input['toDateMonth']!="")
			 	 $sep_date1="-";
			 if($base->input['toDateMin']!="")
				 $sep_time1=":";
			 ?>
			<td class="formLabel" width="15%" >End Date</td>
			<td class="formField" style="padding-left:15px;"  width="35%" align='right'>
			<?=$base->input['toDate']?></td>
		 </tr>
		 <td>
			<?$cc=getCurrencyTitle($currency)?>
			<td class="formLabel" width=15%>Currency</td>
			<td class="formField" style="padding-left:15px;"><?=$cc->CURRENCY_TITLE?></td>

			<td class="formLabel" width="15%">Download All</td>
			<td class="formField" style="padding-left:15px;"  width="35%" align='right'>
			<?if($no_of_record!=0){?>		
			<img src="cpos/images/csv.gif" onclick="download('<?=$str=""?>','activity')" title="Export to CSV format and download"><!-- &nbsp;&nbsp;<img src="cpos/images/download.gif" title="Export to CSV format and send via email"> -->
			<?}?>
			</td>
		 </tr>

		<?}
		 else if($base->input['search']=='debit_credit')
		  {?>
		<tr valign="top">
		 <td>
			<td class="formLabel" width=15%>Search Type</td>
			<td class="formField" style="padding-left:15px;"><?=$base->input['searchtype']?></td>

			<td class="formLabel" width="15%">Card Number</td>
			<td class="formField" style="padding-left:15px;"  width="35%"><?=$base->input['cardnumber']?></td>
		 </tr>
		<tr valign="top">
			<?$res=getTransactionStatus($base->input['txnStatus']);?>
		 <td>
			<td class="formLabel" width="15%">Transaction Status</td>
			<td class="formField" style="padding-left:15px;"  width="35%" ><?=$res->DESCRIPTION?></td>
			<td class="formLabel" width="15%">Download All</td>
			<td class="formField" style="padding-left:15px;"  width="35%" align=right>
			<?if($no_of_record!=0){?>	
			<img src="cpos/images/csv.gif" onclick="download('<?=$str=""?>','activity')" title="Export to CSV format and download">
            <?}?>
			</td>
		 </tr>
		<?}
		  else
		  {
			    header("Location:index.php?directory=modules&subdirectory=merchant&function=merchant_report&menu_type=activity_report");
		  }
		?>		
		</table>
	</td>
  </tr>
<tr>
	<td width=100% align=left class="heading">Total Record(s) Found : <?=$no_of_record?></td>
</tr>
</td>
</tr>
<?/*-----------------------------------------------------------------------------------*/ ?>


<tr valign="top">
	<td>
			<table align="center" width="100%" cellspacing="2" cellpadding="1" >
		 	<tr>
				<td class="heading" align=left><!-- <input type='checkbox' value='checked' name="showvalidtxn" checked onclick="changeDisplay(this.checked,this.name,true)" title="Cleck Here To Expand"> -->Valid Transactions 		
			</td>
			<td class="heading" align=right>Total Valid Transaction : <?=$valid_count?></td>
			</tr>
			</table>
	</td>
</tr>
<tr valign="top" id=showvalidtxn1>
<td>
<DIV id="head" name="head" STYLE=" overflow: hidden; width: 820; height: 20; padding-left: 2px; padding-right: 2px; padding-top: 2px; margin: 0px; border: 1px #BABABA solid; border-bottom: 0px;"  >
<table align="center" width="880" cellspacing="2" cellpadding="1" class="outerTable" border=0 style=" overflow: hidden; ">
<tr valign="top">
		<td class="tableHeaderText" width="6%" align=center>Date</td>
		<td class="tableHeaderText" width="5%" align=center>Time</td>
		<td class="tableHeaderText" width="5%" align=center>Pan</td>
		<td class="tableHeaderText" width="5%" align=center title="Transaction Amount">Tran. Amt</td>
		<td class="tableHeaderText" width="5%" align=center title="Card Issuer Amount">C. I. Amt</td>
		<td class="tableHeaderText" width="5%" align=center title="Settlement Amount">Settle. Amt</td>
		<td class="tableHeaderText" width="4%" align=center title="Network Code">N/w Code</td>
	 	<td class="tableHeaderText" width="8%" align=center title="Card Acceptor Name">C. A. Name</td>
		<td class="tableHeaderText" width="6%" align=center title="Card Acceptor Name">CSV Option</td>
</tr>
</table>
</div>
<DIV id="tab" name="tab" STYLE="overflow: auto; height: 300; width: 835; padding-left: 2px; padding-right: 2px; margin: 0px; border: 1px #BABABA solid; border-top: 0px; ">
<table align="center" width="880" cellspacing="2" cellpadding="1" class="outerTable" border=0  style=" overflow: hidden;" >
<?
 	
	if($valid_count>0)
	{
		for($i=0;$i<$valid_count;$i++)
		{
			$j=0;
	?>			
			<tr>
				<?$str=$valid_transaction[$i][$j];?>
				<td class="formField" width="6%" align=center><?=$valid_transaction[$i][$j++]?></td>
				<?$str.=",".$valid_transaction[$i][$j];?>
				<td class="formField" width="5%" align=center><?=$valid_transaction[$i][$j++]?></td>
				<?$str.=",".$valid_transaction[$i][$j];?>				
				<td class="formField" width="5%" align=center><?=substr($valid_transaction[$i][$j],0,4)."***".substr($valid_transaction[$i][$j],-4);$j++?> </td>
				<?$str.=","."Valid";?>		
				<?$str.=",".$valid_transaction[$i][$j];?>		
				<td class="formField" width="5%" align=center><?=number_format(round($valid_transaction[$i][$j++],2))?></td>
				<?$str.=",".$valid_transaction[$i][$j];?>				
				<td class="formField" width="5%" align=center><?=number_format(round($valid_transaction[$i][$j++],2))?></td>
				<?$str.=",".$valid_transaction[$i][$j];?>				
				<td class="formField" width="5%" align=center><?=number_format(round($valid_transaction[$i][$j++],2))?></td>
				<?$str.=",".$valid_transaction[$i][$j];?>				
				<td class="formField" width="4%" align=center><?=$valid_transaction[$i][$j++]?></td>
				<?$str.=",".$valid_transaction[$i][$j];?>				
 				<td class="formField" width="8%" align=center><?=$valid_transaction[$i][$j++]?></td>
				<?$str.=",".$valid_transaction[$i][$j];?>
				<td class="formField" width="6%" align=center><img src="cpos/images/csv.gif" title="Export to CSV format and download" onclick="download('<?=$str?>','activity')">&nbsp;&nbsp;<a href='mailto:' ><img src="cpos/images/download.gif" title="Export to CSV format and send via email" onclick="download('<?=$str?>','activity')" border=0></a></td>
				<input type=hidden name="validtxn_value<?=$i?>" value="<?=$str?>">
				<?$global_str=$global_str."\n".$str;
				  $str="";?>
			</tr>
	<?		   
		}
	 }
	 else
	 {
?>
		<tr>
					<td class="formField" width="100%" align=center><B>No Valid Transaction Found</B></td>
		</tr>
<?	}
?>

</table>
</div>
<?/*-----------------------------------------------------------------------------------*/?>
<tr valign="top">
	<td>
			<table align="center" width="100%" cellspacing="2" cellpadding="1" >
		 	<tr>
				<td class="heading" align=left><!-- <input type='checkbox' value='checked' name="showinvalidtxn" checked onclick="changeDisplay(this.checked,this.name,true)" title="Cleck Here To Expand"> -->Invalid Transactions </td>
			<td class="heading" align=right>Total Invalid Transaction : <?=$invalid_count?></td>
			</tr>
			</table>
	</td>
</tr>

<tr valign="top" id=showinvalidtxn1>
<td>
<DIV id="head1" name="head1" STYLE=" overflow: hidden; width: 820; height: 20; padding-left: 2px; padding-right: 2px; padding-top: 2px; margin: 0px; border: 1px #BABABA solid; border-bottom: 0px;"  >
<table align="center" width="980" cellspacing="2" cellpadding="1" class="outerTable" border=0 style=" overflow: hidden; ">
<tr valign="top">
		<td class="tableHeaderText" width="6%" align=center>Date</td>
		<td class="tableHeaderText" width="5%" align=center>Time</td>
		<td class="tableHeaderText" width="6%" align=center>Pan</td>
		<td class="tableHeaderText" width="8%" align=center>Transaction Status</td>
		<td class="tableHeaderText" width="5%" align=center title="Transaction Amount">Tran. Amt</td>
		<td class="tableHeaderText" width="5%" align=center title="Card Issuer Amount">C. I. Amt</td>
		<td class="tableHeaderText" width="5%" align=center title="Settlement Amount">Settle. Amt</td>
		<td class="tableHeaderText" width="4%" align=center title="Network Code">N/w Code</td>
	 	<td class="tableHeaderText" width="8%" align=center title="Card Acceptor Name">C. A. Name</td>
		<td class="tableHeaderText" width="4%" align=center title="">CSV Option</td>
		
</tr>
</table> 
</div>
<DIV id="tab1" name="tab1" STYLE="overflow: auto; height: 300; width: 835; padding-left: 2px; padding-right: 2px; margin: 0px; border: 1px #BABABA solid; border-top: 0px; ">
<table align="center" width="980" cellspacing="2" cellpadding="1" class="outerTable" border=0  style=" overflow: hidden;" >
	<?
 	 If($invalid_count>0)
	 {  $str.="\n Invalid Transactions\n";
		for($i=0;$i<$invalid_count;$i++)
		{
			$j=0;
	?>		
<!-- 		<form name="frm<?=$i?>" method="post" action="cpos/modules/merchant/downloadincsvformat.php"> -->
			<tr>
				<?$str.=$invalid_transaction[$i][$j];?>
	 			<td class="formField" width="6%" align=center><?=$invalid_transaction[$i][$j++]?></td>
				<?$str.=",".$invalid_transaction[$i][$j];?>
				<td class="formField" width="5%" align=center><?=$invalid_transaction[$i][$j++]?></td>
				<?$str.=",".$invalid_transaction[$i][$j];?>
				<td class="formField" width="6%" align=center><?=substr($invalid_transaction[$i][$j],0,4)."****".substr($invalid_transaction[$i][$j],-4);$j++;?> </td>
				<?$str.=",".$invalid_transaction[$i][$j];?>
				<td class="formField" width="8%" align=center><?=$invalid_transaction[$i][$j++]?></td>
				<?$str.=",".$invalid_transaction[$i][$j];?>
				<td class="formField" width="5%" 
				align=center><?=number_format(round($invalid_transaction[$i][$j++],2))?></td>
				<?$str.=",".$invalid_transaction[$i][$j];?>
				<td class="formField" width="5%" align=center><?=number_format(round($invalid_transaction[$i][$j++],2))?></td>
				<?$str.=",".$invalid_transaction[$i][$j];?>
				<td class="formField" width="5%" align=center><?=number_format(round($invalid_transaction[$i][$j++],2))?></td>
				<?$str.=",".$invalid_transaction[$i][$j];?>
				<td class="formField" width="4%" align=center><?=$invalid_transaction[$i][$j++]?></td>
				<?$str.=",".$invalid_transaction[$i][$j];?>
 				<td class="formField" width="8%" align=center><?=$invalid_transaction[$i][$j++]?></td>
				<?$str.=",".$invalid_transaction[$i][$j];?>
				<td class="formField" width="4%" align=center><img src="cpos/images/csv.gif"  onclick="download('<?=$str?>','activity')" title="Export to CSV format and download">&nbsp;&nbsp;<a href='mailto:' ><img src="cpos/images/download.gif" title="Export to CSV format and send via email" onclick="download('<?=$str?>','activity')" border=0></td>
				<input type=hidden name="invalidtxn_value<?=$i?>" value="<?=$str?>">
				<?
					  $global_str=$global_str."\n".$str;
					  $str="";
				?>

			</tr>

			 
	<?		   
		}
	 }
	 else
	{?>
			<tr>
						<td class="formField" width="100%" align=center><B>No Invalid Transaction Found</B></td>
			</tr>
<?	}
	$_SESSION['global_str']=$global_str;
	?>

</table>
</div><form>
</table></form>


<script>
	
	document.body.onmouseover = scrollHeader;
	document.getElementById('tab').onmousemove = scrollHeader;
	document.getElementById('tab').onscroll = scrollHeader;
	document.getElementById('tab1').onmousemove = scrollHeader;
	document.getElementById('tab1').onscroll = scrollHeader;


	var maxScroll=0;
	var minScroll=0;
	if(navigator.appName == 'Netscape')
			document.captureEvents(Event.MOUSEMOVE);

function scrollHeader(e)
{
		document.getElementById('head1').scrollLeft = document.getElementById('tab1').scrollLeft;
		document.getElementById('head').scrollLeft = document.getElementById('tab').scrollLeft;
}
<?
}
/*-----------------------------------------------------------------------------------------------*/
?>
</script>
<script>

function SubmitForm(doc)
{
	if(document.activity.merchantTxnId.value==0)
	{
		alert("Please Select The Merchant Id");
		document.activity.merchantTxnId.focus();
		return false;
	}
	else if(document.activity.fromDate.value!="" && document.activity.toDate.value=="")
	{
		alert("Please Enter 'End Date'");
		document.activity.toDate.focus();
		return false;
	}
	else if(document.activity.fromDate.value=="" && document.activity.toDate.value!="")
	{
		alert("Please Enter 'Start Date'");
		document.activity.fromDate.focus();
		return false;
	}
 	else
	{
	doc.action="index.php?directory=modules&subdirectory=merchant&function=merchant_report&menu_type=activity_report";
		activity.submit();
	}
	return true;
}

function download(i,pg)
{	
	document.activityaftersubmit.action="cpos/modules/merchant/downloadincsvformat.php?val="+i+"&page="+pg;
	activityaftersubmit.submit();
}
</script>