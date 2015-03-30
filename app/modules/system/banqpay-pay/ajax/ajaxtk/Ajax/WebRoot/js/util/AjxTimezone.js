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
 * This class stores mappings between client and server identifiers for
 * timezones as well as attempting to guess the default timezone. The 
 * application can override this value, through a user preference perhaps, 
 * by setting the <code>DEFAULT</code> property's value. The default 
 * timezone is specified using the client identifier (e.g. "US/Pacific").
 * <p>
 * <strong>Note:</strong>
 * The client timezone identifiers are the same identifiers used in the
 * Java TimeZone class. Only a subset of the timezones available in Java
 * are actually used in this class, though.
 */
function AjxTimezone () {}

// Static methods

AjxTimezone.getServerId = function(clientId) {
	return AjxTimezone._CLIENT2SERVER[clientId];
};
AjxTimezone.getClientId = function(serverId) {
	return AjxTimezone._SERVER2CLIENT[serverId];
};

AjxTimezone.getShortName = function(clientId) {
	return AjxTimezone._SHORT_NAMES[clientId];
};
AjxTimezone.getMediumName = function(clientId) {
	return "GMT"+AjxTimezone.getShortName(clientId);
};
AjxTimezone.getLongName = function(clientId) {
	return AjxTimezone.getMediumName(clientId)+" ("+I18nMsg["timezoneName"+clientId]+")";
};

AjxTimezone.getRule = function(clientId) {
	return AjxTimezone._CLIENT2RULE[clientId];
};

AjxTimezone.getOffset = function(clientId, date) {
	var rule = AjxTimezone.getRule(clientId);
	var offset = rule ? rule.stdOffset : 0;
	if (rule && rule.dstOffset) {
		var month = date.getMonth();
		var day = date.getDate();
		if ((month == rule.changeD[1] && day >= rule.changeD[2]) ||
			(month == rule.changeStd[1] && day < rule.changeStd[2]) ||
			(month > rule.changeD[1] && month < rule.changeStd[1])) {
			offset = rule.dstOffset;
		}
	}
	return offset;
};

// Constants

/** Client identifier for GMT. */
AjxTimezone.GMT = "Europe/London";

/** 
 * The default timezone is set by guessing the machine timezone later
 * in this file. See the static initialization section below for details.
 */
AjxTimezone.DEFAULT;

/** Server identifier for fallback timezone. */
AjxTimezone._FALLBACK = "(GMT-08.00) Pacific Time (US & Canada) / Tijuana";

AjxTimezone._CLIENT2SERVER = {};
AjxTimezone._SERVER2CLIENT = {};
AjxTimezone._SHORT_NAMES = {};
AjxTimezone._CLIENT2RULE = {};

/** 
 * The data is specified using the server identifiers for historical
 * reasons. Perhaps in the future we'll use the client (i.e. Java)
 * identifiers on the server as well.
 */
