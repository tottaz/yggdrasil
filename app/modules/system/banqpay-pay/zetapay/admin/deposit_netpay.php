<?
chdir('..');
require('src/common.php');

$suid = $_REQUEST['EXTRA_INFO'];
$PAYMENT_BATCH_NUM = $_REQUEST['PAYMENT_BATCH_NUM'];
$PAYER_ACCOUNT = $_REQUEST['PAYER_ACCOUNT'];
$PAYER_AMOUNT = $_REQUEST['PAYMENT_AMOUNT'];
$amount = $PAYER_AMOUNT;

$fees = myround($amount * $dep_np_percent / 100, 2) + $dep_np_fee;

if(!empty($PAYER_ACCOUNT)) {
	// ---------------
	// Process payment
	$r = mysql_fetch_object(mysql_query("SELECT * FROM zetapay_users WHERE suid='".addslashes($suid)."'"));
	if ($r ){
		transact(18,$r->id,($amount-$fees),'Deposit','',$fees,1,'',addslashes($orderno));
		// Notify admin
		$message = $GLOBALS[$r->type]." $r->username has just deposited {$currency}$amount via NetPay!";
		if ($dep_notify){
			wrapmail($adminemail, "$sitename Deposit", $message, $defaultmail);
		}
	}
	// ---------------
}
header("Location: ../../index.php?a=account&suid=$suid");
?>