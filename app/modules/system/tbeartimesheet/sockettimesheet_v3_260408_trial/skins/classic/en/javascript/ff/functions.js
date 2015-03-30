// JavaScript Document
function checkStartEndDate(start,end) {
	if(document.getElementById(start) && document.getElementById(end)) {
		var start = document.getElementById(start).value;
		var end = document.getElementById(end).value;

		var startDate = new String(start);
		var arr_startDate = startDate.split(' ');
		var startMonth = arr_startDate[0];
		var startDay = parseFloat(arr_startDate[1]);		
		var startYear = parseFloat(arr_startDate[2]);

		var endDate = new String(end);
		var arr_endDate = endDate.split(' ');
		var endMonth = arr_endDate[0];
		var endDay = parseFloat(arr_endDate[1]);	
		var endYear = parseFloat(arr_endDate[2]);

		//start year is bigger than end year
		if(startYear > endYear) {
			alert("Start Date Is Bigger Than End Date");
			return false;
		}
		//start year = end year	
		else if (startYear == endYear) {
			//start month is bigger than end month
			if(numericMonth(startMonth) > numericMonth(endMonth)) {
				alert("Start Date Is Bigger Than End Date");
				return false;
			}	
			else if(numericMonth(startMonth) == numericMonth(endMonth)) {
				if(startDay > endDay) {
					alert("Start Date Is Bigger Than End Date");
					return false;
				}
			}		
		}
		else
			return true;	
	}
	return true;
}

function showTab() {
	if(document.getElementById('tablist'))
		document.getElementById('tablist').style.display='';
}

function getLog() {
	ajaxMain(document.forms[0],'getlog');
}

function viewMode(xForm,xHow){
  objElems = xForm.elements;
  for(i=0;i<objElems.length;i++){
	if(objElems[i].type == 'radio' || 
	objElems[i].type == 'checkbox' || 
	objElems[i].type == 'select-one' ||
	objElems[i].type == 'select-multiple')
    	objElems[i].disabled = xHow;
	else if(objElems[i].type == 'button') {
		objElems[i].style.display = 'none';
	}
	else
    	objElems[i].readOnly="readonly";
  }
}

function checkUncheckAll(theElement,theParent,selecttype) {
	var curParentNode = theParent;
	if (curParentNode.childNodes != null) { 
		for(var i=0; i < curParentNode.childNodes.length; i++) {
			if(curParentNode.childNodes[i].type == selecttype) {
				curParentNode.childNodes[i].checked = theElement.checked;
			}
			checkUncheckAll(theElement,curParentNode.childNodes[i],selecttype);
		}
  	} 
}

function focus(field) {
	document.getElementById(field).select();
}
function check_hours(hours) {
	if(hours.value < 1 || (hours.name == 'hours_per_day' && hours.value > 24) || (hours.name == 'hours_per_week' && hours.value > 168)) {
		alert('Please Enter Logical Hours');
		focus(hours.name);
		return false;
	}
}
function check_password(password,confirm_password) {
	if(password.value != confirm_password.value) {
		alert("Password Not Synchronized");
		focus(password.name);		
		return false;
	}
	if(!password.value || !confirm_password.value) {
		alert("Enter Password");
		focus(password.name);		
		return false;
	}
	return true;
}

/* ORIGINAL FUNCTION
function filterNum(str) {
  	var re = /\$|,|@|#|~|`|\%|\*|\^|\&|\(|\)|\+|\=|\[|\-|\_|\]|\[|\}|\{|\;|\:|\'|\"|\<|\>|\?|\||\\|\!|\$|/g;
	return str.replace(re, "");
}
*/
//UPDATED FUNCTION
function filterNum(str) {
  	var re = /\%|\;|\:|\$|\'|\"|\\|/g;
	return str.replace(re, "");
}

