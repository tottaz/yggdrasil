<?php

/**
* function to get the current microtime in seconds
* @return double $mtime current microtime in seconds
*
*/

function get_microtime(){
  $mtime=microtime();
  $mtime=explode(" ",$mtime);
  $mtime=doubleval($mtime[1])+doubleval($mtime[0]);
  return $mtime;
}

//
//
//
function cardType($cc_card_type) {
     switch ($cc_card_type) {
        case "visa":
          return "VI";
        case "mastercard":
          return "MC";
        case "amex":
          return "AM";
        case "dinersclub":
          return "DC";
        case "discover":
          return "DI";
        case "jcb":
          return "JC";
      }
  return false;
}

function credit_card_validator( $credit_card_number ) {

    # Clean out any non-numeric characters in $credit_card_number
    $credit_card_number = ereg_replace( '[^0-9]','', $credit_card_number );
    $ccn_length = strlen( $credit_card_number );
    # Find the type of the card based on the prefix and length of the card number
    if( ereg( '^3[4|7]', $credit_card_number ) && $ccn_length == 15 )
        $type = 'American Express';
    else if ( ereg( '^4', $credit_card_number )  && ( $ccn_length == 13 || $ccn_length == 16 ) )
        $type = 'Visa';
    else if( ereg( '^5[1-5]', $credit_card_number ) && $ccn_length == 16 )
        $type = 'Mastercard';
    else
        return array( 'valid' => false, 'type' => 'unknown', 'error' => 'This is not a valid number for an American Express, Mastercard or Visa Card. Please re-enter the number or use a different card.' );
    # Reverse the credit card number
    $x = strrev( $credit_card_number );
    # Loop through the reversed credit card number one digit at a time. Transform odd numbered entries and sum with even entries
    for( $i = 0;  $i < $ccn_length ; $i++ )
        if( $i % 2 ) # Test to see if the current string index ( $i ) is odd.
            $sum += ( ( $x[ $i ] % 5 ) * 2 ) + floor( ( $x[ $i ] / 5 ) );
	# This formula is equivalent to multiplying a number by two and then, if the result has two digits, summing the two digits.
        else
            $sum += $x[ $i ];
    if( ! ( $sum % 10 ) ) # If the result, divided by 10 has no fractional remainer, then the card is valid.
        return array( 'valid' => true, 'type' => $type );
    else
        return array( 'valid' => false, 'type' => $type, 'error' => "This is not a valid number for a $type Card. Please re-enter the card number or use a different card." );
}

/**
* function to dump the contents of an array for debug output
*
* @param mixed $call variable to be displayed as debug output
* @param string $cname heading for display output
*
*/

function dp($call,$cname) {
	echo "<br/>".$cname.":<pre>";
	if(!is_array($call)){$call=htmlspecialchars($call);}
	print_r($call);
	if(is_array($call)){reset($call);}
	echo "</pre><hr/>\n";

?>
<SCRIPT language=javascript type='text/javascript'>
		alert('$cname - $call.');
</SCRIPT>
<?

}

/**
* function to process merchant transaction via Firepay API
*
* @param string $url url of Firepay secure server
* @param array $data array of required data fields
*
* @return array $result result of transaction
*
*/

function post_firepay($firepay,$debug){

	// Your Merchant Account Parameters
	$account='';
	$merchantId='';
	$merchantPwd='';
	$operation='';
	$data_stream='';
	$url='';
	$start=get_microtime();

	// Array of account parameters

	$params = array( 	'account' => $account,
							'merchantId' => $merchantId,
							'merchantPwd' => $merchantPwd,
							'clientVersion' => $clientVersion,
							'operation' => $operation  );
	// Append account parameters to firepay array
	$data = (array)$cpospay + (array)$params;

	// Your Merchant Account Parameters
    $device_type="9";
    $transmission_number="00";
    $terminal_id="                ";

    $employee_id='000001';
	$current_date='090905';
    $current_time='090905';

//    $current_date = getdate();

    $processing_flag_1='0';
    $processing_flag_2='0';
    $processing_flag_3='0';

    $response_code='000';
    $message_type='F';
    $message_subtype='0';
    $transaction_code='00';
    $entry_id='M';
    $PAN='4111111111111111';
    $expiration_date="0909";
    $member_number='1';
    $POS_ENTRY_MODE='012';
    $amount_1='00000000000000004040';
    $data_stream='';
	$url='';
	$start=get_microtime();

	// Array of account parameters
	$params = array( 	$device_type,
    					$transmission_number,
						$terminal_id,
						$employee_id,
						$current_date,
                        $current_time,
                        $processing_flag1,
                        $processing_flag2,
                        $processing_flag3,
                        $response_code,
                        $message_type,
                        $message_subtype,
                        $transaction_code,
                        $entry_id,
                        $PAN,
                        $expiration_date,
                        $member_number,
                        $POS_ENTRY_MODE,
                        $amount_1 );


	// Append account parameters to cpospay array
	$data = (array)$cpospay + (array)$params;

if($debug==true){
		// DEBUG MODE: Display paramters being sent and set url to test gateway
		dp($data,'Input Parameters: DEBUG Mode');
		// Test gateway
		$url='http://66.146.137.122:8080/paygate/terminalserver?msg=';
	}else{
		// Production gateway
		dp($data,'Input Parameters: Production Mode');
		$url='http://66.146.137.122:8080/';
//		$url='https://66.146.153.131:8443/paygate/terminalserver?msg=';
    }

	//prep the incoming array to be sent via POST
	foreach($data as $k=>$v){
		if(strlen($data_stream)>0){
			$data_stream.='&';
		}
		$data_stream.="$k=".urlencode($v);
	}

	//send the data and retrieve response
	$curl_handler=curl_init($url);
	curl_setopt($curl_handler,CURLOPT_RETURNTRANSFER,1);
	curl_setopt($curl_handler,CURLOPT_POST,1);
	curl_setopt($curl_handler,CURLOPT_POSTFIELDS,$data_stream);
	$result_tmp=curl_exec($curl_handler);
	curl_close($curl_handler);

	//re-arrange the results into an array
	$result_tmp=explode('&',urldecode($result_tmp));
	foreach($result_tmp as $v){
		list($key,$val)=explode('=',$v);
		$result[$key]=$val;
	}

	$end=get_microtime();
	$tmp = array( 'transactionTime' => $end-$start );
	$result = (array)$result + (array)$tmp;

	if($debug==true){
		dp($result,'FirePay Response: DEBUG Mode');
		return $result;
	}else{
		return $result;
	}
}
?>