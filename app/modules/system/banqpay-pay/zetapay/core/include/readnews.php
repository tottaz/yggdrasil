<?

$nid = $_GET['nid'];
$anq = $zetadb->Execute("SELECT * FROM zetapay_news WHERE id=$nid");
$row = $anq->FetchNextObject();
?>
	<table width="100%" border="0" align="center" bgcolor="#FFFFFF">
	<tr bgcolor="#FFFFFF">
		<td width=10> </td>
		<td width="519" valign="top" bgcolor="#FFFFFF">
			<table width="100%" border="0" align="center" cellpadding="3" cellspacing="3" bgcolor="#FFFFFF">
			<tr>
				<td width="519" valign="top">
					<table width="100%" border="0" cellspacing="0" cellpadding="3" bgcolor="#FFFFFF">
					<tr>
						<td>
							<span class="text4"><?=$row->TITLE?></span>
							&nbsp;&nbsp;<span class="small"><?=dpdate2($row->CREATED)?></span>
							<br><hr width="100%" size="1"><br>
						</td>
					</tr>
					<tr>
						<td> </td>
					</tr>
					<tr>
						<td bgcolor="#FFFFFF">
							<?=$row->BODY?>
						</td>
					</tr>
					</table>
				</td>
			</tr>
			</table>
		</td>
	</tr>
	</table>