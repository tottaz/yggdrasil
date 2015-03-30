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


// NOTE: The API for the classes in this file are inspired by the Java text
//		 formatting classes but the implementation was NOT copied or ported
//		 from the Java sources.

//
// Format class
//

/** 
 * Base class for all formats. To format an object, instantiate the
 * format of your choice and call the <code>format</code> method which
 * returns the formatted string.
 */
function AjxFormat(pattern) {
	this._pattern = pattern;
	this._segments = [];
}

/** Returns string representation of this object. */
AjxFormat.prototype.toString = function() { 
	var s = [];
	s.push("pattern=\"",this._pattern,'"');
	if (this._segments.length > 0) {
		s.push(", segments={ ");
		for (var i = 0; i < this._segments.length; i++) {
			if (i > 0) { s.push(", "); }
			s.push(String(this._segments[i]));
		}
		s.push(" }");
	}
	return s.join("");
};

// Data

AjxFormat.prototype._pattern;
AjxFormat.prototype._segments;

// Public methods

/** 
 * This method does <em>not</em> need to be overridden unless
 * the subclass doesn't use format segments and takes complete 
 * responsibility for formatting.
 */
AjxFormat.prototype.format = function(object) { 
	var s = [];
	for (var i = 0; i < this._segments.length; i++) {
		s.push(this._segments[i].format(object));
	}
	return s.join("");
};

/** 
 * Parses the given string according to this format's pattern and returns
 * an object.
 * <p>
 * <strong>Note:</strong>
 * The default implementation of this method assumes that the sub-class
 * has implemented the <code>_createParseObject</code> method.
 */
AjxFormat.prototype.parse = function(s) {
	var object = this._createParseObject();
	var index = 0;
	for (var i = 0; i < this._segments.length; i++) {
		var segment = this._segments[i];
		index = segment.parse(object, s, index);
	}
	// REVISIT: Should this return null instead?
	if (index < s.length) {
		throw new AjxFormat.ParsingException(this, null, "input too long"); // I18n
	}
	return object;
};

/** 
 * Returns an array of segments that comprise this format. 
 * <p>
 * <strong>Note:</strong>
 * This method is specific to this implementation and does not follow
 * the format classes found in the <code>java.text</code> package.
 */
AjxFormat.prototype.getSegments = function() {
	return this._segments;
};

/** Returns a string pattern for this format. */
AjxFormat.prototype.toPattern = function() {
	return this._pattern;
};

/** Returns a copy of this format. */
AjxFormat.prototype.clone = function() {
	return new this.constructor(this._pattern);
};

// Protected methods

/**
 * Creates the object that is initialized by parsing
 * <p>
 * <strong>Note:</strong>
 * This must be implemented by sub-classes.
 */
AjxFormat.prototype._createParseObject = function(s) {
	throw new AjxFormat.ParsingException(this, null, "not implemented"); // I18n
};

// Protected static methods

AjxFormat._zeroPad = function(s, length, zeroChar, rightSide) {
	s = typeof s == "string" ? s : String(s);

	if (s.length >= length) return s;

	zeroChar = zeroChar || '0';
	
	var a = [];
	for (var i = s.length; i < length; i++) {
		a.push(zeroChar);
	}
	a[rightSide ? "unshift" : "push"](s);

	return a.join("");
};

//
// Format exception base class
//

AjxFormat.FormatException = function(format, message) {
	this._format = format;
	this._message = message;
};
AjxFormat.FormatException.prototype.toString = function() { 
	return this._message; 
};

// Data

AjxFormat.FormatException.prototype._format;
AjxFormat.FormatException.prototype._message;

//
// Formatting exception class
//

AjxFormat.FormattingException = function(format, segment, message) {
	AjxFormat.FormatException.call(this, format, message);
	this._segment = segment;
};
AjxFormat.FormattingException.prototype = new AjxFormat.FormatException;
AjxFormat.FormattingException.prototype.constructor = AjxFormat.FormattingException;

// Data

AjxFormat.FormattingException.prototype._segment;

//
// Parsing exception class
//

AjxFormat.ParsingException = function(format, segment, message) {
	AjxFormat.FormatException.call(this, format, message);
	this._segment = segment;
};
AjxFormat.ParsingException.prototype = new AjxFormat.FormatException;
AjxFormat.ParsingException.prototype.constructor = AjxFormat.ParsingException;

// Data

AjxFormat.ParsingException.prototype._segment;

//
// Segment class
//

AjxFormat.Segment = function(format, s) {
	this._parent = format;
	this._s = s;
};

AjxFormat.Segment.prototype.toString = function() { 
	return "segment: \""+this._s+'"'; 
};

// Data

AjxFormat.Segment.prototype._parent;
AjxFormat.Segment.prototype._s;

// Public methods

AjxFormat.Segment.prototype.format = function(o) { 
	return this._s; 
};

/**
 * Parses the string at the given index, initializes the parse object
 * (as appropriate), and returns the new index within the string for
 * the next parsing step.
 * <p>
 * <strong>Note:</strong>
 * This method must be implemented by sub-classes.
 *
 * @param o     [object] The parse object to be initialized.
 * @param s     [string] The input string to be parsed.
 * @param index [number] The index within the string to start parsing.
 */
AjxFormat.Segment.prototype.parse = function(o, s, i) {
	throw new AjxFormat.ParsingException(this._parent, this, "not implemented"); // I18n
};

// Protected static methods

AjxFormat.Segment._parseLiteral = function(literal, s, index) {
	if (s.length - index < literal.length) {
		throw new AjxFormat.ParsingException(this._parent, this, "input too short"); // I18n
	}
	for (var i = 0; i < literal.length; i++) {
		if (literal.charAt(i) != s.charAt(index + i)) {
			throw new AjxFormat.ParsingException(this._parent, this, "input doesn't match"); // I18n
		}
	}
	return index + literal.length;
};
AjxFormat.Segment._parseLiterals = function(literals, s, index) {
	for (var i = 0; i < literals.length; i++) {
		try {
			var literal = literals[i];
			return AjxFormat.Segment._parseLiteral(literal, s, index);
		}
		catch (e) {
			// ignore. keep trying to find a match
		}
	}
	return -1;
};

