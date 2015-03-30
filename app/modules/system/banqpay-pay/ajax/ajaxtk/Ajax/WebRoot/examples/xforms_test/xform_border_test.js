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
	X_showBorder:true,
	numCols:4,
	items:[
/*	
		{type:_BORDER_, borderStyle:"1pxBlack", colSpan:1, items:[
				{type:_OUTPUT_, value:"1pxBlack border", width:100, height:100}
			]
		},
		{type:_BORDER_, borderStyle:"card", colSpan:1, items:[
				{type:_OUTPUT_, value:"card border", width:100, height:100}
			]
		},
		{type:_BORDER_, borderStyle:"selected_card", colSpan:1, items:[
				{type:_OUTPUT_, value:"selected_card border", width:100, height:100}
			]
		},
		{type:_SPACER_},
		
		{type:_BORDER_, borderStyle:"dialog", colSpan:1, 
			substitutions:{title:"Dialog title", icon:"<div class=sm_icon_email></div>"},
			items:[
				{type:_OUTPUT_, value:"dialog"}
			]
		},

		{type:_BORDER_, borderStyle:"dialogWithTopToolbar", colSpan:1, 
			substitutions:{title:"Dialog title", icon:"<div class=sm_icon_email></div>"},
			items:[
				{type:_OUTPUT_, value:"dialog w/ top toolbar", width:100, height:50}
			]
		},

		{type:_BORDER_, borderStyle:"dialogWithBottomToolbar", colSpan:1, 
			substitutions:{title:"Dialog title", icon:"<div class=sm_icon_email></div>"},
			items:[
				{type:_OUTPUT_, value:"dialog w/bottom toolbar", width:100, height:50}
			]
		},

		{type:_BORDER_, borderStyle:"dialogWithBothToolbars", colSpan:1, 
			substitutions:{title:"Dialog title", icon:"<div class=sm_icon_email></div>"},
			items:[
				{type:_OUTPUT_, value:"dialog with both toolbars", width:100, height:50}
			]
		},
		{type:_BORDER_, borderStyle:"hover", colSpan:1, items:[], width:100, height:100},
		{type:_BORDER_, borderStyle:"SemiModalDialog", colSpan:1, items:[], width:100, height:100},
		{type:_BORDER_, borderStyle:"h_sash", colSpan:1, items:[]},



		{type:_SPACER_, height:20},
		{type:_GROUP_, useParentTable:false, colSpan:"*", numCols:6, 
			items:[

				{type:_BORDER_, width:100, height:100,borderStyle:"calendar_appt", colSpan:1, containerCssStyle:"opacity:.2;", 
					substitutions:{
						name:"<strike>Declined Appt</strike>", starttime:"2:00pm", status:" | Declined", location:"Flex 1",
						selState:"",	newState:"", statusKey:"DE", color:"_blue"
					}, items:[]
				},
				{type:_BORDER_, width:100, height:100, borderStyle:"calendar_appt", colSpan:1, containerCssStyle:"opacity:.6",
					substitutions:{
						name:"Tentative Appt", starttime:"2:00pm", status:"Tentative", location:"Flex 1",
						selState:"",	newState:"", statusKey:"TE", color:"_blue"
					}, items:[]
				},
		
				{type:_BORDER_, width:100, height:100, borderStyle:"calendar_appt", colSpan:1, 
					substitutions:{
						name:"Normal Appt", starttime:"2:00pm", status:"", location:"Flex 1",
						selState:"",	newState:"", statusKey:"AC", color:"_blue"
					}, items:[]
				},
		
				{type:_BORDER_, width:100, height:100, borderStyle:"calendar_appt", containerCssClass:"appt-selected", colSpan:1, 
					substitutions:{
						name:"Selected Appt", starttime:"2:00pm", status:"Accepted", location:"Flex 1",
						selState:"-selected",	newState:"", statusKey:"AC", color:"_blue"
					}, items:[]
				},
		
				{type:_BORDER_, width:100, height:100, borderStyle:"calendar_appt", colSpan:1, 
					substitutions:{
						name:"New Appt", starttime:"2:00pm", status:"Undecided", location:"Flex 1",
						selState:"",		newState:"_new", tag:"New", statusKey:"NE", color:"_blue"
					}, items:[]
				},
		
				{type:_BORDER_, width:100, height:100, borderStyle:"calendar_appt", containerCssClass:"appt-selected", colSpan:1,
					substitutions:{
						name:"Selected New Appt", starttime:"2:00pm", status:"Undecided", location:"Flex 1",
						selState:"-selected",	newState:"_new", tag:"New", statusKey:"NE", color:"_blue"
					}, items:[]
				},
		

				{type:_SPACER_, height:20},
		
		
				{type:_BORDER_, width:100,  borderStyle:"calendar_appt_30", colSpan:1, containerCssStyle:"opacity:.2", 
					substitutions:{
						name:"<strike>Declined Appt</strike>", starttime:"2:00pm", status:" | Declined", location:"Flex 1",
						selState:"",	newState:"",
						color:"_blue"
					}, items:[]
				},
				{type:_BORDER_, width:100,  borderStyle:"calendar_appt_30", colSpan:1, containerCssStyle:"opacity:.6",
					substitutions:{
						name:"Tentative Appt", starttime:"2:00pm", status:" | Tentative", location:"Flex 1",
						selState:"",	newState:"",
						color:"_blue"
					}, items:[]
				},
		
				{type:_BORDER_, width:100,  borderStyle:"calendar_appt_30", colSpan:1,
					substitutions:{
						name:"Normal Appt", starttime:"2:00pm", status:"", location:"Flex 1",
						selState:"",	newState:"",
						color:"_blue"
					}, items:[]
				},
		
				{type:_BORDER_, width:100,  borderStyle:"calendar_appt_30", colSpan:1, 
					substitutions:{
						name:"Selected Appt", starttime:"2:00pm", status:" | Accepted", location:"Flex 1",
						selState:"-selected",	newState:"",
						color:"_blue"
					}, items:[]
				},
		
				{type:_BORDER_, width:100,  borderStyle:"calendar_appt_30", colSpan:1, 
					substitutions:{
						name:"New Appt", starttime:"2:00pm", status:" | Undecided", location:"Flex 1",
						selState:"",	newState:"_new", tag:"New",
						color:"_blue"
					}, items:[]
				},
		
				{type:_BORDER_, width:100,  borderStyle:"calendar_appt_30", colSpan:1,
					substitutions:{
						name:"Selected New Appt", starttime:"2:00pm", status:" | Undecided", location:"Flex 1",
						selState:"-selected",	newState:"_new", tag:"New",
						color:"_blue"
					}, items:[]
				},
		
			]
		},
*/		{type:_SPACER_, height:20},		{type:_SPACER_, height:20},

		{type:_BORDER_, colSpan:"*", borderStyle:"SplashScreen", colSpan:1, items:[], 
			substitutions:{
				url:"<a href='http://www.zimbra.com' target=_blank>http://www.zimbra.com</a>",
				shortVersion:"BETA",
				appName:"Collaboration Suite",
				version:"Version: 2.0 (Wed Oct 12 2005)",
	//			contents:"<br>Loading something...<br><br><div class=ImgBarberPole_216></div>",
				contents:"<br><b>Additional information:</b><br><ul>"
						+"<li style='list-style:circle;'><a href=http://www.zimbra.com/licenses>Licenses</a><br>"
						+"<li style='list-style:circle;'><a href=http://www.zimbra.com/opensourcepartners>Open Source Partners</a><br>"
						+"<li style='list-style:circle;'><a href=http://www.zimbra.com/contributors>Contributors</a></ul>",
				license:"Copyright &copy; 2005 Zimbra, Inc.  &nbsp;&nbsp;&nbsp;'Zimbra' and the Zimbra logos are trademarks of Zimbra, Inc.",
				button:"<button style='width:60px;'>OK</button>"
			}
		},

{type:_SPACER_, height:20},		{type:_SPACER_, height:20},

		{type:_BORDER_, colSpan:"*", borderStyle:"LoginBanner", colSpan:1, items:[], 
			substitutions:{
				url:"<a href='http://www.zimbra.com' target=_blank>http://www.zimbra.com</a>",
				appName:"Collaboration Suite",
				shortVersion:"BETA",
				version:"Version: 2.0 (Wed Oct 12 2005)"
			}
		},

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
registerForm("Border test", new XForm(form, model), instances);

