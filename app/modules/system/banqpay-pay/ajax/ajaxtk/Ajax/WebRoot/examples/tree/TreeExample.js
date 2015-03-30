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


function TreeExample(parent) {
	// Create the Tree. Note that we assign an Absolute position to the tree since it is a direct 
	// child of DwtShell, and the veils in DwtShell are absolutely positioned. Therefore if we made this
	// statically positioned, we would never see it!
	this._tree = new DwtTree(parent, null, null, DwtControl.ABSOLUTE_STYLE);
	
	// Set the bounds of the tree. We want it anchored at (0, 0), and we want it to cover the 
	// whole browser display
	this._tree.setBounds(0, 0, Dwt.DEFAULT, "100%");
	
	// Add the tree items to the tree
	this._addItems();
	
	// Add a selection listener to the tree. This listener will be called anytime a tree item is selected
	this._tree.addSelectionListener(new AjxListener(this, this._treeListener));
	
	
	// Make the tree visible. Specifically this moves the tree to the right "layer" (i.e. above the
	// shell overlays)
	this._tree.zShow(true);
}

TreeExample.run =
function() {
	// Create the shell
	var shell = new DwtShell("MainShell");
	new TreeExample(shell);
}

// Create the departments and the employees
TreeExample.prototype._addItems =
function() {
	// Create a drag source so that tree items may be dragged
	var ds = this._dragSrc = new DwtDragSource(Dwt.DND_DROP_MOVE);
	
	// Add a drag listener to the drag target
	ds.addDragListener(new AjxListener(this, this._dragListener));
	
	// Create a drop target. We will allow only departments to be drop targets and of course only
	// DwtTreeItems can be transfer types - hence DwtTreeItem being the parameter passed to DwtDropTarget
	var dt = new DwtDropTarget(DwtTreeItem);
	
	// We are going to add a drop listener to the drop target
	dt.addDropListener(new AjxListener(this, this._dropListener));
	
	// Create the accounting department, and add employees under that department
	var accountingGroup = new DwtTreeItem(this._tree);
	accountingGroup.setText("Accounting");
	accountingGroup.setImage("Group");
	accountingGroup.setData("DEPT", "Accounting");
	accountingGroup.setDropTarget(dt);
	accountingGroup.setToolTipContent("Accounting Department");
	
	// The image and icon for an item can be set at instantiation time. This is more convenient so we will
	// do it from now on
	var person = new DwtTreeItem(accountingGroup, null, "Bob Brown", "Person");
	person.setDragSource(ds);
	person.setData("EMPINFO", {name: "Bob Brown", id: 987261, dept: "Accounting"});
	person.setToolTipContent("<b>ID: </b>987261");
	
	person = new DwtTreeItem(accountingGroup, null, "Shannon Connors", "Person");
	person.setDragSource(ds);
	person.setData("EMPINFO", {name: "Shannon Connors", id: 985472, dept: "Accounting"});
	person.setToolTipContent("<b>ID: </b>985472");
	
	person = new DwtTreeItem(accountingGroup, null, "Amy Johnson", "Person");
	person.setDragSource(ds);
	person.setData("EMPINFO", {name: "Amy Johnson", id: 988754, dept: "Accounting"});
	person.setToolTipContent("<b>ID: </b>988754");
	
	person = new DwtTreeItem(accountingGroup, null, "John Smith", "Person");
	person.setDragSource(ds);
	person.setData("EMPINFO", {name: "John Smith", id: 985436, dept: "Accounting"});
	person.setToolTipContent("<b>ID: </b>985436");
	
	// Expand the accounting node
	accountingGroup.setExpanded(true); 
	
	// Create the accounting department, and add employees under that department
	var engineeringGroup = new DwtTreeItem(this._tree, null, "Engineering", "Group");
	engineeringGroup.setData("DEPT", "Engineering");
	engineeringGroup.setDropTarget(dt);
	engineeringGroup.setToolTipContent("Engineering Department");
	
	var person = new DwtTreeItem(engineeringGroup, null, "Dale Armstrong", "Person");
	person.setDragSource(ds);
	person.setData("EMPINFO", {name: "Dale Armstrong", id: 989075, dept: "Engineering"});
	person.setToolTipContent("<b>ID: </b>989075");
	
	person = new DwtTreeItem(engineeringGroup, null, "Carolynn Bartsworth", "Person");
	person.setDragSource(ds);
	person.setData("EMPINFO", {name: "Carolynn Bartsworth", id: 985776, dept: "Engineering"});
	person.setToolTipContent("<b>ID: </b>985776");
	
	person = new DwtTreeItem(engineeringGroup, null, "Sheryl Davis", "Person");
	person.setDragSource(ds);
	person.setData("EMPINFO", {name: "Sheryl Davis", id: 9878741, dept: "Engineering"});
	person.setToolTipContent("<b>ID: </b>9878741");
	
	person = new DwtTreeItem(engineeringGroup, null, "Steve Patterson", "Person");
	person.setDragSource(ds);
	person.setData("EMPINFO", {name: "Steve Patterson", id: 987778, dept: "Engineering"});
	person.setToolTipContent("<b>ID: </b>987778");
	
	person = new DwtTreeItem(engineeringGroup, null, "Paul Rogers", "Person");
	person.setDragSource(ds);
	person.setData("EMPINFO", {name: "Paul Rogers", id: 988701, dept: "Engineering"});
	person.setToolTipContent("<b>ID: </b>988701");
	
	person = new DwtTreeItem(engineeringGroup, null, "Ivan Whittingham", "Person");
	person.setDragSource(ds);
	person.setData("EMPINFO", {name: "Ivan Whittingham", id: 989987, dept: "Engineering"});
	person.setToolTipContent("<b>ID: </b>989987");
	
	// Expand the engineering node
	engineeringGroup.setExpanded(true); 
}

