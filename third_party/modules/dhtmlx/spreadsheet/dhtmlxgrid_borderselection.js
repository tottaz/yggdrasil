/*
 (c) DHTMLX Ltd, 2011
 Licensing: You allowed to use this component for free under GPL or you need to obtain Commercial/Enterprise license to use it in non-GPL project
 Contact: sales@dhtmlx.com
 */
 dhtmlXGridObject.prototype.addBorderSelection = function(LeftTopRow, LeftTopCol, RightBottomRow, RightBottomCol) {
	if (typeof(this._borders_store) === 'undefined') this._borders_store = [];
	var border = {
		id: this.uid(),
		LeftTopRow: LeftTopRow,
		LeftTopCol: LeftTopCol,
		RightBottomRow: RightBottomRow,
		RightBottomCol: RightBottomCol
	};
	for (var i = 0; i < this._borders_store.length; i++) {
		var bord = this._borders_store[i];
		if ((border.LeftTopRow === bord.LeftTopRow)&&(border.LeftTopCol === bord.LeftTopCol)&&(border.RightBottomRow === bord.RightBottomRow)&&(border.RightBottomCol === bord.RightBottomCol)) {
			border = this._borders_store[i];
			return border;
		}
	}
	this._borders_store.push(border);
	this.showBorderSelection();
	return border;
};

dhtmlXGridObject.prototype.showBorderSelection = function() {
	for (var i = 0; i < this._borders_store.length; i++)
		this._showBorderSelection(this._borders_store[i]);
};

dhtmlXGridObject.prototype._showBorderSelection = function(border) {
	this._unsetBorderSelection(border.obj);

	// border goes out of grid range
	var cell1_exists = this.doesCellExist(border.LeftTopRow, border.LeftTopCol);
	var cell2_exists = this.doesCellExist(border.RightBottomRow, border.RightBottomCol);
	if ((!cell1_exists) || (!cell2_exists)) return null;

	if (typeof(border.color) === 'undefined')
		border.color = this.generateBorderColor();

	border.obj = {};
	border.obj.top = document.createElement('div');
	border.obj.top.className = 'border_selection_top' + (border.classname ? (' ' + border.classname) : '');
	border.obj.top.style.borderColor = border.color;

	border.obj.left = document.createElement('div');
	border.obj.left.className = 'border_selection_left' + (border.classname ? (' ' + border.classname) : '');
	border.obj.left.style.borderColor = border.color;

	border.obj.bottom = document.createElement('div');
	border.obj.bottom.className = 'border_selection_bottom' + (border.classname ? (' ' + border.classname) : '');
	border.obj.bottom.style.borderColor = border.color;

	border.obj.right = document.createElement('div');
	border.obj.right.className = 'border_selection_right' + (border.classname ? (' ' + border.classname) : '');
	border.obj.right.style.borderColor = border.color;


	var offset = this.getPosition(this.obj);
	var cell1 = this.cells(border.LeftTopRow, border.LeftTopCol).cell;
	var cell2 = this.cells(border.RightBottomRow, border.RightBottomCol).cell;
	var pos1 = this.getPosition(cell1);
	var pos2 = this.getPosition(cell2);
	var x1, x2, y1, y2;
	var borderwidth = 2;
	if (pos2[0] > pos1[0]) {
		x1 = pos1[0];
		x2 = pos2[0] + cell2.offsetWidth;
	} else {
		x1 = pos2[0];
		x2 = pos1[0] + cell1.offsetWidth;
	}
	if (pos2[1] > pos1[1]) {
		y1 = pos1[1];
		y2 = pos2[1] + cell2.offsetHeight;
	} else {
		y1 = pos2[1];
		y2 = pos1[1] + cell1.offsetHeight;
	}
	var x = (x1 - offset[0]);
	var y = (y1 - offset[1]);
	var width = (Math.abs(x1 - x2) - borderwidth);
	var height = (Math.abs(y1 - y2) - borderwidth);
	border.obj.top.style.left = x + 'px';
	border.obj.top.style.top = y + 'px';
	border.obj.top.style.width = width + 'px';

	border.obj.bottom.style.left = x + 'px';
	border.obj.bottom.style.top = (y + height) + 'px';
	border.obj.bottom.style.width = width + 'px';

	border.obj.left.style.left = x + 'px';
	border.obj.left.style.top = y + 'px';
	border.obj.left.style.height = height + 'px';

	border.obj.right.style.left = (x + width) + 'px';
	border.obj.right.style.top = y + 'px';
	border.obj.right.style.height = height + 'px';

	this.objBox.appendChild(border.obj.top);
	this.objBox.appendChild(border.obj.left);
	this.objBox.appendChild(border.obj.bottom);
	this.objBox.appendChild(border.obj.right);
	return border;
};

