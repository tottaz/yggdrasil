<?php

//
// Fund account session
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
    
        $FundPage = new HAW_deck("Fund Account");
        $FundPage->use_simulator();

        $fundForm = new HAW_form($_SERVER['PHP_SELF']); 

        $text = new HAW_text("Enter Card Information:"); 
        
        //Selecting Funding Source        
        //Select Card Type
        $CardTypeSelect = new HAW_select("type", HAW_SELECT_POPUP);
        $rs = $zetadb->Execute("SELECT * FROM ".TBL_USER_CARD_TYPE." WHERE active='Y'");
        while($a = $rs->FetchNextObject()) {
                $CardTypeSelect->add_option("$a->CARD_TYPE", "$a->SHORT_NAME");
        }

        //Seelct Card Number
        $theNU = new HAW_input("number", "", "Number",  "*N");
        $theNU->set_size(12);
        $theNU->set_maxlength(20);
   		$theNU->set_br(2);
                
        //Select Expiration Date

        $MonthSelect = new HAW_select("month", HAW_SELECT_POPUP);
        $rs = $zetadb->Execute("SELECT * FROM ".TBL_CARD_EXPIRE_MONTH."");
        while($a = $rs->FetchNextObject()) {
            $MonthSelect->add_option("$a->MONTH", "$a->SHORT_NAME");
        }

        //Select Expiration Date
        $YearSelect = new HAW_select("year", HAW_SELECT_POPUP);
        $rs = $zetadb->Execute("SELECT * FROM ".TBL_CARD_EXPIRE_YEAR."");
        while($a = $rs->FetchNextObject()) {
            $YearSelect->add_option("$a->YEAR", "$a->SHORT_NAME");
        }
                //Card Verification Number
        $theCVV = new HAW_input("cvv2", "", "CVV2",  "*N");
        $theCVV->set_size(3);
        $theCVV->set_maxlength(3);
        
        //Select Amount
        $theAM = new HAW_input("amount", "", "Amount",  "*N");
        $theAM->set_size(12);
        $theAM->set_maxlength(20);
      
        //Name on your card
        $theNA = new HAW_input("name", "", "Name",  "*N");
        $theNA->set_size(12);
        $theNA->set_maxlength(100);
        
        //Billing Address
        //Address Line 1
        $theAD1 = new HAW_input("addr1", "", "addr1",  "*N");
        $theAD1->set_size(16);
        $theAD1->set_maxlength(100);
        
        //Address Line 2
        $theAD2 = new HAW_input("addr2", "", "addr2",  "*N");
        $theAD2->set_size(16);
        $theAD2->set_maxlength(100);
        
        //City
        $theCI = new HAW_input("city", "", "city",  "*N");
        $theCI->set_size(20);
        $theCI->set_maxlength(100);
        
        //State/Province
        $thePR = new HAW_input("state", "", "Province",  "*N");
        $thePR->set_size(20);
        $thePR->set_maxlength(100);
        
        //Postal/Zip
        $thePO = new HAW_input("zip", "", "Postal",  "*N");
        $thePO->set_size(8);
        $thePO->set_maxlength(10);
        
        //Phone Number
        $thePH = new HAW_input("phone", "", "Phone",  "*N");
        $thePH->set_size(10);
        $thePH->set_maxlength(14);
        
        //Country
        $theCO = new HAW_input("country", "", "Country",  "*N");
        $theCO->set_size(20);
        $theCO->set_maxlength(60);

        $CountrySelect = new HAW_select("country", HAW_SELECT_POPUP);
        
        $rs = $zetadb->Execute("SELECT * FROM ".TBL_SYSTEM_COUNTRIES."");
        while($a = $rs->FetchNextObject()) {
            $CountrySelect->add_option("$a->COUNTRIES_NAME", "$a->COUNTRIES_NAME");
        }

        $theSubmission = new HAW_submit("Submit", "cmd");

        $fundForm->add_text($text);
        $fundForm->add_input($CardTypeSelect);
        $fundForm->add_input($theNU);
        $fundForm->add_input($MonthSelect);
        $fundForm->add_input($YearSelect);
        $fundForm->add_input($theCVV);
        $fundForm->add_input($theAM);
        $fundForm->add_input($theNA);
        $fundForm->add_input($theAD1);
        $fundForm->add_input($theAD2);
        $fundForm->add_input($theCI);
        $fundForm->add_input($thePR);
        $fundForm->add_input($thePO);
        $fundForm->add_input($thePH);
        $fundForm->add_input($CountrySelect);
        
        $fundForm->add_submit($theSubmission);

        $FundPage->add_form($fundForm);

        $FundPage->create_page();


} elseif($base->input['cmd'] == 'Submit') {

    require('../zetapay/core/payment/firepay.php');
    /*
    *
    * Posting the transaction to FirePay
    *
    */
    // DEBUG MODE
    //$result=post_firepay($_POST['firepay'],true);
    // PRODUCTION MODE

    $cardType = cardType($base->input['type']);

	$firepay = array('custName1' => $base->input['name'],
							'cardNumber' => $base->input['number'],
							'cardType' => $cardType,
							'cardExp' => $base->input['month'] ."/". $base->input['year'],
                            'cvdIndicator' => '1',
                            'cvdValue' => $base->input['cvv2'],
							'amount' => $base->input['amount']*100,
							'merchantTxn' => $merchant_id . '-' .$link_id . '-' . date('Ymdhis'),
							'streetAddr' => $base->input['addr1'] . $base->input['addr2'],
							'city' => $base->input['city'],
							'zip' => $base->input['zip'],
							'province' => $base->input['state'],
							'country' => $base->input['country'],
							'phone' => $base->input['phone'],
							'email' => $email);
   
    $result=post_firepay($firepay,false); //debug
    
    unset($base->input['cmd']);
    unset($cmd);
    
    if($result['status']=='SP') {
      $amount = $base->input['amount'];
//      $fees = myround($amount * $dep_np_percent / 100, 2) + $dep_np_fee;
//
//  Add deposit amount to 
//
      transact(18,$user,($amount),'Purchase','',0,0,'',addslashes($result['authCode']));
	  // Notify admin
	  $message = "$user has just deposited {$currency} $amount via credit card!";
	  
      if ($dep_notify){
		    wrapmail($adminemail, "$sitename Deposit", $message, $defaultmail);
	  }
      $SuccessPage = new HAW_deck("Success");
      $SuccessPage->use_simulator();

      $text1 = new HAW_text("Your transaction was sucesfully processed.");
      $text1->set_br(2);

      $SuccessPage->add_text($text1);

      // after 10 seconds we want to start with pass 2
      $SuccessPage->set_redirection(10, $_SERVER['PHP_SELF'] . "mobile.php?s=");

      // in case that the device does not support redirection:
      // ... we define a link additionally
      $link1 = new HAW_link("Back to Main Menu", $_SERVER['PHP_SELF'] . "mobile.php?s=", "Start");
      
      // for voice users some additional instructions might be helpful
      $link1->set_voice_text("Please say continue to continue, or wait a little bit until you are forwarded automatically.");

      // the link is ready ...
      $SuccessPage->add_link($link1);

      $SuccessPage->create_page();
    
    //
    //  if errors
    //
    } elseif($result['status']=='E'){

        $ErrorPage = new HAW_deck("Error");
        $ErrorPage->use_simulator();

        $text1 = new HAW_text("Error Processing your credit card $result[errString] transaction.");
        $text1->set_br(2);

        $ErrorPage->add_text($text1);

        // after 10 seconds we want to start with pass 2
        $ErrorPage->set_redirection(10, $_SERVER['PHP_SELF'] . "?cmd=");

        // in case that the device does not support redirection:
        // ... we define a link additionally
        $link1 = new HAW_link("Continue", $_SERVER['PHP_SELF'] . "?cmd=", "Start");

        // for voice users some additional instructions might be helpful
        $link1->set_voice_text("Please say continue to continue, or wait a little bit until you are forwarded automatically.");

                // in case that the device does not support redirection:
        // ... we define a link additionally
        $link2 = new HAW_link("Return Main Page", $_SERVER['PHP_SELF'] . "mobile.php?s=Submit", "Start");

        // for voice users some additional instructions might be helpful
        $link2->set_voice_text("Please say return to main page to continue, or wait a little bit until you are forwarded automatically.");

        // the link is ready ...
        $ErrorPage->add_link($link1);
        $ErrorPage->add_link($link2);

        $ErrorPage->create_page();

    } else {
        $ErrorPage = new HAW_deck("Error");
        $ErrorPage->use_simulator();

        $text1 = new HAW_text("Error Processing your credit card $result transaction.");
        $text1->set_br(2);

        $ErrorPage->add_text($text1);

        // in case that the device does not support redirection:
        // ... we define a link additionally
        $link1 = new HAW_link("Continue", $_SERVER['PHP_SELF'] . "?cmd=", "Start");

        // for voice users some additional instructions might be helpful
        $link1->set_voice_text("Please say continue to continue, or wait a little bit until you are forwarded automatically.");

                // in case that the device does not support redirection:
        // ... we define a link additionally
        $link2 = new HAW_link("Return Main Page", $_SERVER['PHP_SELF'] . "mobile.php?s=Submit", "Start");

        // for voice users some additional instructions might be helpful
        $link2->set_voice_text("Please say return to main page to continue, or wait a little bit until you are forwarded automatically.");

        // the link is ready ...
        $ErrorPage->add_link($link1);
        $ErrorPage->add_link($link2);

        $ErrorPage->create_page();
    }
}
?>