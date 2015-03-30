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
* Creates a new dialog container without displaying it. The shell must be provided.

* @constructor
* @class
* This is a base class for dialogs. Given content, this class will take care of 
* showing, and hiding the dialog, as well as dragging it.
* <p>
* Content that is draggable ( classes that override _createHtml ), need to create
* an element with an id of this.getHtmlElement().id + "_handle".
* <p>
* Dialogs always hang off the main shell since their stacking order is managed through z-index.
*
* @author Ross Dargahi
* @author Conrad Damon
* @param parent				parent widget (the shell)
* @param classname			a CSS class
* @param zIndex				z-index when the dialog is visible
* @param mode				modal or modeless
* @param loc				where to popup
*/
function DwtBaseDialog(parent, className, title, zIndex, mode, loc, optionalView, optionalDragHandleId) {

	if (arguments.length == 0) return;
	if (!(parent instanceof DwtShell)) {
		throw new DwtException("DwtBaseDialog parent must be a DwtShell", 
							   DwtException.INVALIDPARENT, "DwtDialog");
	}
	className = className || "DwtBaseDialog";
	this._title = title || "";

	DwtComposite.call(this, parent, className, DwtControl.ABSOLUTE_STYLE);
	DBG.timePt(AjxDebug.PERF, "DwtComposite constructor");

	this._shell = parent;
	this._zIndex = zIndex || Dwt.Z_DIALOG;

	this._mode = mode || DwtBaseDialog.MODAL;
	this._loc = loc;
	this._ffHackDisabled = false;

	this._createHtml();
	DBG.timePt(AjxDebug.PERF, "DwtBaseDialog#_createHtml");
	if (optionalView != null) {
		this.setView(optionalView);
	}
	// make dialog draggable within boundaries of shell
	var htmlElement = this.getHtmlElement();
	
	// Workaround for the hidden cursor issue in Gecko based browsers like FireFox
	//if (AjxEnv.isGeckoBased)
	//	htmlElement.style.overflow = "auto";
		
	var dHandleId = optionalDragHandleId ? optionalDragHandleId : (htmlElement.id + "_handle");
	this.initializeDragging(dHandleId);
	DBG.timePt(AjxDebug.PERF, "init dragging");
	
	// reset tab index
	this._tabIndex = 0;
    this.setZIndex(Dwt.Z_HIDDEN); // not displayed until popup() called
	this._positionDialog({x:-10000, y:-10000});
	DBG.timePt(AjxDebug.PERF, "DwtBaseDialog#_positionDialog");
}

DwtBaseDialog.prototype = new DwtComposite;
DwtBaseDialog.prototype.constructor = DwtBaseDialog;

// modes
DwtBaseDialog.MODELESS = 1;
DwtBaseDialog.MODAL = 2;


// -------------------------------------------------------------------
// API Methods 
// -------------------------------------------------------------------

DwtBaseDialog.prototype.toString = 
function() {
	return "DwtBaseDialog";
};

DwtBaseDialog.prototype.initializeDragging = 
function(dragHandleId) {
	var dragHandle = document.getElementById(dragHandleId);
	if (dragHandle) {
		var p = Dwt.getSize(AjxCore.objectWithId(window._dwtShell).getHtmlElement());
		var dragObj = document.getElementById(this._htmlElId);
		var size = this.getSize();
		var dragEndCb = new AjxCallback(this, this._dragEnd);
		var dragCb = new AjxCallback(this, this._duringDrag);
		var dragStartCb = new AjxCallback(this, this._dragStart);
		
 		DwtDraggable.init(dragHandle, dragObj, 0,
 						  document.body.offsetWidth - 10, 0, document.body.offsetHeight - 10, dragStartCb, dragCb, dragEndCb);
	}	
};

