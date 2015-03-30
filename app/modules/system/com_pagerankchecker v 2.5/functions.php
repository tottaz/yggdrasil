<?php
/*
Copyright (C)  2010 Urmila Champatiray.
    Permission is granted to copy, distribute and/or modify this document
    under the terms of the GNU Free Documentation License, Version 1.3
    or any later version published by the Free Software Foundation;
    with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.
    A copy of the license is included in the section entitled "GNU
    Free Documentation License"
	@license GNU/GPL http://www.gnu.org/copyleft/gpl.html
    PageRank Checker for Joomla
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
Version 2.5
Created date: April 2010
Updated Date: September 2010
Creator: Urmila Champatiray
Email: admin@joomlaseo.org
*/

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

if(!empty($urlcheck))
{
    //source Shri Sashank Prabhakara http://www.weberdev.com
	define('GOOGLE_MAGIC', 0xE6359A60);
	
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
	
$alexa_backlink=0; 
$alexa_reach=0; 
$techno_inblogs=0; 
$techno_inlinks=0; 
$techno_update=''; 

//--> for google pagerank 
function StrToNum($Str, $Check, $Magic) 
{ 
    $Int32Unit = 4294967296;  // 2^32 

    $length = strlen($Str); 
    for ($i = 0; $i < $length; $i++) { 
        $Check *= $Magic;      
        //If the float is beyond the boundaries of integer (usually +/- 2.15e+9 = 2^31), 
        //  the result of converting to integer is undefined 
        //  refer to http://www.php.net/manual/en/language.types.integer.php 
        if ($Check >= $Int32Unit) { 
            $Check = ($Check - $Int32Unit * (int) ($Check / $Int32Unit)); 
            //if the check less than -2^31 
            $Check = ($Check < -2147483648) ? ($Check + $Int32Unit) : $Check; 
        } 
        $Check += ord($Str{$i}); 
    } 
    return $Check; 
} 

//--> for google pagerank 
/* 
* Genearate a hash for a url 
*/ 
function HashURL($String) 
{ 
    $Check1 = StrToNum($String, 0x1505, 0x21); 
    $Check2 = StrToNum($String, 0, 0x1003F); 

    $Check1 >>= 2;      
    $Check1 = (($Check1 >> 4) & 0x3FFFFC0 ) | ($Check1 & 0x3F); 
    $Check1 = (($Check1 >> 4) & 0x3FFC00 ) | ($Check1 & 0x3FF); 
    $Check1 = (($Check1 >> 4) & 0x3C000 ) | ($Check1 & 0x3FFF);    
    
    $T1 = (((($Check1 & 0x3C0) << 4) | ($Check1 & 0x3C)) <<2 ) | ($Check2 & 0xF0F ); 
    $T2 = (((($Check1 & 0xFFFFC000) << 4) | ($Check1 & 0x3C00)) << 0xA) | ($Check2 & 0xF0F0000 ); 
    
    return ($T1 | $T2); 
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
//--> for google pagerank 
/* 
* genearate a checksum for the hash string 
*/ 
function CheckHash($Hashnum) 
{ 
    $CheckByte = 0; 
    $Flag = 0; 

    $HashStr = sprintf('%u', $Hashnum) ; 
    $length = strlen($HashStr); 
    
    for ($i = $length - 1;  $i >= 0;  $i --) { 
        $Re = $HashStr{$i}; 
        if (1 === ($Flag % 2)) {              
            $Re += $Re;      
            $Re = (int)($Re / 10) + ($Re % 10); 
        } 
        $CheckByte += $Re; 
        $Flag ++;    
    } 

    $CheckByte %= 10; 
    if (0 !== $CheckByte) { 
        $CheckByte = 10 - $CheckByte; 
        if (1 === ($Flag % 2) ) { 
            if (1 === ($CheckByte % 2)) { 
                $CheckByte += 9; 
            } 
            $CheckByte >>= 1; 
        } 
    } 

    return '7'.$CheckByte.$HashStr; 
} 

//get google pagerank 
function getpagerank($url) { 
    $query="http://toolbarqueries.google.com/search?client=navclient-auto&ch=".CheckHash(HashURL($url)). "&features=Rank&q=info:".$url."&num=100&filter=0"; 
    $data=file_get_contents_curl($query); 
    //print_r($data); 
    $pos = strpos($data, "Rank_"); 
    if($pos === false){} else{ 
        $pagerank = substr($data, $pos + 9); 
        return $pagerank; 
    } 
} 

//get alexa popularity 
function get_alexa_popularity($url) 
{    
global $alexa_backlink, $alexa_reach; 
    $alexaxml = "http://xml.alexa.com/data?cli=10&dat=nsa&url=".$url; 
    
    $xml_parser = xml_parser_create(); 
    /* 
    $fp = fopen($alexaxml, "r") or die("Error: Reading XML data."); 
    $data = ""; 
    while (!feof($fp)) { 
        $data .= fread($fp, 8192); 
        //echo "masuk while<br />"; 
    } 
    fclose($fp); 
    */ 
    $data=file_get_contents_curl($alexaxml); 
    xml_parse_into_struct($xml_parser, $data, $vals, $index); 
    xml_parser_free($xml_parser); 
    
    //print_r($vals); 
    //echo "<br />"; 
    //print_r($index); 
    
    $index_popularity = $index['POPULARITY'][0]; 
    $index_reach = $index['REACH'][0]; 
    $index_linksin = $index['LINKSIN'][0]; 
    //echo $index_popularity."<br />"; 
    //print_r($vals[$index_popularity]); 
    $alexarank = $vals[$index_popularity]['attributes']['TEXT']; 
    $alexa_backlink = $vals[$index_linksin]['attributes']['NUM']; 
    $alexa_reach = $vals[$index_reach]['attributes']['RANK']; 
    
    return $alexarank; 
} 

//get alexa backlink 
function alexa_backlink($url) 
{ 
    global $alexa_backlink; 
    if ($alexa_backlink!=0) 
    { 
        return $alexa_backlink; 
    } else { 
        $rank=get_alexa_popularity($url); 
        return $alexa_backlink; 
    } 
} 

//get alexa reach rank 
function alexa_reach_rank($url) 
{ 
    global $alexa_reach; 
    if ($alexa_reach!=0) 
    { 
        return $alexa_reach; 
    } else { 
        $rank=get_alexa_popularity($url); 
        return $alexa_reach; 
    } 
} 

//get google backlink 
function google_backs($url)
{ 
		 $params = &JComponentHelper::getParams( 'com_pagerankchecker' );
		 $googleapi = $params->get( 'googleapi' );
		 $content = file_get_contents("http://ajax.googleapis.com/ajax/services/search/web?v=1.0&filter=0&key=".$googleapi."&q=link:".urlencode($url));
         $data = json_decode($content);
         return intval($data->responseData->cursor->estimatedResultCount);

}
function getGoogleLinks($host) {
	$request = "http://www.google.com/search?q=" . urlencode($host) . "&amp;hl=en";
	$data = getPageData($request);
	preg_match('/<div id=resultStats>(About )?([\d,]+) result/si', $data, $l);
	$value = ($l[2]) ? $l[2] : "n/a";
	$string = "<a href=\"" . $request . "\">" . $value . "</a>";
	return $string;
}
 
//get yahoo inlink/backlink 
function getYahooInlinks($host) {
	$request = "http://siteexplorer.search.yahoo.com/search?p=" . urlencode($host);
	$data = getPageData($request);
	preg_match('/Inlinks \(([\d,]+)/si', $data, $l);
	$value = ($l[1]) ? $l[1] : "n/a";
	$string= "<a href=\"" . $request . "&amp;bwm=i\">" . $value . "</a>";
	return $string;
}

function getYahooLinks($domain) 
{
$params = &JComponentHelper::getParams( 'com_pagerankchecker' );
$appid = $params->get( 'appid' );
$yahoourl="http://search.yahooapis.com/SiteExplorerService/V1/inlinkData?appid=".$appid."&query=".$domain."&entire_site=1&omit_inlinks=domain&results=1&output=php";
$data = @file_get_contents($yahoourl);$results=unserialize($data);
return $results['ResultSet']['totalResultsAvailable']; 
//$results[0][1];
}

//get altavista search result count 
function altavista_link($sURL) 
{ 
    $url="http://www.altavista.com/web/results?itag=ody&q=link%3A$sURL&kgs=0&kls=0"; 
    $data = file_get_contents_curl($url); 
    $spl=explode("AltaVista found ",$data); 
    $spl2=explode(" results",$spl[1]); 
    $ret=trim($spl2[0]); 
    if(strlen($ret)==0) 
    { 
        return(0); 
    } 
    else 
    { 
        return($ret); 
    } 
    
} 
function get_technorati_rank($url) 
{ 
    $params = &JComponentHelper::getParams( 'com_pagerankchecker' );
    $apikey = $params->get( 'apikey' );
    global $techno_url, $techno_inblogs, $techno_inlinks, $techno_update; 
    
    $technorati_xml = "http://api.technorati.com/bloginfo?key=" . $apikey . "&url=" . $url; 
    $xml_parser = xml_parser_create(); 
    /* 
    $fp = fopen($technorati_xml, "r") or die("Error: Reading XML data."); 
    $data = ""; 
    while (!feof($fp)) { 
        $data .= fread($fp, 8192); 
    } 
    fclose($fp); 
    */ 
    $data=file_get_contents_curl($technorati_xml); 
    xml_parse_into_struct($xml_parser, $data, $vals, $index); 
    xml_parser_free($xml_parser); 
    
    //get values 
    $index_rank = $index['RANK'][0]; 
    $techno_rank = $vals[$index_rank]['value']; 
    //print_r($vals); 

    $index_inblogs = $index['INBOUNDBLOGS'][0]; 
    $techno_inblogs = number_format(trim($vals[$index_inblogs]['value'])); 
    $index_inlinks = $index['INBOUNDLINKS'][0]; 
    $techno_inlinks = number_format(trim($vals[$index_inlinks]['value'])); 
    $index_update = $index['LASTUPDATE'][0]; 
    $techno_update = trim($vals[$index_update]['value']); 

    
    return $techno_rank; 
} 

//get alltheweb search result count 
function alltheweb_link($sURL) 
{ 
    $url="http://www.alltheweb.com/search?cat=web&cs=utf-8&q=link%3A".urlencode($sURL)."&_sb_lang=any"; 
    $data = file_get_contents_curl($url); 
    $spl=explode("</span> of <span class=\"ofSoMany\">",$data); 
    $spl2=explode("</span>",$spl[1]); 
    $ret=trim($spl2[0]); 
    if(strlen($ret)==0) 
    { 
        return(0); 
    } 
    else 
    { 
        return($ret); 

    } 
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

//function to check whether an url is listed in DMOZ(ODP), return 1 or 0
//source http://www.noeman.org/gsm/programming/36756-dmoz-listing-checker.html 
function dmoz_listed($url) 
{ 
    $url = trim(preg_replace("('http://')", '', $url)); 
    $url = trim(preg_replace("('http')", '', $url)); 
    $dmozurl='http://search.dmoz.org/cgi-bin/search?search='.$url; 
    $data = file_get_contents_curl($dmozurl); 
    //echo "<pre>".$data."</pre>"; 
    $pos=strpos($data, 'match'); 
    if ($pos==0) { 
        return 0; 
    } else { 
        return 1; 
    } 
} 

function file_get_contents_curl($url) { 
    $ch = curl_init(); 
    curl_setopt($ch, CURLOPT_HEADER, 0); 
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); //Set curl to return the data instead of printing it to the browser. 
    curl_setopt($ch, CURLOPT_URL, $url); 
    $data = curl_exec($ch); 
    curl_close($ch); 

    return $data; 
} 
function get_yahoo_contents($url){
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_HEADER, 1);
	curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	$data = curl_exec($ch);
	curl_close($ch);
	return $data;
}
function getGooglePages($host) {
	$request = "http://www.google.com/search?q=" . urlencode("site:" . $host) . "&amp;hl=en";
	$data = getPageData($request);
	preg_match('/<div id=resultStats>(About )?([\d,]+) result/si', $data, $p);
	$value = ($p[2]) ? $p[2] : "n/a";
	$string = "<a href=\"" . $request . "\">" . $value . "</a>";
	return $string;
}
function getBingPages($host) {
	$request = "http://www.bing.com/search?q=" . urlencode("site:" . $host) . "&amp;mkt=en-US";
	$data = getPageData($request);
	preg_match('/1-([\d]+) of ([\d,]+)/si', $data, $p);
	$value = ($p[2]) ? $p[2] : "n/a";
	$string = "<a href=\"" . $request . "\" >" . $value . " </a>";
	return $string;
}
function getBingLinks($host) {
	$request = "http://www.bing.com/search?q=" . urlencode("inbody:" . $host) . "&amp;mkt=en-US";
	$data = getPageData($request);
	preg_match('/1-([\d]+) of ([\d,]+)/si', $data, $p);
	$value = ($p[2]) ? $p[2] : "n/a";
	$string = "<a href=\"" . $request . "\">" . $value . "</a>";
	return $string;
}
function getAskPages($host) {
	$request = "http://www.ask.com/web?q=" . urlencode($host . " site:" . $host);
	$data = file_get_contents_curl($request);
	preg_match('/<span id=\'indexLast\' class=\'b\'>([\d]+)<\/span> of ([\d,]+)/si', $data, $p);
	$value = ($p[2]) ? $p[2] : "n/a";
	$string = "<a href=\"" . $request . "\">" . $value . "</a>";
	return $string;
}
function getSiteAdvisorRating($domain) {
	$request = "http://www.siteadvisor.com/sites/" . $domain . "?ref=safe&amp;locale=en-US";
	$data = getPageData($request);
	preg_match('/(green|yellow|red)-xbg2\.gif/si', $data, $r);
	$value = ($r[1]) ? $r[1] : "grey";
	$string = "<a href=\"" . $request . "\">" . $value . "</a>";
	return $string;
}
function getWOTRating($domain3) {
	$domain3=str_replace('http://','',$domain3);
	$request = "http://www.mywot.com/en/scorecard/" . $domain3;
	$data = getPageData($request);
	preg_match('/<div class="reputation (\w+)/si', $data, $p);
	$value = ($p[1]) ? $p[1] : "unknown";
	$values = array("trustworthy","mostly","suspicious","untrustworthy","dangerous");
	if(!in_array($value, $values)) $value = "unknown";
	$string = "<a href=\"" . $request . "\">" . $value . "</a>";
	return $string;
}
function getDomainAge($domain) {
	$request = "http://www.who.is/whois/$domain";
	$data = getPageData($request);
	preg_match('#Creation Date: ([a-z0-9-]+)#si', $data, $p);
		if(!$p[1]) {
		$value = "Unknown";
	}
	else {
		$time = time() - strtotime($p[1]);
		$years = floor($time / 31556926);
		$days = floor(($time % 31556926) / 86400);
		if($years == "1") {
			$y= "1 year";
		}
		else {
			$y = $years . " years";
		}
		if($days == "1") {
			$d = "1 day";
		}
		else {
			$d = $days . " days";
		}
		$value = "$y, $d";
	}
	$string = "<a href=\"" . $request . "\">" . $value . "</a>";
	return $string;
}

function yahoo_listed($url) {
  $url = "http://search.yahoo.com/search/dir?p=$url";
  $data = getPageData($url);
  if (mb_ereg('No Directory Search results were found\.', $data)) {
    $value = 'Not listed';
  } else {
    $value = 'Listed';
  }
  return $value;
}

function getPageData($urlcheck) {
	if(function_exists('curl_init')) {
		$ch = curl_init($urlcheck); // initialize curl with given url
		curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']); // add useragent
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // write the response to a variable
		if((ini_get('open_basedir') == '') && (ini_get('safe_mode') == 'Off')) {
			curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // follow redirects if any
		}
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5); // max. seconds to execute
		curl_setopt($ch, CURLOPT_FAILONERROR, 1); // stop when it encounters an error
		return @curl_exec($ch);
	}
	else {
		return @file_get_contents($urlcheck);
	}
}
function webworth($domain2) 
{
echo '<a href="http://www.webworth.info/'.$domain2.'" target="_blank" rel="follow"><img src="http://www.webworth.info/'.$domain2.'/sitewidget.gif" alt="Website Value" /></a>';
}
function getworth($url) {
    $url2=str_replace("http://","",$url);
    $domain=str_replace("http://www.","",$url);
	$request = "http://www.websiteoutlook.com/".$url2;
	$data = getPageData($request);
	preg_match('/^Estimated Worth ?([\d,]+ USD by websiteoutlook/si', $data, $p);
	$value = ($p[2]) ? $p[2] : "n/a";
	$string = "<a href=\"" . $request . "\">" . $value . "</a>";
	return $string;
}


