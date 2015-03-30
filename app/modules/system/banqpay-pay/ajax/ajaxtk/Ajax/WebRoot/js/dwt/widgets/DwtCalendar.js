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


/**
* Creates a calendar widget
* @constructor
* @class
* The DwtCalendar widget provides a calendar view.
*
* @author Ross Dargahi
* @author Roland Schemers
*
* @param parent 		Parent object
* @param className		This instances class name defaults to DwtCalendar
* @param posStyle		Positioning style defaults to DwtControl.STATIC_STYLE
* @param firstDayOfWeek	The first day of the week. Defaults to DwtCalendar.SUN
* @param forceRollOver 	If true, then clicking on (or setting) the widget to a 
						date that is not part of the current month (i.e. one of 
						the grey prev or next month days) will result in the 
						widget rolling 	the date to that month. Default is true
* @param workingDaysArray	An array specifying the working days. This array 
						assume index 0 - Sunday etc. Defaults to Mon-Fri being 
						working days
* @param hidePrevNextMo Flag indicating whether widget should hide days of the 
						previous/next month
* @param readOnly 		Flag indicating this widget is read-only (should not 
						process events, i.e. mouse clicks)
*/
function DwtCalendar(parent, className, posStyle, firstDayOfWeek, forceRollOver, workingDaysArray, hidePrevNextMo, readOnly) {

	if (arguments.length == 0) return;
	className = className || "DwtCalendar";
	DwtComposite.call(this, parent, className, posStyle);

	this._skipNotifyOnPage = false;
	this._hidePrevNextMo = hidePrevNextMo;
	this._readOnly = readOnly;
	this._uuid = Dwt.getNextId();
	var cn = this._origDayClassName = className + "Day";
	this._todayClassName = " " + className + "Day-today";
	this._selectedDayClassName = " " + cn + "-" + DwtCssStyle.SELECTED;
	this._activatedDayClassName = " " + cn + "-" + DwtCssStyle.ACTIVATED;
	this._triggeredDayClassName = " " + cn + "-" + DwtCssStyle.TRIGGERED;
	this._hiliteClassName = " " + cn + "-hilited";
	this._greyClassName = " " + cn + "-grey"
	
	if (!this._readOnly)
		this._installListeners();
	this.setCursor("default");
	
	this._selectionMode = DwtCalendar.DAY;
	
	this._init();

	this._weekDays = new Array(7);
	this._workingDays = (workingDaysArray == null) ? DwtCalendar._DEF_WORKING_DAYS : workingDaysArray;
	this.setFirstDayOfWeek((firstDayOfWeek == null) ? DwtCalendar.SUN : firstDayOfWeek);
	
	this._forceRollOver = (forceRollOver) ? forceRollOver : true;
}

DwtCalendar.prototype = new DwtComposite;
DwtCalendar.prototype.constructor = DwtCalendar;

DwtCalendar.SUN = 0;
DwtCalendar.MON = 1;
DwtCalendar.TUE = 2;
DwtCalendar.WED = 3;
DwtCalendar.THU = 4;
DwtCalendar.FRI = 5;
DwtCalendar.SAT = 6;

// Selection modes
DwtCalendar.DAY = 1;
DwtCalendar.WEEK = 2;
DwtCalendar.WORK_WEEK = 3;
DwtCalendar.MONTH = 4;

DwtCalendar.RANGE_CHANGE = "DwtCalendar.RANGE_CHANGE";

DwtCalendar._FULL_WEEK = [1, 1, 1, 1, 1, 1, 1];
DwtCalendar._DEF_WORKING_DAYS = [0, 1, 1, 1, 1, 1, 0];
DwtCalendar._DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

DwtCalendar._NO_MONTH = -2;
DwtCalendar._PREV_MONTH = -1;
DwtCalendar._THIS_MONTH = 0;
DwtCalendar._NEXT_MONTH = 1;

DwtCalendar._NORMAL = 1;
DwtCalendar._ACTIVATED = 2;
DwtCalendar._TRIGGERED = 3;
DwtCalendar._SELECTED = 4;
DwtCalendar._DESELECTED = 5;

DwtCalendar.DATE_SELECTED 		= 1;
DwtCalendar.DATE_DESELECTED 	= 2;
DwtCalendar.DATE_DBL_CLICKED 	= 3;

DwtCalendar._LAST_DAY_CELL_IDX = 41;

DwtCalendar._BUTTON_CLASS = "DwtCalendarButton";
DwtCalendar._BUTTON_ACTIVATED_CLASS = DwtCalendar._BUTTON_CLASS + "-" + DwtCssStyle.ACTIVATED;
DwtCalendar._BUTTON_TRIGGERED_CLASS = DwtCalendar._BUTTON_CLASS + "-" + DwtCssStyle.TRIGGERED;