dhtmlXGridObject.prototype.getPosition = function(e) {
	var left = 0;
	var top  = 0;
	while (e.offsetParent) {
		left += e.offsetLeft - e.scrollLeft;
		top  += e.offsetTop - e.scrollTop;
		e     = e.offsetParent;
	}
	left += e.offsetLeft;
	top  += e.offsetTop;
	return {x:left, y:top};
};

dhtmlXGridObject.prototype.setColorsBorderSelection = function() {
	if (!this._default_borders_colors)
		this._default_borders_colors = [];
	var presets = [
		'#ff0000',
		'#00ff00',
		'#0000ff',
		'#00ffff',
		'#ff00ff',
		'#533B9C',
		'#689C00',
		'#D65200',
		'#8F7F36',
		'#FF9100',
		'#00B530',
		'#FF0084',
		'#B300A4',
		'#4754FF',
		'#00C3FF'
	];
	this._borders_colors = presets.concat(this._default_borders_colors);
};

dhtmlXGridObject.prototype.generateBorderColor = function() {
	var color;
	if (typeof(this._borders_colors) === 'undefined')
		// the most popular colors
		this.setColorsBorderSelection();
	if (this._borders_colors.length === 0) {
		// generate any color
		color = '#';
		for (var i = 0; i < 3; i++) {
			var c = Math.round(Math.random()*254).toString(16).toLowerCase();
			if (c.length == 1) c = '0' + c;
			color += c;
		}
		this._default_borders_colors.push(color);
		return color;
	}

	var index = 0;
	color = this._borders_colors[index];
	this._borders_colors.splice(index, 1);
	return color;
};

dhtmlXGridObject.prototype.detachBorderSelection = function(id) {
	for (var i = 0; i < this._borders_store.length; i++)
		if (this._borders_store[i].id === id) {
			if (typeof(this._borders_store[i].obj) !== 'undefined')
				this._borders_store[i].obj.parentNode.removeChild(this._borders_store[i].obj);
			this._borders_store.splice(i, 1);
			this.showBorderSelection();
			return true;
		}
	return false;
};

dhtmlXGridObject.prototype.clearBorderSelection = function() {
	this.setColorsBorderSelection();
	if (typeof(this._borders_store) !== 'undefined')
		for (var i = 0; i < this._borders_store.length; i++)
			this._unsetBorderSelection(this._borders_store[i].obj);
	this._borders_store = [];
};

dhtmlXGridObject.prototype._unsetBorderSelection = function(obj) {
	if (typeof(obj) !== 'undefined') {
		if (typeof(obj.top) != 'undefined') obj.top.parentNode.removeChild(obj.top);
		if (typeof(obj.left) != 'undefined') obj.left.parentNode.removeChild(obj.left);
		if (typeof(obj.bottom) != 'undefined') obj.bottom.parentNode.removeChild(obj.bottom);
		if (typeof(obj.right) != 'undefined') obj.right.parentNode.removeChild(obj.right);
	}
};