/**
 * Parses an integer at the offset of the given string and calls a
 * method on the specified object.
 *
 * @param o         [object]   The target object.
 * @param f         [function] The method to call on the target object.
 * @param adjust    [number]   The numeric adjustment to make on the
 *                             value before calling the object method.
 * @param s         [string]   The string to parse.
 * @param index     [number]   The index within the string to start parsing.
 * @param fixedlen  [number]   If specified, specifies the required number
 *                             of digits to be parsed.
 */
AjxFormat.Segment._parseInt = function(o, f, adjust, s, index, fixedlen) {
	var len = fixedlen || s.length - index;
	var head = index;
	for (var i = 0; i < len; i++) {
		if (!s.charAt(index++).match(/\d/)) {
			index--;
			break;
		}
	}
	var tail = index;
	if (head == tail) {
		throw new AjxFormat.ParsingException(this._parent, this, "number not present"); // I18n
	}
	if (fixedlen && tail - head != fixedlen) {
		throw new AjxFormat.ParsingException(this._parent, this, "number too short"); // I18n
	}
	var value = parseInt(s.substring(head, tail), 10);
	if (f) {
		var target = o || window;
		f.call(target, value + adjust);
	}
	return tail;
};

//
// Date format class
//

/**
 * The AjxDateFormat class formats Date objects according to a specified 
 * pattern. The patterns are defined the same as the SimpleDateFormat
 * class in the Java libraries. <strong>Note:</strong> <em>Only the
 * Gregorian Calendar is supported at this time.</em> Supporting other
 * calendars would require a lot more information downloaded to the
 * client. Limiting dates to the Gregorian calendar is a trade-off.
 * <p>
 * <strong>Note:</strong>
 * The date format differs from the Java patterns a few ways: the pattern
 * "EEEEE" (5 'E's) denotes a <em>short</em> weekday and the pattern "MMMMM"
 * (5 'M's) denotes a <em>short</em> month name. This matches the extended 
 * pattern found in the Common Locale Data Repository (CLDR) found at: 
 * http://www.unicode.org/cldr/.
 */
function AjxDateFormat(pattern) {
	AjxFormat.call(this, pattern);
	if (typeof pattern == "number") {
		switch (pattern) {
			case AjxDateFormat.SHORT: pattern = I18nMsg.formatDateShort; break;
			case AjxDateFormat.MEDIUM: pattern = I18nMsg.formatDateMedium; break;
			case AjxDateFormat.LONG: pattern = I18nMsg.formatDateLong; break;
			case AjxDateFormat.FULL: pattern = I18nMsg.formatDateFull; break;
		}
	}	
	for (var i = 0; i < pattern.length; i++) {
		// literal
		var c = pattern.charAt(i);
		if (c == "'") {
			var head = i + 1;
			for (i++ ; i < pattern.length; i++) {
				var c = pattern.charAt(i);
				if (c == "'") {
					if (i + 1 < pattern.length && pattern.charAt(i + 1) == "'") {
						pattern = pattern.substr(0, i) + pattern.substr(i + 1);
					}
					else {
						break;
					}
				}
			}
			if (i == pattern.length) {
				// TODO: i18n
				throw new FormatException(this, "unterminated string literal");
			}
			var tail = i;
			var segment = new AjxFormat.TextSegment(this, pattern.substring(head, tail));
			this._segments.push(segment);
			continue;
		}

		// non-meta chars
		var head = i;
		while(i < pattern.length) {
			c = pattern.charAt(i);
			if (AjxDateFormat._META_CHARS.indexOf(c) != -1 || c == "'") {
				break;
			}
			i++;
		}
		var tail = i;
		if (head != tail) {
			var segment = new AjxFormat.TextSegment(this, pattern.substring(head, tail));
			this._segments.push(segment);
			i--;
			continue;
		}
		
		// meta char
		var head = i;
		while(++i < pattern.length) {
			if (pattern.charAt(i) != c) {
				break;
			}		
		}
		var tail = i--;
		var count = tail - head;
		var field = pattern.substr(head, count);
		var segment = null;
		switch (c) {
			case 'G': segment = new AjxDateFormat.EraSegment(this, field); break;
			case 'y': segment = new AjxDateFormat.YearSegment(this, field); break;
			case 'M': segment = new AjxDateFormat.MonthSegment(this, field); break;
			case 'w': segment = new AjxDateFormat.WeekSegment(this, field); break;
			case 'W': segment = new AjxDateFormat.WeekSegment(this, field); break;
			case 'D': segment = new AjxDateFormat.DaySegment(this, field); break;
			case 'd': segment = new AjxDateFormat.DaySegment(this, field); break;
			case 'F': segment = new AjxDateFormat.WeekdaySegment(this, field); break;
			case 'E': segment = new AjxDateFormat.WeekdaySegment(this, field); break;
			case 'a': segment = new AjxDateFormat.AmPmSegment(this, field); break;
			case 'H': segment = new AjxDateFormat.HourSegment(this, field); break;
			case 'k': segment = new AjxDateFormat.HourSegment(this, field); break;
			case 'K': segment = new AjxDateFormat.HourSegment(this, field); break;
			case 'h': segment = new AjxDateFormat.HourSegment(this, field); break;
			case 'm': segment = new AjxDateFormat.MinuteSegment(this, field); break;
			case 's': segment = new AjxDateFormat.SecondSegment(this, field); break;
			case 'S': segment = new AjxDateFormat.SecondSegment(this, field); break;
			case 'z': segment = new AjxDateFormat.TimezoneSegment(this, field); break;
			case 'Z': segment = new AjxDateFormat.TimezoneSegment(this, field); break;
		}
		if (segment != null) {
			segment._index = this._segments.length;
			this._segments.push(segment);
		}
	}
}
AjxDateFormat.prototype = new AjxFormat;
AjxDateFormat.prototype.constructor = AjxDateFormat;

AjxDateFormat.prototype.toString = function() {
	return "[AjxDateFormat: "+AjxFormat.prototype.toString.call(this)+"]";
};

// Constants

AjxDateFormat.SHORT = 0;
AjxDateFormat.MEDIUM = 1;
AjxDateFormat.LONG = 2;
AjxDateFormat.FULL = 3;
AjxDateFormat.DEFAULT = AjxDateFormat.MEDIUM;

AjxDateFormat._META_CHARS = "GyMwWDdFEaHkKhmsSzZ";

