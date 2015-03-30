// JavaScript Document

var cloneID = 1;
var reportQuery = '';
var searchNoValue = false;

function selectAll(selectName) {
	if(document.getElementById(selectName)) {
		for (i=0;i<document.getElementById(selectName).length;i++)  {
			document.getElementById(selectName).options[i].selected = true;    
		}
	}
}
function unSelectAll(selectName) {
	if(document.getElementById(selectName)) {
		for (i=0;i<document.getElementById(selectName).length;i++)  {
			document.getElementById(selectName).options[i].selected = false;    
		}
	}
}
function showHideConfig(checkbox,target) {
	if(checkbox.checked) {
		document.getElementById(target).style.display='';
	}
	else
		document.getElementById(target).style.display='none';
}

function verifySelect(selectbox) {
    for (i=0;i<document.getElementById(selectbox).length;i++)  {
		if(document.getElementById(selectbox).options[i].selected) {
			return true;
		}	
    }
	return false;
}

function showFilename(exportID) {
	if(exportID == 'printer') {
		//hide filename
		document.getElementById('exportFileTable').style.display='none';
	}
	else {
		document.getElementById('exportFileTable').style.display='';
		document.getElementById('fileExtension').innerHTML = '.'+exportID;
	}
}

function populateSharedFields(source,target) {
	document.getElementById('shareSourceValue').value = '';
	document.getElementById('shareTargetValue').value = '';
	
	for (i=0; i<source.length; i++) {
		if(source[i].value)
			document.getElementById('shareSourceValue').value = document.getElementById('shareSourceValue').value + source[i].value + ':';
	}
	for (i=0; i<target.length; i++) {
		if(target[i].value)
			document.getElementById('shareTargetValue').value = document.getElementById('shareTargetValue').value + target[i].value + ':';
	}
}

function populateEmailFields(source,target) {
	document.getElementById('emailSourceValue').value = '';
	document.getElementById('emailTargetValue').value = '';
	
	for (i=0; i<source.length; i++) {
		if(source[i].value)
			document.getElementById('emailSourceValue').value = document.getElementById('emailSourceValue').value + source[i].value + ':';
	}
	for (i=0; i<target.length; i++) {
		if(target[i].value)
			document.getElementById('emailTargetValue').value = document.getElementById('emailTargetValue').value + target[i].value + ':';
	}
}

function createOptions(obj,selectID) {
	document.getElementById(selectID).options.length = 0;

	var calIDArr = obj.id.split('_');

	document.getElementById('calendarField_' + calIDArr[1]).style.display='none';
	document.getElementById('selectKeyQueryText_'+calIDArr[1]).readOnly="";
	document.getElementById('selectKeyQueryText_'+calIDArr[1]).value="";
	if(obj.options[obj.selectedIndex].title == 'date') {
		document.getElementById('calendarField_'+calIDArr[1]).style.display='';
		document.getElementById('selectKeyQueryText_'+calIDArr[1]).readOnly="readonly";
		Calendar.setup(
			{
				inputField 	: 	"selectKeyQueryText_"+calIDArr[1],
				ifFormat	:	"M d y",
				button		:	"calendarField_"+calIDArr[1]	
			}
		);

	}	
	if(obj.options[obj.selectedIndex].title == 'number') {
		document.getElementById(selectID).options[0] = new Option('equal to','=');    
		document.getElementById(selectID).options[1] = new Option('not equal to','<>');    
		document.getElementById(selectID).options[2] = new Option('more than','>');    
		document.getElementById(selectID).options[3] = new Option('more or same as','>=');    
		document.getElementById(selectID).options[4] = new Option('less than','<');    
		document.getElementById(selectID).options[5] = new Option('less or same as','<=');     
	} 
	else if(obj.options[obj.selectedIndex].title == 'string' || !obj.options[obj.selectedIndex].title) {
		document.getElementById(selectID).options[0] = new Option('equal to','=');    
		document.getElementById(selectID).options[1] = new Option('not equal to','<>');     
		document.getElementById(selectID).options[2] = new Option('contains','LIKE');    
		document.getElementById(selectID).options[3] = new Option('does not contain','NOT LIKE');    
	}
	else if(obj.options[obj.selectedIndex].title == 'date') {
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
		//if(idCount > 2)
			obj.style.display='';
		obj.disabled=false;
	}
	else if(obj.id == 'selectKey_'+cloneID) {
		obj.setAttribute('id','selectKey_'+idCount);
		obj.setAttribute('name','selectKey_'+idCount);
		obj.style.display='';
	}
	else if(obj.id == 'selectKeyQueryOption_'+cloneID) {
		obj.setAttribute('id','selectKeyQueryOption_'+idCount);
		obj.setAttribute('name','selectKeyQueryOption_'+idCount);
		obj.style.display='';
	}
	else if(obj.id == 'selectKeyQueryText_'+cloneID) {
		obj.setAttribute('id','selectKeyQueryText_'+idCount);
		obj.setAttribute('name','selectKeyQueryText_'+idCount);
		obj.setAttribute('value','');
		obj.style.display='';
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
	document.getElementById('filterTotal').value = parseInt(document.getElementById('filterTotal').value) + 1;

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
		document.getElementById('filterTotal').value = parseInt(document.getElementById('filterTotal').value) - 1;
	}
}
function queryAJAX(obj,force) {
	reportQuery = '';
	searchNoValue = false;
	verifyFields(obj,force);
	document.getElementById('reportQuery').value=reportQuery;
	if(searchNoValue && force==1) {
		alert('Enter Value In Search Parameter');
		return false;
	}
	return true;
}