DwtCalendar._TITLE_CLASS = "DwtCalendarTitle";
DwtCalendar._TITLE_ACTIVATED_CLASS = DwtCalendar._TITLE_CLASS + "-" + DwtCssStyle.ACTIVATED;
DwtCalendar._TITLE_TRIGGERED_CLASS = DwtCalendar._TITLE_CLASS + "-" + DwtCssStyle.TRIGGERED;

DwtCalendar.prototype.toString = 
function() {
	return "DwtCalendar";
}

DwtCalendar.prototype.addSelectionListener = 
function(listener) {
	this.addListener(DwtEvent.SELECTION, listener);
}

DwtCalendar.prototype.removeSelectionListener = 
function(listener) { 
	this.removeListener(DwtEvent.SELECTION, listener);
}

DwtCalendar.prototype.addActionListener = 
function(listener) {
	this.addListener(DwtEvent.ACTION, listener);
}

DwtCalendar.prototype.removeActionListener = 
function(listener) { 
	this.removeListener(DwtEvent.ACTION, listener);
}


/* Date range listeners are called whenever the date range of the calendar changes i.e. when it rolls over
 * due to a programatic action via setDate or via user selection
 */
DwtCalendar.prototype.addDateRangeListener = 
function(listener) {
	this.addListener(DwtEvent.DATE_RANGE, listener);
}

DwtCalendar.prototype.removeDateRangeListener = 
function(listener) { 
	this.removeListener(DwtEvent.DATE_RANGE, listener);
}

// call this method with true to not notify selection when paging arrow buttons are clicked
DwtCalendar.prototype.setSkipNotifyOnPage = 
function(skip) {
	this._skipNotifyOnPage = skip;
}

// call this method get whether we are skipping notify on page buttons or not
DwtCalendar.prototype.getSkipNotifyOnPage = 
function() {
	return this._skipNotifyOnPage;
}

DwtCalendar.prototype.setDate =
function(date, skipNotify, forceRollOver, dblClick) {
	
	forceRollOver = (forceRollOver == null) ? this._forceRollOver : forceRollOver;
	
	// Check if the date is available for selection. Basically it is unless we are in
	// work week selection mode and <date> is not a working day
	//if (this._selectionMode == DwtCalendar.WORK_WEEK && !this._currWorkingDays[date.getDay()])
	//	return false;
	
	var newDate = new Date(date.getTime());
	var oldDate = this._date;

	var layout = false;
	var notify = false;
	var cellId;
	
	if (this._date2CellId != null) {
		var idx = (newDate.getFullYear() * 10000) + (newDate.getMonth() * 100) + newDate.getDate();
		var cellId = this._date2CellId[idx];
		
		if (cellId) {
		 	if (cellId == this._selectedCellId)
		 		notify = true;

			var cell = document.getElementById(cellId);
			if (cell._dayType == DwtCalendar._THIS_MONTH)
				notify = true;
			else if (forceRollOver)
				notify = layout = true;
			else
				notify = true;
		} else {
			 notify = layout = true;
		}
	} else {
		notify = layout = true;
	}
	
	// update before layout, notify after layout
	if (notify) {
		if (this._date){
			// 5/13/2005 EMC -- I'm not sure why this was setting the hours to 0.
			// I think it should respect what the user passed in, and only change
			// the parts of the date that it is responsible for.
			//newDate.setHours(0,0,0,0);
			newDate.setHours(this._date.getHours(), this._date.getMinutes(), this._date.getSeconds(), 0);
		}
		this._date = newDate;
		if (!layout && !this._readOnly) {
			this._setSelectedDate();
			this._setToday();
		}
	}
		
	if (layout)
		this._layout();

	if (notify && !skipNotify) {
		var type = dblClick ? DwtCalendar.DATE_DBL_CLICKED : DwtCalendar.DATE_SELECTED;
		this._notifyListeners(DwtEvent.SELECTION, type, this._date);
	}
		
	return true;
}

DwtCalendar.prototype.isSelected =
function(cellId) {
	/* if cellId is the selected day, then return true, else if we are NOT in day
	 * selection mode (i.e. week/work week) then compute the row and index of cellId and
	 * look it up in the week array to see if it is a selectable day */
	if (cellId == this._selectedDayElId) {
		return true;
	} else if (this._selectionMode != DwtCalendar.DAY) {
		/* If the cell is in the same row as the currently selected cell and it is
		 * a selectable day (i.e. a working day in the case of work week), then say it is
		 * selected */
		var cellIdx = this._getDayCellIndex(cellId);
		if (Math.floor(cellIdx / 7) == Math.floor(this._getDayCellIndex(this._selectedDayElId) / 7)
			&& this._currWorkingDays[cellIdx % 7])
			return true;
	}
	return false;
}