AjxDateFormat._dateFormats = [
	I18nMsg.formatDateShort, I18nMsg.formatDateMedium,
	I18nMsg.formatDateLong, I18nMsg.formatDateFull
];
AjxDateFormat._timeFormats = [
	I18nMsg.formatTimeShort, I18nMsg.formatTimeMedium, 
	I18nMsg.formatTimeLong, I18nMsg.formatTimeFull
];

AjxDateFormat._DATE_FORMATTERS = {};
AjxDateFormat._TIME_FORMATTERS = {};
AjxDateFormat._DATETIME_FORMATTERS = {};

// Static methods

AjxDateFormat.getDateInstance = function(style) {
	// lazily create formatters
	style = style != null ? style : AjxDateFormat.DEFAULT;
	if (!AjxDateFormat._DATE_FORMATTERS[style]) {
		AjxDateFormat._DATE_FORMATTERS[style] = new AjxDateFormat(AjxDateFormat._dateFormats[style]);
	}
	return AjxDateFormat._DATE_FORMATTERS[style];
};

AjxDateFormat.getTimeInstance = function(style) {
	// lazily create formatters
	style = style != null ? style : AjxDateFormat.DEFAULT;
	if (!AjxDateFormat._TIME_FORMATTERS[style]) {
		AjxDateFormat._TIME_FORMATTERS[style] = new AjxDateFormat(AjxDateFormat._timeFormats[style]);
	}
	return AjxDateFormat._TIME_FORMATTERS[style];
};

AjxDateFormat.getDateTimeInstance = function(dateStyle, timeStyle) {
	// lazily create formatters
	dateStyle = dateStyle != null ? dateStyle : AjxDateFormat.DEFAULT;
	timeStyle = timeStyle != null ? timeStyle : AjxDateFormat.DEFAULT;
	var style = dateStyle * 10 + timeStyle;
	if (!AjxDateFormat._DATETIME_FORMATTERS[style]) {
		var pattern = I18nMsg.formatDateTime;
		var params = [ AjxDateFormat._dateFormats[dateStyle], AjxDateFormat._timeFormats[timeStyle] ];
		
		var dateTimePattern = AjxMessageFormat.format(pattern, params);
		AjxDateFormat._DATETIME_FORMATTERS[style] = new AjxDateFormat(dateTimePattern);
	}
	return AjxDateFormat._DATETIME_FORMATTERS[style];
};

AjxDateFormat.format = function(pattern, date) {
	return new AjxDateFormat(pattern).format(date);
};
AjxDateFormat.parse = function(pattern, dateStr) {
	return new AjxDateFormat(pattern).parse(dateStr);
};

// Public methods

/** 
 * Parses the given string and returns a date. If the string cannot be
 * parsed as a date, <code>null</code> is returned.
 */
AjxDateFormat.prototype.parse = function(s) {
	var object = null;
	try {
		object = AjxFormat.prototype.parse.call(this, s);
	}
	catch (e) {
		// do nothing
	}
	return object;
};

// Protected methods

AjxDateFormat.prototype._createParseObject = function() {
	return new Date(0, 0, 1, 0, 0, 0, 0);
};

//
// Text segment class
//

AjxFormat.TextSegment = function(format, s) {
	AjxFormat.Segment.call(this, format, s);
};
AjxFormat.TextSegment.prototype = new AjxFormat.Segment;
AjxFormat.TextSegment.prototype.constructor = AjxFormat.TextSegment;

AjxFormat.TextSegment.prototype.toString = function() { 
	return "text: \""+this._s+'"'; 
};

// Public methods

AjxFormat.TextSegment.prototype.parse = function(o, s, index) {
	return AjxFormat.Segment._parseLiteral(this._s, s, index);
};

//
// Date segment class
//

AjxDateFormat.DateSegment = function(format, s) {
	AjxFormat.Segment.call(this, format, s);
}
AjxDateFormat.DateSegment.prototype = new AjxFormat.Segment;
AjxDateFormat.DateSegment.prototype.constructor = AjxDateFormat.DateSegment;

// Protected methods

AjxDateFormat.DateSegment.prototype._getFixedLength = function() {
	var fixedlen;
	if (this._index + 1 < this._parent._segments.length) {
		var nextSegment = this._parent._segments[this._index + 1];
		if (!(nextSegment instanceof AjxFormat.TextSegment)) {
			fixedlen = this._s.length;
		}
	}
	return fixedlen;
};

//
// Date era segment class
//

AjxDateFormat.EraSegment = function(format, s) {
	AjxDateFormat.DateSegment.call(this, format, s);
};
AjxDateFormat.EraSegment.prototype = new AjxDateFormat.DateSegment;
AjxDateFormat.EraSegment.prototype.constructor = AjxDateFormat.EraSegment;

AjxDateFormat.EraSegment.prototype.toString = function() { 
	return "dateEra: \""+this._s+'"'; 
};

// Public methods

AjxDateFormat.EraSegment.prototype.format = function(date) { 
	// TODO: Only support current era at the moment...
	return I18nMsg.eraAD;
};

//
// Date year segment class
//

AjxDateFormat.YearSegment = function(format, s) {
	AjxDateFormat.DateSegment.call(this, format, s);
};
AjxDateFormat.YearSegment.prototype = new AjxDateFormat.DateSegment;
AjxDateFormat.YearSegment.prototype.constructor = AjxDateFormat.YearSegment;

AjxDateFormat.YearSegment.prototype.toString = function() { 
	return "dateYear: \""+this._s+'"'; 
};

// Public methods

AjxDateFormat.YearSegment.prototype.format = function(date) { 
	var year = String(date.getFullYear());
	return this._s.length < 4 ? year.substr(year.length - 2) : AjxFormat._zeroPad(year, this._s.length);
};

AjxDateFormat.YearSegment.prototype.parse = function(date, s, index) {
	var fixedlen = this._getFixedLength();
	var nindex = AjxFormat.Segment._parseInt(date, date.setFullYear, 0, s, index, fixedlen);
	// adjust 2-digit years
	if (nindex - index == 2) {
		if (!AjxDateFormat._2digitStartYear) {
			AjxDateFormat._2digitStartYear = parseInt(AjxMsg.dateParsing2DigitStartYear);
		}
		var syear = AjxDateFormat._2digitStartYear;
		var pyear = parseInt(s.substr(index,2));
		var century = (Math.floor(syear / 100) + (pyear < (syear % 100) ? 1 : 0)) * 100;
		var year = century + pyear;
		date.setFullYear(year);
	}
	return nindex;
};

