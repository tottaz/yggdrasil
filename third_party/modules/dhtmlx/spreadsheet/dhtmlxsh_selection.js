/*
 (c) DHTMLX Ltd, 2011
 Licensing: You allowed to use this component for free under GPL or you need to obtain Commercial/Enterprise license to use it in non-GPL project
 Contact: sales@dhtmlx.com
 */
 dhtmlXGridObject.prototype._OnSelectionStart = function(event, obj)
{

	var self = this;
	if (this._blockselection_process) this._OnSelectionStop(event, this);
	if (event.button == 2) return;
	var src = event.srcElement || event.target;
	if (this.editor){
		if (src.tagName && (src.tagName=="INPUT" || src.tagName=="TEXTAREA"))   return;
		this.editStop();
	}
	
	if (!self.isActive) self.setActive(true);
	var pos = this.getPosition(this.obj);
	var x = event.clientX - pos[0] +document.body.scrollLeft;
	var y = event.clientY - pos[1] +document.body.scrollTop;
	this._CreateSelection(x-4, y-4);

	if (src == this._selectionObj) {
		this._HideSelection();
		this._startSelectionCell = null;
	} else {
	    while (src.tagName.toLowerCase() != 'td') {
	        src = src.parentNode;
			if (typeof(src.tagName) === 'undefined') return null;
		}
	    this._startSelectionCell = src;
	}
	if (this._startSelectionCell && this._startSelectionCell._cellIndex > 0)
		this.selectCell(this._startSelectionCell.parentNode, this._startSelectionCell._cellIndex, true, false, false, false);
	if (this._startSelectionCell){
		if (!this.callEvent("onBeforeBlockSelected",[this._startSelectionCell.parentNode.idd, this._startSelectionCell._cellIndex]))
			return this._startSelectionCell = null;
	}

	this.obj.onmousedown = null;
	this.obj[_isIE?"onmouseleave":"onmouseout"] = function(e){ if (self._blsTimer) window.clearTimeout(self._blsTimer); };	    
	this.obj.onmmold=this.obj.onmousemove;
	this.obj.onmuold=this.obj.onmouseup;
	this._init_pos=[x,y];
	this._selectionObj.onmousemove = this.obj.onmousemove = function(e) {e = e||event; e.returnValue = false;  self._OnSelectionMove(e);}

	this._oldDMP=document.body.onmouseup;
	this._blockselection_process = true;
	document.body.onmouseup = this._selectionObj.onmouseup = this.obj.onmouseup = function(e) {
		e = e||event; self._OnSelectionStop(e, this); return true; };
	this.callEvent("onBeforeBlockSelection",[]);
	document.body.onselectstart = function(){return false};//avoid text select	    
};


dhtmlXGridObject.prototype._OnSelectionMove = function(event) {
	var self=this;
	this._ShowSelection();
	var pos = this.getPosition(this.obj);
	var X = event.clientX - pos[0] + (document.body.scrollLeft||(document.documentElement?document.documentElement.scrollLeft:0));
	var Y = event.clientY - pos[1] + (document.body.scrollTop||(document.documentElement?document.documentElement.scrollTop:0));

	if ((Math.abs(this._init_pos[0]-X)<3) && (Math.abs(this._init_pos[1]-Y)<3)) return this._HideSelection();
	
	var temp = this._endSelectionCell;
	if(this._startSelectionCell==null)
 		this._endSelectionCell  = this._startSelectionCell = this.getFirstParentOfType(event.srcElement || event.target,"TD");		
	else {
		if (event.srcElement || event.target) {
			if ((event.srcElement || event.target).className == "dhtmlxGrid_selection")
				this._endSelectionCell=(this._getCellByPos(X,Y)||this._endSelectionCell);
			else {
				var t = this.getFirstParentOfType(event.srcElement || event.target,"TD");
				if (t.parentNode.idd) this._endSelectionCell = t;
			}
		}
	}
	this.selectCell(this._startSelectionCell.parentNode, this._startSelectionCell._cellIndex, true, false, false, false);
		
	if (this._endSelectionCell){
		if (!this.callEvent("onBeforeBlockSelected",[this._endSelectionCell.parentNode.idd, this._endSelectionCell._cellIndex]))
			this._endSelectionCell = temp;
	}

	/* AUTO SCROLL */
	var BottomRightX = this.objBox.scrollLeft + this.objBox.clientWidth;
	var BottomRightY = this.objBox.scrollTop + this.objBox.clientHeight;
	var TopLeftX = this.objBox.scrollLeft;
	var TopLeftY = this.objBox.scrollTop;

	var nextCall=false;
	if (this._blsTimer) window.clearTimeout(this._blsTimer);	
	
	if (X+20 >= BottomRightX) {
		this.objBox.scrollLeft = this.objBox.scrollLeft+20;
		nextCall=true;
	} else if (X-20 < TopLeftX) {
		this.objBox.scrollLeft = this.objBox.scrollLeft-20;
		nextCall=true;
	}
	if (Y+20 >= BottomRightY && !this._realfake) {
		this.objBox.scrollTop = this.objBox.scrollTop+20;
		nextCall=true;
	} else if (Y-20 < TopLeftY && !this._realfake) {
		this.objBox.scrollTop = this.objBox.scrollTop-20;
		nextCall=true;		
	}
	this._selectionArea = this._RedrawSelectionPos(this._startSelectionCell, this._endSelectionCell);
	

	if (nextCall){ 
		var a=event.clientX;
		var b=event.clientY;
		this._blsTimer=window.setTimeout(function(){self._OnSelectionMove({clientX:a,clientY:b})},100);
	}
	return true;
}


