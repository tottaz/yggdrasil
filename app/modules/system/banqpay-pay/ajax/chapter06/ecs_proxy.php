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
$uri = "http://webservices.amazon.com/onca/xml" .
    "?Service=AWSECommerceService" .
    "&AWSAccessKeyId=" . urlencode($_REQUEST["key"]) .
    "&Operation=ItemSearch" .
    "&SearchIndex=Books" .
    "&Keywords=" . urlencode($_REQUEST["search"]) .
    "&Sort=relevancerank";
$req =& new HTTP_Request($uri);
if (!PEAR::isError($req->sendRequest())) {
  header("Content-Type: text/xml");
  print $req->getResponseBody();
}
?>