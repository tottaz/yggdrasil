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


/**
* @class OSelect1_XFormItem class -- lightning fast SELECT type widget
* @constructor
* @author Owen Williams, Greg Solovyev
**/
function OSelect1_XFormItem(){ this._enabled = true; }
XFormItemFactory.createItemType("_OSELECT1_", "oselect1", OSelect1_XFormItem, Select1_XFormItem);

OSelect1_XFormItem._mouseWheelEventAttached = false;
OSelect1_XFormItem._mouseWheelCurrentSelect;
OSelect1_XFormItem._mouseWheelHideMenu = function() {
	OSelect1_XFormItem._mouseWheelCurrentSelect.hideMenu();
};

// override the default SELECT type
//XFormItemFactory.registerItemType("_SELECT1_", "select1", OSelect1_XFormItem)
OSelect1_XFormItem.prototype.focusable = false;
OSelect1_XFormItem.prototype.cssClass = "oselect";
OSelect1_XFormItem.prototype.multiple = false;
OSelect1_XFormItem.prototype.writeElementDiv = false;
OSelect1_XFormItem.prototype.width = "auto";
OSelect1_XFormItem.prototype.editable = false;

//TODO: get showing check working for the normal SELECT, requires:
//		* separate notion of hilited row (for mouseover) and selected row(s)
//		* teach select1 that more than one value may be selected (same as select)
//		* convert OSELECT_CHECK to just use showCheck?
//		* does &radic; work everywhere?  Use an image?
OSelect1_XFormItem.prototype.showCheck = false;
OSelect1_XFormItem.prototype.checkHTML = "&radic;";


OSelect1_XFormItem.prototype.updateElement = function (newValue) {
	// hack: if this item can display multiple values and there's a comma in the value
	//		assume it's a list of values
	if (this.getMultiple() && newValue != null && newValue.indexOf(",") > -1) {
		newValue = newValue.split(",");
		for (var i = 0; i < newValue.length; i++) {
			newValue[i] = this.getChoiceLabel(newValue[i]);
		}
	} else {
		newValue = this.getChoiceLabel(newValue);
	}
	if (newValue == null) newValue = "";
	
	var el = this.getDisplayElement();

	if (el) {
		if(this.getInheritedProperty("editable")) {
			el.value = newValue;
		} else {
			el.innerHTML = newValue;
		}
		//el.readOnly = !this.getInheritedProperty("editable");
	}
}

OSelect1_XFormItem.prototype.getShowCheck = function () {
	return this.cacheInheritedProperty("showCheck", "$showCheck");
}

OSelect1_XFormItem.prototype.getCheckHTML = function () {
	return this.cacheInheritedProperty("checkHTML", "$checkHTML");
}


OSelect1_XFormItem.prototype.getMenuElementId = function () {
	return "___OSELECT_MENU___";
}
OSelect1_XFormItem.prototype.getMenuElement = function () {
	var id = this.getMenuElementId();
	var el = this.getElement(id);
	if (el == null) {
		el = this.createElement(id, null, "div", "MENU CONTENTS");
	}
	return el;
}


