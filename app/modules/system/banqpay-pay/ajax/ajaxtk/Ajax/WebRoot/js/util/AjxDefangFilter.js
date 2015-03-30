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


/*
 * (C) Copyright 2002-2004, Andy Clark.  All rights reserved.
 *
 * This file is distributed under an Apache style license. Please
 * refer to the LICENSE file for specific details.
 */

/**
 * Most of this code is taken directly from the java implementation written
 * by Roland.
 */
 
/**
 * @author schemers@zimbra.com
 * 
 * very Mutated version of ElementRemover.java filter from cyberneko html.
 * change accepted/removed elements to static hashmaps for one-time 
 * initialization, switched from Hashtable to HashMap, sanatize
 * attributes, etc. 
 * 
 * TODO: more checks:
 * allow limited use of <meta> tags? like for Content-Type?
 * make sure any clicked links pop up in new window 
 * figure out how to block images by default, and how to re-enable them. styles?  
 * strict attr value checking?
 *  don't allow id attr in tags if we aren't putting html into an iframe (I'm assuming we are, and id's in iframes don't conflict with iframes elsewhere)
 * 
 *  
 * MAYBE:
 *  allow style but strip out /url(.*)/? Might have other reasons to leave it 
 * 
 */
AjxDefangFilter._inited = false;
function AjxDefangFilter(neuterImages) {
	this.mNeuterImages = neuterImages;
	if (!AjxDefangFilter._inited) {
		AjxDefangFilter._inited = true;
		AjxDefangFilter._init();
	}
}

/**
 * enable tags dealing with input ( select, input ...)
 */
AjxDefangFilter.ENABLE_INPUT_TAGS = true;
    
/**
 * enable table tags
 */
AjxDefangFilter.ENABLE_TABLE_TAGS = true;

/**
 * enable phrase tags (EM, STRONG, CITE, DFN, CODE, SAMP, KBD, VAR, ABBR, ACRONYM)
 */
AjxDefangFilter.ENABLE_PHRASE_TAGS = true;

/**
 * enable list tags (UL, OL, LI, DL, DT, DD, DIR, MENU)
 */
AjxDefangFilter.ENABLE_LIST_TAGS = true;

/**
 * enable font style tags (TT, I, B, BIG, SMALL, STRIKE, S, U) 
 */
AjxDefangFilter.ENABLE_FONT_STYLE_TAGS = true;

//
// Constants
//

/** A "null" object. */
AjxDefangFilter.NULL = new Object();

