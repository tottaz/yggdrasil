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


function Dwt() {
}

// Constants for positioning
Dwt.STATIC_STYLE = "static";
Dwt.ABSOLUTE_STYLE = "absolute";
Dwt.RELATIVE_STYLE = "relative";

// Background repeat 
Dwt.NO_REPEAT = "no-repeat";
Dwt.REPEAT = "repeat";
Dwt.REPEAT_X = "repeat-x";
Dwt.REPEAT_Y = "repeat-y";

// display style
Dwt.DISPLAY_INLINE = "inline";
Dwt.DISPLAY_BLOCK = "block";
Dwt.DISPLAY_NONE = "none";

// constants for layout
Dwt.LEFT = 100;
Dwt.RIGHT = 101;
Dwt.TOP = 102;
Dwt.BOTTOM = 103;

Dwt.ABOVE = 104;
Dwt.BELOW = 105;

Dwt.WIDTH = 106;
Dwt.HEIGHT = 107;

// Scroll constants
Dwt.CLIP = 1;
Dwt.VISIBLE = 2;
Dwt.SCROLL = 3;
Dwt.FIXED_SCROLL = 4;

// z-index order
Dwt.Z_HIDDEN = 100;		// hide the display
Dwt.Z_CURTAIN = 200;	// not used; could be used if there is leakage
Dwt.Z_VIEW = 300;		// make visible
Dwt.Z_MENU = 500;		// popup menus
Dwt.Z_VEIL = 600;		// goes below dialogs to make them modal
Dwt.Z_DIALOG = 700;		// dialogs
Dwt.Z_DIALOG_MENU = 750;// menus in dialogs
Dwt.Z_TOOLTIP = 775;	// tool tips
Dwt.Z_DND = 800;		// Drag N Drop icons
Dwt.Z_BUSY = 900;		// used to block user input
Dwt.Z_SPLASH = 1000;    // used for splash screens

Dwt.Z_INC = 1;			// atomic amount to bump z-index if needed

Dwt.DEFAULT = -123456789;

Dwt.LOC_NOWHERE = -10000; // for positioning an element offscreen

// Drag N Drop action constants
Dwt.DND_DROP_NONE = 0;
Dwt.DND_DROP_COPY = 1;
Dwt.DND_DROP_MOVE = 2;

// Keys used for retrieving data
Dwt.KEY_OBJECT = "_object_";
Dwt.KEY_ID = "_id_";

Dwt._nextId = 1;

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// XXX: DEPRACATED
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
Dwt.getDomObj =
function(doc, id)  {
	//return doc.getElementById(id);
	alert("DEPRACATED: Please use document.getElementById instead");
}

Dwt.getNextId =
function() {
	return "DWT" + Dwt._nextId++;
}

Dwt.associateElementWithObject =
function(domElement, jsObject) {
	domElement.dwtObj = jsObject.__internalId = AjxCore.assignId(jsObject);
};

Dwt.disassociateElementFromObject =
function(domElement, jsObject) {
	if (domElement){
		delete domElement.dwtObj;
	}
	if (jsObject.__internalId){
		AjxCore.unassignId(jsObject.__internalId);
	}
};

Dwt.getObjectFromElement =
function(domElement) {
	return AjxCore.objectWithId(domElement.dwtObj);
};

Dwt.setHandler =
function(htmlElement, event, func) {
	if (event == DwtEvent.ONMOUSEWHEEL && AjxEnv.isGeckoBased) {
		Dwt.clearHandler(htmlElement, event);
	}
	htmlElement[event] = func;
	if (event == DwtEvent.ONMOUSEWHEEL && AjxEnv.isGeckoBased) {
		htmlElement.addEventListener("DOMMouseScroll", func, true);
	}
};

Dwt.clearHandler =
function(htmlElement, event) {
	if (event == DwtEvent.ONMOUSEWHEEL && AjxEnv.isGeckoBased) {
		if (htmlElement[event]) {
			var func = htmlElement[event];
			htmlElement.removeEventListener("DOMMouseScroll", func, true);
		}
	}
	htmlElement[event] = null;
};

Dwt.getBackgroundRepeat =
function(htmlElement) {
	return DwtCssStyle.getProperty(htmlElement, "background-repeat");
};

Dwt.setBackgroundRepeat =
function(htmlElement, style) {
	htmlElement.style.backgroundRepeat = style;
};