OSelect1_XFormItem.prototype.showMenu = function() {
	if(!this._enabled)
		return;

	if (AjxEnv.isIE && !OSelect1_XFormItem._mouseWheelEventAttached) {
		var form = this.getForm();
		var formElement = form.getHtmlElement();
		if (formElement.attachEvent) {
			formElement.attachEvent("onmousewheel", OSelect1_XFormItem._mouseWheelHideMenu);
			OSelect1_XFormItem._mouseWheelCurrentSelect = this;
			OSelect1_XFormItem._mouseWheelEventAttached = true;
		}
	}

	var menu = this.getMenuElement();
	if (menu == null) return; 

	menu.className = this.getMenuCssClass();
	menu.innerHTML = this.getChoicesHTML();	
	var bounds;
	bounds = this.getBounds(this.getElement().childNodes[0]);

	var w = DwtShell.getShell(window).getSize();
	var wh = w.y;
	var WINDOW_GUTTER = 8;
	menu.style.left = parseInt(bounds.left);
	menu.style.top = parseInt(bounds.top) + parseInt(bounds.height) - 1;
	var choices = this.getNormalizedChoices();
	if(choices && choices.values) {
	//	menu.style.width = bounds.width;
		//menu.style.overflow="hidden";
		menu.style.overflow="visible";
		//var height4win = (parseInt(bounds.height-3)*choices.values.length)+3;
		//var height4linux = (parseInt(bounds.height + 2)*choices.values.length)+3;
		menu.style.height = (parseInt(bounds.height-3)*choices.values.length)+3;
	}

	var value = this.getInstanceValue();
	if (this.$getDisplayValue) {
		value = this.$getDisplayValue(value);
	}
	var selectedItemNum = this.getChoiceNum(value);
	this.__currentHiliteItem = selectedItemNum;
	this.hiliteChoice(selectedItemNum);
	menu.style.zIndex = Dwt.Z_HIDDEN;
	menu.style.display = "block";


	var mBounds = this.getBounds(menu);
	var menuHeight = mBounds.height;
	var menuTop = mBounds.top;

	if(menuHeight + menuTop > wh - WINDOW_GUTTER) {
		//menu does not fit downwards - check if it fits upwards
		if((bounds.top - menuHeight) > WINDOW_GUTTER) {
			//yes - it fits upwards
			menu.getElementsByTagName("table")[0].style.width = parseInt(bounds.width);
			menu.style.width = parseInt(bounds.width);	
			menu.getElementsByTagName("table")[0].className = this.getChoiceTableCssClass();				
		} else {
			/*
			* menu is too big to expand either up or down 
			* make it expand wherever ther is more space and make it scrollable
			*/
			if(bounds.top > ((wh - WINDOW_GUTTER*2)/2) ) {
				//expand upwards
				menu.style.height = parseInt(bounds.top) - WINDOW_GUTTER;												
				menu.style.top = WINDOW_GUTTER;
			} else {
				//expand downwards
				menu.style.top	= 	parseInt(menu.style.top)+2;				
				menu.style.height = wh-WINDOW_GUTTER-parseInt(menu.style.top);								
			}
			menu.style.width = parseInt(bounds.width)+2;					
			menu.style.overflow="auto";	
			menu.getElementsByTagName("table")[0].className = this.getChoiceScrollTableCssClass();
		} 
	} else {
		menu.getElementsByTagName("table")[0].style.width = parseInt(bounds.width);
		menu.style.width = parseInt(bounds.width);	
		menu.getElementsByTagName("table")[0].className = this.getChoiceTableCssClass();
	}
	menu.style.zIndex = 1000000;
	if (this.$hideListener == null) {
		this.$hideListener = new AjxListener(this, this.oMouseUp);
	}
	
	if (this.$outsideMouseDownListener == null) {
		this.$outsideMouseDownListener = new AjxListener(this, this.onOutsideMouseDown);
	}

	AjxCore.addListener(window, "onmouseup", this.$hideListener);
	AjxCore.addListener(document.body, "onmousedown", this.$outsideMouseDownListener);
	DwtEventManager.addListener(DwtEvent.ONMOUSEDOWN, this.$outsideMouseDownListener);	
	
}

OSelect1_XFormItem.prototype.hideMenu = function () {
	// hide the menu on a timer so we don't have to deal with wierd selection bugs
	setTimeout(this.getFormGlobalRef()+".getElement('" + this.getMenuElementId() + "').style.display = 'none'", 10);

	AjxCore.removeListener(window, "onmouseup", this.$hideListener);
	AjxCore.removeListener(document.body, "onmousedown", this.$outsideMouseDownListener);	
	DwtEventManager.removeListener(DwtEvent.ONMOUSEDOWN, this.$outsideMouseDownListener);
	
	if (AjxEnv.isIE && OSelect1_XFormItem._mouseWheelEventAttached) {
		var form = this.getForm();
		var formElement = form.getHtmlElement();
		if (formElement.detachEvent) {
			window.event.cancelBubble = true;
			formElement.detachEvent("onmousewheel", OSelect1_XFormItem._mouseWheelHideMenu);
			OSelect1_XFormItem._mouseWheelEventAttached = false;
			OSelect1_XFormItem._mouseWheelCurrentSelect = null;
		}
	}
}

