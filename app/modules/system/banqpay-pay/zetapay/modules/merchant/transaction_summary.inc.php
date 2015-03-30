<?
//session_start();
 /*----------------For Transaction Summary-----------------------------------------*/  
		
		$c=0;
		// For each row in array $card_assign to get the data for all credit, debit, debit with cashback and others
		$query="";
		for($m=0;$m<count($card_assign);$m++)
		{
		  $card=$card_assign[$m];

		  if($card=='IDP')
				$card='Debit';
  		  if($card=='IDP-CB')
				$card='Debit_cb';

		  if($card_assign[$m]=='MasterCard')
				$card_assign[$m] ='MC';
  		  

			if($query=="")
			  $query=" sum(case when das_processing_code = '".$card_assign[$m]."' then das_cardissuer_amount end) as ".$card;
			else
			  $query=$query.","." sum(case when das_processing_code = '".$card_assign[$m]."' then das_cardissuer_amount end) as ".$card;
			
			 
		}

		$sql="select das_cgi_date,".$query ." from ".TBL_CGI_TRANSACTION_SUMMARY."  where client_id in ('".$client_id_full."') and 
			  das_cgi_date like '".$toDate."' and das_final_status_code ='APP' group by DATE_FORMAT(das_cgi_date, '%Y%m%d')";

		$res=$zetadb->Execute($sql);
//$_SESSION[client_id_full]=$client_id_full;
if($comefrompdf!='PDF')
{
	$txn_heading="Transaction Summary";
	$txn_heading.="\n";
?>
	
	<table align="center"  width="100%" cellspacing="2" cellpadding="1" border=0 class="outerTable">
		<tr>
			<div class="heading" align=left>Transaction Summary</div>
		</tr>

		<tr>
			<td class="tableHeaderText" width='<?=$width?>%' align="center">Date</td>
	 	  <?
			$txn_heading.=",Date";
			$width=ceil((100/(count($card_assign)+1)));
			
			for($k=0;$k<count($card_assign);$k++)
			{	
			  if($card_assign[$k]=='IDP-CB')
				  $displaycard="Debit W/ Cashback";
			  elseif($card_assign[$k]=='IDP')
				  $displaycard="Debit";
			  elseif($card_assign[$k]=='MC')
				  $displaycard="MasterCard";
			  else
				  $displaycard=$card_assign[$k];
		  ?>
				<td class='tableHeaderText' width='<?=$width?>%' align='center'><?=ucwords(strtolower($displaycard))?></td>
		  <?
					$txn_heading=$txn_heading.",".ucwords(strtolower($displaycard));
			}
			$txn_heading.=",Total";
		  ?>
			<td class="tableHeaderText" width="<?=$width?>%" align="center">Total</td>			
		</tr>
		
	
	<?

	$_SESSION['txn_heading']=$txn_heading;
	if($zetadb->Affected_Rows()>0)
	{
	  while($rs1=$res->FetchRow())
	    {
		  $m=0;
			if($p==0)
			{
				$class='evenRow';
				$p=1;
			}
			else
			{
				$class='oddRow';
				$p=0;
			}	
			
		?><tr>
			<td class="<?=$class?>" width="<?=$width?>%" align="center"><?=$date=create_date($rs1[0])?></td>
		<?  
		   $txn_data.="\n";
			$txn_data=$txn_data.",".$date;
		
			$i=1;
			for($k=0;$k<count($card_assign);$k++)
			{ 
				$m=$k;
			?>
				<td class="<?=$class?>" width="<?=$width?>%" align="center">$<?=number_format($rs1[$i],2)?></td>
				<?
				
				$txn_data=$txn_data.",".number_format($rs1[$i],2);

				$total+=$rs1[$i];
				$vertical_total[$m]+=$rs1[$i];
				$i++;
			}
		?>
			   <td class="<?=$class?>" width="<?=$width?>%" align="center">$<?=number_format($total,2)?></td>	
		</tr>
		<?	
			$txn_data=$txn_data.",".$total;
			$gttotal+=$total;
			$total=0;
		} 
		  //while
		  $txn_data.="\n";
		//  $_SESSION[client_id_full]=$client_id_full;
		  $_SESSION[toDate]=$toDate;
		  $_SESSION[card_assign]=$card_assign;
	
			echo"<tr>";
			echo"<td class='tableHeaderText' width='10%' align='center'>Total</td>";
		  	$txn_data.=",Total";
			for($k=0;$k<count($vertical_total);$k++)
			{ ?>
				<td class="tableHeaderText" width="10%" align="center">$<?=number_format($vertical_total[$k],2)?></td>	<?

	  			 $txn_data=$txn_data.",".$vertical_total[$k];
			}
			echo"<td class='tableHeaderText' width='10%' align='center'>"."$".number_format($gttotal,2);
			$txn_data=$txn_data.",".$gttotal;
            echo"</tr>";
			$txn_data.="\n";
	}
	else
	{
	?> <tr>
			<td class="formField" width="100%" colspan=9 align="left"><B>No Record Found</B></td>	
		</tr>
<?	
		//$_SESSION[client_id_full]="";
		$_SESSION[toDate]="";
		$_SESSION[card_assign]="";
		$txn_data="No Record Found";
		
	}

?>

</table>
<?
	$_SESSION['txn_data']=$txn_data;
}

?>