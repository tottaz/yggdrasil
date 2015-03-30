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


function DwtGrouper(parent, className, posStyle) {
	if (arguments.length == 0) return;
	className = className || "DwtBorder";
	posStyle = posStyle || DwtControl.STATIC_STYLE;
	DwtComposite.call(this, parent, null, posStyle);
	
	this._labelEl = document.createElement("SPAN");
	this._insetEl = document.createElement("DIV");
	this._borderEl = document.createElement("DIV");
	this._borderEl.appendChild(this._labelEl);
	this._borderEl.appendChild(this._insetEl);
	
	this.setStyle(DwtGrouper.SOLID);
	
	var element = this.getHtmlElement();
	element.appendChild(this._borderEl);
}

DwtGrouper.prototype = new DwtComposite;
DwtGrouper.prototype.constructor = DwtGrouper;

// Constants

DwtGrouper.SOLID = "solid";

DwtGrouper._STYLES = {};
DwtGrouper._STYLES[DwtGrouper.SOLID] = [ "GrouperBorder", "GrouperLabel", "GrouperInset" ];

// Data

DwtGrouper.prototype._borderEl;
DwtGrouper.prototype._labelEl;
DwtBorder.prototype._insetEl;

// Public methods

DwtGrouper.prototype.setStyle = function(style) {
	var cssClasses = DwtGrouper._STYLES[style];
	this._borderEl.className = cssClasses[0];
	this._labelEl.className = cssClasses[1];
	this._insetEl.className = cssClasses[2];
};

DwtGrouper.prototype.setLabel = function(htmlContent) {
	Dwt.setVisible(this._labelEl, Boolean(htmlContent));
	// HACK: undo block display set by Dwt.setVisible
	this._labelEl.style.display = "";
	this._labelEl.innerHTML = htmlContent ? htmlContent : "";
};

DwtGrouper.prototype.setContent = function(htmlContent) {
	var element = this._insetEl;
	element.innerHTML = htmlContent;
};

DwtGrouper.prototype.setElement = function(htmlElement) {
	var element = this._insetEl;
	Dwt.removeChildren(element);
	element.appendChild(htmlElement);
};

DwtGrouper.prototype.setView = function(control) {
	this.setElement(control.getHtmlElement());
};