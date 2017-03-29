/*
 (c) DHTMLX Ltd, 2011
 Licensing: You allowed to use this component for free under GPL or you need to obtain Commercial/Enterprise license to use it in non-GPL project
 Contact: sales@dhtmlx.com
 */
 dhtmlx=function(obj){
	for (var a in obj) dhtmlx[a]=obj[a];
	return dhtmlx; //simple singleton
};
dhtmlx.extend_api=function(name,map,ext){
	var t = window[name];
	if (!t) return; //component not defined
	window[name]=function(obj){
		if (obj && typeof obj == "object" && !obj.tagName){
			var that = t.apply(this,(map._init?map._init(obj):arguments));
			//global settings
			for (var a in dhtmlx)
				if (map[a]) this[map[a]](dhtmlx[a]);			
			//local settings
			for (var a in obj){
				if (map[a]) this[map[a]](obj[a]);
				else if (a.indexOf("on")==0){
					this.attachEvent(a,obj[a]);
				}
			}
		} else
			var that = t.apply(this,arguments);
		if (map._patch) map._patch(this);
		return that||this;
	};
	window[name].prototype=t.prototype;
	if (ext)
		dhtmlXHeir(window[name].prototype,ext);
};

dhtmlxAjax={
	get:function(url,callback){
		var t=new dtmlXMLLoaderObject(true);
		t.async=(arguments.length<3);
		t.waitCall=callback;
		t.loadXML(url)
		return t;
	},
	post:function(url,post,callback){
		var t=new dtmlXMLLoaderObject(true);
		t.async=(arguments.length<4);
		t.waitCall=callback;
		t.loadXML(url,true,post)
		return t;
	},
	getSync:function(url){
		return this.get(url,null,true)
	},
	postSync:function(url,post){
		return this.post(url,post,null,true);		
	}
}

/**
  *     @desc: xmlLoader object
  *     @type: private
  *     @param: funcObject - xml parser function
  *     @param: object - jsControl object
  *     @param: async - sync/async mode (async by default)
  *     @param: rSeed - enable/disable random seed ( prevent IE caching)
  *     @topic: 0
  */
function dtmlXMLLoaderObject(funcObject, dhtmlObject, async, rSeed){
	this.xmlDoc="";

	if (typeof (async) != "undefined")
		this.async=async;
	else
		this.async=true;

	this.onloadAction=funcObject||null;
	this.mainObject=dhtmlObject||null;
	this.waitCall=null;
	this.rSeed=rSeed||false;
	return this;
};

dtmlXMLLoaderObject.count = 0;

/**
  *     @desc: xml loading handler
  *     @type: private
  *     @param: dtmlObject - xmlLoader object
  *     @topic: 0
  */
dtmlXMLLoaderObject.prototype.waitLoadFunction=function(dhtmlObject){
	var once = true;
	this.check=function (){
		if ((dhtmlObject)&&(dhtmlObject.onloadAction != null)){
			if ((!dhtmlObject.xmlDoc.readyState)||(dhtmlObject.xmlDoc.readyState == 4)){
				if (!once)
					return;

				once=false; //IE 5 fix
				dtmlXMLLoaderObject.count++;
				if (typeof dhtmlObject.onloadAction == "function")
					dhtmlObject.onloadAction(dhtmlObject.mainObject, null, null, null, dhtmlObject);

				if (dhtmlObject.waitCall){
					dhtmlObject.waitCall.call(this,dhtmlObject);
					dhtmlObject.waitCall=null;
				}
			}
		}
	};
	return this.check;
};

/**
  *     @desc: return XML top node
  *     @param: tagName - top XML node tag name (not used in IE, required for Safari and Mozilla)
  *     @type: private
  *     @returns: top XML node
  *     @topic: 0  
  */
dtmlXMLLoaderObject.prototype.getXMLTopNode=function(tagName, oldObj){
	if (this.xmlDoc.responseXML){
		var temp = this.xmlDoc.responseXML.getElementsByTagName(tagName);
		if(temp.length==0 && tagName.indexOf(":")!=-1)
			var temp = this.xmlDoc.responseXML.getElementsByTagName((tagName.split(":"))[1]);
		var z = temp[0];
	} else
		var z = this.xmlDoc.documentElement;

	if (z){
		this._retry=false;
		return z;
	}

	if ((_isIE)&&(!this._retry)){
		//fall back to MS.XMLDOM
		var xmlString = this.xmlDoc.responseText;
		var oldObj = this.xmlDoc;
		this._retry=true;
		this.xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		this.xmlDoc.async=false;
		this.xmlDoc["loadXM"+"L"](xmlString);

		return this.getXMLTopNode(tagName, oldObj);
	}
	dhtmlxError.throwError("LoadXML", "Incorrect XML", [
		(oldObj||this.xmlDoc),
		this.mainObject
	]);

	return document.createElement("DIV");
};

/**
  *     @desc: load XML from string
  *     @type: private
  *     @param: xmlString - xml string
  *     @topic: 0  
  */
dtmlXMLLoaderObject.prototype.loadXMLString=function(xmlString){
	{
		if (!_isIE){
			var parser = new DOMParser();
			this.xmlDoc=parser.parseFromString(xmlString, "text/xml");
		} else {
			this.xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
			this.xmlDoc.async=this.async;
			this.xmlDoc.onreadystatechange = function(){};
			this.xmlDoc["loadXM"+"L"](xmlString);
		}
	}

	if (this.onloadAction)
		this.onloadAction(this.mainObject, null, null, null, this);

	if (this.waitCall){
		this.waitCall();
		this.waitCall=null;
	}
}
/**
  *     @desc: load XML
  *     @type: private
  *     @param: filePath - xml file path
  *     @param: postMode - send POST request
  *     @param: postVars - list of vars for post request
  *     @topic: 0
  */
dtmlXMLLoaderObject.prototype.loadXML=function(filePath, postMode, postVars, rpc){
	if (this.rSeed)
		filePath+=((filePath.indexOf("?") != -1) ? "&" : "?")+"a_dhx_rSeed="+(new Date()).valueOf();
	this.filePath=filePath;

	if ((!_isIE)&&(window.XMLHttpRequest))
		this.xmlDoc=new XMLHttpRequest();
	else {
		this.xmlDoc=new ActiveXObject("Microsoft.XMLHTTP");
	}

	if (this.async)
		this.xmlDoc.onreadystatechange=new this.waitLoadFunction(this);
	this.xmlDoc.open(postMode ? "POST" : "GET", filePath, this.async);

	if (rpc){
		this.xmlDoc.setRequestHeader("User-Agent", "dhtmlxRPC v0.1 ("+navigator.userAgent+")");
		this.xmlDoc.setRequestHeader("Content-type", "text/xml");
	}

	else if (postMode)
		this.xmlDoc.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		
	this.xmlDoc.setRequestHeader("X-Requested-With","XMLHttpRequest");
	this.xmlDoc.send(null||postVars);

	if (!this.async)
		(new this.waitLoadFunction(this))();
};
/**
  *     @desc: destructor, cleans used memory
  *     @type: private
  *     @topic: 0
  */
dtmlXMLLoaderObject.prototype.destructor=function(){
	this._filterXPath = null;
	this._getAllNamedChilds = null;
	this._retry = null;
	this.async = null;
	this.rSeed = null;
	this.filePath = null;
	this.onloadAction = null;
	this.mainObject = null;
	this.xmlDoc = null;
	this.doXPath = null;
	this.doXPathOpera = null;
	this.doXSLTransToObject = null;
	this.doXSLTransToString = null;
	this.loadXML = null;
	this.loadXMLString = null;
	// this.waitLoadFunction = null;
	this.doSerialization = null;
	this.xmlNodeToJSON = null;
	this.getXMLTopNode = null;
	this.setXSLParamValue = null;
	return null;
}

dtmlXMLLoaderObject.prototype.xmlNodeToJSON = function(node){
        var t={};
        for (var i=0; i<node.attributes.length; i++)
            t[node.attributes[i].name]=node.attributes[i].value;
        t["_tagvalue"]=node.firstChild?node.firstChild.nodeValue:"";
        for (var i=0; i<node.childNodes.length; i++){
            var name=node.childNodes[i].tagName;
            if (name){
                if (!t[name]) t[name]=[];
                t[name].push(this.xmlNodeToJSON(node.childNodes[i]));
            }            
        }        
        return t;
    }

/**  
  *     @desc: Call wrapper
  *     @type: private
  *     @param: funcObject - action handler
  *     @param: dhtmlObject - user data
  *     @returns: function handler
  *     @topic: 0  
  */
function callerFunction(funcObject, dhtmlObject){
	this.handler=function(e){
		if (!e)
			e=window.event;
		funcObject(e, dhtmlObject);
		return true;
	};
	return this.handler;
};

/**  
  *     @desc: Calculate absolute position of html object
  *     @type: private
  *     @param: htmlObject - html object
  *     @topic: 0  
  */
function getAbsoluteLeft(htmlObject){
	return getOffset(htmlObject).left;
}
/**
  *     @desc: Calculate absolute position of html object
  *     @type: private
  *     @param: htmlObject - html object
  *     @topic: 0  
  */
function getAbsoluteTop(htmlObject){
	return getOffset(htmlObject).top;
}

function getOffsetSum(elem) {
	var top=0, left=0;
	while(elem) {
		top = top + parseInt(elem.offsetTop);
		left = left + parseInt(elem.offsetLeft);
		elem = elem.offsetParent;
	}
	return {top: top, left: left};
}
function getOffsetRect(elem) {
	var box = elem.getBoundingClientRect();
	var body = document.body;
	var docElem = document.documentElement;
	var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
	var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
	var clientTop = docElem.clientTop || body.clientTop || 0;
	var clientLeft = docElem.clientLeft || body.clientLeft || 0;
	var top  = box.top +  scrollTop - clientTop;
	var left = box.left + scrollLeft - clientLeft;
	return { top: Math.round(top), left: Math.round(left) };
}
function getOffset(elem) {
	if (elem.getBoundingClientRect) {
		return getOffsetRect(elem);
	} else {
		return getOffsetSum(elem);
	}
}

/**  
*     @desc: Convert string to it boolean representation
*     @type: private
*     @param: inputString - string for covertion
*     @topic: 0
*/
function convertStringToBoolean(inputString){
	if (typeof (inputString) == "string")
		inputString=inputString.toLowerCase();

	switch (inputString){
		case "1":
		case "true":
		case "yes":
		case "y":
		case 1:
		case true:
			return true;
			break;

		default: return false;
	}
}

/**  
*     @desc: find out what symbol to use as url param delimiters in further params
*     @type: private
*     @param: str - current url string
*     @topic: 0  
*/
function getUrlSymbol(str){
	if (str.indexOf("?") != -1)
		return "&"
	else
		return "?"
}

function dhtmlDragAndDropObject(){
	if (window.dhtmlDragAndDrop)
		return window.dhtmlDragAndDrop;

	this.lastLanding=0;
	this.dragNode=0;
	this.dragStartNode=0;
	this.dragStartObject=0;
	this.tempDOMU=null;
	this.tempDOMM=null;
	this.waitDrag=0;
	window.dhtmlDragAndDrop=this;

	return this;
};

dhtmlDragAndDropObject.prototype.removeDraggableItem=function(htmlNode){
	htmlNode.onmousedown=null;
	htmlNode.dragStarter=null;
	htmlNode.dragLanding=null;
}
dhtmlDragAndDropObject.prototype.addDraggableItem=function(htmlNode, dhtmlObject){
	htmlNode.onmousedown=this.preCreateDragCopy;
	htmlNode.dragStarter=dhtmlObject;
	this.addDragLanding(htmlNode, dhtmlObject);
}
dhtmlDragAndDropObject.prototype.addDragLanding=function(htmlNode, dhtmlObject){
	htmlNode.dragLanding=dhtmlObject;
}
dhtmlDragAndDropObject.prototype.preCreateDragCopy=function(e){
	if ((e||window.event) && (e||event).button == 2)
		return;

	if (window.dhtmlDragAndDrop.waitDrag){
		window.dhtmlDragAndDrop.waitDrag=0;
		document.body.onmouseup=window.dhtmlDragAndDrop.tempDOMU;
		document.body.onmousemove=window.dhtmlDragAndDrop.tempDOMM;
		return false;
	}
	
	if (window.dhtmlDragAndDrop.dragNode)
		window.dhtmlDragAndDrop.stopDrag(e);	

	window.dhtmlDragAndDrop.waitDrag=1;
	window.dhtmlDragAndDrop.tempDOMU=document.body.onmouseup;
	window.dhtmlDragAndDrop.tempDOMM=document.body.onmousemove;
	window.dhtmlDragAndDrop.dragStartNode=this;
	window.dhtmlDragAndDrop.dragStartObject=this.dragStarter;
	document.body.onmouseup=window.dhtmlDragAndDrop.preCreateDragCopy;
	document.body.onmousemove=window.dhtmlDragAndDrop.callDrag;
	window.dhtmlDragAndDrop.downtime = new Date().valueOf();
	

	if ((e)&&(e.preventDefault)){
		e.preventDefault();
		return false;
	}
	return false;
};
dhtmlDragAndDropObject.prototype.callDrag=function(e){
	if (!e)
		e=window.event;
	dragger=window.dhtmlDragAndDrop;
	if ((new Date()).valueOf()-dragger.downtime<100) return;

	//if ((e.button == 0)&&(_isIE))
	//	return dragger.stopDrag();

	if (!dragger.dragNode){
		if (dragger.waitDrag){
			dragger.dragNode=dragger.dragStartObject._createDragNode(dragger.dragStartNode, e);
	
			if (!dragger.dragNode)
				return dragger.stopDrag();
	
			dragger.dragNode.onselectstart=function(){return false;}
			dragger.gldragNode=dragger.dragNode;
			document.body.appendChild(dragger.dragNode);
			document.body.onmouseup=dragger.stopDrag;
			dragger.waitDrag=0;
			dragger.dragNode.pWindow=window;
			dragger.initFrameRoute();
		} 
		else return dragger.stopDrag(e, true);
	}

	if (dragger.dragNode.parentNode != window.document.body && dragger.gldragNode){
		var grd = dragger.gldragNode;

		if (dragger.gldragNode.old)
			grd=dragger.gldragNode.old;

		//if (!document.all) dragger.calculateFramePosition();
		grd.parentNode.removeChild(grd);
		var oldBody = dragger.dragNode.pWindow;

		if (grd.pWindow &&	grd.pWindow.dhtmlDragAndDrop.lastLanding)
			grd.pWindow.dhtmlDragAndDrop.lastLanding.dragLanding._dragOut(grd.pWindow.dhtmlDragAndDrop.lastLanding);	
			
		//		var oldp=dragger.dragNode.parentObject;
		if (_isIE){
			var div = document.createElement("Div");
			div.innerHTML=dragger.dragNode.outerHTML;
			dragger.dragNode=div.childNodes[0];
		} else
			dragger.dragNode=dragger.dragNode.cloneNode(true);

		dragger.dragNode.pWindow=window;
		//		dragger.dragNode.parentObject=oldp;

		dragger.gldragNode.old=dragger.dragNode;
		document.body.appendChild(dragger.dragNode);
		oldBody.dhtmlDragAndDrop.dragNode=dragger.dragNode;
	}

	dragger.dragNode.style.left=e.clientX+15+(dragger.fx
		? dragger.fx*(-1)
		: 0)
		+(document.body.scrollLeft||document.documentElement.scrollLeft)+"px";
	dragger.dragNode.style.top=e.clientY+3+(dragger.fy
		? dragger.fy*(-1)
		: 0)
		+(document.body.scrollTop||document.documentElement.scrollTop)+"px";

	if (!e.srcElement)
		var z = e.target;
	else
		z=e.srcElement;
	dragger.checkLanding(z, e);
}

dhtmlDragAndDropObject.prototype.calculateFramePosition=function(n){
	//this.fx = 0, this.fy = 0;
	if (window.name){
		var el = parent.frames[window.name].frameElement.offsetParent;
		var fx = 0;
		var fy = 0;

		while (el){
			fx+=el.offsetLeft;
			fy+=el.offsetTop;
			el=el.offsetParent;
		}

		if ((parent.dhtmlDragAndDrop)){
			var ls = parent.dhtmlDragAndDrop.calculateFramePosition(1);
			fx+=ls.split('_')[0]*1;
			fy+=ls.split('_')[1]*1;
		}

		if (n)
			return fx+"_"+fy;
		else
			this.fx=fx;
		this.fy=fy;
	}
	return "0_0";
}
dhtmlDragAndDropObject.prototype.checkLanding=function(htmlObject, e){
	if ((htmlObject)&&(htmlObject.dragLanding)){
		if (this.lastLanding)
			this.lastLanding.dragLanding._dragOut(this.lastLanding);
		this.lastLanding=htmlObject;
		this.lastLanding=this.lastLanding.dragLanding._dragIn(this.lastLanding, this.dragStartNode, e.clientX,
			e.clientY, e);
		this.lastLanding_scr=(_isIE ? e.srcElement : e.target);
	} else {
		if ((htmlObject)&&(htmlObject.tagName != "BODY"))
			this.checkLanding(htmlObject.parentNode, e);
		else {
			if (this.lastLanding)
				this.lastLanding.dragLanding._dragOut(this.lastLanding, e.clientX, e.clientY, e);
			this.lastLanding=0;

			if (this._onNotFound)
				this._onNotFound();
		}
	}
}
dhtmlDragAndDropObject.prototype.stopDrag=function(e, mode){
	dragger=window.dhtmlDragAndDrop;

	if (!mode){
		dragger.stopFrameRoute();
		var temp = dragger.lastLanding;
		dragger.lastLanding=null;

		if (temp)
			temp.dragLanding._drag(dragger.dragStartNode, dragger.dragStartObject, temp, (_isIE
				? event.srcElement
				: e.target));
	}
	dragger.lastLanding=null;

	if ((dragger.dragNode)&&(dragger.dragNode.parentNode == document.body))
		dragger.dragNode.parentNode.removeChild(dragger.dragNode);
	dragger.dragNode=0;
	dragger.gldragNode=0;
	dragger.fx=0;
	dragger.fy=0;
	dragger.dragStartNode=0;
	dragger.dragStartObject=0;
	document.body.onmouseup=dragger.tempDOMU;
	document.body.onmousemove=dragger.tempDOMM;
	dragger.tempDOMU=null;
	dragger.tempDOMM=null;
	dragger.waitDrag=0;
}

dhtmlDragAndDropObject.prototype.stopFrameRoute=function(win){
	if (win)
		window.dhtmlDragAndDrop.stopDrag(1, 1);

	for (var i = 0; i < window.frames.length; i++){
		try{
		if ((window.frames[i] != win)&&(window.frames[i].dhtmlDragAndDrop))
			window.frames[i].dhtmlDragAndDrop.stopFrameRoute(window);
		} catch(e){}
	}

	try{
	if ((parent.dhtmlDragAndDrop)&&(parent != window)&&(parent != win))
		parent.dhtmlDragAndDrop.stopFrameRoute(window);
	} catch(e){}
}
dhtmlDragAndDropObject.prototype.initFrameRoute=function(win, mode){
	if (win){
		window.dhtmlDragAndDrop.preCreateDragCopy();
		window.dhtmlDragAndDrop.dragStartNode=win.dhtmlDragAndDrop.dragStartNode;
		window.dhtmlDragAndDrop.dragStartObject=win.dhtmlDragAndDrop.dragStartObject;
		window.dhtmlDragAndDrop.dragNode=win.dhtmlDragAndDrop.dragNode;
		window.dhtmlDragAndDrop.gldragNode=win.dhtmlDragAndDrop.dragNode;
		window.document.body.onmouseup=window.dhtmlDragAndDrop.stopDrag;
		window.waitDrag=0;

		if (((!_isIE)&&(mode))&&((!_isFF)||(_FFrv < 1.8)))
			window.dhtmlDragAndDrop.calculateFramePosition();
	}
	try{
	if ((parent.dhtmlDragAndDrop)&&(parent != window)&&(parent != win))
		parent.dhtmlDragAndDrop.initFrameRoute(window);
	}catch(e){}

	for (var i = 0; i < window.frames.length; i++){
		try{
		if ((window.frames[i] != win)&&(window.frames[i].dhtmlDragAndDrop))
			window.frames[i].dhtmlDragAndDrop.initFrameRoute(window, ((!win||mode) ? 1 : 0));
		} catch(e){}
	}
}

 _isFF = false;
 _isIE = false;
 _isOpera = false;
 _isKHTML = false;
 _isMacOS = false;
 _isChrome = false;
 _FFrv = false;
 _KHTMLrv = false;
 _OperaRv = false;

if (navigator.userAgent.indexOf('Macintosh') != -1)
	_isMacOS=true;


if (navigator.userAgent.toLowerCase().indexOf('chrome')>-1)
	_isChrome=true;

if ((navigator.userAgent.indexOf('Safari') != -1)||(navigator.userAgent.indexOf('Konqueror') != -1)){
	 _KHTMLrv = parseFloat(navigator.userAgent.substr(navigator.userAgent.indexOf('Safari')+7, 5));

	if (_KHTMLrv > 525){ //mimic FF behavior for Safari 3.1+
		_isFF=true;
		 _FFrv = 1.9;
	} else
		_isKHTML=true;
} else if (navigator.userAgent.indexOf('Opera') != -1){
	_isOpera=true;
	_OperaRv=parseFloat(navigator.userAgent.substr(navigator.userAgent.indexOf('Opera')+6, 3));
}


else if (navigator.appName.indexOf("Microsoft") != -1){
	_isIE=true;
	if (navigator.appVersion.indexOf("MSIE 8.0")!= -1 && document.compatMode != "BackCompat") _isIE=8;
	if (navigator.appVersion.indexOf("MSIE 9.0")!= -1 && document.compatMode != "BackCompat") _isIE=8;
} else {
	_isFF=true;
	 _FFrv = parseFloat(navigator.userAgent.split("rv:")[1])
}


//multibrowser Xpath processor
dtmlXMLLoaderObject.prototype.doXPath=function(xpathExp, docObj, namespace, result_type){
	if (_isKHTML || (!_isIE && !window.XPathResult))
		return this.doXPathOpera(xpathExp, docObj);

	if (_isIE){ //IE
		if (!docObj)
			if (!this.xmlDoc.nodeName)
				docObj=this.xmlDoc.responseXML
			else
				docObj=this.xmlDoc;

		if (!docObj)
			dhtmlxError.throwError("LoadXML", "Incorrect XML", [
				(docObj||this.xmlDoc),
				this.mainObject
			]);

		if (namespace != null)
			docObj.setProperty("SelectionNamespaces", "xmlns:xsl='"+namespace+"'"); //

		if (result_type == 'single'){
			return docObj.selectSingleNode(xpathExp);
		}
		else {
			return docObj.selectNodes(xpathExp)||new Array(0);
		}
	} else { //Mozilla
		var nodeObj = docObj;

		if (!docObj){
			if (!this.xmlDoc.nodeName){
				docObj=this.xmlDoc.responseXML
			}
			else {
				docObj=this.xmlDoc;
			}
		}

		if (!docObj)
			dhtmlxError.throwError("LoadXML", "Incorrect XML", [
				(docObj||this.xmlDoc),
				this.mainObject
			]);

		if (docObj.nodeName.indexOf("document") != -1){
			nodeObj=docObj;
		}
		else {
			nodeObj=docObj;
			docObj=docObj.ownerDocument;
		}
		var retType = XPathResult.ANY_TYPE;

		if (result_type == 'single')
			retType=XPathResult.FIRST_ORDERED_NODE_TYPE
		var rowsCol = new Array();
		var col = docObj.evaluate(xpathExp, nodeObj, function(pref){
			return namespace
		}, retType, null);

		if (retType == XPathResult.FIRST_ORDERED_NODE_TYPE){
			return col.singleNodeValue;
		}
		var thisColMemb = col.iterateNext();

		while (thisColMemb){
			rowsCol[rowsCol.length]=thisColMemb;
			thisColMemb=col.iterateNext();
		}
		return rowsCol;
	}
}

function _dhtmlxError(type, name, params){
	if (!this.catches)
		this.catches=new Array();

	return this;
}

_dhtmlxError.prototype.catchError=function(type, func_name){
	this.catches[type]=func_name;
}
_dhtmlxError.prototype.throwError=function(type, name, params){
	if (this.catches[type])
		return this.catches[type](type, name, params);

	if (this.catches["ALL"])
		return this.catches["ALL"](type, name, params);

	alert("Error type: "+arguments[0]+"\nDescription: "+arguments[1]);
	return null;
}

window.dhtmlxError=new _dhtmlxError();


//opera fake, while 9.0 not released
//multibrowser Xpath processor
dtmlXMLLoaderObject.prototype.doXPathOpera=function(xpathExp, docObj){
	//this is fake for Opera
	var z = xpathExp.replace(/[\/]+/gi, "/").split('/');
	var obj = null;
	var i = 1;

	if (!z.length)
		return [];

	if (z[0] == ".")
		obj=[docObj]; else if (z[0] == ""){
		obj=(this.xmlDoc.responseXML||this.xmlDoc).getElementsByTagName(z[i].replace(/\[[^\]]*\]/g, ""));
		i++;
	} else
		return [];

	for (i; i < z.length; i++)obj=this._getAllNamedChilds(obj, z[i]);

	if (z[i-1].indexOf("[") != -1)
		obj=this._filterXPath(obj, z[i-1]);
	return obj;
}

dtmlXMLLoaderObject.prototype._filterXPath=function(a, b){
	var c = new Array();
	var b = b.replace(/[^\[]*\[\@/g, "").replace(/[\[\]\@]*/g, "");

	for (var i = 0; i < a.length; i++)
		if (a[i].getAttribute(b))
			c[c.length]=a[i];

	return c;
}
dtmlXMLLoaderObject.prototype._getAllNamedChilds=function(a, b){
	var c = new Array();

	if (_isKHTML)
		b=b.toUpperCase();

	for (var i = 0; i < a.length; i++)for (var j = 0; j < a[i].childNodes.length; j++){
		if (_isKHTML){
			if (a[i].childNodes[j].tagName&&a[i].childNodes[j].tagName.toUpperCase() == b)
				c[c.length]=a[i].childNodes[j];
		}

		else if (a[i].childNodes[j].tagName == b)
			c[c.length]=a[i].childNodes[j];
	}

	return c;
}

function dhtmlXHeir(a, b){
	for (var c in b)
		if (typeof (b[c]) == "function")
			a[c]=b[c];
	return a;
}

function dhtmlxEvent(el, event, handler){
	if (el.addEventListener)
		el.addEventListener(event, handler, false);

	else if (el.attachEvent)
		el.attachEvent("on"+event, handler);
}

//============= XSL Extension ===================================

dtmlXMLLoaderObject.prototype.xslDoc=null;
dtmlXMLLoaderObject.prototype.setXSLParamValue=function(paramName, paramValue, xslDoc){
	if (!xslDoc)
		xslDoc=this.xslDoc

	if (xslDoc.responseXML)
		xslDoc=xslDoc.responseXML;
	var item =
		this.doXPath("/xsl:stylesheet/xsl:variable[@name='"+paramName+"']", xslDoc,
			"http:/\/www.w3.org/1999/XSL/Transform", "single");

	if (item != null)
		item.firstChild.nodeValue=paramValue
}
dtmlXMLLoaderObject.prototype.doXSLTransToObject=function(xslDoc, xmlDoc){
	if (!xslDoc)
		xslDoc=this.xslDoc;

	if (xslDoc.responseXML)
		xslDoc=xslDoc.responseXML

	if (!xmlDoc)
		xmlDoc=this.xmlDoc;

	if (xmlDoc.responseXML)
		xmlDoc=xmlDoc.responseXML

	//MOzilla
	if (!_isIE){
		if (!this.XSLProcessor){
			this.XSLProcessor=new XSLTProcessor();
			this.XSLProcessor.importStylesheet(xslDoc);
		}
		var result = this.XSLProcessor.transformToDocument(xmlDoc);
	} else {
		var result = new ActiveXObject("Msxml2.DOMDocument.3.0");
		try{
			xmlDoc.transformNodeToObject(xslDoc, result);
		}catch(e){
			result = xmlDoc.transformNode(xslDoc);
		}
	}
	return result;
}

dtmlXMLLoaderObject.prototype.doXSLTransToString=function(xslDoc, xmlDoc){
	var res = this.doXSLTransToObject(xslDoc, xmlDoc);
	if(typeof(res)=="string")
		return res;
	return this.doSerialization(res);
}

dtmlXMLLoaderObject.prototype.doSerialization=function(xmlDoc){
	if (!xmlDoc)
			xmlDoc=this.xmlDoc;
	if (xmlDoc.responseXML)
			xmlDoc=xmlDoc.responseXML
	if (!_isIE){
		var xmlSerializer = new XMLSerializer();
		return xmlSerializer.serializeToString(xmlDoc);
	} else
		return xmlDoc.xml;
}

/**
*   @desc: 
*   @type: private
*/
dhtmlxEventable=function(obj){
		obj.attachEvent=function(name, catcher, callObj){
			name='ev_'+name.toLowerCase();
			if (!this[name])
				this[name]=new this.eventCatcher(callObj||this);
				
			return(name+':'+this[name].addEvent(catcher)); //return ID (event name & event ID)
		}
		obj.callEvent=function(name, arg0){ 
			name='ev_'+name.toLowerCase();
			if (this[name])
				return this[name].apply(this, arg0);
			return true;
		}
		obj.checkEvent=function(name){
			return (!!this['ev_'+name.toLowerCase()])
		}
		obj.eventCatcher=function(obj){
			var dhx_catch = [];
			var z = function(){
				var res = true;
				for (var i = 0; i < dhx_catch.length; i++){
					if (dhx_catch[i] != null){
						var zr = dhx_catch[i].apply(obj, arguments);
						res=res&&zr;
					}
				}
				return res;
			}
			z.addEvent=function(ev){
				if (typeof (ev) != "function")
					ev=eval(ev);
				if (ev)
					return dhx_catch.push(ev)-1;
				return false;
			}
			z.removeEvent=function(id){
				dhx_catch[id]=null;
			}
			return z;
		}
		obj.detachEvent=function(id){
			if (id != false){
				var list = id.split(':');           //get EventName and ID
				this[list[0]].removeEvent(list[1]); //remove event
			}
		}
		obj.detachAllEvents = function(){
			for (var name in this){
				if (name.indexOf("ev_")==0) 
					delete this[name];
			}
		}
};

(function(){

var t = dhtmlx.message = function(text, type, lifetime, id){
	if (!t.area){
		t.area = document.createElement("DIV");
		t.area.style.cssText = "position:absolute;right:5px;width:250px;z-index:100;";
		t.area.className = "dhtmlx_message_area";
		t.area.style[t.defPosition]="5px";
		document.body.appendChild(t.area);
	}
	if (typeof text != "object")
		text = { text:text, type:type, lifetime:lifetime, id:id };

	text.type = text.type||"info";
	text.id = text.id||t.uid();
	text.lifetime = text.lifetime||t.defTimeout;


	t.hide(text.id);
	var message = document.createElement("DIV");
	message.style.cssText = "border-radius:4px; padding:4px 4px 4px 20px;background-color:#FFFFCC;font-size:12px;font-family:Tahoma;color:navy;z-index: 10000;margin:5px;border:1px solid lightgrey;";
	message.innerHTML = text.text;
	message.className = text.type;
	
	if (t.defPosition == "bottom" && t.area.firstChild)
		t.area.insertBefore(message,t.area.firstChild);
	else
		t.area.appendChild(message);

	t.timers[text.id]=window.setTimeout(function(){
		t.hide(text.id);
	}, text.lifetime);

	t.pull[text.id] = message;
	return text.id;
};

t.defTimeout = 4000;
t.defPosition = "top";
t.pull = {};
t.timers = {};
t.seed = (new Date()).valueOf();
t.uid = function(){ return t.seed++; };
t.hideAll = function(){
	for (var key in t.pull)
		t.hide(key);
		
};
t.hide = function(id){
	var obj = t.pull[id];
	if (obj && obj.parentNode){
		obj.parentNode.removeChild(obj);
		window.clearTimeout(t.timers[id]);
		delete t.pull[id];
	}
};

})();




/**
*	@desc: dhtmlxGrid cell object constructor (shouldn't be accesed directly. Use cells and cells2 methods of the grid instead)
*	@type: cell
*	@returns: dhtmlxGrid cell
*/
function dhtmlXGridCellObject(obj){
	/**
	*	@desc: desctructor, clean used memory
	*	@type: public
	*/
	this.destructor=function(){
		this.cell.obj=null;
		this.cell=null;
		this.grid=null;
		this.base=null;
		return null;
	}
	this.cell=obj;
	/**
	*	@desc: gets Value of cell
	*	@type: public
	*/
	this.getValue=function(){
		if ((this.cell.firstChild)&&(this.cell.firstChild.tagName == "TEXTAREA"))
			return this.cell.firstChild.value;
		else
			return this.cell.innerHTML._dhx_trim(); //innerText;
	}

	/**
	*	@desc: gets math formula of cell if any
	*	@type: public
	*/
	this.getMathValue=function(){
		if (this.cell.original)
			return this.cell.original; //innerText;
		else
			return this.getValue();
	}
	
//#excell_methods:04062008{
	/**
	*	@desc: determ. font style if it was set
	*	@returns: font name only if it was set for the cell
	*	@type: public
	*/
	this.getFont=function(){
		arOut=new Array(3);

		if (this.cell.style.fontFamily)
			arOut[0]=this.cell.style.fontFamily

		if (this.cell.style.fontWeight == 'bold'||this.cell.parentNode.style.fontWeight == 'bold')
			arOut[1]='bold';

		if (this.cell.style.fontStyle == 'italic'||this.cell.parentNode.style.fontWeight == 'italic')
			arOut[1]+='italic';

		if (this.cell.style.fontSize)
			arOut[2]=this.cell.style.fontSize
		else
			arOut[2]="";
		return arOut.join("-")
	}
	/**
	*	@desc: determ. cell's text color
	*	@returns: cell's text color
	*	@type: public
	*/
	this.getTextColor=function(){
		if (this.cell.style.color)
			return this.cell.style.color
		else
			return "#000000";
	}
	/**
	*	@desc: determ. cell's background color
	*	@returns: cell's background color
	*	@type: public
	*/
	this.getBgColor=function(){
		if (this.cell.bgColor)
			return this.cell.bgColor
		else
			return "#FFFFFF";
	}
	/**
	*	@desc: determines horisontal align od the cell
	*	@returns: horisontal align of cell content
	*	@type: public
	*/
	this.getHorAlign=function(){
		if (this.cell.style.textAlign)
			return this.cell.style.textAlign;

		else if (this.cell.style.textAlign)
			return this.cell.style.textAlign;

		else
			return "left";
	}
	/**
	*	@desc: gets width of the cell in pixel
	*	@returns: width of the cell in pixels
	*	@type: public
	*/
	this.getWidth=function(){
		return this.cell.scrollWidth;
	}

	/**
	*	@desc: sets font family to the cell
	*	@param: val - string in format: Arial-bold(italic,bolditalic,underline)-12px
	*	@type: public
	*/
	this.setFont=function(val){
		fntAr=val.split("-");
		this.cell.style.fontFamily=fntAr[0];
		this.cell.style.fontSize=fntAr[fntAr.length-1]

		if (fntAr.length == 3){
			if (/bold/.test(fntAr[1]))
				this.cell.style.fontWeight="bold";

			if (/italic/.test(fntAr[1]))
				this.cell.style.fontStyle="italic";

			if (/underline/.test(fntAr[1]))
				this.cell.style.textDecoration="underline";
		}
	}
	/**
	*	@desc: sets text color to the cell
	*	@param: val - color value (name or hex)
	*	@type: public
	*/
	this.setTextColor=function(val){
		this.cell.style.color=val;
	}
	/**
	*	@desc: sets background color to the cell
	*	@param: val - color value (name or hex)
	*	@type: public
	*/
	this.setBgColor=function(val){
		if (val == "")
			val=null;
		this.cell.bgColor=val;
	}
	/**
	*	@desc: sets horisontal align to the cell
	*	@param: val - value in single-letter or full format(exmp: r or right)
	*	@type: public
	*/
	this.setHorAlign=function(val){
		if (val.length == 1){
			if (val == 'c')
				this.cell.style.textAlign='center'

			else if (val == 'l')
				this.cell.style.textAlign='left';

			else
				this.cell.style.textAlign='right';
		} else
			this.cell.style.textAlign=val
	}
//#}
	/**
	*	@desc: determines whether cell value was changed
	*	@returns: true if cell value was changed, otherwise - false
	*	@type: public
	*/
	this.wasChanged=function(){
		if (this.cell.wasChanged)
			return true;
		else
			return false;
	}
	/**
	*	@desc: determines whether first child of the cell is checkbox or radio
	*	@returns: true if first child of the cell is input element of type radio or checkbox
	*	@type: deprecated
	*/
	this.isCheckbox=function(){
		var ch = this.cell.firstChild;

		if (ch&&ch.tagName == 'INPUT'){
			type=ch.type;

			if (type == 'radio'||type == 'checkbox')
				return true;
			else
				return false;
		} else
			return false;
	}
	/**
	*	@desc: determines whether radio or checkbox inside is checked
	*	@returns: true if first child of the cell is checked
	*	@type: public
	*/
	this.isChecked=function(){
		if (this.isCheckbox()){
			return this.cell.firstChild.checked;
		}
	}
	/**
	*	@desc: determines whether cell content (radio,checkbox) is disabled
	*	@returns: true if first child of the cell is disabled
	*	@type: public
	*/
	this.isDisabled=function(){
		return this.cell._disabled;
	}
	/**
	*	@desc: checks checkbox or radion
	*	@param: fl - true or false
	*	@type: public
	*/
	this.setChecked=function(fl){
		if (this.isCheckbox()){
			if (fl != 'true'&&fl != 1)
				fl=false;
			this.cell.firstChild.checked=fl;
		}
	}
	/**
	*	@desc: disables radio or checkbox
	*	@param: fl - true or false
	*	@type: public
	*/
	this.setDisabled=function(fl){
		if (fl != 'true'&&fl != 1)
			fl=false;

		if (this.isCheckbox()){
			this.cell.firstChild.disabled=fl;

			if (this.disabledF)
				this.disabledF(fl);
		}
		this.cell._disabled=fl;
	}
}

dhtmlXGridCellObject.prototype={
	getAttribute: function(name){
		return this.cell._attrs[name];
	},
	setAttribute: function(name, value){
		this.cell._attrs[name]=value;
	},
	getInput:function(){
		if (this.obj && (this.obj.tagName=="INPUT" || this.obj.tagName=="TEXTAREA")) return this.obj;
		
		var inps=(this.obj||this.cell).getElementsByTagName("TEXTAREA");
		if (!inps.length)
			inps=(this.obj||this.cell).getElementsByTagName("INPUT");
		return inps[0];
	}
}

/**
*	@desc: sets value to the cell
*	@param: val - new value
*	@type: public
*/
dhtmlXGridCellObject.prototype.setValue=function(val){
	if (( typeof (val) != "number")&&(!val||val.toString()._dhx_trim() == "")){
		val="&nbsp;"
		this.cell._clearCell=true;
	} else
		this.cell._clearCell=false;
	this.setCValue(val);
}
/**
*	@desc: sets value to the cell
*	@param: val - new value
*	@param: val2
*	@type: private
*/
dhtmlXGridCellObject.prototype.getTitle=function(){
	return (_isIE ? this.cell.innerText : this.cell.textContent);
}

dhtmlXGridCellObject.prototype.setCValue=function(val, val2){
	this.cell.innerHTML=val;
//#__pro_feature:21092006{
//#on_cell_changed:23102006{
	this.grid.callEvent("onCellChanged", [
		this.cell.parentNode.idd,
		this.cell._cellIndex,
		(arguments.length > 1 ? val2 : val)
	]);
//#}
//#}
}

dhtmlXGridCellObject.prototype.setCTxtValue=function(val){
	this.cell.innerHTML="";
	this.cell.appendChild(document.createTextNode(val));
//#__pro_feature:21092006{	
//#on_cell_changed:23102006{
	this.grid.callEvent("onCellChanged", [
		this.cell.parentNode.idd,
		this.cell._cellIndex,
		val
	]);
//#}
//#}
}

/**
*	@desc: sets text representation of cell which contains math formula ( setLabel doesn't triger math calculations as setValue do)
*	@param: val - new value
*	@type: public
*/
dhtmlXGridCellObject.prototype.setLabel=function(val){
	this.cell.innerHTML=val;
}

/**
*	@desc: get formula of ExCell ( actual only for math based exCells )
*	@type: public
*/
dhtmlXGridCellObject.prototype.getMath=function(){
	if (this._val)
		return this.val;
	else
		return this.getValue();
}

/**
*	@desc: dhtmlxGrid cell editor constructor (base for all eXcells). Shouldn't be accessed directly
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell(){
	this.obj=null; //editor
	//this.cell = null//cell to get value from
	this.val=null; //current value (before edit)
	/**
	*	@desc: occures on space for example 
	*	@type: private
	*/
	this.changeState=function(){
		return false
	}
	/**
	*	@desc: opens editor
	*	@type: private
	*/
	this.edit=function(){
		this.val=this.getValue()
	} //
	/**
	*	@desc: return value to cell, closes editor
	*	@returns: if cell's value was changed (true) or not
	*	@type: private
	*/
	this.detach=function(){
		return false
	} //
	/**
	*	@desc: gets position (left-right) of element
	*	@param: oNode - element to get position of
	*	@type: private
	*	@topic: 8
	*/
	this.getPosition=function(oNode){
		var oCurrentNode = oNode;
		var iLeft = 0;
		var iTop = 0;

		while (oCurrentNode.tagName != "BODY"){
			iLeft+=oCurrentNode.offsetLeft;
			iTop+=oCurrentNode.offsetTop;
			oCurrentNode=oCurrentNode.offsetParent;
		}
		return new Array(iLeft, iTop);
	}
}
eXcell.prototype=new dhtmlXGridCellObject;


/**
*	@desc: simple text editor
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_ed(cell){
	if (cell){
		this.cell=cell;
		this.grid=this.cell.parentNode.grid;
	}
	this.edit=function(){
		this.cell.atag=((!this.grid.multiLine)&&(_isKHTML||_isMacOS||_isFF)) ? "INPUT" : "TEXTAREA";
		this.val=this.getValue();
		this.obj=document.createElement(this.cell.atag);
		this.obj.setAttribute("autocomplete", "off");
		this.obj.style.height=(this.cell.offsetHeight-(_isIE ? 4 : 4))+"px";
		this.obj.className="dhx_combo_edit";
		this.obj.wrap="soft";
		this.obj.style.textAlign=this.cell.style.textAlign;
		this.obj.onclick=function(e){
			(e||event).cancelBubble=true
		}
		this.obj.onmousedown=function(e){
			(e||event).cancelBubble=true
		}
		this.obj.value=this.val
		this.cell.innerHTML="";
		this.cell.appendChild(this.obj);

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
		if (_isIE)
		    this.obj.focus();
		this.obj.focus()
	}
	this.getValue=function(){
		if ((this.cell.firstChild)&&((this.cell.atag)&&(this.cell.firstChild.tagName == this.cell.atag)))
			return this.cell.firstChild.value;

		if (this.cell._clearCell)
			return "";

		return this.cell.innerHTML.toString()._dhx_trim();
	}

	this.detach=function(){
		this.setValue(this.obj.value);
		return this.val != this.getValue();
	}
}
eXcell_ed.prototype=new eXcell;

/**
*	@desc: pure text editor ( HTML not supported )
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_edtxt(cell){
	if (cell){
		this.cell=cell;
		this.grid=this.cell.parentNode.grid;
	}
	this.getValue=function(){
		if ((this.cell.firstChild)&&((this.cell.atag)&&(this.cell.firstChild.tagName == this.cell.atag)))
			return this.cell.firstChild.value;

		if (this.cell._clearCell)
			return "";

		return (_isIE ? this.cell.innerText : this.cell.textContent);
	}
	this.setValue=function(val){
		if (!val||val.toString()._dhx_trim() == ""){
			val=" ";
			this.cell._clearCell=true;
		} else
			this.cell._clearCell=false;
		this.setCTxtValue(val);
	}
}
eXcell_edtxt.prototype=new eXcell_ed;
//#__pro_feature:21092006{
/**
*	@desc: simple numeric text editor
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*	@edition: professional
*/
function eXcell_edn(cell){
	if (cell){
		this.cell=cell;
		this.grid=this.cell.parentNode.grid;
	}
	this.getValue=function(){
		//this.grid.editStop();
		if ((this.cell.firstChild)&&(this.cell.firstChild.tagName == "TEXTAREA"))
			return this.cell.firstChild.value;

		if (this.cell._clearCell)
			return "";

		return this.cell._orig_value||this.grid._aplNFb(this.cell.innerHTML.toString()._dhx_trim(), this.cell._cellIndex);
	}

	this.detach=function(){
		var tv = this.obj.value;
		this.setValue(tv);
		return this.val != this.getValue();
	}
}
eXcell_edn.prototype=new eXcell_ed;
eXcell_edn.prototype.setValue=function(val){ 
	if (!val||val.toString()._dhx_trim() == ""){
		this.cell._clearCell=true;
		return this.setCValue("&nbsp;",0);
	} else {
		this.cell._clearCell=false;
		this.cell._orig_value = val;
	}
	this.setCValue(this.grid._aplNF(val, this.cell._cellIndex), val);
}
//#}

//#ch_excell:04062008{
/**
*	@desc: checkbox editor
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_ch(cell){
	if (cell){
		this.cell=cell;
		this.grid=this.cell.parentNode.grid;
	}

	this.disabledF=function(fl){
		if ((fl == true)||(fl == 1))
			this.cell.innerHTML=this.cell.innerHTML.replace("item_chk0.", "item_chk0_dis.").replace("item_chk1.",
				"item_chk1_dis.");
		else
			this.cell.innerHTML=this.cell.innerHTML.replace("item_chk0_dis.", "item_chk0.").replace("item_chk1_dis.",
				"item_chk1.");
	}

	this.changeState=function(fromClick){
		//nb:
		if (fromClick===true && !this.grid.isActive) {
			if (window.globalActiveDHTMLGridObject != null && window.globalActiveDHTMLGridObject != this.grid && window.globalActiveDHTMLGridObject.isActive) window.globalActiveDHTMLGridObject.setActive(false);
			this.grid.setActive(true);
		}
		if ((!this.grid.isEditable)||(this.cell.parentNode._locked)||(this.isDisabled()))
			return;

		if (this.grid.callEvent("onEditCell", [
			0,
			this.cell.parentNode.idd,
			this.cell._cellIndex
		])){
			this.val=this.getValue()

			if (this.val == "1")
				this.setValue("0")
			else
				this.setValue("1")

			this.cell.wasChanged=true;
			//nb:
			this.grid.callEvent("onEditCell", [
				1,
				this.cell.parentNode.idd,
				this.cell._cellIndex
			]);

			this.grid.callEvent("onCheckbox", [
				this.cell.parentNode.idd,
				this.cell._cellIndex,
				(this.val != '1')
			]);

			this.grid.callEvent("onCheck", [
				this.cell.parentNode.idd,
				this.cell._cellIndex,
				(this.val != '1')
			]);
		} else { //preserve editing (not tested thoroughly for this editor)
			this.editor=null;
		}
	}
	this.getValue=function(){
		return this.cell.chstate ? this.cell.chstate.toString() : "0";
	}

	this.isCheckbox=function(){
		return true;
	}
	this.isChecked=function(){
		if (this.getValue() == "1")
			return true;
		else
			return false;
	}

	this.setChecked=function(fl){
		this.setValue(fl.toString())
	}
	this.detach=function(){
		return this.val != this.getValue();
	}
	this.edit=null;
}
eXcell_ch.prototype=new eXcell;
eXcell_ch.prototype.setValue=function(val){
	this.cell.style.verticalAlign="middle"; //nb:to center checkbox in line
	//val can be int
	if (val){
		val=val.toString()._dhx_trim();

		if ((val == "false")||(val == "0"))
			val="";
	}

	if (val){
		val="1";
		this.cell.chstate="1";
	} else {
		val="0";
		this.cell.chstate="0"
	}
	var obj = this;
	this.setCValue("<img src='"+this.grid.imgURL+"item_chk"+val
		+".gif' onclick='new eXcell_ch(this.parentNode).changeState(true); (arguments[0]||event).cancelBubble=true; '>",
		this.cell.chstate);
}
//#}
//#ra_excell:04062008{
/**
*	@desc: radio editor
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_ra(cell){
	this.base=eXcell_ch;
	this.base(cell)
	this.grid=cell.parentNode.grid;

	this.disabledF=function(fl){
		if ((fl == true)||(fl == 1))
			this.cell.innerHTML=this.cell.innerHTML.replace("radio_chk0.", "radio_chk0_dis.").replace("radio_chk1.",
				"radio_chk1_dis.");
		else
			this.cell.innerHTML=this.cell.innerHTML.replace("radio_chk0_dis.", "radio_chk0.").replace("radio_chk1_dis.",
				"radio_chk1.");
	}

	this.changeState=function(mode){
		if (mode===false && this.getValue()==1) return;
		if ((!this.grid.isEditable)||(this.cell.parentNode._locked))
			return;

		if (this.grid.callEvent("onEditCell", [
			0,
			this.cell.parentNode.idd,
			this.cell._cellIndex
		]) != false){
			this.val=this.getValue()

			if (this.val == "1")
				this.setValue("0")
			else
				this.setValue("1")
			this.cell.wasChanged=true;
			//nb:
			this.grid.callEvent("onEditCell", [
				1,
				this.cell.parentNode.idd,
				this.cell._cellIndex
			]);

			this.grid.callEvent("onCheckbox", [
				this.cell.parentNode.idd,
				this.cell._cellIndex,
				(this.val != '1')
			]);

			this.grid.callEvent("onCheck", [
				this.cell.parentNode.idd,
				this.cell._cellIndex,
				(this.val != '1')
			]);
		} else { //preserve editing (not tested thoroughly for this editor)
			this.editor=null;
		}
	}
	this.edit=null;
}
eXcell_ra.prototype=new eXcell_ch;
eXcell_ra.prototype.setValue=function(val){
	this.cell.style.verticalAlign="middle"; //nb:to center checkbox in line

	if (val){
		val=val.toString()._dhx_trim();

		if ((val == "false")||(val == "0"))
			val="";
	}

	if (val){
		if (!this.grid._RaSeCol)
			this.grid._RaSeCol=[];

		if (this.grid._RaSeCol[this.cell._cellIndex]){
			var z = this.grid.cells4(this.grid._RaSeCol[this.cell._cellIndex]);
			z.setValue("0")
			if (this.grid.rowsAr[z.cell.parentNode.idd])
			this.grid.callEvent("onEditCell", [
				1,
				z.cell.parentNode.idd,
				z.cell._cellIndex
			]);
		}

		this.grid._RaSeCol[this.cell._cellIndex]=this.cell;

		val="1";
		this.cell.chstate="1";
	} else {
		val="0";
		this.cell.chstate="0"
	}
	this.setCValue("<img src='"+this.grid.imgURL+"radio_chk"+val+".gif' onclick='new eXcell_ra(this.parentNode).changeState(false);'>",
		this.cell.chstate);
}
//#}
//#txt_excell:04062008{
/**
*	@desc: multilene popup editor
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_txt(cell){
	if (cell){
		this.cell=cell;
		this.grid=this.cell.parentNode.grid;
	}
	this.edit=function(){
		this.val=this.getValue()
		this.obj=document.createElement("TEXTAREA");
		this.obj.className="dhx_textarea";

		this.obj.onclick=function(e){
			(e||event).cancelBubble=true
		}
		var arPos = this.grid.getPosition(this.cell); //,this.grid.objBox

		this.obj.value=this.val;

		this.obj.style.display="";
		this.obj.style.textAlign=this.cell.style.textAlign;

		if (_isFF){
			var z_ff = document.createElement("DIV");
			z_ff.appendChild(this.obj);
			z_ff.style.overflow="auto";
			z_ff.className="dhx_textarea";
			this.obj.style.margin="0px 0px 0px 0px";
			this.obj.style.border="0px";
			this.obj=z_ff;
		}
		document.body.appendChild(this.obj); //nb:
		if(_isOpera) this.obj.onkeypress=function(ev){ if (ev.keyCode == 9) return false; }
		this.obj.onkeydown=function(e){
			var ev = (e||event);

			if (ev.keyCode == 9){
				globalActiveDHTMLGridObject.entBox.focus();
				globalActiveDHTMLGridObject.doKey({
					keyCode: ev.keyCode,
					shiftKey: ev.shiftKey,
					srcElement: "0"
					});

				return false;
			}
		}

		this.obj.style.left=arPos[0]+"px";
		this.obj.style.top=arPos[1]+this.cell.offsetHeight+"px";

		if (this.cell.offsetWidth < 200)
			var pw = 200;
		else
			var pw = this.cell.offsetWidth;
		this.obj.style.width=pw+(_isFF ? 18 : 16)+"px"

		if (_isFF){
			this.obj.firstChild.style.width=parseInt(this.obj.style.width)+"px";
			this.obj.firstChild.style.height=this.obj.offsetHeight-3+"px";
		}

        if (_isIE) { this.obj.select(); this.obj.value=this.obj.value; }//dzen of IE
		if (_isFF)
			this.obj.firstChild.focus();
		else {
			this.obj.focus()
		}
	}
	this.detach=function(){
		var a_val = "";

		if (_isFF)
			a_val=this.obj.firstChild.value;
		else
			a_val=this.obj.value;

		if (a_val == ""){
			this.cell._clearCell=true;
		}
		else
			this.cell._clearCell=false;
		this.setValue(a_val);
		document.body.removeChild(this.obj);
		this.obj=null;
		return this.val != this.getValue();
	}
	this.getValue=function(){
		if (this.obj){
			if (_isFF)
				return this.obj.firstChild.value;
			else
				return this.obj.value;
		}
				
		if (this.cell._clearCell)
			return "";

		if ((!this.grid.multiLine))
			return this.cell._brval||this.cell.innerHTML;
		else
			return this.cell.innerHTML.replace(/<br[^>]*>/gi, "\n")._dhx_trim(); //innerText;
	}
}

eXcell_txt.prototype=new eXcell;

/**
*	@desc: multiline text editor without HTML support
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_txttxt(cell){
	if (cell){
		this.cell=cell;
		this.grid=this.cell.parentNode.grid;
	}
	this.getValue=function(){
		if ((this.cell.firstChild)&&(this.cell.firstChild.tagName == "TEXTAREA"))
			return this.cell.firstChild.value;

		if (this.cell._clearCell)
			return "";

		if ((!this.grid.multiLine)&&this.cell._brval)
			return this.cell._brval;

		return (_isIE ? this.cell.innerText : this.cell.textContent);
	}
	this.setValue=function(val){
		this.cell._brval=val;

		if (!val||val.toString()._dhx_trim() == ""){
			val=" ";
			this.cell._clearCell=true;
		} else
			this.cell._clearCell=false;
		this.setCTxtValue(val);
	}
}

eXcell_txttxt.prototype=new eXcell_txt;

eXcell_txt.prototype.setValue=function(val){
	if (!val||val.toString()._dhx_trim() == ""){
		val="&nbsp;"
		this.cell._clearCell=true;
	} else
		this.cell._clearCell=false;

	this.cell._brval=val;

	if ((!this.grid.multiLine))
		this.setCValue(val, val);
	else
		this.setCValue(val.replace(/\n/g, "<br/>"), val);
}
//#}
//#co_excell:04062008{
/**
*	@desc: combobox editor
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_co(cell){
	if (cell){
		this.cell=cell;
		this.grid=this.cell.parentNode.grid;
		this.combo=(this.cell._combo||this.grid.getCombo(this.cell._cellIndex));
		this.editable=true
	}
	this.shiftNext=function(){
		var z = this.list.options[this.list.selectedIndex+1];

		if (z)
			z.selected=true;
		this.obj.value=this.list.options[this.list.selectedIndex].text;

		return true;
	}
	this.shiftPrev=function(){
		if (this.list.selectedIndex != 0){
			var z = this.list.options[this.list.selectedIndex-1];

			if (z)
				z.selected=true;
			this.obj.value=this.list.options[this.list.selectedIndex].text;
		}

		return true;
	}

	this.edit=function(){
		this.val=this.getValue();
		this.text=this.getText()._dhx_trim();
		var arPos = this.grid.getPosition(this.cell) //,this.grid.objBox)

		this.obj=document.createElement("TEXTAREA");
		this.obj.className="dhx_combo_edit";
		this.obj.style.height=(this.cell.offsetHeight-4)+"px";

		this.obj.wrap="soft";
		this.obj.style.textAlign=this.cell.style.textAlign;
		this.obj.onclick=function(e){
			(e||event).cancelBubble=true
		}
		this.obj.onmousedown=function(e){
			(e||event).cancelBubble=true
		}
		this.obj.value=this.text
		this.obj.onselectstart=function(e){
			if (!e)
				e=event;
			e.cancelBubble=true;
			return true;
		};
		var editor_obj = this;
		this.obj.onkeyup=function(e){
			var key=(e||event).keyCode;
			if (key==38 || key==40 || key==9) return;
			var val = this.readonly ? String.fromCharCode(key) : this.value;
			
			var c = editor_obj.list.options;

			for (var i = 0; i < c.length; i++)
				if (c[i].text.indexOf(val) == 0)
					return c[i].selected=true;
		}
		this.list=document.createElement("SELECT");

		this.list.className='dhx_combo_select';
		this.list.style.width=this.cell.offsetWidth+"px";
		this.list.style.left=arPos[0]+"px";                       //arPos[0]
		this.list.style.top=arPos[1]+this.cell.offsetHeight+"px"; //arPos[1]+this.cell.offsetHeight;
		this.list.onclick=function(e){
			var ev = e||window.event;
			var cell = ev.target||ev.srcElement

			//tbl.editor_obj.val=cell.combo_val;
			if (cell.tagName == "OPTION")
				cell=cell.parentNode;
			//editor_obj.list.value = cell.value;
			editor_obj.editable=false;
			editor_obj.grid.editStop();
			ev.cancelBubble = true;
		}
		var comboKeys = this.combo.getKeys();
		var fl = false
		var selOptId = 0;

		for (var i = 0; i < comboKeys.length; i++){
			var val = this.combo.get(comboKeys[i])
			this.list.options[this.list.options.length]=new Option(val, comboKeys[i]);

			if (comboKeys[i] == this.val){
				selOptId=this.list.options.length-1;
				fl=true;
			}
		}

		if (fl == false){ //if no such value in combo list
			this.list.options[this.list.options.length]=new Option(this.text, this.val === null ? "" : this.val);
			selOptId=this.list.options.length-1;
		}
		document.body.appendChild(this.list) //nb:this.grid.objBox.appendChild(this.listBox);
		this.list.size="6";
		this.cstate=1;

		if (this.editable){
			this.cell.innerHTML="";
		}
		else {
			this.obj.style.width="1px";
			this.obj.style.height="1px";
		}
		this.cell.appendChild(this.obj);
		this.list.options[selOptId].selected=true;

		//fix for coro - FF scrolls grid in incorrect position
		if ((!_isFF)||(this.editable)){
			this.obj.focus();
			this.obj.focus();
		}

		if (!this.editable){
			this.obj.style.visibility="hidden";
			this.list.focus();
			this.list.onkeydown=function(e){
				e=e||window.event;
				editor_obj.grid.setActive(true)

				if (e.keyCode < 30)
					return editor_obj.grid.doKey({
						target: editor_obj.cell,
						keyCode: e.keyCode,
						shiftKey: e.shiftKey,
						ctrlKey: e.ctrlKey
						})
			}
		}
	}

	this.getValue=function(){
		return ((this.cell.combo_value == window.undefined) ? "" : this.cell.combo_value);
	}
	this.detach=function(){
		if (this.val != this.getValue()){
			this.cell.wasChanged=true;
		}

		if (this.list.parentNode != null){
			if (this.editable){
					var ind = this.list.options[this.list.selectedIndex]
					if (ind&&ind.text == this.obj.value)
						this.setValue(this.list.value)
					else{
						var combo=(this.cell._combo||this.grid.getCombo(this.cell._cellIndex));
						var val=combo.values._dhx_find(this.obj.value);
						if (val!=-1) this.setValue(combo.keys[val]);
						else this.setCValue(this.cell.combo_value=this.obj.value);
					}
			}
			else
				this.setValue(this.list.value)
		}

		if (this.list.parentNode)
			this.list.parentNode.removeChild(this.list);

		if (this.obj.parentNode)
			this.obj.parentNode.removeChild(this.obj);

		return this.val != this.getValue();
	}
}
eXcell_co.prototype=new eXcell;
eXcell_co.prototype.getText=function(){
	return this.cell.innerHTML;
}
eXcell_co.prototype.setValue=function(val){
	if (typeof (val) == "object"){
		var optCol = this.grid.xmlLoader.doXPath("./option", val);

		if (optCol.length)
			this.cell._combo=new dhtmlXGridComboObject();

		for (var j = 0;
			j < optCol.length;
			j++)this.cell._combo.put(optCol[j].getAttribute("value"),
			optCol[j].firstChild
				? optCol[j].firstChild.data
				: "");
		val=val.firstChild.data;
	}

	if ((val||"").toString()._dhx_trim() == "")
		val=null
	this.cell.combo_value=val;
	
	if (val !== null){
		var label = (this.cell._combo||this.grid.getCombo(this.cell._cellIndex)).get(val);
		this.setCValue(label===null?val:label, val);
	}else
		this.setCValue("&nbsp;", val);

	
}
/**
*	@desc: selectbox editor
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_coro(cell){
	this.base=eXcell_co;
	this.base(cell)
	this.editable=false;
}
eXcell_coro.prototype=new eXcell_co;

function eXcell_cotxt(cell){
	this.base=eXcell_co;
	this.base(cell)
}
eXcell_cotxt.prototype=new eXcell_co;
eXcell_cotxt.prototype.getText=function(){
	return (_isIE ? this.cell.innerText : this.cell.textContent);
}
eXcell_cotxt.prototype.setValue=function(val){
	if (typeof (val) == "object"){
		var optCol = this.grid.xmlLoader.doXPath("./option", val);

		if (optCol.length)
			this.cell._combo=new dhtmlXGridComboObject();

		for (var j = 0;
			j < optCol.length;
			j++)this.cell._combo.put(optCol[j].getAttribute("value"),
			optCol[j].firstChild
				? optCol[j].firstChild.data
				: "");
		val=val.firstChild.data;
	}

	if ((val||"").toString()._dhx_trim() == "")
		val=null

	if (val !== null)
		this.setCTxtValue((this.cell._combo||this.grid.getCombo(this.cell._cellIndex)).get(val)||val, val);
	else
		this.setCTxtValue(" ", val);

	this.cell.combo_value=val;
}

function eXcell_corotxt(cell){
	this.base=eXcell_co;
	this.base(cell)
	this.editable=false;
}
eXcell_corotxt.prototype=new eXcell_cotxt;
//#}

//#cp_excell:04062008{
/**
*	@desc: color picker editor
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_cp(cell){
	try{
		this.cell=cell;
		this.grid=this.cell.parentNode.grid;
	}
	catch (er){}
	this.edit=function(){
		this.val=this.getValue()
		this.obj=document.createElement("SPAN");
		this.obj.style.border="1px solid black";
		this.obj.style.position="absolute";
		var arPos = this.grid.getPosition(this.cell); //,this.grid.objBox
		this.colorPanel(4, this.obj)
		document.body.appendChild(this.obj);          //this.grid.objBox.appendChild(this.obj);
		this.obj.style.left=arPos[0]+"px";
		this.obj.style.zIndex=1;
		this.obj.style.top=arPos[1]+this.cell.offsetHeight+"px";
	}
	this.toolDNum=function(value){
		if (value.length == 1)
			value='0'+value;
		return value;
	}
	this.colorPanel=function(index, parent){
		var tbl = document.createElement("TABLE");
		parent.appendChild(tbl)
		tbl.cellSpacing=0;
		tbl.editor_obj=this;
		tbl.style.cursor="default";
		tbl.onclick=function(e){
			var ev = e||window.event
			var cell = ev.target||ev.srcElement;
			var ed = cell.parentNode.parentNode.parentNode.editor_obj
			ed.setValue(cell._bg)
			ed.grid.editStop();
		}
		var cnt = 256 / index;
		for (var j = 0; j <= (256 / cnt); j++){
			var r = tbl.insertRow(j);

			for (var i = 0; i <= (256 / cnt); i++){
				for (var n = 0; n <= (256 / cnt); n++){
					R=new Number(cnt*j)-(j == 0 ? 0 : 1)
					G=new Number(cnt*i)-(i == 0 ? 0 : 1)
					B=new Number(cnt*n)-(n == 0 ? 0 : 1)
					var rgb =
						this.toolDNum(R.toString(16))+""+this.toolDNum(G.toString(16))+""+this.toolDNum(B.toString(16));
					var c = r.insertCell(i);
					c.width="10px";
					c.innerHTML="&nbsp;"; //R+":"+G+":"+B;//
					c.title=rgb.toUpperCase()
					c.style.backgroundColor="#"+rgb
					c._bg="#"+rgb;

					if (this.val != null&&"#"+rgb.toUpperCase() == this.val.toUpperCase()){
						c.style.border="2px solid white"
					}
				}
			}
		}
	}
	this.getValue=function(){
		return this.cell.firstChild._bg||""; //this.getBgColor()
	}
	this.getRed=function(){
		return Number(parseInt(this.getValue().substr(1, 2), 16))
	}
	this.getGreen=function(){
		return Number(parseInt(this.getValue().substr(3, 2), 16))
	}
	this.getBlue=function(){
		return Number(parseInt(this.getValue().substr(5, 2), 16))
	}
	this.detach=function(){
		if (this.obj.offsetParent != null)
			document.body.removeChild(this.obj);
		//this.obj.removeNode(true)
		return this.val != this.getValue();
	}
}
eXcell_cp.prototype=new eXcell;
eXcell_cp.prototype.setValue=function(val){
	this.setCValue("<div style='width:100%;height:"+((this.grid.multiLine?this.cell.offsetHeight-2:16))+";background-color:"+(val||"")
		+";border:0px;'>&nbsp;</div>",
		val);
	this.cell.firstChild._bg=val;
}
//#}

//#img_excell:04062008{
/**
*	@desc: image editor
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
/*
	The corresponding  cell value in XML should be a "^" delimited list of following values:
	1st - image src
	2nd - image alt text (optional)
	3rd - link (optional)
	4rd - target (optional, default is _self)
*/
function eXcell_img(cell){
	try{
		this.cell=cell;
		this.grid=this.cell.parentNode.grid;
	}
	catch (er){}
	this.getValue=function(){
		if (this.cell.firstChild.tagName == "IMG")
			return this.cell.firstChild.src+(this.cell.titFl != null
				? "^"+this.cell._brval
				: "");
			else if (this.cell.firstChild.tagName == "A"){
			var out = this.cell.firstChild.firstChild.src+(this.cell.titFl != null ? "^"+this.cell._brval : "");
			out+="^"+this.cell.lnk;

			if (this.cell.trg)
				out+="^"+this.cell.trg
			return out;
		}
	}
	this.isDisabled=function(){
		return true;
	}
}
eXcell_img.prototype=new eXcell;
eXcell_img.prototype.getTitle=function(){
	return this.cell._brval
}
eXcell_img.prototype.setValue=function(val){
	var title = val;

	if (val.indexOf("^") != -1){
		var ar = val.split("^");
		val=ar[0]
		title=this.cell._attrs.title||ar[1];

		//link
		if (ar.length > 2){
			this.cell.lnk=ar[2]

			if (ar[3])
				this.cell.trg=ar[3]
		}
		this.cell.titFl="1";
	}
	this.setCValue("<img src='"+this.grid.iconURL+(val||"")._dhx_trim()+"' border='0'>", val);

	if (this.cell.lnk){
		this.cell.innerHTML="<a href='"+this.cell.lnk+"' target='"+this.cell.trg+"'>"+this.cell.innerHTML+"</a>"
	}
	this.cell._brval=title;
}
//#}

//#price_excell:04062008{
/**
*	@desc: text editor with price (USD) formatting
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_price(cell){
	this.base=eXcell_ed;
	this.base(cell)
	this.getValue=function(){
		if (this.cell.childNodes.length > 1)
			return this.cell.childNodes[1].innerHTML.toString()._dhx_trim()
		else
			return "0";
	}
}

eXcell_price.prototype=new eXcell_ed;
eXcell_price.prototype.setValue=function(val){
	if (isNaN(parseFloat(val))){
		val=this.val||0;
	}
	var color = "green";

	if (val < 0)
		color="red";

	this.setCValue("<span>$</span><span style='padding-right:2px;color:"+color+";'>"+val+"</span>", val);
}
//#}

//#dyn_excells:04062008{
/**
*	@desc: text editor with additional formatting for positive and negative numbers (arrow down/up and color)
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_dyn(cell){
	this.base=eXcell_ed;
	this.base(cell)
	this.getValue=function(){
		return this.cell.firstChild.childNodes[1].innerHTML.toString()._dhx_trim()
	}
}

eXcell_dyn.prototype=new eXcell_ed;
eXcell_dyn.prototype.setValue=function(val){
	if (!val||isNaN(Number(val))){
		if (val!=="")
			val=0;
	}

	if (val > 0){
		var color = "green";
		var img = "dyn_up.gif";
	} else if (val == 0){
		var color = "black";
		var img = "dyn_.gif";
	} else {
		var color = "red";
		var img = "dyn_down.gif";
	}
	this.setCValue("<div style='position:relative;padding-right:2px; width:100%;overflow:hidden; white-space:nowrap;'><img src='"+this.grid.imgURL+""+img
		+"' height='15' style='position:absolute;top:0px;left:0px;'><span style=' padding-left:20px; width:100%;color:"+color+";'>"+val
		+"</span></div>",
		val);
}
//#}

/**
*	@desc: readonly editor
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_ro(cell){
	if (cell){
		this.cell=cell;
		this.grid=this.cell.parentNode.grid;
	}
	this.edit=function(){
	}

	this.isDisabled=function(){
		return true;
	}
	this.getValue=function(){
		return this.cell._clearCell?"":this.cell.innerHTML.toString()._dhx_trim();
	}
}
eXcell_ro.prototype=new eXcell;

function eXcell_ron(cell){
	this.cell=cell;
	this.grid=this.cell.parentNode.grid;
	this.edit=function(){
	}

	this.isDisabled=function(){
		return true;
	}
	this.getValue=function(){
		return this.cell._clearCell?"":this.grid._aplNFb(this.cell.innerHTML.toString()._dhx_trim(), this.cell._cellIndex);
	}
}
eXcell_ron.prototype=new eXcell;
eXcell_ron.prototype.setValue=function(val){ 
	if (val === 0){}
	else if (!val||val.toString()._dhx_trim() == ""){
		this.setCValue("&nbsp;");
		return this.cell._clearCell=true;
	}
	this.cell._clearCell=false;
	this.setCValue(val?this.grid._aplNF(val, this.cell._cellIndex):"0");
}


/**
*	@desc: readonly pure text editor (without HTML support)
*	@returns: dhtmlxGrid cell editor object
*	@type: public
*/
function eXcell_rotxt(cell){
	this.cell=cell;
	this.grid=this.cell.parentNode.grid;
	this.edit=function(){
	}

	this.isDisabled=function(){
		return true;
	}
	this.setValue=function(val){
		if (!val){
			val=" ";
			this.cell._clearCell = true;
		}
		else
			this.cell._clearCell = false;
			
		this.setCTxtValue(val);
	}
	this.getValue=function(){
		if (this.cell._clearCell)
			return "";
	    return (_isIE ? this.cell.innerText : this.cell.textContent);
	}	
}
eXcell_rotxt.prototype=new eXcell;

/**
	*	@desc: combobox object constructor (shouldn't be accessed directly - instead please use getCombo(...) method of the grid)
	*	@type: private
	*	@returns: combobox for dhtmlxGrid
	*/
function dhtmlXGridComboObject(){
	this.keys=new dhtmlxArray();
	this.values=new dhtmlxArray();
	/**
	*	@desc: puts new combination of key and value into combobox
	*	@type: public
	*	@param: key - object to use as a key (should be a string in the case of combobox)
	*	@param: value - object value of combobox line
	*/
	this.put=function(key, value){
		for (var i = 0; i < this.keys.length; i++){
			if (this.keys[i] == key){
				this.values[i]=value;
				return true;
			}
		}
		this.values[this.values.length]=value;
		this.keys[this.keys.length]=key;
	}
	/**
	*	@desc: gets value corresponding to the given key
	*	@type: public
	*	@param: key - object to use as a key (should be a string in the case of combobox)
	*	@returns: value correspond. to given key or null if no such key
	*/
	this.get=function(key){
		for (var i = 0; i < this.keys.length; i++){
			if (this.keys[i] == key){
				return this.values[i];
			}
		}
		return null;
	}
	/**
	*	@desc: clears combobox
	*	@type: public
	*/
	this.clear=function(){
		/*for(var i=0;i<this.keys.length;i++){
				this.keys._dhx_removeAt(i);
				this.values._dhx_removeAt(i);
		}*/
		this.keys=new dhtmlxArray();
		this.values=new dhtmlxArray();
	}
	/**
	*	@desc: remove pair of key-value from combobox with given key 
	*	@type: public
	*	@param: key - object to use as a key
	*/
	this.remove=function(key){
		for (var i = 0; i < this.keys.length; i++){
			if (this.keys[i] == key){
				this.keys._dhx_removeAt(i);
				this.values._dhx_removeAt(i);
				return true;
			}
		}
	}
	/**
	*	@desc: gets the size of combobox 
	*	@type: public
	*	@returns: current size of combobox
	*/
	this.size=function(){
		var j = 0;

		for (var i = 0; i < this.keys.length; i++){
			if (this.keys[i] != null)
				j++;
		}
		return j;
	}
	/**
	*	@desc: gets array of all available keys present in combobox
	*	@type: public
	*	@returns: array of all available keys
	*/
	this.getKeys=function(){
		var keyAr = new Array(0);

		for (var i = 0; i < this.keys.length; i++){
			if (this.keys[i] != null)
				keyAr[keyAr.length]=this.keys[i];
		}
		return keyAr;
	}

	/**
	*	@desc: save curent state
	*	@type: public
	*/
	this.save=function(){
		this._save=new Array();

		for (var i = 0; i < this.keys.length; i++)this._save[i]=[
			this.keys[i],
			this.values[i]
		];
	}


	/**
	*	@desc: restore saved state
	*	@type: public
	*/
	this.restore=function(){
		if (this._save){
			this.keys[i]=new Array();
			this.values[i]=new Array();

			for (var i = 0; i < this._save.length; i++){
				this.keys[i]=this._save[i][0];
				this.values[i]=this._save[i][1];
			}
		}
	}
	return this;
}

function Hashtable(){
	this.keys=new dhtmlxArray();
	this.values=new dhtmlxArray();
	return this;
}
Hashtable.prototype=new dhtmlXGridComboObject;

//(c)dhtmlx ltd. www.dhtmlx.com



//latest dev. version

/*_TOPICS_
@0:initialization
@1:selection control
@2:rows control
@3:colums control
@4:cells controll
@5:data manipulation
@6:appearence control
@7:overal control
@8:tools
@9:treegrid
@10: event handlers
@11: paginal output
*/

var globalActiveDHTMLGridObject;
String.prototype._dhx_trim=function(){
	return this.replace(/&nbsp;/g, " ").replace(/(^[ \t]*)|([ \t]*$)/g, "");
}

function dhtmlxArray(ar){
	return dhtmlXHeir((ar||new Array()), dhtmlxArray._master);
};
dhtmlxArray._master={
	_dhx_find:function(pattern){
		for (var i = 0; i < this.length; i++){
			if (pattern == this[i])
				return i;
		}
		return -1;
	},
	_dhx_insertAt:function(ind, value){
		this[this.length]=null;
		for (var i = this.length-1; i >= ind; i--)
			this[i]=this[i-1]
		this[ind]=value
	},
	_dhx_removeAt:function(ind){
			this.splice(ind,1)
	},
	_dhx_swapItems:function(ind1, ind2){
		var tmp = this[ind1];
		this[ind1]=this[ind2]
		this[ind2]=tmp;
	}
}

/**
*   @desc: dhtmlxGrid constructor
*   @param: id - (optional) id of div element to base grid on
*   @returns: dhtmlxGrid object
*   @type: public
*/
function dhtmlXGridObject(id){
	if (_isIE)
		try{
			document.execCommand("BackgroundImageCache", false, true);
		}
		catch (e){}

	if (id){
		if (typeof (id) == 'object'){
			this.entBox=id
			this.entBox.id="cgrid2_"+this.uid();
		} else
			this.entBox=document.getElementById(id);
	} else {
		this.entBox=document.createElement("DIV");
		this.entBox.id="cgrid2_"+this.uid();
	}
	this.entBox.innerHTML="";
	dhtmlxEventable(this);

	var self = this;

	this._wcorr=0;
	this.fontWidth = 7;
	this.cell=null;
	this.row=null;
	this.iconURL="";
	this.editor=null;
	this._f2kE=true;
	this._dclE=true;
	this.combos=new Array(0);
	this.defVal=new Array(0);
	this.rowsAr={
	};

	this.rowsBuffer=dhtmlxArray();
	this.rowsCol=dhtmlxArray(); //array of rows by index

	this._data_cache={
	};

	this._ecache={
	}

	this._ud_enabled=true;
	this.xmlLoader=new dtmlXMLLoaderObject(this.doLoadDetails, this, true, this.no_cashe);

	this._maskArr=[];
	this.selectedRows=dhtmlxArray(); //selected rows array

	this.UserData={};//hash of row related userdata (and for grid - "gridglobaluserdata")
	this._sizeFix=this._borderFix=0;
	/*MAIN OBJECTS*/

	this.entBox.className+=" gridbox";

	this.entBox.style.width=this.entBox.getAttribute("width")
		||(window.getComputedStyle
			? (this.entBox.style.width||window.getComputedStyle(this.entBox, null)["width"])
			: (this.entBox.currentStyle
				? this.entBox.currentStyle["width"]
				: this.entBox.style.width||0))
		||"100%";

	this.entBox.style.height=this.entBox.getAttribute("height")
		||(window.getComputedStyle
			? (this.entBox.style.height||window.getComputedStyle(this.entBox, null)["height"])
			: (this.entBox.currentStyle
				? this.entBox.currentStyle["height"]
				: this.entBox.style.height||0))
		||"100%";
	//cursor and text selection
	this.entBox.style.cursor='default';

	this.entBox.onselectstart=function(){
		return false
	}; //avoid text select
	var t_creator=function(name){
		var t=document.createElement("TABLE");
		t.cellSpacing=t.cellPadding=0;
		t.style.cssText='width:100%;table-layout:fixed;';
		t.className=name.substr(2);
		return t;
	}
	this.obj=t_creator("c_obj");
	this.hdr=t_creator("c_hdr");
	this.hdr.style.marginRight="20px";
	this.hdr.style.paddingRight="20px";
	
	this.objBox=document.createElement("DIV");
	this.objBox.style.width="100%";
	this.objBox.style.overflow="auto";
	this.objBox.appendChild(this.obj);
	this.objBox.className="objbox";

	this.hdrBox=document.createElement("DIV");
	this.hdrBox.style.width="100%"
	this.hdrBox.style.height="25px";
	this.hdrBox.style.overflow="hidden";
	this.hdrBox.className="xhdr";
	

	this.preloadImagesAr=new Array(0)

	this.sortImg=document.createElement("IMG")
	this.sortImg.style.display="none";
	
	this.hdrBox.appendChild(this.sortImg)
	this.hdrBox.appendChild(this.hdr);
	this.hdrBox.style.position="relative";

	this.entBox.appendChild(this.hdrBox);
	this.entBox.appendChild(this.objBox);
	
	//add links to current object
	this.entBox.grid=this;
	this.objBox.grid=this;
	this.hdrBox.grid=this;
	this.obj.grid=this;
	this.hdr.grid=this;
	
	/*PROPERTIES*/
	this.cellWidthPX=[];                      //current width in pixels
	this.cellWidthPC=[];                      //width in % if cellWidthType set in pc
	this.cellWidthType=this.entBox.cellwidthtype||"px"; //px or %

	this.delim=this.entBox.delimiter||",";
	this._csvDelim=",";

	this.hdrLabels=[];
	this.columnIds=[];
	this.columnColor=[];
	this._hrrar=[];
	this.cellType=dhtmlxArray();
	this.cellAlign=[];
	this.initCellWidth=[];
	this.fldSort=[];
	this._srdh=(_isIE && (document.compatMode != "BackCompat") ? 22 : 20);
	this.imgURL=window.dhx_globalImgPath||""; 
	this.isActive=false; //fl to indicate if grid is in work now
	this.isEditable=true;
	this.useImagesInHeader=false; //use images in header or not
	this.pagingOn=false;          //paging on/off
	this.rowsBufferOutSize=0;     //number of rows rendered at a moment
	/*EVENTS*/
	dhtmlxEvent(window, "unload", function(){
		try{
			if (self.destructor) self.destructor();
		}
		catch (e){}
	});

	/*XML LOADER(S)*/
	/**
	*   @desc: set one of predefined css styles (xp, mt, gray, light, clear, modern)
	*   @param: name - style name
	*   @type: public
	*   @topic: 0,6
	*/
	this.setSkin=function(name){
		this.skin_name=name;
		this.entBox.className="gridbox gridbox_"+name;
		this.skin_h_correction=0;
		
//#alter_css:06042008{		
		this.enableAlterCss("ev_"+name, "odd_"+name, this.isTreeGrid())
		this._fixAlterCss()
//#}
		switch (name){
			case "clear":
				this._topMb=document.createElement("DIV");
				this._topMb.className="topMumba";
				this._topMb.innerHTML="<img style='left:0px'   src='"+this.imgURL
					+"skinC_top_left.gif'><img style='right:20px' src='"+this.imgURL+"skinC_top_right.gif'>";
				this.entBox.appendChild(this._topMb);
				this._botMb=document.createElement("DIV");
				this._botMb.className="bottomMumba";
				this._botMb.innerHTML="<img style='left:0px'   src='"+this.imgURL
					+"skinD_bottom_left.gif'><img style='right:20px' src='"+this.imgURL+"skinD_bottom_right.gif'>";
				this.entBox.appendChild(this._botMb);
				if (this.entBox.style.position != "absolute") 
					this.entBox.style.position="relative";
				this.skin_h_correction=20;
				break;

			case "dhx_skyblue":
			case "dhx_web":
			case "glassy_blue":
			case "dhx_black":
			case "dhx_blue":
			case "modern":
			case "light":
				this._srdh=20;
				this.forceDivInHeader=true;
				break;
				
			case "xp":
				this.forceDivInHeader=true;
				if ((_isIE)&&(document.compatMode != "BackCompat"))
					this._srdh=26;
				else this._srdh=22;
				break;

			case "mt":
				if ((_isIE)&&(document.compatMode != "BackCompat"))
					this._srdh=26;
				else this._srdh=22;
				break;

			case "gray":
				if ((_isIE)&&(document.compatMode != "BackCompat"))
					this._srdh=22;
				break;
			case "sbdark":
				break;
		}

		if (_isIE&&this.hdr){
			var d = this.hdr.parentNode;
			d.removeChild(this.hdr);
			d.appendChild(this.hdr);
		}
		this.setSizes();
	}

	if (_isIE)
		this.preventIECaching(true);
	if (window.dhtmlDragAndDropObject)
		this.dragger=new dhtmlDragAndDropObject();

	/*METHODS. SERVICE*/
	/**
	*   @desc: on scroll grid inner actions
	*   @type: private
	*   @topic: 7
	*/
	this._doOnScroll=function(e, mode){
		this.callEvent("onScroll", [
			this.objBox.scrollLeft,
			this.objBox.scrollTop
		]);

		this.doOnScroll(e, mode);
	}
	/**
	*   @desc: on scroll grid more inner action
	*   @type: private
	*   @topic: 7
	*/
	this.doOnScroll=function(e, mode){
		this.hdrBox.scrollLeft=this.objBox.scrollLeft;

		if (this.ftr)
			this.ftr.parentNode.scrollLeft=this.objBox.scrollLeft;

		if (mode)
			return;

		if (this._srnd){
			if (this._dLoadTimer)
				window.clearTimeout(this._dLoadTimer);
			this._dLoadTimer=window.setTimeout(function(){
				if (self._update_srnd_view)
					self._update_srnd_view();
			}, 100);
		}
	}
	/**
	*   @desc: attach grid to some object in DOM
	*   @param: obj - object to attach to
	*   @type: public
	*   @topic: 0,7
	*/
	this.attachToObject=function(obj){
		obj.appendChild(this.globalBox?this.globalBox:this.entBox);
		//this.objBox.style.height=this.entBox.style.height;
		this.setSizes();
	}
	/**
	*   @desc: initialize grid
	*   @param: fl - if to parse on page xml data island 
	*   @type: public
	*   @topic: 0,7
	*/
	this.init=function(fl){
		if ((this.isTreeGrid())&&(!this._h2)){
			this._h2=new dhtmlxHierarchy();

			if ((this._fake)&&(!this._realfake))
				this._fake._h2=this._h2;
			this._tgc={
				imgURL: null
				};
		}

		if (!this._hstyles)
			return;

		this.editStop()
		/*TEMPORARY STATES*/
		this.lastClicked=null;                //row clicked without shift key. used in multiselect only
		this.resized=null;                    //hdr cell that is resized now
		this.fldSorted=this.r_fldSorted=null; //hdr cell last sorted
		//empty grid if it already was initialized
		this.cellWidthPX=[];
		this.cellWidthPC=[];

		if (this.hdr.rows.length > 0){
			this.clearAll(true);
		}

		var hdrRow = this.hdr.insertRow(0);

		for (var i = 0; i < this.hdrLabels.length; i++){
			hdrRow.appendChild(document.createElement("TH"));
			hdrRow.childNodes[i]._cellIndex=i;
			hdrRow.childNodes[i].style.height="0px";
		}

		if (_isIE && _isIE<8)
			hdrRow.style.position="absolute";
		else
			hdrRow.style.height='auto';

		var hdrRow = this.hdr.insertRow(_isKHTML ? 2 : 1);

		hdrRow._childIndexes=new Array();
		var col_ex = 0;

		for (var i = 0; i < this.hdrLabels.length; i++){
			hdrRow._childIndexes[i]=i-col_ex;

			if ((this.hdrLabels[i] == this.splitSign)&&(i != 0)){
				if (_isKHTML)
					hdrRow.insertCell(i-col_ex);
				hdrRow.cells[i-col_ex-1].colSpan=(hdrRow.cells[i-col_ex-1].colSpan||1)+1;
				hdrRow.childNodes[i-col_ex-1]._cellIndex++;
				col_ex++;
				hdrRow._childIndexes[i]=i-col_ex;
				continue;
			}

			hdrRow.insertCell(i-col_ex);

			hdrRow.childNodes[i-col_ex]._cellIndex=i;
			hdrRow.childNodes[i-col_ex]._cellIndexS=i;
			this.setColumnLabel(i, this.hdrLabels[i]);
		}

		if (col_ex == 0)
			hdrRow._childIndexes=null;
		this._cCount=this.hdrLabels.length;

		if (_isIE)
			window.setTimeout(function(){
				if (self.setSizes)
					self.setSizes();
			}, 1);

		//create virtual top row
		if (!this.obj.firstChild)
			this.obj.appendChild(document.createElement("TBODY"));

		var tar = this.obj.firstChild;

		if (!tar.firstChild){
			tar.appendChild(document.createElement("TR"));
			tar=tar.firstChild;

			if (_isIE && _isIE<8)
				tar.style.position="absolute";
			else
				tar.style.height='auto';

			for (var i = 0; i < this.hdrLabels.length; i++){
				tar.appendChild(document.createElement("TH"));
				tar.childNodes[i].style.height="0px";
			}
		}

		this._c_order=null;

		if (this.multiLine != true)
			this.obj.className+=" row20px";

		//
		//this.combos = new Array(this.hdrLabels.length);
		//set sort image to initial state
		this.sortImg.style.position="absolute";
		this.sortImg.style.display="none";
		this.sortImg.src=this.imgURL+"sort_desc.gif";
		this.sortImg.defLeft=0;

		if (this.noHeader){
			this.hdrBox.style.display='none';
		}
		else {
			this.noHeader=false
		}
//#__pro_feature:21092006{
//#column_hidden:21092006{
		if (this._ivizcol)
			this.setColHidden();
//#}
//#}
//#header_footer:06042008{		
		this.attachHeader();
		this.attachHeader(0, 0, "_aFoot");
//#}
		this.setSizes();

		if (fl)
			this.parseXML()
		this.obj.scrollTop=0

		if (this.dragAndDropOff)
			this.dragger.addDragLanding(this.entBox, this);

		if (this._initDrF)
			this._initD();

		if (this._init_point)
			this._init_point();
	};
	
	this.setColumnSizes=function(gridWidth){
		var summ = 0;
		var fcols = []; //auto-size columns

		var fix = 0;
		for (var i = 0; i < this._cCount; i++){
			if ((this.initCellWidth[i] == "*") && !this._hrrar[i]){
				this._awdth=false; //disable auto-width
				fcols.push(i);
				continue;
			}

			if (this.cellWidthType == '%'){
				if (typeof this.cellWidthPC[i]=="undefined")
					this.cellWidthPC[i]=this.initCellWidth[i];
				var cwidth = (gridWidth*this.cellWidthPC[i]/100)||0;
				if (fix>0.5){
					cwidth++;
					fix--;
				}
				var rwidth = this.cellWidthPX[i]=Math.floor(cwidth);
				var fix =fix + cwidth - rwidth;
			} else{
				if (typeof this.cellWidthPX[i]=="undefined")
					this.cellWidthPX[i]=this.initCellWidth[i];
			}
			if (!this._hrrar[i])
				summ+=this.cellWidthPX[i]*1;
		}

		//auto-size columns
		if (fcols.length){
			var ms = Math.floor((gridWidth-summ)/fcols.length);
			if (ms < 0) ms=1;

			for (var i = 0; i < fcols.length; i++){
				var next=Math.max((this._drsclmW ? (this._drsclmW[fcols[i]]||0) : 0),ms)
				this.cellWidthPX[fcols[i]]=next;
				summ+=next;
			}
			
			if(gridWidth > summ){
				var last=fcols[fcols.length-1];
    			this.cellWidthPX[last]=this.cellWidthPX[last] + (gridWidth-summ);
				summ = gridWidth;
			}
			
			this._setAutoResize();
		}
		
		
		this.obj.style.width=summ+"px";
		this.hdr.style.width=summ+"px";
		if (this.ftr) this.ftr.style.width=summ+"px";

		this.chngCellWidth();
		return summ;
	}
	
	/**shz)_
	*   @desc: sets sizes of grid elements
	*   @type: private
	*   @topic: 0,7
	*/
	this.setSizes=function(){
		//drop processing if grid still not initialized 
		if ((!this.hdr.rows[0])) return;

		var quirks=this.quirks = (_isIE && document.compatMode=="BackCompat");
		var outerBorder=(this.entBox.offsetWidth-this.entBox.clientWidth)/2;		
		
		if (this.globalBox){
			var splitOuterBorder=(this.globalBox.offsetWidth-this.globalBox.clientWidth)/2;		
			if (this._delta_x && !this._realfake){
				var ow = this.globalBox.clientWidth;
				this.globalBox.style.width=this._delta_x;
				this.entBox.style.width=Math.max(0,(this.globalBox.clientWidth+(quirks?splitOuterBorder*2:0))-this._fake.entBox.clientWidth)+"px";
				if (ow != this.globalBox.clientWidth){
					this._fake._correctSplit(this._fake.entBox.clientWidth);
				}
			}
			if (this._delta_y && !this._realfake){
				this.globalBox.style.height = this._delta_y;
				this.entBox.style.overflow = this._fake.entBox.style.overflow="hidden";
				this.entBox.style.height = this._fake.entBox.style.height=this.globalBox.clientHeight+(quirks?splitOuterBorder*2:0)+"px";
			}
		} else {
			if (this._delta_x){
				/*when placed directly in TD tag, container can't use native percent based sizes, 
					because table auto-adjust to show all content - too clever*/
				if (this.entBox.parentNode && this.entBox.parentNode.tagName=="TD"){
					this.entBox.style.width="1px";
					this.entBox.style.width=parseInt(this._delta_x)*this.entBox.parentNode.clientWidth/100-outerBorder*2+"px";
				}else
					this.entBox.style.width=this._delta_x;
			}
			if (this._delta_y)
				this.entBox.style.height=this._delta_y;
		}
			
		//if we have container without sizes, wait untill sizes defined
		window.clearTimeout(this._sizeTime);		
		if (!this.entBox.offsetWidth && (!this.globalBox || !this.globalBox.offsetWidth)){
			this._sizeTime=window.setTimeout(function(){
				if (self.setSizes)
					self.setSizes();
			}, 250);
			return;
		}		
		
		var border_x = ((!this._wthB) && ((this.entBox.cmp||this._delta_x) && (this.skin_name||"").indexOf("dhx")==0 && !quirks)?2:0);
		var border_y = ((!this._wthB) && ((this.entBox.cmp||this._delta_y) && (this.skin_name||"").indexOf("dhx")==0 && !quirks)?2:0);
		
		var isVScroll = this.parentGrid?false:(this.objBox.scrollHeight > this.objBox.offsetHeight);
		
		var scrfix = _isFF?18:18;
		var gridWidth=this.entBox.clientWidth-(this.skin_h_correction||0)*(quirks?0:1)-border_x;
		var gridWidthActive=this.entBox.clientWidth-(this.skin_h_correction||0)-border_x;
		var gridHeight=this.entBox.clientHeight-border_y;
		var summ=this.setColumnSizes(gridWidthActive-(isVScroll?scrfix:0)-(this._correction_x||0));
		
		var isHScroll = this.parentGrid?false:((this.objBox.scrollWidth > this.objBox.offsetWidth)||(this.objBox.style.overflowX=="scroll")); 
		var headerHeight = this.hdr.clientHeight;
		var footerHeight = this.ftr?this.ftr.clientHeight:0;
		var newWidth=gridWidth;
		var newHeight=gridHeight-headerHeight-footerHeight;

		//if we have auto-width without limitations - ignore h-scroll
		if (this._awdth && this._awdth[0] && this._awdth[1]==99999) isHScroll=0;
		//auto-height
		if (this._ahgr){
			if (this._ahgrMA)
				newHeight=this.entBox.parentNode.clientHeight-headerHeight-footerHeight;
			else
				newHeight=this.obj.offsetHeight+(isHScroll?scrfix:0)+(this._correction_y||0);

			if (this._ahgrM){
				if (this._ahgrF) 
					newHeight=Math.min(this._ahgrM,newHeight+headerHeight+footerHeight)-headerHeight-footerHeight;
				else 
					newHeight=Math.min(this._ahgrM,newHeight);
				
			}
			if (isVScroll && newHeight>=this.obj.scrollHeight+(isHScroll?scrfix:0)){
				isVScroll=false;//scroll will be compensated;
				this.setColumnSizes(gridWidthActive-(this._correction_x||0)); //correct auto-size columns
			}
		}

		//auto-width
		if ((this._awdth)&&(this._awdth[0])){ 
			//convert percents to PX, because auto-width with procents has no sense
			if (this.cellWidthType == '%') this.cellWidthType="px";
			
			if (this._fake) summ+=this._fake.entBox.clientWidth;	//include fake grid in math
			var newWidth=Math.min(Math.max(summ+(isVScroll?scrfix:0),this._awdth[2]),this._awdth[1])+(this._correction_x||0);
			if (this._fake) newWidth-=this._fake.entBox.clientWidth;
		}

		newHeight=Math.max(0,newHeight);//validate value for IE
		
		//FF3.1, bug in table rendering engine
		this._ff_size_delta=(this._ff_size_delta==0.1)?0.2:0.1;
		if (!_isFF) this._ff_size_delta=0;
		
		this.entBox.style.width=Math.max(0,newWidth+(quirks?2:0)*outerBorder+this._ff_size_delta)+"px";
		this.entBox.style.height=newHeight+(quirks?2:0)*outerBorder+headerHeight+footerHeight+"px";
		this.objBox.style.height=newHeight+((quirks&&!isVScroll)?2:0)*outerBorder+"px";//):this.entBox.style.height);
		this.hdrBox.style.height=headerHeight+"px";		
		
		
		if (newHeight != gridHeight)
			this.doOnScroll(0, !this._srnd);
		var ext=this["setSizes_"+this.skin_name];
		if (ext) ext.call(this);
			
		this.setSortImgPos();	
		
		//it possible that changes of size, has changed header height 
		if (headerHeight != this.hdr.clientHeight && this._ahgr) 	
			this.setSizes();
		this.callEvent("onSetSizes",[]);
	};
	this.setSizes_clear=function(){
		var y=this.hdr.offsetHeight;
		var x=this.entBox.offsetWidth;
		var y2=y+this.objBox.offsetHeight;
			this._topMb.style.top=(y||0)+"px";
			this._topMb.style.width=(x+20)+"px";
			this._botMb.style.top=(y2-3)+"px";
			this._botMb.style.width=(x+20)+"px";
	};
	/**
	*   @desc: changes cell width
	*   @param: [ind] - index of row in grid
	*   @type: private
	*   @topic: 4,7
	*/
	this.chngCellWidth=function(){
		if ((_isOpera)&&(this.ftr))
			this.ftr.width=this.objBox.scrollWidth+"px";
		var l = this._cCount;

		for (var i = 0; i < l; i++){
			this.hdr.rows[0].cells[i].style.width=this.cellWidthPX[i]+"px";
			this.obj.rows[0].childNodes[i].style.width=this.cellWidthPX[i]+"px";
			
			if (this.ftr)
				this.ftr.rows[0].cells[i].style.width=this.cellWidthPX[i]+"px";
		}
	}
	/**
	*   @desc: set delimiter character used in list values (default is ",")
	*   @param: delim - delimiter as string
	*   @before_init: 1
	*   @type: public
	*   @topic: 0
	*/
	this.setDelimiter=function(delim){
		this.delim=delim;
	}
	/**
	*   @desc: set width of columns in percents
	*   @type: public
	*   @before_init: 1
	*   @param: wp - list of column width in percents
	*   @topic: 0,7
	*/
	this.setInitWidthsP=function(wp){
		this.cellWidthType="%";
		this.initCellWidth=wp.split(this.delim.replace(/px/gi, ""));
		if (!arguments[1]) this._setAutoResize();
	}
	/**
	*	@desc:
	*	@type: private
	*	@topic: 0
	*/
	this._setAutoResize=function(){
		if (this._realfake) return;
		var el = window;
		var self = this;
		
		dhtmlxEvent(window,"resize",function(){
			window.clearTimeout(self._resize_timer);
			if (self._setAutoResize)
				self._resize_timer=window.setTimeout(function(){
					if (self.setSizes)
						self.setSizes();
					if (self._fake)
						self._fake._correctSplit();
				}, 100);
		})
	}


	/**
	*   @desc: set width of columns in pixels
	*   @type: public
	*   @before_init: 1
	*   @param: wp - list of column width in pixels
	*   @topic: 0,7
	*/
	this.setInitWidths=function(wp){
		this.cellWidthType="px";
		this.initCellWidth=wp.split(this.delim);

		if (_isFF){
			for (var i = 0; i < this.initCellWidth.length; i++)
				if (this.initCellWidth[i] != "*")
					this.initCellWidth[i]=parseInt(this.initCellWidth[i]);
		}
	}

	/**
	*   @desc: set multiline rows support to enabled or disabled state
	*   @type: public
	*   @before_init: 1
	*   @param: state - true or false
	*   @topic: 0,7
	*/
	this.enableMultiline=function(state){
		this.multiLine=convertStringToBoolean(state);
	}

	/**
	*   @desc: set multiselect mode to enabled or disabled state
	*   @type: public
	*   @param: state - true or false
	*   @topic: 0,7
	*/
	this.enableMultiselect=function(state){
		this.selMultiRows=convertStringToBoolean(state);
	}

	/**
	*   @desc: set path to grid internal images (sort direction, any images used in editors, checkbox, radiobutton)
	*   @type: public
	*   @param: path - url (or relative path) of images folder with closing "/"
	*   @topic: 0,7
	*/
	this.setImagePath=function(path){
		this.imgURL=path;
	}
	this.setImagesPath=this.setImagePath;
	/**
	*   @desc: set path to external images used in grid ( tree and img column types )
	*   @type: public
	*   @param: path - url (or relative path) of images folder with closing "/"
	*   @topic: 0,7
	*/
	this.setIconPath=function(path){
		this.iconURL=path;
	}	
	this.setIconsPath=this.setIconPath;
//#column_resize:06042008{
	/**
	*   @desc: part of column resize routine
	*   @type: private
	*   @param: ev - event
	*   @topic: 3
	*/
	this.changeCursorState=function(ev){
		var el = ev.target||ev.srcElement;

		if (el.tagName != "TD")
			el=this.getFirstParentOfType(el, "TD")
		if (!el) return;
		if ((el.tagName == "TD")&&(this._drsclmn)&&(!this._drsclmn[el._cellIndex]))
			return el.style.cursor="default";
		var check = (ev.layerX||0)+(((!_isIE)&&(ev.target.tagName == "DIV")) ? el.offsetLeft : 0);
		if ((el.offsetWidth-(ev.offsetX||(parseInt(this.getPosition(el, this.hdrBox))-check)*-1)) < (_isOpera?20:10)){
			el.style.cursor="E-resize";
		}
		else{
		    el.style.cursor="default";
		}

		if (_isOpera)
			this.hdrBox.scrollLeft=this.objBox.scrollLeft;
	}
	/**
	*   @desc: part of column resize routine
	*   @type: private
	*   @param: ev - event
	*   @topic: 3
	*/
	this.startColResize=function(ev){
		if (this.resized) this.stopColResize();
		this.resized=null;
		var el = ev.target||ev.srcElement;
		if (el.tagName != "TD")
			el=this.getFirstParentOfType(el, "TD")
		var x = ev.clientX;
		var tabW = this.hdr.offsetWidth;
		var startW = parseInt(el.offsetWidth)

		if (el.tagName == "TD"&&el.style.cursor != "default"){
			if ((this._drsclmn)&&(!this._drsclmn[el._cellIndex]))
				return;
				
			self._old_d_mm=document.body.onmousemove;
			self._old_d_mu=document.body.onmouseup;
			document.body.onmousemove=function(e){
				if (self)
					self.doColResize(e||window.event, el, startW, x, tabW)
			}
			document.body.onmouseup=function(){
				if (self)
					self.stopColResize();
			}
		}
	}
	/**
	*   @desc: part of column resize routine
	*   @type: private
	*   @param: ev - event
	*   @topic: 3
	*/
	this.stopColResize=function(){ 
		document.body.onmousemove=self._old_d_mm||"";
		document.body.onmouseup=self._old_d_mu||"";
		this.setSizes();
		this.doOnScroll(0, 1)
		this.callEvent("onResizeEnd", [this]);
	}
	/**
	*   @desc: part of column resize routine
	*   @param: el - element (column resizing)
	*   @param: startW - started width
	*   @param: x - x coordinate to resize from
	*   @param: tabW - started width of header table
	*   @type: private
	*   @topic: 3
	*/
	this.doColResize=function(ev, el, startW, x, tabW){
		el.style.cursor="E-resize";
		this.resized=el;
		var fcolW = startW+(ev.clientX-x);
		var wtabW = tabW+(ev.clientX-x)

		if (!(this.callEvent("onResize", [
			el._cellIndex,
			fcolW,
			this
		])))
			return;

		if (_isIE)
			this.objBox.scrollLeft=this.hdrBox.scrollLeft;

		if (el.colSpan > 1){
			var a_sizes = new Array();

			for (var i = 0;
				i < el.colSpan;
				i++)a_sizes[i]=Math.round(fcolW*this.hdr.rows[0].childNodes[el._cellIndexS+i].offsetWidth/el.offsetWidth);

			for (var i = 0; i < el.colSpan; i++)
				this._setColumnSizeR(el._cellIndexS+i*1, a_sizes[i]);
		} else
			this._setColumnSizeR(el._cellIndex, fcolW);
		this.doOnScroll(0, 1);

        this.setSizes();
        if (this._fake && this._awdth) this._fake._correctSplit();
	}

	/**
	*   @desc: set width of grid columns ( zero row of header and body )
	*   @type: private
	*   @topic: 7
	*/
	this._setColumnSizeR=function(ind, fcolW){
		if (fcolW > ((this._drsclmW&&!this._notresize) ? (this._drsclmW[ind]||10) : 10)){
			this.obj.rows[0].childNodes[ind].style.width=fcolW+"px";
			this.hdr.rows[0].childNodes[ind].style.width=fcolW+"px";

			if (this.ftr)
				this.ftr.rows[0].childNodes[ind].style.width=fcolW+"px";

			if (this.cellWidthType == 'px'){
				this.cellWidthPX[ind]=fcolW;
			}
			else {
				var gridWidth = parseInt(this.entBox.offsetWidth);

				if (this.objBox.scrollHeight > this.objBox.offsetHeight)
					gridWidth-=17;
				var pcWidth = Math.round(fcolW / gridWidth*100)
				this.cellWidthPC[ind]=pcWidth;
			}
			if (this.sortImg.style.display!="none")
				this.setSortImgPos();
		}
	}
//#}
//#sorting:06042008{
	/**
	*    @desc: sets position and visibility of sort arrow
	*    @param: state - true/false - show/hide image
	*    @param: ind - index of field
	*    @param: order - asc/desc - type of image
	*    @param: row - one based index of header row ( used in multirow headers, top row by default )
	*   @type: public
	*   @topic: 7
	*/
	this.setSortImgState=function(state, ind, order, row){
		order=(order||"asc").toLowerCase();

		if (!convertStringToBoolean(state)){
			this.sortImg.style.display="none";
			this.fldSorted=this.r_fldSorted = null;
			return;
		}

		if (order == "asc")
			this.sortImg.src=this.imgURL+"sort_asc.gif";
		else
			this.sortImg.src=this.imgURL+"sort_desc.gif";

		this.sortImg.style.display="";
		this.fldSorted=this.hdr.rows[0].childNodes[ind];
		var r = this.hdr.rows[row||1];
		if (!r) return;

		for (var i = 0; i < r.childNodes.length; i++){
			if (r.childNodes[i]._cellIndexS == ind){
				this.r_fldSorted=r.childNodes[i];
				return  this.setSortImgPos();
			}
		}
		return this.setSortImgState(state,ind,order,(row||1)+1);
	}

	/**
	*    @desc: sets position and visibility of sort arrow
	*    @param: ind - index of field
	*    @param: ind - index of field
	*    @param: hRowInd - index of row in case of complex header, one-based, optional

	*   @type: private
	*   @topic: 7
	*/
	this.setSortImgPos=function(ind, mode, hRowInd, el){
		if (this._hrrar && this._hrrar[this.r_fldSorted?this.r_fldSorted._cellIndex:ind]) return;
		if (!el){
			if (!ind)
				var el = this.r_fldSorted;
			else
				var el = this.hdr.rows[hRowInd||0].cells[ind];
		}

		if (el != null){
			var pos = this.getPosition(el, this.hdrBox)
			var wdth = el.offsetWidth;
			this.sortImg.style.left=Number(pos[0]+wdth-13)+"px"; //Number(pos[0]+5)+"px";
			this.sortImg.defLeft=parseInt(this.sortImg.style.left)
			this.sortImg.style.top=Number(pos[1]+5)+"px";

			if ((!this.useImagesInHeader)&&(!mode))
				this.sortImg.style.display="inline";
			this.sortImg.style.left=this.sortImg.defLeft+"px"; //-parseInt(this.hdrBox.scrollLeft)
		}
	}
//#}
	/**
	*   @desc: manage activity of the grid.
	*   @param: fl - true to activate,false to deactivate
	*   @type: private
	*   @topic: 1,7
	*/
	this.setActive=function(fl){
		if (arguments.length == 0)
			var fl = true;

		if (fl == true){
			//document.body.onkeydown = new Function("","document.getElementById('"+this.entBox.id+"').grid.doKey()")//
			if (globalActiveDHTMLGridObject&&(globalActiveDHTMLGridObject != this)){
				globalActiveDHTMLGridObject.editStop();
				globalActiveDHTMLGridObject.callEvent("onBlur",[globalActiveDHTMLGridObject]);
			}

			globalActiveDHTMLGridObject=this;
			this.isActive=true;
		} else {
			this.isActive=false;
			this.callEvent("onBlur",[this]);
		}
	};
	/**
	*     @desc: called on click occured
	*     @type: private
	*/
	this._doClick=function(ev){
		var selMethod = 0;
		var el = this.getFirstParentOfType(_isIE ? ev.srcElement : ev.target, "TD");
		if (!el) return;
		var fl = true;

		//mm
		//markers start
		if (this.markedCells){
			var markMethod = 0;

			if (ev.shiftKey||ev.metaKey){
				markMethod=1;
			}

			if (ev.ctrlKey){
				markMethod=2;
			}
			this.doMark(el, markMethod);
			return true;
		}
		//markers end
		//mm

		if (this.selMultiRows != false){
			if (ev.shiftKey && this.row != null && this.selectedRows.length){
				selMethod=1;
			}

			if (ev.ctrlKey||ev.metaKey){
				selMethod=2;
			}
		}
		this.doClick(el, fl, selMethod)
	};

//#context_menu:06042008{
	/**
	*   @desc: called onmousedown inside grid area
	*   @type: private
	*/
	this._doContClick=function(ev){ 
		var el = this.getFirstParentOfType(_isIE ? ev.srcElement : ev.target, "TD");

		if ((!el)||( typeof (el.parentNode.idd) == "undefined"))
			return true;

		if (ev.button == 2||(_isMacOS&&ev.ctrlKey)){
			if (!this.callEvent("onRightClick", [
				el.parentNode.idd,
				el._cellIndex,
				ev
			])){
				var z = function(e){
					(e||event).cancelBubble=true;
					return false;
				};

				(ev.srcElement||ev.target).oncontextmenu=z;
				return z(ev);
			}

			if (this._ctmndx){
				if (!(this.callEvent("onBeforeContextMenu", [
					el.parentNode.idd,
					el._cellIndex,
					this
				])))
					return true;
					
				if (_isIE)
					ev.srcElement.oncontextmenu=function(){
						event.cancelBubble=true;
						return false;
					};
					
				if (this._ctmndx.showContextMenu){
					
var dEl0=window.document.documentElement;
var dEl1=window.document.body;
var corrector = new Array((dEl0.scrollLeft||dEl1.scrollLeft),(dEl0.scrollTop||dEl1.scrollTop));
if (_isIE){
	var x= ev.clientX+corrector[0];
	var y = ev.clientY+corrector[1];
} else {
	var x= ev.pageX;
	var y = ev.pageY;
}
					this._ctmndx.showContextMenu(x-1,y-1)
					this.contextID=this._ctmndx.contextMenuZoneId=el.parentNode.idd+"_"+el._cellIndex;
					this._ctmndx._skip_hide=true;
				} else {
					el.contextMenuId=el.parentNode.idd+"_"+el._cellIndex;
					el.contextMenu=this._ctmndx;
					el.a=this._ctmndx._contextStart;
					el.a(el, ev);
					el.a=null;
				}
				ev.cancelBubble=true;
				return false;
			}
		}

		else if (this._ctmndx){
			if (this._ctmndx.hideContextMenu)
				this._ctmndx.hideContextMenu()
			else
				this._ctmndx._contextEnd();
		}
		return true;
	}
//#}
	/**
	*    @desc: occures on cell click (supports treegrid)
	*   @param: [el] - cell to click on
	*   @param:   [fl] - true if to call onRowSelect function
	*   @param: [selMethod] - 0 - simple click, 1 - shift, 2 - ctrl
	*   @param: show - true/false - scroll row to view, true by defaul    
	*   @type: private
	*   @topic: 1,2,4,9
	*/
	this.doClick=function(el, fl, selMethod, show){
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
					el.parentNode.idd,
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
	}

	/**
	*   @desc: select all rows in grid, it doesn't fire any events
	*   @param: edit - switch selected cell to edit mode
	*   @type: public
	*   @topic: 1,4
	*/
	this.selectAll=function(){
		this.clearSelection();

		var coll = this.rowsBuffer;
		//in paging mode, we select only current page
		if (this.pagingOn) coll = this.rowsCol;
		for (var i = 0; i<coll.length; i ++){
			this.render_row(i).className+=" rowselected";
		}
		
		this.selectedRows=dhtmlxArray([].concat(coll));
		
		if (this.selectedRows.length){
			this.row  = this.selectedRows[0];
			this.cell = this.row.cells[0];
		}

		if ((this._fake)&&(!this._realfake))
			this._fake.selectAll();
	}
	/**
	*   @desc: set selection to specified row-cell
	*   @param: r - row object or row index
	*   @param: cInd - cell index
	*   @param: [fl] - true if to call onRowSelect function
	  *   @param: preserve - preserve previously selected rows true/false (false by default)
	  *   @param: edit - switch selected cell to edit mode
	*   @param: show - true/false - scroll row to view, true by defaul         
	*   @type: public
	*   @topic: 1,4
	*/
	this.selectCell=function(r, cInd, fl, preserve, edit, show){
		if (!fl)
			fl=false;

		if (typeof (r) != "object")
			r=this.render_row(r)
		if (!r || r==-1) return null;
//#__pro_feature:21092006{
//#colspan:20092006{
		if (r._childIndexes)
			var c = r.childNodes[r._childIndexes[cInd]];
		else
//#}
//#}
			var c = r.childNodes[cInd];

		if (!c)
			c=r.childNodes[0];
        if(!this.markedCells){
			if (preserve)
				this.doClick(c, fl, 3, show)
			else
				this.doClick(c, fl, 0, show)
		}
		else 
			this.doMark(c,preserve?2:0);

		if (edit)
			this.editCell();
	}
	/**
	*   @desc: moves specified cell to visible area (scrolls)
	*   @param: cell_obj - object of the cell to work with
	*   @param: onlyVScroll - allow only vertical positioning

	*   @type: private
	*   @topic: 2,4,7
	*/
	this.moveToVisible=function(cell_obj, onlyVScroll){
		if (this.pagingOn){
			var newPage=Math.floor(this.getRowIndex(cell_obj.parentNode.idd) / this.rowsBufferOutSize)+1;
			if (newPage!=this.currentPage)
			this.changePage(newPage);
		}

		try{
			if (cell_obj.offsetHeight){
				var distance = cell_obj.offsetLeft+cell_obj.offsetWidth+20;
	
				var scrollLeft = 0;
	
				if (distance > (this.objBox.offsetWidth+this.objBox.scrollLeft)){
					if (cell_obj.offsetLeft > this.objBox.scrollLeft)
						scrollLeft=cell_obj.offsetLeft-5
				} else if (cell_obj.offsetLeft < this.objBox.scrollLeft){
					distance-=cell_obj.offsetWidth*2/3;
					if (distance < this.objBox.scrollLeft)
						scrollLeft=cell_obj.offsetLeft-5
				}
	
				if ((scrollLeft)&&(!onlyVScroll))
					this.objBox.scrollLeft=scrollLeft;
			}

			
			if (!cell_obj.offsetHeight){
				var mask=this._realfake?this._fake.rowsAr[cell_obj.parentNode.idd]:cell_obj.parentNode;
				distance = this.rowsBuffer._dhx_find(mask)*this._srdh;
			}
			else
				distance = cell_obj.offsetTop;
			var distancemax = distance + cell_obj.offsetHeight+38;

			if (distancemax > (this.objBox.offsetHeight+this.objBox.scrollTop)){
				var scrollTop = distancemax-this.objBox.offsetHeight;
			} else if (distance < this.objBox.scrollTop){
				var scrollTop = distance-5
			}

			if (scrollTop)
				this.objBox.scrollTop=scrollTop;
		}
		catch (er){}
	}
	/**
	*   @desc: creates Editor object and switch cell to edit mode if allowed
	*   @type: public
	*   @topic: 4
	*/
	this.editCell=function(){
		if (this.editor&&this.cell == this.editor.cell)
			return; //prevent reinit for same cell

		this.editStop();

		if ((this.isEditable != true)||(!this.cell))
			return false;
		var c = this.cell;

//#locked_row:11052006{
		if (c.parentNode._locked)
			return false;
//#}

		this.editor=this.cells4(c);

		//initialize editor
		if (this.editor != null){
			if (this.editor.isDisabled()){
				this.editor=null;
				return false;
			}

			if (this.callEvent("onEditCell", [
				0,
				this.row.idd,
				this.cell._cellIndex
			]) != false&&this.editor.edit){
				this._Opera_stop=(new Date).valueOf();
				c.className+=" editable";
				this.editor.edit();
				this.callEvent("onEditCell", [
					1,
					this.row.idd,
					this.cell._cellIndex
				])
			} else { //preserve editing
				this.editor=null;
			}
		}
	}
	/**
	*   @desc: retuns value from editor(if presents) to cell and closes editor
	*   @mode: if true - current edit value will be reverted to previous one
	*   @type: public
	*   @topic: 4
	*/
	this.editStop=function(mode){
		if (_isOpera)
			if (this._Opera_stop){
				if ((this._Opera_stop*1+50) > (new Date).valueOf())
					return;

				this._Opera_stop=null;
			}

		if (this.editor&&this.editor != null){
			this.editor.cell.className=this.editor.cell.className.replace("editable", "");

			if (mode){
				var t = this.editor.val;
				this.editor.detach();
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
	}
	/**
	*	@desc: 
	*	@type: private
	*/
	this._nextRowCell=function(row, dir, pos){
		row=this._nextRow((this._groups?this.rowsCol:this.rowsBuffer)._dhx_find(row), dir);

		if (!row)
			return null;

		return row.childNodes[row._childIndexes ? row._childIndexes[pos] : pos];
	}
	/**
	*	@desc: 
	*	@type: private
	*/
	this._getNextCell=function(acell, dir, i){

		acell=acell||this.cell;

		var arow = acell.parentNode;

		if (this._tabOrder){
			i=this._tabOrder[acell._cellIndex];

			if (typeof i != "undefined")
				if (i < 0)
					acell=this._nextRowCell(arow, dir, Math.abs(i)-1);
				else
					acell=arow.childNodes[i];
		} else {
			var i = acell._cellIndex+dir;

			if (i >= 0&&i < this._cCount){
				if (arow._childIndexes)
					i=arow._childIndexes[acell._cellIndex]+dir;
				acell=arow.childNodes[i];
			} else {

				acell=this._nextRowCell(arow, dir, (dir == 1 ? 0 : (this._cCount-1)));
			}
		}

		if (!acell){
			if ((dir == 1)&&this.tabEnd){
				this.tabEnd.focus();
				this.tabEnd.focus();
				this.setActive(false);
			}

			if ((dir == -1)&&this.tabStart){
				this.tabStart.focus();
				this.tabStart.focus();
				this.setActive(false);
			}
			return null;
		}

		//tab out

		// tab readonly
		if (acell.style.display != "none"
			&&(!this.smartTabOrder||!this.cells(acell.parentNode.idd, acell._cellIndex).isDisabled()))
			return acell;
		return this._getNextCell(acell, dir);
	// tab readonly

	}
	/**
	*	@desc: 
	*	@type: private
	*/
	this._nextRow=function(ind, dir){
		var r = this.render_row(ind+dir);
		if (!r || r==-1) return null;
		if (r&&r.style.display == "none")
			return this._nextRow(ind+dir, dir);

		return r;
	}
	/**
	*	@desc: 
	*	@type: private
	*/
	this.scrollPage=function(dir){ 
		if (!this.rowsBuffer.length) return;
		var master = this._realfake?this._fake:this;
		var new_ind = Math.floor((master._r_select||this.getRowIndex(this.row.idd)||0)+(dir)*this.objBox.offsetHeight / (this._srdh||20));

		if (new_ind < 0)
			new_ind=0;
		if (new_ind >= this.rowsBuffer.length)
			new_ind=this.rowsBuffer.length-1;

		if (this._srnd && !this.rowsBuffer[new_ind]){			
			this.objBox.scrollTop+=Math.floor((dir)*this.objBox.offsetHeight / (this._srdh||20))*(this._srdh||20);
			if (this._fake) this._fake.objBox.scrollTop = this.objBox.scrollTop;
			master._r_select=new_ind;
		} else {
			this.selectCell(new_ind, this.cell._cellIndex, true, false,false,(this.multiLine || this._srnd));
			if (!this.multiLine && !this._srnd && !this._realfake){
				this.objBox.scrollTop=this.getRowById(this.getRowId(new_ind)).offsetTop;
				if (this._fake) this._fake.objBox.scrollTop = this.objBox.scrollTop;
			}
			master._r_select=null;
		}
	}

	/**
	*   @desc: manages keybord activity in grid
	*   @type: private
	*   @topic: 7
	*/
	this.doKey=function(ev){
		if (!ev)
			return true;

		if ((ev.target||ev.srcElement).value !== window.undefined){
			var zx = (ev.target||ev.srcElement);

			if ((!zx.parentNode)||(zx.parentNode.className.indexOf("editable") == -1))
				return true;
		}

		if ((globalActiveDHTMLGridObject)&&(this != globalActiveDHTMLGridObject))
			return globalActiveDHTMLGridObject.doKey(ev);

		if (this.isActive == false){
			//document.body.onkeydown = "";
			return true;
		}

		if (this._htkebl)
			return true;

		if (!this.callEvent("onKeyPress", [
			ev.keyCode,
			ev.ctrlKey || ev.metaKey,
			ev.shiftKey,
			ev
		]))
			return false;

		var code = "k"+ev.keyCode+"_"+(ev.ctrlKey || ev.metaKey ? 1 : 0)+"_"+(ev.shiftKey ? 1 : 0);

		if (this.cell){ //if selection exists in grid only
			if (this._key_events[code]){
				if (false === this._key_events[code].call(this))
					return true;

				if (ev.preventDefault)
					ev.preventDefault();
				ev.cancelBubble=true;
				return false;
			}

			if (this._key_events["k_other"])
				this._key_events.k_other.call(this, ev);
		}

		return true;
	}
	
	/**
	*   @desc: selects row (and first cell of it)
	*   @param: r - row index or row object
	*   @param: fl - if true, then call function on select
	*   @param: preserve - preserve previously selected rows true/false (false by default)
	*   @param: show - true/false - scroll row to view, true by defaul    
	*   @type: public
	*   @topic: 1,2
	*/
	this.selectRow=function(r, fl, preserve, show){
		if (typeof (r) != 'object')
			r=this.render_row(r);
		this.selectCell(r, 0, fl, preserve, false, show)
	};

	/**
	*   @desc: called when row was double clicked
	*   @type: private
	*   @topic: 1,2
	*/
	this.wasDblClicked=function(ev){
		var el = this.getFirstParentOfType(_isIE ? ev.srcElement : ev.target, "TD");

		if (el){
			var rowId = el.parentNode.idd;
			return this.callEvent("onRowDblClicked", [
				rowId,
				el._cellIndex
			]);
		}
	}

	/**
	*   @desc: called when header was clicked
	*   @type: private
	*   @topic: 1,2
	*/
	this._onHeaderClick=function(e, el){
		var that = this.grid;
		el=el||that.getFirstParentOfType(_isIE ? event.srcElement : e.target, "TD");

		if (this.grid.resized == null){
			if (!(this.grid.callEvent("onHeaderClick", [
				el._cellIndexS,
				(e||window.event)
			])))
				return false;
//#sorting:06042008{				
			that.sortField(el._cellIndexS, false, el)
//#}
		}
		this.grid.resized = null;
	}

	/**
	*   @desc: deletes selected row(s)
	*   @type: public
	*   @topic: 2
	*/
	this.deleteSelectedRows=function(){
		var num = this.selectedRows.length //this.obj.rows.length

		if (num == 0)
			return;

		var tmpAr = this.selectedRows;
		this.selectedRows=dhtmlxArray()
		for (var i = num-1; i >= 0; i--){
			var node = tmpAr[i]

			if (!this.deleteRow(node.idd, node)){
				this.selectedRows[this.selectedRows.length]=node;
			}
			else {
				if (node == this.row){
					var ind = i;
				}
			}
/*
						   this.rowsAr[node.idd] = null;
						   var posInCol = this.rowsCol._dhx_find(node)
						   this.rowsCol[posInCol].parentNode.removeChild(this.rowsCol[posInCol]);//nb:this.rowsCol[posInCol].removeNode(true);
						   this.rowsCol._dhx_removeAt(posInCol)*/
		}

		if (ind){
			try{
				if (ind+1 > this.rowsCol.length) //this.obj.rows.length)
					ind--;
				this.selectCell(ind, 0, true)
			}
			catch (er){
				this.row=null
				this.cell=null
			}
		}
	}

	/**
	*   @desc: gets selected row id
	*   @returns: id of selected row (list of ids with default delimiter) or null if non row selected
	*   @type: public
	*   @topic: 1,2,9
	*/
	this.getSelectedRowId=function(){
		var selAr = new Array(0);
		var uni = {
		};

		for (var i = 0; i < this.selectedRows.length; i++){
			var id = this.selectedRows[i].idd;

			if (uni[id])
				continue;

			selAr[selAr.length]=id;
			uni[id]=true;
		}

		//..
		if (selAr.length == 0)
			return null;
		else
			return selAr.join(this.delim);
	}
	
	/**
	*   @desc: gets index of selected cell
	*   @returns: index of selected cell or -1 if there is no selected sell
	*   @type: public
	*   @topic: 1,4
	*/
	this.getSelectedCellIndex=function(){
		if (this.cell != null)
			return this.cell._cellIndex;
		else
			return -1;
	}
	/**
	*   @desc: gets width of specified column in pixels
	*   @param: ind - column index
	*   @returns: column width in pixels
	*   @type: public
	*   @topic: 3,7
	*/
	this.getColWidth=function(ind){
		return parseInt(this.cellWidthPX[ind]);
	}

	/**
	*   @desc: sets width of specified column in pixels (soen't works with procent based grid)
	*   @param: ind - column index
	*   @param: value - new width value
	*   @type: public
	*   @topic: 3,7
	*/
	this.setColWidth=function(ind, value){
		if (value == "*")
			this.initCellWidth[ind] = "*";
		else {
			if (this._hrrar[ind]) return; //hidden
			if (this.cellWidthType == 'px')
				this.cellWidthPX[ind]=parseInt(value);
			else
				this.cellWidthPC[ind]=parseInt(value);
		}
		this.setSizes();
	}
	/**
	*   @desc: gets row index by id (grid only)
	*   @param: row_id - row id
	*   @returns: row index or -1 if there is no row with specified id
	*   @type: public
	*   @topic: 2
	*/
	this.getRowIndex=function(row_id){
		for (var i = 0; i < this.rowsBuffer.length; i++)
			if (this.rowsBuffer[i]&&this.rowsBuffer[i].idd == row_id)
				return i;
		return -1;
	}
	/**
	*   @desc: gets row id by index
	*   @param: ind - row index
	*   @returns: row id or null if there is no row with specified index
	*   @type: public
	*   @topic: 2
	*/
	this.getRowId=function(ind){
		return this.rowsBuffer[ind] ? this.rowsBuffer[ind].idd : this.undefined;
	}
	/**
	*   @desc: sets new id for row by its index
	*   @param: ind - row index
	*   @param: row_id - new row id
	*   @type: public
	*   @topic: 2
	*/
	this.setRowId=function(ind, row_id){
		this.changeRowId(this.getRowId(ind), row_id)
	}
	/**
	*   @desc: changes id of the row to the new one
	*   @param: oldRowId - row id to change
	*   @param: newRowId - row id to set
	*   @type:public
	*   @topic: 2
	*/
	this.changeRowId=function(oldRowId, newRowId){
		if (oldRowId == newRowId)
			return;
		/*
						  for (var i=0; i<row.childNodes.length; i++)
							  if (row.childNodes[i]._code)
								  this._compileSCL("-",row.childNodes[i]);      */
		var row = this.rowsAr[oldRowId]
		row.idd=newRowId;

		if (this.UserData[oldRowId]){
			this.UserData[newRowId]=this.UserData[oldRowId]
			this.UserData[oldRowId]=null;
		}

		if (this._h2&&this._h2.get[oldRowId]){
			this._h2.get[newRowId]=this._h2.get[oldRowId];
			this._h2.get[newRowId].id=newRowId;
			delete this._h2.get[oldRowId];
		}

		this.rowsAr[oldRowId]=null;
		this.rowsAr[newRowId]=row;

		for (var i = 0; i < row.childNodes.length; i++)
			if (row.childNodes[i]._code)
				row.childNodes[i]._code=this._compileSCL(row.childNodes[i]._val, row.childNodes[i]);
				
		if (this._mat_links && this._mat_links[oldRowId]){
			var a=this._mat_links[oldRowId];
			delete this._mat_links[oldRowId];
			for (var c in a)
				for (var i=0; i < a[c].length; i++)
					this._compileSCL(a[c][i].original,a[c][i]);
		}
				
		this.callEvent("onRowIdChange",[oldRowId,newRowId]);
	}
	/**
	*   @desc: sets ids to every column. Can be used then to retreive the index of the desired colum
	*   @param: [ids] - delimitered list of ids (default delimiter is ","), or empty if to use values set earlier
	*   @type: public
	*   @topic: 3
	*/
	this.setColumnIds=function(ids){
		this.columnIds=ids.split(this.delim)
	}
	/**
	*   @desc: sets ids to specified column.
	*   @param: ind- index of column
	*   @param: id- id of column
	*   @type: public
	*   @topic: 3
	*/
	this.setColumnId=function(ind, id){
		this.columnIds[ind]=id;
	}
	/**
	*   @desc: gets column index by column id
	*   @param: id - column id
	*   @returns: index of the column
	*   @type: public
	*   @topic: 3
	*/
	this.getColIndexById=function(id){
		for (var i = 0; i < this.columnIds.length; i++)
			if (this.columnIds[i] == id)
				return i;
	}
	/**
	*   @desc: gets column id of column specified by index
	*   @param: cin - column index
	*   @returns: column id
	*   @type: public
	*   @topic: 3
	*/
	this.getColumnId=function(cin){
		return this.columnIds[cin];
	}
	
	/**
	*   @desc: gets label of column specified by index
	*   @param: cin - column index
	*   @returns: column label
	*   @type: public
	*   @topic: 3
	*/
	this.getColumnLabel=function(cin, ind, hdr){
		var z = (hdr||this.hdr).rows[(ind||0)+1];
		for (var i=0; i<z.cells.length; i++)
			if (z.cells[i]._cellIndexS==cin) return (_isIE ? z.cells[i].innerText : z.cells[i].textContent);
		return "";
	};
	this.getColLabel = this.getColumnLabel;
	/**
	*   @desc: gets label of footer specified by index
	*   @param: cin - column index
	*   @returns: column label
	*   @type: public
	*   @topic: 3
	*/
	this.getFooterLabel=function(cin, ind){
		return this.getColumnLabel(cin,ind,this.ftr);
	}	
	

	/**
	*   @desc: sets row text BOLD
	*   @param: row_id - row id
	*   @type: public
	*   @topic: 2,6
	*/
	this.setRowTextBold=function(row_id){
		var r=this.getRowById(row_id)
		if (r) r.style.fontWeight="bold";
	}
	/**
	*   @desc: sets style to row
	*   @param: row_id - row id
	*   @param: styleString - style string in common format (exmpl: "color:red;border:1px solid gray;")
	*   @type: public
	*   @topic: 2,6
	*/
	this.setRowTextStyle=function(row_id, styleString){
		var r = this.getRowById(row_id)
		if (!r) return;
		for (var i = 0; i < r.childNodes.length; i++){
			var pfix = r.childNodes[i]._attrs["style"]||"";
//#__pro_feature:21092006{
//#column_hidden:21092006{
	if ((this._hrrar)&&(this._hrrar[i]))
		pfix="display:none;";
//#}
//#}
			if (_isIE)
				r.childNodes[i].style.cssText=pfix+"width:"+r.childNodes[i].style.width+";"+styleString;
			else
				r.childNodes[i].style.cssText=pfix+"width:"+r.childNodes[i].style.width+";"+styleString;
		}
	}
	/**
	*   @desc: sets background color of row (via bgcolor attribute)
	*   @param: row_id - row id
	*   @param: color - color value
	*   @type: public
	*   @topic: 2,6
	*/
	this.setRowColor=function(row_id, color){
		var r = this.getRowById(row_id)

		for (var i = 0; i < r.childNodes.length; i++)r.childNodes[i].bgColor=color;
	}
	/**
	*   @desc: sets style to cell
	*   @param: row_id - row id
	*   @param: ind - cell index
	*   @param: styleString - style string in common format (exmpl: "color:red;border:1px solid gray;")
	*   @type: public
	*   @topic: 2,6
	*/
	this.setCellTextStyle=function(row_id, ind, styleString){
		var r = this.getRowById(row_id)

		if (!r)
			return;

		var cell = r.childNodes[r._childIndexes ? r._childIndexes[ind] : ind];

		if (!cell)
			return;
		var pfix = "";
//#__pro_feature:21092006{
//#column_hidden:21092006{
		if ((this._hrrar)&&(this._hrrar[ind]))
			pfix="display:none;";
//#}
//#}
		if (_isIE)
			cell.style.cssText=pfix+"width:"+cell.style.width+";"+styleString;
		else
			cell.style.cssText=pfix+"width:"+cell.style.width+";"+styleString;
	}

	/**
	*   @desc: sets row text weight to normal
	*   @param: row_id - row id
	*   @type: public
	*   @topic: 2,6
	*/
	this.setRowTextNormal=function(row_id){
		var r=this.getRowById(row_id);
		if (r) r.style.fontWeight="normal";
	}
	/**
	*   @desc: determines if row with specified id exists
	*   @param: row_id - row id
	*   @returns: true if exists, false otherwise
	*   @type: public
	*   @topic: 2,7
	*/
	this.doesRowExist=function(row_id){
		if (this.getRowById(row_id) != null)
			return true
		else
			return false
	}
	


	/**
	*   @desc: gets number of columns in grid
	*   @returns: number of columns in grid
	*   @type: public
	*   @topic: 3,7
	*/
	this.getColumnsNum=function(){
		return this._cCount;
	}
	
	
//#moving_rows:06042008{
	/**
	*   @desc: moves row one position up if possible
	*   @param: row_id -  row id
	*   @type: public
	*   @topic: 2
	*/
	this.moveRowUp=function(row_id){
		var r = this.getRowById(row_id)

		if (this.isTreeGrid())
			return this.moveRowUDTG(row_id, -1);

		var rInd = this.rowsCol._dhx_find(r)
		if ((r.previousSibling)&&(rInd != 0)){
			r.parentNode.insertBefore(r, r.previousSibling)
			this.rowsCol._dhx_swapItems(rInd, rInd-1)
			this.setSizes();
			var bInd=this.rowsBuffer._dhx_find(r);
			this.rowsBuffer._dhx_swapItems(bInd,bInd-1);

			if (this._cssEven)
				this._fixAlterCss(rInd-1);
		}
	}
	/**
	*   @desc: moves row one position down if possible
	*   @param: row_id -  row id
	*   @type: public
	*   @topic: 2
	*/
	this.moveRowDown=function(row_id){
		var r = this.getRowById(row_id)

		if (this.isTreeGrid())
			return this.moveRowUDTG(row_id, 1);

		var rInd = this.rowsCol._dhx_find(r);
		if (r.nextSibling){ 
			this.rowsCol._dhx_swapItems(rInd, rInd+1)

			if (r.nextSibling.nextSibling)
				r.parentNode.insertBefore(r, r.nextSibling.nextSibling)
			else
				r.parentNode.appendChild(r)
			this.setSizes();
			
			var bInd=this.rowsBuffer._dhx_find(r);
			this.rowsBuffer._dhx_swapItems(bInd,bInd+1);

			if (this._cssEven)
				this._fixAlterCss(rInd);
		}
	}
//#}
//#co_excell:06042008{
	/**
	* @desc: gets Combo object of specified column. Use it to change select box value for cell before editor opened
	*   @type: public
	*   @topic: 3,4
	*   @param: col_ind - index of the column to get combo object for
	*/
	this.getCombo=function(col_ind){
		if (!this.combos[col_ind]){
			this.combos[col_ind]=new dhtmlXGridComboObject();
		}
		return this.combos[col_ind];
	}
//#}
	/**
	*   @desc: sets user data to row
	*   @param: row_id -  row id. if empty then user data is set for grid (not row)
	*   @param: name -  name of user data block
	*   @param: value -  value of user data block
	*   @type: public
	*   @topic: 2,5
	*/
	this.setUserData=function(row_id, name, value){
		if (!row_id)
			row_id="gridglobaluserdata";

		if (!this.UserData[row_id])
			this.UserData[row_id]=new Hashtable()
		this.UserData[row_id].put(name, value)
	}
	/**
	*   @desc: gets user Data
	*   @param: row_id -  row id. if empty then user data is for grid (not row)
	*   @param: name -  name of user data
	*   @returns: value of user data
	*   @type: public
	*   @topic: 2,5
	*/
	this.getUserData=function(row_id, name){
		if (!row_id)
			row_id="gridglobaluserdata";		
		this.getRowById(row_id); //parse row if necessary
		
		var z = this.UserData[row_id];
		return (z ? z.get(name) : "");
	}

	/**
	*   @desc: manage editibility of the grid
	*   @param: [fl] - set not editable if FALSE, set editable otherwise
	*   @type: public
	*   @topic: 7
	*/
	this.setEditable=function(fl){
		this.isEditable=convertStringToBoolean(fl);
	}
	/**
	*   @desc: selects row by ID
	*   @param: row_id - row id
	*   @param: multiFL - VOID. select multiple rows
	*   @param: show - true/false - scroll row to view, true by defaul    
	*   @param: call - true to call function on select
	*   @type: public
	*   @topic: 1,2
	*/
	this.selectRowById=function(row_id, multiFL, show, call){
		if (!call)
			call=false;
		this.selectCell(this.getRowById(row_id), 0, call, multiFL, false, show);
	}
	
	/**
	*   @desc: removes selection from the grid
	*   @type: public
	*   @topic: 1,9
	*/
	this.clearSelection=function(){
		this.editStop()

		for (var i = 0; i < this.selectedRows.length; i++){
			var r = this.rowsAr[this.selectedRows[i].idd];

			if (r)
				r.className=r.className.replace(/rowselected/g, "");
		}

		//..
		this.selectedRows=dhtmlxArray()
		this.row=null;

		if (this.cell != null){
			this.cell.className=this.cell.className.replace(/cellselected/g, "");
			this.cell=null;
		}
		
		this.callEvent("onSelectionCleared",[]);
	}
	/**
	*   @desc: copies row content to another existing row
	*   @param: from_row_id - id of the row to copy content from
	*   @param: to_row_id - id of the row to copy content to
	*   @type: public
	*   @topic: 2,5
	*/
	this.copyRowContent=function(from_row_id, to_row_id){
		var frRow = this.getRowById(from_row_id)

		if (!this.isTreeGrid())
			for (var i = 0; i < frRow.cells.length; i++){
				this.cells(to_row_id, i).setValue(this.cells(from_row_id, i).getValue())
			}
		else
			this._copyTreeGridRowContent(frRow, from_row_id, to_row_id);

		//for Mozilla (to avaoid visual glitches)
		if (!_isIE)
			this.getRowById(from_row_id).cells[0].height=frRow.cells[0].offsetHeight
	}
	/**
	*   @desc: sets new label for cell in footer
	*   @param: col - header column index
	*   @param: label - new label for the cpecified footer's column. Can contai img:[imageUrl]Text Label
	*	@param: ind - header row index 
	*   @type: public
	*   @topic: 3,6
	*/
	this.setFooterLabel=function(c, label, ind){
		return this.setColumnLabel(c,label,ind,this.ftr);
	};
	/**
	*   @desc: sets new column header label
	*   @param: col - header column index
	*   @param: label - new label for the cpecified header's column. Can contai img:[imageUrl]Text Label
	*	@param: ind - header row index 
	*   @type: public
	*   @topic: 3,6
	*/
	this.setColumnLabel=function(c, label, ind, hdr){
		var z = (hdr||this.hdr).rows[ind||1];
		var col = (z._childIndexes ? z._childIndexes[c] : c);
		if (!z.cells[col]) return;
		if (!this.useImagesInHeader){
			var hdrHTML = "<div class='hdrcell'>"

			if (label.indexOf('img:[') != -1){
				var imUrl = label.replace(/.*\[([^>]+)\].*/, "$1");
				label=label.substr(label.indexOf("]")+1, label.length)
				hdrHTML+="<img width='18px' height='18px' align='absmiddle' src='"+imUrl+"' hspace='2'>"
			}
			hdrHTML+=label;
			hdrHTML+="</div>";
			z.cells[col].innerHTML=hdrHTML;

			if (this._hstyles[col])
				z.cells[col].style.cssText=this._hstyles[col];
		} else { //if images in header header
			z.cells[col].style.textAlign="left";
			z.cells[col].innerHTML="<img src='"+this.imgURL+""+label+"' onerror='this.src = \""+this.imgURL
				+"imageloaderror.gif\"'>";
			//preload sorting headers (asc/desc)
			var a = new Image();
			a.src=this.imgURL+""+label.replace(/(\.[a-z]+)/, ".des$1");
			this.preloadImagesAr[this.preloadImagesAr.length]=a;
			var b = new Image();
			b.src=this.imgURL+""+label.replace(/(\.[a-z]+)/, ".asc$1");
			this.preloadImagesAr[this.preloadImagesAr.length]=b;
		}

		if ((label||"").indexOf("#") != -1){
			var t = label.match(/(^|{)#([^}]+)(}|$)/);

			if (t){
				var tn = "_in_header_"+t[2];

				if (this[tn])
					this[tn]((this.forceDivInHeader ? z.cells[col].firstChild : z.cells[col]), col, label.split(t[0]));
			}
		}
	};
	this.setColLabel = function(a,b,ind,c){
		return this.setColumnLabel(a,b,(ind||0)+1,c);
	};
	/**
	*   @desc: deletes all rows in grid
	*   @param: header - (boolean) enable/disable cleaning header
	*   @type: public
	*   @topic: 5,7,9
	*/
	this.clearAll=function(header){
	    if (!this.obj.rows[0]) return; //call before initilization
		if (this._h2){
			this._h2=new dhtmlxHierarchy();

			if (this._fake){
				if (this._realfake)
					this._h2=this._fake._h2;
				else
					this._fake._h2=this._h2;
			}
		}

		this.limit=this._limitC=0;
		this.editStop(true);

		if (this._dLoadTimer)
			window.clearTimeout(this._dLoadTimer);

		if (this._dload){
			this.objBox.scrollTop=0;
			this.limit=this._limitC||0;
			this._initDrF=true;
		}

		var len = this.rowsCol.length;

		//for some case
		len=this.obj.rows.length;

		for (var i = len-1; i > 0; i--){
			var t_r = this.obj.rows[i];
			t_r.parentNode.removeChild(t_r);
		}

		if (header){
			this._master_row=null;
			this.obj.rows[0].parentNode.removeChild(this.obj.rows[0]);

			for (var i = this.hdr.rows.length-1; i >= 0; i--){
				var t_r = this.hdr.rows[i];
				t_r.parentNode.removeChild(t_r);
			}

			if (this.ftr){
				this.ftr.parentNode.removeChild(this.ftr);
				this.ftr=null;
			}
			this._aHead=this.ftr=this.cellWidth=this._aFoot=null;
			this.cellType=dhtmlxArray();
			this._hrrar=[];
			this.columnIds=[];
			this.combos=[];
			this._ivizcol = null;
		}

		//..
		this.row=null;
		this.cell=null;

		this.rowsCol=dhtmlxArray()
		this.rowsAr={}; //array of rows by idd
		this._RaSeCol=[];
		this.rowsBuffer=dhtmlxArray()
		this.UserData=[]
		this.selectedRows=dhtmlxArray();

		if (this.pagingOn || this._srnd)
			this.xmlFileUrl="";
		if (this.pagingOn)
			this.changePage(1);
		
		//  if (!this._fake){
		/*
		   if ((this._hideShowColumn)&&(this.hdr.rows[0]))
			  for (var i=0; i<this.hdr.rows[0].cells.length; i++)
				  this._hideShowColumn(i,"");
	   this._hrrar=new Array();*/
		//}
		if (this._contextCallTimer)
			window.clearTimeout(this._contextCallTimer);

		if (this._sst)
			this.enableStableSorting(true);
		this._fillers=this.undefined;
		this.setSortImgState(false);
		this.setSizes();
		//this.obj.scrollTop = 0;

		this.callEvent("onClearAll", []);
	}

//#sorting:06042008{
	/**
	*   @desc: sorts grid by specified field
	*    @invoke: header click
	*   @param: [ind] - index of the field
	*   @param: [repeatFl] - if to repeat last sorting
	*   @type: private
	*   @topic: 3
	*/
	this.sortField=function(ind, repeatFl, r_el){
		if (this.getRowsNum() == 0)
			return false;

		var el = this.hdr.rows[0].cells[ind];

		if (!el)
			return; //somehow
		// if (this._dload  && !this.callEvent("onBeforeSorting",[ind,this]) ) return true;

		if (el.tagName == "TH"&&(this.fldSort.length-1) >= el._cellIndex
			&&this.fldSort[el._cellIndex] != 'na'){ //this.entBox.fieldstosort!="" &&
			var data=this.getSortingState();
			var sortType= ( data[0]==ind && data[1]=="asc" ) ? "des" : "asc";

			if (!this.callEvent("onBeforeSorting", [
				ind,
				this.fldSort[ind],
				sortType
			]))
				return;
			this.sortImg.src=this.imgURL+"sort_"+(sortType == "asc" ? "asc" : "desc")+".gif";

			//for header images
			if (this.useImagesInHeader){
				var cel = this.hdr.rows[1].cells[el._cellIndex].firstChild;

				if (this.fldSorted != null){
					var celT = this.hdr.rows[1].cells[this.fldSorted._cellIndex].firstChild;
					celT.src=celT.src.replace(/(\.asc\.)|(\.des\.)/, ".");
				}
				cel.src=cel.src.replace(/(\.[a-z]+)$/, "."+sortType+"$1")
			}
			//.
			this.sortRows(el._cellIndex, this.fldSort[el._cellIndex], sortType)
			this.fldSorted=el;
			this.r_fldSorted=r_el;
			var c = this.hdr.rows[1];
			var c = r_el.parentNode;
			var real_el = c._childIndexes ? c._childIndexes[el._cellIndex] : el._cellIndex;
			this.setSortImgPos(false, false, false, r_el);
		}
	}
//#__pro_feature:21092006{
//#custom_sort:21092006{
	/**
	*   @desc: set custom sorting (custom sort has three params - valueA,valueB,order; where order can be asc or des)
	*   @param: func - function to use for comparison
	*   @param:   col - index of column to apply custom sorting to
	*   @type: public
	*   @edition: Professional
	*   @topic: 3
	*/
	this.setCustomSorting=function(func, col){
		if (!this._customSorts)
			this._customSorts=new Array();
		this._customSorts[col]=( typeof (func) == "string") ? eval(func) : func;
		this.fldSort[col]="cus";
	}
//#}
//#}
//#}
	/**
	*   @desc: specify if values passed to Header are images file names
	*   @param: fl - true to treat column header values as image names
	*   @type: public
	*   @before_init: 1
	*   @topic: 0,3
	*/
	this.enableHeaderImages=function(fl){
		this.useImagesInHeader=fl;
	}

	/**
	*   @desc: set header label and default params for new headers
	*   @param: hdrStr - header string with delimiters
	*   @param: splitSign - string used as a split marker, optional. Default is "#cspan"
	*   @param: styles - array of header styles
	*   @type: public
	*   @before_init: 1
	*   @topic: 0,3
	*/
	this.setHeader=function(hdrStr, splitSign, styles){
		if (typeof (hdrStr) != "object")
			var arLab = this._eSplit(hdrStr);
		else
			arLab=[].concat(hdrStr);

		var arWdth = new Array(0);
		var arTyp = new dhtmlxArray(0);
		var arAlg = new Array(0);
		var arVAlg = new Array(0);
		var arSrt = new Array(0);

		for (var i = 0; i < arLab.length; i++){
			arWdth[arWdth.length]=Math.round(100 / arLab.length);
			arTyp[arTyp.length]="ed";
			arAlg[arAlg.length]="left";
			arVAlg[arVAlg.length]="middle"; //top
			arSrt[arSrt.length]="na";
		}

		this.splitSign=splitSign||"#cspan";
		this.hdrLabels=arLab;
		this.cellWidth=arWdth;
		if (!this.initCellWidth.length) this.setInitWidthsP(arWdth.join(this.delim),true);
		this.cellType=arTyp;
		this.cellAlign=arAlg;
		this.cellVAlign=arVAlg;
		this.fldSort=arSrt;
		this._hstyles=styles||[];
	}
	/**
   *   @desc: 
   *   @param: str - ...
   *   @type: private
   */
	this._eSplit=function(str){
		if (![].push)
			return str.split(this.delim);

		var a = "r"+(new Date()).valueOf();
		var z = this.delim.replace(/([\|\+\*\^])/g, "\\$1")
		return (str||"").replace(RegExp(z, "g"), a).replace(RegExp("\\\\"+a, "g"), this.delim).split(a);
	}

	/**
	*   @desc: get column type by column index
	*   @param: cInd - column index
	*   @returns:  type code
	*   @type: public
	*   @topic: 0,3,4
	*/
	this.getColType=function(cInd){
		return this.cellType[cInd];
	}

	/**
	*   @desc: get column type by column ID
	*   @param: cID - column id
	*   @returns:  type code
	*   @type: public
	*   @topic: 0,3,4
	*/
	this.getColTypeById=function(cID){
		return this.cellType[this.getColIndexById(cID)];
	}

	/**
	*   @desc: set column types
	*   @param: typeStr - type codes list (default delimiter is ",")
	*   @before_init: 2
	*   @type: public
	*   @topic: 0,3,4
	*/
	this.setColTypes=function(typeStr){
		this.cellType=dhtmlxArray(typeStr.split(this.delim));
		this._strangeParams=new Array();

		for (var i = 0; i < this.cellType.length; i++){
			if ((this.cellType[i].indexOf("[") != -1)){
				var z = this.cellType[i].split(/[\[\]]+/g);
				this.cellType[i]=z[0];
				this.defVal[i]=z[1];

				if (z[1].indexOf("=") == 0){
					this.cellType[i]="math";
					this._strangeParams[i]=z[0];
				}
			}
			if (!window["eXcell_"+this.cellType[i]]) dhtmlxError.throwError("Configuration","Incorrect cell type: "+this.cellType[i],[this,this.cellType[i]]);
		}
	}
	/**
	*   @desc: set column sort types (avaialble: str, int, date, na or function object for custom sorting)
	*   @param: sortStr - sort codes list with default delimiter
	*   @before_init: 1
	*   @type: public
	*   @topic: 0,3,4
	*/
	this.setColSorting=function(sortStr){
		this.fldSort=sortStr.split(this.delim)
//#__pro_feature:21092006{
//#custom_sort:21092006{
		for (var i = 0; i < this.fldSort.length; i++)
			if (((this.fldSort[i]).length > 4)&&( typeof (window[this.fldSort[i]]) == "function")){
				if (!this._customSorts)
					this._customSorts=new Array();
				this._customSorts[i]=window[this.fldSort[i]];
				this.fldSort[i]="cus";
			}
//#}
//#}
	}
	/**
	*   @desc: set align of values in columns
	*   @param: alStr - list of align values (possible values are: right,left,center,justify). Default delimiter is ","
	*   @before_init: 1
	*   @type: public
	*   @topic: 0,3
	*/
	this.setColAlign=function(alStr){
		this.cellAlign=alStr.split(this.delim)
		for (var i=0; i < this.cellAlign.length; i++)
			this.cellAlign[i]=this.cellAlign[i]._dhx_trim();
	}
/**
*   @desc: set vertical align of columns
*   @param: valStr - vertical align values list for columns (possible values are: baseline,sub,super,top,text-top,middle,bottom,text-bottom)
*   @before_init: 1
*   @type: public
*   @topic: 0,3
*/
	this.setColVAlign=function(valStr){
		this.cellVAlign=valStr.split(this.delim)
	}

/**
* 	@desc: create grid with no header. Call before initialization, but after setHeader. setHeader have to be called in any way as it defines number of columns
*   @param: fl - true to use no header in the grid
*   @type: public
*   @before_init: 1
*   @topic: 0,7
*/
	this.setNoHeader=function(fl){
			this.noHeader=convertStringToBoolean(fl);
	}
	/**
	*   @desc: scrolls row to the visible area
	*   @param: rowID - row id
	*   @type: public
	*   @topic: 2,7
	*/
	this.showRow=function(rowID){
		this.getRowById(rowID)

		if (this._h2) this.openItem(this._h2.get[rowID].parent.id);
		var c = this.getRowById(rowID).childNodes[0];

		while (c&&c.style.display == "none")
			c=c.nextSibling;

		if (c)
			this.moveToVisible(c, true)
	}

	/**
	*   @desc: modify default style of grid and its elements. Call before or after Init
	*   @param: ss_header - style def. expression for header
	*   @param: ss_grid - style def. expression for grid cells
	*   @param: ss_selCell - style def. expression for selected cell
	*   @param: ss_selRow - style def. expression for selected Row
	*   @type: public
	*   @before_init: 2
	*   @topic: 0,6
	*/
	this.setStyle=function(ss_header, ss_grid, ss_selCell, ss_selRow){
		this.ssModifier=[
			ss_header,
			ss_grid,
			ss_selCell,
			ss_selCell,
			ss_selRow
		];

		var prefs = ["#"+this.entBox.id+" table.hdr td", "#"+this.entBox.id+" table.obj td",
			"#"+this.entBox.id+" table.obj tr.rowselected td.cellselected",
			"#"+this.entBox.id+" table.obj td.cellselected", "#"+this.entBox.id+" table.obj tr.rowselected td"];

		var index = 0;
		while (!_isIE){
			try{
				var temp = document.styleSheets[index].cssRules.length;
			} catch(e) { index++; continue; }
			break;
		}
		
		for (var i = 0; i < prefs.length; i++)
			if (this.ssModifier[i]){
				if (_isIE)
					document.styleSheets[0].addRule(prefs[i], this.ssModifier[i]);
				else
					document.styleSheets[index].insertRule(prefs[i]+(" { "+this.ssModifier[i]+" }"), document.styleSheets[index].cssRules.length);
			}
	}
	/**
	*   @desc: colorize columns  background.
	*   @param: clr - colors list
	*   @type: public
	*   @before_init: 1
	*   @topic: 3,6
	*/
	this.setColumnColor=function(clr){
		this.columnColor=clr.split(this.delim)
	}
//#alter_css:06042008{
	/**
	*   @desc: set even/odd css styles
	*   @param: cssE - name of css class for even rows
	*   @param: cssU - name of css class for odd rows
	*   @param: perLevel - true/false - mark rows not by order, but by level in treegrid
	*   @param: levelUnique - true/false - creates additional unique css class based on row level
	*   @type: public
	*   @before_init: 1
	*   @topic: 3,6
	*/
	this.enableAlterCss=function(cssE, cssU, perLevel, levelUnique){
		if (cssE||cssU)
			this.attachEvent("onGridReconstructed",function(){
				this._fixAlterCss();
				if (this._fake)
					this._fake._fixAlterCss();
			});

		this._cssSP=perLevel;
		this._cssSU=levelUnique;
		this._cssEven=cssE;
		this._cssUnEven=cssU;
	}
//#}
	/**
	*   @desc: recolor grid from defined point
	*   @type: private
	*   @before_init: 1
	*   @topic: 3,6
	*/
	this._fixAlterCss=function(ind){
//#alter_css:06042008{		
		if (this._h2 && (this._cssSP || this._cssSU))
			return this._fixAlterCssTGR(ind);
		if (!this._cssEven && !this._cssUnEven) return;
		ind=ind||0;
		var j = ind;

		for (var i = ind; i < this.rowsCol.length; i++){
			if (!this.rowsCol[i])
				continue;

			if (this.rowsCol[i].style.display != "none"){
				if (this.rowsCol[i]._cntr) { j=1; continue; }
				if (this.rowsCol[i].className.indexOf("rowselected") != -1){
					if (j%2 == 1)
						this.rowsCol[i].className=this._cssUnEven+" rowselected "+(this.rowsCol[i]._css||"");
					else
						this.rowsCol[i].className=this._cssEven+" rowselected "+(this.rowsCol[i]._css||"");
				} else {
					if (j%2 == 1)
						this.rowsCol[i].className=this._cssUnEven+" "+(this.rowsCol[i]._css||"");
					else
						this.rowsCol[i].className=this._cssEven+" "+(this.rowsCol[i]._css||"");
				}
				j++;
			}
		}
//#}		
	}
//#__pro_feature:21092006{
	/**
	*     @desc: clear wasChanged state for all cells in grid
	*     @type: public
	*     @edition: Professional
	*     @topic: 7
	*/
	this.clearChangedState=function(){
		for (var i = 0; i < this.rowsCol.length; i++){
			var row = this.rowsCol[i];
			var cols = row.childNodes.length;

			for (var j = 0; j < cols; j++)row.childNodes[j].wasChanged=false;
		}
	};

	/**
	*     @desc: get list of IDs of changed rows
	*     @type: public
	*     @edition: Professional
	*     @return: list of ID of changed rows
	*     @topic: 7
	*/
	this.getChangedRows=function(and_added){
		var res = new Array();
		this.forEachRow(function(id){
			var row = this.rowsAr[id];
			if (row.tagName!="TR") return; 
			var cols = row.childNodes.length;
			if (and_added && row._added)
				res[res.length]=row.idd;
			else
				for (var j = 0; j < cols; j++)
					if (row.childNodes[j].wasChanged){
						res[res.length]=row.idd;
						break;
					}
		})
		return res.join(this.delim);
	};


//#serialization:21092006{

	this._sUDa=false;
	this._sAll=false;

	/**
	*     @desc: configure XML serialization
	*     @type: public
	*     @edition: Professional
	*     @param: userData - enable/disable user data serialization
	*     @param: fullXML - enable/disable full XML serialization (selection state)
	*     @param: config - serialize grid configuration
	*     @param: changedAttr - include changed attribute
	*     @param: onlyChanged - include only Changed  rows in result XML
	*     @param: asCDATA - output cell values as CDATA sections (prevent invalid XML)
	*     @topic: 0,5,7
	*/
	this.setSerializationLevel=function(userData, fullXML, config, changedAttr, onlyChanged, asCDATA){
		this._sUDa=userData;
		this._sAll=fullXML;
		this._sConfig=config;
		this._chAttr=changedAttr;
		this._onlChAttr=onlyChanged;
		this._asCDATA=asCDATA;
	}


/**
*     @desc: configure which column must be serialized (if you do not use this method, then all columns will be serialized)
*     @type: public
*     @edition: Professional
*     @param: list - list of true/false values separated by comma, if list empty then all fields will be serialized
*     @topic: 0,5,7
*/
	this.setSerializableColumns=function(list){
		if (!list){
			this._srClmn=null;
			return;
		}
		this._srClmn=(list||"").split(",");

		for (var i = 0; i < this._srClmn.length; i++)this._srClmn[i]=convertStringToBoolean(this._srClmn[i]);
	}

	/**
	*     @desc: serialize a collection of rows
	*     @type: private
	*     @topic: 0,5,7
	*/
	this._serialise=function(rCol, inner, closed){
		this.editStop()
		var out = [];
		//rows collection
		var close = "</"+this.xml.s_row+">"

		if (this.isTreeGrid()){
			this._h2.forEachChildF(0, function(el){
				var temp = this._serializeRow(this.render_row_tree(-1, el.id));
				out.push(temp);

				if (temp)
					return true;
				else
					return false;
			}, this, function(){
				out.push(close);
			});
		}
		else
			for (var i = 0; i < this.rowsBuffer.length; i++)
				if (this.rowsBuffer[i]){
					if (this._chAttr && this.rowsBuffer[i]._locator)
						continue;
						
					var temp = this._serializeRow(this.render_row(i));
					out.push(temp);

					if (temp)
						out.push(close);
				}

		return [out.join("")];
	}

	/**
	*   @desc: serialize TR or xml node to grid formated xml (row tag)
	*   @param: r - TR or xml node (row)
	*   @retruns: string - xml representation of passed row
	*   @type: private
	*/
	this._serializeRow=function(r, i){
		var out = [];
		var ra = this.xml.row_attrs;
		var ca = this.xml.cell_attrs;

		out.push("<"+this.xml.s_row);
		out.push(" id='"+r.idd+"'");

		if ((this._sAll)&&this.selectedRows._dhx_find(r) != -1)
			out.push(" selected='1'");

		if (this._h2&&this._h2.get[r.idd].state == "minus")
			out.push(" open='1'");

		if (ra.length)
			for (var i = 0; i < ra.length; i++)out.push(" "+ra[i]+"='"+r._attrs[ra[i]]+"'");
		out.push(">");

		//userdata
		if (this._sUDa&&this.UserData[r.idd]){
			keysAr=this.UserData[r.idd].getKeys()

			for (var ii = 0;
				ii < keysAr.length;
				ii++)out.push("<userdata name='"+keysAr[ii]+"'>"+(this._asCDATA?"<![CDATA[":"")+this.UserData[r.idd].get(keysAr[ii])+(this._asCDATA?"]]>":"")+"</userdata>");
		}


		//cells
		var changeFl = false;

		for (var jj = 0; jj < this._cCount; jj++){
			if ((!this._srClmn)||(this._srClmn[jj])){
				var zx = this.cells3(r, jj);
				out.push("<cell");

				if (ca.length)
					for (var i = 0; i < ca.length; i++)out.push(" "+ca[i]+"='"+zx.cell._attrs[ca[i]]+"'");
				zxVal=zx[this._agetm]();

				if (this._asCDATA)
					zxVal="<![CDATA["+zxVal+"]]>";

				//#colspan:20092006{
				if ((this._ecspn)&&(zx.cell.colSpan)&&zx.cell.colSpan > 1)
					out.push(" colspan=\""+zx.cell.colSpan+"\" ");
				//#}

				if (this._chAttr){
					if (zx.wasChanged()){
						out.push(" changed=\"1\"");
						changeFl=true;
					}
				}

				else if ((this._onlChAttr)&&(zx.wasChanged()))
					changeFl=true;

				if (this._sAll && this.cellType[jj]=="tree")
					out.push((this._h2 ? (" image='"+this._h2.get[r.idd].image+"'") : "")+">"+zxVal+"</cell>");
				else
					out.push(">"+zxVal+"</cell>");

				//#colspan:20092006{
				if ((this._ecspn)&&(zx.cell.colSpan))
					for (var u = 0; u < zx.cell.colSpan-1; u++){
						out.push("<cell/>");
						jj++;
					}
			//#}
			}
		}

		if ((this._onlChAttr)&&(!changeFl)&&(!r._added))
			return "";

		return out.join("");
	}

	/**
	*     @desc: serialize grid configuration
	*     @type: private
	*     @topic: 0,5,7
	*/
	this._serialiseConfig=function(){
		var out = "<head>";

		for (var i = 0; i < this.hdr.rows[0].cells.length; i++){
			if (this._srClmn && !this._srClmn[i]) continue;
			var sort = this.fldSort[i];
			if (sort == "cus"){
				sort = this._customSorts[i].toString();
				sort=sort.replace(/function[\ ]*/,"").replace(/\([^\f]*/,"");
			}
			out+="<column width='"+this.getColWidth(i)+"' align='"+this.cellAlign[i]+"' type='"+this.cellType[i]
				+"' sort='"+(sort||"na")+"' color='"+this.columnColor[i]+"'"
				+(this.columnIds[i]
					? (" id='"+this.columnIds[i]+"'")
					: "")+">";
			if (this._asCDATA)
				out+="<![CDATA["+this.getHeaderCol(i)+"]]>";
			else
				out+=this.getHeaderCol(i);
			var z = this.getCombo(i);

			if (z)
				for (var j = 0; j < z.keys.length; j++)out+="<option value='"+z.keys[j]+"'>"+z.values[j]+"</option>";
			out+="</column>"
		}
		return out+="</head>";
	}
	/**
	*     @desc: get actual xml of grid. The depth of serialization can be set with setSerializationLevel method
	*     @type: public
	*     @edition: Professional
	*     @topic: 5,7
	*/
	this.serialize=function(){
		var out = '<?xml version="1.0"?><rows>';

		if (this._mathSerialization)
			this._agetm="getMathValue";
		else
			this._agetm="getValue";

		if (this._sUDa&&this.UserData["gridglobaluserdata"]){
			var keysAr = this.UserData["gridglobaluserdata"].getKeys()

			for (var i = 0;
				i < keysAr.length;
				i++)out+="<userdata name='"+keysAr[i]+"'>"+this.UserData["gridglobaluserdata"].get(keysAr[i])
				+"</userdata>";
		}

		if (this._sConfig)
			out+=this._serialiseConfig();
		out+=this._serialise();

		out+='</rows>';
		return out;
	}
//#}
//#}

	/**
	*    @desc: returns absolute left and top position of specified element
	*    @returns: array of two values: absolute Left and absolute Top positions
	*    @param: oNode - element to get position of
	*   @type: private
	*   @topic: 8
	*/
	this.getPosition=function(oNode, pNode){
		if (!pNode && !_isChrome){
			var pos = getOffset(oNode);
			return [pos.left, pos.top];
		}
		pNode = pNode||document.body;

		var oCurrentNode = oNode;
		var iLeft = 0;
		var iTop = 0;

		while ((oCurrentNode)&&(oCurrentNode != pNode)){ //.tagName!="BODY"){
			iLeft+=oCurrentNode.offsetLeft-oCurrentNode.scrollLeft;
			iTop+=oCurrentNode.offsetTop-oCurrentNode.scrollTop;
			oCurrentNode=oCurrentNode.offsetParent;
		}

		if (pNode == document.body){
			if (_isIE){
				iTop+=document.body.offsetTop||document.documentElement.offsetTop;
				iLeft+=document.body.offsetLeft||document.documentElement.offsetLeft;
			} else if (!_isFF){
				iLeft+=document.body.offsetLeft;
				iTop+=document.body.offsetTop;
			}
		}
		return [iLeft, iTop];
	}
	/**
	*   @desc: gets nearest parent of specified type
	*   @param: obj - input object
	*   @param: tag - string. tag to find as parent
	*   @returns: object. nearest paraent object (including spec. obj) of specified type.
	*   @type: private
	*   @topic: 8
	*/
	this.getFirstParentOfType=function(obj, tag){
		while (obj&&obj.tagName != tag&&obj.tagName != "BODY"){
			obj=obj.parentNode;
		}
		return obj;
	}



	/*INTERNAL EVENT HANDLERS*/
	this.objBox.onscroll=function(){
		this.grid._doOnScroll();
	};
//#column_resize:06042008{
	if ((!_isOpera)||(_OperaRv > 8.5)){
		this.hdr.onmousemove=function(e){
			this.grid.changeCursorState(e||window.event);
		};
		this.hdr.onmousedown=function(e){
			return this.grid.startColResize(e||window.event);
		};		
	}
//#}
//#tooltips:06042008{
	this.obj.onmousemove=this._drawTooltip;
//#}
	this.objBox.onclick=function(e){
		(e||event).cancelBubble=true;
	};
	this.obj.onclick=function(e){
		this.grid._doClick(e||window.event);
		if (this.grid._sclE) 
			this.grid.editCell(e||window.event); 
		else
			this.grid.editStop();
					
		(e||event).cancelBubble=true;
	};
//#context_menu:06042008{
	if (_isMacOS){
		this.entBox.oncontextmenu=function(e){
			e.cancelBubble=true;
			e.returnValue=false;
			return this.grid._doContClick(e||window.event);
		};
	} else {
    	this.entBox.onmousedown=function(e){
	    	return this.grid._doContClick(e||window.event);
    	};
    	this.entBox.oncontextmenu=function(e){
    		if (this.grid._ctmndx)
    			(e||event).cancelBubble=true;
    		return !this.grid._ctmndx;
		};
	}
    	
//#}		
	this.obj.ondblclick=function(e){
		if (!this.grid.wasDblClicked(e||window.event)) 
			return false; 
		if (this.grid._dclE) {
			var row = this.grid.getFirstParentOfType((_isIE?event.srcElement:e.target),"TR");
			if (row == this.grid.row)
				this.grid.editCell(e||window.event);  
		}
		(e||event).cancelBubble=true;
		if (_isOpera) return false; //block context menu for Opera 9+
	};
	this.hdr.onclick=this._onHeaderClick;
	this.sortImg.onclick=function(){
		self._onHeaderClick.apply({
			grid: self
			}, [
			null,
			self.r_fldSorted
		]);
	};

	this.hdr.ondblclick=this._onHeaderDblClick;


	if (!document.body._dhtmlxgrid_onkeydown){
		dhtmlxEvent(document, "keydown",function(e){
			if (globalActiveDHTMLGridObject) 
				return globalActiveDHTMLGridObject.doKey(e||window.event);
		});
		document.body._dhtmlxgrid_onkeydown=true;
	}

	dhtmlxEvent(document.body, "click", function(){
		if (self.editStop) self.editStop();
		if (self.isActive) self.setActive(false);
	});

	//activity management
	this.entBox.onbeforeactivate=function(){
		this._still_active=null;
		this.grid.setActive();
		event.cancelBubble=true;
	};
	
	this.entBox.onbeforedeactivate=function(){
		if (this.grid._still_active) 
			this.grid._still_active=null; 
		else 
			this.grid.isActive=false; 
		event.cancelBubble=true;
	};
	
	if (this.entBox.style.height.toString().indexOf("%") != -1)
		this._delta_y = this.entBox.style.height;
	if (this.entBox.style.width.toString().indexOf("%") != -1)
		this._delta_x = this.entBox.style.width;

	if (this._delta_x||this._delta_y)
		this._setAutoResize();
	
		
	/* deprecated names */
	this.setColHidden=this.setColumnsVisibility
	this.enableCollSpan = this.enableColSpan
	this.setMultiselect=this.enableMultiselect;
	this.setMultiLine=this.enableMultiline;
	this.deleteSelectedItem=this.deleteSelectedRows;
	this.getSelectedId=this.getSelectedRowId;
	this.getHeaderCol=this.getColumnLabel;
	this.isItemExists=this.doesRowExist;
	this.getColumnCount=this.getColumnsNum;
	this.setSelectedRow=this.selectRowById;
	this.setHeaderCol=this.setColumnLabel;
	this.preventIECashing=this.preventIECaching;
	this.enableAutoHeigth=this.enableAutoHeight;
	this.getUID=this.uid;
	
	if (dhtmlx.image_path) this.setImagePath(dhtmlx.image_path);
	if (dhtmlx.skin) this.setSkin(dhtmlx.skin);
		
	return this;
}

dhtmlXGridObject.prototype={
	getRowAttribute: function(id, name){
		return this.getRowById(id)._attrs[name];
	},
	setRowAttribute: function(id, name, value){
		this.getRowById(id)._attrs[name]=value;
	},
	/**
	*   @desc: detect is current grid is a treeGrid
	*   @type: private
	*   @topic: 2
	*/
	isTreeGrid:function(){
		return (this.cellType._dhx_find("tree") != -1);
	},
	
//#column_hidden:21092006{	
	/**
	*   @desc: hide/show row (warning! - this command doesn't affect row indexes, only visual appearance)
	*   @param: ind - column index
	*   @param: state - true/false - hide/show row
	*   @type:  public
	*/
	setRowHidden:function(id, state){
		var f = convertStringToBoolean(state);
		//var ind=this.getRowIndex(id);
		//if (id<0)
		//   return;
		var row = this.getRowById(id) //this.rowsCol[ind];
	
		if (!row)
			return;
	
		if (row.expand === "")
			this.collapseKids(row);
	
		if ((state)&&(row.style.display != "none")){
			row.style.display="none";
			var z = this.selectedRows._dhx_find(row);
	
			if (z != -1){
				row.className=row.className.replace("rowselected", "");
	
				for (var i = 0;
					i < row.childNodes.length;
					i++)row.childNodes[i].className=row.childNodes[i].className.replace(/cellselected/g, "");
				this.selectedRows._dhx_removeAt(z);
			}
			this.callEvent("onGridReconstructed", []);
		}
	
		if ((!state)&&(row.style.display == "none")){
			row.style.display="";
			this.callEvent("onGridReconstructed", []);
		}
		this.callEvent("onRowHide",[id, state]);
		this.setSizes();
	},
	
//#__pro_feature:21092006{
	/**
	*   @desc: hide/show column
	*   @param: ind - column index
	*   @param: state - true/false - hide/show column
	*   @type:  public
	*   @edition: Professional
	*/
	setColumnHidden:function(ind, state){
		if (!this.hdr.rows.length){
			if (!this._ivizcol)
				this._ivizcol=[];
			return this._ivizcol[ind]=state;
		}
	
		if ((this.fldSorted)&&(this.fldSorted.cellIndex == ind)&&(state))
			this.sortImg.style.display="none";
	
		var f = convertStringToBoolean(state);
	
		if (f){
			if (!this._hrrar)
				this._hrrar=new Array();
	
			else if (this._hrrar[ind])
				return;
			this._hrrar[ind]="display:none;";
			this._hideShowColumn(ind, "none");
		} else {
			if ((!this._hrrar)||(!this._hrrar[ind]))
				return;
			this._hrrar[ind]="";
			this._hideShowColumn(ind, "");
		}
	
		if ((this.fldSorted)&&(this.fldSorted.cellIndex == ind)&&(!state))
			this.sortImg.style.display="inline";
			
		this.setSortImgPos();
		this.callEvent("onColumnHidden",[ind,state])
	},
	
	
	/**
	*   @desc: get show/hidden status of column
	*   @param: ind - column index
	*   @type:  public
	*   @edition: Professional
	*   @returns:  if column hidden then true else false
	*/
	isColumnHidden:function(ind){
		if ((this._hrrar)&&(this._hrrar[ind]))
			return true;
	
		return false;
	},
	/**
	*   @desc: set list of visible/hidden columns
	*   @param: list - list of true/false separated by comma
	*   @type:  public
	*	@newmethod: setColumnsVisibility
	*   @edition: Professional
	*   @topic:0
	*/
	setColumnsVisibility:function(list){
		if (list)
			this._ivizcol=list.split(this.delim);
	
		if (this.hdr.rows.length&&this._ivizcol)
			for (var i = 0; i < this._ivizcol.length; i++)this.setColumnHidden(i, this._ivizcol[i]);
	},
	/**
	*   @desc: fix hidden state for column in all rows
	*   @type: private
	*/
	_fixHiddenRowsAll:function(pb, ind, prop, state, index){
		index=index||"_cellIndex";
		var z = pb.rows.length;
	
		for (var i = 0; i < z; i++){
			var x = pb.rows[i].childNodes;
	
			if (x.length != this._cCount){
				for (var j = 0; j < x.length; j++)
					if (x[j][index] == ind){
						x[j].style[prop]=state;
						break;
					}
			} else
				x[ind].style[prop]=state;
		}
	},
	/**
	*   @desc: hide column
	*   @param: ind - column index
	*   @param: state - hide/show
	*   @edition: Professional
	*   @type:  private
	*/
	_hideShowColumn:function(ind, state){
		var hind = ind;
	
		if ((this.hdr.rows[1]._childIndexes)&&(this.hdr.rows[1]._childIndexes[ind] != ind))
			hind=this.hdr.rows[1]._childIndexes[ind];
	
		if (state == "none"){
			this.hdr.rows[0].cells[ind]._oldWidth=this.hdr.rows[0].cells[ind].style.width||(this.initCellWidth[ind]+"px");
			this.hdr.rows[0].cells[ind]._oldWidthP=this.cellWidthPC[ind];
			this.obj.rows[0].cells[ind].style.width="0px";
	
			
			var t={rows:[this.obj.rows[0]]}
			this.forEachRow(function(id){
				if (this.rowsAr[id].tagName=="TR")
							t.rows.push(this.rowsAr[id])
			})
			this._fixHiddenRowsAll(t, ind, "display", "none");
	
			if (this.isTreeGrid())
				this._fixHiddenRowsAllTG(ind, "none");
	
			if ((_isOpera&&_OperaRv < 9)||_isKHTML||(_isFF)){ 
			    this._fixHiddenRowsAll(this.hdr, ind, "display", "none","_cellIndexS");
	
			}
			if (this.ftr)
				this._fixHiddenRowsAll(this.ftr.childNodes[0], ind, "display", "none");			
			this._fixHiddenRowsAll(this.hdr, ind, "whiteSpace", "nowrap","_cellIndexS");
	
			if (!this.cellWidthPX.length&&!this.cellWidthPC.length)
				this.cellWidthPX=[].concat(this.initCellWidth);
	
			if (this.cellWidthPX[ind])
				this.cellWidthPX[ind]=0;
	
			if (this.cellWidthPC[ind])
				this.cellWidthPC[ind]=0;
		} else {
			if (this.hdr.rows[0].cells[ind]._oldWidth){
				var zrow = this.hdr.rows[0].cells[ind];
	
				if (_isOpera||_isKHTML||(_isFF))
					this._fixHiddenRowsAll(this.hdr, ind, "display", "","_cellIndexS");
	
				if (this.ftr)
					this._fixHiddenRowsAll(this.ftr.childNodes[0], ind, "display", "");
	
				
				var t={rows:[this.obj.rows[0]]}
				this.forEachRow(function(id){
					if (this.rowsAr[id].tagName=="TR")
								t.rows.push(this.rowsAr[id])
				})
				this._fixHiddenRowsAll(t, ind, "display", "");
	
				if (this.isTreeGrid())
					this._fixHiddenRowsAllTG(ind, "");
	
				this._fixHiddenRowsAll(this.hdr, ind, "whiteSpace", "normal","_cellIndexS");
	
				if (zrow._oldWidthP)
					this.cellWidthPC[ind]=zrow._oldWidthP;
	
				if (zrow._oldWidth)
					this.cellWidthPX[ind]=parseInt(zrow._oldWidth);
			}
		}
		this.setSizes();
	
		if ((!_isIE)&&(!_isFF)){
			//dummy Opera/Safari fix
			this.obj.border=1;
			this.obj.border=0;
		}
	},
//#}	
//#}
//#__pro_feature:21092006{	
//#colspan:20092006{
	/**
	*   @desc: enable/disable colspan support
	*   @param: mode - true/false
	*   @type:  public
	*   @edition: Professional
	*/
	enableColSpan:function(mode){
		this._ecspn=convertStringToBoolean(mode);
	},
//#}
//#}
//#hovering:060402008{	
	/**
	*   @desc: enable/disable hovering row on mouse over
	*   @param: mode - true/false
	*   @param: cssClass - css class for hovering row
	*   @type:  public
	*/
	enableRowsHover:function(mode, cssClass){
		this._unsetRowHover(false,true);
		this._hvrCss=cssClass;
	
		if (convertStringToBoolean(mode)){
			if (!this._elmnh){
				this.obj._honmousemove=this.obj.onmousemove;
				this.obj.onmousemove=this._setRowHover;
	
				if (_isIE)
					this.obj.onmouseleave=this._unsetRowHover;
				else
					this.obj.onmouseout=this._unsetRowHover;
	
				this._elmnh=true;
			}
		} else {
			if (this._elmnh){
				this.obj.onmousemove=this.obj._honmousemove;
	
				if (_isIE)
					this.obj.onmouseleave=null;
				else
					this.obj.onmouseout=null;
	
				this._elmnh=false;
			}
		}
	},
//#}	
	/**
	*   @desc: enable/disable events which fire excell editing, mutual exclusive with enableLightMouseNavigation
	*   @param: click - true/false - enable/disable editing by single click
	*   @param: dblclick - true/false - enable/disable editing by double click
	*   @param: f2Key - enable/disable editing by pressing F2 key
	*   @type:  public
	*/
	enableEditEvents:function(click, dblclick, f2Key){
		this._sclE=convertStringToBoolean(click);
		this._dclE=convertStringToBoolean(dblclick);
		this._f2kE=convertStringToBoolean(f2Key);
	},
	
//#hovering:060402008{	
	/**
	*   @desc: enable/disable light mouse navigation mode (row selection with mouse over, editing with single click), mutual exclusive with enableEditEvents
	*   @param: mode - true/false
	*   @type:  public
	*/
	enableLightMouseNavigation:function(mode){
		if (convertStringToBoolean(mode)){
			if (!this._elmn){
				this.entBox._onclick=this.entBox.onclick;
				this.entBox.onclick=function(){
					return true;
				};
	
				this.obj._onclick=this.obj.onclick;
				this.obj.onclick=function(e){
					var c = this.grid.getFirstParentOfType(e ? e.target : event.srcElement, 'TD');
					if (!c) return;
					this.grid.editStop();
					this.grid.doClick(c);
					this.grid.editCell();
					(e||event).cancelBubble=true;
				}
	
				this.obj._onmousemove=this.obj.onmousemove;
				this.obj.onmousemove=this._autoMoveSelect;
				this._elmn=true;
			}
		} else {
			if (this._elmn){
				this.entBox.onclick=this.entBox._onclick;
				this.obj.onclick=this.obj._onclick;
				this.obj.onmousemove=this.obj._onmousemove;
				this._elmn=false;
			}
		}
	},
	
	
	/**
	*   @desc: remove hover state on row
	*   @type:  private
	*/
	_unsetRowHover:function(e, c){
		if (c)
			that=this;
		else
			that=this.grid;
	
		if ((that._lahRw)&&(that._lahRw != c)){
			for (var i = 0;
				i < that._lahRw.childNodes.length;
				i++)that._lahRw.childNodes[i].className=that._lahRw.childNodes[i].className.replace(that._hvrCss, "");
			that._lahRw=null;
		}
	},
	
	/**
	*   @desc: set hover state on row
	*   @type:  private
	*/
	_setRowHover:function(e){
		var c = this.grid.getFirstParentOfType(e ? e.target : event.srcElement, 'TD');
	
		if (c && c.parentNode!=this.grid._lahRw) {
			this.grid._unsetRowHover(0, c);
			c=c.parentNode;
	  		if (!c.idd || c.idd=="__filler__") return;
			for (var i = 0; i < c.childNodes.length; i++)c.childNodes[i].className+=" "+this.grid._hvrCss;
			this.grid._lahRw=c;
		}
		this._honmousemove(e);
	},
	
	/**
	*   @desc: onmousemove, used in light mouse navigaion mode
	*   @type:  private
	*/
	_autoMoveSelect:function(e){
		//this - grid.obj
		if (!this.grid.editor){
			var c = this.grid.getFirstParentOfType(e ? e.target : event.srcElement, 'TD');
	
			if (c.parentNode.idd)
				this.grid.doClick(c, true, 0);
		}
		this._onmousemove(e);
	},
//#}	
//#__pro_feature:21092006{
//#distrb_parsing:21092006{
	/**
	*   @desc: enable/disable distributed parsing (rows paresed portion by portion with some timeout)
	*   @param: mode - true/false
	*   @param: count - count of nodes parsed by one step (the 10 by default)
	*   @param: time - time between parsing counts in milli seconds (the 250 by default)
	*   @type:  public
	*   @edition: Professional
	*/
	enableDistributedParsing:function(mode, count, time){
		if (convertStringToBoolean(mode)){
			this._ads_count=count||10;
			this._ads_time=time||250;
		} else
			this._ads_count=0;
	},
//#}
//#}
	/**
		*     @desc: destructor, removes grid and cleans used memory
		*     @type: public
	  *     @topic: 0
		*/
	destructor:function(){
		this.editStop(true);
		//add links to current object
		if (this._sizeTime)
			this._sizeTime=window.clearTimeout(this._sizeTime);
		this.entBox.className=(this.entBox.className||"").replace(/gridbox.*/,"");
		if (this.formInputs)
			for (var i = 0; i < this.formInputs.length; i++)this.parentForm.removeChild(this.formInputs[i]);
	
		var a;
		this.xmlLoader=this.xmlLoader.destructor();
	
		for (var i = 0; i < this.rowsCol.length; i++)
			if (this.rowsCol[i])
				this.rowsCol[i].grid=null;
	
		for (i in this.rowsAr)
			if (this.rowsAr[i])
				this.rowsAr[i]=null;
	
		this.rowsCol=new dhtmlxArray();
		this.rowsAr={};
		this.entBox.innerHTML="";
		
		var dummy=function(){};
		this.entBox.onclick = this.entBox.onmousedown = this.entBox.onbeforeactivate = this.entBox.onbeforedeactivate = this.entBox.onbeforedeactivate = this.entBox.onselectstart = dummy;
		this.setSizes = this._update_srnd_view = this.callEvent = dummy;
		this.entBox.grid=this.objBox.grid=this.hdrBox.grid=this.obj.grid=this.hdr.grid=null;
		if (this._fake){
			this.globalBox.innerHTML = "";
			this._fake.setSizes = this._fake._update_srnd_view = this._fake.callEvent = dummy;
			this.globalBox.onclick = this.globalBox.onmousedown = this.globalBox.onbeforeactivate = this.globalBox.onbeforedeactivate = this.globalBox.onbeforedeactivate = this.globalBox.onselectstart = dummy;
		}
	
		for (a in this){
			if ((this[a])&&(this[a].m_obj))
				this[a].m_obj=null;
			this[a]=null;
		}
	
		if (this == globalActiveDHTMLGridObject)
			globalActiveDHTMLGridObject=null;
		//   self=null;
		return null;
	},
	
//#sorting:06042008{	
	/**
	*     @desc: get sorting state of grid
	*     @type: public
	*     @returns: array, first element is index of sortef column, second - direction of sorting ("asc" or "des").
	*     @topic: 0
	*/
	getSortingState:function(){
		var z = new Array();
	
		if (this.fldSorted){
			z[0]=this.fldSorted._cellIndex;
			z[1]=(this.sortImg.src.indexOf("sort_desc.gif") != -1) ? "des" : "asc";
		}
		return z;
	},
//#}
	
	/**
	*     @desc: enable autoheight of grid
	*     @param: mode - true/false
	*     @param: maxHeight - maximum height before scrolling appears (no limit by default)
	*     @param: countFullHeight - control the usage of maxHeight parameter - when set to true all grid height included in max height calculation, if false then only data part (no header) of grid included in calcualation (false by default)
	*     @type: public
	*     @topic: 0
	*/
	enableAutoHeight:function(mode, maxHeight, countFullHeight){
		this._ahgr=convertStringToBoolean(mode);
		this._ahgrF=convertStringToBoolean(countFullHeight);
		this._ahgrM=maxHeight||null;
		if (arguments.length == 1){
			this.objBox.style.overflowY=mode?"hidden":"auto";
		}
		if (maxHeight == "auto"){
			this._ahgrM=null;
			this._ahgrMA=true;
			this._setAutoResize();
		//   this._activeResize();
		}
	},
//#sorting:06042008{	
	enableStableSorting:function(mode){
		this._sst=convertStringToBoolean(mode);
		this.rowsCol.stablesort=function(cmp){
			var size = this.length-1;
	
			for (var i = 0; i < this.length-1; i++){
				for (var j = 0; j < size; j++)
					if (cmp(this[j], this[j+1]) > 0){
						var temp = this[j];
						this[j]=this[j+1];
						this[j+1]=temp;
					}
				size--;
			}
		}
	},
//#}
	
	/**
	*     @desc: enable/disable hot keys in grid
	*     @param: mode - true/false
	*     @type: public
	*     @topic: 0
	*/
	enableKeyboardSupport:function(mode){
		this._htkebl=!convertStringToBoolean(mode);
	},
	
//#context_menu:06042008{	
	/**
	*     @desc: enable/disable context menu
	*     @param: dhtmlxMenu object, if null - context menu will be disabled
	*     @type: public
	*     @topic: 0
	*/
	enableContextMenu:function(menu){
		this._ctmndx=menu;
	},
//#}	
	
	/*backward compatibility*/
	setScrollbarWidthCorrection:function(width){
	},
//#tooltips:06042008{	
	/**
	*     @desc: enable/disable tooltips for specified colums
	*     @param: list - list of true/false values, tooltips enabled for all columns by default
	*     @type: public
	*     @topic: 0
	*/
	enableTooltips:function(list){
		this._enbTts=list.split(",");
	
		for (var i = 0; i < this._enbTts.length; i++)this._enbTts[i]=convertStringToBoolean(this._enbTts[i]);
	},
//#}	
	
//#column_resize:06042008{
	/**
	*     @desc: enable/disable resizing for specified colums
	*     @param: list - list of true/false values, resizing enabled for all columns by default
	*     @type: public
	*     @topic: 0
	*/
	enableResizing:function(list){
		this._drsclmn=list.split(",");
	
		for (var i = 0; i < this._drsclmn.length; i++)this._drsclmn[i]=convertStringToBoolean(this._drsclmn[i]);
	},
	
	/**
	*     @desc: set minimum column width ( works only for manual resizing )
	*     @param: width - minimum column width, can be set for specified column, or as comma separated list for all columns
	*     @param: ind - column index
	*     @type: public
	*     @topic: 0
	*/
	setColumnMinWidth:function(width, ind){
		if (arguments.length == 2){
			if (!this._drsclmW)
				this._drsclmW=new Array();
			this._drsclmW[ind]=width;
		} else
			this._drsclmW=width.split(",");
	},
//#}	
	
	/**
	*     @desc: enable/disable unique id for cells (id will be automaticaly created using the following template: "c_[RowId]_[colIndex]")
	*     @param: mode - true/false - enable/disable
	*     @type: public
	*     @topic: 0
	*/
	enableCellIds:function(mode){
		this._enbCid=convertStringToBoolean(mode);
	},
	
	
//#locked_row:11052006{
	/**
	*     @desc: lock/unlock row for editing
	*     @param: rowId - id of row
	*     @param: mode - true/false - lock/unlock
	*     @type: public
	*     @topic: 0
	*/
	lockRow:function(rowId, mode){
		var z = this.getRowById(rowId);
	
		if (z){
			z._locked=convertStringToBoolean(mode);
	
			if ((this.cell)&&(this.cell.parentNode.idd == rowId))
				this.editStop();
		}
	},
//#}
	
	/**
	*   @desc:  get values of all cells in row
	*   @type:  private
	*/
	_getRowArray:function(row){
		var text = new Array();
	
		for (var ii = 0; ii < row.childNodes.length; ii++){
			var a = this.cells3(row, ii);
			text[ii]=a.getValue();
		}
	
		return text;
	},
//#__pro_feature:21092006{	
//#data_format:12052006{
	/**
	*     @desc: set mask for date formatting in cell
	*     @param: mask - date mask, d,m,y will mean day,month,year; for example "d/m/y" - 22/05/1985
	*     @type: public
	*     @edition: Professional
	*     @topic: 0
	*/
	setDateFormat:function(mask,incoming){
		this._dtmask=mask;
		this._dtmask_inc=incoming;
	},
	
	/**
	*     @desc: set mask for formatting numeric data ( works for [ed/ro]n excell only or oher cell types with suport for this method)
	*     @param: mask - numeric mask; for example 0,000.00 - 1,234.56
	*     @param: cInd - column index
	*     @param: p_sep - char used as decimalseparator ( point by default )
	*     @param: d_sep - char used as groups part separator ( comma by default )
	*     @type: public
	*     @edition: Professional
	*     @topic: 0
	*/
	setNumberFormat:function(mask, cInd, p_sep, d_sep){
		var nmask = mask.replace(/[^0\,\.]*/g, "");
		var pfix = nmask.indexOf(".");
	
		if (pfix > -1)
			pfix=nmask.length-pfix-1;
		var dfix = nmask.indexOf(",");
	
		if (dfix > -1)
			dfix=nmask.length-pfix-2-dfix;
		if (typeof p_sep != "string")
			p_sep=this.i18n.decimal_separator;
		if (typeof d_sep != "string")
			d_sep=this.i18n.group_separator;
		var pref = mask.split(nmask)[0];
		var postf = mask.split(nmask)[1];
		this._maskArr[cInd]=[
			pfix,
			dfix,
			pref,
			postf,
			p_sep,
			d_sep
		];
	},
	/**
	*   @desc:  convert formated value to original
	*   @type:  private
	*/
	_aplNFb:function(data, ind){
		var a = this._maskArr[ind];
	
		if (!a)
			return data;
	
		var ndata = parseFloat(data.toString().replace(/[^0-9]*/g, ""));
	
		if (data.toString().substr(0, 1) == "-")
			ndata=ndata*-1;
	
		if (a[0] > 0)
			ndata=ndata / Math.pow(10, a[0]);
		return ndata;
	},
	
	/**
	*   @desc:  format data with mask
	*   @type:  private
	*/
	_aplNF:function(data, ind){
		var a = this._maskArr[ind];
	
		if (!a)
			return data;
	
		var c = (parseFloat(data) < 0 ? "-" : "")+a[2];
		data=Math.abs(Math.round(parseFloat(data)*Math.pow(10, a[0] > 0 ? a[0] : 0))).toString();
		data=(data.length
			< a[0]
				? Math.pow(10, a[0]+1-data.length).toString().substr(1, a[0]+1)+data.toString()
				: data).split("").reverse();
		data[a[0]]=(data[a[0]]||"0")+a[4];
	
		if (a[1] > 0)
			for (var j = (a[0] > 0 ? 0 : 1)+a[0]+a[1]; j < data.length; j+=a[1])data[j]+=a[5];
		return c+data.reverse().join("")+a[3];
	},
//#}
//#}	
	
//#config_from_xml:20092006{
	
	/**
	*   @desc:  configure grid structure from XML
	*   @type:  private
	*/
	_launchCommands:function(arr){
		for (var i = 0; i < arr.length; i++){
			var args = new Array();
	
			for (var j = 0; j < arr[i].childNodes.length; j++)
				if (arr[i].childNodes[j].nodeType == 1)
					args[args.length]=arr[i].childNodes[j].firstChild.data;
	
			this[arr[i].getAttribute("command")].apply(this, args);
		}
	},
	
	
	/**
	*   @desc:  configure grid structure from XML
	*   @type:  private
	*/
	_parseHead:function(xmlDoc){
		var hheadCol = this.xmlLoader.doXPath("./head", xmlDoc);
	
		if (hheadCol.length){
			var headCol = this.xmlLoader.doXPath("./column", hheadCol[0]);
			var asettings = this.xmlLoader.doXPath("./settings", hheadCol[0]);
			var awidthmet = "setInitWidths";
			var split = false;
	
			if (asettings[0]){
				for (var s = 0; s < asettings[0].childNodes.length; s++)switch (asettings[0].childNodes[s].tagName){
					case "colwidth":
						if (asettings[0].childNodes[s].firstChild&&asettings[0].childNodes[s].firstChild.data == "%")
							awidthmet="setInitWidthsP";
						break;
	
					case "splitat":
						split=(asettings[0].childNodes[s].firstChild ? asettings[0].childNodes[s].firstChild.data : false);
						break;
				}
			}
			this._launchCommands(this.xmlLoader.doXPath("./beforeInit/call", hheadCol[0]));
	
			if (headCol.length > 0){
			    if (this.hdr.rows.length > 0) this.clearAll(true); //drop existing grid here, to prevent loss of initialization parameters
				var sets = [
					[],
					[],
					[],
					[],
					[],
					[],
					[],
					[],
					[]
				];
	
				var attrs = ["", "width", "type", "align", "sort", "color", "format", "hidden", "id"];
				var calls = ["", awidthmet, "setColTypes", "setColAlign", "setColSorting", "setColumnColor", "",
					"", "setColumnIds"];
	
				for (var i = 0; i < headCol.length; i++){
					for (var j = 1; j < attrs.length; j++)sets[j].push(headCol[i].getAttribute(attrs[j]));
					sets[0].push((headCol[i].firstChild
						? headCol[i].firstChild.data
						: "").replace(/^\s*((\s\S)*.+)\s*$/gi, "$1"));
				};
	
				this.setHeader(sets[0]);
				for (var i = 0; i < calls.length; i++)
					if (calls[i])
						this[calls[i]](sets[i].join(this.delim))
	
				for (var i = 0; i < headCol.length; i++){
					if ((this.cellType[i].indexOf('co') == 0)||(this.cellType[i] == "clist")){
						var optCol = this.xmlLoader.doXPath("./option", headCol[i]);
	
						if (optCol.length){
							var resAr = new Array();
	
							if (this.cellType[i] == "clist"){
								for (var j = 0;
									j < optCol.length;
									j++)resAr[resAr.length]=optCol[j].firstChild
									? optCol[j].firstChild.data
									: "";
	
								this.registerCList(i, resAr);
							} else {
								var combo = this.getCombo(i);
	
								for (var j = 0;
									j < optCol.length;
									j++)combo.put(optCol[j].getAttribute("value"),
									optCol[j].firstChild
										? optCol[j].firstChild.data
										: "");
							}
						}
					}
	
					else if (sets[6][i])
						if ((this.cellType[i].toLowerCase().indexOf("calendar")!=-1)||(this.fldSort[i] == "date"))
							this.setDateFormat(sets[6][i]);
						else
							this.setNumberFormat(sets[6][i], i);
				}
	
				this.init();
	
	            var param=sets[7].join(this.delim);
	            //preserving state of hidden columns, if not specified directly
				if (this.setColHidden && param.replace(/,/g,"")!="")
					this.setColHidden(param);
	
				if ((split)&&(this.splitAt))
					this.splitAt(split);
			}
			this._launchCommands(this.xmlLoader.doXPath("./afterInit/call", hheadCol[0]));
		}
		//global(grid) user data
		var gudCol = this.xmlLoader.doXPath("//rows/userdata", xmlDoc);
	
		if (gudCol.length > 0){
			
			if (!this.UserData["gridglobaluserdata"])
				this.UserData["gridglobaluserdata"]=new Hashtable();
	
			for (var j = 0; j < gudCol.length; j++){
				var u_record = "";
				for (var xj=0; xj < gudCol[j].childNodes.length; xj++)
					u_record += gudCol[j].childNodes[xj].nodeValue;
				this.UserData["gridglobaluserdata"].put(gudCol[j].getAttribute("name"),u_record);
			}
		}
	},
	
	
//#}
	
	
	/**
	*   @desc: get list of Ids of all rows with checked exCell in specified column
	*   @type: public
	*   @param: col_ind - column index
	*   @topic: 5
	*/
	getCheckedRows:function(col_ind){
		var d = new Array();
		this.forEachRowA(function(id){
			if (this.cells(id, col_ind).getValue() != 0)
				d.push(id);
		},true)
		return d.join(",");
	},
	/**
	*   @desc: check all checkboxes in grid
	*   @type: public
	*   @param: col_ind - column index
	*   @topic: 5
	*/	
	checkAll:function(){var mode=arguments.length?arguments[0]:1;
		 for (var cInd=0;cInd<this.getColumnsNum();cInd++){if(this.getColType(cInd)=="ch")this.setCheckedRows(cInd,mode)}},
	/**
	*   @desc: uncheck all checkboxes in grid
	*   @type: public
	*   @param: col_ind - column index
	*   @topic: 5
	*/	
	uncheckAll:function(){ this.checkAll(0); },
	/**
	*   @desc: set value for all checkboxes in specified column
	*   @type: public
	*   @param: col_ind - column index
	*   @topic: 5
	*/	
	setCheckedRows:function(cInd,v){this.forEachRowA(function(id){if(this.cells(id,cInd).isCheckbox())this.cells(id,cInd).setValue(v)})},
//#tooltips:06042008{	
	/**
	*   @desc:  grid body onmouseover function
	*   @type:  private
	*/
	_drawTooltip:function(e){
		var c = this.grid.getFirstParentOfType(e ? e.target : event.srcElement, 'TD');
	
		if (!c || ((this.grid.editor)&&(this.grid.editor.cell == c)))
			return true;
	
		var r = c.parentNode;
	
		if (!r.idd||r.idd == "__filler__")
			return;
		var el = (e ? e.target : event.srcElement);
	
		if (r.idd == window.unknown)
			return true;
	
		if (!this.grid.callEvent("onMouseOver", [
			r.idd,
			c._cellIndex,
			(e||window.event)
		]))
			return true;
	
		if ((this.grid._enbTts)&&(!this.grid._enbTts[c._cellIndex])){
			if (el.title)
				el.title='';
			return true;
		}
	
		if (c._cellIndex >= this.grid._cCount)
			return;
		var ced = this.grid.cells3(r, c._cellIndex);
		if (!ced || !ced.cell || !ced.cell._attrs) return; // fix for public release
	
		if (el._title)
			ced.cell.title="";
	
		if (!ced.cell._attrs['title'])
			el._title=true;
	
		if (ced)
			el.title=ced.cell._attrs['title']
				||(ced.getTitle
					? ced.getTitle()
					: (ced.getValue()||"").toString().replace(/<[^>]*>/gi, ""));
	
		return true;
	},
//#}	
	/**
	*   @desc:  can be used for setting correction for cell padding, while calculation setSizes
	*   @type:  private
	*/
	enableCellWidthCorrection:function(size){
		if (_isFF)
			this._wcorr=parseInt(size);
	},
	
	
	/**
	*	@desc: gets a list of all row ids in grid
	*	@param: separator - delimiter to use in list
	*	@returns: list of all row ids in grid
	*	@type: public
	*	@topic: 2,7
	*/
	getAllRowIds:function(separator){
		var ar = [];
	
		for (var i = 0; i < this.rowsBuffer.length; i++)
			if (this.rowsBuffer[i])
				ar.push(this.rowsBuffer[i].idd);
	
		return ar.join(separator||this.delim)
	},
	getAllItemIds:function(){
		return this.getAllRowIds();
	},
	
//#__pro_feature:21092006{	
//#colspan:20092006{
	
	/**
	*   @desc: dynamicaly set colspan in row starting from specified column index
	*   @param: row_id - row id
	*   @param: col_id - index of column
	*   @param: colspan - size of colspan
	*   @type: public
	*   @edition: Professional
	*   @topic: 2,9
	*/
	setColspan:function(row_id, col_ind, colspan){
		if (!this._ecspn)
			return;
	
		var r = this.getRowById(row_id);
	
		if ((r._childIndexes)&&(r.childNodes[r._childIndexes[col_ind]])){
			var j = r._childIndexes[col_ind];
			var n = r.childNodes[j];
			var m = n.colSpan;
			n.colSpan=1;
	
			if ((m)&&(m != 1))
				for (var i = 1; i < m; i++){
					var c = document.createElement("TD");
	
					if (n.nextSibling)
						r.insertBefore(c, n.nextSibling);
					else
						r.appendChild(c);
					r._childIndexes[col_ind+i]=j+i;
					c._cellIndex=col_ind+i;
					c.style.textAlign=this.cellAlign[i];
					c.style.verticalAlign=this.cellVAlign[i];
					n=c;
					this.cells3(r, col_ind+i).setValue("");
				}
	
			for (var z = col_ind*1+1*m; z < r._childIndexes.length; z++){
				r._childIndexes[z]+=(m-1)*1;
			}
		}
	
		if ((colspan)&&(colspan > 1)){
			if (r._childIndexes)
				var j = r._childIndexes[col_ind];
			else {
				var j = col_ind;
				r._childIndexes=new Array();
	
				for (var z = 0; z < r.childNodes.length; z++)r._childIndexes[z]=z;
			}
	
			r.childNodes[j].colSpan=colspan;
	
			for (var z = 1; z < colspan; z++){
				r._childIndexes[r.childNodes[j+1]._cellIndex]=j;
				r.removeChild(r.childNodes[j+1]);
			}
	
			var c1 = r.childNodes[r._childIndexes[col_ind]]._cellIndex;
	
			for (var z = c1*1+1*colspan; z < r._childIndexes.length; z++)r._childIndexes[z]-=(colspan-1);
		}
	},
	
//#}
//#}
	
	/**
	*   @desc: prevent caching in IE  by adding random values to URL string
	*   @param: mode - enable/disable random values in URLs ( disabled by default )
	*   @type: public
	*   @topic: 2,9
	*/
	preventIECaching:function(mode){
		this.no_cashe=convertStringToBoolean(mode);
		this.xmlLoader.rSeed=this.no_cashe;
	},
	enableColumnAutoSize:function(mode){
		this._eCAS=convertStringToBoolean(mode);
	},
	/**
	*   @desc: called when header was dbllicked
	*   @type: private
	*   @topic: 1,2
	*/
	_onHeaderDblClick:function(e){
		var that = this.grid;
		var el = that.getFirstParentOfType(_isIE ? event.srcElement : e.target, "TD");
	
		if (!that._eCAS)
			return false;
		that.adjustColumnSize(el._cellIndexS)
	},
	
	/**
	*   @desc: autosize column  to max content size
	*   @param: cInd - index of column
	*   @type:  public
	*/
	adjustColumnSize:function(cInd, complex){
		if (this._hrrar && this._hrrar[cInd]) return;
		this._notresize=true;
		var m = 0;
		this._setColumnSizeR(cInd, 20);
	
		for (var j = 1; j < this.hdr.rows.length; j++){
			var a = this.hdr.rows[j];
			a=a.childNodes[(a._childIndexes) ? a._childIndexes[cInd] : cInd];
	
			if ((a)&&((!a.colSpan)||(a.colSpan < 2)) && a._cellIndex==cInd){
				if ((a.childNodes[0])&&(a.childNodes[0].className == "hdrcell"))
					a=a.childNodes[0];
				m=Math.max(m, ((_isFF||_isOpera) ? (a.textContent.length*this.fontWidth) : a.scrollWidth));
			}
		}
	
		var l = this.obj.rows.length;
	
		for (var i = 1; i < l; i++){
			var z = this.obj.rows[i];
			if (!this.rowsAr[z.idd]) continue;
			
			if (z._childIndexes&&z._childIndexes[cInd] != cInd || !z.childNodes[cInd])
				continue;
	
			if (_isFF||_isOpera||complex)
				z=z.childNodes[cInd].textContent.length*this.fontWidth;
			else
				z=z.childNodes[cInd].scrollWidth;
	
			if (z > m)
				m=z;
		}
		m+=20+(complex||0);
	
		this._setColumnSizeR(cInd, m);
		this._notresize=false;
		this.setSizes();
	},
	
//#header_footer:06042008{
	/**
	*   @desc: remove header line from grid (opposite to attachHeader)
	*   @param: index - index of row to be removed ( zero based )
	*	@param: hdr - header object (optional)
	*   @type:  public
	*/
	detachHeader:function(index, hdr){
		hdr=hdr||this.hdr;
		var row = hdr.rows[index+1];
	
		if (row)
			row.parentNode.removeChild(row);
		this.setSizes();
	},
	
	/**
	*   @desc: remove footer line from grid (opposite to attachFooter)
	*   @param: values - array of header titles
	*   @type:  public
	*/
	detachFooter:function(index){
		this.detachHeader(index, this.ftr);
	},
	
	/**
	*   @desc: attach additional line to header
	*   @param: values - array of header titles
	*   @param: style - array of styles, optional
	*	@param: _type - reserved
	*   @type:  public
	*/
	attachHeader:function(values, style, _type){
		if (typeof (values) == "string")
			values=this._eSplit(values);
	
		if (typeof (style) == "string")
			style=style.split(this.delim);
		_type=_type||"_aHead";
	
		if (this.hdr.rows.length){
			if (values)
				this._createHRow([
					values,
					style
				], this[(_type == "_aHead") ? "hdr" : "ftr"]);
	
			else if (this[_type])
				for (var i = 0; i < this[_type].length; i++)this.attachHeader.apply(this, this[_type][i]);
		} else {
			if (!this[_type])
				this[_type]=new Array();
			this[_type][this[_type].length]=[
				values,
				style,
				_type
			];
		}
	},
	/**
	*	@desc:
	*	@type: private
	*/
	_createHRow:function(data, parent){
		if (!parent){
			if (this.entBox.style.position!="absolute")
				this.entBox.style.position="relative";
			var z = document.createElement("DIV");
			z.className="c_ftr".substr(2);
			this.entBox.appendChild(z);
			var t = document.createElement("TABLE");
			t.cellPadding=t.cellSpacing=0;
	
			if (!_isIE){
				t.width="100%";
				t.style.paddingRight="20px";
			}
			t.style.marginRight="20px";
			t.style.tableLayout="fixed";
	
			z.appendChild(t);
			t.appendChild(document.createElement("TBODY"));
			this.ftr=parent=t;
	
			var hdrRow = t.insertRow(0);
			var thl = ((this.hdrLabels.length <= 1) ? data[0].length : this.hdrLabels.length);
	
			for (var i = 0; i < thl; i++){
				hdrRow.appendChild(document.createElement("TH"));
				hdrRow.childNodes[i]._cellIndex=i;
			}
	
			if (_isIE && _isIE<8)
				hdrRow.style.position="absolute";
			else
				hdrRow.style.height='auto';
		}
		var st1 = data[1];
		var z = document.createElement("TR");
		parent.rows[0].parentNode.appendChild(z);
	
		for (var i = 0; i < data[0].length; i++){
			if (data[0][i] == "#cspan"){
				var pz = z.cells[z.cells.length-1];
				pz.colSpan=(pz.colSpan||1)+1;
				continue;
			}
	
			if ((data[0][i] == "#rspan")&&(parent.rows.length > 1)){
				var pind = parent.rows.length-2;
				var found = false;
				var pz = null;
	
				while (!found){
					var pz = parent.rows[pind];
	
					for (var j = 0; j < pz.cells.length; j++)
						if (pz.cells[j]._cellIndex == i){
							found=j+1;
							break;
						}
					pind--;
				}
	
				pz=pz.cells[found-1];
				pz.rowSpan=(pz.rowSpan||1)+1;
				continue;
			//            data[0][i]="";
			}
	
			var w = document.createElement("TD");
			w._cellIndex=w._cellIndexS=i;
			if (this._hrrar && this._hrrar[i] && !_isIE)
				w.style.display='none';

			if (typeof data[0][i] == "object")
				w.appendChild(data[0][i]);
			else {
				if (this.forceDivInHeader)
					w.innerHTML="<div class='hdrcell'>"+(data[0][i]||"&nbsp;")+"</div>";
				else
					w.innerHTML=(data[0][i]||"&nbsp;");
		
				if ((data[0][i]||"").indexOf("#") != -1){
					var t = data[0][i].match(/(^|{)#([^}]+)(}|$)/);
		
					if (t){
						var tn = "_in_header_"+t[2];
		
						if (this[tn])
							this[tn]((this.forceDivInHeader ? w.firstChild : w), i, data[0][i].split(t[0]));
					}
				}
			}
			if (st1)
				w.style.cssText=st1[i];
	
			z.appendChild(w);
		}
		var self = parent;
	
		if (_isKHTML){
			if (parent._kTimer)
				window.clearTimeout(parent._kTimer);
			parent._kTimer=window.setTimeout(function(){
				parent.rows[1].style.display='none';
				window.setTimeout(function(){
					parent.rows[1].style.display='';
				}, 1);
			}, 500);
		}
	},
//#__pro_feature:21092006{	
	/**
	*   @desc: attach additional line to footer
	*   @param: values - array of header titles
	*   @param: style - array of styles, optional
	*   @edition: Professional
	*   @type:  public
	*/
	attachFooter:function(values, style){
		this.attachHeader(values, style, "_aFoot");
	},
//#}
//#}
//#__pro_feature:21092006{
//#dyn_cell_types:04062008{
	/**
	*   @desc: set excell type for cell in question
	*   @param: rowId - row ID
	*   @param: cellIndex - cell index
	*   @param: type - type of excell (code like "ed", "txt", "ch" etc.)
	*   @edition: Professional
	*   @type:  public
	*/
	setCellExcellType:function(rowId, cellIndex, type){
		this.changeCellType(this.getRowById(rowId), cellIndex, type);
	},
	/**
	*	@desc: 
	*	@type: private
	*/
	changeCellType:function(r, ind, type){
		type=type||this.cellType[ind];
		var z = this.cells3(r, ind);
		var v = z.getValue();
		z.cell._cellType=type;
		var z = this.cells3(r, ind);
		z.setValue(v);
	},
	/**
	*   @desc: set excell type for all cells in specified row
	*   @param: rowId - row ID
	*   @param: type - type of excell
	*   @edition: Professional
	*   @type:  public
	*/
	setRowExcellType:function(rowId, type){
		var z = this.rowsAr[rowId];
	
		for (var i = 0; i < z.childNodes.length; i++)this.changeCellType(z, i, type);
	},
	/**
	*   @desc: set excell type for all cells in specified column
	*   @param: colIndex - column index
	*   @param: type - type of excell
	*   @edition: Professional
	*   @type:  public
	*/
	setColumnExcellType:function(colIndex, type){
		for (var i = 0; i < this.rowsBuffer.length; i++)
			if (this.rowsBuffer[i] && this.rowsBuffer[i].tagName=="TR")
				this.changeCellType(this.rowsBuffer[i], colIndex, type);
		if (this.cellType[colIndex]=="math")
			this._strangeParams[i]=type;
		else
			this.cellType[colIndex]=type;
	},
	
//#}
//#}

	/**
	*   @desc: execute code for each row in a grid
	*   @param: custom_code - function which get row id as incomming argument
	*   @type:  public
	*/
	forEachRow:function(custom_code){
		for (var a in this.rowsAr)
			if (this.rowsAr[a]&&this.rowsAr[a].idd)
				custom_code.apply(this, [this.rowsAr[a].idd]);
	},
	forEachRowA:function(custom_code){
		for (var a =0; a<this.rowsBuffer.length; a++){
			if (this.rowsBuffer[a])
				custom_code.call(this, this.render_row(a).idd);
		}
	},
	/**
	*   @desc: execute code for each cell in a row
	*   @param: rowId - id of row where cell must be itterated
	*   @param: custom_code - function which get eXcell object as incomming argument
	*   @type:  public
	*/
	forEachCell:function(rowId, custom_code){
		var z = this.getRowById(rowId);
	
		if (!z)
			return;
	
		for (var i = 0; i < this._cCount; i++) custom_code(this.cells3(z, i),i);
	},
	/**
	*   @desc: changes grid's container size on the fly to fit total width of grid columns
	*   @param: mode  - truse/false - enable / disable
	*   @param: max_limit  - max allowed width, not limited by default
	*   @param: min_limit  - min allowed width, not limited by default
	*   @type:  public
	*/
	enableAutoWidth:function(mode, max_limit, min_limit){
		this._awdth=[
			convertStringToBoolean(mode),
			parseInt(max_limit||99999),
			parseInt(min_limit||0)
		];
		if (arguments.length == 1)
			this.objBox.style.overflowX=mode?"hidden":"auto";
	},
//#update_from_xml:06042008{	
	/**
	*   @desc: refresh grid from XML ( doesnt work for buffering, tree grid or rows in smart rendering mode )
	*   @param: insert_new - insert new items
	*   @param: del_missed - delete missed rows
	*   @param: afterCall - function, will be executed after refresh completted
	*   @type:  public
	*/
	
	updateFromXML:function(url, insert_new, del_missed, afterCall){
		if (typeof insert_new == "undefined")
			insert_new=true;
		this._refresh_mode=[
			true,
			insert_new,
			del_missed
		];
		this.load(url,afterCall)
	},
	_refreshFromXML:function(xml){
		if (this._f_rowsBuffer) this.filterBy(0,"");
		reset = false;
		if (window.eXcell_tree){
			eXcell_tree.prototype.setValueX=eXcell_tree.prototype.setValue;
			eXcell_tree.prototype.setValue=function(content){
				var r=this.grid._h2.get[this.cell.parentNode.idd]
				if (r && this.cell.parentNode.valTag){
					this.setLabel(content);
				} else
					this.setValueX(content);
			};
		}
	
		var tree = this.cellType._dhx_find("tree");
			xml.getXMLTopNode("rows");
		var pid = xml.doXPath("//rows")[0].getAttribute("parent")||0;
	
		var del = {
		};
	
		if (this._refresh_mode[2]){
			if (tree != -1)
				this._h2.forEachChild(pid, function(obj){
					del[obj.id]=true;
				}, this);
			else
				this.forEachRow(function(id){
					del[id]=true;
				});
		}
	
		var rows = xml.doXPath("//row");
	
		for (var i = 0; i < rows.length; i++){
			var row = rows[i];
			var id = row.getAttribute("id");
			del[id]=false;
			var pid = row.parentNode.getAttribute("id")||pid;
	
			if (this.rowsAr[id] && this.rowsAr[id].tagName!="TR"){
				if (this._h2)
					this._h2.get[id].buff.data=row;
				else
					this.rowsBuffer[this.getRowIndex(id)].data=row;
				this.rowsAr[id]=row;
			} else if (this.rowsAr[id]){
					this._process_xml_row(this.rowsAr[id], row, -1);
					this._postRowProcessing(this.rowsAr[id],true)
				} else if (this._refresh_mode[1]){
					var dadd={
						idd: id,
						data: row,
						_parser: this._process_xml_row,
						_locator: this._get_xml_data
					};
					
					var render_index = this.rowsBuffer.length;
					if (this._refresh_mode[1]=="top"){
						this.rowsBuffer.unshift(dadd);
						render_index = 0;
					} else
						this.rowsBuffer.push(dadd);
						
					if (this._h2){ 
						reset=true;
						(this._h2.add(id,(row.parentNode.getAttribute("id")||row.parentNode.getAttribute("parent")))).buff=this.rowsBuffer[this.rowsBuffer.length-1];
					}
						
					this.rowsAr[id]=row;
					row=this.render_row(render_index);
					this._insertRowAt(row,render_index?-1:0)
				}
		}
				
		if (this._refresh_mode[2])
			for (id in del){
				if (del[id]&&this.rowsAr[id])
					this.deleteRow(id);
			}
	
		this._refresh_mode=null;
		if (window.eXcell_tree)
			eXcell_tree.prototype.setValue=eXcell_tree.prototype.setValueX;
			
		if (reset) this._renderSort();
		if (this._f_rowsBuffer) {
			this._f_rowsBuffer = null;
			this.filterByAll();
		}
	},
//#}	
//#co_excell:06042008{
	/**
	*   @desc: get combobox specific for cell in question
	*   @param: id - row id
	*   @param: ind  - column index
	*   @type:  public
	*/
	getCustomCombo:function(id, ind){
		var cell = this.cells(id, ind).cell;
	
		if (!cell._combo)
			cell._combo=new dhtmlXGridComboObject();
		return cell._combo;
	},
//#}
	/**
	*   @desc: set tab order of columns
	*   @param: order - list of tab indexes (default delimiter is ",")
	*   @type:  public
	*/
	setTabOrder:function(order){
		var t = order.split(this.delim);
		this._tabOrder=[];
		var max=this._cCount||order.length;
	
		for (var i = 0; i < max; i++)t[i]={
			c: parseInt(t[i]),
			ind: i
			};
		t.sort(function(a, b){
			return (a.c > b.c ? 1 : -1);
		});
	
		for (var i = 0; i < max; i++)
			if (!t[i+1]||( typeof t[i].c == "undefined"))
				this._tabOrder[t[i].ind]=(t[0].ind+1)*-1;
			else
				this._tabOrder[t[i].ind]=t[i+1].ind;
	},
	
	i18n:{
		loading: "Loading",
		decimal_separator:".",
		group_separator:","
	},
	
	//key_ctrl_shift
	_key_events:{
		k13_1_0: function(){
			var rowInd = this.rowsCol._dhx_find(this.row)
			this.selectCell(this.rowsCol[rowInd+1], this.cell._cellIndex, true);
		},
		k13_0_1: function(){
			var rowInd = this.rowsCol._dhx_find(this.row)
			this.selectCell(this.rowsCol[rowInd-1], this.cell._cellIndex, true);
		},
		k13_0_0: function(){
			this.editStop();
			this.callEvent("onEnter", [
				(this.row ? this.row.idd : null),
				(this.cell ? this.cell._cellIndex : null)
			]);
			this._still_active=true;
		},
		k9_0_0: function(){
			this.editStop();
			if (!this.callEvent("onTab",[true])) return true;
			var z = this._getNextCell(null, 1);
		
			if (z){
				this.selectCell(z.parentNode, z._cellIndex, (this.row != z.parentNode), false, true);
				this._still_active=true;
			}
		},
		k9_0_1: function(){
			this.editStop();
			if (!this.callEvent("onTab",[false])) return false;
			var z = this._getNextCell(null, -1);
	
			if (z){
				this.selectCell(z.parentNode, z._cellIndex, (this.row != z.parentNode), false, true);
				this._still_active=true;
			}
		},
		k113_0_0: function(){
			if (this._f2kE)
				this.editCell();
		},
		k32_0_0: function(){
			var c = this.cells4(this.cell);
	
			if (!c.changeState||(c.changeState() === false))
				return false;
		},
		k27_0_0: function(){
			this.editStop(true);
		},
		k33_0_0: function(){
			if (this.pagingOn)
				this.changePage(this.currentPage-1);
			else
				this.scrollPage(-1);
		},
		k34_0_0: function(){
			if (this.pagingOn)
				this.changePage(this.currentPage+1);
			else
				this.scrollPage(1);
		},
		k37_0_0: function(){
			if (!this.editor&&this.isTreeGrid())
				this.collapseKids(this.row)
			else
				return false;
		},
		k39_0_0: function(){
			if (!this.editor&&this.isTreeGrid())
				this.expandKids(this.row)
			else
				return false;
		},
		k40_0_0: function(){
			var master = this._realfake?this._fake:this;
			if (this.editor&&this.editor.combo)
				this.editor.shiftNext();
			else {
				if (!this.row.idd) return;
				var rowInd = Math.max((master._r_select||0),this.getRowIndex(this.row.idd))+1;
				if (this.rowsBuffer[rowInd]){
					master._r_select=null;
					this.selectCell(rowInd, this.cell._cellIndex, true);
					if (master.pagingOn) master.showRow(master.getRowId(rowInd));
				} else {
					if (!this.callEvent("onLastRow", [])) return false;
					this._key_events.k34_0_0.apply(this, []);
					if (this.pagingOn && this.rowsCol[rowInd])
						this.selectCell(rowInd, 0, true);
				}
			}
			this._still_active=true;
		},
		k38_0_0: function(){
			var master = this._realfake?this._fake:this;
			if (this.editor&&this.editor.combo)
				this.editor.shiftPrev();
			else {
				if (!this.row.idd) return;
				var rowInd = this.getRowIndex(this.row.idd)+1;
				if (rowInd != -1 && (!this.pagingOn || (rowInd!=1))){
					var nrow = this._nextRow(rowInd-1, -1);
					this.selectCell(nrow, this.cell._cellIndex, true);
					if (master.pagingOn && nrow) master.showRow(nrow.idd);
				} else {
					this._key_events.k33_0_0.apply(this, []);
					/*
					if (this.pagingOn && this.rowsCol[this.rowsBufferOutSize-1])
						this.selectCell(this.rowsBufferOutSize-1, 0, true);
						*/
				}
			}
			this._still_active=true;
		}
	},
	
	//(c)dhtmlx ltd. www.dhtmlx.com
	
	_build_master_row:function(){
		var t = document.createElement("DIV");
		var html = ["<table><tr>"];
	
		for (var i = 0; i < this._cCount; i++)html.push("<td></td>");
		html.push("</tr></table>");
		t.innerHTML=html.join("");
		this._master_row=t.firstChild.rows[0];
	},
	
	_prepareRow:function(new_id){ /*TODO: hidden columns */
		if (!this._master_row)
			this._build_master_row();
	
		var r = this._master_row.cloneNode(true);
	
		for (var i = 0; i < r.childNodes.length; i++){
			r.childNodes[i]._cellIndex=i;
	        if (this._enbCid) r.childNodes[i].id="c_"+new_id+"_"+i;
			if (this.dragAndDropOff)
				this.dragger.addDraggableItem(r.childNodes[i], this);
		}
		r.idd=new_id;
		r.grid=this;
	
		return r;
	},
	
//#non_xml_data:06042008{
	_process_jsarray_row:function(r, data){
		r._attrs={
		};
	
		for (var j = 0; j < r.childNodes.length; j++)r.childNodes[j]._attrs={
		};
	
		this._fillRow(r, (this._c_order ? this._swapColumns(data) : data));
		return r;
	},
	_get_jsarray_data:function(data, ind){
		return data[ind];
	},
	_process_json_row:function(r, data){
		data = this._c_order ? this._swapColumns(data.data) : data.data;
		return this._process_some_row(r, data);
	},
	_process_some_row:function(r,data){
		r._attrs={};
	
		for (var j = 0; j < r.childNodes.length; j++)
			r.childNodes[j]._attrs={};
	
		this._fillRow(r, data);
		return r;
	},
	_get_json_data:function(data, ind){
		return data.data[ind];
	},


	_process_js_row:function(r, data){
		var arr = [];
		for (var i=0; i<this.columnIds.length; i++){
			arr[i] = data[this.columnIds[i]];
			if (!arr[i] && arr[i]!==0)
				arr[i]="";
		}
		this._process_some_row(r,arr);

		r._attrs = data;
		return r;
	},

	_process_csv_row:function(r, data){
		r._attrs={
		};
	
		for (var j = 0; j < r.childNodes.length; j++)r.childNodes[j]._attrs={
		};
	
		this._fillRow(r, (this._c_order ? this._swapColumns(data.split(this.csv.cell)) : data.split(this.csv.cell)));
		return r;
	},
	_get_csv_data:function(data, ind){
		return data.split(this.csv.cell)[ind];
	},
//#}
	_process_store_row:function(row, data){
		var result = [];
		for (var i = 0; i < this.columnIds.length; i++)
			result[i] = data[this.columnIds[i]];
		for (var j = 0; j < row.childNodes.length; j++)
		row.childNodes[j]._attrs={};

		row._attrs = data;
		this._fillRow(row, (this._c_order ? this._swapColumns(result) : result));
	},	
//#xml_data:06042008{
	_process_xml_row:function(r, xml){		
		var cellsCol = this.xmlLoader.doXPath(this.xml.cell, xml);
		var strAr = [];
	
		r._attrs=this._xml_attrs(xml);
	
		//load userdata
		if (this._ud_enabled){
			var udCol = this.xmlLoader.doXPath("./userdata", xml);
	
			for (var i = udCol.length-1; i >= 0; i--){
				var u_record = "";
				for (var j=0; j < udCol[i].childNodes.length; j++)
					u_record += udCol[i].childNodes[j].nodeValue;

				this.setUserData(r.idd,udCol[i].getAttribute("name"), u_record);
			}
		}
	
		//load cell data
		for (var j = 0; j < cellsCol.length; j++){
			var cellVal = cellsCol[this._c_order?this._c_order[j]:j];
			if (!cellVal) continue;
			var cind = r._childIndexes?r._childIndexes[j]:j;
			var exc = cellVal.getAttribute("type");
	
			if (r.childNodes[cind]){
				if (exc)
					r.childNodes[cind]._cellType=exc;
				r.childNodes[cind]._attrs=this._xml_attrs(cellVal);
			}
	
			if (!cellVal.getAttribute("xmlcontent")){
				if (cellVal.firstChild)
				cellVal=cellVal.firstChild.data;
	
			else
				cellVal="";
			}
	
			strAr.push(cellVal);
		}
	
		for (j < cellsCol.length; j < r.childNodes.length; j++)r.childNodes[j]._attrs={
		};
	
		//treegrid
		if (r.parentNode&&r.parentNode.tagName == "row")
			r._attrs["parent"]=r.parentNode.getAttribute("idd");
	
		//back to common code
		this._fillRow(r, strAr);
		return r;
	},
	_get_xml_data:function(data, ind){ 
		data=data.firstChild;
	
		while (true){
			if (!data)
				return "";
	
			if (data.tagName == "cell")
				ind--;
	
			if (ind < 0)
				break;
			data=data.nextSibling;
		}
		return (data.firstChild ? data.firstChild.data : "");
	},
//#}	
	_fillRow:function(r, text){
		if (this.editor)
			this.editStop();
	
		for (var i = 0; i < r.childNodes.length; i++){
			if ((i < text.length)||(this.defVal[i])){
				
			    var ii=r.childNodes[i]._cellIndex;
			    var val = text[ii];
				var aeditor = this.cells4(r.childNodes[i]);
	
				if ((this.defVal[ii])&&((val == "")||( typeof (val) == "undefined")))
					val=this.defVal[ii];

				if (aeditor) aeditor.setValue(val)
			} else {
				r.childNodes[i].innerHTML="&nbsp;";
				r.childNodes[i]._clearCell=true;
			}
		}
	
		return r;
	},
	
	_postRowProcessing:function(r,donly){ 
		if (r._attrs["class"])
			r._css=r.className=r._attrs["class"];
	
		if (r._attrs.locked)
			r._locked=true;
	
		if (r._attrs.bgColor)
			r.bgColor=r._attrs.bgColor;
		var cor=0;	
		
		for (var i = 0; i < r.childNodes.length; i++){
			var c=r.childNodes[i];
			var ii=c._cellIndex;
			//style attribute
			var s = c._attrs.style||r._attrs.style;
	
			if (s)
				c.style.cssText+=";"+s;
	
			if (c._attrs["class"])
				c.className=c._attrs["class"];
			s=c._attrs.align||this.cellAlign[ii];

	
			if (s)
				c.align=s;
			c.vAlign=c._attrs.valign||this.cellVAlign[ii];
			var color = c._attrs.bgColor||this.columnColor[ii];

	
			if (color)
				c.bgColor=color;
	
			if (c._attrs["colspan"] && !donly){ 
				this.setColspan(r.idd, i+cor, c._attrs["colspan"]);
				//i+=(c._attrs["colspan"]-1);
				cor+=(c._attrs["colspan"]-1);
			}
	
			if (this._hrrar&&this._hrrar[ii]&&!donly){
				c.style.display="none";
			}
		};
		this.callEvent("onRowCreated", [
			r.idd,
			r,
			null
		]);
	},
	/**
	*   @desc: load data from external file ( xml, json, jsarray, csv )
	*   @param: url - url to external file
	*   @param: call - after loading callback function, optional, can be ommited
	*   @param: type - type of data (xml,csv,json,jsarray) , optional, xml by default
	*   @type:  public
	*/			
	load:function(url, call, type){
		this.callEvent("onXLS", [this]);
		if (arguments.length == 2 && typeof call != "function"){
			type=call;
			call=null;
		}
		type=type||"xml";
	
		if (!this.xmlFileUrl)
			this.xmlFileUrl=url;
		this._data_type=type;
		this.xmlLoader.onloadAction=function(that, b, c, d, xml){
			if (!that.callEvent) return;
			xml=that["_process_"+type](xml);
			if (!that._contextCallTimer)
			that.callEvent("onXLE", [that,0,0,xml]);
	
			if (call){
				call();
				call=null;
			}
		}
		this.xmlLoader.loadXML(url);
	},
//#__pro_feature:21092006{		
	loadXMLString:function(str, afterCall){
		var t = new dtmlXMLLoaderObject(function(){
		});

		t.loadXMLString(str);
		this.parse(t, afterCall, "xml")
	},
//#}
	loadXML:function(url, afterCall){
		this.load(url, afterCall, "xml")
	},
	/**
	*   @desc: load data from local datasource ( xml string, csv string, xml island, xml object, json objecs , javascript array )
	*   @param: data - string or object
	*   @param: type - data type (xml,json,jsarray,csv), optional, data threated as xml by default
	*   @type:  public
	*/			
	parse:function(data, call, type){
		if (arguments.length == 2 && typeof call != "function"){
			type=call;
			call=null;
		}
		type=type||"xml";
		this._data_type=type;
		data=this["_process_"+type](data);
		if (!this._contextCallTimer)
		this.callEvent("onXLE", [this,0,0,data]);
		if (call)
			call();
	},
	
	xml:{
		top: "rows",
		row: "./row",
		cell: "./cell",
		s_row: "row",
		s_cell: "cell",
		row_attrs: [],
		cell_attrs: []
	},
	
	csv:{
		row: "\n",
		cell: ","
	},
	
	_xml_attrs:function(node){
		var data = {
		};
	
		if (node.attributes.length){
			for (var i = 0; i < node.attributes.length; i++)data[node.attributes[i].name]=node.attributes[i].value;
		}
	
		return data;
	},
//#xml_data:06042008{	
	_process_xml:function(xml){ 
		if (!xml.doXPath){
			var t = new dtmlXMLLoaderObject(function(){});
			if (typeof xml == "string") 
				t.loadXMLString(xml);
			else {
				if (xml.responseXML)
					t.xmlDoc=xml;
				else
					t.xmlDoc={};
				t.xmlDoc.responseXML=xml;
			}
			xml=t;
		}
		if (this._refresh_mode) return this._refreshFromXML(xml);		
		this._parsing=true;
		var top = xml.getXMLTopNode(this.xml.top)
		if (top.tagName!=this.xml.top) return;
		//#config_from_xml:20092006{
		this._parseHead(top);
		//#}
		var rows = xml.doXPath(this.xml.row, top)
		var cr = parseInt(xml.doXPath("//"+this.xml.top)[0].getAttribute("pos")||0);
		var total = parseInt(xml.doXPath("//"+this.xml.top)[0].getAttribute("total_count")||0);
	
		var reset = false;
		if (total && total!=this.rowsBuffer.length){
			if (!this.rowsBuffer[total-1]){
				if (this.rowsBuffer.length)
					reset=true;
			this.rowsBuffer[total-1]=null;
			} 
			if (total<this.rowsBuffer.length){
				this.rowsBuffer.splice(total, this.rowsBuffer.length - total);
				reset = true;
			}
		}
		
			
		if (this.isTreeGrid())
			return this._process_tree_xml(xml);
			 
	
		for (var i = 0; i < rows.length; i++){
			if (this.rowsBuffer[i+cr])
				continue;
			var id = rows[i].getAttribute("id")||(i+cr+1);
			this.rowsBuffer[i+cr]={
				idd: id,
				data: rows[i],
				_parser: this._process_xml_row,
				_locator: this._get_xml_data
				};
	
			this.rowsAr[id]=rows[i];
		//this.callEvent("onRowCreated",[r.idd]);
		}
		if (reset && this._srnd){
			var h = this.objBox.scrollTop;
			this._reset_view();
			this.objBox.scrollTop = h;
		} else {
		this.render_dataset();
		}
			
		this._parsing=false;
		return xml.xmlDoc.responseXML?xml.xmlDoc.responseXML:xml.xmlDoc;
	},
//#}
//#non_xml_data:06042008{	
	_process_jsarray:function(data){
		this._parsing=true;
	
		if (data&&data.xmlDoc){
			eval("dhtmlx.temp="+data.xmlDoc.responseText+";");
			data = dhtmlx.temp;
		}
	
		for (var i = 0; i < data.length; i++){
			var id = i+1;
			this.rowsBuffer.push({
				idd: id,
				data: data[i],
				_parser: this._process_jsarray_row,
				_locator: this._get_jsarray_data
				});
	
			this.rowsAr[id]=data[i];
		//this.callEvent("onRowCreated",[r.idd]);
		}
		this.render_dataset();
		this._parsing=false;
	},
	
	_process_csv:function(data){
		this._parsing=true;
		if (data.xmlDoc)
			data=data.xmlDoc.responseText;
		data=data.replace(/\r/g,"");
		data=data.split(this.csv.row);
	    if (this._csvHdr){
   			this.clearAll();
   			var thead=data.splice(0,1)[0].split(this.csv.cell);
   			if (!this._csvAID) thead.splice(0,1);
	   		this.setHeader(thead.join(this.delim));
	   		this.init();
   		}
	
		for (var i = 0; i < data.length; i++){
			if (!data[i] && i==data.length-1) continue; //skip new line at end of text
			if (this._csvAID){
				var id = i+1;
				this.rowsBuffer.push({
					idd: id,
					data: data[i],
					_parser: this._process_csv_row,
					_locator: this._get_csv_data
					});
			} else {
				var temp = data[i].split(this.csv.cell);
				var id = temp.splice(0,1)[0];
				this.rowsBuffer.push({
					idd: id,
					data: temp,
					_parser: this._process_jsarray_row,
					_locator: this._get_jsarray_data
					});
			}
			
	
			this.rowsAr[id]=data[i];
		//this.callEvent("onRowCreated",[r.idd]);
		}
		this.render_dataset();
		this._parsing=false;
	},
	
	_process_js:function(data){
		return this._process_json(data, "js");
	},

	_process_json:function(data, mode){
		this._parsing=true;
	
		if (data&&data.xmlDoc){
			eval("dhtmlx.temp="+data.xmlDoc.responseText+";");
			data = dhtmlx.temp;
		}
	
		if (mode == "js"){
			if (data.data)
				data = data.data;
			for (var i = 0; i < data.length; i++){
				var row = data[i];
				var id  = row.id||(i+1);
				this.rowsBuffer.push({
					idd: id,
					data: row,
					_parser: this._process_js_row,
					_locator: this._get_json_data
					});
		
				this.rowsAr[id]=data[i];
			}
		} else {
			for (var i = 0; i < data.rows.length; i++){
				var id = data.rows[i].id;
				this.rowsBuffer.push({
					idd: id,
					data: data.rows[i],
					_parser: this._process_json_row,
					_locator: this._get_json_data
					});
		
				this.rowsAr[id]=data[i];
			}
		}

		this.render_dataset();
		this._parsing=false;
	},
//#}	
	render_dataset:function(min, max){ 
		//normal mode - render all
		//var p=this.obj.parentNode;
		//p.removeChild(this.obj,true)
		if (this._srnd){
			if (this._fillers)
				return this._update_srnd_view();
	
			max=Math.min((this._get_view_size()+(this._srnd_pr||0)), this.rowsBuffer.length);
			
		}
	
		if (this.pagingOn){
			min=Math.max((min||0),(this.currentPage-1)*this.rowsBufferOutSize);
			max=Math.min(this.currentPage*this.rowsBufferOutSize, this.rowsBuffer.length)
		} else {
			min=min||0;
			max=max||this.rowsBuffer.length;
		}
	
		for (var i = min; i < max; i++){
			var r = this.render_row(i)
	
			if (r == -1){
				if (this.xmlFileUrl){
				    if (this.callEvent("onDynXLS",[i,(this._dpref?this._dpref:(max-i))]))
				        this.load(this.xmlFileUrl+getUrlSymbol(this.xmlFileUrl)+"posStart="+i+"&count="+(this._dpref?this._dpref:(max-i)), this._data_type);
				}
				max=i;
				break;
			}
						
			if (!r.parentNode||!r.parentNode.tagName){ 
				this._insertRowAt(r, i);
				if (r._attrs["selected"] || r._attrs["select"]){
					this.selectRow(r,r._attrs["call"]?true:false,true);
					r._attrs["selected"]=r._attrs["select"]=null;
				}
			}
			
							
			if (this._ads_count && i-min==this._ads_count){
				var that=this;
				this._context_parsing=this._context_parsing||this._parsing;
				return this._contextCallTimer=window.setTimeout(function(){
					that._contextCallTimer=null;
					that.render_dataset(i,max);
					if (!that._contextCallTimer){
						if(that._context_parsing)
					    	that.callEvent("onXLE",[])
					    else 
					    	that._fixAlterCss();
					    that.callEvent("onDistributedEnd",[]);
					    that._context_parsing=false;
				    }
				},this._ads_time)
			}
		}
	
		if (this._srnd&&!this._fillers)
			this._fillers=[this._add_filler(max, this.rowsBuffer.length-max)];
	
		//p.appendChild(this.obj)
		this.setSizes();
	},
	
	render_row:function(ind){
		if (!this.rowsBuffer[ind])
			return -1;
	
		if (this.rowsBuffer[ind]._parser){
			var r = this.rowsBuffer[ind];
			if (this.rowsAr[r.idd] && this.rowsAr[r.idd].tagName=="TR")
				return this.rowsBuffer[ind]=this.rowsAr[r.idd];
			var row = this._prepareRow(r.idd);
			this.rowsBuffer[ind]=row;
			this.rowsAr[r.idd]=row;
	
			r._parser.call(this, row, r.data);
			this._postRowProcessing(row);
			return row;
		}
		return this.rowsBuffer[ind];
	},
	
	
	_get_cell_value:function(row, ind, method){
		if (row._locator){
			/*if (!this._data_cache[row.idd])
				this._data_cache[row.idd]=[];
			if (this._data_cache[row.idd][ind]) 
				return this._data_cache[row.idd][ind];
			else
				 return this._data_cache[row.idd][ind]=row._locator.call(this,row.data,ind);
				 */
			if (this._c_order)
				ind=this._c_order[ind];
			return row._locator.call(this, row.data, ind);
		}
		return this.cells3(row, ind)[method ? method : "getValue"]();
	},
//#sorting:06042008{	
	/**
	*   @desc: sort grid
	*   @param: col - index of column, by which grid need to be sorted
	*   @param: type - sorting type (str,int,date), optional, by default sorting type taken from column setting
	*   @param: order - sorting order (asc,des), optional, by default sorting order based on previous sorting operation
	*   @type:  public
	*/		
	sortRows:function(col, type, order){
		//default values
		order=(order||"asc").toLowerCase();
		type=(type||this.fldSort[col]);
		col=col||0;
		
		if (this.isTreeGrid())
			this.sortTreeRows(col, type, order);
		else{
	
			var arrTS = {
			};
		
			var atype = this.cellType[col];
			var amet = "getValue";
		
			if (atype == "link")
				amet="getContent";
		
			if (atype == "dhxCalendar"||atype == "dhxCalendarA")
				amet="getDate";
		
			for (var i = 0;
				i < this.rowsBuffer.length;
				i++)arrTS[this.rowsBuffer[i].idd]=this._get_cell_value(this.rowsBuffer[i], col, amet);
		
			this._sortRows(col, type, order, arrTS);
		}
		this.callEvent("onAfterSorting", [col,type,order]);
	},
	/**
	*	@desc: 
	*	@type: private
	*/
	_sortCore:function(col, type, order, arrTS, s){
		var sort = "sort";
	
		if (this._sst){
			s["stablesort"]=this.rowsCol.stablesort;
			sort="stablesort";
		}
//#__pro_feature:21092006{	
//#custom_sort:21092006{
		if (type.length > 4)
			type=window[type];
	
		if (type == 'cus'){
			var cstr=this._customSorts[col];
			s[sort](function(a, b){
				return cstr(arrTS[a.idd], arrTS[b.idd], order, a.idd, b.idd);
			});
		}
		else if (typeof (type) == 'function'){
			s[sort](function(a, b){
				return type(arrTS[a.idd], arrTS[b.idd], order, a.idd, b.idd);
			});
		}
		else
//#}
//#}
		if (type == 'str'){
			s[sort](function(a, b){
				if (order == "asc")
					return arrTS[a.idd] > arrTS[b.idd] ? 1 : -1
				else
					return arrTS[a.idd] < arrTS[b.idd] ? 1 : -1
			});
		}
		else if (type == 'int'){
			s[sort](function(a, b){
				var aVal = parseFloat(arrTS[a.idd]);
				aVal=isNaN(aVal) ? -99999999999999 : aVal;
				var bVal = parseFloat(arrTS[b.idd]);
				bVal=isNaN(bVal) ? -99999999999999 : bVal;
	
				if (order == "asc")
					return aVal-bVal;
				else
					return bVal-aVal;
			});
		}
		else if (type == 'date'){
			s[sort](function(a, b){
				var aVal = Date.parse(arrTS[a.idd])||(Date.parse("01/01/1900"));
				var bVal = Date.parse(arrTS[b.idd])||(Date.parse("01/01/1900"));
	
				if (order == "asc")
					return aVal-bVal
				else
					return bVal-aVal
			});
		}
	},
	/**
	*   @desc: inner sorting routine
	*   @type: private
	*   @topic: 7
	*/
	_sortRows:function(col, type, order, arrTS){
		this._sortCore(col, type, order, arrTS, this.rowsBuffer);
		this._reset_view();
		this.callEvent("onGridReconstructed", []);
	},
//#}		
	_reset_view:function(skip){
		if (!this.obj.rows[0]) return;
		this.callEvent("onResetView",[]);
		var tb = this.obj.rows[0].parentNode;
		var tr = tb.removeChild(tb.childNodes[0], true)
	    if (_isKHTML) //Safari 2x
	    	for (var i = tb.parentNode.childNodes.length-1; i >= 0; i--) { if (tb.parentNode.childNodes[i].tagName=="TR") tb.parentNode.removeChild(tb.parentNode.childNodes[i],true); }
	    else if (_isIE)
			for (var i = tb.childNodes.length-1; i >= 0; i--) tb.childNodes[i].removeNode(true);
		else
			tb.innerHTML="";
		tb.appendChild(tr)
		this.rowsCol=dhtmlxArray();
		if (this._sst)
			this.enableStableSorting(true);
		this._fillers=this.undefined;
		if (!skip){
		    if (_isIE && this._srnd){
		        // var p=this._get_view_size;
		        // this._get_view_size=function(){ return 1; }
    		    this.render_dataset();
    		    // this._get_view_size=p;
    		}
    	    else
    	        this.render_dataset();
	    }
		
		
	},
	
	/**
	*   @desc: delete row from the grid
	*   @param: row_id - row ID
	*   @type:  public
	*/		
	deleteRow:function(row_id, node){
		if (!node)
			node=this.getRowById(row_id)
	
		if (!node)
			return;
	
		this.editStop();
		if (!this._realfake)
			if (this.callEvent("onBeforeRowDeleted", [row_id]) == false)
				return false;
		
		var pid=0;
		if (this.cellType._dhx_find("tree") != -1 && !this._realfake){
			pid=this._h2.get[row_id].parent.id;
			this._removeTrGrRow(node);
		}
		else {
			if (node.parentNode)
				node.parentNode.removeChild(node);
	
			var ind = this.rowsCol._dhx_find(node);
	
			if (ind != -1)
				this.rowsCol._dhx_removeAt(ind);
	
			for (var i = 0; i < this.rowsBuffer.length; i++)
				if (this.rowsBuffer[i]&&this.rowsBuffer[i].idd == row_id){
					this.rowsBuffer._dhx_removeAt(i);
					ind=i;
					break;
				}
		}
		this.rowsAr[row_id]=null;
	
		for (var i = 0; i < this.selectedRows.length; i++)
			if (this.selectedRows[i].idd == row_id)
				this.selectedRows._dhx_removeAt(i);
	
		if (this._srnd){
			for (var i = 0; i < this._fillers.length; i++){
				var f = this._fillers[i]
	            if (!f) continue; //can be null	
				if (f[0] >= ind)
					f[0]=f[0]-1;
				else if (f[1] >= ind)
					f[1]=f[1]-1;
			};
	
			this._update_srnd_view();
		}
	
		if (this.pagingOn)
			this.changePage();
		if (!this._realfake)  this.callEvent("onAfterRowDeleted", [row_id,pid]);
		this.callEvent("onGridReconstructed", []);
		if (this._ahgr) this.setSizes();
		return true;
	},
	
	_addRow:function(new_id, text, ind){
		if (ind == -1|| typeof ind == "undefined")
			ind=this.rowsBuffer.length;
		if (typeof text == "string") text=text.split(this.delim);
		var row = this._prepareRow(new_id);
		row._attrs={
		};
	
		for (var j = 0; j < row.childNodes.length; j++)row.childNodes[j]._attrs={
		};
	
	
		this.rowsAr[row.idd]=row;
		if (this._h2) this._h2.get[row.idd].buff=row;	//treegrid specific
		this._fillRow(row, text)
		this._postRowProcessing(row)
		if (this._skipInsert){
			this._skipInsert=false;
			return this.rowsAr[row.idd]=row;
		}
	
		if (this.pagingOn){
			this.rowsBuffer._dhx_insertAt(ind,row);
			this.rowsAr[row.idd]=row;
			return row;
		}
	
		if (this._fillers){ 
			this.rowsCol._dhx_insertAt(ind, null);
			this.rowsBuffer._dhx_insertAt(ind,row);
			if (this._fake) this._fake.rowsCol._dhx_insertAt(ind, null);
			this.rowsAr[row.idd]=row;
			var found = false;
	
			for (var i = 0; i < this._fillers.length; i++){
				var f = this._fillers[i];
	
				if (f&&f[0] <= ind&&(f[0]+f[1]) >= ind){
					f[1]=f[1]+1;
					f[2].firstChild.style.height=parseInt(f[2].firstChild.style.height)+this._srdh+"px";
					found=true;
					if (this._fake) this._fake._fillers[i][1]++;
				}
	
				if (f&&f[0] > ind){
					f[0]=f[0]+1
					if (this._fake) this._fake._fillers[i][0]++;
				}
			}
	
			if (!found)
				this._fillers.push(this._add_filler(ind, 1, (ind == 0 ? {
					parentNode: this.obj.rows[0].parentNode,
					nextSibling: (this.rowsCol[1])
					} : this.rowsCol[ind-1]), true));
	
			return row;
		}
		this.rowsBuffer._dhx_insertAt(ind,row);
		return this._insertRowAt(row, ind);
	},
	
	/**
	*   @desc: add row to the grid
	*   @param: new_id - row ID, must be unique
	*   @param: text - row values, may be a comma separated list or an array
	*   @param: ind - index of new row, optional, row added to the last position by default
	*   @type:  public
	*/	
	addRow:function(new_id, text, ind){
		var r = this._addRow(new_id, text, ind);
	
		if (!this.dragContext)
			this.callEvent("onRowAdded", [new_id]);
	
		if (this.pagingOn)
			this.changePage(this.currentPage)
	
		if (this._srnd)
			this._update_srnd_view();
	
		r._added=true;
	
		if (this._ahgr)
			this.setSizes();
		this.callEvent("onGridReconstructed", []);
		return r;
	},
	
	_insertRowAt:function(r, ind, skip){
		this.rowsAr[r.idd]=r;
	
		if (this._skipInsert){
			this._skipInsert=false;
			return r;
		}
	
		if ((ind < 0)||((!ind)&&(parseInt(ind) !== 0)))
			ind=this.rowsCol.length;
		else {
			if (ind > this.rowsCol.length)
				ind=this.rowsCol.length;
		}
	
		if (this._cssEven){
			if ((this._cssSP ? this.getLevel(r.idd) : ind)%2 == 1)
				r.className+=" "+this._cssUnEven+(this._cssSU ? (" "+this._cssUnEven+"_"+this.getLevel(r.idd)) : "");
			else
				r.className+=" "+this._cssEven+(this._cssSU ? (" "+this._cssEven+"_"+this.getLevel(r.idd)) : "");
		}
		/*
		if (r._skipInsert) {                
			this.rowsAr[r.idd] = r;
			return r;
		}*/
		if (!skip)
			if ((ind == (this.obj.rows.length-1))||(!this.rowsCol[ind]))
				if (_isKHTML)
					this.obj.appendChild(r);
				else {
					this.obj.firstChild.appendChild(r);
				}
			else {
				this.rowsCol[ind].parentNode.insertBefore(r, this.rowsCol[ind]);
			}
	
		this.rowsCol._dhx_insertAt(ind, r);
		this.callEvent("onRowInserted",[r, ind]);
		return r;
	},
	
	getRowById:function(id){
		var row = this.rowsAr[id];
	
		if (row){
			if (row.tagName != "TR"){
				for (var i = 0; i < this.rowsBuffer.length; i++)
					if (this.rowsBuffer[i] && this.rowsBuffer[i].idd == id)
						return this.render_row(i);
				if (this._h2) return this.render_row(null,row.idd);
			}
			return row;
		}
		return null;
	},
	
/**
*   @desc: gets dhtmlXGridCellObject object (if no arguments then gets dhtmlXGridCellObject object of currently selected cell)
*   @param: row_id -  row id
*   @param: col -  column index
*   @returns: dhtmlXGridCellObject object (see its methods below)
*   @type: public
*   @topic: 4
*/
	cellById:function(row_id, col){
		return this.cells(row_id, col);
	},
/**
*   @desc: gets dhtmlXGridCellObject object (if no arguments then gets dhtmlXGridCellObject object of currently selected cell)
*   @param: row_id -  row id
*   @param: col -  column index
*   @returns: dhtmlXGridCellObject object (use it to get/set value to cell etc.)
*   @type: public
*   @topic: 4
*/
	cells:function(row_id, col){
		if (arguments.length == 0)
			return this.cells4(this.cell);
		else
			var c = this.getRowById(row_id);
		var cell = (c._childIndexes ? c.childNodes[c._childIndexes[col]] : c.childNodes[col]);
		return this.cells4(cell);
	},
	/**
	*   @desc: gets dhtmlXGridCellObject object
	*   @param: row_index -  row index
	*   @param: col -  column index
	*   @returns: dhtmlXGridCellObject object (see its methods below)
	*   @type: public
	*   @topic: 4
	*/
	cellByIndex:function(row_index, col){
		return this.cells2(row_index, col);
	},
	/**
	*   @desc: gets dhtmlXGridCellObject object
	*   @param: row_index -  row index
	*   @param: col -  column index
	*   @returns: dhtmlXGridCellObject object (see its methods below)
	*   @type: public
	*   @topic: 4
	*/
	cells2:function(row_index, col){
		var c = this.render_row(row_index);
		var cell = (c._childIndexes ? c.childNodes[c._childIndexes[col]] : c.childNodes[col]);
		return this.cells4(cell);
	},
	/**
	*   @desc: gets exCell editor for row  object and column id
	*   @type: private
	*   @topic: 4
	*/
	cells3:function(row, col){
		var cell = (row._childIndexes ? row.childNodes[row._childIndexes[col]] : row.childNodes[col]);
		return this.cells4(cell);
	},
	/**
	*   @desc: gets exCell editor for cell  object
	*   @type: private
	*   @topic: 4
	*/
	cells4:function(cell){
		var type = window["eXcell_"+(cell._cellType||this.cellType[cell._cellIndex])];

		if (type)
			return new type(cell);
	},	
	cells5:function(cell, type){ 
		var type = type||(cell._cellType||this.cellType[cell._cellIndex]);
	
		if (!this._ecache[type]){
			if (!window["eXcell_"+type])
				var tex = eXcell_ro;
			else
				var tex = window["eXcell_"+type];
	
			this._ecache[type]=new tex(cell);
		}
		this._ecache[type].cell=cell;
		return this._ecache[type];
	},
	dma:function(mode){
		if (!this._ecache)
			this._ecache={
			};
	
		if (mode&&!this._dma){
			this._dma=this.cells4;
			this.cells4=this.cells5;
		} else if (!mode&&this._dma){
			this.cells4=this._dma;
			this._dma=null;
		}
	},
	
	/**
	*   @desc: returns count of row in grid ( in case of dynamic mode it will return expected count of rows )
	*   @type:  public
	*	@returns: count of rows in grid
	*/	
	getRowsNum:function(){
		return this.rowsBuffer.length;
	},
	
	
	/**
	*   @desc: enables/disables mode when readonly cell is not available with tab 
	*   @param: mode - (boolean) true/false
	*   @type:  public
	*/
	enableEditTabOnly:function(mode){
		if (arguments.length > 0)
			this.smartTabOrder=convertStringToBoolean(mode);
		else
			this.smartTabOrder=true;
	},
	/**
	*   @desc: sets elements which get focus when tab is pressed in the last or first (tab+shift) cell 
	*   @param: start - html object or its id - gets focus when tab+shift are pressed in the first cell  
	*   @param: end - html object or its id - gets focus when tab is pressed in the last cell  
	*   @type:  public
	*/
	setExternalTabOrder:function(start, end){
		var grid = this;
		this.tabStart=( typeof (start) == "object") ? start : document.getElementById(start);
		this.tabStart.onkeydown=function(e){
			var ev = (e||window.event);
			if (ev.keyCode == 9){
				
				ev.cancelBubble=true;		
				grid.selectCell(0, 0, 0, 0, 1);
	
				if (grid.smartTabOrder && grid.cells2(0, 0).isDisabled()){
					grid._key_events["k9_0_0"].call(grid);
				}
				this.blur();
				return false;
			}
		};
		if(_isOpera) this.tabStart.onkeypress = this.tabStart.onkeydown;
		this.tabEnd=( typeof (end) == "object") ? end : document.getElementById(end);
		this.tabEnd.onkeydown=this.tabEnd.onkeypress=function(e){
			var ev = (e||window.event);
			if ((ev.keyCode == 9)&&ev.shiftKey){
				ev.cancelBubble=true;
				grid.selectCell((grid.getRowsNum()-1), (grid.getColumnCount()-1), 0, 0, 1);
	
				if (grid.smartTabOrder && grid.cells2((grid.getRowsNum()-1), (grid.getColumnCount()-1)).isDisabled()){
					grid._key_events["k9_0_1"].call(grid);
				}
				this.blur();
				return false;
			}
		};
		if(_isOpera) this.tabEnd.onkeypress = this.tabEnd.onkeydown;
	},
	/**
	*   @desc: returns unique ID
	*   @type:  public
	*/	
	uid:function(){
		if (!this._ui_seed) this._ui_seed=(new Date()).valueOf();
		return this._ui_seed++;
	},
	/**
	*   @desc: clears existing grid state and load new XML
	*   @type:  public
	*/
	clearAndLoad:function(){
		var t=this._pgn_skin; this._pgn_skin=null;
		this.clearAll();
		this._pgn_skin=t;
		this.load.apply(this,arguments);
	},
	/**
	*   @desc: returns details about current grid state
	*   @type:  public
	*/
	getStateOfView:function(){
		if (this.pagingOn){
			var start = (this.currentPage-1)*this.rowsBufferOutSize;
			return [this.currentPage, start, Math.min(start+this.rowsBufferOutSize,this.rowsBuffer.length), this.rowsBuffer.length ];
		}
 		return [
            Math.floor(this.objBox.scrollTop/this._srdh),
			Math.ceil(parseInt(this.objBox.offsetHeight)/this._srdh),
			this.rowsBuffer.length
			];
	}
};

//grid
(function(){
	//local helpers
	function direct_set(name,value){ this[name]=value; 	}
	function direct_call(name,value){ this[name].call(this,value); 	}
	function joined_call(name,value){ this[name].call(this,value.join(this.delim));  }
	function set_options(name,value){
		for (var i=0; i < value.length; i++) 
			if (typeof value[i] == "object"){
				var combo = this.getCombo(i);
				for (var key in value[i])
					combo.put(key, value[i][key]);
			}
	}
	function header_set(name,value,obj){
		//make a matrix
		var rows = 1;
		var header = [];
		function add(i,j,value){
			if (!header[j]) header[j]=[];
			if (typeof value == "object") value.toString=function(){ return this.text; }
			header[j][i]=value;
		}
		
		for (var i=0; i<value.length; i++) {
			if (typeof(value[i])=="object" && value[i].length){
				for (var j=0; j < value[i].length; j++)
					add(i,j,value[i][j]);		
			} else
				add(i,0,value[i]);		
		}
		for (var i=0; i<header.length; i++)
			for (var j=0; j<header[0].length; j++){
				var h=header[i][j];
				header[i][j]=(h||"").toString()||"&nbsp;";
				if (h&&h.colspan)
					for (var k=1; k < h.colspan; k++) add(j+k,i,"#cspan");
				if (h&&h.rowspan)
					for (var k=1; k < h.rowspan; k++) add(j,i+k,"#rspan");
			}
				
		this.setHeader(header[0]);
		for (var i=1; i < header.length; i++) 
			this.attachHeader(header[i]);
	}
	
	//defenitions
	var columns_map=[
		{name:"label", 	def:"&nbsp;", 	operation:"setHeader",		type:header_set		},
		{name:"id", 	def:"", 		operation:"columnIds",		type:direct_set		},
		{name:"width", 	def:"*", 		operation:"setInitWidths", 	type:joined_call	},
		{name:"align", 	def:"left", 	operation:"cellAlign",		type:direct_set		},
		{name:"valign", def:"middle", 	operation:"cellVAlign",		type:direct_set		},
		{name:"sort", 	def:"na", 		operation:"fldSort",		type:direct_set		},
		{name:"type", 	def:"ro", 		operation:"setColTypes",	type:joined_call	},
		{name:"options",def:"", 		operation:"",				type:set_options	}
	];
	
	//extending	
	dhtmlx.extend_api("dhtmlXGridObject",{
		_init:function(obj){
			return [obj.parent];
		},
		image_path:"setImagePath",
		columns:"columns",
		rows:"rows",
		headers:"headers",
		skin:"setSkin",
		smart_rendering:"enableSmartRendering",
		css:"enableAlterCss",
		auto_height:"enableAutoHeight",
		save_hidden:"enableAutoHiddenColumnsSaving",
		save_cookie:"enableAutoSaving",
		save_size:"enableAutoSizeSaving",
		auto_width:"enableAutoWidth",
		block_selection:"enableBlockSelection",
		csv_id:"enableCSVAutoID",
		csv_header:"enableCSVHeader",
		cell_ids:"enableCellIds",
		colspan:"enableColSpan",
		column_move:"enableColumnMove",
		context_menu:"enableContextMenu",
		distributed:"enableDistributedParsing",
		drag:"enableDragAndDrop",
		drag_order:"enableDragOrder",
		tabulation:"enableEditTabOnly",
		header_images:"enableHeaderImages",
		header_menu:"enableHeaderMenu",
		keymap:"enableKeyboardSupport",
		mouse_navigation:"enableLightMouseNavigation",
		markers:"enableMarkedCells",
		math_editing:"enableMathEditing",
		math_serialization:"enableMathSerialization",
		drag_copy:"enableMercyDrag",
		multiline:"enableMultiline",
		multiselect:"enableMultiselect",
		save_column_order:"enableOrderSaving",
		hover:"enableRowsHover",
		rowspan:"enableRowspan",
		smart:"enableSmartRendering",
		save_sorting:"enableSortingSaving",
		stable_sorting:"enableStableSorting",
		undo:"enableUndoRedo",
		csv_cell:"setCSVDelimiter",
		date_format:"setDateFormat",
		drag_behavior:"setDragBehavior",
		editable:"setEditable",
		without_header:"setNoHeader",
		submit_changed:"submitOnlyChanged",
		submit_serialization:"submitSerialization",
		submit_selected:"submitOnlySelected",
		submit_id:"submitOnlyRowID",		
		xml:"load"
	},{
		columns:function(obj){
			for (var j=0; j<columns_map.length; j++){
				var settings = [];
				for (var i=0; i<obj.length; i++)
					settings[i]=obj[i][columns_map[j].name]||columns_map[j].def;
			var type=columns_map[j].type||direct_call;
				type.call(this,columns_map[j].operation,settings,obj);
			}
			this.init();
		},
		rows:function(obj){
			
		},
		headers:function(obj){
			for (var i=0; i < obj.length; i++) 
				this.attachHeader(obj[i]);
		}
	});

})();


dhtmlXGridObject.prototype._dp_init=function(dp){
	dp.attachEvent("insertCallback", function(upd, id) {
		if (this.obj._h2)
			this.obj.addRow(id, row, null, parent);
		else
			this.obj.addRow(id, [], 0);
			
		var row = this.obj.getRowById(id);
		if (row){
			this.obj._process_xml_row(row, upd.firstChild);
			this.obj._postRowProcessing(row);	
		}
	});
	dp.attachEvent("updateCallback", function(upd, id) {
		var row = this.obj.getRowById(id);
		if (row){
			this.obj._process_xml_row(row, upd.firstChild);
			this.obj._postRowProcessing(row);	
		}
	});
	dp.attachEvent("deleteCallback", function(upd, id) {
		this.obj.setUserData(id, this.action_param, "true_deleted");
		this.obj.deleteRow(id);
	});
	

	dp._methods=["setRowTextStyle","setCellTextStyle","changeRowId","deleteRow"];
	this.attachEvent("onEditCell",function(state,id,index){
		if (dp._columns && !dp._columns[index]) return true;
		var cell = this.cells(id,index)
		if (state==1){
			if(cell.isCheckbox()){
				dp.setUpdated(id,true)
			}
		} else if (state==2){
			if(cell.wasChanged()){
				dp.setUpdated(id,true)
			}
		}
    	return true;
	});
	this.attachEvent("onRowPaste",function(id){
		dp.setUpdated(id,true)
	});
	this.attachEvent("onRowIdChange",function(id,newid){
		var ind=dp.findRow(id);
		if (ind<dp.updatedRows.length)
			dp.updatedRows[ind]=newid;
	});
	this.attachEvent("onSelectStateChanged",function(rowId){
		if(dp.updateMode=="row")
			dp.sendData();
        return true;
	});
	this.attachEvent("onEnter",function(rowId,celInd){
		if(dp.updateMode=="row")
			dp.sendData();
        return true;
	});
	this.attachEvent("onBeforeRowDeleted",function(rowId){
		if (!this.rowsAr[rowId]) return true;
		if (this.dragContext && dp.dnd) {
			window.setTimeout(function(){
				dp.setUpdated(rowId,true);
			},1);
			return true;
		}
    	var z=dp.getState(rowId);
		if (this._h2){
			this._h2.forEachChild(rowId,function(el){
				dp.setUpdated(el.id,false);
				dp.markRow(el.id,true,"deleted");
			},this);
		}
		if (z=="inserted") {  dp.set_invalid(rowId,false); dp.setUpdated(rowId,false);		return true; }
		if (z=="deleted")  return false;
		if (z=="true_deleted")  { dp.setUpdated(rowId,false); return true; }

		dp.setUpdated(rowId,true,"deleted");
		return false;
	});
	this.attachEvent("onBindUpdate", function(id){
		dp.setUpdated(id,true);
	});
	this.attachEvent("onRowAdded",function(rowId){
		if (this.dragContext && dp.dnd) return true;
		dp.setUpdated(rowId,true,"inserted")
    	return true;
	});
	dp._getRowData=function(rowId,pref){
		var data = [];
		
		data["gr_id"]=rowId;
		if (this.obj.isTreeGrid())
			data["gr_pid"]=this.obj.getParentId(rowId);
		
		var r=this.obj.getRowById(rowId);
		for (var i=0; i<this.obj._cCount; i++){
		   if (this.obj._c_order)
		   		var i_c=this.obj._c_order[i];
		   else
			   	var i_c=i;
		
		   var c=this.obj.cells(r.idd,i);
		   if (this._changed && !c.wasChanged()) continue;
		   if (this._endnm)
		       data[this.obj.getColumnId(i)]=c.getValue();
		   else
		       data["c"+i_c]=c.getValue();
		}
		   
		var udata=this.obj.UserData[rowId];
		if (udata){
			for (var j=0; j<udata.keys.length; j++)
				if (udata.keys[j] && udata.keys[j].indexOf("__")!=0)
					data[udata.keys[j]]=udata.values[j];
		}
		var udata=this.obj.UserData["gridglobaluserdata"];
		if (udata){
		   for (var j=0; j<udata.keys.length; j++)
		       data[udata.keys[j]]=udata.values[j];
		}
		return data;
	};
	dp._clearUpdateFlag=function(rowId){
		var row=this.obj.getRowById(rowId);
		if (row)
		for (var j=0; j<this.obj._cCount; j++)
			this.obj.cells(rowId,j).cell.wasChanged=false;	//using cells because of split
	};
	dp.checkBeforeUpdate=function(rowId){ 
		var valid=true; var c_invalid=[];
		for (var i=0; i<this.obj._cCount; i++)
			if (this.mandatoryFields[i]){
				var res=this.mandatoryFields[i].call(this.obj,this.obj.cells(rowId,i).getValue(),rowId,i);
				if (typeof res == "string"){
					this.messages.push(res);
					valid = false;
				} else {
					valid&=res;
					c_invalid[i]=!res;
				}
			}
		if (!valid){
			this.set_invalid(rowId,"invalid",c_invalid);
			this.setUpdated(rowId,false);
		}
		return valid;
	};	
};


//(c)dhtmlx ltd. www.dhtmlx.com




/**
*     @desc: enables block selection mode in grid
*     @type: public
*     @topic: 0
*/
dhtmlXGridObject.prototype.enableBlockSelection = function(mode)
{
	if (typeof this._bs_mode == "undefined"){
		var self = this;
		this.obj.onmousedown = function(e) {
			if (self._bs_mode) self._OnSelectionStart((e||event),this); return true;
		}
		this._CSVRowDelimiter = this.csv.row;
		this.attachEvent("onResize", function() {self._HideSelection(); return true;});
		this.attachEvent("onGridReconstructed", function() {self._HideSelection(); return true;});
		this.attachEvent("onFilterEnd",this._HideSelection);
	}
	if (mode===false){
		this._bs_mode=false;
		return this._HideSelection();
	} else this._bs_mode=true;
}
/**
*     @desc:  affect block selection, so it will copy|paste only visible text , not values behind
*	  @param: mode - true/false
*     @type: public
*     @topic: 0
*/
dhtmlXGridObject.prototype.forceLabelSelection = function(mode)
{
	this._strictText = convertStringToBoolean(mode)
}


dhtmlXGridObject.prototype.disableBlockSelection = function()
{
	this.obj.onmousedown = null;
}
	
dhtmlXGridObject.prototype._OnSelectionStart = function(event, obj)
{

	var self = this;
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
	    while (src.tagName.toLowerCase() != 'td')
	        src = src.parentNode;
	    this._startSelectionCell = src;
	}
	
	if (this._startSelectionCell){
		if (!this.callEvent("onBeforeBlockSelected",[this._startSelectionCell.parentNode.idd, this._startSelectionCell._cellIndex]))
			return this._startSelectionCell = null;
	}
	
	    //this._ShowSelection();
	    this.obj.onmousedown = null;
		this.obj[_isIE?"onmouseleave":"onmouseout"] = function(e){ if (self._blsTimer) window.clearTimeout(self._blsTimer); };	    
		this.obj.onmmold=this.obj.onmousemove;
		this._init_pos=[x,y];
	    this._selectionObj.onmousemove = this.obj.onmousemove = function(e) {e = e||event; e.returnValue = false;  self._OnSelectionMove(e);}
	    
	    
	    this._oldDMP=document.body.onmouseup;
	    document.body.onmouseup = function(e) {e = e||event; self._OnSelectionStop(e, this); return true; }
	this.callEvent("onBeforeBlockSelection",[]);
	document.body.onselectstart = function(){return false};//avoid text select	    
}

dhtmlXGridObject.prototype._getCellByPos = function(x,y){
	x=x;//+this.objBox.scrollLeft;
	if (this._fake)
		x+=this._fake.entBox.offsetWidth;
	y=y;//+this.objBox.scrollTop;
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
		x-=this.getColWidth(i);
		if (x<=0) {
			while(true){
				if (_x._childIndexes && _x._childIndexes[i+1]==_x._childIndexes[i])
					_x=_x.previousSibling;
				else {
					return this.cells(_x.idd,i).cell;
				}
				
			}
		}
	}
	return null;
}

dhtmlXGridObject.prototype._OnSelectionMove = function(event)
{ 
	
	var self=this;
	this._ShowSelection();
	var pos = this.getPosition(this.obj);
	var X = event.clientX - pos[0] + (document.body.scrollLeft||(document.documentElement?document.documentElement.scrollLeft:0));
	var Y = event.clientY - pos[1] + (document.body.scrollTop||(document.documentElement?document.documentElement.scrollTop:0));

	if ((Math.abs(this._init_pos[0]-X)<5) && (Math.abs(this._init_pos[1]-Y)<5)) return this._HideSelection();
	
	var temp = this._endSelectionCell;
	if(this._startSelectionCell==null)
 		this._endSelectionCell  = this._startSelectionCell = this.getFirstParentOfType(event.srcElement || event.target,"TD");		
	else
		if (event.srcElement || event.target) {
			if ((event.srcElement || event.target).className == "dhtmlxGrid_selection")
				this._endSelectionCell=(this._getCellByPos(X,Y)||this._endSelectionCell);
			else {
				var t = this.getFirstParentOfType(event.srcElement || event.target,"TD");
				if (t.parentNode.idd) this._endSelectionCell = t;
			}
		}
		
	if (this._endSelectionCell){
		if (!this.callEvent("onBeforeBlockSelected",[this._endSelectionCell.parentNode.idd, this._endSelectionCell._cellIndex]))
			this._endSelectionCell = temp;
	}
	
		/*
	//window.status = pos[0]+'+'+pos[1];
	var prevX = this._selectionObj.startX;
	var prevY = this._selectionObj.startY;
	var diffX = X - prevX;
	var diffY = Y - prevY;
	
	if (diffX < 0) {
        this._selectionObj.style.left = this._selectionObj.startX + diffX + 1+"px";
        diffX = 0 - diffX;
	} else {
		this._selectionObj.style.left = this._selectionObj.startX - 3+"px";
	}
	if (diffY < 0) {
		this._selectionObj.style.top = this._selectionObj.startY + diffY + 1+"px";
        diffY = 0 - diffY;
	} else {
		this._selectionObj.style.top = this._selectionObj.startY - 3+"px";
	}
    this._selectionObj.style.width = (diffX>4?diffX-4:0) + 'px';
    this._selectionObj.style.height = (diffY>4?diffY-4:0) + 'px';


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
	
}

dhtmlXGridObject.prototype._OnSelectionStop = function(event)
{
	var self = this;
	if (this._blsTimer) window.clearTimeout(this._blsTimer);	
	this.obj.onmousedown = function(e) {if (self._bs_mode)  self._OnSelectionStart((e||event), this); return true;}
	this.obj.onmousemove = this.obj.onmmold||null;
	this._selectionObj.onmousemove = null;
	document.body.onmouseup = this._oldDMP||null;
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

//	td._cellIndex
//
//	getRowIndex
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

    if (LeftTop[0] < RightBottom[0]) {
		var Left = LeftTop[0];
		var Right = RightBottom[0] + RightBottom_width;
    } else {
    	var foo = pos.RightBottomCol;
        pos.RightBottomCol = pos.LeftTopCol;
        pos.LeftTopCol = foo;
		var Left = RightBottom[0];
		var Right = LeftTop[0] + LeftTop_width;
    }

    if (LeftTop[1] < RightBottom[1]) {
		var Top = LeftTop[1];
		var Bottom = RightBottom[1] + RightBottom_height;
    } else {
    	var foo = pos.RightBottomRow;
        pos.RightBottomRow = pos.LeftTopRow;
        pos.LeftTopRow = foo;
		var Top = RightBottom[1];
		var Bottom = LeftTop[1] + LeftTop_height;
    }

    var Width = Right - Left;
    var Height = Bottom - Top;

	this._selectionObj.style.left = Left + 'px';
	this._selectionObj.style.top = Top + 'px';
	this._selectionObj.style.width =  Width  + 'px';
	this._selectionObj.style.height = Height + 'px';
	return pos;
}

dhtmlXGridObject.prototype._CreateSelection = function(x, y)
{
	if (this._selectionObj == null) {
		var div = document.createElement('div');
		div.style.position = 'absolute';
        div.style.display = 'none';
        div.className = 'dhtmlxGrid_selection';
		this._selectionObj = div;
		this._selectionObj.onmousedown = function(e){
			e=e||event;
			if (e.button==2 || (_isMacOS&&e.ctrlKey))
				return this.parentNode.grid.callEvent("onBlockRightClick", ["BLOCK",e]);
		}
		this._selectionObj.oncontextmenu=function(e){(e||event).cancelBubble=true;return false;}
		this.objBox.appendChild(this._selectionObj);
	}
    //this._selectionObj.style.border = '1px solid #83abeb';
    this._selectionObj.style.width = '0px';
    this._selectionObj.style.height = '0px';
    //this._selectionObj.style.border = '0px';
	this._selectionObj.style.left = x + 'px';
	this._selectionObj.style.top  = y + 'px';
    this._selectionObj.startX = x;
    this._selectionObj.startY = y;
}

dhtmlXGridObject.prototype._ShowSelection = function()
{
	if (this._selectionObj)
	    this._selectionObj.style.display = '';
}

dhtmlXGridObject.prototype._HideSelection = function()
{
	
	if (this._selectionObj)
	    this._selectionObj.style.display = 'none';
    this._selectionArea = null;
}
/**
*     @desc: copy content of block selection into clipboard in csv format (delimiter as set for csv serialization)
*     @type: public
*     @topic: 0
*/
dhtmlXGridObject.prototype.copyBlockToClipboard = function()
{
	if ( this._selectionArea != null ) {
		var serialized = new Array();
	if (this._mathSerialization)
         this._agetm="getMathValue";
    else if (this._strictText)
    	this._agetm="getTitle";
    else this._agetm="getValue";

		for (var i=this._selectionArea.LeftTopRow; i<=this._selectionArea.RightBottomRow; i++) {
			var data = this._serializeRowToCVS(this.rowsBuffer[i], null,  this._selectionArea.LeftTopCol, this._selectionArea.RightBottomCol+1);
			if (!this._csvAID)
				serialized[serialized.length] = data.substr( data.indexOf( this.csv.cell ) + 1 );	//remove row ID and add to array
			else
				serialized[serialized.length] = data;
		}
		serialized = serialized.join(this._CSVRowDelimiter);
		this.toClipBoard(serialized);
	}
}
/**
*     @desc: paste content of clipboard into block selection of grid
*     @type: public
*     @topic: 0
*/
dhtmlXGridObject.prototype.pasteBlockFromClipboard = function()
{
	var serialized = this.fromClipBoard();
    if (this._selectionArea != null) {
        var startRow = this._selectionArea.LeftTopRow;
        var startCol = this._selectionArea.LeftTopCol;
    } else if (this.cell != null && !this.editor) {
        var startRow = this.getRowIndex( this.cell.parentNode.idd );
        var startCol = this.cell._cellIndex;
    } else {
        return false;
    }

	serialized = this.csvParser.unblock(serialized, this.csv.cell, this.csv.row);
   // if ((serialized.length >1)&&(serialized[serialized.length-1]==""))
   // serialized.splice(serialized.length-1,1);
     
   //	if (serialized[serialized.length-1]=="") serialized.pop();
 /*   for (var i=0; i<serialized.length; i++) {
        serialized[i] = serialized[i].split(this.csv.cell);
    }*/
    var endRow = startRow+serialized.length;
    var endCol = startCol+serialized[0].length;
    if (endCol > this._cCount)
		endCol = this._cCount;
    var k = 0;
    for (var i=startRow; i<endRow; i++) {
        var row = this.render_row(i);
        if (row==-1) continue;
        var l = 0;
        for (var j=startCol; j<endCol; j++) {
        	var ed = this.cells3(row, j);
        	if (ed.isDisabled()) {
        	    l++;
        	    continue;
        	}
        	if (this._onEditUndoRedo)
        		this._onEditUndoRedo(2, row.idd, j, serialized[ k ][ l ], ed.getValue());
        	if (ed.combo){
				var comboVa = ed.combo.values;
				for(var n=0; n<comboVa.length; n++)
					if (serialized[ k ][ l ] == comboVa[n]){
						ed.setValue( ed.combo.keys[ n ]);
						comboVa=null;
						break;
					}
				if (comboVa!=null && ed.editable) ed.setValue( serialized[ k ][ l++ ] );
				else l++;
        	}else
        		ed[ ed.setImage ? "setLabel" : "setValue" ]( serialized[ k ][ l++ ] );
        	ed.cell.wasChanged=true;
        }
        this.callEvent("onRowPaste",[row.idd])
        k++;
    }
}

dhtmlXGridObject.prototype.getSelectedBlock = function() {
	// if block selection exists
	if (this._selectionArea)
		return this._selectionArea;
	else if (this.getSelectedRowId() !== null){
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
//(c)dhtmlx ltd. www.dhtmlx.com




dhtmlXGridObject.prototype.toPDF=function(url,mode,header,footer,rows,target){
	var save_sel = {
		row: this.getSelectedRowId(),
		col: this.getSelectedCellIndex()
	};
	if (save_sel.row === null || save_sel.col === -1)
		save_sel = false;
	else {
		var el = this.cells(save_sel.row, save_sel.col).cell;
		el.parentNode.className = el.parentNode.className.replace(' rowselected', '');
		el.className = el.className.replace(' cellselected', '');
		save_sel.el = el;
	}
	mode = mode || "color";	
	var full_color = mode == "full_color";
	var grid = this;
	grid._asCDATA = true;
	if (typeof(target) === 'undefined')
		this.target = " target=\"_blank\"";
	else
		this.target = target;
		
	eXcell_ch.prototype.getContent = function(){
		return this.getValue();
	};
	eXcell_ra.prototype.getContent = function(){
		return this.getValue();
	};
	function xml_top(profile) {
		var spans = [];
		for (var i=1; i<grid.hdr.rows.length; i++){
			spans[i]=[];
			for (var j=0; j<grid._cCount; j++){
				var cell = grid.hdr.rows[i].childNodes[j];
				if (!spans[i][j])
					spans[i][j]=[0,0];
				if (cell)
					spans[i][cell._cellIndexS]=[cell.colSpan, cell.rowSpan];
			}
		}
		
	    var xml = "<rows profile='"+profile+"'";
	       if (header)
	          xml+=" header='"+header+"'";
	       if (footer)
	          xml+=" footer='"+footer+"'";
	    xml+="><head>"+grid._serialiseExportConfig(spans).replace(/^<head/,"<columns").replace(/head>$/,"columns>");
	    for (var i=2; i < grid.hdr.rows.length; i++) {
                var empty_cols = 0;
                var row = grid.hdr.rows[i];
    	        var cxml="";
	    	for (var j=0; j < grid._cCount; j++) {
	    		if ((grid._srClmn && !grid._srClmn[j]) || (grid._hrrar[j])) {
	    			empty_cols++;
	    			continue;
    			}
	    		var s = spans[i][j];
	    		var rspan =  (( s[0] && s[0] > 1 ) ? ' colspan="'+s[0]+'" ' : "");
                        if (s[1] && s[1] > 1){
                             rspan+=' rowspan="'+s[1]+'" ';
                             empty_cols = -1;
                        }
                        
                
                var val = "";
                for (var k=0; k<row.cells.length; k++){
					if (row.cells[k]._cellIndexS==j) {
						if (row.cells[k].getElementsByTagName("SELECT").length)
							val="";
						else
							val = _isIE?row.cells[k].innerText:row.cells[k].textContent;
							val=val.replace(/[ \n\r\t\xA0]+/," ");
						break;
					}
				}
	    		if (!val || val==" ") empty_cols++;
	    		cxml+="<column"+rspan+"><![CDATA["+val+"]]></column>";
	    	};
	    	if (empty_cols != grid._cCount)
	    		xml+="\n<columns>"+cxml+"</columns>";
	    };
	    xml+="</head>\n";
	    xml+=xml_footer();
	    return xml;
	};
	
	function xml_body() {
		var xml =[];
	    if (rows)
	    	for (var i=0; i<rows.length; i++)
	    		xml.push(xml_row(grid.getRowIndex(rows[i])));
	    else
	    	for (var i=0; i<grid.getRowsNum(); i++)
	    		xml.push(xml_row(i));
	    return xml.join("\n");
	}
	function xml_footer() {
		var xml =["<foot>"];
		if (!grid.ftr) return "";
		for (var i=1; i < grid.ftr.rows.length; i++) {
			xml.push("<columns>");
			var row = grid.ftr.rows[i];
			for (var j=0; j < grid._cCount; j++){
				if (grid._srClmn && !grid._srClmn[j]) continue;
				if (grid._hrrar[j]) continue;
				for (var k=0; k<row.cells.length; k++){
				 	var val = "";
				 	var span = "";
					if (row.cells[k]._cellIndexS==j) {
						val = _isIE?row.cells[k].innerText:row.cells[k].textContent;
						val=val.replace(/[ \n\r\t\xA0]+/," ");
						
						if (row.cells[k].colSpan && row.cells[k].colSpan!=1)
							span = " colspan='"+row.cells[k].colSpan+"' ";
						
						if (row.cells[k].rowSpan && row.cells[k].rowSpan!=1)
							span = " rowspan='"+row.cells[k].rowSpan+"' ";
						break;
					}
				}
				xml.push("<column"+span+"><![CDATA["+val+"]]></column>");
			}
			xml.push("</columns>");
		};
		xml.push("</foot>");
	    return xml.join("\n");
	};
	function get_style(node, style){
		return (window.getComputedStyle?(window.getComputedStyle(node, null)[style]):(node.currentStyle?node.currentStyle[style]:null))||"";
	};
	
	function xml_row(ind){
		if (!grid.rowsBuffer[ind]) return "";
		var r = grid.render_row(ind);
		if (r.style.display=="none") return "";
		var xml = "<row>";
		for (var i=0; i < grid._cCount; i++) {
			if (((!grid._srClmn)||(grid._srClmn[i]))&&(!grid._hrrar[i])){
				var cell = grid.cells(r.idd, i);
				if (full_color){
					var text_color	= get_style(cell.cell,"color");
		        	var bg_color	= get_style(cell.cell,"backgroundColor");
					var bold		= get_style(cell.cell, "font-weight") || get_style(cell.cell, "fontWeight");
					var italic		= get_style(cell.cell, "font-style") || get_style(cell.cell, "fontStyle");
					var align		= get_style(cell.cell, "text-align") || get_style(cell.cell, "textAlign");
					var font	 = get_style(cell.cell, "font-family") || get_style(cell.cell, "fontFamily");
		        	if (bg_color == "transparent" || bg_color == "rgba(0, 0, 0, 0)") bg_color = "rgb(255,255,255)";
		        	xml+="<cell bgColor='"+bg_color+"' textColor='" + text_color + "' bold='" + bold + "' italic='" + italic + "' align='"+align+"' font='" + font + "'>";
				} else 
					xml+="<cell>";
				
				xml+="<![CDATA["+(cell.getContent?cell.getContent():cell.getTitle())+"]]></cell>";
			}
		};
		return xml+"</row>";
	}
	function xml_end(){
	    var xml = "</rows>";
	    return xml;
	}

	if (grid._fake){
	  	var st_hr = [].concat(grid._hrrar);
		for (var i=0; i < grid._fake._cCount; i++)
			grid._hrrar[i]=null;
	}
			
	var d=document.createElement("div");
	d.style.display="none";
	document.body.appendChild(d);
	var uid = "form_"+grid.uid();

	d.innerHTML = '<form id="'+uid+'" method="post" action="'+url+'" accept-charset="utf-8"  enctype="application/x-www-form-urlencoded"' + this.target + '><input type="hidden" name="grid_xml" id="grid_xml"/> </form>';
	document.getElementById(uid).firstChild.value = encodeURIComponent(xml_top(mode).replace("\u2013", "-") + xml_body() + xml_end());
	document.getElementById(uid).submit();
	d.parentNode.removeChild(d);


	
	if (grid._fake)
		grid._hrrar = st_hr;
			
	grid = null;
	
	if (save_sel) {
		save_sel.el.parentNode.className += ' rowselected';
		save_sel.el.className += ' cellselected';
	};
	save_sel = null;
};
dhtmlXGridObject.prototype._serialiseExportConfig=function(spans){
	var out = "<head>";

	for (var i = 0; i < this.hdr.rows[0].cells.length; i++){
		if (this._srClmn && !this._srClmn[i]) continue;
		if (this._hrrar[i]) continue;
		var sort = this.fldSort[i];
		if (sort == "cus"){
			sort = this._customSorts[i].toString();
			sort=sort.replace(/function[\ ]*/,"").replace(/\([^\f]*/,"");
		}
		var s = spans[1][i];
		var rpans = (( s[1] && s[1] > 1 ) ? ' rowspan="'+s[1]+'" ' : "")+(( s[0] && s[0] > 1 ) ? ' colspan="'+s[0]+'" ' : "");
		out+="<column "+rpans+" width='"+this.getColWidth(i)+"' align='"+this.cellAlign[i]+"' type='"+this.cellType[i] + "' hidden='" + ((this.isColumnHidden && this.isColumnHidden(i)) ? 'true' : 'false')
			+"' sort='"+(sort||"na")+"' color='"+(this.columnColor[i]||"")+"'"
			+(this.columnIds[i]
				? (" id='"+this.columnIds[i]+"'")
				: "")+">";
		if (this._asCDATA)
			out+="<![CDATA["+this.getHeaderCol(i)+"]]>";
		else
			out+=this.getHeaderCol(i);
		var z = this.getCombo(i);

		if (z)
			for (var j = 0; j < z.keys.length; j++)out+="<option value='"+z.keys[j]+"'>"+z.values[j]+"</option>";
		out+="</column>";
	}
	return out+="</head>";
};
if (window.eXcell_sub_row_grid)
	window.eXcell_sub_row_grid.prototype.getContent=function(){ return ""; };


dhtmlXGridObject.prototype.toExcel = function(url,mode,header,footer,rows) {
	if (!document.getElementById('ifr')) {
		var ifr = document.createElement('iframe');
		ifr.style.display = 'none';
		ifr.setAttribute('name', 'dhx_export_iframe');
		ifr.setAttribute('src', '');
		ifr.setAttribute('id', 'dhx_export_iframe');
		document.body.appendChild(ifr);
	}

	var target = " target=\"dhx_export_iframe\"";
	this.toPDF(url,mode,header,footer,rows,target);
}




/*
	keymap like MS Excel offers
*/
dhtmlXGridObject.prototype._key_events={
			k13_1_0:function(){
				this.editStop();
			},
			k13_0_1:function(){
				this.editStop();
				this._key_events.k38_0_0.call(this);
			},
			k13_0_0:function(){
				this.editStop();
				this.callEvent("onEnter",[(this.row?this.row.idd:null),(this.cell?this.cell._cellIndex:null)]);
				this._still_active=true;
				this._key_events.k40_0_0.call(this);
            },
            k9_0_0:function(){
				this.editStop();
				if (!this.callEvent("onTab",[true])) return true;
				if (this.cell && (this.cell._cellIndex+1)>=this._cCount) return;
				var z=this._getNextCell(null,1);
				if (z && this.row==z.parentNode){
					this.selectCell(z.parentNode,z._cellIndex,true,true);
					this._still_active=true;
				}
			},
			k9_0_1:function(){
				this.editStop();
				if (!this.callEvent("onTab",[false])) return true;
				if (this.cell && (this.cell._cellIndex==0)) return;
				var z=this._getNextCell(null,-1);
				if (z && this.row==z.parentNode) {
					this.selectCell(z.parentNode,z._cellIndex,true,true);
					this._still_active=true;
				}
            },
            k113_0_0:function(){
            	if (this._f2kE) this.editCell();
            },
            k32_0_0:function(){
            	var c=this.cells4(this.cell);
            	if (!c.changeState || (c.changeState()===false)) return false;
            },
            k27_0_0:function(){
            	this.editStop(true);
            	this._still_active=true;
            },
            k33_0_0:function(){
            	if(this.pagingOn)
            		this.changePage(this.currentPage-1);
            	else this.scrollPage(-1);            		
	        },
			k34_0_0:function(){
            	if(this.pagingOn)
            		this.changePage(this.currentPage+1);
            	else this.scrollPage(1);
	        },
			k37_0_0:function(){
				if (this.editor) return false;
            	if(this.isTreeGrid())
            		this.collapseKids(this.row)
            	else this._key_events.k9_0_1.call(this);
	        },
			k39_0_0:function(){
				if (this.editor) return false;
				if(!this.editor && this.isTreeGrid())
            		this.expandKids(this.row)
            	else this._key_events.k9_0_0.call(this);
            },
			k37_1_0:function(){
				if (this.editor) return false;
				this.selectCell(this.row,0,true);
	        },
			k39_1_0:function(){
				if (this.editor) return false;
				this.selectCell(this.row,this._cCount-1,true);
            }, 
			k38_1_0:function(){
				if (this.editor || !this.rowsCol.length) return false;
				this.selectCell(this.rowsCol[0],this.cell._cellIndex,true);
	        },
			k40_1_0:function(){
				if (this.editor || !this.rowsCol.length) return false;
				this.selectCell(this.rowsCol[this.rowsCol.length-1],this.cell._cellIndex,true);
            },
			k38_0_1:function(){
				if (this.editor || !this.rowsCol.length) return false;
				var rowInd = this.row.rowIndex;
				var nrow=this._nextRow(rowInd-1,-1);
				if (!nrow || nrow._sRow || nrow._rLoad) return false;
                this.selectCell(nrow,this.cell._cellIndex,true,true);
	        },
			k40_0_1:function(){
				if (this.editor || !this.rowsCol.length) return false;
				var rowInd = this.row.rowIndex;
				var nrow=this._nextRow(rowInd-1,1);
				if (!nrow || nrow._sRow || nrow._rLoad) return false;
                this.selectCell(nrow,this.cell._cellIndex,true,true);
            },     
			k38_1_1:function(){
				if (this.editor || !this.rowsCol.length) return false;
				var rowInd = this.row.rowIndex;
				for (var i = rowInd - 1; i >= 0; i--){
					this.selectCell(this.rowsCol[i],this.cell._cellIndex,true,true);
				}
	        },
			k40_1_1:function(){
				if (this.editor || !this.rowsCol.length) return false;
				var rowInd = this.row.rowIndex;
				for (var i = rowInd; i <this.rowsCol.length; i++){
					this.selectCell(this.rowsCol[i],this.cell._cellIndex,true,true);
				}
            },                   
			k40_0_0:function(){
				if (this.editor && this.editor.combo)
					this.editor.shiftNext();
				else{
					if (this.editor) return false;
					var rowInd = this.rowsCol._dhx_find(this.row)+1;
					if (rowInd && rowInd!=this.rowsCol.length && rowInd!=this.obj.rows.length-1){
						var nrow=this._nextRow(rowInd-1,1);
						if (nrow._sRow || nrow._rLoad) return false;
                        this.selectCell(nrow,this.cell._cellIndex,true);
                    }
                    else {
                    	if (!this.callEvent("onLastRow", [])) return false;
                    	this._key_events.k34_0_0.apply(this,[]);
                	}
				}
            },
            k36_0_0:function(){ //home
            	return this._key_events.k37_1_0.call(this);
            },
            k35_0_0:function(){ //ctrl-home
            	return this._key_events.k39_1_0.call(this);
            },            
            k36_1_0:function(){ //home
            	if (this.editor || !this.rowsCol.length) return false;
				this.selectCell(this.rowsCol[0],0,true);
            },
            k35_1_0:function(){ //ctrl-end
            	if (this.editor || !this.rowsCol.length) return false;
				this.selectCell(this.rowsCol[this.rowsCol.length-1],this._cCount-1,true);
            },  
            k33_0_0:function(){
            	if(this.pagingOn)
            		this.changePage(this.currentPage-1);
            	else this.scrollPage(-1);            		
	        },
			k34_0_0:function(){
            	if(this.pagingOn)
            		this.changePage(this.currentPage+1);
            	else this.scrollPage(1);
	        },                                  
			k38_0_0:function(){			
				if (this.editor && this.editor.combo)
					this.editor.shiftPrev();
				else{
					if (this.editor) return false;
					var rowInd = rowInd=this.rowsCol._dhx_find(this.row)+1;
					if (rowInd!=-1){
						var nrow=this._nextRow(rowInd-1,-1);
						if (!nrow || nrow._sRow || nrow._rLoad) return false;
                    	this.selectCell(nrow,this.cell._cellIndex,true);
					}
					else this._key_events.k33_0_0.apply(this,[]);
				}
            },
            k_other:function(ev){ 
            	if (this.editor) return false;
            	if (!ev.ctrlKey && ev.keyCode>=40 && (ev.keyCode < 91 || (ev.keyCode >95 && ev.keyCode <111) || ev.keyCode > 187))
            		if (this.cell){
            			var c=this.cells4(this.cell);
            			if (c.isDisabled()) return false;
            			var t=c.getValue();
            			if (c.editable!==false) c.setValue("");
            			this.editCell();
            			if (this.editor) {
            				this.editor.val=t;
            				if (this.editor.obj && this.editor.obj.select)
            					this.editor.obj.select();
        				}
            			else c.setValue(t);
            		}
            }
		};



/**
*   @desc: constructor, creates a new dhtmlxToolbar object
*   @param: baseId - id of html element to which webmenu will attached
*   @type: public
*/
function dhtmlXToolbarObject(baseId, skin) {
	
	var main_self = this;
	
	this.cont = (typeof(baseId)!="object")?document.getElementById(baseId):baseId;
	while (this.cont.childNodes.length > 0) this.cont.removeChild(this.cont.childNodes[0]);
	
	this.cont.dir = "ltr";
	this.cont.innerHTML += "<div class='dhxtoolbar_hdrline_ll'></div><div class='dhxtoolbar_hdrline_rr'></div>"+
				"<div class='dhxtoolbar_hdrline_l'></div><div class='dhxtoolbar_hdrline_r'></div>";
	
	this.base = document.createElement("DIV");
	this.base.className = "float_left";
	this.cont.appendChild(this.base);
	
	this.align = "left";
	this.setAlign = function(align) {
		this.align = (align=="right"?"right":"left");
		this.base.className = (align=="right"?"float_right":"float_left");
		if (this._spacer) this._spacer.className = "dhxtoolbar_spacer "+(align=="right"?" float_left":" float_right");
	}
	
	this._isIE6 = false;
	if (_isIE) this._isIE6 = (window.XMLHttpRequest==null?true:false);
	
	this._isIPad = (navigator.userAgent.search(/iPad/gi)>=0);
	
	if (this._isIPad) {
		this.cont.ontouchstart = function(e){
			e = e||event;
			e.returnValue = false;
			e.cancelBubble = true;
			return false;
		}
	}
	
	this.iconSize = 18;
	this.setIconSize = function(size) {
		this.iconSize = ({18:true,24:true,32:true,48:true}[size]?size:18);
		this.setSkin(this.skin, true);
		this.callEvent("_onIconSizeChange",[this.iconSize]);
	}
	
	this.selectPolygonOffsetTop = 0;
	this.selectPolygonOffsetLeft = 0;
	
	this.setSkin = function(skin, onlyIcons) {
		if (onlyIcons === true) {
			// prevent of removing skin postfixes when attached to layout/acc/etc
			this.cont.className = this.cont.className.replace(/dhx_toolbar_base_\d{1,}_/,"dhx_toolbar_base_"+this.iconSize+"_");
		} else {
			this.skin = skin;
			if (this.skin == "dhx_skyblue") {
				this.selectPolygonOffsetTop = 1;
			}
			if (this.skin == "dhx_web") {
				this.selectPolygonOffsetTop = 1;
				this.selectPolygonOffsetLeft = 1;
			}
			this.cont.className = "dhx_toolbar_base_"+this.iconSize+"_"+this.skin+(this.rtl?" rtl":"");
		}
		
		for (var a in this.objPull) {
			var item = this.objPull[a];
			if (item["type"] == "slider") {
				item.pen._detectLimits();
				item.pen._definePos();
				item.label.className = "dhx_toolbar_slider_label_"+this.skin+(this.rtl?" rtl":"");
			}
			if (item["type"] == "buttonSelect") {
				item.polygon.className = "dhx_toolbar_poly_"+this.iconSize+"_"+this.skin+(this.rtl?" rtl":"");
			}
		}
	}
	this.setSkin(skin==null?"dhx_skyblue":skin);
	
	this.objPull = {};
	this.anyUsed = "none";
	
	/* images */
	this.imagePath = "";
		/**
	*   @desc: set path to used images
	*   @param: path - path to images on harddisk
	*   @type: public
	*/
	this.setIconsPath = function(path) { this.imagePath = path; }
	/**
	*   @desc: alias of setIconsPath
	*   @type: public
	*/
	this.setIconPath = this.setIconsPath;
	/* load */
	this._doOnLoad = function() {}
	/**
	*   @desc: loads data to object from xml file
	*   @param: xmlFile - file with dta to load
	*   @param: onLoadFunction - function to call after data will loaded
	*   @type: public
	*/
	this.loadXML = function(xmlFile, onLoadFunction) {
		if (onLoadFunction != null) this._doOnLoad = function() { onLoadFunction(); }
		this.callEvent("onXLS", []);
		this._xmlLoader = new dtmlXMLLoaderObject(this._xmlParser, window);
		this._xmlLoader.loadXML(xmlFile);
	}
	/**
	*   @desc: loads data to object from xml string
	*   @param: xmlString - xml string with data to load
	*   @param: onLoadFunction - function to call after data will loaded
	*   @type: public
	*/
	this.loadXMLString = function(xmlString, onLoadFunction) {
		if (onLoadFunction != null) { this._doOnLoad = function() { onLoadFunction(); } }
		this._xmlLoader = new dtmlXMLLoaderObject(this._xmlParser, window);
		this._xmlLoader.loadXMLString(xmlString);
	}
	this._xmlParser = function() {
		var root = this.getXMLTopNode("toolbar");
		/*
			common: id, type
			---
			separator: hidden, title
			text: hidden, title, text
			button: enabled, img, imgdis, hidden, action, title, text
			buttonSelect: enabled, img, imgdis, hidden, action, title, openAll, renderSelect, text
			input: hidden, width, title, value
			buttonTwoState: enabled, img, imgdis, selected, action, title, text
			slider: enabled, length, textMin, textMax, toolTip, valueMin, valueMax, valueNow
			---
			buttonSelect nested item: enabled, disabled, action, selected, img, text, itemText(nested), userdata(nested)
			
		*/
		var t = ["id", "type", "hidden", "title", "text", "enabled", "img", "imgdis", "action", "openAll", "renderSelect", "mode", "maxOpen", "width", "value", "selected", "length", "textMin", "textMax", "toolTip", "valueMin", "valueMax", "valueNow"];
		var p = ["id", "type", "enabled", "disabled", "action", "selected", "img", "text"];
		//
		for (var q=0; q<root.childNodes.length; q++) {
			if (root.childNodes[q].tagName == "item") {
				var itemData = {};
				for (var w=0; w<t.length; w++) itemData[t[w]] = root.childNodes[q].getAttribute(t[w]);
				
				itemData.items = [];
				itemData.userdata = [];
				
				for (var e=0; e<root.childNodes[q].childNodes.length; e++) {
					if (root.childNodes[q].childNodes[e].tagName == "item" && itemData.type == "buttonSelect") {
						var u = {};
						for (var w=0; w<p.length; w++) u[p[w]] = root.childNodes[q].childNodes[e].getAttribute(p[w]);
						try { u.itemText = root.childNodes[q].childNodes[e].getElementsByTagName("itemText")[0].firstChild.nodeValue; } catch(k){};
						// listed options userdata
						var h = root.childNodes[q].childNodes[e].getElementsByTagName("userdata");
						for (var w=0; w<h.length; w++) {
							if (!u.userdata) u.userdata = {};
							var r = {};
							try { r.name = h[w].getAttribute("name"); } catch(k) { r.name = ""; }
							try { r.value = h[w].firstChild.nodeValue; } catch(k) { r.value = ""; }
							if (r.name != "") u.userdata[r.name] = r.value;
						}
						//
						itemData.items[itemData.items.length] = u;
					}
					// items userdata
					if (root.childNodes[q].childNodes[e].tagName == "userdata") {
						var u = {};
						try { u.name = root.childNodes[q].childNodes[e].getAttribute("name"); } catch(k) { u.name = ""; }
						try { u.value = root.childNodes[q].childNodes[e].firstChild.nodeValue; } catch(k) { u.value = ""; }
						itemData.userdata[itemData.userdata.length] = u;
					}
				}
				main_self._addItemToStorage(itemData);
			}
		}
		main_self.callEvent("onXLE", []);
		main_self._doOnLoad();
		this.destructor();
	}
	this._addItemToStorage = function(itemData, pos) {
		var id = (itemData.id||this._genStr(24));
		var type = (itemData.type||"");
		if (type != "") {
			if (this["_"+type+"Object"] != null) {
				this.objPull[this.idPrefix+id] = new this["_"+type+"Object"](this, id, itemData);
				this.objPull[this.idPrefix+id]["type"] = type;
				this.setPosition(id, pos);
			}
		}
		// userdata
		if (itemData.userdata) { for (var q=0; q<itemData.userdata.length; q++) this.setUserData(id, itemData.userdata[q].name, itemData.userdata[q].value); }
	}
	/* random prefix */
	this._genStr = function(w) {
		var s = ""; var z = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		for (var q=0; q<w; q++) s += z.charAt(Math.round(Math.random() * (z.length-1)));
		return s;
	}
	this.rootTypes = new Array("button", "buttonSelect", "buttonTwoState", "separator", "label", "slider", "text", "buttonInput");
	this.idPrefix = this._genStr(12);
	//
	dhtmlxEventable(this);
	//
	// return obj if exists by tagname
	this._getObj = function(obj, tag) {
		var targ = null;
		for (var q=0; q<obj.childNodes.length; q++) {
			if (obj.childNodes[q].tagName != null) {
				if (String(obj.childNodes[q].tagName).toLowerCase() == String(tag).toLowerCase()) targ = obj.childNodes[q];
			}
		}
		return targ;
	}
	// create and return image object
	this._addImgObj = function(obj) {
		var imgObj = document.createElement("IMG");
		if (obj.childNodes.length > 0) obj.insertBefore(imgObj, obj.childNodes[0]); else obj.appendChild(imgObj);
		return imgObj;
	}
	// set/clear item image/imagedis
	this._setItemImage = function(item, url, dis) {
		if (dis == true) item.imgEn = url; else item.imgDis = url;
		if ((!item.state && dis == true) || (item.state && dis == false)) return;
		var imgObj = this._getObj(item.obj, "img");
		if (imgObj == null) imgObj = this._addImgObj(item.obj);
		imgObj.src = this.imagePath+url;
	}
	this._clearItemImage = function(item, dis) {
		if (dis == true) item.imgEn = ""; else item.imgDis = "";
		if ((!item.state && dis == true) || (item.state && dis == false)) return;
		var imgObj = this._getObj(item.obj, "img");
		if (imgObj != null) imgObj.parentNode.removeChild(imgObj);
	}
	// set/get item text
	this._setItemText = function(item, text) {
		var txtObj = this._getObj(item.obj, "div");
		if (text == null || text.length == 0) {
			if (txtObj != null) txtObj.parentNode.removeChild(txtObj);
			return;
		}
		if (txtObj == null) { txtObj = document.createElement("DIV"); item.obj.appendChild(txtObj); }
		txtObj.innerHTML = text;
	}
	this._getItemText = function(item) {
		var txtObj = this._getObj(item.obj, "div");
		if (txtObj != null) return txtObj.innerHTML;
		return "";
	}
	
	// enable/disable btn
	this._enableItem = function(item) {
		if (item.state) return;
		item.state = true;
		if (this.objPull[item.id]["type"] == "buttonTwoState" && this.objPull[item.id]["obj"]["pressed"] == true) {
			item.obj.className = "dhx_toolbar_btn pres";
			item.obj.renderAs = "dhx_toolbar_btn over";
		} else {
			item.obj.className = "dhx_toolbar_btn def";
			item.obj.renderAs = item.obj.className;
		}
		if (item.arw) item.arw.className = String(item.obj.className).replace("btn","arw");
		var imgObj = this._getObj(item.obj, "img");
		if (item.imgEn != "") {
			if (imgObj == null) imgObj = this._addImgObj(item.obj);
			imgObj.src = this.imagePath+item.imgEn;
		} else {
			if (imgObj != null) imgObj.parentNode.removeChild(imgObj);
		}
	}
	this._disableItem = function(item) {
		if (!item.state) return;
		item.state = false;
		item.obj.className = "dhx_toolbar_btn "+(this.objPull[item.id]["type"]=="buttonTwoState"&&item.obj.pressed?"pres_":"")+"dis";
		item.obj.renderAs = "dhx_toolbar_btn def";
		if (item.arw) item.arw.className = String(item.obj.className).replace("btn","arw");
		var imgObj = this._getObj(item.obj, "img");
		if (item.imgDis != "") {
			if (imgObj == null) imgObj = this._addImgObj(item.obj);
			imgObj.src = this.imagePath+item.imgDis;
		} else {
			if (imgObj != null) imgObj.parentNode.removeChild(imgObj);
		}
		// if (this.objPull[item.id]["type"] == "buttonTwoState") this.objPull[item.id]["obj"]["pressed"] = false;
		// hide opened polygon if any
		if (item.polygon != null) {
			if (item.polygon.style.display != "none") {
				item.polygon.style.display = "none";
				if (item.polygon._ie6cover) item.polygon._ie6cover.style.display = "none";
			}
		}
		this.anyUsed = "none";
	}
	
	/**
	*   @desc: remove all existing items
	*   @type: public
	*/
	this.clearAll = function() {
		for (var a in this.objPull) this._removeItem(String(a).replace(this.idPrefix,""));
	}
	
	
	//
	this._isWebToolbar = true;
	
	this._doOnClick = function(e) {
		main_self.forEachItem(function(itemId){
			if (main_self.objPull[main_self.idPrefix+itemId]["type"] == "buttonSelect") {
				// hide any opened buttonSelect's polygons, clear selection if any
				var item = main_self.objPull[main_self.idPrefix+itemId];
				if (item.polygon.style.display != "none") {
					item.obj.renderAs = "dhx_toolbar_btn def";
					item.obj.className = item.obj.renderAs;
					item.arw.className = String(item.obj.renderAs).replace("btn","arw");
					main_self.anyUsed = "none";
					item.polygon.style.display = "none";
					if (item.polygon._ie6cover) item.polygon._ie6cover.style.display = "none";
				}
			}
		});
	}
	if (this._isIPad) {
		document.addEventListener("touchstart", this._doOnClick, false);
	} else {
		if (_isIE) document.body.attachEvent("onclick", this._doOnClick); else window.addEventListener("click", this._doOnClick, false);
	}
	
	//
	return this;
}
dhtmlXToolbarObject.prototype.addSpacer = function(nextToId) {
	var nti = this.idPrefix+nextToId;
	if (this._spacer != null) {
		// spacer already at specified position
		if (this._spacer.idd == nextToId) return;
		// if current spacer contain nextToId item
		// move all items from first to nextToId to this.base
		if (this._spacer == this.objPull[nti].obj.parentNode) {
			var doMove = true;
			while (doMove) {
				var idd = this._spacer.childNodes[0].idd;
				this.base.appendChild(this._spacer.childNodes[0]);
				if (idd == nextToId || this._spacer.childNodes.length == 0) {
					if (this.objPull[nti].arw != null) this.base.appendChild(this.objPull[nti].arw);
					doMove = false;
				}
			}
			this._spacer.idd = nextToId;
			this._fixSpacer();
			return;
		}
		// if this.base contain nextToId item, move (insertBefore[0])
		if (this.base == this.objPull[nti].obj.parentNode) {
			var doMove = true;
			var chArw = (this.objPull[nti].arw!=null);
			while (doMove) {
				var q = this.base.childNodes.length-1;
				if (chArw == true) if (this.base.childNodes[q] == this.objPull[nti].arw) doMove = false;
				if (this.base.childNodes[q].idd == nextToId) doMove = false;
				if (doMove) { if (this._spacer.childNodes.length > 0) this._spacer.insertBefore(this.base.childNodes[q], this._spacer.childNodes[0]); else this._spacer.appendChild(this.base.childNodes[q]); }
			}
			this._spacer.idd = nextToId;
			this._fixSpacer();
			return;
		}
		
	} else {
		var np = null;
		for (var q=0; q<this.base.childNodes.length; q++) {
			if (this.base.childNodes[q] == this.objPull[this.idPrefix+nextToId].obj) {
				np = q;
				if (this.objPull[this.idPrefix+nextToId].arw != null) np = q+1;
			}
		}
		if (np != null) {
			this._spacer = document.createElement("DIV");
			this._spacer.className = "dhxtoolbar_spacer "+(this.align=="right"?" float_left":" float_right");
			this._spacer.dir = "rtl";
			this._spacer.idd = nextToId;
			while (this.base.childNodes.length > np+1) this._spacer.appendChild(this.base.childNodes[np+1]);
			this.cont.appendChild(this._spacer);
			this._fixSpacer();
		}
	}
}
dhtmlXToolbarObject.prototype.removeSpacer = function() {
	if (!this._spacer) return;
	while (this._spacer.childNodes.length > 0) this.base.appendChild(this._spacer.childNodes[0]);
	this._spacer.parentNode.removeChild(this._spacer);
	this._spacer = null;
}
dhtmlXToolbarObject.prototype._fixSpacer = function() {
	// IE icons mixing fix
	if (_isIE && this._spacer != null) {
		this._spacer.style.borderLeft = "1px solid #a4bed4";
		var k = this._spacer;
		window.setTimeout(function(){k.style.borderLeft="0px solid #a4bed4";k=null;},1);
	}
}

/**
*	@desc: return item type by item id
*	@param: itemId
*	@type: public
*/
dhtmlXToolbarObject.prototype.getType = function(itemId) {
	var parentId = this.getParentId(itemId);
	if (parentId != null) {
		var typeExt = null;
		var itemData = this.objPull[this.idPrefix+parentId]._listOptions[itemId];
		if (itemData != null) if (itemData.sep != null) typeExt = "buttonSelectSeparator"; else typeExt = "buttonSelectButton";
		return typeExt;
	} else {
		if (this.objPull[this.idPrefix+itemId] == null) return null;
		return this.objPull[this.idPrefix+itemId]["type"];
	}
}
/**
*	@desc: deprecated; return extended item type by item id (button select node)
*	@param: itemId
*	@type: public
*/
dhtmlXToolbarObject.prototype.getTypeExt = function(itemId) {
	var type = this.getType(itemId);
	if (type == "buttonSelectButton" || type == "buttonSelectSeparator") {
		if (type == "buttonSelectButton") type = "button"; else type = "separator";
		return type;
	}
	return null;
}
dhtmlXToolbarObject.prototype.inArray = function(array, value) {
	for (var q=0; q<array.length; q++) { if (array[q]==value) return true; }
	return false;
}
dhtmlXToolbarObject.prototype.getParentId = function(listId) {
	var parentId = null;
	for (var a in this.objPull) if (this.objPull[a]._listOptions) for (var b in this.objPull[a]._listOptions) if (b == listId) parentId = String(a).replace(this.idPrefix,"");
	return parentId;
}
/* adding items */
dhtmlXToolbarObject.prototype._addItem = function(itemData, pos) {
	this._addItemToStorage(itemData, pos);
}
/**
*   @desc: adds a button to webbar
*   @param: id - id of a button
*   @param: pos - position of a button
*   @param: text - text for a button (null for no text)
*   @param: imgEnabled - image for enabled state (null for no image)
*   @param: imgDisabled - image for desabled state (null for no image)
*   @type: public
*/
dhtmlXToolbarObject.prototype.addButton = function(id, pos, text, imgEnabled, imgDisabled) {
	this._addItem({id:id, type:"button", text:text, img:imgEnabled, imgdis:imgDisabled}, pos);
}
/**
*   @desc: adds a text item to webbar
*   @param: id - id of a text item
*   @param: pos - position of a text item
*   @param: text - text for a text item
*   @type: public
*/
dhtmlXToolbarObject.prototype.addText = function(id, pos, text) {
	this._addItem({id:id,type:"text",text:text}, pos);
}
//#tool_list:06062008{
/**
*   @desc: adds a select button to webbar
*   @param: id - id of a select button
*   @param: pos - position of a select button
*   @param: text - text for a select button (null for no text)
*   @param: opts - listed options for a select button
*   @param: imgEnabled - image for enabled state (null for no image)
*   @param: imgDisabled - image for desabled state (null for no image)
*   @param: renderSelect - set to false to prevent list options selection by click
*   @param: openAll - open options list when click main button (not only arrow)
*   @param: maxOpen - specify count of visible items (for long lists)
*   @type: public
*/
dhtmlXToolbarObject.prototype.addButtonSelect = function(id, pos, text, opts, imgEnabled, imgDisabled, renderSelect, openAll, maxOpen) { 
	var items = [];
	for (var q=0; q<opts.length; q++) {
		var u = {};
		if (opts[q].id && opts[q].type) {
			u.id = opts[q].id;
			u.type = (opts[q].type=="obj"?"button":"separator");
			u.text = opts[q].text;
			u.img = opts[q].img;
		} else {
			u.id = opts[q][0];
			u.type = (opts[q][1]=="obj"?"button":"separator");
			u.text = (opts[q][2]||null);
			u.img = (opts[q][3]||null);
		}
		items[items.length] = u;
	}
	this._addItem({id:id, type:"buttonSelect", text:text, img:imgEnabled, imgdis:imgDisabled, renderSelect:renderSelect, openAll:openAll, items:items, maxOpen:maxOpen}, pos);
}
//#}
//#tool_2state:06062008{
/**
*   @desc: adds a two-state button to webbar
*   @param: id - id of a two-state button
*   @param: pos - position of a two-state button
*   @param: text - text for a two-state button (null for no text)
*   @param: imgEnabled - image for enabled state (null for no image)
*   @param: imgDisabled - image for desabled state (null for no image)
*   @type: public
*/
dhtmlXToolbarObject.prototype.addButtonTwoState = function(id, pos, text, imgEnabled, imgDisabled) {
	this._addItem({id:id, type:"buttonTwoState", img:imgEnabled, imgdis:imgDisabled, text:text}, pos);
}
//#}
/**
*   @desc: adds a separator to webbar
*   @param: id - id of a separator
*   @param: pos - position of a separator
*   @type: public
*/
dhtmlXToolbarObject.prototype.addSeparator = function(id, pos) {
	this._addItem({id:id,type:"separator"}, pos);
}
//#tool_slider:06062008{
/**
*   @desc: adds a slider to webbar
*   @param: id - id of a slider
*   @param: pos - position of a slider
*   @param: len - length (width) of a slider (px)
*   @param: valueMin - minimal available value of a slider
*   @param: valueMax - maximal available value of a slider
*   @param: valueNow - initial current value of a slider
*   @param: textMin - label for minimal value side (on the left side)
*   @param: textMax - label for maximal value side (on the right side)
*   @param: tip - tooltip template (%v will replaced with current value)
*   @type: public
*/
dhtmlXToolbarObject.prototype.addSlider = function(id, pos, len, valueMin, valueMax, valueNow, textMin, textMax, tip) {
	this._addItem({id:id, type:"slider", length:len, valueMin:valueMin, valueMax:valueMax, valueNow:valueNow, textMin:textMin, textMax:textMax, toolTip:tip}, pos);
}
//#}
/**
*   @desc: adds an input item to webbar
*   @param: id - id of an input item
*   @param: pos - position of an input item
*   @param: value - value (text) in an input item by the default
*   @param: width - width of an input item (px)
*   @type: public
*/
dhtmlXToolbarObject.prototype.addInput = function(id, pos, value, width) {
	this._addItem({id:id,type:"buttonInput",value:value,width:width}, pos);
}
/**
*   @desc: iterator, calls user handler for each item
*   @param: handler - user function, will take item id as an argument
*   @type: public
*/
dhtmlXToolbarObject.prototype.forEachItem = function(handler) {
	for (var a in this.objPull) {
		if (this.inArray(this.rootTypes, this.objPull[a]["type"])) {
			handler(this.objPull[a]["id"].replace(this.idPrefix,""));
		}
	}
};
(function(){
	var list="showItem,hideItem,isVisible,enableItem,disableItem,isEnabled,setItemText,getItemText,setItemToolTip,getItemToolTip,setItemImage,setItemImageDis,clearItemImage,clearItemImageDis,setItemState,getItemState,setItemToolTipTemplate,getItemToolTipTemplate,setValue,getValue,setMinValue,getMinValue,setMaxValue,getMaxValue,setWidth,getWidth,setMaxOpen".split(",")
	var ret=["","",false,"","",false,"","","","","","","","","",false,"","","",null,"",[null,null],"",[null,null],"",null]
	var functor=function(name,res){
			return function(itemId,a,b){
				itemId = this.idPrefix+itemId;
				if (this.objPull[itemId][name] != null) 
					return this.objPull[itemId][name].call(this.objPull[itemId],a,b)
				else 
					return res;
				};
			}
			
	for (var i=0; i<list.length; i++){
		var name=list[i];
		var res=ret[i];
		dhtmlXToolbarObject.prototype[name] = functor(name,res);
	}	
})()


/**
*   @desc: shows a specified item
*   @param: itemId - id of an item to show
*   @type: public
*/
//dhtmlXToolbarObject.prototype.showItem = function(itemId) {
/**
*   @desc: hides a specified item
*   @param: itemId - id of an item to hide
*   @type: public
*/
//dhtmlXToolbarObject.prototype.hideItem = function(itemId) {
/**
*   @desc: returns true if a specified item is visible
*   @param: itemId - id of an item to check
*   @type: public
*/
//dhtmlXToolbarObject.prototype.isVisible = function(itemId) {
/**
*   @desc: enables a specified item
*   @param: itemId - id of an item to enable
*   @type: public
*/
//dhtmlXToolbarObject.prototype.enableItem = function(itemId) {
/**
*   @desc: disables a specified item
*   @param: itemId - id of an item to disable
*   @type: public
*/
//dhtmlXToolbarObject.prototype.disableItem = function(itemId) {
/**
*   @desc: returns true if a specified item is enabled
*   @param: itemId - id of an item to check
*   @type: public
*/
//dhtmlXToolbarObject.prototype.isEnabled = function(itemId) {
/**
*   @desc: sets new text for an item
*   @param: itemId - id of an item
*   @param: text - new text for an item
*   @type: public
*/
//dhtmlXToolbarObject.prototype.setItemText = function(itemId, text) {
/**
*   @desc: return cureent item's text
*   @param: itemId - id of an item
*   @type: public
*/
//dhtmlXToolbarObject.prototype.getItemText = function(itemId) {
/**
*   @desc: sets a tooltip for an item
*   @param: itemId - id of an item
*   @param: tip - tooltip (empty for clear)
*   @type: public
*/
//dhtmlXToolbarObject.prototype.setItemToolTip = function(itemId, tip) {
/**
*   @desc: return current item's tooltip
*   @param: itemId - id of an item
*   @type: public
*/
//dhtmlXToolbarObject.prototype.getItemToolTip = function(itemId) {
/**
*   @desc: sets an image for an item in enabled state
*   @param: itemId - id of an item
*   @param: url - url of an image
*   @type: public
*/
//dhtmlXToolbarObject.prototype.setItemImage = function(itemId, url) {
/**
*   @desc: sets an image for an item in disabled state
*   @param: itemId - id of an item
*   @param: url - url of an image
*   @type: public
*/
//dhtmlXToolbarObject.prototype.setItemImageDis = function(itemId, url) {
/**
*   @desc: removes an image of an item in enabled state
*   @param: itemId - id of an item
*   @type: public
*/
//dhtmlXToolbarObject.prototype.clearItemImage = function(itemId) {
/**
*   @desc: removes an image of an item in disabled state
*   @param: itemId - id of an item
*   @type: public
*/
//dhtmlXToolbarObject.prototype.clearItemImageDis = function(itemId) {
/**
*   @desc: sets a pressed/released state for a two-state button
*   @param: itemId - id of a two-state item
*   @param: state - state, true for pressed, false for released
*   @type: public
*/
//dhtmlXToolbarObject.prototype.setItemState = function(itemId, state) {
/**
*   @desc: returns current state of a two-state button
*   @param: itemId - id of a two-state item to check
*   @type: public
*/
//dhtmlXToolbarObject.prototype.getItemState = function(itemId) {
/**
*   @desc: sets a tooltip template for a slider
*   @param: itemId - id of a slider
*   @param: template - tooltip template (%v will replaced with current value)
*   @type: public
*/
//dhtmlXToolbarObject.prototype.setItemToolTipTemplate = function(itemId, template) {
/**
*   @desc: returns a current tooltip template of a slider
*   @param: itemId - id of a slider
*   @type: public
*/
//dhtmlXToolbarObject.prototype.getItemToolTipTemplate = function(itemId) {
/**
*   @desc: sets a value for a slider or an input item
*   @param: itemId - id of a slider or an input item
*   @param: value - value (int for slider, any for input item)
*   @type: public
*/
//dhtmlXToolbarObject.prototype.setValue = function(itemId, value, callEvent) {
/**
*   @desc: returns a current value of a slider or an input item
*   @param: itemId - id of a slider or an input item
*   @type: public
*/
//dhtmlXToolbarObject.prototype.getValue = function(itemId) {
/**
*   @desc: sets minimal value and label for a slider
*   @param: itemId - id of a slider
*   @param: value - value (int)
*   @param: label - label for value (empty for no label)
*   @type: public
*/
//dhtmlXToolbarObject.prototype.setMinValue = function(itemId, value, label) {
/**
*   @desc: return current minimal value and label of a slider
*   @param: itemId - id of a slider
*   @type: public
*/
//dhtmlXToolbarObject.prototype.getMinValue = function(itemId) {
/**
*   @desc: sets maximal value and label for a slider
*   @param: itemId - id of a slider
*   @param: value - value (int)
*   @param: label - label for value (empty for no label)
*   @type: public
*/
//dhtmlXToolbarObject.prototype.setMaxValue = function(itemId, value, label) {
/**
*   @desc: returns current maximal value and label of a slider
*   @param: itemId - id of a slider
*   @type: public
*/
//dhtmlXToolbarObject.prototype.getMaxValue = function(itemId) {
/**
*   @desc: sets a width for an text/input/buttonSelect item
*   @param: itemId - id of an text/input/buttonSelect item
*   @param: width - new width (px)
*   @type: public
*/
//dhtmlXToolbarObject.prototype.setWidth = function(itemId, width) {
/**
*   @desc: returns a current width of an input item
*   @param: itemId - id of an input item
*   @type: public
*/
//dhtmlXToolbarObject.prototype.getWidth = function(itemId) {
/**
*   @desc: returns a current position of an item
*   @param: itemId - id of an item
*   @type: public
*/
dhtmlXToolbarObject.prototype.getPosition = function(itemId) {
	return this._getPosition(itemId);
}
dhtmlXToolbarObject.prototype._getPosition = function(id, getRealPosition) {
	
	if (this.objPull[this.idPrefix+id] == null) return null;
	
	var pos = null;
	var w = 0;
	for (var q=0; q<this.base.childNodes.length; q++) {
		if (this.base.childNodes[q].idd != null) {
			if (this.base.childNodes[q].idd == id) pos = w;
			w++;
		}
	}
	if (!pos && this._spacer != null) {
		for (var q=0; q<this._spacer.childNodes.length; q++) {
			if (this._spacer.childNodes[q].idd != null) {
				if (this._spacer.childNodes[q].idd == id) pos = w;
				w++;
			}
		}
	}
	return pos;
}
/**
*   @desc: sets a new position for an item (moves item to desired position)
*   @param: itemId - id of an item
*   @param: pos - new position
*   @type: public
*/
dhtmlXToolbarObject.prototype.setPosition = function(itemId, pos) {
	this._setPosition(itemId, pos);
}
dhtmlXToolbarObject.prototype._setPosition = function(id, pos) {
	
	if (this.objPull[this.idPrefix+id] == null) return;
	
	if (isNaN(pos)) pos = this.base.childNodes.length;
	if (pos < 0) pos = 0;
	
	var spacerId = null;
	if (this._spacer) {
		spacerId = this._spacer.idd;
		this.removeSpacer();
	}
	
	var item = this.objPull[this.idPrefix+id];
	this.base.removeChild(item.obj);
	if (item.arw) this.base.removeChild(item.arw);
	
	var newPos = this._getIdByPosition(pos, true);
	
	if (newPos[0] == null) {
		this.base.appendChild(item.obj);
		if (item.arw) this.base.appendChild(item.arw);
	} else {
		this.base.insertBefore(item.obj, this.base.childNodes[newPos[1]]);
		if (item.arw) this.base.insertBefore(item.arw, this.base.childNodes[newPos[1]+1]);
	}
	if (spacerId != null) this.addSpacer(spacerId);
	
}
dhtmlXToolbarObject.prototype._getIdByPosition = function(pos, retRealPos) {
	
	var id = null;
	var w = 0;
	var realPos = 0;
	for (var q=0; q<this.base.childNodes.length; q++) {
		if (this.base.childNodes[q]["idd"] != null && id == null) {
			if ((w++) == pos) id = this.base.childNodes[q]["idd"];
		}
		if (id == null) realPos++;
	}
	realPos = (id==null?null:realPos);
	return (retRealPos==true?new Array(id, realPos):id);
}

/**
*   @desc: completely removes an item for a webbar
*   @param: itemId - id of an item
*   @type: public
*/
dhtmlXToolbarObject.prototype.removeItem = function(itemId) {
	
	this._removeItem(itemId);
};

dhtmlXToolbarObject.prototype._removeItem = function(itemId) {
	
	var t = this.getType(itemId);
	
	itemId = this.idPrefix+itemId;
	var p = this.objPull[itemId];
	
	
	if (t == "button") {
		
		p.obj._doOnMouseOver = null;
		p.obj._doOnMouseOut = null;
		p.obj._doOnMouseUp = null;
		p.obj._doOnMouseUpOnceAnywhere = null;
		
		p.obj.onclick = null;
		p.obj.onmouseover = null;
		p.obj.onmouseout = null;
		p.obj.onmouseup = null;
		p.obj.onmousedown = null;
		p.obj.onselectstart = null;
		
		p.obj.renderAs = null;
		p.obj.idd = null;
		p.obj.parentNode.removeChild(p.obj);
		p.obj = null;

		p.id = null;
		p.state = null;
		p.img = null;
		p.imgEn = null;
		p.imgDis = null;
		p.type = null;
		
		p.enableItem = null;
		p.disableItem = null;
		p.isEnabled = null;
		p.showItem = null;
		p.hideItem = null;
		p.isVisible = null;
		p.setItemText = null;
		p.getItemText = null;
		p.setItemImage = null;
		p.clearItemImage = null;
		p.setItemImageDis = null;
		p.clearItemImageDis = null;
		p.setItemToolTip = null;
		p.getItemToolTip = null;
		
	}
	
	if (t == "buttonTwoState") {
		
		p.obj._doOnMouseOver = null;
		p.obj._doOnMouseOut = null;
		
		p.obj.onmouseover = null;
		p.obj.onmouseout = null;
		p.obj.onmousedown = null;
		p.obj.onselectstart = null;
		
		p.obj.renderAs = null;
		p.obj.idd = null;
		p.obj.parentNode.removeChild(p.obj);
		p.obj = null;
		
		p.id = null;
		p.state = null;
		p.img = null;
		p.imgEn = null;
		p.imgDis = null;
		p.type = null;
		
		p.enableItem = null;
		p.disableItem = null;
		p.isEnabled = null;
		p.showItem = null;
		p.hideItem = null;
		p.isVisible = null;
		p.setItemText = null;
		p.getItemText = null;
		p.setItemImage = null;
		p.clearItemImage = null;
		p.setItemImageDis = null;
		p.clearItemImageDis = null;
		p.setItemToolTip = null;
		p.getItemToolTip = null;
		p.setItemState = null;
		p.getItemState = null;
		
	}
	
	if (t == "buttonSelect") {
		
		for (var a in p._listOptions) this.removeListOption(itemId, a);
		p._listOptions = null;
		
		if (p.polygon._ie6cover) {
			document.body.removeChild(p.polygon._ie6cover);
			p.polygon._ie6cover = null;
		}
		
		p.p_tbl.removeChild(p.p_tbody);
		p.polygon.removeChild(p.p_tbl);
		p.polygon.onselectstart = null;
		document.body.removeChild(p.polygon);
		
		p.p_tbody = null;
		p.p_tbl = null;
		p.polygon = null;
		
		p.obj.onclick = null;
		p.obj.onmouseover = null;
		p.obj.onmouseout = null;
		p.obj.onmouseup = null;
		p.obj.onmousedown = null;
		p.obj.onselectstart = null;
		p.obj.idd = null;
		p.obj.iddPrefix = null;
		p.obj.parentNode.removeChild(p.obj);
		p.obj = null;
		
		p.arw.onclick = null;
		p.arw.onmouseover = null;
		p.arw.onmouseout = null;
		p.arw.onmouseup = null;
		p.arw.onmousedown = null;
		p.arw.onselectstart = null;
		p.arw.parentNode.removeChild(p.arw);
		p.arw = null;
		
		p.renderSelect = null;
		p.state = null;
		p.type = null;
		p.id = null;
		p.img = null;
		p.imgEn = null;
		p.imgDis = null;
		p.openAll = null;
		
		p._isListButton = null;
		p._separatorButtonSelectObject = null;
		p._buttonButtonSelectObject = null;
		p.setWidth = null;
		p.enableItem = null;
		p.disableItem = null;
		p.isEnabled = null;
		p.showItem = null;
		p.hideItem = null;
		p.isVisible = null;
		p.setItemText = null;
		p.getItemText = null;
		p.setItemImage = null;
		p.clearItemImage = null;
		p.setItemImageDis = null;
		p.clearItemImageDis = null;
		p.setItemToolTip = null;
		p.getItemToolTip = null;
		p.addListOption = null;
		p.removeListOption = null;
		p.showListOption = null;
		p.hideListOption = null;
		p.isListOptionVisible = null;
		p.enableListOption = null;
		p.disableListOption = null;
		p.isListOptionEnabled = null;
		p.setListOptionPosition = null;
		p.getListOptionPosition = null;
		p.setListOptionImage = null;
		p.getListOptionImage = null;
		p.clearListOptionImage = null;
		p.setListOptionText = null;
		p.getListOptionText = null;
		p.setListOptionToolTip = null;
		p.getListOptionToolTip = null;
		p.forEachListOption = null;
		p.getAllListOptions = null;
		p.setListOptionSelected = null;
		p.getListOptionSelected = null;
		
	}
	
	if (t == "buttonInput") {
		
		p.obj.childNodes[0].onkeydown = null;
		p.obj.removeChild(p.obj.childNodes[0]);
		
		p.obj.w = null;
		p.obj.idd = null;
		p.obj.parentNode.removeChild(p.obj);
		p.obj = null;
		
		p.id = null;
		p.type = null;
		
		p.enableItem = null;
		p.disableItem = null;
		p.isEnabled = null;
		p.showItem = null;
		p.hideItem = null;
		p.isVisible = null;
		p.setItemToolTip = null;
		p.getItemToolTip = null;
		p.setWidth = null;
		p.getWidth = null;
		p.setValue = null;
		p.getValue = null;
		p.setItemText = null;
		p.getItemText = null;
		
	}
	
	if (t == "slider") {
		
		if (this._isIPad) {
			document.removeEventListener("touchmove", pen._doOnMouseMoveStart, false);
			document.removeEventListener("touchend", pen._doOnMouseMoveEnd, false);
		} else {
			if (_isIE) {
				document.body.detachEvent("onmousemove", p.pen._doOnMouseMoveStart);
				document.body.detachEvent("onmouseup", p.pen._doOnMouseMoveEnd);
			} else {
				window.removeEventListener("mousemove", p.pen._doOnMouseMoveStart, false);
				window.removeEventListener("mouseup", p.pen._doOnMouseMoveEnd, false);
			}
		}
		
		p.pen.allowMove = null;
		p.pen.initXY = null;
		p.pen.maxX = null;
		p.pen.minX = null;
		p.pen.nowX = null;
		p.pen.newNowX = null;
		p.pen.valueMax = null;
		p.pen.valueMin = null;
		p.pen.valueNow = null;
		
		p.pen._definePos = null;
		p.pen._detectLimits = null;
		p.pen._doOnMouseMoveStart = null;
		p.pen._doOnMouseMoveEnd = null;
		p.pen.onmousedown = null;
		
		p.obj.removeChild(p.pen);
		p.pen = null;
		
		p.label.tip = null;
		document.body.removeChild(p.label);
		p.label = null;
		
		p.obj.onselectstart = null;
		p.obj.idd = null;
		while (p.obj.childNodes.length > 0) p.obj.removeChild(p.obj.childNodes[0]);
		p.obj.parentNode.removeChild(p.obj);
		p.obj = null;
		
		p.id = null;
		p.type = null;
		p.state = null;
		
		p.enableItem = null;
		p.disableItem = null;
		p.isEnabled = null;
		p.setItemToolTipTemplate = null;
		p.getItemToolTipTemplate = null;
		p.setMaxValue = null;
		p.setMinValue = null;
		p.getMaxValue = null;
		p.getMinValue = null;
		p.setValue = null;
		p.getValue = null;
		p.showItem = null;
		p.hideItem = null;
		p.isVisible = null;
		
	}
	
	if (t == "separator") {
		
		p.obj.onselectstart = null;
		p.obj.idd = null;
		p.obj.parentNode.removeChild(p.obj);
		p.obj = null;
		
		p.id = null;
		p.type = null;
		
		p.showItem = null;
		p.hideItem = null;
		p.isVisible = null;
		
	}
	
	if (t == "text") {
		
		p.obj.onselectstart = null;
		p.obj.idd = null;
		p.obj.parentNode.removeChild(p.obj);
		p.obj = null;
		
		p.id = null;
		p.type = null;
		
		p.showItem = null;
		p.hideItem = null;
		p.isVisible = null;
		p.setWidth = null;
		p.setItemText = null;
		p.getItemText = null;
		
	}
	
	t = null;
	p = null;
	this.objPull[this.idPrefix+itemId] = null;
	delete this.objPull[this.idPrefix+itemId];
	
	
};
//#tool_list:06062008{
(function(){
	var list="addListOption,removeListOption,showListOption,hideListOption,isListOptionVisible,enableListOption,disableListOption,isListOptionEnabled,setListOptionPosition,getListOptionPosition,setListOptionText,getListOptionText,setListOptionToolTip,getListOptionToolTip,setListOptionImage,getListOptionImage,clearListOptionImage,forEachListOption,getAllListOptions,setListOptionSelected,getListOptionSelected".split(",")
	var functor = function(name){
				return function(parentId,a,b,c,d,e){
				parentId = this.idPrefix+parentId;
				if (this.objPull[parentId] == null) return;
				if (this.objPull[parentId]["type"] != "buttonSelect") return;
				return this.objPull[parentId][name].call(this.objPull[parentId],a,b,c,d,e);
			}
		}
	for (var i=0; i<list.length; i++){
		var name=list[i];
		dhtmlXToolbarObject.prototype[name]=functor(name)
	}
})()
/**
*   @desc: adds a listed option to a select button
*   @param: parentId - id of a select button
*   @param: optionId - id of a listed option
*   @param: pos - position of a listed option
*   @param: type - type of a listed option (button|separator)
*   @param: text - text for a listed option
*   @param: img - image for a listed option
*   @type: public
*/
//dhtmlXToolbarObject.prototype.addListOption = function(parentId, optionId, pos, type, text, img) {
/**
*   @desc: completely removes a listed option from a select button
*   @param: parentId - id of a select button
*   @param: optionId - id of a listed option
*   @type: public
*/
//dhtmlXToolbarObject.prototype.removeListOption = function(parentId, optionId) {
/**
*   @desc: shows a listed option
*   @param: parentId - id of a select button
*   @param: optionId - id of a listed option
*   @type: public
*/
//dhtmlXToolbarObject.prototype.showListOption = function(parentId, optionId) {
/**
*   @desc: hides a listed option
*   @param: parentId - id of a select button
*   @param: optionId - id of a listed option
*   @type: public
*/
//dhtmlXToolbarObject.prototype.hideListOption = function(parentId, optionId) {
/**
*   @desc: return true if a listed option is visible
*   @param: parentId - id of a select button
*   @param: optionId - id of a listed option
*   @type: public
*/
//dhtmlXToolbarObject.prototype.isListOptionVisible = function(parentId, optionId) {
/**
*   @desc: enables a listed option
*   @param: parentId - id of a select button
*   @param: optionId - id of a listed option
*   @type: public
*/
//dhtmlXToolbarObject.prototype.enableListOption = function(parentId, optionId) {
/**
*   @desc: disables a listed option
*   @param: parentId - id of a select button
*   @param: optionId - id of a listed option
*   @type: public
*/
//dhtmlXToolbarObject.prototype.disableListOption = function(parentId, optionId) {
/**
*   @desc: return true if a listed option is enabled
*   @param: parentId - id of a select button
*   @param: optionId - id of a listed option
*   @type: public
*/
//dhtmlXToolbarObject.prototype.isListOptionEnabled = function(parentId, optionId) {
/**
*   @desc: sets a position of a listed option (moves listed option)
*   @param: parentId - id of a select button
*   @param: optionId - id of a listed option
*   @param: pos - position of a listed option
*   @type: public
*/
//dhtmlXToolbarObject.prototype.setListOptionPosition = function(parentId, optionId, pos) {
/**
*   @desc: returns a position of a listed option
*   @param: parentId - id of a select button
*   @param: optionId - id of a listed option
*   @type: public
*/
//dhtmlXToolbarObject.prototype.getListOptionPosition = function(parentId, optionId) {
/**
*   @desc: sets a text for a listed option
*   @param: parentId - id of a select button
*   @param: optionId - id of a listed option
*   @param: text - text for a listed option
*   @type: public
*/
//dhtmlXToolbarObject.prototype.setListOptionText = function(parentId, optionId, text) {
/**
*   @desc: returns a text of a listed option
*   @param: parentId - id of a select button
*   @param: optionId - id of a listed option
*   @type: public
*/
//dhtmlXToolbarObject.prototype.getListOptionText = function(parentId, optionId) {
/**
*   @desc: sets a tooltip for a listed option
*   @param: parentId - id of a select button
*   @param: optionId - id of a listed option
*   @param: tip - tooltip for a listed option
*   @type: public
*/
//dhtmlXToolbarObject.prototype.setListOptionToolTip = function(parentId, optionId, tip) {
/**
*   @desc: returns a tooltip of a listed option
*   @param: parentId - id of a select button
*   @param: optionId - id of a listed option
*   @type: public
*/
//dhtmlXToolbarObject.prototype.getListOptionToolTip = function(parentId, optionId) {
/**
*   @desc: sets an image for a listed option
*   @param: parentId - id of a select button
*   @param: optionId - id of a listed option
*   @param: img - image for a listed option
*   @type: public
*/
//dhtmlXToolbarObject.prototype.setListOptionImage = function(parentId, optionId, img) {
/**
*   @desc: returns an image of a listed option
*   @param: parentId - id of a select button
*   @param: optionId - id of a listed option
*   @type: public
*/
//dhtmlXToolbarObject.prototype.getListOptionImage = function(parentId, optionId) {
/**
*   @desc: removes an image (if exists) of a listed option
*   @param: parentId - id of a select button
*   @param: optionId - id of a listed option
*   @type: public
*/
//dhtmlXToolbarObject.prototype.clearListOptionImage = function(parentId, optionId) {
/**
*   @desc: calls user defined handler for each listed option of parentId
*   @param: parentId - id of a select button
*   @param: handler - user defined function, listed option id will passed as an argument
*   @type: public
*/
//dhtmlXToolbarObject.prototype.forEachListOption = function(parentId, handler) {
/**
*   @desc: returns array with ids of all listed options for parentId
*   @param: parentId - id of a select button
*   @type: public
*/
//dhtmlXToolbarObject.prototype.getAllListOptions = function(parentId) {
/**
*   @desc: sets listed option selected
*   @param: parentId - id of a select button
*   @param: optionId - id of a listed option
*   @type: public
*/
//dhtmlXToolbarObject.prototype.setListOptionSelected = function(parentId, optionId) {
/**
*   @desc: returns selected listed option
*   @param: parentId - id of a select button
*   @type: public
*/
//dhtmlXToolbarObject.prototype.getListOptionSelected = function(parentId) {
//#}
dhtmlXToolbarObject.prototype._rtlParseBtn = function(t1, t2) {
	return t1+t2;
}
/*****************************************************************************************************************************************************************
	object: separator
*****************************************************************************************************************************************************************/
dhtmlXToolbarObject.prototype._separatorObject = function(that, id, data) {
	//
	this.id = that.idPrefix+id;
	this.obj = document.createElement("DIV");
	this.obj.className = "dhx_toolbar_sep";
	this.obj.style.display = (data.hidden!=null?"none":"");
	this.obj.idd = String(id);
	this.obj.title = (data.title||"");
	this.obj.onselectstart = function(e) { e = e||event; e.returnValue = false; }
	if (that._isIPad) {
		this.obj.ontouchstart = function(e){
			e = e||event;
			e.returnValue = false;
			e.cancelBubble = true;
			return false;
		}
	}
	//
	// add object
	that.base.appendChild(this.obj);
	
	// functions
	this.showItem = function() {
		this.obj.style.display = "";
	}
	this.hideItem = function() {
		this.obj.style.display = "none";
	}
	this.isVisible = function() {
		return (this.obj.style.display == "");
	}
	//
	return this;
}
/*****************************************************************************************************************************************************************
	object: text
*****************************************************************************************************************************************************************/
dhtmlXToolbarObject.prototype._textObject = function(that, id, data) {
	this.id = that.idPrefix+id;
	this.obj = document.createElement("DIV");
	this.obj.className = "dhx_toolbar_text";
	this.obj.style.display = (data.hidden!=null?"none":"");
	this.obj.idd = String(id);
	this.obj.title = (data.title||"");
	this.obj.onselectstart = function(e) { e = e||event; e.returnValue = false; }
	if (that._isIPad) {
		this.obj.ontouchstart = function(e){
			e = e||event;
			e.returnValue = false;
			e.cancelBubble = true;
			return false;
		}
	}
	//
	this.obj.innerHTML = (data.text||"");
	//
	that.base.appendChild(this.obj);
	//
	this.showItem = function() {
		this.obj.style.display = "";
	}
	this.hideItem = function() {
		this.obj.style.display = "none";
	}
	this.isVisible = function() {
		return (this.obj.style.display == "");
	}
	this.setItemText = function(text) {
		this.obj.innerHTML = text;
	}
	this.getItemText = function() {
		return this.obj.innerHTML;
	}
	this.setWidth = function(width) {
		this.obj.style.width = width+"px";
	}
	this.setItemToolTip = function(t) {
		this.obj.title = t;
	}
	this.getItemToolTip = function() {
		return this.obj.title;
	}
	//
	return this;
}
/*****************************************************************************************************************************************************************
	object: button
******************************************************************************************************************************************************************/
dhtmlXToolbarObject.prototype._buttonObject = function(that, id, data) {
	
	this.id = that.idPrefix+id;
	this.state = (data.enabled!=null?false:true);
	this.imgEn = (data.img||"");
	this.imgDis = (data.imgdis||"");
	this.img = (this.state?(this.imgEn!=""?this.imgEn:""):(this.imgDis!=""?this.imgDis:""));
	
	//
	this.obj = document.createElement("DIV");
	this.obj.className = "dhx_toolbar_btn "+(this.state?"def":"dis");
	this.obj.style.display = (data.hidden!=null?"none":"");
	this.obj.allowClick = false;
	this.obj.extAction = (data.action||null);
	this.obj.renderAs = this.obj.className;
	this.obj.idd = String(id);
	this.obj.title = (data.title||"");
	this.obj.pressed = false;
	//
	this.obj.innerHTML = that._rtlParseBtn((this.img!=""?"<img src='"+that.imagePath+this.img+"'>":""), (data.text!=null?"<div>"+data.text+"</div>":""));
	
	var obj = this;
	
	this.obj.onselectstart = function(e) { e = e||event; e.returnValue = false; }
	this.obj.onmouseover = function() { this._doOnMouseOver(); }
	this.obj.onmouseout = function() { this._doOnMouseOut(); }
	this.obj._doOnMouseOver = function() {
		this.allowClick = true;
		if (obj.state == false) return;
		if (that.anyUsed != "none") return;
		this.className = "dhx_toolbar_btn over";
		this.renderAs = this.className;
	}
	this.obj._doOnMouseOut = function() {
		this.allowClick = false;
		if (obj.state == false) return;
		if (that.anyUsed != "none") return;
		this.className = "dhx_toolbar_btn def";
		this.renderAs = this.renderAs;
	}
	
	this.obj.onclick = function(e) {
		if (obj.state == false) return;
		if (this.allowClick == false) return;
		e = e||event;
		// event
		var id = this.idd.replace(that.idPrefix,"");
		if (this.extAction) try {window[this.extAction](id);} catch(e){};
		if(that&&that.callEvent) that.callEvent("onClick", [id]);
	}
	
	this.obj[that._isIPad?"ontouchstart":"onmousedown"] = function(e) {
		if (obj.state == false) { e = e||event; e.returnValue = false; e.cancelBubble = true; return false; }
		if (that.anyUsed != "none") return;
		that.anyUsed = this.idd;
		this.className = "dhx_toolbar_btn pres";
		this.pressed = true;
		this.onmouseover = function() { this._doOnMouseOver(); }
		this.onmouseout = function() { that.anyUsed = "none"; this._doOnMouseOut(); }
		return false;
	}
	this.obj[that._isIPad?"ontouchend":"onmouseup"] = function(e) {
		if (obj.state == false) return;
		if (that.anyUsed != "none") { if (that.anyUsed != this.idd) return; }
		var t = that.anyUsed;
		this._doOnMouseUp();
		if (that._isIPad && t != "none") that.callEvent("onClick", [this.idd.replace(that.idPrefix,"")]);
	}
	if (that._isIPad) {
		this.obj.ontouchmove = function(e) {
			this._doOnMouseUp();
		}
	}
	this.obj._doOnMouseUp = function() {
		that.anyUsed = "none";
		this.className = this.renderAs;
		this.pressed = false;
	}
	this.obj._doOnMouseUpOnceAnywhere = function() {
		this._doOnMouseUp();
		this.onmouseover = function() { this._doOnMouseOver(); }
		this.onmouseout = function() { this._doOnMouseOut(); }
	}
	
	// add object
	that.base.appendChild(this.obj);
	//
	// functions
	this.enableItem = function() {
		that._enableItem(this);
	}
	this.disableItem = function() {
		that._disableItem(this);
	}
	this.isEnabled = function() {
		return this.state;
	}
	this.showItem = function() {
		this.obj.style.display = "";
	}
	this.hideItem = function() {
		this.obj.style.display = "none";
	}
	this.isVisible = function() {
		return (this.obj.style.display == "");
	}
	this.setItemText = function(text) {
		that._setItemText(this, text);
	}
	this.getItemText = function() {
		return that._getItemText(this);
	}
	this.setItemImage = function(url) {
		that._setItemImage(this, url, true);
	}
	this.clearItemImage = function() {
		that._clearItemImage(this, true);
	}
	this.setItemImageDis = function(url) {
		that._setItemImage(this, url, false);
	}
	this.clearItemImageDis = function() {
		that._clearItemImage(this, false);
	}
	this.setItemToolTip = function(tip) {
		this.obj.title = tip;
	}
	this.getItemToolTip = function() {
		return this.obj.title;
	}
	return this;
}
//#tool_list:06062008{
/* ****************************************************************************************************************************************************************
	object: buttonSelect
***************************************************************************************************************************************************************** */
dhtmlXToolbarObject.prototype._buttonSelectObject = function(that, id, data) {
	this.id = that.idPrefix+id;
	this.state = (data.enabled!=null?(data.enabled=="true"?true:false):true);
	this.imgEn = (data.img||"");
	this.imgDis = (data.imgdis||"");
	this.img = (this.state?(this.imgEn!=""?this.imgEn:""):(this.imgDis!=""?this.imgDis:""));
	
	this.mode = (data.mode||"button"); // button, select
	if (this.mode == "select") {
		this.openAll = true;
		this.renderSelect = false;
		if (!data.text||data.text.length==0) data.text = "&nbsp;"
	} else {
		this.openAll = (data.openAll!=null);
		this.renderSelect = (data.renderSelect!=null?(data.renderSelect=="false"||data.renderSelect=="disabled"?false:true):true);
	}
	this.maxOpen = (!isNaN(data.maxOpen?data.maxOpen:"")?data.maxOpen:null);
	
	
	
	this._maxOpenTest = function() {
		if (!isNaN(this.maxOpen)) {
			if (!that._sbw) {
				var t = document.createElement("DIV");
				t.className = "dhxtoolbar_maxopen_test";
				document.body.appendChild(t);
				var k = document.createElement("DIV");
				k.className = "dhxtoolbar_maxopen_test2";
				t.appendChild(k);
				that._sbw = t.offsetWidth-k.offsetWidth;
				t.removeChild(k);
				k = null;
				document.body.removeChild(t);
				t = null;
			}
		}
	}
	this._maxOpenTest();
	
	//
	this.obj = document.createElement("DIV");
	this.obj.allowClick = false;
	this.obj.extAction = (data.action||null);
	this.obj.className = "dhx_toolbar_btn "+(this.state?"def":"dis");
	this.obj.style.display = (data.hidden!=null?"none":"");
	this.obj.renderAs = this.obj.className;
	this.obj.onselectstart = function(e) { e = e||event; e.returnValue = false; }
	this.obj.idd = String(id);
	this.obj.title = (data.title||"");
	this.obj.pressed = false;
	
	this.callEvent = false;
	
	
	
	this.obj.innerHTML = that._rtlParseBtn((this.img!=""?"<img src='"+that.imagePath+this.img+"'>":""),(data.text!=null?"<div>"+data.text+"</div>":""));
	
	// add object
	that.base.appendChild(this.obj);
	
	this.arw = document.createElement("DIV");
	this.arw.className = "dhx_toolbar_arw "+(this.state?"def":"dis");;
	this.arw.style.display = this.obj.style.display;
	this.arw.innerHTML = "<div class='arwimg'>&nbsp;</div>";
	
	this.arw.title = this.obj.title;
	this.arw.onselectstart = function(e) { e = e||event; e.returnValue = false; }
	that.base.appendChild(this.arw);
	
	var self = this;
	
	this.obj.onmouseover = function(e) {
		e = e||event;
		if (that.anyUsed != "none") return;
		if (!self.state) return;
		self.obj.renderAs = "dhx_toolbar_btn over";
		self.obj.className = self.obj.renderAs;
		self.arw.className = String(self.obj.renderAs).replace("btn","arw");
	}
	this.obj.onmouseout = function() {
		self.obj.allowClick = false;
		if (that.anyUsed != "none") return;
		if (!self.state) return;
		self.obj.renderAs = "dhx_toolbar_btn def";
		self.obj.className = self.obj.renderAs;
		self.arw.className = String(self.obj.renderAs).replace("btn","arw");
		self.callEvent = false;
	}
	this.arw.onmouseover = this.obj.onmouseover;
	this.arw.onmouseout = this.obj.onmouseout;
	
	if (this.openAll == true) {
		
	} else {
	
		this.obj.onclick = function(e) {
			e = e||event;
			if (!self.obj.allowClick) return;
			if (!self.state) return;
			if (that.anyUsed != "none") return;
			// event
			var id = self.obj.idd.replace(that.idPrefix,"");
			if (self.obj.extAction) try {window[self.obj.extAction](id);} catch(e){};
			that.callEvent("onClick", [id]);
		}
		this.obj[that._isIPad?"ontouchstart":"onmousedown"] = function(e) {
			e = e||event;
			if (that.anyUsed != "none") return;
			if (!self.state) return;
			self.obj.allowClick = true;
			self.obj.className = "dhx_toolbar_btn pres";
			self.arw.className = "dhx_toolbar_arw pres";
			self.callEvent = true;
		}
		this.obj[that._isIPad?"ontouchend":"onmouseup"] = function(e) {
			e = e||event;
			e.cancelBubble = true;
			if (that.anyUsed != "none") return;
			if (!self.state) return;
			self.obj.className = self.obj.renderAs;
			self.arw.className = String(self.obj.renderAs).replace("btn","arw");
			if (that._isIPad && self.callEvent) {
				var id = self.obj.idd.replace(that.idPrefix,"");
				that.callEvent("onClick", [id]);
			}
		}
		
	}
	
	if (that._isIPad) {
		this.obj.ontouchmove = this.obj.onmouseout;
	}
	
	this.arw[that._isIPad?"ontouchstart":"onmousedown"] = function(e) {
		e = e||event;
		if (!self.state) return;
		if (that.anyUsed == self.obj.idd) {
			// hide
			self.obj.className = self.obj.renderAs;
			self.arw.className = String(self.obj.renderAs).replace("btn","arw");
			that.anyUsed = "none";
			self.polygon.style.display = "none";
			if (self.polygon._ie6cover) self.polygon._ie6cover.style.display = "none";
		} else { 
			if (that.anyUsed != "none") {
				if (that.objPull[that.idPrefix+that.anyUsed]["type"] == "buttonSelect") {
					var item = that.objPull[that.idPrefix+that.anyUsed];
					if (item.polygon.style.display != "none") {
						item.obj.renderAs = "dhx_toolbar_btn def";
						item.obj.className = item.obj.renderAs;
						item.arw.className = String(self.obj.renderAs).replace("btn","arw");
						item.polygon.style.display = "none";
						if (item.polygon._ie6cover) item.polygon._ie6cover.style.display = "none";
					}
				}
			}
			self.obj.className = "dhx_toolbar_btn over";
			self.arw.className = "dhx_toolbar_arw pres";
			that.anyUsed = self.obj.idd;
			// show
			self.polygon.style.top = "0px";
			self.polygon.style.visibility = "hidden";
			self.polygon.style.display = "";
			// check maxOpen
			self._fixMaxOpenHeight(self.maxOpen||null);
			// detect overlay by Y axis
			that._autoDetectVisibleArea();
			// calculate top position
			var newTop = getAbsoluteTop(self.obj)+self.obj.offsetHeight+that.selectPolygonOffsetTop;
			var newH = self.polygon.offsetHeight;
			if (newTop + newH > that.tY2) {
				// if maxOpen mode enabled, check if at bottom at least one item can be shown
				// and show it, if no space - show on top. in maxOpen mode not enabled, show at top
				var k0 = (self.maxOpen!=null?Math.floor((that.tY2-newTop)/22):0); // k0 = count of items that can be visible
				if (k0 >= 1) {
					self._fixMaxOpenHeight(k0);
				} else {
					newTop = getAbsoluteTop(self.obj)-newH-that.selectPolygonOffsetTop;
					if (newTop < 0) newTop = 0;
				}
			}
			self.polygon.style.top = newTop+"px";
			// calculate left position
			if (that.rtl) {
				self.polygon.style.left = getAbsoluteLeft(self.obj)+self.obj.offsetWidth-self.polygon.offsetWidth+that.selectPolygonOffsetLeft+"px";
			} else {
				self.polygon.style.left = getAbsoluteLeft(self.obj)+that.selectPolygonOffsetLeft+"px";
			}
			self.polygon.style.visibility = "visible";
			// show IE6 cover if needed
			if (self.polygon._ie6cover) {
				self.polygon._ie6cover.style.left = self.polygon.style.left;
				self.polygon._ie6cover.style.top = self.polygon.style.top;
				self.polygon._ie6cover.style.width = self.polygon.offsetWidth+"px";
				self.polygon._ie6cover.style.height = self.polygon.offsetHeight+"px";
				self.polygon._ie6cover.style.display = "";
			}
		}
		return false;
	}
	this.arw.onclick = function(e) {
		e = e||event;
		e.cancelBubble = true;
	}
	this.arw[that._isIPad?"ontouchend":"onmouseup"] = function(e) {
		e = e||event;
		e.cancelBubble = true;
	}
	
	
	if (this.openAll === true) {
		this.obj.onclick = this.arw.onclick;
		this.obj.onmousedown = this.arw.onmousedown;
		this.obj.onmouseup = this.arw.onmouseup;
		if (that._isIPad) {
			this.obj.ontouchstart = this.arw.ontouchstart;
			this.obj.ontouchend = this.arw.ontouchend;
		}
	}
	
	this.obj.iddPrefix = that.idPrefix;
	this._listOptions = {};
	
	this._fixMaxOpenHeight = function(maxOpen) {
		var h = "auto";
		var h0 = false;
		if (maxOpen !== null) {
			var t = 0;
			for (var a in this._listOptions) t++;
			if (t > maxOpen) {
				this._ph = 22*maxOpen;
				h = this._ph+"px";
			} else {
				h0 = true;
			}
		}
		this.polygon.style.width = "auto";
		this.polygon.style.height = "auto";
		if (!h0 && self.maxOpen != null) {
			this.polygon.style.width = this.p_tbl.offsetWidth+that._sbw+"px";
			this.polygon.style.height = h;
		}
	}
	
	// inner objects: separator
	this._separatorButtonSelectObject = function(id, data, pos) {
		
		this.obj = {};
		this.obj.tr = document.createElement("TR");
		this.obj.tr.className = "tr_sep";
		this.obj.tr.onselectstart = function(e) { e = e||event; e.returnValue = false; return false; }
		this.obj.td = document.createElement("TD");
		this.obj.td.colSpan = "2";
		this.obj.td.className = "td_btn_sep";
		this.obj.td.onselectstart = function(e) { e = e||event; e.returnValue = false; return false; }
		
		if (isNaN(pos)) pos = self.p_tbody.childNodes.length+1; else if (pos < 1) pos = 1;
		if (pos > self.p_tbody.childNodes.length) self.p_tbody.appendChild(this.obj.tr); else self.p_tbody.insertBefore(this.obj.tr, self.p_tbody.childNodes[pos-1]);
		
		this.obj.tr.appendChild(this.obj.td);
		
		this.obj.sep = document.createElement("DIV");
		this.obj.sep.className = "btn_sep";
		this.obj.sep.onselectstart = function(e) { e = e||event; e.returnValue = false; return false; }
		this.obj.td.appendChild(this.obj.sep);
		
		self._listOptions[id] = this.obj;
		return this;
	}
	// inner objects: button
	this._buttonButtonSelectObject = function(id, data, pos) {
		
		this.obj = {};
		this.obj.tr = document.createElement("TR");
		this.obj.tr.en = (data.enabled=="false"?false:(data.disabled=="true"?false:true));
		this.obj.tr.extAction = (data.action||null);
		this.obj.tr._selected = (data.selected!=null);
		this.obj.tr.className = "tr_btn"+(this.obj.tr.en?(this.obj.tr._selected&&self.renderSelect?" tr_btn_selected":""):" tr_btn_disabled");
		this.obj.tr.onselectstart = function(e) { e = e||event; e.returnValue = false; return false; }
		this.obj.tr.idd = String(id);
		
		if (data.userdata) this.obj.userData = data.userdata;
		
		if (isNaN(pos)) pos = self.p_tbody.childNodes.length+1; else if (pos < 1) pos = 1;
		if (pos > self.p_tbody.childNodes.length) self.p_tbody.appendChild(this.obj.tr); else self.p_tbody.insertBefore(this.obj.tr, self.p_tbody.childNodes[pos-1]);
		
		this.obj.td_a = document.createElement("TD");
		this.obj.td_a.className = "td_btn_img";
		this.obj.td_a.onselectstart = function(e) { e = e||event; e.returnValue = false; return false; }
		this.obj.td_b = document.createElement("TD");
		this.obj.td_b.className = "td_btn_txt";
		this.obj.td_b.onselectstart = function(e) { e = e||event; e.returnValue = false; return false; }
		
		if (that.rtl) {
			this.obj.tr.appendChild(this.obj.td_b);
			this.obj.tr.appendChild(this.obj.td_a);
		} else {
			this.obj.tr.appendChild(this.obj.td_a);
			this.obj.tr.appendChild(this.obj.td_b);
		}
		
		// image
		if (data.img != null) {
			this.obj.td_a.innerHTML = "<img class='btn_sel_img' src='"+that.imagePath+data.img+"' border='0'>";
			this.obj.tr._img = data.img;
		}
		
		// text
		var itemText = (data.text!=null?data.text:(data.itemText||""));
		/*
		if (itemText == null) {
			var itm = data.getElementsByTagName("itemText");
			itemText = (itm[0]!=null?itm[0].firstChild.nodeValue:"");
		}
		*/
		this.obj.td_b.innerHTML = "<div class='btn_sel_text'>"+itemText+"</div>";
		
		this.obj.tr[that._isIPad?"ontouchstart":"onmouseover"] = function() {
			if (!this.en || (this._selected && self.renderSelect)) return;
			this.className = "tr_btn tr_btn_over";
		}
		
		this.obj.tr.onmouseout = function() {
			if (!this.en) return;
			if (this._selected && self.renderSelect) {
				if (String(this.className).search("tr_btn_selected") == -1) this.className = "tr_btn tr_btn_selected";
			} else {
				this.className = "tr_btn";
			}
		}
		
		this.obj.tr[that._isIPad?"ontouchend":"onclick"] = function(e) {
			
			e = e||event;
			e.cancelBubble = true;
			if (!this.en) return;
			
			self.setListOptionSelected(this.idd.replace(that.idPrefix,""));
			//
			self.obj.renderAs = "dhx_toolbar_btn def";
			self.obj.className = self.obj.renderAs;
			self.arw.className = String(self.obj.renderAs).replace("btn","arw");
			self.polygon.style.display = "none";
			if (self.polygon._ie6cover) self.polygon._ie6cover.style.display = "none";
			that.anyUsed = "none";
			// event
			var id = this.idd.replace(that.idPrefix,"");
			if (this.extAction) try {window[this.extAction](id);} catch(e){};
			that.callEvent("onClick", [id]);
		}		
		self._listOptions[id] = this.obj;
		
		return this;
		
	}
	
	// add polygon
	this.polygon = document.createElement("DIV");
	this.polygon.dir = "ltr";
	this.polygon.style.display = "none";
	this.polygon.style.zIndex = 101;
	this.polygon.className = "dhx_toolbar_poly_"+that.iconSize+"_"+that.skin+(that.rtl?" rtl":"");
	this.polygon.onselectstart = function(e) { e = e||event; e.returnValue = false; }
	this.polygon.style.overflowY = "auto";
	
	if (that._isIPad) {
		this.polygon.ontouchstart = function(e){
			e = e||event;
			e.returnValue = false;
			e.cancelBubble = true;
			return false;
		}
	}
	
	
	
	this.p_tbl = document.createElement("TABLE");
	this.p_tbl.className = "buttons_cont";
	this.p_tbl.cellSpacing = "0";
	this.p_tbl.cellPadding = "0";
	this.p_tbl.border = "0";
	this.polygon.appendChild(this.p_tbl);
	
	this.p_tbody = document.createElement("TBODY");
	this.p_tbl.appendChild(this.p_tbody);
	
	//
	if (data.items) {
		for (var q=0; q<data.items.length; q++) {
			var t = "_"+(data.items[q].type||"")+"ButtonSelectObject";
			if (typeof(this[t]) == "function") new this[t](data.items[q].id||that._genStr(24),data.items[q]);
		}
	}
	
	document.body.appendChild(this.polygon);
	
	// add poly ie6cover
	if (that._isIE6) {
		this.polygon._ie6cover = document.createElement("IFRAME");
		this.polygon._ie6cover.frameBorder = 0;
		this.polygon._ie6cover.style.position = "absolute";
		this.polygon._ie6cover.style.border = "none";
		this.polygon._ie6cover.style.backgroundColor = "#000000";
		this.polygon._ie6cover.style.filter = "alpha(opacity=100)";
		this.polygon._ie6cover.style.display = "none";
		this.polygon._ie6cover.setAttribute("src","javascript:false;");
		document.body.appendChild(this.polygon._ie6cover);
	}
	
	// functions
	// new engine
	this.setWidth = function(width) {
		this.obj.style.width = width-this.arw.offsetWidth+"px";
		this.polygon.style.width = this.obj.offsetWidth+this.arw.offsetWidth-2+"px";
		this.p_tbl.style.width = this.polygon.style.width;
	}
	this.enableItem = function() {
		that._enableItem(this);
	}
	this.disableItem = function() {
		that._disableItem(this);
	}
	this.isEnabled = function() {
		return this.state;
	}
	this.showItem = function() {
		this.obj.style.display = "";
		this.arw.style.display = "";
	}
	this.hideItem = function() {
		this.obj.style.display = "none";
		this.arw.style.display = "none";
	}
	this.isVisible = function() {
		return (this.obj.style.display == "");
	}
	this.setItemText = function(text) {
		that._setItemText(this, text);
	}
	this.getItemText = function() {
		return that._getItemText(this);
	}
	this.setItemImage = function(url) {
		that._setItemImage(this, url, true);
	}
	this.clearItemImage = function() {
		that._clearItemImage(this, true);
	}
	this.setItemImageDis = function(url) {
		that._setItemImage(this, url, false);
	}
	this.clearItemImageDis = function() {
		that._clearItemImage(this, false);
	}
	this.setItemToolTip = function(tip) {
		this.obj.title = tip;
		this.arw.title = tip;
	}
	this.getItemToolTip = function() {
		return this.obj.title;
	}
	/* list option functions */
	// new engine
	this.addListOption = function(id, pos, type, text, img) {
		if (!(type == "button" || type == "separator")) return;
		var dataItem = {id:id,type:type,text:text,img:img};
		new this["_"+type+"ButtonSelectObject"](id, dataItem, pos);
	}
	// new engine
	this.removeListOption = function(id) {
		if (!this._isListButton(id, true)) return;
		var item = this._listOptions[id];
		if (item.td_a != null && item.td_b != null) {
			// button
			item.td_a.onselectstart = null;
			item.td_b.onselectstart = null;
			while (item.td_a.childNodes.length > 0) item.td_a.removeChild(item.td_a.childNodes[0]);
			while (item.td_b.childNodes.length > 0) item.td_b.removeChild(item.td_b.childNodes[0]);
			item.tr.onselectstart = null;
			item.tr.onmouseover = null;
			item.tr.onmouseout = null;
			item.tr.onclick = null;
			while (item.tr.childNodes.length > 0) item.tr.removeChild(item.tr.childNodes[0]);
			item.tr.parentNode.removeChild(item.tr);
			item.td_a = null;
			item.td_b = null;
			item.tr = null;
		} else {
			// separator
			item.sep.onselectstart = null;
			item.td.onselectstart = null;
			item.tr.onselectstart = null;
			while (item.td.childNodes.length > 0) item.td.removeChild(item.td.childNodes[0]);
			while (item.tr.childNodes.length > 0) item.tr.removeChild(item.tr.childNodes[0]);
			item.tr.parentNode.removeChild(item.tr);
			item.sep = null;
			item.td = null;
			item.tr = null;
		}
		item = null;
		this._listOptions[id] = null;
		try { delete this._listOptions[id]; } catch(e) {}
	}
	// new engine
	this.showListOption = function(id) {
		if (!this._isListButton(id, true)) return;
		this._listOptions[id].tr.style.display = "";
	}
	// new engine
	this.hideListOption = function(id) {
		if (!this._isListButton(id, true)) return;
		this._listOptions[id].tr.style.display = "none";
	}
	// new engine
	this.isListOptionVisible = function(id) {
		if (!this._isListButton(id, true)) return;
		return (this._listOptions[id].tr.style.display != "none");
	}
	// new engine
	this.enableListOption = function(id) {
		if (!this._isListButton(id)) return;
		this._listOptions[id].tr.en = true;
		this._listOptions[id].tr.className = "tr_btn"+(this._listOptions[id].tr._selected&&that.renderSelect?" tr_btn_selected":"");
	}
	// new engine
	this.disableListOption = function(id) {
		if (!this._isListButton(id)) return;
		this._listOptions[id].tr.en = false;
		this._listOptions[id].tr.className = "tr_btn tr_btn_disabled";
	}
	// new engine
	this.isListOptionEnabled = function(id) {
		if (!this._isListButton(id)) return;
		return this._listOptions[id].tr.en;
	}
	// new engine
	this.setListOptionPosition = function(id, pos) {
		if (!this._listOptions[id] || this.getListOptionPosition(id) == pos || isNaN(pos)) return;
		if (pos < 1) pos = 1;
		var tr = this._listOptions[id].tr;
		this.p_tbody.removeChild(tr);
		if (pos > this.p_tbody.childNodes.length) this.p_tbody.appendChild(tr); else this.p_tbody.insertBefore(tr, this.p_tbody.childNodes[pos-1]);
		tr = null;
	}
	// new engine
	this.getListOptionPosition = function(id) {
		var pos = -1;
		if (!this._listOptions[id]) return pos;
		for (var q=0; q<this.p_tbody.childNodes.length; q++) if (this.p_tbody.childNodes[q] == this._listOptions[id].tr) pos=q+1;
		return pos;
	}
	// new engine
	this.setListOptionImage = function(id, img) {
		if (!this._isListButton(id)) return;
		var td = this._listOptions[id].tr.childNodes[(that.rtl?1:0)];
		if (td.childNodes.length > 0) {
			td.childNodes[0].src = that.imagePath+img;
		} else {
			var imgObj = document.createElement("IMG");
			imgObj.className = "btn_sel_img";
			imgObj.src = that.imagePath+img;
			td.appendChild(imgObj);
		}
		td = null;
	}
	// new engine
	this.getListOptionImage = function(id) {
		if (!this._isListButton(id)) return;
		var td = this._listOptions[id].tr.childNodes[(that.rtl?1:0)];
		var src = null;
		if (td.childNodes.length > 0) src = td.childNodes[0].src;
		td = null;
		return src;
	}
	// new engine
	this.clearListOptionImage = function(id) {
		if (!this._isListButton(id)) return;
		var td = this._listOptions[id].tr.childNodes[(that.rtl?1:0)];
		while (td.childNodes.length > 0) td.removeChild(td.childNodes[0]);
		td = null;
	}
	// new engine
	this.setListOptionText = function(id, text) {
		if (!this._isListButton(id)) return;
		this._listOptions[id].tr.childNodes[(that.rtl?0:1)].childNodes[0].innerHTML = text;
	}
	// new engine
	this.getListOptionText = function(id) {
		if (!this._isListButton(id)) return;
		return this._listOptions[id].tr.childNodes[(that.rtl?0:1)].childNodes[0].innerHTML;
	}
	// new engine
	this.setListOptionToolTip = function(id, tip) {
		if (!this._isListButton(id)) return;
		this._listOptions[id].tr.title = tip;
	}
	// new engine
	this.getListOptionToolTip = function(id) {
		if (!this._isListButton(id)) return;
		return this._listOptions[id].tr.title;
	}
	// works
	this.forEachListOption = function(handler) {
		for (var a in this._listOptions) handler(a);
	}
	// works, return array with ids
	this.getAllListOptions = function() {
		var listData = new Array();
		for (var a in this._listOptions) listData[listData.length] = a;
		return listData;
	}
	// new engine
	this.setListOptionSelected = function(id) {
		for (var a in this._listOptions) {
			var item = this._listOptions[a];
			if (item.td_a != null && item.td_b != null && item.tr.en) {
				if (a == id) {
					item.tr._selected = true;
					item.tr.className = "tr_btn"+(this.renderSelect?" tr_btn_selected":"");
					//
					if (this.mode == "select") {
						if (item.tr._img) this.setItemImage(item.tr._img); else this.clearItemImage();
						this.setItemText(this.getListOptionText(id));
					}
				} else {
					item.tr._selected = false;
					item.tr.className = "tr_btn";
				}
			}
			item = null;
		}
	}
	// new engine
	this.getListOptionSelected = function() {
		var id = null;
		for (var a in this._listOptions) if (this._listOptions[a].tr._selected == true) id = a;
		return id;
	}
	// inner, return tru if list option is button and is exists
	this._isListButton = function(id, allowSeparator) {
		if (this._listOptions[id] == null) return false;
		if (!allowSeparator && this._listOptions[id].tr.className == "tr_sep") return false;
		return true;
	}
	
	this.setMaxOpen = function(r) {
		this._ph = null;
		if (typeof(r) == "number") {
			this.maxOpen = r;
			this._maxOpenTest();
			return;
		}
		this.maxOpen = null;
	}
	
	if (data.width) this.setWidth(data.width);
	
	if (this.mode == "select" && typeof(data.selected) != "undefined") this.setListOptionSelected(data.selected);
	
	//
	return this;
}
//#}
	
//#tool_input:06062008{
/*****************************************************************************************************************************************************************
	object: buttonInput
***************************************************************************************************************************************************************** */
dhtmlXToolbarObject.prototype._buttonInputObject = function(that, id, data) {
	//
	this.id = that.idPrefix+id;
	this.obj = document.createElement("DIV");
	this.obj.className = "dhx_toolbar_btn def";
	this.obj.style.display = (data.hidden!=null?"none":"");
	this.obj.idd = String(id);
	this.obj.w = (data.width!=null?data.width:100);
	this.obj.title = (data.title!=null?data.title:"");
	//
	this.obj.innerHTML = "<input class='inp' type='text' style='-moz-user-select:text;width:"+this.obj.w+"px;'"+(data.value!=null?"' value='"+data.value+"'":"")+">";
	
	var th = that;
	var self = this;
	this.obj.childNodes[0].onkeydown = function(e) {
		e = e||event;
		if (e.keyCode == 13) { th.callEvent("onEnter", [self.obj.idd, this.value]); }
	}
	// add
	that.base.appendChild(this.obj);
	//
	this.enableItem = function() {
		this.obj.childNodes[0].disabled = false;
	}
	this.disableItem = function() {
		this.obj.childNodes[0].disabled = true;
	}
	this.isEnabled = function() {
		return (!this.obj.childNodes[0].disabled);
	}
	this.showItem = function() {
		this.obj.style.display = "";
	}
	this.hideItem = function() {
		this.obj.style.display = "none";
	}
	this.isVisible = function() {
		return (this.obj.style.display != "none");
	}
	this.setValue = function(value) {
		this.obj.childNodes[0].value = value;
	}
	this.getValue = function() {
		return this.obj.childNodes[0].value;
	}
	this.setWidth = function(width) {
		this.obj.w = width;
		this.obj.childNodes[0].style.width = this.obj.w+"px";
	}
	this.getWidth = function() {
		return this.obj.w;
	}
	this.setItemToolTip = function(tip) {
		this.obj.title = tip;
	}
	this.getItemToolTip = function() {
		return this.obj.title;
	}
	//
	return this;
}
//#}
//#tool_2state:06062008{
/*****************************************************************************************************************************************************************
	object: buttonTwoState
***************************************************************************************************************************************************************** */
dhtmlXToolbarObject.prototype._buttonTwoStateObject = function(that, id, data) {
	this.id = that.idPrefix+id;
	this.state = (data.enabled!=null?false:true);
	this.imgEn = (data.img!=null?data.img:"");
	this.imgDis = (data.imgdis!=null?data.imgdis:"");
	this.img = (this.state?(this.imgEn!=""?this.imgEn:""):(this.imgDis!=""?this.imgDis:""));
	//
	this.obj = document.createElement("DIV");
	this.obj.pressed = (data.selected!=null);
	this.obj.extAction = (data.action||null);
	this.obj.className = "dhx_toolbar_btn "+(this.obj.pressed?"pres"+(this.state?"":"_dis"):(this.state?"def":"dis"));
	this.obj.style.display = (data.hidden!=null?"none":"");
	this.obj.renderAs = this.obj.className;
	this.obj.idd = String(id);
	this.obj.title = (data.title||"");
	if (this.obj.pressed) { this.obj.renderAs = "dhx_toolbar_btn over"; }
	
	this.obj.innerHTML = that._rtlParseBtn((this.img!=""?"<img src='"+that.imagePath+this.img+"'>":""),(data.text!=null?"<div>"+data.text+"</div>":""));
	
	// add object
	that.base.appendChild(this.obj);
	
	var obj = this;
	
	this.obj.onselectstart = function(e) { e = e||event; e.returnValue = false; }
	this.obj.onmouseover = function() { this._doOnMouseOver(); }
	this.obj.onmouseout = function() { this._doOnMouseOut(); }
	this.obj._doOnMouseOver = function() {
		if (obj.state == false) return;
		if (that.anyUsed != "none") return;
		if (this.pressed) {
			this.renderAs = "dhx_toolbar_btn over";
			return;
		}
		this.className = "dhx_toolbar_btn over";
		this.renderAs = this.className;
	}
	this.obj._doOnMouseOut = function() {
		if (obj.state == false) return;
		if (that.anyUsed != "none") return;
		if (this.pressed) {
			this.renderAs = "dhx_toolbar_btn def";
			return;
		}
		this.className = "dhx_toolbar_btn def";
		this.renderAs = this.className;
	}
	this.obj[that._isIPad?"ontouchstart":"onmousedown"] = function(e) {
		
		if (that.checkEvent("onBeforeStateChange")) if (!that.callEvent("onBeforeStateChange", [this.idd.replace(that.idPrefix, ""), this.pressed])) return;
		//
		if (obj.state == false) return;
		if (that.anyUsed != "none") return;
		this.pressed = !this.pressed;
		this.className = (this.pressed?"dhx_toolbar_btn pres":this.renderAs);
		
		// event
		var id = this.idd.replace(that.idPrefix, "");
		if (this.extAction) try {window[this.extAction](id, this.pressed);} catch(e){};
		that.callEvent("onStateChange", [id, this.pressed]);
		//this._doOnMouseOut();
		return false;
	}
	
	// functions
	this.setItemState = function(state, callEvent) {
		if (this.obj.pressed != state) {
			if (state == true) {
				this.obj.pressed = true;
				this.obj.className = "dhx_toolbar_btn pres"+(this.state?"":"_dis");
				this.obj.renderAs = "dhx_toolbar_btn over";
			} else {
				this.obj.pressed = false;
				this.obj.className = "dhx_toolbar_btn "+(this.state?"def":"dis");
				this.obj.renderAs = this.obj.className;
			}
			if (callEvent == true) {
				var id = this.obj.idd.replace(that.idPrefix, "");
				if (this.obj.extAction) try {window[this.obj.extAction](id, this.obj.pressed);} catch(e){};
				that.callEvent("onStateChange", [id, this.obj.pressed]);
			}
		}
	}
	this.getItemState = function() {
		return this.obj.pressed;
	}
	this.enableItem = function() {
		that._enableItem(this);
	}
	this.disableItem = function() {
		that._disableItem(this);
	}
	this.isEnabled = function() {
		return this.state;
	}
	this.showItem = function() {
		this.obj.style.display = "";
	}
	this.hideItem = function() {
		this.obj.style.display = "none";
	}
	this.isVisible = function() {
		return (this.obj.style.display == "");
	}
	this.setItemText = function(text) {
		that._setItemText(this, text);
	}
	this.getItemText = function() {
		return that._getItemText(this);
	}
	this.setItemImage = function(url) {
		that._setItemImage(this, url, true);
	}
	this.clearItemImage = function() {
		that._clearItemImage(this, true);
	}
	this.setItemImageDis = function(url) {
		that._setItemImage(this, url, false);
	}
	this.clearItemImageDis = function() {
		that._clearItemImage(this, false);
	}
	this.setItemToolTip = function(tip) {
		this.obj.title = tip;
	}
	this.getItemToolTip = function() {
		return this.obj.title;
	}
	//
	return this;
}
//#}
//#tool_slider:06062008{
/*****************************************************************************************************************************************************************
	object: slider
***************************************************************************************************************************************************************** */
dhtmlXToolbarObject.prototype._sliderObject = function(that, id, data) {
	this.id = that.idPrefix+id;
	this.state = (data.enabled!=null?(data.enabled=="true"?true:false):true);
	this.obj = document.createElement("DIV");
	this.obj.className = "dhx_toolbar_btn "+(this.state?"def":"dis");
	this.obj.style.display = (data.hidden!=null?"none":"");
	this.obj.onselectstart = function(e) { e = e||event; e.returnValue = false; }
	this.obj.idd = String(id);
	this.obj.len = (data.length!=null?Number(data.length):50);
	//
	this.obj.innerHTML = "<div>"+(data.textMin||"")+"</div>"+
				"<div class='sl_bg_l'></div>"+
				"<div class='sl_bg_m' style='width:"+this.obj.len+"px;'></div>"+
				"<div class='sl_bg_r'></div>"+
				"<div>"+(data.textMax||"")+"</div>";
	// add object
	that.base.appendChild(this.obj);
	var self = this;
	
	this.pen = document.createElement("DIV");
	this.pen.className = "sl_pen";
	this.obj.appendChild(this.pen);
	var pen = this.pen;
	
	this.label = document.createElement("DIV");
	this.label.dir = "ltr";
	this.label.className = "dhx_toolbar_slider_label_"+that.skin+(that.rtl?"_rtl":"");
	this.label.style.display = "none";
	this.label.tip = (data.toolTip||"%v");
	document.body.appendChild(this.label);
	var label = this.label;
	
	// mix-max value
	this.pen.valueMin = (data.valueMin!=null?Number(data.valueMin):0);
	this.pen.valueMax = (data.valueMax!=null?Number(data.valueMax):100);
	if (this.pen.valueMin > this.pen.valueMax) this.pen.valueMin = this.pen.valueMax;
	
	// init value
	this.pen.valueNow = (data.valueNow!=null?Number(data.valueNow):this.pen.valueMax);
	if (this.pen.valueNow > this.pen.valueMax) this.pen.valueNow = this.pen.valueMax;
	if (this.pen.valueNow < this.pen.valueMin) this.pen.valueNow = this.pen.valueMin;
	
	// min/max x coordinate
	this.pen._detectLimits = function() {
		this.minX = self.obj.childNodes[1].offsetLeft-4;
		this.maxX = self.obj.childNodes[3].offsetLeft-this.offsetWidth+1;
	}
	this.pen._detectLimits();
	
	// position
	this.pen._definePos = function() {
		this.nowX = Math.round((this.valueNow-this.valueMin)*(this.maxX-this.minX)/(this.valueMax-this.valueMin)+this.minX);
		this.style.left = this.nowX+"px";
		this.newNowX = this.nowX;
	}
	this.pen._definePos();

	this.pen.initXY = 0;
	this.pen.allowMove = false;
	this.pen[that._isIPad?"ontouchstart":"onmousedown"] = function(e) {
		if (self.state == false) return;
		e = e||event;
		this.initXY = (that._isIPad?e.touches[0].clientX:e.clientX); //e.clientX;
		this.newValueNow = this.valueNow;
		this.allowMove = true;
		this.className = "sl_pen over";
		if (label.tip != "") {
			label.style.visibility = "hidden";
			label.style.display = "";
			label.innerHTML = label.tip.replace("%v", this.valueNow);
			label.style.left = Math.round(getAbsoluteLeft(this)+this.offsetWidth/2-label.offsetWidth/2)+"px";
			label.style.top = getAbsoluteTop(this)-label.offsetHeight-3+"px";
			label.style.visibility = "";
		}
	}
	
	this.pen._doOnMouseMoveStart = function(e) {
		// optimized for destructor
		e=e||event;
		if (!pen.allowMove) return;
		var ecx = (that._isIPad?e.touches[0].clientX:e.clientX);
		var ofst = ecx - pen.initXY;
		
		// mouse goes out to left/right from pen
		if (ecx < getAbsoluteLeft(pen)+Math.round(pen.offsetWidth/2) && pen.nowX == pen.minX) return;
		if (ecx > getAbsoluteLeft(pen)+Math.round(pen.offsetWidth/2) && pen.nowX == pen.maxX) return;
		
		pen.newNowX = pen.nowX + ofst;
		
		if (pen.newNowX < pen.minX) pen.newNowX = pen.minX;
		if (pen.newNowX > pen.maxX) pen.newNowX = pen.maxX;
		pen.nowX = pen.newNowX;
		pen.style.left = pen.nowX+"px";
		pen.initXY = ecx;
		pen.newValueNow = Math.round((pen.valueMax-pen.valueMin)*(pen.newNowX-pen.minX)/(pen.maxX-pen.minX)+pen.valueMin);
		if (label.tip != "") {
			label.innerHTML = label.tip.replace(/%v/gi, pen.newValueNow);
			label.style.left = Math.round(getAbsoluteLeft(pen)+pen.offsetWidth/2-label.offsetWidth/2)+"px";
			label.style.top = getAbsoluteTop(pen)-label.offsetHeight-3+"px";
		}
		e.cancelBubble = true;
		e.returnValue = false;
		return false;
	}
	this.pen._doOnMouseMoveEnd = function() {
		if (!pen.allowMove) return;
		pen.className = "sl_pen";
		pen.allowMove = false;
		pen.nowX = pen.newNowX;
		pen.valueNow = pen.newValueNow;
		if (label.tip != "") label.style.display = "none";
		that.callEvent("onValueChange", [self.obj.idd.replace(that.idPrefix, ""), pen.valueNow]);
	}
	
	if (that._isIPad) {
		document.addEventListener("touchmove", pen._doOnMouseMoveStart, false);
		document.addEventListener("touchend", pen._doOnMouseMoveEnd, false);
	} else {
		if (_isIE) {
			document.body.attachEvent("onmousemove", pen._doOnMouseMoveStart);
			document.body.attachEvent("onmouseup", pen._doOnMouseMoveEnd);
		} else {
			window.addEventListener("mousemove", pen._doOnMouseMoveStart, false);
			window.addEventListener("mouseup", pen._doOnMouseMoveEnd, false);
		}
	}
	// functions
	this.enableItem = function() {
		if (this.state) return;
		this.state = true;
		this.obj.className = "dhx_toolbar_btn def";
	}
	this.disableItem = function() {
		if (!this.state) return;
		this.state = false;
		this.obj.className = "dhx_toolbar_btn dis";
	}
	this.isEnabled = function() {
		return this.state;
	}
	this.showItem = function() {
		this.obj.style.display = "";
	}
	this.hideItem = function() {
		this.obj.style.display = "none";
	}
	this.isVisible = function() {
		return (this.obj.style.display == "");
	}
	this.setValue = function(value, callEvent) {
		value = Number(value);
		if (value < this.pen.valueMin) value = this.pen.valueMin;
		if (value > this.pen.valueMax) value = this.pen.valueMax;
		this.pen.valueNow = value;
		this.pen._definePos();
		if (callEvent == true) that.callEvent("onValueChange", [this.obj.idd.replace(that.idPrefix, ""), this.pen.valueNow]);
	}
	this.getValue = function() {
		return this.pen.valueNow;
	}
	this.setMinValue = function(value, label) {
		value = Number(value);
		if (value > this.pen.valueMax) return;
		this.obj.childNodes[0].innerHTML = label;
		this.obj.childNodes[0].style.display = (label.length>0?"":"none");
		this.pen.valueMin = value;
		if (this.pen.valueNow < this.pen.valueMin) this.pen.valueNow = this.pen.valueMin;
		this.pen._detectLimits();
		this.pen._definePos();
	}
	this.setMaxValue = function(value, label) {
		value = Number(value);
		if (value < this.pen.valueMin) return;
		this.obj.childNodes[4].innerHTML = label;
		this.obj.childNodes[4].style.display = (label.length>0?"":"none");
		this.pen.valueMax = value;
		if (this.pen.valueNow > this.pen.valueMax) this.pen.valueNow = this.pen.valueMax;
		this.pen._detectLimits();
		this.pen._definePos();
	}
	this.getMinValue = function() {
		var label = this.obj.childNodes[0].innerHTML;
		var value = this.pen.valueMin;
		return new Array(value, label);
	}
	this.getMaxValue = function() {
		var label = this.obj.childNodes[4].innerHTML;
		var value = this.pen.valueMax;
		return new Array(value, label);
	}
	this.setItemToolTipTemplate = function(template) {
		this.label.tip = template;
	}
	this.getItemToolTipTemplate = function() {
		return this.label.tip;
	}
	//
	return this;
}
//#}
dhtmlXToolbarObject.prototype.unload = function() {
	
	if (this._isIPad) {
		document.removeEventListener("touchstart", this._doOnClick, false);
	} else {
		if (_isIE) document.body.detachEvent("onclick", this._doOnClick); else window.removeEventListener("click", this._doOnClick, false);
	}
	this._doOnClick = null;
	
	this.clearAll();
	this.objPull = null;
	
	if (this._xmlLoader) {
		this._xmlLoader.destructor();
		this._xmlLoader = null;
	}
	
	while (this.base.childNodes.length > 0) this.base.removeChild(this.base.childNodes[0]);
	this.cont.removeChild(this.base);
	this.base = null;
	
	while (this.cont.childNodes.length > 0) this.cont.removeChild(this.cont.childNodes[0]);
	this.cont.className = "";
	this.cont = null;
	
	this.detachAllEvents();
	
	this.tX1 = null;
	this.tX2 = null;
	this.tY1 = null;
	this.tY2 = null;
	
	this._isIE6 = null;
	this._isWebToolbar = null;
	
	this.align = null;
	this.anyUsed = null;
	this.idPrefix = null;
	this.imagePath = null;
	this.rootTypes = null;
	this.selectPolygonOffsetLeft = null;
	this.selectPolygonOffsetTop = null;
	this.skin = null;
	
	this._rtl = null;
	this._rtlParseBtn = null;
	this.setRTL = null;
	
	this._sbw = null;
	this._getObj = null;
	this._addImgObj = null;
	this._setItemImage = null;
	this._clearItemImage = null;
	this._setItemText = null;
	this._getItemText = null;
	this._enableItem = null;
	this._disableItem = null;
	this._xmlParser = null;
	this._doOnLoad = null;
	this._addItemToStorage = null;
	this._genStr = null;
	this._addItem = null;
	this._getPosition = null;
	this._setPosition = null;
	this._getIdByPosition = null;
	this._separatorObject = null;
	this._textObject = null;
	this._buttonObject = null;
	this._buttonSelectObject = null;
	this._buttonInputObject = null;
	this._buttonTwoStateObject = null;
	this._sliderObject = null;
	this._autoDetectVisibleArea = null;
	this._removeItem = null;
	// this._parseXMLUserData = null;
	this.setAlign = null;
	this.setSkin = null;
	this.setIconsPath = null;
	this.setIconPath = null;
	this.loadXML = null;
	this.loadXMLString = null;
	this.attachEvent = null;
	this.callEvent = null;
	this.checkEvent = null;
	this.eventCatcher = null;
	this.detachEvent = null;
	this.detachAllEvents = null;
	this.clearAll = null;
	this.addSpacer = null;
	this.removeSpacer = null;
	this.getType = null;
	this.getTypeExt = null;
	this.inArray = null;
	this.getParentId = null;
	this.addButton = null;
	this.addText = null;
	this.addButtonSelect = null;
	this.addButtonTwoState = null;
	this.addSeparator = null;
	this.addSlider = null;
	this.addInput = null;
	this.forEachItem = null;
	this.showItem = null;
	this.hideItem = null;
	this.isVisible = null;
	this.enableItem = null;
	this.disableItem = null;
	this.isEnabled = null;
	this.setItemText = null;
	this.getItemText = null;
	this.setItemToolTip = null;
	this.getItemToolTip = null;
	this.setItemImage = null;
	this.setItemImageDis = null;
	this.clearItemImage = null;
	this.clearItemImageDis = null;
	this.setItemState = null;
	this.getItemState = null;
	this.setItemToolTipTemplate = null;
	this.getItemToolTipTemplate = null;
	this.setValue = null;
	this.getValue = null;
	this.setMinValue = null;
	this.getMinValue = null;
	this.setMaxValue = null;
	this.getMaxValue = null;
	this.setWidth = null;
	this.getWidth = null;
	this.getPosition = null;
	this.setPosition = null;
	this.removeItem = null;
	this.addListOption = null;
	this.removeListOption = null;
	this.showListOption = null;
	this.hideListOption = null;
	this.isListOptionVisible = null;
	this.enableListOption = null;
	this.disableListOption = null;
	this.isListOptionEnabled = null;
	this.setListOptionPosition = null;
	this.getListOptionPosition = null;
	this.setListOptionText = null;
	this.getListOptionText = null;
	this.setListOptionToolTip = null;
	this.getListOptionToolTip = null;
	this.setListOptionImage = null;
	this.getListOptionImage = null;
	this.clearListOptionImage = null;
	this.forEachListOption = null;
	this.getAllListOptions = null;
	this.setListOptionSelected = null;
	this.getListOptionSelected = null;
	this.unload = null;
	this.setUserData = null;
	this.getUserData = null;
	this.setMaxOpen = null;
	this.items = null;
	
};

dhtmlXToolbarObject.prototype._autoDetectVisibleArea = function() {
	this.tX1 = document.body.scrollLeft;
	this.tX2 = this.tX1+(window.innerWidth||document.body.clientWidth);
	this.tY1 = Math.max((_isIE?document.documentElement:document.getElementsByTagName("html")[0]).scrollTop, document.body.scrollTop);
	this.tY2 = this.tY1+(_isIE?Math.max(document.documentElement.clientHeight||0,document.documentElement.offsetHeight||0,document.body.clientHeight||0):window.innerHeight);
};

// user data start
dhtmlXToolbarObject.prototype.setUserData = function(id, name, value) {
	if (this.objPull[this.idPrefix+id] == null) return;
	var item = this.objPull[this.idPrefix+id];
	if (item.userData == null) item.userData = {};
	item.userData[name] = value;
};
dhtmlXToolbarObject.prototype.getUserData = function(id, name) {
	if (this.objPull[this.idPrefix+id] == null) return null;
	if (this.objPull[this.idPrefix+id].userData == null) return null;
	if (this.objPull[this.idPrefix+id].userData[name] == null) return null;
	return this.objPull[this.idPrefix+id].userData[name];
};
// userdata for listed options
dhtmlXToolbarObject.prototype._isListOptionExists = function(listId, optionId) {
	if (this.objPull[this.idPrefix+listId] == null) return false;
	var item = this.objPull[this.idPrefix+listId];
	if (item.type != "buttonSelect") return false;
	if (item._listOptions[optionId] == null) return false;
	return true;
};
dhtmlXToolbarObject.prototype.setListOptionUserData = function(listId, optionId, name, value) {
	// is exists?
	if (!this._isListOptionExists(listId, optionId)) return;
	// set userdata
	var opt = this.objPull[this.idPrefix+listId]._listOptions[optionId];
	if (opt.userData == null) opt.userData = {};
	opt.userData[name] = value;
};
dhtmlXToolbarObject.prototype.getListOptionUserData = function(listId, optionId, name) {
	// is exists?
	if (!this._isListOptionExists(listId, optionId)) return null;
	// get userdata
	var opt = this.objPull[this.idPrefix+listId]._listOptions[optionId];
	if (!opt.userData) return null;
	return (opt.userData[name]?opt.userData[name]:null);
};

// user data end


//toolbar
(function(){
	dhtmlx.extend_api("dhtmlXToolbarObject",{
		_init:function(obj){
			return [obj.parent, obj.skin];
		},
		icon_path:"setIconsPath",
		xml:"loadXML",
		items:"items",
		align:"setAlign",
		rtl:"setRTL",
		skin:"setSkin"
	},{
		items:function(arr){
			for (var i=0; i < arr.length; i++) {
				var item = arr[i];
				if (item.type == "button") this.addButton(item.id, null, item.text, item.img, item.img_disabled);
				if (item.type == "separator") this.addSeparator(item.id, null);
				if (item.type == "text") this.addText(item.id, null, item.text);
				if (item.type == "buttonSelect") this.addButtonSelect(item.id, null, item.text, item.options, item.img, item.img_disabled, item.renderSelect, item.openAll, item.maxOpen);
				if (item.type == "buttonTwoState") this.addButtonTwoState(item.id, null, item.text, item.img, item.img_disabled);
				if (item.type == "buttonInput") this.addInput(item.id, null, item.text);
				if (item.type == "slider") this.addSlider(item.id, null, item.length, item.value_min, item.value_max, item.value_now, item.text_min, item.text_max, item.tip_template);
				//
				if (item.width) this.setWidth(item.id, item.width);
				if (item.disabled) this.disableItem(item.id);
				if (item.tooltip) this.setItemToolTip(item.id, item.tooltip);
				if (item.pressed === true) this.setItemState(item.id, true);
			}
		}
	});
})();



/**
*   @desc: a constructor, creates a new dhtmlxMenu object, baseId defines a base object for the top menu level
*   @param: baseId - id of the html element to which a menu will be attached, in case of a contextual menu - if specified, will used as a contextual zone
*   @type: public
*/
function dhtmlXMenuObject(baseId, skin) {
	var main_self = this;
	
	this.addBaseIdAsContextZone = null;
	
	this.isDhtmlxMenuObject = true;
	
	// skin settings
	this.skin = (skin!=null?skin:"dhx_skyblue");
	this.imagePath = "";
	
	// iframe
	this._isIE6 = false;
	if (_isIE) this._isIE6 = (window.XMLHttpRequest==null?true:false);
	
	if (baseId == null) {
		this.base = document.body;
	} else {
		var baseObj = (typeof(baseId)=="string"?document.getElementById(baseId):baseId);
		if (baseObj != null) {
			this.base = baseObj;
			if(!this.base.id)
				this.base.id = (new Date()).valueOf();
			while (this.base.childNodes.length > 0) { this.base.removeChild(this.base.childNodes[0]); }
			this.base.className += " dhtmlxMenu_"+this.skin+"_Middle dir_left";
			this.base._autoSkinUpdate = true;
			 // preserv default oncontextmenu for future restorin in case of context menu
			if (this.base.oncontextmenu) this.base._oldContextMenuHandler = this.base.oncontextmenu;
			//
			this.addBaseIdAsContextZone = this.base.id;
			this.base.onselectstart = function(e) { e = e || event; e.returnValue = false; return false; }
			this.base.oncontextmenu = function(e) { e = e || event;e.returnValue = false; return false; }
		} else {
			this.base = document.body;
		}
	}
	// this.topId = topId;
	this.topId = "dhxWebMenuTopId";
	
	// 
	if (!this.extendedModule) {
		// add notify for menu
		var t = function(){alert(this.i18n.dhxmenuextalert);};
		var extMethods = new Array("setItemEnabled", "setItemDisabled", "isItemEnabled", "_changeItemState", "getItemText", "setItemText",
				"loadFromHTML", "hideItem", "showItem", "isItemHidden", "_changeItemVisible", "setUserData", "getUserData",
				"setOpenMode", "setWebModeTimeout", "enableDynamicLoading", "_updateLoaderIcon", "getItemImage", "setItemImage",
				"clearItemImage", "setAutoShowMode", "setAutoHideMode", "setContextMenuHideAllMode", "getContextMenuHideAllMode",
				"setVisibleArea", "setTooltip", "getTooltip", "setHotKey", "getHotKey", "setItemSelected", "setTopText", "setRTL",
				"setAlign", "setHref", "clearHref", "getCircuit", "_clearAllSelectedSubItemsInPolygon", "_checkArrowsState",
				"_addUpArrow", "_addDownArrow", "_removeUpArrow", "_removeDownArrow", "_isArrowExists", "_doScrollUp", "_doScrollDown",
				"_countPolygonItems", "setOverflowHeight", "_getRadioImgObj", "_setRadioState", "_radioOnClickHandler",
				"getRadioChecked", "setRadioChecked", "addRadioButton", "_getCheckboxState", "_setCheckboxState", "_readLevel",
				"_updateCheckboxImage", "_checkboxOnClickHandler", "setCheckboxState", "getCheckboxState", "addCheckbox", "serialize");
		for (var q=0; q<extMethods.length; q++) if (!this[extMethods[q]]) this[extMethods[q]] = t;
		extMethods = null;
	}
	
	// should be used for frameset in IE
	this.fixedPosition = false;
	
	this.menuSelected = -1;
	this.menuLastClicked = -1;
	this.idPrefix = "";
	this.itemTagName = "item";
	this.itemTextTagName = "itemtext";
	this.userDataTagName = "userdata";
	this.itemTipTagName = "tooltip";
	this.itemHotKeyTagName = "hotkey";
	this.itemHrefTagName = "href";
	this.dirTopLevel = "bottom";
	this.dirSubLevel = "right";
	this.menuX1 = null;
	this.menuX2 = null;
	this.menuY1 = null;
	this.menuY2 = null;
	this.menuMode = "web";
	this.menuTimeoutMsec = 400;
	this.menuTimeoutHandler = null;
	this.autoOverflow = false;
	this.idPull = {};
	this.itemPull = {};
	this.userData = {};
	this.radio = {};
	//
	this._rtl = false;
	this._align = "left";
	//
	this.menuTouched = false;
	//
	this.zIndInit = 1200;
	this.zInd = this.zIndInit;
	this.zIndStep = 50;
	//
	this.menuModeTopLevelTimeout = true; // shows sublevel polygons from toplevel items with delay
	this.menuModeTopLevelTimeoutTime = 200; // msec
	//
	// default skin
	// this.skin = "Standard";
	
	// skin-based params
	this._topLevelBottomMargin = 1;
	this._topLevelRightMargin = 0;
	this._topLevelOffsetLeft = 1;
	this._arrowFFFix = (_isIE?(document.compatMode=="BackCompat"?0:-4):-4); // border fixer for FF for arrows polygons
	
	/**
	*   @desc: changes menu skin
	*   @param: skin - skin name
	*   @type: public
	*/
	this.setSkin = function(skin) {
		var oldSkin = this.skin;
		this.skin = skin;
		switch (this.skin){
			case "dhx_black":
			case "dhx_blue":
			case "dhx_skyblue":
			case "dhx_web":
				this._topLevelBottomMargin = 2;
				this._topLevelRightMargin = 1;
				this._topLevelOffsetLeft = 1;
				this._arrowFFFix = (_isIE?(document.compatMode=="BackCompat"?0:-4):-4);
				break;
			case "dhx_web":
				this._arrowFFFix = 0;
				break;
		}
		if (this.base._autoSkinUpdate) {
			this.base.className = this.base.className.replace("dhtmlxMenu_"+oldSkin+"_Middle", "")+" dhtmlxMenu_"+this.skin+"_Middle";
		}
		
		for (var a in this.idPull) {
			this.idPull[a].className = String(this.idPull[a].className).replace(oldSkin, this.skin);
			
		}
	}
	this.setSkin(this.skin);
	//
	this.dLoad = false;
	this.dLoadUrl = "";
	this.dLoadSign = "?";
	this.loaderIcon = false;
	this.limit = 0;
	//
	this._scrollUpTM = null;
	this._scrollUpTMTime = 20;
	this._scrollUpTMStep = 3;
	this._scrollDownTM = null;
	this._scrollDownTMTime = 20;
	this._scrollDownTMStep = 3;
	/* context menu */
	this.context = false;
	this.contextZones = {};
	this.contextMenuZoneId = false;
	this.contextAutoShow = true;	/* default open action */
	this.contextAutoHide = true;	/* default close action */
	this.contextHideAllMode = true; /* true will hide all opened contextual menu polygons on mouseout, false - all except topleft */
	/* dac params */
	this.sxDacProc = null;
	this.dacSpeed = 10;
	this.dacCycles = [];
	for (var q=0; q<10; q++) { this.dacCycles[q] = q; }
	/*
	this.dacSpeedIE = 60;
	this.dacCyclesIE = [];
	for (var q=0; q<3; q++) { this.dacCyclesIE[q] = q*2+1; }
	*/
	this.dacSpeedIE = 10;
	this.dacCyclesIE = [];
	for (var q=0; q<10; q++) { this.dacCyclesIE[q] = q; }
	
	/* version 0.2 features: selected items and polygond for quick deselect */
	/* sxDac feature, implemented in version 0.4 */
	this._enableDacSupport = function(dac) {
		this.sxDacProc = dac;
	}
	this._selectedSubItems = new Array();
	this._openedPolygons = new Array();
	this._addSubItemToSelected = function(item, polygon) {
		var t = true;
		for (var q=0; q<this._selectedSubItems.length; q++) { if ((this._selectedSubItems[q][0] == item) && (this._selectedSubItems[q][1] == polygon)) { t = false; } }
		if (t == true) { this._selectedSubItems.push(new Array(item, polygon)); }
		return t;
	}
	this._removeSubItemFromSelected = function(item, polygon) {
		var m = new Array();
		var t = false;
		for (var q=0; q<this._selectedSubItems.length; q++) { if ((this._selectedSubItems[q][0] == item) && (this._selectedSubItems[q][1] == polygon)) { t = true; } else { m[m.length] = this._selectedSubItems[q]; } }
		if (t == true) { this._selectedSubItems = m; }
		return t;
	}
	this._getSubItemToDeselectByPolygon = function(polygon) {
		var m = new Array();
		for (var q=0; q<this._selectedSubItems.length; q++) {
			if (this._selectedSubItems[q][1] == polygon) {
				m[m.length] = this._selectedSubItems[q][0];
				m = m.concat(this._getSubItemToDeselectByPolygon(this._selectedSubItems[q][0]));
				var t = true;
				for (var w=0; w<this._openedPolygons.length; w++) { if (this._openedPolygons[w] == this._selectedSubItems[q][0]) { t = false; } }
				if (t == true) { this._openedPolygons[this._openedPolygons.length] = this._selectedSubItems[q][0]; }
				this._selectedSubItems[q][0] = -1;
				this._selectedSubItems[q][1] = -1;
			}
		}
		return m;
	}
	/* end */
	/* define polygon's position for dinamic content rendering and shows it, added in version 0.3 */
	this._hidePolygon = function(id) {
		if (this.idPull["polygon_" + id] != null) {
			if ((this.sxDacProc != null) && (this.idPull["sxDac_" + id] != null)) {
				this.idPull["sxDac_"+id]._hide();
			} else {
				// already hidden
				if (this.idPull["polygon_"+id].style.display == "none") return;
				//
				this.idPull["polygon_"+id].style.display = "none";
				if (this.idPull["arrowup_"+id] != null) { this.idPull["arrowup_"+id].style.display = "none"; }
				if (this.idPull["arrowdown_"+id] != null) { this.idPull["arrowdown_"+id].style.display = "none"; }
				this._updateItemComplexState(id, true, false);
				// hide ie6 cover
				if (this._isIE6) { if (this.idPull["polygon_"+id+"_ie6cover"] != null) { this.idPull["polygon_"+id+"_ie6cover"].style.display = "none"; } }
				// call event
				id = String(id).replace(this.idPrefix, "");
				if (id == this.topId) id = null;
				this.callEvent("onHide", [id]);
			}
		}
	}
	this._showPolygon = function(id, openType) {
		var itemCount = this._countVisiblePolygonItems(id);
		if (itemCount == 0) return;
		var pId = "polygon_"+id;
		if ((this.idPull[pId] != null) && (this.idPull[id] != null)) {
			if (this.menuModeTopLevelTimeout && this.menuMode == "web" && !this.context) {
				if (!this.idPull[id]._mouseOver && openType == this.dirTopLevel) return;
			}
			
			// detect visible area
			if (!this.fixedPosition) this._autoDetectVisibleArea();
			
			// show arrows
			var arrUpH = 0;
			var arrDownH = 0;
			//
			var arrowUp = null;
			var arrowDown = null;
			
			// show polygon
			this.idPull[pId].style.visibility = "hidden";
			this.idPull[pId].style.left = "0px";
			this.idPull[pId].style.top = "0px";
			this.idPull[pId].style.display = "";
			this.idPull[pId].style.zIndex = this.zInd;
			
			//
			if (this.autoOverflow) {
				if (this.idPull[pId].firstChild.offsetHeight > this.menuY1+this.menuY2) {
					var t0 = Math.floor((this.menuY2-this.menuY1-35)/24);
					this.limit = t0;
				} else {
					this.limit = 0;
					
					if (this.idPull["arrowup_"+id] != null) this._removeUpArrow(String(id).replace(this.idPrefix,""));
					if (this.idPull["arrowdown_"+id] != null) this._removeDownArrow(String(id).replace(this.idPrefix,""));
				}
			}
			
			//#menu_overflow:06062008#{
			if (this.limit > 0 && this.limit < itemCount)  {
				
				// add overflow arrows if they not exists
				if (this.idPull["arrowup_"+id] == null) this._addUpArrow(String(id).replace(this.idPrefix,""));
				if (this.idPull["arrowdown_"+id] == null) this._addDownArrow(String(id).replace(this.idPrefix,""));
				
				// configure up arrow
				arrowUp = this.idPull["arrowup_"+id];
				arrowUp.style.visibility = "hidden";
				arrowUp.style.display = "";
				arrowUp.style.zIndex = this.zInd;
				arrUpH = arrowUp.offsetHeight;
				
				// configure bottom arrow
				arrowDown = this.idPull["arrowdown_"+id];
				arrowDown.style.visibility = "hidden";
				arrowDown.style.display = "";
				arrowDown.style.zIndex = this.zInd;
				arrDownH = arrowDown.offsetHeight;
			}
			//#}
			
			if (this.limit > 0) {
				if (this.limit < itemCount)  {
					// set fixed size
					// this.idPull[pId].style.height = this.idPull[pId].tbd.childNodes[0].offsetHeight*this.limit+"px";// + arrUpH + arrDownH;
					this.idPull[pId].style.height = 24*this.limit+"px";
					this.idPull[pId].scrollTop = 0;
				} else {
					// remove fixed size
					this.idPull[pId].style.height = "";
				}
			}
			//
			this.zInd += this.zIndStep;
			//
			// console.log(this.idPull)
			if (this.itemPull[id] != null) {
				var parPoly = "polygon_"+this.itemPull[id]["parent"];
			} else if (this.context) {
				var parPoly = this.idPull[this.idPrefix+this.topId];
			}
			/*
			// debug info
			if (parPoly == null) {
				alert("Implementation error. Please report support@dhtmlx.com");
			}
			*/
			//
			//
			// define position
			var srcX = (this.idPull[id].tagName != null ? getAbsoluteLeft(this.idPull[id]) : this.idPull[id][0]);
			var srcY = (this.idPull[id].tagName != null ? getAbsoluteTop(this.idPull[id]) : this.idPull[id][1]);
			var srcW = (this.idPull[id].tagName != null ? this.idPull[id].offsetWidth : 0);
			var srcH = (this.idPull[id].tagName != null ? this.idPull[id].offsetHeight : 0);
			
			var x = 0;
			var y = 0;
			var w = this.idPull[pId].offsetWidth;
			var h = this.idPull[pId].offsetHeight + arrUpH + arrDownH;
			
			//console.log(srcY,h,window.innerHeight,document.body.scrollTop)
			/*
			var bottomOverflow = (srcY+h > window.innerHeight+document.body.scrollTop);
			if (bottomOverflow) {
				if (openType == "bottom") openType = "top";
				if (openType == "right" || openType == "left") {
					srcY = srcY-h;
				}
			}
			*/
			// pos
			if (openType == "bottom") {
				if (this._rtl) {
					x = srcX + (srcW!=null?srcW:0) - w;
				} else {
					if (this._align == "right") {
						x = srcX + srcW - w;
					} else {
						x = srcX - 1 + (openType==this.dirTopLevel?this._topLevelRightMargin:0);
					}
				}
				y = srcY - 1 + srcH + this._topLevelBottomMargin;
			}
			if (openType == "right") { x = srcX + srcW - 1; y = srcY + 2; }
			if (openType == "left") { x = srcX - this.idPull[pId].offsetWidth + 2; y = srcY + 2; }
			if (openType == "top") { x = srcX - 1; y = srcY - h + 2; }
			
			// overflow check
			if (this.fixedPosition) {
				// use fixed document.body/window dimension if required
				var mx = 65536;
				var my = 65536;
			} else {
				var mx = (this.menuX2!=null?this.menuX2:0);
				var my = (this.menuY2!=null?this.menuY2:0);
				
				if (mx == 0) {
					if (window.innerWidth) {
						mx = window.innerWidth;
						my = window.innerHeight;
					} else {
						mx = document.body.offsetWidth;
						my = document.body.scrollHeight;
					}
				}
			}
			if (x+w > mx && !this._rtl) {
				// no space on right, open to left
				x = srcX - w + 2;
			}
			if (x < this.menuX1 && this._rtl) {
				// no space on left, open to right
				x = srcX + srcW - 2;
			}
			if (x < 0) {
				// menu floats left
				x = 0;
			}
			if (y+h > my && this.menuY2 != null) {
				y = Math.max(srcY + srcH - h + 2, (this._isVisibleArea?this.menuY1+2:2));
				// open from top level
				if (this.context && this.idPrefix+this.topId == id && arrowDown != null) {
					// autoscroll prevent because menu mouse pointer will right over downarrow
					y = y-2;
				}
				if (this.itemPull[id] != null && !this.context) {
					if (this.itemPull[id]["parent"] == this.idPrefix+this.topId) y = y - this.base.offsetHeight;
				}
			}
			//
			this.idPull[pId].style.left = x+"px";
			this.idPull[pId].style.top = y+arrUpH+"px";
			//
			if ((this.sxDacProc != null) && (this.idPull["sxDac_" + id] != null)) {
				this.idPull["sxDac_"+id]._show();
			} else {
				this.idPull[pId].style.visibility = "";
				//#menu_overflow:06062008#{
				if (this.limit > 0 && this.limit < itemCount)  {
					// this.idPull[pId].scrollTop = 0;
					arrowUp.style.left = x+"px";
					arrowUp.style.top = y+"px";
					arrowUp.style.width = w+this._arrowFFFix+"px";
					arrowUp.style.visibility = "";
					//
					arrowDown.style.left = x+"px";
					arrowDown.style.top = y+h-arrDownH+"px";
					arrowDown.style.width = w+this._arrowFFFix+"px";
					arrowDown.style.visibility = "";
					//
					this._checkArrowsState(id);
				}
				//#}
				// show ie6 cover
				if (this._isIE6) {
					var pIdIE6 = pId+"_ie6cover";
					if (this.idPull[pIdIE6] == null) {
						var ifr = document.createElement("IFRAME");
						ifr.className = "dhtmlxMenu_IE6CoverFix_"+this.skin;
						ifr.frameBorder = 0;
						ifr.setAttribute("src", "javascript:false;");
						document.body.insertBefore(ifr, document.body.firstChild);
						this.idPull[pIdIE6] = ifr;
					}
					this.idPull[pIdIE6].style.left = x+"px";
					this.idPull[pIdIE6].style.top = y+"px";
					this.idPull[pIdIE6].style.width = w+"px";
					this.idPull[pIdIE6].style.height = h+"px";
					this.idPull[pIdIE6].style.zIndex = this.idPull[pId].style.zIndex-1;
					this.idPull[pIdIE6].style.display = "";
				}
				id = String(id).replace(this.idPrefix, "");
				if (id == this.topId) id = null;
				this.callEvent("onShow", [id]);
				// this.callEvent("_onPolyShow",[id.replace(this.idPrefix,"")]);
			}
		}
	}
	/* redistrib sublevel selection: select id and deselect other, added in version 0.3 */
	this._redistribSubLevelSelection = function(id, parentId) {
		// clear previosly selected items
		while (this._openedPolygons.length > 0) this._openedPolygons.pop();
		// this._openedPolygons = new Array();
		var i = this._getSubItemToDeselectByPolygon(parentId);
		this._removeSubItemFromSelected(-1, -1);
		for (var q=0; q<i.length; q++) { if ((this.idPull[i[q]] != null) && (i[q] != id)) { if (this.itemPull[i[q]]["state"] == "enabled") { this.idPull[i[q]].className = "sub_item"; } } }
		// hide polygons
		for (var q=0; q<this._openedPolygons.length; q++) { if (this._openedPolygons[q] != parentId) { this._hidePolygon(this._openedPolygons[q]); } }
		// add new selection into list new
		if (this.itemPull[id]["state"] == "enabled") {
			this.idPull[id].className = "sub_item_selected";
			if (this.itemPull[id]["complex"] && this.dLoad && (this.itemPull[id]["loaded"]=="no")) {
				if (this.loaderIcon == true) { this._updateLoaderIcon(id, true); }
				var xmlLoader = new dtmlXMLLoaderObject(this._xmlParser, window);
				this.itemPull[id]["loaded"] = "get";
				this.callEvent("onXLS", []);
				xmlLoader.loadXML(this.dLoadUrl+this.dLoadSign+"action=loadMenu&parentId="+id.replace(this.idPrefix,"")+"&etc="+new Date().getTime());
			}
			// show
			if (this.itemPull[id]["complex"] || (this.dLoad && (this.itemPull[id]["loaded"] == "yes"))) {
				// make arrow over
				if ((this.itemPull[id]["complex"]) && (this.idPull["polygon_" + id] != null))  {
					this._updateItemComplexState(id, true, true);
					this._showPolygon(id, this.dirSubLevel);
				}
			}
			this._addSubItemToSelected(id, parentId);
			this.menuSelected = id;
		}
	}
	/* onClickMenu action (click on any end item to perform some actions)
	   optimized in version 0.3 added type feature (click on disabled items, click on complex nodes)
	   attachEvent feature from 0.4 */
	this._doOnClick = function(id, type, casState) {
		this.menuLastClicked = id;
		// href
		if (this.itemPull[this.idPrefix+id]["href_link"] != null && this.itemPull[this.idPrefix+id].state == "enabled") {
			var form = document.createElement("FORM");
			var k = String(this.itemPull[this.idPrefix+id]["href_link"]).split("?");
			form.action = k[0];
			if (k[1] != null) {
				var p = String(k[1]).split("&");
				for (var q=0; q<p.length; q++) {
					var j = String(p[q]).split("=");
					var m = document.createElement("INPUT");
					m.type = "hidden";
					m.name = (j[0]||"");
					m.value = (j[1]||"");
					form.appendChild(m);
				}
			}
			if (this.itemPull[this.idPrefix+id]["href_target"] != null) { form.target = this.itemPull[this.idPrefix+id]["href_target"]; }
			form.style.display = "none";
			document.body.appendChild(form);
			form.submit();
			if (form != null) {
				document.body.removeChild(form);
				form = null;
			}
			return;
		}
		//
		// some fixes
		if (type.charAt(0)=="c") return; // can't click on complex item
		if (type.charAt(1)=="d") return; // can't click on disabled item
		if (type.charAt(2)=="s") return; // can't click on separator
		//
		if (this.checkEvent("onClick")) {
			// this.callEvent("onClick", [id, type, this.contextMenuZoneId]);
			this.callEvent("onClick", [id, this.contextMenuZoneId, casState]);
		} else {
			if ((type.charAt(1) == "d") || (this.menuMode == "win" && type.charAt(2) == "t")) return;
		}
		if (this.context && this._isContextMenuVisible() && this.contextAutoHide) {
			this._hideContextMenu();
		} else {
			this._clearAndHide();
		}
	}
	/* onTouchMenu action (select topLevel item), attachEvent added in 0.4 */
	this._doOnTouchMenu = function(id) {
		if (this.menuTouched == false) {
			this.menuTouched = true;
			if (this.checkEvent("onTouch")) {
				this.callEvent("onTouch", [id]);
			}
		}
	}
	// this._onTouchHandler = function(id) { }
	// this._setOnTouchHandler = function(handler) { this._onTouchHandler = function(id) { handler(id); } }
	/* return menu array of all nested objects */
	this._searchMenuNode = function(node, menu) {
		var m = new Array();
		for (var q=0; q<menu.length; q++) {
			if (typeof(menu[q]) == "object") {
				if (menu[q].length == 5) { if (typeof(menu[q][0]) != "object") { if ((menu[q][0].replace(this.idPrefix, "") == node) && (q == 0)) { m = menu; } } }
				var j = this._searchMenuNode(node, menu[q]);
				if (j.length > 0) { m = j; }
			}
		}
		return m;
	}
	/* return array of subitems for single menu object */
	/* modified in version 0.3 */
	this._getMenuNodes = function(node) {
		var m = new Array;
		for (var a in this.itemPull) { if (this.itemPull[a]["parent"] == node) { m[m.length] = a; } }
		return m;
	}
	/* generate random string with specified length */
	this._genStr = function(w) {
		var s = ""; var z = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		for (var q=0; q<w; q++) s += z.charAt(Math.round(Math.random() * (z.length-1)));
		return s;
	}
	/**
	*	@desc: return item type by id
	*	@param: id
	*	@type: public
	*/
	this.getItemType = function(id) {
		id = this.idPrefix+id;
		if (this.itemPull[id] == null) { return null; }
		return this.itemPull[id]["type"];
	}
	/*
	*	@desc: iterator, calls user-defined handler for each existing item and pass item id into it
	*	@param: handler - user-defined handler
	*	@type: public
	*/
	this.forEachItem = function(handler) {
		for (var a in this.itemPull) { handler(String(a).replace(this.idPrefix, "")); }
	}
	/* clear selection and hide menu on onbody click event, optimized in version 0.3 */
	this._clearAndHide = function() {
		main_self.menuSelected = -1;
		main_self.menuLastClicked = -1;
		while (main_self._openedPolygons.length > 0) { main_self._openedPolygons.pop(); }
		for (var q=0; q<main_self._selectedSubItems.length; q++) {
			var id = main_self._selectedSubItems[q][0];
			// clear all selection
			if (main_self.idPull[id] != null) {
				if (main_self.itemPull[id]["state"] == "enabled") {
					if (main_self.idPull[id].className == "sub_item_selected") main_self.idPull[id].className = "sub_item";
					if (main_self.idPull[id].className == "dhtmlxMenu_"+main_self.skin+"_TopLevel_Item_Selected") {
						// main_self.idPull[id].className = "dhtmlxMenu_"+main_self.skin+"_TopLevel_Item_Normal";
						// custom css
						// console.log(main_self.itemPull[this.id])
						if (main_self.itemPull[id]["cssNormal"] != null) {
							// alert(1)
							main_self.idPull[id].className = main_self.itemPull[id]["cssNormal"];
						} else {
							// default css
							main_self.idPull[id].className = "dhtmlxMenu_"+main_self.skin+"_TopLevel_Item_Normal";
						}
					}
				}
			}
			main_self._hidePolygon(id);
		}
		// added in 0.4
		// main_self._hidePolygon(main_self.idPrefix+main_self.topId);
		main_self.menuTouched = false;
		//
		// hide all contextmenu polygons on mouseout
		if (main_self.context) {
			if (main_self.contextHideAllMode) {
				main_self._hidePolygon(main_self.idPrefix+main_self.topId);
				main_self.zInd = main_self.zIndInit;
			} else {
				main_self.zInd = main_self.zIndInit+main_self.zIndStep;
			}
		}
	}
	/* loading and parsing through xml, optimized in version 0.3 */
	this._doOnLoad = function() {}
	/**
	*   @desc: loads menu data from an xml file and calls onLoadFunction when loading is done
	*   @param: xmlFile - an xml file with webmenu data
	*   @param: onLoadFunction - a function that is called after loading is done
	*   @type: public
	*/
	this.loadXML = function(xmlFile, onLoadFunction) {
		if (onLoadFunction) this._doOnLoad = function() { onLoadFunction(); };
		this.callEvent("onXLS", []);
		this._xmlLoader.loadXML(xmlFile);
	}
	/**
	*   @desc: loads menu data from an xml string and calls onLoadFunction when loading is done
	*   @param: xmlFile - an xml string with webmenu data
	*   @param: onLoadFunction - function that is called after loading is done
	*   @type: public
	*/
	this.loadXMLString = function(xmlString, onLoadFunction) {
		if (onLoadFunction) this._doOnLoad = function() { onLoadFunction(); };
		this._xmlLoader.loadXMLString(xmlString);
	}
	this._buildMenu = function(t, parentId) {
		// if (parentId==null) { parentId = this.topId;}
		var u = 0;
		for (var q=0; q<t.childNodes.length; q++) {
			if (t.childNodes[q].tagName == this.itemTagName) {
				var r = t.childNodes[q];
				var item = {};
				// basic
				item["id"] = this.idPrefix+(r.getAttribute("id")||this._genStr(24));
				item["title"] = r.getAttribute("text")||"";
				// images
				item["imgen"] = r.getAttribute("img")||"";
				item["imgdis"] = r.getAttribute("imgdis")||"";
				item["tip"] = "";
				item["hotkey"] = "";
				// custom css
				if (r.getAttribute("cssNormal") != null) { item["cssNormal"] = r.getAttribute("cssNormal"); }
				// type
				item["type"] = r.getAttribute("type")||"item";
//#menu_checks:06062008{
				if (item["type"] == "checkbox") {
					item["checked"] = (r.getAttribute("checked")!=null);
					// set classname
					item["imgen"] = "chbx_"+(item["checked"]?"1":"0");
					item["imgdis"] = item["imgen"];
				}
//#}
//#menu_radio:06062008{
				if (item["type"] == "radio") {
					item["checked"] = (r.getAttribute("checked")!=null);
					item["imgen"] = "rdbt_"+(item["checked"]?"1":"0");
					item["imgdis"] = item["imgen"];
					item["group"] = r.getAttribute("group")||this._genStr(24);
					if (this.radio[item["group"]]==null) { this.radio[item["group"]] = new Array(); }
					this.radio[item["group"]][this.radio[item["group"]].length] = item["id"];
				}
//#}
				// enable/disable
				item["state"] = (r.getAttribute("enabled")!=null||r.getAttribute("disabled")!=null?(r.getAttribute("enabled")=="false"||r.getAttribute("disabled")=="true"?"disabled":"enabled"):"enabled");
				item["parent"] = (parentId!=null?parentId:this.idPrefix+this.topId);
				// item["complex"] = (((this.dLoad)&&(parentId!=null))?(r.getAttribute("complex")!=null?true:false):(this._buildMenu(r,item["id"])>0));
				item["complex"] = (this.dLoad?(r.getAttribute("complex")!=null?true:false):(this._buildMenu(r,item["id"])>0));
				if (this.dLoad && item["complex"]) { item["loaded"] = "no"; }
				this.itemPull[item["id"]] = item;
				// check for user data
				for (var w=0; w<r.childNodes.length; w++) {
					// added in 0.4
					var tagNm = r.childNodes[w].tagName;
					if (tagNm != null) { tagNm = tagNm.toLowerCase(); }
					//
					if (tagNm == this.userDataTagName) {
						var d = r.childNodes[w];
						if (d.getAttribute("name")!=null) { this.userData[item["id"]+"_"+d.getAttribute("name")] = (d.firstChild.nodeValue!=null?d.firstChild.nodeValue:""); }
					}
					// extended text, added in 0.4
					if (tagNm == this.itemTextTagName) { item["title"] = r.childNodes[w].firstChild.nodeValue; }
					// tooltips, added in 0.4
					if (tagNm == this.itemTipTagName) { item["tip"] = r.childNodes[w].firstChild.nodeValue; }
					// hotkeys, added in 0.4
					if (tagNm == this.itemHotKeyTagName) { item["hotkey"] = r.childNodes[w].firstChild.nodeValue; }
					// hrefs
					if (tagNm == this.itemHrefTagName && item["type"] == "item") {
						item["href_link"] = r.childNodes[w].firstChild.nodeValue;
						if (r.childNodes[w].getAttribute("target") != null) { item["href_target"] = r.childNodes[w].getAttribute("target"); }
					}
				}
				u++;
			}
		}
		return u;
	}
	/* parse incoming xml */
	this._xmlParser = function() {
		if (main_self.dLoad) {
			var t = this.getXMLTopNode("menu");
			parentId = (t.getAttribute("parentId")!=null?t.getAttribute("parentId"):null);
			if (parentId == null) {
				// alert(1)
				// main_self.idPrefix = main_self._genStr(12);
				main_self._buildMenu(t, null);
				main_self._initTopLevelMenu();
			} else {
				main_self._buildMenu(t, main_self.idPrefix+parentId);
				main_self._addSubMenuPolygon(main_self.idPrefix+parentId, main_self.idPrefix+parentId);//, main_self.idPull[main_self.idPrefix+parentId]);
				if (main_self.menuSelected == main_self.idPrefix+parentId) {
					var pId = main_self.idPrefix+parentId;
					var isTop = main_self.itemPull[main_self.idPrefix+parentId]["parent"]==main_self.idPrefix+main_self.topId;
					var level = ((isTop&&(!main_self.context))?main_self.dirTopLevel:main_self.dirSubLevel);
					var isShow = false;
					if (isTop && main_self.menuModeTopLevelTimeout && main_self.menuMode == "web" && !main_self.context) {
						var item = main_self.idPull[main_self.idPrefix+parentId];
						if (item._mouseOver == true) {
							var delay = main_self.menuModeTopLevelTimeoutTime - (new Date().getTime()-item._dynLoadTM);
							if (delay > 1) {
								item._menuOpenTM = window.setTimeout(function(){ main_self._showPolygon(pId, level); }, delay);
								isShow = true;
							}
						}
					}
					if (!isShow) { main_self._showPolygon(pId, level); }
				}
				main_self.itemPull[main_self.idPrefix+parentId]["loaded"] = "yes";
				// console.log(main_self.loaderIcon)
				if (main_self.loaderIcon == true) { main_self._updateLoaderIcon(main_self.idPrefix+parentId, false); }
			}
			this.destructor();
			main_self.callEvent("onXLE",[]);
		} else {
			var t = this.getXMLTopNode("menu");
			// alert(3)
			// main_self.idPrefix = main_self._genStr(12);
			main_self._buildMenu(t, null);
			main_self.init();
			main_self.callEvent("onXLE",[]);
			main_self._doOnLoad();
		}
	}
	this._xmlLoader = new dtmlXMLLoaderObject(this._xmlParser, window);
	/* show sublevel item */
	this._showSubLevelItem = function(id,back) {
		if (document.getElementById("arrow_" + this.idPrefix + id) != null) { document.getElementById("arrow_" + this.idPrefix + id).style.display = (back?"none":""); }
		if (document.getElementById("image_" + this.idPrefix + id) != null) { document.getElementById("image_" + this.idPrefix + id).style.display = (back?"none":""); }
		if (document.getElementById(this.idPrefix + id) != null) { document.getElementById(this.idPrefix + id).style.display = (back?"":"none"); }
	}
	/* hide sublevel item */
	this._hideSubLevelItem = function(id) {
		this._showSubLevelItem(id,true)
	}
	// generating id prefix
	this.idPrefix = this._genStr(12);
	
	/* attach body events */
	this._bodyClick = function(e) {
		e = e||event;
		if (e.button == 2 || (_isOpera && e.ctrlKey == true)) return;
		if (main_self.context) {
			if (main_self.contextAutoHide && (!_isOpera || (main_self._isContextMenuVisible() && _isOpera))) main_self._hideContextMenu();
		} else {
			main_self._clearAndHide();
		}
	}
	this._bodyContext = function(e) {
		e = e||event;
		var t = (e.srcElement||e.target).className;
		if (t.search("dhtmlxMenu") != -1 && t.search("SubLevelArea") != -1) return;
		var toHide = true;
		var testZone = e.target || e.srcElement;
		if (testZone.id != null) if (main_self.isContextZone(testZone.id)) toHide = false;
		if (testZone == document.body) toHide = false;
		if (toHide) main_self.hideContextMenu();
	}
	
	if (_isIE) {
		document.body.attachEvent("onclick", this._bodyClick);
		document.body.attachEvent("oncontextmenu", this._bodyContext);
	} else {
		window.addEventListener("click", this._bodyClick, false);
		window.addEventListener("contextmenu", this._bodyContext, false);
	}
	
	// add menu to global store
	this._UID = this._genStr(32);
	dhtmlxMenuObjectLiveInstances[this._UID] = this;
	
	/* events */
	dhtmlxEventable(this);
	//
	return this;
}
dhtmlXMenuObject.prototype.init = function() {
	if (this._isInited == true) return;
	if (this.dLoad) {
		this.callEvent("onXLS", []);
		// this._xmlLoader.loadXML(this.dLoadUrl+"?action=loadMenu&parentId="+this.topId+"&topId="+this.topId);
		this._xmlLoader.loadXML(this.dLoadUrl+this.dLoadSign+"action=loadMenu&etc="+new Date().getTime()); // &&parentId=topId&"+this.topId+"&topId="+this.topId);
	} else {
		this._initTopLevelMenu();
		this._isInited = true;
	}
}
dhtmlXMenuObject.prototype._countVisiblePolygonItems = function(id) {
	/*
	var count = 0;
	if ((this.idPull["polygon_"+id] != null) && (this.idPull[id] != null)) {
		for (var q=0; q<this.idPull["polygon_"+id].childNodes.length; q++) {
			var node = this.idPull["polygon_"+id].childNodes[q];
			count += (((node.style.display=="none")||(node.className=="dhtmlxMenu_SubLevelArea_Separator"))?0:1);
		}
	}
	*/
	/* updated in 0.4 */
	var count = 0;
	// console.log(this.idPull)
	for (var a in this.itemPull) {
		//console.log(a)
		var par = this.itemPull[a]["parent"];
		var tp = this.itemPull[a]["type"];
		if (this.idPull[a] != null) {
			// console.log(this.idPull[a])
			// alert(1111)
			if (par == id && (tp == "item" || tp == "radio" || tp == "checkbox") && this.idPull[a].style.display != "none") {
				count++;
			}
		}
	}
	return count;
}
dhtmlXMenuObject.prototype._redefineComplexState = function(id) {
	// alert(id)
	if (this.idPrefix+this.topId == id) { return; }
	if ((this.idPull["polygon_"+id] != null) && (this.idPull[id] != null)) {
		var u = this._countVisiblePolygonItems(id);
		if ((u > 0) && (!this.itemPull[id]["complex"])) { this._updateItemComplexState(id, true, false); }
		if ((u == 0) && (this.itemPull[id]["complex"])) { this._updateItemComplexState(id, false, false); }
	}
}
/* complex arrow manipulations, over added in 0.4 */
dhtmlXMenuObject.prototype._updateItemComplexState = function(id, state, over) {
	// 0.2 FIX :: topLevel's items can have complex items with arrow
	if ((!this.context) && (this._getItemLevelType(id.replace(this.idPrefix,"")) == "TopLevel")) {
		// 30.06.2008 fix > complex state for top level item, state only, no arrow
		this.itemPull[id]["complex"] = state;
		return;
	}
	if ((this.idPull[id] == null) || (this.itemPull[id] == null)) { return; }
	// 0.2 FIX :: end
	this.itemPull[id]["complex"] = state;
	// fixed in 0.4 for context
	if (id == this.idPrefix+this.topId) return;
	// end fix
	// try to retrieve arrow img object
	var arrowObj = null;
	
	
	var item = this.idPull[id].childNodes[this._rtl?0:2];
	if (item.childNodes[0]) if (String(item.childNodes[0].className).search("complex_arrow") === 0) arrowObj = item.childNodes[0];
	
	if (this.itemPull[id]["complex"]) {
		// create arrow
		if (arrowObj == null) {
			arrowObj = document.createElement("DIV");
			arrowObj.className = "complex_arrow";
			arrowObj.id = "arrow_"+id;
			while (item.childNodes.length > 0) item.removeChild(item.childNodes[0]);
			item.appendChild(arrowObj);
		}
		// over state added in 0.4
		
		if (this.dLoad && (this.itemPull[id]["loaded"] == "get") && this.loaderIcon) {
			// change arrow to loader
			if (arrowObj.className != "complex_arrow_loading") arrowObj.className = "complex_arrow_loading";
		} else {
			arrowObj.className = "complex_arrow";
		}
		
		return;
	}
	
	if ((!this.itemPull[id]["complex"]) && (arrowObj!=null)) {
		item.removeChild(arrowObj);
		if (this.itemPull[id]["hotkey_backup"] != null && this.setHotKey) { this.setHotKey(id.replace(this.idPrefix, ""), this.itemPull[id]["hotkey_backup"]); }
	}
	
}

/* return css-part level type */
dhtmlXMenuObject.prototype._getItemLevelType = function(id) {
	return (this.itemPull[this.idPrefix+id]["parent"]==this.idPrefix+this.topId?"TopLevel":"SubLevelArea");
}
/****************************************************************************************************************************************************/
/*								 	"TOPLEVEL" LOW-LEVEL RENDERING						    */
/* redistrib selection in case of top node in real-time mode */
dhtmlXMenuObject.prototype._redistribTopLevelSelection = function(id, parent) {
	// kick polygons and decelect before selected menues
	var i = this._getSubItemToDeselectByPolygon("parent");
	this._removeSubItemFromSelected(-1, -1);
	for (var q=0; q<i.length; q++) {
		if (i[q] != id) { this._hidePolygon(i[q]); }
		if ((this.idPull[i[q]] != null) && (i[q] != id)) { this.idPull[i[q]].className = this.idPull[i[q]].className.replace(/Selected/g, "Normal"); }
	}
	// check if enabled
	if (this.itemPull[this.idPrefix+id]["state"] == "enabled") {
		this.idPull[this.idPrefix+id].className = "dhtmlxMenu_"+this.skin+"_TopLevel_Item_Selected";
		//
		this._addSubItemToSelected(this.idPrefix+id, "parent");
		this.menuSelected = (this.menuMode=="win"?(this.menuSelected!=-1?id:this.menuSelected):id);
		if ((this.itemPull[this.idPrefix+id]["complex"]) && (this.menuSelected != -1)) { this._showPolygon(this.idPrefix+id, this.dirTopLevel); }
	}
}
dhtmlXMenuObject.prototype._initTopLevelMenu = function() {
	// console.log(this.idPull);
	this.dirTopLevel = "bottom";
	this.dirSubLevel = (this._rtl?"left":"right");
	if (this.context) {
		this.idPull[this.idPrefix+this.topId] = new Array(0,0);
		this._addSubMenuPolygon(this.idPrefix+this.topId, this.idPrefix+this.topId);
	} else {
		var m = this._getMenuNodes(this.idPrefix + this.topId);
		for (var q=0; q<m.length; q++) {
			if (this.itemPull[m[q]]["type"] == "item") this._renderToplevelItem(m[q], null);
			if (this.itemPull[m[q]]["type"] == "separator") this._renderSeparator(m[q], null);
		}
	}
}
/* add top menu item, complex define that submenues are in presence */
dhtmlXMenuObject.prototype._renderToplevelItem = function(id, pos) {
	var main_self = this;
	var m = document.createElement("DIV");
	m.id = id;
	// custom css
	if (this.itemPull[id]["state"] == "enabled" && this.itemPull[id]["cssNormal"] != null) {
		m.className = this.itemPull[id]["cssNormal"];
	} else {
		m.className = "dhtmlxMenu_"+this.skin+"_TopLevel_Item_"+(this.itemPull[id]["state"]=="enabled"?"Normal":"Disabled");
	}
	
	// text
	if (this.itemPull[id]["title"] != "") {
		var t1 = document.createElement("DIV");
		t1.className = "top_level_text";
		t1.innerHTML = this.itemPull[id]["title"];
		m.appendChild(t1);
	}
	// tooltip
	if (this.itemPull[id]["tip"].length > 0) m.title = this.itemPull[id]["tip"];
	//
	// image in top level
	if ((this.itemPull[id]["imgen"]!="")||(this.itemPull[id]["imgdis"]!="")) {
		var imgTop=this.itemPull[id][(this.itemPull[id]["state"]=="enabled")?"imgen":"imgdis"];
		if (imgTop) {
			var img = document.createElement("IMG");
			img.border = "0";
			img.id = "image_"+id;
			img.src= this.imagePath+imgTop;
			img.className = "dhtmlxMenu_TopLevel_Item_Icon";
			if (m.childNodes.length > 0 && !this._rtl) m.insertBefore(img, m.childNodes[0]); else m.appendChild(img);
		}
	}
	m.onselectstart = function(e) { e = e || event; e.returnValue = false; return false; }
	m.oncontextmenu = function(e) { e = e || event; e.returnValue = false; return false; }
	// add container for top-level items if not exists yet
	if (!this.cont) {
		this.cont = document.createElement("DIV");
		this.cont.dir = "ltr";
		this.cont.className = (this._align=="right"?"align_right":"align_left");
		this.base.appendChild(this.cont);
	}
	// insert
	/*
	if (pos != null) { pos++; if (pos < 0) pos = 0; if (pos > this.base.childNodes.length - 1) pos = null; }
	if (pos != null) this.base.insertBefore(m, this.base.childNodes[pos]); else this.base.appendChild(m);
	*/
	if (pos != null) { pos++; if (pos < 0) pos = 0; if (pos > this.cont.childNodes.length - 1) pos = null; }
	if (pos != null) this.cont.insertBefore(m, this.cont.childNodes[pos]); else this.cont.appendChild(m);
	
	
	//
	this.idPull[m.id] = m;
	// create submenues
	if (this.itemPull[id]["complex"] && (!this.dLoad)) this._addSubMenuPolygon(this.itemPull[id]["id"], this.itemPull[id]["id"]);
	// events
	m.onmouseover = function() {
		if (main_self.menuMode == "web") { window.clearTimeout(main_self.menuTimeoutHandler); }
		// kick polygons and decelect before selected menues
		var i = main_self._getSubItemToDeselectByPolygon("parent");
		main_self._removeSubItemFromSelected(-1, -1);
		for (var q=0; q<i.length; q++) {
			if (i[q] != this.id) { main_self._hidePolygon(i[q]); }
			if ((main_self.idPull[i[q]] != null) && (i[q] != this.id)) {
				// custom css
				if (main_self.itemPull[i[q]]["cssNormal"] != null) {
					main_self.idPull[i[q]].className = main_self.itemPull[i[q]]["cssNormal"];
				} else {
					if (main_self.idPull[i[q]].className == "sub_item_selected") main_self.idPull[i[q]].className = "sub_item";
					main_self.idPull[i[q]].className = main_self.idPull[i[q]].className.replace(/Selected/g, "Normal");
				}
			}
		}
		// check if enabled
		if (main_self.itemPull[this.id]["state"] == "enabled") {
			this.className = "dhtmlxMenu_"+main_self.skin+"_TopLevel_Item_Selected";
			//
			main_self._addSubItemToSelected(this.id, "parent");
			main_self.menuSelected = (main_self.menuMode=="win"?(main_self.menuSelected!=-1?this.id:main_self.menuSelected):this.id);
			if (main_self.dLoad && (main_self.itemPull[this.id]["loaded"]=="no")) {
				if (main_self.menuModeTopLevelTimeout && main_self.menuMode == "web" && !main_self.context) {
					this._mouseOver = true;
					this._dynLoadTM = new Date().getTime();
				}
				var xmlLoader = new dtmlXMLLoaderObject(main_self._xmlParser, window);
				main_self.itemPull[this.id]["loaded"] = "get";
				main_self.callEvent("onXLS", []);
				xmlLoader.loadXML(main_self.dLoadUrl+main_self.dLoadSign+"action=loadMenu&parentId="+this.id.replace(main_self.idPrefix,"")+"&etc="+new Date().getTime());
			}
			if ((!main_self.dLoad) || (main_self.dLoad && (!main_self.itemPull[this.id]["loaded"] || main_self.itemPull[this.id]["loaded"]=="yes"))) {
				if ((main_self.itemPull[this.id]["complex"]) && (main_self.menuSelected != -1)) {
					if (main_self.menuModeTopLevelTimeout && main_self.menuMode == "web" && !main_self.context) {
						this._mouseOver = true;
						var showItemId = this.id;
						this._menuOpenTM = window.setTimeout(function(){main_self._showPolygon(showItemId, main_self.dirTopLevel);}, main_self.menuModeTopLevelTimeoutTime);
					} else {
						main_self._showPolygon(this.id, main_self.dirTopLevel);
					}
				}
			}
		}
		main_self._doOnTouchMenu(this.id.replace(main_self.idPrefix, ""));
	}
	m.onmouseout = function() {
		if (!((main_self.itemPull[this.id]["complex"]) && (main_self.menuSelected != -1)) && (main_self.itemPull[this.id]["state"]=="enabled")) {
			// custom css
			// console.log(main_self.itemPull[this.id])
			if (main_self.itemPull[this.id]["cssNormal"] != null) {
				// alert(1)
				m.className = main_self.itemPull[this.id]["cssNormal"];
			} else {
				// default css
				m.className = "dhtmlxMenu_"+main_self.skin+"_TopLevel_Item_Normal";
			}
		}
		if (main_self.menuMode == "web") {
			window.clearTimeout(main_self.menuTimeoutHandler);
			main_self.menuTimeoutHandler = window.setTimeout(function(){main_self._clearAndHide();}, main_self.menuTimeoutMsec, "JavaScript");
		}
		if (main_self.menuModeTopLevelTimeout && main_self.menuMode == "web" && !main_self.context) {
			this._mouseOver = false;
			window.clearTimeout(this._menuOpenTM);
		}
	}
	m.onclick = function(e) {
		if (main_self.menuMode == "web") { window.clearTimeout(main_self.menuTimeoutHandler); }
		// fix, added in 0.4
		if (main_self.menuMode != "web" && main_self.itemPull[this.id]["state"] == "disabled") { return; }
		//
		e = e || event;
		e.cancelBubble = true;
		e.returnValue = false;
		
		if (main_self.menuMode == "win") {
			if (main_self.itemPull[this.id]["complex"]) {
				if (main_self.menuSelected == this.id) { main_self.menuSelected = -1; var s = false; } else { main_self.menuSelected = this.id; var s = true; }
				if (s) { main_self._showPolygon(this.id, main_self.dirTopLevel); } else { main_self._hidePolygon(this.id); }
			}
		}
		var tc = (main_self.itemPull[this.id]["complex"]?"c":"-");
		var td = (main_self.itemPull[this.id]["state"]!="enabled"?"d":"-");
		var cas = {"ctrl": e.ctrlKey, "alt": e.altKey, "shift": e.shiftKey};
		main_self._doOnClick(this.id.replace(main_self.idPrefix, ""), tc+td+"t", cas);
		return false;
	}
}
/****************************************************************************************************************************************************/
/**
*   @desc: empty function, now more used from 90226
*   @type: public
*/
dhtmlXMenuObject.prototype.setImagePath = function() { /* no more used */ }
/**
*   @desc: defines an url where necessary user embedded icons are located
*   @param: path - url to images
*   @type: public
*/
dhtmlXMenuObject.prototype.setIconsPath = function(path) { this.imagePath = path; }
/**
*   @desc: alias for setIconsPath
*   @type: public
*/
dhtmlXMenuObject.prototype.setIconPath = dhtmlXMenuObject.prototype.setIconsPath;
/* real-time update icon in menu */
dhtmlXMenuObject.prototype._updateItemImage = function(id, levelType) {
	// search existsing image
	
	id = this.idPrefix+id;
	var isTopLevel = (this.itemPull[id]["parent"] == this.idPrefix+this.topId && !this.context);
	
	// search existing image
	var imgObj = null;
	if (isTopLevel) {
		for (var q=0; q<this.idPull[id].childNodes.length; q++) {
			try { if (this.idPull[id].childNodes[q].className == "dhtmlxMenu_TopLevel_Item_Icon") imgObj = this.idPull[id].childNodes[q]; } catch(e) {}
		}
	} else {
		try { var imgObj = this.idPull[id].childNodes[this._rtl?2:0].childNodes[0]; } catch(e) { }
	}
	
	if (this.itemPull[id]["type"] == "radio") {
		var imgSrc = this.itemPull[id][(this.itemPull[id]["state"]=="enabled"?"imgen":"imgdis")];
		// console.log(this.itemPull[this.idPrefix+id])
	} else {
		var imgSrc = this.itemPull[id][(this.itemPull[id]["state"]=="enabled"?"imgen":"imgdis")];
	}
	
	if (imgSrc.length > 0) {
		if (imgObj != null) {
			imgObj.src = this.imagePath+imgSrc;
		} else {
			if (isTopLevel) {
				var imgObj = document.createElement("IMG");
				imgObj.className = "dhtmlxMenu_TopLevel_Item_Icon";
				imgObj.src = this.imagePath+imgSrc;
				imgObj.border = "0";
				imgObj.id = "image_"+id;
				if (!this._rtl && this.idPull[id].childNodes.length > 0) this.idPull[id].insertBefore(imgObj,this.idPull[id].childNodes[0]); else this.idPull[id].appendChild(imgObj);
				
			} else {
				
				var imgObj = document.createElement("IMG");
				imgObj.className = "sub_icon";
				imgObj.src = this.imagePath+imgSrc;
				imgObj.border = "0";
				imgObj.id = "image_"+id;
				var item = this.idPull[id].childNodes[this._rtl?2:0];
				while (item.childNodes.length > 0) item.removeChild(item.childNodes[0]);
				item.appendChild(imgObj);
				
			}
		}
	} else {
		if (imgObj != null) imgObj.parentNode.removeChild(imgObj);
	}
}
/**
*   @desc: removes an item from the menu with all nested sublevels
*   @param: id - id of the item for removing
*   @type: public
*/
dhtmlXMenuObject.prototype.removeItem = function(id, _isTId, _recCall) {
	if (!_isTId) id = this.idPrefix + id;
	
	var pId = null;
	
	if (id != this.idPrefix+this.topId) {
		
		if (this.itemPull[id] == null) return;
		
		// separator top
		var t = this.itemPull[id]["type"];
		
		if (t == "separator") {
			var item = this.idPull["separator_"+id];
			if (this.itemPull[id]["parent"] == this.idPrefix+this.topId) {
				item.onclick = null;
				item.onselectstart = null;
				item.id = null;
				item.parentNode.removeChild(item);
			} else {
				item.childNodes[0].childNodes[0].onclick = null;
				item.childNodes[0].childNodes[0].onselectstart = null;
				item.childNodes[0].childNodes[0].id = null;
				item.childNodes[0].removeChild(item.childNodes[0].childNodes[0]);
				item.removeChild(item.childNodes[0]);
				item.parentNode.removeChild(item);
			}
			this.idPull["separator_"+id] = null;
			this.itemPull[id] = null;
			delete this.idPull["separator_"+id];
			delete this.itemPull[id];
			item = null;
		} else {
			// item checkbox radio
			pId = this.itemPull[id]["parent"];
			var item = this.idPull[id];
			item.onclick = null;
			item.oncontextmenu = null;
			item.onmouseover = null;
			item.onmouseout = null;
			item.onselectstart = null;
			item.id = null;
			while (item.childNodes.length > 0) item.removeChild(item.childNodes[0]);
			item.parentNode.removeChild(item);
			this.idPull[id] = null;
			this.itemPull[id] = null;
			delete this.idPull[id];
			delete this.itemPull[id];
			item = null;
			
		}
		t = null;
	}
	
	// clear nested items
	for (var a in this.itemPull) if (this.itemPull[a]["parent"] == id) this.removeItem(a, true, true);
	
	// check if empty polygon left
	var p2 = new Array(id);
	if (pId != null && !_recCall) {
		if (this.idPull["polygon_"+pId] != null) {
			if (this.idPull["polygon_"+pId].tbd.childNodes.length == 0) {
				p2.push(pId);
				this._updateItemComplexState(pId, false, false);
			}
		}
	}
	
	// delete nested polygons and parent's if any
	for (var q=0; q<p2.length; q++) {
		if (this.idPull["polygon_"+p2[q]]) {
			var p = this.idPull["polygon_"+p2[q]];
			p.onclick = null;
			p.oncontextmenu = null;
			p.tbl.removeChild(p.tbd);
			p.tbd = null;
			p.removeChild(p.tbl);
			p.tbl = null;
			p.id = null;
			p.parentNode.removeChild(p);
			p = null;
			if (this._isIE6) {
				var pc = "polygon_"+p2[q]+"_ie6cover";
				if (this.idPull[pc] != null) { document.body.removeChild(this.idPull[pc]); delete this.idPull[pc]; }
			}
			if (this.idPull["arrowup_"+id] != null && this._removeArrow) this._removeArrow("arrowup_"+id);
			if (this.idPull["arrowdown_"+id] != null && this._removeArrow) this._removeArrow("arrowdown_"+id);
			//
			this.idPull["polygon_"+p2[q]] = null;
			delete this.idPull["polygon_"+p2[q]];
		}
	}
	p2 = null;
	
	
	/*
	// get parent
	var parentId = this.itemPull[id]["parent"];
	// separator
	if (this.itemPull[id]["type"] == "separator") {
		this.idPull["separator_"+id].parentNode.removeChild(this.idPull["separator_"+id]);
		this.idPull["separator_"+id] = null;
		this.itemPull[id] = null;
		delete this.idPull["separator_"+id];
		delete this.itemPull[id];
		// return;
	} else {
		// complex/single item
		if (this.itemPull[id]["complex"]) {
			var items = this._getAllParents(id);
			items[items.length] = id;
			var polygons = new Array();
			for (var q=0; q<items.length; q++) {
				if (this.itemPull[items[q]]["type"] == "separator") {
					this.removeItem(items[q].replace(this.idPrefix,""));
				} else {
					if (this.itemPull[items[q]]["complex"]) { polygons[polygons.length] = items[q]; }
					this.idPull[items[q]].parentNode.removeChild(this.idPull[items[q]]);
					this.idPull[items[q]] = null;
					this.itemPull[items[q]] = null;
					delete this.idPull[items[q]];
					delete this.itemPull[items[q]];
				}
			}
			for (var q=0; q<polygons.length; q++) {
				this.idPull["polygon_"+polygons[q]].parentNode.removeChild(this.idPull["polygon_"+polygons[q]]);
				if (this._isIE6) {
					var pId = "polygon_"+polygons[q]+"_ie6cover";
					if (this.idPull[pId] != null) { document.body.removeChild(this.idPull[pId]); delete this.idPull[pId]; }
				}
				this.idPull["polygon_"+polygons[q]] = null;
				this.itemPull[polygons[q]] = null;
				delete this.idPull["polygon_"+polygons[q]];
				delete this.itemPull[polygons[q]];
			}
		} else {
			this.idPull[id].parentNode.removeChild(this.idPull[id]);
			this.idPull[id] = null;
			this.itemPull[id] = null;
			delete this.idPull[id];
			delete this.itemPull[id];
		}
	}
	// checking existing empty polygon
	if (this.idPull["polygon_"+parentId] != null) {
		var p = this.idPull["polygon_"+parentId];
		if (p.tbd.childNodes.length == 0) {
			p.tbd.parentNode.removeChild(p.tbd);
			p.tbl.parentNode.removeChild(p.tbl);
			document.body.removeChild(p);
			p = null;
			if (this._isIE6) {
				var pId = "polygon_"+parentId+"_ie6cover";
				if (this.idPull[pId] != null) {
					document.body.removeChild(this.idPull[pId]);
					this.idPull[pId] = null;
					delete this.idPull[pId];
				}
			}
			this.idPull["polygon_"+parentId] = null;
			delete this.idPull["polygon_"+parentId];
			this._updateItemComplexState(parentId, false, false);
		}
	}
	*/
}
/* collect parents for remove complex item */
dhtmlXMenuObject.prototype._getAllParents = function(id) {
	var parents = new Array();
	for (var a in this.itemPull) {
		if (this.itemPull[a]["parent"] == id) {
			parents[parents.length] = this.itemPull[a]["id"];
			if (this.itemPull[a]["complex"]) {
				var t = this._getAllParents(this.itemPull[a]["id"]);
				for (var q=0; q<t.length; q++) { parents[parents.length] = t[q]; }
			}
		}
	}
	return parents;
}

//#menu_context:06062008{
	
/****************************************************************************************************************************************************/
/*								 	CONTEXT STUFF								    */
/* render dhtmlxMenu as context menu of base object */
/**
*   @desc: renders menu as contextual
*   @type: public
*/
dhtmlXMenuObject.prototype.renderAsContextMenu = function() {
	this.context = true;
	if (this.base._autoSkinUpdate == true) {
		this.base.className = this.base.className.replace("dhtmlxMenu_"+this.skin+"_Middle","");
		this.base._autoSkinUpdate = false;
	}
	if (this.addBaseIdAsContextZone != null) { this.addContextZone(this.addBaseIdAsContextZone); }
}
/**
*   @desc: adds a contextual zone to a contextual menu
*   @param: zoneId - id of the object on page to render as a contextual zone
*   @type: public
*/
dhtmlXMenuObject.prototype.addContextZone = function(zoneId) {
	if (zoneId == document.body) {
		zoneId = "document.body."+this.idPrefix;
		var zone = document.body;
	} else {
		var zone = document.getElementById(zoneId);
	}
	var zoneExists = false;
	for (var a in this.contextZones) { zoneExists = zoneExists || (a == zoneId) || (this.contextZones[a] == zone); }
	if (zoneExists == true) return false;
	this.contextZones[zoneId] = zone;
	var main_self = this;
	if (_isOpera) {
		this.operaContext = function(e){ main_self._doOnContextMenuOpera(e, main_self); }
		zone.addEventListener("mouseup", this.operaContext, false);
		//
	} else {
		if (zone.oncontextmenu != null && !zone._oldContextMenuHandler) zone._oldContextMenuHandler = zone.oncontextmenu;
		zone.oncontextmenu = function(e) {
			// autoclose any other opened context menues
			for (var q in dhtmlxMenuObjectLiveInstances) {
				if (q != main_self._UID) {
					if (dhtmlxMenuObjectLiveInstances[q].context) {
						dhtmlxMenuObjectLiveInstances[q]._hideContextMenu();
					}
				}
			}
			//
			e = e||event;
			e.cancelBubble = true;
			e.returnValue = false;
			main_self._doOnContextBeforeCall(e, this);
			return false;
		}
	}
}
dhtmlXMenuObject.prototype._doOnContextMenuOpera = function(e, main_self) {
	// autoclose any other opened context menues
	for (var q in dhtmlxMenuObjectLiveInstances) {
		if (q != main_self._UID) {
			if (dhtmlxMenuObjectLiveInstances[q].context) {
				dhtmlxMenuObjectLiveInstances[q]._hideContextMenu();
			}
		}
	}
	//
	e.cancelBubble = true;
	e.returnValue = false;
	if (e.button == 0 && e.ctrlKey == true) { main_self._doOnContextBeforeCall(e, this); }
	return false;
}
/**
*   @desc: removes an object from contextual zones list
*   @param: zoneId - id of a contextual zone
*   @type: public
*/
dhtmlXMenuObject.prototype.removeContextZone = function(zoneId) {
	if (!this.isContextZone(zoneId)) return false;
	if (zoneId == document.body) zoneId = "document.body."+this.idPrefix;
	var zone = this.contextZones[zoneId];
	if (_isOpera) {
		zone.removeEventListener("mouseup", this.operaContext, false);
	} else {
		zone.oncontextmenu = (zone._oldContextMenuHandler!=null?zone._oldContextMenuHandler:null);
		zone._oldContextMenuHandler = null;
	}
	try {
		this.contextZones[zoneId] = null;
		delete this.contextZones[zoneId];
 	} catch(e){}
	return true;
}
/**
*   @desc: returns true if an object is used as a contextual zone for the menu
*   @param: zoneId - id of the object to check
*   @type: public
*/
dhtmlXMenuObject.prototype.isContextZone = function(zoneId) {
	if (zoneId == document.body && this.contextZones["document.body."+this.idPrefix] != null) return true;
	var isZone = false;
	if (this.contextZones[zoneId] != null) { if (this.contextZones[zoneId] == document.getElementById(zoneId)) isZone = true; }
	return isZone;
}
dhtmlXMenuObject.prototype._isContextMenuVisible = function() {
	if (this.idPull["polygon_"+this.idPrefix+this.topId] == null) return false;
	return (this.idPull["polygon_"+this.idPrefix+this.topId].style.display == "");
}
dhtmlXMenuObject.prototype._showContextMenu = function(x, y, zoneId) {
	// hide any opened context menu/polygons
	this._clearAndHide();
	// this._hideContextMenu();
	// open
	if (this.idPull["polygon_"+this.idPrefix+this.topId] == null) return false;
	window.clearTimeout(this.menuTimeoutHandler);
	this.idPull[this.idPrefix+this.topId] = new Array(x, y);
	this._showPolygon(this.idPrefix+this.topId, "bottom");
	this.callEvent("onContextMenu", [zoneId]);
}
dhtmlXMenuObject.prototype._hideContextMenu = function() {
	if (this.idPull["polygon_"+this.idPrefix+this.topId] == null) return false;
	this._clearAndHide();
	this._hidePolygon(this.idPrefix+this.topId);
	this.zInd = this.zIndInit;
}
/****************************************************************************************************************************************************/
dhtmlXMenuObject.prototype._doOnContextBeforeCall = function(e, cZone) {
	this.contextMenuZoneId = cZone.id;
	this._clearAndHide();
	this._hideContextMenu();
	
	// scroll settings
	var p = (e.srcElement||e.target);
	var px = (_isIE||_isOpera||_KHTMLrv?e.offsetX:e.layerX);
	var py = (_isIE||_isOpera||_KHTMLrv?e.offsetY:e.layerY);
	var mx = getAbsoluteLeft(p)+px;
	var my = getAbsoluteTop(p)+py;
	
	if (this.checkEvent("onBeforeContextMenu")) {
		if (this.callEvent("onBeforeContextMenu", [cZone.id,e])) {
			if (this.contextAutoShow) {
				this._showContextMenu(mx, my);
				this.callEvent("onAfterContextMenu", [cZone.id,e]);
			}
		}
	} else {
		if (this.contextAutoShow) {
			this._showContextMenu(mx, my);
			this.callEvent("onAfterContextMenu", [cZone.id]);
		}
	}
}
/* public: user call for show/hide context menu */
/**
*   @desc: usercall to show a contextual menu
*   @param: x - position of the menu on x axis
*   @param: y - position of the menu on y axis
*   @type: public
*/
dhtmlXMenuObject.prototype.showContextMenu = function(x, y) {
	this._showContextMenu(x, y, false);
}
/**
*   @desc: usercall to hide a contextual menu
*   @type: public
*/
dhtmlXMenuObject.prototype.hideContextMenu = function() {
	this._hideContextMenu();
}
dhtmlXMenuObject.prototype._autoDetectVisibleArea = function() {
	if (this._isVisibleArea) return;
	//
	this.menuX1 = document.body.scrollLeft;
	this.menuX2 = this.menuX1+(window.innerWidth||document.body.clientWidth);
	this.menuY1 = Math.max((_isIE?document.documentElement:document.getElementsByTagName("html")[0]).scrollTop, document.body.scrollTop);
	// this.menuY2 = this.menuY1+(_isIE?(document.documentElement?Math.max(document.documentElement.clientHeight:document.body.clientHeight):window.innerHeight);
	this.menuY2 = this.menuY1+(_isIE?Math.max(document.documentElement.clientHeight||0,document.documentElement.offsetHeight||0,document.body.clientHeight||0):window.innerHeight);
	
}
/* inner - returns true if prognozided polygon layout off the visible area */
/*dhtmlXMenuObject.prototype._isInVisibleArea = function(x, y, w, h) {
	return ((x >= this.menuX1) && (x+w<=this.menuX2) && (y >= this.menuY1) && (y+h <= this.menuY2));
}*/


//#}

/**
*   @desc: returns item's position in the current polygon
*   @param: id - the item
*   @type: public
*/
dhtmlXMenuObject.prototype.getItemPosition = function(id) {
	id = this.idPrefix+id;
	var pos = -1;
	if (this.itemPull[id] == null) return pos;
	var parent = this.itemPull[id]["parent"];
	// var obj = (this.idPull["polygon_"+parent]!=null?this.idPull["polygon_"+parent].tbd:this.base);
	var obj = (this.idPull["polygon_"+parent]!=null?this.idPull["polygon_"+parent].tbd:this.cont);
	for (var q=0; q<obj.childNodes.length; q++) { if (obj.childNodes[q]==this.idPull["separator_"+id]||obj.childNodes[q]==this.idPull[id]) { pos = q; } }
	return pos;
}

/**
*   @desc: sets new item's position in the current polygon (moves an item inside the single level)
*   @param: id - the item
*   @param: pos - the position (int)
*   @type: public
*/
dhtmlXMenuObject.prototype.setItemPosition = function(id, pos) {
	id = this.idPrefix+id;
	if (this.idPull[id] == null) { return; }
	// added in 0.4
	var isOnTopLevel = (this.itemPull[id]["parent"] == this.idPrefix+this.topId);
	//
	var itemData = this.idPull[id];
	var itemPos = this.getItemPosition(id.replace(this.idPrefix,""));
	var parent = this.itemPull[id]["parent"];
	// var obj = (this.idPull["polygon_"+parent]!=null?this.idPull["polygon_"+parent].tbd:this.base);
	var obj = (this.idPull["polygon_"+parent]!=null?this.idPull["polygon_"+parent].tbd:this.cont);
	obj.removeChild(obj.childNodes[itemPos]);
	if (pos < 0) pos = 0;
	// added in 0.4
	if (isOnTopLevel && pos < 1) { pos = 1; }
	//
	if (pos < obj.childNodes.length) { obj.insertBefore(itemData, obj.childNodes[pos]); } else { obj.appendChild(itemData); }
}

/**
*   @desc: returns parent's id
*   @param: id - the item
*   @type: public
*/
dhtmlXMenuObject.prototype.getParentId = function(id) {
	id = this.idPrefix+id;
	if (this.itemPull[id] == null) { return null; }
	return ((this.itemPull[id]["parent"]!=null?this.itemPull[id]["parent"]:this.topId).replace(this.idPrefix,""));
}
/* public: add item */

/**
*   @desc: adds a new sibling item
*   @param: nextToId - id of the element after which a new one will be inserted
*   @param: itemId - id of a new item
*   @param: itemText - text of a new item
*   @param: disabled - true|false, whether the item is disabled or not
*   @param: img - image for the enabled item
*   @param: imgDis - image for the disabled item
*   @type: public
*/
dhtmlXMenuObject.prototype.addNewSibling = function(nextToId, itemId, itemText, disabled, imgEnabled, imgDisabled) {
	var id = this.idPrefix+(itemId!=null?itemId:this._genStr(24));
	var parentId = this.idPrefix+(nextToId!=null?this.getParentId(nextToId):this.topId);
	// console.log(id, parentId)
	// console.log(id, ",", parentId)
	this._addItemIntoGlobalStrorage(id, parentId, itemText, "item", disabled, imgEnabled, imgDisabled);
	if ((parentId == this.idPrefix+this.topId) && (!this.context)) {
		this._renderToplevelItem(id, this.getItemPosition(nextToId));
	} else {
		this._renderSublevelItem(id, this.getItemPosition(nextToId));
	}
}

/**
*   @desc: adds a new child item
*   @param: parentId - the item which will contain a new item in the sublevel
*   @param: position - the position of a new item
*   @param: itemId - id of a new item
*   @param: itemText - text of a new item
*   @param: disabled - true|false, whether the item is disabled or not
*   @param: img - image for the enabled item
*   @param: imgDis - image for the disabled item
*   @type: public
*/
dhtmlXMenuObject.prototype.addNewChild = function(parentId, pos, itemId, itemText, disabled, imgEnabled, imgDisabled) {
	if (parentId == null) {
		if (this.context) {
			parentId = this.topId;
		} else {
			this.addNewSibling(parentId, itemId, itemText, disabled, imgEnabled, imgDisabled);
			if (pos != null) this.setItemPosition(itemId, pos);
			return;
		}
	}
	itemId = this.idPrefix+(itemId!=null?itemId:this._genStr(24));
	// remove hotkey, added in 0.4
	if (this.setHotKey) this.setHotKey(parentId, "");
	//
	parentId = this.idPrefix+parentId;
	this._addItemIntoGlobalStrorage(itemId, parentId, itemText, "item", disabled, imgEnabled, imgDisabled);
	if (this.idPull["polygon_"+parentId] == null) { this._renderSublevelPolygon(parentId, parentId); }
	this._renderSublevelItem(itemId, pos-1);
	// console.log(parentId)
	this._redefineComplexState(parentId);
}

/* add item to storage */
dhtmlXMenuObject.prototype._addItemIntoGlobalStrorage = function(itemId, itemParentId, itemText, itemType, disabled, img, imgDis) {
	var item = {
		id:	itemId,
		title:	itemText,
		imgen:	(img!=null?img:""),
		imgdis:	(imgDis!=null?imgDis:""),
		type:	itemType,
		state:	(disabled==true?"disabled":"enabled"),
		parent:	itemParentId,
		complex:false,
		hotkey:	"",
		tip:	""};
	this.itemPull[item.id] = item;
}
/* recursively creates and adds submenu polygon */
dhtmlXMenuObject.prototype._addSubMenuPolygon = function(id, parentId) {
	var s = this._renderSublevelPolygon(id, parentId);
	var j = this._getMenuNodes(parentId);
	for (q=0; q<j.length; q++) { if (this.itemPull[j[q]]["type"] == "separator") { this._renderSeparator(j[q], null); } else { this._renderSublevelItem(j[q], null); } }
	if (id == parentId) { var level = "topLevel"; } else { var level = "subLevel"; }
	for (var q=0; q<j.length; q++) { if (this.itemPull[j[q]]["complex"]) { this._addSubMenuPolygon(id, this.itemPull[j[q]]["id"]); } }
}
/* inner: add single subpolygon/item/separator */
dhtmlXMenuObject.prototype._renderSublevelPolygon = function(id, parentId) {
	var s = document.createElement("DIV");
	s.className = "dhtmlxMenu_"+this.skin+"_SubLevelArea_Polygon "+(this._rtl?"dir_right":"");
	s.dir = "ltr";
	s.oncontextmenu = function(e) { e = e||event; e.returnValue = false; e.cancelBubble = true; return false; }
	s.id = "polygon_" + parentId;
	s.onclick = function(e) { e = e || event; e.cancelBubble = true; }
	s.style.display = "none";
	document.body.insertBefore(s, document.body.firstChild);
	//
	var tbl = document.createElement("TABLE");
	tbl.className = "dhtmlxMebu_SubLevelArea_Tbl";
	tbl.cellSpacing = 0;
	tbl.cellPadding = 0;
	tbl.border = 0;
	var tbd = document.createElement("TBODY");
	tbl.appendChild(tbd);
	s.appendChild(tbl);
	s.tbl = tbl;
	s.tbd = tbd;
	// polygon
	this.idPull[s.id] = s;
	if (this.sxDacProc != null) {
		this.idPull["sxDac_" + parentId] = new this.sxDacProc(s, s.className);
		if (_isIE) {
			this.idPull["sxDac_" + parentId]._setSpeed(this.dacSpeedIE);
			this.idPull["sxDac_" + parentId]._setCustomCycle(this.dacCyclesIE);
		} else {
			this.idPull["sxDac_" + parentId]._setSpeed(this.dacSpeed);
			this.idPull["sxDac_" + parentId]._setCustomCycle(this.dacCycles);
		}
	}
	return s;
}
dhtmlXMenuObject.prototype._renderSublevelItem = function(id, pos) {
	var main_self = this;
	
	var tr = document.createElement("TR");
	tr.className = (this.itemPull[id]["state"]=="enabled"?"sub_item":"sub_item_dis");
	
	// icon
	var t1 = document.createElement("TD");
	t1.className = "sub_item_icon";
	var icon = this.itemPull[id][(this.itemPull[id]["state"]=="enabled"?"imgen":"imgdis")];
	if (icon != "") {
		var tp = this.itemPull[id]["type"];
		if (tp=="checkbox"||tp=="radio") {
			var img = document.createElement("DIV");
			img.id = "image_"+this.itemPull[id]["id"];
			img.className = "sub_icon "+icon;
			t1.appendChild(img);
		}
		if (!(tp=="checkbox"||tp=="radio")) {
			var img = document.createElement("IMG");
			img.id = "image_"+this.itemPull[id]["id"];
			img.className = "sub_icon";
			img.src = this.imagePath+icon;
			t1.appendChild(img);
		}
	}
	
	// text
	var t2 = document.createElement("TD");
	t2.className = "sub_item_text";
	if (this.itemPull[id]["title"] != "") {
		var t2t = document.createElement("DIV");
		t2t.className = "sub_item_text";
		t2t.innerHTML = this.itemPull[id]["title"];
		t2.appendChild(t2t);
	} else {
		t2.innerHTML = "&nbsp;";
	}
	
	// hotkey/sublevel arrow
	var t3 = document.createElement("TD");
	t3.className = "sub_item_hk";
	if (this.itemPull[id]["complex"]) {
		
		var arw = document.createElement("DIV");
		arw.className = "complex_arrow";
		arw.id = "arrow_"+this.itemPull[id]["id"];
		t3.appendChild(arw);
		
	} else {
		if (this.itemPull[id]["hotkey"].length > 0 && !this.itemPull[id]["complex"]) {
			var t3t = document.createElement("DIV");
			t3t.className = "sub_item_hk";
			t3t.innerHTML = this.itemPull[id]["hotkey"];
			t3.appendChild(t3t);
		} else {
			t3.innerHTML = "&nbsp;";
		}
	}
	tr.appendChild(this._rtl?t3:t1);
	tr.appendChild(t2);
	tr.appendChild(this._rtl?t1:t3);
	
	
	//
	tr.id = this.itemPull[id]["id"];
	tr.parent = this.itemPull[id]["parent"];
	// tooltip, added in 0.4
	if (this.itemPull[id]["tip"].length > 0) tr.title = this.itemPull[id]["tip"];
	//
	tr.onselectstart = function(e) { e = e || event; e.returnValue = false; return false; }
	tr.onmouseover = function() {
		if (main_self.menuMode == "web") window.clearTimeout(main_self.menuTimeoutHandler);
		main_self._redistribSubLevelSelection(this.id, this.parent);
	}
	if (main_self.menuMode == "web") {
		tr.onmouseout = function() {
			window.clearTimeout(main_self.menuTimeoutHandler);
			main_self.menuTimeoutHandler = window.setTimeout(function(){main_self._clearAndHide();}, main_self.menuTimeoutMsec, "JavaScript");
		}
	}
	tr.onclick = function(e) {
		// added in 0.4, preven complex closing if user event not defined
		if (!main_self.checkEvent("onClick") && main_self.itemPull[this.id]["complex"]) return;
		//
		e = e || event; e.cancelBubble = true;
		e.returnValue = false;
		tc = (main_self.itemPull[this.id]["complex"]?"c":"-");
		td = (main_self.itemPull[this.id]["state"]=="enabled"?"-":"d");
		var cas = {"ctrl": e.ctrlKey, "alt": e.altKey, "shift": e.shiftKey};
		switch (main_self.itemPull[this.id]["type"]) {
			case "checkbox":
				main_self._checkboxOnClickHandler(this.id.replace(main_self.idPrefix, ""), tc+td+"n", cas);
				break;
			case "radio":
				main_self._radioOnClickHandler(this.id.replace(main_self.idPrefix, ""), tc+td+"n", cas);
				break;
			case "item":
				main_self._doOnClick(this.id.replace(main_self.idPrefix, ""), tc+td+"n", cas);
				break;
		}
		return false;
	}
	// add
	var polygon = this.idPull["polygon_"+this.itemPull[id]["parent"]];
	if (pos != null) { pos++; if (pos < 0) pos = 0; if (pos > polygon.tbd.childNodes.length - 1) pos = null; }
	if (pos != null && polygon.tbd.childNodes[pos] != null) polygon.tbd.insertBefore(tr, polygon.tbd.childNodes[pos]); else polygon.tbd.appendChild(tr);
	this.idPull[tr.id] = tr;
}
/****************************************************************************************************************************************************/
/*								 	SEPARATOR								    */
dhtmlXMenuObject.prototype._renderSeparator = function(id, pos) {
	var level = (this.context?"SubLevelArea":(this.itemPull[id]["parent"]==this.idPrefix+this.topId?"TopLevel":"SubLevelArea"));
	if (level == "TopLevel" && this.context) return;
	
	var main_self = this;
	
	if (level != "TopLevel") {
		var tr = document.createElement("TR");
		tr.className = "sub_sep";
		var td = document.createElement("TD");
		td.colSpan = "3";
		tr.appendChild(td);
	}
	
	var k = document.createElement("DIV");
	k.id = "separator_"+id;
	k.className = (level=="TopLevel"?"top_sep":"sub_sep");
	k.onselectstart = function(e) { e = e || event; e.returnValue = false; }
	k.onclick = function(e) {
		e = e || event; e.cancelBubble = true;
		var cas = {"ctrl": e.ctrlKey, "alt": e.altKey, "shift": e.shiftKey};
		main_self._doOnClick(this.id.replace("separator_" + main_self.idPrefix, ""), "--s", cas);
	}
	if (level == "TopLevel") {
		if (pos != null) {
			pos++; if (pos < 0) { pos = 0; }
			// if (this.base.childNodes[pos] != null) { this.base.insertBefore(k, this.base.childNodes[pos]); } else { this.base.appendChild(k); }
			if (this.cont.childNodes[pos] != null) { this.cont.insertBefore(k, this.cont.childNodes[pos]); } else { this.cont.appendChild(k); }
		} else {
			// add as a last item
			// var last = this.base.childNodes[this.base.childNodes.length-1];
			var last = this.cont.childNodes[this.cont.childNodes.length-1];
			// if (String(last).search("TopLevel_Text") == -1) { this.base.appendChild(k); } else { this.base.insertBefore(k, last); }
			if (String(last).search("TopLevel_Text") == -1) { this.cont.appendChild(k); } else { this.cont.insertBefore(k, last); }
		}
		this.idPull[k.id] = k;
	} else {
		var polygon = this.idPull["polygon_"+this.itemPull[id]["parent"]];
		if (pos != null) { pos++; if (pos < 0) pos = 0; if (pos > polygon.tbd.childNodes.length - 1) pos = null; }
		if (pos != null && polygon.tbd.childNodes[pos] != null) polygon.tbd.insertBefore(tr, polygon.tbd.childNodes[pos]); else polygon.tbd.appendChild(tr);
		td.appendChild(k);
		this.idPull[k.id] = tr;
	}
}
/**
*   @desc: add a new separator
*   @param: nextToId - id of the element after which a new separator will be inserted
*   @param: itemId - id of a new separator
*   @type: public
*/
dhtmlXMenuObject.prototype.addNewSeparator = function(nextToId, itemId) { //, disabled) {
	itemId = this.idPrefix+(itemId!=null?itemId:this._genStr(24));
	var parentId = this.idPrefix+this.getParentId(nextToId);
	// if ((parentId == this.idPrefix+this.topId) && (!this.context)) { return; }
	// this._addItemIntoGlobalStrorage(itemId, parentId, "", "item", disabled, "", "");
	// this._addItemIntoGlobalStrorage(itemId, parentId, "", "item", false, "", "");
	this._addItemIntoGlobalStrorage(itemId, parentId, "", "separator", false, "", "");
	this._renderSeparator(itemId, this.getItemPosition(nextToId));
}
/****************************************************************************************************************************************************/
// hide any opened polygons
/**
*   @desc: hides any open menu polygons
*   @type: public
*/
dhtmlXMenuObject.prototype.hide = function() {
	this._clearAndHide();
}
/**
*   @desc: clear all loaded items
*   @type: public
*/
dhtmlXMenuObject.prototype.clearAll = function() {
	/*
	for (var a in this.itemPull) {
		if (this.itemPull[a]["parent"] == this.idPrefix+this.topId) {
			this.removeItem(String(a).replace(this.idPrefix,""));
		}
	}
	*/
	this.removeItem(this.idPrefix+this.topId, true);
	this._isInited = false;
	this.idPrefix = this._genStr(12);
}
/****************************************************************************************************************************************************/
/**
*   @desc: unloads menu from page (destructor)
*   @type: public
*/
dhtmlXMenuObject.prototype.unload = function() {
	
	if (_isIE) {
		document.body.detachEvent("onclick", this._bodyClick);
		document.body.detachEvent("oncontextmenu", this._bodyContext);
	} else {
		window.removeEventListener("click", this._bodyClick, false);
		window.removeEventListener("contextmenu", this._bodyContext, false);
	}
	this._bodyClick = null;
	this._bodyContext = null;
	
	// will recursively remove all items
	this.removeItem(this.idPrefix+this.topId, true);
	
	this.itemPull = null;
	this.idPull = null;
	
	// clear context zones
	if (this.context) for (var a in this.contextZones) this.removeContextZone(a);
	
	if (this.cont != null) {
		this.cont.className = "";
		this.cont.parentNode.removeChild(this.cont);
		this.cont = null;
	}
	
	if (this.base != null) {
		this.base.className = "";
		if (!this.context) this.base.oncontextmenu = (this.base._oldContextMenuHandler||null);
		this.base.onselectstart = null;
		this.base = null;
	}
	this.setSkin = null;
	
	this.detachAllEvents();
	
	if (this._xmlLoader) {
		this._xmlLoader.destructor();
		this._xmlLoader = null;
	}
	
	this._align = null;
	this._arrowFFFix = null;
	this._isIE6 = null;
	this._isInited = null;
	this._rtl = null;
	this._scrollDownTMStep = null;
	this._scrollDownTMTime = null;
	this._scrollUpTMStep = null;
	this._scrollUpTMTime = null;
	this._topLevelBottomMargin = null;
	this._topLevelOffsetLeft = null;
	this._topLevelBottomMargin = null;
	this._topLevelRightMargin = null;
	this.addBaseIdAsContextZone = null;
	this.context = null;
	this.contextAutoHide = null;
	this.contextAutoShow = null;
	this.contextHideAllMode = null;
	this.contextMenuZoneId = null;
	this.dLoad = null;
	this.dLoadSign = null;
	this.dLoadUrl = null;
	this.loaderIcon = null;
	this.fixedPosition = null;
	this.dirSubLevel = null;
	this.dirTopLevel = null;
	this.limit = null;
	this.menuSelected = null;
	this.menuLastClicked = null;
	this.idPrefix = null;
	this.imagePath = null;
	this.menuMode = null;
	this.menuModeTopLevelTimeout = null;
	this.menuModeTopLevelTimeoutTime = null;
	this.menuTimeoutHandler = null;
	this.menuTimeoutMsec = null;
	this.menuTouched = null;
	this.isDhtmlxMenuObject = null;
	this.itemHotKeyTagName = null;
	this.itemHrefTagName = null;
	this.itemTagName = null;
	this.itemTextTagName = null;
	this.itemTipTagName = null;
	this.userDataTagName = null;
	this.skin = null;
	this.topId = null;
	this.dacCycles = null;
	this.dacCyclesIE = null;
	this.dacSpeed = null;
	this.dacSpeedIE = null;
	this.zInd = null;
	this.zIndInit = null;
	this.zIndStep = null;
	
	//
	// unload basic methods
	
	this._enableDacSupport = null;
	this._selectedSubItems = null;
	this._openedPolygons = null;
	this._addSubItemToSelected = null;
	this._removeSubItemFromSelected = null;
	this._getSubItemToDeselectByPolygon = null;
	this._hidePolygon = null;
	this._showPolygon = null;
	this._redistribSubLevelSelection = null;
	this._doOnClick = null;
	this._doOnTouchMenu = null;
	this._searchMenuNode = null;
	this._getMenuNodes = null;
	this._genStr = null;
	this._clearAndHide = null;
	this._doOnLoad = null;
	this.getItemType = null;
	this.forEachItem = null;
	this.init = null;
	this.loadXML = null;
	this.loadXMLString = null;
	this._buildMenu = null;
	this._xmlParser = null;
	this._showSubLevelItem = null;
	this._hideSubLevelItem = null;
	this._countVisiblePolygonItems = null;
	this._redefineComplexState = null;
	this._updateItemComplexState = null;
	this._getItemLevelType = null;
	this._redistribTopLevelSelection = null;
	this._initTopLevelMenu = null;
	this._renderToplevelItem = null;
	this.setImagePath = null;
	this.setIconsPath = null;
	this.setIconPath = null;
	this._updateItemImage = null;
	this.removeItem = null;
	this._getAllParents = null;
	this.renderAsContextMenu = null;
	this.addContextZone = null;
	this.removeContextZone = null;
	this.isContextZone = null;
	this._isContextMenuVisible = null;
	this._showContextMenu = null;
	this._doOnContextBeforeCall = null;
	this._autoDetectVisibleArea = null;
	this._addItemIntoGlobalStrorage = null;
	this._addSubMenuPolygon = null;
	this._renderSublevelPolygon = null;
	this._renderSublevelItem = null;
	this._renderSeparator = null;
	this._hideContextMenu = null;
	this.clearAll = null;
	this.getItemPosition = null;
	this.setItemPosition = null;
	this.getParentId = null;
	this.addNewSibling = null;
	this.addNewChild = null;
	this.addNewSeparator = null;
	this.attachEvent = null;
	this.callEvent = null;
	this.checkEvent = null;
	this.eventCatcher = null;
	this.detachEvent = null;
	this.dhx_Event = null;
	this.unload = null;
	this.items = null;
	this.radio = null;
	this.detachAllEvents = null;
	this.hide = null;
	this.showContextMenu = null;
	this.hideContextMenu = null;
	
	
	// unload extended methods
	this._changeItemState = null;
	this._changeItemVisible = null;
	this._updateLoaderIcon = null;
	this._clearAllSelectedSubItemsInPolygon = null;
	this._checkArrowsState = null;
	this._addUpArrow = null;
	this._addDownArrow = null;
	this._removeUpArrow = null;
	this._removeDownArrow = null;
	this._isArrowExists = null;
	this._doScrollUp = null;
	this._doScrollDown = null;
	this._countPolygonItems = null;
	this._getRadioImgObj = null;
	this._setRadioState = null;
	this._radioOnClickHandler = null;
	this._getCheckboxState = null;
	this._setCheckboxState = null;
	this._readLevel = null;
	this._updateCheckboxImage = null;
	this._checkboxOnClickHandler = null;
	this._removeArrow = null;
	this.setItemEnabled = null;
	this.setItemDisabled = null;
	this.isItemEnabled = null;
	this.getItemText = null;
	this.setItemText = null;
	this.loadFromHTML = null;
	this.hideItem = null;
	this.showItem = null;
	this.isItemHidden = null;
	this.setUserData = null;
	this.getUserData = null;
	this.setOpenMode = null;
	this.setWebModeTimeout = null;
	this.enableDynamicLoading = null;
	this.getItemImage = null;
	this.setItemImage = null;
	this.clearItemImage = null;
	this.setAutoShowMode = null;
	this.setAutoHideMode = null;
	this.setContextMenuHideAllMode = null;
	this.getContextMenuHideAllMode = null;
	this.setVisibleArea = null;
	this.setTooltip = null;
	this.getTooltip = null;
	this.setHotKey = null;
	this.getHotKey = null;
	this.setItemSelected = null;
	this.setTopText = null;
	this.setRTL = null;
	this.setAlign = null;
	this.setHref = null;
	this.clearHref = null;
	this.getCircuit = null;
	this.contextZones = null;
	this.setOverflowHeight = null;
	this.userData = null;
	this.getRadioChecked = null;
	this.setRadioChecked = null;
	this.addRadioButton = null;
	this.setCheckboxState = null;
	this.getCheckboxState = null;
	this.addCheckbox = null;
	this.serialize = null;
	
	
	this.extendedModule = null;
	
	// remove menu from global store
	dhtmlxMenuObjectLiveInstances[this._UID] = null;
	try { delete dhtmlxMenuObjectLiveInstances[this._UID]; } catch(e) {}
	this._UID = null;
	
}
// dhtmlxmenu global store
var dhtmlxMenuObjectLiveInstances = {};

dhtmlXMenuObject.prototype.i18n = {
	dhxmenuextalert: "dhtmlxmenu_ext.js required"
};

//menu
(function(){
	dhtmlx.extend_api("dhtmlXMenuObject",{
		_init:function(obj){
			return [obj.parent, obj.skin];
		},
		align:"setAlign",
		top_text:"setTopText",
		context:"renderAsContextMenu",
		icon_path:"setIconsPath",
		open_mode:"setOpenMode",
		rtl:"setRTL",
		skin:"setSkin",
		dynamic:"enableDynamicLoading",
		xml:"loadXML",
		items:"items",
		overflow:"setOverflowHeight"
	},{
		items:function(arr,parent){
			var pos = 100000;
			var lastItemId = null;
			for (var i=0; i < arr.length; i++) {
				var item=arr[i];
				if (item.type == "separator") {
					this.addNewSeparator(lastItemId, pos, item.id);
					lastItemId = item.id;
				} else {
					this.addNewChild(parent, pos, item.id, item.text, item.disabled, item.img, item.img_disabled);
					lastItemId = item.id;
					if (item.items) this.items(item.items,item.id);
				}
			}
		}
	});
})();



/****************************************************************************************************************************************************/
/*								 	EXTENDED MODULE INFO							    */
dhtmlXMenuObject.prototype.extendedModule = "DHXMENUEXT";
/****************************************************************************************************************************************************/
/*								 	ENABLING/DISBLING							    */
/**
*   @desc: enables an item
*   @param: id - item's id to enable
*   @param: state - true|false
*   @type: public
*/
dhtmlXMenuObject.prototype.setItemEnabled = function(id) {
	// modified in 0.4
	this._changeItemState(id, "enabled", this._getItemLevelType(id));
}
/**
*   @desc: disables an item
*   @param: id - item's id to disablei
*   @type: public
*/
dhtmlXMenuObject.prototype.setItemDisabled = function(id) {
	this._changeItemState(id, "disabled", this._getItemLevelType(id));
}
/**
*   @desc: returns true if the item is enabled
*   @param: id - the item to check
*   @type: public
*/
dhtmlXMenuObject.prototype.isItemEnabled = function(id) {
	return (this.itemPull[this.idPrefix+id]!=null?(this.itemPull[this.idPrefix+id]["state"]=="enabled"):false);
}
/* enable/disable sublevel item */
dhtmlXMenuObject.prototype._changeItemState = function(id, newState, levelType) {
	var t = false;
	var j = this.idPrefix + id;
	if ((this.itemPull[j] != null) && (this.idPull[j] != null)) {
		if (this.itemPull[j]["state"] != newState) {
			this.itemPull[j]["state"] = newState;
			if (this.itemPull[j]["parent"] == this.idPrefix+this.topId && !this.context) {
				this.idPull[j].className = "dhtmlxMenu_"+this.skin+"_TopLevel_Item_"+(this.itemPull[j]["state"]=="enabled"?"Normal":"Disabled");
			} else {
				this.idPull[j].className = "sub_item"+(this.itemPull[j]["state"]=="enabled"?"":"_dis");
			}
			
			this._updateItemComplexState(this.idPrefix+id, this.itemPull[this.idPrefix+id]["complex"], false);
			this._updateItemImage(id, levelType);
			// if changeItemState attached to onClick event and changing applies to selected item all selection should be reparsed
			if ((this.idPrefix + this.menuLastClicked == j) && (levelType != "TopLevel")) {
				this._redistribSubLevelSelection(j, this.itemPull[j]["parent"]);
			}
			if (levelType == "TopLevel" && !this.context) { // rebuild style.left and show nested polygons
				// this._redistribTopLevelSelection(id, "parent");
			}
		}
	}
	return t;
}
/****************************************************************************************************************************************************/
/*								 	SET/GET TEXT								    */
/**
*   @desc: returns item's text
*   @param: id - the item
*   @type: public
*/
dhtmlXMenuObject.prototype.getItemText = function(id) {
	return (this.itemPull[this.idPrefix+id]!=null?this.itemPull[this.idPrefix+id]["title"]:"");
}

/**
*   @desc: sets text for the item
*   @param: id - the item
*   @param: text - a new text
*   @type: public
*/
dhtmlXMenuObject.prototype.setItemText = function(id, text) {
	id = this.idPrefix + id;
	if ((this.itemPull[id] != null) && (this.idPull[id] != null)) {
		this._clearAndHide();
		this.itemPull[id]["title"] = text;
		if (this.itemPull[id]["parent"] == this.idPrefix+this.topId && !this.context) {
			// top level
			var tObj = null;
			for (var q=0; q<this.idPull[id].childNodes.length; q++) {
				try { if (this.idPull[id].childNodes[q].className == "top_level_text") tObj = this.idPull[id].childNodes[q]; } catch(e) {}
			}
			if (String(this.itemPull[id]["title"]).length == "" || this.itemPull[id]["title"] == null) {
				if (tObj != null) tObj.parentNode.removeChild(tObj);
			} else {
				if (!tObj) {
					tObj = document.createElement("DIV");
					tObj.className = "top_level_text";
					if (this._rtl && this.idPull[id].childNodes.length > 0) this.idPull[id].insertBefore(tObj,this.idPull[id].childNodes[0]); else this.idPull[id].appendChild(tObj);
				}
				tObj.innerHTML = this.itemPull[id]["title"];
			}
		} else {
			// sub level
			var tObj = null;
			for (var q=0; q<this.idPull[id].childNodes[1].childNodes.length; q++) {
				if (String(this.idPull[id].childNodes[1].childNodes[q].className||"") == "sub_item_text") tObj = this.idPull[id].childNodes[1].childNodes[q];
			}
			if (String(this.itemPull[id]["title"]).length == "" || this.itemPull[id]["title"] == null) {
				if (tObj) {
					tObj.parentNode.removeChild(tObj);
					tObj = null;
					this.idPull[id].childNodes[1].innerHTML = "&nbsp;";
				}
			} else {
				if (!tObj) {
					tObj = document.createElement("DIV");
					tObj.className = "sub_item_text";
					this.idPull[id].childNodes[1].innerHTML = "";
					this.idPull[id].childNodes[1].appendChild(tObj);
				}
				tObj.innerHTML = this.itemPull[id]["title"];
			}
		}
	}
}
/****************************************************************************************************************************************************/
/**
*   @desc: loads menu data from an html and calls onLoadFunction when loading is done
*   @param: object - html data container
*   @param: clearAfterAdd - true|false, removes the container object after the data is loaded
*   @param: onLoadFunction - is called after the data is loaded (but before clearing html content if clear is set to true)
*   @type: public
*/
dhtmlXMenuObject.prototype.loadFromHTML = function(objId, clearAfterAdd, onLoadFunction) {
	//alert(4)
	// this.idPrefix = this._genStr(12);
	this.itemTagName = "DIV";
	if (typeof(objId) == "string") { objId = document.getElementById(objId); }
	this._buildMenu(objId, null);
	this.init();
	if (clearAfterAdd) { objId.parentNode.removeChild(objId); }
	if (onLoadFunction != null) { onLoadFunction(); }
}
/****************************************************************************************************************************************************/
/*								 	SHOW/HIDE								    */
/**
*   @desc: hides an item
*   @param: id - the item to hide
*   @type: public
*/
dhtmlXMenuObject.prototype.hideItem = function(id) {
	this._changeItemVisible(id, false);
}
/**
*   @desc: shows an item
*   @param: id - the item to show
*   @type: public
*/
dhtmlXMenuObject.prototype.showItem = function(id) {
	this._changeItemVisible(id, true);
}
/**
*   @desc: returns true if the item is hidden
*   @param: id - the item to check
*   @type: public
*/
dhtmlXMenuObject.prototype.isItemHidden = function(id) {
	var isHidden = null;
	if (this.idPull[this.idPrefix+id] != null) { isHidden = (this.idPull[this.idPrefix+id].style.display == "none"); }
	return isHidden;
}
/* show/hide item in menu, optimized for version 0.3 */
dhtmlXMenuObject.prototype._changeItemVisible = function(id, visible) {
	var itemId = this.idPrefix+id;
	if (this.itemPull[itemId] == null) return;
	if (this.itemPull[itemId]["type"] == "separator") { itemId = "separator_"+itemId; }
	if (this.idPull[itemId] == null) return;
	this.idPull[itemId].style.display = (visible?"":"none");
	this._redefineComplexState(this.itemPull[this.idPrefix+id]["parent"]);
}
/****************************************************************************************************************************************************/
/*								 	USERDATA								    */
//#menu_userdata:06062008{
/**
*   @desc: sets userdata for an item
*   @param: id - the item
*   @param: name - the name of userdata (string)
*   @param: value - the value of userdata (usually string)
*   @type: public
*/
dhtmlXMenuObject.prototype.setUserData = function(id, name, value) {
	this.userData[this.idPrefix+id+"_"+name] = value;
}

/**
*   @desc: returns item's userdata
*   @param: id - the item
*   @param: name - the name of userdata (string)
*   @type: public
*/
dhtmlXMenuObject.prototype.getUserData = function(id, name) {
	return (this.userData[this.idPrefix+id+"_"+name]!=null?this.userData[this.idPrefix+id+"_"+name]:null);
}
//#}
/****************************************************************************************************************************************************/
/*								 	OPENMODE/TIMEOUT							    */
/**
*   @desc: sets open mode for the menu
*   @param: mode - win|web, the default mode is web, in the win mode a user should click anywhere to hide the menu, in the web mode - just put the mouse pointer out of the menu area
*   @type: public
*/
dhtmlXMenuObject.prototype.setOpenMode = function(mode) {
	if (mode == "win" || mode == "web") this.menuMode = mode; else this.menuMode == "web"; 
}
/**
*   @desc: sets hide menu timeout (web mode only)
*   @param: tm - timeout, ms, 400 default
*   @type: public
*/
dhtmlXMenuObject.prototype.setWebModeTimeout = function(tm) {
	this.menuTimeoutMsec = (!isNaN(tm)?tm:400);
}
/****************************************************************************************************************************************************/
/*								 	DYNAMICAL LOADING							    */
/**
*   @desc: enables dynamic loading of sublevels
*   @param: url - server-side script, transmitted params are action=loadMenu and parentId 
*   @param: icon - true|false, replaces elemet's arrow with loading image while loading
*   @type: public
*/
dhtmlXMenuObject.prototype.enableDynamicLoading = function(url, icon) {
	this.dLoad = true;
	this.dLoadUrl = url;
	this.dLoadSign = (String(this.dLoadUrl).search(/\?/)==-1?"?":"&");
	this.loaderIcon = icon;
	this.init();
}
/* internal, show/hide loader icon */
dhtmlXMenuObject.prototype._updateLoaderIcon = function(id, state) {
	
	if (this.idPull[id] == null) return;
	if (String(this.idPull[id].className).search("TopLevel_Item") >= 0) return;
	// get arrow
	var ind = (this._rtl?0:2);
	if (!this.idPull[id].childNodes[ind]) return;
	if (!this.idPull[id].childNodes[ind].childNodes[0]) return;
	var aNode = this.idPull[id].childNodes[ind].childNodes[0];
	if (String(aNode.className).search("complex_arrow") === 0) aNode.className = "complex_arrow"+(state?"_loading":"");

}
/****************************************************************************************************************************************************/
/*								 	IMAGES									    */
/**
*   @desc: returns item's image - array(img, imgDis)
*   @param: id - the item
*   @type: public
*/
dhtmlXMenuObject.prototype.getItemImage = function(id) {
	var imgs = new Array(null, null);
	id = this.idPrefix+id;
	if (this.itemPull[id]["type"] == "item") {
		imgs[0] = this.itemPull[id]["imgen"];
		imgs[1] = this.itemPull[id]["imgdis"];
	}
	return imgs;
}
/**
*   @desc: sets an image for the item
*   @param: id - the item
*   @param: img - the image for the enabled item (empty string for none)
*   @param: imgDis - the image for the disabled item (empty string for none)
*   @type: public
*/
dhtmlXMenuObject.prototype.setItemImage = function(id, img, imgDis) {
	if (this.itemPull[this.idPrefix+id]["type"] != "item") return;
	this.itemPull[this.idPrefix+id]["imgen"] = img;
	this.itemPull[this.idPrefix+id]["imgdis"] = imgDis;
	this._updateItemImage(id, this._getItemLevelType(id));
}
/**
*   @desc: removes both enabled and disabled item images
*   @param: id - the item
*   @type: public
*/
dhtmlXMenuObject.prototype.clearItemImage = function(id) {
	this.setItemImage(id, "", "");
}
/****************************************************************************************************************************************************/
/*								 	CONTEXT STUFF								    */
/* public: context menu auto open/close enable/disable */
/**
*   @desc: sets to false to prevent showing a contextual menu by a click
*   @param: mode - true/false
*   @type: public
*/
dhtmlXMenuObject.prototype.setAutoShowMode = function(mode) {
	this.contextAutoShow = (mode==true?true:false);
}
/**
*   @desc: sets to false to prevent hiding a contextual menu by a click
*   @param: mode - true/false
*   @type: public
*/
dhtmlXMenuObject.prototype.setAutoHideMode = function(mode) {
	this.contextAutoHide = (mode==true?true:false);
}

/**
*   @desc: sets to true will hide all opened contextual menu polygons on mouseout
*   @param: mode - true/false
*   @type: public
*/
dhtmlXMenuObject.prototype.setContextMenuHideAllMode = function(mode) {
	this.contextHideAllMode = (mode==true?true:false);
}
/**
*   @desc: retutn hide all contextual menu mode
*   @type: public
*/
dhtmlXMenuObject.prototype.getContextMenuHideAllMode = function() {
	return this.contextHideAllMode;
}
/****************************************************************************************************************************************************/
/*								 	VISIBLE AREA								    */
/**
*   @desc: sets the area in which the menu can appear, if the area is not set, the menu will occupy all available visible space
*   @param: x1, x2 - int, leftmost and rightmost coordinates by x axis
*   @param: y1, y2 - int, topmost and bottommost coordinates by y axis
*   @type: public
*/
dhtmlXMenuObject.prototype.setVisibleArea = function(x1, x2, y1, y2) {
	this._isVisibleArea = true;
	this.menuX1 = x1;
	this.menuX2 = x2;
	this.menuY1 = y1;
	this.menuY2 = y2;
}
/****************************************************************************************************************************************************/
/*								 	TOOLTOPS								    */
// tooltips, added in 0.4
/**
*   @desc: sets tooltip for a menu item
*   @param: id - menu item's id
*   @param: tip - tooltip
*   @type: public
*/
dhtmlXMenuObject.prototype.setTooltip = function(id, tip) {
	id = this.idPrefix+id;
	if (!(this.itemPull[id] != null && this.idPull[id] != null)) return;
	this.idPull[id].title = (tip.length > 0 ? tip : null);
	this.itemPull[id]["tip"] = tip;
}
/**
*   @desc: returns tooltip of a menu item
*   @param: id - menu item's id
*   @type: public
*/
dhtmlXMenuObject.prototype.getTooltip = function(id) {
	if (this.itemPull[this.idPrefix+id] == null) return null;
	return this.itemPull[this.idPrefix+id]["tip"];
}
/****************************************************************************************************************************************************/
/*								 	HOTKEYS									    */
//#menu_hotkey:06062008#{
// hot-keys, added in 0.4
/**
*   @desc: sets menu hot-key (just text label)
*   @param: id - menu item's id
*   @param: hkey - hot-key text
*   @type: public
*/
dhtmlXMenuObject.prototype.setHotKey = function(id, hkey) {
	
	id = this.idPrefix+id;
	
	if (!(this.itemPull[id] != null && this.idPull[id] != null)) return;
	if (this.itemPull[id]["parent"] == this.idPrefix+this.topId && !this.context) return;
	if (this.itemPull[id]["complex"]) return;
	var t = this.itemPull[id]["type"];
	if (!(t == "item" || t == "checkbox" || t == "radio")) return;
	
	// retrieve obj
	var hkObj = null;
	try { if (this.idPull[id].childNodes[this._rtl?0:2].childNodes[0].className == "sub_item_hk") hkObj = this.idPull[id].childNodes[this._rtl?0:2].childNodes[0]; } catch(e){}
	
	if (hkey.length == 0) {
		// remove if exists
		this.itemPull[id]["hotkey_backup"] = this.itemPull[id]["hotkey"];
		this.itemPull[id]["hotkey"] = "";
		if (hkObj != null) hkObj.parentNode.removeChild(hkObj);
		
	} else {
		
		// add if needed or change
		this.itemPull[id]["hotkey"] = hkey;
		this.itemPull[id]["hotkey_backup"] = null;
		//
		if (hkObj == null) {
			hkObj = document.createElement("DIV");
			hkObj.className = "sub_item_hk";
			var item = this.idPull[id].childNodes[this._rtl?0:2];
			while (item.childNodes.length > 0) item.removeChild(item.childNodes[0]);
			item.appendChild(hkObj);
		}
		hkObj.innerHTML = hkey;

	}
}
/**
*   @desc: returns item's hot-key (just text label)
*   @param: id - menu item's id
*   @type: public
*/
dhtmlXMenuObject.prototype.getHotKey = function(id) {
	if (this.itemPull[this.idPrefix+id] == null) return null;
	return this.itemPull[this.idPrefix+id]["hotkey"];
}
/****************************************************************************************************************************************************/
/*								 	MISC									    */
//#}
/* set toplevel item selected */
dhtmlXMenuObject.prototype.setItemSelected = function(id) {
	if (this.itemPull[this.idPrefix+id] == null) return null;
	// console.log(this.itemPull[this.idPrefix+id]);
	
}
/**
*   @desc: set top level additional text (in case of usual menubar)
*   @param: text - text
*   @type: public
*/
dhtmlXMenuObject.prototype.setTopText = function(text) {
	if (this.context) return;
	if (this._topText == null) {
		this._topText = document.createElement("DIV");
		this._topText.className = "dhtmlxMenu_TopLevel_Text_"+(this._rtl?"left":(this._align=="left"?"right":"left"));
		this.base.appendChild(this._topText);
	}
	this._topText.innerHTML = text;
}
/**
*   @desc: set top level menu align
*   @param: align - left|right
*   @type: public
*/
dhtmlXMenuObject.prototype.setAlign = function(align) {
	if (this._align == align) return;
	if (align == "left" || align == "right") {
		// if (this.setRTL) this.setRTL(false);
		this._align = align;
		if (this.cont) this.cont.className = (this._align=="right"?"align_right":"align_left");
		if (this._topText != null) this._topText.className = "dhtmlxMenu_TopLevel_Text_"+(this._align=="left"?"right":"left");
	}
}
/**
*   @desc: set href to item, overwrite old if exists
*   @param: itemId
*   @param: href - url to open instead of onClik event handling
*   @param: target - target attribute
*   @type: public
*/
dhtmlXMenuObject.prototype.setHref = function(itemId, href, target) {
	if (this.itemPull[this.idPrefix+itemId] == null) return;
	this.itemPull[this.idPrefix+itemId]["href_link"] = href;
	if (target != null) this.itemPull[this.idPrefix+itemId]["href_target"] = target;
}
/**
*   @desc: clears item href and back item to default onClick behavior
*   @param: itemId
*   @type: public
*/
dhtmlXMenuObject.prototype.clearHref = function(itemId) {
	if (this.itemPull[this.idPrefix+itemId] == null) return;
	delete this.itemPull[this.idPrefix+itemId]["href_link"];
	delete this.itemPull[this.idPrefix+itemId]["href_target"];
}
/*
File [id="file"] -> Open [id="open"] -> Last Save [id="lastsave"]
getCircuit("lastsave") will return Array("file", "open", "lastsave");
*/
/**
*   @desc: return array with ids from topmost parent to chosen item
*   @param: id - chosen item id
*   @type: public
*/
dhtmlXMenuObject.prototype.getCircuit = function(id) {
	var parents = new Array(id);
	while (this.getParentId(id) != this.topId) {
		id = this.getParentId(id);
		parents[parents.length] = id;
	}
	return parents.reverse();
}
/* export to function */
/* WTF?
dhtmlXMenuObject.prototype.generateSQL = function() {
	var sql = "INSERT INTO `dhtmlxmenu_demo` (`itemId`, `itemParentId`, `itemOrder`, `itemText`, `itemType`, `itemEnabled`, `itemChecked`, `itemGroup`, `itemImage`, `itemImageDis`) VALUES ";
	var values = "";
	var q = 0;
	for (var a in this.itemPull) {
		values += (values.length>0?", ":"")+"('"+a.replace(this.idPrefix,"")+"',"+
						     "'"+(this.itemPull[a]["parent"]!=null?this.itemPull[a]["parent"].replace(this.idPrefix,""):"")+"',"+
						     "'"+(q++)+"',"+
						     "'"+this.itemPull[a]["title"]+"',"+
						     "'"+(this.itemPull[a]["type"]!="item"?this.itemPull[a]["type"]:"")+"',"+
						     "'"+(this.itemPull[a]["state"]=="enabled"?"1":"0")+"',"+
						     "'"+(this.itemPull[a]["checked"]!=null?(this.itemPull[a]["checked"]?"1":"0"):"0")+"',"+
						     "'"+(this.itemPull[a]["group"]!=null?this.itemPull[a]["group"]:"")+"',"+
						     "'"+this.itemPull[a]["imgen"]+"',"+
						     "'"+this.itemPull[a]["imgdis"]+"')";
	}
	return sql+values;
}
*/
//#menu_overflow:06062008#{
/****************************************************************************************************************************************************/
/*								 	OVERFLOW								    */
/* clear all selected subitems in polygon, implemented in 0.4 */
dhtmlXMenuObject.prototype._clearAllSelectedSubItemsInPolygon = function(polygon) {
	var subIds = this._getSubItemToDeselectByPolygon(polygon);
	// hide opened polygons and selected items
	for (var q=0; q<this._openedPolygons.length; q++) { if (this._openedPolygons[q] != polygon) { this._hidePolygon(this._openedPolygons[q]); } }
	for (var q=0; q<subIds.length; q++) { if (this.idPull[subIds[q]] != null) { if (this.itemPull[subIds[q]]["state"] == "enabled") { this.idPull[subIds[q]].className = "dhtmlxMenu_"+this.skin+"_SubLevelArea_Item_Normal"; } } }
}
/* define normal/disabled arrows in polygon */
dhtmlXMenuObject.prototype._checkArrowsState = function(id) {
	var polygon = this.idPull["polygon_"+id];
	var arrowUp = this.idPull["arrowup_"+id];
	var arrowDown = this.idPull["arrowdown_"+id];
	if (polygon.scrollTop == 0) {
		arrowUp.className = "dhtmlxMenu_"+this.skin+"_SubLevelArea_ArrowUp_Disabled";
	} else {
		arrowUp.className = "dhtmlxMenu_"+this.skin+"_SubLevelArea_ArrowUp" + (arrowUp.over ? "_Over" : "");
	}
	if (polygon.scrollTop + polygon.offsetHeight < polygon.scrollHeight) {
		arrowDown.className = "dhtmlxMenu_"+this.skin+"_SubLevelArea_ArrowDown" + (arrowDown.over ? "_Over" : "");
	} else {
		arrowDown.className = "dhtmlxMenu_"+this.skin+"_SubLevelArea_ArrowDown_Disabled";
	}
}
/* add up-limit-arrow */
dhtmlXMenuObject.prototype._addUpArrow = function(id) {
	var main_self = this;
	var arrow = document.createElement("DIV");
	arrow.pId = this.idPrefix+id;
	arrow.id = "arrowup_"+this.idPrefix+id;
	arrow.className = "dhtmlxMenu_"+this.skin+"_SubLevelArea_ArrowUp";
	arrow.innerHTML = "<div class='dhtmlxMenu_"+this.skin+"_SubLevelArea_Arrow'><div class='dhtmlxMenu_SubLevelArea_Arrow_Icon'></div></div>";
	arrow.style.display = "none";
	arrow.over = false;
	arrow.onselectstart = function(e) { e = e||event; e.returnValue = false; return false; }
	arrow.oncontextmenu = function(e) { e = e||event; e.returnValue = false; return false; }
	// actions
	arrow.onmouseover = function() {
		if (main_self.menuMode == "web") { window.clearTimeout(main_self.menuTimeoutHandler); }
		main_self._clearAllSelectedSubItemsInPolygon(this.pId);
		if (this.className == "dhtmlxMenu_"+main_self.skin+"_SubLevelArea_ArrowUp_Disabled") return;
		this.className = "dhtmlxMenu_"+main_self.skin+"_SubLevelArea_ArrowUp_Over";
		this.over = true;
		main_self._canScrollUp = true;
		main_self._doScrollUp(this.pId, true);
	}
	arrow.onmouseout = function() {
		if (main_self.menuMode == "web") {
			window.clearTimeout(main_self.menuTimeoutHandler);
			main_self.menuTimeoutHandler = window.setTimeout(function(){main_self._clearAndHide();}, main_self.menuTimeoutMsec, "JavaScript");
		}
		this.over = false;
		main_self._canScrollUp = false;
		if (this.className == "dhtmlxMenu_"+main_self.skin+"_SubLevelArea_ArrowUp_Disabled") return;
		this.className = "dhtmlxMenu_"+main_self.skin+"_SubLevelArea_ArrowUp";
		window.clearTimeout(main_self._scrollUpTM);
	}
	arrow.onclick = function(e) {
		e = e||event;
		e.returnValue = false;
		e.cancelBubble = true;
		return false;
	}
	//
	// var polygon = this.idPull["polygon_"+this.idPrefix+id];
	// polygon.insertBefore(arrow, polygon.childNodes[0]);
	document.body.insertBefore(arrow, document.body.firstChild);
	this.idPull[arrow.id] = arrow;
}
dhtmlXMenuObject.prototype._addDownArrow = function(id) {
	var main_self = this;
	var arrow = document.createElement("DIV");
	arrow.pId = this.idPrefix+id;
	arrow.id = "arrowdown_"+this.idPrefix+id;
	arrow.className = "dhtmlxMenu_"+this.skin+"_SubLevelArea_ArrowDown";
	arrow.innerHTML = "<div class='dhtmlxMenu_"+this.skin+"_SubLevelArea_Arrow'><div class='dhtmlxMenu_SubLevelArea_Arrow_Icon'></div></div>";
	arrow.style.display = "none";
	arrow.over = false;
	arrow.onselectstart = function(e) { e = e||event; e.returnValue = false; return false; }
	arrow.oncontextmenu = function(e) { e = e||event; e.returnValue = false; return false; }
	// actions
	arrow.onmouseover = function() {
		if (main_self.menuMode == "web") { window.clearTimeout(main_self.menuTimeoutHandler); }
		main_self._clearAllSelectedSubItemsInPolygon(this.pId);
		if (this.className == "dhtmlxMenu_"+main_self.skin+"_SubLevelArea_ArrowDown_Disabled") return;
		this.className = "dhtmlxMenu_"+main_self.skin+"_SubLevelArea_ArrowDown_Over";
		this.over = true;
		main_self._canScrollDown = true;
		main_self._doScrollDown(this.pId, true);
	}
	arrow.onmouseout = function() {
		if (main_self.menuMode == "web") {
			window.clearTimeout(main_self.menuTimeoutHandler);
			main_self.menuTimeoutHandler = window.setTimeout(function(){main_self._clearAndHide();}, main_self.menuTimeoutMsec, "JavaScript");
		}
		this.over = false;
		main_self._canScrollDown = false;
		if (this.className == "dhtmlxMenu_"+main_self.skin+"_SubLevelArea_ArrowDown_Disabled") return;
		this.className = "dhtmlxMenu_"+main_self.skin+"_SubLevelArea_ArrowDown";
		window.clearTimeout(main_self._scrollDownTM);
	}
	arrow.onclick = function(e) {
		e = e||event;
		e.returnValue = false;
		e.cancelBubble = true;
		return false;
	}
	document.body.insertBefore(arrow, document.body.firstChild);
	this.idPull[arrow.id] = arrow;
}
dhtmlXMenuObject.prototype._removeUpArrow = function(id) {
	var fullId = "arrowup_"+this.idPrefix+id;
	this._removeArrow(fullId);
}
dhtmlXMenuObject.prototype._removeDownArrow = function(id) {
	var fullId = "arrowdown_"+this.idPrefix+id;
	this._removeArrow(fullId);
}
dhtmlXMenuObject.prototype._removeArrow = function(fullId) {
	var arrow = this.idPull[fullId];
	arrow.onselectstart = null;
	arrow.oncontextmenu = null;
	arrow.onmouseover = null;
	arrow.onmouseout = null;
	arrow.onclick = null;
	if (arrow.parentNode) arrow.parentNode.removeChild(arrow);
	arrow = null;
	this.idPull[fullId] = null;
	try { delete this.idPull[fullId]; } catch(e) {}
}
dhtmlXMenuObject.prototype._isArrowExists = function(id) {
	if (this.idPull["arrowup_"+id] != null && this.idPull["arrowdown_"+id] != null) return true;
	return false;
}
/* scroll down */
dhtmlXMenuObject.prototype._doScrollUp = function(id, checkArrows) {
	var polygon = this.idPull["polygon_"+id];
	if (this._canScrollUp && polygon.scrollTop > 0) {
		var theEnd = false;
		var nextScrollTop = polygon.scrollTop - this._scrollUpTMStep;
		if (nextScrollTop < 0) {
			theEnd = true;
			nextScrollTop = 0;
		}
		polygon.scrollTop = nextScrollTop;
		if (!theEnd) {
			var that = this;
			this._scrollUpTM = window.setTimeout(function() { that._doScrollUp(id, false); }, this._scrollUpTMTime);
		}
	} else {
		this._canScrollUp = false;
		this._checkArrowsState(id);
	}
	if (checkArrows) {
		this._checkArrowsState(id);
	}
}
dhtmlXMenuObject.prototype._doScrollDown = function(id, checkArrows) {
	var polygon = this.idPull["polygon_"+id];
	if (this._canScrollDown && polygon.scrollTop + polygon.offsetHeight <= polygon.scrollHeight) {
		var theEnd = false;
		var nextScrollTop = polygon.scrollTop + this._scrollDownTMStep;
		if (nextScrollTop + polygon.offsetHeight > polygon.scollHeight) {
			theEnd = true;
			nextScrollTop = polygon.scollHeight - polygon.offsetHeight;
		}
		polygon.scrollTop = nextScrollTop;
		if (!theEnd) {
			var that = this;
			this._scrollDownTM = window.setTimeout(function() { that._doScrollDown(id, false); }, this._scrollDownTMTime);
		}
	} else {
		this._canScrollDown
		this._checkArrowsState(id);
	}
	if (checkArrows) {
		this._checkArrowsState(id);
	}
}
//
dhtmlXMenuObject.prototype._countPolygonItems = function(id) {
	var count = 0;
	for (var a in this.itemPull) {
		var par = this.itemPull[a]["parent"];
		var tp = this.itemPull[a]["type"];
		if (par == this.idPrefix+id && (tp == "item" || tp == "radio" || tp == "checkbox")) { count++; }
	}
	return count;
}
/* limit maximum items on single polygon, default - 0 = no limit */
/**
*   @desc: limits the maximum number of visible items in polygons
*   @param: itemsNum - count of the maximum number of visible items
*   @type: public
*/
dhtmlXMenuObject.prototype.setOverflowHeight = function(itemsNum) {
	
	// set auto overflow mode
	if (itemsNum === "auto") {
		this.limit = 0;
		this.autoOverflow = true;
		return;
	}
	
	// no existing limitation, now new limitation
	if (this.limit == 0 && itemsNum <= 0) return;
	
	// hide menu to prevent visible changes
	this._clearAndHide();
	
	// redefine existing limitation, arrows will added automatically with showPlygon
	if (this.limit >= 0 && itemsNum > 0) {
		this.limit = itemsNum;
		return;
	}
	
	// remove existing limitation
	if (this.limit > 0 && itemsNum <= 0) {
		for (var a in this.itemPull) {
			if (this._isArrowExists(a)) {
				var b = String(a).replace(this.idPrefix, "");
				this._removeUpArrow(b);
				this._removeDownArrow(b);
				// remove polygon's height
				this.idPull["polygon_"+a].style.height = "";
			}
		}
		this.limit = 0;
		return;
	}
}
//#}
/****************************************************************************************************************************************************/
/*								 	RADIOBUTTONS								    */
//#menu_radio:06062008{
dhtmlXMenuObject.prototype._getRadioImgObj = function(id) {
	try { var imgObj = this.idPull[this.idPrefix+id].childNodes[(this._rtl?2:0)].childNodes[0] } catch(e) { var imgObj = null; }
	return imgObj;
}
dhtmlXMenuObject.prototype._setRadioState = function(id, state) {
	// if (this.itemPull[this.idPrefix+id]["state"] != "enabled") return;
	var imgObj = this._getRadioImgObj(id);
	if (imgObj != null) {
		// fix, added in 0.4
		var rObj = this.itemPull[this.idPrefix+id];
		rObj["checked"] = state;
		rObj["imgen"] = "rdbt_"+(rObj["checked"]?"1":"0");
		rObj["imgdis"] = rObj["imgen"];
		imgObj.className = "sub_icon "+rObj["imgen"];
	}
}
dhtmlXMenuObject.prototype._radioOnClickHandler = function(id, type, casState) {
	if (type.charAt(1)=="d" || this.itemPull[this.idPrefix+id]["group"]==null) return;
	// deselect all from the same group
	var group = this.itemPull[this.idPrefix+id]["group"];
	if (this.checkEvent("onRadioClick")) {
		if (this.callEvent("onRadioClick", [group, this.getRadioChecked(group), id, this.contextMenuZoneId, casState])) {
			this.setRadioChecked(group, id);
		}
	} else {
		this.setRadioChecked(group, id);
	}
	// call onClick if exists
	if (this.checkEvent("onClick")) this.callEvent("onClick", [id]);
}
/**
*   @desc: returns a checked radio button in the group
*   @param: group - radio button group
*   @type: public
*/
dhtmlXMenuObject.prototype.getRadioChecked = function(group) {
	var id = null;
	for (var q=0; q<this.radio[group].length; q++) {
		var itemId = this.radio[group][q].replace(this.idPrefix, "");
		var imgObj = this._getRadioImgObj(itemId);
		if (imgObj != null) {
			var checked = (imgObj.className).match(/rdbt_1$/gi);
			if (checked != null) id = itemId;
		}
	}
	return id;
}
/**
*   @desc: checks a radio button inside the group
*   @param: group - radio button group
*   @param: id - radio button's id
*   @type: public
*/
dhtmlXMenuObject.prototype.setRadioChecked = function(group, id) {
	if (this.radio[group] == null) return;
	for (var q=0; q<this.radio[group].length; q++) {
		var itemId = this.radio[group][q].replace(this.idPrefix, "");
		this._setRadioState(itemId, (itemId==id));
	}
}
/**
*   @desc: adds a new radio button, sibling|child mode
*   @param: mode - (string) sibling|child
*   @param: nextToId - the item after which the radio button will be added in the "sibling" mode or parent item's id in the "child" mode
*   @param: pos - the item's position in the child mode (null for sibling)
*   @param: itemId - id of a new radio button
*   @param: itemText - text of a new radio button
*   @param: group - radiogroup's id
*   @param: state - checked|unchecked
*   @param: disabled - enabled|disabled
*   @type: public
*/
dhtmlXMenuObject.prototype.addRadioButton = function(mode, nextToId, pos, itemId, itemText, group, state, disabled) {
	// radiobutton
	/*
	if (this.itemPull[this.idPrefix+nextToId] == null) return;
	if (this.itemPull[this.idPrefix+nextToId]["parent"] == this.idPrefix+this.topId) return;
	*/
	if (this.context && nextToId == this.topId) {
		// adding radiobutton as first element to context menu
		// do nothing
	} else {
		if (this.itemPull[this.idPrefix+nextToId] == null) return;
		if (mode == "child" && this.itemPull[this.idPrefix+nextToId]["type"] != "item") return;
		// if (this.itemPull[this.idPrefix+nextToId]["parent"] == this.idPrefix+this.topId && !this.context) return;
	}
	
	//
	//
	var id = this.idPrefix+(itemId!=null?itemId:this._genStr(24));
	var img = "rdbt_"+(state?"1":"0");
	var imgDis = img;
	//
	if (mode == "sibling") {
		var parentId = this.idPrefix+this.getParentId(nextToId);
		this._addItemIntoGlobalStrorage(id, parentId, itemText, "radio", disabled, img, imgDis);
		this._renderSublevelItem(id, this.getItemPosition(nextToId));
	} else {
		var parentId = this.idPrefix+nextToId;
		this._addItemIntoGlobalStrorage(id, parentId, itemText, "radio", disabled, img, imgDis);
		if (this.idPull["polygon_"+parentId] == null) { this._renderSublevelPolygon(parentId, parentId); }
		this._renderSublevelItem(id, pos-1);
		this._redefineComplexState(parentId);
	}
	//
	var gr = (group!=null?group:this._genStr(24));
	this.itemPull[id]["group"] = gr;
	//
	if (this.radio[gr]==null) { this.radio[gr] = new Array(); }
	this.radio[gr][this.radio[gr].length] = id;
	//
	if (state == true) this.setRadioChecked(gr, String(id).replace(this.idPrefix, ""));
}
//#}
/****************************************************************************************************************************************************/
/*								 	CHECKBOXES								    */
//#menu_checks:06062008{
dhtmlXMenuObject.prototype._getCheckboxState = function(id) {
	if (this.itemPull[this.idPrefix+id] == null) return null;
	return this.itemPull[this.idPrefix+id]["checked"];
}
dhtmlXMenuObject.prototype._setCheckboxState = function(id, state) {
	if (this.itemPull[this.idPrefix+id] == null) return;
	this.itemPull[this.idPrefix+id]["checked"] = state;
}
dhtmlXMenuObject.prototype._updateCheckboxImage = function(id) {
	if (this.idPull[this.idPrefix+id] == null) return;
	this.itemPull[this.idPrefix+id]["imgen"] = "chbx_"+(this._getCheckboxState(id)?"1":"0");
	this.itemPull[this.idPrefix+id]["imgdis"] = this.itemPull[this.idPrefix+id]["imgen"];
	try { this.idPull[this.idPrefix+id].childNodes[(this._rtl?2:0)].childNodes[0].className = "sub_icon "+this.itemPull[this.idPrefix+id]["imgen"]; } catch(e){}
}
dhtmlXMenuObject.prototype._checkboxOnClickHandler = function(id, type, casState) {
	if (type.charAt(1)=="d") return;
	if (this.itemPull[this.idPrefix+id] == null) return;
	var state = this._getCheckboxState(id);
	if (this.checkEvent("onCheckboxClick")) {
		if (this.callEvent("onCheckboxClick", [id, state, this.contextMenuZoneId, casState])) {
			this.setCheckboxState(id, !state);
		}
	} else {
		this.setCheckboxState(id, !state);
	}
	// call onClick if exists
	if (this.checkEvent("onClick")) this.callEvent("onClick", [id]);
}
/**
*   @desc: sets checkbox's state
*   @param: id - the item
*   @param: state - a new state (true|false)
*   @type: public
*/
dhtmlXMenuObject.prototype.setCheckboxState = function(id, state) {
	this._setCheckboxState(id, state);
	this._updateCheckboxImage(id);
}
/**
*   @desc: returns current checkbox's state
*   @param: id - the item
*   @type: public
*/
dhtmlXMenuObject.prototype.getCheckboxState = function(id) {
	return this._getCheckboxState(id);
}
/**
*   @desc: adds a new checkbox, sibling|child mode
*   @param: mode - (string) sibling|child
*   @param: nextToId - the item after which the checkbox will be added in the "sibling" mode or parent item's id in the "child" mode
*   @param: pos - item's position in the child mode (null for sibling)
*   @param: itemId - id of a new checkbox
*   @param: itemText - text of a new checkbox
*   @param: state - checked|unchecked
*   @param: disabled - enabled|disabled
*   @type: public
*/
dhtmlXMenuObject.prototype.addCheckbox = function(mode, nextToId, pos, itemId, itemText, state, disabled) {
	// checks
	if (this.context && nextToId == this.topId) {
		// adding checkbox as first element to context menu
		// do nothing
	} else {
		if (this.itemPull[this.idPrefix+nextToId] == null) return;
		if (mode == "child" && this.itemPull[this.idPrefix+nextToId]["type"] != "item") return;
		// if (this.itemPull[this.idPrefix+nextToId]["parent"] == this.idPrefix+this.topId && !this.context) return;
	}
	//
	var img = "chbx_"+(state?"1":"0");
	var imgDis = img;
	//
	
	if (mode == "sibling") {
		
		var id = this.idPrefix+(itemId!=null?itemId:this._genStr(24));
		var parentId = this.idPrefix+this.getParentId(nextToId);
		this._addItemIntoGlobalStrorage(id, parentId, itemText, "checkbox", disabled, img, imgDis);
		this.itemPull[id]["checked"] = state;
		this._renderSublevelItem(id, this.getItemPosition(nextToId));
	} else {
		
		var id = this.idPrefix+(itemId!=null?itemId:this._genStr(24));
		var parentId = this.idPrefix+nextToId;
		this._addItemIntoGlobalStrorage(id, parentId, itemText, "checkbox", disabled, img, imgDis);
		this.itemPull[id]["checked"] = state;
		if (this.idPull["polygon_"+parentId] == null) { this._renderSublevelPolygon(parentId, parentId); }
		this._renderSublevelItem(id, pos-1);
		this._redefineComplexState(parentId);
	}
}
//#}
/****************************************************************************************************************************************************/
/*								 	SERIALIZE								    */
dhtmlXMenuObject.prototype._readLevel = function(parentId) {
	var xml = "";
	for (var a in this.itemPull) {
		if (this.itemPull[a]["parent"] == parentId) {
			var imgEn = "";
			var imgDis = "";
			var hotKey = "";
			var itemId = String(this.itemPull[a]["id"]).replace(this.idPrefix,"");
			var itemType = "";
			var itemText = (this.itemPull[a]["title"]!=""?' text="'+this.itemPull[a]["title"]+'"':"");
			var itemState = "";
			if (this.itemPull[a]["type"] == "item") {
				if (this.itemPull[a]["imgen"] != "") imgEn = ' img="'+this.itemPull[a]["imgen"]+'"';
				if (this.itemPull[a]["imgdis"] != "") imgDis = ' imgdis="'+this.itemPull[a]["imgdis"]+'"';
				if (this.itemPull[a]["hotkey"] != "") hotKey = '<hotkey>'+this.itemPull[a]["hotkey"]+'</hotkey>';
			}
			if (this.itemPull[a]["type"] == "separator") {
				itemType = ' type="separator"';
			} else {
				if (this.itemPull[a]["state"] == "disabled") itemState = ' enabled="false"';
			}
			if (this.itemPull[a]["type"] == "checkbox") {
				itemType = ' type="checkbox"'+(this.itemPull[a]["checked"]?' checked="true"':"");
			}
			if (this.itemPull[a]["type"] == "radio") {
				itemType = ' type="radio" group="'+this.itemPull[a]["group"]+'" '+(this.itemPull[a]["checked"]?' checked="true"':"");
			}
			xml += "<item id='"+itemId+"'"+itemText+itemType+imgEn+imgDis+itemState+">";
			xml += hotKey;
			if (this.itemPull[a]["complex"]) xml += this._readLevel(a);
			xml += "</item>";
		}
	}
	return xml;
}
/**
*   @desc: serialize menu to xml
*   @type: public
*/
dhtmlXMenuObject.prototype.serialize = function() {
	var xml = "<menu>"+this._readLevel(this.idPrefix+this.topId)+"</menu>";
	return xml;
}
/****************************************************************************************************************************************************/




