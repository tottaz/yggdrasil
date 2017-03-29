/*
 (c) DHTMLX Ltd, 2011
 Licensing: You allowed to use this component for free under GPL or you need to obtain Commercial/Enterprise license to use it in non-GPL project
 Contact: sales@dhtmlx.com
 */
 if (typeof(SpreadSheetConfig) === 'undefined')
	var SpreadSheetConfig;

var SpreadSheetMathHint = {

	selected: null,
	input: null,

	init: function(input) {
		for (var i = 0; i < this.details.length; i++)
			this.hints[this.details[i].regexp] = this.details[i].hint;

		this.mathHint = document.createElement('div');
		this.mathHint.className = 'mathHint';
		var self = this;
		this.mathHint.onclick = function(e) {
			e = e || window.event;
			e.cancelBubble = true;
			self.filter(self.input.value);
		};
		this.input = input;
		document.body.appendChild(this.mathHint);
	},

	filter: function(text) {
		if (text.substring(0, 1) !== '=') return true;
		var regexp = /([A-Z0-9]+\()[^\)]*\)?$/i;
		var match = regexp.exec(text);
		if ((match)&&(typeof(match[1]) != 'undefined')) {
			match[0] = match[1];
		} else {
			regexp = /[A-Z0-9]+\(?$/i;
			match = regexp.exec(text);
		}
		if (match) {
			if (typeof(match[0]) != 'undefined')
				match = match[0];
			else {
				this.mathHint.style.display = 'none';
				return true;
			}
		} else {
			this.mathHint.style.display = 'none';
			return true;
		}

		match = match.toUpperCase();
		var matches = [];
		for (var i in this.hints)
			if (i.indexOf(match) === 0)
				matches.push(this.hints[i]);

		if (matches.length > 0)
			this.show();
		else
			this.hide();
		this.set(matches);
	},

	show: function() {
		var object = (this.input.parentNode && this.input.parentNode.tagName.toLowerCase() == 'td') ? this.input.parentNode : this.input;
		var pos = SpreadSheetConfig.get_pos(object);
		this.mathHint.style.left = pos.x + 'px';
		this.mathHint.style.top = (pos.y + this.input.offsetHeight - 1) + 'px';
		this.mathHint.style.display = 'block';
	},

	hide: function() {
		if (this.mathHint)
			this.mathHint.style.display = 'none';
	},

	next: function() {
		var list = this.mathHint.firstChild;
		var selected = false;
		if (list && list.childNodes.length > 0) {
			for (var i = 0; i < list.childNodes.length; i++) {
				if (list.childNodes[i].className.indexOf(' selected') !== -1) {
					list.childNodes[i].className = list.childNodes[i].className.replace(' selected', '');
					selected = true;
					break;
				}
			}
			if (selected) {
				var index = i + 1;
				if (index >= list.childNodes.length) index = 0;
				list.childNodes[index].className += ' selected';
				this.selected = list.childNodes[index].innerHTML;
			}
		}
	},

	prev: function() {
		var list = this.mathHint.firstChild;
		var selected = false;
		if (list && list.childNodes.length > 0) {
			for (var i = list.childNodes.length - 1; i >= 0; i--) {
				if (list.childNodes[i].className.indexOf(' selected') !== -1) {
					list.childNodes[i].className = list.childNodes[i].className.replace(' selected', '');
					selected = true;
					break;
				}
			}
			if (selected) {
				var index = i - 1;
				if (index < 0) index = list.childNodes.length - 1;
				list.childNodes[index].className += ' selected';
				this.selected = list.childNodes[index].innerHTML;
			}
		}
	},

	first: function() {
		var list = this.mathHint.firstChild;
		this.unselect();
		if (list && list.childNodes.length > 0) {
			list.firstChild.className += ' selected';
			this.selected = list.firstChild.innerHTML;
		}
	},

	unselect: function() {
		var list = this.mathHint.firstChild;
		for (var i = 0; i < list.childNodes.length; i++)
			list.childNodes[i].className = list.childNodes[i].className.replace(' selected', '');
	},

	select: function(innerHTML) {
		this.unselect();
		var list = this.mathHint.firstChild;
		if (list && list.childNodes.length > 0) {
			for (var i = 0; i < list.childNodes.length; i++)
				if (list.childNodes[i].innerHTML == innerHTML) {
					list.childNodes[i].className += ' selected';
					this.selected = innerHTML;
					return true;
				}
		}
		return false;
	},

	set: function(hints) {
		for (var i = 0; i < hints.length; i++)
			hints[i] = '<li class="mathHint_item" onmouseover="SpreadSheetMathHint.select(this.innerHTML);" onclick="SpreadSheetMathHint.use();">' + hints[i] + '</li>';
		this.mathHint.innerHTML = '<ul>' + hints.join("") + '</ul>';
		if (this.selected) {
			if (!this.select(this.selected))
				this.first();
		} else
			this.first();
	},

	getHintsNumber: function() {
		var list = this.mathHint.firstChild;
		if (list)
			return list.childNodes.length;
		else
			return 0;
	},

	use: function() {
		var text = this.input.value;
		var regexp = /[A-Z0-9]+\(?$/i;
		var match = regexp.exec(text);
		if (match) {
			for (var i in this.hints) {
				if (this.hints[i] == this.selected)
					text = text.replace(regexp, i);
			}
			this.input.value = text;
			window.setTimeout(function() {
				SpreadSheetMathHint.input.focus();
				SpreadSheetMathHint.lookAtCursor(SpreadSheetMathHint.input);
			}, 50);
			return true;
		} else {
			window.setTimeout(function() {
				SpreadSheetMathHint.input.focus();
			}, 50);
			return false;
		}

	},

	used: function(check) {
		var text = this.input.value;
		check = check || false;
		if (this.getHintsNumber() === 0) return true;
		var regexp = /([A-Z0-9]+\(\))$/i;
		var match = regexp.exec(text);
		if (!match) {
			regexp = /([A-Z0-9]+\()$/i;
			match = regexp.exec(text);
		}
		if (!match) {
			regexp = /([A-Z0-9]+\()[^\)]*\)?$/i;
			match = regexp.exec(text);
		}
		if ((match)&&(typeof(match[1]) != 'undefined')) {
			match = match[1].toUpperCase();
			for (var i in this.hints) {
				if (i.indexOf(match) === 0)
					if (match == i || check === true)
						return true;
			}
		}
		return false;
	},

	attachEvent: function(input, ssheet) {
		this.set([]);
		this.input = input;
		var self = this;
		this.cursor = input.value.length - 1;
		input.ssheet = ssheet;
		input.onmousedown = function(e) {
			e = window.event||e;
			var el = e.srcElement||e.target;
			window.setTimeout(function() {
				self.lookAtCursor(el);
			}, 10);
			return true;
		};
		if (!input._math_added)
			dhtmlxEvent(input, "keydown", function(e) {
				e = e||window.event;
				var code = e.keyCode||e.which;
				if ((code === 9)&&(SpreadSheetMathHint.used(true) === true)) {
					return (ssheet.grid.editor ? true : false);
				}
				if (code !== 13) {
					var el = e.srcElement||e.target;
					window.setTimeout(function() {
						self.lookAtCursor(el);
					}, 10);
				}
				return self.mathKeyDown(e);
			});
		input._math_added = true;
		window.setTimeout(function() {
			self.showBorders(input);
			self.lookAtCursor(input);
		}, 10);
	},

	lookAtCursor: function(el) {
		if (typeof(el.ssheet) === 'undefined')
			return false;
		if (!el.parentNode) return;
		this.cursor = this.getCursorPos(el);
		if (this.cursor === -1)
			this.cursor = el.value.length;
	},

	getCaret: function(node) {
		if (typeof(node.selectionStart) !== 'undefined') {
			return node.selectionStart;
		} else if (!document.selection) {
			return 0;
		}

		var c = "\001";
		var sel = document.selection.createRange();
		var dul = sel.duplicate();
		var len = 0;

		dul.moveToElementText(node);
		sel.text = c;
		len = dul.text.indexOf(c);
		sel.moveStart('character',-1);
		sel.text = "";
		return len;
	},

	mathKeyDown: function(e) {
		var self = this;
		var input = this.input;
		var code = e.keyCode||e.which;
		if (code == 40) {
			this.next();
			return false;
		}
		if (code == 38) {
			this.prev();
			return false;
		}
		if (code == 13) {
			if (this.used()) {
				input.ssheet.grid.clearBorderSelection();
				input.ssheet.mathSave(input);
				input.ssheet.grid._key_events.k13_0_0();
				return true;
			} else {
				input.ssheet.grid.autocomplete = true;
				this.use(input);
			}
		}
		if (code == 27) {
			input.ssheet.grid.clearBorderSelection();
			input.ssheet.mathCancel();
			return true;
		}
		window.setTimeout(function() {
			self.showBorders(input);
			self.lookAtCursor(input);
			self.filter(input.value);
		}, 100);
		return true;
	},

	showBorders: function(input) {
		if (typeof(input.ssheet) === 'undefined')
			return false;
		if (input.value.substring(0, 1) !== '=') {
			input.ssheet.grid.clearBorderSelection();
			input.ssheet.grid.enableBorderSelection(false);
			return true;
		}
		input.ssheet.grid.enableBorderSelection(true);
		input.ssheet.grid.clearBorderSelection();
		var regexp = /\$?([A-Z]+)\$?(\d+):\$?([A-Z]+)\$?(\d+)/i;

		var value = input.value;
		while (regexp.test(value)) {
			var matches = regexp.exec(value);
			value = value.replace(regexp, '');
			var LeftTopRow = matches[2];
			var LeftTopCol = input.ssheet.getColIndex(matches[1]);
			var RightBottomRow = matches[4];
			var RightBottomCol = input.ssheet.getColIndex(matches[3]);
			input.ssheet.grid.addBorderSelection(LeftTopRow, LeftTopCol, RightBottomRow, RightBottomCol);
		}

		regexp = /\$?([A-Z]+)\$?(\d+)/i;
		while (regexp.test(value)) {
			var matches = regexp.exec(value);
			value = value.replace(regexp, '');
			var LeftTopRow = matches[2];
			var LeftTopCol = input.ssheet.getColIndex(matches[1]);
			var RightBottomRow = LeftTopRow;
			var RightBottomCol = LeftTopCol;
			input.ssheet.grid.addBorderSelection(LeftTopRow, LeftTopCol, RightBottomRow, RightBottomCol);
		}
	},

	setRange: function(range) {
		var formula = this.input.value.substring(0, this.cursor);
		var regexp = /\$?([A-Z]+)\$?(\d+):\$?([A-Z]+)\$?(\d+)$/i;
		if (regexp.test(formula)) {
			formula = formula.replace(regexp, range);
		} else {
			regexp = /\$?([A-Z]+)\$?(\d+)$/i;
			if (regexp.test(formula))
				formula = formula.replace(regexp, range);
			else {
				formula += range;
			}
		}
		var pos = formula.length;
		formula += this.input.value.substring(this.cursor);
		this.input.value = formula;
		this.cursor = formula.length;
		this.setCursorPos(this.input, pos);
		this.cursor = pos;
		this.filter(this.input.value);
		this.showBorders(this.input);
	},

	getCursorPos: function(el) {
		el.focus();
		if(el.selectionStart) {
			return el.selectionStart;
		}
		if (document.selection) {
			var r = document.selection.createRange();
			if (r === null) {
				return el.value.length;
			}
			var re = el.createTextRange();
			var rc = re.duplicate();
			re.moveToBookmark(r.getBookmark());
			rc.setEndPoint('EndToStart', re);
			return rc.text.length;
		}
		return el.value.length;
	},

	setCursorPos: function(el, pos) {
		el.focus();
		if (el.setSelectionRange) {
			el.setSelectionRange(pos, pos);
		} else if (el.createTextRange) {
			var range = el.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
	},

	hints: {},
	details: [
		{
			name: 'SUM',
			regexp: 'SUM(',
			hint: 'SUM(arg1; arg2; arg3; ...)',
			dsc: 'Sums the arquments ',
			samples: '=SUM(1; 3; 5) // the result is 9'
		}, {
			name: 'SUB',
			regexp: 'SUB(',
			hint: 'SUB(arg1; arg2; arg3; ...)',
			dsc: 'Subtracts the second and subsequent arguments from the first argument',
			samples: '=SUB(10; 3; 5) // the result is 2'
		}, {
			name: 'MULT',
			regexp: 'MULT(',
			hint: 'MULT(arg1; arg2; arg3; ...)',
			dsc: 'Multiplies the arquments',
			samples: '=MULT(2; 3; 5) // the result is 30'
		}, {
			name: 'DIV',
			regexp: 'DIV(',
			hint: 'DIV(arg1; arg2; arg3; ...)',
			dsc: 'Divides the first argument by the second and subsequent arguments',
			samples: '=DIV(20;2;5) // the result is 2'
		}, {
			name: 'SQRT',
			regexp: 'SQRT(',
			hint: 'SQRT(arg1)',
			dsc: 'Returns the square root of the argument ',
			samples: '=SQRT(16) // the result is 4'
		}, {
			name: 'SQR',
			regexp: 'SQR(',
			hint: 'SQR(arg1)',
			dsc: 'Returns the square of the arqument',
			samples: '=SQR(3) // the result is 9'
		}, {
			name: 'POW',
			regexp: 'POW(',
			hint: 'POW(arg1; arg2)',
			dsc: 'Returns the first argument raised to power of the second argument ',
			samples: '=POW(2;5) // the result is 32'
		}, {
			name: 'MOD',
			regexp: 'MOD(',
			hint: 'MOD(arg1; arg2)',
			dsc: 'Returns the remainder after the first argument is divided by the second argument',
			samples: '=MOD(10;4)  // the result is 2'
		}, {
			name: 'ABS',
			regexp: 'ABS(',
			hint: 'ABS(arg1)',
			dsc: '	Returns the absolute value of the argument ',
			samples: '=ABS(-5)  // the result is 5 <br> =ABS(5)  // the result is 5'
		}, {
			name: 'EXP',
			regexp: 'EXP(',
			hint: 'EXP(arg1)',
			dsc: 'Returns e raised to power of the argument ',
			samples: '=EXP(2) // the result is 7.3890561 '
		}, {
			name: 'LN',
			regexp: 'LN(',
			hint: 'LN(arg1)',
			dsc: 'Returns the natural logarithm of the argument ',
			samples: '=LN(7.3890561) // the result is 2 '
		}, {
			name: 'LOG',
			regexp: 'LOG(',
			hint: 'LOG(arg1; arg2)',
			dsc: 'Returns the logarithm of the first argument to a base of the second argument',
			samples: '=LOG(32;2) // the result is 5 '
		}, {
			name: 'LOG10',
			regexp: 'LOG10(',
			hint: 'LOG10(arg1)',
			dsc: 'Returns the base-10 logarithm of the argument ',
			samples: '=LOG10(100) // the result is 2 '
		}, {
			name: 'SIN',
			regexp: 'SIN(',
			hint: 'SIN(arg1)',
			dsc: 'Returns the sine of the argument ',
			samples: '=SIN(0) // the result is 0 '
		}, {
			name: 'COS',
			regexp: 'COS(',
			hint: 'COS(arg1)',
			dsc: 'Returns the cosine of the arqument ',
			samples: '=COS(0) // the result is 1 '
		}, {
			name: 'TAN',
			regexp: 'TAN(',
			hint: 'TAN(arg1)',
			dsc: 'Returns the tangent of the argument ',
			samples: '=TAN(0) // the result is 0 '
		}, {
			name: 'ASIN',
			regexp: 'ASIN(',
			hint: 'ASIN(arg1)',
			dsc: 'Returns the arcsine (in radians) of the argument ',
			samples: '=ASIN(0) // the result is 0 '
		}, {
			name: 'ACOS',
			regexp: 'ACOS(',
			hint: 'ACOS(arg1)',
			dsc: 'Returns the arccosine (in radians) of the arqument ',
			samples: '=ACOS(1) // the result is 0 '
		}, {
			name: 'ATAN',
			regexp: 'ATAN(',
			hint: 'ATAN(arg)',
			dsc: 'Returns the arctangent (in radians) of the argument ',
			samples: '=ATAN(1) // the result is 0.78539816 '
		}, {
			name: 'PI',
			regexp: 'PI()',
			hint: 'PI()',
			dsc: 'Returns the mathematical constant called pi',
			samples: '=PI() // the result is 3.14159265'
		}
	],

	all: function(parent, callback) {
		SpreadSheetModal.show(parent);
		
		var d = document.createElement("DIV");
		d.className = "dhx_spread_window functions_window";
		parent.appendChild(d);
		d.innerHTML = this.getForm();
		
		var left = (parent.offsetWidth - d.offsetWidth)/2 + 'px';
		var top = (parent.offsetHeight - d.offsetHeight)/2 + 'px';
		d.style.left = left;
		d.style.top = top;
		
		this._all_cont = d;

		var btns = d.getElementsByTagName('input');
		var self = this;
		// insert callback
		btns[0].onclick = function() { self.functions_enter(callback); };
		// cancel callback
		btns[1].onclick = function() { self.functions_escape(callback); };
		var sel = this._all_cont.getElementsByTagName('select');
		sel = sel[0];
		dhtmlxEvent(sel, "keydown", function() {
			var code = e.keyCode||e.which;
			if (code === 13) self.functions_enter(callback);
			if (code == 27) self.functions_escape(callback);
		});
		dhtmlxEvent(sel, "dblclick", function() {
			self.functions_enter(callback);
		});
		sel.focus();
		this.functionDetails(this.details[0].name);
	},

	getForm: function() {
		var str = "<div class='spread_config_cont'>";
		str += "<div class='functions_list'>";
		str += "<select size='15' onchange='SpreadSheetMathHint.functionDetails();'>";
		for (var i = 0; i < this.details.length; i++) {
			str += "<option value='" + this.details[i].name + "'>" + this.details[i].name + "</option>";
		}
		str += "</select>";
		str += "</div>";
		str += "<div class='function_details'></div>";
		str += "<div class='controls_bar'>";
		str += "<input type='button' class='spread_config spread_config_button' value='Insert' />";
		str += "<input type='button' class='spread_config spread_config_button' value='Close' />";
		str += "</div>";
		str += "</div>";
		str += "</div>";
		return str;
	},

	functionDetails: function(f) {
		if (!this._all_cont) return;
		var sel = this._all_cont.getElementsByTagName('select');
		sel = sel[0];
		if (f)
			sel.value = f;
		else
			f = sel.options[sel.selectedIndex].value;
		

		var item = this.function_by_name(f);
		if (item === false) return;

		var str = "<div class='line'><span class='label'>Name:</span> " + item.name + "</div>";
		str += "<div class='line'><span class='label'>Description:</span> " + item.dsc + "</div>";
		str += "<div class='line'><span class='label'>Usage:</span> " + item.hint + "</div>";
		if (item.samples)
			str += "<div class='line'><span class='label'>Example:</span> " + item.samples + "</div>";
		this._all_cont.childNodes[0].childNodes[1].innerHTML = str;
	},
	close_all: function() {
		this._all_cont.parentNode.removeChild(this._all_cont);
		SpreadSheetModal.hide();
	},
	get_all_selection: function() {
		var sel = this._all_cont.getElementsByTagName('select');
		sel = sel[0];
		var f = sel.options[sel.selectedIndex].value;
		return this.function_by_name(f);
	},

	function_by_name: function(name) {
		for (var i = 0; i < this.details.length; i++)
			if (this.details[i].name == name) {
				return this.details[i];
				break;
			}
		return false;
	},

	functions_enter: function(callback) {
		var f = this.get_all_selection();
		this.close_all();
		if (typeof(callback.insert) !== 'undefined') callback.insert(f);
	},

	functions_escape: function(callback) {
		this.close_all();
		if (typeof(callback.insert) !== 'undefined') callback.cancel();
	},
	
	function_ending: function(value) {
		var regexp = /^=.*\([^\)]*$/i;
		var match = regexp.exec(value);
		if (match) value += ')';
		return value;
	}

};