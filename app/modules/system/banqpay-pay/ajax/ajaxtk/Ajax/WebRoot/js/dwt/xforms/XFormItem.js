/*
 * Copyright (C) 2006, The Apache Software Foundation.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


//
//	Factory to create XFormItems from simple attributes (eg: from JS object literals or XML)
//

/** This object is never instantiated. */
function XFormItemFactory() {}

/**
 * Creates a form item.
 *
 * @param attributes An object whose properties map to component attribute
 *                   name/value pairs.
 * @param parentItem The parent item of this item.
 * @param xform      The form to which this item is being created.
 */
XFormItemFactory.createItem = function (attributes, parentItem, xform) {
	// assign a modelItem to the item
	var refPath = this.getRefPath(attributes, parentItem);

	var modelItem;
	if (refPath != null) {
		// assign a modelItem to the item
		modelItem = this.getModelItem(xform.xmodel, attributes, refPath);
	}
			
	// get the class for that type and create one
	var type = this.getItemType(attributes, modelItem);
	var constructor = this.getItemTypeConstructor(type, xform);

	var item = new constructor();
	item._setAttributes(attributes);

	// get a unique id for the item
	var idPrefix = (	attributes.id ? xform.getId() + "_" + attributes.id :
							  refPath ? xform.getId() + "_" + refPath :
					item.__parentItem ? item.__parentItem.getId() :
										xform.getId() + "_" + item.type
					);
	// assign a unique id to each item
	//	(if the item specifies an id, we use a variant of that, just in case there's more than one)
	item.id = xform.getUniqueId(idPrefix);

	item.refPath = refPath;
	item.__modelItem = modelItem;
	item.__xform = xform;
	item.__parentItem = parentItem;
	
	// assign the item into our form's index so we can be found later
	xform.indexItem(item, item.id);

	// tell the item to initialize any special properties it needs to on construction
	item.initFormItem();
	
	return item;
} 

XFormItemFactory.getRefPath = function (attributes, parentItem) {
	if (attributes.refPath) return attributes.refPath;
	
	var ref = attributes.ref;
	if (ref == null) return null;
	
	if (parentItem) {
		var parentPath = parentItem.getRefPath();
		if (parentPath == null) parentPath = "";
	} else {
		var parentPath = "";
	}
	
	var path = ref;
	if (ref == ".") {
		path = parentPath;

	} else if (ref == "..") {
		parentPath = parentPath.split("/");
		path = parentPath.slice(0, parentPath.length - 1).join("/");

	} else if (parentPath == "") {
		path = ref;

	} else {
		path = parentPath + "/" + ref;
	}
	return path;
}

XFormItemFactory.getModelItem = function (xmodel, attributes, refPath) {
	if (refPath == null || refPath == "") return null;
	return xmodel.getItem(refPath, true);
}

XFormItemFactory.getItemType = function (attributes, modelItem) {
	var type = attributes.type;

	if (type == null) {
		type = attributes.type = _OUTPUT_;
	}
	
	var modelType = (modelItem && modelItem.type ? modelItem.type : _STRING_);

	if (type == _INPUT_) {
		if (attributes.value !== _UNDEFINED_) {
			type = _CHECKBOX_;
		} else {
			switch (modelType) {
				case _STRING_:
				case _NUMBER_:
					type = _INPUT_;
					break;

				case _DATE_:
				case _DATETIME_:
				case _TIME_:
					type = modelType;			
					break;

				default:
					type = _INPUT_;
			}
		}
	} else if (type == _SELECT_) {
		var appearance = attributes.appearance;
		if (appearance == _RADIO_) {
			type = _RADIO_;
		} else {
			type = _SELECT_;
		}
	}
	return type;
}

XFormItemFactory.typeConstructorMap = {};

XFormItemFactory.createItemType = 
function (typeConstant, typeName, constructor, superClassConstructor) {
	if (constructor == null) constructor = new Function();
	if (typeof superClassConstructor == "string") superClassConstructor = this.getItemTypeConstructor(superClassConstructor);
	if (superClassConstructor == null) superClassConstructor = XFormItem;

	// initialize the constructor
	constructor.prototype = new superClassConstructor();	

	constructor.prototype.type = typeName;
	constructor.prototype.constructor = constructor;
	constructor.prototype.toString = new Function("return '[XFormItem:" + typeName + " ' + this.getId() + ']'");
	constructor.toString = new Function("return '[Class XFormItem:" + typeName + "]'");
	
	// put the item type into the typemap
	this.registerItemType(typeConstant, typeName, constructor);
	
	// return the prototype
	return constructor;
}

XFormItemFactory.registerItemType = 
function(typeConstant, typeName, constructor) {
	// assign the type constant to the window so everyone else can use it
	window[typeConstant] = typeName;
	this.typeConstructorMap[typeName] = constructor;	
}

XFormItemFactory.defaultItemType = "output";
XFormItemFactory.getItemTypeConstructor = 
function (typeName, form) {
	var typeConstructorMap = (form && form.typeConstructorMap ? form.typeConstructorMap : this.typeConstructorMap);
	
	var typeConstructor = typeConstructorMap[typeName];
	if (typeConstructor == null) {
		var defaultItemType = (form ? form.defaultItemType : this.defaultItemType);
		typeConstructorMap[defaultItemType];
	}
	return typeConstructor;
}

XFormItemFactory.quickClone = 
function(object) {
	this.cloner.prototype = object;
	return new this.cloner();
}
XFormItemFactory.cloner = function(){}

XFormItemFactory.initItemDefaults = function(form, itemDefaults) {
	// create a clone of the XFormItemFactory typeConstructorMap for the form
	form.typeConstructorMap =  this.quickClone(this.typeConstructorMap);

	if (itemDefaults == null) itemDefaults = form.itemDefaults;
	if (itemDefaults != null) {
		// for each type in itemDefaults
		for (var type in itemDefaults) {
			var originalConstructor = this.typeConstructorMap[type];
			var defaults = itemDefaults[type];

			if (originalConstructor == null) {
				type = window[type];
				originalConstructor = this.typeConstructorMap[type];
			}
			if (originalConstructor == null) {
				continue;
			}
			var newConstructor = form.typeConstructorMap[type] = new Function();
			newConstructor.prototype = new originalConstructor();
			// NOTE: reassigning the constructor here is technically correct,
			//		but will result in (item.constructor == originalClass.constructor) not working...
			newConstructor.prototype.constructor = newConstructor;
			
			for (var prop in defaults) {
				newConstructor.prototype[prop] = defaults[prop];
			}
		}
	}
}




//
//	Abstract Class XFormItem
//
//	All other form item classes inherit from this.
//




function XFormItem() {}
XFormItem.prototype.constructor = XFormItem;
XFormItemFactory.registerItemType("_FORM_ITEM_", "form_item", XFormItem);

XFormItem.ERROR_STATE_ERROR = 0;
XFormItem.ERROR_STATE_VALID = 1;


//
// set base class defaults
// 

XFormItem.prototype._isXFormItem = true;

// outputting and inserting
XFormItem.prototype.writeElementDiv = false;

// appearance
XFormItem.prototype.labelLocation = _LEFT_;
XFormItem.prototype.tableCssClass = "xform_table";				// table that encloses one or more cells
XFormItem.prototype.tableCssStyle = null;						// table that encloses one or more cells
XFormItem.prototype.containerCssClass =  "xform_container";		// td that contains the element
XFormItem.prototype.containerCssStyle =  null;					// td that contains the element
XFormItem.prototype.cssClass = null;							// element itself (or element div)
XFormItem.prototype.labelCssClass =  "xform_label";				// label td
XFormItem.prototype.errorCssClass =  "xform_error";				// error DIV
XFormItem.prototype.nowrap = false; 
XFormItem.prototype.labelWrap = false; 
XFormItem.prototype.align = _UNDEFINED_;						// _UNDEFINED_ because it's a bit faster to draw
XFormItem.prototype.valign = _UNDEFINED_;						// _UNDEFINED_ because it's a bit faster to draw
XFormItem.prototype.focusable = false;

// updating
XFormItem.prototype.forceUpdate = false;			// SET TO true TO FORCE AN ITEM TO UPDATE, EVEN IF VALUE HAS NOT CHANGED
XFormItem.prototype.relevant;
XFormItem.prototype.relevantIfEmpty = true;
XFormItem.prototype.relevantBehavior = _HIDE_;		//	_HIDE_, _DISABLE_


// changing/saving
XFormItem.prototype.elementChangeHandler = "onchange";


// choices map
XFormItem.prototype.selection = _CLOSED_;
XFormItem.prototype.openSelectionLabel = "";

// error handling
XFormItem.prototype.errorLocation = _SELF_;

//
// Methods
//


// set the initializing attributes of this firm
XFormItem.prototype._setAttributes = function (attributes) {
	this.__attributes = attributes;
}

// override this to do any item initialization you need to do
//	NOTE: this is called AFTER the formItem is initiaized with its modelItem, set in its form, etc
XFormItem.prototype.initFormItem = function() {
	window.status = '';
}	

// DEFAULT IMPLEMENTATION calls this.getForm().initItemList() on our items array
//	SOME CLASSES MAY NOT WANT TO DO THIS (eg: _REPEAT_, which does this dynamically later)
XFormItem.prototype.initializeItems = function () {
	var items = this.getItems();
	if (items != null) {
		this.items = this.getForm().initItemList(items, this);
	}
}


// error handling

/**
 * Sets the error message for this form item.
 * This will set the error for this item, or 
 * useing the errorLocation, follow the chain up,
 * to set the error on the related item.
 *
 * @param message The message to display. This message should already
 *                be localized.
 */
XFormItem.prototype.setError = function(message, childError) {
	var errLoc = this.getErrorLocation();
	if (errLoc == _PARENT_ || errLoc == _INHERIT_){
		this.getParentItem().setError(message, true);
		return;
	}
	this.getForm().addErrorItem(this);
	this.__errorState = XFormItem.ERROR_STATE_ERROR;
	var container = this.getErrorContainer(true);
	if (container) container.innerHTML = message;
};

/** 
 * Clears the error message for this form item. 
 * This will clear the error for this item, or 
 * useing the errorLocation, follow the chain up,
 * to clear the error on the related item.
 */
XFormItem.prototype.clearError = function() {
	var errLoc = this.getErrorLocation();
	if (errLoc == _PARENT_ || errLoc == _INHERIT_){
		this.getParentItem().clearError();
		return;
	}

	this.getForm().removeErrorItem(this);
	this.__errorState = XFormItem.ERROR_STATE_VALID;
	this.removeErrorContainer();
};

XFormItem.prototype.hasError = function () {
	return (this.__errorState == XFormItem.ERROR_STATE_ERROR);
};

XFormItem.prototype.getErrorContainer = function(createIfNecessary) {
	var container = this.getElement(this.getId() + "___error_container");
	if (container != null) return container;
	
	if (createIfNecessary == true && this.getContainer()) {
		return this.createErrorContainer();
	}
	return null;
}

XFormItem.prototype.createErrorContainer = function () {
	// output an error container
	var errorContainer = document.createElement("div");
	errorContainer.id = this.getId() + "___error_container";
	errorContainer.className = this.getErrorCssClass();

	var container = this.getContainer();
	if (container.hasChildNodes()) {
		container.insertBefore(errorContainer, container.firstChild);
	} else {
		container.appendChild(errorContainer);
	}	
	return errorContainer;
}

XFormItem.prototype.removeErrorContainer = function () {
	var errorContainer = this.getErrorContainer();
	if (errorContainer != null) {
		errorContainer.parentNode.removeChild(errorContainer);
	}
}


//
// PROPERTIES OF INDIVIDUAL ITEMS
//


XFormItem.prototype.getType = function () {
	return this.type;
}


//XXX
XFormItem.prototype.getParentItem = function () {
	return this.__parentItem;
}

XFormItem.prototype.getForm = function () {
	return this.__xform;
}

XFormItem.prototype.getGlobalRef = function() {
	return this.getForm().getGlobalRefString() + ".getItemById('" + this.getId() + "')";
}

XFormItem.prototype.getFormGlobalRef = function() {
	return this.getForm().getGlobalRefString();
}

XFormItem.prototype.getInstance = function() {
	return this.getForm().instance;
}

XFormItem.prototype.getModel = function () {
	return this.getForm().getModel();
}


XFormItem.prototype.getFormController = function () {
	return this.getForm().getController();
}


XFormItem.prototype.getModelItem = function() {
	return this.__modelItem;
}

//XXX NON-STANDARD
XFormItem.prototype.getRef = function () {
	if (this.ref !== _UNDEFINED_) return this.ref;
	return this.__attributes.ref;
}


XFormItem.prototype.getRefPath = function () {
	return this.refPath;
}

XFormItem.prototype.getId = function () {
	return this.id;
}

XFormItem.prototype.getExternalId = function () {
	var ret = null;
	if (this.__attributes.id !== _UNDEFINED_) {
		ret = this.__attributes.id;
	} else if ( (ret = this.getRef()) !== _UNDEFINED_) {
		// nothing
	} else {
		ret = null;
	}
	return ret;
};



//
//	GENERIC HTML WRITING ROUTINES
//


XFormItem.prototype.getOnChangeMethod = function() {
	return this.cacheInheritedMethod("onChange","$onChange","value,event,form");
}

XFormItem.prototype.getOnActivateMethod = function() {
	return this.cacheInheritedMethod("onActivate","$onActivate","event");
}

XFormItem.prototype.getExternalChangeHandler = function() {
	return "var item = " + this.getGlobalRef() + "; item.$elementChanged(value, item.getInstanceValue(), event||window.event);";
}
XFormItem.prototype.getElementValueGetterHTML = function () {
	return "var value = this.value;";
}

/**
* returns the HTML part of an <input > element that is used to set "onchange" 
* (or whatever is defined by elementChangehandler)  property of the element
**/
XFormItem.prototype.getChangeHandlerHTML = function() {
	var elementChangeHandler = this.getElementChangeHandler();
	if (elementChangeHandler != "onkeypress") {
		return AjxBuffer.concat(" ", elementChangeHandler, "=\"", this.getChangehandlerJSCode() + "\"",this.getKeyPressHandlerHTML());
	} else {
		return this.getKeyPressHandlerHTML();
	}
}

/**
* returns JavaScript code that should be executed when an element is changed by a user
* @author Greg Solovyev
**/
XFormItem.prototype.getChangehandlerJSCode = function () {
	return AjxBuffer.concat(this.getElementValueGetterHTML(),this.getExternalChangeHandler());
}

XFormItem.prototype.getFocusHandlerHTML = function () {
	var formId = this.getFormGlobalRef(),
		itemId = this.getId()
	;
	return AjxBuffer.concat(
		" onfocus=\"", formId, ".onFocus('", itemId, "')\"",
		" onblur=\"", formId, ".onBlur('", itemId, "')\""
	);
}


XFormItem.prototype.getOnActivateHandlerHTML = function() {
	var method = this.getOnActivateMethod();
	if (method == null) return "";
	
	return AjxBuffer.concat(
			" ", this.getElementChangeHandler(), "=\"", 
			this.getGlobalRef(),".$onActivate(event||window.event)\""
		);
}


/**
* Schedules {@link #handleKeyPressDelay} to fire later when the user finishes typing
* @param ev - "onkeypress" event 
* @param domItem - HTML form element
* @author Greg Solovyev
**/
XFormItem.prototype.handleKeyUp = function (ev, domItem) {
	// don't fire off another if we've already set one up.
	if (this.keyPressDelayHdlr != null) {
		AjxTimedAction.cancelAction(this.keyPressDelayHdlr);
		XForm.keyPressDelayHdlr = null;
	}
	var form = this.getForm();
	var evt = new DwtKeyEvent();
	evt.setFromDhtmlEvent(ev);
//	ev = ev ? ev : window.event;
	var key = DwtKeyEvent.getCharCode(ev);
	if (key == DwtKeyEvent.KEY_TAB) {
		DwtUiEvent.setBehaviour(ev, true, false);
		return false;
	}	
	var action = new AjxTimedAction(this, this.handleKeyPressDelay, [evt, domItem]);
	//XForm.keyPressDelayHdlr = setTimeout(XForm.handleKeyPressDelay, 250, item, ev, formItem);
	this.keyPressDelayHdlr = AjxTimedAction.scheduleAction(action, 250);
};

XFormItem.prototype.handleKeyDown = function (ev, domItem) {
	ev = (ev != null)? ev: window.event;
	var key = DwtKeyEvent.getCharCode(ev);
	if (key == DwtKeyEvent.KEY_ENTER) {
		// By telling the browser just to let this do the default, and 
		// not let the event bubble, our keyup handler
		// wil see the enter key.
		DwtUiEvent.setBehaviour(ev, true, true);
		return false;
	} else if (key == DwtKeyEvent.KEY_TAB) {
		DwtUiEvent.setBehaviour(ev, true, false);
		this.getForm().focusNext(this.getId());
		return false;
	}
	return true;
};

