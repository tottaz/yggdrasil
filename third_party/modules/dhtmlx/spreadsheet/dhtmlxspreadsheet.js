/*
 (c) DHTMLX Ltd, 2011
 Licensing: You allowed to use this component for free under GPL or you need to obtain Commercial/Enterprise license to use it in non-GPL project
 Contact: sales@dhtmlx.com
 */
 /*
 (c) DHTMLX Ltd, 2011
 Licensing: You allowed to use this component for free under GPL or you need to obtain Commercial/Enterprise license to use it in non-GPL project
 Contact: sales@dhtmlx.com
 */
 function dhtmlxSpreadSheet(obj) {
	this.settings = {
		version: '1.0',
		init_instantly: false,
		sheet: obj.sheet || null,
		cols: 26,
		rows: 50,
		show_row_numbers: true,
		show_export_buttons: true,
		fullscreen: false,
//		method: 'jsonp', // ajax
		method: 'ajax',
		// addition parameter for toolbar settings
		// always should be true
		ever: true,
		column_width: 64,
		left_width: 40,
		skin: obj.skin||"dhx_skyblue",
		load_url: obj.load,
		save_url: obj.save,
		icons_path: obj.icons_path || "../codebase/imgs/icons",
		image_path: obj.image_path || "../codebase/imgs/",
		math: (typeof(obj.math) !== 'undefined') ? obj.math : false,
		key: null,
		styles: [],
		timeout: 500,
		export_pdf_url: 'http://dhtmlxgrid.appspot.com/export/pdf',
		export_excel_url: 'http://dhtmlxgrid.appspot.com/export/excel',
		defaults: {
			rows: 50,
			cols: 26,
			show_row_numbers: true,
			show_export_buttons: true
		}
	};
	// used to implement formuals copying
	this._copydump = {
		inside: null,
		outside: null
	};
	/*! parameter 'show' shows which of items
	 *	can be shown in toolbar
	 *	show='opt1,!opt2,opt3' means condition:
	 *	show='ever' - show independece of parameters
	 *	(this.settings.opt1 == true) && (this.settings.opt2 != true) && (this.settings.opt3 == true)
	 **/
	this.settings.defaults.toolbar_items = [
		{type: "buttonTwoState", id: "bold", text: "Bold", img: "bold.png", pressed: false, tooltip: "Bold text (Ctrl+B)", show: '!read_only'},
		{type: "buttonTwoState", id: "italic", text: "Italic", img: "italic.png", pressed: false, tooltip: "Italic text (Ctrl+I)", show: '!read_only'},
		{type: "buttonSelect", id: "topcolor", text: "Color", img: "colors/color_000000.png", tooltip: "Text color", openAll: true, show: '!read_only', options: [
			{id: "color__000000", type: "obj", text: "Black", img: 'colors/color_000000.png'},
			{id: "color__ffffff", type: "obj", text: "White", img: 'colors/color_ffffff.png'},
			{id: "color__ff0000", type: "obj", text: "Red", img: 'colors/color_ff0000.png'},
			{id: "color__ffc000", type: "obj", text: "Orange", img: 'colors/color_ffc000.png'},
			{id: "color__ffff00", type: "obj", text: "Yellow", img: 'colors/color_ffff00.png'},
			{id: "color__92d050", type: "obj", text: "LightGreen", img: 'colors/color_92d050.png'},
			{id: "color__00b050", type: "obj", text: "Green", img: 'colors/color_00b050.png'},
			{id: "color__00b0f0", type: "obj", text: "LightBlue", img: 'colors/color_00b0f0.png'},
			{id: "color__0070c0", type: "obj", text: "Blue", img: 'colors/color_0070c0.png'}
		]},
		{type: "buttonSelect", id: "topbgcolor", text: "Background", img: "colors/color_ffffff.png", tooltip: "Background color", openAll: true, show: '!read_only', options: [
			{id: "bgcolor__000000", type: "obj", text: "Black", img: 'colors/color_000000.png'},
			{id: "bgcolor__ffffff", type: "obj", text: "White", img: 'colors/color_ffffff.png'},
			{id: "bgcolor__ff0000", type: "obj", text: "Red", img: 'colors/color_ff0000.png'},
			{id: "bgcolor__ffc000", type: "obj", text: "Orange", img: 'colors/color_ffc000.png'},
			{id: "bgcolor__ffff00", type: "obj", text: "Yellow", img: 'colors/color_ffff00.png'},
			{id: "bgcolor__92d050", type: "obj", text: "LightGreen", img: 'colors/color_92d050.png'},
			{id: "bgcolor__00b050", type: "obj", text: "Green", img: 'colors/color_00b050.png'},
			{id: "bgcolor__00b0f0", type: "obj", text: "LightBlue", img: 'colors/color_00b0f0.png'},
			{id: "bgcolor__0070c0", type: "obj", text: "Blue", img: 'colors/color_0070c0.png'}
		]},
		{type: "buttonSelect", id: "topalign", text: "Align", img: "align_left.png", tooltip: "Text align in cell", openAll: true, show: '!read_only', options: [
			{id: "align__left", type: "obj", text: "Left", img: 'align_left.png'},
			{id: "align__center", type: "obj", text: "Center", img: 'align_center.png'},
			{id: "align__right", type: "obj", text: "Right", img: 'align_right.png'},
			{id: "align__justify", type: "obj", text: "Justify", img: 'align_justify.png'}
		]},
		{type: "button", id: "edit", text: "Edit", img: "iconedit.gif", tooltip: "Edit selected cell", show: '!read_only'},
		{type: "button", id: "undo", img: "undo.gif", img_disabled: "undo_dis.gif", disabled: true, tooltip: "Undo last change (Ctrl+Z)", show: '!read_only'},
		{type: "button", id: "redo", img: "redo.gif", img_disabled: "redo_dis.gif", disabled: true, tooltip: "Redo last change (Ctrl+Y)", show: '!read_only'},

		{ type: "button", id: "export_pdf", text: "PDF", img: "export_pdf.png", show: 'show_export_buttons', pos: 'right'},
		{ type: "button", id: "export_excel", text: "Excel", img: "export_excel.png", show: 'show_export_buttons', pos: 'right'},
		{ type: "button", id: "settings", text: "Settings", img: "settings.png", show: '!read_only', pos: 'right'}
	];

	this.settings.defaults.math_items = [
		{ id: "math", type: "buttonInput", width: 300 },
		{ id: "save", type: "button", text: "Save" },
		{ id: "cancel", type: "button", text: "Cancel" },
		{ id: "function", type: "button", text: "F(x)", show: 'math' }
	];
	this.tool_heights = {
		'dhx_skyblue': 26,
		'dhx_web': 32
	};
	this.tool_borders = {
		'dhx_skyblue': 0,
		'dhx_web': 2
	};
	this.tool_height = this.tool_heights[this.settings.skin];
	this.stack = [];
	this._in_progr = {};
	this.undo = new dhtmlxUndo();
	this._last_value = null;
	this.dont_lose_focus = false;
	if (!obj.parent) {
		this.settings.parent = this.getFullscreenCont();
		this.settings.fullscreen = true;
	} else if (typeof(obj.parent) == "string")
		this.settings.parent = document.getElementById(obj.parent);
	else
		this.settings.parent = obj.parent;
	this.settings.autoheight = (this.settings.fullscreen) ? false : (typeof(obj.autoheight) !== 'undefined' ? obj.autoheight : true);
	this.settings.autowidth = (this.settings.fullscreen) ? false : (typeof(obj.autowidth) !== 'undefined' ? obj.autowidth : true);
	this.settings.parent = this.processParentCont(this.settings.parent);
	this.setSizes();
	if (this.settings.init_instantly === true)
		this.init();
}

