<?php

require_once("api.php");
require_once("config.php");

$res = mysql_connect($db_host.":".$db_port, $db_user, $db_pass);
mysql_select_db($db_name, $res);

$sh = new SpreadSheet($res, "1", $db_prefix);



$r = $sh->getCell("B2")->getStyle();
echo "<pre>";
print_r($r);
echo "</pre>";


echo "<br>";
/*
$r = $sh->setValue("B1", 1);
$r = $sh->setValue("B2", "=B1+1");
$r = $sh->setValue("B3", "=B2+1");
$r = $sh->setValue("B4", "=B3+1");
$r = $sh->setValue("B5", "=B4+1");

echo $sh->getValue("B1").": ".$sh->getCalculatedValue("B1")."<br>";
echo $sh->getValue("B2").": ".$sh->getCalculatedValue("B2")."<br>";
echo $sh->getValue("B3").": ".$sh->getCalculatedValue("B3")."<br>";
echo $sh->getValue("B4").": ".$sh->getCalculatedValue("B4")."<br>";
echo $sh->getValue("B5").": ".$sh->getCalculatedValue("B5")."<br>";
*/

?>