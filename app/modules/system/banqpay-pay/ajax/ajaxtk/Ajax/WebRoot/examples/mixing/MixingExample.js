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


/* This simple example shows how you can mix Dwt components with plain HTML */

function MixingExample(parent) {
	
	// Because the shell has the notion of "layers" elements position directly on
	// the shell must be absolutely positioned. Of course we could nuke the layers
	// on the shell with a simple parent.getHtmlElement().innerHTML = "", and then
	// happily use statically positioned elements on the shell. in this case the code
	// would look like:
	//
	//  parent.innerHTML = "";
	//  var comp = new DwtComposite(parent);
	//  comp.setSize(400, 400); (can't set x & y on a statically position element)
	//  ...
	//  

    // Create a composite to hold the HTML and the buttons. 
	var comp = new DwtComposite(parent, null, DwtControl.ABSOLUTE_STYLE);
	comp.setBounds(50, 50, 400, 400);

    // Get the HTML element and populate it with some HTML. In this case a 2x2
    // table. We are going to put buttons in R1C1 & R2C2
	var html = comp.getHtmlElement();
	html.innerHTML = [
	  "<table border=1 width='100%'>", 
	    "<tr>",
	       "<td id='R1C1'></td><td id='R1C2'>R1C2</td>",
	    "</tr>",
	    "<tr>",
	       "<td id='R2C1'>R2C1</td><td id='R2C2'></td>",
	    "</tr>",
	  "</table>"].join("");
	  
	// zShow moves comp to the visible layer in the shell. Again if we nuked the layers on the shell
	// we could statically position comp (i.e. allow the browser to do the layout) and would never have to
	// call zShow
	comp.zShow(true);

    // Now we create the buttons. Note that since we do not specify any positioning
    // the buttons will be "statically" positioned. This means they will be rendered
    // by the browser in the browser flow
	var b = new DwtButton(comp);
	b.setText("Button1");
	document.getElementById("R1C1").appendChild(b.getHtmlElement());	
	
	var b = new DwtButton(comp);
	b.setText("Button2");
	document.getElementById("R2C2").appendChild(b.getHtmlElement());	
}

MixingExample.run =
function() {
	// Create the shell
	var shell = new DwtShell("MainShell", false, null, null, true);
	new MixingExample(shell);
}

