<?
	chdir('..');
	require('core/include/common.php');
	$proceed = 0;
    $zetadb->Execute("DELETE FROM zetapay_buyer_signups WHERE NOW()>expire");
	if($_POST['id'])$_GET['id'] = $_POST['id'];
    $rs = $zetadb->Execute("SELECT * FROM zetapay_buyer_signups WHERE id='".addslashes($_GET['id'])."'");
    $r = $rs->FetchNextObject();
	if (!$r){
		ob_start();
		header("Location: ../../../index.php");
		exit;
	}
//	echo "---> ".$r->user."<br>";
    $rs = $zetadb->Execute("SELECT buyer_id,type,email FROM zetapay_buyer_users WHERE email='$r->EMAIL'");
    $a = $rs->FetchNextObject();
	if ($a){
		$user = $a->BUYER_ID;
        $zetadb->Execute("UPDATE zetapay_buyer_users SET email='$r->email' WHERE buyer_id=$user");
        $zetadb->Execute("DELETE FROM zetapay_buyer_signups WHERE email='$r->EMAIL'");
		if (!$allow_same_email){
            $zetadb->Execute("DELETE FROM zetapay_buyer_signups WHERE email='$r->EMAIL'");
		}
		if($use_subscription){
            $zetadb->Execute("UPDATE zetapay_buyer_recur SET receiver='$r->EMAIL' WHERE receiver='$a->EMAIL'");
		}
		($userip = $_SERVER['HTTP_X_FORWARDED_FOR']) or ($userip = $_SERVER['REMOTE_ADDR']);
		$suid = substr( md5($userip.time()), 8, 16 );

		$zetadb->Execute("UPDATE zetapay_buyer_users SET lastlogin=NOW(),lastip='$userip',suid='$suid' WHERE buyer_id=$user");

        $zetadb->Execute("DELETE FROM zetapay_visitors WHERE ip='$userip'");

		setcookie("c_user".$r->TYPE, "$r->EMAIL");
		$buyer_data->EMAIL = $r->EMAIL;
		ob_start();
		header("Location: ../../../index.php?a=buyer_edit&suid=$suid");
		exit;
	}
?>