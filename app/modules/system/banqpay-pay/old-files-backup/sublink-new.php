<?
chdir('zetapay');
require('core/include/common.php');

$merchant_id = $_POST['merchant_id'];
$link_id = $_POST['link_id'];
$link_to_go = $_POST['link_to_go'];

if($merchant_id == '' || $link_id == '' || $link_to_go == '') {
    list($key) = @each($_GET);
    list($dummy1, $merchant_id, $link_id) = explode("$", urldecode($key));
    list($key) = @each($_GET);
    list($link_to_go) = explode("$", urldecode($key));
}

if($link_id != '') {
//
// Have to check if link has expired first check number of times if zero check if time expired.
//

    $rs = $zetadb->Execute("SELECT * FROM zetapay_merchant_active_links WHERE merchant_id=$merchant_id");
    $check_link = $rs->FetchNextObject();
}

if($check_link != '') {
    if($check_link->DURATION == '0') {
    //
    //  Delete any links that has expired and have duration to zero
    //
    $zetadb->Execute("DELETE FROM zetapay_merchant_active_links WHERE date_last<NOW() AND duration='0' AND 'url_id=$link_id'");
 }
}


    ob_start("ob_gzhandler");

//
//     Start Session
//
    session_start();
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
        $rs = $zetadb->Execute("SELECT * FROM zetapay_buyer_users WHERE (email='".addslashes($_POST['username'])."') AND password='".addslashes($_POST['password'])."'");
		$buyer_data = $rs->FetchNextObject();
		if ($buyer_data){
			$suid = substr( md5($userip.time()), 8, 16 );
			$zetadb->Execute("UPDATE zetapay_buyer_users SET suid='$suid',signed_on=NOW(),lastip='$userip' WHERE buyer_id=$buyer_data->BUYER_ID");
			if($use_iplogging){
				$zetadb->Execute("INSERT INTO zetapay_buyer_logins SET user='$buyer_data->BUYER_ID',date=NOW(),ipaddress='$userip', email='".addslashes($_POST['username'])."'");
			}
			$_SESSION['suid'] = $suid;
			$justloggedin = 1;
		}else{
			$errlogin = "You have entered a wrong username or password";
		}
	 }else{
		$errlogin = "You have entered a wrong username or password";
	 }

