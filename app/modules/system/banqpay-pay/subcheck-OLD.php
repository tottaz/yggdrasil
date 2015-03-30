<?php

include('zetapay/core/include/common.php');   

$cyclep["D"]="Day(s)";
$cyclep["W"]="Week(s)";
$cyclep["M"]="Month(s)";
$cyclep["Y"]="Year(s)";
$acyclep["D"]="DAY";
$acyclep["W"]="DAY";
$acyclep["M"]="MONTH";
$acyclep["Y"]="YEAR";

require_once('zetapay/core/include/qpay_base.php');
$base = new qpay_base();

($userip = $_SERVER['HTTP_X_FORWARDED_FOR']) or ($userip = $_SERVER['REMOTE_ADDR']);
$auth = "0";  

//$password='t0138z';
//$email='editor@epnn.com';

if($base->input['password'] || $base->input['email']){
        $encryptedpassword=md5($base->input['password']); //encrypt the password
//        $encryptedpassword=md5($password); //encrypt the password
        $rs = $zetadb->Execute("SELECT * FROM system_users WHERE (email='".addslashes($base->input['email'])."') AND password='".addslashes($encryptedpassword)."'");
//        $rs = $zetadb->Execute("SELECT * FROM system_users WHERE (email='".addslashes($email)."') AND password='".addslashes($encryptedpassword)."'");
		$data = $rs->FetchNextObject();
		if ($data) {
			$zetadb->Execute("UPDATE system_users SET signed_on=NOW(),lastip='$userip' WHERE id=$data->ID");
			if($use_iplogging){
			    $zetadb->Execute("INSERT INTO system_logins SET user='$data->ID',date=NOW(),ipaddress='$userip', username='$data->EMAIL'");
		    }

            $rs = $zetadb->Execute("SELECT * FROM user_subscriptions WHERE user='$data->ID' and ticks>'0' and subscription_type='rss-feeds'");
		    $a = $rs->FetchNextObject();
            
            if ($a != '') {

                $auth = "1";   //Set Authentication match, no check subscription
           
	            $dateStr = $a->CREATED;
	            $today = date( "Y-m-d", time() );
		        if($a->CYCLE_P == "W"){
			        $a->CYCLE_D = $a->CYCLE_D * 7;
			        $a->STOP = $a->STOP * 7;
		        }
            
		        $sqla  = "SELECT DATE_ADD('$dateStr', INTERVAL ".($a->TICKS * $a->CYCLE_D)." ".$acyclep[$a->CYCLE_P].") AS expire";
		        $sqla .= " FROM user_subscriptions WHERE id=".$a->ID;
                $rs = $zetadb->Execute($sqla);
		        $k = $rs->FetchNextObject();
		    
		        if(dpdate4($k->EXPIRE) <= $today ){
			    // time to get money
			        $balance = balance($a->USER);
			        $amount = $a->AMOUNT;
			        $id = $a->ID;
			        $amount = myround($amount);
			        $whofrom = dpObj($a->USER);
			        $merch = dpObj2($a->MERCHANT_ID);
			        // Check funds
			        if ($balance < $amount){
				    // send out error email
			            $zetadb->Execute("DELETE FROM user_subscriptions WHERE id={$a->ID}");

                        $r = $zetadb->Execute("SELECT * FROM merchant_subscription_link WHERE cycle_p='$a->CYCLE_P' and merchant_id={$a->MERCHANT_ID} and subscription_type='$a->SUBSCRIPTION_TYPE'");
                        $alink = $r->FetchNextObject();

				    // send out error email
			            $text = "Your ".$a->SUBSCRIPTION_TYPE." subscription to ".$merch->COMPANY ." has expired today.\n";
			            $text .= "You can re-new by visiting our subscription page here - ".$alink->RETURN_URL."".$alink->RENEW_URL."\n\n";
			            $text .= "Thank you\n";
				        wrapmail($whofrom->EMAIL, "Subscription Expired", $emailtop.$text.$emailbottom, $defaultmail);
		                $auth = "2";
			        }else{
				        $comments = "Subscription Renewal";
				        transact($a->USER,$a->MERCHANT_ID,$amount,$comments,'','');
       			        $zetadb->Execute("UPDATE user_subscriptions SET ticks=1, created=NOW() WHERE id={$a->ID}");
			        }
		        }                
        }    
      }  
}
echo "userip=$userip&authstatus=$auth";
?>