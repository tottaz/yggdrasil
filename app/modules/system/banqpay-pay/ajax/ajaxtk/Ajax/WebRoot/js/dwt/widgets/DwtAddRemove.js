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
 * Constructs a control that shows two lists of items and allows the user
 * to move items between the two lists.
 *
 * @param parent               The parent container for this control.
 * @param className            (optional) The CSS class for this control. Default
 *					           value is "DwtAddRemove".
 * @param posStyle  (optional) The position style of this control.
 * @param sourceListClassName  The css class name for the source list.
 * @param targetListClassName  The css class name for the target list.
 */
function DwtAddRemove(parent, className, posStyle, sourceListClassName, targetListClassName) {
	if (arguments.length == 0) return;
	className = className || "DwtAddRemove";
	posStyle = posStyle || DwtControl.STATIC_STYLE;
	DwtComposite.call(this, parent, className, posStyle);
	this._createHTML(sourceListClassName, targetListClassName);
	this.isUpdating = false;
}

DwtAddRemove.prototype = new DwtComposite;
DwtAddRemove.prototype.constructor = DwtAddRemove;

DwtAddRemove.prototype.toString = function() {
	return "DwtAddRemove";
}

//
// Constants
//

/***
DwtAddRemove.ORIENTATION_HORIZONTAL = 0;
DwtAddRemove.ORIENTATION_VERTICAL = 1;

DwtAddRemove.SELECTION_SINGLE = 0;
DwtAddRemove.SELECTION_MULTIPLE = 1;
/***/

//
// Data
//

/***
DwtAddRemove.prototype._orientation = DwtAddRemove.ORIENTATION_HORIZONTAL;
DwtAddRemove.prototype._selection = DwtAddRemove.SELECTION_SINGLE;
/***/

// visual controls
DwtAddRemove.prototype._sourceList;
DwtAddRemove.prototype._addAllButton;
DwtAddRemove.prototype._addButton;
DwtAddRemove.prototype._removeButton;
DwtAddRemove.prototype._removeAllButton;
DwtAddRemove.prototype._targetList;

//
// Public methods
//

// listeners

DwtAddRemove.prototype.addStateChangeListener = function(listener) {
	this._targetList.addStateChangeListener(listener);
}

DwtAddRemove.prototype.removeStateChangeListener = function(listener) {
	this._targetList.removeStateChangeListener(listener);
}

// properties

/***
DwtAddRemove.prototype.setOrientation = function(orientation) {
	this._orientation = orientation;
}
DwtAddRemove.prototype.getOrientation = function() {
	return this._orientation;
}
DwtAddRemove.prototype.isHorizontal = function() {
	return this._orientation === DwtAddRemove.ORIENTATION_HORIZONTAL;
}
DwtAddRemove.prototype.isVertical = function() {
	return this._orientation === DwtAddRemove.ORIENTATION_VERTICAL;
}

DwtAddRemove.prototype.setSelection = function(selection) {
	this._selection = selection;
}
DwtAddRemove.prototype.getSelection = function() {
	return this._selection;
}
DwtAddRemove.prototype.isSingleSelect = function() {
	return this._selection === DwtAddRemove.SELECTION_SINGLE;
}
DwtAddRemove.prototype.isMultiSelect = function() {
	return this._selection === DwtAddRemove.SELECTION_MULTIPLE;
}
/***/

// public methods

DwtAddRemove.prototype.getSourceItems = function() {
	var list = this._sourceList.getList();
	var items = list ? list.clone().getArray() : [];
	return items ? items : [];
}
DwtAddRemove.prototype.setSourceItems = function(items) {
	this.removeAllSourceItems();
	this.addSourceItems(items);
}
DwtAddRemove.prototype.removeAllSourceItems = function() {
	// DwtListView#set calls removeAll and setUI
	//this._sourceList.removeAll();
	var list = new AjxVector();
	this._sourceList.set(list);
		
	this._addAllButton.setEnabled(false);
	this._addButton.setEnabled(false);
}
DwtAddRemove.prototype.removeSourceItem = function(item) {
	if (Array_contains(this.getSourceItems(), item)) {
		this._sourceList.removeItem(item);
		this._addAllButton.setEnabled(this.getSourceItems().length > 0);
		this._addButton.setEnabled(this._sourceList.getSelectionCount() > 0);
	}
}

DwtAddRemove.prototype.removeSourceItems = function(items) {
	for (var i = 0; i < items.length; i++) {
		this.removeSourceItem(items[i]);
	}
}

DwtAddRemove.prototype.addSourceItems = function(items) {
	for (var i = 0; i < items.length; i++) {
		this.addSourceItem(items[i]);
	}
}
DwtAddRemove.prototype.addSourceItem = function(item) {
	if (!Array_contains(this.getSourceItems(), item)) {
		this._sourceList.addItem(item);
		this._addAllButton.setEnabled(true);
	}
}