function keyPress(e,type) {
	var key;
	var keychar;
	
	if (window.event)
	   key = window.event.keyCode;
	else if (e)
	   key = e.which;
	else
	   return true;

//	if (key == 34 || key == 39 || key == 92)
//		return false;
		
	if (key == 13) {
		if(type != 'textarea')
			return false;
	}

	if (key >= 0 && key <= 32)
		return true;	

	keychar = String.fromCharCode(key);
	keychar = keychar.toLowerCase();

	if(type == 'number') {
		if ((("0123456789.").indexOf(keychar) <= -1)) //DEFAULT NUMBER RELEASE
			return false;
	}
	else if(type == 'integer') {
		if ((("0123456789").indexOf(keychar) <= -1)) //DEFAULT NUMBER RELEASE
			return false;
	}
	else if(type == 'alphanumeric') {
		if ((("abcdefghijklmnopqrstuvwxyz0123456789").indexOf(keychar) <= -1))
			return false;
	}
	else if(type == 'email') {
		if ((("abcdefghijklmnopqrstuvwxyz0123456789_.-@").indexOf(keychar) <= -1))
			return false;
	}
	else if(type == 'http') {
		if ((("abcdefghijklmnopqrstuvwxyz0123456789_-.@:/").indexOf(keychar) <= -1))
			return false;
	}
	else if(type == 'normaltext') {
	}
	else if(type == 'filename') {
		if ((("abcdefghijklmnopqrstuvwxyz0123456789._-").indexOf(keychar) <= -1))
			return false;
	}
	else if(type == 'telephone') {
		if ((("0123456789-").indexOf(keychar) <= -1))
			return false;
	}
}
function quicklinksMGR(action) {
	if(action == 'delete_quicklinks') {
		if(confirm('Are You Sure?'))
			ajaxMain(document.forms[0],action);
	}
	else if(action == 'add_quicklinks')
		ajaxMain(document.forms[0],action);
}

function submitonce(theform){
	if (document.all||document.getElementById){
		for (i=0;i<theform.length;i++){
			var tempobj=theform.elements[i]
			if(tempobj.type=="submit") {
				tempobj.readonly=true
			}	
		}
	}
}

function populateFields(source,target) {
	document.getElementById('sourceValue').value = '';
	document.getElementById('targetValue').value = '';
	
	for (i=0; i<source.length; i++) {
		if(source[i].value)
			document.getElementById('sourceValue').value = document.getElementById('sourceValue').value + source[i].value + ':';
	}
	for (i=0; i<target.length; i++) {
		if(target[i].value)
			document.getElementById('targetValue').value = document.getElementById('targetValue').value + target[i].value + ':';
	}
}

function sortOrder(field,sortType) {
	document.getElementById('field').value = field;
	document.getElementById('sortType').value = sortType;
	ajaxMain(document.forms[0],'sort_table');
}

//DISABLED THE RETURN KEY FOREVER..NOT GOOD FOR AJAX!!
/*
function stopRKey(evt) {
	var evt  = (evt) ? evt : ((event) ? event : null);
	var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
	if ((evt.keyCode == 13) && (node.type=="text")) { return false; }
}
document.onkeypress = stopRKey;
*/

function startclock() {
	var curdate = new Date();
	dstring = curdate.toLocaleString();
	document.getElementById('submenu').innerHTML=dstring;
	setTimeout('startclock()',1000);
}

function numericMonth(month) {
	if(month == 'Jan')
		return 1;
	else if(month == 'Feb')
		return 2;
	else if(month == 'Mar')
		return 3;
	else if(month == 'Apr')
		return 4;
	else if(month == 'May')
		return 5;
	else if(month == 'Jun')
		return 6;
	else if(month == 'Jul')
		return 7;
	else if(month == 'Aug')
		return 8;
	else if(month == 'Sep')
		return 9;
	else if(month == 'Oct')
		return 10;
	else if(month == 'Nov')
		return 11;
	else if(month == 'Dec')
		return 12;
}
function textMonth(month) {
	if(month == 1)
		return 'January';
	else if(month == 2)
		return 'February';
	else if(month == 3)
		return 'March';
	else if(month == 4)
		return 'April';
	else if(month == 5)
		return 'May';
	else if(month == 6)
		return 'June';
	else if(month == 7)
		return 'July';
	else if(month == 8)
		return 'August';
	else if(month == 9)
		return 'September';
	else if(month == 10)
		return 'October';
	else if(month == 11)
		return 'November';
	else if(month == 12)
		return 'December';
}