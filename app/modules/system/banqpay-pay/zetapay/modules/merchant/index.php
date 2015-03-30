<?
   session_start();

	 include("merchant_function.inc.php");
	 $i=1;

	$_SESSION[page]='index';

	 /*------For Finding the latest invoice----*/

	 $latest_invoice=getLatestInvoice($i);
     $invoice_link_name=explode("/",$latest_invoice);
	 $invoice_link_name=$invoice_link_name[count($invoice_link_name)-1];	
	 

	 /*---find the client id for logged in user---*/

	 $client_id=AccountNo();				
	 $base->input[accountNumber]=$client_id;
	 $_SESSION[top_item]="";

	/*-------Notice Detail---------------*/
	$r_notice=getNoticeData();
	if($zetadb->Affected_Rows()==0)
	{
		$notice="No";
	}
	/*-----------------------------------*/	
	
?>
	
<form name="frm_index" method="post" action="">
<table border="0" cellspacing="0" align=center cellpadding="0" width="100%" height="320" >

<?if($notice!='No'){?>
<tr><td>
<br>
	<table border=0 align="center" width="100%" cellspacing="2"  cellpadding="1" class="outerTable">
	<tr valign="top">
				<td class="formLabel"  colspan=3 ><font color='Red'><B><U>CollectivePOS Important Messages</U></B></font></td>
				<td class="formLabel" align='right' width='10%'><a href="<?echo $popupwindow?>merchant_notice.php" target='_BLANK'><B>All Messages</B></a></td>
	</tr>
	<!-- <tr valign="top">
				<td class="formLabel"  colspan=4 >&nbsp;</td>
	</tr> -->
	<?
		while($rr_notice=$r_notice->FetchRow())
		{
			$notice_id=$rr_notice['notice_id'];
			$notice_title=$rr_notice['title'];
			$notice_msg=$rr_notice['message'];
			$notice_yr=substr($rr_notice['notice_date'],0,4);
			$notice_mon=date('F',mktime(0,0,0,substr($rr_notice['notice_date'],4,2)));
			$notice_d=substr($rr_notice['notice_date'],6,2);
			$notice_date=$notice_mon." ".$notice_d." ,".$notice_yr;
			?>
			<tr valign="top">
				<td class="formLabel" width='7%'><? echo $notice_date?></td><td class="formLabel" width='1%'>-</td><td class="formLabel" width='35%' colspan=2  ><a href='<?echo $popupwindow?>merchant_notice.php?id=<?=$notice_id?>' target='_BLANK'> <?=$notice_title?></a></td>
			</tr>
		<?}?>
	</table>
<?}?>
</td>
</tr>

<tr height="40" valign="top">
<td width="100%">
	<table border="0" cellspacing="0" align=left cellpadding="0" width="90%">
		<tr>
			<td class="subtitle"><?=ucfirst($data->TYPE)?> Activity Summary</td>
		</tr>
	</table>
