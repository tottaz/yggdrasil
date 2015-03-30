<script>
	function gotocluster1(s){       
		var d = s.options[s.selectedIndex].value
		if(d){
			form1.a.value = d
			form1.submit();
		}
		s.selectedIndex=0
	}
	function gotocluster2(s){       
		var d = s.options[s.selectedIndex].value
		if(d){
			form2.a.value = d
			form2.submit();
		}
		s.selectedIndex=0
	}
	function gotocluster3(s){       
		var d = s.options[s.selectedIndex].value
		if(d){
			form3.a.value = d
			form3.submit();
		}
		s.selectedIndex=0
	}
</SCRIPT> 
<?
	$today = getdate(); 

	function report(){
		global $timeframe, $tr_sources,$affil_on,$signup_bonus;
		$qr1 = mysql_query("SELECT id FROM zetapay_users WHERE id>10 AND id<98");
		$total = 0;
		$i = 0;
		while ($r1 = mysql_fetch_object($qr1)){
			list($dsumm,$dfees) = mysql_fetch_row(mysql_query("SELECT SUM(amount),SUM(fees) FROM zetapay_transactions WHERE paidby=$r1->id AND $timeframe"));
			list($wsumm,$wfees) = mysql_fetch_row(mysql_query("SELECT SUM(amount),SUM(fees) FROM zetapay_transactions WHERE paidto=$r1->id AND $timeframe"));

			$t1 += $dsumm;
			$t2 += $dfees;
			$t3 -= $wsumm;
			$t4 += $wfees;
			$t5 += $dfees + $wfees;
	
			if ($dsumm || $wsumm){
				echo "\n<tr>",
						"<td>",$tr_sources[$r1->id],
						"<td>",dpsumm($dsumm, 1),
						"<td>",dpsumm($dfees, 1),
						"<td>",dpsumm(-$wsumm, 1),
						"<td>",dpsumm($wfees, 1),
						"<td>",dpsumm($dfees + $wfees, 1);
				$total += $dsumm - $wsumm + $dfees + $wfees;
				$i++;
			}
		}
		$dsumm = 0;
		$dfees = 0;
		$wsumm = 0;
		$wfees = 0;
		// count transfers, purchases,etc.
		list($dsumm,$dfees) = mysql_fetch_row(mysql_query("SELECT SUM(amount),SUM(fees) FROM zetapay_transactions WHERE paidby > 100 AND $timeframe"));
//		list($wsumm,$wfees) = mysql_fetch_row(mysql_query("SELECT SUM(amount),SUM(fees) FROM zetapay_transactions WHERE paidto > 100 AND $timeframe"));
		$t1 += $dsumm;
		$t2 += $dfees;
		$t3 -= $wsumm;
		$t4 += $wfees;
		$t5 += $dfees + $wfees;

		if ($dsumm || $wsumm){
			echo "\n<tr>",
					"<td>Transfer ",
					"<td>",dpsumm($dsumm, 1),
					"<td>",dpsumm($dfees, 1),
					"<td>",dpsumm(-$wsumm, 1),
					"<td>",dpsumm($wfees, 1),
					"<td>",dpsumm($dfees + $wfees, 1);
			$total += $dsumm - $wsumm + $dfees + $wfees;
			$i++;
		}
		// count referrals.
		if($affil_on){
			$dsumm = 0;
			$dfees = 0;
			$wsumm = 0;
			$wfees = 0;
			list($wsumm,$wfees) = mysql_fetch_row(mysql_query("SELECT SUM(amount),SUM(fees) FROM zetapay_transactions WHERE paidby = 99 AND $timeframe"));
//			list($wsumm,$wfees) = mysql_fetch_row(mysql_query("SELECT SUM(amount),SUM(fees) FROM zetapay_transactions WHERE paidto = 99 AND $timeframe"));
			$t1 += $dsumm;
			$t2 += $dfees;
			$t3 -= $wsumm;
			$t4 += $wfees;
			$t5 += $dfees + $wfees;
			if ($dsumm || $wsumm){
				echo "\n<tr>",
						"<td>Referrall Bonus Paid",
						"<td>",dpsumm($dsumm, 1),
						"<td>",dpsumm($dfees, 1),
						"<td>",dpsumm(-$wsumm, 1),
						"<td>",dpsumm($wfees, 1),
						"<td>",dpsumm($dfees + $wfees, 1);
				$total += $dsumm - $wsumm + $dfees + $wfees;
				$i++;
			}
		}
		// count signup bonuses paid.
		if ($signup_bonus && $signup_bonus != 0){
			$dsumm = 0;
			$dfees = 0;
			$wsumm = 0;
			$wfees = 0;
			list($wsumm,$wfees) = mysql_fetch_row(mysql_query("SELECT SUM(amount),SUM(fees) FROM zetapay_transactions WHERE paidby = 1 AND comment='Account signup bonus' AND $timeframe"));
//			list($wsumm,$wfees) = mysql_fetch_row(mysql_query("SELECT SUM(amount),SUM(fees) FROM zetapay_transactions WHERE paidto = 99 AND $timeframe"));
			$t1 += $dsumm;
			$t2 += $dfees;
			$t3 -= $wsumm;
			$t4 += $wfees;
			$t5 += $dfees + $wfees;
			if ($dsumm || $wsumm){
				echo "\n<tr>",
						"<td>Signup Bonus Paid",
						"<td>",dpsumm($dsumm, 1),
						"<td>",dpsumm($dfees, 1),
						"<td>",dpsumm(-$wsumm, 1),
						"<td>",dpsumm($wfees, 1),
						"<td>",dpsumm($dfees + $wfees, 1);
				$total += $dsumm - $wsumm + $dfees + $wfees;
				$i++;
			}
		}
		// count other
		$dsumm = 0;
		$dfees = 0;
		$wsumm = 0;
		$wfees = 0;
		list($dsumm,$dfees) = mysql_fetch_row(mysql_query("SELECT SUM(amount),SUM(fees) FROM zetapay_transactions WHERE paidby = 1 AND comment !='Account signup bonus' AND $timeframe"));
		list($wsumm,$wfees) = mysql_fetch_row(mysql_query("SELECT SUM(amount),SUM(fees) FROM zetapay_transactions WHERE paidto = 1 AND comment !='Account signup bonus' AND $timeframe"));
		$t1 += $dsumm;
		$t2 += $dfees;
		$t3 -= $wsumm;
		$t4 += $wfees;
		$t5 += $dfees + $wfees;
		if ($dsumm || $wsumm){
			echo "\n<tr>",
					"<td>Other",
					"<td>",dpsumm($dsumm, 1),
					"<td>",dpsumm($dfees, 1),
					"<td>",dpsumm(-$wsumm, 1),
					"<td>",dpsumm($wfees, 1),
					"<td>",dpsumm($dfees + $wfees, 1);
			$total += $dsumm - $wsumm + $dfees + $wfees;
			$i++;
		}
		echo "&nbsp;<tr><td>Total:",
				"<td>",dpsumm($t1, 1),
				"<td>",dpsumm($t2, 1),
				"<td>",dpsumm($t3, 1),
				"<td>",dpsumm($t4, 1),
				"<td>",dpsumm($t5, 1);
		if (!$i) echo "<tr><td colspan=6>&nbsp;";
	}
