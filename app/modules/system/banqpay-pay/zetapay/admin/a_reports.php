<?
	if ($_GET['del']){
		$id = (int)$_GET['del'];
		mysql_query("DELETE FROM zetapay_transactions WHERE id=$id");
		unset($_GET['del']);
	}elseif ($_GET['edit']){
		$id = (int)$_GET['edit'];
		$_GET['id'] = $id;
		require("admin/g_trans.php");
		if ($_fpr_err) exit;
		unset($_GET['edit']);
	}
	function getimplode(){
		global $_REQUEST;
		reset($_REQUEST);
		while (list($k,$v) = each($_REQUEST)){
			if($k == "del")continue;
			if($k == "edit")continue;
			$r[] = urlencode($k)."=".urlencode($v);
		}
		return implode("&", $r);
	}
	$today = getdate(); 
	function report(){
		global $timeframe, $tr_sources,$affil_on,$signup_bonus,$suidline;
		global $ttype,$ufind,$tstatus,$tgate;
		$link = getimplode();
		if($ufind){
			$qr1 = mysql_query("SELECT id FROM zetapay_users WHERE (username='".addslashes($ufind)."' OR email='".addslashes($ufind)."')");
		}else{
			$qr1 = mysql_query("SELECT id FROM zetapay_users WHERE id > 100");
		}
		$total = 0;
		$i = 0;
		while ($r1 = mysql_fetch_object($qr1)){
			$ruser = $r1->id;
			$qr2 = mysql_query("SELECT paidto,paidby,amount,pending,zetapay_transactions.comment AS comment,trdate,id,fees,addinfo FROM zetapay_transactions WHERE (paidto=$ruser OR paidby=$ruser) $timeframe ORDER BY trdate DESC") or die( mysql_error() );
			$numrows = mysql_num_rows($qr2);
			$r = mysql_query("SELECT paidto,paidby,amount,pending,zetapay_transactions.comment AS comment,trdate,id,fees,addinfo FROM zetapay_transactions WHERE (paidto=$ruser OR paidby=$ruser) $timeframe ORDER BY trdate DESC") or die( mysql_error() );
			$i = 1;
			$current = balance($ruser, 1);
			$namount = 0;
			while ($a = mysql_fetch_object($r)){
				if($ttype == "d" && $a->paidby == $ruser)continue;
				if($ttype == "r" && ($a->paidby != 99) )continue;
				if($ttype == "w"){
					if($a->paidto == $ruser)continue;
					if($a->paidto > 100)continue;
				}
				if($ttype == "t"){
					if($a->paidby < 101)continue;
					if($a->paidto < 101)continue;
				}
				if($tgate){
					if( ($a->paidby != $tgate) && ($a->paidto != $tgate) )continue;
				}
				if($tstatus == "p" && $a->pending != 1)continue;
				if($tstatus == "d" && $a->pending == 1)continue;

				if ($a->paidto != $ruser){
					$a->amount = -$a->amount;
				}
				if($a->amount > 0){
#					$a->amount = $a->amount + $a->fees;
				}else{
#					$a->amount = $a->amount - $a->fees;
				}
				$report[$a->id] = $a;
				$i++;
			}
		}
		$i = 0;
		krsort($report);
		while( list($key,$val) = each($report) ){
			$a = $report[$key];
			$qr2 = mysql_fetch_object(mysql_query("SELECT username,email FROM zetapay_users WHERE id=$a->paidby"));
			$qr3 = mysql_fetch_object(mysql_query("SELECT username,email FROM zetapay_users WHERE id=$a->paidto"));
?>
			<TR>
				<TD class=row<?=$i?> align=center><span class=tiny><?=dpdate($a->trdate)?>
				<TD class=row<?=$i?> align=center><a href="main.php?a=user&id=<?=$qr2->username?>&<?=$suidline?>"><?=($qr2->email ? $qr2->email : $qr2->username)?></a>
				<TD class=row<?=$i?> align=center><a href="main.php?a=user&id=<?=$qr3->username?>&<?=$suidline?>"><?=($qr3->email ? $qr3->email : $qr3->username)?></a>
				<TD class=row<?=$i?> align=center><?=htmlspecialchars($a->comment)?>
				<TD class=row<?=$i?> align=center><?=dpsumm($a->amount,1)?>
				<TD class=row<?=$i?> align=center><?=dpsumm($a->fees,1)?>
				<TD class=row<?=$i?> align=center><?=($a->pending ? "pend" : "done")?>
				<td>
					<a href="main.php?edit=<?=$a->id?>&<?=$link?>">Edit</a>
					<a href="main.php?del=<?=$a->id?>&<?=$link?>" <?=$del_confirm?>>Del</a>
			</TR>
<?
			if($a->addinfo){
?>
				<TR>
					<TD colspan=8 class=row<?=$i?> align=center><span class=tiny><?=$a->addinfo?></TD
				</TR>
<?
			}
			$i = 3 - $i;
			$total += $a->amount;
			$totalfees += $a->fees;
		}
?>
		<TR>
			<Th colspan=4><div align=right>Totals:
			<Td align=center><?=dpsumm($total,1)?>
			<Td align=center><?=dpsumm($totalfees,1)?>
			<Td colspan=2>&nbsp;
		</TR>
<?
	}
