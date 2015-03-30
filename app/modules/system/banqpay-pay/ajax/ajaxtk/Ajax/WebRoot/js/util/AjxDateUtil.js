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


function AjxDateUtil() {
};

AjxDateUtil.YEAR = 1;
AjxDateUtil.MONTH = 2;
AjxDateUtil.WEEK = 3;
AjxDateUtil.DAY = 4;

AjxDateUtil.MSEC_PER_FIFTEEN_MINUTES = 900000;
AjxDateUtil.MSEC_PER_HALF_HOUR = 1800000;
AjxDateUtil.MSEC_PER_HOUR = 3600000;
AjxDateUtil.MSEC_PER_DAY = 24 * AjxDateUtil.MSEC_PER_HOUR;

AjxDateUtil.WEEKDAY_SHORT = AjxDateFormat.WeekdaySegment.WEEKDAYS[AjxDateFormat.SHORT];
AjxDateUtil.WEEKDAY_MEDIUM = AjxDateFormat.WeekdaySegment.WEEKDAYS[AjxDateFormat.MEDIUM];
AjxDateUtil.WEEKDAY_LONG = AjxDateFormat.WeekdaySegment.WEEKDAYS[AjxDateFormat.LONG];

AjxDateUtil.MONTH_SHORT = AjxDateFormat.MonthSegment.MONTHS[AjxDateFormat.SHORT];
AjxDateUtil.MONTH_MEDIUM = AjxDateFormat.MonthSegment.MONTHS[AjxDateFormat.MEDIUM];
AjxDateUtil.MONTH_LONG = AjxDateFormat.MonthSegment.MONTHS[AjxDateFormat.LONG];

AjxDateUtil.FREQ_TO_DISPLAY = {
	SEC: [AjxMsg.second,AjxMsg.seconds],
	MIN: [AjxMsg.minute,AjxMsg.minutes], 
	HOU: [AjxMsg.hour, 	AjxMsg.hours],
	DAI: [AjxMsg.day, 	AjxMsg.days],
	WEE: [AjxMsg.week, 	AjxMsg.weeks],
	MON: [AjxMsg.month, AjxMsg.months],
	YEA: [AjxMsg.year, 	AjxMsg.years]
};

AjxDateUtil._daysPerMonth = {
	0:31,
	1:29,
	2:31,
	3:30,
	4:31,
	5:30,
	6:31,
	7:31,
	8:30,
	9:31,
	10:30,
	11:31
};

AjxDateUtil._12hour = "12";
AjxDateUtil._24hour = "24";

AjxDateUtil._init =
function() {                                           
	AjxDateUtil._dateFormat = AjxDateFormat.getDateInstance(AjxDateFormat.SHORT).clone();
	var segments = AjxDateUtil._dateFormat.getSegments();
	for (var i = 0; i < segments.length; i++) {
		if (segments[i] instanceof AjxDateFormat.YearSegment) {
			segments[i] = new AjxDateFormat.YearSegment(AjxDateUtil._dateFormat, "yyyy");
		}
	}
	AjxDateUtil._dateTimeFormat = 
		new AjxDateFormat(AjxDateUtil._dateFormat.toPattern() + " " + AjxDateFormat.getTimeInstance(AjxDateFormat.SHORT));
	
	AjxDateUtil._dateFormatNoYear = new AjxDateFormat(AjxMsg.formatDateMediumNoYear);
};

AjxDateUtil._init();                    

/* return true if the specified date (yyyy|yy, m (0-11), d (1-31)) 
 * is valid or not.
 */
AjxDateUtil.validDate =
function(y, m, d) {
	var date = new Date(y, m, d);
	var year = y > 999 ? date.getFullYear() : date.getYear();
	return date.getMonth() == m && date.getDate() == d && year == y;
};

/* return number of days (1-31) in specified month (yyyy, mm (0-11))
 */
AjxDateUtil.daysInMonth =
function(y, m) {
	var date = new Date(y, m, 1, 12);
	date.setMonth(date.getMonth()+1);
	date.setDate(date.getDate()-1);
	return date.getDate();
};

/* return true if year is a leap year
 */
AjxDateUtil.isLeapYear =
function(y) {
	return (new Date(y, 1, 29)).getMonth() == 1;
};

