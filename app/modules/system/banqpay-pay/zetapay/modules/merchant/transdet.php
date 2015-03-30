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
						<span class="text4">Transaction Details</span><br>
						<hr width="100%" size="1"><br>
					</td>
				</tr>
				<tr>
					<td>
<?
						($startp = $_POST['startp'] or $startp = $_GET['startp']);
						($did = $_POST['did'] or $did = $_GET['did']);
						$ulist_page = 3;
						if(!$startp){$startp = 0;}

						$qr2 = $zetadb->Execute("SELECT paidto,paidby,amount,addinfo,zetapay_merchant_transactions.comment AS comment,trdate,id,fees FROM zetapay_merchant_transactions WHERE id='$did' ORDER BY trdate DESC");
						$numrows = $qr2->RecordCount();
						$r = $zetadb->Execute("SELECT paidto,paidby,amount,addinfo,zetapay_merchant_transactions.comment AS comment,trdate,id,fees FROM zetapay_merchant_transactions WHERE id='$did' ORDER BY trdate DESC LIMIT $startp,$ulist_page");
						$i = 1;
						$current = merchant_balance($user, 1);
						$namount = 0;
						while ($a = $r->FetchNextObject()){
							$uto = dpmerchantObj($a->PAIDTO);
							$uby = dpmerchantObj($a->PAIDBY);
							$toemail = "(".$uto->EMAIL.")";
							$fremail = "(".$uby->EMAIL.")";
							if($a->PAIDBY != $user){
								$afrusr = dpmerchantObj($a->PAIDBY);
								if($a->FEES){
					//				$namount = $a->amount - $a->fees;
					//				$a->fees = -$a->fees;
								}
					#			$toemail = "";
							}
							if ($a->PAIDTO != $user){
								$a->AMOUNT = -$a->AMOUNT;
					#			$fremail = "";
							}
							$j = $i;
							$amount = $a->AMOUNT;
							if($amount > 0){
								$amount = $amount + $a->FEES;
							}else{
								$amount = $amount - $a->FEES;
							}
							$namount = $a->AMOUNT;
							if($a->ADDINFO){
								$a->COMMENT .= "<br>".$a->ADDINFO;
							}

							echo
									"<TABLE class=design cellspacing=0 width=100%>",
									"<TR>",
									"	<TH>Transaction ID:</TH>",
									"	<TD class=row$i>",$a->id,
									"<TR>",
									"	<TH>To</TH>",
									"	<TD class=row".($j+1)." >",dpmerchant($a->PAIDTO)," ",$toemail,
									"<TR>",
									"	<TH>From</TH>",
									"	<TD class=row".($j+1)." >",dpmerchant($a->PAIDBY)," ",$fremail,
									"<TR>",
									"	<TH>Total Amount</TH>",
									"	<TD class=row".($j+1)." title='$current'>",dpsumm( ($amount), 1),
									"<TR>",
									"	<TH>Fee Amount</TH>",
									"	<TD class=row".($j+1).">",dpsumm2($a->FEES, 1),
									"<TR>",
									"	<TH>Net Amount</TH>",
									"	<TD class=row".($j+1).">",dpsumm($namount, 1),
									"<TR>",
									"	<TH>Description</TH>",
									"	<TD class=row".($j+1).">",$a->COMMENT,
									"<TR>",
									"	<TH>Date</TH>",
									"	<TD class=row".($j+1).">",dpdate($a->TRDATE),
									"</TABLE><br><br>";
							if ($a->paidto != $a->PAIDBY)
								$current -= $a->AMOUNT;
							$i = 3 - $i;
						}
?>
						<br><br>
						<TABLE class=empty cellspacing=0 width=100%>
						<form method=post name=pform>
						<input type=hidden name=startp value=0>
						<input type=hidden name=did value=<?=$did?>>
						<TR>
								<td align=left><div align=left>
						<?	if($startp > 0){	?>
									<a href="javascript:pform.startp.value = '<?=($startp - $ulist_page)?>'; pform.submit();"><b>&lt;&lt; Last <?=$ulist_page?> records</b></a>
						<?	}else{	?>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<?	}	?>
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