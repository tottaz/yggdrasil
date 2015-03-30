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
 * Html Editor
 *
 * @author Ross Dargahi
 */
function DwtHtmlEditor(parent, className, posStyle, content, mode, blankIframeSrc) {
	if (arguments.length == 0) return;
	this.setBlankIframeSrc(blankIframeSrc);
	className = className || "DwtHtmlEditor";
	DwtComposite.call(this, parent, className, posStyle);
	
	this._mode = mode == DwtHtmlEditor.HTML && this.isHtmlEditingSupported()
		? mode : DwtHtmlEditor.TEXT;

	this.__eventClosure = AjxCallback.simpleClosure(this.__eventClosure, this);

	// init content
	this._initialStyle = this._getInitialStyle(true);
	var initialHtml = "<html><head>" + this._getInitialStyle(false) + "</head><body></body></html>";
	if (!content)
		content = this._mode == DwtHtmlEditor.HTML ? initialHtml : "";
	
	this._pendingContent = content;
	this._htmlModeInited = false;

	this._initialize();
}

DwtHtmlEditor.prototype = new DwtComposite();
DwtHtmlEditor.prototype.constructor = DwtHtmlEditor;

// Modes
DwtHtmlEditor.HTML = 1;
DwtHtmlEditor.TEXT = 2;

// Styles
DwtHtmlEditor.H1 = 1;
DwtHtmlEditor.H2 = 2;
DwtHtmlEditor.H3 = 3;
DwtHtmlEditor.H4 = 4;
DwtHtmlEditor.H5 = 5;
DwtHtmlEditor.H6 = 6;
DwtHtmlEditor.PARAGRAPH = 7;
DwtHtmlEditor.ADDRESS = 8;
DwtHtmlEditor.PREFORMATTED = 9;

DwtHtmlEditor._STYLES = ["", "<h1>", "<h2>", "<h3>", "<h4>", "<h5>", "<h6>", "<p>", "<address>", "<pre>"];

// Font Family
DwtHtmlEditor.ARIAL = 1;
DwtHtmlEditor.COURIER = 2;
DwtHtmlEditor.TIMES = 3;
DwtHtmlEditor.VERDANA = 4;

// Font Styles
DwtHtmlEditor.BOLD_STYLE = "bold";
DwtHtmlEditor.ITALIC_STYLE = "italic";
DwtHtmlEditor.UNDERLINE_STYLE = "underline";
DwtHtmlEditor.STRIKETHRU_STYLE = "strikethrough";
DwtHtmlEditor.SUBSCRIPT_STYLE = "subscript";
DwtHtmlEditor.SUPERSCRIPT_STYLE = "superscript";

// Justification
DwtHtmlEditor.JUSTIFY_LEFT = "justifyleft";
DwtHtmlEditor.JUSTIFY_CENTER = "justifycenter";
DwtHtmlEditor.JUSTIFY_RIGHT = "justifyright";
DwtHtmlEditor.JUSTIFY_FULL = "justifyfull";

// Indent
DwtHtmlEditor.OUTDENT = "outdent";
DwtHtmlEditor.INDENT = "indent";

// Elements
DwtHtmlEditor.HORIZ_RULE = "inserthorizontalrule";
DwtHtmlEditor.ORDERED_LIST = "insertorderedlist";
DwtHtmlEditor.UNORDERED_LIST = "insertunorderedlist";

// Direction
DwtHtmlEditor.DIRECTION_R2L;
DwtHtmlEditor.DIRECTION_L2R;

// PRIVATE Class Attributes

// Font Family Definitions & RegExs
DwtHtmlEditor._ARIAL = "Arial, Helvetica, sans-serif";
DwtHtmlEditor._COURIER = "Courier New, Courier, mono";
DwtHtmlEditor._TIMES = "Times New Roman, Times, serif";
DwtHtmlEditor._VERDANA = "Verdana, Arial, Helvetica, sans-serif";

DwtHtmlEditor._ARIAL_RE = /arial|helvetica|sans-serif/;
DwtHtmlEditor._TIMES_RE = /times|serif/;
DwtHtmlEditor._VERDANA_RE = /verdana/;
DwtHtmlEditor._COURIER_RE = /courier|mono/;


