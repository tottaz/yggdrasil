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


var appointmentForm = {
	items:[
		{ref:_SUBJECT_, type:_INPUT_},
		{ref:_LOCATION_, type:_INPUT_},		// MAKE A SELECT WITH A PREDETERMINED ITEMSET?

//		{type:_BUTTON_, label:"Google", onChange:"alert(1)"},
//		{type:_ANCHOR_, value:"http://www.google.com", label:"Google"},
		
		{ref:_ALL_DAY_, type:_INPUT_, value:"T", trueValue:"T", falseValue:"F"},

		// NOTE: show a DATE field if ALL_DAY is true, otherwise show a dateTime
		{type:_SWITCH_, 
			items:[
				{type:_CASE_, relevant:"get(_ALL_DAY_) == 'T'",
					items:[
						{ref:_START_DATE_, type:_INPUT_, displayType:_DATE_ }
					]
				},
				{type:_CASE_, relevant:"get(_ALL_DAY_) != 'T'",
					items:[
						{ref:_START_DATE_, type:_INPUT_, displayType:_DATETIME_	}
					]
				}
			]
		},

		{type:_SWITCH_, 
			items:[
				{type:_CASE_, relevant:"get(_ALL_DAY_) == 'T'",
					items:[
						{ref:_END_DATE_, type:_INPUT_, displayType:_DATE_ }
					]
				},
				{type:_CASE_, relevant:"get(_ALL_DAY_) != 'T'",
					items:[
						{ref:_END_DATE_, type:_INPUT_, displayType:_DATETIME_	}
					]
				}
			]
		},

		
		{ref:_REPEAT_TYPE_, type:_SELECT1_, selection:_CLOSED_, choices:_REPEAT_TYPE_CHOICES_},
		{ref:_REPEAT_DISPLAY_, type:_OUTPUT_, label:""},
		{ref:_REPEAT_CUSTOM_, type:_INPUT_, value:"T", trueValue:"T", falseValue:"F"},

		{type:_SWITCH_, id:"repeat_custom", items:[

			{type:_CASE_, id:"repeat_custom_day", 
				relevant:"get(_REPEAT_CUSTOM_) == 'T' && get(_REPEAT_TYPE_) == 'D'",
				items:[
					{type:_GROUP_, numCols:3, label:"&nbsp;", items:[
							{type:_OUTPUT_, value:_Every_},
							{ref:_REPEAT_CUSTOM_COUNT_, type:_INPUT_},
							{type:_OUTPUT_, value:"day(s)"}
						]
					}
				]
			},
			
			{type:_CASE_, id:"repeat_custom_week", 
				relevant:"get(_REPEAT_CUSTOM_) == 'T' && get(_REPEAT_TYPE_) == 'W'",
				items:[
					{type:_GROUP_, numCols:3, label:"", items:[
							{type:_OUTPUT_, value:_Every_},
							{ref:_REPEAT_CUSTOM_COUNT_, type:_INPUT_},
							{type:_OUTPUT_, value:"week(s) on:"}
						]
					},
					{ref:_REPEAT_WEEKLY_DAYS_, type:_SELECT_, selection:_CLOSED_, label:"", 
						displayType:_BUTTON_GRID_, numCols:7, cssClass:"xform_button_grid_small",
						choices:_DAY_OF_WEEK_INITIAL_CHOICES_
					}
				]
			},
			
			{type:_CASE_, id:"repeat_custom_month", 
				relevant:"get(_REPEAT_CUSTOM_) == 'T' && get(_REPEAT_TYPE_) == 'M'",
				items:[
					{type:_GROUP_, numCols:3, label:"", items:[
							{type:_OUTPUT_, value:_Every_},
							{ref:_REPEAT_CUSTOM_COUNT_, type:_INPUT_},
							{type:_OUTPUT_, value:"month(s):"}
						]
					},
					{ref:_REPEAT_CUSTOM_TYPE_, type:_SELECT1_, selection:_CLOSED_, label:"", 
						choices:[
							{value:"S", label:"On day(s)"},
							{value:"O", label:"On the"}
						]
					},
					{type:_GROUP_, numCols:2, label:"", 
						items:[
							{type:_SPACER_, width:2},
							{ref:_REPEAT_MONTHLY_DAY_LIST_, type:_SELECT_, selection:_CLOSED_,
								displayType:_BUTTON_GRID_, numCols:7, cssClass:"xform_button_grid_small",
								choices:_MONTH_DAY_CHOICES_
							}
						]
					},
					{type:_GROUP_, numCols:2, label:"", items:[
							{ref:_REPEAT_CUSTOM_ORDINAL_, type:_SELECT1_, selection:_CLOSED_, 
								choices:_REPEAT_CUSTOM_ORDINAL_CHOICES_
							},
							{ref:_REPEAT_CUSTOM_DAY_OF_WEEK_, type:_SELECT1_, selection:_CLOSED_,
								choices:_EXTENDED_DAY_OF_WEEK_CHOICES_
							}
						]
					}
				]
			},
			
			{type:_CASE_, id:"repeat_custom_year", 
				relevant:"get(_REPEAT_CUSTOM_) == 'T' && get(_REPEAT_TYPE_) == 'Y'",
				items:[
					{type:_GROUP_, numCols:3, label:"", items:[
							{type:_OUTPUT_, value:_Every_},
							{ref:_REPEAT_CUSTOM_COUNT_, type:_INPUT_},
							{type:_OUTPUT_, value:"year(s) in:"}
						]
					},
					{type:_GROUP_, numCols:2, label:"", 
						items:[
							{type:_SPACER_, width:10},
							{ref:_REPEAT_YEARLY_MONTHS_LIST_, type:_SELECT_, selection:_CLOSED_, 
								displayType:_BUTTON_GRID_, numCols:3, cssClass:"xform_button_grid_medium",
								choices:_MONTH_ABBR_CHOICES_
							}
						]
					},
					{type:_GROUP_, numCols:2, 
						items:[
							{ref:_REPEAT_CUSTOM_TYPE_, type:_INPUT_, value:"O", trueValue:"O", falseValue:"S", label:"On the:"},
							{type:_SWITCH_, numCols:2,
								items:[
									{type:_CASE_, numCols:2, 
										relevant:"get(_REPEAT_CUSTOM_TYPE_) == 'S'",
										items:[
											{ref:_REPEAT_CUSTOM_ORDINAL_, type:_OUTPUT_, 
												choices:_REPEAT_CUSTOM_ORDINAL_CHOICES_},
											{ref:_REPEAT_CUSTOM_DAY_OF_WEEK_, type:_OUTPUT_,
												choices:_EXTENDED_DAY_OF_WEEK_CHOICES_}
										]	
									},
									{type:_CASE_, numCols:2,
										relevant:"get(_REPEAT_CUSTOM_TYPE_) == 'O'",
										items:[
											{ref:_REPEAT_CUSTOM_ORDINAL_, type:_SELECT1_, selection:_CLOSED_, 
												choices:_REPEAT_CUSTOM_ORDINAL_CHOICES_},
											{ref:_REPEAT_CUSTOM_DAY_OF_WEEK_, type:_SELECT1_, selection:_CLOSED_,
												choices:_EXTENDED_DAY_OF_WEEK_CHOICES_}
										]	
									}
								]
							}
						]
					}
				]
			}
		]},

		{type:_GROUP_, numCols:2, 
			items:[
				{ref:_REPEAT_END_TYPE_, type:_SELECT1_, selection:_CLOSED_, choices:_REPEAT_END_TYPE_CHOICES_},
				
				{type:_SWITCH_, 
					items:[
						{type:_CASE_, 
							items:[
								{type:_GROUP_, numCols:2, 
									relevant:"get(_REPEAT_TYPE_) != 'N' " +
											 "&& get(_REPEAT_END_TYPE_) == 'A'",
									items:[
										{ref:_REPEAT_END_COUNT_, type:_INPUT_, cssStyle:"width:30px;"},
										{type:_OUTPUT_, value:"time(s)"}
									]
								}
							]
						},
						{type:_CASE_,
							items:[
								{ref:_REPEAT_END_DATE_, type:_INPUT_},
							]
						}
					]
				}
			]
		},
		
		{ref:_ATTENDEES_, type:_TEXTAREA_},		// type: field to enter 1, with existing values underneath? removal?
		{ref:_NOTES_, type:_TEXTAREA_}

	]


}
