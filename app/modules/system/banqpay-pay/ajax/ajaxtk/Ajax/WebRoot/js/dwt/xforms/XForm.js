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
* @constructor
* @class
* @param attributes
* @param model {XModel} {@link XModel}
* @param instance {Object} data instance
* @param dwtContainer - instance of {@link DwtComposite}
**/
function XForm(attributes, model, instance, dwtContainer) {
	if (attributes) {
		for (var prop in attributes) {
			this[prop] = attributes[prop];	
		}
	}

	// get a unique id for this form
	this.assignGlobalId(this, this.id || "_XForm");
	DwtComposite.call(this, dwtContainer, "DWTXForm");
	
	if (this.itemDefaults) {
		XFormItemFactory.initItemDefaults(this, this.itemDefaults);
	}

	// if they didn't pass in a model, make an empty one now
	if (model) {
		this.setModel(model);
	} else {
		this.xmodel = new XModel();
	}
	if (instance) this.setInstance(instance);

	this.__idIndex = {};
	this.__externalIdIndex = {};
	this.__itemsAreInitialized = false;
}
XForm.prototype = new DwtComposite;
XForm.prototype.constructor = XForm;

XForm.toString = function() {	return "[Class XForm]";	}
XForm.prototype.toString = function() {	return "[XForm " + this.__id + "]";	}
XForm.prototype.getId = function () {	return this.__id;	}

/**
* A global handler for setTimeout/clearTimeout. This handler is used by onKeyPress event of all input fields.
**/
XForm.keyPressDelayHdlr = null;


/**
* FORM DEFAULTS
**/
XForm.prototype.numCols = 2;
XForm.prototype.defaultItemType = "output";
XForm.prototype._isDirty = false;
XForm._showBorder = false;		// if true, we write a border around form cells for debugging

//
//	FORM CONSTANTS
//

// generic script constants
var _IGNORE_CACHE_ = "IGNORE_CACHE";
var _UNDEFINED_;

var _UNDEFINED_;
var _ALL_ = "all";

// possible values for "labelDirection", "align" and "valign"
var _NONE_ = "none";
var _LEFT_ = "left";
var _TOP_ = "top";
var _RIGHT_ = "right";
var _BOTTOM_ = "bottom";
var _CENTER_ = "center";
var _MIDDLE_ = "middle";
var _INLINE_ = "inline";


// values for "relevantBehavior"
var _HIDE_ = "hide";
var _BLOCK_HIDE_ = "block_hide";
var _DISABLE_ = "disable";
var _SHOW_DISABLED_ = "show_disabled";
var _PARENT_ = "parent"; // used in error location as well

// values for "errorLocation"
var _SELF_ = "self";
// var _INHERIT_ = "inherit" -- this is defined in XModel.js

// values for "selection"
var _OPEN_ = "open";
var _CLOSED_ = "closed";

// possible values for "overflow"
var _HIDDEN_ = "hidden";
var _SCROLL_ = "scroll";
var _AUTO_ = "auto";
var _VISIBLE_ = "visible";

/**
* update the form with new values
*  NOTE: this will be done automatically if you do a {@link #setInstance}
**/
XForm.prototype.refresh = function () {
	// EMC 07/31/2005 -- I don't think we want to clear errors on every refresh
	// since this is called from itemChanged.
	//this.clearErrors();
	this.updateScript();
}


// NOTE: THE FOLLOWING CODE SHOULD BE CONVERTED TO DWT 

XForm.prototype.getGlobalRefString = function() {
	return "XFG.cacheGet('" + this.__id + "')";
}

XForm.prototype.assignGlobalId = function (object, prefix) {
	return XFG.assignUniqueId(object, prefix);
}
XForm.prototype.getUniqueId = function (prefix) {
	return XFG.getUniqueId(prefix);
}

XForm.prototype.getElement = function (id) {
	if (id == null) id = this.getId();
	var el = XFG.getEl(id);
	if (el == null) DBG.println(AjxDebug.DBG2, "getElement(",id,"): no element found");
	return el;
}

XForm.prototype.showElement = function (id) {
	if (id == null) id = this.getId();
	return XFG.showEl(id);
}
XForm.prototype.hideElement = function (id,isBlock) {
	if (id == null) id = this.getId();
	return XFG.hideEl(id,isBlock);
}

