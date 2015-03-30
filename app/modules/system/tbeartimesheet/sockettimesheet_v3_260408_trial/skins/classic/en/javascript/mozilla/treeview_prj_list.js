// JavaScript Document
var head="display:''"

function change(status,indexNo,mEvent){
var image = new String(status);
var imageStatus = image.split(':');
var finalImage;
var finalImage2;
	if(imageStatus[2] == 'expand') {
		finalImage = imageStatus[0]+":"+imageStatus[1]+":"+"collapse";
		if(document.getElementById(status)) {		
			document.getElementById(status).src = '../include/images/collapse.gif';
			document.getElementById(status).name = finalImage;
		}
		else {
			document.getElementById(finalImage).src = '../include/images/collapse.gif';
			document.getElementById(finalImage).name = finalImage;
		}
	}
	else if (imageStatus[2] == 'collapse'){
		finalImage = imageStatus[0]+":"+imageStatus[1]+":"+"expand";
		finalImage2 = imageStatus[0]+":"+imageStatus[1]+":"+"collapse";
		if(document.getElementById(finalImage)) {
			document.getElementById(finalImage).src = '../include/images/expand.gif';
			document.getElementById(finalImage).name = finalImage;
		}
		else {
			document.getElementById(finalImage2).src = '../include/images/expand.gif';
			document.getElementById(finalImage2).name = finalImage;
		}
	}
	
   if(!document.all)
      return
   if (event.srcElement.id=="foldheader") {
      var srcIndex = event.srcElement.sourceIndex
	  var nested = document.all[srcIndex+indexNo]
      if (nested.style.display=="none") {
         nested.style.display=''
      }
      else {
         nested.style.display="none"
      }
   }
}

function hidestatus(){
window.status=''
return true
}

function pausecomp(Amount)
{
	d = new Date()
	while (1)
	{
		mill=new Date() 
		diff = mill-d 
		if( diff > Amount ) {
			break;
		}
	}
}

function killLoad() {
	document.getElementById('loading').style.display="none";
}
function Disable() {
}
document.onmouseover=hidestatus
document.onmouseout=hidestatus
document.onmousedown=Disable;