DwtCalendar.prototype.getForceRollOver =
function() {
	return this._forceRollOver;
}


DwtCalendar.prototype.setForceRollOver =
function(force) {
	if (force == null)
		return;
	
	if (this._forceRollOver != force){
		this._forceRollOver = force;
		this._layout();
	}
}

DwtCalendar.prototype.getSelectionMode =
function() {
	return this._selectionMode;
}

DwtCalendar.prototype.setSelectionMode =
function(selectionMode) {
	if (this._selectionMode == selectionMode)
		return;
	
	this._selectionMode = selectionMode;
	if (selectionMode == DwtCalendar.WEEK)
		this._currWorkingDays = DwtCalendar._FULL_WEEK;
	else if (selectionMode == DwtCalendar.WORK_WEEK)
		this._currWorkingDays = this._workingDays;
		
	this._layout();
}

/**
 * Sets the working week to workingDaysArray (references it). This function assumes that
 * workingDaysArray[0] = Sunday etc.
 */
DwtCalendar.prototype.setWorkingWeek =
function(workingDaysArray) {
	// TODO Should really create a copy of workingDaysArray
	this._workingDays = this._currWorkingDays = workingDaysArray;
	
	if (this._selectionMode == DwtCalendar.WORK_WEEK) {
		DBG.println("FOO!!!");
		this._layout();
	}
}


/**
 * Enables/disables the highlite (bolding) on the dates in <dates>.
 *
 * @param dates	Dates for which to enable/disable highliting
 * @param enable If true enable hiliting
 * @param clear Clear current highliting
 */
DwtCalendar.prototype.setHilite =
function(dates, enable, clear) {
	if (this._date2CellId == null)
		return;
		
	var cell;
	var aDate;
	if (clear) {
		for (aDate in this._date2CellId) {
			cell = document.getElementById(this._date2CellId[aDate]);
			if (cell._isHilited) {
				cell._isHilited = false;
				this._setClassName(cell, DwtCalendar._NORMAL);
			}	
		}
	}
	
	var cellId;
	for (var i in dates) {
		aDate = dates[i];
		cellId = this._date2CellId[aDate.getFullYear() * 10000 + aDate.getMonth() * 100 + aDate.getDate()];

		if (cellId) {
			cell = document.getElementById(cellId);
			if (cell._isHilited != enable) {
				cell._isHilited = enable;
				this._setClassName(cell, DwtCalendar._NORMAL);
			}
		}
	}
}


DwtCalendar.prototype.getDate =
function() {
	return this._date;
}

DwtCalendar.prototype.setFirstDayOfWeek =
function(firstDayOfWeek) {
	for (var i = 0; i < 7; i++) {
		if (i < firstDayOfWeek)
			this._weekDays[i] = 6 - (firstDayOfWeek -i - 1);
		else
			this._weekDays[i] = i - firstDayOfWeek;
		
		var dowCell = document.getElementById(this._getDOWCellId(i));
		dowCell.innerHTML = AjxDateUtil.WEEKDAY_SHORT[(firstDayOfWeek + i) % 7];
	}
	this._layout();
}

DwtCalendar.prototype.getDateRange =
function () {
	return this._range;
};

DwtCalendar.prototype._getDayCellId =
function(cellId) {
	return "c:" + cellId + ":" + this._uuid;
}

DwtCalendar.prototype._getDayCellIndex =
function(cellId) {
	return cellId.substring(2, cellId.indexOf(":", 3));
}

DwtCalendar.prototype._getDOWCellId =
function(cellId) {
	return "w:" + cellId + ":" + this._uuid;
}


DwtCalendar.prototype._getDaysInMonth =
function(mo, yr) {
	/* If we are not dealing with Feb, then simple lookup
	 * Leap year rules
	 *  1. Every year divisible by 4 is a leap year.
	 *  2. But every year divisible by 100 is NOT a leap year
	 *  3. Unless the year is also divisible by 400, then it is still a leap year.*/
	if (mo != 1)
		return DwtCalendar._DAYS_IN_MONTH[mo];
	else if (yr % 4 != 0 || (yr % 100 == 0 && yr % 400 != 0))
		return 28;
	else
		return 29;
}

DwtCalendar.prototype._installListeners =
function() {
	this._setMouseEventHdlrs();
	this.addListener(DwtEvent.ONMOUSEOVER, new AjxListener(this, this._mouseOverListener));
	this.addListener(DwtEvent.ONMOUSEOUT, new AjxListener(this, this._mouseOutListener));
	this.addListener(DwtEvent.ONMOUSEDOWN, new AjxListener(this, this._mouseDownListener));
	this.addListener(DwtEvent.ONMOUSEUP, new AjxListener(this, this._mouseUpListener));
	this.addListener(DwtEvent.ONDBLCLICK, new AjxListener(this, this._doubleClickListener));
}

