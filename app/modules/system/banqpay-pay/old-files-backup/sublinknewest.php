<?
include('config.php');   
require_once($rootDir.$subDir.'core/include/common.php');    

session_start();

// Or simply use a Superglobal ($_SERVER or $_ENV)
$ip = $_SERVER['REMOTE_ADDR'];

$merchant_id = $_SESSION['merchant_id'];
$link_id = $_SESSION['link_id'];
$link_to_go = $_SESSION['link_to_go'];

if($merchant_id == '' || $link_id == '' || $link_to_go == '') {
    
  $link_to_go = $_SERVER['QUERY_STRING'];

  $linearray = split('\\$', $link_to_go); //<--NOTE USE OF FOUR(4)backslashes

  $_SESSION['merchant_id'] = $linearray[1];
  $_SESSION['link_id'] = $linearray[2];
  $_SESSION['link_to_go'] = $linearray[3];
  
  $merchant_id = $_SESSION['merchant_id'];
  $link_id = $_SESSION['link_id'];
  $link_to_go = $_SESSION['link_to_go'];

}

//
// Have to check if merchant exist and the merchant link exist.
//
if($link_id != '') {
    $rs = $zetadb->Execute("SELECT * FROM ".TBL_MERCHANT_LINK." WHERE merchant_id=$merchant_id AND url_id=$link_id");
    $check_link = $rs->FetchNextObject();
    if($check_link == '') {
		$errlogin = "Merchant Link do not exist";
    } else {
        $rs = $zetadb->Execute("SELECT * FROM ".TBL_MERCHANT_LINK." WHERE merchant_id=$merchant_id AND url_id=$link_id AND active='Y'");
        $check_link = $rs->FetchNextObject();
        if($check_link == '') {
		    $errlogin = "Merchant Link is not active";
        }
    }
    if (!$errlogin) {
        //
        //      If link exixst Update link clicks
        //
        $zetadb->Execute("UPDATE ".TBL_MERCHANT_LINK." SET clicks=clicks+1 WHERE merchant_id=$merchant_id AND url_id=$link_id");
    }       
}

    ob_start("ob_gzhandler");

//
//     Start Session
//
//
//      Script to open the window after the check are done
//      <script>
//        javascript:popwindow('http://www.banqpay.com/sublink.php?$105$11$','scrollbars,resizable,top=15,left=15,width=620,height=360')
//    </script>
//
    $suid = $_SESSION['suid'];

    // in: $atype, $requirelogin
    // out: $userip, $suid, $user, $data, $id, $id_post

    ($userip = $_SERVER['HTTP_X_FORWARDED_FOR']) or ($userip = $_SERVER['REMOTE_ADDR']);
    $justloggedin = 0;
    
//
// Login to the account
//

if($_POST['cmd'] == 'login') {
	$ok = 1;
    if($_POST['password'] && $ok){
        $rs = $zetadb->Execute("SELECT * FROM ".TBL_SYSTEM_USERS." WHERE (email='".addslashes($_POST['username'])."') AND password='".addslashes($_POST['password'])."'");
		$data = $rs->FetchNextObject();
		if ($data){
			$suid = substr( md5($userip.time()), 8, 16 );
			$zetadb->Execute("UPDATE ".TBL_SYSTEM_USERS." SET suid='$suid',signed_on=NOW(),lastip='$userip' WHERE id=$data->ID");
			if($use_iplogging){
				$zetadb->Execute("INSERT INTO ".TBL_SYSTEM_LOGINS." SET user='$data->ID',date=NOW(),ipaddress='$userip', email='".addslashes($_POST['username'])."'");
			}
			$_SESSION['suid'] = $suid;
			$justloggedin = 1;
		}else{
			$errlogin = "You have entered a wrong username or password";
		}
	 }else{
		$errlogin = "You have entered a wrong username or password";
	 }
}    

	$suid = $_SESSION['suid'];

	if(!$suid){
		($suid = $_POST['suid']) or ($suid = $_GET['suid']);
	}
	if (addslashes($suid) != $suid){
		unset($suid);
	}

    if ($suid){
	    if ($action == 'logout'){
		    $zetadb->Execute("UPDATE ".TBL_SYSTEM_USERS." SET suid='xxx".uniqid('')."' WHERE suid='$suid'");
		    $zetadb->Execute("DELETE FROM ".TBL_SYSTEM_VISITORS." WHERE ip='$userip'");
	    }
	    if (!$data) {
		    $rs = $zetadb->Execute("SELECT * FROM ".TBL_SYSTEM_USERS." WHERE suid='$suid' AND DATE_ADD(lastlogin,INTERVAL $session_mins MINUTE)>NOW() AND lastip='$userip'");
		    $data = $rs->FetchNextObject();
        }
	    if ($data){
	        $user = $data->ID;
	        if ($data->SUSPENDED){
		        $errlogin = "Your account is suspended, please contact administrator";
	        }else{
		        $zetadb->Execute("UPDATE ".TBL_SYSTEM_USERS." SET lastlogin=NOW() WHERE id=$user");
		        if($use_iplogging){
				    $zetadb->Execute("INSERT INTO ".TBL_SYSTEM_LOGINS." SET user='$data->ID',date=NOW(),ipaddress='$userip', email='".addslashes($_POST['username'])."'");
	            }
	        }
        }else{
		    $suid = '';
	    }
    }
    

if ($user){
//
// Have to check if link has expired first this used check number of times if zero check if time expired.
//
    $rs = $zetadb->Execute("SELECT * FROM ".TBL_MERCHANT_ACTIVE_LINK." WHERE merchant_id=$merchant_id AND id='$user' AND link_to_go='$link_to_go'");
    $check_link = $rs->FetchNextObject();

    if($check_link != '') {
        //
        //   Check Duration Number of Times
        //
        if($check_link->DURATION < '1') {
            //
            //  Delete any links that has expired and have duration to zero
            //
            $zetadb->Execute("DELETE FROM ".TBL_MERCHANT_ACTIVE_LINK." WHERE date_last<NOW() AND duration<'1' AND link_id='$link_id' AND id='$user' AND link_to_go='$link_to_go'");
        } else {
        //
        //  Still Duration left on the link, subtract duration, and return to the merchant link
        //    
            $zetadb->Execute("UPDATE ".TBL_MERCHANT_ACTIVE_LINK." SET duration=duration-1 WHERE merchant_id='$merchant_id' AND link_id='$link_id' AND id='$user' AND link_to_go='$link_to_go'");
            
            $rs = $zetadb->Execute("SELECT * FROM ".TBL_MERCHANT_LINK." WHERE url_id='$link_id'");
            $a = $rs->FetchNextObject();

	        $merchant_link = $a->URL_LINK;
	        $merchant_link .= $link_to_go;
            
            unset($_SESSION['merchant_id']);
            unset($_SESSION['link_id']);
            unset($_SESSION['link_to_go']);
            
            unset($merchant_id);
            unset($link_id);
            unset($link_to_go);
?>
            <script>

                self.opener.document.forms['www.epnn.com'].useragent="<? echo $_SERVER['HTTP_USER_AGENT']; ?>";
                self.opener.document.forms['www.epnn.com'].remoteaddr="<? echo $_SERVER["REMOTE_ADDR"]; ?>";
                self.opener.document.forms['www.epnn.com'].action="<? echo $merchant_link ?>";
                self.opener.document.forms['www.epnn.com'].submit();
                //self.opener.location.href="<? echo $merchant_link ?>";
                self.close();

                </script>
<?            
            exit;
        }
    }
}
    

