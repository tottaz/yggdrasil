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
* Creates a new listener.
* @constructor
* @class
* This class represents a listener, which is a function to be called in response to an event.
* A listener is a slightly specialized callback: it has a handleEvent() method, and it doesn't
* return a value.
*
* @author Ross Dargahi
* @param obj	(optional) the object to call the function from
* @param func	the listener function
*/
function AjxListener(obj, method, args) {
	AjxCallback.call(this, obj, method, args);
}

AjxListener.prototype = AjxCallback;
AjxListener.prototype.constructor = AjxListener;

AjxListener.prototype.toString = 
function() {
	return "AjxListener";
}

/**
* Invoke the listener function.
*
* @param ev		the event object that gets passed to an event handler
*/
AjxListener.prototype.handleEvent =
function(ev) {
	return AjxCallback.prototype.run.call(this, ev);
}
