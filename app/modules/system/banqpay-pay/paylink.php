<?
include('config.php');
session_start();

$root_dir="zetapay/";   

require_once($rootDir.$subDir.'core/include/common.php');
require_once($rootDir.$subDir.'core/include/qpay_base.php');      
$base = new qpay_base();

// Or simply use a Superglobal ($_SERVER or $_ENV)
$ip = $_SERVER['REMOTE_ADDR'];

$merchant_id = $_SESSION['merchant_id'];
$link_id = $_SESSION['link_id'];
$subtype = $_SESSION['subtype'];
$PRICE = $_SESSION['price'];
$TAX = $_SESSION['tax'];
$link_to_go = $_SESSION['link_to_go'];


if($merchant_id == '' || $link_id == '' || $link_to_go == '') {

  if ($base->input['link']) { $linearray = split('&#036;',$base->input['link']); }
  elseif ($base->input['subscribe']) { $linearray = split('&#036;',$base->input['subscribe']); }
  else { $linearray = split('&#036;',$base->input['pay']); }

  $_SESSION['merchant_id'] = $linearray[1];
  $_SESSION['link_id'] = $linearray[2];
  $_SESSION['subtype'] = $linearray[3];
  $_SESSION['price'] = $linearray[4];
  $_SESSION['tax'] = $linearray[5];
  $_SESSION['link_to_go'] = $linearray[6];

  $merchant_id = $_SESSION['merchant_id'];
  $link_id = $_SESSION['link_id'];
  $subtype = $_SESSION['subtype'];
  $PRICE = $_SESSION['price'];
  $TAX = $_SESSION['tax'];
  $link_to_go = $_SESSION['link_to_go'];
}

//
// Have to check if merchant exist and the merchant link exist.
//
if($link_id != '') {
    $rs = $zetadb->Execute("SELECT * FROM ".TBL_MERCHANT_PAY_LINK." WHERE merchant_id='$merchant_id' AND id=$link_id");
    $check_link = $rs->FetchNextObject();
    if($check_link == '') {
            session_unset();
            session_destroy();
?>
        <script>
       		alert('Merchant do not exist. <? echo $result ?>');
            self.close();
         </script>   
<?
        exit;
    } else {
        $rs = $zetadb->Execute("SELECT * FROM ".TBL_MERCHANT_PAY_LINK." WHERE merchant_id='$merchant_id' AND id=$link_id AND active='Y'");
        $check_link = $rs->FetchNextObject();
        if($check_link == '') {

            session_unset();
            session_destroy();
            
?>
        <script>
       		alert('Merchant is not active. <? echo $result ?>');
            self.close();
         </script>   
<?
            exit;
        }
    }
    if (!$errlogin) {
        //
        //      If link exist Update link clicks
        //
        $zetadb->Execute("UPDATE ".TBL_MERCHANT_PAY_LINK." SET clicks=clicks+1 WHERE merchant_id='$merchant_id' and id='$link_id'");
    }
}

    ob_start("ob_gzhandler");

//
//     Start Session
//
//
//      Script to open the window after the check are done
//      <script>
//        javascript:popwindow('http://www.banqpay.com/paylink.php?$105$11$','scrollbars,resizable,top=15,left=15,width=620,height=360')
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

if($base->input['cmd'] == 'login') {
	$ok = 1;
    if($base->input['password'] && $ok){
        $encryptedpassword=md5($base->input['password']); //encrypt the password
        $rs = $zetadb->Execute("SELECT * FROM ".TBL_SYSTEM_USERS." WHERE (email='".addslashes($base->input['username'])."') AND password='".addslashes($encryptedpassword)."'");
		$data = $rs->FetchNextObject();
		if ($data){
			$suid = substr( md5($userip.time()), 8, 16 );
			$zetadb->Execute("UPDATE ".TBL_SYSTEM_USERS." SET suid='$suid',signed_on=NOW(),lastip='$userip' WHERE id=$data->ID");
			if($use_iplogging){
				$zetadb->Execute("INSERT INTO ".TBL_SYSTEM_LOGINS." SET user='$data->ID',date=NOW(),ipaddress='$userip', username='".addslashes($base->input['username'])."'");
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
		($suid = $base->input['suid']) or ($suid = $_GET['suid']);
	}
	if (addslashes($suid) != $suid){
		unset($suid);
	}

    if ($suid){
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
				    $zetadb->Execute("INSERT INTO ".TBL_SYSTEM_LOGINS." SET user='$data->ID',date=NOW(),ipaddress='$userip', username='".addslashes($base->input['username'])."'");
	            }
	        }
        }else{
		    $suid = '';
	    }
    }
