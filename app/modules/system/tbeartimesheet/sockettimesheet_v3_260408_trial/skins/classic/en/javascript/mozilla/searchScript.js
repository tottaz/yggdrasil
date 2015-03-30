// JavaScript Document

var cloneID = 1;
var queryGen = '';
var searchNoValue = false;

function createOptions(obj,selectID) {
	document.getElementById(selectID).options.length = 0;

	var calIDArr = obj.id.split('_');

	document.getElementById('calendarField_' + calIDArr[1]).style.display='none';
	document.getElementById('selectKeyQueryText_'+calIDArr[1]).readOnly="";
	document.getElementById('selectKeyQueryText_'+calIDArr[1]).value="";
	if(obj.options[obj.selectedIndex ].title == 'date') {
		document.getElementById('calendarField_'+calIDArr[1]).style.display='';
		document.getElementById('selectKeyQueryText_'+calIDArr[1]).readOnly="readonly";
		Calendar.setup(
			{
				inputField 	: 	"selectKeyQueryText_"+calIDArr[1],
				ifFormat	:	"y-mm-dd",
				button		:	"calendarField_"+calIDArr[1]	
			}
		);

	}	
	if(obj.options[obj.selectedIndex ].title == 'number') {
		document.getElementById(selectID).options[0] = new Option('equal to','=');    
		document.getElementById(selectID).options[1] = new Option('not equal to','<>');    
		document.getElementById(selectID).options[2] = new Option('more than','>');    
		document.getElementById(selectID).options[3] = new Option('more or same as','>=');    
		document.getElementById(selectID).options[4] = new Option('less than','<');    
		document.getElementById(selectID).options[5] = new Option('less or same as','<=');     
	} 
	else if(obj.options[obj.selectedIndex].title == 'string' || !obj.options[obj.selectedIndex].title) {
		document.getElementById(selectID).options[0] = new Option('contains','LIKE');    
		document.getElementById(selectID).options[1] = new Option('does not contain','NOT LIKE');    
		document.getElementById(selectID).options[2] = new Option('equal to','=');    
		document.getElementById(selectID).options[3] = new Option('not equal to','<>');     
	}
	else if(obj.options[obj.selectedIndex ].title == 'date') {
		document.getElementById(selectID).options[0] = new Option('equal to','=');    
		document.getElementById(selectID).options[1] = new Option('not equal to','<>');    
		document.getElementById(selectID).options[2] = new Option('more than','>');    
		document.getElementById(selectID).options[3] = new Option('more or same as','>=');    
		document.getElementById(selectID).options[4] = new Option('less than','<');    
		document.getElementById(selectID).options[5] = new Option('less or same as','<=');     
	} 
}

function jsQuery(obj) {
	var objID = obj.id.split('_');
	var selectID = objID[0]+'QueryOption_'+objID[1];
	var textID =  objID[0]+'QueryText_'+objID[1];
	
	//SELECT BOX DYNAMIC CREATION
	var inputSelect = document.createElement('select');
	inputSelect.setAttribute('id',selectID);

	//TEXT BOX DYNAMIC CREATION
	var inputText = document.createElement('input');
	inputText.setAttribute('id',textID);
	inputText.setAttribute('type','text');

	createOptions(obj,selectID);			
}

function changeID(obj,idCount) {
	if(obj.id == 'deleteImg_'+cloneID) {
		obj.setAttribute('id','deleteImg_'+idCount);
		obj.setAttribute('name','deleteImg_'+idCount);
		obj.style.display='';
	}
	else if(obj.id == 'connector_'+cloneID) {
		obj.setAttribute('id','connector_'+idCount);
		obj.setAttribute('name','connector_'+idCount);
		obj.style.display='';
		obj.disabled=false;
	}
	else if(obj.id == 'selectKey_'+cloneID) {
		obj.setAttribute('id','selectKey_'+idCount);
		obj.setAttribute('name','selectKey_'+idCount);
	}
	else if(obj.id == 'selectKeyQueryOption_'+cloneID) {
		obj.setAttribute('id','selectKeyQueryOption_'+idCount);
		obj.setAttribute('name','selectKeyQueryOption_'+idCount);
	}
	else if(obj.id == 'selectKeyQueryText_'+cloneID) {
		obj.setAttribute('id','selectKeyQueryText_'+idCount);
		obj.setAttribute('name','selectKeyQueryText_'+idCount);
		obj.setAttribute('value','');
	}
	else if(obj.id == 'calendarField_'+cloneID) {
		obj.setAttribute('id','calendarField_'+idCount);
		obj.setAttribute('name','calendarField_'+idCount);
	}

	if(obj.hasChildNodes()) {
		for(var i=0; i < obj.childNodes.length; i++) {
			changeID(obj.childNodes[i],idCount);
		}
	}
}

