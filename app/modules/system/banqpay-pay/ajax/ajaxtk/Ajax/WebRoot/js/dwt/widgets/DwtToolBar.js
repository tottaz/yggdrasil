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


function DwtToolBar(parent, className, posStyle, cellSpacing, cellPadding, style) {

	if (arguments.length == 0) return;
	className = className || "DwtToolBar";
	DwtComposite.call(this, parent, className, posStyle);
	
	this._style = style ? style : DwtToolBar.HORIZ_STYLE;
	this._table = document.createElement("table");
	this._table.border = 0;
	this._table.cellPadding = cellPadding ? cellPadding : 0;
	this._table.cellSpacing = cellSpacing ? cellSpacing : 0;
	this.getHtmlElement().appendChild(this._table);
	this._table.backgroundColor = DwtCssStyle.getProperty(this.parent.getHtmlElement(), "background-color");

	this._numFillers = 0;
}

DwtToolBar.prototype = new DwtComposite;
DwtToolBar.prototype.constructor = DwtToolBar;

DwtToolBar.HORIZ_STYLE	= 1;
DwtToolBar.VERT_STYLE	= 2;

DwtToolBar.ELEMENT		= 1;
DwtToolBar.SPACER		= 2;
DwtToolBar.SEPARATOR	= 3;
DwtToolBar.FILLER		= 4;

DwtToolBar.DEFAULT_SPACER = 10;

DwtToolBar.prototype.toString = 
function() {
	return "DwtToolBar";
}

// bug fix #33 - IE defines box model differently
DwtToolBar.prototype.__itemPaddingRight = AjxEnv.isIE ? "4px" : "0px";

DwtToolBar.prototype.getItem =
function(index) {
	return this._children.get(index);
}

DwtToolBar.prototype.getItemCount =
function() {
	return this._children.size();
}

DwtToolBar.prototype.getItems =
function() {
	return this._children.toArray();
}

DwtToolBar.prototype.addSpacer =
function(size, index) {
	var el = this._createSpacerElement();
	var dimension = this._style == DwtToolBar.HORIZ_STYLE ? "width" : "height";
	el.style[dimension] = size || DwtToolBar.DEFAULT_SPACER;

	this._addItem(DwtToolBar.SPACER, el, index);
	return el;
}

DwtToolBar.prototype._createSpacerElement = 
function() {
	return document.createElement("div");
}

DwtToolBar.prototype.addSeparator =
function(className, index) {
	var el = this._createSeparatorElement();
	el.className = className;
	this._addItem(DwtToolBar.SEPARATOR, el, index);
	return el;
}

DwtToolBar.prototype._createSeparatorElement = DwtToolBar.prototype._createSpacerElement;
DwtToolBar.prototype._createFillerElement = DwtToolBar.prototype._createSpacerElement;

DwtToolBar.prototype.addFiller =
function(className, index) {
	var el = this._createFillerElement();
	el.className = className || this._defaultFillClass;
	this._addItem(DwtToolBar.FILLER, el, index);
	return el;
}

DwtToolBar.prototype.addChild =
function(child, index) {
	this._children.add(child);
	var htmlEl = child._removedEl ? child._removedEl : child.getHtmlElement();
	this._addItem(DwtToolBar.ELEMENT, htmlEl, index);
}

DwtToolBar.prototype._addItem =
function(type, element, index) {

	var row, col;
	if (this._style == DwtToolBar.HORIZ_STYLE) {
		row = (this._table.rows.length != 0) ? this._table.rows[0]: this._table.insertRow(0);
		row.align = "center";
		row.vAlign = "middle";
		
		var cellIndex = index || row.cells.length;
		col = row.insertCell(cellIndex);
		col.align = "center";
		col.vAlign = "middle";
		col.noWrap = true;
		// bug fix #33 - IE defines box model differently
		col.style.paddingRight = this.__itemPaddingRight;

		if (type == DwtToolBar.FILLER) {
			this._numFillers++;
			var perc = Math.floor(100 / this._numFillers);
			col.style.width = [perc, "%"].join("");
		} else {
			col.style.width = "1";
		}
			
		col.appendChild(element);
	} else {
		var rowIndex = index || -1;
		row = this._table.insertRow(rowIndex);
		row.align = "center";
		row.vAlign = "middle";
		
		col = row.insertCell(0);
		col.align = "center";
		col.vAlign = "middle";
		col.noWrap = true;

		if (type == DwtToolBar.FILLER) {
			this._numFillers++;
			var perc = Math.floor(100 / this._numFillers);
			col.style.height = [perc, "%"].join("");
		}

		col.appendChild(element);
	}
}
