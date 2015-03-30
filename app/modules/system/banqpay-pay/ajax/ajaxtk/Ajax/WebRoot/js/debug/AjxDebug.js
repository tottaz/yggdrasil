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
* Creates a new debug window. The document inside is not kept open.  All the 
  output goes into a single &lt;div&gt; element.
* @constructor
* @class
* This class pops up a debug window and provides functions to send output there 
* in various ways. The output is continuously appended to the bottom of the 
* window. The document is left unopened so that the browser doesn't think it's 
* continuously loading and keep its little icon flailing forever. Also, the DOM 
* tree can't be manipulated on an open document. All the output is added to the 
* window by appending it the DOM tree. Another method of appending output is to 
* open the document and use document.write(), but then the document is left open.
* <p>
* Any client that uses this class can turn off debugging by changing the first 
* argument to the constructor to AjxDebug.NONE.
*
* @author Conrad Damon
* @author Ross Dargahi
* @param level	 	debug level for the current debugger (no window will be displayed for a level of NONE)
* @param name 		the name of the window. Defaults to "debug_" prepended to the calling window's URL.
* @param showTime	a boolean that toggles the display of timestamps before debug messages
*/
function AjxDebug(level, name, showTime) {
	this._dbgName = "AjxDebugWin_" + location.hostname.replace(/\./g,'_');
	this._level = level;
	this._showTime = showTime;
	this._enabled = (this._level != AjxDebug.NONE);
	this._showTiming = false;
	this._startTimePt = this._lastTimePt = 0;
	this._dbgWindowInited = false;

	this._msgQueue = new Array();
	AjxDebug._CONTENT_FRAME_ID = AjxDebug._CONTENT_FRAME_ID;
	this._isPrevWinOpen = false;
	if (!this._enabled) return;

	this._openDebugWindow();
};


AjxDebug.NONE = "DBG0"; // no debugging (window will not come up)
AjxDebug.DBG1 = "DBG1"; // minimal debugging
AjxDebug.DBG2 = "DBG2"; // moderate debugging
AjxDebug.DBG3 = "DBG3"; // anything goes
AjxDebug.PERF = "PERF"; // performance timings

// map from number to debug level
AjxDebug.DBG = new Object();
AjxDebug.DBG[-1] = AjxDebug.PERF;
AjxDebug.DBG[0] = AjxDebug.NONE;
AjxDebug.DBG[1] = AjxDebug.DBG1;
AjxDebug.DBG[2] = AjxDebug.DBG2;
AjxDebug.DBG[3] = AjxDebug.DBG3;

// map from debug level to number
AjxDebug.GBD = {};
AjxDebug.GBD[AjxDebug.PERF] = -1;
AjxDebug.GBD[AjxDebug.NONE] = 0;
AjxDebug.GBD[AjxDebug.DBG1] = 1;
AjxDebug.GBD[AjxDebug.DBG2] = 2;
AjxDebug.GBD[AjxDebug.DBG3] = 3;

AjxDebug.MAX_OUT = 25000; // max length capable of outputting

AjxDebug._LINK_FRAME_ID = "AjxDebug_LF";
AjxDebug._CONTENT_FRAME_ID = "AjxDebug_CF";
AjxDebug._BUTTON_FRAME_ID = "AjxDebug_BF";

AjxDebug._id = 0;
AjxDebug._openErrors = 0;

AjxDebug.prototype.toString = 
function() {
	return "AjxDebug";
}

/**
* Set debug level. May open or close the debug window if moving to or from level NONE.
*
* @param level	 	debug level for the current debugger
*/
AjxDebug.prototype.setDebugLevel = 
function(level) {
	if (level == this._level) return;

	this._level = level;
	if (level == AjxDebug.NONE) {
		this._enabled = false;
		this._debugWindow.close();
		this._debugWindow = null;
	} else {
		this._enabled = true;
		if (this._debugWindow == null || this._debugWindow.closed)
			this._openDebugWindow();
	}
};

