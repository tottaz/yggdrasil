// JavaScript Document
function codeGen(type,target,number,code,arrCode) {
	var ranNum= Math.round(Math.random()*number);
	var prjCode;
	var tskCode;
	for (var i=0; i >= 0; i++) {
		if(type == 'project') {
			prjCode = "PRJ-"+ranNum;
			if(codeOK(prjCode,arrCode)) {
				document.getElementById(target).value = prjCode;
				break;
			}	
		}	
		else if(type == 'task') {
			tskCode = "TSK-"+ranNum;
			if(codeOK(tskCode,arrCode)) {
				document.getElementById(target).value = tskCode;
				break;
			}	
		}
	}		
}

function codeOK(targetCode,arrCode) {
	for (var i=0; i < arrCode.length; i++) {
		sourceCode = arrCode[i].toLowerCase();
		if(sourceCode == targetCode) {
			return false;
		}
	}
	return true;
}

function Duplicates(name,code,arrName,arrCode) {
var sourceName;
var targetName;
var sourceCode;
var targetCode;

targetName = trimString(document.getElementById(name).value.toLowerCase());
targetCode = trimString(document.getElementById(code).value.toLowerCase());

//compare with name
for (var i=0; i < arrName.length; i++) {
	sourceName = arrName[i].toLowerCase();
	if(sourceName == targetName && targetName) {
		alert("Name Already Exists. Update Failed");
		document.getElementById(name).select();
		return false;
	}
}
//compare with code
for (var i=0; i < arrCode.length; i++) {
	sourceCode = arrCode[i].toLowerCase();
	if(sourceCode == targetCode && targetCode) {
		alert("Code Already Exists. Update Failed");
		document.getElementById(code).select();
		return false;
	}
}
return true;
}

function show_menu(menu) {
	var allMenu = top.frames['leftFrame'].document.getElementById('all_menu').value;
	var arr_allMenu = allMenu.split(':');
	for (var i=0; i < arr_allMenu.length-1; i++) {
		top.frames['leftFrame'].document.getElementById(arr_allMenu[i]).style.display="none";
	}
	top.frames['leftFrame'].document.getElementById(menu).style.display='';
}

function trimString (str) {
  str = this != window? this : str;
  return str.replace(/^\s+/g, '').replace(/\s+$/g, '');
}

function check_required() {
var result=1;
	for (var i=0; i<arguments.length; i++) {
		if(!trimString(arguments[i].value)) {
			result = 0;
			break;
		}	
	}
	if (!result) {
		alert("Please Fill Required Value");
		focus(arguments[i].name);
		return false;
	}
	else
		return checkDate();	
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
		focus(confirm_password.name);		
		return false;
	}
}

function check_email(email_address) {
	var str = document.getElementById(email_address).value;
	var at="@"
	var dot="."
	var lat=str.indexOf(at)
	var lstr=str.length
	var ldot=str.indexOf(dot)
	var success = 1;
	if(str) {
		if (str.indexOf(at)==-1)
			success = 0
		if (str.indexOf(at)==-1 || str.indexOf(at)==0 || str.indexOf(at)==lstr)
			success = 0
		if (str.indexOf(dot)==-1 || str.indexOf(dot)==0 || str.indexOf(dot)==lstr)
			success = 0
		if (str.indexOf(at,(lat+1))!=-1)
			success = 0
		if (str.substring(lat-1,lat)==dot || str.substring(lat+1,lat+2)==dot)
			success = 0		
		if (str.indexOf(dot,(lat+2))==-1)
			success = 0		
		if (str.indexOf(" ")!=-1)
			success = 0
	}
	else
		return false;
	if(success)
		return true;
	else {
		alert("Invalid Email Address");
		focus(email_address);
		return false;
	}	
}