/**
* Makes the dialog visible, and places it. Everything under the dialog will become veiled
* if we are modal.
*
* @param loc	the desired location
*/
DwtBaseDialog.prototype.popup =
function(loc) {
	
	this.cleanup(true);
	DBG.timePt(AjxDebug.PERF, "DwtBaseDialog#cleanup");

	var thisZ = this._zIndex;
	// if we're modal, setup the veil effect,
	// and track which dialogs are open
	if (this._mode == DwtBaseDialog.MODAL) {
		thisZ = this._setModalEffect(thisZ);
	}
	DBG.timePt(AjxDebug.PERF, "DwtBaseDialog#setModelEffect");

	// add the listener functions for key events that
	// we're interested in
	this.addKeyListeners();
	this._shell._veilOverlay.activeDialogs.push(this);
	DBG.timePt(AjxDebug.PERF, "push this on list of active dialogs");

	// Deal with Firefox's horrible bug with absolutely 
	// positioned divs and inputs floating over them.
	if (!this._ffHackDisabled) Dwt._ffOverflowHack(this._htmlElId, thisZ, null, false);
	DBG.timePt(AjxDebug.PERF, "Dwt._ffOverflowHack");
	
	// use whichever has a value, local has precedence
	loc = this._loc = loc || this._loc; 
	
	this._positionDialog(loc);
	DBG.timePt(AjxDebug.PERF, "DwtBaseDialog#positionDialog");
	this.setZIndex(thisZ);
	DBG.timePt(AjxDebug.PERF, "DwtBaseDialog#setZIndex");
	this._poppedUp = true;
	this.focus();
	DBG.timePt(AjxDebug.PERF, "DwtBaseDialog#focus");
}

DwtBaseDialog.prototype._disableFFhack = 
function() {
	this._ffHackDisabled = true;
}

DwtBaseDialog.prototype.focus = 
function () {
	// if someone is listening for the focus to happen, give 
	// control to them, otherwise focus on this dialog.
	if (this.isListenerRegistered(DwtEvent.ONFOCUS)) {
		this.notifyListeners(DwtEvent.ONFOCUS);
	} else if (this._focusElementId){
		var focEl = document.getElementById(this._focusElementId);
		if (focEl) {
			focEl.focus();
		}
	}
};

DwtBaseDialog.prototype.isPoppedUp =
function () {
	return this._poppedUp;
};

/**
* Hides the dialog.
*/
DwtBaseDialog.prototype.popdown =
function() {

	if (this._poppedUp) {
		this._poppedUp = false;
		this.cleanup(false);
	
		//var myZIndex = this.getZIndex();
	    var myZIndex = this._zIndex;
		this.setZIndex(Dwt.Z_HIDDEN);
		this._positionDialog({x:Dwt.LOC_NOWHERE, y:Dwt.LOC_NOWHERE});
		if (this._mode == DwtBaseDialog.MODAL) {
			this._undoModality(myZIndex);
		} else {
			if (!this._ffHackDisabled) Dwt._ffOverflowHack(this._htmlElId, myZIndex, null, false);
			this._shell._veilOverlay.activeDialogs.pop();
		}
		this.removeKeyListeners();
	}
}

DwtBaseDialog.prototype.setView =
function(newView) {
	this.reset();
	if (newView) this._getContentDiv().appendChild(newView.getHtmlElement());
};

/**
* Sets the dialog back to its original state after being constructed, by clearing any
* detail message and resetting the standard button callbacks.
*/
DwtBaseDialog.prototype.reset =
function() {
	this._loc = null;
}

/**
* cleans up the dialog so it can be used again later
*/
DwtBaseDialog.prototype.cleanup =
function(bPoppedUp) {

	var inputFields = this._getInputFields();
	
	if (inputFields) {
		for (var i = 0; i < inputFields.length; i++) {
			inputFields[i].disabled = !bPoppedUp;
			if (bPoppedUp)
				inputFields[i].value = "";
		}
	}
}

/**
* Sets the dialog content (below the title, above the buttons).
*
* @param text		dialog content
*/
DwtBaseDialog.prototype.setContent =
function(text) {
	var d = this._getContentDiv();
	if (d) {
		var content =
			DwtBorder.getBorderStartHtml("dialog") + 
			text + 
			DwtBorder.getBorderEndHtml("dialog");
		d.innerHTML = text;
	}
}