OSelect1_XFormItem.prototype.oMouseUp = function (ev) {
	// hide the menu on a timer so we don't have to deal with wierd selection bugs
	ev = ev || window.event;
	var found = false;
    if (ev) {
		// figure out if we are over the menu that is up
		var htmlEl = DwtUiEvent.getTarget(ev);
	//	DBG.println(AjxDebug.DBG1, AjxBuffer.concat("oMouseUp; htmlEl.nodeName=",htmlEl.nodeName," htmlEl.localName = ", htmlEl.nodeName));
		//check if the user clicked on the scrollbar
			if(htmlEl.localName == "scrollbar" && ( (htmlEl.parentNode && htmlEl.parentNode.id=="___OSELECT_MENU___") || (htmlEl.id && htmlEl.id=="___OSELECT_MENU___"))) { 
				found = true;
			} else if (htmlEl.id && htmlEl.id == "___OSELECT_MENU___"){
				found = true;
			}
	}


	if(!found)
		this.hideMenu();
		
	return true;
}

OSelect1_XFormItem.prototype.onOutsideMouseDown = function (ev) {
	// hide the menu on a timer so we don't have to deal with wierd selection bugs
	ev = ev || window.event;
	var found = false;
    if (ev) {
		// figure out if we are over the menu that is up
		var htmlEl = DwtUiEvent.getTarget(ev);
		if(htmlEl && htmlEl.attributes && htmlEl.attributes.length) {
			var cnt = htmlEl.attributes.length;
			for(var i = 0; i < cnt; i++) {
				if(htmlEl.attributes[i].name == "itemnum") {
					this.onChoiceClick(htmlEl.attributes[i].value, ev);
					found = true;
					break;
				}
			}
		}
		if(!found) {
		//	DBG.println(AjxDebug.DBG1, AjxBuffer.concat("onOutsideMouseDown; htmlEl.nodeName=", htmlEl.nodeName," htmlEl.localName = ", htmlEl.localName, " htmlEl.id=", htmlEl.id));
			//check if the user clicked on the scrollbar
			if(htmlEl.localName == "scrollbar" && ( (htmlEl.parentNode && htmlEl.parentNode.id=="___OSELECT_MENU___") || (htmlEl.id && htmlEl.id=="___OSELECT_MENU___"))) { 
				found = true;
			} else if (htmlEl.id && htmlEl.id == "___OSELECT_MENU___"){
				found = true;
			}
		}
		
	}
	if(!found)
		this.hideMenu();
		
	return true;
}

OSelect1_XFormItem.prototype.getBounds = function(anElement, containerElement) {
	var myBounds = new Object();
	myBounds.left = 0;
	myBounds.top = 0;
	myBounds.width = anElement.offsetWidth;
	myBounds.height = anElement.offsetHeight;

	if(!containerElement) {
		containerElement = AjxEnv.isIE ? anElement.document.body : anElement.ownerDocument.body;
	}

	// account for the scrollbars if necessary
	var hasScroll = (anElement.scrollLeft !== void 0);
	var trace = anElement;

	while(trace != containerElement) {
		myBounds.left += trace.offsetLeft;
		myBounds.top += trace.offsetTop;

		var nextEl = trace.offsetParent;
		while (hasScroll && (trace != nextEl)) {
			myBounds.left -= trace.scrollLeft;
			myBounds.top -= trace.scrollTop;
			trace = AjxEnv.isIE ? nextEl : trace.parentNode;
		}
		trace = nextEl;
	}
	return myBounds;
};



// TAKE DIRECTLY FROM DWT_SELECT
OSelect1_XFormItem.prototype.onChoiceOver = function (itemNum, event) {
	if (this.__currentHiliteItem != null) this.dehiliteChoice(this.__currentHiliteItem);
	this.hiliteChoice(itemNum);
	this.__currentHiliteItem = itemNum;
}
OSelect1_XFormItem.prototype.onChoiceOut = function (itemNum, event) {
	if (this.__currentHiliteItem != null) this.dehiliteChoice(this.__currentHiliteItem);
	this.__currentHiliteItem = null;
}
OSelect1_XFormItem.prototype.onChoiceClick = function (itemNum, event) {
	this.choiceSelected(itemNum, false, event);
}

OSelect1_XFormItem.prototype.onChoiceDoubleClick = function (itemNum, event) {
	this.choiceSelected(itemNum, true, event);
}

OSelect1_XFormItem.prototype.onValueTyped = function(label, event) {
	var value = this.getChoiceValue(label);
	this.setValue(value, false, event);
}

