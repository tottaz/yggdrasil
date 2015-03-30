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
* This class provides a small application to view data as items. Visually, it consists of a list of
* items on the right, and a panel on the left to filter that list by various attributes. Multiple users
* can use a single instance; their lists and filters are maintained separately. Each user has a tab that
* is connected to their list.
* @author Conrad Damon
*
* @param attrs			canonical list of attributes and their types
* @param data			initial (full) data set of items
* @param users			list of users
* @param displayAttrs	list of attributes to use as column headers
* @param filterAttrs	list of attributes to filter on
*/
function DvController(attrs, data, users, displayAttrs, filterAttrs) {

	// Create the shell
	this._shell = new DwtShell("MainShell");
	this._shellSz = this._shell.getSize();
	this._shell.addControlListener(new AjxListener(this, this._shellControlListener));

	// The tab view holds the tabs and their views
	this._tabView = new DwtTabView(this._shell, null, DwtControl.ABSOLUTE_STYLE);

	// Load the attributes
	this._attrList = new DvAttrList();
	this._attrList.load(attrs);
	this._displayAttrs = displayAttrs ? this._getAttrs(displayAttrs) : this._attrList.getArray();
	this._filterAttrs = filterAttrs ? this._getAttrs(filterAttrs) : this._attrList.getArray();

	// Load the item data
	this._itemList = new DvItemList(this._attrList);
	this._itemList.load(this._attrList, data);
	this._loadOptions(); // dynamically generates list of choices for multiselect attributes

	// Filter panel support
	this._filterPanel = new Object();
	var paginationCallback = new AjxCallback(this, this._paginate);
	var filterListener = new AjxListener(this, this._filterButtonListener);
	var dataListener = new AjxListener(this, this._dataButtonListener);

	// Create a filter panel for each user
	this._users = users;
	for (var i = 0; i < users.length; i++) {
		this._filterPanel[i] = new DvFilterPanel(this._shell, this._attrList, i, paginationCallback);
		this._filterPanel[i].set(this._filterAttrs, this._itemList.size(), this._numPages(this._itemList));
		this._filterPanel[i]._filterButton.addSelectionListener(filterListener);
		this._filterPanel[i]._dataButton.addSelectionListener(dataListener);
	}		

	// View defaults to first user on startup
	this._curList = new Object();
	this._layoutInfo = new Object();
	this.setCurrentUser(0);

	// Load the initial set of data into each user's view
	var listSelectionListener = new AjxListener(this, this._listSelectionListener);
	for (var i = 0; i < users.length; i++) {
		this._applyFilter(null, i);
		var view = new DvTabView(this._shell, this._displayAttrs, i, this);
		this._paginate(1, view._listView, i);
		this._tabView.addTab(users[i], view);
		view._listView.addSelectionListener(listSelectionListener);
		view._listView.setParentTabView(this._tabView);
	}

	// Bring the tab view to the top
	this._tabView.zShow(true);

	// Create vertical sash between view and filter panel
	this._sash = new DwtSash(this._shell, DwtSash.HORIZONTAL_STYLE, "AppSash-horiz", 5);
	this._sash.registerCallback(this._sashCallback, this);
	
	this._layout();

	// track sash situation for each user
	var viewBds = this._tabView.getBounds();
	for (var i = 0; i < users.length; i++) {
		var filterSz = this._filterPanel[i].getSize();
		this._layoutInfo[i] = {filterW: filterSz.x, viewX: viewBds.x, viewW: viewBds.width};
	}	
}

// Public methods

/**
* Adds an item to the canonical list. The item is a hash with attribute names as keys.
*
* TODO: test it against each user's current filter to see whether to add it to their current list
*
* @param item		an item
*/
DvController.prototype.add =
function(item) {
	var newItem = new DvItem(this._itemList.size() + 1);
	for (var attr in item) {
		var id = this._attrList.getByName(attr).id;
		newItem.setValue(id, item[attr]);
	}
	this._itemList.add(newItem);
}

/**
* Removes one or more items from the canonical list, and from any view that is displaying it. Any 
* item matching the given key/value pair will be removed.
*
* @param attr		an attribute name
* @param value		an attribute value
*/
DvController.prototype.remove =
function(attr, value) {
	var list = this._itemList.getByKey(attr, value);
	this._itemList.remove(list);
}

/**
* Updates one or more items with the attribute/value pairs in the given hash.
*
* @param attr		an attribute name
* @param value		an attribute value
* @param hash		a hash of replacement attribute/value pairs
*/
DvController.prototype.update =
function(attr, value, hash) {
	var list = this._itemList.getByKey(attr, value);
	this._itemList.modify(list, hash);
}

