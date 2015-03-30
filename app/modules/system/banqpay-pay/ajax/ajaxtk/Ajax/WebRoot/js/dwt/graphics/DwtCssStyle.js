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


function DwtCssStyle() {
}

DwtCssStyle.SELECTED	= "selected";	// selected item (left-click) in a list or tree
DwtCssStyle.ACTIONED	= "actioned";	// actioned item (right-click) in a list or tree
DwtCssStyle.MATCHED		= "matched";	// matched item in a list
DwtCssStyle.DND			= "dnd";		// DnD icon version of a list item
DwtCssStyle.ACTIVE		= "active";		// a button that is the default for some action
DwtCssStyle.ACTIVATED	= "activated";	// a button that has the focus
DwtCssStyle.TRIGGERED	= "triggered";	// a button that has been pressed
DwtCssStyle.TOGGLED		= "toggled";	// a button that has been toggled on
DwtCssStyle.INACTIVE	= "inactive";	// a button that is inactive (closed tab button)
DwtCssStyle.DISABLED	= "disabled";	// a disabled item

DwtCssStyle.getProperty = 
function(htmlElement, cssPropName) {
	var result;
	if (htmlElement.ownerDocument == null) {
		// IE5.5 does not suppoert ownerDocument
		for(var parent = htmlElement.parentNode; parent.parentNode != null; parent = parent.parentNode);
		var doc = parent;
	} else {
		var doc = htmlElement.ownerDocument;
	}
	if (doc.defaultView && !AjxEnv.isSafari) {
		var cssDecl = doc.defaultView.getComputedStyle(htmlElement, "");
		result = cssDecl.getPropertyValue(cssPropName);
	} else {
		  // Convert CSS -> DOM name for IE etc
			var tokens = cssPropName.split("-");
			var propName = "";
			var i;
			for (i = 0; i < tokens.length; i++) {
				if (i != 0) 
					propName += tokens[i].substring(0, 1).toUpperCase();
				else 
					propName += tokens[i].substring(0, 1);
				propName += tokens[i].substring(1);
			}
			if (htmlElement.currentStyle)
				result = htmlElement.currentStyle[propName];
			else if (htmlElement.style)
				result = htmlElement.style[propName];
	}
	return result;
}

DwtCssStyle.getComputedStyleObject = 
function(htmlElement) {
	if (htmlElement.ownerDocument == null) {
		// IE5.5 does not suppoert ownerDocument
		for(var parent = htmlElement.parentNode; parent.parentNode != null; parent = parent.parentNode);
		var doc = parent;
	} else {
		var doc = htmlElement.ownerDocument;
	}
	
	if (doc.defaultView && !AjxEnv.isSafari)
		return doc.defaultView.getComputedStyle(htmlElement, "");
	else if (htmlElement.currentStyle)
		return htmlElement.currentStyle;
	else if (htmlElement.style)
		return htmlElement.style;
}
