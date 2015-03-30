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
 * @class DwtSelect
 * @constructor
 * Widget to replace the native select element.
 *
 * Note: Currently this does not support multiple selection.
 * @param options (Array) optional array of options. This can be either
 *                        an array of DwtSelectOptions or an array of strings.
 */
function DwtSelect(parent, options, className, posStyle, width, height) {
    var clsName = className || "DwtSelect";
    var positionStyle = posStyle || Dwt.STATIC_STYLE;
    DwtButton.call(this, parent, null, clsName, positionStyle, DwtButton.ACTION_MOUSEDOWN);
	this._origClassName = this._className;
	this._activatedClassName = this._className + "-" + DwtCssStyle.ACTIVATED;
	this._triggeredClassName = this._className + "-" + DwtCssStyle.TRIGGERED;
	this._width = -1;

    // initialize some variables
    this._currentSelectionId = -1;
    this._options = new AjxVector();
    this._optionValuesToIndices = new Object();
    this._selectedValue = this._selectedOption = null;
    this._renderSelectBoxHtml(options);
	this.disabled = false;
	this._shouldToggleMenu = true;
}

DwtSelect.prototype = new DwtButton;
DwtSelect.prototype.constructor = DwtSelect;

DwtSelect.prototype.toString = 
function() {
    return "DwtSelect";
};

/**
 * This overrides the _createTable method in DwtLabel. 
 */
DwtSelect.prototype._createTable =
function() {
	this._table = document.createElement("table");
	this._table.id = Dwt.getNextId();
	this._row = this._table.insertRow(-1);
	this.getHtmlElement().appendChild(this._table);
	
	// Left is the default alignment. Note that if we do an explicit align left, Firefox freaks out
	if (this._style & DwtLabel.ALIGN_RIGHT) {
		this._table.align = "right";
	} else if (!(this._style & DwtLabel.ALIGN_LEFT)) {
		this._table.align = "center";
		this._table.width = "100%";
	}
};

// -----------------------------------------------------------
// static attributes
// -----------------------------------------------------------
/** This keeps track of all instances out there **/
DwtSelect._objectIds = [null];

// -----------------------------------------------------------
// instance tracking methods
// -----------------------------------------------------------
DwtSelect._assignId = 
function(anObject) {
    var myId = DwtSelect._objectIds.length;
    DwtSelect._objectIds[myId]= anObject;
    return myId;
};

DwtSelect._getObjectWithId = 
function(anId) {
    return DwtSelect._objectIds[anId];
};

DwtSelect._unassignId = 
function(anId) {
    DwtSelect._objectIds[anId] = null;
};

DwtSelect.getObjectFromElement = 
function(element) {
	return element && element.dwtObj 
		? AjxCore.objectWithId(element.dwtObj) : null
};

DwtSelect.prototype.dispose = 
function() {
	DwtControl.prototype.dispose.call(this);
	if (this._internalObjectId)
		DwtSelect._unassignId(this._internalObjectId);
};

// -----------------------------------------------------------
// overridden base class methods
// -----------------------------------------------------------
/**
 * Wanted to be able to calculate position relative to a containing
 * element, since the option display div is positioned relative to 
 * the this.getHtmlElement() div.
 */
DwtSelect.prototype.getBounds = 
function(anElement, containerElement) {
	anElement = anElement || this.getHtmlElement();
    var myBounds = new Object();
    myBounds.x = 0;
    myBounds.y = 0;
    myBounds.width = anElement.offsetWidth;
    myBounds.height = anElement.offsetHeight;
    
    if(containerElement == null) {
        containerElement = AjxEnv.isIE ? anElement.document.body : anElement.ownerDocument.body;
    }
    
    // account for the scrollbars if necessary
    var hasScroll = (anElement.scrollLeft !== void 0);
    var trace = anElement;

    while(trace != containerElement) {
        myBounds.x += trace.offsetLeft;
        myBounds.y += trace.offsetTop;
        
        var nextEl = trace.offsetParent;
        while (hasScroll && (trace != nextEl)) {
            myBounds.x -= trace.scrollLeft;
            myBounds.y -= trace.scrollTop;
            trace = AjxEnv.isIE ? nextEl : trace.parentNode;
        }
        trace = nextEl;
    }
    return myBounds;
};

