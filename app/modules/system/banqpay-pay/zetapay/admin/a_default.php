<?
	$today = getdate();

     
	list($r1) = mysql_fetch_row(mysql_query("SELECT COUNT(*) FROM zetapay_transactions WHERE paidto>10 AND paidto<90 AND pending=1"));
	list($r2) = mysql_fetch_row(mysql_query("SELECT COUNT(*) FROM zetapay_transactions WHERE paidto>10 AND paidto<90 AND pending=0"));
	list($r3) = mysql_fetch_row(mysql_query("SELECT COUNT(*) FROM zetapay_transactions WHERE paidby>10 AND paidby<90 AND pending=1"));
	list($r4) = mysql_fetch_row(mysql_query("SELECT COUNT(*) FROM zetapay_transactions WHERE paidby>10 AND paidby<90 AND pending=0"));
	list($r5) = mysql_fetch_row(mysql_query("SELECT COUNT(*) FROM zetapay_safetransfers"));
	list($r6) = mysql_fetch_row(mysql_query("SELECT COUNT(*) FROM zetapay_users WHERE type != 'sys'"));
	list($cnt2) = mysql_fetch_row(mysql_query("SELECT COUNT(a.username) FROM zetapay_visitors a,zetapay_users b WHERE a.username=b.username"));

	list($dsumm) = mysql_fetch_row(mysql_query("SELECT SUM(amount) FROM zetapay_transactions WHERE paidto>100 AND paidby>10 AND paidby<20 AND pending=0"));
	list($wsumm) = mysql_fetch_row(mysql_query("SELECT SUM(amount+fees) FROM zetapay_transactions WHERE paidby>100 AND paidto>10 AND paidto<20 AND pending=0"));
	list($afees) = mysql_fetch_row(mysql_query("SELECT SUM(fees) FROM zetapay_transactions WHERE paidby>100 AND paidto>100"));
	list($sffees) = mysql_fetch_row(mysql_query("SELECT SUM(fees) FROM zetapay_transactions WHERE paidby=2 AND paidto>100"));
?>
	<TABLE class=design width=100% cellspacing=0>
	<tr>
		<td><br>
			<P>
			<b>Welcome!!!... From this administration panel you will have full control of your site.</B> 
			<br><br>
			<TABLE class=design bgColor=#ffffff cellPadding=3 cellSpacing=0 width=100% border='1' BORDERCOLOR="#C0C0C0" STYLE="border-collapse: collapse">
			<TR>
				<TD class='a1'>Total Number of Users:</TD>
				<TD class='a1'><?=$r6?></TD>
				<TD class='a1'>Total Number of Users Currently Online:</TD>
				<TD class='a1'><?=$cnt2?></TD>
			</TR>
<? if($allow_verify){	?>
<? list($v1) = mysql_fetch_row(mysql_query("SELECT COUNT(*) FROM zetapay_verify WHERE admin_verified=0")); ?>
<? list($v2) = mysql_fetch_row(mysql_query("SELECT COUNT(*) FROM zetapay_verify WHERE verified=1")); ?>
			<TR>
				<TD class='a1'>Total Number of Pending Verified Users:</TD>
				<TD class='a1'><?=$v1?></TD>
				<TD class='a1'>Total Number of Verified Users:</TD>
				<TD class='a1'><?=$v2?></TD>
			</TR>
<? }	?>
			<TR>
				<TD class='a1'>Total Number of Pending Withdrawals:</TD>
				<TD class='a1'><?=$r1?></TD>
				<TD class='a1'>Total Number of Withdrawals:</TD>
				<TD class='a1'><?=$r2?></TD>
			</TR>
			<TR>
				<TD class='a1'>Total Number of Pending Deposits:</TD>
				<TD class='a1'><?=$r3?></TD>
				<TD class='a1'>Total Number of Deposits:</TD>
				<TD class='a1'><?=$r4?></TD>
			</TR>
			<TR>
				<TD class='a1'>Total Number of Transactions:</TD>
				<TD class='a1'><?=( ($r1+$r2) + ($r3+$r4) )?></TD>
			   	<TD class='a1'>Total Accounts Balance:</TD> 
			   	<TD class='a1'><?=($dsumm-$afees-$sffees-$wsumm)?></TD> 
			</TR>
			</TABLE>		
		</td>
	</tr>
	</table>
	<br><br>
	<br>
	<FORM method=post action=main.php target=right name="sform1">
	<INPUT type=hidden name=a>
	<INPUT type=hidden name=suid value="<?=$suid?>">
	<TABLE class=design width=100% cellspacing=0>
	<TR>
		<TH colspan=5>Search Users</TH>
	</TR>
	<TR>
		<TD>Search</TD>
		<TD><INPUT type=text name=search size=27></TD>
		<TD><INPUT type=button onClick="sform1.a.value='searchu'; sform1.submit();" value="Search &gt;&gt;"></TD>
	</TR>
	</TABLE>