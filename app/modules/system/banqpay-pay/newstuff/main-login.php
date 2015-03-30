<?

$source = $_POST['source'];
$amount = (float)$_POST['amount'];
$processed = 0;

?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<HTML>
<HEAD><TITLE>Welcome to Payments Without Borders</TITLE>

<LINK rel='stylesheet' href='http://localhost/Zetapay/zetapay/core/css/usrlogin.css' type='text/css'>
<LINK rel='shortcut icon' href='http://localhost/Zetapay/zetapay/images/favicon.ico'>

<SCRIPT language=javascript type='text/javascript' src='http://localhost/Zetapay/zetapay/core/lib/lib.js'>
</SCRIPT>

<SCRIPT language=javascript type='text/javascript' src='http://localhost/Zetapay/zetapay/core/lib/checkemail.js'>
</SCRIPT>

<SCRIPT language=javascript type='text/javascript'>
<!--
var form = 0;
var styleObj = new Array();
preloadImages('http://localhost/Zetapay/zetapay/images/ul.png, 'http://localhost/Zetapay/zetapay/images/ur.png',
		'http://localhost/Zetapay/zetapay/images/ll.png', 'http://localhost/Zetapay/zetapay/images/lr.png',
		'http://localhost/Zetapay/zetapay/images/rul.png', 'http://localhost/Zetapay/zetapay/images/rur.png',
		'http://localhost/Zetapay/zetapay/images/rll.png', 'http://localhost/Zetapay/zetapay/images/rlr.png',
		'http://localhost/Zetapay/zetapay/images/lul.png', 'http://localhost/Zetapay/zetapay/images/lur.png',
		'http://localhost/Zetapay/zetapay/images/lll.png', 'http://localhost/Zetapay/zetapay/images/llr.png');

function chksave(f) {
	var f = document.getElementById('f'+form);
	f.save.checked = !f.save.checked;
}

function init() {
	var f0 = document.getElementById('f0');

	if (Get_Cookie('usave')) {
		usrid = Get_Cookie('usrid');
		f0.save.checked = true;
	} else {
		usrid = false;
	}

	if (usrid != false) {
		f0.usrid.value = usrid;
		f0.pwd.focus();
	} else {
		f0.usrid.focus();
	}

//	setTimeout('location.reload(1);', 60000);


	styleObj[0] = getStyleObject('email0_T');
	styleObj[1] = getStyleObject('email1_T');
	styleObj[2] = getStyleObject('pwd0_T');
	styleObj[3] = getStyleObject('pwd1_T');
	styleObj[4] = getStyleObject('currency_T');
	styleObj[5] = getStyleObject('TOS_T');

	var f1 = document.getElementById('f1');

	var ppt_button = document.getElementById('ppt_button');
	ppt_button.innerHTML = ppSigninButton;
	return true;
}

function ppt_signin() {
	document.cookie = 'interface=2; path=/; domain=.banqpay.com';
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

	var email = f0.usrid.value;
	email = email.replace(/^\s+/, '');
	email = email.replace(/\s+$/, '');
	f0.usrid.value = email;

	var pwd = f0.pwd.value;

	if (email == '') {
		alert('Please specify the email address.');
		f0.usrid.select();
		f0.usrid.focus();
		return false;
	}

	if (checkemail(email) == false) {
		alert('Invalid email address.');
		f0.usrid.select();
		f0.usrid.focus();
		return false;
	}

	if (pwd == '') {
		alert('Please enter the password.');
		f0.pwd.select();
		f0.pwd.focus();
		return false;
	}

	if (pwd.length < 5) {
		alert('Password must be 5 or more characters.');
		f0.pwd.select();
		f0.pwd.focus();
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

	if (f1.pwd0.value.length < 5) {
		alert('Password is too short.');
		error_HL_1(2);
		return;
	}

	if (f1.pwd0.value != f1.pwd1.value) {
		alert('Passwords do not match.');
		error_HL_1(3);
		return;
	}

//	if (f1.currency.selectedIndex == 0) {
//		alert('Please select your home currency.');
//		error_HL_1(4);
//		return;
//	}

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

	f0.pwd.value = '';
	f0.usrid.focus();
	f0.usrid.select();

	var ifrm = document.getElementById('RS_1127830358_541813832007009');
	ifrm.src = '/blank.html';
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
		case 2:	f1.pwd0.value = '';
			f1.pwd1.value = '';
			f1.pwd0.focus();
			break;
		case 3:	f1.pwd1.value = '';
			f1.pwd1.focus();
			break;
	}

	return true;
}
//-->
</SCRIPT>
</HEAD>

<BODY bgcolor='#DCF1C8' onLoad='init();'>
<DIV id=main>
<IMG src='http://localhost/Zetapay/zetapay/images/ul.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:0px;'>
<IMG src='http://localhost/Zetapay/zetapay/images/ll.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:310px; left:0px;'>
<IMG src='http://localhost/Zetapay/zetapay/images/ur.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:00px; left:570px;'>
<IMG src='http://localhost/Zetapay/zetapay/images/lr.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:310px; left:570px;'>
<DIV id=banner>