AjxDebug.prototype.getDebugLevel = 
function(level) {
	return this._level;
};

AjxDebug.prototype.isShowTiming = 
function() {
	return this._showTiming;
};

/**
* Turn the display of timing statements on/off. Timing starts over any time it's turned on.
*
* @param on		whether to display timing statements
*/
AjxDebug.prototype.showTiming = 
function(on, level, msg) {
	this._showTiming = on;

	if (on) {
		this._startTimePt = this._lastTimePt = 0;

		var a = [];
		for (var i = 1; i < arguments.length; i++)
			a.push(arguments[i]);

		var args = this._handleArgs(a);
		if (args) {
			var msgLevel = AjxDebug.DBG1;
			if (String(level).match(/^DBG|PERF/))
				msgLevel = level;

			this.println(msgLevel, " ----- " + args[0] + " ----- ");
		}
	}
	this._startTimePt = this._lastTimePt = new Date().getTime();
};

/**
* Prints a debug message. Any HTML will be rendered, and a line break is added.
*
* @param level	 	debug level for the current debugger
* @param msg		the text to display
*/
AjxDebug.prototype.println = 
function(level, msg, linkName) {
	if (this.isDisabled() || this._debugWindow.closed) return;
	var args = this._handleArgs(arguments, linkName);
	if (!args) return;

	msg = args.join("");
	/*** DEBUG ***
	if (String(level).match(/^DBG|PERF/)) {
		msg = level + ": " + msg;
	}
	/*** DEBUG ***/
	this._add(this._timestamp() + msg + "<br>", null, null, null, linkName);
};

AjxDebug.prototype.isDisabled = 
function () {
	return !this._enabled;
};

/**
* Prints an object into a table, with a column for properties and a column for values. Above the table is a header with the object
* class and the CSS class (if any). The properties are sorted (numerically if they're all numbers). Creating and appending table 
* elements worked in Mozilla but not IE. Using the insert* methods works for both. Properties that are function 
* definitions are skipped.
*
* @param level	 	debug level for the current debugger
* @param obj		the object to be printed
* @param showFuncs	whether to show props that are functions
*/
AjxDebug.prototype.dumpObj = 
function(level, obj, showFuncs, linkName) {
	if (this.isDisabled() || this._debugWindow.closed)return;
	var args = this._handleArgs(arguments, linkName);
	if (!args) return;
	obj = args[0];
	if (!obj) return;
	this._showFuncs = args[1];

	AjxDebug._visited = new AjxVector();
	this._add(null, obj);
	this._showFuncs = null;
};

/**
* Dumps a bunch of text into a &lt;textarea&gt;, so that it is wrapped and scrollable. HTML will not be rendered.
*
* @param level	 	debug level for the current debugger
* @param text		the text to output as is
*/
AjxDebug.prototype.printRaw = 
function(level, text, linkName) {
	if (this.isDisabled() || this._debugWindow.closed) return;
	var args = this._handleArgs(arguments, linkName);
	if (!args) return;
	text = args[0];
	
	this._add(null, text, false, true);
};

/**
* Pretty-prints a chunk of XML, doing color highlighting for different types of nodes.

* @param level	 	debug level for the current debugger
* @param text		some XML
*/
AjxDebug.prototype.printXML = 
function(level, text, linkName) {
	if (this.isDisabled() || this._debugWindow.closed) return;
	var args = this._handleArgs(arguments, linkName);
	if (!args) return;
	text = args[0];
	if (!text) return;
	
	// skip generating pretty xml if theres too much data
	if (AjxEnv.isSafari || text.length > AjxDebug.MAX_OUT) {
		this.printRaw(text);
		return;
	}
	this._add(null, text, true, false);
};

