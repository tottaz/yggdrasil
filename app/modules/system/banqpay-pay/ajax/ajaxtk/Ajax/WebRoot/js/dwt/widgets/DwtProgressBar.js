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
 *
 * @param parent    The parent container for this control.
 * @param className (optional) 
 * @param posStyle  (optional) The position style of this control.
 * @author Greg Solovyev
 */
function DwtProgressBar(parent, className, posStyle) {
	if (arguments.length == 0) return;
	posStyle = posStyle || DwtControl.STATIC_STYLE;
	DwtComposite.call(this, parent, null, posStyle);
	this._maxValue = 100;
	this._value = 0;
	this._quotabarDiv = null;
	this._quotausedDiv = null;	
	this._progressBgColor = "#66cc33";
	this._progressCssClass = "quotaused";	
	
	this._wholeBgColor = null;
	this._wholeCssClass = "quotabar";	
	this._createHTML();
}

DwtProgressBar.prototype = new DwtComposite;
DwtProgressBar.prototype.constructor = DwtProgressBar;


//
// Public methods
//
DwtProgressBar.prototype.setProgressBgColor = 
function(val) {
	this._progressBgColor = val;
}

DwtProgressBar.prototype.setWholeBgColor = 
function(val) {
	this._wholeBgColor = val;
}

DwtProgressBar.prototype.setProgressCssClass = 
function(val) {
	this._progressCssClass = val;
}

DwtProgressBar.prototype.setWholeCssClass = 
function(val) {
	this._wholeCssClass = val;
}

DwtProgressBar.prototype.setProgressCssStyle = 
function(val) {
	this._progressCssStyle = val;
}

DwtProgressBar.prototype.setWholeCssStyle  = 
function(val) {
	this._wholeCssStyle = val;
}

DwtProgressBar.prototype.setValue = 
function(val) {
	this._value = parseInt(val);
	var percent;

	if(this._value == this._maxValue)
		percent = 100;
	else 
		percent = Math.min(Math.round((this._value / this._maxValue) * 100), 100);	

	if(isNaN(percent))
		percent = "0";
			
	if(!this._quotabarDiv) {
		this._quotabarDiv = document.createElement("div")
		if(this._wholeCssClass)
			this._quotabarDiv.className = this._wholeCssClass;

		if(this._wholeBgColor)
			this._quotabarDiv.backgroundColor = this._wholeBgColor;
		
		this._cell.appendChild(this._quotabarDiv);
	}
	if(!this._quotausedDiv) {
		this._quotausedDiv = document.createElement("div")
		if(this._progressCssClass)
			this._quotausedDiv.className = this._progressCssClass;
			
		if(this._progressBgColor)
			this._quotausedDiv.style.backgroundColor = this._progressBgColor;
			
		this._quotabarDiv.appendChild(this._quotausedDiv);			
	}	

	this._quotausedDiv.style.width = percent + "%";
}

DwtProgressBar.prototype.getValue = 
function() {
	return this._value;
}

DwtProgressBar.prototype.getMaxValue = 
function() {
	return this._maxValue;
}

DwtProgressBar.prototype.setMaxValue = 
function(val) {
	this._maxValue = parseInt(val);
}

//
// Protected methods
//

DwtProgressBar.prototype._createHTML = 
function() {
	this._table = document.createElement("table");
	this._table.border = this._table.cellpadding = this._table.cellspacing = 0;	

	this._row = this._table.insertRow(-1);

	if(AjxEnv.isLinux)
		this._row.style.lineHeight = 13;
	
	this._cell = this._row.insertCell(-1);
	
	this.getHtmlElement().appendChild(this._table);
}
