// JavaScript Document
function populateID(action) {
	document.getElementById('submittedTaskID').value = '';
	document.getElementById('submittedTimeoffID').value = '';
	document.getElementById('submittedOverallID').value = '';

	if(action == 'approve_task' || action == 'reject_task') {
		var cellID = 'submittedTaskID';
		var actionID = new String(document.getElementById('actionID').value);
		var arrSubmittedID = actionID.split(':');
		var actionName = 'action:';
	}
	else if(action == 'approve_timeoff' || action == 'reject_timeoff') {
		var cellID = 'submittedTimeoffID';
		var actionIDTO = new String(document.getElementById('actionIDTO').value);
		var arrSubmittedID = actionIDTO.split(':');
		var actionName = 'action:';
	}
	else if(action == 'approve_overall' || action == 'reject_overall') {
		var cellID = 'submittedOverallID';
		var actionIDOverall = new String(document.getElementById('actionIDOverall').value);
		var arrSubmittedID = actionIDOverall.split(':');
		var actionName = 'action_overall:';
	}
	for (var i=0; i < arrSubmittedID.length-1; i++) {
		if(document.getElementById(actionName+arrSubmittedID[i]).checked)
			document.getElementById(cellID).value = document.getElementById(cellID).value + arrSubmittedID[i]+':';
	}
	if(!document.getElementById('submittedTaskID').value && !document.getElementById('submittedTimeoffID').value && !document.getElementById('submittedOverallID').value) {
		alert("Select Checkbox To Approve / Reject");
		return false;
	}
	else
		return true;
}

function checkAll(actionID,status,tableID) {
	var check = new String(actionID);
	var arr_check = check.split(':');
	var gotValue = 0;
	for (var i=0; i < arr_check.length-1; i++) {
		if(status)
			document.getElementById('action:'+arr_check[i]).checked = true;
		else
			document.getElementById('action:'+arr_check[i]).checked = false;
	}
}

function checkOverall(actionID,status,tableID) {
	var check = new String(actionID);
	var arr_check = check.split(':');
	var gotValue = 0;
	for (var i=0; i < arr_check.length-1; i++) {
		if(status)
			document.getElementById('action_overall:'+arr_check[i]).checked = true;
		else
			document.getElementById('action_overall:'+arr_check[i]).checked = false;
	}
}

function sortTask(field,sortType) {
	document.getElementById('fieldTask').value = field;
	document.getElementById('sortTypeTask').value = sortType;
	ajaxMain(document.forms[0],'sort_table');
}
function sortTimeoff(field,sortType) {
	document.getElementById('fieldTimeoff').value = field;
	document.getElementById('sortTypeTimeoff').value = sortType;
	ajaxMain(document.forms[0],'sort_table');
}
function sortOverall(field,sortType) {
	document.getElementById('fieldOverall').value = field;
	document.getElementById('sortTypeOverall').value = sortType;
	ajaxMain(document.forms[0],'sort_table');
}