/**
* Implements delayed handling of "keypress" event. 
* Calls change handler script on the item.
* See {@link XFormItem.#getChangehandlerJSCode} for change handler script.

**/
XFormItem.prototype.handleKeyPressDelay = function(ev, domItem) {	
	this.keyPressDelayHdlr = null;
	if (this.$changeHandlerFunc == null) {
		var JSCode = this.getChangehandlerJSCode();
		this.$changeHandlerFunc = new Function("event", JSCode);
	}
	if (this.$changeHandlerFunc) {
		this.$changeHandlerFunc.call(domItem, ev);
	}
};

XFormItem.prototype.getKeyPressHandlerHTML = function () {

	var keydownEv = "onkeydown";
	if (AjxEnv.isNav) {
		keydownEv = "onkeypress";
	}
	return AjxBuffer.concat(" ", keydownEv,"=\"",this.getGlobalRef(), ".handleKeyDown(event, this)\"",
						   " onkeyup=\"", this.getGlobalRef(), ".handleKeyUp(event, this)\"");
};


//
//	container
//


XFormItem.prototype.outputContainerTDStartHTML = function (html, updateScript, indent, colSpan, rowSpan) {
	html.append(indent, "<td id=\"",  this.getId(), "___container\"",
					(colSpan > 1 ? " colspan=" + colSpan : ""),
					(rowSpan > 1 ? " rowspan=" + rowSpan : ""),
					this.getContainerCssString(), 
					">\r"
	);
} 

XFormItem.prototype.outputContainerTDEndHTML = function (html, updateScript, indent) {
	html.append("\r", indent, "</td id=\"",  this.getId(), "___container\">\r");
} 


//
//	element div
//
// for items that are effectively elements (or are drawn by something other than this form)
// NOTE: you can pass in any random CSS properties you want in cssStyle
XFormItem.prototype.outputElementDivStart = function (html, updateScript, indent) {
	html.append(indent, "<div id=", this.getId(), this.getCssString(), " xform_type='elementDiv'>\r");
}

XFormItem.prototype.outputElementDivEnd = function (html, updateScript, indent) {
	html.append("\r", indent, "</div id=\"", this.getId(), "\">");
}

//
//	label td
//
XFormItem.prototype.outputLabelCellHTML = function (html, updateScript, indent, rowSpan, labelLocation) {
	var label = this.getLabel();
	if (label == null) return;
	
	if (label == "") label = "&nbsp;";
	
	if (labelLocation == _INLINE_) {
		var style = this.getLabelCssStyle();
		if (style == null) style = "";
		style = "position:relative;left:10;top:5;text-align:left;background-color:#eeeeee;margin-left:5px;margin-right:5px;" + style;
		html.append(indent, "<div id=\"", this.getId(),"___label\"", 
								this.getLabelCssString(null, style), ">",
								label,
							"</div>"
					);
	} else {
		html.append(indent, "<td id=\"", this.getId(),"___label\"", 
								this.getLabelCssString(), 
								(rowSpan > 1 ? " rowspan=" + rowSpan : ""), ">", 
								label
		);
		if (this.getRequired()) {
			html.append("<span class='redAsteric'>*</span>");
		}
		html.append("</td>\r");
	}


}



//
//	update script
//
XFormItem.prototype.outputUpdateScriptStart = function (html, updateScript, indent) {
	// we need to always call these, so they're set up for items with or without "ref" properties
	var updateElementMethod = this.getUpdateElementMethod();
	var elementChangedMethod = this.getElementChangedMethod();
	var getDisplayValueMethod = this.getDisplayValueMethod();

//TODO: take the script they want to place, do a regex look for the variables below and only include the ones they care about!
	var forceUpdate = this.getForceUpdate();
	var relevant = this.getRelevant();
	var relevantIfEmpty = this.getRelevantIfEmpty();
	
	var parentRequiresRelevantCheck = (this.__parentItem ? (this.__parentItem._childRelevantCheckRequired == true) : false);
	if (	forceUpdate == false 
			&& this.refPath == null 
			&& relevant == null 
			&& relevantIfEmpty == true
			&& parentRequiresRelevantCheck == false
			&& typeof this.insertElement != "function"
		) return;




	/*updateScript.append(
			// first line is to separate out each item
			"_____________________________________________________++;\r",
			"item = form.getItemById('", this.getId(),"', '", this.getRefPath(), "');\r"
	);*/
	updateScript.append(
			// first line is to separate out each item
			"_____________________________________________________++;\r",
			"item = form.getItemById('", this.getId(),"');\r"
	);

	// if there is a relevant attribute, 
	//		get whether or not this item is relevant, and
	//		write a script that will show or hide the container element
	//
	//	NOTE: we leave the script dangling in the "if relevant" clause, 
	//			and close the if clause in writeUpdateScriptEnd().
	//		It is the job  of each individual outputter to write script that will
	//		update the value of the element (or subelements, etc) during the updateScript.
	//		The can be assured that it will only be called when it is relevant, and
	//		can access the following variables:
	//			value = new value to show
	//			element = DOM element of the 'control' itself (INPUT, SELECT, whatever a custom outputter gave us)
	//			itemId = (often internally generated) ID for the control
	//			ref = ref for the control (in the XForm, not the model)
	//			container = DOM element of the DIV container of the control
	//
	if (relevant != null || relevantIfEmpty == false || parentRequiresRelevantCheck) {
		if (relevantIfEmpty == false) {
			if (relevant == null) {
				relevant = "get(item) != null";
			} else {
				relevant = "get(item) != null && (" + relevant + ")";
			}
		}
		if (parentRequiresRelevantCheck) {
			if (relevant == null) {
				relevant = "item.__parentItem.__isRelevant";
			} else {
				relevant = "item.__parentItem.__isRelevant && (" + relevant + ")";
			}
		}
		updateScript.append(
			"relevant = (", relevant, ");\r",
			"item.__isRelevant = (relevant == true);\r"
		);
			
		var relevantBehavior = this.getRelevantBehavior();
		if (relevantBehavior == _HIDE_ ) {
			this._endRelevantClause = true;
			updateScript.append(
				"if (!item.__isRelevant) {\r",
					"item.hide(false);\r",
				"} else {\r  ");
			if (this.focusable) {
				updateScript.append(
// 					"DBG.println(AjxDebug.DBG1, \"Adding item ", this.getId(), " to the tabIdOrder \");\r",
					"item.getForm().tabIdOrder.push(item.getId());\r"
				);
			}
			updateScript.append("item.show();\r");
		} else if (relevantBehavior == _BLOCK_HIDE_) {
			this._endRelevantClause = true;
			updateScript.append(
				"if (!item.__isRelevant) {\r",
					"item.hide(true);\r",
				"} else {\r  ");
			if (this.focusable) {
				updateScript.append(
// 					"DBG.println(AjxDebug.DBG1, \"Adding item ", this.getId(), " to the tabIdOrder \");\r",
					"item.getForm().tabIdOrder.push(item.getId());\r"
				);
			}
			updateScript.append("item.show();\r");
		} else if (relevantBehavior == _DISABLE_) {
			this._endRelevantClause = false;
			this._childRelevantCheckRequired = true;
			updateScript.append(
				"if (!item.__isRelevant) {\r",
					"item.disableElement();\r",
				"} else {\r  ");
			if (this.focusable) {
				updateScript.append(
// 					"DBG.println(AjxDebug.DBG1, \"Adding item ", this.getId(), " to the tabIdOrder \");\r",
					"item.getForm().tabIdOrder.push(item.getId());\r"
				);
			}
			updateScript.append(
					"item.enableElement();\r",
				"}\r"//,
			);		
		}
	} else {
		if (this.focusable) {
			updateScript.append(
// 				"DBG.println(AjxDebug.DBG1, \"Adding item ", this.getId(), " to the tabIdOrder \");\r",
				"item.getForm().tabIdOrder.push(item.getId());\r"
			);
		}
	}

	// if the item should be inserted after drawing, do that now
	//	(note: this means that hidden elements won't be inserted until they're relevant)
	if (typeof this.insertElement == "function") {
		updateScript.append("item.insertElement();\r");
	}

	// if we should update the element, call that now.
	// NOTE: by default, we only update values that have changed since the last time
	//	the form items was updated.  To turn this off, set "forceUpdate:true" in a particular item.
	//
	if ((this.refPath || forceUpdate) && (updateElementMethod)) {
		updateScript.append(
			"if (!item.hasError()){\r",
				"value = ", (this.refPath ? 
							 "model.getInstanceValue(instance, item.refPath)" 
							 : "null"
							 ), ";\r",
			(getDisplayValueMethod != null? "value = item.$getDisplayValue(value);\r" : "")
		);

		if (forceUpdate != true) {
			updateScript.append(
				"var valueStr='';\r",
				"try {\r",
					"valueStr = ''+String(value);\r",
				"} catch (ex) {}\r",
				"if (item.$lastDisplayValue != valueStr) {\r  ",
					"item.$updateElement(value);\r",
					"item.$lastDisplayValue = valueStr;\r",
				"}\r"
			);
		} else {
			updateScript.append(
				"item.$updateElement(value);\r"
			);
		}
		updateScript.append("}\r");
	}
}


XFormItem.prototype.outputUpdateScriptEnd = function (html, updateScript, indent) {
	if (this._endRelevantClause) {
		updateScript.append("\r}\r");
		delete this._endRelevantClause;
	}
}


//
//	change handling
//

XFormItem.prototype.elementChanged = function(elementValue, instanceValue, event) {
	this.getForm().itemChanged(this.getId(), elementValue, event);
}







//
//	get and set instance values!
//


XFormItem.prototype.getInstanceValue = function (path) {
	if (path == null) path = this.getRefPath();
	if (path == null) return null;
	return this.getModel().getInstanceValue(this.getInstance(), path);
}

//NOTE: model.getInstance() gets count of PARENT
XFormItem.prototype.getInstanceCount = function () {
	if (this.getRefPath() == null) return 0;
	return this.getModel().getInstanceCount(this.getInstance(), this.getRefPath());
}

XFormItem.prototype.setInstanceValue = function (value, path) {
	if (path == null) path = this.getRefPath();
	if (path == null) return null;
	return this.getModel().setInstanceValue(this.getInstance(), path, value);
}
XFormItem.prototype.set = XFormItem.prototype.setInstancevalue;

XFormItem.getValueFromHTMLSelect = function (element) {
	var values = [];
	for (var i = 0; i < element.options.length; i++) {
		if (element.options[i].selected) {
			values[values.length] = element.options[i].value;	
		}
	}
	return values.join(",");
}

XFormItem.prototype.getValueFromHTMLSelect = function(element) {
	if (element == null) element = this.getElement();
	return XFormItem.getValueFromHTMLSelect(element);
}

XFormItem.updateValueInHTMLSelect1 = function (newValue, element, selectionIsOpen) {
	if (element == null) return null;
	if (selectionIsOpen == null) selectionIsOpen = false;
	
	var options = element.options;
	for (i = 0; i < options.length; i++) {
		var choice = options[i];
		if (choice.value == newValue) {
			element.selectedIndex = i;
			return element.value;
		}
	}
	// default to the first element if nothing was selected (?)
	if (options.length > 0) {
		element.selectedIndex = 0;
		return options[0].value;
	}
	return null;
}
XFormItem.prototype.updateValueInHTMLSelect1 = function (newValue, element, selectionIsOpen) {
	if (element == null) element = this.getElement();
	if (selectionIsOpen == null) selectionIsOpen = this.getSelectionIsOpen();
	return XFormItem.updateValueInHTMLSelect1(newValue, element, selectionIsOpen);
}


XFormItem.updateValueInHTMLSelect = function (newValue, element, selectionIsOpen) {
	if (element == null) return null;
	if (newValue == null) newValue = "";
	if (selectionIsOpen == null) selectionIsOpen = false;
	
	// assumes newValue is a comma-delimited string or an array
	if (typeof newValue == "string") newValue = newValue.split(",");
	// hack up newValue to make searching for a particular option newValue easier
	var uniqueStartStr = "{|[", 
		uniqueEndStr = "]|}"
	;
	newValue = uniqueStartStr + newValue.join(uniqueEndStr + uniqueStartStr) + uniqueEndStr;
	
	var options = element.options;
	var anySelected = false;
	for (var i = 0; i < options.length; i++) {
		var isPresent = (newValue.indexOf(uniqueStartStr + options[i].value + uniqueEndStr) > -1);
		options[i].selected = isPresent;
		anySelected = anySelected || isPresent;		
	}
	
	if (!anySelected && !selectionIsOpen) {
		// select the first value???
		options[0].selected = true;
	}
}

XFormItem.prototype.updateValueInHTMLSelect = function (newValue, element, selectionIsOpen) {
	if (newValue == null) newValue = "";
	if (element == null) element = this.getElement();
	if (selectionIsOpen == null) selectionIsOpen = this.getSelectionIsOpen();
	return XFormItem.updateValueInHTMLSelect(newValue, element, selectionIsOpen);
}

XFormItem.prototype.getChoicesHTML = function() {
	var choices = this.getNormalizedChoices();
	if (choices == null) return "";	//throw an error?
	var html = new AjxBuffer();
	

	this.outputChoicesHTMLStart(html);
	var values = choices.values;
	var labels = choices.labels;

	var choiceCssClass = this.getChoiceCssClass();
	for (var i = 0; i < values.length; i++) {
		html.append("", this.getChoiceHTML(i, values[i], labels[i], choiceCssClass, ""));
	}
	this.outputChoicesHTMLEnd(html);
	return html.toString();
}

XFormItem.prototype.outputChoicesHTMLStart = function(html, indent) {
	return;
}
XFormItem.prototype.outputChoicesHTMLEnd = function(html, indent) {
	return;
}

XFormItem.prototype.getChoiceCssClass = function() {
	return "";
}

XFormItem.prototype.getChoiceHTML = function (itemNum, value, label, cssClass, indent) {
	return AjxBuffer.concat(indent,"<option value=\"", value, "\">", label,"</option>");
}

XFormItem.prototype.updateChoicesHTML = function () {
	this.cleanChoiceDisplay();

	// NOTE: setting the innerHTML of the options doesn't work
	//	for now, just set the outer HTML of the entire widget
	// TODO: do this by frobbing the options manually for speed and so things don't flash
	var html = new AjxBuffer();
	var updateScript = new AjxBuffer();	// NOTE: we won't be using this...
	this.outputHTML(html, new AjxBuffer(), "");
	this.getContainer().innerHTML = html.toString();
	return;

/*	var element = this.getElement();
	if (element != null) {
		var options = element.options;
		element.options.innerHTML = this.getChoicesHTML();
	}
*/
}


XFormItem.prototype.getInheritedProperty = function(prop) {
	// first look in the instance attributes
	if (this.__attributes[prop] !== _UNDEFINED_) return this.__attributes[prop];

	// look up the inheritance chain for this type
	if (this[prop] !== _UNDEFINED_) return this[prop];

	// if not found there, look in the xmodel
	var modelItem = this.__modelItem;
	if (modelItem && modelItem[prop]) return modelItem[prop];

	return null;
}

// NOTE: cacheProp MUST be different than prop!
XFormItem.prototype.cacheInheritedProperty = function (prop, cacheProp) {
	if (this[cacheProp] !== _UNDEFINED_) return this[cacheProp];
	return (this[cacheProp] = this.getInheritedProperty(prop));
}

XFormItem.prototype.cacheInheritedMethod = function (methodName, cacheProp, arguments) {
	if (this[cacheProp] !== _UNDEFINED_) return this[cacheProp];
	var func = this.getInheritedProperty(methodName);
	if (func != null) func = this.convertToFunction(func, arguments);
	this[cacheProp] = func;
	return func;
}




//
//	properties of the element after its' been drawn
//


XFormItem.prototype.getElement = XForm.prototype.getElement;
XFormItem.prototype.showElement = XForm.prototype.showElement;
XFormItem.prototype.hideElement = XForm.prototype.hideElement;
XFormItem.prototype.createElement = XForm.prototype.createElement;


XFormItem.prototype.getWidget = function() {
	return this.widget;
}

XFormItem.prototype.setWidget = function(widget) {
	this.widget = widget;
}


