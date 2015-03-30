var fund_f0;
var fund_f1;
var fund_s0;
var fund_fa0;
var fund_fa1;

function fund_method_sel() {
	var btn = document.getElementById('fund_btn1');
	var src = 'zetapay/images/buyer/continue';

	if (fund_s0.selectedIndex == 0) { // nothing selected
		fund_fa0.style.display = 'none';
		fund_fa1.style.display = 'none';
		src += '-disabled.png';
		btn.src = src;
		return;
	}

	if (fund_s0.selectedIndex == 1) { // Credit Card
		fund_fa0.style.display = 'none';
		fund_fa1.style.display = '';
		src += '-enabled.png';
		btn.src = src;
		fund_amount_sel();
		return;
	}

	if (fund_s0.selectedIndex == 2) { // PayPal
		fund_fa0.style.display = 'none';
		fund_fa1.style.display = '';
		src += '-enabled.png';
		btn.src = src;
		fund_amount_sel();
		return;
	}

	if (fund_s0.selectedIndex == 3) { // PrePaid Card
		fund_fa0.style.display = '';
		fund_fa1.style.display = 'none';
		src += '-enabled.png';
		btn.src = src;
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
	fund_s0 = document.getElementById('fund_method');
	fund_fa0 = document.getElementById('fund_ppcard');
	fund_fa1 = document.getElementById('fund_selamount');

	fund_method_sel();
}

function fund_submit() {
	var btn = document.getElementById('fund_btn1');
	btn = btn.src.substring(btn.src.lastIndexOf('-') + 1);

	if (btn == 'disabled.png') {
		alert('Please select a funding source.');
		return;
	}

	var s = fund_s0.selectedIndex;

	if (s == 0) {	// no source selected
		alert('Please select a funding source.');
		return;
	} else if (s == 3) {	// source == prepaid card
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

	if (s == 2) {	// source == PayPal
		lock(1);
		var pp = 'http://'+window.location.hostname+'/zetapay/core/payment/paypal.php?amount='+amount;
	        var win = window.open(pp, '', 'location=yes,menubar=yes,resizable=yes,status=yes,scrollbars=yes,toolbar=yes');

		if (!win.opener) {
			win.opener = self;
		}

		if (window.focus) {
			win.focus();
		}
	} else if (s == 1) {	// source == new credit card
		ccard_f0.amount.value = amount;
		main_display(2);
	} else {	// source == registered credit card
		lock(1);
		fund_f1.method.value = fund_s0[s].value;
		fund_f1.submit();
	}
}

function fund_error_HL(idx) {
	return;
}