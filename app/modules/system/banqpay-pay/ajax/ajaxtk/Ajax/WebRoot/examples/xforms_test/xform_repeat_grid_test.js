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





var xftest = {
	form : {
		id:"item_test",
		numCols:1,
		items:[


			{ref:"ATTENDEES", type:_REPEAT_GRID_, colSpan:"*", number:5, numCols:5,
				items:[
					{type:_BORDER_, numCols:1, borderStyle:"card", items:[
							{ref:"name", type:_OUTPUT_, width:100, cssStyle:"background-color:pink"},
//							{ref:"STATUS", type:_OSELECT1_, width:100}
//							{ref:"FREE", type:_BUTTON_GRID_, numCols:7, cssClass:"xform_button_grid_small"}
						]
					}
				]
			}
		]
	},
	
	instanceList:{
		"Four Items" : {
			ATTENDEES : [
				{name:"Owen", STATUS:"A", FREE:"MONDAY"},
				{name:"Enrique", STATUS:"?"},
				{name:"Ross", STATUS:"D", FREE:"WEDNESDAY"},
				{name:"Roland", STATUS:"T"}
			],
			NESTED : {
				A:"A simple nested value",
				B:"B simple nested value",
				C:"C simple nested value"
			},
			GRID_TEST:"WEDNESDAY,MONDAY"
		},
		
		"No Items" : {
		},
	
		"Two items" : {
			ATTENDEES : [
				{name:"Satish", STATUS:"A", FREE:"MONDAY"},
				{name:"John", STATUS:"?"}
			]
		},
		
		"Six items" : {
			ATTENDEES : [
				{name:"Satish", STATUS:"A", FREE:"MONDAY"},
				{name:"John", STATUS:"?"},
				{name:"Scott", STATUS:"D"},
				{name:"Andy", STATUS:"T", FREE:"TUESDAY"},
				{name:"Enrique", STATUS:"T", FREE:"TUESDAY"},
				{name:"Owen", STATUS:"T", FREE:"WEDNESDAY"}
			]
		},
		
		"Twenty items" : {
			ATTENDEES : [
				{name:"Albert", STATUS:"?", FREE:"MONDAY"},
				{name:"Betty", STATUS:"D"},
				{name:"Charlie", STATUS:"A"},
				{name:"Dawne", STATUS:"D", FREE:"TUESDAY"},
				{name:"Elbert", STATUS:"T", FREE:"TUESDAY"},
				{name:"Frannie", STATUS:"T", FREE:"WEDNESDAY"},
				{name:"George", STATUS:"A", FREE:"MONDAY"},
				{name:"Herbert", STATUS:"?"},
				{name:"Isa", STATUS:"D"},
				{name:"Julia", STATUS:"T", FREE:"TUESDAY"},
				{name:"Kenneth", STATUS:"A", FREE:"MONDAY"},
				{name:"Laurence", STATUS:"?"},
				{name:"Matthew", STATUS:"D"},
				{name:"Nancy", STATUS:"T", FREE:"TUESDAY"},
				{name:"Owen", STATUS:"T", FREE:"TUESDAY"},
				{name:"Paul", STATUS:"T", FREE:"WEDNESDAY"},
				{name:"Quince", STATUS:"A", FREE:"MONDAY"},
				{name:"Roger", STATUS:"?"},
				{name:"Steve", STATUS:"D"},
				{name:"Tawny", STATUS:"T", FREE:"TUESDAY"}
			]
		}	
	
	
	}
}
var model = new XModel(LmContactXFormView.contactXModel);
registerForm("Repeat Grid Test", new XForm(xftest.form, model), xftest.instanceList);


