// JavaScript Document
function makeObject(){
	var x; 
	var browser = navigator.appName; 
	if(browser == "Microsoft Internet Explorer"){
		x = new ActiveXObject("Microsoft.XMLHTTP");
	}
	else{
		x = new XMLHttpRequest();
	}
	return x;
}

var request = makeObject();
var formParams = '';

function getFormFields(oNode){
	if(document.getElementById('action').value == 'delete_quicklinks' || document.getElementById('action').value == 'add_quicklinks') {
		formParams = formParams + "&action=" + document.getElementById('action').value;
		formParams = formParams + "&quickLinksName=" + document.getElementById('quickLinksName').value;
		formParams = formParams + "&quickLinksURL=" + document.getElementById('quickLinksURL').value;
		formParams = formParams + "&quickLinksDesc=" + document.getElementById('quickLinksDesc').value;
		return;
	}
	else if(document.getElementById('action').value == 'startpage') {
		formParams = formParams + "&action=" + document.getElementById('action').value;
		formParams = formParams + "&startup_page=" + document.getElementById('startup_page').value;
		return;
	}
	else if(document.getElementById('action').value == 'getlog') {
		formParams = formParams + "&action=" + document.getElementById('action').value;
		formParams = formParams + "&LogAction=" + document.getElementById('LogAction').value;
		formParams = formParams + "&LogType=" + document.getElementById('LogType').value;
		if (testIsValidObject(document.getElementById('addupdateID')))
			formParams = formParams + "&addupdateID=" + document.getElementById('addupdateID').value;
		if (testIsValidObject(document.getElementById('task_type')))
			formParams = formParams + "&task_type=" + document.getElementById('task_type').value;
		if (testIsValidObject(document.getElementById('projectID')))
			formParams = formParams + "&projectID=" + document.getElementById('projectID').value;
		return;
	}
	else if(document.getElementById('action').value == 'gethelp') {
		formParams = formParams + "&action=" + document.getElementById('action').value;
		return;
	}
	disableButtons(oNode);
}
function submitForm(oNode){
	var canSubmit = true;
	for (i=0; i<oNode.elements.length; i++) {
		if(oNode.elements[i].title == 'required') {
			if(!oNode.elements[i].value) {
				alert('Enter Value in Required Field: '+oNode.elements[i].parentNode.id);
				oNode.elements[i].focus();
				var canSubmit = false;
				break;
			}
		}
	}
	if(canSubmit)
		ajaxMain(oNode,document.getElementById('submit_action').value);
}

function disableButtons(oNode) {
}
function enableButtons(oNode) {
}