//
//  Create Account
//
if($base->input['cmd'] == 'create-account') {

	$password = $base->input['password0'];

	if(!isset($_GET["ipaddress"]) || ($_GET["ipaddress"] == "")) {
		$ipaddress = $_SERVER['REMOTE_ADDR'];
		$local = 1;
	} else {
		$ipaddress = $_GET["ipaddress"];
		$local = 0;
	}

    $rs = $zetadb->Execute("SELECT * FROM ".TBL_SYSTEM_USERS." WHERE email='".addslashes($base->input['email0'])."'");
	$data = $rs->FetchNextObject();
	if (!$data){
            $encryptedpassword=md5($password); //encrypt the password
	        $pincode = CreatePincode();
#	$password = CreatePassword();
	        $sql = "INSERT INTO ".TBL_SYSTEM_USERS." SET username='{$base->input['email0']}', email='{$base->input['email0']}',password='$encryptedpassword',pin='$pincode',referredby='$referer',signed_on=NOW(),loginid='{$base->input['email0']}'";
	        $zetadb->Execute($sql);
            $user = $zetadb->Insert_ID();
            $merch1 = $zetadb->Execute("SELECT * FROM ".TBL_SYSTEM_USERS." WHERE id='$merchant_id'");
	        $m1 = $merch1->FetchNextObject();
            if ($m1->SIGNUP_BONUS && $m1->SIGNUP_BONUS != 0){
		        transact($merchant_id,$user,$m1->SIGNUP_BONUS,"Account signup bonus");
                ?>                
                <script>
        	        alert('You have receive $ <? echo $m1->SIGNUP_BONUS ?> Signup Bonus from <? $m1->COMPANY ?>');
//       	            location.href('http://www.banqpay.com/paylink.php');   
                </script>   
                <?
	        }
	        $info = $base->input['email']."%%".$pincode;
	        wrapmail($base->input['email0'], "Confirm E-mail for $sitename", $emailtop.gettemplate("email_signup", "$siteurl/zetapay/modules/buyer/buyer_confirm.php?id=$uid",$info,$password).$emailbottom,$defaultmail);

			$suid = substr( md5($userip.time()), 8, 16 );
	        $zetadb->Execute("UPDATE ".TBL_SYSTEM_USERS." SET suid='$suid',signed_on=NOW(),lastip='$userip' WHERE id=$user");
	        if($use_iplogging){
		        $zetadb->Execute("INSERT INTO ".TBL_SYSTEM_LOGINS." SET user='$user',date=NOW(),ipaddress='$userip', username='".addslashes($base->input['username'])."'");
	        }
	        $_SESSION['suid'] = $suid;
	        $justloggedin = 1;
	        $zetadb->Execute("UPDATE ".TBL_SYSTEM_USERS." SET lastlogin=NOW() WHERE id=$user");
            $rs = $zetadb->Execute("SELECT * FROM ".TBL_SYSTEM_USERS." WHERE id=$user");
	        $data = $rs->FetchNextObject();
	}else{
			$errlogin = "Userid and Password Exist";
    }

} elseif($base->input['cmd'] == 'fund-account') {

    require('zetapay/core/payment/firepay.php');
    /*
    *
    * Posting the transaction to FirePay
    *
    */
    // DEBUG MODE
    //$result=post_firepay($_POST['firepay'],true);
    // PRODUCTION MODE

    $cardType = cardType($base->input['type']);

	$firepay = array('custName1' => $base->input['name'],
							'cardNumber' => $base->input['number'],
							'cardType' => $cardType,
							'cardExp' => $base->input['month'] ."/". $base->input['year'],
                            'cvdIndicator' => '1',
                            'cvdValue' => $base->input['cvv2'],
							'amount' => $base->input['amount']*100,
							'merchantTxn' => $merchant_id . '-' .$link_id . '-' . date('Ymdhis'),
							'streetAddr' => $base->input['addr1'] . $base->input['addr2'],
							'city' => $base->input['city'],
							'zip' => $base->input['zip'],
							'province' => $base->input['state'],
							'country' => $base->input['country'],
							'phone' => $base->input['phone'],
							'email' => $data->EMAIL);
   
    $result=post_firepay($firepay,false); //debug
    
    unset($base->input['cmd']);
    unset($cmd);
    
    if($result['status']=='SP') {

      $amount = $base->input['amount'];

//      $fees = myround($amount * $dep_np_percent / 100, 2) + $dep_np_fee;

//
//  Add deposit amount to 
//
      transact(18,$user,($amount),'Deposit','',0,0,'',addslashes($result['authCode']));
	  // Notify admin
	  $message = "$user has just deposited {$currency}$amount via credit card!";
	  if ($dep_notify){
		    wrapmail($adminemail, "$sitename Deposit", $message, $defaultmail);
	  }
    //
    //  if errors
    //
    } elseif($result['status']=='E'){
?>
        <script>
       		alert('<? echo $result['errString'] ?>');
         </script>   
<?
    } else {
?>
        <script>
       		alert('Your transaction failed, try again. <? echo $result ?>');
         </script>   
<?
    }

} elseif($base->input['cmd'] == 'complete') {

                $balance = balance($user, 1);

                if($balance < $PRICE) {
                    ?> 
                    <script>
       		            alert('Your Balance is less than the price of the purchase. <? echo $balance ?>');
                    </script>   
                    <?    
                } else {
                
//
//  Deduct purchase price from merchant account
//
                transact($user, $merchant_id,($PRICE),'Purchase','',0, 0,'',$subtype);

                echo " this is the link $merchant_link";

                $rs = $zetadb->Execute("SELECT * FROM ".TBL_MERCHANT_PAY_LINK." WHERE merchant_id='$merchant_id' AND id=$link_id");
                $a = $rs->FetchNextObject();                
                
                $merchant_link = $a->RETURN_URL;
                $merchant_link .= $link_to_go;
               
                unset($_SESSION['merchant_id']);
                unset($_SESSION['link_id']);
                unset($_SESSION['link_to_go']);
                unset($_SESSION['price']);
                unset($_SESSION['tax']);
                unset($_SESSION['subtype']);
          
                unset($merchant_id);
                unset($link_id);
                unset($link_to_go);
                unset($price);
                unset($tax);
                unset($subtype);

                header("Content-Type: text/html; charset=utf-8");
            
           print <<<EOT
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<HTML>
<HEAD>
<TITLE>Redirecting...</TITLE>
<SCRIPT language=javascript type='text/javascript'>
      self.opener.location.href='$merchant_link';
      self.close();
</SCRIPT>
</HEAD>
</HTML>
EOT;
            exit;
    }       
}