AjxTimezone._ruleLists = {
	noDSTList: [
		{ name:"(GMT-12.00) International Date Line West",				stdOffset: -720,hasDOffset: false },
		{ name:"(GMT-11.00) Midway Island / Samoa", 					stdOffset: -660,hasDOffset: false },
		{ name:"(GMT-10.00) Hawaii", 									stdOffset: -600,hasDOffset: false },
		{ name:"(GMT-07.00) Arizona",									stdOffset: -420,hasDOffset: false },
		{ name:"(GMT-06.00) Central America",							stdOffset: -360,hasDOffset: false },
		{ name:"(GMT-06.00) Saskatchewan",								stdOffset: -360,hasDOffset: false },
		{ name:"(GMT-05.00) Indiana (East)", 							stdOffset: -300,hasDOffset: false },
		{ name:"(GMT-04.00) Atlantic Time (Canada)", 					stdOffset: -300,hasDOffset: false },
		{ name:"(GMT-05.00) Bogota / Lima / Quito", 					stdOffset: -300,hasDOffset: false },
		{ name:"(GMT-04.00) Caracas / La Paz", 							stdOffset: -240,hasDOffset: false },
		{ name:"(GMT-03.00) Buenos Aires / Georgetown", 				stdOffset: -180,hasDOffset: false },
		{ name:"(GMT-01.00) Cape Verde Is.", 							stdOffset: -60, hasDOffset: false },
		{ name:"(GMT) Casablanca / Monrovia",							stdOffset: 0, 	hasDOffset: false },
		{ name:"(GMT+01.00) West Central Africa",						stdOffset: 60, 	hasDOffset: false },
		{ name:"(GMT+02.00) Harare / Pretoria", 						stdOffset: 120, hasDOffset: false },
		{ name:"(GMT+02.00) Jerusalem", 								stdOffset: 120, hasDOffset: false },
		{ name:"(GMT+03.00) Kuwait / Riyadh", 							stdOffset: 180, hasDOffset: false },
		{ name:"(GMT+03.00) Nairobi", 									stdOffset: 180, hasDOffset: false },
		{ name:"(GMT+04.00) Abu Dhabi / Muscat", 						stdOffset: 240, hasDOffset: false },
		{ name:"(GMT+04.30) Kabul", 									stdOffset: 270, hasDOffset: false },
		{ name:"(GMT+05.00) Islamabad / Karachi / Tashkent",			stdOffset: 300, hasDOffset: false },
		{ name:"(GMT+05.30) Chennai / Kolkata / Mumbai / New Delhi", 	stdOffset: 330, hasDOffset: false },
		{ name:"(GMT+05.45) Kathmandu", 								stdOffset: 345, hasDOffset: false },
		{ name:"(GMT+06.00) Astana / Dhaka", 							stdOffset: 360, hasDOffset: false },
		{ name:"(GMT+06.00) Sri Jayawardenepura", 						stdOffset: 360, hasDOffset: false },
		{ name:"(GMT+06.30) Rangoon", 									stdOffset: 390, hasDOffset: false },
		{ name:"(GMT+07.00) Bangkok / Hanoi / Jakarta", 				stdOffset: 420, hasDOffset: false },
		{ name:"(GMT+08.00) Kuala Lumpur / Singapore", 					stdOffset: 480, hasDOffset: false },
		{ name:"(GMT+08.00) Perth", 									stdOffset: 480, hasDOffset: false },
		{ name:"(GMT+08.00) Taipei", 									stdOffset: 480, hasDOffset: false },
		{ name:"(GMT+08.00) Beijing / Chongqing / Hong Kong / Urumqi",	stdOffset: 480, hasDOffset: false },
		{ name:"(GMT+09.00) Osaka / Sapporo / Tokyo", 					stdOffset: +540,hasDOffset: false },
		{ name:"(GMT+09.00) Seoul", 									stdOffset: 540, hasDOffset: false },
		{ name:"(GMT+09.30) Darwin", 									stdOffset: 570, hasDOffset: false },
		{ name:"(GMT+10.00) Brisbane", 									stdOffset: 600, hasDOffset: false },
		{ name:"(GMT+10.00) Guam / Port Moresby", 						stdOffset: 600, hasDOffset: false },
		{ name:"(GMT+11.00) Magadan / Solomon Is. / New Calenodia", 	stdOffset: 660, hasDOffset: false },
		{ name:"(GMT+12.00) Fiji / Kamchatka / Marshall Is.", 			stdOffset: 720, hasDOffset: false },
		{ name:"(GMT+13.00) Nuku'alofa", 								stdOffset: 780, hasDOffset: false }
	],

	DSTList: [
		{ name:"(GMT-09.00) Alaska", 
			stdOffset: -540, changeStd:[2005, 9, 30], 
			dstOffset: -480, changeD:[2005, 3, 3] },
		{ name:"(GMT-08.00) Pacific Time (US & Canada) / Tijuana", 
			stdOffset: -480, changeStd:[2005, 9, 30],
			dstOffset: -420, changeD: [2005, 3, 3]},
		{ name:"(GMT-07.00) Mountain Time (US & Canada)", 
			stdOffset: -420, changeStd:[2005, 9, 30], 
			dstOffset: -360, changeD: [2005, 3, 3]},
		{ name:"(GMT-06.00) Central Time (US & Canada)", 
			stdOffset: -360, changeStd: [2005, 9, 30], 
			dstOffset: -300, changeD: [2005, 3, 3]},
		{ name:"(GMT-05.00) Eastern Time (US & Canada)", 
			stdOffset: -300, changeStd: [2005, 9, 30],
			dstOffset: -240, changeD: [2005, 3, 3] },
		{ name:"(GMT-04.00) Santiago", 
			stdOffset: -240, changeStd: [2005, 2, 13],
			dstOffset: -180, changeD: [2005, 9, 9] },
		{ name:"(GMT-03.30) Newfoundland", 
			stdOffset: -210, changeStd: [2005, 9, 30],
			dstOffset: -150, changeD: [2005, 3, 3] },
		{ name:"(GMT-03.00) Brasilia", 
			stdOffset: -180, changeStd: [2005, 1, 20],
			dstOffset: -120, changeD: [2005, 9, 16] },
		{ name:"(GMT-03.00) Greenland", 
			stdOffset: -180, changeStd: [2005, 9, 30],
			dstOffset: -120, changeD: [2005, 3, 3] },
		{ name:"(GMT-02.00) Mid-Atlantic", 
			stdOffset: -120, changeStd: [2005, 8, 25],
			dstOffset: -60, changeD: [2005, 2, 27] },
		{ name:"(GMT-01.00) Azores", 
			stdOffset: -60, changeStd: [2005, 9, 30], 
			dstOffset: 0, changeD: [2005, 2, 27] },
		{ name:"(GMT) Greenwich Mean Time - Dublin / Edinburgh / Lisbon / London", 
			stdOffset: 0, changeStd: [2005, 9, 30],
			dstOffset: 60, changeD: [2005, 2, 27] },
		{ name:"(GMT+01.00) Amsterdam / Berlin / Bern / Rome / Stockholm / Vienna", 
			stdOffset: 60, changeStd: [2005, 9, 30],
			dstOffset: 120, changeD: [2005, 2, 27] },
		{ name:"(GMT+02.00) Athens / Beirut / Istanbul / Minsk", 
			stdOffset: 120, changeStd: [2005, 9, 30],
			dstOffset: 180, changeD: [2005, 2, 27] },
		{ name:"(GMT+02.00) Cairo", 
			stdOffset: 120, changeStd:  [2005, 8, 28],
			dstOffset: 180, changeD:  [2005, 4, 6] },
		{ name:"(GMT+03.00) Baghdad", 
			stdOffset: 180, changeStd: [2005, 9, 2],
			dstOffset: 240, changeD: [2005, 3, 3]},
		{ name:"(GMT+03.00) Moscow / St. Petersburg / Volgograd", 
			stdOffset: 180, changeStd: [2005, 9, 30],
			dstOffset: 240, changeD: [2005, 2, 27] },
		{ name:"(GMT+03.30) Tehran",
			stdOffset: 210, changeStd:  [2005, 8, 28], 
			dstOffset: 270, changeD:  [2005, 2, 6] },
		{ name:"(GMT+04.00) Baku / Tbilisi / Yerevan", 
			stdOffset: 240, changeStd: [2005, 9, 30],
			dstOffset: 300, changeD: [2005, 2, 27] },
		{ name:"(GMT+05.00) Ekaterinburg", 
			stdOffset: 300, changeStd:  [2005, 9, 30],
			dstOffset: 360, changeD:  [2005, 2, 27]},
		{ name:"(GMT+06.00) Almaty / Novosibirsk", 
			stdOffset: 360, changeStd:  [2005, 9, 30],
			dstOffset: 420, changeD:  [2005, 2, 27]},
		{ name:"(GMT+07.00) Krasnoyarsk", 
			stdOffset: 420, changeStd:  [2005, 9, 30],
			dstOffset: 480, changeD:  [2005, 2, 27] },
		{ name:"(GMT+08.00) Irkutsk / Ulaan Bataar", 
			stdOffset: 480, changeStd:  [2005, 9, 30],
			dstOffset: 540, changeD:  [2005, 2, 27] },
		{ name:"(GMT+09.00) Yakutsk", 
			stdOffset: 540, changeStd:  [2005, 9, 30],
			dstOffset: 600, changeD:  [2005, 2, 27] },
		{ name:"(GMT+09.30) Adelaide", 
			stdOffset: 570, changeStd:  [2005, 2, 27], 
			dstOffset: 630, changeD:  [2005, 9, 30] },
		{ name:"(GMT+10.00) Canberra / Melbourne / Sydney", 
			stdOffset: 600, changeStd: [2005, 2, 27],
			dstOffset: 660, changeD: [2005, 9, 30] },
		{ name:"(GMT+10.00) Hobart", 
			stdOffset: 600, changeStd: [2005, 2, 27],
			dstOffset: 660, changeD: [2005, 9, 2] },
		{ name:"(GMT+10.00) Vladivostok", 
			stdOffset: 600, changeStd: [2005, 9, 30], 
			dstOffset: 660, changeD: [2005, 2, 27] },
		{ name:"(GMT+12.00) Auckland / Wellington", 
			stdOffset: 720, changeStd: [2005, 2, 20],
			dstOffset: 780, changeD: [2005, 9, 2] }
	]
};

