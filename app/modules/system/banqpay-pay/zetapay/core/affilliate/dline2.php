	<table height="100%" width="100%" border="0" cellspacing="2" cellpadding="2" class="empty">
	<tr bgcolor="#FFFFFF">
		<td height="25" colspan="3">
			<font face="Arial, Helvetica, sans-serif" size="3" color="#000066"><b>Referral Program Statistics:</b></font>
		</td>
	</tr>
	</table>
	<br>
<?
	downline($user,1);
	$ltotal = $level1 + $level2 + $level3 + $level4 + $level5 + $level6;
	$stotal = $sales1 + $sales2 + $sales3 + $sales4 + $sales5 + $sales6;
	$etotal = $earned1 + $earned2 + $earned3 + $earned4 + $earned5 + $earned6;
?>
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
	<tr> 
		<th>Totals:</th>
		<th><div align="right"><?=($ltotal ? $ltotal : 0)?></div></th>
		<th><div align="right"><?=($stotal ? $stotal : 0)?></div></th>
		<th><div align="right"><?=($etotal ? $currency." ".myround($etotal,2) : 0)?></div></th>
	</tr>
	</table>
	<br><br>
<?/*
	<table width="480" align="center" cellpadding="1" cellspacing="1" class="design">
	<tr>
		<th colspan="7">Your direct referrals (level 1)</td>
	</tr>
<?
	$qr1 = mysql_query("SELECT * FROM zetapay_users WHERE referredby=$user");
	if( mysql_num_rows($qr1) >= 1){
		while( $row = mysql_fetch_object($qr1) ){
			$aqr1 = mysql_query("SELECT COUNT(*) AS sales FROM zetapay_transactions WHERE paidto='$user' AND paidby='99' AND related='{$row->id}'");
			if($aqr1){
				$arow = mysql_fetch_object($aqr1);
				$mysales = $arow->sales;
			}
			$aqr1 = mysql_query("SELECT SUM(amount) AS earned FROM zetapay_transactions WHERE paidto='$user' AND paidby='99' AND related='{$row->id}'");
			if($aqr1){
				$arow = mysql_fetch_object($aqr1);
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
*/?>
	<br>
<?
	function downline($user,$curLev){
		global $level1,$sales1,$earned1;
		global $level2,$sales2,$earned2;
		global $level3,$sales3,$earned3;
		global $level4,$sales4,$earned4;
		global $level5,$sales5,$earned5;
		global $level6,$sales6,$earned6;
        global $zetadb;
        
		$qr1 = $zetadb->Execute("SELECT * FROM zetapay_merchant_users WHERE referredby=$user");
		if($qr1){
			while( $row = $qr1->FetchNextObject() ){
				$myLev = $curLev + 1;
				if($myLev > 6)return;
				$aqr1 = $zetadb->Execute("SELECT COUNT(*) AS sales FROM zetapay_merchant_transactions WHERE paidto='$user' AND paidby='99' AND related='{$row->ID}'");
				if($aqr1){
					$arow = $aqr1->FetchNextObject();
					$sales = $arow->SALES;
				}
				$aqr1 = $zetadb->Execute("SELECT SUM(amount) AS earned FROM zetapay_merchant_transactions WHERE paidto='$user' AND paidby='99' AND related='{$row->ID}'");
				if($aqr1){
					$arow = $aqr1->FetchNextObject();
					$earned = $arow->EARNED;
				}
				if($curLev == 1){
					$level1++;
					if($sales){
						$sales1 .= $sales;
					}
					if($earned){
						$earned1 .= $earned;
					}
				}else if($curLev == 2){
					$level2++;
					if($sales){
						$sales2 .= $sales;
					}
					if($earned){
						$earned2 .= $earned;
					}
				}else if($curLev == 3){
					$level3++;
					if($sales){
						$sales3 .= $sales;
					}
					if($earned){
						$earned3 .= $earned;
					}
				}else if($curLev == 4){
					$level4++;
					if($sales){
						$sales4 .= $sales;
					}
					if($earned){
						$earned4 .= $earned;
					}
				}else if($curLev == 5){
					$level5++;
					if($sales){
						$sales5 .= $sales;
					}
					if($earned){
						$earned5 .= $earned;
					}
				}else if($curLev == 6){
					$level6++;
					if($sales){
						$sales6 .= $sales;
					}
					if($earned){
						$earned6 .= $earned;
					}
				}
				downline($row->ID,$myLev);
			}
		}
	}
?>