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


/**
* @class
* This static class provides basic image support by using CSS and background 
* images rather than &lt;img&gt; tags. 
* @author Conrad Damon
* @author Ross Dargahi
*/
function AjxImg() {
}
AjxImg.prototype = new Object;
AjxImg.prototype.constructor = null;

AjxImg.ICON = 1;
AjxImg.HORIZ_BORDER = 2;
AjxImg.VERT_BORDER = 3;
AjxImg.BACKGROUND = 4;

AjxImg._VIEWPORT_ID = "AjxImg_VP";

/**
* This method will set the image for <i>parentEl</i>. <i>parentEl</i> should 
* only contain this image and no other children
*
* @param parentEl 		The parent element for the image
* @param imageName 		The name of the image.  The CSS entry for the image will be "Img<imageName>".
* @param useParenEl 	If true will use the parent element as the root for the image and will not create an intermediate DIV
*/
AjxImg.setImage =
function(parentEl, imageName, style, useParentEl) {
	var className = AjxImg.getClassForImage(imageName);

	if (useParentEl) {
		parentEl.className = className;
	} else {
		if (parentEl.firstChild == null) {
			parentEl.innerHTML = className 
			   ? ["<div class='", className, "'></div>"].join("")
			   : "<div></div>";
   		}
		else {
			parentEl.firstChild.className = className;
		}
	}
}

AjxImg.getClassForImage =
function(imageName) {
	return "Img" + imageName;
}

AjxImg.getImageClass =
function(parentEl) {
	return parentEl.firstChild ? parentEl.firstChild.className : parentEl.className;
}

AjxImg.getImageElement =
function(parentEl) {
	return parentEl.firstChild ? parentEl.firstChild : parentEl;
}

AjxImg.getParentElement =
function(imageEl) {
	return imageEl.parentNode;
}

/**
* Gets the "image" as an HTML string. 
*
* @param styleStr	additional style info e.g. "display:inline"
* @param attrStr	additional attributes eg. "id=X748"
*/
AjxImg.getImageHtml = 
function(imageName, styleStr, attrStr, wrapInTable) {
	attrStr = (!attrStr) ? "" : attrStr;
	var className = AjxImg.getClassForImage(imageName);
	styleStr = styleStr ? "style='" + styleStr + "' " : "";
	var pre = wrapInTable ? "<table style='display:inline' cellpadding=0 cellspacing=0 border=0><tr><td align=center valign=bottom>" : "";
	var post = wrapInTable ? "</td></tr></table>" : "";
	if (className) {
		return [pre, "<div class='", className, "' ", styleStr, " ", attrStr, "></div>", post].join("");
	}
	return [pre, "<div ", styleStr, " ", attrStr, "></div>", post].join("");
}
