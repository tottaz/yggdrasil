<?
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html ><head>
<META HTTP-EQUIV="content-type" CONTENT="text/html; charset=UTF-8" >
<meta name="Copyright" content="BanqPay © 2006 All Rights Reserved">
<meta name="Description" content="BanqPay online conntent merchant payment service helps you to buy or sell online.">
<meta name="distribution" content="Global">
<meta name="Keywords" content="instant payment, online payment, merchant account, free merchant account, send or receive money online, send money by email, email money, auction payments, sell goods and services, online payment solutions, <? echo $sitename;?>, <? echo $sitename;?>.com">
<meta name="Language" content="en">
<meta name="Pragma" content="no-cache">

<title>BanqPay -- Helping your business to buy and sell online</title>
<link rel="stylesheet" type="text/css" href="<?echo $subDir?>core/css/style.css">
<link rel="stylesheet" type="text/css" href="<?echo $subDir?>core/css/reset.css">
<link rel="stylesheet" type="text/css" href="<?echo $subDir?>core/css/fonts.css">
<link rel="stylesheet" type="text/css" href="<?echo $subDir?>core/css/grids.css">
<LINK rel="stylesheet" type="text/css" href="<?echo $subDir?>core/css/funding.css">

<!-- CSS for Menu -->
<link rel="stylesheet" type="text/css" href="<?echo $subDir?>core/javalib/build/menu/assets/menu.css">  
<link rel="stylesheet" type="text/css" href="<?echo $subDir?>core/css/localmenu.css">  
<link rel="stylesheet" type="text/css" href="<?echo $subDir?>core/css/login.css"

<!-- Login AJAX javascript -->
<script src="<?echo $subDir?>core/javalib/xml_http_request.js" type="text/javascript"></script>
<script src="<?echo $subDir?>core/javalib/login_controller.js" type="text/javascript"></script>
<script src="<?echo $subDir?>core/javalib/login_presentation.js" type="text/javascript"></script>

<!-- Namespace source file -->
<script type="text/javascript" src="<?echo $subDir?>core/javalib/build/banqpay/banqpay.js"></script>
<!-- Dependency source files -->
<script type="text/javascript" src="<?echo $subDir?>core/javalib/build/event/event.js"></script>
<script type="text/javascript" src="<?echo $subDir?>core/javalib/build/dom/dom.js"></script>
<script type="text/javascript" src="<?echo $subDir?>core/javalib/build/container/container_core.js"></script>
<!-- Menu source file -->
<script type="text/javascript" src="<?echo $subDir?>core/javalib/build/menu/menu.js"></script>
<!-- Page-specific script -->
<script type="text/javascript" src="<?echo $subDir?>core/javalib/localmenu.js"></script>

<script type='text/javascript' src="<?echo $subDir?>core/javalib/common.js"></script>
<script type='text/javascript' src="<?echo $subDir?>core/javalib/auth.js"></script>
<script type='text/javascript' src="<?echo $subDir?>core/javalib/gift.js"></script>
<script type='text/javascript' src="<?echo $subDir?>core/javalib/fund.js"></script>
<script type='text/javascript' src="<?echo $subDir?>core/javalib/ccard.js"></script>
<script type='text/javascript' src="<?echo $subDir?>core/javalib/link.js"></script>
<!-- Tracking web visits -->
<script language="javascript">var stattrak_id = 166755;</script>
<script language="javascript" src="http://stattrak.submitnet.net/stattrak.js"></script>
<noscript><img src="http://stattrak.submitnet.net/cgi/stattrak.pl?id=166755&nojs=y" height="0" width="0" border="0" style="display: none"></noscript>
<script src="http://www.google-analytics.com/urchin.js" type="text/javascript">
</script>
<script type="text/javascript">
_uacct = "UA-778627-3";
urchinTracker();
</script>
</head>
<body id="banqpay-com">
     <div id="doc" class="yui-t7"><!-- possible values: t1, t2, t3, t4, t5, t6, t7 --> 
        <table border=0 cellspacing=0 cellpadding=0 width=100%>
            <tr>
               <td align=left nowrap>
                <a href="http://www.banqpay.com"><img src="zetapay/images/banqpay-logo.png" height="53" width="143" alt="" border="0" class="logo"></a>
               </td>
               <td align=right nowrap><font size=-1>
                <? if ($data) {
                        echo "You are now logged in as <b> ".$_SESSION['username']." -";?>
                            <a href=logout.php?a=logout&<?=$id?>>Logout</a>
                    <?	} else {	?>
                    <?
//                        <a href=index.php?a=signup>Sign&nbsp;Up&nbsp;|</a>
                    ?>
                        <a href=index.php?a=login<?=$id?>>Sign&nbsp;In</a>
                    <?	}?>
                </font>
               </td>
            </tr>
        </table>                
        <!-- start: your content here -->
        <div id="bd">
       <!-- start: primary column from outer template -->
       <div id="yui-main">
       <div class="yui-b">
<? if (!$data){ ?>
            <!-- start: stack grids here -->
                <div id="yproducts" class="yuimenubar">
                   <div class="bd">
                        <ul class="first">
                            <li class="yuimenubaritem first">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <?
//                            <li id="marketplace" class="yuimenubaritem first"><a href="index.php?a=shop">MarketPlace </a></li>
//                            <li id="merchantsolution" class="yuimenubaritem"><a href="index.php?a=merchant_solutions"> Merchant Solutions</a></li>
                            ?>
                         </ul>            
                     </div>
                </div>
                <!-- end: primary column from outer template -->
<? } else {

               if ($data->TYPE == 'buyer') {
           ?>
              <!-- start: stack grids here -->
                   <div id="yproducts" class="yuimenubar">
                      <div class="bd">
                         <ul class="first">
                            <li id="buyeraccountinfo" class="yuimenubaritem first"><a href="index.php?a=account_statement">Account&nbsp;Statements</a></li>
                            <li id="myaccount" class="yuimenubaritem"><a href="index.php?a=edit">My Account</a></li>
                          </ul>            
                       </div>
                    </div>
                <!-- end: primary column from outer template -->
<?
               }  else {
           ?>
              <!-- start: stack grids here -->
                   <div id="yproducts" class="yuimenubar">
                      <div class="bd">
                         <ul class="first">
                            <li id="merchantaccountinfo" class="yuimenubaritem first"><a href="index.php?a=account_statement">Account&nbsp;Statements</a></li>
                            <li id="merchanttools" class="yuimenubaritem"><a href="index.php?a=merchant_add_links">Merchant Tools</a></li>
                            <li id="subscriptions" class="yuimenubaritem"><a href="index.php?a=merchant_add_subscribe">Subscriptions</a></li>
                            <li id="virtualterminal" class="yuimenubaritem"><a href="index.php?a=virtual_terminal">Virtual Terminal</a></li>
                          </ul>            
                       </div>
                    </div>
                <!-- end: primary column from outer template -->
<?
               }              
}
?>