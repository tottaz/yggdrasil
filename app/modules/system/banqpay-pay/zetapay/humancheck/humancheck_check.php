<?PHP
	error_reporting(85);//serious error only

	require(dirname(__FILE__)."/humancheck_config.php");
	$sid=trim($HTTP_POST_VARS["sid"]);

	session_id($sid);
	session_start();
	$noautomationcode = $HTTP_SESSION_VARS["noautomationcode"];
	//if you want you can  destroy session here so code will be deleted
	//or keep the session and put into it some variable like
	//$HTTP_SESSION_VARS["access_allowed"]) = true;
	//and check it from page to page
	//from here you can do whatsoever you want.
	/*
	unset($HTTP_SESSION_VARS["noautomationcode"]);
	session_unregister($noautomationcode);
	session_destroy();
	*/
	$code = trim($HTTP_POST_VARS["code"]);
	if($code != $noautomationcode){
		//codes do not match.
		die("Dear visitor you have entered wrong code. <br> Blah blah try again.<br>Or you are the evil script trying to access my server<br><h1>Access Denied</h1>");
	}
?>


<html>
<body>
<p><strong>Code is OK you are allowd to see my page. </strong><br>
  From here you can redirect visitor, or allow him to download something or insert 
  registration data to the database. etc.</p>
<table width="694" border="5" align="center" cellpadding="5" cellspacing="1" bordercolor="#FF0000" bgcolor="#FFFFCC">
  <tr> 
    <td colspan="3" bordercolor="#FFFF00" bgcolor="#FFFF00"><strong><font color="#FF0000">Remember! 
      </font></strong></td>
  </tr>
  <tr bordercolor="#FFFFCC" bgcolor="#FFFFCC"> 
    <td width="144"> 
      <p align="left"><font color="#0000FF"><strong>When 
        you work with </strong></font></p></td>
    <td width="302">&nbsp;</td>
    <td width="198">&nbsp;</td>
  </tr>
  <tr bordercolor="#FFFFCC" bgcolor="#FFFFCC"> 
    <td> 
      <div align="center"><font color="#0000FF"></font></div></td>
    <td><div align="center"><font color="#0000FF"><strong><a href="http://horobey.com/" target="_top"><em><font size="+1">Horobey 
        Freelance &amp; Telecommuting</font></em></a> </strong></font></div></td>
    <td><font color="#0000FF">&nbsp;</font></td>
  </tr>
  <tr bordercolor="#FFFFCC" bgcolor="#FFFFCC"> 
    <td> 
      <div align="right"><font color="#0000FF"></font></div></td>
    <td>&nbsp;</td>
    <td><font color="#0000FF"><strong>the only limit is your fantasy</strong></font></td>
  </tr>
  <tr> 
    <td colspan="3" bordercolor="#FFFF00" bgcolor="#FFFF00">&nbsp;</td>
  </tr>
</table>
<p><strong><br>
  </strong></p>
<p>
  <!-- #BeginDate format:Am1 -->June 14, 2003<!-- #EndDate -->
</p>
<blockquote> 
  <p>&nbsp;</p>
  <blockquote> 
    <blockquote>
      <p>&nbsp;</p>
    </blockquote>
  </blockquote>
</blockquote>
</body>
</html>