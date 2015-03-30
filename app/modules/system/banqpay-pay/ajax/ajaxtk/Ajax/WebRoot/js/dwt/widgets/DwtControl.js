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
* Creates a control. A control may be created in "deferred" mode, meaning that the UI portion of the control
* will be created "Just In Time". This is useful for widgets which may want to defer construction
* of elements (e.g. DwtTreeItem) until such time as is needed, in the interest of efficiency. Note that if 
* the control is a child of the shell, it won't become visible until its z-index is set.
* @constructor
* @class
* This class represents a control, the highest-level useable widget. A control is a displayable element with
* a set of attributes (size, location, etc) and behaviors (event handlers). A control does not have child
* elements.
*
* @author Ross Dargahi
* @param parent		the parent widget
* @param className	CSS class
* @param posStyle	positioning style (absolute, static, or relative)
* @param deferred	postpone initialization until needed
*/

function DwtControl(parent, className, posStyle, deferred) {

	if (arguments.length == 0) return;
 	this.parent = parent;
	if (parent != null && !(parent instanceof DwtComposite))
		throw new DwtException("Parent must be a subclass of Composite", DwtException.INVALIDPARENT, "DwtWidget");

	this._data = new Object();
	this._eventMgr = new AjxEventMgr();
	this._disposed = false;
    
 	if (parent == null) 
 		return;

	this._className = className ? className : "DwtControl";
	this._posStyle = posStyle;
	if (!deferred)
		this._initCtrl();
		
	this._hoverOverListener = new AjxListener(this, this._handleHoverOver);
	this._hoverOutListener = new AjxListener(this, this._handleHoverOut);
}

// static properties

DwtControl.STATIC_STYLE = Dwt.STATIC_STYLE;
DwtControl.ABSOLUTE_STYLE = Dwt.ABSOLUTE_STYLE;
DwtControl.RELATIVE_STYLE = Dwt.RELATIVE_STYLE;

DwtControl.CLIP = Dwt.CLIP;
DwtControl.VISIBLE = Dwt.VISIBLE;
DwtControl.SCROLL = Dwt.SCROLL;
DwtControl.FIXED_SCROLL = Dwt.FIXED_SCROLL;

DwtControl.DEFAULT = Dwt.DEFAULT;

DwtControl._NO_DRAG = 1;
DwtControl._DRAGGING = 2;
DwtControl._DRAG_REJECTED = 3;

DwtControl._DRAG_THRESHOLD = 3;

DwtControl.TOOLTIP_THRESHOLD = 5;

DwtControl._DND_HOVER_DELAY = 750;

// static methods

DwtControl._keyPressHdlr =
function(ev) {
	var obj = obj ? obj : DwtUiEvent.getDwtObjFromEvent(ev);
	if (!obj) return false;
	
	if (obj._toolTipContent != null) {
		var shell = DwtShell.getShell(window);
		var manager = shell.getHoverMgr();
		manager.setHoverOutListener(obj._hoverOutListener);
		manager.hoverOut();
		obj._tooltipClosed = false;
	}
}

DwtControl._dblClickHdlr = 
function(ev) {
	return DwtControl._mouseEvent(ev, DwtEvent.ONDBLCLICK);
}

DwtControl._mouseOverHdlr =
function(ev) {
	// Check to see if a drag is occurring. If so, don't process the mouse
	// over events.
	var captureObj = (DwtMouseEventCapture.getId() == "DwtControl") ? DwtMouseEventCapture.getCaptureObj() : null;
	if (captureObj != null) {
		ev = DwtUiEvent.getEvent(ev);
		ev._stopPropagation = true;
		return false;
	}
	var obj = DwtUiEvent.getDwtObjFromEvent(ev);
	if (!obj) return false;
	
	var mouseEv = DwtShell.mouseEvent;
	if (obj._dragging == DwtControl._NO_DRAG) {
		mouseEv.setFromDhtmlEvent(ev);
		if (obj.isListenerRegistered(DwtEvent.ONMOUSEOVER))
			obj.notifyListeners(DwtEvent.ONMOUSEOVER, mouseEv);
		// Call the tooltip after the listeners to give them a 
		// chance to change the tooltip text.
		if (obj._toolTipContent != null) {
			var shell = DwtShell.getShell(window);
			var manager = shell.getHoverMgr();
			if ((manager.getHoverObject() != this || !manager.isHovering()) && !DwtMenu.menuShowing()) {
				manager.reset();
				manager.setHoverObject(this);
				manager.setHoverOverData(obj);
				manager.setHoverOverDelay(DwtToolTip.TOOLTIP_DELAY);
				manager.setHoverOverListener(obj._hoverOverListener);
				manager.hoverOver(mouseEv.docX, mouseEv.docY);
			}
		}
	}
	mouseEv._stopPropagation = true;
	mouseEv._returnValue = false;
	mouseEv.setToDhtmlEvent(ev);
	return false;
};

