<BODY onLoad='init();'>
<?
$balance = balance($user, 1);
setcookie("bal", $balance);
?> 
<!-- funding source/amount selection -->

<DIV id=fund>
<DIV id=main1>
<DIV id=action>
<IMG src='zetapay/images/buyer/rul.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:0px;'>
<IMG src='zetapay/images/buyer/rll.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:0px;'>
<IMG src='zetapay/images/buyer/rur.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:340px;'>
<IMG src='zetapay/images/buyer/rlr.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:220px; left:340px;'>
<P class=infoHead>Why a prepaid account?</P>
<P class=infoText>Traditional credit card fees are too high to make small transactions affordable.</P>
<P class=infoHead>Why is there a $3.00 funding minimum?</P>
<P class=infoText>There is no fee to users. The funding minimum helps BanqPay cover the costs of managing your account but the money you fund it with is all yours to spend.</P>
<P style='font-size:18px; font-weight:bolder; margin-top:15px;'>Fund your account<SPAN style='font-size:18px; font-weight:normal;'> // Select source</SPAN></P>
<P style='font-size:11px; font-weight:normal; line-height:125%;'>Your current balance is <B><?=dpsumm($balance)?></B>.
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
  <FORM id='fund_f0' action='zetapay/modules/buyer/deposit.php' method=post target='BQ_TEST'>
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
  <FORM id='fund_f1' action='zetapay/modules/buyer/deposit.php' method=post>
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
<IMG id=fund_btn1 src='zetapay/images/buyer/continue-enabled.png' alt='Continue' border=0 width=78 height=34 onClick='main_submit(2);' style='position:absolute; bottom:10px; right:10px; cursor:pointer;'>
</DIV>

<DIV id=info>
</DIV>
</DIV>
</DIV>
<!-- funding source/amount selection -->

<!-- credit card details -->
<DIV id=ccard style='display:none;'>
<DIV id=main2>
<DIV id=panel>
<IMG src='zetapay/images/buyer/rul.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:0px;'>
<IMG src='zetapay/images/buyer/rll.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:400px; left:0px;'>
<IMG src='zetapay/images/buyer/rur.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:0px; left:550px;'>
<IMG src='zetapay/images/buyer/rlr.png' border=0 alt='image' height=10 width=10 style='position:absolute; top:400px; left:550px;'>
<DIV id=ipanel>
<P style='font-size:18px; font-weight:bolder;'>Fund your account<SPAN style='font-size:18px; font-weight:normal;'> // Enter details</SPAN></P>
<FORM id='ccard_f0' action='zetapay/modules/buyer/deposit.php' method=post>
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
   <IMG id=cvv2img src='zetapay/images/buyer/cvv2vmc.gif' alt='Card verification number location'>
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
        echo "<OPTION value=$a->COUNTRIES_ISO_CODE_2>$a->COUNTRIES_NAME</OPTION>";
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