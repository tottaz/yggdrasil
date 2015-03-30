<?
if ($_POST['message']){
	if($_POST['testmail']){
		wrapmail($_POST['testmail'], $_POST['subject'], $_POST['message'], $defaultmail2);
		echo "test message was sent to ".$_POST['testmail'].".<br>";
	}else{
		if( ($_POST['to'] == 1) || ($_POST['to'] == 3) ){
			$where = "WHERE type!='sys'";
			$qr1 = mysql_query("SELECT email FROM zetapay_users $where");
			while ($a = mysql_fetch_object($qr1)){
				wrapmail($a->email, $_POST['subject'], $_POST['message'], $defaultmail2);
			}
			die(mysql_num_rows($qr1)." messages were sent.");
		}
		if( ($_POST['to'] == 2) || ($_POST['to'] == 3) ){
			$qr1 = mysql_query("SELECT email FROM zetapay_mailing");
			while ($a = mysql_fetch_object($qr1)){
				wrapmail($a->email, $_POST['subject'], $_POST['message'], $defaultmail2);
			}
			echo mysql_num_rows($qr1)." messages were sent.<br>";
		}
	}
}
?>
<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
Mass Mailing
</b></div>
<!------\\\\\\\\\\\\\\\--->
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding-left:10px;">&nbsp;</td>
	<TD>
		<FORM method=post>
		<TABLE class=design cellspacing=0 width=80%>
		<TR>
			<TD>Subject:
			<TD><INPUT type=text size=30 name=subject>
		<TR>
			<TD valign=top>Message:
			<TD><TEXTAREA cols=100 rows=28 name=message><? echo $emailtop,($emailbottom ? "\n" : ""),$emailbottom; ?></TEXTAREA>
		<TR>
			<TD nowrap>Send Mail To:
			<TD>
				<select name=to>
					<option value=1>Registered <?=$sitename?> Users
					<option value=2>Mailing List
					<option value=3>Everyone
				</select>
			</TD>
		</TR>
		<TR>
			<TH colspan=2><INPUT type=submit value='Send to subscribers'></TH>
		</TR>
		<TR>
		<TR>
			<TD>Your email:
			<TD><INPUT type=text size=30 name=testmail>
				<INPUT type=submit value='Send A Test To Me'>
			</TD>
		</TR>
			<?=$id_post?>
		</FORM>
		</TABLE>
	</td>
</tr>
</table>