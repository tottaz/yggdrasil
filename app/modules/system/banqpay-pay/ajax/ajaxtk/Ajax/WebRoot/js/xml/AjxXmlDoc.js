/*
 * Copyright (C) 2006, The Apache Software Foundation.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


// Don't directly instantiate AjxXmlDoc, use one of the create factory methods instead
function AjxXmlDoc() {
	if (!AjxXmlDoc._inited)
		AjxXmlDoc._init();
}

AjxXmlDoc.prototype.toString =
function() {
	return "AjxXmlDoc";
}

AjxXmlDoc._inited = false;
AjxXmlDoc._msxmlVers = null;

AjxXmlDoc.create =
function() {
	var xmlDoc = new AjxXmlDoc();
	var newDoc = null;
	if (AjxEnv.isIE) {
		newDoc = new ActiveXObject(AjxXmlDoc._msxmlVers);
		newDoc.async = true; // Force Async loading
		if (AjxXmlDoc._msxmlVers == "MSXML2.DOMDocument.4.0") {
			newDoc.setProperty("SelectionLanguage", "XPath");
			newDoc.setProperty("SelectionNamespaces", "xmlns:zimbra='urn:zimbra' xmlns:mail='urn:zimbraMail' xmlns:account='urn:zimbraAccount'");
		}
	} else if (document.implementation && document.implementation.createDocument) {
		newDoc = document.implementation.createDocument("", "", null);
	} else {
		throw new AjxException("Unable to create new Doc", AjxException.INTERNAL_ERROR, "AjxXmlDoc.create");
	}
	xmlDoc._doc = newDoc;
	return xmlDoc;
}

AjxXmlDoc.createFromDom =
function(doc) {
	var xmlDoc = new AjxXmlDoc();
	xmlDoc._doc = doc;
	return xmlDoc;
}

AjxXmlDoc.createFromXml =
function(xml) {
	var xmlDoc = AjxXmlDoc.create();
	xmlDoc.loadFromString(xml);
	return xmlDoc;
}

AjxXmlDoc.getXml =
function(node) {
	var ser = new XMLSerializer();
	return ser.serializeToString(node);
}

AjxXmlDoc.prototype.getDoc =
function() {
	return this._doc;
}

AjxXmlDoc.prototype.loadFromString =
function(str) {
	var doc = this._doc;
	doc.loadXML(str);
	if (AjxEnv.isIE) {
		if (doc.parseError.errorCode != 0)
			throw new AjxException(doc.parseError.reason, AjxException.INVALID_PARAM, "AjxXmlDoc.loadFromString");
	}
}

AjxXmlDoc.prototype.loadFromUrl =
function(url) {
	this._doc.load(url);
}

/**
 * This function tries to create a JavaScript representation of the DOM.  Why,
 * because it's so much fun to work with JS objets rather than do DOM lookups
 * using getElementsByTagName 'n stuff.
 *
 * Rules:
 *
 *   1. The top-level tag gets lost; only it's content is seen important.
 *   2. Each node will be represented as a JS object.  It's textual content
 *      will be saved in node.__msh_content (returned by toString()).
 *   3. Attributes get discarded; this might not be good in general but it's OK
 *      for the application I have in mind now.  IAE, I'll be able to fix this if
 *      anyone requires--mail mihai@zimbra.com.
 *   4. Each subnode will map to a property with its tagName in the parent
 *      node.  So, parent[subnode.tagName] == subnode.
 *   5. If multiple nodes with the same tagName have the same parent node, then
 *      parent[tagName] will be an array containing the objects, rather than a
 *      single object.
 *
 * So what this function allows us to do is for instance this:
 *
 * XML doc:
 *
 * <error>
 *   <code>404</code>
 *   <name>Not Found</name>
 *   <description>Page wasn't found on this server.</description>
 * </error>
 *
 * var obj = AjxXmlDoc.createFromXml(XML).toJSObject();
 * alert(obj.code + " " + obj.name + " " + obj.description);
 *
 * Here's an array example:
 *
 * <return>
 *   <item>
 *     <name>John Doe</name>
 *     <email>foo@bar.com</email>
 *   </item>
 *   <item>
 *     <name>Johnny Bravo</name>
 *     <email>bravo@cartoonnetwork.com</email>
 *   </item>
 * </return>
 *
 * var obj = AjxXmlDoc.createFromXml(XML).toJSObject();
 * for (var i = 0; i < obj.item.length; ++i) {
 *   alert(obj.item[i].name + " / " + obj.item[i].email);
 * }
 *
 * Note that if there's only one <item> tag, then obj.item will be an object
 * rather than an array.  And if there is no <item> tag, then obj.item will be
 * undefined.  These are cases that the calling application must take care of.
 */
