<?php
/*
 * Copyright 2006 SitePoint Pty. Ltd, www.sitepoint.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS;
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

require_once "HTTP/Request.php";
$searchText = $_REQUEST["search"];
$service = $_REQUEST["service"];
$uri = "";
$key = null;
$userToken = "";
$xml = "";
switch ($service) {
  case "amazon":
    $key = "";  // supply your own Amazon Access Key ID
    $uri = "http://webservices.amazon.com/onca/xml".
      "?Service=AWSECommerceService" .
      "&AWSAccessKeyId=" . urlencode($key) .
      "&Operation=ItemSearch" .
      "&SearchIndex=Books" .
      "&Keywords=" . urlencode($searchText) .
      "&Sort=relevancerank";
    $req =& new HTTP_Request($uri);
    $result = $req->sendRequest();
    if (PEAR::isError($result)) {
      die($result->getMessage());
    }
    else {
      $xml = $req->getResponseBody();
    }
    break;
  case "google":
    $wsdlURI = "http://api.google.com/GoogleSearch.wsdl"; 
    $key = ""; // supply your own Google Web APIs License Key
    if (extension_loaded("soap")) {
      $soapClient = new SoapClient($wsdlURI, array("trace" => 1));
      $result = $soapClient->doGoogleSearch($key, $searchText, 0, 10, false, "", false, "", "latin", "latin");
      if (is_soap_fault($result)) {
         trigger_error("SOAP Fault: (faultcode: {$result->faultcode}, 
          faultstring: {$result->faultstring})", E_ERROR);
      }
      else {
        $xml = $soapClient->__getLastResponse();
      }
    }
    else {
      require_once "SOAP/Client.php";
      $wsdl = new SOAP_WSDL($wsdlURI);
      $soapClient = $wsdl->getProxy();
      $result = $soapClient->doGoogleSearch($key, $searchText, 0, 10, false, "", false, "", "latin", "latin");
      if (PEAR::isError($result)) {
        die($result->getMessage());
      }
      else {
        $xml = $soapClient->xml;
      }
    }
    break;
  case "ebay":
    require_once "eBayXMLRPC.php";
    // supply your own eBay Developer Keys
    $key["devID"] = "";
    $key["appID"] = "";
    $key["certID"] = "";
    $userToken = "";
    $xmlRPC = new eBayXMLRPC();
    $xmlRPC->createSession($key, "GetSearchResults");
    $xml = $xmlRPC->GetSearchResults($userToken, $searchText);
    break;
}
header("Content-Type: text/xml");
print($xml);
?>