function checkDate() {
	if(document.getElementById('start_date') && document.getElementById('end_date')) {
		var start = document.getElementById('start_date').value;
		var end = document.getElementById('end_date').value;

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

		if(!start || !end) {
			alert("Please Enter The Date Values");
			return false;
		}
		else {
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
					else {
						return compareDate();
					}	
				}
				else {
					return compareDate();
				}				
			}
			else {
				return compareDate();
			}	
		}	
	}
	else
		return compareDate();
}

function compareDate() {
	if(!document.getElementById('parentStartYear'))
		return true;
	else {	
		var start = document.getElementById('start_date').value;
		var end = document.getElementById('end_date').value;
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
	
		if(startYear < parseFloat(document.getElementById('parentStartYear').value) || endYear < parseFloat(document.getElementById('parentStartYear').value) || startYear > parseFloat(document.getElementById('parentEndYear').value) || endYear > parseFloat(document.getElementById('parentEndYear').value)) {
			alert("Task Date Is Not A Subset Of Parent's\n\nParent's Start Date: "+document.getElementById('parentStartDay').value+" "+document.getElementById('parentStartMonth').value+" "+document.getElementById('parentStartYear').value+"\nParent's End Date: "+document.getElementById('parentEndDay').value+" "+document.getElementById('parentEndMonth').value+" "+document.getElementById('parentEndYear').value);
			return false;
		}
		else {
			if((numericMonth(startMonth) < numericMonth(document.getElementById('parentStartMonth').value) && startYear == parseFloat(document.getElementById('parentStartYear').value)) || (numericMonth(endMonth) < numericMonth(document.getElementById('parentStartMonth').value) && endYear == parseFloat(document.getElementById('parentStartYear').value)) || (numericMonth(startMonth) > numericMonth(document.getElementById('parentEndMonth').value) && startYear == parseFloat(document.getElementById('parentEndYear').value)) || (numericMonth(endMonth) > numericMonth(document.getElementById('parentEndMonth').value) && endYear == parseFloat(document.getElementById('parentEndYear').value))) {
				alert("Task Date Is Not A Subset Of Parent's\n\nParent's Start Date: "+document.getElementById('parentStartDay').value+" "+document.getElementById('parentStartMonth').value+" "+document.getElementById('parentStartYear').value+"\nParent's End Date: "+document.getElementById('parentEndDay').value+" "+document.getElementById('parentEndMonth').value+" "+document.getElementById('parentEndYear').value);				return false;
			}	
			else {
				if((startDay < parseFloat(document.getElementById('parentStartDay').value) && numericMonth(startMonth) == numericMonth(document.getElementById('parentStartMonth').value) && startYear == parseFloat(document.getElementById('parentStartYear').value)) || (endDay < parseFloat(document.getElementById('parentStartDay').value) && numericMonth(endMonth) == numericMonth(document.getElementById('parentStartMonth').value) && endYear == parseFloat(document.getElementById('parentStartYear').value)) || (startDay > parseFloat(document.getElementById('parentEndDay').value) && numericMonth(startMonth) == numericMonth(document.getElementById('parentEndMonth').value) && startYear == parseFloat(document.getElementById('parentEndYear').value)) || (endDay > parseFloat(document.getElementById('parentEndDay').value) && numericMonth(endMonth) == numericMonth(document.getElementById('parentEndMonth').value) && endYear == parseFloat(document.getElementById('parentEndYear').value))) {
					alert("Task Date Is Not A Subset Of Parent's\n\nParent's Start Date: "+document.getElementById('parentStartDay').value+" "+document.getElementById('parentStartMonth').value+" "+document.getElementById('parentStartYear').value+"\nParent's End Date: "+document.getElementById('parentEndDay').value+" "+document.getElementById('parentEndMonth').value+" "+document.getElementById('parentEndYear').value);					return false;
				}	
				else {
					return true;
				}	
			}
		}
	}
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
function Disable() {
//	if (event.button == 2) {
//		alert("SocketTimesheet :: PHP Timesheet And Beyond")
//	}
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