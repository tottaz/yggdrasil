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
* Creates a control that allows the user to select items from a list, and
* places the selected items in another list.
* @constructor
* @class
* This class creates and manages a control that lets the user
* select items from a list. Two lists are maintained, one with items to select 
* from, and one that contains the selected items. Between them are buttons 
* to shuffle items back and forth between the two lists.
* <p>
* There are two types of buttons: one or more transfer buttons move items from
* the source list to the target list, and the remove button moves items from the
* target list to the source list. The client can specify its transfer buttons.
* If no specification is given, there will be a single transfer button called 
* "Add".</p>
* <p>
* The parent must implement search(columnItem, ascending) if column sorting
* is supported. It should also create a subclass of DwtChooser which returns
* the appropriate source and target list views, themselves subclasses of
* DwtChooserListView. Those subclasses must implement _getHeaderList() and
* _createItemHtml(item).</p>
* <p>
* There are two different layout styles, horizontal (with the list views at the
* left and right) and vertical (with the list views at the top and bottom). There
* are two different selection styles, single and multiple, which control how many
* items may appear in the target list view.</p>
*
* @author Conrad Damon
*
* @param parent			[DwtComposite]		containing widget
* @param className		[string]*			CSS class
* @param buttonInfo		[array]*			id/label pairs for transfer buttons
* @param layoutStyle	[constant]*			layout style (vertical or horizontal)
* @param selectStyle	[constant]*			multi-select (default) or single-select
* @param noDuplicates	[boolean]*			if true, prevent duplicates in target list
* @param rowHeight		[int]*				height of one row in a list view (single select style)
*/
function DwtChooser(params) {

	if (arguments.length == 0) return;
	DwtComposite.call(this, params.parent, params.className);

	this._layoutStyle = params.layoutStyle ? params.layoutStyle : DwtChooser.HORIZ_STYLE;
	this._selectStyle = params.selectStyle ? params.selectStyle : DwtChooser.MULTI_SELECT
	this._noDuplicates = params.noDuplicates;
	this._rowHeight = params.rowHeight ? params.rowHeight : 45; // 45 = header row + row with icon

	this._handleButtonInfo(params.buttonInfo);

	this._createHtml();
	this._initialize();
	var parentSz = params.parent.getSize();
	if (parentSz) {
		this.resize(parentSz.x, parentSz.y);
	}

	this._evt = new ZmEvent(ZmEvent.S_CHOOSER);
	this._evtMgr = new AjxEventMgr();
};

DwtChooser.prototype = new DwtComposite;
DwtChooser.prototype.constructor = DwtChooser;

// Consts

DwtChooser.HORIZ_STYLE	= 1;
DwtChooser.VERT_STYLE	= 2;

DwtChooser.SINGLE_SELECT	= 1;
DwtChooser.MULTI_SELECT		= 2;

DwtChooser.REMOVE_BTN_ID = "__remove__";

DwtChooser.prototype.toString = 
function() {
	return "DwtChooser";
};

/**
* Populates the source list view with the given list.
*
* @param list	[AjxVector]		list of items
*/
DwtChooser.prototype.setItems =
function(list) {
	this.sourceListView.set(list);
	if (list.size() > 0) {
		this.sourceListView.setSelection(list.get(0));	// select first item
	}
};

/**
* Returns the items that have been selected. If there are multiple transfer 
* buttons, then a hash with a vector for each one is returned. Otherwise, a
* single vector is returned.
*/
DwtChooser.prototype.getItems =
function() {
	return this._hasMultiButtons ? this._data : this._data[this._buttonInfo[0].id];
};

/**
* Sets the select style to the given style (single or multiple). Performs a resize
* in order to adjust the layout, and changes the label on the transfer button if it's
* the default one.
*/
DwtChooser.prototype.setSelectStyle =
function(style, noResize) {
	if (style == this._selectStyle) return;
	
	this._selectStyle = style;
	if (this._defLabel) {
		var button = this._button[this._buttonInfo[0].id];
		button.setText((style == DwtChooser.SINGLE_SELECT) ? AjxMsg.select : AjxMsg.add);
	}
	if (!noResize) {
		var curSz = this.getSize();
		this.resize(curSz.x, curSz.y);
	}
	
	// if we're going from multi to single, preserve the first target item
	if (style == DwtChooser.SINGLE_SELECT) {
		var item = null;
		for (var i in this._data) {
			if (this._data[i].size()) {
				item = this._data[i].get(0);
				break;
			}
		}
		if (item) {
			this.reset(DwtChooserListView.TARGET);
			this.transfer([item]);
		}
	}
};

