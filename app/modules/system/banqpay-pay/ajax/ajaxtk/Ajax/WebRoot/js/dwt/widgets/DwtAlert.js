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


//
// Constructor
//

/**
 * Constructs a control that alerts the user to important information.
 *
 * @param parent    The parent container for this control.
 * @param className (optional) The CSS class for this control. Default
 *					value is "DwtAlert".
 * @param posStyle  (optional) The position style of this control.
 */
function DwtAlert(parent, className, posStyle) {
	if (arguments.length == 0) return;
	posStyle = posStyle || DwtControl.STATIC_STYLE;
	DwtComposite.call(this, parent, null, posStyle);

	this._alertClass = className;
	this._alertStyle = DwtAlert.INFORMATION;
	this._createHTML();
}

DwtAlert.prototype = new DwtControl;
DwtAlert.prototype.constructor = DwtAlert;

//
// Constants
//

DwtAlert.INFORMATION = 0;
DwtAlert.WARNING = 1;
DwtAlert.CRITICAL = 2;

DwtAlert._ICONS = [ AjxImg.getClassForImage("Information_32"), AjxImg.getClassForImage("Warning_32"), AjxImg.getClassForImage("Critical_32") ];
DwtAlert._CLASSES = [ "DwtAlertInfo", "DwtAlertWarn", "DwtAlertCrit" ];

//
// Data
//

DwtAlert.prototype._alertClass;
DwtAlert.prototype._alertStyle;
DwtAlert.prototype._alertTitle;
DwtAlert.prototype._alertContent;

DwtAlert.prototype._alertDiv;
DwtAlert.prototype._iconDiv;
DwtAlert.prototype._titleDiv;
DwtAlert.prototype._contentDiv;

//
// Public methods
//

DwtAlert.prototype.setStyle = function(style) {
	this._alertStyle = style || DwtAlert.INFORMATION;
	this._iconDiv.className = "DwtAlertIcon "+DwtAlert._ICONS[this._alertStyle];
	this._alertDiv.className = "DwtAlert "+ (this._alertClass || DwtAlert._CLASSES[this._alertStyle]);
}
DwtAlert.prototype.getStyle = function() {
	return this._alertStyle;
}

DwtAlert.prototype.setIconVisible = function(visible) {
	var display = visible ? "block" : "none";
	// NOTE: This makes the parent <td> not visible
	this._iconDiv.parentNode.style.display = display;
}
DwtAlert.prototype.getIconVisible = function() {
	return this._iconDiv.style.display == "block";
}

DwtAlert.prototype.setTitle = function(title) {
	this._alertTitle = title;
	this._titleDiv.innerHTML = title || "";
}
DwtAlert.prototype.getTitle = function() {
	return this._alertTitle;
}

DwtAlert.prototype.setContent = function(content) {
	this._alertContent = content;
	this._contentDiv.innerHTML = content || "";
}
DwtAlert.prototype.getContent = function() {
	return this._alertContent;
}

//
// Protected methods
//

DwtAlert.prototype._createHTML = function() {

	// create unique identifiers
	var thisId = this.getHtmlElement().id;
	var iconDivId = thisId+"_icon";
	var titleDivId = thisId+"_title";
	var contentDivId = thisId+"_content";

	// NOTE: The alert HTML is created using TWO nested <table> elements
	//		 because 1) IE had problems with the alert icon floated to the
	//		 left within our application; and 2) Mozilla had problems with
	//		 obeying a table cell's rowSpan when creating the table
	//		 programmatically.
	
	// create html content
	this._alertDiv = document.createElement("TABLE");
	this._alertDiv.width = "90%";
	this._alertDiv.cellPadding = 0;
	this._alertDiv.cellSpacing = 0;
	this._alertDiv.className = "DwtAlert "+ (this._alertClass || DwtAlert._CLASSES[this._alertStyle]);
	
	this._iconDiv = document.createElement("DIV");
	this._iconDiv.id = iconDivId;
	this._iconDiv.className = "DwtAlertIcon "+DwtAlert._ICONS[this._alertStyle];

	// NOTE: The icon needs to be in a <div> inside the table cell so
	//		 that IE will use the CSS margin property.
	var row1 = this._alertDiv.insertRow(0);
	var cell1 = row1.insertCell(0);
	cell1.width = "1%";
	cell1.appendChild(this._iconDiv);

	var table2 = document.createElement("TABLE");
	table2.cellPadding = 0;
	table2.cellSpacing = 0;
	
	this._titleDiv = table2.insertRow(0).insertCell(0);
	this._titleDiv.id = titleDivId;
	this._titleDiv.className = "DwtAlertTitle";
	
	this._contentDiv = table2.insertRow(1).insertCell(0);
	this._contentDiv.id = contentDivId;
	this._contentDiv.className = "DwtAlertContent";
	
	var cell2 = row1.insertCell(1);
	cell2.width = "99%";
	cell2.appendChild(table2);

	// attach elements
	var parent = this.getHtmlElement();
	parent.style.align = "center";
	parent.appendChild(this._alertDiv);
}