// -----------------------------------------------------------
// rendering methods
// -----------------------------------------------------------
DwtSelect.prototype._renderSelectBoxHtml = 
function (options) {
    // setup our arrow button
	this.setDropDownImages(	"SelectPullDownArrow",				// normal
							"SelectPullDownArrowDis",			// disabled
							"SelectPullDownArrowHover",		// hover
						   	"SelectPullDownArrowSel"			// down
	);
	var menu = new DwtMenu(this, null, "DwtSelectMenu", null, true);
	this.setMenu(menu);
	menu.setAssociatedObj(this);
    // Add options, if present
    if (options) {
        for (var i = 0; i < options.length; ++i)
            this.addOption(options[i]);
    }
	var el = this.getHtmlElement();
	// Call down to DwtControl to setup the mouse handlers
	el._selectObjId = this.getUniqueIdentifier();
	this.setWidth();
};

// -----------------------------------------------------------
// public api methods
// -----------------------------------------------------------
/**
 * @param option (String or DwtSelectOption ) -- string for the option value
 *                                               or the option object.
 * @param selected (boolen) -- optional argument indicating whether
 *                             the newly added option should be
 *                             set as the selected option.
 * @param value (var) -- if the option parameter is a DwtSelectOption, this 
 *                       will override the value already set in the option.
 * @return integer -- A handle to the option added. The handle
 *                    can be used in other api methods.
 */
DwtSelect.prototype.addOption = 
function(option, selected, value) {
	var opt = null;
	var val = null;
	if (typeof(option) == 'string') {
		val = value != null ? value : option;
		opt = new DwtSelectOption(val, selected, option, this);
	} else {
		if (option instanceof DwtSelectOption) {
			opt = option;
			if (value)
				opt.setValue(value);
			selected = opt.isSelected();
		} else if(option instanceof DwtSelectOptionData) {
			val = value != null ? value : option.value;
			opt = new DwtSelectOption(val, option.isSelected, option.displayValue, this);
			selected = option.isSelected;
		} else {
			return -1;
		}
	}
	
	if (opt._optionWidth > this._width)
		this._width = opt._optionWidth;

	this._options.add(opt);

	if (this._options.size() == 1 || selected)
		this._setSelectedOption(opt);

	this._menu.__isDirty = true;

    // return the index of the option.
    this._optionValuesToIndices[opt.getValue()] = this._options.size() - 1;
	this.setWidth();

    return (this._options.size() - 1);
};

DwtSelect.prototype.clearOptions = 
function() {
	var opts = this._options.getArray();
	for (var i = 0; i < opts.length; ++i) {
		opts[i] = null;
	}
	this._options.removeAll();
	this._optionValuesToIndices = null;
	this._optionValuesToIndices = new Array();
	this._menu.removeChildren();
	this._menu.__isDirty = true;
	this._selectedValue = null;
	this._selectedOption = null;
	this._currentSelectionId = -1;
};

DwtSelect.prototype.setName = 
function(name) {
	this._name = name;
};

DwtSelect.prototype.getName = 
function() {
	return this._name;
};

DwtSelect.prototype.disable = 
function() {
	if (!this.disabled) {
		this.setEnabled(false);
		this._setDisabledStyle();
		this.setHandler(DwtEvent.ONSELECTSTART, this._disableSelectionIE);
		this.disabled = true;
	}
};

DwtSelect.prototype.enable = 
function() {
	if (this.disabled) {
		this.setEnabled(true);
		this._setEnabledStyle();
		this.clearHandler(DwtEvent.ONSELECTSTART);
		this.disabled = false;
	}
};

DwtSelect.prototype._disableSelectionIE = 
function() {
	return false;
};

DwtSelect.prototype._disableSelection = 
function() {
	var func = function() {
		window.getSelection().removeAllRanges();
	};
	window.setTimeout(func, 5);
};

DwtSelect.prototype.setSelectedValue = 
function(optionValue) {
    var index = this._optionValuesToIndices[optionValue];
    if ((index !== void 0) && (index !== null)) {
        this.setSelected(index);
    }
};

/**
 * Sets the option as the selected option.
 * @param optionHandle (integer) -- handle returned from addOption
 */
DwtSelect.prototype.setSelected = 
function(optionHandle) {
    var optionObj = this.getOptionWithHandle(optionHandle);
	this.setSelectedOption(optionObj);
};

DwtSelect.prototype.getOptionWithHandle = 
function(optionHandle) {
	return this._options.get(optionHandle);
};

DwtSelect.prototype.getIndexForValue = 
function(value) {
	return this._optionValuesToIndices[value];
};

DwtSelect.prototype.getOptionWithValue = 
function(optionValue) {
	var index = this._optionValuesToIndices[optionValue];
	var option = null;
    if ((index !== void 0) && ( index !== null)) {
        option = this.getOptionWithHandle(index);
    }
	return option;
};

