<!--

function chkemail(email) {

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
//-->
