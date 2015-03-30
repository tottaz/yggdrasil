<?
	dpareas(0);
	if ($_POST['change10']){
		$qr1 = mysql_query("SELECT * FROM zetapay_faq_cat_list");
		$max = 0;
		while ($a = mysql_fetch_object($qr1)){
			$x[$a->id] = 1;
			if ($a->id > $max) $max = $a->id;
			if (preg_match("/update/i", $_POST['change10'])){
				mysql_query("UPDATE zetapay_faq_cat_list SET title='".addslashes($_POST["title$a->id"])."' WHERE id=$a->id");
			}
		}
		for ($i = 0; $i <= $max; $i++){
			if (!$x[$i]) break;
			$sel_id = $i;
		}
		if (preg_match("/delete/i", $_POST['change10']) && $_POST['delete']){
			$id = (int)$_POST['delete'];
			mysql_query("DELETE FROM zetapay_faq_cat_list WHERE id=$id");
			mysql_query("UPDATE zetapay_area_list SET parent='0' WHERE parent=$id");
		}
		if (preg_match("/add/i", $_POST['change10']) && $_POST['title_new'] != ''){
			mysql_query("INSERT INTO zetapay_faq_cat_list SET title='".addslashes($_POST['title_new'])."'") or die( mysql_error() );
		}
	}
?>
	<CENTER>
	<SMALL>
	<SPAN style="color: red;">Warning:</SPAN>Deleting a group will place that group's areas into no group at all</SMALL>
	<BR>
	<TABLE class=design cellspacing=0>
	<TR>
		<th>&nbsp;</TH>
		<th>ID</TH>
		<th>Title</TH>
<?
		$qr1 = mysql_query("SELECT * FROM zetapay_faq_cat_list ORDER BY id");
		while ($a = mysql_fetch_object($qr1)){
?>
	<TR>
		<TD><?=($a->id ? "<input type=radio name=delete value=$a->id>" : "&nbsp;")?></TD>
		<TD><?=$a->id?></TD>
		<TD><input type=text name=title<?=$a->id?> size=60 value="<?=htmlspecialchars($a->title)?>"></TD>
<?
			$i++;
		}
?>
	<TR>
		<TH colspan=4>
			<input type=submit name=change10 value="Update header list">
			<input type=submit name=change10 value="Delete selected" <?=$del_confirm?>>
		</TH>
	</TR>
	<TR>
		<TD colspan=2>&nbsp;</TD>
		<TD><input type=text name=title_new size=60></TD>
	</TR>
	<TR>
		<TH colspan=4><input type=submit name=change10 value="Add new record"></TH>
	</TABLE>
	</CENTER>