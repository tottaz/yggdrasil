/*
* ***** BEGIN LICENSE BLOCK *****
* Version: MPL 1.1
*
* The contents of this file are subject to the Mozilla Public
* License Version 1.1 ("License"); you may not use this file except in
* compliance with the License. You may obtain a copy of the License at
* http://www.zimbra.com/license
*
* Software distributed under the License is distributed on an "AS IS"
* basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
* the License for the specific language governing rights and limitations
* under the License.
*
* The Original Code is: Zimbra AJAX Toolkit.
*
* The Initial Developer of the Original Code is Zimbra, Inc.
* Portions created by Zimbra are Copyright (C) 2005 Zimbra, Inc.
* All Rights Reserved.
*
* Contributor(s):
*
* ***** END LICENSE BLOCK *****
*/


// Don't directly instantiate SoapDoc, use one of the create factory methods instead
function AjxSoapDoc() {
}

AjxSoapDoc.prototype.toString =
function() {
	return "AjxSoapDoc";
};

AjxSoapDoc._SOAP_URI = "http://www.w3.org/2003/05/soap-envelope";
// AjxSoapDoc._SOAP_URI = "http://schemas.xmlsoap.org/soap/envelope/";
AjxSoapDoc._XMLNS_URI = "http://www.w3.org/2000/xmlns";

AjxSoapDoc.create =
function(method, namespace, namespaceId, soapURI) {
	var sd = new AjxSoapDoc();
	sd._xmlDoc = AjxXmlDoc.create();
	var d = sd._xmlDoc.getDoc();
	var envEl = d.createElement("soap:Envelope");

	if (!soapURI)
		soapURI = AjxSoapDoc._SOAP_URI;
	envEl.setAttribute("xmlns:soap", soapURI);

	d.appendChild(envEl);

	var bodyEl = d.createElement("soap:Body");
	envEl.appendChild(bodyEl);

	sd._methodEl = d.createElement(method);
	if (namespaceId == null)
		sd._methodEl.setAttribute("xmlns", namespace);
	else
		sd._methodEl.setAttribute("xmlns:" + namespaceId, namespace);

	bodyEl.appendChild(sd._methodEl);
	return sd;
};

AjxSoapDoc.createFromDom =
function(doc) {
	var sd = new AjxSoapDoc();
	sd._xmlDoc = AjxXmlDoc.createFromDom(doc);
	sd._methodEl = sd._check(sd._xmlDoc);
	return sd;
};

AjxSoapDoc.createFromXml =
function(xml) {
	var sd = new AjxSoapDoc();
	sd._xmlDoc = AjxXmlDoc.createFromXml(xml);
	sd._methodEl = sd._check(sd._xmlDoc);
	return sd;
};

AjxSoapDoc.element2FaultObj =
function(el) {
	// If the element is not a SOAP fault, then return null
	var faultEl = el.firstChild;
	// Safari is bad at handling namespaces
	if (!AjxEnv.isSafari) {
		if (faultEl != null && faultEl.namespaceURI != AjxSoapDoc._SOAP_URI || faultEl.nodeName != (el.prefix + ":Fault"))
			return null;
	} else {
		if (faultEl != null && faultEl.nodeName != (el.prefix + ":Fault"))
			return null;
	}
	return new AjxSoapFault(faultEl);
};

AjxSoapDoc.prototype.setMethodAttribute =
function(name, value) {
	this._methodEl.setAttribute(name, value);
};

/**
 * Creates arguments to pass within the envelope.  "value" can be a JS object
 * or a scalar (string, number, etc.).
 *
 * When "value" is a JS object, set() will call itself recursively in order to
 * create a complex data structure.  Don't pass a "way-too-complicated" object
 * ("value" should only contain references to simple JS objects, or better put,
 * hashes--don't include a reference to the "window" object as it will kill
 * your browser).
 *
 * Example:
 *
 *    soapDoc.set("user_auth", {
 *       user_name : "foo",
 *       password  : "bar"
 *    });
 *
 * will create an XML like this under the method tag:
 *
 *    <user_auth>
 *      <user_name>foo</user_name>
 *      <password>bar</password>
 *    </user_auth>
 *
 * Of course, nesting other hashes is allowed and will work as expected.
 *
 * NOTE: you can pass null for "name", in which case "value" is expected to be
 * an object whose properties will be created directly under the method el.
 */