DwtControl._mouseDownHdlr =
function(ev) {
	var obj = DwtUiEvent.getDwtObjFromEvent(ev);
	if (!obj) return false;
	
	if (obj._toolTipContent != null) {
		var shell = DwtShell.getShell(window);
		var manager = shell.getHoverMgr();
		manager.setHoverOutListener(obj._hoverOutListener);
		manager.hoverOut();
	}
	
	// If we have a dragSource, then we need to start capturing mouse events
	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev);
	if (obj._dragSource != null && mouseEv.button == DwtMouseEvent.LEFT
			&& obj._isValidDragObject(mouseEv)) 
	{
		try {
			obj._ctrlCaptureObj.capture();
		} catch (ex) {
			DBG.dumpObj(ex);
		}
		obj._dragOp = (mouseEv.ctrlKey) ? Dwt.DND_DROP_COPY : Dwt.DND_DROP_MOVE;
		obj._dragStartX = mouseEv.docX;
		obj._dragStartY = mouseEv.docY;
	}
	
	return DwtControl._mouseEvent(ev, DwtEvent.ONMOUSEDOWN, obj, mouseEv);
}

DwtControl._mouseMoveHdlr =
function(ev) {
	// If captureObj == null, then we are not a Draggable control or a 
	// mousedown event has not occurred , so do the default behaviour, 
	// else do the draggable behaviour 
	var captureObj = (DwtMouseEventCapture.getId() == "DwtControl") ? DwtMouseEventCapture.getCaptureObj() : null;
	var obj = (captureObj) ? captureObj.targetObj : DwtUiEvent.getDwtObjFromEvent(ev);
 	if (!obj) return false;

	//DND cancel point
	if (obj._dndHoverActionId != -1) {
		AjxTimedAction.cancelAction(obj._dndHoverActionId);
		obj._dndHoverActionId = -1;
	}

	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev);

	// This following can happen during a DnD operation if the mouse moves
	// out the window. This seems to happen on IE only.
	if (mouseEv.docX < 0 || mouseEv.docY < 0) {
		mouseEv._stopPropagation = true;
		mouseEv._returnValue = false;
		mouseEv.setToDhtmlEvent(ev);
		return false;
	}
	
	// If we are not draggable or if we have not started dragging and are 
	// within the Drag threshold then simply handle it as a move.
	if (obj._dragSource == null || captureObj == null
		|| (obj != null && obj._dragging == DwtControl._NO_DRAG 
			&& Math.abs(obj._dragStartX - mouseEv.docX) < 
			   DwtControl._DRAG_THRESHOLD 
			&& Math.abs(obj._dragStartY - mouseEv.docY) < 
			   DwtControl._DRAG_THRESHOLD)) {
		if (obj._toolTipContent != null) {
			var shell = DwtShell.getShell(window);
			var manager = shell.getHoverMgr();
			if (!manager.isHovering() && !obj._tooltipClosed && !DwtMenu.menuShowing()) {
				// NOTE: mouseOver already init'd other hover settings
				// We do hoverOver() here since the mouse may have moved during
				// the delay, and we want to use latest x,y
				manager.hoverOver(mouseEv.docX, mouseEv.docY);
			} else {
				var deltaX = obj._lastTooltipX ? Math.abs(mouseEv.docX - obj._lastTooltipX) : null;
				var deltaY = obj._lastTooltipY ? Math.abs(mouseEv.docY - obj._lastTooltipY) : null;
				if ((deltaX != null && deltaX > DwtControl.TOOLTIP_THRESHOLD) || 
					(deltaY != null && deltaY > DwtControl.TOOLTIP_THRESHOLD)) {
					manager.setHoverOutListener(obj._hoverOutListener);
					manager.hoverOut();
					obj._tooltipClosed = true; // prevent tooltip popup during moves in this object
				}
			}
		}
		return DwtControl._mouseEvent(ev, DwtEvent.ONMOUSEMOVE, obj, mouseEv);
	} else {
		// Deal with mouse moving out of the window etc...
		
		// If we are not dragging, then see if we can drag. 
		// If we cannot drag this control, then
		// we will set dragging status to DwtControl._DRAG_REJECTED 
		if (obj._dragging == DwtControl._NO_DRAG) {
			obj._dragOp = obj._dragSource._beginDrag(obj._dragOp, obj);
			if (obj._dragOp != Dwt.DND_DROP_NONE) {
				obj._dragging = DwtControl._DRAGGING;
				obj._dndIcon = obj._getDnDIcon(obj._dragOp);
				if (obj._dndIcon == null)
					obj._dragging = DwtControl._DRAG_REJECTED;
			} else {
				obj._dragging = DwtControl._DRAG_REJECTED;
			}
		}
		
		// If we are draggable, then see if the control under the mouse 
		// (if one exists) will allow us to be dropped on it. 
		// This is done by (a) making sure that the drag source data type
		// can be dropped onto the target, and (b) that the application 
		// will allow it (i.e. via the listeners on the DropTarget
		if (obj._dragging != DwtControl._DRAG_REJECTED) {
			var destDwtObj = mouseEv.dwtObj;
			if (destDwtObj) {
				// Set up the drag hover event. we will even let this item hover over itself as there may be
				// scenarios where that will hold true
				obj._dndHoverAction.args = [ destDwtObj ];
				obj._dndHoverActionId = AjxTimedAction.scheduleAction(obj._dndHoverAction, DwtControl._DND_HOVER_DELAY);
			}

			if (destDwtObj && destDwtObj._dropTarget && destDwtObj != obj) {
				if (destDwtObj != obj._lastDestDwtObj || 
					destDwtObj._dropTarget.hasMultipleTargets()) {
					if (destDwtObj._dropTarget._dragEnter(
										obj._dragOp, 
										destDwtObj, 
										obj._dragSource._getData(), mouseEv)) {

						obj._setDnDIconState(true);
						obj._dropAllowed = true;
						destDwtObj._dragEnter(mouseEv);
					} else {
						obj._setDnDIconState(false);
						obj._dropAllowed = false;
					}
				} else if (obj._dropAllowed) {
					destDwtObj._dragOver(mouseEv);
				}
			} else {
				obj._setDnDIconState(false);
			}
			
			if (obj._lastDestDwtObj && obj._lastDestDwtObj != destDwtObj 
				&& obj._lastDestDwtObj._dropTarget 
				&& obj._lastDestDwtObj != obj) {

				obj._lastDestDwtObj._dragLeave(mouseEv);
				obj._lastDestDwtObj._dropTarget._dragLeave();
			}
			
			obj._lastDestDwtObj = destDwtObj;
					
			Dwt.setLocation(obj._dndIcon, mouseEv.docX + 2, mouseEv.docY + 2);
			// TODO set up timed event to fire off another mouseover event. 
			// Also need to cancel
			// any pending event, though we should do the cancel earlier 
			// in the code
		} else {
			// XXX: confirm w/ ROSS!
			DwtControl._mouseEvent(ev, DwtEvent.ONMOUSEMOVE, obj, mouseEv);
		}
		mouseEv._stopPropagation = true;
		mouseEv._returnValue = false;
		mouseEv.setToDhtmlEvent(ev);
		return false;
	}
}

