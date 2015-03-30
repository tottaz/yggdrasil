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

/** Generic Property Editor Widget.
 *
 * @author Mihai Bazon
 *
 * See initProperties() below
 */
function DwtPropertyEditor(parent, useDwtInputField, className, positionType, deferred) {
	if (arguments.length > 0) {
		if (!className)
			className = "DwtPropertyEditor";
		DwtComposite.call(this, parent, className, positionType, deferred);
		this._useDwtInputField = useDwtInputField != null ? useDwtInputField : true;
		this._schema = null;
		this._init();
	}
};

DwtPropertyEditor.MSG_TIMEOUT = 4000; // 4 seconds should be plenty

DwtPropertyEditor.MSG = {
	// Now these 2 are kind of pointless...
	// We should allow a message in the prop. object.
	mustMatch     : "This field does not match validators: REGEXP",
	mustNotMatch  : "This field matches anti-validators: REGEXP" // LOL
};

DwtPropertyEditor.prototype = new DwtComposite;
DwtPropertyEditor.prototype.constructor = DwtPropertyEditor;

DwtPropertyEditor.prototype.toString = function() { return "DwtPropertyEditor"; }

DwtPropertyEditor.prototype._init = function() {
	var div = document.createElement("div");
	div.id = this._relDivId = Dwt.getNextId();
	div.style.position = "relative";
	var table = document.createElement("table");
	table.id = this._tableId = Dwt.getNextId();
	table.cellSpacing = table.cellPadding = 0;
	table.appendChild(document.createElement("tbody"));
	div.appendChild(table);
	this.getHtmlElement().appendChild(div);
	this.maxLabelWidth = 0;
	this.maxFieldWidth = 0;
	this._setMouseEventHdlrs();
	this._onMouseDown = new AjxListener(this, this._onMouseDown);
	this.addListener(DwtEvent.ONMOUSEDOWN, this._onMouseDown);
};

DwtPropertyEditor.prototype.getRelDiv = function() {
	return document.getElementById(this._relDivId);
};

DwtPropertyEditor.prototype.getTable = function() {
	return document.getElementById(this._tableId);
};

DwtPropertyEditor.prototype._onMouseDown = function(event) {
	var target = event.target;
	var tag = target.tagName.toLowerCase();
	if (tag == "input") {
		event._stopPropagation = false;
		event._returnValue = true;
		return true;
	}
	if (this._currentInputField && !this._currentInputField.onblur()) {
		event._stopPropagation = true;
		event._returnValue = false;
		return false;
	}
	try {
		while (target && tag != "tr") {
			target = target.parentNode;
			tag = target.tagName.toLowerCase();
		}
		if (target && target.__msh_doMouseDown)
			target.__msh_doMouseDown(event);
	} catch(ex) {};
};

/**
 * Call this function to retrieve an object that contains all properties,
 * indexed by name.  Any "struct" property will map to an object that contains
 * its child properties.
 *
 * For the sample schema below (see comments on initProperties()), we would
 * retrieve an object like this (dots represent the edited value, or the
 * initial value if the property wasn't modified):
 *
 *  {
 *    userName : ... ,
 *    address  : {
 *                  street   : ... ,
 *                  country  : ... ,
 *               },
 *    age      : ... ,
 *    birthday : ...
 *  }
 */
DwtPropertyEditor.prototype.getProperties = function() {
	if (this._currentInputField)
		// make sure we get the value
		this._currentInputField.onblur();
	function rec(schema) {
		var prop = {}, tmp, n = schema.length;
		for (var i = 0; i < n; ++i) {
			tmp = schema[i];
			if (tmp.type == "struct")
				prop[tmp.name] = rec(tmp.children);
			else
				prop[tmp.name] = tmp.value;
		}
		return prop;
	};
	return rec(this._schema);
};

DwtPropertyEditor.prototype.validateData = function() {
	var valid = true;
	function rec(schema) {
		var tmp, n = schema.length;
		for (var i = 0; i < n; ++i) {
			tmp = schema[i];
			if (tmp.type == "struct")
				rec(tmp.children);
			else if (!tmp._validate())
				valid = false;
		}
	};
	rec(this._schema);
	return valid;
};

