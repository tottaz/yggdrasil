<?
	include_once("merchant_function.inc.php");
	include("cpos/modules/operation/operation_function.inc.php");
	require_once('cpos/modules/sale/sales_common.inc.php');
	
	$cli_id=createclientcombo($client_id,'No');// for creating the combo


	if($base->input['send']=='Submit')
	{
	//	$to="";
		$to="sanjeev.tyagi@induslogic.com";
		$from=$base->input['from'];
		$message=$base->input['message'];
		$subject=$base->input['subject'];
		$r=wrapmail($to,$subject,$message,$from);
		if($r==1) 	
			$msg="Your Request Has Been Forwarded To The Concern Person";
		else
			$msg="Please Try Again";
	}
//	print $_REQUEST['subSupportTicket'];
if($_REQUEST['subSupportTicket']=="Submit Ticket" && $isTokenValid)
{
	$objSupportTicket=new SupportTicket;
	   
		$objSupportTicket->client_id=$base->input['sel_client_id'];
		$objSupportTicket->status=$base->input['ticket_status'];
		$objSupportTicket->call_code=$base->input['callcode']; 
		$objSupportTicket->merchant_name="";//$base->input['merchant_name'];
		$objSupportTicket->contact_name="";//$base->input[''];
		$objSupportTicket->terminal_id =$base->input['selTerminalId'];
		$objSupportTicket->terminal_type="";//$base->input[''];          
		$objSupportTicket->manufacture_serial_no=$base->input['manufSerialNo'];     
		$objSupportTicket->swap_terminal_type="";//$base->input[''];       
		$objSupportTicket->swap_manufacture_serial_no="";//$base->input[''];
		$objSupportTicket->rep_fault_code =$base->input['repFaultcode'];      
		$objSupportTicket->rep_notes  =$base->input['txtReportedNotes'];         
		$objSupportTicket->action_notes=$base->input['txtActionNotes'];     
		$objSupportTicket->action_repair_code=$base->input['repActioncode'];    
	
	
	$where=",creation_date=now(),creation_id='".$_SESSION[loginid]."'";
	$objSupportTicket->updateSupportTicketTable("insert",$where);
	$msg="Your Request Has Been Forwarded To The Concern Person";
}
?>

<table border="0" cellspacing="0" align=center cellpadding="0" width="100%">
	<tr valign="top">
	<td width="100%">
	<table border="0" cellspacing="0" align=center cellpadding="0" width="100%">
		<tr valign="top">
			<td align="center" class="subtitle"><font color=green><?=$msg?>&nbsp;</font></td>
		</tr>
	</table>
	</td></tr>
	<tr valign="top"><td>
	<table border="0" cellspacing="0" align=center cellpadding="0" width="100%">
		<tr valign="top">
			<td class="subtitle">Help Desk</td>
		</tr>
	</table>
      </td>
    </tr>
 <tr>
 <td>
 <form name="frmbilling" method="POST"  
 action="index.php?directory=modules&subdirectory=merchant&function=merchant_support&menu_type=help_desk">
<? renderHiddenCommonFields(); ?>
 <!--<table border="0" cellspacing="0" align=center cellpadding="0" width="100%" height="220" class='outerTable' >
 	<tr valign="top">
		<td width="100%" align="center" colspan=2>&nbsp;</td>
	</tr>
	  <tr valign="top">
		<td width="15%" class="formLabel" >Enter Your Email Id</td>
		<td width="75%" class="formFieldRequired"><input type=text class="inputLong" value="" name='from'></td>
	</tr>
 	<tr valign="top">
		<td width="15%"  class="formLabel" >Subject</td>
		<td width="75%"   class="formFieldRequired"><input type=text class="inputLong" value="" name='subject'></td>
	</tr>
	<tr valign="top">
		<td width="15%" class="formLabel">Message</td>
		<td width="75%" class="formFieldRequired"><textarea cols='50' rows='8' name='message'></textarea></td>
	 </tr>
	<tr valign="top">
		<td width="100%"  class="formLabel" colspan=2>&nbsp;</td>
	</tr>
  </table>
  </td>
  </tr>-->
  <table align="center" id="tickettable" name="tickettable" width="100%" cellspacing="2" cellpadding="1" border=0 class="outerTable">
	<tr>
		<td class="formLabel" width='15%'>Client ID</td>
		<td class="formField" width='35%' nowrap>
		<?writecombo($cli_id,"sel_client_id",'',$result->CLIENT_ID,'','','class=inputLong',"")?>
		<!--<a href="find_merchant.php" target='_BLANCK'>Find Merchant</a>-->
		</td>
		<td class="formLabel" width='15%'>&nbsp;</td>
		<td class="formField" width='35%'>&nbsp;
		<?//writecombo($clientid_arr[2],"merchant_name",'',$result->MERCHANT_NAME,'','','class=inputLong',"") ?>
		</td>
	</tr>
	<?include("cpos/modules/operation/support_ticket.php");?>
  </table>
</table> 
</form>