DwtControl._mouseUpHdlr =
function(ev) {
	// See if are doing a drag n drop operation
	var captureObj = (DwtMouseEventCapture.getId() == "DwtControl") ? DwtMouseEventCapture.getCaptureObj() : null;
	var obj = (captureObj) ? captureObj.targetObj : DwtUiEvent.getDwtObjFromEvent(ev);
	if (!obj) return false;

	//DND
	if (obj._dndHoverActionId != -1) {
		AjxTimedAction.cancelAction(obj._dndHoverActionId);
		obj._dndHoverActionId = -1;
	}
	
	if (!obj._dragSource || !captureObj) {
		return DwtControl._mouseEvent(ev, DwtEvent.ONMOUSEUP, obj);
	} else {
		captureObj.release();
		var mouseEv = DwtShell.mouseEvent;
		mouseEv.setFromDhtmlEvent(ev);
		if (obj._dragging != DwtControl._DRAGGING) {
			obj._dragging = DwtControl._NO_DRAG;
			return DwtControl._mouseEvent(ev, DwtEvent.ONMOUSEUP, obj, mouseEv);
		} else {
			obj._lastDestDwtObj = null;
			var destDwtObj = mouseEv.dwtObj;
			if (destDwtObj != null && destDwtObj._dropTarget != null && 
				obj._dropAllowed && destDwtObj != obj) {
				destDwtObj._drop(mouseEv);
				destDwtObj._dropTarget._drop(obj._dragSource._getData(), mouseEv);
				obj._dragSource._endDrag();
				obj._destroyDnDIcon(obj._dndIcon);
				obj._dragging = DwtControl._NO_DRAG;
			} else {
				// The following code sets up the drop effect for when an 
				// item is dropped onto an invalid target. Basically the 
				// drag icon will spring back to its starting location.
				obj._dragEndX = mouseEv.docX;
				obj._dragEndY = mouseEv.docY;
				if (obj._badDropAction == null) {
					obj._badDropAction = new AjxTimedAction(obj, obj._badDropEffect);
				}
				
				// Line equation is y = mx + c. Solve for c, and set up d (direction)
				var m = (obj._dragEndY - obj._dragStartY) / (obj._dragEndX - obj._dragStartX);
				obj._badDropAction.args = [m, obj._dragStartY - (m * obj._dragStartX), (obj._dragStartX - obj._dragEndX < 0) ? -1 : 1];
				AjxTimedAction.scheduleAction(obj._badDropAction, 0);
			}
			mouseEv._stopPropagation = true;
			mouseEv._returnValue = false;
			mouseEv.setToDhtmlEvent(ev);
			return false;
		}
	}
}

