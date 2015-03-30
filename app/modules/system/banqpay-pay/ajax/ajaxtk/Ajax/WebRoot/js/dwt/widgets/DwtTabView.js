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
* @constructor
* DwtTabView  - class for the tabbed view
* DwtTabView manages the z-index of the contained tabs. 
* @author Greg Solovyev
**/
function DwtTabView(parent, className, positionStyle) {
	if (arguments.length == 0) return;
	var clsName = className || "DwtTabView";
	
	var posStyle = DwtControl.ABSOLUTE_STYLE;
	if ((positionStyle !== void 0) && (positionStyle !== null)){
	    posStyle = positionStyle;
	}
	DwtComposite.call(this, parent, clsName, posStyle);
	this._stateChangeEv = new DwtEvent(true);
	this._tabs = new Array(); 
	this._tabIx = 1;
	this._pageDiv = document.createElement("div");
	this._pageDiv.className = clsName;
	this._pageDiv.style.position = DwtControl.STATIC_STYLE;
	this._tabBar = new DwtTabBar(this);
	this._createHTML();
}

DwtTabView.prototype = new DwtComposite;
DwtTabView.prototype.constructor = DwtTabView;

DwtTabView.prototype.toString = 
function() {
	return "DwtTabView";
}

//Z-index contants for the tabbed view contents are based on Dwt z-index constants
DwtTabView.Z_ACTIVE_TAB = Dwt.Z_VIEW+10;
DwtTabView.Z_HIDDEN_TAB = Dwt.Z_HIDDEN;
DwtTabView.Z_TAB_PANEL = Dwt.Z_VIEW+20;
DwtTabView.Z_CURTAIN = Dwt.Z_CURTAIN;

//public methods

DwtTabView.prototype.addStateChangeListener = function(listener) {
	this._eventMgr.addListener(DwtEvent.STATE_CHANGE, listener);
}

DwtTabView.prototype.removeStateChangeListener = function(listener) {
	this._eventMgr.removeListener(DwtEvent.STATE_CHANGE, listener);
}

/**
* @param title  -  text for the tab button
* @param tabView - instance of DwtTabViewPage 
* @return - the key for the added tab. This key can be used to retreive the tab using @link getTab
* public method addTab. Note that this method does not automatically update the tabs panel.
**/
DwtTabView.prototype.addTab =
function (title, tabView) {
	var tabKey = this._tabIx++;	
	this._tabs[tabKey] = new Object();
	this._tabs[tabKey]["title"] = title;

	//add the button to the tab bar
	this._tabs[tabKey]["button"] = this._tabBar.addButton(tabKey, title);
	//add the page 
	if(tabView) {
		this._tabs[tabKey]["view"] = tabView;
		this._pageDiv.appendChild(this._tabs[tabKey]["view"].getHtmlElement());
		tabView._tabKey = tabKey;
	} else {
		this._tabs[tabKey]["view"] = null;
	}		
	
	if(tabKey==1) { //show the first tab 
		if(this._tabs[tabKey]["view"])
			this._tabs[tabKey]["view"].showMe();
		this._currentTabKey = tabKey;		
		this.switchToTab(tabKey);
	} else {
		//hide all the other tabs
		if(this._tabs[tabKey]["view"]) {		
			this._tabs[tabKey]["view"].hideMe();
			Dwt.setVisible(this._tabs[tabKey]["view"].getHtmlElement(), false);
		}			
	}
	
	this._tabBar.addSelectionListener(tabKey, new AjxListener(this, DwtTabView.prototype._tabButtonListener));	
		
	return tabKey;
}

DwtTabView.prototype.getCurrentTab = function() {
	return this._currentTabKey;
}

/**
* @param tabKey  -  key for the tab, returned from @link addTab
* @return - the view tab (DwtTabViewpage) 
**/
DwtTabView.prototype.getTab =
function (tabKey) {
	if(this._tabs && this._tabs[tabKey])
		return this._tabs[tabKey];
	else
		return null;
}

DwtTabView.prototype.getTabTitle =
function(tabKey) {
	return this._tabs && this._tabs[tabKey] ? this._tabs[tabKey]["title"] : null;
};
DwtTabView.prototype.getTabButton =
function(tabKey) {
	return this._tabs && this._tabs[tabKey] ? this._tabs[tabKey]["button"] : null;
};
DwtTabView.prototype.getTabView =
function(tabKey) {
	return this._tabs && this._tabs[tabKey] ? this._tabs[tabKey]["view"] : null;
};

