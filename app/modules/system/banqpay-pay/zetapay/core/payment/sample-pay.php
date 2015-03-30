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
}


/**
* function to process merchant transaction via cpospay API
*
* @param string $url url of cpospay secure server
* @param array $data array of required data fields
*
* @return array $result result of transaction
*
*/
function post_cpospay($cpospay,$debug){

	// Your Merchant Account Parameters
    $device_type="9 ";
    $transmission_number="00";
    $terminal_id="PS021165        ";
    $reserved='      ';

    $employee_id='000001';
	$current_date='050909';
    $current_time='000000';

// Field Separators

    $FIDB="\x1CB";
    $FIDC="\x1CC";
    $FIDD="\x1CD";
    $FIDE="\x1CE";
    $FIDF="\x1CF";
    $FIDS="\x1CS";
    $FIDU="\x1CU";
    $FIDh="\x1Ch";
    $FIDq="\x1Cq";
    $FIDy="\x1Cy";
    $FIDG="\x1CG";

//    $current_date = getdate();

    $processing_flag_1='0';
    $processing_flag_2='0';
    $processing_flag_3='0';

    $response_code='000';
    $message_type='F';
    $message_subtype='O';
    $transaction_code='00';
    $response_code='0';
    $entry_id='M';
    $PAN='4111111111111111';
    $expiration_date="0909";
    $member_number='1';
    $POS_ENTRY_MODE='012';
    $amount='0000000000000004404';

    $revised_amount='0';
    $account_type='4';
    $authorization_number='        ';
    $invoice_number='1111111111';
    $customer_language='1';
    $Sequence_Number='0010010010';
    $track_2_data='1234567890123456789012345678901234567890';
	$surcharge_amount='00000';
    $MAC_value='00000000';

    $data_stream='';
    $test_stream='';
	$url='';
	$start=get_microtime();

	// Array of account parameters
	$header = array( 	$device_type,
    					$transmission_number,
						$terminal_id,
                        $reserved,
						$current_date,
                        $current_time,
                        $message_type,
                        $message_subtype,
                        $transaction_code,
                        $processing_flag1,
                        $processing_flag2,
                        $processing_flag3,
                        $response_code );


	$purchase = array(  $FIDB,
                        $amount,
                        $FIDC,
                        $revised_amount,
                        $FIDD,
                        $account_type,
                        $FIDF,
                        $authorization_number,
                        $FIDS,
                        $invoice_number,
                        $FIDU,
                        $customer_language,
                        $FIDh,
                        $Sequence_Number,
                        $FIDq,
                        $track_2_data,
                        $FIDy,
  						$surcharge_amount,
                        $FIDG,
                        $MAC_value );

	// Append account parameters to cpospay array
	$data = (array)$header + (array)$purchase;

	if($debug==true){
		// DEBUG MODE: Display paramters being sent and set url to test gateway
		dp($data,'Input Parameters: DEBUG Mode');
		// Test gateway
		$url='http://66.146.137.122:8080/';
	}else{
		// Production gateway
		dp($data,'Input Parameters: Production Mode');
//		$url='http://66.146.153.131:8080/';
		$url='http://66.146.137.122:8080/';
	}

	//prep the incoming array to be sent via POST
//    $data_stream.=$url;
	foreach($data as $k=>$v){
        $test_stream.= $v;
		$data_stream.= urlencode($v);
	}
	//send the data and retrieve response
	   $curl_handler=curl_init($url);

//       $header = "POST http://66.146.137.122:8080/paygate/terminalserver?msg=".$data_stream." \r\n";
//       $header = "POST http://66.146.137.122:8080/paygate/terminalserver?msg=".$data_stream." \r\n";
//       $header = "POST http://66.146.137.122:8080/paygate/terminalserver?msg=9+55PS021165++++++++++++++000000000000FO00000000%1CB699%1CD4%1CS0000141%1CU0%1Cb0000000000000000%1Ch0010011590%1Cq%3B5177810123456780%3D05121010000000000002%3F%1Cy0%1CGF4B7B8038\r\n\r\n";
         $header = "POST http://66.146.137.122:8080/paygate/terminalserver?msg=9+27PS020976++++++++++++++000000000000FO00000000%1CB200%1CD4%1CS0000168%1CU1%1Cb0000000000000000%1Ch0010013010%1Cq%3B5446120039890832%3D05101013670000000001%3F%1Cy0%1CGF5F1A38C8\r\n\r\n";
//       $header = "\x50\x4F\x53\x54\x20\x68\x74\x74\x70\x3A\x2F\x2F\x36\x36\x2E\x31\x34\x36\x2E\x31\x33\x37\x2E\x31\x32\x32\x3A\x38\x30\x38\x30\x2F\x70\x61\x79\x67\x61\x74\x65\x2F\x74\x65\x72\x6D\x69\x6E\x61\x6C\x73\x65\x72\x76\x65\x72\x3F\x6D\x73\x67\x3D\x39\x2B\x32\x37\x50\x53\x30\x32\x30\x39\x37\x36\x2B\x2B\x2B\x2B\x2B\x2B\x2B\x2B\x2B\x2B\x2B\x2B\x2B\x2B\x30\x30\x30\x30\x30\x30\x30\x30\x30\x30\x30\x30\x46\x4F\x30\x30\x30\x30\x30\x30\x30\x30\x25\x31\x43\x42\x32\x30\x30\x25\x31\x43\x44\x34\x25\x31\x43\x53\x30\x30\x30\x30\x31\x36\x38\x25\x31\x43\x55\x31\x25\x31\x43\x62\x30\x30\x30\x30\x30\x30\x30\x30\x30\x30\x30\x30\x30\x30\x30\x30\x25\x31\x43\x68\x30\x30\x31\x30\x30\x31\x33\x30\x31\x30\x25\x31\x43\x71\x25\x33\x42\x35\x34\x34\x36\x31\x32\x30\x30\x33\x39\x38\x39\x30\x38\x33\x32\x25\x33\x44\x30\x35\x31\x30\x31\x30\x31\x33\x36\x37\x30\x30\x30\x30\x30\x30\x30\x30\x30\x31\x25\x33\x46\x25\x31\x43\x79\x30\x25\x31\x43\x47\x46\x35\x46\x31\x41\x33\x38\x43\x38\x0D\x0A";

       curl_setopt($curl_handler, CURLOPT_URL,$url);
       curl_setopt($curl_handler, CURLOPT_SSL_VERIFYHOST,1);
       curl_setopt($curl_handler, CURLOPT_RETURNTRANSFER,1);
       curl_setopt($curl_handler, CURLOPT_SSL_VERIFYPEER, FALSE);
       curl_setopt($curl_handler, CURLOPT_TIMEOUT, 4);
       curl_setopt($curl_handler, CURLOPT_CUSTOMREQUEST, $header);

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
		dp($result,'cpospay Response: DEBUG Mode');
		return $result;
	}else{
		return $result;
	}
}


/*
*
* Posting the transaction to cpospay
*
*/
// DEBUG MODE
//$result=post_cpospay($_POST['cpospay'],true);

// PRODUCTION MODE
$result=post_cpospay($_POST['cpospay'],false);


if($result['status']=='SP'){
	// Put success logic here
	header ("Location: localhost=post&cmd=sub_suc&i=".$i);

} elseif($result['status']=='E'){
	// Put failed logic here
	dp($result,'You transaction failed, the details are.');
} else{
  	// Put failed logic here
	dp($result,'You transaction failed, the details are.');
}
?>