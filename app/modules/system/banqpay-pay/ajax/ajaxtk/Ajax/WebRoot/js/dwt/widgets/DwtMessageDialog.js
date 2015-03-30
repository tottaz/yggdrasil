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
* Creates a new message dialog.
* @constructor
* @class
* This class represents a reusable message dialog box. Messages can be informational, warning, or
* critical.
*/
function DwtMessageDialog(parent, className, buttons, extraButtons) {
	if (arguments.length == 0) return;
	this._msgCellId = Dwt.getNextId();
	buttons = buttons ? buttons : [DwtDialog.OK_BUTTON];
	DwtDialog.call(this, parent, className, null, buttons, extraButtons);
	this.setContent(this._contentHtml());
	this._msgCell = document.getElementById(this._msgCellId);
	this.addEnterListener(new AjxListener(this, this._enterListener));
};

DwtMessageDialog.prototype = new DwtDialog;
DwtMessageDialog.prototype.constructor = DwtMessageDialog;

DwtMessageDialog.CRITICAL_STYLE = 1;
DwtMessageDialog.INFO_STYLE = 2;
DwtMessageDialog.WARNING_STYLE = 3;

DwtMessageDialog.TITLE = new Object();
DwtMessageDialog.TITLE[DwtMessageDialog.CRITICAL_STYLE] = AjxMsg.criticalMsg;
DwtMessageDialog.TITLE[DwtMessageDialog.INFO_STYLE] = AjxMsg.infoMsg
DwtMessageDialog.TITLE[DwtMessageDialog.WARNING_STYLE] = AjxMsg.warningMsg;

DwtMessageDialog.ICON = new Object();
DwtMessageDialog.ICON[DwtMessageDialog.CRITICAL_STYLE] = "Critical_32";
DwtMessageDialog.ICON[DwtMessageDialog.INFO_STYLE] = "Information_32";
DwtMessageDialog.ICON[DwtMessageDialog.WARNING_STYLE] = "Warning_32";


// Public methods

DwtMessageDialog.prototype.toString = 
function() {
	return "DwtMessageDialog";
};

/**
* Sets the message style (info/warning/critical) and content.
*
* @param msgStr		message text
* @param detailStr	additional text to show via Detail button
* @param style		style (info/warning/critical)
* @param title		dialog box title
*/
DwtMessageDialog.prototype.setMessage =
function(msgStr, style, title) {
	style = style ? style : DwtMessageDialog.INFO_STYLE;
	title = title ? title : DwtMessageDialog.TITLE[style];
	this.setTitle(title);
	if (msgStr) {
		var html = new Array();
		var i = 0;
		html[i++] = "<table cellspacing=0 cellpadding=0 border=0><tr>";
		html[i++] = "<td valign='top'>";
		html[i++] = AjxImg.getImageHtml(DwtMessageDialog.ICON[style]);
		html[i++] = "</td><td class='DwtMsgArea'>";
		html[i++] = msgStr;
		html[i++] = "</td></tr></table>";
		this._msgCell.innerHTML = html.join("");
	} else {
		this._msgCell.innerHTML = "";
	}
};

/**
* Resets the message dialog so it can be reused.
*/
DwtMessageDialog.prototype.reset = 
function() {
	this._msgCell.innerHTML = "";
	DwtDialog.prototype.reset.call(this);
};

// Private methods

DwtMessageDialog.prototype._contentHtml = 
function() {
	return "<div id='" + this._msgCellId + "' class='DwtMsgDialog'></div>";
};

DwtMessageDialog.prototype._enterListener =
function(ev) {
	this._runEnterCallback();
};
