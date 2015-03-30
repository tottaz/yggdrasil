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
* This class represents an item, as a collection of attributes and values.
* @author Conrad Damon
*
* @param id			a unique numeric ID
* @param attrs		a list of attribute IDs
* @param values		a list of values (order must match attributes)
*/
function DvItem(id, attrs, values) {

	DvModel.call(this);
	
	this.id = id;
	var a = attrs.getArray();
	for (var i = 0; i < a.length; i++)
		this.setValue(a[i].id, values[i]);
}

DvItem.sortAttribute = null;

/**
* Sort routine for use by Array.sort. Sorting is based on the attribute set in DvItem.sortAttribute.
*/
DvItem.sortCompare =
function(a, b) {
	var valA = a.getValue(DvItem.sortAttribute.id);
	var valB = b.getValue(DvItem.sortAttribute.id);

	if (valA == null && valB == null)
		return 0;
	else if (valA != null && valB == null)
		return 1;
	else if (valA == null && valB != null)
		return -1;

	var type = DvItem.sortAttribute.type;
	if (type == DvAttr.T_NUMBER || type == DvAttr.T_NUMBER_RANGE || 
		type == DvAttr.T_NUMBER_RANGE_BOUNDED) {
		return valA - valB;
	} else if (type == DvAttr.T_DATE_RANGE) {
		return Date.parse(valA) - Date.parse(valB);
	} else {
		var lcValA = valA.toLowerCase();
		var lcValB = valB.toLowerCase();
		return (lcValA == lcValB) ? 0 : (lcValA > lcValB) ? 1 : -1;
	}
}

DvItem.prototype = new DvModel;
DvItem.prototype.constructor = DvItem;

DvItem.prototype.toString = 
function() {
	return "DvItem";
}

/**
* Returns the value of the given attribute.
*
* @param attrId		an attribute ID
*/
DvItem.prototype.getValue =
function(attrId) {
	return this[attrId];
}

/**
* Associates a value with an attribute.
*
* @param attrId		an attribute ID
* @param value		a value
*/
DvItem.prototype.setValue =
function(attrId, value) {
	this[attrId] = value;
}

/**
* Clears out all the data in this object.
*/
DvItem.prototype.clear =
function() {
	for (var i in this)
		this[i] = null;
}