Dwt.getBounds =
function(htmlElement, incScroll) {
	var loc = Dwt.getLocation(htmlElement);
	var size = Dwt.getSize(htmlElement, incScroll);
	return new DwtRectangle(loc.x, loc.y, size.x, size.y);
};

Dwt.setBounds =
function(htmlElement, x, y, width, height) {
	Dwt.setLocation(htmlElement, x, y);
	Dwt.setSize(htmlElement, width, height);
};

Dwt.getCursor = 
function(htmlElement) {
	return DwtCssStyle.getProperty(htmlElement, "cursor");
};

Dwt.setCursor =
function(htmlElement, cursorName) {
	htmlElement.style.cursor = cursorName;
};


Dwt.getLocation =
function(htmlElement) {
	if (htmlElement.style.position == Dwt.ABSOLUTE_STYLE)
		return new DwtPoint(parseInt(DwtCssStyle.getProperty(htmlElement, "left")),
		                    parseInt(DwtCssStyle.getProperty(htmlElement, "top")));
	else
		return Dwt.toWindow(htmlElement, 0, 0);
};

Dwt.setLocation =
function(htmlElement, x, y) {
	if (htmlElement.style.position != Dwt.ABSOLUTE_STYLE) {
		DBG.println(AjxDebug.DBG1, "Cannot position static widget " + htmlElement.className);
		throw new DwtException("Static widgets may not be positioned", DwtException.INVALID_OP, "Dwt.setLocation");
	}
	if (x = Dwt.checkPxVal(x))
		htmlElement.style.left = x;
	if (y = Dwt.checkPxVal(y))
		htmlElement.style.top = y;
};

Dwt.checkPxVal =
function(val, check) {
	if (val == Dwt.DEFAULT) return false;
	
	if (check && val < 0 && val != Dwt.LOC_NOWHERE) {
		DBG.println(AjxDebug.DBG1, "negative pixel value: " + val);
		val = 0;
	}
	if (typeof(val) == "number")
		val = val + "px";

	return val;
};

Dwt.getPosition =
function(htmlElement) {
	return htmlElement.style.position;
};

Dwt.setPosition =
function(htmlElement, posStyle) {
	htmlElement.style.position = posStyle;
};

Dwt.getScrollStyle =
function(htmlElement) {
	var overflow =  DwtCssStyle.getProperty(htmlElement, "overflow");
	if (overflow == "hidden")
		return Dwt.CLIP;
	else if (overflow =="auto")
		return Dwt.SCROLL;
	else if (overflow =="scroll")
		return Dwt.FIXED_SCROLL;
	else
		return Dwt.VISIBLE;
};

Dwt.setScrollStyle =
function(htmlElement, scrollStyle) {
	if (scrollStyle == Dwt.CLIP)
		htmlElement.style.overflow = "hidden";
	else if (scrollStyle == Dwt.SCROLL)
		htmlElement.style.overflow = "auto";
	else if (scrollStyle == Dwt.FIXED_SCROLL)
		htmlElement.style.overflow = "scroll";
	else
		htmlElement.style.overflow = "visible";
};

// Note: in FireFox, offsetHeight includes border and clientHeight does not;
// may want to look at clientHeight for FF
Dwt.getSize = 
function(htmlElement, incScroll) {
	var p = new DwtPoint(0, 0);
	if (htmlElement.offsetWidth != null) {
		p.x = htmlElement.offsetWidth;
		p.y = htmlElement.offsetHeight;
	} else if (htmlElement.clip && htmlElement.clip.width != null) {
		p.x = htmlElement.clip.width;
		p.y = htmlElement.clip.height;
	} else if (htmlElement.style && htmlElement.style.pixelWidth != null) {
		p.x = htmlElement.style.pixelWidth;
		p.y = htmlElement.style.pixelHeight;
	}
	p.x = parseInt(p.x);
	p.y = parseInt(p.y);
	return p;
};

Dwt.setSize = 
function(htmlElement, width, height) {
	if (width = Dwt.checkPxVal(width, true))
		htmlElement.style.width = width;
	if (height = Dwt.checkPxVal(height, true))
		htmlElement.style.height = height;
};