XForm.prototype.createElement = function (id, parentEl, tagName, contents) {
	if (id == null) id = this.getId();
	return XFG.createEl(id, parentEl, tagName, contents);
}

// NOTE: END DWT CONVERSION NEEDED 

XForm.prototype.focusElement = function (id) {
	var el = this.getElement(id);
	// if this is a div we will have problems.
	if (el != null) {
		var tagName = el.tagName;
		if (tagName != "DIV" && tagName != "TD" && tagName != "TABLE") {
			el.focus();		//MOW: el.select() ????
			this.onFocus(id);
		}
	}
};

XForm.prototype.focusNext = function(id) {
	if(this.tabIdOrder && this.tabIdOrder.length > 0) {
		var cnt = this.tabIdOrder.length;
		if (id == null) {
			this.focusElement(this.tabIdOrder[0]);
		} else {
			for (var i = 0; i < cnt; i++) {
				if(this.tabIdOrder[i] == id) {
					if(this.tabIdOrder[i+1]) {
						this.focusElement(this.tabIdOrder[i+1]);
					} else {
						this.focusElement(this.tabIdOrder[0]);
					}
					break;
				}
			}
		}		
	}
};


XForm.prototype.getModel = function () {
	return this.xmodel;
}
XForm.prototype.setModel = function (model) {
	this.xmodel = model;
}



XForm.prototype.getInstance = function () {
	return this.instance;
}
XForm.prototype.setInstance = function(instance) {
	this.setIsDirty(false);
	this.clearErrors();
	this.instance = instance;
	if (this.__drawn) {
		this.refresh();
	}
}


XForm.prototype.getController = function () {
	return this.controller;
}
XForm.prototype.setController = function(controller) {
	this.controller = controller;
}




XForm.prototype.getIsDirty = function () {
	return this._isDirty;
}
XForm.prototype.setIsDirty = function(dirty, item) {
	this._isDirty = (dirty == true);
	//pass the current dirty XFORM item, so the event object can has the information which item is changed
	if (typeof item == "undefined") item = null ; //to make it compatible with the previous version. 
	this.notifyListeners(DwtEvent.XFORMS_FORM_DIRTY_CHANGE, new DwtXFormsEvent(this, item, this._isDirty));
}






XForm.prototype.initializeItems = function() {
	// tell the model to initialize all its items first
	//	(its smart enough to only do this once)
	this.xmodel.initializeItems();

	if (this.__itemsAreInitialized) return;
	
	// create a group for the outside parameters and initialize that
	// XXX SKIP THIS IF THERE IS ONLY ONE ITEM AND IT IS ALREADY A GROUP, SWITCH OR REPEAT???
	var outerGroup = {
		id:"__outer_group__",
		type:_GROUP_,
		useParentTable:false,

		numCols:this.numCols,
		colSizes:this.colSizes,
		items:this.items,
		tableCssClass:this.tableCssClass,
		tableCssStyle:this.tableCssStyle
	}
	this.items = this.initItemList([outerGroup]);
	
	// we wait to initialize items until the form is drawn, for speed

	this.__itemsAreInitialized = false;
}


XForm.prototype.initItemList = function(itemAttrs, parentItem) {
	var items = [];
	for (var i = 0; i < itemAttrs.length; i++) {
		var attr = itemAttrs[i];
		if (attr != null) {
			items.push(this.initItem(attr, parentItem));
		}
	}
	this.__nestedItemCount += itemAttrs.length;		//DEBUG
	return items;
}


XForm.prototype.initItem = function(itemAttr, parentItem) {
	// if we already have a form item, assume it's been initialized already!
	if (itemAttr._isXFormItem) return itemAttr;
	
	// create the XFormItem subclass from the item attributes passed in
	//	(also links to the model)
	var item = XFormItemFactory.createItem(itemAttr, parentItem, this);
	
	// have the item initialize it's sub-items, if necessary (may be recursive)
	item.initializeItems();
	return item;
}


// add an item to our index, so we can find it easily later
XForm.prototype.indexItem = function(item, id) {
	//DBG.println("id: "+id);
	this.__idIndex[id] = item;
	
	// Add the item to an existing array, or
	var exId = item.getExternalId();
	if (exId == null || exId == "") return;

	var arr = this.__externalIdIndex[exId];
	if (arr != null) {
		arr.push(item);
	} else {
		arr = [item];
	}
	this.__externalIdIndex[exId] = arr;
}