OSelect1_XFormItem.prototype.choiceSelected = function (itemNum, clearOldValues, event) {
	this.onChoiceOut();
	this.hideMenu();
	var value = this.getNormalizedValues()[itemNum];
	this.setValue(value, clearOldValues, event);
}


OSelect1_XFormItem.prototype.setValue = function (newValue, clearOldValues, event) {
	var method = this.getElementChangedMethod();
	method.call(this, newValue, this.getInstanceValue(), event);
}

OSelect1_XFormItem.prototype.hiliteChoice = function (itemNum) {
	this.setChoiceCssClass(itemNum, this.getChoiceSelectedCssClass());
	if (this.getShowCheck() == true) {
		var els = this.getChoiceElements(itemNum);
		if (els) els[0].innerHTML = this.getCheckHTML();
	}
}

OSelect1_XFormItem.prototype.displayMouseOver = function () {
	if(!this._enabled)
		return;
}

OSelect1_XFormItem.prototype.displayMouseOut = function () {
	if(!this._enabled)
		return;
}

OSelect1_XFormItem.prototype.displayMouseDown = function () {
	if(!this._enabled)
		return;
}

OSelect1_XFormItem.prototype.dehiliteChoice = function(itemNum) {
	this.setChoiceCssClass(itemNum, this.getChoiceCssClass());
	if (this.getShowCheck() == true) {
		var els = this.getChoiceElements(itemNum);
		if (els) els[0].innerHTML = "&nbsp;";
	}
}


OSelect1_XFormItem.prototype.clearAllHilites = function () {
	for (var i = 0; i < this._normalizedValues.length; i++) {
		this.dehiliteChoice(i);
	}
}



OSelect1_XFormItem.prototype.setChoiceCssClass = function (itemNum, cssClass) {
	var els = this.getChoiceElements(itemNum);
	if (els) {
		els.className = cssClass;
/*		if (this.getShowCheck()) {
			els[0].className = cssClass + "_check";
			els[1].className = cssClass;
		} else {
			els[0].className = cssClass;
		}
*/		
	}
}

OSelect1_XFormItem.prototype.getArrowElement = function () {
	return this.getForm().getElement(this.getId() + "_arrow_button");
}

OSelect1_XFormItem.prototype.getDisplayElement = function () {
	return this.getElement(this.getId() + "_display");
}


OSelect1_XFormItem.prototype.getItemNumFromEvent = function (event) {
	var target = event.target || event.src;
	while (target) {
		if (target.id) {
			var itemNum = parseInt(target.id);
			if (isNaN(itemNum)) return -1;
			return itemNum;
		}
		target = target.parentNode;
	}
	return -1;
}

OSelect1_XFormItem.prototype.getChoiceElements = function (itemNum) {
	if (itemNum == null || itemNum == -1) return null;
	try {
//		return this.getForm().getElement(this.getId() + "_menu_table").rows[itemNum].getElementsByTagName("td");
		return this.getForm().getElement(this.getId() + "_menu_table").getElementsByTagName("div")[itemNum];
	} catch (e) {
		return null;
	}
}


/*OSelect1_XFormItem.prototype.outputHTML = function (HTMLoutput, updateScript, indent) {
	var id = this.getId();
	if (this.getWidth() == "auto") {
		var element = this.getElement("temp");
		var element = this.createElement("temp", null, "div", "MENU CONTENTS");
		element.style.left = -1000;
		element.style.top = -1000;
		element.className = this.getMenuCssClass();
		element.innerHTML = this.getChoicesHTML();
		this._width = element.offsetWidth+20;
		element.innerHTML = "";
	}

	HTMLoutput.append(indent,
		"<div id=", id, this.getCssString(),
			" onclick=\"", this.getFormGlobalRef(), ".getItemById('",this.getId(),"').showMenu(this, event)\"",
			" onselectstart=\"return false\"",
			">\r", indent,

			"  <table ", this.getTableCssString(), ">\r", indent,
				"  <tr><td width=100%><div id=", id, "_display class=", this.getDisplayCssClass(), ">VALUE</div></td>\r", indent,
					"    <td>", this.getArrowButtonHTML(),"</td>\r", indent,
				"  </tr>\r", indent,
			"  </table>\r", indent,
		"</div>\r"
	);
}*/