//
// Date month segment class
//

AjxDateFormat.MonthSegment = function(format, s) {
	AjxDateFormat.DateSegment.call(this, format, s);
};
AjxDateFormat.MonthSegment.prototype = new AjxDateFormat.DateSegment;
AjxDateFormat.MonthSegment.prototype.constructor = AjxDateFormat.MonthSegment;

AjxDateFormat.MonthSegment.prototype.toString = function() { 
	return "dateMonth: \""+this._s+'"'; 
};

// Constants

AjxDateFormat.MonthSegment.MONTHS = {};
AjxDateFormat.MonthSegment.MONTHS[AjxDateFormat.SHORT] = [
	AjxMsg.monthJanShort, AjxMsg.monthFebShort, AjxMsg.monthMarShort, 
	AjxMsg.monthAprShort, AjxMsg.monthMayShort, AjxMsg.monthJunShort, 
	AjxMsg.monthJulShort, AjxMsg.monthAugShort, AjxMsg.monthSepShort, 
	AjxMsg.monthOctShort, AjxMsg.monthNovShort, AjxMsg.monthDecShort
];
AjxDateFormat.MonthSegment.MONTHS[AjxDateFormat.MEDIUM] = [ 
	I18nMsg.monthJanMedium, I18nMsg.monthFebMedium, I18nMsg.monthMarMedium,
	I18nMsg.monthAprMedium, I18nMsg.monthMayMedium, I18nMsg.monthJunMedium,
	I18nMsg.monthJulMedium, I18nMsg.monthAugMedium, I18nMsg.monthSepMedium,
	I18nMsg.monthOctMedium, I18nMsg.monthNovMedium, I18nMsg.monthDecMedium
];
AjxDateFormat.MonthSegment.MONTHS[AjxDateFormat.LONG] = [ 
	I18nMsg.monthJanLong, I18nMsg.monthFebLong, I18nMsg.monthMarLong,
	I18nMsg.monthAprLong, I18nMsg.monthMayLong, I18nMsg.monthJunLong,
	I18nMsg.monthJulLong, I18nMsg.monthAugLong, I18nMsg.monthSepLong,
	I18nMsg.monthOctLong, I18nMsg.monthNovLong, I18nMsg.monthDecLong
];

// Public methods

AjxDateFormat.MonthSegment.prototype.format = function(date) {
	var month = date.getMonth();
	switch (this._s.length) {
		case 1: return String(month + 1);
		case 2: return AjxFormat._zeroPad(month + 1, 2);
		case 3: return AjxDateFormat.MonthSegment.MONTHS[AjxDateFormat.MEDIUM][month];
		case 5: return AjxDateFormat.MonthSegment.MONTHS[AjxDateFormat.SHORT][month];
	}
	return AjxDateFormat.MonthSegment.MONTHS[AjxDateFormat.LONG][month];
};

AjxDateFormat.MonthSegment.prototype.parse = function(date, s, index) {
	var months;
	switch (this._s.length) {
		case 3: 
			months = AjxDateFormat.MonthSegment.MONTHS[AjxDateFormat.SHORT];
		case 4: 
			months = months || AjxDateFormat.MonthSegment.MONTHS[AjxDateFormat.MEDIUM];
		case 5: {
			months = months || AjxDateFormat.MonthSegment.MONTHS[AjxDateFormat.LONG];
			var nindex = AjxFormat.Segment._parseLiterals(months, s, index);
			if (nindex != -1) {
				return nindex;
			}
			throw new AjxFormat.ParsingException(this._parent, this, "no match"); // I18n
		}
	}
	var fixedlen = this._getFixedLength();
	return AjxFormat.Segment._parseInt(date, date.setMonth, -1, s, index, fixedlen);
};

//
// Date week segment class
//

AjxDateFormat.WeekSegment = function(format, s) {
	AjxDateFormat.DateSegment.call(this, format, s);
};
AjxDateFormat.WeekSegment.prototype = new AjxDateFormat.DateSegment;
AjxDateFormat.WeekSegment.prototype.constructor = AjxDateFormat.WeekSegment;

AjxDateFormat.WeekSegment.prototype.toString = function() { 
	return "weekMonth: \""+this._s+'"'; 
};

// Public methods

AjxDateFormat.WeekSegment.prototype.format = function(date) {
	var year = date.getYear();
	var month = date.getMonth();
	var day = date.getDate();
	
	var ofYear = /w/.test(this._s);
	var date2 = new Date(year, ofYear ? 0 : month, 1);

	var week = 0;
	while (true) {
		week++;
		if (date2.getMonth() > month || (date2.getMonth() == month && date2.getDate() >= day)) {
			break;
		}
		date2.setDate(date2.getDate() + 7);
	}

	return AjxFormat._zeroPad(week, this._s.length);
};

//
// Date day segment class
//

AjxDateFormat.DaySegment = function(format, s) {
	AjxDateFormat.DateSegment.call(this, format, s);
};
AjxDateFormat.DaySegment.prototype = new AjxDateFormat.DateSegment;
AjxDateFormat.DaySegment.prototype.constructor = AjxDateFormat.DaySegment;

AjxDateFormat.DaySegment.prototype.toString = function() { 
	return "dateDay: \""+this._s+'"'; 
};

// Public methods

AjxDateFormat.DaySegment.prototype.format = function(date) {
	var month = date.getMonth();
	var day = date.getDate();
	if (/D/.test(this._s) && month > 0) {
		var year = date.getYear();
		do {
			// set date to first day of month and then go back one day
			var date2 = new Date(year, month, 1);
			date2.setDate(0); 
			
			day += date2.getDate();
			month--;
		} while (month > 0);
	}
	return AjxFormat._zeroPad(day, this._s.length);
};

AjxDateFormat.DaySegment.prototype.parse = function(date, s, index) {
	if (/D/.test(this._s)) {
		date.setMonth(0);
	}
	var fixedlen = this._getFixedLength();
	return AjxFormat.Segment._parseInt(date, date.setDate, 0, s, index, fixedlen);
};

//
// Date weekday segment class
//

AjxDateFormat.WeekdaySegment = function(format, s) {
	AjxDateFormat.DateSegment.call(this, format, s);
};
AjxDateFormat.WeekdaySegment.prototype = new AjxDateFormat.DateSegment;
AjxDateFormat.WeekdaySegment.prototype.constructor = AjxDateFormat.WeekdaySegment;