/** This function will initialize the Property Editor with a given schema and
 * property set.
 *
 *  @param schema - declares which properties/types are allowed; see below
 *  @param parent - parent schema, for subproperties
 *
 * "schema" is an object that maps property names to property declaration.
 * Here's an example of what I have in mind:
 *
 *  [
 *    {
 *      label        : "User Name",
 *      id           : "userName",
 *      type         : "string",
 *      value        : "",
 *      minLength    : 4,
 *      maxLength    : 8,
 *      mustMatch    : /^[a-z][a-z0-9_]+$/i,
 *      mustNotMatch : /^(admin|root|guest)$/i
 *    },
 *    {
 *      label     : "Address",
 *      id        : "address",
 *      type      : "struct",
 *      children  : [ // this is a nested schema definition
 *              { label : "Street", id: "street", type: "string" },
 *              { label  : "Country",
 *                id     : "country",
 *                type   : "list",
 *                values : [ "US", "UK", "Etc." ] }
 *      ]
 *    },
 *    {
 *      label     : "Age",
 *      id        : "age",
 *      type      : "integer",
 *      minValue  : 18,
 *      maxValue  : 80
 *    },
 *    {
 *      label     : "Birthday",
 *      id        : "birthday",
 *      type      : "date",
 *      minValue  : "YYYY/MM/DD"  // can we restrict the DwtCalendar?
 *    }
 *  ]
 *
 * The types we will support for now are:
 *
 *   - "number" / "integer" : Allows floating point numbers or integers only.
 *     Properties: "minValue", "maxValue".
 *
 *   - "string" : Allows any string to be inserted.  "minLength", "maxLength",
 *     "mustMatch", "mustNotMatch".
 *
 *   - "password" : Same as "string", only it's not displayed.
 *
 *   - "struct" : Composite property; doesn't have a value by itself, but has
 *     child properties (the "children" array) that are defined in the same way
 *     as a toplevel property.
 *
 * All types except "struct" will allow a "value" property which is expected
 * to be of a valid type that matches all validating properties (such as
 * minLength, etc.).  The value of this property will be displayed initially
 * when the widget is constructed.
 *
 * Also, all types will support a "readonly" property.
 */
DwtPropertyEditor.prototype.initProperties = function(schema, parent) {
	if (parent == null) {
		this._schema = schema;
		parent = null;
	}
	for (var i = 0; i < schema.length; ++i)
		this._createProperty(schema[i], parent);
};

DwtPropertyEditor.prototype._createProperty = function(prop, parent) {
	var level = parent ? parent._level + 1 : 0;
	var tr = this.getTable().firstChild.appendChild(document.createElement("tr"));

	// Initialize the "prop" object with some interesting attributes...
	prop._parent = parent;
	prop._level = level;
	prop._rowElId = tr.id = Dwt.getNextId();
	prop._propertyEditor = this;

	// ... and methods.
	for (var i in DwtPropertyEditor._prop_functions)
		prop[i] = DwtPropertyEditor._prop_functions[i];

	prop._init();

	// indent if needed
	tr.className = "level-" + level;

	if (prop.visible === false)
		tr.className += " invisible";

	if (prop.readonly)
		tr.className += " readonly";

	if (prop.type != "struct") {
		tr.className += " " + prop.type;

		// this is a simple property, create a label and value cell.
		var tdLabel = document.createElement("td");
		tdLabel.className = "label";
		tr.appendChild(tdLabel);
		var html = AjxStringUtil.htmlEncode(prop.label);
		if (prop.required)
			html += "<span class='DwtPropertyEditor-required'>*</span>";
		tdLabel.innerHTML = html;
		var tdField = document.createElement("td");
		tdField.className = "field";
		tr.appendChild(tdField);

		switch (prop.type) {
		    case "select" : this._createDropDown(prop, tdField); break;
		    case "date"   : this._createCalendar(prop, tdField); break;
		    default       :
			if (this._useDwtInputField)
				this._createInputField(prop, tdField);
			else {
				tdField.innerHTML = prop._makeDisplayValue();
				tr.__msh_doMouseDown = DwtPropertyEditor.simpleClosure(prop._edit, prop);
			}
			break;
		}

		prop._fieldCellId = tdField.id = Dwt.getNextId();
		// prop._labelCellId = tdLabel.id = Dwt.getNextId();

		if (tdLabel.offsetWidth > this.maxLabelWidth)
			this.maxLabelWidth = tdLabel.offsetWidth;
		if (tdField.offsetWidth > this.maxFieldWidth)
			this.maxFieldWidth = tdField.offsetWidth;
	} else {
		var td = document.createElement("td");
		td.colSpan = 2;
		tr.appendChild(td);
		td.className = "label";
		tr.className += " expander-collapsed";
		td.innerHTML = [ "<div>", AjxStringUtil.htmlEncode(prop.label), "</div>" ].join("");
		this.initProperties(prop.children, prop);
		tr.__msh_doMouseDown = DwtPropertyEditor.simpleClosure(prop._toggle, prop);
	}

	// collapsed by default
	if (level > 0) {
		tr.style.display = "none";
		parent._hidden = true;
	}
};

