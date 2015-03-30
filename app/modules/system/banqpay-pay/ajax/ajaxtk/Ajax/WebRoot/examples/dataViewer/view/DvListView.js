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
* This class displays a list of items.
* @author Conrad Damon
* @author Parag Shah
*
* @param parent		DOM parent
* @param attrs		which attributes (columns) to display
*/
function DvListView(parent, attrs, app) {

	var attrList = app.getFullAttrList().getArray();
	var headerList = this._getHeaderList(parent, attrs, attrList);
	DwtListView.call(this, parent, "DwtListView", null, headerList, true);

	this._attrs = attrs;
	this._app = app;
	this._listChangeListener = new AjxListener(this, this._changeListener);
	
	// create one time action menu
	this._actionMenu = new DvListViewActionMenu(this);
	var actionListener = new AjxListener(this, this._actionListener);
	for (var i = 0; i < attrList.length; i++) {
		var attr = attrList[i];
		var mi = this._actionMenu.createMenuItem(attr.id, null, attr.name, null, null, DwtMenuItem.CHECK_STYLE);
		mi.setData(DvListView.KEY_ID, attr.id);
		this._actionMenu.addSelectionListener(attr.id, actionListener);
		for (var j = 0; j < this._attrs.length; j++) {
			if (this._attrs[j].id == attr.id) {
				mi.setChecked(true, true);
				break;
			}
		}
	}
}

// Number of items per page
DvListView.PAGE_SIZE = 25;
DvListView.KEY_ID = "_keyId";

DvListView.prototype = new DwtListView;
DvListView.prototype.constructor = DvListView;

DvListView.prototype.toString = 
function() {
	return "DvListView";
}

// Public functions

/**
* Fills the list view with the given data.
*
* @param list		a DvItemList or a AjxVector of items
*/
DvListView.prototype.set =
function(list) {
	if (list instanceof DvItemList) {
		list.addChangeListener(this._listChangeListener);
		list = list.getVector();
	}
	DwtListView.prototype.set.call(this, list);
}

// Private functions

// Called by DwtListView to draw a row representing a single item.
DvListView.prototype._createItemHtml =
function(item) {

	var	div = document.createElement("div");
	var base = "Row";
	div._styleClass = base;
	div._selectedStyleClass = [base, DwtCssStyle.SELECTED].join("-");	// Row-selected

	this.associateItemWithElement(item, div, DwtListView.TYPE_LIST_ITEM);
	div.className = div._styleClass;

	var htmlArr = new Array();
	var idx = 0;
	
	// Table
	htmlArr[idx++] = "<table cellpadding=0 cellspacing=0 border=0";
	htmlArr[idx++] = this._noMaximize ? ">" : " width=100%>";
	
	// Row
	htmlArr[idx++] = "<tr id='" + item.id + "'>";
	
	// Data
	for (var j = 0; j < this._headerList.length; j++) {
		var col = this._headerList[j];
		if (!col._visible)
			continue;
		
		htmlArr[idx++] = "<td";
		// IE misbehaves w/ the box model so we correct ourselves
		var width = AjxEnv.isIE ? (col._width + 4) : col._width;
		htmlArr[idx++] = width ? (" width=" + width + ">") : ">";
		// add a div to force clipping (TD's dont obey it)
		htmlArr[idx++] = "<div";
		htmlArr[idx++] = width ? " style='width: " + width + "'>" : ">";
		var value = item.getValue(col.attrId);
		htmlArr[idx++] = value ? value + "</div></td>" : "</div></td>";
	}

	htmlArr[idx++] = "</tr></table>";
	
	div.innerHTML = htmlArr.join("");
	return div;
}

// Handle changes to data by updating the view.
DvListView.prototype._changeListener =
function(ev) {
	var items = ev.getDetail("items");
	if (ev.event == DvEvent.E_ADD) {
		// TODO
	} else if (ev.event == DvEvent.E_DELETE) {
		DBG.println(AjxDebug.DBG2, "DvListView: DELETE");
		for (var i = 0; i < items.length; i++) {
			var row = document.getElementById(item.id);
			if (row) {
				this._parentEl.removeChild(row);
				this._selectedItems.remove(row);
			}
			this._list.remove(items[i]);
		}
	} else if (ev.event == DvEvent.E_MODIFY) {
		// TODO
	}
}

// Returns the headers for this list view
DvListView.prototype._getHeaderList =
function(parent, attrs, fullAttrList) {

	var headerList = new Array();
	
	for (var i = 0; i < fullAttrList.length; i++) {
		var attr = fullAttrList[i];
		attr.colId = attr.id + "--c";
		// allow all columns to be resized except those that have relative widths
		var resizeable = attr.width != null; 
		headerList[i] = new DwtListHeaderItem(attr.colId, attr.name, null, attr.width, attr.id, resizeable, false);
		headerList[i].attrId = attr.id;
		headerList[i]._tfAttr = attr;
		
		// reset visibility for the header column if found in the default list
		for (var j = 0; j < attrs.length; j++) {
			if (attrs[j].id == attr.id) {
				headerList[i]._visible = true;
				break;
			}
		}
	}

	return headerList;
}

DvListView.prototype.resetHeight = 
function(newHeight) {
	this.setSize(Dwt.DEFAULT, newHeight);
	Dwt.setSize(this._parentEl, Dwt.DEFAULT, newHeight);
	this._resetColWidth();
}

DvListView.prototype.setParentTabView = 
function(tabView) {
	this._parentTabView = tabView;
}

DvListView.prototype._getParentForColResize = 
function() {
	return this._parentTabView;
}

DvListView.prototype._sortColumn = 
function(columnItem, ascending) {
	this._app.sortList(columnItem._tfAttr, ascending);
}

DvListView.prototype._getActionMenuForColHeader = 
function() {
	return this._actionMenu;
}

DvListView.prototype._actionListener = 
function(ev) {
	DBG.println("you clicked an action menu!");
	var menuItemId = ev.item.getData(DvListView.KEY_ID);
	// XXX: optimize later...
	for (var i = 0; i < this._headerList.length; i++) {
		var col = this._headerList[i];
		if (col.attrId == menuItemId) {
			col._visible = !col._visible;
			break;
		}
	}
	
	this._relayout();
}