/**
* Resets one or both list views.
*
* @param viewType	[constant]		source or target list view
*/
DwtChooser.prototype.reset =
function(viewType) {

	// clear out source list view and related data
	if (!viewType || viewType == DwtChooserListView.SOURCE) {
		this.sourceListView._resetList();
		if (this._list && this._list.size()) {
			this._list.clear();
		}
	}

	// clear out target list view and related data
	if (!viewType || viewType == DwtChooserListView.TARGET) {
		this.targetListView._resetList();
		for (var i in this._data) {
			this._data[i].removeAll();
		}
	}

	this._setActiveButton(this._buttonInfo[0].id); // make first button active by default
	this._enableButtons(true, false);
};

/**
* Adds a change listener.
*
* @param listener	[AjxListener]	a listener
*/
DwtChooser.prototype.addChangeListener = 
function(listener) {
	return this._evtMgr.addListener(ZmEvent.L_MODIFY, listener);
};

/**
* Removes the given change listener.
*
* @param listener	[AjxListener]	a listener
*/
DwtChooser.prototype.removeChangeListener = 
function(listener) {
	return this._evtMgr.removeListener(ZmEvent.L_MODIFY, listener);    	
};

DwtChooser.prototype.getSourceListView = 
function() {
	return document.getElementById(this._sourceListViewDivId);
};

DwtChooser.prototype.getButtons = 
function() {
	return document.getElementById(this._buttonsDivId);
};

DwtChooser.prototype.getTargetListView = 
function() {
	return document.getElementById(this._targetListViewDivId);
};

/**
* Notifies listeners of the given change event.
*
* @param event		[constant]		event type (see ZmEvent)
* @param details	[hash]*			additional information
*/
DwtChooser.prototype._notify =
function(event, details) {
	if (this._evtMgr.isListenerRegistered(ZmEvent.L_MODIFY)) {
		this._evt.set(event, this);
		this._evt.setDetails(details);
		this._evtMgr.notifyListeners(ZmEvent.L_MODIFY, this._evt);
	}
};

/*
* Creates the HTML framework, with placeholders for elements which are created
* later.
*/
DwtChooser.prototype._createHtml = 
function() {

	this._sourceListViewDivId	= Dwt.getNextId();
	this._targetListViewDivId	= Dwt.getNextId();
	this._buttonsDivId			= Dwt.getNextId();
	this._removeButtonDivId		= Dwt.getNextId();

	var html = [];
	var idx = 0;
	
	if (this._layoutStyle == DwtChooser.HORIZ_STYLE) {
		// start new table for list views
		html[idx++] = "<table cellspacing=0 cellpadding=0 border=0>";
		html[idx++] = "<tr>";

		// source list
		html[idx++] = "<td id='";
		html[idx++] = this._sourceListViewDivId;
		html[idx++] = "'></td>";

		// transfer buttons
		html[idx++] = "<td valign='middle' id='";
		html[idx++] = this._buttonsDivId;
		html[idx++] = "'>";
		for (var i = 0; i < this._buttonInfo.length; i++) {
			var id = this._buttonInfo[i].id;
			html[idx++] = "<div id='";
			html[idx++] = this._buttonDivId[id];
			html[idx++] = "'></div><br>";
		}
		// remove button
		html[idx++] = "<br><div id='";
		html[idx++] = this._removeButtonDivId;
		html[idx++] = "'></div></td>";

		// target list
		html[idx++] = "<td id='";
		html[idx++] = this._targetListViewDivId;
		html[idx++] = "'></td>";	

		html[idx++] = "</tr></table>";
	} else {
		// source list
		html[idx++] = "<div id='";
		html[idx++] = this._sourceListViewDivId;
		html[idx++] = "'></div>";

		// transfer buttons
		html[idx++] = "<div align='center' id='";
		html[idx++] = this._buttonsDivId;
		html[idx++] = "'>";
		html[idx++] = "<table><tr>";
		for (var i = 0; i < this._buttonInfo.length; i++) {
			var id = this._buttonInfo[i].id;
			html[idx++] = "<td id='";
			html[idx++] = this._buttonDivId[id];
			html[idx++] = "'></td>";
		}
		// remove button
		html[idx++] = "<td id='";
		html[idx++] = this._removeButtonDivId;
		html[idx++] = "'></td>";
		html[idx++] = "</tr></table></div>";

		// target list
		html[idx++] = "<div id='";
		html[idx++] = this._targetListViewDivId;
		html[idx++] = "'></div>";	
	}

	this.getHtmlElement().innerHTML = html.join("");
};