/**
 * rolls the month/year. If the day of month in the date passed in is greater
 * then the max day in the new month, set it to the max. The date passed in is
 * modified and also returned.
 */
AjxDateUtil.roll = 
function(date, field, offset) {
	var d = date.getDate();
	 // move back to first day before rolling in case previous
	 // month/year has less days

	if (field == AjxDateUtil.MONTH) {
		date.setDate(1);	
		date.setMonth(date.getMonth() + offset);
		var max = AjxDateUtil.daysInMonth(date.getFullYear(), date.getMonth());
		date.setDate(Math.min(d, max));		
	} else if (field == AjxDateUtil.YEAR) {
		date.setDate(1);		
		date.setFullYear(date.getFullYear() + offset);
		var max = AjxDateUtil.daysInMonth(date.getFullYear(), date.getMonth());
		date.setDate(Math.min(d, max));		
	} else if (field == AjxDateUtil.WEEK) {
		date.setDate(date.getDate() + 7*offset);
	} else if (field == AjxDateUtil.DAY) {
		date.setDate(date.getDate() + offset);		
	} else {
		return date;
	}
	return date;
};

// Computes the difference between now and <dateMSec>. Returns a string describing
// the difference
AjxDateUtil.computeDateDelta =
function(dateMSec) {
	var deltaMSec = (new Date()).getTime() - dateMSec;

	// bug fix #2203 - if delta is less than zero, dont bother computing
	if (deltaMSec < 0) return null;

	var years =  Math.floor(deltaMSec / (AjxDateUtil.MSEC_PER_DAY * 365));
	if (years != 0)
		deltaMSec -= years * AjxDateUtil.MSEC_PER_DAY * 365;
	var months = Math.floor(deltaMSec / (AjxDateUtil.MSEC_PER_DAY * 30.42));
	if (months > 0)
		deltaMSec -= Math.floor(months * AjxDateUtil.MSEC_PER_DAY * 30.42);
	var days = Math.floor(deltaMSec / AjxDateUtil.MSEC_PER_DAY);
	if (days > 0)
		deltaMSec -= days * AjxDateUtil.MSEC_PER_DAY;
	var hours = Math.floor(deltaMSec / AjxDateUtil.MSEC_PER_HOUR);
	if (hours > 0) 
		deltaMSec -= hours * AjxDateUtil.MSEC_PER_HOUR;
	var mins = Math.floor(deltaMSec / 60000);
	if (mins > 0)
		deltaMSec -= mins * 60000;
	var secs = Math.floor(deltaMSec / 1000);
	
	var deltaStr = "";
	if (years > 0) {
		deltaStr =  years + " ";
		deltaStr += (years > 1) ? AjxMsg.years : AjxMsg.year;
		if (years <= 3 && months > 0) {
    		deltaStr += " " + months;
    		deltaStr += " " + ((months > 1) ? AjxMsg.months : AjxMsg.months);
		}
	} else if (months > 0) {
		deltaStr =  months + " ";
		deltaStr += (months > 1) ? AjxMsg.months : AjxMsg.month;
		if (months <= 3 && days > 0) {
    		deltaStr += " " + days;
    		deltaStr += " " + ((days > 1) ? AjxMsg.days : AjxMsg.day);
		}
	} else if (days > 0) {
		deltaStr = days + " ";
		deltaStr += (days > 1) ? AjxMsg.days : AjxMsg.day;
		if (days <= 2 && hours > 0) {
    		deltaStr += " " + hours;
    		deltaStr += " " + ((hours > 1) ? AjxMsg.hours : AjxMsg.hour);
		}
	} else if (hours > 0) {
		deltaStr = hours + " ";
		deltaStr += (hours > 1) ? AjxMsg.hours : AjxMsg.hour;
		if (hours < 5 && mins > 0) {
    		deltaStr += " " + mins;
    		deltaStr += " " + ((mins > 1) ? AjxMsg.minutes : AjxMsg.minute);
		}
	} else if (mins > 0) {
		deltaStr = mins + " ";
		deltaStr += ((mins > 1) ? AjxMsg.minutes : AjxMsg.minute);
		if (mins < 5 && secs > 0) {
    		deltaStr += " " + secs;
    		deltaStr += " " + ((secs > 1) ? AjxMsg.seconds : AjxMsg.second);
		}
	} else {
		deltaStr = secs;
		deltaStr += " " + ((secs > 1) ? AjxMsg.seconds : AjxMsg.second);
	}
	deltaStr += " " + AjxMsg.ago;
	return deltaStr;
};

