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
* Creates a new wizard dialog.
* @constructor
* @class
* @param parent - parent control (shell)
* @param className - CSS class name
* @param title - dialog title
* @param w - content area width
* @param h - content area height
* This class represents a reusable wizard dialog. 
*/
function DwtWizardDialog (parent, className, title, w, h) {
	if (arguments.length == 0) return;
	var clsName = className || "DwtDialog";
	
	var nextButton = new DwtDialog_ButtonDescriptor(DwtWizardDialog.NEXT_BUTTON, AjxMsg._next, DwtDialog.ALIGN_RIGHT, new AjxCallback(this, this.goNext));
	var prevButton = new DwtDialog_ButtonDescriptor(DwtWizardDialog.PREV_BUTTON, AjxMsg._prev, DwtDialog.ALIGN_RIGHT, new AjxCallback(this, this.goPrev));
	var finishButton = new DwtDialog_ButtonDescriptor(DwtWizardDialog.FINISH_BUTTON, AjxMsg._finish, DwtDialog.ALIGN_RIGHT, new AjxCallback(this, this.finishWizard));
	DwtDialog.call(this, parent, clsName, null, [DwtDialog.CANCEL_BUTTON], [prevButton,nextButton,finishButton]);

	if (!w) {
		this._contentW = "80ex";
	} else {
		this._contentW = w;
	}
	
	if(!h) {
		this._contentH = "100ex";
	} else {
		this._contentH = h;
	}
	
	this._pages = new Array(); 
	this._pageIx = 1;
	this._currentPage = 1;
	this._progressDiv = document.createElement("div");
	this._progressDiv.style.position = DwtControl.STATIC_STYLE;
	this._pageDiv = document.createElement("div");
	this._pageDiv.className = "DwtWizardDialogPageDiv";
	this._pageDiv.style.width = this._contentW;
	this._pageDiv.style.height = this._contentH;
	this._progressBar = new DwtWizProgressBar(this);
	this._createContentHtml();
	this.setTitle(title);
}

DwtWizardDialog.prototype = new DwtDialog;
DwtWizardDialog.prototype.constructor = DwtWizardDialog;

//Z-index contants for the tabbed view contents are based on Dwt z-index constants
DwtWizardDialog.Z_ACTIVE_PAGE = Dwt.Z_VIEW+10;
DwtWizardDialog.Z_HIDDEN_PAGE = Dwt.Z_HIDDEN;
DwtWizardDialog.Z_TAB_PANEL = Dwt.Z_VIEW+20;
DwtWizardDialog.Z_CURTAIN = Dwt.Z_CURTAIN;

DwtWizardDialog.NEXT_BUTTON = 12;
DwtWizardDialog.PREV_BUTTON = 11;
DwtWizardDialog.FINISH_BUTTON = 13;

//public methods
DwtWizardDialog.prototype.toString = 
function () {
	return "DwtWizardDialog";
}

DwtWizardDialog.prototype.popdown = 
function () {
	DwtDialog.prototype.popdown.call(this);
	this._hideAllPages();
}

/**
* Makes the dialog visible, and places it. Everything under the dialog will become veiled
* if we are modal.
*
* @param loc	the desired location
*//*
DwtWizardDialog.prototype.popup =
function(loc) {

	var thisZ = this._zIndex;
	if (this._mode == DwtDialog.MODAL) {
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
	}
	Dwt._ffOverflowHack(this._htmlElId, thisZ, false);
	loc = this._loc = loc || this._loc; // use whichever has a value, local has precedence
	var sizeShell = this._shell.getSize();
	var sizeThis = this.getSize();
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
	
	this.setZIndex(thisZ);
}
*/
/*
* @param pageKey - key to the page to be shown. 
* pageKey is the value returned from @link DwtWizardDialog.prototype.addPage method
* This method is called by 
*	@link DwtWizardPage.prototype.switchToNextPage 
*	and 
*	@link DwtWizardPage.prototype.switchToPrevPage
*/
DwtWizardDialog.prototype.goPage = 
function(pageKey) {
	if(this._pages && this._pages[pageKey]) {
		this._currentPage = pageKey;
		this._showPage(pageKey);
		this._progressBar.showStep(pageKey);
		this._pages[pageKey].setActive();
	}
}

DwtWizardDialog.prototype.goNext = 
function() {
	var nextPageKey = this._currentPage + 1;
	if(this._pages && this._pages[this._currentPage]) {
		this._pages[this._currentPage].switchToNextPage(nextPageKey);
	}

}

DwtWizardDialog.prototype.goPrev = 
function() {
	var prevPageKey = this._currentPage - 1;
	if(this._pages && this._pages[this._currentPage]) {
		this._pages[this._currentPage].switchToPrevPage(prevPageKey);
	}
}

DwtWizardDialog.prototype.finishWizard = 
function() {
	this.popdown();	
}