// This is the listener for events on the tree items
TreeExample.prototype._treeListener =
function(ev) {
	// The event that is passed in here is of type DwtSelectionEvent. The item field of the event
	// will contain a reference to the tree item that was selected. The detail will be one of:
	// DwtTree.ITEM_SELECTED - Item was selected
	// DwtTree.ITEM_DESELECTED - Item was deselected
	// DwtTree.ITEM_CHECKED - Item was checked (in the case of checked items)
	// DwtTree.ITEM_ACTIONED - Item was actioned (i.e. right mouse click)
	// DwtTree.ITEM_DBL_CLICKED - Item was double clicked

	var action = "";	
	switch (ev.detail) {
		case DwtTree.ITEM_SELECTED:
			action = "Selected";
			break;
		case DwtTree.ITEM_DESELECTED:
			action = "Deselected";
			break;
		case DwtTree.ITEM_CHECKED:
			action = "Checked";
			break;
		case DwtTree.ITEM_ACTIONED:
			action = "Actioned";
			break;
		case DwtTree.ITEM_DBL_CLICKED:
			// Won't see this one unless ITEM_SELECTED and default are commented out
			action = "Double Clicked";
			break;
		default:
			action = "[UNKNOWN ACTION]"
	}

	if (action) {
		// Uncomment below to get alerts when any tree action is performed
		//var alertTxt = ev.item.getText() + " was " + action;
		//alert(alertTxt);
	}
}

DwtDragEvent.DRAG_START = 1;
DwtDragEvent.SET_DATA = 2;
DwtDragEvent.DRAG_END = 3;

// Listener for drag events. I.e. employees can be dragged
TreeExample.prototype._dragListener =
function(ev) {
	/* The drop event has several fields:
	 * operation - Is it a move or a copy
	 * srcControl - The source i.e. an employee
	 * action - Current action. May be one of:
	 *	DwtDragEvent.DRAG_START - Starting drag operation
	 *	DwtDragEvent.SET_DATA - Request to set srcData field of event
	 * 	DwtDragEvent.DRAG_END - Drag operation is ending
	 * srcData - The source data
	 * doIt - We are responsible for setting this to true if we want the op to proceed */

	if (ev.action == DwtDragEvent.SET_DATA) {
		// We have been asked to set the data for the node that is being dragged.
		ev.srcData = ev.srcControl.getData("EMPINFO");
	} else if (ev.action == DwtDragEvent.DRAG_END) {
		// The drag/drop operation was successful, the employee was transferred. We can dispose of 
		// his/her node in the old department
		ev.srcControl.dispose();
	}
}


// Listener for drop events. I.e. employees being dropped onto departments
TreeExample.prototype._dropListener =
function(ev) {
	/* The drop event has several fields:
	 * operation - Is it a move or a copy
	 * targetControl - The drop target i.e. a department
	 * action - Current action. May be one of:
	 *	DwtDropEvent.DRAG_ENTER - The source is entering the targetControl
	 *	DwtDropEvent.DRAG_LEAVE - The source is leaving the targetControl
	 * 	DwtDropEvent.DRAG_OP_CHANGED - Operation changed (e.g. from move -> copy - not currently supported)
	 *	DwtDropEvent.DRAG_DROP - The actual drop i.e. the mouse button has been released
	 * srcData - The actual source data
	 * doIt - We are responsible for setting this to true if we want the op to proceed */

	if (ev.action == DwtDropEvent.DRAG_ENTER) {
		// Need to make sure that we are not dragging an employee onto his/her existing dept. 
		if (ev.srcData.dept == ev.targetControl.getData("DEPT"))
			ev.doIt = false;
	} else	if (ev.action == DwtDropEvent.DRAG_DROP) {
		/* We have ended up with a successful drop. We need to create a new node and populate it with
		 * the information of the employee who is being transferred */
		var data = ev.srcData;
		data.dept = ev.targetControl.getData("DEPT");
		var clone = new DwtTreeItem(ev.targetControl, null, data.name, "Person");
		clone.setData("EMPINFO", data);
		clone.setDragSource(this._dragSrc);
		clone.setToolTipContent("<b>ID: </b>" + data.id);
	}
}