dhtmlXGridObject.prototype.enableBorderSelection = function(mode) {
	if (mode !== false) mode = true;
	var self = this;
	if (mode) {
		if (!this._bs_enabled) {
			this._bs_enabled = true;
			this._objmousedown = this.obj.onmousedown;
			this._objmouseclick = this.obj.onclick;
			this.obj.onmousedown = function(e) {
				e = e || event;
				self.startBorderSelection(e);
			};
			this.obj.onclick = function(e) {};
		}
	} else {
		if (this._border_hover) {
			this._border_hover.parentNode.removeChild(this._border_hover);
			this._border_hover = null;
		}
		this._bs_enabled = false;
		if (this._objmousedown)
			this.obj.onmousedown = this._objmousedown;
		if (this._objmouseclick)
			this.obj.onclick = this._objmouseclick;
		if (this._mousemovecallback)
			this.obj.onmousemove = this._mousemovecallback;
	}
};


dhtmlXGridObject.prototype.startBorderSelection = function(e) {
	// disable editable cells closing
	e = e || event;
	var obj = (e.target || e.srcElement).parentNode;
	if (obj.className.indexOf('editable') !== -1) return true;

	var offset = this.getPosition(this.obj);
	var x = e.clientX - offset[0] + document.body.scrollLeft + this.obj.scrollLeft;
	var y = e.clientY - offset[1] + document.body.scrollTop + this.obj.scrollTop;
	var cell = this._getCellByPos(x, y);
	this._border_start = cell;
	this._border_end = cell;
	var pos = this.getPosition(cell);
	x = pos[0] - offset[0];
	y = pos[1] - offset[1];
	var width = cell.offsetWidth - 4;
	var height = cell.offsetHeight - 3;

	var result = this.callEvent("onBorderSelectionStart",[cell.parentNode.idd, cell._cellIndex]);
	if (result === false) return false;

	if (this._border_hover)
		this._border_hover.parentNode.removeChild(this._border_hover);
	this._border_hover = document.createElement('div');
	this._border_hover.className = 'border_selection';
	this._border_hover.style.borderColor = this.generateBorderColor();
	this._border_hover.style.width = '100px';
	this._border_hover.style.height = '100px';

	this._border_hover.style.left = x + 'px';
	this._border_hover.style.top = y + 'px';
	this._border_hover.style.width = width + 'px';
	this._border_hover.style.height = height + 'px';
	this.objBox.appendChild(this._border_hover);

	this._mousemovecallback = this.obj.onmousemove;
	this._bodymouseup = window.onmouseup;
	var self = this;
	this.obj.onmousemove = this._border_hover.onmousemove = function(e) {
		e = e || event;
		self.moveBorderSelection(e);
	};
	document.body.onmouseup = function(e) {
		e = e || event;
		self.endBorderSelection(e);
	};
	return true;
};