function getDomainName($host) {
	$hostparts = explode('.', $host); // split host name to parts
	$num = count($hostparts); // get parts number
	if(preg_match('/^(ac|arpa|biz|co|com|edu|gov|info|int|me|mil|mobi|museum|name|net|org|pp|tv)$/i', $hostparts[$num-2])) { // for ccTLDs like .co.uk etc.
		$domain = $hostparts[$num-3] . '.' . $hostparts[$num-2] . '.' . $hostparts[$num-1];
	}
	else {
		$domain = $hostparts[$num-2] . '.' . $hostparts[$num-1];
	}
	return $domain;
}
$urlcheck2 = ($_POST['urlcheck']) ? $_POST['urlcheck'] : $_SERVER['HTTP_HOST'];
$domain2 = getDomainName($urlcheck2);
}

function GetSiteInfo($url) {
  
  $domain=str_replace("http://","",$url);
  $request = "http://www.webvaluer.org/us/".$domain;
  $content = getPageData($request);
  
 
  preg_match("/Daily Ad Revenue(.*?)<tr>[0-9\.\,]+/is", $data, $p);
  $value = ($p[2]) ? $p[2] : "n/a";
  $string = "<a href=\"" . $request . "\">" . $value . "</a>";
  return $string;
 
 
}
?>

