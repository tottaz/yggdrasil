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


// Cannot be subclassed

/**
* Creates a shell. 
* @constructor
* @class
* This class represents a shell, the first widget that must be instantiated in a Dwt based 
* application. By default the shell covers the whole browser window, though it may also be 
* instantiated within an HTML element.
* <p>
* DwtShell should <b>NOT</b> be subclassed</p>
*
* @author Ross Dargahi
* @param className			[string]*		CSS class name
* @param docBodyScrollable	[boolean]*		if true, then the document body is set to be scrollable
* @param confirmExitMethod	[function]*		method which is called when the user attempts to navigate away from 
*											the application or close the browser window. If this method return a string that 
*											is displayed as part of the alert that is presented to the user. If this method 
*											returns null, then no alert is popped up this parameter may be null
* @param  userShell			[Element]*		an HTML element that will be reparented into an absolutely
*											postioned container in this shell. This is useful in the situation where you have an HTML 
*											template and want to use this in context of Dwt.
* @param useCurtain			[boolean]*		if true, a curtain overlay is created to be used between hidden and viewable elements 
*											using z-index. See Dwt.js for various layering constants
*/
function DwtShell(className, docBodyScrollable, confirmExitMethod, userShell, useCurtain) {
	if (window._dwtShell != null) {
		throw new DwtException("DwtShell already exists for window", DwtException.INVALID_OP, "DwtShell");
	}

	className = className || "DwtShell";
	DwtComposite.call(this, null, className);

    // HACK! This is a hack to make sure that the control methods work 
    // with DwtShell since the parent of DwtShell is null. 
	this._ctrlInited = true;

	window._dwtShell = AjxCore.assignId(this);

	if ((confirmExitMethod != null) && (document.domain != "localhost"))
		window.onbeforeunload = confirmExitMethod;

	document.body.style.margin = 0;
	if (docBodyScrollable != null && !docBodyScrollable)
		document.body.style.overflow = "hidden";

	Dwt.setHandler(document, DwtEvent.ONKEYPRESS, DwtShell._keyPressHdlr);

    document.body.onselect = DwtShell._preventDefaultSelectPrt;
	document.body.onselectstart = DwtShell._preventDefaultSelectPrt;
    document.body.oncontextmenu = DwtShell._preventDefaultPrt;
    window.onresize = DwtShell._resizeHdlr;

    var htmlElement = document.createElement("div");
	this._htmlElId = htmlElement.id = Dwt.getNextId();

	htmlElement.className = className;
	htmlElement.style.width = htmlElement.style.height = "100%";
	if (htmlElement.style.overflow) 
		htmlElement.style.overflow = null;

	// if there is a user shell (body content), move it below this shell
	// into a container that's absolutely positioned
	if (userShell)
		document.body.removeChild(userShell);
	document.body.appendChild(htmlElement);
	if (userShell) {
		var userShellContainer = new DwtControl(this, null, Dwt.ABSOLUTE_STYLE);
		userShellContainer.getHtmlElement().appendChild(userShell);
		userShellContainer.setSize("100%", "100%");
		userShellContainer.zShow(true);
	}
	Dwt.associateElementWithObject(htmlElement, this);
    this.shell = this;

    // Busy overlay - used when we want to enforce a modal busy state
    this._createBusyOverlay(htmlElement);

	// Veil overlay - used by DwtDialog to disable underlying app
	this._veilOverlay = document.createElement("div");
	this._veilOverlay.className = (!AjxEnv.isLinux) ? "VeilOverlay" : "VeilOverlay-linux";
	this._veilOverlay.style.position = "absolute";
	this._veilOverlay.style.cursor = AjxEnv.isIE6up ? "not-allowed" : "wait";
	Dwt.setBounds(this._veilOverlay, 0, 0, "100%", "100%");
    Dwt.setZIndex(this._veilOverlay, Dwt.Z_HIDDEN);
	this._veilOverlay.veilZ = new Array();
	this._veilOverlay.veilZ.push(Dwt.Z_HIDDEN);
	this._veilOverlay.dialogZ = new Array();
	this._veilOverlay.activeDialogs = new Array();
	this._veilOverlay.innerHTML = "<table cellspacing=0 cellpadding=0 style='width:100%; height:100%'><tr><td>&nbsp;</td></tr></table>";
	htmlElement.appendChild(this._veilOverlay);

	// Curtain overlay - used between hidden and viewable elements using z-index
	if (useCurtain) {
		this._curtainOverlay = document.createElement("div");
		this._curtainOverlay.className = "CurtainOverlay";
		this._curtainOverlay.style.position = "absolute";
		Dwt.setBounds(this._curtainOverlay, 0, 0, "100%", "100%")
		Dwt.setZIndex(this._curtainOverlay, Dwt.Z_CURTAIN);
		this._curtainOverlay.innerHTML = "<table cellspacing=0 cellpadding=0 style='width:100%; height:100%'><tr><td>&nbsp;</td></tr></table>";
		htmlElement.appendChild(this._curtainOverlay);
	}

    this._uiEvent = new DwtUiEvent(true);
	this._currWinSize = Dwt.getWindowSize();

	// tooltip singleton used by all controls in shell
	this._toolTip = new DwtToolTip(this);
	this._hoverMgr = new DwtHoverMgr();
}