function createField(nodeObj) {
	var idCount = parseInt(document.getElementById('totalFields').value) + 1;
	document.getElementById('totalFields').value = idCount;

	var clonedNode = nodeObj.cloneNode(true);
	clonedNode.setAttribute('id','searchMain_'+idCount);
	nodeObj.parentNode.appendChild(clonedNode);

	changeID(clonedNode,idCount);
	createOptions(document.getElementById('selectKey_'+idCount),'selectKeyQueryOption_'+idCount);
}

function deleteField(imgID) {
	if(confirm('Are You Sure?')) {
		var fieldIDArr = imgID.split('_');
		var fieldID = 'searchMain_'+fieldIDArr[1];
		var fieldObj = document.getElementById(fieldID);
		fieldObj.parentNode.removeChild(fieldObj);
	}
}
function queryAJAX(obj) {
	queryGen = '';
	searchNoValue = false;
	verifyFields(obj);
	document.getElementById('queryGen').value=queryGen;
	if(searchNoValue) {
		alert('Enter Value In Search Parameter');
	}
	else {
		ajaxMain(document.forms[0],'searchDB');
	}
}

function verifyFields(obj) {
	//SKIP FOR FIELD 1
	if(obj.nodeName.toLowerCase() == 'select' && obj.disabled) {
		if(obj.options[obj.selectedIndex ].value.toLowerCase() == 'or' || obj.options[obj.selectedIndex ].value.toLowerCase() == 'and') {
			if(document.getElementById('searchModifier'))
				queryGen = document.getElementById('searchModifier').value+' ';
			else
				queryGen = 'WHERE ';
		}	
	}	
	else if(obj.nodeName.toLowerCase() == 'select' && !obj.disabled) {
		queryGen = queryGen + obj.options[obj.selectedIndex ].value+' ';
	}	
	if(obj.type == 'text') {
		var fieldIDArr = obj.id.split('_');
		var selectedOption = document.getElementById('selectKeyQueryOption_'+fieldIDArr[1]);
		if(selectedOption.options[selectedOption.selectedIndex].value == 'LIKE' || selectedOption.options[selectedOption.selectedIndex].value == 'NOT LIKE') {
			queryGen = queryGen + "'%"+filterNum(obj.value)+"%'"+" ";
		}
		else {
			queryGen = queryGen +"'"+filterNum(obj.value)+"'"+" ";
		}	
	}	
	if(obj.type == 'text' && !obj.value) {
		searchNoValue = true;
		obj.focus();
		queryGen = '';
		return false;
	}	
	if(obj.hasChildNodes()) {
		for(var i=0; i < obj.childNodes.length; i++) {
			verifyFields(obj.childNodes[i]);
		}
	}
}

function onkeypressTrap(obj) {
	var fieldIDArr = obj.id.split('_');
	if(document.getElementById('selectKey_'+fieldIDArr[1]).options[document.getElementById('selectKey_'+fieldIDArr[1]).selectedIndex].title == 'number') {
		return keyPress(event,'number');
	}
	else //alphanumeric only
		return keyPress(event,'normaltext');
}

function searchContent(obj) {
	if(obj.checked) {
		obj.parentNode.className = 'searchmode';
		document.getElementById('search_content').style.display = '';
	}
	else {
		obj.parentNode.className = 'listingmode';
		document.getElementById('queryGen').value='';
		document.getElementById('search_content').style.display = 'none';
		ajaxMain(document.forms[0],'reset_search');
	}	
}