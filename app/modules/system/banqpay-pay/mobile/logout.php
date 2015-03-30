<?php

//
// Logout a session
// By Torbjorn Zetterlund
//
session_start();

($userip = $_SERVER['HTTP_X_FORWARDED_FOR']) or ($userip = $_SERVER['REMOTE_ADDR']);

include('../zetapay/core/include/mobile_common.php');   
require_once('../zetapay/core/include/qpay_base.php');
$base = new qpay_base();

include("../zetapay/core/mobile/hawhaw.inc");  // Could need some checking if this exists..	

$zetadb->Execute("UPDATE ".TBL_SYSTEM_USERS." SET suid='xxx".uniqid('')."' WHERE suid='$suid'");
$zetadb->Execute("DELETE FROM ".TBL_SYSTEM_VISITORS." WHERE ip='$userip'");

session_unset();
session_destroy();

$LogoutPage = new HAW_deck("Logout");
$LogoutPage->use_simulator();

$text1 = new HAW_text("You been logged out, click continue to return to main screen.");
$text1->set_br(2);

$LogoutPage->add_text($text1);

// after 10 seconds we want to start with pass 2
$LogoutPage->set_redirection(10, "mobile.php?s=");

// in case that the device does not support redirection:
// ... we define a link additionally
$link1 = new HAW_link("Main Menu", "mobile.php?s=","Start");

// for voice users some additional instructions might be helpful
$link1->set_voice_text("Please say continue to continue, or wait a little bit until you are forwarded automatically.");

// the link is ready ...
$LogoutPage->add_link($link1);

$LogoutPage->create_page();

?>