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

	Form to show different looks for an appointment in various states:
	
	Interesting states:
		* Normal (new) edit
		* Organizer edit instance
		* Orgainzer edit series
		* Organizer view instance invitation
		* Recipient view series invitation
		* Recipient view instance invitation
		
		- soft: allow invitees to invite others
		- attachments: 
			- invitiees can only add attachments (to instance or series)
			- organizere can add attachments to series/instance
		
		- if organizer makes a change, allow them to say "doesn't require re-acceptance"
		- hilite what was changed in update -- how?
		- edit instance, edit this and future, edit series

*/


	
	var editApptForm = {
		cssStyle:"margin:10px",
		width:500,
		numCols:1, 
		itemDefaults:{
			_OUTPUT_:{
				labelCssClass:"LabelColName", 
				labelCssStyle:"font-weight:bold;text-align:right;vertical-align:top;min-height:17px;padding-top:2px;",
				cssStyle:"vertical-align:top;min-height:17px;"							
			}
		
		},
		items:[
			// dialog for "Undecided" status
			{type:_BORDER_,
				colSpan:"*", borderStyle:"dialog", numCols:3, colSizes:[110,"100%", 100], width:500, 
				substitutions:{
					title:"Meeting: <span style='font-weight:normal'>Weekly UI Review</span>",
					closeIcon1:"ImgRedCircleClose",
					closeIcon2:"ImgPrinterIcon"
				},
				items:[

				{type:_GROUP_, useParentTable:true, colSpan:"*", relevant:"get('_status') == 'O'", numCols:3, items:[
					{type:_BUTTON_GRID_, ref:"_state", choices:[
							{value:"VI", label:"This Meeting", width:150},
							{value:"VS", label:"Meeting Series", width:150}
						]
					},
					{type:_SPACER_, height:5},
				  ]
				},
				
				{type:_OUTPUT_, label:"Subject:", ref:"_subject", colSpan:2},
				{type:_OUTPUT_, label:"Location:", ref:"_location", colSpan:2},
				{type:_SPACER_, height:5},
				
				{type:_GROUP_, useParentTable:true, colSpan:"*", relevant:"get('_state') != 'VS'", numCols:3, items:[
					{type:_OUTPUT_, label:"Time:", ref:"_time", relevant:"get('_state') != 'VS'", colSpan:1},
					{type:_GROUP_, colSpan:1, numCols:2, colSizes:["100%",35], width:"100%", items:[
						{type:_BUTTON_, label:"<", width:30, align:"right"},
						{type:_BUTTON_, label:">", width:30},
					  ]
					},

//{type:_CELLSPACER_},
					{type:_OUTPUT_, label:"Repeats:", ref:"_repeats", colSpan:2},
				  ]
				},
				{type:_GROUP_, useParentTable:true, colSpan:"*", relevant:"get('_state') == 'VS'", items:[
					{type:_OUTPUT_, label:"Time:", ref:"_seriesTime", colSpan:2},
					{type:_OUTPUT_, label:"Repeats:", ref:"_seriesRepeats", colSpan:2},
					{type:_OUTPUT_, label:"Exceptions:", ref:"_exceptions", colSpan:2},
				  ]
				},

				{type:_GROUP_, useParentTable:true, colSpan:"*", relevant:"get('_status') != 'O'", numCols:3, items:[
					{type:_SPACER_, height:5, colSpan:"*"},
					{type:_OUTPUT_, label:"Organizer:", ref:"_organizer", colSpan:"*"},
					{type:_OUTPUT_, label:"<A href=# class=subtleAnchor>Attendees</a>:", ref:"_attendees"},
//					{type:_BUTTON_, label:"Invite Others", width:95, align:"right"},
					{type:_SPACER_},
				  ]
				},

				{type:_GROUP_, useParentTable:true, colSpan:"*", relevant:"get('_status') == 'O'", numCols:3, items:[
					{type:_SEPARATOR_, height:11},
					{type:_OUTPUT_, ref:"_state", nowrap:true, cssStyle:"font-weight:bold", colSpan:2, choices:[
							{value:"VI", label:"<a href=# class=subtleAnchor>All attendees</a> for this meeting:"},
							{value:"VS", label:"<a href=# class=subtleAnchor>All attendees</a> for the meeting series:"},
						]
					}, 
					{type:_BUTTON_, label:"Edit Attendees", width:95, align:"right"},
//					{type:_BUTTON_, label:"Edit Attendees", width:95, align:"right"},
					
					{type:_OUTPUT_, label:"Accepted:", ref:"_accepted", relevantIfEmpty:false, colSpan:"*"},
					{type:_OUTPUT_, label:"Tentative:", ref:"_tentative", relevantIfEmpty:false, colSpan:"*"},
					{type:_OUTPUT_, label:"Declined:", ref:"_declined", relevantIfEmpty:false, colSpan:"*"},
					{type:_OUTPUT_, label:"Undecided:", ref:"_undecided", relevantIfEmpty:false, colSpan:"*"},
					{type:_SEPARATOR_, height:11},
				  ]
				},


				{type:_OUTPUT_, label:"Attachments:", ref:"_attachments"},
//				{type:_BUTTON_, label:"Add Attachment", width:95, align:"right", relevant:"get('_status') != 'O'", relevantBehavior:_HIDE_},
{type:_CELLSPACER_},
				{type:_OUTPUT_, label:"Notes:", ref:"_notes", colSpan:2},

/*
{type:_SEPARATOR_, height:21},
				{type:_GROUP_, colSpan:"*", numCols:3, colSizes:[360,65,65], items:[
						{type:_CELLSPACER_},
						{type:_BUTTON_, label:"Edit", width:60},
						{type:_BUTTON_, label:"Done", width:60}
					]
				}
*/

				{type:_GROUP_, relevant:"get('_status') == 'U' && get('_state') == 'N'",
					colSpan:"*", numCols:3, colSizes:[100,"100%", 100], width:500,items: [
						{type:_SEPARATOR_, height:20},
						
						{type:_OUTPUT_, colSpan:"*", value:"You have not acted upon this invitation.  What would you like to do?", cssClass:"LmSubHead"},
		
						{type:_GROUP_, colSpan:"*", useParentTable:false, numCols:2, colSizes:[30, 300], relevant:"get('_updated') != true",
						  items:[
							{type:_RADIO_, label:"<b>Accept</b> this meeting", ref:"_tempStatus", value:"A", elementChanged:statusChangeHandler},
							{type:_RADIO_, label:"<b>Tentatively</b> accept this meeting", ref:"_tempStatus", value:"T", elementChanged:statusChangeHandler},
							{type:_RADIO_, label:"<b>Decline</b> this meeting", ref:"_tempStatus", value:"D", elementChanged:statusChangeHandler},
						 ]
						},
				  ]
				},

				{type:_GROUP_, relevant:"get('_status') == 'U' && get('_state') == 'E'",
					colSpan:"*", numCols:3, colSizes:[100,"100%", 100], width:500,items: [
						{type:_SEPARATOR_, height:20},
						
						{type:_OUTPUT_, colSpan:"*", value:"The organizer has changed this meeting.  What would you like to do?", cssClass:"LmSubHead"},
		
						{type:_GROUP_, colSpan:"*", useParentTable:false, numCols:2, colSizes:[30, 300], relevant:"get('_updated') != true",
						  items:[
							{type:_RADIO_, label:"<b>Accept</b> the updated invitation", ref:"_tempStatus", value:"A", elementChanged:statusChangeHandler},
							{type:_RADIO_, label:"<b>Tentatively</b> accept the updated invitation", ref:"_tempStatus", value:"T", elementChanged:statusChangeHandler},
							{type:_RADIO_, label:"<b>Decline</b> the updated invitation", ref:"_tempStatus", value:"D", elementChanged:statusChangeHandler},
						 ]
						},
				  ]
				},

				{type:_GROUP_, relevant:"get('_status') == 'U'",
					colSpan:"*", numCols:3, colSizes:[100,"100%", 100], width:500,items: [
						{type:_SPACER_, height:5, relevant:"get('_replyStatus') == 'Q'"},
						{type:_TEXTAREA_, ref:"_notifyMessage", relevant:"get('_replyStatus') == 'Q'",
							label:"Message:", height:40, labelCssStyle:"vertical-align:top;padding-top:3px;"
						},
						{type:_SPACER_, height:5},
						{type:_GROUP_, colSpan:"*", useParentTable:false, align:"right", numCols:4, colSizes:["*","*",65, 65], width:"100%", items:[
							{type:_SELECT1_, ref:"_replyStatus", choices:{
										S:"Send standard reply", 
										Q:"Send QuickReply", 
										E:"Send email message", 
										D:"Don't notify organizer"}
							},
							{type:_CELLSPACER_, width:2},
							{type:_BUTTON_, label:"OK", align:"right", width:60, 
								onActivate:function() {
									this.setInstanceValue(this.getInstanceValue("_tempStatus"), "_status");
									this.getForm().refresh();						
								}
							},
							{type:_BUTTON_, label:"Cancel", align:"right", width:60, 
								onActivate:function() {
									this.setInstanceValue(this.getInstanceValue("_tempStatus"), "_status");
									this.getForm().refresh();						
								}
							},
						  ]
						},
				  ]
				},

				{type:_GROUP_, relevant:"get('_status') == 'A' && get('_state') == 'VI'",
					colSpan:"*", numCols:3, colSizes:[100,"100%", 100], width:500,items: [
						{type:_SEPARATOR_, height:20},
						
						{type:_OUTPUT_, colSpan:"*", value:"You <b>Accepted</b> this invitation on August 15 at 5:30pm.", cssClass:"LmBigger"},
						{type:_SPACER_, height:5},
		
						{type:_GROUP_, colSpan:"*", numCols:4, colSizes:[150,200,"100%"], width:"100%", items:[
							{type:_BUTTON_, label:"Change for This Meeting"},
							{type:_BUTTON_, label:"Change for This and Future Meetings"},
							{type:_BUTTON_, label:"Done", align:"right", width:70}
						  ]
						}
				  ]
				},

				{type:_GROUP_, relevant:"get('_status') == 'O' && get('_state') == 'VI'",
					colSpan:"*", numCols:3, colSizes:[100,"100%", 100], width:500,items: [
						{type:_SEPARATOR_, height:20},
						
						{type:_BUTTON_, label:"<nobr>Edit This Meeting</nobr>", width:95, cssClass:"TBButtonDefault"},
						{type:_BUTTON_, label:"Edit This and Future Meetings", width:160},
						{type:_BUTTON_, label:"Done", align:"right", width:70}
				  ]
				},

				{type:_GROUP_, relevant:"get('_status') == 'O' && get('_state') == 'VS'",
					colSpan:"*", numCols:3, colSizes:[160,"100%", 100], width:500,items: [
						{type:_SEPARATOR_, height:20},
						{type:_BUTTON_, label:"<nobr>Edit This and Future Meetings</nobr>", width:160, cssClass:"TBButtonDefault"},
						{type:_OUTPUT_},						
						{type:_BUTTON_, label:"Done", align:"right", width:70}
				  ]
				},

			  ]
			}
		]
	}


	function Combobox_XFormItem() {}
	XFormItemFactory.createItemType("_COMBOBOX_", "combobox", Combobox_XFormItem, Composite_XFormItem);
	Combobox_XFormItem.prototype.numCols = 2;
	Combobox_XFormItem.prototype.colSizes = ["100%",18];
	Combobox_XFormItem.prototype.containerCssStyle = "padding-top:2px;padding-bottom:2px;";
	Combobox_XFormItem.prototype.items = [
		{type:_INPUT_, ref:".", width:"100%", containerCssStyle:"padding-right:0px;padding:top:0px;padding-bottom:0px;"},
		{type:_OUTPUT_, value:"<div class=ImgComboboxArrow></div>", width:18, cssStyle:"padding-left:1px; padding-right:1px;padding:top:0px;padding-bottom:0px;" }
	];

	
	var TIMEZONES = ["Pacific Time","Eastern Time"];
	
	var composeAppointmentForm = {
		X_showBorder:true,
		cssStyle:"margin:10px",
		width:"100%",
		numCols:2,
		colSizes:[80,"100%"],
		items:[
			{type:_GROUP_, colSpan:2, numCols:3, colSizes:["50%",10,"50%"], items: [
					{type:_RADIO_GROUPER_, label:"Details", colSpan:1, numCols:4, height:85, colSizes:[70,"60%",60,"40%"], items:[
						{type:_INPUT_, ref:"_subject", label:"Subject:", width:"100%", colSpan:"*"},
						{type:_INPUT_, ref:"_location", label:"Location:", width:"100%", colSpan:"*"},
						
						{type:_SELECT1_, ref:"_folder", label:"Calendar:", width:"100%", colSpan:1, choices:[
								"Personal Calendar", "Zimbra Calendar", "Softball Schedule", "Scott Dietzen", "Satish Dharmaraj", "John Robb", "Ross Dargahi"
							]
						},

						{type:_SELECT1_, ref:"_busy", label:"Show as:", width:"100%", colSpan:1, choices:[
								"Busy", "Free", "Tentative", "Out of office"
							]
						},


						{type:_GROUP_, label:"Reminder:", colSpan:3, numCols:5, colSizes:["auto","auto","100%",20,40], items:[
								{type:_SELECT1_, ref:"_reminder", choices:{
										N:"None", E:"Show message"//, S:"Play sound"
									}
								},
								{type:_SELECT1_, ref:"_reminderTime", relevant:"get('_reminder') != 'N'", choices:{
										min0:"at the start time", min5:"5 minutes before", min10:"10 minutes before", min15:"15 minutes before", min30:"30 minutes before", 
										hour1:"1 hour before", hour2:"2 hours before", hour3:"3 hours before", hour4:"4 hours before", hour8:"8 hours before", hour12:"12 hours before",
										day1:"1 day before", day2:"2 days before", day3:"3 days before", day4:"4 days before", 
										week1:"1 week before", week2:"2 weeks before"
									}
								},
								{type:_CELLSPACER_},
								{type:_CHECKBOX_, ref:"_private", label:"Private"},
							]
						},

					  ]
					},
		
					{type:_CELLSPACER_},
		
					{type:_RADIO_GROUPER_, label:"Time", colSpan:1, numCols:5, height:85, colSizes:[65,80,20,80,"*"], items:[
							{type:_OUTPUT_, value:"Start:", cssClass:"xform_label", cssStyle:"width:auto"},
							{type:_COMBOBOX_, ref:"_startDate", width:80},
							{type:_OUTPUT_, value:"&nbsp;at&nbsp;", relevant:"get('_allday') != 'T'"},
							{type:_COMBOBOX_, ref:"_startTime", width:80, relevant:"get('_allday') != 'T'"},
							{type:_GROUP_, items:[
									{type:_CHECKBOX_, ref:"_allday", trueValue:"T", falseValue:"F", label:"All day event"},
								]
							},
			
							{type:_OUTPUT_, value:"End:", cssClass:"xform_label", cssStyle:"width:auto"},
							{type:_COMBOBOX_, ref:"_endDate", width:80},
							{type:_OUTPUT_, value:"&nbsp;at&nbsp;", relevant:"get('_allday') != 'T'"},
							{type:_COMBOBOX_, ref:"_endTime", width:80, relevant:"get('_allday') != 'T'"},
//							{type:_SPACER_},
							
							{type:_SELECT1_, ref:"_startTimeZone", containerCssStyle:"padding-left:3px;", colSpan:2, width:"100%", choices:TIMEZONES,
								relevant:"get('_allday') != 'T'"
							},
							
							
//							{type:_CELLSPACER_, colSpan:1}, 
//							{type:_CHECKBOX_, ref:"_changeTimeZone", trueValue:"T", falseValue:"F", label:"Update timezone on arrival",
//								relevant:"get('_startTimeZone') != get('_endTimeZone') && get('_allday') != 'T'"
//							},
							
							{type:_SPACER_, height:5},
							{type:_SELECT1_, ref:"_repeat", label:"Repeat:", colSpan:2, choices: {
									"N":"None", "D":"Every day", "W":"Every week", "M":"Every month", "Y":"Every year", "-":"----------------", "C":"Custom..."
								}
							},
							
/*							{type:_GROUP_, colSpan:"*", numCols:4, relevant:"get('_repeat') != 'N'",label:"End Repeat:", colSpan:3, items: [
									{type:_SELECT1_, ref:"_repeatEnd", relevant:"get('_repeat') != 'N'", choices: {
											"N":"Never", "A":"After:", "D":"By:"
										}
									},
									{type:_GROUP_, numCols:2, relevant:"get('_repeat') != 'N'", items: [
											{type:_COMBOBOX_, ref:"_repeatEndDate", width:80, colSpan:2, relevant:"get('_repeatEnd') == 'D'"},
											{type:_GROUP_, relevant:"get('_repeatEnd') == 'A'",  items:[
													{type:_INPUT_, ref:"_repeatEndOccurances", width:30},
													{type:_OUTPUT_, value:"meetings", relevant:"get('_repeatEnd') == 'A'"},
												]
											}
										]
									}
								]
							},
*/
							{ type:_OUTPUT_, colSpan:"*",  ref:"_repeat",
									choices:{	"N":"",
												"D":"<a href=#>Every day (no end date)</a>",
												"W":"<a href=#>Every week on Wednesday (no end date)</a>",
												"M":"<a href=#>Day 4 of every month (no end date)</a>",
												"Y":"<a href=#>Every year on October 4 (no end date)</a>",
												"C":"<a href=#>Every two weeks on Monday and Wednesday for 10 meetings</a>"
											}
							},
							

						]
					},
				]
			},
		

			{type:_COLLAPSABLE_RADIO_GROUPER_, colSpan:2, width:"100%", numCols:2, colSizes:[115,"*"], label:"Scheduling", items:[
					{type:_BUTTON_, label:"Schedule Attendees", width:110, containerCssStyle:"text-align:center"},
					{type:_INPUT_, width:"98%"},
					{type:_SPACER_, height:10},
				]
			},
//			{type:_COLLAPSABLE_RADIO_GROUPER_, label:"Scheduling", colSpan:2, numCols:2, colSizes:[90,"*"], items:[
//					{type:_BUTTON_, label:"Attendees...", width:80, containerCssStyle:"text-align:center"},
//					{type:_INPUT_, width:"100%"},
//
//					{type:_BUTTON_, label:"Resources...", width:80, containerCssStyle:"text-align:center"},
//					{type:_INPUT_, width:"100%"},
//				]
//			},


			{type:_COLLAPSABLE_RADIO_GROUPER_, colSpan:2, numCols:3, colSizes:[100,"100%",100], label:"Attachments", items:[
					{type:_OUTPUT_, ref:"_attachments", label:"Attachment(s):"},
					{type:_CELLSPACER_},
//					{type:_BUTTON_, label:"Add Attachment", containerCssClass:"text-align:right", cssStyle:"Xposition:relative;top:-22;"},

					{type:_GROUP_, colSpan:"*", numCols:6, width:"100%", colSizes:[300,70,5,40,"100%",100], label:"Add Attachment:", items: [
							{type:_INPUT_, width:"100%", },
							{type:_BUTTON_, label:"Browse..."},
							{type:_CELLSPACER_},
							{type:_ANCHOR_, label:"Remove", labelLocation:_NONE_},
						]
					}
				]
			},
			{type:_SPACER_, height:5},
			
//			{type:_RADIO_GROUPER_, label:"Notes", colSpan:2, numCols:1, items:[
					{type:_TEXTAREA_, width:"100%", colSpan:"*", height:"200" },
//				]
//			},
/*

			
			{type:_BORDER_, borderStyle:"dialog", substitutions:{title:"Custom repeat"}, relevant:"get('_repeat') == 'C'", items:[
					{type:_OUTPUT_, width:200, value:"Foo"}
				]
			}
*/


{type:_SPACER_, height:20},
{type:_BORDER_, borderStyle:"dialog", numCols:2, colSizes:[50,"*"], width:400, substitutions:{title:"Custom repeat"}, items:[

			{type:_RADIO_GROUPER_, label:"Repeat", items:[
					{type:_SELECT1_, ref:"recur", colSpan:"*", choices:[
						"None","Daily","Weekly","Monthly","Yearly"
						]
					},

					{type:_GROUP_, relevant:"get('recur') == 'Daily'", numCols:2, colSizes:[40,"*"], items:[
							{type:_RADIO_}, {type:_OUTPUT_, value:"Every day"},
							{type:_RADIO_}, {type:_OUTPUT_, value:"Every weekday"},
							{type:_RADIO_}, {type:_GROUP_, numCols:3, items:[
									{type:_OUTPUT_, value:"Every"},
									{type:_TEXTFIELD_, value:"2", width:30},
									{type:_OUTPUT_, value:"day(s)"},
								]
							}
						]
					},

					{type:_GROUP_, relevant:"get('recur') == 'Weekly'", colSizes:[40,"*"], items:[
							{type:_RADIO_}, {type:_GROUP_, numCols:3, items:[
									{type:_OUTPUT_, value:"Every"},
									{type:_SELECT1_, choices:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]},
								]
							},
							{type:_RADIO_}, {type:_GROUP_, numCols:3, items:[
									{type:_OUTPUT_, value:"Every"},
									{type:_TEXTFIELD_, value:"2", width:30},
									{type:_OUTPUT_, value:"week(s) on"},
								]
							},
							{type:_GROUP_, numCols:14, label:"", labelCssStyle:"width:10", colSpan:"*", items:[
									{type:_CHECKBOX_, label:"Mon&nbsp;"},
									{type:_CHECKBOX_, label:"Tue&nbsp;"},
									{type:_CHECKBOX_, label:"Wed&nbsp;"},
									{type:_CHECKBOX_, label:"Thu&nbsp;"},
									{type:_CHECKBOX_, label:"Fri&nbsp;"},
									{type:_CHECKBOX_, label:"Sat&nbsp;"},
									{type:_CHECKBOX_, label:"Sun&nbsp;"},
								]
							}
						]
					},

					{type:_GROUP_, relevant:"get('recur') == 'Monthly'", colSizes:[40,"*"], items:[
							{type:_RADIO_}, {type:_GROUP_, numCols:3, items:[
									{type:_OUTPUT_, value:"Day"},
									{type:_TEXTFIELD_, value:"4", width:30},
									{type:_OUTPUT_, value:" of each month"}
								]
							},
							{type:_RADIO_}, {type:_GROUP_, numCols:5, items:[
									{type:_OUTPUT_, value:"Day"},
									{type:_TEXTFIELD_, value:"2", width:30},
									{type:_OUTPUT_, value:" of every"},
									{type:_TEXTFIELD_, value:"4", width:30},
									{type:_OUTPUT_, value:"month(s)"}
								]
							},


							{type:_RADIO_}, {type:_GROUP_, numCols:6, items:[
									{type:_OUTPUT_, value:"The"},
									{type:_SELECT1_, choices:["first","second","third","fourth","last"]},
									{type:_SELECT1_, choices:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]},
									{type:_OUTPUT_, value:"of each month"},
								]
							},
							{type:_RADIO_}, {type:_GROUP_, numCols:6, items:[
									{type:_OUTPUT_, value:"The"},
									{type:_SELECT1_, choices:["first","second","third","fourth","last"]},
									{type:_SELECT1_, choices:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]},
									{type:_OUTPUT_, value:"of every"},
									{type:_TEXTFIELD_, value:"2", width:30},
									{type:_OUTPUT_, value:"month"},

								]
							},
						]
					},

					{type:_GROUP_, relevant:"get('recur') == 'Yearly'", colSizes:[40,"*"], items:[
							{type:_RADIO_}, {type:_GROUP_, numCols:3, items:[
									{type:_OUTPUT_, value:"Every year on"},
									{type:_SELECT1_, choices:["January","February","March","April","May","June","July","August","September","October","November","December"]},
									{type:_TEXTFIELD_, value:"4", width:30},
								]
							},

							{type:_RADIO_}, {type:_GROUP_, numCols:6, items:[
									{type:_OUTPUT_, value:"The"},
									{type:_SELECT1_, choices:["first","second","third","fourth","last"]},
									{type:_SELECT1_, choices:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]},
									{type:_OUTPUT_, value:"of"},
									{type:_SELECT1_, choices:["January","February","March","April","May","June","July","August","September","October","November","December"]},
								]
							},
						]
					},
				]
			},

			{type:_CELLSPACER_, relevant:"get('recur') != 'None'", colSpan:2},
			{type:_RADIO_GROUPER_, relevant:"get('recur') != 'None'", colSizes:[40,"*"], label:"End", items:[
					{type:_RADIO_}, {type:_OUTPUT_, value:"No end date"},

					{type:_RADIO_}, {type:_GROUP_, numCols:6, items:[
							{type:_OUTPUT_, value:"End after"},
							{type:_TEXTFIELD_, value:"2", width:30},
							{type:_OUTPUT_, value:" meetings"},
						]
					},

					{type:_RADIO_}, {type:_GROUP_, numCols:6, items:[
							{type:_OUTPUT_, value:"End by"},
							{type:_TEXTFIELD_, value:"10/4/2006", width:80},
						]
					},
			
				]
			},

			
			{type:_SEPARATOR_, height:21, colSpan:"*"},
			{type:_GROUP_, colSpan:"*", numCols:3, width:"100%", colSizes:["100%","65","65"], items:[
					{type:_CELLSPACER_},
					{type:_BUTTON_, label:"OK", width:60},
					{type:_BUTTON_, label:"Cancel", width:60},
					
				]
			}
]}

		]
	};







	var CalTestInstanceProto = {
		recur:"Daily",
		_subject:"Weekly UI Review",
		_organizer:"<a href=# class=subtleAnchor>Ross Dargahi<a>",
		_time:"Sep 1, 2005 from 10:00am - 11:00am",
		_seriesTime:"Mondays from 10:00am - 11:00am",
		_allDay: "F",
		_startDate:"10/4/2005",
		_startTime:"10:00 am",
		_startTimeZone:"Pacific Time",
		_startTimeStr:"Sep 1, 2005 at 10:00am PST",
		_endDate:"10/4/2005",
		_endTime:"11:00 am",
		_endTimeZone:"Pacific Time",
		_endTimeStr:"Sep 1, 2005 at 11:00am PST",
		_changeTimeZone:"T",
		_repeat:"D",
		_repeatEnd:"D",
		_repeatEndDate:"10/1/2005",
		_repeatEndOccurances:"10",
		_repeats:"Every Monday",
		_seriesRepeats:"Every Monday from Aug 1, 2005 to Aug 1, 2006",
		_exceptions:	"cancelled <a href=# class=subtleAnchor>Tuesday, Aug 21</a><br>"+
						"moved on <a href=# class=subtleAnchor>Monday, Aug 31 to 9:00am - 1:00pm</a><br>"+
						"moved to <a href=# class=subtleAnchor>Tuesday, Sept 6</a><br>"+
						"<a href=# class=subtleAnchor> 3 more...</a>",

		_location:"Flex 1 conference room",
		_reminder:"N",
		_reminderTime:"min15",
		_attendees:"<a href=# class=subtleAnchor>Conrad Damon</a>, <a href=# class=subtleAnchor>Andy Clark</a>, <a href=# class=subtleAnchor>Parag Shah</a>, <a href=# class=subtleAnchor>Enrique DelCampo</a>, <a href=# class=subtleAnchor>Owen Williams</a>, <a href=# class=subtleAnchor>Roland Schemers</a>",
		_accepted:"<a href=# class=subtleAnchor>Conrad Damon</a>, <a href=# class=subtleAnchor>Andy Clark</a>",
		_tentative:"<a href=# class=subtleAnchor>Parag Shah</a>",
		_declined:"<a href=# class=subtleAnchor>Enrique DelCampo</a>",
		_undecided:"<a href=# class=subtleAnchor>Owen Williams</a>, <a href=# class=subtleAnchor>Roland Schemers</a>",
		
		_updated:false,
		_tempStatus:"A",
		_status:"U",		//	"U"ndecided, "A"ccepted", "D"eclined, "O"rganizer, "X"=Out of date
		_replyStatus:"S",	//  "S"tandard Reply, "Q"uick Reply, send "E"mail message, "D"on't notify organizer
		_notify:true,
		_customize:false,
		_notifyMessage:"I accept this appointment",
		_attachments:"<table><tr><td><div class=ImgPDFDocIcon></div></td><td><A HREF=# class=subtleAnchor>Plan of action.pdf</A></td><td>&nbsp;<a href=#>Remove</a></td></tr></table>",
		_notes:"Here is a long message body.  Here is a long message body.  Here is a long message body.  Here is a long message body.  Here is a long message body.  Here is a long message body.  Here is a long message body.  Here is a long message body.  Here is a long message body.  Here is a long message body.  Here is a long message body.  Here is a long message body.  Here is a long message body.  Here is a long message body.  Here is a long message body.  "
	};
	function CalTestInstance(props) {
		for (var prop in props) {
			this[prop] = props[prop];
		}
	}
	CalTestInstance.prototype = CalTestInstanceProto;


	registerForm("Edit Appt", new XForm(editApptForm, new XModel()), {
			"Recipient unaccepted":new CalTestInstance({ _status:"U", _state:"N"}), 							//"N"ew
			"Recipient unaccepted instance":new CalTestInstance({ _status:"U", _state:"E", _tempStatus:"A"}), 	//"E"xception
			"Recipient view accepted":new CalTestInstance({ _status:"A", _state:"VI"}),						//"V"iew "I"nstance
			"Organizer view instance":new CalTestInstance({ _status:"O", _state:"VI"}), 
			"Organizer view series":new CalTestInstance({ _status:"O", _state:"VS"}), 
//			"Organizer edit series":new CalTestInstance({ _status:"O", _state:"ES"}), 
		}
	);



	var composeFormInstance = new CalTestInstance({
	});
	
	registerForm("Compose Appointment", new XForm(composeAppointmentForm, new XModel()), {
			"instance":composeFormInstance
		}
	);




	var quickAddApptForm = {
		numCols:1,
		cssStyle:"margin:10px",
		items:[
			{type:_BORDER_, borderStyle:"SemiModalDialog", colSpan:"*", colSizes:[100,100,20,100 ], numCols:4, 
				substitutions: {
					title:"QuickAdd Appointment"
				},
				items: [
					{type:_TEXTFIELD_, label:"Name:", width:"100%", colSpan:"*", value:"My appointment"},
					{type:_TEXTFIELD_, label:"Location:", width:"100%", colSpan:"*", value:"My house"},
					{type:_SELECT1_, label:"Calendar:", width:"100%", colSpan:2, choices:[
							"Personal Calendar", "Work", "Home", "Important"
						]
					},
					{type:_CELLSPACER_},
					
					{type:_SPACER_, height:10},

					{type:_SELECT1_, label:"Start Time:", choices: ["10/3/2005&nbsp;&nbsp;"], width:"100%"},
					{type:_OUTPUT_, value:"at"},
					{type:_SELECT1_, choices: ["12:30 pm&nbsp;&nbsp;"], width:"100%"},

					{type:_SELECT1_, label:"End Time:", choices: ["10/3/2005&nbsp;&nbsp;"], width:"100%"},
					{type:_OUTPUT_, value:"at"},
					{type:_SELECT1_, choices: ["1:30 pm&nbsp;&nbsp;"], width:"100%"},

					{type:_SPACER_, height:10},
					{type:_SELECT1_, ref:"_repeat", label:"Repeat:", colSpan:'*', choices: {
							"N":"None", "D":"Every day", "W":"Every week", "M":"Every month", "Y":"Every year"
						}
					},

					{type:_SEPARATOR_, height:15},					
					{type:_GROUP_, colSpan:"*", numCols:4, colSizes:[100,152,65,60], items: [
							{type:_BUTTON_, label:"More Options", width:100},
							{type:_CELLSPACER_},
							{type:_BUTTON_, label:"OK", width:60},
							{type:_BUTTON_, label:"Cancel", width:60}
						]
					}
				]
			}
		]
	}

	registerForm("QuickAdd Appointment", new XForm(quickAddApptForm, new XModel()), {
			"instance":composeFormInstance
		}
	);
