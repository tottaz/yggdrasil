function XFormExample() {
	
}

XFormExample.myXModel = {
	items: [
		{id:"lastName", type:_STRING_},
		{id:"email", type:_STRING_, pattern:AjxUtil.EMAIL_RE},		
		{id:"children", type:_LIST_, 
			listItem:
				{type:_OBJECT_, 
					items: [
						{id:"firstName", type:_STRING_},
						{id:"lastName", type:_STRING_},
						{id:"age", type:_NUMBER_}
					]
				}
		},
		{id:"she", type:_OBJECT_, 
			items: [
				{id:"firstName", type:_STRING_},
				{id:"lastName", type:_STRING_, getter:"getSpouseLastName", getterScope:_MODEL_},
				{id:"email", type:_STRING_, pattern:AjxUtil.EMAIL_RE}
			]
		},
		{id:"he", type:_OBJECT_, 
			items: [
				{id:"firstName", type:_STRING_},
				{id:"lastName", type:_STRING_, getter:"getSpouseLastName", getterScope:_MODEL_},
				{id:"email", type:_STRING_, pattern:AjxUtil.EMAIL_RE}
			]
		}
	]
}

XFormExample.getSpouseLastName = function (instance, obj) {
	if(obj && obj.lastName)
		return obj.lastName;
	else if (instance && instance.lastName)
		return instance.lastName;
}

XFormExample.setInstance1 = function () {
	var dataInstance = {she:{},he:{}};
	dataInstance.lastName = "Doe";	
	dataInstance.children = [{firstName:"Bobby", age:3},{firstName:"Anna", age:2}];
	dataInstance.she = {firstName:"April", lastName:"Straus"};
	dataInstance.he.firstName = "John";	
	this.getForm().setInstance(dataInstance);
}

XFormExample.setInstance2 = function () {
	var dataInstance = {she:{},he:{}};
	dataInstance.lastName = "Garibaldi";	
	dataInstance.children = [{firstName:"Robert", age:7},{firstName:"Antony", age:10}];
	dataInstance.she = {firstName:"Malena"};
	dataInstance.he.firstName = "Jim";
	this.getForm().setInstance(dataInstance);
}


XFormExample.myXForm = {
	numCols:2,
	items :[
		{type:_TEXTFIELD_,ref:"lastName", label:"Family Name:", align:_LEFT_},
		{type:_SEPARATOR_, colSpan:2},
		{type:_GROUP_, numCols:6, colSpan:2,
			items: [
			
				{type:_GROUP_, ref:"he",numCols:2,label:"He:",
					items:[
						{type:_TEXTFIELD_, ref:"firstName", label:"First Name"},
						{type:_TEXTFIELD_,ref:"lastName", label:"Last Name:"},
						{type:_TEXTFIELD_,ref:"email", label:"Email:"}
					]
				},
				{type:_GROUP_, ref:"she",label:"She:",
					items:[
						{type:_TEXTFIELD_, ref:"firstName", label:"First Name"},
						{type:_TEXTFIELD_,ref:"lastName", label:"Last Name:"},
						{type:_TEXTFIELD_,ref:"email", label:"Email:"}
					]
				}				
			]
		},
		{type:_SEPARATOR_, colSpan:2},
		{type:_REPEAT_, ref:"children",label:"Children", colSpan:2,showAddButton:true, showRemoveButton:true,showAddOnNextRow:false,
			items:[
				{type:_TEXTFIELD_, ref:"firstName", label:"First Name:"},
				{type:_TEXTFIELD_,ref:"age", label:"Age:"},
			]
		}, 
		{type:_SEPARATOR_, colSpan:2},
		{type:_GROUP_, numCols:1, 
			items: [
				{type:_DWT_BUTTON_, ref:".", onActivate:XFormExample.setInstance1,cssStyle:"color:red",cssClass:"", label:"Doe"},
				{type:_DWT_BUTTON_, ref:".", onActivate:XFormExample.setInstance2, label:"Garibaldi"},
				{type:_BUTTON_, label:"HTML button"}
			]
		}
	]
}

XFormExample.prototype.run = function () {
	var shell = new DwtShell("MainShell", false, null, null, true);	

	var dataInstance = new Object();
	dataInstance.firstName = "John";
	dataInstance.lastName = "Doe";	
	dataInstance.children = [];
	dataInstance.spouse = {};

   // Create a composite to hold the HTML and the buttons. 
	var comp = new DwtComposite(shell, null, DwtControl.ABSOLUTE_STYLE);
	comp.setBounds(50, 50, 400, 400);

    // Get the HTML element and populate it with some HTML. In this case a 2x2
    // table. We are going to put buttons in R1C1 & R2C2
	var html = comp.getHtmlElement();
	html.innerHTML = [
	  "<table border=1 width='100%'>", 
		"<tr><td id='FormCell'></td></tr>",	  
	  "</table>"].join("");
	  
	// zShow moves comp to the visible layer in the shell. Again if we nuked the layers on the shell
	// we could statically position comp (i.e. allow the browser to do the layout) and would never have to
	// call zShow
	comp.zShow(true);

	var formContainer = new DwtComposite(comp);	
	
	this._localXModel = new XModel(XFormExample.myXModel);
	this._localXModel.getSpouseLastName = XFormExample.getSpouseLastName;
	this._localXForm = new XForm(XFormExample.myXForm, this._localXModel, null, formContainer);
	this._localXForm.draw();	
	this._localXForm.setInstance(this.dataInstance);
	document.getElementById("FormCell").appendChild(formContainer.getHtmlElement());	
}