// regexes inside of attr values to strip out
AjxDefangFilter.AV_JS_ENTITY = new RegExp().compile("&\\{[^}]*\\}");
AjxDefangFilter.AV_JS_COLON = new RegExp().compile("script:","gi");
AjxDefangFilter.AV_SCRIPT_TAG = new RegExp().compile("</?script/?>","i");
AjxDefangFilter.TAG_REGEX = /<([a-zA-Z0-9]+)[\s]*[^>]*>/gi;
AjxDefangFilter.ATTR_REGEX = /([a-zA-Z]+)\s*=\s*([^\s^\"^\']*) | ([a-zA-Z]+)\s*=\s*[\"\']([^\"^\']*)[\"\']/gi;
AjxDefangFilter.ID_REGEX = /id\s*=\s*[\"\']?([^\s^\"^\']*)[\"\']?/i;
AjxDefangFilter.SRC_REGEX = /src\s*=\s*[\"\']?([^\s^\"^\']*)[\"\']?/i;
AjxDefangFilter.TARGET_REGEX = /target\s*=\s*[\"\']?([^\s^\"^\']*)[\"\']?/i;

// regex for URL. TODO: beef this up
AjxDefangFilter.ABSOLUTE_URL = new RegExp("^(https?://[\\w-]|mailto:).*", "i");

//
// Data
//

// information

/** attr Set cache */
AjxDefangFilter.mAttrSetCache = new Object();

/** Accepted elements. */
AjxDefangFilter.mAcceptedElements = new Object();

/** Removed elements. */
AjxDefangFilter.mRemovedElements = new Object();

// don't allow style
AjxDefangFilter.CORE = "id,class,title,";
AjxDefangFilter.LANG = "dir,lang,xml:lang,language";
AjxDefangFilter.CORE_LANG = AjxDefangFilter.CORE+AjxDefangFilter.LANG;
AjxDefangFilter.KBD = "accesskey,tabindex,";

AjxDefangFilter._init = function () {
	var CORE = AjxDefangFilter.CORE;
	var LANG = AjxDefangFilter.LANG;
	var CORE_LANG = AjxDefangFilter.CORE_LANG;
	var KBD = AjxDefangFilter.KBD;
	// set which elements to accept
	AjxDefangFilter.acceptElement("a", CORE+KBD+",charset,coords,href,hreflang,name,rel,rev,shape,target,type");
	AjxDefangFilter.acceptElement("address", CORE_LANG);
	//AjxDefangFilter.acceptElement("base", "href,target");
	AjxDefangFilter.acceptElement("bdo", CORE_LANG);
	AjxDefangFilter.acceptElement("blockquote", CORE_LANG+"cite");
	AjxDefangFilter.acceptElement("body", CORE_LANG+"alink,background,bgcolor,link,text,vlink");
	AjxDefangFilter.acceptElement("br", CORE);
	AjxDefangFilter.acceptElement("center", CORE_LANG);
	AjxDefangFilter.acceptElement("del", CORE_LANG+"cite,datetime");
	AjxDefangFilter.acceptElement("div", CORE_LANG+"align");
	AjxDefangFilter.acceptElement("head", LANG); // profile attr removed
	AjxDefangFilter.acceptElement("h1", CORE_LANG+"align");
	AjxDefangFilter.acceptElement("h2", CORE_LANG+"align");
	AjxDefangFilter.acceptElement("h3", CORE_LANG+"align");
	AjxDefangFilter.acceptElement("h4", CORE_LANG+"align");
	AjxDefangFilter.acceptElement("h5", CORE_LANG+"align");
	AjxDefangFilter.acceptElement("h6", CORE_LANG+"align");
	AjxDefangFilter.acceptElement("hr", CORE_LANG+"align,noshade,size,width");
	AjxDefangFilter.acceptElement("html", LANG+"xlmns");
	AjxDefangFilter.acceptElement("document", CORE_LANG+"language,datafld");
	AjxDefangFilter.acceptElement("img", CORE_LANG+"align,alt,border,height,hspace,ismap,longdesc,src,usemap,vspace,width");
	AjxDefangFilter.acceptElement("ins", CORE_LANG+"cite");
	AjxDefangFilter.acceptElement("label", CORE_LANG+"for");
	//AjxDefangFilter.acceptElement("link", CORE_LANG+"charset,href,hreflang,media,ntarget,rel,rev,type");
	
	// NOTE: comment out noframes so its text shows up, since we are nuke frame-related tags
	//AjxDefangFilter.acceptElement("noframes", CORE_LANG);
	// NOTE: comment out noscript so its text shows up, since we are nuking script tags
	//AjxDefangFilter.acceptElement("noscript", CORE_LANG); // maybe convert to always execute if we are stripping script?
	AjxDefangFilter.acceptElement("p", CORE_LANG+"align");
	AjxDefangFilter.acceptElement("pre", CORE_LANG+"width");
	AjxDefangFilter.acceptElement("q", CORE_LANG+"cite");
	AjxDefangFilter.acceptElement("span", CORE_LANG);
	
	// style removed. TODO: see if we can safely include it or not, maybe by sanatizing
	AjxDefangFilter.acceptElement("sub",  CORE_LANG);
	AjxDefangFilter.acceptElement("sup",  CORE_LANG);
	
	//AjxDefangFilter.acceptElement("title", CORE_LANG);
	AjxDefangFilter.acceptElement("title", "");
	AjxDefangFilter.acceptElement("iframe", CORE_LANG+"width,height,top,left");
	
	if (AjxDefangFilter.ENABLE_FONT_STYLE_TAGS) {
		AjxDefangFilter.acceptElement("b",  CORE_LANG);
		AjxDefangFilter.acceptElement("basefont", CORE_LANG+"color,face,size");
		AjxDefangFilter.acceptElement("big", CORE_LANG);
		AjxDefangFilter.acceptElement("font", CORE_LANG+"color,face,size");
		AjxDefangFilter.acceptElement("i", CORE_LANG);
		AjxDefangFilter.acceptElement("s", CORE_LANG);
		AjxDefangFilter.acceptElement("small", CORE_LANG);
		AjxDefangFilter.acceptElement("strike", CORE_LANG);
		AjxDefangFilter.acceptElement("tt", CORE_LANG);
		AjxDefangFilter.acceptElement("u", CORE_LANG);
	} else {
		// allow the text, just strip the tags
	}
	
	if (AjxDefangFilter.ENABLE_LIST_TAGS) {
		AjxDefangFilter.acceptElement("dir", CORE_LANG+"compact");
		AjxDefangFilter.acceptElement("dl", CORE_LANG);
		AjxDefangFilter.acceptElement("dt", CORE_LANG);
		AjxDefangFilter.acceptElement("li", CORE_LANG+"type,value");
		AjxDefangFilter.acceptElement("ol", CORE_LANG+"compact,start,type");
		AjxDefangFilter.acceptElement("ul", CORE_LANG+"compact,type");
		AjxDefangFilter.acceptElement("dd", CORE_LANG);
		AjxDefangFilter.acceptElement("menu", CORE_LANG+"compact");
	} else {
		// allow the text, just strip the tags
	}
	
	if (AjxDefangFilter.ENABLE_PHRASE_TAGS) {
		AjxDefangFilter.acceptElement("abbr", CORE_LANG);
		AjxDefangFilter.acceptElement("acronym", CORE_LANG);
		AjxDefangFilter.acceptElement("cite", CORE_LANG);
		AjxDefangFilter.acceptElement("code", CORE_LANG);
		AjxDefangFilter.acceptElement("dfn", CORE_LANG);
		AjxDefangFilter.acceptElement("em", CORE_LANG);
		AjxDefangFilter.acceptElement("kbd", CORE_LANG);
		AjxDefangFilter.acceptElement("samp", CORE_LANG);
		AjxDefangFilter.acceptElement("strong", CORE_LANG);
		AjxDefangFilter.acceptElement("var", CORE_LANG);
	} else {
		// allow the text, just strip the tags
	}
	
	if (AjxDefangFilter.ENABLE_TABLE_TAGS) {
		AjxDefangFilter.acceptElement("caption", CORE_LANG+"align");
		AjxDefangFilter.acceptElement("col",CORE_LANG+"alink,char,charoff,span,valign,width");
		AjxDefangFilter.acceptElement("colgroup", CORE_LANG+"alink,char,charoff,span,valign,width");
		AjxDefangFilter.acceptElement("table", CORE_LANG+"align,bgcolor,border,cellpadding,cellspacing,frame,rules,summary,width");
		AjxDefangFilter.acceptElement("tbody", CORE_LANG+"align,char,charoff,valign");
		AjxDefangFilter.acceptElement("td", CORE_LANG+"abbr,align,axis,bgcolor,char,charoff,colspan,headers,height,nowrap,rowspan,scope,,valign,width");
		AjxDefangFilter.acceptElement("tfoot", CORE_LANG+"align,char,charoff,valign");
		AjxDefangFilter.acceptElement("th", CORE_LANG+"abbr,align,axis,bgcolor,char,charoff,colspan,headers,height,nowrap,rowspan,scope,valign,width");
		AjxDefangFilter.acceptElement("thead", CORE_LANG+"align,char,charoff,valign");
		AjxDefangFilter.acceptElement("tr", CORE_LANG+"align,bgcolor,char,charoff,valign,height,width");
	} else {
		// allow the text, just strip the tags
	}
	
	
	if (AjxDefangFilter.ENABLE_INPUT_TAGS) {
		AjxDefangFilter.acceptElement("area", CORE_LANG+KBD+"alt,coords,href,nohref,shape,target");
		AjxDefangFilter.acceptElement("button", CORE_LANG+KBD+"disabled,name,type,value");
		AjxDefangFilter.acceptElement("fieldset", CORE_LANG);
		AjxDefangFilter.acceptElement("form", CORE_LANG+"action,accept,acceptcharset,enctype,method,name,target");
		AjxDefangFilter.acceptElement("input", CORE_LANG+"accept,align,alt,checked,disabled,maxlength,name,readonly,size,src,type,value");
		AjxDefangFilter.acceptElement("legend", CORE_LANG+"align");
		AjxDefangFilter.acceptElement("map", CORE_LANG+"name");
		AjxDefangFilter.acceptElement("optgroup", CORE_LANG+"disabled,label");
		AjxDefangFilter.acceptElement("option", CORE_LANG+KBD+"disabled,label,selected,value");
		AjxDefangFilter.acceptElement("select", CORE_LANG+KBD+"disabled,multiple,name,size");
		AjxDefangFilter.acceptElement("textarea", CORE_LANG+"cols,disabled,name,readonly,rows");
	} else {
		AjxDefangFilter.removeElement("area");
		AjxDefangFilter.removeElement("button");
		AjxDefangFilter.removeElement("fieldset");
		AjxDefangFilter.removeElement("form");
		AjxDefangFilter.removeElement("input");
		AjxDefangFilter.removeElement("legend");
		AjxDefangFilter.removeElement("map");
		AjxDefangFilter.removeElement("optgroup");
		AjxDefangFilter.removeElement("option");
		AjxDefangFilter.removeElement("select");
		AjxDefangFilter.removeElement("textarea");
	}
	
	// completely remove these elements and all enclosing tags/text
	AjxDefangFilter.removeElement("applet");
	AjxDefangFilter.removeElement("frame");
	AjxDefangFilter.removeElement("frameset");
	AjxDefangFilter.removeElement("iframe");
	AjxDefangFilter.removeElement("object");
	AjxDefangFilter.removeElement("script");
	AjxDefangFilter.removeElement("style");
	
	// don't remove "content" of these tags since they have none.
	//AjxDefangFilter.removeElement("meta");
	//AjxDefangFilter.removeElement("param");        
};

/**
 * @param neuterImages
 */

/** 
 * Specifies that the given element should be accepted and, optionally,
 * which attributes of that element should be kept.
 *
 * @param element The element to accept.
 * @param attributes The comma-seperated list of attributes to be kept or null if no
 *                   attributes should be kept for this element.
 *
 * see #removeElement
 */
AjxDefangFilter.acceptElement = function (element, attributes) {
	element = element.toLowerCase();
	var set = AjxDefangFilter.mAttrSetCache[attributes];
	if (set != null) {
		//System.out.println(element+" cached set "+set.size());
		AjxDefangFilter.mAcceptedElements[element] = set;
		return;
	}
	set = new Object();
	var attrs = attributes.toLowerCase().split(",");
	if (attrs != null && attrs.length > 0) {
		for (var i=0; i < attrs.length; i++) {
			//System.out.println(element+"["+attrs[i]+"]");
			//deal with consecutive commas
			if (attrs[i].length > 0) {
				set[attrs[i]] = attrs[i];
			}
		}
	}
	AjxDefangFilter.mAcceptedElements[element] = set;
	AjxDefangFilter.mAttrSetCache[attributes] = set;
};

/** 
 * Specifies that the given element should be completely removed. If an
 * element is encountered during processing that is on the remove list, 
 * the element's start and end tags as well as all of content contained
 * within the element will be removed from the processing stream.
 *
 * @param element The element to completely remove.
 */
AjxDefangFilter.removeElement = function (element) {
	var key = element.toLowerCase();
	var value = element;
	AjxDefangFilter.mRemovedElements[key] = value;
}; // removeElement(String)

	

/** Returns true if the specified element is accepted. */
AjxDefangFilter.prototype.elementAccepted = function (element) {
	var key = element.toLowerCase();
	return (AjxDefangFilter.mAcceptedElements[key] != null);
}; // elementAccepted(String):boolean

/** Returns true if the specified element should be removed. */
AjxDefangFilter.prototype.elementRemoved = function (element) {
	var key = element.toLowerCase();
	return (AjxDefangFilter.mRemovedElements[key] != null);
}; // elementRemoved(String):boolean

/** Handles an element. */
AjxDefangFilter.prototype.handleElement = function (element) {
	var rawName = element.tagName;
	var attributes = element.attributes
	if (this.elementAccepted(rawName)) {
		var eName = rawName.toLowerCase();
		var value = AjxDefangFilter.mAcceptedElements[eName];
		if (value != null) {
			var anames = value;
			var removalArr = new Array();
			var attrCount = attributes.length;
			var i = 0;
			var aName = null;
			for (; i < attrCount; ++i) {
				aName = attributes[i].nodeName.toLowerCase();
				if (!anames[aName]) {
					removalArr.push(aName);
				} else {
					this.sanatizeAttrValue(eName, aName, element, i);
				}
			}
			for (i=0; i < removalArr.length; ++i){
				aName = removalArr.pop();
				if (AjxEnv.isIE && aName.match(/^on/)){
					element[aName] = null;
				} else {
					element.removeAttribute(aName);
				}
			}
		} else {
			element.clearAttributes();
		}

		if (eName == "img" && this.mNeuterImages) {
			this.neuterImageTag(element);
		} else if (eName == "a") {
			this.fixATag(element);
		}

	} else if (this.elementRemoved(rawName)) {
		this._elementsForRemoval.push(element);
	}
}; // handleOpenTag(QName,XMLAttributes):boolean

AjxDefangFilter.prototype.cleanHTML = function (dirtyHTML) {
	var re = AjxDefangFilter.TAG_REGEX;
	re.lastIndex = 0;
	var cleanHTML = dirtyHTML;
	var tags = re.exec(dirtyHTML);
	var removalArray = new Array();
	var sanitizedArray = new Array();
	//AjxLog.info("tags length = " + tags.length);
	var tag = null;
	// Loop through all the tags
	while (tags != null){
		var tagName = tags[1];
		var fullTag = tags[0];
		var eName = tagName.toLowerCase();
		//AjxLog.info("Cleaning " +  tagName);
		// See if the tag is one we accept
		if (this.elementAccepted(tagName)) {
			var aNames = AjxDefangFilter.mAcceptedElements[eName];
			if (aNames != null) {
				var newTag = fullTag;
				var attrRegex = AjxDefangFilter.ATTR_REGEX;
				attrRegex.lastIndex = 0;
				var attrMatch = null;
				var attrName = null;
				var attrValue = null;
				// Parse all the attributes out of the tag, and iterate over
				// them
				while(attrMatch = attrRegex.exec(fullTag)){
					attrName = attrMatch[1]? attrMatch[1]: attrMatch[3];
					attrValue = attrMatch[2]? attrMatch[2]: attrMatch[4];
					//AjxLog.info("  Looking at attr " + attrName  + " : " +
					//	attrValue);
					// If the attribute is not accepted, 
					// remove the whole attribute. If it is accepted, pass 
					// it through a filter to sanitize the content.
					if (!aNames[attrName]){
						// remove attribute
						//AjxLog.info("    Remove single attr " + attrName);
						newTag = newTag.replace(attrMatch[0], "");
					} else {
						// sanitize
						//AjxLog.info("    Sanitize: " + attrName + " val = " +
						//attrValue);
						var newVal = this.sanatizeAttrValueStr(eName, attrName,
															   fullTag, 
															   attrValue);
						if (newVal != attrValue){
							newTag = newTag.replace(attrMatch[0], " " + 
													attrName + "='" + 
													newVal + "' ");
						}
					}
				}
				// If we're on an image tag, remove the src attribute if
				// necessary. If it's an anchor, make the target a new 
				// window.
				if (eName == "img" && this.mNeuterImages) {
					//AjxLog.info("  IMG TAG " + newTag);
					newTag = this.neuterImageTagStr(newTag);
				} else if (eName == "a") {
					newTag = this.fixATagStr(newTag);
				}
				
				// if the tag has changed, mark it for replacement
				if (fullTag != newTag){
					//AjxLog.info("    Will sanitize " + fullTag + " with " + 
					//newTag);
					sanitizedArray[sanitizedArray.length] = {fullTag: fullTag,
															 newTag: newTag};
				}
			} else {

			}
		} else {
			//AjxLog.info("Removing all attributes for " + fullTag);
			var newTag = "<" + tagName + ">";
			sanitizedArray[sanitizedArray.length] = {fullTag: fullTag,
													 newTag: newTag};
		}
		
		// if we've marked the tag for complete removal, find the end of 
		// the element, and mark it for removal. Make sure lastIndex of the
		// tags regex is set to the end of the section, so we don't look at
		// nested tags.
		if (this.elementRemoved(tagName)) {
			// find the end tag and remove everything in between
			var ere = new RegExp("/"+tagName,"i");
			var start = tags.index;
			var end = cleanHTML.indexOf("/" + tagName, tags.index);
			if (end != -1) {
				var close = cleanHTML.indexOf(">", end);
				end = end + 1 + tagName.length;
				if (close != -1){
					end = close + 1;
				}
				var element = cleanHTML.substring(start, end);
				//AjxLog.info("Will remove " + element);
				removalArray[removalArray.length] = {element: element,
													 end: end,
													 start: start};
				// set the end of the pattern space to the end of the section
				// we just removed
				re.lastIndex = end;
			}			
		}
		var tags = re.exec(dirtyHTML);
	}
	var x = 0;
	for (; x < removalArray.length; ++x){
		var el = removalArray[x].element;
		cleanHTML = cleanHTML.replace(el, "");
	}

	for (x = 0; x < sanitizedArray.length; ++x) {
		var obj = sanitizedArray[x];
		var ft = obj.fullTag;
		var nt = obj.newTag;
		cleanHTML = cleanHTML.replace(ft, nt);
	}

	return cleanHTML;
};

/**
 * moves the src attribute to the id
 */
AjxDefangFilter.prototype.neuterImageTagStr = function (element) {
	//AjxLog.info("neuter Image tag for " + element);
	var idRegex = AjxDefangFilter.ID_REGEX;
	var idMatch = idRegex.exec(element);
	//AjxLog.info("  idMatch = " , idMatch);
	var srcRegex = AjxDefangFilter.SRC_REGEX
	var srcMatch = srcRegex.exec(element);
	//AjxLog.info("  srcMatch = " ,srcMatch);
	var src;
	var id;
	var retStr = null;
	if (srcMatch) {
		retStr = element;
		src = srcMatch[1];
		//AjxLog.info("  src = " +src);
		if (idMatch) {
			//AjxLog.info("  about to replace");
			id = idMatch[1];
			retStr = 
				retStr.replace(idMatch[0],idMatch[1]+"=\"" + src + "\"");
		} else {
			retStr = retStr.replace(">", " id='" + src + "'>");
		}
		retStr = retStr.replace(srcMatch[0], "src='' ");
	}
	//AjxLog.info("Done neuter " + retStr);
	return retStr;
	
};

AjxDefangFilter.prototype.neuterImageTag = function (element) {
	if (element.src){
		element.id = element.src;
		element.src = void 0;
	}
};

AjxDefangFilter.prototype.fixATagStr = function (element) {
	var targetRegex = AjxDefangFilter.TARGET_REGEX;
	var targetMatch = targetRegex.exec(element);
	var retStr = null;
	if (targetMatch) {
		retStr = element.replace(targetMatch[0], " target='_blank'");
	} else {
		retStr = element.replace(">", " target='_blank'>");
	}
	return retStr;
};

/**
 * make sure all <a> tags have a target="_blank" attribute set.
 * @param name
 * @param attributes
 */
AjxDefangFilter.prototype.fixATag = function (element) {
	element.target = "_blank";
};

/**
 * sanatize an attr value. For now, this means stirpping out 
 * &{...} - Js entity tags
 * <script> tags.
 * *script: stuff from attributes ( eg <a href="javascript:alert()"></a> )
 * 
 */
AjxDefangFilter.prototype.sanatizeAttrValue = function (eName, aName, element,i){
	var value = element.getAttribute(aName);
	value = value? value: element[aName];
	if (typeof(value) != 'string') return;

	if (value) {
		var result = value.replace(AjxDefangFilter.AV_JS_ENTITY,
								   "JS-ENTITY-BLOCKED");
		result = result.replace(AjxDefangFilter.AV_JS_COLON, "SCRIPT-BLOCKED");
		result = result.replace(AjxDefangFilter.AV_SCRIPT_TAG,
								"SCRIPT-TAG-BLOCKED");
		// TODO: change to set?
		if (eName !="img" &&(aName == "href" || aName == "src" || 
							 aName == "longdesc" || aName == "usemap")){
			if (!result.search(AjxDefangFilter.ABSOLUTE_URL)) {
				// TODO: just leave blank?
				result = "about:blank";
			}
		}

		if (result != value) {
			if (AjxEnv.isIE){
				element[aName] = result;
			} else {
				element.setAttribute(aName, result);
			}
		}
	}
};

AjxDefangFilter.prototype.sanatizeAttrValueStr = function (eName, aName,
														  element, value){
	if (typeof(value) != 'string') return;

	if (value) {
		var result = value.replace(AjxDefangFilter.AV_JS_ENTITY,
								   "JS-ENTITY-BLOCKED");
		result = result.replace(AjxDefangFilter.AV_JS_COLON, "SCRIPT-BLOCKED");
		result = result.replace(AjxDefangFilter.AV_SCRIPT_TAG,
								"SCRIPT-TAG-BLOCKED");
		// TODO: change to set?
		if (eName !="img" &&(aName == "href" || aName == "src" || 
							 aName == "longdesc" || aName == "usemap")){
			if (!result.search(AjxDefangFilter.ABSOLUTE_URL)) {
				// TODO: just leave blank?
				result = "about:blank";
			}
		}
	}
	return result;
};


AjxDefangFilter.prototype._traverseTree = function (nodes) {

	var stack = new Array();
	var pushFrame = false;
	var node = null;
	for (var i = 0; i < nodes.length; ++i ) {
		node = nodes[i];
		//AjxLog.info("node name = " + node.nodeName + " type = " + node.nodeType
		//	   + " node value = " + node.nodeValue);
		switch (node.nodeType) {
		case 1:	// Element
			if (node.nodeName != 'document'){
				this.handleElement(node);
			}
			pushFrame = true;
			break;

		case 3:	// Text
			// test if the value is allowed
			break;
			
		case 4:	// CDATA
			break;
		case 5: // node entity reference
			break;
		case 6: // node entity
			break;
		case 7:	// ProcessInstruction
			break;
		case 8:	// Comment
			// remove all comments
			// IE doesn't like removing comments for some reason.
			if (AjxEnv.isIE){
				//node.parentNode.removeNode(node);
			} else {
				node.parentNode.removeChild(node);
			}
			break;
		case 10:
			break;
		case 9:	// Document
			pushFrame = true;
			break;
			
		case 11:	// Document Fragment
			pushFrame = true;
			break;
		case 12: // node notation 
			break;
		default:
			break;
		}
		// since we're not using recursion, lets save some context, and
		// keep moving through this loop.
		if (pushFrame){
			stackObj = {nodes: nodes, index: i};
			stack.push(stackObj);
			nodes = nodes[i].childNodes;
			// -1 is import since the for loop will increment imediately to 0
			i = -1;
			pushFrame = false;
		}
		// pop if the loop is going to end.
		while (i == (nodes.length - 1)){
			oldFrame = stack.pop();
			if (oldFrame){
				nodes = oldFrame.nodes;
				i = oldFrame.index;
			} else {
				break;
			}
		}
	}

	// remove any elements that have been marked for removal
	var arr = this._elementsForRemoval;
	var len = arr.length;
	var el = null;
	for (var j = 0 ; j < len ; ++j){
		el = arr.pop();
		if (el.parentNode != null) {
			el.parentNode.removeChild(el);
		}
	}
};


AjxDefangFilter.prototype.parse = function (htmlStr) {
	this._elementsForRemoval = new Array();
	var htmlEl = null;
	if (AjxEnv.isIE) {
		// This is the other option for parsing with IE
		// we need an iframe in the explicitely set in the html of the page,
		// where the security attribute is set to "restricted".
		//htmlEl = document.createElement('document');
		//var iframe = document.getElementById('ieDefang');
		//iframe.style.display= 'none';
		//iframe.src="about:blank";
		//document.body.appendChild(iframe);		
		//htmlEl = iframe.Document;

		// innerHTML is read only on the html element for some reason.
		// The downside to using a div, is that the browser strips the
		// tags before the body.
		//htmlEl = document.createElement('div');
		//htmlEl.innerHTML = htmlStr;
		return this.cleanHTML(htmlStr);
		//AjxLog.info("htmlStr \n" + htmlStr);
		//htmlEl.open();
		//htmlEl.write(htmlStr);
		//htmlEl.close();
		
	} else {
		// ah the simplicity of using firefox
		htmlEl = document.createElement('html');
		htmlEl.innerHTML = htmlStr;
		this._traverseTree(htmlEl.childNodes);
		return htmlEl.innerHTML;
	}



	// if we were using the iframe for IE, uncomment out the following line.
	//return AjxEnv.isIE? htmlEl.documentElement.innerHTML: htmlEl.innerHTML;
	//return htmlEl.innerHTML;
};
