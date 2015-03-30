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
* The filter panel provides the user a means to choose which items he would like to view.
* The list can be filtered by any of the selected attributes. The attribute's type determines
* what kind of input field will be used.
* @author Conrad Damon
*
* @param parent					DOM parent
* @param attrList				canonical list of attributes
* @param user					user ID (owner of this filter panel instance)
* @param paginationCallback		routine to call when a page number is clicked
*/
function DvFilterPanel(parent, attrList, user, paginationCallback) {

	DwtComposite.call(this, parent, "DvFilterPanel", Dwt.ABSOLUTE_STYLE);

	this.setScrollStyle(DwtControl.CLIP);
	this._attrList = attrList;
	this._user = user;
	this._paginationCallback = paginationCallback;

	this._treeHash = new Object();
	this._fieldIds = new Array();
	this._calIds = new Array();
	this._internalId = AjxCore.assignId(this);
	
	// popup calendar (reuse singleton)
	this._cal = new DwtCalendar(this.shell, null, DwtControl.ABSOLUTE_STYLE);
	this._cal.getHtmlElement().style.border = "1px solid black";
	this._cal.zShow(false);
	this._cal.setDate(new Date());
	this._cal.addSelectionListener(new AjxListener(this, this._calSelectionListener));

	this._treeSelectionListener = new AjxListener(this, this._treeListener);
	this._createElements();
}

// layout settings
DvFilterPanel.PAD = 5;
DvFilterPanel.LOWER_PANEL_HEIGHT = 120;

// input box widths
DvFilterPanel.W_TEXT = 20;
DvFilterPanel.W_NUMBER = 10;
DvFilterPanel.W_DATE = 10;

DvFilterPanel.FILTER_RE = /^u(\d+)a(\d+)f?(\d*)$/;

// handle click on mini-calendar icon or page number
DvFilterPanel._onClick =
function(ev) {
	ev = DwtUiEvent.getEvent(ev);
	var element = DwtUiEvent.getTargetWithProp(ev, "_filterPanel");
	if (!element) return;
	var id = element.id;
	DBG.println(AjxDebug.DBG1, element.tagName + " click event for " + id);
	var fp = AjxCore.objectWithId(element._filterPanel);
	if (id.indexOf("cal_") === 0) {
		fp._cal.setLocation(ev.clientX, ev.clientY);
		fp._cal.setZIndex(Dwt.Z_MENU);
		fp._calFieldId = id;
	} else if (id.indexOf("page_") === 0) {
		var m = id.match(/^page_u\d+_(\d+)$/);
		var num = m[1];
		DBG.println("go to page " + num);
		fp._paginationCallback.run(num);
	}
}

/**
* Creates a unique DOM id out of the given data, in the form "uNaNtNfN".
*
* @param user		user ID
* @param attr		an attribute
* @param field		a field number (optional)
*/
DvFilterPanel.createId =
function(user, attr, field) {
	var id = ["u", user, "a", attr.id].join("");
	if (field != null)
		id = [id, "f", field].join("");
	
	return id;
}

/**
* Returns the component fields of a DOM ID created by DvFilterPanel.createId().
*
* @param id		a DOM element ID
*/
DvFilterPanel.parseId =
function(id) {
	var m = id.match(DvFilterPanel.FILTER_RE);
	if (m)
		return {user: m[1], attrId: m[2], field: m[3]};
}

// Sets focus to target element of the given UI event.
DvFilterPanel._focus =
function(ev) {
	ev.target.focus();
}

DvFilterPanel.prototype = new DwtComposite();
DvFilterPanel.prototype.constructor = DvFilterPanel;

DvFilterPanel.prototype.toString = 
function() {
	return "DvFilterPanel";
}

// Public methods

