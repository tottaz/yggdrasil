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
* This static class enables entities (e.g. DwtDialogs) to be dragged around within an app window. 
* The code is basically the same as in dom-drag.js from www.youngpup.net
*
* @author Ross Dargahi
*/

function DwtDraggable() {
}

DwtDraggable._dragEl = null;

/**
* @param dragEl	Element being dragged, can also be a handle e.g. the title bar in a dialog
* @param rootEl The actual element that will be moved. This will be a
* parent element of <i>dragEl</i> (optional) 
* @param minX	Minimum x coord to which we can drag (optional)
* @param maxX	Maximum x coord to which we can drag (optional)
* @param minY	Minimum y coord to which we can drag (optional)
* @param maxY	Maximum x coord to which we can drag (optional)
* @param dragStartCB AjxCallback that is called when dragging is started
* @param dragCB AjxCallback that is called when dragging
* @param dragEndCB AjxCallback that is called when dragging is ended
* @param swapHorizRef If true, then mouse motion to the right will move element left (optional)
* @param swapVertRef If true, then mouse motion to the bottom will move element up (optional)
* @param fXMapper function that overides this classes x coordinate transformations (optional)
* @param fYMapper function that overides this classes y coordinate transformations (optional)
*/
DwtDraggable.init = 
function(dragEl, rootEl, minX, maxX, minY, maxY, dragStartCB, dragCB, dragEndCB, 
		 swapHorizRef, swapVertRef, fXMapper, fYMapper) {
	dragEl.onmousedown = DwtDraggable._start;

	dragEl._hMode = swapHorizRef ? false : true;
	dragEl._vMode = swapVertRef ? false : true;

	dragEl._root = (rootEl && rootEl != null) ? rootEl : dragEl ;

	if (dragEl._hMode && isNaN(parseInt(dragEl._root.style.left))) 
		dragEl._root.style.left = "0px";
	if (dragEl._vMode && isNaN(parseInt(dragEl._root.style.top))) 
		dragEl._root.style.top = "0px";
		
	if (!dragEl._hMode && isNaN(parseInt(dragEl._root.style.right))) 
		dragEl._root.style.right = "0px";
	if (!dragEl._vMode && isNaN(parseInt(dragEl._root.style.bottom))) 
		dragEl._root.style.bottom = "0px";

	dragEl._minX = (typeof minX != 'undefined') ? minX : null;
	dragEl._minY = (typeof minY != 'undefined') ? minY : null;
	dragEl._maxX = (typeof maxX != 'undefined') ? maxX : null;
	dragEl._maxY = (typeof maxY != 'undefined') ? maxY : null;

	dragEl._xMapper = fXMapper ? fXMapper : null;
	dragEl._yMapper = fYMapper ? fYMapper : null;

	dragEl._root.onDragStart = dragStartCB
	dragEl._root.onDragEnd = dragEndCB
	dragEl._root.onDrag = dragCB;
}


DwtDraggable.setDragBoundaries =
function (dragEl ,minX, maxX, minY, maxY) {
	if (dragEl != null) {
		if (minX != null) dragEl._minX = minX;
		if (maxX != null) dragEl._maxX = maxX;
		if (minY != null) dragEl._minY = minY;
		if (maxY != null) dragEl._maxY = maxY;
	}
};

