<table width="100%" border="0" align="center" bgcolor="#FFFFFF">
<tr>
	<td>
		<table width="100%" border="0" align="center" cellpadding="3" cellspacing="3" bgcolor="#FFFFFF">
		<tr>
			<td width="80%" valign="top">
				<table width="100%" border="0" cellspacing="0" cellpadding="3" bgcolor="#FFFFFF">
				<tr>
					<td>
						<span class="text4">Account Overview</span><br>
						<hr width="100%" size="1"><br>
					</td>
				</tr>
				<tr>
					<td bgcolor="#FFFFFF">
<?
		// Get balance and last transaction
		$balance = merchant_balance($user, 1);
		$rs = $zetadb->Execute("SELECT paidto,amount,comment,trdate,fees FROM zetapay_merchant_transactions WHERE (paidto=$user OR paidby=$user) AND pending=0 ORDER BY trdate DESC LIMIT 1");
        $r = $rs->FetchNextObject();
		if ($r && $r->PAIDTO != $user) $r->AMOUNT = -$r->AMOUNT;
		if($r->AMOUNT > 0){
			$r->AMOUNT = $r->AMOUNT + $r->FEES;
		}else{
			$r->AMOUNT = $r->AMOUNT - $r->FEES;
		}
?>
						<table height="100%" width="100%" border="0" cellspacing="0" cellpadding="0" class="empty">
						<tr bgcolor="#FFFFFF">
							<td width="15%" height="20"><strong>Name:</strong></td>
							<td><?=$merchant_data->NAME?> <?=confirmStr($user)?></td>
						</tr>
						<tr bgcolor="#FFFFFF">
							<td height="20"><strong>Email:</strong></td>
							<td><?=$merchant_data->EMAIL?></td>
						</tr>
<?	if($allow_verify){	?>
						<tr bgcolor="#FFFFFF">
							<td height="20"><strong>Status:</strong></td>
							<td><?=verifiedMerchantLink($user)?></font></td>
						</tr>
<?	}	?>
						<tr bgcolor="#FFFFFF">
							<td height="20" colspan=2>
								<table bgcolor="#ffffb0" border="0" width="150" height="20" class="balance_border">
								<tr align="center" bgcolor="#ffffb0">
									<td bgcolor="#ffffb0"><strong>Balance:</strong></td>
									<td bgcolor="#ffffb0"><?=dpsumm($balance)?></td>
								</tr>
								</table>
							</td>
						</tr>
						<tr>
							<td>&nbsp;&nbsp;</td>
						</tr>
						</table>
						<br>
						<table height="100%" width="100%" border="0" cellspacing="0" cellpadding="0" class="empty">
						<tr bgcolor="#FFFFFF">
							<td height="25" colspan="2">
								<span class="text4">Recent Account Activity</span>
								<hr width="100%" size="1"><br>
							</td>
						</tr>
						<tr>
							<td colspan=2 height="1" colspan="2" bgcolor="#C8C8C8">
								<TABLE class=design cellspacing=0 width=100%>
								<tr>
									<th>Sent/Received
									<th>Name/Email
									<th>Amount
									<th>Date
									<th>Status
									<TH>&nbsp;
<?
					// Most Recent Transactions
					$r2 = $zetadb->Execute("SELECT * FROM zetapay_merchant_transactions WHERE (paidto=$user OR paidby=$user) ORDER BY trdate DESC LIMIT 0,7");
					$i = 1;
					while ($a = $r2->FetchNextObject()){
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
						$style = "background-color: #EFEFEF;";
						if($i == 2){
							$style = "background-color: #F8F8F8;";
						}
?>
								<TR>
									<TD class=row<?=$i?> style="<?=$style?>" align=center><?=$tofrom?>
									<TD class=row<?=$i?> style="<?=$style?>" align=center><?=dpmerchant($a->PAIDTO == $user ? $a->PAIDBY : $a->PAIDTO)?>
									<TD class=row<?=$i?> style="<?=$style?>" align=center><?=dpsumm($a->AMOUNT,1)?>
									<TD class=row<?=$i?> style="<?=$style?>" align=center><?=dpdate($a->TRDATE)?>
									<TD class=row<?=$i?> style="<?=$style?>" align=center><?=($a->PENDING ? "pend" : "done")?>
									<TD class=row<?=$i?> style="<?=$style?>" align=center><a href="?a=merchant_transdet&did=<?=$a->ID?>">Details</a>
								</TR>
<?
						$i = 3 - $i;
					}
?>
								</table>
								<a href=?a=view_merchant_transactions&<?=$id?>>View All Transactions</a></SPAN>
								<br>
							</td>
						</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td></td>
				</tr>
				</table>
			</td>
		</tr>
		</table>
	</td>
</tr>
</table>