<?php

    $keydata = fetchUrl("http://www.banqpay.com/pubkey.php?link=10&merchant_id=105&type=php");
    if ($keydata == FALSE) {
        return FALSE;
    } else {
        list($key) = explode('<secret>', $keydata);
        $pubkey = array('keysize' => intval($keysize), 'e' => $e, 'n' => $n);
        return $pubkey;
    }
    
function fetchUrl($url)
   {
   // Set maximum number of seconds (can have floating-point) to wait for feed before displaying page without feed
   $numberOfSeconds=4;   

   // Suppress error reporting so Web site visitors are unaware if the feed fails
   error_reporting(0);

   // Extract resource path and domain from URL ready for fsockopen

   $url = str_replace("http://","",$url);
   $urlComponents = explode("/",$url);
   $domain = $urlComponents[0];
   $resourcePath = str_replace($domain,"",$url);

   // Establish a connection
   $socketConnection = fsockopen($domain, 80, $errno, $errstr, $numberOfSeconds);

   if (!$socketConnection) {
       // You may wish to remove the following debugging line on a live Web site
       print("<!-- Network error: $errstr ($errno) -->");
   }    // end if
   else    {
       $xml = '';
       fputs($socketConnection, "GET /$resourcePath HTTP/1.0\r\nHost: $domain\r\n\r\n");
  
       // Loop until end of file
       while (!feof($socketConnection))
           {
           $xml .= fgets($socketConnection, 128);
           }    // end while

       fclose ($socketConnection);

       }    // end else

   return($xml);
   }    // end function
?>