DwtTabView.prototype.switchToTab = 
function(tabKey) {
	if(this._tabs && this._tabs[tabKey]) {
		this._showTab(tabKey);
		this._tabBar.openTab(tabKey);
	}
	if (this._eventMgr.isListenerRegistered(DwtEvent.STATE_CHANGE)) {
		this._eventMgr.notifyListeners(DwtEvent.STATE_CHANGE, this._stateChangeEv);
	}
}

DwtTabView.prototype.setBounds =
function(x, y, width, height) {
	DwtComposite.prototype.setBounds.call(this, x, y, width, height);
	this._resetTabSizes(width, height);
}

DwtTabView.prototype.getActiveView =
function() {
	return this._tabs[this._currentTabKey].view;
}

//protected methods

DwtTabView.prototype._resetTabSizes = 
function (width, height) {
    var tabBarSize = this._tabBar.getSize();
	var tabBarHeight = tabBarSize.y || this._tabBar.getHtmlElement().clientHeight;

	var tabWidth = width;
	var tabHeight = height - tabBarHeight;
	
	if(this._tabs && this._tabs.length) {
		for(var curTabKey in this._tabs) {
			if(this._tabs[curTabKey]["view"]) {
				this._tabs[curTabKey]["view"].resetSize(width, height);
			}	
		}
	}		
}

/**
* method createHTML 
**/
DwtTabView.prototype._createHTML =
function () {
	this._table = document.createElement("table");
	this.getHtmlElement().appendChild(this._table);
	this._table.width = "100%";
	this._table.border = this._table.cellPadding = this._table.cellSpacing = 0;
	this._table.backgroundColor = DwtCssStyle.getProperty(this.parent.getHtmlElement(), "background-color");
	
	var row1 = this._table.insertRow(-1);
	row1.align = "left";
	row1.vAlign = "middle";
	
	var col1 = row1.insertCell(-1);
	col1.align = "left";
	col1.vAlign = "middle";
	col1.noWrap = true;	
	col1.width="100%";
	col1.className="DwtTabTable";
	col1.appendChild(this._tabBar.getHtmlElement());

	var row2 = this._table.insertRow(-1);
	row2.align = "left";
	row2.vAlign = "middle";
	
	var col2 = row2.insertCell(-1);
	col2.align = "left";
	col2.vAlign = "middle";
	col2.noWrap = true;	
	col2.appendChild(this._pageDiv);
}

/**
* Override addChild method. We need internal control over layout of the children in this class.
* Child elements are added to this control in the _createHTML method.
* @param child
**/
DwtTabView.prototype.addChild =
function(child) {
	this._children.add(child);
}

DwtTabView.prototype._showTab = 
function(tabKey) {
	if(this._tabs && this._tabs[tabKey]) {
		this._currentTabKey = tabKey;
		//hide all the tabs
		this._hideAllTabs();
		//make this tab visible
		if(this._tabs[tabKey]["view"]) {
			Dwt.setVisible(this._tabs[tabKey]["view"].getHtmlElement(), true);
			this._tabs[tabKey]["view"].showMe();
		}
	}
}

DwtTabView.prototype._hideAllTabs = 
function() {
	if(this._tabs && this._tabs.length) {
		for(var curTabKey in this._tabs) {
			if(this._tabs[curTabKey]["view"]) {
				this._tabs[curTabKey]["view"].hideMe();
				//this._tabs[curTabKey]["view"].setZIndex(DwtTabView.Z_HIDDEN_TAB);
				Dwt.setVisible(this._tabs[curTabKey]["view"].getHtmlElement(), false);
			}	
		}
	}
}

/**
 * EMC 12/2/2004
 * This method could be invoked from various different locations, 
 * one being the DwtButton object, or the table that encloses the button.
 * The events, then are either selection events, or mouse up events. We handle
 * both cases here. In the case of the mouse up over the table, we are probably
 * over one of the tab images, which means we will walk up the dom to find
 * the table, which has the tab key attribute.
 */
