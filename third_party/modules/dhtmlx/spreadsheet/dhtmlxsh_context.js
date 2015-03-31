/*
 (c) DHTMLX Ltd, 2011
 Licensing: You allowed to use this component for free under GPL or you need to obtain Commercial/Enterprise license to use it in non-GPL project
 Contact: sales@dhtmlx.com
 */
 dhtmlxSpreadSheet.prototype.addContext = function() {
	var menu;
	if (this.context) {
		menu = this.context;
	} else {
		menu = new dhtmlXMenuObject();
		menu.setImagePath(this.settings.image_path);
		menu.setIconPath(this.settings.icons_path);	
		menu.renderAsContextMenu();
		menu.addNewChild(null, 1, "lock", "Lock", false, "lock.png");
		menu.addNewChild(null, 2, "validator", "Validate", false, "validate.png");
		menu.addRadioButton("child", "validator", 1, "none", "None", "validators", true, false);
		menu.addRadioButton("child", "validator", 2, "number", "Number", "validators", false, false);
		menu.addRadioButton("child", "validator", 3, "email", "Email", "validators", false, false);
		menu.addRadioButton("child", "validator", 4, "positive", "Positive", "validators", false, false);
		menu.addRadioButton("child", "validator", 5, "not_empty", "Not empty", "validators", false, false);
		var self = this;
		this.grid.attachEvent("onBeforeContextMenu", function(row, col){
			self._ctxCells = [{ row: row, col: col }];
			return self.onBeforeContextMenu(row, col);
        });
		menu.attachEvent("onBeforeContextMenu", function(){
			var block = self.grid.getSelectedBlock();
			if (block === null) return false;
			var cells = [];
			for (var i = block.LeftTopRow; i <= block.RightBottomRow; i++) {
				for (var j = block.LeftTopCol; j <= block.RightBottomCol; j++) {
					cells.push({ row: i, col: j });
				}
			}
			self._ctxCells = cells;
			return self.onBeforeContextMenu(cells[0].row, cells[0].col);
        });
		menu.attachEvent("onRadioClick", function(menuitemId, type) {
			self._validatorIsSetted(menuitemId,type);
			return true;
		});
		menu.attachEvent("onClick", function(id) {
			switch (id) {
				case 'lock':
					var range = self._old_ctx();
					var value = self.isLocked(range.minrow, range.mincol);
					for (var i = 0; i < self._ctxCells.length; i++)
						self.lockCell(self._ctxCells[i].row, self._ctxCells[i].col, !value);
					break;
				default:
					break;
			}
		});
		this.context = menu;
	}

	return menu;
};


dhtmlxSpreadSheet.prototype._old_ctx = function() {
	if (!this._ctxCells) return;
	var minrow = 100000;
	var mincol = 100000;
	var maxrow = -1;
	var maxcol = -1;
	for (var i = 0; i < this._ctxCells.length; i++) {
		minrow = Math.min(minrow, this._ctxCells[i].row);
		mincol = Math.min(mincol, this._ctxCells[i].col);
		maxrow = Math.max(maxrow, this._ctxCells[i].row);
		maxcol = Math.max(maxcol, this._ctxCells[i].col);
	}
	this._old("cells", [minrow, mincol, maxrow, maxcol]);
	return {
		minrow: minrow,
		mincol: mincol,
		maxrow: maxrow,
		maxcol: maxcol
	};
};

dhtmlxSpreadSheet.prototype.onBeforeContextMenu = function(row, col){
	if (col == 0) return false;
	if (this.settings.read_only) return false;
	var style = this.getCellStyle(row, col);
	var json = style.get_json();
	this.context.setRadioChecked("validators", json.validator);
	this.context.setItemText("lock", json.lock == "true" ? "Unlock" : "Lock");
	return true;
}

