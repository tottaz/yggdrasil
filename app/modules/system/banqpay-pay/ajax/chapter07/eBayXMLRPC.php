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
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

require_once "HTTP/Request.php";

class eBayXMLRPC {
  
  // Instantiate XMLRPC client
  function EBayXMLRPC($useProd = false) {
    $this->useProd = $useProd;
    // Production or Sandbox
    if ($this->useProd) {
      $this->uri = 'https://api.ebay.com/ws/api.dll';
    }
    else {
      $this->uri = 'https://api.sandbox.ebay.com/ws/api.dll';
    }
    // Create request object for client
    $this->req =& new HTTP_Request($this->uri);
  }
  
  // Set EBay-specific headers including access keys and API call
  function createSession($key, $callName) {
  
    $this->req->addHeader('X-EBAY-API-COMPATIBILITY-LEVEL', '433'); 
    $this->req->addHeader('X-EBAY-API-SESSION-CERTIFICATE', 
      $key['devID'].';'.$key['appID'].';'.$key['certID']);
    $this->req->addHeader('X-EBAY-API-DEV-NAME', $key['devID']);
    $this->req->addHeader('X-EBAY-API-APP-NAME', $key['appID']);
    $this->req->addHeader('X-EBAY-API-CERT-NAME', $key['certID']);
    $this->req->addHeader('X-EBAY-API-CALL-NAME', $callName);
    // 0 = US, 3 = UK, 2 = Canada, 15 = Australia
    $this->req->addHeader('X-EBAY-API-SITEID', '0');
  }
  
  // Create XML doc for request and POST it
  function GetSearchResults($userToken, $searchText) {
  
    $postData .= '<?xml version="1.0" encoding="utf-8"?>'.chr(10).
      '<GetSearchResultsRequest '.
      'xmlns="urn:ebay:apis:eBLBaseComponents">'.
      '<RequesterCredentials>'.
      '<eBayAuthToken>'.$userToken.'</eBayAuthToken>'.
      '</RequesterCredentials>'.
      '<Query>'.$searchText.'</Query>'.
      '</GetSearchResultsRequest>';
    return $this->doReq($postData);
  }
  
  // Do the POST
  function doReq($postData) {
  
    // Set some needed headers
    $this->req->addHeader('Content-Type', 'text/xml');
    $this->req->setMethod(HTTP_REQUEST_METHOD_POST);
    // Add the XML data POST payload
    $this->req->addRawPostData($postData, true);
    // Send the request
    $result = $this->req->sendRequest();
    if (PEAR::isError($result)) {
      die($result->getMessage());
    }
    else {
      $body = $this->req->getResponseBody();
      $code = $this->req->getResponseCode();
      if ($code > 199 && $code < 300) {
        if (!$body) {
          die('No response XML from server');
        }
        else {
          return $body;
        }
      }
      else {
        die('Error sending request (error code '.$code.')');
      }
    }
  }
}

?>