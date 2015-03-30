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

function DwtConfirmDialog(parent, className) {
	if (arguments.length == 0) return;
	
	var buttons = [ DwtDialog.YES_BUTTON, DwtDialog.NO_BUTTON, DwtDialog.CANCEL_BUTTON ];
	DwtDialog.call(this, parent, className, AjxMsg.confirmTitle, buttons);
	
	this._questionDiv = document.createElement("DIV");
	this._questionDiv.className = "DwtConfirmDialogQuestion";
	this._contentDiv.appendChild(this._questionDiv);
	
	this.registerCallback(DwtDialog.YES_BUTTON, this._handleYesButton, this);
	this.registerCallback(DwtDialog.NO_BUTTON, this._handleNoButton, this);
	this.registerCallback(DwtDialog.CANCEL_BUTTON, this._handleCancelButton, this);
}
DwtConfirmDialog.prototype = new DwtDialog;
DwtConfirmDialog.prototype.constructor = DwtConfirmDialog;

DwtConfirmDialog.prototype.toString = function() {
	return "DwtConfirmDialog";
};

// Data

DwtConfirmDialog.prototype._questionDiv;

DwtConfirmDialog.prototype._yesCallback;
DwtConfirmDialog.prototype._noCallback;
DwtConfirmDialog.prototype._cancelCallback;

// Public methods

/**
 * Pops up the confirmation dialog. The caller passes in the confirmation
 * question and callbacks for the Yes, No, and Cancel buttons.
 * <p>
 * <strong>Note:</strong>
 * If the callback for the No button is not specified, the confirmation
 * dialog assumes that the caller is only concerned with a Yes response
 * and hides the (presumably) extraneous Cancel button.
 */
DwtConfirmDialog.prototype.popup = 
function(questionHtml, yesCallback, noCallback, cancelCallback, loc) {
	this._questionDiv.innerHTML = questionHtml || "";
	
	this._yesCallback = yesCallback;
	this._noCallback = noCallback;
	this._cancelCallback = cancelCallback;
	
	this.setButtonVisible(DwtDialog.CANCEL_BUTTON, Boolean(noCallback));
	
	DwtDialog.prototype.popup.call(this, loc);
};

DwtConfirmDialog.prototype.popdown = function() {
	this._yesCallback = this._noCallback = this._cancelCallback = null;
	DwtDialog.prototype.popdown.call(this);
};

// Protected methods

DwtConfirmDialog.prototype._handleYesButton = function(ev) {
	if (this._yesCallback) this._yesCallback.run(ev);
	this.popdown();
};
DwtConfirmDialog.prototype._handleNoButton = function(ev) {
	if (this._noCallback) this._noCallback.run(ev);
	this.popdown();
};
DwtConfirmDialog.prototype._handleCancelButton = function(ev) {
	if (this._cancelCallback) this._cancelCallback.run(ev);
	this.popdown();
};

DwtConfirmDialog.prototype._getSeparatorTemplate = function() {
	return "";
};