//
//  Create Account
//
} elseif($_POST['cmd'] == 'create-account') {

	$password = $_POST['password0'];

	if(!isset($_GET["ipaddress"]) || ($_GET["ipaddress"] == "")) {
		$ipaddress = $_SERVER['REMOTE_ADDR'];
		$local = 1;
	} else {
		$ipaddress = $_GET["ipaddress"];
		$local = 0;
	}

    $rs = $zetadb->Execute("SELECT * FROM zetapay_buyer_users WHERE email='".addslashes($_POST['email0'])."'");
	$buyer_data = $rs->FetchNextObject();
	if (!$buyer_data){
	        $pincode = CreatePincode();
#	$password = CreatePassword();
	        $sql = "INSERT INTO zetapay_buyer_users SET email='{$_POST['email0']}',password='$password',pin='$pincode',referredby='$referer',signed_on=NOW()";
	        $zetadb->Execute($sql);
            $user = $zetadb->Insert_ID();
            if ($signup_bonus && $signup_bonus != 0){
		        buyer_transact(1,$user,$signup_bonus,"Account signup bonus");
	        }
	        $info = $_POST['email']."%%".$pincode;
	        wrapmail(	$_POST['email0'], "Confirm E-mail for $sitename", $emailtop.gettemplate("buyer_email_signup", "$siteurl/zetapay/buyer/buyer_confirm.php?id=$uid",$info,$password).$emailbottom,$defaultmail);

	        $suid = substr( md5($userip.time()), 8, 16 );
	        $zetadb->Execute("UPDATE zetapay_buyer_users SET suid='$suid',signed_on=NOW(),lastip='$userip' WHERE buyer_id=$user");
	        if($use_iplogging){
		        $zetadb->Execute("INSERT INTO zetapay_buyer_logins SET user='$buyer_data->BUYER_ID',date=NOW(),ipaddress='$userip', email='".addslashes($_POST['username'])."'");
	        }
	        $_SESSION['suid'] = $suid;
	        $justloggedin = 1;
            $rs = $zetadb->Execute("SELECT * FROM zetapay_buyer_users WHERE buyer_id=$user");
	        $buyer_data = $rs->FetchNextObject();
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

    $result=post_firepay($firepay,true); //debug

    if($result['status']=='SP') {
      chdir('..');
      require('src/common.php');

      $suid = $_REQUEST['EXTRA_INFO'];
      $PAYMENT_BATCH_NUM = $_REQUEST['PAYMENT_BATCH_NUM'];
      $PAYER_ACCOUNT = $_REQUEST['PAYER_ACCOUNT'];
      $PAYER_AMOUNT = $_REQUEST['PAYMENT_AMOUNT'];
      $amount = $PAYER_AMOUNT;

      $fees = myround($amount * $dep_np_percent / 100, 2) + $dep_np_fee;

      transact(18,$r->id,($amount),'Deposit','',$fees,1,'',addslashes($orderno));
	  // Notify admin
	  $message = $GLOBALS[$r->type]." $r->username has just deposited {$currency}$amount via NetPay!";
	  if ($dep_notify){
		    wrapmail($adminemail, "$sitename Deposit", $message, $defaultmail);
	  }

    //
    //  if errors
    //
    } elseif($result['status']=='E'){

        // Put failed logic here
	    dp($result,'You transaction failed, the details are.');
    }

} elseif($_POST['cmd'] == 'complete') {

//
// Look up the link details from the merchant link table.
//

      $rs = $zetadb->Execute("SELECT * FROM zetapay_merchant_link WHERE url_id='$link_id'");
      $a = $rs->FetchNextObject();

      $fees = myround($amount * $dep_np_percent / 100, 2) + $dep_np_fee;


//
//  Deduct purchase price from merchant account
//

//      transact(18,$r->id,($amount),'Deposit','',$fees,1,'',addslashes($orderno));

//
//  Add purchase price to merchants account
//

//      transact(18,$r->id,($amount),'Deposit','',$fees,1,'',addslashes($orderno));

//
//  add merchant link for this buyer to the active merchant link table, add number of times and/or time link is active
//

    $today = getdate();
    $pyear = $today[year];
    $pmonth = $today[mon];
	$pday = $today[mday];
    $phour = $today[hours];
    $pmin = $today[minutes];
    $psec = $today[seconds];

    if($a->TIME_PERIOD == 1) {
// seconds
        $psec=$psec+$a->TIME_DURATION;
    } elseif($a->TIME_PERIOD == 2) {
// minutes
        $pmin=$pmin+$a->TIME_DURATION;
    } elseif($a->TIME_PERIOD == 3) {
// hours
        $phour=$phour+$a->TIME_DURATION;
    } elseif($a->TIME_PERIOD == 4) {
// days
        $pday=$pday+$a->TIME_DURATION;
    } elseif($a->TIME_PERIOD == 5) {
// weeks
        $pweeks=$pweeks+$a->TIME_DURATION;
    } elseif($a->TIME_PERIOD == 6) {
// months
        $pmonth=$pmonth+$a->TIME_DURATION;
    }

//
//  add merchant link for this buyer to the active merchant link table, add number of times and/or time link is active
//
           		$sql  = "INSERT INTO zetapay_merchant_active_links SET ";
				$sql .= "	link_id=$link_id,";
				$sql .= "	merchant_id=$merchant_id,";
//				$sql .= "	buyer_id=$buyer_data->BUYER_ID,";
				$sql .= "	duration=$duration,";
				$sql .= "	date_last='$pyear-$pmonth-$pday $phour:$pmin:$psec'";
				$zetadb->Execute($sql);



//
//  Redirect link to the merchant website for this purchase
//

//
// Close window and exit script
//

?>
	<script>
	 	alert("Terminal' are Successfully Assigned");
	 	opener.document.location.reload();
		self.close();
	</script>
<?

//    redirect();
    header("Location: http://$a->URL_LINK/$link_to_go");
    exit;

} else {
	$suid = $_SESSION['suid'];

	if(!$suid){
		($suid = $_POST['suid']) or ($suid = $_GET['suid']);
	}
	if (addslashes($suid) != $suid){
		unset($suid);
	}
}


if ($suid){
	if ($action == 'buyer_logout'){
		$zetadb->Execute("UPDATE zetapay_buyer_users SET suid='xxx".uniqid('')."' WHERE suid='$suid'");
		$zetadb->Execute("DELETE FROM zetapay_visitors WHERE ip='$userip'");
	}
	if (!$buyer_data) {
		$rs = $zetadb->Execute("SELECT * FROM zetapay_buyer_users WHERE suid='$suid' AND DATE_ADD(lastlogin,INTERVAL $session_mins MINUTE)>NOW() AND lastip='$userip'");
		$buyer_data = $rs->FetchNextObject();
    }
	if ($buyer_data){
	    $user = $buyer_data->BUYER_ID;
	    if ($buyer_data->SUSPENDED){
		    $errlogin = "Your account is suspended, please contact administrator";
	    }else{
		    $zetadb->Execute("UPDATE zetapay_buyer_users SET lastlogin=NOW() WHERE buyer_id=$user");
		    if($use_iplogging){
				$zetadb->Execute("INSERT INTO zetapay_buyer_logins SET user='$buyer_data->BUYER_ID',date=NOW(),ipaddress='$userip', email='".addslashes($_POST['username'])."'");
	        }
	    }
     }else{
		    $suid = '';
	 }
}
if ($suid == '') {
?>
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
   &nbsp;<SPAN style='font-size:14px; font-weight:bold;'>&raquo;</SPAN> <A href='http://localhost/Zetapay/zetapay/buyer/default_buyer_faq.php' target='_blank'>Need Help?</A></SPAN>
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
   <A href='http://localhost/' target='_blank'><IMG src='zetapay/images/banqpay-logo.png' alt='BanQpay logo' border=0></A>
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
<P style='font-size:11px; font-weight:normal; line-height:125%;'>Your current balance is <B>US&#x0024;&nbsp;<?=dpsumm($balance)?></B> and access to the selected item costs <B>US&#x0024;$nbsp;<? echo $a->PRICE ?></B>.
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
    $rs = $zetadb->Execute("SELECT * FROM zetapay_fund_method");
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
  <FORM id='fund_f0' action='sublink.php' method=post>
  <INPUT type=hidden name=cmd value='add-ppcard'>
  <INPUT type=hidden name=merchant_id value=<?=$merchant_id?>>
  <INPUT type=hidden name=link_id value=<?=$link_id?>>
  <INPUT type=hidden name=link_to_go value=<?=$link_to_go?>>
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
  <INPUT type=hidden name=merchant_id value=<?=$merchant_id?>>
  <INPUT type=hidden name=link_id value=<?=$link_id?>>
  <INPUT type=hidden name=link_to_go value=<?=$link_to_go?>>

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
    $rs = $zetadb->Execute("SELECT * FROM zetapay_fund_amount");
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
   </TD>
  </TR>
  </TABLE>
  </FORM>
  </DIV>
 </TD>
 <TD></TD>
</TR>
</TABLE>
<IMG id=fund_btn0 src='http://localhost/Zetapay/zetapay/images/buyer/back.png' alt='Back' border=0 width=67 height=34 onClick='main_display(0);' style='position:absolute; bottom:10px; right:88px; cursor:pointer;'>
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
<P class=infoText>There is no fee to users. The funding minimum helps Payments Without Borders cover the costs of managing your account but the money you fund it with is all yours to spend.</P>
<P style='margin-top:5px; margin-left:10px;'><SPAN style='font-size:14px; font-weight:bold;'>&raquo;</SPAN> <A href='http://localhost/Zetapay/zetapay/buyer/default_buyer_faq.php' target='_blank'>Need help?</A></P>
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
   <A href='http://localhost/' target='_blank'><IMG src='zetapay/images/banqpay-logo.png' alt='BanQpay logo' border=0></A>
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
<INPUT type=hidden name=merchant_id value=<?=$merchant_id?>>
<INPUT type=hidden name=link_id value=<?=$link_id?>>
<INPUT type=hidden name=link_to_go value=<?=$link_to_go?>>
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
    $rs = $zetadb->Execute("SELECT * FROM zetapay_card_type");
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
    $rs = $zetadb->Execute("SELECT * FROM zetapay_card_expire_month");
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
    $rs = $zetadb->Execute("SELECT * FROM zetapay_card_expire_year");
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
    $rs = $zetadb->Execute("SELECT * FROM zetapay_countries");
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
<!--   &nbsp;<SPAN style='font-size:14px; font-weight:bold;'>&raquo;</SPAN> <A href='http://localhost/Zetapay/zetapay/buyer/default_buyer_faq.php' target='_blank'>Need Help?</A></SPAN> -->
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
   <A href='http://localhost/' target='_blank'><IMG src='zetapay/images/banqpay-logo.png' alt='BanQpay logo' border=0></A>
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

</BODY>
</HTML>
<?
}
exit;


?>