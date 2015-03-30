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
* This class represents a list of items.
* @author Conrad Damon
*/
function DvItemList(attrList) {
	DvList.call(this, true);
	
	this._attrList = attrList;
}

DvItemList.prototype = new DvList;
DvItemList.prototype.constructor = DvItemList;

DvItemList.prototype.toString = 
function() {
	return "DvItemList";
}

/**
* Adds the given item to this list, and notifies listeners.
*
* @param item		an item
*/
DvItemList.prototype.add = 
function(item) {
	DvList.prototype.add.call(this, item);
	this._eventNotify(DvEvent.E_CREATE, item);
}

/**
* Removes the given items from this list, and notifies listeners.
*
* @param list		a list of items to remove
*/
DvItemList.prototype.remove = 
function(list) {
	var deleted = new Array();
	for (var i = 0; i < list.length; i++)
		if (DvList.prototype.remove.call(this, item))
			deleted.push(item);

	this._eventNotify(DvEvent.E_DELETE, deleted);
}

/**
* Updates the given list of items with new values.
*
* @param list		a list of items to update
* @param hash		attribute ID/value pairs to change
*/
DvItemList.prototype.update = 
function(list, hash) {
	var modified = new Array();
	var changes = new Object();
	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		for (var attr in hash) {
			var id = this._attrList.getByName(attr).id;
			item.setValue(id, hash[attr]);
			changes[id] = hash[attr];
		}
		modified.push(item);
	}
	this._eventNotify(DvEvent.E_MODIFY, modified, {changes: changes});
}

/**
* Populates this list from the given set of item values.
*
* @param attrList		complete list of attributes
* @param items			list of items (each is a list of values)
*/
DvItemList.prototype.load = 
function(attrList, items) {
	for (var i = 0; i < items.length; i++)
		this.add(new DvItem(i + 1, attrList, items[i]));
}

/**
* Returns the items in this list that have an attribute with the given name that has the
* given value.
*
* @param attr		an attribute name
* @param value		a value
*/
DvItemList.prototype.getByKey =
function(attr, value) {
	attr = this._attrList.getByName(attr).id;
	var list = new Array();
	var a = this.getArray();
	for (var i = 0; i < a.length; i++) {
		var item = a[i];
		if (item.getValue(attr) == value)
			list.push(item);
	}
	return list;
}
