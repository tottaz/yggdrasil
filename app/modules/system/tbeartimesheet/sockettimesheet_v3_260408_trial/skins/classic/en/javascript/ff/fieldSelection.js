// JavaScript Document
function submitMultiSelect(source,target,mandatory) {
	document.getElementById('sourceValue').value = '';
	document.getElementById('targetValue').value = '';

	if(!target.length && mandatory) {
		source.style.color='red';
		alert('Select At Least One List');
		return false;
	}	
	else {
		source.style.color='green';
		if(source.id == 'denied')	
			source.style.color='red';

		for (i=0; i<source.length; i++) {
			source[i].selected = true;
			if(source[i].value)
				document.getElementById('sourceValue').value = document.getElementById('sourceValue').value + source[i].value + ':';
		}
		for (i=0; i<target.length; i++) {
			target[i].selected = true;
			if(target[i].value)
				document.getElementById('targetValue').value = document.getElementById('targetValue').value + target[i].value + ':';
		}
		return true;
	}	
}

function submitMultiUnSelect(source,target) {
	for (i=0; i<source.length; i++) {
		source[i].selected = false;
	}
	for (i=0; i<target.length; i++) {
		target[i].selected = false;
	}
}

function submitSelection(source,target) {
	document.getElementById('sourceValue').value = '';
	document.getElementById('targetValue').value = '';
	
	if(!target.length) {
		source.style.color='red';
		alert('Please Select At Least One List');
	}	
	else {	
		source.style.color='green';
		for (i=0; i<source.length; i++) {
			source[i].selected = true;
			if(source[i].value)
				document.getElementById('sourceValue').value = document.getElementById('sourceValue').value + source[i].value + ':';
		}
		for (i=0; i<target.length; i++) {
			target[i].selected = true;
			if(target[i].value)
				document.getElementById('targetValue').value = document.getElementById('targetValue').value + target[i].value + ':';
		}
		ajaxMain(document.forms[0],'field_update');
	}	
}

function copyToList(from,to) {
  fromList = eval('document.forms[0].' + from);
  toList = eval('document.forms[0].' + to);

  if (toList.options.length > 0 && toList.options[0].value == 'temp') {
  	toList.options.length = 0;
  }
  var sel = false;
  for (i=0;i<fromList.options.length;i++) {
  	var current = fromList.options[i];
    if (current.selected) {
		sel = true;
		if (current.id) {
			alert("Team Member Removal For "+current.id+" Ignored.\nCannot Remove Team Member(s) With Actual Hours From Projects/Tasks.");
		}
		else {
		  	if (current.value == 'temp') {
				alert ('You cannot move this text!');
				return;
		  	}
		  	txt = current.text;
		  	val = current.value;
		  	toList.options[toList.length] = new Option(txt,val);
		  	fromList.options[i] = null;
		  	i--;
		} 
	}	
  }
  if(!sel)
  	alert('Select At Least One List To Move');
}

function mousewheel(obj) {
	return false; //disable mousewheel
	obj = (typeof obj == "string") ? document.getElementById(obj) : obj;
	if (obj.tagName.toLowerCase() != "select")
		return;
	if (obj.selectedIndex != -1) {
		if (event.wheelDelta > 0) {
			toup(obj);
		} else {
			todown(obj);
		}
		return false;
	}
}

function selectnone(obj) {
	return false; //do nothing
}


function totop(obj) {
	if(!document.getElementById(obj).value) {
	  	alert('Select At Least One List To Move');
		return false;
	}	
	obj = (typeof obj == "string") ? document.getElementById(obj) : obj;
	if (obj.tagName.toLowerCase() != "select" && obj.length < 2)
		return false;
	var elements = new Array();
	for (var i=0; i<obj.length; i++) {
		if (obj[i].selected) {
			elements[elements.length] = new Array(obj[i].text, obj[i].value, obj[i].style.color, obj[i].style.backgroundColor, obj[i].className, obj[i].id, obj[i].selected);
		}
	}
	for (i=0; i<obj.length; i++) {
		if (!obj[i].selected) {
			elements[elements.length] = new Array(obj[i].text, obj[i].value, obj[i].style.color, obj[i].style.backgroundColor, obj[i].className, obj[i].id, obj[i].selected);
		}
	}
	for (i=0; i<obj.length; i++) {
		obj[i].text = elements[i][0];
		obj[i].value = elements[i][1];
		obj[i].style.color = elements[i][2];
		obj[i].style.backgroundColor = elements[i][3];
		obj[i].className = elements[i][4];
		obj[i].id = elements[i][5];
		obj[i].selected = elements[i][6];
	}
}