?>
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding: 10px;">
		<!------///////////////--->
		<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
			Today's Transaction Summary (<?=date('F d, Y')?>):
		</b></div>
		<!------///////////////--->
		<TABLE width=100% cellspacing=0>
		<tr>
			<td style="padding-left:10px;">&nbsp;</td>
			<TD>
				<TABLE class=design width=100% cellspacing=0>
				<form method=get name=form1>
				<tr>
					<th>&nbsp;
					<th>Deposits
					<th>Fees
					<th>Withdrawals
					<th>Fees
					<th>Total Fees
<?
					$date1 = mktime(0,0,0,$today['mon'],$today['mday'],$today['year']);
					$date2 = mktime(0,0,0,$today['mon'],$today['mday'] + 1,$today['year']);
					$timeframe = "UNIX_TIMESTAMP(trdate)>=$date1 AND UNIX_TIMESTAMP(trdate)<$date2";
					report();
?>
				<tr>
					<th colspan=7><div align=right>
						View detailed report for:
						<select name=dday>
						<? for ($i = 1; $i <= 31; $i++) echo "<option",($today['mday'] == $i ? " selected" : ""),">",sprintf("%02d",$i); ?>
						</select>
						<select name=dmonth>
						<? for ($i = 1; $i <= 12; $i++) echo "<option value=$i",($today['mon'] == $i ? " selected" : ""),">",date("F",mktime(0,0,0,$i,1,0)); ?>
						</select>
						<select name=dyear>
						<? for ($i = 2002; $i <= 2010; $i++) echo "<option",($today['year'] == $i ? " selected" : ""),">",$i; ?>
						</select>
						<!--    
						<select name=what>
						<option value="">View incomes and expenses
						<option value="+">View incomes
						<option value="-">View expenses
						</select>
						-->
						<SELECT onChange="gotocluster1(this)">
							<option value="">---
							<option value="viewtr">Payment Processors
							<option value="viewtr2">Transactions
							<option value="viewtr4">Referrals
							<option value="viewtr5">Transfers
							<option value="viewtr3">Admin Transactions
						</select>
					</th>
					<input type=hidden name=a value="viewtr">
					<input type=hidden name=source value="d">
					<input type=hidden name=suid value="<?=$suid?>">
					</form>
				</tr>
				</table>
			</td>
		</tr>
		</table>
		<br>
		<!------///////////////--->
		<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
			Monthly Transaction Summary (<?=date('F Y')?>)
		</b></div>
		<!------///////////////--->
		<TABLE width=100% cellspacing=0>
		<tr>
			<td style="padding-left:10px;">&nbsp;</td>
			<TD>
				<TABLE class=design width=100% cellspacing=0>
				<form method=get name=form2>
				<tr>
					<th>&nbsp;
					<th>Deposits
					<th>Fees
					<th>Withdrawals
					<th>Fees
					<th>Total Fees