DwtTabView.prototype._tabButtonListener = 
function (ev) {
    if(ev.item instanceof DwtButton) {
		this.switchToTab(ev.item.getData("tabKey"));
    } else {
	if (ev && ev.target) {
	    /**
	    * Greg Solovyev 1/3/2005 
		* changed ev.target.offsetParent.offsetParent to
		* lookup for the table up the elements stack, because the mouse down event may come from the img elements 
		* as well as from the td elements.	    
		**/
	    var elem = ev.target;
	    while(elem.tagName != "TABLE" && elem.offsetParent ) {
	    	elem = elem.offsetParent;
	    }
	    var tabKey = elem.getAttribute("tabKey");
	    if ((tabKey !== void 0) && (tabKey !== null)){
			this.switchToTab(tabKey);
	    }
	}
    }
}
	    

/**
* @class
* @constructor
* DwtTabViewPage abstract class for a page in a tabbed view
* tab pages are responsible for creating there own HTML and populating/collecting 
* data to/from any form fields that they display
**/
function DwtTabViewPage(parent, className, posStyle) {
	if (arguments.length == 0) return;
	var clsName = className || "DwtTabViewPage";
	var ps = posStyle || DwtControl.ABSOLUTE_STYLE;
	this._rendered = true; //by default UI creation is not lazy
	DwtPropertyPage.call(this, parent, clsName, ps);
}

DwtTabViewPage.prototype = new DwtPropertyPage;
DwtTabViewPage.prototype.constructor = DwtTabViewPage;

DwtTabViewPage.prototype.toString = 
function() {
	return "DwtTabViewPage";
}

DwtTabViewPage.prototype.showMe = 
function() {
	this.setZIndex(DwtTabView.Z_ACTIVE_TAB);
	if(this.parent.getHtmlElement().offsetHeight > 80) { //if the parent is visible use offsetHeight
		this.getHtmlElement().style.height=this.parent.getHtmlElement().offsetHeight-80;
	} else {
		//if the parent is not visible yet, then resize the page to fit the parent
		var parentHeight = parseInt(this.parent.getHtmlElement().style.height);
		var units = AjxStringUtil.getUnitsFromSizeString(this.parent.getHtmlElement().style.height);
		if(parentHeight > 80) {
			this.getHtmlElement().style.height = (Number(parentHeight-80).toString() + units);
		}
	}
	if(this.parent.getHtmlElement().offsetWidth > 0) //if the parent is visible use offsetWidth
		this.getHtmlElement().style.width=this.parent.getHtmlElement().offsetWidth;
	else {
		//if the parent is not visible yet, then resize the page to fit the parent
		this.getHtmlElement().style.width = this.parent.getHtmlElement().style.width;
	}
}

DwtTabViewPage.prototype.hideMe = 
function() {
	this.setZIndex(DwtTabView.Z_HIDDEN_TAB);
}


DwtTabViewPage.prototype.resetSize = 
function(newWidth, newHeight) {
	if(this._rendered) {
		this.setSize(newWidth, newHeight);
	}
}


/**
* @class
* @constructor
* @param parent
* DwtTabBar 
**/
function DwtTabBar(parent, tabCssClass, btnCssClass) {
	if (arguments.length == 0) return;
	//var _className = className || "DwtTabBar";
	this._buttons = new Array();
	this._tbuttons = new Array();
	this._btnStyle = btnCssClass ? btnCssClass : "DwtTabButton";
	this._btnImage = null;
	this._currentTabKey = 1;
	var myClass = tabCssClass ? tabCssClass : "DwtTabBar";

	DwtToolBar.call(this, parent, myClass, DwtControl.STATIC_STYLE);

	// NOTE: We explicitly pass in an index so that we can do exact
	//		 positioning of the spacer and filler elements.	
	this.addSpacer(null, 0);
	this.addFiller(null, 1);
}

DwtTabBar.prototype = new DwtToolBar;
DwtTabBar.prototype.constructor = DwtTabBar;

//public members
DwtTabBar.prototype.toString = 
function() {
	return "DwtTabBar";
}

DwtTabBar.prototype.getCurrentTab = 
function() {
	return this._currentTabKey;
}

DwtTabBar.prototype.addSpacer = 
function(size, index) {
	var el = DwtToolBar.prototype.addSpacer.apply(this, arguments);
	el.parentNode.style.verticalAlign = "bottom";
	return el;
}

DwtTabBar.prototype.addFiller = 
function(className, index) {
	var el = DwtToolBar.prototype.addFiller.apply(this, arguments);
	el.parentNode.style.verticalAlign = "bottom";
	return el;
}

DwtTabBar.prototype.addStateChangeListener = 
function(listener) {
	this._eventMgr.addListener(DwtEvent.STATE_CHANGE, listener);
}