function tobottom(obj) {
	if(!document.getElementById(obj).value) {
	  	alert('Select At Least One List To Move');
		return false;
	}	
	obj = (typeof obj == "string") ? document.getElementById(obj) : obj;
	if (obj.tagName.toLowerCase() != "select" && obj.length < 2)
		return false;
	var elements = new Array();
	for (var i=0; i<obj.length; i++) {
		if (!obj[i].selected) {
			elements[elements.length] = new Array(obj[i].text, obj[i].value, obj[i].style.color, obj[i].style.backgroundColor, obj[i].className, obj[i].id, obj[i].selected);
		}
	}
	for (i=0; i<obj.length; i++) {
		if (obj[i].selected) {
			elements[elements.length] = new Array(obj[i].text, obj[i].value, obj[i].style.color, obj[i].style.backgroundColor, obj[i].className, obj[i].id, obj[i].selected);
		}
	}
	for (i=obj.length-1; i>-1; i--) {
		obj[i].text = elements[i][0];
		obj[i].value = elements[i][1];
		obj[i].style.color = elements[i][2];
		obj[i].style.backgroundColor = elements[i][3];
		obj[i].className = elements[i][4];
		obj[i].id = elements[i][5];
		obj[i].selected = elements[i][6];
	}
}

function toup(obj) {
	if(!document.getElementById(obj).value) {
	  	alert('Select At Least One List To Move');
		return false;
	}	
	obj = (typeof obj == "string") ? document.getElementById(obj) : obj;
	if (obj.tagName.toLowerCase() != "select" && obj.length < 2)
		return false;
	var sel = new Array();
	for (var i=0; i<obj.length; i++) {
		if (obj[i].selected == true) {
			sel[sel.length] = i;
		}
	}
	for (i in sel) {
		if (sel[i] != 0 && !obj[sel[i]-1].selected) {
			var tmp = new Array(obj[sel[i]-1].text, obj[sel[i]-1].value, obj[sel[i]-1].style.color, obj[sel[i]-1].style.backgroundColor, obj[sel[i]-1].className, obj[sel[i]-1].id);
			obj[sel[i]-1].text = obj[sel[i]].text;
			obj[sel[i]-1].value = obj[sel[i]].value;
			obj[sel[i]-1].style.color = obj[sel[i]].style.color;
			obj[sel[i]-1].style.backgroundColor = obj[sel[i]].style.backgroundColor;
			obj[sel[i]-1].className = obj[sel[i]].className;
			obj[sel[i]-1].id = obj[sel[i]].id;
			obj[sel[i]].text = tmp[0];
			obj[sel[i]].value = tmp[1];
			obj[sel[i]].style.color = tmp[2];
			obj[sel[i]].style.backgroundColor = tmp[3];
			obj[sel[i]].className = tmp[4];
			obj[sel[i]].id = tmp[5];
			obj[sel[i]-1].selected = true;
			obj[sel[i]].selected = false;
		}
	}
}
function todown(obj) {
	if(!document.getElementById(obj).value) {
	  	alert('Select At Least One List To Move');
		return false;
	}	
	obj = (typeof obj == "string") ? document.getElementById(obj) : obj;
	if (obj.tagName.toLowerCase() != "select" && obj.length < 2)
		return false;
	var sel = new Array();
	for (var i=obj.length-1; i>-1; i--) {
		if (obj[i].selected == true) {
			sel[sel.length] = i;
		}
	}
	for (i in sel) {
		if (sel[i] != obj.length-1 && !obj[sel[i]+1].selected) {
			var tmp = new Array(obj[sel[i]+1].text, obj[sel[i]+1].value, obj[sel[i]+1].style.color, obj[sel[i]+1].style.backgroundColor, obj[sel[i]+1].className, obj[sel[i]+1].id);
			obj[sel[i]+1].text = obj[sel[i]].text;
			obj[sel[i]+1].value = obj[sel[i]].value;
			obj[sel[i]+1].style.color = obj[sel[i]].style.color;
			obj[sel[i]+1].style.backgroundColor = obj[sel[i]].style.backgroundColor;
			obj[sel[i]+1].className = obj[sel[i]].className;
			obj[sel[i]+1].id = obj[sel[i]].id;
			obj[sel[i]].text = tmp[0];
			obj[sel[i]].value = tmp[1];
			obj[sel[i]].style.color = tmp[2];
			obj[sel[i]].style.backgroundColor = tmp[3];
			obj[sel[i]].className = tmp[4];
			obj[sel[i]].id = tmp[5];
			obj[sel[i]+1].selected = true;
			obj[sel[i]].selected = false;
		}
	}
}
function submitNone(source,target) {
	if(target.length) {
		if(confirm("Are You Sure? All Previous Fields Settings Will Reset To Default")) {
			for (i=0; i<source.length; i++) {
				source[i].selected = false;
			}
			for (i=0; i<target.length; i++) {
				target[i].selected = false;
			}
			document.forms[0].submit();
		}
		else
			return false;
	}	
}