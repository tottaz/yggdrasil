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


function DwtHtmlEditorExample(parent) {
	this._createToolBar1(parent);
	this._createToolBar2(parent);
	this.rte = new DwtHtmlEditor(parent, null, DwtControl.ABSOLUTE_STYLE, false, null);
	this.rte.setMode(DwtHtmlEditor.HTML);
	var tbHeight = this._toolbar1.getSize().y + this._toolbar2.getSize().y;
	this.rte.setLocation(0, tbHeight);
	var parentSz = parent.getSize();
	var iframe = this.rte.getIframe();
	Dwt.setSize(iframe, parentSz.x, parentSz.y - tbHeight - 2);
	this.rte.zShow(true);

	this.rte.addStateChangeListener(new AjxListener(this, this._rteStateChangeListener));	
}

DwtHtmlEditorExample._VALUE = "value";

DwtHtmlEditorExample.run =
function() {
	var shell = new DwtShell("MainShell", false, null, null, true);
	var tst = new DwtHtmlEditorExample(shell);
}

DwtHtmlEditorExample.prototype._styleListener =
function(ev) {
	this.rte.setStyle(ev._args.newValue);
};

DwtHtmlEditorExample.prototype._fontNameListener =
function(ev) {
	this.rte.setFont(ev._args.newValue);
};

DwtHtmlEditorExample.prototype._fontSizeListener =
function(ev) {
	this.rte.setFont(null, null, ev._args.newValue);
};

DwtHtmlEditorExample.prototype._directionListener =
function(ev) {
	this.rte.setTextDirection(ev.item.getData(DwtHtmlEditorExample._VALUE));
};

DwtHtmlEditorExample.prototype._indentListener =
function(ev) {
	this.rte.setIndent(ev.item.getData(DwtHtmlEditorExample._VALUE));
};

DwtHtmlEditorExample.prototype._insElementListener =
function(ev) {
	this.rte.insertElement(ev.item.getData(DwtHtmlEditorExample._VALUE));
};

DwtHtmlEditorExample.prototype._justificationListener =
function(ev) {
	this.rte.setJustification(ev.item.getData(DwtHtmlEditorExample._VALUE));
};

DwtHtmlEditorExample.prototype._fontStyleListener =
function(ev) {
	this.rte.setFont(null, ev.item.getData(DwtHtmlEditorExample._VALUE));
};

DwtHtmlEditorExample.prototype._fontColorListener =
function(ev) {
	this.rte.setFont(null, null, null, ev.detail, null);
};

DwtHtmlEditorExample.prototype._fontHiliteListener =
function(ev) {
	this.rte.setFont(null, null, null, null, ev.detail);
};

DwtHtmlEditorExample.prototype._createToolBar1 =
function(parent) {
	var tb = this._toolbar1 = new DwtToolBar(parent, "ToolBar", DwtControl.ABSOLUTE_STYLE, 2);
	tb.zShow(true);
	tb.setLocation(0, 0);

	this._createStyleSelect(tb);
	this._createFontFamilySelect(tb);
	this._createFontSizeMenu(tb);
	new DwtControl(tb, "vertSep");
	
	var listener = new AjxListener(this, this._fontStyleListener);
	var b = this._boldButton = new DwtButton(tb, DwtButton.TOGGLE_STYLE, "TBButton");
	b.setImage("Bold");
	b.setToolTipContent(ExMsg.boldText);
	b.setData(DwtHtmlEditorExample._VALUE, DwtHtmlEditor.BOLD_STYLE);
	b.addSelectionListener(listener);
	
	b = this._italicButton = new DwtButton(tb, DwtButton.TOGGLE_STYLE, "TBButton");
	b.setImage("Italics");
	b.setToolTipContent(ExMsg.italicText);
	b.setData(DwtHtmlEditorExample._VALUE, DwtHtmlEditor.ITALIC_STYLE);
	b.addSelectionListener(listener);
	
	b = this._underlineButton = new DwtButton(tb, DwtButton.TOGGLE_STYLE, "TBButton");
	b.setImage("Underline");
	b.setToolTipContent(ExMsg.underlineText);
	b.setData(DwtHtmlEditorExample._VALUE, DwtHtmlEditor.UNDERLINE_STYLE);
	b.addSelectionListener(listener);
	
	b = this._strikeThruButton = new DwtButton(tb, DwtButton.TOGGLE_STYLE, "TBButton");
	b.setImage("StrikeThru");
	b.setToolTipContent(ExMsg.strikeThruText);
	b.setData(DwtHtmlEditorExample._VALUE, DwtHtmlEditor.STRIKETHRU_STYLE);
	b.addSelectionListener(listener);

	b = this._superscriptButton = new DwtButton(tb, DwtButton.TOGGLE_STYLE, "TBButton");
	b.setImage("Superscript");
	b.setToolTipContent(ExMsg.superscript);
	b.setData(DwtHtmlEditorExample._VALUE, DwtHtmlEditor.SUPERSCRIPT_STYLE);
	b.addSelectionListener(listener);
	
	b = this._subscriptButton = new DwtButton(tb, DwtButton.TOGGLE_STYLE, "TBButton");
	b.setImage("Subscript");
	b.setToolTipContent(ExMsg.subscript);
	b.setData(DwtHtmlEditorExample._VALUE, DwtHtmlEditor.SUBSCRIPT_STYLE);
	b.addSelectionListener(listener);
};