/**
* The filter tree view is a bit different from a standard tree view. We want it to have two levels:
* At the top level, each item has an expand/collapse icon, a checkbox, and a name. When expanded,
* it will display a child item that provides one or more inputs for constructing filters. The child
* item doesn't need a node or a checkbox cell, so we hide those. Also, we don't need a selected
* item to be highlighted.
*
* @param attrs		list of attributes to use as filters
* @param numItems	number of items (for initial setting of stats)
* @param numPages	number of pages in canonical data set (for initial pagination UI)
*/
DvFilterPanel.prototype.set =
function(attrs, numItems, numPages) {
	for (var i = 0; i < attrs.length; i++) {
		var attr = attrs[i];
		// Create the top-level checkbox item
		var ti = new DwtTreeItem(this._tree, null, attr.name, null, false);
		ti.enableSelection(false);
		ti.enableAction(false);
		ti.setData(Dwt.KEY_ID, attr.id);
		ti.setData(Dwt.KEY_OBJECT, attr);
		this._treeHash[attr.id] = ti;

		// Create the input field based on the attribute type
		var text = this._getAttrText(attr);
		var ti1 = new DwtTreeItem(ti, null, text);
		// Don't let blank images shove us to the right
		ti1.showCheckBox(false);
		ti1.showExpansionIcon(false);
		
		// The following is for FireFox (Mozilla) focus problems
		if (AjxEnv.isNav) {
			if (attr.type == DvAttr.T_STRING_EXACT || attr.type == DvAttr.T_STRING_CONTAINS || attr.type == DvAttr.T_NUMBER) {
				var el = document.getElementById(DvFilterPanel.createId(this._user, attr));
				el.onmousedown = DvFilterPanel._focus;
			} else if (attr.type == DvAttr.T_NUMBER_RANGE || attr.type == DvAttr.T_DATE_RANGE || attr.type == DvAttr.T_TIME_RANGE) {
				var el = document.getElementById(DvFilterPanel.createId(this._user, attr, 1));
				el.onmousedown = DvFilterPanel._focus;
				el = document.getElementById(DvFilterPanel.createId(this._user, attr, 2));
				el.onmousedown = DvFilterPanel._focus;	
			}
		}
	}
	// Set stats
	this._numItems = numItems;
	this.setTotal(numItems);
	this.setFiltered(numItems);
	
	// Set up popup calendar links
	for (var i = 0; i < this._calIds.length; i++)
		this._setEventHandler(this._calIds[i], "onClick");
}

/**
* Shows or hides this filter panel
*
* @param show		if true, filter panel is shown
*/
DvFilterPanel.prototype.show =
function(show) {
	// IE bug: select inputs don't obey z-index
	if (AjxEnv.isIE) {
		var selects = this.getHtmlElement().getElementsByTagName("select");
		for (var i = 0; i < selects.length; i++)
			selects[i].style.display = show ? "inline" : "none";
	}
	this.zShow(show);
}

/**
* Sets the number of "Total Records" in the stats area.
*
* @param num		total number of records
*/
DvFilterPanel.prototype.setTotal =
function(num) {
	this._totalEl.innerHTML = num;
}

/**
* Sets the number of "Filtered Records" in the stats area.
*
* @param num		number of records that matched the filter
*/
DvFilterPanel.prototype.setFiltered =
function(num) {
	this._filteredEl.innerHTML = num;
}

/**
* Sets the pagination UI. All but the current page will be live links.
*
* @param num		number of pages in current result set
* @param current	number of page user is currently viewing
*/
DvFilterPanel.prototype.setPages =
function(num, current) {
	// No need for pagination if just one page
	if (num == 1) {
		this._pagesEl.innerHTML = "";
		return;
	}
	
	this._pageIds = new Array();
	var html = new Array();
	var i = 0;
	html[i++] = "Page: "
	for (var j = 1; j <= num; j++) {
		if (j != current) {
			var id = ["page_", "u", this._user, "_", j].join("");
			html[i++] = "<a id='" + id + "' href='javascript:;'>";
			this._pageIds.push(id);
		}
		html[i++] = j;
		if (j != current)
			html[i++] = "</a>";
		if (j < num)
			html[i++] = "&nbsp;";
	}
	this._pagesEl.innerHTML = html.join("");
	for (var i = 0; i < this._pageIds.length; i++)
		this._setEventHandler(this._pageIds[i], "onClick");
}

