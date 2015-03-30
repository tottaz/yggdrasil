// JavaScript Document
var contractsymbol='{SKINROOT}/images/up_scroll2.gif' //Path to image to represent contract state.
var expandsymbol='{SKINROOT}/images/down_scroll2.gif' //Path to image to represent expand state.

function getHelp() {
	if(!document.getElementById('helpdetected').value)
		ajaxMain(document.forms[0],'gethelp');
}

function getElementbyClass(rootobj, classname){
	var temparray=new Array()
	var inc=0
	var rootlength=rootobj.length
	for (i=0; i<rootlength; i++){
		if (rootobj[i].className==classname)
			temparray[inc++]=rootobj[i]
	}
	return temparray
}

function sweeptoggle(ec){
	var inc=0
	while (ccollect[inc]){
		ccollect[inc].style.display=(ec=="contract")? "none" : ""
		inc++
	}
	revivestatus()
}

function expandhelp(curobj, cid){
	if (ccollect.length>0){
		document.getElementById(cid).style.display=(document.getElementById(cid).style.display!="none")? "none" : ""
		curobj.src=(document.getElementById(cid).style.display=="none")? expandsymbol : contractsymbol
	}
}

function revivestatus(){
var inc=0
	while (statecollect[inc]){
		if (ccollect[inc].style.display=="none")
			statecollect[inc].src=expandsymbol
		else
			statecollect[inc].src=contractsymbol
		inc++
	}
}

function getselectedItem(){
	return "";
	if (get_cookiehelp(window.location.pathname) != ""){
		selectedItem=get_cookiehelp(window.location.pathname)
		return selectedItem
	}
	else
		return ""
}

function saveswitchstate(){
	var inc=0, selectedItem=""
	while (ccollect[inc]){
		if (ccollect[inc].style.display=="none")
			selectedItem+=ccollect[inc].id+"|"
		inc++
	}
}

function do_onloadhelp(){
	uniqueidn=window.location.pathname+"firsttimeload"
	var alltags=document.all? document.all : document.getElementsByTagName("*")
	ccollect=getElementbyClass(alltags, "switchcontent")
	statecollect=getElementbyClass(alltags, "showstate")
	if (ccollect.length>0 && statecollect.length>0)
		revivestatus()
	sweeptoggle('contract')	
}

if (window.addEventListener)
	window.addEventListener("load", do_onloadhelp, false)
else if (window.attachEvent)
	window.attachEvent("onload", do_onloadhelp)
else if (document.getElementById)
	window.onload=do_onloadhelp

