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
$loginId = $_POST['LoginId'];
$password = $_POST['Pass'];
$respType = '';
$respMsg = '';
$separator = ',';
sleep(3);
if ($loginId == 'user' && $password == 'password') {
  setcookie('userId', 12345);
  $respType = 'success';
  $respMsg = '/appmainpage.php';
}
else {
  $respType = 'error';
  $respMsg = 'Could not verify your login information.';
}
header('Content-Type: text/plain');
print $respType;
print $separator;
print $respMsg;
?>