<?

	function getBuyerCatTitle($cat){
        $rs = $zetadb->Execute("SELECT * FROM zetapay_buyer_faq_cat_list WHERE id=$cat ORDER BY id");
		$rl = $rs->FetchNextObject();
		return $r1->TITLE;
	}

	function BuyerFAQSearch($srch){
		ob_start();
		$query = "SELECT COUNT(id) AS total FROM zetapay_buyer_faq_list WHERE (question REGEXP '$srch') OR (answer REGEXP '$srch')";
		$result = $zetadb->Execute($query);
		extract( $result->FetchNextObject() );
		$query = "SELECT * FROM zetapay_buyer_faq_list WHERE (question REGEXP '$srch') OR (answer REGEXP '$srch') ORDER BY cat DESC";
		$result = $zetadb->Execute($query);
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
		while ( $r1 = $result->FetchNextObject() ){
		if (!$r1->QUESTION) continue;
?>
			<a name="<?=$r1->ID?>"></a>
			<TABLE class="design" border="0" width="100%" cellpadding="0" cellspacing="0">
			<TR>
				<TH><b><?=$r1->QUESTION?></b></TH></TR>
			<TR>
				<TD colspan=2><span class=small><?=nl2br($r1->ANSWER)?></TD></TR>
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
		$qr1 = $zetadb->Execute("SELECT * FROM zetapay_buyer_faq_list WHERE cat='".$_REQUEST["farea"]."' ORDER BY cat");
		$qr2 = $zetadb->Execute("SELECT * FROM zetapay_buyer_faq_list WHERE cat='".$_REQUEST["farea"]."' ORDER BY cat");
		$num = 0;
		for ($i = $qr2->RecordCount() - 1; $i >= 0; $i--){
			if ($qr2->GetOne($i, 'question')){
				$num++;
			}
		}
		$middle = (int)($num / 3);
		$mr = 1;
		$mycnt = 0;
		$abc = 0;
		while ($r1 = $qr1->FetchNextObject()){
			if (!$r1->QUESTION) continue;
?>
	<a href="#<?=$r1->ID?>" class="BrowseLink">&raquo;&nbsp;<?=$r1->QUESTION?></a><br>
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
		$qr1 = $zetadb->Execute("SELECT * FROM zetapay_buyer_faq_list WHERE cat='".$_REQUEST["farea"]."' ORDER BY cat");
		$qr2 = $zetadb->Execute("SELECT * FROM zetapay_buyer_faq_list WHERE cat='".$_REQUEST["farea"]."' ORDER BY cat");
		$num = 0;
		for ($i = $qr2->RecordCount() - 1; $i >= 0; $i--){
			if ($qr2->GetOne($i, 'question')){
				$num++;
			}
		}
		$middle = (int)($num / 3);
		$mr = 1;
		$mycnt = 0;
		$abc = 0;
		while ($r1 = $qr1->FetchNextObject()){
			if (!$r1->QUESTION) continue;
?>
			<a name="<?=$r1->ID?>"></a>
			<TABLE class="design" border="0" width="100%" cellpadding="0" cellspacing="0">
			<TR>
				<TH><b><?=$r1->QUESTION?></b></TH></TR>
			<TR>
				<TD colspan=2><span class=small><?=nl2br($r1->ANSWER)?></TD></TR>
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
		$qr1 = $zetadb->Execute("SELECT * FROM zetapay_buyer_faq_cat_list ORDER BY id") or die( mysql_error() );
		$qr2 = $zetadb->Execute("SELECT * FROM zetapay_buyer_faq_cat_list ORDER BY id");
		$num = 0;
		for ($i = $qr2->RecordCount() - 1; $i >= 0; $i--){
			if ($qr2->GetOne($i, 'title')){
				$num++;
			}
		}
		$middle = (int)($num / 2);
		$mr = 1;
		while ($r1 = $r = $qr1->FetchNextObject()){
		if (!$r1->TITLE) continue;
            $rs = $zetadb->Execute("SELECT COUNT(*) FROM zetapay_buyer_faq_list WHERE cat=".$r1->ID);
            $cnt = $rs->FetchNextObject();
?>
			<a href="faq.php?farea=<?=$r1->ID?>" class="BrowseLink">&raquo;&nbsp;<?=$r1->TITLE?></a><br>
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
			$catname = getBuyerCatTitle($_REQUEST["farea"]);
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
		$faqs = BuyerFAQSearch($_REQUEST["srch"]);
	}
	$tpl = join("", file("buyer/a_default_buyer_faq.php"));
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