/**
* Measure the extent in pixels of a section of html
*/
Dwt.getHtmlExtent =
function(html) {
	if (!Dwt._measureDiv) {
		var measureDiv = document.createElement("div");
		measureDiv.id = this._measureDivId = Dwt.getNextId();
		Dwt.setPosition(measureDiv, Dwt.ABSOLUTE_STYLE);
		Dwt.setLocation(measureDiv, Dwt.LOC_NOWHERE, Dwt.LOC_NOWHERE);
		document.body.appendChild(measureDiv);
		Dwt._measureDiv = measureDiv;
	}
	Dwt._measureDiv.innerHTML = html;
	return Dwt.getSize(Dwt._measureDiv);
};

Dwt.getAttr = 
function(htmlEl, attr, recursive) {
	// test for tagName so we dont try to eval non-html elements (i.e. document)
	if (!recursive) {
		return htmlEl && htmlEl.tagName
			? (htmlEl.getAttribute(attr) || htmlEl[attr])
			: null;
	} else {
		while (htmlEl) {
			if (Dwt.getAttr(htmlEl, attr) != null) {
				return htmlEl;
			}
			htmlEl = htmlEl.parentNode;
		}
		return null;
	}
};

Dwt.getVisible =
function(htmlElement) {
	var disp = DwtCssStyle.getProperty(htmlElement, "display");
	return (disp != Dwt.DISPLAY_NONE);
};

Dwt.setVisible =
function(htmlElement, visible) {
	htmlElement.style.display = visible ? Dwt.DISPLAY_BLOCK : Dwt.DISPLAY_NONE;
};

Dwt.getVisibility =
function(htmlElement) {
	var vis = DwtCssStyle.getProperty(htmlElement, "visibility");
	return (vis == "visible");
};

Dwt.setVisibility =
function(htmlElement, visible) {
	htmlElement.style.visibility = visible ? "visible" : "hidden";
};

Dwt.setOpacity =
function(htmlElement, opacity) {
	if (AjxEnv.isIE) htmlElement.style.filter = "alpha(opacity="+opacity+")";
	else htmlElement.style.opacity = opacity/100;
};

Dwt.getZIndex =
function(htmlElement) {
	return DwtCssStyle.getProperty(htmlElement, "z-index");
};

Dwt.setZIndex =
function(htmlElement, idx) {
//DBG.println(AjxDebug.DBG3, "set zindex for " + htmlElement.className + ": " + idx);
	htmlElement.style.zIndex = idx;
};

Dwt.getDisplay = 
function(htmlElement) {
	DwtCssStyle.getProperty(htmlElement, "display");
};

Dwt.setDisplay = 
function(htmlElement, value) {
	htmlElement.style.display = value;
};

/**
* Returns the window size of the browser
*/
Dwt.getWindowSize =
function() {
	var p = new DwtPoint(0, 0);
	if (window.innerWidth) {
		p.x = window.innerWidth;
		p.y = window.innerHeight;
	} else if (AjxEnv.isIE6CSS) {
		p.x = document.body.parentElement.clientWidth;
		p.y = document.body.parentElement.clientHeight;
	} else if (document.body && document.body.clientWidth) {
		p.x = document.body.clientWidth;
		p.y = document.body.clientHeight;
	}
	return p;
}

Dwt.toWindow =
function(htmlElement, x, y, containerElement, dontIncScrollTop) {
	var p = new DwtPoint(x, y);
	// EMC 6/3/2005
	// changed the below line, since it meant we did not 
	// include the given element in our location calculation.
	//var offsetParent = htmlElement.offsetParent;
	var offsetParent = htmlElement;
	while (offsetParent && offsetParent != containerElement) {
		p.x += offsetParent.offsetLeft;
		p.y += offsetParent.offsetTop;
		if (!dontIncScrollTop) {
			if (offsetParent.scrollTop) {
				p.y -= offsetParent.scrollTop;
			}
			var parentNode = offsetParent.parentNode;
			while (parentNode != offsetParent.offsetParent && parentNode != containerElement) {
				if (parentNode.scrollTop) {
					p.y -= parentNode.scrollTop;
				}
				parentNode = parentNode.parentNode;
			}
		}
		offsetParent = offsetParent.offsetParent;
	}
	return p;
};

Dwt.setStatus =
function(text) {
	window.status = text;
};

Dwt.getTitle = 
function() {
	return window.document.title;
};

Dwt.setTitle = 
function(text) {
	window.document.title = text;
};

Dwt.getIframeDoc = 
function(iframeObj) {
	if (iframeObj) {
		return AjxEnv.isIE 
			? iframeObj.contentWindow.document
			: iframeObj.contentDocument;
	}
	return null;
};

Dwt.getIframeWindow = 
function(iframeObj) {
	return iframeObj.contentWindow;
};

