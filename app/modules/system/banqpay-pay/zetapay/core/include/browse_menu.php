<table width="100%" border="0" cellpadding="0" cellspacing="0" class="design">
<tr>
	<th><?=$sitename?> Shops</th>
</tr>
<tr>
	<td>
<?
	adpareas(0);
	dpareas(0);
	reset($aenum_areas);
	reset($enum_areas);
	while ($a = each($aenum_areas)){
		echo "<a class=menulink href=?a=browse&area={$a[0]}&{$id}>{$a[1]}</a><BR>";
	}					
?>
	</td>
</tr>
</table>
<div align="center">
<br>