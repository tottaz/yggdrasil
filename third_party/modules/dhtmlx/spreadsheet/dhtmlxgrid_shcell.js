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
 if (typeof(SpreadSheetMathHint) === 'undefined')
	var SpreadSheetMathHint;

function eXcell_edsh(cell){
	if (cell){
		this.cell=cell;
		this.grid=this.cell.parentNode.grid;
	}
	this.dont_take_care = false;
	this.edit=function(){
		this.cell.atag=((!this.grid.multiLine)&&(_isKHTML||_isMacOS||_isFF)) ? "INPUT" : "TEXTAREA";
		this.val=this.getRealValue();
		this.obj=document.createElement(this.cell.atag);
		this.obj.setAttribute("autocomplete", "off");
		this.obj.style.height=(this.cell.offsetHeight-(_isIE ? 8 : 4))+"px";
		this.obj.className="dhx_combo_edit";
		this.obj.wrap="soft";
		this.obj.style.textAlign=this.cell.style.textAlign;

		this.obj.onclick=function(e){
			(e||event).cancelBubble=true;
		};
		this.obj.onmousedown=function(e){
			(e||event).cancelBubble=true;
		};
		this.obj.onmouseup=function(e){
			(e||event).cancelBubble=true;
		};

		this.obj.value=this.val;
		this.cell.innerHTML="";
		this.cell.appendChild(this.obj);
		if (this.grid.ssheet.settings.math) {
			SpreadSheetMathHint.attachEvent(this.obj, this.grid.ssheet);
			SpreadSheetMathHint.showBorders(this.obj);
			SpreadsheetBuffer.callback = this.grid.ssheet;
			if (this.val.substring(0, 1) === '=')
				this.grid.enableBorderSelection();
		}

		if (_isFF && !window._KHTMLrv){
			this.obj.style.overflow="visible";

			if ((this.grid.multiLine)&&(this.obj.offsetHeight >= 18)&&(this.obj.offsetHeight < 40)){
				this.obj.style.height="36px";
				this.obj.style.overflow="scroll";
			}
		}
		this.obj.onselectstart=function(e){
			if (!e)
				e=event;
			e.cancelBubble=true;
			return true;
		};
	    this.obj.focus();
		if (this.grid.ssheet.settings.math)
			SpreadSheetMathHint.setCursorPos(this.obj, this.obj.value.length);
	};

	this.getRealValue = function() {
		return this.cell.getAttribute('real_value');
	};

	this.getFormattedValue = function() {
		return this.cell.getAttribute('formatted_value');
	};

	this.detach=function(mode){
		if (mode === false) {
			this.dont_take_care = true;
			this.obj.value = this.getFormattedValue();
			this.setCValue(this.getFormattedValue(), this.getRealValue());
			return true;
		}
		this.grid.enableBorderSelection(false);
		SpreadSheetMathHint.hide();
		this.obj.value = SpreadSheetMathHint.function_ending(this.obj.value);
		if (this.obj.value === this.getRealValue()) {
			this.obj.value = this.getFormattedValue();
			this.dont_take_care = true;
			this.setCValue(this.obj.value, this.getRealValue());
		} else {
			this.setCValue(this.obj.value, this.obj.value);
		}
		return this.obj.val != this.getRealValue();
	};

	this.getRealChanged = function(change) {
		if (this.dont_take_care === true) {
			if (change)
				this.dont_take_care = false;
			return false;
		}
		return true;
	};

	this.setCValue=function(val, val2){
		this.cell._clearCell=true;
		this.cell.innerHTML='&nbsp;';
		this.cell.appendChild(document.createTextNode(val));
		this.cell.setAttribute('real_value', (val2 || val));
		this.cell.setAttribute('formatted_value', val);

		if (( typeof(val) !== "number")&&(!val||val.toString()._dhx_trim() === "")){
			val="&nbsp;";
			this.cell._clearCell=true;
		} else
			this.cell._clearCell=false;

		this.grid.callEvent("onCellChanged", [
			this.cell.parentNode.idd,
			this.cell._cellIndex,
			(arguments.length > 1 ? val2 : val)
		]);
	};

	this.setValue=function(val){
		if (this.dont_take_care === true) return false;
		this.setCValue(val, this.getRealValue());
	};
}
eXcell_edsh.prototype=new eXcell_edtxt;
eXcell_rotxt.prototype.getRealValue = eXcell_rotxt.prototype.getValue;