DwtSelect.prototype.setSelectedOption = 
function(optionObj) {
	if (optionObj)
		this._setSelectedOption(optionObj);
};

DwtSelect.prototype.getValue = 
function() {
    return this._selectedValue;
};

DwtSelect.prototype.getSelectedOption = 
function() {
	return this._selectedOption;
};

DwtSelect.prototype.getSelectedIndex =
function() {
	return this.getIndexForValue(this.getValue());
};

DwtSelect.prototype.getWidth = 
function() {
	return DwtControl.prototype.getSize.call(this).x;
};

DwtSelect.prototype.setWidth = 
function() {
	if (this._lastSetWidth >= this._width) {
		this._width = this._lastSetWidth;
		return;
	}
	var el = this.getHtmlElement();
	// not sure why 29 was added; 18 = 16 (width of dropdown icon) + 2 (padding)
//	el.style.width = this._width + 29 + "px";
	el.style.width = this._width + 18 + "px";
	this._lastSetWidth = this._width;
};

DwtSelect.prototype.addChangeListener = 
function(listener) {
    this.addListener(DwtEvent.ONCHANGE, listener);
};


// -----------------------------------------------------------
// public interface for DwtSelectOption
// -----------------------------------------------------------

DwtSelect.prototype.getUniqueIdentifier = 
function() {
	return this._selectObjId;
};

DwtSelect.prototype.size = 
function() {
	return this._options.size();
}

// --------------------------------------------------------------------
// private methods
// --------------------------------------------------------------------

DwtSelect.prototype._toggleMenu = 
function(show) {
    // if an argument was not specified, do the opposite
	if (this._menu.__isDirty) {
		var optArr = this._options.getArray();
		for (var i = 0 ; i < optArr.length; ++i){
			var mi = new DwtMenuItem(this._menu, DwtMenuItem.SELECT_STYLE);
			var text = optArr[i].getDisplayValue();
			if (text) {
				mi.setText(text);
			}
			var image = optArr[i].getImage();
			if (image) {
				mi.setImage(image);
				// HACK to get image width
				optArr[i]._imageWidth = Dwt.getSize(AjxImg.getImageElement(mi._iconCell)).x;
			}
			mi.addSelectionListener(new AjxListener(this, this._handleOptionSelection));
			mi._optionIndex = i;
			optArr[i].setItem(mi);
		}
		this._menu.getHtmlElement().style.width = this.getHtmlElement().style.width;
		this._menu.__isDirty = false;
	}

	DwtButton.prototype._toggleMenu.call(this);
	if (this._selectedOption) {
		var selectedMenuItem = this._selectedOption.getItem();
		this._menu.setSelectedItem(selectedMenuItem._optionIndex);
	}

    return show;
};

DwtSelect.prototype._handleOptionSelection = 
function(ev) {
	var menuItem = ev.item;
	var optionIndex = menuItem._optionIndex;
	var opt = this._options.get(optionIndex);
	var oldValue = this.getValue();
	this._setSelectedOption(opt);

	// notify our listeners
    var args = new Object();
    args.selectObj = this;
    args.newValue = opt.getValue();
    args.oldValue = oldValue;
    var event = DwtUiEvent.getEvent(ev);
    event._args = args;
    this.notifyListeners(DwtEvent.ONCHANGE, event);
};

DwtSelect.prototype._clearOptionSelection = 
function() {
    if (this._currentSelectionId != -1) {
        var currOption = DwtSelect._getObjectWithId(this._currentSelectionId);
        currOption.deSelect();
    }
};

DwtSelect.prototype._setSelectedOption = 
function(option) {
	var displayValue = option.getDisplayValue();
	var image = option.getImage();
	if (this._selectedOption != option) {
		if (displayValue) {
			this.setText(displayValue);
		}
		if (image) {
			this.setImage(image);
		}
		this._selectedValue = option._value;
		this._selectedOption = option;
		this._menu._selectedOptionId = option.getIdentifier();
	}
    this._updateSelection(option);
};

DwtSelect.prototype._updateSelection = 
function(newOption) {
    var currOption = null;
    if (this._currentSelectionId != -1)
        currOption = DwtSelect._getObjectWithId(this._currentSelectionId);

    if (currOption)
        currOption.deSelect();

    if (newOption) {
		newOption.select();
		this._currentSelectionId = newOption.getIdentifier();
    }
};

DwtSelect.prototype._setDisabledStyle = 
function() {
	this.setClassName(this._className + " disabled");
};

DwtSelect.prototype._setEnabledStyle = 
function() {
	this.setClassName(this._origClassName);
};

