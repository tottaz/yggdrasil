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


// xform
/*
var contactForm = {
	items: [
		{ ref: "fileAs", nowrap: true, fullWidth: true, cssClass: "card_big_name", cellCssClass:"card_big_name_cell" },
		{ ref: "attr/firstName", label: "First Name: ", cssClass: "contact", labelCssClass: "contact" },
		{ ref: "attr/lastName", label: "Last Name: ", cssClass: "contact", labelCssClass: "contact" },
		{ ref: "attr/middleName", label: "Middle Name: ", cssClass: "contact", labelCssClass: "contact" },
		{ ref: "attr/email", label: "Email: ", cssClass: "contact", labelCssClass: "contact" },
		{ ref: "attr/carPhone", label: "Car Phone: ", cssClass: "contact", labelCssClass: "contact", relevant: "get('carPhone') != null" },
		{ type: _GROUP_, numCols: 2, 
			items: [
				{ ref: "attr/firstName", label: "First Name: ", cssClass: "contact", labelCssClass: "contact" },
				{ ref: "attr/firstName", label: "First Name: ", cssClass: "contact", labelCssClass: "contact" },
				{ ref: "attr/firstName", label: "First Name: ", cssClass: "contact", labelCssClass: "contact" },
				{ ref: "attr/firstName", label: "First Name: ", cssClass: "contact", labelCssClass: "contact" }
			]
		}
	]
}
*/
var contactForm = {
	items: [
		{ type: _GROUP_, numCols: 3, label: "Name: ", labelClass: "smallLabel",
			items: [
				{ ref: "attr/firstName", type: _INPUT_ },
				{ ref: "attr/middleName", type: _INPUT_ },
				{ ref: "attr/lastName", type: _INPUT_ },
			]
		},
		{ ref: "attr/company", type: _INPUT_, label: "Company: ", labelClass: "smallLabel" },
		{ ref: "attr/jobTitle", type: _INPUT_, label: "Title: ", labelClass: "smallLabel" },
	]
}

// xmodel
var contactModel = {
	items: [	
		{ id: "fileAs", type: _STRING_, getter: "computeFileAs" },
		{ id: "firstName", type: _STRING_ },
		{ id: "lastName", type: _STRING_ },
		{ id: "middleName", type: _STRING_ },
		{ id: "company", type: _STRING_ },
		{ id: "jobTitle", type: _STRING_ },
		{ id: "email", type: _STRING_ },
		{ id: "carPhone", type: _STRING_ }
	],

	computeFileAs: function (instance) {
		return instance.attr.firstName + " " + instance.attr.middleName + " " + instance.attr.lastName;
	}
}

// form instance
var contactInstance = {
	"0" : { 
		attr: {
			firstName: "Parag",
			lastName: "Shah",
			middleName: "Naresh",
			company: "Zimbra Inc",
			jobTitle: "Software Engineer",
			email: "pshah@zimbra.com",
		}
	},
}

registerForm("Contact Test", new XForm(contactForm, new XModel(contactModel)), contactInstance);
//registerForm("Contact Test", new XForm(contactForm, null), contactInstance);
