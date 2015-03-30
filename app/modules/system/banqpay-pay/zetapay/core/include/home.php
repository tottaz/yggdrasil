<?
    $cnt1=&$zetadb->Execute("SELECT COUNT(*) FROM ".TBL_SYSTEM_VISITORS." WHERE email IS NULL");
    $cnt2=&$zetadb->Execute("SELECT COUNT(a.email) FROM ".TBL_SYSTEM_VISITORS." a, ".TBL_SYSTEM_USERS." b WHERE b.email=a.email");

	srand((double)microtime()*1000000);

	$tpl = join("", file($rootDir.$subDir."core/include/default.htm"));
	$vars = array(
	  "sitename" => $sitename,
	  "siteurl" => $siteurl,
	  "id" => $id,
	  "login_box" => $login_box,
	  "visitor" => $cnt1->fields[0],
	  "whoonline" => $cnt2->fields[0],
	  "random_quote" => $quote,
	);
	while ($a = each($vars)){
		$tpl = str_replace("[[{$a[0]}]]", $a[1], $tpl);
	}
	echo $tpl;
?>