AjxSoapDoc.prototype.set = 
function(name, value, parent) {
	var	doc = this.getDoc();
	var	p = name
		? doc.createElement(name)
		: doc.createDocumentFragment();

	if (value != null) {
		if (typeof value == "object") {
			for (i in value)
				this.set(i, value[i], p);
		} else {
			if (AjxEnv.isSafari) value = AjxStringUtil.xmlEncode(value);
			p.appendChild(doc.createTextNode(value));
		}
	}
	if (!parent)
		parent = this._methodEl;
	return parent.appendChild(p);
};

AjxSoapDoc.prototype.getMethod =
function() {
	return this._methodEl;
};

AjxSoapDoc.prototype.createHeaderElement =
function() {
	var d = this._xmlDoc.getDoc();
	var envEl = d.firstChild;
	var header = this.getHeader();
	if (header != null) {
		throw new AjxSoapException("SOAP header already exists", AjxSoapException.ELEMENT_EXISTS, "AjxSoapDoc.prototype.createHeaderElement");
	}
	header = d.createElement("soap:Header")
	envEl.insertBefore(header, envEl.firstChild);
	return header;
};

AjxSoapDoc.prototype.getHeader =
function() {
	// would love to use getElementsByTagNameNS, but IE does not support it
	var d = this._xmlDoc.getDoc();
	var nodeList = AjxEnv.isIE
		? (d.getElementsByTagName(d.firstChild.prefix + ":Header"))
		: (d.getElementsByTagNameNS(AjxSoapDoc._SOAP_URI, "Header"));

	return nodeList ? nodeList[0] : null;
};

AjxSoapDoc.prototype.getBody =
function() {
	// would love to use getElementsByTagNameNS, but IE does not support it
	var d = this._xmlDoc.getDoc();
	var nodeList = AjxEnv.isIE
		? (d.getElementsByTagName(d.firstChild.prefix + ":Body"))
		: (d.getElementsByTagNameNS(AjxSoapDoc._SOAP_URI, "Body"));

	return nodeList ? nodeList[0] : null;
};

AjxSoapDoc.prototype.getByTagName =
function(type) {
	if (type.indexOf(":") == -1)
		type = "soap:" + type;

	var a = this.getDoc().getElementsByTagName(type);

	if (a.length == 1)		return a[0];
	else if (a.length > 0)	return a;
	else					return null;
};

// gimme a header, no exceptions.
AjxSoapDoc.prototype.ensureHeader =
function() {
	return (this.getByTagName("Header") || this.createHeaderElement());
};

AjxSoapDoc.prototype.getDoc =
function() {
	return this._xmlDoc.getDoc();
};

AjxSoapDoc.prototype.getXml =
function() {
	return AjxEnv.isSafari
		? (AjxXmlDoc.getXml(this._xmlDoc.getDoc()))
		: this._xmlDoc.getDoc().xml;
};

// Very simple checking of soap doc. Should be made more comprehensive
AjxSoapDoc.prototype._check =
function(xmlDoc) {
	var doc = xmlDoc.getDoc();
	if (doc.childNodes.length != 1)
		throw new AjxSoapException("Invalid SOAP PDU", AjxSoapException.INVALID_PDU, "AjxSoapDoc.createFromXml:1");

	// Check to make sure we have a soap envelope
	var el = doc.firstChild;

	// Safari is bad at handling namespaces
	if (!AjxEnv.isSafari) {
		if (el.namespaceURI != AjxSoapDoc._SOAP_URI ||
		    el.nodeName != (el.prefix + ":Envelope") ||
		    (el.childNodes.length < 1 || el.childNodes.length > 2))
		{
			DBG.println("<font color=red>XML PARSE ERROR on RESPONSE:</font>");
			DBG.printRaw(doc.xml);
			throw new AjxSoapException("Invalid SOAP PDU", AjxSoapException.INVALID_PDU, "AjxSoapDoc.createFromXml:2");
		}
	} else {
		if (el.nodeName != (el.prefix + ":Envelope"))
			throw new AjxSoapException("Invalid SOAP PDU", AjxSoapException.INVALID_PDU, "AjxSoapDoc.createFromXml:2");
	}
};
