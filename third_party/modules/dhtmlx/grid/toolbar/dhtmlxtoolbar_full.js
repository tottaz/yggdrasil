/*
Copyright DHTMLX LTD. http://www.dhtmlx.com
You allowed to use this component or parts of it under GPL terms
To use it on other terms or get Professional edition of the component please contact us at sales@dhtmlx.com
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
 obj = null;};function dhtmlXToolbarObject(baseId, skin) {var main_self = this;this.cont = (typeof(baseId)!="object")?document.getElementById(baseId):baseId;while (this.cont.childNodes.length > 0)this.cont.removeChild(this.cont.childNodes[0]);this.cont.dir = "ltr";this.cont.innerHTML += "<div class='dhxtoolbar_hdrline_ll'></div><div class='dhxtoolbar_hdrline_rr'></div>"+
 "<div class='dhxtoolbar_hdrline_l'></div><div class='dhxtoolbar_hdrline_r'></div>";this.base = document.createElement("DIV");this.base.className = "float_left";this.cont.appendChild(this.base);this.align = "left";this.setAlign = function(align) {this.align = (align=="right"?"right":"left");this.base.className = (align=="right"?"float_right":"float_left");if (this._spacer)this._spacer.className = "dhxtoolbar_spacer "+(align=="right"?" float_left":" float_right");}
 
 this._isIE6 = false;if (_isIE)this._isIE6 = (window.XMLHttpRequest==null?true:false);this._isIPad = (navigator.userAgent.search(/iPad/gi)>=0);if (this._isIPad){this.cont.ontouchstart = function(e){e = e||event;e.returnValue = false;e.cancelBubble = true;return false;}
 }
 
 this.iconSize = 18;this.setIconSize = function(size) {this.iconSize = ({18:true,24:true,32:true,48:true}[size]?size:18);this.setSkin(this.skin, true);this.callEvent("_onIconSizeChange",[this.iconSize]);}
 
 this.selectPolygonOffsetTop = 0;this.selectPolygonOffsetLeft = 0;this._improveTerraceSkin = function() {var p = [];var bn = {buttonInput: true, separator: true, text: true};var e = [this.base];if (this._spacer != null)e.push(this._spacer);for (var w=0;w<e.length;w++){p[w] = [];for (var q=0;q<e[w].childNodes.length;q++){if (e[w].childNodes[q].idd != null && e[w].childNodes[q].style.display != "none"){var a = this.idPrefix+e[w].childNodes[q].idd;if (this.objPull[a] != null && this.objPull[a].obj == e[w].childNodes[q]){p[w].push({a:a,type:this.objPull[a].type,node:this.objPull[a][this.objPull[a].type=="buttonSelect"?"arw":"obj"]});}
 }
 }
 e[w] = null;}
 
 for (var w=0;w<p.length;w++){for (var q=0;q<p[w].length;q++){var t = p[w][q];if (t.type == "buttonInput"){t.node.className = t.node.className.replace(/dhx_toolbar_btn/,"dhx_toolbar_inp");}
 
 
 var br = false;var bl = false;if (!bn[t.type]){if (q == p[w].length-1 || (p[w][q+1] != null && bn[p[w][q+1].type])) br = true;if (q == 0 || (q-1 >= 0 && p[w][q-1] != null && bn[p[w][q-1].type])) bl = true;}
 
 t.node.style.borderRight = (br?"1px solid #cecece":"0px solid white");t.node.style.borderTopRightRadius = t.node.style.borderBottomRightRadius = (br?"5px":"0px");if (t.type == "buttonSelect"){t.node.previousSibling.style.borderTopLeftRadius = t.node.previousSibling.style.borderBottomLeftRadius = (bl?"5px":"0px");t.node.previousSibling._br = br;t.node.previousSibling._bl = bl;}else {t.node.style.borderTopLeftRadius = t.node.style.borderBottomLeftRadius = (bl?"5px":"0px");}
 
 t.node._br = br;t.node._bl = bl;}
 }
 
 for (var w=0;w<p.length;w++){for (var q=0;q<p[w].length;q++){for (var a in p[w][q])p[w][q][a] = null;p[w][q] = null;}
 p[w] = null;}
 
 p = e = null;}
 
 
 this._improveTerraceButtonSelect = function(id, state) {var item = this.objPull[id];if (state == true){item.obj.style.borderBottomLeftRadius = (item.obj._bl?"5px":"0px");item.arw.style.borderBottomRightRadius = (item.obj._br?"5px":"0px");}else {item.obj.style.borderBottomLeftRadius = "0px";item.arw.style.borderBottomRightRadius = "0px";}
 item = null;}
 
 this.setSkin = function(skin, onlyIcons) {if (onlyIcons === true){this.cont.className = this.cont.className.replace(/dhx_toolbar_base_\d{1,}_/,"dhx_toolbar_base_"+this.iconSize+"_");}else {this.skin = skin;if (this.skin == "dhx_skyblue"){this.selectPolygonOffsetTop = 1;}
 if (this.skin == "dhx_web"){this.selectPolygonOffsetTop = 1;this.selectPolygonOffsetLeft = 1;}
 if (this.skin == "dhx_terrace"){this.selectPolygonOffsetTop = -1;this.selectPolygonOffsetLeft = 0;}
 this.cont.className = "dhx_toolbar_base_"+this.iconSize+"_"+this.skin+(this.rtl?" rtl":"");}
 
 for (var a in this.objPull){var item = this.objPull[a];if (item["type"] == "slider"){item.pen._detectLimits();item.pen._definePos();item.label.className = "dhx_toolbar_slider_label_"+this.skin+(this.rtl?" rtl":"");}
 if (item["type"] == "buttonSelect"){item.polygon.className = "dhx_toolbar_poly_"+this.iconSize+"_"+this.skin+(this.rtl?" rtl":"");}
 }
 if (skin == "dhx_terrace")this._improveTerraceSkin();}
 this.setSkin(skin != null ? skin : (typeof(dhtmlx) != "undefined" && typeof(dhtmlx.skin) == "string" ? dhtmlx.skin : "dhx_skyblue"));this.objPull = {};this.anyUsed = "none";this.imagePath = "";this.setIconsPath = function(path) {this.imagePath = path;}
 
 this.setIconPath = this.setIconsPath;this._doOnLoad = function() {}
 
 this.loadXML = function(xmlFile, onLoadFunction) {if (onLoadFunction != null)this._doOnLoad = function() {onLoadFunction();}
 this.callEvent("onXLS", []);this._xmlLoader = new dtmlXMLLoaderObject(this._xmlParser, window);this._xmlLoader.loadXML(xmlFile);}
 
 this.loadXMLString = function(xmlString, onLoadFunction) {if (onLoadFunction != null){this._doOnLoad = function() {onLoadFunction();}}
 this._xmlLoader = new dtmlXMLLoaderObject(this._xmlParser, window);this._xmlLoader.loadXMLString(xmlString);}
 this._xmlParser = function() {var root = this.getXMLTopNode("toolbar");var t = ["id", "type", "hidden", "title", "text", "enabled", "img", "imgdis", "action", "openAll", "renderSelect", "mode", "maxOpen", "width", "value", "selected", "length", "textMin", "textMax", "toolTip", "valueMin", "valueMax", "valueNow"];var p = ["id", "type", "enabled", "disabled", "action", "selected", "img", "text"];for (var q=0;q<root.childNodes.length;q++){if (root.childNodes[q].tagName == "item"){var itemData = {};for (var w=0;w<t.length;w++)itemData[t[w]] = root.childNodes[q].getAttribute(t[w]);itemData.items = [];itemData.userdata = [];for (var e=0;e<root.childNodes[q].childNodes.length;e++){if (root.childNodes[q].childNodes[e].tagName == "item" && itemData.type == "buttonSelect"){var u = {};for (var w=0;w<p.length;w++)u[p[w]] = root.childNodes[q].childNodes[e].getAttribute(p[w]);var t0 = root.childNodes[q].childNodes[e].getElementsByTagName("itemText");if (t0 != null && t0[0] != null)u.itemText = t0[0].firstChild.nodeValue;var h = root.childNodes[q].childNodes[e].getElementsByTagName("userdata");for (var w=0;w<h.length;w++){if (!u.userdata)u.userdata = {};var r = {};try {r.name = h[w].getAttribute("name");}catch(k) {r.name = "";}
 try {r.value = h[w].firstChild.nodeValue;}catch(k) {r.value = "";}
 if (r.name != "")u.userdata[r.name] = r.value;}
 
 itemData.items[itemData.items.length] = u;}
 
 if (root.childNodes[q].childNodes[e].tagName == "userdata"){var u = {};try {u.name = root.childNodes[q].childNodes[e].getAttribute("name");}catch(k) {u.name = "";}
 try {u.value = root.childNodes[q].childNodes[e].firstChild.nodeValue;}catch(k) {u.value = "";}
 itemData.userdata[itemData.userdata.length] = u;}
 }
 main_self._addItemToStorage(itemData);}
 }
 if (main_self.skin == "dhx_terrace")main_self._improveTerraceSkin();main_self.callEvent("onXLE", []);main_self._doOnLoad();this.destructor();}
 this._addItemToStorage = function(itemData, pos) {var id = (itemData.id||this._genStr(24));var type = (itemData.type||"");if (type != ""){if (this["_"+type+"Object"] != null){if ((typeof(itemData.openAll)== "undefined" || itemData.openAll == null) && this.skin == "dhx_terrace") itemData.openAll = true;this.objPull[this.idPrefix+id] = new this["_"+type+"Object"](this, id, itemData);this.objPull[this.idPrefix+id]["type"] = type;this.setPosition(id, pos);}
 }
 
 if (itemData.userdata){for (var q=0;q<itemData.userdata.length;q++)this.setUserData(id, itemData.userdata[q].name, itemData.userdata[q].value);}
 }
 
 this._genStr = function(w) {var s = "";var z = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";for (var q=0;q<w;q++)s += z.charAt(Math.round(Math.random() * (z.length-1)));return s;}
 this.rootTypes = new Array("button", "buttonSelect", "buttonTwoState", "separator", "label", "slider", "text", "buttonInput");this.idPrefix = this._genStr(12);dhtmlxEventable(this);this._getObj = function(obj, tag) {var targ = null;for (var q=0;q<obj.childNodes.length;q++){if (obj.childNodes[q].tagName != null){if (String(obj.childNodes[q].tagName).toLowerCase() == String(tag).toLowerCase()) targ = obj.childNodes[q];}
 }
 return targ;}
 
 this._addImgObj = function(obj) {var imgObj = document.createElement("IMG");if (obj.childNodes.length > 0)obj.insertBefore(imgObj, obj.childNodes[0]);else obj.appendChild(imgObj);return imgObj;}
 
 this._setItemImage = function(item, url, dis) {if (dis == true)item.imgEn = url;else item.imgDis = url;if ((!item.state && dis == true)|| (item.state && dis == false)) return;var imgObj = this._getObj(item.obj, "img");if (imgObj == null)imgObj = this._addImgObj(item.obj);imgObj.src = this.imagePath+url;}
 this._clearItemImage = function(item, dis) {if (dis == true)item.imgEn = "";else item.imgDis = "";if ((!item.state && dis == true)|| (item.state && dis == false)) return;var imgObj = this._getObj(item.obj, "img");if (imgObj != null)imgObj.parentNode.removeChild(imgObj);}
 
 this._setItemText = function(item, text) {var txtObj = this._getObj(item.obj, "div");if (text == null || text.length == 0){if (txtObj != null)txtObj.parentNode.removeChild(txtObj);return;}
 if (txtObj == null){txtObj = document.createElement("DIV");item.obj.appendChild(txtObj);}
 txtObj.innerHTML = text;}
 this._getItemText = function(item) {var txtObj = this._getObj(item.obj, "div");if (txtObj != null)return txtObj.innerHTML;return "";}
 
 
 this._enableItem = function(item) {if (item.state)return;item.state = true;if (this.objPull[item.id]["type"] == "buttonTwoState" && this.objPull[item.id]["obj"]["pressed"] == true){item.obj.className = "dhx_toolbar_btn pres";item.obj.renderAs = "dhx_toolbar_btn over";}else {item.obj.className = "dhx_toolbar_btn def";item.obj.renderAs = item.obj.className;}
 if (item.arw)item.arw.className = String(item.obj.className).replace("btn","arw");var imgObj = this._getObj(item.obj, "img");if (item.imgEn != ""){if (imgObj == null)imgObj = this._addImgObj(item.obj);imgObj.src = this.imagePath+item.imgEn;}else {if (imgObj != null)imgObj.parentNode.removeChild(imgObj);}
 }
 this._disableItem = function(item) {if (!item.state)return;item.state = false;item.obj.className = "dhx_toolbar_btn "+(this.objPull[item.id]["type"]=="buttonTwoState"&&item.obj.pressed?"pres_":"")+"dis";item.obj.renderAs = "dhx_toolbar_btn def";if (item.arw)item.arw.className = String(item.obj.className).replace("btn","arw");var imgObj = this._getObj(item.obj, "img");if (item.imgDis != ""){if (imgObj == null)imgObj = this._addImgObj(item.obj);imgObj.src = this.imagePath+item.imgDis;}else {if (imgObj != null)imgObj.parentNode.removeChild(imgObj);}
 
 
 if (item.polygon != null){if (item.polygon.style.display != "none"){item.polygon.style.display = "none";if (item.polygon._ie6cover)item.polygon._ie6cover.style.display = "none";if (this.skin == "dhx_terrace")this._improveTerraceButtonSelect(item.id, true);}
 }
 this.anyUsed = "none";}
 
 
 this.clearAll = function() {for (var a in this.objPull)this._removeItem(String(a).replace(this.idPrefix,""));}
 
 
 
 this._isWebToolbar = true;this._doOnClick = function(e) {if (main_self && main_self.forEachItem){main_self.forEachItem(function(itemId){if (main_self.objPull[main_self.idPrefix+itemId]["type"] == "buttonSelect"){var item = main_self.objPull[main_self.idPrefix+itemId];if (item.arw._skip === true){item.arw._skip = false;}else if (item.polygon.style.display != "none"){item.obj.renderAs = "dhx_toolbar_btn def";item.obj.className = item.obj.renderAs;item.arw.className = String(item.obj.renderAs).replace("btn","arw");main_self.anyUsed = "none";item.polygon.style.display = "none";if (item.polygon._ie6cover)item.polygon._ie6cover.style.display = "none";if (main_self.skin == "dhx_terrace")main_self._improveTerraceButtonSelect(item.id, true);}
 }
 });}
 }
 if (this._isIPad){document.addEventListener("touchstart", this._doOnClick, false);}else {if (_isIE)document.body.attachEvent("onmousedown", this._doOnClick);else window.addEventListener("mousedown", this._doOnClick, false);}
 
 
 return this;}
dhtmlXToolbarObject.prototype.addSpacer = function(nextToId) {var nti = this.idPrefix+nextToId;if (this._spacer != null){if (this._spacer.idd == nextToId)return;if (this._spacer == this.objPull[nti].obj.parentNode){var doMove = true;while (doMove){var idd = this._spacer.childNodes[0].idd;this.base.appendChild(this._spacer.childNodes[0]);if (idd == nextToId || this._spacer.childNodes.length == 0){if (this.objPull[nti].arw != null)this.base.appendChild(this.objPull[nti].arw);doMove = false;}
 }
 this._spacer.idd = nextToId;this._fixSpacer();return;}
 
 if (this.base == this.objPull[nti].obj.parentNode){var doMove = true;var chArw = (this.objPull[nti].arw!=null);while (doMove){var q = this.base.childNodes.length-1;if (chArw == true)if (this.base.childNodes[q] == this.objPull[nti].arw)doMove = false;if (this.base.childNodes[q].idd == nextToId)doMove = false;if (doMove){if (this._spacer.childNodes.length > 0)this._spacer.insertBefore(this.base.childNodes[q], this._spacer.childNodes[0]);else this._spacer.appendChild(this.base.childNodes[q]);}
 }
 this._spacer.idd = nextToId;this._fixSpacer();return;}
 
 }else {var np = null;for (var q=0;q<this.base.childNodes.length;q++){if (this.base.childNodes[q] == this.objPull[this.idPrefix+nextToId].obj){np = q;if (this.objPull[this.idPrefix+nextToId].arw != null)np = q+1;}
 }
 if (np != null){this._spacer = document.createElement("DIV");this._spacer.className = "dhxtoolbar_spacer "+(this.align=="right"?" float_left":" float_right");this._spacer.dir = "ltr";this._spacer.idd = nextToId;while (this.base.childNodes.length > np+1)this._spacer.appendChild(this.base.childNodes[np+1]);this.cont.appendChild(this._spacer);this._fixSpacer();}
 }
 if (this.skin == "dhx_terrace")this._improveTerraceSkin();}
dhtmlXToolbarObject.prototype.removeSpacer = function() {if (!this._spacer)return;while (this._spacer.childNodes.length > 0)this.base.appendChild(this._spacer.childNodes[0]);this._spacer.parentNode.removeChild(this._spacer);this._spacer = null;if (this.skin == "dhx_terrace")this._improveTerraceSkin();}
dhtmlXToolbarObject.prototype._fixSpacer = function() {if (_isIE && this._spacer != null){this._spacer.style.borderLeft = "1px solid #a4bed4";var k = this._spacer;window.setTimeout(function(){k.style.borderLeft="0px solid #a4bed4";k=null;},1);}
}
dhtmlXToolbarObject.prototype.getType = function(itemId) {var parentId = this.getParentId(itemId);if (parentId != null){var typeExt = null;var itemData = this.objPull[this.idPrefix+parentId]._listOptions[itemId];if (itemData != null)if (itemData.sep != null)typeExt = "buttonSelectSeparator";else typeExt = "buttonSelectButton";return typeExt;}else {if (this.objPull[this.idPrefix+itemId] == null)return null;return this.objPull[this.idPrefix+itemId]["type"];}
}
dhtmlXToolbarObject.prototype.getTypeExt = function(itemId) {var type = this.getType(itemId);if (type == "buttonSelectButton" || type == "buttonSelectSeparator"){if (type == "buttonSelectButton")type = "button";else type = "separator";return type;}
 return null;}
dhtmlXToolbarObject.prototype.inArray = function(array, value) {for (var q=0;q<array.length;q++){if (array[q]==value)return true;}
 return false;}
dhtmlXToolbarObject.prototype.getParentId = function(listId) {var parentId = null;for (var a in this.objPull)if (this.objPull[a]._listOptions)for (var b in this.objPull[a]._listOptions)if (b == listId)parentId = String(a).replace(this.idPrefix,"");return parentId;}
dhtmlXToolbarObject.prototype._addItem = function(itemData, pos) {this._addItemToStorage(itemData, pos);if (this.skin == "dhx_terrace")this._improveTerraceSkin();}
dhtmlXToolbarObject.prototype.addButton = function(id, pos, text, imgEnabled, imgDisabled) {this._addItem({id:id, type:"button", text:text, img:imgEnabled, imgdis:imgDisabled}, pos);}
dhtmlXToolbarObject.prototype.addText = function(id, pos, text) {this._addItem({id:id,type:"text",text:text}, pos);}
dhtmlXToolbarObject.prototype.addButtonSelect = function(id, pos, text, opts, imgEnabled, imgDisabled, renderSelect, openAll, maxOpen, mode) {var items = [];for (var q=0;q<opts.length;q++){var u = {};if (opts[q].id && opts[q].type){u.id = opts[q].id;u.type = (opts[q].type=="obj"?"button":"separator");u.text = opts[q].text;u.img = opts[q].img;}else {u.id = opts[q][0];u.type = (opts[q][1]=="obj"?"button":"separator");u.text = (opts[q][2]||null);u.img = (opts[q][3]||null);}
 items[items.length] = u;}
 this._addItem({id:id, type:"buttonSelect", text:text, img:imgEnabled, imgdis:imgDisabled, renderSelect:renderSelect, openAll:openAll, items:items, maxOpen:maxOpen, mode:mode}, pos);}
dhtmlXToolbarObject.prototype.addButtonTwoState = function(id, pos, text, imgEnabled, imgDisabled) {this._addItem({id:id, type:"buttonTwoState", img:imgEnabled, imgdis:imgDisabled, text:text}, pos);}
dhtmlXToolbarObject.prototype.addSeparator = function(id, pos) {this._addItem({id:id,type:"separator"}, pos);}
dhtmlXToolbarObject.prototype.addSlider = function(id, pos, len, valueMin, valueMax, valueNow, textMin, textMax, tip) {this._addItem({id:id, type:"slider", length:len, valueMin:valueMin, valueMax:valueMax, valueNow:valueNow, textMin:textMin, textMax:textMax, toolTip:tip}, pos);}
dhtmlXToolbarObject.prototype.addInput = function(id, pos, value, width) {this._addItem({id:id,type:"buttonInput",value:value,width:width}, pos);}
dhtmlXToolbarObject.prototype.forEachItem = function(handler) {for (var a in this.objPull){if (this.inArray(this.rootTypes, this.objPull[a]["type"])) {handler(this.objPull[a]["id"].replace(this.idPrefix,""));}
 }
};(function(){var list="isVisible,enableItem,disableItem,isEnabled,setItemText,getItemText,setItemToolTip,getItemToolTip,getInput,setItemImage,setItemImageDis,clearItemImage,clearItemImageDis,setItemState,getItemState,setItemToolTipTemplate,getItemToolTipTemplate,setValue,getValue,setMinValue,getMinValue,setMaxValue,getMaxValue,setWidth,getWidth,setMaxOpen".split(",")
 var ret=[false,"","",false,"","","","","","","","","",false,"","","",null,"",[null,null],"",[null,null],"",null]
 var functor=function(name,res){return function(itemId,a,b){itemId = this.idPrefix+itemId;if (this.objPull[itemId][name] != null)return this.objPull[itemId][name].call(this.objPull[itemId],a,b);else return res;};}
 for (var i=0;i<list.length;i++){var name=list[i];var res=ret[i];dhtmlXToolbarObject.prototype[name] = functor(name,res);}
})();dhtmlXToolbarObject.prototype.showItem = function(itemId) {itemId = this.idPrefix+itemId;if (this.objPull[itemId] != null && this.objPull[itemId].showItem != null){this.objPull[itemId].showItem();if (this.skin == "dhx_terrace")this._improveTerraceSkin();}
}
dhtmlXToolbarObject.prototype.hideItem = function(itemId) {itemId = this.idPrefix+itemId;if (this.objPull[itemId] != null && this.objPull[itemId].hideItem != null){this.objPull[itemId].hideItem();if (this.skin == "dhx_terrace")this._improveTerraceSkin();}
}
dhtmlXToolbarObject.prototype.getPosition = function(itemId) {return this._getPosition(itemId);}
dhtmlXToolbarObject.prototype._getPosition = function(id, getRealPosition) {if (this.objPull[this.idPrefix+id] == null)return null;var pos = null;var w = 0;for (var q=0;q<this.base.childNodes.length;q++){if (this.base.childNodes[q].idd != null){if (this.base.childNodes[q].idd == id)pos = w;w++;}
 }
 if (!pos && this._spacer != null){for (var q=0;q<this._spacer.childNodes.length;q++){if (this._spacer.childNodes[q].idd != null){if (this._spacer.childNodes[q].idd == id)pos = w;w++;}
 }
 }
 return pos;}
dhtmlXToolbarObject.prototype.setPosition = function(itemId, pos) {this._setPosition(itemId, pos);}
dhtmlXToolbarObject.prototype._setPosition = function(id, pos) {if (this.objPull[this.idPrefix+id] == null)return;if (isNaN(pos)) pos = this.base.childNodes.length;if (pos < 0)pos = 0;var spacerId = null;if (this._spacer){spacerId = this._spacer.idd;this.removeSpacer();}
 
 var item = this.objPull[this.idPrefix+id];this.base.removeChild(item.obj);if (item.arw)this.base.removeChild(item.arw);var newPos = this._getIdByPosition(pos, true);if (newPos[0] == null){this.base.appendChild(item.obj);if (item.arw)this.base.appendChild(item.arw);}else {this.base.insertBefore(item.obj, this.base.childNodes[newPos[1]]);if (item.arw)this.base.insertBefore(item.arw, this.base.childNodes[newPos[1]+1]);}
 if (spacerId != null)this.addSpacer(spacerId);}
dhtmlXToolbarObject.prototype._getIdByPosition = function(pos, retRealPos) {var id = null;var w = 0;var realPos = 0;for (var q=0;q<this.base.childNodes.length;q++){if (this.base.childNodes[q]["idd"] != null && id == null){if ((w++)== pos) id = this.base.childNodes[q]["idd"];}
 if (id == null)realPos++;}
 realPos = (id==null?null:realPos);return (retRealPos==true?new Array(id, realPos):id);}
dhtmlXToolbarObject.prototype.removeItem = function(itemId) {this._removeItem(itemId);if (this.skin == "dhx_terrace")this._improveTerraceSkin();};dhtmlXToolbarObject.prototype._removeItem = function(itemId) {var t = this.getType(itemId);itemId = this.idPrefix+itemId;var p = this.objPull[itemId];if (t == "button"){p.obj._doOnMouseOver = null;p.obj._doOnMouseOut = null;p.obj._doOnMouseUp = null;p.obj._doOnMouseUpOnceAnywhere = null;p.obj.onclick = null;p.obj.onmouseover = null;p.obj.onmouseout = null;p.obj.onmouseup = null;p.obj.onmousedown = null;p.obj.onselectstart = null;p.obj.renderAs = null;p.obj.idd = null;p.obj.parentNode.removeChild(p.obj);p.obj = null;p.id = null;p.state = null;p.img = null;p.imgEn = null;p.imgDis = null;p.type = null;p.enableItem = null;p.disableItem = null;p.isEnabled = null;p.showItem = null;p.hideItem = null;p.isVisible = null;p.setItemText = null;p.getItemText = null;p.setItemImage = null;p.clearItemImage = null;p.setItemImageDis = null;p.clearItemImageDis = null;p.setItemToolTip = null;p.getItemToolTip = null;}
 
 if (t == "buttonTwoState"){p.obj._doOnMouseOver = null;p.obj._doOnMouseOut = null;p.obj.onmouseover = null;p.obj.onmouseout = null;p.obj.onmousedown = null;p.obj.onselectstart = null;p.obj.renderAs = null;p.obj.idd = null;p.obj.parentNode.removeChild(p.obj);p.obj = null;p.id = null;p.state = null;p.img = null;p.imgEn = null;p.imgDis = null;p.type = null;p.enableItem = null;p.disableItem = null;p.isEnabled = null;p.showItem = null;p.hideItem = null;p.isVisible = null;p.setItemText = null;p.getItemText = null;p.setItemImage = null;p.clearItemImage = null;p.setItemImageDis = null;p.clearItemImageDis = null;p.setItemToolTip = null;p.getItemToolTip = null;p.setItemState = null;p.getItemState = null;}
 
 if (t == "buttonSelect"){for (var a in p._listOptions)this.removeListOption(itemId, a);p._listOptions = null;if (p.polygon._ie6cover){document.body.removeChild(p.polygon._ie6cover);p.polygon._ie6cover = null;}
 
 p.p_tbl.removeChild(p.p_tbody);p.polygon.removeChild(p.p_tbl);p.polygon.onselectstart = null;document.body.removeChild(p.polygon);p.p_tbody = null;p.p_tbl = null;p.polygon = null;p.obj.onclick = null;p.obj.onmouseover = null;p.obj.onmouseout = null;p.obj.onmouseup = null;p.obj.onmousedown = null;p.obj.onselectstart = null;p.obj.idd = null;p.obj.iddPrefix = null;p.obj.parentNode.removeChild(p.obj);p.obj = null;p.arw.onclick = null;p.arw.onmouseover = null;p.arw.onmouseout = null;p.arw.onmouseup = null;p.arw.onmousedown = null;p.arw.onselectstart = null;p.arw.parentNode.removeChild(p.arw);p.arw = null;p.renderSelect = null;p.state = null;p.type = null;p.id = null;p.img = null;p.imgEn = null;p.imgDis = null;p.openAll = null;p._isListButton = null;p._separatorButtonSelectObject = null;p._buttonButtonSelectObject = null;p.setWidth = null;p.enableItem = null;p.disableItem = null;p.isEnabled = null;p.showItem = null;p.hideItem = null;p.isVisible = null;p.setItemText = null;p.getItemText = null;p.setItemImage = null;p.clearItemImage = null;p.setItemImageDis = null;p.clearItemImageDis = null;p.setItemToolTip = null;p.getItemToolTip = null;p.addListOption = null;p.removeListOption = null;p.showListOption = null;p.hideListOption = null;p.isListOptionVisible = null;p.enableListOption = null;p.disableListOption = null;p.isListOptionEnabled = null;p.setListOptionPosition = null;p.getListOptionPosition = null;p.setListOptionImage = null;p.getListOptionImage = null;p.clearListOptionImage = null;p.setListOptionText = null;p.getListOptionText = null;p.setListOptionToolTip = null;p.getListOptionToolTip = null;p.forEachListOption = null;p.getAllListOptions = null;p.setListOptionSelected = null;p.getListOptionSelected = null;}
 
 if (t == "buttonInput"){p.obj.childNodes[0].onkeydown = null;p.obj.removeChild(p.obj.childNodes[0]);p.obj.w = null;p.obj.idd = null;p.obj.parentNode.removeChild(p.obj);p.obj = null;p.id = null;p.type = null;p.enableItem = null;p.disableItem = null;p.isEnabled = null;p.showItem = null;p.hideItem = null;p.isVisible = null;p.setItemToolTip = null;p.getItemToolTip = null;p.setWidth = null;p.getWidth = null;p.setValue = null;p.getValue = null;p.setItemText = null;p.getItemText = null;}
 
 if (t == "slider"){if (this._isIPad){document.removeEventListener("touchmove", pen._doOnMouseMoveStart, false);document.removeEventListener("touchend", pen._doOnMouseMoveEnd, false);}else {if (_isIE){document.body.detachEvent("onmousemove", p.pen._doOnMouseMoveStart);document.body.detachEvent("onmouseup", p.pen._doOnMouseMoveEnd);}else {window.removeEventListener("mousemove", p.pen._doOnMouseMoveStart, false);window.removeEventListener("mouseup", p.pen._doOnMouseMoveEnd, false);}
 }
 
 p.pen.allowMove = null;p.pen.initXY = null;p.pen.maxX = null;p.pen.minX = null;p.pen.nowX = null;p.pen.newNowX = null;p.pen.valueMax = null;p.pen.valueMin = null;p.pen.valueNow = null;p.pen._definePos = null;p.pen._detectLimits = null;p.pen._doOnMouseMoveStart = null;p.pen._doOnMouseMoveEnd = null;p.pen.onmousedown = null;p.obj.removeChild(p.pen);p.pen = null;p.label.tip = null;document.body.removeChild(p.label);p.label = null;p.obj.onselectstart = null;p.obj.idd = null;while (p.obj.childNodes.length > 0)p.obj.removeChild(p.obj.childNodes[0]);p.obj.parentNode.removeChild(p.obj);p.obj = null;p.id = null;p.type = null;p.state = null;p.enableItem = null;p.disableItem = null;p.isEnabled = null;p.setItemToolTipTemplate = null;p.getItemToolTipTemplate = null;p.setMaxValue = null;p.setMinValue = null;p.getMaxValue = null;p.getMinValue = null;p.setValue = null;p.getValue = null;p.showItem = null;p.hideItem = null;p.isVisible = null;}
 
 if (t == "separator"){p.obj.onselectstart = null;p.obj.idd = null;p.obj.parentNode.removeChild(p.obj);p.obj = null;p.id = null;p.type = null;p.showItem = null;p.hideItem = null;p.isVisible = null;}
 
 if (t == "text"){p.obj.onselectstart = null;p.obj.idd = null;p.obj.parentNode.removeChild(p.obj);p.obj = null;p.id = null;p.type = null;p.showItem = null;p.hideItem = null;p.isVisible = null;p.setWidth = null;p.setItemText = null;p.getItemText = null;}
 
 t = null;p = null;this.objPull[this.idPrefix+itemId] = null;delete this.objPull[this.idPrefix+itemId];};(function(){var list="addListOption,removeListOption,showListOption,hideListOption,isListOptionVisible,enableListOption,disableListOption,isListOptionEnabled,setListOptionPosition,getListOptionPosition,setListOptionText,getListOptionText,setListOptionToolTip,getListOptionToolTip,setListOptionImage,getListOptionImage,clearListOptionImage,forEachListOption,getAllListOptions,setListOptionSelected,getListOptionSelected".split(",")
 var functor = function(name){return function(parentId,a,b,c,d,e){parentId = this.idPrefix+parentId;if (this.objPull[parentId] == null)return;if (this.objPull[parentId]["type"] != "buttonSelect")return;return this.objPull[parentId][name].call(this.objPull[parentId],a,b,c,d,e);}
 }
 for (var i=0;i<list.length;i++){var name=list[i];dhtmlXToolbarObject.prototype[name]=functor(name)
 }
})()











































dhtmlXToolbarObject.prototype._rtlParseBtn = function(t1, t2) {return t1+t2;}
dhtmlXToolbarObject.prototype._separatorObject = function(that, id, data) {this.id = that.idPrefix+id;this.obj = document.createElement("DIV");this.obj.className = "dhx_toolbar_sep";this.obj.style.display = (data.hidden!=null?"none":"");this.obj.idd = String(id);this.obj.title = (data.title||"");this.obj.onselectstart = function(e) {e = e||event;e.returnValue = false;}
 if (that._isIPad){this.obj.ontouchstart = function(e){e = e||event;e.returnValue = false;e.cancelBubble = true;return false;}
 }
 
 
 that.base.appendChild(this.obj);this.showItem = function() {this.obj.style.display = "";}
 this.hideItem = function() {this.obj.style.display = "none";}
 this.isVisible = function() {return (this.obj.style.display == "");}
 
 return this;}
dhtmlXToolbarObject.prototype._textObject = function(that, id, data) {this.id = that.idPrefix+id;this.obj = document.createElement("DIV");this.obj.className = "dhx_toolbar_text";this.obj.style.display = (data.hidden!=null?"none":"");this.obj.idd = String(id);this.obj.title = (data.title||"");this.obj.onselectstart = function(e) {e = e||event;e.returnValue = false;}
 if (that._isIPad){this.obj.ontouchstart = function(e){e = e||event;e.returnValue = false;e.cancelBubble = true;return false;}
 }
 
 this.obj.innerHTML = (data.text||"");that.base.appendChild(this.obj);this.showItem = function() {this.obj.style.display = "";}
 this.hideItem = function() {this.obj.style.display = "none";}
 this.isVisible = function() {return (this.obj.style.display == "");}
 this.setItemText = function(text) {this.obj.innerHTML = text;}
 this.getItemText = function() {return this.obj.innerHTML;}
 this.setWidth = function(width) {this.obj.style.width = width+"px";}
 this.setItemToolTip = function(t) {this.obj.title = t;}
 this.getItemToolTip = function() {return this.obj.title;}
 
 return this;}
dhtmlXToolbarObject.prototype._buttonObject = function(that, id, data) {this.id = that.idPrefix+id;this.state = (data.enabled!=null?false:true);this.imgEn = (data.img||"");this.imgDis = (data.imgdis||"");this.img = (this.state?(this.imgEn!=""?this.imgEn:""):(this.imgDis!=""?this.imgDis:""));this.obj = document.createElement("DIV");this.obj.className = "dhx_toolbar_btn "+(this.state?"def":"dis");this.obj.style.display = (data.hidden!=null?"none":"");this.obj.allowClick = false;this.obj.extAction = (data.action||null);this.obj.renderAs = this.obj.className;this.obj.idd = String(id);this.obj.title = (data.title||"");this.obj.pressed = false;this.obj.innerHTML = that._rtlParseBtn((this.img!=""?"<img src='"+that.imagePath+this.img+"'>":""), (data.text!=null?"<div>"+data.text+"</div>":""));var obj = this;this.obj.onselectstart = function(e) {e = e||event;e.returnValue = false;}
 this.obj.onmouseover = function() {this._doOnMouseOver();}
 this.obj.onmouseout = function() {this._doOnMouseOut();}
 this.obj._doOnMouseOver = function() {this.allowClick = true;if (obj.state == false)return;if (that.anyUsed != "none")return;this.className = "dhx_toolbar_btn over";this.renderAs = this.className;}
 this.obj._doOnMouseOut = function() {this.allowClick = false;if (obj.state == false)return;if (that.anyUsed != "none")return;this.className = "dhx_toolbar_btn def";this.renderAs = this.renderAs;}
 
 this.obj.onclick = function(e) {if (obj.state == false)return;if (this.allowClick == false)return;e = e||event;var id = this.idd.replace(that.idPrefix,"");if (this.extAction)try {window[this.extAction](id);}catch(e){};if(that&&that.callEvent)that.callEvent("onClick", [id]);}
 
 this.obj[that._isIPad?"ontouchstart":"onmousedown"] = function(e) {if (obj.state == false){e = e||event;e.returnValue = false;e.cancelBubble = true;return false;}
 if (that.anyUsed != "none")return;that.anyUsed = this.idd;this.className = "dhx_toolbar_btn pres";this.pressed = true;this.onmouseover = function() {this._doOnMouseOver();}
 this.onmouseout = function() {that.anyUsed = "none";this._doOnMouseOut();}
 return false;}
 this.obj[that._isIPad?"ontouchend":"onmouseup"] = function(e) {if (obj.state == false)return;if (that.anyUsed != "none"){if (that.anyUsed != this.idd)return;}
 var t = that.anyUsed;this._doOnMouseUp();if (that._isIPad && t != "none")that.callEvent("onClick", [this.idd.replace(that.idPrefix,"")]);}
 if (that._isIPad){this.obj.ontouchmove = function(e) {this._doOnMouseUp();}
 }
 this.obj._doOnMouseUp = function() {that.anyUsed = "none";this.className = this.renderAs;this.pressed = false;}
 this.obj._doOnMouseUpOnceAnywhere = function() {this._doOnMouseUp();this.onmouseover = function() {this._doOnMouseOver();}
 this.onmouseout = function() {this._doOnMouseOut();}
 }
 
 
 that.base.appendChild(this.obj);this.enableItem = function() {that._enableItem(this);}
 this.disableItem = function() {that._disableItem(this);}
 this.isEnabled = function() {return this.state;}
 this.showItem = function() {this.obj.style.display = "";}
 this.hideItem = function() {this.obj.style.display = "none";}
 this.isVisible = function() {return (this.obj.style.display == "");}
 this.setItemText = function(text) {that._setItemText(this, text);}
 this.getItemText = function() {return that._getItemText(this);}
 this.setItemImage = function(url) {that._setItemImage(this, url, true);}
 this.clearItemImage = function() {that._clearItemImage(this, true);}
 this.setItemImageDis = function(url) {that._setItemImage(this, url, false);}
 this.clearItemImageDis = function() {that._clearItemImage(this, false);}
 this.setItemToolTip = function(tip) {this.obj.title = tip;}
 this.getItemToolTip = function() {return this.obj.title;}
 return this;}
dhtmlXToolbarObject.prototype._buttonSelectObject = function(that, id, data) {this.id = that.idPrefix+id;this.state = (data.enabled!=null?(data.enabled=="true"?true:false):true);this.imgEn = (data.img||"");this.imgDis = (data.imgdis||"");this.img = (this.state?(this.imgEn!=""?this.imgEn:""):(this.imgDis!=""?this.imgDis:""));this.mode = (data.mode||"button");if (this.mode == "select"){this.openAll = true;this.renderSelect = false;if (!data.text||data.text.length==0)data.text = "&nbsp;"
 }else {this.openAll = (data.openAll=="true"||data.openAll==true||data.openAll==1||data.openAll=="1"||data.openAll=="yes"||data.openAll=="on");this.renderSelect = (data.renderSelect!=null?(data.renderSelect=="false"||data.renderSelect=="disabled"?false:true):true);}
 this.maxOpen = (!isNaN(data.maxOpen?data.maxOpen:"")?data.maxOpen:null);this._maxOpenTest = function() {if (!isNaN(this.maxOpen)) {if (!that._sbw){var t = document.createElement("DIV");t.className = "dhxtoolbar_maxopen_test";document.body.appendChild(t);var k = document.createElement("DIV");k.className = "dhxtoolbar_maxopen_test2";t.appendChild(k);that._sbw = t.offsetWidth-k.offsetWidth;t.removeChild(k);k = null;document.body.removeChild(t);t = null;}
 }
 }
 this._maxOpenTest();this.obj = document.createElement("DIV");this.obj.allowClick = false;this.obj.extAction = (data.action||null);this.obj.className = "dhx_toolbar_btn "+(this.state?"def":"dis");this.obj.style.display = (data.hidden!=null?"none":"");this.obj.renderAs = this.obj.className;this.obj.onselectstart = function(e) {e = e||event;e.returnValue = false;}
 this.obj.idd = String(id);this.obj.title = (data.title||"");this.obj.pressed = false;this.callEvent = false;this.obj.innerHTML = that._rtlParseBtn((this.img!=""?"<img src='"+that.imagePath+this.img+"'>":""),(data.text!=null?"<div>"+data.text+"</div>":""));that.base.appendChild(this.obj);this.arw = document.createElement("DIV");this.arw.className = "dhx_toolbar_arw "+(this.state?"def":"dis");;this.arw.style.display = this.obj.style.display;this.arw.innerHTML = "<div class='arwimg'>&nbsp;</div>";this.arw.title = this.obj.title;this.arw.onselectstart = function(e) {e = e||event;e.returnValue = false;}
 that.base.appendChild(this.arw);var self = this;this.obj.onmouseover = function(e) {e = e||event;if (that.anyUsed != "none")return;if (!self.state)return;self.obj.renderAs = "dhx_toolbar_btn over";self.obj.className = self.obj.renderAs;self.arw.className = String(self.obj.renderAs).replace("btn","arw");}
 this.obj.onmouseout = function() {self.obj.allowClick = false;if (that.anyUsed != "none")return;if (!self.state)return;self.obj.renderAs = "dhx_toolbar_btn def";self.obj.className = self.obj.renderAs;self.arw.className = String(self.obj.renderAs).replace("btn","arw");self.callEvent = false;}
 this.arw.onmouseover = this.obj.onmouseover;this.arw.onmouseout = this.obj.onmouseout;if (this.openAll == true){}else {this.obj.onclick = function(e) {e = e||event;if (!self.obj.allowClick)return;if (!self.state)return;if (that.anyUsed != "none")return;var id = self.obj.idd.replace(that.idPrefix,"");if (self.obj.extAction)try {window[self.obj.extAction](id);}catch(e){};that.callEvent("onClick", [id]);}
 this.obj[that._isIPad?"ontouchstart":"onmousedown"] = function(e) {e = e||event;if (that.anyUsed != "none")return;if (!self.state)return;self.obj.allowClick = true;self.obj.className = "dhx_toolbar_btn pres";self.arw.className = "dhx_toolbar_arw pres";self.callEvent = true;}
 this.obj[that._isIPad?"ontouchend":"onmouseup"] = function(e) {e = e||event;e.cancelBubble = true;if (that.anyUsed != "none")return;if (!self.state)return;self.obj.className = self.obj.renderAs;self.arw.className = String(self.obj.renderAs).replace("btn","arw");if (that._isIPad && self.callEvent){var id = self.obj.idd.replace(that.idPrefix,"");that.callEvent("onClick", [id]);}
 }
 
 }
 
 if (that._isIPad){this.obj.ontouchmove = this.obj.onmouseout;}
 
 this.arw[that._isIPad?"ontouchstart":"onmousedown"] = function(e) {e = e||event;var st = (this.className.indexOf("dhx_toolbar_arw") === 0 ? this:this.nextSibling);if (st._skip){e = e||event;e.cancelBubble = true;}else {st._skip = true;}
 st = null;if (!self.state)return;if (that.anyUsed == self.obj.idd){self.obj.className = self.obj.renderAs;self.arw.className = String(self.obj.renderAs).replace("btn","arw");that.anyUsed = "none";self.polygon.style.display = "none";if (self.polygon._ie6cover)self.polygon._ie6cover.style.display = "none";if (that.skin == "dhx_terrace")that._improveTerraceButtonSelect(self.id, true);}else {if (that.anyUsed != "none"){if (that.objPull[that.idPrefix+that.anyUsed]["type"] == "buttonSelect"){var item = that.objPull[that.idPrefix+that.anyUsed];if (item.polygon.style.display != "none"){item.obj.renderAs = "dhx_toolbar_btn def";item.obj.className = item.obj.renderAs;item.arw.className = String(self.obj.renderAs).replace("btn","arw");item.polygon.style.display = "none";if (item.polygon._ie6cover)item.polygon._ie6cover.style.display = "none";if (that.skin == "dhx_terrace")that._improveTerraceButtonSelect(item.id, true);}
 }
 }
 self.obj.className = "dhx_toolbar_btn over";self.arw.className = "dhx_toolbar_arw pres";that.anyUsed = self.obj.idd;self.polygon.style.top = "0px";self.polygon.style.visibility = "hidden";self.polygon.style.display = "";if (that.skin == "dhx_terrace")that._improveTerraceButtonSelect(self.id, false);self._fixMaxOpenHeight(self.maxOpen||null);that._autoDetectVisibleArea();var newTop = getAbsoluteTop(self.obj)+self.obj.offsetHeight+that.selectPolygonOffsetTop;var newH = self.polygon.offsetHeight;if (newTop + newH > that.tY2){var k0 = (self.maxOpen!=null?Math.floor((that.tY2-newTop)/22):0);if (k0 >= 1){self._fixMaxOpenHeight(k0);}else {newTop = getAbsoluteTop(self.obj)-newH-that.selectPolygonOffsetTop;if (newTop < 0)newTop = 0;}
 }
 self.polygon.style.top = newTop+"px";if (that.rtl){self.polygon.style.left = getAbsoluteLeft(self.obj)+self.obj.offsetWidth-self.polygon.offsetWidth+that.selectPolygonOffsetLeft+"px";}else {var x1 = document.body.scrollLeft;var x2 = x1+(window.innerWidth||document.body.clientWidth);var newLeft = getAbsoluteLeft(self.obj)+that.selectPolygonOffsetLeft;if (newLeft+self.polygon.offsetWidth > x2)newLeft = getAbsoluteLeft(self.arw)+self.arw.offsetWidth-self.polygon.offsetWidth;self.polygon.style.left = newLeft+"px";}
 self.polygon.style.visibility = "visible";if (self.polygon._ie6cover){self.polygon._ie6cover.style.left = self.polygon.style.left;self.polygon._ie6cover.style.top = self.polygon.style.top;self.polygon._ie6cover.style.width = self.polygon.offsetWidth+"px";self.polygon._ie6cover.style.height = self.polygon.offsetHeight+"px";self.polygon._ie6cover.style.display = "";}
 }
 return false;}
 this.arw.onclick = function(e) {e = e||event;e.cancelBubble = true;}
 this.arw[that._isIPad?"ontouchend":"onmouseup"] = function(e) {e = e||event;e.cancelBubble = true;}
 
 
 if (this.openAll === true){this.obj.onclick = this.arw.onclick;this.obj.onmousedown = this.arw.onmousedown;this.obj.onmouseup = this.arw.onmouseup;if (that._isIPad){this.obj.ontouchstart = this.arw.ontouchstart;this.obj.ontouchend = this.arw.ontouchend;}
 }
 
 this.obj.iddPrefix = that.idPrefix;this._listOptions = {};this._fixMaxOpenHeight = function(maxOpen) {var h = "auto";var h0 = false;if (maxOpen !== null){var t = 0;for (var a in this._listOptions)t++;if (t > maxOpen){this._ph = 22*maxOpen;h = this._ph+"px";}else {h0 = true;}
 }
 this.polygon.style.width = "auto";this.polygon.style.height = "auto";if (!h0 && self.maxOpen != null){this.polygon.style.width = this.p_tbl.offsetWidth+that._sbw+"px";this.polygon.style.height = h;}
 }
 
 
 this._separatorButtonSelectObject = function(id, data, pos) {this.obj = {};this.obj.tr = document.createElement("TR");this.obj.tr.className = "tr_sep";this.obj.tr.onselectstart = function(e) {e = e||event;e.returnValue = false;return false;}
 this.obj.td = document.createElement("TD");this.obj.td.colSpan = "2";this.obj.td.className = "td_btn_sep";this.obj.td.onselectstart = function(e) {e = e||event;e.returnValue = false;return false;}
 
 if (isNaN(pos)) pos = self.p_tbody.childNodes.length+1;else if (pos < 1)pos = 1;if (pos > self.p_tbody.childNodes.length)self.p_tbody.appendChild(this.obj.tr);else self.p_tbody.insertBefore(this.obj.tr, self.p_tbody.childNodes[pos-1]);this.obj.tr.appendChild(this.obj.td);this.obj.sep = document.createElement("DIV");this.obj.sep.className = "btn_sep";this.obj.sep.onselectstart = function(e) {e = e||event;e.returnValue = false;return false;}
 this.obj.td.appendChild(this.obj.sep);self._listOptions[id] = this.obj;return this;}
 
 this._buttonButtonSelectObject = function(id, data, pos) {this.obj = {};this.obj.tr = document.createElement("TR");this.obj.tr.en = (data.enabled=="false"?false:(data.disabled=="true"?false:true));this.obj.tr.extAction = (data.action||null);this.obj.tr._selected = (data.selected!=null);this.obj.tr.className = "tr_btn"+(this.obj.tr.en?(this.obj.tr._selected&&self.renderSelect?" tr_btn_selected":""):" tr_btn_disabled");this.obj.tr.onselectstart = function(e) {e = e||event;e.returnValue = false;return false;}
 this.obj.tr.idd = String(id);if (data.userdata)this.obj.userData = data.userdata;if (isNaN(pos)) pos = self.p_tbody.childNodes.length+1;else if (pos < 1)pos = 1;if (pos > self.p_tbody.childNodes.length)self.p_tbody.appendChild(this.obj.tr);else self.p_tbody.insertBefore(this.obj.tr, self.p_tbody.childNodes[pos-1]);this.obj.td_a = document.createElement("TD");this.obj.td_a.className = "td_btn_img";this.obj.td_a.onselectstart = function(e) {e = e||event;e.returnValue = false;return false;}
 this.obj.td_b = document.createElement("TD");this.obj.td_b.className = "td_btn_txt";this.obj.td_b.onselectstart = function(e) {e = e||event;e.returnValue = false;return false;}
 
 if (that.rtl){this.obj.tr.appendChild(this.obj.td_b);this.obj.tr.appendChild(this.obj.td_a);}else {this.obj.tr.appendChild(this.obj.td_a);this.obj.tr.appendChild(this.obj.td_b);}
 
 
 if (data.img != null){this.obj.td_a.innerHTML = "<img class='btn_sel_img' src='"+that.imagePath+data.img+"' border='0'>";this.obj.tr._img = data.img;}
 
 
 var itemText = (data.text!=null?data.text:(data.itemText||""));this.obj.td_b.innerHTML = "<div class='btn_sel_text'>"+itemText+"</div>";this.obj.tr[that._isIPad?"ontouchstart":"onmouseover"] = function() {if (!this.en || (this._selected && self.renderSelect)) return;this.className = "tr_btn tr_btn_over";}
 
 this.obj.tr.onmouseout = function() {if (!this.en)return;if (this._selected && self.renderSelect){if (String(this.className).search("tr_btn_selected") == -1) this.className = "tr_btn tr_btn_selected";}else {this.className = "tr_btn";}
 }
 
 this.obj.tr[that._isIPad?"ontouchend":"onclick"] = function(e) {e = e||event;e.cancelBubble = true;if (!this.en)return;self.setListOptionSelected(this.idd.replace(that.idPrefix,""));self.obj.renderAs = "dhx_toolbar_btn def";self.obj.className = self.obj.renderAs;self.arw.className = String(self.obj.renderAs).replace("btn","arw");self.polygon.style.display = "none";if (self.polygon._ie6cover)self.polygon._ie6cover.style.display = "none";if (that.skin == "dhx_terrace")that._improveTerraceButtonSelect(self.id, true);that.anyUsed = "none";var id = this.idd.replace(that.idPrefix,"");if (this.extAction)try {window[this.extAction](id);}catch(e){};that.callEvent("onClick", [id]);}
 self._listOptions[id] = this.obj;return this;}
 
 
 this.polygon = document.createElement("DIV");this.polygon.dir = "ltr";this.polygon.style.display = "none";this.polygon.style.zIndex = 101;this.polygon.className = "dhx_toolbar_poly_"+that.iconSize+"_"+that.skin+(that.rtl?" rtl":"");this.polygon.onselectstart = function(e) {e = e||event;e.returnValue = false;}
 this.polygon.onmousedown = function(e) {e = e||event;e.cancelBubble = true;}
 this.polygon.style.overflowY = "auto";if (that._isIPad){this.polygon.ontouchstart = function(e){e = e||event;e.returnValue = false;e.cancelBubble = true;return false;}
 }
 
 
 
 this.p_tbl = document.createElement("TABLE");this.p_tbl.className = "buttons_cont";this.p_tbl.cellSpacing = "0";this.p_tbl.cellPadding = "0";this.p_tbl.border = "0";this.polygon.appendChild(this.p_tbl);this.p_tbody = document.createElement("TBODY");this.p_tbl.appendChild(this.p_tbody);if (data.items){for (var q=0;q<data.items.length;q++){var t = "_"+(data.items[q].type||"")+"ButtonSelectObject";if (typeof(this[t])== "function") new this[t](data.items[q].id||that._genStr(24),data.items[q]);}
 }
 
 document.body.appendChild(this.polygon);if (that._isIE6){this.polygon._ie6cover = document.createElement("IFRAME");this.polygon._ie6cover.frameBorder = 0;this.polygon._ie6cover.style.position = "absolute";this.polygon._ie6cover.style.border = "none";this.polygon._ie6cover.style.backgroundColor = "#000000";this.polygon._ie6cover.style.filter = "alpha(opacity=100)";this.polygon._ie6cover.style.display = "none";this.polygon._ie6cover.setAttribute("src","javascript:false;");document.body.appendChild(this.polygon._ie6cover);}
 
 
 
 this.setWidth = function(width) {this.obj.style.width = width-this.arw.offsetWidth+"px";this.polygon.style.width = this.obj.offsetWidth+this.arw.offsetWidth-2+"px";this.p_tbl.style.width = this.polygon.style.width;}
 this.enableItem = function() {that._enableItem(this);}
 this.disableItem = function() {that._disableItem(this);}
 this.isEnabled = function() {return this.state;}
 this.showItem = function() {this.obj.style.display = "";this.arw.style.display = "";}
 this.hideItem = function() {this.obj.style.display = "none";this.arw.style.display = "none";}
 this.isVisible = function() {return (this.obj.style.display == "");}
 this.setItemText = function(text) {that._setItemText(this, text);}
 this.getItemText = function() {return that._getItemText(this);}
 this.setItemImage = function(url) {that._setItemImage(this, url, true);}
 this.clearItemImage = function() {that._clearItemImage(this, true);}
 this.setItemImageDis = function(url) {that._setItemImage(this, url, false);}
 this.clearItemImageDis = function() {that._clearItemImage(this, false);}
 this.setItemToolTip = function(tip) {this.obj.title = tip;this.arw.title = tip;}
 this.getItemToolTip = function() {return this.obj.title;}
 
 
 this.addListOption = function(id, pos, type, text, img) {if (!(type == "button" || type == "separator")) return;var dataItem = {id:id,type:type,text:text,img:img};new this["_"+type+"ButtonSelectObject"](id, dataItem, pos);}
 
 this.removeListOption = function(id) {if (!this._isListButton(id, true)) return;var item = this._listOptions[id];if (item.td_a != null && item.td_b != null){item.td_a.onselectstart = null;item.td_b.onselectstart = null;while (item.td_a.childNodes.length > 0)item.td_a.removeChild(item.td_a.childNodes[0]);while (item.td_b.childNodes.length > 0)item.td_b.removeChild(item.td_b.childNodes[0]);item.tr.onselectstart = null;item.tr.onmouseover = null;item.tr.onmouseout = null;item.tr.onclick = null;while (item.tr.childNodes.length > 0)item.tr.removeChild(item.tr.childNodes[0]);item.tr.parentNode.removeChild(item.tr);item.td_a = null;item.td_b = null;item.tr = null;}else {item.sep.onselectstart = null;item.td.onselectstart = null;item.tr.onselectstart = null;while (item.td.childNodes.length > 0)item.td.removeChild(item.td.childNodes[0]);while (item.tr.childNodes.length > 0)item.tr.removeChild(item.tr.childNodes[0]);item.tr.parentNode.removeChild(item.tr);item.sep = null;item.td = null;item.tr = null;}
 item = null;this._listOptions[id] = null;try {delete this._listOptions[id];}catch(e) {}
 }
 
 this.showListOption = function(id) {if (!this._isListButton(id, true)) return;this._listOptions[id].tr.style.display = "";}
 
 this.hideListOption = function(id) {if (!this._isListButton(id, true)) return;this._listOptions[id].tr.style.display = "none";}
 
 this.isListOptionVisible = function(id) {if (!this._isListButton(id, true)) return;return (this._listOptions[id].tr.style.display != "none");}
 
 this.enableListOption = function(id) {if (!this._isListButton(id)) return;this._listOptions[id].tr.en = true;this._listOptions[id].tr.className = "tr_btn"+(this._listOptions[id].tr._selected&&that.renderSelect?" tr_btn_selected":"");}
 
 this.disableListOption = function(id) {if (!this._isListButton(id)) return;this._listOptions[id].tr.en = false;this._listOptions[id].tr.className = "tr_btn tr_btn_disabled";}
 
 this.isListOptionEnabled = function(id) {if (!this._isListButton(id)) return;return this._listOptions[id].tr.en;}
 
 this.setListOptionPosition = function(id, pos) {if (!this._listOptions[id] || this.getListOptionPosition(id)== pos || isNaN(pos)) return;if (pos < 1)pos = 1;var tr = this._listOptions[id].tr;this.p_tbody.removeChild(tr);if (pos > this.p_tbody.childNodes.length)this.p_tbody.appendChild(tr);else this.p_tbody.insertBefore(tr, this.p_tbody.childNodes[pos-1]);tr = null;}
 
 this.getListOptionPosition = function(id) {var pos = -1;if (!this._listOptions[id])return pos;for (var q=0;q<this.p_tbody.childNodes.length;q++)if (this.p_tbody.childNodes[q] == this._listOptions[id].tr)pos=q+1;return pos;}
 
 this.setListOptionImage = function(id, img) {if (!this._isListButton(id)) return;var td = this._listOptions[id].tr.childNodes[(that.rtl?1:0)];if (td.childNodes.length > 0){td.childNodes[0].src = that.imagePath+img;}else {var imgObj = document.createElement("IMG");imgObj.className = "btn_sel_img";imgObj.src = that.imagePath+img;td.appendChild(imgObj);}
 td = null;}
 
 this.getListOptionImage = function(id) {if (!this._isListButton(id)) return;var td = this._listOptions[id].tr.childNodes[(that.rtl?1:0)];var src = null;if (td.childNodes.length > 0)src = td.childNodes[0].src;td = null;return src;}
 
 this.clearListOptionImage = function(id) {if (!this._isListButton(id)) return;var td = this._listOptions[id].tr.childNodes[(that.rtl?1:0)];while (td.childNodes.length > 0)td.removeChild(td.childNodes[0]);td = null;}
 
 this.setListOptionText = function(id, text) {if (!this._isListButton(id)) return;this._listOptions[id].tr.childNodes[(that.rtl?0:1)].childNodes[0].innerHTML = text;}
 
 this.getListOptionText = function(id) {if (!this._isListButton(id)) return;return this._listOptions[id].tr.childNodes[(that.rtl?0:1)].childNodes[0].innerHTML;}
 
 this.setListOptionToolTip = function(id, tip) {if (!this._isListButton(id)) return;this._listOptions[id].tr.title = tip;}
 
 this.getListOptionToolTip = function(id) {if (!this._isListButton(id)) return;return this._listOptions[id].tr.title;}
 
 this.forEachListOption = function(handler) {for (var a in this._listOptions)handler(a);}
 
 this.getAllListOptions = function() {var listData = new Array();for (var a in this._listOptions)listData[listData.length] = a;return listData;}
 
 this.setListOptionSelected = function(id) {for (var a in this._listOptions){var item = this._listOptions[a];if (item.td_a != null && item.td_b != null && item.tr.en){if (a == id){item.tr._selected = true;item.tr.className = "tr_btn"+(this.renderSelect?" tr_btn_selected":"");if (this.mode == "select"){if (item.tr._img)this.setItemImage(item.tr._img);else this.clearItemImage();this.setItemText(this.getListOptionText(id));}
 }else {item.tr._selected = false;item.tr.className = "tr_btn";}
 }
 item = null;}
 }
 
 this.getListOptionSelected = function() {var id = null;for (var a in this._listOptions)if (this._listOptions[a].tr._selected == true)id = a;return id;}
 
 this._isListButton = function(id, allowSeparator) {if (this._listOptions[id] == null)return false;if (!allowSeparator && this._listOptions[id].tr.className == "tr_sep")return false;return true;}
 
 this.setMaxOpen = function(r) {this._ph = null;if (typeof(r)== "number") {this.maxOpen = r;this._maxOpenTest();return;}
 this.maxOpen = null;}
 
 if (data.width)this.setWidth(data.width);if (this.mode == "select" && typeof(data.selected)!= "undefined") this.setListOptionSelected(data.selected);return this;}
 


dhtmlXToolbarObject.prototype._buttonInputObject = function(that, id, data) {this.id = that.idPrefix+id;this.obj = document.createElement("DIV");this.obj.className = "dhx_toolbar_btn def";this.obj.style.display = (data.hidden!=null?"none":"");this.obj.idd = String(id);this.obj.w = (data.width!=null?data.width:100);this.obj.title = (data.title!=null?data.title:"");this.obj.innerHTML = "<input class='inp' type='text' style='-moz-user-select:text;width:"+this.obj.w+"px;'"+(data.value!=null?" value='"+data.value+"'":"")+">";var th = that;var self = this;this.obj.childNodes[0].onkeydown = function(e) {e = e||event;if (e.keyCode == 13){th.callEvent("onEnter", [self.obj.idd, this.value]);}
 }
 
 that.base.appendChild(this.obj);this.enableItem = function() {this.obj.childNodes[0].disabled = false;}
 this.disableItem = function() {this.obj.childNodes[0].disabled = true;}
 this.isEnabled = function() {return (!this.obj.childNodes[0].disabled);}
 this.showItem = function() {this.obj.style.display = "";}
 this.hideItem = function() {this.obj.style.display = "none";}
 this.isVisible = function() {return (this.obj.style.display != "none");}
 this.setValue = function(value) {this.obj.childNodes[0].value = value;}
 this.getValue = function() {return this.obj.childNodes[0].value;}
 this.setWidth = function(width) {this.obj.w = width;this.obj.childNodes[0].style.width = this.obj.w+"px";}
 this.getWidth = function() {return this.obj.w;}
 this.setItemToolTip = function(tip) {this.obj.title = tip;}
 this.getItemToolTip = function() {return this.obj.title;}
 this.getInput = function() {return this.obj.firstChild;}
 
 return this;}
dhtmlXToolbarObject.prototype._buttonTwoStateObject = function(that, id, data) {this.id = that.idPrefix+id;this.state = (data.enabled!=null?false:true);this.imgEn = (data.img!=null?data.img:"");this.imgDis = (data.imgdis!=null?data.imgdis:"");this.img = (this.state?(this.imgEn!=""?this.imgEn:""):(this.imgDis!=""?this.imgDis:""));this.obj = document.createElement("DIV");this.obj.pressed = (data.selected!=null);this.obj.extAction = (data.action||null);this.obj.className = "dhx_toolbar_btn "+(this.obj.pressed?"pres"+(this.state?"":"_dis"):(this.state?"def":"dis"));this.obj.style.display = (data.hidden!=null?"none":"");this.obj.renderAs = this.obj.className;this.obj.idd = String(id);this.obj.title = (data.title||"");if (this.obj.pressed){this.obj.renderAs = "dhx_toolbar_btn over";}
 
 this.obj.innerHTML = that._rtlParseBtn((this.img!=""?"<img src='"+that.imagePath+this.img+"'>":""),(data.text!=null?"<div>"+data.text+"</div>":""));that.base.appendChild(this.obj);var obj = this;this.obj.onselectstart = function(e) {e = e||event;e.returnValue = false;}
 this.obj.onmouseover = function() {this._doOnMouseOver();}
 this.obj.onmouseout = function() {this._doOnMouseOut();}
 this.obj._doOnMouseOver = function() {if (obj.state == false)return;if (that.anyUsed != "none")return;if (this.pressed){this.renderAs = "dhx_toolbar_btn over";return;}
 this.className = "dhx_toolbar_btn over";this.renderAs = this.className;}
 this.obj._doOnMouseOut = function() {if (obj.state == false)return;if (that.anyUsed != "none")return;if (this.pressed){this.renderAs = "dhx_toolbar_btn def";return;}
 this.className = "dhx_toolbar_btn def";this.renderAs = this.className;}
 this.obj[that._isIPad?"ontouchstart":"onmousedown"] = function(e) {if (that.checkEvent("onBeforeStateChange")) if (!that.callEvent("onBeforeStateChange", [this.idd.replace(that.idPrefix, ""), this.pressed])) return;if (obj.state == false)return;if (that.anyUsed != "none")return;this.pressed = !this.pressed;this.className = (this.pressed?"dhx_toolbar_btn pres":this.renderAs);var id = this.idd.replace(that.idPrefix, "");if (this.extAction)try {window[this.extAction](id, this.pressed);}catch(e){};that.callEvent("onStateChange", [id, this.pressed]);return false;}
 
 
 this.setItemState = function(state, callEvent) {if (this.obj.pressed != state){if (state == true){this.obj.pressed = true;this.obj.className = "dhx_toolbar_btn pres"+(this.state?"":"_dis");this.obj.renderAs = "dhx_toolbar_btn over";}else {this.obj.pressed = false;this.obj.className = "dhx_toolbar_btn "+(this.state?"def":"dis");this.obj.renderAs = this.obj.className;}
 if (callEvent == true){var id = this.obj.idd.replace(that.idPrefix, "");if (this.obj.extAction)try {window[this.obj.extAction](id, this.obj.pressed);}catch(e){};that.callEvent("onStateChange", [id, this.obj.pressed]);}
 }
 }
 this.getItemState = function() {return this.obj.pressed;}
 this.enableItem = function() {that._enableItem(this);}
 this.disableItem = function() {that._disableItem(this);}
 this.isEnabled = function() {return this.state;}
 this.showItem = function() {this.obj.style.display = "";}
 this.hideItem = function() {this.obj.style.display = "none";}
 this.isVisible = function() {return (this.obj.style.display == "");}
 this.setItemText = function(text) {that._setItemText(this, text);}
 this.getItemText = function() {return that._getItemText(this);}
 this.setItemImage = function(url) {that._setItemImage(this, url, true);}
 this.clearItemImage = function() {that._clearItemImage(this, true);}
 this.setItemImageDis = function(url) {that._setItemImage(this, url, false);}
 this.clearItemImageDis = function() {that._clearItemImage(this, false);}
 this.setItemToolTip = function(tip) {this.obj.title = tip;}
 this.getItemToolTip = function() {return this.obj.title;}
 
 return this;}
dhtmlXToolbarObject.prototype._sliderObject = function(that, id, data) {this.id = that.idPrefix+id;this.state = (data.enabled!=null?(data.enabled=="true"?true:false):true);this.obj = document.createElement("DIV");this.obj.className = "dhx_toolbar_btn "+(this.state?"def":"dis");this.obj.style.display = (data.hidden!=null?"none":"");this.obj.onselectstart = function(e) {e = e||event;e.returnValue = false;}
 this.obj.idd = String(id);this.obj.len = (data.length!=null?Number(data.length):50);this.obj.innerHTML = "<div>"+(data.textMin||"")+"</div>"+
 "<div class='sl_bg_l'></div>"+
 "<div class='sl_bg_m' style='width:"+this.obj.len+"px;'></div>"+
 "<div class='sl_bg_r'></div>"+
 "<div>"+(data.textMax||"")+"</div>";that.base.appendChild(this.obj);var self = this;this.pen = document.createElement("DIV");this.pen.className = "sl_pen";this.obj.appendChild(this.pen);var pen = this.pen;this.label = document.createElement("DIV");this.label.dir = "ltr";this.label.className = "dhx_toolbar_slider_label_"+that.skin+(that.rtl?"_rtl":"");this.label.style.display = "none";this.label.tip = (data.toolTip||"%v");document.body.appendChild(this.label);var label = this.label;this.pen.valueMin = (data.valueMin!=null?Number(data.valueMin):0);this.pen.valueMax = (data.valueMax!=null?Number(data.valueMax):100);if (this.pen.valueMin > this.pen.valueMax)this.pen.valueMin = this.pen.valueMax;this.pen.valueNow = (data.valueNow!=null?Number(data.valueNow):this.pen.valueMax);if (this.pen.valueNow > this.pen.valueMax)this.pen.valueNow = this.pen.valueMax;if (this.pen.valueNow < this.pen.valueMin)this.pen.valueNow = this.pen.valueMin;this.pen._detectLimits = function() {this.minX = self.obj.childNodes[1].offsetLeft-4;this.maxX = self.obj.childNodes[3].offsetLeft-this.offsetWidth+1;}
 this.pen._detectLimits();this.pen._definePos = function() {this.nowX = Math.round((this.valueNow-this.valueMin)*(this.maxX-this.minX)/(this.valueMax-this.valueMin)+this.minX);this.style.left = this.nowX+"px";this.newNowX = this.nowX;}
 this.pen._definePos();this.pen.initXY = 0;this.pen.allowMove = false;this.pen[that._isIPad?"ontouchstart":"onmousedown"] = function(e) {if (self.state == false)return;e = e||event;this.initXY = (that._isIPad?e.touches[0].clientX:e.clientX);this.newValueNow = this.valueNow;this.allowMove = true;this.className = "sl_pen over";if (label.tip != ""){label.style.visibility = "hidden";label.style.display = "";label.innerHTML = label.tip.replace("%v", this.valueNow);label.style.left = Math.round(getAbsoluteLeft(this)+this.offsetWidth/2-label.offsetWidth/2)+"px";label.style.top = getAbsoluteTop(this)-label.offsetHeight-3+"px";label.style.visibility = "";}
 }
 
 this.pen._doOnMouseMoveStart = function(e) {e=e||event;if (!pen.allowMove)return;var ecx = (that._isIPad?e.touches[0].clientX:e.clientX);var ofst = ecx - pen.initXY;if (ecx < getAbsoluteLeft(pen)+Math.round(pen.offsetWidth/2) && pen.nowX == pen.minX) return;if (ecx > getAbsoluteLeft(pen)+Math.round(pen.offsetWidth/2) && pen.nowX == pen.maxX) return;pen.newNowX = pen.nowX + ofst;if (pen.newNowX < pen.minX)pen.newNowX = pen.minX;if (pen.newNowX > pen.maxX)pen.newNowX = pen.maxX;pen.nowX = pen.newNowX;pen.style.left = pen.nowX+"px";pen.initXY = ecx;pen.newValueNow = Math.round((pen.valueMax-pen.valueMin)*(pen.newNowX-pen.minX)/(pen.maxX-pen.minX)+pen.valueMin);if (label.tip != ""){label.innerHTML = label.tip.replace(/%v/gi, pen.newValueNow);label.style.left = Math.round(getAbsoluteLeft(pen)+pen.offsetWidth/2-label.offsetWidth/2)+"px";label.style.top = getAbsoluteTop(pen)-label.offsetHeight-3+"px";}
 e.cancelBubble = true;e.returnValue = false;return false;}
 this.pen._doOnMouseMoveEnd = function() {if (!pen.allowMove)return;pen.className = "sl_pen";pen.allowMove = false;pen.nowX = pen.newNowX;pen.valueNow = pen.newValueNow;if (label.tip != "")label.style.display = "none";that.callEvent("onValueChange", [self.obj.idd.replace(that.idPrefix, ""), pen.valueNow]);}
 
 if (that._isIPad){document.addEventListener("touchmove", pen._doOnMouseMoveStart, false);document.addEventListener("touchend", pen._doOnMouseMoveEnd, false);}else {if (_isIE){document.body.attachEvent("onmousemove", pen._doOnMouseMoveStart);document.body.attachEvent("onmouseup", pen._doOnMouseMoveEnd);}else {window.addEventListener("mousemove", pen._doOnMouseMoveStart, false);window.addEventListener("mouseup", pen._doOnMouseMoveEnd, false);}
 }
 
 this.enableItem = function() {if (this.state)return;this.state = true;this.obj.className = "dhx_toolbar_btn def";}
 this.disableItem = function() {if (!this.state)return;this.state = false;this.obj.className = "dhx_toolbar_btn dis";}
 this.isEnabled = function() {return this.state;}
 this.showItem = function() {this.obj.style.display = "";}
 this.hideItem = function() {this.obj.style.display = "none";}
 this.isVisible = function() {return (this.obj.style.display == "");}
 this.setValue = function(value, callEvent) {value = Number(value);if (value < this.pen.valueMin)value = this.pen.valueMin;if (value > this.pen.valueMax)value = this.pen.valueMax;this.pen.valueNow = value;this.pen._definePos();if (callEvent == true)that.callEvent("onValueChange", [this.obj.idd.replace(that.idPrefix, ""), this.pen.valueNow]);}
 this.getValue = function() {return this.pen.valueNow;}
 this.setMinValue = function(value, label) {value = Number(value);if (value > this.pen.valueMax)return;this.obj.childNodes[0].innerHTML = label;this.obj.childNodes[0].style.display = (label.length>0?"":"none");this.pen.valueMin = value;if (this.pen.valueNow < this.pen.valueMin)this.pen.valueNow = this.pen.valueMin;this.pen._detectLimits();this.pen._definePos();}
 this.setMaxValue = function(value, label) {value = Number(value);if (value < this.pen.valueMin)return;this.obj.childNodes[4].innerHTML = label;this.obj.childNodes[4].style.display = (label.length>0?"":"none");this.pen.valueMax = value;if (this.pen.valueNow > this.pen.valueMax)this.pen.valueNow = this.pen.valueMax;this.pen._detectLimits();this.pen._definePos();}
 this.getMinValue = function() {var label = this.obj.childNodes[0].innerHTML;var value = this.pen.valueMin;return new Array(value, label);}
 this.getMaxValue = function() {var label = this.obj.childNodes[4].innerHTML;var value = this.pen.valueMax;return new Array(value, label);}
 this.setItemToolTipTemplate = function(template) {this.label.tip = template;}
 this.getItemToolTipTemplate = function() {return this.label.tip;}
 
 return this;}
dhtmlXToolbarObject.prototype.unload = function() {if (this._isIPad){document.removeEventListener("touchstart", this._doOnClick, false);}else {if (_isIE)document.body.detachEvent("onmousedown", this._doOnClick);else window.removeEventListener("mousedown", this._doOnClick, false);}
 this._doOnClick = null;this.clearAll();this.objPull = null;if (this._xmlLoader){this._xmlLoader.destructor();this._xmlLoader = null;}
 
 while (this.base.childNodes.length > 0)this.base.removeChild(this.base.childNodes[0]);this.cont.removeChild(this.base);this.base = null;while (this.cont.childNodes.length > 0)this.cont.removeChild(this.cont.childNodes[0]);this.cont.className = "";this.cont = null;this.detachAllEvents();this.tX1 = null;this.tX2 = null;this.tY1 = null;this.tY2 = null;this._isIE6 = null;this._isWebToolbar = null;this.align = null;this.anyUsed = null;this.idPrefix = null;this.imagePath = null;this.rootTypes = null;this.selectPolygonOffsetLeft = null;this.selectPolygonOffsetTop = null;this.skin = null;this._rtl = null;this._rtlParseBtn = null;this.setRTL = null;this._sbw = null;this._getObj = null;this._addImgObj = null;this._setItemImage = null;this._clearItemImage = null;this._setItemText = null;this._getItemText = null;this._enableItem = null;this._disableItem = null;this._xmlParser = null;this._doOnLoad = null;this._addItemToStorage = null;this._genStr = null;this._addItem = null;this._getPosition = null;this._setPosition = null;this._getIdByPosition = null;this._separatorObject = null;this._textObject = null;this._buttonObject = null;this._buttonSelectObject = null;this._buttonInputObject = null;this._buttonTwoStateObject = null;this._sliderObject = null;this._autoDetectVisibleArea = null;this._removeItem = null;this.setAlign = null;this.setSkin = null;this.setIconsPath = null;this.setIconPath = null;this.loadXML = null;this.loadXMLString = null;this.attachEvent = null;this.callEvent = null;this.checkEvent = null;this.eventCatcher = null;this.detachEvent = null;this.detachAllEvents = null;this.clearAll = null;this.addSpacer = null;this.removeSpacer = null;this.getType = null;this.getTypeExt = null;this.inArray = null;this.getParentId = null;this.addButton = null;this.addText = null;this.addButtonSelect = null;this.addButtonTwoState = null;this.addSeparator = null;this.addSlider = null;this.addInput = null;this.forEachItem = null;this.showItem = null;this.hideItem = null;this.isVisible = null;this.enableItem = null;this.disableItem = null;this.isEnabled = null;this.setItemText = null;this.getItemText = null;this.setItemToolTip = null;this.getItemToolTip = null;this.setItemImage = null;this.setItemImageDis = null;this.clearItemImage = null;this.clearItemImageDis = null;this.setItemState = null;this.getItemState = null;this.setItemToolTipTemplate = null;this.getItemToolTipTemplate = null;this.setValue = null;this.getValue = null;this.setMinValue = null;this.getMinValue = null;this.setMaxValue = null;this.getMaxValue = null;this.setWidth = null;this.getWidth = null;this.getPosition = null;this.setPosition = null;this.removeItem = null;this.addListOption = null;this.removeListOption = null;this.showListOption = null;this.hideListOption = null;this.isListOptionVisible = null;this.enableListOption = null;this.disableListOption = null;this.isListOptionEnabled = null;this.setListOptionPosition = null;this.getListOptionPosition = null;this.setListOptionText = null;this.getListOptionText = null;this.setListOptionToolTip = null;this.getListOptionToolTip = null;this.setListOptionImage = null;this.getListOptionImage = null;this.clearListOptionImage = null;this.forEachListOption = null;this.getAllListOptions = null;this.setListOptionSelected = null;this.getListOptionSelected = null;this.unload = null;this.setUserData = null;this.getUserData = null;this.setMaxOpen = null;this.items = null;};dhtmlXToolbarObject.prototype._autoDetectVisibleArea = function() {this.tX1 = document.body.scrollLeft;this.tX2 = this.tX1+(window.innerWidth||document.body.clientWidth);this.tY1 = Math.max((_isIE?document.documentElement:document.getElementsByTagName("html")[0]).scrollTop, document.body.scrollTop);this.tY2 = this.tY1+(_isIE?Math.max(document.documentElement.clientHeight||0,document.documentElement.offsetHeight||0,document.body.clientHeight||0):window.innerHeight);};dhtmlXToolbarObject.prototype.setUserData = function(id, name, value) {if (this.objPull[this.idPrefix+id] == null)return;var item = this.objPull[this.idPrefix+id];if (item.userData == null)item.userData = {};item.userData[name] = value;};dhtmlXToolbarObject.prototype.getUserData = function(id, name) {if (this.objPull[this.idPrefix+id] == null)return null;if (this.objPull[this.idPrefix+id].userData == null)return null;if (this.objPull[this.idPrefix+id].userData[name] == null)return null;return this.objPull[this.idPrefix+id].userData[name];};dhtmlXToolbarObject.prototype._isListOptionExists = function(listId, optionId) {if (this.objPull[this.idPrefix+listId] == null)return false;var item = this.objPull[this.idPrefix+listId];if (item.type != "buttonSelect")return false;if (item._listOptions[optionId] == null)return false;return true;};dhtmlXToolbarObject.prototype.setListOptionUserData = function(listId, optionId, name, value) {if (!this._isListOptionExists(listId, optionId)) return;var opt = this.objPull[this.idPrefix+listId]._listOptions[optionId];if (opt.userData == null)opt.userData = {};opt.userData[name] = value;};dhtmlXToolbarObject.prototype.getListOptionUserData = function(listId, optionId, name) {if (!this._isListOptionExists(listId, optionId)) return null;var opt = this.objPull[this.idPrefix+listId]._listOptions[optionId];if (!opt.userData)return null;return (opt.userData[name]?opt.userData[name]:null);};(function(){dhtmlx.extend_api("dhtmlXToolbarObject",{_init:function(obj){return [obj.parent, obj.skin];},
 icon_path:"setIconsPath",
 xml:"loadXML",
 items:"items",
 align:"setAlign",
 rtl:"setRTL",
 skin:"setSkin"
 },{items:function(arr){for (var i=0;i < arr.length;i++){var item = arr[i];if (item.type == "button")this.addButton(item.id, null, item.text, item.img, item.img_disabled);if (item.type == "separator")this.addSeparator(item.id, null);if (item.type == "text")this.addText(item.id, null, item.text);if (item.type == "buttonSelect")this.addButtonSelect(item.id, null, item.text, item.options, item.img, item.img_disabled, item.renderSelect, item.openAll, item.maxOpen);if (item.type == "buttonTwoState")this.addButtonTwoState(item.id, null, item.text, item.img, item.img_disabled);if (item.type == "buttonInput")this.addInput(item.id, null, item.text);if (item.type == "slider")this.addSlider(item.id, null, item.length, item.value_min, item.value_max, item.value_now, item.text_min, item.text_max, item.tip_template);if (item.width)this.setWidth(item.id, item.width);if (item.disabled)this.disableItem(item.id);if (item.tooltip)this.setItemToolTip(item.id, item.tooltip);if (item.pressed === true)this.setItemState(item.id, true);}
 }
 });})();function dataProcessor(serverProcessorURL){this.serverProcessor = serverProcessorURL;this.action_param="!nativeeditor_status";this.object = null;this.updatedRows = [];this.autoUpdate = true;this.updateMode = "cell";this._tMode="GET";this.post_delim = "_";this._waitMode=0;this._in_progress={};this._invalid={};this.mandatoryFields=[];this.messages=[];this.styles={updated:"font-weight:bold;",
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
};window.dhx||(dhx={});dhx.version="3.0";dhx.codebase="./";dhx.name="Core";dhx.clone=function(a){var b=dhx.clone.xa;b.prototype=a;return new b};dhx.clone.xa=function(){};dhx.extend=function(a,b,c){if(a.q)return dhx.PowerArray.insertAt.call(a.q,b,1),a;for(var d in b)if(!a[d]||c)a[d]=b[d];b.defaults&&dhx.extend(a.defaults,b.defaults);b.$init&&b.$init.call(a);return a};dhx.copy=function(a){if(arguments.length>1)var b=arguments[0],a=arguments[1];else b=dhx.isArray(a)?[]:{};for(var c in a)a[c]&&typeof a[c]=="object"&&!dhx.isDate(a[c])?(b[c]=dhx.isArray(a[c])?[]:{},dhx.copy(b[c],a[c])):b[c]=a[c];return b};dhx.single=function(a){var b=null,c=function(c){b||(b=new a({}));b.Ia&&b.Ia.apply(b,arguments);return b};return c};dhx.protoUI=function(){var a=arguments,b=a[0].name,c=function(a){if(!c)return dhx.ui[b].prototype;var e=c.q;if(e){for(var f=[e[0]],g=1;g<e.length;g++)f[g]=e[g],f[g].q&&(f[g]=f[g].call(dhx,f[g].name)),f[g].prototype&&f[g].prototype.name&&(dhx.ui[f[g].prototype.name]=f[g]);dhx.ui[b]=dhx.proto.apply(dhx,f);if(c.r)for(g=0;g<c.r.length;g++)dhx.Type(dhx.ui[b],c.r[g]);c=e=null}return this!=dhx?new dhx.ui[b](a):dhx.ui[b]};c.q=Array.prototype.slice.call(arguments,0);return dhx.ui[b]=c};dhx.proto=function(){for(var a=arguments,b=a[0],c=!!b.$init,d=[],e=a.length-1;e>0;e--){if(typeof a[e]=="function")a[e]=a[e].prototype;a[e].$init&&d.push(a[e].$init);if(a[e].defaults){var f=a[e].defaults;if(!b.defaults)b.defaults={};for(var g in f)dhx.isUndefined(b.defaults[g])&&(b.defaults[g]=f[g])}if(a[e].type&&b.type)for(g in a[e].type)b.type[g]||(b.type[g]=a[e].type[g]);for(var h in a[e])b[h]||(b[h]=a[e][h])}c&&d.push(b.$init);b.$init=function(){for(var a=0;a<d.length;a++)d[a].apply(this,arguments)};var i=function(a){this.$ready=[];this.$init(a);this.$&&this.$(a,this.defaults);for(var b=0;b<this.$ready.length;b++)this.$ready[b].call(this)};i.prototype=b;b=a=null;return i};dhx.bind=function(a,b){return function(){return a.apply(b,arguments)}};dhx.require=function(a,b,c,d,e){if(typeof a!="string"){var f=a.length||0,g=b;if(f)b=function(){if(f)f--,dhx.require(a[a.length-f-1],b,c);else return g.apply(this,arguments)},b();else{for(var h in a)f++;b=function(){f--;f===0&&g.apply(this,arguments)};for(h in a)dhx.require(h,b,c)}}else if(dhx.i[a]!==!0)if(a.substr(-4)==".css"){var i=dhx.html.create("LINK",{type:"text/css",rel:"stylesheet",href:dhx.codebase+a});document.head.appendChild(i);b&&b.call(c||window)}else{var j=e;b?dhx.i[a]?dhx.i[a].push([b,
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