dhtmlXGridObject.prototype._OnSelectionStop = function(event)
{
	var self = this;
	if (this._blsTimer) window.clearTimeout(this._blsTimer);	
	this.obj.onmousedown = function(e) {if (self._bs_mode)  self._OnSelectionStart((e||event), this); return true;}
	this.obj.onmousemove = this.obj.onmmold||null;
	this.obj.onmouseup = this.obj.onmuold||null;
	this._selectionObj.onmousemove = null;
	this._selectionObj.onmouseup = null;
	document.body.onmouseup = this._oldDMP||null;
	this._blockselection_process = false;
	if ( parseInt( this._selectionObj.style.width ) < 2 && parseInt( this._selectionObj.style.height ) < 2) {
		this._HideSelection();
	} else {
	    var src = this.getFirstParentOfType(event.srcElement || event.target,"TD");
	    if ((!src) || (!src.parentNode.idd)){
	    	src=this._endSelectionCell;
    		}
    	if (!src) return this._HideSelection();
	    while (src.tagName.toLowerCase() != 'td')
	        src = src.parentNode;
	    this._stopSelectionCell = src;
	    this._selectionArea = this._RedrawSelectionPos(this._startSelectionCell, this._stopSelectionCell);
		this.callEvent("onBlockSelected",[]);
	}
	document.body.onselectstart = function(){};//avoid text select
}

dhtmlXGridObject.prototype._RedrawSelectionPos = function(LeftTop, RightBottom)
{

	var pos = {};
	pos.LeftTopCol = LeftTop._cellIndex;
	pos.LeftTopRow = this.getRowIndex( LeftTop.parentNode.idd );
	pos.RightBottomCol = RightBottom._cellIndex;
	pos.RightBottomRow = this.getRowIndex( RightBottom.parentNode.idd );

	var LeftTop_width = LeftTop.offsetWidth;
	var LeftTop_height = LeftTop.offsetHeight;
	LeftTop = this.getPosition(LeftTop, this.obj);

	var RightBottom_width = RightBottom.offsetWidth;
	var RightBottom_height = RightBottom.offsetHeight;
	RightBottom = this.getPosition(RightBottom, this.obj);

	var Left, Right, Top, Bottom, foo;
    if (LeftTop[0] < RightBottom[0]) {
		Left = LeftTop[0];
		Right = RightBottom[0] + RightBottom_width;
    } else {
    	foo = pos.RightBottomCol;
        pos.RightBottomCol = pos.LeftTopCol;
        pos.LeftTopCol = foo;
		Left = RightBottom[0];
		Right = LeftTop[0] + LeftTop_width;
    }

    if (LeftTop[1] < RightBottom[1]) {
		Top = LeftTop[1];
		Bottom = RightBottom[1] + RightBottom_height;
    } else {
    	foo = pos.RightBottomRow;
        pos.RightBottomRow = pos.LeftTopRow;
        pos.LeftTopRow = foo;
		Top = RightBottom[1];
		Bottom = LeftTop[1] + LeftTop_height;
    }

    var Width = Right - Left - 2;
    var Height = Bottom - Top - 2;

	if (!this._selectionObj)
		this._CreateSelection(Left, Top);

	this._selectionObj.style.left = Left + 'px';
	this._selectionObj.style.top = Top + 'px';
	this._selectionObj.style.width =  Width  + 'px';
	this._selectionObj.style.height = Height + 'px';
	return pos;
}



dhtmlXGridObject.prototype._CreateSelection_original = dhtmlXGridObject.prototype._CreateSelection;
dhtmlXGridObject.prototype._CreateSelection = function(x, y) {
	var result = this._CreateSelection_original(x, y);
	var self = this;
	this._selectionObj.onmousedown = function(e) {
		if (self._bs_mode) self._OnSelectionStart((e||window.event),this); return true;
	};
	return result;
};


