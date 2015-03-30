// js handling the login procedures

// constants
var NORMAL_STATE = 4;
var LOGIN_PREFIX = 'login.php?';

// variables
var http = getHTTPObject(); // We create the HTTP Object
var hasSeed = false;
var loggedIn = false;
var seed_id = 0;
var seed = 0;
var fullname = '';
var messages = '';

// getSeed method:  gets a seed from the server for this transaction
function getSeed() 
{		// only get a seed if we're not logged in and we don't already have one
		if (!loggedIn && !hasSeed) {
			// open up the path
			http.open('GET', LOGIN_PREFIX + 'task=getseed', true);
			http.onreadystatechange = handleHttpGetSeed;
			http.send(null);
		}
}

// handleHttpGetSeed method: called when the seed is returned from the server
function handleHttpGetSeed()
{
	// if there hasn't been any errors
	if (http.readyState == NORMAL_STATE) {
		// split by the divider |
		results = http.responseText.split('|');
		
		// id is the first element
		seed_id = results[0];
		
		// seed is the second element
		seed = results[1];
		
		// now we have the seed
		hasSeed = true;
	}
}

// validateLogin method: validates a login request
function validateLogin()
{
	// ignore request if we are already logged in
	if (loggedIn)
		return;

	// get form form elements 'username' and 'password'
	username = document.getElementById('username').value;
	password = document.getElementById('password').value;

	// ignore if either is empty
	if (username != '' && password  != '') {
		// compute the hash of the hash of the password and the seed
		hash = hex_md5(hex_md5(password) + seed);
		
		// open the http connection
		http.open('GET', LOGIN_PREFIX + 'task=checklogin&username='+username+'&id='+seed_id+'&hash='+hash, true);
		
		// where to go
		http.onreadystatechange = handleHttpValidateLogin;
		http.send(null);
	}
}

// handleHttpValidateLogin method: called when the validation results are returned from the server
function handleHttpValidateLogin()
{
	// did the connection work?
	if (http.readyState == NORMAL_STATE) {
		// split by the pipe
		results = http.responseText.split('|');
		if (results[0] == 'true')
		{
			hasSeed = false;
			loggedIn = true;
			fullname = results[1];
			messages = '';
		}
		else
		{
			messages = results[1];
		}
		showLogin();
	}
}

// resetLogin method: if logged in, 'logs out' and allows a different user/pass to be entered
function resetLogin()
{
	loggedIn = false;
	hasSeed = false;
}