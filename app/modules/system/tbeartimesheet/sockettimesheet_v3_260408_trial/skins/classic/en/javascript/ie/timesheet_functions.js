// JavaScript Document
function calculateHours(select_name,cell_name,hourstart,minutestart,hourend,minuteend){
	var hourStart = document.getElementById(hourstart).value;
	var minuteStart = document.getElementById(minutestart).value;
	var hourEnd = document.getElementById(hourend).value;
	var minuteEnd = document.getElementById(minuteend).value;

	var startTime = new Date(03,12,12,hourStart,minuteStart,00);
	var endTime = new Date(03,12,12,hourEnd,minuteEnd,00);
	// difference between times in milliseconds
	var datediff = endTime.getTime() - startTime.getTime();
	// hours difference
	var hoursdiff = datediff / 1000 / 60 / 60;
	if(hoursdiff < 0)
		hoursdiff = 24 + hoursdiff;

	if(hoursdiff)
		document.getElementById(cell_name).value = FormatNumber(hoursdiff,2,'.');
	else
		document.getElementById(cell_name).value = '';

	total_hours(cell_name,1);	
}

function resetDeletedHours(status) {
	var action = new String(status);
	var arr_action = action.split(':');
	var cellHeader;
	if(arr_action[0] == 'delete') {
		cellHeader = 'h:'+arr_action[1]+':';	
	}
	if(arr_action[0] == 'delete_timeoff') {
		cellHeader = 'hto:'+arr_action[1]+':';	
	}
	var weekTotal = new String(document.getElementById('total_week_name').value);
	var arr_weekTotal = weekTotal.split(';');
	var hoursOK = true;
	for (var i=0; i<arr_weekTotal.length-1; i++) {
		var dayName = new String(arr_weekTotal[i]);
		var arr_dayName = dayName.split(':');
		cellName = cellHeader + arr_dayName[1];
		document.getElementById(cellName).value = '';
		total_hours(cellName);
	}
}

function check_empty_tasksDELETE(status) {
	var action = new String(status);
	var arr_action = action.split(':');
	
	if(document.getElementById('TsID').value) {
		var taskTotal = new String(document.getElementById('TsID').value);
		var arrtaskTotal = taskTotal.split(':');
		for (var i=0; i<arrtaskTotal.length-1; i++) {
			if(!parseFloat(document.getElementById('task:'+arrtaskTotal[i]+':total').value)) {
				if(arrtaskTotal[i] != arr_action[1]) {
					alert("Empty Tasks Submission Not Allowed\nPlease Input Hours or Delete Task");
					return false;
				}
			}	
		}
	}
	if(document.getElementById('TsToID').value) {
		var timeoffTotal = new String(document.getElementById('TsToID').value);
		var arrtimeoffTotal = timeoffTotal.split(':');
		for (var i=0; i<arrtimeoffTotal.length-1; i++) {
			if(!parseFloat(document.getElementById('timeoff:'+arrtimeoffTotal[i]+':total').value)) {
				if(arrtimeoffTotal[i] != arr_action[1]) {
					alert("Empty Tasks Submission Not Allowed\nPlease Input Hours or Delete Task");
					return false;
				}
			}	
		}
	}	
	return true;
}

function checkStatus(object) {
	if(object.title == 'approve') {
		alert('Action Denied. Task Has Already Been Approved');
	}
	else if(object.title == 'pending') {
		alert('Action Denied. Task Is Currently Pending Approval');
	}
	else if(object.title == 'reject') {
		alert('Action Denied. Task Rejected. Delete Task From The Timesheet Table');
	}
	if(object.title == 'approve' || object.title == 'pending' || object.title == 'reject')
		object.checked = true;
}

function textCounter(field, maxlimit,textevent) {
  if ( field.value.length > maxlimit )  {
    field.value = field.value.substring( 0, maxlimit );
    return false;
  }
  else {
	  return keyPress(textevent,'normaltext');
  }
}

function check_daily_hours() {
	var weekTotal = new String(document.getElementById('total_week_name').value);
	var arr_weekTotal = weekTotal.split(';');
	var hoursOK = true;
	for (var i=0; i<arr_weekTotal.length-1; i++) {
		var dayName = new String(arr_weekTotal[i]);
		var arr_dayName = dayName.split(':');
		if((document.getElementById(arr_weekTotal[i]).value < parseFloat(document.getElementById('min_day').value)) && !check_holiday(arr_weekTotal[i])) {
			alert("Your Minimum Daily Hours Was Set To "+ document.getElementById('min_day').value +"\nPlease Verify For "+ showDate(arr_dayName[1])+" Or Contact Your Administrator");
			hoursOK = false;
			break;
		}
	}
	return hoursOK;	
}