DwtCalendar.prototype._notifyListeners =
function(eventType, type, detail, ev) {
	if (!this.isListenerRegistered(eventType))
		return;
	var selEv = DwtShell.selectionEvent;
	if (ev)
		DwtUiEvent.copy(selEv, ev);
	else 
		selEv.reset();
	selEv.item = this;
	selEv.detail = detail;
	selEv.type = type;
	this.notifyListeners(eventType, selEv);
}

DwtCalendar.prototype._layout =
function() {
	if (this._date == null) 
		return false;

	if (!this._calWidgetInited)
		this._init();
		
	var date = new Date(this._date.getTime());
	date.setDate(1);
	var year = date.getFullYear();
	var month  = date.getMonth();
	var firstDay = date.getDay();
	var daysInMonth = this._getDaysInMonth(month, year);
	var day = 1;
	var nextMoDay = 1;

	this._date2CellId = new Object();
	this._selectedDayElId = null;
		
	// Figure out how many days from the previous month we have to fill in (see comment below)
	if (!this._hidePrevNextMo) {
	    if (month != 0) {
	    	var lastMoDay = this._getDaysInMonth(month - 1, year) - this._weekDays[firstDay] + 1;
	    	var lastMoYear = year;
	    	var lastMoMonth = month - 1;
	    	if (month != 11) {
	     		var nextMoMonth = month + 1;
	    		var nextMoYear = year;
	    	} else {
	      		var nextMoMonth = 0;
	    		var nextMoYear = year + 1;
	    	}
	     } else {
	     	var lastMoDay = this._getDaysInMonth(11, year - 1) - this._weekDays[firstDay] + 1;
	     	var lastMoYear = year - 1;
	     	var lastMoMonth = 11
	     	var nextMoMonth = 1;
	     	var nextMoYear = year;
	    }
	}

	for (var i = 0; i < 6; i++) {
    	for (var j = 0; j < 7; j++) {
 	   		var dayCell = document.getElementById(this._getDayCellId(i * 7 + j));
 	   		
 	   		if (dayCell._isHilited == null)
 	   			dayCell._isHilited = false;
 	   			
    		if (day <= daysInMonth) {
    			/* The following if statement deals with the first day of this month not being
    			 * the first day of the week. In this case we must fill the preceding days with
    			 * the final days of the previous month */
     			if (i != 0 || j >= this._weekDays[firstDay]) {
    				this._date2CellId[(year * 10000) + (month * 100) + day] = dayCell.id;
    				dayCell._day = day;
   					dayCell._month = month
    			 	dayCell._year = year;
     				dayCell.innerHTML = day++;
    				//dayCell.className = this._origDayClassName;
    				dayCell._dayType = DwtCalendar._THIS_MONTH;
    				if (this._readOnly) {
    					dayCell.style.fontFamily = "Arial";
    					dayCell.style.fontSize = "10px";
    				}
    			} else {
    				if (this._hidePrevNextMo) {
    					dayCell.innerHTML = "";
    				} else {
	    				this._date2CellId[(lastMoYear * 10000) + (lastMoMonth * 100) + lastMoDay] = dayCell.id;
	    				dayCell._day = lastMoDay;
	    				dayCell._month = lastMoMonth
	    			 	dayCell._year = lastMoYear;
						dayCell.innerHTML = lastMoDay++;
						//dayCell.className = this._origDayClassName + " " + this._greyClassName;
						dayCell._dayType = DwtCalendar._PREV_MONTH;		
					}
				}
			} else if (!this._hidePrevNextMo) {
				/* Fill any remaining slots with days from next month */
    			this._date2CellId[(nextMoYear * 10000) + (nextMoMonth * 100) + nextMoDay] = dayCell.id;
    			dayCell._day = nextMoDay;
    			dayCell._month = nextMoMonth
    			dayCell._year = nextMoYear;
				dayCell.innerHTML = nextMoDay++;
				dayCell._dayType = DwtCalendar._NEXT_MONTH;
				//dayCell.className = this._origDayClassName + " " + this._greyClassName;
			}
			this._setClassName(dayCell, DwtCalendar._NORMAL);
     	}
    }
    
	this._setTitle(month, year);
	
	// Compute the currently selected day
	//this._selectedDayElId = null;
	if (!this._readOnly) {
		this._setSelectedDate();
		this._setToday();
	}
	
	this._setRange();
}