//
//  Create Account
//
if($_POST['cmd'] == 'create-account') {

	$password = $_POST['password0'];

	if(!isset($_GET["ipaddress"]) || ($_GET["ipaddress"] == "")) {
		$ipaddress = $_SERVER['REMOTE_ADDR'];
		$local = 1;
	} else {
		$ipaddress = $_GET["ipaddress"];
		$local = 0;
	}

    $rs = $zetadb->Execute("SELECT * FROM ".TBL_SYSTEM_USERS." WHERE email='".addslashes($_POST['email0'])."'");
	$data = $rs->FetchNextObject();
	if (!$data){
	        $pincode = CreatePincode();
#	$password = CreatePassword();
	        $sql = "INSERT INTO ".TBL_SYSTEM_USERS." SET username='{$_POST['email0']}', email='{$_POST['email0']}',password='$password',pin='$pincode',referredby='$referer',signed_on=NOW()";
	        $zetadb->Execute($sql);
            $user = $zetadb->Insert_ID();
            $merch1 = $zetadb->Execute("SELECT * FROM ".TBL_SYSTEM_USERS." WHERE id='$merchant_id'");
	        $m1 = $merch1->FetchNextObject();
            if ($m1->SIGNUP_BONUS && $m1->SIGNUP_BONUS != 0){  
		        transact($merchant_id,$user,$m1->SIGNUP_BONUS,"Account signup bonus");
	        }
	        $info = $_POST['email']."%%".$pincode;
	        wrapmail(	$_POST['email0'], "Confirm E-mail for $sitename", $emailtop.gettemplate("email_signup", "$siteurl/zetapay/modules/buyer/buyer_confirm.php?id=$uid",$info,$password).$emailbottom,$defaultmail);

			$suid = substr( md5($userip.time()), 8, 16 );
	        $zetadb->Execute("UPDATE ".TBL_SYSTEM_USERS." SET suid='$suid',signed_on=NOW(),lastip='$userip' WHERE id=$user");
	        if($use_iplogging){
		        $zetadb->Execute("INSERT INTO ".TBL_SYSTEM_LOGINS." SET user='$user',date=NOW(),ipaddress='$userip', email='".addslashes($_POST['username'])."'");
	        }
	        $_SESSION['suid'] = $suid;
	        $justloggedin = 1;
	        $zetadb->Execute("UPDATE ".TBL_SYSTEM_USERS." SET lastlogin=NOW() WHERE id=$user");
            $rs = $zetadb->Execute("SELECT * FROM ".TBL_SYSTEM_USERS." WHERE id=$user");
	        $data = $rs->FetchNextObject();
	}else{
			$errlogin = "Userid and Password Exist";
    }

} elseif($_POST['cmd'] == 'fund-account') {

    require('zetapay/core/payment/firepay.php');

    /*
    *
    * Posting the transaction to FirePay
    *
    */
    
    // DEBUG MODE
    //$result=post_firepay($_POST['firepay'],true);
    // PRODUCTION MODE

    $cardType = cardType($_POST['type']);

	$firepay = array( 	'customerName' => $_POST['name'],
							'cardNumber' => $_POST['number'],
							'cardType' => $cardType,
							'cardExp' => $_POST['month'] . $_POST['year'],
                            'cvdIndicator' => '0',
							'amount' => $_POST['amount'],
							'merchantTxn' => $suid . '-' . date('Ymdhis'),
							'StreetAddr' => $_POST['addr1'] . $_POST['addr2'],
							'city' => $_POST['city'],
							'zip' => $_POST['zip'],
							'province' => $_POST['state'],
							'country' => $_POST['country'],
							'phone' => $_POST['phone'],
							'email' => $_POST['email']);

    $result=post_firepay($firepay,false); //debug

    if($result['status']=='SP') {

      $amount = $_POST['amount'];

//      $fees = myround($amount * $dep_np_percent / 100, 2) + $dep_np_fee;

      transact(18,$user,($amount),'Deposit','',0,1,'',addslashes($orderno));
	  // Notify admin
	  $message = "$user has just deposited {$currency}$amount via credit card!";
	  if ($dep_notify){
		    wrapmail($adminemail, "$sitename Deposit", $message, $defaultmail);
	  }
    //
    //  if errors
    //
    } elseif($result['status']=='E'){
        // Put failed logic here
		$errlogin = "You transaction failed, try again.".$result;
    } else {
		$errlogin = "You transaction failed, try again.".$result;
    }

} elseif($_POST['cmd'] == 'complete') {

//
// Look up the link details from the merchant link table.
//

      $rs = $zetadb->Execute("SELECT * FROM ".TBL_MERCHANT_LINK." WHERE url_id='$link_id'");
      $a = $rs->FetchNextObject();

//      $fees = myround($a->PRICE * $dep_np_percent / 100, 2) + $dep_np_fee;
      
//
//  Deduct purchase price from merchant account
//
      transact($user,$a->MERCHANT_ID,($a->PRICE),'Purchase','',0, 0,'',addslashes($orderno));
//
//  add merchant link for this buyer to the active merchant link table, add number of times and/or time link is active
//

    $expirydate = setexpirydate($a, $expirydate);
	$zetadb->Execute("INSERT INTO ".TBL_MERCHANT_ACTIVE_LINK." SET link_id='$link_id', merchant_id='$a->MERCHANT_ID' ,id='$user', duration='$a->DURATION', link_to_go='$link_to_go', date_last='$expirydate'");

//
//  Send email to user to confirm purchase - shoule be switch-able
//

	        $merchant_link = $a->URL_LINK;
	        $merchant_link .= $link_to_go;

            unset($_SESSION['merchant_id']);
            unset($_SESSION['link_id']);
            unset($_SESSION['link_to_go']);
            
            unset($merchant_id);
            unset($link_id);
            unset($link_to_go);
?>
            <script>

                self.opener.document.forms['www.epnn.com'].useragent="<? echo $_SERVER['HTTP_USER_AGENT']; ?>";
                self.opener.document.forms['www.epnn.com'].remoteaddr="<? echo $_SERVER["REMOTE_ADDR"]; ?>";
                self.opener.document.forms['www.epnn.com'].action="<? echo $merchant_link ?>";
                self.opener.document.forms['www.epnn.com'].submit();
                //self.opener.location.href="<? echo $merchant_link ?>";
                self.close();

                </script>
<?            
            exit;

} 

if($_POST['cmd'] == 'logout') {

    $zetadb->Execute("UPDATE ".TBL_SYSTEM_USERS." SET suid='xxx".uniqid('')."' WHERE suid='$suid'");
    $zetadb->Execute("DELETE FROM ".TBL_SYSTEM_VISITORS." WHERE ip='$userip'");
    
    session_unset();
    session_destroy();

?>
	<script>
		self.close();
	</script>
<?
}