function showDate(currentDate) {
	var myDate = new String(currentDate);
	var arr_myDate = myDate.split('-');
	var returnDate = textMonth(parseFloat(arr_myDate[1]))+' '+arr_myDate[2]+' '+arr_myDate[0];
	return returnDate;
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

function check_holiday(total) {
	var holiday = new String(document.getElementById('holiday').value);
	var arr_holiday = holiday.split(';');
	var detect_holiday = false;
	for (var i=0; i<arr_holiday.length-1; i++) {
		if(arr_holiday[i] == total) {
			detect_holiday = true;
			break;
		}
	}
	return detect_holiday;
}
function check_total_hours() {
	var weekTotal = new String(document.getElementById('total_week_name').value);
	var arr_weekTotal = weekTotal.split(';');
	var detect_week = false;
	var totalWeek = 0.0;
	for (var i=0; i<arr_weekTotal.length-1; i++) {
		totalWeek += parseFloat(document.getElementById(arr_weekTotal[i]).value);
	}
	if(totalWeek >= parseFloat(document.getElementById('min_week').value))
		detect_week = true;
	else
		alert('Submit Failed!\nYou Did Not Meet The Minimum Requirements Of ' + document.getElementById('min_week').value + ' Hours Per Week');
	return detect_week;	
}
function check_empty_tasks() {
	if(document.getElementById('TsID').value) {
		var taskTotal = new String(document.getElementById('TsID').value);
		var arrtaskTotal = taskTotal.split(':');
		for (var i=0; i<arrtaskTotal.length-1; i++) {
			if(!parseFloat(document.getElementById('task:'+arrtaskTotal[i]+':total').value)) {
				alert("Empty Tasks Submission Not Allowed\nPlease Input Hours or Delete Task");
				return false;
			}	
		}
	}
	if(document.getElementById('TsToID').value) {
		var timeoffTotal = new String(document.getElementById('TsToID').value);
		var arrtimeoffTotal = timeoffTotal.split(':');
		for (var i=0; i<arrtimeoffTotal.length-1; i++) {
			if(!parseFloat(document.getElementById('timeoff:'+arrtimeoffTotal[i]+':total').value)) {
				alert("Empty Tasks Submission Not Allowed\nPlease Input Hours or Delete Task");
				return false;
			}	
		}
	}	
	return true;
}
function show_comment(value,comment_date) {
	var targetClockName = '';
	//GET TARGET CLOCK
	var targetClock = new String(value);
	var arrTargetClock = targetClock.split(':');
	if(arrTargetClock[0] == 'c')
		targetClockName = 'clock';
	if(arrTargetClock[0] == 'c_')
		targetClockName = 'clock_';

	//HIDE PREVIOUS CLOCK
	var hideme = document.getElementById('comment_before').value;
	var string_name = 'Time-In, Time-Out & Comments For ' + comment_date;
	if(hideme) {
		if(document.getElementById(hideme)) {
			document.getElementById(hideme).style.display='none';
			//HIDE BEFORE CLOCK
			var beforeClock = new String(hideme);
			var arrBeforeClock = beforeClock.split(':');
			if(arrBeforeClock[0] == 'c')
				beforeClockName = 'clock';
			if(arrBeforeClock[0] == 'c_')
				beforeClockName = 'clock_';
			document.getElementById(beforeClockName+":"+arrBeforeClock[1]+":"+arrBeforeClock[2]).style.display='none';
		}
	}	
	document.getElementById(value).style.display='';
	document.getElementById('comment_title').style.display='';
	document.getElementById('comment_title').style.border=0;
	document.getElementById('comment_title').value=string_name;
	document.getElementById('comment_title').size=string_name.length+30;
	document.getElementById('comment_before').value=value;
	//DO THE CLOCK
	document.getElementById(targetClockName+":"+arrTargetClock[1]+":"+arrTargetClock[2]).style.display='';
}

function total_hours(cell_name) {
	var hours = new String(cell_name);
	var hourString = hours.split(':');
	var total_daily = "total:"+hourString[2];
	var before_cell = cell_name;
	var sum_hours = 0.0;
	
	if(document.getElementById('submit_status').value == 1) {
		var li_Task = new String(document.getElementById('TsAllID').value);
		var li_TaskTo = new String(document.getElementById('TsToAllID').value);
	}
	else {
		var li_Task = new String(document.getElementById('TsID').value);
		var li_TaskTo = new String(document.getElementById('TsToID').value);
	}
	var arr_Task = li_Task.split(':');
	var arr_TaskTo = li_TaskTo.split(':');

	for (var i=0; i<arr_Task.length-1; i++) {
		hour_id = "h:"+arr_Task[i]+":"+hourString[2];
		if (parseFloat(document.getElementById(hour_id).value)){
			sum_hours = sum_hours + parseFloat(document.getElementById(hour_id).value);
		}
	}
	for (var i=0; i<arr_TaskTo.length-1; i++) {
		hour_id = "hto:"+arr_TaskTo[i]+":"+hourString[2];
		if (parseFloat(document.getElementById(hour_id).value)){
			sum_hours = sum_hours + parseFloat(document.getElementById(hour_id).value);
		}
	}
	if(sum_hours > 24) {
		alert('More Than 24 Hours\nEntry Cancelled');
		document.getElementById(before_cell).value='';
		resetClock(cell_name);
		total_hours(cell_name);
	}
	else {
		if(document.getElementById(cell_name).value > 0 || document.getElementById(cell_name).value == '0' || document.getElementById(cell_name).value == '0.0' || document.getElementById(cell_name).value == '0.00') {
			document.getElementById(cell_name).value = FormatNumber(document.getElementById(cell_name).value,2,'.');
			if(total_hours.arguments[1] != 1) //HACK FOR ESCAPING SET CLOCK FUNCTION
				setClock(cell_name);
		}
		else {	
			document.getElementById(cell_name).value = '';
			resetClock(cell_name);
		}
		document.getElementById(total_daily).value = FormatNumber(sum_hours,2,'.');			
	} 
	task_total(cell_name);
	grand_total(document.getElementById('total_week_name').value);
}

function setClock(cell_name) {
	var hourstart = '';
	var minutestart = '';
	var hourend = '';
	var minuteend = '';
	//GET TARGET CLOCK
	var targetClock = new String(cell_name);
	var arrTargetClock = targetClock.split(':');
	if(arrTargetClock[0] == 'h') {
		hourstart = 'hourstart'+":"+arrTargetClock[1]+":"+arrTargetClock[2];
		minutestart = 'minutestart'+":"+arrTargetClock[1]+":"+arrTargetClock[2];
		hourend = 'hourend'+":"+arrTargetClock[1]+":"+arrTargetClock[2];
		minuteend = 'minuteend'+":"+arrTargetClock[1]+":"+arrTargetClock[2];
	}
	if(arrTargetClock[0] == 'hto') {
		hourstart = 'hourstart_'+":"+arrTargetClock[1]+":"+arrTargetClock[2];
		minutestart = 'minutestart_'+":"+arrTargetClock[1]+":"+arrTargetClock[2];
		hourend = 'hourend_'+":"+arrTargetClock[1]+":"+arrTargetClock[2];
		minuteend = 'minuteend_'+":"+arrTargetClock[1]+":"+arrTargetClock[2];
	}
	//GOT THE SELECT PROPERTIES FOR BOTH TIMEIN AND TIMEOUT..PROCEED
  	var hourStart = document.getElementById(hourstart).value;
  	var minuteStart = document.getElementById(minutestart).value;

	var hourEndBefore = parseInt(document.getElementById(cell_name).value);
    var minuteEndBefore = parseInt(document.getElementById(cell_name).value * 60)%60;
        
    var addHour = 0;
    var minuteEnd = parseInt(minuteStart) + parseInt(minuteEndBefore);
    if(minuteEnd >= 60) {
    	addHour = 1;
    	minuteEnd = minuteEnd - 60;
    }
    var hourEnd = parseInt(hourStart) + parseInt(hourEndBefore);

	if(hourEnd > 24)
		hourEnd = hourEnd - 24;
	else if(hourEnd == 24)
		hourEnd = 0;

	document.getElementById(hourend).options[hourEnd].selected = true;
   	document.getElementById(minuteend).options[minuteEnd].selected = true;
}

function resetClock(cell_name) {
	var hourstart = '';
	var minutestart = '';
	var hourend = '';
	var minuteend = '';
	//GET TARGET CLOCK
	var targetClock = new String(cell_name);
	var arrTargetClock = targetClock.split(':');
	if(arrTargetClock[0] == 'h') {
		hourstart = 'hourstart'+":"+arrTargetClock[1]+":"+arrTargetClock[2];
		minutestart = 'minutestart'+":"+arrTargetClock[1]+":"+arrTargetClock[2];
		hourend = 'hourend'+":"+arrTargetClock[1]+":"+arrTargetClock[2];
		minuteend = 'minuteend'+":"+arrTargetClock[1]+":"+arrTargetClock[2];
	}
	if(arrTargetClock[0] == 'hto') {
		hourstart = 'hourstart_'+":"+arrTargetClock[1]+":"+arrTargetClock[2];
		minutestart = 'minutestart_'+":"+arrTargetClock[1]+":"+arrTargetClock[2];
		hourend = 'hourend_'+":"+arrTargetClock[1]+":"+arrTargetClock[2];
		minuteend = 'minuteend_'+":"+arrTargetClock[1]+":"+arrTargetClock[2];
	}

	document.getElementById(hourstart).options[document.getElementById('defaultHourStart').value].selected = true;
	document.getElementById(minutestart).options[document.getElementById('defaultMinuteStart').value].selected = true;
	document.getElementById(hourend).options[document.getElementById('defaultHourStart').value].selected = true;
	document.getElementById(minuteend).options[document.getElementById('defaultMinuteStart').value].selected = true;
}

function grand_total(cell_name) {
	var sum_hours = 0.0;
	var total_cell = new String(cell_name);
	var arrTotal = total_cell.split(';');
	for (var i=0; i<arrTotal.length-1; i++) {
		sum_hours = sum_hours + parseFloat(document.getElementById(arrTotal[i]).value);
	}
	document.getElementById('grand_total').value = FormatNumber(sum_hours,2,'.');	
}

function task_total(cell_name) {
	var hours = new String(cell_name);
	var hourString = hours.split(':');
	var total_daily = hourString[0]+":"+hourString[1]+":";
	var sum_hours = 0.0;
	var gotDate;
	var arr_gotDate;
	var task_cell;
	var task_total;
	var allDate = new String(document.getElementById('total_week_name').value);
	var arr_allDate = allDate.split(';');
	for (var i=0; i<arr_allDate.length-1; i++) {
		task_cell = "";
		gotDate = new String(arr_allDate[i]);
		arr_gotDate = gotDate.split(':'); //arr_gotDate[1] is the date!!!
		task_cell = total_daily + arr_gotDate[1];
		if (parseFloat(document.getElementById(task_cell).value)){
			sum_hours = sum_hours + parseFloat(document.getElementById(task_cell).value);
		}
	}
	if(hourString[0] == "h")
		task_total = "task:"+hourString[1]+":total";
	else	
		task_total = "timeoff:"+hourString[1]+":total";

	document.getElementById(task_total).value = FormatNumber(sum_hours,2,'.');
}

function FormatNumber(Number,Decimals,Separator)
{
 Number += ""          // Force argument to string.
 Decimals += ""        // Force argument to string.
 Separator += ""       // Force argument to string.
 if((Separator == "") || (Separator.length > 1))
  Separator = "."
 if(Number.length == 0)
  Number = "0"
 var OriginalNumber = Number  // Save for number too large.
 var Sign = 1
 var Pad = ""
 var Count = 0
 // If no number passed, force number to 0.
 if(parseFloat(Number)){
  Number = parseFloat(Number)} else {
  Number = 0}
 // If no decimals passed, default decimals to 2.
 if((parseInt(Decimals,10)) || (parseInt(Decimals,10) == 0)){
  Decimals = parseInt(Decimals,10)} else {
  Decimals = 2}
 if(Number < 0)
 {
  Sign = -1         // Remember sign of Number.
  Number *= Sign    // Force absolute value of Number.
 }
 if(Decimals < 0)
  Decimals *= -1    // Force absolute value of Decimals.
 // Next, convert number to rounded integer and force to string value.
 // (Number contains 1 extra digit used to force rounding)
 Number = "" + Math.floor(Number * Math.pow(10,Decimals + 1) + 5)
 if((Number.substring(1,2) == '.')||((Number + '')=='NaN'))
  return(OriginalNumber) // Number too large to format as specified.
 // If length of Number is less than number of decimals requested +1,
 // pad with zeros to requested length.
 if(Number.length < Decimals +1) // Construct pad string.
 {
  for(Count = Number.length; Count <= Decimals; Count++)
   Pad += "0"
 }
 Number = Pad + Number // Pad number as needed.
 if(Decimals == 0){
  // Drop extra digit -- Decimal portion is formatted.
  Number = Number.substring(0, Number.length -1)} else {
  // Or, format number with decimal point and drop extra decimal digit.
 Number = Number.substring(0,Number.length - Decimals -1) +
          Separator +
          Number.substring(Number.length - Decimals -1,
          Number.length -1)}
 if((Number == "") || (parseFloat(Number) < 1))
  Number="0"+Number // Force leading 0 for |Number| less than 1.
 if(Sign == -1)
  Number = "-" + Number  // Set sign of number.
 return(Number)
}