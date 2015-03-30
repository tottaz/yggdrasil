var auth_f0;

function auth_init() {
	auth_f0 = document.getElementById('auth_f0');
	var btn = document.getElementById('btn0');
	var src = 'zetapay/images/buyer/';

	if ((auth_f0.giftchk != null) && (auth_f0.giftchk.checked)) {
		src += 'continue';
		btn.alt = 'Continue';
	} else {
		src += 'confirm';
		btn.alt = 'Confirm';
	}

	if (1*getusrbal() >= price) {
		src += '-enabled.png';
	} else {
		src += '-disabled.png';
	}

	btn.src = src;
}

function auth_submit() {
	if (1*getusrbal() < price) {
		alert('Account balance too low. Please fund your account.');
		main_display(2);
		return;
	}

	auth_f0.usrtime.value = Math.floor((new Date()).getTime() / 1000);
	auth_f0.submit();
}

function auth_giftchk(f) {
	if (f) {
		auth_f0.giftchk.checked = !auth_f0.giftchk.checked;
	}

	var btn = document.getElementById('btn0');
	var src = 'zetapay/images/buyer/';

	if (auth_f0.giftchk.checked) {
		src += 'continue';
		btn.alt = 'Continue';
	} else {
		src += 'confirm';
		btn.alt = 'Confirm';
	}

	if (1*getusrbal() >= price) {
		src += '-enabled.png';
	} else {
		src += '-disabled.png';
	}

	btn.src = src;
}

function auth_error_HL(idx) {
	return;
}