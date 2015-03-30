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
* Creates a new dialog, without displaying it. The shell must be provided, and a 
* title should be provided as well. Everything else has a reasonable default.
* @constructor
* @class
* This class represents a popup dialog which has at least a title and up to 
* three standard buttons (OK, Cancel). A client or subclass sets the content.
* <p>
* Dialogs always hang off the main shell since their stacking order is managed 
* through z-index.
*
* @author Ross Dargahi
* @author Conrad Damon
*
* @param parent				parent widget (the shell)
* @param classname			a CSS class
* @param title				a title for the dialog
* @param standardButtons	a list of standard button IDs
* @param extraButtons		a list of button descriptors
* @param zIndex				z-index when the dialog is visible
* @param mode				modal or modeless
* @param loc				where to popup
*/
function DwtDialog(parent, className, title, standardButtons, extraButtons, zIndex, mode, loc) {

	if (arguments.length == 0) return;
	className = className || "DwtDialog";
	this._title = title || "";

	// standard buttons default to OK / Cancel
	if (!standardButtons) {
		standardButtons = [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON];
	} else if (standardButtons == DwtDialog.NO_BUTTONS) {
		standardButtons = null;
	}
	// assemble the list of button IDs, and the list of button descriptors
	this._buttonList = new Array();
	if (standardButtons || extraButtons) {
		this._buttonDesc = new Object();
		if (standardButtons && standardButtons.length) {
			this._enterButtonId = standardButtons[0];
			for (var i = 0; i < standardButtons.length; i++) {
				var buttonId = standardButtons[i];
				this._buttonList.push(buttonId);
				// creating standard button descriptors on file read didn't work, so we create them here
				this._buttonDesc[buttonId] = new DwtDialog_ButtonDescriptor(buttonId, AjxMsg[DwtDialog.MSG_KEY[buttonId]],
																			this.getAlignmentForButton(buttonId));
			}
			// set standard callbacks
			this._resetCallbacks();
		}
		if (extraButtons && extraButtons.length) {
			if (!this._enterButtonId) {
				this._enterButtonId = extraButtons[0];
			}
			for (var i = 0; i < extraButtons.length; i++) {
				var buttonId = extraButtons[i].id;
				this._buttonList.push(buttonId);
				this._buttonDesc[buttonId] = extraButtons[i];
			}
		}
		DBG.timePt(AjxDebug.PERF, "DwtDialog: constructed buttons");
	}

	this._titleCellId = Dwt.getNextId();
	this._contentId = Dwt.getNextId();

	// get button IDs
	this._buttonElementId = new Object();
	for (var i = 0; i < this._buttonList.length; i++)
		this._buttonElementId[this._buttonList[i]] = Dwt.getNextId();

	DwtBaseDialog.call(this, parent, className, this._title, zIndex, mode, loc);
	DBG.timePt(AjxDebug.PERF, "DwtBaseDialog constructor");
	this._titleCell = document.getElementById(this._titleCellId);
	this._contentDiv = document.getElementById(this._contentId);

	// set up buttons
	this._button = new Object();
	for (var i = 0; i < this._buttonList.length; i++) {
		var buttonId = this._buttonList[i];
		this._button[buttonId] = new DwtButton(this);
		this._button[buttonId].setText(this._buttonDesc[buttonId].label);
		this._button[buttonId].buttonId = buttonId;
		this._button[buttonId].addSelectionListener(new AjxListener(this, this._buttonListener));
		document.getElementById(this._buttonElementId[buttonId]).appendChild(this._button[buttonId].getHtmlElement());
	}
	this.initializeDragging(this._titleHandleId);
	DBG.timePt(AjxDebug.PERF, "setup buttons and init dragging");
}

DwtDialog.prototype = new DwtBaseDialog;
DwtDialog.prototype.constructor = DwtDialog;

function DwtDialog_ButtonDescriptor(id, label, align, callback, cellTemplate) {
	this.id = id;
	this.label = label;
	this.align = align;
	this.callback = callback;
	this.cellTemplate = cellTemplate;
}

DwtDialog.prototype.getAlignmentForButton =
function (id) {
	return DwtDialog.ALIGN[id];
};

DwtDialog.ALIGN_LEFT 		= 1;
DwtDialog.ALIGN_RIGHT 		= 2;
DwtDialog.ALIGN_CENTER 		= 3;

// standard buttons, their labels, and their positioning
DwtDialog.CANCEL_BUTTON 	= 1;
DwtDialog.OK_BUTTON 		= 2;
DwtDialog.DISMISS_BUTTON 	= 3;
DwtDialog.NO_BUTTON 		= 4;
DwtDialog.YES_BUTTON 		= 5;
DwtDialog.LAST_BUTTON 		= 5;
DwtDialog.NO_BUTTONS 		= 256;
DwtDialog.ALL_BUTTONS 		= [DwtDialog.CANCEL_BUTTON, DwtDialog.OK_BUTTON, 
							   DwtDialog.DISMISS_BUTTON, DwtDialog.NO_BUTTON, 
							   DwtDialog.YES_BUTTON];