dhtmlxSpreadSheet.prototype = {

	init: function() {
		this.toolbarInit();
		this.mathInit();
		this.setSizes();
		if (!this.grid)
			this.grid = new dhtmlXGridObject(this.settings.parent.grid);
		this.grid.ssheet = this;

		this.grid.setSkin(this.settings.skin);
		this.grid.setImagePath(this.settings.image_path);
		this.fillHeader();

		this.attachGridKeys(this.grid);
		this.grid.doClick = function() { return self.doClick.apply(self.grid, arguments); };

		var cell_type = this.settings.read_only ? 'rotxt' : 'edsh';
		var resize_type = 'true';
		var widths = [this.settings.left_width];
		var types = ['ro'];
		var sorts = ['na'];
		var aligns = ['right'];
		var resize = [resize_type];
		for (var i = 0; i < this.settings.cols; i++) {
			widths.push(this.settings.column_width);
			types.push(cell_type);
			sorts.push('na');
			aligns.push('left');
			resize.push(resize_type);
		}
		this.grid.setInitWidths(widths.join(','));
		this.grid.setColTypes(types.join(','));
		this.grid.setColSorting(sorts.join(','));
		this.grid.setColAlign(aligns.join(','));
		this.grid.enableResizing(resize.join(','));
		this.grid.enableBlockSelection(true);
		if (this.settings.autoheight === true)
			this.grid.enableAutoHeight(true);
		if (this.settings.autowidth === true)
			this.grid.enableAutoWidth(true);
		this.grid.setColumnHidden(0, !this.settings.show_row_numbers);
		
		// adds context menu
		var menu = this.addContext();
		this.grid.enableContextMenu(menu);
		this.grid.init();
		this.fillEmpty();
		this.attachDblClickToHeader();
		this.lefttopEvent();

		var self = this;
		this.grid.attachEvent("onBeforeBlockSelected", function(id, index){
			if (index === 0) return false;
			self.mathCancel();
			return true;
		});
		this.grid.attachEvent("onBeforeSelect", function(rId, cInd) {
			if (cInd === 0) return false;
			SpreadsheetBuffer.to_area(self, self.grid.getSelectedBlock());
			return true;
		});
		if (!this.settings.read_only) {
			this.grid.attachEvent("onResizeEnd", function(e) {
				if (!e.resized) return;
				var index = e.resized._cellIndex;
				if (index === 0) return;
				self.saveHeadCell(index);
				self.setSizes();
			});
			if (!this.grid.startColResize_original) {
				this.grid.startColResize_original = this.grid.startColResize;
				this.grid.startColResize = function(ev) {
					var el = ev.target||ev.srcElement;
					if (el.tagName != "TD")
						el=this.getFirstParentOfType(el, "TD")

					self._old("header", [el._cellIndex]);

					self.grid.startColResize_original(ev)
				};
			}
		}
		this.grid.attachEvent("onResize", function(cInd,cWidth,obj){
			if (cInd === 0) return false;
			return true;
		});

		// load cell styles in toolbar
		this.grid.attachEvent("onRowSelect", function(id, cInd) {
			if (cInd === 0) return false;
			if (self.dont_lose_focus !== true) {
				SpreadsheetBuffer.to_area(self, self.grid.getSelectedBlock());
			} else
				self.dont_lose_focus = false;
			self.loadCellStyle(id, cInd);
			return true;
		});
		this.grid.attachEvent("onBlockSelected", function() {
			SpreadsheetBuffer.to_area(self, self.grid.getSelectedBlock());
			self.loadCellStyle();
		});
		this.grid.attachEvent("onBlockSelectionShown", function() {
			if (!this._selectionObj.id) this._selectionObj.id = self.grid.uid();
			self.context.addContextZone(this._selectionObj.id);
		});
		// event for applying styles after cell edition
		this.grid.attachEvent("onEditCell", function(stage,rId,cInd,nValue,oValue) {
			if (stage == 0)
				if (self.isLocked(rId, cInd)) return false;
			if (stage == 1) {
				self.dont_lose_focus = true;
				self._old("cells", [rId, cInd, rId, cInd]);
			}
			if (stage == 2) {
				if (!self.grid.cells(rId, cInd).getRealChanged(true)) return false;
				this.clearBorderSelection();
				SpreadsheetBuffer.unselect(self);
				self.to_stack(rId, cInd);
				self.validateCell(rId, cInd);
				window.setTimeout(function() {
					self.applyStyles();
				}, 100);
			}
			return true;
		});
		this.grid.attachEvent("onBorderSelected", function(rId1, cInd1, rId2, cInd2){
			var range;
			if ((rId1 === rId2)&&(cInd1 === cInd2)) {
				range = self.getColName(cInd1) + rId1;
			} else {
				range = self.getColName(cInd1) + rId1 + ':' + self.getColName(cInd2) + rId2;
			}
			SpreadSheetMathHint.setRange(range);
			return true;
		});
		this.grid.attachEvent("onBorderSelectionStart", function(rId, cInd){
			return (cInd === 0) ? false : true;
		});
		this.grid.attachEvent("onBorderSelectionMove", function(rId1, cInd1, rId2, cInd2){
			return (cInd2 === 0) ? false: true;
		});
		this.grid.attachEvent("onTab", function(mode){
			var block = this.getSelectedBlock();
			if (!mode && block && block.LeftTopCol === 1) return false;
			return true;
		});
		dhtmlxEvent(this.settings.parent.parent, "mouseup", function() {
			window.setTimeout(function() {
				self.grid.isActive = true;
			}, 1);
		});

		// prevent loose focus event calling
		this.grid.entBox.onbeforedeactivate = null;
		this.grid.selectCell(0, 1);
		this.settings.parent.grid.className += ' spreadsheet';
		this.editor = SpreadSheetHeaderEditor.init();
		this.config = SpreadSheetConfig.init(this.settings.parent.parent);
		this.buffer = SpreadsheetBuffer.init();
	},

	toolbarInit: function() {
		var items = this.get_toolbar_config(this.settings.defaults.toolbar_items);
		if (items.length === 0) {
			this.settings.hide_toolbar = true;
			this.setSizes();
			return;
		} else {
			this.settings.hide_toolbar = false;
		}
		this.toolbar = new dhtmlXToolbarObject({
			parent: this.settings.parent.toolbar,
			icon_path: this.settings.icons_path,
			items: items,
			skin: this.settings.skin
		});

		// sets toolbar items position
		var poss = { left: false, right: false };
		for (var i = 0; i < items.length; i++) {
			if (items[i].pos == 'right')
				poss.right = i;
			else
				poss.left = i;
		}
		if (poss.left === false)
			this.toolbar.setAlign('right');
		if (poss.right === false)
			this.toolbar.setAlign('left');
		if ((poss.left !== false) && (poss.right !== false))
			this.toolbar.addSpacer(items[poss.left].id);

		var self = this;
		this.toolbar.attachEvent("onClick", function(id) { return self.toolbarClick(id); });
		this.toolbar.attachEvent("onStateChange", function(id, state) {
			self.setCellsStyle(id, state);
		});
	},

	/*! check default configuration and return hash of values
	 *	which can be shown according the rule 'show' in its config
	 *	show='opt1,!opt2,opt3' means condition:
	 *	(this.settings.opt1 == true) && (this.settings.opt2 != true) && (this.settings.opt3 == true)
	 **/
	get_toolbar_config: function(all_items) {
		var enabled_items = [];
		for (var i = 0; i < all_items.length; i++) {
			var item = all_items[i];
			var show = (item.show || 'ever').split(',');
			var show_res = true;
			for (var j = 0; j < show.length; j++) {
				var rule = show[j];
				var invert = false;
				if (rule.substr(0, 1) == '!') {
					rule = rule.substr(1);
					invert = true;
				}
				var rule_result;
				if (typeof(this.settings[rule]) != 'undefined') {
					rule_result = (invert === true) ? !this.settings[rule] : this.settings[rule];
				} else {
					rule_result = false;
				}
				show_res = (show_res && rule_result);
			}

			if (show_res === true)
				enabled_items.push(all_items[i]);
		}
		return enabled_items;
	},


	toolbarClick: function(id) {
		var block = this.grid.getSelectedBlock();
		switch (id) {
			case 'settings':
				if (this.settings.read_only) return false;
				this.config.set({
					cols: this.settings.cols,
					rows: this.settings.rows,
					show_row_numbers: this.settings.show_row_numbers,
					show_export_buttons: this.settings.show_export_buttons
				});
				var pos = this.get_settings_pos();
				this.config.show(this, pos.x, pos.y);
				break;
			case 'export_pdf':
				this.export_to('pdf');
				break;
			case 'export_excel':
				// hide first column with row numbers before printing
				this.grid.setColumnHidden(0, true);
				this.export_to('excel');
				this.grid.setColumnHidden(0, false);
				break;
			case 'undo':
				this._undo("undo");
				break;
			case 'redo':
				this._undo("redo");
				break;
			case 'edit':
				if (block === null) break;
				block.LeftTopRow = parseInt(block.LeftTopRow, 10);
				block.RightBottomRow = parseInt(block.RightBottomRow, 10);
				if (this.isLocked(block.LeftTopRow, block.LeftTopCol)) return false;

				var value = this.grid.cells(block.LeftTopRow, block.LeftTopCol).getRealValue();
				this.hideToolbar();
				this.mathBegin(value);
				break;
			default:
				if (block === null) break;
				if (this.isLocked(block.LeftTopRow, block.LeftTopCol)) return false;
				this.setCellsStyle(id);
				break;
		}
		return true;
	},


	get_settings_pos: function() {
		var item_name = 'settings';
		var prefix = this.toolbar.idPrefix;
		var obj = null;
		for (var i in this.toolbar.objPull) {
			if (i == prefix + item_name) {
				obj = this.toolbar.objPull[i].obj;
			}
		}
		if (obj === null) return { x: 0, y: 0 };
		var pos = SpreadSheetConfig.get_pos(obj);
		return { x: pos.x - 240, y: pos.y + 30 };
	},

	fillHeader: function() {
		var cols = [""];
		for (var i = 0; i < this.settings.cols; i++)
			cols.push(this.getColName(i + 1));
		this.grid.setHeader(cols.join(","));
	},

	fillEmpty: function() {
		var data = { rows: [] };
		for (var i = 0; i < this.settings.rows; i++) {
			var row = [i + 1];
			for (var j = 1; j <= this.settings.cols; j++)
				row[j] = "";
			data.rows.push({ id: i + 1, data: row });
		}
		this.grid.parse(data, "json");
	},

	getColName: function(index) {
		var letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
		var name = '';
		var ind = index;
		var ready = false;
		var ch = "";
		var length = letters.length;
		while (!ready) {
			var rest = Math.floor(index/length);
			var c = index - rest*length;
			index = Math.floor(index/length);
			c--;
			if (c == -1) {
				c = length - 1;
				index--;
			}
			ch = (c) + ch;
			name = letters[c] + name;
			if (index <= 0)
				ready = true;
		}
		return name;
	},

	getColIndex: function(col) {
		var value = 0;
		col = col.toLowerCase();
		for (var i = 0; i < col.length; i++) {
			var ord = col.charCodeAt(i) - 96;
			if (ord < 0 || ord > 26) continue;
			value += ord*Math.pow(26, col.length - i - 1);
		}
		return value;
	},

	load: function(sheet, key, save_settings) {
		var self = this;
		this.settings.sheet = sheet = sheet || this.settings.sheet || null;
		this.settings.key = key || null;
		if (this.settings.sheet === null) return;
		var url = this.addParamToUrl(this.settings.load_url, 'sheet', sheet);
		if (this.settings.key)
			url = this.addParamToUrl(url, 'key', this.settings.key);
		if (this.settings.math)
			url = this.addParamToUrl(url, 'dhx_math', 'true');

		var post = {};
		if (save_settings === true) {
			var cfg = this.serialize_settings();
			post.sh_cfg = cfg;
		}
		SpreadsheetLoader.request(url, post, function(response) {
			var cells, col, row, value, width, i;
			var cfg = (typeof(response.config) != 'undefined') ? self.unserialize_settings(response.config) : self.settings.defaults;
			for (i in cfg) self.settings[i] = cfg[i];
			cfg.read_only = response.readonly;

			self.refresh(cfg, true);
			cells = response.cells;
			for (i = 0; i < cells.length; i++) {
				col = cells[i].col;
				row = cells[i].row;
				value = cells[i].text;
				var calc = cells[i].calc;
				self.setValue(row, col, value, calc);
				var style = cells[i].style;
				if (style) {
					self.getCellStyle(row, col).unserialize(style);
				}
			}
			cells = response.head;
			var els = self.grid.hdr.getElementsByTagName('div');
			for (i = 0; i < cells.length; i++) {
				col = parseInt(cells[i].col, 10);
				width = cells[i].width;
				value = cells[i].label;
				if (col !== 0) {
					value  = value.replace(/</g, '&lt;');
					value  = value.replace(/>/g, '&gt;');
					if (typeof(els[col])!= "undefined") els[col].innerHTML = value;
				}
				self.grid.setColWidth(col, width);
			}
			self.grid.setSizes();
			self.applyStyles();
			self.setSizes();
			self.render();
		}, this, this.settings.method);
	},

	addParamToUrl: function(url, param_name, param_value) {
		url += (url.indexOf("?")==-1)? "?" : "&";
		url += param_name + '=' + this.escape(param_value);
		return url;
	},

	setValue: function(row, col, formatted, real) {
		row = parseInt(row, 10);
		col = parseInt(col, 10);
		if ((row > this.settings.rows)||(col > this.settings.cols)) return;
		real = (typeof(real) !== 'undefined') ? real : formatted;
		if (!(this.grid.editor && this.grid.cells(row, col).cell === this.grid.editor.cell))
			this.grid.cells(row, col).setCValue(real, formatted);
	},

	clearAll: function() {
		this.grid.clearAll();
		this.fillEmpty();
		for (var i = 1; i < this.settings.cols; i++)
			this.grid.setColWidth(i, this.settings.column_width);
	},

	attachDblClickToHeader: function() {
		if (this.settings.read_only) return;
		var els = this.grid.hdr.getElementsByTagName('div');
		for (var i = 1; i < els.length; i++) {
			this.processHeaderCell(els[i], i);
		}
	},

	lefttopEvent: function() {
		if (this.settings.read_only) return;
		var els = this.grid.hdr.getElementsByTagName('td');
		var el = els[0];
		var self = this;
		dhtmlxEvent(el, "click", function() {
			self.grid._selectAll();
		});
		dhtmlxEvent(el, "mouseover", function() {
			el.className += ' selectall dhtmlxGrid_selection';
		});
		dhtmlxEvent(el, "mouseout", function() {
			el.className = el.className.replace(' selectall dhtmlxGrid_selection', '');
		});
	},

	processHeaderCell: function(el, pos) {
		var self = this;
		dhtmlxEvent(el, "dblclick", function(e) {
			var target = e.target || e.srcElement;
			var text = target.innerHTML;
			self._old("header", [pos]);
			self.editor.editStart(target, text, [self,pos,el]);
		});
	},

	saveHeadCell: function(pos, name) {
		var col = this.getCol(pos);
		name = name || col.name;
		var el = col.width;
		var width = col.width;
		this._push();

		var self = this;
		var sheet = this.settings.sheet;
		if (this.settings.sheet === null) return;
		var url = this.addParamToUrl(this.settings.save_url, "sheet", sheet);
		if (this.settings.key)
			url = this.addParamToUrl(url, "key", this.settings.key);
		url = this.addParamToUrl(url, "edit", "header");
		var post = {
			col: this.escape(pos),
			name: this.escape(name),
			width: this.escape(width)
		};
		SpreadsheetLoader.request(url, post, function(actions) {
			var col = parseInt(actions.col, 10);
			var status = actions.type;
			if (status == "deleted") el.innerHTML = self.getColName(col);
			self.grid.setSizes();
		}, this, this.settings.method);
	},

	getCol: function(index) {
		var col = {};
		col.col = index;
		var els = this.grid.hdr.getElementsByTagName('div');
		col.el = els[index];
		col.name = this.grid.getColLabel(index);
		col.width = this.grid.getColWidth(index);
		return col;
	},

	refresh: function(config, dont_load) {
		this.settings.cols = (config.cols > 0) ? config.cols : this.settings.cols;
		this.settings.rows = (config.rows > 0) ? config.rows : this.settings.rows;
		this.settings.show_row_numbers = (typeof(config.show_row_numbers) !== 'undefined') ? config.show_row_numbers : true;
		this.settings.show_export_buttons = (typeof(config.show_export_buttons) !== 'undefined') ? config.show_export_buttons : true;
		this.settings.read_only = config.read_only || false;
		if (this.grid)
			this.unload();
		this.init();
		this.settings.show_export_buttons = (typeof(config.show_export_buttons) !== 'undefined') ? config.show_export_buttons : true;
		if ((this.settings.sheet !== null)&&(dont_load !== true))
			this.load(this.settings.sheet, this.settings.key, true);
	},

	unload: function() {
		if (this.settings.hide_toolbar === false)
			this.toolbar.unload();
		this.grid.clearAll(true);
		this.grid = null;
		this.settings.styles = [];
	},

	getFullscreenCont: function() {
		document.body.parentNode.style.height = "100%";
		document.body.parentNode.style.width = "100%";
		document.body.style.height = "100%";
		document.body.style.width = "100%";
		document.body.style.margin = "0px";
		document.body.style.padding = "0px";
		document.body.style.overflow = "hidden";
		var parent = document.createElement("div");
		parent.style.height = "100%";
		parent.style.width = "100%";
		parent.style.position = "absolute";
		parent.style.top = "0px";
		parent.style.left = "0px";
		document.body.appendChild(parent);
		this.settings.fullscreen = true;
		return parent;
	},

	/*! creates two inner containers for toolbar and grid
	 **/
	processParentCont: function(parent) {
//		parent.style.position = 'relative';
		var toolbar_cont = document.createElement("div");
		toolbar_cont.style.height = this.tool_height + "px";
		parent.appendChild(toolbar_cont);
		var math_cont = document.createElement("div");
		math_cont.style.height = this.tool_height + "px";
		math_cont.style.display = "none";
		parent.appendChild(math_cont);
		var grid_cont = document.createElement("div");
		var self = this;
		if (this.settings.fullscreen)
			dhtmlxEvent(window, "resize", function() {
				window.setTimeout(function() {
					self.setSizes();
				}, 100);
			});
		dhtmlxEvent(parent, "click", function() {
			if (self.grid) self.grid.setActive(true);
		});
		parent.appendChild(grid_cont);
		return { grid: grid_cont, toolbar: toolbar_cont, math: math_cont, parent: parent };
	},

	setSizes: function(hide_toolbar) {
		var scroll_width = 0;
		var parent = (this.settings.parent.parent || this.settings.parent);
		var toolbar_height = (this.settings.hide_toolbar === true) ? 0 : this.tool_height;
		var size;
		if (this.settings.fullscreen === true)
			size = this.getSize(parent);
		else {
			size = this.getSize(this.settings.parent.grid);
			if (size.height === 0) size.height = this.tool_height;
			if (this.settings.autowidth)
				parent.style.width = size.width + "px";
			else
				size.width = parent.offsetWidth;
			if (this.settings.autoheight)
				parent.style.height = (size.height) + "px";
			else
				size.height = parent.offsetHeight;
		}
		this.settings.parent.toolbar.style.height = toolbar_height + "px";
		this.settings.parent.toolbar.style.width = (size.width - 10 - scroll_width - this.tool_borders[this.settings.skin]) + "px";
		this.settings.parent.grid.style.height = (size.height - toolbar_height) + "px";
		this.settings.parent.grid.style.width = (size.width - 2 - scroll_width) + "px";
		if (this.grid) this.grid.setSizes();
	},

	showToolbar: function() {
		this.settings.parent.toolbar.style.display = 'block';
		this.toolbar._fixSpacer();
	},

	hideToolbar: function() {
		this.settings.parent.toolbar.style.display = 'none';
	},

	/*! callback for style buttons click
	 *	@param id
	 *		id of clicked button
	 *	@param state
	 *		on/off state for TwoStateButton
	 **/
	setCellsStyle: function(id, state) {
		if (this.settings.read_only) return;

		var ids_dont_process = {
			"topcolor": true,
			"topbgcolor": true,
			"topalign": true
		};
		if (ids_dont_process[id]) return;

		var name = id;
		var value = state ? 'true' : 'false';

		var name_parse = name.split("__");
		if (name_parse.length == 2) {
			name = name_parse[0];
			value = name_parse[1];
		}
		var block = this.grid.getSelectedBlock();
		this._old("cells", [block.LeftTopRow, block.LeftTopCol, block.RightBottomRow, block.RightBottomCol]);

		// apply styles for each selected cell
		this.mapSelection(function(row, col) {
			if (this.isLocked(row, col)) return false;
			var style = this.getCellStyle(row, col);
			style.set(name, value);
			this.to_stack(row, col);
			this.applyStyles(row, col);
			this.loadCellStyle();
			return true;
		});
	},


	/*! returns style object or creates new by row/col
	 **/
	getCellStyle: function(row, col) {
		var id = row + "___" + col;
		if (this.settings.styles[id])
			return this.settings.styles[id];
		else {
			this.settings.styles[id] = new SpreadSheetCss();
			return this.settings.styles[id];
		}
	},

	/*! applies all saved styles to cells
	 **/
	applyStyles: function(row, col) {
		if (typeof(col) == "undefined") {
			for (var i in this.settings.styles) {
				var coords = i.split('___');
				row = coords[0];
				col = coords[1];
				this.applyCellStyle(row, col);
			}
		} else
			this.applyCellStyle(row, col);
	},

	applyCellStyle: function(row, col) {
		if (row < (this.grid.rowsBuffer.length + 1) && col < this.grid._cCount){
			var cell = this.grid.cells(row, col);
			cell.cell.style.cssText = this.settings.styles[row + '___' + col].get_css();
		}
	},

	/*! load in toolbar styles for selected cell
	 **/
	loadCellStyle: function(row, col) {
		if (this.settings.read_only) return;
		if (col === 0) return;
		if (this.settings.hide_toolbar === true) return;
		var block = this.grid.getSelectedBlock("id");
		if (block !== null) {
			block.LeftTopRow = parseInt(block.LeftTopRow, 10);
			block.RightBottomRow = parseInt(block.RightBottomRow, 10);
		}
		if (block === null) return;
		row = (typeof(row) != "undefined") ? row : block.LeftTopRow;
		col = (typeof(col) != "undefined") ? col : block.LeftTopCol;
		if ((typeof(row) == 'undefined') || (typeof(col) == 'undefined')) return;
		var style = this.getCellStyle(row, col);
		var json = style.get_json();

		if (json.bold == "true")
			this.toolbar.setItemState('bold', true);
		else
			this.toolbar.setItemState('bold', false);

		if (json.italic == "true")
			this.toolbar.setItemState('italic', true);
		else
			this.toolbar.setItemState('italic', false);

		this.toolbar.setItemImage('topcolor', 'colors/color_' + json.color + '.png');
		this.toolbar.setItemImage('topbgcolor', 'colors/color_' + json.bgcolor + '.png');
		this.toolbar.setItemImage('topalign', 'align_' + json.align + '.png');
	},

	getSize: function(el) {
		var size = {
			width: el.offsetWidth,
			height: el.offsetHeight
		};
		return size;
	},

	escape: function(value) {
		return encodeURIComponent(value);
	},

	// get serialized text of some coords block
	getBlockText: function() {
		return this.selectedText();
	},

	selectedText: function(formulas) {
		var cells_del = "\t";
		var rows_del = "\n";
		var text = [];

		var line = [];
		var last_row = -1;
		this.mapSelection(function(row, col) {
			if (last_row >= 0 && row !== last_row) {
				if (!formulas) line = line.join(cells_del);
				text.push(line);
				line = [];
			}
			var value = formulas ? this.getCellValue(row, col) : this.grid.cells(row, col).getValue();
			line.push(value);
			last_row = row;
		});
		if (!formulas) line = line.join(cells_del);
		text.push(line);
		if (!formulas) text = text.join(rows_del);
		return text;
	},

	getCellValue: function(row, col) {
		var real = this.grid.cells(row, col).getRealValue();
		var value = {
			real: this._math_abs2rel(row, col, real),
			value: this.grid.cells(row, col).getValue(),
			width: this.grid.getColWidth(col),
			style: this.getCellStyle(row, col).serialize()
		};
		return value;
	},
	setCellValue: function(row, col, value) {
		if (typeof(value) === "string")
			return this.setValue(row, col, value);
		this.grid.setColWidth(col, value.width);
		this.saveHeadCell(col);

		this.getCellStyle(row, col).unserialize(value.style);
		var real = this._math_rel2abs(row, col, value.real);
		this.setValue(row, col, real);

		var self = this;
		window.setTimeout(function() {
			self.applyStyles();
		});
		this.renderCell(row, col);
		return true;
	},

	_math_abs2rel: function(row, col, value) {
		if (value[0] === '=') {
			var regexp = /(\$?([A-Z]+))(\$?(\d+))/i;
			while (regexp.test(value)) {
				var matches = regexp.exec(value);
				var _row = matches[4];
				var _col = this.getColIndex(matches[2]);
				_row = (matches[3] === matches[4]) ? (_row - row).toString() : ('$' + _row);
				_col = (matches[1] === matches[2]) ? (_col - col).toString() : ('$' + _col);
				var rel = "(" + _row + "__" + _col + ")";
				value = value.replace(matches[0], rel);
			}
		}
		return value;
	},

	_math_rel2abs: function(row, col, value) {
		var regexp = /\((\$?(-?\d+))__(\$?(-?\d+))\)/i;
		while (regexp.test(value)) {
			var matches = regexp.exec(value);
			var _abs_row = (matches[1] !== matches[2]);
			var _abs_col = (matches[3] !== matches[4]);

			var _row = (!_abs_row) ? (parseInt(matches[2], 10) + row) : matches[2];
			var _col = (!_abs_col) ? (parseInt(matches[4], 10) + col) : matches[4];

			_abs_row = _abs_row ? '$' : '';
			_abs_col = _abs_col ? '$' : '';

			var abs = (_col < 1) ? '0' : (_abs_col + this.getColName(_col) + _abs_row + _row);
			value = value.replace(matches[0], abs);
		}
		return value;
	},

	dumpCopy: function() {
		this._copydump.inside = this.selectedText(true);
		this._copydump.outside = this.selectedText();
	},

	// set serialized text to selected block or cell
	setBlockText: function(text) {
		if (this.settings.read_only === true) return;

		if (text == this._copydump.outside)
			text = this._copydump.inside;
		else {
			text = text.split("\n");
			for (var i = 0; i < text.length; i++)
				text[i] = text[i].split("\t");
		}

		// when inserting from MS Excel it adds last empty row which shouldn't be inserted
		// so check if it exists - then don't process last row
		var inc = ((text.length > 1)&&(text[text.length - 1].length === 1)&&(text[text.length - 1][0] === "")) ? -1 : 0;

		// is one value copied or several cells
		var single = ((text.length == 1)&&(text[0].length == 1)) ? true : false;

		if (single) {
			var block = this.grid.getSelectedBlock();
			if (block)
				this._old("cells", [block.LeftTopRow, block.LeftTopCol, block.RightBottomRow, block.RightBottomCol]);
			var fill_value = text[0][0];
			this.mapSelection(function(row, col) {
				if (this.isLocked(row, col)) return false;
				this.setCellValue(row, col, fill_value);
				this.grid.editStop();
				this.to_stack(row, col);
				return true;
			});
		} else {
			var coords = this.grid.getSelectedBlock();
			if (coords === null) return;
			var top = parseInt(coords.LeftTopRow, 10);
			var left = parseInt(coords.LeftTopCol, 10);
			var textwidth = 0;
			for (var i = 0; i < text.length; i++)
				textwidth = Math.max(textwidth, text[i].length);
			this._old("cells", [top, left, top + text.length + inc - 1, left + textwidth - 1]);
			for (var i = 0; i < text.length + inc; i++) {
				for (var j = 0; j < text[i].length; j++) {
					if ((top + i > this.settings.rows)||(left + j > this.settings.cols))
						continue;
					if (this.isLocked(top + i, left + j)) continue;
					var value = text[i][j];
					this.setCellValue(top + i, left + j, value);
					this.to_stack(top + i, left + j);
				}
			}
		}
		this.grid._refreshBlockSelection();
	},

	// add cell to save stack
	to_stack: function(row, col, value) {
		var cell = {
			row: row,
			col: col
		};
		this._to_progress(row, col);
		this._push();
		if (typeof(value) != "undefined")
			cell.value = value;

		// check: if this cell already in stack - replace it
		for (var i = 0; i < this.stack.length; i++)
			if (this.stack[i].row == cell.row && this.stack[i].col == cell.col) {
				this.stack[i] = cell;
				this.send();
				return true;
			}
		// else add as new cell
		this.stack.push(cell);
		this.send();
		return true;
	},


	_to_progress: function(row, col) {
		if (!this._in_progr[row + '__' + col])
			this._in_progr[row + '__' + col] = 0;
		this._in_progr[row + '__' + col]++;
	},

	_from_progress: function(row, col) {
		if (this._in_progr[row + '__' + col])
			this._in_progr[row + '__' + col]--;
	},

	_in_progress: function(row, col) {
		return (this._in_progr[row + '__' + col]) ? this._in_progr[row + '__' + col] : 0;
	},

	// start timer after which request will be sent
	send: function() {
		var self = this;
		if (this.stack.length == 1)
			window.setTimeout(function() {
				self.send_save_query();
			}, this.settings.timeout);
	},

	// send all data from stack
	send_save_query: function() {
		var url = this.addParamToUrl(this.settings.save_url, 'sheet', this.settings.sheet);
		if (this.settings.math) url = this.addParamToUrl(url, 'dhx_math', 'true');
		if (this.settings.key)
			url = this.addParamToUrl(url, 'key', this.settings.key);
		url = this.addParamToUrl(url, 'edit', 'true');
		var post = {
			rows: [],
			cols: [],
			values: [],
			styles: []
		};
		if (this.stack.length == 0) return;
		var i = 0;
		while (this.stack.length > 0) {
			var cell = this.stack.pop();
			post.rows[i] = cell.row;
			post.cols[i] = cell.col;
			var value = cell.value || this.grid.cells(cell.row, cell.col).getRealValue();
			var style = this.getCellStyle(cell.row, cell.col);
			style = style.serialize();
			post.values[i] = value;
			post.styles[i] = style;
			i++;
		}
		var self = this;
		SpreadsheetLoader.request(url, post, function(response) {
			for (var i = 0; i < response.length; i++) {
				var cell = response[i];
				self._from_progress(cell.row, cell.col);
				if (cell.type == 'updated' && self._in_progress(cell.row, cell.col) === 0) {
					self.setValue(cell.row, cell.col, cell.text, cell.calc);
				}
			}
		}, this, "ajax");
	},

	export_to: function(type) {
		this.grid.editStop();
		if (type === 'excel') {
			var url  = this.addParamToUrl(this.settings.export_excel_url, 'spreadsheet', this.settings.version);
			this.toExcel(url, 'full_color');
		} else {
			url  = this.addParamToUrl(this.settings.export_pdf_url, 'spreadsheet', this.settings.version);
			this.toPDF(url, 'full_color');
		}
	},

	serialize_settings: function(dont_join) {
		var options = {
			'cols': this.settings.cols,
			'rows': this.settings.rows,
			'show_row_numbers': this.settings.show_row_numbers,
			'show_export_buttons': this.settings.show_export_buttons
		};
		var ser = (dont_join === true) ? {} : [];
		for (var i in options)
			if (dont_join)
				ser[i] = options[i];
			else
				ser.push(i + ':' + options[i]);
		if (!dont_join) ser = ser.join(';');
		return ser;
	},

	unserialize_settings: function(settings) {
		settings = settings.split(';');
		var config = {};
		for (var i = 0; i < settings.length; i++) {
			var option = settings[i].split(':');
			if (option.length == 2)
				config[option[0]] = this.process_value(option[1]);
		}
		return config;
	},

	process_value: function(value) {
		if (value == 'true') return true;
		if (value == 'false') return false;
		return value;
	},

	mathInit: function() {
		var items = this.get_toolbar_config(this.settings.defaults.math_items);
		this.math = new dhtmlXToolbarObject({
			parent: this.settings.parent.math,
			icon_path: this.settings.icons_path,
			items: items,
			skin: this.settings.skin
		});
		var input = this.math.objPull[this.math.idPrefix + 'math'].obj.childNodes[0];
		if (this.settings.math) SpreadSheetMathHint.init(input);
		var self = this;
		this.math.attachEvent("onClick", function(id) {
			switch (id) {
				case 'save':
					self.mathSave();
					break;
				case 'cancel':
					self.mathCancel();
					break;
				case 'function':
					if (self.settings.math)
						SpreadSheetMathHint.all(self.settings.parent.parent, {
							insert: function(f) {
								var input = self.math.objPull[self.math.idPrefix + 'math'].obj.childNodes[0];
								if (input.value.substr(0, 1) !== '=') input.value = '=' + input.value;
								var cursor = SpreadSheetMathHint.getCursorPos(input);
								var text = input.value.substr(0, cursor) + f.regexp + input.value.substr(cursor + 1);
								input.value = text;
								input.focus();
								SpreadSheetMathHint.mathKeyDown({ keyCode: -1 });
							},
							cancel: function() {
								input.focus();
							}
						});
					break;
				default:
					break;
			}
		});
	},

	mathBegin: function(value) {
		this.showMath();
		var input = this.math.objPull[this.math.idPrefix + 'math'].obj.childNodes[0];
		input.value = value || "";

		if (!this.settings.math) {
			input.focus();
			var self = this;
			input.onkeydown = function(e) {
				e = e||window.event;
				var code = e.keyCode||e.which;
				if (code === 13)
					self.mathSave();
			};
			return false;
		}
		SpreadSheetMathHint.input = input;
		SpreadSheetMathHint.cursor = input.value.length;
		input.ssheet = this;
		SpreadSheetMathHint.attachEvent(input, this);
		SpreadSheetMathHint.showBorders(input);
		if (input.value.substring(0, 1) === '=')
			this.grid.enableBorderSelection(true);
		SpreadSheetMathHint.setCursorPos(input, input.value.length);
		return true;
	},

	mathSave: function(input) {
		input = input || this.math.objPull[this.math.idPrefix + 'math'].obj.childNodes[0];
		var save_required = (input && input.parentNode && input.parentNode.className.indexOf("dhx_toolbar_btn") !== -1) ? true : false;
		var value = input.value;
		value = SpreadSheetMathHint.function_ending(value);
		this.hideMath();
		this.showToolbar();
		this.grid.clearBorderSelection();
		this.grid.enableBorderSelection(false);
		var block = this.grid.getSelectedBlock();
		if (save_required)
			this._old("cells", [block.LeftTopRow, block.LeftTopCol, block.RightBottomRow, block.RightBottomCol]);
		this.mapSelection(function(row, col) {
			this.setValue(row, col, value);
			this.grid.editStop();
			if (save_required)
				this.to_stack(row, col);
		});
	},

	mathCancel: function() {
		this.grid.clearBorderSelection();
		this.grid.enableBorderSelection(false);
		this.grid.editStop(true);
		this.hideMath();
		this.showToolbar();
	},

	hideMath: function() {
		SpreadSheetMathHint.hide();
		this.settings.parent.math.style.display = 'none';
		this.math.objPull[this.math.idPrefix + 'math'].obj.childNodes[0].blur();
//		this.grid.entBox.focus();
	},

	showMath: function() {
		this.settings.parent.math.style.display = 'block';
	},

	mapCells: function(r1, c1, r2, c2, callback) {
		var tmp;
		if (r1 > r2) tmp = r1, r1 = r2, r2 = tmp;
		if (c1 > c2) tmp = c1, c1 = c2,	c2 = tmp;

		var row_ind = 0;
		var col_ind;
		for (var row = r1; row <= r2; row++ ) {
			if (!this.grid.doesRowExist(row)) continue;
			col_ind = 0;
			for (var col = c1; col <= c2; col++) {
				if ((row < 0) || (col <= 0)) continue;
				if ((row > this.settings.rows)||(col > this.settings.cols)) continue;
				callback.call(this, row, col, row_ind, col_ind);
				col_ind++;
			}
			row_ind++;
		}
	},

	mapSelection: function(callback) {
		var block = this.grid.getSelectedBlock();
		if (!block) return;
		block.LeftTopRow = parseInt(block.LeftTopRow, 10);
		block.RightBottomRow = parseInt(block.RightBottomRow, 10);
		this.mapCells(block.LeftTopRow, block.LeftTopCol, block.RightBottomRow, block.RightBottomCol, callback);
	},

	_undo: function(action) {
		var state = this.undo[action](this);
		if (!state) return true;
		var states = this.undo.states;
		if (typeof(states[state.type]) === 'undefined') return false;
		states[state.type].set.apply(this, [state]);
		return true;
	},

	_old: function(type, args) {
		var states = this.undo.states;
		if (typeof(states[type]) === 'undefined') return false;
		var state = states[type].get.apply(this, args);
		state.type = type;
		this._last_value = state;
		return true;
	},

	_push: function() {
		if (this._last_value) {
			this.undo.push(this._last_value);
			this._last_value = null;
		}
		this._undo_status();
	},

	_undo_status: function() {
		// set undo status
		if (this.undo.can_undo())
			this.toolbar.enableItem("undo");
		else
			this.toolbar.disableItem("undo");
		// set redo status
		if (this.undo.can_redo())
			this.toolbar.enableItem("redo");
		else
			this.toolbar.disableItem("redo");
	}
};


var SpreadSheetHeaderEditor;
var SpreadSheetConfig;
var SpreadSheetMathHint;
var SpreadSheetCss;