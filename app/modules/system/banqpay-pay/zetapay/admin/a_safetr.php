<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
Pending Escrow List
</b></div>
<!------\\\\\\\\\\\\\\\--->
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding-left:10px;">&nbsp;</td>
	<TD>
		<TABLE class=design width=100% cellspacing=0>
		<TR><TH>From
			<TH>To
			<TH>Amount
			<TH>&nbsp;
<?
	if ($_GET['c']){
		$r = mysql_fetch_object(mysql_query("SELECT * FROM zetapay_safetransfers WHERE id=".(int)$_GET['c']));
		list($uname) = mysql_fetch_row(mysql_query("SELECT username FROM zetapay_users WHERE id=$r->paidby"));
		transact(2,$r->paidto,$r->amount,"Safe transfer from $uname");
		mysql_query("DELETE FROM zetapay_safetransfers WHERE id=".(int)$_GET['c']);
	}elseif ($_GET['d']){
		$r = mysql_fetch_object(mysql_query("SELECT * FROM zetapay_safetransfers WHERE id=".(int)$_GET['d']));
		list($uname) = mysql_fetch_row(mysql_query("SELECT username FROM zetapay_users WHERE id=$r->paidto"));
		transact(2,$r->paidby,$r->amount,"Safe transfer return from $uname");
		mysql_query("DELETE FROM zetapay_safetransfers WHERE id=".(int)$_GET['d']);
	}
	$qr1 = mysql_query("SELECT * FROM zetapay_safetransfers");
	while ($a = mysql_fetch_object($qr1)){
		list($uname1) = mysql_fetch_row(mysql_query("SELECT username FROM zetapay_users WHERE id=$a->paidby"));
		list($uname2) = mysql_fetch_row(mysql_query("SELECT username FROM zetapay_users WHERE id=$a->paidto"));
		echo "\n<TR>",
			"<TD><a href=main.php?a=user&id=$uname1&$id>$uname1</a>",
			"<TD><a href=main.php?a=user&id=$uname2&$id>$uname2</a>",
			"<TD>",dpsumm($a->amount),
			"<TD>",
			"<a href=main.php?a=safetr&c=$a->id&$id>Confirm</a> ",
			"<a href=main.php?a=safetr&d=$a->id&$id>Return</a>";
	}
	if (!mysql_num_rows($qr1))
		echo "<TR><TD colspan=4>No current transfers.";
?>
		</TABLE>
	</TD>
</TR>
</tABLE>