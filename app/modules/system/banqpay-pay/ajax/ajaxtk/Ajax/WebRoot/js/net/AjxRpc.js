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


function AjxRpc() {
};

// pool of RPC contexts
AjxRpc._rpcCache = [];

AjxRpc._RPC_CACHE_MAX = 100;	// maximum number of busy contexts we can have
AjxRpc._RPC_REAP_COUNT = 5;		// run reaper when number of busy contexts is multiple of this
AjxRpc._RPC_REAP_AGE = 300000;	// mark any context older than this (in ms) as free

/**
* Submits a request to a URL. The request is handled through a pool of request
* contexts (each a wrapped XmlHttpRequest). The context does the real work.
*
* @param requestStr		[string]		HTTP request string/document
* @param serverUrl		[string]		request target
* @param requestHeaders	[Array]			HTTP request headers
* @param callback		[AjxCallback]	callback (for async requests)
* @param useGet			[boolean]		if true use get method, else use post
*/
AjxRpc.invoke =
function(requestStr, serverUrl, requestHeaders, callback, useGet) {

	var asyncMode = (callback != null);
	var rpcCtxt = AjxRpc._getFreeRpcCtxt();

	try {
	 	var response = rpcCtxt.req.invoke(requestStr, serverUrl, requestHeaders, callback, useGet);
	} catch (ex) {
		var newEx = new AjxException();
		newEx.method = "AjxRpc.prototype._invoke";
		if (ex instanceof Error) {
			newEx.detail = ex.message;
			newEx.code = AjxException.NETWORK_ERROR;
			newEx.msg = "Network error";
		} else {
			newEx.detail = ex.toString();
			newEx.code = AjxException.UNKNOWN_ERROR;
			newEx.msg = "Unknown Error";
		}
		if (!asyncMode)		
			rpcCtxt.busy = false;
		throw newEx;
	}
	if (!asyncMode)
		rpcCtxt.busy = false;

	return response;
};

/*
* Factory method for getting context objects.
*/
AjxRpc._getFreeRpcCtxt = 
function() {

	var rpcCtxt = null;
	
	// See if we have one in the pool that's now free
	for (var i = 0; i < AjxRpc._rpcCache.length; i++) {
		rpcCtxt = AjxRpc._rpcCache[i];
		if (!rpcCtxt.busy) {
			DBG.println(AjxDebug.DBG1, "Found free RPC context: " + rpcCtxt.id);
			break;
		}
	}
	
	// If there's no free context available, create one
	if (i == AjxRpc._rpcCache.length) {
		if (AjxRpc._rpcCache.length == AjxRpc._RPC_CACHE_MAX) {
			DBG.println(AjxDebug.DBG1, "Out of RPC contexts");
			throw new AjxException("Out of RPC cache", AjxException.OUT_OF_RPC_CACHE, "ZmCsfeCommand._getFreeRpcCtxt");
		} else if (i > 0 && (i % AjxRpc._RPC_REAP_COUNT == 0)) {
			DBG.println(AjxDebug.DBG1, i + " busy RPC contexts");
			AjxRpc._reap();
		}
		var id = "_rpcCtxt_" + i;
		rpcCtxt = new _RpcCtxt(id);
		DBG.println(AjxDebug.DBG1, "Created RPC " + id);
		AjxRpc._rpcCache.push(rpcCtxt);
	}
	rpcCtxt.busy = true;
	rpcCtxt.timestamp = (new Date()).getTime();
	return rpcCtxt;
};

/**
* Returns the request from the RPC context with the given ID.
*
* @param id		[string]	RPC context ID
*/
AjxRpc.getRpcRequest = 
function(id) {
	for (var i = 0; i < AjxRpc._rpcCache.length; i++) {
		var rpcCtxt = AjxRpc._rpcCache[i];
		if (rpcCtxt.id == id)
			return rpcCtxt.req;
	}
	return null;
};

/*
* Frees up busy contexts that are older than a certain age.
*/
AjxRpc._reap =
function() {
	var time = (new Date()).getTime();
	for (var i = 0; i < AjxRpc._rpcCache.length; i++) {
		var rpcCtxt = AjxRpc._rpcCache[i];
		if (rpcCtxt.timestamp + AjxRpc._RPC_REAP_AGE < time) {
			DBG.println(AjxDebug.DBG1, "AjxRpc._reap: cleared RPC context " + rpcCtxt.id);
			rpcCtxt.req.cancel();
			rpcCtxt.busy = false;
		}
	}

};

/**
* Wrapper for a request context.
*
* @param id		unique ID for this context
*/
function _RpcCtxt(id) {
	this.id = id;
	this.req = new AjxRpcRequest(id, this);
	this.busy = false;
};