/**
* Reveals white space in text by replacing it with tags.
*
* @param level	 	debug level for the current debugger
* @param text		the text to be displayed
*/
AjxDebug.prototype.display =
function(level, text) {
	if (this.isDisabled() || this._debugWindow.closed) return;
	var args = this._handleArgs(arguments);
	if (!args) return;
	text = args[0];

	text = text.replace(/\r?\n/g, '[crlf]');
	text = text.replace(/ /g, '[space]');
	text = text.replace(/\t/g, '[tab]');
	this.printRaw(level, text);
};

AjxDebug.prototype.timePt =
function(level, msg) {
	if (!this._showTiming || !this._enabled || this._debugWindow.closed) return;
	
	var args = this._handleArgs(arguments);
	if (!args) return;
	var msg = args[0];
	
	var now = new Date().getTime();
	var elapsed = now - this._startTimePt;
	var interval = now - this._lastTimePt;
	this._lastTimePt = now;
	var text = "[" + elapsed + " / " + interval + "]";
	if (msg)
		text += " " + msg;
	html = "<div>" + text + "</div>";
	extraType = typeof(text);

    var myMsg = new DebugMessage(html);
	
    // Add the message to our stack
    this._addMessage(myMsg);
	return interval;
};


// Private methods

AjxDebug.prototype._getHtmlForObject = 
function(anObj, isXml, isRaw) {
	var html = new Array();
	var idx = 0;

	if (AjxUtil.isUndefined(anObj)) {
		html[idx++] = "<span>Undefined</span>";
	} else if (AjxUtil.isNull(anObj)) {
		html[idx++] = "<span>NULL</span>";
	} else if (AjxUtil.isBoolean(anObj)) {
		html[idx++] = "<span>" + anObj + "</span>";
	} else if (AjxUtil.isNumber(anObj)) {
		html[idx++] = "<span>" + anObj +"</span>";
	} else {
		if (isRaw) {
			html[idx++] = this._timestamp();
			html[idx++] = "<textarea rows='25' style='width:100%' readonly='true'>";
			html[idx++] = anObj;
			html[idx++] = "</textarea>";
			html[idx++] = "<p></p>";
		} else if (isXml) {
			var xmldoc = new AjxDebugXmlDocument;
			var doc = xmldoc.create();
			doc.loadXML(anObj);
			html[idx++] = "<div style='border-width:2px; border-style:inset; width:100%; height:300px; overflow:auto'>";
			html[idx++] = this._createXmlTree(doc, 0);
			html[idx++] = "</div>";
		} else {
			html[idx++] = "<div style='border-width:2px; border-style:inset; width:100%; height:300px; overflow:auto'>";
			html[idx++] = "<pre>";
			html[idx++] = this._dump(anObj, true);
			html[idx++] = "</div>";
			html[idx++] = "</pre>";
		}
	}
	return html.join("");
};

