<?	
					
		$client_operating_name=$res_cli->CLI_OPERATING_TEXT;
		$client_street_number=$res_loc->LTN_STREET_NUMBER;	
		$client_street_name=$res_loc->LTN_STREET_NAME;
		$client_city=$res_loc->LTN_CITY;
		$client_state=$res_loc->LTN_STATE_CODE;
		$client_postal=$res_loc->LTN_POSTAL;
		//print_r($possibleCardType);
		
		//$possibleCardType=array('VISA','MC','AMEX','Diners','Loyalty');
	
	
			/*---------------For Txn Summary and PDF----------------*/
			
				$card_assign[]='IDP';
				$card_assign[]='IDP-CB';
		
			/*	$sql_card="select distinct cpd_card_plan from ".TBL_CARD_PLAN_DETAILS." where client_id in ('".$client_id_full."') and	
							cpd_merchant_number!='' order by cpd_card_plan desc";
				$rs=$zetadb->Execute($sql_card);
				if($zetadb->Affected_Rows()>0)
				{
						while($rr=$rs->FetchRow())
						{
							$card_assign[]=$rr['cpd_card_plan'];
						}
						$card_assign[]='OTHER';
				}
				else
				{
					$error="<B>No Card Found</B>";
				}
			
			/*----------------------------*/
			$card_assign=$possibleCardType;
			$card_assign[]='OTHER';
	
	
	
		   $sql_credit_data = "select sum(case when das_final_status_code ='APP' then das_cardissuer_amount end ) as cr_sat_amt,
							   sum(das_transaction_volume) as cr_cnt,das_processing_code
							   from ".TBL_CGI_TRANSACTION_SUMMARY." where client_id in ('".$client_id_full."') and " .
							   " Extract(MONTH from das_cgi_date)='".$base->input['fromDateMonth']."'" .
					   		   " and Extract(YEAR from das_cgi_date)='".$base->input['year']."'  group by das_processing_code order by 
							   das_processing_code desc ";
	
					$res_dr_cr=$zetadb->Execute($sql_credit_data);
	
					$m=0;
					while($rs1=$res_dr_cr->FetchRow())
					{
						$n=0;
						$txn_data_arr[$rs1['das_processing_code']][$n++]=$rs1['das_processing_code'];
						$txn_data_arr[$rs1['das_processing_code']][$n++]=$rs1['cr_cnt'];
						$txn_data_arr[$rs1['das_processing_code']][$n++]=$rs1['cr_sat_amt'];
						$txn_card_arr[$m]=$rs1['das_processing_code'];
						$m++;
					}

			    $sql_billing_qry="select fee_id,bhs_quantity, sum(bhs_billing_amount) as transaction_amt, sum(bhs_client_surcharge_amount) as 
				 				   surcharge,count(case when bhs_client_surcharge_amount!='' then bhs_client_surcharge_amount end) 
								   as cnt_surcharge_applied, sum(bhs_tax_amount1) as tax_amt, bhs_tax_code1 from ".TBL_CGI_BILLING_HISTORY."
								   where client_id in ('".$client_id_full."')  and  Extract(MONTH from billing_date)='".$base->input['fromDateMonth']."'
					   		   	   and Extract(YEAR from billing_date)='".$base->input['year']."' group by fee_id 
								   order by  fee_id desc ";				

				     $r_billing=$zetadb->Execute($sql_billing_qry);	
										   
					$i=0;
					$j=0;
					$p=0;
					
					if($zetadb->Affected_Rows()>0)
					{
						$arr_creditCard[$i++][$j]="Debit";
						$arr_creditCard[$i++][$j]="Debit W/ Cashback";
						$arr_otherCard[$p++][$j]="Other";
						$arr_otherCard[$p++][$j]="Monthly Charges";
						$arr_otherCard[$p++][$j]="Adjustments & Other Fees";
						$arr_otherCard[$p++][$j]="";
						
						 while($arr=$r_billing->FetchRow())
						 { 
							
						 	if(in_array($arr['fee_id'],$txn_card_arr))
							{	
								$cr_cnt=$txn_data_arr[$arr['fee_id']][1];
								$sat_amt=$txn_data_arr[$arr['fee_id']][2];
							}
							else
							{
								$cr_cnt=0;
								$sat_amt=0;
							}
							
							$cnt_surcharge_applied+=$arr['cnt_surcharge_applied'];
							$transaction_amt=$arr['transaction_amt'];
							$surcharge=$arr['surcharge'];
							$billing_amt=$arr['transaction_amt']-$arr['surcharge'];
							$tax_code=$arr['bhs_tax_code1'];
							$nooftxn=$arr['bhs_quantity'];
							
							
							$tax+=$arr['tax_amt'];
							
							if(in_array($arr['fee_id'],$possibleCardType))
							{
									$j=0;
									if($arr['fee_id']=='MC')
										$c="Mastercard";
									else
										$c=$arr['fee_id'];

									$arr_creditCard[$i][$j++]=$c;
									$arr_creditCard[$i][$j++]=number_format($cr_cnt);
									$arr_creditCard[$i][$j++]=number_format($sat_amt,2);	
									$arr_creditCard[$i][$j++]=number_format($transaction_amt,2);
									$arr_creditCard[$i][$j++]=number_format($surcharge,2);
									$arr_creditCard[$i][$j++]=number_format($billing_amt,2);
									$i++;
									
									$credit_count+=$cr_cnt;
									$credit_txn_fees+=$sat_amt;
									$credit_surcharge+=$surcharge;
									
									if($tax_code=='PST')
										$credit_tax_pst+=number_format($arr['tax_amt'],2);
									else
										$credit_tax+=number_format($arr['tax_amt'],2);
							
									
							
							}
							elseif($arr['fee_id']=='IDP')
							{
									$j=0;
									$arr_creditCard[0][$j++]="Debit";
									$arr_creditCard[0][$j++]=number_format($cr_cnt);
									$arr_creditCard[0][$j++]=number_format($sat_amt,2);	
									$arr_creditCard[0][$j++]=number_format($transaction_amt,2);
									$arr_creditCard[0][$j++]=number_format($surcharge,2);
									$arr_creditCard[0][$j++]=number_format($billing_amt,2);

									$debit_count+=$cr_cnt;
									$debit_txn_fees+=$sat_amt;
									$debit_surcharge+=$surcharge;
				
									if($tax_code=='PST')
										$debit_tax_pst+=number_format($arr['tax_amt'],2);
									else
										$debit_tax+=number_format($arr['tax_amt'],2);
							
							}
							elseif($arr['fee_id']=='IDP-CB')
							{
									$j=0;
									$arr_creditCard[1][$j++]="Debit W/ Cashback";
									$arr_creditCard[1][$j++]=number_format($cr_cnt);
									$arr_creditCard[1][$j++]=number_format($sat_amt,2);	
									$arr_creditCard[1][$j++]=number_format($transaction_amt,2);
									$arr_creditCard[1][$j++]=number_format($surcharge,2);
									$arr_creditCard[1][$j++]=number_format($billing_amt,2);
									
									$debit_count+=$cr_cnt;
									$debit_txn_fees+=$sat_amt;
									$debit_surcharge+=$surcharge;
									
									if($tax_code=='PST')
										$debit_tax_pst+=number_format($arr['tax_amt'],2);
									else
										$debit_tax+=number_format($arr['tax_amt'],2);
							
							}
							elseif($arr['fee_id']=='OTHER')
							{		
									$j=0;
									$arr_otherCard[0][$j++]="Other";
									$arr_otherCard[0][$j++]=number_format($cr_cnt);
									$arr_otherCard[0][$j++]=$sat_amt>0?number_format($sat_amt,2):0;	
									$arr_otherCard[0][$j++]=number_format($transaction_amt,2);
									$arr_otherCard[0][$j++]=number_format($surcharge,2);
									$arr_otherCard[0][$j++]=number_format($billing_amt,2);
									
									$other_txn_fees+=$sat_amt;
									$other_surcharge+=$surcharge;
									
									 if($tax_code=='PST')
										$other_tax_pst+=number_format($arr['tax_amt'],2);
									 else
										$other_tax+=number_format($arr['tax_amt'],2);
									$other_count+=$cr_cnt;
							
									
							}
							elseif($arr['fee_id']=='MAINT' || $arr['fee_id']=='STMT')
							{		
									$j=0;
								//	print"inside";
									$stmt_tot_tran+=$nooftxn;
									$arr_otherCard[1][$j++]="Monthly Charges";
//									$arr_otherCard[1][$j++]++;
									$arr_otherCard[1][$j++]=$stmt_tot_tran;
									$arr_otherCard[1][$j++]="-";
									$stmt_tran_amt+=$transaction_amt;
									$arr_otherCard[1][$j++]=number_format($stmt_tran_amt,2);
									$arr_otherCard[1][$j++]="-";
									$arr_otherCard[1][$j++]=number_format($stmt_tran_amt,2);
									$j++;
									
									
									
									$stmt="Statement/Monthly Fee".";-;$ ".$stmt_tran_amt.";-;-;$ ".$stmt_tran_amt.";";
									$stmt_tax+=$arr['tax_amt'];

							
							}
							elseif($arr['fee_id']=='SURCHARGE' || $arr['fee_id']=='CREQ' || $arr['fee_id']=='MISC' )
							{		
									$j=0;
									$arr_otherCard[2][$j++]="Adjustments & Other Fees";
									//$a++;
									$creq_tot_tran+=$nooftxn;
									$arr_otherCard[2][$j++]=$nooftxn;
									$arr_otherCard[2][$j++]="-";
									$creq_tran_amt+=$transaction_amt;
									$arr_otherCard[2][$j++]=number_format($c,2);
									$arr_otherCard[2][$j++]="-";
									$e+=$transaction_amt;
									
									$arr_otherCard[2][$j++]=number_format($e,2);
									$creq="Change Request/Adjustment Fees".";-;$ ".$creq_tran_amt.";".'-'.";".'-' .";$ ".$creq_tran_amt;
									$creq_tax+=$arr['tax_amt'];
									
									
							}
									
									 $total_cr_txn+=$cr_cnt;
									 $total_sat_amt+=$sat_amt;
									 $total_txn_amt+=$transaction_amt;
									 $total_sur_amt+=$surcharge;
									 $total_bill_amt+=$billing_amt;

					 $cr_cnt=0;
					 $sat_amt=0;
									 
									
									
						 } //while
					 }//if

					//Count of STMT,MAINT and Adjustment will not be added any where
					$total_cr_txn=$total_cr_txn-$stmt_tot_tran-$creq_tot_tran;
					

					$j=0;
					$arr_otherCard[3][$j++]=$tax_code;
					$arr_otherCard[3][$j++]="-";
					$arr_otherCard[3][$j++]="-";
					$arr_otherCard[3][$j++]=number_format($tax,2);
					$arr_otherCard[3][$j++]="-";
					$arr_otherCard[3][$j++]=number_format($tax,2);
					
					$j=0;	
					$arr_otherCard[4][$j++]="Total";
					$arr_otherCard[4][$j++]=$total_cr_txn;
					$arr_otherCard[4][$j++]=number_format($total_sat_amt,2);
					$arr_otherCard[4][$j++]=number_format(($total_txn_amt+$tax),2);
					$arr_otherCard[4][$j++]=number_format($total_sur_amt,2); 
					$arr_otherCard[4][$j++]=number_format(($total_bill_amt+$tax),2); 
				    $total_billing_amt=number_format(($total_bill_amt+$tax),2);

									
					$_SESSION['creditcard_arr']=$arr_creditCard;
					$_SESSION['arr_otherCard']=$arr_otherCard;
					$_SESSION['StatementDatePdf']=$StatementDatePdf;	

										//print_r($_SESSION['creditcard_arr']);