AjxDateUtil.simpleComputeDateStr = 
function(date, stringToPrepend) {
	var dateStr = AjxDateUtil._dateFormat.format(date);
	return stringToPrepend ? stringToPrepend + dateStr : dateStr;
};
AjxDateUtil.simpleParseDateStr =
function(dateStr) {
	return AjxDateUtil._dateFormat.parse(dateStr);
};

AjxDateUtil.simpleComputeDateTimeStr = 
function(date, stringToPrepend) {
	var dateTimeStr = AjxDateUtil._dateTimeFormat.format(date);
	return stringToPrepend ? stringToPrepend + dateTimeStr : dateTimeStr;
};
AjxDateUtil.simpleParseDateTimeStr =
function(dateTimeStr) {
	return AjxDateUtil._dateTimeFormat.parse(dateTimeStr);
};

AjxDateUtil.longComputeDateStr = 
function(date) {
	var formatter = AjxDateFormat.getDateInstance(AjxDateFormat.FULL);
	return formatter.format(date);
}

AjxDateUtil.computeDateStr =
function(now, dateMSec) {
	if (dateMSec == null)
		return "";

	var date = new Date(dateMSec);
	if (now.getTime() - dateMSec < AjxDateUtil.MSEC_PER_DAY && 
		now.getDay() == date.getDay()) {
		return AjxDateUtil.computeTimeString(date);
	} 
	
	if (now.getFullYear() == date.getFullYear()) {
		return AjxDateUtil._dateFormatNoYear.format(date);
	}
	
	return AjxDateUtil.simpleComputeDateStr(date);
};

AjxDateUtil.computeTimeString =
function(date) {
	var formatter = AjxDateFormat.getTimeInstance(AjxDateFormat.SHORT);
	return formatter.format(date);
};


AjxDateUtil._getHoursStr = 
function(date, pad, useMilitary) {
	var myVal = date.getHours();
	if (!useMilitary) {
		myVal %= 12;
		if (myVal == 0) myVal = 12;
	}
	return pad ? AjxDateUtil._pad(myVal) : myVal;
};

AjxDateUtil._getMinutesStr = 
function(date) {
	return AjxDateUtil._pad(date.getMinutes());
};

AjxDateUtil._getSecondsStr = 
function(date) {
	return AjxDateUtil._pad(date.getSeconds());
};

AjxDateUtil._getAMPM = 
function (date, upper) {
	var myHour = date.getHours();
	return (myHour < 12) ? (upper ? 'AM' : 'am') : (upper ? 'PM' : 'pm');
};

AjxDateUtil._getMonthName = 
function(date, abbreviated) {
	return abbreviated
		? AjxDateUtil.MONTH_MEDIUM[date.getMonth()]
		: AjxDateUtil.MONTH_LONG[date.getMonth()];
};

AjxDateUtil._getMonth = 
function(date, pad) {
	var myMonth = date.getMonth() + 1;
	if (pad) {
		return AjxDateUtil._pad(myMonth);
	} else {
		return myMonth;
	}
};

AjxDateUtil._getDate = 
function(date, pad) {
	var myVal = date.getDate();
	return pad == true ? AjxDateUtil._pad(myVal) : myVal;
};

AjxDateUtil._getWeekday =
function (date) {
	var myVal = date.getDay();
	return AjxDateUtil.WEEKDAY_LONG[myVal];
};

AjxDateUtil._getFullYear = 
function(date) {
	return date.getFullYear();
};

