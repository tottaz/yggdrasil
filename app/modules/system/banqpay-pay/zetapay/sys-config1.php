<?
//	$config = mysql_query("SELECT * FROM zetapay_config");
	$config = $zetadb->Execute("select * from ".TBL_SYSTEM_CONFIG."");
	while($crow = $config->FetchNextObject()) {
//	while($crow = mysql_fetch_object($config)){
		$akey = $crow->NAME;
		$$akey = $crow->VALUE;
	}
?>