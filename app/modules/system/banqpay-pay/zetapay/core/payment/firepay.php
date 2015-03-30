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

/**
* function to dump the contents of an array for debug output
*
* @param mixed $call variable to be displayed as debug output
* @param string $cname heading for display output
*
*/

function datadump($call,$cname) {
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
	$account='99993987';
	$merchantId='0cecb5e33-7f70-USD';
	$merchantPwd='uTmy9a#I';
	$clientVersion='1.1';
	$operation='P';
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
	$data = (array)$firepay + (array)$params;

	if($debug==true){
		// DEBUG MODE: Display paramters being sent and set url to test gateway
        datadump($data,'Input Parameters: DEBUG Mode');
		// Test gateway
		$url='https://realtime.test.firepay.com:443/servlet/DPServlet';
	}else{
		// Production gateway
		$url='https://realtime.firepay.com:443/servlet/DPServlet';
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
		datadump($result,'FirePay Response: DEBUG Mode');
		return $result;
	}else{
		return $result;
	}
}
?>