AjxDateUtil.getTimeStr = 
function(date, format) {
	var s = format;
	s = s.replace(/%d/g, AjxDateUtil._getDate(date, true));				// zero padded day of the month
	s = s.replace(/%D/g, AjxDateUtil._getDate(date, false));			// day of the month without padding
	s = s.replace(/%w/g, AjxDateUtil._getWeekday(date));				// day of the week
	s = s.replace(/%M/g, AjxDateUtil._getMonthName(date));				// full month name
	s = s.replace(/%t/g, AjxDateUtil._getMonthName(date, true));		// abbr. month name
	s = s.replace(/%n/g, AjxDateUtil._getMonth(date, true));		    // zero padded month
	s = s.replace(/%Y/g, AjxDateUtil._getFullYear(date));				// full year
	s = s.replace(/%h/g, AjxDateUtil._getHoursStr(date, false, false));	// non-padded hours
	s = s.replace(/%H/g, AjxDateUtil._getHoursStr(date, true, false ));	// padded hours
	s = s.replace(/%m/g, AjxDateUtil._getMinutesStr(date));				// padded minutes
	s = s.replace(/%s/g, AjxDateUtil._getSecondsStr(date));				// padded seconds
	s = s.replace(/%P/g, AjxDateUtil._getAMPM(date, true));				// upper case AM PM
	s = s.replace(/%p/g, AjxDateUtil._getAMPM(date, false));			// lower case AM PM
	return s;
};

AjxDateUtil.getRoundedMins = 
function (date, roundTo) {
	var mins = date.getMinutes();
	if (mins != 0 && roundTo)
		mins = (Math.ceil( (mins/roundTo) )) * roundTo;
	return mins;
};

AjxDateUtil.roundTimeMins = 
function(date, roundTo) {
	var mins = date.getMinutes();
	var hours = date.getHours();
	if (mins != 0 && roundTo){
		mins = (Math.ceil( (mins/roundTo) )) * roundTo;
		if (mins == 60) {
			mins = 0;
			hours++;
		}
		date.setMinutes(mins);
		date.setHours(hours);
	}
	return date;
};

AjxDateUtil.isInRange = 
function(startTime1, endTime1, startTime2, endTime2) {
	return (startTime1 < endTime2 && endTime1 > startTime2);
}

AjxDateUtil.getSimpleDateFormat =
function() {
	return AjxDateUtil._dateFormat;
};

/**
 * The following are helper routines for processing server date/time which comes
 * in this format: YYYYMMDDTHHMMSSZ
*/
AjxDateUtil.getServerDate = 
function(date) {
	if (!AjxDateUtil._serverDateFormatter) {
		AjxDateUtil._serverDateFormatter = new AjxDateFormat("yyyyMMdd");
	}
	return AjxDateUtil._serverDateFormatter.format(date);
};

AjxDateUtil.getServerDateTime = 
function(date, useUTC) {
	var newDate = date;
	var formatter = null;

	if (useUTC) {
		if (!AjxDateUtil._serverDateTimeFormatterUTC) {
			AjxDateUtil._serverDateTimeFormatterUTC = new AjxDateFormat("yyyyMMdd'T'HHmmss'Z'");
		}
		formatter = AjxDateUtil._serverDateTimeFormatterUTC;
		// add timezone offset to this UTC date
		newDate = new Date(date.getTime());
		newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset());
	} else {
		if (!AjxDateUtil._serverDateTimeFormatter) {
			AjxDateUtil._serverDateTimeFormatter = new AjxDateFormat("yyyyMMdd'T'HHmmss");
		}
		formatter = AjxDateUtil._serverDateTimeFormatter;
	}

	return formatter.format(newDate);
};

AjxDateUtil.parseServerTime = 
function(serverStr, date) {
	if (serverStr.charAt(8) == 'T') {
		var hh = parseInt(serverStr.substr(9,2), 10);
		var mm = parseInt(serverStr.substr(11,2), 10);
		var ss = parseInt(serverStr.substr(13,2), 10);
		if (serverStr.charAt(15) == 'Z') {
			mm += AjxTimezone.getOffset(AjxTimezone.DEFAULT, date);
		}
		date.setHours(hh, mm, ss, 0);
	}
	return date;
};

AjxDateUtil.parseServerDateTime = 
function(serverStr) {
	if (serverStr == null) return null;

	var d = new Date();
	var yyyy = parseInt(serverStr.substr(0,4), 10);
	var MM = parseInt(serverStr.substr(4,2), 10);
	var dd = parseInt(serverStr.substr(6,2), 10);
	d.setFullYear(yyyy);
	d.setMonth(MM - 1);
	d.setMonth(MM - 1); // DON'T remove second call to setMonth (see bug #3839)
	d.setDate(dd);
	AjxDateUtil.parseServerTime(serverStr, d);
	return d;
};

AjxDateUtil._pad = 
function(n) {
	return n < 10 ? ('0' + n) : n;
};