XFormItem.prototype.getContainer = function() {
	return this.getElement(this.getId() + "___container");
}
XFormItem.prototype.getLabelContainer = function() {
	return this.getElement(this.getId() + "___label");
}
XFormItem.prototype.show = function() {
	if(this.deferred)
		this._outputHTML();
		
	var container = this.getLabelContainer();
	if (container) this.showElement(container);
	container = this.getContainer();
	if (container != null) {
		this.showElement(container);
	} else {
		var items = this.getItems();
		if (items != null) {
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				item.show();
			}
		}
	}
}
XFormItem.prototype.hide = function(isBlock) {
	var container = this.getLabelContainer()
	if (container) this.hideElement(container,isBlock);
	container = this.getContainer();
	if (container != null) {
		this.hideElement(container,isBlock);
	} else {
		var items = this.getItems();
		if (items != null) {
			for (var i = 0; i < items.length; i++) {
				items[i].hide(isBlock);
			}
		}
	}
}

XFormItem.prototype.focus = function () {
	this.getForm().focusElement(this.getId());
};


//
//	SIMPLE ATTRIBUTE ACCESSORS
//
//	NOTE: this is effectively the public API for the properties you can define
//			for a FormItem
//

XFormItem.prototype.getRequired = function() {
	return this.getInheritedProperty("required");
}

XFormItem.prototype.getValue = function() {
	return this.getInheritedProperty("value");
}

// SPECIAL CASE:  don't take ITEMS from the model...
//XXX NON-STANDARD
XFormItem.prototype.getItems = function () {
	if (this.items) return this.items;
	return this.__attributes.items;
}

XFormItem.prototype.getRelevant = function () {
	return this.cacheInheritedProperty("relevant","_relevant");
}

XFormItem.prototype.getRelevantIfEmpty = function () {
	return this.getInheritedProperty("relevantIfEmpty");
}

XFormItem.prototype.evalRelevant = function () {
	var relevant = this.getRelevant();
	if (relevant == null) return true;

	var item = this;
	var form = this.getForm();
	var model = this.getModel();
	var instance = this.getForm().getInstance();
	with (form) {
		return eval(relevant);
	}
}


XFormItem.prototype.getRelevantBehavior = function () {
	var behavior = this.getInheritedProperty("relevantBehavior");
	if (behavior == _PARENT_) {
		if (this.__parentItem) {
			return this.__parentItem.getRelevantBehavior();
		} else {
			return _HIDE_;
		}
	}
	return behavior;
}

XFormItem.prototype.getChoices = function () {
	return this.getInheritedProperty("choices");
}

// normalized choices look like:  {values:[v1, v2, v3...], labels:[l1, l2, l3...]}
XFormItem.prototype.getNormalizedChoices = function () {
	if (this.$normalizedChoices) return this.$normalizedChoices;

	var choices = this.getChoices();
	if (choices == null) return null;

	var normalizedChoices;
	if (typeof choices.getChoices == "function") {
		normalizedChoices = choices.getChoices();
	} else if (AjxUtil.isArray(choices)) {
		// it's either an array of objects or an array of strings
		if (typeof choices[0] == "object") {
			// list of objects
			normalizedChoices = XFormChoices.normalizeChoices(choices, XFormChoices.OBJECT_LIST);
		} else {
			// list of simple values
			normalizedChoices = XFormChoices.normalizeChoices(choices, XFormChoices.SIMPLE_LIST);
		}
	} else {
		// assume it's a hash
		normalizedChoices = XFormChoices.normalizeChoices(choices, XFormChoices.HASH);
	}
	this.$normalizedChoices = normalizedChoices;
	return this.$normalizedChoices;
}


XFormItem.prototype.getNormalizedValues = function () {
	var choices = this.getNormalizedChoices();
	if (choices) return choices.values;
	return null;
}


XFormItem.prototype.getNormalizedLabels = function () {
	var choices = this.getNormalizedChoices();
	if (choices) return choices.labels;
	return null;
}
	
	
	
//
//	appearance methods
//

XFormItem.prototype.getAppearance = function () {
	return this.getInheritedProperty("appearance");
}
XFormItem.prototype.getCssClass = function () {
	return this.getInheritedProperty("cssClass");
}

XFormItem.prototype.getCssStyle = function () {
	return this.getInheritedProperty("cssStyle");
}

XFormItem.prototype.getLabel = function (value) {
	return this.getInheritedProperty("label");
}

XFormItem.prototype.getErrorCssClass = function () {
	return this.getInheritedProperty("errorCssClass");
}
XFormItem.prototype.getLabelCssClass = function (className) {
	if (className != null) return className;
	return this.getInheritedProperty("labelCssClass");
}

XFormItem.prototype.getLabelCssStyle = function (style) {
	if (style != null) return style;
	return this.getInheritedProperty("labelCssStyle");
}

XFormItem.prototype.getLabelWrap = function () {
	return this.getInheritedProperty("labelWrap");
}

XFormItem.prototype.getLabelLocation = function () {
	return this.getInheritedProperty("labelLocation");
}

XFormItem.prototype.getContainerCssClass = function () {
	return this.getInheritedProperty("containerCssClass");
}

XFormItem.prototype.getContainerCssStyle = function () {
	return this.getInheritedProperty("containerCssStyle");
}

XFormItem.prototype.getTableCssClass = function () {
	return this.getInheritedProperty("tableCssClass");
}
XFormItem.prototype.getTableCssStyle = function () {
	return this.getInheritedProperty("tableCssStyle");
}

XFormItem.prototype.getNowrap = function () {
	return this.getInheritedProperty("nowrap");
}

XFormItem.prototype.getWidth = function () {
	return this.cacheInheritedProperty("width","_width");
}

XFormItem.prototype.getHeight = function () {
	return this.getInheritedProperty("height");
}

XFormItem.prototype.getOverflow = function () {
	return this.getInheritedProperty("overflow");
}

XFormItem.prototype.getNumCols = function () {
	return this.getInheritedProperty("numCols");
}

XFormItem.prototype.getAlign = function () {
	return this.getInheritedProperty("align");
}


XFormItem.prototype.getValign = function() {
	return this.getInheritedProperty("valign");
}

XFormItem.prototype.getName = function () {
	return this.getInheritedProperty("name");
}

// NEW TABLE LAYOUT STUFF
XFormItem.prototype.useParentTable = true;
XFormItem.prototype.getUseParentTable = function () {
	return this.getInheritedProperty("useParentTable");
}
XFormItem.prototype.colSizes = _UNDEFINED_;
XFormItem.prototype.getColSizes = function () {
	return this.getInheritedProperty("colSizes");
}
XFormItem.prototype.colSpan = 1;
XFormItem.prototype.getColSpan = function () {
	return this.getInheritedProperty("colSpan");
}
XFormItem.prototype.rowSpan = 1;
XFormItem.prototype.getRowSpan = function () {
	return this.getInheritedProperty("rowSpan");
}
// END NEW TABLE LAYOUT STUFF

// error handling
XFormItem.prototype.getErrorLocation = function () {
	return this.getInheritedProperty("errorLocation");
};

//
//	convenience methods to figure out drawing types for you
//

// return the "label" in the choices array for this item
//	(allows us to do lookup of displayed values easily)
XFormItem.prototype.getChoiceLabel = function (value) {
	var choices = this.getNormalizedChoices();
	if (choices == null) return value;
	
	// choices will look like:  {values:[v1, v2, v3...], labels:[l1, l2, l3...]}
	var values = choices.values;
	for (var i = 0; i < values.length; i++) {
		if (values[i] == value) {
			return choices.labels[i];
		}
	}
	// if we didn't find it, simply return the original value
	return value;
}

// return the "label" in the choices array for this item
//	(allows us to do lookup of displayed values easily)
XFormItem.prototype.getChoiceValue = function (label) {
	function labelComparator (a, b) {
			return String(a).toLowerCase() < String(b).toLowerCase() ? -1 : (String(a).toLowerCase() > String(b).toLowerCase() ? 1 : 0);
	 };
	var choices = this.getNormalizedChoices();
	if (choices == null) return value;
	
	// choices will look like:  {values:[v1, v2, v3...], labels:[l1, l2, l3...]}
	// bug 6738: sort will change the mapping between value and label.
	/*
	var labels = choices.labels;
	var vec = AjxVector.fromArray(labels);
	vec.sort(labelComparator);
	var ix = vec.binarySearch(label,labelComparator); */
	var labels = choices.labels;
	var ix = -1;
	for (var i=0; i < labels.length ; i++ ){
		if (labelComparator (label, labels[i]) == 0) {
			ix = i ;
			break;
		}		
	}
	
	if(ix>=0) 
		return choices.values[ix];
	else 
		return choices.values[0];
}

// return the number of the choice for a particular value
//	returns -1 if not found
XFormItem.prototype.getChoiceNum = function (value) {
	var choices = this.getNormalizedChoices();
	if (choices == null) return -1;
	
	// choices will look like:  {values:[v1, v2, v3...], labels:[l1, l2, l3...]}
	var values = choices.values;
	for (var i = 0; i < values.length; i++) {
		if (values[i] == value) {
			return i;
		}
	}
	return -1
}


XFormItem.prototype.getCssString = function () {
	var css = (this.getCssClass() || '');
	if (css != '' && css != null) css = " class=\"" + css + "\"";

	var style = (this.getCssStyle() || '');

	var width = this.getWidth();
	if (width != null && width != "auto") style += ";width:" + width;

	var height = this.getHeight();
	if (height != null) style += ";height:" + height;

	var overflow = this.getOverflow();
	if (overflow != null) style += ";overflow:" + overflow;
	
	if (this.getNowrap())	style += ";white-space:nowrap;";

	var valign = this.getValign();
	if (valign) style += "vertical-align:"+valign;
	
	if (style != '') css += " style=\"" + style + ";\"";
	return css;
}


XFormItem.prototype.getLabelCssString = function (className, style) {
	var css = (this.getLabelCssClass(className) || '');
	if (css != '' && css != null) css = " class=\"" + css + "\"";
	var style = (this.getLabelCssStyle(style) || '');
	if (this.getLabelWrap() == false) {
		style += ";white-space:nowrap";
	}
	if (style != '') css += " style=\"" + style + ";\"";
	
	return css;
}




XFormItem.prototype.getTableCssString = function () {
	var css = (this.getTableCssClass() || '');
	if (css != '' && css != null) css = " class=\"" + css + "\"";

	var style = this.getTableCssStyle();
	if (style == null) style = '';
	
	var colSizes = this.getColSizes();
	if (colSizes != null) {
		style += ";table-layout:fixed";
	}

	var width = this.getWidth();
	if (width != null) 	style += ";width:"+ width;
	
//	var height = this.getHeight();
//	if (height != null)	style += ";height:"+ height;
	
	var overflow = this.getOverflow();
	if (overflow != null) style += ";overflow:" + overflow;

	return css + (style != null ? " style=\"" + style + ";\"" : "");
}


XFormItem.prototype.getContainerCssString = function () {
	var css = (this.getContainerCssClass() || '');
	if (css != '' && css != null) css = " class=\"" + css + "\"";
	var style = this.getContainerCssStyle();
	if (style == null) style = '';
	
	var align = this.getAlign();
	if (align != _LEFT_) {
		if (align == _CENTER_ || align == _MIDDLE_) {
			style += ";text-align:center";
		} else if (align == _RIGHT_) {
			style += ";text-align:right";
		}
	}
	var valign = this.getValign();
	if (valign == _TOP_) {
		style += ";vertical-align:top";
	} else if (valign == _BOTTOM_) {
		style += ";vertical-align:bottom";
	} else if (valign == _CENTER_ || valign == _MIDDLE_) {
		style += ";vertical-align:middle";
	}

	var relevant = this.getRelevant();
	if (relevant) {
		var relevantBehavior = this.getRelevantBehavior();
		if (relevantBehavior == _HIDE_) {
			style += ";display:none";
		} else if(relevantBehavior == _BLOCK_HIDE_) {
			style += ";display:block";
		} 
	}

	if (style != "") css += " style=\"" + style + ";\"";
	return css;
}




//
//	handling changes to items
//
XFormItem.prototype.getElementChangeHandler = function () {
	return this.getInheritedProperty("elementChangeHandler");
}




//
//	outputting, inserting and updating items
//

XFormItem.prototype.getForceUpdate = function() {
	return this.getInheritedProperty("forceUpdate");
}

XFormItem.prototype.getOutputHTMLMethod = function() {
	return this.convertToFunction(
				this.getInheritedProperty("outputHTML"),
				"html,updateScript,indent,currentCol"
		);
}

XFormItem.prototype.getElementChangedMethod = function () {
	return this.cacheInheritedMethod("elementChanged","$elementChanged","elementValue, instanceValue, event");
}

XFormItem.prototype.getUpdateElementMethod = function() {
	return this.cacheInheritedMethod("updateElement","$updateElement","newValue");
}

XFormItem.prototype.getDisplayValueMethod = function() {
	return this.cacheInheritedMethod("getDisplayValue","$getDisplayValue","newValue");
}


XFormItem.prototype.convertToFunction = function (script, arguments) {
	if ((script == null) || (typeof(script) == "function")) return script;
	if (typeof(this[script]) == "function") return this[script];
	// CLOSURE???
	return new Function(arguments, script);
}



// note that this form item's display needs to be updated
XFormItem.prototype.dirtyDisplay = function () {
	delete this.$lastDisplayValue;
}

// override the next method in your subclass to enable/disable element
XFormItem.prototype.setElementEnabled = function(enable) {}

// convenience methods that call the above routine
XFormItem.prototype.disableElement = function () {
	this.setElementEnabled(false);
}

XFormItem.prototype.enableElement = function () {
	this.setElementEnabled(true);
}

// you can use these to 
XFormItem.prototype.setElementDisabledProperty = function (enable) {
	this.getElement().disabled = (enable != true)
}


XFormItem.prototype.setElementEnabledCssClass = function (enable) {
	var el = this.getElement();
	if (!el) return;
	
	if (enable) {
		el.className = this.getCssClass();
	} else {
		el.className = this.getCssClass() + "_disabled";
	}
}



//
//	_SELECT_ etc type properties
//
XFormItem.prototype.getSelection = function () {
	return this.getInheritedProperty("selection");
}

XFormItem.prototype.getSelectionIsOpen = function () {
	return this.getInheritedProperty("selection");
}

XFormItem.prototype.getOpenSelectionLabel = function () {
	return this.getInheritedProperty("openSelectionLabel");
}


//
//	_REPEAT_ type properties
//

XFormItem.prototype.getNumberToShow = function () {
	return this.getInheritedProperty("number");
}

XFormItem.prototype.getShowAddButton = function () {
	return this.getInheritedProperty("showAddButton");
}

XFormItem.prototype.getShowRemoveButton = function () {
	return this.getInheritedProperty("showRemoveButton");
}

XFormItem.prototype.getShowMoveUpButton = function () {
	return this.getInheritedProperty("showMoveUpButton");
}

XFormItem.prototype.getShowMoveDownButton = function () {
	return this.getInheritedProperty("showMoveDownButton");
}

XFormItem.prototype.getAddButton = function () {
	return this.getInheritedProperty("addButton");
}

XFormItem.prototype.getRemoveButton = function () {
	return this.getInheritedProperty("removeButton");
}

XFormItem.prototype.getMoveUpButton = function () {
	return this.getInheritedProperty("moveUpButton");
}

XFormItem.prototype.getMoveDownButton = function () {
	return this.getInheritedProperty("moveDownButton");
}

XFormItem.prototype.getAlwaysShowAddButton = function () {
	return this.getInheritedProperty("alwaysShowAddButton");
}

XFormItem.prototype.getRepeatInstance = function () {
	return this.getInheritedProperty("repeatInstance");
}




//
//	_IMAGE_ type properties
//

XFormItem.prototype.getSrc = function () {
	return this.getInheritedProperty("src");
}

XFormItem.prototype.getSrcPath = function () {
	return this.getInheritedProperty("srcPath");
}



//
//	_ANCHOR_, _URL_, etc
//
//	type defaults
XFormItem.prototype.getShowInNewWindow = function () {
	return this.getInheritedProperty("showInNewWindow");
}




//
//	internal properties for creating various item types
//


XFormItem.prototype.getWriteElementDiv = function () {
	return this.getInheritedProperty("writeElementDiv");
}

XFormItem.prototype.getMultiple = function () {
	return this.getInheritedProperty("multiple");
}

XFormItem.prototype.getAlwaysUpdateChoices = function () {
	return this.getInheritedProperty("alwaysUpdateChoices");
}

XFormItem.prototype.choicesAreDirty = function () {
	return (this._choiceDisplayIsDirty == true || this.getAlwaysUpdateChoices());
}












/**
* @class defines XFormItem type _OUTPUT_
* @contructor
**/
function Output_XFormItem() {}
XFormItemFactory.createItemType("_OUTPUT_", "output", Output_XFormItem, XFormItem);


//	type defaults
Output_XFormItem.prototype.writeElementDiv = true;
Output_XFormItem.prototype.cssClass =  "xform_output";	// element itself (or element div)
Output_XFormItem.prototype.containerCssClass =  "xform_output_container";	// element itself (or element div)

