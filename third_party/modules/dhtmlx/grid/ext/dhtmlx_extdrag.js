//v.3.6 build 130416

/*
Copyright DHTMLX LTD. http://www.dhtmlx.com
To use this component please contact sales@dhtmlx.com to obtain license
*/
/**
*	visual extension for drag-n-drop support. 
*/

function dhx_ext_check(sid,tid,sgrid,tgrid){
	if (sgrid.mytype=="tree") var nm="id"; else var nm="idd";

	var sid=new Array();
	for(var i=0; i<sgrid._dragged.length; i++)
		sid[sid.length]=sgrid._dragged[i][nm];

	//sid - array of dragged ids
	//tid - target id

    if ((!this._onDrInFuncA)||(this._onDrInFuncA(sid,tid,sgrid,tgrid))) return dhx_allow_drag();
	return  dhx_deny_drop();
}

function  dhx_deny_drop(){
	window.dhtmlDragAndDrop.dragNode.firstChild.rows[0].cells[0].className="dragAccessD";
	return false;
}

function  dhx_allow_drag(){
	window.dhtmlDragAndDrop.dragNode.firstChild.rows[0].cells[0].className="dragAccessA";
	return true;
}

try{
	if (_isIE) document.execCommand("BackgroundImageCache", false, true);
	} catch(e){}

if (window.dhtmlXGridObject){
	dhtmlXGridObject.prototype.rowToDragElement=function(){ 
	   	var z=this._dragged.length;
		var out="";
		if (z==1) out=z+" "+(this._dratA||"message");
		else out=z+" "+(this._dratB||"messages");
		return "<table cellspacing='0' cellpadding='0'><tbody><tr><td class='dragAccessD'>&nbsp</td><td class='dragTextCell'>"+out+"</td></tbody><table>";
	}
	dhtmlXGridObject.prototype._init_point_bd=dhtmlXGridObject.prototype._init_point;
	dhtmlXGridObject.prototype._init_point=function(){
			this.attachEvent("onDragIn",dhx_ext_check);
			if (this._init_point_bd) this._init_point_bd();
	}
	/**
	*	@desc: define text (single and plural forms) for extended visual appearence of drag-n-drop
	*	@param: single - single form (like "product")
	*	@param: plural - plural form (if omitted, then "s" will be added to single form)
	*	@type: public
	*/
	dhtmlXGridObject.prototype.setDragText=function(single,plural){
		this._dratA=single;
		if (!plural) this._dratB=single+"s";
		else this._dratB=plural;
	}
}


if (window.dhtmlXTreeObject){
	dhtmlXTreeObject.prototype._createDragNode=function(htmlObject,e){
      if (!this.dADTempOff) return null;
      var obj=htmlObject.parentObject;
      if (!this.callEvent("onBeforeDrag",[obj.id])) return null;
	  if (!obj.i_sel)
         this._selectItem(obj,e);

	  this._checkMSelectionLogic();
      var dragSpan=document.createElement('div');

	   	var z=this._selected.length;
		var out="";
		if (z==1) out=z+" "+(this._dratA||"message");
		else out=z+" "+(this._dratB||"messages");
  	    dragSpan.innerHTML="<table cellspacing='0' cellpadding='0'><tbody><tr><td class='dragAccessD'>&nbsp</td><td class='dragTextCell'>"+out+"</td></tbody><table>";

      dragSpan.style.position="absolute";
      dragSpan.className="dragSpanDiv";
      this._dragged=(new Array()).concat(this._selected);
      return dragSpan;
	}

	dhtmlXTreeObject.prototype.setDragText=function(a,b){
		this._dratA=a;
		if (!b) this._dratB=a+"s";
		else this._dratB=b;
	}
	dhtmlXTreeObject.prototype._onDrInFunc=dhx_ext_check;
	dhtmlXTreeObject.prototype.setOnDragIn=function(func){
		if (typeof(func)=="function") this._onDrInFuncA=func; else this._onDrInFuncA=eval(func);
	}
}

dhtmlDragAndDropObject.prototype._onNotFound=function(){
    dhx_deny_drop();
}




