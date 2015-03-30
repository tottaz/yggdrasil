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


function DvListViewActionMenu(parent, className, dialog) {

	if (arguments.length == 0) return;
	className = className || "ActionMenu";
	DwtMenu.call(this, parent, DwtMenu.POPUP_STYLE, className, null, dialog);

	this._menuItems = new Object();
}

DvListViewActionMenu.prototype = new DwtMenu;
DvListViewActionMenu.prototype.constructor = DvListViewActionMenu;

DvListViewActionMenu.prototype.toString = 
function() {
	return "DvListViewActionMenu";
}

DvListViewActionMenu.prototype.addSelectionListener =
function(menuItemId, listener) {
	this._menuItems[menuItemId].addSelectionListener(listener);
}

DvListViewActionMenu.prototype.removeSelectionListener =
function(menuItemId, listener) {
	this._menuItems[menuItemId].removeSelectionListener(listener);
}

DvListViewActionMenu.prototype.popup =
function(delay, x, y) {
	if (delay == null)
		delay = 0;
	if (x == null) 
		x = Dwt.DEFAULT;
	if (y == null)
		y = Dwt.DEFAULT;
	this.setLocation(x, y);
	DwtMenu.prototype.popup.call(this, delay);
}

DvListViewActionMenu.prototype.createOp =
function(menuItemId, text, imageInfo, disImageInfo, enabled) {
	var mi = this.createMenuItem.call(this, menuItemId, imageInfo, text, disImageInfo, enabled);
	mi.setData(LmOperation.KEY_ID, menuItemId);
	return mi;
}

DvListViewActionMenu.prototype.createMenuItem =
function(menuItemId, imageInfo, text, disImageInfo, enabled, style, radioGroupId) {
	var mi = this._menuItems[menuItemId] = new DwtMenuItem(this, style, radioGroupId);
	if (imageInfo)
		mi.setImage(imageInfo);
	if (text)
		mi.setText(text);
	if (disImageInfo)
		mi.setDisabledImage(disImageInfo);
	mi.setEnabled(enabled !== false);
	return mi;
}

DvListViewActionMenu.prototype.createSeparator =
function() {
	new DwtMenuItem(this, DwtMenuItem.SEPARATOR_STYLE);
}
