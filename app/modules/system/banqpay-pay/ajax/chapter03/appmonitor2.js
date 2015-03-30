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

var Status = new function() {
  this.currOpacity = 100;
  this.proc = 'done'; // 'proc', 'done' or 'abort'
  this.procInterval = null;
  this.div = null;
  
  this.init = function() {
    var self = Status;
    self.div = document.getElementById('requestStatusDiv');
    self.setAlpha();
  };
  
  this.startProc = function() {
    var self = Status;
    self.proc = 'proc';
    if (self.setDisplay(false)) {
      self.currOpacity = 100;
      self.displayOpacity();
      self.procInterval = setInterval(self.doProc, 90);
    }
  };
  
  this.stopProc = function(done) {
    var self = Status;
    if (done) {
      self.proc = 'done';
    }
    else {
      self.proc = 'abort';
    }
  };
  
  this.cleanup = function() {
    Status.div = null;
  };
  
  this.displayOpacity = function() {
    var self = Status;
    var decOpac = self.currOpacity / 100;
    if (document.all && typeof window.opera == 'undefined') {
      self.div.filters.alpha.opacity = self.currOpacity;
    }
    else {
      self.div.style.MozOpacity = decOpac;
    }
    self.div.style.opacity = decOpac;
  };
  
  this.setAlpha = function() {
    var self = Status;
    if (document.all && typeof window.opera == 'undefined') {
      var styleSheets = document.styleSheets;
      for (var i = 0; i < styleSheets.length; i++) {
        var rules = styleSheets[i].rules;
        for (var j = 0; j < rules.length; j++) {
          if (rules[j].selectorText == '#requestStatusDiv') {
            rules[j].style.filter = 'alpha(opacity = 100)';
            return true;
          }
        }
      }
    }
    return false;
  };
  
  this.setDisplay = function(done) {
    var self = Status;
    var msg = '';
    if (done) {
      msg = 'Done';
      self.div.className = 'done';
    }
    else {
      msg = 'Processing...';
      self.div.className = 'processing';
    }
    if (self.div.firstChild) {
      self.div.removeChild(self.div.firstChild);
    }
    self.div.appendChild(document.createTextNode(msg));
    return true;
  };
  
  this.doProc = function() {
    var self = Status;
    if (self.currOpacity == 0) {
      if (self.proc == 'proc') {
        self.currOpacity = 100;
      }
      else {
        clearInterval(self.procInterval);
        if (self.proc == 'done') {
          self.startDone();
        }
        return false;
      }
    }
    self.currOpacity = self.currOpacity - 10;
    self.displayOpacity();
  };
  
  this.startDone = function() {
    var self = Status;
    if (self.setDisplay(true)) {
      self.currOpacity = 100;
      self.displayOpacity();
      self.procInterval = setInterval(self.doDone, 90);
    }
  };
  
  this.doDone = function() {
    var self = Status;
    if (self.currOpacity == 0) {
      clearInterval(self.procInterval);
    }
    self.currOpacity = self.currOpacity - 10;
    self.displayOpacity();
  };
};

