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


var _MODEL_ = "model";
var _INSTANCE_ = "instance";
var _INHERIT_ = "inherit";
var _MODELITEM_ = "modelitem";


function XModel(attributes) {
	// get a unique id for this form
	XFG.assignUniqueId(this, "_Model_");

	// copy any attributes passed in directly into this object
	if (attributes) {
		for (var prop in attributes) {
			this[prop] = attributes[prop];	
		}
	}
	
	if (this.items == null) this.items = [];
	
	this._pathIndex = {};
	this._pathGetters = {};
	this._parentGetters = {};
	this._itemsAreInitialized = false;
	this._errorMessages = {};

	if (this.getDeferInit() == false) {
		this.initializeItems();
	}
}
XModel.toString = function() {	return "[Class XModel]";	}
XModel.prototype.toString = function() {	return "[XModel " + this.__id + "]";	}

XModel.prototype.pathDelimiter = "/";
XModel.prototype.getterScope = _INSTANCE_;
XModel.prototype.setterScope = _INSTANCE_;

// set deferInit to false to initialize all modelItems when the model is created
//	NOTE: this is generally a bad idea, and all XForms are smart enough
//			to tell their models to init before they need them...
XModel.prototype.deferInit = true;
XModel.prototype.getDeferInit = function () {	return this.deferInit	}


XModel.prototype.initializeItems = function() {
	if (this._itemsAreInitialized) return;
	
	var t0 = new Date().getTime();

	this.__nestedItemCount = 0;	//DEBUG

	// initialize the items for the form
	this.items = this.initItemList(this.items, null);

	this._itemsAreInitialized = true;

	var t1 = new Date().getTime();
	//DBG.println(this,".initializeItems(): w/ ", this.__nestedItemCount," items took ", (t1 - t0), " msec");
}



XModel.prototype.initItemList = function(itemAttrs, parentItem) {
	var items = [];
	for (var i = 0; i < itemAttrs.length; i++) {
		items[i] = this.initItem(itemAttrs[i], parentItem);
	}
	this.__nestedItemCount += itemAttrs.length;		//DEBUG
	return items;
}


XModel.prototype.initItem = function(itemAttr, parentItem) {
	// if we already have a form item, assume it's been initialized already!
	if (itemAttr.__isXModelItem) return itemAttr;

	// create the XFormItem subclass from the item attributes passed in
	//	(also links to the model)
	var item = XModelItemFactory.createItem(itemAttr, parentItem, this);
	
	
	
	// have the item initialize it's sub-items, if necessary (may be recursive)
	item.initializeItems();

	return item;
}

XModel.prototype.addItem = function(item, parentItem) {
	if (!item.__isXModelItem) item = this.initItem(item, parentItem);
	if (parentItem == null) {
		this.items.push(item);
	} else {
		parentItem.addItem(item);
	}
}

// add an item to our index, so we can find it easily later
XModel.prototype.indexItem = function(item, path) {
	this._pathIndex[path] = item;
}






//
// getting modelItems, parent items, their paths, etc
//

XModel.prototype.getItem = function(path, createIfNecessary) {
	// try to find the item by the path, return if we found it
	var item = this._pathIndex[path];
	if (item != null) return this._pathIndex[path];

	// if we didn't find it, try normalizing the path
	var normalizedPath = this.normalizePath(path);
	//	convert any "#1", etc to just "#"
	for (var i = 0; i < normalizedPath.length; i++) {
		if (normalizedPath[i].charAt(0) == "#") normalizedPath[i] = "#";
	}
	// and if we find it, save that item under the original path and return it
	item = this._pathIndex[normalizedPath.join(this.pathDelimiter)];
	if (item != null) {
		this._pathIndex[path] = item;
		return item;
	}

	if (createIfNecessary != true) return null;

	// get each parent item (creating if necessary) until we get to the end
	var parentItem = null;
	for (var p = 0; p < normalizedPath.length; p++) {
		var itemPath = normalizedPath.slice(0, p+1).join(this.pathDelimiter);
		var item = this.getItem(itemPath, false);
		if (item == null) {
			//DBG.println("making modelItem for ", itemPath);
			item = XModelItemFactory.createItem({id:normalizedPath[p]}, parentItem, this);
		}
		parentItem = item;
	}
	return item;
}



// "normalize" a path and return it split on the itemDelimiter for this model
XModel.prototype.normalizePath = function (path) {
	if (path.indexOf("[") > -1) {
		path = path.split("[").join("/#");
		path = path.split("]").join("");
	}
	if (path.indexOf(".") > -1) {
		path = path.split(this.pathDelimiter);
		var outputPath = [];
		for (var i = 0; i < path.length; i++) {
			var step = path[i];
			if (step == "..") {
				outputPath.pop();
			} else if (step != ".") {
				outputPath.push(step);
			}
		}
		return outputPath;
	}
	return path.split(this.pathDelimiter);
}