AjxDateFormat.DaySegment.prototype.toString = function() { 
	return "dateDay: \""+this._s+'"'; 
};

// Constants

AjxDateFormat.WeekdaySegment.WEEKDAYS = {};
// NOTE: The short names aren't available in Java so we have to define them.
AjxDateFormat.WeekdaySegment.WEEKDAYS[AjxDateFormat.SHORT] = [ 
	AjxMsg.weekdaySunShort, AjxMsg.weekdayMonShort, AjxMsg.weekdayTueShort,
	AjxMsg.weekdayWedShort, AjxMsg.weekdayThuShort, AjxMsg.weekdayFriShort,
	AjxMsg.weekdaySatShort
];
AjxDateFormat.WeekdaySegment.WEEKDAYS[AjxDateFormat.MEDIUM] = [ 
	I18nMsg.weekdaySunMedium, I18nMsg.weekdayMonMedium, I18nMsg.weekdayTueMedium,
	I18nMsg.weekdayWedMedium, I18nMsg.weekdayThuMedium, I18nMsg.weekdayFriMedium,
	I18nMsg.weekdaySatMedium
];
AjxDateFormat.WeekdaySegment.WEEKDAYS[AjxDateFormat.LONG] = [ 
	I18nMsg.weekdaySunLong, I18nMsg.weekdayMonLong, I18nMsg.weekdayTueLong,
	I18nMsg.weekdayWedLong, I18nMsg.weekdayThuLong, I18nMsg.weekdayFriLong,
	I18nMsg.weekdaySatLong
];

// Public methods

AjxDateFormat.WeekdaySegment.prototype.format = function(date) {
	var weekday = date.getDay();
	if (/E/.test(this._s)) {
		var style;
		switch (this._s.length) {
			case 4: style = AjxDateFormat.LONG; break;
			case 5: style = AjxDateFormat.SHORT; break;
			default: style = AjxDateFormat.MEDIUM;
		}
		return AjxDateFormat.WeekdaySegment.WEEKDAYS[style][weekday];
	}
	return AjxFormat._zeroPad(weekday, this._s.length);
};

//
// Time segment class
//

AjxDateFormat.TimeSegment = function(format, s) {
	AjxFormat.Segment.call(this, format, s);
};
AjxDateFormat.TimeSegment.prototype = new AjxFormat.Segment;
AjxDateFormat.TimeSegment.prototype.constructor = AjxDateFormat.TimeSegment;

//
// Time hour segment class
//

AjxDateFormat.HourSegment = function(format, s) {
	AjxFormat.Segment.call(this, format, s);
};
AjxDateFormat.HourSegment.prototype = new AjxDateFormat.TimeSegment;
AjxDateFormat.HourSegment.prototype.constructor = AjxDateFormat.HourSegment;

AjxDateFormat.HourSegment.prototype.toString = function() { 
	return "timeHour: \""+this._s+'"'; 
};

// Public methods

AjxDateFormat.HourSegment.prototype.format = function(date) {
	var hours = date.getHours();
	if (hours > 12 && /[hK]/.test(this._s)) {
		hours -= 12;
	}
	/***
	// NOTE: This is commented out to match the Java formatter output
	//       but from the comments for these meta-chars, it doesn't
	//       seem right.
	if (/[Hk]/.test(this._s)) {
		hours--;
	}
	/***/
	return AjxFormat._zeroPad(hours, this._s.length);
};

//
// Time minute segment class
//

AjxDateFormat.MinuteSegment = function(format, s) {
	AjxFormat.Segment.call(this, format, s);
};
AjxDateFormat.MinuteSegment.prototype = new AjxDateFormat.TimeSegment;
AjxDateFormat.MinuteSegment.prototype.constructor = AjxDateFormat.MinuteSegment;

AjxDateFormat.MinuteSegment.prototype.toString = function() { 
	return "timeMinute: \""+this._s+'"'; 
};

// Public methods

AjxDateFormat.MinuteSegment.prototype.format = function(date) {
	var minutes = date.getMinutes();
	return AjxFormat._zeroPad(minutes, this._s.length);
};

//
// Time second segment class
//

AjxDateFormat.SecondSegment = function(format, s) {
	AjxFormat.Segment.call(this, format, s);
};
AjxDateFormat.SecondSegment.prototype = new AjxDateFormat.TimeSegment;
AjxDateFormat.SecondSegment.prototype.constructor = AjxDateFormat.SecondSegment;

AjxDateFormat.SecondSegment.prototype.toString = function() { 
	return "timeSecond: \""+this._s+'"'; 
};

// Public methods

AjxDateFormat.SecondSegment.prototype.format = function(date) {
	var minutes = /s/.test(this._s) ? date.getSeconds() : date.getMilliseconds();
	return AjxFormat._zeroPad(minutes, this._s.length);
};

//
// Time am/pm segment class
//

AjxDateFormat.AmPmSegment = function(format, s) {
	AjxFormat.Segment.call(this, format, s);
};
AjxDateFormat.AmPmSegment.prototype = new AjxDateFormat.TimeSegment;
AjxDateFormat.AmPmSegment.prototype.constructor = AjxDateFormat.AmPmSegment;

AjxDateFormat.AmPmSegment.prototype.toString = function() { 
	return "timeAmPm: \""+this._s+'"'; 
};

// Public methods

AjxDateFormat.AmPmSegment.prototype.format = function(date) {
	var hours = date.getHours();
	return hours < 12 ? I18nMsg.periodAm : I18nMsg.periodPm;
};

//
// Time timezone segment class
//

AjxDateFormat.TimezoneSegment = function(format, s) {
	AjxFormat.Segment.call(this, format, s);
};
AjxDateFormat.TimezoneSegment.prototype = new AjxDateFormat.TimeSegment;
AjxDateFormat.TimezoneSegment.prototype.constructor = AjxDateFormat.TimezoneSegment;

AjxDateFormat.TimezoneSegment.prototype.toString = function() { 
	return "timeTimezone: \""+this._s+'"'; 
};

// Public methods

AjxDateFormat.TimezoneSegment.prototype.format = function(date) {
	var clientId = date.timezone || AjxTimezone.DEFAULT;
	if (/Z/.test(this._s)) {
		return AjxTimezone.getShortName(clientId);
	}
	return this._s.length < 4 ? AjxTimezone.getMediumName(clientId) : AjxTimezone.getLongName(clientId);
};