DwtCalendar.prototype._setRange =
function() {
	
	var cell = document.getElementById(this._getDayCellId(0));
	var start = new Date(cell._year, cell._month, cell._day, 0, 0, 0, 0);

	cell = document.getElementById(this._getDayCellId(DwtCalendar._LAST_DAY_CELL_IDX));
	
	var daysInMo = this._getDaysInMonth(cell._month, cell._year);
	var end;
	if (cell._day < daysInMo)
		end = new Date(cell._year, cell._month, cell._day + 1, 0, 0, 0, 0);
	else if (cell._month < 11)
		end = new Date(cell._year, cell._month + 1, 1, 0, 0, 0, 0);
	else
		end = new Date(cell._year + 1, 0, 1, 0, 0, 0, 0);
	
	if (this._range == null)
		this._range = new Object();
	else if (this._range.start.getTime() == start.getTime() && this._range.end.getTime() == end.getTime())
		return false;
	
	this._range.start = start;
	this._range.end = end;
	
	// Notify any listeners
	if (!this.isListenerRegistered(DwtEvent.DATE_RANGE))
		return;
		
	if (!this._dateRangeEvent)
		this._dateRangeEvent = new DwtDateRangeEvent(true);
		
	this._dateRangeEvent.item = this;
	this._dateRangeEvent.start = start;
	this._dateRangeEvent.end = end;
	this.notifyListeners(DwtEvent.DATE_RANGE, this._dateRangeEvent);
}

DwtCalendar.prototype._setToday =
function() {
	var cell;
	var today = new Date();
	var todayDay = today.getDate();
	
	if (!this._todayDay || this._todayDay != todayDay) {
		if (this._todayCellId != null) {
			cell = document.getElementById(this._todayCellId);
			cell._isToday = false;
			this._setClassName(cell, DwtCalendar._NORMAL);
		}
		
		this._todayCellId = this._date2CellId[(today.getFullYear() * 10000) + (today.getMonth() * 100) + todayDay];
		if (this._todayCellId != null) {
			cell = document.getElementById(this._todayCellId);
			cell._isToday = true;
			this._setClassName(cell, DwtCalendar._NORMAL);
		}
	}
}

DwtCalendar.prototype._setSelectedDate =
function() {
	var day = this._date.getDate();
	var month = this._date.getMonth();
	var year = this._date.getFullYear();
	var cell;
	
	if (this._selectedDayElId) {
		cell = document.getElementById(this._selectedDayElId);
		this._setClassName(cell, DwtCalendar._DESELECTED);
	}	
	
	var cellId = this._date2CellId[(year * 10000) + (month * 100) + day];
	cell = document.getElementById(cellId);
	this._selectedDayElId = cellId;
	this._setClassName(cell, DwtCalendar._SELECTED);
}

DwtCalendar.prototype._setCellClassName = 
function(cell, className, mode) {
	if (cell._dayType != DwtCalendar._THIS_MONTH)
		className += this._greyClassName;
					
	if (this._selectionMode == DwtCalendar.DAY && cell.id == this._selectedDayElId
		&& mode != DwtCalendar._DESELECTED) {
			className += this._selectedDayClassName;
	} else if (this._selectionMode != DwtCalendar.DAY && mode != DwtCalendar._DESELECTED &&
			   this._selectedDayElId != null) {
		var idx = this._getDayCellIndex(cell.id);
		if (Math.floor(this._getDayCellIndex(this._selectedDayElId) / 7) == Math.floor(idx / 7)
			&& this._currWorkingDays[idx % 7])
			className += this._selectedDayClassName;
	}
	
	if (cell._isHilited)
		className += this._hiliteClassName;	
			
	if (cell._isToday)
		className += this._todayClassName;

	return className;
}

DwtCalendar.prototype._setClassName = 
function(cell, mode) {
	var className = "";
	
	if (mode == DwtCalendar._NORMAL) {
		className = this._origDayClassName;
	} else if (mode == DwtCalendar._ACTIVATED) {
		className = this._activatedDayClassName;
	} else if (mode == DwtCalendar._TRIGGERED) {
		className = this._triggeredDayClassName;
	} else if (this._selectionMode != DwtCalendar.DAY
			   && (mode == DwtCalendar._SELECTED || mode == DwtCalendar._DESELECTED)) {
		/* If we are not in day mode, then we need to highlite multiple cells e.g. the whole
		 * week if we are in week mode */
		var firstCellIdx = Math.floor(this._getDayCellIndex(this._selectedDayElId) / 7) * 7;

		for (var i = 0; i < 7; i++) {
			className = this._origDayClassName;
			var aCell = document.getElementById(this._getDayCellId(firstCellIdx++));
			aCell.className = this._setCellClassName(aCell, className, mode);
		}
		return;
	}

	cell.className = this._setCellClassName(cell, className, mode);
}

