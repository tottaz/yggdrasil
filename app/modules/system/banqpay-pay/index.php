<?
include('config.php');
session_start();
   
	$root_dir="zetapay/";	
	require_once($rootDir.$subDir.'core/include/common.php');
    require_once($rootDir.$subDir.'core/include/qpay_base.php');
//    require_once($rootDir.$subDir.'core/include/challengeclass.php');
//    $challenge = new ChallengeGenerator();
    $base = new qpay_base();
	$atype = '';

	require($rootDir.$subDir.'core/include/session.php');

// Track visitors
{
	$zetadb->Execute("DELETE FROM ".TBL_SYSTEM_VISITORS." WHERE DATE_ADD(date_last,INTERVAL $session_mins MINUTE)<NOW()");
	if($data->EMAIL) $un = $data->EMAIL;
	if($un) {
		$zetadb->Execute("UPDATE ".TBL_SYSTEM_VISITORS." SET date_last=NOW(),email='$un' WHERE ip='$userip'");
	}
	if (false && !$zetadb->Affected_Rows()) {
        if ($base->cookie['c_user']) {
			$un = "'".addslashes($base->cookie['c_user'])."'";
		} else {
			$un = "NULL";
		}
		if($data->EMAIL)$un = $data->EMAIL;
		if ($un != "NULL") $zetadb->Execute("DELETE FROM ".TBL_SYSTEM_VISITORS." WHERE email=$un");
		$sql_i = "INSERT INTO ".TBL_SYSTEM_VISITORS." VALUES('$userip',NOW(),'$un')";
		$sql_u = "UPDATE ".TBL_SYSTEM_VISITORS." SET email=$un,date_last=NOW() WHERE ip='$userip'";
		$zetadb->Execute($sql_i);
		if($zetadb->ErrorNo()) {
			$zetadb->Execute($sql_u);
		}
	}
}
include($rootDir.$subDir.'header.php');
$filepath = $root_dir;
$filepath ="zetapay/";

if ($action) {
 // Load the files
		$filepath .= "modules";
        if ($data->TYPE == '') {
        } else {    
	        $filepath .= "/$data->TYPE";
        }
        $filepath .= "/$action.php";
		if (file_exists($filepath)) {
			include($filepath);
		}
} else {
    if ($base->input['read']) {
		if (!include('zetapay/help/'.$base->input['read'])){
			echo "Cannot find file: <i>help/".$base->input['read']."</i><br>";
		}
    } else { include($rootDir.$subDir.'core/include/home.php'); }
    
        
}

include($rootDir.$subDir.'footer.php');
?>