// Pretty-prints a Javascript object
AjxDebug.prototype._dump =
function(obj, recurse) {

	var indentLevel = 0;
	var showBraces = false;
	var stopRecursion = false;
	if (arguments.length > 2) {
		indentLevel = arguments[2];
		showBraces = arguments[3];
		stopRecursion = arguments[4];
	}

	if (AjxUtil.isObject(obj)) {
		if (obj.toString() == "ZmAppCtxt"){
			return "[ZmAppCtxt]";
		}
		if (AjxDebug._visited.contains(obj))
			return "[visited object]";
		else
			AjxDebug._visited.add(obj);
	}	

	var indent = AjxStringUtil.repeat(" ", indentLevel);
	var text = "";
	
	if (AjxUtil.isUndefined(obj)) {
		text += "[undefined]";
	} else if (AjxUtil.isNull(obj)) {
		text += "[null]";
	} else if (AjxUtil.isBoolean(obj)) {
		text += obj ? "true" : "false";
	} else if (AjxUtil.isString(obj)) {
	//	obj = obj.replace(/\r/g, "\\r");
	//	obj = obj.replace(/\n/g, "\\n");
	//	obj = obj.replace(/\t/g, "\\t");
		text += '"' + AjxDebug._escapeForHTML(obj) + '"';
	} else if (AjxUtil.isNumber(obj)) {
		text += obj;
	} else if (AjxUtil.isObject(obj)) {
		var isArray = AjxUtil.isArray(obj);
		if (stopRecursion) {
			text += isArray ? "[Array]" : obj.toString();
		} else {
			stopRecursion = !recurse;
			var keys = new Array();
			for (var i in obj)
				keys.push(i);

			isArray ? keys.sort(function(a,b) {return a - b;}) : keys.sort();	
	

			if (showBraces)
				text += isArray ? "[" : "{";
			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];
				var nextObj = obj[key];
				var value = null;
				// 5/31/05 EMC:
				// For dumping events, and dom elements, though I may not want to
				// traverse the node, I do want to know what the attribute is.
				if (nextObj == window || nextObj == document || (!AjxEnv.isIE && nextObj instanceof Node)){
					value = nextObj.toString();
				} 
				if ((typeof(nextObj) == "function")){
					if (this._showFuncs) {
						value = "[function]";
					} else {
						continue;
					}
				}

				if (i > 0) text += ",";
				text += "\n" + indent;
				if (value != null) {
					text += key + ": " + value;
				} else {
					text += key + ": " + this._dump(nextObj, recurse, indentLevel + 2, true, stopRecursion);
				}
			}
			if (i > 0)
				text += "\n" + AjxStringUtil.repeat(" ", indentLevel - 1);
			if (showBraces)
				text += isArray ? "]" : "}";
		}
	}
	return text;
};

// If the first arg is a debug level, check it and then strip it.
AjxDebug.prototype._handleArgs =
function(args, linkNameSpecified) {
	if (this._level == AjxDebug.NONE) return;
	
	var levelSpecified = false;
	var curLevel = AjxDebug.GBD[this._level];
	var msgLevel = AjxDebug.GBD[AjxDebug.DBG1];
	if (typeof args[0] == "string" && String(args[0]).match(/^DBG|PERF/)) {
		msgLevel = AjxDebug.GBD[args[0]];
		levelSpecified = true;
	}
	if (msgLevel > curLevel) return;
	
	// NOTE: Can't just slice the items we want because args is not an Array
	var array = new Array(args.length);
	var len = (linkNameSpecified) ? args.length - 1 : args.length;
	for (var i = 0; i < len; i++) {
		array[i] = args[i];
	}
	if (levelSpecified) { array.shift(); }
	return array;
};

AjxDebug.prototype._getCookieVal =
function (cookieName) {
	var myRE = cookieName  + "=([^;]+)";
	var myVals = document.cookie.match(new RegExp(myRE));
	var val = null;
	// Return the last value defined (if found)
	if (myVals && (myVals.length > 0)) {
		var valStr = myVals[myVals.length-1];
		if (valStr == "true") {
			val = true;
		} else if (valStr == "false") {
			val = false;
		} else {
			val = valStr;
		}
	}
	return val;
};

AjxDebug.prototype._openDebugWindow =
function() {
	this._enabled = true;
	// check if there is a debug window already open
	this._isPrevWinOpen = this._getCookieVal("AjxDebugWinOpen");
	if (!this._isPrevWinOpen) {
		this._debugWindow = AjxWindowOpener.openBlank(this._dbgName, "width=600,height=400,resizable=yes,scrollbars=yes", this._initWindow, this);
	} else {
		this._debugWindow = window.open("" , this._dbgName, "width=600,height=400,resizable=yes,scrollbars=yes");
		this._initWindow();
	}
};