DwtTabBar.prototype.removeStateChangeListener = 
function(listener) {
	this._eventMgr.removeListener(DwtEvent.STATE_CHANGE, listener);
}

/**
* @param tabId - the id used to create tab button in @link DwtTabBar.addButton method
* @param listener - AjxListener
**/
DwtTabBar.prototype.addSelectionListener =
function(tabKey, listener) {
	this._buttons[tabKey].addSelectionListener(listener);
	// This is for later retrieval in the listener method.
	this._tbuttons[tabKey].table.setAttribute("tabKey", tabKey);
	this._tbuttons[tabKey].leftImg.setAttribute("tabKey", tabKey);
	this._tbuttons[tabKey].rightImg.setAttribute("tabKey", tabKey);
	this._tbuttons[tabKey].leftTopImg.setAttribute("tabKey", tabKey);
	this._tbuttons[tabKey].rightTopImg.setAttribute("tabKey", tabKey);	
	this._tbuttons[tabKey].topImg.setAttribute("tabKey", tabKey);		
	this._tbuttons[tabKey]._bottomRow.setAttribute("tabKey", tabKey);		
	this._tbuttons[tabKey].addListener(DwtEvent.ONMOUSEUP, listener);
}

/**
* @param tabId - the id used to create tab button in @link DwtTabBar.addButton method
* @param listener - AjxListener
**/
DwtTabBar.prototype.removeSelectionListener =
function(tabKey, listener) {
	this._buttons[tabKey].removeSelectionListener(listener);
}

/**
* @param tabKey
* @param tabTitle
**/
DwtTabBar.prototype.addButton =
function(tabKey, tabTitle) {
	var tb = this._tbuttons[tabKey] = new DwtTabButton(this);
	var b = this._buttons[tabKey] = new DwtButton(tb, null, this._btnStyle, DwtControl.RELATIVE_STYLE);	
	
	// HACK: This is to get around resetting of button className during hover.
	var be = b.getHtmlElement();
	be.style.position = "relative";
	be.style.top = "-3px";
	
	this._buttons[tabKey].addSelectionListener(new AjxListener(this, DwtTabBar._setActiveTab));
	this._tbuttons[tabKey].addListener(DwtEvent.ONMOUSEUP, (new AjxListener(this,DwtTabBar._setActiveTab)));
	
	if (this._btnImage != null)
		b.setImage(this._btnImage);

	if (tabTitle != null)
		b.setText(tabTitle);

	b.setEnabled(true);
	b.setData("tabKey", tabKey);

	if(parseInt(tabKey) == 1)
		tb.setOpen();

	return b;
}

/**
* @param tabKey
* @return {DwtButton}
**/
DwtTabBar.prototype.getButton = 
function (tabKey) {
	if(this._buttons[tabKey])
		return this._buttons[tabKey];
	else 
		return null;
}

DwtTabBar.prototype.openTab = 
function(tabK) {
	this._currentTabKey = tabK;
    var cnt = this._tbuttons.length;

    for(var ix = 0; ix < cnt; ix ++) {
		if(ix==tabK) continue;

		if(this._tbuttons[ix])
	    	this._tbuttons[ix].setClosed();
    }

    if(this._tbuttons[tabK])
		this._tbuttons[tabK].setOpen();

    var nextK = parseInt(tabK) + 1;
	if (this._eventMgr.isListenerRegistered(DwtEvent.STATE_CHANGE))
		this._eventMgr.notifyListeners(DwtEvent.STATE_CHANGE, this._stateChangeEv);
}

//private members
// NOTE: The IE box model fix isn't needed.
DwtTabBar.prototype.__itemPaddingRight = "0px";

/**
 * This method overrides DwtToolBar#_addItem to handle adding elements at
 * a specific index. If an index is specified, it is passed directly to
 * the superclass's _addItem method. If no index is specified, however,
 * then the index is set to the number of cells in the toolbar minus one.
 * This is done in order to place the item <em>before</em> the trailing
 * filler element.
 * <p>
 * <strong>Note:</strong>
 * The implementation of this method assumes that the first child of
 * the tab bar's div element is a table.
 */
DwtTabBar.prototype._addItem = 
function(type, element, index) {
	if (!AjxUtil.isNumber(index)) {
		var el = this.getHtmlElement().firstChild;
		index = this._style == DwtToolBar.HORIZ_STYLE 
			  ? (el.rows[0].cells.length - 1)
			  : (el.rows.length - 1);
	}

	DwtToolBar.prototype._addItem.call(this, type, element, index);
}