<TABLE width=560 height=60 border=0 cellspacing=0 cellpadding=0>
 <TR>
  <TD width=10></TD>
  <TD width=270 valign=middle>
   <A href='http://zetapay.banqpay.com/' target='_blank'><IMG src='http://localhost/Zetapay/zetapay/images/bitpass-logo.png' alt='Payments Without Borders logo' border=0></A>
  </TD>
  <TD width=280 align=right valign=middle>
   <IMG id=banner_img src='http://localhost/Zetapay/zetapay/images/default-banner.gif' border=0 alt='Premium content'>
  </TD>
 </TR>
</TABLE>
</DIV>
<DIV id=signin>
<DIV id=action>
<IMG src='http://localhost/Zetapay/zetapay/images/rul.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:0px;'>
<IMG src='http://localhost/Zetapay/zetapay/images/rll.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:0px;'>
<IMG src='http://localhost/Zetapay/zetapay/images/rur.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:320px;'>
<IMG src='http://localhost/Zetapay/zetapay/images/rlr.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:320px;'>
<CENTER>
<FORM id=f0 action='/cmd/usr' method=post target='RS_1127830358_541813832007009'>
<INPUT type=hidden name=cmd value='login.pi'>
<INPUT type=hidden name=usrtime>
<INPUT type=hidden name=redirect value='/gateway/000000F3/pscomicaction.zip'>
<TABLE width=310 border=0 cellspacing=0 cellpadding=0>
 <TR>
  <TD width=100 height=12></TD>
  <TD width=20></TD>
  <TD width=190></TD>
 </TR>
 <TR>
  <TD colspan=3>
   <SPAN style='font-size:11px;'>Already have a Payments Without Border account?</SPAN>
  </TD>
 </TR>
 <TR>
  <TD colspan=3>
   <SPAN style='font-size:18px;'><B>Sign in and go!</B></SPAN>
  </TD>
 </TR>
 <TR>
  <TD colspan=3 height=20></TD>
 </TR>
 <TR>
  <TD height=22 align=right>Email address&nbsp;</TD>
  <TD colspan=2>
   <INPUT type=text name=usrid size=27 style='width:180px;' class=text>
  </TD>
 </TR>
 <TR>
  <TD height=16></TD>
  <TD align=center valign=middle>
    <INPUT type=checkbox name=save style='height:12px; width:12px;' id=save>
  </TD>
  <TD valign=middle>
   <SPAN onClick='chksave();'>Remember my email</SPAN>
  </TD>
 </TR>
 <TR>
  <TD colspan=3 height=4></TD>
 </TR>
 <TR>
  <TD height=22 align=right>Password&nbsp;</TD>
  <TD colspan=2>
   <INPUT type=password name=pwd onKeyPress='subform(event);' size=27 style='width:180px;' class=text>
  </TD>
 </TR>
 <TR>
  <TD height=16></TD>
  <TD colspan=2 valign=middle>
   &nbsp; <A href='/spend/resetpwd.html' target='_blank'>Forgot your password?</A>
  </TD>
 </TR>
 <TR>
  <TD colspan=3 height=40 align=right valign=bottom>
   <IMG src='http://localhost/Zetapay/zetapay/images/signin.png' alt='Login' border=0 width=78 height=34 onClick='submit0();' style='cursor:pointer;'>
  </TD>
 </TR>