/**
* Returns a filter composed of the chosen attributes and their values. An attribute must have
* its box checked and have a value entered, or it won't be part of the filter.
*/
DvFilterPanel.prototype.getFilter =
function() {
	// First see which attributes are checked
	var items = this._tree.getItems();
	var checked = new Object();
	for (var i = 0; i < items.length; i++) {
		var ti = items[i];
		var attrId = ti.getData(Dwt.KEY_ID);
		checked[attrId] = ti._itemChecked;
	}
	var filter = new Object();
	// Iterate through all the input fields
	for (var i = 0; i < this._fieldIds.length; i++) {
		var id = this._fieldIds[i];
		var m = DvFilterPanel.parseId(id);
		
		if (!checked[m.attrId])	continue;
		
		var el = document.getElementById(id);
		var attr = this._attrList.getById(m.attrId);
		// Massage the value if necessary
		var value;
		if (attr.type == DvAttr.T_BOOLEAN) {
			if (el.checked)
				value = el.value;
		} else if (attr.type == DvAttr.T_MULTI_SELECT) {
			// checkboxes can be multi-valued
			var cbKey = DvFilterPanel.createId(this._user, attr);
			if (el.checked) {
				if (!filter[cbKey])
					filter[cbKey] = new Object();
				filter[cbKey][id] = attr.options[m.field];
			}
		} else {
			value = el.value;
		}
		if (value) {
			filter[id] = value;
			DBG.println(AjxDebug.DBG2, "add to filter: " + id + " / " + value);
		}
	}
	return filter;
}

/**
* Clears the filter panel.
*/
DvFilterPanel.prototype.reset =
function() {
	this._treePanel.dispose();
	this._treePanel = null;
	this._tree.dispose();
	this._tree = null;
	this._lowerPanel.dispose();
	this._lowerPanel = null;
	this._createElements();
}

// Private methods

// Builds the filter panel from its components.
DvFilterPanel.prototype._createElements =
function() {
	this._createTree();

	var filterButtonId = Dwt.getNextId();
	var dataButtonId = Dwt.getNextId();
	var totalId = Dwt.getNextId();
	var filteredId = Dwt.getNextId();
	var pagesId = Dwt.getNextId();
	this._createLowerPanel(filterButtonId, dataButtonId, totalId, filteredId, pagesId);

	this._filterButtonEl = document.getElementById(filterButtonId);
	this._dataButtonEl = document.getElementById(dataButtonId);
	this._totalEl = document.getElementById(totalId);
	this._filteredEl = document.getElementById(filteredId);
	this._pagesEl = document.getElementById(pagesId);

	this._createButtons();
	this._layout();
}

// Builds the tree that contains the attributes
DvFilterPanel.prototype._createTree =
function() {
	this._treePanel = new DwtComposite(this, "OverviewTreePanel", DwtControl.ABSOLUTE_STYLE);
	this._treePanel.setScrollStyle(DwtControl.SCROLL);
	this._tree = new DwtTree(this._treePanel, DwtTree.CHECKEDITEM_STYLE, "OverviewTree" , DwtControl.ABSOLUTE_STYLE);
	this._tree.addSelectionListener(this._treeSelectionListener);
}

// Creates the stuff at the bottom (buttons, stats, pages).
DvFilterPanel.prototype._createLowerPanel =
function(filterButtonId, dataButtonId, totalId, filteredId, pagesId) {

	this._lowerPanel = new DwtComposite(this, "OverviewTreePanel", DwtControl.ABSOLUTE_STYLE);

	var html = new Array();
	var i = 0;
	html[i++] = "<table style='width:100%;' cellpadding='0' cellspacing='5' border='0'>";
	html[i++] = "<tr><td colspan='2' id='" + filterButtonId + "'></td></tr>";
	html[i++] = "<tr><td colspan='2' id='" + dataButtonId + "'></td></tr>";
	html[i++] = "<tr><td>" + DvMsg.totalRecords + ":</td><td align='right' id='" + totalId + "'>0</td></tr>";
	html[i++] = "<tr><td>" + DvMsg.filteredRecords + ":</td><td align='right' id='" + filteredId + "'>0</td></tr>";
	html[i++] = "<tr><td colspan='2' id ='" + pagesId + "'></td></tr>";
	html[i++] = "</table>";

	this._lowerPanel.getHtmlElement().innerHTML = html.join("");
}

// Creates two buttons.
DvFilterPanel.prototype._createButtons =
function() {
	this._filterButton = new DwtButton(this, null, "DwtButton contrast");
	this._filterButton.setText(DvMsg.applyFilter);
	this._filterButtonEl.appendChild(this._filterButton.getHtmlElement());
	this._dataButton = new DwtButton(this, null, "DwtButton contrast");
	this._dataButton.setText(DvMsg.originalData);
	this._dataButtonEl.appendChild(this._dataButton.getHtmlElement());
}

