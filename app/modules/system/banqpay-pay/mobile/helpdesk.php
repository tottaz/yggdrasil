<?php

// HAWHAW example how to initiate phone calls
// Norbert Huffschmid
// 26.9.2004

include("../zetapay/core/mobile/hawhaw.inc");  // Could need some checking if this exists..	

$PhonePage = new HAW_deck("Help Desk");
$PhonePage->use_simulator();

$text1 = new HAW_text("If you have WAP or i-Mode phone, click the link to dial our helpdesk.");
$text1->set_br(2);
$PhonePage->add_text($text1);

$phone = new HAW_phone("+1 416 727 6154", "CALL");
$PhonePage->add_phone($phone);

// in case that the device does not support redirection:
// ... we define a link additionally
$link1 = new HAW_link("Main Menu", "mobile.php?s=Menu","Start");

// for voice users some additional instructions might be helpful
$link1->set_voice_text("Please say continue to continue, or wait a little bit until you are forwarded automatically.");

// the link is ready ...
$PhonePage->add_link($link1);

$PhonePage->create_page();
?>