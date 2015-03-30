<?php

// HAWHAW demo
// Norbert Huffschmid
// 30.10.2005

// first we have to import the HAWHAW class library
include("zetapay/core/mobile/hawhaw.inc");  // Could need some checking if this exists..	

// Here we define a deck named "Demo" where all content should be centered
$DemoPage = new HAW_deck("Demo", HAW_ALIGN_CENTER);

// The HAWHAW default device simulator is used
// user-defined skins can be used too! (see FAQ and Reference for more info ...)
$DemoPage->use_simulator();

if (!isset($_REQUEST['pass']))
{
  // First pass: Let's say 'Hello'

  // We define our first line (with bold big characters)
  $text1 = new HAW_text("Welcome to HAWHAW!", HAW_TEXTFORMAT_BOLD | HAW_TEXTFORMAT_BIG);
  $DemoPage->add_text($text1);

  // We add one blank line ...
  $text2 = new HAW_text("");
  $DemoPage->add_text($text2);

  // ... and some more text ...
  $text3 = new HAW_text("Please scroll through the examples to see what HAWHAW can do for you!");
  $DemoPage->add_text($text3);

  // after 10 seconds we want to start with pass 2
  $DemoPage->set_redirection(10, $_SERVER['PHP_SELF'] . "?pass=2");

  // in case that the device does not support redirection:
  // ... we define a link additionally
  $link1 = new HAW_link("Continue", $_SERVER['PHP_SELF'] . "?pass=2", "Start");

  // for voice users some additional instructions might be helpful
  $link1->set_voice_text("Please say continue to continue, or wait a little bit until you are forwarded automatically.");

  // the link is ready ...
  $DemoPage->add_link($link1);
}
else
{
  // Intro is over (pass 2) - lets make a menu now

  // Here we define all those links to our samples:
  $link1 = new HAW_link("Example 1","e1.wml","Formats");
  $link2 = new HAW_link("Example 2","e2.wml","Input");
  $link3 = new HAW_link("Example 3","e3.wml","Radio");
  $link4 = new HAW_link("Example 4","e4.wml","Checkbox");
  $link5 = new HAW_link("Example 5","e5.wml","Select");
  $link6 = new HAW_link("Example 6","e6.wml","Images");
  $link7 = new HAW_link("Example 7","e7.wml","Tables");
  $link8 = new HAW_link("Example 8","e8.wml","HTML");
  $link9 = new HAW_link("Example 9","e9.wml","Call");

  // ... and we group them together for easier navigation
  $linkset = new HAW_linkset();
  $linkset->add_link($link1);
  $linkset->add_link($link2);
  $linkset->add_link($link3);
  $linkset->add_link($link4);
  $linkset->add_link($link5);
  $linkset->add_link($link6);
  $linkset->add_link($link7);
  $linkset->add_link($link8);
  $linkset->add_link($link9);

  // make it more comfortable for voice users
  $linkset->set_voice_text("You can select an example by pressing the according dial button on your phone.");

  $DemoPage->add_linkset($linkset);
}

// That's all! This command creates the appropriate markup language.
$DemoPage->create_page();

?>