OSelect1_XFormItem.prototype.outputHTML = function (HTMLoutput, updateScript, indent) {
	var id = this.getId();
	var ref = this.getFormGlobalRef() + ".getItemById('"+ id + "')";	
	if (this.getWidth() == "auto") {
		var element = this.getElement("temp");
		var element = this.createElement("temp", null, "div", "MENU CONTENTS");
		element.style.left = -1000;
		element.style.top = -1000;
		element.className = this.getMenuCssClass();
		element.innerHTML = this.getChoicesHTML();
		this._width = element.offsetWidth+20;
		element.innerHTML = "";
	}

	if(this.getInheritedProperty("editable")) {
		HTMLoutput.append(indent,
			"<div id=", id, this.getCssString(),
				" onclick=\"", this.getFormGlobalRef(), ".getItemById('",this.getId(),"').showMenu(this, event)\"",
				" onselectstart=\"return false\"",
				">",
				"<table ", this.getTableCssString(), ">", 
					"<tr><td width=100%><input type=text id=", id, "_display class=", this.getDisplayCssClass(), " value='VALUE' ", 
					" onchange=\"",ref, ".onValueTyped(this.value, event||window.event)\"", (this.getInheritedProperty("editable") ? " readOnly=false " : " readOnly=true "),
					"></td>",
						"<td>", this.getArrowButtonHTML(),"</td>", 
					"</tr>", 
				"</table>", 
			"</div>"
		);
	} else {
		HTMLoutput.append(indent,
			"<div id=", id, this.getCssString(),
				" onclick=\"", this.getFormGlobalRef(), ".getItemById('",this.getId(),"').showMenu(this, event)\"",
				" onselectstart=\"return false\"",
				"><table ", this.getTableCssString(), ">",
					"<tr><td width=100%><div id=", id, "_display class=", this.getDisplayCssClass(), ">VALUE</div></td>",
						"<td>", this.getArrowButtonHTML(),"</td>", 
					"</tr>", indent,
				"</table>", indent,
			"</div>"
		);	
	}
}

OSelect1_XFormItem.prototype.getArrowButtonHTML = function () {
	var ref = this.getFormGlobalRef() + ".getItemById('"+ this.getId()+ "')";
	return AjxBuffer.concat("<div id=", this.getId(), "_arrow_button",
	 " onmouseover=\"", ref, ".displayMouseOver();\"",
 	 " onmouseout=\"", ref, ".displayMouseOut();\"",
 	 " onmousedown=\"", ref, ".displayMouseDown();\"", 	 
 	 ">", AjxImg.getImageHtml("SelectPullDownArrow"), "</div>");
//	return AjxImg.getImageHtml("SelectPullDownArrow", "", AjxBuffer.concat("id=",this.getId(), "_arrow_button"));
}

OSelect1_XFormItem.prototype.getTableCssClass = function () {
	return this.cssClass + "_table";
}
OSelect1_XFormItem.prototype.getDisplayCssClass = function () {
	return this.cssClass + "_display";
}

OSelect1_XFormItem.prototype.getMenuCssClass = function () {
	return this.cssClass + "_menu";
}
OSelect1_XFormItem.prototype.getChoiceTableCssClass = function () {
	return this.cssClass + "_choice_table";
}
OSelect1_XFormItem.prototype.getChoiceScrollTableCssClass = function () {
	return this.cssClass + "_choice_table_scrolled";
}

OSelect1_XFormItem.prototype.getChoiceCssClass = function () {
	return this.cssClass + "_choice";
}
OSelect1_XFormItem.prototype.getChoiceSelectedCssClass = function () {
	return this.cssClass + "_choice_selected";
}



OSelect1_XFormItem.prototype.outputChoicesHTMLStart = function(html, indent) {
	html.append(indent, "<table cellspacing=0 cellpadding=0 id=", this.getId(),"_menu_table class=", this.getChoiceTableCssClass(), ">\r");
	//html.append(indent, "<div width=100% style='overflow:visible;' id=", this.getId(),"_menu_table class=", this.getChoiceTableCssClass(), ">\r");
}
OSelect1_XFormItem.prototype.outputChoicesHTMLEnd = function(html, indent) {
	html.append(indent, "</table>\r");
	//html.append(indent, "</div>\r");
}