DwtDialog.MSG_KEY = new Object();
DwtDialog.MSG_KEY[DwtDialog.CANCEL_BUTTON] 	= "cancel";
DwtDialog.MSG_KEY[DwtDialog.OK_BUTTON] 		= "ok";
DwtDialog.MSG_KEY[DwtDialog.DISMISS_BUTTON] = "dismiss";
DwtDialog.MSG_KEY[DwtDialog.NO_BUTTON] 		= "no";
DwtDialog.MSG_KEY[DwtDialog.YES_BUTTON] 	= "yes";

DwtDialog.ALIGN = new Object();
DwtDialog.ALIGN[DwtDialog.CANCEL_BUTTON]	= DwtDialog.ALIGN_RIGHT;
DwtDialog.ALIGN[DwtDialog.OK_BUTTON] 		= DwtDialog.ALIGN_RIGHT;
DwtDialog.ALIGN[DwtDialog.DISMISS_BUTTON] 	= DwtDialog.ALIGN_RIGHT;
DwtDialog.ALIGN[DwtDialog.NO_BUTTON] 		= DwtDialog.ALIGN_RIGHT;
DwtDialog.ALIGN[DwtDialog.YES_BUTTON] 		= DwtDialog.ALIGN_RIGHT;

// modes
DwtDialog.MODELESS = DwtBaseDialog.MODELESS;
DwtDialog.MODAL = DwtBaseDialog.MODAL;

// -------------------------------------------------------------------
// API Methods 
// -------------------------------------------------------------------

DwtDialog.prototype.toString = 
function() {
	return "DwtDialog";
};

DwtDialog.prototype.popdown =
function() {
	DwtBaseDialog.prototype.popdown.call(this);
	this.resetButtonStates();
};

/**
* Sets the dialog back to its original state after being constructed, by clearing any
* detail message and resetting the standard button callbacks.
*/
DwtDialog.prototype.reset =
function() {
	this._resetCallbacks();
	this.resetButtonStates();
	DwtBaseDialog.prototype.reset.call(this);
};

/**
 * Sets all buttons back to inactive
 */
DwtDialog.prototype.resetButtonStates =
function() {
	for (b in this._button) {
		this._button[b].setEnabled(true);
		this._button[b].setActivated(false);
	}
};

DwtDialog.prototype.getButton =
function(buttonId) {
	return this._button[buttonId];
};

DwtDialog.prototype.setButtonEnabled = 
function(buttonId, enabled) {
	this._button[buttonId].setEnabled(enabled);
};

DwtDialog.prototype.setButtonVisible = 
function(buttonId, visible) {
	this._button[buttonId].setVisible(visible);
};

DwtDialog.prototype.getButtonEnabled = 
function(buttonId) {
	return this._button[buttonId].getEnabled();
};

/**
* Registers a callback on the given button.
*
* @param button		one of the standard dialog buttons
* @param func		callback method
* @param obj		callback obj
*/
DwtDialog.prototype.registerCallback =
function(buttonId, func, obj, args) {
	this._buttonDesc[buttonId].callback = new AjxCallback(obj, func, args);
}
DwtDialog.prototype.unregisterCallback =
function(buttonId) {
	this._buttonDesc[buttonId].callback = null;
};

/**
* Makes the given listener the only listener for the given button.
*
* @param button		one of the standard dialog buttons
* @param listener	a listener
*/
DwtDialog.prototype.setButtonListener =
function(buttonId, listener) {
	this._button[buttonId].removeSelectionListeners();
	this._button[buttonId].addSelectionListener(listener);
}

/**
* Sets the dialog title.
*/
DwtDialog.prototype.setTitle =
function(title) {
	this._title = title;
	this._titleCell.innerHTML = title;
}

/**
* Sets the dialog content (below the title, above the buttons).
*
* @param text		dialog content
*/
DwtBaseDialog.prototype._getContentDiv =
function (){
	return this._contentDiv;
};


DwtDialog.prototype.associateEnterWithButton =
function(id) {
	this._enterButtonId = id;
};


// Private methods


// -----------------------------------------------------------------------
// layout methods -- subclasses should override to customize layout
// -----------------------------------------------------------------------
DwtDialog.prototype._getStartBorder = 
function() {
	var html = new Array();
	var idx = 0;
	html[idx++] = DwtBaseDialog.prototype._getStartBorder.call(this);
	if (AjxEnv.isNav) {
		html[idx++] = "<input type='button' id='";
		html[idx++] = this._focusElementId = Dwt.getNextId();
		html[idx++] = "' style='height:0px; width:0px;";
		html[idx++] = "display:none;";
		html[idx++] = "'>";
	}

	return html.join("");
};

