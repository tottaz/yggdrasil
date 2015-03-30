<?
/*
	$keywords = preg_split("/\\W/", $_POST['search']);
	while ($a = each($keywords)){
		if ($a[1]){
			$key_search[] = "/".preg_quote(htmlspecialchars($a[1]))."(?![>])/i";
			$token = "LIKE '%".addslashes($a[1])."%'";
			$key[] = "username $token OR email $token OR name $token OR profile $token";
		}
	}
*/
	$token = $_POST['search'];
	if($token){
		$key_search[] = "/".preg_quote(htmlspecialchars($token))."(?![>])/i";
		$key[] = "(username REGEXP '$token') OR (email REGEXP '$token') OR (name REGEXP '$token') OR (profile REGEXP '$token')";
		$key = implode(" OR ", $key);
	}
	if($_POST['xdelete']){
		$qr1 = mysql_query("SELECT * FROM zetapay_users WHERE type!='sys' ORDER BY username");
		$uC = 0;
		while ($d = mysql_fetch_object($qr1)){
			$key = $_POST["delete{$d->id}"];
			if($key){
				if($d->username == $key){
					delete_user($d->id);
					echo "{$d->username} was deleted<bR>";
					$uC++;
				}
			}
		}
		echo "$uC users deleted<bR>";
	}
?>
<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
<?	if($_GET['sus']){	?>
		Displaying Suspended Users
<?	}else{	?>
		User Search Results
<?	}	?>
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
		<INPUT type=hidden name=a value="searchu">
		<INPUT type=hidden name=sus value="<?=$_GET['sus']?>">
		<input type=hidden name=search value="<?=$_POST['search']?>">
		<TR><TH>Username
			<TH>Name
			<TH>Email
			<TH>Balance
			<TH>Status
			<TH>Last Logged In
			<TH>Last IP
			<TH>Delete
<?
$ulist_page = 20;
($startp = $_POST['startp'] or $startp = $_GET['startp']);
if(!$startp){$startp = 0;}
if($_GET['sus'] == 1){
	$susp = "suspended = 1";
}
$qr2 = mysql_query("SELECT * FROM zetapay_users WHERE type!='sys'".($key ? " AND ($key)" : "")." ".($susp ? " AND ($susp)" : "")." ORDER BY username ");
$numrows = mysql_num_rows($qr2);
$qr1 = mysql_query("SELECT * FROM zetapay_users WHERE type!='sys'".($key ? " AND ($key)" : "")." ".($susp ? " AND ($susp)" : "")." ORDER BY username LIMIT $startp,$ulist_page");
while ($a = mysql_fetch_object($qr1)){
	$ahref = "main.php?a=user&id=$a->username&$id";
	$href = "window.open('main.php?a=user&id=$a->username&$id','zetapay','width=500,height=500,toolbar=no,scrollbars=yes,menubar=no,resizable=1'); return false;";
	$href2 = "window.open('main.php?a=write&id=$a->username&$id','write','width=500,height=500,toolbar=no,scrollbars=yes,menubar=no,resizable=1'); return false;";
	$kname = $a->username;
	if ($key_search){
		$a->username = preg_replace($key_search, "<b>\\0</b>", $a->username);
		$a->email = preg_replace($key_search, "<b>\\0</b>", $a->email);
		$a->name = preg_replace($key_search, "<b>\\0</b>", htmlspecialchars($a->name));
	}
	if($charge_signup){
		$feep = "<TD>".($a->fee ? "yes" : "no")."\n";
	}
	$bqr = @mysql_query("SELECT * FROM zetapay_blocked_ip WHERE ip='$a->lastip'");
	$blocked = mysql_num_rows($bqr);
	echo 	"\n<TR>\n",
			"<TD><a href=\"$ahref\">$a->username</a>\n",
			"<TD>",($a->name != '' ? $a->name : "&nbsp;"),"\n",
			"<TD>$a->email (<a href=# onClick=\"$href2\"><span class=tiny>write</span></a>)\n",
			"<TD>",dpsumm(balance($a->id), 1),"\n",
			$feep,
			"<TD>";
	if ($a->suspended){
		echo "suspended "; 
	}else{ 
		echo "active"; 
	}
	echo 	"<TD>".dpdate($a->lastlogin);
	echo 	"<TD>",$a->lastip;
	if($blocked){
		echo "&nbsp;(<span class=tiny>IP blocked</span>)";
	}
	echo 	"<TD><input type=checkbox name=\"delete{$a->id}\" value=\"{$kname}\">";
}
?>
		<TR>
			<TH>&nbsp;
			<TH>&nbsp;
			<TH>&nbsp;
			<TH>&nbsp;
			<TH colspan=5 align=right>
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
</form>
<?
function delete_user($id){
	mysql_query("UPDATE zetapay_users SET referredby=NULL WHERE referredby=$id");
	mysql_query("UPDATE zetapay_transactions SET paidby=100 WHERE paidby=$id");
	mysql_query("UPDATE zetapay_transactions SET paidto=100 WHERE paidto=$id");
	mysql_query("UPDATE zetapay_safetransfers SET paidby=100 WHERE paidby=$id");
	mysql_query("UPDATE zetapay_safetransfers SET paidto=100 WHERE paidto=$id");
	list($uname) = mysql_fetch_row(mysql_query("SELECT username FROM zetapay_users WHERE id=$id"));
	mysql_query("DELETE FROM zetapay_users WHERE id=$id");
}
?>