OSelect1_XFormItem.prototype.getChoiceHTML = function (itemNum, value, label, cssClass, indent) {
	var ref = this.getFormGlobalRef() + ".getItemById('"+ this.getId()+ "')";
	//try DIVs
	/*
	
	return AjxBuffer.concat(indent,
		"<div width=100% class=", cssClass, 
			" onmouseover=\"",ref, ".onChoiceOver(", itemNum,", event||window.event)\"",
			" onmouseout=\"",ref, ".onChoiceOut(", itemNum,", event||window.event)\"",
			" onclick=\"",ref, ".onChoiceClick(", itemNum,", event||window.event)\"",
			" itemnum = '", itemNum, "'",
		">",
				label,
		"</div>\r"
	);*/
	return AjxBuffer.concat("<tr><td><div class=", cssClass, 
			" onmouseover=\"",ref, ".onChoiceOver(", itemNum,", event||window.event)\"",
			" onmouseout=\"",ref, ".onChoiceOut(", itemNum,", event||window.event)\"",
			" onclick=\"",ref, ".onChoiceClick(", itemNum,", event||window.event)\"",
			" itemnum = '", itemNum, "'",">",label,	"</div></td></tr>");
	
}


// set up how disabling works for this item type
OSelect1_XFormItem.prototype.setElementEnabled = function(enabled) {
	this._enabled = enabled;
	var table = this.getForm().getElement(this.getId()).getElementsByTagName("table")[0];
	if(enabled) {
		this.getDisplayElement().className = this.getDisplayCssClass();
		AjxImg.setImage(this.getArrowElement(), "SelectPullDownArrow");
		this.getForm().getElement(this.getId()).className = this.cssClass;
		table.className = this.getTableCssClass();
	} else {
		this.getDisplayElement().className = this.getDisplayCssClass() + "_disabled";
		AjxImg.setImage(this.getArrowElement(), "SelectPullDownArrowDis");
		this.getForm().getElement(this.getId()).className = this.cssClass + "_disabled";
		table.className = this.getTableCssClass()+"_disabled";
	}
}

//
//	OSelect class -- lightning fast SELECT type widget
//
function OSelect_XFormItem() {}
XFormItemFactory.createItemType("_OSELECT_", "oselect", OSelect_XFormItem, OSelect1_XFormItem);
// override the default SELECT type
//XFormItemFactory.registerItemType("_SELECT_", "select", OSelect_XFormItem)

OSelect_XFormItem.prototype.focusable = false;
OSelect_XFormItem.prototype.multiple = true;
OSelect_XFormItem.prototype.writeElementDiv = true;
OSelect_XFormItem.prototype.overflow = "auto";
OSelect_XFormItem.prototype.cssStyle = "border:2px inset gray;";
OSelect_XFormItem.prototype.showCheck = false;

OSelect_XFormItem.prototype.outputHTML = function(html) {
	var it = this.getChoicesHTML();
	html.append(it);
}

OSelect_XFormItem.prototype.outputChoicesHTMLStart = function(html, indent) {
	html.append(indent, "<table id=", this.getId(),"_menu_table width=100% cellspacing=0 cellpadding=0>\r");
}
OSelect_XFormItem.prototype.outputChoicesHTMLEnd = function(html, indent) {
	html.append(indent, "</table>\r");
}


OSelect_XFormItem.prototype.getMenuElementId = function () {
	return this.getId();
}

OSelect_XFormItem.prototype.updateElement = function (values) {
	var element = this.getElement();
	element.innerHTML = this.getChoicesHTML();

	if (values == null) return;	
	if(this.getMultiple()) {
		if (typeof values == "string") values = values.split(",");
		for (var i = 0; i < values.length; i++) {
			var itemNum = this.getChoiceNum(values[i]);
			if (itemNum != -1) this.hiliteChoice(itemNum);
		}
	} else {
		var itemNum = this.getChoiceNum(values);
		if (itemNum != -1) this.hiliteChoice(itemNum);
	}
}

OSelect_XFormItem.prototype.onChoiceOver = function (itemNum) {}
OSelect_XFormItem.prototype.onChoiceOut = function (itemNum) {}

OSelect_XFormItem.prototype.onChoiceClick = function (itemNum, event) {
	event = event || window.event;
	var clearOthers = true;
	var includeIntermediates = false;
	//if (event.ctrlKey){
	if(this.getMultiple()) {
		clearOthers = false;
		if (event.shiftKey) {
			includeIntermediates = true;
		}
	}
	//} else if (event.shiftKey) {
	this.choiceSelected(itemNum, clearOthers, includeIntermediates, event);
};