DwtHtmlEditor._H1_RE = /Heading 1|h1/;
DwtHtmlEditor._H2_RE = /Heading 2|h2/;
DwtHtmlEditor._H3_RE = /Heading 2|h3/;
DwtHtmlEditor._H4_RE = /Heading 2|h4/;
DwtHtmlEditor._H5_RE = /Heading 2|h5/;
DwtHtmlEditor._H6_RE = /Heading 2|h6/;
DwtHtmlEditor._PARAGRAPH_RE = /Normal|p/;
DwtHtmlEditor._ADDRESS_RE = /Address|address/;
DwtHtmlEditor._PREFORMATTED_RE = /Formatted|pre/;

DwtHtmlEditor._FONT_NAME = "fontname";
DwtHtmlEditor._FONT_SIZE = "fontsize";
DwtHtmlEditor._FONT_COLOR = "forecolor";
DwtHtmlEditor._FONT_HILITE = "hilitecolor";
DwtHtmlEditor._FONT_HILITE_IE = "backcolor";
DwtHtmlEditor._FORMAT_BLOCK = "formatblock";

/*cut
copy
paste
undo
redo
*/

DwtHtmlEditor._INITDELAY = 50;


DwtHtmlEditor._BLOCK_ELEMENTS = {
	address:1, body:1, div:1, dl:1, fieldset:1, form:1, h1:1, h2:1, h3:1, h4:1, h5:1, h6:1, 
	iframe:1, li:1, ol:1, p:1, pre:1, quote:1, table:1, tbody:1, td:1, textarea:1, tfoot: 1, 
	thead:1, tr:1, ul:1
};

DwtHtmlEditor._KEY2CMDS = {
	"b":DwtHtmlEditor.BOLD_STYLE, "i":DwtHtmlEditor.ITALIC_STYLE, "u":DwtHtmlEditor.UNDERLINE_STYLE, 
	"s":DwtHtmlEditor.STRIKETHRU_STYLE, "l":DwtHtmlEditor.JUSTIFY_LEFT, "e":DwtHtmlEditor.JUSTIFY_CENTER, 
	"r":DwtHtmlEditor.JUSTIFY_RIGHT, "j":DwtHtmlEditor.JUSTIFY_FULL, "1":DwtHtmlEditor._STYLES[1],
	"2":DwtHtmlEditor._STYLES[1], "3":DwtHtmlEditor._STYLES[3], "4":DwtHtmlEditor._STYLES[4], 
	"5":DwtHtmlEditor._STYLES[5], "6":DwtHtmlEditor._STYLES[6], "0":"DUMP"
};

DwtHtmlEditor.prototype.focus =
function() {
	if (this._mode == DwtHtmlEditor.TEXT) {
		document.getElementById(this._textAreaId).focus();
	} else {
		try {
			this._getIframeWin().focus();
			// Hack to fix IE focusing bug
			if (AjxEnv.isIE) {
				if (this._currInsPt) {
					if (this._currInsPt.text.length <= 1)
						this._currInsPt.collapse(false);
					this._currInsPt.select();
				}
			}
		} catch (ex) {
			// whateva
		}
	}
}

DwtHtmlEditor.prototype.addStateChangeListener = 
function(listener) {
	this.addListener(DwtEvent.STATE_CHANGE, listener);
}

DwtHtmlEditor.prototype.removeStateChangeListener = 
function(listener) { 
	this.removeListener(DwtEvent.STATE_CHANGE, listener);
}

DwtHtmlEditor.prototype.clear =
function() {
	this.setContent("");
}

DwtHtmlEditor.prototype.enable =
function(enable) {
	if (this._textAreaId != null)
		document.getElementById(this._textAreaId).disabled = !enable;
	if (this._iFrameId != null)
		document.getElementById(this._iframeId).disabled = !enable;
}

DwtHtmlEditor.prototype.setBlankIframeSrc = 
function(src) {
	this._blankIframeSrc = src;
};

DwtHtmlEditor.prototype.isHtmlEditingSupported =
function() {
	return (!AjxEnv.isGeckoBased && !AjxEnv.isIE) ? false : true;
}

/**
 * Get the content
*/
DwtHtmlEditor.prototype.getContent =
function() {
	if (this._mode == DwtHtmlEditor.HTML) {
		var iframeDoc = this._getIframeDoc();
		return iframeDoc && iframeDoc.body ? (this._initialStyle + this._getIframeDoc().body.innerHTML) : "";
	} else {
		return document.getElementById(this._textAreaId).value;
	}
}

