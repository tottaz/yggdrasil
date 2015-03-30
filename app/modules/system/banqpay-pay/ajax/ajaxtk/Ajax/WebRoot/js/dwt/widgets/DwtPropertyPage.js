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
* @class
* @constructor
* DwtPropertyPage abstract class for a property page (view)
* It provides ability to keep track of any changes in the form fields on the page
* @author Greg Solovyev
**/

function DwtPropertyPage(parent, className, positionType) {
	if (arguments.length == 0) return;
	var clsName = className || "DwtPropertyPage";
	DwtComposite.call(this, parent, className, positionType);
	this._fieldIds = new Object();
	this._fildDivIds = new Object();
	this._isDirty = false;
}

DwtPropertyPage.prototype = new DwtComposite;
DwtPropertyPage.prototype.constructor = DwtPropertyPage;

DwtPropertyPage.prototype.toString = 
function() {
	return "DwtPropertyPage";
}

/**
* @param boolean
* sets the value of _isDirty flag
**/
DwtPropertyPage.prototype.setDirty = 
function (isD) {
	this._isDirty = isD;
}

/**
* @ return boolean _isDirty flag
* isDirty indicates whether the user changed any data on the page after the page was initialized
**/
DwtPropertyPage.prototype.isDirty = 
function () {
	return this._isDirty;
}

/**
* @param field either key to the field ID in the _fieldIds or reference to the field
**/
DwtPropertyPage.prototype._installOnKeyUpHandler = 
function(field, func) {
	if (!field)	return;
	
	var e = null;
	e = document.getElementById(this._fieldIds[field]);
	if (e) {
		Dwt.setHandler(e, DwtEvent.ONKEYUP, func ? func : this._onKeyUp);
		e._view = this;
		e._field = field;
	}
}

/**
* @param field either key to the field ID in the _fieldIds or reference to the field
**/
DwtPropertyPage.prototype._installOnClickHandler = 
function(field, func) {
	if (!field) return;
	
	var e = document.getElementById(this._fieldIds[field]);
	if (e) {
		Dwt.setHandler(e, DwtEvent.ONCLICK, func ? func : this._onClick);
		e._view = this;
		e._field = field;
	}
}

DwtPropertyPage.prototype._onClick =
function(ev) {
	this._view.setDirty(true);
	return true;
}

DwtPropertyPage.prototype._onKeyUp =
function(ev) {
	this._view.setDirty(true);
	return true;
}

/**
* @param field either key to the field ID in the _fieldIds or reference to the field
**/
DwtPropertyPage.prototype._installOnChangeHandler = 
function(field, func) {
	if (!field) return;
	
	var e = null;
	e = document.getElementById(this._fieldIds[field]);
	if(e) {
		Dwt.setHandler(e, DwtEvent.ONCHANGE, func ? func : this._onChange);
		e._view = this;
		e._field = field;
	}
}

DwtPropertyPage._onChange =
function(ev) {
	this._view.setDirty(true);
	return true;
}

DwtPropertyPage.prototype._onChange2 =
function(ev) {
	this.setDirty(true);
	return true;
}

DwtPropertyPage.prototype._addDwtSelectEntryRow =
function(field, title, html, idx, titleSize) {
	var tSize = "30ex";
	if(titleSize)
		tSize = titleSize;
		
	html[idx++] = "<tr valign='center'>";
	idx = this._addDwtSelectEntryCell(field, title, html, idx, tSize);
	html[idx++] = "</tr>";
	return idx;
}

DwtPropertyPage.prototype._addDwtSelectEntryCell =
function(field, title, html, idx, titleWidth) {
	var id = Dwt.getNextId();
	this._fieldIds[field] = id;
	if(title) {
		html[idx++] = "<td align='left' style='width:" + titleWidth + "'>";
		html[idx++] = AjxStringUtil.htmlEncode(title) + ":";
		html[idx++] = "</td>";
	}
	html[idx++] = "<td align='left'>";
	html[idx++] = "<div id='" + id + "'></div></td>";
	return idx;
}

DwtPropertyPage.prototype._addBoolEntryRow =
function(field, title, html, idx, titleWidth) {
	html[idx++] = "<tr valign='center'>";
	idx = this._addBoolEntryCell(field, title, html, idx, titleWidth);
	html[idx++] = "</tr>";
	return idx;
}