OSelect_XFormItem.prototype.choiceSelected = function (itemNum, clearOldValues, includeIntermediates, event) {
	if (includeIntermediates){
		this._selectionCursor = itemNum;
		if (this._selectionAnchor == null) {
			this._selectionAnchor = itemNum;
		}
	} else {
		this._selectionAnchor = itemNum;
		this._selectionCursor = itemNum;
	}

	var value = this.getNormalizedValues()[itemNum];
	this.setValue(value, clearOldValues, includeIntermediates, event);
}

OSelect_XFormItem.prototype.setValue = function (newValue, clearOldValues, includeIntermediates, event) {
	var oldValues
	if (clearOldValues) {
		if(this.getMultiple()) {
			oldValues = [newValue];
		} else {
			oldValues = newValue;
		}
	} else {
		oldValues;
		if (includeIntermediates) {
			oldValues = [];
			var vals = this.getNormalizedValues();
			var start = this._selectionCursor;
			var dist = this._selectionAnchor - this._selectionCursor;
			if (dist < 0 ) {
				dist = this._selectionCursor - this._selectionAnchor;
				start = this._selectionAnchor;
			}
			for (var i = start; i <= start + dist; ++i) {
				oldValues.push(vals[i]);
			}
		} else {
			oldValues = this.getInstanceValue();

			if(oldValues) {
				if (typeof oldValues == "string") {
					if (oldValues == "") 	
						oldValues = [];
					else
						oldValues = oldValues.split(",");
				}
			} else {
				oldValues = new Array();			
			}			
			
			var found = false;
			for (var i = 0; i < oldValues.length; i++) {
				if (oldValues[i] == newValue) {
					found = true;
					break;
				}
			}
			
			if (found) {
				oldValues.splice(i, 1);
			} else {
				oldValues.push(newValue);
			}
		}
		if(!oldValues || (oldValues.length == 1 && oldValues[0] == "")) {
			oldValues = []
		} 
		// if we have a modelItem which is a LIST type
		//	convert the output to the propert outputType
		var modelItem = this.getModelItem();
		if (modelItem && modelItem.getOutputType) {
			if (modelItem.getOutputType() == _STRING_) {
				oldValues = oldValues.join(modelItem.getItemDelimiter());
			}
		} else {
			// otherwise assume we should convert it to a comma-separated string
			oldValues = oldValues.join(",");
		}
	}
	this.getForm().itemChanged(this, oldValues, event);
}






function OSelect_Check_XFormItem() {}
XFormItemFactory.createItemType("_OSELECT_CHECK_", "oselect_check", OSelect_Check_XFormItem, OSelect_XFormItem)

OSelect_Check_XFormItem.prototype.getChoiceHTML = function (itemNum, value, label, cssClass, indent) {
	var ref = this.getFormGlobalRef() + ".getItemById('"+ this.getId()+ "')";
	return AjxBuffer.concat(indent,
		"<tr><td class=", cssClass, 
			" onmouseover=\"",ref, ".onChoiceOver(", itemNum,", event||window.event)\"",
			" onmouseout=\"",ref, ".onChoiceOut(", itemNum,", event||window.event)\"",
			" onclick=\"",ref, ".onChoiceClick(", itemNum,", event||window.event)\"",
			" ondblclick=\"",ref, ".onChoiceDoubleClick(", itemNum,", event||window.event)\"",
		">",
		"<table cellspacing=0 cellpadding=0><tr><td><input type=checkbox></td><td>",
				label,
		"</td></tr></table></tr>\r"
	);
}

OSelect_Check_XFormItem.prototype.hiliteChoice = function (itemNum) {
	var el = this.getChoiceElements(itemNum)[0];
	el.className = this.getChoiceSelectedCssClass();
	
	var checks = el.getElementsByTagName("input");
	if (checks) {
		checks[0].checked = true;
	}
}

OSelect_Check_XFormItem.prototype.dehiliteChoice = function(itemNum) {
	var el = this.getChoiceElements(itemNum)[0];
	el.className = this.getChoiceCssClass();

	var checks = el.getElementsByTagName("input");
	if (checks) {
		checks[0].checked = false;
	}
}
