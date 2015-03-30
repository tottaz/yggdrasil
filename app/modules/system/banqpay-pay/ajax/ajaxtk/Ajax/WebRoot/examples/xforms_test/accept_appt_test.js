/*
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
*/

/*

	Form to show in email (and possibly in a dialog) when there is a meeting invitation to accept, etc.
	
	??? How will this look different when it's in a dialog by itself ???

	Interesting states:
		* Undecided (eg: new invitation, not acted upon)
		* A/T/D
		* Updated
		* Out of date
		* Organizer

*/


	var statusChangeHandler = function(elementValue, instanceValue, event) {
			var message;
			switch (elementValue) {
				case "A":	message = "I accept this appointment."; break;
				case "T":	message = "I tentatively accept this appointment."; break;
				case "D":	message = "I decline this appointment."; break;
			}
			this.getModel().setInstanceValue(this.getInstance(), "_notifyMessage", message);
			this.getForm().itemChanged(this, elementValue, event);
	}
	
	var acceptApptForm = {
		cssStyle:"margin:10px",
		width:500,
		colSizes:[100,450],
		itemDefaults:{
			_OUTPUT_:{
				labelCssClass:"LabelColName", labelCssStyle:"font-weight:bold;text-align:right;vertical-align:top;padding-top:2px"
			}
		
		},
		items:[


			// dialog for "Undecided" status
			{type:_BORDER_, relevant:"get('_status') == 'U'", borderStyle:"non-modal dialog", substitutions:{title:"Meeting invitation: <span style='font-weight:normal'>Weekly UI Review</span>"}, 
				colSizes:[60,"100%"], width:350, items:[
				
				{type:_OUTPUT_, colSpan:2, value:"<b>Appointment request:  What would you like to do?</b>"},
				
				{type:_GROUP_, colSpan:2, useParentTable:false, numCols:2, colSizes:[20, 300], relevant:"get('_updated') != true",
				  items:[
					{type:_RADIO_, label:"<b>Accept</b> this meeting", ref:"_tempStatus", value:"A", elementChanged:statusChangeHandler},
					{type:_RADIO_, label:"<b>Tentatively</b> accept this meeting", ref:"_tempStatus", value:"T", elementChanged:statusChangeHandler},
					{type:_RADIO_, label:"<b>Decline</b> this meeting", ref:"_tempStatus", value:"D", elementChanged:statusChangeHandler},
				 ]
				},

				{type:_GROUP_, colSpan:2, useParentTable:false, numCols:2, colSizes:[20, 300], relevant:"get('_updated') == true",
				  items:[
					{type:_OUTPUT_, colSpan:2, value:"The organizer has updated this invitation."},
					{type:_SPACER_, height:5},
					{type:_RADIO_, label:"<b>Accept</b> the updated invitation", ref:"_tempStatus", value:"A", elementChanged:statusChangeHandler},
					{type:_RADIO_, label:"<b>Tentatively</b> accept the updated invitation", ref:"_tempStatus", value:"T", elementChanged:statusChangeHandler},
					{type:_RADIO_, label:"<b>Decline</b> the updated invitation", ref:"_tempStatus", value:"D", elementChanged:statusChangeHandler},
				 ]
				},
	
				{type:_SPACER_, height:5},
				{type:_TEXTAREA_, ref:"_notifyMessage", relevant:"get('_replyStatus') == 'Q'",
					label:"Message:", height:40, labelCssStyle:"vertical-align:top;padding-top:3px;"
				},
				{type:_SPACER_, height:5, relevant:"get('_replyStatus') == 'Q'"},

				{type:_GROUP_, colSpan:2, useParentTable:false, align:"right", numCols:5, width:"100%", items:[
					{type:_SELECT1_, ref:"_replyStatus", choices:{
								S:"Send standard reply", 
								Q:"Send QuickReply", 
								E:"Send email message", 
								D:"Don't notify organizer"}
					},
					{type:_CELLSPACER_, width:"100%"},
					{type:_BUTTON_, label:"Show in Calendar", align:"right"},
					{type:_CELLSPACER_, width:2},
					{type:_BUTTON_, label:"OK", align:"right", width:50, 
						onActivate:function() {
							this.setInstanceValue(this.getInstanceValue("_tempStatus"), "_status");
							this.getForm().refresh();						
						}
					},
				  ]
				},
			  ]
			},


			// dialog for "Accepted",  "Tentative" or "Declined" status
			{type:_BORDER_, relevant:"'ATD'.indexOf(get('_status')) > -1", borderStyle:"non-modal dialog", substitutions:{title:"Meeting invitation:  <span style='font-weight:normal'>Weekly UI Review</span>"}, 
				numCols:2, width:350, items:[
				{type:_OUTPUT_, colSpan:2, ref:"_status", 
					choices:{
								A:"You <b>Accepted</b> this invitation on August 15 at 5:30pm.", 
								T:"You <b>Tentatively</b> accepted this invitation on August 15 at 5:30pm", 
								D:"You <b>Declined</b> this invitation on August 15 at 5:30pm"
							}
				},
				{type:_SPACER_, height:10},
				{type:_GROUP_, colSpan:2, useParentTable:false, align:"right", numCols:3, width:"100%", colSizes:["50%","50%"], items:[
					{type:_BUTTON_, label:"Show in Calendar", align:"left"},
					{type:_BUTTON_, label:"Change My Reply", align:"right", 
						onActivate:function() {
							this.setInstanceValue("U", "_status");
							this.getForm().refresh();
						}
					},
				  ]
				},
			  ]
			},


			// dialog for "X" (out of date) status
			{type:_BORDER_, relevant:"get('_status') == 'X'", borderStyle:"non-modal dialog", substitutions:{title:"Meeting invitation:  <span style='font-weight:normal'>Weekly UI Review</span>"}, 
				numCols:2, width:350, items:[
				{type:_OUTPUT_, colSpan:2, value:"This meeting invitation is out of date."},
				{type:_SPACER_, height:10},
				{type:_GROUP_, colSpan:2, useParentTable:false, align:"right", numCols:1, width:"100%", colSizes:["100%"], items:[
//					{type:_BUTTON_, label:"Show in Calendar", align:"left"},
					{type:_BUTTON_, label:"Show latest invitation", align:"right", 
						onActivate:function() {
							this.setInstanceValue("U", "_status");
							this.getForm().refresh();
						}
					},
				  ]
				},
			  ]
			},


			// dialog for "Organizer" status (I know it won't really be done this way...
			{type:_GROUP_, relevant:"get('_status') == 'O'", XborderStyle:"SemiModalDialog", colSpan:"*", substitutions:{title:"Meeting invitation: <span style='font-weight:normal'>Attendee status</span>"}, 
				width:500, numCols:2, colSizes:[100,"100%"], items:[

				{type:_OUTPUT_, colSpan:"*", value:"This appointment was <b>Accepted</b> by <b>Conrad Damon</b> on October 1, 2005 at 12:35pm, with the message:<br><br><i>Sounds great, I'll bring the guacamole.</i><br>"},

			{type:_TOP_GROUPER_, label:"Current status of all attendees", items:[], colSpan:"*", width:"100%"},


				{type:_OUTPUT_, label:"<u>Accepted</u>:", ref:"_accepted", relevantIfEmpty:false},
				{type:_OUTPUT_, label:"<u>Tentative</u>:", ref:"_tentative", relevantIfEmpty:false},
				{type:_OUTPUT_, label:"<u>Declined</u>:", ref:"_declined", relevantIfEmpty:false},
				{type:_OUTPUT_, label:"<u>Undecided</u>:", ref:"_undecided", relevantIfEmpty:false},

				{type:_SPACER_, height:10},
				{type:_GROUP_, colSpan:2, useParentTable:false, align:"right", numCols:5, width:"100%", items:[
					{type:_BUTTON_, label:"Send mail to attendees", 
						onActivate:function() {
							this.setInstanceValue("U", "_status");
							this.getForm().refresh();
						}
					},
					{type:_CELLSPACER_, width:"150"},
					{type:_BUTTON_, label:"Edit Next Instance", align:"right", 
						onActivate:function() {
							this.setInstanceValue("U", "_status");
							this.getForm().refresh();
						}
					},
					{type:_CELLSPACER_, width:2},
					{type:_BUTTON_, label:"Edit Series", align:"right", 
						onActivate:function() {
							this.setInstanceValue("U", "_status");
							this.getForm().refresh();
						}
					},
				  ]
				},
			  ]
			},


			{type:_TOP_GROUPER_, label:"Appointment details", items:[], colSpan:"*", width:"100%"},

			{type:_OUTPUT_, label:"Subject:", ref:"_subject"},
			{type:_OUTPUT_, label:"Location:", ref:"_location"},
			{type:_OUTPUT_, label:"Time:", ref:"_time"},
			{type:_OUTPUT_, label:"Repeats:", ref:"_repeats"},
			{type:_OUTPUT_, label:"Organizer:", ref:"_organizer", relevant:"get('_status') != 'O'"},


			{type:_OUTPUT_, label:"Attendees:", ref:"_attendees", relevant:"get('_status') != 'O'"},

			{type:_OUTPUT_, label:"Attachments:", ref:"_attachments"},

			{type:_SPACER_, height:10},
			
			{type:_OUTPUT_, colSpan:2, ref:"_notes", cssStyle:"background-color:white;height:100", label:null},

			{type:_SPACER_, height:10}
		]
	}



	var testInstanceProto = {
		_subject:"Weekly UI Review",
		_organizer:"Ross Dargahi",
		_time:"Aug 15 from 10:00am - 1:00pm",
		_repeats:"Every Monday",
		_location:"Flex 1 conference room",
		
		_attendees:"<u>Conrad Damon</u>, <u>Andy Clark</u>, <u>Parag Shah</u>, <u>Enrique DelCampo</u>, <u>Owen Williams</u>, <u>Roland Schemers</u>",
		_accepted:"<u>Conrad Damon</u>, <u>Andy Clark</u>",
		_tentative:"<u>Parag Shah</u>",
		_declined:"<u>Enrique DelCampo</u>",
		_undecided:"<u>Owen Williams</u>, <u>Roland Schemers</u>",
		
		_updated:false,
		_tempStatus:"A",
		_status:"U",		//	"U"ndecided, "A"ccepted", "D"eclined, "O"rganizer, "X"=Out of date
		_replyStatus:"S",	//  "S"tandard Reply, "Q"uick Reply, send "E"mail message, "D"on't notify organizer
		_notify:true,
		_customize:false,
		_notifyMessage:"I accept this appointment",
		_attachments:"<table><tr><td><img src=/liquidConsole/img/hiRes/attachment/PDFDocIcon.gif width=16 height=16></td><td><A HREF=#>Plan of action.pdf</A></td></tr></table>",
		_notes:"Here is a long message body.  Here is a long message body.  Here is a long message body.  Here is a long message body.  Here is a long message body.  Here is a long message body.  Here is a long message body.  Here is a long message body.  Here is a long message body.  Here is a long message body.  Here is a long message body.  Here is a long message body.  Here is a long message body.  Here is a long message body.  Here is a long message body.  "
	};
	function testInstance(props) {
		for (var prop in props) {
			this[prop] = props[prop];
		}
	}
	testInstance.prototype = testInstanceProto;


	registerForm("Accept Appt", new XForm(acceptApptForm, new XModel()), {
			"Unseen": new testInstance(), 
			"Acted on":new testInstance({ _status:"A"}), 
			"Updated":new testInstance({ _status:"U", _updated:true}), 
			"Out of date":new testInstance({ _status:"X"}), 
			"Organizer":new testInstance({ _status:"O"})
		}
	);
