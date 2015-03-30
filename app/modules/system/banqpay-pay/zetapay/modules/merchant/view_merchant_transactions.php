<table width="100%" border="0" align="center" bgcolor="#FFFFFF">
<tr>
	<td>
		<table width="100%" border="0" align="center" cellpadding="3" cellspacing="3" bgcolor="#FFFFFF">
		<tr>
			<td width="80%" valign="top">
				<table width="100%" border="0" cellspacing="0" cellpadding="3">
				<tr>
					<td>
						<span class="text4">View Transactions</span><br>
						<hr width="100%" size="1"><br>
					</td>
				</tr>
				<tr>
					<td>
						<br>
						<center>
						<TABLE class=design cellspacing=0 width=100%>
						<tr>
							<th>Sent/Received
							<th>Name/Email
							<th>Amount
							<th>Date
							<th>Status
							<TH>&nbsp;
<?
							($startp = $_POST['startp'] or $startp = $_GET['startp']);
							$ulist_page = 20;
							if(!$startp){$startp = 0;}
							$qr2 = $zetadb->Execute("SELECT paidto,paidby,amount,zetapay_buyer_transactions.comment AS comment,trdate,id,fees FROM zetapay_buyer_transactions WHERE (paidto=$user OR paidby=$user) AND pending=0 ORDER BY trdate DESC");
							$numrows = $qr2->RecordCount();
						#	$ulist_page = $numrows / 2;
							$r = $zetadb->Execute("SELECT paidto,paidby,amount,zetapay_buyer_transactions.comment AS comment,trdate,id,fees FROM zetapay_buyer_transactions WHERE (paidto=$user OR paidby=$user) AND pending=0 ORDER BY trdate DESC LIMIT $startp,$ulist_page");
							$i = 1;
							$current = buyer_balance($user, 1);
							$namount = 0;
							while ($a = $r->FetchNextObject()) {
								if ($a->PAIDTO != $user){
									$a->AMOUNT = -$a->AMOUNT;
									$tofrom = "Sent";
								}else{
									$tofrom = "Received";
								}
								if($a->AMOUNT > 0){
									$a->AMOUNT = $a->AMOUNT + $a->FEES;
								}else{
									$a->AMOUNT = $a->AMOUNT - $a->FEES;
								}
?>
							<TR>
								<TD class=row<?=$i?> align=center><?=$tofrom?>
								<TD class=row<?=$i?> align=center><?=dpbuyer($a->PAIDTO == $user ? $a->PAIDBY : $a->PAIDTO)?>
								<TD class=row<?=$i?> align=center><?=dpsumm($a->AMOUNT,1)?>
								<TD class=row<?=$i?> align=center><?=dpdate($a->TRDATE)?>
								<TD class=row<?=$i?> align=center><?=($a->PENDING ? "pend" : "done")?>
								<TD class=row<?=$i?> align=center><a href="?a=buyer_transdet&did=<?=$a->ID?>">Details</a>
							</TR>
<?
							$i = 3 - $i;
						}
?>
						</table>
						<br><br>
						<TABLE class=empty cellspacing=0 width=100%>
						<form method=post name=pform>
						<input type=hidden name=startp value=0>
						<TR>
							<td align=left><div align=left>
					<?	if($startp > 0){	?>
								<a href="javascript:pform.startp.value = '<?=($startp - $ulist_page)?>'; pform.submit();"><b>&lt;&lt; Last <?=$ulist_page?> records</b></a>
					<?	}else{	?>
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<?	}	?>
							</td>
							<td align=center><div align=center>
								<b>&lt;&lt; Showing <?=($startp + $ulist_page)?> of <?=$numrows?> records &gt;&gt;</b>
							</td>
							<td align=right><div align=right>
					<?	if($numrows > ($startp + $ulist_page)){		?>
								<a href="javascript:pform.startp.value = '<?=($startp + $ulist_page)?>'; pform.submit();"><b>Next <?=$ulist_page?> records &gt;&gt;</b></a>
					<?	}else{	?>
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<?	}	?>

							</td>
						</TR>
						</TABLE>
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