/**
 * Set the content to be displayed. This can be HTML
*/
DwtHtmlEditor.prototype.setContent =
function(content) {
	if (this._mode == DwtHtmlEditor.HTML) {
		// If the html is initialed then go ahead and set the content, else let the
		// _finishHtmlModeInit run before we try setting the content
		if (this._htmlModeInited) {
			this._pendingContent = content ? ((content instanceof AjxVector) ? content[0] : content) : "";
			this._setContentOnTimer();
		} else {
			var ta = new AjxTimedAction(this, this.setContent, [content]);
			AjxTimedAction.scheduleAction(ta, DwtHtmlEditor._INITDELAY + 1);
		}
	} else {
		document.getElementById(this._textAreaId).value = (content || "");
	}
}

DwtHtmlEditor.prototype.insertElement =
function(element) {
	this._execCommand(element);
}

/** Inserts a table at the current cursor position 
 * 
 * @param rows [Int] - The number of rows in the table
 * @param cols [Int] - The number of columns in the table
 * @param width [String] - The width of the table. The units should be part of this value e.g. "100%" or "10px"
 * @param cellSpacing [Int] - Cell spacing in the table
 * @param cellPadding [Int] - Cell padding in the table
 * @param alignment [String] - The alignment of the table. This is one of valid alignment values for the HTML
 *    <table> element 
 */
DwtHtmlEditor.prototype.insertTable =
function(rows, cols, width, cellSpacing, cellPadding, alignment) {
DBG.println("Rows: " + rows);
DBG.println("Cols: " + cols);
DBG.println("Width: " + width);
DBG.println("CellSpacing: " + cellSpacing);
DBG.println("CellPadding: " + cellPadding);
DBG.println("alignment: " + alignment);
	if (this._mode != DwtHtmlEditor.HTML)
		return;
    
	var doc = this._getIframeDoc();
	var table = doc.createElement("table");
  
	if (width) table.width = width;
	if (alignment) table.align = alignment.toLowerCase();
	if (cellSpacing) table.cellSpacing = cellSpacing; 
	if (cellPadding) table.cellPadding = cellPadding;
	
	table.border = 1;
	table.style.border = "1px solid #000";   
    table.rules = "all";
	table.style.borderCollapse = "collapse";
  
  	var tdWidth = "";
  	if (1)
  		tdWidth = Math.floor(100 / cols) + "%";

	var tbody = doc.createElement("tbody");
	table.appendChild(tbody); 		
	for (var i = 0; i < rows; i++) {
		var tr = doc.createElement("tr");
		tbody.appendChild(tr);
		for (var j = 0; j < cols; j++) {
			var td = doc.createElement("td");
			if (tdWidth)
				td.style.width = tdWidth;
			if (AjxEnv.isGeckoBased)
				td.appendChild(doc.createElement("br"));
			tr.appendChild(td);
    	}
	}
  
	this._insertNodeAtSelection(table);
}

DwtHtmlEditor.prototype._insertNodeAtSelection =
function(node) {
	if (!AjxEnv.isIE) {
		var range = this._getRange();
		this._getIframeWin().getSelection().removeAllRanges()
		range.deleteContents();
		range.insertNode(node);
		range.selectNodeContents(node);
	} else {
		this._getRange().pasteHTML(node.outerHTML);
	}
}


