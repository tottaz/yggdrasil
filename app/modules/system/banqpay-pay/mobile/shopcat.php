<?php

/************************************************************************/
/************************************************************************/


session_start();  
include('../zetapay/core/include/mobile_common.php');   
require_once('../zetapay/core/include/qpay_base.php');
$base = new qpay_base();

$user = $_SESSION['user'];
$email = $_SESSION['email'];

if($user == '' || $email == '') {
 
        $_SESSION['user'] = $base->input['user'];   
        $user = $_SESSION['user'];
        $_SESSION['email'] = $base->input['email'];   
        $email = $_SESSION['email'];
}


include("../zetapay/core/mobile/hawhaw.inc");  // Could need some checking if this exists..	

		// mcommerce..
		$mcommercesp = new HAW_deck( "Shop", HAW_ALIGN_CENTER);
        // The HAWHAW default device simulator is used
        // user-defined skins can be used too! (see FAQ and Reference for more info ...)
        $mcommercesp->use_simulator();
		$mcommercesp->disable_cache();
		$mcommercesp->set_bgcolor( "#FFFFFF");

		$title = new HAW_text("Shop our Store", HAW_TEXTFORMAT_UNDERLINE);
		$title->set_br(2);
		$mcommercesp->add_text($title);

		$mcommercelink = new HAW_link("1. Catalog", "shopcat.php");
		$mcommercesp->add_link($mcommercelink);

		$dummy = new HAW_text(" ");
		$mcommercesp->add_text($dummy);
		$back2mn = new HAW_link("Back to Main Menu.", "$SCRIPT_NAME");
		$mcommercesp->add_link($back2mn);
        
		$mcommercesp->create_page();
?>