DwtTabBar.prototype._createSpacerElement = 
function() {
	var table = document.createElement("table");
	table.width = "100%";
	table.cellSpacing = table.cellPadding = 0;
	
	var row1 = table.insertRow(table.rows.length);
	var row2 = table.insertRow(table.rows.length);
	var row3 = table.insertRow(table.rows.length);
	
	var row3cell1 = row3.insertCell(row3.cells.length);
	AjxImg.setImage(row3cell1, "TabSpacer__H", null, true);
	
	return table;
}

DwtTabBar.prototype._createFillerElement = DwtTabBar.prototype._createSpacerElement;

/**
* Greg Solovyev 1/4/2005 
* changed ev.target.offsetParent.offsetParent to
* lookup for the table up the elements stack, because the mouse down event may come from the img elements 
* as well as from the td elements.
**/
DwtTabBar._setActiveTab =
function(ev) {
    var tabK = null;
    if(ev && ev.item) {
		tabK=ev.item.getData("tabKey");
    } else if (ev && ev.target) {
		var elem = ev.target;
	    while(elem.tagName != "TABLE" && elem.offsetParent )
	    	elem = elem.offsetParent;

		tabK = elem.getAttribute("tabKey");
		if (tabK == null)
			return false;
    } else {
		return false;
    }
    this.openTab(tabK);
};

/**
* @class
* @constructor
* DwtTabButton encapsulates DwtButton to create a button that looks like a tab switch
* This class creates a div with a table. The table hosts graphics DwtButton div and surrounding graphics.
**/
function DwtTabButton(parent) {
	if (arguments.length == 0) return;
	this._isClosed = true;
	DwtComposite.call(this, parent, "DwtTabButton");
	this._inactiveClassName = "DwtTabButton-inactive";
	this._activeClassName = "DwtTabButton-active";
	
	this._createHtml();

	this._setMouseEventHdlrs();
	this._mouseOverListener = new AjxListener(this, DwtTabButton.prototype._mouseOverListener);
	this._mouseOutListener = new AjxListener(this, DwtTabButton.prototype._mouseOutListener);

	this.addListener(DwtEvent.ONMOUSEOVER, this._mouseOverListener);
	this.addListener(DwtEvent.ONMOUSEOUT, this._mouseOutListener);
	this._mouseOutAction = new AjxTimedAction(this, this._handleMouseOut);
	this._mouseOutActionId = -1;
}

DwtTabButton.prototype = new DwtComposite;
DwtTabButton.prototype.constructor = DwtTabButton;

DwtTabButton.prototype.toString = 
function() {
	return "DwtTabButton";
}