DwtHtmlEditorExample.prototype._createToolBar2 =
function(parent) {
	var tb = this._toolbar2 = new DwtToolBar(parent, "ToolBar", DwtControl.ABSOLUTE_STYLE, 2);
	tb.zShow(true);
	var y = this._toolbar1.getSize().y;
	tb.setLocation(0, y);
	
	var listener = new AjxListener(this, this._justificationListener);
	var b = this._leftJustifyButton = new DwtButton(tb, DwtButton.TOGGLE_STYLE, "TBButton");
	b.setImage("LeftJustify");
	b.setToolTipContent(ExMsg.leftJustify);
	b.setData(DwtHtmlEditorExample._VALUE, DwtHtmlEditor.JUSTIFY_LEFT);
	b.addSelectionListener(listener);
	
	b = this._centerJustifyButton = new DwtButton(tb, DwtButton.TOGGLE_STYLE, "TBButton");
	b.setImage("CenterJustify");
	b.setToolTipContent(ExMsg.centerJustify);
	b.setData(DwtHtmlEditorExample._VALUE, DwtHtmlEditor.JUSTIFY_CENTER);
	b.addSelectionListener(listener);

	b = this._rightJustifyButton = new DwtButton(tb, DwtButton.TOGGLE_STYLE, "TBButton");
	b.setImage("RightJustify");
	b.setToolTipContent(ExMsg.rightJustify);
	b.setData(DwtHtmlEditorExample._VALUE, DwtHtmlEditor.JUSTIFY_RIGHT);
	b.addSelectionListener(listener);
	
	b = this._fullJustifyButton = new DwtButton(tb, DwtButton.TOGGLE_STYLE, "TBButton");
	b.setImage("FullJustify");
	b.setToolTipContent(ExMsg.justify);
	b.setData(DwtHtmlEditorExample._VALUE, DwtHtmlEditor.JUSTIFY_FULL);
	b.addSelectionListener(listener);
	
	new DwtControl(tb, "vertSep");

	var insElListener = new AjxListener(this, this._insElementListener);
	b = this._listButton = new DwtButton(tb, DwtButton.TOGGLE_STYLE,  "TBButton");
	b.setToolTipContent(ExMsg.bulletedList);
	b.setImage("BulletedList");
	b.setData(DwtHtmlEditorExample._VALUE, DwtHtmlEditor.UNORDERED_LIST);
	b.addSelectionListener(insElListener);
	
	b = this._numberedListButton = new DwtButton(tb, DwtButton.TOGGLE_STYLE, "TBButton");
	b.setToolTipContent(ExMsg.numberedList);
	b.setImage("NumberedList");
	b.setData(DwtHtmlEditorExample._VALUE, DwtHtmlEditor.ORDERED_LIST);
	b.addSelectionListener(insElListener);

	listener = new AjxListener(this, this._indentListener);	
	b = this._outdentButton = new DwtButton(tb, null, "TBButton");
	b.setToolTipContent(ExMsg.outdent);
	b.setImage("Outdent");
	b.setData(DwtHtmlEditorExample._VALUE, DwtHtmlEditor.OUTDENT);
	b.addSelectionListener(insElListener);
	
	b = this._indentButton = new DwtButton(tb, null, "TBButton");
	b.setToolTipContent(ExMsg.indent);
	b.setImage("Indent");
	b.setData(DwtHtmlEditorExample._VALUE, DwtHtmlEditor.INDENT);
	b.addSelectionListener(insElListener);
	
	new DwtControl(tb, "vertSep");

	b = this._fontColorButton = new DwtButton(tb, null, "TBButton");
	b.setImage("FontColor");
	b.setToolTipContent(ExMsg.fontColor);
	var m = new DwtMenu(b, DwtMenu.COLOR_PICKER_STYLE);
	var cp = new DwtColorPicker(m);
	cp.addSelectionListener(new AjxListener(this, this._fontColorListener));
	b.setMenu(m);
	
	b = this._fontBackgroundButton = new DwtButton(tb, null, "TBButton");
	b.setImage("FontBackground");
	b.setToolTipContent(ExMsg.fontBackground);
	m = new DwtMenu(b, DwtMenu.COLOR_PICKER_STYLE);
	cp = new DwtColorPicker(m);
	cp.addSelectionListener(new AjxListener(this, this._fontHiliteListener));
	b.setMenu(m);
	
	new DwtControl(tb, "vertSep");
	
	b = this._horizRuleButton = new DwtButton(tb, null, "TBButton");
	b.setImage("HorizRule");
	b.setToolTipContent(ExMsg.horizRule);
	b.setData(DwtHtmlEditorExample._VALUE, DwtHtmlEditor.HORIZ_RULE);
	b.addSelectionListener(insElListener);
};