AjxDebug.prototype._initWindow =
function() {
	if (this._debugWindow == null) {
		this._enabled = false;
		return;
	}
	
	try {
		this._document = this._debugWindow.document;
		this._document.title = "Debug";

		if (!this._isPrevWinOpen) {
			this._document.write([
				"<html>",
					"<head>",
						"<script>",
							"function blank() {return [",
								"'<html><head><style type=\"text/css\">',",
									"'P, TD, DIV, SPAN, SELECT, INPUT, TEXTAREA, BUTTON {',",
											"'font-family: Tahoma, Arial, Helvetica, sans-serif;',",
											"'font-size:11px;}',",
									"'.Link {cursor: pointer;color:blue;text-decoration:underline;white-space:nowrap;width:100%;}',",		
									"'.Mark {color:white; background-color:black; width:100%;font-size:14px;font-weight:bold;}',",
									"'.MarkLink {cursor: pointer;color:white;background-color:black;text-decoration:underline;font-weight:bold;white-space:nowrap;width:100%;}',",
									"'.Run {color:black; background-color:red;width:100%;font-size:18px;font-weight:bold;}',",
									"'.RunLink {cursor: pointer;color:black;background-color:red;text-decoration:underline;font-weight:bold;white-space:nowrap;width:100%;}',",
								"'</style></head><body></body></html>'].join(\"\");}",
						"</script>",
					"</head>",
					"<frameset cols='125, *'>",
						"<frameset rows='*,40'>",
							"<frame name='", AjxDebug._LINK_FRAME_ID, "' id='", AjxDebug._LINK_FRAME_ID, "' src='javascript:parent.parent.blank();'>",
							"<frame name='", AjxDebug._BUTTON_FRAME_ID, "' id='", AjxDebug._BUTTON_FRAME_ID, "' src='javascript:parent.parent.blank();'>",
						"</frameset>",
						"<frame name='", AjxDebug._CONTENT_FRAME_ID, "' id='", AjxDebug._CONTENT_FRAME_ID, "' src='javascript:parent.blank();'>",
					"</frameset>",
				"</html>"].join(""));
			var ta = new AjxTimedAction(this, AjxDebug.prototype._finishInitWindow);
			AjxTimedAction.scheduleAction(ta, 250);
		} else {
			this._contentFrame = this._document.getElementById(AjxDebug._CONTENT_FRAME_ID);
			this._linkFrame = this._document.getElementById(AjxDebug._LINK_FRAME_ID);
			this._createLinkNContent(this, "RunLink", "NEW RUN", "Run", "NEW RUN");
			
			// Firefox allows us to attach an event listener, and runs it even
			// though the window with the code is gone ... odd, but nice. IE,
			// though will not run the handler, so we make sure, even if we're
			// coming back to the window, to attach the onunload handler. In general
			// reattach all handlers for IE
			if (AjxEnv.isIE) {
				this._debugWindow.attachEvent('onunload', AjxDebug.unloadHandler);
				this._markBtn.onclick = AjxDebug._mark;
				this._clearBtn.onclick = AjxDebug._clear;
			}		
				
			this._dbgWindowInited = true;
			// show any messages that have been queued up, while the window loaded.
			this._showMessages();
		}
	} catch (ex) {
		AjxDebug.deleteWindowCookie();
		this._debugWindow.close();

		// If we've exceeded a certain # of errors, just close window and bail.
		if (AjxDebug._openErrors < 5) {
			AjxDebug._openErrors++;
			this._openDebugWindow();
		}
	}
};

