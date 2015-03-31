//v.3.6 build 130416

/*
Copyright DHTMLX LTD. http://www.dhtmlx.com
To use this component please contact sales@dhtmlx.com to obtain license
*/
dhtmlXGridObject.prototype.mouseOverHeader=function(func){
		var self=this;
		dhtmlxEvent(this.hdr,"mousemove",function(e){
				e=e||window.event;
				var el=e.target||e.srcElement;
            	if(el.tagName!="TD")
                	el = self.getFirstParentOfType(el,"TD")				
                if (el && (typeof(el._cellIndex)!="undefined"))
					func(el.parentNode.rowIndex,el._cellIndex);
		});
}
dhtmlXGridObject.prototype.mouseOver=function(func){
		var self=this;	
		dhtmlxEvent(this.obj,"mousemove",function(e){
				e=e||window.event;
				var el=e.target||e.srcElement;
            	if(el.tagName!="TD")
                	el = self.getFirstParentOfType(el,"TD")				
                if (el && (typeof(el._cellIndex)!="undefined"))
					func(el.parentNode.rowIndex,el._cellIndex);
		});
}
//(c)dhtmlx ltd. www.dhtmlx.com