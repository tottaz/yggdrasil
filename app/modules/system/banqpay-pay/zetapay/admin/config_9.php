<?	dpareas(0);
	if ($_POST['change9']){
		$qr1 = mysql_query("SELECT * FROM zetapay_news");
		$max = 0;
		while ($a = mysql_fetch_object($qr1)){
			$x[$a->id] = 1;
			if ($a->id > $max) $max = $a->id;
			if (preg_match("/update/i", $_POST['change9'])){
				mysql_query("UPDATE zetapay_news SET title='".addslashes($_POST["title$a->id"])."',body='".addslashes($_POST["body$a->id"])."',created='".time()."' WHERE id=$a->id");
			}
		}
		for ($i = 0; $i <= $max; $i++){
			if (!$x[$i]) break;
			$sel_id = $i;
		}
		if (preg_match("/delete/i", $_POST['change9']) && $_POST['delete']){
			$id = (int)$_POST['delete'];
			mysql_query("DELETE FROM zetapay_news WHERE id=$id");
		}
		if (preg_match("/add/i", $_POST['change9']) && $_POST['titlenew'] != ''){
			mysql_query("INSERT INTO zetapay_news SET title='".addslashes($_POST['titlenew'])."',body='".addslashes($_POST["bodynew"])."',created='".time()."'") or die( mysql_error() );
		}
	}
?>
	<CENTER>
	<BR>
	<TABLE class=design cellspacing=0>
	<TR>
		<th>&nbsp;</TH>
		<th>ID</TH>
		<th>title / body</TH>
<?
		$qr1 = mysql_query("SELECT * FROM zetapay_news ORDER BY id");
		while ($a = mysql_fetch_object($qr1)){
?>
			<TR>
				<TD valign=top><?=($a->id ? "<input type=radio name=delete value=$a->id>" : "&nbsp;")?></TD>
				<TD valign=top><?=$a->id?></TD>
				<TD valign=top>
					<TABLE class=design cellspacing=0>
					<TR>
						<TD valign=top><b>Title: </TD>
						<TD valign=top>
							<input type=text name=title<?=$a->id?> size=60 value="<?=htmlspecialchars($a->title)?>">
						</TD>
					</TR>
					<TR>
						<TD valign=top><b>Body: </TD>
						<TD valign=top>
							<textarea name="body<?=$a->id?>" cols=60 rows=5><?=htmlspecialchars($a->body)?></textarea>
						</TD>
					</TR>
					</table>
				</TD>
			</TR>
<?
			$i++;
		}
?>
	<TR>
		<TH colspan=4>
			<input type=submit name=change9 value="Update Announcements">
			<input type=submit name=change9 value="Delete selected" <?=$del_confirm?>>
		</TH>
	</TR>
	<TR>
		<TD colspan=2>&nbsp;</TD>
		<TD valign=top>
			<TABLE class=design cellspacing=0>
			<TR>
				<TD valign=top><b>Title:</TD>
				<TD valign=top>
					<input type=text name=titlenew size=60>
				</TD>
			</TR>
			<TR>
				<TD valign=top><b>Body:</TD>
				<TD valign=top>
					<textarea name="bodynew" cols=60 rows=5></textarea>
				</TD>
			</TR>
			</TABLE>
		</TD>
	</TR>
	<TR>
		<TH colspan=4><input type=submit name=change9 value="Add new record"></TH>
	</TABLE>
	</CENTER>