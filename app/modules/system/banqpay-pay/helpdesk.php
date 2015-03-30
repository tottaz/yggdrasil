<?php

// HAWHAW example how to initiate phone calls
// Norbert Huffschmid
// 26.9.2004

include("zetapay/core/mobile/hawhaw.inc");  // Could need some checking if this exists..	

$PhonePage = new HAW_deck("Example 9");
$PhonePage->use_simulator();

$text1 = new HAW_text("If you browse this deck on a WAP or i-Mode phone, establishing a call is easy as following a link.");
$text1->set_br(2);
$PhonePage->add_text($text1);

$phone = new HAW_phone("+1 416 727 6154", "CALL");
$PhonePage->add_phone($phone);

$PhonePage->create_page();

?>
