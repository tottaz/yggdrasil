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


function DwtDragSource(supportedOps) {
	this._supportedOps = supportedOps
	this._evtMgr = new AjxEventMgr();
}

DwtDragSource._DRAG_LISTENER = "DwtDragSource._DRAG_LISTENER";

DwtDragSource._dragEvent = new DwtDragEvent();

DwtDragSource.prototype.toString = 
function() {
	return "DwtDragSource";
}

DwtDragSource.prototype.addDragListener =
function(dragSourceListener) {
	this._evtMgr.addListener(DwtDragSource._DRAG_LISTENER, dragSourceListener);
}

DwtDragSource.prototype.removeDragListener =
function(dragSourceListener) {
	this._evtMgr.removeListener(DwtDragSource._DRAG_LISTENER, dragSourceListener);
}


/* 
* The following  methods are called by DwtControl during the Drag lifecycle 
*/


DwtDragSource.prototype._beginDrag =
function(operation, srcControl) {
	if (!(this._supportedOps & operation))
		return Dwt.DND_DROP_NONE;
		
	DwtDragSource._dragEvent.operation = operation;
	DwtDragSource._dragEvent.srcControl = srcControl;
	DwtDragSource._dragEvent.action = DwtDragEvent.DRAG_START;
	DwtDragSource._dragEvent.srcData = null;
	DwtDragSource._dragEvent.doit = true;
	this._evtMgr.notifyListeners(DwtDragSource._DRAG_LISTENER, DwtDragSource._dragEvent);
	return DwtDragSource._dragEvent.operation;
}

DwtDragSource.prototype._getData =
function() {
	DwtDragSource._dragEvent.action = DwtDragEvent.SET_DATA;
	this._evtMgr.notifyListeners(DwtDragSource._DRAG_LISTENER, DwtDragSource._dragEvent);
	return DwtDragSource._dragEvent.srcData;
}

DwtDragSource.prototype._endDrag =
function() {
	DwtDragSource._dragEvent.action = DwtDragEvent.DRAG_END;
	DwtDragSource._dragEvent.doit = false;
	this._evtMgr.notifyListeners(DwtDragSource._DRAG_LISTENER, DwtDragSource._dragEvent);
	return DwtDragSource._dragEvent.doit;
}
