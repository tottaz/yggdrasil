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


if (window.Cos_String_XModelItem) {
	var model = new XModel({
		items:[
			{ id:"name", type:_COS_STRING_},
			{ id:"length", type:_COS_NUMBER_}
		]
	});
	
	var formAttr ={
		items:[
			{ ref:"name", type:_COS_TEXTFIELD_, label:"Name", valueLabel:""},
			{ ref:"length", type:_COS_TEXTFIELD_, label:"Length", valueLabel:"millimeters"}
		]
	};


	var instances = {
		account1:{
			cos:{ 
				attr: {
					name:"COS Name", 
					length:10
				}
			},
			account:{
				attr: {
					name:"Account 1 name",
					length:null
				}
			}
		},
		account2:{
			cos:{ 
				attr: {
					name:"COS Name", 
					length:10
				}
			},
			account:{
				attr: {
					name:"Account 2 name",
					length:20
				}
			}
		},
		empty:{
			cos:{
				attr: {
				}				
			},
			account:{
				attr: {
				}
			}
		}
	
	}

	registerForm("COS Fields", new XForm(formAttr, model), instances);
}
