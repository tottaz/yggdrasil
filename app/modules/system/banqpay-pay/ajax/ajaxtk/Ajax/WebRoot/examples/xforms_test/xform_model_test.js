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
		{ref:"normal", type:_INPUT_, label:"normal"},
		{ref:"nested/a", type:_INPUT_, label:"nested/a"},
		{ref:"nesteda", type:_INPUT_, label:"nesteda"},
		{ref:"nesteda", type:_CHECKBOX_, label:"nesteda", trueValue:"A value", falseValue:"NOT A value"},
		{ref:"gettera", type:_INPUT_, label:"gettera"},
		{ref:"nested/getterb", type:_INPUT_, label:"getterb"},
		{ref:"list[0]/a", type:_INPUT_, label:"list[0]/a"},
		{ref:"list[1]/a", type:_INPUT_, label:"list[1]/a"},
		{ref:"list", type:_REPEAT_, label:"list repeat", numCols:2, items:[
				{ref:"a", type:_INPUT_},
				{ref:"b", type:_INPUT_}
			]
		}
	]
}

var model = {
	getterScope:_MODEL_,
	setterScope:_MODEL_,
	
	getA: function(instance, current, ref) {
		return instance.nested.a;
	},
	setA: function(value, instance, current, ref) {
		instance.nested.a = value;
	},
	getNested: function(instance, current, ref) {
		return current[ref];
	},
	setNested: function(value, instance, current, ref) {
		return current[ref] = value;
	},
	getList: function(instance, current, ref) {
		return instance.aList;
	},
	setList: function(value, instance, current, ref) {
		return instance.aList = value;
	},
	
	items:[
		{id:"normal", type:_STRING_},
		{id:"nested", type:_OBJECT_, items:[
				{id:"a", type:_STRING_},
				{id:"getterb", type:_STRING_, ref:"b", getter:"getNested", setter:"setNested"}		
			]
		},
		{id:"nesteda", type:_STRING_, ref:"nested/a"},
		{id:"gettera", type:_STRING_, ref:"a", getter:"getA", setter:"setA"},
//		{id:"list", type:_LIST_, dataType:_OBJECT_, getter:"getList", getterScope:_MODEL_, items:[
//				{id:"a"}, {id:"b"}
//			]
//		}
		
		{id:"list", type:_LIST_, getter:"getList", setter:"setList",
			listItem: { type:_OBJECT_, items:[
						{id:"a", type:_STRING_, getter:"getNested", defaultValue:"aaa"}, 
						{id:"b", type:_NUMBER_}
					]
				}
		}
	]
}

var instances = {
	instance1:{
		normal:"Normal value",
		nested:{
			a:"A value",
			b:"B value"
		},
		aList: [
			{a:"list0 a", b:"0"},
			{a:"list1 a", b:"1"},
			{a:"list2 a", b:"2"},
		]
	},
	instance2:{
		normal:"instance2 Normal value",
		nested:{
			a:"instance2 A value",
			b:"instance2 B value"
		},
		aList: [
			{a:"instance2 list0 a", b:"0.1"}
		]
	},
	empty:{}
}


var model = new XModel(model);
registerForm("Model test", new XForm(form, model), instances);