function verifyFields(obj,forceValue) {
	if(obj.nodeName.toLowerCase() == 'select' && !obj.disabled) {
		if(!obj.id.match('_1')) {
			reportQuery = reportQuery + obj.options[obj.selectedIndex].value+';';
		}
	}	
	if(obj.type == 'text') {
		var fieldIDArr = obj.id.split('_');
		var selectedOption = document.getElementById('selectKeyQueryOption_'+fieldIDArr[1]);
		if(selectedOption.options[selectedOption.selectedIndex].value == 'LIKE' || selectedOption.options[selectedOption.selectedIndex].value == 'NOT LIKE') {
			if(!obj.id.match('_1')) {
				reportQuery = reportQuery + "string:%"+filterNum(obj.value)+"%"+";";
			}
		}
		else {
			if(!obj.id.match('_1')) {
				if(document.getElementById('selectKey_'+fieldIDArr[1]).options[document.getElementById('selectKey_'+fieldIDArr[1]).selectedIndex].title == 'date') {
					reportQuery = reportQuery +"date:"+filterNum(obj.value)+""+";";
				}
				else if(document.getElementById('selectKey_'+fieldIDArr[1]).options[document.getElementById('selectKey_'+fieldIDArr[1]).selectedIndex].title == 'number') {
					reportQuery = reportQuery +"number:"+filterNum(obj.value)+""+";";
				}
				else if(document.getElementById('selectKey_'+fieldIDArr[1]).options[document.getElementById('selectKey_'+fieldIDArr[1]).selectedIndex].title == 'string') {
					reportQuery = reportQuery +"string:"+filterNum(obj.value)+""+";";
				}
				else {
					reportQuery = reportQuery +""+filterNum(obj.value)+""+";";
				}
			}
		}	
	}	
	if(obj.type == 'text' && !obj.value && !obj.id.match('_1') && forceValue==1) {
		searchNoValue = true;
		obj.focus();
		reportQuery = '';
		return false;
	}	
	if(obj.hasChildNodes()) {
		for(var i=0; i < obj.childNodes.length; i++) {
			verifyFields(obj.childNodes[i],forceValue);
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
		document.getElementById('reportQuery').value='';
		document.getElementById('search_content').style.display = 'none';
		ajaxMain(document.forms[0],'reset_search');
	}	
}

function filterMap() {
	document.getElementById('filterMap').value = '';
	for(var i=0; i < document.getElementById('connector_1').options.length; i++) {
		document.getElementById('filterMap').value = document.getElementById('filterMap').value + document.getElementById('connector_1').options[i].value+':'+i+',';
	}
	for(var i=0; i < document.getElementById('selectKey_1').options.length; i++) {
		document.getElementById('filterMap').value = document.getElementById('filterMap').value + document.getElementById('selectKey_1').options[i].value+':'+i+',';
	}
	//DEFAULT FILTERS BASED ON TYPES
	document.getElementById('filterMap').value = document.getElementById('filterMap').value + '=:0,';
	document.getElementById('filterMap').value = document.getElementById('filterMap').value + '<>:1,';
	document.getElementById('filterMap').value = document.getElementById('filterMap').value + '>:2,';
	document.getElementById('filterMap').value = document.getElementById('filterMap').value + '>=:3,';
	document.getElementById('filterMap').value = document.getElementById('filterMap').value + '<:4,';
	document.getElementById('filterMap').value = document.getElementById('filterMap').value + '<=:5,';
	document.getElementById('filterMap').value = document.getElementById('filterMap').value + 'LIKE:2,';
	document.getElementById('filterMap').value = document.getElementById('filterMap').value + 'NOT LIKE:3,';
}