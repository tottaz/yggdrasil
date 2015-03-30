<?
    global $zetadb;

	$cyclep["D"]="Day(s)";
	$cyclep["W"]="Week(s)";
	$cyclep["M"]="Month(s)";
	$cyclep["Y"]="Year(s)";
	$acyclep["D"]="DAY";
	$acyclep["W"]="WEEK";
	$acyclep["M"]="MONTH";
	$acyclep["Y"]="YEAR";

	if ($_GET['d']){
	  $zetadb->Execute("DELETE FROM zetapay_recur WHERE id='".(int)$_GET['d']"'");
    }
?>
<table width="100%" border="0" align="center" bgcolor="#FFFFFF">
<tr>
	<td>
		<table width="100%" border="0" align="center" cellpadding="3" cellspacing="3" bgcolor="#FFFFFF">
		<tr>
			<td width="80%" valign="top">
				<table width="100%" border="0" cellspacing="0" cellpadding="3">
				<tr>
					<td>
						<span class="text4">View My Subscriptions</span><br>
						<hr width="100%" size="1"><br>
					</td>
				</tr>
				<tr>
					<td>
						<br>
						<center>
						<TABLE class=design cellspacing=0 width=100%>
						<tr>
							<th>Receiver
							<th>Amount
							<th>Cycle
							<th>Created
							<th>Ticks
							<th>Last
							<th>Next
							<th>Expires
							<th>&nbsp;
<?
                    		$rs = $zetadb->Execute("SELECT * FROM zetapay_recur WHERE user=$user");

							$i = 1;
							$current = merchant_balance($user, 1);
							$namount = 0;
							while ($a = $rs->FetchNextObject()){
//								'1997-12-31 23:59:59'
								if($a->TICKS == 1){
									$last = 0;
								}else{
									$last = $a->TICKS - 1;
								}
								$dateStr = date("Y-m-d G:i:s", $a->CREATED);
								$sqla  = "SELECT DATE_ADD('$dateStr', INTERVAL ".$a->STOP." ".$acyclep[$a->CYCLE_P].") AS expire,";
								$sqla .= " DATE_ADD('$dateStr', INTERVAL ".$last." ".$acyclep[$a->CYCLE_P].") AS last,";
								$sqla .= " DATE_ADD('$dateStr', INTERVAL ".($a->TICKS * $a->CYCLE_D)." ".$acyclep[$a->CYCLE_D].") AS next";
								$sqla .= " FROM zetapay_recur WHERE id=".$a->ID;

                    		    $rs = $zetadb->Execute(sqla);
                                $k = $rs->FetchNextObject();

								$sqla  = "SELECT DATE_ADD('".$k->LAST."', INTERVAL ".$a->CYCLE_D." ".$acyclep[$a->CYCLE_P].") AS next";
								$sqla .= " FROM zetapay_recur WHERE id=".$a->ID;

                    		    $rs = $zetadb->Execute(sqla);
                                $d = $rs->FetchNextObject();

								if( strtotime($k->EXPIRE) < time() )continue;
?>
							<TR>
								<TD class=row<?=$i?> align=center><?=$a->RECEIVER?>
								<TD class=row<?=$i?> align=center><?=dpsumm($a->AMOUNT)?>
								<TD class=row<?=$i?> align=center><?=$a->CYCLE_D." ".$cyclep[$a->CYCLE_P]?>
								<TD class=row<?=$i?> align=center><?=dpdate2($a->CREATED);?>
								<TD class=row<?=$i?> align=center><?=$a->ticks;?>
								<TD class=row<?=$i?> align=center><?=dpdate3($k->LAST);?>
								<TD class=row<?=$i?> align=center><?=dpdate3($d->NEXT);?>
								<TD class=row<?=$i?> align=center><?=dpdate3($k->EXPIRE);?>
								<TD class=row<?=$i?> align=center><a href=index.php?a=merchant_view_subscription&d=<?=$a->ID?>&<?=$merchant_id?>>Cancel</a>
							</TR>
<?
							$i = 3 - $i;
						}
?>
						</table>
						</form>
					</td>
				</tr>
				</table>
				<br><br>
				<table width="100%" border="0" cellspacing="0" cellpadding="3">
				<tr>
					<td>
						<span class="text4">View My Subscriptions To Me</span><br>
						<hr width="100%" size="1"><br>
					</td>
				</tr>
				<tr>
					<td>
						<br>
						<center>
						<TABLE class=design cellspacing=0 width=100%>
						<tr>
							<th>From
							<th>Amount
							<th>Cycle
							<th>Created
							<th>Ticks
							<th>Last
							<th>Next
							<th>Expires
							<th>&nbsp;
<?
                  		    $rs = $zetadb->Execute("SELECT * FROM zetapay_recur WHERE receiver='".$data->EMAIL."'");

							$i = 1;
							$current = balance($user, 1);
							$namount = 0;
							while ($a = $rs->FetchNextObject()){
//								'1997-12-31 23:59:59'
								if($a->TICKS == 1){
									$last = 0;
								}else{
									$last = $a->TICKS - 1;
								}
								$dateStr = date("Y-m-d G:i:s", $a->CREATED);
								$sqla  = "SELECT DATE_ADD('$dateStr', INTERVAL ".$a->STOP." ".$acyclep[$a->CYCLE_P].") AS expire,";
								$sqla .= " DATE_ADD('$dateStr', INTERVAL ".$last." ".$acyclep[$a->CYCLE_P].") AS last,";
								$sqla .= " DATE_ADD('$dateStr', INTERVAL ".($a->TICKS * $a->CYCLE_D)." ".$acyclep[$a->CYCLE_P].") AS next";
								$sqla .= " FROM zetapay_recur WHERE id=".$a->ID;

                    		    $rs = $zetadb->Execute(sqla);
                                $k = $rs->FetchNextObject();

								$sqla  = "SELECT DATE_ADD('".$k->LAST."', INTERVAL ".$a->CYCLE_D." ".$acyclep[$a->CYCLE_P].") AS next";
								$sqla .= " FROM zetapay_recur WHERE id=".$a->ID;

                    		    $rs = $zetadb->Execute(sqla);
                                $d = $rs->FetchNextObject();

								if( strtotime($k->EXPIRE) < time() )continue;

                    		    $rs = $zetadb->Execute("SELECT email FROM zetapay_users WHERE merchant_id=$a->USER");
                                $tre = $rs->FetchNextObject();
                                $uname1 = $tre[0];
?>
							<TR>
								<TD class=row<?=$i?> align=center><?=$uname1?>
								<TD class=row<?=$i?> align=center><?=dpsumm($a->AMOUNT)?>
								<TD class=row<?=$i?> align=center><?=$a->CYCLE_D." ".$cyclep[$a->CYCLE_P]?>
								<TD class=row<?=$i?> align=center><?=dpdate2($a->CREATED);?>
								<TD class=row<?=$i?> align=center><?=$a->TICKS;?>
								<TD class=row<?=$i?> align=center><?=dpdate3($k->LAST);?>
								<TD class=row<?=$i?> align=center><?=dpdate3($d->NEXT);?>
								<TD class=row<?=$i?> align=center><?=dpdate3($k->EXPIRE);?>
								<TD class=row<?=$i?> align=center><a href=index.php?a=merchant_view_subscriptions&d=<?=$a->ID?>&<?=$merchant_id?>>Cancel</a>
							</TR>
<?
							$i = 3 - $i;
						}
?>
						</table>
						</form>
					</td>
				</tr>
				</table>
			</td>
		</tr>
		</table>
	</td>
</tr>
</table>