if ($suid == '') {
    $id = ($suid ? "suid=$suid" : "");
    $id_post = "<input type=hidden name=suid value=$suid><input type=hidden name=a value=$action><input type=hidden name=pid value=\"$pid\">";

	// ------------------------------------------------------------
	// Generate login page
    if ($errlogin){
?>
            <script>
      		    alert('<? echo $errlogin ?>');
            </script>
<?
  	}
?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<HTML>
<HEAD><TITLE>Welcome to BanQpay</TITLE>

<LINK rel='stylesheet' href='zetapay/core/css/usrlogin.css' type='text/css'>
<LINK rel='shortcut icon' href='zetapay/images/buyer/favicon.ico'>

<SCRIPT language=javascript type='text/javascript' src='zetapay/core/lib/lib.js'>
</SCRIPT>

<SCRIPT language=javascript type='text/javascript' src='zetapay/core/lib/checkemail.js'>
</SCRIPT>

<SCRIPT language=javascript type='text/javascript'>
<!--
var form = 0;
var styleObj = new Array();
preloadImages(	'zetapay/images/buyer/ul.png', 'zetapay/images/buyer/ur.png',
		'zetapay/images/buyer/ll.png', 'zetapay/images/buyer/lr.png',
		'zetapay/images/buyer/rul.png', 'zetapay/images/buyer/rur.png',
		'zetapay/images/buyer/rll.png', 'zetapay/images/buyer/rlr.png',
		'zetapay/images/buyer/lul.png', 'zetapay/images/buyer/lur.png',
		'zetapay/images/buyer/lll.png', 'zetapay/images/buyer/llr.png'	);

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


	styleObj[0] = getStyleObject('email0_T');
	styleObj[1] = getStyleObject('email1_T');
	styleObj[2] = getStyleObject('pwd0_T');
	styleObj[3] = getStyleObject('pwd1_T');
	styleObj[4] = getStyleObject('currency_T');
	styleObj[5] = getStyleObject('TOS_T');

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
//-->
</SCRIPT>
</HEAD>

<BODY bgcolor='#003399' onLoad='init();'>

<DIV id=main>
<IMG src='zetapay/images/buyer/ul.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:0px;'>
<IMG src='zetapay/images/buyer/ll.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:310px; left:0px;'>
<IMG src='zetapay/images/buyer/ur.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:00px; left:570px;'>
<IMG src='zetapay/images/buyer/lr.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:310px; left:570px;'>

<DIV id=banner>
<TABLE width=560 height=60 border=0 cellspacing=0 cellpadding=0>
 <TR>
  <TD width=10></TD>
  <TD width=270 valign=middle>
   <A href='http://www.banqpay.com' target='_blank'><IMG src='zetapay/images/banqpay-logo.png' alt='BanQpayut Border logo' border=0></A>
  </TD>
 </TR>
</TABLE>
</DIV>

<DIV id=signin>
<DIV id=action>
<IMG src='zetapay/images/buyer/rul.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:0px;'>
<IMG src='zetapay/images/buyer/rll.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:0px;'>
<IMG src='zetapay/images/buyer/rur.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:320px;'>
<IMG src='zetapay/images/buyer/rlr.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:320px;'>
<CENTER>

<FORM id=f0 action='sublink.php' method=post>
<INPUT type=hidden name=cmd value='login'>
<INPUT type=hidden name=usrtime>
<INPUT type=hidden name=$merchant_id>
<INPUT type=hidden name=$link_id>
<INPUT type=hidden name=$merchant_id>
<TABLE width=310 border=0 cellspacing=0 cellpadding=0>
 <TR>
  <TD width=100 height=12></TD>
  <TD width=20></TD>
  <TD width=190></TD>
 </TR>
 <TR>
  <TD colspan=3>
   <SPAN style='font-size:11px;color:white;'>Already have a BanQpay account?</SPAN>
  </TD>
 </TR>
 <TR>
  <TD colspan=3>
   <SPAN style='font-size:18px;color:white;'><B>Sign in and go!</B></SPAN>
  </TD>
 </TR>
 <TR>
  <TD colspan=3 height=20></TD>
 </TR>
 <TR>
  <TD height=22 align=right>Email address&nbsp;</TD>
  <TD colspan=2>
   <INPUT type=text name=username size=27 style='width:180px;' class=text>
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
   <INPUT type=password name=password onKeyPress='subform(event);' size=27 style='width:180px;' class=text>
  </TD>
 </TR>
 <TR>
  <TD height=16></TD>
  <TD colspan=2 valign=middle>
   &nbsp; <A href='http://www.banqpay.com/index.php?a=buyer_remind&' target='_blank'>Forgot your password?</A>
  </TD>
 </TR>
 <TR>
  <TD colspan=3 height=40 align=right valign=bottom>
   <IMG src='zetapay/images/buyer/signin.png' alt='Login' border=0 width=78 height=34 onClick='submit0();' style='cursor:pointer;'>
  </TD>
 </TR>
</TABLE>
</FORM>
</CENTER>
</DIV>


<DIV id=info>
<IMG src='zetapay/images/buyer/lul.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:0px;'>
<IMG src='zetapay/images/buyer/lll.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:0px;'>
<IMG src='zetapay/images/buyer/lur.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:210px;'>
<IMG src='zetapay/images/buyer/llr.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:210px;'>
<P class=infoText style='margin-top:15px; font-size:11px;'>Payments powered by BanQpay.</P>
<P class=infoHead>What is BanQpay?</P>
<P class=infoText><B>It's like a prepaid card for buying content online!</B></P>
<P class=infoText><B>Safe and secure.</B> Using BanQpay protects your privacy.</P>
<P class=infoText><B>Easy.</B> Quick to set up. Pay as little as one cent with a single click.</P>
<IMG src='zetapay/images/buyer/createaccnt.png' alt='Create an account' border=0 width=144 height=44 onClick='signup();' style='position:absolute; bottom:5px; right:10px; cursor:pointer;'>
</DIV>
</DIV>

<DIV id=signup style='display:none'>
<DIV id=action>
<IMG src='zetapay/images/buyer/rul.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:0px;'>
<IMG src='zetapay/images/buyer/rll.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:0px;'>
<IMG src='zetapay/images/buyer/rur.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:320px;'>
<IMG src='zetapay/images/buyer/rlr.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:320px;'>
<CENTER>

<FORM id=f1 name=f action='sublink.php' method=post>
<INPUT type=hidden name=cmd value='create-account'>
<INPUT type=hidden name=usrtime>
<INPUT type=hidden name=context value='1236'>
<TABLE width=310 border=0 cellspacing=0 cellpadding=0 style='padding:0px; margin:0px;'>
 <TR>
  <TD width=120 height=10></TD>
  <TD width=20></TD>
  <TD width=70></TD>
  <TD width=90></TD>
 </TR>
 <TR>
  <TD colspan=4>
   &nbsp;<SPAN style='font-size:18px;'><B>Create a BanQpay account</B></SPAN>
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
   <INPUT type=password name=password0 size=17 style='width:100px;' class=text>
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
   <INPUT type=password name=password1 size=17 style='width:100px;' class=text>
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
<?
    $rs = $zetadb->Execute("SELECT * FROM ".TBL_SYSTEM_CURRENCIES."");
    while($a = $rs->FetchNextObject()) {
        echo "<OPTION value=\"$a->CODE\">$a->TITLE</OPTION>";
    }
?>
   </SELECT>
  </TD>
 </TR>
 <TR>
  <TD height=24 align=right valign=middle>
   <A href='zetapay/help/BuyerAgreement.html' target='_blank'>Terms of Service</A> &nbsp;
  </TD>
  <TD align=center valign=middle>
   <INPUT type=checkbox name=accept value=1 style='height:12px; width:12px;'>
  </TD>
  <TD colspan=2 valign=middle><SPAN id=TOS_T>I agree</SPAN></TD>
 </TR>
</TABLE>
<IMG src='zetapay/images/buyer/back.png' alt='Back' border=0 width=67 height=34 onClick='signin();' style='position:absolute; bottom:10px; right:126px; cursor:pointer;'>
<IMG src='zetapay/images/buyer/createaccnt-act.png' alt='Create account' border=0 width=118 height=34 onClick='submit1();' style='position:absolute; bottom:10px; right:10px; cursor:pointer;'>
</FORM>
</CENTER>
</DIV>

<DIV id=info>
<IMG src='zetapay/images/buyer/lul.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:0px;'>
<IMG src='zetapay/images/buyer/lll.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:0px;'>
<IMG src='zetapay/images/buyer/lur.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:210px;'>
<IMG src='zetapay/images/buyer/llr.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:210px;'>
<P class=infoHead style='margin-top:10px;'>Getting your content is quick and easy!</P>
<P class=infoText style='margin-top:14px;'><SPAN style='font-size:14px; font-weight:bolder;'>1.</SPAN> Create your account</P>
<P class=infoText style='margin-top:14px;'><SPAN style='font-size:14px; font-weight:bold;'>2.</SPAN> Fund your account</P>
<P class=infoText style='margin-top:14px;'><SPAN style='font-size:14px; font-weight:bold;'>3.</SPAN> Confirm your purchase</P>
<P class=infoText style='margin-top:14px;'>That's it!</P>
<P class=infoText>BanQpay won't share your information with anyone. Our <A href='zetapay/help/privacy.html' target='_blank'>Privacy Policy</A> says so.</P>
</DIV>

</DIV>
</DIV>
</BODY>
</HTML>
<?
} else {
//
//  Logged In - Check if Link is valid
//

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<HTML>
<HEAD><TITLE>BanQpay - Purchase Confirmation</TITLE>
<META http-equiv='pragma' content='no-cache'>
<META http-equiv='expires' content='-1'>

<LINK rel='stylesheet' href='zetapay/core/css/gateway.css' type='text/css'>
<LINK rel='shortcut icon' href='zetapay/images/buyer/favicon.ico'>

<SCRIPT language=javascript type='text/javascript' src='zetapay/core/lib/lib.js'>
</SCRIPT>

<SCRIPT language=javascript type='text/javascript' src='zetapay/core/lib/checkemail.js'>
</SCRIPT>

<SCRIPT language=javascript type='text/javascript' src='zetapay/core/lib/auth.js'>
</SCRIPT>

<SCRIPT language=javascript type='text/javascript' src='zetapay/core/lib/gift.js'>
</SCRIPT>

<SCRIPT language=javascript type='text/javascript' src='zetapay/core/lib/fund.js'>
</SCRIPT>

<SCRIPT language=javascript type='text/javascript' src='zetapay/core/lib/ccard.js'>
</SCRIPT>

<SCRIPT language=javascript type='text/javascript'>
<!--
var form = 0;
var price = 0.99;
var payin_minimum = 3.00;
var payin_minimum_fmt = '$3.00';
var payin_maximum = 1000;
var payin_maximum_fmt = '$1,000.00';
var styleObj = new Array();
var locked = 0;

preloadImages(	'zetapay/images/buyer/ul.png', 'zetapay/images/buyer/ur.png',
		'zetapay/images/buyer/ll.png', 'zetapay/images/buyer/lr.png',
		'zetapay/images/buyer/rul.png', 'zetapay/images/buyer/rur.png',
		'zetapay/images/buyer/rll.png', 'zetapay/images/buyer/rlr.png',
		'zetapay/images/buyer/lul.png', 'zetapay/images/buyer/lur.png',
		'zetapay/images/buyer/lll.png', 'zetapay/images/buyer/llr.png',
		'zetapay/images/buyer/progress.gif'			);

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
	unlock(2);

	locked = 1;
	unlock(4);
}

