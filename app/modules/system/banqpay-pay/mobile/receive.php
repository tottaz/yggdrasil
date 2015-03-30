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

		// mcommerce..
		$receive = new HAW_deck( "View Transactions", HAW_ALIGN_CENTER);

        // The HAWHAW default device simulator is used
        // user-defined skins can be used too! (see FAQ and Reference for more info ...)
        $receive->use_simulator();
		$receive->disable_cache();
		$receive->set_bgcolor( "#FFFFFF");
       
		$ulist_page = 10;
		if(!$startp){$startp = 0;}
		$qr2 = $zetadb->Execute("SELECT paidto,paidby,amount,".TBL_USER_TRANSACTIONS.".comment AS comment,trdate,id,fees FROM ".TBL_USER_TRANSACTIONS." WHERE (paidto=$user OR paidby=$user) AND pending=0 ORDER BY trdate DESC");
		$numrows = $qr2->RecordCount();
		#	$ulist_page = $numrows / 2;
		$r = $zetadb->Execute("SELECT paidto,paidby,amount,".TBL_USER_TRANSACTIONS.".comment AS comment,trdate,id,fees FROM ".TBL_USER_TRANSACTIONS." WHERE (paidto=$user OR paidby=$user) AND pending=0 ORDER BY trdate DESC LIMIT $startp,$ulist_page");
		$i = 1;
		$current = balance($user, 1);
		$namount = 0;
		while ($a = $r->FetchNextObject()) {
			if ($a->PAIDTO != $user){
				$a->AMOUNT = -$a->AMOUNT;
				$tofrom = "Buy";
				}else{
				$tofrom = "Sell";
				}
				if($a->AMOUNT > 0){
					$a->AMOUNT = $a->AMOUNT + $a->FEES;
				}else{
					$a->AMOUNT = $a->AMOUNT - $a->FEES;
				}

                $dummy = new HAW_text(" ");
                $receive->add_text($dummy);
                
                $text1 = new HAW_text("Transaction:" .$tofrom); 
                $text2 = new HAW_text("User:" .dp($a->PAIDTO == $user ? $a->PAIDBY : $a->PAIDTO)); 
                $text3 = new HAW_text("Amount: " .dpsumm($a->AMOUNT,1)); 
                $text4 = new HAW_text("Date: " .dpdate($a->TRDATE)); 
                $receive->add_text($text1);
                $receive->add_text($text2);							
                $receive->add_text($text3);
                $receive->add_text($text4);							

                $dummy = new HAW_text(" ");
                $receive->add_text($dummy);
                
            }
                
		    $backview = new HAW_link("Main Menu", "mobile.php?s=Menu","Start");
		    $receive->add_link($backview);
        
		    $receive->create_page();

?>