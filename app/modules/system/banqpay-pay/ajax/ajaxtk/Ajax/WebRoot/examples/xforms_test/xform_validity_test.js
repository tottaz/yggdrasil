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


var form = {
	items: [
		{ ref: "page", type: _TAB_BAR_, label: "Types: (click on type name)", choices: [
			{ label: "_STRING_", value: "string"}, 
			{ label: "_NUMBER_", value: "number"},
			{ label: "_DATETIME_", value: "datetime" }
		]},
		{ type: _GROUP_, relevant: "get('page') == 'string'",
		  label: "String tests:", labelCssStyle: "vertical-align:top", 
		  items: [
			{ ref: "string/none", type: _INPUT_, labelLocation: _RIGHT_, labelCssStyle: "font-style:italic" },
			{ ref: "string/required", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "string/length", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "string/minLength", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "string/maxLength", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "string/minMaxLength", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "string/pattern1", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "string/pattern2", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "string/pattern3", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "string/pattern4", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "string/pattern5", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "string/enumeration1", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "string/enumeration2", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "string/enumeration3", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "string/whiteSpace1", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "string/whiteSpace2", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "string/whiteSpace3", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "string/whiteSpace4", type: _INPUT_, labelLocation: _RIGHT_ }
		]},
		{ type: _GROUP_, relevant: "get('page') == 'number'",
		  label: "Number tests:", labelCssStyle: "vertical-align:top",
		  items: [
		  	{ ref: "number/none", type: _INPUT_, labelLocation: _RIGHT_, labelCssStyle: "font-style:italic" },
			{ ref: "number/required", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "number/pattern1", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "number/pattern2", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "number/pattern3", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "number/pattern4", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "number/pattern5", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "number/enumeration1", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "number/enumeration2", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "number/enumeration3", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "number/whiteSpace1", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "number/whiteSpace2", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "number/whiteSpace3", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "number/whiteSpace4", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "number/maxInclusive", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "number/maxExclusive", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "number/minInclusive", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "number/minExclusive", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "number/totalDigits", type: _INPUT_, labelLocation: _RIGHT_ },
			{ ref: "number/fractionDigits", type: _INPUT_, labelLocation: _RIGHT_ }
	    ]},
	    { type: _GROUP_, relevant: "get('page') == 'datetime'",
	      label: "Date/Time tests:", labelCssStyle: "vertical-align:top",
	      items: [
	      	{ ref: "datetime/none", type: _DATETIME_, width: 400, labelLocation: _RIGHT_, labelCssStyle: "font-style:italic" },
			{ ref: "datetime/required", type: _INPUT_, labelLocation: _RIGHT_ }
	    ]},
	]
};

var model = {
	items: [
		// _STRING_
		{ id: "string/none", type: _STRING_, label: "none" },
		{ id: "string/required", type: _STRING_, required: true, label: "required: true" },
		{ id: "string/length", type: _STRING_, length: 4, label: "length: 4" },
		{ id: "string/minLength", type: _STRING_, minLength: 4, label: "minLength: 4" },
		{ id: "string/maxLength", type: _STRING_, maxLength: 8, label: "maxLength: 8" },
		{ id: "string/minMaxLength", type: _STRING_, minLength: 4, maxLength: 8, label: "minLength: 4, maxLength: 8" },
		{ id: "string/pattern1", type: _STRING_, pattern: "foo", label: "pattern: \"foo\"" },
		{ id: "string/pattern2", type: _STRING_, pattern: /foo/, label: "pattern: /foo/" },
		{ id: "string/pattern3", type: _STRING_, pattern: ["foo"], label: "pattern: [\"foo\"]" },
		{ id: "string/pattern4", type: _STRING_, pattern: [/foo/], label: "pattern: [/foo/]" },
		{ id: "string/pattern5", type: _STRING_, pattern: ["foo",/bar/], label: "pattern: [\"foo\",/bar/]" },
		{ id: "string/enumeration1", type: _STRING_, enumeration: [], label: "enumeration: []" },
		{ id: "string/enumeration2", type: _STRING_, enumeration: ["foo"], label: "enumeration: [\"foo\"]" },
		{ id: "string/enumeration3", type: _STRING_, enumeration: ["foo","bar"], label: "enumeration: [\"foo\",\"bar\"]" },
		{ id: "string/whiteSpace1", type: _STRING_, whiteSpace: "preserve", label: "whiteSpace: \"preserve\"" },
		{ id: "string/whiteSpace2", type: _STRING_, whiteSpace: "replace", label: "whiteSpace: \"replace\"" },
		{ id: "string/whiteSpace3", type: _STRING_, whiteSpace: "collapse", label: "whiteSpace: \"collapse\"" },
		{ id: "string/whiteSpace4", type: _STRING_, whiteSpace: "uNkNoWn", label: "whiteSpace: \"uNkNoWn\"" },
		// _NUMBER_
		{ id: "number/none", type: _NUMBER_, label: "none" },
		{ id: "number/required", type: _NUMBER_, required: true, label: "required: true" },
		{ id: "number/pattern1", type: _NUMBER_, pattern: "12", label: "pattern: \"12\"" },
		{ id: "number/pattern2", type: _NUMBER_, pattern: /12/, label: "pattern: /12/" },
		{ id: "number/pattern3", type: _NUMBER_, pattern: ["12"], label: "pattern: [\"12\"]" },
		{ id: "number/pattern4", type: _NUMBER_, pattern: [/12/], label: "pattern: [/12/]" },
		{ id: "number/pattern5", type: _NUMBER_, pattern: ["12",/42/], label: "pattern: [\"12\",/42/]" },
		{ id: "number/enumeration1", type: _NUMBER_, enumeration: [], label: "enumeration: []" },
		{ id: "number/enumeration2", type: _NUMBER_, enumeration: ["12"], label: "enumeration: [\"12\"]" },
		{ id: "number/enumeration3", type: _NUMBER_, enumeration: ["12","42"], label: "enumeration: [\"12\",\"42\"]" },
		{ id: "number/whiteSpace1", type: _NUMBER_, whiteSpace: "preserve", label: "whiteSpace: \"preserve\"" },
		{ id: "number/whiteSpace2", type: _NUMBER_, whiteSpace: "replace", label: "whiteSpace: \"replace\"" },
		{ id: "number/whiteSpace3", type: _NUMBER_, whiteSpace: "collapse", label: "whiteSpace: \"collapse\"" },
		{ id: "number/whiteSpace4", type: _NUMBER_, whiteSpace: "uNkNoWn", label: "whiteSpace: \"uNkNoWn\"" },
		{ id: "number/maxInclusive", type: _NUMBER_, maxInclusive: 12, label: "maxInclusive: 12" },
		{ id: "number/maxExclusive", type: _NUMBER_, maxExclusive: 12, label: "maxExclusive: 12" },
		{ id: "number/minInclusive", type: _NUMBER_, minInclusive: 12, label: "minInclusive: 12" },
		{ id: "number/minExclusive", type: _NUMBER_, minExclusive: 12, label: "minExclusive: 12" },
		{ id: "number/totalDigits", type: _NUMBER_, totalDigits: 4, label: "totalDigits: 4" },
		{ id: "number/fractionDigits", type: _NUMBER_, fractionDigits: 4, label: "fractionDigits: 4" },
		// _DATETIME_
		{ id: "datetime/none", type: _DATETIME_, label: "none" },
		{ id: "datetime/required", type: _DATETIME_, required: true, label: "required: true" }
	]
};