// refPath is ignored
// This is probably not useful to an Xforms client --
// use getItemsById instead.
XForm.prototype.getItemById = function(id) {
	if (id._isXFormItem) return id;
	return this.__idIndex[id];
}

// This is a method that can be called by an XForms client, but
// which doesn't have much internal use.
// gets an item by the id or the ref provided in the declaration
// This method returns an array, or null;
XForm.prototype.getItemsById = function (id) {
	return this.__externalIdIndex[id];
};

XForm.prototype.get = function(path) {
	if (path == null) return null;
	if (path._isXFormItem) path = path.getRefPath();
	return this.xmodel.getInstanceValue(this.instance, path);
}


XForm.prototype.isDrawn = function () {
	return (this.__drawn == true);
}

/**
 * EMC 7/12/2005: I didn't want the extra div that DwtControl writes,
 * since the xforms engine already has an outer div that we can use as 
 * container.
 */
XForm.prototype._replaceDwtContainer = function () {
	var myDiv = document.getElementById(this.__id);
	var dwtContainer = this.getHtmlElement();
	if (dwtContainer.parentNode) dwtContainer.parentNode.replaceChild(myDiv, dwtContainer);
	this._htmlElId = this.__id;
};

/**
* actually draw the form in the parentElement
* @param parentElement
* calls outputForm to generate all the form's HTML
**/
XForm.prototype.draw = function (parentElement) {
	this.initializeItems();
	
	// get the HTML output
	var formOutput = this.outputForm();
	
	if (parentElement == null) parentElement = this.getHtmlElement();
	// if a parentElement was passed, stick the HTML in there and call the scripts
	//	if not, you'll have call put HTML somewhere and call the scripts yourself
	if (parentElement) {
		parentElement.innerHTML = formOutput;

		this._replaceDwtContainer();
		if (this.instance != null) {
			// run the updateScript
			this.refresh();
//			setTimeout(this.getGlobalRef()+ ".refresh()", 1000);
		}
	}
	
	// notify any listeners that we're "ready"
	this.notifyListeners(DwtEvent.XFORMS_READY, new DwtXFormsEvent(this));
	
	// remember that we've been drawn
	this.__drawn = true;
	// and we're done!
}


XForm.prototype.getItems = function () {
	return this.items;
}

/**
* Prints out the form HTML
* calls outputItemList
**/
XForm.prototype.outputForm = function () {
	var t0 = new Date().getTime();
	
	var html = new AjxBuffer();			// holds the HTML output
	var items = this.getItems();
	var indent = "";
	
	html.append('<div id="', this.__id,'"',
				(this.cssClass != null && this.cssClass != '' ? ' class="' + this.cssClass + '"' : ""),
				(this.cssStyle != null && this.cssStyle != '' ? ' style="' + this.cssStyle + ';"' : ""),
				'>\r'
				);
	
	this._itemsToInsert = {};
	this._itemsToCleanup = [];

	var updateScript = new AjxBuffer();		// holds the script to populate values and show/hide elements based on relevant attibute
	
	DBG.timePt("starting outputItemList");
	// in initializeItems(), we guaranteed that there was a single outer item
	//	and that it is a group that sets certain properties that can be set at
	//	the form level.  Just output that (and it will output all children)

	// output the actual items of the form
	this.outputItemList(items[0].items, items[0], html, updateScript, indent, this.numCols);
	DBG.timePt("finished outputItemList");
	this.makeUpdateScript(updateScript);
	DBG.timePt("finished makeUpdateScript");
	html.append("\r</div id=\"", this.__id,"\">");

	// save the HTML in this.__html (for debugging and such)
	this.__HTMLOutput = html.toString();

	//DBG.println("outputForm() took " + (new Date().getTime() - t0) + " msec");

	return this.__HTMLOutput;
}