// Layout is based on a fixed size for the lower panel.
DvFilterPanel.prototype._layout =
function() {
	var pad = DvFilterPanel.PAD;
	var x = pad, y = pad;
	var panelSz = this.getSize();
	var buttonSz = this._filterButton.getSize();
	var lph = DvFilterPanel.LOWER_PANEL_HEIGHT;

	var width = panelSz.x - pad - pad;
	this._lowerPanel.setBounds(x, panelSz.y - pad - lph, width, lph);
	this._treePanel.setBounds(x, y, width, panelSz.y - (3 * pad) - lph);
}

// Returns HTML with the type of input field appropriate for the given attribute,
// based on its type. Each field is given a unique DOM ID.
DvFilterPanel.prototype._getAttrText =
function(attr) {
	var tw = DvFilterPanel.W_TEXT;
	var nw = DvFilterPanel.W_NUMBER;
	var dw = DvFilterPanel.W_DATE;
	var html = new Array();
	var i = 0;
	var idBase = DvFilterPanel.createId(this._user, attr);
	// String types get a text field
	if (attr.type == DvAttr.T_STRING_EXACT || attr.type == DvAttr.T_STRING_CONTAINS) {
		var text = (attr.type == DvAttr.T_STRING_EXACT) ? DvMsg.matches : DvMsg.contains;
		html[i++] = "<table border='0' cellpadding='0' cellspacing='2'>";
		html[i++] = "<tr><td>" + text + ":</td></tr>";
		html[i++] = "<tr><td><input type='text' autocomplete='off' size='" + tw + "' id='" + idBase + "'></td></tr>";
		html[i++] = "</table>";
		this._fieldIds.push(idBase);
	// Single number gets a text field
	} else if (attr.type == DvAttr.T_NUMBER) {
		html[i++] = "<table border='0' cellpadding='0' cellspacing='2'>";
		html[i++] = "<tr><td>" + DvMsg.equals + ":</td><td><input type='text' autocomplete='off' size='" + nw + "' id='" + idBase + "'></td></tr>";
		html[i++] = "</table>";
		this._fieldIds.push(idBase);
	// Number range gets two text fields
	} else if (attr.type == DvAttr.T_NUMBER_RANGE) {
		var fieldId1 = DvFilterPanel.createId(this._user, attr, 1);
		var fieldId2 = DvFilterPanel.createId(this._user, attr, 2);
		html[i++] = "<table border='0' cellpadding='0' cellspacing='2'>";
		html[i++] = "<tr><td align='right'>" + DvMsg.greaterThan + ":</td>";
		html[i++] = "<td><input type='text' autocomplete='off' size='" + nw + "' id='" + fieldId1 + "'></td></tr>";
		html[i++] = "<tr><td align='right'>" + DvMsg.lessThan + ":</td>";
		html[i++] = "<td><input type='text' autocomplete='off' size='" + nw + "' id='" + fieldId2 + "'></td></tr>";
		html[i++] = "</table>";
		this._fieldIds.push(fieldId1, fieldId2);
	// Bounded number range gets two dropdown lists
	} else if (attr.type == DvAttr.T_NUMBER_RANGE_BOUNDED) {
		html[i++] = DvMsg.between + "&nbsp;";
		for (var k = 1; k <= 2; k++) {
			var fieldId = DvFilterPanel.createId(this._user, attr, k);
			html[i++] = "<select id='" + fieldId + "'>";
			for (var j = attr.options[0]; j <= attr.options[1]; j++)
				html[i++] = "<option value='" + j + "'>" + j + "</option>";
			html[i++] = "</select>";
			this._fieldIds.push(fieldId);
			if (k == 1)
				html[i++] = "&nbsp;" + DvMsg.and + "&nbsp;";
		}
	// Selects gets (surprise!) a select menu
	} else if (attr.type == DvAttr.T_SELECT) {
		if (!attr.options) return;
		html[i++] = "<select id='" + idBase + "'>";
		for (var j = 0; j < attr.options.length; j++)
			html[i++] = "<option value='" + j + "'>" + attr.options[j] + "</option>";
		html[i++] = "</select>";
		this._fieldIds.push(idBase);
	// Boolean gets a checkbox
	} else if (attr.type == DvAttr.T_BOOLEAN) {
		var name = "name_" + idBase;
		var fieldId1 = DvFilterPanel.createId(this._user, attr, 1);
		var fieldId2 = DvFilterPanel.createId(this._user, attr, 2);
		html[i++] = "<input type='radio' name='" + name + "' value='Y' id='" + fieldId1 + "'> " + DvMsg.yes + "&nbsp;";
		html[i++] = "<input type='radio' name='" + name + "' value='N' id='" + fieldId2 + "'> " + DvMsg.no;
		this._fieldIds.push(fieldId1, fieldId2);
	// Date range gets two text fields, and calendar icon links to a calendar widget
	} else if (attr.type == DvAttr.T_DATE_RANGE) {
		var fieldId1 = DvFilterPanel.createId(this._user, attr, 1);
		var fieldId2 = DvFilterPanel.createId(this._user, attr, 2);
		var calId1 = "cal_" + fieldId1;
		var calId2 = "cal_" + fieldId2;
		html[i++] = "<table border='0' cellpadding='0' cellspacing='2'>";
		html[i++] = "<tr><td>" + DvMsg.after + ":</td><td><input type='text' autocomplete='off' size='" + dw + "' id='" + fieldId1 + "'></td>";
		html[i++] = "<td><a id='" + calId1 + "' href='javascript:;'>" + AjxImg.getImageHtml("AppointmentIcon") + "</a></td></tr>";
		html[i++] = "<tr><td>" + DvMsg.before + ":</td><td><input type='text' autocomplete='off' size='" + dw + "' id='" + fieldId2 + "'></td>";
		html[i++] = "<td><a id='" + calId2 + "' href='javascript:;'>" + AjxImg.getImageHtml("AppointmentIcon") + "</a></td></tr>";
		html[i++] = "</table>";
		this._fieldIds.push(fieldId1, fieldId2);
		this._calIds.push(calId1, calId2);
	// Time range gets before and after text fields
	} else if (attr.type == DvAttr.T_TIME_RANGE) {
		var fieldId1 = DvFilterPanel.createId(this._user, attr, 1);
		var fieldId2 = DvFilterPanel.createId(this._user, attr, 2);
		html[i++] = "<table border='0' cellpadding='0' cellspacing='2'>";
		html[i++] = "<tr><td align='right'>" + DvMsg.after + ":</td>";
		html[i++] = "<td><input type='text' autocomplete='off' size='" + dw + "' id='" + fieldId1 + "'></td></tr>";
		html[i++] = "<tr><td align='right'>" + DvMsg.before + ":</td>";
		html[i++] = "<td><input type='text' autocomplete='off' size='" + dw + "' id='" + fieldId2 + "'></td></tr>";
		html[i++] = "</table>";
		this._fieldIds.push(fieldId1, fieldId2);
	// Checkboxes
	} else if (attr.type == DvAttr.T_MULTI_SELECT) {
		if (!attr.options) return;
		html[i++] = "<table border='0' cellpadding='0' cellspacing='2'>";
		for (var j = 0; j < attr.options.length; j++) {
			var fieldId = DvFilterPanel.createId(this._user, attr, j);
			html[i++] = "<tr><td><input type='checkbox' id='" + fieldId + "'></td><td>" + attr.options[j] + "</td></tr>";
			this._fieldIds.push(fieldId);
		}
		html[i++] = "</table>";
	}

	return html.join("");
}

// Adds a handler for the given event to the DOM object with the given DOM ID.
DvFilterPanel.prototype._setEventHandler = 
function(id, event) {
	var field = document.getElementById(id);
	field._filterPanel = this._internalId;
	var lcEvent = event.toLowerCase();
	field[lcEvent] = DvFilterPanel["_" + event];
}

// Listeners

// As a convenience, expand an item when it's checked to show the input field
DvFilterPanel.prototype._treeListener =
function(ev) {
	if (ev.detail == DwtTree.ITEM_CHECKED && ev.item._itemChecked)
		ev.item.setExpanded(true);
}

// Sets a double-clicked date from the calendar widget into the text field
DvFilterPanel.prototype._calSelectionListener =
function(ev) {
	if (ev.type == DwtCalendar.DATE_DBL_CLICKED) {
		DBG.println(AjxDebug.DBG1, "DvFilterPanel.prototype._calSelectionListener");
		this._cal.zShow(false);
		var d = this._cal.getDate();
		if (d) {
			var date = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
			var fieldId = this._calFieldId.substring(4, this._calFieldId.length);
			var field = document.getElementById(fieldId);
			field.value = date;
		}
	}
}
