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

var Login = new function() {  
  this.ajax = null;
  this.form = null;
  this.promptDiv = null;
  this.dotSpan = null;
  this.button = null;
  this.enabled = true;
  this.dots = '';
  this.promptInterval = null;
  
  this.cleanup = function() {
    var self = Login;
    self.form = null;
    self.promptDiv = null;
    self.dotSpan = null;
    self.button = null;
  };
  
  this.init = function() {
    var self = Login;
    self.ajax = new Ajax();
    self.form = document.getElementById('loginForm');
    self.promptDiv = document.getElementById('promptDiv');
    self.dotSpan = document.getElementById('dotSpan');
    self.button = document.getElementById('submitButton');
    self.setPrompt('base', 'Enter a login ID and password, and click the Submit button.');
    self.form.LoginId.focus();
    self.toggleEnabled(false);
    self.form.onsubmit = function() { return false; }
    self.clearCookie('userId');
    self.enableScreenReaderFeatures();
  };
  
  this.clearCookie = function(name) {
    var expireDate = new Date(0);
    document.cookie = name + '=; expires=' + expireDate.toGMTString() + '; path=/';
  };
  
  this.setPrompt = function(stat, msg) {
    var self = Login;
    var promptDiv = self.promptDiv;
    var msgSpan = document.getElementById('msgSpan');
    var statusClass = '';
    promptDiv.className = stat + 'Prompt'; // 'base', 'proc' or 'err'
    if (msgSpan.firstChild) {
      msgSpan.removeChild(msgSpan.firstChild);
    }
    msgSpan.appendChild(document.createTextNode(msg));
  };
  
  this.keyup = function(e) {
    var self = Login;
    if (!e) {
      e = window.event;
    }
    if (e.keyCode != 13) {
      self.evalFormFieldState();
    }
    else {
      if (self.enabled) {
        self.submitData();
      }
    }
  };
  
  this.evalFormFieldState = function() {
    var self = Login;
    if (self.form.LoginId.value.length > 0 && self.form.Pass.value.length > 0) {
      self.toggleEnabled(true);
    }
    else {
      self.toggleEnabled(false);
    }
  };
  
  this.toggleEnabled = function(able) {
    var self = Login;
    if (able) {
      self.button.onclick = self.submitData;
      self.button.disabled = false;
      self.button.className = 'inputButtonActive';
      self.enabled = true;
    }
    else {
      self.button.onclick = null;
      self.button.disabled = true;
      self.button.className = 'inputButtonDisabled';
      self.enabled = false;
    }
  };
  
  this.submitData = function() {
    var self = Login;
    var postData = '';
    postData = formData2QueryString(self.form);
    self.ajax.doPost('/applogin.php', postData, self.handleLoginResp);
    self.showStatusPrompt();
    self.toggleEnabled(false);
  };
	
	this.showStatusPrompt = function() {
    var self = Login;
    self.dots = '';
    self.setPrompt('proc', 'Processing');
    self.promptInterval = setInterval(self.showStatusDots, 200);
  };
	
	this.showStatusDots = function() {
    var self = Login;
    var dotSpan = self.dotSpan;
    self.dots += '.';
    if (self.dots.length > 4) {
      self.dots = '';
    }
    if (dotSpan.firstChild) {
      dotSpan.removeChild(dotSpan.firstChild);
    }
    dotSpan.appendChild(document.createTextNode(' ' + self.dots));
  };
  
  this.handleLoginResp = function(str) {
    var self = Login;
    var respArr = str.split(',');
    var respType = respArr[0].toLowerCase();
    var respMsg = respArr[1];
    if (respType == 'success') {
      location = respMsg;
    }
    else {
      self.showErrorPrompt(respMsg);
    }
  };
  
  this.showErrorPrompt = function(str) {
    var self = Login;
    var dotSpan = self.dotSpan;
    clearInterval(self.promptInterval);
    if (dotSpan.firstChild) {
      dotSpan.removeChild(dotSpan.firstChild);
    }
    self.setPrompt('err', str);
    self.form.Pass.value = '';
    if (self.form.ChangeAlert.checked) {
      alert('Error. ' + str);
    }
  };
  
this.enableScreenReaderFeatures = function() {
  var self = Login;
  var fieldDiv = document.getElementById('fieldDiv');
  var msgDiv = null;
  var checkboxDiv = null;
  var label = null;
  var checkbox = null;
  var msg = 'This web page uses dynamic content. Page content' +
    ' may change without a page refresh. Check the following' +
    ' checkbox if you would like an alert dialog to inform' +
    ' you of page content changes.';
  msgDiv = document.createElement('div');
  msgDiv.className = 'readerText';
  msgDiv.appendChild(document.createTextNode(msg));
  self.form.insertBefore(msgDiv, fieldDiv);
  checkboxDiv = document.createElement('div');
  checkboxDiv.className = 'readerText';
  label = document.createElement('label');
  label.appendChild(document.createTextNode('Content Change Alert'));
  checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'ChangeAlert';
  checkbox.name = 'ChangeAlert';
  checkbox.value = 'true';
  checkbox.title = 'Content Change Alert';
  label.appendChild(checkbox);
  checkboxDiv.appendChild(label);
  self.form.insertBefore(checkboxDiv, fieldDiv);
    self.form.Pass.onchange = self.evalFormFieldState;
    self.form.Pass.title = 'Password. Enter text to activate the Submit button.';
  };
};


window.onunload = Login.cleanup;
window.onload = Login.init;
document.onkeyup = Login.keyup;