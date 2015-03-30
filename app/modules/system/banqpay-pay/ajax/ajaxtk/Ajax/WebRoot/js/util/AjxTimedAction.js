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


function AjxTimedAction(obj, func, args) {
	AjxCallback.call(this, obj, func, args);
	this._tid = -1;
	this._id = -1;
}
AjxTimedAction.prototype = new AjxCallback;
AjxTimedAction.prototype.constructor = AjxTimedAction;

AjxTimedAction.prototype.toString = 
function() {
	return "AjxTimedAction";
};

AjxTimedAction._pendingActions = new Object();
AjxTimedAction._nextActionId = 0;

AjxTimedAction.scheduleAction =
function(action, timeout){
	// if tid already exists, cancel previous timeout before setting a new one
	if (action._tid) {
		AjxTimedAction.cancelAction(action._id);
	}

	var id = action._id = AjxTimedAction._nextActionId++;
	AjxTimedAction._pendingActions[id] = action;
	var actionStr = "AjxTimedAction._exec(" + id + ")";
	action._tid = window.setTimeout(actionStr, timeout ? timeout : 0); // mac no like null/void
	return action._id;
};

AjxTimedAction.cancelAction =
function(actionId) {
	var action = AjxTimedAction._pendingActions[actionId];
	if (action) {
		window.clearTimeout(action._tid);
		delete AjxTimedAction._pendingActions[actionId];
		delete action._tid;
	}
};

AjxTimedAction._exec =
function(actionId) {
	var action = AjxTimedAction._pendingActions[actionId];
	delete AjxTimedAction._pendingActions[actionId];
	delete action._tid;
	action.run();
};
