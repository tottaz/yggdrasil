<html>
<head>
<title>Auth</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
</head>

<body bgcolor="#FFFFFF" text="#000000">
<div align="center"><br>
  <?php echo $greeting; ?>
  <br>
</div>
<form name="form1" method="post" action="cp.php">
  <table cellspacing="0" cellpadding="7" border="1" bordercolor="#0066CC" bgcolor="#CCCCCC" align="center">
        <tr bgcolor="#0066CC"> 
          <td> <font color="#FFFFFF"><b>SIGN IN</b></font></td>
        </tr>
        <tr bgcolor="#F9F9F9"> 
          <td> 
                <table border="0" cellspacing="5" cellpadding="0">
                  <tr> 
                        <td width="50%">USERNAME</td>
                        <td width="50%"> 
                          <input type="text" name="username">
                        </td>
                  </tr>
                  <tr> 
                        <td width="50%">PASSWORD</td>
                        <td width="50%"> 
                          <input type="text" name="password">
                        </td>
                  </tr>
                  <tr> 
                        <td colspan="2"> 
                          <div align="center"><br>
                                <input type="submit" name="Submit2" value="Submit">
                          </div>
                        </td>
                  </tr>
                </table>
          </td>
        </tr>
  </table>
</form>
</body>
</html>

<?php
die();
?>
