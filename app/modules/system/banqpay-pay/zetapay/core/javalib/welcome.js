var form = 0;
var styleObj = new Array();

function done() {
	top.location.reload(1);
}

function redirect() {
	top.location.reload(1);
}

function chksave(f) {
	var f = document.getElementById('f'+form);
	f.save.checked = !f.save.checked;
}

function init() {
	var f0 = document.getElementById('f0');

	if (Get_Cookie('usave')) {
		username = Get_Cookie('c_user');
		f0.save.checked = true;
	} else {
		username = false;
	}

	if (username != false) {
		f0.username.value = username;
		f0.password.focus();
	} else {
		f0.username.focus();
	}

//	setTimeout('location.reload(1);', 60000);


	styleObj[0] = getStyleObject('email0');
	styleObj[1] = getStyleObject('email1');
	styleObj[2] = getStyleObject('pwd0');
	styleObj[3] = getStyleObject('pwd1');
	styleObj[4] = getStyleObject('currency');
	styleObj[5] = getStyleObject('TOS');

	var f1 = document.getElementById('f1');

	return true;
}

function signin() {
	var si = document.getElementById('signin');
	var su = document.getElementById('signup');

	si.style.display = '';
	su.style.display = 'none';

	form = 0;
}

function signup() {
	var si = document.getElementById('signin');
	var su = document.getElementById('signup');

	si.style.display = 'none';
	su.style.display = '';

	form = 1;
}

function submit0() {
	form = 0;

	var f0 = document.getElementById('f0');
	f0.usrtime.value = Math.floor((new Date()).getTime() / 1000);

	var email = f0.username.value;
	email = email.replace(/^\s+/, '');
	email = email.replace(/\s+$/, '');
	f0.username.value = email;

	var password = f0.password.value;

	if (email == '') {
		alert('Please specify the email address.');
		f0.usrname.select();
		f0.username.focus();
		return false;
	}

	if (checkemail(email) == false) {
		alert('Invalid email address.');
		f0.username.select();
		f0.username.focus();
		return false;
	}

	if (password == '') {
		alert('Please enter the password.');
		f0.password.select();
		f0.password.focus();
		return false;
	}

	if (password.length < 5) {
		alert('Password must be 5 or more characters.');
		f0.password.select();
		f0.password.focus();
		return false;
	}

	f0.submit();
}

function subform(event) {
	form = 0;

	if (window.event && window.event.keyCode == 13) {
		submit0();
		return true;
	} else if (event && event.which == 13) {
		submit0();
		return true;
	} else {
		return true;
	}
}

function submit1() {
	form = 1;
	var f1 = document.getElementById('f1');
	f1.usrtime.value = Math.floor((new Date()).getTime() / 1000);

	var rmLWS = /^\s+/;
	var rmTWS = /\s+$/;

	var email0 = f1.email0.value;
	email0 = email0.replace(rmLWS, '');
	email0 = email0.replace(rmTWS, '');
	f1.email0.value = email0;

	var email1 = f1.email1.value;
	email1 = email1.replace(rmLWS, '');
	email1 = email1.replace(rmTWS, '');
	f1.email1.value = email1;

	if (email0.length == 0) {
		alert('Please specify an email address.');
		error_HL_1(0);
		return;
	}

	if (checkemail(email0) == false) {
		alert('Invalid email address.');
		error_HL_1(0);
		return;
	}

	if (email1 != email0) {
		alert('Email addresses do not match.');
		error_HL_1(1);
		return;
	}

	if (f1.password0.value.length < 5) {
		alert('Password is too short.');
		error_HL_1(2);
		return;
	}

	if (f1.password0.value != f1.password1.value) {
		alert('Passwords do not match.');
		error_HL_1(3);
		return;
	}

	if (!f1.accept.checked) {
		alert('Please read the terms of service and check the "I agree" box.');
		error_HL_1(5);
		return;
	}

	f1.submit();
}

function error_HL(idx) {
	if (form == 0) {
		error_HL_0(idx);
	} else {
		error_HL_1(idx);
	}
}

function error_HL_0(idx) {
	var f0 = document.getElementById('f0');

	f0.password.value = '';
	f0.username.focus();
	f0.username.select();

	var ifrm = document.getElementById('RS_1127830358_541813832007009');
	ifrm.src = 'zetapay/help/blank.html';
}

function error_HL_1(idx) {
	var f1 = document.getElementById('f1');

	for (i = 0; i < 6; i++) {
		styleObj[i].color = 'black';
		styleObj[i].fontWeight = 'normal';
	}

	if (styleObj[idx] != null) {
		styleObj[idx].color = 'red';
		styleObj[idx].fontWeight = 'bold';
	}

	switch (idx) {
		case 0:	f1.email0.select();
			f1.email0.focus();
			break;
		case 1:	f1.email1.select();
			f1.email1.focus();
			break;
		case 2:	f1.password0.value = '';
			f1.password1.value = '';
			f1.password0.focus();
			break;
		case 3:	f1.password1.value = '';
			f1.password1.focus();
			break;
	}

	return true;
}