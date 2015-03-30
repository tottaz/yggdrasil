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


/**
* Creates a callback which consists of at least a function reference, and possibly also
* an object to call it from.
* @constructor
* @class
* This class represents a callback function which can be called standalone, or from a
* given object. What the callback takes as arguments and what it returns are left to the
* client.
*
* @author Conrad Damon
* @param obj	[Object]				the object to call the function from
* @param func	[function]				the callback function
* @param args   [primitive or Array]	default arguments
*/
function AjxCallback(obj, func, args) {
	if (arguments.length == 0) return;

	this.obj = obj;
	this.func = func;
	this.args = args;
}

AjxCallback.prototype.toString =
function() {
	return "AjxCallback";
}

/**
* Runs the callback function, from within the object if there is one. The
* called function passed arguments are the concatenation of the argument
* array passed to this object's constructor and the argument array passed
* to the <code>run</code> method. Whatever the called function returns is
* returned to the caller.
*
* @param arg1	The first argument which will be appended to the argument
*				array passed to this object's constructor. Any number of
*				arguments may be passed to the <code>run</code> method.
*/
AjxCallback.prototype.run =
function(/* arg1 ... argN */) {
	// combine original args with new ones
	var args = [];

	// sometimes we want to pass a null or false argument, so simply
	// checking for if (this.args) won't do.
	if (typeof this.args != "undefined") {
		if (this.args instanceof Array)
			// NOTE: We must NOT use this.args directly if this method's
			//       params are gonna be pushed onto the array because it
			//       will change the original args!
			args = arguments.length > 0 ? args.concat(this.args) : this.args;
		else
			args.push(this.args);
	}

	for (var i = 0; i < arguments.length; ++i)
		args.push(arguments[i]);

	// invoke function
	return this.func.apply(this.obj || window, args);
};

/**
 * The following function is what an AjxCallback should be *all* about.  It
 * returns a plain function that will call your supplied "func" in the context
 * of "obj" and pass to it, in this order, any additional arguments that you
 * pass to simpleClosure and the arguments that were passed to it at the call
 * time.
 *
 * An example should do:
 *
 *   div.onclick = AjxCallback.simpleClosure(this.handler, this, "some data");
 *   ...
 *   this.handler = function(data, event) {
 *      // event will be passed for DOM2 compliant browsers
 *      // and data is "some data"
 *   };
 *
 * [this is one of the most useful functions I ever wrote :D  -mihai@zimbra.com]
 */
AjxCallback.simpleClosure = function(func, obj) {
	var args = [];
	for (var i = 2; i < arguments.length; ++i)
		args.push(arguments[i]);
	return function() {
		var args2 = [];
		for (var i = 0; i < arguments.length; ++i)
			args2.push(arguments[i]);
		func.apply(obj || this, args.concat(args2));
	};
};