DwtPropertyPage.prototype._addBoolEntryCell =
function(field, title, html, idx, titleWidth) {
	var id = Dwt.getNextId();
	this._fieldIds[field] = id;
	var tWidth = "20ex";
	if(titleWidth)
		tWidth = titleWidth;	
		
	if(title) {
		html[idx++] = "<td style='width:" + tWidth + ";' align='left'>";
		html[idx++] = AjxStringUtil.htmlEncode(title) + ":";
		html[idx++] = "</td>";
	}
	html[idx++] = "<td align='left'>";
	html[idx++] = "<input type='checkbox' id='"+id+"'>";
	html[idx++] = "</td>";
	return idx;
}

DwtPropertyPage.prototype._addTextAreaEntryRow =
function(field, title, html, idx, noWrap) {
	var myWrap = "on";
	if(noWrap)
		myWrap = "off";
		
	var id = Dwt.getNextId();
	this._fieldIds[field] = id;
	html[idx++] = "<tr valign='center'>";
	html[idx++] = "<td align='left' style='width:60ex;'>";
	html[idx++] = AjxStringUtil.htmlEncode(title) + ":";
	html[idx++] = "</td></tr>";
	html[idx++] = "<tr valign='center'><td align='left' style='width:60ex;'><textarea wrap='" + myWrap + "' rows='8' cols ='60' id='";	
	html[idx++] = id;
	html[idx++] = "'/></textarea></td></tr>";
	return idx;
}

/**
* _addEntryRow
*	@param field - key of the field id in this._fieldIds
*	@param title - title string. If title is specified a separate cell will be appended before the form field
* title will be rendered within that cell
*	@param html - reference to html array
*	@param idx - current counter inside the html array
*	@param type - type of the form field to create (<input type= )
*	@param fldsize - size of the input field (this value will be assigned to the size property
*	@param tailTitle - string that will be placed behind the form field
*	@param titleWidth - width of the title cell
**/
DwtPropertyPage.prototype._addEntryRow =
function(field, title, html, idx, type, fldsize, tailTitle, titleWidth, withAsteric) {
	html[idx++] = "<tr valign='center'>";
	idx = this._addEntryCell(field, title, html, idx, type, fldsize, tailTitle, titleWidth, withAsteric);
	html[idx++] = "</tr>";
	return idx;
}

/**
* _addEntryCell
*	@param field - key of the field id in this._fieldIds
*	@param title - title string. If title is specified a separate cell will be appended before the form field
* title will be rendered within that cell
*	@param html - reference to html array
*	@param idx - current counter inside the html array
*	@param type - type of the form field to create (<input type= )
*	@param fldsize - size of the input field (this value will be assigned to the size property
*	@param tailTitle - string that will be placed behind the form field
*	@param titleWidth - width of the title cell
**/
DwtPropertyPage.prototype._addEntryCell =
function(field, title, html, idx, type, fldsize, tailTitle, titleWidth, withAsteric) {
	if (type == null) type = "text";
	if(fldsize == null) fldsize = 35;
	var tWidth = "20ex";
	if(titleWidth) 
		tWidth = titleWidth;
		
	var id = Dwt.getNextId();
	this._fieldIds[field] = id;
	if(title) {
		html[idx++] = "<td align='left' style='width:" + tWidth + ";'>";
		html[idx++] = AjxStringUtil.htmlEncode(title) + ":";
		html[idx++] = "</td>";
	}
	html[idx++] = "<td ";
	if(withAsteric) {
		html[idx++] = "class='redAsteric' ";		
	}
	html[idx++] = "	align='left'><input autocomplete='off' size='"+fldsize+"' type='"+type+"' id='";	
	html[idx++] = id;
	html[idx++] = "'";
	if(withAsteric) {
		html[idx++] = "/>*";		
	} else {
		html[idx++] = "/>&nbsp;";
	}
	if(tailTitle != null) {
		html[idx++]	= tailTitle;
	}
	html[idx++] = "</td>";
	return idx;
}
/**
* Use this method to render HTML form
* call all other rendering methods from this method.
**/
DwtPropertyPage.prototype._createHTML = 
function () {
 //abstract method
}