/**
* Sets the filter panel to be that of the given user.
*
* @param user		a user ID
*/
DvController.prototype.setCurrentUser =
function(user) {
	if (user == this._curUser)
		return;
	DBG.println(AjxDebug.DBG1, "setting current user to " + user + " (" + this._users[user] + ")");
	this._curUser = user;
	for (var i = 0; i < this._users.length; i++)
		this._filterPanel[i].show(i == user);
	// draw panels and sash in correct places for this user
	if (this._layoutInfo[user]) {
		this._adjustSash(this._layoutInfo[user]);
		this._layout();
	}
}

DvController.prototype.getFullAttrList = 
function() {
	return this._attrList;
}

/**
* Sorts the current result set based on the given attribute.
*
* @param attr			a DvAttr to sort by
* @param ascending		if true, sort from least to greatest
*/
DvController.prototype.sortList = 
function(attr, ascending) {
	DvItem.sortAttribute = attr;
	this._curList[this._curUser].getVector().sort(DvItem.sortCompare);
	if (ascending === false)
		this._curList[this._curUser].getArray().reverse();
	this._paginate(1);
}

// Private methods

// Listeners

// Handles double-click on an item
DvController.prototype._listSelectionListener =
function(ev) {
	if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
		var attrId = 1;
		var attr = this._attrList.getById(attrId);
		var msg = AjxStringUtil.resolve(DvMsg.dblClick, [attr.name, ev.item.getValue(attrId)]);
		alert(msg);
	}
}

// Handles a press of the "Apply Filter" button by applying the current filter to the 
// canonical data set. The first page of the matching items will be shown.
DvController.prototype._filterButtonListener =
function(ev) {
	DBG.println(AjxDebug.DBG2, "DvController.prototype._filterButtonListener");
	var filter = this._filterPanel[this._curUser].getFilter();
	var list = this._applyFilter(filter);
	this._paginate(1);
}

// Handles a press of the "Original Data" button by showing the first page of the
// canonical list of items.
DvController.prototype._dataButtonListener =
function(ev) {
	DBG.println(AjxDebug.DBG2, "DvController.prototype._dataButtonListener");
	var list = this._applyFilter();
	this._paginate(1);
}

// Returns a list of DvAttr with the given names.
DvController.prototype._getAttrs =
function(attrNames) {
	var attrs = new Array();
	for (var i = 0; i < attrNames.length; i++)
		attrs.push(this._attrList.getByName(attrNames[i]));
	return attrs;
}

// Displays the given page of the given user.
DvController.prototype._paginate =
function(num, view, user) {
	var offset = (num - 1) * DvListView.PAGE_SIZE;
	if (user == null)
		user = this._curUser;
	DBG.println(AjxDebug.DBG1, "showing page " + num + ", " + this._curList[user].size() + " results");
	var list = this._curList[user].getSubList(offset, DvListView.PAGE_SIZE);
	if (!view)
		view = this._tabView.getActiveView()._listView;
	view.set(list);
	// Update the pagination info
	this._filterPanel[user].setPages(this._numPages(this._curList[user]), num);
}

// Returns the number of pages comprised by the given result set.
DvController.prototype._numPages =
function(list) {
	var size = list.size();
	var num = Math.floor(size / DvListView.PAGE_SIZE);
	if ((size % DvListView.PAGE_SIZE) > 0)
		num++;

	return num;
}

// Matches the given filter against the canonical list and sets the results for the given user.
DvController.prototype._applyFilter =
function(filter, user) {
	if (user == null)
		user = this._curUser;
	var list = new DvItemList();
	var a = this._itemList.getArray();
	for (var i = 0; i < a.length; i++) {
		var item = a[i];
		if (this._filterMatch(item, filter))
			list.add(item);
	}
	this._filterPanel[user].setFiltered(list.size());
	this._curList[user] = list;
	return list;
}