XModel.prototype.getParentPath = function (path) {
	path = this.normalizePath(path);
	return path.slice(0, path.length - 1);
}

XModel.prototype.getLeafPath = function (path) {
	path = this.normalizePath(path);
	return path[path.length - 1];
}






XModel.prototype.getInstanceValue = function (instance, path) {
	var getter = this._getPathGetter(path);
//DBG.println("getInstanceValue(",path,"):" + (typeof path) + ":" + (typeof getter));
	return getter.call(this, instance);
}

XModel.prototype.getParentInstanceValue = function (instance, path) {
	var getter = this._getParentPathGetter(path);
//DBG.println("getParentInstanceValue(",path,"):" + (typeof path) + ":" + (typeof getter));
	return getter.call(this, instance);
}


XModel.prototype.setInstanceValue = function (instance, path, value) {
//DBG.println("setInstanceValue(",path,"): ", value, " (",typeof value,")");
	var parentValue = this.getParentInstanceValue(instance, path);
	if (parentValue == null) {
		parentValue = this.setParentInstanceValues(instance, path);
	}
	var modelItem = this.getItem(path, true);
	var leafPath = this.getLeafPath(path);
	var ref = modelItem.ref;
	if (leafPath.charAt(0) == "#") ref = parseInt(leafPath.substr(1));
	
	if (modelItem.setter) {
		// convert "/" to "." in the ref
		if (ref.indexOf(this.pathDelimiter) > -1) ref = ref.split(this.pathDelimiter).join(".");

		var setter = modelItem.setter;
		var scope = modelItem.setterScope;
		if (scope == _INHERIT_) scope = this.setterScope;
		if (scope == _INSTANCE_) {
			instance[setter](value, parentValue, ref);
		} else if (scope == _MODEL_) {
			this[setter](value, instance, parentValue, ref);		
		} else {
			modelItem[setter](value, instance, parentValue, ref);
		}
	} else {
		if (typeof ref == "string" && ref.indexOf(this.pathDelimiter) > -1) {
			ref = ref.split(this.pathDelimiter);
			for (var i = 0; i < ref.length - 1; i++) {
				parentValue = parentValue[ref[i]];
			}
			ref = ref.pop();
		}
		parentValue[ref] = value;
	}
	return value;
}


XModel.prototype.setParentInstanceValues = function (instance, path) {
	var pathList = this.getParentPath(path);
	for (var i = 0; i < pathList.length; i++) {
		var itemPath = pathList.slice(0, i+1).join(this.pathDelimiter);
		var itemValue = this.getInstanceValue(instance, itemPath);
		if (itemValue == null) {
			var modelItem = this.getItem(itemPath, true);
			var defaultValue = modelItem.getDefaultValue();
			itemValue = this.setInstanceValue(instance, itemPath, defaultValue);
		}
	}
	return itemValue;
}







//NOTE: model.getInstance() gets count of PARENT
// "modelItem" is a pointer to a modelItem, or an path as a string
XModel.prototype.getInstanceCount = function (instance, path) {
	var list = this.getParentInstanceValue(instance, path);
	if (list != null && list.length) return list.length;
	return 0;
}


// "path" is a path of id's
XModel.prototype.addRowAfter = function (instance, path, afterRow) {
	var newInstance = null;	
	
	var modelItem = this.getItem(path);
	if (modelItem) {
		newInstance = this.getNewListItemInstance(modelItem);
	} else {
		newInstance = "";
	}
	var list = this.getInstanceValue(instance, path);
	if (list == null) {
		// create a list and install it!
		list = [];
		this.setInstanceValue(instance, path, list);
	}

	list.splice(afterRow+1, 0, newInstance);
}


XModel.prototype.getNewListItemInstance = function (modelItem) {
	var listItem = modelItem.listItem;
	if (listItem == null) return "";
	return this.getNewInstance(listItem);
}

XModel.prototype.getNewInstance = function (modelItem) {
	if (modelItem.defaultValue != null) return modelItem.defaultValue;
	
	var type = modelItem.type;
	switch (type) {
		case _STRING_:
			return "";

		case _NUMBER_:
			return 0;
			
		case _OBJECT_:
			var output = {};
			if (modelItem.items) {
				for (var i = 0; i < modelItem.items.length; i++) {
					var subItem = modelItem.items[i];
					if (subItem.ref) {
						output[subItem.ref] = this.getNewInstance(subItem);
					} else if (subItem.id) {
						output[subItem.id] = this.getNewInstance(subItem);
					}
				}
			
			}
			return output;
			
		case _LIST_:
			return [];

		case _DATE_:
		case _TIME_:
		case _DATETIME_:
			return new Date();
			
		default:
			return "";
	}
}



// "modelItem" is a pointer to a modelItem, or an path as a string
XModel.prototype.removeRow = function (instance, path, instanceNum) {
	var list = this.getInstanceValue(instance, path);
	if (list == null) return;

	// WHAT IF LIST IS A STRING?
	list.splice(instanceNum, 1);
}