/**
* Changes the editor mode.
*
* @param mode	The new mode
* @param convert	If new mode -> HTML and convert, then the content of the widget is escaped. If
*		mode -> Text and convert, then text is stripped out of content
*/
DwtHtmlEditor.prototype.setMode =
function(mode, convert) {
	if (mode == this._mode || 
		(mode != DwtHtmlEditor.HTML && mode != DwtHtmlEditor.TEXT))
	{
		return;
	}

	this._mode = mode;
	if (mode == DwtHtmlEditor.HTML) {
		var textArea = document.getElementById(this._textAreaId);
		var iFrame;
		var idoc = this._getIframeDoc();

		// bug fix #6788 - Safari seems to lose its document so recreate
		if (this._iFrameId != null && idoc) {
			idoc.body.innerHTML = (convert) 
				? AjxStringUtil.convertToHtml(textArea.value) 
				: textArea.value;
			iFrame = document.getElementById(this._iFrameId);
		} else {
			iFrame = this._initHtmlMode((convert) 
				? AjxStringUtil.convertToHtml(textArea.value) 
				: textArea.value);
		}
		Dwt.setVisible(textArea, false);
		Dwt.setVisible(iFrame, true);

		// XXX: mozilla hack
		if (AjxEnv.isGeckoBased)
			this._enableDesignMode(this._getIframeDoc());
	} else {
		var textArea = this._textAreaId != null
			? document.getElementById(this._textAreaId)
			: this._initTextMode(true);
		
		// If we have pending content, then an iFrame is being created. This can happen
		// if the widget is instantiated and immediate setMode is called w/o getting out
		// to the event loop where _finishHtmlMode is triggered
		var content = (!this._pendingContent) 
			? this._getIframeDoc().innerHTML 
			: (this._pendingContent || "");

		textArea.value = (convert) 
			? this._convertHtml2Text() 
			: this._getIframeDoc().innerHTML;;

		Dwt.setVisible(document.getElementById(this._iFrameId), false);
		Dwt.setVisible(textArea, true);	
	}
}

DwtHtmlEditor.prototype.setTextDirection =
function(direction) {
	if (this._mode != DwtHtmlEditor.HTML)
		return;
		
	var dir = (direction == DwtHtmlEditor.DIRECTION_R2L) ? "rtl" : "ltr";
	var el = this._getParentElement();
	
	DBG.println("EL: " + el.tagName.toLowerCase() + " - " + DwtHtmlEditor._BLOCK_ELEMENTS[el.tagName.toLowerCase()]);

	while (el && !DwtHtmlEditor._BLOCK_ELEMENTS[el.tagName.toLowerCase()])
		el = el.parentNode;
		
	if (el)
		el.style.direction = el.style.direction == dir ? "" : dir;
}

// Font sizes should be 1-7
DwtHtmlEditor.prototype.setFont =
function(family, style, size, color, hiliteColor) {
	if (family) {
		switch (family) {
			case DwtHtmlEditor.ARIAL:
				this._execCommand(DwtHtmlEditor._FONT_NAME, DwtHtmlEditor._ARIAL);
				break;			
			case DwtHtmlEditor.COURIER:
				this._execCommand(DwtHtmlEditor._FONT_NAME, DwtHtmlEditor._COURIER);
				break;			
			case DwtHtmlEditor.TIMES:
				this._execCommand(DwtHtmlEditor._FONT_NAME, DwtHtmlEditor._TIMES);
				break;	
			case DwtHtmlEditor.VERDANA:
				this._execCommand(DwtHtmlEditor._FONT_NAME, DwtHtmlEditor._VERDANA);
				break;	
		}
	}
	
	if (style)
		this._execCommand(style);
		
	if (size && size > 0 && size < 8)
		this._execCommand(DwtHtmlEditor._FONT_SIZE, size);
		
	if (color)
		this._execCommand(DwtHtmlEditor._FONT_COLOR, color);

	if (hiliteColor)
		this._execCommand((AjxEnv.isIE) ? DwtHtmlEditor._FONT_HILITE_IE : DwtHtmlEditor._FONT_HILITE, hiliteColor);
}

DwtHtmlEditor.prototype.setJustification =
function(justification) {
	this._execCommand(justification);
}

DwtHtmlEditor.prototype.setIndent =
function(indent) {
	this._execCommand(indent);
}

DwtHtmlEditor.prototype.setStyle =
function(style) {
	this._execCommand(DwtHtmlEditor._FORMAT_BLOCK, DwtHtmlEditor._STYLES[style]);
}

DwtHtmlEditor.prototype.setSize =
function(width, height) {
	DwtComposite.prototype.setSize.call(this, width, height);
	var htmlEl = this.getHtmlElement();
	
	if (this._iFrameId != null) {
		var iFrame = document.getElementById(this._iFrameId);
		iFrame.width = htmlEl.style.width;
		iFrame.height = htmlEl.style.height;
	} else {
		var textArea = document.getElementById(this._textAreaId);
		textArea.style.width = htmlEl.style.width;
		textArea.style.height = htmlEl.style.height;
	}
}

DwtHtmlEditor.prototype.getIframe = 
function() {
	return document.getElementById(this._iFrameId);
}

DwtHtmlEditor.prototype._initialize = 
function() {
	if (this._mode == DwtHtmlEditor.HTML) 
		this._initHtmlMode(this._pendingContent);
	else
		this._initTextMode();
}

