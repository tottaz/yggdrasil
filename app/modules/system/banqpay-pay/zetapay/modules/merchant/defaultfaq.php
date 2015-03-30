<?

	function getBuyerCatTitle($cat){
        global $zetadb;
		$qr1 = $zetadb->Execute("SELECT * FROM zetapay_buyer_faq_cat_list WHERE id=$cat ORDER BY id");
		$r1 = mysql_fetch_object($qr1);
		return $r1->title;
	}

	function BuyerFAQSearch($srch){
		ob_start();
		$query = "SELECT COUNT(id) AS total FROM zetapay_faq_list WHERE (question REGEXP '$srch') OR (answer REGEXP '$srch')";
		$result = mysql_query($query) or die ("Error in query: $query. " . mysql_error());
		extract( mysql_fetch_array($result) );
		$query = "SELECT * FROM zetapay_faq_list WHERE (question REGEXP '$srch') OR (answer REGEXP '$srch') ORDER BY cat DESC";
		$result = mysql_query($query) or die ("Error in query: $query. " . mysql_error());
		if ($total > 1){
			$dd = "results";
		}else{
			$dd = "result";
		}
?>
<br>
<TABLE border=0 cellpadding=0 cellspacing=0 width="96%" align="center">
<TR><TD valign=top>
<?
		while ( $r1 = mysql_fetch_object($result) ){
		if (!$r1->question) continue;
?>
			<a name="<?=$r1->id?>"></a>
			<TABLE class="design" border="0" width="100%" cellpadding="0" cellspacing="0">
			<TR>
				<TH><b><?=$r1->question?></b></TH></TR>
			<TR>
				<TD colspan=2><span class=small><?=nl2br($r1->answer)?></TD></TR>
			<TR>
				<TH align="right"><a href="#top" style="color:#FFFFFF;"><span class=tiny>View all Questions</a></TH>
			</TABLE>
			<br><br>
<?		
			$mycnt++;
		}
?>
</TD></TR>
</TABLE>
		<?=$total?> <?=$dd?> results found<br>
<?
		$searchresults = ob_get_contents();
	ob_end_clean(); 
		return $searchresults;
	}

	if($_REQUEST["farea"]){
	ob_start();
?>
<br>
<TABLE border=0 cellpadding=0 cellspacing=0 width="96%" align="center">
<TR><TD valign="top">
<?
		$qr1 = mysql_query("SELECT * FROM zetapay_faq_list WHERE cat='".$_REQUEST["farea"]."' ORDER BY cat");
		$qr2 = mysql_query("SELECT * FROM zetapay_faq_list WHERE cat='".$_REQUEST["farea"]."' ORDER BY cat");
		$num = 0;
		for ($i = mysql_num_rows($qr2) - 1; $i >= 0; $i--){
			if (mysql_result($qr2, $i, 'question')){
				$num++;
			}
		}
		$middle = (int)($num / 3);
		$mr = 1;
		$mycnt = 0;
		$abc = 0;
		while ($r1 = mysql_fetch_object($qr1)){
			if (!$r1->question) continue;
?>
	<a href="#<?=$r1->id?>" class="BrowseLink">&raquo;&nbsp;<?=$r1->question?></a><br>
<?		
		$mycnt++;
	}
?>
</TD></TR>
</TABLE>
<br>
<TABLE border=0 cellpadding=0 cellspacing=0 width="96%" align="center">
<TR valign="top"><TD valign="top">
<?
		$qr1 = mysql_query("SELECT * FROM zetapay_faq_list WHERE cat='".$_REQUEST["farea"]."' ORDER BY cat");
		$qr2 = mysql_query("SELECT * FROM zetapay_faq_list WHERE cat='".$_REQUEST["farea"]."' ORDER BY cat");
		$num = 0;
		for ($i = mysql_num_rows($qr2) - 1; $i >= 0; $i--){
			if (mysql_result($qr2, $i, 'question')){
				$num++;
			}
		}
		$middle = (int)($num / 3);
		$mr = 1;
		$mycnt = 0;
		$abc = 0;
		while ($r1 = mysql_fetch_object($qr1)){
			if (!$r1->question) continue;
?>
			<a name="<?=$r1->id?>"></a>
			<TABLE class="design" border="0" width="100%" cellpadding="0" cellspacing="0">
			<TR>
				<TH><b><?=$r1->question?></b></TH></TR>
			<TR>
				<TD colspan=2><span class=small><?=nl2br($r1->answer)?></TD></TR>
			<TR>
				<TH align="right"><a href="#top" style="color:#FFFFFF;"><span class=tiny>View all Questions</a></TH>
			</TABLE>
			<br><br>
<?		
			$mycnt++;
		}
?>
</TD></TR>
</TABLE>
<?
		$faqs = ob_get_contents();
		ob_end_clean(); 
	}else{
		ob_start();
?>
<TABLE border=0 cellpadding=0 cellspacing=0 width="96%" align="center">
<TR><TD width=4%>&nbsp;</TD>
	<TD width=48% valign=top>
<?
		$qr1 = mysql_query("SELECT * FROM zetapay_faq_cat_list ORDER BY id") or die( mysql_error() );
		$qr2 = mysql_query("SELECT * FROM zetapay_faq_cat_list ORDER BY id");
		$num = 0;
		for ($i = mysql_num_rows($qr2) - 1; $i >= 0; $i--){
			if (mysql_result($qr2, $i, 'title')){
				$num++;
			}
		}
		$middle = (int)($num / 2);
		$mr = 1;
		while ($r1 = mysql_fetch_object($qr1)){
		if (!$r1->title) continue;
			list($cnt) = mysql_fetch_row(mysql_query("SELECT COUNT(*) FROM zetapay_faq_list WHERE cat=".$r1->id));
?>
			<a href="faq.php?farea=<?=$r1->id?>" class="BrowseLink">&raquo;&nbsp;<?=$r1->title?></a><br>
<?
		}
?>
</TD></TR>
</TABLE>
<?
		$cats = ob_get_contents();
		ob_end_clean(); 
	}
	ob_start();
		if($_REQUEST["farea"]){
			$catname = getCatTitle($_REQUEST["farea"]);
?>
			<TABLE class="empty" border="0" width="100%" cellpadding="0" cellspacing="0">
			<TR><TD colspan=2><span class=small><a href="faq.php?<?=$id?>" class="small">main</a>	&nbsp;/&nbsp;
			<a href="faq.php?farea=<?=$_REQUEST["farea"]?>&id=<?=$id?>" class="small"><?=strtolower($catname);?></a>
			</span></TD></TR>
			</TABLE>
<?
		}
		$breadcrumb = ob_get_contents();
	ob_end_clean(); 
	if (!$_REQUEST["farea"]){$faqs = $cats;}
	if ($_REQUEST["srch"]){
		$faqs = FAQSearch($_REQUEST["srch"]);
	}
	$tpl = join("", file("src/defaultfaq.htm"));
	$vars = array(
		"sitename" => $sitename,
		"siteurl" => $siteurl,
	);
	while ($a = each($vars)){
		$breadcrumb = str_replace("[[{$a[0]}]]", $a[1], $breadcrumb);
	}
	reset($vars);
	while ($a = each($vars)){
		$cats = str_replace("[[{$a[0]}]]", $a[1], $cats);
	}
	reset($vars);
	while ($a = each($vars)){
		$faqs = str_replace("[[{$a[0]}]]", $a[1], $faqs);
	}
	reset($vars);
	$vars2 = array(
		"sitename" => $sitename,
		"siteurl" => $siteurl,
		"id" => $id,
		"breadcrumb" => $breadcrumb,
		"faqs" => $faqs,
		"cats" => $cats,
	);
	while ($a = each($vars2)){
		$tpl = str_replace("[[{$a[0]}]]", $a[1], $tpl);
	}
	echo $tpl;
?>