<?

function AccountNo($sel_acc='')
{
	global $zetadb;
    
		$sel_qry="select client_id from ".TBL_CLIENT_MASTER_ID." where login_id='".$_SESSION['loginid']."'";
		$rs=$zetadb->Execute($sel_qry);
		$rs_data=$rs->FetchNextObject();
		$client_id=$rs_data->CLIENT_ID;

  return $client_id;
}

function AcountDetail($client_id)   //for account statement
{
   global $zetadb;
    
   if($client_id!="" && $client_id!="0" && $client_id!="1")
	{
	   $cli="cli.client_id in ('$client_id')";
	}
   elseif($client_id=="1")//for all
	{
	    $client_id=getLocationClientId();
	    $cli="cli.client_id in ('$client_id')";
	}
	else
		$cli="";

	if($cli!="")
	{
		$sel_qry="select distinct con.cnt_first_name,con.cnt_last_name,cli.client_id, cli.cli_host_provider,cli.cli_business_text from ".TBL_CLIENT_DETAIL." as cli,".TBL_CLIENT_CONTACTS." con where $cli and con.client_id=cli.client_id and cli.active='Y' and con.active='Y' and cli.cli_status in ('P','A')";
		$rs=$zetadb->Execute($sel_qry);
	}

  return $rs;
}

function MerchantTxnDetail($start=0,$end)
{
	global $zetadb;
	
	$sel_qry="select sum(CASE when n.dad_transaction_amount > 0 THEN dad_transaction_amount end) " .
			 " as tot_trans_amt,count(*) as cnt from ".TBL_CGI_TRANSACTION_DETAIL." n," .
			 "".TBL_TRANS_DEVICE_ASSIGNMENT." t,".TBL_CLIENT_MASTER_ID." m  where m.login_id='".$_SESSION['loginid']."' " .
			 "and t.dva_client_id=m.client_id and " .
			  " n.dad_card_acceptor_terminal=substring(t.dva_device_serial_number,5)" .
			  " and dva_status='ACTIVE' group by m.client_id";
	
	 $rs=$zetadb->Execute($sel_qry);
	 $count=$zetadb->Affected_Rows();


	 $sql_terminal="select n.dad_card_acceptor_terminal,n.dad_network_code,n.dad_card_acceptor_name,n.dad_transaction_amount,n.dad_local_datetime from ".TBL_CGI_TRANSACTION_DETAIL." n,".TBL_TRANS_DEVICE_ASSIGNMENT." t,".TBL_CLIENT_MASTER_ID." m where 	m.login_id='".$_SESSION['loginid']."' and t.dva_client_id=m.client_id and n.dad_card_acceptor_terminal=substring(t.dva_card_acceptor_terminal,5) and dva_status='ACTIVE' limit ".$start.",".$end."";
     $result=$zetadb->Execute($sql_terminal);

 return array($rs,$count,$result);
}

function getLocationClientId()
{
	global $zetadb;

    //$getClientid="select client_id from TBL_CLIENT_DETAIL where cli_chain_id='".$_SESSION['admin_cli_id']."'";
	$getClientid="select client_id from ".TBL_CLIENT_DETAIL." where head_office_id='".$_SESSION['admin_cli_id']."' and active='Y'";
    $result=$zetadb->Execute($getClientid);
	while($res_sel=$result->FetchRow())
	{
		if($client_id=="")
			$client_id=$res_sel['client_id'];
		else
			$client_id=$client_id.",".$res_sel['client_id'];
	}
 return $client_id;
}


function MerchantTxnDetailForHeadoffice($start,$end)
{
	global $zetadb;

	$client_id=getLocationClientId();

	$sql_summary_data="select sum(CASE when n.dad_transaction_amount > 0 THEN dad_transaction_amount end) as 
						tot_trans_amt,count(*) as cnt
						from ".TBL_CGI_TRANSACTION_DETAIL." n,".TBL_TRANS_DEVICE_ASSIGNMENT." t where  t.dva_client_id in ('$client_id') and 
						n.dad_card_acceptor_terminal=substring(t.dva_card_acceptor_terminal,5) and dva_status='ACTIVE'";
    $res_summary_data=$zetadb->Execute($sql_summary_data);
	$count=$zetadb->Affected_Rows();
	
	$sql_get_trans_data="select n.dad_card_acceptor_terminal,n.dad_card_acceptor_name,n.dad_transaction_amount, 					n.dad_local_datetime from ".TBL_CGI_TRANSACTION_DETAIL." n,".TBL_TRANS_DEVICE_ASSIGNMENT." t where  		
						t.dva_client_id in 	('".$client_id."') and dad_card_acceptor_terminal=substring(t.dva_card_acceptor_terminal,5) and dva_status='ACTIVE' limit ".$start.",".$end."";
    $res_trans_data=$zetadb->Execute($sql_get_trans_data);


  return array($res_summary_data,$count,$res_trans_data);
}




