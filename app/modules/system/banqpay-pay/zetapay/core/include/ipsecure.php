<?

	$qry = "SELECT ip FROM ".TBL_SYSTEM_BLOCKED_IP;
	$res = $zetadb->Execute($qry);
	while($row = $res->FetchNextObject()){
		$_deny_ip[] = $row->ip;
	}

	$_ip = $_SERVER['REMOTE_ADDR'];
	$_allowed = true;

	if(!$_allowed){
		if ( !@file_exists('header.htm') ){
			include('header.php');
		}else{
			include('header.htm');
		}
		echo "<br><br><br><br><b>This IP has been blocked by admin for some purpose. Please contact admin for more details<br><br>";

		if ( !@file_exists('footer.htm') ){
			include('footer.php');
		}else{
			include('footer.htm');
		}
		die();
	}
?>