DwtHtmlEditorExample.prototype._createStyleSelect =
function(tb) {
	var listener = new AjxListener(this, this._styleListener);
	var s = this._styleSelect = new DwtSelect(tb, null);
	s.addChangeListener(listener);
	
	s.addOption("Normal", true, DwtHtmlEditor.PARAGRAPH);
	s.addOption("Heading 1", false, DwtHtmlEditor.H1);
	s.addOption("Heading 2", false, DwtHtmlEditor.H2);
	s.addOption("Heading 3", false, DwtHtmlEditor.H3);
	s.addOption("Heading 4", false, DwtHtmlEditor.H4);
	s.addOption("Heading 5", false, DwtHtmlEditor.H5);
	s.addOption("Heading 6", false, DwtHtmlEditor.H6);
	s.addOption("Address", false, DwtHtmlEditor.ADDRESS);
	s.addOption("Preformatted", false, DwtHtmlEditor.PREFORMATTED);
};

DwtHtmlEditorExample.prototype._createFontFamilySelect =
function(tb) {
	var listener = new AjxListener(this, this._fontNameListener);
	var s = this._fontFamilySelect = new DwtSelect(tb, null);
	s.addChangeListener(listener);
	
	s.addOption("Arial", false, DwtHtmlEditor.ARIAL);
	s.addOption("Times New Roman", true, DwtHtmlEditor.TIMES);
	s.addOption("Courier New", false, DwtHtmlEditor.COURIER);
	s.addOption("Verdana", false, DwtHtmlEditor.VERDANA);
};

DwtHtmlEditorExample.prototype._createFontSizeMenu =
function(tb) {
	var listener = new AjxListener(this, this._fontSizeListener);
	var s = this._fontSizeSelect = new DwtSelect(tb, null);
	s.addChangeListener(listener);
	
	s.addOption("1 (8pt)", false, 1);
	s.addOption("2 (10pt)", false, 2);
	s.addOption("3 (12pt)", true, 3);
	s.addOption("4 (14pt)", false, 4);
	s.addOption("5 (18pt)", false, 5);
	s.addOption("6 (24pt)", false, 6);
	s.addOption("7 (36pt)", false, 7);
};

DwtHtmlEditorExample.prototype._rteStateChangeListener =
function(ev) {

	this._boldButton.setToggled(ev.isBold);
	this._underlineButton.setToggled(ev.isUnderline);
	this._italicButton.setToggled(ev.isItalic);
	this._strikeThruButton.setToggled(ev.isStrikeThru);
	this._subscriptButton.setToggled(ev.isSubscript);
	this._superscriptButton.setToggled(ev.isSuperscript);
	
	this._numberedListButton.setToggled(ev.isOrderedList);
	this._listButton.setToggled(ev.isUnorderedList);

	if (ev.style)
		this._styleSelect.setSelectedValue(ev.style);

	if (ev.fontFamily)
		this._fontFamilySelect.setSelectedValue(ev.fontFamily);
		
	if (ev.fontSize && ev.fontFamily != "")
		this._fontSizeSelect.setSelectedValue(ev.fontSize);
	
	if (ev.justification == DwtHtmlEditor.JUSTIFY_LEFT) {
		this._leftJustifyButton.setToggled(true);
		this._centerJustifyButton.setToggled(false);
		this._rightJustifyButton.setToggled(false);
		this._fullJustifyButton.setToggled(false);		
	} else if (ev.justification == DwtHtmlEditor.JUSTIFY_CENTER) {
		this._leftJustifyButton.setToggled(false);
		this._centerJustifyButton.setToggled(true);
		this._rightJustifyButton.setToggled(false);
		this._fullJustifyButton.setToggled(false);		
	} else if (ev.justification == DwtHtmlEditor.JUSTIFY_RIGHT) {
		this._leftJustifyButton.setToggled(false);
		this._centerJustifyButton.setToggled(false);
		this._rightJustifyButton.setToggled(true);
		this._fullJustifyButton.setToggled(false);		
	} else if (ev.justification == DwtHtmlEditor.JUSTIFY_FULL) {
		this._leftJustifyButton.setToggled(false);
		this._centerJustifyButton.setToggled(false);
		this._rightJustifyButton.setToggled(false);
		this._fullJustifyButton.setToggled(true);		
	}
};