function createclientcombo($client_id,$show_all)
{
	global $zetadb;

	$cli_id['0']="Select Client Id";

	if($_SESSION['admin_cli_id']!="")
//		  $sel="select client_id from ".TBL_CLIENT_DETAIL." where cli_chain_id = '".$_SESSION['admin_cli_id']."'";
		  $sel="select client_id from ".TBL_CLIENT_DETAIL." where head_office_id = '".$_SESSION['admin_cli_id']."' and active='Y'";
	else
  		  $sel="select client_id from ".TBL_CLIENT_DETAIL." where client_id = '".$client_id."' and active='Y'";
	
    $rs_sel=$zetadb->Execute($sel);				  
    
	if(($zetadb->Affected_Rows($rs_sel)>1) && ($show_all=='yes'))
		$cli_id['1']="ALL";
	
	while($fetch_rs=$rs_sel->FetchRow())
    {
	   $cli_id[$fetch_rs['client_id']]=$fetch_rs['client_id'];
    }

  return $cli_id;
}


 function getLatestInvoice($value)
 {	
	global $path;
	global $i;

	$fname=$_SESSION['fname'];
//	$month=date("F", mktime(0, 0, 0, date('m')-$value, 1, date('Y')));
	$d=date("Y-F", mktime(0, 0, 0, date('m')-$value, 1, date('Y')));
	$dd=explode("-",$d);
	$currentyear=$dd[0];
	$month=$dd[1];
	$file_path=$path."merchant/".$_SESSION['loginid']."/".strtolower($fname)."-".$month."-".$currentyear.".pdf"; 
	
	if(file_exists($file_path))
	 {
		$flag=1;
	 }
	 else
	 {
		$i=$i+1;
		$flag=0;
		if($i <= 12) 		 
		 {
			$inner_value=getLatestInvoice($i);
		 
			if($inner_value)
				return ($inner_value);
		}
		else
		 {
				return ($inner_value);
		 }
	 }

	if($flag==1)
	 {
		return ($file_path);
	 }
		
 }

function getTransactionStatus($code)
{
   global $zetadb;

    $sql="select description from ".TBL_TRANS_TRANSACTION_STATUS." where response_code='".$code."'";
	$rr=$zetadb->Execute($sql);
	$des=$rr->FetchNextObject();

	return $des;
}

function getCurrencyTitle($code)
{
   global $zetadb;

   $sql="select concat(title,' (',symbol_right,') ') as currency_title from ".TBL_SYSTEM_CURRENCIES." where code='".$code."'";
	$rr=$zetadb->Execute($sql);
	$des=$rr->FetchNextObject();

	return $des;
}
/*function getTransactionResult($code)
{
   global $zetadb;

	if($code=='00')
		$reason="Approved or Completed Successfully";
	elseif($code=='05')
		$reason="Declined,Do not honour";
	elseif($code=='63')
		$reason="MAC Security Failure";
	elseif($code=='81')
		$reason="Invalid PIN Block";
	elseif($code=='51')
		$reason="Insufficiant Funds";

	return $reason;
}*/

function getTerminalId()
{
   global $zetadb;

	$sql_terminal="select count(*) as cnt from ".TBL_TRANS_DEVICE_ASSIGNMENT." where client_id='".$_SESSION['admin_cli_id']."' and dva_status='ACTIVE'";
	$rr=$zetadb->Execute($sql_terminal);
	$des=$rr->FetchNextObject();
	$terminal=$des->CNT;

	return $terminal;
}
function create_date($d)
{
	$date=substr($d,0,4)."-".substr($d,4,2)."-".substr($d,6,2);
	return $date;
}

function getNoticeData($noticeid="")
{
	 global $zetadb;

	$prev_month_date=date("Y-m-d",mktime(0,0,0,date("n")-1,1,date("Y"))); 
	$today=date('Y-m-d');

    if($noticeid!="")
		$where=" and notice_id='".$noticeid."'";
	else
		$where=" ";

	$sel_notice="select * from ".TBL_MERCHANT_NOTICE." where notice_date between '".$prev_month_date."' and '".$today ."'  $where order by notice_id desc ";

	$r_notice=$zetadb->Execute($sel_notice);

	return $r_notice;
}

?>