DwtAddRemove.prototype.getTargetItems = function() {
	var list = this._targetList.getList();
	var items = list ? list.clone().getArray() : [];
	return items ? items : [];
}
DwtAddRemove.prototype.setTargetItems = function(items) {
	this.removeAllTargetItems(false);
	this.addTargetItems(items);
}
DwtAddRemove.prototype.removeAllTargetItems = function(skipNotify) {
	// DwtListView#set calls removeAll and setUI
	//this._targetList.removeAll(skipNotify);
	var list = new AjxVector();
	this._targetList.set(list);
		
	this._removeButton.setEnabled(false);
	this._removeAllButton.setEnabled(false);
}
DwtAddRemove.prototype.removeTargetItem = function(item, skipNotify) {
	if (Array_contains(this.getTargetItems(), item)) {
		this._targetList.removeItem(item, skipNotify);
		this._removeButton.setEnabled(this._targetList.getSelectionCount() > 0);
		this._removeAllButton.setEnabled(this.getTargetItems().length > 0);
	}
}
DwtAddRemove.prototype.addTargetItems = function(items, skipNotify) {
	for (var i = 0; i < items.length; i++) {
		skipNotify = skipNotify || i < items.length - 1;
		this.addTargetItem(items[i], skipNotify);
	}
}
DwtAddRemove.prototype.addTargetItem = function(item, skipNotify) {
	if (!Array_contains(this.getTargetItems(), item)) {
		this._targetList.addItem(item, null, skipNotify);
		this._removeAllButton.setEnabled(true);
	}
}

// util methods

Array_contains = function(array, object) {
	for (var i = 0; i < array.length; i++) {
		if((array[i] instanceof String) && (object instanceof String) && (array[i].toString() == object.toString())) {
			return true;
		} else if (array[i] === object) {
			return true;
		}
	}
	return false;
}

// DwtComponent methods

DwtAddRemove.prototype.setEnabled = function(enabled) {
	// NOTE: DwtComposite doesn't propagate enabled to its children!
	//DwtComposite.prototype.setEnabled.call(this, enabled);
	this._sourceList.setEnabled(enabled);
	this._addAllButton.setEnabled(enabled ? this.getSourceItems().length > 0 : false);
	this._addButton.setEnabled(enabled ? this._sourceList.getSelectionCount() > 0 : false);
	this._removeButton.setEnabled(enabled ? this._targetList.getSelectionCount() > 0 : false);
	this._removeAllButton.setEnabled(enabled ? this.getTargetItems().length > 0 : false);
	this._targetList.setEnabled(enabled);
}

//
// Protected methods
//

/** @protected */
DwtAddRemove.prototype._sourceListListener = function(event) {
	var count = this._sourceList.getSelectionCount();
	this._addButton.setEnabled(count > 0);
}
/** @protected */
DwtAddRemove.prototype._addAllButtonListener = function(event) {
	this.isUpdating = true;
	var items = this.getSourceItems();
	//this.addTargetItems(items);
	for (var i = 0; i < items.length; i++) {
		var skipNotify = i < items.length - 1;
		this.addTargetItem(items[i], skipNotify);
	}
	this.removeAllSourceItems();
}
/** @protected */
DwtAddRemove.prototype._addButtonListener = function(event) {
	this.isUpdating = true;
	var itemDivs = this._sourceList.getSelectedItems().clone().getArray();
	for (var i = 0; i < itemDivs.length; i++) {
		var item = this._sourceList.getItemFromElement(itemDivs[i]);
		this.removeSourceItem(item);
		var skipNotify = i < itemDivs.length - 1;
		this.addTargetItem(item, skipNotify);
	}
}
/** @protected */
DwtAddRemove.prototype._removeButtonListener = function(event) {
	this.isUpdating = true;
	var itemDivs = this._targetList.getSelectedItems().clone().getArray();
	for (var i = 0; i < itemDivs.length; i++) {
		var item = this._targetList.getItemFromElement(itemDivs[i]);
		var skipNotify = i < itemDivs.length - 1;
		this.removeTargetItem(item, skipNotify);
		this.addSourceItem(item);
	}
}
/** @protected */
DwtAddRemove.prototype._removeAllButtonListener = function(event) {
	this.isUpdating = true;
	var items = this.getTargetItems();
	for (var i = 0; i < items.length; i++) {
		this.addSourceItem(items[i]);
	}
	this.removeAllTargetItems();
}
/** @protected */
DwtAddRemove.prototype._targetListListener = function(event) {
	var count = this._targetList.getSelectionCount();
	this._removeButton.setEnabled(count > 0);
}

