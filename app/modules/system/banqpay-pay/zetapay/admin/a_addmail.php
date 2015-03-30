<?
if ($_POST['submit']){
	$AddSubscriber = $_POST['AddSubscriber'];
	$subList = explode("\n",$AddSubscriber);
	echo "<ol>\n";
	while( list(,$value) = each($subList) ){
		$demail = $value;
		$qInsert = "INSERT INTO zetapay_mailing(email) VALUES ('$demail')";
		$result = mysql_query($qInsert);
		echo "<li>".$demail." added\n";
	}
	echo "</ol>\n";
}
?>
<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
Add To Mailing List
</b></div>
<!------\\\\\\\\\\\\\\\--->
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding-left:10px;">&nbsp;</td>
	<TD>
		<FORM method=post>
		<TABLE class=design cellspacing=0 width=80%>
		<TR>
			<TD colspan=2 valign=top>
				Enter E-mail Addresses: <small>Seperated by line breaks</small>
			</TD>
		</TR>
		<TR>
			<TD colspan=2 style="padding-left:10px">
				<TEXTAREA cols=100 rows=28 name=AddSubscriber><?= $_POST['AddSubscriber']; ?></TEXTAREA>
			</TD>
		</TR>
		<TR>
			<TH colspan=2><div align=right><INPUT type=submit name="submit" value='Add &gt;&gt;'></TH>
		</TR>
			<?=$id_post?>
		</FORM>
		</TABLE>
	</td>
</tr>
</table>