<html>
<head>
<title>Administration Login</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
</head>

<body bgcolor="#FFFFFF" text="#000000">
<br>
<table border="0" cellspacing="0" cellpadding="0" align="center">
  <tr> 
        <td width="17" bgcolor="#333333" background="../img/tl.jpg"></td>
        <td height="17" background="../img/shgt.jpg"></td>
        <td width="7" bgcolor="#333333" background="../img/tr.jpg"></td>
  </tr>
  <tr> 
        <td width="7" background="../img/svgl.jpg"></td>
        <td bgcolor="#FFFFFF"> 
          <table border="5" cellspacing="0" cellpadding="0" bordercolor="#FFFFFF" width="100%">
                <tr> 
                  <td valign="top"> 
                        <div align="center"> <font face="Verdana, Arial, Helvetica, sans-serif" size="1"> 
                          Text Ads Administration Login</font></div>
                  </td>
                </tr>
          </table>
        </td>
        <td width="17" background="../img/svgr.jpg"></td>
  </tr>
  <tr> 
        <td width="7" bgcolor="#333333" background="../img/bl.jpg"></td>
        <td height="17" background="../img/shg.jpg"></td>
        <td width="7" bgcolor="#333333" background="../img/br.jpg"></td>
  </tr>
</table>
<br>
<form name="form1" method="post" action="<?php echo $PHP_SELF; ?>">
  <table cellspacing="1" cellpadding="2" border="0" bordercolor="#F9F9F9" bgcolor="#FFFFFF" align="center">
        <tr bgcolor="#EEEEEE"> 
          <td bgcolor="#EEEEEE">Username</td>
          <td> 
                <input type="text" name="user" size="15">
          </td>
        </tr>
        <tr bgcolor="#FCFCFC"> 
          <td> 
                <div align="center">Password</div>
          </td>
          <td> 
                <input type="text" name="pass" size="15">
          </td>
        </tr>
        <tr bgcolor="#FCFCFC"> 
          <td colspan="2"> 
                <div align="right"> 
                  <input type="hidden" name="auth" value="auth">
                  <input type="submit" name="Submit" value="Submit">
                </div>
          </td>
        </tr>
  </table>
</form>
</body>
</html>