/**
* Greg Solovyev 2/2/2004 added this class to be able to create a list of options 
* before creating the DwtSelect control. This is a workaround an IE bug, that 
* causes IE to crash with error R6025 when DwtSelectOption object are added to empty DwtSelect
* @class DwtSelectOptionData
* @constructor
*/
function DwtSelectOptionData (value, displayValue, isSelected) {
	if(value == null || displayValue==null) 
		return null;

	this.value = value;
	this.displayValue = displayValue;
	this.isSelected = isSelected;
}

/**
 * @class DwtSelectOption
 * @constructor
 *
 * DwtSelectOption encapsulates the option object that the DwtSelect widget
 * uses. 
 * The owner object that is passed into the constructor must implement the
 * following methods:
 *   getUniqueIdentifier()
 *   calcAndSetWidth(optionObject);
 *
 * @param value (string) -- this is the value for the object, it will be 
 *                          returned in any onchange event.
 * @param selected (Boolean) -- whether or not the option should be selected
 *                              to start with.
 * @param displayValue (string) -- The value that the user will see 
 *                                 ( html encoding will be done on this 
 *                                 value internally ).
 * @param owner (DwtSelect) -- implements the methods metioned above.
 * @param optionalDOMId (string) -- an optional id you want assigned to 
 *                                  the outer most underlying element.
 */
function DwtSelectOption(value, selected, displayValue, owner, optionalDOMId, image) {
	this._value = value;
	this._selected = selected;
	this._displayValue = displayValue;
	this._image = image;
	
	this._internalObjectId = DwtSelect._assignId(this);
	this._optionWidth = this._calculateWidth();
}

DwtSelectOption.prototype._calculateWidth = 
function() {
	var textWidth = 0;
	if (this._displayValue) {
		var size = Dwt.getHtmlExtent(AjxStringUtil.htmlEncode(this._displayValue));
		textWidth = size.x;
	}
	// HACK - assume it's a 16 x 16 icon if we don't have width yet
	var imageWidth = this._imageWidth ? this._imageWidth : 16;
	
	return textWidth + imageWidth;
};

DwtSelectOption.prototype.setItem = 
function(menuItem) {
	this._menuItem = menuItem;
};

DwtSelectOption.prototype.getItem = 
function(menuItem) {
	return this._menuItem;
};

DwtSelectOption.prototype.getDisplayValue = 
function() {
	return this._displayValue;
};

DwtSelectOption.prototype.getImage = 
function() {
	return this._image;
};

DwtSelectOption.prototype.getValue = 
function() {
	return this._value;
};

DwtSelectOption.prototype.setValue = 
function(stringOrNumber) {
	this._value = stringOrNumber;
};

DwtSelectOption.prototype.select = 
function() {
	this._selected = true;
};

DwtSelectOption.prototype.deSelect = 
function() {
	this._selected = false;
};

DwtSelectOption.prototype.isSelected = 
function() {
	return this._selected;
};

DwtSelectOption.prototype.getIdentifier = 
function() {
	return this._internalObjectId;
};

DwtSelect.prototype._popupMenu =
function() {
	var menu = this.getMenu();
	var p = menu.parent;
	var pb = p.getBounds();
	var ws = menu.shell.getSize();
	var s = menu.getSize();
	var x;
	var y;
	var vBorder;
	var hBorder;
	var pHtmlElement = p.getHtmlElement();
	// since buttons are often absolutely positioned, and menus aren't, we need x,y relative to window
	var ptw = Dwt.toWindow(pHtmlElement, 0, 0);
	vBorder = (pHtmlElement.style.borderLeftWidth == "") ? 0 : parseInt(pHtmlElement.style.borderLeftWidth);
	x = pb.x + vBorder;
	hBorder = (pHtmlElement.style.borderTopWidth == "") ? 0 : parseInt(pHtmlElement.style.borderTopWidth);
	hBorder += (pHtmlElement.style.borderBottomWidth == "") ? 0 : parseInt(pHtmlElement.style.borderBottonWidth);
	y = pb.y + pb.height + hBorder;
	x = ((x + s.x) >= (ws.x - 5 )) ? x - (x + s.x - ws.x): x;
	if ( (y + s.y) >= (ws.y - 5 )) {
		var myEl = menu.getHtmlElement();
		myEl.style.height = ws.y - y - 30;
		myEl.style.overflow = "auto";
	}
	//y = ((y + s.y) >= (ws.y - 30 )) ? y - (y + s.y - ws.y) : y;

	//this.setLocation(x, y);
	menu.popup(0, x, y);
};