/** @protected */
DwtAddRemove.prototype._createHTML = function(sourceListClassName, targetListClassName) {
	// if only one class name has been given, assume, both lists get the same class name.
	if (targetListClassName == null) targetListClassName = sourceListClassName;

	// create unique identifiers
	var thisId = this.getHtmlElement().id;
	var sourceDivId = thisId+"_source";
	var controlsDivId = thisId+"_controls";
	var targetDivId = thisId+"_target";

	// create html content
	var div = this.getHtmlElement();
	var width = 100; // REVISIT

	var table = document.createElement("TABLE");
	table.className = AjxBuffer.concat(this._className, "-", "outerTable");
	
	var row = table.insertRow(table.rows.length);

	var sourceDiv = row.insertCell(row.cells.length);
	sourceDiv.className = "DwtAddRemove-sourceContainer";
	sourceDiv.id = sourceDivId;
	sourceDiv.width = width; // REVISIT
	
	var controlsDiv = row.insertCell(row.cells.length);
	controlsDiv.className = "DwtAddRemove-controlsContainer";
	controlsDiv.id = controlsDivId;
	controlsDiv.align = "center";
	if (AjxEnv.isIE) {
		controlsDiv.style.paddingRight = "4px";
	}
	
	var targetDiv = row.insertCell(row.cells.length);
	targetDiv.className = "DwtAddRemove-targetContainer";
	targetDiv.id = targetDivId;
	targetDiv.width = width; // REVISIT

	div.appendChild(table);
		
	// create controls
	// REVISIT: replace with light-weight list boxes?
	this._sourceList = new DwtAddRemoveListView(this, sourceListClassName);
	this._addAllButton = new DwtButton(this);
	this._addButton = new DwtButton(this);
	this._removeButton = new DwtButton(this);
	this._removeAllButton = new DwtButton(this);
	this._targetList = new DwtAddRemoveListView(this, targetListClassName);

	// initialize controls
	this._sourceList._setNoResultsHtml = new Function();
	this._sourceList.addSelectionListener(new AjxListener(this, this._sourceListListener));

	this._addAllButton.setText(AjxMsg.addAll);
	this._addAllButton.setEnabled(false);
	this._addAllButton.addSelectionListener(new AjxListener(this, this._addAllButtonListener));

	this._addButton.setText(AjxMsg.add);
	this._addButton.setEnabled(false);
	this._addButton.addSelectionListener(new AjxListener(this, this._addButtonListener));
	
	this._removeButton.setText(AjxMsg.remove);
	this._removeButton.setEnabled(false);
	this._removeButton.addSelectionListener(new AjxListener(this, this._removeButtonListener));

	this._removeAllButton.setText(AjxMsg.removeAll);
	this._removeAllButton.setEnabled(false);
	this._removeAllButton.addSelectionListener(new AjxListener(this, this._removeAllButtonListener));

	this._targetList._setNoResultsHtml = new Function();
	this._targetList.addSelectionListener(new AjxListener(this, this._targetListListener));

	// insert controls into html
	sourceDiv.appendChild(this._sourceList.getHtmlElement());
	
	controlsDiv.appendChild(this._addAllButton.getHtmlElement());
	controlsDiv.appendChild(document.createElement("BR"));
	controlsDiv.appendChild(this._addButton.getHtmlElement());
	controlsDiv.appendChild(document.createElement("BR"));
	controlsDiv.appendChild(this._removeButton.getHtmlElement());
	controlsDiv.appendChild(document.createElement("BR"));
	controlsDiv.appendChild(this._removeAllButton.getHtmlElement());
	
	targetDiv.appendChild(this._targetList.getHtmlElement());
	
} // DwtAddRemove#_createHTML

function DwtAddRemoveListView(parent, className, type) {
	className = className || "DwtAddRemoveListView";
	DwtListView.call(this, parent, className);
	this._type = type;
}
DwtAddRemoveListView.prototype = new DwtListView;
DwtAddRemoveListView.prototype.constructor = DwtAddRemoveListView;

DwtAddRemoveListView.prototype._createItemHtml = function(item, now, isDnDIcon) {
	var div = document.createElement("DIV");
	div.id = Dwt.getNextId();
	var rowClassName = "DwtAddRemoveListViewRow";
	div._styleClass = AjxBuffer.concat("Row ",rowClassName);
	div._selectedStyleClass = AjxBuffer.concat("Row-", DwtCssStyle.SELECTED, " ", rowClassName);
	div._selectedDisabledStyleClass = AjxBuffer.concat("Row-", DwtCssStyle.SELECTED, "-" , DwtCssStyle.DISABLED, " ", rowClassName);
	div.className = div._styleClass;
	if( typeof (item) == "object") {
		div.innerHTML = AjxStringUtil.htmlEncode(item.toString());
	} else {
		div.innerHTML = AjxStringUtil.htmlEncode(String(item));
	}
	this.associateItemWithElement(item, div, DwtListView.TYPE_LIST_ITEM);
	return div;
}

DwtAddRemoveListView.prototype._mouseUpAction =
function(ev, div) {
	if (ev.button == DwtMouseEvent.LEFT) {
		if (this._evtMgr.isListenerRegistered(DwtEvent.SELECTION)) {
			this._selEv.field = ev.target.id.substring(0, 3);
			this._evtMgr.notifyListeners(DwtEvent.SELECTION, this._selEv);
		}
	}
	return true;
}
