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
		$SendPage = new HAW_deck( "Send Money", HAW_ALIGN_CENTER);

        // The HAWHAW default device simulator is used
        // user-defined skins can be used too! (see FAQ and Reference for more info ...)
        $SendPage->use_simulator();
		$SendPage->disable_cache();
		$SendPage->set_bgcolor( "#FFFFFF");

        $fundForm = new HAW_form($_SERVER['PHP_SELF']); 
        
        $text = new HAW_text("Send Money to Another Account"); 

        //Recipient's Email
        $theemail = new HAW_input("username", "", "Send Money To",  "*N");
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

        $SendPage->add_form($fundForm);

        $link1 = new HAW_link("Main Page", "mobile.php?s=Menu", "Start");

        // for voice users some additional instructions might be helpful
        $link1->set_voice_text("Please say return to main page to continue, or wait a little bit until you are forwarded automatically.");

        // the link is ready ...
        $SendPage->add_link($link1);
        
        $SendPage->create_page();
        
} elseif($base->input['cmd'] == 'Submit') {

		$amount = $_POST['amount'];
		$afrom = dpObj($user);
		$from = $afrom->email;
		if($transfer_percent || $transfer_fee){
			$fee = myround($amount * $transfer_percent / 100, 2) + $transfer_fee;
			$amount = $amount - $fee;
		}
		$_POST['dusername'] = str_replace("\r\n",",",$_POST['username']);
		$users = explode(",",$_POST['dusername']);
		$uCnt = sizeof($users);
		while( list(,$duser) = each($users) ){
#			$comments = $_POST['memo'];
		   $comments = "Money Transfer To ".$duser;
           $rs = $zetadb->Execute("SELECT id, email, suspended FROM ".TBL_SYSTEM_USERS." WHERE (email='".addslashes($duser)."')");
//           $r = rs->FetchNextObject();
		   if (!$r){
				// unknown user
#				transact($user,98,$amount,"Transfer to {$duser}",'',$fee);
#				transact($user,98,$amount,"Transfer to {$duser}",'',$fee,'',$_POST['memo']);
				transact($user,98,$amount,$comments,'',$fee,0,$_POST['memo']);

				$zetadb->Execute("INSERT INTO ".TBL_TRANSACTION_HOLD." (paidby,paidto,amount) VALUES($user,'{$duser}',$amount)");
				$info = $from."@@".$amount;
				wrapmail($duser, "Money Transfer From $sitename",
					$emailtop.
					gettemplate("transfer_unknown", "$siteurl?a=signup&semail=".$duser,$info).
					$emailbottom,
					$defaultmail
				);
			}else{
				// known user
				if($r[2]){
					errform("You cannot send money to a suspended user --- $duser", 'username');
				}else{
					transact($user,$r[0],$amount,$comments,'',$fee,0,$_POST['memo']);
					$info = $from."@@".$amount;
					wrapmail($r[1], "Money Transfer From $sitename",
						$emailtop.
						gettemplate("transfer_email", "$siteurl",$info).
						$emailbottom,
						$defaultmail
					);
				}
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