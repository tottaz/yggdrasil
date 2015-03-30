<?
	$config = $zetadb->Execute("SELECT * FROM ".TBL_SYSTEM_CONFIG2."");
	while($crow = $config->FetchNextObject()){
		$akey = $crow->NAME;
		$$akey = $crow->VALUE;
	}
?>