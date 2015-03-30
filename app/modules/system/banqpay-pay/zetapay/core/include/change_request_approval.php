<?php
/*
 * Created on Feb 8, 2006
 *
 * To change the template for this generated file go to
 * Window - Preferences - PHPeclipse - PHP - Code Templates
 */
//include("operation_function.inc.php");
//include("cpos/modules/sale/sales_common.inc.php");
?>
<form name="frmOrder" method="POST" action="<?echo $operChangeReqPath?>">
<table border="0" cellspacing="0" align=left cellpadding="0" width="100%" >
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
			  	<td class="formLabel" width='12%'>Order ID</td>
				<td class="formFieldRequired" width='35%'>
				<input type="text" name="txtorder_id" value="<?echo $base->input['txtorder_id'] ?>" class='inputLong' />
				</td>
				<td class="formLabel" width='13%'>Client ID</td>
				<td class="formFieldRequired" width='41%'>
				<?getClientIdNameCombo("txtclient_id",'No',$base->input[txtclient_id])?>
				</td>
			  	
				<!--<input type="text" name="txtclient_id" value="<?//echo $base->input['txtclient_id'] ?>" class='inputLong' />-->
				
			</tr>
			<tr>
				<td class="formLabel" width='12%'>Order Status</td>
				<td class="formFieldRequired" width='35%'>
				<!--<input type="text" name="txt_order_status" value="<?//echo  ?>" class='inputMed' />-->
				<?// getOrderStatusCombo("txt_order_status",$base->input['txt_order_status'],"class='inputLong'");?>
			
                 <select name="txt_order_status" >
					<option value="change_request">Change Request</option>
					<option value="other">Other</option>
				</select>
				</td>
				<td class="formLabel" width='13%'>Assigned To</td>
				<td class="formFieldRequired" width='41%'>
				<?fetchOperationSalesList("txt_assign_to","inputLong",false,true,'','Yes');?>
				<!--<input type="text" name="txt_assign_to" value="<?//echo $base->input['txt_assign_to'] ?>" class='inputLong' />-->
				</td>
			</tr>
			<tr>
				<td class="formLabel" width='12%'>Creation Date</td>
				<td class="formFieldRequired" width='35%'>
				<input type="text" name="txt_creation_date" value="<?echo $base->input['txt_creation_date'] ?>" class='inputMed' readonly/>
				<img name="imMF_1"  src="cpos/images/small-calendar.jpg" border="0" onClick="javascript:show_calendar('frmOrder.txt_creation_date');">
				</td>
				</td><td class="formLabel" align=left >Client Name</td>
				<td class="formFieldRequired" align=left><input type="text" name="txtclient_name" value="<? echo $base->input['txtclient_name']?>" class='inputLong'></td>
			</tr>
		 </table>		 
		</td>
	</tr>
	<tr>
		<td  align='right'>
			<input class="inputBtnMed" type="reset" name="reset" value="Clear" />
			<input class="inputBtnMed" type="submit" name="frmedit" value="Search" onclick="return chkSearchOrdervalidation(this.form)"/>
		</td>
	</tr>	
	<tr height = "40" valign="top">
		<td width="100%">
		<?if($base->input['frmedit'])
	  	  {?>
		
			<table width="100%" cellspacing="2" cellpadding="1" class="outerTable" >
    	 		<tr>
					<td class="tableHeaderText" width="3%" align=center nowrap>&nbsp;</td>
					<td class="tableHeaderText" width="10%" align=center nowrap>Order Id</td>	
					<td class="tableHeaderText" width="15%" align=center nowrap>Client Id</td>
					<td class="tableHeaderText" width="20%" align=center nowrap>Order Status</td>
					<td class="tableHeaderText" width="20%" align=center nowrap >Client Name</td>
					<td class="tableHeaderText" width="15%" align=center nowrap>Assigned To</td>
					<td class="tableHeaderText" width="20%" align=center nowrap>Creation Date</td>		
				</tr>
						 
 	 	<?
		 			 	
		 	if($base->input['txtclient_id']!="")
			$where=" orders.client_id= '".$base->input['txtclient_id']."' and";
			

			if($base->input['txtorder_id']!="")
				$where.=" orders.order_id= '".$base->input['txtorder_id']."' and";
			
	
			if($base->input['txtclient_name']!="")
				$where.=" clients.cli_operating_text like '%".addslashes($base->input['txtclient_name'])."%' and";
			
			if($base->input['txt_assign_to']!="")
				$where.=" orders.ord_assigned_to like '%".addslashes($base->input['txt_assign_to'])."%' and";
	
			if($base->input['txt_creation_date']!="")
			{
					//$txt_creation_date=str_replace("-","",$base->input['txt_creation_date']);
					$where.=" orders.creation_date like '%".$base->input['txt_creation_date']."%' and";
			}
			if($base->input['txt_order_status']!="")
				$where.=" orders.ord_status like '%".$base->input['txt_order_status']."%' and";
			 
		
		 $where=rtrim($where," and");
		 $where=$where." orders.active='C' and clients.active='C' ";
		 $start=$base->input['start'];
		 $end=$base->input['end'];
		 $selpagevalue=$start;
		 $base->input['selpage']=$start;
		 if($start=="")
		    $start=0;
		 if($end=="") 
		 	$end=$rec_per_page;
		
		$objSearch=new insertDetails();
		$query=$objSearch->getAllClientId($where);
		//$query = $query."  limit ".$start.",".$end ;
		$r=$zetadb->Execute(str_ireplace("SQL_CALC_FOUND_ROWS","",$query));

		 //	$r=$objsearch->searchOrder();
		 	
		 	if($zetadb->Affected_Rows())
		 	{
		 		while($res=$r->FetchRow())
		 		{
		 			if(($i%2)==0)	
						$class="oddRow";
					else
						$class="evenRow";
					
						$showclass++;

					//	extractDateFromTime()  define in Common_Function.php
			?> 	   <tr>
			<input type='checkbox' value='' name='chk_approval'>
						<td class="<?echo $class?>" width="10%" align=center nowrap>
						<a href="#" onclick="assignValueTohidden('<? echo $res['order_id']?>','<? echo $res['client_id']?>','<? echo $res['ord_assigned_to'] ?>')" title='Click to Edit Order'><U><? echo $res['order_id']?></U></a></td>	
						<td class="<?echo $class?>" width="15%" align=center nowrap><?echo $res['client_id'];?></td>
						<td class="<?echo $class?>" width="20%" align=center nowrap><?echo getOrderStatus($res['ord_status']);?></td>
						<td class="<?echo $class?>" width="20%" align=left nowrap><? echo "<span title='".str_ireplace("'","",$res['cli_operating_text'])."'>".substr($res['cli_operating_text'],0,20)."</span>"; ?></td>
						<td class="<?echo $class?>" width="15%" align=center nowrap><?echo $res['ord_assigned_to'];?></td>
						<td class="<?echo $class?>" width="20%" align=center nowrap><?echo $res['creation_date'];?></td>		
						
				 	</tr>
			 <?$i++;
			 	}
		  	   }
		  	   else
			   {?>
		   	<tr>
					<td class="formField" width="100%" align=center colspan=8><b>No Record Found</b></td>		
			</tr>  	
			 <? }
		}
   	?>
    <input type='hidden' value="" name="order_id">
  	<input type='hidden' value="" name="client_id">
  	<input type='hidden' value="" name="salesagentid">
  	
    </table> 
   </table>
  </form> 
<script language="JavaScript" type="text/javascript">
function assignValueTohidden(order_id,client_id, assigned_to)
{	
 	document.frmOrder.order_id.value=order_id;
	document.frmOrder.client_id.value=client_id;
	document.frmOrder.salesagentid.value=assigned_to;
		
	document.frmOrder.action="index.php?directory=modules&subdirectory=operation&function=oper_order&menu_type=oper_new_order";
	frmOrder.submit(); 
}
/*
function chkvalidation(formname)
{
	if(formname.txtorder_id.value=="" && formname.txtclient_id.value=="")
	{
		alert("Please Enter Alteast One Seach Criteria") ;
		return false;
	}
	return true;
}*/
 
</script>