DwtHtmlEditor.prototype._initTextMode =
function(ignorePendingContent) {
	var htmlEl = this.getHtmlElement();
	this._textAreaId = "textarea_" + Dwt.getNextId();
	var textArea = document.createElement("textarea");
	textArea.className = "DwtHtmlEditorTextArea";
	textArea.id = this._textAreaId;
	htmlEl.appendChild(textArea);
	
	// We will ignore pending content if we are called from setMode. See setMode for
	// documentation
	if (!ignorePendingContent) {
		textArea.value = this._pendingContent;
		this._pendingContent = null;
	}
	return textArea;
}

DwtHtmlEditor.prototype._initHtmlMode =
function(content) {
	var iFrame = this._createIFrameEl();

	this._keyEvent = new DwtKeyEvent();
	this._stateEvent = new DwtHtmlEditorStateEvent();
	this._stateEvent.dwtObj = this;

	this._updateStateAction = new AjxTimedAction(this, this._updateState);

	this._pendingContent = content || "";

	// IE can sometimes race ahead and execute script before the underlying component is created
	var timedAction = new AjxTimedAction(this, this._finishHtmlModeInit);
	AjxTimedAction.scheduleAction(timedAction, DwtHtmlEditor._INITDELAY);
	
	return iFrame;
}

/**
* @param useDiv 	Set this to true if prepending to the message body. False is 
* 					used to set the default settings for compose editor so as 
* 					you type the fonts appear as they would if the message we 
* 					being read by the receiver
*/
DwtHtmlEditor.prototype._getInitialStyle = 
function(useDiv) {
	var initFontFamily = this._getInitialFontFamily();
	var initFontSize = this._getInitialFontSize();
	var initFontColor = this._getInitialFontColor();

	var html = new Array();
	var i = 0;
	
	if (useDiv) {
		html[i++] = "<div style='";
		html[i++] = "font-family:" + initFontFamily + ";";
		html[i++] = "font-size:" + initFontSize + ";";
		html[i++] = "color:" + initFontColor + ";";
		html[i++] = "'>";
	} else {
		html[i++] = "<style type='text/css'>";
		html[i++] = "p { ";
		html[i++] = "font-family:" + initFontFamily + ";";
		html[i++] = "font-size:" + initFontSize + ";";
		html[i++] = "color:" + initFontColor + ";";
		html[i++] = " } ";
		html[i++] = "body { ";
		html[i++] = "font-family:" + initFontFamily + ";";
		html[i++] = "font-size:" + initFontSize + ";";
		html[i++] = "color:" + initFontColor + ";";
		html[i++] = " } ";
		html[i++] = "</style>";
	}
	return html.join("");
}

// overload me to initialize to different font family
DwtHtmlEditor.prototype._getInitialFontFamily = 
function() {
	return DwtHtmlEditor._TIMES;
}

// overload me to initialize to different font size
DwtHtmlEditor.prototype._getInitialFontSize = 
function() {
	return "12pt";
}

// overload me to initialize to different font color
DwtHtmlEditor.prototype._getInitialFontColor = 
function() {
	return "black";
}

DwtHtmlEditor.prototype._createIFrameEl = 
function() {
	var htmlEl = this.getHtmlElement();
	this._iFrameId = "iframe_" + Dwt.getNextId();
	var iFrame = document.createElement("iframe");
	iFrame.id = this._iFrameId;
	iFrame.className = "DwtHtmlEditorIFrame";
	iFrame.setAttribute("border", "0", false);
	iFrame.setAttribute("frameborder", "0", false);
	iFrame.setAttribute("vspace", "0", false);
// 	iFrame.setAttribute("marginwidth", "0", false);
// 	iFrame.setAttribute("marginheight", "0", false);
	if (AjxEnv.isIE && location.protocol == "https:")
		iFrame.src = this._blankIframeSrc || "";
	htmlEl.appendChild(iFrame);
	
	return iFrame;
}

