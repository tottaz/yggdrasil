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


function AjxException(msg, code, method, detail) {
	if (arguments.length == 0) return;
	this.msg = msg;
	this.code = code;
	this.method = method;
	this.detail = detail;
}

AjxException.prototype.toString = 
function() {
	return "AjxException";
}

AjxException.prototype.dump = 
function() {
	return "AjxException: msg="+this.msg+" code="+this.code+" method="+this.method+" detail="+this.detail;
}
AjxException.INVALIDPARENT 			= "AjxException.INVALIDPARENT";
AjxException.INVALID_OP 			= "AjxException.INVALID_OP";
AjxException.INTERNAL_ERROR 		= "AjxException.INTERNAL_ERROR";
AjxException.INVALID_PARAM 			= "AjxException.INVALID_PARAM";
AjxException.UNIMPLEMENTED_METHOD 	= "AjxException.UNIMPLEMENTED_METHOD";
AjxException.NETWORK_ERROR 			= "AjxException.NETWORK_ERROR";
AjxException.OUT_OF_RPC_CACHE		= "AjxException.OUT_OF_RPC_CACHE";
AjxException.UNSUPPORTED 			= "AjxException.UNSUPPORTED";
AjxException.UNKNOWN_ERROR 			= "AjxException.UNKNOWN_ERROR";
AjxException.CANCELED				= "AjxException.CANCELED";
