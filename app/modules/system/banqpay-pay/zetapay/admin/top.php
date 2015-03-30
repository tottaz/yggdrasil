<?
	chdir('..');
	require('connect.php');
	require('config.php');

	session_start();
	if($_SESSION['suid']){$suid = $_SESSION['suid'];$id = "suid=$suid";}
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<HTML>
<HEAD>
<TITLE><?=$sitename?> Admin Menu.</TITLE>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<style type="text/css">
	<!--
	a:hover {  font-weight: bold; text-decoration: none; text-transform: capitalize}
	a:link {  font-weight: bold; text-decoration: none; text-transform: capitalize}
	a:visited {  font-weight: bold; text-decoration: none; text-transform: capitalize}
	a:active {  font-weight: bold; text-decoration: none; text-transform: capitalize}
	.menu {  font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 9px; font-weight: bold; color: #FFFFFF; background-color: #000099; text-decoration: none}
	.label {  font-family: Arial, Helvetica, sans-serif; font-size: 10px; font-weight: bold; text-decoration: none}
	.fields {  font-family: Arial, Helvetica, sans-serif; font-size: 11px; font-weight: bold; color: #000099; text-decoration: none; background-color: #F3F3F3; border-color: #006699 #333333 #333333 #999999; font-style: normal; padding-top: 0px; padding-right: 2px; padding-bottom: 0px; padding-left: 2px; border-top-width: 1px; border-right-width: 1px; border-bottom-width: 1px; border-left-width: 1px}
	.fields_text {  font-family: Arial, Helvetica, sans-serif; font-size: 11px; font-weight: normal; color: #000000; background-color: #E5E5E5; border-color: #000099 #000099 #000099 #000033 border-top-width: thin; border-right-width: thin}
	.fields_text2 {  font-family: Arial, Helvetica, sans-serif; font-size: 11px; font-weight: normal; color: #000000; background-color: #DBDBDB; border-color: #000099 #000099 #000099 #000033 border-top-width: thin; border-right-width: thin}
	.fields_back {  background-color: #000099; font-family: Arial, Helvetica, sans-serif; font-size: 11px; font-weight: bold; color: #FFFFFF}
	.main {  font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-weight: bold; color: #000099; background-color: #F9F9F9}
	.title2 {font: bold 18px Arial, Helvetica, sans-serif; color: #999999;}
	-->
</style>
</head>
<body bgcolor="#668CB1" rightmargin="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
<table width="100%" border="0" cellspacing="0" cellpadding="0">
<tr>
	<td width="70%">
		<table width="95%" border="0" cellspacing="0" cellpadding="2" class="label">
		<tr>
			<td><div style="padding-top:5px;padding-left:10px;padding-bottom:10px;"><span class="title2" style="letter-spacing:5px">
				<FONT FACE=VERDANA  color="#FFFFFF"><B>Zeta<FONT color="#006699">Pay</font> Admin</B></span>
				<FONT size=1 color="#FFFFFF">&nbsp;&nbsp;Copyright © 2005 <a href="http://www.banqpay.com" target=new>
				<font  color="#FFFFFF">BanQpay International</font></a></FONT>
			</td>
		</tr>
		</table>
	</td>
	<td width="30%" valign="middle" align=right style="padding-right:10px">
		<table width="100%" border="0" cellspacing="0" cellpadding="2" class="label">
		<tr>
			<td class="label">
				<a href=<?=$siteurl?>?<?=$id?> target=mainsite style="color:#FFFFFF"><?=strtoupper($sitename)?> HOME PAGE</font></a>
			</td>
			<td>
				<div align="right"><a href="index.php?logout=1" target=_top style="color:#FFFFFF">LOGOUT</font></a></div>
			</td>
		</tr>
		<tr>
			<td class="label">
				<a href=main.php?<?=$id?> target=right style="color:#FFFFFF">ADMINISTRATIVE INDEX</font></a>
			</td>
			<td>
				<div align="right">
				<a href=# onClick="parent.menu.location.reload();" target="menu" style="color:#FFFFFF">RELOAD MENU</font></a>
				</div>
			</td>
		</tr>
		</table>
	</td>
</tr>
</table>