dhtmlXGridObject.prototype._refreshBlockSelection = function(dont_show) {
	var area = this._selectionArea;
	if (!area) return;
	var c1 = this.cells(this.getRowId(area.LeftTopRow), area.LeftTopCol).cell;
	var c2 = this.cells(this.getRowId(area.RightBottomRow), area.RightBottomCol).cell;
	this.selectCell(area.LeftTopRow, area.LeftTopCol);
	this._RedrawSelectionPos(c1, c2);
	this._ShowSelection();
	if (!dont_show) this.moveToVisible(c2);
};

dhtmlXGridObject.prototype._clearBlockSelection = function() {
	this._HideSelection();
};

dhtmlXGridObject.prototype._selectionLeft = function(step) {
	var area = this.getSelectedBlock();
	area.RightBottomCol = (area.RightBottomCol + step < this.getColumnsNum()) ? (area.RightBottomCol + step) : (this.getColumnsNum() - 1);
	area.LeftTopRow = this.getRowIndex(area.LeftTopRow);
	area.RightBottomRow = this.getRowIndex(area.RightBottomRow);
	this._selectionArea = area;
	this._refreshBlockSelection();
};

dhtmlXGridObject.prototype._selectionRight = function(step) {
	var area = this.getSelectedBlock();
	area.RightBottomCol = (area.RightBottomCol - step > 0) ? (area.RightBottomCol - step) : 1;
	area.LeftTopRow = this.getRowIndex(area.LeftTopRow);
	area.RightBottomRow = this.getRowIndex(area.RightBottomRow);
	this._selectionArea = area;
	this._refreshBlockSelection();
};

dhtmlXGridObject.prototype._selectionUp = function(step) {
	var area = this.getSelectedBlock();
	var row = this.getRowIndex(area.RightBottomRow);
	row = (row - step >= 0) ? (row - step) : 0;
	area.RightBottomRow = row;
	area.LeftTopRow = this.getRowIndex(area.LeftTopRow);
	this._selectionArea = area;
	this._refreshBlockSelection();
};

dhtmlXGridObject.prototype._selectionDown = function(step) {
	var area = this.getSelectedBlock();
	var row = this.getRowIndex(area.RightBottomRow);
	row = (row + step < this.getRowsNum()) ? (row + step) : (this.getRowsNum() - 1);
	area.RightBottomRow = row;
	area.LeftTopRow = this.getRowIndex(area.LeftTopRow);
	this._selectionArea = area;
	this._refreshBlockSelection();
};

dhtmlXGridObject.prototype._selectAll = function() {
	var area = {
		LeftTopRow: 0,
		LeftTopCol: 1,
		RightBottomRow: this.getRowsNum() - 1,
		RightBottomCol: this.getColumnsNum() - 1
	};
	this._selectionArea = area;
	this._refreshBlockSelection(true);
};


dhtmlXGridObject.prototype.setBlockSelection = function(sel) {
	sel.LeftTopRow = this.getRowIndex(sel.LeftTopRow);
	sel.RightBottomRow = this.getRowIndex(sel.RightBottomRow);
	this.selectCell(sel.LeftTopRow, sel.LeftTopCol);
	this._selectionArea = sel;
	this._refreshBlockSelection();
};


dhtmlXGridObject.prototype.getSelectedBlock = function() {
	// if block selection exists
	if (this._selectionArea) {
		return {
			LeftTopRow: this.getRowId(this._selectionArea.LeftTopRow),
			LeftTopCol: this._selectionArea.LeftTopCol,
			RightBottomRow: this.getRowId(this._selectionArea.RightBottomRow),
			RightBottomCol: this._selectionArea.RightBottomCol
		};
		return this._selectionArea;
	} else if (this.getSelectedRowId() !== null){
		// if one cell is selected
			return {
				LeftTopRow: this.getSelectedRowId(),
				LeftTopCol: this.getSelectedCellIndex(),
				RightBottomRow: this.getSelectedRowId(),
				RightBottomCol: this.getSelectedCellIndex()
			};
		} else
			return null;
};


