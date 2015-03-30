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
* Creates a new, empty cache.
* @constructor
* @class
* This class represent a simple cache. So far, the cache does not do any management
* such as LRU, TTL, etc.
*
* @author Conrad Damon
*/
function AjxCache() {
	this._cache = new Object();
}

/**
* Adds a value with the given key to the cache.
*
* @param key	[primitive]		unique key
* @param value	[any]			value
*/
AjxCache.prototype.set =
function(key, value) {
	this._cache[key] = value;
}

/**
* Returns the value with the given key.
*
* @param key	[primitive]		unique key
*/
AjxCache.prototype.get =
function(key) {
	return this._cache[key];
}

/**
* Returns a list of all the values which have a certain value
* for a certain property.
*
* @param prop	[string]		a property
* @param value	[primitive]		a value
*/
AjxCache.prototype.getByProperty =
function(prop, value) {
	var list = new Array();
	for (var key in this._cache) {
		var obj = this._cache[key];
		if (obj instanceof Object && obj[prop] == value)
			list.push(obj);
	}
	return list;
}

/**
* Clears the cache.
*/
AjxCache.prototype.clearAll =
function() {
	for (var key in this._cache)
		this._cache[key] = null;
	this._cache = new Object();
}

/*
* Removes the value with the given key from the cache.
*
* @param key	[primitive]		unique key
*/
AjxCache.prototype.clear =
function(key) {
	this._cache[key] = null;
}

/*
* Removes all values which have a certain property with a certain value.
*
* @param prop	[string]		a property
* @param value	[primitive]		a value
*/
AjxCache.prototype.clearByProperty =
function(prop, value) {
	for (var key in this._cache) {
		var obj = this._cache[key];
		if (obj[prop] == value)
			this._cache[key] = null
	}
}