AjxDebug.prototype._finishInitWindow =
function() {
	this._contentFrame = this._document.getElementById(AjxDebug._CONTENT_FRAME_ID);
	this._linkFrame = this._document.getElementById(AjxDebug._LINK_FRAME_ID);

	// Create the mark and clear buttons
	var buttonFrame = this._document.getElementById(AjxDebug._BUTTON_FRAME_ID);
	var buttonFrameDoc = buttonFrame.contentWindow.document;
	var buttonFrameBody = buttonFrameDoc.body;
	
	var markBtn = this._markBtn = buttonFrameDoc.createElement("button");
	markBtn.innerHTML = "Mark";
	markBtn._dbg = this;
	markBtn.onclick = AjxDebug._mark;

	var clearBtn = this._markBtn = buttonFrameDoc.createElement("button");
	clearBtn._contentFrameId = AjxDebug._CONTENT_FRAME_ID;
	clearBtn._linkFrameId = AjxDebug._LINK_FRAME_ID;
	clearBtn.innerHTML = "Clear";
	clearBtn._dbg = this;
	clearBtn.onclick = AjxDebug._clear;
	
	buttonFrameBody.appendChild(markBtn);
	buttonFrameBody.appendChild(buttonFrameDoc.createTextNode(" "));
	buttonFrameBody.appendChild(clearBtn);


	// If we're not using a div
	// Set a cookie telling ourselves that a debug window is already open
	document.cookie = "AjxDebugWinOpen=true";
	
	// setup an onunload method
	if (!AjxEnv.isIE) {
		this._debugWindow.onunload = AjxDebug.unloadHandler;
		window.addEventListener('unload', AjxDebug.myWindowUnloadHandler, true);
	} else {
		this._debugWindow.attachEvent('onunload', AjxDebug.unloadHandler);
		window.attachEvent = AjxDebug.myWindowUnloadHandler;
	}

	this._dbgWindowInited = true;
	this._showMessages();
};


/**
* Scrolls to the bottom of the window. How it does that depends on the browser.
*
* @private
*/
AjxDebug.prototype._scrollToBottom = 
function() {
	if (AjxEnv.isIE) {
		this._contentFrame.contentWindow.document.body.scrollIntoView(false);
		this._linkFrame.contentWindow.document.body.scrollIntoView(false);
	} else {
		this._contentFrame.contentWindow.scrollTo(0, this._contentFrame.contentWindow.document.body.offsetHeight);
		this._linkFrame.contentWindow.scrollTo(0, this._linkFrame.contentWindow.document.body.offsetHeight);
	}
};

/**
* Returns a timestamp string, if we are showing them.
* @private
*/
AjxDebug.prototype._timestamp = 
function() {
	return this._showTime 
		? AjxDateFormat.getTimeInstance().format(new Date()) + ": " 
		: "";
};

AjxDebug.prototype.setShowTimestamps = 
function(show) {
	this._showTime = show;
};

// this function takes an xml node and returns an html string that displays that node
// the indent argument is used to describe what depth the node is at so that
// the html code can create a nice indention
AjxDebug.prototype._createXmlTree = 
function (node, indent) {

	if (node == null)
		return "";
	var str = "";
	
	switch (node.nodeType) {
		case 1:	// Element
			str += "<div style='color: blue; padding-left: 16px;'>&lt;<span style='color: DarkRed;'>" + node.nodeName + "</span>";
			
			var attrs = node.attributes;
			for (var i = 0; i < attrs.length; i++)
				str += this._createXmlAttribute(attrs[i]);
			
			if (!node.hasChildNodes())
				return str + "/&gt;</div>";
			
			str += "&gt;<br />";
			
			var cs = node.childNodes;
			for (var i = 0; i < cs.length; i++)
				str += this._createXmlTree(cs[i], indent + 3);
			
			str += "&lt;/<span style='color: DarkRed;'>" + node.nodeName + "</span>&gt;</div>";
			break;
	
		case 9:	// Document
			var cs = node.childNodes;
			for (var i = 0; i < cs.length; i++)
				str += this._createXmlTree(cs[i], indent);
			break;
	
		case 3:	// Text
			if (!/^\s*$/.test(node.nodeValue)) {
				var val = node.nodeValue.replace(/</g, "&lt;").replace(/>/g, "&gt;");
				str += "<span style='color: WindowText; padding-left: 16px;'>" + val + "</span><br />";
			}
			break;
	
		case 7:	// ProcessInstruction
			str += "&lt;?" + node.nodeName;
		
			var attrs = node.attributes;
			for (var i = 0; i < attrs.length; i++)
				str += this._createXmlAttribute(attrs[i]);
			
			str+= "?&gt;<br />"
			break;
	
		case 4:	// CDATA
			str = "<div style=''>&lt;![CDATA[<span style='color: WindowText; font-family: \"Courier New\"; white-space: pre; display: block; border-left: 1px solid Gray; padding-left: 16px;'>" + 
				node.nodeValue +
			"</span>]" + "]></div>";
			break;
			
		case 8:	// Comment
			str = "<div style='color: blue; padding-left: 16px;'>&lt;!--<span style='white-space: pre; font-family: \"Courier New\"; color: Gray; display: block;'>" + 
				node.nodeValue +
			"</span>--></div>";
			break;
		
		case 10:
				str = "<div style='color: blue; padding-left: 16px'>&lt;!DOCTYPE " + node.name;
				if (node.publicId) {
					str += " PUBLIC \"" + node.publicId + "\"";
					if (node.systemId) 
						str += " \"" + node.systemId + "\"";
				}
				else if (node.systemId) {
					str += " SYSTEM \"" + node.systemId + "\"";
				}
				str += "&gt;</div>";
				
				// TODO: Handle custom DOCTYPE declarations (ELEMENT, ATTRIBUTE, ENTITY)
				
				break;
		
		default:
			//alert(node.nodeType + "\n" + node.nodeValue);
			this._inspect(node);
	}
	
	return str;
};

