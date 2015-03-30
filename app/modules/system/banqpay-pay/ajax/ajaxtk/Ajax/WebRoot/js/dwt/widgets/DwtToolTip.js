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


function DwtToolTip(shell, className, dialog) {

	this.shell = shell;
	this._dialog = dialog;
	this._div = document.createElement("div");
	this._div.className = className || "DwtToolTip";
	this._div.style.position = DwtControl.ABSOLUTE_STYLE;
	this.shell.getHtmlElement().appendChild(this._div);
	Dwt.setZIndex(this._div, Dwt.Z_HIDDEN);
	Dwt.setLocation(this._div, Dwt.LOC_NOWHERE, Dwt.LOC_NOWHERE);
	var borderStyle = "hover";
	var substitutions = { id: "tooltip" };
	this._borderStart = DwtBorder.getBorderStartHtml(borderStyle, substitutions);
	this._borderEnd = DwtBorder.getBorderEndHtml(borderStyle, substitutions);	
}

DwtToolTip.TOOLTIP_DELAY = 750;

DwtToolTip.prototype.toString = 
function() {
	return "DwtToolTip";
}

DwtToolTip.prototype.getContent =
function() {
	return this._div.innerHTML;
}

DwtToolTip.prototype.setContent =
function(content, setInnerHTML) {
	this._content = content;
	if(setInnerHTML) {
		this._div.innerHTML = this._borderStart + this._content + this._borderEnd;
	}
}
	
DwtToolTip.prototype.popup = 
function(x, y, skipInnerHTML) {
	if (this._content != null) {
		if(!skipInnerHTML) {
			this._div.innerHTML = this._borderStart + this._content + this._borderEnd;
		}

		var element = this._div;
		var baseId = "tooltip";
		var clip = true;
		var dialog = this._dialog;	
		this._positionElement(element, x, y, baseId, clip, dialog);
	}
}

DwtToolTip.prototype.popdown = 
function() {
	if (this._content != null) {
		Dwt.setLocation(this._div, Dwt.LOC_NOWHERE, Dwt.LOC_NOWHERE);
	}
}

DwtToolTip.prototype._positionElement = 
function(element, x, y, baseId, clip, dialog) {
	var WINDOW_GUTTER = 5;
	var POPUP_OFFSET_X = 8;
	var POPUP_OFFSET_Y = 8;

	var tt = document.getElementById(baseId+'_tip_t');
	var tb = document.getElementById(baseId+'_tip_b');
	var t = tt;

	var ex = x;
	var ey = y;

	var w = DwtShell.getShell(window).getSize();
	var ww = w.x;
	var wh = w.y;

	var p = Dwt.getSize(element);
	var pw = p.x;
	var ph = p.y;

	var btEl = document.getElementById(baseId+'_border_tm');
	var blEl = document.getElementById(baseId+'_border_ml');
	var brEl = document.getElementById(baseId+'_border_mr');
	var bbEl = document.getElementById(baseId+'_border_bm');

	var bth = Dwt.getSize(btEl).y;
	var blw = Dwt.getSize(blEl).x;
	var brw = Dwt.getSize(brEl).x;
	var bbh = Dwt.getSize(bbEl).y;

	var ttw = Dwt.getSize(tt).x;
	var tth = Dwt.getSize(tt).y;
	var tbw = Dwt.getSize(tb).x;
	var tbh = Dwt.getSize(tb).y;

	if (AjxEnv.useTransparentPNGs) {
		var bsEl = document.getElementById(baseId+'_border_shadow_b');
		var bsh = Dwt.getSize(bsEl).y;
	}

	/***
	DBG.println(
		"---<br>"+
	    "event: &lt;"+ex+","+ey+"><br>"+
		"window: "+ww+"x"+wh+"<br>"+
	    "popup: "+pw+"x"+ph+"<br>"+
	    "borders: top="+btEl+", left="+blEl+", right="+brEl+", bottom="+bbEl+"<br>"+
	    "borders: top="+bth+", left="+blw+", right="+brw+", bottom="+bbh+"<br>"+
	    "tip: top="+ttw+"x"+tth+", bottom="+tbw+"x"+tbh
    );
    /***/

	var px = ex - pw / 2 - POPUP_OFFSET_X;
	var py;
	
	var ty;
	var tw;

	// tip up
	var adjust = tbh; // NOTE: because bottom tip is relative
	if (ph + ey + tth - bth + POPUP_OFFSET_Y < wh - WINDOW_GUTTER + adjust) {
		py = ey + tth - bth + POPUP_OFFSET_Y;
		tb.style.display = "none";
		ty = bth - tth;
		tw = ttw;
		t = tt;
	}
	
	// tip down
	else {
		py = ey - ph - tbh + bbh - POPUP_OFFSET_Y;
		py += tbh; // NOTE: because bottom tip is relative
		tt.style.display = "none";
		ty = -bbh;
		if (AjxEnv.useTransparentPNGs) {
			ty -= bsh;
		}
		tw = tbw;
		t = tb;
	}

	// make sure popup is wide enough for tip graphic
	if (pw - blw - brw < tw) {
		var contentEl = document.getElementById(baseId+"_contents");
		contentEl.width = tw; // IE
		contentEl.style.width = String(tw)+"px"; // everyone else
	}
	
	// adjust popup x-location
	if (px < WINDOW_GUTTER) {
		px = WINDOW_GUTTER;
	}
	else if (px + pw > ww - WINDOW_GUTTER) {
		px = ww - WINDOW_GUTTER - pw;
	}
	
	// adjust tip x-location
	var tx = ex - px - tw / 2;
	if (tx + tw > pw - brw) {
		tx = pw - brw - tw;
	}
	if (tx < blw) {
		tx = blw;
	}

	t.style.left = tx;
	t.style.top = ty;
	if (clip) {
		if (t == tb) {
			var y = t.offsetTop;
			element.style.clip = "rect(auto,auto,"+(y + tbh)+",auto)";
		}
		else {
			element.style.clip = "rect(auto,auto,auto,auto)";
		}
	}

	Dwt.setLocation(element, px, py);
	var zIndex = dialog ? dialog.getZIndex() + Dwt.Z_INC : Dwt.Z_TOOLTIP;
	Dwt.setZIndex(element, zIndex);
}