DwtBaseDialog.prototype._getContentDiv =
function (){
	return this._contentDiv;
};
/** 
 * @param listenerFunc -- takes an event when the tab key
 * has been pressed for an element inside of this dialog.
 */
DwtBaseDialog.prototype.addTabListener =
function(listener) {
	this.addListener(DwtEvent.TAB, listener);
};

DwtBaseDialog.prototype.addEnterListener =
function(listener) {
	this.addListener(DwtEvent.ENTER, listener);
};

DwtBaseDialog.getActiveDialog = 
function() {
	var dialog = null;
	var shellObj = DwtShell.getShell(window);
	if (shellObj) {
		var len = shellObj._veilOverlay.activeDialogs.length;
		if (len > 0) {
			dialog = shellObj._veilOverlay.activeDialogs[len - 1];
		}
	}
	return dialog;
};

DwtBaseDialog.prototype.handleKeys = 
function(ev) {
	var ad = DwtBaseDialog.getActiveDialog();
	var dialogEl = ad.getHtmlElement();
	var target = DwtUiEvent.getTarget(ev);
	var keyCode = DwtKeyEvent.getCharCode(ev);
	switch (keyCode) {
	case DwtKeyEvent.KEY_TAB:
		if (ad && ad._mode == DwtBaseDialog.MODAL) {
			ev.item = ad;
			var isContained = ad._doesContainElement(target);
			if (isContained) {
				ev.isTargetInDialog = true;
				if (ad._tabIdOrder) {
					var oldTabIndex = -1;
					if (ad._tabIndex != null ) {
						oldTabIndex = ad._tabIndex;
						ad._tabIndex = ++ad._tabIndex % ad._tabIdOrder.length;
					} else {
						ad._tabIndex =  1;
					}
					var id = ad._tabIdOrder[ad._tabIndex];
					document.getElementById(id).focus();
					ev.oldTabIndexId = (oldTabIndex == -1) ? oldTabIndex : ad._tabIdOrder[oldTabIndex];
					ev.isTargetInDialog = true;
					ev.currentTabIndexId = id;
				} 
			} else {
				ev.oldTabIndexId = -1;
				ev.isTargetInDialog = false;
				ev.currentTabIndexId = -1;
			}
			ad.notifyListeners(DwtEvent.TAB, ev);
			DwtUiEvent.setBehaviour(ev, true, false);
		}
		break;
	case DwtKeyEvent.KEY_ENTER:
		ad.notifyListeners(DwtEvent.ENTER, ev);
		break;
	}
};

DwtBaseDialog.prototype.setTabOrder = 
function(elementIdArray) {
	this._tabIdOrder = elementIdArray;
};

DwtBaseDialog.prototype.addKeyListeners =
function() {
	if (this._shell._veilOverlay.activeDialogs.length == 0 ) {
		if (window.addEventListener) {
			window.addEventListener('keypress', this.handleKeys, false);
		} else if (document.body.attachEvent) {
			document.body.attachEvent('onkeydown', this.handleKeys);
		}
	}
};

DwtBaseDialog.prototype.removeKeyListeners =
function () {
	if (this._shell._veilOverlay.activeDialogs.length == 0 ) {
		if (window.removeEventListener) {
			window.removeEventListener('keypress', this.handleKeys, false);
		} else if (document.body.detachEvent) {
			document.body.detachEvent('onkeydown', this.handleKeys);
		}
	}
};

// -------------------------------------------------------------------
// Private methods
// -------------------------------------------------------------------

DwtBaseDialog.prototype._getStartBorder = 
function() {
	if (!this._titleHandleId) this._titleHandleId = Dwt.getNextId();
	if (!this._contentId) this._contentId = Dwt.getNextId();
	if (!this._titleCellId) this._titleCellId = Dwt.getNextId();
	return DwtBorder.getBorderStartHtml("dialog", {title : this._title, titleTextId: this._titleCellId,
												titleId: this._titleHandleId});
};

DwtBaseDialog.prototype._getEndBorder = 
function() {
	return DwtBorder.getBorderEndHtml("dialog");
};

DwtBaseDialog.prototype._getContentHtml = 
function() {
	return "<div id='" + this._contentId + "'></div>"
};

