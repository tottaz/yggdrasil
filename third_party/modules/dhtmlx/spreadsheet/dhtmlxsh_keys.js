/*
 (c) DHTMLX Ltd, 2011
 Licensing: You allowed to use this component for free under GPL or you need to obtain Commercial/Enterprise license to use it in non-GPL project
 Contact: sales@dhtmlx.com
 */
 dhtmlxSpreadSheet.prototype.attachGridKeys = function(grid) {
	if (!grid._key_events.k13_0_0_original) {

		var k13_0_0_original = grid._key_events.k13_0_0;
		var k13_0_0 = function() {
			if (this.ssheet.settings.math === true && this.editor && SpreadSheetMathHint.used(false)) return false;
			this.editStop();
			this.callEvent("onEnter", [
				(this.row ? this.row.idd : null),
				(this.cell ? this.cell._cellIndex : null)
			]);
			k13_0_0_original.call(this);
			this._still_active=true;
		};
		grid._key_events.k13_0_0 = function() {
			k13_0_0.apply(grid, arguments);
		};
	}

	// clear selected cells functionality
	grid._key_events.k46_0_0 = function() {
		if (this.editor) return false;
		SpreadsheetBuffer.getArea().value = "";
		SpreadsheetBuffer.from_area();
	};
	// tab is pressed
	grid._key_events.k9_0_0 = function() {
		this.editStop();
		if (!this.callEvent("onTab",[true])) return true;
		if (this.cell && (this.cell._cellIndex+1)>=this._cCount) return;
		this._clearBlockSelection();
		var z=this._getNextCell(null,1);
		if (z && this.row==z.parentNode){
			this.selectCell(z.parentNode,z._cellIndex,true,true);
			this._still_active=true;
		}
	};

	// shift + left
	grid._key_events.k39_0_1 = function() {
		if (this.editor) return false;
		this._selectionLeft(1);
	};
	// shift + right
	grid._key_events.k37_0_1 = function() {
		if (this.editor) return false;
		this._selectionRight(1);
	};
	// shift + up
	grid._key_events.k38_0_1 = function() {
		if (this.editor) return false;
		this._selectionUp(1);
	};
	// shift + down
	grid._key_events.k40_0_1 = function() {
		if (this.editor) return false;
		this._selectionDown(1);
	};
	// shift + page_up
	grid._key_events.k33_0_1 = function() {
		if (this.editor) return false;
		this._selectionUp(30);
	};
	// shift + page_down
	grid._key_events.k34_0_1 = function() {
		if (this.editor) return false;
		this._selectionDown(30);
	};

	// hide block selection when right
	if (!grid._key_events.k39_0_0_original) {
		var k39_0_0_original = grid._key_events.k39_0_0;
		grid._key_events.k39_0_0 = function() {
			if (this.editor) return false;
			this._clearBlockSelection();
			k39_0_0_original.call(this);
		};
	}

	// hide block selection when left
	if (!grid._key_events.k37_0_0_original) {
		var k37_0_0_original = grid._key_events.k37_0_0;
		grid._key_events.k37_0_0 = function() {
			if (this.editor) return false;
			this._clearBlockSelection();
			k37_0_0_original.call(this);
		};
	}

	// hide block selection when left
	if (!grid._key_events.k38_0_0_original) {
		var k38_0_0_original = grid._key_events.k38_0_0;
		grid._key_events.k38_0_0 = function() {
			if (this.editor) return false;
			this._clearBlockSelection();
			k38_0_0_original.call(this);
		};
	}

	// hide block selection when left
	if (!grid._key_events.k40_0_0_original) {
		var k40_0_0_original = grid._key_events.k40_0_0;
		grid._key_events.k40_0_0 = function() {
			if (this.editor) return false;
			this._clearBlockSelection();
			k40_0_0_original.call(this);
		};
	}

	grid._key_events.k37_1_0 = function(){
		if (this.editor) return false;
		this.selectCell(this.row,1,true);
	};

	// ctrl+A hot key
	grid._key_events.k65_1_0 = function() {
		if (this.editor) return false;
		this._selectAll();
	};

	// ctrl + Home
	grid._key_events.k36_1_0 = function() {
		if (this.editor || !this.rowsCol.length) return false;
		this.selectCell(this.rowsCol[0],1,true);
	};

	// ctrl+I - italic
	grid._key_events.k73_1_0 = function() {
		if (this.editor) return false;
		var state = this.ssheet.toolbar.getItemState('italic');
		this.ssheet.setCellsStyle('italic', !state);
	};
	// Ctrl+B - bold
	grid._key_events.k66_1_0 = function() {
		if (this.editor) return false;
		var state = this.ssheet.toolbar.getItemState('bold');
		this.ssheet.setCellsStyle('bold', !state);
	};
	// Ctrl+Z
	grid._key_events.k90_1_0 = function() {
		if (this.editor) return false;
		this.ssheet._undo("undo");
	};
	// Ctrl+Y
	grid._key_events.k89_1_0 = function() {
		if (this.editor) return false;
		this.ssheet._undo("redo");
	};

	grid._key_events.k_other = function(ev) {
		if (this.editor) return false;
		if (!ev.ctrlKey && !ev.metaKey && ev.keyCode>=40 && (ev.keyCode < 91 || (ev.keyCode >95 && ev.keyCode <111) || ev.keyCode >= 187))
			if (this.cell) {
				var c=this.cells4(this.cell);
				if (c.isDisabled()) return false;
				var t=c.getValue();
				this.editCell();
				if (this.editor) {
					this.editor.val=t;
					if (this.editor.obj && this.editor.obj.select)
						this.editor.obj.select();
				} else c.setValue(t);
			}
	};
};