//	methods

Output_XFormItem.prototype.outputHTML = function (html, updateScript, indent) {
	// by defaut, we output the "attributes.value" if set 
	//	(in case an item only wants to write out on the initial draw)
	// NOTE: dereferencing through the choice map happens in getDisplayValue()
	var value = this.getValue();
	var method = this.getDisplayValueMethod();
	if (method) {
		value = method.call(this, value);
	}
	html.append(value);
}


Output_XFormItem.prototype.getDisplayValue = function(newValue) {
	// dereference through the choices array, if provided
	newValue = this.getChoiceLabel(newValue);

	if (newValue == null) {
		newValue = "";
	} else {
		newValue = "" + newValue;
	}
	return newValue;
}

Output_XFormItem.prototype.updateElement = function (newValue) {
	this.getElement().innerHTML = newValue;
}


// set up how disabling works for this item type
Output_XFormItem.prototype.setElementEnabled = XFormItem.prototype.setElementEnabledCssClass;





/**
* @class defines XFormItem type _TEXTFIELD_
* @contructor
**/
function Textfield_XFormItem() {}
XFormItemFactory.createItemType("_TEXTFIELD_", "textfield", Textfield_XFormItem, XFormItem);
// aliases for _TEXTFIELD_:  _INPUT_
XFormItemFactory.registerItemType("_INPUT_", "input", Textfield_XFormItem);

//	type defaults
//Textfield_XFormItem.prototype.width = 100;
Textfield_XFormItem.prototype._inputType = "text";
Textfield_XFormItem.prototype.cssClass = "xform_field";
Textfield_XFormItem.prototype.elementChangeHandler="onkeypress";
Textfield_XFormItem.prototype.focusable = true;
Textfield_XFormItem.prototype.containerCssClass = "xform_field_container";

//	methods
Textfield_XFormItem.prototype.outputHTML = function (html, updateScript, indent, currentCol) {
	var inputType = this._inputType;
	var value = this.getValue();
	var modelItem = this.getModelItem();


	/***
//XXX this is probably not the best way to tell if we only want to enter numbers...
	if (modelItem && (modelItem.type == _NUMBER_)) {// || modelItem.type == _COS_NUMBER_)) {
		var keyStrokeHandler = " onkeypress=\""
//			+"',45,46,48,49,50,51,52,53,54,55,56,57,69,101,'.indexOf(','+(event||window.event).keyCode+',') > -1\""		
				+"var code = ','+(event||window.event).which+',';"
				+"var isValidChar = (',45,46,48,49,50,51,52,53,54,55,56,57,69,101,'.indexOf(code) > -1);"
				+"DBG.println(code + ':'+isValidChar);"
				+"event.returnValue = isValidChar;"
				+"return isValidChar;"
				+"\""
	}
	/***/
	html.append(indent, 
			"<input autocomplete='off' id=\"", this.getId(),"\" type=\"", inputType, "\"", this.getCssString(), 
				this.getChangeHandlerHTML(), this.getFocusHandlerHTML(),
				(value != null ? " value=\"" + value + "\"" : ""),
			">");
}

Textfield_XFormItem.prototype.updateElement = function(newValue) {
	if (newValue == null) newValue = this.getValue();
	if (newValue == null) newValue = "";
	if (this.getElement().value != newValue) {
		this.getElement().value = newValue;
	}
}

// set up how disabling works for this item type
Textfield_XFormItem.prototype.setElementEnabled = XFormItem.prototype.setElementDisabledProperty;





/**
* @class defines XFormItem type _SECRET_
* @contructor
**/
function Secret_XFormItem() {}
XFormItemFactory.createItemType("_SECRET_", "secret", Secret_XFormItem, Textfield_XFormItem);
// alias for the SECRET class:  PASSWORD
XFormItemFactory.registerItemType("_PASSWORD_", "password", Secret_XFormItem);


//	type defaults
Secret_XFormItem.prototype._inputType = "password";
Secret_XFormItem.prototype.focusable = true;




/**
* @class defines XFormItem type _FILE_
* @contructor
**/
function File_XFormItem() {}
XFormItemFactory.createItemType("_FILE_", "file", File_XFormItem, Textfield_XFormItem)

//	type defaults
File_XFormItem.prototype._inputType = "file";
File_XFormItem.prototype.forceUpdate = false;
File_XFormItem.prototype.focusable = true;



/**
* @class defines XFormItem type _TEXTAREA_
* @contructor
**/
function Textarea_XFormItem() {}
XFormItemFactory.createItemType("_TEXTAREA_", "textarea", Textarea_XFormItem, Textfield_XFormItem)

Textarea_XFormItem.prototype.width = "100%";
Textarea_XFormItem.prototype.height = 100;
Textarea_XFormItem.prototype.focusable = true;
//	methods
Textarea_XFormItem.prototype.outputHTML = function (html, updateScript, indent, currentCol) {
	var wrap = this.getInheritedProperty("textWrapping");
	if (!wrap)
		wrap = "off";
		
	html.append(indent, 
		"<textarea id=\"", this.getId(), "\"", this.getCssString(),
				this.getChangeHandlerHTML(), this.getFocusHandlerHTML(), "wrap='", wrap, "'",
		"></textarea>");
}





/**
* @class defines XFormItem type _CHECKBOX_
* @contructor
**/
function Checkbox_XFormItem() {}
XFormItemFactory.createItemType("_CHECKBOX_", "checkbox", Checkbox_XFormItem, XFormItem)

//	type defaults
Checkbox_XFormItem.prototype._inputType = "checkbox";
Checkbox_XFormItem.prototype.elementChangeHandler = "onclick";
Checkbox_XFormItem.prototype.labelLocation = _RIGHT_;
Checkbox_XFormItem.prototype.cssClass = "xform_checkbox";
Checkbox_XFormItem.prototype.labelCssClass = "xform_checkbox";
Checkbox_XFormItem.prototype.align = _RIGHT_;
Checkbox_XFormItem.prototype.trueValue = _UNDEFINED_;		// Don't set in proto so model can override
Checkbox_XFormItem.prototype.falseValue = _UNDEFINED_;
Checkbox_XFormItem.prototype.focusable = true;

//	methods
Checkbox_XFormItem.prototype.outputHTML = function (html, updateScript, indent, currentCol) {
	// figure out how to show the checkbox as checked or not
	var checked = "";
	if (this.getInstanceValue() == this.getTrueValue()) {
		checked = " CHECKED";
	}
	html.append(indent, 
		"<input autocomplete='off' id=\"", this.getId(),"\" type=\"", this._inputType, "\"",  
				this.getChangeHandlerHTML(), this.getFocusHandlerHTML(), checked,
		">");
}


Checkbox_XFormItem.prototype.getTrueValue = function () {
	var trueValue = this.getInheritedProperty("trueValue");
	if (trueValue == null) trueValue = true;
	return trueValue;
}

Checkbox_XFormItem.prototype.getFalseValue = function () {
	var falseValue = this.getInheritedProperty("falseValue");
	if (falseValue == null) falseValue = false;
	return falseValue;
}



Checkbox_XFormItem.prototype.updateElement = function(newValue) {
	newValue = (newValue == this.getTrueValue());
	this.getElement().checked = newValue;
}

Checkbox_XFormItem.prototype.getElementValueGetterHTML = function () {
	var trueValue = this.getTrueValue();
	if (trueValue !== _UNDEFINED_) {
		if (typeof trueValue == "string") trueValue = "'" + trueValue + "'";
		
		var falseValue = this.getFalseValue();
		if (typeof falseValue == "string") falseValue = "'" + falseValue + "'";
	
		if (trueValue == null) trueValue = true;
		if (falseValue == null) falseValue = false;
	
		return AjxBuffer.concat(
			"var value = (this.checked ? ",  trueValue, " : ", falseValue, ");"
		);
	} else {
		return "var value = '"+this.getValue()+"';";
	}
}


// set up how disabling works for this item type
//	XXXX eventually we want to disable our label as well...
Checkbox_XFormItem.prototype.setElementEnabled = XFormItem.prototype.setElementDisabledProperty;



/**
* @class defines XFormItem type _RADIO_
* @contructor
**/
function Radio_XFormItem() {}
XFormItemFactory.createItemType("_RADIO_", "radio", Radio_XFormItem, Checkbox_XFormItem)

//	type defaults
Radio_XFormItem.prototype._inputType = "radio";
Radio_XFormItem.prototype.focusable = true;
//	methods

Radio_XFormItem.prototype.updateElement = function(newValue) {
	this.getElement().checked = (this.getValue() == newValue);
}




/**
* @class defines XFormItem type _BUTTON_
* this item is a simple HTML <button> element
* @contructor
**/
function Button_XFormItem() {}
XFormItemFactory.createItemType("_BUTTON_", "button", Button_XFormItem, XFormItem);
XFormItemFactory.registerItemType("_TRIGGER_", "trigger", Button_XFormItem);
//	type defaults
Button_XFormItem.prototype.forceUpdate = false;
Button_XFormItem.prototype.elementChangeHandler = "onclick";
Button_XFormItem.prototype.labelLocation = _NONE_;
Button_XFormItem.prototype.relevantBehavior = _DISABLE_;
Button_XFormItem.prototype.cssClass = "xform_button";
Button_XFormItem.prototype.focusable = true;
// 	methods
Button_XFormItem.prototype.outputHTML = function (html, updateScript, indent, currentCol) {
	// write the div to hold the value (will be filled in on update)
	html.append(indent,
		"<button id=\"", this.getId(), "\"", this.getCssString(),
			"\r  ",indent, this.getOnActivateHandlerHTML(), 
			"\r  ",indent, this.getFocusHandlerHTML(),
		"\r",indent,">", 
			this.getLabel(),
		"</button>");
}

// set up how disabling works for this item type
Button_XFormItem.prototype.setElementEnabled = XFormItem.prototype.setElementDisabledProperty;



/**
* @class defines XFormItem type _SUBMIT_
* this item is a simple HTML <input type="submit"> element
* @contructor
**/
function Submit_XFormItem() {}
XFormItemFactory.createItemType("_SUBMIT_", "submit", Submit_XFormItem, Button_XFormItem)


//	methods
Submit_XFormItem.prototype.outputHTML = function (html, updateScript, indent, currentCol) {
	// write the div to hold the value (will be filled in on update)
	html.append(
		"<input id=\"", this.getId(), "\" type=\"submit\"", this.getCssString(),
			this.getChangeHandlerHTML(), this.getFocusHandlerHTML(),
		" value=\"", this.getLabel(), ">"
	);
}






/**
* @class defines XFormItem type _ANCHOR_
* this item is an HTML <a> element
* @contructor
**/
function Anchor_XFormItem() {}
XFormItemFactory.createItemType("_ANCHOR_", "anchor", Anchor_XFormItem, XFormItem)

//	type defaults
Anchor_XFormItem.prototype.writeElementDiv = true;
Anchor_XFormItem.prototype.forceUpdate = true;
Anchor_XFormItem.prototype.cssClass = "xform_anchor";
Anchor_XFormItem.prototype.elementChangeHandler = "onclick";
Anchor_XFormItem.prototype.href = "javascript:;";
Anchor_XFormItem.prototype.showInNewWindow = true;
Anchor_XFormItem.prototype.focusable = true;

Anchor_XFormItem.prototype.getHref = function () {
	return this.getInheritedProperty("href");
}

//	type defaults


Anchor_XFormItem.prototype.getAnchorTag = function(href, label) {
	if (href == null) href = this.getHref();
	if (label == null) label = this.getLabel();
	
	var inNewWindow = this.getShowInNewWindow();
	return AjxBuffer.concat(
			'<a href=', href, 
				this.getOnActivateHandlerHTML(), 
				(inNewWindow ? ' target="_blank"' : ''),
			'>',
				label,
			'</a>');
}

//	methods
Anchor_XFormItem.prototype.outputHTML = function (html) {
	html.append(this.getAnchorTag());
}


Anchor_XFormItem.prototype.updateElement = function (value) {
	this.getElement().innerHTML = this.getAnchorTag(value);
}


// set up how disabling works for this item type
Anchor_XFormItem.prototype.setElementEnabled = XFormItem.prototype.setElementEnabledCssClass;




/**
* @class defines XFormItem type _DATA_ANCHOR_
* this item is an HTML <a> element
* @contructor
**/
function Data_Anchor_XFormItem() {}
XFormItemFactory.createItemType("_DATA_ANCHOR_", "data_anchor", Data_Anchor_XFormItem, Anchor_XFormItem)


Data_Anchor_XFormItem.prototype.updateElement = function (value) {
	this.getElement().innerHTML = this.getAnchorTag(null, value);
}




/**
* @class defines XFormItem type _URL_
* @contructor
**/
function Url_XFormItem() {}
XFormItemFactory.createItemType("_URL_", "url", Url_XFormItem, Anchor_XFormItem)


Url_XFormItem.prototype.updateElement = function (value) {
	this.getElement().innerHTML = this.getAnchorTag(value, value);
}





/**
* @class defines XFormItem type _MAILTO_
* this item is an _ANCHOR_ element with "mailto:" link
* @contructor
**/
function Mailto_XFormItem() {}
XFormItemFactory.createItemType("_MAILTO_", "mailto", Mailto_XFormItem, Anchor_XFormItem)
Mailto_XFormItem.prototype.updateElement = function (value) {
	this.getElement().innerHTML = this.getAnchorTag("mailto:"+value, value);
}




/**
* @class defines XFormItem type _IMAGE_
* @contructor
**/
function Image_XFormItem() {}
XFormItemFactory.createItemType("_IMAGE_", "image", Image_XFormItem, XFormItem)


//	type defaults
Image_XFormItem.prototype.forceUpdate = true;
Image_XFormItem.prototype.src = _UNDEFINED_;
Image_XFormItem.prototype.srcPath = _UNDEFINED_;;
Image_XFormItem.prototype.writeElementDiv = true;


//	methods
Image_XFormItem.prototype.updateElement = function (src) {
	if (src == null) src = this.getSrc();
	
	// dereference through the choices array, if provided
	src = this.getChoiceLabel(src);

	// if we didn't get an image name, output nothing (?)
	if (src == null || src == "") {
		var output = "";
	} else {
		// prepend the image path
		var path = this.getSrcPath();
		if (path != null) src = path + src;

		var output = AjxBuffer.concat(
			"<img id=\"", this.getId(), "\" border=0 ", this.getCssString(),
				" src=\"", src, "\"",
			">"
		);
	}
	this.getElement().innerHTML = output;
}


// set up how disabling works for this item type
Image_XFormItem.prototype.setElementEnabled = XFormItem.prototype.setElementEnabledCssClass;



// Ajx_Image
function Ajx_Image_XFormItem() {}
XFormItemFactory.createItemType("_AJX_IMAGE_", "ajx_image", Ajx_Image_XFormItem, XFormItem);


//	type defaults
Ajx_Image_XFormItem.prototype.forceUpdate = true;
Ajx_Image_XFormItem.prototype.src = _UNDEFINED_;
Ajx_Image_XFormItem.prototype.srcPath = _UNDEFINED_;;
Ajx_Image_XFormItem.prototype.writeElementDiv = false;

// //	methods
Ajx_Image_XFormItem.prototype.updateElement = function (src) {
	if (src == null) src = this.getSrc();

 	// dereference through the choices array, if provided
 	src = this.getChoiceLabel(src);
	var output;
 	// if we didn't get an image name, output nothing (?)
 	if (src == null || src == "") {
 		output = "";
 	} else {
 		// prepend the image path
 		var path = this.getSrcPath();
 		if (path != null) src = path + src;
		output = AjxImg.getImageHtml(src, "position:relative;" + this.getCssStyle())
 	}
 	this.getContainer().innerHTML = output;
};



/**
* @class defines XFormItem type _SELECT1_
* this item is rendered as HTML <select> element
* @contructor
**/
function Select1_XFormItem() {}
XFormItemFactory.createItemType("_SELECT1_", "select1", Select1_XFormItem, XFormItem)

//	type defaults
Select1_XFormItem.prototype.multiple = false;
Select1_XFormItem.prototype.alwaysUpdateChoices = false;
Select1_XFormItem.prototype.focusable = true;
Select1_XFormItem.prototype.cssClass = "xform_select1";
Select1_XFormItem.prototype.containerCssClass = "xform_select_container";

//	methods
Select1_XFormItem.prototype.initFormItem = function () {
	// if we're dealing with an XFormChoices object...
	var choices = this.getChoices();
	if (choices == null || choices.constructor != XFormChoices) return;

	//	...set up to receive notification when its choices change
	var listener = new AjxListener(this, this.dirtyDisplay);
	choices.addListener(DwtEvent.XFORMS_CHOICES_CHANGED, listener);
}


