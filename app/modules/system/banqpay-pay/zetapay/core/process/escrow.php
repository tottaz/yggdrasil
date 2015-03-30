<table width="100%" border="0" align="center" bgcolor="#FFFFFF">
<tr>
	<td>
		<table width="100%" border="0" align="center" cellpadding="3" cellspacing="3" bgcolor="#FFFFFF">
		<tr>
			<td width=20> </td>
			<td width="519" valign="top">
				<table width="100%" border="0" cellspacing="0" cellpadding="3">
				<tr>
					<td>
						<span class="text4">Escrow Transfer From Me <span class=small>(About <a href=index.php?read=safetransfers.htm&<?=$id?>>Escrow</a>)</span></span><br>
						<hr width="100%" size="1"><br>
					</td>
				</tr>
				<tr>
					<td>
						<TABLE class=design cellspacing=0>
						<TR>
							<TH>Paid To</TH>
							<TH>Amount</TH>
							<TH>&nbsp;</TH>
						</TR>
<?
						$r = mysql_query("SELECT zetapay_safetransfers.id,username,amount FROM zetapay_safetransfers,zetapay_users WHERE paidto=zetapay_users.id AND paidby=$user");
						$i = 1;
						while ($a = mysql_fetch_object($r)){
?>
						<TR><TD class=row<?=$i?>><?=$a->username?></TD>
							<TD class=row<?=$i?>><?=dpsumm($a->amount)?></TD>
							<TD class=row<?=$i?>><a onClick="return confirm('Are you sure you want to confirm?');" href=index.php?a=stransfer&conf=1&id=<?=$a->id?>&<?=$id?>>Confirm payment</a>
<?
						  $i = 3 - $i;
						}
?>
						</TD></TR>
						</table>
						<a href=index.php?a=stransfer&<?=$id?>>Place new escrow transfer</a><br>
						<BR>
					</td>
				</tr>
				</table>
				<table width="100%" border="0" cellspacing="0" cellpadding="3">
				<tr>
					</b></font></td>
					<td>
						<span class="text4">Escrow Transfers To Me <span class=small>(About <a href=index.php?read=safetransfers.htm&<?=$id?>>Escrow</a>)</span></span><br>
						<hr width="100%" size="1"><br>
					</td>
				</tr>
				<tr>
					<td>
						<TABLE class=design cellspacing=0>
						<TR>
							<TH>Paid by</TH>
							<TH>Amount</TH>
							<TH>&nbsp;</TH>
						</TR>

						<?
						$r = mysql_query("SELECT zetapay_safetransfers.id,username,amount FROM zetapay_safetransfers,zetapay_users WHERE paidby=zetapay_users.id AND paidto=$user");
						$i = 1;
						while ($a = mysql_fetch_object($r))
						{
						?>
						<TR><TD class=row<?=$i?>><?=$a->username?>
						    <TD class=row<?=$i?>><?=dpsumm($a->amount)?>
						    <TD class=row<?=$i?>><a onClick="return confirm('Are you sure you want to cancel?');" href=index.php?a=stransfer&canc=1&id=<?=$a->id?>&<?=$id?>&brand=<?=$brand?>>Cancel Payment</a>
						<?
						  $i = 3 - $i;
						}
						?>
						</table>
					</td>
				</tr>
				</table>
			</td>
		</tr>
		</table>
	</td>
</tr>
</table>