DwtControl._mouseOutHdlr =
function(ev) {
	var obj = DwtUiEvent.getDwtObjFromEvent(ev);
	if (!obj) return false;

	if (obj._toolTipContent != null) {
		var shell = DwtShell.getShell(window);
		var manager = shell.getHoverMgr();
		manager.setHoverOutListener(obj._hoverOutListener);
		manager.hoverOut();
		obj._tooltipClosed = false;
	}
	return DwtControl._mouseEvent(ev, DwtEvent.ONMOUSEOUT, obj);
};

DwtControl._mouseWheelHdlr =
function(ev) {
	var obj = DwtUiEvent.getDwtObjFromEvent(ev);
	if (!obj) return false;
	return DwtControl._mouseEvent(ev, DwtEvent.ONMOUSEWHEEL, obj);
};

DwtControl._selectStartHdlr = 
function(ev) {
	return DwtControl._mouseEvent(ev, DwtEvent.ONSELECTSTART);
}

DwtControl._contextMenuHdlr = 
function(ev) {
	// for Safari, we have to fake a right click
	if (AjxEnv.isSafari) {
		var obj = DwtUiEvent.getDwtObjFromEvent(ev);
		var prevent = obj ? obj.preventContextMenu() : true;
		if (prevent) {
			DwtControl._mouseEvent(ev, DwtEvent.ONMOUSEDOWN);
			DwtControl._mouseEvent(ev, DwtEvent.ONMOUSEUP);
			return;
		}
	}
	return DwtControl._mouseEvent(ev, DwtEvent.ONCONTEXTMENU);
}

DwtControl._mouseEvent = 
function(ev, eventType, obj, mouseEv) {

	var obj = obj ? obj : DwtUiEvent.getDwtObjFromEvent(ev);
	if (!obj) return false;
	
	if (!mouseEv) {
		mouseEv = DwtShell.mouseEvent;
		mouseEv.setFromDhtmlEvent(ev);
	}

	// By default, we halt event processing. Listeners may override
	var tn = mouseEv.target.tagName.toLowerCase();
	if (tn != "input" && tn != "textarea") {
		// bug #6003 - Safari seems to follow propagation rules for clicks on scrollbar :(
		mouseEv._stopPropagation = obj.getPropagationForEvent();
		mouseEv._returnValue = obj.getReturnValueForEvent();
	} else {
		mouseEv._stopPropagation = false;
		mouseEv._returnValue = true;	
	}
	
	// notify global listeners
	DwtEventManager.notifyListeners(eventType, mouseEv);
	// notify widget listeners
	if (obj.isListenerRegistered && obj.isListenerRegistered(eventType))
		obj.notifyListeners(eventType, mouseEv);

	// publish our settings to the DOM
	mouseEv.setToDhtmlEvent(ev);
	return mouseEv._returnValue;
}

// need to populate this hash after methods are defined
DwtControl.HANDLER = new Object();
DwtControl.HANDLER[DwtEvent.ONCONTEXTMENU] = DwtControl._contextMenuHdlr;
DwtControl.HANDLER[DwtEvent.ONDBLCLICK] = DwtControl._dblClickHdlr;
DwtControl.HANDLER[DwtEvent.ONMOUSEDOWN] = DwtControl._mouseDownHdlr;
DwtControl.HANDLER[DwtEvent.ONMOUSEENTER] = DwtControl._mouseOverHdlr;
DwtControl.HANDLER[DwtEvent.ONMOUSELEAVE] = DwtControl._mouseOutHdlr;
DwtControl.HANDLER[DwtEvent.ONMOUSEMOVE] = DwtControl._mouseMoveHdlr;
DwtControl.HANDLER[DwtEvent.ONMOUSEOUT] = DwtControl._mouseOutHdlr;
DwtControl.HANDLER[DwtEvent.ONMOUSEOVER] = DwtControl._mouseOverHdlr;
DwtControl.HANDLER[DwtEvent.ONMOUSEUP] = DwtControl._mouseUpHdlr;
DwtControl.HANDLER[DwtEvent.ONMOUSEWHEEL] = DwtControl._mouseWheelHdlr;
DwtControl.HANDLER[DwtEvent.ONSELECTSTART] = DwtControl._selectStartHdlr;
DwtControl.HANDLER[DwtEvent.ONKEYPRESS] = DwtControl._keyPressHdlr;

// instance methods

DwtControl.prototype.toString = 
function() {
	return "DwtControl";
}

DwtControl.prototype.addControlListener = 
function(listener) {
	this.addListener(DwtEvent.CONTROL, listener);
}

DwtControl.prototype.removeControlListener = 
function(listener) { 
	this.removeListener(DwtEvent.CONTROL, listener);
}

