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

var BROWSER_BACK = false;

var Search = new function() {
  this.ajax = null;
  this.form = null;
  this.service = '';
  this.searchText = '';
  this.hist = [];
  this.histIndex = -1;
  this.hand = [];
  
  this.init = function() {
    var self = Search;
    var enable = false;
    self.ajax = new Ajax();
    self.form = document.getElementById('searchForm');
    document.getElementById('resultsDiv').style.display = 'block';
    self.form.onsubmit = function() { return false; };
    self.hand['searchButton'] = self.submitSearch;
    self.evalSearchTextState();
    if (BROWSER_BACK) {
      self.startHist();
    }
    else {
      self.addHistoryNav();
    }
    self.enableScreenReaderFeatures();
  };
  
  this.evalSearchTextState = function() {
    var self = Search;
    var enableState = 'off';
    if(self.form.SearchText.value.length > 0) {
      enableState = 'on';
    }
    self.setButtonState(self.form.searchButton, enableState);
  };
  
  this.setButtonState = function(buttonRef, enableState) {
    var self = Search;
    if (enableState == 'on') {
      buttonRef.disabled = false;
      buttonRef.onclick = self.hand[buttonRef.id];
    }
    else {
      buttonRef.disabled = true;
      buttonRef.onclick = null;
    }
  };
  
  this.keyup = function(e) {
    var self = Search;
    e = e || window.event;
    if (e.keyCode == 13) {
      if (!self.form.searchButton.disabled) {
        self.submitSearch();
      }
    }
    else {
      self.evalSearchTextState();
    }
  };
  
  this.submitSearch = function() {
    var self = Search;
    var service = '';
    var searchText = '';
    var proxyURI = '';
    var dt = new Date();
    service = self.form.SearchService.value;
    searchText = self.form.SearchText.value;
    if (service != self.service || searchText != self.searchText) {
      self.service = service;
      self.searchText = searchText;
      self.setButtonState(self.form.searchButton, 'off');
      proxyURI = '/webservices2_proxy.php' + 
          '?search=' + escape(self.searchText) +
          '&service=' + self.service +
          '&dt=' + dt.getTime;
      document.getElementById('resultsDiv').innerHTML = 
          '<div class="resultsPaneDiv">Processing ...</div>';
      self.ajax.doGet(proxyURI, self.handleResp, 'xml');
    }
  };
  
  this.handleResp = function(xml) {
    var self = Search;
    var res = [];
    var item = '';
    var str = '';
    self.setButtonState(self.form.searchButton, 'on');
    if (!xml) {
      str += '<div class="resultsPaneDiv">' +
        '(Error or no response from the server)</div>';
    }
    else {
      switch (self.service) {
        case 'amazon':
          res = XMLParse.xml2ObjArray(xml, 'Item');
          str += self.noResultsCheck(res.length);
          for (var i = 0; i < res.length; i++) {
            item = '<div class="itemDiv">';
            item += '<div><a href="http://www.amazon.com/exec/obidos/tg/detail/-/' + res[i].ASIN + '">' + 
              res[i].ItemAttributes.Title + '</a></div>';
            if (res[i].ItemAttributes.Author) {
              item += '<div>' + res[i].ItemAttributes.Author + '</div>';
            }    
            item += '</div>';
            str += item;
          }
          break;
        case 'google':
          var resultsArr = xml.getElementsByTagName('resultElements');
          xml = resultsArr[0];
          res = XMLParse.xml2ObjArray(xml, 'item');
          str += self.noResultsCheck(res.length);
          for (var i = 0; i < res.length; i++) {
            item = '<div class="itemDiv">';
            item += '<div>';
            item += '<a href="' + res[i].URL + '">'; 
            if(res[i].title) {
              item += res[i].title;
            }
            else {
              item += res[i].URL;
            }
            item += '</a></div>';
            if (res[i].snippet) {
              item += '<div>' + res[i].snippet + '</div>';
            }
            item += '</div>';
            str += item;
          }
          break;
        case 'ebay':
          res = XMLParse.xml2ObjArray(xml, 'Item');
          str += self.noResultsCheck(res.length);
          for (var i = 0; i < res.length; i++) {
            item = '<div class="itemDiv">';
            item += '<div><a href="' + 
              res[i].ListingDetails.ViewItemURL + '">' +
              res[i].Title + '</a></div>';
            item += '<div>Started: ' + 
              res[i].ListingDetails.StartTime + '</div>';
            item += '<div>End: ' + 
              res[i].ListingDetails.EndTime + '</div>';
            item += '<div>Current Bids: ' + 
              res[i].SellingStatus.BidCount + '</div>';
            item += '<div>Current Price: ' + 
              res[i].SellingStatus.CurrentPrice + '</div>';
            item += '</div>';
            str += item;
          }
          break;
      }
    }
    str = '<div class="screenReader"><a id="searchResults" ' +
        'name="searchResults"></a>Search results for: ' + 
        self.searchText + ' on ' + self.service + '</div>' + str;
    document.getElementById('resultsDiv').innerHTML = str;
    self.updateHistory(str);
    if (self.form.ChangeAlert.checked) {
      alert('Search completed. Results are on the page ' +
        'below the search form.');
    }
  };
  
  this.noResultsCheck = function(len) {
    str = '';
    if (len == 0) {
      str = '<div class="resultsPaneDiv">(No results returned)</div>';
    }
    return str;
  };
  
  this.enableScreenReaderFeatures = function() {
    var self = Search;
    var appendDiv = document.getElementById('searchForm');
    var beforeDiv = document.getElementById('searchTypeTitleDiv');
    var msg = '';
    var readerDiv = null;
    var innerDiv = null;
    var resultsA = null;
    var changeCheck = null;
    msg = 'This Web page uses dynamic content. Page content may' +
        ' change without a page refresh. Check the following' +
        ' checkbox if you would like an alert dialog to inform' +
        ' you of page content changes.';
    readerDiv = document.createElement('div');
    readerDiv.className = 'screenReader';
    readerDiv.appendChild(document.createTextNode(msg));
    appendDiv.insertBefore(readerDiv, beforeDiv);
    readerDiv = document.createElement('div');
    readerDiv.className = 'screenReader';
    innerDiv = document.createElement('div');
    innerDiv.appendChild(
        document.createTextNode('Content Change Alert'));
    readerDiv.appendChild(innerDiv);
    innerDiv = document.createElement('div');
    changeCheck = document.createElement('input');
    changeCheck.type = 'checkbox';
    changeCheck.id = 'ChangeAlert';
    changeCheck.name = 'ChangeAlert';
    changeCheck.value = 'true';
    changeCheck.title = 'Content Change Alert';
    innerDiv.appendChild(changeCheck);
    readerDiv.appendChild(innerDiv);
    appendDiv.insertBefore(readerDiv, beforeDiv);
    appendDiv = document.getElementById('pageTopDiv');
    resultsA = document.createElement('a');
    resultsA.href = '#searchResults';
    resultsA.appendChild(document.createTextNode(
        'Skip to search results'));
    appendDiv.appendChild(resultsA);
    self.form.SearchText.onchange = self.evalSearchTextState;
    self.form.SearchText.title = 'Search Text. Enter text' +
      ' to activate Search button.';
  };
  
  this.updateHistory = function(str) {
    var self = Search;
    var maxLength = self.histIndex + 1;
    var newHist = null;
    while (self.hist.length > maxLength) {
      self.hist.pop();
    }
    newHist = new SearchHistory(self.service, self.searchText, str);
    self.hist.push(newHist);
    self.histIndex++;
    if (BROWSER_BACK) {
      self.setHash(self.histIndex);
    }
    else {
      if (self.hist.length > 1) {
        self.setButtonState(self.form.backButton, 'on');
      }
      self.setButtonState(self.form.forwardButton, 'off');
    }
  };
  
  this.goBack = function() {
    var self = Search;
    self.histIndex--;
    self.showHistory();
    if (!BROWSER_BACK) {
      self.setButtonState(self.form.forwardButton, 'on');
      if (self.histIndex == 0) {
        self.setButtonState(self.form.backButton, 'off');
      }
    }
  };
  
  this.goForward = function() {
    var self = Search;
    self.histIndex++;
    self.showHistory();
    if (!BROWSER_BACK) {
      self.setButtonState(self.form.backButton, 'on');
      if (self.histIndex == (self.hist.length - 1)) {
        self.setButtonState(self.form.forwardButton, 'off');
      }
    }
  };
  
  this.showHistory = function() {
    var self = Search;
    var currHist = null;
    var serviceElem = self.form.SearchService;
    displayHist = self.hist[self.histIndex];
    self.form.SearchText.value = displayHist.search;
    for (var i = 0; i < serviceElem.options.length; i++) {
      if (serviceElem.options[i].value == displayHist.service) {
        serviceElem.selectedIndex = i;
        break;
      }
    }
    document.getElementById('resultsDiv').innerHTML = displayHist.results;
  };
  
  this.addHistoryNav = function() {
    var self = Search;
    var searchForm = document.getElementById('searchForm');
    var historyNavDiv = document.createElement('div');
    var btn = null;
    historyNavDiv.id = 'historyNavDiv';
    btn = document.createElement('input');
    btn.type = 'button';
    btn.id = 'backButton';
    btn.name = 'backButton';
    btn.value = 'Back';
    btn.title = 'Back button for search history';
    btn.className = 'inputButtonDisabled';
    historyNavDiv.appendChild(btn);
    historyNavDiv.appendChild(
      document.createTextNode('\u00A0'));
    historyNavDiv.appendChild(
      document.createTextNode('\u00A0'));
    btn = document.createElement('input');
    btn.type = 'button';
    btn.id = 'forwardButton';
    btn.name = 'forwardButton';
    btn.value = 'Forward';
    btn.title = 'Forward button for search history';
    btn.className = 'inputButtonDisabled';
    historyNavDiv.appendChild(btn);
    searchForm.appendChild(historyNavDiv);
    self.hand['forwardButton'] = self.goForward;
    self.hand['backButton'] = self.goBack;
    self.setButtonState(self.form.forwardButton, 'off');
    self.setButtonState(self.form.backButton, 'off');
  };
  
  this.startHist = function() {
    var self = Search;
    var href = '';
    var ifr = null
    if (document.all) {
      ifr = document.createElement('iframe');
      ifr.name = 'historyFrame';
      ifr.id = 'historyFrame';
      ifr.src = '';
      ifr.style.display = 'none';
      document.body.appendChild(ifr);
    }
    if (location.hash) {
      href = location.href.split('#')[0];
      location = href;
    }
    alert(location.href);
    setInterval(self.watchHist, 100);
  };
  
  this.setHash = function(val) {
    if (val == 0) {
      location.replace('#' + val);
    }
    else {
      location = '#' + val;
    }
    if (document.all) {
      document.getElementById('historyFrame').src = 'blank.txt?' + val;
    }
  };
  
  this.watchHist = function() {
    var self = Search;
    var href = '';
    var index = 0;
    var hash = '';
    if (document.all) {
      href = frames['historyFrame'].document.location.href;
      hash = href.split('?')[1];
      if (hash) {
        hash = '#' + hash;
      }
      else {
        hash = '';
      }
      if (hash && location.hash && (hash != location.hash)) {
        location.replace(hash);
      }
    }
    if (location.hash) {
      index = parseInt(location.hash.substr(1));
    }
    else {
      index = -1;
    }
    if (index != self.histIndex) {
      self.goHistoryEntry(index);
    }
  };
  
  this.goHistoryEntry = function(val) {
    var self = Search;
    self.histIndex = val;
    self.showHistory();
  };
};

function SearchHistory(service, search, results) {
  this.service = service;
  this.search = search;
  this.results = results;
};

window.onload = Search.init;
document.onkeyup = Search.keyup;