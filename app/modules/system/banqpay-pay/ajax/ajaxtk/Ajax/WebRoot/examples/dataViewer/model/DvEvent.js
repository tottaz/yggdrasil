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
* Creates an empty event of the given type.
* @constructor
* @class
* @parameter type - the type of the source of the event
* This class represents an event that encapsulates some sort of change to a model (data).
* The event has a data type (eg conversation), an event type (eg delete), a source (the
* data object generating the event), and a hash of arbitrary information (details).
*/
function DvEvent() {

	this.event = null; //event type
	this.source = null;
	this._details = new Object();
}

// Listener types
DvEvent.L_MODIFY = 1;

// Event types
i = 1;
DvEvent.E_CREATE		= i++;
DvEvent.E_DELETE		= i++;
DvEvent.E_MODIFY		= i++;

// Public methods

DvEvent.prototype.toString = 
function() {
	return "DvEvent";
}

/**
* Sets the event type and source.
*
* @param event		event type
* @param source		object that generated the event (typically "this")
*/
DvEvent.prototype.set =
function(event, source) {
	this.event = event; 
	this.source = source; 
}

/**
* Adds an arbitrary bit of info to the event.
*
* @param field		the detail's name
* @param value		the detail's value
*/
DvEvent.prototype.setDetail =
function(field, value) {
	this._details[field] = value;
}

/**
* Returns an arbitrary bit of info from the event.
*
* @param field		the detail's name
*/
DvEvent.prototype.getDetail =
function(field) {
	return this._details[field];
}

/**
* Sets the event details. Any existing details will be lost.
*
* @param details	a hash representing event details
*/
DvEvent.prototype.setDetails =
function(details) {
	this._details = details ? details : new Object();
}

/**
* Returns the event details.
*/
DvEvent.prototype.getDetails =
function() {
	return this._details;
}
