<?php

// HAWHAW example how to include images
// Norbert Huffschmid
// 19.5.2003

require("../hawhaw.inc");

$ImagePage = new HAW_deck("Example 6");
$ImagePage->use_simulator();

$title = new HAW_text("Images", HAW_TEXTFORMAT_BOLD | HAW_TEXTFORMAT_UNDERLINE);
$ImagePage->add_text($title);

$main_image = new HAW_image("hawhaw.wbmp", "hawhaw.gif", "HAWHAW", "hawhaw.bmp");
$main_image->set_br(1); // create 1 line break
$ImagePage->add_image($main_image);

$header1  = new HAW_text("These are images combined with pure text:");
$ImagePage->add_text($header1);

$image1 = new HAW_image("o_smiley.wbmp", "o_smiley.gif", ":-)", "o_smiley.bmp");
$ImagePage->add_image($image1);
$text1  = new HAW_text("Saturday");
$ImagePage->add_text($text1);

$image2 = new HAW_image("o_hmm.wbmp", "o_hmm.gif", ":-|", "o_hmm.bmp");
$ImagePage->add_image($image2);
$text2  = new HAW_text("Sunday");
$ImagePage->add_text($text2);

$image3 = new HAW_image("o_angry.wbmp", "o_angry.gif", ":-(", "o_angry.bmp");
$ImagePage->add_image($image3);
$text3  = new HAW_text("Monday");
$text3->set_br(2); // create 2 line breaks
$ImagePage->add_text($text3);

$header2  = new HAW_text("But they work with links too:");
$ImagePage->add_text($header2);

$link1 = new HAW_link("Example 1","e1.wml");
$ImagePage->add_image($image1);
$ImagePage->add_link($link1);

$ImagePage->set_voice_jingle("jingle.wav"); // link indication for voice users

$ImagePage->create_page();

?>