DwtCalendar.prototype._setTitle =
function(month, year) {
	var cell = document.getElementById(this._monthCell);
	var formatter = DwtCalendar.getMonthFormatter();
	var date = new Date(year, month);
	cell.innerHTML = formatter.format(date);
}

DwtCalendar.prototype._init =
function() {
	var html = new Array(100);
	var idx = 0;
	this._monthCell = "t:" + this._uuid;
	
	// Construct the header row with the prev/next year and prev/next month icons as well as the 
	// month/year title cell
	html[idx++] = "<table width=100% cellspacing='0' cellpadding='0' style='border-collapse:collapse;'>";
	html[idx++] = 		"<tr><td class=DwtCalendarTitlebar>"; 
	html[idx++] = 			"<table width='100%' cellspacing='0' cellpadding='0'>";
	html[idx++] = 				"<tr>";
	html[idx++] = 	             	"<td class='";
	html[idx++] = 	             		DwtCalendar._BUTTON_CLASS;
	html[idx++] = 	             		"' id='b:py:";
	html[idx++] = 	             		this._uuid;
	html[idx++] = 					    "'>";
	html[idx++] = 					    AjxImg.getImageHtml("FastRevArrowSmall", null, ["id='b:py:img:", this._uuid, "'"].join(""));
	html[idx++] = 					"</td>"
	html[idx++] = 	             	"<td class='";
	html[idx++] = 	             		DwtCalendar._BUTTON_CLASS;
	html[idx++] = 	             		"' id='b:pm:";
	html[idx++] = 						this._uuid;
	html[idx++] = 						"'>";
	html[idx++] = 					    AjxImg.getImageHtml("RevArrowSmall", null, ["id='b:pm:img:", this._uuid, "'"].join(""));
	html[idx++] =					"</td>";
	html[idx++] = 					"<td align='center' class='DwtCalendarTitleCell' nowrap'><span class='"
	html[idx++] =                       DwtCalendar._TITLE_CLASS;
	html[idx++] = 					    "' id='";
	html[idx++] =						this._monthCell;
	html[idx++] =					"'>&nbsp;</span></td>";	              
	html[idx++] = 	             	"<td class='";
	html[idx++] = 	             		DwtCalendar._BUTTON_CLASS;
	html[idx++] = 	             		"' id='b:nm:";
	html[idx++] =						this._uuid;
	html[idx++] =						"'>";
	html[idx++] = 					    AjxImg.getImageHtml("FwdArrowSmall", null, ["id='b:nm:img:", this._uuid, "'"].join(""));
	html[idx++] =					"</td>";
	html[idx++] = 	             	"<td class='";
	html[idx++] = 	             		DwtCalendar._BUTTON_CLASS;
	html[idx++] = 	             		"' id='b:ny:";
	html[idx++] =						this._uuid;
	html[idx++] =						"'>";
	html[idx++] = 					    AjxImg.getImageHtml("FastFwdArrowSmall", null, ["id='b:ny:img:", this._uuid, "'"].join(""));
	html[idx++] =					"</td>";
 	html[idx++] = 				"</tr>";
	html[idx++] = 			"</table>";
	html[idx++] = 		"</td></tr>";

	html[idx++] = "<tr><td>";
	
	html[idx++] = "<table cellspacing='0' cellpadding='1' width='100%'>";
	
	html[idx++] = "<tr><td width='2%'></td>";
	for (var i = 0; i < 7; i++) {
		html[idx++] = "<td align='right' class='DwtCalendarDow' width='14%' id='";
		html[idx++] = this._getDOWCellId(i);
		html[idx++] = "'>&nbsp;</td>";
	}
    html[idx++] = "</tr>";

	// bug fix #3355
	var style = AjxEnv.isLinux ? " style='line-height: 12px'" : "";
    for (var i = 0; i < 6; i++) {
 		html[idx++] = "<tr" + style + "><td width='2%' id='w:";
 		html[idx++] = i;
 		html[idx++] = ":"; 
 		html[idx++] = this._uuid; 
 		html[idx++] = "'</td>";
    	for (var j = 0; j < 7; j++) {
    		html[idx++] = "<td align='right' width='14%' id='";
    		html[idx++] = this._getDayCellId(i * 7 + j);
    		html[idx++] = "'>&nbsp;</td>";
     	}
    	html[idx++] ="</tr>";
    }

    html[idx++] = "</td></tr></table></table>";
    
    this.getHtmlElement().innerHTML = html.join("");
    if (!this._readOnly) {
    	document.getElementById("b:py:img:" + this._uuid)._origClassName = AjxImg.getClassForImage("FastRevArrowSmall");
	    document.getElementById("b:pm:img:" + this._uuid)._origClassName = AjxImg.getClassForImage("RevArrowSmall");
	    document.getElementById("b:nm:img:" + this._uuid)._origClassName = AjxImg.getClassForImage("FwdArrowSmall");
	    document.getElementById("b:ny:img:" + this._uuid)._origClassName = AjxImg.getClassForImage("FastFwdArrowSmall");
    }

    this._calWidgetInited = true;
}

