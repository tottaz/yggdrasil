	<!------///////////////--->
	<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
	Who's OnLine
	</b></div>
	<!------\\\\\\\\\\\\\\\--->
	<TABLE width=100% cellspacing=0>
	<tr>
		<td style="padding-left:10px;">&nbsp;</td>
		<TD>
			<table class=design cellspacing=0 width=100%>
			<tr>
				<th>User Name
				<th>Name
				<th>Email
				<th>Signed on
<?
	$cols = 4;
	$r = mysql_query("SELECT a.* FROM zetapay_users a,zetapay_visitors b WHERE $wh a.username=b.username ORDER BY username");
	$i = 1;
	$cnt = 1;
	while ($a = mysql_fetch_object($r)){
		$info = userinfo($a->id);
		$ahref = "main.php?a=user&id=$a->username&$id";
		$href = "window.open('main.php?a=user&id=$a->username&$id','zetapay','width=500,height=500,toolbar=no,scrollbars=yes,menubar=no,resizable=1'); return false;";
		$href2 = "window.open('main.php?a=write&id=$a->username&$id','write','width=500,height=500,toolbar=no,scrollbars=yes,menubar=no,resizable=1'); return false;";
		echo "\n<tr>",
			"<td class=row$i><a href=\"$ahref\">$a->username</a>\n",
			"<td class=row$i>",($a->name != '' ? $a->name : "&nbsp;"),"\n",
			"<td class=row$i>$a->email (<a href=# onClick=\"$href2\">write</a>)\n",
			"<td class=row$i align=right>",date("d M Y \\@H:i", strtotime($a->signed_on));
		$cnt++;
		$i = 3 - $i;
	}
	if (!mysql_num_rows($r)) {
		echo "<tr><td colspan=$cols>No online users.";
	}
?>
			</table>
		</td>
	</tr>
	</table>