DwtShell.prototype = new DwtComposite;
DwtShell.prototype.constructor = DwtShell;

// DwtDialog not defined yet, can't base ID on it
DwtShell.CANCEL_BUTTON = -1;

// Event objects used to populate events so we dont need to create them for each event
DwtShell.controlEvent 	= new DwtControlEvent();
DwtShell.keyEvent 		= new DwtKeyEvent();
DwtShell.mouseEvent 	= new DwtMouseEvent();
DwtShell.selectionEvent = new DwtSelectionEvent(true);
DwtShell.treeEvent 		= new DwtTreeEvent();


// Public methods

DwtShell.prototype.toString = 
function() {
	return "DwtShell";
}

/**
* Returns the shell managing the browser window (if any)
*
* @return DwtShell or null
*/
DwtShell.getShell =
function(win){
	return AjxCore.objectWithId(win._dwtShell);
};

/**
* Sets the busy overlay. The busy overlay disables input to the application and makes the 
* cursor a wait cursor. Optionally a work in progress (WIP) dialog may be requested. Since
* multiple calls to this method may be interleaved, it accepts a unique ID to keep them
* separate. We also maintain a count of outstanding calls to setBusy(true). When that count
* changes between 0 and 1, the busy overlay is applied or removed.
* 
* @param busy					[boolean]		if true, set the busy overlay, otherwise hide the busy overlay
* @param id						[int]*			a unique ID for this instance
* @param showbusyDialog 		[boolean]*		if true, show the WIP dialog
* @param busyDialogDelay 		[int]*			number of ms to delay before popping up the WIP dialog
* @param cancelBusyCallback		[AjxCallback]*	callback to run when OK button is pressed in WIP dialog
*/ 
DwtShell.prototype.setBusy =
function(busy, id, showbusyDialog, busyDialogDelay, cancelBusyCallback) {
	if (busy)
		this._setBusyCount++;
	else if (this._setBusyCount > 0)
		this._setBusyCount--;

    if (!this._setBusy && (this._setBusyCount > 0)) {
		// transition from non-busy to busy state
		Dwt.setCursor(this._busyOverlay, "wait");
    	Dwt.setVisible(this._busyOverlay, true);
    	this._setBusy = true;
    	DBG.println(AjxDebug.DBG2, "set busy overlay, id = " + id);
    } else if (this._setBusy && (this._setBusyCount <= 0)) {
		// transition from busy to non-busy state
	    Dwt.setCursor(this._busyOverlay, "default");
	    Dwt.setVisible(this._busyOverlay, false);
	    this._setBusy = false;
    	DBG.println(AjxDebug.DBG2, "remove busy overlay, id = " + id);
	}
	
	// handle busy dialog whether we've changed state or not
	if (busy && showbusyDialog) {
		if (busyDialogDelay && busyDialogDelay > 0) {
			this._busyActionId[id] = AjxTimedAction.scheduleAction(this._busyTimedAction, busyDialogDelay);
		} else {
			this._showBusyDialogAction(id);
		}

		if (cancelBusyCallback) {
			this._cancelBusyCallback = cancelBusyCallback;
			this._busyDialog.setButtonEnabled(DwtShell.CANCEL_BUTTON, true);
		} else {
			this._busyDialog.setButtonEnabled(DwtShell.CANCEL_BUTTON, false);
		}
	} else {
    	if (this._busyActionId[id] && (this._busyActionId[id] != -1)) {
    		AjxTimedAction.cancelAction(this._busyActionId[id]);
    		this._busyActionId[id] = -1;
    	}
   		if (this._busyDialog.isPoppedUp)
    		this._busyDialog.popdown();
    } 
}