// for speed, we create optimized functions to traverse paths in the instance
//	to actually return values for an instance.  Make them here.
//
XModel.prototype._getPathGetter = function (path) {
//DBG.println("_getPathGetter(",path,")");
	var getter = this._pathGetters[path];
	if (getter != null) return getter;

	getter = this._makePathGetter(path);
//DBG.println("assigning path getter for ", path, " to ", getter);
	this._pathGetters[path] = getter;
	return getter;
}

XModel.prototype._getParentPathGetter = function (path) {
//DBG.println("_getParentPathGetter(",path,")");
	var getter = this._parentGetters[path];
	if (getter != null) return getter;
	
	var parentPath = this.getParentPath(path).join(this.pathDelimiter);
	getter = this._getPathGetter(parentPath);
	this._parentGetters[path] = getter;
	this._pathGetters[parentPath] = getter;
	return getter;
}


XModel.prototype._makePathGetter = function (path) {
	if (path == null) return new Function("return null");
	
	// normalizePath() converts to an array, fixes all "." and ".." items, and changes [x]  to #x
	var pathList = this.normalizePath(path);

	// forget any leading slashes
	if (pathList[0] == "") pathList = pathList.slice(1);
	
//	DBG.println("_makePathGetter(", path, "): ", pathList);
	var methodSteps = [];
	var pathToStep = "";
	
	for (var i = 0; i < pathList.length; i++) {
		var	pathStep = pathList[0, i];
		
		if (pathStep.charAt(0) == "#") {
			pathStep = pathStep.substr(1);
			pathToStep = pathToStep + "#";
		} else {
			pathToStep = pathToStep + pathStep;

		}
		var	modelItem = this.getItem(pathToStep, true);
		var ref = modelItem.ref;

		// convert "/" to "." in the ref
		if (ref.indexOf(this.pathDelimiter) > -1) ref = ref.split(this.pathDelimiter).join(".");

		if (modelItem.getter) {
			var getter = modelItem.getter;
			var scope = modelItem.getterScope;
			if (scope == _INHERIT_) {
				scope = this.getterScope;
			}
			
			if (scope == _INSTANCE_) {
				methodSteps.push("if(instance) {");	
				methodSteps.push("	current = instance."+ getter+ "(current, '"+ref+"');");
				methodSteps.push("}");							
			} else if (scope == _MODEL_) {
				methodSteps.push("current = this."+ getter+ "(instance, current, '"+ref+"');");
			} else {
				methodSteps.push("current = this.getItem(\""+ pathToStep+ "\")."+ getter+ "(instance, current, '"+ref+"');");			
			}
			
		} else if (ref == "#") {
			methodSteps.push("if(current) {");	
			methodSteps.push("	current = current[" + pathStep + "];");
			methodSteps.push("}");					
		} else {
			methodSteps.push("if(current) {");		
			methodSteps.push("	current = current." + ref + ";");
			methodSteps.push("}");					
		}
		pathToStep += this.pathDelimiter;
	}

	var methodBody = AjxBuffer.concat(
			"try {\r",
			"var current = instance;\r",
			"\t", methodSteps.join("\r\t"), "\r",
			"} catch (e) {\r ",
			"	DBG.println('Error in getting path for \"", path, "\": ' + e);\r",
			"	current = null;\r",
			"}\r",
			"return current;\r"
		);
	//DBG.println(path,"\r\t", methodSteps.join("\r\t"), "\r");
	var method = new Function("instance", methodBody);

	return method;
}








// error messages
//	NOTE: every call to XModel.prototype.registerError() should be translated!

XModel._errorMessages = {};
XModel.registerErrorMessage = XModel.prototype.registerErrorMessage = function (id, message) {
	this._errorMessages[id] = message;
}
XModel.registerErrorMessage("unknownError", "Unknown error.");
XModel.prototype.defaultErrorMessage = "unknownError";


// set the default error message for the model (it's not a bad idea to override this in your models!)
XModel.prototype.getDefaultErrorMessage = function (modelItem) {
	if (modelItem && modelItem.errorMessage) {
		return modelItem.getDefaultErrorMessage();
	}

	return this.defaultErrorMessage;
}

XModel.prototype.getErrorMessage = function (id, arg0, arg1, arg2, arg3, arg4) {
	var msg = this._errorMessages[id];
	if (msg == null) msg = XModel._errorMessages[id];
	
	if (msg == null) {
		DBG.println("getErrorMessage('", id, "'): message not found.  If this is an actual error message, add it to the XModel error messages so it can be translated.");
		return id;
	}
	if (arg0 !== null) msg = msg.split("{0}").join(arg0);
	if (arg1 !== null) msg = msg.split("{1}").join(arg1);
	if (arg2 !== null) msg = msg.split("{2}").join(arg2);
	if (arg3 !== null) msg = msg.split("{3}").join(arg3);
	if (arg4 !== null) msg = msg.split("{4}").join(arg4);
	return msg;
}