var instances = {
	Empty: {
		page: "string",
		string: {
			none: "", required: "",
			length: "", minLength: "", maxLength: "", minMaxLength: "",
			pattern1: "", pattern2: "", pattern3: "", pattern4: "", pattern5: "", 
			enumeration1: "", enumeration2: "", enumeration3: "", 
			whiteSpace1: "", whiteSpace2: "", whiteSpace3: "", whiteSpace4: ""
		},
		number: {
			none: 0, required: null,
			pattern1: 0, pattern2: 0, pattern3: 0, pattern4: 0, pattern5: 0, 
			enumeration1: 0, enumeration2: 0, enumeration3: 0, 
			whiteSpace1: 0, whiteSpace2: 0, whiteSpace3: 0, whiteSpace4: 0, 
			maxInclusive: 0, maxExclusive: 0, minInclusive: 0, minExclusive: 0,
			totalDigits: 0, fractionDigits: 0
		},
		datetime: {
			none: new Date(), required: null
		}
	},
	Valid: {
		page: "string",
		string: {
			none: "", required: "a",
			length: "abcd", minLength: "abcd", maxLength: "abcdefgh", minMaxLength: "abcd",
			pattern1: "foo", pattern2: "foo", pattern3: "foo", pattern4: "foo", pattern5: "bar", 
			enumeration1: "", enumeration2: "foo", enumeration3: "bar", 
			whiteSpace1: "", whiteSpace2: "", whiteSpace3: "", whiteSpace4: ""
		},
		number: {
			none: 0, required: 0,
			pattern1: 12, pattern2: 12, pattern3: 12, pattern4: 12, pattern5: 42, 
			enumeration1: 0, enumeration2: 12, enumeration3: 42, 
			whiteSpace1: 0, whiteSpace2: 0, whiteSpace3: 0, whiteSpace4: 0, 
			maxInclusive: 12, maxExclusive: 11, minInclusive: 12, minExclusive: 13,
			totalDigits: 1234, fractionDigits: .1234
		},
		datetime: {
			none: new Date(), required: new Date()
		}
	},
	Invalid: {
		page: "string",
		string: {
			none: "", required: null,
			length: "abc", minLength: "abc", maxLength: "abcdefghi", minMaxLength: "abc",
			pattern1: "bar", pattern2: "bar", pattern3: "bar", pattern4: "bar", pattern5: "baz", 
			enumeration1: "foo", enumeration2: "bar", enumeration3: "baz", 
			whiteSpace1: "", whiteSpace2: "", whiteSpace3: "", whiteSpace4: ""
		},
		number: {
			none: 0, required: null,
			pattern1: 12, pattern2: 12, pattern3: 12, pattern4: 12, pattern5: 42, 
			enumeration1: 0, enumeration2: 12, enumeration3: 42, 
			whiteSpace1: 0, whiteSpace2: 0, whiteSpace3: 0, whiteSpace4: 0, 
			maxInclusive: 11, maxExclusive: 10, minInclusive: 11, minExclusive: 12,
			totalDigits: 12345, fractionDigits: .12345
		},
		datetime: {
			none: "12 Foo 2005", required: null
		}
	}
};

registerForm("Validity Test", new XForm(form, new XModel(model)), instances);
