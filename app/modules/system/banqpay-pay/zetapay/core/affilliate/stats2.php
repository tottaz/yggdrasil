	<script>
		colorover='#E0E0E0'; colorout='#F0F0F0'; colorclick='#F0D8D8';
		function mover (object) {
			if (object.style.backgroundColor.toUpperCase()!=colorclick) object.style.backgroundColor=colorover;
		}
		function mout (object) {
			if (object.style.backgroundColor.toUpperCase()!=colorclick) object.style.backgroundColor=colorout;
		}
	</script>
	<table height="100%" width="100%" border="0" cellspacing="2" cellpadding="2" class="empty">
	<tr bgcolor="#FFFFFF">
		<td height="25" colspan="3">
			<font face="Arial, Helvetica, sans-serif" size="3" color="#000066"><b>Affiliate Program Statistics:</b></font>
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
	<table align="center" cellpadding="1" cellspacing="1" class="Stats" width=100%>
	<tr class="StatsTitle">
		<td colspan="20">
			Stats for 
			<?=($_GET['mmonth'] ? date("M",$curdate) : "")?><?=($_GET['yyear'] ? ", ".date("Y",$curdate) : "")?>
		</td>
	</tr>
	<tr class="StatsSTitle">
		<td>Date</td>
		<td colspan="20">&nbsp;</td>
	</tr>
<?
	$goToIt = 1;
	$curDay = 1;
	while ($goToIt){
//		$level1 = $level2 = $level3 = $level4 = $level5 = $level6 = 0;
//		$sales1 = $sales2 = $sales3 = $sales4 = $sales5 = $sales6 = 0;
//		$earned1 = $earned2 = $earned3 = $earned4 = $earned5 = $earned6 = 0;
		$curdate = mktime(0, 0, 0, $_GET['mmonth'], $curDay, $_GET['yyear']);
		downline($user,1,$curdate);
		$ltotal1 = $ltotal1 + $level1[$curdate];
		$stotal1 = $stotal1 + $sales1[$curdate];
		$etotal1 = $etotal1 + $earned1[$curdate];
		$ltotal2 = $ltotal2 + $level2[$curdate];
		$stotal2 = $stotal2 + $sales2[$curdate];
		$etotal2 = $etotal2 + $earned2[$curdate];
		$ltotal3 = $ltotal3 + $level3[$curdate];
		$stotal3 = $stotal3 + $sales3[$curdate];
		$etotal3 = $etotal3 + $earned3[$curdate];
		$ltotal4 = $ltotal4 + $level4[$curdate];
		$stotal4 = $stotal4 + $sales4[$curdate];
		$etotal4 = $etotal4 + $earned4[$curdate];
		$ltotal5 = $ltotal5 + $level5[$curdate];
		$stotal5 = $stotal5 + $sales5[$curdate];
		$etotal5 = $etotal5 + $earned5[$curdate];
		$ltotal6 = $ltotal6 + $level6[$curdate];
		$stotal6 = $stotal6 + $sales6[$curdate];
		$etotal6 = $etotal6 + $earned6[$curdate];
?>
		<tr class="StatsSTitle" onMouseOver="mover(this);" onMouseOut="mout(this);" on onMouseDown="mclick(this);">
			<td rowspan=8><?=$curDay?></td>
		</tr>
		<tr class="StatsSTitle">
			<td>Level</td><td>Referrals</td><td>Sales</td><td>Earned</td>
		</tr>
		<tr onMouseOver="mover(this);" onMouseOut="mout(this);" on onMouseDown="mclick(this);">
			<td><b>1</b></td>
			<td><?=($level1[$curdate] ? $level1[$curdate] : 0)?></td>
			<td><?=($sales1[$curdate] ? $sales1[$curdate] : 0)?></td>
			<td><?=($earned1[$curdate] ? $currency." ".myround($earned1[$curdate],2) : 0)?></td>
		</tr>
		<tr onMouseOver="mover(this);" onMouseOut="mout(this);" on onMouseDown="mclick(this);">
			<td><b>2</b></td>
			<td><?=($level2[$curdate] ? $level2[$curdate] : 0)?></td>
			<td><?=($sales2[$curdate] ? $sales2[$curdate] : 0)?></td>
			<td><?=($earned2[$curdate] ? $currency." ".myround($earned2[$curdate],2) : 0)?></td>
		</tr>
		<tr onMouseOver="mover(this);" onMouseOut="mout(this);" on onMouseDown="mclick(this);">
			<td><b>3</b></td>
			<td><?=($level3[$curdate] ? $level3[$curdate] : 0)?></td>
			<td><?=($sales3[$curdate] ? $sales3[$curdate] : 0)?></td>
			<td><?=($earned3[$curdate] ? $currency." ".myround($earned3[$curdate],2) : 0)?></td>
		</tr>
		<tr onMouseOver="mover(this);" onMouseOut="mout(this);" on onMouseDown="mclick(this);">
			<td><b>4</b></td>
			<td><?=($level4[$curdate] ? $level4[$curdate] : 0)?></td>
			<td><?=($sales4[$curdate] ? $sales4[$curdate] : 0)?></td>
			<td><?=($earned4[$curdate] ? $currency." ".myround($earned4[$curdate],2) : 0)?></td>
		</tr>
		<tr onMouseOver="mover(this);" onMouseOut="mout(this);" on onMouseDown="mclick(this);">
			<td><b>5</b></td>
			<td><?=($level5[$curdate] ? $level5[$curdate] : 0)?></td>
			<td><?=($sales5[$curdate] ? $sales5[$curdate] : 0)?></td>
			<td><?=($earned5[$curdate] ? $currency." ".myround($earned5[$curdate],2) : 0)?></td>
		</tr>
		<tr onMouseOver="mover(this);" onMouseOut="mout(this);" on onMouseDown="mclick(this);">
			<td><b>6</b></td>
			<td><?=($level6[$curdate] ? $level6[$curdate] : 0)?></td>
			<td><?=($sales6[$curdate] ? $sales6[$curdate] : 0)?></td>
			<td><?=($earned6[$curdate] ? $currency." ".myround($earned6[$curdate],2) : 0)?></td>
		</tr>
<?
		if( $curDay == date("t",$curdate) ){
			$goToIt = 0;
			break;
		}
		$curDay++;
	}