//
// Message format class
//

function AjxMessageFormat(pattern) {
	AjxFormat.call(this, pattern);
	for (var i = 0; i < pattern.length; i++) {
		// literal
		var c = pattern.charAt(i);
		if (c == "'") {
			if (i + 1 < pattern.length && pattern.charAt(i + 1) == "'") {
				var segment = new AjxFormat.TextSegment(this, "'");
				this._segments.push(segment);
				i++;
				continue;
			}
			var head = i + 1;
			for (i++ ; i < pattern.length; i++) {
				var c = pattern.charAt(i);
				if (c == "'") {
					if (i + 1 < pattern.length && pattern.charAt(i + 1) == "'") {
						pattern = pattern.substr(0, i) + pattern.substr(i + 1);
					}
					else {
						break;
					}
				}
			}
			if (i == pattern.length) {
				// TODO: i18n
				throw new AjxFormat.FormatException(this, "unterminated string literal");
			}
			var tail = i;
			var segment = new AjxFormat.TextSegment(this, pattern.substring(head, tail));
			this._segments.push(segment);
			continue;
		}
		
		// non-meta chars
		var head = i;
		while(i < pattern.length) {
			c = pattern.charAt(i);
			if (c == '{' || c == "'") {
				break;
			}
			i++;
		}
		var tail = i;
		if (head != tail) {
			var segment = new AjxFormat.TextSegment(this, pattern.substring(head, tail));
			this._segments.push(segment);
			i--;
			continue;
		}
		
		// meta char
		var head = i + 1;
		while(++i < pattern.length) {
			if (pattern.charAt(i) == '}') {
				break;
			}		
		}
		var tail = i;
		var count = tail - head;
		var field = pattern.substr(head, count);
		var segment = new AjxMessageFormat.MessageSegment(this, field);		
		if (segment != null) {
			this._segments.push(segment);
		}
	}
}
AjxMessageFormat.prototype = new AjxFormat;
AjxMessageFormat.prototype.constructor = AjxMessageFormat;

AjxMessageFormat.prototype.toString = function() {
	return "[AjxMessageFormat: "+AjxFormat.prototype.toString.call(this)+"]";
};

// Static methods

AjxMessageFormat.format = function(pattern, params) {
	return new AjxMessageFormat(pattern).format(params);
};

// Public methods

AjxMessageFormat.prototype.format = function(params) {
	if (!(params instanceof Array)) {
		params = [ params ];
	}
	return AjxFormat.prototype.format.call(this, params);
};

//
// AjxMessageFormat.MessageSegment class
//

AjxMessageFormat.MessageSegment = function(format, s) {
	AjxFormat.Segment.call(this, format, s);
	var parts = s.split(',');
	this._index = Number(parts[0]);
	this._type = parts[1] || "string";
	this._style = parts[2];
	switch (this._type) {
		case "number": {
			switch (this._style) {
				case "integer": this._formatter = AjxNumberFormat.getIntegerInstance(); break;
				case "currency": this._formatter = AjxNumberFormat.getCurrencyInstance(); break;
				case "percent": this._formatter = AjxNumberFormat.getPercentInstance(); break;
				default: this._formatter = this._style == null ? AjxNumberFormat.getInstance() : new AjxNumberFormat(this._style);
			}
			break;
		}
		case "date": case "time": {
			var func = this._type == "date" ? AjxDateFormat.getDateInstance : AjxDateFormat.getTimeInstance;
			switch (this._style) {
				case "short": this._formatter = func(AjxDateFormat.SHORT); break;
				case "medium": this._formatter = func(AjxDateFormat.MEDIUM); break;
				case "long": this._formatter = func(AjxDateFormat.LONG); break;
				case "full": this._formatter = func(AjxDateFormat.FULL); break;
				default: this._formatter = this._style == null ? func(AjxDateFormat.DEFAULT) : new AjxDateFormat(this._style);
			}
			break;
		}
		case "choice": /*TODO*/ break;
	}
	
};
AjxMessageFormat.MessageSegment.prototype = new AjxFormat.Segment;
AjxMessageFormat.MessageSegment.prototype.constructor = AjxMessageFormat.MessageSegment;

AjxMessageFormat.MessageSegment.prototype.toString = function() {
	var a = [ "message: \"", this._s, "\", index: ", this.index ];
	if (this._type) a.push(", type: ", this._type);
	if (this._style) a.push(", style: ", this._style);
	if (this._formatter) a.push(", formatter: ", this._formatter.toString());
	return a.join("");
};

// Data

AjxMessageFormat.MessageSegment.prototype._index;
AjxMessageFormat.MessageSegment.prototype._type;
AjxMessageFormat.MessageSegment.prototype._style;

AjxMessageFormat.MessageSegment.prototype._formatter;

// Public methods

AjxMessageFormat.MessageSegment.prototype.format = function(args) {
	var object = args[this._index];
	return this._formatter ? this._formatter.format(object) : String(object);
};

//
// AjxNumberFormat class
//

/**
 * @param pattern       The number pattern.
 * @param skipNegFormat Specifies whether to skip the generation of this
 *                      format's negative value formatter. 
 *                      <p>
 *                      <strong>Note:</strong> 
 *                      This parameter is only used by the implementation 
 *                      and should not be passed by application code 
 *                      instantiating a custom number format.
 */