</td></tr>
<tr valign="top">
 <td>
	<table align="center"  width="100%" cellspacing="2" cellpadding="1" border=0 class="outerTable">
	<?
			/*----------For Client Detail-------*/

		$sql_cli="select cli_operating_text from ".TBL_CLIENT_DETAIL." where client_id='".$base->input[accountNumber]."' and active='Y'";
		$rs_cli=$zetadb->Execute($sql_cli);
		$res_cli=$rs_cli->FetchNextObject();
		
		/* ------------For Header Description------------------------------*/

		$sql_loc="select ltn_street_number,ltn_street_name,ltn_city,ltn_postal,ltn_state_code from ".TBL_CLIENT_LOCATION_DETAILS." where client_id='".$base->input[accountNumber]."' and location_id=2 and active='Y'";
		$rs_loc=$zetadb->Execute($sql_loc);
		$res_loc=$rs_loc->FetchNextObject();

			
		if($_SESSION['admin_cli_id']!="")  		/*----For checking the Head Office -----*/
		{	
			$client_id=getLocationClientId();		// Find the Location Id of the Head Office

			$client_id_full=str_replace(",","','",$client_id);

			/*-----Find the Total Terminal ID -------*/
			$sql_ter="select count(*) as cnt from ".TBL_TRANS_DEVICE_ASSIGNMENT." where dva_client_id in ('".$client_id_full."') and dva_status='ACTIVE'";
			$rs_ter=$zetadb->Execute($sql_ter);
			$rs_ter1=$rs_ter->FetchNextObject();
			$tot_terminal=$rs_ter1->CNT;
			$groupby="group by dad_network_code";
			$lable="Total Amount Billed This Period For All Locations";
		}
		else
	    {
			//For Single user
			$client_id=AccountNo();
			$client_id_full=$base->input[accountNumber]; // Clinet Id In Form CLI-4000010008
			
			/*-----Find the Terminal ID -------*/
			$sql_ter="select dva_device_serial_number from ".TBL_TRANS_DEVICE_ASSIGNMENT." where dva_client_id in ('".$client_id_full."') and dva_status='ACTIVE'";
			$rs_ter=$zetadb->Execute($sql_ter);
			$rs_ter1=$rs_ter->FetchNextObject();
			$terminal_id=$rs_ter1->DVA_DEVICE_SERIAL_NUMBER;
			$groupby="group by dad_card_acceptor_id";
			$lable="Total Amount Billed This Period ";
		}
	   
	/*------Create Client Id for Transaction table (By taking Last 4 Character called client_id_short)------- 

		$client_id = explode(",", $client_id);
		for ($i = 0; $i < count($client_id); $i++)
		{
			if($client_id_short =="")
				$client_id_short = substr($client_id[$i], -4);
			else
				$client_id_short=$client_id_short."' || dad_card_acceptor_id like '%".substr($client_id[$i], -4);
		}

		/*--------------Find Different Card Assigned to the Client----------------------*/


		$i=0;
		$total_sat_amt=0;
		$total_txn_amt=0;
		$total_bill_amt=0;

		/*-----------Find the Previous Month Date------------------*/

		$toDate= date("Ym",mktime(0,0,0,date("n")-2,1,date("Y"))); 
		$toDate=$toDate."%";
		$formDate= date("Ymt",mktime(0,0,0,date("n")-1,1,date("Y")));

		$StatementDatePdf= date("Y-m-d",mktime(0,0,0,date("n")-1,1,date("Y")))." To ".date("Y-m-t",mktime(0,0,0,date("n")-1,1,date("Y"))); 
	
		
		include("billing_summary.inc.php");
	?>

	<table border=0 align="center" width="100%" cellspacing="2" cellpadding="1" class="outerTable">
		<tr valign="top">
			<td class="formLabel" width='35%' ><B><?=$client_operating_name?></B></td>
		</tr>
		<tr valign="top"   align=Left>
			<td class="formLabel" width='35%' colspan=2 ><?=$client_street_number.",".$client_street_name?></td>
		</tr>

		<tr valign="top"   align=Left>
			<td class="formLabel" width='35%' colspan=2 > <?=$client_city.",".$client_state.",".$client_postal?></td>
		</tr>
			<?
			 //$title="Merchant Activity Summary \n\n";
			 $title="\r\n ".$client_operating_name."\r\n ".$client_street_number.", ".$client_street_name." ,\r\n ".$client_city.", ".$client_state.",\r\n ".$client_postal."\n";
			 $_SESSION['title']=$title;
			?>
	
	</table>
	
	<table align="center" width="100%" cellspacing="2" cellpadding="1" class="outerTable">
		
		<tr><!-- Merchant Activity Summary -->
			<div class="heading" align=left>&nbsp;</div>
		</tr>
		 
		<tr valign="top">
		 <td>
			<?if($_SESSION['admin_cli_id']!=""){?>
				<td class="formLabel" width=25%>CLI Chain ID</td>
				<td class="formField" style="padding-left:15px;"  width="25%"><?=$_SESSION['admin_cli_id'];?><?$top_item_index=$_SESSION['admin_cli_id']?></td>
			<?}else{?>
				<td class="formLabel" width=25%>CLI Account Number</td>
				<td class="formField" style="padding-left:15px;"  width="25%"><?=$base->input['accountNumber'];?><?$top_item_index=$base->input['accountNumber']?> </td>
			<?}?>
			<td class="formLabel" width="15%" >No of Transactions</td>
			<td class="formField" style="padding-left:15px;"  width="35%" align='right'><?=$total_txn_of_month;?><?$top_item_index.=";  ".$total_txn_of_month?></td>
		 </tr>
		<tr valign="top">
		 <td>
			<td class="formLabel" width="15%">Account Name </td>
			<td class="formField" style="padding-left:15px;"><?=$res_cli->CLI_OPERATING_TEXT;$top_item_index.="; ".$res_cli->CLI_OPERATING_TEXT ?></td>
	
			<td class="formLabel" width="15%" >Transactions $ Volume</td>
			<td class="formField" style="padding-left:15px;"  width="35%" align='right'>$<?=number_format($total_billing_amt,2);$top_item_index.="; $ ".$total_billing_amt?></td>
		 </tr>
		 <tr valign="top">
		 <td>
			<?if($_SESSION['admin_cli_id']!="")
			  {

			?>
				<td class="formLabel" width='15%'>Number Terminals </td>
				<td class="formField" style="padding-left:15px;"><?=$tot_terminal;?><?$top_item_index.="; ".$tot_terminal?></td>
			<?}
			else
			{?>
				<td class="formLabel" width=15%>Terminal Id</td>
				<td class="formField" style="padding-left:15px;"><?=$terminal_id;?><?$top_item_index.="; ".$terminal_id?></td>
			<?}?>

			<td class="formLabel" width="25%">Current Billing Cycle</td>
			<td class="formField" style="padding-left:15px;"  width="25%" align='right'><B><?=$DisplayStatementDate= date("F Y",mktime(0,0,0,date("n")-1,1,date("Y")));?><?$top_item_index.="; ".date("F Y",mktime(0,0,0,date("n")-1,1,date("Y"))) ?></B></td>
		 </tr>
		 <tr>
			<td>
			<td class="formLabel" width=15%>&nbsp;</td>
			<td class="formField" style="padding-left:15px;">&nbsp;</td>
			
			<td class="formLabel" width="15%">Invoice</td>
			<td class="formField" style="padding-left:15px;"  width="35%" align='right'>
			<?
			if($total_txn_of_month!=0)
			{
			   if($latest_invoice!=""){?>
				<a href="<?=$latest_invoice?>" target="_BLANK"><img src="cpos/images/csv.gif" border=0 title="Download Latest Invoice : <?= $invoice_link_name?>"></a> 
				<?}
				else
				{
				?>
					<img src="cpos/images/csv.gif" border=0 onclick="alert('Invoice Not Found')">
				<?}
				?>&nbsp;&nbsp;<img src="cpos/images/print.gif" title="Print" onclick="print()">&nbsp;&nbsp;<img src="cpos/images/adobelogo.gif" title="Dowload in PDF Format" onclick="window.open('<?echo $popupwindow?>createpdf.php')" target='_BLANK'></td> 
			 <?}?>
				
		 </tr>
		
 </table>