?>
	<tr class="StatsSTitle"> 
		<td rowspan=8>Totals:</td>
		<tr class="StatsSTitle">
			<td>Level</td><td>Referrals</td><td>Sales</td><td>Earned</td>
		</tr>
		<tr onMouseOver="mover(this);" onMouseOut="mout(this);" on onMouseDown="mclick(this);">
			<td><b>1</b></td>
			<td><?=($ltotal1 ? $ltotal1 : 0)?></td>
			<td><?=($stotal1 ? $stotal1 : 0)?></td>
			<td><?=($etotal1 ? $currency." ".myround($etotal1,2) : 0)?></td>
		</tr>
		<tr onMouseOver="mover(this);" onMouseOut="mout(this);" on onMouseDown="mclick(this);">
			<td><b>2</b></td>
			<td><?=($ltotal2 ? $ltotal2 : 0)?></td>
			<td><?=($stotal2 ? $stotal2 : 0)?></td>
			<td><?=($etotal2 ? $currency." ".myround($etotal2,2) : 0)?></td>
		</tr>
		<tr onMouseOver="mover(this);" onMouseOut="mout(this);" on onMouseDown="mclick(this);">
			<td><b>3</b></td>
			<td><?=($ltotal3 ? $ltotal3 : 0)?></td>
			<td><?=($stotal3 ? $stotal3 : 0)?></td>
			<td><?=($etotal3 ? $currency." ".myround($etotal3,2) : 0)?></td>
		</tr>
		<tr onMouseOver="mover(this);" onMouseOut="mout(this);" on onMouseDown="mclick(this);">
			<td><b>4</b></td>
			<td><?=($ltotal4 ? $ltotal4 : 0)?></td>
			<td><?=($stotal4 ? $stotal4 : 0)?></td>
			<td><?=($etotal4 ? $currency." ".myround($etotal4,2) : 0)?></td>
		</tr>
		<tr onMouseOver="mover(this);" onMouseOut="mout(this);" on onMouseDown="mclick(this);">
			<td><b>5</b></td>
			<td><?=($ltotal5 ? $ltotal5 : 0)?></td>
			<td><?=($stotal5 ? $stotal5 : 0)?></td>
			<td><?=($etotal5 ? $currency." ".myround($etotal5,2) : 0)?></td>
		</tr>
		<tr onMouseOver="mover(this);" onMouseOut="mout(this);" on onMouseDown="mclick(this);">
			<td><b>6</b></td>
			<td><?=($ltotal6 ? $ltotal6 : 0)?></td>
			<td><?=($stotal6 ? $stotal6 : 0)?></td>
			<td><?=($etotal6 ? $currency." ".myround($etotal6,2) : 0)?></td>
		</tr>
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
	<tr class="StatsTitle">
		<td colspan="2">Legend:</td>
	</tr>
	<tr onMouseOver="mover(this);" onMouseOut="mout(this);" on onMouseDown="mclick(this);">
		<td><b>R</td>
		<td>Referrals</td>
	</tr>
	<tr onMouseOver="mover(this);" onMouseOut="mout(this);" on onMouseDown="mclick(this);">
		<td><b>S</td>
		<td>Sales</td>
	</tr>
	<tr onMouseOver="mover(this);" onMouseOut="mout(this);" on onMouseDown="mclick(this);">
		<td><b>E</td>
		<td>Earned</td>
	</tr>
	</table>
	<br>
