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
* Creates a label.
* @constructor
* @class
* This class represents a label, which consists of an image and/or some text. It is used
* both as a concrete class and as the base class for buttons. The label's components are
* managed within a table. The label can be enabled or disabled, which are reflected in 
* its display. A disabled label looks greyed out.
*
* @author Ross Dargahi
* @param parent		the parent widget
* @param style		the label style (a bitsum of constants)
* @param className	a CSS class
* @param posStyle	positioning style
*/
function DwtLabel(parent, style, className, posStyle) {

	if (arguments.length == 0) return;
	className = className ? className : "DwtLabel";
	DwtComposite.call(this, parent, className, posStyle);

	this._style = style ? style : (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_CENTER);

	this._createTable();
	this.setCursor("default");
}

DwtLabel.prototype = new DwtComposite;
DwtLabel.prototype.constructor = DwtLabel;

// display styles
DwtLabel.IMAGE_LEFT = 1;
DwtLabel.IMAGE_RIGHT = 2;
DwtLabel.ALIGN_LEFT = 4;
DwtLabel.ALIGN_RIGHT = 8;
DwtLabel.ALIGN_CENTER = 16;
DwtLabel._LAST_STYLE = 16;

// Public methods

DwtLabel.prototype.toString = 
function() {
	return "DwtLabel";
}

DwtLabel.prototype._createTable =
function() {
	this._table = document.createElement("table");
	this._table.border = 0;
	
	// Left is the default alignment. Note that if we do an explicit align left, Firefox freaks out
	if (this._style & DwtLabel.ALIGN_RIGHT)
		this._table.align = "right";
	else if (!(this._style & DwtLabel.ALIGN_LEFT)) {
		this._table.align = "center";
		this._table.width = "100%";
	}

	this._row = this._table.insertRow(0);
	this.getHtmlElement().appendChild(this._table);
};

/**
* Sets the enabled/disabled state of the label. A disabled label may have a different
* image, and greyed out text.
*
* @param enabled	whether to enable the label
*/
DwtLabel.prototype.setEnabled =
function(enabled) {
	if (enabled != this._enabled) {
		DwtControl.prototype.setEnabled.call(this, enabled);
		if (enabled) {
			this._setImage(this._imageInfo);
			if (this._textCell != null)
				this._textCell.className = "";
		} else {
			if (this._disabledImageInfo)
				this._setImage(this._disabledImageInfo);
			if (this._textCell)
				this._textCell.className = "DisabledText";
		}
	}
}

/**
* Returns the current Image Info.
*/
DwtLabel.prototype.getImage =
function() {
	return this._imageInfo;
}

/**
* Sets the main (enabled) image. If the label is currently enabled, its image is updated.
*/
DwtLabel.prototype.setImage =
function(imageInfo) {
	this._imageInfo = imageInfo;
	if (this._enabled || (!this._enabled && this._disabledImageInfo))
		this._setImage(imageInfo);
}

/**
* Returns the disabled image. If the label is currently disabled, its image is updated.
*
* @param imageSrc	the disabled image
*/
DwtLabel.prototype.setDisabledImage =
function(imageInfo) {
	this._disabledImageInfo = imageInfo;
	if (!this._enabled && imageInfo)
		this._setImage(imageInfo);
}

/**
* Returns the label text.
*/
DwtLabel.prototype.getText =
function() {
	return (this._text != null) ? this._text.data : null;
}

/**
* Sets the label text, and manages its placement and display.
*
* @param text	the new label text
*/
DwtLabel.prototype.setText =
function(text) {
	if (text == null || text == "") {
		if (this._textCell != null) {
			var cellIndex = Dwt.getCellIndex(this._textCell);
			this._row.deleteCell(cellIndex);
		}
	} else {
		if (this._text == null) {
		  this._text = document.createTextNode(text);
		}
		this._text.data = text;
		var idx;
		if (this._textCell == null) {
			if (this._style & DwtLabel.IMAGE_RIGHT) {
				idx = 0;
			} else {
				idx = (this._imageCell != null) ? 1 : 0;
			}
			this._textCell = this._row.insertCell(idx);
			this._textCell.className = this._enabled ? "Text" : "DisabledText";
			if (this._textBackground)
				this._textCell.style.backgroundColor = this._textBackground;
			if (this._textForeground)
				this._textCell.style.color = this._textForeground;
			this._doAlign();
			this._textCell.noWrap = true;
			this._textCell.style.verticalAlign = "middle";
			this._textCell.appendChild(this._text);
		}
	}
}

DwtLabel.prototype.setTextBackground =
function(color) {
	this._textBackground = color;
	if (this._textCell)
		this._textCell.style.backgroundColor = color;
}

DwtLabel.prototype.setTextForeground =
function(color) {
	this._textForeground = color;
	if (this._textCell)
		this._textCell.style.color = color;
}


DwtLabel.prototype.setAlign =
function(alignStyle) {
	this._style = alignStyle;
	
	// reset dom since alignment style may have changed
	if (this._textCell) {
		this._row.removeChild(this._textCell);
		this._textCell = null;
		this.setText(this._text.data)
	}
	if (this._imageCell) {
		this._row.removeChild(this._imageCell);
		this._imageCell = null;
		this._setImage(this._imageInfo);
	}
}

// Private methods

// Set the label's image, and manage its placement.
DwtLabel.prototype._setImage =
function(imageInfo) {
	if (!imageInfo) {
		if (this._imageCell) {
			var cellIndex = Dwt.getCellIndex(this._imageCell);
			this._row.deleteCell(cellIndex);
			this._imageCell = null;
		}
	} else {
		var idx;
		if (!this._imageCell) {
			if (this._style & DwtLabel.IMAGE_LEFT) {
				idx = 0;
			} else {
				idx = this._textCell ? 1 : 0;
			}
			this._imageCell = this._row.insertCell(idx);
			this._doAlign();
		}
		AjxImg.setImage(this._imageCell, imageInfo);
	}	
}

// Handle the alignment style.
DwtLabel.prototype._doAlign =
function() {
	if (this._style & DwtLabel.ALIGN_CENTER) {
		if (this._imageCell != null && this._textCell != null) {
			// XXX: this doesnt seem right (no pun intended)
			if (this._style & DwtLabel.IMAGE_LEFT) {
				this._imageCell.align = "right";
				this._textCell.align = "left";
			} else {
				this._imageCell.align = "left";
				this._textCell.align = "right";
			}
		} else if (this._imageCell != null) {
			this._imageCell.align = "center";
		} else if (this._textCell != null) {
			this._textCell.align = "center";
		}
	}
}