// <FIXME: this will create problems when the first property is a "struct">
DwtPropertyEditor.prototype.setFixedLabelWidth = function(w) {
	try {
		this.getTable().rows[0].cells[0].style.width = (w || this.maxLabelWidth) + "px";
	} catch(ex) {};
};

DwtPropertyEditor.prototype.setFixedFieldWidth = function(w) {
	try {
		this.getTable().rows[0].cells[1].style.width = (w || this.maxFieldWidth) + "px";
	} catch(ex) {};
};
// </FIXME>

DwtPropertyEditor.prototype._setCurrentMsgDiv = function(div) {
	this._currentMsgDiv = div;
	this._currentMsgDivTimer = setTimeout(
		DwtPropertyEditor.simpleClosure(this._clearMsgDiv, this),
		DwtPropertyEditor.MSG_TIMEOUT);
};

DwtPropertyEditor.prototype._clearMsgDiv = function() {
	try {
		this._stopMsgDivTimer();
	} catch(ex) {};
	var div = this._currentMsgDiv;
	if (div) {
		div.parentNode.removeChild(div);
		this._currentMsgDiv = div = null;
		this._currentMsgDivTimer = null;
	}
};

DwtPropertyEditor.prototype._stopMsgDivTimer = function() {
	if (this._currentMsgDivTimer) {
		clearTimeout(this._currentMsgDivTimer);
		this._currentMsgDivTimer = null;
	}
};

// This is bad.  We're messing with internals.  I think there should be an
// option in DwtComposite to specify the element where to add the child, rather
// than simply getHtmlElement().appendChild(child).
DwtPropertyEditor.prototype.addChild = function(child) {
	if (!this._currentFieldCell)
		DwtComposite.prototype.addChild.call(this, child);
	else {
		this._children.add(child);
		this._currentFieldCell.appendChild(child.getHtmlElement());
	}
};

DwtPropertyEditor.prototype._createDropDown = function(prop, target) {
	this._currentFieldCell = target;
	var item, sel,
		i       = 0,
		options = [],
		items   = prop.item;
	while (item = items[i])
		options[i++] = new DwtSelectOption(item.value,
						   item.value == prop.value,
						   item.label);
	prop._select = sel = new DwtSelect(this, options);
	sel.addChangeListener(new AjxListener(prop, prop._onSelectChange));
	sel.addListener(DwtEvent.ONMOUSEDOWN, this._onMouseDown);
	this._currentFieldCell = null;
};

DwtPropertyEditor.prototype._createCalendar = function(prop, target) {
	this._currentFieldCell = target;
	var btn = new DwtButton(this);
	this._currentFieldCell = null;

	btn.setText(prop._makeDisplayValue());
	var menu = new DwtMenu(btn, DwtMenu.CALENDAR_PICKER_STYLE);
	menu.setAssociatedObj(btn);
	var cal = new DwtCalendar(menu);
	var date = new Date();
	date.setTime(prop.value);
	cal.setDate(date);
	cal.setSize(150, "auto");
	cal.addSelectionListener(new AjxListener(prop, prop._onCalendarSelect));
	btn.setMenu(menu);

	prop._dateButton = btn;
	prop._dateCalendar = cal;
};

DwtPropertyEditor.DWT_INPUT_FIELD_TYPES = {
	"string"    : DwtInputField.STRING,
	"password"  : DwtInputField.PASSWORD,
	"integer"   : DwtInputField.INTEGER,
	"number"    : DwtInputField.FLOAT
};

DwtPropertyEditor.prototype._createInputField = function(prop, target) {
	this._currentFieldCell = target;
	var type = DwtPropertyEditor.DWT_INPUT_FIELD_TYPES[prop.type]
		|| DwtInputField.STRING;
	var field = new DwtInputField({parent: this, type: type, initialValue: prop.value, maxLen: prop.maxLength});
	if (type == DwtInputField.INTEGER || type == DwtInputField.FLOAT) {
		field.setValidNumberRange(prop.minValue || null,
					  prop.maxValue || null);
		if (prop.decimals != null)
			field.setNumberPrecision(prop.decimals);
	}
	if (type == DwtInputField.STRING || type == DwtInputField.PASSWORD)
		field.setValidStringLengths(prop.minLength, prop.maxLength);
	if (prop.required)
		field.setRequired();
	this._currentFieldCell = null;
	prop._inputField = field;
	field.setValue(prop.value);
	if (prop.readonly)
		field.setReadOnly(true);
	field.setValidationCallback(new AjxCallback(prop, prop._onDwtInputFieldValidated));
};

