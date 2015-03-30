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

if($base->input['password'] || $base->input['email']){
        $encryptedpassword=md5($base->input['password']); //encrypt the password
        $rs = $zetadb->Execute("SELECT * FROM system_users WHERE (email='".addslashes($base->input['email'])."') AND password='".addslashes($encryptedpassword)."'");

		$data = $rs->FetchNextObject();
		if ($data) {
			$zetadb->Execute("UPDATE system_users SET signed_on=NOW(),lastip='$userip' WHERE id=$data->ID");
			if($use_iplogging){
//				$zetadb->Execute("INSERT INTO systems_logins SET user='$data->ID',date=NOW(),ipaddress='$userip', username='$data->EMAIL'");
		    }

            $rs = $zetadb->Execute("SELECT * FROM user_subscriptions WHERE user='$data->ID' and ticks>'0' and subscription_type='rss-feeds'");
		    $a = $rs->FetchNextObject();
            
            if ($a != '') {
            $auth = "1";   //Set Authentication match, no check subscription
            if($a->TICKS == 1){
			    $last = 0;
		    }else{
			    $last = $a->TICKS - 1;
		    }
            
	        $dateStr = $a->CREATED;
	        $today = date( "Y-m-d", time() );
		    if($a->CYCLE_P == "W"){
			    $a->CYCLE_D = $a->CYCLE_D * 7;
			    $a->STOP = $a->STOP * 7;
		    }
            
		    $sqla  = "SELECT DATE_ADD('$dateStr', INTERVAL ".$a->STOP." ".$acyclep[$a->CYCLE_P].") AS expire,";
		    $sqla .= " DATE_ADD('$dateStr', INTERVAL ".$last." ".$acyclep[$a->CYCLE_P].") AS last,";
		    $sqla .= " DATE_ADD('$dateStr', INTERVAL ".($a->TICKS * $a->CYCLE_D)." ".$acyclep[$a->CYCLE_P].") AS next";
		    $sqla .= " FROM user_subscriptions WHERE id=".$a->ID;
            $rs = $zetadb->Execute($sqla);
		    $k = $rs->FetchNextObject();
		    
            $sqla  = "SELECT DATE_ADD('".$k->LAST."', INTERVAL ".$a->CYCLE_D." ".$acyclep[$a->CYCLE_P].") AS next";
		    $sqla .= " FROM user_subscriptions WHERE id=".$a->ID;
            $rs = $zetadb->Execute($sqla);
		    $d = $rs->FetchNextObject();

		    if(dpdate4($k->EXPIRE) == $today ){
			// expired
			    $zetadb->Execute("UPDATE user_subscriptions SET ticks=0 WHERE id={$a->ID}");
            //	  $zetadb->Execute("DELETE FROM user_subscriptions WHERE id={$a->id}");
		    } else if (dpdate4($d->NEXT) == $today ){
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
				    $text = "A subscription payment was due today\n";
				    $text .= "Please pay ".$currency.$amount." to ".$merch->EMAIL ."ASAP\n";
				    $text .= "Thank you\n";
				    wrapmail($whofrom->email, "Missed Subscription Payment", $emailtop.$text.$emailbottom, $defaultmail);
		            $auth = "2";
			    }else{
				    $comments = "Subscription Renewal";
				    transact($a->USER,$a->MERCHANT_ID,$amount,$comments,'','');
       			    $zetadb->Execute("UPDATE user_subscriptions SET ticks = ticks + 1 WHERE id={$a->ID}");
			    }
		     }                
            }  else {
                $rs = $zetadb->Execute("SELECT * FROM user_subscriptions WHERE user='$data->ID'");
		        $a = $rs->FetchNextObject();

			    $whofrom = dpObj($a->USER);
			    $merch = dpObj2($a->MERCHANT_ID);

			    // send out error email
	            $text = "Your subscription has expired\n";
			    $text .= "To re-new click this link http://www.banqpay.com/subscribelink.php?subscribe=$105$3$rss-feeds$M$contentid-51.html\n";
			    $text .= "Thank you\n";
			    wrapmail($whofrom->email, "Subscription Expired", $emailtop.$text.$emailbottom, $defaultmail);
		        $auth = "2";
        }    
      }  
}
echo "userip=$userip&authstatus=$auth";
?>