DwtControl.prototype.addDisposeListener = 
function(listener) {
	this.addListener(DwtEvent.DISPOSE, listener);
}

DwtControl.prototype.removeDisposeListener = 
function(listener) { 
	this.removeListener(DwtEvent.DISPOSE, listener);
}

DwtControl.prototype.addListener =
function(eventType, listener) {
	return this._eventMgr.addListener(eventType, listener); 	
}

DwtControl.prototype.notifyListeners =
function(eventType, event) {
	return this._eventMgr.notifyListeners(eventType, event);
}

DwtControl.prototype.isListenerRegistered =
function(eventType) {
	return this._eventMgr.isListenerRegistered(eventType);
}

DwtControl.prototype.removeListener = 
function(eventType, listener) {
	return this._eventMgr.removeListener(eventType, listener);
}

DwtControl.prototype.removeAllListeners = 
function(eventType) {
	return this._eventMgr.removeAll(eventType);
}

DwtControl.prototype.dispose =
function() {
	if (this._disposed) return;

	if (this.parent != null)
		this.parent.removeChild(this);

	Dwt.disassociateElementFromObject(null, this);

	this._disposed = true;
	var ev = new DwtDisposeEvent();
	ev.dwtObj = this;
	this.notifyListeners(DwtEvent.DISPOSE, ev);
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// XXX: DEPRACATED
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
DwtControl.prototype.getDocument =
function() {
	//return document;
	alert("DEPRACATED: Please use document instead");
}

DwtControl.prototype.getData = 
function(key) {
	return this._data[key];
}

DwtControl.prototype.setData = 
function(key, value) {
  this._data[key] = value;
}

DwtControl.prototype.isDisposed =
function() {
	return this._isDisposed;
}

DwtControl.prototype.isInitialized =
function() {
	return this._ctrlInited;
}

DwtControl.prototype.getPropagationForEvent = 
function() {
	// overload me for dealing w/ browsers w/ weird quirks
	return true;
}

DwtControl.prototype.getReturnValueForEvent = 
function() {
	// overload me for dealing w/ browsers w/ weird quirks
	return false;
}

DwtControl.prototype.reparent =
function(newParent) {
	if (!this._checkState()) return;

	var htmlEl = this.getHtmlElement();
	this.parent.removeChild(this);
	DwtComposite._pendingElements[this._htmlElId] = htmlEl;
	newParent.addChild(this);
	this.parent = newParent;
	// TODO do we need a reparent event?
}

/**
* Reparents the HTML element of the control to the html element supplied as the
* parameter to this method. 
*
* @param htmlEl Either a string representing an ID, or an html element
*/
DwtControl.prototype.reparentHtmlElement =
function(htmlEl) {

	/* If htmlEl is a string, then it is an ID so lookup the html element that has
	 * the corresponding ID */
	if (typeof htmlEl == "string")
		htmlEl = document.getElementById(htmlEl);

	htmlEl.appendChild(this.getHtmlElement());
}

DwtControl.prototype.setHandler =
function(event, func) {
	if (!this._checkState()) return;

	var htmlElement = this.getHtmlElement();
	Dwt.setHandler(htmlElement, event, func);
};

DwtControl.prototype.clearHandler =
function(event) {
	if (!this._checkState()) return;
		
	var htmlElement = this.getHtmlElement();
	Dwt.clearHandler(htmlElement, event);
};

DwtControl.prototype.getBounds =
function(incScroll) {
	if (!this._checkState()) return;
		
	return Dwt.getBounds(this.getHtmlElement(), incScroll);
}

DwtControl.prototype.setBounds =
function(x, y, width, height) {
	if (!this._checkState()) return;
		
	var htmlElement = this.getHtmlElement();
	if (this.isListenerRegistered(DwtEvent.CONTROL)) {
		this._controlEvent.reset();
		var bds = Dwt.getBounds(htmlElement);
		this._controlEvent.oldX = bds.x;
		this._controlEvent.oldY = bds.y;
		this._controlEvent.oldWidth = bds.width;
		this._controlEvent.oldHeight = bds.height;
		Dwt.setBounds(htmlElement, x, y, width, height);
		bds = Dwt.getBounds(htmlElement);
		this._controlEvent.newX = bds.x;
		this._controlEvent.newY = bds.y;
		this._controlEvent.newWidth = bds.width;
		this._controlEvent.newHeight = bds.height;
		this.notifyListeners(DwtEvent.CONTROL, this._controlEvent);
	} else {
		Dwt.setBounds(htmlElement, x, y, width, height);
	}
	
	return this;
}

DwtControl.prototype.getClassName =
function() {
	return this._className;
}

DwtControl.prototype.setClassName =
function(className) {
	if (!this._checkState()) return;
		
	this._className = className;
	this.getHtmlElement().className = className;
}

DwtControl.prototype.getCursor = 
function() {
	if (!this._checkState()) return;
		
	return Dwt.getCursor(this.getHtmlElement());
}

DwtControl.prototype.setCursor =
function(cursorName) {
	if (!this._checkState()) return;
		
	Dwt.setCursor(this.getHtmlElement(), cursorName);
}

DwtControl.prototype.getDragSource =
function() {
	return this._dragSource;
}

DwtControl.prototype.setDragSource =
function(dragSource) {
	this._dragSource = dragSource;
	if (dragSource != null && this._ctrlCaptureObj == null) {
		this._ctrlCaptureObj = new DwtMouseEventCapture(this, "DwtControl", DwtControl._mouseOverHdlr,
				DwtControl._mouseDownHdlr, DwtControl._mouseMoveHdlr, 
				DwtControl._mouseUpHdlr, DwtControl._mouseOutHdlr);
		this._dndHoverAction = new AjxTimedAction(null, this._dndDoHover);
	}
}

DwtControl.prototype.getDropTarget =
function() {
	return this._dropTarget;
}

DwtControl.prototype.setDropTarget =
function(dropTarget) {
	this._dropTarget = dropTarget;
}

DwtControl.prototype.getEnabled =
function() {
	if (!this._checkState()) return;
		
	return this._enabled;
}

DwtControl.prototype.setEnabled =
function(enabled, setHtmlElement) {
	if (!this._checkState()) return;
		
	if (enabled != this._enabled) {
		this._enabled = enabled;
		if (setHtmlElement)
			this.getHtmlElement().disabled = !enabled;
	}
};

DwtControl.prototype.getHtmlElement =
function() {
	if (!this._checkState()) return;

	var htmlEl = document.getElementById(this._htmlElId);
	if (htmlEl == null) {
		htmlEl = DwtComposite._pendingElements[this._htmlElId];
	} else if (!htmlEl._rendered) {
		delete DwtComposite._pendingElements[this._htmlElId];
		htmlEl._rendered = true;
	}
	
	return htmlEl;
}

DwtControl.prototype.setHtmlElementId =
function(id) {
	if (this._disposed) return;
	
	if (this._ctrlInited) {
		var htmlEl = this.getHtmlElement();
		if (!htmlEl._rendered) {
			delete DwtComposite._pendingElements[this._htmlElId];
			DwtComposite._pendingElements[id] = htmlEl;
		}
		htmlEl.id = id;
	}
	this._htmlElId = id;
}

DwtControl.prototype.getX =
function() {
	if (!this._checkState()) return;
		
	return Dwt.getLocation(this.getHtmlElement()).x;
}

DwtControl.prototype.getXW =
function() {
	if (!this._checkState()) return;
		
    var bounds = this.getBounds();
	return bounds.x+bounds.width;
}

DwtControl.prototype.getY =
function() {
	if (!this._checkState()) return;
		
	return Dwt.getLocation(this.getHtmlElement()).y;
}

DwtControl.prototype.getYH =
function() {
	if (!this._checkState()) return;
		
    var bounds = this.getBounds();
	return bounds.y+bounds.height;
}

DwtControl.prototype.getLocation =
function() {
	if (!this._checkState()) return;
		
	return Dwt.getLocation(this.getHtmlElement());
}

DwtControl.prototype.setLocation =
function(x, y) {
	if (!this._checkState()) return;
		
	if (this.isListenerRegistered(DwtEvent.CONTROL)) {
		var htmlElement = this.getHtmlElement();
		this._controlEvent.reset();
		var loc = Dwt.getLocation(htmlElement);
		this._controlEvent.oldX = loc.x;
		this._controlEvent.oldY = loc.y;
		Dwt.setLocation(htmlElement, x, y);
		loc = Dwt.getLocation(htmlElement);
		this._controlEvent.newX = loc.x;
		this._controlEvent.newY = loc.y;
		this.notifyListeners(DwtEvent.CONTROL, this._controlEvent);
	} else {
		Dwt.setLocation(this.getHtmlElement(), x, y);
	}
	return this;
}

DwtControl.prototype.getScrollStyle =
function() {
	if (!this._checkState()) return;
		
	return Dwt.getScrollStyle(this.getHtmlElement());
}

DwtControl.prototype.setScrollStyle =
function(scrollStyle) {
	if (!this._checkState()) return;
		
	Dwt.setScrollStyle(this.getHtmlElement(), scrollStyle);
}

DwtControl.prototype.getW = 
function(incScroll) {
	if (!this._checkState()) return;
		
	return Dwt.getSize(this.getHtmlElement(), incScroll).x;
}

DwtControl.prototype.getH = 
function(incScroll) {
	if (!this._checkState()) return;
		
	return Dwt.getSize(this.getHtmlElement(), incScroll).y;
}

DwtControl.prototype.getSize = 
function(incScroll) {
	if (!this._checkState()) return;
		
	return Dwt.getSize(this.getHtmlElement(), incScroll);
}

DwtControl.prototype.setSize = 
function(width, height) {
	if (!this._checkState()) return;
		
	if (this.isListenerRegistered(DwtEvent.CONTROL)) {
		var htmlElement = this.getHtmlElement();
		this._controlEvent.reset();
		var sz = Dwt.getSize(htmlElement);
		this._controlEvent.oldWidth = sz.x;
		this._controlEvent.oldHeight = sz.y;
		Dwt.setSize(htmlElement, width, height);
		sz = Dwt.getSize(htmlElement);
		this._controlEvent.newWidth = sz.x;
		this._controlEvent.newHeight = sz.y;
		this.notifyListeners(DwtEvent.CONTROL, this._controlEvent);
	} else {
		Dwt.setSize(this.getHtmlElement(), width, height);
	}
	return this;
}

DwtControl.prototype.getToolTipContent =
function() {
	if (this._disposed) return;

	return this._toolTipContent;
}

DwtControl.prototype.setToolTipContent =
function(text) {
	if (this._disposed) return;

	this._toolTipContent = text;
}

DwtControl.prototype.getVisible =
function() {
	if (!this._checkState()) return;
		
	return Dwt.getVisible(this.getHtmlElement());
}

DwtControl.prototype.setVisible =
function(visible) {
	if (!this._checkState()) return;
		
	Dwt.setVisible(this.getHtmlElement(), visible);
}

DwtControl.prototype.setVisibility =
function(visible) {
	if (!this._checkState()) return;
		
	Dwt.setVisibility(this.getHtmlElement(), visible);
}

DwtControl.prototype.getZIndex =
function() {
	if (!this._checkState()) return;
		
	return Dwt.getZIndex(this.getHtmlElement());
}

/**
* Sets the z-index for this object's HTML element. Since z-index is only relevant among peer
* elements, we make sure that all elements that are being displayed via z-index hang off the
* main shell.
*
* @param idx	the new z-index for this element
*/
DwtControl.prototype.setZIndex =
function(idx) {
	if (!this._checkState()) return;
		
	Dwt.setZIndex(this.getHtmlElement(), idx);
}

/**
* Convenience function to toggle visibility using z-index. It uses the two lowest level
* z-indexes. Any further stacking will have to use setZIndex() directly.
*
* @param show	true if we want to show the element, false if we want to hide it
*/
DwtControl.prototype.zShow =
function(show) {
	this.setZIndex(show ? Dwt.Z_VIEW : Dwt.Z_HIDDEN);
}

DwtControl.prototype.setDisplay = 
function(value) {
	if (!this._checkState()) return;

	Dwt.setDisplay(this.getHtmlElement(), value);
}

DwtControl.prototype.preventSelection = 
function(targetEl) {
	return !this._isInputEl(targetEl);
}

DwtControl.prototype.preventContextMenu = 
function(targetEl) {
	return targetEl ? (!this._isInputEl(targetEl)) : true;
}

DwtControl.prototype._checkState =
function() {
	if (this._disposed) return false;
	if (!this._ctrlInited) 
		this._initCtrl();
	return true;
}

DwtControl.prototype._isInputEl = 
function(targetEl) {
	var bIsInput = false;
	if(!targetEl || !targetEl.tagName) {
		return bIsInput;
	}
	var tagName = targetEl.tagName.toLowerCase();
	var type = tagName == "input" ? targetEl.type.toLowerCase() : null;
	
	if (tagName == "textarea" || (type && (type == "text" || type == "password")))
		bIsInput = true;
	
	return bIsInput;
}

DwtControl.prototype._setEventHdlrs =
function(events, clear) {
	if (!this._checkState()) return;
		
	var htmlElement = this.getHtmlElement();
	for (var i = 0; i < events.length; i++) {
		if (clear !== true)
			Dwt.setHandler(htmlElement, events[i], DwtControl.HANDLER[events[i]]);
		else
			Dwt.clearHandler(htmlElement, events[i]);
	}
}

DwtControl.prototype._setMouseEventHdlrs =
function(clear) {
	this._setEventHdlrs(DwtEvent.MOUSE_EVENTS, clear);
}


DwtControl.prototype._setKeyPressEventHdlr =
function(clear) {
	this._setEventHdlrs([DwtEvent.ONKEYPRESS], clear);
}

DwtControl.prototype._dndDoHover =
function(control) {
	//TODO Add allow hover?
	control._dragHover();
}



/* Subclasses may override this method to return an HTML element that will represent
 * the dragging icon. The icon must be created on the DwtShell widget. If this method returns
 * null, it indicates that the drag failed*/
DwtControl.prototype._getDnDIcon =
function(dragOp) {
	DBG.println("DwtControl.prototype._getDnDIcon");
	return null;
}

/* Subclasses may override this method to set the DnD icon properties based on whether drops are
 * allowed */
DwtControl.prototype._setDnDIconState =
function(dropAllowed) {
	this._dndIcon.className = (dropAllowed) ? "DropAllowed" : "DropNotAllowed";
}


/* Subclasses may override this method to destroy the Dnd icon HTML element. */
DwtControl._junkIconId = 0;
DwtControl.prototype._destroyDnDIcon =
function(icon) {
	if (icon != null) {
		// not sure why there is no parent node, but if there isn't one,
		// let's try and do our best to get rid of the icon
		if (icon.parentNode) {
			icon.parentNode.removeChild(icon);
		} else {
			// at least hide the icon, and change the id so we can't get it
			// back later
			icon.style.zIndex = -100;
			icon.id = "DwtJunkIcon" + DwtControl._junkIconId++;
			icon = void 0;
		}
	}
}

/* Subclasses may override this method to provide feedback as to whether a possibly
 * valid capture is taking place. For example, there are instances such as when a mouse
 * down happens on a scroll bar in a DwtListView that are reported in the context of
 * the DwtListView, but which are not really a valid mouse down i.e. on a list item. In
 * such cases this function would return false */
 DwtControl.prototype._isValidDragObject =
 function(ev) {
 	return true;
 }

/* subclasses may override the following  functions to provide UI behaviour for DnD operations.
 * _dragEnter is called when a drag operation enters a control. _dragOver is called multiple times
 * as an item crossed over the control. _dragHover is called multiple times as the user hover's over
 * the control. _dragLeave is called when the drag operation exits the control. 
 * _drop is called when the item is dropped on the target.
 */
DwtControl.prototype._dragEnter =
function(ev) {
}

DwtControl.prototype._dragOver =
function(ev) {
}

DwtControl.prototype._dragHover =
function(ev) {
}


DwtControl.prototype._dragLeave =
function(ev) {
}

DwtControl.prototype._drop =
function(ev) {
}

DwtControl.prototype._initCtrl = 
function() {
	this.shell = this.parent.shell || this.parent;
	var htmlElement = document.createElement("div");
	this._htmlElId = htmlElement.id = (this._htmlElId == null) ? Dwt.getNextId() : this._htmlElId;
	DwtComposite._pendingElements[this._htmlElId] = htmlElement;
	Dwt.associateElementWithObject(htmlElement, this);
	if (this._posStyle == null || this._posStyle == DwtControl.STATIC_STYLE) {
        htmlElement.style.position = DwtControl.STATIC_STYLE;
	} else {
        htmlElement.style.position = this._posStyle;
	}
	htmlElement.className = this._className;
	htmlElement.style.overflow = "visible";
	this._enabled = true;
	this._controlEvent = new DwtControlEvent();
	this._dragging = DwtControl._NO_DRAG;
	this._ctrlInited = true;
	// Make sure this is the last thing we do
	this.parent.addChild(this);
}

DwtControl.prototype.setContent =
function(content) {
	if (content)
		this.getHtmlElement().innerHTML = content;
}

DwtControl.prototype.clearContent =
function() {
	this.getHtmlElement().innerHTML = "";
}

DwtControl.prototype._badDropEffect =
function(m, c, d) {
	var usingX = (Math.abs(m) <= 1);
	// Use the bigger delta to control the snap effect
	var delta = usingX ? this._dragStartX - this._dragEndX : this._dragStartY - this._dragEndY;
	if (delta * d > 0) {
		if (usingX) {
			this._dragEndX += (30 * d);
			this._dndIcon.style.top = m * this._dragEndX + c;
			this._dndIcon.style.left = this._dragEndX;
		} else {
			this._dragEndY += (30 * d);
			this._dndIcon.style.top = this._dragEndY;
			this._dndIcon.style.left = (this._dragEndY - c) / m;
		}	
		AjxTimedAction.scheduleAction(this._badDropAction, 0);
 	} else {
  		this._destroyDnDIcon(this._dndIcon);
		this._dragging = DwtControl._NO_DRAG;
  	}
}

DwtControl.prototype._handleHoverOver =
function(event) {
	if (this._eventMgr.isListenerRegistered(DwtEvent.HOVEROVER)) {
		this._eventMgr.notifyListeners(DwtEvent.HOVEROVER, event);
	}
	if (this._toolTipContent != null) {
		var shell = DwtShell.getShell(window);
		var tooltip = shell.getToolTip();
		tooltip.setContent(this._toolTipContent);
		tooltip.popup(event.x, event.y);
		this._lastTooltipX = event.x;
		this._lastTooltipY = event.y;
		this._tooltipClosed = false;
	}
}

DwtControl.prototype._handleHoverOut =
function(event) {
	if (this._eventMgr.isListenerRegistered(DwtEvent.HOVEROUT)) {
		this._eventMgr.notifyListeners(DwtEvent.HOVEROUT, event);
	}
	var shell = DwtShell.getShell(window);
	var tooltip = shell.getToolTip();
	tooltip.popdown();
	this._lastTooltipX = null;
	this._lastTooltipY = null;
}
