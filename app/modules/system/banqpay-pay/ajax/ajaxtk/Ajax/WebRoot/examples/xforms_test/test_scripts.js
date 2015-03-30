/*
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
*/

function loadTestForm() {
	setCurrentForm();
}

var lastTabSeen = XFG.getCookie("lastTabSeen");
if (lastTabSeen == null || lastTabSeen == "") lastTabSeen = "display";

var cardList = [
	"display", "HTMLOutput", "instanceValue", "debug", "updateScript", "formItems"
]
function showCard(cardName) {
	if (cardName == null) cardName = lastTabSeen;
	window.lastTabSeen = cardName;
	XFG.setCookie("lastTabSeen", cardName);
	
	XFG.hideEl("display");
	XFG.hideEl("debug");
	XFG.hideEl("output");
	
	// unhilite all the tabs
	for (var i = 0; i < cardList.length; i++) {
		XFG.hideSelected("show_" + cardList[i])
	}
	// hilite the selected tab
	XFG.showSelected("show_" + cardName);
	
	// now show the right thing based on the card they want to see
	switch (cardName) {
		case "display":				showDisplay();			break;
		case "debug":				showDebug();			break;
		case "HTMLOutput":			showHTMLOutput();		break;
		case "formItems":			showFormItems();		break;
		case "updateScript": 		showUpdateScript();		break;
		case "removeScript": 		showRemoveScript();		break;
		case "insertScript": 		showInsertScript();		break;
		case "instanceValue": 		showInstanceValue();	break;
	}
}


function showDisplay() {
	XFG.showEl("display");
}

function showOutput(str) {
	str = str.split("<\/textarea>").join("<\/Xtextarea>");
	str = str.split("<\/TEXTAREA>").join("<\/Xtextarea>");
	
	XFG.getEl("output").innerHTML = "<TEXTAREA style='width:99%;height:99%' wrap=off>" + str + "<\/TEXTAREA>";
	XFG.showEl("output");
}

function showFormItems() {
	var output = XFG.valueToString(currentForm.getItems(), "", true, true, true);
	showOutput(output);
}

function showInstanceValue() {
	var output = XFG.valueToString(currentForm.getInstance(), "", true, true, true);
	showOutput(output);
}

function showHTMLOutput() {
	showOutput(XFG.getEl("display").innerHTML);
}

function showUpdateScript() {
	var output = currentForm.updateScript;
	showOutput(output);
}


function showDebug() {
	XFG.getEl("debug").innerHTML = "<button onclick='DBG.clear()'>Clear<\/button><pre>" + DBG.getMessages();
	XFG.showEl("debug");
}



var formIdList = [];
var formList = {};
var instanceNames = [];

var currentForm = null;
var currentFormId = null;
var currentInstance = null;

function registerForm(id, form, instances) {
	formIdList[formIdList.length] = id;
	formList[id] = form;
	form.instanceList = instances;
	
	// add an item to the formList popup list
	var el = XFG.getEl("formList");
	if (el) el.options[el.options.length] = new Option(id, id);
}

function setInstancesForForm() {
	var instances = currentForm.instanceList;

	// put the instances in the instanceList as an array
	instanceNames = [];
	for (var prop in instances) {
		instanceNames[instanceNames.length] = prop;
	}
	
	
	// clear the old options in the instanceList
	var el = XFG.getEl("instanceList");
	if (el) {
		for (var i = el.options.length - 1; i >=0; i--) {
			el.options[i] = null;
		}
	
		// show the new options in the instanceList
		var i = 0;
		for (var prop in instances) {
			el.options[el.options.length] = new Option(prop, ""+i);	
		}
	}
	
	// make sure the current form is selected in the formList
	var el = XFG.getEl("formList");
	for (var i = 0; i < el.options.length; i++) {
		if (el.options[i].value == currentFormId) {
			el.selectedIndex = i;
			break;	
		}
	}
}

function setCurrentForm(id) {
	if (id == null) {
		// try to get the last form they were looking at
		id = XFG.getCookie("lastFormSeen");
		var instanceNum = parseInt(XFG.getCookie("lastInstanceSeen"));
		// if we can't find it, just use the first one
		if (formList[id] == null) {
			id = formIdList[0];
		}
	} else {
		var instanceNum = 0;
	}
	
	currentForm = formList[id];
	if (currentForm == null) return;

	currentFormId = id;
	DBG.println("<BR>Showing form " + id);

	// remember the last form seen in a cookie
	XFG.setCookie("lastFormSeen", id);

	// reset the options on the instance popup
	setInstancesForForm();

	// always show the first instance, and don't auto-draw on the instance
	setCurrentInstance(instanceNum, false);
	
	// draw the form (draws in-memory, so we can get the properties if there's an error)
	// TRY...CATCH BLOCK???
	currentForm.draw();

	// actually put the HTML in the display
	XFG.getEl("display").innerHTML = currentForm.__HTMLOutput;

	// manually run the insert and update scripts (since we drew manually)
	currentForm.refresh();

	// and show the proper card
	showCard(lastTabSeen);
}

function setCurrentInstance(instanceNum, autoDraw) {
	if (isNaN(instanceNum)) instanceNum = 0;
	XFG.setCookie("lastInstanceSeen", ""+instanceNum);
	
	var instanceName = instanceNames[instanceNum];
	var currentInstance = currentForm.instanceList[instanceName];
	if (currentInstance == null) {
		instanceNum = 0;
		instanceName = instanceNames[0];
		currentInstance = currentForm.instanceList[instanceName];
	}
	DBG.println("Showing instance " + instanceName);

	currentForm.setInstance(currentInstance);
	
	var el = XFG.getEl("instanceList");
	el.selectedIndex = instanceNum;
	
	if (autoDraw != false) 	showCard();
}