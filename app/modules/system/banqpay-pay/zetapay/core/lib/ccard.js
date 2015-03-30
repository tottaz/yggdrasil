<!--
var ccard_styleObj = new Array();
var ccard_f0;
var ccard_cvv2_img;

function ccard_chkLUHN(number) {
	var d = number.split('');
	var s = String();
	d = d.reverse();

	for (var i = 0; i < d.length; ++i) {
		s += (i % 2) ? 2*d[i] : d[i];
	}

	d = s.split('');
	var sum = 0;
	for (var i = 0; i < d.length; ++i) {
		sum += 1*d[i];
	}

	return (sum % 10) ? 0 : 1;
}

function ccard_cvv2help() {     
	window.open('zetapay/help/cvv2.html', '', 'location=no,resizable=yes,width=400,height=650,status=yes,scrollbar=auto');
}

function ccard_type(j) {
	if (ccard_f0.type.selectedIndex == 2) {
		ccard_cvv2_img.src = 'zetapay/images/buyer/cvv2-amex.jpg';
	} else {
		ccard_cvv2_img.src = 'zetapay/images/buyer/cvv2-vmc.jpg';
	}
}

function ccard_chksave() {
	ccard_f0.save.checked = !ccard_f0.save.checked;
}

function ccard_init() {

	ccard_f0 = document.getElementById('ccard_f0');
	ccard_cvv2_img = document.getElementById('cvv2img');

	ccard_styleObj[0] = getStyleObject('ccard_type_T');
	ccard_styleObj[1] = getStyleObject('ccard_number_T');
	ccard_styleObj[2] = getStyleObject('ccard_expdate_T');
	ccard_styleObj[3] = getStyleObject('ccard_expdate_T');
	ccard_styleObj[4] = getStyleObject('ccard_name_T');
	ccard_styleObj[5] = getStyleObject('ccard_CVV2_T');
	ccard_styleObj[6] = getStyleObject('ccard_addr1_T');
	ccard_styleObj[7] = getStyleObject('ccard_addr2_T');
	ccard_styleObj[8] = getStyleObject('ccard_city_T');
	ccard_styleObj[9] = getStyleObject('ccard_state_T');
	ccard_styleObj[10] = getStyleObject('ccard_zip_T');
	ccard_styleObj[11] = getStyleObject('ccard_phone_T');
	ccard_styleObj[12] = getStyleObject('ccard_country_T');

	ccard_type();
}