AjxDebug.prototype._createXmlAttribute = 
function(a) {
	return " <span style='color: red'>" + a.nodeName + "</span><span style='color: blue'>=\"" + a.nodeValue + "\"</span>";
};

AjxDebug.prototype._inspect = 
function(obj) {
	var str = "";
	for (var k in obj)
		str += "obj." + k + " = " + obj[k] + "\n";
	window.alert(str);
};

AjxDebug.prototype._add = 
function (aMsg, extraInfo, isXml, isRaw, linkName){
	var extraType = typeof(extraInfo);

	if (AjxUtil.isSpecified(extraInfo))
		extraInfo = this._getHtmlForObject(extraInfo, isXml, isRaw);

    // Add the message to our stack
    this._addMessage(new DebugMessage(aMsg, null, null, null, extraInfo, linkName));

};

AjxDebug.prototype._addMessage = 
function (aMsg) {
	this._msgQueue[this._msgQueue.length] = aMsg;
	this._showMessages();
};

donola=false;
AjxDebug.prototype._showMessages = 
function () {
	if (!this._dbgWindowInited) {
		// For now, don't show the messages-- assuming that this case only 
		// happens at startup, and many  messages will be written
		return;
	}
	
	if (this._msgQueue.length > 0) {
		var msg;
		var contentDiv;
		var linkDiv;
		var contentFrameDoc = this._contentFrame.contentWindow.document;
		var linkFrameDoc = this._linkFrame.contentWindow.document;
		
		for (var i = 0 ; i < this._msgQueue.length ; ++i ) {
			var now = new Date();
			msg = this._msgQueue[i];
			contentDiv = contentFrameDoc.createElement('div');
			contentDiv.innerHTML = [msg.message, msg.eHtml].join("");
			if (msg.linkName) {
				linkDiv = linkFrameDoc.createElement('div');
				linkDiv._targetId = contentDiv.id = [AjxDebug._getNextId(), now.getMilliseconds()].join("");
				linkDiv._dbg = this;
				linkDiv.className = "Link";
				linkDiv.onclick = AjxDebug._linkClicked;
				linkDiv.innerHTML = msg.linkName  + " - [" + AjxDebug._getTimeStamp(now) + "]";;	
				linkFrameDoc.body.appendChild(linkDiv);
				//linkFrameDoc.body.appendChild(linkFrameDoc.createElement("br"));
			}
			contentFrameDoc.body.appendChild(contentDiv);		
		}
	}

	this._msgQueue.length = 0;
	this._scrollToBottom();
};

AjxDebug._linkClicked =
function() {
	var el = this._dbg._contentFrame.contentWindow.document.getElementById(this._targetId);
	var y = 0;
	while (el) {
		y += el.offsetTop;
		el = el.offsetParent;
	}
	
	this._dbg._contentFrame.contentWindow.scrollTo(0, y);	
};

