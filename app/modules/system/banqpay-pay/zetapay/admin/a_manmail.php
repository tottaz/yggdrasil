<?
$keywords = preg_split("/\\W/", $_POST['search']);
if($_POST['xdelete']){
	$qr1 = mysql_query("SELECT * FROM zetapay_mailing ORDER BY email");
	$uC = 0;
	while ($d = mysql_fetch_object($qr1)){
		$key = $_POST["delete{$d->id}"];
		if($key){
			if($d->email == $key){
				mysql_query("DELETE FROM zetapay_mailing WHERE id={$d->id}");
				echo "{$d->email} was deleted<bR>";
				$uC++;
			}
		}
	}
	die("$uC users deleted<bR>");
}
?>
<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
	Manage Mailing List
</b></div>
<!------///////////////--->
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding-left:10px;">&nbsp;</td>
	<TD>
		<TABLE class=design width=100% cellspacing=0>
		<form method=post name=form1>
		<input type=hidden name=xdelete value=0>
		<INPUT type=hidden name=suid value="<?=$suid?>">
		<INPUT type=hidden name=a value="manmail">
		<INPUT type=hidden name=sus value="<?=$_GET['sus']?>">
		<input type=hidden name=search value="<?=$_POST['search']?>">
		<TR><TH>Email
			<TH>Delete
<?
$ulist_page = 20;
($startp = $_POST['startp'] or $startp = $_GET['startp']);
if(!$startp){$startp = 0;}
$qr2 = mysql_query("SELECT * FROM zetapay_mailing ORDER BY email ");
$numrows = mysql_num_rows($qr2);
$qr1 = mysql_query("SELECT * FROM zetapay_mailing ORDER BY email LIMIT $startp,$ulist_page");
while ($a = mysql_fetch_object($qr1)){
	$ahref = "main.php?a=user&id=$a->email&$id";
	$href2 = "window.open('main.php?a=mwrite&id=$a->id&$id','write','width=500,height=500,toolbar=no,scrollbars=yes,menubar=no,resizable=1'); return false;";
	$kname = $a->email;
	if ($key_search){
		$a->email = preg_replace($key_search, "<b>\\0</b>", $a->email);
		$a->name = preg_replace($key_search, "<b>\\0</b>", htmlspecialchars($a->name));
	}
	echo 	"\n<TR>\n",
			"<TD>$a->email (<a href=# onClick=\"$href2\">write</a>)\n";
	echo 	"<TD><input type=checkbox name=\"delete{$a->id}\" value=\"{$kname}\">";
}
?>
		<TR>
			<TH colspan=3 align=right>
				<input type=button class=button value="Delete Selected Members" onClick="if (confirm('Delete this item?')) { form1.xdelete.value = '1'; form1.submit(); }">
			</TH>
		</TR>
		</TABLE>
	</td>
</tr>
</table>
<br>
</form>
<BR>
<TABLE class=design width=100% cellspacing=0>
<form method=post name=pform>
<input type=hidden name=startp value=0>
<input type=hidden name=search value="<?=$_POST['search']?>">
<TR>
<?	if($startp > 0){	?>
		<td align=left><div align=left><a href="javascript:pform.startp.value = '<?=($startp - $ulist_page)?>'; pform.submit();"><b>Previous</b></a></th>
<?	}	?>
<?	if($numrows > ($startp + $ulist_page)){		?>
		<td align=right><div align=right><a href="javascript:pform.startp.value = '<?=($startp + $ulist_page)?>'; pform.submit();"><b>Next</b></a></th>
<?	}	?>
</TR>
</TABLE>
</form>
<br><br>
<br>
<? echo mysql_num_rows($qr1)," users found"; ?>
<br><br>
<br>