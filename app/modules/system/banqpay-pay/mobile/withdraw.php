<?php

//
// Fund Request
// By Torbjorn Zetterlund
//
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

if($base->input['cmd'] == '') {
		// mcommerce..
		$WithdrawPage = new HAW_deck( "Withdraw Money", HAW_ALIGN_CENTER);

        // The HAWHAW default device simulator is used
        // user-defined skins can be used too! (see FAQ and Reference for more info ...)
        $WithdrawPage->use_simulator();
		$WithdrawPage->disable_cache();
		$WithdrawPage->set_bgcolor( "#FFFFFF");

        $fundForm = new HAW_form($_SERVER['PHP_SELF']); 
        
        $text = new HAW_text("Withdraw Money"); 

        //Recipient's Email
        $theemail = new HAW_input("source", "", "Source",  "*N");
        $theemail->set_size(14);
        $theemail->set_maxlength(100);
        
        //Select Amount
        $theAM = new HAW_input("amount", "", "Amount",  "*N");
        $theAM->set_size(12);
        $theAM->set_maxlength(20);
      
        //Notes
        $theNA = new HAW_input("memo", "", "Note",  "*N");
        $theNA->set_size(14);
        $theNA->set_maxlength(200);        
        
        $theSubmission = new HAW_submit("Submit", "cmd");  
                
        $fundForm->add_text($text);
        $fundForm->add_input($theemail);
        $fundForm->add_input($theAM);
        $fundForm->add_input($theNA);
                      
        $fundForm->add_submit($theSubmission);

        $WithdrawPage->add_form($fundForm);

        $link1 = new HAW_link("Main Page", "mobile.php?s=Menu", "Start");

        // for voice users some additional instructions might be helpful
        $link1->set_voice_text("Please say return to main page to continue, or wait a little bit until you are forwarded automatically.");

        // the link is ready ...
        $WithdrawPage->add_link($link1);
        
        $WithdrawPage->create_page();
        
} elseif($base->input['cmd'] == 'Submit') {
		// PayPal processing
		if ($w_pp && $source == 'paypal'){
			$fee = $wdr_pp_fee;
			if ($amount >= $minimal_withdrawal + $fee && $balance >= $amount){
				$step = 2;
				$fields = array(
					array("x_email", "PayPal E-mail")
				);
				$title = "PayPal Recipient Information";
				if ($_POST['proceed2'])
					$step = 3;
				if ($_POST['proceed3'])
					$step = 4;
			}else{
				if ($balance < $amount)
					errform("Sorry, but you do not have sufficient funds in your account to conduct this transaction.");
				else
					errform('The minimum amount of funds you may withdraw is '.$currency.($minimal_withdrawal + $fee));
				$step = 1;
			}
		}else if ($w_eg && $source == 'egold'){
			$fee = $wdr_eg_fee;
			if ($amount >= $minimal_withdrawal + $fee && $balance >= $amount){
				$step = 2;
				$fields = array(
					array("x_account", "E-gold Account")
				);
				$title = "E-Gold Recipient Information";
				if ($_POST['proceed2'])
					$step = 3;
				if ($_POST['proceed3'])
					$step = 4;
			}else{
				if ($balance < $amount)
					errform("Sorry, but you do not have sufficient funds in your account to conduct this transaction.");
				else
					errform('The minimum amount of funds you may withdraw is '.$currency.($minimal_withdrawal + $fee));
				$step = 1;
			}
		}elseif ($source == 'wire'){
			// Wire transfer processing
			$fee = $wdr_wire_fee;
			if ($amount >= $minimal_withdrawal + $fee && $balance >= $amount){
				$step = 2;
				$fields = array(
					array("x_name", "Account Holder's Name", 30),
					array("x_bank", "Bank Name", 30),
					array("x_address", "Bank Street Address", 40),
					array("x_address2", "", 40, 1),
					array("x_city", "Bank City", 30),
					array("x_state", "Bank State/Province", 30),
					array("x_country", "Bank Country", 30),
					array("x_postcode", "Bank Zip/Postal Code", 10),
					array("x_accno", "Bank Account Number", 20),
					array("x_swift", "Bank Routing/Swift Code", 20),
					array("x_acctype", "Bank Account Type", -1),
					array("x_info", "Additional Information", -2)
				);
				$title = "Provide Bank Information";
				if ($_POST['proceed2'])
					$step = 3;
				if ($_POST['proceed3'])
					$step = 4;
			}else{
				if ($balance < $amount)
					errform("Sorry, but you do not have sufficient funds in your account to conduct this transaction.");
				else
					errform('The minimum amount of funds you may withdraw is '.$currency.($minimal_withdrawal + $fee));
				$step = 1;
			}
		}elseif ($check_use && $source == 'check'){
			// Check processing
			$fee = $wdr_check_fee;
			if ($amount >= $minimal_withdrawal + $fee && $balance >= $amount){
				$step = 2;
				$fields = array(
					array("x_cname", "Check Payable To"),
					array("x_caddress", "Address"),
					array("x_ccity", "City, State/Province, Country"),
					array("x_cpostcode", "Zip/Postal Code")
				);
				$title = "Provide check information";
				if ($_POST['proceed2'])
					$step = 3;
				if ($_POST['proceed3'])
					$step = 4;
			}else{
				if ($balance < $amount)
					errform("Sorry, but you do not have sufficient funds in your account to conduct this transaction.");
				else
					errform('The minimum amount of funds you may withdraw is '.$currency.($minimal_withdrawal + $fee));
				$step = 1;
			}
      }     
      $SuccessPage = new HAW_deck("Success");
      $SuccessPage->use_simulator();

      $text1 = new HAW_text("Request has been sent");
      $text1->set_br(2);

      $SuccessPage->add_text($text1);

      // after 10 seconds we want to start with pass 2
      $SuccessPage->set_redirection(10, "mobile.php?s=Menu");

      // in case that the device does not support redirection:
      // ... we define a link additionally
      $link1 = new HAW_link("Main Page", "mobile.php?s=Menu", "Start"); 
      
      // for voice users some additional instructions might be helpful
      $link1->set_voice_text("Please say continue to continue, or wait a little bit until you are forwarded automatically.");

      // the link is ready ...
      $SuccessPage->add_link($link1);

      $SuccessPage->create_page(); 
}
?>