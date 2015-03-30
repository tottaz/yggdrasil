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


function DwtListViewActionEvent() {
	DwtMouseEvent.call(this);
	this.reset(true);
}

DwtListViewActionEvent.prototype = new DwtMouseEvent;
DwtListViewActionEvent.prototype.constructor = DwtListViewActionEvent;

DwtListViewActionEvent.prototype.toString = 
function() {
	return "DwtListViewActionEvent";
}

DwtListViewActionEvent.prototype.reset =
function(dontCallParent) {
	if (!dontCallParent)
		DwtMouseEvent.prototype.reset.call(this);
	this.field = null;
	this.item = null;
	this.detail = null;
}