function AjxNumberFormat(pattern, skipNegFormat) {
	AjxFormat.call(this, pattern);
	if (pattern == "") return;

	var patterns = pattern.split(/;/);
	var pattern = patterns[0];
	
	// parse prefix
	var i = 0;
	var results = this.__parseStatic(pattern, i);
	i = results.offset;
	var hasPrefix = results.text != "";
	if (hasPrefix) {
		this._segments.push(new AjxFormat.TextSegment(this, results.text));
	}
	
	// parse number descriptor
	var start = i;
	while (i < pattern.length &&
	       AjxNumberFormat._META_CHARS.indexOf(pattern.charAt(i)) != -1) {
		i++;
	}
	var end = i;

	var numPattern = pattern.substring(start, end);
	var e = numPattern.indexOf('E');
	var expon = e != -1 ? numPattern.substring(e + 1) : null;
	if (expon) {
		numPattern = numPattern.substring(0, e);
		this._showExponent = true;
	}
	
	var dot = numPattern.indexOf('.');
	var whole = dot != -1 ? numPattern.substring(0, dot) : numPattern;
	if (whole) {
		var comma = whole.lastIndexOf(',');
		if (comma != -1) {
			this._groupingOffset = whole.length - comma - 1;
		}
		whole = whole.replace(/[^#0]/g,"");
		var zero = whole.indexOf('0');
		if (zero != -1) {
			this._minIntDigits = whole.length - zero;
		}
		this._maxIntDigits = whole.length;
	}
	
	var fract = dot != -1 ? numPattern.substring(dot + 1) : null;
	if (fract) {
		var zero = fract.lastIndexOf('0');
		if (zero != -1) {
			this._minFracDigits = zero + 1;
		}
		this._maxFracDigits = fract.replace(/[^#0]/g,"").length;
	}
	
	this._segments.push(new AjxNumberFormat.NumberSegment(this, numPattern));
	
	// parse suffix
	var results = this.__parseStatic(pattern, i);
	i = results.offset;
	if (results.text != "") {
		this._segments.push(new AjxFormat.TextSegment(this, results.text));
	}
	
	// add negative formatter
	if (skipNegFormat) return;
	
	if (patterns.length > 1) {
		var pattern = patterns[1];
		this._negativeFormatter = new AjxNumberFormat(pattern, true);
	}
	else {
		// no negative pattern; insert minus sign before number segment
		var formatter = new AjxNumberFormat("");
		formatter._segments = formatter._segments.concat(this._segments);

		var index = hasPrefix ? 1 : 0;
		var minus = new AjxFormat.TextSegment(formatter, I18nMsg.numberSignMinus);
		formatter._segments.splice(index, 0, minus);
		
		this._negativeFormatter = formatter;
	}
}
AjxNumberFormat.prototype = new AjxFormat;
AjxNumberFormat.prototype.constructor = AjxNumberFormat;

AjxNumberFormat.prototype.toString = function() {
	var array = [ 
		"[AjxNumberFormat: ", 
		"formatter=", AjxFormat.prototype.toString.call(this) 
	];
	if (this._negativeFormatter) {
		array.push(", negativeFormatter=", this._negativeFormatter.toString());
	}
	array.push(']');
	return array.join("");
};

// Constants

AjxNumberFormat._NUMBER = "number";
AjxNumberFormat._INTEGER = "integer";
AjxNumberFormat._CURRENCY = "currency";
AjxNumberFormat._PERCENT = "percent";

AjxNumberFormat._META_CHARS = "0#.,E";

AjxNumberFormat._FORMATTERS = {};

// Data

AjxNumberFormat.prototype._groupingOffset = Number.MAX_VALUE;
AjxNumberFormat.prototype._maxIntDigits;
AjxNumberFormat.prototype._minIntDigits = 1;
AjxNumberFormat.prototype._maxFracDigits;
AjxNumberFormat.prototype._minFracDigits;
AjxNumberFormat.prototype._isCurrency = false;
AjxNumberFormat.prototype._isPercent = false;
AjxNumberFormat.prototype._isPerMille = false;
AjxNumberFormat.prototype._showExponent = false;

AjxNumberFormat.prototype._negativeFormatter;

// Static functions

AjxNumberFormat.getInstance = function() {
	if (!AjxNumberFormat._FORMATTERS[AjxNumberFormat._NUMBER]) {
		AjxNumberFormat._FORMATTERS[AjxNumberFormat._NUMBER] = new AjxNumberFormat(I18nMsg.formatNumber);
	}
	return AjxNumberFormat._FORMATTERS[AjxNumberFormat._NUMBER];
};
AjxNumberFormat.getNumberInstance = AjxNumberFormat.getInstance;
AjxNumberFormat.getCurrencyInstance = function() {
	if (!AjxNumberFormat._FORMATTERS[AjxNumberFormat._CURRENCY]) {
		AjxNumberFormat._FORMATTERS[AjxNumberFormat._CURRENCY] = new AjxNumberFormat(I18nMsg.formatNumberCurrency);
	}
	return AjxNumberFormat._FORMATTERS[AjxNumberFormat._CURRENCY];
};
AjxNumberFormat.getIntegerInstance = function() {
	if (!AjxNumberFormat._FORMATTERS[AjxNumberFormat._INTEGER]) {
		AjxNumberFormat._FORMATTERS[AjxNumberFormat._INTEGER] = new AjxNumberFormat(I18nMsg.formatNumberInteger);
	}
	return AjxNumberFormat._FORMATTERS[AjxNumberFormat._INTEGER];
};
AjxNumberFormat.getPercentInstance = function() {
	if (!AjxNumberFormat._FORMATTERS[AjxNumberFormat._PERCENT]) {
		AjxNumberFormat._FORMATTERS[AjxNumberFormat._PERCENT] = new AjxNumberFormat(I18nMsg.formatNumberPercent);
	}
	return AjxNumberFormat._FORMATTERS[AjxNumberFormat._PERCENT];
};

AjxNumberFormat.format = function(pattern, number) {
	return new AjxNumberFormat(pattern).format(number);
};

// Public methods

AjxNumberFormat.prototype.format = function(number) {
	if (number < 0 && this._negativeFormatter) {
		return this._negativeFormatter.format(number);
	}
	return AjxFormat.prototype.format.call(this, number);
};

// Private methods

AjxNumberFormat.prototype.__parseStatic = function(s, i) {
	var data = [];
	while (i < s.length) {
		var c = s.charAt(i++);
		if (AjxNumberFormat._META_CHARS.indexOf(c) != -1) {
			i--;
			break;
		}
		switch (c) {
			case "'": {
				var start = i;
				while (i < s.length && s.charAt(i++) != "'") {
					// do nothing
				}
				var end = i;
				c = end - start == 0 ? "'" : s.substring(start, end);
				break;
			}
			case '%': {
				c = I18nMsg.numberSignPercent; 
				this._isPercent = true;
				break;
			}
			case '\u2030': {
				c = I18nMsg.numberSignPerMill; 
				this._isPerMille = true;
				break;
			}
			case '\u00a4': {
				c = s.charAt(i) == '\u00a4'
				  ? I18nMsg.currencyCode : I18nMsg.currencySymbol;
				this._isCurrency = true;
				break;
			}
		}
		data.push(c);
	}
	return { text: data.join(""), offset: i };
};

//
// AjxNumberFormat.NumberSegment class
//

AjxNumberFormat.NumberSegment = function(format, s) {
	AjxFormat.Segment.call(this, format, s);
};
AjxNumberFormat.NumberSegment.prototype = new AjxFormat.Segment;
AjxNumberFormat.NumberSegment.prototype.constructor = AjxNumberFormat.NumberSegment;

AjxNumberFormat.NumberSegment.prototype.toString = function() {
	return "number: \""+this._s+"\"";
};

// Public methods

AjxNumberFormat.NumberSegment.prototype.format = function(number) {
	// special values
	if (isNaN(number)) return I18nMsg.numberNaN;
	if (number === Number.NEGATIVE_INFINITY || number === Number.POSITIVE_INFINITY) {
		return I18nMsg.numberInfinity;
	}

	// adjust value
	if (typeof number != "number") number = Number(number);
	number = Math.abs(number); // NOTE: minus sign is part of pattern
	if (this._parent._isPercent) number *= 100;
	else if (this._parent._isPerMille) number *= 1000;

	// format
	var s = this._parent._showExponent
	      ? number.toExponential(this._parent._maxFracDigits).toUpperCase().replace(/E\+/,"E")
	      : number.toFixed(this._parent._maxFracDigits);
	s = this._normalize(s);
	return s;
};

// Protected methods

AjxNumberFormat.NumberSegment.prototype._normalize = function(s) {
	var match = s.split(/([\.Ee])/);
	
	// normalize whole part
	var whole = match.shift();
	if (whole.length < this._parent._minIntDigits) {
		whole = AjxFormat._zeroPad(whole, this._parent._minIntDigits, I18nMsg.numberZero);
	}
	if (whole.length > this._parent._groupingOffset) {
		var a = [];
		
		var i = whole.length - this._parent._groupingOffset;
		while (i > 0) {
			a.unshift(whole.substr(i, this._parent._groupingOffset));
			a.unshift(I18nMsg.numberSeparatorGrouping);
			i -= this._parent._groupingOffset;
		}
		a.unshift(whole.substring(0, i + this._parent._groupingOffset));
		
		whole = a.join("");
	}
	
	// normalize rest
	var fract = '0';
	var expon;
	while (match.length > 0) {
		switch (match.shift()) {
			case '.': fract = match.shift(); break;
			case 'E': case 'e': expon = match.shift(); break;
			default: // NOTE: should never get here!
		}
	}

	fract = fract.replace(/0+$/,"");
	if (fract.length < this._parent._minFracDigits) {
		fract = AjxFormat._zeroPad(fract, this._parent._minFracDigits, I18nMsg.numberZero, true);
	}
	
	var a = [ whole ];
	if (fract.length > 0) {
		var decimal = this._parent._isCurrency
		            ? I18nMsg.numberSeparatorMoneyDecimal
		            : I18nMsg.numberSeparatorDecimal;
		a.push(decimal, fract);
	}
	if (expon) {
		a.push('E', expon.replace(/^\+/,""));
	}
	
	// return normalize result
	return a.join("");
};

//
// AjxChoiceFormat class
//

/**
 * The arguments passed to this constructor can be either:
 * <ul>
 * <li>A single argument that represents a string pattern that specifies the 
 *     limits and formats separated by pipe characters (|).
 * <li>Two arguments, an array of limits and and array of format patterns.
 * </ul>
 * <p>
 * For complete details, see the JavaDoc for java.text.ChoiceFormat.
 */
function AjxChoiceFormat(pattern) {
	AjxFormat.call(this, pattern);
	var choices = pattern.split("|");
	if (arguments.length == 1) {
		this._limits = new Array(choices.length);
		this._lessThan = new Array(choices.length);
		this._formats = new Array(choices.length);
		var regex = new RegExp("^([^#<\u2264]+)([#<\u2264])(.*)$");
		for (var i = 0; i < choices.length; i++) {
			var choice = choices[i];
			var results = regex.exec(choice);
			var limit = results[1];
			var separator = results[2];
			var message = results[3];
			// set limit
			if (limit == '\u221E') {
				this._limits[i] = Number.POSITIVE_INFINITY;
			}
			else if (limit == '-\u221E') {
				this._limits[i] = Number.NEGATIVE_INFINITY;
			}
			else {
				this._limits[i] = parseFloat(limit);
			}
			// set less-than
			this._lessThan[i] = separator == '#' || separator == '\u2264';
			// set format
			this._formats[i] = new AjxMessageFormat(message);
		}
	}
	else {
		this._limits = arguments[0];
		this._lessThan = new Array(arguments[0].length);
		this._formats = arguments[1];
		this._pattern = [];
		for (var i = 0; i < this._formats.length; i++) {
			if (i > 0) {
				this._pattern.push("|");
			}
			this._pattern.push(this._limits[i], '#', this._formats[i]);
			this._lessThan[i] = false;
			this._formats[i] = new AjxMessageFormat(this._formats[i]);
		}
		this._pattern = this._pattern.join("");
	}
}
AjxChoiceFormat.prototype = new AjxFormat;
AjxChoiceFormat.prototype.constructor = AjxChoiceFormat;

AjxChoiceFormat.prototype.toString = function() {
	return [
		"[AjxChoiceFormat: ",
		"limits={ ", this._limits.join(", "), " }, ",
		"formats={ ", this._formats.join(", "), " }, ",
		"lessThan={ ", this._lessThan.join(", "), " }]"
	].join("");
};

// Data

AjxChoiceFormat.prototype._limits;
AjxChoiceFormat.prototype._lessThan;
AjxChoiceFormat.prototype._formats;

// Public methods

AjxChoiceFormat.prototype.getLimits = function() {
	return this._limits;
};
AjxChoiceFormat.prototype.getFormats = function() {
	return this._formats;
};

AjxChoiceFormat.prototype.format = function(number) {
	var formatter;
	if (isNaN(number) || number < this._limits[0]) {
		formatter = this._formats[0];
	}
	else {
		for (var i = 0; i < this._limits.length - 1; i++) {
			var a = this._limits[i];
			var b = this._limits[i+1];
			var aGEb = number >= a;
			var aLTb = this._lessThan[i+1] ? number < b : number <= b;
			if (aGEb && aLTb) {
				formatter = this._formats[i];
				break;
			}
		}
		if (!formatter) {
			formatter = this._formats[this._formats.length-1];
		}
	}
	return formatter.format(number);
};