DwtHtmlEditor.prototype._finishHtmlModeInit =
function(params) {
	var doc = this._getIframeDoc();	
	try {
		doc.body.innerHTML = this._pendingContent || "";
	} catch (ex) {
		DBG.println("XXX: Error initializing HTML mode :XXX");
		return;
	}

	this._enableDesignMode(doc);
	this.focus();
	this._updateState();
	this._htmlModeInited = true;

	// bug fix #4722 - setting design mode for the first time seems to null 
	// out iframe doc's body in IE - so create a new body...
	if (AjxEnv.isIE) {
		doc.open();
		doc.write("");
		doc.close();
		doc.body.innerHTML = this._pendingContent || "";
	}

	this._registerEditorEventHandlers(document.getElementById(this._iFrameId), doc);
}

DwtHtmlEditor.prototype._getIframeDoc =
function() {
	return Dwt.getIframeDoc(document.getElementById(this._iFrameId));
}

DwtHtmlEditor.prototype._getIframeWin =
function() {
	return Dwt.getIframeWindow(document.getElementById(this._iFrameId));
}

DwtHtmlEditor.prototype._getParentElement = 
function() {
	if (AjxEnv.isIE) {
		var iFrameDoc = this._getIframeDoc();
		var selection = iFrameDoc.selection;
		var range = selection.createRange();
		if (selection.type == "None" || selection.type == "Text")
			// If selection is None still have a parent element
			return selection.createRange().parentElement();
		else if (selection.type == "Control")
			return selection.createRange().item(0);
		else
			return iFrameDoc.body;
	} else {
		try {
			var range = this._getRange();
			var p = range.commonAncestorContainer;
			if (!range.collapsed && range.startContainer == range.endContainer 
				&& range.startOffset - range.endOffset <= 1 && range.startContainer.hasChildNodes())
				p = range.startContainer.childNodes[range.startOffset];
			while (p.nodeType == 3)
				p = p.parentNode;
			return p;
		} catch (e) {
			return null;
		}
	}
}

DwtHtmlEditor.prototype._getRange =
function() {
	var iFrameDoc = this._getIframeDoc();
	if (AjxEnv.isIE) {
		return iFrameDoc.selection;
	} else {
		this.focus();
		var selection = this._getIframeWin().getSelection();
		if (selection != null) {
			try {
				return selection.getRangeAt(0);
			} catch(e) {
				return iFrameDoc.createRange();
			}
		} else {
			return iFrameDoc.createRange();
		}
	}
}

// This is transformed into a "simple closure" in the constructor.  Simply
// dispatch the call to _handleEditorEvent passing the right event depending on
// the browser.
DwtHtmlEditor.prototype.__eventClosure =
function(ev) {
	return this._handleEditorEvent(AjxEnv.isIE ? this._getIframeWin().event : ev);
};

DwtHtmlEditor.prototype._registerEditorEventHandlers =
function(iFrame, iFrameDoc) {
	var events = ["mouseup", "keydown", "keypress", "drag", "mousedown"];
	// Note that since we're not creating the closure here anymore, it's
	// safe to call this function any number of times (we do this for
	// Gecko/Linux to work around bugs).  The browser won't add the same
	// event if it already exists (DOM2 requirement)
	for (var i = 0; i < events.length; ++i) {
		if (AjxEnv.isIE) {
			iFrameDoc.attachEvent("on" + events[i], this.__eventClosure);
		} else {
			iFrameDoc.addEventListener(events[i], this.__eventClosure, true);
		}
	}
};