<!-- /*---------------------------------------------------------*/ -->
</td >
</tr>

	<tr valign="top">
	<td> 
  	<br>
		  <table align="center"  width="100%" cellspacing="2" cellpadding="1" border=0 class="outerTable">
				<tr valign="top"  rowspan=3>
				<td class="formLabel" width='35%' ><B><?=$lable?>: </B></td><td class="formLabel" width='35%' align='right' ><B>$<?=number_format($total_billing_amt,2);?><?$top_item_index.="; $ ".$total_billing_amt?></B></td>
			</tr>	
		</table>
		
		<br>
		<table align="center"  width="100%" cellspacing="2" cellpadding="1" border=0 class="outerTable">
		<tr>
			<div class="heading" align=left>Billing Summary</div>
		</tr>
	    <tr>
			<td class="tableHeaderText" align="center" width='20%'>Card Type </td>
			<!-- <td class="tableHeaderText" align="center">Discount Rate</td> -->
			<td class="tableHeaderText" align="center" width='15%'>#of Transactions  Totals  </td>
			<td class="tableHeaderText" align="center" width='15%'>Settlement</td>
			<td class="tableHeaderText" align="center" width='20%'>Transaction Fees</td>
			<td class="tableHeaderText" align="center" width='15%'>Transaction Surcharge</td>
			<td class="tableHeaderText" align="center" width='15%'>Billing Total</td>
		</tr>
 </td >
