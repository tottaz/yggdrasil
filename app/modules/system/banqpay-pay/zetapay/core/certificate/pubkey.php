<?php

include('zetapay/core/adodb/adodb.inc.php');
$zetadb = NewADOConnection('mysql');
$zetadb->Connect('localhost', 'zetaman', '5d7u1b2ai', $database); 

header("Content-Type: text/xml");
require_once('zetapay/core/include/qpay_base.php');
$base = new qpay_base();

$link_id = $base->input['link'];

// Or simply use a Superglobal ($_SERVER or $_ENV)
$rs = $zetadb->Execute("SELECT secret FROM merchant_link where url_id=$link_id");
//$a = $rs->FetchRow();

echo "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>\n\n";
echo "<secret>$a[0]</secret>\n";
?>