// JavaScript Document
	var initialtab=[1, "sc1"];
	
	function cascadedstyle(el, cssproperty, csspropertyNS){
		if (el.currentStyle)
			return el.currentStyle[cssproperty];
		else if (window.getComputedStyle){
			var elstyle=window.getComputedStyle(el, "");
			return elstyle.getPropertyValue(csspropertyNS);
		}
	}
	
	var previoustab="";
	
	function expandcontent(cid, aobject){
		if (document.getElementById){
			highlighttab(aobject);
			detectSourceindex(aobject);
			if (previoustab!="")
				document.getElementById(previoustab).style.display="none";
			document.getElementById(cid).style.display="block";
			previoustab=cid;
			if (aobject.blur)
				aobject.blur();
			return false;
		}
		else
			return true;
	}
	
	function highlighttab(aobject){
		if (typeof tabobjlinks=="undefined")
			collecttablinks();
		for (i=0; i<tabobjlinks.length; i++) {
			tabobjlinks[i].style.backgroundColor=initTabcolor;
			tabobjlinks[i].style.color="#CCCCCC";
			if(tabobjlinks[i].childNodes[0].title == 'tabimage')
				tabobjlinks[i].childNodes[0].style.filter = "gray";
		}	
		var themecolor=aobject.getAttribute("theme")? aobject.getAttribute("theme") : initTabpostcolor;
		aobject.style.backgroundColor=document.getElementById("tabcontentcontainer").style.backgroundColor=themecolor;
		aobject.style.color="black";
		if(aobject.childNodes[0].title == 'tabimage')
			aobject.childNodes[0].style.filter = "chroma";
	}

	function overtab(cid,aobject){
		if(cid != previoustab) {
			aobject.style.backgroundColor="#EBECFF";
			aobject.style.color="black";
			if(aobject.childNodes[0].title == 'tabimage')
				aobject.childNodes[0].style.filter = "chroma";
		}	
	}

	function outtab(cid,aobject){
		if(cid != previoustab) {
			aobject.style.backgroundColor=initTabcolor;
			aobject.style.color="#CCCCCC";
			if(aobject.childNodes[0].title == 'tabimage') {
				aobject.childNodes[0].style.filter = "gray";
			}
		}	
	}

	function collecttablinks(){
		var tabobj=document.getElementById("tablist");
		tabobjlinks=tabobj.getElementsByTagName("span");
	}

	function detectSourceindex(aobject){
		for (i=0; i<tabobjlinks.length; i++){
			if (aobject==tabobjlinks[i]){
				tabsourceindex=i; //source index of tab bar relative to other tabs
				break;
			}
		}
	}
	
	function do_onload(){
		var cookiename=(typeof persisttype!="undefined" && persisttype=="sitewide")? "tabcontent" : window.location.pathname;
		var cookiecheck=window.get_cookie && get_cookie(cookiename).indexOf("|")!=-1;
		collecttablinks();
		initTabcolor=cascadedstyle(tabobjlinks[1], "backgroundColor", "background-color");
		initTabpostcolor=cascadedstyle(tabobjlinks[0], "backgroundColor", "background-color");
		if (typeof enablepersistence!="undefined" && enablepersistence && cookiecheck){
			var cookieparse=get_cookie(cookiename).split("|");
			var whichtab=cookieparse[0];
			var tabcontentid=cookieparse[1];
			expandcontent(tabcontentid, tabobjlinks[whichtab]);
		}
		else
			expandcontent(initialtab[1], tabobjlinks[initialtab[0]-1]);
	}
	
	if (window.addEventListener)
		window.addEventListener("load", do_onload, false);
	else if (window.attachEvent)
		window.attachEvent("onload", do_onload);
	else if (document.getElementById)
		window.onload=do_onload;

	var enablepersistence=false; //true to enable persistence, false to turn off (or simply remove this entire script block).
	var persisttype="sitewide"; //enter "sitewide" for Tab content order to persist across site, "local" for this page only
	
	function get_cookie(Name) { 
		var search = Name + "=";
		var returnvalue = "";
		if (document.cookie.length > 0) {
			offset = document.cookie.indexOf(search);
			if (offset != -1) { 
				offset += search.length;
				end = document.cookie.indexOf(";", offset);
				if (end == -1) end = document.cookie.length;
					returnvalue=unescape(document.cookie.substring(offset, end));
			}
		}
		return returnvalue;
	}
	
	function savetabstate(){
		var cookiename=(persisttype=="sitewide")? "tabcontent" : window.location.pathname;
		var cookievalue=(persisttype=="sitewide")? tabsourceindex+"|"+previoustab+";path=/" : tabsourceindex+"|"+previoustab;
		document.cookie=cookiename+"="+cookievalue;
	}
	
	window.onunload=savetabstate;