AjxXmlDoc.prototype.toJSObject = 
function(dropns, lowercase, withAttrs) {
	function _node() { this.__msh_content = ''; };
	_node.prototype.toString = function() { return this.__msh_content; };
	function rec(i, o) {
		var tags = {}, t, n;
		for (i = i.firstChild; i; i = i.nextSibling) {
			if (i.nodeType == 1) {
				t = i.tagName;
				if (dropns)      t = t.replace(/^.*?:/, "");
				if (lowercase)   t = t.toLowerCase();
				n = new _node();
				if (tags[t]) {
					if (tags[t] == 1) {
						o[t] = [ o[t] ];
						tags[t] = 2;
					}
					o[t].push(n);
				} else {
					o[t] = n;
					tags[t] = 1;
				}
				//do attributes
				if(withAttrs) {
					if(i.attributes && i.attributes.length) {
						for(var ix = 0;ix<i.attributes.length;ix++) {
							attr = i.attributes[ix];
							n[attr.name] = AjxUtil.isNumeric(attr.value) ? attr.value : String(attr.value);
						}
					}
				}
				rec(i, n);
			} else if (i.nodeType == 3)
				o.__msh_content += i.nodeValue;
		}
	};
	var o = new _node();
	rec(this._doc.documentElement, o);
	return o;
};

AjxXmlDoc.prototype.getElementsByTagNameNS = 
function(ns, tag) {
	var doc = this.getDoc();
	return AjxEnv.isIE
		? doc.getElementsByTagName(ns + ":" + tag)
		: doc.getElementsByTagNameNS(ns, tag);
};

AjxXmlDoc.prototype.getFirstElementByTagNameNS = 
function(ns, tag) {
	return this.getElementsByTagNameNS(ns, tag)[0];
};

AjxXmlDoc._init =
function() {
	if (AjxEnv.isIE) {
		var msxmlVers = ["MSXML4.DOMDocument", "MSXML3.DOMDocument", "MSXML2.DOMDocument.4.0",
				 "MSXML2.DOMDocument.3.0", "MSXML2.DOMDocument", "MSXML.DOMDocument",
				 "Microsoft.XmlDom"];
		for (var i = 0; i < msxmlVers.length; i++) {
			try {
				new ActiveXObject(msxmlVers[i]);
				AjxXmlDoc._msxmlVers = msxmlVers[i];
				break;
			} catch (ex) {
			}
		}
		if (AjxXmlDoc._msxmlVers == null)
			throw new AjxException("MSXML not installed", AjxException.INTERNAL_ERROR, "AjxXmlDoc._init");
	} else if (AjxEnv.isNav) {
		// add loadXML to Document's API
		Document.prototype.loadXML = function(str) {
			var domParser = new DOMParser();
			var domObj = domParser.parseFromString(str, "text/xml");
			// remove old child nodes since we recycle DOMParser and append new
			while (this.hasChildNodes())
				this.removeChild(this.lastChild);
			for (var i = 0; i < domObj.childNodes.length; i++) {
				var importedNode = this.importNode(domObj.childNodes[i], true);
				this.appendChild(importedNode);
			}
		}

		_NodeGetXml = function() {
			var ser = new XMLSerializer();
			return ser.serializeToString(this);
		}
		Node.prototype.__defineGetter__("xml", _NodeGetXml);
	} else if (AjxEnv.isSafari) {
		// add loadXML to Document's API
		document.__proto__.loadXML = function(str) {
			var domParser = new DOMParser();
			var domObj = domParser.parseFromString(str, "text/xml");
			// remove old child nodes since we recycle DOMParser and append new
			while (this.hasChildNodes())
				this.removeChild(this.lastChild);
			for (var i = 0; i < domObj.childNodes.length; i++) {
				var importedNode = this.importNode(domObj.childNodes[i], true);
				this.appendChild(importedNode);
			}
		}
	}

	AjxXmlDoc._inited = true;
};