XForm.prototype.getOutstandingRowSpanCols = function (parentItem) {
	if (parentItem == null) return 0;
	var outstandingRowSpanCols = 0;
	var previousRowSpans = parentItem.__rowSpanItems;
	if (previousRowSpans) {
/*
		for (var i = 0; i < previousRowSpans.length; i++) {
			var previousItem = previousRowSpans[i];
			//DBG.println("outputing ", previousItem.__numDrawnCols," rowSpan columns for ", previousItem);
			outstandingRowSpanCols += previousItem.__numDrawnCols;

			previousItem.__numOutstandingRows -= 1;
			if ( previousItem.__numOutstandingRows == 0) {
				if (previousRowSpans.length == 1) {
					delete parentItem.__rowSpanItems;
				} else {
					parentItem.__rowSpanItems = [].concat(previousRowSpans.slice(0,i), previousRowSpans.slice(i+1));
				}
			}
		}
*/
		for (var i = previousRowSpans.length-1; i >= 0; i--) {
			var previousItem = previousRowSpans[i];
			//DBG.println("outputing ", previousItem.__numDrawnCols," rowSpan columns for ", previousItem);
			previousItem.__numOutstandingRows -= 1;
			if ( previousItem.__numOutstandingRows == 0) {
				if (previousRowSpans.length == 1) {
					delete parentItem.__rowSpanItems;
				} else {
					parentItem.__rowSpanItems.pop();
				}
			} else {
				outstandingRowSpanCols += previousItem.__numDrawnCols;			
			}
		}

	}
	return outstandingRowSpanCols;
}

/**
* This method will iterate through all the items (XFormItem) in the form and call outputMethod on each of them.
* @param items
* @param parentItem
* @param html
* @param updateScript
* @param indent
* @param numCols
* @param currentCol
* @param skipTable
**/
XForm.prototype.outputItemList = function (items, parentItem, html, updateScript, indent, numCols, currentCol, skipTable) {
	if (parentItem.outputHTMLStart) {
		parentItem.outputHTMLStart(html, updateScript, indent, currentCol);
	}
	var drawTable = (parentItem.getUseParentTable() == false && skipTable != true);
	if (drawTable) {
		var colSizes = parentItem.getColSizes();
		//XXX MOW: appending an elementDiv around the container if we need to style it
		var outerStyle = parentItem.getCssString();
		if (outerStyle != null && outerStyle != "") {
			parentItem.outputElementDivStart(html, updateScript, indent);
		}
		html.append(indent, "<table cellspacing=0 cellpadding=0 ", 
				(XForm._showBorder ? "border=1" : "border=0"),
				" id=\"", parentItem.getId(),"_table\" ", parentItem.getTableCssString(),">\r");
		if (colSizes != null) {
			html.append(indent, " <colgroup>\r");
			for (var i = 0; i < colSizes.length; i++) {
				var size = colSizes[i];
				if (size < 1) size = size * 100 + "%";
				html.append(indent, "<col width=", size, ">\r");
			}
			html.append(indent, "</colgroup>\r");
		}
		html.append(indent, "<tbody>\r");
	}

	numCols = Math.max(1, numCols);
	if (currentCol == null) currentCol = 0;
	//DBG.println("outputItemList: numCols:",numCols, " currentCol:", currentCol);


	for (var itemNum = 0; itemNum < items.length; itemNum++) {
		var item = items[itemNum];
		var isNestingItem = (item.getItems() != null);
		var itemUsesParentTable = (item.getUseParentTable() != false);
		
		item.__numDrawnCols = 0;

		// write the beginning of the update script
		//	(one of the routines below may want to modify it)
		item.outputUpdateScriptStart(html, updateScript, indent);

		var label = item.getLabel();
		var labelLocation = item.getLabelLocation();
		var showLabel = (label != null && (labelLocation == _LEFT_ || labelLocation == _RIGHT_));

		var colSpan = item.getColSpan();
		if (colSpan == "*") colSpan = Math.max(1, (numCols - currentCol));
		var rowSpan = item.getRowSpan();

		var totalItemCols = item.__numDrawnCols = parseInt(colSpan) + (showLabel ? 1 : 0);
		if (rowSpan > 1 && parentItem) {
			if (parentItem.__rowSpanItems == null) parentItem.__rowSpanItems  = [];
			parentItem.__rowSpanItems.push(item);
			item.__numOutstandingRows = rowSpan;
		}
		//DBG.println("rowSpan = " + rowSpan);
		if(currentCol==0)
			html.append(indent, "<tr>\r");
		
		// write the label to the left if desired
		if (label != null && labelLocation == _LEFT_) {
			//DBG.println("writing label");
			item.outputLabelCellHTML(html, updateScript, indent, rowSpan, labelLocation);
		}

		var writeElementDiv = item.getWriteElementDiv();
		var outputMethod = item.getOutputHTMLMethod();
		if (isNestingItem && itemUsesParentTable) {
			// actually write out the item
			if (outputMethod) outputMethod.call(item, html, updateScript, indent, currentCol);

		} else {

			// write the cell that contains the item 
			//	NOTE: this is currently also the container!
			item.outputContainerTDStartHTML(html, updateScript, indent, colSpan, rowSpan);
	
			// begin the element div, if required
			if (writeElementDiv) 	item.outputElementDivStart(html, updateScript, indent);
			
			// actually write out the item
			if (outputMethod) outputMethod.call(item, html, updateScript, indent, 0);

	
			// end the element div, if required
			if (writeElementDiv) 	item.outputElementDivEnd(html, updateScript, indent);
			
	
			// end the cell that contains the item
			item.outputContainerTDEndHTML(html, updateScript, indent);

		}

		currentCol += totalItemCols;

		// write the label to the right, if desired
		if (label != null && labelLocation == _RIGHT_) {
			//DBG.println("writing label");
			item.outputLabelCellHTML(html, updateScript, indent, rowSpan);
		}
		
		// now end the update script if necessary
		item.outputUpdateScriptEnd(html, updateScript, indent);

		if ( currentCol >= numCols) {
			html.append(indent, "</tr>\r");
			currentCol = this.getOutstandingRowSpanCols(parentItem);
			//DBG.println("creating new row:  currentCol is now ", currentCol, (currentCol > 0 ? " due to outstanding rowSpans" : ""));
		}

		// if the number of outstanding rows is the same as the number of columns we're to generate
		//	output an empty row for each
		while (currentCol >= numCols) {
			//DBG.println("outputting empty row because outstandingRowSpanCols >= numCols");
			html.append("</tr id='numCols'>");//\r<tr  id='numCols'>");
			currentCol = this.getOutstandingRowSpanCols(parentItem);
		}
	}
	
	
	if (drawTable) {
		html.append("\r", indent, indent,"</tbody></table>\r");
		if (outerStyle != null) {
			parentItem.outputElementDivEnd(html, updateScript, indent);
		}
	}

	if (parentItem.outputHTMLEnd) {
		parentItem.outputHTMLEnd(html, updateScript, indent, currentCol);
	}

}






