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


function DwtKeyEvent() {
	DwtUiEvent.call(this, true);
	this.reset(true);
}


DwtKeyEvent.KEY_END_OF_TEXT =  0x03;
DwtKeyEvent.KEY_TAB = 0x09;
DwtKeyEvent.KEY_RETURN = 0x0D;
DwtKeyEvent.KEY_ENTER = 0x0D;
DwtKeyEvent.KEY_ESCAPE = 0x1B;

DwtKeyEvent.prototype = new DwtUiEvent;
DwtKeyEvent.prototype.constructor = DwtKeyEvent;

DwtKeyEvent.prototype.toString = 
function() {
	return "DwtKeyEvent";
}

DwtKeyEvent.isKeyEvent =
function(ev) {
	return (ev.type.search(/^key/i) != -1);
}

DwtKeyEvent.isKeyPressEvent =
function(ev) {
	return (AjxEnv.isIE && ev.type == "keydown") || (ev.type == "keypress");
}

DwtKeyEvent.prototype.reset =
function(dontCallParent) {
	if (!dontCallParent)
		DwtUiEvent.prototype.reset.call(this);
	this.keyCode = 0;
	this.charCode = 0;
}


DwtKeyEvent.prototype.setFromDhtmlEvent =
function(ev) {
	ev = DwtUiEvent.prototype.setFromDhtmlEvent.call(this, ev);
	this.charCode = (ev.charCode) ? ev.charCode : ev.keyCode;
	this.keyCode = ev.keyCode;
}

DwtKeyEvent.getCharCode =
function(ev) {
	ev = DwtUiEvent.getEvent(ev);
	return AjxEnv.isSafari ? ev.keyCode : (ev.charCode || ev.keyCode);
}

DwtKeyEvent.copy = 
function(dest, src) {
	DwtUiEvent.copy(dest, src);
	dest.charCode = src.charCode;
	dest.keyCode = src.keyCode;
}
