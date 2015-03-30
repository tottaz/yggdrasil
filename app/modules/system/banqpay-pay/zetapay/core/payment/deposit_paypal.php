<?
	chdir('../../');
	require('core/include/common.php');

	$custom = $_REQUEST['custom'];

	$customs = explode("|",$custom);
	$suid = $customs[0];
	$deposited = $customs[1];
	$item_name = $_REQUEST['item_name'];
	$amount = (float)$_REQUEST['payment_gross'];
	if(!$amount){
		$amount = (float)$_REQUEST['amount'];
	}
	if($deposited){
		$amount = $deposited;
		$fees = round($amount * $dep_pp_percent / 100, 2) + $dep_pp_fee;
		$myamt = $amount;
	}else{
		$fees = round($amount * $dep_pp_percent / 100, 2) + $dep_pp_fee;
		$myamt = $amount-$fees;
	}

	if ($_REQUEST['payment_status'] == "Completed" || $_REQUEST['payment_status'] == "Pending") {
		// Process payment
		$r = mysql_fetch_object(mysql_query("SELECT * FROM zetapay_users WHERE suid='".addslashes($suid)."'"));
		if ($r){
			$pending = ($paypal_auto_deposit ? 0 : 1);
			if( strstr(strtolower($item_name),"signup fee") ){
				transact(11,$r->id,$myamt,'Signup Fee Deposited into Account','',$fees,$pending);
				transact($r->id,1,$myamt,'Signup Fee Paid','',$fees,$pending);
				mysql_query("UPDATE zetapay_users SET fee=1 WHERE suid='".addslashes($suid)."'");
			}else{
				transact(11,$r->id,$myamt,'Deposit','',$fees,$pending);
			}
			// Notify admin
			$message = $r->username." has just deposited {$currency}$amount via PayPal!";
			if ($dep_notify){
				wrapmail($adminemail, "$sitename Deposit", $message, $defaultmail);
			}
			header("Location: ../../index.php?a=account&suid=$suid");
		}
	}
	header("Location: ../../index.php?a=account&suid=$suid");
?>