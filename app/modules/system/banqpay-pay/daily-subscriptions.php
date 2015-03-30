<?
    include('config.php');  

	$root_dir="zetapay/";	
	require_once($rootDir.$subDir.'core/include/common.php');

	$cyclep["D"]="Day(s)";
	$cyclep["W"]="Week(s)";
	$cyclep["M"]="Month(s)";
	$cyclep["Y"]="Year(s)";
	$acyclep["D"]="DAY";
	$acyclep["W"]="DAY";
	$acyclep["M"]="MONTH";
	$acyclep["Y"]="YEAR";
?>
<?
    $r = $zetadb->Execute("SELECT * FROM user_subscriptions");
    
	while ($a = $r->FetchNextObject()){

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
			        // expired
			        $zetadb->Execute("DELETE FROM user_subscriptions WHERE id={$a->ID}");
                    
                    $rat = $zetadb->Execute("SELECT * FROM merchant_subscription_link WHERE cycle_p='$a->CYCLE_P' and merchant_id={$a->MERCHANT_ID} and subscription_type='$a->SUBSCRIPTION_TYPE'");
                    $alink = $rat->FetchNextObject();
                                        
				    // send out error email
			        $text = "Your ".$a->SUBSCRIPTION_TYPE." subscription to ".$merch->COMPANY ." has expired today.\n";
			        $text .= "You can re-new by visiting our subscription page here - ".$alink->RETURN_URL."".$alink->RENEW_URL."\n\n";
			        $text .= "Thank you\n";
				    wrapmail($whofrom->EMAIL, "Subscription Expired", $emailtop.$text.$emailbottom, $defaultmail);
                    if (!$alink->DELETE_URL == "") {
                    
                        $url = $alink->RETURN_URL;
                        $url .= $alink->DELETE_URL;
                        $url .= "?email=".$whofrom->USERNAME."&password=".$whofrom->PASSWORD."";

	                    //send the data and retrieve response
	                    $curl_handler=curl_init($url);
	                    curl_setopt($curl_handler,CURLOPT_RETURNTRANSFER,1);
	                    curl_setopt($curl_handler,CURLOPT_POST,1);
	                    $result_tmp=curl_exec($curl_handler);
	                    curl_close($curl_handler);
                    }    
			    }else{
				    $comments = "Subscription Renewal";
				    transact($a->USER,$a->MERCHANT_ID,$amount,$comments,'','');
       			    $zetadb->Execute("UPDATE user_subscriptions SET ticks=1, created=NOW() WHERE id={$a->ID}");
			}
		}
	}
?>