<?php
include 'config.php';
include 'ipnbase.php';

##################################
if ($mc_currency == USD) {$price = $payment_gross;}else{$price = $mc_gross;}

$SQL = "SELECT * from ADPACKAGES WHERE IMPRESSIONS='$item_name'";
$result = mysql_query( $SQL );
while( $row = mysql_fetch_array( $result ) ) {
$cost = $row["COST"];}

if ($price == $cost) {}else{echo 'hack attempt detected, killing script'; die();}
##################################
$sql = "UPDATE ADS SET STATUS ='Active', IMPRESSIONS='0' WHERE ID = '$item_number'";
$query = mysql_query($sql) or die("Cannot query the database.<br>" . mysql_error());
##################################

?>