function ccard_submit() {
	var btn = document.getElementById('ccard_btn1');
	btn = btn.src.substring(btn.src.lastIndexOf('-') + 1);

	if (btn == 'disabled.png') {
		return;
	}

	ccard_error_HL(-1);
	var f = ccard_f0;

	var rmWS = /\s+/g;
	var rmLWS = /^\s+/;
	var rmTWS = /\s+$/;
	var rmNN = /\D/g;
	var rmNSN = /[^01-9\+\-\.\,\(\)\[\]xX ]/g;

	// clean up & check the card number and type
	var number = f.number.value;
	number = number.replace(rmWS, '');
	number = number.replace(rmNN, '');

	var reCCNUM;
	var cctype = f.type.selectedIndex;

	// Visa
	if (cctype == 0) {
		reCCNUM = /^4(\d{12}|\d{15})$/;
	}

	// MasterCard
	if (cctype == 1) {
		reCCNUM = /^5[1-5]\d{14}$/;
	}

	// Amerecian Express
	if (cctype == 2) {
		reCCNUM = /^3[47](\d{12}|\d{13})$/;
	}

	// Discover
	if (cctype == 3) {
		reCCNUM = /^6011\d{12}$/;
	}

	if (number.length < 13 || number.length > 16) {
		alert('Please enter credit card number');
		ccard_error_HL(1);
		return;
	}

	if (!reCCNUM.test(number)) {
		alert('Incorrect number format: please enter correct card number');
		ccard_error_HL(1);
		return;
	}

	if (!ccard_chkLUHN(number)) {
		alert('Incorrect number format: please enter correct card number');
		ccard_error_HL(1);
		return;
	}
	f.number.value = number;


	// check the expiration date
	var month = f.month.options[f.month.selectedIndex].value;
	var year = f.year.options[f.year.selectedIndex].value;
	if (month == 'mm') {
		alert('Please select the expiration date(month)');
		ccard_error_HL(2);
		return;
	}

	if (year == 'yy') {
		alert('Please select the expiration date(year)');
		ccard_error_HL(3);
		return;
	}
	var now = new Date();
	var cyear = now.getYear();
	if (cyear.toString().length < 4) cyear += 1900;
	var cmonth = 1 + now.getMonth();

	if (cyear == (2000+1*year) && cmonth > 1*month) {
		alert('Please check the expiration date');
		ccard_error_HL(2);
		return;
	}

	if (cyear > 2000 + 1*year) {
		alert('Please check the expiration date');
		ccard_error_HL(3);
		return;
	}

	// clean up & check the name
	var name = f.name.value;
	name = name.replace(rmLWS, '');
	name = name.replace(rmTWS, '');

	if (name.length < 3) {
		alert('Please enter the name on the credit card');
		ccard_error_HL(4);
		return false;
	}
	f.name.value = name;

	// clean up & check the CVV2
	var cvv2 = f.cvv2.value;
	cvv2 = cvv2.replace(rmWS, '');
	cvv2 = cvv2.replace(rmNN, '');

	if (!(cvv2.length == 3 || cvv2.length == 4)) {
		alert('Please enter the card verification number');
		ccard_error_HL(5);
		return false;
	}

	if (cctype != 2 && cvv2.length != 3) {
		alert('The card verification number for Visa, MasterCard and Discover is a 3-digit number on the back of the card');
		ccard_error_HL(5);
		return false;
	}

	if (cctype == 2 && cvv2.length != 4) {
		alert('The card verification number for American Express cards is a 4-digit number on the front of the card');
		ccard_error_HL(5);
		return false;
	}
	f.cvv2.value = cvv2;

	// clean up & check the address
	var addr1 = f.addr1.value;
	var addr2 = f.addr2.value;
	addr1 = addr1.replace(rmLWS, '');
	addr1 = addr1.replace(rmTWS, '');
	addr2 = addr2.replace(rmLWS, '');
	addr2 = addr2.replace(rmTWS, '');

	if (addr1.length < 3) {
		alert('Please enter the billing address');
		ccard_error_HL(6);
		return false;
	}
	f.addr1.value = addr1;
	f.addr2.value = addr2;

	// clean up & check the city
	var city = f.city.value;
	city = city.replace(rmLWS, '');
	city = city.replace(rmTWS, '');

	if (city.length == 0) {
		alert('Please enter the city');
		ccard_error_HL(8);
		return false;
	}
	f.city.value = city;

	// clean up & check the state
	var state = f.state.value;
	state = state.replace(rmLWS, '');
	state = state.replace(rmTWS, '');

/*
	if (state.length < 3) {
		alert('Please enter the state');
		ccard_error_HL(9);
		return false;
	}
*/
	f.state.value = state;

	// clean up & check the zip
	var zip = f.zip.value;
	zip = zip.replace(rmLWS, '');
	zip = zip.replace(rmTWS, '');

	if (zip.length == 0) {
		alert('Please enter the postal/zip code');
		ccard_error_HL(10);
		return false;
	}
	f.zip.value = zip;

	// clean up the phone number
	var phone = f.phone.value;
	phone = phone.replace(rmLWS, '');
	phone = phone.replace(rmTWS, '');
	phone = phone.replace(rmWS, ' ');
	phone = phone.replace(rmNSN, '');

	if (phone.length < 3) {
		alert('Please enter the phone number');
		ccard_error_HL(11);
		return false;
	}
	f.phone.value = phone;

	// check the country code
	var country = f.country.options[f.country.selectedIndex].value;

	if (country == '00') {
		alert('Please select the country');
		ccard_error_HL(12);
		return false;
	}

	main_display(4);

	f.submit();
}

function ccard_error_HL(idx) {
	var f = ccard_f0;
	var i = 0;

	for (i = 0; i < 13; i++) {
		ccard_styleObj[i].color = '#112A32';
		ccard_styleObj[i].fontWeight = 'normal';
	}

	if (ccard_styleObj[idx] != null) {
		ccard_styleObj[idx].color = 'red';
		ccard_styleObj[idx].fontWeight = 'bold';
	}

	if (idx == 2 || idx == 3) {
		ccard_styleObj[2].color = 'red';
		ccard_styleObj[2].fontWeight = 'bold';
	}

	if ((idx > 0) && (idx < 5)) {
		ccard_f0.type.focus();
	} else {
		ccard_f0.name.focus();
	}

	switch (idx) {
		case 1: //f.number.select();
			//f.number.focus();
			break;
		case 2: //f.month.focus();
			break;
		case 3: //f.year.focus();
			break;
		case 4: f.name.select();
	//		f.name.focus();
			break;
		case 5: f.cvv2.select();
	//		f.cvv2.focus();
			break;
		case 6: f.addr1.select();
	//		f.addr1.focus();
			break;
		case 7: f.addr2.select();
	//		f.addr2.focus();
			break;
		case 8: f.city.select();
	//		f.city.focus();
			break;
		case 9: f.state.select();
	//		f.state.focus();
			break;
		case 10: f.zip.select();
	//		 f.zip.focus();
			 break;
		case 11: f.phone.select();
	//		 f.phone.focus();
			 break;
		case 12: f.country.focus();
			 break;
	}

	return;
}
//-->
