var form = 0;
var price = 0.01;		
var payin_minimum = 3.00;
var payin_minimum_fmt = '$3.00';
var payin_maximum = 1000;
var payin_maximum_fmt = '$1,000.00';
var styleObj = new Array();
var locked = 0;

function done() {
	top.location.reload(1);
}

function redirect() {
	location.reload(1);
}

function getusrbal() {
	return Get_Cookie('bal');
}

function reset() {
	locked = 1;
	unlock(1);

	locked = 1;
	unlock(3);
}

function signout() {
	    location.href('http://www.banqpay.com/sublink.php?cmd=logout');   
}

function main_display(f) {
	if (locked) {
		return;
	}

	if ((f == 0) && (1*getusrbal() < price)) {
		alert('Account balance too low. Please fund your account.');
		main_display(1);
		return;
	}

	var auth = document.getElementById('auth');
	var fund = document.getElementById('fund');
	var ccard = document.getElementById('ccard');
	var cconfirm = document.getElementById('cconfirm');

	auth.style.display = 'none';
	fund.style.display = 'none';
	ccard.style.display = 'none';
	cconfirm.style.display = 'none';

	form = f;
	switch (f) {
		case 0:	auth.style.display = '';	break;
		case 1:	fund.style.display = '';	break;
		case 2:	ccard.style.display = '';	break;
		case 3:	cconfirm.style.display = '';	break;
	}

	scroll(0,0);
}

function main_submit(f) {
	if (locked) {
		return;
	}

	form = f;
	switch (f) {
		case 0:	auth_submit();		break;
		case 1:	fund_submit();		break;
		case 2:	ccard_submit();		break;
	}
}

function error_HL(idx) {
	switch (form) {
		case 0: auth_error_HL(idx);	 break;
		case 1: fund_error_HL(idx);	 break;
		case 2: ccard_error_HL(idx); break;
	}
}

function lock(f) {
	if (locked) {
		return;
	}

	if (f == 1) {	// funding form
		var btn = document.getElementById('fund_btn1');
        	btn.src = btn.src.substring(0, btn.src.lastIndexOf('-')) + '-disabled.png';

		var fsrc = document.getElementById('fund_method');
		fsrc.style.display = 'none';
	}

	if (f == 3) {	// cconfirm form
		var btn = container.document.getElementById('cconfirm_btn1');
        	btn.src = btn.src.substring(0, btn.src.lastIndexOf('-')) + '-disabled.png';
	}

	var wait = document.getElementById('wait');
	wait.style.display = '';

	var progress = document.getElementById('progress');
	progress.src = 'zetapay/images/buyer/progress.gif';

	window.scrollTo(0,0);

	locked = 1;

	return true;
}

function unlock(f) {
	if (locked != 1) {
		return;
	}

	locked = 0;

	if (f == 1) {	// funding form
		var btn = document.getElementById('fund_btn1');
        	btn.src = btn.src.substring(0, btn.src.lastIndexOf('-')) + '-enabled.png';

		var fsrc = document.getElementById('fund_method');
		fsrc.style.display = '';
	}

	if (f == 3) {	// cconfirm form
		var btn = container.document.getElementById('cconfirm_btn1');
        	btn.src = btn.src.substring(0, btn.src.lastIndexOf('-')) + '-enabled.png';
	}

	var wait = document.getElementById('wait');
	wait.style.display = 'none';
}

function init() {

	auth_init();
	fund_init();
	ccard_init();


	return true;
}
