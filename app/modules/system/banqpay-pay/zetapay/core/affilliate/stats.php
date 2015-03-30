	<table height="100%" width="100%" border="0" cellspacing="2" cellpadding="2" class="empty">
	<tr bgcolor="#FFFFFF">
		<td height="25" colspan="3">
			<font face="Arial, Helvetica, sans-serif" size="3" color="#000066"><b>Monthly Report:</b></font>
		</td>
	</tr>
	</table>
	<br>
<?
	$atoday = time();
	$today["year"] = date("Y",$atoday);
	$today["day"] = date("d",$atoday);
	$today["month"] = date("m",$atoday);
	if (!$_GET['dday']) $_GET['dday'] = $today['day'];
	if (!$_GET['mmonth']) $_GET['mmonth'] = $today['month'];
	if (!$_GET['yyear']) $_GET['yyear'] = $today['year'];
	$curdate = mktime(0, 0, 0, $_GET['mmonth'], $_GET['dday'], $_GET['yyear']);
?>
	<table align="center" cellpadding="1" cellspacing="1" class="design" width=100%>
	<tr>
		<th colspan="20">
			Stats for
			<?=($_GET['mmonth'] ? date("M",$curdate) : "")?><?=($_GET['yyear'] ? ", ".date("Y",$curdate) : "")?>
		</th>
	</tr>
	<tr>
		<th>Date</td>
		<th colspan="20">&nbsp;</td>
	</tr>
<?
	$goToIt = 1;
	$curDay = 1;
	while ($goToIt){
//		$level1 = $level2 = $level3 = $level4 = $level5 = $level6 = 0;
//		$sales1 = $sales2 = $sales3 = $sales4 = $sales5 = $sales6 = 0;
//		$earned1 = $earned2 = $earned3 = $earned4 = $earned5 = $earned6 = 0;
		$curdate = mktime(0, 0, 0, $_GET['mmonth'], $curDay, $_GET['yyear']);
		if($aff_levels){
			downline($user,1,$curdate,$aff_levels);
		}
?>
		<tr>
			<th rowspan=<?=($aff_levels+2)?>><?=$curDay?></th>
		</tr>
		<tr>
			<th>Level</th><th>Referrals</th><th>Sales</th><th>Earned</th>
		</tr>
<?
		for($i = 1;$i <= $aff_levels;$i++){
?>
			<tr>
				<td><b><?=$i?></b></td>
				<td><?=($level[$i][$curdate] ? $level[$i][$curdate] : 0)?></td>
				<td><?=($sales[$i][$curdate] ? $sales[$i][$curdate] : 0)?></td>
				<td><?=($earned[$i][$curdate] ? $currency." ".myround($earned[$i][$curdate],2) : 0)?></td>
			</tr>
<?
			$ltotal[$i] = $ltotal[$i] + $level[$i][$curdate];
			$stotal[$i] = $stotal[$i] + $sales[$i][$curdate];
			$etotal[$i] = $etotal[$i] + $earned[$i][$curdate];
		}
		if( $curDay == date("t",$curdate) ){
			$goToIt = 0;
			break;
		}
		$curDay++;
	}
?>
		<tr> 
			<th rowspan=<?=($aff_levels+2)?>>Totals:</th>
		<tr>
			<th>Level</th><th>Referrals</th><th>Sales</th><th>Earned</th>
		</tr>
<?
		for($i = 1;$i <= $aff_levels;$i++){
?>
			<tr>
				<td><b><?=$i?></b></td>
				<td><?=($ltotal[$i] ? $ltotal[$i] : 0)?></td>
				<td><?=($stotal[$i] ? $stotal[$i] : 0)?></td>
				<td><?=($etotal[$i] ? $currency." ".myround($etotal[$i],2) : 0)?></td>
			</tr>
<?
		}
?>
	</table>
	<br><br>
	<table align="center" cellpadding="1" cellspacing="1" class="Stats">
	<tr>
		<td align=left>
			<a href="index.php?a=affil&be=stats&<?=$id?>&mmonth=<?=($_GET['mmonth']-1)?>">Previous Month</a>
		</td>
		<td>&nbsp;</td>
		<td align=right>
			<a href="index.php?a=affil&be=stats&<?=$id?>&mmonth=<?=($_GET['mmonth']+1)?>">Next Month</a>
		</td>
	</tr>
	</table>
	<br><br>
	<table align="center" cellpadding="1" cellspacing="1" class="Stats">
	<tr>
		<t colspan="2">Legend:</td>
	</tr>
	<tr>
		<td><b>R</td>
		<td>Referrals</td>
	</tr>	
	<tr>
		<td><b>S</td>
		<td>Sales</td>
	</tr>
	<tr>
		<td><b>E</td>
		<td>Earned</td>
	</tr>
	</table>
	<br>
<?
	function downline($user,$curLev,$date="",$levels=6 ){
		if(!$date)$date = time();
		global $level, $sales, $earned, $zetadb;
		$adate = date("Y-m-d",$date);

		$qr1 = $zetadb->Execute("SELECT * FROM zetapay_merchant_users WHERE referredby=$user");
		if($qr1){
			while( $row = $qr1->FetchNextObject() ){
				$myLev = $curLev + 1;
				if($myLev > $levels)return;
				$aqr1 = $zetadb->Execute("SELECT COUNT(*) AS sales FROM zetapay_merchant_transactions WHERE paidto='$user' AND paidby='99' AND related='{$row->id}' AND trdate LIKE '$adate%'");
				if($aqr1){
					$arow = $aqr1->FetchNextObject();
					$asales = $arow->sales;
				}
				$aqr1 = $zetadb->Execute("SELECT SUM(amount) AS earned FROM zetapay_merchant_transactions WHERE paidto='$user' AND paidby='99' AND related='{$row->id}' AND trdate LIKE '$adate%'");
				if($aqr1){
					$arow = $aqr1->FetchNextObject();
					$aearned = $arow->earned;
				}
				if($asales || $aearned){
					$level[$curLev][$date]++;
					$sales[$curLev][$date] .= $asales;
					$earned[$curLev][$date] .= $aearned;
				}
				downline($row->ID,$myLev,$date,$levels);
            }
		}
	}
?>