DwtChooser.prototype._handleButtonInfo = 
function(buttonInfo) {

	if (!buttonInfo) {
		this._defLabel = (this._selectStyle == DwtChooser.SINGLE_SELECT) ? AjxMsg.select : AjxMsg.add;
		buttonInfo = [ { label: this._defLabel } ];
	}
	this._buttonInfo = buttonInfo;

	// create IDs for button elements and their containers
	this._buttonDivId = {};
	this._buttonId = {};
	if (this._buttonInfo.length == 1) {
		if (!this._buttonInfo[0].id) {
			this._buttonInfo[0].id = Dwt.getNextId();
		}
		this._activeButtonId = this._buttonInfo[0].id;
	}			
	for (var i = 0; i < this._buttonInfo.length; i++) {
		var id = this._buttonInfo[i].id;
		this._buttonDivId[id] = Dwt.getNextId();
		this._buttonId[id] = Dwt.getNextId();
	}
	this._hasMultiButtons = (this._buttonInfo.length > 1);
};

/*
* Creates and places elements into the DOM.
*/
DwtChooser.prototype._initialize = 
function() {

	// create and add transfer buttons
	var buttonListener = new AjxListener(this, this._transferButtonListener);
	this._button = {};
	this._data = {};
	for (var i = 0; i < this._buttonInfo.length; i++) {
		var id = this._buttonInfo[i].id;
		this._button[id] = this._setupButton(id, this._buttonId[id], this._buttonDivId[id], this._buttonInfo[i].label);
		this._button[id].addSelectionListener(buttonListener);
		this._data[id] = new AjxVector();
	}

	// create and add source list view
	this.sourceListView = this._createSourceListView();
	this._addListView(this.sourceListView, this._sourceListViewDivId);
	this.sourceListView.addSelectionListener(new AjxListener(this, this._sourceListener));
	
	// create and add target list view
	this.targetListView = this._createTargetListView();
	this._addListView(this.targetListView, this._targetListViewDivId);
	this.targetListView.addSelectionListener(new AjxListener(this, this._targetListener));
	
	// create and add remove button
	this._removeButtonId = Dwt.getNextId();
	this._removeButton = this._setupButton(DwtChooser.REMOVE_BTN_ID, this._removeButtonId, this._removeButtonDivId, AjxMsg.remove);
	this._removeButton.addSelectionListener(new AjxListener(this, this._removeButtonListener));
};

/*
* Returns a source list view object. Intended to be overridden, since the
* one returned by the default implementation is not very useful.
*/
DwtChooser.prototype._createSourceListView =
function() {
	return new DwtChooserListView(this, DwtChooserListView.SOURCE);
};

/*
* Returns a target list view object. Intended to be overridden, since the
* one returned by the default implementation is not very useful.
*/
DwtChooser.prototype._createTargetListView =
function() {
	return new DwtChooserListView(this, DwtChooserListView.TARGET);
};

/*
* Adds a list view into the DOM and sets its size to fit in its container.
*
* @param listView		[DwtChooserListView]	the list view
* @param listViewDivId	[string]				ID of container DIV
*/
DwtChooser.prototype._addListView = 
function(listView, listViewDivId) {
	var listDiv = document.getElementById(listViewDivId);
 	listDiv.appendChild(listView.getHtmlElement());
	listView.setUI(null, true); // renders headers and empty list
	listView._initialized = true;
};

DwtChooser.prototype.resize =
function(width, height) {
	if (!width || !height) return;
	if (width == Dwt.DEFAULT && height == Dwt.DEFAULT) return;

	var buttonsDiv = document.getElementById(this._buttonsDivId);
	var btnSz = Dwt.getSize(buttonsDiv);
	var w, sh, th;
	if (this._layoutStyle == DwtChooser.HORIZ_STYLE) {
		w = (width == Dwt.DEFAULT) ? width : Math.floor(((width - btnSz.x) / 2) - 12);
		sh = th = height;
	} else {
		w = width;
		if (this._selectStyle == DwtChooser.SINGLE_SELECT) {
			sh = (height == Dwt.DEFAULT) ? height : height - btnSz.y - this._rowHeight - 30;
			th = (height == Dwt.DEFAULT) ? height : height - btnSz.y - sh - 30;
		} else {
			sh = th = (height == Dwt.DEFAULT) ? height : Math.floor(((height - btnSz.y) / 2) - 12);
		}
	}
	this.sourceListView.setSize(w, sh);
	this.targetListView.setSize(w, th);
};

