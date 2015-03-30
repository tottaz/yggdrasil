var showingLoggedIn = false;
var messageElement = false;
var messageP = false;

// focusField method: called when username and password gain focus
function focusField()
{
	try {
		if (messageElement != false)
		{
			document.getElementById('message').removeChild(messageElement);
		}
		getSeed();
	}
	catch (e)
	{ } // do nothing... hides an apparent firefox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=236791
}

// blurField method: called when username and password are blurred
function blurField()
{
	try {
		validateLogin();
	}
	catch (e)
	{ } // hide bug https://bugzilla.mozilla.org/show_bug.cgi?id=236791
}

// showLogin method: displays if necessariy that we are logged in
function showLogin() {
	if (messageElement != false)
	{
		try {
			document.getElementById('message').removeChild(messageElement);
		}
		catch (e) { }
	}
	if (loggedIn)
	{
		showingLoggedIn = true;
		
		loginPanel = document.getElementById('login');
		p = document.createElement('p');
		pre = document.createTextNode('Logged in as ');
		strong = document.createElement('strong');
		strong_text = document.createTextNode(fullname);
		strong.appendChild(strong_text);
		mid = document.createTextNode(' [');
		a = document.createElement('a');
		a.href='javascript:logout();';
		a_text = document.createTextNode('logout');
		a.appendChild(a_text);
		post = document.createTextNode(']');
		
		p.appendChild(pre);
		p.appendChild(strong);
		p.appendChild(mid);
		p.appendChild(a);
		p.appendChild(post);
		
		messageP = document.getElementById('message');
		loginPanel.removeChild(messageP);
		loginPanel.appendChild(p);
		
		messageElement = p;
		
		document.getElementById('username').disabled = 'disabled';
		document.getElementById('password').disabled = 'disabled';
		
		document.getElementById('comments').focus();
	}
	else
	{
		messageElement = document.createElement('strong');
		messageElement.appendChild(document.createTextNode(' ' + messages));
		messageElement.style.color = '#ff0000';
		document.getElementById('message').appendChild(messageElement);
	}
}

// logout method: prepares for a new login
function logout()
{
	resetLogin();
	username = document.getElementById('username');
	password = document.getElementById('password');
	loginPanel = document.getElementById('login');
	username.value = '';
	password.value = '';
	username.disabled = null;
	password.disabled = null;
	
	loginPanel.removeChild(messageElement);
	loginPanel.appendChild(messageP);
	
	messageElement = false;
	showingLoggedIn = false;
	
	username.focus();
}

// setupLogin method: to be called on page load, sets up the login script
function setupLogin()
{
	username = document.getElementById('username');
	password = document.getElementById('password');
	addEvent(username, 'focus', focusField);
	addEvent(username, 'blur', blurField);
	addEvent(password, 'focus', focusField);
	addEvent(password, 'blur', blurField);
}


// function to add events to the page in a cross-browser manner
function addEvent(objObject, strEventName, fnHandler) { 
	// DOM-compliant way to add an event listener 
 	if (objObject.addEventListener) {
		objObject.addEventListener(strEventName, fnHandler, false); 
	}
	// IE/windows way to add an event listener 
	else if (objObject.attachEvent) {
		objObject.attachEvent('on' + strEventName, fnHandler); 
	}
}

addEvent(window,'load',setupLogin);