dhtmlxSpreadSheet.prototype._validatorIsSetted = function(menuitemid, type) {
	if (!this._ctxCells) return;
	var self = this;
	window.setTimeout(function() {
		var value = self.context.getRadioChecked("validators");
		self.context.hideContextMenu();
		self._old_ctx();
		for (var i = 0; i < self._ctxCells.length; i++) {
			var row = self._ctxCells[i].row;
			var col = self._ctxCells[i].col;
			if (self.isLocked(row, col)) continue;
			var style = self.getCellStyle(row, col);
			style.set('validator', value);
			self.to_stack(row, col);
			self.validateCell(row, col);
		}
		self._ctxCells = null;
	}, 1);
};


dhtmlxSpreadSheet.prototype.lockCell = function(row, col, value) {
	this.context.hideContextMenu();
	var style = this.getCellStyle(row, col);
	var lock = style.get('lock');
	var inverse_value = lock == 'false' ? 'true' : 'false';
	if (typeof(value) != 'undefined')
		value = (value == true) ? 'true' : 'false';
	else
		value = inverse_value;
	style.set('lock', value);
	this.to_stack(row, col);
	this.renderCell(row, col);
};

dhtmlxSpreadSheet.prototype.isLocked = function(row, col) {
	var style = this.getCellStyle(row, col);
	var lock = style.get('lock');
	return lock == 'false' ? false : true;
};

dhtmlxSpreadSheet.prototype.validate = function() {
	for (var i = 0; i < this.settings.rows; i++) {
		var row = i + 1;
		for (var j = 1; j <= this.settings.cols; j++) {
			this.validateCell(row, j);
		}
	}
}

dhtmlxSpreadSheet.prototype.validateCell = function(row, col) {
	var cell = this.grid.cells(row, col);
	var style = this.getCellStyle(row, col);
	var json = style.get_json();
	var validator = this.validators[json.validator]
	
	var value = cell.getValue();
	if (validator && this[validator] && this[validator](value) == false) {
		cell.cell.className += ' invalid';
	} else {
		cell.cell.className = cell.cell.className.replace(/ invalid/g, '');
	}
};


dhtmlxSpreadSheet.prototype.render = function() {
	for (var i = 0; i < this.settings.rows; i++) {
		var row = i + 1;
		for (var j = 1; j <= this.settings.cols; j++) {
			this.renderCell(row, j);
		}
	}
};


dhtmlxSpreadSheet.prototype.renderCell = function(row, col) {
	var cell = this.grid.cells(row, col);
	var style = this.getCellStyle(row, col);
	var json = style.get_json();
	this.validateCell(row, col);

	if (json.lock == 'true') {
		cell.cell.className += ' locked';
	} else {
		cell.cell.className = cell.cell.className.replace(/ locked/g, '');
	}
};

dhtmlxSpreadSheet.prototype._is_number = function(value) {
	var reg = /^\-?\d+(\.\d+)?$/;
	value = value.toString().trim();
	if (reg.test(value)) return true;
	return false;
}

dhtmlxSpreadSheet.prototype._is_email = function(value) {
	var reg = /^.+@.+\..{2,4}$/;
	value = value.toString().trim();
	if (reg.test(value)) return true;
	return false;
}

dhtmlxSpreadSheet.prototype._is_positive = function(value) {
	var reg = /^\d+(\.\d+)?$/;
	value = value.toString().trim();
	if (reg.test(value)) return true;
	return false;
}

dhtmlxSpreadSheet.prototype._is_not_empty = function(value) {
	value = value.toString().trim();
	if (value) return true;
	return false;
}

dhtmlxSpreadSheet.prototype.validators = {
	"none": null,
	"number": "_is_number",
	"email": "_is_email",
	"positive": "_is_positive",
	"not_empty": "_is_not_empty"
};


/*! additional event which occurs when block-selection container is shown.
 *  is used to make double click on selected cell a little better.
 **/
dhtmlXGridObject.prototype._ShowSelection = function()
{
	if (this._selectionObj) {
		this.callEvent("onBlockSelectionShown", []);
	    this._selectionObj.style.display = '';
	}
}