Select1_XFormItem.prototype.outputHTML = function (html, updateScript, indent, currentCol) {
	html.append(indent, 
		"<select id=\"", this.getId(), "\" ", this.getCssString(), 
			(this.getMultiple() ? "multiple " : ""), 
			this.getChangeHandlerHTML(), this.getFocusHandlerHTML(),
		">\r",
			this.getChoicesHTML(),
		"\r", indent, "</select>"
		);
	this.cleanChoiceDisplay();
}

Select1_XFormItem.prototype.getElementValueGetterHTML = function () {
	return "var value = XFormItem.getValueFromHTMLSelect(this);";
}



Select1_XFormItem.prototype.setChoices = function(newChoices) {
	this.choices = newChoices;
	this.dirtyDisplay();
	this.updateChoicesHTML();
}

Select1_XFormItem.prototype.dirtyDisplay = function () {
	XFormItem.prototype.dirtyDisplay.call(this);
	this._choiceDisplayIsDirty = true;
	delete this.$normalizedChoices;
}

Select1_XFormItem.prototype.cleanChoiceDisplay = function () {
	this._choiceDisplayIsDirty = false;
}


Select1_XFormItem.prototype.updateElement = function (newValue) {
	if (this.choicesAreDirty()) this.updateChoicesHTML();
	this.updateValueInHTMLSelect1(newValue, this.getElement(), this.getSelectionIsOpen());
}


// set up how disabling works for this item type
Select1_XFormItem.prototype.setElementEnabled = XFormItem.prototype.setElementDisabledProperty;



/**
* @class defines XFormItem type _SELECT_
* this item is rendered as HTML <select> element
* @contructor
**/
function Select_XFormItem() {}
XFormItemFactory.createItemType("_SELECT_", "select", Select_XFormItem, Select1_XFormItem)

//	type defaults
Select_XFormItem.prototype.multiple = true;
Select_XFormItem.prototype.selection = _OPEN_;
Select_XFormItem.prototype.focusable = true;
Select_XFormItem.prototype.containerCssClass = "xform_select_container";

//	methods

Select_XFormItem.prototype.updateElement = function (newValue) {
	if (this.choicesAreDirty()) this.updateChoicesHTML();
	this.updateValueInHTMLSelect(newValue, this.getElement(), this.getSelectionIsOpen());
}





/**
* @class defines XFormItem type _SPACER_
* Use to output an entire row spacer
* @contructor
**/
function Spacer_XFormItem() {}
XFormItemFactory.createItemType("_SPACER_", "spacer", Spacer_XFormItem, XFormItem)

//	type defaults
Spacer_XFormItem.prototype.forceUpdate = false;
Spacer_XFormItem.prototype.labelLocation = _NONE_;
Spacer_XFormItem.prototype.width = 1;
Spacer_XFormItem.prototype.height = 10;
Spacer_XFormItem.prototype.cssStyle = "font-size:1px;overflow:hidden;";
Spacer_XFormItem.prototype.colSpan = "*";
Spacer_XFormItem.prototype.focusable = false;

// 	methods
Spacer_XFormItem.prototype.outputHTML = function (html, updateScript, indent, currentCol) {
	html.append(indent, "<div ", this.getCssString(),"></div>");
}

// set up how disabling works for this item type
Spacer_XFormItem.prototype.setElementEnabled = XFormItem.prototype.setElementEnabledCssClass;

/**
* @class defines XFormItem type _CELL_SPACER_
* Use to output a single cell of space
* @contructor
**/
function Cell_Spacer_XFormItem() {}
XFormItemFactory.createItemType("_CELL_SPACER_", "cell_spacer", Cell_Spacer_XFormItem, Spacer_XFormItem)
XFormItemFactory.registerItemType("_CELLSPACER_", "cell_spacer", Cell_Spacer_XFormItem);
Cell_Spacer_XFormItem.prototype.width = 10;
Cell_Spacer_XFormItem.prototype.height = 10;
Cell_Spacer_XFormItem.prototype.colSpan = 1;
Cell_Spacer_XFormItem.prototype.focusable = false;

/**
* @class defines XFormItem type _SEPARATOR_
* @contructor
**/
function Separator_XFormItem() {}
XFormItemFactory.createItemType("_SEPARATOR_", "separator", Separator_XFormItem, XFormItem)

//	type defaults
Separator_XFormItem.prototype.cssClass = "xform_separator";
Separator_XFormItem.prototype.colSpan = "*";
Separator_XFormItem.prototype.align = _CENTER_;
Separator_XFormItem.prototype.valign = _CENTER_;
Separator_XFormItem.prototype.height = 10;
Separator_XFormItem.prototype.focusable = false;

// methods
Separator_XFormItem.prototype.outputHTML = function (html, updateScript, indent, currentCol) {
	var css = (this.getCssClass() || '');
	if (css != '' && css != null) css = " class=\"" + css + "\"";
	
	html.append(indent, 
			"<table width=100% cellspacing=0 cellpadding=0>",
				"<tr><td height=",this.getHeight(),">",
					"<div ", css,"></div>",
			"</td></tr></table>"
	);
}


// set up how disabling works for this item type
Separator_XFormItem.prototype.setElementEnabled = XFormItem.prototype.setElementEnabledCssClass;







/**
* @class defines XFormItem type _GROUP_
* @contructor
**/
function Group_XFormItem() {}
XFormItemFactory.createItemType("_GROUP_", "group", Group_XFormItem, XFormItem)

//	type defaults
Group_XFormItem.prototype.forceUpdate = false;
Group_XFormItem.prototype.numCols = 2;
Group_XFormItem.prototype.useParentTable = false;
Group_XFormItem.prototype.focusable = false;

Group_XFormItem.prototype.outputHTML = function (html, updateScript, indent, currentCol) {
	this.getForm().outputItemList(this.getItems(), this, html, updateScript, indent, this.getNumCols(), currentCol);
}

// nothing to do on group update -- each item will take care of it itself
//group_XFormItem.prototype.updateElement = function (newValue) {}


/**
* @class defines XFormItem type _BORDER_
* dependent on the file DwtBorder.js
* @contructor
**/
function Border_XFormItem() {}
XFormItemFactory.createItemType("_BORDER_", "border", Border_XFormItem, Group_XFormItem)

//	type defaults
Border_XFormItem.prototype.forceUpdate = true;
Border_XFormItem.prototype.colSpan = "*";
Border_XFormItem.prototype.numCols = 2;
Border_XFormItem.prototype.useParentTable = false;
Border_XFormItem.prototype.borderStyle = "card";
Border_XFormItem.prototype.focusable = false;

Border_XFormItem.prototype.getBorderStyle = function () {
	return this.getInheritedProperty("borderStyle");
}

Border_XFormItem.prototype.getSubstitutions = function () {
	return this.getInheritedProperty("substitutions");
}



Border_XFormItem.prototype.getBorderWidth = function () {
	return DwtBorder.getBorderWidth(this.getBorderStyle());
}

Border_XFormItem.prototype.getBorderHeight = function () {
	return DwtBorder.getBorderHeight(this.getBorderStyle());
}


Border_XFormItem.prototype.outputHTMLStart = function (html, updateScript, indent, currentCol) {
	var style = this.getBorderStyle();
	var substitutions = this.getSubstitutions();
	html.append(DwtBorder.getBorderStartHtml(style, substitutions));
}

Border_XFormItem.prototype.outputHTMLEnd = function (html, updateScript, indent, currentCol) {
	var style = this.getBorderStyle();
	var substitutions = this.getSubstitutions();
	html.append(DwtBorder.getBorderEndHtml(style, substitutions));
}

Border_XFormItem.prototype.updateElement = function () {
	// firefox has a bug where it will not resize a border vertically if it should get smaller
	//	set the border table height to a random value to get it to resize
	if (AjxEnv.isNav) {
		var it = this.getContainer().getElementsByTagName('TABLE')[0]; 
		if (it) {
			var height = parseInt(it.style.height);
			if (isNaN(height)) height = 0;
			var newHeight = height;
			while (newHeight == height) {
				newHeight = Math.ceil(Math.random() * 20); 
			}
			it.style.height = newHeight + 'px';
		}
	}
}


/**
* @class defines XFormItem type _GROUPER_
* Draws a simple border around the group, with the label placed over the border
* @contructor
**/
function Grouper_XFormItem() {}
XFormItemFactory.createItemType("_GROUPER_", "grouper", Grouper_XFormItem, Group_XFormItem)
Grouper_XFormItem.prototype.labelCssClass = "GrouperLabel";
Grouper_XFormItem.prototype.labelLocation = _INLINE_;		// managed manually by this class
Grouper_XFormItem.prototype.borderCssClass = "GrouperBorder";
Grouper_XFormItem.prototype.insetCssClass = "GrouperInset";
//Grouper_XFormItem.prototype.colSpan = "*";
//Grouper_XFormItem.prototype.width = "100%";

Grouper_XFormItem.prototype.getBorderCssClass = function () {
	return this.getInheritedProperty("borderCssClass");
}

Grouper_XFormItem.prototype.getInsetCssClass = function () {
	return this.getInheritedProperty("insetCssClass");
}

// output the label
Grouper_XFormItem.prototype.outputHTMLStart = function (html, updateScript, indent, currentCol) {
	html.append(
			"<div class=", this.getBorderCssClass(), ">",
				"<span ", this.getLabelCssString(),">", this.getLabel(), "</span>",
				"<div class=", this.getInsetCssClass(),">"
		);
}

Grouper_XFormItem.prototype.outputHTMLEnd = function (html, updateScript, indent, currentCol) {
	html.append(
			"</div></div>"
		);
}


function RadioGrouper_XFormItem() {}
XFormItemFactory.createItemType("_RADIO_GROUPER_", "radiogrouper", RadioGrouper_XFormItem, Grouper_XFormItem)
RadioGrouper_XFormItem.prototype.labelCssClass = "xform_radio_grouper_label";
RadioGrouper_XFormItem.prototype.borderCssClass = "xform_radio_grouper_border";
RadioGrouper_XFormItem.prototype.insetCssClass = "xform_radio_grouper_inset";
RadioGrouper_XFormItem.prototype.width = "100%";



function CollapsableRadioGrouper_XFormItem() {}
XFormItemFactory.createItemType("_COLLAPSABLE_RADIO_GROUPER_", "collapsableradiogrouper", CollapsableRadioGrouper_XFormItem, RadioGrouper_XFormItem)

CollapsableRadioGrouper_XFormItem.prototype.getLabel = function () {
	var label = XFormItem.prototype.getLabel.apply(this);
	return "<nobr><span class=xform_button style='font-size:9px;color:black;'>&nbsp;&ndash;&nbsp;</span>&nbsp;"+label+"</nobr>";
}




/**
* @class defines XFormItem type _CASE_
* @contructor
**/
function Case_XFormItem() {}
XFormItemFactory.createItemType("_CASE_", "case", Case_XFormItem, Group_XFormItem)

//	type defaults
Case_XFormItem.prototype.labelLocation = _NONE_;
Case_XFormItem.prototype.width = "100%";
Case_XFormItem.prototype.focusable = false;
Case_XFormItem.prototype.deferred = true;

Case_XFormItem.prototype.outputHTML = function (html, updateScript, indent, currentCol) {
	this.getForm().outputItemList([], this, html, updateScript, indent,this.getNumCols(), 0);
//	this.getForm().outputItemList(this.getItems(), this, html, updateScript, indent + "  ",this.getNumCols(), currentCol);
	this.deferred = this.getInheritedProperty("deferred");
	if(this.deferred) {
		this.getForm().outputItemList([], this, html, updateScript, indent,this.getNumCols(), 0);
	} else {
		this.getForm().outputItemList(this.getItems(), this, html, updateScript, indent, this.getNumCols(), currentCol);
	}
}

Case_XFormItem.prototype._outputHTML = function () {
	var form = this.getForm();
	
	var element = this.getElement();
	if(!element) {
		return;
	}
	var masterId = this.getId();
		
	var table = element.getElementsByTagName("table")[0];
	var tbody = element.getElementsByTagName("tbody")[0];

	if (AjxEnv.isIE) {
		var tempDiv = this.createElement("temp",null,"div","");
		tempDiv.display = "none";
	}
	var updateScript = new AjxBuffer();
	var html = new AjxBuffer();
	
	if (this.outputHTMLStart) {
		this.outputHTMLStart(html, updateScript, "", 0);
	}
	
	var drawTable = (this.getUseParentTable() == false);
	if (drawTable) {
		var colSizes = this.getColSizes();
		//XXX MOW: appending an elementDiv around the container if we need to style it
		var outerStyle = this.getCssString();
		if (outerStyle != null && outerStyle != "") {
			this.outputElementDivStart(html, updateScript, "");
		}
		html.append("<table cellspacing=0 cellpadding=0 ", 
				(XForm._showBorder ? "border=1" : "border=0"),
				" id=\"", this.getId(),"_table\" ", this.getTableCssString(),">\r");
		if (colSizes != null) {
			html.append(" <colgroup>\r");
			for (var i = 0; i < colSizes.length; i++) {
				var size = colSizes[i];
				if (size < 1) size = size * 100 + "%";
				html.append("<col width=", size, ">\r");
			}
			html.append("</colgroup>\r");
		}
		html.append("<tbody>\r");
	}
	form.outputItemList(this.getItems(), this, html, updateScript,"", this.getNumCols(), 0, true);
	html.append("</table>");	

	
//	DBG.dumpObj(html.toString());
	element.innerHTML = html.toString();

	/*if (AjxEnv.isIE) {
		tempDiv.innerHTML = "<table>" + html.toString() + "</table>";
		var rows = tempDiv.getElementsByTagName("table")[0].rows;
		for (var r = 0; r < rows.length; r++) {
			tbody.appendChild(rows[r]);
		}
	} else {
		var row = table.insertRow(-1);
		var cell = row.insertCell(-1);
		cell.innerHTML = html;
	}*/

		
	// update the insert and update scripts so they'll be called next time
	form.appendToUpdateScript(updateScript);
	this.deferred = false;		
	// Since this is being called in the middle of update, 
	//	any items that need to be inserted won't have been, 
	//  and we won't have updated the items required.  
	// Handle this now.

	//TODO: PUT this IN THE CORRECT PLACE BY PARSING THE STRING SOMEHOW???
	form.tempScript = new Function(form.getUpdateScriptStart() + updateScript + form.getUpdateScriptEnd());
	form.tempScript();
	delete form.tempScript;
}



/**
* @class defines XFormItem type _TOP_GROUPER_
* Draws a simple border around the group, with the label placed over the border
* @contructor
**/
function TopGrouper_XFormItem() {}
XFormItemFactory.createItemType("_TOP_GROUPER_", "top_grouper", TopGrouper_XFormItem, RadioGrouper_XFormItem)
TopGrouper_XFormItem.prototype.borderCssClass = "xform_top_grouper_border";

// output the label
TopGrouper_XFormItem.prototype.outputHTMLStart = function (html, updateScript, indent, currentCol) {
	html.append(
			"<div class=", this.getBorderCssClass(), ">",
				"<div ", this.getLabelCssString(),">", this.getLabel(), "</div>",
				"<div class=", this.getInsetCssClass(),">"
		);
}

TopGrouper_XFormItem.prototype.outputHTMLEnd = function (html, updateScript, indent, currentCol) {
	html.append(
			"</div></div>"
		);
}




/**
* @class defines XFormItem type _SWITCH_
* @contructor
**/
function Switch_XFormItem() {}
XFormItemFactory.createItemType("_SWITCH_", "switch", Switch_XFormItem, Group_XFormItem)

//	type defaults
Switch_XFormItem.prototype.labelLocation = _NONE_;
Switch_XFormItem.prototype.colSpan = "*";
Switch_XFormItem.prototype.width = "100%";
Switch_XFormItem.prototype.numCols = 1;


/**
* @class defines XFormItem type _REPEAT_
* @contructor
**/
function Repeat_XFormItem() {}
XFormItemFactory.createItemType("_REPEAT_", "repeat", Repeat_XFormItem, Group_XFormItem)

//	type defaults
Repeat_XFormItem.prototype.useParentTable = false;
Repeat_XFormItem.prototype.writeElementDiv = true;
Repeat_XFormItem.prototype.numCols = 1;
Repeat_XFormItem.prototype.number = 1;
Repeat_XFormItem.prototype.showRemoveButton = true;
Repeat_XFormItem.prototype.showAddButton = true;
Repeat_XFormItem.prototype.alwaysShowAddButton = false;
Repeat_XFormItem.prototype.showMoveUpButton = false;
Repeat_XFormItem.prototype.showMoveDownButton = false;

