/*
 (c) DHTMLX Ltd, 2011
 Licensing: You allowed to use this component for free under GPL or you need to obtain Commercial/Enterprise license to use it in non-GPL project
 Contact: sales@dhtmlx.com
 */
 function dhtmlxUndo() {
	var stack = [];
	var deep = 20;
	var step = -1;
	var self = this;
	var pop = function(ssheet) {
		var state = stack[step];
		stack[step] = self.states[state.type].refresh(ssheet, state);
		return state;
	};
	this.push = function(state) {
		stack.splice(step + 1, stack.length - step - 1);
		stack.push(state);
		if (stack.length > deep)
			stack.splice(0, 1);
		step = stack.length - 1;
	};
	this.undo = function(ssheet) {
		if (step < 0) return null;
		var state = pop(ssheet);
		step--;
		return state;
	};
	this.redo = function(ssheet) {
		if (step + 1 >= stack.length) return null;
		step++;
		var state = pop(ssheet);
		return state;
	};
	this.debug = function() {
		console.log(stack[step], step, stack);
	};
	
	this.can_undo = function() {
		return (step >= 0) ? true : false;
	};
	this.can_redo = function() {
		return (step < stack.length - 1) ? true : false;
	};

	// states description
	this.states = {
		cells: {
			get: function(minrow, mincol, maxrow, maxcol) {
				var values = [];
				var styles = [];
				var width = [];
				this.mapCells(minrow, mincol, maxrow, maxcol, function(row, col) {
					var value = this.grid.cells(row, col).getRealValue();
					values[row + '__' + col] = value;
					var style = this.getCellStyle(row, col);
					styles[row + '__' + col] = style.serialize();
					width[col] = this.grid.getColWidth(col);
				});
				var sel = this.grid.getSelectedBlock();
				return {
					values: values,
					styles: styles,
					width: width,
					sel: sel,
					range: {
						minrow: minrow,
						mincol: mincol,
						maxrow: maxrow,
						maxcol: maxcol
					}
				};
			},
			set: function(state) {
				var values = state.values;
				var styles = state.styles;
				var r = state.range;
				this.mapCells(r.minrow, r.mincol, r.maxrow, r.maxcol, function(row, col) {
					if (typeof(values[row + '__' + col]) !== 'undefined') {
						var value = values[row + '__' + col];
						this.setValue(row, col, value);
						this.to_stack(row, col);
					}
					if (typeof(styles[row + '__' + col]) !== 'undefined') {
						var style = this.getCellStyle(row, col);
						style.unserialize(styles[row + '__' + col]);
					}
					this.renderCell(row, col);
				});
				var width = state.width;
				for (var col in width) {
					this.grid.setColWidth(col, width[col]);
					this.saveHeadCell(col);
				}
				var sel = state.sel;
				this.grid.setBlockSelection(sel);
				this.applyStyles();
			},
			refresh: function(ssheet, state) {
				var r = state.range;
				state = this.get.apply(ssheet, [r.minrow, r.mincol, r.maxrow, r.maxcol]);
				state.type = "cells";
				return state;
			}
		},

		header: {
			get: function(col) {
				var els = this.grid.hdr.getElementsByTagName('div');
				var name = (typeof(els[col])!= "undefined") ? els[col].innerHTML : this.getColName(col);
				var width = this.grid.getColWidth(col);
				return {
					col: col,
					name: name,
					width: width
				};
			},
			set: function(state) {
				this.grid.setColWidth(state.col, state.width);
				var els = this.grid.hdr.getElementsByTagName('div');
				if (typeof(els[state.col])!= "undefined") els[state.col].innerHTML = state.name;
				this.saveHeadCell(state.col, state.name);
				this.grid._refreshBlockSelection();
			},
			refresh: function(ssheet, state) {
				state = this.get.apply(ssheet, [state.col]);
				state.type = "header";
				return state;
			}
		}
	};

};