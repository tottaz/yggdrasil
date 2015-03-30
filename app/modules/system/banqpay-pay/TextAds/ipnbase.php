<?php
$req = 'cmd=_notify-validate';
foreach ($_POST as $key => $value) {
$value = urlencode(stripslashes($value));
$req .= "&$key=$value";
}
$header .= "POST /cgi-bin/webscr HTTP/1.0\r\n";
$header .= "Content-Type: application/x-www-form-urlencoded\r\n";
$header .= "Content-Length: " . strlen($req) . "\r\n\r\n";
$fp = fsockopen ('www.paypal.com', 80, $errno, $errstr, 30);
#----------------------------------------------------------------------
$mc_currency = $_POST['mc_currency'];
$payment_gross = $_POST['payment_gross'];
$mc_gross = $_POST['mc_gross'];

$item_name = $_POST['item_name'];
$item_number = $_POST['item_number'];

$txn_id = $_POST['txn_id'];
$txn_type = $_POST['txn_type'];

$payer_email = $_POST['payer_email'];
$receiver_email = $_POST['receiver_email'];

$custom = $_POST['custom'];

$amount3 = $_POST['amount3'];
$period3 = $_POST['period3'];
$mc_amount3 = $_POST['mc_amount3'];

$subscr_id = $_POST['subscr_id'];
$subscr_date = $_POST['subscr_date'];
$subscr_effective = $_POST['subscr_effective'];

$recur_times = $_POST['recur_times'];
#----------------------------------------------------------------------
if (!$fp) { } else {
fputs ($fp, $header . $req);
while (!feof($fp)) {
$res = fgets ($fp, 1024);
if (strcmp ($res, "VERIFIED") == 0) {}
else if (strcmp ($res, "INVALID") == 0) {}}
fclose ($fp);}
?>
