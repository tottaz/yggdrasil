// JavaScript Document
var cloneID = 1;

function deleteUserField(imgID) {
	if(confirm('Are You Sure?')) {
		var fieldIDArr = imgID.split('_');
		var fieldID = 'userNameMain_'+fieldIDArr[1];
		var fieldObj = document.getElementById(fieldID);
		fieldObj.parentNode.removeChild(fieldObj);
	}
}

function addUserField(nodeObj) {
	var idCount = parseInt(document.getElementById('totalFields').value) + 1;
	document.getElementById('totalFields').value = idCount;
	var clonedNode = nodeObj.cloneNode(true);
	clonedNode.setAttribute('id','userNameMain_'+idCount);
	nodeObj.parentNode.appendChild(clonedNode);

	changeUserID(clonedNode,idCount);
}

function changeUserID(obj,idCount) {
	if(obj.id == 'deleteImg_'+cloneID) {
		obj.setAttribute('id','deleteImg_'+idCount);
		obj.setAttribute('name','deleteImg_'+idCount);
		obj.style.display='';
	}
	else if(obj.id == 'firstName_'+cloneID) {
		obj.setAttribute('id','firstName_'+idCount);
		obj.setAttribute('name','firstName_'+idCount);
		obj.value='';
	}
	else if(obj.id == 'lastName_'+cloneID) {
		obj.setAttribute('id','lastName_'+idCount);
		obj.setAttribute('name','lastName_'+idCount);
		obj.value='';
	}
	else if(obj.id == 'email_'+cloneID) {
		obj.setAttribute('id','email_'+idCount);
		obj.setAttribute('name','email_'+idCount);
		obj.value='';
	}
	else if(obj.id == 'login_'+cloneID) {
		obj.setAttribute('id','login_'+idCount);
		obj.setAttribute('name','login_'+idCount);
		obj.value='';
	}
	if(obj.hasChildNodes()) {
		for(var i=0; i < obj.childNodes.length; i++) {
			changeUserID(obj.childNodes[i],idCount);
		}
	}
}