<?
					$date1 = mktime(0,0,0,$today['mon'],1,$today['year']);
					$date2 = mktime(0,0,0,$today['mon'] + 1,1,$today['year']);
					$timeframe = "UNIX_TIMESTAMP(trdate)>=$date1 AND UNIX_TIMESTAMP(trdate)<$date2";
					report();
?>
				<tr>
					<th colspan=7><div align=right>
						View detailed report for:
						<select name=mmonth>
						<? for ($i = 1; $i <= 12; $i++) echo "<option value=$i",($today['mon'] == $i ? " selected" : ""),">",date("F",mktime(0,0,0,$i,1,0)); ?>
						</select>
						<select name=myear>
						<? for ($i = 2002; $i <= 2010; $i++) echo "<option",($today['year'] == $i ? " selected" : ""),">",$i; ?>
						</select>
						<!--    
						<select name=what>
						<option value="">View incomes and expenses
						<option value="+">View incomes
						<option value="-">View expenses
						</select>
						-->
						<SELECT onChange="gotocluster2(this)">
							<option value="">---
							<option value="viewtr">Payment Processors
							<option value="viewtr2">Transactions
							<option value="viewtr4">Referrals
							<option value="viewtr5">Transfers
							<option value="viewtr3">Admin Transactions
						</select>
					</th>
					<input type=hidden name=a value="viewtr">
					<input type=hidden name=source value="m">
					<input type=hidden name=suid value="<?=$suid?>">
					</form>
				</tr>
				</table>
			</td>
		</tr>
		</table>
		<br>
		<!------///////////////--->
		<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
			Year to Date (<?=date('Y')?>)
		</b></div>
		<!------///////////////--->
		<TABLE width=100% cellspacing=0>
		<tr>
			<td style="padding-left:10px;">&nbsp;</td>
			<TD>
				<TABLE class=design width=100% cellspacing=0>
				<form method=get name=form3>
				<tr>
					<th>&nbsp;
					<th>Deposits
					<th>Fees
					<th>Withdrawals
					<th>Fees
					<th>Total Fees
<?
					$date1 = mktime(0,0,0,1,1,$today['year']);
					$date2 = mktime(0,0,0,1,1,$today['year'] + 1);
					$timeframe = "UNIX_TIMESTAMP(trdate)>=$date1 AND UNIX_TIMESTAMP(trdate)<$date2";
					report();
?>
				<tr>
					<th colspan=7><div align=right>
						View detailed report for:
						<select name=yyear>
						<? for ($i = 2002; $i <= 2010; $i++) echo "<option",($today['year'] == $i ? " selected" : ""),">",$i; ?>
						</select>
						<!--    
						<select name=what>
						<option value="">View incomes and expenses
						<option value="+">View incomes
						<option value="-">View expenses
						</select>
						-->
						<SELECT onChange="gotocluster3(this)">
							<option value="">---
							<option value="viewtr">Payment Processors
							<option value="viewtr2">Transactions
							<option value="viewtr4">Referrals
							<option value="viewtr5">Transfers
							<option value="viewtr3">Admin Transactions
						</select>
					</th>
					<input type=hidden name=a value="viewtr">
					<input type=hidden name=source value="y">
					<input type=hidden name=suid value="<?=$suid?>">
					</form>
				</tr>
				</table>
			</td>
		</tr>
		</table>
		<br>
	</td>
</tr>
</form>
</table>