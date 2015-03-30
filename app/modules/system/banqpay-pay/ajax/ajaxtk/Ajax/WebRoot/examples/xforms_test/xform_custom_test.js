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


function ColorSwatch(attributes) {
	// copy any props passed in into the object
	for (var prop in attributes) {
		this[prop] = attributes[prop];
	}
}

ColorSwatch.prototype.value = 'white';

ColorSwatch.prototype.setValue = 
function(value) {
	this.value = value;
}

ColorSwatch.prototype.resetStyle =
function(element) {
	element.style.width = '30px';
	element.style.border = 'black solid 1px';
	element.style.backgroundColor = this.value;
}

ColorSwatch.prototype.insertIntoXForm = 
function(form, item, element) {
	element.innerHTML = "&nbsp;";
}

ColorSwatch.prototype.updateInXForm = 
function(form, item, value, element) {
	this.setValue(value);
	this.resetStyle(element);
}

function ColorSwatchWidget() {}
XFormItemFactory.createItemType("_COLOR_SWATCH_", "color_swatch", ColorSwatchWidget, _WIDGET_ADAPTOR_);

ColorSwatchWidget.prototype.constructWidget =
function() {
	var attributes = {
		// place widget attributes here
	};
	return new ColorSwatch(attributes);
}

// register new composite type
function ColorInput() {}
XFormItemFactory.createItemType("_COLOR_", "color", ColorInput, _COMPOSITE_);

ColorInput.COLORS = {
    white: "#FFF", black: "#000",
	red: "#F00", green: "#0F0", blue: "#00F"
};

ColorInput.getHex = function(value) {
	// color name
	if (!value.match(/^#/)) {
	    value = ColorInput.COLORS[value in ColorInput.COLORS ? value : ColorInput.prototype.value];
	}
	// short value: #xyz
	if (value.length == 4) {
	    var r = value.substr(1,1);
	    var g = value.substr(2,1);
	    var b = value.substr(3,1);
	    value = '#'+r+r+g+g+b+b;
	}
	// long value: #xxyyzz
	return value;
}

ColorInput.getRed = function(value) {
	return ColorInput.getHex(value).substr(1,2);
}

ColorInput.getGreen = function(value) {
	return ColorInput.getHex(value).substr(3,2);
}

ColorInput.getBlue = function(value) {
	return ColorInput.getHex(value).substr(5,2);
}

ColorInput.prototype.setRed = function(value) {
	if (value.length == 1) { value = '0'+value; }
	var ivalue = this.getInstanceValue();
	return '#' + value + ColorInput.getGreen(ivalue) + ColorInput.getBlue(ivalue);
}

ColorInput.prototype.setGreen = function(value) {
	if (value.length == 1) { value = '0'+value; }
	var ivalue = this.getInstanceValue();
	return '#' + ColorInput.getRed(ivalue) + value + ColorInput.getBlue(ivalue);
}

ColorInput.prototype.setBlue = function(value) {
	if (value.length == 1) { value = '0'+value; }
	var ivalue = this.getInstanceValue();
	return '#' + ColorInput.getRed(ivalue) + ColorInput.getGreen(ivalue) + value;
}

ColorInput.prototype.numCols = 7;
ColorInput.prototype.items = [
	{ ref: ".", type: _INPUT_, label: "R", width: "3em",
	    getDisplayValue: function(value) {
	        return ColorInput.getRed(value);
	    },
	    onChange: function(value, event, form) {
	        var colorInput = this.getParentItem();
	        return colorInput.setRed(value);
	    }
	},
	{ ref: ".", type: _INPUT_, label: "G", width: "3em",
	    getDisplayValue: function(value) {
	        return ColorInput.getGreen(value);
	    },
	    onChange: function(value, event, form) {
	        var colorInput = this.getParentItem();
	        return colorInput.setGreen(value);
	    }
	},
	{ ref: ".", type: _INPUT_, label: "B", width: "3em",
	    getDisplayValue: function(value) {
	        return ColorInput.getBlue(value);
	    },
	    onChange: function(value, event, form) {
	        var colorInput = this.getParentItem();
	        return colorInput.setBlue(value);
        }
    },
	{ ref: ".", type: _COLOR_SWATCH_, labelLocation: _NONE_ }
];

var form = {
  	items: [
		{ ref: "color", type: _COLOR_ },
	   	{ ref: "color", type: _INPUT_ }
	]
};

var model = {
	items: [
		{ id: "color", label: "Favorite Color:" }
	]
};

var instances = { 
	Name: { color: 'red' },
	"Short Hex": { color: '#0f0' },
	"Long Hex": { color: '#0000ff' }
};

registerForm("Custom Controls", new XForm(form, new XModel(model)), instances);