Repeat_XFormItem.prototype.getRemoveButton = function () {
	if(!this.removeButton) {
		this.removeButton = {
			type:_BUTTON_, 
			label: AjxMsg.xformRepeatRemove, 
			//width:20,
			cssStyle:"margin-left:20px;",
			onActivate:function (event) {
				var repeatItem = this.getParentItem().getParentItem();
				repeatItem.removeRowButtonClicked(this.getParentItem().instanceNum);
			},
			relevantBehavior:_HIDE_,
			relevant: "item.__parentItem.getInstanceCount() != 0"
		};
		var label = this.getInheritedProperty("removeButtonLabel");
		if(label)
			this.removeButton.label = label;
	}
	return this.removeButton;	
}

Repeat_XFormItem.prototype.getAddButton = function () {
	if(!this.addButton) {
		var showAddOnNextRow = this.getInheritedProperty("showAddOnNextRow");
		this.addButton = {
			ref:".",
			type:_BUTTON_, 
			label: AjxMsg.xformRepeatAdd, 
			onActivate:function (event) {
				var repeatItem = this.getParentItem().getParentItem();
				repeatItem.addRowButtonClicked(this.getParentItem().instanceNum);
			},
			relevantBehavior:_HIDE_,
			forceUpdate:true
		};
		var label = this.getInheritedProperty("addButtonLabel");
		if(label)
			this.addButton.label = label;			
			
		if(showAddOnNextRow) {
			this.addButton.colSpan = "*";
		}
			
	}
	return this.addButton;	
}

Repeat_XFormItem.prototype.moveUpButton = {
	type:_BUTTON_, 
	label:"^", 
	width:20,
	cssStyle:"margin-left:20px;",
	onActivate:function (event) {
		var repeatItem = this.getParentItem().getParentItem();
		repeatItem.moveUpButtonClicked(this.getParentItem().instanceNum);
	}
}
Repeat_XFormItem.prototype.moveDownButton = {
	ref:".",
	type:_BUTTON_, 
	label:"v", 
	width:20,
	onActivate:function (event) {
		var repeatItem = this.getParentItem().getParentItem();
		repeatItem.moveDownButtonClicked(this.getParentItem().instanceNum);
	},
	relevantBehavior:_HIDE_,
	relevant:"(item.getInstanceCount()-1) == item.__parentItem.instanceNum",
	forceUpdate:true
}


Repeat_XFormItem.prototype.initializeItems = function () {
	var items = this.getItems();

	if (items.length == 1 && items[0].items) {
		var group = items[0];
	} else {
		var group = {	
				ref: this.getRef(), 
				fromRepeat:true, 
//				useParentTable:true,
				type:_GROUP_, 
				numCols: items.length,
				items:[].concat(items)
			};
	}
	
//	group.useParentTable = true;
	group.colSpan = 1;

	var relevant = "(item.instanceNum < " + this.getNumberToShow() + ") || "+
				   "(item.instanceNum < item.getInstanceCount())";
	group.relevant = relevant;
	
	//Check if we have an explicit condition defined for Remove button
	
	// add the add and remove buttons to the original items array, if appropriate
	if (this.getShowRemoveButton()) {
		var button = this.getRemoveButton();
			
		var removeButtonRelevant = this.cacheInheritedProperty("remove_relevant","_remove_relevant");
		if(removeButtonRelevant) {
			button.relevant = removeButtonRelevant;
		} 
		group.items[group.items.length] = button;
		group.numCols++;			
	}
	if (this.getShowAddButton()) {
		var button = this.getAddButton();
	
		var showAddOnNextRow = this.getInheritedProperty("showAddOnNextRow");
		if (!this.getAlwaysShowAddButton()) {
			button.relevant = "(item.getInstanceCount()-1) == item.__parentItem.instanceNum";
		}
		group.items[group.items.length] = button;
		if(showAddOnNextRow) {
			group.items[group.items.length] = {type:_SPACER_, colSpan:(group.numCols-1), relevant:"(item.getInstanceCount()-1) == item.__parentItem.instanceNum"};
		} else {
			group.numCols++;
		}
	}
	if (this.getShowMoveUpButton()) {
		group.items[group.items.length] = this.getMoveUpButton();
		group.numCols++;
	}
	if (this.getShowMoveDownButton()) {
		group.items[group.items.length] = this.getMoveDownButton();
		group.numCols++;
	}

	// save off the original items in the group
	this.__originalItems = group;
	// and reset the items array
	this.items = [];
}

Repeat_XFormItem.prototype.makeRepeatInstance = function() {
	// NOTE: We always append the new items to the end, which is OK,
	//			since if a *data value* is inserted in the middle,
	//			each row will show the proper thing when the update script is called
	//
	//  NOTE: XFORMS SPEC REQUIRES REPEAT ITEMS TO START AT 1, this implementation starts at 0!!!
	//
	var originalGroup = this.__originalItems;
	var numCols = this.getNumCols();
	var newItems = [];
	
	for (var i = 0; i < numCols; i++) {
		var instanceNum = this.items.length;
	
		originalGroup.refPath = this.getRefPath() + "[" + instanceNum + "]";
	
		// initialize the originalGroup and its cloned items
		groupItem = this.getForm().initItem(originalGroup, this);
		groupItem.instanceNum = instanceNum;
	
		newItems.push(groupItem);
		this.items.push(groupItem);
	}	
	return newItems;
}


Repeat_XFormItem.prototype.outputHTML = function (html, updateScript, indent, currentCol) {
	// output one item to start
	//	all other items will be output dynamically
	this.makeRepeatInstance();
	this.getForm().outputItemList(this.items, this, html, updateScript, indent,this.getNumCols(), 0);
}


Repeat_XFormItem.prototype.updateElement = function (value) {
	var form = this.getForm();
	
	var element = this.getElement();
	if (value == null || value === "") value = [];
	var itemsToShow = Math.max(value.length, this.getNumberToShow());
	var slotsPresent = this.items.length;

	var masterId = this.getId();
	if (itemsToShow > slotsPresent) {
		var missingElementCount = (itemsToShow - slotsPresent);
		// create some more slots and show them

		var table = element.getElementsByTagName("table")[0];
		var tbody = element.getElementsByTagName("tbody")[0];
	
		var tempDiv;	
		if (AjxEnv.isIE) {
			tempDiv = this.createElement("temp",null,"div","");
			tempDiv.display = "none";
		}
		var updateScript = new AjxBuffer();
		while (this.items.length < itemsToShow) {
			var newItems = this.makeRepeatInstance(this);
			var html = new AjxBuffer();
			form.outputItemList(newItems, this, html, updateScript, "", this.getNumCols(), 0, true);
			if (AjxEnv.isIE) {
				tempDiv.innerHTML = "<table>" + html.toString() + "</table>";
				var rows = tempDiv.getElementsByTagName("table")[0].rows;
				for (var r = 0; r < rows.length; r++) {
					tbody.appendChild(rows[r]);
				}
			} else {
				var row = table.insertRow(-1);
				row.innerHTML = html;
			}
		}
		
		// update the insert and update scripts so they'll be called next time
		form.appendToUpdateScript(updateScript);
		
		// Since this is being called in the middle of update, 
		//	any items that need to be inserted won't have been, 
		//  and we won't have updated the items required.  
		// Handle this now.

		//TODO: PUT this IN THE CORRECT PLACE BY PARSING THE STRING SOMEHOW???
		form.tempScript = new Function(form.getUpdateScriptStart() + updateScript + form.getUpdateScriptEnd());
		form.tempScript();
		delete form.tempScript;
	}
}





Repeat_XFormItem.prototype.addRowButtonClicked = function (instanceNum) {
	var path = this.getRefPath();
	this.getModel().addRowAfter(this.getInstance(), path, instanceNum);
	this.getForm().refresh();
}

Repeat_XFormItem.prototype.removeRowButtonClicked = function (instanceNum) {
	if (this.getOnRemoveMethod() ) {
		this.getOnRemoveMethod().call(this, instanceNum, this.getForm())
	} else {
		var path = this.getRefPath();
		this.getModel().removeRow(this.getInstance(), path, instanceNum);
	}
	this.getForm().refresh();	
}

Repeat_XFormItem.prototype.getOnRemoveMethod = function() {
	return this.cacheInheritedMethod("onRemove","$onRemove","index,form");
}


/**
* @class defines XFormItem type _REPEAT_GRID_
* @contructor
**/
function Repeat_Grid_XFormItem() {}
XFormItemFactory.createItemType("_REPEAT_GRID_", "repeat_grid", Repeat_Grid_XFormItem, Repeat_XFormItem)
Repeat_Grid_XFormItem.prototype.showRemoveButton = false;
Repeat_Grid_XFormItem.prototype.showAddButton = false;
Repeat_Grid_XFormItem.numCols = 2;





/**
* @class defines XFormItem type _COMPOSITE_
* @contructor
**/
function Composite_XFormItem() {}
XFormItemFactory.createItemType("_COMPOSITE_", "composite", Composite_XFormItem, Group_XFormItem)

//	type defaults
Composite_XFormItem.prototype.useParentTable = false;
Composite_XFormItem.prototype.tableCssClass = "xform_composite_table";
Composite_XFormItem.prototype.focusable = false;

Composite_XFormItem.prototype.initializeItems = function () {
	var items = this.getItems();
	if (items == null) return;
	
	// make sure the numCols is defined (default to the number of items in the composite)
	if (this.numCols == null) this.numCols = items.length;
	
	// actually instantiate them as formItems
	this.items = this.getForm().initItemList(items, this);
}

Composite_XFormItem.onFieldChange = function(value, event, form) {
	if (this.getParentItem() && this.getParentItem().getOnChangeMethod()) {
		return this.getParentItem().getOnChangeMethod().call(this, value, event, form);
	} else {
		return this.setInstanceValue(value);
	}
}

//Composite_XFormItem.prototype.getErrorContainer = function () {
//	
//}









/**
* @class defines XFormItem type _DATE_
* @contructor
**/
function Date_XFormItem() {}
XFormItemFactory.createItemType("_DATE_", "date", Date_XFormItem, Composite_XFormItem)

//	type defaults
Date_XFormItem.prototype.DATE_MONTH_CHOICES = [
				{value:1, label:I18nMsg.monthJanMedium},
				{value:2, label:I18nMsg.monthFebMedium},
				{value:3, label:I18nMsg.monthMarMedium},
				{value:4, label:I18nMsg.monthAprMedium},
				{value:5, label:I18nMsg.monthMayMedium},
				{value:6, label:I18nMsg.monthJunMedium},
				{value:7, label:I18nMsg.monthJulMedium},
				{value:8, label:I18nMsg.monthAugMedium},
				{value:9, label:I18nMsg.monthSepMedium},
				{value:10, label:I18nMsg.monthOctMedium},
				{value:11, label:I18nMsg.monthNovMedium},
				{value:12, label:I18nMsg.monthDecMedium}
			];
Date_XFormItem.prototype.DATE_DAY_CHOICES = ["1","2","3","4","5","6","7","8","9","10","11","12",
						  "13","14","15","16","17","18","19","20","21","22",
						  "23","24","25","26","27","28","29","30","31"];
Date_XFormItem.prototype.numCols = 3;
Date_XFormItem.prototype.items = [
	{	type:_SELECT1_, 
		ref:".",
		width:50,
		valign:_MIDDLE_,
		relevantBehavior:_PARENT_,
		choices: Date_XFormItem.prototype.DATE_MONTH_CHOICES,
		labelLocation:_NONE_,
		getDisplayValue:function (newValue) {
			if (!(newValue instanceof Date)) newValue = new Date();
			return "" + (newValue.getMonth() + 1);
		},
		elementChanged:function (monthStr, currentDate, event) {
			if (currentDate == null) currentDate = new Date();	//??? should get values of other field???
		
			var month = parseInt(monthStr);
			if (!isNaN(month)) {
				month -= 1;
				currentDate.setMonth(month);
			}
			this.getForm().itemChanged(this.getParentItem(), currentDate, event);
		}
	},
	{	type:_SELECT1_, 
		ref:".",
		width:50,
		valign:_MIDDLE_,
		relevantBehavior:_PARENT_,
		labelLocation:_NONE_,
		choices: Date_XFormItem.prototype.DATE_DAY_CHOICES,
		getDisplayValue:function (newValue) {
			if (!(newValue instanceof Date)) newValue = new Date();
			return "" + newValue.getDate();
		},
		elementChanged: function (dateStr, currentDate, event) {
			if (currentDate == null) currentDate = new Date();	//??? should get values of other field???
		
			var date = parseInt(dateStr);
			if (!isNaN(date)) {
				currentDate.setDate(date);
			}
			this.getForm().itemChanged(this.getParentItem(), currentDate, event);
		}
	},
	{	type:_TEXTFIELD_, 
		ref:".",
		relevantBehavior:_PARENT_,
		width:45,
		labelLocation:_NONE_,

		getDisplayValue:function (newValue) {
			if (!(newValue instanceof Date)) newValue = new Date();
			return "" + newValue.getFullYear();
		},
		elementChanged: function (yearStr, currentDate, event) {
			if (currentDate == null) currentDate = new Date();	//??? should get values of other field???
		
			var year = parseInt(yearStr);
			if (!isNaN(year)) {
				currentDate.setYear(year);
			}
			this.getForm().itemChanged(this.getParentItem(), currentDate, event);
		}

	}
];



/**
* @class defines XFormItem type _TIME_
* @contructor
**/
function Time_XFormItem() {}
XFormItemFactory.createItemType("_TIME_", "time", Time_XFormItem, Composite_XFormItem)

//	type defaults
Time_XFormItem.prototype.numCols = 3;
Time_XFormItem.prototype.TIME_HOUR_CHOICES = ["1","2","3","4","5", "6","7","8","9","10","11","12"];
Time_XFormItem.prototype.TIME_MINUTE_CHOICES = ["00","05","10","15","20","25", "30","35","40","45","50","55"];
Time_XFormItem.prototype.TIME_AMPM_CHOICES = [I18nMsg.periodAm,I18nMsg.periodPm];


Time_XFormItem.prototype.items = [
	{	
		type:_SELECT1_, 
		ref:".",
		width:50,
		valign:_MIDDLE_,
		choices: Time_XFormItem.prototype.TIME_HOUR_CHOICES,
		labelLocation:_NONE_,
		getDisplayValue:function (newValue) {
			if (!(newValue instanceof Date)) newValue = new Date();
			var hours = "" + (newValue.getHours() % 12);
			if (hours == "0") hours = "12";
			return hours;
		},
		elementChanged:function (hoursStr, currentDate, event) {
			if (currentDate == null) currentDate = new Date();	//??? should get values of other fields???
			if (this.__dummyDate == null) {
				this.__dummyDate = new Date();
			}
			this.__dummyDate.setTime(currentDate.getTime());
			var hours = parseInt(hoursStr);
			if (!isNaN(hours)) {
				if (hours == 12) hours = 0;
				var wasPM = (currentDate.getHours() > 11);
				if (wasPM) hours += 12;
				this.__dummyDate.setHours(hours);
			}
			var parentItem = this.getParentItem();
			if (parentItem.$elementChanged != null) {
				this.getParentItem().$elementChanged(this.__dummyDate, currentDate, event);
			} else {
				this.getForm().itemChanged(this.getParentItem(), this.__dummyDate, event);
			}
		}
	},

	{	
		type:_SELECT1_, 
		ref:".",
		width:50,
		valign:_MIDDLE_,
		choices: Time_XFormItem.prototype.TIME_MINUTE_CHOICES,
		labelLocation:_NONE_,
		getDisplayValue:function (newValue) {
			if (!(newValue instanceof Date)) newValue = new Date();
			var minutes = newValue.getMinutes();
			minutes = Math.round(minutes / 5) * 5;
			minutes = (minutes < 10 ? "0" + minutes : "" + minutes);
			return minutes;
		},
		elementChanged:function (minutesStr, currentDate, event) {
			if (currentDate == null) currentDate = new Date();	//??? should get values of other fields???
			if (this.__dummyDate == null) {
				this.__dummyDate = new Date();
			}
			this.__dummyDate.setTime(currentDate.getTime());
		
			var minutes = parseInt(minutesStr);
			if (!isNaN(minutes)) {
				this.__dummyDate.setMinutes(minutes);
			}
			var parentItem = this.getParentItem();
			if (parentItem.$elementChanged != null) {
				this.getParentItem().$elementChanged(this.__dummyDate, currentDate, event);
			} else {
				this.getForm().itemChanged(this.getParentItem(), this.__dummyDate, event);
			}
		}
	},
	
	{	
		type:_SELECT1_, 
		ref:".",
		choices: Time_XFormItem.prototype.TIME_AMPM_CHOICES,
		width:50,
		valign:_MIDDLE_,
		labelLocation:_NONE_,
		getDisplayValue:function (newValue) {
			if (!(newValue instanceof Date)) newValue = new Date();
			var hours = newValue.getHours();
			if (hours > 11) return I18nMsg.periodPm;
			return I18nMsg.periodAm;
		},
		elementChanged:function (ampmStr, currentDate, event) {
			if (currentDate == null) currentDate = new Date();	//??? should get values of other fields???
			if (this.__dummyDate == null) {
				this.__dummyDate = new Date();
			}
			this.__dummyDate.setTime(currentDate.getTime());

			var isPM = (ampmStr == I18nMsg.periodPm);
			var hours = currentDate.getHours() % 12;
			
			this.__dummyDate.setHours(hours + (isPM ? 12 : 0));
			var parentItem = this.getParentItem();
			if (parentItem.$elementChanged != null) {
				this.getParentItem().$elementChanged(this.__dummyDate, currentDate, event);
			} else {
				this.getForm().itemChanged(this.getParentItem(), this.__dummyDate, event);
			}
		}
	}
];




