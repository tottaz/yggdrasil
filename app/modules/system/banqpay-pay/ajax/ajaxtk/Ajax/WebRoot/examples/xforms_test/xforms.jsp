<!-- 
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

-->
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<HTML>
<HEAD>
<link href="zimbra_widgets.css" 	rel="stylesheet" type="text/css">
<style type="text/css">
  <!--
        @import url(../common/img/hiRes/dwtimgs.css);
   -->
</style>
<jsp:include page="../Messages.jsp"/>
<jsp:include page="../Ajax.jsp"/>

<STYLE type="text/css">
	.tabtable {
		width:100%;
		height:25px;
	}
	.tab,
	.tab_selected {
		cursor:pointer;
		white-space:nowrap;
		padding-left:5px;
		padding-right:5px;
		border:1px solid blue;
	}
	.tab_selected {
		background-color:yellow;
		border-bottom:none;
	}
	.borderbottom {
		white-space:nowrap;
		border-bottom:1px solid blue;
	}
	.expando {
		width:100%;
		height:100%;
		font-family:monospace;
	}
	.displayCard,
	.debugCard {
		display:none;
		padding:10px;
		position:absolute;
		top:30;
		left:0;
		width:95%;
		height:90%;
		overflow:auto;
	}
	.debugCard {
		font-family:monospace;
		font-size:small;
	}
	BUTTON {
		font-family:Verdana;
		font-size:10px;
	}
	.label {
		color:#666666;
		padding-left:4px;
		padding-right:2px;	
	}
</STYLE>

<BODY ONLOAD='onLoad();'>
	<div>
		<table class=tabtable><tr>		
			<td class=borderbottom>&nbsp;&nbsp;</td>
			<td id=show_display class=tab onclick='showCard("display")'>Display</td>
			<td id=show_HTMLOutput class=tab onclick='showCard("HTMLOutput")'>HTML</td>
			<td id=show_debug class=tab onclick='showCard("debug")'>Debug</td>
			<td id=show_formItems class=tab onclick='showCard("formItems")'>Form Items</td>
			<td id=show_instanceValue class=tab onclick='showCard("instanceValue")'>Instance Value</td>
			<td id=show_updateScript class=tab onclick='showCard("updateScript")'>Update Script</td>
			<td width=100% class=borderbottom>&nbsp;&nbsp;&nbsp;</td>
			<td class=borderbottom><div class=label>Form:</div></td>
			<td class=borderbottom><select id=formList class=xform_select1 onchange='setCurrentForm(this.options[this.selectedIndex].value)'></select></td>
			<td class=borderbottom><div class=label>Instance:</div></td>
			<td class=borderbottom><select id=instanceList class=xform_select1 onchange='setCurrentInstance(this.selectedIndex)'></select></td>
			<td class=borderbottom>&nbsp;&nbsp;</td>
		</tr>
		</table>
	</div>
	<div ID=display class=displayCard>
	</div ID=output>
	<div ID=debug class=debugCard>
	</div ID=debug>
	<div ID=output class=displayCard>
	</div ID=output>
</BODY>

<SCRIPT language=JavaScript src="DWT_shim.js"></SCRIPT>

<SCRIPT language=JavaScript>
var lastTabSeen = XFG.getCookie("lastTabSeen");
if (lastTabSeen == null || lastTabSeen == "") lastTabSeen = "display";

function onLoad() {
	DBG = new AjxDebug(AjxDebug.NONE, null, false);
	if (location.search && (location.search.indexOf("debug=") != -1)) {
		var m = location.search.match(/debug=(\d+)/);
		if (m.length) {
			var num = parseInt(m[1]);
			var level = AjxDebug.DBG[num];
			if (level)
				DBG.setDebugLevel(level);
		}
	}

	setCurrentForm();
}

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
	XFG.getEl("output").innerHTML = "<TEXTAREA class='expando' wrap=off>" + str + "<\/TEXTAREA>";
	XFG.showEl("output");
}

function showFormItems() {
	showOutput(currentForm.showFormItems());
}

function showInstanceValue() {
	showOutput(currentForm.showInstanceValue());
}

function showHTMLOutput() {
	showOutput(currentForm.showHTMLOutput());
}

function showUpdateScript() {
	showOutput(currentForm.showUpdateScript());
}

function showInsertScript() {
	showOutput(currentForm.showInsertScript());
}

function showRemoveScript() {
	showOutput(currentForm.showRemoveScript());
}

function showDebug() {
	XFG.showEl("debug");
}

function showInstance(instance) {
	currentForm.setInstance(instance);
	XFG.showCard();
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
	el.options[el.options.length] = new Option(id, id);
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
	for (var i = el.options.length - 1; i >=0; i--) {
		el.options[i] = null;
	}

	// show the new options in the instanceList
	var i = 0;
	for (var prop in instances) {
		el.options[el.options.length] = new Option(prop, ""+i);	
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
	XFG.setCookie("lastInstanceSeen", ""+instanceNum);
	
	if (autoDraw != false) 	showCard();
}

</SCRIPT>

<!-- ADD SCRIPT INCLUDES HERE FOR ALL THE FORMS YOU WANT TO REGISTER -->
<!-- IF YOU NEED TO, INCLUDE THE registerForm() CALL IN THE INLINE SCRIPT BELOW -->
<SCRIPT language=JavaScript>
//
//	HACK THE DWT COMPONENT TYPES TO USE THE NORMAL TYPES
//

var _DWT_DATE_ = _DATE_;
var _DWT_DATETIME_ = _DATETIME_;
var _DWT_TIME_ = _TIME_;
var _DWT_SELECT_ = _SELECT1_;
//var _BUTTON_GRID_ = _INPUT_;

</SCRIPT>

<SCRIPT language=JavaScript src="xform_item_test.js"></SCRIPT>
<SCRIPT language=JavaScript src="xform_disable_test.js"></SCRIPT>
<SCRIPT language=JavaScript src="xform_repeat_test.js"></SCRIPT>
<SCRIPT language=JavaScript src="LmAppointmentView.js"></SCRIPT>
<SCRIPT language=JavaScript src="xform_compose.js"></SCRIPT>
<SCRIPT language=JavaScript>
if (window.LmAppointmentView) {
	var XM = new XModel(LmAppointmentView.appointmentModel);
	var apptInstance = 
		{
				id : "",
				uid : -1,
				type : null,
				name : "Name",
				startDate : new Date(),
				endDate : new Date(new Date().getTime() + (30*60*1000)),
				transparency : "FR",
				allDayEvent : '0',
				exception : false,
				recurring : false,
				alarm : false,
				otherAttendees : false,
				location : "location",
				notes : null,
				repeatType : "M",
				repeatDisplay : null,
				repeatCustom : 0,
				repeatCustomCount : 1,
				repeatCustomType : 'O', // (S)pecific, (O)rdinal
				repeatCustomOrdinal : '1',
				repeatCustomDayOfWeek : 'DAY', //(d|wd|we)|((Su|Mo|Tu|We|Th|Fr|Sa
				repeatWeeklyDays : 'SUNDAY', //Su|Mo|Tu|We|Th|Fr|Sa
				repeatMonthlyDayList : '1',
				repeatYearlyMonthsList : '1',
				repeatEnd : null,
				repeatEndDate : new Date(),
				repeatEndCount : 1,
				repeatEndType : 'N'
	};
	registerForm("Appointment Edit", new XForm(LmAppointmentView.appointmentForm, XM), {"Sample":apptInstance});
}
</SCRIPT>