function signout() {
      self.opener.location.href="http://www.banqpay.com/logout.php";
      self.close();
}

function main_display(f) {
	if (locked) {
		return;
	}

	if ((f == 1) && (1*getusrbal() < price)) {
		alert('Account balance too low. Please fund your account.');
		main_display(2);
		return;
	}

	var auth = document.getElementById('auth');
	var gift = document.getElementById('gift');
	var fund = document.getElementById('fund');
	var ccard = document.getElementById('ccard');
	var cconfirm = document.getElementById('cconfirm');

	auth.style.display = 'none';
	gift.style.display = 'none';
	fund.style.display = 'none';
	ccard.style.display = 'none';
	cconfirm.style.display = 'none';

	form = f;
	switch (f) {
		case 0:	auth.style.display = '';	break;
		case 1:	gift.style.display = '';
			gift_f0.name.select();
			gift_f0.name.focus();
			break;
		case 2:	fund.style.display = '';	break;
		case 3:	ccard.style.display = '';	break;
		case 4:	cconfirm.style.display = '';	break;
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
		case 1:	gift_submit();		break;
		case 2:	fund_submit();		break;
		case 3:	ccard_submit();		break;
	}
}

function error_HL(idx) {
	switch (form) {
		case 0:	auth_error_HL(idx);	break;
		case 1: gift_error_HL(idx);	break;
		case 2: fund_error_HL(idx);	break;
		case 3: ccard_error_HL(idx);	break;
	}
}

