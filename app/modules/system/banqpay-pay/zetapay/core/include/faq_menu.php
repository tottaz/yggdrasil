<table width="150" border="0" cellpadding="0" cellspacing="0" class="design">
<tr><th>FAQ</th></tr>
<tr>
	<td>
<?
		$qr1 = mysql_query("SELECT * FROM zetapay_faq_cat_list ORDER BY id");
		$qr2 = mysql_query("SELECT * FROM zetapay_faq_cat_list ORDER BY id");
		$num = 0;
		for ($i = mysql_num_rows($qr2) - 1; $i >= 0; $i--){
			if( mysql_result($qr2, $i, 'title') ){
				$num++;
			}
		}
		$middle = (int)($num / 2);
		$mr = 1;
		while ($r1 = mysql_fetch_object($qr1)){
			if (!$r1->title) continue;
			list($cnt) = mysql_fetch_row(mysql_query("SELECT COUNT(*) FROM zetapay_faq_list WHERE cat=".$r1->id));
?>
			<a class=menulink href="faq.php?farea=<?=$r1->id?>"><?=$r1->title?> (<?=$cnt?>)</a><br>
<?
		}
?>
	</td>
</tr>
</table>
<br>
<table width="150" border="0" cellpadding="0" cellspacing="0" class="design">
<tr><th>Search FAQ</th></tr>
<tr>
	<td>
		<form method="POST">
		<input name="srch" type="text">
		<INPUT type=submit class=button value='Search &gt;&gt;'>
		</form></span>
	</td>
</tr>
</table>
<br>