	<table height="100%" width="100%" border="0" cellspacing="2" cellpadding="2" class="empty">
	<tr bgcolor="#FFFFFF">
		<td height="25" colspan="3">
			<font face="Arial, Helvetica, sans-serif" size="3" color="#000066"><b>Referral Program Statistics:</b></font>
		</td>
	</tr>
	</table>
	<br>
<?
/*
	downline($user,1);
	$ltotal = $level1 + $level2 + $level3 + $level4 + $level5 + $level6;
	$stotal = $sales1 + $sales2 + $sales3 + $sales4 + $sales5 + $sales6;
	$etotal = $earned1 + $earned2 + $earned3 + $earned4 + $earned5 + $earned6;
*/
?>
<?/*
	<TABLE class=design cellspacing=0 width=100%>
	<tr>
		<th>Level</th>
		<th>Referrals</th>
		<th>Sales</th>
		<th>Earned</th>
	</tr>
	<tr>
		<th><b>1</b></td>
		<td><?=($level1 ? $level1 : 0)?></td>
		<td><?=($sales1 ? $sales1 : 0)?></td>
		<td><?=($earned1 ? $currency." ".myround($earned1,2) : "$ 0.00")?></td>
	</tr>
	<tr>
		<th><b>2</b></td>
		<td><?=($level2 ? $level2 : 0)?></td>
		<td><?=($sales2 ? $sales2 : 0)?></td>
		<td><?=($earned2 ? $currency." ".myround($earned2,2) : "$ 0.00")?></td>
	</tr>
	<tr>
		<th><b>3</b></td>
		<td><?=($level3 ? $level3 : 0)?></td>
		<td><?=($sales3 ? $sales3 : 0)?></td>
		<td><?=($earned3 ? $currency." ".myround($earned3,2) : "$ 0.00")?></td>
	</tr>
	<tr>
		<th><b>4</b></td>
		<td><?=($level4 ? $level4 : 0)?></td>
		<td><?=($sales4 ? $sales4 : 0)?></td>
		<td><?=($earned4 ? $currency." ".myround($earned4,2) : "$ 0.00")?></td>
	</tr>
	<tr>
		<th><b>5</b></td>
		<td><?=($level5 ? $level5 : 0)?></td>
		<td><?=($sales5 ? $sales5 : 0)?></td>
		<td><?=($earned5 ? $currency." ".myround($earned5,2) : "$ 0.00")?></td>
	</tr>
	<tr>
		<th><b>6</b></td>
		<td><?=($level6 ? $level6 : 0)?></td>
		<td><?=($sales6 ? $sales6 : 0)?></td>
		<td><?=($earned6 ? $currency." ".myround($earned6,2) : "$ 0.00")?></td>
	</tr>
*/?>
	<TABLE class=design cellspacing=0 width=100%>
	<tr>
		<th>Level</th>
		<th>Referrals</th>
		<th>Sales</th>
		<th>Earned</th>
	</tr>
<?
/*
	$level[2] = 2;
	$sales[2] = 5;
	$earned[2] = 7;
*/
	if($aff_levels){
		downline($user,1,$aff_levels);
	}
	for($i = 1;$i <= $aff_levels;$i++){
?>
		<tr>
			<th><b><?=$i?></b></td>
			<td><?=($level[$i] ? $level[$i] : 0)?></td>
			<td><?=($sales[$i] ? $sales[$i] : 0)?></td>
			<td><?=($earned[$i] ? $currency." ".myround($earned[$i],2) : "$ 0.00")?></td>
		</tr>
<?
		$ltotal = $level[$i] + $ltotal;
		$stotal = $sales[$i] + $stotal;
		$etotal = $earned[$i] + $etotal;
	}	
?>
	<tr> 
		<th>Totals:</th>
		<th><div align="right"><?=($ltotal ? $ltotal : 0)?></div></th>
		<th><div align="right"><?=($stotal ? $stotal : 0)?></div></th>
		<th><div align="right"><?=($etotal ? $currency." ".myround($etotal,2) : 0)?></div></th>
	</tr>
	</table>
	<br><br>
<!--[ Level 1 Direct Referalls ]-->
	<table width="480" align="center" cellpadding="1" cellspacing="1" class="design">
	<tr>
		<th colspan="7">Your direct referrals (level 1)</td>
	</tr>
<?
	$qr1 = $zetadb->Execute("SELECT * FROM zetapay_merchant_users WHERE referredby=$user");
	if( $qr1->RecordCount() >= 1){
		while( $row = $qr1->FetchNextObject() ){
			$aqr1 = $zetadb->Execute("SELECT COUNT(*) AS sales FROM zetapay_merchant_transactions WHERE paidto='$user' AND paidby='99' AND related='{$row->id}'");
			if($aqr1){
				$arow = $aqr1->FetchNextObject();
				$mysales = $arow->sales;
			}
			$aqr1 = $zetadb->Execute("SELECT SUM(amount) AS earned FROM zetapay_merchant_transactions WHERE paidto='$user' AND paidby='99' AND related='{$row->id}'");
			if($aqr1){
				$arow = $aqr1->FetchNextObject();
				$myearned = $arow->earned;
			}
?>
			<tr>
				<td colspan="7"><?=$row->username?> (<?=$row->email?>)</td>
			</tr>
<?
		}
	}else{
?>
		<tr class="StatsSTitle">
			<td colspan="7">No referrals on this level.</td>
		</tr>
<?
	}
?>
	</table>
	<br>
<?
	function downline($user,$curLev,$levels = 6){
		global $level,$sales,$earned, $zetadb;
		$qr1 = $zetadb->Execute("SELECT * FROM zetapay_users WHERE referredby=$user");
		if($qr1){
			while( $row = $qr1->FetchNextObject() ){
				$myLev = $curLev + 1;
				if($myLev > $levels)return;
				$aqr1 = $zetadb->Execute("SELECT COUNT(*) AS sales FROM zetapay_merchant_transactions WHERE paidto='$user' AND paidby='99' AND related='{$row->ID}'");
				if($aqr1){
					$arow = $aqr1->FetchNextObject();
					$asales = $arow->SALES;
				}
				$aqr1 = $zetadb->Execute("SELECT SUM(amount) AS earned FROM zetapay_merchant_transactions WHERE paidto='$user' AND paidby='99' AND related='{$row->ID}'");
				if($aqr1){
					$arow = $aqr1->FetchNextObject();
					$aearned = $arow->EARNED;
				}
				$level[$curLev]++;
				if($asales){
					$sales[$curLev] = $sales[$curLev] + $asales;
				}
				if($aearned){
					$earned[$curLev] = $earned[$curLev] + $aearned;
				}
				downline($row->ID,$myLev,$levels);
			}
		}
	}
?>