function lock(f) {
	if (locked) {
		return;
	}

	if (f == 2) {	// funding form
		var btn = document.getElementById('fund_btn1');
        	btn.src = btn.src.substring(0, btn.src.lastIndexOf('-')) + '-disabled.png';

		var fsrc = document.getElementById('fund_method');
		fsrc.style.display = 'none';
	}

	if (f == 4) {	// cconfirm form
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

	if (f == 2) {	// funding form
		var btn = document.getElementById('fund_btn1');
        	btn.src = btn.src.substring(0, btn.src.lastIndexOf('-')) + '-enabled.png';

		var fsrc = document.getElementById('fund_method');
		fsrc.style.display = '';
	}

	if (f == 4) {	// cconfirm form
		var btn = container.document.getElementById('cconfirm_btn1');
        	btn.src = btn.src.substring(0, btn.src.lastIndexOf('-')) + '-enabled.png';
	}

	var wait = document.getElementById('wait');
	wait.style.display = 'none';
}

function init() {

	auth_init();
	gift_init();
	fund_init();
	ccard_init();


	return true;
}
//-->
</SCRIPT>
</HEAD>

<BODY bgcolor='#003399' onLoad='init();'>

<?
    $rs = $zetadb->Execute("SELECT * FROM ".TBL_MERCHANT_LINK." WHERE url_id='$link_id'");
    $a = $rs->FetchNextObject();
    if (!$a){
?>
<SCRIPT language=javascript type='text/javascript'>
		alert('The link your try to access, do not exist.');
</SCRIPT>
<?
}
?>

<DIV id=auth>
<DIV id=main1>
<IMG src='zetapay/images/buyer/ul.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:0px;'>
<IMG src='zetapay/images/buyer/ll.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:310px; left:0px;'>
<IMG src='zetapay/images/buyer/ur.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:570px;'>
<IMG src='zetapay/images/buyer/lr.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:310px; left:570px;'>

<DIV id=banner>
<TABLE width=560 height=60 border=0 cellspacing=0 cellpadding=0>
 <TR>
  <TD width=10></TD>
  <TD width=270 valign=middle>
   <A href='http://www.banqpay.com' target='_blank'><IMG src='zetapay/images/banqpay-logo.png' alt='BanQpay logo' border=0></A>
  </TD>
 </TR>
</TABLE>
</DIV>

<!-- authorization -->
<DIV id=action>
<IMG src='zetapay/images/buyer/rul.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:0px;'>
<IMG src='zetapay/images/buyer/rll.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:0px;'>
<IMG src='zetapay/images/buyer/rur.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:340px;'>
<IMG src='zetapay/images/buyer/rlr.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:340px;'>
<P style='font-size:18px; font-weight:bolder; margin-top:15px;'>Confirm your purchase</P>

<FORM id='auth_f0' action='sublink.php' method=post target='_self'>
<INPUT type=hidden name=cmd value='complete'>
<INPUT type=hidden name=usrtime>
<DIV id=item>
<TABLE width=330 border=0 cellspacing=0 cellpadding=0>
 <TR>
  <TD width=10 height=8></TD>
  <TD width=40></TD>
  <TD width=270></TD>
  <TD width=10></TD>
 </TR>
 <TR>
  <TD></TD>
  <TD colspan=2>
   <SPAN style='font-size:10px;'>You selected:</SPAN>
  </TD>
  <TD></TD>
 </TR>
 <TR>
  <TD colspan=4 height=4></TD>
 </TR>
 <TR>
  <TD></TD>
  <TD colspan=2 valign=middle>
   <SPAN style='font-size:14px; font-weight:bold;'><? echo $a->LINK_NAME ?></SPAN>
  </TD>
  <TD></TD>
 </TR>
 <TR>
  <TD colspan=4 height=4></TD>
 </TR>
 <TR>
  <TD></TD>
  <TD align=right>
   <SPAN style='font-size:10px;'>Price:&nbsp;</SPAN>
  </TD>
  <TD>
   <SPAN style='font-size:10px;'><? echo $a->PRICE ?></SPAN>
  </TD>
  <TD></TD>
 </TR>
 <TR>
  <TD colspan=4 height=4></TD>
 </TR>
 <TR>
  <TD></TD>
  <TD align=right>
   <SPAN style='font-size:10px;'>Terms:&nbsp;</SPAN>
  </TD>
  <TD>
 <? 
if($a->TIME_DURATION == '1') {
?>
   <SPAN style='font-size:10px;'>Up to <? echo $a->DURATION ?> visits within <? echo $a->TIME_PERIOD ?> secondss</SPAN>
<?

} elseif($a->TIME_DURATION == '2') {
?>
   <SPAN style='font-size:10px;'>Up to <? echo $a->DURATION ?> visits within <? echo $a->TIME_PERIOD ?> minutes</SPAN>
<?

} elseif($a->TIME_DURATION == '3') {
?>
   <SPAN style='font-size:10px;'>Up to <? echo $a->DURATION ?> visits within <? echo $a->TIME_PERIOD ?> hours</SPAN>
<?

} elseif($a->TIME_DURATION == '4') {
?>
   <SPAN style='font-size:10px;'>Up to <? echo $a->DURATION ?> visits within <? echo $a->TIME_PERIOD ?> days</SPAN>
<?
    
} elseif($a->TIME_DURATION == '5') {
?>
   <SPAN style='font-size:10px;'>Up to <? echo $a->DURATION ?> visits within <? echo $a->TIME_PERIOD ?> months</SPAN>
<?

} elseif($a->TIME_DURATION == '6') {
?>
   <SPAN style='font-size:10px;'>Up to <? echo $a->DURATION ?> visits within <? echo $a->TIME_PERIOD ?> years</SPAN>
<?

} else {
?>
   <SPAN style='font-size:10px;'>Up to <? echo $a->DURATION ?> visits</SPAN>
<?
}   
?>
  </TD>
  <TD></TD>
 </TR>
</TABLE>
</div>
<?
//<TABLE border=0 cellspacing=0 cellpadding=0 style='position:absolute; bottom:10px; left:10px;'>
// <TR>
//  <TD width=20 height=34 align=right>
//   <INPUT type=checkbox name=giftchk style='margin:0px; padding:0px;' onClick='auth_giftchk(0);'>
//  </TD>
//  <TD width=150 valign=middle>
//   &nbsp; <SPAN onClick='auth_giftchk(1);'>Email this as a gift</SPAN>
//  </TD>
// </TR>
//</TABLE>
?>
<IMG src='zetapay/images/buyer/signout.png' alt='Sign out' border=0 width=78 height=34 onClick='signout();' style='position:absolute; bottom:10px; right:88px; cursor:pointer;'>
<IMG id=btn0 src='zetapay/images/buyer/confirm-enabled.png' alt='Confirm your purchase' border=0 width=78 height=34 onClick='main_submit(0);' style='position:absolute; bottom:10px; right:10px; cursor:pointer;'>
</FORM>
</DIV>

<DIV id=info>
<IMG src='zetapay/images/buyer/lul.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:0px;'>
<IMG src='zetapay/images/buyer/lll.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:0px;'>
<IMG src='zetapay/images/buyer/lur.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:190px;'>
<IMG src='zetapay/images/buyer/llr.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:190px;'>

<?
$balance = balance($user, 1);
setcookie("bal", $balance);
?>

<P class=infoHead><B>Almost done!</B></P>
<P class=infoText style='line-height:150%;'>You can access your item immediately after you click confirm.</P>
<P class=infoText style='position:absolute; bottom:47px;'><B>Balance:&nbsp;</B><?=dpsumm($balance)?></P>
<IMG src='zetapay/images/buyer/fundaccnt.png' border=0 alt='Fund account' style='position:absolute; bottom:10px; right:10px; cursor:pointer;' onClick='main_display(2);'>
</DIV>
</DIV>
</DIV>
<!-- buy/free for a friends -->
<DIV id=gift style='display:none;'>
<DIV id=main2>
<IMG src='zetapay/images/buyer/ul.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:0px;'>
<IMG src='zetapay/images/buyer/ll.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:490px; left:0px;'>
<IMG src='zetapay/images/buyer/ur.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:570px;'>
<IMG src='zetapay/images/buyer/lr.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:490px; left:570px;'>
<DIV id=banner>
<TABLE width=560 height=60 border=0 cellspacing=0 cellpadding=0>
 <TR>
  <TD width=10></TD>
  <TD width=270 valign=middle>
   <A href='http://www.banqpay.com' target='_blank'><IMG src='zetapay/images/banqpay-logo.png' alt='BanQpay logo' border=0></A>
  </TD>
 </TR>
</TABLE>
</DIV>
<DIV id=panel>
<IMG src='zetapay/images/buyer/rul.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:0px;'>
<IMG src='zetapay/images/buyer/rll.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:400px; left:0px;'>
<IMG src='zetapay/images/buyer/rur.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:550px;'>
<IMG src='zetapay/images/buyer/rlr.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:400px; left:550px;'>
<DIV id=ipanel>
<P style='font-size:18px; font-weight:bold; margin-bottom:5px;'>Buy for a friend</P>
<FORM id='gift_f0' action='sublink.php' method=post target='BQ_TEST'>
<INPUT type=hidden name=sku value=''>
<INPUT type=hidden name=offer value=''>
<INPUT type=hidden name=voucher value=''>
<INPUT type=hidden name=context value=''>
<TABLE width=515 border=0 cellspacing=0 cellpadding=0 border:1px style='background-color:#7BAF51;'>
 <TR>
  <TD width=40 height=6></TD>
  <TD width=475></TD>
 </TR>
 <TR>
  <TD align=right>Name:&nbsp;</TD>
  <TD><B><? echo $a->DESCRIPTION ?></B></TD>
 </TR>
 <TR>
  <TD colspan=2 height=6></TD>
 </TR>
 <TR>
  <TD align=right>Price:&nbsp;</TD>
  <TD><B> (<? echo $a->CURRENCY ?>US&#x0024;<?=dpsumm($a->PRICE)?>)</B>
  </TD>
 </TR>
 <TR>
  <TD colspan=2 height=6></TD>
 </TR>
</TABLE>
<TABLE width=515 border=0 cellspacing=0 cellpadding=0 style='background-color:#C6E2AD; background-image:url(zetapay/images/buyer/ggradbg2.png); background-position:top; background-repeat:repeat-x; border:1px solid #7BAF51; margin-top:6px;'>
 <TR>
  <TD width=75 height=6></TD>
  <TD width=240></TD>
  <TD width=25></TD>
  <TD width=175></TD>
 </TR>
 <TR>
  <TD height=24 align=right valign=middle>
   <SPAN id='gift_from_T'>From:</SPAN>&nbsp;
  </TD>
  <TD valign=middle>
   <INPUT type=text size=30 name=name value='Full name' style='width:240px;' class=text onClick='gift_resetName();'>
  </TD>
  <TD align=center valign=middle>
   <INPUT type=checkbox name='remember_name' style='height:12px; width:12px;' onClick='gift_resetName();'>
  </TD>
  <TD valign=middle>
   <SPAN style='font-size:11px; font-weight:normal;'>Remember my name</SPAN>
  </TD>
 </TR>
 <TR>
  <TD height=24></TD>
  <TD valign=middle>
   <INPUT type=text size=30 name=from value='' style='width:240px;' class=text>
  </TD>
  <TD align=center valign=middle>
   <INPUT type=checkbox name=cc style='height:12px; width:12px;'>
  </TD>
  <TD valign=middle>
   <SPAN style='font-size:11px; font-weight:normal;'>Send me a copy</SPAN>
  </TD>
 </TR>
 <TR>
  <TD height=24 align=right valign=middle>
   <SPAN id='gift_to_T'>To:</SPAN>&nbsp;
  </TD>
  <TD colspan=3 valign=middle>
   <INPUT type=text name=to class=text value='your@friend.com' style='width:435px;' onClick='gift_resetTo();'>
  </TD>
 </TR>
 <TR>
  <TD height=24 align=right valign=middle>
   <SPAN id='gift_subj_T'>Subject:</SPAN>&nbsp;
  </TD>
  <TD colspan=3 valign=middle>
   <INPUT type=text name=subj class=text style='width:435px;'>
  </TD>
 </TR>
 <TR>
  <TD height=24 align=right valign=middle>Message:&nbsp;</TD>
  <TD colspan=3 rowspan=2>
   <TEXTAREA name=body class=text cols=60 rows=20 onKeyDown='gift_counter();' onKeyUp='gift_counter();' style='height:150px; width:435px;'></TEXTAREA>
  </TD>
 </TR>
 <TR>
  <TD height=125 align=right valign=top>
   <SPAN style='font-size:9px;'><SPAN id='gift_body_count'>0</SPAN> chars</SPAN>&nbsp;
  </TD>
 </TR>
 <TR>
  <TD colspan=4 height=6></TD>
 </TR>
</TABLE>
<TABLE width=200 border=0 cellspacing=0 cellpadding=0>
 <TR>
  <TD height=5></TD>
 </TR>
 <TR>
  <TD height=34 valign=middle>
   &nbsp;<SPAN style='font-size:14px; font-weight:bold;'>&raquo;</SPAN> <A href='zetapay/buyer/default_buyer_faq.php' target='_blank'>Need Help?</A>
  </TD>
 </TR>
</TABLE>
<IMG src='zetapay/images/buyer/back.png' alt='Back' border=0 width=67 height=34 onClick='main_display(0);' style='position:absolute; bottom:0px; right:88px; cursor:pointer;'>
<IMG id=btn1 src='zetapay/images/buyer/continue-enabled.png' alt='Continue' border=0 width=78 height=34 onClick='main_submit(1);' style='position:absolute; bottom:0px; right:10px; cursor:pointer;'>
</FORM>
</DIV>
</DIV>
</DIV>
</DIV>
<!-- buy/free for a friends -->
<!-- funding source/amount selection -->
<DIV id=fund style='display:none;'>
<DIV id=main1>
<IMG src='zetapay/images/buyer/ul.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:0px;'>
<IMG src='zetapay/images/buyer/ll.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:310px; left:0px;'>
<IMG src='zetapay/images/buyer/ur.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:570px;'>
<IMG src='zetapay/images/buyer/lr.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:310px; left:570px;'>
<DIV id=banner>
<TABLE width=560 height=60 border=0 cellspacing=0 cellpadding=0>
 <TR>
  <TD width=10></TD>
  <TD width=270 valign=middle>
   <A href='http://www.banqpay.com/' target='_blank'><IMG src='zetapay/images/banqpay-logo.png' alt='BanQpay logo' border=0></A>
  </TD>
 </TR>
</TABLE>
</DIV>
<DIV id=action>
<IMG src='zetapay/images/buyer/rul.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:0px;'>
<IMG src='zetapay/images/buyer/rll.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:0px;'>
<IMG src='zetapay/images/buyer/rur.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:340px;'>
<IMG src='zetapay/images/buyer/rlr.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:340px;'>
<P style='font-size:18px; font-weight:bolder; margin-top:15px;'>Fund your account<SPAN style='font-size:18px; font-weight:normal;'> // Select source</SPAN></P>
<P style='font-size:11px; font-weight:normal; line-height:125%;'>Your current balance is <B><?=dpsumm($balance)?></B> and access to the selected item costs <B><? echo $a->PRICE ?></B>.
<TABLE border=0 cellspacing=0 cellpadding=0>
<TR>
 <TD width=10 height=6></TD>
 <TD width=320></TD>
</TR>
<TR>
 <TD height=40></TD>
 <TD>
  <TABLE width=300 border=0 cellpadding=0 cellspacing=0>
  <TR>
   <TD valign=middle>
   <SPAN style='font-size:14px; font-weight:bold;'>1.</SPAN>
   <SPAN style='font-size:12px; font-weight:normal;'>Select funding source</SPAN>
   </TD>
  </TR>
  <TR>
   <TD height=3></TD>
  </TR>
  <TR>
   <TD valign=middle>
    &nbsp; &nbsp;
    <SELECT id='fund_method' onChange='fund_method_sel();'>
    <OPTION value=blank> </OPTION>
<?
    $rs = $zetadb->Execute("SELECT * FROM ".TBL_TRANSACTION_FUND_METHOD." WHERE active='Y'");
    while($a = $rs->FetchNextObject()) {
        echo "<OPTION value=\"$a->SHORT_NAME\">$a->LONG_NAME</OPTION>";
    }
?>
    </SELECT>
   </TD>
  </TR>
  </TABLE>
 </TD>
 <TD></TD>
</TR>
<TR>
 <TD colspan=2 height=6></TD>
</TR>
<TR>
 <TD height=50></TD>
 <TD valign=top>
  <DIV id='fund_ppcard' style='display:none;'>
  <FORM id='fund_f0' action='sublink.php' method=post target='BQ_TEST'>
  <INPUT type=hidden name=cmd value='add-ppcard'>
  <TABLE border=0 cellspacing=0 cellpadding=0>
  <TR>
   <TD height=20 valign=middle>
    <SPAN style='font-size:14px; font-weight:bold;'>2.</SPAN>
    <SPAN style='font-size:12px; font-weight:normal;'>Enter BanQpay prepaid card number</SPAN>
   </TD>
  </TR>
  <TR>
   <TD height=30 valign=middle>
    &nbsp; &nbsp;
    <INPUT type=text size=35 name='card_no' style='width:300px; height:20px;' class=text></TD>
  </TR>
  </TABLE>
  </FORM>
  </DIV>
  <DIV id='fund_selamount' style='display:none;'>
  <FORM id='fund_f1' action='sublink.php' method=post>
  <INPUT type=hidden name=cmd value='init-txn'>
  <INPUT type=hidden name=target value='_blank'>
  <INPUT type=hidden name=method>
  <INPUT type=hidden name=amount>
  <TABLE border=0 cellspacing=0 cellpadding=0>
  <TR>
   <TD colspan=2 height=20 valign=middle>
   <SPAN style='font-size:14px; font-weight:bold;'>2.</SPAN>
   <SPAN style='font-size:12px; font-weight:normal;'>Select amount</SPAN>
   </TD>
  </TR>
  <TR>
   <TD height=30 valign=middle>
    &nbsp; &nbsp;
    <SELECT name=amount0 onChange='fund_amount_sel();' style='width:150px;'>
    <OPTION value=-1>Enter amount</OPTION>
<?
    $rs = $zetadb->Execute("SELECT * FROM ".TBL_TRANSACTION_FUND_AMOUNT."");
    while($a = $rs->FetchNextObject()) {
        echo "<OPTION value=\"$a->AMOUNT\">US&#x0024;$a->AMOUNT</OPTION>";
    }
?>
    </SELECT>
   </TD>
   <TD valign=middle>
    <TABLE id=amount1 border=0 cellpadding=0 cellspacing=0>
     <TR>
      <TD width=24 height=30 align=right><IMG src='zetapay/images/buyer/arrow.png' border=0 width=18 height=18 style='margin-top:6px; margin-bottom:6px;'></TD>
      <TD>&nbsp; <INPUT type=text size=5 name=amount1 style='width:75px; height:20px;' class=text></TD>
     </TR>
    </TABLE>
   </TD>
  </TR>
  </TABLE>
  </FORM>
  </DIV>
 </TD>
 <TD></TD>
</TR>
</TABLE>
<IMG id=fund_btn0 src='zetapay/images/buyer/back.png' alt='Back' border=0 width=67 height=34 onClick='main_display(0);' style='position:absolute; bottom:10px; right:88px; cursor:pointer;'>
<IMG id=fund_btn1 src='zetapay/images/buyer/continue-enabled.png' alt='Continue' border=0 width=78 height=34 onClick='main_submit(2);' style='position:absolute; bottom:10px; right:10px; cursor:pointer;'>
</DIV>
<DIV id=info>
<IMG src='zetapay/images/buyer/lul.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:0px;'>
<IMG src='zetapay/images/buyer/lll.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:0px;'>
<IMG src='zetapay/images/buyer/lur.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:190px;'>
<IMG src='zetapay/images/buyer/llr.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:190px;'>
<P class=infoHead>Why a prepaid account?</P>
<P class=infoText>Traditional credit card fees are too high to make small transactions affordable.</P>
<P class=infoHead>Why is there a $3.00 funding minimum?</P>
<P class=infoText>There is no fee to users. The funding minimum helps BanqPay cover the costs of managing your account but the money you fund it with is all yours to spend.</P>
<P style='margin-top:5px; margin-left:10px;'><SPAN style='font-size:14px; font-weight:bold;'>&raquo;</SPAN> <A href='zetapay/modules/buyer/default_buyer_faq.php' target='_blank'>Need help?</A></P>
</DIV>
</DIV>
</DIV>
<!-- funding source/amount selection -->
<!-- credit card details -->
<DIV id=ccard style='display:none;'>
<DIV id=main2>
<IMG src='zetapay/images/buyer/ul.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:0px;'>
<IMG src='zetapay/images/buyer/ll.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:490px; left:0px;'>
<IMG src='zetapay/images/buyer/ur.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:570px;'>
<IMG src='zetapay/images/buyer/lr.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:490px; left:570px;'>
<DIV id=banner>
<TABLE width=560 height=60 border=0 cellspacing=0 cellpadding=0>
 <TR>
  <TD width=10></TD>
  <TD width=270 valign=middle>
   <A href='http://www.banqpay.com/' target='_blank'><IMG src='zetapay/images/banqpay-logo.png' alt='BanQpay logo' border=0></A>
  </TD>
 </TR>
</TABLE>
</DIV>
<DIV id=panel>
<IMG src='zetapay/images/buyer/rul.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:0px;'>
<IMG src='zetapay/images/buyer/rll.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:400px; left:0px;'>
<IMG src='zetapay/images/buyer/rur.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:550px;'>
<IMG src='zetapay/images/buyer/rlr.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:400px; left:550px;'>
<DIV id=ipanel>
<P style='font-size:18px; font-weight:bolder;'>Fund your account<SPAN style='font-size:18px; font-weight:normal;'> // Enter details</SPAN></P>
<FORM id='ccard_f0' action='sublink.php' method=post>
<INPUT type=hidden name=cmd value='fund-account'>
<INPUT type=hidden name=amount>
<INPUT type=hidden name=template value='insitu'>
<INPUT type=hidden name=currency value='USD'>
<TABLE width=480 border=0 cellspacing=0 cellpadding=0 style='margin-left:20px;'>
 <TR>
  <TD width=5 height=5></TD>
  <TD width=220></TD>
  <TD width=10></TD>
  <TD width=110></TD>
  <TD width=75></TD>
  <TD width=60></TD>
 </TR>
 <TR>
  <TD colspan=6>
   <SPAN style='font-size:12px; font-weight:bold;'>Select Credit Card</SPAN>
  </TD>
 </TR>
 <TR>
  <TD></TD>                                        
  <TD colspan=5>
   <DIV style='height:22px;'>
    <SELECT name=type id=ctype onChange='ccard_type();'>
<?
    $rs = $zetadb->Execute("SELECT * FROM ".TBL_USER_CARD_TYPE." WHERE active='Y'");
    while($a = $rs->FetchNextObject()) {
        echo "<OPTION value=\"$a->SHORT_NAME\">$a->CARD_TYPE</OPTION>";
    }
?>
    </SELECT>
   </DIV>
  </TD>
 </TR>
 <TR>
  <TD colspan=6 height=6></TD>
 </TR>
 <TR>
  <TD></TD>
  <TD>
   <SPAN id='ccard_number_T' style='font-size:10px; font-weight:normal;'>Card number</SPAN>
  </TD>
  <TD></TD>
  <TD colspan=3>
   <SPAN id='ccard_expdate_T' style='font-size:10px; font-weight:normal;'>Expiration date</SPAN>
  </TD>
 </TR>
 <TR>
  <TD></TD>
  <TD>
   <INPUT type=text name=number size=40 maxlength=40 style='width:220px;' class=text>
  </TD>
  <TD></TD>
  <TD>
   <SELECT name=month id='exp_m' style='width:100px;'>
   <OPTION value='mm'>Month</OPTION>
<?
    $rs = $zetadb->Execute("SELECT * FROM ".TBL_CARD_EXPIRE_MONTH."");
    while($a = $rs->FetchNextObject()) {
        echo "<OPTION value=\"$a->SHORT_NAME\">$a->MONTH</OPTION>";
    }
?>
   </SELECT>
  </TD>
  <TD colspan=3>
   <SELECT name=year id='exp_y' style='width:110px;'>
   <OPTION value='yy'>Year</OPTION>
<?
    $rs = $zetadb->Execute("SELECT * FROM ".TBL_CARD_EXPIRE_YEAR."");
    while($a = $rs->FetchNextObject()) {
        echo "<OPTION value=\"$a->SHORT_NAME\">$a->YEAR</OPTION>";
    }
?>
   </SELECT>
  </TD>
 </TR>
 <TR>
  <TD colspan=6 height=6></TD>
 </TR>
 <TR>
  <TD></TD>
  <TD>
   <SPAN id='ccard_name_T' style='font-size:10px; font-weight:normal;'>Name on your card</SPAN>
  </TD>
  <TD></TD>
  <TD colspan=2>
   <SPAN id='ccard_CVV2_T' style='font-size:10px; font-weight:normal;'>Card verification number</SPAN> [<A href='javascript:ccard_cvv2help();'>?</A>]
  </TD>
  <TD rowspan=2 valign=middle>
   <IMG id=cvv2img src='zetapay/images/buyer/cvv2-vmc.jpg' alt='Card verification number location'>
  </TD>
 </TR>
 <TR>
  <TD></TD>
  <TD>
   <INPUT type=text name=name size=40 maxlength=40 style='width:220px;' class=text>
  </TD>
  <TD></TD>
  <TD colspan=2>
   <INPUT type=text name=cvv2 size=10 maxlength=10 style='width:100px;' class=text>
  </TD>
 </TR>
 <TR>
  <TD colspan=6 height=10></TD>
 </TR>
 <TR>
  <TD colspan=6>
   <SPAN style='font-size:13px; font-weight:bolder;'>Billing Address</SPAN>
  </TD>
 </TR>
 <TR>
  <TD colspan=6 height=4></TD>
 </TR>
 <TR>
  <TD></TD>
  <TD>
   <SPAN id='ccard_addr1_T' style='font-size:10px; font-weight:normal;'>Address line 1</SPAN>
  </TD>
  <TD></TD>
  <TD colspan=3>
   <SPAN id='ccard_addr2_T' style='font-size:10px; font-weight:normal;'>Address line 2</SPAN>
  </TD>
 </TR>
 <TR>
  <TD></TD>
  <TD>
   <INPUT type=text name=addr1 size=40 maxlength=39 style='width:220px;' class=text>
  </TD>
  <TD></TD>
  <TD colspan=3>
   <INPUT type=text name=addr2 size=40 maxlength=39 style='width:220px;' class=text>
  </TD>
 </TR>
 <TR>
  <TD colspan=6 height=4></TD>
 </TR>
 <TR>
  <TD></TD>
  <TD>
   <SPAN id='ccard_city_T' style='font-size:10px; font-weight:normal;'>City</SPAN>
  </TD>
  <TD></TD>
  <TD>
   <SPAN id='ccard_state_T' style='font-size:10px; font-weight:normal;'>State/Province</SPAN>
  </TD>
  <TD colspan=2>
   <SPAN id='ccard_zip_T' style='font-size:10px; font-weight:normal;'>Postal/Zip code</SPAN>
  </TD>
 </TR>
 <TR>
  <TD></TD>
  <TD>
   <INPUT type=text name=city size=40 style='width:220px;' class=text>
  </TD>
  <TD></TD>
  <TD>
   <INPUT type=text name=state size=16 style='width:100px;' class=text>
  </TD>
  <TD colspan=2>
   <INPUT type=text name=zip size=16 style='width:110px;' class=text>
  </TD>
 </TR>
 <TR>
  <TD colspan=6 height=4></TD>
 </TR>
 <TR>
  <TD></TD>
  <TD>
   <SPAN id='ccard_phone_T' style='font-size:10px; font-weight:normal;'>Phone number</SPAN>
  </TD>
  <TD></TD>
  <TD colspan=3>
   <SPAN id='country_T' style='font-size:10px; font-weight:normal;'>Country</SPAN>
  </TD>
 </TR>
 <TR>
  <TD></TD>
  <TD>
   <INPUT type=text name=phone size=40 style='width:220px;' class=text>
  </TD>
  <TD></TD>
  <TD colspan=3>
   <SELECT name=country style='width:220px;' size=1>
<!-- country list -->
<OPTION value='00'>Select your country</OPTION>
<?
    $rs = $zetadb->Execute("SELECT * FROM ".TBL_SYSTEM_COUNTRIES."");
    while($a = $rs->FetchNextObject()) {
        echo "<OPTION value=\"$a->COUNTRY_ISO_CODE_2\">$a->COUNTRIES_NAME</OPTION>";
    }
?>

<!-- country list -->
   </SELECT>
  </TD>
 </TR>
</TABLE>
<TABLE border=0 cellpadding=0 cellspacing=0 style='margin-left:20px; margin-top:8px;'>
 <TR>
  <TD></TD>
  <TD valign=middle>
   <INPUT type=checkbox name=save>
  </TD>
  <TD valign=middle>
   <SPAN onClick='ccard_chksave();'>Store my credit card information to make future funding easier.</SPAN>
  </TD>
 </TR>
</TABLE>
<TABLE width=200 border=0 cellspacing=0 cellpadding=0 style='margin-top:6px;'>
 <TR>
  <TD width=20></TD>
  <TD valign=middle>
<!--   &nbsp;<SPAN style='font-size:14px; font-weight:bold;'>&raquo;</SPAN> <A href='zetapay/buyer/default_buyer_faq.php' target='_blank'>Need Help?</A></SPAN> -->
  </TD>
 </TR>
</TABLE>
<IMG src='zetapay/images/buyer/back.png' alt='Back' border=0 width=67 height=34 onClick='main_display(2);' style='position:absolute; bottom:0px; right:88px; cursor:pointer;'>
<IMG id='ccard_btn1' src='zetapay/images/buyer/continue-enabled.png' alt='Continue' border=0 width=78 height=34 onClick='main_submit(3);' style='position:absolute; bottom:0px; right:10px; cursor:pointer;'>
</FORM>
</DIV>
</DIV>
</DIV>
</DIV>
<!-- credit card details -->
<!-- credit card confirm -->
<DIV id=cconfirm style='display:none;'>
<DIV id=main2>
<IMG src='zetapay/images/buyer/ul.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:0px;'>
<IMG src='zetapay/images/buyer/ll.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:490px; left:0px;'>
<IMG src='zetapay/images/buyer/ur.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:570px;'>
<IMG src='zetapay/images/buyer/lr.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:490px; left:570px;'>
<DIV id=banner>
<TABLE width=560 height=60 border=0 cellspacing=0 cellpadding=0>
 <TR>
  <TD width=10></TD>
  <TD width=270 valign=middle>
   <A href='http://www.banqpay.com/' target='_blank'><IMG src='zetapay/images/banqpay-logo.png' alt='BanQpay logo' border=0></A>
  </TD>
 </TR>
</TABLE>
</DIV>
<DIV id=panel>
<IMG src='zetapay/images/buyer/rul.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:0px;'>
<IMG src='zetapay/images/buyer/rll.png' border=0 alt='image' height=10 width=10 style='position:absolute; bottom:0px; left:0px;'>
<IMG src='zetapay/images/buyer/rur.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:550px;'>
<IMG src='zetapay/images/buyer/rlr.png' border=0 alt='image' height=10 width=10 style='position:absolute; bottom:0px; left:550px;'>
<DIV id=ipanel>
<IFRAME name=container height=390 width=540 frameborder=0 scrolling=auto style='margin:0px; padding:0px;' src='zetapay/help/blank.html' allowtransparency='true'></IFRAME>
</DIV>
</DIV>
</DIV>
<!-- credit card confirm -->
<!-- progress bar -->
<DIV id=wait class=panel style='display:none;'>
<TABLE width=450 border=0 cellspacing=0 cellpadding=5>
<TR>
 <TD height=50 align=center valign=bottom style='font-size:16px;'>
  <B>Processing...</B>
 </TD>
</TR>
<TR>
 <TD height=50 align=center valign=top>
  <IMG id=progress border=0 alt='progress'>
 </TD>
</TR>
</TABLE>
</DIV>
<!-- progress bar -->
</DIV>

<IFRAME id='BQ_TEST' name='BQ_TEST' height=0 width=0 frameborder=0 scrolling=no style='margin:0px; padding:0px; visibility:hidden;' src='/blank.html'></IFRAME>

</BODY>
</HTML>
<?
}
exit;
?>