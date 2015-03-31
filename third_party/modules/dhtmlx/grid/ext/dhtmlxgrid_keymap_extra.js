//v.3.6 build 130416

/*
Copyright DHTMLX LTD. http://www.dhtmlx.com
To use this component please contact sales@dhtmlx.com to obtain license
*/
/*
	extra hotkeys
*/
dhtmlXGridObject.prototype._key_events={
			k45_0_0:function(){// INSERT - add new line at current position
				if (!this.editor) this.addRow((new Date()).valueOf(),[],this.row.rowIndex)
            },
			k46_0_0:function(){	//DEL - delete value of current cell on 
				if (!this.editor) this.cells4(this.cell).setValue("");
            }
		};