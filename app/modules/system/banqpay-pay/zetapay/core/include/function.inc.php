<?

class heading
{
	function indexPageHeading()
	{
			$indexhead[]="Card Type";
			$indexhead[]="#of Transactions";
			$indexhead[]="Transaction Revenue";
			$indexhead[]="Surcharge Revenue";
			$indexhead[]="Total ISO Revenue";
		return 	$indexhead;
	}
	
	function accSummaryPageHeading()
	{
			$indexhead[]="Client ID";
			$indexhead[]="Merchant Name";
			$indexhead[]="# of Txns";
			$indexhead[]="Transaction Revenue";
			$indexhead[]="Surcharge Revenue";
			$indexhead[]="Monthly Revenue";
			$indexhead[]="Adjustments & Other";
			$indexhead[]="Total";

		return 	$indexhead;
	}
	function prospectPageHeading()
	{
			$prospecthead[]="Prospect Name";
			$prospecthead[]="First Name";
			$prospecthead[]="Last Name";
			$prospecthead[]="Title";
			$prospecthead[]="Phone#";
			$prospecthead[]="Last Contact Date";
			$prospecthead[]="Sic Name";
			$prospecthead[]="Max. Sale Volume";
			$prospecthead[]=" Action ";
			$prospecthead[]="Proposal";
		
		return 	$prospecthead;
	}

	function leadoutPageHeading()
	{
			$leadouthead[]="Lead Name";
			$leadouthead[]="First Name";
			$leadouthead[]="Last Name";
			$leadouthead[]="Title";
			$leadouthead[]="Phone#";
			$leadouthead[]="Status";
			$leadouthead[]="Date";
		
		return 	$leadouthead;
	}

	function dailyTrackingHeading()
	{
			$dailytrackinghead[]="Date";
			$dailytrackinghead[]="Prospects";
			$dailytrackinghead[]="Outside Leads";
			$dailytrackinghead[]="Area";
			$dailytrackinghead[]="Sale";
			$dailytrackinghead[]="Order";
			$dailytrackinghead[]="Dead";				
	
		return 	$dailytrackinghead;
	}

	function dealStatusPageHeading()
	{
			$dealstatushead[]="Lead Name";
			$dealstatushead[]="Order Date";
			$dealstatushead[]="Order Status";
			$dealstatushead[]="Order Status Date";
		
		return 	$dealstatushead;
	}
	function commissionPageHeading()
	{
			$commissionhead[]="Company";
			$commissionhead[]="Order Date";
			$commissionhead[]="Lead";
			$commissionhead[]="Sales Price";
			$commissionhead[]="Agent price";
			$commissionhead[]="Commission";

		return 	$commissionhead;
	}

	function searchPageHeading()
	{
			$searchhead[]="Lead Id";
			$searchhead[]="Prospect Name";
			$searchhead[]="First Name";
			$searchhead[]="Last Name";
			$searchhead[]="City";
			$searchhead[]="Status";
			$searchhead[]="Date";	
			$searchhead[]="	Max. Sale Volume";

		return 	$searchhead;
	}

	function tableName()
	{
         $leadmaster="cpos_lead_master";
		return $leadmaster;
	}

   function drawRow($heading,$colno,$req_width='')
	{
		$w=ceil(100/(count($heading)+1));
		
		for($i=0;$i<count($heading);$i++)
		{
		  if($colno==$i)
			echo"<td class='tableHeaderText' width='".$req_width."%' align=center>$heading[$i]</td>";
		  else
			echo"<td class='tableHeaderText' width='".$w."%' align=center>$heading[$i]</td>";	
		}
	
	}
	function getPrevDate($month,$year)
	{
		if($year=="" && $month=="")
			$date=date('Y-m',mktime(0,0,0,date(m)-1,1,date('Y')));
			//$date=date('Ym',mktime(0,0,0,date(m),1,date('Y')));
		else
			$date=date('Y-m',mktime(0,0,0,date($month),1,date($year)));
			
		return $date;
	}

	function getDate($month,$year)
	{
		$date=date('Y-m',mktime(0,0,0,date($month),1,date($year)));
		return $date;
	}

}	

/*----For Displaying the common table and rows-----------*/

class formDesign   
{

    function selMonthYear($selmonth,$selyear)
	{ ?>
		
			<table width="100%" cellspacing="2" cellpadding="1" class="outerTable" >
			  <tr>
				<td class="formLabel" width='15%'>Select Month
				<td class="formField" width='35%'>
					<select name=selmonth>
							<?
							 echo"<option value='' ></option>";
							  for ($i=1;$i<=12;$i++)
							  {
									if($i==$selmonth)
										$sel="selected";
									else
									   	$sel="";
	
									$mon=date('F',mktime(0,0,0,$i,'1',date('Y')));						
									if($i<10)
									   $j="0".$i;
									else
										$j=$i;
									echo"<option value='$j' $sel>$mon</option>";
								}
							?>
						</select>
					</td>
					<td class="formLabel" width='15%' >Select Year</td>
					<td class="formField" width='35%'>	
						 <select name="selyear" id="selyear"></select>
				            <script>
									loadYears(document.getElementById('selyear'),2005,'<?=date(Y)?>' );
									selectComboValue(document.getElementById("selyear"), "<? echo $selyear ?>")
							</script>
							<input type="submit" name="Go" value="Go">
					</td>				
			 </tr>
		</table>
	
<?	}
	function rowPerPage($recperpage,$getRowPerPage)
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
									<option value="<?=$v?>" <?=$sel?>><?=$v?></option>
							  <?}?>
							</select>
						</td>
					</tr>
				</table>
		
<?
		}

	function rowTotalPage($res_count_record,$recperpage,$selpage,$tot_per_pg)
	{
?>
	</table>		
		<table align="center" border="0" width="100%" cellspacing="2" cellpadding="0"  >
		<tr>	
			<td align=left > <? if ($tot_per_pg=='Y') 
								{
							?>
									<B>Total Record Found : <?=$res_count_record?></B>
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
					<option value="<?=$i?>" <?=$sel?>><?=$i+1?></option>
						
			 <?  }
				?>
			  </select>
			</td>
		  </tr>
	</table>		
<?
	}
}

$objformDesign= new formDesign();
?>