/*
* Creates a transfer or remove button.
*
* @param id					[string]	button ID
* @param buttonId			[string]	ID of button element
* @param buttonDivId		[string]	ID of DIV that contains button
* @param label				[string]	button text
*/
DwtChooser.prototype._setupButton =
function(id, buttonId, buttonDivId, label) {
	var button = new DwtButton(this);
	button.setText(label);
	button.id = buttonId;
	button.setHtmlElementId(buttonId);
	button._activeClassName = button._origClassName + " DwtChooser-Active";
	button._nonActiveClassName = button._origClassName;
	button._buttonId = id;

	var buttonDiv = document.getElementById(buttonDivId);
	buttonDiv.appendChild(button.getHtmlElement());

	return button;
};

// Listeners

/*
* Single-click selects an item, double-click moves selected items to target list.
*
* @param ev		[DwtEvent]		click event
*/
DwtChooser.prototype._sourceListener =
function(ev) {
	if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
		// double-click performs transfer
		this.transfer(this.sourceListView.getSelection(), this._activeButtonId);
		this.sourceListView.deselectAll();
	} else if (this._activeButtonId == DwtChooser.REMOVE_BTN_ID) {
		// single-click activates appropriate transfer button if needed
		var id = this._lastActiveTransferButtonId ? this._lastActiveTransferButtonId : this._buttonInfo[0].id;
		this._setActiveButton(id);
	}
	this._enableButtons(true, false);
	this.targetListView.deselectAll();
};

/*
* Single-click selects an item, double-click removes it from the target list.
*
* @param ev		[DwtEvent]		click event
*/
DwtChooser.prototype._targetListener =
function(ev) {
	if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
		this._handleRemove(this.targetListView.getSelection());
	} else {
		this._enableButtons(false, true);
		this._setActiveButton(DwtChooser.REMOVE_BTN_ID);
		this.sourceListView.deselectAll();
	}
};

/*
* Clicking a transfer button moves selected items to the target list.
*
* @param ev		[DwtEvent]		click event
*/
DwtChooser.prototype._transferButtonListener =
function(ev) {
	var button = DwtUiEvent.getDwtObjFromEvent(ev);
	var id = button._buttonId;
	var sel = this.sourceListView.getSelection();
	if (sel && sel.length) {
		this.transfer(sel, id);
	} else {
		this._setActiveButton(id);
	}
};

/*
* Clicking the remove button removes selected items from the target list.
*
* @param ev		[DwtEvent]		click event
*/
DwtChooser.prototype._removeButtonListener =
function(ev) {
	this._handleRemove(this.targetListView.getSelection());
}

// Miscellaneous methods

/*
* Enable/disable the transfer and remove buttons.
*
* @param enableTransfer		[boolean]	if true, enable the transfer buttons
* @param enableRemove		[boolean]	if true, enable the remove button
*/
DwtChooser.prototype._enableButtons =
function(enableTransfer, enableRemove) {
	for (var i = 0; i < this._buttonInfo.length; i++) {
		var id = this._buttonInfo[i].id;
		this._button[id].setEnabled(enableTransfer);
	}
	this._removeButton.setEnabled(enableRemove);
};

/*
* Removes items from target list. Also handles button state.
*
* @param items		[array]		list of items to remove
* @param skipNotify	[boolean]*	if true, don't notify listeners
*/
DwtChooser.prototype._handleRemove =
function(items, skipNotify) {
	// remove the items
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		this.targetListView.removeItem(item);
		this._data[item._buttonId].remove(item);
	}

	// if the view is empty, disable the Remove button
	if (!this.targetListView.size()) {
		this._enableButtons(true, false);
		this._setActiveButton(this._activeButtonId);
	}

	if (!skipNotify) {
		this._notify(ZmEvent.E_MODIFY, {items: this.getItems()});
	}
};

/*
* Makes a button "active" (the default for double-clicks). Done by 
* manipulating the style class. The active/non-active class is set as the 
* "_origClassName" so that activation/triggering still work. This only
* applies if there are multiple transfer buttons.
*
* @param id		[string]	ID of button to make active
*/
DwtChooser.prototype._setActiveButton =
function(id) {
	if (!this._hasMultiButtons) {
		return;
	}
	if (id != this._activeButtonId) {
		var buttonId = (this._activeButtonId == DwtChooser.REMOVE_BTN_ID) ? this._removeButtonId : this._buttonId[this._activeButtonId];
		if (buttonId) {
			var oldButton = Dwt.getObjectFromElement(document.getElementById(buttonId));
			if (oldButton) {
				oldButton._origClassName = oldButton._nonActiveClassName;
				oldButton.setClassName(oldButton._origClassName);
			}
		}
		buttonId = (id == DwtChooser.REMOVE_BTN_ID) ? this._removeButtonId : this._buttonId[id];
		var button = Dwt.getObjectFromElement(document.getElementById(buttonId));
		if (button) {
			button._origClassName = button._activeClassName;
			button.setClassName(button._origClassName);
		}
		this._activeButtonId = id;
		if (id != DwtChooser.REMOVE_BTN_ID) {
			this._lastActiveTransferButtonId = id;
		}
	}
};

