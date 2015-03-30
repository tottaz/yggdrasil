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
		$ReceivePage = new HAW_deck( "Request Money", HAW_ALIGN_CENTER);

        // The HAWHAW default device simulator is used
        // user-defined skins can be used too! (see FAQ and Reference for more info ...)
        $ReceivePage->use_simulator();
		$ReceivePage->disable_cache();
		$ReceivePage->set_bgcolor( "#FFFFFF");

        $fundForm = new HAW_form($_SERVER['PHP_SELF']); 
        
        $text = new HAW_text("Request Money:"); 

        //Recipient's Email
        $theemail = new HAW_input("username", "", "Recipient's Email",  "*N");
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

        $ReceivePage->add_form($fundForm);

        $link1 = new HAW_link("Main Page", "mobile.php?s=Menu", "Start");

        // for voice users some additional instructions might be helpful
        $link1->set_voice_text("Please say return to main page to continue, or wait a little bit until you are forwarded automatically.");

        // the link is ready ...
        $ReceivePage->add_link($link1);
        
        $ReceivePage->create_page();
} elseif($base->input['cmd'] == 'Submit') {

		$amount = $_POST['amount'];
		$afrom = dpObj($user);
		$from = $afrom->email;
		$_POST['username'] = str_replace("\r\n",",",$_POST['username']);
		$users = explode(",",$_POST['username']);
		while( list(,$duser) = each($users) ){
			if($_POST['memo']){
				$comments = $_POST['memo'];  
			}else{
				$comments = "Request For Money from ".$afrom->user;
			}
			echo "Sending Request to: $duser<br>";			
			// send mail to user
			$r = mysql_fetch_row(mysql_query(
				"SELECT id FROM zetapay_users WHERE (username='".addslashes($duser)."' OR email='".addslashes($duser)."')"
			));
			if (!$r){
				// unknown user
				$info = $from."@@".$amount;
				wrapmail($duser, "Request For Money From $sitename", 
					$emailtop.
					gettemplate("reqpay_unknown", "$siteurl?a=signup&semail=".$duser,$info).
					$emailbottom, 
					$defaultmail
				);
			}else{
				// known user
				$info = $from."@@".$amount;
				wrapmail($duser, "Request For Money From $sitename", 
					$emailtop.
					gettemplate("reqpay_email", "$siteurl/",$info).
					$emailbottom, 
					$defaultmail
				); 
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