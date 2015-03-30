<?
	chdir('..');
	require('src/common.php');
	$proceed = 0;
	mysql_query("DELETE FROM zetapay_signups WHERE NOW()>expire");
	if($_POST['id'])$_GET['id'] = $_POST['id'];
//	echo "---[p> ".$_POST['id']."<br>";
//	echo "---[g> ".$_GET['id']."<Br>";
/*

	$aa = mysql_query("SELECT * FROM zetapay_signups");
	while( $r = mysql_fetch_object($aa) ){
		print_r($r);
		echo "<hr>";
	}
*/
	$r = mysql_fetch_object(mysql_query("SELECT * FROM zetapay_signups WHERE id='".addslashes($_GET['id'])."'"));
	if (!$r){
		ob_start();
		header("Location: ../../index.php");
		exit;
	}
//	echo "---> ".$r->user."<br>";
	$a = mysql_fetch_row(mysql_query("SELECT id,type,email FROM zetapay_users WHERE username='$r->user'"));
	if ($a){
		$user = $a[0];
		mysql_query("UPDATE zetapay_users SET email='$r->email' WHERE id=$user");
		$r->type = $a[1];
		mysql_query("DELETE FROM zetapay_signups WHERE user='$r->user'");
		if (!$allow_same_email){
			mysql_query("DELETE FROM zetapay_signups WHERE email='$r->email'");
		}
		if($use_subscription){
			mysql_query("UPDATE zetapay_recur SET receiver='$r->email' WHERE receiver='$a[2]'");
		}
		($userip = $_SERVER['HTTP_X_FORWARDED_FOR']) or ($userip = $_SERVER['REMOTE_ADDR']);
		$suid = substr( md5($userip.time()), 8, 16 );
		mysql_query("UPDATE zetapay_users SET lastlogin=NOW(),lastip='$userip',suid='$suid' WHERE id=$user");

		mysql_query("DELETE FROM zetapay_visitors WHERE ip='$userip'");
		setcookie("c_user".$r->type, "$r->user");
		$data->username = $r->user;
		ob_start();
		header("Location: ../../index.php?a=edit&suid=$suid");
		exit;
	}
?>