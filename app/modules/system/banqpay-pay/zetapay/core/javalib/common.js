var loginWnd;

function Get_Cookie(name) {
	var cookies = document.cookie;
	if (cookies == "") return false;
	cookies = " " + cookies;

	var start = cookies.indexOf(" " + name + "=");
	if (start == -1) return false;
	start += name.length + 2;

	var end = cookies.indexOf(";", start);
	if (end == -1) end = cookies.length;

	var val = cookies.substring(start, end);
	return unescape(val);
}

function Set_Cookie(name,value,expires,path,domain,secure) {
	document.cookie = name + "=" +escape(value) +
		( (expires) ? ";expires=" + expires.toGMTString() : "") +
		( (path) ? ";path=" + path : "") +
		( (domain) ? ";domain=" + domain : "") +
		( (secure) ? ";secure" : "");
}

function Delete_Cookie(name) {
	if (Get_Cookie(name))
		document.cookie = name + "=;expires=Thu, 01-Jan-1970 00:00:01 GMT";
}

function handleClick() {
	if (!loginWnd) {
		loginWnd = window.open( 'http://'+window.location.hostname+'/control', '_bp_CTRL_', 'toolbar=0,scrollbars=0,location=0,status=0,menubar=0,resizable=0,width=303,height=208,left=' + (screen.width - 303) / 2 + ',' + 'top=' + (screen.height - 208) / 2);
		loginWnd.focus();
	} else if (loginWnd.closed) {
		delete loginWnd;
		loginWnd = null;
		handleClick();
	} else {
		loginWnd.focus();
	}
}

function centFormat(p) {
	var i = p.toString.indexOf('.');

	if (i == -1) {
		p = p + '.00';
	} else {
		p = p + '00';
		p = p.substr(0, i+3);
	}

	return p;
}


function getStyleObject(objectId) {
	// cross-browser function to get an object's style object given its id
	if (document.getElementById && document.getElementById(objectId)) {
		// W3C DOM
		return document.getElementById(objectId).style;
	} else if (document.all && document.all(objectId)) {
		// MSIE 4 DOM
		return document.all(objectId).style;
	} else if (document.layers && document.layers[objectId]) {
		// NN 4 DOM.. note: this won't find nested layers
		return document.layers[objectId];
	} else {
		return false;
	}
}


function changeObjectVisibility(objectId, newVisibility) {
	// get a reference to the cross-browser style object and 
	// make sure the object exists
	var styleObject = getStyleObject(objectId);
	if (styleObject) {
		styleObject.visibility = newVisibility;
		return true;
	} else {
		// we couldn't find the object,
		// so we can't change its visibility
		return false;
	}
}


function moveObject(objectId, newXCoordinate, newYCoordinate) {
	// get a reference to the cross-browser style object and 
	// make sure the object exists
	var styleObject = getStyleObject(objectId);
	if (styleObject) {
		styleObject.left = newXCoordinate;
		styleObject.top = newYCoordinate;
		return true;
	} else {
		// we couldn't find the object, 
		// so we can't very well move it
		return false;
	}
}

function  msOn(img) {
	var src = img.src.toString();
	var newsrc = src.substr(0, src.length - 5);
	img.src = newsrc+'1.gif';
}

function  msOut(img) {
	var src = img.src.toString();
	var newsrc = src.substr(0, src.length - 5);
	img.src = newsrc+'0.gif';
}

function  msDown(img) {
	var src = img.src.toString();
	var newsrc = src.substr(0, src.length - 5);
	img.src = newsrc+'2.gif';
}

function go(url) { window.location=url; return true; }

function checkemail(email) {

	var emailPat	 = /^(.+)@(.+)$/;
	var specialChars = "\\(\\)<>@,;:\\\\\\\"\\.\\[\\]";
	var validChars	 = "\[^\\s" + specialChars + "\]";
	var ipDomainPat  = /^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/;
	var atom	 = validChars + '+';
	var userPat	 = new RegExp("^" + atom + "(\\." + atom + ")*$");
	var domainPat	 = new RegExp("^" + atom + "(\\." + atom +")*$");

	var matchArray = email.match(emailPat);
	if (matchArray == null) {
		return false;
	}

	var user = matchArray[1];
	var domain = matchArray[2];

	if (user.match(userPat) == null) {
		return false;
	}

	var IPArray = domain.match(ipDomainPat);
	if (IPArray != null) {
		return false;
	}

	var domainArray = domain.match(domainPat);
	if (domainArray == null) {
		return false;
	}

	var atomPat = new RegExp(atom,"g");
	var domArr  = domain.match(atomPat);
	var len     = domArr.length;
	if (domArr[len - 1].length < 2 || 
	    domArr[len - 1].length > 4) {
		return false;
	}

	if (len < 2) {
		return false
	}

	return true;
}