if($base->input['cmd'] == 'logout') {
    $zetadb->Execute("UPDATE ".TBL_SYSTEM_USERS." SET suid='xxx".uniqid('')."' WHERE suid='$suid'");
    $zetadb->Execute("DELETE FROM ".TBL_SYSTEM_VISITORS." WHERE ip='$userip'");

    session_unset();
    session_destroy();
?>
    <script language=javascript type='text/javascript'>
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
<script language=javascript type='text/javascript' src='zetapay/core/javalib/common.js'></script>
<script language=javascript type='text/javascript' src='zetapay/core/javalib/welcome.js'></script>
<script src="http://www.google-analytics.com/urchin.js" type="text/javascript">
</script>
<script type="text/javascript">
_uacct = "UA-778627-3";
urchinTracker();
</script>
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
  <TD valign=middle>
     <P class=infoText><B>Safe and secure.</B><br>BanQpay is like a stored value account!</P>
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

<FORM id=f0 action='paylink.php' method=post>
<INPUT type=hidden name=cmd value='login'>
<input type="hidden" name="challenge" id="challenge" />
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
	<a href="javascript:open_window()">Forgot your username or password ?</a>
	<!-- <a href=index.php?type=module&load=general&a=remind&<?=$id?>>Forgot your username or password ?</a> -->
	<!-- <br><br>	<br><br> -->
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
<P class=infoText><B>It's like a stored value account!</B></P>
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

<FORM id=f1 name=f action='paylink.php' method=post>
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
   &nbsp;<SPAN style='font-size:12px;'><B>Create a BanQpay account</B></SPAN>
  </TD>
 </TR>
 <TR>
  <TD colspan=4 height=8></TD>
 </TR>
 <TR>
  <TD height=25 align=right>
   <SPAN id=email0>Email address &nbsp;</SPAN>
  </TD>
  <TD colspan=3>
   <INPUT type=text name=email0 size=27 style='width:180px;' class=text>
  </TD>
 </TR>
 <TR>
  <TD height=24 align=right>
   <SPAN id=email1>Re-type email &nbsp;</SPAN>
  </TD>
  <TD colspan=3>
   <INPUT type=text name=email1 size=27 style='width:180px;' class=text>
  </TD>
 </TR>
 <TR>
  <TD height=24 align=right>
   <SPAN id=pwd0>Create password &nbsp;</SPAN>
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
   <SPAN id=pwd1>Re-type password &nbsp;</SPAN>
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
   <SPAN id=currency>Currency&nbsp;</SPAN>
  </TD>
  <TD colspan=3>
   <SELECT name=currency style='width:125px;'>
<?
    $rs = $zetadb->Execute("SELECT * FROM ".TBL_SYSTEM_CURRENCIES." WHERE active='Y'");
    while($a = $rs->FetchNextObject()) {
        echo "<OPTION value=\"$a->CODE\">$a->TITLE</OPTION>";
    }
?>
   </SELECT>
  </TD>
 </TR>
 <TR>
  <TD height=24 align=right valign=middle>
   <A href='zetapay/help/terms.htm' target='_blank'>Terms of Service</A> &nbsp;
  </TD>
  <TD align=center valign=middle>
   <INPUT type=checkbox name=accept value=1 style='height:12px; width:12px;'>
  </TD>
  <TD colspan=2 valign=middle><SPAN id=TOS>I agree</SPAN></TD>
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
<P class=infoText>BanQpay won't share your information with anyone. Our <A href='zetapay/help/privacy.htm' target='_blank'>Privacy Policy</A> says so.</P>
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

<SCRIPT language=javascript type='text/javascript' src='zetapay/core/javalib/common.js'></SCRIPT>
<SCRIPT language=javascript type='text/javascript' src='zetapay/core/javalib/auth.js'></SCRIPT>
<SCRIPT language=javascript type='text/javascript' src='zetapay/core/javalib/fund.js'></SCRIPT>
<SCRIPT language=javascript type='text/javascript' src='zetapay/core/javalib/ccard.js'></SCRIPT>
<SCRIPT language=javascript type='text/javascript' src='zetapay/core/javalib/link.js'></SCRIPT> 
<script src="http://www.google-analytics.com/urchin.js" type="text/javascript">
</script>
<script type="text/javascript">
_uacct = "UA-778627-3";
urchinTracker();
</script>
</HEAD>
<BODY bgcolor='#003399' onLoad='init();'>
<?
    $rs = $zetadb->Execute("SELECT * FROM ".TBL_MERCHANT_PAY_LINK." WHERE merchant_id='$merchant_id' AND id=$link_id");
    $a = $rs->FetchNextObject();
    if (!$a){
?>
<SCRIPT language=javascript type='text/javascript'>
		alert('The PAY link your try to access, do not exist.');
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

<FORM id='auth_f0' action='paylink.php' method=post target='_self'>
<INPUT type=hidden name=cmd value='complete'>
<INPUT type=hidden name=usrtime>
<INPUT type=hidden name=price>  
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
   <SPAN style='font-size:14px; font-weight:bold;'><? echo $a->ITEM_NAME ?></SPAN>
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
   <SPAN style='font-size:10px;'><?=dpsumm($PRICE+$TAX)?></SPAN>
   <? $price=$PRICE+$TAX; ?>
  </TD>
  <TD></TD>
 </TR>
 <TR>
  <TD colspan=4 height=4></TD>
 </TR>
</TABLE>
</div>
<a href=paylink.php?cmd=logout><IMG src='zetapay/images/buyer/signout.png' alt='Sign out' border=0 width=78 height=34 style='position:absolute; bottom:10px; right:88px; cursor:pointer;'></a>
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
<IMG src='zetapay/images/buyer/fundaccnt.png' border=0 alt='Fund account' style='position:absolute; bottom:10px; right:10px; cursor:pointer;' onClick='main_display(1);'>
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
<FORM id='gift_f0' action='paylink.php' method=post target='BQ_TEST'>
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
  <TD><B> (<? echo $a->CURRENCY ?>US&#x0024;<?=dpsumm($PRICE)?>)</B>
  </TD>
 </TR>
 <TR>
  <TD colspan=2 height=6></TD>
 </TR>
</TABLE>
<TABLE width=515 border=0 cellspacing=0 cellpadding=0 style='background-color:#C6E2AD; background-position:top; background-repeat:repeat-x; border:1px solid #7BAF51; margin-top:6px;'>
 <TR>
  <TD width=75 height=6></TD>
  <TD width=240></TD>
  <TD width=25></TD>
  <TD width=175></TD>
 </TR>
 <TR>
  <TD height=24 align=right valign=middle>
   <SPAN id='gift_fromC'>From:</SPAN>&nbsp;
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
   <SPAN id='gift_toC'>To:</SPAN>&nbsp;
  </TD>
  <TD colspan=3 valign=middle>
   <INPUT type=text name=to class=text value='your@friend.com' style='width:435px;' onClick='gift_resetTo();'>
  </TD>
 </TR>
 <TR>
  <TD height=24 align=right valign=middle>
   <SPAN id='gift_subjC'>Subject:</SPAN>&nbsp;
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
<P style='font-size:11px; font-weight:normal; line-height:125%;'>Your current balance is <B><?=dpsumm($balance)?></B> and access to the selected item costs <B><? echo $PRICE ?></B>.
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
  <FORM id='fund_f0' action='paylink.php' method=post target='BQ_TEST'>
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
  <FORM id='fund_f1' action='paylink.php' method=post>
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
<IMG id=fund_btn1 src='zetapay/images/buyer/continue-enabled.png' alt='Continue' border=0 width=78 height=34 onClick='main_submit(1);' style='position:absolute; bottom:10px; right:10px; cursor:pointer;'>
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
<?
//<P style='margin-top:5px; margin-left:10px;'><SPAN style='font-size:14px; font-weight:bold;'>&raquo;</SPAN> <A href='zetapay/modules/buyer/default_buyer_faq.php' target='_blank'>Need help?</A></P>
?>
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
<FORM id='ccard_f0' action='paylink.php' method=post>
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
   <SPAN id='ccard_numberC' style='font-size:10px; font-weight:normal;'>Card number</SPAN>
  </TD>
  <TD></TD>
  <TD colspan=3>
   <SPAN id='ccard_expdateC' style='font-size:10px; font-weight:normal;'>Expiration date</SPAN>
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
   <SPAN id='ccard_nameC' style='font-size:10px; font-weight:normal;'>Name on your card</SPAN>
  </TD>
  <TD></TD>
  <TD colspan=2>
   <SPAN id='ccard_CVV2C' style='font-size:10px; font-weight:normal;'>Card verification number</SPAN>
  </TD>
<!--
  <TD rowspan=2 valign=middle>
   <IMG id=cvv2img src='zetapay/images/buyer/cvv2vmc.gif' alt='Card verification number location'>
  </TD>
-->  
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
   <SPAN id='ccard_addr1C' style='font-size:10px; font-weight:normal;'>Address line 1</SPAN>
  </TD>
  <TD></TD>
  <TD colspan=3>
   <SPAN id='ccard_addr2C' style='font-size:10px; font-weight:normal;'>Address line 2</SPAN>
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
   <SPAN id='ccard_cityC' style='font-size:10px; font-weight:normal;'>City</SPAN>
  </TD>
  <TD></TD>
  <TD>
   <SPAN id='ccard_stateC' style='font-size:10px; font-weight:normal;'>State/Province</SPAN>
  </TD>
  <TD colspan=2>
   <SPAN id='ccard_zipC' style='font-size:10px; font-weight:normal;'>Postal/Zip code</SPAN>
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
   <SPAN id='ccard_phoneC' style='font-size:10px; font-weight:normal;'>Phone number</SPAN>
  </TD>
  <TD></TD>
  <TD colspan=3>
   <SPAN id='countryC' style='font-size:10px; font-weight:normal;'>Country</SPAN>
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
        echo "<OPTION value=$a->COUNTRIES_ISO_CODE_2>$a->COUNTRIES_NAME</OPTION>";
    }
?>

<!-- country list -->
   </SELECT>
  </TD>
 </TR>
</TABLE>
<!--
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
-->
<TABLE width=200 border=0 cellspacing=0 cellpadding=0 style='margin-top:6px;'>
 <TR>
  <TD width=20></TD>
  <TD valign=middle>
<!--   &nbsp;<SPAN style='font-size:14px; font-weight:bold;'>&raquo;</SPAN> <A href='zetapay/buyer/default_buyer_faq.php' target='_blank'>Need Help?</A></SPAN> -->
  </TD>
 </TR>
</TABLE>
<IMG src='zetapay/images/buyer/back.png' alt='Back' border=0 width=67 height=34 onClick='main_display(1);' style='position:absolute; bottom:0px; right:88px; cursor:pointer;'>
<IMG id='ccard_btn1' src='zetapay/images/buyer/continue-enabled.png' alt='Continue' border=0 width=78 height=34 onClick='main_submit(2);' style='position:absolute; bottom:0px; right:10px; cursor:pointer;'>
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

<IFRAME id='BQ_TEST' name='BQ_TEST' height=0 width=0 frameborder=0 scrolling=no style='margin:0px; padding:0px; visibility:hidden;' src='zetapay/help/blank.html'></IFRAME>

</BODY>
</HTML>
<?
}
exit;
?>