AjxDebug._getNextId =
function() {
	return "AjxDebug_" + AjxDebug._id++;
};

AjxDebug.prototype._parseHtmlFragment = 
function (htmlStr) {
	var div = this._contentFrame.contentWindow.document.createElement('div');	
	div.innerHTML = htmlStr;
	return div;
};


// Static methods

AjxDebug._mark = 
function() {
	this._dbg._createLinkNContent(this._dbg, "MarkLink", "MARK", "Mark", "MARK");
};

AjxDebug.prototype._createLinkNContent =
function(ajxDbgObj, linkClass, linkLabel, contentClass, contentLabel) {
	var now = new Date();
	var timeStamp = [" - [", AjxDebug._getTimeStamp(now), "]"].join("");
	var linkFrameDoc = ajxDbgObj._linkFrame.contentWindow.document;
	var div = linkFrameDoc.createElement("div");
	div.className = linkClass;
	div.innerHTML = linkLabel + timeStamp;
	var id = "Lnk_" + now.getMilliseconds();
	div._targetId = id;
	div._dbg = ajxDbgObj;
	div.onclick = AjxDebug._linkClicked
	linkFrameDoc.body.appendChild(div);
	//linkFrameDoc.body.appendChild(linkFrameDoc.createElement("br"));
	
	var contentFrameDoc = ajxDbgObj._contentFrame.contentWindow.document;
	div = contentFrameDoc.createElement("div");
	div.className = contentClass;
	div.id = id;
	div.innerHTML = contentLabel + timeStamp;
	div._dbg = ajxDbgObj;
	contentFrameDoc.body.appendChild(contentFrameDoc.createElement("p"));
	contentFrameDoc.body.appendChild(div);
	contentFrameDoc.body.appendChild(contentFrameDoc.createElement("p"));
};

AjxDebug._clear = 
function() {
	this._dbg._contentFrame.contentWindow.document.body.innerHTML = "";
	this._dbg._linkFrame.contentWindow.document.body.innerHTML = "";	
};

AjxDebug.myWindowUnloadHandler = 
function() {
	if (AjxEnv.isNav) {
		DBG._debugWindow.onunload = null;
	} else {
		DBG._debugWindow.detachEvent('onunload', AjxDebug.unloadHandler);
	}
};

AjxDebug.unloadHandler = 
function() {
	try {
		window.AjxDebug.deleteWindowCookie();
	} catch (ex) {
		// do nothing. This might be caused by the unload handler
		// firing while the window is changing domains.
	}
};

AjxDebug.deleteWindowCookie = 
function() {
    var expiredDate = new Date('Fri, 31 Dec 1999 23:59:59 GMT'); // I18n???
	document.cookie = "AjxDebugWinOpen=false;expires=" + expiredDate.toGMTString();
};

AjxDebug._escapeForHTML = 
function(str){
	if (typeof(str) != 'string') return str;
	var s = str;
	s = s.replace(/\&/g, '&amp;');
	s = s.replace(/\</g, '&lt;');
	s = s.replace(/\>/g, '&gt;');
	s = s.replace(/\"/g, '&quot;');
	s = s.replace(/\xA0/g, '&nbsp;');	
	return s;
};

AjxDebug._getTimeStamp =
function(date) {
	date = (date) ? date : new Date();
	return AjxStringUtil.htmlEncode([AjxDateUtil.getTimeStr(date, "%H:%m:%s"), ".", date.getMilliseconds()].join(""), true);
};

/**
 * Simple wrapper for log messages
 */
DebugMessage = function(aMsg, aType, aCategory, aTime, extraHtml, linkName) {
    this.message = (AjxUtil.isSpecified(aMsg)) ? aMsg : '';
    this.type = aType ? aType : null;
    this.category = aCategory ? aCategory : '';
    this.time = aTime ? aTime : (new Date().getTime());
    this.eHtml = extraHtml ? extraHtml : '';
    this.linkName = linkName;
};