/**
* Sets the text for the shell's busy dialog
*
* @param text The text to set (may be HTML)
*/
DwtShell.prototype.setBusyDialogText =
function(text) { 
	this._busyDialogTxt.innerHTML = (text) ? text : "";
}

/**
* Sets shell's busy dialog title. If null set's it to the default
*
* @param title The title text
*/
DwtShell.prototype.setBusyDialogTitle =
function(title) { 
	this._busyDialog.setTitle((title) ? title : AjxMsg.workInProgress);
}

DwtShell.prototype.getHoverMgr = 
function() {
	return this._hoverMgr;
}

DwtShell.prototype.getToolTip = 
function() {
	return this._toolTip;
}

DwtShell.prototype.getH = 
function(incScroll) {
	return (!this._virtual) ? Dwt.getSize(this.getHtmlElement(), incScroll).y
	                        : Dwt.getSize(document.body, incScroll).y;
}

DwtShell.prototype.getW = 
function(incScroll) {
	return (!this._virtual) ? Dwt.getSize(this.getHtmlElement(), incScroll).x
	                        : Dwt.getSize(document.body, incScroll).x;
}

DwtShell.prototype.getSize = 
function(incScroll) {
	return (!this._virtual) ? Dwt.getSize(this.getHtmlElement(), incScroll)
	                        : Dwt.getSize(document.body, incScroll);
}

DwtShell.prototype.getLocation =
function() {
	return (!this._virtual) ? Dwt.getLocation(this.getHtmlElement())
	                        : Dwt.getLocation(document.body);
}

DwtShell.prototype.getX =
function() {
	return (!this._virtual) ? Dwt.getLocation(this.getHtmlElement()).x
	                        : Dwt.getLocation(document.body).x;
}

DwtShell.prototype.getY =
function() {
	return (!this._virtual) ? Dwt.getLocation(this.getHtmlElement()).y
	                        : Dwt.getLocation(document.body).y;
}


DwtShell.prototype.getBounds = 
function() {
	return (!this._virtual) ? Dwt.getBounds(this.getHtmlElement(), incScroll)
	                        : Dwt.getBounds(document.body, incScroll);
}

/**
 * If the shell is set as a virtual shell, then all children that are 
 * directly added to the shell become childre on the body element. This
 * is useful in the cases where DWT is to be with existing HTML documents
 * rather than as the foundation for an application
 */
DwtShell.prototype.setVirtual =
function() {
	this._virtual = true;
	this.setVisible(false);
}

DwtShell.prototype.isVirtual =
function() {
	return this._virtual;
}


// Private / protected methods

DwtShell.prototype._showBusyDialogAction =
function(id) {
	this._busyDialog.popup();
	this._busyActionId[id] = -1;
}

DwtShell.prototype._createBusyOverlay =
function(htmlElement) { 
    this._busyOverlay = document.createElement("div");
    this._busyOverlay.className = (!AjxEnv.isLinux) ? "BusyOverlay" : "BusyOverlay-linux";
    this._busyOverlay.style.position = "absolute";
    Dwt.setBounds(this._busyOverlay, 0, 0, "100%", "100%")
    Dwt.setZIndex(this._busyOverlay, Dwt.Z_VEIL);
    this._busyOverlay.innerHTML = "<table cellspacing=0 cellpadding=0 style='width:100%; height:100%'><tr><td>&nbsp;</td></tr></table>";
    htmlElement.appendChild(this._busyOverlay);
	Dwt.setVisible(this._busyOverlay, false);

	var cancelButton = new DwtDialog_ButtonDescriptor(DwtShell.CANCEL_BUTTON, AjxMsg.cancelRequest, DwtDialog.ALIGN_CENTER);
    this._busyDialog = new DwtDialog(this, "DwtShellbusyDialog", AjxMsg.workInProgress, DwtDialog.NO_BUTTONS, [cancelButton], Dwt.BUSY + 10);
    this._busyDialog._disableFFhack();
    this._busyDialog.registerCallback(DwtShell.CANCEL_BUTTON, this._busyCancelButtonListener, this);
    var txtId = Dwt.getNextId();
    var html = [
        "<table xborder=1 class='DialogContent'><tr>",
            "<td class='WaitIcon'></td><td class='MsgText' id='", txtId, "'>&nbsp;</td>",
        "</tr></table>"].join("");
    
    this._busyDialog.setContent(html);
    this._busyDialogTxt = document.getElementById(txtId);
       
	this._busyTimedAction = new AjxTimedAction(this, this._showBusyDialogAction);
	this._busyActionId = {};
	
	this._setBusyCount = 0;
	this._setBusy = false;
}


