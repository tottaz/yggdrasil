<?
	chdir('..');
	require('src/common.php');
	$suid = $_REQUEST['uid'];
	$CHECKSUM = $_REQUEST['CHECKSUM'];
	$HASH = $_REQUEST['HASH'];
	$PAYMENT_BATCH_NUM = $_REQUEST['PAYMENT_BATCH_NUM'];
	$PAYER_ACCOUNT = $_REQUEST['PAYER_ACCOUNT'];
	$PAYMENT_AMOUNT = $_REQUEST['PAYMENT_AMOUNT'];
	$origamount = $_REQUEST['origamount'];
	
	if($origamount){
		$amount = $origamount;	
		$fees = round($amount * $dep_eg_percent / 100, 2) + $dep_eg_fee;
		$myamt = $amount;
	}else{
		$amount = $PAYMENT_AMOUNT;
		$fees = round($amount * $dep_eg_percent / 100, 2) + $dep_eg_fee;
		$myamt = $amount-$fees;
	}
	if( ($HASH == md5("abdo".$CHECKSUM.$suid)) && ($PAYMENT_BATCH_NUM != 0) && (!empty($PAYER_ACCOUNT)) ){
		// ---------------
		// Process payment
		$r = mysql_fetch_object(mysql_query("SELECT * FROM zetapay_users WHERE suid='".addslashes($suid)."'"));
		if ($r ){
			$pending = ($egold_auto_deposit ? 0 : 1);
			$memo = "Deposit from: ".$PAYER_ACCOUNT;
			transact(15,$r->id,$myamt,$memo,'',$fees,$pending,'',addslashes($orderno));
			// Notify admin
			$message = "$r->username has just deposited {$currency}$amount via E-Gold!";
			if ($dep_notify){
				wrapmail($adminemail, "$sitename Deposit", $message, $defaultmail);
			}
		}
		// ---------------
	}
	header("Location: ../../index.php?a=account&suid=$suid");
?>