DwtDraggable._start =
function(e)	{
	var dragEl = DwtDraggable._dragEl = this;
	e = DwtDraggable._fixE(e);
	var x = parseInt(dragEl._hMode ? dragEl._root.style.left : dragEl._root.style.right );
	var y = parseInt(dragEl._vMode ? dragEl._root.style.top  : dragEl._root.style.bottom);
	if (dragEl._root.onDragStart)
		dragEl._root.onDragStart.run([x, y]);

	dragEl._lastMouseX = e.clientX;
	dragEl._lastMouseY = e.clientY;

	if (dragEl._hMode) {
		if (dragEl._minX != null)	
			dragEl._minMouseX = e.clientX - x + dragEl._minX;
		if (dragEl._maxX != null)
			dragEl._maxMouseX = dragEl._minMouseX + dragEl._maxX - dragEl._minX;
	} else {
		if (dragEl._minX != null)
			dragEl._maxMouseX = -dragEl._minX + e.clientX + x;
		if (dragEl._maxX != null)
			dragEl._minMouseX = -dragEl._maxX + e.clientX + x;
	}

	if (dragEl._vMode) {
		if (dragEl._minY != null)
			dragEl._minMouseY = e.clientY - y + dragEl._minY;
		if (dragEl._maxY != null)
			dragEl._maxMouseY = dragEl._minMouseY + dragEl._maxY - dragEl._minY;
	} else {
		if (dragEl._minY != null)
			dragEl._maxMouseY = -dragEl._minY + e.clientY + y;
		if (dragEl._maxY != null)
			dragEl._minMouseY = -dragEl._maxY + e.clientY + y;
	}

	document.onmousemove = DwtDraggable._drag;
	document.onmouseup = DwtDraggable._end;

	return false;
}


DwtDraggable._drag =
function(e)	{
	e = DwtDraggable._fixE(e);
	var dragEl = DwtDraggable._dragEl;

	var ey	= e.clientY;
	var ex	= e.clientX;
	var x = parseInt(dragEl._hMode ? dragEl._root.style.left : dragEl._root.style.right );
	var y = parseInt(dragEl._vMode ? dragEl._root.style.top  : dragEl._root.style.bottom);
	var nx, ny;

	if (!dragEl._xMapper) {
		if (dragEl._minX != null)
			ex = dragEl._hMode ? Math.max(ex, dragEl._minMouseX) : Math.min(ex, dragEl._maxMouseX);
		if (dragEl._maxX != null)
			ex = dragEl._hMode ? Math.min(ex, dragEl._maxMouseX) : Math.max(ex, dragEl._minMouseX);
		nx = x + ((ex - dragEl._lastMouseX) * (dragEl._hMode ? 1 : -1));
	} else {
		nx = dragEl._xMapper(x, ex);
	}

	if (!dragEl._yMapper) {
		if (dragEl._minY != null)
			ey = dragEl._vMode ? Math.max(ey, dragEl._minMouseY) : Math.min(ey, dragEl._maxMouseY);
		if (dragEl._maxY != null)
			ey = dragEl._vMode ? Math.min(ey, dragEl._maxMouseY) : Math.max(ey, dragEl._minMouseY);
		ny = y + ((ey - dragEl._lastMouseY) * (dragEl._vMode ? 1 : -1));
	} else {
		ny = dragEl._yMapper(y, ey);
	}

	DwtDraggable._dragEl._root.style[dragEl._hMode ? "left" : "right"] = nx + "px";
	DwtDraggable._dragEl._root.style[dragEl._vMode ? "top" : "bottom"] = ny + "px";
	DwtDraggable._dragEl._lastMouseX = ex;
	DwtDraggable._dragEl._lastMouseY = ey;

	if (DwtDraggable._dragEl._root.onDrag)
		DwtDraggable._dragEl._root.onDrag.run([nx, ny]);
		
	return false;
}

DwtDraggable._end =
function() {
	document.onmousemove = null;
	document.onmouseup   = null;
	if (DwtDraggable._dragEl._root.onDragEnd)
		DwtDraggable._dragEl._root.onDragEnd.run([parseInt(DwtDraggable._dragEl._root.style[DwtDraggable._dragEl._hMode ? "left" : "right"]), 
											 	 parseInt(DwtDraggable._dragEl._root.style[DwtDraggable._dragEl._vMode ? "top" : "bottom"])]);
	DwtDraggable._dragEl = null;
}

DwtDraggable._fixE =
function(e) {
	if (typeof e == 'undefined')
		e = window.event;
	if (typeof e.layerX == 'undefined')
		e.layerX = e.offsetX;
	if (typeof e.layerY == 'undefined')
		e.layerY = e.offsetY;
	return e;
}