/*------------For PDF amd CSV------------------------------*/
			 
	
					

$total_txn_of_month=$total_cr_txn;
									 
$total_debit=number_format($debit_txn_fees+$debit_tax+$debit_pst_tax,2);
$total_credit=number_format($credit_txn_fees+$credit_tax+$credit_pst_tax,2);
$total_other=number_format($other_txn_fees+$other_tax+$other_pst_tax,2);
$a=number_format($debit_tax+$credit_tax,2);
$b=number_format($credit_pst_tax+$debit_pst_tax,2);
$c=number_format($debit_txn_fees+$credit_txn_fees+$creq_tran_amt+$stmt_tran_amt+$maint_tran_amt,2);

$total_sat_amt=number_format($total_sat_amt,2);
$vertot=$total_sat_amt.";".$a.";".$b.";".$c;
$vertot="Total;;".$vertot;
$other="Other;".$other_count.";$ ".$other_txn_fees.";$ ".$other_tax.";$ ".$other_pst_tax.";$ ".$total_other.";";

$_SESSION[billing_summary]="Debit Surcharge;".$cnt_surcharge_applied."; $".$total_sur_amt.";-;-;$ ". 	
							$total_sur_amt.";"."Debit Transaction Fee;". $debit_count.";$ ".$debit_txn_fees.";$ ".$debit_tax.";$ ".$debit_pst_tax.";".
							$total_debit.";"."Credit Transaction Fee ;". $credit_count.";$ ".$credit_txn_fees.";$ ".$credit_tax.";$ ".$credit_pst_tax.";$ ".
							$total_credit.";".$other.$stmt.$maint.$creq.$vertot;




$_SESSION['client_id_full']=$client_id_full;
$_SESSION['total_bill_amt']=$total_billing_amt;
?>