/**
 * One problem with firefox, is if the timezone on the machine changes,
 * the browser isn't updated. You have to restart firefox for it to get the 
 * new machine timezone.
 */
AjxTimezone._guessMachineTimezone = 
function() {
	var dec1 = new Date(2005, 12, 1, 0, 0, 0);
	var jun1 = new Date(2005, 6, 1, 0, 0, 0);
	var dec1offset = dec1.getTimezoneOffset();
	var jun1offset = jun1.getTimezoneOffset();
	var pos = ((dec1.getHours() - dec1.getUTCHours()) > 0);
	if (!pos) {
		dec1offset = dec1offset * -1;
		jun1offset = jun1offset * -1;
	}
	var tz = null;
	// if the offset for jun is the same as the offset in december,
	// then we have a timezone that doesn't deal with daylight savings.
	if (jun1offset == dec1offset) {
		var list = AjxTimezone._ruleLists.noDSTList;
 		for (var i = 0; i < list.length ; ++i ) {
			if (list[i].stdOffset == jun1offset) {
				tz = list[i];
				break;
			}
		}
	} else {
		// we need to find a rule that matches both offsets
		var list = AjxTimezone._ruleLists.DSTList;
		var dst = Math.max(dec1offset, jun1offset);
		var std = Math.min(dec1offset, jun1offset);
		var rule;
 		for (var i = 0; i < list.length ; ++i ) {
			rule = list[i];
			if (rule.stdOffset == std && rule.dstOffset == dst) {
				if (AjxTimezone._compareRules(rule, std, dst, pos)) {
					tz = rule;
					break;
				}
			}
		}
	}
	return tz ? tz.name : AjxTimezone._FALLBACK;
};

