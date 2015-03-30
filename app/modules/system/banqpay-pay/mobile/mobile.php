<?php

/************************************************************************/
/************************************************************************/

session_start();
$suid = $_SESSION['suid'];

include('../zetapay/core/include/mobile_common.php');   
require_once('../zetapay/core/include/qpay_base.php');
$base = new qpay_base();

($userip = $_SERVER['HTTP_X_FORWARDED_FOR']) or ($userip = $_SERVER['REMOTE_ADDR']);

$user = $_SESSION['user'];
$email = $_SESSION['email'];
$usertype = $_SESSION['usertype'];

// first we have to import the HAWHAW class library
include("../zetapay/core/mobile/hawhaw.inc");  // Could need some checking if this exists..	

    if ($base->input['s'] == '' && $suid=='') {
		$mainp = new HAW_deck( "Main", HAW_ALIGN_CENTER);
        
        // The HAWHAW default device simulator is used
        // user-defined skins can be used too! (see FAQ and Reference for more info ...)
        $mainp->use_simulator();

		$mainp->disable_cache();
		$mainp->set_bgcolor( "#FFFFFF");
		
		$title = new HAW_text("BanQpay", HAW_TEXTFORMAT_UNDERLINE);
		$title->set_br(2);
		$mainp->add_text($title);

        $newslink = new HAW_link("1. Login", $_SERVER['PHP_SELF'] . "?s=login", "Start");
		$mainp->add_link($newslink);
        $storelink = new HAW_link("2. Browse Stores", $_SERVER['PHP_SELF'] . "?s=shop", "Start");
		$mainp->add_link($storelink);
		
		// New screen links here
		$dummy = new HAW_text(" ");
		$dummy->set_br(1);
		$mainp->add_text($dummy);
        $aboutlink = new HAW_link("About BanQpay", $_SERVER['PHP_SELF'] . "?s=about", "Start");
		$mainp->add_link($aboutlink);

		$mainp->create_page();

    } elseif ($base->input['s'] == 'login') {         

        // Get Userid and Password

        $AuthPage = new HAW_deck("Authenticate", HAW_ALIGN_CENTER);
        $AuthPage->use_simulator();

        $myForm = new HAW_form($_SERVER['PHP_SELF']); 

        $text = new HAW_text("Login:"); 
        $theID = new HAW_input("email", "", "Email",  "*N");
        $theID->set_size(8);
        $theID->set_maxlength(140);

        $thePW = new HAW_input("password", "", "Password", "*N");
        $thePW->set_size(8);
        $thePW->set_maxlength(50);
        $thePW->set_type(HAW_INPUT_PASSWORD);

        $theSubmission = new HAW_submit("Submit", "s");

        $myForm->add_text($text);
        $myForm->add_input($theID);
        $myForm->add_input($thePW);
        $myForm->add_submit($theSubmission);

        $AuthPage->add_form($myForm);

        $AuthPage->create_page();

    } elseif ($base->input['s'] == 'Submit') {         

        $WelcomePage = new HAW_deck("Submit", HAW_ALIGN_CENTER);
        $WelcomePage->use_simulator();

        $encryptedpassword=md5($base->input['password']);
        $rs = $zetadb->Execute("SELECT * FROM system_users WHERE (email='".addslashes($base->input['email'])."') AND password='".addslashes($encryptedpassword)."'");
		$data = $rs->FetchNextObject();
		if ($data) {
			$suid = substr( md5($userip.time()), 8, 16 );
			$zetadb->Execute("UPDATE ".TBL_SYSTEM_USERS." SET suid='$suid',signed_on=NOW(),lastip='$userip' WHERE id=$data->ID and active='Y'");

			$zetadb->Execute("UPDATE system_users SET signed_on=NOW(),lastip='$userip' WHERE id=$data->ID");
			if($use_iplogging){
			    $zetadb->Execute("INSERT INTO system_logins SET user='$data->ID',date=NOW(),ipaddress='$userip', username='$data->EMAIL'");
		    }

       	    $user = $data->ID;
	        $email = $data->EMAIL;
	        $usertype = $data->TYPE;

            $_SESSION['user'] = $user;   
            $_SESSION['email'] = $email;   
            $_SESSION['usertype'] = $usertype;   
            
            $balance = balance($user, 1);
            
            $text1 = new HAW_text("Your have succesfully logged in"); 
            $text2 = new HAW_text("Your Balance is: " .dpsumm($balance)); 
                        
            $WelcomePage->add_text($text1);
            $WelcomePage->add_text($text2);
            
            // in case that the device does not support redirection:
            // ... we define a link additionally
            $link1 = new HAW_link("Continue", "mobile.php?s=Menu","Menu");

            // for voice users some additional instructions might be helpful
            $link1->set_voice_text("Please say continue to continue, or wait a little bit until you are forwarded automatically.");

            // the link is ready ...
            $WelcomePage->add_link($link1);
            
            
        } else { 
            $text1 = new HAW_text("You could not login", HAW_TEXTFORMAT_BIG); 
            $text2 = new HAW_text("Your userid or password is incorrect!", HAW_TEXTFORMAT_SMALL); 

            $WelcomePage->add_text($text1);
            $WelcomePage->add_text($text2);
            
//            $WelcomePage = new HAW_link("1. Login", $_SERVER['PHP_SELF'] . "?s=login", "Start");

        }
        $WelcomePage->create_page();
		exit;

    } elseif ($base->input['s'] == 'Menu') {         

        $MenuPage = new HAW_deck("Main Menu", HAW_ALIGN_CENTER);
        $MenuPage->use_simulator();
        
   		$title = new HAW_text("Main Menu", HAW_TEXTFORMAT_UNDERLINE);
		$title->set_br(1);
		$MenuPage->add_text($title);

            if($usertype == 'merchant') {
                // Here we define all those links to our samples:
                $link1 = new HAW_link("Withdraw Funds","withdraw.php?user=$user&email=$email","Fund");
                $link2 = new HAW_link("View Transaction","view.php?user=$user&email=$email","View");
                $link3 = new HAW_link("VPOS","vpos.php?user=$user&email=$email","VPOS");
                $link4 = new HAW_link("Send Money","send.php?user=$user&email=$email","Send");
                $link5 = new HAW_link("Request Money","request.php?user=$user&email=$email","Request");
                $link6 = new HAW_link("Help Desk","helpdesk.php","Call");
                $link7 = new HAW_link("Logout","logout.php?suid=$suid","Logout");
                // ... and we group them together for easier navigation
                $linkset = new HAW_linkset();
                $linkset->add_link($link1);
                $linkset->add_link($link2);
                $linkset->add_link($link3);
                $linkset->add_link($link4);
                $linkset->add_link($link5);
                $linkset->add_link($link6);
                $linkset->add_link($link7);
                
            } elseif($usertype == 'buyer') { 
                // Here we define all those links to our samples:
                $link1 = new HAW_link("Fund Account","vpos.php?user=$user&email=$email","Fund");
                $link2 = new HAW_link("View Transaction","view.php?user=$user&email=$email","View");
                $link3 = new HAW_link("Send Money","send.php","Send");
                $link5 = new HAW_link("Request Money","request.php","Request");
                $link5 = new HAW_link("Help Desk","helpdesk.php","Call");
                $link6 = new HAW_link("Logout","logout.php","Logout");
                // ... and we group them together for easier navigation
                $linkset = new HAW_linkset();
                $linkset->add_link($link1);
                $linkset->add_link($link2);
                $linkset->add_link($link3);
                $linkset->add_link($link4);
                $linkset->add_link($link5);
                $linkset->add_link($link6);
               
            } else { 
                // Here we define all those links to our samples:
                $link1 = new HAW_link("Restart Server","restart.php","Restart");
                $link2 = new HAW_link("Check user","user.php","User");
                $link3 = new HAW_link("Send Money","send.php","Send");
                $link4 = new HAW_link("Logout","logout.php","Logout");
                // ... and we group them together for easier navigation
                $linkset = new HAW_linkset();
                $linkset->add_link($link1);
                $linkset->add_link($link2);
                $linkset->add_link($link3);
                $linkset->add_link($link4);
            }                
            
            // make it more comfortable for voice users
            $linkset->set_voice_text("You can select an example by pressing the according dial button on your phone.");
            
            $MenuPage->add_linkset($linkset);
            $MenuPage->create_page();

    } elseif ($base->input['s'] == 'shop') {         

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
		$back2mn = new HAW_link("Main Page", "mobile.php?s=Menu", "Start");
		$mcommercesp->add_link($back2mn);

		$mcommercesp->create_page();
		exit;

    } elseif ($base->input['s'] == 'search') {         
		// Search
		$searchp = new HAW_deck( "Search", HAW_ALIGN_CENTER);
        // The HAWHAW default device simulator is used
        // user-defined skins can be used too! (see FAQ and Reference for more info ...)
        $searchp->use_simulator();

		$searchp->disable_cache();
		$searchp->set_bgcolor( "#FFFFFF");
        
		$title = new HAW_text("Search Database", HAW_TEXTFORMAT_UNDERLINE);
		$title->set_br(2);
		$searchp->add_text($title);
			
        $searchform = new HAW_form("$SCRIPT_NAME");
		$pwtext = new HAW_text("Enter Company Name.", HAW_TEXTFORMAT_SMALL);
		$pwtext->set_br(2);
		$searchform->add_text($pwtext);
		$pwinput = new HAW_input("pw", "", "Company Name");
		$pwinput->set_size(20);
		$pwinput->set_maxlength(40);
		$pwinput->set_type(HAW_INPUT_TEXT);
		$searchform->add_input($pwinput);
		$searchsubmit = new HAW_submit("Name");
		$searchform->add_submit($searchsubmit);
		$hidden = new HAW_hidden("s", "main");
		$searchform->add_hidden($hidden);

		$searchp->add_form($searchform);

      $dummy = new HAW_text(" ");
		$searchp->add_text($dummy);
		$back2mn = new HAW_link("Main Page", "mobile.php?s=Menu", "Start");
		$searchp->add_link($back2mn);

		$searchp->create_page();
		exit;

    } elseif ($base->input['s'] == 'about') {         
	
		// Display the about screen
		$aboutp = new HAW_deck( "About ePaymentsnews", HAW_ALIGN_CENTER);
        // The HAWHAW default device simulator is used
        // user-defined skins can be used too! (see FAQ and Reference for more info ...)
        $aboutp->use_simulator();
        
		$aboutp->disable_cache();
		$aboutp->set_bgcolor( "#FFFFFF");

		$title = new HAW_text("About us", HAW_TEXTFORMAT_UNDERLINE);
		$title->set_br(2);
		$aboutp->add_text($title);

		$wrby = new HAW_text("BanqPay is a new online payment service, that allows visitors to pay for services on auctions, classified sites, and personal web sites.");
		$wrby->set_br(2);		
		$aboutp->add_text($wrby);
  		$dummy = new HAW_text(" ");
		$dummy->set_br(2);
		$aboutp->add_text($dummy);
		$llink = new HAW_link("Main Page", "mobile.php?s=Menu", "Start");
		$aboutp->add_link($llink);
		
		$aboutp->create_page();
		exit;

	} else {

		// ERROR!
		$ep = new HAW_deck("Error", HAW_ALIGN_CENTER);
        // The HAWHAW default device simulator is used
        // user-defined skins can be used too! (see FAQ and Reference for more info ...)
        $ep->use_simulator();
		$ep->set_bgcolor( "#FFFFFF");

		$title = new HAW_text("ERROR!", HAW_TEXTFORMAT_BOLD | HAW_TEXTFORMAT_BIG);
		$title->set_br(2);
		$ep->add_text($title);
		$txt1 = new HAW_text("There has been an error in processing your request.");
		$ep->add_text($txt1);
		$txt2 = new HAW_text("Either use your BACK button once or you can go");
		$ep->add_text($txt2);
		$lnk1 = new HAW_link("Main Page", "mobile.php?s=Menu", "Start");
		$ep->add_link($lnk1);

		$ep->create_page();
		exit;
	}
?>