/**
* @class defines XFormItem type _DATETIME_
* @contructor
**/
function Datetime_XFormItem() {}
XFormItemFactory.createItemType("_DATETIME_", "datetime", Datetime_XFormItem, Composite_XFormItem)

Datetime_XFormItem._datetimeFormatToItems = function(format, dateItem, timeItem) {
	var items = [];
	var pattern = /{(\d+),\s*(date|time)}/;
	var index = 0;
	while ((index = format.search(pattern)) != -1) {
		if (index > 0) {
			var item = { type: _OUTPUT_, value: format.substring(0,index), valign: _CENTER_ };
			items.push(item);
			format = format.substring(index);
		}
		var result = pattern.exec(format);
		items.push(result[2] == "date" ? dateItem : timeItem);
		format = format.substring(result[0].length);
	}
	if (format.length > 0) {
		var item = { type:_OUTPUT_, value: format };
		items.push(item);
	}
	return items;
}

//	type defaults
Datetime_XFormItem.prototype.numCols = 3;
Datetime_XFormItem.prototype.items = Datetime_XFormItem._datetimeFormatToItems(
	AjxMsg.xformDateTimeFormat,
	{type:_DATE_, ref:".", labelLocation:_NONE_},
	{type:_TIME_, ref:".", labelLocation:_NONE_}
);

/**
* @class defines XFormItem type _WIDGET_ADAPTOR_
*	An adaptor for using any random (non-DWT) widget in an xform
*	NOTE: the generic implementation assumes:
*			1) you'll create a method called "constructWidget()" which will construct the appropriate widget
*			2) the widget has a function "insertIntoXForm(form, item, element)"
*				(overide "this.insertWidget" to change)
*			3) the widget has a function "updateInXForm(form, item, value, element)"
*				(overide "this.updateWidget" to change)
*
* @contructor
**/


function WidgetAdaptor_XFormItem() {}
XFormItemFactory.createItemType("_WIDGET_ADAPTOR_", "widget_adaptor", WidgetAdaptor_XFormItem, XFormItem)

//	type defaults
WidgetAdaptor_XFormItem.prototype.writeElementDiv = true;
WidgetAdaptor_XFormItem.prototype.focusable = false;
//	methods

// implement the following to actually construct the instance of your widget
WidgetAdaptor_XFormItem.prototype.constructWidget = function () {}


//
//	insertElement must guarantee that each element is only inserted ONCE
//
WidgetAdaptor_XFormItem.prototype.insertElement = function (newValue) {
	if (!this.__alreadyInserted) {
		this.__alreadyInserted = true;
		
		// try to construct a widget
		var widget = this.constructWidget();

		// if we didn't get one, there's nothing to do here
		if (widget == null) return;

		// otherwise insert it into the form!
		this.widget = widget;
		this.insertWidget(this.getForm(), this.widget, this.getElement());
	}
}


WidgetAdaptor_XFormItem.prototype.insertWidget = function (form, widget, element) {
	this.widget.insertIntoXForm(form, this, element);
}

WidgetAdaptor_XFormItem.prototype.updateElement = function(newValue) {
	this.updateWidget(newValue);
}
WidgetAdaptor_XFormItem.prototype.updateWidget = function (newValue) {
	this.widget.updateInXForm(this.getForm(), this, newValue, this.getElement());
}





/**
* @class defines XFormItem type _DWT_ADAPTOR_"
*
*	An adaptor for using any random DWT widget in an xform
*
*	NOTE: the generic implementation assumes:
*			1) you'll create a method called "constructWidget()" which will construct the appropriate widget
*			2) you'll adapt "insertWidget(form,  widget, element)" to insert the widget properly
*			3) you'll adapt "updateWidget(newValue)" to update the value properly
* @contructor
**/
function Dwt_Adaptor_XFormItem() {}
XFormItemFactory.createItemType("_DWT_ADAPTOR_", "dwt_adaptor", Dwt_Adaptor_XFormItem, WidgetAdaptor_XFormItem)

//	type defaults
Dwt_Adaptor_XFormItem.prototype.focusable = false;
//	methods

Dwt_Adaptor_XFormItem.prototype.setElementEnabled = function(enabled) {
	WidgetAdaptor_XFormItem.prototype.setElementEnabled.call(this, enabled);
	if (this.widget) {
		this.widget.setEnabled(enabled);
	}
	this._enabled = enabled;
}

// implement the following to actually construct the instance of your widget
Dwt_Adaptor_XFormItem.prototype.constructWidget = function () {}


Dwt_Adaptor_XFormItem.prototype.insertWidget = function (form, widget, element) {
	this.getForm()._reparentDwtObject(widget, element);
}

Dwt_Adaptor_XFormItem.prototype.updateWidget = function (newValue) {}

Dwt_Adaptor_XFormItem.prototype.getDwtSelectItemChoices = function () {
	if (this.__selOption != null) return this.__selOptions;
	
	var selectOptions = null;
	var choices = this.getChoices();
	if (choices != null) {
		var selectOptions = new Array(choices.length);
		for (var i = 0; i < choices.length; i++) {
			var choice = choices[i];
			var choiceValue = (choice instanceof Object ? choice.value : choice);
			var choiceLabel = (choice instanceof Object ? choice.label : choice);
			selectOptions[i] = new DwtSelectOptionData(choiceValue, choiceLabel);
		}
	}
	this.__selOptions = selectOptions;
	return this.__selOptions;
};

Dwt_Adaptor_XFormItem.prototype._addCssStylesToDwtWidget = function () {
	var style = this.getCssStyle();
	if (style != null){
		var styleArr = style.split(";");
		var el = this.widget.getHtmlElement();
		var kp;
		for (var i = 0 ; i < styleArr.length ; ++i ){
			kp = styleArr[i].split(":");
			if (kp.length > 0){
				var key = kp[0];
				if (key != null) {
					key = key.replace(/^(\s)*/,"");
				}
				if (key == "float"){
					key = (AjxEnv.isIE)? "styleFloat": "cssFloat";
				}
				var val = kp[1];
				if (val != null) {
					el.style[key] = val.replace(/^(\s)*/,"");
				}
			}
		}
	}
};

/**
* @class defines XFormItem type  _DWT_BUTTON_
* Adapts a DwtButton to work with the XForm
* @constructor
**/
function Dwt_Button_XFormItem() {}
XFormItemFactory.createItemType("_DWT_BUTTON_", "dwt_button", Dwt_Button_XFormItem, Dwt_Adaptor_XFormItem)

//	type defaults
Dwt_Button_XFormItem.prototype.labelLocation = DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_CENTER;
Dwt_Button_XFormItem.prototype.writeElementDiv = false;
//	methods

Dwt_Button_XFormItem.prototype.insertWidget = function (form, widget, element) {
	this.getForm()._reparentDwtObject(widget, this.getContainer());
};

// implement the following to actually construct the instance of your widget
Dwt_Button_XFormItem.prototype.constructWidget = function () {
	var widget = this.widget = new DwtButton(this.getForm(), this.getLabelLocation(), this.getCssClass());
	var height = this.getHeight();
	var width = this.getWidth();
	
	var el = null;
	if (width != null || height != null){
		el = widget.getHtmlElement();
		if (width != null) el.style.width = width;
		if (height != null) el.style.height = height;
	} 
	this._addCssStylesToDwtWidget();
	
	var icon = this.getInheritedProperty("icon");
	if(icon != null) {
		widget.setImage(icon);
	}
	
	var disIcon = this.getInheritedProperty("disIcon");
	if(disIcon != null) {
		widget.setDisabledImage(disIcon);
	}
		
	var toolTipContent = this.getInheritedProperty("toolTipContent");
	if(toolTipContent != null) {
		widget.setToolTipContent(toolTipContent);
	}
	
	widget.setText(this.getLabel());

	var onActivateMethod = this.getOnActivateMethod();
	if (onActivateMethod != null) {
		var ls = new AjxListener(this, onActivateMethod);
		widget.addSelectionListener(ls);
	}

	if (this._enabled !== void 0) {
		//this.widget = widget;
		this.setElementEnabled(this._enabled);
	}
	
	return widget;
}

Dwt_Button_XFormItem.prototype.getWidget =
function (){
	return this.widget ;
}

/**	
* @class defines XFormItem type _DWT_SELECT_
* Adapts a DwtSelect to work with the XForm
* @contructor
**/
function Dwt_Select_XFormItem() {}
XFormItemFactory.createItemType("_DWT_SELECT_", "dwt_select", Dwt_Select_XFormItem, Dwt_Adaptor_XFormItem)
//XFormItemFactory.registerItemType("_SELECT1_", "select1", Dwt_Select_XFormItem)

//	type defaults
Dwt_Select_XFormItem.prototype.writeElementDiv = false;
//	methods

Dwt_Select_XFormItem.prototype.insertWidget = function (form, widget, element) {
	this.getForm()._reparentDwtObject(widget, this.getContainer());
}

Dwt_Select_XFormItem.prototype.constructWidget = function () {
	var choices = this.getDwtSelectItemChoices(this.getChoices());

	var widget = this.widget = new DwtSelect(this.getForm(), choices);
	var height = this.getHeight();
	var width = this.getWidth();
	if (width != null || height != null){
		var el = widget.getHtmlElement();
		if (width != null) el.style.width = width;
		if (height != null) el.style.height = height;
	} 
	this._addCssStylesToDwtWidget();

	var onChangeFunc = new Function("event", 
			"var widget = event._args.selectObj;\r"
		  + "value = event._args.newValue; " + this.getExternalChangeHandler()
	);
	var ls = new AjxListener(this.getForm(), onChangeFunc);
	widget.addChangeListener(ls);

	if (this._enabled !== void 0) {
		//this.widget = widget;
		this.setElementEnabled(this._enabled);
	}
	return widget;
}

Dwt_Select_XFormItem.prototype.updateWidget = function (newValue) {
	this.widget.setSelectedValue(newValue);
}

Dwt_Select_XFormItem.prototype.setElementEnabled = function (enable) {
	this._enabled = enable;
	if (this.widget == null) return;
	if (enable) {
		this.widget.enable();
	} else {
		this.widget.disable();
	}
};




/**	
* @class defines XFormItem type _DWT_DATE_
* Adapts a DwtDate to work with the XForm
* @contructor
**/
function Dwt_Date_XFormItem() {}
XFormItemFactory.createItemType("_DWT_DATE_", "dwt_date", Dwt_Date_XFormItem, Dwt_Adaptor_XFormItem)


//	type defaults
Dwt_Date_XFormItem.prototype.cssStyle = "width:80px;";


//	methods

Dwt_Date_XFormItem.prototype.constructWidget = function () {

	var widget = new DwtButton(this.getForm());
	widget.setActionTiming(DwtButton.ACTION_MOUSEDOWN);

	// ONE MENU??
	var menu = this.menu = new DwtMenu(widget, DwtMenu.CALENDAR_PICKER_STYLE, null, null, this.getForm());
	widget.setMenu(menu, true)
	menu.setAssociatedObj(widget);

	// For now, create a new DwtCalendar for each of the buttons, since on
	// IE, I'm having trouble getting the one calendar to work.
	// TODO: Figure out the IE problem.
	var cal = new DwtCalendar(menu);
	cal._invokingForm = this.getForm();
	cal._invokingFormItemId = this.getId();
	cal.addSelectionListener(new AjxListener(this, this._calOnChange));
	widget.__cal = cal;
	
	// create a static instance of DwtCalendar that all instances will show
	//if (window.DwtCalendar && (this.constructor._calendarPopup == null)) {
		// DO WE NEED TO CONSTRUCT A MENU HERE FIRST???
		//	CAN THE MENU BE SHARED???
	//	var cal = this.constructor._calendarPopup = new DwtCalendar(menu);
	//	cal.addSelectionListener(new AjxListener(this, this._calOnChange));
	//}

	// We have to add listeners both for the drop down cell, and 
	// the button proper, to get notified when any part of the 
	// button is hit.
	//widget.addSelectionListener(new AjxListener(this, this._prePopup));
	//widget.addDropDownSelectionListener(new AjxListener(this, this._prePopup));
	// NOTE: WHEN THE BUTTON IS PRESSED, WE WANT TO CALL:
	//var cal = this.constructor._calendarPopup;
	//cal.setDate(this.widget._date, true);
	//cal._invokingForm = this.getForm();
	//cal._invokingFormItemId = this.getId();
	//cal.reparent(event.item.getMenu());
	//	THEN SHOW THE THING... ???

	return widget;
}

Dwt_Date_XFormItem.prototype.updateWidget = function (newValue) {
	if (newValue == null) newValue = new Date();
	this.widget.setText(this.getButtonLabel(newValue));
	this.widget._date = newValue;
	this.widget.__cal.setDate(newValue,true);
};

Dwt_Date_XFormItem.prototype._calOnChange = function (event) {
	var value = event.detail;
	var cal = event.item;
	var elemChanged = this.getElementChangedMethod();
	elemChanged.call(this,value, this.getInstanceValue(), event);	
};

Dwt_Date_XFormItem.prototype._prePopup = function (event) {
	var cal = this.constructor._calendarPopup;
	cal.setDate(this.widget._date, true);
	cal._invokingForm = this.getForm();
	cal._invokingFormItemId = this.getId();
	cal.reparent(event.item.getMenu());
	event.item._toggleMenu();
};

Dwt_Date_XFormItem.prototype.getButtonLabel = function (newValue) {
	if (newValue == null || !(newValue instanceof Date)) return "";
	return (newValue.getMonth()+1) + "/" + newValue.getDate() + "/" + (newValue.getFullYear());
};


function Dwt_Time_XFormItem() {
	this.items[0].type = _DWT_SELECT_;
	this.items[0].errorLocation = _INHERIT_;
	this.items[1].type = _DWT_SELECT_;
	this.items[1].errorLocation = _INHERIT_;
	this.items[1].choices = Dwt_Time_XFormItem.TIME_MINUTE_CHOICES;
	this.items[1].getDisplayValue = function (newValue) {
		if (!(newValue instanceof Date)) newValue = new Date();
		var ret = AjxDateUtil._pad(AjxDateUtil.getRoundedMins(newValue, 15));
		return ret;
	};
	this.items[2].type = _DWT_SELECT_;
	this.items[2].errorLocation = _INHERIT_;
}
Dwt_Time_XFormItem.TIME_MINUTE_CHOICES = ["00","15","30","45"];
XFormItemFactory.createItemType("_DWT_TIME_", "dwt_time", Dwt_Time_XFormItem, Time_XFormItem);


/**	
* @class defines XFormItem type _DWT_DATETIME_
* Composes a _DWT_DATE_ and a (non-DWT) _TIME_ to make a date/time editor, just for kicks.
* @contructor
**/
function Dwt_Datetime_XFormItem() {}
XFormItemFactory.createItemType("_DWT_DATETIME_", "dwt_datetime", Dwt_Datetime_XFormItem, Composite_XFormItem)

//	type defaults
Dwt_Datetime_XFormItem.prototype.numCols = 3;
Dwt_Datetime_XFormItem.prototype.useParentTable = false;
Dwt_Datetime_XFormItem.prototype.cssClass =  "xform_dwt_datetime";
Dwt_Datetime_XFormItem.prototype.items = Datetime_XFormItem._datetimeFormatToItems(
	AjxMsg.xformDateTimeFormat,
	{type:_DWT_DATE_, ref:".", labelLocation:_NONE_, errorLocation:_PARENT_,
	 elementChanged: 
	 function (newDate, currentDate, event) {
		 newDate.setHours(currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), 0);
		 this.getParentItem().$elementChanged(newDate, currentDate, event);
	 }
	},
	{type:_DWT_TIME_, ref:".", labelLocation:_NONE_, errorLocation:_PARENT_, 
	 elementChanged:
	 function (newDate, currentDate, event) {
		 this.getParentItem().$elementChanged(newDate, currentDate, event);
	 }
	}
);


