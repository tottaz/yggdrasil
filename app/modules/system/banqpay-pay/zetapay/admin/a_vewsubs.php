<?

	$cyclep["D"]="Day(s)";
	$cyclep["W"]="Week(s)";
	$cyclep["M"]="Month(s)";
	$cyclep["Y"]="Year(s)";
	$acyclep["D"]="DAY";
	$acyclep["W"]="DAY";
	$acyclep["M"]="MONTH";
	$acyclep["Y"]="YEAR";

?>
<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
Subscriptions
</b></div>
<!------\\\\\\\\\\\\\\\--->
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding-left:10px;">&nbsp;</td>
	<TD>
		<TABLE class=design width=100% cellspacing=0>
		<TR>
			<th>From
			<th>Receiver
			<th>Amount
			<th>Cycle
			<th>Created
			<th>Ticks
			<th>Last
			<th>Next
			<th>Expires
			<TH>&nbsp;
<?
	if ($_GET['c']){
/*
		$r = mysql_fetch_object(mysql_query("SELECT * FROM zetapay_recur WHERE id=".(int)$_GET['c']));
		mysql_query("DELETE FROM zetapay_recur WHERE id=".(int)$_GET['c']);
*/
	}elseif ($_GET['d']){
		mysql_query("DELETE FROM zetapay_recur WHERE id=".(int)$_GET['d']);
	}
	$r = mysql_query("SELECT * FROM zetapay_recur") or die( mysql_error() );
	$i = 1;
	$current = balance($user, 1);
	$namount = 0;
	while ($a = mysql_fetch_object($r)){
		if($a->ticks == 1){
			$last = 0;
		}else{
			$last = $a->ticks - 1;
		}
		if($a->cycle_p == "W"){
			$a->cycle_d = $a->cycle_d * 7;
			$a->stop = $a->stop * 7;
		}

		$dateStr = date("Y-m-d G:i:s", $a->created);
		$sqla  = "SELECT DATE_ADD('$dateStr', INTERVAL ".$a->stop." ".$acyclep[$a->cycle_p].") AS expire,";
		$sqla .= " DATE_ADD('$dateStr', INTERVAL ".$last." ".$acyclep[$a->cycle_p].") AS last,";
		$sqla .= " DATE_ADD('$dateStr', INTERVAL ".($a->ticks * $a->cycle_d)." ".$acyclep[$a->cycle_p].") AS next";
		$sqla .= " FROM zetapay_recur WHERE id=".$a->id;
		$k = mysql_fetch_object( mysql_query($sqla) );
		$sqla  = "SELECT DATE_ADD('".$k->last."', INTERVAL ".$a->cycle_d." ".$acyclep[$a->cycle_p].") AS next";
		$sqla .= " FROM zetapay_recur WHERE id=".$a->id;
		$d = mysql_fetch_object( mysql_query($sqla) );
		list($uname1) = mysql_fetch_row(mysql_query("SELECT username FROM zetapay_users WHERE id=$a->user"));
?>
		<TR>
			<TD class=row<?=$i?> align=center><a href=main.php?a=user&id=<?=$uname1?>&<?=$id?>><?=$uname1?></a>
			<TD class=row<?=$i?> align=center><?=$a->receiver?>
			<TD class=row<?=$i?> align=center><?=dpsumm($a->amount)?>
			<TD class=row<?=$i?> align=center><?=$a->cycle_d." ".$cyclep[$a->cycle_p]?>
			<TD class=row<?=$i?> align=center><?=dpdate2($a->created);?>
			<TD class=row<?=$i?> align=center><?=$a->ticks;?>
			<TD class=row<?=$i?> align=center><?=dpdate3($k->last);?>
			<TD class=row<?=$i?> align=center><?=dpdate3($d->next);?>
			<TD class=row<?=$i?> align=center><?=dpdate3($k->expire);?>
			<TD class=row<?=$i?> align=center>
				<a href=main.php?a=vewsubs&d=<?=$a->id?>&<?=$id?>>Cancel</a>
			</td>
		</TR>
<?
		$i = 3 - $i;
	}
	if (!mysql_num_rows($r)){
		echo "<TR><TD colspan=8>No current Subscriptions.";
	}
?>
		</TABLE>
	</TD>
</TR>
</tABLE>