// Listeners

DwtShell.prototype._busyCancelButtonListener =
function(ev) {
	this._cancelBusyCallback.run();
	this._busyDialog.popdown();
}


// Static methods

DwtShell._preventDefaultSelectPrt =
function(ev) {
    var evt = AjxCore.objectWithId(window._dwtShell)._uiEvent;
    evt.setFromDhtmlEvent(ev);

	if (evt.dwtObj && evt.dwtObj instanceof DwtControl && !evt.dwtObj.preventSelection(evt.target)) {
        evt._stopPropagation = false;
        evt._returnValue = true;
    } else {
        evt._stopPropagation = true;
        evt._returnValue = false;
    }
    evt.setToDhtmlEvent(ev);
    return !evt._stopPropagation;
}

DwtShell._preventDefaultPrt =
function(ev) {
	ev = DwtUiEvent.getEvent(ev);
	var target = ev.target ? ev.target : ev.srcElement;
	
    var evt = AjxCore.objectWithId(window._dwtShell)._uiEvent;
    evt.setFromDhtmlEvent(ev);
	//default behavior
    evt._stopPropagation = true;
    evt._returnValue = false;
	if (evt.dwtObj && evt.dwtObj instanceof DwtControl && !evt.dwtObj.preventContextMenu(evt.target)) {
        evt._stopPropagation = false;
        evt._returnValue = true;
    } else if (target != null && typeof(target) == 'object') {
     	if ((target.tagName == "A" ||  target.tagName == "a") && target.href) {
	        evt._stopPropagation = false;
    	    evt._returnValue = true;
    	}
    } 
    
    evt.setToDhtmlEvent(ev);
    return evt._returnValue;
}

DwtShell._keyPressHdlr =
function(ev) {
	var shell = AjxCore.objectWithId(window._dwtShell);
	if (shell.isListenerRegistered(DwtEvent.ONKEYPRESS)) {
		var keyEvent = DwtShell.keyEvent;
		keyEvent.setFromDhtmlEvent(ev);
//		DBG.println("KEY PRESS - KC:" + keyEvent.keyCode + " CC: " + keyEvent.charCode 
//	   	         + " ALT: " + keyEvent.altKey + " SHIFT: " + keyEvent.shiftKey + " CTRL: " + keyEvent.ctrlKey);
	   	         
//	   	if (keyEvent.target)
//			DBG.println("TARGET NAME: " + keyEvent.target.tagName + " ID: " + keyEvent.target.id);	
	
		var tagName = (keyEvent.target) ? keyEvent.target.tagName.toLowerCase() : null;
		if (tagName != "input" && tagName != "textarea") {
			return shell.notifyListeners(DwtEvent.ONKEYPRESS, keyEvent);
//			keyEvent._stopPropagation = true;
//    		keyEvent._returnValue = false;
//    		keyEvent.setToDhtmlEvent(ev);
//   		return keyEvent._returnValue;
    	} 
    }
}

/* This the resize handler to track when the browser window size changes */
DwtShell._resizeHdlr =
function(ev) {
	var shell = AjxCore.objectWithId(window._dwtShell);
	if (shell.isListenerRegistered(DwtEvent.CONTROL)) {
	 	var evt = DwtShell.controlEvent;
	 	evt.reset();
	 	evt.oldWidth = shell._currWinSize.x;
	 	evt.oldHeight = shell._currWinSize.y;
	 	shell._currWinSize = Dwt.getWindowSize();
	 	evt.newWidth = shell._currWinSize.x;
	 	evt.newHeight = shell._currWinSize.y;
	 	shell.notifyListeners(DwtEvent.CONTROL, evt);
	} else {
		shell._currWinSize = Dwt.getWindowSize();
	}
}