//
//	NOTE: properties of individual items moved to XForm_item_properties.js
//


// CHANGE HANDLING


XForm.prototype.onFocus = function(id) {
	this.__focusObject = id;
}

XForm.prototype.onBlur = function(id) {
	this.__focusObject = null;
}

XForm.prototype.itemChanged = function (id, value, event) {
	var item = this.getItemById(id);
	if (item == null) return alert("Couldn't get item for " + id);	// EXCEPTION
	
	// tell the item that it's display is dirty so it might have to update
	item.dirtyDisplay();

	// validate value
	var modelItem = item.getModelItem();
	if (modelItem != null) {
		try {
			value = modelItem.validate(value, this, item, this.getInstance());
			item.clearError();
		}
		catch (message) {
			item.setError(message);
			var event = new DwtXFormsEvent(this, item, value);
			this.notifyListeners(DwtEvent.XFORMS_VALUE_ERROR, event);
			return;
		}
	}

	// if there is an onChange handler, call that
	var onChangeMethod = item.getOnChangeMethod();

	if (typeof onChangeMethod == "function") {
//		DBG.println("itemChanged(", item.ref, ").onChange = ", onChangeMethod);
		value = onChangeMethod.call(item, value, event, this);
	} else {
		item.setInstanceValue(value);
	}
	
	var event = new DwtXFormsEvent(this, item, value);
	this.notifyListeners(DwtEvent.XFORMS_VALUE_CHANGED, event);

	this.setIsDirty(true, item);
	this.refresh();
}


XForm.prototype.getItemsInErrorState = function () {
	if (this.__itemsInErrorState == null) {
		this.__itemsInErrorState = new Object();
		this.__itemsInErrorState.size = 0;
	}
	return this.__itemsInErrorState;
};