AjxTimezone._compareRules = 
function(rule, std, dst, pos) {
	var equal = false;
	var d = new Date(rule.changeStd[0], rule.changeStd[1], (rule.changeStd[2] -1)).getTimezoneOffset();
	var s = new Date(rule.changeStd[0], rule.changeStd[1], (rule.changeStd[2] + 1)).getTimezoneOffset();
	if (!pos) {
		s = s * -1;
		d = d * -1;
	}
	//alert("name = " + rule.name + ' s = ' + s + " d = " + d + " std = " + std + " dst = " + dst);
	if ( (std == s) && (dst == d) ) {
		s = new Date(rule.changeD[0], rule.changeD[1], (rule.changeD[2] -1)).getTimezoneOffset();
		d = new Date(rule.changeD[0], rule.changeD[1], (rule.changeD[2] + 1)).getTimezoneOffset();
		if (!pos) {
			s = s * -1;
			d = d * -1;
		}
		//alert("name = " + rule.name + ' s = ' + s + " d = " + d + " std = " + std + " dst = " + dst);
		if ((std == s) && (dst == d))
			equal = true;
	}
	return equal;
};

// Static initialization

var length = "timezoneMap".length;
for (var prop in I18nMsg) {
	if (prop.match(/^timezoneMap/)) {
		var clientId = prop.substring(length);
		var serverId = I18nMsg[prop];
		AjxTimezone._CLIENT2SERVER[clientId] = serverId;
		AjxTimezone._SERVER2CLIENT[serverId] = clientId;
	}
}

var lists = [ AjxTimezone._ruleLists.noDSTList, AjxTimezone._ruleLists.DSTList ];
for (var i = 0; i < lists.length; i++) {
	var list = lists[i];
	for (var j = 0; j < list.length; j++) {
		var rule = list[j];
		var serverId = rule.name;
		var clientId = AjxTimezone.getClientId(serverId);
		var sign = rule.stdOffset < 0 ? "-" : "+";
		var stdOffset = Math.abs(rule.stdOffset);
		var hours = stdOffset / 60;
		var minutes = stdOffset % 60;
		hours = hours < 10 ? '0' + hours : hours;
		minutes = minutes < 10 ? '0' + minutes : minutes;
		AjxTimezone._SHORT_NAMES[clientId] = sign + hours + minutes;
		AjxTimezone._CLIENT2RULE[clientId] = rule;
	}
}
AjxTimezone.DEFAULT = AjxTimezone.getClientId(AjxTimezone._guessMachineTimezone());
