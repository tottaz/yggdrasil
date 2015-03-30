/*
* ***** BEGIN LICENSE BLOCK *****
* Version: MPL 1.1
*
* The contents of this file are subject to the Mozilla Public
* License Version 1.1 ("License"); you may not use this file except in
* compliance with the License. You may obtain a copy of the License at
* http://www.zimbra.com/license
*
* Software distributed under the License is distributed on an "AS IS"
* basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
* the License for the specific language governing rights and limitations
* under the License.
*
* The Original Code is: Zimbra AJAX Toolkit.
*
* The Initial Developer of the Original Code is Zimbra, Inc.
* Portions created by Zimbra are Copyright (C) 2005 Zimbra, Inc.
* All Rights Reserved.
*
* Contributor(s):
*
* ***** END LICENSE BLOCK *****
*/


/**
* Resets the AjxPost object.
* @constructor
* @class
* This singleton class makes an HTTP POST to the server and receives the response, passing returned data
* to a callback. This class is used to upload files from the client browser to the server using the file
* upload feature of POST.
*
* @author Conrad Damon
*/
function AjxPost(iframeId) {
	this._callback = null;
	this._iframeId = iframeId;
}


// Globals

AjxPost._reqIds = 0;
AjxPost._outStandingRequests = new Object();


// Consts 

// Common HttpServletResponse error codes
// - see full list: http://java.sun.com/products/servlet/2.2/javadoc/javax/servlet/http/HttpServletResponse.html
AjxPost.SC_CONTINUE					= 100;
AjxPost.SC_OK						= 200;
AjxPost.SC_ACCEPTED 				= 202;
AjxPost.SC_BAD_REQUEST				= 400;
AjxPost.SC_UNAUTHORIZED				= 401;
AjxPost.SC_REQUEST_TIMEOUT			= 408;
AjxPost.SC_CONFLICT					= 409;
AjxPost.SC_REQUEST_ENTITY_TOO_LARGE = 413;
AjxPost.SC_INTERNAL_SERVER_ERROR	= 500;
AjxPost.SC_BAD_GATEWAY 				= 502;
AjxPost.SC_SERVICE_UNAVAILABLE		= 503;


// Public methods

/**
* Submits the form.
*
* @param callback		function to return to after the HTTP response is received
* @param formId			DOM ID of the form
*/
AjxPost.prototype.execute =
function(callback, form, optionalTimeout) {
	form.target = this._iframeId;
	this._callback = callback;
	var req = new AjxPostRequest(form);
	var failureAction = new AjxTimedAction(this, this._onFailure, [req.id]);
	var timeout = optionalTimeout? optionalTimeout: 5000;
	AjxPost._outStandingRequests[req.id] = req;
	req.send(failureAction, timeout);
};


// Private methods

AjxPost.prototype._onFailure =
function (reqId){
	var req = AjxPost._outStandingRequests[reqId];
	req.cancel();
	delete AjxPost._outStandingRequests[reqId];
	if (this._callback) {
		this._callback.run([404]);
		this._callback = null;
	}
};



/**
* Processes the HTTP response from the form post. The server needs to make sure this function is
* called and passed the appropriate args. Something like the following should do the trick:
* <code>
*        out.println("<html><head></head><body onload=\"window.parent._uploadManager.loaded(" + results +");\"></body></html>");
* </code>
*
* @param status		an HTTP status
* @param id			the id for any attachments that were uploaded
*/
AjxPost.prototype.loaded =
function(status, reqId, id) {
	//alert(document.getElementById(this._iframeId).contentWindow.document.documentElement.innerHTML);
	var req = AjxPost._outStandingRequests[reqId];
	if (req && !req.hasBeenCancelled()) {
		req.cancelTimeout();
	}
	delete AjxPost._outStandingRequests[reqId];
	if (this._callback) {
		this._callback.run(status, id);
		this._callback = null;
	}
};

function AjxPostRequest (form) {
	this.id = AjxPost._reqIds++;
	this._cancelled = false;
	this._form = form;
	var inp = form.elements.namedItem("requestId");
	if (!inp) {
		inp = form.ownerDocument.createElement('input');
		inp.type = "hidden";
		inp.name = "requestId";
	}
	inp.value = this.id;
	form.appendChild(inp);
};

AjxPostRequest.prototype.send =
function(failureAction, timeout) {
	this._form.submit();
};

AjxPostRequest.prototype.hasBeenCancelled =
function() {
	return this._cancelled;
};

AjxPostRequest.prototype.cancelTimeout =
function() {
	AjxTimedAction.cancelAction(this._timeoutId);
};

AjxPostRequest.prototype.cancel =
function() {
	this._cancelled = true;
};