DwtCalendar.prototype.setMouseOverDayCallback =
function(callback) {
	this._mouseOverDayCB = callback;
}

/**
 * This method will return the date value for the last cell that the most recent Dnd operation occured over.
 * Typically it will be called by a DwtDropTarget listener when an item is dropped onto the mini calendar
 */
DwtCalendar.prototype.getDndDate =
function() {
	var dayCell = this._lastDndCell;
	if (dayCell) {
		return new Date(dayCell._year, dayCell._month, dayCell._day);
	} else {
		return null;
	}
}

// Temp date used for callback in mouseOverListener
DwtCalendar._tmpDate = new Date();
DwtCalendar._tmpDate.setHours(0, 0, 0, 0);

DwtCalendar.prototype._mouseOverListener = 
function(ev) {
	var target = ev.target;
	if (target.id.charAt(0) == 'c') {
		this._setClassName(target, DwtCalendar._ACTIVATED);
		/* If a mouse over callback has been registered, then call it to give it chance
		 * do work like setting the tooltip content */
		if (this._mouseOverDayCB) {
			DwtCalendar._tmpDate.setFullYear(target._year, target._month, target._day);
			this._mouseOverDayCB.run(this, DwtCalendar._tmpDate);
		}
	} else if (target.id.charAt(0) == 't') {
		// Dont activate title for now
		return;
		target.className = DwtCssStyle.ACTIVATED;
	} else if (target.id.charAt(0) == 'b') {
		var img;
		if (target.firstChild == null) {
			img = target;
			AjxImg.getParentElement(target).className = DwtCalendar._BUTTON_ACTIVATED_CLASS;
		} else {
			target.className = DwtCalendar._BUTTON_ACTIVATED_CLASS;
			img = AjxImg.getImageElement(target);
		}
		img.className = img._origClassName;
	} else if (target.id.charAt(0) == 'w') {
	}

	ev._stopPropagation = true;
}


DwtCalendar.prototype._mouseOutListener = 
function(ev) {
	this.setToolTipContent(null);
	var target = ev.target;
	if (target.id.charAt(0) == 'c') {
		this._setClassName(target, DwtCalendar._NORMAL);
	} else if (target.id.charAt(0) == 't') {
		// Dont deactivate title for now
		return;
		target.className = DwtCalendar._TITLE_CLASS;
	} else if (target.id.charAt(0) == 'b') {
		var img;
		target.className = DwtCalendar._BUTTON_CLASS;
		if (target.firstChild == null) {
			img = target;
			AjxImg.getParentElement(target).className = DwtCalendar._BUTTON_CLASS;
		} else {
			target.className = DwtCalendar._BUTTON_CLASS;
			img = AjxImg.getImageElement(target);
		}
		img.className = 	img._origClassName;
	} else if (target.id.charAt(0) == 'w') {
	}
}


DwtCalendar.prototype._mouseDownListener = 
function(ev) {	
	if (ev.button == DwtMouseEvent.LEFT) {
		var target = ev.target;
		if (target.id.charAt(0) == 'c') {
			this._setClassName(target, DwtCalendar._TRIGGERED);
		} else if (target.id.charAt(0) == 't') {
			target.className = DwtCalendar._TITLE_TRIGGERED_CLASS;
		} else if (target.id.charAt(0) == 'b') {
			var img;
			if (target.firstChild == null) {
				img = target;
				AjxImg.getParentElement(target).className = DwtCalendar._BUTTON_TRIGGERED_CLASS;
			} else {
				target.className = DwtCalendar._BUTTON_TRIGGERED_CLASS;
				img = AjxImg.getImageElement(target);
			}
			img.className = img._origClassName;
		} else if (target.id.charAt(0) == 'w') {
		}
	}
}