<?
	function downline($user,$curLev,$date="" ){
		if(!$date)$date = time();
		global $level1,$sales1,$earned1;
		global $level2,$sales2,$earned2;
		global $level3,$sales3,$earned3;
		global $level4,$sales4,$earned4;
		global $level5,$sales5,$earned5;
		global $level6,$sales6,$earned6;
        global $zetadb;

		$adate = date("Y-m-d",$date);

        $qr1 = $zetadb->Execute("SELECT * FROM zetapay_merchant_users WHERE referredby=$user");
		if($qr1){
			while($row = $qr1->FetchNextObject() ){
				$myLev = $curLev + 1;
				if($myLev > 6)return;
                $aqr1 = $zetadb->Execute("SELECT COUNT(*) AS sales FROM zetapay_merchant_transactions WHERE paidto='$user' AND paidby='99' AND related='{$row->ID}' AND trdate LIKE '$adate%'");
				if($aqr1){
					$arow = $aqr1->FetchNextObject();
					$sales = $arow->SALES;
				}
				$aqr1 = $zetadb->Execute("SELECT SUM(amount) AS earned FROM zetapay_merchant_transactions WHERE paidto='$user' AND paidby='99' AND related='{$row->ID}' AND trdate LIKE '$adate%'");
				if($aqr1){
					$arow = $aqr1->FetchNextObject();
					$earned = $arow->EARNED;
				}
				if($sales || $earned){
					if($curLev == 1){
						$level1[$date]++;
						$sales1[$date] .= $sales;
						$earned1[$date] .= $earned;
					}else if($curLev == 2){
						$level2[$date]++;
						$sales2[$date] .= $sales;
						$earned2[$date] .= $earned;
					}else if($curLev == 3){
						$level3[$date]++;
						$sales3[$date] .= $sales;
						$earned3[$date] .= $earned;
					}else if($curLev == 4){
						$level4[$date]++;
						$sales4[$date] .= $sales;
						$earned4[$date] .= $earned;
					}else if($curLev == 5){
						$level5[$date]++;
						$sales5[$date] .= $sales;
						$earned5[$date] .= $earned;
					}else if($curLev == 6){
						$level6[$date]++;
						$sales6[$date] .= $sales;
						$earned6[$date] .= $earned;
					}
				}
				downline($row->ID,$myLev,$date);
			}
		}
	}
?>