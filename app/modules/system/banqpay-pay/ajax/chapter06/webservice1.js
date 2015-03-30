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

var SEARCH_TERMS = ['ajax', 'postgresql', 'ruby programming',
    'php', 'javascript'];
var ACCESS_KEY = ''; // supply your own Amazon Access Key ID

var Client = new function() {
  this.SEARCH_TERMS = null;
  this.ACCESS_KEY = null;
  this.ajax = null;
  this.incr = 0;
  this.containerDiv = null;
  this.currDiv = null;
  this.newDiv = null;
  this.slideInterval = null;
  this.slideIncr = 380;
  
  this.init = function() {
    var self = Client;
    self.ajax = new Ajax();
    self.containerDiv = document.getElementById('containerDiv');
    self.SEARCH_TERMS = SEARCH_TERMS;
    self.ACCESS_KEY = ACCESS_KEY;
    if (!self.ACCESS_KEY) {
      alert('Amazon Web Services Access Key ID is not set. ' +
        'This code will not work without a key.\n' +
        'Sign up for a free key at http://www.amazon.com/aws/.');
    }
    else {
      self.doLookup();
    }
  };
  
  this.doLookup = function() {
    var self = Client;
    var searchStr = '';
    var uri = '';
    var dt = new Date();
    searchStr = self.getSearchItem();
    uri = '/ecs_proxy.php?key=' + escape(self.ACCESS_KEY) +
        '&search=' + escape(searchStr) +
        '&d=' + escape(dt.getTime());
    self.ajax.doGet(uri, self.handleResp, 'xml');
  };
  this.doLookupDelay = function() {
    var self = Client;
    setTimeout(self.doLookup, 10000);
  };
  
  this.getSearchItem = function() {
    var self = Client;
    var str = self.SEARCH_TERMS[self.incr];
    self.incr++;
    if (self.incr >= self.SEARCH_TERMS.length) {
      self.incr = 0;
    }
    return str;
  };
  
  this.handleResp = function(xml) {
    var self = Client;
    var res = [];
    var mainDiv = document.getElementById('mainDiv');
    var resultsDiv = null;
    var itemDiv = null;
    var imageDiv = null;
    var titleDiv = null;
    var authorDiv = null;
    var clearBoth = null;
    var im = '';
    var ti = '';
    var au = '';
    var bookImg = null;
    res = XMLParse.xml2ObjArray(xml, 'Item');
    resultsDiv = document.createElement('div');
    resultsDiv.className = 'resultsDiv';
    for (var i = 0; i < res.length; i++) {
      itemDiv = document.createElement('div');
      imageDiv = document.createElement('div');
      titleDiv = document.createElement('div');
      authorDiv = document.createElement('div');
      clearBoth = document.createElement('div');
      itemDiv.className = 'itemDiv';
      imageDiv.className = 'imageDiv';
      titleDiv.className = 'titleDiv';
      authorDiv.className = 'authorDiv';
      clearBoth.className = 'clearBoth';
      as = res[i].ASIN;
      ti = res[i].ItemAttributes.Title;
      au = res[i].ItemAttributes.Author;
      bookImg = document.createElement('img');
      bookImg.src = 'http://images.amazon.com/images/P/' + as +
          '.01.THUMBZZZ.jpg';
      imageDiv.appendChild(bookImg);
      titleDiv.appendChild(document.createTextNode(ti));
      authorDiv.appendChild(document.createTextNode(au));
      itemDiv.appendChild(imageDiv);
      itemDiv.appendChild(titleDiv);
      itemDiv.appendChild(authorDiv);
      itemDiv.appendChild(clearBoth);
      resultsDiv.appendChild(itemDiv);
    }
    if (!self.currDiv) {
      self.containerDiv.appendChild(resultsDiv);
      self.currDiv = resultsDiv;
      self.doLookupDelay();
    }
    else {
      self.newDiv = resultsDiv;
      self.slideAndHide();
    }
  };
  
  this.slideAndHide = function(elem) {
    var self = Client;
    self.newDiv.style.left = '380px';
    self.containerDiv.appendChild(self.newDiv);
    self.slideInterval = setInterval(self.doSlide, 50);
  };
  
  this.doSlide = function() {
    var self = Client;
    if (self.slideIncr > 0) {
      self.slideIncr -= 10;
      self.newDiv.style.left = self.slideIncr + 'px';
      self.currDiv.style.left = (self.slideIncr - 380) + 'px';
    }
    else {
      self.slideIncr = 380;
      self.containerDiv.removeChild(self.containerDiv.firstChild);
      self.currDiv = self.containerDiv.firstChild;
      clearInterval(self.slideInterval);
      self.doLookupDelay();
    }
  };
};

window.onload = Client.init;