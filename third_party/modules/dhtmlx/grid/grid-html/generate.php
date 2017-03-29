<?php

require_once 'gridHTMLGenerator.php';

$debug = false;

$xmlString = $_POST['grid_xml'];
if (get_magic_quotes_gpc()) $xmlString = stripslashes($xmlString);

$xmlString = urldecode($xmlString);
if ($debug == true)
	error_log($xmlString, 3, 'debug_'.date("Y_m_d__H_i_s").'.xml');

$xml = simplexml_load_string($xmlString);
$pdf = new gridHTMLGenerator();
$pdf->printGrid($xml);

?>