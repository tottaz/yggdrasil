<!-- 
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

-->
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>Mixing Dwt with existing HTML</title>
    <style type="text/css">
      <!--
        @import url(../common/img/hiRes/dwtimgs.css);
        @import url(img/hiRes/imgs.css);
        @import url(MixingExample.css);
      -->
    </style>
   	
    <jsp:include page="../Messages.jsp"/>
    <jsp:include page="../Ajax.jsp"/>
    <script type="text/javascript" src="MixingExample.js"></script>
  </head>
    <body>
	    <noscript><p><b>Javascript must be enabled to use this.</b></p></noscript>
	    <script language="JavaScript"> 
	    
	    	shell = null;
	    	menu = null;
	    	
	    	function doIt() {
	   			DBG = new AjxDebug(AjxDebug.DBG1, null, false);
	   			
	   			/* We always have to create a DwtShell as the root of our component
	   			 * hierarchy and does some handy things for us.
	   			 */
				shell = new DwtShell("MainShell", false, null, null, true);
				
				/* Setting the shell to be virtual tells it that it should remain hidden.
				 * Direct children of the shell will actually have their HTML elements
				 * reparented to the body element. This is handy when we want to mix
				 * components in with existing HTML content
				 */ 
				shell.setVirtual();
				
				/* Now we will create a couple of buttons and insert them in the table
				 * that is part of the HTML content below
				 */
				var l = new AjxListener(null, buttonListener);
				var b = new DwtButton(shell);
				b.addSelectionListener(l);
				b.setText("Button1");
				/* DwtControl has a new method, reparentHtmlElement. If a string is
				 * passed to this method, it will look up the element with that id.
				 * and reparent to it. If an HTML element is passed it, then it will 
				 * be used as the new parent
				 */
				b.reparentHtmlElement("R1C1");
		
				b = new DwtButton(shell);
				b.addSelectionListener(l);
				b.setText("Button2");
				b.reparentHtmlElement("R2C2");				
		    }
		    
		    function buttonListener(ev) {
		    	alert("Button Pressed: " + ev.item.getText());
		    }
		    
		    /* This function below will get called when the user hovers over 
		     * div with id "TREE_DIV" in the HTML below
		     */
		    function createTree(id) {
		    
		    	// First create the tree	    	
				var t = new DwtTree(shell);
				
				/* Add a selection listener to the tree so that it will be called
				 * anytime a tree item is clicked on
				 */
				t.addSelectionListener(new AjxListener(null, treeListener));
				
				// Now add a bunch of nodes to the tree
				var ti = new DwtTreeItem(t);
				ti.setText("Node 1");
				var ti1 = new DwtTreeItem(ti);
				ti1.setText("Node 1A");
				ti1 = new DwtTreeItem(ti);
				ti1.setText("Node 1B");
				
				ti = new DwtTreeItem(t);
				ti.setText("Node 2");				
				ti1 = new DwtTreeItem(ti);
				ti1.setText("Node 2A");
				ti1 = new DwtTreeItem(ti);
				ti1.setText("Node 1B");
				ti1 = new DwtTreeItem(ti);
				ti1.setText("Node 2C");
				
				ti = new DwtTreeItem(t);
				ti.setText("Node 3");
				
				// Get the div into which we want to place the tree
				var div = document.getElementById(id);
				
				// Clean out any content
				div.innerHTML = "";
				
				/* Kill the mouseover handler so this function does not get
				 * called again
				 */
				div.onmouseover = null;
				
				// Reparent the tree's HTML element to the div
				t.reparentHtmlElement(div);
				
				/* Create the menu that will be poppped up when a tree item
				 * is selected
				 */
				createMenu();					
		    }
		    
		    /* This function creates the menu that will be popped up when
		     * a node in the tree is selected
		     */
		    function createMenu() {
		    	/* Create the menu. Since it is a child of the shell, and 
		    	 * the shell is a virtual shell, it's HTML element will 
		    	 * automatically get reparented to the body element so that
		    	 * when it pops up everything will be good
		    	 */
				menu = new DwtMenu(shell);
				
				// Create the menu item listener
				var l = new AjxListener(null, menuListener);
				
				// Add some menu items
				var mi = new DwtMenuItem(menu);
				mi.setText("Menu Item 1");
				mi.addSelectionListener(l);
				
				mi = new DwtMenuItem(menu);
				mi.setText("Menu Item 2");
				mi.addSelectionListener(l);
				
				// Create a menu with a submenu
				mi = new DwtMenuItem(menu);
				mi.setText("Menu Item 3");
				mi.addSelectionListener(l);
				var menu2 = new DwtMenu(mi);
				mi.setMenu(menu2);
				mi = new DwtMenuItem(menu2);
				mi.setText("Menu Item 3A");
				mi.addSelectionListener(l);
				mi = new DwtMenuItem(menu2);
				mi.setText("Menu Item 3B");
				mi.addSelectionListener(l);
			}
								
		    
		    // When a node in the tree is clicked, pop up the menu! 
		    function treeListener(ev) {
		    	menu.popup(0, ev.docX, ev.docY);
		    }
		    
		    // When a menu item is selected, popup an alert
		    function menuListener(ev) {
		    	alert("Menu Item Selected: " + ev.item.getText());
		    }
		    
		    // Kick it all of when the page below loads
	        AjxCore.addOnloadListener(doIt);
	    </script>
	    
	    <h1>This Example Demonstrates Mixing Dwt with Existing HTML</h1>
	    <h4>Check out the table below. It has DwtButton objects in it!</h4>
	    <p/>
		<table border=1 width='100%'> 
		    <tr>
		       <td id='R1C1'></td><td id='R1C2'>R1C2</td>
		    </tr>
		    <tr>
		       <td id='R2C1'>R2C1</td><td id='R2C2'></td>
		    </tr>
		</table>
	    <p/>
	    <h4>The table above has DwtButton objects in it!</h4>
	    <h4>Hover over the node below and a DwtTree will appear.</h4>
	    <hr/>
	    <div style='width:100px;height150px;background-color:red;' id='TREE_DIV' onmouseover='javascript:createTree("TREE_DIV");'>MOUSE OVER ME!!!</div>
	    <hr/>
	    <h4>Click on a node in the tree and a menu will popup</h4>
    </body>
</html>

