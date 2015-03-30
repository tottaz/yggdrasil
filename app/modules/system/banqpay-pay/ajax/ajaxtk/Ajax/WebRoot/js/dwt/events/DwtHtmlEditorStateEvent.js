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


function DwtHtmlEditorStateEvent(init) {
	if (arguments.length == 0) return;
	DwtEvent.call(this, true);
	this.reset();
}

DwtHtmlEditorStateEvent.prototype = new DwtEvent;
DwtHtmlEditorStateEvent.prototype.constructor = DwtHtmlEditorStateEvent;

DwtHtmlEditorStateEvent.prototype.toString = 
function() {
	return "DwtHtmlEditorStateEvent";
}

DwtHtmlEditorStateEvent.prototype.reset =
function() {
	this.isBold = null;
	this.isItalic = null;
	this.isUnderline = null;
	this.isStrikeThru = null;
	this.isSuperscript = null;
	this.isSubscript = null;
	this.isOrderedList = null;
	this.isNumberedList = null;
	this.fontName = null;
	this.fontSize = null;
	this.style = null;
	this.backgroundColor = null;
	this.color = null;
	this.justification = null;
	this.direction = null;
}