var Monitor = new function() {
  this.targetURL = null;
  this.pollInterval = null;
  this.maxPollEntries = null;
  this.timeoutThreshold = null;
  this.ajax = new Ajax();
  this.start = 0; // Start time of the request
  this.pollArray = []; // Array of response times
  this.pollHand = null; // Interval ID for poll process
  this.timeoutHand = null; // Interval ID for timeout watcher
  this.reqStatus = Status; // Status obj for status animations
  
  this.init = function() {
    var self = Monitor;
    self.targetURL = TARGET_URL;
    self.pollInterval = POLL_INTERVAL;
    self.maxPollEntries = MAX_POLL_ENTRIES;
    self.timeoutThreshold = TIMEOUT_THRESHOLD;
    self.toggleAppStatus(true);
    self.reqStatus.init();
  };
  
  this.toggleAppStatus = function(stopped) {
    var self = Monitor;
    self.toggleButton(stopped);
    self.toggleStatusMessage(stopped);
  };
  
  this.toggleButton = function(stopped) {
    var self = Monitor;
    var buttonDiv = document.getElementById('buttonDiv');
    var but = document.createElement('input');
    but.type = 'button';
    but.className = 'inputButton';
    if (stopped) {
      but.value = 'Start';
      but.onclick = self.pollServerStart;
    }
    else {
      but.value = 'Stop'
      but.onclick = self.pollServerStop;
    }
    if (buttonDiv.firstChild) {
      buttonDiv.removeChild(buttonDiv.firstChild);
    }
    buttonDiv.appendChild(but);
    buttonDiv = null;
  };
  
  this.toggleStatusMessage = function(stopped) {
    var statSpan = document.getElementById('appCurrStatus');
    var msg;
    if(stopped) {
      msg = 'Stopped';
    }
    else {
      msg = 'Running';
    }
    if (statSpan.firstChild) {
      statSpan.removeChild(statSpan.firstChild);
    }
    statSpan.appendChild(document.createTextNode(msg));
  };
  
  this.pollServerStart = function() {
    var self = Monitor;
    self.doPoll();
    self.toggleAppStatus(false);
  };
  
  this.pollServerStop = function() {
    var self = Monitor;
    if (self.stopPoll()) {
      self.toggleAppStatus(true);
    }
    self.reqStatus.stopProc(false);
  };
  
  this.doPoll = function() {
    var self = Monitor;
    var url = self.targetURL;
    var start = new Date();
    self.reqStatus.startProc();
    self.start = start.getTime();
    self.ajax.doGet(self.targetURL + '?start=' + self.start, self.showPoll);
    self.timeoutHand = setTimeout(self.handleTimeout, self.timeoutThreshold * 1000);
  };
  
  this.showPoll = function(str) {
    var self = Monitor;
    var diff = 0;
    var end = new Date();
    clearTimeout(self.timeoutHand);
    self.reqStatus.stopProc(true);
    if (str == 'ok') {
      end = end.getTime();
      diff = (end - self.start)/1000;
    }
    if (self.updatePollArray(diff)) {
      self.printResult();
    }
    self.doPollDelay();
  };
	
	this.doPollDelay = function() {
    var self = Monitor;
    self.pollHand = setTimeout(self.doPoll, self.pollInterval * 1000);
  };
  
  this.handleTimeout = function() {
    var self = Monitor;
    if (self.stopPoll()) {
      self.reqStatus.stopProc(true);
      if (self.updatePollArray(0)) {
        self.printResult();
      }
      self.doPollDelay();
    }
  };
  
  this.updatePollArray = function(pollResult) {
    var self = Monitor;
    self.pollArray.unshift(pollResult);
    if (self.pollArray.length > self.maxPollEntries) {
      self.pollArray.pop();
    }
    return true;
  };
  
  this.printResult = function() {
    var self = Monitor;
    var polls = self.pollArray;
    var pollDiv = document.getElementById('pollDiv');
    var entryDiv = null;
    var messageDiv = null;
    var barDiv = null;
    var clearAll = null;
    var msgStr = '';
    var txtNode = null;
    while (pollDiv.firstChild) {
      pollDiv.removeChild(pollDiv.firstChild);
    }
    for (var i = 0; i < polls.length; i++) {
      if (polls[i] == 0) {
        msgStr = '(Timeout)';
      }
      else {
        msgStr = polls[i] + ' sec.';
      }
      entryDiv = document.createElement('div');
      messageDiv = document.createElement('div');
      barDiv = document.createElement('div');
      clearAll = document.createElement('br');
      entryDiv.className = 'entryDiv';
      messageDiv.className = 'messageDiv';
      barDiv.className = 'barDiv';
      clearAll.className = 'clearAll';
      if (polls[i] == 0) {
        messageDiv.style.color = '#933';
      }
      else {
        messageDiv.style.color = '#339';
      }
      barDiv.style.width = (parseInt(polls[i]*20)) + 'px';
      messageDiv.appendChild(document.createTextNode(msgStr));
      barDiv.appendChild(document.createTextNode('\u00A0'));
      entryDiv.appendChild(messageDiv);
      entryDiv.appendChild(barDiv);
      entryDiv.appendChild(clearAll);
      pollDiv.appendChild(entryDiv);
    }
  };
  
  this.stopPoll = function() {
    var self = Monitor;
    clearTimeout(self.pollHand);
    if (self.ajax) {
      self.ajax.abort();
    }
    clearTimeout(self.timeoutHand);
    return true;
  };
	
	this.cleanup = function() {
    var self = Monitor;
    self.reqStatus.cleanup();
    self.reqStatus = null;
  };
};

window.onload = Monitor.init;
window.onunload = Monitor.cleanup;