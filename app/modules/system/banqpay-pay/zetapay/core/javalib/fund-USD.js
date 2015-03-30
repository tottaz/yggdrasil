<!--
var fund_f0;
var fund_f1;
var fund_f2;
var fund_s0;
var fund_fa0;
var fund_fa1;
var fund_m2;
var fund_win;

function fund_method_sel() {
	var method = fund_s0.options[fund_s0.selectedIndex].value;

	if (method == 'paythru-paypal') {
		fund_fa0.style.display = 'none';
		fund_fa1.style.display = 'none';
		fund_fa2.style.display = '';
		if (fund_m2 != null) {
			fund_m2.style.display = 'none';
		}
		return;
	} else if (method == 'ppcard') {
		fund_fa0.style.display = '';
		fund_fa1.style.display = 'none';
		fund_fa2.style.display = 'none';
		if (fund_m2 != null) {
			fund_m2.style.display = 'none';
		}
		return;
	} else {
		fund_fa0.style.display = 'none';
		fund_fa1.style.display = '';
		fund_fa2.style.display = 'none';
		if (fund_m2 != null) {
			fund_m2.style.display = '';
		}
		fund_amount_sel();
		return;
	}
}

function fund_amount_sel() {
	var amount1 = document.getElementById('amount1');

	if (fund_f1.amount0.selectedIndex == 0) {
		amount1.style.display = '';
	} else {
		amount1.style.display = 'none';
	}
}

function fund_init() {
	fund_f0 = document.getElementById('fund_f0');
	fund_f1 = document.getElementById('fund_f1');
	fund_f2 = document.getElementById('fund_f2');
	fund_s0 = document.getElementById('fund_method');
	fund_fa0 = document.getElementById('fund_ppcard');
	fund_fa1 = document.getElementById('fund_selamount');
	fund_fa2 = document.getElementById('fund_paythru_paypal');
	fund_m2 = document.getElementById('fund_msg_minimum');

	fund_method_sel();
}

function fund_monitor() {
	if (fund_win.closed) {
		top.done();
	} else {
		setTimeout('fund_monitor();', 500);
	}
}

function fund_submit() {
	var method = fund_s0.options[fund_s0.selectedIndex].value;

	if (method == 'paythru-paypal') {	// initiate paythru payapl
		lock(2);
		var pp = 'https://'+window.location.hostname+'/common/paypal-pap.php';
	        fund_win = window.open(pp, '', 'location=yes,menubar=yes,resizable=yes,status=yes,scrollbars=yes,toolbar=yes');

		if (!fund_win.opener) {
			fund_win.opener = self;
		}

		if (window.focus) {
			fund_win.focus();
		}

		fund_monitor();

		//fund_f2.submit();
		return;
	} else if (method  == 'ppcard') {	// prepaid card
		if (fund_f0.card_no.value.length < 16) {
			alert('Please specify a valid card number.');
			fund_f0.card_no.focus();
			return;
		}
		fund_f0.submit();
		return;
	}

	var amount = 0;
	var verb;

	if (fund_f1.amount0.selectedIndex == 0) {
		amount = fund_f1.amount1.value;
		amount = 0 + amount.replace(/[^0123456789\.]/g, '');

		if (amount == 0) {
			alert('Please enter an amount.');
			fund_f1.amount1.focus();
			return;
		}

		verb = 'enter';
	} else {
		amount = fund_f1.amount0.value;
		verb = 'select';
	}

	if (amount < 1*payin_minimum) {
		alert('Please '+verb+' an amount at or above the minimum: '+payin_minimum_fmt+'.');
		return;
	}

	if (amount > 1*payin_maximum) {
		alert('Please '+verb+' an amount at or below the maximum: '+payin_maximum_fmt+'.');
		return;
	}

	if (method == 'paypal') {	// PayPal
		lock(2);
		var pp = 'https://'+window.location.hostname+'/common/paypal.php?amount='+amount;
	        fund_win = window.open(pp, '', 'location=yes,menubar=yes,resizable=yes,status=yes,scrollbars=yes,toolbar=yes');

		if (!fund_win.opener) {
			fund_win.opener = self;
		}

		if (window.focus) {
			fund_win.focus();
		}

		fund_monitor();

		//fund_f1.method.value = fund_s0[s].value;
		//fund_f1.submit();
	} else if (method == 'CC:0') {	// new credit card
		ccard_f0.amount.value = amount;
		main_display(3);
	} else {	// registered credit card
		var cn = fund_s0.options[fund_s0.selectedIndex].text;
		var i = cn.indexOf(',');
		if (i > 0) {
			cn = cn.substring(0, i);
			if (cn.indexOf('[') >= 0) {
				cn = cn + ']';
			}
		}
                if (confirm("Click OK to fund $"+amount+" using "+cn+".")) {
			lock(2);
			fund_f1.method.value = method;
			fund_f1.submit();
		}
	}
}

function fund_error_HL(idx) {
	return;
}
//-->
