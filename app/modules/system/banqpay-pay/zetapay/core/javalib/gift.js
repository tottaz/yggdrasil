var gift_styleObj = new Array();
var gift_body_limit = 1024;
var gift_f0;
var gift_HasChanged_To = 0;
var gift_HasChanged_Name = 0;
var gift_body_count;

function gift_resetTo() {
	if (gift_HasChanged_To == 0) {
		gift_f0.to.value = "\0";
		gift_HasChanged_To = 1;
	}
}

function gift_resetName() {
	if (gift_HasChanged_Name == 0) {
		gift_f0.name.value = "\0";
		gift_HasChanged_Name = 1;
	}
}

function gift_counter() {

	if (gift_f0.body.value.length >= gift_body_limit) {
		gift_f0.body.value = gift_f0.body.value.substring(0, gift_body_limit);
	}

	gift_body_count.innerHTML= gift_body_limit - gift_f0.body.value.length;
}

function gift_init() {
	gift_f0 = document.getElementById('gift_f0');
	gift_body_count = document.getElementById('gift_body_count');

	if (gift_f0.body.value.length >= gift_body_limit) {
		gift_f0.body.value = gift_f0.body.value.substring(0, gift_body_limit);
	}

	gift_body_count.innerHTML= gift_body_limit - gift_f0.body.value.length;

        gift_styleObj[0] = getStyleObject('gift_from_T');
        gift_styleObj[1] = getStyleObject('gift_from_T');
        gift_styleObj[2] = getStyleObject('gift_to_T');
        gift_styleObj[3] = getStyleObject('gift_subj_T');

        gift_HasChanged_Name = 0;

	var btn = document.getElementById('btn1');
	var src = '/zetapay/images/buyer/continue';

	if (1*getusrbal() >= price) {
		src += '-enabled.png';
	} else {
		src += '-disabled.png';
	}

	btn.src = src;
}

function gift_submit() {
	gift_error_HL(-1);

	if (1*getusrbal() < price) {
		alert('Not enough balance: please fund your account first.');
		main_display(2);
		return;
	}

	var f = gift_f0;

	// check Subject field
	if (f.subj.value.length > 255) {
		return confirm('Subject is too long (max 255 chars) and will be truncated. Is it OK?');
	}

	// check Message field
	if (f.body.value.length > gift_body_limit) {
		if (confirm('Message is too long (max. '+gift_body_limit+' chars) and will be truncated. Is it OK?')) {
			gift_f0.body.value = gift_f0.body.value.substring(0, gift_body_limit);
		} else {
			return;
		}
	}

	// check To field
	var email = f.to.value;
	var rmWS = new RegExp(' +');
	email = email.replace(rmWS, '');
	email = email.replace(rmWS, '');

	if (email == 'your@friend.com') {
		alert('Please specify email address');
		gift_error_HL(2);
		return;
	}

	if (email.length == 0) {
		alert('Please specify email address');
		gift_error_HL(2);
		return;
	}

	var emailArr = email.split(',');

	for (var i = 0; i < emailArr.length; i++) {
		if (chkemail(emailArr[i]) == false || emailArr[i].length > 128) {
			alert('Invalid email address: '+emailArr[i]);
			gift_error_HL(2);
			return;
		}
	}

	f.to.value = email;

	// check Name field
	if (f.name.value.length > 128) {
		alert('Name is too long. (max. 128 chars)');
		gift_error_HL(0);
		return;
	}

	// check From field
	email = f.from.value;
	email = email.replace(rmWS, '');
	email = email.replace(rmWS, '');

	if (email.length == 0) {
		alert('Please specify email address');
		gift_error_HL(1);
		return;
	}

	if (chkemail(email) == false || email.length > 128) {
		alert('Invalid email address: '+email);
		gift_error_HL(1);
		return;
	}

	f.from.value = email;

	f.submit();
}

function gift_error_HL(idx) {
	var f = gift_f0;

	for (i = 0; i < 4; i++) {
		gift_styleObj[i].color = 'black';
		gift_styleObj[i].fontWeight = 'normal';
	}

	if (gift_styleObj[idx] != null) {
		gift_styleObj[idx].color = 'red';
		gift_styleObj[idx].fontWeight = 'bold';
	}

	switch (idx) {
		case 0: f.name.select();
			f.name.focus();
			break;
		case 1: f.from.select();
			f.from.focus();
			break;
		case 2: f.to.select();
			f.to.focus();
			break;
		case 3: f.subj.select();
			f.subj.focus();
			break;
	}

	return;
}