/*
 (c) DHTMLX Ltd, 2011
 Licensing: You allowed to use this component for free under GPL or you need to obtain Commercial/Enterprise license to use it in non-GPL project
 Contact: sales@dhtmlx.com
 */
 SpreadsheetBuffer = {

	area_id: 'spreadsheet_buffer_area',
	area: null,
	coords: null,
	cmd: 0,

	init: function() {
		if (SpreadsheetBuffer.area) return true;
		this.getArea();
		dhtmlxEvent(document.body, "keydown", function(e) {
			if (!SpreadsheetBuffer.callback) return true;
			var code = e.which;
			var ctrl = e.ctrlKey || false;
			var meta = e.metaKey || false;
			// insert functionality
			if (code == 86 && (ctrl === true || meta === true)) {
				SpreadsheetBuffer.from_area();
				SpreadsheetBuffer.unselect(SpreadsheetBuffer.callback);
			}
			// ctrl + c
			if (code == 67 && (ctrl === true || meta === true)) {
				SpreadsheetBuffer.callback.dumpCopy();
				SpreadsheetBuffer.select(SpreadsheetBuffer.callback);
			}
			// ctrl + x
			if (code == 88 && (ctrl === true || meta === true)) {
				SpreadsheetBuffer.callback.dumpCopy();
				SpreadsheetBuffer.select(SpreadsheetBuffer.callback);
				SpreadsheetBuffer.from_area();
				SpreadsheetBuffer.callback.mapSelection(function(row, col) {
					if (this.isLocked(row, col)) return false;
					var style = this.getCellStyle(row, col);
					style.set('bgcolor', 'ffffff');
					style.set('color', '000000');
					style.set('bold', 'false');
					style.set('italic', 'false');
					style.set('align', 'left');
					style.set('lock', 'false');
					style.set('validator', 'false');
					SpreadsheetBuffer.callback.applyStyles(row, col);
					this.renderCell(row, col);
					return true;
				});
			}
			return true;
		});
	},

	getArea: function() {
		if (this.area) return this.area;

		var div = document.createElement('div');
		div.className = 'editable';

		var area = document.createElement('textarea');
		area.id = this.area_id;
		area.className = 'spread_buffer_area';
		div.appendChild(area);
		document.body.appendChild(div);
		SpreadsheetBuffer.area = area;
		return this.area;
	},

	to_area: function(callback, coords) {
		if (coords === null) return;
		coords.LeftTopRow = parseInt(coords.LeftTopRow, 10);
		coords.RightBottomRow = parseInt(coords.RightBottomRow, 10);
		if (typeof(callback) != "undefined") {
			SpreadsheetBuffer.callback = callback;
		}
		var text;
		if (coords === null)
			text = "";
		else {
			text = callback.getBlockText(coords);
		}
		SpreadsheetBuffer.area.value = text;
		SpreadsheetBuffer.range = coords;
		window.setTimeout(function() {
			if (callback.dont_lose_focus) return false;
			SpreadsheetBuffer.area.focus();
			SpreadsheetBuffer.area.select();
		}, 1);
	},

	from_area: function() {
		window.setTimeout(function() {
			var text = SpreadsheetBuffer.area.value;
			if (SpreadsheetBuffer.callback.grid.editor) return false;
			SpreadsheetBuffer.callback.setBlockText(text);
			SpreadsheetBuffer.area.focus();
			SpreadsheetBuffer.area.select();
			return true;
		}, 100);
	},

	select: function(ssheet) {
		if (!SpreadsheetBuffer.range) return false;
		var r = SpreadsheetBuffer.range;
		r.color = "#9E9E9E";
		r.classname = 'solid';

		this.unselect(ssheet);
		delete r.obj;
		this._copyborder = ssheet.grid._showBorderSelection(r);
		return true;
	},
	unselect: function(ssheet) {
		if (this._copyborder)
			ssheet.grid._unsetBorderSelection(this._copyborder.obj);
		this._copyborder = null;
	}
};