DwtHtmlEditor.prototype._handleEditorEvent =
function(ev) {
	var retVal = true;

	// If we have a mousedown event, then let DwtMenu know. This is a nasty hack that we have to do since
	// the iFrame is in a different document etc
	if (ev.type == "mousedown") {
		DwtMenu._outsideMouseDownListener(ev);
	}
	
	if (DwtKeyEvent.isKeyPressEvent(ev)) {
		var ke = this._keyEvent;
		ke.setFromDhtmlEvent(ev);
		if (ke.ctrlKey) {
			var key = String.fromCharCode(ke.charCode).toLowerCase();
			var cmd = null;
			var value = null;	

			switch (key) {
			    case '1':
			    case '2':
			    case '3':
			    case '4':
			    case '5':
			    case '6':
					cmd = DwtHtmlEditor._FORMAT_BLOCK;
					value = DwtHtmlEditor._KEY2CMDS[key];
					break;
					
				case '0':
					try {
						this.setMode((this._mode == DwtHtmlEditor.HTML) ? DwtHtmlEditor.TEXT : DwtHtmlEditor.HTML, true);
					} catch (e) {
						DBG.println("EXCEPTION!: " + e);
					}
					ke._stopPropagation = true;
					ke._returnValue = false;
					ke.setToDhtmlEvent(ev);
					retVal = false;
					break;
					
				default:
					// IE Has full on keyboard shortcuts
					//if (!AjxEnv.isIE)
						cmd = DwtHtmlEditor._KEY2CMDS[key];
					break;
			}
			if (cmd) {
				DBG.println("CMD: " + cmd);			
				this._execCommand(cmd, value);
				DBG.println("AFTER EXEC");
				ke._stopPropagation = true;
				ke._returnValue = false;
				ke.setToDhtmlEvent(ev);
				retVal = false;
			}
		}
	}
	
	// TODO notification for any updates etc
	// Set's up the a range for the current ins point or selection. This is IE only because the iFrame can
	// easily lose focus (e.g. by clicking on a button in the toolbar) and we need to be able to get back
	// to the correct insertion point/selection.
	if (AjxEnv.isIE) {
		var iFrameDoc = this._getIframeDoc();
		this._currInsPt = iFrameDoc.selection.createRange();
		// If just at the insertion point, then collapse so that we don't get
		// a range selection on a call to DwtHtmlEditor.focus()
		if (iFrameDoc.selection.type == "None") {
			this._currInsPt.collapse(false);
			this._currInsPt.text = "";
		}
	}
	
	if (this._stateUpdateActionId != null) 
		AjxTimedAction.cancelAction(this._stateUpdateActionId);
	
	this._stateUpdateActionId = AjxTimedAction.scheduleAction(this._updateStateAction, 100);

	return retVal;
}

DwtHtmlEditor.prototype._updateState =
function() {
	if (this._mode != DwtHtmlEditor.HTML)
		return;
		
	this._stateUpdateActionId = null;
	var ev = this._stateEvent;
	ev.reset();

	var iFrameDoc = this._getIframeDoc();
	try {	
		ev.isBold = iFrameDoc.queryCommandState(DwtHtmlEditor.BOLD_STYLE);
		ev.isItalic = iFrameDoc.queryCommandState(DwtHtmlEditor.ITALIC_STYLE);
		ev.isUnderline = iFrameDoc.queryCommandState(DwtHtmlEditor.UNDERLINE_STYLE);
		ev.isStrikeThru = iFrameDoc.queryCommandState(DwtHtmlEditor.STRIKETHRU_STYLE);
		ev.isSuperscript = iFrameDoc.queryCommandState(DwtHtmlEditor.SUPERSCRIPT_STYLE);
		ev.isSubscript = iFrameDoc.queryCommandState(DwtHtmlEditor.SUBSCRIPT_STYLE);
		ev.isOrderedList = iFrameDoc.queryCommandState(DwtHtmlEditor.ORDERED_LIST);
		ev.isUnorderedList = iFrameDoc.queryCommandState(DwtHtmlEditor.UNORDERED_LIST);
		
		// Don't futz with the order of the if statements below. They are important due to the 
		// nature of the RegExs
		var family = iFrameDoc.queryCommandValue(DwtHtmlEditor._FONT_NAME);
		if (family) {
			family = family.toLowerCase();
			if (family.search(DwtHtmlEditor._VERDANA_RE) != -1)
				ev.fontFamily = DwtHtmlEditor.VERDANA;
			else if (family.search(DwtHtmlEditor._ARIAL_RE) != -1)
				ev.fontFamily = DwtHtmlEditor.ARIAL;		
			else if (family.search(DwtHtmlEditor._TIMES_RE) != -1)
				ev.fontFamily = DwtHtmlEditor.TIMES;
			else if (family.search(DwtHtmlEditor._COURIER_RE) != -1)
				ev.fontFamily = DwtHtmlEditor.COURIER;
		}
		
		ev.fontSize = iFrameDoc.queryCommandValue(DwtHtmlEditor._FONT_SIZE);
		ev.backgroundColor = iFrameDoc.queryCommandValue((AjxEnv.isIE) ? "backcolor" : "hilitecolor");
		ev.color = iFrameDoc.queryCommandValue("forecolor");
		ev.justification = null;
		ev.direction = null;
		
		var style = iFrameDoc.queryCommandValue(DwtHtmlEditor._FORMAT_BLOCK);
		if (style) {
			if (style.search(DwtHtmlEditor._H1_RE) != -1)
				ev.style = DwtHtmlEditor.H1;
			else if (style.search(DwtHtmlEditor._H2_RE) != -1)
				ev.style = DwtHtmlEditor.H2;
			else if (style.search(DwtHtmlEditor._H3_RE) != -1)
				ev.style = DwtHtmlEditor.H3;
			else if (style.search(DwtHtmlEditor._H4_RE) != -1)
				ev.style = DwtHtmlEditor.H4;
			else if (style.search(DwtHtmlEditor._H5_RE) != -1)
				ev.style = DwtHtmlEditor.H5;
			else if (style.search(DwtHtmlEditor._H6_RE) != -1)
				ev.style = DwtHtmlEditor.H6;
			else if (style.search(DwtHtmlEditor._PARAGRAPH_RE) != -1)
				ev.style = DwtHtmlEditor.PARAGRAPH;
			else if (style.search(DwtHtmlEditor._ADDRESS_RE) != -1)
				ev.style = DwtHtmlEditor.ADDRESS;
			else if (style.search(DwtHtmlEditor._PREFORMATTED_RE) != -1)
				ev.style = DwtHtmlEditor.PREFORMATTED;
		}
		
		if (iFrameDoc.queryCommandState(DwtHtmlEditor.JUSTIFY_LEFT))
			ev.justification = DwtHtmlEditor.JUSTIFY_LEFT;
		else if (iFrameDoc.queryCommandState(DwtHtmlEditor.JUSTIFY_CENTER))
			ev.justification = DwtHtmlEditor.JUSTIFY_CENTER;
		else if (iFrameDoc.queryCommandState(DwtHtmlEditor.JUSTIFY_RIGHT))
			ev.justification = DwtHtmlEditor.JUSTIFY_RIGHT;
		else if (iFrameDoc.queryCommandState(DwtHtmlEditor.JUSTIFY_FULL))
			ev.justification = DwtHtmlEditor.JUSTIFY_FULL;


		// Notify any listeners
		if (this.isListenerRegistered(DwtEvent.STATE_CHANGE))
			this.notifyListeners(DwtEvent.STATE_CHANGE, ev);
	} catch (ex) {
		if (AjxEnv.isGeckoBased) {
			this._enableDesignMode(iFrameDoc);
		}
	}
}

