<?php

include('zetapay/core/adodb/adodb.inc.php');
$zetadb = NewADOConnection('mysql');
//$zetadb->Connect('localhost', 'zetaman', '5d7u1b2ai', 'zetapay'); 
$zetadb->Connect('localhost', 'root', '', 'zetapay'); 

require_once('zetapay/core/include/qpay_base.php');
$base = new qpay_base();

$link_id = $base->input['link'];
$merchant_id = $base->input['merchant_id'];

// Or simply use a Superglobal ($_SERVER or $_ENV)
$rs = $zetadb->Execute("SELECT secret FROM merchant_link where url_id=$link_id and merchant_id=$merchant_id");
$a = $rs->FetchRow();

echo "secret=$a[0]";
?>