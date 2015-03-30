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
 * static class that wraps around AjxEventManager
 */
function DwtEventManager () {
    
}

DwtEventManager._instance = new AjxEventMgr();

DwtEventManager._domEventToDwtMap = {
	'ondblclick': DwtEvent.ONDBLCLICK,
	'onmousedown': DwtEvent.ONMOUSEDOWN ,
	'onmouseup': DwtEvent.ONMOUSEUP,
	'onmousemove': DwtEvent.ONMOUSEMOVE,
	'onmouseout': DwtEvent.ONMOUSEOUT,
	'onmouseover': DwtEvent.ONMOUSEOVER,
	'onselectstart': DwtEvent.ONSELECTSTART,
	'onchange': DwtEvent.ONCHANGE
};

DwtEventManager.addListener = 
function(eventType, listener) {
	DwtEventManager._instance.addListener(eventType, listener);
};

DwtEventManager.notifyListeners = 
function(eventType, event) {
	DwtEventManager._instance.notifyListeners(eventType, event);
};

DwtEventManager.removeListener = 
function(eventType, listener) {
	DwtEventManager._instance.removeListener(eventType, listener);
};

// This tries to listen on a given element as well as to any event
// received by other Dwt widgets
DwtEventManager.addGlobalListener = 
function (element, eventType, listener) {
	AjxCore.addListener(element, eventType, listener);
	var dwtEventName = DwtEventManager._domEventToDwtMap[eventType];
	if (dwtEventName) {
		DwtEventManager.addListener(dwtEventName, listener);
	}
}