DwtDialog.prototype._getContentHtml =
function() {
	var html = new Array();
	var idx = 0;
	html[idx++] = DwtBaseDialog.prototype._getContentHtml.call(this);
	idx = this._addButtonsHtml(html,idx);
	return html.join("");
};

DwtDialog.prototype._getSeparatorTemplate =
function () {
	return "<div class=horizSep></div>";
};

DwtDialog.prototype._getButtonsContainerStartTemplate =
function () {
	return "<table cellspacing='0' cellpadding='0' border='0' width='100%'><tr>";
};

DwtDialog.prototype._getButtonsAlignStartTemplate =
function () {
	return "<td align=\"{0}\"><table cellspacing='5' cellpadding='0' border='0'><tr>";
};

DwtDialog.prototype._getButtonsAlignEndTemplate =
function () {
	return "</tr></table></td>";
};

DwtDialog.prototype._getButtonsCellTemplate =
function () {
	return "<td id=\"{0}\"></td>";
};

DwtDialog.prototype._getButtonsContainerEndTemplate =
function () {
	return  "</tr></table>";
};

DwtDialog.prototype._addButtonsHtml =
function(html, idx) {
	if (this._buttonList) {
		var leftButtons = new Array();
		var rightButtons = new Array();
		var centerButtons = new Array();
		for (var i = 0; i < this._buttonList.length; i++) {
			var buttonId = this._buttonList[i];
			switch (this._buttonDesc[buttonId].align) {
				case DwtDialog.ALIGN_RIGHT: 	rightButtons.push(buttonId); break;
				case DwtDialog.ALIGN_LEFT: 		leftButtons.push(buttonId); break;
				case DwtDialog.ALIGN_CENTER:	centerButtons.push(buttonId); break;
			}
		}
		html[idx++] = this._getSeparatorTemplate();
		html[idx++] = this._getButtonsContainerStartTemplate();
		
		if (leftButtons.length) {
			html[idx++] = AjxMessageFormat.format(
								  this._getButtonsAlignStartTemplate(),
								  ["left"]);
			for (var i = 0; i < leftButtons.length; i++) {
				var buttonId = leftButtons[i];
				var cellTemplate = this._buttonDesc[buttonId].cellTemplate ? 
					this._buttonDesc[buttonId].cellTemplate : this._getButtonsCellTemplate();
		 		html[idx++] = AjxMessageFormat.format(
								  cellTemplate,
								  [this._buttonElementId[buttonId]]);
		 	}
			html[idx++] = this._getButtonsAlignEndTemplate();
		}
		if (centerButtons.length){
			html[idx++] = AjxMessageFormat.format(
								this._getButtonsAlignStartTemplate(),
								["center"]);
			for (var i = 0; i < centerButtons.length; i++) {
				var buttonId = centerButtons[i];
				var cellTemplate = this._buttonDesc[buttonId].cellTemplate ? 
					this._buttonDesc[buttonId].cellTemplate : this._getButtonsCellTemplate();				
		 		html[idx++] = AjxMessageFormat.format(
								cellTemplate,
								[this._buttonElementId[buttonId]]);
		 	}
			html[idx++] = this._getButtonsAlignEndTemplate();
		}
		if (rightButtons.length) {
			html[idx++] = AjxMessageFormat.format(
								this._getButtonsAlignStartTemplate(),
								["right"]);
			for (var i = 0; i < rightButtons.length; i++) {
				var buttonId = rightButtons[i];
				var cellTemplate = this._buttonDesc[buttonId].cellTemplate ? 
					this._buttonDesc[buttonId].cellTemplate : this._getButtonsCellTemplate();				

		 		html[idx++] = AjxMessageFormat.format(cellTemplate,
													[this._buttonElementId[buttonId]]);
		 	}
			html[idx++] = this._getButtonsAlignEndTemplate();
		}
		html[idx++] = this._getButtonsContainerEndTemplate();
	}	
	return idx;
};

// Button listener that checks for callbacks
DwtDialog.prototype._buttonListener =
function(ev, args) {
	var obj = DwtUiEvent.getDwtObjFromEvent(ev);
	var buttonId = obj.buttonId;
	this._runCallbackForButtonId(buttonId, args);
};

DwtDialog.prototype._runCallbackForButtonId =
function(id, args) {
	var callback = this._buttonDesc[id].callback;
	if (!callback) return;
	args = (args instanceof Array) ? args : [args];
	callback.run.apply(callback, args);
};

DwtDialog.prototype._runEnterCallback =
function(args) {
	if (this._enterButtonId && this.getButtonEnabled(this._enterButtonId)) {
		this._runCallbackForButtonId(this._enterButtonId, args);
	}
};

// Default callbacks for the standard buttons.
DwtDialog.prototype._resetCallbacks =
function() {
	for (var i = 0; i < DwtDialog.ALL_BUTTONS.length; i++) {
		var id = DwtDialog.ALL_BUTTONS[i];
		if (this._buttonDesc[id])
			this._buttonDesc[id].callback = new AjxCallback(this, this.popdown);
	}
};