XForm.prototype.addErrorItem = function ( item ) {
	var errs = this.getItemsInErrorState();
	var oldItem = 	errs[item.getId()];
	errs[item.getId()] = item;
	if (oldItem == null){
		errs.size++;
	}
};

XForm.prototype.removeErrorItem = function ( item ) {
	if (item != null) {
		var errs = this.getItemsInErrorState();
		var id = item.getId();
		var oldItem = errs[id];
		if (oldItem != null) {
			delete errs[id];
			errs.size--;
		}
	}
};

XForm.prototype.hasErrors = function () {
	var errs = this.getItemsInErrorState();
	return (errs != null && errs.size > 0);
};

XForm.prototype.clearErrors = function () {
	var errs = this.getItemsInErrorState();
	if (errs.size > 0) {
		var k;
		for (k in errs) {
			if (k == 'size') continue;
			errs[k].clearError();
			delete errs[k];
		}
		errs.size = 0;
	}
}

XForm.prototype.onCloseForm = function () {
	if (this.__focusObject != null) {
		var item = this.getItemById(this.__focusObject);
		var element = item.getElement();

//alert("onCloseForm() not implemented");
//		this.itemChanged(this.__focusObject, VALUE???)
		if (element && element.blur) {
			element.blur();
		}
		this.__focusObject = null;
	}
}




//
//	SCRIPTS:
//		* updateScript -- sets values of items in the HTML representation 
//	-- CALLED REPEATEDLY: ON INITIAL DISPLAY AND EVERY TIME AN ITEM CHANGES



XForm.prototype.makeUpdateScript = function (script) {
	if (typeof script != "string") script = script.toString();
	this.__updateScript = script;
	this.updateScript = new Function(
			(this.updateScriptStart != null ? this.updateScriptStart + ";" : '')
			+ this.getUpdateScriptStart() 
			+ script 
			+ this.getUpdateScriptEnd()
			+ (this.updateScriptEnd  != null ?  this.updateScriptEnd + ";" : '')
		);
}


XForm.prototype.appendToUpdateScript = function (script) {
	if (typeof script != "string") script = script.toString();
	this.makeUpdateScript(this.__updateScript + script);
}






//
//	Writing parts of the update script
//

XForm.prototype.getUpdateScriptStart = function () {
	return AjxBuffer.concat(	
			"var t0 = new Date().getTime();\r",
			
			"var updateScript;\r",
			"var _____________________________________________________ = 0;\r",
			"var form = this;\r",
			"var model = this.xmodel;\r",
			"var instance = this.instance;\r",
			"var item, itemId, element, relevant, value, temp;\r",
			"this.tabIdOrder = new Array();\r",
			"with (this) {"
	);
}


XForm.prototype.getUpdateScriptEnd = function () {
	return AjxBuffer.concat(	
			"_____________________________________________________++;\r",
			"}\r",	// end with (this)
			"var event = new DwtXFormsEvent(form);\r",
			"this.notifyListeners(DwtEvent.XFORMS_DISPLAY_UPDATED, event);\r",

			"var t1 = new Date().getTime();\r",
			"DBG.println('update script took ' + (t1 - t0) + ' msec.');\r"
	);
}




/** @private */
XForm.prototype._reparentDwtObject = function (dwtObj, newParent) {
	var dwtE = dwtObj.getHtmlElement();
	if (dwtE.parentNode) dwtE.parentNode.removeChild(dwtE);
	newParent.appendChild(dwtE);
}





//
//	INSERTING
//



XForm.prototype.shouldInsertItem = function (item) {
	return (this._itemsToInsert[item.getId()] != null)
}

XForm.prototype.insertExternalWidget = function (item) {
	DBG.println("insertExternalWidget(): inserting ref=", item.ref,
				 "  type=", item.type, " id=", item.getId()
	);
			 
	var insertMethod = item.getInsertMethod();

	var widget = item.getWidget();
	if (widget && widget.insertIntoXForm instanceof Function) {
		widget.insertIntoXForm(this, item, item.getElement());
		
	} else if (typeof this[insertMethod] == "function") {
		this[insertMethod](item, item.getElement());
		
	} else {
		DBG.println("insertExternalWidget(): don't know how to insert item ", item.ref,
			 "  type=", item.type);
	}

	// take the item out of the list to insert so we don't insert it more than once
	delete this._itemsToInsert[item.getId()];
}