/**
* public method getPage
* @param pageKey  -  key for the page, returned from @link addPage
* @return - the view tab (DwtPropertyPage) 
**/
DwtWizardDialog.prototype.getPage =
function (pageKey) {
	if(this._pages && this._pages[pageKey])
		return this._pages[pageKey];
	else
		return null;
}

/**
* public method addPage
* @param wizPage - instance of DwtPropertyPage 
* @return - the key for the added page. This key can be used to retreive the tab using @link getPage.
**/
DwtWizardDialog.prototype.addPage =
function (wizPage, stepTitle) {
	var pageKey = this._pageIx++;	
	this._pages[pageKey] = wizPage;
	//add a step to the progress bar
/*	if(stepTitle == null)
 		stepTitle = pageKey;*/
	this._progressBar.addStep(pageKey, stepTitle);
	//add the page 
	this._pageDiv.appendChild(this._pages[pageKey].getHtmlElement());
	
	if(pageKey==1) //show the first tab 
		this._pages[pageKey].setZIndex(DwtWizardDialog.Z_ACTIVE_PAGE); 
	else {
		//hide all the other tabs
		this._pages[pageKey].setZIndex(DwtWizardDialog.Z_HIDDEN_PAGE); 
		Dwt.setVisible(this._pages[pageKey].getHtmlElement(), false);
	}
	return pageKey;
}

//private and protected methods

/**
* method _createHtml 
**/

DwtWizardDialog.prototype._createContentHtml =
function () {

	this._table = document.createElement("table");
	this._table.border = 0;
	this._table.width = this._contentW;
	this._table.cellPadding = this._table.cellSpacing = 0;

	Dwt.associateElementWithObject(this._table, this);
	this._table.backgroundColor = DwtCssStyle.getProperty(this.parent.getHtmlElement(), "background-color");
	
	var row1; //_progressBar
	var col1;
	row1 = this._table.insertRow(0);
	row1.align = "left";
	row1.vAlign = "middle";
	
	col1 = row1.insertCell(row1.cells.length);
	col1.align = "left";
	col1.vAlign = "middle";
	col1.noWrap = true;	
	col1.width="100%";
	col1.className="DwtTabTable";
	col1.appendChild(this._progressBar.getHtmlElement());

	var rowSep;//separator
	var colSep;
	rowSep = this._table.insertRow(1);
	rowSep.align = "center";
	rowSep.vAlign = "middle";
	
	colSep = rowSep.insertCell(rowSep.cells.length);
	colSep.align = "left";
	colSep.vAlign = "middle";
	colSep.noWrap = true;	
	colSep.style.width = this._contentW;
	var sepDiv = document.createElement("div");
	sepDiv.className = "horizSep";
	sepDiv.style.width = this._contentW;
	sepDiv.style.height = "5px";
	colSep.appendChild(sepDiv);
	
	var row2; //page
	var col2;
	row2 = this._table.insertRow(2);
	row2.align = "left";
	row2.vAlign = "middle";
	
	col2 = row2.insertCell(row2.cells.length);
	col2.align = "left";
	col2.vAlign = "middle";
	col2.noWrap = true;	
	col2.width = this._contentW;
	col2.appendChild(this._pageDiv);

	this._contentDiv.appendChild(this._table);
}

/**
* Override addChild method. We need internal control over layout of the children in this class.
* Child elements are added to this control in the _createHTML method.
* @param child
**/
DwtWizardDialog.prototype.addChild =
function(child) {
	this._children.add(child);
}

DwtWizardDialog.prototype._showPage = 
function(pageKey) {
	if(this._pages && this._pages[pageKey]) {
		//hide all the tabs
		this._hideAllPages();
		//make this tab visible
		this._pages[pageKey].showMe();
		//this._pages[pageKey].setZIndex(DwtWizardDialog.Z_ACTIVE_PAGE);
		Dwt.setVisible(this._pages[pageKey].getHtmlElement(), true);
	}
}

DwtWizardDialog.prototype._hideAllPages = 
function() {
	if(this._pages && this._pages.length) {
		for(var curPageKey in this._pages) {
			if(this._pages[curPageKey]) {
				this._pages[curPageKey].hideMe();
				//this._pages[curPageKey].setZIndex(DwtWizardDialog.Z_HIDDEN_PAGE);
				Dwt.setVisible(this._pages[curPageKey].getHtmlElement(), false);
			}	
		}
	}
}


/**
* @class
* @constructor
* DwtWizardpage abstract class for a page in a wizard dialog
* tab pages are responsible for creating there own HTML and populating/collecting 
* data to/from any form fields that they display
**/
function DwtWizardPage(parent, className) {
	if (arguments.length == 0) return;
	var clsName = className || "DwtDialog";
	DwtPropertyPage.call(this, parent, className, DwtControl.ABSOLUTE_STYLE);
}

