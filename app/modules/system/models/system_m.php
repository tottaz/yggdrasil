<?php defined('BASEPATH') OR die('No direct script access allowed');
/**
 * Maintenance Module
 *
 */
class System_m extends My_Model
{
	public function export($table = '', $type = 'xml', $table_list)
	{
		switch ($table)
		{
			case 'users':
				$data_array = $this->db
					->select('users.id, email, IF(active = 1, "Y", "N") as active', FALSE)
					->select('first_name, last_name, display_name, company, lang, gender, website')
					->join('profiles', 'profiles.user_id = users.id')
					->get('users')
					->result_array();
				break;

			case 'files':
				$data_array = $this->db
					->select('files.*, file_folders.name folder_name, file_folders.slug')
					->join('file_folders', 'files.folder_id = file_folders.id')
					->get('files')
					->result_array();
				break;

			default:
				$data_array = $this->db
					->get($table)
					->result_array();
				break;
		}
		force_download($table.'.'.$type, $this->format->factory($data_array)
			->{'to_'.$type}());
	}

	// Get the api log items from the log
	public function get_listapilogs($items = 0) 
	{
		if ($query = $this->db
			->select("*", false)
			->order_by('time', 'desc')
			->limit($items)
			->get('logs')) 
			{
				return $query->result_array();
			}
			else {
				log_message('error', 'System_m.php: Could not get items from the log');
				return false;
			}
	}

	function _zeroFill($a, $b)
	{
		$z = hexdec(80000000);
	  if ($z & $a)
	  {
	  	$a = ($a>>1);
	  	$a &= (~$z);
			$a |= 0x40000000;
			$a = ($a>>($b-1));
		}
		else
		{
			$a = ($a>>$b);
		}
		
		return $a;
	}
	
	function _mix($a,$b,$c)
	{
		$a -= $b; $a -= $c; $a ^= (_zeroFill($c,13));
		$b -= $c; $b -= $a; $b ^= ($a<<8);
		$c -= $a; $c -= $b; $c ^= (_zeroFill($b,13));
		$a -= $b; $a -= $c; $a ^= (_zeroFill($c,12));
		$b -= $c; $b -= $a; $b ^= ($a<<16);
		$c -= $a; $c -= $b; $c ^= (_zeroFill($b,5));
		$a -= $b; $a -= $c; $a ^= (_zeroFill($c,3));
		$b -= $c; $b -= $a; $b ^= ($a<<10);
		$c -= $a; $c -= $b; $c ^= (_zeroFill($b,15));
		return array($a,$b,$c);
	}
	
	function _GoogleCH($url, $length=null, $init=GOOGLE_MAGIC)
	{
		if(is_null($length))
		{
			$length = sizeof($url);
		}
		
		$a = $b = 0x9E3779B9;
		$c = $init;
		$k = 0;
		$len = $length;
		while($len >= 12)
		{
			$a += ($url[$k + 0] + ($url[$k + 1] << 8) + ($url[$k + 2] << 16) + ($url[$k + 3] << 24));
			$b += ($url[$k + 4] + ($url[$k + 5] << 8) + ($url[$k + 6] << 16) + ($url[$k + 7] << 24));
		  $c += ($url[$k + 8] + ($url[$k + 9] << 8) + ($url[$k + 10] << 16) + ($url[$k + 11] << 24));
	    $_mix = _mix($a,$b,$c);
			$a = $_mix[0]; $b = $_mix[1]; $c = $_mix[2];
			$k += 12;
			$len -= 12;
		}
		
		$c += $length;
	  
	  switch($len)
	  {
	  	case 11: $c += ($url[$k + 10] << 24);
	    case 10: $c += ($url[$k + 9] << 16);
			case 9 : $c += ($url[$k + 8] << 8);
			case 8 : $b += ($url[$k + 7] << 24);
			case 7 : $b += ($url[$k + 6] << 16);
			case 6 : $b += ($url[$k + 5] << 8);
			case 5 : $b += ($url[$k + 4]);
			case 4 : $a += ($url[$k + 3] << 24);
			case 3 : $a += ($url[$k + 2] << 16);
			case 2 : $a += ($url[$k + 1] << 8);
			case 1 : $a += ($url[$k + 0]);
		}
	
		$_mix = _mix($a,$b,$c);
		return $_mix[2];
	}
	
	function _strord($string)
	{
		for($i = 0;$i < strlen($string);$i++)
		{
			$result[$i] = ord($string{$i});
		}
		return $result;
	}

	function url_exists($url) 
	{  
	     $url = @parse_url($url);  
	     if (!$url)  
	     {  
	        return false;  
	     }  
	     $url = array_map('trim', $url);  
	     $url['port'] = (!isset($url['port'])) ? 80 : (int)$url['port'];  
	     $path = (isset($url['path'])) ? $url['path'] : '';  
	     if ($path == '')  
	     {  
	         $path = '/';  
	     }  
	     $path .= (isset($url['query'])) ? "?$url[query]" : '';  
	     if (isset($url['host']) AND $url['host'] != gethostbyname($url['host']))  
	     {  
	         if (PHP_VERSION >= 5)  
	         {  
	             $headers = get_headers("$url[scheme]://$url[host]:$url[port]$path");  
	         }  
	         else 
	         {  
	             $fp = fsockopen($url['host'], $url['port'], $errno, $errstr, 30);  
	             if (!$fp)  
	             {  
	                 return false;  
	             }  
	             fputs($fp, "HEAD $path HTTP/1.1\r\nHost: $url[host]\r\n\r\n");  
	             $headers = fread($fp, 4096);  
	             fclose($fp);  
	         }  
	         $headers = (is_array($headers)) ? implode("\n", $headers) : $headers;  
	         return (bool)preg_match('#^HTTP/.*\s+[(200|301|302)]+\s#i', $headers);  
	     }  
	     return false;  
	} 

	//for POST request with curl 
	function do_post_request_curl($url, $data) 
	{ 
	    $ch = curl_init();  
	    curl_setopt($ch, CURLOPT_URL,$url); // set url to post to  
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER,1); // return into a variable  
	    curl_setopt($ch, CURLOPT_POST, 1); // set POST method  
	    curl_setopt($ch, CURLOPT_POSTFIELDS, $data); // add POST fields  
	    $result = curl_exec($ch); // run the whole process  
	    //echo $result; 
	    curl_close($ch);    
	    return $result;  
	} 

	function file_get_contents_curl($url) 
	{ 
	    $ch = curl_init(); 
	    curl_setopt($ch, CURLOPT_HEADER, 0); 
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); //Set curl to return the data instead of printing it to the browser. 
	    curl_setopt($ch, CURLOPT_URL, $url); 
	    $data = curl_exec($ch); 
	    curl_close($ch); 

	    return $data; 
	}
}