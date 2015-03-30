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

	Forms to show how calendar sharing might work.

*/


	
	var editFolderForm = {
		X_showBorder:true,
		cssStyle:"margin:10px",
		width:500,
		numCols:1, 
		items:[
			{type:_BORDER_, borderStyle:"dialog", width:400,
				substitutions: {
					title:"Folder Properties"
				},
				items:[

					{type:_GROUPER_, label:"Properties", width:"100%", 
						items: [
							{type:_INPUT_, label:"Name:", ref:"name", width:"200"},
							{type:_SPACER_, height:3},
							{type:_SELECT1_, ref:"type", label:"Type:", 
								choices:{
									mail: "Mail Folder",
									cal: "Calendar Folder",
									con: "Contacts Folder",
									mix: "Mixed Folder"
								}
							},
							{type:_SPACER_, height:3},
							{type:_SELECT1_, label:"Color:",
								choices: ["Blue","Cyan","Green","Gray","Orange","Pink","Purple","Red","Yellow"]
							},
		
							{type:_RADIO_GROUPER_, label:"When calendar messages arrive for this folder:", 
								items: [
									{type:_RADIO_, ref:"msgLocation", value:"inbox", label:"Place them in my <b>Inbox</b>"},
									{type:_RADIO_, ref:"msgLocation", value:"special", label:"Place them in the folder <b>Calendar Appointments</b>"},
									{type:_RADIO_, ref:"msgLocation", value:"trash", label:"Place them in the <b>Trash</b>"},
								]
							},
						]
					},


					{type:_GROUPER_, label:"Sharing for this folder", 
						items: [
							{type:_REPEAT_, colSpan:2, ref:"shares", showAddButton:false, showRemoveButton:false, items: [
									{type:_OUTPUT_, ref:"who", width:140},
									{type:_OUTPUT_, ref:"role", width:130 },
									{type:_ANCHOR_, label:"Edit...", labelLocation:_NONE_, relevant:"item.__parentItem.instanceNum != 0", relevantBehavior:_HIDE_},
									{type:_CELLSPACER_, width:5},
									{type:_ANCHOR_, label:"Remove", labelLocation:_NONE_, relevant:"item.__parentItem.instanceNum != 0", relevantBehavior:_HIDE_}
								]
							},
						]
					},
	
					{type:_SEPARATOR_, height:20},
					{type:_GROUP_, useParentTable:false, width:"100%", colSpan:2, numCols:5,  items:[
							{type:_BUTTON_, label:"Add Share..."},
							{type:_CELLSPACER_, width:160},
							{type:_BUTTON_, label:"OK", width:70},
							{type:_BUTTON_, label:"Cancel", width:70}
						]
					}
				]
			}
		]
	};




	registerForm("Edit Folder", new XForm(editFolderForm, new XModel()), {
			"instance":{	
					type:"cal",
					name:"Personal Calendar",
					msgLocation:"special",
					shares: [
						{ 	who:"<u><b>Who&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></u>", 
							role:"<u><b>Role&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></u>" 
						},
						{ who:"Janie O'Toole", role:"Manage" },
						{ who:"Ross Dargahi", role:"View"},
					]
			}
		}
	);


	var editShareForm = {
		X_showBorder:true,
		cssStyle:"margin:10px",
		width:500,
		numCols:1, 
		items:[
			{type:_BORDER_, borderStyle:"dialog", width:450,
				substitutions: {
					title:"Share Calendar"
				},
				items:[
					{type:_OUTPUT_, label:"Folder:", ref:"folder", width:"100%"},
					{type:_SPACER_, height:3},
					{type:_GROUP_, label:"Share with:", width:"100%", numCols:2, items:[
							{type:_INPUT_, ref:"who", width:"250"},
							{type:_BUTTON_, label:"Search...", cssStyle:"margin-left:10px"}
						]
					},
					{type:_SPACER_, height:3},
					{type:_RADIO_GROUPER_, label:"Role:", numCols:3, colSizes:[25,60,'*'], items: [
							{type:_RADIO_, ref:"role", value:"N", label:"<b>None</b>"},{type:_OUTPUT_, value:""},
							{type:_RADIO_, ref:"role", value:"V", label:"<b>Viewer</b>"},{type:_OUTPUT_, value:"View"},
							{type:_RADIO_, ref:"role", value:"E", label:"<b>Editor</b>"},{type:_OUTPUT_, value:"View, Accept"},
							{type:_RADIO_, ref:"role", value:"A", label:"<b>Manager</b>"},{type:_OUTPUT_, value:"View, Accept, Create, Edit, Delete"},
//							{type:_RADIO_, ref:"role", value:"M", label:"<b>Author</b>"},{type:_OUTPUT_, value:"View, Accept, Create and Delete appointments, as if they are you."},


							{type:_GROUP_, colSpan:'*', width:"100%", numCols:2, colSizes:[25,'*'], items:[
									{type:_SEPARATOR_, height:11, cssClass:"xform_separator_gray", relevant:"get('role') != 'N'",},
									{type:_CHECKBOX_, ref:"showPrivate", trueValue:'T', falseValue:'F', label:"Allow them to see private appointments", relevant:"get('role') != 'N'",},
									{type:_CHECKBOX_, ref:"sendNotices", trueValue:'T', falseValue:'F', label:"Send them copies of meeting notices", relevant:"get('role') != 'N' && get('role') != 'V'",},
									{type:_CHECKBOX_, ref:"proxy", trueValue:'T', falseValue:'F', label:"Show actions as if they were done by me", relevant:"get('role') != 'V' && get('role') != 'N'"},
									{type:_CELLSPACER_},
									{type:_OUTPUT_, ref:"proxy", forceUpdate:true, cssClass:"xform_label_left", relevant:"get('role') != 'V' && get('role') != 'N'", choices:{
											F: "<font size=1>Messages will appear <b>from: Janie O'Toole acting for Satish Dharmaraj</b></font>",
											T: "<font size=1>Messages will appear <b>from: Satish Dharmaraj</b></font>"
										}
									}
								]
							},
						]
					},

					{type:_SPACER_, height:10},


					{type:_GROUP_, colSpan:'*', width:"100%", numCols:2, colSizes:[35,'*'], items:[
							{type:_CHECKBOX_, ref:"sendMail", trueValue:'T', label:"Send mail to the recipient about this share"},
							{type:_SPACER_, height:3, relevant:"get('sendMail') == 'T'"},
							{type:_SELECT1_, ref:"mailType", relevant:"get('sendMail') == 'T'", label:"", choices:{
									S:"Send standard message",
									Q:"Write a quick message",
									M:"Use email compose screen"
								}
							},
							{type:_TEXTAREA_, ref:"quickReply", relevant:"get('mailType') == 'Q'", width:"95%", height:50, label:""}
						]
					},

	
					{type:_SEPARATOR_, height:20},
					{type:_GROUP_, useParentTable:false, width:"100%", colSpan:2, numCols:5,  items:[
							{type:_CELLSPACER_, width:240},
							{type:_BUTTON_, label:"OK", width:70},
							{type:_BUTTON_, label:"Cancel", width:70}
						]
					}
				]
			}
		]
	}




	registerForm("Edit Share", new XForm(editShareForm, new XModel()), {
			"instance":{	
				folder:"Personal Calendar",
				who:"Janie O'Toole",
				role:"A",
				showPrivate:"F",
				proxy:"T",
				sendNotices:"T",
				sendMail:"T",
				mailType:"S",	//"S"tandard, "Q"uickreply, "M"ail message
				quickReply:"Starter text goes here..."
			}
		}
	);




	var acceptShareForm = {
		X_showBorder:true,
		cssStyle:"margin:10px",
		width:500,
		numCols:2, 
		items:[
			{type:_BORDER_, borderStyle:"dialog", width:500,
				substitutions: {
					title:"Accept Share"
				},
				items:[
					{type:_OUTPUT_, colSpan:2, value:"Satish Dharmaraj has shared their 'Personal Calendar' folder with you.", cssClass:"ZmSubHead", height:23},

					{type:_OUTPUT_, colSpan:2, value:"They have granted you the <b>Manager</b> role, which means:"+
														"<div style='margin-left:15px;margin-bottom:3px;margin-top:3px;'>"+
															"<LI>You can <b>View</b> all public calendar appointments in the folder.</LI>"+
															"<LI><b>Accept</b> and <b>Decline</b> appointments for them.</LI>"+
															"<LI>You can <b>Create</b>, <b>Edit</b> and <b>Delete</b> appointments for them.</LI>"+
														"</div>"+
														"When you take action on their behalf, messages will appear: <br><b>&nbsp;&nbsp;&nbsp;&nbsp;from: Janie O'Toole acting for Satish Dharmaraj</b>"
					},
					
		
					{type:_SPACER_, height:10},
		
					{type:_RADIO_GROUPER_, label:"What do you want to do?", numCols:2, colSizes:["20","300"], items:[
								{type:_RADIO_, ref:"status", value:"A", label:"Accept the role"},
								{type:_RADIO_, ref:"status", value:"D", label:"Decline the role"},
								{type:_RADIO_, ref:"status", value:"T", label:"Decide later"},

								{type:_GROUP_, colSpan:'*', width:"100%", numCols:2, relevant:"get('status') == 'A'",items:[
										{type:_SEPARATOR_, height:11, cssClass:"xform_separator_gray"},
										{type:_INPUT_, label:"Call the folder:", ref:"name", width:"100%"},
										{type:_SELECT1_, label:"Color:",
											choices: ["Blue","Cyan","Green","Gray","Orange","Pink","Purple","Red","Yellow"]
										},
										{type:_RADIO_GROUPER_, label:"When calendar messages arrive for this folder:", colSizes:["25","300"], items: [
												{type:_RADIO_, ref:"msgLocation", value:"inbox", label:"Place them in my <b>Inbox</b>"},
												{type:_RADIO_, ref:"msgLocation", value:"special", label:"Place them in the folder <b>Delegated Appointments</b>"},
												{type:_RADIO_, ref:"msgLocation", value:"trash", label:"Place them in the <b>Trash</b>"},
											]
										},
									]
								},

								{type:_GROUP_, colSpan:'*', width:"100%", numCols:2, relevant:"get('status') == 'D'",items:[
										{type:_SEPARATOR_, height:11, cssClass:"xform_separator_gray"},
										{type:_CHECKBOX_, ref:"sendMail", trueValue:'T', falseValue:'F', label:"Send mail explaining why I decline this role"},
									]
								},

							]
						},

	
					{type:_SEPARATOR_, height:20},
					{type:_GROUP_, useParentTable:false, width:"100%", colSpan:2, numCols:5,  items:[
							{type:_CELLSPACER_, width:340},
							{type:_BUTTON_, label:"OK", width:70},
							{type:_BUTTON_, label:"Cancel", width:70}
						]
					}
				]
			}
		]
	}




	registerForm("Accept Share", new XForm(acceptShareForm, new XModel()), {
			"instance":{	
				folder:"Personal Calendar",
				name:"Satish Dharmaraj Personal Calendar",
				role:"M",
				status:"A",
				msgLocation:"special",
				sendMail:'T'
			}
		}
	);