</tr>
	
<?
if(count($arr_creditCard)>0 )	
  {		
		for($i=0;$i<count($arr_creditCard);$i++)
		 {
				
				if(($i%2)==0)
					$formField="oddRow";
				else
					$formField="evenRow";


				$j=0;
			?>
					<tr>
						<td class="<?=$formField?>"  align="left"><?=$arr_creditCard[$i][$j++]?></td>
						<!-- <td class="<?//=$formField?>"  align="center"><?//=$arr[$i][$j++]?></td> -->
						<td class="<?=$formField?>"  align="center"><?=$arr_creditCard[$i][$j++]?></td>
						<td class="<?=$formField?>"  align="center"><?=$arr_creditCard[$i][$j++]?></td>
						<td class="<?=$formField?>"  align="center"><?=$arr_creditCard[$i][$j++]?></td>
						<td class="<?=$formField?>"  align="center"><?=$arr_creditCard[$i][$j++]?></td>
						<td class="<?=$formField?>"  align="center"><?=$arr_creditCard[$i][$j++]?></td>
			</tr>
		<?	}
			$formField2=$formField;
			for($i=0;$i<count($arr_otherCard);$i++)
		 	{
				
				if($formField2=="evenRow")
				{
					if(($i%2)==0)
						$formField="oddRow";
					else
						$formField="evenRow";
				}
				else
				{
					if(($i%2)==0)
						$formField="evenRow";
					else
						$formField="oddRow";
				}

				if($arr_otherCard[$i][0]=='Total')
					$formField="tableHeaderText";

				$j=0;
			?>
					<tr>
						<td class="<?=$formField?>"  align="left"><?=$arr_otherCard[$i][$j++]?></td>
						<!-- <td class="<?//=$formField?>"  align="center"><?//=$arr[$i][$j++]?></td> -->
						<td class="<?=$formField?>"  align="center"><?=$arr_otherCard[$i][$j++]?></td>
						<td class="<?=$formField?>"  align="center"><?=$arr_otherCard[$i][$j++]?></td>
						<td class="<?=$formField?>"  align="center"><?=$arr_otherCard[$i][$j++]?></td>
						<td class="<?=$formField?>"  align="center"><?=$arr_otherCard[$i][$j++]?></td>
						<td class="<?=$formField?>"  align="center"><?=$arr_otherCard[$i][$j++]?></td>
			</tr>
		<?	}
			$_SESSION['acc_str']=$str;
		   
	  }
	  else
	  {
		   $_SESSION['acc_str']="";
		  ?>
			<tr>
				<td class="formField"  align="left" colspan=9><B>No Record Found</B></td>
			</tr> 
	 <?}?>
		
		
</table>



</td >
</tr>
	<tr valign="top">
	<td>
		<?
			include("transaction_summary.inc.php");
		?>


</form>
<br/>
</td></tr>
</table>
<script>
function SubmitForm(doc)
{

	doc.action="index.php";
	frm_index.submit();

	return true;
}
function download(pg)
{	
	document.frm_index.action="cpos/modules/merchant/downloadincsvformat.php?page="+pg;
	frm_index.submit();
}
function openpdf()
{	
	document.frm_index.action="createpdf.php";
	frm_index.submit();
}

</script>