Dwt._ffOverflowHack = 
function (htmlElId, myZindex, lowThresholdZ, turnOffOverflowScroll, disableSelf) {
	if (!AjxEnv.isNav)
		return;
		
	var ds = disableSelf? disableSelf: false;
	var lowThresholdZIndex = lowThresholdZ? lowThresholdZ: -100;
	var coll = document.getElementsByTagName("div");
	var temp = null;
	var len = coll.length;
	var lastGoodZIndex = -1;
	for (var i = 0; i < len; ++i) {
		temp = coll[i];
		if (temp.id == htmlElId) {
			temp = coll[++i];
			while(i < len && temp.style.zIndex == '') {
				// enable myself if someone else turned me off
				if (temp._oldOverflow && turnOffOverflowScroll){
					temp.style.overflow = temp._oldOverflow;
					delete temp._oldOverflow;
				} else if (ds){
					temp._oldOverflow = temp.style.overflow;
					temp.style.overflow = "hidden";
				}
				temp = coll[++i];
			}
			if (i == len)
				break;
		}
		var divZIndex = parseInt(temp.style.zIndex);
		// assume that if the value is auto, that we want to shut off the 
		// overflow setting.
		if (isNaN(divZIndex)) {
			divZIndex = lastGoodZIndex;
		} else {
			lastGoodZIndex = divZIndex;
		}
		if ( divZIndex < myZindex && divZIndex >= lowThresholdZIndex) {
			switch (turnOffOverflowScroll) {
			case true:
				if (!temp._oldOverflow) {
					var cssDecl = window.getComputedStyle(temp,"");
					var overflow = cssDecl.getPropertyValue("overflow");
					// FF 1.5 returns "0px" for the computed overflow value
					if (AjxEnv.isFirefox1_5up && overflow == "0px") {
						var overflowX = cssDecl.getPropertyValue("overflow-x");
						overflow = overflowX == "hidden" 
								? "-moz-scrollbars-vertical"
								: "-moz-scrollbars-horizontal"; 
					}
					if (overflow != 'hidden') {
						temp._oldOverflow = overflow;
						temp._oldScrollTop = temp.scrollTop;
						temp.style.overflow = "visible";
					}
				}
				break;
			case false:
				if (temp._oldOverflow) {
					temp.style.overflow = temp._oldOverflow;
					delete temp._oldOverflow;
				}
				if (temp._oldScrollTop != null) {
					temp.scrollTop = temp._oldScrollTop;
				}
				break;
			}
		}
	}
};

/**
* Creates and returns an element from a string of HTML.
*
* @param html	[string]	HTML text
* @param isRow	[boolean]*	true if the element is a TR
*/
Dwt.parseHtmlFragment = 
function(html, isRow) {
	if (!Dwt._div)
		Dwt._div = document.createElement('div');
	// TR element needs to have surrounding table
	if (isRow)
		html = "<table style='table-layout:fixed'>" + html + "</table>";
	Dwt._div.innerHTML = html;
	
	return isRow ? Dwt._div.firstChild.rows[0] : Dwt._div.firstChild;
};

Dwt.contains = 
function(parentEl, childEl) {
  	var isContained = false;
  	if (AjxEnv.isSafari) {
  		return false;
  	} else if (parentEl.compareDocumentPosition) {
		var relPos = parentEl.compareDocumentPosition(childEl);
		if ((relPos == (document.DOCUMENT_POSITION_CONTAINED_BY | document.DOCUMENT_POSITION_FOLLOWING))) {
			isContained = true;
		}

  	} else if (parentEl.contains) {
  		isContained = parentEl.contains(childEl);
  	}
  	return isContained;
};

Dwt.removeChildren =
function(htmlEl) {
	while (htmlEl.hasChildNodes())
		htmlEl.removeChild(htmlEl.firstChild);
};

/**
* Safari always returns zero for cellIndex property of TD element :(
*
* @param cell		TD object we want cell index for
*/
Dwt.getCellIndex = 
function(cell) {
	if (AjxEnv.isSafari) {
		if (cell.tagName && cell.tagName.toLowerCase() == "td") {
			// get the cells collection from the TD's parent TR
			var cells = cell.parentNode.cells;
			for (var i = 0; i < cells.length; i++) {
				if (cells[i] == cell)
					return i;
			}
		}
	} else {
		return cell.cellIndex;
	}
	return -1;
};