dhtmlxSpreadSheet.prototype.doClick=function(el, fl, selMethod, show){
	if (!this.selMultiRows) selMethod=0; //block programmatical multiselecton if mode not enabled explitly
	var psid = this.row ? this.row.idd : 0;

	this.setActive(true);

	if (!selMethod)
		selMethod=0;

	if (this.cell != null)
		this.cell.className=this.cell.className.replace(/cellselected/g, "");

	if (el.tagName == "TD"){
		if (this.checkEvent("onSelectStateChanged"))
			var initial = this.getSelectedId();
		var prow = this.row;
	if (selMethod == 1){
			var elRowIndex = this.rowsCol._dhx_find(el.parentNode)
			var lcRowIndex = this.rowsCol._dhx_find(this.lastClicked)

			if (elRowIndex > lcRowIndex){
				var strt = lcRowIndex;
				var end = elRowIndex;
			} else {
				var strt = elRowIndex;
				var end = lcRowIndex;
			}

			for (var i = 0; i < this.rowsCol.length; i++)
				if ((i >= strt&&i <= end)){
					if (this.rowsCol[i]&&(!this.rowsCol[i]._sRow)){
						if (this.rowsCol[i].className.indexOf("rowselected")
							== -1&&this.callEvent("onBeforeSelect", [
							this.rowsCol[i].idd,
							psid
						])){
							this.rowsCol[i].className+=" rowselected";
							this.selectedRows[this.selectedRows.length]=this.rowsCol[i]
						}
					} else {
						this.clearSelection();
						return this.doClick(el, fl, 0, show);
					}
				}
		} else if (selMethod == 2){
			if (el.parentNode.className.indexOf("rowselected") != -1){
				el.parentNode.className=el.parentNode.className.replace(/rowselected/g, "");
				this.selectedRows._dhx_removeAt(this.selectedRows._dhx_find(el.parentNode))
				var skipRowSelection = true;
				show = false;
			}
		}
		this.editStop()
		if (typeof (el.parentNode.idd) == "undefined")
			return true;
		if ((!skipRowSelection)&&(!el.parentNode._sRow)){
			if (this.callEvent("onBeforeSelect", [
				el.parentNode.idd, el._cellIndex,
				psid
			])){
				if (this.getSelectedRowId() != el.parentNode.idd){
					if (selMethod == 0)
						this.clearSelection();
					this.cell=el;
					if ((prow == el.parentNode)&&(this._chRRS))
						fl=false;
					this.row=el.parentNode;
					this.row.className+=" rowselected"

					if (this.cell && _isIE && _isIE == 8 ){
						//fix incorrect table cell size in IE8 bug
						var next = this.cell.nextSibling;
						var parent = this.cell.parentNode;
						parent.removeChild(this.cell)
						parent.insertBefore(this.cell,next);
					}

					if (this.selectedRows._dhx_find(this.row) == -1)
						this.selectedRows[this.selectedRows.length]=this.row;
				} else {
					this.cell=el;
					this.row = el.parentNode;
				}
			} else fl = false;
		} 

		if (this.cell && this.cell.parentNode.className.indexOf("rowselected") != -1)
			this.cell.className=this.cell.className.replace(/cellselected/g, "")+" cellselected";

		if (selMethod != 1)
			if (!this.row)
				return;
		this.lastClicked=el.parentNode;

		var rid = this.row.idd;
		var cid = this.cell;

		if (fl&& typeof (rid) != "undefined" && cid && !skipRowSelection) {
			var self = this;
			self.onRowSelectTime=setTimeout(function(){
				if (self.callEvent)
					self.callEvent("onRowSelect", [
						rid,
						cid._cellIndex
					]);
			}, 100);
		} else this.callEvent("onRowSelectRSOnly",[rid]);

		if (this.checkEvent("onSelectStateChanged")){
			var afinal = this.getSelectedId();

			if (initial != afinal)
				this.callEvent("onSelectStateChanged", [afinal,initial]);
		}
	}
	this.isActive=true;
	if (show !== false && this.cell && this.cell.parentNode.idd)
		this.moveToVisible(this.cell)
};


dhtmlXGridObject.prototype.editStop=function(mode){
	if (_isOpera)
		if (this._Opera_stop){
			if ((this._Opera_stop*1+50) > (new Date).valueOf())
				return;

			this._Opera_stop=null;
		}

	if (this.editor&&this.editor !== null){
		this.editor.cell.className=this.editor.cell.className.replace("editable", "");

		if (mode){
			var t = this.editor.val;
			this.editor.detach(false);
			this.editor.setValue(t);
			this.editor=null;

			this.callEvent("onEditCancel", [
				this.row.idd,
				this.cell._cellIndex,
				t
			]);
			return;
		}

		if (this.editor.detach())
			this.cell.wasChanged=true;

		var g = this.editor;
		this.editor=null;
		var z = this.callEvent("onEditCell", [
			2,
			this.row.idd,
			this.cell._cellIndex,
			g.getValue(),
			g.val
		]);

		if (( typeof (z) == "string")||( typeof (z) == "number"))
			g[g.setImage ? "setLabel" : "setValue"](z);

		else if (!z)
			g[g.setImage ? "setLabel" : "setValue"](g.val);

		if (this._ahgr && this.multiLine) this.setSizes();
	}
};