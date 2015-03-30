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
	numCols:2,
	items:[
	
		{ref:"SUBJECT", type:_INPUT_, label:"Subject:"},
		{ref:"SUBJECT", type:_INPUT_, label:"Subject (dup):"},
		{type:_SEPARATOR_},
		{ref:"SELECT", type:_SELECT1_, label:"Select1:", width:100},
		{ref:"SELECT", type:_SELECT_, label:"Select:"},
		{ref:"SELECT", type:_OSELECT1_, label:"OSelect:"},
		{ref:"SELECT", type:_BUTTON_GRID_, label:"Button Grid:", multiple:false},
		{type:_SEPARATOR_},
		{ref:"START_DATE", type:_OUTPUT_, label:"Date value:"},

//SYNTAX ERROR IN SAFARI
		{ref:"START_DATE", type:_OUTPUT_, label:"Date str:", 
			getDisplayValue:function(newValue){
				if (newValue == null) return "";
				return (newValue.getMonth()+1) + "/" + newValue.getDate() + "/" + newValue.getFullYear()
						+ " " + newValue.getHours() + ":" + newValue.getMinutes();	
			}
		},
		{ref:"START_DATE", type:_DATE_, label:"Date (DATE type):"},
		{ref:"START_DATE", type:_TIME_, label:"Date (TIME type):"},
		{ref:"START_DATE", type:_DATETIME_, label:"Date (DATETIME type):"},
		{type:_SEPARATOR_},

/*		{ref:"IMG", type:_IMAGE_, label:"Image:"},
		{type:_IMAGE_, label:"No ref image:", srcPath:"../images/", value:"sm_icon_help.gif"},
		{ref:"IMG_CHOICES", type:_IMAGE_, label:"Image w/choices:"},
*/
		{ref:"boolean_checkbox", type:_CHECKBOX_, label:"Boolean checkbox", trueValue:true, falseValue:false},
		{ref:"string_checkbox", type:_CHECKBOX_, label:"String checkbox", trueValue:"Y", falseValue:"N"},


		{type:_SEPARATOR_, height:20},
		{type:_TAB_BAR_, ref:"current_page", choices:[
				{value:"A", label:"Page A"},
				{value:"B", label:"Page B"},
				{value:"C", label:"Page C"},
				{value:"D", label:"Page D"}
			]
		},
		{type:_SWITCH_, items:[
				{type:_CASE_, relevant:"get('current_page') == 'A'", height:200, items:[
						{type:_OUTPUT_, value:"<BR>This is page <B>A</b>.<BR><BR>", cssStyle:"font-size:24px;background-color:white;height:200px;"}
					]
				},
				{type:_CASE_, relevant:"get('current_page') == 'B'", items:[
						{type:_OUTPUT_, value:"<BR>This is page <B>B</b>.<BR><BR>", cssStyle:"font-size:24px;background-color:#FFCCFF;"}
					]
				},
				{type:_CASE_, relevant:"get('current_page') == 'C'", items:[
						{type:_OUTPUT_, value:"<BR>This is page <B>C</b>.<BR><BR>", cssStyle:"font-size:24px;background-color:#CCFFFF;"}
					]
				},
				{type:_CASE_, relevant:"get('current_page') == 'D'", items:[
						{type:_OUTPUT_, value:"<BR>This is page <B>D</b>.<BR><BR>", cssStyle:"font-size:24px;background-color:#FFFFCC;"}
					]
				}
			]
		}
	]
}

var model = {
	items:[
		{id:"SUBJECT", type:_STRING_},
		{id:"START_DATE", type:_DATE_},
		{id:"SELECT", type:_STRING_, choices:[
				{value:"A", label:"a value"},
				{value:"B", label:"b value"},
				{value:"C", label:"c value"},
				{value:"D", label:"d value"},
				{value:"E", label:"eeeeeeeeeeeeeeeeeeeeeee value"}
			]
		},
		{id:"ALL_DAY", trueValue:"T", falseValue:"F"},
		{id:"IMG", srcPath:"../images/", cssStyle:"width:32px;height:32px;"},
		{id:"IMG_CHOICES", srcPath:"../images/", cssStyle:"width:32px;height:32px;",
			choices:[
				{value:"doc", label:"sm_icon_document.gif"},
				{value:"help", label:"sm_icon_help.gif"},
				{value:null, label:"spacer.gif"}
			]
		}

	]
}

var instances = {
	instance1:{
		START_DATE:new Date(),
		SUBJECT:"Subject",
		SELECT:"A",
		ALL_DAY:"F",
		IMG:"sm_icon_document.gif",
		IMG_CHOICES:"doc",
		current_page:"A"
	},
	instance2:{
		START_DATE:new Date(),
		SUBJECT:"Second instance subject",
		SELECT:"B",
		ALL_DAY:"F",
		IMG:"sm_icon_help.gif",
		IMG_CHOICES:"help",
		current_page:"B"
	},
	empty:{}
}


var model = new XModel(model);
registerForm("Item test", new XForm(form, model), instances);

