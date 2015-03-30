<?php

include('zetapay/core/include/common.php');   
require_once('zetapay/core/include/qpay_base.php');

$base = new qpay_base();

($userip = $_SERVER['HTTP_X_FORWARDED_FOR']) or ($userip = $_SERVER['REMOTE_ADDR']);
$auth = "0";  

if($base->input['password'] || $base->input['email']){
        $encryptedpassword=md5($base->input['pwassword']); //encrypt the password
        $rs = $zetadb->Execute("SELECT * FROM system_users WHERE (email='".addslashes($base->input['email'])."') AND password='".addslashes($encryptedpassword)."'");
		$data = $rs->FetchNextObject();
		if ($data) {
			$zetadb->Execute("UPDATE system_users SET signed_on=NOW(),lastip='$userip' WHERE id=$data->ID");
			if($use_iplogging){
			    $zetadb->Execute("INSERT INTO system_logins SET user='$data->ID',date=NOW(),ipaddress='$userip', username='$data->EMAIL'");
		    }
            
            require('zetapay/core/payment/firepay.php');
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
							'email' => $data->EMAIL);
   
//            $result=post_firepay($firepay,false); //debug
    
            unset($base->input['cmd']);
            unset($cmd);
    
        if($result['status']=='SP') {
              $amount = $base->input['amount'];
        //      $fees = myround($amount * $dep_np_percent / 100, 2) + $dep_np_fee;
        //
        //  Add deposit amount to 
        //
             transact(18,$user,($amount),'Deposit','',0,0,'',addslashes($result['authCode']));
	    // Notify admin
	        $message = "$user has just deposited {$currency}$amount via credit card!";
	        if ($dep_notify){
		        wrapmail($adminemail, "$sitename Deposit", $message, $defaultmail);
	        }
        //
        //  if errors
        //
        }
      }  
}

echo "result=$result&userip=$userip&authstatus=$auth";
?>