// these will be merged to each prop object that comes in the schema
DwtPropertyEditor._prop_functions = {

	_init : function() {
		this.type != null || (this.type = "string");
		this.value != null || (this.value = "");
		this._initialVal = this.value;

		if (this.type == "date") {
			if (!this.value) {
// 				var tmp = new Date();
// 				tmp.setHours(0);
// 				tmp.setMinutes(0);
// 				tmp.setSeconds(0);
				this.value = new Date().getTime();
			}
			if (!this.format)
				this.format = AjxDateUtil.getSimpleDateFormat().toPattern();
		}
	},

	_modified : function() {
		return this._initialVal != this.value;
	},

	_getRowEl : function() {
		return document.getElementById(this._rowElId);
	},

	_makeDisplayValue : function() {
		var val = this._getValue();
		switch (this.type) {
		    case "password" :
			val = val.replace(/./g, "*");
			break;
		    case "date" :
			var date = new Date();
			date.setTime(val);
			val = AjxDateFormat.format(this.format, date);
			break;
		}
		if (val == "")
			val = "<br />";
		else
			val = AjxStringUtil.htmlEncode(String(val));
		return val;
	},

	_display : function(visible) {
		var
			c = this.children,
			d = visible ? "" : "none";
		if (c) {
			var i = c.length;
			while (--i >= 0) {
				c[i]._getRowEl().style.display = d;
				if (!visible)
					c[i]._display(false);
			}
			this._hidden = !visible;

			// change the class name accordingly
			var tr = this._getRowEl();
			tr.className = tr.className.replace(
				/expander-[^\s]+/,
				visible ? "expander-expanded" : "expander-collapsed");
		}
	},

	_toggle : function() { this._display(this._hidden); },

	_edit : function() {
		// Depending on the type, this should probably create different
		// fields for editing.  For instance, in a "date" property we
		// would want a calendar, while in a "list" property we would
		// want a drop-down select box.

		if (this.readonly)
			return;

		switch (this.type) {
		    case "string" :
		    case "number" :
		    case "integer" :
		    case "password" :
			setTimeout(
				DwtPropertyEditor.simpleClosure(
					this._createInputField, this), 50);
			break;

// 		    default :
// 			alert("We don't support this type yet");
		}
	},

	_createInputField : function() {
		var	pe     = this._propertyEditor;
		var td     = document.getElementById(this._fieldCellId);
		var canvas = pe.getRelDiv();
		var input  = document.createElement("input");

		input.className = "DwtPropertyEditor-input " + this.type;
		input.setAttribute("autocomplete", "off");

		input.type = this.type == "password"
			? "password"
			: "text";

		var left = td.offsetLeft, top = td.offsetTop;
		if (AjxEnv.isGeckoBased) {
			--left;
			--top;
		}
		input.style.left = left + "px";
		input.style.top = top + "px";
		input.style.width = td.offsetWidth + 1 + "px";
		input.style.height = td.offsetHeight + 1 + "px";

		input.value = this._getValue();

		canvas.appendChild(input);
		input.focus();

		input.onblur = DwtPropertyEditor.simpleClosure(this._saveInput, this);
		input.onkeydown = DwtPropertyEditor.simpleClosure(this._inputKeyPress, this);

		this._propertyEditor._currentInputField = this._inputField = input;
		if (!AjxEnv.isGeckoBased)
			input.select();
		else
			input.setSelectionRange(0, input.value.length);
	},

	_getValue : function() {
		return this.value || "";
	},

	_checkValue : function(val) {
		var empty = val == "";

		if (empty) {
			if (!this.required)
				return val;
			this._displayMsg(AjxMsg.valueIsRequired);
			return null;
		}

		if (this.maxLength != null && val.length > this.maxLength) {
			this._displayMsg(AjxMessageFormat.format(AjxMsg.stringTooLong, this.maxLength));
			return null;
		}

		if (this.minLength != null && val.length < this.minLength) {
			this._displayMsg(AjxMessageFormat.format(AjxMsg.stringTooShort, this.minLength));
			return null;
		}

		if (this.mustMatch && !this.mustMatch.test(val)) {
			this._displayMsg(this.msg_mustMatch ||
					 DwtPropertyEditor.MSG.mustMatch.replace(
						 /REGEXP/, this.mustMatch.toString()));
			return null;
		}

		if (this.mustNotMatch && this.mustNotMatch.test(val)) {
			this._displayMsg(this.msg_mustNotMatch ||
					 DwtPropertyEditor.MSG.mustNotMatch.replace(
						 /REGEXP/, this.mustNotMatch.toString()));
			return null;
		}

		switch (this.type) {
		    case "integer" :
		    case "number" :
			var n = new Number(val);
			if (isNaN(n)) {
				this._displayMsg(AjxMsg.notANumber);
				return null;
			}
			if (this.type == "integer" && Math.round(n) != n) {
				this._displayMsg(AjxMsg.notAnInteger);
				return null;
			}
			if (this.minValue != null && n < this.minValue) {
				this._displayMsg(AjxMessageFormat.format(AjxMsg.numberLessThanMin, this.minValue));
				return null;
			}
			if (this.maxValue != null && n > this.maxValue) {
				this._displayMsg(AjxMessageFormat.format(AjxMsg.numberMoreThanMax, this.maxValue));
				return null;
			}
			val = n;
			if (this.type == "number" && this.decimals != null) {
				var str = val.toString();
				var pos = str.indexOf(".");
				if (pos == -1)
					pos = str.length;
				val = val.toPrecision(pos + this.decimals);
			}
			break;
		}
		return val;
	},

	_displayMsg : function(msg) {
		var x, y, w, h;
		var pe  = this._propertyEditor;
		var div = pe._currentMsgDiv;

		if (!div) {
			div = document.createElement("div");
			div.className = "DwtPropertyEditor-ErrorMsg";
			pe.getRelDiv().appendChild(div);
		} else
			pe._stopMsgDivTimer();
		div.style.visibility = "hidden";
		div.innerHTML = AjxStringUtil.htmlEncode(msg);
		// position & size
		var table = pe.getTable();
		w = table.offsetWidth; // padding & border!
		if (!AjxEnv.isIE)
			w -= 12;
		x = table.offsetLeft;
		div.style.left = x + "px";
		div.style.width = w + "px";
		h = div.offsetHeight;
		var td = document.getElementById(this._fieldCellId);
		y = td.offsetTop + td.offsetHeight;
		if (y + h > table.offsetTop + table.offsetHeight)
			y = td.offsetTop - h;
		div.style.top = y + "px";
		div.style.visibility = "";
		pe._setCurrentMsgDiv(div);
	},

	_saveInput : function() {
		var input = this._inputField;
		var val = this._checkValue(input.value);
		if (val != null) {
			this._setValue(val);
			input.onblur = input.onkeyup = input.onkeydown = input.onkeypress = null;
			var td = document.getElementById(this._fieldCellId);
			td.innerHTML = this._makeDisplayValue();
			this._inputField = null;
			this._propertyEditor._currentInputField = null;
			this._propertyEditor._clearMsgDiv();
			input.parentNode.removeChild(input);
			return true;
		} else {
			if (input.className.indexOf(" DwtPropertyEditor-input-error") == -1)
				input.className += " DwtPropertyEditor-input-error";
			input.focus();
			return false;
		}
	},

	_inputKeyPress : function(ev) {
		ev || (ev = window.event);
		var input = this._inputField;
		if (ev.keyCode == 13) {
			this._saveInput();
		} else if (ev.keyCode == 27) {
			input.value = this._getValue();
			this._saveInput();
		} else {
			this._propertyEditor._clearMsgDiv();
			input.className = input.className.replace(/ DwtPropertyEditor-input-error/, "");
		}
	},

	_onSelectChange : function() {
		this._setValue(this._select.getValue());
	},

	_onCalendarSelect : function() {
		this._setValue(this._dateCalendar.getDate().getTime());
		this._dateButton.setText(this._makeDisplayValue());
	},

	_onDwtInputFieldValidated : function(dwtField, validated, value) {
		if (validated)
			this._setValue(value);
	},

	_setValue : function(val) {
		this.value = val;
		var tr = this._getRowEl();
		tr.className = tr.className.replace(/ dirty/, "");
		if (this._modified())
			tr.className += " dirty";
	},

	_validate : function() {
		if (this._inputField) {
			if (this._inputField instanceof DwtInputField)
				return this._inputField.validate();
			else
				return this._inputField.onblur();
		} else
			return true;
	}
};

// Since we don't like nested functions...
DwtPropertyEditor.simpleClosure = function(func, obj) {
	return function() { return func.call(obj, arguments[0]); };
};