DwtCalendar.prototype._mouseUpListener = 
function(ev) {
	var target = ev.target;
	if (ev.button == DwtMouseEvent.LEFT) {
		if (target.id.charAt(0) == 'c') {
			// If our parent is a menu then we need to have it close
			if (this.parent instanceof DwtMenu)
				DwtMenu.closeActiveMenu();
					
			if (this.setDate(new Date(target._year, target._month, target._day)))
				return;
			this._setClassName(target, DwtCalendar._ACTIVATED);
		} else if (target.id.charAt(0) == 'b') {
			var img;
			if (target.firstChild == null) {
				img = target;
				AjxImg.getParentElement(target).className = DwtCalendar._BUTTON_ACTIVATED_CLASS;
			} else {
				target.className = DwtCalendar._BUTTON_ACTIVATED_CLASS;
				img = AjxImg.getImageElement(target);
			}
			img.className = img._origClassName;
			
			if (img.id.indexOf("py") != -1)
				this._prevYear();
			else if (img.id.indexOf("pm") != -1) 
				this._prevMonth();
			else if (img.id.indexOf("nm") != -1)
				this._nextMonth();
			else 
				this._nextYear();		
		} else if (target.id.charAt(0) == 't') {
			// TODO POPUP MENU
			target.className = DwtCalendar._TITLE_ACTIVATED_CLASS;
			this.setDate(new Date(), this._skipNotifyOnPage);
			// If our parent is a menu then we need to have it close
			if (this.parent instanceof DwtMenu)
				DwtMenu.closeActiveMenu();		
		}
	} else if (ev.button == DwtMouseEvent.RIGHT && target.id.charAt(0) == 'c') {					
		this._notifyListeners(DwtEvent.ACTION, 0, new Date(target._year, target._month, target._day), ev);
	}
}


DwtCalendar.prototype._doubleClickListener =
function(ev) {
	var target = ev.target;
	if (this._selectionEvent)
		this._selectionEvent.type = DwtCalendar.DATE_DBL_CLICKED;
	if (target.id.charAt(0) == 'c') {
		// If our parent is a menu then we need to have it close
		if (this.parent instanceof DwtMenu)
			DwtMenu.closeActiveMenu();
				
		this.setDate(new Date(target._year, target._month, target._day), false, false, true)
	}
}

DwtCalendar.prototype._prevMonth = 
function(ev) {
	var d = new Date(this._date.getTime());
	this.setDate(AjxDateUtil.roll(d, AjxDateUtil.MONTH, -1), this._skipNotifyOnPage);
}

DwtCalendar.prototype._nextMonth = 
function(ev) {
	var d = new Date(this._date.getTime());
	this.setDate(AjxDateUtil.roll(d, AjxDateUtil.MONTH, 1), this._skipNotifyOnPage);
}

DwtCalendar.prototype._prevYear = 
function(ev) {
	var d = new Date(this._date.getTime());
	this.setDate(AjxDateUtil.roll(d, AjxDateUtil.YEAR, -1), this._skipNotifyOnPage);
}

DwtCalendar.prototype._nextYear = 
function(ev) {
	var d = new Date(this._date.getTime());
	this.setDate(AjxDateUtil.roll(d, AjxDateUtil.YEAR, 1), this._skipNotifyOnPage);
}

DwtCalendar.getDateFormatter = function() {
	if (!DwtCalendar._dateFormatter) {
		DwtCalendar._dateFormatter = new AjxDateFormat(AjxMsg.formatCalDate);
	}
	return DwtCalendar._dateFormatter;
};
DwtCalendar.getDateLongFormatter = function() {
	if (!DwtCalendar._dateLongFormatter) {
		DwtCalendar._dateLongFormatter = new AjxDateFormat(AjxMsg.formatCalDateLong);
	}
	return DwtCalendar._dateLongFormatter;
};
DwtCalendar.getDateFullFormatter = function() {
	if (!DwtCalendar._dateFullFormatter) {
		DwtCalendar._dateFullFormatter = new AjxDateFormat(AjxMsg.formatCalDateFull);
	}
	return DwtCalendar._dateFullFormatter;
};
DwtCalendar.getDayFormatter = function() {
	if (!DwtCalendar._dayFormatter) {
		DwtCalendar._dayFormatter = new AjxDateFormat(AjxMsg.formatCalDay);
	}
	return DwtCalendar._dayFormatter;
};
DwtCalendar.getMonthFormatter = function() {
	if (!DwtCalendar._monthFormatter) {
		DwtCalendar._monthFormatter = new AjxDateFormat(AjxMsg.formatCalMonth);
	}
	return DwtCalendar._monthFormatter;
};

DwtCalendar.prototype._dragEnter =
function(ev) {
}

DwtCalendar.prototype._dragHover =
function(ev) {
}

DwtCalendar.prototype._dragOver =
function(ev) {
	var target = ev.target;
	if (target.id.charAt(0) == 'c') {
		this._setClassName(target, DwtCalendar._ACTIVATED);
		this._lastDndCell = target;
	} else {
		this._lastDndCell = null;
	}
}

DwtCalendar.prototype._dragLeave =
function(ev) {
}

