//v.3.6 build 130416

/*
Copyright DHTMLX LTD. http://www.dhtmlx.com
To use this component please contact sales@dhtmlx.com to obtain license
*/
   //next function switch grid between fast and normal operation modes
   //limitation - will not work for paging|smart_rendering|dynamic|split modes, most events will not be generated
   
/**
*   @desc: start fast operation mode, in such mode events are not generated, some time consuming actions applied only once, which allow to increase performance
*   @type: public
*   @topic: 0
*/   
   dhtmlXGridObject.prototype.startFastOperations   =    function(){
   		this._disF=["setSizes","callEvent","_fixAlterCss","cells4","forEachRow"];
   		this._disA=[];
   		for (var i = this._disF.length - 1; i >= 0; i--){
   			this._disA[i]=this[this._disF[i]]; this[this._disF[i]]=function(){return true};
   		};
   		
   		this._cellCache=[];
   		this.cells4=function(cell){
   			var c=this._cellCache[cell._cellIndex]
   			if (!c){
   				c=this._cellCache[cell._cellIndex]=this._disA[3].apply(this,[cell]);
	   			c.destructor=function(){return true;}
   				c.setCValue=function(val){c.cell.innerHTML=val;}
   			}
   			
   			c.cell=cell;
   			c.combo=cell._combo||this.combos[cell._cellIndex];
   			return c;
   		}
   		
   }
/**
*   @desc: turn off fast operation mode, need to be executed to normalize view.
*   @type: public
*   @topic: 0
*/      
   dhtmlXGridObject.prototype.stopFastOperations   =    function(){
   		if (!this._disF) return;
   		for (var i = this._disF.length - 1; i >= 0; i--){
   			this[this._disF[i]]=this._disA[i];
   		};
   		
   		this.setSizes();
   		this.callEvent("onGridReconstructed",[]);
   }
   
   //(c)dhtmlx ltd. www.dhtmlx.com