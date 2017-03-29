/*
Copyright DHTMLX LTD. http://www.dhtmlx.com
To use this component please contact sales@dhtmlx.com to obtain license
*/
dhtmlx=function(obj){for (var a in obj)dhtmlx[a]=obj[a];return dhtmlx;};dhtmlx.extend_api=function(name,map,ext){var t = window[name];if (!t)return;window[name]=function(obj){if (obj && typeof obj == "object" && !obj.tagName){var that = t.apply(this,(map._init?map._init(obj):arguments));for (var a in dhtmlx)if (map[a])this[map[a]](dhtmlx[a]);for (var a in obj){if (map[a])this[map[a]](obj[a]);else if (a.indexOf("on")==0){this.attachEvent(a,obj[a]);}
 }
 }else
 var that = t.apply(this,arguments);if (map._patch)map._patch(this);return that||this;};window[name].prototype=t.prototype;if (ext)dhtmlXHeir(window[name].prototype,ext);};dhtmlxAjax={get:function(url,callback){var t=new dtmlXMLLoaderObject(true);t.async=(arguments.length<3);t.waitCall=callback;t.loadXML(url)
 return t;},
 post:function(url,post,callback){var t=new dtmlXMLLoaderObject(true);t.async=(arguments.length<4);t.waitCall=callback;t.loadXML(url,true,post)
 return t;},
 getSync:function(url){return this.get(url,null,true)
 },
 postSync:function(url,post){return this.post(url,post,null,true);}
}
function dtmlXMLLoaderObject(funcObject, dhtmlObject, async, rSeed){this.xmlDoc="";if (typeof (async)!= "undefined")
 this.async=async;else
 this.async=true;this.onloadAction=funcObject||null;this.mainObject=dhtmlObject||null;this.waitCall=null;this.rSeed=rSeed||false;return this;};dtmlXMLLoaderObject.count = 0;dtmlXMLLoaderObject.prototype.waitLoadFunction=function(dhtmlObject){var once = true;this.check=function (){if ((dhtmlObject)&&(dhtmlObject.onloadAction != null)){if ((!dhtmlObject.xmlDoc.readyState)||(dhtmlObject.xmlDoc.readyState == 4)){if (!once)return;once=false;dtmlXMLLoaderObject.count++;if (typeof dhtmlObject.onloadAction == "function")dhtmlObject.onloadAction(dhtmlObject.mainObject, null, null, null, dhtmlObject);if (dhtmlObject.waitCall){dhtmlObject.waitCall.call(this,dhtmlObject);dhtmlObject.waitCall=null;}
 }
 }
 };return this.check;};dtmlXMLLoaderObject.prototype.getXMLTopNode=function(tagName, oldObj){if (this.xmlDoc.responseXML){var temp = this.xmlDoc.responseXML.getElementsByTagName(tagName);if(temp.length==0 && tagName.indexOf(":")!=-1)
 var temp = this.xmlDoc.responseXML.getElementsByTagName((tagName.split(":"))[1]);var z = temp[0];}else
 var z = this.xmlDoc.documentElement;if (z){this._retry=false;return z;}
 if (!this._retry&&_isIE){this._retry=true;var oldObj = this.xmlDoc;this.loadXMLString(this.xmlDoc.responseText.replace(/^[\s]+/,""), true);return this.getXMLTopNode(tagName, oldObj);}
 dhtmlxError.throwError("LoadXML", "Incorrect XML", [
 (oldObj||this.xmlDoc),
 this.mainObject
 ]);return document.createElement("DIV");};dtmlXMLLoaderObject.prototype.loadXMLString=function(xmlString, silent){if (!_isIE){var parser = new DOMParser();this.xmlDoc=parser.parseFromString(xmlString, "text/xml");}else {this.xmlDoc=new ActiveXObject("Microsoft.XMLDOM");this.xmlDoc.async=this.async;this.xmlDoc.onreadystatechange = function(){};this.xmlDoc["loadXM"+"L"](xmlString);}
 
 if (silent)return;if (this.onloadAction)this.onloadAction(this.mainObject, null, null, null, this);if (this.waitCall){this.waitCall();this.waitCall=null;}
}
dtmlXMLLoaderObject.prototype.loadXML=function(filePath, postMode, postVars, rpc){if (this.rSeed)filePath+=((filePath.indexOf("?") != -1) ? "&" : "?")+"a_dhx_rSeed="+(new Date()).valueOf();this.filePath=filePath;if ((!_isIE)&&(window.XMLHttpRequest))
 this.xmlDoc=new XMLHttpRequest();else {this.xmlDoc=new ActiveXObject("Microsoft.XMLHTTP");}
 if (this.async)this.xmlDoc.onreadystatechange=new this.waitLoadFunction(this);this.xmlDoc.open(postMode ? "POST" : "GET", filePath, this.async);if (rpc){this.xmlDoc.setRequestHeader("User-Agent", "dhtmlxRPC v0.1 ("+navigator.userAgent+")");this.xmlDoc.setRequestHeader("Content-type", "text/xml");}
 else if (postMode)this.xmlDoc.setRequestHeader('Content-type', (this.contenttype || 'application/x-www-form-urlencoded'));this.xmlDoc.setRequestHeader("X-Requested-With","XMLHttpRequest");this.xmlDoc.send(null||postVars);if (!this.async)(new this.waitLoadFunction(this))();};dtmlXMLLoaderObject.prototype.destructor=function(){this._filterXPath = null;this._getAllNamedChilds = null;this._retry = null;this.async = null;this.rSeed = null;this.filePath = null;this.onloadAction = null;this.mainObject = null;this.xmlDoc = null;this.doXPath = null;this.doXPathOpera = null;this.doXSLTransToObject = null;this.doXSLTransToString = null;this.loadXML = null;this.loadXMLString = null;this.doSerialization = null;this.xmlNodeToJSON = null;this.getXMLTopNode = null;this.setXSLParamValue = null;return null;}
dtmlXMLLoaderObject.prototype.xmlNodeToJSON = function(node){var t={};for (var i=0;i<node.attributes.length;i++)t[node.attributes[i].name]=node.attributes[i].value;t["_tagvalue"]=node.firstChild?node.firstChild.nodeValue:"";for (var i=0;i<node.childNodes.length;i++){var name=node.childNodes[i].tagName;if (name){if (!t[name])t[name]=[];t[name].push(this.xmlNodeToJSON(node.childNodes[i]));}
 }
 return t;}
function callerFunction(funcObject, dhtmlObject){this.handler=function(e){if (!e)e=window.event;funcObject(e, dhtmlObject);return true;};return this.handler;};function getAbsoluteLeft(htmlObject){return getOffset(htmlObject).left;}
function getAbsoluteTop(htmlObject){return getOffset(htmlObject).top;}
function getOffsetSum(elem) {var top=0, left=0;while(elem){top = top + parseInt(elem.offsetTop);left = left + parseInt(elem.offsetLeft);elem = elem.offsetParent;}
 return {top: top, left: left};}
function getOffsetRect(elem) {var box = elem.getBoundingClientRect();var body = document.body;var docElem = document.documentElement;var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;var clientTop = docElem.clientTop || body.clientTop || 0;var clientLeft = docElem.clientLeft || body.clientLeft || 0;var top = box.top + scrollTop - clientTop;var left = box.left + scrollLeft - clientLeft;return {top: Math.round(top), left: Math.round(left) };}
function getOffset(elem) {if (elem.getBoundingClientRect){return getOffsetRect(elem);}else {return getOffsetSum(elem);}
}
function convertStringToBoolean(inputString){if (typeof (inputString)== "string")
 inputString=inputString.toLowerCase();switch (inputString){case "1":
 case "true":
 case "yes":
 case "y":
 case 1:
 case true:
 return true;break;default: return false;}
}
function getUrlSymbol(str){if (str.indexOf("?")!= -1)
 return "&"
 else
 return "?"
}
function dhtmlDragAndDropObject(){if (window.dhtmlDragAndDrop)return window.dhtmlDragAndDrop;this.lastLanding=0;this.dragNode=0;this.dragStartNode=0;this.dragStartObject=0;this.tempDOMU=null;this.tempDOMM=null;this.waitDrag=0;window.dhtmlDragAndDrop=this;return this;};dhtmlDragAndDropObject.prototype.removeDraggableItem=function(htmlNode){htmlNode.onmousedown=null;htmlNode.dragStarter=null;htmlNode.dragLanding=null;}
dhtmlDragAndDropObject.prototype.addDraggableItem=function(htmlNode, dhtmlObject){htmlNode.onmousedown=this.preCreateDragCopy;htmlNode.dragStarter=dhtmlObject;this.addDragLanding(htmlNode, dhtmlObject);}
dhtmlDragAndDropObject.prototype.addDragLanding=function(htmlNode, dhtmlObject){htmlNode.dragLanding=dhtmlObject;}
dhtmlDragAndDropObject.prototype.preCreateDragCopy=function(e){if ((e||window.event)&& (e||event).button == 2)
 return;if (window.dhtmlDragAndDrop.waitDrag){window.dhtmlDragAndDrop.waitDrag=0;document.body.onmouseup=window.dhtmlDragAndDrop.tempDOMU;document.body.onmousemove=window.dhtmlDragAndDrop.tempDOMM;return false;}
 
 if (window.dhtmlDragAndDrop.dragNode)window.dhtmlDragAndDrop.stopDrag(e);window.dhtmlDragAndDrop.waitDrag=1;window.dhtmlDragAndDrop.tempDOMU=document.body.onmouseup;window.dhtmlDragAndDrop.tempDOMM=document.body.onmousemove;window.dhtmlDragAndDrop.dragStartNode=this;window.dhtmlDragAndDrop.dragStartObject=this.dragStarter;document.body.onmouseup=window.dhtmlDragAndDrop.preCreateDragCopy;document.body.onmousemove=window.dhtmlDragAndDrop.callDrag;window.dhtmlDragAndDrop.downtime = new Date().valueOf();if ((e)&&(e.preventDefault)){e.preventDefault();return false;}
 return false;};dhtmlDragAndDropObject.prototype.callDrag=function(e){if (!e)e=window.event;dragger=window.dhtmlDragAndDrop;if ((new Date()).valueOf()-dragger.downtime<100) return;if (!dragger.dragNode){if (dragger.waitDrag){dragger.dragNode=dragger.dragStartObject._createDragNode(dragger.dragStartNode, e);if (!dragger.dragNode)return dragger.stopDrag();dragger.dragNode.onselectstart=function(){return false;}
 dragger.gldragNode=dragger.dragNode;document.body.appendChild(dragger.dragNode);document.body.onmouseup=dragger.stopDrag;dragger.waitDrag=0;dragger.dragNode.pWindow=window;dragger.initFrameRoute();}
 else return dragger.stopDrag(e, true);}
 if (dragger.dragNode.parentNode != window.document.body && dragger.gldragNode){var grd = dragger.gldragNode;if (dragger.gldragNode.old)grd=dragger.gldragNode.old;grd.parentNode.removeChild(grd);var oldBody = dragger.dragNode.pWindow;if (grd.pWindow && grd.pWindow.dhtmlDragAndDrop.lastLanding)grd.pWindow.dhtmlDragAndDrop.lastLanding.dragLanding._dragOut(grd.pWindow.dhtmlDragAndDrop.lastLanding);if (_isIE){var div = document.createElement("Div");div.innerHTML=dragger.dragNode.outerHTML;dragger.dragNode=div.childNodes[0];}else
 dragger.dragNode=dragger.dragNode.cloneNode(true);dragger.dragNode.pWindow=window;dragger.gldragNode.old=dragger.dragNode;document.body.appendChild(dragger.dragNode);oldBody.dhtmlDragAndDrop.dragNode=dragger.dragNode;}
 dragger.dragNode.style.left=e.clientX+15+(dragger.fx
 ? dragger.fx*(-1)
 : 0)
 +(document.body.scrollLeft||document.documentElement.scrollLeft)+"px";dragger.dragNode.style.top=e.clientY+3+(dragger.fy
 ? dragger.fy*(-1)
 : 0)
 +(document.body.scrollTop||document.documentElement.scrollTop)+"px";if (!e.srcElement)var z = e.target;else
 z=e.srcElement;dragger.checkLanding(z, e);}
dhtmlDragAndDropObject.prototype.calculateFramePosition=function(n){if (window.name){var el = parent.frames[window.name].frameElement.offsetParent;var fx = 0;var fy = 0;while (el){fx+=el.offsetLeft;fy+=el.offsetTop;el=el.offsetParent;}
 if ((parent.dhtmlDragAndDrop)){var ls = parent.dhtmlDragAndDrop.calculateFramePosition(1);fx+=ls.split('_')[0]*1;fy+=ls.split('_')[1]*1;}
 if (n)return fx+"_"+fy;else
 this.fx=fx;this.fy=fy;}
 return "0_0";}
dhtmlDragAndDropObject.prototype.checkLanding=function(htmlObject, e){if ((htmlObject)&&(htmlObject.dragLanding)){if (this.lastLanding)this.lastLanding.dragLanding._dragOut(this.lastLanding);this.lastLanding=htmlObject;this.lastLanding=this.lastLanding.dragLanding._dragIn(this.lastLanding, this.dragStartNode, e.clientX,
 e.clientY, e);this.lastLanding_scr=(_isIE ? e.srcElement : e.target);}else {if ((htmlObject)&&(htmlObject.tagName != "BODY"))
 this.checkLanding(htmlObject.parentNode, e);else {if (this.lastLanding)this.lastLanding.dragLanding._dragOut(this.lastLanding, e.clientX, e.clientY, e);this.lastLanding=0;if (this._onNotFound)this._onNotFound();}
 }
}
dhtmlDragAndDropObject.prototype.stopDrag=function(e, mode){dragger=window.dhtmlDragAndDrop;if (!mode){dragger.stopFrameRoute();var temp = dragger.lastLanding;dragger.lastLanding=null;if (temp)temp.dragLanding._drag(dragger.dragStartNode, dragger.dragStartObject, temp, (_isIE
 ? event.srcElement
 : e.target));}
 dragger.lastLanding=null;if ((dragger.dragNode)&&(dragger.dragNode.parentNode == document.body))
 dragger.dragNode.parentNode.removeChild(dragger.dragNode);dragger.dragNode=0;dragger.gldragNode=0;dragger.fx=0;dragger.fy=0;dragger.dragStartNode=0;dragger.dragStartObject=0;document.body.onmouseup=dragger.tempDOMU;document.body.onmousemove=dragger.tempDOMM;dragger.tempDOMU=null;dragger.tempDOMM=null;dragger.waitDrag=0;}
dhtmlDragAndDropObject.prototype.stopFrameRoute=function(win){if (win)window.dhtmlDragAndDrop.stopDrag(1, 1);for (var i = 0;i < window.frames.length;i++){try{if ((window.frames[i] != win)&&(window.frames[i].dhtmlDragAndDrop))
 window.frames[i].dhtmlDragAndDrop.stopFrameRoute(window);}catch(e){}
 }
 try{if ((parent.dhtmlDragAndDrop)&&(parent != window)&&(parent != win))
 parent.dhtmlDragAndDrop.stopFrameRoute(window);}catch(e){}
}
dhtmlDragAndDropObject.prototype.initFrameRoute=function(win, mode){if (win){window.dhtmlDragAndDrop.preCreateDragCopy();window.dhtmlDragAndDrop.dragStartNode=win.dhtmlDragAndDrop.dragStartNode;window.dhtmlDragAndDrop.dragStartObject=win.dhtmlDragAndDrop.dragStartObject;window.dhtmlDragAndDrop.dragNode=win.dhtmlDragAndDrop.dragNode;window.dhtmlDragAndDrop.gldragNode=win.dhtmlDragAndDrop.dragNode;window.document.body.onmouseup=window.dhtmlDragAndDrop.stopDrag;window.waitDrag=0;if (((!_isIE)&&(mode))&&((!_isFF)||(_FFrv < 1.8)))
 window.dhtmlDragAndDrop.calculateFramePosition();}
 try{if ((parent.dhtmlDragAndDrop)&&(parent != window)&&(parent != win))
 parent.dhtmlDragAndDrop.initFrameRoute(window);}catch(e){}
 for (var i = 0;i < window.frames.length;i++){try{if ((window.frames[i] != win)&&(window.frames[i].dhtmlDragAndDrop))
 window.frames[i].dhtmlDragAndDrop.initFrameRoute(window, ((!win||mode) ? 1 : 0));}catch(e){}
 }
}
 _isFF = false;_isIE = false;_isOpera = false;_isKHTML = false;_isMacOS = false;_isChrome = false;_FFrv = false;_KHTMLrv = false;_OperaRv = false;if (navigator.userAgent.indexOf('Macintosh')!= -1)
 _isMacOS=true;if (navigator.userAgent.toLowerCase().indexOf('chrome')>-1)
 _isChrome=true;if ((navigator.userAgent.indexOf('Safari')!= -1)||(navigator.userAgent.indexOf('Konqueror') != -1)){_KHTMLrv = parseFloat(navigator.userAgent.substr(navigator.userAgent.indexOf('Safari')+7, 5));if (_KHTMLrv > 525){_isFF=true;_FFrv = 1.9;}else
 _isKHTML=true;}else if (navigator.userAgent.indexOf('Opera')!= -1){_isOpera=true;_OperaRv=parseFloat(navigator.userAgent.substr(navigator.userAgent.indexOf('Opera')+6, 3));}
else if (navigator.appName.indexOf("Microsoft")!= -1){_isIE=true;if ((navigator.appVersion.indexOf("MSIE 8.0")!= -1 || navigator.appVersion.indexOf("MSIE 9.0")!= -1 || navigator.appVersion.indexOf("MSIE 10.0")!= -1 ) && document.compatMode != "BackCompat"){_isIE=8;}
}else {_isFF=true;_FFrv = parseFloat(navigator.userAgent.split("rv:")[1])
}
dtmlXMLLoaderObject.prototype.doXPath=function(xpathExp, docObj, namespace, result_type){if (_isKHTML || (!_isIE && !window.XPathResult))
 return this.doXPathOpera(xpathExp, docObj);if (_isIE){if (!docObj)if (!this.xmlDoc.nodeName)docObj=this.xmlDoc.responseXML
 else
 docObj=this.xmlDoc;if (!docObj)dhtmlxError.throwError("LoadXML", "Incorrect XML", [
 (docObj||this.xmlDoc),
 this.mainObject
 ]);if (namespace != null)docObj.setProperty("SelectionNamespaces", "xmlns:xsl='"+namespace+"'");if (result_type == 'single'){return docObj.selectSingleNode(xpathExp);}
 else {return docObj.selectNodes(xpathExp)||new Array(0);}
 }else {var nodeObj = docObj;if (!docObj){if (!this.xmlDoc.nodeName){docObj=this.xmlDoc.responseXML
 }
 else {docObj=this.xmlDoc;}
 }
 if (!docObj)dhtmlxError.throwError("LoadXML", "Incorrect XML", [
 (docObj||this.xmlDoc),
 this.mainObject
 ]);if (docObj.nodeName.indexOf("document")!= -1){nodeObj=docObj;}
 else {nodeObj=docObj;docObj=docObj.ownerDocument;}
 var retType = XPathResult.ANY_TYPE;if (result_type == 'single')retType=XPathResult.FIRST_ORDERED_NODE_TYPE
 var rowsCol = new Array();var col = docObj.evaluate(xpathExp, nodeObj, function(pref){return namespace
 }, retType, null);if (retType == XPathResult.FIRST_ORDERED_NODE_TYPE){return col.singleNodeValue;}
 var thisColMemb = col.iterateNext();while (thisColMemb){rowsCol[rowsCol.length]=thisColMemb;thisColMemb=col.iterateNext();}
 return rowsCol;}
}
function _dhtmlxError(type, name, params){if (!this.catches)this.catches=new Array();return this;}
_dhtmlxError.prototype.catchError=function(type, func_name){this.catches[type]=func_name;}
_dhtmlxError.prototype.throwError=function(type, name, params){if (this.catches[type])return this.catches[type](type, name, params);if (this.catches["ALL"])return this.catches["ALL"](type, name, params);alert("Error type: "+arguments[0]+"\nDescription: "+arguments[1]);return null;}
window.dhtmlxError=new _dhtmlxError();dtmlXMLLoaderObject.prototype.doXPathOpera=function(xpathExp, docObj){var z = xpathExp.replace(/[\/]+/gi, "/").split('/');var obj = null;var i = 1;if (!z.length)return [];if (z[0] == ".")obj=[docObj];else if (z[0] == ""){obj=(this.xmlDoc.responseXML||this.xmlDoc).getElementsByTagName(z[i].replace(/\[[^\]]*\]/g, ""));i++;}else
 return [];for (i;i < z.length;i++)obj=this._getAllNamedChilds(obj, z[i]);if (z[i-1].indexOf("[")!= -1)
 obj=this._filterXPath(obj, z[i-1]);return obj;}
dtmlXMLLoaderObject.prototype._filterXPath=function(a, b){var c = new Array();var b = b.replace(/[^\[]*\[\@/g, "").replace(/[\[\]\@]*/g, "");for (var i = 0;i < a.length;i++)if (a[i].getAttribute(b))
 c[c.length]=a[i];return c;}
dtmlXMLLoaderObject.prototype._getAllNamedChilds=function(a, b){var c = new Array();if (_isKHTML)b=b.toUpperCase();for (var i = 0;i < a.length;i++)for (var j = 0;j < a[i].childNodes.length;j++){if (_isKHTML){if (a[i].childNodes[j].tagName&&a[i].childNodes[j].tagName.toUpperCase()== b)
 c[c.length]=a[i].childNodes[j];}
 else if (a[i].childNodes[j].tagName == b)c[c.length]=a[i].childNodes[j];}
 return c;}
function dhtmlXHeir(a, b){for (var c in b)if (typeof (b[c])== "function")
 a[c]=b[c];return a;}
function dhtmlxEvent(el, event, handler){if (el.addEventListener)el.addEventListener(event, handler, false);else if (el.attachEvent)el.attachEvent("on"+event, handler);}
dtmlXMLLoaderObject.prototype.xslDoc=null;dtmlXMLLoaderObject.prototype.setXSLParamValue=function(paramName, paramValue, xslDoc){if (!xslDoc)xslDoc=this.xslDoc

 if (xslDoc.responseXML)xslDoc=xslDoc.responseXML;var item =
 this.doXPath("/xsl:stylesheet/xsl:variable[@name='"+paramName+"']", xslDoc,
 "http:/\/www.w3.org/1999/XSL/Transform", "single");if (item != null)item.firstChild.nodeValue=paramValue
}
dtmlXMLLoaderObject.prototype.doXSLTransToObject=function(xslDoc, xmlDoc){if (!xslDoc)xslDoc=this.xslDoc;if (xslDoc.responseXML)xslDoc=xslDoc.responseXML

 if (!xmlDoc)xmlDoc=this.xmlDoc;if (xmlDoc.responseXML)xmlDoc=xmlDoc.responseXML

 
 if (!_isIE){if (!this.XSLProcessor){this.XSLProcessor=new XSLTProcessor();this.XSLProcessor.importStylesheet(xslDoc);}
 var result = this.XSLProcessor.transformToDocument(xmlDoc);}else {var result = new ActiveXObject("Msxml2.DOMDocument.3.0");try{xmlDoc.transformNodeToObject(xslDoc, result);}catch(e){result = xmlDoc.transformNode(xslDoc);}
 }
 return result;}
dtmlXMLLoaderObject.prototype.doXSLTransToString=function(xslDoc, xmlDoc){var res = this.doXSLTransToObject(xslDoc, xmlDoc);if(typeof(res)=="string")
 return res;return this.doSerialization(res);}
dtmlXMLLoaderObject.prototype.doSerialization=function(xmlDoc){if (!xmlDoc)xmlDoc=this.xmlDoc;if (xmlDoc.responseXML)xmlDoc=xmlDoc.responseXML
 if (!_isIE){var xmlSerializer = new XMLSerializer();return xmlSerializer.serializeToString(xmlDoc);}else
 return xmlDoc.xml;}
dhtmlxEventable=function(obj){obj.attachEvent=function(name, catcher, callObj){name='ev_'+name.toLowerCase();if (!this[name])this[name]=new this.eventCatcher(callObj||this);return(name+':'+this[name].addEvent(catcher));}
 obj.callEvent=function(name, arg0){name='ev_'+name.toLowerCase();if (this[name])return this[name].apply(this, arg0);return true;}
 obj.checkEvent=function(name){return (!!this['ev_'+name.toLowerCase()])
 }
 obj.eventCatcher=function(obj){var dhx_catch = [];var z = function(){var res = true;for (var i = 0;i < dhx_catch.length;i++){if (dhx_catch[i] != null){var zr = dhx_catch[i].apply(obj, arguments);res=res&&zr;}
 }
 return res;}
 z.addEvent=function(ev){if (typeof (ev)!= "function")
 ev=eval(ev);if (ev)return dhx_catch.push(ev)-1;return false;}
 z.removeEvent=function(id){dhx_catch[id]=null;}
 return z;}
 obj.detachEvent=function(id){if (id != false){var list = id.split(':');this[list[0]].removeEvent(list[1]);}
 }
 obj.detachAllEvents = function(){for (var name in this){if (name.indexOf("ev_")==0) 
 this[name] = null;}
 }
 obj = null;};function dataProcessor(serverProcessorURL){this.serverProcessor = serverProcessorURL;this.action_param="!nativeeditor_status";this.object = null;this.updatedRows = [];this.autoUpdate = true;this.updateMode = "cell";this._tMode="GET";this.post_delim = "_";this._waitMode=0;this._in_progress={};this._invalid={};this.mandatoryFields=[];this.messages=[];this.styles={updated:"font-weight:bold;",
 inserted:"font-weight:bold;",
 deleted:"text-decoration : line-through;",
 invalid:"background-color:FFE0E0;",
 invalid_cell:"border-bottom:2px solid red;",
 error:"color:red;",
 clear:"font-weight:normal;text-decoration:none;"
 };this.enableUTFencoding(true);dhtmlxEventable(this);return this;}
dataProcessor.prototype={setTransactionMode:function(mode,total){this._tMode=mode;this._tSend=total;},
 escape:function(data){if (this._utf)return encodeURIComponent(data);else
 return escape(data);},
 
 enableUTFencoding:function(mode){this._utf=convertStringToBoolean(mode);},
 
 setDataColumns:function(val){this._columns=(typeof val == "string")?val.split(","):val;},
 
 getSyncState:function(){return !this.updatedRows.length;},
 
 enableDataNames:function(mode){this._endnm=convertStringToBoolean(mode);},
 
 enablePartialDataSend:function(mode){this._changed=convertStringToBoolean(mode);},
 
 setUpdateMode:function(mode,dnd){this.autoUpdate = (mode=="cell");this.updateMode = mode;this.dnd=dnd;},
 ignore:function(code,master){this._silent_mode=true;code.call(master||window);this._silent_mode=false;},
 
 setUpdated:function(rowId,state,mode){if (this._silent_mode)return;var ind=this.findRow(rowId);mode=mode||"updated";var existing = this.obj.getUserData(rowId,this.action_param);if (existing && mode == "updated")mode=existing;if (state){this.set_invalid(rowId,false);this.updatedRows[ind]=rowId;this.obj.setUserData(rowId,this.action_param,mode);if (this._in_progress[rowId])this._in_progress[rowId]="wait";}else{if (!this.is_invalid(rowId)){this.updatedRows.splice(ind,1);this.obj.setUserData(rowId,this.action_param,"");}
 }
 
 if (!state)this._clearUpdateFlag(rowId);this.markRow(rowId,state,mode);if (state && this.autoUpdate)this.sendData(rowId);},
 _clearUpdateFlag:function(id){},
 markRow:function(id,state,mode){var str="";var invalid=this.is_invalid(id);if (invalid){str=this.styles[invalid];state=true;}
 if (this.callEvent("onRowMark",[id,state,mode,invalid])){str=this.styles[state?mode:"clear"]+str;this.obj[this._methods[0]](id,str);if (invalid && invalid.details){str+=this.styles[invalid+"_cell"];for (var i=0;i < invalid.details.length;i++)if (invalid.details[i])this.obj[this._methods[1]](id,i,str);}
 }
 },
 getState:function(id){return this.obj.getUserData(id,this.action_param);},
 is_invalid:function(id){return this._invalid[id];},
 set_invalid:function(id,mode,details){if (details)mode={value:mode, details:details, toString:function(){return this.value.toString();}};this._invalid[id]=mode;},
 
 checkBeforeUpdate:function(rowId){return true;},
 
 sendData:function(rowId){if (this._waitMode && (this.obj.mytype=="tree" || this.obj._h2)) return;if (this.obj.editStop)this.obj.editStop();if(typeof rowId == "undefined" || this._tSend)return this.sendAllData();if (this._in_progress[rowId])return false;this.messages=[];if (!this.checkBeforeUpdate(rowId)&& this.callEvent("onValidationError",[rowId,this.messages])) return false;this._beforeSendData(this._getRowData(rowId),rowId);},
 _beforeSendData:function(data,rowId){if (!this.callEvent("onBeforeUpdate",[rowId,this.getState(rowId),data])) return false;this._sendData(data,rowId);},
 serialize:function(data, id){if (typeof data == "string")return data;if (typeof id != "undefined")return this.serialize_one(data,"");else{var stack = [];var keys = [];for (var key in data)if (data.hasOwnProperty(key)){stack.push(this.serialize_one(data[key],key+this.post_delim));keys.push(key);}
 stack.push("ids="+this.escape(keys.join(",")));if (dhtmlx.security_key)stack.push("dhx_security="+dhtmlx.security_key);return stack.join("&");}
 },
 serialize_one:function(data, pref){if (typeof data == "string")return data;var stack = [];for (var key in data)if (data.hasOwnProperty(key))
 stack.push(this.escape((pref||"")+key)+"="+this.escape(data[key]));return stack.join("&");},
 _sendData:function(a1,rowId){if (!a1)return;if (!this.callEvent("onBeforeDataSending",rowId?[rowId,this.getState(rowId),a1]:[null, null, a1])) return false;if (rowId)this._in_progress[rowId]=(new Date()).valueOf();var a2=new dtmlXMLLoaderObject(this.afterUpdate,this,true);var a3 = this.serverProcessor+(this._user?(getUrlSymbol(this.serverProcessor)+["dhx_user="+this._user,"dhx_version="+this.obj.getUserData(0,"version")].join("&")):"");if (this._tMode!="POST")a2.loadXML(a3+((a3.indexOf("?")!=-1)?"&":"?")+this.serialize(a1,rowId));else
 a2.loadXML(a3,true,this.serialize(a1,rowId));this._waitMode++;},
 sendAllData:function(){if (!this.updatedRows.length)return;this.messages=[];var valid=true;for (var i=0;i<this.updatedRows.length;i++)valid&=this.checkBeforeUpdate(this.updatedRows[i]);if (!valid && !this.callEvent("onValidationError",["",this.messages])) return false;if (this._tSend)this._sendData(this._getAllData());else
 for (var i=0;i<this.updatedRows.length;i++)if (!this._in_progress[this.updatedRows[i]]){if (this.is_invalid(this.updatedRows[i])) continue;this._beforeSendData(this._getRowData(this.updatedRows[i]),this.updatedRows[i]);if (this._waitMode && (this.obj.mytype=="tree" || this.obj._h2)) return;}
 },
 
 
 
 
 
 
 
 
 _getAllData:function(rowId){var out={};var has_one = false;for(var i=0;i<this.updatedRows.length;i++){var id=this.updatedRows[i];if (this._in_progress[id] || this.is_invalid(id)) continue;if (!this.callEvent("onBeforeUpdate",[id,this.getState(id)])) continue;out[id]=this._getRowData(id,id+this.post_delim);has_one = true;this._in_progress[id]=(new Date()).valueOf();}
 return has_one?out:null;},
 
 
 
 setVerificator:function(ind,verifFunction){this.mandatoryFields[ind] = verifFunction||(function(value){return (value!="");});},
 
 clearVerificator:function(ind){this.mandatoryFields[ind] = false;},
 
 
 
 
 
 findRow:function(pattern){var i=0;for(i=0;i<this.updatedRows.length;i++)if(pattern==this.updatedRows[i])break;return i;},

 
 


 





 
 defineAction:function(name,handler){if (!this._uActions)this._uActions=[];this._uActions[name]=handler;},




 
 afterUpdateCallback:function(sid, tid, action, btag) {var marker = sid;var correct=(action!="error" && action!="invalid");if (!correct)this.set_invalid(sid,action);if ((this._uActions)&&(this._uActions[action])&&(!this._uActions[action](btag))) 
 return (delete this._in_progress[marker]);if (this._in_progress[marker]!="wait")this.setUpdated(sid, false);var soid = sid;switch (action) {case "inserted":
 case "insert":
 if (tid != sid){this.obj[this._methods[2]](sid, tid);sid = tid;}
 break;case "delete":
 case "deleted":
 this.obj.setUserData(sid, this.action_param, "true_deleted");this.obj[this._methods[3]](sid);delete this._in_progress[marker];return this.callEvent("onAfterUpdate", [sid, action, tid, btag]);break;}
 
 if (this._in_progress[marker]!="wait"){if (correct)this.obj.setUserData(sid, this.action_param,'');delete this._in_progress[marker];}else {delete this._in_progress[marker];this.setUpdated(tid,true,this.obj.getUserData(sid,this.action_param));}
 
 this.callEvent("onAfterUpdate", [soid, action, tid, btag]);},

 
 afterUpdate:function(that,b,c,d,xml){xml.getXMLTopNode("data");if (!xml.xmlDoc.responseXML)return;var atag=xml.doXPath("//data/action");for (var i=0;i<atag.length;i++){var btag=atag[i];var action = btag.getAttribute("type");var sid = btag.getAttribute("sid");var tid = btag.getAttribute("tid");that.afterUpdateCallback(sid,tid,action,btag);}
 that.finalizeUpdate();},
 finalizeUpdate:function(){if (this._waitMode)this._waitMode--;if ((this.obj.mytype=="tree" || this.obj._h2)&& this.updatedRows.length) 
 this.sendData();this.callEvent("onAfterUpdateFinish",[]);if (!this.updatedRows.length)this.callEvent("onFullSync",[]);},




 
 
 init:function(anObj){this.obj = anObj;if (this.obj._dp_init)this.obj._dp_init(this);},
 
 
 setOnAfterUpdate:function(ev){this.attachEvent("onAfterUpdate",ev);},
 enableDebug:function(mode){},
 setOnBeforeUpdateHandler:function(func){this.attachEvent("onBeforeDataSending",func);},



 
 setAutoUpdate: function(interval, user) {interval = interval || 2000;this._user = user || (new Date()).valueOf();this._need_update = false;this._loader = null;this._update_busy = false;this.attachEvent("onAfterUpdate",function(sid,action,tid,xml_node){this.afterAutoUpdate(sid, action, tid, xml_node);});this.attachEvent("onFullSync",function(){this.fullSync();});var self = this;window.setInterval(function(){self.loadUpdate();}, interval);},


 
 afterAutoUpdate: function(sid, action, tid, xml_node) {if (action == 'collision'){this._need_update = true;return false;}else {return true;}
 },


 
 fullSync: function() {if (this._need_update == true){this._need_update = false;this.loadUpdate();}
 return true;},


 
 getUpdates: function(url,callback){if (this._update_busy)return false;else
 this._update_busy = true;this._loader = this._loader || new dtmlXMLLoaderObject(true);this._loader.async=true;this._loader.waitCall=callback;this._loader.loadXML(url);},


 
 _v: function(node) {if (node.firstChild)return node.firstChild.nodeValue;return "";},


 
 _a: function(arr) {var res = [];for (var i=0;i < arr.length;i++){res[i]=this._v(arr[i]);};return res;},


 
 loadUpdate: function(){var self = this;var version = this.obj.getUserData(0,"version");var url = this.serverProcessor+getUrlSymbol(this.serverProcessor)+["dhx_user="+this._user,"dhx_version="+version].join("&");url = url.replace("editing=true&","");this.getUpdates(url, function(){var vers = self._loader.doXPath("//userdata");self.obj.setUserData(0,"version",self._v(vers[0]));var upds = self._loader.doXPath("//update");if (upds.length){self._silent_mode = true;for (var i=0;i<upds.length;i++){var status = upds[i].getAttribute('status');var id = upds[i].getAttribute('id');var parent = upds[i].getAttribute('parent');switch (status) {case 'inserted':
 self.callEvent("insertCallback",[upds[i], id, parent]);break;case 'updated':
 self.callEvent("updateCallback",[upds[i], id, parent]);break;case 'deleted':
 self.callEvent("deleteCallback",[upds[i], id, parent]);break;}
 }
 
 self._silent_mode = false;}
 
 self._update_busy = false;self = null;});}
};var globalActiveDHTMLGridObject;String.prototype._dhx_trim=function(){return this.replace(/&nbsp;/g, " ").replace(/(^[ \t]*)|([ \t]*$)/g, "");}
function dhtmlxArray(ar){return dhtmlXHeir((ar||new Array()), dhtmlxArray._master);};dhtmlxArray._master={_dhx_find:function(pattern){for (var i = 0;i < this.length;i++){if (pattern == this[i])return i;}
 return -1;},
 _dhx_insertAt:function(ind, value){this[this.length]=null;for (var i = this.length-1;i >= ind;i--)this[i]=this[i-1]
 this[ind]=value
 },
 _dhx_removeAt:function(ind){this.splice(ind,1)
 },
 _dhx_swapItems:function(ind1, ind2){var tmp = this[ind1];this[ind1]=this[ind2]
 this[ind2]=tmp;}
}
function dhtmlXGridObject(id){if (_isIE)try{document.execCommand("BackgroundImageCache", false, true);}
 catch (e){}
 if (id){if (typeof (id)== 'object'){this.entBox=id
 if (!this.entBox.id)this.entBox.id="cgrid2_"+this.uid();}else
 this.entBox=document.getElementById(id);}else {this.entBox=document.createElement("DIV");this.entBox.id="cgrid2_"+this.uid();}
 this.entBox.innerHTML="";dhtmlxEventable(this);var self = this;this._wcorr=0;this.fontWidth = 7;this.cell=null;this.row=null;this.iconURL="";this.editor=null;this._f2kE=true;this._dclE=true;this.combos=new Array(0);this.defVal=new Array(0);this.rowsAr={};this.rowsBuffer=dhtmlxArray();this.rowsCol=dhtmlxArray();this._data_cache={};this._ecache={}
 this._ud_enabled=true;this.xmlLoader=new dtmlXMLLoaderObject(this.doLoadDetails, this, true, this.no_cashe);this._maskArr=[];this.selectedRows=dhtmlxArray();this.UserData={};this._sizeFix=this._borderFix=0;this.entBox.className+=" gridbox";this.entBox.style.width=this.entBox.getAttribute("width")
 ||(window.getComputedStyle
 ? (this.entBox.style.width||window.getComputedStyle(this.entBox, null)["width"])
 : (this.entBox.currentStyle
 ? this.entBox.currentStyle["width"]
 : this.entBox.style.width||0))
 ||"100%";this.entBox.style.height=this.entBox.getAttribute("height")
 ||(window.getComputedStyle
 ? (this.entBox.style.height||window.getComputedStyle(this.entBox, null)["height"])
 : (this.entBox.currentStyle
 ? this.entBox.currentStyle["height"]
 : this.entBox.style.height||0))
 ||"100%";this.entBox.style.cursor='default';this.entBox.onselectstart=function(){return false
 };var t_creator=function(name){var t=document.createElement("TABLE");t.cellSpacing=t.cellPadding=0;t.style.cssText='width:100%;table-layout:fixed;';t.className=name.substr(2);return t;}
 this.obj=t_creator("c_obj");this.hdr=t_creator("c_hdr");this.hdr.style.marginRight="20px";this.hdr.style.paddingRight="20px";this.objBox=document.createElement("DIV");this.objBox.style.width="100%";this.objBox.style.overflow="auto";this.objBox.appendChild(this.obj);this.objBox.className="objbox";if (dhtmlx.$customScroll)dhtmlx.CustomScroll.enable(this);this.hdrBox=document.createElement("DIV");this.hdrBox.style.width="100%"
 this.hdrBox.style.height="25px";this.hdrBox.style.overflow="hidden";this.hdrBox.className="xhdr";this.preloadImagesAr=new Array(0)

 this.sortImg=document.createElement("IMG")
 this.sortImg.style.display="none";this.hdrBox.appendChild(this.sortImg)
 this.hdrBox.appendChild(this.hdr);this.hdrBox.style.position="relative";this.entBox.appendChild(this.hdrBox);this.entBox.appendChild(this.objBox);this.entBox.grid=this;this.objBox.grid=this;this.hdrBox.grid=this;this.obj.grid=this;this.hdr.grid=this;this.cellWidthPX=[];this.cellWidthPC=[];this.cellWidthType=this.entBox.cellwidthtype||"px";this.delim=this.entBox.delimiter||",";this._csvDelim=",";this.hdrLabels=[];this.columnIds=[];this.columnColor=[];this._hrrar=[];this.cellType=dhtmlxArray();this.cellAlign=[];this.initCellWidth=[];this.fldSort=[];this._srdh=(_isIE && (document.compatMode != "BackCompat") ? 22 : 20);this.imgURL=window.dhx_globalImgPath||"";this.isActive=false;this.isEditable=true;this.useImagesInHeader=false;this.pagingOn=false;this.rowsBufferOutSize=0;dhtmlxEvent(window, "unload", function(){try{if (self.destructor)self.destructor();}
 catch (e){}
 });this.setSkin=function(name){this.skin_name=name;var classname = this.entBox.className.split(" gridbox")[0];this.entBox.className=classname + " gridbox gridbox_"+name;this.skin_h_correction=0;this.enableAlterCss("ev_"+name, "odd_"+name, this.isTreeGrid())
 this._fixAlterCss()

 switch (name){case "clear":
 this._topMb=document.createElement("DIV");this._topMb.className="topMumba";this._topMb.innerHTML="<img style='left:0px' src='"+this.imgURL
 +"skinC_top_left.gif'><img style='right:20px' src='"+this.imgURL+"skinC_top_right.gif'>";this.entBox.appendChild(this._topMb);this._botMb=document.createElement("DIV");this._botMb.className="bottomMumba";this._botMb.innerHTML="<img style='left:0px' src='"+this.imgURL
 +"skinD_bottom_left.gif'><img style='right:20px' src='"+this.imgURL+"skinD_bottom_right.gif'>";this.entBox.appendChild(this._botMb);if (this.entBox.style.position != "absolute")this.entBox.style.position="relative";this.skin_h_correction=20;break;case "dhx_terrace":
 this._srdh=40;this.forceDivInHeader=true;break;case "dhx_skyblue":
 case "dhx_web":
 case "glassy_blue":
 case "dhx_black":
 case "dhx_blue":
 case "modern":
 case "light":
 this._srdh=20;this.forceDivInHeader=true;break;case "xp":
 this.forceDivInHeader=true;if ((_isIE)&&(document.compatMode != "BackCompat"))
 this._srdh=26;else this._srdh=22;break;case "mt":
 if ((_isIE)&&(document.compatMode != "BackCompat"))
 this._srdh=26;else this._srdh=22;break;case "gray":
 if ((_isIE)&&(document.compatMode != "BackCompat"))
 this._srdh=22;break;case "sbdark":
 break;}
 if (_isIE&&this.hdr){var d = this.hdr.parentNode;d.removeChild(this.hdr);d.appendChild(this.hdr);}
 this.setSizes();}
 if (_isIE)this.preventIECaching(true);if (window.dhtmlDragAndDropObject)this.dragger=new dhtmlDragAndDropObject();this._doOnScroll=function(e, mode){this.callEvent("onScroll", [
 this.objBox.scrollLeft,
 this.objBox.scrollTop
 ]);this.doOnScroll(e, mode);}
 
 this.doOnScroll=function(e, mode){this.hdrBox.scrollLeft=this.objBox.scrollLeft;if (this.ftr)this.ftr.parentNode.scrollLeft=this.objBox.scrollLeft;if (mode)return;if (this._srnd){if (this._dLoadTimer)window.clearTimeout(this._dLoadTimer);this._dLoadTimer=window.setTimeout(function(){if (self._update_srnd_view)self._update_srnd_view();}, 100);}
 }
 
 this.attachToObject=function(obj){obj.appendChild(this.globalBox?this.globalBox:this.entBox);this.setSizes();}
 
 this.init=function(fl){if ((this.isTreeGrid())&&(!this._h2)){this._h2=new dhtmlxHierarchy();if ((this._fake)&&(!this._realfake))
 this._fake._h2=this._h2;this._tgc={imgURL: null
 };}
 if (!this._hstyles)return;this.editStop()
 
 this.lastClicked=null;this.resized=null;this.fldSorted=this.r_fldSorted=null;this.cellWidthPX=[];this.cellWidthPC=[];if (this.hdr.rows.length > 0){var temp = this.xmlFileUrl;this.clearAll(true);this.xmlFileUrl = temp;}
 var hdrRow = this.hdr.insertRow(0);for (var i = 0;i < this.hdrLabels.length;i++){hdrRow.appendChild(document.createElement("TH"));hdrRow.childNodes[i]._cellIndex=i;hdrRow.childNodes[i].style.height="0px";}
 if (_isIE && _isIE<8 && document.body.style.msTouchAction == this.undefined)hdrRow.style.position="absolute";else
 hdrRow.style.height='auto';var hdrRow = this.hdr.insertRow(_isKHTML ? 2 : 1);hdrRow._childIndexes=new Array();var col_ex = 0;for (var i = 0;i < this.hdrLabels.length;i++){hdrRow._childIndexes[i]=i-col_ex;if ((this.hdrLabels[i] == this.splitSign)&&(i != 0)){if (_isKHTML)hdrRow.insertCell(i-col_ex);hdrRow.cells[i-col_ex-1].colSpan=(hdrRow.cells[i-col_ex-1].colSpan||1)+1;hdrRow.childNodes[i-col_ex-1]._cellIndex++;col_ex++;hdrRow._childIndexes[i]=i-col_ex;continue;}
 hdrRow.insertCell(i-col_ex);hdrRow.childNodes[i-col_ex]._cellIndex=i;hdrRow.childNodes[i-col_ex]._cellIndexS=i;this.setColumnLabel(i, this.hdrLabels[i]);}
 if (col_ex == 0)hdrRow._childIndexes=null;this._cCount=this.hdrLabels.length;if (_isIE)window.setTimeout(function(){if (self.setSizes)self.setSizes();}, 1);if (!this.obj.firstChild)this.obj.appendChild(document.createElement("TBODY"));var tar = this.obj.firstChild;if (!tar.firstChild){tar.appendChild(document.createElement("TR"));tar=tar.firstChild;if (_isIE && _isIE<8 && document.body.style.msTouchAction == this.undefined)tar.style.position="absolute";else
 tar.style.height='auto';for (var i = 0;i < this.hdrLabels.length;i++){tar.appendChild(document.createElement("TH"));tar.childNodes[i].style.height="0px";}
 }
 this._c_order=null;if (this.multiLine != true)this.obj.className+=" row20px";this.sortImg.style.position="absolute";this.sortImg.style.display="none";this.sortImg.src=this.imgURL+"sort_desc.gif";this.sortImg.defLeft=0;if (this.noHeader){this.hdrBox.style.display='none';}
 else {this.noHeader=false
 }
 if (this._ivizcol)this.setColHidden();this.attachHeader();this.attachHeader(0, 0, "_aFoot");this.setSizes();if (fl)this.parseXML()
 this.obj.scrollTop=0

 if (this.dragAndDropOff)this.dragger.addDragLanding(this.entBox, this);if (this._initDrF)this._initD();if (this._init_point)this._init_point();};this.setColumnSizes=function(gridWidth){var summ = 0;var fcols = [];var fix = 0;for (var i = 0;i < this._cCount;i++){if ((this.initCellWidth[i] == "*")&& !this._hrrar[i]){this._awdth=false;fcols.push(i);continue;}
 if (this.cellWidthType == '%'){if (typeof this.cellWidthPC[i]=="undefined")this.cellWidthPC[i]=this.initCellWidth[i];var cwidth = (gridWidth*this.cellWidthPC[i]/100)||0;if (fix>0.5){cwidth++;fix--;}
 var rwidth = this.cellWidthPX[i]=Math.floor(cwidth);var fix =fix + cwidth - rwidth;}else{if (typeof this.cellWidthPX[i]=="undefined")this.cellWidthPX[i]=this.initCellWidth[i];}
 if (!this._hrrar[i])summ+=this.cellWidthPX[i]*1;}
 
 if (fcols.length){var ms = Math.floor((gridWidth-summ)/fcols.length);if (ms < 0)ms=1;for (var i = 0;i < fcols.length;i++){var next=Math.max((this._drsclmW ? (this._drsclmW[fcols[i]]||0) : 0),ms)
 this.cellWidthPX[fcols[i]]=next;summ+=next;}
 
 if(gridWidth > summ){var last=fcols[fcols.length-1];this.cellWidthPX[last]=this.cellWidthPX[last] + (gridWidth-summ);summ = gridWidth;}
 
 this._setAutoResize();}
 
 
 this.obj.style.width=summ+"px";this.hdr.style.width=summ+"px";if (this.ftr)this.ftr.style.width=summ+"px";this.chngCellWidth();return summ;}
 
 
 this.setSizes=function(){if ((!this.hdr.rows[0])) return;var quirks=this.quirks = (_isIE && document.compatMode=="BackCompat");var outerBorder=(this.entBox.offsetWidth-this.entBox.clientWidth)/2;if (!this.dontSetSizes){if (this.globalBox){var splitOuterBorder=(this.globalBox.offsetWidth-this.globalBox.clientWidth)/2;if (this._delta_x && !this._realfake){var ow = this.globalBox.clientWidth;this.globalBox.style.width=this._delta_x;this.entBox.style.width=Math.max(0,(this.globalBox.clientWidth+(quirks?splitOuterBorder*2:0))-this._fake.entBox.clientWidth)+"px";if (ow != this.globalBox.clientWidth){this._fake._correctSplit(this._fake.entBox.clientWidth);}
 }
 if (this._delta_y && !this._realfake){this.globalBox.style.height = this._delta_y;this.entBox.style.overflow = this._fake.entBox.style.overflow="hidden";this.entBox.style.height = this._fake.entBox.style.height=this.globalBox.clientHeight+(quirks?splitOuterBorder*2:0)+"px";}
 }else {if (this._delta_x){if (this.entBox.parentNode && this.entBox.parentNode.tagName=="TD"){this.entBox.style.width="1px";this.entBox.style.width=parseInt(this._delta_x)*this.entBox.parentNode.clientWidth/100-outerBorder*2+"px";}else
 this.entBox.style.width=this._delta_x;}
 if (this._delta_y)this.entBox.style.height=this._delta_y;}
 }
 
 
 window.clearTimeout(this._sizeTime);if (!this.entBox.offsetWidth && (!this.globalBox || !this.globalBox.offsetWidth)){this._sizeTime=window.setTimeout(function(){if (self.setSizes)self.setSizes();}, 250);return;}
 
 var border_x = ((!this._wthB) && ((this.entBox.cmp||this._delta_x) && (this.skin_name||"").indexOf("dhx")==0 && !quirks)?2:0);var border_y = ((!this._wthB) && ((this.entBox.cmp||this._delta_y) && (this.skin_name||"").indexOf("dhx")==0 && !quirks)?2:0);if (this._sizeFix){border_x -= this._sizeFix;border_y -= this._sizeFix;}
 
 var isVScroll = this.parentGrid?false:(this.objBox.scrollHeight > this.objBox.offsetHeight);var scrfix = dhtmlx.$customScroll?0:18;var gridWidth=this.entBox.clientWidth-(this.skin_h_correction||0)*(quirks?0:1)-border_x;var gridWidthActive=this.entBox.clientWidth-(this.skin_h_correction||0)-border_x;var gridHeight=this.entBox.clientHeight-border_y;var summ=this.setColumnSizes(gridWidthActive-(isVScroll?scrfix:0)-(this._correction_x||0));var isHScroll = this.parentGrid?false:((this.objBox.scrollWidth > this.objBox.offsetWidth)||(this.objBox.style.overflowX=="scroll"));var headerHeight = this.hdr.clientHeight;var footerHeight = this.ftr?this.ftr.clientHeight:0;var newWidth=gridWidth;var newHeight=gridHeight-headerHeight-footerHeight;if (this._awdth && this._awdth[0] && this._awdth[1]==99999)isHScroll=0;if (this._ahgr){if (this._ahgrMA)newHeight=this.entBox.parentNode.clientHeight-headerHeight-footerHeight;else
 newHeight=this.obj.offsetHeight+(isHScroll?scrfix:0)+(this._correction_y||0);if (this._ahgrM){if (this._ahgrF)newHeight=Math.min(this._ahgrM,newHeight+headerHeight+footerHeight)-headerHeight-footerHeight;else 
 newHeight=Math.min(this._ahgrM,newHeight);}
 if (isVScroll && newHeight>=this.obj.scrollHeight+(isHScroll?scrfix:0)){isVScroll=false;this.setColumnSizes(gridWidthActive-(this._correction_x||0));}
 }
 
 if ((this._awdth)&&(this._awdth[0])){if (this.cellWidthType == '%')this.cellWidthType="px";if (this._fake)summ+=this._fake.entBox.clientWidth;var newWidth=Math.min(Math.max(summ+(isVScroll?scrfix:0),this._awdth[2]),this._awdth[1])+(this._correction_x||0);if (this._fake)newWidth-=this._fake.entBox.clientWidth;}
 newHeight=Math.max(0,newHeight);this._ff_size_delta=(this._ff_size_delta==0.1)?0.2:0.1;if (!_isFF)this._ff_size_delta=0;if (!this.dontSetSizes){this.entBox.style.width=Math.max(0,newWidth+(quirks?2:0)*outerBorder+this._ff_size_delta)+"px";this.entBox.style.height=newHeight+(quirks?2:0)*outerBorder+headerHeight+footerHeight+"px";}
 this.objBox.style.height=newHeight+((quirks&&!isVScroll)?2:0)*outerBorder+"px";this.hdrBox.style.height=headerHeight+"px";if (newHeight != gridHeight)this.doOnScroll(0, !this._srnd);var ext=this["setSizes_"+this.skin_name];if (ext)ext.call(this);this.setSortImgPos();if (headerHeight != this.hdr.clientHeight && this._ahgr)this.setSizes();this.callEvent("onSetSizes",[]);};this.setSizes_clear=function(){var y=this.hdr.offsetHeight;var x=this.entBox.offsetWidth;var y2=y+this.objBox.offsetHeight;this._topMb.style.top=(y||0)+"px";this._topMb.style.width=(x+20)+"px";this._botMb.style.top=(y2-3)+"px";this._botMb.style.width=(x+20)+"px";};this.chngCellWidth=function(){if ((_isOpera)&&(this.ftr))
 this.ftr.width=this.objBox.scrollWidth+"px";var l = this._cCount;for (var i = 0;i < l;i++){this.hdr.rows[0].cells[i].style.width=this.cellWidthPX[i]+"px";this.obj.rows[0].childNodes[i].style.width=this.cellWidthPX[i]+"px";if (this.ftr)this.ftr.rows[0].cells[i].style.width=this.cellWidthPX[i]+"px";}
 }
 
 this.setDelimiter=function(delim){this.delim=delim;}
 
 this.setInitWidthsP=function(wp){this.cellWidthType="%";this.initCellWidth=wp.split(this.delim.replace(/px/gi, ""));if (!arguments[1])this._setAutoResize();}
 
 this._setAutoResize=function(){if (this._realfake)return;var el = window;var self = this;dhtmlxEvent(window,"resize",function(){window.clearTimeout(self._resize_timer);if (self._setAutoResize)self._resize_timer=window.setTimeout(function(){if (self.setSizes)self.setSizes();if (self._fake)self._fake._correctSplit();}, 100);})
 }
 
 this.setInitWidths=function(wp){this.cellWidthType="px";this.initCellWidth=wp.split(this.delim);if (_isFF){for (var i = 0;i < this.initCellWidth.length;i++)if (this.initCellWidth[i] != "*")this.initCellWidth[i]=parseInt(this.initCellWidth[i]);}
 }
 
 this.enableMultiline=function(state){this.multiLine=convertStringToBoolean(state);}
 
 this.enableMultiselect=function(state){this.selMultiRows=convertStringToBoolean(state);}
 
 this.setImagePath=function(path){this.imgURL=path;}
 this.setImagesPath=this.setImagePath;this.setIconPath=function(path){this.iconURL=path;}
 this.setIconsPath=this.setIconPath;this.changeCursorState=function(ev){var el = ev.target||ev.srcElement;if (el.tagName != "TD")el=this.getFirstParentOfType(el, "TD")
 if (!el)return;if ((el.tagName == "TD")&&(this._drsclmn)&&(!this._drsclmn[el._cellIndex]))
 return el.style.cursor="default";var check = (ev.layerX||0)+(((!_isIE)&&(ev.target.tagName == "DIV")) ? el.offsetLeft : 0);if ((el.offsetWidth-(ev.offsetX||(parseInt(this.getPosition(el, this.hdrBox))-check)*-1)) < (_isOpera?20:10)){el.style.cursor="E-resize";}
 else{el.style.cursor="default";}
 if (_isOpera)this.hdrBox.scrollLeft=this.objBox.scrollLeft;}
 
 this.startColResize=function(ev){if (this.resized)this.stopColResize();this.resized=null;var el = ev.target||ev.srcElement;if (el.tagName != "TD")el=this.getFirstParentOfType(el, "TD")
 var x = ev.clientX;var tabW = this.hdr.offsetWidth;var startW = parseInt(el.offsetWidth)

 if (el.tagName == "TD"&&el.style.cursor != "default"){if ((this._drsclmn)&&(!this._drsclmn[el._cellIndex]))
 return;self._old_d_mm=document.body.onmousemove;self._old_d_mu=document.body.onmouseup;document.body.onmousemove=function(e){if (self)self.doColResize(e||window.event, el, startW, x, tabW)
 }
 document.body.onmouseup=function(){if (self)self.stopColResize();}
 }
 }
 
 this.stopColResize=function(){document.body.onmousemove=self._old_d_mm||"";document.body.onmouseup=self._old_d_mu||"";this.setSizes();this.doOnScroll(0, 1)
 this.callEvent("onResizeEnd", [this]);}
 
 this.doColResize=function(ev, el, startW, x, tabW){el.style.cursor="E-resize";this.resized=el;var fcolW = startW+(ev.clientX-x);var wtabW = tabW+(ev.clientX-x)

 if (!(this.callEvent("onResize", [
 el._cellIndex,
 fcolW,
 this
 ])))
 return;if (_isIE)this.objBox.scrollLeft=this.hdrBox.scrollLeft;if (el.colSpan > 1){var a_sizes = new Array();for (var i = 0;i < el.colSpan;i++)a_sizes[i]=Math.round(fcolW*this.hdr.rows[0].childNodes[el._cellIndexS+i].offsetWidth/el.offsetWidth);for (var i = 0;i < el.colSpan;i++)this._setColumnSizeR(el._cellIndexS+i*1, a_sizes[i]);}else
 this._setColumnSizeR(el._cellIndex, fcolW);this.doOnScroll(0, 1);this.setSizes();if (this._fake && this._awdth)this._fake._correctSplit();}
 
 this._setColumnSizeR=function(ind, fcolW){if (fcolW > ((this._drsclmW&&!this._notresize)? (this._drsclmW[ind]||10) : 10)){this.obj.rows[0].childNodes[ind].style.width=fcolW+"px";this.hdr.rows[0].childNodes[ind].style.width=fcolW+"px";if (this.ftr)this.ftr.rows[0].childNodes[ind].style.width=fcolW+"px";if (this.cellWidthType == 'px'){this.cellWidthPX[ind]=fcolW;}
 else {var gridWidth = parseInt(this.entBox.offsetWidth);if (this.objBox.scrollHeight > this.objBox.offsetHeight)gridWidth-=17;var pcWidth = Math.round(fcolW / gridWidth*100)
 this.cellWidthPC[ind]=pcWidth;}
 if (this.sortImg.style.display!="none")this.setSortImgPos();}
 }
 
 this.setSortImgState=function(state, ind, order, row){order=(order||"asc").toLowerCase();if (!convertStringToBoolean(state)){this.sortImg.style.display="none";this.fldSorted=this.r_fldSorted = null;return;}
 if (order == "asc")this.sortImg.src=this.imgURL+"sort_asc.gif";else
 this.sortImg.src=this.imgURL+"sort_desc.gif";this.sortImg.style.display="";this.fldSorted=this.hdr.rows[0].childNodes[ind];var r = this.hdr.rows[row||1];if (!r)return;for (var i = 0;i < r.childNodes.length;i++){if (r.childNodes[i]._cellIndexS == ind){this.r_fldSorted=r.childNodes[i];return this.setSortImgPos();}
 }
 return this.setSortImgState(state,ind,order,(row||1)+1);}
 
 this.setSortImgPos=function(ind, mode, hRowInd, el){if (this._hrrar && this._hrrar[this.r_fldSorted?this.r_fldSorted._cellIndex:ind])return;if (!el){if (!ind)var el = this.r_fldSorted;else
 var el = this.hdr.rows[hRowInd||0].cells[ind];}
 if (el != null){var pos = this.getPosition(el, this.hdrBox)
 var wdth = el.offsetWidth;this.sortImg.style.left=Number(pos[0]+wdth-13)+"px";this.sortImg.defLeft=parseInt(this.sortImg.style.left)
 this.sortImg.style.top=Number(pos[1]+5)+"px";if ((!this.useImagesInHeader)&&(!mode))
 this.sortImg.style.display="inline";this.sortImg.style.left=this.sortImg.defLeft+"px";}
 }
 
 this.setActive=function(fl){if (arguments.length == 0)var fl = true;if (fl == true){if (globalActiveDHTMLGridObject&&(globalActiveDHTMLGridObject != this)){globalActiveDHTMLGridObject.editStop();globalActiveDHTMLGridObject.callEvent("onBlur",[globalActiveDHTMLGridObject]);}
 globalActiveDHTMLGridObject=this;this.isActive=true;}else {this.isActive=false;this.callEvent("onBlur",[this]);}
 };this._doClick=function(ev){var selMethod = 0;var el = this.getFirstParentOfType(_isIE ? ev.srcElement : ev.target, "TD");if (!el)return;var fl = true;if (this.markedCells){var markMethod = 0;if (ev.shiftKey||ev.metaKey){markMethod=1;}
 if (ev.ctrlKey){markMethod=2;}
 this.doMark(el, markMethod);return true;}
 
 

 if (this.selMultiRows != false){if (ev.shiftKey && this.row != null && this.selectedRows.length){selMethod=1;}
 if (ev.ctrlKey||ev.metaKey){selMethod=2;}
 }
 this.doClick(el, fl, selMethod)
 };this._doContClick=function(ev){var el = this.getFirstParentOfType(_isIE ? ev.srcElement : ev.target, "TD");if ((!el)||( typeof (el.parentNode.idd) == "undefined")){this.callEvent("onEmptyClick", [ev]);return true;}
 if (ev.button == 2||(_isMacOS&&ev.ctrlKey)){if (!this.callEvent("onRightClick", [
 el.parentNode.idd,
 el._cellIndex,
 ev
 ])){var z = function(e){(e||event).cancelBubble=true;return false;};(ev.srcElement||ev.target).oncontextmenu=z;return z(ev);}
 if (this._ctmndx){if (!(this.callEvent("onBeforeContextMenu", [
 el.parentNode.idd,
 el._cellIndex,
 this
 ])))
 return true;if (_isIE)ev.srcElement.oncontextmenu=function(){event.cancelBubble=true;return false;};if (this._ctmndx.showContextMenu){var dEl0=window.document.documentElement;var dEl1=window.document.body;var corrector = new Array((dEl0.scrollLeft||dEl1.scrollLeft),(dEl0.scrollTop||dEl1.scrollTop));if (_isIE){var x= ev.clientX+corrector[0];var y = ev.clientY+corrector[1];}else {var x= ev.pageX;var y = ev.pageY;}
 this._ctmndx.showContextMenu(x-1,y-1)
 this.contextID=this._ctmndx.contextMenuZoneId=el.parentNode.idd+"_"+el._cellIndex;this._ctmndx._skip_hide=true;}else {el.contextMenuId=el.parentNode.idd+"_"+el._cellIndex;el.contextMenu=this._ctmndx;el.a=this._ctmndx._contextStart;el.a(el, ev);el.a=null;}
 ev.cancelBubble=true;return false;}
 }
 else if (this._ctmndx){if (this._ctmndx.hideContextMenu)this._ctmndx.hideContextMenu()
 else
 this._ctmndx._contextEnd();}
 return true;}
 
 this.doClick=function(el, fl, selMethod, show){if (!this.selMultiRows)selMethod=0;var psid = this.row ? this.row.idd : 0;this.setActive(true);if (!selMethod)selMethod=0;if (this.cell != null)this.cell.className=this.cell.className.replace(/cellselected/g, "");if (el.tagName == "TD"){if (this.checkEvent("onSelectStateChanged"))
 var initial = this.getSelectedId();var prow = this.row;if (selMethod == 1){var elRowIndex = this.rowsCol._dhx_find(el.parentNode)
 var lcRowIndex = this.rowsCol._dhx_find(this.lastClicked)

 if (elRowIndex > lcRowIndex){var strt = lcRowIndex;var end = elRowIndex;}else {var strt = elRowIndex;var end = lcRowIndex;}
 for (var i = 0;i < this.rowsCol.length;i++)if ((i >= strt&&i <= end)){if (this.rowsCol[i]&&(!this.rowsCol[i]._sRow)){if (this.rowsCol[i].className.indexOf("rowselected")== -1&&this.callEvent("onBeforeSelect", [
 this.rowsCol[i].idd,
 psid
 ])){this.rowsCol[i].className+=" rowselected";this.selectedRows[this.selectedRows.length]=this.rowsCol[i]
 }
 }else {this.clearSelection();return this.doClick(el, fl, 0, show);}
 }
 }else if (selMethod == 2){if (el.parentNode.className.indexOf("rowselected")!= -1){el.parentNode.className=el.parentNode.className.replace(/rowselected/g, "");this.selectedRows._dhx_removeAt(this.selectedRows._dhx_find(el.parentNode))
 var skipRowSelection = true;show = false;}
 }
 this.editStop()
 if (typeof (el.parentNode.idd)== "undefined")
 return true;if ((!skipRowSelection)&&(!el.parentNode._sRow)){if (this.callEvent("onBeforeSelect", [
 el.parentNode.idd,
 psid
 ])){if (this.getSelectedRowId()!= el.parentNode.idd){if (selMethod == 0)this.clearSelection();this.cell=el;if ((prow == el.parentNode)&&(this._chRRS))
 fl=false;this.row=el.parentNode;this.row.className+=" rowselected"
 
 if (this.cell && _isIE && _isIE == 8 ){var next = this.cell.nextSibling;var parent = this.cell.parentNode;parent.removeChild(this.cell)
 parent.insertBefore(this.cell,next);this.cell.setActive();}
 
 if (this.selectedRows._dhx_find(this.row)== -1)
 this.selectedRows[this.selectedRows.length]=this.row;}else {this.cell=el;this.row = el.parentNode;}
 }else fl = false;}

 if (this.cell && this.cell.parentNode.className.indexOf("rowselected")!= -1)
 this.cell.className=this.cell.className.replace(/cellselected/g, "")+" cellselected";if (selMethod != 1)if (!this.row)return;this.lastClicked=el.parentNode;var rid = this.row.idd;var cid = this.cell;if (fl&& typeof (rid)!= "undefined" && cid && !skipRowSelection) {self.onRowSelectTime=setTimeout(function(){if (self.callEvent)self.callEvent("onRowSelect", [
 rid,
 cid._cellIndex
 ]);}, 100);}else this.callEvent("onRowSelectRSOnly",[rid]);if (this.checkEvent("onSelectStateChanged")){var afinal = this.getSelectedId();if (initial != afinal)this.callEvent("onSelectStateChanged", [afinal,initial]);}
 }
 this.isActive=true;if (show !== false && this.cell && this.cell.parentNode.idd)this.moveToVisible(this.cell)
 }
 
 this.selectAll=function(){this.clearSelection();var coll = this.rowsBuffer;if (this.pagingOn)coll = this.rowsCol;for (var i = 0;i<coll.length;i ++){this.render_row(i).className+=" rowselected";}
 
 this.selectedRows=dhtmlxArray([].concat(coll));if (this.selectedRows.length){this.row = this.selectedRows[0];this.cell = this.row.cells[0];}
 if ((this._fake)&&(!this._realfake))
 this._fake.selectAll();}
 
 this.selectCell=function(r, cInd, fl, preserve, edit, show){if (!fl)fl=false;if (typeof (r)!= "object")
 r=this.render_row(r)
 if (!r || r==-1)return null;if (r._childIndexes)var c = r.childNodes[r._childIndexes[cInd]];else


 var c = r.childNodes[cInd];if (!c)c=r.childNodes[0];if(!this.markedCells){if (preserve)this.doClick(c, fl, 3, show)
 else
 this.doClick(c, fl, 0, show)
 }
 else 
 this.doMark(c,preserve?2:0);if (edit)this.editCell();}
 
 this.moveToVisible=function(cell_obj, onlyVScroll){if (this.pagingOn){var newPage=Math.floor(this.getRowIndex(cell_obj.parentNode.idd) / this.rowsBufferOutSize)+1;if (newPage!=this.currentPage)this.changePage(newPage);}
 try{if (cell_obj.offsetHeight){var distance = cell_obj.offsetLeft+cell_obj.offsetWidth+20;var scrollLeft = 0;if (distance > (this.objBox.offsetWidth+this.objBox.scrollLeft)){if (cell_obj.offsetLeft > this.objBox.scrollLeft)scrollLeft=cell_obj.offsetLeft-5
 }else if (cell_obj.offsetLeft < this.objBox.scrollLeft){distance-=cell_obj.offsetWidth*2/3;if (distance < this.objBox.scrollLeft)scrollLeft=cell_obj.offsetLeft-5
 }
 
 if ((scrollLeft)&&(!onlyVScroll))
 this.objBox.scrollLeft=scrollLeft;}
 
 if (!cell_obj.offsetHeight){var mask=this._realfake?this._fake.rowsAr[cell_obj.parentNode.idd]:cell_obj.parentNode;distance = this.rowsBuffer._dhx_find(mask)*this._srdh;}
 else
 distance = cell_obj.offsetTop;var distancemax = distance + cell_obj.offsetHeight+38;if (distancemax > (this.objBox.offsetHeight+this.objBox.scrollTop)){var scrollTop = distance;}else if (distance < this.objBox.scrollTop){var scrollTop = distance-5
 }
 if (scrollTop)this.objBox.scrollTop=scrollTop;}
 catch (er){}
 }
 
 this.editCell = function(){if (this.editor&&this.cell == this.editor.cell)return;this.editStop();if ((this.isEditable != true)||(!this.cell))
 return false;var c = this.cell;if (c.parentNode._locked)return false;this.editor=this.cells4(c);if (this.editor != null){if (this.editor.isDisabled()){this.editor=null;return false;}
 if (this.callEvent("onEditCell", [
 0,
 this.row.idd,
 this.cell._cellIndex
 ])!= false&&this.editor.edit){this._Opera_stop=(new Date).valueOf();c.className+=" editable";this.editor.edit();this.callEvent("onEditCell", [
 1,
 this.row.idd,
 this.cell._cellIndex
 ])
 }else {this.editor=null;}
 }
 }
 
 this.editStop=function(mode){if (_isOpera)if (this._Opera_stop){if ((this._Opera_stop*1+50)> (new Date).valueOf())
 return;this._Opera_stop=null;}
 if (this.editor&&this.editor != null){this.editor.cell.className=this.editor.cell.className.replace("editable", "");if (mode){var t = this.editor.val;this.editor.detach();this.editor.setValue(t);this.editor=null;this.callEvent("onEditCancel", [
 this.row.idd,
 this.cell._cellIndex,
 t
 ]);return;}
 if (this.editor.detach())
 this.cell.wasChanged=true;var g = this.editor;this.editor=null;var z = this.callEvent("onEditCell", [
 2,
 this.row.idd,
 this.cell._cellIndex,
 g.getValue(),
 g.val
 ]);if (( typeof (z)== "string")||( typeof (z) == "number"))
 g[g.setImage ? "setLabel" : "setValue"](z);else if (!z)g[g.setImage ? "setLabel" : "setValue"](g.val);if (this._ahgr && this.multiLine)this.setSizes();}
 }
 
 this._nextRowCell=function(row, dir, pos){row=this._nextRow((this._groups?this.rowsCol:this.rowsBuffer)._dhx_find(row), dir);if (!row)return null;return row.childNodes[row._childIndexes ? row._childIndexes[pos] : pos];}
 
 this._getNextCell=function(acell, dir, i){acell=acell||this.cell;var arow = acell.parentNode;if (this._tabOrder){i=this._tabOrder[acell._cellIndex];if (typeof i != "undefined")if (i < 0)acell=this._nextRowCell(arow, dir, Math.abs(i)-1);else
 acell=arow.childNodes[i];}else {var i = acell._cellIndex+dir;if (i >= 0&&i < this._cCount){if (arow._childIndexes)i=arow._childIndexes[acell._cellIndex]+dir;acell=arow.childNodes[i];}else {acell=this._nextRowCell(arow, dir, (dir == 1 ? 0 : (this._cCount-1)));}
 }
 if (!acell){if ((dir == 1)&&this.tabEnd){this.tabEnd.focus();this.tabEnd.focus();this.setActive(false);}
 if ((dir == -1)&&this.tabStart){this.tabStart.focus();this.tabStart.focus();this.setActive(false);}
 return null;}
 

 
 if (acell.style.display != "none"
 &&(!this.smartTabOrder||!this.cells(acell.parentNode.idd, acell._cellIndex).isDisabled()))
 return acell;return this._getNextCell(acell, dir);}
 
 this._nextRow=function(ind, dir){var r = this.render_row(ind+dir);if (!r || r==-1)return null;if (r&&r.style.display == "none")return this._nextRow(ind+dir, dir);return r;}
 
 this.scrollPage=function(dir){if (!this.rowsBuffer.length)return;var master = this._realfake?this._fake:this;var new_ind = Math.floor((master._r_select||this.getRowIndex(this.row.idd)||0)+(dir)*this.objBox.offsetHeight / (this._srdh||20));if (new_ind < 0)new_ind=0;if (new_ind >= this.rowsBuffer.length)new_ind=this.rowsBuffer.length-1;if (this._srnd && !this.rowsBuffer[new_ind]){this.objBox.scrollTop+=Math.floor((dir)*this.objBox.offsetHeight / (this._srdh||20))*(this._srdh||20);if (this._fake)this._fake.objBox.scrollTop = this.objBox.scrollTop;master._r_select=new_ind;}else {this.selectCell(new_ind, this.cell._cellIndex, true, false,false,(this.multiLine || this._srnd));if (!this.multiLine && !this._srnd && !this._realfake){this.objBox.scrollTop=this.getRowById(this.getRowId(new_ind)).offsetTop;if (this._fake)this._fake.objBox.scrollTop = this.objBox.scrollTop;}
 master._r_select=null;}
 }
 
 this.doKey=function(ev){if (!ev)return true;if ((ev.target||ev.srcElement).value !== window.undefined){var zx = (ev.target||ev.srcElement);if ((!zx.parentNode)||(zx.parentNode.className.indexOf("editable") == -1))
 return true;}
 if ((globalActiveDHTMLGridObject)&&(this != globalActiveDHTMLGridObject))
 return globalActiveDHTMLGridObject.doKey(ev);if (this.isActive == false){return true;}
 if (this._htkebl)return true;if (!this.callEvent("onKeyPress", [
 ev.keyCode,
 ev.ctrlKey,
 ev.shiftKey,
 ev
 ]))
 return false;var code = "k"+ev.keyCode+"_"+(ev.ctrlKey ? 1 : 0)+"_"+(ev.shiftKey ? 1 : 0);if (this.cell){if (this._key_events[code]){if (false === this._key_events[code].call(this))
 return true;if (ev.preventDefault)ev.preventDefault();ev.cancelBubble=true;return false;}
 if (this._key_events["k_other"])this._key_events.k_other.call(this, ev);}
 return true;}
 
 
 this.selectRow=function(r, fl, preserve, show){if (typeof (r)!= 'object')
 r=this.render_row(r);this.selectCell(r, 0, fl, preserve, false, show)
 };this.wasDblClicked=function(ev){var el = this.getFirstParentOfType(_isIE ? ev.srcElement : ev.target, "TD");if (el){var rowId = el.parentNode.idd;return this.callEvent("onRowDblClicked", [
 rowId,
 el._cellIndex,
 ev
 ]);}
 }
 
 this._onHeaderClick=function(e, el){var that = this.grid;el=el||that.getFirstParentOfType(_isIE ? event.srcElement : e.target, "TD");if (this.grid.resized == null){if (!(this.grid.callEvent("onHeaderClick", [
 el._cellIndexS,
 (e||window.event)])))
 return false;that.sortField(el._cellIndexS, false, el)

 }
 this.grid.resized = null;}
 
 this.deleteSelectedRows=function(){var num = this.selectedRows.length 

 if (num == 0)return;var tmpAr = this.selectedRows;this.selectedRows=dhtmlxArray()
 for (var i = num-1;i >= 0;i--){var node = tmpAr[i]

 if (!this.deleteRow(node.idd, node)){this.selectedRows[this.selectedRows.length]=node;}
 else {if (node == this.row){var ind = i;}
 }
 }
 if (ind){try{if (ind+1 > this.rowsCol.length)ind--;this.selectCell(ind, 0, true)
 }
 catch (er){this.row=null
 this.cell=null
 }
 }
 }
 
 this.getSelectedRowId=function(){var selAr = new Array(0);var uni = {};for (var i = 0;i < this.selectedRows.length;i++){var id = this.selectedRows[i].idd;if (uni[id])continue;selAr[selAr.length]=id;uni[id]=true;}
 
 if (selAr.length == 0)return null;else
 return selAr.join(this.delim);}
 
 
 this.getSelectedCellIndex=function(){if (this.cell != null)return this.cell._cellIndex;else
 return -1;}
 
 this.getColWidth=function(ind){return parseInt(this.cellWidthPX[ind]);}
 
 this.setColWidth=function(ind, value){if (value == "*")this.initCellWidth[ind] = "*";else {if (this._hrrar[ind])return;if (this.cellWidthType == 'px')this.cellWidthPX[ind]=parseInt(value);else
 this.cellWidthPC[ind]=parseInt(value);}
 this.setSizes();}
 
 this.getRowIndex=function(row_id){for (var i = 0;i < this.rowsBuffer.length;i++)if (this.rowsBuffer[i]&&this.rowsBuffer[i].idd == row_id)return i;return -1;}
 
 this.getRowId=function(ind){return this.rowsBuffer[ind] ? this.rowsBuffer[ind].idd : this.undefined;}
 
 this.setRowId=function(ind, row_id){this.changeRowId(this.getRowId(ind), row_id)
 }
 
 this.changeRowId=function(oldRowId, newRowId){if (oldRowId == newRowId)return;var row = this.rowsAr[oldRowId]
 row.idd=newRowId;if (this.UserData[oldRowId]){this.UserData[newRowId]=this.UserData[oldRowId]
 this.UserData[oldRowId]=null;}
 if (this._h2&&this._h2.get[oldRowId]){this._h2.get[newRowId]=this._h2.get[oldRowId];this._h2.get[newRowId].id=newRowId;delete this._h2.get[oldRowId];}
 this.rowsAr[oldRowId]=null;this.rowsAr[newRowId]=row;for (var i = 0;i < row.childNodes.length;i++)if (row.childNodes[i]._code)row.childNodes[i]._code=this._compileSCL(row.childNodes[i]._val, row.childNodes[i]);if (this._mat_links && this._mat_links[oldRowId]){var a=this._mat_links[oldRowId];delete this._mat_links[oldRowId];for (var c in a)for (var i=0;i < a[c].length;i++)this._compileSCL(a[c][i].original,a[c][i]);}
 
 this.callEvent("onRowIdChange",[oldRowId,newRowId]);}
 
 this.setColumnIds=function(ids){this.columnIds=ids.split(this.delim)
 }
 
 this.setColumnId=function(ind, id){this.columnIds[ind]=id;}
 
 this.getColIndexById=function(id){for (var i = 0;i < this.columnIds.length;i++)if (this.columnIds[i] == id)return i;}
 
 this.getColumnId=function(cin){return this.columnIds[cin];}
 
 
 this.getColumnLabel=function(cin, ind, hdr){var z = (hdr||this.hdr).rows[(ind||0)+1];for (var i=0;i<z.cells.length;i++)if (z.cells[i]._cellIndexS==cin)return (_isIE ? z.cells[i].innerText : z.cells[i].textContent);return "";};this.getColLabel = this.getColumnLabel;this.getFooterLabel=function(cin, ind){return this.getColumnLabel(cin,ind,this.ftr);}
 

 
 this.setRowTextBold=function(row_id){var r=this.getRowById(row_id)
 if (r)r.style.fontWeight="bold";}
 
 this.setRowTextStyle=function(row_id, styleString){var r = this.getRowById(row_id)
 if (!r)return;for (var i = 0;i < r.childNodes.length;i++){var pfix = r.childNodes[i]._attrs["style"]||"";if ((this._hrrar)&&(this._hrrar[i]))
 pfix="display:none;";if (_isIE)r.childNodes[i].style.cssText=pfix+"width:"+r.childNodes[i].style.width+";"+styleString;else
 r.childNodes[i].style.cssText=pfix+"width:"+r.childNodes[i].style.width+";"+styleString;}
 }
 
 this.setRowColor=function(row_id, color){var r = this.getRowById(row_id)

 for (var i = 0;i < r.childNodes.length;i++)r.childNodes[i].bgColor=color;}
 
 this.setCellTextStyle=function(row_id, ind, styleString){var r = this.getRowById(row_id)

 if (!r)return;var cell = r.childNodes[r._childIndexes ? r._childIndexes[ind] : ind];if (!cell)return;var pfix = "";if ((this._hrrar)&&(this._hrrar[ind]))
 pfix="display:none;";if (_isIE)cell.style.cssText=pfix+"width:"+cell.style.width+";"+styleString;else
 cell.style.cssText=pfix+"width:"+cell.style.width+";"+styleString;}
 
 this.setRowTextNormal=function(row_id){var r=this.getRowById(row_id);if (r)r.style.fontWeight="normal";}
 
 this.doesRowExist=function(row_id){if (this.getRowById(row_id)!= null)
 return true
 else
 return false
 }
 


 
 this.getColumnsNum=function(){return this._cCount;}
 
 

 
 this.moveRowUp=function(row_id){var r = this.getRowById(row_id)

 if (this.isTreeGrid())
 return this.moveRowUDTG(row_id, -1);var rInd = this.rowsCol._dhx_find(r)
 if ((r.previousSibling)&&(rInd != 0)){r.parentNode.insertBefore(r, r.previousSibling)
 this.rowsCol._dhx_swapItems(rInd, rInd-1)
 this.setSizes();var bInd=this.rowsBuffer._dhx_find(r);this.rowsBuffer._dhx_swapItems(bInd,bInd-1);if (this._cssEven)this._fixAlterCss(rInd-1);}
 }
 
 this.moveRowDown=function(row_id){var r = this.getRowById(row_id)

 if (this.isTreeGrid())
 return this.moveRowUDTG(row_id, 1);var rInd = this.rowsCol._dhx_find(r);if (r.nextSibling){this.rowsCol._dhx_swapItems(rInd, rInd+1)

 if (r.nextSibling.nextSibling)r.parentNode.insertBefore(r, r.nextSibling.nextSibling)
 else
 r.parentNode.appendChild(r)
 this.setSizes();var bInd=this.rowsBuffer._dhx_find(r);this.rowsBuffer._dhx_swapItems(bInd,bInd+1);if (this._cssEven)this._fixAlterCss(rInd);}
 }
 
 this.getCombo=function(col_ind){if (!this.combos[col_ind]){this.combos[col_ind]=new dhtmlXGridComboObject();}
 return this.combos[col_ind];}
 
 this.setUserData=function(row_id, name, value){if (!row_id)row_id="gridglobaluserdata";if (!this.UserData[row_id])this.UserData[row_id]=new Hashtable()
 this.UserData[row_id].put(name, value)
 }
 
 this.getUserData=function(row_id, name){if (!row_id)row_id="gridglobaluserdata";this.getRowById(row_id);var z = this.UserData[row_id];return (z ? z.get(name) : "");}
 
 this.setEditable=function(fl){this.isEditable=convertStringToBoolean(fl);}
 
 this.selectRowById=function(row_id, multiFL, show, call){if (!call)call=false;this.selectCell(this.getRowById(row_id), 0, call, multiFL, false, show);}
 
 
 this.clearSelection=function(){this.editStop()

 for (var i = 0;i < this.selectedRows.length;i++){var r = this.rowsAr[this.selectedRows[i].idd];if (r)r.className=r.className.replace(/rowselected/g, "");}
 
 this.selectedRows=dhtmlxArray()
 this.row=null;if (this.cell != null){this.cell.className=this.cell.className.replace(/cellselected/g, "");this.cell=null;}
 
 this.callEvent("onSelectionCleared",[]);}
 
 this.copyRowContent=function(from_row_id, to_row_id){var frRow = this.getRowById(from_row_id)

 if (!this.isTreeGrid())
 for (var i = 0;i < frRow.cells.length;i++){this.cells(to_row_id, i).setValue(this.cells(from_row_id, i).getValue())
 }
 else
 this._copyTreeGridRowContent(frRow, from_row_id, to_row_id);if (!_isIE)this.getRowById(from_row_id).cells[0].height=frRow.cells[0].offsetHeight
 }
 
 this.setFooterLabel=function(c, label, ind){return this.setColumnLabel(c,label,ind,this.ftr);};this.setColumnLabel=function(c, label, ind, hdr){var z = (hdr||this.hdr).rows[ind||1];var col = (z._childIndexes ? z._childIndexes[c] : c);if (!z.cells[col])return;if (!this.useImagesInHeader){var hdrHTML = "<div class='hdrcell'>"

 if (label.indexOf('img:[')!= -1){var imUrl = label.replace(/.*\[([^>]+)\].*/, "$1");label=label.substr(label.indexOf("]")+1, label.length)
 hdrHTML+="<img width='18px' height='18px' align='absmiddle' src='"+imUrl+"' hspace='2'>"
 }
 hdrHTML+=label;hdrHTML+="</div>";z.cells[col].innerHTML=hdrHTML;if (this._hstyles[col])z.cells[col].style.cssText=this._hstyles[col];}else {z.cells[col].style.textAlign="left";z.cells[col].innerHTML="<img src='"+this.imgURL+""+label+"' onerror='this.src = \""+this.imgURL
 +"imageloaderror.gif\"'>";var a = new Image();a.src=this.imgURL+""+label.replace(/(\.[a-z]+)/, ".des$1");this.preloadImagesAr[this.preloadImagesAr.length]=a;var b = new Image();b.src=this.imgURL+""+label.replace(/(\.[a-z]+)/, ".asc$1");this.preloadImagesAr[this.preloadImagesAr.length]=b;}
 if ((label||"").indexOf("#") != -1){var t = label.match(/(^|{)#([^}]+)(}|$)/);if (t){var tn = "_in_header_"+t[2];if (this[tn])this[tn]((this.forceDivInHeader ? z.cells[col].firstChild : z.cells[col]), col, label.split(t[0]));}
 }
 };this.setColLabel = function(a,b,ind,c){return this.setColumnLabel(a,b,(ind||0)+1,c);};this.clearAll=function(header){if (!this.obj.rows[0])return;if (this._h2){this._h2=new dhtmlxHierarchy();if (this._fake){if (this._realfake)this._h2=this._fake._h2;else
 this._fake._h2=this._h2;}
 }
 this.limit=this._limitC=0;this.editStop(true);if (this._dLoadTimer)window.clearTimeout(this._dLoadTimer);if (this._dload){this.objBox.scrollTop=0;this.limit=this._limitC||0;this._initDrF=true;}
 var len = this.rowsCol.length;len=this.obj.rows.length;for (var i = len-1;i > 0;i--){var t_r = this.obj.rows[i];t_r.parentNode.removeChild(t_r);}
 if (header){this._master_row=null;this.obj.rows[0].parentNode.removeChild(this.obj.rows[0]);for (var i = this.hdr.rows.length-1;i >= 0;i--){var t_r = this.hdr.rows[i];t_r.parentNode.removeChild(t_r);}
 if (this.ftr){this.ftr.parentNode.removeChild(this.ftr);this.ftr=null;}
 this._aHead=this.ftr=this.cellWidth=this._aFoot=null;this.cellType=dhtmlxArray();this._hrrar=[];this.columnIds=[];this.combos=[];this._strangeParams=[];this.defVal = [];this._ivizcol = null;}
 
 this.row=null;this.cell=null;this.rowsCol=dhtmlxArray()
 this.rowsAr={};this._RaSeCol=[];this.rowsBuffer=dhtmlxArray()
 this.UserData=[]
 this.selectedRows=dhtmlxArray();if (this.pagingOn || this._srnd)this.xmlFileUrl="";if (this.pagingOn)this.changePage(1);if (this._contextCallTimer)window.clearTimeout(this._contextCallTimer);if (this._sst)this.enableStableSorting(true);this._fillers=this.undefined;this.setSortImgState(false);this.setSizes();this.callEvent("onClearAll", []);}
 
 this.sortField=function(ind, repeatFl, r_el){if (this.getRowsNum()== 0)
 return false;var el = this.hdr.rows[0].cells[ind];if (!el)return;if (el.tagName == "TH"&&(this.fldSort.length-1)>= el._cellIndex
 &&this.fldSort[el._cellIndex] != 'na'){var data=this.getSortingState();var sortType= ( data[0]==ind && data[1]=="asc" ) ? "des" : "asc";if (!this.callEvent("onBeforeSorting", [
 ind,
 this.fldSort[ind],
 sortType
 ]))
 return;this.sortImg.src=this.imgURL+"sort_"+(sortType == "asc" ? "asc" : "desc")+".gif";if (this.useImagesInHeader){var cel = this.hdr.rows[1].cells[el._cellIndex].firstChild;if (this.fldSorted != null){var celT = this.hdr.rows[1].cells[this.fldSorted._cellIndex].firstChild;celT.src=celT.src.replace(/(\.asc\.)|(\.des\.)/, ".");}
 cel.src=cel.src.replace(/(\.[a-z]+)$/, "."+sortType+"$1")
 }
 
 this.sortRows(el._cellIndex, this.fldSort[el._cellIndex], sortType)
 this.fldSorted=el;this.r_fldSorted=r_el;var c = this.hdr.rows[1];var c = r_el.parentNode;var real_el = c._childIndexes ? c._childIndexes[el._cellIndex] : el._cellIndex;this.setSortImgPos(false, false, false, r_el);}
 }
 
 this.setCustomSorting=function(func, col){if (!this._customSorts)this._customSorts=new Array();this._customSorts[col]=( typeof (func) == "string") ? eval(func) : func;this.fldSort[col]="cus";}
 
 this.enableHeaderImages=function(fl){this.useImagesInHeader=fl;}
 
 this.setHeader=function(hdrStr, splitSign, styles){if (typeof (hdrStr)!= "object")
 var arLab = this._eSplit(hdrStr);else
 arLab=[].concat(hdrStr);var arWdth = new Array(0);var arTyp = new dhtmlxArray(0);var arAlg = new Array(0);var arVAlg = new Array(0);var arSrt = new Array(0);for (var i = 0;i < arLab.length;i++){arWdth[arWdth.length]=Math.round(100 / arLab.length);arTyp[arTyp.length]="ed";arAlg[arAlg.length]="left";arVAlg[arVAlg.length]="middle";arSrt[arSrt.length]="na";}
 this.splitSign=splitSign||"#cspan";this.hdrLabels=arLab;this.cellWidth=arWdth;if (!this.initCellWidth.length)this.setInitWidthsP(arWdth.join(this.delim),true);this.cellType=arTyp;this.cellAlign=arAlg;this.cellVAlign=arVAlg;this.fldSort=arSrt;this._hstyles=styles||[];}
 
 this._eSplit=function(str){if (![].push)return str.split(this.delim);var a = "r"+(new Date()).valueOf();var z = this.delim.replace(/([\|\+\*\^])/g, "\\$1")
 return (str||"").replace(RegExp(z, "g"), a).replace(RegExp("\\\\"+a, "g"), this.delim).split(a);}
 
 this.getColType=function(cInd){return this.cellType[cInd];}
 
 this.getColTypeById=function(cID){return this.cellType[this.getColIndexById(cID)];}
 
 this.setColTypes=function(typeStr){this.cellType=dhtmlxArray(typeStr.split(this.delim));this._strangeParams=new Array();for (var i = 0;i < this.cellType.length;i++){if ((this.cellType[i].indexOf("[")!= -1)){var z = this.cellType[i].split(/[\[\]]+/g);this.cellType[i]=z[0];this.defVal[i]=z[1];if (z[1].indexOf("=")== 0){this.cellType[i]="math";this._strangeParams[i]=z[0];}
 }
 if (!window["eXcell_"+this.cellType[i]])dhtmlxError.throwError("Configuration","Incorrect cell type: "+this.cellType[i],[this,this.cellType[i]]);}
 }
 
 this.setColSorting=function(sortStr){this.fldSort=sortStr.split(this.delim)


 for (var i = 0;i < this.fldSort.length;i++)if (((this.fldSort[i]).length > 4)&&( typeof (window[this.fldSort[i]]) == "function")){if (!this._customSorts)this._customSorts=new Array();this._customSorts[i]=window[this.fldSort[i]];this.fldSort[i]="cus";}
 }
 
 this.setColAlign=function(alStr){this.cellAlign=alStr.split(this.delim)
 for (var i=0;i < this.cellAlign.length;i++)this.cellAlign[i]=this.cellAlign[i]._dhx_trim();}
 this.setColVAlign=function(valStr){this.cellVAlign=valStr.split(this.delim)
 }
 this.setNoHeader=function(fl){this.noHeader=convertStringToBoolean(fl);}
 
 this.showRow=function(rowID){this.getRowById(rowID)

 if (this._h2)this.openItem(this._h2.get[rowID].parent.id);var c = this.getRowById(rowID).childNodes[0];while (c&&c.style.display == "none")c=c.nextSibling;if (c)this.moveToVisible(c, true)
 }
 
 this.setStyle=function(ss_header, ss_grid, ss_selCell, ss_selRow){this.ssModifier=[
 ss_header,
 ss_grid,
 ss_selCell,
 ss_selCell,
 ss_selRow
 ];var prefs = ["#"+this.entBox.id+" table.hdr td", "#"+this.entBox.id+" table.obj td",
 "#"+this.entBox.id+" table.obj tr.rowselected td.cellselected",
 "#"+this.entBox.id+" table.obj td.cellselected", "#"+this.entBox.id+" table.obj tr.rowselected td"];var index = 0;while (!_isIE){try{var temp = document.styleSheets[index].cssRules.length;}catch(e) {index++;continue;}
 break;}
 
 for (var i = 0;i < prefs.length;i++)if (this.ssModifier[i]){if (_isIE)document.styleSheets[0].addRule(prefs[i], this.ssModifier[i]);else
 document.styleSheets[index].insertRule(prefs[i]+(" {"+this.ssModifier[i]+" }"), document.styleSheets[index].cssRules.length);}
 }
 
 this.setColumnColor=function(clr){this.columnColor=clr.split(this.delim)
 }
 
 this.enableAlterCss=function(cssE, cssU, perLevel, levelUnique){if (cssE||cssU)this.attachEvent("onGridReconstructed",function(){this._fixAlterCss();if (this._fake)this._fake._fixAlterCss();});this._cssSP=perLevel;this._cssSU=levelUnique;this._cssEven=cssE;this._cssUnEven=cssU;}
 
 this._fixAlterCss=function(ind){if (this._h2 && (this._cssSP || this._cssSU))
 return this._fixAlterCssTGR(ind);if (!this._cssEven && !this._cssUnEven)return;ind=ind||0;var j = ind;for (var i = ind;i < this.rowsCol.length;i++){if (!this.rowsCol[i])continue;if (this.rowsCol[i].style.display != "none"){if (this.rowsCol[i]._cntr){j=1;continue;}
 if (this.rowsCol[i].className.indexOf("rowselected")!= -1){if (j%2 == 1)this.rowsCol[i].className=this._cssUnEven+" rowselected "+(this.rowsCol[i]._css||"");else
 this.rowsCol[i].className=this._cssEven+" rowselected "+(this.rowsCol[i]._css||"");}else {if (j%2 == 1)this.rowsCol[i].className=this._cssUnEven+" "+(this.rowsCol[i]._css||"");else
 this.rowsCol[i].className=this._cssEven+" "+(this.rowsCol[i]._css||"");}
 j++;}
 }
 }
 
 this.clearChangedState=function(){for (var i = 0;i < this.rowsCol.length;i++){var row = this.rowsCol[i];if (row && row.childNodes){var cols = row.childNodes.length;for (var j = 0;j < cols;j++)row.childNodes[j].wasChanged=false;}
 }
 };this.getChangedRows=function(and_added){var res = new Array();this.forEachRow(function(id){var row = this.rowsAr[id];if (row.tagName!="TR")return;var cols = row.childNodes.length;if (and_added && row._added)res[res.length]=row.idd;else
 for (var j = 0;j < cols;j++)if (row.childNodes[j].wasChanged){res[res.length]=row.idd;break;}
 })
 return res.join(this.delim);};this._sUDa=false;this._sAll=false;this.setSerializationLevel=function(userData, fullXML, config, changedAttr, onlyChanged, asCDATA){this._sUDa=userData;this._sAll=fullXML;this._sConfig=config;this._chAttr=changedAttr;this._onlChAttr=onlyChanged;this._asCDATA=asCDATA;}
 this.setSerializableColumns=function(list){if (!list){this._srClmn=null;return;}
 this._srClmn=(list||"").split(",");for (var i = 0;i < this._srClmn.length;i++)this._srClmn[i]=convertStringToBoolean(this._srClmn[i]);}
 
 this._serialise=function(rCol, inner, closed){this.editStop()
 var out = [];var close = "</"+this.xml.s_row+">"

 if (this.isTreeGrid()){this._h2.forEachChildF(0, function(el){var temp = this._serializeRow(this.render_row_tree(-1, el.id));out.push(temp);if (temp)return true;else
 return false;}, this, function(){out.push(close);});}
 else
 for (var i = 0;i < this.rowsBuffer.length;i++)if (this.rowsBuffer[i]){if (this._chAttr && this.rowsBuffer[i]._locator)continue;var temp = this._serializeRow(this.render_row(i));out.push(temp);if (temp)out.push(close);}
 return [out.join("")];}
 
 this._serializeRow=function(r, i){var out = [];var ra = this.xml.row_attrs;var ca = this.xml.cell_attrs;out.push("<"+this.xml.s_row);out.push(" id='"+r.idd+"'");if ((this._sAll)&&this.selectedRows._dhx_find(r) != -1)
 out.push(" selected='1'");if (this._h2&&this._h2.get[r.idd].state == "minus")out.push(" open='1'");if (ra.length)for (var i = 0;i < ra.length;i++)out.push(" "+ra[i]+"='"+r._attrs[ra[i]]+"'");out.push(">");if (this._sUDa&&this.UserData[r.idd]){keysAr=this.UserData[r.idd].getKeys()

 for (var ii = 0;ii < keysAr.length;ii++)out.push("<userdata name='"+keysAr[ii]+"'>"+(this._asCDATA?"<![CDATA[":"")+this.UserData[r.idd].get(keysAr[ii])+(this._asCDATA?"]]>":"")+"</userdata>");}
 
 var changeFl = false;for (var jj = 0;jj < this._cCount;jj++){if ((!this._srClmn)||(this._srClmn[jj])){var zx = this.cells3(r, jj);out.push("<cell");if (ca.length)for (var i = 0;i < ca.length;i++)out.push(" "+ca[i]+"='"+zx.cell._attrs[ca[i]]+"'");zxVal=zx[this._agetm]();if (this._asCDATA)zxVal="<![CDATA["+zxVal+"]]>";if ((this._ecspn)&&(zx.cell.colSpan)&&zx.cell.colSpan > 1)
 out.push(" colspan=\""+zx.cell.colSpan+"\" ");if (this._chAttr){if (zx.wasChanged()){out.push(" changed=\"1\"");changeFl=true;}
 }
 else if ((this._onlChAttr)&&(zx.wasChanged()))
 changeFl=true;if (this._sAll && this.cellType[jj]=="tree")out.push((this._h2 ? (" image='"+this._h2.get[r.idd].image+"'") : "")+">"+zxVal+"</cell>");else
 out.push(">"+zxVal+"</cell>");if ((this._ecspn)&&(zx.cell.colSpan))
 for (var u = 0;u < zx.cell.colSpan-1;u++){out.push("<cell/>");jj++;}
 
 }
 }
 if ((this._onlChAttr)&&(!changeFl)&&(!r._added))
 return "";return out.join("");}
 
 this._serialiseConfig=function(){var out = "<head>";for (var i = 0;i < this.hdr.rows[0].cells.length;i++){if (this._srClmn && !this._srClmn[i])continue;var sort = this.fldSort[i];if (sort == "cus"){sort = this._customSorts[i].toString();sort=sort.replace(/function[\ ]*/,"").replace(/\([^\f]*/,"");}
 out+="<column width='"+this.getColWidth(i)+"' align='"+this.cellAlign[i]+"' type='"+this.cellType[i]
 +"' sort='"+(sort||"na")+"' color='"+this.columnColor[i]+"'"
 +(this.columnIds[i]
 ? (" id='"+this.columnIds[i]+"'")
 : "")+">";if (this._asCDATA)out+="<![CDATA["+this.getHeaderCol(i)+"]]>";else
 out+=this.getHeaderCol(i);var z = this.getCombo(i);if (z)for (var j = 0;j < z.keys.length;j++)out+="<option value='"+z.keys[j]+"'>"+z.values[j]+"</option>";out+="</column>"
 }
 return out+="</head>";}
 
 this.serialize=function(){var out = '<?xml version="1.0"?><rows>';if (this._mathSerialization)this._agetm="getMathValue";else
 this._agetm="getValue";if (this._sUDa&&this.UserData["gridglobaluserdata"]){var keysAr = this.UserData["gridglobaluserdata"].getKeys()

 for (var i = 0;i < keysAr.length;i++)out+="<userdata name='"+keysAr[i]+"'>"+this.UserData["gridglobaluserdata"].get(keysAr[i])
 +"</userdata>";}
 if (this._sConfig)out+=this._serialiseConfig();out+=this._serialise();out+='</rows>';return out;}
 
 this.getPosition=function(oNode, pNode){if (!pNode){var pos = getOffset(oNode);return [pos.left, pos.top];}
 pNode = pNode||document.body;var oCurrentNode = oNode;var iLeft = 0;var iTop = 0;while ((oCurrentNode)&&(oCurrentNode != pNode)){iLeft+=oCurrentNode.offsetLeft-oCurrentNode.scrollLeft;iTop+=oCurrentNode.offsetTop-oCurrentNode.scrollTop;oCurrentNode=oCurrentNode.offsetParent;}
 if (pNode == document.body){if (_isIE){iTop+=document.body.offsetTop||document.documentElement.offsetTop;iLeft+=document.body.offsetLeft||document.documentElement.offsetLeft;}else if (!_isFF){iLeft+=document.body.offsetLeft;iTop+=document.body.offsetTop;}
 }
 return [iLeft, iTop];}
 
 this.getFirstParentOfType=function(obj, tag){while (obj&&obj.tagName != tag&&obj.tagName != "BODY"){obj=obj.parentNode;}
 return obj;}
 
 this.objBox.onscroll=function(){this.grid._doOnScroll();};this.objBox.ontouchend = function(){this.hdrBox.scrollLeft=this.objBox.scrollLeft;};this.hdrBox.onscroll=function(){if (this._try_header_sync)return;this._try_header_sync = true;if (this.grid.objBox.scrollLeft != this.scrollLeft){this.grid.objBox.scrollLeft = this.scrollLeft;}
 this._try_header_sync = false;}
 if ((!_isOpera)||(_OperaRv > 8.5)){this.hdr.onmousemove=function(e){this.grid.changeCursorState(e||window.event);};this.hdr.onmousedown=function(e){return this.grid.startColResize(e||window.event);};}
 this.obj.onmousemove=this._drawTooltip;this.objBox.onclick=function(e){(e||event).cancelBubble=true;};this.obj.onclick=function(e){this.grid._doClick(e||window.event);if (this.grid._sclE)this.grid.editCell(e||window.event);else
 this.grid.editStop();(e||event).cancelBubble=true;};if (_isMacOS){this.entBox.oncontextmenu=function(e){e.cancelBubble=true;e.returnValue=false;var that = this.grid;if (that._realfake)that = that._fake;return that._doContClick(e||window.event);};}else {this.entBox.onmousedown=function(e){return this.grid._doContClick(e||window.event);};this.entBox.oncontextmenu=function(e){if (this.grid._ctmndx)(e||event).cancelBubble=true;return !this.grid._ctmndx;};}
 

 this.obj.ondblclick=function(e){if (!this.grid.wasDblClicked(e||window.event)) 
 return false;if (this.grid._dclE){var row = this.grid.getFirstParentOfType((_isIE?event.srcElement:e.target),"TR");if (row == this.grid.row)this.grid.editCell(e||window.event);}
 (e||event).cancelBubble=true;if (_isOpera)return false;};this.hdr.onclick=this._onHeaderClick;this.sortImg.onclick=function(){self._onHeaderClick.apply({grid: self
 }, [
 null,
 self.r_fldSorted
 ]);};this.hdr.ondblclick=this._onHeaderDblClick;if (!document.body._dhtmlxgrid_onkeydown){dhtmlxEvent(document, "keydown",function(e){if (globalActiveDHTMLGridObject)return globalActiveDHTMLGridObject.doKey(e||window.event);});document.body._dhtmlxgrid_onkeydown=true;}
 dhtmlxEvent(document.body, "click", function(){if (self.editStop)self.editStop();if (self.isActive)self.setActive(false);});this.entBox.onbeforeactivate=function(){this._still_active=null;this.grid.setActive();event.cancelBubble=true;};this.entBox.onbeforedeactivate=function(){if (this.grid._still_active)this.grid._still_active=null;else 
 this.grid.isActive=false;event.cancelBubble=true;};if (this.entBox.style.height.toString().indexOf("%") != -1)
 this._delta_y = this.entBox.style.height;if (this.entBox.style.width.toString().indexOf("%") != -1)
 this._delta_x = this.entBox.style.width;if (this._delta_x||this._delta_y)this._setAutoResize();this.setColHidden=this.setColumnsVisibility
 this.enableCollSpan = this.enableColSpan
 this.setMultiselect=this.enableMultiselect;this.setMultiLine=this.enableMultiline;this.deleteSelectedItem=this.deleteSelectedRows;this.getSelectedId=this.getSelectedRowId;this.getHeaderCol=this.getColumnLabel;this.isItemExists=this.doesRowExist;this.getColumnCount=this.getColumnsNum;this.setSelectedRow=this.selectRowById;this.setHeaderCol=this.setColumnLabel;this.preventIECashing=this.preventIECaching;this.enableAutoHeigth=this.enableAutoHeight;this.getUID=this.uid;if (dhtmlx.image_path)this.setImagePath(dhtmlx.image_path);if (dhtmlx.skin)this.setSkin(dhtmlx.skin);return this;}
dhtmlXGridObject.prototype={getRowAttribute: function(id, name){return this.getRowById(id)._attrs[name];},
 setRowAttribute: function(id, name, value){this.getRowById(id)._attrs[name]=value;},
 
 isTreeGrid:function(){return (this.cellType._dhx_find("tree") != -1);},
 

 
 setRowHidden:function(id, state){var f = convertStringToBoolean(state);var row = this.getRowById(id) 
 
 if (!row)return;if (row.expand === "")this.collapseKids(row);if ((state)&&(row.style.display != "none")){row.style.display="none";var z = this.selectedRows._dhx_find(row);if (z != -1){row.className=row.className.replace("rowselected", "");for (var i = 0;i < row.childNodes.length;i++)row.childNodes[i].className=row.childNodes[i].className.replace(/cellselected/g, "");this.selectedRows._dhx_removeAt(z);}
 this.callEvent("onGridReconstructed", []);}
 
 if ((!state)&&(row.style.display == "none")){row.style.display="";this.callEvent("onGridReconstructed", []);}
 this.callEvent("onRowHide",[id, state]);this.setSizes();},
 

 
 setColumnHidden:function(ind, state){if (!this.hdr.rows.length){if (!this._ivizcol)this._ivizcol=[];return this._ivizcol[ind]=state;}
 
 if ((this.fldSorted)&&(this.fldSorted.cellIndex == ind)&&(state))
 this.sortImg.style.display="none";var f = convertStringToBoolean(state);if (f){if (!this._hrrar)this._hrrar=new Array();else if (this._hrrar[ind])return;this._hrrar[ind]="display:none;";this._hideShowColumn(ind, "none");}else {if ((!this._hrrar)||(!this._hrrar[ind]))
 return;this._hrrar[ind]="";this._hideShowColumn(ind, "");}
 
 if ((this.fldSorted)&&(this.fldSorted.cellIndex == ind)&&(!state))
 this.sortImg.style.display="inline";this.setSortImgPos();this.callEvent("onColumnHidden",[ind,state])
 },
 
 
 
 isColumnHidden:function(ind){if ((this._hrrar)&&(this._hrrar[ind]))
 return true;return false;},
 
 setColumnsVisibility:function(list){if (list)this._ivizcol=list.split(this.delim);if (this.hdr.rows.length&&this._ivizcol)for (var i = 0;i < this._ivizcol.length;i++)this.setColumnHidden(i, this._ivizcol[i]);},
 
 _fixHiddenRowsAll:function(pb, ind, prop, state, index){index=index||"_cellIndex";var z = pb.rows.length;for (var i = 0;i < z;i++){var x = pb.rows[i].childNodes;if (x.length != this._cCount){for (var j = 0;j < x.length;j++)if (x[j][index] == ind){x[j].style[prop]=state;break;}
 }else
 x[ind].style[prop]=state;}
 },
 
 _hideShowColumn:function(ind, state){var hind = ind;if (this.hdr.rows[1] && (this.hdr.rows[1]._childIndexes)&&(this.hdr.rows[1]._childIndexes[ind] != ind))
 hind=this.hdr.rows[1]._childIndexes[ind];if (state == "none"){this.hdr.rows[0].cells[ind]._oldWidth=this.hdr.rows[0].cells[ind].style.width||(this.initCellWidth[ind]+"px");this.hdr.rows[0].cells[ind]._oldWidthP=this.cellWidthPC[ind];this.obj.rows[0].cells[ind].style.width="0px";var t={rows:[this.obj.rows[0]]}
 this.forEachRow(function(id){if (this.rowsAr[id].tagName=="TR")t.rows.push(this.rowsAr[id])
 })
 this._fixHiddenRowsAll(t, ind, "display", "none");if (this.isTreeGrid())
 this._fixHiddenRowsAllTG(ind, "none");if ((_isOpera&&_OperaRv < 9)||_isKHTML||(_isFF)){this._fixHiddenRowsAll(this.hdr, ind, "display", "none","_cellIndexS");}
 if (this.ftr)this._fixHiddenRowsAll(this.ftr.childNodes[0], ind, "display", "none");this._fixHiddenRowsAll(this.hdr, ind, "whiteSpace", "nowrap","_cellIndexS");if (!this.cellWidthPX.length&&!this.cellWidthPC.length)this.cellWidthPX=[].concat(this.initCellWidth);if (this.cellWidthPX[ind])this.cellWidthPX[ind]=0;if (this.cellWidthPC[ind])this.cellWidthPC[ind]=0;}else {if (this.hdr.rows[0].cells[ind]._oldWidth){var zrow = this.hdr.rows[0].cells[ind];if (_isOpera||_isKHTML||(_isFF))
 this._fixHiddenRowsAll(this.hdr, ind, "display", "","_cellIndexS");if (this.ftr)this._fixHiddenRowsAll(this.ftr.childNodes[0], ind, "display", "");var t={rows:[this.obj.rows[0]]}
 this.forEachRow(function(id){if (this.rowsAr[id].tagName=="TR")t.rows.push(this.rowsAr[id])
 })
 this._fixHiddenRowsAll(t, ind, "display", "");if (this.isTreeGrid())
 this._fixHiddenRowsAllTG(ind, "");this._fixHiddenRowsAll(this.hdr, ind, "whiteSpace", "normal","_cellIndexS");if (zrow._oldWidthP)this.cellWidthPC[ind]=zrow._oldWidthP;if (zrow._oldWidth)this.cellWidthPX[ind]=parseInt(zrow._oldWidth);}
 }
 this.setSizes();if ((!_isIE)&&(!_isFF)){this.obj.border=1;this.obj.border=0;}
 },




 
 enableColSpan:function(mode){this._ecspn=convertStringToBoolean(mode);},



 
 enableRowsHover:function(mode, cssClass){this._unsetRowHover(false,true);this._hvrCss=cssClass;if (convertStringToBoolean(mode)){if (!this._elmnh){this.obj._honmousemove=this.obj.onmousemove;this.obj.onmousemove=this._setRowHover;if (_isIE)this.obj.onmouseleave=this._unsetRowHover;else
 this.obj.onmouseout=this._unsetRowHover;this._elmnh=true;}
 }else {if (this._elmnh){this.obj.onmousemove=this.obj._honmousemove;if (_isIE)this.obj.onmouseleave=null;else
 this.obj.onmouseout=null;this._elmnh=false;}
 }
 },

 
 enableEditEvents:function(click, dblclick, f2Key){this._sclE=convertStringToBoolean(click);this._dclE=convertStringToBoolean(dblclick);this._f2kE=convertStringToBoolean(f2Key);},
 

 
 enableLightMouseNavigation:function(mode){if (convertStringToBoolean(mode)){if (!this._elmn){this.entBox._onclick=this.entBox.onclick;this.entBox.onclick=function(){return true;};this.obj._onclick=this.obj.onclick;this.obj.onclick=function(e){var c = this.grid.getFirstParentOfType(e ? e.target : event.srcElement, 'TD');if (!c)return;this.grid.editStop();this.grid.doClick(c);this.grid.editCell();(e||event).cancelBubble=true;}
 
 this.obj._onmousemove=this.obj.onmousemove;this.obj.onmousemove=this._autoMoveSelect;this._elmn=true;}
 }else {if (this._elmn){this.entBox.onclick=this.entBox._onclick;this.obj.onclick=this.obj._onclick;this.obj.onmousemove=this.obj._onmousemove;this._elmn=false;}
 }
 },
 
 
 
 _unsetRowHover:function(e, c){if (c)that=this;else
 that=this.grid;if ((that._lahRw)&&(that._lahRw != c)){for (var i = 0;i < that._lahRw.childNodes.length;i++)that._lahRw.childNodes[i].className=that._lahRw.childNodes[i].className.replace(that._hvrCss, "");that._lahRw=null;}
 },
 
 
 _setRowHover:function(e){var c = this.grid.getFirstParentOfType(e ? e.target : event.srcElement, 'TD');if (c && c.parentNode!=this.grid._lahRw){this.grid._unsetRowHover(0, c);c=c.parentNode;if (!c.idd || c.idd=="__filler__")return;for (var i = 0;i < c.childNodes.length;i++)c.childNodes[i].className+=" "+this.grid._hvrCss;this.grid._lahRw=c;}
 this._honmousemove(e);},
 
 
 _autoMoveSelect:function(e){if (!this.grid.editor){var c = this.grid.getFirstParentOfType(e ? e.target : event.srcElement, 'TD');if (c.parentNode.idd)this.grid.doClick(c, true, 0);}
 this._onmousemove(e);},



 
 enableDistributedParsing:function(mode, count, time){if (convertStringToBoolean(mode)){this._ads_count=count||10;this._ads_time=time||250;}else
 this._ads_count=0;},


 
 destructor:function(){this.editStop(true);if (this._sizeTime)this._sizeTime=window.clearTimeout(this._sizeTime);this.entBox.className=(this.entBox.className||"").replace(/gridbox.*/,"");if (this.formInputs)for (var i = 0;i < this.formInputs.length;i++)this.parentForm.removeChild(this.formInputs[i]);var a;this.xmlLoader=this.xmlLoader.destructor();for (var i = 0;i < this.rowsCol.length;i++)if (this.rowsCol[i])this.rowsCol[i].grid=null;for (i in this.rowsAr)if (this.rowsAr[i])this.rowsAr[i]=null;this.rowsCol=new dhtmlxArray();this.rowsAr={};this.entBox.innerHTML="";var dummy=function(){};this.entBox.onclick = this.entBox.onmousedown = this.entBox.onbeforeactivate = this.entBox.onbeforedeactivate = this.entBox.onbeforedeactivate = this.entBox.onselectstart = dummy;this.setSizes = this._update_srnd_view = this.callEvent = dummy;this.entBox.grid=this.objBox.grid=this.hdrBox.grid=this.obj.grid=this.hdr.grid=null;if (this._fake){this.globalBox.innerHTML = "";this._fake.setSizes = this._fake._update_srnd_view = this._fake.callEvent = dummy;this.globalBox.onclick = this.globalBox.onmousedown = this.globalBox.onbeforeactivate = this.globalBox.onbeforedeactivate = this.globalBox.onbeforedeactivate = this.globalBox.onselectstart = dummy;}
 
 for (a in this){if ((this[a])&&(this[a].m_obj))
 this[a].m_obj=null;this[a]=null;}
 
 if (this == globalActiveDHTMLGridObject)globalActiveDHTMLGridObject=null;return null;},
 

 
 getSortingState:function(){var z = new Array();if (this.fldSorted){z[0]=this.fldSorted._cellIndex;z[1]=(this.sortImg.src.indexOf("sort_desc.gif") != -1) ? "des" : "asc";}
 return z;},

 
 
 enableAutoHeight:function(mode, maxHeight, countFullHeight){this._ahgr=convertStringToBoolean(mode);this._ahgrF=convertStringToBoolean(countFullHeight);this._ahgrM=maxHeight||null;if (arguments.length == 1){this.objBox.style.overflowY=mode?"hidden":"auto";}
 if (maxHeight == "auto"){this._ahgrM=null;this._ahgrMA=true;this._setAutoResize();}
 },

 enableStableSorting:function(mode){this._sst=convertStringToBoolean(mode);this.rowsCol.stablesort=function(cmp){var size = this.length-1;for (var i = 0;i < this.length-1;i++){for (var j = 0;j < size;j++)if (cmp(this[j], this[j+1])> 0){var temp = this[j];this[j]=this[j+1];this[j+1]=temp;}
 size--;}
 }
 },

 
 
 enableKeyboardSupport:function(mode){this._htkebl=!convertStringToBoolean(mode);},
 

 
 enableContextMenu:function(menu){this._ctmndx=menu;},

 
 
 setScrollbarWidthCorrection:function(width){},

 
 enableTooltips:function(list){this._enbTts=list.split(",");for (var i = 0;i < this._enbTts.length;i++)this._enbTts[i]=convertStringToBoolean(this._enbTts[i]);},

 

 
 enableResizing:function(list){this._drsclmn=list.split(",");for (var i = 0;i < this._drsclmn.length;i++)this._drsclmn[i]=convertStringToBoolean(this._drsclmn[i]);},
 
 
 setColumnMinWidth:function(width, ind){if (arguments.length == 2){if (!this._drsclmW)this._drsclmW=new Array();this._drsclmW[ind]=width;}else
 this._drsclmW=width.split(",");},

 
 
 enableCellIds:function(mode){this._enbCid=convertStringToBoolean(mode);},
 
 

 
 lockRow:function(rowId, mode){var z = this.getRowById(rowId);if (z){z._locked=convertStringToBoolean(mode);if ((this.cell)&&(this.cell.parentNode.idd == rowId))
 this.editStop();}
 },

 
 
 _getRowArray:function(row){var text = new Array();for (var ii = 0;ii < row.childNodes.length;ii++){var a = this.cells3(row, ii);text[ii]=a.getValue();}
 
 return text;},


 
 setDateFormat:function(mask,incoming){this._dtmask=mask;this._dtmask_inc=incoming;},
 
 
 setNumberFormat:function(mask, cInd, p_sep, d_sep){var nmask = mask.replace(/[^0\,\.]*/g, "");var pfix = nmask.indexOf(".");if (pfix > -1)pfix=nmask.length-pfix-1;var dfix = nmask.indexOf(",");if (dfix > -1)dfix=nmask.length-pfix-2-dfix;if (typeof p_sep != "string")p_sep=this.i18n.decimal_separator;if (typeof d_sep != "string")d_sep=this.i18n.group_separator;var pref = mask.split(nmask)[0];var postf = mask.split(nmask)[1];this._maskArr[cInd]=[
 pfix,
 dfix,
 pref,
 postf,
 p_sep,
 d_sep
 ];},
 
 _aplNFb:function(data, ind){var a = this._maskArr[ind];if (!a)return data;var ndata = parseFloat(data.toString().replace(/[^0-9]*/g, ""));if (data.toString().substr(0, 1) == "-")
 ndata=ndata*-1;if (a[0] > 0)ndata=ndata / Math.pow(10, a[0]);return ndata;},
 
 
 _aplNF:function(data, ind){var a = this._maskArr[ind];if (!a)return data;var c = (parseFloat(data) < 0 ? "-" : "")+a[2];data=Math.abs(Math.round(parseFloat(data)*Math.pow(10, a[0] > 0 ? a[0] : 0))).toString();data=(data.length
 < a[0]
 ? Math.pow(10, a[0]+1-data.length).toString().substr(1, a[0]+1)+data.toString()
 : data).split("").reverse();data[a[0]]=(data[a[0]]||"0")+a[4];if (a[1] > 0)for (var j = (a[0] > 0 ? 0 : 1)+a[0]+a[1];j < data.length;j+=a[1])data[j]+=a[5];return c+data.reverse().join("")+a[3];},


 

 
 
 _launchCommands:function(arr){for (var i = 0;i < arr.length;i++){var args = new Array();for (var j = 0;j < arr[i].childNodes.length;j++)if (arr[i].childNodes[j].nodeType == 1)args[args.length]=arr[i].childNodes[j].firstChild.data;this[arr[i].getAttribute("command")].apply(this, args);}
 },
 
 
 
 _parseHead:function(xmlDoc){var hheadCol = this.xmlLoader.doXPath("./head", xmlDoc);if (hheadCol.length){var headCol = this.xmlLoader.doXPath("./column", hheadCol[0]);var asettings = this.xmlLoader.doXPath("./settings", hheadCol[0]);var awidthmet = "setInitWidths";var split = false;if (asettings[0]){for (var s = 0;s < asettings[0].childNodes.length;s++)switch (asettings[0].childNodes[s].tagName){case "colwidth":
 if (asettings[0].childNodes[s].firstChild&&asettings[0].childNodes[s].firstChild.data == "%")awidthmet="setInitWidthsP";break;case "splitat":
 split=(asettings[0].childNodes[s].firstChild ? asettings[0].childNodes[s].firstChild.data : false);break;}
 }
 this._launchCommands(this.xmlLoader.doXPath("./beforeInit/call", hheadCol[0]));if (headCol.length > 0){if (this.hdr.rows.length > 0)this.clearAll(true);var sets = [
 [],
 [],
 [],
 [],
 [],
 [],
 [],
 [],
 []
 ];var attrs = ["", "width", "type", "align", "sort", "color", "format", "hidden", "id"];var calls = ["", awidthmet, "setColTypes", "setColAlign", "setColSorting", "setColumnColor", "",
 "", "setColumnIds"];for (var i = 0;i < headCol.length;i++){for (var j = 1;j < attrs.length;j++)sets[j].push(headCol[i].getAttribute(attrs[j]));sets[0].push((headCol[i].firstChild
 ? headCol[i].firstChild.data
 : "").replace(/^\s*((\s\S)*.+)\s*$/gi, "$1"));};this.setHeader(sets[0]);for (var i = 0;i < calls.length;i++)if (calls[i])this[calls[i]](sets[i].join(this.delim))
 
 for (var i = 0;i < headCol.length;i++){if ((this.cellType[i].indexOf('co')== 0)||(this.cellType[i] == "clist")){var optCol = this.xmlLoader.doXPath("./option", headCol[i]);if (optCol.length){var resAr = new Array();if (this.cellType[i] == "clist"){for (var j = 0;j < optCol.length;j++)resAr[resAr.length]=optCol[j].firstChild
 ? optCol[j].firstChild.data
 : "";this.registerCList(i, resAr);}else {var combo = this.getCombo(i);for (var j = 0;j < optCol.length;j++)combo.put(optCol[j].getAttribute("value"),
 optCol[j].firstChild
 ? optCol[j].firstChild.data
 : "");}
 }
 }
 
 else if (sets[6][i])if ((this.cellType[i].toLowerCase().indexOf("calendar")!=-1)||(this.fldSort[i] == "date"))
 this.setDateFormat(sets[6][i]);else
 this.setNumberFormat(sets[6][i], i);}
 
 this.init();var param=sets[7].join(this.delim);if (this.setColHidden && param.replace(/,/g,"")!="")
 this.setColHidden(param);if ((split)&&(this.splitAt))
 this.splitAt(split);}
 this._launchCommands(this.xmlLoader.doXPath("./afterInit/call", hheadCol[0]));}
 
 var gudCol = this.xmlLoader.doXPath("//rows/userdata", xmlDoc);if (gudCol.length > 0){if (!this.UserData["gridglobaluserdata"])this.UserData["gridglobaluserdata"]=new Hashtable();for (var j = 0;j < gudCol.length;j++){var u_record = "";for (var xj=0;xj < gudCol[j].childNodes.length;xj++)u_record += gudCol[j].childNodes[xj].nodeValue;this.UserData["gridglobaluserdata"].put(gudCol[j].getAttribute("name"),u_record);}
 }
 },
 
 

 
 
 
 getCheckedRows:function(col_ind){var d = new Array();this.forEachRowA(function(id){if (this.cells(id, col_ind).getValue() != 0)
 d.push(id);},true);return d.join(",");},
 
 checkAll:function(){var mode=arguments.length?arguments[0]:1;for (var cInd=0;cInd<this.getColumnsNum();cInd++){if(this.getColType(cInd)=="ch")this.setCheckedRows(cInd,mode)}},
 
 uncheckAll:function(){this.checkAll(0);},
 
 setCheckedRows:function(cInd,v){this.forEachRowA(function(id){if(this.cells(id,cInd).isCheckbox())this.cells(id,cInd).setValue(v)})},

 
 _drawTooltip:function(e){var c = this.grid.getFirstParentOfType(e ? e.target : event.srcElement, 'TD');if (!c || ((this.grid.editor)&&(this.grid.editor.cell == c)))
 return true;var r = c.parentNode;if (!r.idd||r.idd == "__filler__")return;var el = (e ? e.target : event.srcElement);if (r.idd == window.unknown)return true;if (!this.grid.callEvent("onMouseOver", [
 r.idd,
 c._cellIndex,
 (e||window.event)]))
 return true;if ((this.grid._enbTts)&&(!this.grid._enbTts[c._cellIndex])){if (el.title)el.title='';return true;}
 
 if (c._cellIndex >= this.grid._cCount)return;var ced = this.grid.cells3(r, c._cellIndex);if (!ced || !ced.cell || !ced.cell._attrs)return;if (el._title)ced.cell.title="";if (!ced.cell._attrs['title'])el._title=true;if (ced)el.title=ced.cell._attrs['title']
 ||(ced.getTitle
 ? ced.getTitle()
 : (ced.getValue()||"").toString().replace(/<[^>]*>/gi, ""));return true;},

 
 enableCellWidthCorrection:function(size){if (_isFF)this._wcorr=parseInt(size);},
 
 
 
 getAllRowIds:function(separator){var ar = [];for (var i = 0;i < this.rowsBuffer.length;i++)if (this.rowsBuffer[i])ar.push(this.rowsBuffer[i].idd);return ar.join(separator||this.delim)
 },
 getAllItemIds:function(){return this.getAllRowIds();},
 


 
 
 setColspan:function(row_id, col_ind, colspan){if (!this._ecspn)return;var r = this.getRowById(row_id);if ((r._childIndexes)&&(r.childNodes[r._childIndexes[col_ind]])){var j = r._childIndexes[col_ind];var n = r.childNodes[j];var m = n.colSpan;n.colSpan=1;if ((m)&&(m != 1))
 for (var i = 1;i < m;i++){var c = document.createElement("TD");if (n.nextSibling)r.insertBefore(c, n.nextSibling);else
 r.appendChild(c);r._childIndexes[col_ind+i]=j+i;c._cellIndex=col_ind+i;c.style.textAlign=this.cellAlign[i];c.style.verticalAlign=this.cellVAlign[i];n=c;this.cells3(r, col_ind+i).setValue("");}
 
 for (var z = col_ind*1+1*m;z < r._childIndexes.length;z++){r._childIndexes[z]+=(m-1)*1;}
 }
 
 if ((colspan)&&(colspan > 1)){if (r._childIndexes)var j = r._childIndexes[col_ind];else {var j = col_ind;r._childIndexes=new Array();for (var z = 0;z < r.childNodes.length;z++)r._childIndexes[z]=z;}
 
 r.childNodes[j].colSpan=colspan;for (var z = 1;z < colspan;z++){r._childIndexes[r.childNodes[j+1]._cellIndex]=j;r.removeChild(r.childNodes[j+1]);}
 
 var c1 = r.childNodes[r._childIndexes[col_ind]]._cellIndex;for (var z = c1*1+1*colspan;z < r._childIndexes.length;z++)r._childIndexes[z]-=(colspan-1);}
 },
 


 
 
 preventIECaching:function(mode){this.no_cashe=convertStringToBoolean(mode);this.xmlLoader.rSeed=this.no_cashe;},
 enableColumnAutoSize:function(mode){this._eCAS=convertStringToBoolean(mode);},
 
 _onHeaderDblClick:function(e){var that = this.grid;var el = that.getFirstParentOfType(_isIE ? event.srcElement : e.target, "TD");if (!that._eCAS)return false;that.adjustColumnSize(el._cellIndexS)
 },
 
 
 adjustColumnSize:function(cInd, complex){if (this._hrrar && this._hrrar[cInd])return;this._notresize=true;var m = 0;this._setColumnSizeR(cInd, 20);for (var j = 1;j < this.hdr.rows.length;j++){var a = this.hdr.rows[j];a=a.childNodes[(a._childIndexes) ? a._childIndexes[cInd] : cInd];if ((a)&&((!a.colSpan)||(a.colSpan < 2)) && a._cellIndex==cInd){if ((a.childNodes[0])&&(a.childNodes[0].className == "hdrcell"))
 a=a.childNodes[0];m=Math.max(m, a.scrollWidth);}
 }
 
 var l = this.obj.rows.length;for (var i = 1;i < l;i++){var z = this.obj.rows[i];if (!this.rowsAr[z.idd])continue;if (z._childIndexes&&z._childIndexes[cInd] != cInd || !z.childNodes[cInd])continue;if (_isFF||_isOpera||complex)z=z.childNodes[cInd].textContent.length*this.fontWidth;else
 z=z.childNodes[cInd].scrollWidth;if (z > m)m=z;}
 m+=20+(complex||0);this._setColumnSizeR(cInd, m);this._notresize=false;this.setSizes();},
 

 
 detachHeader:function(index, hdr){hdr=hdr||this.hdr;var row = hdr.rows[index+1];if (row)row.parentNode.removeChild(row);this.setSizes();},
 
 
 detachFooter:function(index){this.detachHeader(index, this.ftr);},
 
 
 attachHeader:function(values, style, _type){if (typeof (values)== "string")
 values=this._eSplit(values);if (typeof (style)== "string")
 style=style.split(this.delim);_type=_type||"_aHead";if (this.hdr.rows.length){if (values)this._createHRow([
 values,
 style
 ], this[(_type == "_aHead") ? "hdr" : "ftr"]);else if (this[_type])for (var i = 0;i < this[_type].length;i++)this.attachHeader.apply(this, this[_type][i]);}else {if (!this[_type])this[_type]=new Array();this[_type][this[_type].length]=[
 values,
 style,
 _type
 ];}
 },
 
 _createHRow:function(data, parent){if (!parent){if (this.entBox.style.position!="absolute")this.entBox.style.position="relative";var z = document.createElement("DIV");z.className="c_ftr".substr(2);this.entBox.appendChild(z);var t = document.createElement("TABLE");t.cellPadding=t.cellSpacing=0;if (!_isIE || _isIE == 8){t.width="100%";t.style.paddingRight="20px";}
 t.style.marginRight="20px";t.style.tableLayout="fixed";z.appendChild(t);t.appendChild(document.createElement("TBODY"));this.ftr=parent=t;var hdrRow = t.insertRow(0);var thl = ((this.hdrLabels.length <= 1) ? data[0].length : this.hdrLabels.length);for (var i = 0;i < thl;i++){hdrRow.appendChild(document.createElement("TH"));hdrRow.childNodes[i]._cellIndex=i;}
 
 if (_isIE && _isIE<8)hdrRow.style.position="absolute";else
 hdrRow.style.height='auto';}
 var st1 = data[1];var z = document.createElement("TR");parent.rows[0].parentNode.appendChild(z);for (var i = 0;i < data[0].length;i++){if (data[0][i] == "#cspan"){var pz = z.cells[z.cells.length-1];pz.colSpan=(pz.colSpan||1)+1;continue;}
 
 if ((data[0][i] == "#rspan")&&(parent.rows.length > 1)){var pind = parent.rows.length-2;var found = false;var pz = null;while (!found){var pz = parent.rows[pind];for (var j = 0;j < pz.cells.length;j++)if (pz.cells[j]._cellIndex == i){found=j+1;break;}
 pind--;}
 
 pz=pz.cells[found-1];pz.rowSpan=(pz.rowSpan||1)+1;continue;}
 
 var w = document.createElement("TD");w._cellIndex=w._cellIndexS=i;if (this._hrrar && this._hrrar[i] && !_isIE)w.style.display='none';if (typeof data[0][i] == "object")w.appendChild(data[0][i]);else {if (this.forceDivInHeader)w.innerHTML="<div class='hdrcell'>"+(data[0][i]||"&nbsp;")+"</div>";else
 w.innerHTML=(data[0][i]||"&nbsp;");if ((data[0][i]||"").indexOf("#") != -1){var t = data[0][i].match(/(^|{)#([^}]+)(}|$)/);if (t){var tn = "_in_header_"+t[2];if (this[tn])this[tn]((this.forceDivInHeader ? w.firstChild : w), i, data[0][i].split(t[0]));}
 }
 }
 if (st1)w.style.cssText=st1[i];z.appendChild(w);}
 var self = parent;if (_isKHTML){if (parent._kTimer)window.clearTimeout(parent._kTimer);parent._kTimer=window.setTimeout(function(){parent.rows[1].style.display='none';window.setTimeout(function(){parent.rows[1].style.display='';}, 1);}, 500);}
 },

 
 attachFooter:function(values, style){this.attachHeader(values, style, "_aFoot");},




 
 setCellExcellType:function(rowId, cellIndex, type){this.changeCellType(this.getRowById(rowId), cellIndex, type);},
 
 changeCellType:function(r, ind, type){type=type||this.cellType[ind];var z = this.cells3(r, ind);var v = z.getValue();z.cell._cellType=type;var z = this.cells3(r, ind);z.setValue(v);},
 
 setRowExcellType:function(rowId, type){var z = this.rowsAr[rowId];for (var i = 0;i < z.childNodes.length;i++)this.changeCellType(z, i, type);},
 
 setColumnExcellType:function(colIndex, type){for (var i = 0;i < this.rowsBuffer.length;i++)if (this.rowsBuffer[i] && this.rowsBuffer[i].tagName=="TR")this.changeCellType(this.rowsBuffer[i], colIndex, type);if (this.cellType[colIndex]=="math")this._strangeParams[i]=type;else
 this.cellType[colIndex]=type;},
 



 
 forEachRow:function(custom_code){for (var a in this.rowsAr)if (this.rowsAr[a]&&this.rowsAr[a].idd)custom_code.apply(this, [this.rowsAr[a].idd]);},
 forEachRowA:function(custom_code){for (var a =0;a<this.rowsBuffer.length;a++){if (this.rowsBuffer[a])custom_code.call(this, this.render_row(a).idd);}
 },
 
 forEachCell:function(rowId, custom_code){var z = this.getRowById(rowId);if (!z)return;for (var i = 0;i < this._cCount;i++)custom_code(this.cells3(z, i),i);},
 
 enableAutoWidth:function(mode, max_limit, min_limit){this._awdth=[
 convertStringToBoolean(mode),
 parseInt(max_limit||99999),
 parseInt(min_limit||0)
 ];if (arguments.length == 1)this.objBox.style.overflowX=mode?"hidden":"auto";},

 
 
 updateFromXML:function(url, insert_new, del_missed, afterCall){if (typeof insert_new == "undefined")insert_new=true;this._refresh_mode=[
 true,
 insert_new,
 del_missed
 ];this.load(url,afterCall)
 },
 _refreshFromXML:function(xml){if (this._f_rowsBuffer)this.filterBy(0,"");reset = false;if (window.eXcell_tree){eXcell_tree.prototype.setValueX=eXcell_tree.prototype.setValue;eXcell_tree.prototype.setValue=function(content){var r=this.grid._h2.get[this.cell.parentNode.idd]
 if (r && this.cell.parentNode.valTag){this.setLabel(content);}else
 this.setValueX(content);};}
 
 var tree = this.cellType._dhx_find("tree");xml.getXMLTopNode("rows");var pid = xml.doXPath("//rows")[0].getAttribute("parent")||0;var del = {};if (this._refresh_mode[2]){if (tree != -1)this._h2.forEachChild(pid, function(obj){del[obj.id]=true;}, this);else
 this.forEachRow(function(id){del[id]=true;});}
 
 var rows = xml.doXPath("//row");for (var i = 0;i < rows.length;i++){var row = rows[i];var id = row.getAttribute("id");del[id]=false;var pid = row.parentNode.getAttribute("id")||pid;if (this.rowsAr[id] && this.rowsAr[id].tagName!="TR"){if (this._h2)this._h2.get[id].buff.data=row;else
 this.rowsBuffer[this.getRowIndex(id)].data=row;this.rowsAr[id]=row;}else if (this.rowsAr[id]){this._process_xml_row(this.rowsAr[id], row, -1);this._postRowProcessing(this.rowsAr[id],true)
 }else if (this._refresh_mode[1]){var dadd={idd: id,
 data: row,
 _parser: this._process_xml_row,
 _locator: this._get_xml_data
 };var render_index = this.rowsBuffer.length;if (this._refresh_mode[1]=="top"){this.rowsBuffer.unshift(dadd);render_index = 0;}else
 this.rowsBuffer.push(dadd);if (this._h2){reset=true;(this._h2.add(id,(row.parentNode.getAttribute("id")||row.parentNode.getAttribute("parent")))).buff=this.rowsBuffer[this.rowsBuffer.length-1];}
 
 this.rowsAr[id]=row;row=this.render_row(render_index);this._insertRowAt(row,render_index?-1:0)
 }
 }
 
 if (this._refresh_mode[2])for (id in del){if (del[id]&&this.rowsAr[id])this.deleteRow(id);}
 
 this._refresh_mode=null;if (window.eXcell_tree)eXcell_tree.prototype.setValue=eXcell_tree.prototype.setValueX;if (reset)this._renderSort();if (this._f_rowsBuffer){this._f_rowsBuffer = null;this.filterByAll();}
 },


 
 getCustomCombo:function(id, ind){var cell = this.cells(id, ind).cell;if (!cell._combo)cell._combo=new dhtmlXGridComboObject();return cell._combo;},

 
 setTabOrder:function(order){var t = order.split(this.delim);this._tabOrder=[];var max=this._cCount||order.length;for (var i = 0;i < max;i++)t[i]={c: parseInt(t[i]),
 ind: i
 };t.sort(function(a, b){return (a.c > b.c ? 1 : -1);});for (var i = 0;i < max;i++)if (!t[i+1]||( typeof t[i].c == "undefined"))
 this._tabOrder[t[i].ind]=(t[0].ind+1)*-1;else
 this._tabOrder[t[i].ind]=t[i+1].ind;},
 
 i18n:{loading: "Loading",
 decimal_separator:".",
 group_separator:","
 },
 
 
 _key_events:{k13_1_0: function(){var rowInd = this.rowsCol._dhx_find(this.row)
 this.selectCell(this.rowsCol[rowInd+1], this.cell._cellIndex, true);},
 k13_0_1: function(){var rowInd = this.rowsCol._dhx_find(this.row)
 this.selectCell(this.rowsCol[rowInd-1], this.cell._cellIndex, true);},
 k13_0_0: function(){this.editStop();this.callEvent("onEnter", [
 (this.row ? this.row.idd : null),
 (this.cell ? this.cell._cellIndex : null)
 ]);this._still_active=true;},
 k9_0_0: function(){this.editStop();if (!this.callEvent("onTab",[true])) return true;var z = this._getNextCell(null, 1);if (z){this.selectCell(z.parentNode, z._cellIndex, (this.row != z.parentNode), false, true);this._still_active=true;}
 },
 k9_0_1: function(){this.editStop();if (!this.callEvent("onTab",[false])) return false;var z = this._getNextCell(null, -1);if (z){this.selectCell(z.parentNode, z._cellIndex, (this.row != z.parentNode), false, true);this._still_active=true;}
 },
 k113_0_0: function(){if (this._f2kE)this.editCell();},
 k32_0_0: function(){var c = this.cells4(this.cell);if (!c.changeState||(c.changeState()=== false))
 return false;},
 k27_0_0: function(){this.editStop(true);},
 k33_0_0: function(){if (this.pagingOn)this.changePage(this.currentPage-1);else
 this.scrollPage(-1);},
 k34_0_0: function(){if (this.pagingOn)this.changePage(this.currentPage+1);else
 this.scrollPage(1);},
 k37_0_0: function(){if (!this.editor&&this.isTreeGrid())
 this.collapseKids(this.row)
 else
 return false;},
 k39_0_0: function(){if (!this.editor&&this.isTreeGrid())
 this.expandKids(this.row)
 else
 return false;},
 k40_0_0: function(){var master = this._realfake?this._fake:this;if (this.editor&&this.editor.combo)this.editor.shiftNext();else {if (!this.row.idd)return;var rowInd = Math.max((master._r_select||0),this.getRowIndex(this.row.idd));var row = this._nextRow(rowInd, 1);if (row){master._r_select=null;this.selectCell(row, this.cell._cellIndex, true);if (master.pagingOn)master.showRow(row.idd);}else {if (!this.callEvent("onLastRow", [])) return false;this._key_events.k34_0_0.apply(this, []);if (this.pagingOn && this.rowsCol[rowInd+1])this.selectCell(rowInd+1, 0, true);}
 }
 this._still_active=true;},
 k38_0_0: function(){var master = this._realfake?this._fake:this;if (this.editor&&this.editor.combo)this.editor.shiftPrev();else {if (!this.row.idd)return;var rowInd = this.getRowIndex(this.row.idd)+1;if (rowInd != -1 && (!this.pagingOn || (rowInd!=1))){var nrow = this._nextRow(rowInd-1, -1);this.selectCell(nrow, this.cell._cellIndex, true);if (master.pagingOn && nrow)master.showRow(nrow.idd);}else {this._key_events.k33_0_0.apply(this, []);}
 }
 this._still_active=true;}
 },
 
 
 
 _build_master_row:function(){var t = document.createElement("DIV");var html = ["<table><tr>"];for (var i = 0;i < this._cCount;i++)html.push("<td></td>");html.push("</tr></table>");t.innerHTML=html.join("");this._master_row=t.firstChild.rows[0];},
 
 _prepareRow:function(new_id){if (!this._master_row)this._build_master_row();var r = this._master_row.cloneNode(true);for (var i = 0;i < r.childNodes.length;i++){r.childNodes[i]._cellIndex=i;if (this._enbCid)r.childNodes[i].id="c_"+new_id+"_"+i;if (this.dragAndDropOff)this.dragger.addDraggableItem(r.childNodes[i], this);}
 r.idd=new_id;r.grid=this;return r;},
 

 _process_jsarray_row:function(r, data){r._attrs={};for (var j = 0;j < r.childNodes.length;j++)r.childNodes[j]._attrs={};this._fillRow(r, (this._c_order ? this._swapColumns(data) : data));return r;},
 _get_jsarray_data:function(data, ind){return data[ind];},
 _process_json_row:function(r, data){data = this._c_order ? this._swapColumns(data.data) : data.data;return this._process_some_row(r, data);},
 _process_some_row:function(r,data){r._attrs={};for (var j = 0;j < r.childNodes.length;j++)r.childNodes[j]._attrs={};this._fillRow(r, data);return r;},
 _get_json_data:function(data, ind){return data.data[ind];},


 _process_js_row:function(r, data){var arr = [];for (var i=0;i<this.columnIds.length;i++){arr[i] = data[this.columnIds[i]];if (!arr[i] && arr[i]!==0)arr[i]="";}
 this._process_some_row(r,arr);r._attrs = data;return r;},
 _get_js_data:function(data, ind){return data[this.columnIds[ind]];},
 _process_csv_row:function(r, data){r._attrs={};for (var j = 0;j < r.childNodes.length;j++)r.childNodes[j]._attrs={};this._fillRow(r, (this._c_order ? this._swapColumns(data.split(this.csv.cell)) : data.split(this.csv.cell)));return r;},
 _get_csv_data:function(data, ind){return data.split(this.csv.cell)[ind];},

 _process_store_row:function(row, data){var result = [];for (var i = 0;i < this.columnIds.length;i++)result[i] = data[this.columnIds[i]];for (var j = 0;j < row.childNodes.length;j++)row.childNodes[j]._attrs={};row._attrs = data;this._fillRow(row, result);}, 

 _process_xml_row:function(r, xml){var cellsCol = this.xmlLoader.doXPath(this.xml.cell, xml);var strAr = [];r._attrs=this._xml_attrs(xml);if (this._ud_enabled){var udCol = this.xmlLoader.doXPath("./userdata", xml);for (var i = udCol.length-1;i >= 0;i--){var u_record = "";for (var j=0;j < udCol[i].childNodes.length;j++)u_record += udCol[i].childNodes[j].nodeValue;this.setUserData(r.idd,udCol[i].getAttribute("name"), u_record);}
 }
 
 
 for (var j = 0;j < cellsCol.length;j++){var cellVal = cellsCol[this._c_order?this._c_order[j]:j];if (!cellVal)continue;var cind = r._childIndexes?r._childIndexes[j]:j;var exc = cellVal.getAttribute("type");if (r.childNodes[cind]){if (exc)r.childNodes[cind]._cellType=exc;r.childNodes[cind]._attrs=this._xml_attrs(cellVal);}
 
 if (!cellVal.getAttribute("xmlcontent")){if (cellVal.firstChild)cellVal=cellVal.firstChild.data;else
 cellVal="";}
 
 strAr.push(cellVal);}
 
 for (j < cellsCol.length;j < r.childNodes.length;j++)r.childNodes[j]._attrs={};if (r.parentNode&&r.parentNode.tagName == "row")r._attrs["parent"]=r.parentNode.getAttribute("idd");this._fillRow(r, strAr);return r;},
 _get_xml_data:function(data, ind){data=data.firstChild;while (true){if (!data)return "";if (data.tagName == "cell")ind--;if (ind < 0)break;data=data.nextSibling;}
 return (data.firstChild ? data.firstChild.data : "");},

 _fillRow:function(r, text){if (this.editor)this.editStop();for (var i = 0;i < r.childNodes.length;i++){if ((i < text.length)||(this.defVal[i])){var ii=r.childNodes[i]._cellIndex;var val = text[ii];var aeditor = this.cells4(r.childNodes[i]);if ((this.defVal[ii])&&((val == "")||( typeof (val) == "undefined")))
 val=this.defVal[ii];if (aeditor)aeditor.setValue(val)
 }else {r.childNodes[i].innerHTML="&nbsp;";r.childNodes[i]._clearCell=true;}
 }
 
 return r;},
 
 _postRowProcessing:function(r,donly){if (r._attrs["class"])r._css=r.className=r._attrs["class"];if (r._attrs.locked)r._locked=true;if (r._attrs.bgColor)r.bgColor=r._attrs.bgColor;var cor=0;for (var i = 0;i < r.childNodes.length;i++){var c=r.childNodes[i];var ii=c._cellIndex;var s = c._attrs.style||r._attrs.style;if (s)c.style.cssText+=";"+s;if (c._attrs["class"])c.className=c._attrs["class"];s=c._attrs.align||this.cellAlign[ii];if (s)c.align=s;c.vAlign=c._attrs.valign||this.cellVAlign[ii];var color = c._attrs.bgColor||this.columnColor[ii];if (color)c.bgColor=color;if (c._attrs["colspan"] && !donly){this.setColspan(r.idd, i+cor, c._attrs["colspan"]);cor+=(c._attrs["colspan"]-1);}
 
 if (this._hrrar&&this._hrrar[ii]&&!donly){c.style.display="none";}
 };this.callEvent("onRowCreated", [
 r.idd,
 r,
 null
 ]);},
 
 load:function(url, call, type){this.callEvent("onXLS", [this]);if (arguments.length == 2 && typeof call != "function"){type=call;call=null;}
 type=type||"xml";if (!this.xmlFileUrl)this.xmlFileUrl=url;this._data_type=type;this.xmlLoader.onloadAction=function(that, b, c, d, xml){if (!that.callEvent)return;xml=that["_process_"+type](xml);if (!that._contextCallTimer)that.callEvent("onXLE", [that,0,0,xml]);if (call){call();call=null;}
 }
 this.xmlLoader.loadXML(url);},

 loadXMLString:function(str, afterCall){var t = new dtmlXMLLoaderObject(function(){});t.loadXMLString(str);this.parse(t, afterCall, "xml")
 },

 loadXML:function(url, afterCall){this.load(url, afterCall, "xml")
 },
 
 parse:function(data, call, type){if (arguments.length == 2 && typeof call != "function"){type=call;call=null;}
 type=type||"xml";this._data_type=type;data=this["_process_"+type](data);if (!this._contextCallTimer)this.callEvent("onXLE", [this,0,0,data]);if (call)call();},
 
 xml:{top: "rows",
 row: "./row",
 cell: "./cell",
 s_row: "row",
 s_cell: "cell",
 row_attrs: [],
 cell_attrs: []
 },
 
 csv:{row: "\n",
 cell: ","
 },
 
 _xml_attrs:function(node){var data = {};if (node.attributes.length){for (var i = 0;i < node.attributes.length;i++)data[node.attributes[i].name]=node.attributes[i].value;}
 
 return data;},

 _process_xml:function(xml){if (!xml.doXPath){var t = new dtmlXMLLoaderObject(function(){});if (typeof xml == "string")t.loadXMLString(xml);else {if (xml.responseXML)t.xmlDoc=xml;else
 t.xmlDoc={};t.xmlDoc.responseXML=xml;}
 xml=t;}
 if (this._refresh_mode)return this._refreshFromXML(xml);this._parsing=true;var top = xml.getXMLTopNode(this.xml.top)
 if (top.tagName!=this.xml.top)return;var skey = top.getAttribute("dhx_security");if (skey)dhtmlx.security_key = skey;this._parseHead(top);var rows = xml.doXPath(this.xml.row, top)
 var cr = parseInt(xml.doXPath("//"+this.xml.top)[0].getAttribute("pos")||0);var total = parseInt(xml.doXPath("//"+this.xml.top)[0].getAttribute("total_count")||0);var reset = false;if (total && total!=this.rowsBuffer.length){if (!this.rowsBuffer[total-1]){if (this.rowsBuffer.length)reset=true;this.rowsBuffer[total-1]=null;}
 if (total<this.rowsBuffer.length){this.rowsBuffer.splice(total, this.rowsBuffer.length - total);reset = true;}
 }
 
 
 if (this.isTreeGrid())
 return this._process_tree_xml(xml);for (var i = 0;i < rows.length;i++){if (this.rowsBuffer[i+cr])continue;var id = rows[i].getAttribute("id")||(i+cr+1);this.rowsBuffer[i+cr]={idd: id,
 data: rows[i],
 _parser: this._process_xml_row,
 _locator: this._get_xml_data
 };this.rowsAr[id]=rows[i];}
 this.callEvent("onDataReady", []);if (reset && this._srnd){var h = this.objBox.scrollTop;this._reset_view();this.objBox.scrollTop = h;}else {this.render_dataset();}
 
 this._parsing=false;return xml.xmlDoc.responseXML?xml.xmlDoc.responseXML:xml.xmlDoc;},


 _process_jsarray:function(data){this._parsing=true;if (data&&data.xmlDoc){eval("dhtmlx.temp="+data.xmlDoc.responseText+";");data = dhtmlx.temp;}
 
 for (var i = 0;i < data.length;i++){var id = i+1;this.rowsBuffer.push({idd: id,
 data: data[i],
 _parser: this._process_jsarray_row,
 _locator: this._get_jsarray_data
 });this.rowsAr[id]=data[i];}
 this.render_dataset();this._parsing=false;},
 
 _process_csv:function(data){this._parsing=true;if (data.xmlDoc)data=data.xmlDoc.responseText;data=data.replace(/\r/g,"");data=data.split(this.csv.row);if (this._csvHdr){this.clearAll();var thead=data.splice(0,1)[0].split(this.csv.cell);if (!this._csvAID)thead.splice(0,1);this.setHeader(thead.join(this.delim));this.init();}
 
 for (var i = 0;i < data.length;i++){if (!data[i] && i==data.length-1)continue;if (this._csvAID){var id = i+1;this.rowsBuffer.push({idd: id,
 data: data[i],
 _parser: this._process_csv_row,
 _locator: this._get_csv_data
 });}else {var temp = data[i].split(this.csv.cell);var id = temp.splice(0,1)[0];this.rowsBuffer.push({idd: id,
 data: temp,
 _parser: this._process_jsarray_row,
 _locator: this._get_jsarray_data
 });}
 
 
 this.rowsAr[id]=data[i];}
 this.render_dataset();this._parsing=false;},
 
 _process_js:function(data){return this._process_json(data, "js");},

 _process_json:function(data, mode){this._parsing=true;if (data&&data.xmlDoc){eval("dhtmlx.temp="+data.xmlDoc.responseText+";");data = dhtmlx.temp;}
 
 if (mode == "js"){if (data.data)data = data.data;for (var i = 0;i < data.length;i++){var row = data[i];var id = row.id||(i+1);this.rowsBuffer.push({idd: id,
 data: row,
 _parser: this._process_js_row,
 _locator: this._get_js_data
 });this.rowsAr[id]=data[i];}
 }else {for (var i = 0;i < data.rows.length;i++){var id = data.rows[i].id;this.rowsBuffer.push({idd: id,
 data: data.rows[i],
 _parser: this._process_json_row,
 _locator: this._get_json_data
 });this.rowsAr[id]=data.rows[i];}
 }
 if (data.dhx_security)dhtmlx.security_key = data.dhx_security;this.render_dataset();this._parsing=false;},

 render_dataset:function(min, max){if (this._srnd){if (this._fillers)return this._update_srnd_view();max=Math.min((this._get_view_size()+(this._srnd_pr||0)), this.rowsBuffer.length);}
 
 if (this.pagingOn){min=Math.max((min||0),(this.currentPage-1)*this.rowsBufferOutSize);max=Math.min(this.currentPage*this.rowsBufferOutSize, this.rowsBuffer.length)
 }else {min=min||0;max=max||this.rowsBuffer.length;}
 
 for (var i = min;i < max;i++){var r = this.render_row(i)
 
 if (r == -1){if (this.xmlFileUrl){if (this.callEvent("onDynXLS",[i,(this._dpref?this._dpref:(max-i))]))
 this.load(this.xmlFileUrl+getUrlSymbol(this.xmlFileUrl)+"posStart="+i+"&count="+(this._dpref?this._dpref:(max-i)), this._data_type);}
 max=i;break;}
 
 if (!r.parentNode||!r.parentNode.tagName){this._insertRowAt(r, i);if (r._attrs["selected"] || r._attrs["select"]){this.selectRow(r,r._attrs["call"]?true:false,true);r._attrs["selected"]=r._attrs["select"]=null;}
 }
 
 
 if (this._ads_count && i-min==this._ads_count){var that=this;this._context_parsing=this._context_parsing||this._parsing;return this._contextCallTimer=window.setTimeout(function(){that._contextCallTimer=null;that.render_dataset(i,max);if (!that._contextCallTimer){if(that._context_parsing)that.callEvent("onXLE",[])
 else 
 that._fixAlterCss();that.callEvent("onDistributedEnd",[]);that._context_parsing=false;}
 },this._ads_time)
 }
 }
 
 if (this._srnd&&!this._fillers){var add_count = this.rowsBuffer.length-max;this._fillers = [];while (add_count > 0){var add_step = (_isIE || window._FFrv)?Math.min(add_count, 50000):add_count;var new_filler = this._add_filler(max, add_step);if (new_filler)this._fillers.push(new_filler);add_count -= add_step;max += add_step;}
 }
 
 
 this.setSizes();},
 
 render_row:function(ind){if (!this.rowsBuffer[ind])return -1;if (this.rowsBuffer[ind]._parser){var r = this.rowsBuffer[ind];if (this.rowsAr[r.idd] && this.rowsAr[r.idd].tagName=="TR")return this.rowsBuffer[ind]=this.rowsAr[r.idd];var row = this._prepareRow(r.idd);this.rowsBuffer[ind]=row;this.rowsAr[r.idd]=row;r._parser.call(this, row, r.data);this._postRowProcessing(row);return row;}
 return this.rowsBuffer[ind];},
 
 
 _get_cell_value:function(row, ind, method){if (row._locator){if (this._c_order)ind=this._c_order[ind];return row._locator.call(this, row.data, ind);}
 return this.cells3(row, ind)[method ? method : "getValue"]();},

 
 sortRows:function(col, type, order){order=(order||"asc").toLowerCase();type=(type||this.fldSort[col]);col=col||0;if (this.isTreeGrid())
 this.sortTreeRows(col, type, order);else{var arrTS = {};var atype = this.cellType[col];var amet = "getValue";if (atype == "link")amet="getContent";if (atype == "dhxCalendar"||atype == "dhxCalendarA")amet="getDate";for (var i = 0;i < this.rowsBuffer.length;i++)arrTS[this.rowsBuffer[i].idd]=this._get_cell_value(this.rowsBuffer[i], col, amet);this._sortRows(col, type, order, arrTS);}
 this.callEvent("onAfterSorting", [col,type,order]);},
 
 _sortCore:function(col, type, order, arrTS, s){var sort = "sort";if (this._sst){s["stablesort"]=this.rowsCol.stablesort;sort="stablesort";}
 if (type.length > 4)type=window[type];if (type == 'cus'){var cstr=this._customSorts[col];s[sort](function(a, b){return cstr(arrTS[a.idd], arrTS[b.idd], order, a.idd, b.idd);});}
 else if (typeof (type)== 'function'){s[sort](function(a, b){return type(arrTS[a.idd], arrTS[b.idd], order, a.idd, b.idd);});}
 else


 if (type == 'str'){s[sort](function(a, b){if (order == "asc")return arrTS[a.idd] > arrTS[b.idd] ? 1 : -1
 else
 return arrTS[a.idd] < arrTS[b.idd] ? 1 : -1
 });}
 else if (type == 'int'){s[sort](function(a, b){var aVal = parseFloat(arrTS[a.idd]);aVal=isNaN(aVal) ? -99999999999999 : aVal;var bVal = parseFloat(arrTS[b.idd]);bVal=isNaN(bVal) ? -99999999999999 : bVal;if (order == "asc")return aVal-bVal;else
 return bVal-aVal;});}
 else if (type == 'date'){s[sort](function(a, b){var aVal = Date.parse(arrTS[a.idd])||(Date.parse("01/01/1900"));var bVal = Date.parse(arrTS[b.idd])||(Date.parse("01/01/1900"));if (order == "asc")return aVal-bVal
 else
 return bVal-aVal
 });}
 },
 
 _sortRows:function(col, type, order, arrTS){this._sortCore(col, type, order, arrTS, this.rowsBuffer);this._reset_view();this.callEvent("onGridReconstructed", []);},

 _reset_view:function(skip){if (!this.obj.rows[0])return;if (this._lahRw)this._unsetRowHover(0, true);this.callEvent("onResetView",[]);var tb = this.obj.rows[0].parentNode;var tr = tb.removeChild(tb.childNodes[0], true)
 if (_isKHTML)for (var i = tb.parentNode.childNodes.length-1;i >= 0;i--){if (tb.parentNode.childNodes[i].tagName=="TR")tb.parentNode.removeChild(tb.parentNode.childNodes[i],true);}
 else if (_isIE)for (var i = tb.childNodes.length-1;i >= 0;i--)tb.childNodes[i].removeNode(true);else
 tb.innerHTML="";tb.appendChild(tr)
 this.rowsCol=dhtmlxArray();if (this._sst)this.enableStableSorting(true);this._fillers=this.undefined;if (!skip){if (_isIE && this._srnd){this.render_dataset();}
 else
 this.render_dataset();}
 
 
 },
 
 
 deleteRow:function(row_id, node){if (!node)node=this.getRowById(row_id)
 
 if (!node)return;this.editStop();if (!this._realfake)if (this.callEvent("onBeforeRowDeleted", [row_id])== false)
 return false;var pid=0;if (this.cellType._dhx_find("tree")!= -1 && !this._realfake){pid=this._h2.get[row_id].parent.id;this._removeTrGrRow(node);}
 else {if (node.parentNode)node.parentNode.removeChild(node);var ind = this.rowsCol._dhx_find(node);if (ind != -1)this.rowsCol._dhx_removeAt(ind);for (var i = 0;i < this.rowsBuffer.length;i++)if (this.rowsBuffer[i]&&this.rowsBuffer[i].idd == row_id){this.rowsBuffer._dhx_removeAt(i);ind=i;break;}
 }
 this.rowsAr[row_id]=null;for (var i = 0;i < this.selectedRows.length;i++)if (this.selectedRows[i].idd == row_id)this.selectedRows._dhx_removeAt(i);if (this._srnd){for (var i = 0;i < this._fillers.length;i++){var f = this._fillers[i]
 if (!f)continue;this._update_fillers(i, (f[1] >= ind ? -1 : 0), (f[0] >= ind ? -1 : 0));};this._update_srnd_view();}
 
 if (this.pagingOn)this.changePage();if (!this._realfake)this.callEvent("onAfterRowDeleted", [row_id,pid]);this.callEvent("onGridReconstructed", []);if (this._ahgr)this.setSizes();return true;},
 
 _addRow:function(new_id, text, ind){if (ind == -1|| typeof ind == "undefined")ind=this.rowsBuffer.length;if (typeof text == "string")text=text.split(this.delim);var row = this._prepareRow(new_id);row._attrs={};for (var j = 0;j < row.childNodes.length;j++)row.childNodes[j]._attrs={};this.rowsAr[row.idd]=row;if (this._h2)this._h2.get[row.idd].buff=row;this._fillRow(row, text);this._postRowProcessing(row);if (this._skipInsert){this._skipInsert=false;return this.rowsAr[row.idd]=row;}
 
 if (this.pagingOn){this.rowsBuffer._dhx_insertAt(ind,row);this.rowsAr[row.idd]=row;return row;}
 
 if (this._fillers){this.rowsCol._dhx_insertAt(ind, null);this.rowsBuffer._dhx_insertAt(ind,row);if (this._fake)this._fake.rowsCol._dhx_insertAt(ind, null);this.rowsAr[row.idd]=row;var found = false;for (var i = 0;i < this._fillers.length;i++){var f = this._fillers[i];if (f&&f[0] <= ind&&(f[0]+f[1])>= ind){f[1]=f[1]+1;var nh = f[2].firstChild.style.height=parseInt(f[2].firstChild.style.height)+this._srdh+"px";found=true;if (this._fake){this._fake._fillers[i][1]++;this._fake._fillers[i][2].firstChild.style.height = nh;}
 }
 
 if (f&&f[0] > ind){f[0]=f[0]+1
 if (this._fake)this._fake._fillers[i][0]++;}
 }
 
 if (!found)this._fillers.push(this._add_filler(ind, 1, (ind == 0 ? {parentNode: this.obj.rows[0].parentNode,
 nextSibling: (this.rowsCol[1])
 }: this.rowsCol[ind-1])));return row;}
 this.rowsBuffer._dhx_insertAt(ind,row);return this._insertRowAt(row, ind);},
 
 
 addRow:function(new_id, text, ind){var r = this._addRow(new_id, text, ind);if (!this.dragContext)this.callEvent("onRowAdded", [new_id]);if (this.pagingOn)this.changePage(this.currentPage)
 
 if (this._srnd)this._update_srnd_view();r._added=true;if (this._ahgr)this.setSizes();this.callEvent("onGridReconstructed", []);return r;},
 
 _insertRowAt:function(r, ind, skip){this.rowsAr[r.idd]=r;if (this._skipInsert){this._skipInsert=false;return r;}
 
 if ((ind < 0)||((!ind)&&(parseInt(ind) !== 0)))
 ind=this.rowsCol.length;else {if (ind > this.rowsCol.length)ind=this.rowsCol.length;}
 
 if (this._cssEven){var css = r.className.replace(this._cssUnEven, "");if ((this._cssSP ? this.getLevel(r.idd): ind)%2 == 1)
 r.className+=css+" "+this._cssUnEven+(this._cssSU ? (" "+this._cssUnEven+"_"+this.getLevel(r.idd)) : "");else
 r.className+=css+" "+this._cssEven+(this._cssSU ? (" "+this._cssEven+"_"+this.getLevel(r.idd)) : "");}
 
 if (!skip)if ((ind == (this.obj.rows.length-1))||(!this.rowsCol[ind]))
 if (_isKHTML)this.obj.appendChild(r);else {this.obj.firstChild.appendChild(r);}
 else {this.rowsCol[ind].parentNode.insertBefore(r, this.rowsCol[ind]);}
 
 this.rowsCol._dhx_insertAt(ind, r);this.callEvent("onRowInserted",[r, ind]);return r;},
 
 getRowById:function(id){var row = this.rowsAr[id];if (row){if (row.tagName != "TR"){for (var i = 0;i < this.rowsBuffer.length;i++)if (this.rowsBuffer[i] && this.rowsBuffer[i].idd == id)return this.render_row(i);if (this._h2)return this.render_row(null,row.idd);}
 return row;}
 return null;},
 

 cellById:function(row_id, col){return this.cells(row_id, col);},

 cells:function(row_id, col){if (arguments.length == 0)return this.cells4(this.cell);else
 var c = this.getRowById(row_id);var cell = (c._childIndexes ? c.childNodes[c._childIndexes[col]] : c.childNodes[col]);if (!cell && c._childIndexes)cell = c.firstChild || {};return this.cells4(cell);},
 
 cellByIndex:function(row_index, col){return this.cells2(row_index, col);},
 
 cells2:function(row_index, col){var c = this.render_row(row_index);var cell = (c._childIndexes ? c.childNodes[c._childIndexes[col]] : c.childNodes[col]);if (!cell && c._childIndexes)cell = c.firstChild || {};return this.cells4(cell);},
 
 cells3:function(row, col){var cell = (row._childIndexes ? row.childNodes[row._childIndexes[col]] : row.childNodes[col]);return this.cells4(cell);},
 
 cells4:function(cell){var type = window["eXcell_"+(cell._cellType||this.cellType[cell._cellIndex])];if (type)return new type(cell);}, 
 cells5:function(cell, type){var type = type||(cell._cellType||this.cellType[cell._cellIndex]);if (!this._ecache[type]){if (!window["eXcell_"+type])var tex = eXcell_ro;else
 var tex = window["eXcell_"+type];this._ecache[type]=new tex(cell);}
 this._ecache[type].cell=cell;return this._ecache[type];},
 dma:function(mode){if (!this._ecache)this._ecache={};if (mode&&!this._dma){this._dma=this.cells4;this.cells4=this.cells5;}else if (!mode&&this._dma){this.cells4=this._dma;this._dma=null;}
 },
 
 
 getRowsNum:function(){return this.rowsBuffer.length;},
 
 
 
 enableEditTabOnly:function(mode){if (arguments.length > 0)this.smartTabOrder=convertStringToBoolean(mode);else
 this.smartTabOrder=true;},
 
 setExternalTabOrder:function(start, end){var grid = this;this.tabStart=( typeof (start) == "object") ? start : document.getElementById(start);var oldkeydown_start = this.tabStart.onkeydown;this.tabStart.onkeydown=function(e){if (oldkeydown_start)oldkeydown_start.call(this, e);var ev = (e||window.event);if (ev.keyCode == 9 && !ev.shiftKey){ev.cancelBubble=true;grid.selectCell(0, 0, 0, 0, 1);if (grid.smartTabOrder && grid.cells2(0, 0).isDisabled()){grid._key_events["k9_0_0"].call(grid);}
 this.blur();return false;}
 };if(_isOpera)this.tabStart.onkeypress = this.tabStart.onkeydown;this.tabEnd=( typeof (end) == "object") ? end : document.getElementById(end);var oldkeydown_end= this.tabEnd.onkeydown;this.tabEnd.onkeydown=this.tabEnd.onkeypress=function(e){if (oldkeydown_end)oldkeydown_end.call(this, e);var ev = (e||window.event);if (ev.keyCode == 9 && ev.shiftKey){ev.cancelBubble=true;grid.selectCell((grid.getRowsNum()-1), (grid.getColumnCount()-1), 0, 0, 1);if (grid.smartTabOrder && grid.cells2((grid.getRowsNum()-1), (grid.getColumnCount()-1)).isDisabled()){grid._key_events["k9_0_1"].call(grid);}
 this.blur();return false;}
 };if(_isOpera)this.tabEnd.onkeypress = this.tabEnd.onkeydown;},
 
 uid:function(){if (!this._ui_seed)this._ui_seed=(new Date()).valueOf();return this._ui_seed++;},
 
 clearAndLoad:function(){var t=this._pgn_skin;this._pgn_skin=null;this.clearAll();this._pgn_skin=t;this.load.apply(this,arguments);},
 
 getStateOfView:function(){if (this.pagingOn){var start = (this.currentPage-1)*this.rowsBufferOutSize;return [this.currentPage, start, Math.min(start+this.rowsBufferOutSize,this.rowsBuffer.length), this.rowsBuffer.length ];}
 return [
 Math.floor(this.objBox.scrollTop/this._srdh),
 Math.ceil(parseInt(this.objBox.offsetHeight)/this._srdh),
 this.rowsBuffer.length
 ];}
};(function(){function direct_set(name,value){this[name]=value;}
 function direct_call(name,value){this[name].call(this,value);}
 function joined_call(name,value){this[name].call(this,value.join(this.delim));}
 function set_options(name,value){for (var i=0;i < value.length;i++)if (typeof value[i] == "object"){var combo = this.getCombo(i);for (var key in value[i])combo.put(key, value[i][key]);}
 }
 function header_set(name,value,obj){var rows = 1;var header = [];function add(i,j,value){if (!header[j])header[j]=[];if (typeof value == "object")value.toString=function(){return this.text;}
 header[j][i]=value;}
 
 for (var i=0;i<value.length;i++){if (typeof(value[i])=="object" && value[i].length){for (var j=0;j < value[i].length;j++)add(i,j,value[i][j]);}else
 add(i,0,value[i]);}
 for (var i=0;i<header.length;i++)for (var j=0;j<header[0].length;j++){var h=header[i][j];header[i][j]=(h||"").toString()||"&nbsp;";if (h&&h.colspan)for (var k=1;k < h.colspan;k++)add(j+k,i,"#cspan");if (h&&h.rowspan)for (var k=1;k < h.rowspan;k++)add(j,i+k,"#rspan");}
 
 this.setHeader(header[0]);for (var i=1;i < header.length;i++)this.attachHeader(header[i]);}
 
 
 var columns_map=[
 {name:"label", def:"&nbsp;", operation:"setHeader", type:header_set },
 {name:"id", def:"", operation:"columnIds", type:direct_set },
 {name:"width", def:"*", operation:"setInitWidths", type:joined_call },
 {name:"align", def:"left", operation:"cellAlign", type:direct_set },
 {name:"valign", def:"middle", operation:"cellVAlign", type:direct_set },
 {name:"sort", def:"na", operation:"fldSort", type:direct_set },
 {name:"type", def:"ro", operation:"setColTypes", type:joined_call },
 {name:"options",def:"", operation:"", type:set_options }
 ];dhtmlx.extend_api("dhtmlXGridObject",{_init:function(obj){return [obj.parent];},
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
 },{columns:function(obj){for (var j=0;j<columns_map.length;j++){var settings = [];for (var i=0;i<obj.length;i++)settings[i]=obj[i][columns_map[j].name]||columns_map[j].def;var type=columns_map[j].type||direct_call;type.call(this,columns_map[j].operation,settings,obj);}
 this.init();},
 rows:function(obj){},
 headers:function(obj){for (var i=0;i < obj.length;i++)this.attachHeader(obj[i]);}
 });})();dhtmlXGridObject.prototype._dp_init=function(dp){dp.attachEvent("insertCallback", function(upd, id) {if (this.obj._h2)this.obj.addRow(id, row, null, parent);else
 this.obj.addRow(id, [], 0);var row = this.obj.getRowById(id);if (row){this.obj._process_xml_row(row, upd.firstChild);this.obj._postRowProcessing(row);}
 });dp.attachEvent("updateCallback", function(upd, id) {var row = this.obj.getRowById(id);if (row){this.obj._process_xml_row(row, upd.firstChild);this.obj._postRowProcessing(row);}
 });dp.attachEvent("deleteCallback", function(upd, id) {this.obj.setUserData(id, this.action_param, "true_deleted");this.obj.deleteRow(id);});dp._methods=["setRowTextStyle","setCellTextStyle","changeRowId","deleteRow"];this.attachEvent("onEditCell",function(state,id,index){if (dp._columns && !dp._columns[index])return true;var cell = this.cells(id,index)
 if (state==1){if(cell.isCheckbox()){dp.setUpdated(id,true)
 }
 }else if (state==2){if(cell.wasChanged()){dp.setUpdated(id,true)
 }
 }
 return true;});this.attachEvent("onRowPaste",function(id){dp.setUpdated(id,true)
 });this.attachEvent("onUndo",function(id){dp.setUpdated(id,true)
 });this.attachEvent("onRowIdChange",function(id,newid){var ind=dp.findRow(id);if (ind<dp.updatedRows.length)dp.updatedRows[ind]=newid;});this.attachEvent("onSelectStateChanged",function(rowId){if(dp.updateMode=="row")dp.sendData();return true;});this.attachEvent("onEnter",function(rowId,celInd){if(dp.updateMode=="row")dp.sendData();return true;});this.attachEvent("onBeforeRowDeleted",function(rowId){if (!this.rowsAr[rowId])return true;if (this.dragContext && dp.dnd){window.setTimeout(function(){dp.setUpdated(rowId,true);},1);return true;}
 var z=dp.getState(rowId);if (this._h2){this._h2.forEachChild(rowId,function(el){dp.setUpdated(el.id,false);dp.markRow(el.id,true,"deleted");},this);}
 if (z=="inserted"){dp.set_invalid(rowId,false);dp.setUpdated(rowId,false);return true;}
 if (z=="deleted")return false;if (z=="true_deleted"){dp.setUpdated(rowId,false);return true;}
 dp.setUpdated(rowId,true,"deleted");return false;});this.attachEvent("onBindUpdate", function(id){if (typeof id == "object")id = id.id;dp.setUpdated(id,true);});this.attachEvent("onRowAdded",function(rowId){if (this.dragContext && dp.dnd)return true;dp.setUpdated(rowId,true,"inserted")
 return true;});dp._getRowData=function(rowId,pref){var data = [];data["gr_id"]=rowId;if (this.obj.isTreeGrid())
 data["gr_pid"]=this.obj.getParentId(rowId);var r=this.obj.getRowById(rowId);for (var i=0;i<this.obj._cCount;i++){if (this.obj._c_order)var i_c=this.obj._c_order[i];else
 var i_c=i;var c=this.obj.cells(r.idd,i);if (this._changed && !c.wasChanged()) continue;if (this._endnm)data[this.obj.getColumnId(i)]=c.getValue();else
 data["c"+i_c]=c.getValue();}
 
 var udata=this.obj.UserData[rowId];if (udata){for (var j=0;j<udata.keys.length;j++)if (udata.keys[j] && udata.keys[j].indexOf("__")!=0)
 data[udata.keys[j]]=udata.values[j];}
 var udata=this.obj.UserData["gridglobaluserdata"];if (udata){for (var j=0;j<udata.keys.length;j++)data[udata.keys[j]]=udata.values[j];}
 return data;};dp._clearUpdateFlag=function(rowId){var row=this.obj.getRowById(rowId);if (row)for (var j=0;j<this.obj._cCount;j++)this.obj.cells(rowId,j).cell.wasChanged=false;};dp.checkBeforeUpdate=function(rowId){var valid=true;var c_invalid=[];for (var i=0;i<this.obj._cCount;i++)if (this.mandatoryFields[i]){var res=this.mandatoryFields[i].call(this.obj,this.obj.cells(rowId,i).getValue(),rowId,i);if (typeof res == "string"){this.messages.push(res);valid = false;}else {valid&=res;c_invalid[i]=!res;}
 }
 if (!valid){this.set_invalid(rowId,"invalid",c_invalid);this.setUpdated(rowId,false);}
 return valid;};};function dhtmlXGridCellObject(obj){this.destructor=function(){this.cell.obj=null;this.cell=null;this.grid=null;this.base=null;return null;}
 this.cell=obj;this.getValue=function(){if ((this.cell.firstChild)&&(this.cell.firstChild.tagName == "TEXTAREA"))
 return this.cell.firstChild.value;else
 return this.cell.innerHTML._dhx_trim();}
 
 this.getMathValue=function(){if (this.cell.original)return this.cell.original;else
 return this.getValue();}
 

 
 this.getFont=function(){arOut=new Array(3);if (this.cell.style.fontFamily)arOut[0]=this.cell.style.fontFamily

 if (this.cell.style.fontWeight == 'bold'||this.cell.parentNode.style.fontWeight == 'bold')arOut[1]='bold';if (this.cell.style.fontStyle == 'italic'||this.cell.parentNode.style.fontWeight == 'italic')arOut[1]+='italic';if (this.cell.style.fontSize)arOut[2]=this.cell.style.fontSize
 else
 arOut[2]="";return arOut.join("-")
 }
 
 this.getTextColor=function(){if (this.cell.style.color)return this.cell.style.color
 else
 return "#000000";}
 
 this.getBgColor=function(){if (this.cell.bgColor)return this.cell.bgColor
 else
 return "#FFFFFF";}
 
 this.getHorAlign=function(){if (this.cell.style.textAlign)return this.cell.style.textAlign;else if (this.cell.style.textAlign)return this.cell.style.textAlign;else
 return "left";}
 
 this.getWidth=function(){return this.cell.scrollWidth;}
 
 this.setFont=function(val){fntAr=val.split("-");this.cell.style.fontFamily=fntAr[0];this.cell.style.fontSize=fntAr[fntAr.length-1]

 if (fntAr.length == 3){if (/bold/.test(fntAr[1]))
 this.cell.style.fontWeight="bold";if (/italic/.test(fntAr[1]))
 this.cell.style.fontStyle="italic";if (/underline/.test(fntAr[1]))
 this.cell.style.textDecoration="underline";}
 }
 
 this.setTextColor=function(val){this.cell.style.color=val;}
 
 this.setBgColor=function(val){if (val == "")val=null;this.cell.bgColor=val;}
 
 this.setHorAlign=function(val){if (val.length == 1){if (val == 'c')this.cell.style.textAlign='center'

 else if (val == 'l')this.cell.style.textAlign='left';else
 this.cell.style.textAlign='right';}else
 this.cell.style.textAlign=val
 }
 
 this.wasChanged=function(){if (this.cell.wasChanged)return true;else
 return false;}
 
 this.isCheckbox=function(){var ch = this.cell.firstChild;if (ch&&ch.tagName == 'INPUT'){type=ch.type;if (type == 'radio'||type == 'checkbox')return true;else
 return false;}else
 return false;}
 
 this.isChecked=function(){if (this.isCheckbox()){return this.cell.firstChild.checked;}
 }
 
 this.isDisabled=function(){return this.cell._disabled;}
 
 this.setChecked=function(fl){if (this.isCheckbox()){if (fl != 'true'&&fl != 1)fl=false;this.cell.firstChild.checked=fl;}
 }
 
 this.setDisabled=function(fl){if (fl != 'true'&&fl != 1)fl=false;if (this.isCheckbox()){this.cell.firstChild.disabled=fl;if (this.disabledF)this.disabledF(fl);}
 this.cell._disabled=fl;}
}
dhtmlXGridCellObject.prototype={getAttribute: function(name){return this.cell._attrs[name];},
 setAttribute: function(name, value){this.cell._attrs[name]=value;},
 getInput:function(){if (this.obj && (this.obj.tagName=="INPUT" || this.obj.tagName=="TEXTAREA")) return this.obj;var inps=(this.obj||this.cell).getElementsByTagName("TEXTAREA");if (!inps.length)inps=(this.obj||this.cell).getElementsByTagName("INPUT");return inps[0];}
}
dhtmlXGridCellObject.prototype.setValue=function(val){if (( typeof (val)!= "number")&&(!val||val.toString()._dhx_trim() == "")){val="&nbsp;"
 this.cell._clearCell=true;}else
 this.cell._clearCell=false;this.setCValue(val);}
dhtmlXGridCellObject.prototype.getTitle=function(){return (_isIE ? this.cell.innerText : this.cell.textContent);}
dhtmlXGridCellObject.prototype.setCValue=function(val, val2){this.cell.innerHTML=val;this.grid.callEvent("onCellChanged", [
 this.cell.parentNode.idd,
 this.cell._cellIndex,
 (arguments.length > 1 ? val2 : val)
 ]);}
dhtmlXGridCellObject.prototype.setCTxtValue=function(val){this.cell.innerHTML="";this.cell.appendChild(document.createTextNode(val));this.grid.callEvent("onCellChanged", [
 this.cell.parentNode.idd,
 this.cell._cellIndex,
 val
 ]);}
dhtmlXGridCellObject.prototype.setLabel=function(val){this.cell.innerHTML=val;}
dhtmlXGridCellObject.prototype.getMath=function(){if (this._val)return this.val;else
 return this.getValue();}
function eXcell(){this.obj=null;this.val=null;this.changeState=function(){return false
 }
 
 this.edit=function(){this.val=this.getValue()
 }
 
 this.detach=function(){return false
 }
 
 this.getPosition=function(oNode){var oCurrentNode = oNode;var iLeft = 0;var iTop = 0;while (oCurrentNode.tagName != "BODY"){iLeft+=oCurrentNode.offsetLeft;iTop+=oCurrentNode.offsetTop;oCurrentNode=oCurrentNode.offsetParent;}
 return new Array(iLeft, iTop);}
}
eXcell.prototype=new dhtmlXGridCellObject;function eXcell_ed(cell){if (cell){this.cell=cell;this.grid=this.cell.parentNode.grid;}
 this.edit=function(){this.cell.atag=((!this.grid.multiLine)&&(_isKHTML||_isMacOS||_isFF)) ? "INPUT" : "TEXTAREA";this.val=this.getValue();this.obj=document.createElement(this.cell.atag);this.obj.setAttribute("autocomplete", "off");this.obj.style.height=(this.cell.offsetHeight-(_isIE ? 4 : 4))+"px";this.obj.className="dhx_combo_edit";this.obj.wrap="soft";this.obj.style.textAlign=this.cell.style.textAlign;this.obj.onclick=function(e){(e||event).cancelBubble=true
 }
 this.obj.onmousedown=function(e){(e||event).cancelBubble=true
 }
 this.obj.value=this.val
 this.cell.innerHTML="";this.cell.appendChild(this.obj);this.obj.onselectstart=function(e){if (!e)e=event;e.cancelBubble=true;return true;};if (_isIE)this.obj.focus();this.obj.focus()
 }
 this.getValue=function(){if ((this.cell.firstChild)&&((this.cell.atag)&&(this.cell.firstChild.tagName == this.cell.atag)))
 return this.cell.firstChild.value;if (this.cell._clearCell)return "";return this.cell.innerHTML.toString()._dhx_trim();}
 this.detach=function(){this.setValue(this.obj.value);return this.val != this.getValue();}
}
eXcell_ed.prototype=new eXcell;function eXcell_edtxt(cell){if (cell){this.cell=cell;this.grid=this.cell.parentNode.grid;}
 this.getValue=function(){if ((this.cell.firstChild)&&((this.cell.atag)&&(this.cell.firstChild.tagName == this.cell.atag)))
 return this.cell.firstChild.value;if (this.cell._clearCell)return "";return (_isIE ? this.cell.innerText : this.cell.textContent);}
 this.setValue=function(val){if (!val||val.toString()._dhx_trim() == ""){val=" ";this.cell._clearCell=true;}else
 this.cell._clearCell=false;this.setCTxtValue(val);}
}
eXcell_edtxt.prototype=new eXcell_ed;function eXcell_edn(cell){if (cell){this.cell=cell;this.grid=this.cell.parentNode.grid;}
 this.getValue=function(){if ((this.cell.firstChild)&&(this.cell.firstChild.tagName == "TEXTAREA"))
 return this.cell.firstChild.value;if (this.cell._clearCell)return "";return this.cell._orig_value||this.grid._aplNFb(this.cell.innerHTML.toString()._dhx_trim(), this.cell._cellIndex);}
 this.detach=function(){var tv = this.obj.value;this.setValue(tv);return this.val != this.getValue();}
}
eXcell_edn.prototype=new eXcell_ed;eXcell_edn.prototype.setValue=function(val){if (!val||val.toString()._dhx_trim() == ""){this.cell._clearCell=true;return this.setCValue("&nbsp;",0);}else {this.cell._clearCell=false;this.cell._orig_value = val;}
 this.setCValue(this.grid._aplNF(val, this.cell._cellIndex), val);}
function eXcell_ch(cell){if (cell){this.cell=cell;this.grid=this.cell.parentNode.grid;}
 this.disabledF=function(fl){if ((fl == true)||(fl == 1))
 this.cell.innerHTML=this.cell.innerHTML.replace("item_chk0.", "item_chk0_dis.").replace("item_chk1.",
 "item_chk1_dis.");else
 this.cell.innerHTML=this.cell.innerHTML.replace("item_chk0_dis.", "item_chk0.").replace("item_chk1_dis.",
 "item_chk1.");}
 this.changeState=function(fromClick){if (fromClick===true && !this.grid.isActive){if (window.globalActiveDHTMLGridObject != null && window.globalActiveDHTMLGridObject != this.grid && window.globalActiveDHTMLGridObject.isActive)window.globalActiveDHTMLGridObject.setActive(false);this.grid.setActive(true);}
 if ((!this.grid.isEditable)||(this.cell.parentNode._locked)||(this.isDisabled()))
 return;if (this.grid.callEvent("onEditCell", [
 0,
 this.cell.parentNode.idd,
 this.cell._cellIndex
 ])){this.val=this.getValue()

 if (this.val == "1")this.setValue("0")
 else
 this.setValue("1")

 this.cell.wasChanged=true;this.grid.callEvent("onEditCell", [
 1,
 this.cell.parentNode.idd,
 this.cell._cellIndex
 ]);this.grid.callEvent("onCheckbox", [
 this.cell.parentNode.idd,
 this.cell._cellIndex,
 (this.val != '1')
 ]);this.grid.callEvent("onCheck", [
 this.cell.parentNode.idd,
 this.cell._cellIndex,
 (this.val != '1')
 ]);}else {this.editor=null;}
 }
 this.getValue=function(){return this.cell.chstate ? this.cell.chstate.toString() : "0";}
 this.isCheckbox=function(){return true;}
 this.isChecked=function(){if (this.getValue()== "1")
 return true;else
 return false;}
 this.setChecked=function(fl){this.setValue(fl.toString())
 }
 this.detach=function(){return this.val != this.getValue();}
 this.edit=null;}
eXcell_ch.prototype=new eXcell;eXcell_ch.prototype.setValue=function(val){this.cell.style.verticalAlign="middle";if (val){val=val.toString()._dhx_trim();if ((val == "false")||(val == "0"))
 val="";}
 if (val){val="1";this.cell.chstate="1";}else {val="0";this.cell.chstate="0"
 }
 var obj = this;this.setCValue("<img src='"+this.grid.imgURL+"item_chk"+val
 +".gif' onclick='new eXcell_ch(this.parentNode).changeState(true);(arguments[0]||event).cancelBubble=true;'>",
 this.cell.chstate);}
function eXcell_ra(cell){this.base=eXcell_ch;this.base(cell)
 this.grid=cell.parentNode.grid;this.disabledF=function(fl){if ((fl == true)||(fl == 1))
 this.cell.innerHTML=this.cell.innerHTML.replace("radio_chk0.", "radio_chk0_dis.").replace("radio_chk1.",
 "radio_chk1_dis.");else
 this.cell.innerHTML=this.cell.innerHTML.replace("radio_chk0_dis.", "radio_chk0.").replace("radio_chk1_dis.",
 "radio_chk1.");}
 this.changeState=function(mode){if (mode===false && this.getValue()==1) return;if ((!this.grid.isEditable)||(this.cell.parentNode._locked))
 return;if (this.grid.callEvent("onEditCell", [
 0,
 this.cell.parentNode.idd,
 this.cell._cellIndex
 ])!= false){this.val=this.getValue()

 if (this.val == "1")this.setValue("0")
 else
 this.setValue("1")
 this.cell.wasChanged=true;this.grid.callEvent("onEditCell", [
 1,
 this.cell.parentNode.idd,
 this.cell._cellIndex
 ]);this.grid.callEvent("onCheckbox", [
 this.cell.parentNode.idd,
 this.cell._cellIndex,
 (this.val != '1')
 ]);this.grid.callEvent("onCheck", [
 this.cell.parentNode.idd,
 this.cell._cellIndex,
 (this.val != '1')
 ]);}else {this.editor=null;}
 }
 this.edit=null;}
eXcell_ra.prototype=new eXcell_ch;eXcell_ra.prototype.setValue=function(val){this.cell.style.verticalAlign="middle";if (val){val=val.toString()._dhx_trim();if ((val == "false")||(val == "0"))
 val="";}
 if (val){if (!this.grid._RaSeCol)this.grid._RaSeCol=[];if (this.grid._RaSeCol[this.cell._cellIndex]){var z = this.grid.cells4(this.grid._RaSeCol[this.cell._cellIndex]);z.setValue("0")
 if (this.grid.rowsAr[z.cell.parentNode.idd])this.grid.callEvent("onEditCell", [
 1,
 z.cell.parentNode.idd,
 z.cell._cellIndex
 ]);}
 this.grid._RaSeCol[this.cell._cellIndex]=this.cell;val="1";this.cell.chstate="1";}else {val="0";this.cell.chstate="0"
 }
 this.setCValue("<img src='"+this.grid.imgURL+"radio_chk"+val+".gif' onclick='new eXcell_ra(this.parentNode).changeState(false);'>",
 this.cell.chstate);}
function eXcell_txt(cell){if (cell){this.cell=cell;this.grid=this.cell.parentNode.grid;}
 this.edit=function(){this.val=this.getValue()
 this.obj=document.createElement("TEXTAREA");this.obj.className="dhx_textarea";this.obj.onclick=function(e){(e||event).cancelBubble=true
 }
 var arPos = this.grid.getPosition(this.cell);this.obj.value=this.val;this.obj.style.display="";this.obj.style.textAlign=this.cell.style.textAlign;if (_isFF){var z_ff = document.createElement("DIV");z_ff.appendChild(this.obj);z_ff.style.overflow="auto";z_ff.className="dhx_textarea";this.obj.style.margin="0px 0px 0px 0px";this.obj.style.border="0px";this.obj=z_ff;}
 document.body.appendChild(this.obj);if(_isOpera)this.obj.onkeypress=function(ev){if (ev.keyCode == 9)return false;}
 this.obj.onkeydown=function(e){var ev = (e||event);if (ev.keyCode == 9){globalActiveDHTMLGridObject.entBox.focus();globalActiveDHTMLGridObject.doKey({keyCode: ev.keyCode,
 shiftKey: ev.shiftKey,
 srcElement: "0"
 });return false;}
 }
 this.obj.style.left=arPos[0]+"px";this.obj.style.top=arPos[1]+this.cell.offsetHeight+"px";if (this.cell.offsetWidth < 200)var pw = 200;else
 var pw = this.cell.offsetWidth;this.obj.style.width=pw+(_isFF ? 18 : 16)+"px"

 if (_isFF){this.obj.firstChild.style.width=parseInt(this.obj.style.width)+"px";this.obj.firstChild.style.height=this.obj.offsetHeight-3+"px";}
 if (_isIE){this.obj.select();this.obj.value=this.obj.value;}
 if (_isFF)this.obj.firstChild.focus();else {this.obj.focus()
 }
 }
 this.detach=function(){var a_val = "";if (_isFF)a_val=this.obj.firstChild.value;else
 a_val=this.obj.value;if (a_val == ""){this.cell._clearCell=true;}
 else
 this.cell._clearCell=false;this.setValue(a_val);document.body.removeChild(this.obj);this.obj=null;return this.val != this.getValue();}
 this.getValue=function(){if (this.obj){if (_isFF)return this.obj.firstChild.value;else
 return this.obj.value;}
 
 if (this.cell._clearCell)return "";if (typeof this.cell._brval != "undefined")return this.cell._brval;if ((!this.grid.multiLine))
 return this.cell._brval||this.cell.innerHTML;else
 return this.cell._brval||this.cell.innerHTML.replace(/<br[^>]*>/gi, "\n")._dhx_trim();}
}
eXcell_txt.prototype=new eXcell;function eXcell_txttxt(cell){if (cell){this.cell=cell;this.grid=this.cell.parentNode.grid;}
 this.getValue=function(){if ((this.cell.firstChild)&&(this.cell.firstChild.tagName == "TEXTAREA"))
 return this.cell.firstChild.value;if (this.cell._clearCell)return "";if ((!this.grid.multiLine)&&this.cell._brval)
 return this.cell._brval;return (_isIE ? this.cell.innerText : this.cell.textContent);}
 this.setValue=function(val){this.cell._brval=val;if (!val||val.toString()._dhx_trim() == ""){val=" ";this.cell._clearCell=true;}else
 this.cell._clearCell=false;this.setCTxtValue(val);}
}
eXcell_txttxt.prototype=new eXcell_txt;eXcell_txt.prototype.setValue=function(val){this.cell._brval=val;if (!val||val.toString()._dhx_trim() == ""){val="&nbsp;"
 this.cell._clearCell=true;}else
 this.cell._clearCell=false;if ((!this.grid.multiLine)|| this.cell._clearCell)
 this.setCValue(val, this.cell._brval);else
 this.setCValue(val.replace(/\n/g, "<br/>"), val);}
function eXcell_co(cell){if (cell){this.cell=cell;this.grid=this.cell.parentNode.grid;this.combo=(this.cell._combo||this.grid.getCombo(this.cell._cellIndex));this.editable=true
 }
 this.shiftNext=function(){var z = this.list.options[this.list.selectedIndex+1];if (z)z.selected=true;this.obj.value=this.list.options[this.list.selectedIndex].text;return true;}
 this.shiftPrev=function(){if (this.list.selectedIndex != 0){var z = this.list.options[this.list.selectedIndex-1];if (z)z.selected=true;this.obj.value=this.list.options[this.list.selectedIndex].text;}
 return true;}
 this.edit=function(){this.val=this.getValue();this.text=this.getText()._dhx_trim();var arPos = this.grid.getPosition(this.cell) 

 this.obj=document.createElement("TEXTAREA");this.obj.className="dhx_combo_edit";this.obj.style.height=(this.cell.offsetHeight-4)+"px";this.obj.wrap="soft";this.obj.style.textAlign=this.cell.style.textAlign;this.obj.onclick=function(e){(e||event).cancelBubble=true
 }
 this.obj.onmousedown=function(e){(e||event).cancelBubble=true
 }
 this.obj.value=this.text
 this.obj.onselectstart=function(e){if (!e)e=event;e.cancelBubble=true;return true;};var editor_obj = this;this.obj.onkeyup=function(e){var key=(e||event).keyCode;if (key==38 || key==40 || key==9)return;var val = this.readonly ? String.fromCharCode(key) : this.value;var c = editor_obj.list.options;for (var i = 0;i < c.length;i++)if (c[i].text.indexOf(val)== 0)
 return c[i].selected=true;}
 this.list=document.createElement("SELECT");this.list.className='dhx_combo_select';this.list.style.width=this.cell.offsetWidth+"px";this.list.style.left=arPos[0]+"px";this.list.style.top=arPos[1]+this.cell.offsetHeight+"px";this.list.onclick=function(e){var ev = e||window.event;var cell = ev.target||ev.srcElement

 
 if (cell.tagName == "OPTION")cell=cell.parentNode;editor_obj.editable=false;editor_obj.grid.editStop();ev.cancelBubble = true;}
 var comboKeys = this.combo.getKeys();var fl = false
 var selOptId = 0;for (var i = 0;i < comboKeys.length;i++){var val = this.combo.get(comboKeys[i])
 this.list.options[this.list.options.length]=new Option(val, comboKeys[i]);if (comboKeys[i] == this.val){selOptId=this.list.options.length-1;fl=true;}
 }
 if (fl == false){this.list.options[this.list.options.length]=new Option(this.text, this.val === null ? "" : this.val);selOptId=this.list.options.length-1;}
 document.body.appendChild(this.list) 
 this.list.size="6";this.cstate=1;if (this.editable){this.cell.innerHTML="";}
 else {this.obj.style.width="1px";this.obj.style.height="1px";}
 this.cell.appendChild(this.obj);this.list.options[selOptId].selected=true;if ((!_isFF)||(this.editable)){this.obj.focus();this.obj.focus();}
 if (!this.editable){this.obj.style.visibility="hidden";this.list.focus();this.list.onkeydown=function(e){e=e||window.event;editor_obj.grid.setActive(true)

 if (e.keyCode < 30)return editor_obj.grid.doKey({target: editor_obj.cell,
 keyCode: e.keyCode,
 shiftKey: e.shiftKey,
 ctrlKey: e.ctrlKey
 })
 }
 }
 }
 this.getValue=function(){return ((this.cell.combo_value == window.undefined) ? "" : this.cell.combo_value);}
 this.detach=function(){if (this.val != this.getValue()){this.cell.wasChanged=true;}
 if (this.list.parentNode != null){if (this.editable){var ind = this.list.options[this.list.selectedIndex]
 if (ind&&ind.text == this.obj.value)this.setValue(this.list.value)
 else{var combo=(this.cell._combo||this.grid.getCombo(this.cell._cellIndex));var val=combo.values._dhx_find(this.obj.value);if (val!=-1)this.setValue(combo.keys[val]);else this.setCValue(this.cell.combo_value=this.obj.value);}
 }
 else
 this.setValue(this.list.value)
 }
 if (this.list.parentNode)this.list.parentNode.removeChild(this.list);if (this.obj.parentNode)this.obj.parentNode.removeChild(this.obj);return this.val != this.getValue();}
}
eXcell_co.prototype=new eXcell;eXcell_co.prototype.getText=function(){return this.cell.innerHTML;}
eXcell_co.prototype.setValue=function(val){if (typeof (val)== "object"){var optCol = this.grid.xmlLoader.doXPath("./option", val);if (optCol.length)this.cell._combo=new dhtmlXGridComboObject();for (var j = 0;j < optCol.length;j++)this.cell._combo.put(optCol[j].getAttribute("value"),
 optCol[j].firstChild
 ? optCol[j].firstChild.data
 : "");val=val.firstChild.data;}
 if ((val||"").toString()._dhx_trim() == "")
 val=null
 this.cell.combo_value=val;if (val !== null){var label = (this.cell._combo||this.grid.getCombo(this.cell._cellIndex)).get(val);this.setCValue(label===null?val:label, val);}else
 this.setCValue("&nbsp;", val);}
function eXcell_coro(cell){this.base=eXcell_co;this.base(cell)
 this.editable=false;}
eXcell_coro.prototype=new eXcell_co;function eXcell_cotxt(cell){this.base=eXcell_co;this.base(cell)
}
eXcell_cotxt.prototype=new eXcell_co;eXcell_cotxt.prototype.getText=function(){return (_isIE ? this.cell.innerText : this.cell.textContent);}
eXcell_cotxt.prototype.setValue=function(val){if (typeof (val)== "object"){var optCol = this.grid.xmlLoader.doXPath("./option", val);if (optCol.length)this.cell._combo=new dhtmlXGridComboObject();for (var j = 0;j < optCol.length;j++)this.cell._combo.put(optCol[j].getAttribute("value"),
 optCol[j].firstChild
 ? optCol[j].firstChild.data
 : "");val=val.firstChild.data;}
 if ((val||"").toString()._dhx_trim() == "")
 val=null

 if (val !== null)this.setCTxtValue((this.cell._combo||this.grid.getCombo(this.cell._cellIndex)).get(val)||val, val);else
 this.setCTxtValue(" ", val);this.cell.combo_value=val;}
function eXcell_corotxt(cell){this.base=eXcell_co;this.base(cell)
 this.editable=false;}
eXcell_corotxt.prototype=new eXcell_cotxt;function eXcell_cp(cell){try{this.cell=cell;this.grid=this.cell.parentNode.grid;}
 catch (er){}
 this.edit=function(){this.val=this.getValue()
 this.obj=document.createElement("SPAN");this.obj.style.border="1px solid black";this.obj.style.position="absolute";var arPos = this.grid.getPosition(this.cell);this.colorPanel(4, this.obj)
 document.body.appendChild(this.obj);this.obj.style.left=arPos[0]+"px";this.obj.style.zIndex=1000;this.obj.style.top=arPos[1]+this.cell.offsetHeight+"px";}
 this.toolDNum=function(value){if (value.length == 1)value='0'+value;return value;}
 this.colorPanel=function(index, parent){var tbl = document.createElement("TABLE");parent.appendChild(tbl)
 tbl.cellSpacing=0;tbl.editor_obj=this;tbl.style.cursor="default";tbl.onclick=function(e){var ev = e||window.event
 var cell = ev.target||ev.srcElement;var ed = cell.parentNode.parentNode.parentNode.editor_obj
 ed.setValue(cell._bg)
 ed.grid.editStop();}
 var cnt = 256 / index;for (var j = 0;j <= (256 / cnt);j++){var r = tbl.insertRow(j);for (var i = 0;i <= (256 / cnt);i++){for (var n = 0;n <= (256 / cnt);n++){R=new Number(cnt*j)-(j == 0 ? 0 : 1)
 G=new Number(cnt*i)-(i == 0 ? 0 : 1)
 B=new Number(cnt*n)-(n == 0 ? 0 : 1)
 var rgb =
 this.toolDNum(R.toString(16))+""+this.toolDNum(G.toString(16))+""+this.toolDNum(B.toString(16));var c = r.insertCell(i);c.width="10px";c.innerHTML="&nbsp;";c.title=rgb.toUpperCase()
 c.style.backgroundColor="#"+rgb
 c._bg="#"+rgb;if (this.val != null&&"#"+rgb.toUpperCase()== this.val.toUpperCase()){c.style.border="2px solid white"
 }
 }
 }
 }
 }
 this.getValue=function(){return this.cell.firstChild._bg||"";}
 this.getRed=function(){return Number(parseInt(this.getValue().substr(1, 2), 16))
 }
 this.getGreen=function(){return Number(parseInt(this.getValue().substr(3, 2), 16))
 }
 this.getBlue=function(){return Number(parseInt(this.getValue().substr(5, 2), 16))
 }
 this.detach=function(){if (this.obj.offsetParent != null)document.body.removeChild(this.obj);return this.val != this.getValue();}
}
eXcell_cp.prototype=new eXcell;eXcell_cp.prototype.setValue=function(val){this.setCValue("<div style='width:100%;height:"+((this.grid.multiLine?this.cell.offsetHeight-2:16))+";background-color:"+(val||"")
 +";border:0px;'>&nbsp;</div>",
 val);this.cell.firstChild._bg=val;}
function eXcell_img(cell){try{this.cell=cell;this.grid=this.cell.parentNode.grid;}
 catch (er){}
 this.getValue=function(){if (this.cell.firstChild.tagName == "IMG")return this.cell.firstChild.src+(this.cell.titFl != null
 ? "^"+this.cell._brval
 : "");else if (this.cell.firstChild.tagName == "A"){var out = this.cell.firstChild.firstChild.src+(this.cell.titFl != null ? "^"+this.cell._brval : "");out+="^"+this.cell.lnk;if (this.cell.trg)out+="^"+this.cell.trg
 return out;}
 }
 this.isDisabled=function(){return true;}
}
eXcell_img.prototype=new eXcell;eXcell_img.prototype.getTitle=function(){return this.cell._brval
}
eXcell_img.prototype.setValue=function(val){var title = val;if (val.indexOf("^")!= -1){var ar = val.split("^");val=ar[0]
 title=this.cell._attrs.title||ar[1];if (ar.length > 2){this.cell.lnk=ar[2]

 if (ar[3])this.cell.trg=ar[3]
 }
 this.cell.titFl="1";}
 this.setCValue("<img src='"+this.grid.iconURL+(val||"")._dhx_trim()+"' border='0'>", val);if (this.cell.lnk){this.cell.innerHTML="<a href='"+this.cell.lnk+"' target='"+this.cell.trg+"'>"+this.cell.innerHTML+"</a>"
 }
 this.cell._brval=title;}
function eXcell_price(cell){this.base=eXcell_ed;this.base(cell)
 this.getValue=function(){if (this.cell.childNodes.length > 1)return this.cell.childNodes[1].innerHTML.toString()._dhx_trim()
 else
 return "0";}
}
eXcell_price.prototype=new eXcell_ed;eXcell_price.prototype.setValue=function(val){if (isNaN(parseFloat(val))){val=this.val||0;}
 var color = "green";if (val < 0)color="red";this.setCValue("<span>$</span><span style='padding-right:2px;color:"+color+";'>"+val+"</span>", val);}
function eXcell_dyn(cell){this.base=eXcell_ed;this.base(cell)
 this.getValue=function(){return this.cell.firstChild.childNodes[1].innerHTML.toString()._dhx_trim()
 }
}
eXcell_dyn.prototype=new eXcell_ed;eXcell_dyn.prototype.setValue=function(val){if (!val||isNaN(Number(val))){if (val!=="")val=0;}
 if (val > 0){var color = "green";var img = "dyn_up.gif";}else if (val == 0){var color = "black";var img = "dyn_.gif";}else {var color = "red";var img = "dyn_down.gif";}
 this.setCValue("<div style='position:relative;padding-right:2px;width:100%;overflow:hidden;white-space:nowrap;'><img src='"+this.grid.imgURL+""+img
 +"' height='15' style='position:absolute;top:0px;left:0px;'><span style=' padding-left:20px;width:100%;color:"+color+";'>"+val
 +"</span></div>",
 val);}
function eXcell_ro(cell){if (cell){this.cell=cell;this.grid=this.cell.parentNode.grid;}
 this.edit=function(){}
 this.isDisabled=function(){return true;}
 this.getValue=function(){return this.cell._clearCell?"":this.cell.innerHTML.toString()._dhx_trim();}
}
eXcell_ro.prototype=new eXcell;function eXcell_ron(cell){this.cell=cell;this.grid=this.cell.parentNode.grid;this.edit=function(){}
 this.isDisabled=function(){return true;}
 this.getValue=function(){return this.cell._clearCell?"":this.grid._aplNFb(this.cell.innerHTML.toString()._dhx_trim(), this.cell._cellIndex).toString();}
}
eXcell_ron.prototype=new eXcell;eXcell_ron.prototype.setValue=function(val){if (val === 0){}
 else if (!val||val.toString()._dhx_trim() == ""){this.setCValue("&nbsp;");return this.cell._clearCell=true;}
 this.cell._clearCell=false;this.setCValue(val?this.grid._aplNF(val, this.cell._cellIndex):"0");}
function eXcell_rotxt(cell){this.cell=cell;this.grid=this.cell.parentNode.grid;this.edit=function(){}
 this.isDisabled=function(){return true;}
 this.setValue=function(val){if (!val){val=" ";this.cell._clearCell = true;}
 else
 this.cell._clearCell = false;this.setCTxtValue(val);}
 this.getValue=function(){if (this.cell._clearCell)return "";return (_isIE ? this.cell.innerText : this.cell.textContent);}
}
eXcell_rotxt.prototype=new eXcell;function dhtmlXGridComboObject(){this.keys=new dhtmlxArray();this.values=new dhtmlxArray();this.put=function(key, value){for (var i = 0;i < this.keys.length;i++){if (this.keys[i] == key){this.values[i]=value;return true;}
 }
 this.values[this.values.length]=value;this.keys[this.keys.length]=key;}
 
 this.get=function(key){for (var i = 0;i < this.keys.length;i++){if (this.keys[i] == key){return this.values[i];}
 }
 return null;}
 
 this.clear=function(){this.keys=new dhtmlxArray();this.values=new dhtmlxArray();}
 
 this.remove=function(key){for (var i = 0;i < this.keys.length;i++){if (this.keys[i] == key){this.keys._dhx_removeAt(i);this.values._dhx_removeAt(i);return true;}
 }
 }
 
 this.size=function(){var j = 0;for (var i = 0;i < this.keys.length;i++){if (this.keys[i] != null)j++;}
 return j;}
 
 this.getKeys=function(){var keyAr = new Array(0);for (var i = 0;i < this.keys.length;i++){if (this.keys[i] != null)keyAr[keyAr.length]=this.keys[i];}
 return keyAr;}
 
 this.save=function(){this._save=new Array();for (var i = 0;i < this.keys.length;i++)this._save[i]=[
 this.keys[i],
 this.values[i]
 ];}
 
 this.restore=function(){if (this._save){this.keys[i]=new Array();this.values[i]=new Array();for (var i = 0;i < this._save.length;i++){this.keys[i]=this._save[i][0];this.values[i]=this._save[i][1];}
 }
 }
 return this;}
function Hashtable(){this.keys=new dhtmlxArray();this.values=new dhtmlxArray();return this;}
Hashtable.prototype=new dhtmlXGridComboObject;dhtmlXGridObject.prototype._process_json_row=function(r, data){r._attrs=data;for (var j = 0;j < r.childNodes.length;j++)r.childNodes[j]._attrs={};if (data.userdata)for (var a in data.userdata)this.setUserData(r.idd,a,data.userdata[a]);data = this._c_order?this._swapColumns(data.data):data.data;for (var i=0;i<data.length;i++)if (typeof data[i] == "object" && data[i] != null){r.childNodes[i]._attrs=data[i];if (data[i].type)r.childNodes[i]._cellType=data[i].type;data[i]=data[i].value;}
 this._fillRow(r, data);return r;};dhtmlXGridObject.prototype._process_js_row=function(r, data){r._attrs=data;for (var j = 0;j < r.childNodes.length;j++)r.childNodes[j]._attrs={};if (data.userdata)for (var a in data.userdata)this.setUserData(r.idd,a,data.userdata[a]);var arr = [];for (var i=0;i<this.columnIds.length;i++){arr[i] = data[this.columnIds[i]];if (typeof arr[i] == "object" && arr[i] != null){r.childNodes[i]._attrs=arr[i];if (arr[i].type)r.childNodes[i]._cellType=arr[i].type;arr[i]=arr[i].value;}
 if (!arr[i] && arr[i]!==0)arr[i]="";}
 this._fillRow(r, arr);return r;};dhtmlXGridObject.prototype.updateFromJSON = function(url, insert_new, del_missed, afterCall){if (typeof insert_new == "undefined")insert_new=true;this._refresh_mode=[
 true,
 insert_new,
 del_missed
 ];this.load(url,afterCall,"json");},
dhtmlXGridObject.prototype._refreshFromJSON = function(data){if (this._f_rowsBuffer)this.filterBy(0,"");reset = false;if (window.eXcell_tree){eXcell_tree.prototype.setValueX=eXcell_tree.prototype.setValue;eXcell_tree.prototype.setValue=function(content){var r=this.grid._h2.get[this.cell.parentNode.idd]
 if (r && this.cell.parentNode.valTag){this.setLabel(content);}else
 this.setValueX(content);};}
 
 var tree = this.cellType._dhx_find("tree");var pid = data.parent||0;var del = {};if (this._refresh_mode[2]){if (tree != -1)this._h2.forEachChild(pid, function(obj){del[obj.id]=true;}, this);else
 this.forEachRow(function(id){del[id]=true;});}
 
 var rows = data.rows;for (var i = 0;i < rows.length;i++){var row = rows[i];var id = row.id;del[id]=false;if (this.rowsAr[id] && this.rowsAr[id].tagName!="TR"){if (this._h2)this._h2.get[id].buff.data=row;else
 this.rowsBuffer[this.getRowIndex(id)].data=row;this.rowsAr[id]=row;}else if (this.rowsAr[id]){this._process_json_row(this.rowsAr[id], row, -1);this._postRowProcessing(this.rowsAr[id],true)
 }else if (this._refresh_mode[1]){var dadd={idd: id,
 data: row,
 _parser: this._process_json_row,
 _locator: this._get_json_data
 };var render_index = this.rowsBuffer.length;if (this._refresh_mode[1]=="top"){this.rowsBuffer.unshift(dadd);render_index = 0;}else
 this.rowsBuffer.push(dadd);if (this._h2){reset=true;(this._h2.add(id,pid)).buff=this.rowsBuffer[this.rowsBuffer.length-1];}
 
 this.rowsAr[id]=row;row=this.render_row(render_index);this._insertRowAt(row,render_index?-1:0)
 }
 }
 
 if (this._refresh_mode[2])for (id in del){if (del[id]&&this.rowsAr[id])this.deleteRow(id);}
 
 this._refresh_mode=null;if (window.eXcell_tree)eXcell_tree.prototype.setValue=eXcell_tree.prototype.setValueX;if (reset)this._renderSort();if (this._f_rowsBuffer){this._f_rowsBuffer = null;this.filterByAll();}
 },

 dhtmlXGridObject.prototype._process_js=function(data){return this._process_json(data, "js");},

 dhtmlXGridObject.prototype._process_json=function(data, mode){this._parsing=true;try {if (data&&data.xmlDoc){eval("dhtmlx.temp="+data.xmlDoc.responseText+";");data = dhtmlx.temp;}else if (typeof data == "string"){eval("dhtmlx.temp="+data+";");data = dhtmlx.temp;}
 }catch(e){dhtmlxError.throwError("LoadXML", "Incorrect JSON", [
 (data.xmlDoc||data),
 this
 ]);data = {rows:[]};}
 
 if (this._refresh_mode)return this._refreshFromJSON(data);var cr = parseInt(data.pos||0);var total = parseInt(data.total_count||0);var reset = false;if (total){if (!this.rowsBuffer[total-1]){if (this.rowsBuffer.length)reset=true;this.rowsBuffer[total-1]=null;}
 if (total<this.rowsBuffer.length){this.rowsBuffer.splice(total, this.rowsBuffer.length - total);reset = true;}
 }
 
 for (var key in data){if (key!="rows")this.setUserData("",key, data[key]);}
 if (mode == "js" && data.collections){for (var colkey in data.collections){var index = this.getColIndexById(colkey);var colrecs = data.collections[colkey];if (index !== window.undefined){if (this.cellType[index] == "clist"){colplaindata=[];for (var j=0;j<colrecs.length;j++)colplaindata.push(colrecs[j].label);this.registerCList(index, colplaindata);}else {var combo = this.getCombo(index);for (var j = 0;j < colrecs.length;j++)combo.put(colrecs[j].value, colrecs[j].label);}
 }
 }
 }
 
 if (this.isTreeGrid())
 return this._process_tree_json(data, null, null, mode);if (mode == "js"){if (data.data)data = data.data;for (var i = 0;i < data.length;i++){if (this.rowsBuffer[i+cr])continue;var row = data[i];var id = row.id||(i+1);this.rowsBuffer[i+cr]={idd: id,
 data: row,
 _parser: this._process_js_row,
 _locator: this._get_js_data
 };this.rowsAr[id]=data[i];}
 }else {for (var i = 0;i < data.rows.length;i++){if (this.rowsBuffer[i+cr])continue;var id = data.rows[i].id;this.rowsBuffer[i+cr]={idd: id,
 data: data.rows[i],
 _parser: this._process_json_row,
 _locator: this._get_json_data
 };this.rowsAr[id]=data.rows[i];}
 }
 
 if (reset && this._srnd){var h = this.objBox.scrollTop;this._reset_view();this.objBox.scrollTop = h;}else {this.render_dataset();}
 
 this._parsing=false;}
dhtmlXGridObject.prototype._get_json_data=function(data, ind){if (typeof data.data[ind] == "object")return data.data[ind].value;else
 return data.data[ind];};dhtmlXGridObject.prototype._process_tree_json=function(data,top,pid,mode){this._parsing=true;var main=false;if (!top){this.render_row=this.render_row_tree;main=true;top=data;pid=top.parent||0;if (pid=="0")pid=0;if (!this._h2)this._h2=new dhtmlxHierarchy();if (this._fake)this._fake._h2=this._h2;}
 
 if (mode == "js"){if (top.data && !pid)data = top.data;if (top.rows)top = top.rows;for (var i = 0;i < top.length;i++){var id = top[i].id;var row=this._h2.add(id,pid);row.buff={idd:id, data:top[i], _parser: this._process_js_row, _locator:this._get_js_data };if (top[i].open)row.state="minus";this.rowsAr[id]=row.buff;this._process_tree_json(top[i],top[i],id,mode);}
 }else {if (top.rows){for (var i = 0;i < top.rows.length;i++){var id = top.rows[i].id;var row=this._h2.add(id,pid);row.buff={idd:id, data:top.rows[i], _parser: this._process_json_row, _locator:this._get_json_data };if (top.rows[i].open)row.state="minus";this.rowsAr[id]=row.buff;this._process_tree_json(top.rows[i],top.rows[i],id,mode);}
 }
 }
 
 if (main){if (pid!=0)this._h2.change(pid,"state","minus")
 this._updateTGRState(this._h2.get[pid]);this._h2_to_buff();if (pid!=0 && (this._srnd || this.pagingOn))
 this._renderSort();else
 this.render_dataset();if (this._slowParse===false){this.forEachRow(function(id){this.render_row_tree(0,id)
 })
 }
 this._parsing=false;}
 
}









dhtmlXGridObject.prototype.filterBy=function(column, value, preserve){if (this.isTreeGrid()) return this.filterTreeBy(column, value, preserve);if (this._f_rowsBuffer){if (!preserve){this.rowsBuffer=dhtmlxArray([].concat(this._f_rowsBuffer));if (this._fake)this._fake.rowsBuffer=this.rowsBuffer;}
 }else
 this._f_rowsBuffer=[].concat(this.rowsBuffer);if (!this.rowsBuffer.length)return;var d=true;this.dma(true)
 if (typeof(column)=="object")
 for (var j=0;j<value.length;j++)this._filterA(column[j],value[j]);else
 this._filterA(column,value);this.dma(false)
 if (this.pagingOn && this.rowsBuffer.length/this.rowsBufferOutSize < (this.currentPage-1)) this.changePage(0);this._reset_view();this.callEvent("onGridReconstructed",[])
}
dhtmlXGridObject.prototype._filterA=function(column,value){if (value=="")return;var d=true;if (typeof(value)=="function") d=false;else value=(value||"").toString().toLowerCase();if (!this.rowsBuffer.length)return;for (var i=this.rowsBuffer.length-1;i>=0;i--)if (d?(this._get_cell_value(this.rowsBuffer[i],column).toString().toLowerCase().indexOf(value)==-1):(!value.call(this, this._get_cell_value(this.rowsBuffer[i],column),this.rowsBuffer[i].idd)))
 this.rowsBuffer.splice(i,1);}
dhtmlXGridObject.prototype.getFilterElement=function(index){if (!this.filters)return;for (var i=0;i < this.filters.length;i++){if (this.filters[i][1]==index)return (this.filters[i][0].combo||this.filters[i][0]);};return null;}
dhtmlXGridObject.prototype.collectValues=function(column){var value=this.callEvent("onCollectValues",[column]);if (value!==true)return value;if (this.isTreeGrid()) return this.collectTreeValues(column);this.dma(true)
 this._build_m_order();column=this._m_order?this._m_order[column]:column;var c={};var f=[];var col=this._f_rowsBuffer||this.rowsBuffer;for (var i=0;i<col.length;i++){var val=this._get_cell_value(col[i],column);if (val && (!col[i]._childIndexes || col[i]._childIndexes[column]!=col[i]._childIndexes[column-1])) c[val]=true;}
 this.dma(false);var vals= (this.combos[column]||(this._col_combos?this._col_combos[column]:false));for (var d in c)if (c[d]===true){if(vals){if(vals.get&&vals.get(d)){d = vals.get(d);}
 else if(vals.getOption&&vals.getOption(d)){d = vals.getOption(d).text;}
 }
 f.push(d);}
 
 return f.sort();}
dhtmlXGridObject.prototype._build_m_order=function(){if (this._c_order){this._m_order=[]
 for (var i=0;i < this._c_order.length;i++){this._m_order[this._c_order[i]]=i;};}
}
dhtmlXGridObject.prototype.filterByAll=function(){var a=[];var b=[];this._build_m_order();for (var i=0;i<this.filters.length;i++){if (i >= this._cCount)continue;var ind=this._m_order?this._m_order[this.filters[i][1]]:this.filters[i][1];b.push(ind);var val=this.filters[i][0].old_value=this.filters[i][0].value;if (this.filters[i][0]._filter)val = this.filters[i][0]._filter();var vals;if (typeof val != "function" && (vals=(this.combos[ind]||(this._col_combos?this._col_combos[ind]:false)))){if(vals.values){ind=vals.values._dhx_find(val);val=(ind==-1)?val:vals.keys[ind];}
 else if(vals.getOptionByLabel){val=(vals.getOptionByLabel(val)?vals.getOptionByLabel(val).value:val);}
 }
 a.push(val);}
 if (!this.callEvent("onFilterStart",[b,a])) return;this.filterBy(b,a);if (this._cssEven)this._fixAlterCss();this.callEvent("onFilterEnd",[this.filters]);if (this._f_rowsBuffer && this.rowsBuffer.length == this._f_rowsBuffer.length)this._f_rowsBuffer = null;}
dhtmlXGridObject.prototype.makeFilter=function(id,column,preserve){if (!this.filters)this.filters=[];if (typeof(id)!="object")
 id=document.getElementById(id);if(!id)return;var self=this;if (!id.style.width)id.style.width = "90%";if (id.tagName=='SELECT'){this.filters.push([id,column]);this._loadSelectOptins(id,column);id.onchange=function(){self.filterByAll();}
 if(_isIE)id.style.marginTop="1px";this.attachEvent("onEditCell",function(stage,a,ind){this._build_m_order();if (stage==2 && this.filters && ( this._m_order?(ind==this._m_order[column]):(ind==column) ))
 this._loadSelectOptins(id,column);return true;});}
 else if (id.tagName=='INPUT'){this.filters.push([id,column]);id.old_value = id.value='';id.onkeydown=function(){if (this._timer)window.clearTimeout(this._timer);this._timer=window.setTimeout(function(){if (id.value != id.old_value){self.filterByAll();id.old_value=id.value;}
 },500);};}
 else if (id.tagName=='DIV' && id.className=="combo"){this.filters.push([id,column]);id.style.padding="0px";id.style.margin="0px";if (!window.dhx_globalImgPath)window.dhx_globalImgPath=this.imgURL;var z=new dhtmlXCombo(id,"_filter","90%");z.filterSelfA=z.filterSelf;z.filterSelf=function(){if (this.getSelectedIndex()==0) this.setComboText("");this.filterSelfA.apply(this,arguments);this.optionsArr[0].hide(false);}
 
 
 z.enableFilteringMode(true);id.combo=z;id.value="";this._loadComboOptins(id,column);z.attachEvent("onChange",function(){id.value=z.getSelectedValue();if (id.value === null)id.value = "";self.filterByAll();});}
 if (id.parentNode)id.parentNode.className+=" filter";this._filters_ready();}
 
 dhtmlXGridObject.prototype.findCell=function(value, c_ind, count, compare){var compare = compare || (function(master, check){return check.toString().toLowerCase().indexOf(master) != -1;});if (compare === true)compare = function(master, check){return check.toString().toLowerCase() == master;};var res = new Array();value=value.toString().toLowerCase();if (typeof count != "number")count = count?1:0;if (!this.rowsBuffer.length)return res;for (var i = (c_ind||0);i < this._cCount;i++){if (this._h2)this._h2.forEachChild(0,function(el){if (count && res.length==count)return res;if (compare(value, this._get_cell_value(el.buff,i))){res.push([el.id,i]);}
 },this)
 else
 for (var j=0;j < this.rowsBuffer.length;j++)if (compare(value, this._get_cell_value(this.rowsBuffer[j],i))){res.push([this.rowsBuffer[j].idd,i]);if (count && res.length==count)return res;}
 
 
 
 if (typeof (c_ind)!= "undefined")
 return res;}
 
 return res;}
 

dhtmlXGridObject.prototype.makeSearch=function(id,column,strict){if (typeof(id)!="object")
 id=document.getElementById(id);if(!id)return;var self=this;if (id.tagName=='INPUT'){id.onkeypress=function(){if (this._timer)window.clearTimeout(this._timer);this._timer=window.setTimeout(function(){if (id.value=="")return;var z=self.findCell(id.value,column,true,strict);if (z.length){if (self._h2)self.openItem(z[0][0]);self.selectCell(self.getRowIndex(z[0][0]),(column||0))
 }
 },500);};}
 if (id.parentNode)id.parentNode.className+=" filter";}
 
dhtmlXGridObject.prototype._loadSelectOptins=function(t,c){var l=this.collectValues(c);var v=t.value;t.innerHTML="";t.options[0]=new Option("","");var f=this._filter_tr?this._filter_tr[c]:null;for (var i=0;i<l.length;i++)t.options[t.options.length]=new Option(f?f(l[i]):l[i],l[i]);t.value=v;}
dhtmlXGridObject.prototype.setSelectFilterLabel=function(ind,fun){if (!this._filter_tr)this._filter_tr=[];this._filter_tr[ind]=fun;}
dhtmlXGridObject.prototype._loadComboOptins=function(t,c){if (!t.combo)return;var l=this.collectValues(c);t.combo.clearAll();t.combo.render(false);var opts = [["","&nbsp;"]];for (var i=0;i<l.length;i++)opts.push([l[i],l[i]]);t.combo.addOption(opts);t.combo.render(true);}
dhtmlXGridObject.prototype.refreshFilters=function(){if(!this.filters)return;for (var i=0;i<this.filters.length;i++){switch(this.filters[i][0].tagName.toLowerCase()){case "input":
 break;case "select":
 this._loadSelectOptins.apply(this,this.filters[i]);break;case "div":
 this._loadComboOptins.apply(this,this.filters[i]);break;}
 }
}
dhtmlXGridObject.prototype._filters_ready=function(fl,code){this.attachEvent("onXLE",this.refreshFilters);this.attachEvent("onRowCreated",function(id,r){if (this._f_rowsBuffer)for (var i=0;i<this._f_rowsBuffer.length;i++)if (this._f_rowsBuffer[i].idd == id)return this._f_rowsBuffer[i]=r;})
 this.attachEvent("onClearAll",function(){this._f_rowsBuffer=null;if (!this.hdr.rows.length)this.filters=[];});if (window.dhtmlXCombo)this.attachEvent("onScroll",dhtmlXCombo.prototype.closeAll);this._filters_ready=function(){};}
dhtmlXGridObject.prototype._in_header_text_filter=function(t,i){t.innerHTML="<input type='text'>";t.onclick=t.onmousedown = function(e){(e||event).cancelBubble=true;return true;}
 t.onselectstart=function(){return (event.cancelBubble=true);}
 this.makeFilter(t.firstChild,i);}
dhtmlXGridObject.prototype._in_header_text_filter_inc=function(t,i){t.innerHTML="<input type='text'>";t.onclick=t.onmousedown = function(e){(e||event).cancelBubble=true;return true;}
 t.onselectstart=function(){return (event.cancelBubble=true);}
 this.makeFilter(t.firstChild,i);t.firstChild._filter=function(){if (t.firstChild.value=="")return "";return function(val){return (val.toString().toLowerCase().indexOf(t.firstChild.value.toLowerCase())==0);}
 }
 this._filters_ready();}
dhtmlXGridObject.prototype._in_header_select_filter=function(t,i){t.innerHTML="<select></select>";t.onclick=function(e){(e||event).cancelBubble=true;return false;}
 this.makeFilter(t.firstChild,i);}
dhtmlXGridObject.prototype._in_header_select_filter_strict=function(t,i){t.innerHTML="<select style='width:90%;font-size:8pt;font-family:Tahoma;'></select>";t.onclick=function(e){(e||event).cancelBubble=true;return false;}
 this.makeFilter(t.firstChild,i);var combos = this.combos;t.firstChild._filter=function(){var value = t.firstChild.value;if (!value)return "";if (combos[i])value = combos[i].keys[combos[i].values._dhx_find(value)];value = value.toLowerCase();return function(val){return (val.toString().toLowerCase()==value);};};this._filters_ready();}
dhtmlXGridObject.prototype._in_header_combo_filter=function(t,i){t.innerHTML="<div style='width:100%;padding-left:2px;overflow:hidden;' class='combo'></div>";t.onselectstart=function(){return (event.cancelBubble=true);}
 t.onclick=t.onmousedown=function(e){(e||event).cancelBubble=true;return true;}
 this.makeFilter(t.firstChild,i);}
dhtmlXGridObject.prototype._search_common=function(t, i){t.innerHTML="<input type='text' style='width:90%;'>";t.onclick= t.onmousedown = function(e){(e||event).cancelBubble=true;return true;}
 t.onselectstart=function(){return (event.cancelBubble=true);}
}
dhtmlXGridObject.prototype._in_header_text_search=function(t,i, strict){this._search_common(t, i);this.makeSearch(t.firstChild,i);}
dhtmlXGridObject.prototype._in_header_text_search_strict=function(t,i){this._search_common(t, i);this.makeSearch(t.firstChild,i, true);}
dhtmlXGridObject.prototype._in_header_numeric_filter=function(t,i){this._in_header_text_filter.call(this,t,i);t.firstChild._filter=function(){var v=this.value;var r;var op="==";var num=parseFloat(v.replace("=",""));var num2=null;if (v){if (v.indexOf("..")!=-1){v=v.split("..");num=parseFloat(v[0]);num2=parseFloat(v[1]);return function(v){if (v>=num && v<=num2)return true;return false;}
 }
 r=v.match(/>=|<=|>|</)
 if (r){op=r[0];num=parseFloat(v.replace(op,""));}
 return Function("v"," if (v "+op+" "+num+" )return true;return false;");}
 return "";};}
dhtmlXGridObject.prototype._in_header_master_checkbox=function(t,i,c){t.innerHTML=c[0]+"<input type='checkbox' />"+c[1];var self=this;t.getElementsByTagName("input")[0].onclick=function(e){self._build_m_order();var j=self._m_order?self._m_order[i]:i;var val=this.checked?1:0;self.forEachRowA(function(id){var c=this.cells(id,j);if (c.isCheckbox()) {c.setValue(val);c.cell.wasChanged = true;}
 this.callEvent("onEditCell",[1,id,j,val]);this.callEvent("onCheckbox", [id, j, val]);});(e||event).cancelBubble=true;}
}
dhtmlXGridObject.prototype._in_header_stat_total=function(t,i,c){var calck=function(){var summ=0;this._build_m_order();var ii = this._m_order?this._m_order[i]:i;for (var j=0;j<this.rowsBuffer.length;j++){var v=parseFloat(this._get_cell_value(this.rowsBuffer[j],ii));summ+=isNaN(v)?0:v;}
 
 return this._maskArr[ii]?this._aplNF(summ,ii):(Math.round(summ*100)/100);}
 this._stat_in_header(t,calck,i,c,c);}
dhtmlXGridObject.prototype._in_header_stat_multi_total=function(t,i,c){var cols=c[1].split(":");c[1]="";for(var k = 0;k < cols.length;k++){cols[k]=parseInt(cols[k]);}
 var calck=function(){var summ=0;for (var j=0;j<this.rowsBuffer.length;j++){var v = 1;for(var k = 0;k < cols.length;k++){v *= parseFloat(this._get_cell_value(this.rowsBuffer[j],cols[k]))
 }
 summ+=isNaN(v)?0:v;}
 return this._maskArr[i]?this._aplNF(summ,i):(Math.round(summ*100)/100);}
 var track=[];for(var ind = 0;ind < cols.length;ind++){track[cols[ind]]=true;}
 this._stat_in_header(t,calck,track,c,c);}
dhtmlXGridObject.prototype._in_header_stat_max=function(t,i,c){var calck=function(){this._build_m_order();var ii = this._m_order?this._m_order[i]:i;var summ=-999999999;if (this.getRowsNum()==0) return "&nbsp;";for (var j=0;j<this.rowsBuffer.length;j++)summ=Math.max(summ,parseFloat(this._get_cell_value(this.rowsBuffer[j],ii)));return this._maskArr[i]?this._aplNF(summ,i):summ;}
 this._stat_in_header(t,calck,i,c);}
dhtmlXGridObject.prototype._in_header_stat_min=function(t,i,c){var calck=function(){this._build_m_order();var ii = this._m_order?this._m_order[i]:i;var summ=999999999;if (this.getRowsNum()==0) return "&nbsp;";for (var j=0;j<this.rowsBuffer.length;j++)summ=Math.min(summ,parseFloat(this._get_cell_value(this.rowsBuffer[j],ii)));return this._maskArr[i]?this._aplNF(summ,i):summ;}
 this._stat_in_header(t,calck,i,c);}
dhtmlXGridObject.prototype._in_header_stat_average=function(t,i,c){var calck=function(){this._build_m_order();var ii = this._m_order?this._m_order[i]:i;var summ=0;var count=0;if (this.getRowsNum()==0) return "&nbsp;";for (var j=0;j<this.rowsBuffer.length;j++){var v=parseFloat(this._get_cell_value(this.rowsBuffer[j],ii));summ+=isNaN(v)?0:v;count++;}
 return this._maskArr[i]?this._aplNF(summ/count,i):(Math.round(summ/count*100)/100);}
 this._stat_in_header(t,calck,i,c);}
dhtmlXGridObject.prototype._in_header_stat_count=function(t,i,c){var calck=function(){return this.getRowsNum();}
 this._stat_in_header(t,calck,i,c);}
dhtmlXGridObject.prototype._stat_in_header=function(t,calck,i,c){var that=this;var f=function(){this.dma(true)
 t.innerHTML=(c[0]?c[0]:"")+calck.call(this)+(c[1]?c[1]:"");this.dma(false)
 this.callEvent("onStatReady",[])
 }
 if (!this._stat_events){this._stat_events=[];this.attachEvent("onClearAll",function(){if (!this.hdr.rows[1]){for (var i=0;i<this._stat_events.length;i++)for (var j=0;j < 4;j++)this.detachEvent(this._stat_events[i][j]);this._stat_events=[];}
 })
 }
 
 this._stat_events.push([
 this.attachEvent("onGridReconstructed",f),
 this.attachEvent("onXLE",f),
 this.attachEvent("onFilterEnd",f),
 this.attachEvent("onEditCell",function(stage,id,ind){if (stage==2 && ( ind==i || ( i && i[ind])) ) f.call(this);return true;})]);t.innerHTML="";}
dhtmlXGridObject.prototype.unGroup=function(){if (!this._groups)return;this._dndProblematic=false;delete this._groups;delete this._gIndex;if (this._fake)this._mirror_rowsCol();this.forEachRow(function(id){this.rowsAr[id].style.display='';})
 this._reset_view();this.callEvent("onGridReconstructed",[])
 this.callEvent("onUnGroup",[]);}
dhtmlXGridObject.prototype._mirror_rowsCol=function(){this._fake._groups=this._groups;this._fake._gIndex=this._gIndex;this.rowsBuffer=dhtmlxArray();for (var i=0;i<this.rowsCol.length;i++)if (!this.rowsCol[i]._cntr)this.rowsBuffer.push(this.rowsCol[i]);this._fake.rowsBuffer=dhtmlxArray();for (var i=0;i<this._fake.rowsCol.length;i++)if (!this._fake.rowsCol[i]._cntr)this._fake.rowsBuffer.push(this._fake.rowsCol[i]);}
dhtmlXGridObject.prototype.groupBy=function(ind,mask){if (this._groups)this.unGroup();this._dndProblematic=true;this._groups={};if (!mask){mask=["#title"];for (var i=1;i<this._cCount;i++)mask.push("#cspan");}
 this._gmask=document.createElement("TR");this._gmask.origin = mask;var ltd,rindex=0;for (var i=0;i<mask.length;i++){if (mask[i]=="#cspan")ltd.colSpan=(parseInt(ltd.colSpan)||1)+1
 else {ltd=document.createElement("TD");ltd._cellIndex=i;if (this._hrrar[i])ltd.style.display="none";ltd.className="group_row";ltd.innerHTML="&nbsp;";if (mask[i]=="#title")this._gmask._title=rindex;else ltd.align=this.cellAlign[i]||"left";this._gmask.appendChild(ltd);if (mask[i].indexOf("#stat")==0){this._gmask._math=true;ltd._counter=[this["_g_"+mask[i].replace("#","")],i,rindex];}
 rindex++;}
 }
 for (var a in this._groups)this._groups[a]=this.undefined;this._gIndex=ind;if (this._fake &&!this._realfake){this._fake._groups=[];this._fake._gIndex=this._gIndex;}
 
 
 this._nextRow=function(ind,dir){var r=this.rowsCol[ind+dir];if (r && ( r.style.display=="none" || r._cntr)) return this._nextRow(ind+dir,dir);return r;}
 
 if (!this.__sortRowsBG){this._key_events=dhtmlXHeir({},this._key_events)
 this._key_events.k38_0_0=function(){if (this.editor && this.editor.combo)this.editor.shiftPrev();else{var rowInd = this.row.rowIndex;if (!rowInd)return;var nrow=this._nextRow(rowInd-1,-1);if (nrow)this.selectCell(nrow,this.cell._cellIndex,true);}
 }
 this._key_events.k13_1_0=this._key_events.k13_0_1=function(){};this._key_events.k40_0_0=function(){if (this.editor && this.editor.combo)this.editor.shiftNext();else{var rowInd = this.row.rowIndex;if (!rowInd)return;var nrow=this._nextRow(rowInd-1,1);if (nrow)this.selectCell(nrow,this.cell._cellIndex,true);}
 }
 
 this.attachEvent("onFilterStart",function(){if (this._groups)this._groups=this.undefined;return true;});this.attachEvent("onFilterEnd",function(){if (typeof this._gIndex != "undefined")this.groupBy(this._gIndex,this._gmask.origin);});this.sortRows_bg=this.sortRows;this.sortRows=function(ind,type,dir){if (typeof(this._groups)=="undefined") return this.sortRows_bg.apply(this,arguments);this.callEvent("onBeforeSorting",[ind,(type||"str"),(dir||"asc")]);}
 this.attachEvent("onBeforeSorting",function(ind,type,dir){if (typeof(this._groups)=="undefined") return true;if (ind==this._gIndex)this._sortByGroup(ind,type,dir);else this._sortInGroup(ind,type,dir);this.setSortImgState(true,ind,dir)
 if (this._fake){this._mirror_rowsCol();this._fake._groups=[];this._fake._reset_view();}
 this.setSortImgState(true,ind,dir);this.callEvent("onAfterSorting",[ind,type,dir]);return false;});this.attachEvent("onClearAll",function(){this.unGroup();});this.attachEvent("onBeforeRowDeleted",function(id){if (!this._groups)return true;if (!this.rowsAr[id])return true;var val=this.cells(id,this._gIndex).getValue();if (val==="")val=" ";var z=this._groups[val];this._dec_group(z);return true;});this.attachEvent("onAfterRowDeleted",function(id){this.updateGroups();});this.attachEvent("onCheckbox",function(id,index,value){this.callEvent("onEditCell",[2,id,index,(value?1:0),(value?0:1)]);});this.attachEvent("onXLE",this.updateGroups);this.attachEvent("onColumnHidden",this.hideGroupColumn);this.attachEvent("onEditCell",function(stage,id,ind,val,oldval){if (!this._groups)return true;if (stage==2 && val!=oldval && ind==this._gIndex){if (oldval==="")oldval=" ";this._dec_group(this._groups[oldval]);var r=this.rowsAr[id];var i=this.rowsCol._dhx_find(r)
 var ni=this._inc_group(val);var n=this.rowsCol[ni];if (r==n)n=n.nextSibling;var p=r.parentNode;var o=r.rowIndex;p.removeChild(r);if (n)p.insertBefore(r,n);else
 p.appendChild(r);this.rowsCol._dhx_insertAt(ni,r);if (ni<i)i++;this.rowsCol._dhx_removeAt(i,r);this._fixAlterCss();}else if (stage==2 && val!=oldval){this.updateGroups();this._updateGroupView(this._groups[this.cells(id,this._gIndex).getValue()||" "]);}
 return true;})
 this.__sortRowsBG=true;}
 
 
 this._groupExisting();if (this._hrrar)for (var i=0;i<this._hrrar.length;i++)if (this._hrrar[i])this.hideGroupColumn(i,true);this.callEvent("onGroup",[]);if (this._ahgr || this._awdth)this.setSizes();}
dhtmlXGridObject.prototype._sortInGroup=function(col,type,order){var b=this._groups_get();b.reverse();for (var i=0;i<b.length;i++){var c=b[i]._cntr._childs;var a={};for (var j=0;j<c.length;j++){var cell = this.cells3(c[j],col);a[c[j].idd]=cell.getDate?cell.getDate():cell.getValue();}
 
 this._sortCore(col,type,order,a,c);}
 
 this._groups_put(b);this.setSizes();this.callEvent("onGridReconstructed",[])
}
dhtmlXGridObject.prototype._sortByGroup=function(col,type,order){var b=this._groups_get();var a=[];for (var i=0;i<b.length;i++){b[i].idd="_sort_"+i;a["_sort_"+i]=b[i]._cntr.text;}
 
 this._sortCore(col,type,order,a,b);this._groups_put(b);this.callEvent("onGridReconstructed",[])
 this.setSizes();}
dhtmlXGridObject.prototype._inc_group=function(val,hidden,skip){if (val==="")val=" ";if (!this._groups[val]){this._groups[val]={text:val,row:this._addPseudoRow(),count:0,state:hidden?"plus":"minus"};}
 var z=this._groups[val];z.row._cntr=z;var ind=this.rowsCol._dhx_find(z.row)+z.count+1;z.count++;if (!skip){this._updateGroupView(z);this.updateGroups();}
 return ind;}
dhtmlXGridObject.prototype._dec_group=function(z){if (!z)return;z.count--;if (z.count==0){z.row.parentNode.removeChild(z.row);this.rowsCol._dhx_removeAt(this.rowsCol._dhx_find(z.row));delete this._groups[z.text];}
 else
 this._updateGroupView(z);if (this._fake && !this._realfake)this._fake._dec_group(this._fake._groups[z.text]);this.updateGroups();return true;}
dhtmlXGridObject.prototype._insertRowAt_gA=dhtmlXGridObject.prototype._insertRowAt;dhtmlXGridObject.prototype._insertRowAt=function(r,ind,skip){if (typeof(this._groups)!="undefined"){if (this._realfake)var val=this._fake._bfs_cells(r.idd,this._gIndex).getValue();else
 if (this._bfs_cells3)var val=this._bfs_cells3(r,this._gIndex).getValue();else
 var val=this.cells3(r,this._gIndex).getValue();if (!val)val=" ";ind=this._inc_group(val,r.style.display=="none");}
 var res=this._insertRowAt_gA(r,ind,skip);if (typeof(this._groups)!="undefined"){this.expandGroup(val);this._updateGroupView(this._groups[val]);this.updateGroups();}
 return res;}
dhtmlXGridObject.prototype._updateGroupView=function(z){if (this._fake && !this._realfake)return z.row.firstChild.innerHTML="&nbsp;";var mask = this._gmask||this._fake._gmask;var html="<img style='margin-bottom:-4px' src='"+this.imgURL+z.state+".gif'> ";if (this.customGroupFormat)html+=this.customGroupFormat(z.text,z.count);else html+=z.text+" ( "+z.count+" ) ";z.row.childNodes[mask._title].innerHTML=html;}
dhtmlXGridObject.prototype._addPseudoRow=function(skip){var mask = this._gmask||this._fake._gmask;var r=mask.cloneNode(true)
 
 for (var i=0;i<r.childNodes.length;i++){r.childNodes[i]._cellIndex=mask.childNodes[i]._cellIndex;if (this._realfake)r.childNodes[i].style.display="";}
 var that=this;r.onclick=function(e){if (!that.callEvent("onGroupClick",[this._cntr.text]))
 return;if (that._fake && that._realfake)that._fake._switchGroupState(that._fake._groups[this._cntr.text].row);else
 that._switchGroupState(this);(e||event).cancelBubble="true";}
 r.ondblclick=function(e){(e||event).cancelBubble="true";}
 
 if (!skip){if (_isKHTML)this.obj.appendChild(r)
 else
 this.obj.firstChild.appendChild(r)
 this.rowsCol.push(r);}
 return r;}
dhtmlXGridObject.prototype._groups_get=function(){var b=[];this._temp_par=this.obj.parentNode;this._temp_par.removeChild(this.obj);var a=[];for (var i=this.rowsCol.length-1;i>=0;i--){if (this.rowsCol[i]._cntr){this.rowsCol[i]._cntr._childs=a;a=[];b.push(this.rowsCol[i]);}else a.push(this.rowsCol[i]);this.rowsCol[i].parentNode.removeChild(this.rowsCol[i]);}
 return b;}
dhtmlXGridObject.prototype._groups_put=function(b){var sts = this.rowsCol.stablesort;this.rowsCol=new dhtmlxArray(0);this.rowsCol.stablesort = sts;for (var i=0;i<b.length;i++){var gr=b[i]._cntr;this.obj.firstChild.appendChild(gr.row);this.rowsCol.push(gr.row)
 gr.row.idd=null;for (var j=0;j<gr._childs.length;j++){this.obj.firstChild.appendChild(gr._childs[j]);this.rowsCol.push(gr._childs[j])
 }
 delete gr._childs;}
 this._temp_par.appendChild(this.obj);}
dhtmlXGridObject.prototype._groupExisting=function(b){if (!this.getRowsNum()) return;var b=[];this._temp_par=this.obj.parentNode;this._temp_par.removeChild(this.obj);var a=[];var mlen=this.rowsCol.length;for (var i=0;i<mlen;i++){var val=this.cells4(this.rowsCol[i].childNodes[this._gIndex]).getValue();this.rowsCol[i].style.display = "";if (!val)val=" ";if (!this._groups[val]){this._groups[val]={text:val,row:this._addPseudoRow(true),count:0,state:"minus"};var z=this._groups[val];z.row._cntr=z;this._groups[val]._childs=[];b.push(z.row)
 }
 
 this._groups[val].count++;this._groups[val]._childs.push(this.rowsCol[i]);this.rowsCol[i].parentNode.removeChild(this.rowsCol[i]);}
 for (var i=0;i<b.length;i++)this._updateGroupView(b[i]._cntr)
 this._groups_put(b);if (this._fake && !this._realfake){this._mirror_rowsCol();this._fake._groups=[];this._fake._reset_view();}
 this.callEvent("onGridReconstructed",[])
 this.updateGroups();}
dhtmlXGridObject.prototype._switchGroupState=function(row){var z=row._cntr;if (this._fake && !this._realfake){z.state=this._fake._groups[row._cntr.text].row._cntr.state;this._fake._switchGroupState(this._fake._groups[row._cntr.text].row)
 }
 
 var ind=this.rowsCol._dhx_find(z.row)+1;z.state=z.state=="minus"?"plus":"minus";var st=z.state=="plus"?"none":"";while(this.rowsCol[ind] && !this.rowsCol[ind]._cntr){this.rowsCol[ind].style.display=st;ind++;}
 this._updateGroupView(z);this.callEvent("onGroupStateChanged",[z.text, (z.state=="minus")]);this.setSizes();}
dhtmlXGridObject.prototype.expandGroup=function(val){if (this._groups[val].state=="plus")this._switchGroupState(this._groups[val].row);}
dhtmlXGridObject.prototype.collapseGroup=function(val){if (this._groups[val].state=="minus")this._switchGroupState(this._groups[val].row);}
dhtmlXGridObject.prototype.expandAllGroups=function(){for(var i in this._groups)if (this._groups[i] && this._groups[i].state=="plus")this._switchGroupState(this._groups[i].row);}
dhtmlXGridObject.prototype.collapseAllGroups=function(){for(var i in this._groups)if (this._groups[i] && this._groups[i].state=="minus")this._switchGroupState(this._groups[i].row);}
dhtmlXGridObject.prototype.hideGroupColumn=function(ind,state){if (this._fake)return;var rind=-1;var row = this._gmask.childNodes;for (var i=0;i<row.length;i++)if (row[i]._cellIndex==ind){rind = i;break;}
 if (rind == -1)return;for (var a in this._groups)this._groups[a].row.childNodes[rind].style.display=state?"none":"";};dhtmlXGridObject.prototype.groupStat=function(name,ind,math){math = this["_g_"+(math||"stat_total")];var summ=0;var index=0;this.forEachRowInGroup(name,function(id){summ=math(summ,this.cells(id,ind).getValue()*1,index)
 index++;})
 return summ;}
dhtmlXGridObject.prototype.forEachRowInGroup=function(name,code){var row=this._groups[name].row.nextSibling;if (row){while (row && !row._cntr){code.call(this,row.idd);row=row.nextSibling;}
 }else {var cs=this._groups[name]._childs;if (cs)for (var i=0;i<cs.length;i++)code.call(this,cs[i].idd);}
};dhtmlXGridObject.prototype.updateGroups=function(){if (!this._gmask || !this._gmask._math || this._parsing)return;var r=this._gmask.childNodes;for (var i=0;i<r.length;i++)if (r[i]._counter)this._b_processing.apply(this,r[i]._counter)
}
dhtmlXGridObject.prototype._b_processing=function(a,ind,rind){var c=0,j=0;if (!this._ecache[this.cellType[ind]])this.cells5({parentNode:{grid:this}},this.cellType[ind]);for (var i=this.rowsCol.length-1;i>=0;i--){if (!this.rowsCol[i]._cntr){c=a(c,this.cells3(this.rowsCol[i],ind).getValue()*1,j);j++;}else {this.cells5(this.rowsCol[i].childNodes[rind],this.cellType[ind]).setValue(c);j=c=0;}
 }
}
dhtmlXGridObject.prototype._g_stat_total=function(c,n,i){return c+n;}
dhtmlXGridObject.prototype._g_stat_min=function(c,n,i){if (!i)c=Infinity;return Math.min(c,n);}
dhtmlXGridObject.prototype._g_stat_max=function(c,n,i){if (!i)c=-Infinity;return Math.max(c,n);}
dhtmlXGridObject.prototype._g_stat_average=function(c,n,i){return (c*i+n)/(i+1);}
dhtmlXGridObject.prototype._g_stat_count=function(c,n,i){return c++;}
 






 dhtmlXGridObject.prototype.enableDragAndDrop=function(mode){if (mode=="temporary_disabled"){this.dADTempOff=false;mode=true;}
 else
 this.dADTempOff=true;this.dragAndDropOff=convertStringToBoolean(mode);this._drag_validate=true;if (mode)this.objBox.ondragstart = function (e) {(e||event).cancelBubble = true;return false;}
 };dhtmlXGridObject.prototype.setDragBehavior=function(mode){this.dadmodec=this.dadmodefix=0;switch (mode) {case "child": this.dadmode=0;this._sbmod=false;break;case "sibling": this.dadmode=1;this._sbmod=false;break;case "sibling-next": this.dadmode=1;this._sbmod=true;break;case "complex": this.dadmode=2;this._sbmod=false;break;case "complex-next": this.dadmode=2;this._sbmod=true;break;}};dhtmlXGridObject.prototype.enableDragOrder=function(mode){this._dndorder=convertStringToBoolean(mode);};dhtmlXGridObject.prototype._checkParent=function(row,ids){var z=this._h2.get[row.idd].parent;if (!z.parent)return;for (var i=0;i<ids.length;i++)if (ids[i]==z.id)return true;return this._checkParent(this.rowsAr[z.id],ids);}
dhtmlXGridObject.prototype._createDragNode=function(htmlObject,e){this.editStop();if (window.dhtmlDragAndDrop.dragNode)return null;if (!this.dADTempOff)return null;htmlObject.parentObject=new Object();htmlObject.parentObject.treeNod=this;var text=this.callEvent("onBeforeDrag",[htmlObject.parentNode.idd,htmlObject._cellIndex, e]);if (!text)return null;var z=new Array();z=this.getSelectedId();z=(((z)&&(z!=""))?z.split(this.delim):[]);var exst=false;for (var i=0;i<z.length;i++)if (z[i]==htmlObject.parentNode.idd)exst=true;if (!exst){this.selectRow(this.rowsAr[htmlObject.parentNode.idd],false,e.ctrlKey,false);if (!e.ctrlKey){z=[];}
 z[this.selMultiRows?z.length:0]=htmlObject.parentNode.idd;}
 
 if (this.isTreeGrid()){for (var i=z.length-1;i>=0;i--)if (this._checkParent(this.rowsAr[z[i]],z)) z.splice(i,1);}
 

 var self=this;if (z.length && this._dndorder)z.sort(function(a,b){return (self.rowsAr[a].rowIndex>self.rowsAr[b].rowIndex?1:-1);});var el = this.getFirstParentOfType(_isIE?e.srcElement:e.target,"TD");if (el)this._dndExtra=el._cellIndex;this._dragged=new Array();for (var i=0;i<z.length;i++)if (this.rowsAr[z[i]]){this._dragged[this._dragged.length]=this.rowsAr[z[i]];this.rowsAr[z[i]].treeNod=this;}
 htmlObject.parentObject.parentNode=htmlObject.parentNode;var dragSpan=document.createElement('div');dragSpan.innerHTML=(text!==true?text:this.rowToDragElement(htmlObject.parentNode.idd));dragSpan.style.position="absolute";dragSpan.className="dragSpanDiv";return dragSpan;}
dhtmlXGridObject.prototype._createSdrgc=function(){this._sdrgc=document.createElement("DIV");this._sdrgc.innerHTML="&nbsp;";this._sdrgc.className="gridDragLine";this.objBox.appendChild(this._sdrgc);}
function dragContext(a,b,c,d,e,f,j,h,k,l){this.source=a||"grid";this.target=b||"grid";this.mode=c||"move";this.dropmode=d||"child";this.sid=e||0;this.tid=f;this.sobj=j||null;this.tobj=h||null;this.sExtra=k||null;this.tExtra=l||null;return this;}
dragContext.prototype.valid=function(){if (this.sobj!=this.tobj)return true;if (this.sid==this.tid)return false;if (this.target=="treeGrid"){var z=this.tid
 while (z = this.tobj.getParentId(z)){if (this.sid==z)return false;}
 }
 return true;}
dragContext.prototype.close=function(){this.sobj=null;this.tobj=null;}
dragContext.prototype.copy=function(){return new dragContext(this.source,this.target,this.mode,this.dropmode,this.sid,this.tid,this.sobj,this.tobj,this.sExtra,this.tExtra);}
dragContext.prototype.set=function(a,b){this[a]=b;return this;}
dragContext.prototype.uid=function(a,b){this.nid=this.sid;while (this.tobj.rowsAr[this.nid])this.nid=this.nid+((new Date()).valueOf());return this;}
dragContext.prototype.data=function(){if (this.sobj==this.tobj)return this.sobj._getRowArray(this.sobj.rowsAr[this.sid]);if (this.source=="tree")return this.tobj.treeToGridElement(this.sobj,this.sid,this.tid);else
 return this.tobj.gridToGrid(this.sid,this.sobj,this.tobj);}
dragContext.prototype.attrs=function(){if (this.source=="tree")return {};else
 return this.sobj.rowsAr[this.sid]._attrs;}
dragContext.prototype.childs=function(){if (this.source=="treeGrid")return this.sobj._h2.get[this.sid]._xml_await?this.sobj._h2.get[this.sid].has_kids:null;return null;}
dragContext.prototype.pid=function(){if (!this.tid)return 0;if (!this.tobj._h2)return 0;if (this.target=="treeGrid")if (this.dropmode=="child")return this.tid;else{var z=this.tobj.rowsAr[this.tid];var apid=this.tobj._h2.get[z.idd].parent.id;if ((this.alfa)&&(this.tobj._sbmod)&&(z.nextSibling)){var zpid=this.tobj._h2.get[z.nextSibling.idd].parent.id;if (zpid==this.tid)return this.tid;if (zpid!=apid)return zpid;}
 return apid;}
}
dragContext.prototype.ind=function(){if (this.tid==window.unknown)return this.tobj.rowsBuffer.length;if (this.target=="treeGrid"){if (this.dropmode=="child")this.tobj.openItem(this.tid);else
 this.tobj.openItem(this.tobj.getParentId(this.tid));}
 var ind=this.tobj.rowsBuffer._dhx_find(this.tobj.rowsAr[this.tid]);if ((this.alfa)&&(this.tobj._sbmod)&&(this.dropmode=="sibling")){var z=this.tobj.rowsAr[this.tid];if ((z.nextSibling)&&(this._h2.get[z.nextSibling.idd].parent.id==this.tid))
 return ind+1;}
 return (ind+1+((this.target=="treeGrid" && ind>=0 && this.tobj._h2.get[this.tobj.rowsBuffer[ind].idd].state=="minus")?this.tobj._getOpenLenght(this.tobj.rowsBuffer[ind].idd,0):0));}
dragContext.prototype.img=function(){if ((this.target!="grid")&&(this.sobj._h2))
 return this.sobj.getItemImage(this.sid);else return null;}
dragContext.prototype.slist=function(){var res=new Array();for (var i=0;i<this.sid.length;i++)res[res.length]=this.sid[i][(this.source=="tree")?"id":"idd"];return res.join(",");}
dhtmlXGridObject.prototype._drag=function(sourceHtmlObject,dhtmlObject,targetHtmlObject,lastLanding){if (this._realfake)return this._fake._drag() 
 
 var z=(this.lastLanding)
 
 if (this._autoOpenTimer)window.clearTimeout(this._autoOpenTimer);var r1=targetHtmlObject.parentNode;var r2=sourceHtmlObject.parentObject;if (!r1.idd){r1.grid=this;this.dadmodefix=0;}
 var c=new dragContext(0,0,0,((r1.grid.dadmode==1 || r1.grid.dadmodec)?"sibling":"child"));if (r2 && r2.childNodes)c.set("source","tree").set("sobj",r2.treeNod).set("sid",c.sobj._dragged);else{if (!r2)return true;if (r2.treeNod.isTreeGrid && r2.treeNod.isTreeGrid())
 c.set("source","treeGrid");c.set("sobj",r2.treeNod).set("sid",c.sobj._dragged);}
 if (r1.grid.isTreeGrid())
 c.set("target","treeGrid");else
 c.set("dropmode","sibling");c.set("tobj",r1.grid).set("tid",r1.idd);if (((c.tobj.dadmode==2)&&(c.tobj.dadmodec==1))&&(c.tobj.dadmodefix<0))
 if (c.tobj.obj.rows[1].idd!=c.tid)c.tid=r1.previousSibling.idd;else c.tid=0;var el = this.getFirstParentOfType(lastLanding,"TD")
 if (el)c.set("tExtra",el._cellIndex);if (el)c.set("sExtra",c.sobj._dndExtra);if (c.sobj.dpcpy)c.set("mode","copy");if (c.tobj._realfake)c.tobj=c.tobj._fake;if (c.sobj._realfake)c.sobj=c.sobj._fake;c.tobj._clearMove();if (r2 && r2.treeNod && r2.treeNod._nonTrivialRow)r2.treeNod._nonTrivialRow(this,c.tid,c.dropmode,r2);else {c.tobj.dragContext=c;if (!c.tobj.callEvent("onDrag",[c.slist(),c.tid,c.sobj,c.tobj,c.sExtra,c.tExtra])) return c.tobj.dragContext=null;var result=new Array();if (typeof(c.sid)=="object"){var nc=c.copy();for (var i=0;i<c.sid.length;i++){if (!nc.set("alfa",(!i)).set("sid",c.sid[i][(c.source=="tree"?"id":"idd")]).valid()) continue;nc.tobj._dragRoutine(nc);if (nc.target=="treeGrid" && nc.dropmode == "child")nc.tobj.openItem(nc.tid);result[result.length]=nc.nid;nc.set("dropmode","sibling").set("tid",nc.nid);}
 nc.close();}
 else
 c.tobj._dragRoutine(c);if (c.tobj.laterLink)c.tobj.laterLink();c.tobj.callEvent("onDrop",[c.slist(),c.tid,result.join(","),c.sobj,c.tobj,c.sExtra,c.tExtra]);}
 c.tobj.dragContext=null;c.close();}
dhtmlXGridObject.prototype._dragRoutine=function(c){if ((c.sobj==c.tobj)&&(c.source=="grid")&&(c.mode=="move")&&!this._fake){if (c.sobj._dndProblematic)return;var fr=c.sobj.rowsAr[c.sid];var bind=c.sobj.rowsCol._dhx_find(fr);c.sobj.rowsCol._dhx_removeAt(c.sobj.rowsCol._dhx_find(fr));c.sobj.rowsBuffer._dhx_removeAt(c.sobj.rowsBuffer._dhx_find(fr));c.sobj.rowsBuffer._dhx_insertAt(c.ind(),fr);if (c.tobj._fake){c.tobj._fake.rowsCol._dhx_removeAt(bind);var tr=c.tobj._fake.rowsAr[c.sid];tr.parentNode.removeChild(tr);}
 c.sobj._insertRowAt(fr,c.ind());c.nid=c.sid;c.sobj.callEvent("onGridReconstructed",[]);return;}
 var new_row;if (this._h2 && typeof c.tid !="undefined" && c.dropmode=="sibling" && (this._sbmod || c.tid)){if (c.alfa && this._sbmod && this._h2.get[c.tid].childs.length){this.openItem(c.tid)
 new_row=c.uid().tobj.addRowBefore(c.nid,c.data(),this._h2.get[c.tid].childs[0].id,c.img(),c.childs());}
 else
 new_row=c.uid().tobj.addRowAfter(c.nid,c.data(),c.tid,c.img(),c.childs());}
 else
 new_row=c.uid().tobj.addRow(c.nid,c.data(),c.ind(),c.pid(),c.img(),c.childs());new_row._attrs = c.attrs();if (c.source=="tree"){this.callEvent("onRowAdded",[c.nid]);var sn=c.sobj._globalIdStorageFind(c.sid);if (sn.childsCount){var nc=c.copy().set("tid",c.nid).set("dropmode",c.target=="grid"?"sibling":"child");for(var j=0;j<sn.childsCount;j++){c.tobj._dragRoutine(nc.set("sid",sn.childNodes[j].id));if (c.mode=="move")j--;}
 nc.close();}
 }
 else{c.tobj._copyUserData(c);this.callEvent("onRowAdded",[c.nid]);if ((c.source=="treeGrid")){if (c.sobj==c.tobj)new_row._xml=c.sobj.rowsAr[c.sid]._xml;var snc=c.sobj._h2.get[c.sid];if ((snc)&&(snc.childs.length)){var nc=c.copy().set("tid",c.nid);if(c.target=="grid")nc.set("dropmode","sibling");else {nc.tobj.openItem(c.tid);nc.set("dropmode","child");}
 var l=snc.childs.length;for(var j=0;j<l;j++){c.sobj.render_row_tree(null,snc.childs[j].id);c.tobj._dragRoutine(nc.set("sid",snc.childs[j].id));if (l!=snc.childs.length){j--;l=snc.childs.length;}
 }
 nc.close();}
 }
 }
 if (c.mode=="move"){c.sobj[(c.source=="tree")?"deleteItem":"deleteRow"](c.sid);if ((c.sobj==c.tobj)&&(!c.tobj.rowsAr[c.sid])) {c.tobj.changeRowId(c.nid,c.sid);c.nid=c.sid;}
 }
}
dhtmlXGridObject.prototype.gridToGrid = function(rowId,sgrid,tgrid){var z=new Array();for (var i=0;i<sgrid.hdr.rows[0].cells.length;i++)z[i]=sgrid.cells(rowId,i).getValue();return z;}
dhtmlXGridObject.prototype.checkParentLine=function(node,id){if ((!this._h2)||(!id)||(!node)) return false;if (node.id==id)return true;else return this.checkParentLine(node.parent,id);}
dhtmlXGridObject.prototype._dragIn=function(htmlObject,shtmlObject,x,y){if (!this.dADTempOff)return 0;var tree=this.isTreeGrid();var obj=shtmlObject.parentNode.idd?shtmlObject.parentNode:shtmlObject.parentObject;if (this._drag_validate){if(htmlObject.parentNode==shtmlObject.parentNode)return 0;if ((tree)&&(this==obj.grid)&&((this.checkParentLine(this._h2.get[htmlObject.parentNode.idd],shtmlObject.parentNode.idd))))
 return 0;}
 if (!this.callEvent("onDragIn",[obj.idd||obj.id,htmlObject.parentNode.idd,obj.grid||obj.treeNod,(htmlObject.grid||htmlObject.parentNode.grid)]))
 return this._setMove(htmlObject,x,y,true);this._setMove(htmlObject,x,y);if ((tree)&&(htmlObject.parentNode.expand!="")){this._autoOpenTimer=window.setTimeout(new callerFunction(this._autoOpenItem,this),1000);this._autoOpenId=htmlObject.parentNode.idd;}
 else
 if (this._autoOpenTimer)window.clearTimeout(this._autoOpenTimer);return htmlObject;}
dhtmlXGridObject.prototype._autoOpenItem=function(e,gridObject){gridObject.openItem(gridObject._autoOpenId);}
dhtmlXGridObject.prototype._dragOut=function(htmlObject){this._clearMove();var obj=htmlObject.parentNode.parentObject?htmlObject.parentObject.id:htmlObject.parentNode.idd;this.callEvent("onDragOut",[obj]);if (this._autoOpenTimer)window.clearTimeout(this._autoOpenTimer);}
dhtmlXGridObject.prototype._setMove=function(htmlObject,x,y,skip){if (!htmlObject.parentNode.idd)return;var a1=getAbsoluteTop(htmlObject);var a2=getAbsoluteTop(this.objBox);if ( (a1-a2)>(parseInt(this.objBox.offsetHeight)-50) )
 this.objBox.scrollTop=parseInt(this.objBox.scrollTop)+20;if ( (a1-a2+parseInt(this.objBox.scrollTop))<(parseInt(this.objBox.scrollTop)+30) )
 this.objBox.scrollTop=parseInt(this.objBox.scrollTop)-20;if (skip)return 0;if (this.dadmode==2){var z=y-a1+(document.body.scrollTop||document.documentElement.scrollTop)-2-htmlObject.offsetHeight/2;if ((Math.abs(z)-htmlObject.offsetHeight/6)>0)
 {this.dadmodec=1;if (z<0)this.dadmodefix=-1;else this.dadmodefix=1;}
 else this.dadmodec=0;}
 else
 this.dadmodec=this.dadmode;if (this.dadmodec){if (!this._sdrgc)this._createSdrgc();this._sdrgc.style.display="block";this._sdrgc.style.top=a1-a2+parseInt(this.objBox.scrollTop)+((this.dadmodefix>=0)?htmlObject.offsetHeight:0)+"px";}
 else{this._llSelD=htmlObject;if (htmlObject.parentNode.tagName=="TR")for (var i=0;i<htmlObject.parentNode.childNodes.length;i++){var z= htmlObject.parentNode.childNodes[i];z._bgCol=z.style.backgroundColor;z.style.backgroundColor="#FFCCCC";}
 }
}
dhtmlXGridObject.prototype._clearMove=function(){if (this._sdrgc)this._sdrgc.style.display="none";if ((this._llSelD)&&(this._llSelD.parentNode.tagName=="TR")){var coll = this._llSelD.parentNode.childNodes;for (var i=0;i<coll.length;i++)coll[i].style.backgroundColor=coll[i]._bgCol;}

 this._llSelD=null;}
dhtmlXGridObject.prototype.rowToDragElement=function(gridRowId){var out=this.cells(gridRowId,0).getValue();return out;}
dhtmlXGridObject.prototype._copyUserData = function(c){if(!c.tobj.UserData[c.nid] || c.tobj!=c.sobj)c.tobj.UserData[c.nid] = new Hashtable();else return;var z1 = c.sobj.UserData[c.sid];var z2 = c.tobj.UserData[c.nid];if (z1){z2.keys = z2.keys.concat(z1.keys);z2.values = z2.values.concat(z1.values);}
 }
dhtmlXGridObject.prototype.moveRow=function(rowId,mode,targetId,targetGrid){switch(mode){case "row_sibling":
 this.moveRowTo(rowId,targetId,"move","sibling",this,targetGrid);break;case "up":
 this.moveRowUp(rowId);break;case "down":
 this.moveRowDown(rowId);break;}
}
dhtmlXGridObject.prototype._nonTrivialNode=function(tree,targetObject,beforeNode,itemObject,z2)
{if ((tree.callEvent)&&(!z2))
 if (!tree.callEvent("onDrag",[itemObject.idd,targetObject.id,(beforeNode?beforeNode.id:null),this,tree])) return false;var gridRowId = itemObject.idd;var treeNodeId = gridRowId;while (tree._idpull[treeNodeId])treeNodeId+=(new Date()).getMilliseconds().toString();var img=(this.isTreeGrid()?this.getItemImage(gridRowId):"")
 if (beforeNode){for (i=0;i<targetObject.childsCount;i++)if (targetObject.childNodes[i]==beforeNode)break;if (i!=0)beforeNode=targetObject.childNodes[i-1];else{st="TOP";beforeNode="";}
 }
 var newone=tree._attachChildNode(targetObject,treeNodeId,this.gridToTreeElement(tree,treeNodeId,gridRowId),"",img,img,img,"","",beforeNode);if (this._h2){var akids=this._h2.get[gridRowId];if (akids.childs.length)for (var i=0;i<akids.childs.length;i++){this._nonTrivialNode(tree,newone,0,this.rowsAr[akids.childs[i].id],1);if (!this.dpcpy)i--;}
 }
 if (!this.dpcpy)this.deleteRow(gridRowId);if ((tree.callEvent)&&(!z2))
 tree.callEvent("onDrop",[treeNodeId,targetObject.id,(beforeNode?beforeNode.id:null),this,tree]);}
dhtmlXGridObject.prototype.gridToTreeElement = function(treeObj,treeNodeId,gridRowId){return this.cells(gridRowId,0).getValue();}
dhtmlXGridObject.prototype.treeToGridElement = function(treeObj,treeNodeId,gridRowId){var w=new Array();var z=this.cellType._dhx_find("tree");if (z==-1)z=0;for(var i=0;i<this.getColumnCount();i++)
 w[w.length]=(i!=z)?(treeObj.getUserData(treeNodeId,this.getColumnId(i))||""):treeObj.getItemText(treeNodeId);return w;}
dhtmlXGridObject.prototype.moveRowTo=function(srowId,trowId,mode,dropmode,sourceGrid,targetGrid){var c=new dragContext((sourceGrid||this).isTreeGrid()?"treeGrid":"grid",(targetGrid||this).isTreeGrid()?"treeGrid":"grid",mode,dropmode||"sibling",srowId,trowId,sourceGrid||this,targetGrid||this);c.tobj._dragRoutine(c);c.close();return c.nid;}
dhtmlXGridObject.prototype.enableMercyDrag=function(mode){this.dpcpy=convertStringToBoolean(mode);};dhtmlXGridObject.prototype._process_xmlA=function(xml){if (!xml.doXPath){var t = new dtmlXMLLoaderObject(function(){});if (typeof xml == "string")t.loadXMLString(xml);else {if (xml.responseXML)t.xmlDoc=xml;else
 t.xmlDoc={};t.xmlDoc.responseXML=xml;}
 xml=t;}
 
 this._parsing=true;var top=xml.getXMLTopNode(this.xml.top)
 
 this._parseHead(top);var rows=xml.doXPath(this.xml.row,top)
 var cr=parseInt(xml.doXPath("//"+this.xml.top)[0].getAttribute("pos")||0);var total=parseInt(xml.doXPath("//"+this.xml.top)[0].getAttribute("total_count")||0);if (total && !this.rowsBuffer[total-1])this.rowsBuffer[total-1]=null;if (this.isTreeGrid()){this._get_xml_data = this._get_xml_dataA;this._process_xml_row = this._process_xml_rowA;return this._process_tree_xml(xml);}
 
 for (var i=0;i < rows.length;i++){if (this.rowsBuffer[i+cr])continue;var id=rows[i].getAttribute("id")||this.uid();this.rowsBuffer[i+cr]={idd:id, data:rows[i], _parser: this._process_xml_rowA, _locator:this._get_xml_dataA };this.rowsAr[id]=rows[i];}
 this.render_dataset();this._parsing=false;return xml.xmlDoc.responseXML?xml.xmlDoc.responseXML:xml.xmlDoc;}
dhtmlXGridObject.prototype._process_xmlB=function(xml){if (!xml.doXPath){var t = new dtmlXMLLoaderObject(function(){});if (typeof xml == "string")t.loadXMLString(xml);else {if (xml.responseXML)t.xmlDoc=xml;else
 t.xmlDoc={};t.xmlDoc.responseXML=xml;}
 xml=t;}
 
 this._parsing=true;var top=xml.getXMLTopNode(this.xml.top)
 
 this._parseHead(top);var rows=xml.doXPath(this.xml.row,top)
 var cr=parseInt(xml.doXPath("//"+this.xml.top)[0].getAttribute("pos")||0);var total=parseInt(xml.doXPath("//"+this.xml.top)[0].getAttribute("total_count")||0);if (total && !this.rowsBuffer[total-1])this.rowsBuffer[total-1]=null;if (this.isTreeGrid()){this._get_xml_data = this._get_xml_dataB;this._process_xml_row = this._process_xml_rowB;return this._process_tree_xml(xml);}
 
 for (var i=0;i < rows.length;i++){if (this.rowsBuffer[i+cr])continue;var id=rows[i].getAttribute("id")||this.uid();this.rowsBuffer[i+cr]={idd:id, data:rows[i], _parser: this._process_xml_rowB, _locator:this._get_xml_dataB };this.rowsAr[id]=rows[i];}
 this.render_dataset();this._parsing=false;return xml.xmlDoc.responseXML?xml.xmlDoc.responseXML:xml.xmlDoc;}
dhtmlXGridObject.prototype._process_xml_rowA=function(r,xml){var strAr = [];r._attrs=this._xml_attrs(xml);for(var j=0;j<this.columnIds.length;j++){var cid=this.columnIds[j];var cellVal=r._attrs[cid]||"";if (r.childNodes[j])r.childNodes[j]._attrs={};strAr.push(cellVal);}
 
 
 this._fillRow(r,(this._c_order?this._swapColumns(strAr):strAr));return r;}
dhtmlXGridObject.prototype._get_xml_dataA=function(data,ind){return data.getAttribute(this.getColumnId(ind));}
dhtmlXGridObject.prototype._process_xml_rowB=function(r,xml){var strAr = [];r._attrs=this._xml_attrs(xml);if (this._ud_enabled){var udCol = this.xmlLoader.doXPath("./userdata",xml);for (var i = udCol.length - 1;i >= 0;i--)this.setUserData(udCol[i].getAttribute("name"),udCol[i].firstChild?udCol[i].firstChild.data:"");}
 
 
 
 for (var jx=0;jx < xml.childNodes.length;jx++){var cellVal=xml.childNodes[jx];if (!cellVal.tagName)continue;var j=this.getColIndexById(cellVal.tagName);if (isNaN(j)) continue;var exc=cellVal.getAttribute("type");if (exc)r.childNodes[j]._cellType=exc;r.childNodes[j]._attrs=this._xml_attrs(cellVal);if (cellVal.getAttribute("xmlcontent"))
 {}
 else if (cellVal.firstChild)cellVal=cellVal.firstChild.data;else cellVal="";strAr[j]=cellVal;}
 for (var i=0;i < r.childNodes.length;i++){if (!r.childNodes[i]._attrs)r.childNodes[i]._attrs={};};this._fillRow(r,(this._c_order?this._swapColumns(strAr):strAr));return r;}
dhtmlXGridObject.prototype._get_xml_dataB=function(data,ind){var id=this.getColumnId(ind);data=data.firstChild;while (true){if (!data)return "";if (data.tagName==id)return (data.firstChild?data.firstChild.data:"")
 data=data.nextSibling;}
 return "";}
dhtmlXGridObject.prototype.attachHeaderA=dhtmlXGridObject.prototype.attachHeader;dhtmlXGridObject.prototype.attachHeader=function()
{this.attachHeaderA.apply(this,arguments);if (this._realfake)return true;this.formAutoSubmit();if (typeof(this.FormSubmitOnlyChanged)=="undefined")
 this.submitOnlyChanged(true);if (typeof(this._submitAR)=="undefined")
 this.submitAddedRows(true);var that=this;this._added_rows=[];this._deleted_rows=[];this.attachEvent("onRowAdded",function(id){that._added_rows.push(id);that.forEachCell(id,function(a){a.cell.wasChanged=true;})
 return true;});this.attachEvent("onBeforeRowDeleted",function(id){that._deleted_rows.push(id);return true;});this.attachHeader=this.attachHeaderA;}
dhtmlXGridObject.prototype.formAutoSubmit = function()
{this.parentForm = this.detectParentFormPresent();if (this.parentForm === false){return false;}
 if (this.formEventAttached)return;this.formInputs = new Array();var self = this;dhtmlxEvent(this.parentForm, 'submit', function() {if (self.entBox)self.parentFormOnSubmit();});this.formEventAttached = true;}
dhtmlXGridObject.prototype.parentFormOnSubmit = function()
{this.formCreateInputCollection();if (!this.callEvent("onBeforeFormSubmit",[])) return false;}
dhtmlXGridObject.prototype.submitOnlyChanged = function(mode)
{this.FormSubmitOnlyChanged = convertStringToBoolean(mode);}
dhtmlXGridObject.prototype.submitColumns=function(names){if (typeof names == "string")names=names.split(this.delim);this._submit_cols=names;}
dhtmlXGridObject.prototype.setFieldName=function(mask){mask=mask.replace(/\{GRID_ID\}/g,"'+a1+'");mask=mask.replace(/\{ROW_ID\}/g,"'+a2+'");mask=mask.replace(/\{ROW_INDEX\}/g,"'+this.getRowIndex(a2)+'");mask=mask.replace(/\{COLUMN_INDEX\}/g,"'+a3+'");mask=mask.replace(/\{COLUMN_ID\}/g,"'+this.getColumnId(a3)+'");this._input_mask=Function("a1","a2","a3","return '"+mask+"';");}
 
 

dhtmlXGridObject.prototype.submitSerialization = function(mode)
{this.FormSubmitSerialization = convertStringToBoolean(mode);}
dhtmlXGridObject.prototype.submitAddedRows = function(mode)
{this._submitAR = convertStringToBoolean(mode);}
dhtmlXGridObject.prototype.submitOnlySelected = function(mode)
{this.FormSubmitOnlySelected = convertStringToBoolean(mode);}
dhtmlXGridObject.prototype.submitOnlyRowID = function(mode)
{this.FormSubmitOnlyRowID = convertStringToBoolean(mode);}
dhtmlXGridObject.prototype.createFormInput = function(name,value){var input = document.createElement('input');input.type = 'hidden';if (this._input_mask && (typeof name != "string"))
 input.name=this._input_mask.apply(this,name);else
 input.name =((this.globalBox||this.entBox).id||'dhtmlXGrid')+'_'+name;input.value = value;this.parentForm.appendChild(input);this.formInputs.push(input);}
dhtmlXGridObject.prototype.createFormInputRow = function(r){var id=(this.globalBox||this.entBox).id;for (var j=0;j<this._cCount;j++){var foo_cell = this.cells3(r, j);if (((!this.FormSubmitOnlyChanged)|| foo_cell.wasChanged()) && (!this._submit_cols || this._submit_cols[j]))
 this.createFormInput(this._input_mask?[id,r.idd,j]:(r.idd+'_'+j),foo_cell.getValue());}
}
dhtmlXGridObject.prototype.formCreateInputCollection = function()
{if (this.parentForm == false){return false;}
 for (var i=0;i<this.formInputs.length;i++){this.parentForm.removeChild(this.formInputs[i]);}
 this.formInputs = new Array();if (this.FormSubmitSerialization){this.createFormInput("serialized",this.serialize());}else if (this.FormSubmitOnlySelected){if (this.FormSubmitOnlyRowID)this.createFormInput("selected",this.getSelectedId());else
 for(var i=0;i<this.selectedRows.length;i++)this.createFormInputRow(this.selectedRows[i]);}
 else{if (this._submitAR){if (this._added_rows.length)this.createFormInput("rowsadded",this._added_rows.join(","));if (this._deleted_rows.length)this.createFormInput("rowsdeleted",this._deleted_rows.join(","));}
 this.forEachRow(function(id){this.getRowById(id);this.createFormInputRow(this.rowsAr[id]);})
 
 }
}
dhtmlXGridObject.prototype.detectParentFormPresent = function()
{var parentForm = false;var parent = this.entBox;while(parent && parent.tagName && parent != document.body){if (parent.tagName.toLowerCase()== 'form') {parentForm = parent;break;}else {parent = parent.parentNode;}
 }
 return parentForm;}
dhtmlXGridObject.prototype.enableHeaderMenu=function(columns)
{if (typeof columns == "string")columns = columns.split(",");this._hm_config = columns;var that=this;this.attachEvent("onInit",function(){this.hdr.oncontextmenu = function(e){return that._doHContClick(e||window.event);};{
 this.startColResizeA=this.startColResize;this.startColResize=function(e){if (e.button==2 || (_isMacOS&&e.ctrlKey))
 return this._doHContClick(e)
 return this.startColResizeA(e);}
 }
 this._chm_ooc=this.obj.onclick;this._chm_hoc=this.hdr.onclick;this.hdr.onclick=function(e){if (e && ( e.button==2 || (_isMacOS&&e.ctrlKey))) return false;that._showHContext(false);return that._chm_hoc.apply(this,arguments)
 }
 this.obj.onclick=function(){that._showHContext(false);return that._chm_ooc.apply(this,arguments)
 }
 
 });dhtmlxEvent(document.body,"click",function(){if (that._hContext)that._showHContext(false);})
 if (this.hdr.rows.length)this.callEvent("onInit",[]);this.enableHeaderMenu=function(){};}
dhtmlXGridObject.prototype._doHContClick=function(ev)
{function mouseCoords(ev){if(ev.pageX || ev.pageY){return {x:ev.pageX, y:ev.pageY};}
 var d = ((_isIE)&&(document.compatMode != "BackCompat"))?document.documentElement:document.body;return {x:ev.clientX + d.scrollLeft - d.clientLeft,
 y:ev.clientY + d.scrollTop - d.clientTop
 };}
 this._createHContext();var coords = mouseCoords(ev);this._showHContext(true,coords.x,coords.y);ev[_isIE?"srcElement":"target"].oncontextmenu = function(e){(e||event).cancelBubble=true;return false;};ev.cancelBubble=true;if (ev.preventDefault)ev.preventDefault();return false;}
dhtmlXGridObject.prototype._createHContext=function()
{if (this._hContext)return this._hContext;var d = document.createElement("DIV");d.oncontextmenu = function(e){(e||event).cancelBubble=true;return false;};d.onclick=function(e){(e||event).cancelBubble=true;return true;}
 d.className="dhx_header_cmenu";d.style.width=d.style.height="5px";d.style.display="none";var a=[];var i=0;if (this._fake)i=this._fake._cCount;var true_ind=i;for (var i;i<this.hdr.rows[1].cells.length;i++){var c=this.hdr.rows[1].cells[i];if (!this._hm_config || (this._hm_config[i] && this._hm_config[i] != "false")){if (c.firstChild && c.firstChild.tagName=="DIV")var val=c.firstChild.innerHTML;else var val = c.innerHTML;val = val.replace(/<[^>]*>/gi,"");a.push("<div class='dhx_header_cmenu_item'><input type='checkbox' column='"+true_ind+"' len='"+(c.colSpan||1)+"' checked='true' />"+val+"</div>");}
 true_ind+=(c.colSpan||1);}
 d.innerHTML=a.join("");var that=this;var f=function(){var c=this.getAttribute("column");if (!this.checked && !that._checkLast(c)) return this.checked=true;if (that._realfake)that=that._fake;for (var i=0;i<this.getAttribute("len");i++)
 that.setColumnHidden((c*1+i*1),!this.checked);if(this.checked && that.getColWidth(c)==0) 
 that.adjustColumnSize(c);}
 for (var i=0;i<d.childNodes.length;i++)d.childNodes[i].firstChild.onclick=f;document.body.insertBefore(d,document.body.firstChild);this._hContext=d;d.style.position="absolute";d.style.zIndex=999;d.style.width='auto'
 d.style.height='auto'
 d.style.display='block';}
dhtmlXGridObject.prototype._checkLast=function(ind){for (var i=0;i < this._cCount;i++)if ((!this._hrrar || !this._hrrar[i])&&(i!=ind))
 return true;return false;}
dhtmlXGridObject.prototype._updateHContext=function()
{for (var i=0;i<this._hContext.childNodes.length;i++){var c=this._hContext.childNodes[i].firstChild;var col=c.getAttribute("column");if (this.isColumnHidden(col)|| (this.getColWidth(col)==0))
 c.checked=false;}
}
dhtmlXGridObject.prototype._showHContext=function(mode,x,y)
{if (mode && this.enableColumnMove){this._hContext.parentNode.removeChild(this._hContext);this._hContext=null;}
 this._createHContext();this._hContext.style.display=(mode?'block':'none');if (mode){this._updateHContext(true);this._hContext.style.left=x+"px";this._hContext.style.top=y+"px";}
 
}
function eXcell_math(cell){if (cell){this.cell = cell;this.grid = this.cell.parentNode.grid;}
 this.edit = function(){this.grid.editor = new eXcell_ed(this.cell);this.grid.editor.fix_self=true;this.grid.editor.getValue=this.cell.original?(function(){return this.cell.original}):this.getValue;this.grid.editor.setValue=this.setValue;this.grid.editor.edit();}
 this.isDisabled = function(){return !this.grid._mathEdit;}
 this.setValue = function(val){val=this.grid._compileSCL(val,this.cell,this.fix_self);if (this.grid._strangeParams[this.cell._cellIndex])this.grid.cells5(this.cell,this.grid._strangeParams[this.cell._cellIndex]).setValue(val);else{this.setCValue(val);this.cell._clearCell=false;}
 }
 this.getValue = function(){if (this.grid._strangeParams[this.cell._cellIndex])return this.grid.cells5(this.cell,this.grid._strangeParams[this.cell._cellIndex]).getValue();return this.cell.innerHTML;}
}
eXcell_math.prototype = new eXcell;dhtmlXGridObject.prototype._init_point_bm=dhtmlXGridObject.prototype._init_point;dhtmlXGridObject.prototype._init_point = function(){this._mat_links={};this._aggregators=[];this.attachEvent("onClearAll",function(){this._mat_links={};this._aggregators=[];})
 this.attachEvent("onCellChanged",function(id,ind){if (this._mat_links[id]){var cell=this._mat_links[id][ind];if (cell){for (var i=0;i<cell.length;i++)if (cell[i].parentNode)this.cells5(cell[i]).setValue(this._calcSCL(cell[i]));}
 }
 if (!this._parsing && this._aggregators[ind]){var pid=this._h2.get[id].parent.id;if (pid!=0){var ed=this.cells(pid,ind);ed.setValue(this._calcSCL(ed.cell));}
 }
 })
 this.attachEvent("onAfterRowDeleted",function(id,pid){if (pid!=0)if (!this._parsing && this._aggregators.length){for (var ind=0;ind < this._aggregators.length;ind++){if (this._aggregators[ind]){var ed=this.cells(pid,ind);ed.setValue(this._calcSCL(ed.cell));}
 };}
 return true;})
 this.attachEvent("onXLE",function(){for (var i=0;i < this._aggregators.length;i++){if (this._aggregators[i])this._h2.forEachChild(0,function(el){if (el.childs.length!=0){var ed=this.cells(el.id,i);ed.setValue(this._calcSCL(ed.cell));}
 },this);};})
 this._init_point=this._init_point_bm;if (this._init_point)this._init_point();}
dhtmlXGridObject.prototype.enableMathSerialization=function(status){this._mathSerialization=convertStringToBoolean(status);}
dhtmlXGridObject.prototype.setMathRound=function(digits){this._roundDl=digits;this._roundD=Math.pow(10,digits);}
dhtmlXGridObject.prototype.enableMathEditing=function(status){this._mathEdit=convertStringToBoolean(status);}
dhtmlXGridObject.prototype._calcSCL=function(cell){if (!cell._code)return this.cells5(cell).getValue();try{dhtmlx.agrid=this;var z=eval(cell._code);}catch(e){return ("#SCL");}
 if (this._roundD){var pre=Math.abs(z)<1?"0":"";if (z<0)pre="-"+pre;z=Math.round(Math.abs(z)*this._roundD).toString();if (z==0)return 0;if (this._roundDl>0){var n=z.length-this._roundDl;if (n<0){z=("000000000"+z).substring(9+n);n=0;}
 return (pre+z.substring(0,n)+"."+z.substring(n,z.length));}
 return pre+z;}
 return z;}
dhtmlXGridObject.prototype._countTotal=function(row,cell){var b=0;var z=this._h2.get[row];for (var i=0;i<z.childs.length;i++){if (!z.childs[i].buff)return b;if (z.childs[i].buff._parser){this._h2.forEachChild(row,function(el){if (el.childs.length==0)b+=parseFloat(this._get_cell_value(el.buff,cell),10);},this)
 return b;}
 b+=parseFloat(this._get_cell_value(z.childs[i].buff,cell),10);}
 return b;}
dhtmlXGridObject.prototype._compileSCL=function(code,cell,fix){if (code === null || code === window.undefined)return code;code=code.toString();if (code.indexOf("=")!=0) {this._reLink([],cell);if (fix)cell._code = cell.original = null;return code;}
 cell.original=code;var linked=null;code=code.replace("=","");if (code.indexOf("sum")!=-1){code=code.replace("sum","(dhtmlx.agrid._countTotal('"+cell.parentNode.idd+"',"+cell._cellIndex+"))");if (!this._aggregators)this._aggregators=[];this._aggregators[cell._cellIndex]="sum";cell._code=code;return this._parsing?"":this._calcSCL(cell);}
 if (code.indexOf("[[")!=-1){var test = /(\[\[([^\,]*)\,([^\]]*)]\])/g;dhtmlx.agrid=this;linked=linked||(new Array());code=code.replace(test,
 function ($0,$1,$2,$3){if ($2=="-")$2=cell.parentNode.idd;if ($2.indexOf("#")==0)
 $2=dhtmlx.agrid.getRowId($2.replace("#",""));linked[linked.length]=[$2,$3];return "(parseFloat(dhtmlx.agrid.cells(\""+$2+"\","+$3+").getValue(),10))";}
 );}
 
 if (code.indexOf(":")!=-1){var test = /:(\w+)/g;dhtmlx.agrid=this;var id=cell.parentNode.idd;linked=linked||(new Array());code=code.replace(test,
 function ($0,$1,$2,$3){linked[linked.length]=[id,dhtmlx.agrid.getColIndexById($1)];return '(parseFloat(dhtmlx.agrid.cells("'+id+'",dhtmlx.agrid.getColIndexById("'+$1+'")).getValue(),10))';}
 );}
 else{var test = /c([0-9]+)/g;dhtmlx.agrid=this;var id=cell.parentNode.idd;linked=linked||(new Array());code=code.replace(test,
 function ($0,$1,$2,$3){linked[linked.length]=[id,$1];return "(parseFloat(dhtmlx.agrid.cells(\""+id+"\","+$1+").getValue(),10))";}
 );}
 
 this._reLink(linked,cell);cell._code=code;return this._calcSCL(cell);}
dhtmlXGridObject.prototype._reLink=function(ar,cell){if (!ar.length)return;for (var i=0;i<ar.length;i++){if (!this._mat_links[ar[i][0]])this._mat_links[ar[i][0]]={};var t=this._mat_links[ar[i][0]];if (!t[ar[i][1]])t[ar[i][1]]=[];t[ar[i][1]].push(cell);}
}
if (_isKHTML){(function(){var default_replace = String.prototype.replace;String.prototype.replace = function(search,replace){if(typeof replace != "function"){return default_replace.apply(this,arguments)
 }
 var str = "" + this;var callback = replace;if(!(search instanceof RegExp)){var idx = str.indexOf(search);return (
 idx == -1 ? str :
 default_replace.apply(str,[search,callback(search, idx, str)])
 )
 }
 var reg = search;var result = [];var lastidx = reg.lastIndex;var re;while((re = reg.exec(str)) != null){var idx = re.index;var args = re.concat(idx, str);result.push(
 str.slice(lastidx,idx),
 callback.apply(null,args).toString()
 );if(!reg.global){lastidx += RegExp.lastMatch.length;break
 }else{lastidx = reg.lastIndex;}
 }
 result.push(str.slice(lastidx));return result.join("")
 }
 })();}
dhtmlXGridObject.prototype.insertColumn=function(ind,header,type,width,sort,align,valign,reserved,columnColor){ind=parseInt(ind);if (ind>this._cCount)ind=this._cCount;if (!this._cMod)this._cMod=this._cCount;this._processAllArrays(this._cCount,ind-1,[(header||"&nbsp;"),(width||100),(type||"ed"),(align||"left"),(valign||""),(sort||"na"),(columnColor||""),"",this._cMod,(width||100)]);this._processAllRows("_addColInRow",ind);if (typeof(header)=="object")
 for (var i=1;i < this.hdr.rows.length;i++){if (header[i-1]=="#rspan"){var pind=i-1;var found=false;var pz=null;while(!found){var pz=this.hdr.rows[pind];for (var j=0;j<pz.cells.length;j++)if (pz.cells[j]._cellIndex==ind){found=j;break;}
 pind--;}
 this.hdr.rows[pind+1].cells[j].rowSpan=(this.hdr.rows[pind].cells[j].rowSpan||1)+1;}
 else 
 this.setHeaderCol(ind,(header[i-1]||"&nbsp;"),i);}
 else
 this.setHeaderCol(ind,(header||"&nbsp;"));this.hdr.rows[0].cells[ind]
 this._cCount++;this._cMod++;this._master_row=null;this.setSizes();}
dhtmlXGridObject.prototype.deleteColumn=function(ind){ind=parseInt(ind);if (this._cCount==0)return;if (!this._cMod)this._cMod=this._cCount;if (ind>=this._cCount)return;this._processAllArrays(ind,this._cCount-1,[null,null,null,null,null,null,null,null,null,null,null]);this._processAllRows("_deleteColInRow",ind);this._cCount--;this._master_row=null;this.setSizes();}
dhtmlXGridObject.prototype._processAllRows = function(method,oldInd,newInd){this[method](this.obj.rows[0],oldInd,newInd,0);var z=this.hdr.rows.length;for (var i=0;i<z;i++)this[method](this.hdr.rows[i],oldInd,newInd,i);if (this.ftr){var z=this.ftr.firstChild.rows.length;for (var i=0;i<z;i++)this[method](this.ftr.firstChild.rows[i],oldInd,newInd,i);}
 this.forEachRow(function(id){if (this.rowsAr[id] && this.rowsAr[id].tagName=="TR")this[method](this.rowsAr[id],oldInd,newInd,-1);});}
dhtmlXGridObject.prototype._processAllArrays = function(oldInd,newInd,vals){var ars=["hdrLabels","initCellWidth","cellType","cellAlign","cellVAlign","fldSort","columnColor","_hrrar","_c_order"];if (this.cellWidthPX.length)ars.push("cellWidthPX");if (this.cellWidthPC.length)ars.push("cellWidthPC");if (this._col_combos)ars.push("_col_combos");if (this._mCols)ars[ars.length]="_mCols";if (this.columnIds)ars[ars.length]="columnIds";if (this._maskArr)ars.push("_maskArr");if (this._drsclmW)ars.push("_drsclmW");if (this._RaSeCol)ars.push("_RaSeCol");if (this.clists)ars.push("clists");if (this._validators && this._validators.data)ars.push(this._validators.data);ars.push("combos");if (this._customSorts)ars.push("_customSorts");if (this._aggregators)ars.push("_aggregators");var mode=(oldInd<=newInd);if (!this._c_order){this._c_order=new Array();var l=this._cCount;for (var i=0;i<l;i++)this._c_order[i]=i;}
 for (var i=0;i<ars.length;i++){var t=this[ars[i]]||ars[i];if (t){if (mode){var val=t[oldInd];for (var j=oldInd;j<newInd;j++)t[j]=t[j+1];t[newInd]=val;}else {var val=t[oldInd];for (var j=oldInd;j>(newInd+1);j--)
 t[j]=t[j-1];t[newInd+1]=val;}
 if (vals)t[newInd+(mode?0:1)]=vals[i];}
 }
}
dhtmlXGridObject.prototype.moveColumn = function(oldInd,newInd){newInd--;oldInd=parseInt(oldInd);newInd=parseInt(newInd);if (newInd<oldInd)var tInd=newInd+1;else var tInd=newInd;if (!this.callEvent("onBeforeCMove",[oldInd,tInd])) return false;if (oldInd==tInd)return;this.editStop();this._processAllRows("_moveColInRow",oldInd,newInd);this._processAllArrays(oldInd,newInd);if (this.fldSorted)this.setSortImgPos(this.fldSorted._cellIndex);this.callEvent("onAfterCMove",[oldInd,tInd]);};dhtmlXGridObject.prototype._swapColumns = function(cols){var z=new Array();for (var i=0;i<this._cCount;i++){var n=cols[this._c_order[i]];if (typeof(n)=="undefined") n="";z[i]=n;}
 return z;}
dhtmlXGridObject.prototype._moveColInRow = function(row,oldInd,newInd){var c=row.childNodes[oldInd];var ci=row.childNodes[newInd+1];if (!c)return;if (ci)row.insertBefore(c,ci);else
 row.appendChild(c);for (var i=0;i<row.childNodes.length;i++)row.childNodes[i]._cellIndex=row.childNodes[i]._cellIndexS=i;};dhtmlXGridObject.prototype._addColInRow = function(row,ind,old,mod){var cind=ind;if (row._childIndexes){if (row._childIndexes[ind-1]==row._childIndexes[ind] || !row.childNodes[row._childIndexes[ind-1]]){for (var i=row._childIndexes.length;i>=ind;i--)row._childIndexes[i]=i?(row._childIndexes[i-1]+1):0;row._childIndexes[ind]--;}
 else
 for (var i = row._childIndexes.length;i >= ind;i--)row._childIndexes[i]=i?(row._childIndexes[i-1]+1):0;var cind=row._childIndexes[ind];}
 var c=row.childNodes[cind];var z=document.createElement((mod)?"TD":"TH");if (mod){z._attrs={};}
 else z.style.width=(parseInt(this.cellWidthPX[ind])||"100")+"px";if (c)row.insertBefore(z,c);else
 row.appendChild(z);if (this.dragAndDropOff && row.idd)this.dragger.addDraggableItem(row.childNodes[cind],this);for (var i=cind+1;i<row.childNodes.length;i++){row.childNodes[i]._cellIndex=row.childNodes[i]._cellIndexS=row.childNodes[i]._cellIndex+1;}
 
 if (row.childNodes[cind])row.childNodes[cind]._cellIndex=row.childNodes[cind]._cellIndexS=ind;if (row.idd || typeof(row.idd)!="undefined"){this.cells3(row,ind).setValue("");z.align=this.cellAlign[ind];z.style.verticalAlign=this.cellVAlign[ind];z.bgColor=this.columnColor[ind];}
 else if (z.tagName=="TD"){if (!row.idd && this.forceDivInHeader)z.innerHTML="<div class='hdrcell'>&nbsp;</div>";else z.innerHTML="&nbsp;";}
};dhtmlXGridObject.prototype._deleteColInRow = function(row,ind){if (row._childIndexes)ind=row._childIndexes[ind];var c=row.childNodes[ind];if (!c)return;if (c.colSpan && c.colSpan>1 && c.parentNode.idd){var t=c.colSpan-1;var v=this.cells4(c).getValue();this.setColspan(c.parentNode.idd,c._cellIndex,1)
 if (t>1){var cind=c._cellIndex*1;this.setColspan(c.parentNode.idd,cind+1,t)
 this.cells(c.parentNode.idd,c._cellIndex*1+1).setValue(v)
 row._childIndexes.splice(cind,1)
 for (var i=cind;i < row._childIndexes.length;i++)row._childIndexes[i]-=1;}
 }else if (row._childIndexes){row._childIndexes.splice(ind,1);for (var i=ind;i<row._childIndexes.length;i++)row._childIndexes[i]--;}
 if (c)row.removeChild(c);for (var i=ind;i<row.childNodes.length;i++)row.childNodes[i]._cellIndex=row.childNodes[i]._cellIndexS=row.childNodes[i]._cellIndex-1;};dhtmlXGridObject.prototype.enableColumnMove = function(mode,columns){this._mCol=convertStringToBoolean(mode);if (typeof(columns)!="undefined")
 this._mCols=columns.split(",");if (!this._mmevTrue){dhtmlxEvent(this.hdr,"mousedown",this._startColumnMove);dhtmlxEvent(document.body,"mousemove",this._onColumnMove);dhtmlxEvent(document.body,"mouseup",this._stopColumnMove);this._mmevTrue=true;}
};dhtmlXGridObject.prototype._startColumnMove = function(e){e=e||event;var el = e.target||e.srcElement;var zel=el;while(zel.tagName!="TABLE")zel=zel.parentNode;var grid=zel.grid;if (!grid)return;grid.setActive();if (!grid._mCol || e.button==2)return;el = grid.getFirstParentOfType(el,"TD")
 if(el.style.cursor!="default")return true;if ((grid)&&(!grid._colInMove)){grid.resized = null;if ((!grid._mCols)||(grid._mCols[el._cellIndex]=="true"))
 grid._colInMove=el._cellIndex+1;}
 return true;};dhtmlXGridObject.prototype._onColumnMove = function(e){e=e||event;var grid=window.globalActiveDHTMLGridObject;if ((grid)&&(grid._colInMove)){if (grid._showHContext)grid._showHContext(false)
 if (typeof(grid._colInMove)!="object"){var z=document.createElement("DIV");z._aIndex=(grid._colInMove-1);z._bIndex=null;z.innerHTML=grid.getHeaderCol(z._aIndex);z.className="dhx_dragColDiv";z.style.position="absolute";document.body.appendChild(z);grid._colInMove=z;}
 
 var cor=[];cor[0]=(document.body.scrollLeft||document.documentElement.scrollLeft);cor[1]=(document.body.scrollTop||document.documentElement.scrollTop);grid._colInMove.style.left=e.clientX+cor[0]+8+"px";grid._colInMove.style.top=e.clientY+cor[1]+8+"px";var el = e.target||e.srcElement;while ((el)&&(typeof(el._cellIndexS)=="undefined"))
 el=el.parentNode;if (grid._colInMove._oldHe){grid._colInMove._oldHe.className=grid._colInMove._oldHe.className.replace(/columnTarget(L|R)/g,"");grid._colInMove._oldHe=null;grid._colInMove._bIndex=null;}
 if (el){if (grid.hdr.rows[1]._childIndexes)var he=grid.hdr.rows[1].cells[grid.hdr.rows[1]._childIndexes[el._cellIndexS]];else
 var he=grid.hdr.rows[1].cells[el._cellIndexS];var z=e.clientX-(getAbsoluteLeft(he)-grid.hdrBox.scrollLeft);if (z/he.offsetWidth>0.5){he.className+=" columnTargetR";grid._colInMove._bIndex=el._cellIndexS;}
 else {he.className+=" columnTargetL";grid._colInMove._bIndex=el._cellIndexS-1;}
 if (he.offsetLeft<(grid.objBox.scrollLeft+20))
 grid.objBox.scrollLeft=Math.max(0,he.offsetLeft-20);if ((he.offsetLeft+he.offsetWidth-grid.objBox.scrollLeft)>(grid.objBox.offsetWidth-20))
 grid.objBox.scrollLeft=Math.min(grid.objBox.scrollLeft+he.offsetWidth+20,grid.objBox.scrollWidth-grid.objBox.offsetWidth);grid._colInMove._oldHe=he;}
 
 e.cancelBubble = true;return false;}
 return true;};dhtmlXGridObject.prototype._stopColumnMove = function(e){e=e||event;var grid=window.globalActiveDHTMLGridObject;if ((grid)&&(grid._colInMove)){if (typeof(grid._colInMove)=="object"){grid._colInMove.parentNode.removeChild(grid._colInMove);if (grid._colInMove._bIndex!=null)grid.moveColumn(grid._colInMove._aIndex,grid._colInMove._bIndex+1);if (grid._colInMove._oldHe)grid._colInMove._oldHe.className=grid._colInMove._oldHe.className.replace(/columnTarget(L|R)/g,"");grid._colInMove._oldHe=null;grid._colInMove.grid=null;grid.resized = true;}
 grid._colInMove=0;}
 return true;};dhtmlXGridObject.prototype.loadCSVFile = function(path,afterCall){this.load(path,afterCall,"csv")
}
dhtmlXGridObject.prototype.enableCSVAutoID = function(mode){this._csvAID=convertStringToBoolean(mode);}
dhtmlXGridObject.prototype.enableCSVHeader = function(mode){this._csvHdr=convertStringToBoolean(mode);}
dhtmlXGridObject.prototype.setCSVDelimiter = function(str){this.csv.cell=str;}
dhtmlXGridObject.prototype._csvAID = true;dhtmlXGridObject.prototype.loadCSVString = function(str){this.parse(str,"csv")
}
dhtmlXGridObject.prototype.serializeToCSV = function(textmode){this.editStop()
 if (this._mathSerialization)this._agetm="getMathValue";else if (this._strictText || textmode)this._agetm="getTitle";else this._agetm="getValue";var out=[];if (this._csvHdr){for (var j=1;j < this.hdr.rows.length;j++){var a=[];for (var i=0;i<this._cCount;i++)if ((!this._srClmn)||(this._srClmn[i]))
 a.push(this.getColumnLabel(i,j-1));out.push(this.csvParser.str(a,this.csv.cell, this.csv.row));}
 }
 
 
 var i=0;var leni=this.rowsBuffer.length;for(i;i<leni;i++){var temp=this._serializeRowToCVS(null,i) 
 if (temp!="")out.push(temp);}
 return this.csvParser.block(out,this.csv.row);}
dhtmlXGridObject.prototype._serializeRowToCVS = function(r,i,start,end){var out = new Array();if (!r){r=this.render_row(i)
 if (this._fake && !this._fake.rowsAr[r.idd])this._fake.render_row(i);}
 

 if (!this._csvAID)out[out.length]=r.idd;start = start||0;end = end||this._cCount;var changeFl=false;var ind=start;while (r.childNodes[start]._cellIndex>ind && start)start--;for(var jj=start;ind<end;jj++){if (!r.childNodes[jj])break;var real_ind=r.childNodes[jj]._cellIndex;if ((!this._srClmn)||(this._srClmn[real_ind])){var cvx=r.childNodes[jj];var zx=this.cells(r.idd,real_ind);while (ind!=real_ind){ind++;out.push("")
 if (ind>=end)break;}
 if (ind>=end)break;ind++;if (zx.cell)zxVal=zx[this._agetm]();else zxVal="";if ((this._chAttr)&&(zx.wasChanged()))
 changeFl=true;out[out.length]=((zxVal===null)?"":zxVal)

 if ( this._ecspn && cvx.colSpan && cvx.colSpan >1 ){cvx=cvx.colSpan-1;for (var u=0;u<cvx;u++){out[out.length] = "";ind++;}
 }
 }else ind++;}
 if ((this._onlChAttr)&&(!changeFl)) return "";return this.csvParser.str(out,this.csv.cell, this.csv.row);}
dhtmlXGridObject.prototype.toClipBoard=function(val){if (window.clipboardData)window.clipboardData.setData("Text",val);else
 (new Clipboard()).copy(val);}
dhtmlXGridObject.prototype.fromClipBoard=function(){if (window.clipboardData)return window.clipboardData.getData("Text");else
 return (new Clipboard()).paste();}
dhtmlXGridObject.prototype.cellToClipboard = function(rowId,cellInd){if ((!rowId)||(!cellInd)){if (!this.selectedRows[0])return;rowId=this.selectedRows[0].idd;cellInd=this.cell._cellIndex;}
 
 var ed=this.cells(rowId,cellInd);this.toClipBoard(((ed.getLabel?ed.getLabel():ed.getValue())||"").toString());}
dhtmlXGridObject.prototype.updateCellFromClipboard = function(rowId,cellInd){if ((!rowId)||(!cellInd)){if (!this.selectedRows[0])return;rowId=this.selectedRows[0].idd;cellInd=this.cell._cellIndex;}
 var ed=this.cells(rowId,cellInd);ed[ed.setImage?"setLabel":"setValue"](this.fromClipBoard());}
dhtmlXGridObject.prototype.rowToClipboard = function(rowId){var out="";if (this._mathSerialization)this._agetm="getMathValue";else if (this._strictText)this._agetm="getTitle";else 
 this._agetm="getValue";if (rowId)out=this._serializeRowToCVS(this.getRowById(rowId));else {var data = [];for (var i=0;i<this.selectedRows.length;i++){data[data.length] = this._serializeRowToCVS(this.selectedRows[i]);out = this.csvParser.block(data, this.csv.row);}
 }
 this.toClipBoard(out);}
dhtmlXGridObject.prototype.updateRowFromClipboard = function(rowId){var csv=this.fromClipBoard();if (!csv)return;if (rowId)var r=this.getRowById(rowId);else
 var r=this.selectedRows[0];if (!r)return;var parser = this.csvParser;csv=parser.unblock(csv,this.csv.cell, this.csv.row)[0];if (!this._csvAID)csv.splice(0,1);for (var i=0;i<csv.length;i++){var ed=this.cells3(r,i);ed[ed.setImage?"setLabel":"setValue"](csv[i]);}
}
dhtmlXGridObject.prototype.csvParser={block:function(data,row){return data.join(row);},
 unblock:function(str,cell,row){var data = (str||"").split(row);for (var i=0;i < data.length;i++)data[i]=(data[i]||"").split(cell);var last = data.length-1;if (data[last].length == 1 && data[last][0]=="")data.splice(last,1);return data;},
 str:function(data,cell,row){return data.join(cell);}
};dhtmlXGridObject.prototype.csvExtParser={_quote:RegExp('"',"g"),
 _quote_esc:RegExp("\\\\\"","g"),
 block:function(data,row){return data.join(row);},
 unblock:function(str,cell,row){var out = [[]];var ind = 0;if (!str)return out;var quote_start = /^[ ]*"/;var quote_end = /"[ ]*$/;var row_exp = new RegExp(".*"+row+".*$");var data = str.split(cell);for (var i=0;i<data.length;i++){if (data[i].match(quote_start)){var buff = data[i].replace(quote_start, "");while (!data[i].match(quote_end)) {i++;buff+=data[i];}
 out[ind].push(buff.replace(quote_end, "").replace(this._quote_esc,'"'));}else if (data[i].match(row_exp)){var row_pos = data[i].indexOf(row);out[ind].push(data[i].substr(0, row_pos));ind++;out[ind] = [];data[i]=data[i].substr(row_pos+1);i--;}else {if (data[i] || i!=data.length-1)out[ind].push(data[i]);}
 }
 var last = out.length-1;if (last>0 && !out[last].length)out.splice(last,1);return out;},
 str:function(data,cell,row){for (var i=0;i < data.length;i++)data[i] = '"'+data[i].replace(this._quote, "\\\"")+'"';return data.join(cell);}
};dhtmlXGridObject.prototype.addRowFromClipboard = function(){var csv=this.fromClipBoard();if (!csv)return;var z=this.csvParser.unblock(csv, this.csv.cell, this.csv.row);for (var i=0;i<z.length;i++)if (z[i]){csv=z[i];if (!csv.length)continue;if (this._csvAID)this.addRow(this.getRowsNum()+2,csv);else{if (this.rowsAr[csv[0]])csv[0]=this.uid();this.addRow(csv[0],csv.slice(1));}
 }
}
dhtmlXGridObject.prototype.gridToClipboard = function(){this.toClipBoard(this.serializeToCSV());}
dhtmlXGridObject.prototype.gridFromClipboard = function(){var csv=this.fromClipBoard();if (!csv)return;this.loadCSVString(csv);}
dhtmlXGridObject.prototype.getXLS = function(path){if (!this.xslform){this.xslform=document.createElement("FORM");this.xslform.action=(path||"")+"xls.php";this.xslform.method="post";this.xslform.target=(_isIE?"_blank":"");document.body.appendChild(this.xslform);var i1=document.createElement("INPUT");i1.type="hidden";i1.name="csv";this.xslform.appendChild(i1);var i2=document.createElement("INPUT");i2.type="hidden";i2.name="csv_header";this.xslform.appendChild(i2);}
 var cvs = this.serializeToCSV();this.xslform.childNodes[0].value = cvs;var cvs_header = [];var l = this._cCount;for (var i=0;i<l;i++){cvs_header.push(this.getHeaderCol(i));}
 cvs_header = cvs_header.join(',');this.xslform.childNodes[1].value = cvs_header;this.xslform.submit();}
dhtmlXGridObject.prototype.printView = function(before,after){var html="<style>TD {font-family:Arial;text-align:center;padding-left:2px;padding-right:2px;}\n td.filter input, td.filter select {display:none;}\n </style>";var st_hr=null;if (this._fake){st_hr=[].concat(this._hrrar);for (var i=0;i<this._fake._cCount;i++)this._hrrar[i]=null;}
 html+="<base href='"+document.location.href+"'></base>";if (!this.parentGrid)html+=(before||"");html += '<table width="100%" border="2px" cellpadding="0" cellspacing="0">';var row_length = Math.max(this.rowsBuffer.length,this.rowsCol.length);var col_length = this._cCount;var width = this._printWidth();html += '<tr class="header_row_1">';for (var i=0;i<col_length;i++){if (this._hrrar && this._hrrar[i])continue;var hcell=this.hdr.rows[1].cells[this.hdr.rows[1]._childIndexes?this.hdr.rows[1]._childIndexes[parseInt(i)]:i];var colspan=(hcell.colSpan||1);var rowspan=(hcell.rowSpan||1);for (var j=1;j<colspan;j++)width[i]+=width[j];html += '<td rowspan="'+rowspan+'" width="'+width[i]+'%" style="background-color:lightgrey;" colspan="'+colspan+'">'+this.getHeaderCol(i)+'</td>';i+=colspan-1;}
 html += '</tr>';for (var i=2;i<this.hdr.rows.length;i++){if (_isIE){html+="<tr style='background-color:lightgrey' class='header_row_"+i+"'>";var cells=this.hdr.rows[i].childNodes;for (var j=0;j < cells.length;j++)if (!this._hrrar || !this._hrrar[cells[j]._cellIndex]){html+=cells[j].outerHTML;}
 html+="</tr>";}
 else
 html+="<tr class='header_row_"+i+"' style='background-color:lightgrey'>"+(this._fake?this._fake.hdr.rows[i].innerHTML:"")+this.hdr.rows[i].innerHTML+"</tr>";}
 for (var i=0;i<row_length;i++){html += '<tr>';if (this.rowsCol[i] && this.rowsCol[i]._cntr){html+=this.rowsCol[i].innerHTML.replace(/<img[^>]*>/gi,"")+'</tr>';continue;}
 if (this.rowsCol[i] && this.rowsCol[i].style.display=="none")continue;var row_id
 if (this.rowsCol[i])row_id=this.rowsCol[i].idd;else if (this.rowsBuffer[i])row_id=this.rowsBuffer[i].idd;else continue;for (var j=0;j<col_length;j++){if (this._hrrar && this._hrrar[j])continue;if(this.rowsAr[row_id] && this.rowsAr[row_id].tagName=="TR"){var c=this.cells(row_id, j);if (c._setState)var value="";else if (c.getContent)value = c.getContent();else if (c.getImage || c.combo)var value=c.cell.innerHTML;else var value = c.getValue();}else 
 var value=this._get_cell_value(this.rowsBuffer[i],j);var color = this.columnColor[j]?'background-color:'+this.columnColor[j]+';':'';var align = this.cellAlign[j]?'text-align:'+this.cellAlign[j]+';':'';var cspan = c.getAttribute("colspan");html += '<td style="'+color+align+'" '+(cspan?'colSpan="'+cspan+'"':'')+'>'+(value===""?"&nbsp;":value)+'</td>';if (cspan)j+=cspan-1;}
 html += '</tr>';if (this.rowsCol[i] && this.rowsCol[i]._expanded){var sub=this.cells4(this.rowsCol[i]._expanded.ctrl);if (sub.getSubGrid)html += '<tr><td colspan="'+col_length+'">'+sub.getSubGrid().printView()+'</td></tr>';else
 html += '<tr><td colspan="'+col_length+'">'+this.rowsCol[i]._expanded.innerHTML+'</td></tr>';}
 }
 if (this.ftr)for (var i=1;i<this.ftr.childNodes[0].rows.length;i++)html+="<tr style='background-color:lightgrey'>"+((this._fake)?this._fake.ftr.childNodes[0].rows[i].innerHTML:"")+this.ftr.childNodes[0].rows[i].innerHTML+"</tr>";html += '</table>';if (this.parentGrid)return html;html+=(after||"");var d = window.open('', '_blank');d.document.write(html);d.document.write("<script>window.onerror=function(){return true;}</script>");d.document.close();if (this._fake){this._hrrar=st_hr;}
}
dhtmlXGridObject.prototype._printWidth=function(){var width = [];var total_width = 0;for (var i=0;i<this._cCount;i++){var w = this.getColWidth(i);width.push(w);total_width += w;}
 var percent_width = [];var total_percent_width = 0;for (var i=0;i<width.length;i++){var p = Math.floor((width[i]/total_width)*100);total_percent_width += p;percent_width.push(p);}
 percent_width[percent_width.length-1] += 100-total_percent_width;return percent_width;}
dhtmlXGridObject.prototype.loadObject = function(obj){}
dhtmlXGridObject.prototype.loadJSONFile = function(path){}
dhtmlXGridObject.prototype.serializeToObject = function(){}
dhtmlXGridObject.prototype.serializeToJSON = function(){}
if (!window.clipboardData)window.clipboardData={_make:function(){var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);if (!clip)return null;var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);if (!trans)return null;trans.addDataFlavor('text/unicode');var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);this._p=[clip,trans,str];return true;},
 setData:function(type,text){try{netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');}catch(e){dhtmlxError.throwError("Clipboard","Access to clipboard denied",[type,text]);return "";}
 if (!this._make()) return false;this._p[2].data=text;this._p[1].setTransferData("text/unicode",this._p[2],text.length*2);var clipid=Components.interfaces.nsIClipboard;this._p[0].setData(this._p[1],null,clipid.kGlobalClipboard);},
 getData:function(type){try{netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');}catch(e){dhtmlxError.throwError("Clipboard","Access to clipboard denied",[type]);return "";}
 if (!this._make()) return false;this._p[0].getData(this._p[1],this._p[0].kGlobalClipboard);var strLength = new Object();var str = new Object();try{this._p[1].getTransferData("text/unicode",str,strLength);}catch(e){return "";}
 if (str)str = str.value.QueryInterface(Components.interfaces.nsISupportsString);if (str)return str.data.substring(0,strLength.value / 2);return "";}
}
dhtmlXGridObject.prototype.enableBlockSelection = function(mode)
{if (typeof this._bs_mode == "undefined"){var self = this;this.obj.onmousedown = function(e) {if (self._bs_mode)self._OnSelectionStart((e||event),this);return true;}
 this._CSVRowDelimiter = this.csv.row;this.attachEvent("onResize", function() {self._HideSelection();return true;});this.attachEvent("onGridReconstructed", function() {self._HideSelection();return true;});this.attachEvent("onFilterEnd",this._HideSelection);}
 if (mode===false){this._bs_mode=false;return this._HideSelection();}else this._bs_mode=true;}
dhtmlXGridObject.prototype.forceLabelSelection = function(mode)
{this._strictText = convertStringToBoolean(mode)
}
dhtmlXGridObject.prototype.disableBlockSelection = function()
{this.obj.onmousedown = null;}
 
dhtmlXGridObject.prototype._OnSelectionStart = function(event, obj)
{var self = this;if (event.button == 2)return;var src = event.srcElement || event.target;if (this.editor){if (src.tagName && (src.tagName=="INPUT" || src.tagName=="TEXTAREA")) return;this.editStop();}
 
 if (!self.isActive)self.setActive(true);var pos = this.getPosition(this.obj);var x = event.clientX - pos[0] + (document.body.scrollLeft||(document.documentElement?document.documentElement.scrollLeft:0));var y = event.clientY - pos[1] + (document.body.scrollTop||(document.documentElement?document.documentElement.scrollTop:0));this._CreateSelection(x-4, y-4);if (src == this._selectionObj){this._HideSelection();this._startSelectionCell = null;}else {while (src.tagName.toLowerCase()!= 'td')
 src = src.parentNode;this._startSelectionCell = src;}
 
 if (this._startSelectionCell){if (!this.callEvent("onBeforeBlockSelected",[this._startSelectionCell.parentNode.idd, this._startSelectionCell._cellIndex]))
 return this._startSelectionCell = null;}
 
 
 this.obj.onmousedown = null;this.obj[_isIE?"onmouseleave":"onmouseout"] = function(e){if (self._blsTimer)window.clearTimeout(self._blsTimer);};this.obj.onmmold=this.obj.onmousemove;this._init_pos=[x,y];this._selectionObj.onmousemove = this.obj.onmousemove = function(e) {e = e||event;e.returnValue = false;self._OnSelectionMove(e);}
 
 
 this._oldDMP=document.body.onmouseup;document.body.onmouseup = function(e) {e = e||event;self._OnSelectionStop(e, this);return true;}
 this.callEvent("onBeforeBlockSelection",[]);document.body.onselectstart = function(){return false};}
dhtmlXGridObject.prototype._getCellByPos = function(x,y){x=x;if (this._fake)x+=this._fake.entBox.offsetWidth;y=y;var _x=0;for (var i=0;i < this.obj.rows.length;i++){y-=this.obj.rows[i].offsetHeight;if (y<=0){_x=this.obj.rows[i];break;}
 }
 if (!_x || !_x.idd)return null;for (var i=0;i < this._cCount;i++){x-=this.getColWidth(i);if (x<=0){while(true){if (_x._childIndexes && _x._childIndexes[i+1]==_x._childIndexes[i])_x=_x.previousSibling;else {return this.cells(_x.idd,i).cell;}
 
 }
 }
 }
 return null;}
dhtmlXGridObject.prototype._OnSelectionMove = function(event)
{var self=this;this._ShowSelection();var pos = this.getPosition(this.obj);var X = event.clientX - pos[0] + (document.body.scrollLeft||(document.documentElement?document.documentElement.scrollLeft:0));var Y = event.clientY - pos[1] + (document.body.scrollTop||(document.documentElement?document.documentElement.scrollTop:0));if ((Math.abs(this._init_pos[0]-X)<5) && (Math.abs(this._init_pos[1]-Y)<5)) return this._HideSelection();var temp = this._endSelectionCell;if(this._startSelectionCell==null)this._endSelectionCell = this._startSelectionCell = this.getFirstParentOfType(event.srcElement || event.target,"TD");else
 if (event.srcElement || event.target){if ((event.srcElement || event.target).className == "dhtmlxGrid_selection")
 this._endSelectionCell=(this._getCellByPos(X,Y)||this._endSelectionCell);else {var t = this.getFirstParentOfType(event.srcElement || event.target,"TD");if (t.parentNode.idd)this._endSelectionCell = t;}
 }
 
 if (this._endSelectionCell){if (!this.callEvent("onBeforeBlockSelected",[this._endSelectionCell.parentNode.idd, this._endSelectionCell._cellIndex]))
 this._endSelectionCell = temp;}
 
 
 var BottomRightX = this.objBox.scrollLeft + this.objBox.clientWidth;var BottomRightY = this.objBox.scrollTop + this.objBox.clientHeight;var TopLeftX = this.objBox.scrollLeft;var TopLeftY = this.objBox.scrollTop;var nextCall=false;if (this._blsTimer)window.clearTimeout(this._blsTimer);if (X+20 >= BottomRightX){this.objBox.scrollLeft = this.objBox.scrollLeft+20;nextCall=true;}else if (X-20 < TopLeftX){this.objBox.scrollLeft = this.objBox.scrollLeft-20;nextCall=true;}
 if (Y+20 >= BottomRightY && !this._realfake){this.objBox.scrollTop = this.objBox.scrollTop+20;nextCall=true;}else if (Y-20 < TopLeftY && !this._realfake){this.objBox.scrollTop = this.objBox.scrollTop-20;nextCall=true;}
 this._selectionArea = this._RedrawSelectionPos(this._startSelectionCell, this._endSelectionCell);if (nextCall){var a=event.clientX;var b=event.clientY;this._blsTimer=window.setTimeout(function(){self._OnSelectionMove({clientX:a,clientY:b})},100);}
 
}
dhtmlXGridObject.prototype._OnSelectionStop = function(event)
{var self = this;if (this._blsTimer)window.clearTimeout(this._blsTimer);this.obj.onmousedown = function(e) {if (self._bs_mode)self._OnSelectionStart((e||event), this);return true;}
 this.obj.onmousemove = this.obj.onmmold||null;this._selectionObj.onmousemove = null;document.body.onmouseup = this._oldDMP||null;if ( parseInt( this._selectionObj.style.width )< 2 && parseInt( this._selectionObj.style.height ) < 2) {this._HideSelection();}else {var src = this.getFirstParentOfType(event.srcElement || event.target,"TD");if ((!src)|| (!src.parentNode.idd)){src=this._endSelectionCell;}
 if (!src)return this._HideSelection();while (src.tagName.toLowerCase()!= 'td')
 src = src.parentNode;this._stopSelectionCell = src;this._selectionArea = this._RedrawSelectionPos(this._startSelectionCell, this._stopSelectionCell);this.callEvent("onBlockSelected",[]);}
 document.body.onselectstart = function(){};}
dhtmlXGridObject.prototype._RedrawSelectionPos = function(LeftTop, RightBottom)
{var pos = {};pos.LeftTopCol = LeftTop._cellIndex;pos.LeftTopRow = this.getRowIndex( LeftTop.parentNode.idd );pos.RightBottomCol = RightBottom._cellIndex;pos.RightBottomRow = this.getRowIndex( RightBottom.parentNode.idd );var LeftTop_width = LeftTop.offsetWidth;var LeftTop_height = LeftTop.offsetHeight;LeftTop = this.getPosition(LeftTop, this.obj);var RightBottom_width = RightBottom.offsetWidth;var RightBottom_height = RightBottom.offsetHeight;RightBottom = this.getPosition(RightBottom, this.obj);if (LeftTop[0] < RightBottom[0]){var Left = LeftTop[0];var Right = RightBottom[0] + RightBottom_width;}else {var foo = pos.RightBottomCol;pos.RightBottomCol = pos.LeftTopCol;pos.LeftTopCol = foo;var Left = RightBottom[0];var Right = LeftTop[0] + LeftTop_width;}
 if (LeftTop[1] < RightBottom[1]){var Top = LeftTop[1];var Bottom = RightBottom[1] + RightBottom_height;}else {var foo = pos.RightBottomRow;pos.RightBottomRow = pos.LeftTopRow;pos.LeftTopRow = foo;var Top = RightBottom[1];var Bottom = LeftTop[1] + LeftTop_height;}
 var Width = Right - Left;var Height = Bottom - Top;this._selectionObj.style.left = Left + 'px';this._selectionObj.style.top = Top + 'px';this._selectionObj.style.width = Width + 'px';this._selectionObj.style.height = Height + 'px';return pos;}
dhtmlXGridObject.prototype._CreateSelection = function(x, y)
{if (this._selectionObj == null){var div = document.createElement('div');div.style.position = 'absolute';div.style.display = 'none';div.className = 'dhtmlxGrid_selection';this._selectionObj = div;this._selectionObj.onmousedown = function(e){e=e||event;if (e.button==2 || (_isMacOS&&e.ctrlKey))
 return this.parentNode.grid.callEvent("onBlockRightClick", ["BLOCK",e]);}
 this._selectionObj.oncontextmenu=function(e){(e||event).cancelBubble=true;return false;}
 this.objBox.appendChild(this._selectionObj);}
 
 this._selectionObj.style.width = '0px';this._selectionObj.style.height = '0px';this._selectionObj.style.left = x + 'px';this._selectionObj.style.top = y + 'px';this._selectionObj.startX = x;this._selectionObj.startY = y;}
dhtmlXGridObject.prototype._ShowSelection = function()
{if (this._selectionObj)this._selectionObj.style.display = '';}
dhtmlXGridObject.prototype._HideSelection = function()
{if (this._selectionObj)this._selectionObj.style.display = 'none';this._selectionArea = null;}
dhtmlXGridObject.prototype.copyBlockToClipboard = function()
{if ( this._selectionArea != null ){var serialized = new Array();if (this._mathSerialization)this._agetm="getMathValue";else if (this._strictText)this._agetm="getTitle";else this._agetm="getValue";for (var i=this._selectionArea.LeftTopRow;i<=this._selectionArea.RightBottomRow;i++){var data = this._serializeRowToCVS(this.rowsBuffer[i], null, this._selectionArea.LeftTopCol, this._selectionArea.RightBottomCol+1);if (!this._csvAID)serialized[serialized.length] = data.substr( data.indexOf( this.csv.cell ) + 1 );else
 serialized[serialized.length] = data;}
 serialized = serialized.join(this._CSVRowDelimiter);this.toClipBoard(serialized);}
}
dhtmlXGridObject.prototype.pasteBlockFromClipboard = function()
{var serialized = this.fromClipBoard();if (this._selectionArea != null){var startRow = this._selectionArea.LeftTopRow;var startCol = this._selectionArea.LeftTopCol;}else if (this.cell != null && !this.editor){var startRow = this.getRowIndex( this.cell.parentNode.idd );var startCol = this.cell._cellIndex;}else {return false;}
 serialized = this.csvParser.unblock(serialized, this.csv.cell, this.csv.row);var endRow = startRow+serialized.length;var endCol = startCol+serialized[0].length;if (endCol > this._cCount)endCol = this._cCount;var k = 0;for (var i=startRow;i<endRow;i++){var row = this.render_row(i);if (row==-1)continue;var l = 0;for (var j=startCol;j<endCol;j++){var ed = this.cells3(row, j);if (ed.isDisabled()) {l++;continue;}
 if (this._onEditUndoRedo)this._onEditUndoRedo(2, row.idd, j, serialized[ k ][ l ], ed.getValue());if (ed.combo){var comboVa = ed.combo.values;for(var n=0;n<comboVa.length;n++)if (serialized[ k ][ l ] == comboVa[n]){ed.setValue( ed.combo.keys[ n ]);comboVa=null;break;}
 if (comboVa!=null && ed.editable)ed.setValue( serialized[ k ][ l++ ] );else l++;}else
 ed[ ed.setImage ? "setLabel" : "setValue" ]( serialized[ k ][ l++ ] );ed.cell.wasChanged=true;}
 this.callEvent("onRowPaste",[row.idd])
 k++;}
}
dhtmlXGridObject.prototype.getSelectedBlock = function() {if (this._selectionArea)return this._selectionArea;else if (this.getSelectedRowId()!== null){return {LeftTopRow: this.getSelectedRowId(),
 LeftTopCol: this.getSelectedCellIndex(),
 RightBottomRow: this.getSelectedRowId(),
 RightBottomCol: this.getSelectedCellIndex()
 };}else
 return null;};dhtmlXGridObject.prototype.enablePaging = function(fl,pageSize,pagesInGrp,parentObj,showRecInfo,recInfoParentObj){this._pgn_parentObj = typeof(parentObj)=="string" ? document.getElementById(parentObj) : parentObj;this._pgn_recInfoParentObj = typeof(recInfoParentObj)=="string" ? document.getElementById(recInfoParentObj) : recInfoParentObj;this.pagingOn = fl;this.showRecInfo = showRecInfo;this.rowsBufferOutSize = parseInt(pageSize);this.currentPage = 1;this.pagesInGroup = parseInt(pagesInGrp);this._init_pgn_events()
 this.setPagingSkin("default");}
dhtmlXGridObject.prototype.setXMLAutoLoading = function(filePath,bufferSize){this.xmlFileUrl = filePath;this._dpref = bufferSize;}
dhtmlXGridObject.prototype.changePageRelative = function(ind){this.changePage(this.currentPage+ind);}
dhtmlXGridObject.prototype.changePage = function(pageNum){if (arguments.length==0)pageNum=this.currentPage||0;pageNum=parseInt(pageNum);pageNum=Math.max(1,Math.min(pageNum,Math.ceil(this.rowsBuffer.length/this.rowsBufferOutSize)));if(!this.callEvent("onBeforePageChanged",[this.currentPage,pageNum]))
 return;this.currentPage = parseInt(pageNum);this._reset_view();this._fixAlterCss();this.callEvent("onPageChanged",this.getStateOfView());}
dhtmlXGridObject.prototype.setPagingSkin = function(name){this._pgn_skin=this["_pgn_"+name];if (name=="toolbar")this._pgn_skin_tlb=arguments[1];}
dhtmlXGridObject.prototype.setPagingTemplates = function(a,b){this._pgn_templateA=this._pgn_template_compile(a);this._pgn_templateB=this._pgn_template_compile(b);this._page_skin_update();}
dhtmlXGridObject.prototype._page_skin_update = function(name){if (!this.pagesInGroup)this.pagesInGroup=Math.ceil(Math.min(5,this.rowsBuffer.length/this.rowsBufferOutSize));var totalPages=Math.ceil(this.rowsBuffer.length/this.rowsBufferOutSize);if (totalPages && totalPages<this.currentPage)return this.changePage(totalPages);if (this.pagingOn && this._pgn_skin)this._pgn_skin.apply(this,this.getStateOfView());}
dhtmlXGridObject.prototype._init_pgn_events = function(name){this.attachEvent("onXLE",this._page_skin_update)
 this.attachEvent("onClearAll",this._page_skin_update)
 this.attachEvent("onPageChanged",this._page_skin_update)
 this.attachEvent("onGridReconstructed",this._page_skin_update)
 
 this._init_pgn_events=function(){};}
dhtmlXGridObject.prototype._pgn_default=function(page,start,end){if (!this.pagingBlock){this.pagingBlock = document.createElement("DIV");this.pagingBlock.className = "pagingBlock";this.recordInfoBlock = document.createElement("SPAN");this.recordInfoBlock.className = "recordsInfoBlock";if (!this._pgn_parentObj)return;this._pgn_parentObj.appendChild(this.pagingBlock)
 if(this._pgn_recInfoParentObj && this.showRecInfo)this._pgn_recInfoParentObj.appendChild(this.recordInfoBlock)
 
 
 if (!this._pgn_templateA){this._pgn_templateA=this._pgn_template_compile("[prevpages:&lt;:&nbsp;] [currentpages:,&nbsp;] [nextpages:&gt;:&nbsp;]");this._pgn_templateB=this._pgn_template_compile("Results <b>[from]-[to]</b> of <b>[total]</b>");}
 }
 
 var details=this.getStateOfView();this.pagingBlock.innerHTML = this._pgn_templateA.apply(this,details);this.recordInfoBlock.innerHTML = this._pgn_templateB.apply(this,details);this._pgn_template_active(this.pagingBlock);this._pgn_template_active(this.recordInfoBlock);this.callEvent("onPaging",[]);}
dhtmlXGridObject.prototype._pgn_block=function(sep){var start=Math.floor((this.currentPage-1)/this.pagesInGroup)*this.pagesInGroup;var max=Math.min(Math.ceil(this.rowsBuffer.length/this.rowsBufferOutSize),start+this.pagesInGroup);var str=[];for (var i=start+1;i<=max;i++)if (i==this.currentPage)str.push("<a class='dhx_not_active'><b>"+i+"</b></a>");else
 str.push("<a onclick='this.grid.changePage("+i+");return false;'>"+i+"</a>");return str.join(sep);}
dhtmlXGridObject.prototype._pgn_link=function(mode,ac,ds){if (mode=="prevpages" || mode=="prev"){if (this.currentPage==1)return ds;return '<a onclick=\'this.grid.changePageRelative(-1*'+(mode=="prev"?'1':'this.grid.pagesInGroup')+');return false;\'>'+ac+'</a>'
 }
 
 if (mode=="nextpages" || mode=="next"){if (this.rowsBuffer.length/this.rowsBufferOutSize <= this.currentPage )return ds;if (this.rowsBuffer.length/(this.rowsBufferOutSize*(mode=="next"?'1':this.pagesInGroup)) <= 1 ) return ds;return '<a onclick=\'this.grid.changePageRelative('+(mode=="next"?'1':'this.grid.pagesInGroup')+');return false;\'>'+ac+'</a>'
 }
 
 if (mode=="current"){var i=this.currentPage+(ac?parseInt(ac):0);if (i<1 || Math.ceil(this.rowsBuffer.length/this.rowsBufferOutSize)< i ) return ds;return '<a '+(i==this.currentPage?"class='dhx_active_page_link' ":"")+'onclick=\'this.grid.changePage('+i+');return false;\'>'+i+'</a>'
 }
 return ac;}
dhtmlXGridObject.prototype._pgn_template_active=function(block){var tags=block.getElementsByTagName("A");if (tags)for (var i=0;i < tags.length;i++){tags[i].grid=this;};}
dhtmlXGridObject.prototype._pgn_template_compile=function(template){template=template.replace(/\[([^\]]*)\]/g,function(a,b){b=b.split(":");switch (b[0]){case "from": 
 return '"+(arguments[1]*1+(arguments[2]*1?1:0))+"';case "total":
 return '"+arguments[3]+"';case "to":
 return '"+arguments[2]+"';case "current":
 case "prev":
 case "next":
 case "prevpages":
 case "nextpages":
 return '"+this._pgn_link(\''+b[0]+'\',\''+b[1]+'\',\''+b[2]+'\')+"'
 case "currentpages":
 return '"+this._pgn_block(\''+b[1]+'\')+"'
 }
 
 })
 return new Function('return "'+template+'";')
}
dhtmlXGridObject.prototype.i18n.paging={results:"Results",
 records:"Records from ",
 to:" to ",
 page:"Page ",
 perpage:"rows per page",
 first:"To first Page",
 previous:"Previous Page",
 found:"Found records",
 next:"Next Page",
 last:"To last Page",
 of:" of ",
 notfound:"No Records Found"
}
dhtmlXGridObject.prototype.setPagingWTMode = function(navButtons,navLabel,pageSelect,perPageSelect){this._WTDef=[navButtons,navLabel,pageSelect,perPageSelect];}
dhtmlXGridObject.prototype._pgn_bricks = function(page, start, end){var tmp = (this.skin_name||"").split("_")[1];var sfx="";if(tmp=="light" || tmp=="modern" || tmp=="skyblue")sfx = "_"+tmp;this.pagerElAr = new Array();this.pagerElAr["pagerCont"] = document.createElement("DIV");this.pagerElAr["pagerBord"] = document.createElement("DIV");this.pagerElAr["pagerLine"] = document.createElement("DIV");this.pagerElAr["pagerBox"] = document.createElement("DIV");this.pagerElAr["pagerInfo"] = document.createElement("DIV");this.pagerElAr["pagerInfoBox"] = document.createElement("DIV");var se = (this.globalBox||this.objBox);this.pagerElAr["pagerCont"].style.width = se.clientWidth+"px";this.pagerElAr["pagerCont"].style.overflow = "hidden";this.pagerElAr["pagerCont"].style.clear = "both";this.pagerElAr["pagerBord"].className = "dhx_pbox"+sfx;this.pagerElAr["pagerLine"].className = "dhx_pline"+sfx;this.pagerElAr["pagerBox"].style.clear = "both";this.pagerElAr["pagerInfo"].className = "dhx_pager_info"+sfx;this.pagerElAr["pagerCont"].appendChild(this.pagerElAr["pagerBord"]);this.pagerElAr["pagerCont"].appendChild(this.pagerElAr["pagerLine"]);this.pagerElAr["pagerCont"].appendChild(this.pagerElAr["pagerInfo"]);this.pagerElAr["pagerLine"].appendChild(this.pagerElAr["pagerBox"]);this.pagerElAr["pagerInfo"].appendChild(this.pagerElAr["pagerInfoBox"]);this._pgn_parentObj.innerHTML = "";this._pgn_parentObj.appendChild(this.pagerElAr["pagerCont"]);if(this.rowsBuffer.length>0){var lineWidth = 20;var lineWidthInc = 22;if(page>this.pagesInGroup){var pageCont = document.createElement("DIV");var pageBox = document.createElement("DIV");pageCont.className = "dhx_page"+sfx;pageBox.innerHTML = "&larr;";pageCont.appendChild(pageBox);this.pagerElAr["pagerBox"].appendChild(pageCont);var self = this;pageCont.pgnum = (Math.ceil(page/this.pagesInGroup)-1)*this.pagesInGroup;pageCont.onclick = function(){self.changePage(this.pgnum);}
 lineWidth +=lineWidthInc;}
 
 for(var i=1;i<=this.pagesInGroup;i++){var pageCont = document.createElement("DIV");var pageBox = document.createElement("DIV");pageCont.className = "dhx_page"+sfx;pageNumber = ((Math.ceil(page/this.pagesInGroup)-1)*this.pagesInGroup)+i;if(pageNumber>Math.ceil(this.rowsBuffer.length/this.rowsBufferOutSize))
 break;pageBox.innerHTML = pageNumber;pageCont.appendChild(pageBox);if(page==pageNumber){pageCont.className += " dhx_page_active"+sfx;pageBox.className = "dhx_page_active"+sfx;}else{var self = this;pageCont.pgnum = pageNumber;pageCont.onclick = function(){self.changePage(this.pgnum);}
 }
 lineWidth +=(parseInt(lineWidthInc/3)*pageNumber.toString().length)+15;pageBox.style.width = (parseInt(lineWidthInc/3)*pageNumber.toString().length)+8+"px";this.pagerElAr["pagerBox"].appendChild(pageCont);}
 
 if(Math.ceil(page/this.pagesInGroup)*this.pagesInGroup<Math.ceil(this.rowsBuffer.length/this.rowsBufferOutSize)){var pageCont = document.createElement("DIV");var pageBox = document.createElement("DIV");pageCont.className = "dhx_page"+sfx;pageBox.innerHTML = "&rarr;";pageCont.appendChild(pageBox);this.pagerElAr["pagerBox"].appendChild(pageCont);var self = this;pageCont.pgnum = (Math.ceil(page/this.pagesInGroup)*this.pagesInGroup)+1;pageCont.onclick = function(){self.changePage(this.pgnum);}
 lineWidth +=lineWidthInc;}
 
 this.pagerElAr["pagerLine"].style.width = lineWidth+"px";}
 
 
 if(this.rowsBuffer.length>0 && this.showRecInfo)this.pagerElAr["pagerInfoBox"].innerHTML = this.i18n.paging.records+(start+1)+this.i18n.paging.to+end+this.i18n.paging.of+this.rowsBuffer.length;else if(this.rowsBuffer.length==0){this.pagerElAr["pagerLine"].parentNode.removeChild(this.pagerElAr["pagerLine"]);this.pagerElAr["pagerInfoBox"].innerHTML = this.i18n.paging.notfound;}
 
 this.pagerElAr["pagerBox"].appendChild(document.createElement("SPAN")).innerHTML = "&nbsp;";this.pagerElAr["pagerBord"].appendChild(document.createElement("SPAN")).innerHTML = "&nbsp;";this.pagerElAr["pagerCont"].appendChild(document.createElement("SPAN")).innerHTML = "&nbsp;";this.callEvent("onPaging",[]);}
dhtmlXGridObject.prototype._pgn_toolbar = function(page, start, end){if (!this.aToolBar)this.aToolBar=this._pgn_createToolBar();var totalPages=Math.ceil(this.rowsBuffer.length/this.rowsBufferOutSize);if (this._WTDef[0]){this.aToolBar.enableItem("right");this.aToolBar.enableItem("rightabs");this.aToolBar.enableItem("left");this.aToolBar.enableItem("leftabs");if(this.currentPage>=totalPages){this.aToolBar.disableItem("right");this.aToolBar.disableItem("rightabs");}
 if(this.currentPage==1){this.aToolBar.disableItem("left");this.aToolBar.disableItem("leftabs");}
 }
 if (this._WTDef[2]){var that=this;this.aToolBar.forEachListOption("pages", function(id){that.aToolBar.removeListOption("pages",id);});for(var i=0;i<totalPages;i++){this.aToolBar.addListOption('pages', 'pages_'+(i+1), NaN, "button", this.i18n.paging.page+(i+1));}
 this.aToolBar.setItemText("pages","<div style='width:100%;text-align:right'>"+this.i18n.paging.page+page+"</div>");}
 
 
 if (this._WTDef[1]){if (!this.getRowsNum())
 this.aToolBar.setItemText('results',this.i18n.paging.notfound);else
 this.aToolBar.setItemText('results',"<div style='width:100%;text-align:center'>"+this.i18n.paging.records+(start+1)+this.i18n.paging.to+end+"</div>");}
 if (this._WTDef[3])this.aToolBar.setItemText("perpagenum","<div style='width:100%;text-align:right'>"+this.rowsBufferOutSize.toString()+" "+this.i18n.paging.perpage+"</div>");this.callEvent("onPaging",[]);}
dhtmlXGridObject.prototype._pgn_createToolBar = function(){this.aToolBar = new dhtmlXToolbarObject(this._pgn_parentObj,(this._pgn_skin_tlb||"dhx_blue"));if (!this._WTDef)this.setPagingWTMode(true,true,true,true);var self=this;this.aToolBar.attachEvent("onClick",function(val){val=val.split("_")
 switch (val[0]){case "leftabs":
 self.changePage(1);break;case "left":
 self.changePage(self.currentPage-1);break;case "rightabs":
 self.changePage(99999);break;case "right":
 self.changePage(self.currentPage+1);break;case "perpagenum":
 if (val[1]===this.undefined)return;self.rowsBufferOutSize = parseInt(val[1]);self.changePage();self.aToolBar.setItemText("perpagenum","<div style='width:100%;text-align:right'>"+val[1]+" "+self.i18n.paging.perpage+"</div>");break;case "pages":
 if (val[1]===this.undefined)return;self.changePage(val[1]);self.aToolBar.setItemText("pages","<div style='width:100%;text-align:right'>"+self.i18n.paging.page+val[1]+"</div>");break;}
 })
 
 if (this._WTDef[0]){this.aToolBar.addButton("leftabs", NaN, "", this.imgURL+'ar_left_abs.gif', this.imgURL+'ar_left_abs_dis.gif');this.aToolBar.setWidth("leftabs","20")
 this.aToolBar.addButton("left", NaN, "", this.imgURL+'ar_left.gif', this.imgURL+'ar_left_dis.gif');this.aToolBar.setWidth("left","20")
 }
 if (this._WTDef[1]){this.aToolBar.addText("results",NaN,this.i18n.paging.results)
 this.aToolBar.setWidth("results","150");this.aToolBar.disableItem("results");}
 if (this._WTDef[0]){this.aToolBar.addButton("right", NaN, "", this.imgURL+'ar_right.gif', this.imgURL+'ar_right_dis.gif');this.aToolBar.setWidth("right","20")
 this.aToolBar.addButton("rightabs", NaN, "", this.imgURL+'ar_right_abs.gif', this.imgURL+'ar_right_abs_dis.gif');this.aToolBar.setWidth("rightabs","20")
 }
 if (this._WTDef[2]){this.aToolBar.addButtonSelect("pages", NaN, "select page", [], null, null, true, true);this.aToolBar.setWidth("pages","75")
 }
 var arr;if (arr = this._WTDef[3]){this.aToolBar.addButtonSelect("perpagenum", NaN, "select size", [], null, null, true, true);if(typeof arr != "object")arr = [5,10,15,20,25,30];for (var k=0;k<arr.length;k++)this.aToolBar.addListOption('perpagenum', 'perpagenum_'+arr[k], NaN, "button", arr[k]+" "+this.i18n.paging.perpage);this.aToolBar.setWidth("perpagenum","135");}
 
 
 
 
 return this.aToolBar;}
 

dhtmlXGridObject.prototype.hidePivot=function(cont){if (this._pgridCont){if (this._pgrid)this._pgrid.destructor();var c=this._pgridCont.parentNode;c.innerHTML="";if (c.parentNode==this.entBox)this.entBox.removeChild(c);this._pgrid=this._pgridSelect=this._pUNI=this._pgridCont=null;}
}
 
dhtmlXGridObject.prototype.makePivot=function(cont,details){details=details||{};this.hidePivot();if (!cont){var cont=document.createElement("DIV");cont.style.cssText="position:absolute;top:0px;left:0px;background-color:white;";cont.style.height=this.entBox.offsetHeight+"px";cont.style.width=this.entBox.offsetWidth+"px";if (this.entBox.style.position!="absolute")this.entBox.style.position="relative";this.entBox.appendChild(cont);}
 
 if (typeof(cont)!="object") cont=document.getElementById(cont)
 
 if (details.column_list)this._column_list=details.column_list;else{this._column_list=[];for (var i=0;i<this.hdr.rows[1].cells.length;i++)this._column_list.push(this.hdr.rows[1].cells[i][_isIE?"innerText":"textContent"])
 }
 
 var that = this;cont.innerHTML="<table cellspacing='0' cellpadding='0'><tr><td style='width:160px' align='center'></td><td>&nbsp;&nbsp;&nbsp;</td><td></td></tr></table><div></div>";var z1=this.makePivotSelect(this._column_list);z1.style.width="80px";z1.onchange=function(){if (this.value!=-1)that._pivotS.value=this.value;else that._pivotS.value="";that._reFillPivotLists();that._renderPivot2();}
 var z2=this.makePivotSelect(this._column_list);z2.onchange=function(){if (this.value!=-1)that._pivotS.x=this.value;else that._pivotS.x="";that._reFillPivotLists();that._renderPivot()
 }
 var z3=this.makePivotSelect(this._column_list);z3.onchange=function(){if (this.value!=-1)that._pivotS.y=this.value;else that._pivotS.y="";that._reFillPivotLists();that._renderPivot()
 }
 var z4=this.makePivotSelect(["Sum","Min","Max","Average","Count"],-1);z4.style.width="70px";z4.onchange=function(){if (this.value!=-1)that._pivotS.action=this.value;else that._pivotS.action=null;that._renderPivot2();}
 
 if (details.readonly)z1.disabled=z2.disabled=z3.disabled=z4.disabled=true;cont.firstChild.rows[0].cells[0].appendChild(z4);cont.firstChild.rows[0].cells[0].appendChild(z1);cont.firstChild.rows[0].cells[2].appendChild(z2);var gr=cont.childNodes[1];gr.style.width=cont.offsetWidth+"px";gr.style.height=cont.offsetHeight-20+"px";gr.style.overflow="hidden";this._pgridCont=gr;this._pgridSelect=[z1,z2,z3,z4];this._pData=this._fetchPivotData();this._pUNI=[];this._pivotS={action:(details.action||"0"), value:(typeof details.value != "undefined" ? (details.value||"0") : null), x:(typeof details.x != "undefined" ? (details.x||"0") : null), y:(typeof details.y != "undefined" ? (details.y||"0") : null) };z1.value=this._pivotS.value;z2.value=this._pivotS.x;z3.value=this._pivotS.y;z4.value=this._pivotS.action;that._reFillPivotLists();this._renderPivot();}
dhtmlXGridObject.prototype._fetchPivotData=function(){var z=[];for (var i=0;i<this._cCount;i++){var d=[];for (var j=0;j<this.rowsCol.length;j++){if (this.rowsCol[j]._cntr)continue;d.push(this.cells2(j,i).getValue());}
 z.push(d)
 }
 return z;}
dhtmlXGridObject.prototype._renderPivot=function(){if (_isIE)this._pgridSelect[2].removeNode(true)
 if (this._pgrid)this._pgrid.destructor();this._pgrid=new dhtmlXGridObject(this._pgridCont);this._pgrid.setImagePath(this.imgURL);this._pgrid.attachEvent("onBeforeSelect",function(){return false;});if (this._pivotS.x){var l=this._getUniList(this._pivotS.x);var s=[160];for (var i=0;i < l.length;i++)s.push(100);l=[""].concat(l)
 this._pgrid.setHeader(l);this._pgrid.setInitWidths(s.join(","));}else {this._pgrid.setHeader("");this._pgrid.setInitWidths("160");}
 
 this._pgrid.init();this._pgrid.setEditable(false);this._pgrid.setSkin(this.entBox.className.replace("gridbox gridbox_",""));var t=this._pgrid.hdr.rows[1].cells[0];if (t.firstChild && t.firstChild.tagName=="DIV")t=t.firstChild;t.appendChild(this._pgridSelect[2]);this._pgrid.setSizes();if (this._pivotS.y){var l=this._getUniList(this._pivotS.y);for (var i=0;i < l.length;i++){this._pgrid.addRow(this._pgrid.uid(),[l[i]],-1);};}else {this._pgrid.addRow(1,"not ready",1);}
 this._renderPivot2();}
dhtmlXGridObject.prototype._pivot_action_0=function(a,b,c,av,bv,data){var ret=0;var resA=data[a];var resB=data[b];var resC=data[c];for (var i = resA.length - 1;i >= 0;i--)if (resA[i]==av && resB[i]==bv)ret+=this.parseFloat(resC[i]);return ret;}
dhtmlXGridObject.prototype._pivot_action_1=function(a,b,c,av,bv,data){ret=9999999999;var resA=data[a];var resB=data[b];var resC=data[c];for (var i = resA.length - 1;i >= 0;i--)if (resA[i]==av && resB[i]==bv)ret=Math.min(this.parseFloat(resC[i]),ret);if (ret==9999999999)ret="";return ret;}
dhtmlXGridObject.prototype._pivot_action_2=function(a,b,c,av,bv,data){ret=-9999999999;var resA=data[a];var resB=data[b];var resC=data[c];for (var i = resA.length - 1;i >= 0;i--)if (resA[i]==av && resB[i]==bv)ret=Math.max(this.parseFloat(resC[i]),ret);if (ret==-9999999999)ret="";return ret;}
dhtmlXGridObject.prototype._pivot_action_3=function(a,b,c,av,bv,data){var ret=0;var count=0;var resA=data[a];var resB=data[b];var resC=data[c];for (var i = resA.length - 1;i >= 0;i--)if (resA[i]==av && resB[i]==bv){ret+=this.parseFloat(resC[i]);count++;}
 return count?ret/count:"";}
dhtmlXGridObject.prototype._pivot_action_4=function(a,b,c,av,bv,data){var ret=0;var count=0;var resA=data[a];var resB=data[b];var resC=data[c];for (var i = resA.length - 1;i >= 0;i--)if (resA[i]==av && resB[i]==bv){ret++;}
 return ret;}
dhtmlXGridObject.prototype.parseFloat = function(val){val = parseFloat(val);if (isNaN(val)) return 0;return val;}
 
dhtmlXGridObject.prototype._renderPivot2=function(){if (!(this._pivotS.x && this._pivotS.y && this._pivotS.value && this._pivotS.action)) return;var action=this["_pivot_action_"+this._pivotS.action];var x=this._getUniList(this._pivotS.x);var y=this._getUniList(this._pivotS.y);for (var i=0;i < x.length;i++){for (var j=0;j < y.length;j++){this._pgrid.cells2(j,i+1).setValue(Math.round(action(this._pivotS.x,this._pivotS.y,this._pivotS.value,x[i],y[j],this._pData)*100)/100);};};}
dhtmlXGridObject.prototype._getUniList=function(col){if (!this._pUNI[col]){var t={};var a=[];for (var i = this._pData[col].length - 1;i >= 0;i--){t[this._pData[col][i]]=true;}
 for (var n in t)if (t[n]===true)a.push(n);this._pUNI[col]=a.sort();}
 
 return this._pUNI[col];}
dhtmlXGridObject.prototype._fillPivotList=function(z,list,miss,v){if (!miss){miss={};v=-1;}
 z.innerHTML="";z.options[z.options.length]=new Option("-select-",-1);for (var i=0;i<list.length;i++){if (miss[i] || list[i]===null)continue;z.options[z.options.length]=new Option(list[i],i);}
 z.value=parseInt(v);}
dhtmlXGridObject.prototype._reFillPivotLists=function(){var s=[];var v=[];for (var i=0;i<3;i++){s.push(this._pgridSelect[i]);v.push(s[i].value);}
 
 
 var t=this._reFfillPivotLists;var m={};m[v[1]]=m[v[2]]=true;this._fillPivotList(s[0],this._column_list,m,v[0]);m={};m[v[0]]=m[v[2]]=true;this._fillPivotList(s[1],this._column_list,m,v[1]);m={};m[v[1]]=m[v[0]]=true;this._fillPivotList(s[2],this._column_list,m,v[2]);this._reFfillPivotLists=t;}
dhtmlXGridObject.prototype.makePivotSelect=function(list,miss){var z=document.createElement("SELECT");this._fillPivotList(z,list,miss);z.style.cssText="width:150px;height:20px;font-family:Tahoma;font-size:8pt;font-weight:normal;";return z;}
dhtmlXGridObject.prototype.setRowspan=function(rowID,colInd,length){var c=this[this._bfs_cells?"_bfs_cells":"cells"](rowID,colInd).cell;var r=this.rowsAr[rowID];if (c.rowSpan && c.rowSpan!=1){var ur=r.nextSibling;for (var i=1;i<c.rowSpan;i++){var tc=ur.childNodes[ur._childIndexes[c._cellIndex+1]]
 var ti=document.createElement("TD");ti.innerHTML="&nbsp;";ti._cellIndex=c._cellIndex;ti._clearCell=true;if (tc)tc.parentNode.insertBefore(ti,tc);else
 ur.parentNode.appendChild(ti);this._shiftIndexes(ur,c._cellIndex,-1);ur=ur.nextSibling;}
 }
 c.rowSpan=length;if (!this._h2)r=r.nextSibling||this.rowsCol[this.rowsCol._dhx_find(r)+1];else
 r=this.rowsAr[ this._h2.get[r.idd].parent.childs[this._h2.get[r.idd].index+1].id ];var kids=[];for (var i=1;i<length;i++){var ct=null;if (this._fake && !this._realfake)ct=this._bfs_cells3(r,colInd).cell;else
 ct=this.cells3(r,colInd).cell;this._shiftIndexes(r,c._cellIndex,1);if (ct)ct.parentNode.removeChild(ct);kids.push(r);if (!this._h2)r=r.nextSibling||this.rowsCol[this.rowsCol._dhx_find(r)+1];else {var r=this._h2.get[r.idd].parent.childs[this._h2.get[r.idd].index+1];if (r)r=this.rowsAr[ r.id ];}
 }
 
 this.rowsAr[rowID]._rowSpan=this.rowsAr[rowID]._rowSpan||{};this.rowsAr[rowID]._rowSpan[colInd]=kids;if (this._fake && !this._realfake && colInd<this._fake._cCount)this._fake.setRowspan(rowID,colInd,length)
}
dhtmlXGridObject.prototype._shiftIndexes=function(r,pos,ind){if (!r._childIndexes){r._childIndexes=new Array();for (var z=0;z<r.childNodes.length;z++)r._childIndexes[z]=z;}
 
 for (var z=0;z<r._childIndexes.length;z++)if (z>pos)r._childIndexes[z]=r._childIndexes[z]-ind;}
dhtmlXGridObject.prototype.enableRowspan=function(){this._erspan=true;this.enableRowspan=function(){};this.attachEvent("onAfterSorting",function(){if (this._dload)return;for (var i=1;i<this.obj.rows.length;i++)if (this.obj.rows[i]._rowSpan){var master=this.obj.rows[i];for (var kname in master._rowSpan){var row=master;var kids=row._rowSpan[kname];for (var j=0;j < kids.length;j++){if(row.nextSibling)row.parentNode.insertBefore(kids[j],row.nextSibling);else 
 row.parentNode.appendChild(kids[j]);if (this._fake){var frow=this._fake.rowsAr[row.idd];var fkid=this._fake.rowsAr[kids[j].idd];if(frow.nextSibling)frow.parentNode.insertBefore(fkid,frow.nextSibling);else 
 frow.parentNode.appendChild(fkid);this._correctRowHeight(row.idd);}
 row=row.nextSibling;}
 }
 }
 var t = this.rowsCol.stablesort;this.rowsCol=new dhtmlxArray();this.rowsCol.stablesort=t;for (var i=1;i<this.obj.rows.length;i++)this.rowsCol.push(this.obj.rows[i]);}) 
 
 this.attachEvent("onXLE",function(a,b,c,xml){for (var i=0;i<this.rowsBuffer.length;i++){var row = this.render_row(i);var childs = row.childNodes;for (var j=0;j<childs.length;j++){if (childs[j]._attrs["rowspan"]){this.setRowspan(row.idd,j,childs[j]._attrs["rowspan"]);}
 }
 }
 });}
dhtmlXGridObject.prototype._init_point_bspl=dhtmlXGridObject.prototype._init_point;dhtmlXGridObject.prototype._init_point = function(){if (this._split_later)this.splitAt(this._split_later);this._init_point=this._init_point_bspl;if (this._init_point)this._init_point();}
dhtmlXGridObject.prototype.splitAt=function(ind){if (!this.obj.rows[0])return this._split_later=ind;ind=parseInt(ind);var leftBox=document.createElement("DIV");this.entBox.appendChild(leftBox);var rightBox=document.createElement("DIV");this.entBox.appendChild(rightBox);for (var i=this.entBox.childNodes.length-3;i>=0;i--)rightBox.insertBefore(this.entBox.childNodes[i],rightBox.firstChild);this.entBox.style.position="relative";this.globalBox=this.entBox;this.entBox=rightBox;rightBox.grid=this;leftBox.style.cssText+="border:0px solid red !important;";rightBox.style.cssText+="border:0px solid red !important;";rightBox.style.top="0px";rightBox.style.position="absolute";leftBox.style.position="absolute";leftBox.style.top="0px";leftBox.style.left="0px";leftBox.style.zIndex=11;rightBox.style.height=leftBox.style.height=this.globalBox.clientHeight;this._fake=new dhtmlXGridObject(leftBox);this._fake.setSkin("not_existing_skin");this.globalBox=this._fake.globalBox=this.globalBox;this._fake._fake=this;this._fake._realfake=true;this._treeC=this.cellType._dhx_find("tree");this._fake.delim=this.delim;this._fake.customGroupFormat=this.customGroupFormat;this._fake.imgURL=this.imgURL;this._fake._customSorts=this._customSorts;this._fake.noHeader=this.noHeader;this._fake._enbTts=this._enbTts;this._fake._htkebl = this._htkebl;this._fake.clists = this.clists;this._fake.fldSort=new Array();this._fake.selMultiRows=this.selMultiRows;this._fake.multiLine=this.multiLine;if (this.multiLine || this._erspan){this.attachEvent("onCellChanged",this._correctRowHeight);this.attachEvent("onRowAdded",this._correctRowHeight);var corrector=function(){this.forEachRow(function(id){this._correctRowHeight(id);})
 };this.attachEvent("onPageChanged",corrector);this.attachEvent("onXLE",corrector);this.attachEvent("onResizeEnd",corrector);if (!this._ads_count)this.attachEvent("onAfterSorting",corrector);this.attachEvent("onDistributedEnd",corrector);}
 this.attachEvent("onGridReconstructed",function(){this._fake.objBox.scrollTop = this.objBox.scrollTop;})
 
 this._fake.loadedKidsHash=this.loadedKidsHash;if (this._h2)this._fake._h2=this._h2;this._fake._dInc=this._dInc;var b_ha=[[],[],[],[],[],[],[]];var b_ar=["hdrLabels","initCellWidth","cellType","cellAlign","cellVAlign","fldSort","columnColor"];var b_fu=["setHeader","setInitWidths","setColTypes","setColAlign","setColVAlign","setColSorting","setColumnColor"];this._fake.callEvent=function(){this._fake._split_event=true;if (arguments[0]=="onGridReconstructed")this._fake.callEvent.apply(this,arguments);return this._fake.callEvent.apply(this._fake,arguments);this._fake._split_event=false;}
 
 if (this._elmn)this._fake.enableLightMouseNavigation(true);if (this.__cssEven||this._cssUnEven)this._fake.attachEvent("onGridReconstructed",function(){this._fixAlterCss();});this._fake._cssEven=this._cssEven;this._fake._cssUnEven=this._cssUnEven;this._fake._cssSP=this._cssSP;this._fake.isEditable=this.isEditable;this._fake._edtc=this._edtc;if (this._sst)this._fake.enableStableSorting(true);this._fake._sclE=this._sclE;this._fake._dclE=this._dclE;this._fake._f2kE=this._f2kE;this._fake._maskArr=this._maskArr;this._fake._dtmask=this._dtmask;this._fake.combos=this.combos;var width=0;var m_w=this.globalBox.offsetWidth;for (var i=0;i<ind;i++){for (var j=0;j<b_ar.length;j++){if (this[b_ar[j]])b_ha[j][i]=this[b_ar[j]][i];if (typeof b_ha[j][i] == "string")b_ha[j][i]=b_ha[j][i].replace(new RegExp("\\"+this.delim,"g"),"\\"+this.delim);}
 if (_isFF)b_ha[1][i]=b_ha[1][i]*1;if ( this.cellWidthType == "%"){b_ha[1][i]=Math.round(parseInt(this[b_ar[1]][i])*m_w/100);width+=b_ha[1][i];}else
 width+=parseInt(this[b_ar[1]][i]);this.setColumnHidden(i,true);}
 for (var j=0;j<b_ar.length;j++){var str=b_ha[j].join(this.delim);if (b_fu[j]!="setHeader"){if (str!="")this._fake[b_fu[j]](str);}else
 this._fake[b_fu[j]](str,null,this._hstyles);}
 this._fake._strangeParams=this._strangeParams;this._fake._drsclmn=this._drsclmn;width = Math.min(this.globalBox.offsetWidth, width);rightBox.style.left=width+"px";leftBox.style.width=width+"px";rightBox.style.width=Math.max(this.globalBox.offsetWidth-width,0);if (this._ecspn)this._fake._ecspn=true;this._fake.init();if (this.dragAndDropOff)this.dragger.addDragLanding(this._fake.entBox, this);this._fake.objBox.style.overflow="hidden";this._fake.objBox.style.overflowX="scroll";this._fake._srdh=this._srdh||20;this._fake._srnd=this._srnd;var selfmaster = this;function _on_wheel(e){var dir = e.wheelDelta/-40;if (e.wheelDelta === window.undefined)dir = e.detail;var cont = selfmaster.objBox;cont.scrollTop += dir*40;if (e.preventDefault)e.preventDefault();}
 dhtmlxEvent(this._fake.objBox,"mousewheel",_on_wheel);dhtmlxEvent(this._fake.objBox,"DOMMouseScroll",_on_wheel);function change_td(a,b){b.style.whiteSpace="";var c=b.nextSibling;var cp=b.parentNode;a.parentNode.insertBefore(b,a);if (!c)cp.appendChild(a);else
 cp.insertBefore(a,c);var z=a.style.display;a.style.display=b.style.display;b.style.display=z;}
 function proc_hf(i,rows,mode,frows){var temp_header=(new Array(ind)).join(this.delim);var temp_rspan=[];if (i==2)for (var k=0;k<ind;k++){var r=rows[i-1].cells[rows[i-1]._childIndexes?rows[i-1]._childIndexes[k]:k];if (r.rowSpan && r.rowSpan>1){temp_rspan[r._cellIndex]=r.rowSpan-1;frows[i-1].cells[frows[i-1]._childIndexes?frows[i-1]._childIndexes[k]:k].rowSpan=r.rowSpan;r.rowSpan=1;}
 }
 
 for (i;i<rows.length;i++){this._fake.attachHeader(temp_header,null,mode);frows=frows||this._fake.ftr.childNodes[0].rows;var max_ind=ind;var r_cor=0;for (var j=0;j<max_ind;j++){if (temp_rspan[j]){temp_rspan[j]=temp_rspan[j]-1;if (_isIE || (_isFF && _FFrv >= 1.9 )|| _isOpera) {var td=document.createElement("TD");if (_isFF)td.style.display="none";rows[i].insertBefore(td,rows[i].cells[0])
 }
 
 r_cor++;continue;}
 var a=frows[i].cells[j-r_cor];var b=rows[i].cells[j-(_isIE?0:r_cor)];var t=b.rowSpan;change_td(a,b);if (t>1){temp_rspan[j]=t-1;b.rowSpan=t;}
 if (frows[i].cells[j].colSpan>1){rows[i].cells[j].colSpan=frows[i].cells[j].colSpan;max_ind-=frows[i].cells[j].colSpan-1;for (var k=1;k < frows[i].cells[j].colSpan;k++)frows[i].removeChild(frows[i].cells[j+1]);}
 }
 }
 }
 
 if (this.hdr.rows.length>2)proc_hf.call(this,2,this.hdr.rows,"_aHead",this._fake.hdr.rows);if (this.ftr){proc_hf.call(this,1,this.ftr.childNodes[0].rows,"_aFoot");this._fake.ftr.parentNode.style.bottom=(_isFF?2:1)+"px";}
 

 if (this.saveSizeToCookie){this.saveSizeToCookie=function(name,cookie_param){if (this._realfake)return this._fake.saveSizeToCookie.apply(this._fake,arguments);if (!name)name=this.entBox.id;var z=new Array();var n="cellWidthPX";for (var i=0;i<this[n].length;i++)if (i<ind)z[i]=this._fake[n][i];else
 z[i]=this[n][i];z=z.join(",")
 this.setCookie(name,cookie_param,0,z);var z=(this.initCellWidth||(new Array)).join(",");this.setCookie(name,cookie_param,1,z);return true;}
 this.loadSizeFromCookie=function(name){if (!name)name=this.entBox.id;var z=this._getCookie(name,1);if (!z)return
 this.initCellWidth=z.split(",");var z=this._getCookie(name,0);var n="cellWidthPX";this.cellWidthType="px";var summ2=0;if ((z)&&(z.length)){z=z.split(",");for (var i=0;i<z.length;i++)if (i<ind){this._fake[n][i]=z[i];summ2+=z[i]*1;}
 else
 this[n][i]=z[i];}
 this._fake.entBox.style.width=summ2+"px";this._fake.objBox.style.width=summ2+"px";var pa=this.globalBox.childNodes[1];pa.style.left=summ2-(_isFF?0:0)+"px";if (this.ftr)this.ftr.style.left=summ2-(_isFF?0:0)+"px";pa.style.width=this.globalBox.offsetWidth-summ2+"px";this.setSizes();return true;}
 this._fake.onRSE=this.onRSE;}
 this.setCellTextStyleA=this.setCellTextStyle;this.setCellTextStyle=function(row_id,i,styleString){if (i<ind)this._fake.setCellTextStyle(row_id,i,styleString);this.setCellTextStyleA(row_id,i,styleString);}
 this.setRowTextBoldA=this.setRowTextBold;this.setRowTextBold = function(row_id){this.setRowTextBoldA(row_id);this._fake.setRowTextBold(row_id);}
 
 this.setRowColorA=this.setRowColor;this.setRowColor = function(row_id,color){this.setRowColorA(row_id,color);this._fake.setRowColor(row_id,color);}
 
 this.setRowHiddenA=this.setRowHidden;this.setRowHidden = function(id,state){this.setRowHiddenA(id,state);this._fake.setRowHidden(id,state);}
 this.setRowTextNormalA=this.setRowTextNormal;this.setRowTextNormal = function(row_id){this.setRowTextNormalA(row_id);this._fake.setRowTextNormal(row_id);}
 this.getChangedRows = function(and_added){var res = new Array();function test(row){for (var j = 0;j < row.childNodes.length;j++)if (row.childNodes[j].wasChanged)return res[res.length]=row.idd;}
 this.forEachRow(function(id){var row = this.rowsAr[id];var frow = this._fake.rowsAr[id];if (row.tagName!="TR" || frow.tagName!="TR")return;if (and_added && row._added)res[res.length]=row.idd;else{if (!test(row)) test(frow);}
 });return res.join(this.delim);};this.setRowTextStyleA=this.setRowTextStyle;this.setRowTextStyle = function(row_id,styleString){this.setRowTextStyleA(row_id,styleString);if (this._fake.rowsAr[row_id])this._fake.setRowTextStyle(row_id,styleString);}
 this.lockRowA = this.lockRow;this.lockRow = function(id,mode){this.lockRowA(id,mode);this._fake.lockRow(id,mode);}
 
 this.getColWidth = function(i){if (i<ind)return parseInt(this._fake.cellWidthPX[i]);else return parseInt(this.cellWidthPX[i]);};this.getColumnLabel = function(i){return this._fake.getColumnLabel.apply(((i<ind)?this._fake:this) ,arguments);};this.setColWidthA=this._fake.setColWidthA=this.setColWidth;this.setColWidth = function(i,value){i=i*1;if (i<ind)this._fake.setColWidthA(i,value);else this.setColWidthA(i,value);if ((i+1)<=ind) this._fake._correctSplit(Math.min(this._fake.objBox.offsetWidth,this._fake.obj.offsetWidth));}
 this.adjustColumnSizeA=this.adjustColumnSize;this.setColumnLabelA=this.setColumnLabel;this.setColumnLabel=function(a,b,c,d){var that = this;if (a<ind)that = this._fake;return this.setColumnLabelA.apply(that,[a,b,c,d]);}
 this.adjustColumnSize=function(aind,c){if (aind<ind){if (_isIE)this._fake.obj.style.tableLayout="";this._fake.adjustColumnSize(aind,c);if (_isIE)this._fake.obj.style.tableLayout="fixed";this._fake._correctSplit();}
 else return this.adjustColumnSizeA(aind,c);}
 var zname="cells";this._bfs_cells=this[zname];this[zname]=function(){if (arguments[1]<ind){return this._fake.cells.apply(this._fake,arguments);}else
 return this._bfs_cells.apply(this,arguments);}
 
 this._bfs_isColumnHidden=this.isColumnHidden;this.isColumnHidden=function(){if (parseInt(arguments[0])<ind)
 return this._fake.isColumnHidden.apply(this._fake,arguments);else
 return this._bfs_isColumnHidden.apply(this,arguments);}


 this._bfs_setColumnHidden=this.setColumnHidden;this.setColumnHidden=function(){if (parseInt(arguments[0])<ind){this._fake.setColumnHidden.apply(this._fake,arguments);return this._fake._correctSplit();}
 else
 return this._bfs_setColumnHidden.apply(this,arguments);}

 var zname="cells2";this._bfs_cells2=this[zname];this[zname]=function(){if (arguments[1]<ind)return this._fake.cells2.apply(this._fake,arguments);else
 return this._bfs_cells2.apply(this,arguments);}
 var zname="cells3";this._bfs_cells3=this[zname];this[zname]=function(a,b){if (arguments[1]<ind && this._fake.rowsAr[arguments[0].idd]){if (this._fake.rowsAr[a.idd] && this._fake.rowsAr[a.idd].childNodes.length==0)return this._bfs_cells3.apply(this,arguments);arguments[0]=arguments[0].idd;return this._fake.cells.apply(this._fake,arguments);}
 else
 return this._bfs_cells3.apply(this,arguments);}
 var zname="changeRowId";this._bfs_changeRowId=this[zname];this[zname]=function(){this._bfs_changeRowId.apply(this,arguments);if (this._fake.rowsAr[arguments[0]])this._fake.changeRowId.apply(this._fake,arguments);}
 this._fake.getRowById=function(id){var row = this.rowsAr[id];if (!row && this._fake.rowsAr[id])row=this._fake.getRowById(id);if (row){if (row.tagName != "TR"){for (var i = 0;i < this.rowsBuffer.length;i++)if (this.rowsBuffer[i] && this.rowsBuffer[i].idd == id)return this.render_row(i);if (this._h2)return this.render_row(null,row.idd);}
 return row;}
 return null;}
 if (this.collapseKids){this._fake["_bfs_collapseKids"]=this.collapseKids;this._fake["collapseKids"]=function(){return this._fake["collapseKids"].apply(this._fake,[this._fake.rowsAr[arguments[0].idd]]);}
 
 this["_bfs_collapseKids"]=this.collapseKids;this["collapseKids"]=function(){var z=this["_bfs_collapseKids"].apply(this,arguments);this._fake._h2syncModel();if (!this._cssSP)this._fake._fixAlterCss();}
 
 
 this._fake["_bfs_expandKids"]=this.expandKids;this._fake["expandKids"]=function(){this._fake["expandKids"].apply(this._fake,[this._fake.rowsAr[arguments[0].idd]]);if (!this._cssSP)this._fake._fixAlterCss();}
 

 this["_bfs_expandAll"]=this.expandAll;this["expandAll"]=function(){this._bfs_expandAll();this._fake._h2syncModel();if (!this._cssSP)this._fake._fixAlterCss();}
 this["_bfs_collapseAll"]=this.collapseAll;this["collapseAll"]=function(){this._bfs_collapseAll();this._fake._h2syncModel();if (!this._cssSP)this._fake._fixAlterCss();}
 
 this["_bfs_expandKids"]=this.expandKids;this["expandKids"]=function(){var z=this["_bfs_expandKids"].apply(this,arguments);this._fake._h2syncModel();if (!this._cssSP)this._fake._fixAlterCss();}
 
 this._fake._h2syncModel=function(){if (this._fake.pagingOn)this._fake._renderSort();else this._renderSort();}
 this._updateTGRState=function(a){return this._fake._updateTGRState(a);}
 }
 


 if (this._elmnh){this._setRowHoverA=this._fake._setRowHoverA=this._setRowHover;this._unsetRowHoverA=this._fake._unsetRowHoverA=this._unsetRowHover;this._setRowHover=this._fake._setRowHover=function(){var that=this.grid;that._setRowHoverA.apply(this,arguments);var z=(_isIE?event.srcElement:arguments[0].target);z=that._fake.rowsAr[that.getFirstParentOfType(z,'TD').parentNode.idd];if (z){that._fake._setRowHoverA.apply(that._fake.obj,[{target:z.childNodes[0]},arguments[1]]);}
 };this._unsetRowHover=this._fake._unsetRowHover=function(){if (arguments[1])var that=this;else var that=this.grid;that._unsetRowHoverA.apply(this,arguments);that._fake._unsetRowHoverA.apply(that._fake.obj,arguments);};this._fake.enableRowsHover(true,this._hvrCss);this.enableRowsHover(false);this.enableRowsHover(true,this._fake._hvrCss);}
 this._updateTGRState=function(z){if (!z.update || z.id==0)return;if (this.rowsAr[z.id].imgTag)this.rowsAr[z.id].imgTag.src=this.imgURL+z.state+".gif";if (this._fake.rowsAr[z.id] && this._fake.rowsAr[z.id].imgTag)this._fake.rowsAr[z.id].imgTag.src=this.imgURL+z.state+".gif";z.update=false;}
 this.copy_row=function(row){var x=row.cloneNode(true);x._skipInsert=row._skipInsert;var r_ind=ind;x._attrs={};x._css = row._css;if (this._ecspn){r_ind=0;for (var i=0;(r_ind<x.childNodes.length && i<ind);i+=(x.childNodes[r_ind].colSpan||1))
 r_ind++;}
 
 while (x.childNodes.length>r_ind)x.removeChild(x.childNodes[x.childNodes.length-1]);var zm=r_ind;for (var i=0;i<zm;i++){if (this.dragAndDropOff)this.dragger.addDraggableItem(x.childNodes[i], this);x.childNodes[i].style.display=(this._fake._hrrar?(this._fake._hrrar[i]?"none":""):"");x.childNodes[i]._cellIndex=i;x.childNodes[i].combo_value=arguments[0].childNodes[i].combo_value;x.childNodes[i]._clearCell=arguments[0].childNodes[i]._clearCell;x.childNodes[i]._cellType=arguments[0].childNodes[i]._cellType;x.childNodes[i]._brval=arguments[0].childNodes[i]._brval;x.childNodes[i]._attrs=arguments[0].childNodes[i]._attrs;x.childNodes[i].chstate=arguments[0].childNodes[i].chstate;if (row._attrs['style'])x.childNodes[i].style.cssText+=";"+row._attrs['style'];if(x.childNodes[i].colSpan>1)this._childIndexes=this._fake._childIndexes;}
 
 if (this._h2 && this._treeC < ind){var trow=this._h2.get[arguments[0].idd];x.imgTag=x.childNodes[this._treeC].childNodes[0].childNodes[trow.level];x.valTag=x.childNodes[this._treeC].childNodes[0].childNodes[trow.level+2];}
 
 x.idd=row.idd;x.grid=this._fake;return x;}
 
 var zname="_insertRowAt";this._bfs_insertRowAt=this[zname];this[zname]=function(){var r=this["_bfs_insertRowAt"].apply(this,arguments);arguments[0]=this.copy_row(arguments[0]);var r2=this._fake["_insertRowAt"].apply(this._fake,arguments);if (r._fhd){r2.parentNode.removeChild(r2);this._fake.rowsCol._dhx_removeAt(this._fake.rowsCol._dhx_find(r2));r._fhd=false;}
 return r;}
 
 this._bfs_setSizes=this.setSizes;this.setSizes=function(){if (this._notresize)return;this._bfs_setSizes(this,arguments);this.sync_headers()
 if (this.sync_scroll()&& this._ahgr) this.setSizes();this._fake.entBox.style.height=this.entBox.style.height;this._fake.objBox.style.height=this.objBox.style.height;this._fake.hdrBox.style.height=this.hdrBox.style.height;this._fake.objBox.scrollTop=this.objBox.scrollTop;this._fake.setColumnSizes(this._fake.entBox.clientWidth);this.globalBox.style.width=parseInt(this.entBox.style.width)+parseInt(this._fake.entBox.style.width);this.globalBox.style.height=this.entBox.style.height;}
 
 this.sync_scroll=this._fake.sync_scroll=function(end){var old=this.objBox.style.overflowX;if (this.obj.offsetWidth<=this.objBox.offsetWidth){if (!end)return this._fake.sync_scroll(true);this.objBox.style.overflowX="hidden";this._fake.objBox.style.overflowX="hidden";}
 else{this.objBox.style.overflowX="scroll";this._fake.objBox.style.overflowX="scroll";}
 return old!=this.objBox.style.overflowX;}
 this.sync_headers=this._fake.sync_headers=function(){if (this.noHeader || (this._fake.hdr.scrollHeight==this.hdr.offsetHeight)) return;for (var i=1;i<this.hdr.rows.length;i++){var ha=this.hdr.rows[i].scrollHeight;var hb=this._fake.hdr.rows[i].scrollHeight;if (ha!=hb)this._fake.hdr.rows[i].style.height=this.hdr.rows[i].style.height=Math.max(ha,hb)+"px";if (window._KHTMLrv)this._fake.hdr.rows[i].childNodes[0].style.height=this.hdr.rows[i].childNodes[ind].style.height=Math.max(ha,hb)+"px";}
 this._fake.sync_headers;}
 this._fake._bfs_setSizes=this._fake.setSizes;this._fake.setSizes=function(){if (this._fake._notresize)return;this._fake.setSizes();}
 var zname="_doOnScroll";this._bfs__doOnScroll=this[zname];this[zname]=function(){this._bfs__doOnScroll.apply(this,arguments);this._fake.objBox.scrollTop=this.objBox.scrollTop;this._fake["_doOnScroll"].apply(this._fake,arguments);}
 
 var zname="selectAll";this._bfs__selectAll=this[zname];this[zname]=function(){this._bfs__selectAll.apply(this,arguments);this._bfs__selectAll.apply(this._fake,arguments);}
 
 



 var zname="doClick";this._bfs_doClick=this[zname];this[zname]=function(){this["_bfs_doClick"].apply(this,arguments);if (arguments[0].tagName=="TD"){var fl=(arguments[0]._cellIndex>=ind);if (!arguments[0].parentNode.idd)return;if (!fl)arguments[0].className=arguments[0].className.replace(/cellselected/g,"");if (!this._fake.rowsAr[arguments[0].parentNode.idd])this._fake.render_row(this.getRowIndex(arguments[0].parentNode.idd));arguments[0]=this._fake.cells(arguments[0].parentNode.idd,(fl?0:arguments[0]._cellIndex)).cell;if (fl)this._fake.cell=null;this._fake["_bfs_doClick"].apply(this._fake,arguments);if (fl)this._fake.cell=this.cell;else this.cell=this._fake.cell;if (this._fake.onRowSelectTime)clearTimeout(this._fake.onRowSelectTime)
 if (fl){arguments[0].className=arguments[0].className.replace(/cellselected/g,"");globalActiveDHTMLGridObject=this;this._fake.cell=this.cell;}
 else{this.objBox.scrollTop=this._fake.objBox.scrollTop;}
 }
 }
 this._fake._bfs_doClick=this._fake[zname];this._fake[zname]=function(){this["_bfs_doClick"].apply(this,arguments);if (arguments[0].tagName=="TD"){var fl=(arguments[0]._cellIndex<ind);if (!arguments[0].parentNode.idd)return;arguments[0]=this._fake._bfs_cells(arguments[0].parentNode.idd,(fl?ind:arguments[0]._cellIndex)).cell;this._fake.cell=null;this._fake["_bfs_doClick"].apply(this._fake,arguments);this._fake.cell=this.cell;if (this._fake.onRowSelectTime)clearTimeout(this._fake.onRowSelectTime)
 if (fl){arguments[0].className=arguments[0].className.replace(/cellselected/g,"");globalActiveDHTMLGridObject=this;this._fake.cell=this.cell;this._fake.objBox.scrollTop=this.objBox.scrollTop;}
 }
 }
this.clearSelectionA = this.clearSelection;this.clearSelection = function(mode){if (mode)this._fake.clearSelection();this.clearSelectionA();}
this.moveRowUpA = this.moveRowUp;this.moveRowUp = function(row_id){if (!this._h2)this._fake.moveRowUp(row_id);this.moveRowUpA(row_id);if (this._h2)this._fake._h2syncModel();}
this.moveRowDownA = this.moveRowDown;this.moveRowDown = function(row_id){if (!this._h2)this._fake.moveRowDown(row_id);this.moveRowDownA(row_id);if (this._h2)this._fake._h2syncModel();}
this._fake.getUserData=function(){return this._fake.getUserData.apply(this._fake,arguments);}
this._fake.setUserData=function(){return this._fake.setUserData.apply(this._fake,arguments);}
this.getSortingStateA=this.getSortingState;this.getSortingState = function(){var z=this.getSortingStateA();if (z.length!=0)return z;return this._fake.getSortingState();}
this.setSortImgStateA=this._fake.setSortImgStateA=this.setSortImgState;this.setSortImgState = function(a,b,c,d){this.setSortImgStateA(a,b,c,d);if (b*1<ind){this._fake.setSortImgStateA(a,b,c,d);this.setSortImgStateA(false);}else 
 this._fake.setSortImgStateA(false);}
this._fake.doColResizeA = this._fake.doColResize;this._fake.doColResize = function(ev,el,startW,x,tabW){var a=-1;var z=0;if (arguments[1]._cellIndex==(ind-1)){a = this._initalSplR + (ev.clientX-x);if (!this._initalSplF)this._initalSplF=arguments[3]+this.objBox.scrollWidth-this.objBox.offsetWidth;if (this.objBox.scrollWidth==this.objBox.offsetWidth && (this._fake.alter_split_resize || (ev.clientX-x)>0 )){arguments[3]=(this._initalSplF||arguments[3]);z=this.doColResizeA.apply(this,arguments);}
 else
 z=this.doColResizeA.apply(this,arguments);}
 else{if (this.obj.offsetWidth<this.entBox.offsetWidth)a=this.obj.offsetWidth;z=this.doColResizeA.apply(this,arguments);}
 
 this._correctSplit(a);this.resized=this._fake.resized=1;return z;}
 this._fake.changeCursorState = function(ev){var el = ev.target||ev.srcElement;if(el.tagName!="TD")el = this.getFirstParentOfType(el,"TD")
 if ((el.tagName=="TD")&&(this._drsclmn)&&(!this._drsclmn[el._cellIndex])) return;var check = (ev.layerX||0)+(((!_isIE)&&(ev.target.tagName=="DIV"))?el.offsetLeft:0);var pos = parseInt(this.getPosition(el,this.hdrBox));if(((el.offsetWidth - (ev.offsetX||(pos-check)*-1))<(_isOpera?20:10))||((this.entBox.offsetWidth - (ev.offsetX?(ev.offsetX+el.offsetLeft):check) + this.objBox.scrollLeft - 0)<(_isOpera?20:10))){el.style.cursor = "E-resize";}else
 el.style.cursor = "default";if (_isOpera)this.hdrBox.scrollLeft = this.objBox.scrollLeft;}
 
 this._fake.startColResizeA = this._fake.startColResize;this._fake.startColResize = function(ev){var z=this.startColResizeA(ev);this._initalSplR=this.entBox.offsetWidth;this._initalSplF=null;if (this.entBox.onmousemove){var m=this.entBox.parentNode;if (m._aggrid)return z;m._aggrid=m.grid;m.grid=this;this.entBox.parentNode.onmousemove=this.entBox.onmousemove;this.entBox.onmousemove=null;}
 return z;}
 this._fake.stopColResizeA = this._fake.stopColResize;this._fake.stopColResize = function(ev){if (this.entBox.parentNode.onmousemove){var m=this.entBox.parentNode;m.grid=m._aggrid;m._aggrid=null;this.entBox.onmousemove=this.entBox.parentNode.onmousemove;this.entBox.parentNode.onmousemove=null;if (this.obj.offsetWidth<this.entBox.offsetWidth)this._correctSplit(this.obj.offsetWidth);}
 return this.stopColResizeA(ev);}
this.doKeyA = this.doKey;this._fake.doKeyA = this._fake.doKey;this._fake.doKey=this.doKey=function(ev){if (!ev)return true;if (this._htkebl)return true;if ((ev.target||ev.srcElement).value !== window.undefined){var zx = (ev.target||ev.srcElement);if ((!zx.parentNode)||(zx.parentNode.className.indexOf("editable") == -1))
 return true;}
 
 switch (ev.keyCode){case 9:
 if (!ev.shiftKey){if (this._realfake){if ((this.cell)&&(this.cell._cellIndex==(ind-1))){if (ev.preventDefault)ev.preventDefault();var ind_t=ind;while (this._fake._hrrar && this._fake._hrrar[ind_t])ind_t++;this._fake.selectCell(this._fake.getRowIndex(this.cell.parentNode.idd),ind_t,false,false,true);return false;}
 else
 var z=this.doKeyA(ev);globalActiveDHTMLGridObject=this;return z;}
 else{if (this.cell){var ind_t=this.cell._cellIndex+1;while (this.rowsCol[0].childNodes[ind_t] && this.rowsCol[0].childNodes[ind_t].style.display=="none")ind_t++;if (ind_t == this.rowsCol[0].childNodes.length){if (ev.preventDefault)ev.preventDefault();var z=this.rowsBuffer[this.getRowIndex(this.cell.parentNode.idd)+1];if (z){this.showRow(z.idd);this._fake.selectCell(this._fake.getRowIndex(z.idd),0,false,false,true);return false;}
 }
 }
 return this.doKeyA(ev);}
 }
 else{if (this._realfake){if ((this.cell)&&(this.cell._cellIndex==0)){if (ev.preventDefault)ev.preventDefault();var z=this._fake.rowsBuffer[this._fake.getRowIndex(this.cell.parentNode.idd)-1];if (z){this._fake.showRow(z.idd);var ind_t=this._fake._cCount-1;while (z.childNodes[ind_t].style.display=="none")ind_t--;this._fake.selectCell(this._fake.getRowIndex(z.idd),ind_t,false,false,true);}
 return false;}
 else
 return this.doKeyA(ev);}
 else{if ((this.cell)&&(this.cell._cellIndex==ind)){if (ev.preventDefault)ev.preventDefault();this._fake.selectCell(this.getRowIndex(this.cell.parentNode.idd),ind-1,false,false,true);return false;}
 else
 return this.doKeyA(ev);}
 }
 break;}
 return this.doKeyA(ev);}
this.editCellA=this.editCell;this.editCell=function(){if (this.cell && this.cell.parentNode.grid != this)return this._fake.editCell();return this.editCellA();}
this.deleteRowA = this.deleteRow;this.deleteRow=function(row_id,node){if (this.deleteRowA(row_id,node)===false) return false;if (this._fake.rowsAr[row_id])this._fake.deleteRow(row_id);}
this.clearAllA = this.clearAll;this.clearAll=function(){this.clearAllA();this._fake.clearAll();}
this.editStopA = this.editStop;this.editStop=function(){if (this._fake.editor)this._fake.editStop();else 
 this.editStopA();};this.attachEvent("onAfterSorting",function(i,b,c){if (i>=ind)this._fake.setSortImgState(false)
});this._fake.sortField = function(a,b,c){this._fake.sortField.call(this._fake,a,b,this._fake.hdr.rows[0].cells[a]);if (this.fldSort[a]!="na" && this._fake.fldSorted){var mem = this._fake.getSortingState()[1];this._fake.setSortImgState(false);this.setSortImgState(true,arguments[0],mem)
 }
}
this.sortTreeRowsA = this.sortTreeRows;this._fake.sortTreeRowsA = this._fake.sortTreeRows;this.sortTreeRows=this._fake.sortTreeRows=function(col,type,order,ar){if (this._realfake)return this._fake.sortTreeRows(col,type,order,ar)

 this.sortTreeRowsA(col,type,order,ar);this._fake._h2syncModel();this._fake.setSortImgStateA(false);this._fake.fldSorted=null;}
this._fake._fillers=[];this._fake.rowsBuffer=this.rowsBuffer;this.attachEvent("onClearAll",function(){this._fake.rowsBuffer=this.rowsBuffer;})
this._add_filler_s=this._add_filler;this._add_filler=function(a,b,c,e){if (!this._fake._fillers)this._fake._fillers=[];if (this._realfake || !e){var d;if (c || !this._fake._fillers.length){if (c && c.idd)d=this._fake.rowsAr[c.idd];else if (c && c.nextSibling){d = {};d.nextSibling=this._fake.rowsAr[c.nextSibling.idd];d.parentNode=d.nextSibling.parentNode;}
 this._fake._fillers.push(this._fake._add_filler(a,b,d));}
 }
 
 return this._add_filler_s.apply(this,arguments);}
this._add_from_buffer_s=this._add_from_buffer;this._add_from_buffer=function() {var res=this._add_from_buffer_s.apply(this,arguments);if (res!=-1){this._fake._add_from_buffer.apply(this._fake,arguments);if (this.multiLine)this._correctRowHeight(this.rowsBuffer[arguments[0]].idd);}
 return res;}
this._fake.render_row=function(ind){var row=this._fake.render_row(ind);if (row == -1)return -1;if (row){return this.rowsAr[row.idd]=this.rowsAr[row.idd]||this._fake.copy_row(row);}
 return null;}
this._reset_view_s=this._reset_view;this._reset_view=function(){this._fake._reset_view(true);this._fake._fillers=[];this._reset_view_s();}
this.moveColumn_s=this.moveColumn;this.moveColumn=function(a,b){if (b>=ind)return this.moveColumn_s(a,b);}
 
this.attachEvent("onCellChanged",function(id,i,val){if (this._split_event && i<ind && this.rowsAr[id]){var cell=this._fake.rowsAr[id];if (!cell)return;if (cell._childIndexes)cell=cell.childNodes[cell._childIndexes[i]];else
 cell=cell.childNodes[i];var tcell = this.rowsAr[id].childNodes[i];if (tcell._treeCell && tcell.firstChild.lastChild)tcell.firstChild.lastChild.innerHTML = val;else
 tcell.innerHTML=cell.innerHTML;tcell._clearCell=false;tcell.combo_value = cell.combo_value;tcell.chstate=cell.chstate;}
})





 this._fake.combos=this.combos;this.setSizes();if (this.rowsBuffer[0])this._reset_view();this.attachEvent("onXLE",function(){this._fake._correctSplit()})
 this._fake._correctSplit();}
dhtmlXGridObject.prototype._correctSplit=function(a){a=a||(this.obj.scrollWidth-this.objBox.scrollLeft);a=Math.min(this.globalBox.offsetWidth, a);if (a>-1){this.entBox.style.width=a+"px";this.objBox.style.width=a+"px";var outerBorder=(this.globalBox.offsetWidth-this.globalBox.clientWidth)/2;this._fake.entBox.style.left=a+"px";this._fake.entBox.style.width=Math.max(0,this.globalBox.offsetWidth-a-(this.quirks?0:2)*outerBorder)+"px";if (this._fake.ftr)this._fake.ftr.parentNode.style.width=this._fake.entBox.style.width;if (_isIE){var quirks=_isIE && !window.xmlHttpRequest;var outerBorder=(this.globalBox.offsetWidth-this.globalBox.clientWidth);this._fake.hdrBox.style.width=this._fake.objBox.style.width=Math.max(0,this.globalBox.offsetWidth-(quirks?outerBorder:0)-a)+"px";}
 }
}
dhtmlXGridObject.prototype._correctRowHeight=function(id,ind){if (!this.rowsAr[id] || !this._fake.rowsAr[id])return;var h=this.rowsAr[id].offsetHeight;var h2=this._fake.rowsAr[id].offsetHeight;var max = Math.max(h,h2);if (!max)return;this.rowsAr[id].style.height=this._fake.rowsAr[id].style.height=max+"px";if (window._KHTMLrv)this.rowsAr[id].childNodes[this._fake._cCount].style.height=this._fake.rowsAr[id].firstChild.style.height=max+"px";}
dhtmlXGridObject.prototype.enableSmartRendering=function(mode,buffer,reserved){if (arguments.length>2){if (buffer && !this.rowsBuffer[buffer-1])this.rowsBuffer[buffer-1]=0;buffer=reserved;}
 this._srnd=convertStringToBoolean(mode);this._srdh=this._srdh||20;this._dpref=buffer||0;};dhtmlXGridObject.prototype.enablePreRendering=function(buffer){this._srnd_pr=parseInt(buffer||50);};dhtmlXGridObject.prototype.forceFullLoading=function(buffer, callback){for (var i=0;i<this.rowsBuffer.length;i++)if (!this.rowsBuffer[i]){var usedbuffer = buffer || (this.rowsBuffer.length-i);if (this.callEvent("onDynXLS",[i,usedbuffer])){var self=this;this.load(this.xmlFileUrl+getUrlSymbol(this.xmlFileUrl)+"posStart="+i+"&count="+usedbuffer, function(){window.setTimeout(function(){self.forceFullLoading(buffer, callback);},100);}, this._data_type);}
 return;}
 if (callback)callback.call(this);};dhtmlXGridObject.prototype.setAwaitedRowHeight = function(height) {this._srdh=parseInt(height);};dhtmlXGridObject.prototype._get_view_size=function(){return Math.floor(parseInt(this.entBox.offsetHeight)/this._srdh)+2;};dhtmlXGridObject.prototype._add_filler=function(pos,len,fil,rsflag){if (!len)return null;var id="__filler__";var row=this._prepareRow(id);row.firstChild.style.width="1px";for (var i=1;i<row.childNodes.length;i++)row.childNodes[i].style.display='none';row.firstChild.style.height=len*this._srdh+"px";fil=fil||this.rowsCol[pos];if (fil && fil.nextSibling)fil.parentNode.insertBefore(row,fil.nextSibling);else
 if (_isKHTML)this.obj.appendChild(row);else
 this.obj.rows[0].parentNode.appendChild(row);this.callEvent("onAddFiller",[pos,len,row,fil,rsflag]);return [pos,len,row];};dhtmlXGridObject.prototype._update_srnd_view=function(){var min=Math.floor(this.objBox.scrollTop/this._srdh);var max=min+this._get_view_size();if (this.multiLine){var pxHeight = this.objBox.scrollTop;min = 0;while(pxHeight > 0){pxHeight-=this.rowsCol[min]?this.rowsCol[min].offsetHeight:this._srdh;min++;}
 
 max=min+this._get_view_size();if (min>0)min--;}
 max+=(this._srnd_pr||0);if (max>this.rowsBuffer.length)max=this.rowsBuffer.length;for (var j=min;j<max;j++){if (!this.rowsCol[j]){var res=this._add_from_buffer(j);if (res==-1){if (this.xmlFileUrl){if (this._dpref && this.rowsBuffer[max-1]){var rows_count = this._dpref?this._dpref:(max-j)
 var start_pos = Math.max(0, max - this._dpref);this._current_load=[start_pos, max-start_pos];}else 
 this._current_load=[j,(this._dpref?this._dpref:(max-j))];if (this.callEvent("onDynXLS",this._current_load))
 this.load(this.xmlFileUrl+getUrlSymbol(this.xmlFileUrl)+"posStart="+this._current_load[0]+"&count="+this._current_load[1], this._data_type);}
 return;}else {if (this._tgle){this._updateLine(this._h2.get[this.rowsBuffer[j].idd],this.rowsBuffer[j]);this._updateParentLine(this._h2.get[this.rowsBuffer[j].idd],this.rowsBuffer[j]);}
 if (j && j==(this._realfake?this._fake:this)["_r_select"]){this.selectCell(j, this.cell?this.cell._cellIndex:0, true);}
 }
 }
 }
 if (this._fake && !this._realfake && this.multiLine)this._fake.objBox.scrollTop = this.objBox.scrollTop;}
dhtmlXGridObject.prototype._add_from_buffer=function(ind){var row=this.render_row(ind);if (row==-1)return -1;if (row._attrs["selected"] || row._attrs["select"]){this.selectRow(row,false,true);row._attrs["selected"]=row._attrs["select"]=null;}
 
 if (!this._cssSP){if (this._cssEven && ind%2 == 0 )row.className=this._cssEven+((row.className.indexOf("rowselected") != -1)?" rowselected ":" ")+(row._css||"");else if (this._cssUnEven && ind%2 == 1 )row.className=this._cssUnEven+((row.className.indexOf("rowselected") != -1)?" rowselected ":" ")+(row._css||"");}else if (this._h2){var x=this._h2.get[row.idd];row.className+=" "+((x.level%2)?(this._cssUnEven+" "+this._cssUnEven):(this._cssEven+" "+this._cssEven))+"_"+x.level+(this.rowsAr[x.id]._css||"");}
 

 
 for (var i=0;i<this._fillers.length;i++){var f=this._fillers[i];if (f && f[0]<=ind && (f[0]+f[1])>ind ){var pos=ind-f[0];if (pos==0){this._insert_before(ind,row,f[2]);this._update_fillers(i,-1,1);}else if (pos == f[1]-1){this._insert_after(ind,row,f[2]);this._update_fillers(i,-1,0);}else {this._fillers.push(this._add_filler(ind+1,f[1]-pos-1,f[2],1));this._insert_after(ind,row,f[2]);this._update_fillers(i,-f[1]+pos,0);}
 return;}
 }
}
dhtmlXGridObject.prototype._update_fillers=function(ind,right,left){var f=this._fillers[ind];f[1]=f[1]+right;f[0]=f[0]+left;if (!f[1]){this.callEvent("onRemoveFiller",[f[2]]);f[2].parentNode.removeChild(f[2]);this._fillers.splice(ind,1);}else {f[2].firstChild.style.height=parseFloat(f[2].firstChild.style.height)+right*this._srdh+"px";this.callEvent("onUpdateFiller",[f[2]]);}
}
dhtmlXGridObject.prototype._insert_before=function(ind,row,fil){fil.parentNode.insertBefore(row,fil);this.rowsCol[ind]=row;this.callEvent("onRowInserted",[row,null,fil,"before"]);}
dhtmlXGridObject.prototype._insert_after=function(ind,row,fil){if (fil.nextSibling)fil.parentNode.insertBefore(row,fil.nextSibling);else
 fil.parentNode.appendChild(row);this.rowsCol[ind]=row;this.callEvent("onRowInserted",[row,null,fil,"after"]);}
dhtmlXGridObject.prototype.enableAutoSizeSaving = function(name,cookie_param){this.attachEvent("onResizeEnd",function(){this.saveSizeToCookie(name,cookie_param) });}
dhtmlXGridObject.prototype.saveOpenStates = function(name,cookie_param){if (!name)name=this.entBox.id;var t=[];this._h2.forEachChild(0,function(el){if (el.state=="minus")t.push(el.id);});var str = "gridOpen"+(name||"") + "=" + t.join("|") + (cookie_param?(";"+cookie_param):"");document.cookie = str;}
dhtmlXGridObject.prototype.loadOpenStates = function(name,cookie_param){var val=this.getCookie(name,"gridOpen");if (!val)return;val=val.split("|");for (var i = 0;i < val.length;i++){var pid = this.getParentId(val[i]);if (!this.getOpenState(pid)) continue;this.openItem(val[i]);}
}
dhtmlXGridObject.prototype.enableAutoHiddenColumnsSaving = function(name,cookie_param){this.attachEvent("onColumnHidden",function(){this.saveHiddenColumnsToCookie(name,cookie_param);});}
dhtmlXGridObject.prototype.enableSortingSaving = function(name,cookie_param){this.attachEvent("onBeforeSorting",function(){var that=this;window.setTimeout(function(){that.saveSortingToCookie(name,cookie_param);},1);return true;});}
dhtmlXGridObject.prototype.enableOrderSaving = function(name,cookie_param){this.attachEvent("onAfterCMove",function(){this.saveOrderToCookie(name,cookie_param);this.saveSizeToCookie(name,cookie_param);});}
dhtmlXGridObject.prototype.enableAutoSaving = function(name,cookie_param){this.enableOrderSaving(name,cookie_param);this.enableAutoSizeSaving(name,cookie_param);this.enableSortingSaving(name,cookie_param);}
dhtmlXGridObject.prototype.saveSizeToCookie=function(name,cookie_param){if (this.cellWidthType=='px')var z=this.cellWidthPX.join(",");else
 var z=this.cellWidthPC.join(",");var z2=(this.initCellWidth||(new Array)).join(",");this.setCookie(name,cookie_param,0,z);this.setCookie(name,cookie_param,1,z2);}
dhtmlXGridObject.prototype.saveHiddenColumnsToCookie=function(name,cookie_param){var hs=[].concat(this._hrrar||[]);if (this._fake && this._fake._hrrar)for (var i=0;i < this._fake._cCount;i++)hs[i]=this._fake._hrrar[i]?"1":"";this.setCookie(name,cookie_param,4,hs.join(",").replace(/display:none;/g,"1"));}
dhtmlXGridObject.prototype.loadHiddenColumnsFromCookie=function(name){var z=this._getCookie(name,4);var ar=(z||"").split(",");for (var i=0;i < this._cCount;i++)this.setColumnHidden(i,(ar[i]?true:false));}
dhtmlXGridObject.prototype.saveSortingToCookie=function(name,cookie_param){this.setCookie(name,cookie_param,2,(this.getSortingState()||[]).join(","));}
dhtmlXGridObject.prototype.loadSortingFromCookie=function(name){var z=this._getCookie(name,2);z=(z||"").split(",");if (z.length>1 && z[0]<this._cCount){this.sortRows(z[0],null,z[1]);this.setSortImgState(true,z[0],z[1]);}
}
dhtmlXGridObject.prototype.saveOrderToCookie=function(name,cookie_param){if (!this._c_order){this._c_order=[];var l=this._cCount;for (var i=0;i<l;i++)this._c_order[i]=i;}
 this.setCookie(name,cookie_param,3,((this._c_order||[]).slice(0,this._cCount)).join(","));this.saveSortingToCookie();}
dhtmlXGridObject.prototype.loadOrderFromCookie=function(name){var z=this._getCookie(name,3);z=(z||"").split(",");if (z.length>1 && z.length<=this._cCount){for (var i=0;i<z.length;i++)if ((!this._c_order && z[i]!=i)||(this._c_order && z[i]!=this._c_order[i])){var t=z[i];if (this._c_order)for (var j=0;j<this._c_order.length;j++){if (this._c_order[j]==z[i]){t=j;break;}
 }
 this.moveColumn(t*1,i);}
 }
}
dhtmlXGridObject.prototype.loadSizeFromCookie=function(name){var z=this._getCookie(name,1);if (z)this.initCellWidth=z.split(",");var z=this._getCookie(name,0);if ((z)&&(z.length)){if (!this._fake && this._hrrar)for (var i=0;i<z.length;i++)if ( this._hrrar[i])z[i]=0;if (this.cellWidthType=='px')this.cellWidthPX=z.split(",");else
 this.cellWidthPC=z.split(",");}
 this.setSizes();return true;}
dhtmlXGridObject.prototype.clearConfigCookie=function(name){if (!name)name=this.entBox.id;var str = "gridSettings"+name + "=||||";document.cookie = str;}
dhtmlXGridObject.prototype.clearSizeCookie=dhtmlXGridObject.prototype.clearConfigCookie;dhtmlXGridObject.prototype.setCookie=function(name,cookie_param,pos,value) {if (!name)name=this.entBox.id;var t=this.getCookie(name);t=(t||"||||").split("|");t[pos]=value;var str = "gridSettings"+name + "=" + t.join("|") + (cookie_param?(";"+cookie_param):"");document.cookie = str;}
dhtmlXGridObject.prototype.getCookie=function(name,surname) {if (!name)name=this.entBox.id;name=(surname||"gridSettings")+name;var search = name + "=";if (document.cookie.length > 0){var offset = document.cookie.indexOf(search);if (offset != -1){offset += search.length;var end = document.cookie.indexOf(";", offset);if (end == -1)end = document.cookie.length;return document.cookie.substring(offset, end);}}
};dhtmlXGridObject.prototype._getCookie=function(name,pos) {return ((this.getCookie(name)||"||||").split("|"))[pos];}
function dhtmlXGridFromTable(obj,init){if(typeof(obj)!='object')
 obj = document.getElementById(obj);var w=document.createElement("DIV");w.setAttribute("width",obj.getAttribute("gridWidth")||(obj.offsetWidth?(obj.offsetWidth+"px"):0)||(window.getComputedStyle?window.getComputedStyle(obj,null)["width"]:(obj.currentStyle?obj.currentStyle["width"]:0)));w.setAttribute("height",obj.getAttribute("gridHeight")||(obj.offsetHeight?(obj.offsetHeight+"px"):0)||(window.getComputedStyle?window.getComputedStyle(obj,null)["height"]:(obj.currentStyle?obj.currentStyle["height"]:0)));w.className = obj.className;obj.className="";if (obj.id)w.id = obj.id;var mr=obj;var drag=obj.getAttribute("dragAndDrop");mr.parentNode.insertBefore(w,mr);var f=mr.getAttribute("name")||("name_"+(new Date()).valueOf());var windowf=new dhtmlXGridObject(w);window[f]=windowf;var acs=mr.getAttribute("onbeforeinit");var acs2=mr.getAttribute("oninit");if (acs)eval(acs);windowf.setImagePath(windowf.imgURL||(mr.getAttribute("imgpath")|| mr.getAttribute("image_path") ||""));var skin = mr.getAttribute("skin");if (skin)windowf.setSkin(skin);if (init)init(windowf);var hrow=mr.rows[0];var za="";var zb="";var zc="";var zd="";var ze="";for (var i=0;i<hrow.cells.length;i++){za+=(za?",":"")+hrow.cells[i].innerHTML;var width=hrow.cells[i].getAttribute("width")||hrow.cells[i].offsetWidth||(window.getComputedStyle?window.getComputedStyle(hrow.cells[i],null)["width"]:(hrow.cells[i].currentStyle?hrow.cells[i].currentStyle["width"]:0));zb+=(zb?",":"")+(width=="*"?width:parseInt(width));zc+=(zc?",":"")+(hrow.cells[i].getAttribute("align")||"left");zd+=(zd?",":"")+(hrow.cells[i].getAttribute("type")||"ed");ze+=(ze?",":"")+(hrow.cells[i].getAttribute("sort")||"str");var f_a=hrow.cells[i].getAttribute("format");if (f_a)if(hrow.cells[i].getAttribute("type").toLowerCase().indexOf("calendar")!=-1) 
 windowf._dtmask=f_a;else
 windowf.setNumberFormat(f_a,i);}
 windowf.setHeader(za);windowf.setInitWidths(zb)
 windowf.setColAlign(zc)
 windowf.setColTypes(zd);windowf.setColSorting(ze);if (obj.getAttribute("gridHeight")=="auto")
 windowf.enableAutoHeigth(true);if (obj.getAttribute("multiline")) windowf.enableMultiline(true);var lmn=mr.getAttribute("lightnavigation");if (lmn)windowf.enableLightMouseNavigation(lmn);var evr=mr.getAttribute("evenrow");var uevr=mr.getAttribute("unevenrow");if (evr||uevr)windowf.enableAlterCss(evr,uevr);if (drag)windowf.enableDragAndDrop(true);windowf.init();if (obj.getAttribute("split")) windowf.splitAt(obj.getAttribute("split"));windowf._process_inner_html(mr,1);if (acs2)eval(acs2);if (obj.parentNode && obj.parentNode.removeChild)obj.parentNode.removeChild(obj);return windowf;}
dhtmlXGridObject.prototype._process_html=function(xml){if (xml.tagName && xml.tagName == "TABLE")return this._process_inner_html(xml,0);var temp=document.createElement("DIV");temp.innerHTML=xml.xmlDoc.responseText;var mr = temp.getElementsByTagName("TABLE")[0];this._process_inner_html(mr,0);}
dhtmlXGridObject.prototype._process_inner_html=function(mr,start){var n_l=mr.rows.length;for (var j=start;j<n_l;j++){var id=mr.rows[j].getAttribute("id")||j;this.rowsBuffer.push({idd:id, data:mr.rows[j], _parser: this._process_html_row, _locator:this._get_html_data });}
 this.render_dataset();this.setSizes();}
 
dhtmlXGridObject.prototype._process_html_row=function(r,xml){var cellsCol = xml.getElementsByTagName('TD');var strAr = [];r._attrs=this._xml_attrs(xml);for(var j=0;j<cellsCol.length;j++){var cellVal=cellsCol[j];var exc=cellVal.getAttribute("type");if (r.childNodes[j]){if (exc)r.childNodes[j]._cellType=exc;r.childNodes[j]._attrs=this._xml_attrs(cellsCol[j]);}
 
 if (cellVal.firstChild)strAr.push(cellVal.innerHTML);else strAr.push("");if (cellVal.colSpan>1){r.childNodes[j]._attrs["colspan"]=cellVal.colSpan;for (var k=1;k<cellVal.colSpan;k++){strAr.push("")
 }
 }
 
}
 for(j<cellsCol.length;j<r.childNodes.length;j++)r.childNodes[j]._attrs={};this._fillRow(r,(this._c_order?this._swapColumns(strAr):strAr));return r;}
dhtmlXGridObject.prototype._get_html_data=function(data,ind){data=data.firstChild;while (true){if (!data)return "";if (data.tagName=="TD")ind--;if (ind<0)break;data=data.nextSibling;}
 return (data.firstChild?data.firstChild.data:"");}
dhtmlxEvent(window,"load",function(){var z=document.getElementsByTagName("table");for (var a=0;a<z.length;a++)if (z[a].className=="dhtmlxGrid"){dhtmlXGridFromTable(z[a]);}
});dhtmlXGridObject.prototype.enableUndoRedo = function()
{var self = this;var func = function() {return self._onEditUndoRedo.apply(self,arguments);}
 this.attachEvent("onEditCell", func);var func2 = function(a,b,c) {return self._onEditUndoRedo.apply(self,[2,a,b,(c?1:0),(c?0:1)]);}
 this.attachEvent("onCheckbox", func2);this._IsUndoRedoEnabled = true;this._UndoRedoData = [];this._UndoRedoPos = -1;}
dhtmlXGridObject.prototype.disableUndoRedo = function()
{this._IsUndoRedoEnabled = false;this._UndoRedoData = [];this._UndoRedoPos = -1;}
dhtmlXGridObject.prototype._onEditUndoRedo = function(stage, row_id, cell_index, new_value, old_value)
{if (this._IsUndoRedoEnabled && stage == 2 && old_value != new_value){if (this._UndoRedoPos !== -1 && this._UndoRedoPos != ( this._UndoRedoData.length-1 )) {this._UndoRedoData = this._UndoRedoData.slice(0, this._UndoRedoPos+1);}else if (this._UndoRedoPos === -1 && this._UndoRedoData.length > 0){this._UndoRedoData = [];}
 var obj = {old_value:old_value,
 new_value:new_value,
 row_id:row_id,
 cell_index:cell_index
 };this._UndoRedoData.push(obj);this._UndoRedoPos++;}
 return true;}
dhtmlXGridObject.prototype.doUndo = function()
{if (this._UndoRedoPos === -1)return false;var obj = this._UndoRedoData[this._UndoRedoPos--];var c=this.cells(obj.row_id, obj.cell_index);if (this.getColType(obj.cell_index)=="tree")
 c.setLabel(obj.old_value);else
 c.setValue(obj.old_value);this.callEvent("onUndo", [obj.row_id]);}
dhtmlXGridObject.prototype.doRedo = function()
{if (this._UndoRedoPos == this._UndoRedoData.length-1)return false;var obj = this._UndoRedoData[++this._UndoRedoPos];this.cells(obj.row_id, obj.cell_index).setValue(obj.new_value);this.callEvent("onUndo", [obj.row_id]);}
dhtmlXGridObject.prototype.getRedo = function()
{if (this._UndoRedoPos == this._UndoRedoData.length-1)return [];return this._UndoRedoData.slice(this._UndoRedoPos+1);}
dhtmlXGridObject.prototype.getUndo = function()
{if (this._UndoRedoPos == -1)return [];return this._UndoRedoData.slice(0, this._UndoRedoPos+1);}
function eXcell_sub_row(cell){if (cell){this.cell = cell;this.grid = this.cell.parentNode.grid;}
 
 this.getValue = function(){return this.grid.getUserData(this.cell.parentNode.idd,"__sub_row");}
 this._setState = function(m,v){(v||this.cell).innerHTML="<img src='"+this.grid.imgURL+m+"' width='18' height='18' />";(v||this.cell).firstChild.onclick=this.grid._expandMonolite;}
 this.open = function (){this.cell.firstChild.onclick(null,true)
 }
 this.close = function (){this.cell.firstChild.onclick(null,false,true)
 }
 this.isOpen = function(){return !!this.cell.parentNode._expanded;}
 this.setValue = function(val){if (val)this.grid.setUserData(this.cell.parentNode.idd,"__sub_row",val);this._setState(val?"plus.gif":"blanc.gif");}
 this.setContent = function(val){if (this.cell.parentNode._expanded){this.cell.parentNode._expanded.innerHTML=val;this.resize();}
 else{this.cell._previous_content=null;this.setValue(val);this.cell._sub_row_type=null
 }
 
 }
 this.resize = function(){this.grid._detectHeight(this.cell.parentNode._expanded,this.cell,this.cell.parentNode._expanded.scrollHeight);},
 this.isDisabled = function(){return true;}
 this.getTitle = function(){return this.grid.getUserData(this.cell.parentNode.idd,"__sub_row")?"click to expand|collapse":"";}
}
eXcell_sub_row.prototype = new eXcell;function eXcell_sub_row_ajax(cell){this.base=eXcell_sub_row;this.base(cell);this.setValue = function(val){if (val)this.grid.setUserData(this.cell.parentNode.idd,"__sub_row",val);this.cell._sub_row_type="ajax";this.cell._previous_content = null;this._setState(val?"plus.gif":"blanc.gif");}
}
eXcell_sub_row_ajax.prototype = new eXcell_sub_row;function eXcell_sub_row_grid(cell){this.base=eXcell_sub_row;this.base(cell);this.setValue = function(val){if (val)this.grid.setUserData(this.cell.parentNode.idd,"__sub_row",val);this.cell._sub_row_type="grid";this._setState(val?"plus.gif":"blanc.gif");}
 this.getSubGrid = function(){if (!cell._sub_grid)return null;return cell._sub_grid;}
}
eXcell_sub_row_grid.prototype = new eXcell_sub_row;dhtmlXGridObject.prototype._expandMonolite=function(n,show,hide){var td=this.parentNode;var row=td.parentNode;var that=row.grid;if (n||window.event){if (!hide && !row._expanded)that.editStop();(n||event).cancelBubble=true;}
 
 var c=that.getUserData(row.idd,"__sub_row");if (!that._sub_row_editor)that._sub_row_editor=new eXcell_sub_row(td);if (!c)return;if (row._expanded && !show){that._sub_row_editor._setState("plus.gif",td);td._previous_content=row._expanded;that.objBox.removeChild(row._expanded);row._expanded=false;row.style.height=(row.oldHeight||20)+"px";td.style.height=(row.oldHeight||20)+"px";if (that._fake)that._fake.rowsAr[row.idd].style.height=(row.oldHeight||20)+"px";for (var i=0;i<row.cells.length;i++){row.cells[i].style.verticalAlign="middle";row.cells[i].style.paddingTop="0px";}
 
 delete that._flow[row.idd];that._correctMonolite();row._expanded.ctrl=null;}else if (!row._expanded && !hide){that._sub_row_editor._setState("minus.gif",td);row.oldHeight=td.offsetHeight;if (td._previous_content){var d=td._previous_content;d.ctrl=td;that.objBox.appendChild(d);that._detectHeight(d,td,parseInt(d.style.height)) 
 }
 else {var d=document.createElement("DIV");d.ctrl=td;if (td._sub_row_type)that._sub_row_render[td._sub_row_type](that,d,td,c);else
 d.innerHTML=c;d.style.cssText="position:absolute;left:0px;top:0px;overflow:auto;font-family:Tahoma;font-size:8pt;margin-top:2px;margin-left:4px;";d.className="dhx_sub_row";that.objBox.appendChild(d);that._detectHeight(d,td) 
 }
 

 
 
 if (!that._flow){that.attachEvent("onGridReconstructed",function(){if (this.pagingOn || this._srnd)this._collapsMonolite();else this._correctMonolite();});that.attachEvent("onResizeEnd",function(){this._correctMonolite(true);});that.attachEvent("onAfterCMove",function(){this._correctMonolite(true);});that.attachEvent("onDrop",function(){this._correctMonolite(true);});that.attachEvent("onBeforePageChanged",function(){this._collapsMonolite();return true;});that.attachEvent("onGroupStateChanged",function(){this._correctMonolite();return true;});that.attachEvent("onFilterEnd",function(){this._collapsMonolite();});that.attachEvent("onUnGroup",function(){this._collapsMonolite();});that.attachEvent("onPageChanged",function(){this._collapsMonolite();});that.attachEvent("onXLE",function(){this._collapsMonolite();});that.attachEvent("onClearAll",function(){for (var i in this._flow){if (this._flow[i] && this._flow[i].parentNode)this._flow[i].parentNode.removeChild(this._flow[i]);};this._flow=[];});that.attachEvent("onEditCell",function(a,b,c){if ((a!==2)&& this._flow[b] && this.cellType[c]!="ch" && this.cellType[c]!="ra") this._expandMonolite.apply(this._flow[b].ctrl.firstChild,[0,false,true]);return true;});that.attachEvent("onCellChanged",function(id,ind){if (!this._flow[id])return;var c=this.cells(id,ind).cell;c.style.verticalAlign="top";c.style.paddingTop="3px";});that._flow=[];}
 that._flow[row.idd]=d;that._correctMonolite();var padtop = that._srdh > 30 ? 11:3;for (var i=0;i<row.cells.length;i++){row.cells[i].style.verticalAlign="top";row.cells[i].style.paddingTop=padtop+"px";}
 if (that._fake){var frow=that._fake.rowsAr[row.idd];for (var i=0;i<frow.cells.length;i++){frow.cells[i].style.verticalAlign="top";frow.cells[i].style.paddingTop=padtop+"px";}
 }
 td.style.paddingTop=(padtop-1)+"px";row._expanded=d;}
 if (that._ahgr)that.setSizes()
 if (that.parentGrid)that.callEvent("onGridReconstructed",[]);that.callEvent("onSubRowOpen",[row.idd,(!!row._expanded)]);}
dhtmlXGridObject.prototype._sub_row_render={"ajax":function(that,d,td,c){d.innerHTML="Loading...";var xml=new dtmlXMLLoaderObject(function(){d.innerHTML=xml.xmlDoc.responseText;var z=xml.xmlDoc.responseText.match(/<script[^>]*>([^\f]+?)<\/script>/g);if (z)for (var i=0;i<z.length;i++)eval(z[i].replace(/<([\/]{0,1})s[^>]*>/g,""));that._detectHeight(d,td)
 that._correctMonolite();that.setUserData(td.parentNode.idd,"__sub_row",xml.xmlDoc.responseText);td._sub_row_type=null;if (that._ahgr)that.setSizes()
 that.callEvent("onSubAjaxLoad",[td.parentNode.idd,xml.xmlDoc.responseText]);}, this,true,true);xml.loadXML(c);},
 "grid":function(that,d,td,c){td._sub_grid= new dhtmlXGridObject(d);if (that.skin_name)td._sub_grid.setSkin(that.skin_name);td._sub_grid.parentGrid=that;td._sub_grid.setImagePath(that.imgURL);td._sub_grid.enableAutoHeight(true);td._sub_grid._delta_x = td._sub_grid._delta_y = null;td._sub_grid.attachEvent("onGridReconstructed",function(){that._detectHeight(d,td,td._sub_grid.objBox.scrollHeight+td._sub_grid.hdr.offsetHeight+(this.ftr?this.ftr.offsetHeight:0));that._correctMonolite();this.setSizes();if (that.parentGrid)that.callEvent("onGridReconstructed",[]);})
 if (!that.callEvent("onSubGridCreated",[td._sub_grid,td.parentNode.idd,td._cellIndex,c])) return;td._sub_grid.loadXML(c,function(){that._detectHeight(d,td,td._sub_grid.objBox.scrollHeight+td._sub_grid.hdr.offsetHeight+(td._sub_grid.ftr?td._sub_grid.ftr.offsetHeight:0));td._sub_grid.objBox.style.overflow="hidden";that._correctMonolite();td._sub_row_type=null;if (!that.callEvent("onSubGridLoaded",[td._sub_grid,td.parentNode.idd,td._cellIndex,c])) return;if (that._ahgr)that.setSizes();});}
}
dhtmlXGridObject.prototype._detectHeight=function(d,td,h){var l=td.offsetLeft+td.offsetWidth;d.style.left=l+"px";d.style.width=Math.max(0,td.parentNode.offsetWidth-l-4)+"px"
 var h=h||d.scrollHeight;d.style.overflow="hidden";d.style.height=h+"px";var row=td.parentNode;td.parentNode.style.height=(row.oldHeight||20)+3+h*1+"px";td.style.height=(row.oldHeight||20)+3+h*1+"px";if (this._fake){var tr=this._fake.rowsAr[td.parentNode.idd];tr.style.height=(row.oldHeight||20)+3+h*1+"px";}
}
dhtmlXGridObject.prototype._correctMonolite=function(mode){if (this._in_correction)return;this._in_correction=true;for (var a in this._flow)if (this._flow[a] && this._flow[a].tagName=="DIV")if (this.rowsAr[a]){if (this.rowsAr[a].style.display=="none"){this.cells4(this._flow[a].ctrl).close();continue;}
 this._flow[a].style.top=this.rowsAr[a].offsetTop+(this.rowsAr[a].oldHeight||20)+"px";if (mode){var l=this._flow[a].ctrl.offsetLeft+this._flow[a].ctrl.offsetWidth;this._flow[a].style.left=l+"px";this._flow[a].style.width=this.rowsAr[a].offsetWidth-l-4+"px"
 }
 }
 else{this._flow[a].ctrl=null;this.objBox.removeChild(this._flow[a]);delete this._flow[a];}
 this._in_correction=false;}
dhtmlXGridObject.prototype._collapsMonolite=function(){for (var a in this._flow)if (this._flow[a] && this._flow[a].tagName=="DIV")if (this.rowsAr[a])this.cells4(this._flow[a].ctrl).close();}
dhtmlxValidation=function(){};dhtmlxValidation.prototype={trackInput:function(el,rule,callback_error,callback_correct){dhtmlxEvent(el,"keyup",function(e){if (dhtmlxValidation._timer){window.clearTimeout(dhtmlxValidation._timer);dhtmlxValidation._timer = null;}
 dhtmlxValidation._timer = window.setTimeout(function(){if (!dhtmlxValidation.checkInput(el,rule)){if(!callback_error || callback_error(el,el.value,rule))
 el.className+=" dhtmlx_live_validation_error";}else {el.className=el.className.replace(/[ ]*dhtmlx_live_validation_error/g,"");if (callback_correct)callback_correct(el,el.value,rule);}
 
 },250);});},
 checkInput:function(input,rule){return this.checkValue(input.value,rule);},
 checkValue:function(value,rule){if (typeof rule=="string")rule = rule.split(",");var final_res=true;for (var i=0;i<rule.length;i++){if (!this["is"+rule[i]])alert("Incorrect validation rule: "+rule[i]);else
 final_res=final_res&&this["is"+rule[i]](value);;}
 return final_res;},
 isEmpty: function(value) {return value == '';},
 isNotEmpty: function(value) {return !value == '';},
 isValidBoolean: function(value) {return !!value.toString().match(/^(0|1|true|false)$/);},
 isValidEmail: function(value) {return !!value.toString().match(/(^[a-z0-9]([0-9a-z\-_\.]*)@([0-9a-z_\-\.]*)([.][a-z]{3})$)|(^[a-z]([0-9a-z_\.\-]*)@([0-9a-z_\-\.]*)(\.[a-z]{2,4})$)/i);},
 isValidInteger: function(value) {return !!value.toString().match(/(^-?\d+$)/);},
 isValidNumeric: function(value) {return !!value.toString().match(/(^-?\d\d*[\.|,]\d*$)|(^-?\d\d*$)|(^-?[\.|,]\d\d*$)/);},
 isValidAplhaNumeric: function(value) {return !!value.toString().match(/^[_\-a-z0-9]+$/gi);},
 
 isValidDatetime: function(value) {var dt = value.toString().match(/^(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})$/);return dt && !!(dt[1]<=9999 && dt[2]<=12 && dt[3]<=31 && dt[4]<=59 && dt[5]<=59 && dt[6]<=59) || false;},
 
 isValidDate: function(value) {var d = value.toString().match(/^(\d{4})-(\d{2})-(\d{2})$/);return d && !!(d[1]<=9999 && d[2]<=12 && d[3]<=31) || false;},
 
 isValidTime: function(value) {var t = value.toString().match(/^(\d{1,2}):(\d{1,2}):(\d{1,2})$/);return t && !!(t[1]<=24 && t[2]<=59 && t[3]<=59) || false;},
 
 isValidIPv4: function(value) {var ip = value.toString().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);return ip && !!(ip[1]<=255 && ip[2]<=255 && ip[3]<=255 && ip[4]<=255) || false;},
 isValidCurrency: function(value) {return value.toString().match(/^\$?\s?\d+?[\.,\,]?\d+?\s?\$?$/) && true || false;},
 
 isValidSSN: function(value) {return value.toString().match(/^\d{3}\-?\d{2}\-?\d{4}$/) && true || false;},
 
 isValidSIN: function(value) {return value.toString().match(/^\d{9}$/) && true || false;}
};dhtmlxValidation=new dhtmlxValidation();dhtmlXGridObject.prototype.enableValidation=function(mode,live){mode=convertStringToBoolean(mode);if (mode){this._validators={data:[] };}else
 this._validators=false;if (arguments.length>1)this._validators._live=live;if (!this._validators._event)this._validators._event=this.attachEvent("onEditCell",this.validationEvent);};dhtmlXGridObject.prototype.setColValidators=function(vals){if (!this._validators)this.enableValidation(true);if (typeof vals == "string")vals=vals.split(this.delim);this._validators.data=vals;};dhtmlXGridObject.prototype.validationEvent=function(stage,id,ind,newval,oldval){var v=this._validators;if (!v)return true;var rule=(v.data[ind]||this.cells(id,ind).getAttribute("validate"))||"";if (stage==1 && rule){var ed = this.editor||(this._fake||{}).editor;if (!ed)return true;ed.cell.className=ed.cell.className.replace(/[ ]*dhtmlx_validation_error/g,"");if (v._live){var grid=this;dhtmlxValidation.trackInput(ed.getInput(),rule,function(element,value,rule){return grid.callEvent("onLiveValidationError",[id,ind,value,element,rule]);},function(element,value,rule){return grid.callEvent("onLiveValidationCorrect",[id,ind,value,element,rule]);});}
 }
 if (stage==2)this.validateCell(id,ind,rule,newval);return true;};dhtmlXGridObject.prototype.validateCell=function(id,ind,rule,value){rule=rule||(this._validators.data[ind]||this.cells(id,ind).getAttribute("validate"));value=value||this.cells(id,ind).getValue();if (!rule)return;var cell = this.cells(id,ind).cell;var result = true;if (typeof rule == "string")rule = rule.split(this.delim);for (var i=0;i < rule.length;i++){if (!dhtmlxValidation.checkValue(value,rule[i])){if (this.callEvent("onValidationError",[id,ind,value,rule[i]]))
 cell.className+=" dhtmlx_validation_error";result = false;}
 }
 if (result){this.callEvent("onValidationCorrect",[id,ind,value,rule]);cell.className=cell.className.replace(/[ ]*dhtmlx_validation_error/g,"");}
 return result;};dhtmlXGridObject.prototype.startFastOperations = function(){this._disF=["setSizes","callEvent","_fixAlterCss","cells4","forEachRow"];this._disA=[];for (var i = this._disF.length - 1;i >= 0;i--){this._disA[i]=this[this._disF[i]];this[this._disF[i]]=function(){return true};};this._cellCache=[];this.cells4=function(cell){var c=this._cellCache[cell._cellIndex]
 if (!c){c=this._cellCache[cell._cellIndex]=this._disA[3].apply(this,[cell]);c.destructor=function(){return true;}
 c.setCValue=function(val){c.cell.innerHTML=val;}
 }
 
 c.cell=cell;c.combo=cell._combo||this.combos[cell._cellIndex];return c;}
 
 }
 
 dhtmlXGridObject.prototype.stopFastOperations = function(){if (!this._disF)return;for (var i = this._disF.length - 1;i >= 0;i--){this[this._disF[i]]=this._disA[i];};this.setSizes();this.callEvent("onGridReconstructed",[]);}
 
 



 
 dhtmlXGridObject.prototype.enableMarkedCells = function(fl){this.markedRowsArr = new dhtmlxArray(0);this.markedCellsArr = new Array(0);this.lastMarkedRow = null;this.lastMarkedColumn = null;this.markedCells = true;this.lastMarkMethod = 0;if(arguments.length>0){if(!convertStringToBoolean(fl))
 this.markedCells = false;}
 };dhtmlXGridObject.prototype.doMark = function(el,markMethod){var _rowId = el.parentNode.idd;this.setActive(true);if (!_rowId)return;this.editStop();this.cell=el;this.row=el.parentNode;var _cellIndex = el._cellIndex;if(!markMethod)markMethod = 0;if(markMethod==0){this.unmarkAll() ;}
 else if(markMethod==1){if(this.lastMarkedRow){var r_start = Math.min(this.getRowIndex(_rowId),this.getRowIndex(this.lastMarkedRow));var r_end = Math.max(this.getRowIndex(_rowId),this.getRowIndex(this.lastMarkedRow));var c_start = Math.min(_cellIndex,this.lastMarkedColumn);var c_end = Math.max(_cellIndex,this.lastMarkedColumn);for(var i = r_start;i < r_end+1;i++){for(var j = c_start;j < c_end+1;j++){this.mark(this.getRowId(i),j,true);}
 }
 }
 }
 else if(markMethod==2){if(this.markedRowsArr._dhx_find(_rowId)!=-1){for(var ci = 0;ci < this.markedCellsArr[_rowId].length;ci++){if(this.markedCellsArr[_rowId][ci]==_cellIndex){this.mark(_rowId,_cellIndex,false);return true;}
 }
 
 }
 
 }
 
 if(!this.markedCellsArr[_rowId])this.markedCellsArr[_rowId] = new dhtmlxArray(0);if(markMethod!=1)this.mark(_rowId,_cellIndex);this.moveToVisible(this.cells(_rowId,_cellIndex).cell);this.lastMarkedRow = _rowId;this.lastMarkedColumn = _cellIndex;this.lastMarkMethod = markMethod;}
dhtmlXGridObject.prototype.mark = function(rid,cindex,fl){if(arguments.length>2){if(!convertStringToBoolean(fl)){this.cells(rid,cindex).cell.className = this.cells(rid,cindex).cell.className.replace(/cellselected/g,"");if(this.markedRowsArr._dhx_find(rid)!=-1){var ci = this.markedCellsArr[rid]._dhx_find(cindex);if(ci!=-1){this.markedCellsArr[rid]._dhx_removeAt(ci);if(this.markedCellsArr[rid].length==0){this.markedRowsArr._dhx_removeAt(this.markedRowsArr._dhx_find(rid));}
 this.callEvent("onCellUnMarked",[rid,cindex]);}
 }
 return true;}
 }
 this.cells(rid,cindex).cell.className+= " cellselected";if(this.markedRowsArr._dhx_find(rid)==-1) 
 this.markedRowsArr[this.markedRowsArr.length] = rid;if(!this.markedCellsArr[rid])this.markedCellsArr[rid] = new dhtmlxArray(0);if(this.markedCellsArr[rid]._dhx_find(cindex)==-1){this.markedCellsArr[rid][this.markedCellsArr[rid].length] = cindex;this.callEvent("onCellMarked",[rid,cindex]);}
 
}
dhtmlXGridObject.prototype.unmarkAll = function(){if(this.markedRowsArr){for(var ri = 0;ri < this.markedRowsArr.length;ri++){var rid = this.markedRowsArr[ri];if (this.rowsAr[rid])for(var ci = 0;ci < this.markedCellsArr[rid].length;ci++){this.callEvent("onCellUnMarked",[rid,this.markedCellsArr[rid][ci]])
 this.cells(rid,this.markedCellsArr[rid][ci]).cell.className = this.cells(rid,this.markedCellsArr[rid][ci]).cell.className.replace(/cellselected/g,"");}
 }
 this.markedRowsArr = new dhtmlxArray(0);this.markedCellsArr = new Array(0);}
 return true;}
dhtmlXGridObject.prototype.getMarked = function(){var marked = new Array();if(this.markedRowsArr)for(var ri = 0;ri < this.markedRowsArr.length;ri++){var rid = this.markedRowsArr[ri];for(var ci = 0;ci < this.markedCellsArr[rid].length;ci++){marked[marked.length] = [rid,this.markedCellsArr[rid][ci]];}
 }
 return marked;}
function eXcell_dhxCalendar(cell){if (cell){this.cell = cell;this.grid = this.cell.parentNode.grid;if (!this.grid._grid_calendarA){var cal=this.grid._grid_calendarA=new dhtmlxCalendarObject();this.grid.callEvent("onDhxCalendarCreated",[cal]);var sgrid=this.grid;cal.attachEvent("onClick",function(){this._last_operation_calendar=true;window.setTimeout(function(){sgrid.editStop()},1);return true;});var zFunc=function(e){(e||event).cancelBubble=true;}
 dhtmlxEvent(cal.base,"click",zFunc);cal=null;}
 }
}
eXcell_dhxCalendar.prototype = new eXcell;eXcell_dhxCalendar.prototype.edit = function(){var arPos = this.grid.getPosition(this.cell);this.grid._grid_calendarA._show(false, false);this.grid._grid_calendarA.setPosition(arPos[0],arPos[1]+this.cell.offsetHeight);this.grid._grid_calendarA._last_operation_calendar=false;this.grid.callEvent("onCalendarShow",[this.grid._grid_calendarA,this.cell.parentNode.idd,this.cell._cellIndex]);this.cell._cediton=true;this.val=this.cell.val;this._val=this.cell.innerHTML;var t=this.grid._grid_calendarA.draw;this.grid._grid_calendarA.draw=function(){};this.grid._grid_calendarA.setDateFormat((this.grid._dtmask||"%d/%m/%Y"));this.grid._grid_calendarA.setDate(this.val||(new Date()));this.grid._grid_calendarA.draw=t;}
 eXcell_dhxCalendar.prototype.getDate = function(){if (this.cell.val)return this.cell.val;return null;}
 
 eXcell_dhxCalendar.prototype.getValue = function(){if (this.cell._clearCell)return "";if (this.grid._dtmask_inc && this.cell.val)return this.grid._grid_calendarA.getFormatedDate(this.grid._dtmask_inc, this.cell.val).toString();return this.cell.innerHTML.toString()._dhx_trim()
 }
 eXcell_dhxCalendar.prototype.detach = function(){if (!this.grid._grid_calendarA)return;this.grid._grid_calendarA.hide();if (this.cell._cediton)this.cell._cediton=false;else return;if (this.grid._grid_calendarA._last_operation_calendar){var z1=this.grid._grid_calendarA.getFormatedDate((this.grid._dtmask||"%d/%m/%Y"));var z2=this.grid._grid_calendarA.getDate();this.cell.val=new Date(z2);this.setCValue(z1,z2);this.cell._clearCell=!z1;var t=this.val;this.val=this._val;return (this.cell.val.valueOf()!=t);}
 return false;}
 
 eXcell_dhxCalendar.prototype.setValue = function(val){if (val && typeof val == "object"){this.cell.val=val;this.cell._clearCell=false;this.setCValue(this.grid._grid_calendarA.getFormatedDate((this.grid._dtmask||"%d/%m/%Y"),val).toString(),this.cell.val);return;}
 
 
 if(!val || val.toString()._dhx_trim()==""){val="&nbsp";this.cell._clearCell=true;this.cell.val="";}
 else{this.cell._clearCell=false;this.cell.val=new Date(this.grid._grid_calendarA.setFormatedDate((this.grid._dtmask_inc||this.grid._dtmask||"%d/%m/%Y"),val.toString(),null,true));if (this.grid._dtmask_inc)val = this.grid._grid_calendarA.getFormatedDate((this.grid._dtmask||"%d/%m/%Y"),this.cell.val);}
 if ((this.cell.val=="NaN")||(this.cell.val=="Invalid Date")){this.cell._clearCell=true;this.cell.val=new Date();this.setCValue("&nbsp;",0);}
 else
 this.setCValue((val||"").toString(),this.cell.val);}
function eXcell_dhxCalendarA(cell){if (cell){this.cell = cell;this.grid = this.cell.parentNode.grid;if (!this.grid._grid_calendarA){var cal = this.grid._grid_calendarA = new dhtmlxCalendarObject();this.grid.callEvent("onDhxCalendarCreated",[cal]);var sgrid=this.grid;cal.attachEvent("onClick",function(){this._last_operation_calendar=true;window.setTimeout(function(){sgrid.editStop()},1);return true;});var zFunc=function(e){(e||event).cancelBubble=true;}
 dhtmlxEvent(cal.base,"click",zFunc);}
 }
}
eXcell_dhxCalendarA.prototype = new eXcell;eXcell_dhxCalendarA.prototype.edit = function(){var arPos = this.grid.getPosition(this.cell);this.grid._grid_calendarA._show(false, false);this.grid._grid_calendarA.setPosition(arPos[0]*1+this.cell.offsetWidth,arPos[1]*1);this.grid.callEvent("onCalendarShow",[this.grid._grid_calendarA,this.cell.parentNode.idd,this.cell._cellIndex]);this.grid._grid_calendarA._last_operation_calendar=false;this.cell._cediton=true;this.val=this.cell.val;this._val=this.cell.innerHTML;var t=this.grid._grid_calendarA.draw;this.grid._grid_calendarA.draw=function(){};this.grid._grid_calendarA.setDateFormat((this.grid._dtmask||"%d/%m/%Y"));this.grid._grid_calendarA.setDate(this.val);this.grid._grid_calendarA.draw=t;this.grid._grid_calendarA.draw();this.cell.atag=((!this.grid.multiLine)&&(_isKHTML||_isMacOS||_isFF))?"INPUT":"TEXTAREA";this.obj = document.createElement(this.cell.atag);this.obj.style.height = (this.cell.offsetHeight-(_isIE?4:2))+"px";this.obj.className="dhx_combo_edit";this.obj.wrap = "soft";this.obj.style.textAlign = this.cell.align;this.obj.onclick = function(e){(e||event).cancelBubble = true}
 this.obj.onmousedown = function(e){(e||event).cancelBubble = true}
 this.obj.value = this.getValue();this.cell.innerHTML = "";this.cell.appendChild(this.obj);if (_isFF){this.obj.style.overflow="visible";if ((this.grid.multiLine)&&(this.obj.offsetHeight>=18)&&(this.obj.offsetHeight<40)){this.obj.style.height="36px";this.obj.style.overflow="scroll";}
 }
 this.obj.onselectstart=function(e){if (!e)e=event;e.cancelBubble=true;return true;};this.obj.focus()
 this.obj.focus()
 
 }
 
 eXcell_dhxCalendarA.prototype.getDate = function(){if (this.cell.val)return this.cell.val;return null;}
 
 eXcell_dhxCalendarA.prototype.getValue = function(){if (this.cell._clearCell)return "";if (this.grid._dtmask_inc && this.cell.val)return this.grid._grid_calendarA.getFormatedDate(this.grid._dtmask_inc, this.cell.val).toString();return this.cell.innerHTML.toString()._dhx_trim()
 }
 eXcell_dhxCalendarA.prototype.detach = function(){if (!this.grid._grid_calendarA)return;this.grid._grid_calendarA.hide();if (this.cell._cediton)this.cell._cediton=false;else return;if (this.grid._grid_calendarA._last_operation_calendar){this.grid._grid_calendarA._last_operation_calendar=false;var z1=this.grid._grid_calendarA.getFormatedDate(this.grid._dtmask||"%d/%m/%Y");var z2=this.grid._grid_calendarA.getDate();this.cell.val=new Date(z2);this.setCValue(z1,z2);this.cell._clearCell = !z1;var t=this.val;this.val=this._val;return (this.cell.val.valueOf()!=(t|"").valueOf());}
 this.setValue(this.obj.value);var t=this.val;this.val=this._val;return (this.cell.val.valueOf()!=(t||"").valueOf());}
eXcell_dhxCalendarA.prototype.setValue = function(val){if (val && typeof val == "object"){this.cell.val=val;this.cell._clearCell=false;this.setCValue(this.grid._grid_calendarA.getFormatedDate((this.grid._dtmask||"%d/%m/%Y"),val).toString(),this.cell.val);return;}
 
 if(!val || val.toString()._dhx_trim()==""){val="&nbsp";this.cell._clearCell=true;this.cell.val="";}
 else{this.cell._clearCell=false;this.cell.val=new Date(this.grid._grid_calendarA.setFormatedDate((this.grid._dtmask_inc||this.grid._dtmask||"%d/%m/%Y"),val.toString(),null,true));if (this.grid._dtmask_inc)val = this.grid._grid_calendarA.getFormatedDate((this.grid._dtmask||"%d/%m/%Y"),this.cell.val);}
 
 if ((this.cell.val=="NaN")||(this.cell.val=="Invalid Date")){this.cell.val=new Date();this.cell._clearCell=true;this.setCValue("&nbsp;",0);}
 else
 this.setCValue((val||"").toString(),this.cell.val);}
dhtmlXGridObject.prototype._init_point_bcg=dhtmlXGridObject.prototype._init_point;dhtmlXGridObject.prototype._init_point = function(){if(!window.dhx_globalImgPath)window.dhx_globalImgPath = this.imgURL;this._col_combos=[];for (var i=0;i<this._cCount;i++){if(this.cellType[i].indexOf("combo")==0)
 this._col_combos[i] = eXcell_combo.prototype.initCombo.call({grid:this},i);}
 if(!this._loading_handler_set){this._loading_handler_set = this.attachEvent("onXLE",function(a,b,c,xml){eXcell_combo.prototype.fillColumnCombos(this,xml);this.detachEvent(this._loading_handler_set);this._loading_handler_set = null;})
 }
 
 
 if (this._init_point_bcg)this._init_point_bcg();};function eXcell_combo(cell){if(!cell)return;this.cell = cell;this.grid = cell.parentNode.grid;this._combo_pre = "";this.edit = function(){if(!window.dhx_globalImgPath)window.dhx_globalImgPath = this.grid.imgURL;this.val=this.getValue();var val = this.getText();if(this.cell._clearCell)val="";this.cell.innerHTML = "";if(!this.cell._brval)this.combo = (this.grid._realfake?this.grid._fake:this.grid)._col_combos[this.cell._cellIndex];else
 this.combo = this.cell._brval;this.cell.appendChild(this.combo.DOMParent);this.combo.DOMParent.style.margin="0";this.combo.DOMelem_input.focus();this.combo.setSize(this.cell.offsetWidth-2);if(!this.combo._xml){if(this.combo.getIndexByValue(this.cell.combo_value)!=-1)
 this.combo.selectOption(this.combo.getIndexByValue(this.cell.combo_value));else {if(this.combo.getOptionByLabel(val))
 this.combo.selectOption(this.combo.getIndexByValue(this.combo.getOptionByLabel(val).value));else this.combo.setComboText(val);}
 }
 else this.combo.setComboText(val);this.combo.openSelect();}
 
 this.selectComboOption = function(val,obj){obj.selectOption(obj.getIndexByValue(obj.getOptionByLabel(val).value));}
 
 
 
 this.getValue = function(val){return this.cell.combo_value||"";}
 this.getText = function(val){var c = this.cell;if(this._combo_pre == ""&&c.childNodes[1])c = c.childNodes[1];else
 c.childNodes[0].childNodes[1];return (_isIE ? c.innerText : c.textContent);}
 
 this.setValue = function(val){if(typeof(val)=="object"){this.cell._brval = this.initCombo();var index = this.cell._cellIndex;var idd = this.cell.parentNode.idd;if(!val.firstChild){this.cell.combo_value = "&nbsp;";this.cell._clearCell=true;}
 else this.cell.combo_value = val.firstChild.data;this.setComboOptions(this.cell._brval,val,this.grid,index,idd);}else{this.cell.combo_value = val;var cm=null;if ((cm = this.cell._brval)&& (typeof(this.cell._brval)=="object"))
 val=(cm.getOption(val)||{}).text||val;else if (cm = this.grid._col_combos[this.cell._cellIndex]||((this.grid._fake)&&(cm = this.grid._fake._col_combos[this.cell._cellIndex]))){val=(cm.getOption(val)||{}).text||val;}
 
 
 if ((val||"").toString()._dhx_trim()=="")
 val = null;if (val!==null)this.setComboCValue(val);else{this.setComboCValue("&nbsp;","");this.cell._clearCell=true;}
 }
 }
 
 
 this.detach = function(){this.cell.removeChild(this.combo.DOMParent);var val = this.cell.combo_value;if (!this.combo.getComboText()|| this.combo.getComboText().toString()._dhx_trim()==""){this.setComboCValue("&nbsp;");this.cell._clearCell=true;}
 else{this.setComboCValue(this.combo.getComboText().replace(/\&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),this.combo.getActualValue());this.cell._clearCell = false;}
 this.combo._confirmSelection();this.cell.combo_value = this.combo.getActualValue();this.combo.closeAll();this.grid._still_active=true;this.grid.setActive(1);return val!=this.cell.combo_value;}
}
 
eXcell_combo.prototype = new eXcell;eXcell_combo_v=function(cell){var combo = new eXcell_combo(cell);cell.style.paddingLeft = "0px";cell.style.paddingRight = "0px";combo._combo_pre = "<img src='"+(window.dhx_globalImgPath?window.dhx_globalImgPath:this.grid.imgURL)+"combo_select"+(dhtmlx.skin?"_"+dhtmlx.skin:"")+".gif' style='position:absolute;z-index:1;top:0px;right:0px;'/>";return combo;}
 
eXcell_combo.prototype.initCombo = function(index){var container = document.createElement("DIV");var type = this.grid.defVal[arguments.length?index:this.cell._cellIndex];var combo = new dhtmlXCombo(container,"combo",0,type);this.grid.defVal[arguments.length?index:this.cell._cellIndex] = "";combo.DOMelem.className+=" fake_editable";var grid = this.grid;combo.DOMelem.onselectstart=function(){event.cancelBubble=true;return true;};combo.attachEvent("onKeyPressed",function(ev){if(ev==13||ev==27){grid.editStop();if(grid._fake)grid._fake.editStop()}})
 dhtmlxEvent(combo.DOMlist,"click",function(){grid.editStop();if(grid._fake)grid._fake.editStop()});combo.DOMelem.style.border = "0px";combo.DOMelem.style.height = "18px";return combo;}
 
eXcell_combo.prototype.fillColumnCombos = function(grid,xml){if (!xml)return;grid.combo_columns = grid.combo_columns||[];columns = grid.xmlLoader.doXPath("//column",xml);for(var i = 0;i < columns.length;i++){if((columns[i].getAttribute("type")||"").indexOf("combo")==0){grid.combo_columns[grid.combo_columns.length] = i;this.setComboOptions(grid._col_combos[i],columns[i],grid,i);}
 }
 
}
eXcell_combo.prototype.setComboCValue = function(value,value2){if(this._combo_pre!="")value = "<div style='width:100%;position:relative;height:100%;overflow:hidden;line-height:20px'>"+this._combo_pre+"<span>"+value+"</span></div>";if(arguments.length>1)this.setCValue(value,value2);else
 this.setCValue(value);}
 

 
eXcell_combo.prototype.setComboOptions = function(combo,obj,grid,index,idd){if(convertStringToBoolean(obj.getAttribute("xmlcontent"))){if(!obj.getAttribute("source")){options = obj.childNodes;var _optArr = [];for (var i=0;i < options.length;i++){if(options[i].tagName =="option"){var text_opt = options[i].firstChild? options[i].firstChild.data:"";_optArr[_optArr.length]= [options[i].getAttribute("value"),text_opt];}
 }
 combo.addOption(_optArr)
 if(arguments.length == 4){grid.forEachRow(function(id){var c = grid.cells(id,index);if(!c.cell._brval&&!c.cell._cellType&&(c.cell._cellIndex==index)){if(c.cell.combo_value=="")c.setComboCValue("&nbsp;","");else{if(!combo.getOption(c.cell.combo_value))
 c.setComboCValue(c.cell.combo_value);else c.setComboCValue(combo.getOption(c.cell.combo_value).text);}
 }
 });}
 else {var c = (this.cell)?this:grid.cells(idd,index);if(obj.getAttribute("text")) {if(obj.getAttribute("text")._dhx_trim()=="") c.setComboCValue("&nbsp;","");else c.setComboCValue(obj.getAttribute("text"));}
 else{if((!c.cell.combo_value)||(c.cell.combo_value._dhx_trim()=="")) c.setComboCValue("&nbsp;","");else{if(!combo.getOption(c.cell.combo_value))
 c.setComboCValue(c.cell.combo_value);else c.setComboCValue(combo.getOption(c.cell.combo_value).text);}
 }
 }
 
 }
 }
 if(obj.getAttribute("source")){if(obj.getAttribute("auto")&&convertStringToBoolean(obj.getAttribute("auto"))){if(obj.getAttribute("xmlcontent")){var c = (this.cell)?this:grid.cells(idd,index);if(obj.getAttribute("text")) c.setComboCValue(obj.getAttribute("text"));}
 else{grid.forEachRow(function(id){var c = grid.cells(id,index);if(!c.cell._brval&&!c.cell._cellType){var str = c.cell.combo_value.toString();if(str.indexOf("^")!=-1){var arr = str.split("^");c.cell.combo_value = arr[0];c.setComboCValue(arr[1]);}
 }
 });}
 combo.enableFilteringMode(true,obj.getAttribute("source"),convertStringToBoolean(obj.getAttribute("cache")||true),convertStringToBoolean(obj.getAttribute("sub")||false));}
 else {var that = this;var length = arguments.length;combo.loadXML(obj.getAttribute("source"),function(){if(length == 4){grid.forEachRow(function(id){var c = grid.cells(id,index);if(!c.cell._brval&&!c.cell._cellType){if(combo.getOption(c.cell.combo_value))
 c.setComboCValue(combo.getOption(c.cell.combo_value).text);else{if ((c.cell.combo_value||"").toString()._dhx_trim()==""){c.setComboCValue("&nbsp;","");c.cell._clearCell=true;}
 else
 c.setComboCValue(c.cell.combo_value);}
 }
 });}
 else {var c = grid.cells(idd,index);if(combo.getOption(c.cell.combo_value))
 
 c.setComboCValue(combo.getOption(c.cell.combo_value).text);else
 c.setComboCValue(c.cell.combo_value);}
 });}
 }
 if(!obj.getAttribute("auto")||!convertStringToBoolean(obj.getAttribute("auto"))){if(obj.getAttribute("editable")&&!convertStringToBoolean(obj.getAttribute("editable"))) combo.readonly(true);if(obj.getAttribute("filter")&&convertStringToBoolean(obj.getAttribute("filter"))) combo.enableFilteringMode(true);}
}
 
eXcell_combo.prototype.getCellCombo = function(){if(this.cell._brval)return this.cell._brval;else {this.cell._brval = this.initCombo();return this.cell._brval;}
};eXcell_combo.prototype.refreshCell = function(){this.setValue(this.getValue());};dhtmlXGridObject.prototype.getColumnCombo = function(index){if(this._col_combos&&this._col_combos[index])return this._col_combos[index];else{if(!this._col_combos)this._col_combos=[];this._col_combos[index] = eXcell_combo.prototype.initCombo.call({grid:this},index);return this._col_combos[index];}
}
dhtmlXGridObject.prototype.refreshComboColumn = function(index){this.forEachRow(function(id){if(this.cells(id,index).refreshCell)
 this.cells(id,index).refreshCell();});};function eXcell_cntr(cell){this.cell = cell;this.grid = this.cell.parentNode.grid;if (!this.grid._ex_cntr_ready && !this._realfake){this.grid._ex_cntr_ready=true;if (this.grid._h2)this.grid.attachEvent("onOpenEn",function(id){this.resetCounter(cell._cellIndex);});this.grid.attachEvent("onBeforeSorting",function(){var that=this;window.setTimeout(function(){if (!that.resetCounter)return;if (that._fake && !that._realfake && cell._cellIndex<that._fake._cCount)that._fake.resetCounter(cell._cellIndex);else
 that.resetCounter(cell._cellIndex);},1)
 return true;});}
 
 

 this.edit = function(){}
 this.getValue = function(){return this.cell.innerHTML;}
 this.setValue = function(val){this.cell.style.paddingRight = "2px";var cell=this.cell;window.setTimeout(function(){if (!cell.parentNode)return;var val=cell.parentNode.rowIndex;if (cell.parentNode.grid.currentPage || val<0 || cell.parentNode.grid._srnd)val=cell.parentNode.grid.rowsBuffer._dhx_find(cell.parentNode)+1;if (val<=0)return;cell.innerHTML = val;if (cell.parentNode.grid._fake && cell._cellIndex<cell.parentNode.grid._fake._cCount && cell.parentNode.grid._fake.rowsAr[cell.parentNode.idd])cell.parentNode.grid._fake.cells(cell.parentNode.idd,cell._cellIndex).setCValue(val);cell=null;},100);}
}
dhtmlXGridObject.prototype.resetCounter=function(ind){if (this._fake && !this._realfake && ind < this._fake._cCount)this._fake.resetCounter(ind,this.currentPage);var i=arguments[0]||0;if (this.currentPage)i=(this.currentPage-1)*this.rowsBufferOutSize;for (i=0;i<this.rowsBuffer.length;i++)if (this.rowsBuffer[i] && this.rowsBuffer[i].tagName == "TR" && this.rowsAr[this.rowsBuffer[i].idd])this.rowsAr[this.rowsBuffer[i].idd].childNodes[ind].innerHTML=i+1;}
eXcell_cntr.prototype = new eXcell;function eXcell_link(cell){this.cell = cell;this.grid = this.cell.parentNode.grid;this.isDisabled=function(){return true;}
 this.edit = function(){}
 this.getValue = function(){if(this.cell.firstChild.getAttribute){var target = this.cell.firstChild.getAttribute("target")
 return this.cell.firstChild.innerHTML+"^"+this.cell.firstChild.getAttribute("href")+(target?("^"+target):"");}
 else
 return "";}
 this.setValue = function(val){if((typeof(val)!="number") && (!val || val.toString()._dhx_trim()=="")){this.setCValue("&nbsp;",valsAr);return (this.cell._clearCell=true);}
 var valsAr = val.split("^");if(valsAr.length==1)valsAr[1] = "";else{if(valsAr.length>1){valsAr[1] = "href='"+valsAr[1]+"'";if(valsAr.length==3)valsAr[1]+= " target='"+valsAr[2]+"'";else
 valsAr[1]+= " target='_blank'";}
 }
 this.setCValue("<a "+valsAr[1]+" onclick='(_isIE?event:arguments[0]).cancelBubble = true;'>"+valsAr[0]+"</a>",valsAr);}
}
eXcell_link.prototype = new eXcell;eXcell_link.prototype.getTitle=function(){var z=this.cell.firstChild;return ((z&&z.tagName)?z.getAttribute("href"):"");}
eXcell_link.prototype.getContent=function(){var z=this.cell.firstChild;return ((z&&z.tagName)?z.innerHTML:"");}
function eXcell_clist(cell){try{this.cell = cell;this.grid = this.cell.parentNode.grid;}catch(er){}
 this.edit = function(){this.val = this.getValue();var a=(this.cell._combo||this.grid.clists[this.cell._cellIndex]);if (!a)return;this.obj = document.createElement("DIV");var b=this.val.split(",");var text="";for (var i=0;i<a.length;i++){var fl=false;for (var j=0;j<b.length;j++)if (a[i]==b[j])fl=true;if (fl)text+="<div><input type='checkbox' id='dhx_clist_"+i+"' checked='true' /><label for='dhx_clist_"+i+"'>"+a[i]+"</label></div>";else
 text+="<div><input type='checkbox' id='dhx_clist_"+i+"'/><label for='dhx_clist_"+i+"'>"+a[i]+"</label></div>";}
 text+="<div><input type='button' value='"+(mygrid.applyButtonText||"Apply")+"' style='width:100px;font-size:8pt;' onclick='this.parentNode.parentNode.editor.grid.editStop();'/></div>"

 this.obj.editor=this;this.obj.innerHTML=text;document.body.appendChild(this.obj);this.obj.style.position="absolute";this.obj.className="dhx_clist";this.obj.onclick=function(e){(e||event).cancelBubble=true;return true;};var arPos = this.grid.getPosition(this.cell);this.obj.style.left=arPos[0]+"px";this.obj.style.top=arPos[1]+this.cell.offsetHeight+"px";this.obj.getValue=function(){var text="";for (var i=0;i<this.childNodes.length-1;i++)if (this.childNodes[i].childNodes[0].checked){if (text)text+=",";text+=this.childNodes[i].childNodes[1].innerHTML;}
 return text.replace(/&amp;/g,"&");}
 }
 this.getValue = function(){if (this.cell._clearCell)return "";return this.cell.innerHTML.toString()._dhx_trim().replace(/&amp;/g,"&");}
 this.detach = function(val){if (this.obj){this.setValue(this.obj.getValue());this.obj.editor=null;this.obj.parentNode.removeChild(this.obj);this.obj=null;}
 return this.val!=this.getValue();}
}
eXcell_clist.prototype = new eXcell;eXcell_clist.prototype.setValue = function(val){if (typeof(val)=="object"){var optCol=this.grid.xmlLoader.doXPath("./option",val);if (optCol.length)this.cell._combo=[];for (var j=0;j<optCol.length;j++)this.cell._combo.push(optCol[j].firstChild?optCol[j].firstChild.data:"");val=val.firstChild.data;}
 if (val==="" || val === this.undefined){this.setCTxtValue(" ",val);this.cell._clearCell=true;}
 else{this.setCTxtValue(val);this.cell._clearCell=false;}
 }
dhtmlXGridObject.prototype.registerCList=function(col,list){if (!this.clists)this.clists=new Array();if (typeof(list)!="object") list=list.split(",");this.clists[col]=list;}
function eXcell_ra_str(cell){if (cell){this.base = eXcell_ra;this.base(cell)
 this.grid = cell.parentNode.grid;}
}
eXcell_ra_str.prototype = new eXcell_ch;eXcell_ra_str.prototype.setValue = function(val){this.cell.style.verticalAlign = "middle";if (val){val=val.toString()._dhx_trim();if ((val=="false")||(val=="0")) val="";}
 if(val){if (this.grid.rowsAr[this.cell.parentNode.idd])for (var i=0;i<this.grid._cCount;i++){if (i!==this.cell._cellIndex){var cell = this.grid.cells(this.cell.parentNode.idd,i);if ((cell.cell._cellType||this.grid.cellType[cell.cell._cellIndex])!="ra_str") continue;if (cell.getValue())
 cell.setValue("0");}
 }
 val = "1";this.cell.chstate = "1";}else{val = "0";this.cell.chstate = "0"
 }
 this.setCValue("<img src='"+this.grid.imgURL+"radio_chk"+val+".gif' onclick='new eXcell_ra_str(this.parentNode).changeState()'>",this.cell.chstate);}
function dhtmlXCalendarObject(inps, skin) {this.i = {};this.uid = function() {if (!this.uidd)this.uidd = new Date().getTime();return this.uidd++;}
 
 var p = null;if (typeof(inps)== "string") {var t0 = document.getElementById(inps);}else {var t0 = inps;}
 if (t0 && typeof(t0)== "object" && t0.tagName && String(t0.tagName).toLowerCase() != "input") p = t0;t0 = null;if (typeof(inps)!= "object" || !inps.length) inps = [inps];for (var q=0;q<inps.length;q++){if (typeof(inps[q])== "string") inps[q] = (document.getElementById(inps[q])||null);if (inps[q] != null && inps[q].tagName && String(inps[q].tagName).toLowerCase() == "input") {this.i[this.uid()] = {input: inps[q]};}else {if (!(inps[q] instanceof Array)&& inps[q] instanceof Object && (inps[q].input != null || inps[q].button != null)) {if (inps[q].input != null && typeof(inps[q].input)== "string") inps[q].input = document.getElementById(inps[q].input);if (inps[q].button != null && typeof(inps[q].button)== "string") inps[q].button = document.getElementById(inps[q].button);this.i[this.uid()] = inps[q];}
 }
 inps[q] = null;}
 
 this.skin = (skin != null ? skin : (typeof(dhtmlx) != "undefined" && typeof(dhtmlx.skin) == "string" ? dhtmlx.skin : "dhx_skyblue"));this.setSkin = function(skin, force) {if (this.skin == skin && !force)return;this.skin = skin;this.base.className = "dhtmlxcalendar_container dhtmlxcalendar_skin_"+this.skin+(String(this.base.className).search("dhtmlxcalendar_time_hidden")>0?" dhtmlxcalendar_time_hidden":"");this._ifrSize();}
 
 
 this.base = document.createElement("DIV");this.base.className = "dhtmlxcalendar_container";this.base.style.display = "none";if (p != null){this._hasParent = true;p.appendChild(this.base);p = null;}else {document.body.appendChild(this.base);}
 
 this.setParent = function(p) {if (this._hasParent){if (typeof(p)== "object") {p.appendChild(this.base);}else if (typeof(p)== "string") {document.getElementById(p).appendChild(this.base);}
 }
 }
 
 this.setSkin(this.skin, true);this.base.onclick = function(e) {e = e||event;e.cancelBubble = true;}
 this.base.onmousedown = function() {return false;}
 
 this.loadUserLanguage = function(lang) {if (!this.langData[lang])return;this.lang = lang;this.setWeekStartDay(this.langData[this.lang].weekstart);this.setDateFormat(this.langData[this.lang].dateformat||"%Y-%m-%d");if (this.msCont){var e = 0;for (var q=0;q<this.msCont.childNodes.length;q++){for (var w=0;w<this.msCont.childNodes[q].childNodes.length;w++){this.msCont.childNodes[q].childNodes[w].innerHTML = this.langData[this.lang].monthesSNames[e++];}
 }
 }
 }
 
 
 this.contMonth = document.createElement("DIV");this.contMonth.className = "dhtmlxcalendar_month_cont";this.contMonth.onselectstart = function(e){e=e||event;e.cancelBubble=true;e.returnValue=false;return false;}
 this.base.appendChild(this.contMonth);var ul = document.createElement("UL");ul.className = "dhtmlxcalendar_line";this.contMonth.appendChild(ul);var li = document.createElement("LI");li.className = "dhtmlxcalendar_cell dhtmlxcalendar_month_hdr";li.innerHTML = "<div class='dhtmlxcalendar_month_arrow dhtmlxcalendar_month_arrow_left' onmouseover='this.className=\"dhtmlxcalendar_month_arrow dhtmlxcalendar_month_arrow_left_hover\";' onmouseout='this.className=\"dhtmlxcalendar_month_arrow dhtmlxcalendar_month_arrow_left\";'></div>"+
 "<span class='dhtmlxcalendar_month_label_month'>Month</span><span class='dhtmlxcalendar_month_label_year'>Year</span>"+
 "<div class='dhtmlxcalendar_month_arrow dhtmlxcalendar_month_arrow_right' onmouseover='this.className=\"dhtmlxcalendar_month_arrow dhtmlxcalendar_month_arrow_right_hover\";' onmouseout='this.className=\"dhtmlxcalendar_month_arrow dhtmlxcalendar_month_arrow_right\";'></div>";ul.appendChild(li);var that = this;li.onclick = function(e) {e = e||event;var t = (e.target||e.srcElement);if (t.className && t.className.indexOf("dhtmlxcalendar_month_arrow")=== 0) {that._hideSelector();var ind = (t.parentNode.firstChild==t?-1:1);var k0 = new Date(that._activeMonth);that._drawMonth(new Date(that._activeMonth.getFullYear(), that._activeMonth.getMonth()+ind, 1, 0, 0, 0, 0));that.callEvent("onArrowClick", [k0, new Date(that._activeMonth)]);return;}
 
 if (t.className && t.className == "dhtmlxcalendar_month_label_month"){e.cancelBubble = true;that._showSelector("month",31,21,"selector_month",true);return;}
 
 if (t.className && t.className == "dhtmlxcalendar_month_label_year"){e.cancelBubble = true;that._showSelector("year",42,21,"selector_year",true);return;}
 
 that._hideSelector();}
 
 
 this.contDays = document.createElement("DIV");this.contDays.className = "dhtmlxcalendar_days_cont";this.base.appendChild(this.contDays);this.setWeekStartDay = function(ind) {if (ind == 0)ind = 7;this._wStart = Math.min(Math.max((isNaN(ind)?1:ind),1),7);this._drawDaysOfWeek();}
 
 this._drawDaysOfWeek = function() {if (this.contDays.childNodes.length == 0){var ul = document.createElement("UL");ul.className = "dhtmlxcalendar_line";this.contDays.appendChild(ul);}else {var ul = this.contDays.firstChild;}
 
 var w = this._wStart;var k = this.langData[this.lang].daysSNames;k.push(String(this.langData[this.lang].daysSNames[0]).valueOf());for (var q=0;q<7;q++){if (ul.childNodes[q] == null){var li = document.createElement("LI");ul.appendChild(li);}else {var li = ul.childNodes[q];}
 li.className = "dhtmlxcalendar_cell"+(w>=6?" dhtmlxcalendar_day_weekday_cell":"")+(q==0?"_first":"");li.innerHTML = k[w];if (++w > 7)w = 1;}
 if (this._activeMonth != null)this._drawMonth(this._activeMonth);}
 
 this._wStart = this.langData[this.lang].weekstart;this.setWeekStartDay(this._wStart);this.contDates = document.createElement("DIV");this.contDates.className = "dhtmlxcalendar_dates_cont";this.base.appendChild(this.contDates);this.contDates.onclick = function(e){e = e||event;var t = (e.target||e.srcElement);if (t._date != null && !t._css_dis){var t1 = that._activeDate.getHours();var t2 = that._activeDate.getMinutes();var d0 = t._date;if (that.checkEvent("onBeforeChange")) {if (!that.callEvent("onBeforeChange",[new Date(t._date.getFullYear(),t._date.getMonth(),t._date.getDate(),t1,t2)])) return;}
 
 if (that._activeDateCell != null){that._activeDateCell._css_date = false;that._updateCellStyle(that._activeDateCell._q, that._activeDateCell._w);}
 
 
 var refreshView = ( that._activeDate.getFullYear()+"_"+that._activeDate.getMonth() != d0.getFullYear()+"_"+d0.getMonth());that._nullDate = false;that._activeDate = new Date(d0.getFullYear(),d0.getMonth(),d0.getDate(),t1,t2);that._activeDateCell = t;that._activeDateCell._css_date = true;that._activeDateCell._css_hover = false;that._lastHover = null;that._updateCellStyle(that._activeDateCell._q, that._activeDateCell._w);if (refreshView)that._drawMonth(that._activeDate);if (that._activeInp && that.i[that._activeInp] && that.i[that._activeInp].input != null){that.i[that._activeInp].input.value = that._dateToStr(new Date(that._activeDate.getTime()));}
 
 if (!that._hasParent)that._hide();that.callEvent("onClick",[new Date(that._activeDate.getTime())]);}
 }
 
 this.contDates.onmouseover = function(e) {e = e||event;var t = (e.target||e.srcElement);if (t._date != null){t._css_hover = true;that._updateCellStyle(t._q, t._w);that._lastHover = t;}
 }
 this.contDates.onmouseout = function() {that._clearDayHover();}
 
 this._lastHover = null;this._clearDayHover = function() {if (!this._lastHover)return;this._lastHover._css_hover = false;this._updateCellStyle(this._lastHover._q, this._lastHover._w);this._lastHover = null;}
 
 
 for (var q=0;q<6;q++){var ul = document.createElement("UL");ul.className = "dhtmlxcalendar_line";this.contDates.appendChild(ul);for (var w=0;w<7;w++){var li = document.createElement("LI");li.className = "dhtmlxcalendar_cell";ul.appendChild(li);}
 }
 
 
 
 
 this.contTime = document.createElement("DIV");this.contTime.className = "dhtmlxcalendar_time_cont";this.base.appendChild(this.contTime);this.showTime = function() {if (String(this.base.className).search("dhtmlxcalendar_time_hidden") > 0) this.base.className = String(this.base.className).replace(/dhtmlxcalendar_time_hidden/gi,"");this._ifrSize();}
 
 this.hideTime = function() {if (String(this.base.className).search("dhtmlxcalendar_time_hidden") < 0) this.base.className += " dhtmlxcalendar_time_hidden";this._ifrSize();}
 
 var ul = document.createElement("UL");ul.className = "dhtmlxcalendar_line";this.contTime.appendChild(ul);var li = document.createElement("LI");li.className = "dhtmlxcalendar_cell dhtmlxcalendar_time_hdr";li.innerHTML = "<div class='dhtmlxcalendar_time_label'></div><span class='dhtmlxcalendar_label_hours'></span><span class='dhtmlxcalendar_label_colon'>:</span><span class='dhtmlxcalendar_label_minutes'></span>";ul.appendChild(li);li.onclick = function(e) {e = e||event;var t = (e.target||e.srcElement);if (t.className && t.className == "dhtmlxcalendar_label_hours"){e.cancelBubble = true;that._showSelector("hours",3,115,"selector_hours",true);return;}
 
 if (t.className && t.className == "dhtmlxcalendar_label_minutes"){e.cancelBubble = true;that._showSelector("minutes",59,115,"selector_minutes",true);return;}
 
 that._hideSelector();}
 
 
 this._activeMonth = null;this._activeDate = new Date();this._activeDateCell = null;this.setDate = function(d) {this._nullDate = (typeof(d) == "undefined" || d === "" || !d);if (!(d instanceof Date)) {d = this._strToDate(String(d||""));if (d == "Invalid Date")d = new Date();}
 
 var time = d.getTime();if (this._isOutOfRange(time)) return;this._activeDate = new Date(time);this._drawMonth(this._nullDate?new Date():this._activeDate);this._updateVisibleHours();this._updateVisibleMinutes();}
 
 this.getDate = function(formated) {if (this._nullDate)return null;var t = new Date(this._activeDate.getTime());if (formated)return this._dateToStr(t);return t;}
 
 this._drawMonth = function(d) {if (!(d instanceof Date)) return;if (isNaN(d.getFullYear())) d = new Date(this._activeMonth.getFullYear(), this._activeMonth.getMonth(), 1, 0, 0, 0, 0);this._activeMonth = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);this._activeDateCell = null;var first = new Date(this._activeMonth.getTime());var d0 = first.getDay();var e0 = d0-this._wStart;if (e0 < 0)e0 = e0+7;first.setDate(first.getDate()-e0);var mx = d.getMonth();var dx = new Date(this._activeDate.getFullYear(), this._activeDate.getMonth(), this._activeDate.getDate(), 0, 0, 0, 0).getTime();var i = 0;for (var q=0;q<6;q++){var ws = this._wStart;for (var w=0;w<7;w++){var d2 = new Date(first.getFullYear(), first.getMonth(), first.getDate()+i++, 0, 0, 0, 0);this.contDates.childNodes[q].childNodes[w].innerHTML = d2.getDate();var day = d2.getDay();var time = d2.getTime();this.contDates.childNodes[q].childNodes[w]._date = new Date(time);this.contDates.childNodes[q].childNodes[w]._q = q;this.contDates.childNodes[q].childNodes[w]._w = w;this.contDates.childNodes[q].childNodes[w]._css_month = (d2.getMonth()==mx);this.contDates.childNodes[q].childNodes[w]._css_date = (!this._nullDate&&time==dx);this.contDates.childNodes[q].childNodes[w]._css_weekend = (ws>=6);this.contDates.childNodes[q].childNodes[w]._css_dis = this._isOutOfRange(time);this.contDates.childNodes[q].childNodes[w]._css_holiday = (this._holidays[time] == true);this._updateCellStyle(q, w);if (time==dx)this._activeDateCell = this.contDates.childNodes[q].childNodes[w];if (++ws > 7)ws = 1;}
 }
 
 this.contMonth.firstChild.firstChild.childNodes[1].innerHTML = this.langData[this.lang].monthesFNames[d.getMonth()];this.contMonth.firstChild.firstChild.childNodes[2].innerHTML = d.getFullYear();}
 
 this._updateCellStyle = function(q, w) {var r = this.contDates.childNodes[q].childNodes[w];var s = "dhtmlxcalendar_cell dhtmlxcalendar_cell";s += (r._css_month ? "_month" : "");s += (r._css_date ? "_date" : "");s += (r._css_weekend ? "_weekend" : "");s += (r._css_holiday ? "_holiday" : "");s += (r._css_dis ? "_dis" : "");s += (r._css_hover && !r._css_dis ? "_hover" : "");r.className = s;r = null;}
 
 
 
 this._initSelector = function(type,css) {if (!this._selCover){this._selCover = document.createElement("DIV");this._selCover.className = "dhtmlxcalendar_selector_cover";this.base.appendChild(this._selCover);}
 if (!this._sel){this._sel = document.createElement("DIV");this._sel.className = "dhtmlxcalendar_selector_obj";this.base.appendChild(this._sel);this._sel.appendChild(document.createElement("TABLE"));this._sel.firstChild.className = "dhtmlxcalendar_selector_table";this._sel.firstChild.cellSpacing = 0;this._sel.firstChild.cellPadding = 0;this._sel.firstChild.border = 0;this._sel.firstChild.appendChild(document.createElement("TBODY"));this._sel.firstChild.firstChild.appendChild(document.createElement("TR"));this._sel.firstChild.firstChild.firstChild.appendChild(document.createElement("TD"));this._sel.firstChild.firstChild.firstChild.appendChild(document.createElement("TD"));this._sel.firstChild.firstChild.firstChild.appendChild(document.createElement("TD"));this._sel.firstChild.firstChild.firstChild.childNodes[0].className = "dhtmlxcalendar_selector_cell_left";this._sel.firstChild.firstChild.firstChild.childNodes[1].className = "dhtmlxcalendar_selector_cell_middle";this._sel.firstChild.firstChild.firstChild.childNodes[2].className = "dhtmlxcalendar_selector_cell_right";this._sel.firstChild.firstChild.firstChild.childNodes[0].innerHTML = "&nbsp;";this._sel.firstChild.firstChild.firstChild.childNodes[2].innerHTML = "&nbsp;";this._sel.firstChild.firstChild.firstChild.childNodes[0].onmouseover = function(){this.className = "dhtmlxcalendar_selector_cell_left dhtmlxcalendar_selector_cell_left_hover";}
 this._sel.firstChild.firstChild.firstChild.childNodes[0].onmouseout = function(){this.className = "dhtmlxcalendar_selector_cell_left";}
 
 this._sel.firstChild.firstChild.firstChild.childNodes[2].onmouseover = function(){this.className = "dhtmlxcalendar_selector_cell_right dhtmlxcalendar_selector_cell_right_hover";}
 this._sel.firstChild.firstChild.firstChild.childNodes[2].onmouseout = function(){this.className = "dhtmlxcalendar_selector_cell_right";}
 
 this._sel.firstChild.firstChild.firstChild.childNodes[0].onclick = function(e){e = e||event;e.cancelBubble = true;that._scrollYears(-1);}
 
 this._sel.firstChild.firstChild.firstChild.childNodes[2].onclick = function(e){e = e||event;e.cancelBubble = true;that._scrollYears(1);}
 
 this._sel._ta = {};this._selHover = null;this._sel.onmouseover = function(e) {e = e||event;var t = (e.target||e.srcElement);if (t._cell === true){if (that._selHover != t)that._clearSelHover();if (String(t.className).match(/^\s{0,}dhtmlxcalendar_selector_cell\s{0,}$/gi) !=null) {t.className += " dhtmlxcalendar_selector_cell_hover";that._selHover = t;}
 }
 }
 
 this._sel.onmouseout = function() {that._clearSelHover();}
 
 this._sel.appendChild(document.createElement("DIV"));this._sel.lastChild.className = "dhtmlxcalendar_selector_obj_arrow";}
 
 
 if (this._sel._ta[type] == true)return;if (type == "month"){this._msCells = {};this.msCont = document.createElement("DIV");this.msCont.className = "dhtmlxcalendar_area_"+css;this._sel.firstChild.firstChild.firstChild.childNodes[1].appendChild(this.msCont);var i = 0;for (var q=0;q<4;q++){var ul = document.createElement("UL");ul.className = "dhtmlxcalendar_selector_line";this.msCont.appendChild(ul);for (var w=0;w<3;w++){var li = document.createElement("LI");li.innerHTML = this.langData[this.lang].monthesSNames[i];li.className = "dhtmlxcalendar_selector_cell";ul.appendChild(li);li._month = i;li._cell = true;this._msCells[i++] = li;}
 }
 
 this.msCont.onclick = function(e) {e = e||event;e.cancelBubble = true;var t = (e.target||e.srcElement);if (t._month != null){that._hideSelector();that._updateActiveMonth();that._drawMonth(new Date(that._activeMonth.getFullYear(), t._month, 1, 0, 0, 0, 0));that._doOnSelectorChange();}
 }
 
 }
 
 
 if (type == "year"){this._ysCells = {};this.ysCont = document.createElement("DIV");this.ysCont.className = "dhtmlxcalendar_area_"+css;this._sel.firstChild.firstChild.firstChild.childNodes[1].appendChild(this.ysCont);for (var q=0;q<4;q++){var ul = document.createElement("UL");ul.className = "dhtmlxcalendar_selector_line";this.ysCont.appendChild(ul);for (var w=0;w<3;w++){var li = document.createElement("LI");li.className = "dhtmlxcalendar_selector_cell";li._cell = true;ul.appendChild(li);}
 }
 
 this.ysCont.onclick = function(e) {e = e||event;e.cancelBubble = true;var t = (e.target||e.srcElement);if (t._year != null){that._hideSelector();that._drawMonth(new Date(t._year, that._activeMonth.getMonth(), 1, 0, 0, 0, 0));that._doOnSelectorChange();}
 }
 
 }
 
 
 if (type == "hours"){this._hsCells = {};this.hsCont = document.createElement("DIV");this.hsCont.className = "dhtmlxcalendar_area_"+css;this._sel.firstChild.firstChild.firstChild.childNodes[1].appendChild(this.hsCont);var i = 0;for (var q=0;q<4;q++){var ul = document.createElement("UL");ul.className = "dhtmlxcalendar_selector_line";this.hsCont.appendChild(ul);for (var w=0;w<6;w++){var li = document.createElement("LI");li.innerHTML = this._fixLength(i,2);li.className = "dhtmlxcalendar_selector_cell";ul.appendChild(li);li._hours = i;li._cell = true;this._hsCells[i++] = li;}
 }
 
 this.hsCont.onclick = function(e) {e = e||event;e.cancelBubble = true;var t = (e.target||e.srcElement);if (t._hours != null){that._hideSelector();that._activeDate.setHours(t._hours);that._updateActiveHours();that._updateVisibleHours();that._doOnSelectorChange();}
 }
 
 }
 
 
 if (type == "minutes"){this._rsCells = {};this.rsCont = document.createElement("DIV");this.rsCont.className = "dhtmlxcalendar_area_"+css;this._sel.firstChild.firstChild.firstChild.childNodes[1].appendChild(this.rsCont);var i = 0;for (var q=0;q<4;q++){var ul = document.createElement("UL");ul.className = "dhtmlxcalendar_selector_line";this.rsCont.appendChild(ul);for (var w=0;w<3;w++){var li = document.createElement("LI");li.innerHTML = this._fixLength(i,2);li.className = "dhtmlxcalendar_selector_cell";ul.appendChild(li);li._minutes = i;li._cell = true;this._rsCells[i] = li;i+=5;}
 }
 
 this.rsCont.onclick = function(e) {e = e||event;e.cancelBubble = true;var t = (e.target||e.srcElement);if (t._minutes != null){that._hideSelector();that._activeDate.setMinutes(t._minutes);that._updateActiveMinutes();that._updateVisibleMinutes();that._doOnSelectorChange();}
 }
 
 }
 
 
 this._sel._ta[type] = true;}
 
 this._showSelector = function(type,x,y,css,autoHide) {if (autoHide === true && this._sel != null && this._isSelectorVisible()&& type == this._sel._t) {this._hideSelector();return;}
 
 if (this.skin == "dhx_terrace"){x += {month: 14, year:27, hours: 19, minutes: 24}[type];y += {month: 8, year: 8, hours: 14, minutes: 14}[type];}
 
 if (!this._sel || !this._sel._ta[type])this._initSelector(type,css);this._selCover.style.display = "";this._sel._t = type;this._sel.style.left = x+"px";this._sel.style.top = y+"px";this._sel.style.display = "";this._sel.className = "dhtmlxcalendar_selector_obj dhtmlxcalendar_"+css;this._doOnSelectorShow(type);}
 
 this._doOnSelectorShow = function(type) {if (type == "month")this._updateActiveMonth();if (type == "year")this._updateYearsList(this._activeMonth);if (type == "hours")this._updateActiveHours();if (type == "minutes")this._updateActiveMinutes();}
 
 this._hideSelector = function() {if (!this._sel)return;this._sel.style.display = "none";this._selCover.style.display = "none";}
 
 this._isSelectorVisible = function() {if (!this._sel)return false;return (this._sel.style.display != "none");}
 
 this._doOnSelectorChange = function(state) {this.callEvent("onChange",[new Date(this._activeMonth.getFullYear(), this._activeMonth.getMonth(), this._activeDate.getDate(), this._activeDate.getHours(), this._activeDate.getMinutes(), this._activeDate.getSeconds()),state]);}
 
 this._clearSelHover = function() {if (!this._selHover)return;this._selHover.className = String(this._selHover.className.replace(/dhtmlxcalendar_selector_cell_hover/gi,""));this._selHover = null;}
 
 
 
 
 this._updateActiveMonth = function() {if (typeof(this._msActive)!= "undefined" && typeof(this._msCells[this._msActive]) != "undefined") this._msCells[this._msActive].className = "dhtmlxcalendar_selector_cell";this._msActive = this._activeMonth.getMonth();this._msCells[this._msActive].className = "dhtmlxcalendar_selector_cell dhtmlxcalendar_selector_cell_active";}
 
 
 
 this._updateActiveYear = function() {var i = this._activeMonth.getFullYear();if (this._ysCells[i])this._ysCells[i].className = "dhtmlxcalendar_selector_cell dhtmlxcalendar_selector_cell_active";}
 
 this._updateYearsList = function(d) {for (var a in this._ysCells){this._ysCells[a] = null;delete this._ysCells[a];}
 
 var i = 12*Math.floor(d.getFullYear()/12);for (var q=0;q<4;q++){for (var w=0;w<3;w++){this.ysCont.childNodes[q].childNodes[w].innerHTML = i;this.ysCont.childNodes[q].childNodes[w]._year = i;this.ysCont.childNodes[q].childNodes[w].className = "dhtmlxcalendar_selector_cell";this._ysCells[i++] = this.ysCont.childNodes[q].childNodes[w];}
 }
 this._updateActiveYear();}
 
 this._scrollYears = function(i) {var y = (i<0?this.ysCont.firstChild.firstChild._year:this.ysCont.lastChild.lastChild._year)+i;var d = new Date(y, this._activeMonth.getMonth(), 1, 0, 0, 0, 0);this._updateYearsList(d);}
 
 
 
 
 this._updateActiveHours = function() {if (typeof(this._hsActive)!= "undefined" && typeof(this._hsCells[this._hsActive]) != "undefined") this._hsCells[this._hsActive].className = "dhtmlxcalendar_selector_cell";this._hsActive = this._activeDate.getHours();this._hsCells[this._hsActive].className = "dhtmlxcalendar_selector_cell dhtmlxcalendar_selector_cell_active";}
 
 
 this._updateVisibleHours = function() {this.contTime.firstChild.firstChild.childNodes[1].innerHTML = this._fixLength(this._activeDate.getHours(),2);}
 
 
 
 
 this._updateActiveMinutes = function() {if (typeof(this._rsActive)!= "undefined" && typeof(this._rsCells[this._rsActive]) != "undefined") this._rsCells[this._rsActive].className = "dhtmlxcalendar_selector_cell";this._rsActive = this._activeDate.getMinutes();if (typeof(this._rsCells[this._rsActive])!= "undefined") this._rsCells[this._rsActive].className = "dhtmlxcalendar_selector_cell dhtmlxcalendar_selector_cell_active";}
 
 
 this._updateVisibleMinutes = function() {this.contTime.firstChild.firstChild.childNodes[3].innerHTML = this._fixLength(this._activeDate.getMinutes(),2);}
 
 
 
 this._fixLength = function(t, r) {while (String(t).length < r) t = "0"+String(t);return t;}
 
 this._dateFormat = "";this._dateFormatRE = null;this.setDateFormat = function(format) {this._dateFormat = format;this._dateFormatRE = new RegExp(String(this._dateFormat).replace(/%[a-zA-Z]+/g,function(t){var t2 = t.replace(/%/,"");switch (t2) {case "n":
 case "h":
 case "j":
 case "g":
 case "G":
 return "\\d{1,2}";case "m":
 case "d":
 case "H":
 case "i":
 case "s":
 case "y":
 return "\\d{2}";case "Y":
 return "\\d{4}";case "M":
 return "("+that.langData[that.lang].monthesSNames.join("|").toLowerCase()+"){1,}";case "F":
 return "("+that.langData[that.lang].monthesFNames.join("|").toLowerCase()+"){1,}";case "D":
 return "[a-z]{2}";case "a":
 case "A":
 return "AM|PM";}
 return t;}),"i");}
 
 this.setDateFormat(this.langData[this.lang].dateformat||"%Y-%m-%d");this._getInd = function(val,ar) {for (var q=0;q<ar.length;q++)if (ar[q].toLowerCase()== val) return q;return -1;}
 
 this._strToDate = function(val, format) {format = (format||this._dateFormat);var v = val.match(/[a-z0-9]{1,}/gi);var f = format.match(/%[a-zA-Z]/g);if (!v || v.length != f.length)return "Invalid Date";var p = {"%y":1,"%Y":1,"%n":2,"%m":2,"%M":2,"%F":2,"%d":3,"%j":3,"%a":4,"%A":4,"%H":5,"%G":5,"%h":5,"%g":5,"%i":6,"%s":7};var v2 = {};var f2 = {};for (var q=0;q<f.length;q++){if (typeof(p[f[q]])!= "undefined") {var ind = p[f[q]];if (!v2[ind]){v2[ind]=[];f2[ind]=[];}
 v2[ind].push(v[q]);f2[ind].push(f[q]);}
 }
 v = [];f = [];for (var q=1;q<=7;q++){if (v2[q] != null){for (var w=0;w<v2[q].length;w++){v.push(v2[q][w]);f.push(f2[q][w]);}
 }
 }
 
 
 var r = new Date();r.setDate(1);r.setMinutes(0);r.setSeconds(0);for (var q=0;q<v.length;q++){switch (f[q]) {case "%d":
 case "%j":
 case "%n":
 case "%m":
 case "%Y":
 case "%H":
 case "%G":
 case "%i":
 case "%s":
 if (!isNaN(v[q])) r[{"%d":"setDate","%j":"setDate","%n":"setMonth","%m":"setMonth","%Y":"setFullYear","%H":"setHours","%G":"setHours","%i":"setMinutes","%s":"setSeconds"}[f[q]]](Number(v[q])+(f[q]=="%m"||f[q]=="%n"?-1:0));break;case "%M":
 case "%F":
 var k = this._getInd(v[q].toLowerCase(),that.langData[that.lang][{"%M":"monthesSNames","%F":"monthesFNames"}[f[q]]]);if (k >= 0)r.setMonth(k);break;case "%y":
 if (!isNaN(v[q])) {var v0 = Number(v[q]);r.setFullYear(v0+(v0>50?1900:2000));}
 break;case "%g":
 case "%h":
 if (!isNaN(v[q])) {var v0 = Number(v[q]);if (v0 <= 12 && v0 >= 0){r.setHours(v0+(this._getInd("pm",v)>=0?(v0==12?0:12):(v0==12?-12:0)));}
 }
 break;}
 
 }
 
 return r;}
 
 this._dateToStr = function(val, format) {if (val instanceof Date){var z = function(t) {return (String(t).length==1?"0"+String(t):t);}
 var k = function(t) {switch(t) {case "%d": return z(val.getDate());case "%j": return val.getDate();case "%D": return that.langData[that.lang].daysSNames[val.getDay()];case "%l": return that.langData[that.lang].daysFNames[val.getDay()];case "%m": return z(val.getMonth()+1);case "%n": return val.getMonth()+1;case "%M": return that.langData[that.lang].monthesSNames[val.getMonth()];case "%F": return that.langData[that.lang].monthesFNames[val.getMonth()];case "%y": return z(val.getYear()%100);case "%Y": return val.getFullYear();case "%g": return (val.getHours()+11)%12+1;case "%h": return z((val.getHours()+11)%12+1);case "%G": return val.getHours();case "%H": return z(val.getHours());case "%i": return z(val.getMinutes());case "%s": return z(val.getSeconds());case "%a": return (val.getHours()>11?"pm":"am");case "%A": return (val.getHours()>11?"PM":"AM");case "%%": "%";default: return t;}
 }
 var t = String(format||this._dateFormat).replace(/%[a-zA-Z]/g, k);}
 
 return (t||String(val));}
 
 this._updateDateStr = function(str) {if (!this._dateFormatRE || !str.match(this._dateFormatRE)) return;if (str == this.getFormatedDate()) return;var r = this._strToDate(str);if (!(r instanceof Date)) return;if (this.checkEvent("onBeforeChange")) {if (!this.callEvent("onBeforeChange",[new Date(r.getFullYear(),r.getMonth(),r.getDate(),r.getHours(),r.getMinutes(),r.getSeconds())])) {if (this.i != null && this._activeInp != null && this.i[this._activeInp] != null && this.i[this._activeInp].input != null){this.i[this._activeInp].input.value = this.getFormatedDate();}
 return;}
 }
 
 this._nullDate = false;this._activeDate = r;this._drawMonth(this._nullDate?new Date():this._activeDate);this._updateVisibleMinutes();this._updateVisibleHours();if (this._sel && this._isSelectorVisible()) this._doOnSelectorShow(this._sel._t);this._doOnSelectorChange(true);}
 
 this.showMonth = function(d) {this._drawMonth(d);}
 
 this.setFormatedDate = function(format, str, a, return_only) {var date = this._strToDate(str, format);if (return_only)return date;this.setDate(date);}
 this.getFormatedDate = function(format, date){if (!(date && date instanceof Date)){if (this._nullDate)return "";date = new Date(this._activeDate);}
 return this._dateToStr(date, format);}
 
 
 
 
 
 this.show = function(id) {if (!id && this._hasParent){this._show();return;}
 
 
 if (typeof(id)== "object" && typeof(id._dhtmlxcalendar_uid) != "undefined" && this.i[id._dhtmlxcalendar_uid] == id) {this._show(id._dhtmlxcalendar_uid);return;}
 if (typeof(id)== "undefined") {for (var a in this.i)if (!id)id = a;}
 if (!id)return;this._show(id);}
 
 this.hide = function() {if (this._isVisible()) this._hide();}
 
 this.isVisible = function() {return this._isVisible();}
 
 
 this.draw = function() {this.show();}
 
 this.close = function() {this.hide();}
 
 
 
 this._activeInp = null;this.pos = "bottom";this.setPosition = function(x, y) {this._px = null;this._py = null;if (x == "right" || x == "bottom"){this.pos = x;}else {this.pos = "int";if (typeof(x)!= "undefined" && !isNaN(x)) {this.base.style.left = x+"px";this._px = x;}
 if (typeof(y)!= "undefined" && !isNaN(y)) {this.base.style.top = y+"px";this._py = y;}
 this._ifrSize();}
 }
 
 this._show = function(inpId, autoHide) {if (autoHide === true && this._activeInp == inpId && this._isVisible()) {this._hide();return;}
 this.base.style.visibility = "hidden";this.base.style.display = "";if (!inpId){if (this._px && this._py){this.base.style.left = this._px+"px";this.base.style.top = this._py+"px";}else {this.base.style.left = "0px";this.base.style.top = "0px";}
 }else {var i = (this.i[inpId].input||this.i[inpId].button);var _isIE = (navigator.appVersion.indexOf("MSIE")!=-1);var y1 = Math.max((_isIE?document.documentElement:document.getElementsByTagName("html")[0]).scrollTop, document.body.scrollTop);var y2 = y1+(_isIE?Math.max(document.documentElement.clientHeight||0,document.documentElement.offsetHeight||0,document.body.clientHeight||0):window.innerHeight);if (this.pos == "right"){this.base.style.left = this._getLeft(i)+i.offsetWidth-1+"px";this.base.style.top = Math.min(this._getTop(i),y2-this.base.offsetHeight)+"px";}else if (this.pos == "bottom"){this.base.style.left = this._getLeft(i)+"px";this.base.style.top = this._getTop(i)+i.offsetHeight+1+"px";}else {this.base.style.left = (this._px||0)+"px";this.base.style.top = (this._py||0)+"px";}
 this._activeInp = inpId;i = null;}
 this._hideSelector();this.base.style.visibility = "visible";this._ifrSize();if (this._ifr)this._ifr.style.display = "";this.callEvent("onShow",[]);}
 
 this._hide = function() {this._hideSelector();this.base.style.display = "none";this._activeInp = null;if (this._ifr)this._ifr.style.display = "none";this.callEvent("onHide",[]);}
 
 this._isVisible = function() {return (this.base.style.display!="none");}
 
 this._getLeft = function(obj) {return this._posGetOffset(obj).left;}
 
 this._getTop = function(obj) {return this._posGetOffset(obj).top;}
 
 this._posGetOffsetSum = function(elem) {var top=0, left=0;while(elem){top = top + parseInt(elem.offsetTop);left = left + parseInt(elem.offsetLeft);elem = elem.offsetParent;}
 return {top: top, left: left};}
 this._posGetOffsetRect = function(elem) {var box = elem.getBoundingClientRect();var body = document.body;var docElem = document.documentElement;var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;var clientTop = docElem.clientTop || body.clientTop || 0;var clientLeft = docElem.clientLeft || body.clientLeft || 0;var top = box.top + scrollTop - clientTop;var left = box.left + scrollLeft - clientLeft;return {top: Math.round(top), left: Math.round(left) };}
 this._posGetOffset = function(elem) {return this[elem.getBoundingClientRect?"_posGetOffsetRect":"_posGetOffsetSum"](elem);}
 
 this._rangeActive = false;this._rangeFrom = null;this._rangeTo = null;this._rangeSet = {};this.setInsensitiveDays = function(d) {var t = this._extractDates(d);for (var q=0;q<t.length;q++)this._rangeSet[new Date(t[q].getFullYear(),t[q].getMonth(),t[q].getDate(),0,0,0,0).getTime()] = true;this._drawMonth(this._activeMonth);}
 
 this.clearInsensitiveDays = function() {this._clearRangeSet();this._drawMonth(this._activeMonth);}
 
 this._holidays = {};this.setHolidays = function(r) {if (r == null){this._clearHolidays();}else if (r != null){var t = this._extractDates(r);for (var q=0;q<t.length;q++)this._holidays[new Date(t[q].getFullYear(),t[q].getMonth(),t[q].getDate(),0,0,0,0).getTime()] = true;}
 this._drawMonth(this._activeMonth);}
 
 this._extractDates = function(r) {if (typeof(r)== "string" || r instanceof Date) r = [r];var t = [];for (var q=0;q<r.length;q++){if (typeof(r[q])== "string") {var e = r[q].split(",");for (var w=0;w<e.length;w++)t.push(this._strToDate(e[w]));}else if (r[q] instanceof Date){t.push(r[q]);}
 }
 return t;}
 
 this._clearRange = function() {this._rangeActive = false;this._rangeType = null;this._rangeFrom = null;this._rangeTo = null;}
 
 this._clearRangeSet = function() {for (var a in this._rangeSet){this._rangeSet[a] = null;delete this._rangeSet[a];}
 }
 
 this._clearHolidays = function() {for (var a in this._holidays){this._holidays[a] = null;delete this._holidays[a];}
 }
 
 this._isOutOfRange = function(time) {if (this._rangeSet[time] == true)return true;if (this._rangeActive){if (this._rangeType == "in" && (time<this._rangeFrom || time>this._rangeTo)) return true;if (this._rangeType == "out" && (time>=this._rangeFrom && time<=this._rangeTo)) return true;if (this._rangeType == "from" && time<this._rangeFrom)return true;if (this._rangeType == "to" && time>this._rangeTo)return true;}
 
 var t0 = new Date(time);if (this._rangeWeek){if (this._rangeWeekData[t0.getDay()] === true) return true;}
 
 if (this._rangeMonth){if (this._rangeMonthData[t0.getDate()] === true) return true;}
 
 if (this._rangeYear){if (this._rangeYearData[t0.getMonth()+"_"+t0.getDate()] === true) return true;}
 
 return false;}
 
 this.clearSensitiveRange = function() {this._clearRange();this._drawMonth(this._activeMonth);}
 
 this.setSensitiveRange = function(from, to, ins) {var f = false;if (from != null && to != null){if (!(from instanceof Date)) from = this._strToDate(from);if (!(to instanceof Date)) to = this._strToDate(to);if (from.getTime()> to.getTime()) return;this._rangeFrom = new Date(from.getFullYear(),from.getMonth(),from.getDate(),0,0,0,0).getTime();this._rangeTo = new Date(to.getFullYear(),to.getMonth(),to.getDate(),0,0,0,0).getTime();this._rangeActive = true;this._rangeType = "in";f = true;}
 
 
 if (!f && from != null && to == null){if (!(from instanceof Date)) from = this._strToDate(from);this._rangeFrom = new Date(from.getFullYear(),from.getMonth(),from.getDate(),0,0,0,0).getTime();this._rangeTo = null;if (ins === true)this._rangeFrom++;this._rangeActive = true;this._rangeType = "from";f = true;}
 
 
 if (!f && from == null && to != null){if (!(to instanceof Date)) to = this._strToDate(to);this._rangeFrom = null;this._rangeTo = new Date(to.getFullYear(),to.getMonth(),to.getDate(),0,0,0,0).getTime();if (ins === true)this._rangeTo--;this._rangeActive = true;this._rangeType = "to";f = true;}
 
 if (f)this._drawMonth(this._activeMonth);}
 
 this.setInsensitiveRange = function(from, to) {if (from != null && to != null){if (!(from instanceof Date)) from = this._strToDate(from);if (!(to instanceof Date)) to = this._strToDate(to);if (from.getTime()> to.getTime()) return;this._rangeFrom = new Date(from.getFullYear(),from.getMonth(),from.getDate(),0,0,0,0).getTime();this._rangeTo = new Date(to.getFullYear(),to.getMonth(),to.getDate(),0,0,0,0).getTime();this._rangeActive = true;this._rangeType = "out";this._drawMonth(this._activeMonth);return;}
 
 if (from != null && to == null){this.setSensitiveRange(null, from, true);return;}
 
 if (from == null && to != null){this.setSensitiveRange(to, null, true);return;}
 
 }
 
 
 this.disableDays = function(mode, d) {if (mode == "week"){if (typeof(d)!= "object" && typeof(d.length) == "undefined") d = [d];if (!this._rangeWeekData)this._rangeWeekData = {};for (var a in this._rangeWeekData){this._rangeWeekData[a] = false;delete this._rangeWeekData[a];}
 
 for (var q=0;q<d.length;q++){this._rangeWeekData[d[q]] = true;if (d[q] == 7)this._rangeWeekData[0] = true;}
 this._rangeWeek = true;}
 
 if (mode == "month"){if (typeof(d)!= "object" && typeof(d.length) == "undefined") d = [d];if (!this._rangeMonthData)this._rangeMonthData = {};for (var a in this._rangeMonthData){this._rangeMonthData[a] = false;delete this._rangeMonthData[a];}
 for (var q=0;q<d.length;q++)this._rangeMonthData[d[q]] = true;this._rangeMonth = true;}
 
 if (mode == "year"){var t = this._extractDates(d);if (!this._rangeYearData)this._rangeYearData = {};for (var a in this._rangeYearData){this._rangeYearData[a] = false;delete this._rangeYearData[a];}
 for (var q=0;q<t.length;q++)this._rangeYearData[t[q].getMonth()+"_"+t[q].getDate()] = true;this._rangeYear = true;}
 
 this._drawMonth(this._activeMonth);}
 
 this.enableDays = function(mode) {if (mode == "week"){this._rangeWeek = false;}
 
 if (mode == "month"){this._rangeMonth = false;}
 
 if (mode == "year"){this._rangeYear = false;}
 
 this._drawMonth(this._activeMonth);}
 
 this._updateFromInput = function(t) {if (this._nullInInput && ((t.value).replace(/\s/g,"")).length == 0) {if (this.checkEvent("onBeforeChange")) {if (!this.callEvent("onBeforeChange",[null])) {if (this.i != null && this._activeInp != null && this.i[this._activeInp] != null && this.i[this._activeInp].input != null){this.i[this._activeInp].input.value = this.getFormatedDate();}
 return;}
 }
 this.setDate(null);}else {this._updateDateStr(t.value);}
 t = null;}
 
 
 this._doOnClick = function(e) {e = e||event;var t = (e.target||e.srcElement);if (t._dhtmlxcalendar_uid && t._dhtmlxcalendar_uid != that._activeInp && that._isVisible()&&that._activeInp) {that._hide();return;}
 if (!t._dhtmlxcalendar_uid || !that.i[t._dhtmlxcalendar_uid]){if (that._isSelectorVisible()) that._hideSelector();else if (!that._hasParent && that._isVisible()) that._hide();}
 }
 
 this._doOnKeyDown = function(e) {e = e||event;if (e.keyCode == 27 || e.keyCode == 13){if (that._isSelectorVisible()) that._hideSelector();else if (that._isVisible()&& !that._hasParent) that._hide();}
 }
 
 
 this._doOnInpClick = function(e) {e = e||event;var t = (e.target||e.srcElement);if (!t._dhtmlxcalendar_uid)return;if (!that._listenerEnabled){that._updateFromInput(t);}
 that._show(t._dhtmlxcalendar_uid, true);}
 
 this._doOnInpKeyUp = function(e) {e = e||event;var t = (e.target||e.srcElement);if (e.keyCode == 13 || !t._dhtmlxcalendar_uid)return;if (!that._listenerEnabled)that._updateFromInput(t);}
 
 this._doOnBtnClick = function(e) {e = e||event;var t = (e.target||e.srcElement);if (!t._dhtmlxcalendar_uid)return;if (that.i[t._dhtmlxcalendar_uid].input != null)that._updateFromInput(that.i[t._dhtmlxcalendar_uid].input);that._show(t._dhtmlxcalendar_uid, true);}
 
 this._doOnUnload = function() {if (that && that.unload)that.unload();}
 
 if (window.addEventListener){document.body.addEventListener("click", that._doOnClick, false);window.addEventListener("keydown", that._doOnKeyDown, false);window.addEventListener("unload", that._doOnUnload, false);}else {document.body.attachEvent("onclick", that._doOnClick);document.body.attachEvent("onkeydown", that._doOnKeyDown);window.attachEvent("onunload", that._doOnUnload);}
 
 this.attachObj = function(obj) {if (typeof(obj)== "string") obj = document.getElementById(obj);var a = this.uid();this.i[a] = obj;this._attachEventsToObject(a);}
 
 this.detachObj = function(obj) {if (typeof(obj)== "string") obj = document.getElementById(obj);var a = obj._dhtmlxcalendar_uid;if (this.i[a] != null){this._detachEventsFromObject(a);this.i[a]._dhtmlxcalendar_uid = null;this.i[a] = null;delete this.i[a];}
 }
 
 this._attachEventsToObject = function(a) {if (this.i[a].button != null){this.i[a].button._dhtmlxcalendar_uid = a;if (window.addEventListener){this.i[a].button.addEventListener("click", that._doOnBtnClick, false);}else {this.i[a].button.attachEvent("onclick", that._doOnBtnClick);}
 }else if (this.i[a].input != null){this.i[a].input._dhtmlxcalendar_uid = a;if (window.addEventListener){this.i[a].input.addEventListener("click", that._doOnInpClick, false);this.i[a].input.addEventListener("keyup", that._doOnInpKeyUp, false);}else {this.i[a].input.attachEvent("onclick", that._doOnInpClick);this.i[a].input.attachEvent("onkeyup", that._doOnInpKeyUp);}
 }
 }
 
 
 this.enableListener = function(t) {if (!t)return;if (window.addEventListener){t.addEventListener("focus", that._listenerEvFocus, false);t.addEventListener("blur", that._listenerEvBlur, false);}else {t.attachEvent("onfocus", that._listenerEvFocus);t.attachEvent("onblur", that._listenerEvBlur);}
 t = null;}
 
 this.disableListener = function(t) {if (!t)return;t._f0 = false;if (this._tmListener)window.clearTimeout(this._tmListener);if (window.addEventListener){t.removeEventListener("focus", that._listenerEvFocus, false);t.removeEventListener("blur", that._listenerEvBlur, false);}else {t.detachEvent("onfocus", that._listenerEvFocus);t.detachEvent("onblur", that._listenerEvBlur);}
 t = null;}
 
 this._startListener = function(t) {if (this._tmListener)window.clearTimeout(this._tmListener);if (typeof(t._v1)== "undefined") t._v1 = t.value;if (t._v1 != t.value){this._updateFromInput(t);t._v1 = t.value;}
 if (t._f0)this._tmListener = window.setTimeout(function(){that._startListener(t);},100);}
 
 this._listenerEvFocus = function(e) {e = e||event;var t = e.target||e.srcElement;t._f0 = true;that._startListener(t)
 t = null;}
 this._listenerEvBlur = function(e) {e = e||event;var t = e.target||e.srcElement;t._f0 = false;t = null;}
 
 
 
 this._detachEventsFromObject = function(a) {if (this.i[a].button != null){if (window.addEventListener){this.i[a].button.removeEventListener("click", that._doOnBtnClick, false);}else {this.i[a].button.detachEvent("onclick", that._doOnBtnClick);}
 }else if (this.i[a].input != null){if (window.addEventListener){this.i[a].input.removeEventListener("click", that._doOnInpClick, false);this.i[a].input.removeEventListener("keyup", that._doOnInpKeyUp, false);}else {this.i[a].input.detachEvent("onclick", that._doOnInpClick);this.i[a].input.detachEvent("onkeyup", that._doOnInpKeyUp);}
 }
 }
 
 for (var a in this.i)this._attachEventsToObject(a);this.evs = {};this.attachEvent = function(name, func) {var eId = this.uid();this.evs[eId] = {name: String(name).toLowerCase(), func: func};return eId;}
 this.detachEvent = function(id) {if (this.evs[id]){this.evs[id].name = null;this.evs[id].func = null;this.evs[id] = null;delete this.evs[id];}
 }
 this.callEvent = function(name, params) {var u = true;var n = String(name).toLowerCase();params = (params||[]);for (var a in this.evs){if (this.evs[a].name == n){var r = this.evs[a].func.apply(this,params);u = (u && r);}
 }
 return u;}
 this.checkEvent = function(name) {var u = false;var n = String(name).toLowerCase();for (var a in this.evs)u = (u || this.evs[a].name == n);return u;}
 
 
 
 this.unload = function() {this._activeDate = null;this._activeDateCell = null;this._activeInp = null;this._activeMonth = null;this._dateFormat = null;this._dateFormatRE = null;this._lastHover = null;this.uid = null;this.uidd = null;if (this._tmListener)window.clearTimeout(this._tmListener);this._tmListener = null;if (window.addEventListener){document.body.removeEventListener("click", that._doOnClick, false);window.removeEventListener("keydown", that._doOnKeyDown, false);window.removeEventListener("unload", that._doOnUnload, false);}else {document.body.detachEvent("onclick", that._doOnClick);document.body.detachEvent("onkeydown", that._doOnKeyDown);window.detachEvent("onunload", that._doOnKeyDown);}
 
 this._doOnClick = null;this._doOnKeyDown = null;this._doOnUnload = null;for (var a in this.i){this.i[a]._dhtmlxcalendar_uid = null;this._detachEventsFromObject(a);this.disableListener(this.i[a].input);this.i[a] = null;delete this.i[a];}
 
 this.i = null;this._doOnInpClick = null;this._doOnInpKeyUp = null;for (var a in this.evs)this.detachEvent(a);this.evs = null;this.attachEvent = null;this.detachEvent = null;this.checkEvent = null;this.callEvent = null;this.contMonth.onselectstart = null;this.contMonth.firstChild.firstChild.onclick = null;this.contMonth.firstChild.firstChild.firstChild.onmouseover = null;this.contMonth.firstChild.firstChild.firstChild.onmouseout = null;this.contMonth.firstChild.firstChild.lastChild.onmouseover = null;this.contMonth.firstChild.firstChild.lastChild.onmouseout = null;while (this.contMonth.firstChild.firstChild.childNodes.length > 0)this.contMonth.firstChild.firstChild.removeChild(this.contMonth.firstChild.firstChild.lastChild);this.contMonth.firstChild.removeChild(this.contMonth.firstChild.firstChild);this.contMonth.removeChild(this.contMonth.firstChild);this.contMonth.parentNode.removeChild(this.contMonth);this.contMonth = null;while (this.contDays.firstChild.childNodes.length > 0)this.contDays.firstChild.removeChild(this.contDays.firstChild.lastChild);this.contDays.removeChild(this.contDays.firstChild);this.contDays.parentNode.removeChild(this.contDays);this.contDays = null;this.contDates.onclick = null;this.contDates.onmouseover = null;this.contDates.onmouseout = null;while (this.contDates.childNodes.length > 0){while (this.contDates.lastChild.childNodes.length > 0){this.contDates.lastChild.lastChild._css_date = null;this.contDates.lastChild.lastChild._css_month = null;this.contDates.lastChild.lastChild._css_weekend = null;this.contDates.lastChild.lastChild._css_hover = null;this.contDates.lastChild.lastChild._date = null;this.contDates.lastChild.lastChild._q = null;this.contDates.lastChild.lastChild._w = null;this.contDates.lastChild.removeChild(this.contDates.lastChild.lastChild);}
 
 this.contDates.removeChild(this.contDates.lastChild);}
 
 
 this.contDates.parentNode.removeChild(this.contDates);this.contDates = null;this.contTime.firstChild.firstChild.onclick = null;while (this.contTime.firstChild.firstChild.childNodes.length > 0)this.contTime.firstChild.firstChild.removeChild(this.contTime.firstChild.firstChild.lastChild);this.contTime.firstChild.removeChild(this.contTime.firstChild.firstChild);this.contTime.removeChild(this.contTime.firstChild);this.contTime.parentNode.removeChild(this.contTime);this.contTime = null;this._lastHover = null;if (this.msCont){this.msCont.onclick = null;this._msActive = null;for (var a in this._msCells){this._msCells[a]._cell = null;this._msCells[a]._month = null;this._msCells[a].parentNode.removeChild(this._msCells[a]);this._msCells[a] = null;}
 this._msCells = null;while (this.msCont.childNodes.length > 0)this.msCont.removeChild(this.msCont.lastChild);this.msCont.parentNode.removeChild(this.msCont);this.msCont = null;}
 
 
 if (this.ysCont){this.ysCont.onclick = null;for (var a in this._ysCells){this._ysCells[a]._cell = null;this._ysCells[a]._year = null;this._ysCells[a].parentNode.removeChild(this._ysCells[a]);this._ysCells[a] = null;}
 this._ysCells = null;while (this.ysCont.childNodes.length > 0)this.ysCont.removeChild(this.ysCont.lastChild);this.ysCont.parentNode.removeChild(this.ysCont);this.ysCont = null;}
 
 
 if (this.hsCont){this.hsCont.onclick = null;this._hsActive = null;for (var a in this._hsCells){this._hsCells[a]._cell = null;this._hsCells[a]._hours = null;this._hsCells[a].parentNode.removeChild(this._hsCells[a]);this._hsCells[a] = null;}
 this._hsCells = null;while (this.hsCont.childNodes.length > 0)this.hsCont.removeChild(this.hsCont.lastChild);this.hsCont.parentNode.removeChild(this.hsCont);this.hsCont = null;}
 
 
 if (this.rsCont){this.rsCont.onclick = null;this._rsActive = null;for (var a in this._rsCells){this._rsCells[a]._cell = null;this._rsCells[a]._minutes = null;this._rsCells[a].parentNode.removeChild(this._rsCells[a]);this._rsCells[a] = null;}
 this._rsCells = null;while (this.rsCont.childNodes.length > 0)this.rsCont.removeChild(this.rsCont.lastChild);this.rsCont.parentNode.removeChild(this.rsCont);this.rsCont = null;}
 
 
 if (this._selCover){this._selCover.parentNode.removeChild(this._selCover);this._selCover = null;}
 
 
 if (this._sel){for (var a in this._sel._ta)this._sel._ta[a] = null;this._sel._ta = null;this._sel._t = null;this._sel.onmouseover = null;this._sel.onmouseout = null;while (this._sel.firstChild.firstChild.firstChild.childNodes.length > 0){this._sel.firstChild.firstChild.firstChild.lastChild.onclick = null;this._sel.firstChild.firstChild.firstChild.lastChild.onmouseover = null;this._sel.firstChild.firstChild.firstChild.lastChild.onmouseout = null;this._sel.firstChild.firstChild.firstChild.removeChild(this._sel.firstChild.firstChild.firstChild.lastChild);}
 
 
 this._sel.firstChild.firstChild.removeChild(this._sel.firstChild.firstChild.firstChild);this._sel.firstChild.removeChild(this._sel.firstChild.firstChild);while (this._sel.childNodes.length > 0)this._sel.removeChild(this._sel.lastChild);this._sel.parentNode.removeChild(this._sel);this._sel = null;}
 
 
 
 
 this.base.onclick = null;this.base.onmouseout = null;this.base.parentNode.removeChild(this.base);this.base = null;this._clearDayHover = null;this._clearSelHover = null;this._doOnSelectorChange = null;this._doOnSelectorShow = null;this._drawMonth = null;this._fixLength = null;this._getLeft = null;this._getTop = null;this._ifrSize = null;this._hide = null;this._hideSelector = null;this._initSelector = null;this._isSelectorVisible = null;this._isVisible = null;this._posGetOffset = null;this._posGetOffsetRect = null;this._posGetOffsetSum = null;this._scrollYears = null;this._show = null;this._showSelector = null;this._strToDate = null;this._updateActiveHours = null;this._updateActiveMinutes = null;this._updateActiveMonth = null;this._updateActiveYear = null;this._updateCellStyle = null;this._updateDateStr = null;this._updateVisibleHours = null;this._updateVisibleMinutes = null;this._updateYearsList = null;this.enableIframe = null;this.hide = null;this.hideTime = null;this.setDate = null;this.setDateFormat = null;this.setYearsRange = null;this.show = null;this.showTime = null;this.unload = null;for (var a in this)delete this[a];a = that = null;}
 
 
 
 this.setDate(this._activeDate);return this;};dhtmlXCalendarObject.prototype.setYearsRange = function(){};dhtmlXCalendarObject.prototype.lang = "en";dhtmlXCalendarObject.prototype.langData = {"en": {dateformat: "%Y-%m-%d",
 monthesFNames: ["January","February","March","April","May","June","July","August","September","October","November","December"],
 monthesSNames: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
 daysFNames: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
 daysSNames: ["Su","Mo","Tu","We","Th","Fr","Sa"],
 weekstart: 1
 }
};dhtmlXCalendarObject.prototype.enableIframe = function(mode) {if (mode == true){if (!this._ifr){this._ifr = document.createElement("IFRAME");this._ifr.frameBorder = 0;this._ifr.border = 0;this._ifr.setAttribute("src","javascript:false;");this._ifr.className = "dhtmlxcalendar_ifr";this._ifr.onload = function(){this.onload = null;this.contentWindow.document.open("text/html", "replace");this.contentWindow.document.write("<html><head><style>html,body{width:100%;height:100%;overflow:hidden;margin:0px;}</style></head><body</body></html>");}
 this.base.parentNode.insertBefore(this._ifr, this.base);this._ifrSize();}
 }else {if (this._ifr){this._ifr.parentNode.removeChild(this._ifr);this._ifr = null;}
 }
};dhtmlXCalendarObject.prototype._ifrSize = function() {if (this._ifr){this._ifr.style.left = this.base.style.left;this._ifr.style.top = this.base.style.top;this._ifr.style.width = this.base.offsetWidth+"px";this._ifr.style.height = this.base.offsetHeight+"px";}
};dhtmlxCalendarObject = dhtmlXCalendarObject;function dhtmlXComboFromSelect(parent,size){if (typeof(parent)=="string")
 parent=document.getElementById(parent);size=size||parent.getAttribute("width")||(window.getComputedStyle?window.getComputedStyle(parent,null)["width"]:(parent.currentStyle?parent.currentStyle["width"]:0));if ((!size)||(size=="auto")||size.indexOf("em")!=-1)
 size=parent.offsetWidth||100;var z=document.createElement("SPAN");parent.parentNode.insertBefore(z,parent);parent.style.display='none';var s_type = parent.getAttribute('opt_type');var w= new dhtmlXCombo(z,parent.name,size,s_type,parent.tabIndex);var x=new Array();var sel=-1;for (var i=0;i<parent.options.length;i++){if (parent.options[i].selected)sel=i;var label=parent.options[i].innerHTML;var val=parent.options[i].getAttribute("value");if ((typeof(val)=="undefined")||(val===null)) val=label;x[i]={value:val,text:label,img_src:parent.options[i].getAttribute("img_src")};}
 if(x.length)w.addOption(x);parent.parentNode.removeChild(parent);if (sel>=0){w._skipFocus = true;w.selectOption(sel,null,true);}
 if (parent.onchange)w.attachEvent("onChange",parent.onchange);if(parent.style.direction=="rtl" && w.setRTL)w.setRTL(true);return w;}
var dhtmlXCombo_optionTypes = [];function dhtmlXCombo(parent,name,width,optionType,tabIndex){if (typeof(parent)=="string")
 parent=document.getElementById(parent);this.dhx_Event();this.optionType = (optionType != window.undefined && dhtmlXCombo_optionTypes[optionType]) ? optionType : 'default';this._optionObject = dhtmlXCombo_optionTypes[this.optionType];this._disabled = false;this.readonlyDelay = 750;this.filterEntities = ["[","]","{","}","(",")","+","*","\\","?",".","$","^"];if (!window.dhx_glbSelectAr){window.dhx_glbSelectAr=new Array();window.dhx_openedSelect=null;window.dhx_SelectId=1;dhtmlxEvent(document.body,"click",this.closeAll);dhtmlxEvent(document.body,"keydown",function(e){try {if ((e||event).keyCode==9) window.dhx_glbSelectAr[0].closeAll();}catch(e) {}return true;});}
 
 if (parent.tagName=="SELECT")return dhtmlXComboFromSelect(parent);else
 this._createSelf(parent,name,width,tabIndex);dhx_glbSelectAr.push(this);}
 dhtmlXCombo.prototype.setSize = function(new_size){this.DOMlist.style.width=new_size+"px";if (this.DOMlistF)this.DOMlistF.style.width=new_size+"px";this.DOMelem.style.width=new_size+"px";this.DOMelem_input.style.width = Math.max(0,(new_size-19))+'px';}

 dhtmlXCombo.prototype.enableFilteringMode = function(mode,url,cache,autosubload){if(mode=="between"){this._filter= true;this._anyPosition = true;this._autoDisabled = true;}
 else
 this._filter=convertStringToBoolean(mode);if (url){this._xml=url;this._autoxml=convertStringToBoolean(autosubload);}
 if (convertStringToBoolean(cache)) this._xmlCache=[];}
 
 dhtmlXCombo.prototype.setFilteringParam=function(name,value){if (!this._prs)this._prs=[];this._prs.push([name,value]);}
 dhtmlXCombo.prototype.disable = function(mode){var z=convertStringToBoolean(mode);if (this._disabled==z)return;this.DOMelem_input.disabled=z;this._disabled=z;}
 dhtmlXCombo.prototype.readonly = function(mode,autosearch){this.DOMelem_input.readOnly=mode ? true : false;if(autosearch===false || mode===false){this.DOMelem.onkeyup=function(ev){}
 }else {var that = this;this.DOMelem.onkeyup=function(ev){ev=ev||window.event;if(that._searchTimeout)window.clearTimeout(that._searchTimeout);if (ev.keyCode!=9)ev.cancelBubble=true;if((ev.keyCode >= 48 && ev.keyCode <= 57)||(ev.keyCode >= 65 && ev.keyCode <= 90)){if (!that._searchText)that._searchText="";that._searchText += String.fromCharCode(ev.keyCode);for(var i=0;i<that.optionsArr.length;i++){var text = that.optionsArr[i].text;if(text.toString().toUpperCase().indexOf(that._searchText) == 0){that.selectOption(i);break;}
 }
 that._searchTimeout=window.setTimeout(function() {that._searchText="";}, that.readonlyDelay);ev.cancelBubble=true;}
 }
 }
 }
 

 dhtmlXCombo.prototype.getOption = function(value)
 {for(var i=0;i<this.optionsArr.length;i++)if(this.optionsArr[i].value==value)return this.optionsArr[i];return null;}
 dhtmlXCombo.prototype.getOptionByLabel = function(value)
 {for(var i=0;i<this.optionsArr.length;i++)if(this.optionsArr[i].text==value || this.optionsArr[i]._ctext==value)return this.optionsArr[i];return null;}
 dhtmlXCombo.prototype.getOptionByIndex = function(ind){return this.optionsArr[ind];}
 dhtmlXCombo.prototype.clearAll = function(all)
 {if (all)this.setComboText("");this.optionsArr=new Array();this.redrawOptions();if (all){if(this._selOption)this._selOption.RedrawHeader(this,true);this._confirmSelection();}
 }
 dhtmlXCombo.prototype.deleteOption = function(value)
 {var ind=this.getIndexByValue(value);if(ind<0)return;if (this.optionsArr[ind]==this._selOption)this._selOption=null;this.optionsArr.splice(ind, 1);this.redrawOptions();}
 dhtmlXCombo.prototype.render=function(mode){this._skiprender=(!convertStringToBoolean(mode));this.redrawOptions();}
 dhtmlXCombo.prototype.updateOption = function(oldvalue, avalue, atext, acss)
 {var dOpt=this.getOption(oldvalue);if (typeof(avalue)!="object") avalue={text:atext,value:avalue,css:acss};dOpt.setValue(avalue);this.redrawOptions();}
 dhtmlXCombo.prototype.addOption = function(options)
 {if (!arguments[0].length || typeof(arguments[0])!="object")
 args = [arguments];else
 args = options;this.render(false);for (var i=0;i<args.length;i++){var attr = args[i];if (attr.length){attr.value = attr[0]||"";attr.text = attr[1]||"";attr.css = attr[2]||"";}
 this._addOption(attr);}
 this.render(true);}
 dhtmlXCombo.prototype._addOption = function(attr)
 {dOpt = new this._optionObject();this.optionsArr.push(dOpt);dOpt.setValue.apply(dOpt,[attr]);this.redrawOptions();}
 dhtmlXCombo.prototype.getIndexByValue = function(val){for(var i=0;i<this.optionsArr.length;i++)if(this.optionsArr[i].value == val)return i;return -1;}
 dhtmlXCombo.prototype.getSelectedValue = function(){return (this._selOption?this._selOption.value:null);}
 dhtmlXCombo.prototype.getComboText = function(){return this.DOMelem_input.value;}
 dhtmlXCombo.prototype.setComboText = function(text){this.DOMelem_input.value=text;}
 

 dhtmlXCombo.prototype.setComboValue = function(text){this.setComboText(text);for(var i=0;i<this.optionsArr.length;i++)if (this.optionsArr[i].data()[0]==text){this._skipFocus = true;return this.selectOption(i,null,true);}
 this.DOMelem_hidden_input.value=text;}
 dhtmlXCombo.prototype.getActualValue = function(){return this.DOMelem_hidden_input.value;}
 dhtmlXCombo.prototype.getSelectedText = function(){return (this._selOption?this._selOption.text:"");}
 dhtmlXCombo.prototype.getSelectedIndex = function(){for(var i=0;i<this.optionsArr.length;i++)if(this.optionsArr[i] == this._selOption)return i;return -1;}
 dhtmlXCombo.prototype.setName = function(name){this.DOMelem_hidden_input.name = name;this.DOMelem_hidden_input2 = name.replace(/(\]?)$/, "_new_value$1");this.name = name;}
 dhtmlXCombo.prototype.show = function(mode){if (convertStringToBoolean(mode))
 this.DOMelem.style.display = "";else
 this.DOMelem.style.display = "none";}
 dhtmlXCombo.prototype.destructor = function()
 {this.DOMParent.removeChild(this.DOMelem);this.DOMlist.parentNode.removeChild(this.DOMlist);if(this.DOMlistF)this.DOMlistF.parentNode.removeChild(this.DOMlistF);var s=dhx_glbSelectAr;this.DOMParent=this.DOMlist=this.DOMlistF=this.DOMelem=0;this.DOMlist.combo=this.DOMelem.combo=0;for(var i=0;i<s.length;i++){if(s[i] == this){s[i] = null;s.splice(i,1);return;}
 }
 }
 dhtmlXCombo.prototype._createSelf = function(selParent, name, width, tab)
 {if (width.toString().indexOf("%")!=-1){var self = this;var resWidht=parseInt(width)/100;window.setInterval(function(){if (!selParent.parentNode)return;var ts=selParent.parentNode.offsetWidth*resWidht-2;if (ts<0)return;if (ts==self._lastTs)return;self.setSize(self._lastTs=ts);},500);var width=parseInt(selParent.offsetWidth);}
 var width=parseInt(width||100);this.ListPosition = "Bottom";this.DOMParent = selParent;this._inID = null;this.name = name;this._selOption = null;this.optionsArr = Array();var opt = new this._optionObject();opt.DrawHeader(this,name, width,tab);this.DOMlist = document.createElement("DIV");this.DOMlist.className = 'dhx_combo_list '+(dhtmlx.skin?dhtmlx.skin+"_list":"");this.DOMlist.style.width=width-(_isIE?0:0)+"px";if (_isOpera || _isKHTML )this.DOMlist.style.overflow="auto";this.DOMlist.style.display = "none";document.body.insertBefore(this.DOMlist,document.body.firstChild);if (_isIE){this.DOMlistF = document.createElement("IFRAME");this.DOMlistF.style.border="0px";this.DOMlistF.className = 'dhx_combo_list';this.DOMlistF.style.width=width-(_isIE?0:0)+"px";this.DOMlistF.style.display = "none";this.DOMlistF.src="javascript:false;";document.body.insertBefore(this.DOMlistF,document.body.firstChild);}
 this.DOMlist.combo=this.DOMelem.combo=this;this.DOMelem_input.onkeydown = this._onKey;this.DOMelem_input.onkeypress = this._onKeyF;this.DOMelem_input.onblur = this._onBlur;this.DOMelem.onclick = this._toggleSelect;this.DOMlist.onclick = this._selectOption;this.DOMlist.onmousedown = function(){this._skipBlur=true;}
 
 this.DOMlist.onkeydown = function(e){(e||event).cancelBubble=true;this.combo.DOMelem_input.onkeydown(e)
 }
 this.DOMlist.onmouseover = this._listOver;}
 dhtmlXCombo.prototype._listOver = function(e)
 {e = e||event;e.cancelBubble = true;var node = (_isIE?event.srcElement:e.target);var that = this.combo;if ( node.parentNode == that.DOMlist ){if(that._selOption)that._selOption.deselect();if(that._tempSel)that._tempSel.deselect();var i=0;for (i;i<that.DOMlist.childNodes.length;i++){if (that.DOMlist.childNodes[i]==node)break;}
 var z=that.optionsArr[i];that._tempSel=z;that._tempSel.select();if ((that._autoxml)&&((i+1)==that._lastLength)){that._fetchOptions(i+1,that._lasttext||"");}
 }
 }
 dhtmlXCombo.prototype._positList = function()
 {var pos=this.getPosition(this.DOMelem);if(this.ListPosition == 'Bottom'){this.DOMlist.style.top = pos[1]+this.DOMelem.offsetHeight-1+"px";this.DOMlist.style.left = pos[0]+"px";}
 else if(this.ListPosition == 'Top'){this.DOMlist.style.top = pos[1] - this.DOMlist.offsetHeight+"px";this.DOMlist.style.left = pos[0]+"px";}
 else{this.DOMlist.style.top = pos[1]+"px";this.DOMlist.style.left = pos[0]+this.DOMelem.offsetWidth+"px";}
 }
 
 dhtmlXCombo.prototype.getPosition = function(oNode,pNode){if (_isIE && _isIE<8){if(!pNode)pNode = document.body;var oCurrentNode=oNode;var iLeft=0;var iTop=0;while ((oCurrentNode)&&(oCurrentNode!=pNode)){iLeft+=oCurrentNode.offsetLeft-oCurrentNode.scrollLeft+oCurrentNode.clientLeft;iTop+=oCurrentNode.offsetTop-oCurrentNode.scrollTop+oCurrentNode.clientTop;oCurrentNode=oCurrentNode.offsetParent;}
 if (document.documentElement.scrollTop){iTop+=document.documentElement.scrollTop;}
 if (document.documentElement.scrollLeft){iLeft+=document.documentElement.scrollLeft;}
 return new Array(iLeft,iTop);}
 var pos = getOffset(oNode);return [pos.left, pos.top];}
 dhtmlXCombo.prototype._correctSelection = function(){if (this.getComboText()!="")
 for (var i=0;i<this.optionsArr.length;i++)if (!this.optionsArr[i].isHidden()){return this.selectOption(i,true,false);}
 this.unSelectOption();}
 dhtmlXCombo.prototype.selectNext = function(step){var z=this.getSelectedIndex()+step;while (this.optionsArr[z]){if (!this.optionsArr[z].isHidden())
 return this.selectOption(z,false,false);z+=step;}
 }
 dhtmlXCombo.prototype._onKeyF = function(e){var that=this.parentNode.combo;var ev=e||event;ev.cancelBubble=true;if (ev.keyCode=="13" || ev.keyCode=="9" ){that._confirmSelection();that.closeAll();}else
 if (ev.keyCode=="27" ){that._resetSelection();that.closeAll();}else that._activeMode=true;if (ev.keyCode=="13" || ev.keyCode=="27" ){that.callEvent("onKeyPressed",[ev.keyCode])
 return false;}
 return true;}
 dhtmlXCombo.prototype._onKey = function(e){var that=this.parentNode.combo;(e||event).cancelBubble=true;var ev=(e||event).keyCode;if (ev>15 && ev<19)return true;if (ev==27)return true;if ((that.DOMlist.style.display!="block")&&(ev!="13")&&(ev!="9")&&((!that._filter)||(that._filterAny)))
 that.DOMelem.onclick(e||event);if ((ev!="13")&&(ev!="9")){window.setTimeout(function(){that._onKeyB(ev);},1);if (ev=="40" || ev=="38")return false;}
 else if (ev==9){that._confirmSelection();that.closeAll();(e||event).cancelBubble=false;}
 }
 dhtmlXCombo.prototype._onKeyB = function(ev)
 {if (ev=="40"){var z=this.selectNext(1);}else if (ev=="38"){this.selectNext(-1);}else{this.callEvent("onKeyPressed",[ev])
 if (this._filter)return this.filterSelf((ev==8)||(ev==46));for(var i=0;i<this.optionsArr.length;i++)if (this.optionsArr[i].data()[1]==this.DOMelem_input.value){this.selectOption(i,false,false);return false;}
 this.unSelectOption();}
 return true;}
 dhtmlXCombo.prototype._onBlur = function()
 {var self = this.parentNode._self;window.setTimeout(function(){if (self.DOMlist._skipBlur)return !(self.DOMlist._skipBlur=false);self._skipFocus = true;self._confirmSelection();self.callEvent("onBlur",[]);},100)
 
 }
 dhtmlXCombo.prototype.redrawOptions = function(){if (this._skiprender)return;for(var i=this.DOMlist.childNodes.length-1;i>=0;i--)this.DOMlist.removeChild(this.DOMlist.childNodes[i]);for(var i=0;i<this.optionsArr.length;i++)this.DOMlist.appendChild(this.optionsArr[i].render());}
 dhtmlXCombo.prototype.loadXML = function(url,afterCall){this._load=true;this.callEvent("onXLS",[]);if (this._prs)for (var i=0;i<this._prs.length;i++)url+=[getUrlSymbol(url),escape(this._prs[i][0]),"=",escape(this._prs[i][1])].join("");if ((this._xmlCache)&&(this._xmlCache[url])){this._fillFromXML(this,null,null,null,this._xmlCache[url]);if (afterCall)afterCall();}
 else{var xml=(new dtmlXMLLoaderObject(this._fillFromXML,this,true,true));if (afterCall)xml.waitCall=afterCall;xml._cPath=url;xml.loadXML(url);}
 }
 dhtmlXCombo.prototype.loadXMLString = function(astring){var xml=(new dtmlXMLLoaderObject(this._fillFromXML,this,true,true));xml.loadXMLString(astring);}
 dhtmlXCombo.prototype._fillFromXML = function(obj,b,c,d,xml){if (obj._xmlCache)obj._xmlCache[xml._cPath]=xml;var toptag=xml.getXMLTopNode("complete");if (toptag.tagName!="complete"){obj._load=false;return;}
 var top=xml.doXPath("//complete");var options=xml.doXPath("//option");var add = false;if ((!top[0])||(!top[0].getAttribute("add"))){obj.clearAll();obj._lastLength=options.length;if (obj._xml){if ((!options)|| (!options.length)) 
 obj.closeAll();else {if (obj._activeMode){obj._positList();obj.DOMlist.style.display="block";if (_isIE)obj._IEFix(true);}
 }}
 }else {obj._lastLength+=options.length||Infinity;add = true;}
 for (var i=0;i<options.length;i++){var attr = new Object();attr.text = options[i].firstChild?options[i].firstChild.nodeValue:"";for (var j=0;j<options[i].attributes.length;j++){var a = options[i].attributes[j];if (a)attr[a.nodeName] = a.nodeValue;}
 obj._addOption(attr);}
 obj.render(add!=true || (!!options.length));if ((obj._load)&&(obj._load!==true))
 obj.loadXML(obj._load);else{obj._load=false;if ((!obj._lkmode)&&(obj._filter)&&!obj._autoDisabled) {obj._correctSelection();}
 }
 var selected=xml.doXPath("//option[@selected]");if (selected.length){obj._skipFocus = true;obj.selectOption(obj.getIndexByValue(selected[0].getAttribute("value")),false,true);}
 obj.callEvent("onXLE",[]);}
 dhtmlXCombo.prototype.unSelectOption = function(){if (this._selOption)this._selOption.deselect();if(this._tempSel)this._tempSel.deselect();this._tempSel=this._selOption=null;}
 

 dhtmlXCombo.prototype.confirmValue = function(){this._confirmSelection();}
 
 
 dhtmlXCombo.prototype._confirmSelection = function(data,status){var text = this.getComboText();this.setComboText("");this.setComboText(text);if(arguments.length==0){var z=this.getOptionByLabel(this.DOMelem_input.value);data = z?z.value:this.DOMelem_input.value;status = (z==null);if (data==this.getActualValue()) return this._skipFocus = false;}
 if(!this._skipFocus&&!this._disabled){try{this.DOMelem_input.focus();}
 catch(err){};}
 this._skipFocus = false;this.DOMelem_hidden_input.value=data;this.DOMelem_hidden_input2.value = (status?"true":"false");this.callEvent("onChange",[]);this._activeMode=false;}
 dhtmlXCombo.prototype._resetSelection = function(data,status){var z=this.getOption(this.DOMelem_hidden_input.value);this.setComboValue(z?z.data()[0]:this.DOMelem_hidden_input.value)
 this.setComboText(z?z.data()[1]:this.DOMelem_hidden_input.value)
 }
 

 dhtmlXCombo.prototype.selectOption = function(ind,filter,conf){if (arguments.length<3)conf=true;this.unSelectOption();var z=this.optionsArr[ind];if (!z)return;this._selOption=z;this._selOption.select();var corr=this._selOption.content.offsetTop+this._selOption.content.offsetHeight-this.DOMlist.scrollTop-this.DOMlist.offsetHeight;if (corr>0)this.DOMlist.scrollTop+=corr;corr=this.DOMlist.scrollTop-this._selOption.content.offsetTop;if (corr>0)this.DOMlist.scrollTop-=corr;var data=this._selOption.data();if (conf){this.setComboText(data[1]);this._confirmSelection(data[0],false);}
 if ((this._autoxml)&&((ind+1)==this._lastLength))
 this._fetchOptions(ind+1,this._lasttext||"");if (filter){var text=this.getComboText();if (text!=data[1]){this.setComboText(data[1]);dhtmlXRange(this.DOMelem_input,text.length+1,data[1].length);}
 }
 else
 this.setComboText(data[1]);this._selOption.RedrawHeader(this);this.callEvent("onSelectionChange",[]);}
 dhtmlXCombo.prototype._selectOption = function(e)
 {(e||event).cancelBubble = true;var node=(_isIE?event.srcElement:e.target);var that=this.combo;while (!node._self){node = node.parentNode;if (!node)return;}
 var i=0;for (i;i<that.DOMlist.childNodes.length;i++){if (that.DOMlist.childNodes[i]==node)break;}
 that.selectOption(i,false,true);that.closeAll();that.callEvent("onBlur",[])
 that._activeMode=false;}
 dhtmlXCombo.prototype.openSelect = function(){if (this._disabled)return;this.closeAll();this.DOMlist.style.display="block";this._positList();this.callEvent("onOpen",[]);if(this._tempSel)this._tempSel.deselect();if(this._selOption)this._selOption.select();if(this._selOption){var corr=this._selOption.content.offsetTop+this._selOption.content.offsetHeight-this.DOMlist.scrollTop-this.DOMlist.offsetHeight;if (corr>0)this.DOMlist.scrollTop+=corr;corr=this.DOMlist.scrollTop-this._selOption.content.offsetTop;if (corr>0)this.DOMlist.scrollTop-=corr;}
 
 
 
 if (_isIE)this._IEFix(true);this.DOMelem_input.focus();if (this._filter)this.filterSelf();}
 dhtmlXCombo.prototype._toggleSelect = function(e)
 {var that=this.combo;if ( that.DOMlist.style.display == "block" ){that.closeAll();}else {that.openSelect();}
 (e||event).cancelBubble = true;}
 dhtmlXCombo.prototype._fetchOptions=function(ind,text){if (text==""){this.closeAll();return this.clearAll();}
 var url=this._xml+((this._xml.indexOf("?")!=-1)?"&":"?")+"pos="+ind+"&mask="+encodeURIComponent(text);this._lasttext=text;if (this._load)this._load=url;else {if (!this.callEvent("onDynXLS",[text,ind])) return;this.loadXML(url);}
 };dhtmlXCombo.prototype.disableAutocomplete = function()
 {this._autoDisabled = true;};dhtmlXCombo.prototype.filterSelf = function(mode)
 {var text=this.getComboText();if (this._xml){this._lkmode=mode;this._fetchOptions(0,text);}
 var escapeExp = new RegExp("(["+this.filterEntities.join("\\")+"])","g");text = text.replace(escapeExp,"\\$1");var filterExp = (this._anyPosition?"":"^")+text;var filter=new RegExp(filterExp,"i");this.filterAny=false;for(var i=0;i<this.optionsArr.length;i++){var z=filter.test(this.optionsArr[i].content?this.optionsArr[i].data()[1]:this.optionsArr[i].text);this.filterAny|=z;var _safariFix = (typeof z);this.optionsArr[i].hide(!z);}
 if (!this.filterAny){this.closeAll();this._activeMode=true;}
 else {if (this.DOMlist.style.display!="block")this.openSelect();if (_isIE)this._IEFix(true);}
 
 if (!mode&&!this._autoDisabled){this._correctSelection();}
 else this.unSelectOption();}
 
 



 dhtmlXCombo.prototype._IEFix = function(mode){this.DOMlistF.style.display=(mode?"block":"none");this.DOMlistF.style.top=this.DOMlist.style.top;this.DOMlistF.style.left=this.DOMlist.style.left;this.DOMlistF.style.width=this.DOMlist.offsetWidth+"px";this.DOMlistF.style.height=this.DOMlist.offsetHeight+"px";};dhtmlXCombo.prototype.closeAll = function()
 {if(window.dhx_glbSelectAr)for (var i=0;i<dhx_glbSelectAr.length;i++){if (dhx_glbSelectAr[i].DOMlist.style.display=="block"){dhx_glbSelectAr[i].DOMlist.style.display = "none";if (_isIE)dhx_glbSelectAr[i]._IEFix(false);}
 dhx_glbSelectAr[i]._activeMode=false;}
 }
 dhtmlXCombo.prototype.changeOptionId = function(oldId,newId){(this.getOption(oldId)||{}).value = newId;};function dhtmlXRange(InputId, Start, End)
{var Input = typeof(InputId)=='object' ? InputId : document.getElementById(InputId);try{Input.focus();}catch(e){};var Length = Input.value.length;Start--;if (Start < 0 || Start > End || Start > Length)Start = 0;if (End > Length)End = Length;if (Start==End)return;if (Input.setSelectionRange){Input.setSelectionRange(Start, End);}else if (Input.createTextRange){var range = Input.createTextRange();range.moveStart('character', Start);range.moveEnd('character', End-Length);try{range.select();}
 catch(e){}
 }
}
 dhtmlXCombo_defaultOption = function(){this.init();}
 dhtmlXCombo_defaultOption.prototype.init = function(){this.value = null;this.text = "";this.selected = false;this.css = "";}
 dhtmlXCombo_defaultOption.prototype.select = function(){if (this.content){this.content.className="dhx_selected_option"+(dhtmlx.skin?" combo_"+dhtmlx.skin+"_sel":"");}
 }
 dhtmlXCombo_defaultOption.prototype.hide = function(mode){this.render().style.display=mode?"none":"";}
 dhtmlXCombo_defaultOption.prototype.isHidden = function(){return (this.render().style.display=="none");}
 dhtmlXCombo_defaultOption.prototype.deselect = function(){if (this.content)this.render();this.content.className="";}
dhtmlXCombo_defaultOption.prototype.setValue = function(attr){this.value = attr.value||"";this.text = attr.text||"";this.css = attr.css||"";this.content=null;}
 

 dhtmlXCombo_defaultOption.prototype.render = function(){if (!this.content){this.content=document.createElement("DIV");this.content._self = this;this.content.style.cssText='width:100%;overflow:hidden;'+this.css;if (_isOpera || _isKHTML )this.content.style.padding="2px 0px 2px 0px";this.content.innerHTML=this.text;this._ctext=(typeof this.content.textContent!="undefined")?this.content.textContent:this.content.innerText;}
 return this.content;}
 dhtmlXCombo_defaultOption.prototype.data = function(){if (this.content)return [this.value,this._ctext ? this._ctext : this.text];}
dhtmlXCombo_defaultOption.prototype.DrawHeader = function(self, name, width, tab)
{var z=document.createElement("DIV");z.style.width = width+"px";z.className = 'dhx_combo_box '+(dhtmlx.skin||"");z._self = self;self.DOMelem = z;this._DrawHeaderInput(self, name, width,tab);this._DrawHeaderButton(self, name, width);self.DOMParent.appendChild(self.DOMelem);}
dhtmlXCombo_defaultOption.prototype._DrawHeaderInput = function(self, name, width,tab)
{var z=document.createElement('input');z.setAttribute("autocomplete","off");z.type = 'text';z.className = 'dhx_combo_input';if (tab)z.tabIndex=tab;z.style.width = width-19-(document.compatMode=="BackCompat"?0:3)+'px';self.DOMelem.appendChild(z);self.DOMelem_input = z;z = document.createElement('input');z.type = 'hidden';z.name = name;self.DOMelem.appendChild(z);self.DOMelem_hidden_input = z;z = document.createElement('input');z.type = 'hidden';z.name = (name||"").replace(/(\]?)$/, "_new_value$1");z.value="true";self.DOMelem.appendChild(z);self.DOMelem_hidden_input2 = z;}
dhtmlXCombo_defaultOption.prototype._DrawHeaderButton = function(self, name, width)
{var z=document.createElement('img');z.className = 'dhx_combo_img';if(dhtmlx.image_path)dhx_globalImgPath = dhtmlx.image_path;z.src = (window.dhx_globalImgPath?dhx_globalImgPath:"")+'combo_select'+(dhtmlx.skin?"_"+dhtmlx.skin:"")+'.gif';self.DOMelem.appendChild(z);self.DOMelem_button=z;}
dhtmlXCombo_defaultOption.prototype.RedrawHeader = function(self)
{}
dhtmlXCombo_optionTypes['default'] = dhtmlXCombo_defaultOption;dhtmlXCombo.prototype.dhx_Event=function()
{this.dhx_SeverCatcherPath="";this.attachEvent = function(original, catcher, CallObj)
 {CallObj = CallObj||this;original = 'ev_'+original;if ( ( !this[original] )|| ( !this[original].addEvent ) ) {var z = new this.eventCatcher(CallObj);z.addEvent( this[original] );this[original] = z;}
 return ( original + ':' + this[original].addEvent(catcher) );}
 this.callEvent=function(name,arg0){if (this["ev_"+name])return this["ev_"+name].apply(this,arg0);return true;}
 this.checkEvent=function(name){if (this["ev_"+name])return true;return false;}
 this.eventCatcher = function(obj)
 {var dhx_catch = new Array();var m_obj = obj;var func_server = function(catcher,rpc)
 {catcher = catcher.split(":");var postVar="";var postVar2="";var target=catcher[1];if (catcher[1]=="rpc"){postVar='<?xml version="1.0"?><methodCall><methodName>'+catcher[2]+'</methodName><params>';postVar2="</params></methodCall>";target=rpc;}
 var z = function() {}
 return z;}
 var z = function()
 {if (dhx_catch)var res=true;for (var i=0;i<dhx_catch.length;i++){if (dhx_catch[i] != null){var zr = dhx_catch[i].apply( m_obj, arguments );res = res && zr;}
 }
 return res;}
 z.addEvent = function(ev)
 {if ( typeof(ev)!= "function" )
 if (ev && ev.indexOf && ev.indexOf("server:")== 0)
 ev = new func_server(ev,m_obj.rpcServer);else
 ev = eval(ev);if (ev)return dhx_catch.push( ev ) - 1;return false;}
 z.removeEvent = function(id)
 {dhx_catch[id] = null;}
 return z;}
 this.detachEvent = function(id)
 {if (id != false){var list = id.split(':');this[ list[0] ].removeEvent( list[1] );}
 }
};(function(){dhtmlx.extend_api("dhtmlXCombo",{_init:function(obj){if (obj.image_path)dhx_globalImgPath=obj.image_path;return [obj.parent, obj.name, (obj.width||"100%"), obj.type, obj.index ];},
 filter:"filter_command",
 auto_height:"enableOptionAutoHeight",
 auto_position:"enableOptionAutoPositioning",
 auto_width:"enableOptionAutoWidth",
 xml:"loadXML",
 readonly:"readonly",
 items:"addOption"
 },{filter_command:function(data){if (typeof data == "string")this.enableFilteringMode(true,data);else
 this.enableFilteringMode(data);}
 });})();window.dhx||(dhx={});dhx.version="3.0";dhx.codebase="./";dhx.name="Core";dhx.clone=function(a){var b=dhx.clone.xa;b.prototype=a;return new b};dhx.clone.xa=function(){};dhx.extend=function(a,b,c){if(a.q)return dhx.PowerArray.insertAt.call(a.q,b,1),a;for(var d in b)if(!a[d]||c)a[d]=b[d];b.defaults&&dhx.extend(a.defaults,b.defaults);b.$init&&b.$init.call(a);return a};dhx.copy=function(a){if(arguments.length>1)var b=arguments[0],a=arguments[1];else b=dhx.isArray(a)?[]:{};for(var c in a)a[c]&&typeof a[c]=="object"&&!dhx.isDate(a[c])?(b[c]=dhx.isArray(a[c])?[]:{},dhx.copy(b[c],a[c])):b[c]=a[c];return b};dhx.single=function(a){var b=null,c=function(c){b||(b=new a({}));b.Ia&&b.Ia.apply(b,arguments);return b};return c};dhx.protoUI=function(){var a=arguments,b=a[0].name,c=function(a){if(!c)return dhx.ui[b].prototype;var e=c.q;if(e){for(var f=[e[0]],g=1;g<e.length;g++)f[g]=e[g],f[g].q&&(f[g]=f[g].call(dhx,f[g].name)),f[g].prototype&&f[g].prototype.name&&(dhx.ui[f[g].prototype.name]=f[g]);dhx.ui[b]=dhx.proto.apply(dhx,f);if(c.r)for(g=0;g<c.r.length;g++)dhx.Type(dhx.ui[b],c.r[g]);c=e=null}return this!=dhx?new dhx.ui[b](a):dhx.ui[b]};c.q=Array.prototype.slice.call(arguments,0);return dhx.ui[b]=c};dhx.proto=function(){for(var a=arguments,b=a[0],c=!!b.$init,d=[],e=a.length-1;e>0;e--){if(typeof a[e]=="function")a[e]=a[e].prototype;a[e].$init&&d.push(a[e].$init);if(a[e].defaults){var f=a[e].defaults;if(!b.defaults)b.defaults={};for(var g in f)dhx.isUndefined(b.defaults[g])&&(b.defaults[g]=f[g])}if(a[e].type&&b.type)for(g in a[e].type)b.type[g]||(b.type[g]=a[e].type[g]);for(var h in a[e])b[h]||(b[h]=a[e][h])}c&&d.push(b.$init);b.$init=function(){for(var a=0;a<d.length;a++)d[a].apply(this,arguments)};var i=function(a){this.$ready=[];this.$init(a);this.$&&this.$(a,this.defaults);for(var b=0;b<this.$ready.length;b++)this.$ready[b].call(this)};i.prototype=b;b=a=null;return i};dhx.bind=function(a,b){return function(){return a.apply(b,arguments)}};dhx.require=function(a,b,c,d,e){if(typeof a!="string"){var f=a.length||0,g=b;if(f)b=function(){if(f)f--,dhx.require(a[a.length-f-1],b,c);else return g.apply(this,arguments)},b();else{for(var h in a)f++;b=function(){f--;f===0&&g.apply(this,arguments)};for(h in a)dhx.require(h,b,c)}}else if(dhx.i[a]!==!0)if(a.substr(-4)==".css"){var i=dhx.html.create("LINK",{type:"text/css",rel:"stylesheet",href:dhx.codebase+a});document.head.appendChild(i);b&&b.call(c||window)}else{var j=e;b?dhx.i[a]?dhx.i[a].push([b,
c]):(dhx.i[a]=[[b,c]],dhx.ajax(dhx.codebase+a,function(b){dhx.exec(b);var c=dhx.i[a];dhx.i[a]=!0;for(var d=0;d<c.length;d++)c[d][0].call(c[d][1]||window,!d)})):(dhx.exec(dhx.ajax().sync().get(dhx.codebase+a).responseText),dhx.i[a]=!0)}};dhx.i={};dhx.exec=function(a){window.execScript?window.execScript(a):window.eval(a)};dhx.wrap=function(a,b){return!a?b:function(){var c=a.apply(this,arguments);b.apply(this,arguments);return c}};dhx.isUndefined=function(a){return typeof a=="undefined"};dhx.delay=function(a,b,c,d){return window.setTimeout(function(){var d=a.apply(b,c||[]);a=b=c=null;return d},d||1)};dhx.uid=function(){if(!this.R)this.R=(new Date).valueOf();this.R++;return this.R};dhx.toNode=function(a){return typeof a=="string"?document.getElementById(a):a};dhx.toArray=function(a){return dhx.extend(a||[],dhx.PowerArray,!0)};dhx.toFunctor=function(a){return typeof a=="string"?eval(a):a};dhx.isArray=function(a){return Array.isArray?Array.isArray(a):Object.prototype.toString.call(a)==="[object Array]"};dhx.isDate=function(a){return a instanceof Date};dhx.L={};dhx.event=function(a,b,c,d){var a=dhx.toNode(a),e=dhx.uid();d&&(c=dhx.bind(c,d));dhx.L[e]=[a,b,c];a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent&&a.attachEvent("on"+b,c);return e};dhx.eventRemove=function(a){if(a){var b=dhx.L[a];b[0].removeEventListener?b[0].removeEventListener(b[1],b[2],!1):b[0].detachEvent&&b[0].detachEvent("on"+b[1],b[2]);delete this.L[a]}};dhx.EventSystem={$init:function(){if(!this.e)this.e={},this.s={},this.M={}},blockEvent:function(){this.e.T=!0},unblockEvent:function(){this.e.T=!1},mapEvent:function(a){dhx.extend(this.M,a,!0)},on_setter:function(a){if(a)for(var b in a)typeof a[b]=="function"&&this.attachEvent(b,a[b])},callEvent:function(a,b){if(this.e.T)return!0;var a=a.toLowerCase(),c=this.e[a.toLowerCase()],d=!0;if(c)for(var e=0;e<c.length;e++)if(c[e].apply(this,b||[])===!1)d=!1;this.M[a]&&!this.M[a].callEvent(a,b)&&(d=!1);return d},
attachEvent:function(a,b,c){var a=a.toLowerCase(),c=c||dhx.uid(),b=dhx.toFunctor(b),d=this.e[a]||dhx.toArray();d.push(b);this.e[a]=d;this.s[c]={f:b,t:a};return c},detachEvent:function(a){if(this.s[a]){var b=this.s[a].t,c=this.s[a].f,d=this.e[b];d.remove(c);delete this.s[a]}},hasEvent:function(a){a=a.toLowerCase();return this.e[a]?!0:!1}};dhx.extend(dhx,dhx.EventSystem);dhx.PowerArray={removeAt:function(a,b){a>=0&&this.splice(a,b||1)},remove:function(a){this.removeAt(this.find(a))},insertAt:function(a,b){if(!b&&b!==0)this.push(a);else{var c=this.splice(b,this.length-b);this[b]=a;this.push.apply(this,c)}},find:function(a){for(var b=0;b<this.length;b++)if(a==this[b])return b;return-1},each:function(a,b){for(var c=0;c<this.length;c++)a.call(b||this,this[c])},map:function(a,b){for(var c=0;c<this.length;c++)this[c]=a.call(b||this,this[c]);return this},filter:function(a,
b){for(var c=0;c<this.length;c++)a.call(b||this,this[c])||(this.splice(c,1),c--);return this}};dhx.env={};(function(){if(navigator.userAgent.indexOf("Mobile")!=-1)dhx.env.mobile=!0;if(dhx.env.mobile||navigator.userAgent.indexOf("iPad")!=-1||navigator.userAgent.indexOf("Android")!=-1)dhx.env.touch=!0;navigator.userAgent.indexOf("Opera")!=-1?dhx.env.isOpera=!0:(dhx.env.isIE=!!document.all,dhx.env.isFF=!document.all,dhx.env.isWebKit=navigator.userAgent.indexOf("KHTML")!=-1,dhx.env.isSafari=dhx.env.isWebKit&&navigator.userAgent.indexOf("Mac")!=-1);if(navigator.userAgent.toLowerCase().indexOf("android")!=
-1)dhx.env.isAndroid=!0;dhx.env.transform=!1;dhx.env.transition=!1;for(var a={names:["transform","transition"],transform:["transform","WebkitTransform","MozTransform","OTransform","msTransform"],transition:["transition","WebkitTransition","MozTransition","OTransition","msTransition"]},b=document.createElement("DIV"),c=0;c<a.names.length;c++)for(var d=a[a.names[c]],e=0;e<d.length;e++)if(typeof b.style[d[e]]!="undefined"){dhx.env[a.names[c]]=d[e];break}b.style[dhx.env.transform]="translate3d(0,0,0)";dhx.env.translate=b.style[dhx.env.transform]?"translate3d":"translate";var f="",g=!1;dhx.env.isOpera&&(f="-o-",g="O");dhx.env.isFF&&(f="-Moz-");dhx.env.isWebKit&&(f="-webkit-");dhx.env.isIE&&(f="-ms-");dhx.env.transformCSSPrefix=f;dhx.env.transformPrefix=g||dhx.env.transformCSSPrefix.replace(/-/gi,"");dhx.env.transitionEnd=dhx.env.transformCSSPrefix=="-Moz-"?"transitionend":dhx.env.transformPrefix+"TransitionEnd"})();dhx.env.svg=function(){return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")}();dhx.html={v:0,denySelect:function(){if(!dhx.v)dhx.v=document.onselectstart;document.onselectstart=dhx.html.stopEvent},allowSelect:function(){if(dhx.v!==0)document.onselectstart=dhx.v||null;dhx.v=0},index:function(a){for(var b=0;a=a.previousSibling;)b++;return b},ga:{},createCss:function(a){var b="",c;for(c in a)b+=c+":"+a[c]+";";var d=this.ga[b];d||(d="s"+dhx.uid(),this.addStyle("."+d+"{"+b+"}"),this.ga[b]=d);return d},addStyle:function(a){var b=document.createElement("style");b.setAttribute("type",
"text/css");b.setAttribute("media","screen");b.styleSheet?b.styleSheet.cssText=a:b.appendChild(document.createTextNode(a));document.getElementsByTagName("head")[0].appendChild(b)},create:function(a,b,c){var b=b||{},d=document.createElement(a),e;for(e in b)d.setAttribute(e,b[e]);if(b.style)d.style.cssText=b.style;if(b["class"])d.className=b["class"];if(c)d.innerHTML=c;return d},getValue:function(a){a=dhx.toNode(a);return!a?"":dhx.isUndefined(a.value)?a.innerHTML:a.value},remove:function(a){if(a instanceof
Array)for(var b=0;b<a.length;b++)this.remove(a[b]);else a&&a.parentNode&&a.parentNode.removeChild(a)},insertBefore:function(a,b,c){a&&(b&&b.parentNode?b.parentNode.insertBefore(a,b):c.appendChild(a))},locate:function(a,b){if(a.tagName)var c=a;else a=a||event,c=a.target||a.srcElement;for(;c;){if(c.getAttribute){var d=c.getAttribute(b);if(d)return d}c=c.parentNode}return null},offset:function(a){if(a.getBoundingClientRect){var b=a.getBoundingClientRect(),c=document.body,d=document.documentElement,e=
window.pageYOffset||d.scrollTop||c.scrollTop,f=window.pageXOffset||d.scrollLeft||c.scrollLeft,g=d.clientTop||c.clientTop||0,h=d.clientLeft||c.clientLeft||0,i=b.top+e-g,j=b.left+f-h;return{y:Math.round(i),x:Math.round(j)}}else{for(j=i=0;a;)i+=parseInt(a.offsetTop,10),j+=parseInt(a.offsetLeft,10),a=a.offsetParent;return{y:i,x:j}}},posRelative:function(a){a=a||event;return dhx.isUndefined(a.offsetX)?{x:a.layerX,y:a.layerY}:{x:a.offsetX,y:a.offsetY}},pos:function(a){a=a||event;if(a.pageX||a.pageY)return{x:a.pageX,
y:a.pageY};var b=dhx.env.isIE&&document.compatMode!="BackCompat"?document.documentElement:document.body;return{x:a.clientX+b.scrollLeft-b.clientLeft,y:a.clientY+b.scrollTop-b.clientTop}},preventEvent:function(a){a&&a.preventDefault&&a.preventDefault();return dhx.html.stopEvent(a)},stopEvent:function(a){(a||event).cancelBubble=!0;return!1},addCss:function(a,b){a.className+=" "+b},removeCss:function(a,b){a.className=a.className.replace(RegExp(" "+b,"g"),"")}};dhx.ready=function(a){this.Ga?a.call():this.D.push(a)};dhx.D=[];(function(){var a=document.getElementsByTagName("SCRIPT");if(a.length)a=(a[a.length-1].getAttribute("src")||"").split("/"),a.splice(a.length-1,1),dhx.codebase=a.slice(0,a.length).join("/")+"/";dhx.event(window,"load",function(){dhx.callEvent("onReady",[]);dhx.delay(function(){dhx.Ga=!0;for(var a=0;a<dhx.D.length;a++)dhx.D[a].call();dhx.D=[]})})})();dhx.locale=dhx.locale||{};dhx.ready(function(){dhx.event(document.body,"click",function(a){dhx.callEvent("onClick",[a||event])})});(function(){var a={},b=RegExp("(\\r\\n|\\n)","g"),c=RegExp('(\\")',"g");dhx.Template=function(d){if(typeof d=="function")return d;if(a[d])return a[d];d=(d||"").toString();if(d.indexOf("->")!=-1)switch(d=d.split("->"),d[0]){case "html":d=dhx.html.getValue(d[1]);break;case "http":d=(new dhx.ajax).sync().get(d[1],{uid:dhx.uid()}).responseText}d=(d||"").toString();d=d.replace(b,"\\n");d=d.replace(c,'\\"');d=d.replace(/\{obj\.([^}?]+)\?([^:]*):([^}]*)\}/g,'"+(obj.$1?"$2":"$3")+"');d=d.replace(/\{common\.([^}\(]*)\}/g,
"\"+(common.$1||'')+\"");d=d.replace(/\{common\.([^\}\(]*)\(\)\}/g,'"+(common.$1?common.$1.apply(this, arguments):"")+"');d=d.replace(/\{obj\.([^}]*)\}/g,'"+(obj.$1)+"');d=d.replace("{obj}",'"+obj+"');d=d.replace(/#([^#'";, ]+)#/gi,'"+(obj.$1)+"');try{a[d]=Function("obj","common",'return "'+d+'";')}catch(e){}return a[d]};dhx.Template.empty=function(){return""};dhx.Template.bind=function(a){return dhx.bind(dhx.Template(a),this)};dhx.Type=function(a,b){if(a.q){if(!a.r)a.r=[];a.r.push(b)}else{if(typeof a==
"function")a=a.prototype;if(!a.types)a.types={"default":a.type},a.type.name="default";var c=b.name,g=a.type;c&&(g=a.types[c]=dhx.clone(b.baseType?a.types[b.baseType]:a.type));for(var h in b)g[h]=h.indexOf("template")===0?dhx.Template(b[h]):b[h];return c}}})();dhx.Settings={$init:function(){this.a=this.config={}},define:function(a,b){return typeof a=="object"?this.Q(a):this.U(a,b)},U:function(a,b){var c=this[a+"_setter"];return this.a[a]=c?c.call(this,b,a):b},Q:function(a){if(a)for(var b in a)this.U(b,a[b])},$:function(a,b){var c={};b&&(c=dhx.extend(c,b));typeof a=="object"&&!a.tagName&&dhx.extend(c,a,!0);this.Q(c)},Ba:function(a,b){for(var c in b)switch(typeof a[c]){case "object":a[c]=this.Ba(a[c]||{},b[c]);break;case "undefined":a[c]=b[c]}return a}};dhx.ajax=function(a,b,c){if(arguments.length!==0){var d=new dhx.ajax;if(c)d.master=c;return d.get(a,null,b)}return!this.getXHR?new dhx.ajax:this};dhx.ajax.count=0;dhx.ajax.prototype={master:null,getXHR:function(){return dhx.env.isIE?new ActiveXObject("Microsoft.xmlHTTP"):new XMLHttpRequest},send:function(a,b,c){var d=this.getXHR();dhx.isArray(c)||(c=[c]);if(typeof b=="object"){var e=[],f;for(f in b){var g=b[f];if(g===null||g===dhx.undefined)g="";e.push(f+"="+encodeURIComponent(g))}b=e.join("&")}b&&this.request==="GET"&&(a=a+(a.indexOf("?")!=-1?"&":"?")+b,b=null);d.open(this.request,a,!this.Na);this.request==="POST"&&d.setRequestHeader("Content-type","application/x-www-form-urlencoded");var h=this;d.onreadystatechange=function(){if(!d.readyState||d.readyState==4){dhx.ajax.count++;if(c&&h)for(var a=0;a<c.length;a++)if(c[a]){var b=c[a].success||c[a];if(d.status>=400||!d.status&&!d.responseText)b=c[a].error;b&&b.call(h.master||h,d.responseText,d.responseXML,d)}if(h)h.master=null;c=h=null}};d.send(b||null);return d},get:function(a,b,c){arguments.length==2&&(c=b,b=null);this.request="GET";return this.send(a,b,c)},post:function(a,b,c){this.request="POST";return this.send(a,b,c)},put:function(a,
b,c){this.request="PUT";return this.send(a,b,c)},del:function(a,b,c){this.request="DELETE";return this.send(a,b,c)},sync:function(){this.Na=!0;return this},bind:function(a){this.master=a;return this}};dhx.send=function(a,b,c,d){var e=dhx.html.create("FORM",{target:d||"_self",action:a,method:c||"POST"},""),f;for(f in b){var g=dhx.html.create("INPUT",{type:"hidden",name:f,value:b[f]},"");e.appendChild(g)}e.style.display="none";document.body.appendChild(e);e.submit();document.body.removeChild(e)};dhx.AtomDataLoader={$init:function(a){this.data={};if(a)this.a.datatype=a.datatype||"json",this.$ready.push(this.Aa)},Aa:function(){this.aa=!0;this.a.url&&this.url_setter(this.a.url);this.a.data&&this.data_setter(this.a.data)},url_setter:function(a){if(!this.aa)return a;this.load(a,this.a.datatype);return a},data_setter:function(a){if(!this.aa)return a;this.parse(a,this.a.datatype);return!0},load:function(a,b,c){if(a.$proxy)a.load(this,typeof b=="string"?b:"json");else{this.callEvent("onXLS",[]);if(typeof b=="string")this.data.driver=dhx.DataDriver[b],b=c;else if(!this.data.driver)this.data.driver=dhx.DataDriver.json;var d=[{success:this.P,error:this.C}];b&&(dhx.isArray(b)?d.push.apply(d,b):d.push(b));return dhx.ajax(a,d,this)}},parse:function(a,b){this.callEvent("onXLS",[]);this.data.driver=dhx.DataDriver[b||"json"];this.P(a,null)},P:function(a,b,c){var d=this.data.driver,e=d.toObject(a,b);if(e){var f=d.getRecords(e)[0];this.data=d?d.getDetails(f):a}else this.C(a,b,c);this.callEvent("onXLE",
[])},C:function(a,b,c){this.callEvent("onXLE",[]);this.callEvent("onLoadError",arguments);dhx.callEvent("onLoadError",[a,b,c,this])},z:function(a){if(!this.a.dataFeed||this.N||!a)return!0;var b=this.a.dataFeed;if(typeof b=="function")return b.call(this,a.id||a,a);b=b+(b.indexOf("?")==-1?"?":"&")+"action=get&id="+encodeURIComponent(a.id||a);this.callEvent("onXLS",[]);dhx.ajax(b,function(a,b,e){this.N=!0;var f=dhx.DataDriver.toObject(a,b);f?this.setValues(f.getDetails(f.getRecords()[0])):this.C(a,b,
e);this.N=!1;this.callEvent("onXLE",[])},this);return!1}};dhx.DataDriver={};dhx.DataDriver.json={toObject:function(a){a||(a="[]");if(typeof a=="string"){try{eval("dhx.temp="+a)}catch(b){return null}a=dhx.temp}if(a.data){var c=a.data.config={},d;for(d in a)d!="data"&&(c[d]=a[d]);a=a.data}return a},getRecords:function(a){return a&&!dhx.isArray(a)?[a]:a},getDetails:function(a){return typeof a=="string"?{id:dhx.uid(),value:a}:a},getInfo:function(a){var b=a.config;return!b?{}:{n:b.total_count||0,m:b.pos||0,Ea:b.parent||0,K:b.config,O:b.dhx_security}},child:"data"};dhx.DataDriver.html={toObject:function(a){if(typeof a=="string"){var b=null;a.indexOf("<")==-1&&(b=dhx.toNode(a));if(!b)b=document.createElement("DIV"),b.innerHTML=a;return b.getElementsByTagName(this.tag)}return a},getRecords:function(a){for(var b=[],c=0;c<a.childNodes.length;c++){var d=a.childNodes[c];d.nodeType==1&&b.push(d)}return b},getDetails:function(a){return dhx.DataDriver.xml.tagToObject(a)},getInfo:function(){return{n:0,m:0}},tag:"LI"};dhx.DataDriver.jsarray={toObject:function(a){return typeof a=="string"?(eval("dhx.temp="+a),dhx.temp):a},getRecords:function(a){return a},getDetails:function(a){for(var b={},c=0;c<a.length;c++)b["data"+c]=a[c];return b},getInfo:function(){return{n:0,m:0}}};dhx.DataDriver.csv={toObject:function(a){return a},getRecords:function(a){return a.split(this.row)},getDetails:function(a){for(var a=this.stringToArray(a),b={},c=0;c<a.length;c++)b["data"+c]=a[c];return b},getInfo:function(){return{n:0,m:0}},stringToArray:function(a){for(var a=a.split(this.cell),b=0;b<a.length;b++)a[b]=a[b].replace(/^[ \t\n\r]*(\"|)/g,"").replace(/(\"|)[ \t\n\r]*$/g,"");return a},row:"\n",cell:","};dhx.DataDriver.xml={Y:function(a){return!a||!a.documentElement?null:a.getElementsByTagName("parsererror").length?null:a},toObject:function(a){if(this.Y(b))return b;var b=typeof a=="string"?this.fromString(a.replace(/^[\s]+/,"")):a;return this.Y(b)?b:null},getRecords:function(a){return this.xpath(a,this.records)},records:"/*/item",child:"item",config:"/*/config",getDetails:function(a){return this.tagToObject(a,{})},getInfo:function(a){var b=this.xpath(a,this.config),b=b.length?this.assignTypes(this.tagToObject(b[0],
{})):null;return{n:a.documentElement.getAttribute("total_count")||0,m:a.documentElement.getAttribute("pos")||0,Ea:a.documentElement.getAttribute("parent")||0,K:b,O:a.documentElement.getAttribute("dhx_security")||null}},xpath:function(a,b){if(window.XPathResult){var c=a;if(a.nodeName.indexOf("document")==-1)a=a.ownerDocument;for(var d=[],e=a.evaluate(b,c,null,XPathResult.ANY_TYPE,null),f=e.iterateNext();f;)d.push(f),f=e.iterateNext();return d}else{var g=!0;try{typeof a.selectNodes=="undefined"&&(g=
!1)}catch(h){}if(g)return a.selectNodes(b);else{var i=b.split("/").pop();return a.getElementsByTagName(i)}}},assignTypes:function(a){for(var b in a){var c=a[b];typeof c=="object"?this.assignTypes(c):typeof c=="string"&&c!==""&&(c=="true"?a[b]=!0:c=="false"?a[b]=!1:c==c*1&&(a[b]*=1))}return a},tagToObject:function(a,b){var b=b||{},c=!1,d=a.attributes;if(d&&d.length){for(var e=0;e<d.length;e++)b[d[e].name]=d[e].value;c=!0}for(var f=a.childNodes,g={},e=0;e<f.length;e++)if(f[e].nodeType==1){var h=f[e].tagName;typeof b[h]!="undefined"?(dhx.isArray(b[h])||(b[h]=[b[h]]),b[h].push(this.tagToObject(f[e],{}))):b[f[e].tagName]=this.tagToObject(f[e],{});c=!0}if(!c)return this.nodeValue(a);b.value=b.value||this.nodeValue(a);return b},nodeValue:function(a){return a.firstChild?a.firstChild.data:""},fromString:function(a){try{if(window.DOMParser)return(new DOMParser).parseFromString(a,"text/xml");if(window.ActiveXObject){var b=new ActiveXObject("Microsoft.xmlDOM");b.loadXML(a);return b}}catch(c){return null}}};dhx.DataLoader=dhx.proto({$init:function(a){a=a||"";this.o=dhx.toArray();this.data=new dhx.DataStore;this.data.attachEvent("onClearAll",dhx.bind(this.oa,this));this.data.attachEvent("onServerConfig",dhx.bind(this.na,this));this.data.feed=this.sa},sa:function(a,b,c){if(this.u)return this.u=[a,b,c];else this.u=!0;this.W=[a,b];this.ua.call(this,a,b,c)},ua:function(a,b,c){var d=this.data.url;a<0&&(a=0);this.load(d+(d.indexOf("?")==-1?"?":"&")+(this.dataCount()?"continue=true&":"")+"start="+a+"&count="+
b,[this.ta,c])},ta:function(){var a=this.u,b=this.W;this.u=!1;typeof a=="object"&&(a[0]!=b[0]||a[1]!=b[1])&&this.data.feed.apply(this,a)},load:function(a,b){var c=dhx.AtomDataLoader.load.apply(this,arguments);this.o.push(c);if(!this.data.url)this.data.url=a},loadNext:function(a,b,c,d,e){this.a.datathrottle&&!e?(this.ha&&window.clearTimeout(this.ha),this.ha=dhx.delay(function(){this.loadNext(a,b,c,d,!0)},this,0,this.a.datathrottle)):(!b&&b!==0&&(b=this.dataCount()),this.data.url=this.data.url||d,this.callEvent("onDataRequest",
[b,a,c,d])&&this.data.url&&this.data.feed.call(this,b,a,c))},Ra:function(a,b){var c=this.W;return this.u&&c&&c[0]<=b&&c[1]+c[0]>=a+b?!0:!1},P:function(a,b,c){this.o.remove(c);var d=this.data.driver.toObject(a,b);if(d)this.data.Fa(d);else return this.C(a,b,c);this.pa();this.callEvent("onXLE",[])},removeMissed_setter:function(a){return this.data.Ja=a},scheme_setter:function(a){this.data.scheme(a)},dataFeed_setter:function(a){this.data.attachEvent("onBeforeFilter",dhx.bind(function(a,c){if(this.a.dataFeed){var d=
{};if(a||c){if(typeof a=="function"){if(!c)return;a(c,d)}else d={text:c};this.clearAll();var e=this.a.dataFeed,f=[];if(typeof e=="function")return e.call(this,c,d);for(var g in d)f.push("dhx_filter["+g+"]="+encodeURIComponent(d[g]));this.load(e+(e.indexOf("?")<0?"?":"&")+f.join("&"),this.a.datatype);return!1}}},this));return a},pa:function(){if(this.a.ready&&!this.Ha){var a=dhx.toFunctor(this.a.ready);a&&dhx.delay(a,this,arguments);this.Ha=!0}},oa:function(){for(var a=0;a<this.o.length;a++)this.o[a].abort();this.o=dhx.toArray()},na:function(a){this.Q(a)}},dhx.AtomDataLoader);dhx.DataStore=function(){this.name="DataStore";dhx.extend(this,dhx.EventSystem);this.setDriver("json");this.pull={};this.order=dhx.toArray();this.d={}};dhx.DataStore.prototype={setDriver:function(a){this.driver=dhx.DataDriver[a]},Fa:function(a){this.callEvent("onParse",[this.driver,a]);this.c&&this.filter();var b=this.driver.getInfo(a);if(b.O)dhx.securityKey=b.O;b.K&&this.callEvent("onServerConfig",[b.K]);var c=this.driver.getRecords(a);this.za(b,c);this.ba&&this.ya&&this.ya(this.ba);this.da&&(this.blockEvent(),this.sort(this.da),this.unblockEvent());this.callEvent("onStoreLoad",[this.driver,a]);this.refresh()},za:function(a,b){var c=(a.m||0)*1,
d=!0,e=!1;if(c===0&&this.order[0]){if(this.Ja)for(var e={},f=0;f<this.order.length;f++)e[this.order[f]]=!0;d=!1;c=this.order.length}for(var g=0,f=0;f<b.length;f++){var h=this.driver.getDetails(b[f]),i=this.id(h);this.pull[i]?d&&this.order[g+c]&&g++:(this.order[g+c]=i,g++);this.pull[i]?(dhx.extend(this.pull[i],h,!0),this.H&&this.H(this.pull[i]),e&&delete e[i]):(this.pull[i]=h,this.G&&this.G(h))}if(e){this.blockEvent();for(var j in e)this.remove(j);this.unblockEvent()}if(!this.order[a.n-1])this.order[a.n-
1]=dhx.undefined},id:function(a){return a.id||(a.id=dhx.uid())},changeId:function(a,b){this.pull[a]&&(this.pull[b]=this.pull[a]);this.pull[b].id=b;this.order[this.order.find(a)]=b;this.c&&(this.c[this.c.find(a)]=b);this.d[a]&&(this.d[b]=this.d[a],delete this.d[a]);this.callEvent("onIdChange",[a,b]);this.Ka&&this.Ka(a,b);delete this.pull[a]},item:function(a){return this.pull[a]},update:function(a,b){dhx.isUndefined(b)&&(b=this.item(a));this.H&&this.H(b);if(this.callEvent("onBeforeUpdate",[a,b])===
!1)return!1;this.pull[a]=b;this.callEvent("onStoreUpdated",[a,b,"update"])},refresh:function(a){this.fa||(a?this.callEvent("onStoreUpdated",[a,this.pull[a],"paint"]):this.callEvent("onStoreUpdated",[null,null,null]))},silent:function(a,b){this.fa=!0;a.call(b||this);this.fa=!1},getRange:function(a,b){a=a?this.indexById(a):this.$min||this.startOffset||0;b?b=this.indexById(b):(b=Math.min(this.$max||this.endOffset||Infinity,this.dataCount()-1),b<0&&(b=0));if(a>b)var c=b,b=a,a=c;return this.getIndexRange(a,
b)},getIndexRange:function(a,b){for(var b=Math.min(b||Infinity,this.dataCount()-1),c=dhx.toArray(),d=a||0;d<=b;d++)c.push(this.item(this.order[d]));return c},dataCount:function(){return this.order.length},exists:function(a){return!!this.pull[a]},move:function(a,b){var c=this.idByIndex(a),d=this.item(c);this.order.removeAt(a);this.order.insertAt(c,Math.min(this.order.length,b));this.callEvent("onStoreUpdated",[c,d,"move"])},scheme:function(a){this.F={};this.G=a.$init;this.H=a.$update;this.ca=a.$serialize;this.ba=a.$group;this.da=a.$sort;for(var b in a)b.substr(0,1)!="$"&&(this.F[b]=a[b])},sync:function(a,b,c){typeof a=="string"&&(a=$$("source"));typeof b!="function"&&(c=b,b=null);this.I=!1;if(a.name!="DataStore")a.data&&a.data.name=="DataStore"?a=a.data:this.I=!0;var d=dhx.bind(function(d,f,g){if(this.I){if(!d)return;if(d.indexOf("change")===0){if(d=="change")this.pull[f.id]=f.attributes,this.refresh(f.id);return}d=="reset"&&(g=f);this.order=[];this.pull={};this.c=null;for(var h=0;h<g.models.length;h++){var i=
g.models[h].id;this.order.push(i);this.pull[i]=g.models[h].attributes}}else this.c=null,this.order=dhx.toArray([].concat(a.order)),this.pull=a.pull;b&&this.silent(b);this.Z&&this.Z();this.callEvent("onSyncApply",[]);c?c=!1:this.refresh()},this);this.I?a.bind("all",d):this.w=[a.attachEvent("onStoreUpdated",d),a.attachEvent("onIdChange",dhx.bind(function(a,b){this.changeId(a,b)},this))];d()},add:function(a,b,c){if(this.F)for(var d in this.F)dhx.isUndefined(a[d])&&(a[d]=this.F[d]);this.G&&this.G(a);var e=this.id(a),f=c||this.order,g=f.length;if(dhx.isUndefined(b)||b<0)b=g;b>g&&(b=Math.min(f.length,b));if(this.callEvent("onBeforeAdd",[e,a,b])===!1)return!1;this.pull[e]=a;f.insertAt(e,b);if(this.c){var h=this.c.length;!b&&this.order.length&&(h=0);this.c.insertAt(e,h)}this.callEvent("onAfterAdd",[e,b]);this.callEvent("onStoreUpdated",[e,a,"add"]);return e},remove:function(a){if(dhx.isArray(a))for(var b=0;b<a.length;b++)this.remove(a[b]);else{if(this.callEvent("onBeforeDelete",[a])===!1)return!1;var c=this.item(a);this.order.remove(a);this.c&&this.c.remove(a);delete this.pull[a];this.d[a]&&delete this.d[a];this.callEvent("onAfterDelete",[a]);this.callEvent("onStoreUpdated",[a,c,"delete"])}},clearAll:function(){this.pull={};this.order=dhx.toArray();this.c=this.url=null;this.callEvent("onClearAll",[]);this.refresh()},idByIndex:function(a){return this.order[a]},indexById:function(a){var b=this.order.find(a);return b},next:function(a,b){return this.order[this.indexById(a)+(b||1)]},first:function(){return this.order[0]},
last:function(){return this.order[this.order.length-1]},previous:function(a,b){return this.order[this.indexById(a)-(b||1)]},sort:function(a,b,c){var d=a;typeof a=="function"?d={as:a,dir:b}:typeof a=="string"&&(d={by:a.replace(/#/g,""),dir:b,as:c});var e=[d.by,d.dir,d.as];this.callEvent("onBeforeSort",e)&&(this.Ma(d),this.refresh(),this.callEvent("onAfterSort",e))},Ma:function(a){if(this.order.length){var b=this.La.qa(a),c=this.getRange(this.first(),this.last());c.sort(b);this.order=c.map(function(a){return this.id(a)},
this)}},wa:function(a){if(this.c&&!a)this.order=this.c,delete this.c},va:function(a,b,c){for(var d=dhx.toArray(),e=0;e<this.order.length;e++){var f=this.order[e];a(this.item(f),b)&&d.push(f)}if(!c||!this.c)this.c=this.order;this.order=d},filter:function(a,b,c){if(this.callEvent("onBeforeFilter",[a,b])&&(this.wa(c),this.order.length)){if(a){var d=a,b=b||"";typeof a=="string"&&(a=a.replace(/#/g,""),b=b.toString().toLowerCase(),d=function(b,c){return(b[a]||"").toString().toLowerCase().indexOf(c)!=-1});this.va(d,b,c,this.Pa)}this.refresh();this.callEvent("onAfterFilter",[])}},each:function(a,b){for(var c=0;c<this.order.length;c++)a.call(b||this,this.item(this.order[c]))},Ca:function(a,b){return function(){return a[b].apply(a,arguments)}},addMark:function(a,b,c,d){var e=this.d[a]||{};this.d[a]=e;if(!e[b]&&(e[b]=d||!0,c))this.item(a).$css=(this.item(a).$css||"")+" "+b,this.refresh(a);return e[b]},removeMark:function(a,b,c){var d=this.d[a];d&&d[b]&&delete d[b];if(c){var e=this.item(a).$css;if(e)this.item(a).$css=
e.replace(b,""),this.refresh(a)}},hasMark:function(a,b){var c=this.d[a];return c&&c[b]},provideApi:function(a,b){b&&this.mapEvent({onbeforesort:a,onaftersort:a,onbeforeadd:a,onafteradd:a,onbeforedelete:a,onafterdelete:a,onbeforeupdate:a});for(var c="sort,add,remove,exists,idByIndex,indexById,item,update,refresh,dataCount,filter,next,previous,clearAll,first,last,serialize,sync,addMark,removeMark,hasMark".split(","),d=0;d<c.length;d++)a[c[d]]=this.Ca(this,c[d])},serialize:function(){for(var a=this.order,
b=[],c=0;c<a.length;c++){var d=this.pull[a[c]];if(this.ca&&(d=this.ca(d),d===!1))continue;b.push(d)}return b},La:{qa:function(a){return this.ra(a.dir,this.ma(a.by,a.as))},ja:{date:function(a,b){a-=0;b-=0;return a>b?1:a<b?-1:0},"int":function(a,b){a*=1;b*=1;return a>b?1:a<b?-1:0},string_strict:function(a,b){a=a.toString();b=b.toString();return a>b?1:a<b?-1:0},string:function(a,b){if(!b)return 1;if(!a)return-1;a=a.toString().toLowerCase();b=b.toString().toLowerCase();return a>b?1:a<b?-1:0}},ma:function(a,
b){if(!a)return b;typeof b!="function"&&(b=this.ja[b||"string"]);return function(c,d){return b(c[a],d[a])}},ra:function(a,b){return a=="asc"||!a?b:function(a,d){return b(a,d)*-1}}}};dhx.BaseBind={bind:function(a,b,c){typeof a=="string"&&(a=dhx.ui.get(a));a.b&&a.b();this.b&&this.b();a.getBindData||dhx.extend(a,dhx.BindSource);if(!this.ka){var d=this.render;if(this.filter){var e=this.a.id;this.data.Z=function(){a.l[e]=!1}}this.render=function(){if(!this.X){this.X=!0;var a=this.callEvent("onBindRequest");this.X=!1;return d.apply(this,a===!1?arguments:[])}};if(this.getValue||this.getValues)this.save=function(){if(!this.validate||this.validate())a.setBindData(this.getValue?this.getValue:
this.getValues(),this.a.id)};this.ka=!0}a.addBind(this.a.id,b,c);var f=this.a.id;this.attachEvent(this.touchable?"onAfterRender":"onBindRequest",function(){return a.getBindData(f)});!this.a.dataFeed&&this.loadNext&&this.data.attachEvent("onStoreLoad",function(){a.l[f]=!1});this.isVisible(this.a.id)&&this.refresh()},g:function(a){a.removeBind(this.a.id);var b=this.w||(this.data?this.data.w:0);if(b&&a.data)for(var c=0;c<b.length;c++)a.data.detachEvent(b[c])}};dhx.BindSource={$init:function(){this.p={};this.l={};this.A={};this.la(this)},saveBatch:function(a){this.V=!0;a.call(this);this.V=!1;this.k()},setBindData:function(a,b){b&&(this.A[b]=!0);if(this.setValue)this.setValue(a);else if(this.setValues)this.setValues(a);else{var c=this.getCursor();c&&(a=dhx.extend(this.item(c),a,!0),this.update(c,a))}this.callEvent("onBindUpdate",[a,b]);this.save&&this.save();b&&(this.A[b]=!1)},getBindData:function(a,b){if(this.l[a])return!1;var c=dhx.ui.get(a);c.isVisible(c.a.id)&&
(this.l[a]=!0,this.J(c,this.p[a][0],this.p[a][1]),b&&c.filter&&c.refresh())},addBind:function(a,b,c){this.p[a]=[b,c]},removeBind:function(a){delete this.p[a];delete this.l[a];delete this.A[a]},la:function(a){a.filter?dhx.extend(this,dhx.CollectionBind):a.setValue?dhx.extend(this,dhx.ValueBind):dhx.extend(this,dhx.RecordBind)},k:function(){if(!this.V)for(var a in this.p)this.A[a]||(this.l[a]=!1,this.getBindData(a,!0))},S:function(a,b,c){a.setValue?a.setValue(c?c[b]:c):a.filter?a.data.silent(function(){this.filter(b,
c)}):!c&&a.clear?a.clear():a.z(c)&&a.setValues(dhx.clone(c));a.callEvent("onBindApply",[c,b,this])}};dhx.DataValue=dhx.proto({name:"DataValue",isVisible:function(){return!0},$init:function(a){var b=(this.data=a)&&a.id?a.id:dhx.uid();this.a={id:b};dhx.ui.views[b]=this},setValue:function(a){this.data=a;this.callEvent("onChange",[a])},getValue:function(){return this.data},refresh:function(){this.callEvent("onBindRequest")}},dhx.EventSystem,dhx.BaseBind);dhx.DataRecord=dhx.proto({name:"DataRecord",isVisible:function(){return!0},$init:function(a){this.data=a||{};var b=a&&a.id?a.id:dhx.uid();this.a={id:b};dhx.ui.views[b]=this},getValues:function(){return this.data},setValues:function(a){this.data=a;this.callEvent("onChange",[a])},refresh:function(){this.callEvent("onBindRequest")}},dhx.EventSystem,dhx.BaseBind,dhx.AtomDataLoader,dhx.Settings);dhx.DataCollection=dhx.proto({name:"DataCollection",isVisible:function(){return!this.data.order.length&&!this.data.c&&!this.a.dataFeed?!1:!0},$init:function(a){this.data.provideApi(this,!0);var b=a&&a.id?a.id:dhx.uid();this.a.id=b;dhx.ui.views[b]=this;this.data.attachEvent("onStoreLoad",dhx.bind(function(){this.callEvent("onBindRequest",[])},this))},refresh:function(){this.callEvent("onBindRequest",[])}},dhx.DataLoader,dhx.EventSystem,dhx.BaseBind,dhx.Settings);dhx.ValueBind={$init:function(){this.attachEvent("onChange",this.k)},J:function(a,b,c){var d=this.getValue()||"";c&&(d=c(d));if(a.setValue)a.setValue(d);else if(a.filter)a.data.silent(function(){this.filter(b,d)});else{var e={};e[b]=d;a.z(d)&&a.setValues(e)}a.callEvent("onBindApply",[d,b,this])}};dhx.RecordBind={$init:function(){this.attachEvent("onChange",this.k)},J:function(a,b){var c=this.getValues()||null;this.S(a,b,c)}};dhx.CollectionBind={$init:function(){this.h=null;this.attachEvent("onSelectChange",function(){var a=this.getSelected();this.setCursor(a?a.id||a:null)});this.attachEvent("onAfterCursorChange",this.k);this.data.attachEvent("onStoreUpdated",dhx.bind(function(a,b,c){a&&a==this.getCursor()&&c!="paint"&&this.k()},this));this.data.attachEvent("onClearAll",dhx.bind(function(){this.h=null},this));this.data.attachEvent("onIdChange",dhx.bind(function(a,b){if(this.h==a)this.h=b},this))},setCursor:function(a){if(!(a==
this.h||a!==null&&!this.item(a)))this.callEvent("onBeforeCursorChange",[this.h]),this.h=a,this.callEvent("onAfterCursorChange",[a])},getCursor:function(){return this.h},J:function(a,b){var c=this.item(this.getCursor())||this.a.defaultData||null;this.S(a,b,c)}};if(!dhx.ui)dhx.ui={};if(!dhx.ui.views)dhx.ui.views={},dhx.ui.get=function(a){return a.a?a:dhx.ui.views[a]};dhtmlXDataStore=function(a){var b=new dhx.DataCollection(a),c="_dp_init";b[c]=function(a){var b="_methods";a[b]=["dummy","dummy","changeId","dummy"];this.data.Da={add:"inserted",update:"updated","delete":"deleted"};this.data.attachEvent("onStoreUpdated",function(b,c,e){b&&!a.ea&&a.setUpdated(b,!0,this.Da[e])});b="_getRowData";a[b]=function(a){var b=this.obj.data.item(a),c={id:a};c[this.action_param]=this.obj.getUserData(a);if(b)for(var d in b)c[d]=b[d];return c};this.changeId=
function(b,c){this.data.changeId(b,c);a.ea=!0;this.data.callEvent("onStoreUpdated",[c,this.item(c),"update"]);a.ea=!1};b="_clearUpdateFlag";a[b]=function(){};this.ia={}};b.dummy=function(){};b.setUserData=function(a,b,c){this.ia[a]=c};b.getUserData=function(a){return this.ia[a]};b.dataFeed=function(a){this.define("dataFeed",a)};dhx.extend(b,dhx.BindSource);return b};if(window.dhtmlXDataView)dhtmlXDataView.prototype.b=function(){this.isVisible=function(){return!this.data.order.length&&!this.data.c&&!this.a.dataFeed?!1:!0};var a="_settings";this.a=this.a||this[a];if(!this.a.id)this.a.id=dhx.uid();this.unbind=dhx.BaseBind.unbind;this.unsync=dhx.BaseBind.unsync;dhx.ui.views[this.a.id]=this};if(window.dhtmlXChart)dhtmlXChart.prototype.b=function(){this.isVisible=function(){return!this.data.order.length&&!this.data.Qa&&!this.a.dataFeed?!1:!0};var a="_settings";this.a=this.a||this[a];if(!this.a.id)this.a.id=dhx.uid();this.unbind=dhx.BaseBind.unbind;this.unsync=dhx.BaseBind.unsync;dhx.ui.views[this.a.id]=this};dhx.BaseBind.unsync=function(a){return dhx.BaseBind.g.call(this,a)};dhx.BaseBind.unbind=function(a){return dhx.BaseBind.g.call(this,a)};dhx.BaseBind.legacyBind=function(){return dhx.BaseBind.bind.apply(this,arguments)};dhx.BaseBind.legacySync=function(a,b){this.b&&this.b();a.b&&a.b();this.attachEvent("onAfterEditStop",function(a){this.save(a);return!0});this.attachEvent("onDataRequest",function(b,d){for(var e=b;e<b+d;e++)if(!a.data.order[e])return a.loadNext(d,b),!1});this.save=function(b){b||(b=this.getCursor());var d=this.item(b),e=a.item(b),f;for(f in d)f.indexOf("$")!==0&&(e[f]=d[f]);a.refresh(b)};return a&&a.name=="DataCollection"?a.data.sync.apply(this.data,arguments):this.data.sync.apply(this.data,arguments)};if(window.dhtmlXForm)dhtmlXForm.prototype.bind=function(a){dhx.BaseBind.bind.apply(this,arguments);a.getBindData(this.a.id)},dhtmlXForm.prototype.unbind=function(a){dhx.BaseBind.g.call(this,a)},dhtmlXForm.prototype.b=function(){if(dhx.isUndefined(this.a))this.a={id:dhx.uid(),dataFeed:this.j},dhx.ui.views[this.a.id]=this},dhtmlXForm.prototype.z=function(a){if(!this.a.dataFeed||this.N||!a)return!0;var b=this.a.dataFeed;if(typeof b=="function")return b.call(this,a.id||a,a);b=b+(b.indexOf("?")==-1?"?":
"&")+"action=get&id="+encodeURIComponent(a.id||a);this.load(b);return!1},dhtmlXForm.prototype.setValues=dhtmlXForm.prototype.setFormData,dhtmlXForm.prototype.getValues=function(){return this.getFormData(!1,!0)},dhtmlXForm.prototype.dataFeed=function(a){this.a?this.a.dataFeed=a:this.j=a},dhtmlXForm.prototype.refresh=dhtmlXForm.prototype.isVisible=function(){return!0};if(window.scheduler){if(!window.Scheduler)window.Scheduler={};Scheduler.$syncFactory=function(a){a.sync=function(b,c){this.b&&this.b();b.b&&b.b();var d="_process_loading",e=function(){a.clearAll();for(var e=b.data.order,g=b.data.pull,h=[],i=0;i<e.length;i++)h[i]=c&&c.copy?dhx.clone(g[e[i]]):g[e[i]];a[d](h)};this.save=function(a){a||(a=this.getCursor());var c=this.item(a),d=b.item(a);this.callEvent("onStoreSave",[a,c,d])&&(dhx.extend(b.item(a),c,!0),b.update(a))};this.item=function(a){return this.getEvent(a)};this.w=[b.data.attachEvent("onStoreUpdated",function(){e.call(this)}),b.data.attachEvent("onIdChange",function(a,b){combo.changeOptionId(a,b)})];this.attachEvent("onEventChanged",function(a){this.save(a)});this.attachEvent("onEventAdded",function(a,c){b.data.pull[a]||b.add(c)});this.attachEvent("onEventDeleted",function(a){b.data.pull[a]&&b.remove(a)});e()};a.unsync=function(a){dhx.BaseBind.g.call(this,a)};a.b=function(){if(!this.a)this.a={id:dhx.uid()}}};Scheduler.$syncFactory(window.scheduler)}
if(window.dhtmlXCombo)dhtmlXCombo.prototype.bind=function(){dhx.BaseBind.bind.apply(this,arguments)},dhtmlXCombo.unbind=function(a){dhx.BaseBind.g.call(this,a)},dhtmlXCombo.unsync=function(a){dhx.BaseBind.g.call(this,a)},dhtmlXCombo.prototype.dataFeed=function(a){this.a?this.a.dataFeed=a:this.j=a},dhtmlXCombo.prototype.sync=function(a){this.b&&this.b();a.b&&a.b();var b=this,c=function(){b.clearAll();b.addOption(this.serialize())};this.w=[a.data.attachEvent("onStoreUpdated",function(){c.call(this)}),
a.data.attachEvent("onIdChange",function(a,c){b.changeOptionId(a,c)})];c.call(a)},dhtmlXCombo.prototype.b=function(){if(dhx.isUndefined(this.a))this.a={id:dhx.uid(),dataFeed:this.j},dhx.ui.views[this.a.id]=this,this.data={silent:dhx.bind(function(a){a.call(this)},this)},dhtmlxEventable(this.data),this.attachEvent("onChange",function(){this.callEvent("onSelectChange",[this.getSelectedValue()])}),this.attachEvent("onXLE",function(){this.callEvent("onBindRequest",[])})},dhtmlXCombo.prototype.item=function(id){return this.getOption(id)},
dhtmlXCombo.prototype.getSelected=function(){return this.getSelectedValue()},dhtmlXCombo.prototype.isVisible=function(){return!this.optionsArr.length&&!this.a.dataFeed?!1:!0},dhtmlXCombo.prototype.refresh=function(){this.render(!0)},dhtmlXCombo.prototype.filter=function(){alert("not implemented")};if(window.dhtmlXGridObject)dhtmlXGridObject.prototype.bind=function(a,b,c){dhx.BaseBind.bind.apply(this,arguments)},dhtmlXGridObject.prototype.unbind=function(a){dhx.BaseBind.g.call(this,a)},dhtmlXGridObject.prototype.unsync=function(a){dhx.BaseBind.g.call(this,a)},dhtmlXGridObject.prototype.dataFeed=function(a){this.a?this.a.dataFeed=a:this.j=a},dhtmlXGridObject.prototype.sync=function(a,b){this.b&&this.b();a.b&&a.b();var c=this,d="_parsing",e="_parser",f="_locator",g="_process_store_row",h="_get_store_data";this.save=function(b){b||(b=this.getCursor());dhx.extend(a.item(b),this.item(b),!0);a.update(b)};var i=function(){var a=c.getCursor?c.getCursor():null,b=0;c.B?(b=c.B,c.B=!1):c.clearAll();var i=this.dataCount();if(i){c[d]=!0;for(var k=b;k<i;k++){var l=this.order[k];if(l&&(!b||!c.rowsBuffer[k]))c.rowsBuffer[k]={idd:l,data:this.pull[l]},c.rowsBuffer[k][e]=c[g],c.rowsBuffer[k][f]=c[h],c.rowsAr[l]=this.pull[l]}if(!c.rowsBuffer[i-1])c.rowsBuffer[i-1]=dhtmlx.undefined,c.xmlFileUrl=c.xmlFileUrl||this.url;c.pagingOn?c.changePage():c.Ta&&c.Oa?c.Ua():(c.render_dataset(),c.callEvent("onXLE",[]));c[d]=!1}a&&c.setCursor&&c.setCursor(c.rowsAr[a]?a:null)};this.w=[a.data.attachEvent("onStoreUpdated",function(a,b,d){d=="delete"?(c.deleteRow(a),c.data.callEvent("onStoreUpdated",[a,b,d])):d=="update"?(c.callEvent("onSyncUpdate",[b,d]),c.update(a,b),c.data.callEvent("onStoreUpdated",[a,b,d])):d=="add"?(c.callEvent("onSyncUpdate",[b,d]),c.add(a,b,this.indexById(a)),c.data.callEvent("onStoreUpdated",[a,b,d])):i.call(this)}),
a.data.attachEvent("onStoreLoad",function(b,d){c.xmlFileUrl=a.data.url;c.B=b.getInfo(d).m}),a.data.attachEvent("onIdChange",function(a,b){c.changeRowId(a,b)})];c.attachEvent("onDynXLS",function(b,d){for(var e=b;e<b+d;e++)if(!a.data.order[e])return a.loadNext(d,b),!1;c.B=b;i.call(a.data)});i.call(a.data);c.attachEvent("onEditCell",function(a,b){a==2&&this.save(b);return!0});c.attachEvent("onClearAll",function(){var a="_f_rowsBuffer";this[a]=null});b&&b.sort&&c.attachEvent("onBeforeSorting",function(b,
d,e){if(d=="connector")return!1;var f=this.getColumnId(b);a.sort("#"+f+"#",e=="asc"?"asc":"desc",d=="int"?d:"string");c.setSortImgState(!0,b,e);return!1});if(b&&b.filter)c.attachEvent("onFilterStart",function(b,d){var e="_con_f_used";if(c[e]&&c[e].length)return!1;a.data.silent(function(){a.filter();for(var e=0;e<b.length;e++)if(d[e]!=""){var f=c.getColumnId(b[e]);a.filter("#"+f+"#",d[e],e!=0)}});a.refresh();return!1}),c.collectValues=function(b){var c=this.getColumnId(b);return function(a){var b=
[],c={};this.data.each(function(d){var e=d[a];c[e]||(c[e]=!0,b.push(e))});return b}.call(a,c)};b&&b.select&&c.attachEvent("onRowSelect",function(b){a.setCursor(b)});c.clearAndLoad=function(b){a.clearAll();a.load(b)}},dhtmlXGridObject.prototype.b=function(){if(dhx.isUndefined(this.a)){this.a={id:dhx.uid(),dataFeed:this.j};dhx.ui.views[this.a.id]=this;this.data={silent:dhx.bind(function(a){a.call(this)},this)};dhtmlxEventable(this.data);for(var a="_cCount",b=0;b<this[a];b++)this.columnIds[b]||(this.columnIds[b]=
"cell"+b);this.attachEvent("onSelectStateChanged",function(a){this.callEvent("onSelectChange",[a])});this.attachEvent("onSelectionCleared",function(){this.callEvent("onSelectChange",[null])});this.attachEvent("onEditCell",function(a,b){a===2&&this.getCursor&&b&&b==this.getCursor()&&this.k();return!0});this.attachEvent("onXLE",function(){this.callEvent("onBindRequest",[])})}},dhtmlXGridObject.prototype.item=function(a){if(a===null)return null;var b=this.getRowById(a);if(!b)return null;var c="_attrs",
d=dhx.copy(b[c]);d.id=a;for(var e=this.getColumnsNum(),f=0;f<e;f++)d[this.columnIds[f]]=this.cells(a,f).getValue();return d},dhtmlXGridObject.prototype.update=function(a,b){for(var c=0;c<this.columnIds.length;c++){var d=this.columnIds[c];dhx.isUndefined(b[d])||this.cells(a,c).setValue(b[d])}var e="_attrs",f=this.getRowById(a)[e];for(d in b)f[d]=b[d];this.callEvent("onBindUpdate",[a])},dhtmlXGridObject.prototype.add=function(a,b,c){for(var d=[],e=0;e<this.columnIds.length;e++){var f=this.columnIds[e];d[e]=dhx.isUndefined(b[f])?"":b[f]}this.addRow(a,d,c);var g="_attrs";this.getRowById(a)[g]=dhx.copy(b)},dhtmlXGridObject.prototype.getSelected=function(){return this.getSelectedRowId()},dhtmlXGridObject.prototype.isVisible=function(){var a="_f_rowsBuffer";return!this.rowsBuffer.length&&!this[a]&&!this.a.dataFeed?!1:!0},dhtmlXGridObject.prototype.refresh=function(){this.render_dataset()},dhtmlXGridObject.prototype.filter=function(a,b){if(this.a.dataFeed){var c={};if(!a&&!b)return;if(typeof a=="function"){if(!b)return;a(b,c)}else dhx.isUndefined(a)?c=b:c[a]=b;this.clearAll();var d=this.a.dataFeed;if(typeof d=="function")return d.call(this,b,c);var e=[],f;for(f in c)e.push("dhx_filter["+f+"]="+encodeURIComponent(c[f]));this.load(d+(d.indexOf("?")<0?"?":"&")+e.join("&"));return!1}if(b===null)return this.filterBy(0,function(){return!1});this.filterBy(0,function(c,d){return a.call(this,d,b)})};if(window.dhtmlXTreeObject)dhtmlXTreeObject.prototype.bind=function(){dhx.BaseBind.bind.apply(this,arguments)},dhtmlXTreeObject.prototype.unbind=function(a){dhx.BaseBind.g.call(this,a)},dhtmlXTreeObject.prototype.dataFeed=function(a){this.a?this.a.dataFeed=a:this.j=a},dhtmlXTreeObject.prototype.b=function(){if(dhx.isUndefined(this.a))this.a={id:dhx.uid(),dataFeed:this.j},dhx.ui.views[this.a.id]=this,this.data={silent:dhx.bind(function(a){a.call(this)},this)},dhtmlxEventable(this.data),this.attachEvent("onSelect",
function(a){this.callEvent("onSelectChange",[a])}),this.attachEvent("onEdit",function(a,b){a===2&&b&&b==this.getCursor()&&this.k();return!0})},dhtmlXTreeObject.prototype.item=function(a){return a===null?null:{id:a,text:this.getItemText(a)}},dhtmlXTreeObject.prototype.getSelected=function(){return this.getSelectedItemId()},dhtmlXTreeObject.prototype.isVisible=function(){return!0},dhtmlXTreeObject.prototype.refresh=function(){},dhtmlXTreeObject.prototype.filter=function(a,b){if(this.a.dataFeed){var c=
{};if(a||b){if(typeof a=="function"){if(!b)return;a(b,c)}else dhx.isUndefined(a)?c=b:c[a]=b;this.deleteChildItems(0);var d=this.a.dataFeed;if(typeof d=="function")return d.call(this,[data.id||data,data]);var e=[],f;for(f in c)e.push("dhx_filter["+f+"]="+encodeURIComponent(c[f]));this.loadXML(d+(d.indexOf("?")<0?"?":"&")+e.join("&"));return!1}}},dhtmlXTreeObject.prototype.update=function(a,b){dhx.isUndefined(b.text)||this.setItemText(a,b.text)};dhtmlx.skin='dhx_skyblue';