DwtHtmlEditor.prototype._enableDesignMode =
function(iFrameDoc) {
	if (!iFrameDoc) return;
	
	try {
		iFrameDoc.designMode = "on";
		// Probably a regression of FF 1.5.0.1/Linux requires us to
		// reset event handlers here (Zimbra bug: 6545).
		if (AjxEnv.isGeckoBased && (AjxEnv.isLinux || AjxEnv.isMac))
			this._registerEditorEventHandlers(document.getElementById(this._iFrameId), iFrameDoc);
	} catch (ex) {
		//Gecko may take some time to enable design mode..
		if (AjxEnv.isGeckoBased) {
			var ta = new AjxTimedAction(this, this._enableDesignMode, [iFrameDoc]);
			AjxTimedAction.scheduleAction(ta, 10);
			return true;
		} else {
			// TODO Should perhaps throw an exception?
			return false;
		}
	}
}

DwtHtmlEditor.prototype._setContentOnTimer = 
function() {
	var iframeDoc = this._getIframeDoc();
	try {
		iframeDoc.body.innerHTML = this._pendingContent;
		// XXX: mozilla hack
		if (AjxEnv.isGeckoBased)
			this._enableDesignMode(iframeDoc);
	} catch (ex) {
		var ta = new AjxTimedAction(this, this._setContentOnTimer);
		AjxTimedAction.scheduleAction(ta, 10);
		return true;
	}
}

DwtHtmlEditor.prototype._execCommand =
function(command, option) {
	if (this._mode != DwtHtmlEditor.HTML)
		return;
		
// DBG.println("CMD: " + command + " - Option: " + option);

	try {
		this.focus();
		this._getIframeDoc().execCommand(command, false, option);	
	} catch (e) {
		// perhaps retry the command?
		this._enableDesignMode(this._getIframeDoc());
	}
	this._updateState();
}

DwtHtmlEditor.prototype._convertHtml2Text =
function() {
	var iFrameDoc = this._getIframeDoc();
	return iFrameDoc && iFrameDoc.body ? 
		AjxStringUtil.convertHtml2Text(iFrameDoc.body) : "";
}