</TABLE>
</FORM>
</CENTER>
</DIV>
<DIV id=info>
<IMG src='http://localhost/Zetapay/zetapay/images/lul.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:0px;'>
<IMG src='http://localhost/Zetapay/zetapay/images/lll.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:0px;'>
<IMG src='http://localhost/Zetapay/zetapay/images/lur.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:210px;'>
<IMG src='http://localhost/Zetapay/zetapay/images/llr.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:210px;'>
<P class=infoText style='margin-top:15px; font-size:11px;'>Payments powered by Payments Without Borders.</P>
<P class=infoHead>What is Payments Without Borders?</P>
<P class=infoText><B>It's like a prepaid phone card for buying content online!</B></P>
<P class=infoText><B>Safe and secure.</B> Using Payments Without Borders protects your privacy.</P>
<P class=infoText><B>Easy.</B> Quick to set up. Pay as little as one cent with a single click.</P>
<IMG src='http://localhost/Zetapay/zetapay/images/createaccnt.png' alt='Create an account' border=0 width=144 height=44 onClick='signup();' style='position:absolute; bottom:5px; right:10px; cursor:pointer;'>
</DIV>
</DIV>
<DIV id=signup style='display:none'>
<DIV id=action>
<IMG src='http://localhost/Zetapay/zetapay/images/rul.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:0px;'>
<IMG src='http://localhost/Zetapay/zetapay/images/rll.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:0px;'>
<IMG src='http://localhost/Zetapay/zetapay/images/rur.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:320px;'>
<IMG src='http://localhost/Zetapay/zetapay/images/rlr.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:320px;'>
<CENTER>
<FORM id=f1 name=f action='/cmd/usr' method=post target='RS_1127830358_541813832007009'>
<INPUT type=hidden name=cmd value='create-account'>
<INPUT type=hidden name=usrtime>
<INPUT type=hidden name=context value='1236'>
<INPUT type=hidden name=redirect value='/gateway/000000F3/pscomicaction.zip'>
<TABLE width=310 border=0 cellspacing=0 cellpadding=0 style='padding:0px; margin:0px;'>
 <TR>
  <TD width=120 height=10></TD>
  <TD width=20></TD>
  <TD width=70></TD>
  <TD width=90></TD>
 </TR>
 <TR>
  <TD colspan=4>
   &nbsp;<SPAN style='font-size:18px;'><B>Create a Payment Without Border account</B></SPAN>
  </TD>
 </TR>
 <TR>
  <TD colspan=4 height=8></TD>
 </TR>
 <TR>
  <TD height=25 align=right>
   <SPAN id=email0_T>Email address &nbsp;</SPAN>
  </TD>
  <TD colspan=3>
   <INPUT type=text name=email0 size=27 style='width:180px;' class=text>
  </TD>
 </TR>
 <TR>
  <TD height=24 align=right>
   <SPAN id=email1_T>Re-type email &nbsp;</SPAN>
  </TD>
  <TD colspan=3>
   <INPUT type=text name=email1 size=27 style='width:180px;' class=text>
  </TD>
 </TR>
 <TR>
  <TD height=24 align=right>
   <SPAN id=pwd0_T>Create password &nbsp;</SPAN>
  </TD>
  <TD colspan=2>
   <INPUT type=password name=pwd0 size=17 style='width:100px;' class=text>
  </TD>
  <TD valign=middle>
   <SPAN style='font-size:10px;'>&nbsp;5-16 characters</SPAN>
  </TD>
 </TR>
 <TR>
  <TD height=24 align=right>
   <SPAN id=pwd1_T>Re-type password &nbsp;</SPAN>
  </TD>
  <TD colspan=2>
   <INPUT type=password name=pwd1 size=17 style='width:100px;' class=text>
  </TD>
  <TD>
   <SPAN style='font-size:10px;'>&nbsp;Case-sensitive</SPAN>
  </TD>
 </TR>
 <TR>
  <TD height=24 align=right>
   <SPAN id=currency_T>Home currency &nbsp;</SPAN>
  </TD>
  <TD colspan=3>
   <SELECT name=currency style='width:125px;'>
    <OPTION value='USD'>US dollars</OPTION>
    <OPTION value='USD'>Canadian dollars</OPTION>
   </SELECT>
  </TD>
 </TR>
 <TR>
  <TD height=24 align=right valign=middle>
   <A href='http://corp.bitpass.com/legal/BuyerAgreement.html' target='_blank'>Terms of Service</A> &nbsp;
  </TD>
  <TD align=center valign=middle>
   <INPUT type=checkbox name=accept value=1 style='height:12px; width:12px;'>
  </TD>
  <TD colspan=2 valign=middle><SPAN id=TOS_T>I agree</SPAN></TD>
 </TR>
</TABLE>
<IMG src='http://localhost/Zetapay/zetapay/images/back.png' alt='Back' border=0 width=67 height=34 onClick='signin();' style='position:absolute; bottom:10px; right:126px; cursor:pointer;'>
<IMG src='http://localhost/Zetapay/zetapay/images/createaccnt-act.png' alt='Create account' border=0 width=118 height=34 onClick='submit1();' style='position:absolute; bottom:10px; right:10px; cursor:pointer;'>
</FORM>
</CENTER>
</DIV>
<DIV id=info>
<IMG src='http://localhost/Zetapay/zetapay/images/lul.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:0px;'>
<IMG src='http://localhost/Zetapay/zetapay/images/lll.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:0px;'>
<IMG src='http://localhost/Zetapay/zetapay/images/lur.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:210px;'>
<IMG src='http://localhost/Zetapay/zetapay/images/llr.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:210px;'>
<P class=infoHead style='margin-top:10px;'>Getting your content is quick and easy!</P>
<P class=infoText style='margin-top:14px;'><SPAN style='font-size:14px; font-weight:bolder;'>1.</SPAN> Create your account</P>
<P class=infoText style='margin-top:14px;'><SPAN style='font-size:14px; font-weight:bold;'>2.</SPAN> Fund your account</P>
<P class=infoText style='margin-top:14px;'><SPAN style='font-size:14px; font-weight:bold;'>3.</SPAN> Confirm your purchase</P>
<P class=infoText style='margin-top:14px;'>That's it!</P>
<P class=infoText>Payments Without Borders won't share your information with anyone. Our <A href='http://zetapay.banqpay.com/Zetapay/zetapay/legal/privacy.html' target='_blank'>Privacy Policy</A> says so.</P>
</DIV>
</DIV>
</DIV>

<IFRAME id='RS_1127830358_541813832007009' name='RS_1127830358_541813832007009' height=0 width=0 frameborder=0 scrolling=no style='margin:0px; padding:0px; visibility:hidden;' src='/blank.html'></IFRAME>

</BODY>
</HTML>