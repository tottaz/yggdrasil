<?
//search
//print $base->input['search'];
if($base->input['search']=='active') 
  {		
		
		if(!empty($base->input['storename']))
		{
			if($base->input['match']=="exact")
				$storename=" and t.dad_card_acceptor like '".stripslashes($base->input['storename'])."'";
			else
				$storename=" and t.dad_card_acceptor like '%".stripslashes($base->input['storename'])."%'";
		}
		else
		{
			$storename=" ";
		}

		if(!empty($base->input['merchantTxnId']))
				$client_id=" and m.client_id = '".$base->input['merchantTxnId']."'";
		else
			$client_id=" ";

		
		if(!empty($base->input['sequenceno']))
			$sequenceno=" and dad_retrieval_reference_number = '%".$base->input['sequenceno']."%'";
		else
			$sequenceno=" ";

		if(!empty($base->input['amount']))
			$amount=" and dad_cardissuer_amount = '".$base->input['amount']."'";
		else
			$amount=" ";
		
		
		$fromdate=str_replace("-","",$base->input[fromDate]);
		$todate=str_replace("-","",$base->input[toDate]);

		if($fromdate!="" && $todate!="")     
		{
			$daterange=" and (DATE_FORMAT(t.dad_local_datetime, '%Y%m%d') between '".$fromdate."' and '".$todate."')"; 
		}
		
	

		if($_SESSION['admin_cli_id']!="")  //for checking the Head Office 
		{
			if(!empty($base->input['merchantTxnId']) && $base->input['merchantTxnId']!=1)
				$client_id=$base->input['merchantTxnId'];
			else
				$client_id=getLocationClientId();
		}
		else
	    {
			if(!empty($base->input['merchantTxnId']))
				$client_id=$base->input['merchantTxnId'];
			else
				$client_id=AccountNo();
	    }
	
	/*-----------------------------------------------------------------------------------------*/		

		// Convert list of client_ids in card_acceptor like format
		
		$client_id_short = ConvertClientId($client_id);

 	// Searching directly from ".TBL_CGI_TRANSACTION_DETAIL." table for list of card_acceptor_ids


	
		$query="select distinct t.* from ".TBL_CGI_TRANSACTION_DETAIL." t where (t.dad_card_acceptor_id like '%".$client_id_short."') $sequenceno $daterange $amount ";
		

		$rs_query=$zetadb->Execute($query);
  }
  else
  {
			if($_SESSION['admin_cli_id']!="")  //for checking the Head Office 
			{
				if(!empty($base->input['merchantTxnId']) && $base->input['merchantTxnId']!=1)
					$client_id=$base->input['merchantTxnId'];
				else
					$client_id=getLocationClientId();
			}
			else
			{
				if(!empty($base->input['merchantTxnId']))
					$client_id=$base->input['merchantTxnId'];
				else
					$client_id=AccountNo();
			}

			$client_id = ConvertClientId($client_id);

		 	if(!empty($base->input['txnStatus']))
				$txnStatus=" and dad_response_code = '".$base->input['txnStatus']."'";
			else
				$txnStatus=" ";
 
			
			if(!empty($base->input['cardnumber']))
				$cardnumber=" and dad_pan = '%".$base->input['cardnumber']."'%";
			else
				$cardnumber=" ";

			if(count($_REQUEST['cardType'])>0)
		    {
				foreach($_REQUEST['cardType'] as $cardtype)
				{
					if($card_type=="")
						$card_type=$cardtype;
					else
						$card_type=$card_type.",".$cardtype;
				}
				$fieldname="dad_pan";
	 			$cardType=CreateCardSql($card_type,$fieldname);
				$cardType=" and (".$cardType.")";
			}			
			else
			{
				$cardType="";
			}

			if($base->input['searchtype']=="Debit")
			{
				$sql="select distinct * from ".TBL_CGI_TRANSACTION_DETAIL." t where (t.dad_card_acceptor_id like '%".$client_id."') and t.dad_network_code in ('INT','CGI')  $cardnumber $txnStatus";
				$rs_query=$zetadb->Execute($sql);
			}
			elseif($base->input['searchtype']=="Credit")
			{
				// Searching directly from ".TBL_CGI_TRANSACTION_DETAIL." table for list of card_acceptor_ids
				$sql="select distinct * from ".TBL_CGI_TRANSACTION_DETAIL." t where (t.dad_card_acceptor_id like '%".$client_id."') and t.dad_network_code in ('CRD')  $cardnumber $cardType $txnStatus"; 
				 $rs_query=$zetadb->Execute($sql);
			}
  }

function ConvertClientId($client_id)
{
	// Modify Client_id to prepare a string of client_ids with just last 4 digits as last 4 digits of client_id is same as card_acceptor_id in ".TBL_CGI_TRANSACTION_DETAIL." table
		$client_id = explode(",", $client_id);
		
		for ($i = 0; $i < count($client_id); $i++)
		{
			if($client_id_short =="")
				$client_id_short = substr($client_id[$i], -4);
			else
				$client_id_short=$client_id_short."' || t.dad_card_acceptor_id like '%".substr($client_id[$i], -4);
		}
		return $client_id_short;
}

?>

