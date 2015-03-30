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
//    $data_stream.=$url;
	foreach($data as $k=>$v){
		$data_stream.= urlencode($v);
	}

    $data_stream = urlencode("9 26PS021165              000000000000AO90100000");
    $data_stream .= urlencode("\x1C");
    $data_stream .= urlencode("V001  0000000000\r\n");
    $data_stream .= urlencode("Keep-Alive: 1000\r\n");
    $data_stream .= urlencode("Connection: Keep-Alive \r\n");


//    $data_stream="http://66.146.153.131:8080/paygate/terminalserver?msg=9+00++++++++++++++++++++++000000000000FO00000000%1CB%1CqM%3D0000%3F%1C6%1EE012";
//send the data and retrieve response

	$curl_handler=curl_init($url);
//    curl_setopt($curl_handler,CURLOPT_RETURNTRANSFER,1);
//    curl_setopt($curl_handler,CURLOPT_HEADER,0);
//    curl_setopt($curl_handler,CURLOPT_TRANSFERTEXT,0);
//    curl_setopt($curl_handler,CURLOPT_HTTPGET,0);
//    curl_setopt($curl_handler,CURLOPT_MUTE,0);
//    curl_setopt($curl_handler,CURLOPT_NOBODY,0);

//    curl_setopt($curl_handler,CURLOPT_CUSTOMREQUEST, "POST");
//    curl_setopt($curl_handler,CURLOPT_ENCODING, "ISO-8859-1");

//       $header = "POST http://66.146.137.122:8080/paygate/terminalserver?msg=".$data_stream." \r\n";

       $header  = "POST http://66.146.137.122:8080/paygate/terminalserver?msg=".$data_stream." \r\n";
//       $header .= "MIME-Version: 1.0 \r\n";
//       $header .= "Content-type: application/PTI26 \r\n";
//       $header .= "Content-length: ".strlen($data_stream)." \r\n";
//       $header .= "Content-transfer-encoding: text \r\n";
//       $header .= "Request-number: 1 \r\n";
//       $header .= "Document-type: Request \r\n";
//       $header .= "Interface-Version: Test 1.4 \r\n";
//       $header .= "Keep-Alive: 1000\r\n";
//       $header .= "Connection: Keep-Alive \r\n\r\n";
//       $header .= $data_stream;

       curl_setopt($curl_handler, CURLOPT_URL,$url);
       curl_setopt($curl_handler, CURLOPT_RETURNTRANSFER,1);
       curl_setopt($curl_handler, CURLOPT_TIMEOUT, 4);
       curl_setopt($curl_handler, CURLOPT_CUSTOMREQUEST, $header);

//    curl_setopt($curl_handler, CURLOPT_SSL_VERIFYHOST,1);
//    curl_setopt($curl_handler, CURLOPT_USERAGENT, $defined_vars['HTTP_USER_AGENT']);

//    curl_setopt($curl_handler, CURLOPT_SSL_VERIFYPEER,1);
//    curl_setopt($curl_handler, CURLOPT_SSL_VERIFYHOST,1);
//    curl_setopt($curl_handler, CURLOPT_SSLVERSION,2);
//    curl_setopt($curl_handler, CURLOPT_SSL_VERIFYHOST,1);

//    curl_setopt($curl_handler,CURLOPT_POST,1);
//    curl_setopt($curl_handler,CURLOPT_POSTFIELDS,$header);
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

//	$query = "SELECT `transid` FROM {$job_prefix}_job_trans WHERE `sid` = '$sid'";
//	$rst=mysql_query($str_sql);
//	if ($rst) {
//		$adata=mysql_fetch_row($rst);
//		if (!$i) {
//			$i=$adata[0];
//		}
//	}
//	mysql_free_result($rst);
	header ("Location: localhost=post&cmd=sub_suc&i=".$i);

} elseif($result['status']=='E'){
	// Put failed logic here
	dp($result,'You transaction failed, the details are.');
} else{
  	// Put failed logic here
	dp($result,'You transaction failed, the details are.');
}
?>