dhtmlXGridObject.prototype.moveBorderSelection = function(e) {
	var offset = this.getPosition(this.obj);
	var x = e.clientX - offset[0] + document.body.scrollLeft + this.obj.scrollLeft;
	var y = e.clientY - offset[1] + document.body.scrollTop + this.obj.scrollTop;

	var cell1 = this._border_start;
	var cell2 = this._getCellByPos(x, y);
	if (cell2)
		this._border_end = cell2;
	else
		cell2 = this._border_end;
	var cell1_pos = this.getPosition(cell1);
	var x1 = cell1_pos[0] - offset[0];
	var y1 = cell1_pos[1] - offset[1];
	var cell2_pos = this.getPosition(cell2);
	var x2 = cell2_pos[0] - offset[0];
	var y2 = cell2_pos[1] - offset[1];
	var result = this.callEvent("onBorderSelectionMove",[cell1.parentNode.idd, cell1._cellIndex, cell2.parentNode.idd, cell2._cellIndex]);
	if (result === false) return false;

	x = (x1 < x2) ? x1 : x2;
	var width = Math.abs(x2 - x1) + ((x1 < x2) ? cell2.offsetWidth : cell1.offsetWidth) - 2;

	y = (y1 < y2) ? y1 : y2;
	var height = Math.abs(y2 - y1) + ((y1 < y2) ? cell2.offsetHeight : cell1.offsetHeight) - 1;

	width -= 2;
	height -= 2;
	this._border_hover.style.left = x + 'px';
	this._border_hover.style.top = y + 'px';
	this._border_hover.style.width = width + 'px';
	this._border_hover.style.height = height + 'px';


	/* AUTO SCROLL */
	var BottomRightX = this.objBox.scrollLeft + this.objBox.clientWidth;
	var BottomRightY = this.objBox.scrollTop + this.objBox.clientHeight;
	var TopLeftX = this.objBox.scrollLeft;
	var TopLeftY = this.objBox.scrollTop;
	var X = e.clientX - offset[0];
	var Y = e.clientY - offset[1];

	var nextCall=false;
	if (this._brsTimer) window.clearTimeout(this._brsTimer);

	if (X+20 >= BottomRightX) {
		var scrollLeft = this.objBox.scrollLeft;
		this.objBox.scrollLeft = this.objBox.scrollLeft+20;
		if (scrollLeft !== this.objBox.scrollLeft)
			nextCall=true;
	} else if (X-20 < TopLeftX) {
		if (this.objBox.scrollLeft > 0) {
			this.objBox.scrollLeft = this.objBox.scrollLeft-20;
			nextCall=true;
		}
	}

	if (Y+20 >= BottomRightY) {
		var scrollTop = this.objBox.scrollTop;
		this.objBox.scrollTop = this.objBox.scrollTop+20;
		if (scrollTop !== this.objBox.scrollTop) {
			nextCall=true;
		}
	} else {
		if (Y-20 < TopLeftY) {
			if (this.objBox.scrollTop > 0) {
				this.objBox.scrollTop = this.objBox.scrollTop-20;
				nextCall=true;
			}
	}
	}
	if (nextCall){

		var a = e.clientX;
		var b = e.clientY;
		var self = this;
		this._blsTimer=window.setTimeout(function(){ self.moveBorderSelection({clientX:a,clientY:b}); },100);
	}
	return true;
};

dhtmlXGridObject.prototype.endBorderSelection = function(e) {
	this.obj.onmousemove = this._mousemovecallback;
	this._border_hover.onmousemove = null;
	this._border_hover.onmouseup = null;
	this._mousemovecallback = null;
	if (typeof(this._bodymouseup) !== 'undefined')
		document.body.onmouseup = this._bodymouseup;
	var cell1 = this._border_start;
	var cell2 = this._border_end;
	var rId1 = cell1.parentNode.idd;
	var cInd1 = cell1._cellIndex;
	var rId2 = cell2.parentNode.idd;
	var cInd2 = cell2._cellIndex;
	this.callEvent("onBorderSelected",[rId1, cInd1, rId2, cInd2]);
	if (this._border_hover) {
		this._border_hover.parentNode.removeChild(this._border_hover);
		this._border_hover = null;
	}
};

dhtmlXGridObject.prototype._getCellByPos = function(x,y){
	var _x=0;
	for (var i=0; i < this.obj.rows.length; i++) {
		y-=this.obj.rows[i].offsetHeight;
		if (y<=0) {
			_x=this.obj.rows[i];
			break;
		}
	}
	if (!_x || !_x.idd) return null;
	for (var i=0; i < this._cCount; i++) {
		x-=this.obj.rows[0].childNodes[i].offsetWidth;
		if (x<=0) {
			while(true){
				if (_x._childIndexes && _x._childIndexes[i+1]==_x._childIndexes[i])
					_x=_x.previousSibling;
				else
					return this.cells(_x.idd,i).cell;

			}
		}
	}
	return null;
};

dhtmlXGridObject.prototype.doesCellExist = function(rId, cInd) {
	if ((this.doesRowExist(rId)) && (cInd < this.getColumnsNum()))
		return true;
	else
		return false;
};