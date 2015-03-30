// JavaScript Document

	function action_selection(parentNode,selecttype) {
		var curParentNode = parentNode;
		if (curParentNode.childNodes != null) { 
			for(var i=0; i < curParentNode.childNodes.length; i++) {
				if(curParentNode.childNodes[i].type == selecttype) {
					if(curParentNode.childNodes[i].checked) {
						if(curParentNode.childNodes[i].id != 'checkall') //ESCAPE FOR ALL SELECTION
							document.getElementById('selectionList').value = document.getElementById('selectionList').value + curParentNode.childNodes[i].value + ':';
					}	
				}
				action_selection(curParentNode.childNodes[i],selecttype);
			}
		}
	}
	
	function delete_selection(parentNode,selecttype) {
		var oricolor = document.getElementById('tablecheckall').style.color;
		action_selection(parentNode,selecttype);
		if(document.getElementById('selectionList').value) {
			document.getElementById('tablecheckall').style.color='black';
			if(confirm('Are You Sure?')) {
				ajaxMain(document.forms[0],'delete_selection');
			}
		}
		else {
			document.getElementById('tablecheckall').style.color='red';
			alert('No Selection Detected');
		}
		document.getElementById('selectionList').value = '';
	}
	function disable_selection(parentNode,selecttype) {
		var oricolor = document.getElementById('tablecheckall').style.color;
		action_selection(parentNode,selecttype);
		if(document.getElementById('selectionList').value) {
			document.getElementById('tablecheckall').style.color='black';
			if(confirm('Are You Sure?')) {
				ajaxMain(document.forms[0],'disable_selection');
			}
		}
		else {
			document.getElementById('tablecheckall').style.color='red';
			alert('No Selection Detected');
		}
		document.getElementById('selectionList').value = '';
	}
	function enable_selection(parentNode,selecttype) {
		var oricolor = document.getElementById('tablecheckall').style.color;
		action_selection(parentNode,selecttype);
		if(document.getElementById('selectionList').value) {
			document.getElementById('tablecheckall').style.color='black';
			ajaxMain(document.forms[0],'enable_selection');
		}
		else {
			document.getElementById('tablecheckall').style.color='red';
			alert('No Selection Detected');
		}
		document.getElementById('selectionList').value = '';
	}
	
	function check_selection(parentNode,selecttype) {
		action_selection(parentNode,selecttype);
		if(!document.getElementById('selectionList').value) {
			document.getElementById('tablecheckall').style.color='red';
			alert('No Selection Detected');
			return false;
		}
		else {
			document.getElementById('tablecheckall').style.color='black';
			return true;
		}
	}

	function show_menu(menu) {
		var allMenu = top.frames['leftFrame'].document.getElementById('all_menu').value;
		var arr_allMenu = allMenu.split(':');
		for (var i=0; i < arr_allMenu.length-1; i++) {
			top.frames['leftFrame'].document.getElementById(arr_allMenu[i]).style.display="none";
		}
		top.frames['leftFrame'].document.getElementById(menu).style.display='';
	}
	function makeQuery(textbox,value) {
		document.getElementById(textbox).value = value;
		//document.forms[0].submit();
		ajaxMain(document.forms[0],'make_query');
	}
	function selCheck(value,checkboxes) {
		var check = new String(checkboxes);
		var arr_check = checkboxes.split(':');

		for (var i=0; i < arr_check.length-1; i++) {
			if(value)
				document.getElementById('checkbox:'+arr_check[i]).checked = true;
			else
				document.getElementById('checkbox:'+arr_check[i]).checked = false;
		}
	}
	function call_action(status) {
		var action = new String(status);
		var arr_action = action.split(':');
		if(arr_action[0] == 'delete_all' || arr_action[0] == 'delete' || arr_action[0] == 'taskdel') {
			if(confirm('Are You Sure?')) {
				document.getElementById('status').value = status;
				document.forms[0].submit();
			}	
			else {
				return false;	
			}	
		}		
		else if(arr_action[0] == 'add') {
			window.location = arr_action[1];
		}		
		else {	
			document.getElementById('status').value = status;
			document.forms[0].submit();
		}	
	}		
	function Disable() {
	}
	
document.onmousedown=Disable;

function hidestatus(){
window.status=''
return true
}

function killLoad() {
	document.getElementById('loading').style.display="none";
}

if (document.layers)
document.captureEvents(Event.MOUSEOVER | Event.MOUSEOUT)

document.onmouseover=hidestatus
document.onmouseout=hidestatus