/**
 * A subclass will probably override this method
 */
DwtBaseDialog.prototype._createHtml =
function() {
	var htmlElement = this.getHtmlElement();
	var html = new Array();
	var idx = 0;
	html[idx++] = this._getStartBorder();
	html[idx++] = this._getContentHtml();
	html[idx++] = this._getEndBorder();
	htmlElement.innerHTML = html.join("");
	this._contentDiv = document.getElementById(this._contentId);
}

DwtBaseDialog.prototype._setModalEffect = 
function() {
	// place veil under this dialog
	var dialogZ = this._shell._veilOverlay.dialogZ;
	var currentDialogZ = null;
	var veilZ;
	if (dialogZ.length)
		currentDialogZ = dialogZ[dialogZ.length - 1];
	if (currentDialogZ) {
		thisZ = currentDialogZ + 2;
		veilZ = currentDialogZ + 1;
	} else {
		thisZ = this._zIndex;
		veilZ = Dwt.Z_VEIL;
	}
	this._shell._veilOverlay.veilZ.push(veilZ);
	this._shell._veilOverlay.dialogZ.push(thisZ);
	Dwt.setZIndex(this._shell._veilOverlay, veilZ);
	return thisZ;
};

DwtBaseDialog.prototype._undoModality =
function (myZIndex) {
	var veilZ = this._shell._veilOverlay.veilZ;
	veilZ.pop();
	var newVeilZ = veilZ[veilZ.length - 1];
	if (!this._ffHackDisabled) Dwt._ffOverflowHack(this._htmlElId, myZIndex, null, false);
	Dwt.setZIndex(this._shell._veilOverlay, newVeilZ);
	this._shell._veilOverlay.dialogZ.pop();
	this._shell._veilOverlay.activeDialogs.pop();
	if (this._shell._veilOverlay.activeDialogs.length > 0 ) {
		this._shell._veilOverlay.activeDialogs[0].focus();
	}
};

DwtBaseDialog.prototype._positionDialog = 
function (loc) {
	var sizeShell = this._shell.getSize();
	DBG.timePt(AjxDebug.PERF, "DwtBaseDialog#_positionDialog: get shell size");
	var sizeThis = this.getSize();
	DBG.timePt(AjxDebug.PERF, "DwtBaseDialog#_positionDialog: get dialog size");
	var x, y;
	if (loc == null) {
		// if no location, go for the middle
		x = Math.round((sizeShell.x - sizeThis.x) / 2);
		y = Math.round((sizeShell.y - sizeThis.y) / 2);
	} else {
		x = loc.x;
		y = loc.y;
	}
	// try to stay within shell boundaries
	if ((x + sizeThis.x) > sizeShell.x)
		x = sizeShell.x - sizeThis.x;
	if ((y + sizeThis.y) > sizeShell.y)
		y = sizeShell.y - sizeThis.y;
	this.setLocation(x, y);
	DBG.timePt(AjxDebug.PERF, "DwtBaseDialog#_positionDialog: set location");
};

// returns a list of input fields in dialog
DwtBaseDialog.prototype._getInputFields = 
function() {
	// overload me
}

DwtBaseDialog.prototype._dragStart = 
function (x, y){
	// fix for bug 3177
	if (AjxEnv.isNav) {
		this._currSize = this.getSize();
		DwtDraggable.setDragBoundaries(DwtDraggable._dragEl, 0, document.body.offsetWidth - this._currSize.x, 0, 
									   document.body.offsetHeight - this._currSize.y);
	}
};

DwtBaseDialog.prototype._dragEnd =
function(x, y) {
// 	// save dropped position so popup(null) will not re-center dialog box
// 	DBG.println("drag end x:", x, " y:", y);
	this._loc = new DwtPoint(x, y);
}

DwtBaseDialog.prototype._duringDrag =
function(x, y) {
// 	DBG.println("during drag x:", x, " y:", y);
	// overload me
};

DwtBaseDialog.prototype._doesContainElement = 
function (element) {
	return Dwt.contains(this.getHtmlElement(), element);
};