// Returns true if the given item matches the given filter. If no filter is provided,
// returns true.
DvController.prototype._filterMatch =
function(item, filter) {
	for (var id in filter) {
		var fval = filter[id]; // filter value
		var m = DvFilterPanel.parseId(id);
		var attr = this._attrList.getById(m.attrId);
		var ival = item.getValue(m.attrId); // item value
		var test = true;
		if (attr.type == DvAttr.T_STRING_EXACT) {
			// compare strings case-insensitively
			test = (ival.toLowerCase() == fval.toLowerCase());
		} else if (attr.type == DvAttr.T_STRING_CONTAINS) {
			// compare strings case-insensitively
			test = (ival.toLowerCase().indexOf(fval.toLowerCase()) != -1);
		} else if (attr.type == DvAttr.T_NUMBER) {
			test = (ival == fval);
		} else if (attr.type == DvAttr.T_NUMBER_RANGE) {
			test = (m.field == 1) ? ival >= fval : ival <= fval;
		} else if (attr.type == DvAttr.T_NUMBER_RANGE_BOUNDED) {
			test = (m.field == 1) ? ival >= fval : ival <= fval;
		} else if (attr.type == DvAttr.T_SELECT) {
			test = (ival == attr.options[fval]);
		} else if (attr.type == DvAttr.T_BOOLEAN) {
			// value for boolean gets set to "Y" or "N"
			test = (ival == fval);
		} else if (attr.type == DvAttr.T_DATE_RANGE) {
			var fdate = Date.parse(fval);
			var tdate = Date.parse(ival);
			if (fdate && tdate)
				test = (m.field == 1) ? tdate >= fdate : tdate <= fdate;
		} else if (attr.type == DvAttr.T_TIME_RANGE) {
			var ftime = parseInt(fval.replace(/[^\d]/g, ""));
			var itime = parseInt(ival.replace(/[^\d]/g, ""));
			test = (m.field == 1) ? itime >= ftime : itime <= ftime;
		} else if (attr.type == DvAttr.T_MULTI_SELECT) {
			// if any in the checkbox group matches, the group matches
			test = false;
			for (var cbId in fval) {
				if (ival == fval[cbId]) {
					test = true;
					break;
				}
			}
		}
		if (!test)
			return false;
	}
	return true;
}

// Populates the choices for the "Multiple Select" attributes with each of the known values.
DvController.prototype._loadOptions =
function() {
	var a = this._attrList.getArray();
	var b = this._itemList.getArray();
	var optionHash = new Object();
	for (var i = 0; i < a.length; i++) {
		var attr = a[i];
		if (attr.type == DvAttr.T_MULTI_SELECT) {
			optionHash[attr.id] = new Object();
			for (var j = 0; j < b.length; j++) {
				var value = b[j].getValue(attr.id);
				optionHash[attr.id][value] = true;
			}
		}
	}
	
	for (var attrId in optionHash) {
		var options = new Array();
		for (var value in optionHash[attrId])
			options.push(value);
		options.sort();
		var attr = this._attrList.getById(attrId);
		attr.options = options;
	}
}

// Draws the UI.
DvController.prototype._layout =
function() {
	
	var x = 0, y = 0;
	var height = this._shellSz.y;
	
	// filter panel
	var filterSz;
	if (this._filterPanel[this._curUser]) {
		DBG.println(AjxDebug.DBG1, "filterPanel: " + x + '/' + y + '/' + Dwt.DEFAULT + '/' + height);
		this._filterPanel[this._curUser].setBounds(x, y, Dwt.DEFAULT, height);
		filterSz = this._filterPanel[this._curUser].getSize();
		x += filterSz.x;
		this._filterPanel[this._curUser]._layout();
	}

	// sash
	if (this._sash && this._sash.getVisible()) {
		DBG.println(AjxDebug.DBG1, "sash: " + x + '/' + y + '/' + Dwt.DEFAULT + '/' + height);
		this._sash.setBounds(x, y, Dwt.DEFAULT, height);
		x += this._sash.getSize().x;
	}	

	// tab view
	if (this._tabView) {
		var width = this._shellSz.x - x;
		DBG.println(AjxDebug.DBG1, "tabView: " + x + '/' + y + '/' + width + '/' + height);
		this._tabView.setBounds(x, y, width, height - 55); // gotta take the tab heights into account
	}
}

// Handles sash movement. An attempt to move the sash beyond the extent of the filter 
// panel or the tab view results in no movement at all.
DvController.prototype._sashCallback =
function(delta) {
	var absDelta = Math.abs(delta);
	var viewBds = this._tabView.getBounds();
	var filterSz = this._filterPanel[this._curUser].getSize();
	// make sure we aren't moving too far
	if ((delta < 0 && (absDelta >= filterSz.x)) || (delta > 0 && (absDelta >= viewBds.width)))
		return 0;
	var info = {filterW: filterSz.x + delta, viewX: viewBds.x + delta, viewW: viewBds.width - delta};
	this._layoutInfo[this._curUser] = info;
	this._adjustSash(info);

	return delta;
}

// Sets the filter panel and view bounds based on sash movement
DvController.prototype._adjustSash =
function(info) {
	this._tabView.setBounds(info.viewX, Dwt.DEFAULT, info.viewW, Dwt.DEFAULT);
	this._filterPanel[this._curUser].setSize(info.filterW, Dwt.DEFAULT);
	this._filterPanel[this._curUser]._layout();
}

// Handles a browser window resize event.
DvController.prototype._shellControlListener =
function(ev) {
	if (ev.oldWidth != ev.newWidth || ev.oldHeight != ev.newHeight) {
		this._shellSz.x = ev.newWidth;;
		this._shellSz.y = ev.newHeight;
		this._layout();
	}
}