/**	
* @class defines XFormItem type _DWT_LIST_
* @contructor
**/
function Dwt_List_XFormItem() {}
XFormItemFactory.createItemType("_DWT_LIST_", "dwt_list", Dwt_List_XFormItem, Dwt_Adaptor_XFormItem)

//	type defaults
Dwt_List_XFormItem.prototype.writeElementDiv = false;
Dwt_List_XFormItem.prototype.widgetClass = DwtListView;

Dwt_List_XFormItem.prototype.getOnSelectionMethod = function() {
	return this.cacheInheritedMethod("onSelection","$onSelection","event");
}


Dwt_List_XFormItem.prototype.constructWidget = function () {
	var headerList = this.getInheritedProperty("headerList");
	var listClass = this.getInheritedProperty("widgetClass");

	var widget = new listClass(this.getForm(), this.getCssClass(), null, headerList);
	var multiselect = this.getInheritedProperty("multiselect");
	if(multiselect != undefined) {
		widget.setMultiSelect(multiselect);
	}
	var width = this.getWidth();
	var height = this.getHeight();
	if(width && height)
		widget.setSize(width, height);
		
	// make sure the user defined listener is called 
	// before our selection listener.
	var selMethod = this.getOnSelectionMethod();
	if (selMethod) {
		widget.addSelectionListener(new AjxListener(this, selMethod));
	}

	var localLs = new AjxListener(this, this._handleSelection);
	widget.addSelectionListener(localLs);
	//check if createPopupMenu method is defined
	var createPopupMenumethod = this.cacheInheritedMethod("createPopupMenu","$createPopupMenu","parent");
	if(createPopupMenumethod != null) {
		createPopupMenumethod.call(this, widget);
	}
	
	return widget;
};

Dwt_List_XFormItem.prototype.getSelection = function () {
	return this.widget.getSelection();
};

Dwt_List_XFormItem.prototype._handleSelection = function (event) {
	this.getForm().refresh();
};

Dwt_List_XFormItem.prototype.insertWidget = function (form, widget, element) {
	this.getForm()._reparentDwtObject(widget, this.getContainer());
};

Dwt_List_XFormItem.prototype.updateWidget = function (newValue) {
	if (typeof (newValue) != 'undefined') {
		this.setItems(newValue);
	}
};

Dwt_List_XFormItem.prototype.setItems = function (itemArray){
	var list = this.widget.getList();
	var existingArr = [];
	var tmpArr = new Array();
	if (list) {
		existingArr = list.getArray();
	}
	tmpArr = new Array();
	
	//we have to compare the objects, because XForm calls this method every time an item in the list is selected
	if(itemArray.join() != existingArr.join() ) {
		var preserveSelection = this.getInheritedProperty("preserveSelection");
		var selection = null;
		if(preserveSelection) {
			selection = this.widget.getSelection();
		}		
		var cnt=itemArray.length;
		for(var i = 0; i< cnt; i++) {
			tmpArr.push(itemArray[i]);		
		}
		this.widget.set(AjxVector.fromArray(tmpArr));
		if(preserveSelection && selection) {
			this.widget.setSelectedItems(selection);
		}
	}
};

Dwt_List_XFormItem.prototype.appendItems = function (itemArray){ 
	this.widget.addItems(itemArray);
};


/**	
* @class defines XFormItem type _BUTTON_GRID_
* @contructor
**/
function Button_Grid_XFormItem() {}
XFormItemFactory.createItemType("_BUTTON_GRID_", "button_grid", Button_Grid_XFormItem, WidgetAdaptor_XFormItem)

//	type defaults
Button_Grid_XFormItem.prototype.numCols = 5;
Button_Grid_XFormItem.prototype.cssClass = "xform_button_grid_medium";
Button_Grid_XFormItem.prototype.forceUpdate = true;


//	methods
Button_Grid_XFormItem.prototype.constructWidget = function () {
	var changeHandler = this.getExternalChangeHandler();
	var attributes = {
		numCols:this.getNumCols(),
		choices:choices.getChoiceObject(),
		cssClass:this.getCssClass(),
		onChange:changeHandler,
		addBracketingCells:(this.getAlign() == _CENTER_)
	}
	var multiple = this.getMultiple();
	if (multiple !== null) attributes.multiple = multiple;
	return new ButtonGrid(attributes);
}


/**	
* @class defines XFormItem type _TAB_BAR_
* A simple tab (for switching a switch)
* @contructor
**/
function Tab_Bar_XFormItem() {}
XFormItemFactory.createItemType("_TAB_BAR_", "tab_bar", Tab_Bar_XFormItem, Button_Grid_XFormItem)

//	type defaults
Tab_Bar_XFormItem.prototype.multiple = false;
Tab_Bar_XFormItem.prototype.cssClass = "xform_button_grid_tab";
Tab_Bar_XFormItem.prototype.align = _CENTER_;
Tab_Bar_XFormItem.prototype.colSpan = "*";

//	methods

Tab_Bar_XFormItem.prototype.constructWidget = function () {
	var changeHandler = this.getExternalChangeHandler();
	var attributes = {
		numCols:this.getNumCols(),
		cssClass:this.getCssClass(),
		onChange:changeHandler,
		addBracketingCells:(this.getAlign() == _CENTER_)
	}

	var choices = this.getChoices();
	if(choices.constructor == XFormChoices) {
		attributes.choices = choices.getChoiceObject();
	} else {
		attributes.choices = choices;
	}
	var multiple = this.getMultiple();
	if (multiple !== null) attributes.multiple = multiple;
	return new ButtonGrid(attributes);
}

Tab_Bar_XFormItem.prototype.initFormItem = function() {
	this.choices = this.getChoices();

	if(!this.choices)
		return;
	if(this.choices.constructor == XFormChoices) {
		var listener = new AjxListener(this, this.dirtyDisplay);
		this.choices.addListener(DwtEvent.XFORMS_CHOICES_CHANGED, listener);	
		this.numCols = this.getChoices().values.length;
	} else {
		this.numCols = this.getChoices().length;
	}
}

Tab_Bar_XFormItem.prototype.dirtyDisplay = function(newChoices) {
	//this.dirtyDisplay();
	if(this.choices.constructor == XFormChoices) {
		this.widget.updateChoicesHTML(this.getNormalizedLabels());	
	}
}

/**	
* @class defines XFormItem type _DWT_ADD_REMOVE_
* @contructor
**/
function Dwt_AddRemove_XFormItem() {}
XFormItemFactory.createItemType("_DWT_ADD_REMOVE_", "add_remove", Dwt_AddRemove_XFormItem, Dwt_Adaptor_XFormItem);

/***
NOTE: this won't work because attributes.ref is accessed before this
method is called in XFormItemFactory#createItem.
Dwt_AddRemove_XFormItem.prototype._setAttributes = function(attributes) {
	// allows "targetRef" alias for "ref" attribute
	if (!attributes.ref && attributes.targetRef) {
		attributes.ref = attributes.targetRef;
	}
	XFormItem.prototype._setAttributes.call(this, attributes);
}
**/
Dwt_AddRemove_XFormItem.prototype.getSorted = function() {
	return this.getInheritedProperty("sorted");
}
Dwt_AddRemove_XFormItem.prototype.getListCssClass = function() {
	return this.getInheritedProperty("listCssClass");
}

Dwt_AddRemove_XFormItem.prototype.getTargetListCssClass = function() {
	return this.getInheritedProperty("targetListCssClass");
}

Dwt_AddRemove_XFormItem.prototype.getSourceInstanceValue = function() {
	var items = this.getModel().getInstanceValue(this.getInstance(), this.getInheritedProperty("sourceRef"));
	return items ? items : [];
}

Dwt_AddRemove_XFormItem.prototype.getTargetInstanceValue = function() {
	var items = this.getInstanceValue();
	return items ? items : [];
}

Dwt_AddRemove_XFormItem.prototype._handleStateChange = function(event) {
	var form = this.getForm();
	var id = this.getId();
	var widget = this.getWidget();
	var value = widget.getTargetItems();
	form.itemChanged(id, value);
}

Dwt_AddRemove_XFormItem.prototype.constructWidget = function() {
	var form = this.getForm();
	var cssClass = this.getCssClass();
	var sourceListCssClass = this.getListCssClass();
	var targetListCssClass = this.getTargetListCssClass();
	var widget = new DwtAddRemove(form, cssClass, null, sourceListCssClass, targetListCssClass);
	return widget;
}

Dwt_AddRemove_XFormItem.prototype.updateWidget = function(newvalue) {
	if (this.widget.isUpdating) {
		this.widget.isUpdating = false;
		return;
	}
	if (this._skipUpdate) {
		return;
	}

	if (this._stateChangeListener) {
		this.widget.removeStateChangeListener(this._stateChangeListener);
	}
	else {
		this._stateChangeListener = new AjxListener(this, Dwt_AddRemove_XFormItem.prototype._handleStateChange)
	}

	var sourceItems = this.getSourceInstanceValue();
	var targetItems = this.getTargetInstanceValue();

	var sorted = this.getSorted();
	if (sorted) {
		sourceItems = sourceItems.sort();
		targetItems = targetItems.sort();
	}

	this.widget.setSourceItems(sourceItems);
	this.widget.removeSourceItems(targetItems);
	this.widget.setTargetItems(targetItems);

	this.widget.addStateChangeListener(this._stateChangeListener);
}

//
// XFormItem class: "alert"
//

function Dwt_Alert_XFormItem() {}
XFormItemFactory.createItemType("_DWT_ALERT_", "alert", Dwt_Alert_XFormItem, Dwt_Adaptor_XFormItem);

Dwt_Alert_XFormItem.prototype.colSpan = "*";
Dwt_Alert_XFormItem.prototype.labelLocation = _NONE_;

Dwt_Alert_XFormItem.prototype.getStyle = function() {
	return this.getInheritedProperty("style");
}
Dwt_Alert_XFormItem.prototype.getIconVisible = function() {
	return this.getInheritedProperty("iconVisible");
}
Dwt_Alert_XFormItem.prototype.getTitle = function() {
	return this.getInheritedProperty("title");
}
Dwt_Alert_XFormItem.prototype.getContent = function() {
	return this.getInheritedProperty("content");
}
Dwt_Alert_XFormItem.prototype.getAlertCssClass = function() {
	return this.getInheritedProperty("alertCssClass");
}

Dwt_Alert_XFormItem.prototype.constructWidget = function() {
	var style = this.getStyle();
	var iconVisible = this.getIconVisible();
	var title = this.getTitle();
	var content = this.getContent();
	var alertCssClass = this.getAlertCssClass();
	
	var form = this.getForm();
	var alert = new DwtAlert(form, alertCssClass);
	
	alert.setStyle(style);
	alert.setIconVisible(iconVisible);
	alert.setTitle(title);
	alert.setContent(content);
	
	return alert;
}

Dwt_Alert_XFormItem.prototype.updateWidget = function(newvalue) {
	// nothing
	var content = this.getContent();
	if(!content && newvalue) {
		this.getWidget().setContent(newvalue);
	}
}

//
// XFormItem class: "dwt_tab_bar"
//

function Dwt_TabBar_XFormItem() {}
XFormItemFactory.createItemType("_DWT_TAB_BAR_", "dwt_tab_bar", Dwt_TabBar_XFormItem, Dwt_Adaptor_XFormItem);
Dwt_TabBar_XFormItem.prototype.colSpan = "*";
Dwt_TabBar_XFormItem.prototype.labelLocation = _NONE_;
// NOTE: Overriding the _TAB_BAR_
XFormItemFactory.registerItemType(_TAB_BAR_, "tab_bar", Dwt_TabBar_XFormItem);

Dwt_TabBar_XFormItem.prototype._value2tabkey;
Dwt_TabBar_XFormItem.prototype._tabkey2value;

Dwt_TabBar_XFormItem.prototype._stateChangeListener;

Dwt_TabBar_XFormItem.prototype.getChoices = function() {
	return this.getInheritedProperty("choices");
}

Dwt_TabBar_XFormItem.prototype._handleStateChange = function(event) {
	var form = this.getForm();
	var widget = this.getWidget();
	
	var tabKey = widget.getCurrentTab();
	var newvalue = this._tabkey2value[tabKey];
	
	var id = this.getId();
	form.itemChanged(id, newvalue);
}

Dwt_TabBar_XFormItem.prototype.constructWidget = function() {
	var form = this.getForm();
	var cssClass = this.getCssClass();
	var btnCssClass = this.getInheritedProperty("buttonCssClass");	
	
	//var widget = new DwtTabView(form, cssClass, DwtControl.STATIC_STYLE);
	var widget = new DwtTabBar(form, cssClass, btnCssClass);
	this._value2tabkey = {};
	this._tabkey2value = {};
	
	var choices = this.getChoices();
	if(choices.constructor == XFormChoices) {
		this.choices = choices;
		var listener = new AjxListener(this, this.dirtyDisplay);
		choices.addListener(DwtEvent.XFORMS_CHOICES_CHANGED, listener);	
		
		var values = this.getNormalizedValues();
		var labels = this.getNormalizedLabels();
		var cnt = values.length;
		for (var i = 0; i < cnt; i++) {
			// NOTE: DwtTabView keeps its own internal keys that are numerical
			this._value2tabkey[values[i]] = i + 1;
			this._tabkey2value[i + 1] = values[i];
	//		var page = new DwtTabViewPage(widget);
			widget.addButton(i+1, labels[i]);
			//widget.addTab(choice.label, page);
		}			
	} else {
		var cnt = choices.length;
		for (var i = 0; i < cnt; i++) {
			var choice = choices[i];
			// NOTE: DwtTabView keeps its own internal keys that are numerical
			this._value2tabkey[choice.value] = i + 1;
			this._tabkey2value[i + 1] = choice.value;
	//		var page = new DwtTabViewPage(widget);
			widget.addButton(i+1, choice.label);
			//widget.addTab(choice.label, page);
		}
	}
	
	return widget;
}

Dwt_TabBar_XFormItem.prototype.updateWidget = function(newvalue) {
	if (this.widget.isUpdating) {
		this.widget.isUpdating = false;
		return;
	}

	if (this._stateChangeListener) {
		this.widget.removeStateChangeListener(this._stateChangeListener);
	}
	else {
		this._stateChangeListener = new AjxListener(this, Dwt_TabBar_XFormItem.prototype._handleStateChange);
	}
	
	var tabKey = this._value2tabkey[newvalue];
	if (tabKey != this.widget.getCurrentTab()) {
		//this.widget.switchToTab(tabKey);
		this.widget.openTab(tabKey);
	}

	this.widget.addStateChangeListener(this._stateChangeListener);
}

Dwt_TabBar_XFormItem.prototype.dirtyDisplay = function() {
	if(this.choices && this.choices.constructor == XFormChoices) {
		var labels = this.getNormalizedLabels();
		var values = this.getNormalizedValues();
		var cnt = labels.length;
		for(var i=0;i<cnt;i++) {
			var tabKey = this._value2tabkey[values[i]];
			if(tabKey) {
				var btn = this.widget.getButton(tabKey);
				if(btn) {
					btn.setText(labels[i]);
				}
			}
		}
	}
	this._choiceDisplayIsDirty = true;
	delete this.$normalizedChoices;	
}

//
// XFormItem class: "alert"
//

function Dwt_ProgressBar_XFormItem() {}
XFormItemFactory.createItemType("_DWT_PROGRESS_BAR_", "dwt_progress_bar", Dwt_ProgressBar_XFormItem, Dwt_Adaptor_XFormItem);

Dwt_ProgressBar_XFormItem.prototype.constructWidget = function() {
	var form = this.getForm();
	var widget = new DwtProgressBar(form, null);
	var maxvalue = this.getInheritedProperty("maxValue");
	if(!maxvalue) {
		this.maxValueRef = this.getInheritedProperty("maxValueRef");
		maxvalue = this.getModel().getInstanceValue(this.getInstance(), this.maxValueRef)
	}
	widget.setMaxValue(maxvalue);
	
	var progressCssClass = this.getInheritedProperty("progressCssClass");
	if(progressCssClass) {
		widget.setProgressCssClass(progressCssClass);
	}
	
	var wholeCssClass = this.getInheritedProperty("wholeCssClass");
	if(wholeCssClass) {
		widget.setWholeCssClass(wholeCssClass);
	}	
	return widget;
}

Dwt_ProgressBar_XFormItem.prototype.updateWidget = function(newvalue) {
	// nothing
//	var maxValueRef = this.getInheritedProperty("maxValueRef");
	if(!newvalue)
		newvalue=0;
	if(this.maxValueRef) {
		maxvalue = this.getModel().getInstanceValue(this.getInstance(), this.maxValueRef)
		this.getWidget().setMaxValue(maxvalue);	
	}
	this.getWidget().setValue(newvalue);
}