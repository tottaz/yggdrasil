
<LINK rel='stylesheet' href='zetapay/core/css/usrlogin.css' type='text/css'>
<LINK rel='shortcut icon' href='zetapay/images/buyer/favicon.ico'>
<script language=javascript type='text/javascript' src='zetapay/core/javalib/common.js'></script>
<script language=javascript type='text/javascript' src='zetapay/core/javalib/welcome.js'></script>

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

<FORM id=f0 action='zetapay/modules/buyer/login.php' method=post>
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

<FORM id=f1 name=f action='zetapay/modules/buyer/login.php' method=post>
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
   <SPAN id=currency_T>Currency&nbsp;</SPAN>
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
   <A href='zetapay/help/terms.html' target='_blank'>Terms of Service</A> &nbsp;
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
<P class=infoText>BanQpay won't share your information with anyone. Our <A href='zetapay/help/privacy.htm' target='_blank'>Privacy Policy</A> says so.</P>
</DIV>

</DIV>
</DIV>