/*
* Adds items to the target list.
*
* @param items		[array]		list of items to move
* @param id			[string]*	ID of the transfer button that was used
* @param skipNotify	[boolean]*	if true, don't notify listeners
*/
DwtChooser.prototype.transfer =
function(items, id, skipNotify) {
	id = id ? id : this._activeButtonId;
	this._setActiveButton(id);
	if (this._selectStyle == DwtChooser.SINGLE_SELECT) {
		items = [items[0]];
		this.reset(DwtChooserListView.TARGET);
	}
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		if (this._noDuplicates && this._isDuplicate(item, this._data[id])) {
			continue;
		}
		item._buttonId = id;
		this._addToTarget(item, id);
		this._data[id].add(item);
	}
	this.sourceListView.deselectAll();
	if (!skipNotify) {
		this._notify(ZmEvent.E_MODIFY, {items: this.getItems()});
	}
};

/*
* Removes items from the target list.
*
* @param items		[array]		list of items to move
* @param skipNotify	[boolean]*	if true, don't notify listeners
*/
DwtChooser.prototype.remove =
function(items, skipNotify) {
	this._handleRemove(items, skipNotify);
};

DwtChooser.prototype._isDuplicate =
function(item, list) {
	return false;
};

/*
* Adds an item to the target list. If there are multiple transfer buttons, it keeps
* the items grouped depending on which button was used to move them.
*
* @param item	[object]	item to move
* @param id		[string]	ID of the transfer button that was used
*/
DwtChooser.prototype._addToTarget =
function(item, id) {
	var idx = null;
	if (this._hasMultiButtons) {
		// walk target list looking for valid place to insert item based on its button ID
		var children = this.targetListView._parentEl.childNodes;
		var len = children.length;
		var count = 0;
		var testItem = (len > 0) ? this.targetListView.getItemFromElement(children[count++]) : null;
	
		for (var i = 0; i < this._buttonInfo.length; i++) {
			if (id == this._buttonInfo[i].id) {
				while (testItem && testItem._buttonId == id)
					testItem = (len > count) ? this.targetListView.getItemFromElement(children[count++]) : null;
			}
		}
		var idx = (testItem && count <= len) ? (count - 1) : null;
	}
	
	this.targetListView.addItem(item, idx);
};


/**
* Creates a chooser list view.
* @constructor
* @class
* This base class represents a list view which contains items that can be transferred from it
* (source) or to it (target). Subclasses should implement  _getHeaderList(),
* _sortColumn(), and _createItemHtml().
*
* @author Conrad Damon
* @param parent			[DwtComposite]	containing widget
* @param type			[constant]		source or target
* @param className		[string]*		CSS class
*/
function DwtChooserListView(parent, type, className) {
	
	if (arguments.length == 0) return;
	className = className ? className : "DwtChooserListView";
	DwtListView.call(this, parent, className, null, this._getHeaderList(parent));

	this.type = type;
	this._chooserParent = parent.parent;
};

DwtChooserListView.SOURCE = 1;
DwtChooserListView.TARGET = 2;

DwtChooserListView.prototype = new DwtListView;
DwtChooserListView.prototype.constructor = DwtChooserListView;

DwtChooserListView.prototype._getHeaderList = function() {};

DwtChooserListView.prototype.toString = 
function() {
	return "DwtChooserListView";
};

/*
* DwtListView override to ignore right-clicks in list view.
*
* @param clickedEl		[element]	element that was clicked
* @param ev				[DwtEvent]	click event
*/
DwtChooserListView.prototype._itemClicked = 
function(clickedEl, ev) {
	// Ignore right-clicks, we don't support action menus
	if (!ev.shiftKey && !ev.ctrlKey && ev.button == DwtMouseEvent.RIGHT) {
		return;
	} else {
		DwtListView.prototype._itemClicked.call(this, clickedEl, ev);
	}
};

/*
* Called when a column header has been clicked.
*
* @param columnItem		[string]	ID for column that was clicked
* @param ascending		[boolean]	if true, sort in ascending order
*/
DwtChooserListView.prototype._sortColumn = 
function(columnItem, ascending) {
	this._chooserParent.search(columnItem, ascending);
};
