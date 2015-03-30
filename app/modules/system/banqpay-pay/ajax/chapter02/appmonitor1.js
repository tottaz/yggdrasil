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

var start = 0;
var ajax = new Ajax();

var doPoll = function() {
  start = new Date();
  start = start.getTime();
  ajax.doGet('/fakeserver.php?start=' + start, showPoll);
}

window.onload = doPoll;

var showPoll = function(str) {
  var pollResult = '';
  var diff = 0;
  var end = new Date();
  if (str == 'ok') {
    end = end.getTime();
    diff = (end - start)/1000;
    pollResult = 'Server response time: ' + diff + ' seconds';
  }
  else {
    pollResult = 'Request failed.';
  }
  printResult(pollResult);
  var pollHand = setTimeout(doPoll, 15000);
}

function printResult(str) {
  var pollDiv = document.getElementById('pollDiv');
  if (pollDiv.firstChild) {
    pollDiv.removeChild(pollDiv.firstChild);
  }
  pollDiv.appendChild(document.createTextNode(str));
}