?>
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding: 10px;">
<?	if($_REQUEST['search']){	?>
<?
		$tdisp = $_REQUEST['tdisp'];
		if($tdisp == "alt"){
			$date1 = mktime(0,0,0,$today['mon'],$today['mday'],$today['year']);
			$date2 = mktime(0,0,0,$today['mon'],$today['mday'] + 1,$today['year']);
		}else if($tdisp == "adt"){
			$date1 = mktime(0,0,0,$today['mon'],$today['mday'],$today['year']);
			$date2 = mktime(0,0,0,$today['mon'],$today['mday'] + 1,$today['year']);
			$_REQUEST['ttype'] = "d";
		}else if($tdisp == "apdt"){
			$date1 = mktime(0,0,0,$today['mon'],$today['mday'],$today['year']);
			$date2 = mktime(0,0,0,$today['mon'],$today['mday'] + 1,$today['year']);
			$_REQUEST['ttype'] = "d";
			$_REQUEST['tstatus'] = "p";
		}else if($tdisp == "awt"){
			$date1 = mktime(0,0,0,$today['mon'],$today['mday'],$today['year']);
			$date2 = mktime(0,0,0,$today['mon'],$today['mday'] + 1,$today['year']);
			$_REQUEST['ttype'] = "w";
		}else if($tdisp == "apwt"){
			$date1 = mktime(0,0,0,$today['mon'],$today['mday'],$today['year']);
			$date2 = mktime(0,0,0,$today['mon'],$today['mday'] + 1,$today['year']);
			$_REQUEST['ttype'] = "w";
			$_REQUEST['tstatus'] = "p";
		}else if($tdisp == "alm"){
			$date1 = mktime(0,0,0,$today['mon'],1,$today['year']);
			$date2 = mktime(0,0,0,$today['mon'] + 1,1,$today['year']);
		}else if($tdisp == "adm"){
			$date1 = mktime(0,0,0,$today['mon'],1,$today['year']);
			$date2 = mktime(0,0,0,$today['mon'] + 1,1,$today['year']);
			$_REQUEST['ttype'] = "d";
		}else if($tdisp == "apdm"){
			$date1 = mktime(0,0,0,$today['mon'],1,$today['year']);
			$date2 = mktime(0,0,0,$today['mon'] + 1,1,$today['year']);
			$_REQUEST['ttype'] = "d";
			$_REQUEST['tstatus'] = "p";
		}else if($tdisp == "awm"){
			$date1 = mktime(0,0,0,$today['mon'],1,$today['year']);
			$date2 = mktime(0,0,0,$today['mon'] + 1,1,$today['year']);
			$_REQUEST['ttype'] = "w";
		}else if($tdisp == "apwm"){
			$date1 = mktime(0,0,0,$today['mon'],1,$today['year']);
			$date2 = mktime(0,0,0,$today['mon'] + 1,1,$today['year']);
			$_REQUEST['ttype'] = "w";
			$_REQUEST['tstatus'] = "p";
		}
		if($_REQUEST['from_month'] && $_REQUEST['from_date'] && $_REQUEST['from_year']){
			$date1 = mktime(0,0,0,$_REQUEST['from_month'],$_REQUEST['from_date'],$_REQUEST['from_year']);
		}
		if($_REQUEST['to_month'] && $_REQUEST['to_date'] && $_REQUEST['to_year']){
			$date2 = mktime(0,0,0,$_REQUEST['to_month'],$_REQUEST['to_date']+1,$_REQUEST['to_year']);
		}
		if($date1 && $date2){
			$timeframe = "AND UNIX_TIMESTAMP(trdate)>=$date1 AND UNIX_TIMESTAMP(trdate)<$date2";
			$dateString = "(".date('F d, Y',$date1)." to ".date('F d, Y',$date2).")";
		}
?>
		<!------///////////////--->
		<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
			Transaction Reports <span class=tiny><?=$dateString?></span>:
		</b></div>
		<!------///////////////--->
		<TABLE width=100% cellspacing=0>
		<tr>
			<td style="padding-left:10px;">&nbsp;</td>
			<TD>
				<TABLE class=design width=100% cellspacing=0>
				<form method=get name=form1>
				<tr>
					<th>Time
					<th>From
					<th>To
					<th>Description
					<th>Amount
					<th>Fees
					<th>Status
					<th>&nbsp;
				</tr>
<?
				$ttype = $_REQUEST['ttype'];
				$ufind = $_REQUEST['email'];
				$tstatus = $_REQUEST['tstatus'];
				$tgate = $_REQUEST['tgate'];
				report();
?>
				</form>
				</table>
			</td>
		</tr>
		</table>
		<br>
		<TABLE class=design width=100% cellspacing=0>
		<tr>
			<td align=center><a href="main.php?a=reports&<?=$suidline?>">Search Again</a>
		</tr>
		</table>
		<br>
<?	}else{	?>
<?		include('admin/g_transsearch.php');	?>
<?	}	?>
	</td>
</tr>
</table>