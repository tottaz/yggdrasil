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


function AjxSoapException(msg, code, method, detail) {
	AjxException.call(this, msg, code, method, detail);
}

AjxSoapException.prototype.toString = 
function() {
	return "AjxSoapException";
}

AjxSoapException.prototype = new AjxException;
AjxSoapException.prototype.constructor = AjxSoapException;

AjxSoapException.INTERNAL_ERROR 	= "INTERNAL_ERROR";
AjxSoapException.INVALID_PDU 		= "INVALID_PDU";
AjxSoapException.ELEMENT_EXISTS 	= "ELEMENT_EXISTS";
