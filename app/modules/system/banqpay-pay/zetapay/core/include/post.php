<?php
	class HTTPPost {
		var $url;
		var $uri;

		var $dataArray = array();

		var $responseBody = '';
		var $responseHeaders = '';

		var $errors = '';

		function HTTPPost($url = '', $dataArray = '', $authInfo = false) {
			$this->setURL($url);   
				$this->setDataArray($dataArray);
		$this->authInfo = $authInfo;
		}

		function setUrl($url) {
			if($url != '') {
				$url = ereg_replace("^http://", "", $url);
				$this->url = substr($url, 0, strpos($url, "/")); 
				$this->uri = strstr($url, "/"); 
				return true;
			} else {
				return false;
			}
		}

		function setDataArray($dataArray) {
			if(is_array($dataArray)) {
				$this->dataArray = $dataArray;
				return true;
			} else {
				return false;
			}
		}

		// can be called as: setAuthInfo(array('user', 'pass')) or setAuthInfo('user', 'pass')
		function setAuthInfo($user, $pass = false){
			if (is_array($user)){
				$this->authInfo = $user;
			}else{
				$this->authInfo = array($user, $pass);
			}
		}

		function getResponseHeaders(){
			return $this->responseHeaders;
		}

		function getResponseBody(){
			return $this->responseBody;
		}

		function getErrors(){
			return $this->errors;
		}

		function prepareRequestBody(&$array,$index=''){
			foreach($array as $key => $val) {
				if(is_array($val)){
					if($index){
						$body[] = $this->prepareRequestBody($val,$index.'['.$key.']');
					}else {
						$body[] = $this->prepareRequestBody($val,$key);
					}
				}else {
					if($index){
						$body[] = $index.'['.$key.']='.urlencode($val);
					}else {
						$body[] = $key.'='.urlencode($val);
					}
				}
			}
			return implode('&',$body);
		}

		function post() {
			$this->responseHeaders = '';
			$this->responseBody = '';
			$requestBody = $this->prepareRequestBody($this->dataArray);

			if ($this->authInfo)
				$auth = base64_encode("{$this->authInfo[0]}:{$this->authInfo[1]}");

			$contentLength = strlen($requestBody); 
			$request = "POST $this->uri HTTP/1.1\r\n". 
				"Host: $this->url\r\n". 
				"User-Agent: HTTPPost\r\n". 
				"Content-Type: application/x-www-form-urlencoded\r\n". 
				($this->authInfo ? "Authorization: Basic $auth\r\n" : '') .
				"Content-Length: $contentLength\r\n\r\n". 
				"$requestBody\r\n"; 

			$socket = fsockopen($this->url, 80, &$errno, &$errstr); 
			if(!$socket) { 
				$this->error['errno'] = $errno;
				$this->error['errstr'] = $errstr; 
				return $this->getResponseBody();
			}

			fputs($socket, $request); 

			$isHeader = true;
			$blockSize = 0;

			while (!feof($socket)) { 
				if($isHeader){
					$line = fgets($socket, 1024); 
					$this->responseHeaders .= $line;
					if('' == trim($line)){
						$isHeader = false;
					}
				}else {
					if(!$blockSize){
						$line = fgets($socket, 1024);
						if($blockSizeHex = trim($line)){
							$blockSize = hexdec($blockSizeHex);
						}
					}else {
						$this->responseBody .= fread($socket,$blockSize);
						$blockSize = 0;
					}
				}
			}
			fclose($socket);
			return $this->getResponseBody(); 
		}
	}
?>
