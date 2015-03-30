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

var Blog = new function() {
  this.ajax = null;
  this.form = null;
  this.proc = 'ready'; // 'ready', 'proc' or 'done'
  this.fadeIncr = 0;
  this.statusInterval = null;
  this.isInputDisabled = false;
  this.editId = '';
  this.saveId = '';
  this.origTitle = '';
  this.origBody = '';
  
  this.init = function() {
    var self = Blog;
    self.ajax = new Ajax();
    self.form = document.getElementById('blogForm');
    self.form.newEntryButton.onclick = self.addNewEntry;
  };
  
  this.toggleEditInPlace = function(e) {
    var self = Blog;
    var elem = null;
    if(!e) {
      e = window.event;
    }
    elem = self.getSrcElem(e);
    id = elem.id.replace(/main|title|body/, '');
    if (id != 'editCancel' && !self.isInputDisabled) {
      self.editId = id;
      self.editInPlaceOn();
      self.disableEnableMainWinInput(false);
    }
    else if (id == 'editCancel') {
      if (self.editId == 'NewEntryTemp') {
        self.removeEntryDiv();
      }
      else {
        self.editInPlaceOff(false);
      }
      self.editId = '';
      self.disableEnableMainWinInput(true);
    }
  };
  
  this.getSrcElem = function(e) {
    var ret = null;
    if (e.srcElement) {
      ret = e.srcElement;
    }
    else if (e.target) {
      ret = e.target;
    }
    while (!ret.id && ret) {
      ret = ret.parentNode;
    }
    return ret;
  };
  this.editInPlaceOn = function(id) {
    var self = Blog;
    var id = self.editId;
    var entryDiv = null;
    var titleDiv = null;
    var bodyDiv = null;
    var titleInput = null;
    var bodyArea = null;
    var cancelButton = null;
    var saveButton = null;
    var leftButtonDiv = null;
    var rightButtonDiv = null;
    var clearBothDiv = null;
    entryDiv = document.getElementById('main' + id);
    titleDiv = document.getElementById('title' + id);
    bodyDiv = document.getElementById('body' + id);
    self.origTitle = titleDiv.innerHTML;
    self.origBody = bodyDiv.innerHTML;
    while(titleDiv.firstChild) {
      titleDiv.removeChild(titleDiv.firstChild);
    }
    while(bodyDiv.firstChild) {
      bodyDiv.removeChild(bodyDiv.firstChild);
    }
    titleInput = document.createElement('input');
    bodyArea = document.createElement('textarea');
    titleInput.id = 'titleText';
    titleInput.name = 'titleText';
    bodyArea.id = 'bodyText';
    bodyArea.name = 'bodyText';
    bodyArea.cols = "36";
    bodyArea.rows = "8";
    titleInput.className = 'titleInput';
    bodyArea.className = 'bodyArea';
    titleDiv.appendChild(titleInput);
    bodyDiv.appendChild(bodyArea);
    titleInput.value = self.origTitle;
    bodyArea.value = self.origBody;
    cancelButton = document.createElement('input');
    saveButton = document.createElement('input');
    leftButtonDiv = document.createElement('div');
    rightButtonDiv = document.createElement('div');
    clearBothDiv = document.createElement('div');
    leftButtonDiv.className = 'leftButton';
    rightButtonDiv.className = 'rightButton';
    clearBothDiv.className = 'clearBoth';
    clearBothDiv.style.paddingBottom = '12px';
    cancelButton.type = 'button';
    cancelButton.className = 'inputButton';
    cancelButton.id = 'editCancel';
    cancelButton.onclick = self.toggleEditInPlace;
    cancelButton.value = 'Cancel';
    saveButton.type = 'button';
    saveButton.className = 'inputButton';
    saveButton.id = 'updateSave';
    saveButton.onclick = self.doSave;
    saveButton.value = 'Save';
    entryDiv.appendChild(leftButtonDiv);
    leftButtonDiv.appendChild(cancelButton);
    entryDiv.appendChild(rightButtonDiv);
    rightButtonDiv.appendChild(saveButton);
    entryDiv.appendChild(clearBothDiv);
  };
  
  this.disableEnableMainWinInput = function(enable) {
    var self = Blog;
    var but = document.getElementById('newEntryButton');
    self.isInputDisabled = !enable;
    if (enable) {
      but.onclick = self.addNewEntry;
      but.disabled = false;
    }
    else {
      but.onclick = null;
      but.disabled = true;
    }
  };
  
  this.editInPlaceOff = function(acceptChanges) {
    var self = Blog;
    var id = self.editId;
    var allEntryDiv = null;
    var entryDiv = null;
    var titleDiv = null;
    var bodyDiv = null;
    entryDiv = document.getElementById('main' + id);
    titleDiv = document.getElementById('title' + id);
    bodyDiv = document.getElementById('body' + id);
    entryDiv.removeChild(entryDiv.lastChild);
    entryDiv.removeChild(entryDiv.lastChild);
    entryDiv.removeChild(entryDiv.lastChild);
    if (acceptChanges) {
      t = titleDiv.firstChild.value;
      b = bodyDiv.firstChild.value;
    }
    else {
      t = self.origTitle;
      b = self.origBody;
    }
    titleDiv.removeChild(titleDiv.firstChild);
    bodyDiv.removeChild(bodyDiv.firstChild);
    titleDiv.innerHTML = t;
    bodyDiv.innerHTML = b;
  };
  
  this.doSave = function() {
    var self = Blog;
    var postData = '';
    self.form.editEntryId.value = self.editId;
    postData = formData2QueryString(self.form);
    self.ajax.doPost('/blog_process.php', postData, self.handleSave);
    self.editInPlaceOff(true);
    self.proc = 'proc';
    self.startStatusAnim();
  };
  
  this.startStatusAnim = function() {
    var self = Blog;
    self.fadeIncr = 0;
    self.doStatusAnim();
    self.statusInterval = setInterval(self.doStatusAnim, 200);
  };
  
  this.doStatusAnim = function() {
    var self = Blog;
    var r = 235;
    var g = 235;
    var fadeDiv = null;
    fadeDiv = document.getElementById('main' + self.editId);
    if (self.fadeIncr < 20) {
      self.fadeIncr += 5;
    }
    else {
      if (self.proc == 'proc') {
        self.fadeIncr = 0;
      }
      else {
        self.fadeIncr = 20;
        self.stopReset();
      }
    }
    r += self.fadeIncr;
    g += self.fadeIncr;
    fadeDiv.style.background = 'rgb(' + r + ', ' + g + ', 255)';
  };
  
  this.parseYamlResult = function(str) {
    var arr = [];
    var res = [];
    var pat = /(\S+): (\S+)\n/g;
    while (arr = pat.exec(str)) {
      res[arr[1]] = arr[2];
    }
    return res;
  };
  
  this.handleSave = function(str) {
    var self = Blog;
    var res = [];
    var err = '';
    res = self.parseYamlResult(str);
    switch (res['type']) {
      case 'new':
        if (res['status'] != 'success') {
          err = 'Could not save the new entry.';
        }
        else {
          self.saveId = res['id'];
        }
        break;
      case 'edit':
        if (res['status'] != 'success') {
          err = 'Could not save changes to entry.';
        }
        break;
      default:
        err = 'Unknown error.';
        break;
    }
    self.proc = 'done';
    if (err) {
      alert(err);
    }
  };
  
  this.stopReset = function() {
    var self = Blog;
    clearInterval(self.statusInterval);
    self.disableEnableMainWinInput(true);
    self.editId = '';
    self.proc = 'ready';
    if (self.saveId) {
      self.setNewEntryRealId();
    }
  };
  
  this.addNewEntry = function() {
    var self = Blog;
    if (self.insertEntryDiv()) {
      self.editId = 'NewEntryTemp';
      self.editInPlaceOn();
      self.disableEnableMainWinInput(false);
    }
  };
  
  this.insertEntryDiv = function() {
    var self = Blog;
    var allEntryDiv = null;
    var entryFirst = null;
    var newEntryDiv = null;
    var titleDiv = null;
    var bodyDiv = null;
    allEntryDiv = document.getElementById('allEntryDiv');
    newEntryDiv = document.createElement('div');
    titleDiv = document.createElement('div');
    bodyDiv = document.createElement('div');
    newEntryDiv.id = 'mainNewEntryTemp';
    titleDiv.id = 'titleNewEntryTemp';
    bodyDiv.id = 'bodyNewEntryTemp';
    titleDiv.className = 'entryTitle';
    bodyDiv.className = 'entryBody';
    titleDiv.appendChild(document.createTextNode('New entry'));;
    bodyDiv.appendChild(document.createTextNode('Type body here ...'));
    newEntryDiv.appendChild(titleDiv);
    newEntryDiv.appendChild(bodyDiv);
    entryFirst = allEntryDiv.firstChild;
    if (entryFirst) {
      allEntryDiv.insertBefore(newEntryDiv, entryFirst);
    }
    else {
      allEntryDiv.appendChild(newEntryDiv);
    }
    return true;
  };
  
  this.removeEntryDiv = function() {
    var self = Blog;
    var allEntryDiv = document.getElementById('allEntryDiv');
    var entryDiv = document.getElementById('main' + self.editId);
    allEntryDiv.removeChild(entryDiv);
  };
  
  this.setNewEntryRealId = function() {
    var self = Blog;
    var entryDiv = null;
    var titleDiv = null;
    var bodyDiv = null;
    entryDiv = document.getElementById('mainNewEntryTemp');
    titleDiv = document.getElementById('titleNewEntryTemp');
    bodyDiv = document.getElementById('bodyNewEntryTemp');
    entryDiv.id = 'main' + self.saveId;
    titleDiv.id = 'title' + self.saveId;
    bodyDiv.id = 'body' + self.saveId;
    entryDiv.ondblclick = self.toggleEditInPlace;
    self.saveId = '';
  };
};

window.onload = Blog.init;