DwtWizardPage.prototype = new DwtTabViewPage;
DwtWizardPage.prototype.constructor = DwtWizardPage;

DwtWizardPage.prototype.toString = 
function() {
	return "DwtWizardPage";
}

/**
* setActive is called when the page is activated. 
**/
DwtWizardPage.prototype.setActive =
function () {

}

/**
* @param pageKey - key for the next page
* Checks if it is ok to leave go to the next page. 
* Default implementation does not check anything.
**/
DwtWizardPage.prototype.switchToNextPage = 
function (pageKey) {
	this.parent.goPage(pageKey);
}

/**
* @param pageKey - key for the previous page
* Checks if it is ok to leave go to the previous page. 
* Default implementation does not check anything.
**/
DwtWizardPage.prototype.switchToPrevPage = 
function (pageKey) {
	this.parent.goPage(pageKey);
}

DwtWizardPage.prototype.showMe = 
function() {
	this.setZIndex(DwtTabView.Z_ACTIVE_TAB);
	/*
	DBG.println(AjxDebug.DBG3, "DwtWizardPage.prototype.showMe");
	DBG.println(AjxDebug.DBG3, "this.parent.getHtmlElement().offsetHeight: " + this.parent.getHtmlElement().offsetHeight);		
	DBG.println(AjxDebug.DBG3, "this.parent.getHtmlElement().clientHeight: " + this.parent.getHtmlElement().clientHeight);				
	DBG.println(AjxDebug.DBG3, "this.parent.getHtmlElement().offsetWidth: " + this.parent.getHtmlElement().offsetWidth);		
	DBG.println(AjxDebug.DBG3, "this.parent.getHtmlElement().clientWidth: " + this.parent.getHtmlElement().clientWidth);				
	DBG.println(AjxDebug.DBG3, "this.parent._contentH: " + this.parent._contentH);					
	DBG.println(AjxDebug.DBG3, "this.parent._contentW: " + this.parent._contentW);		
	*/
	this.getHtmlElement().style.height = this.parent._contentH;
	this.getHtmlElement().style.width = this.parent._contentW;
	
}
/**
* @class DwtWizProgressBar
* @constructor
* @param parent
**/
function DwtWizProgressBar(parent) {
	if (arguments.length == 0) return;
	DwtComposite.call(this, parent, "DwtWizProgressBar", DwtControl.STATIC_STYLE);
	this._table = document.createElement("table");
	this._table.border = 0;
	this._table.cellPadding = 0;
	this._table.cellSpacing = 0;
	this.getHtmlElement().appendChild(this._table);
	this._table.backgroundColor = DwtCssStyle.getProperty(this.parent.getHtmlElement(), "background-color");
	this._stepsNumber = 0; //number of steps
	this._steps = new Array();
	this._lblHeader = new DwtStepLabel(this);
	this._lblHeader.setText("Step 0 of 0");
	this._lblHeader.setActive(true);
}


DwtWizProgressBar.prototype = new DwtComposite;
DwtWizProgressBar.prototype.constructor = DwtWizProgressBar;

DwtWizProgressBar.prototype.toString = 
function() {
	return "DwtWizProgressBar";
}

/**
* @param stepKey
**/
DwtWizProgressBar.prototype.showStep = 
function(stepKey) {
	var szLabelTxt = "Step " + stepKey + " of " + this._stepsNumber;
	if(this._steps[stepKey]) {
		szLabelTxt = szLabelTxt + ": " + this._steps[stepKey];
	}
	this._lblHeader.setText(szLabelTxt);
}

/**
* @param stepKey
* @param stepNumber
**/
DwtWizProgressBar.prototype.addStep =
function (stepKey, stepTitle) {
	this._steps[stepKey] = stepTitle;
	return (++this._stepsNumber);
}

DwtWizProgressBar.prototype.addChild =
function(child) {
	this._children.add(child);
	var row;
	var col;
	this._table.width = "100%";
	row = (this._table.rows.length != 0) ? this._table.rows[0]: this._table.insertRow(0);
	row.align = "center";
	row.vAlign = "middle";
		
	col = row.insertCell(row.cells.length);
	col.align = "center";
	col.vAlign = "middle";
	col.noWrap = true;
	col.appendChild(child.getHtmlElement());
}


/**
* @class DwtStepLabel
* @constructor
* @param parent
**/
function DwtStepLabel (parent) {
	DwtLabel.call(this, parent, DwtLabel.ALIGN_CENTER, "DwtStepLabel");
}

DwtStepLabel.prototype = new DwtLabel;
DwtStepLabel.prototype.constructor = DwtStepLabel;

DwtStepLabel.prototype.toString = 
function() {
	return "DwtStepLabel";
}

DwtStepLabel.prototype.setActive = 
function(isActive) {
	if (isActive) {
 		this._textCell.className="DwtStepLabelActive";
 	} else {
	 	this._textCell.className="DwtStepLabelInactive";
 	}
}