DwtTabButton.prototype._createHtml = 
function() {
	this.table = document.createElement("table");
	this.table.border = this.table.cellPadding = this.table.cellSpacing = 0;
	this.table.align = "center";
	this.table.width = "100%";

	this._topRow = this.table.insertRow(-1);
	this._middleRow = this.table.insertRow(-1);
	this._bottomRow = this.table.insertRow(-1);	

	this._leftTopCell = this._topRow.insertCell(-1);
	this._centerTopCell = this._topRow.insertCell(-1);
	this._rightTopCell = this._topRow.insertCell(-1);

	this._leftMiddleCell = this._middleRow.insertCell(-1);
	this._centerMiddleCell = this._middleRow.insertCell(-1);
	this._rightMiddleCell = this._middleRow.insertCell(-1);

	this._leftBottomCell = this._bottomRow.insertCell(-1);
	this._centerBottomCell = this._bottomRow.insertCell(-1);
	this._rightBottomCell = this._bottomRow.insertCell(-1);

	this._leftTopCell.className = "DwtTabButtonTL";
	this._centerTopCell.className = "DwtTabButtonTM";
	this._rightTopCell.className = "DwtTabButtonTR";

	this._leftBottomCell.className = "DwtTabButtonBL";
	this._centerBottomCell.className = "DwtTabButtonBM";
	this._rightBottomCell.className = "DwtTabButtonBR";

	this.leftTopImg = document.createElement("div");
	this.topImg = document.createElement("div");
	this.rightTopImg = document.createElement("div");
	AjxImg.setImage(this.leftTopImg, "Tab_TL", null, true);
	AjxImg.setImage(this.topImg, "Tab_T__H", AjxImg.HORIZ_BORDER, true);
	AjxImg.setImage(this.rightTopImg, "Tab_TR", null, true);
	this._leftTopCell.appendChild(this.leftTopImg);
	this._centerTopCell.appendChild(this.topImg);
	this._rightTopCell.appendChild(this.rightTopImg);

	this.leftImg = this._leftMiddleCell;
	this.centerImg = this._centerMiddleCell;
	this.rightImg = this._rightMiddleCell;
	AjxImg.setImage(this.leftImg, "Tab_L__V", AjxImg.VERT_BORDER, true);
	AjxImg.setImage(this.centerImg, "Tab__BG", AjxImg.BACKGROUND, true);
	AjxImg.setImage(this.rightImg, "Tab_R__V", AjxImg.VERT_BORDER, true);

	this.leftBottomImg = document.createElement("div");
	this.bottomImg = document.createElement("div");
	this.rightBottomImg = document.createElement("div");
	AjxImg.setImage(this.leftBottomImg, "Tab_BL", null, true);
	AjxImg.setImage(this.bottomImg, "Tab_B__H", AjxImg.HORIZ_BORDER, true);
	AjxImg.setImage(this.rightBottomImg, "Tab_BR", null, true);
	this._leftBottomCell.appendChild(this.leftBottomImg);
	this._centerBottomCell.appendChild(this.bottomImg);
	this._rightBottomCell.appendChild(this.rightBottomImg);

	this.getHtmlElement().appendChild(this.table);
	this.table.className = this._inactiveClassName;
};

/**
* Changes the visual appearance to active tab and sets _isClosed to false
**/
DwtTabButton.prototype.setOpen = 
function() {
	this.table.className=this._activeClassName;	
	this.setTabImageState("TabSel");
	this._isClosed = false;
};

/**
* Changes the visual appearance to inactive tab and sets _isClosed to true
**/
DwtTabButton.prototype.setClosed = 
function() {
	this.table.className = this._inactiveClassName;	
	this.setTabImageState("Tab");
	this._isClosed = true;
};

/**
* @param child
* DwtComposite.addChild method is overriden to to create tab switch graphics
**/
DwtTabButton.prototype.addChild = 
function(child) {
	this._centerMiddleCell.appendChild(child.getHtmlElement());
	child.addListener(DwtEvent.ONMOUSEOVER, this._mouseOverListener);
	child.addListener(DwtEvent.ONMOUSEOUT, this._mouseOutListener);
};

DwtTabButton.prototype._mouseOverListener = 
function(ev) {
	if (this._mouseOutActionId != -1) {
		AjxTimedAction.cancelAction(this._mouseOutActionId);
		this._mouseOutActionId = -1;
	}
	if (this._isClosed)
		this.setTabImageState("TabHover");
};

DwtTabButton.prototype._mouseOutListener = 
function(ev) {
	if (AjxEnv.isIE) {
		this._mouseOutActionId = AjxTimedAction.scheduleAction(this._mouseOutAction, 1);
	} else {
		this._handleMouseOut();
	}
};

DwtTabButton.prototype._handleMouseOut = 
function() {
	this._mouseOutActionId = -1;
	if (this._isClosed)
		this.setTabImageState("Tab");
};

DwtTabButton.prototype.setTabImageState = 
function(imagePrefix) {
	AjxImg.setImage(this.leftTopImg, imagePrefix + "_TL", null, true);
	AjxImg.setImage(this.topImg, imagePrefix + "_T__H", AjxImg.HORIZ_BORDER, true);
	AjxImg.setImage(this.rightTopImg, imagePrefix + "_TR", null, true);

	AjxImg.setImage(this.leftImg, imagePrefix + "_L__V", AjxImg.VERT_BORDER, true);
	AjxImg.setImage(this._centerMiddleCell, imagePrefix + "__BG", AjxImg.BACKGROUND, true);
	AjxImg.setImage(this.rightImg, imagePrefix + "_R__V", AjxImg.VERT_BORDER, true);

	AjxImg.setImage(this.leftBottomImg, imagePrefix + "_BL", null, true);
	AjxImg.setImage(this.bottomImg, imagePrefix + "_B__H", AjxImg.HORIZ_BORDER, true);
	AjxImg.setImage(this.rightBottomImg, imagePrefix + "_BR", null, true);
};
