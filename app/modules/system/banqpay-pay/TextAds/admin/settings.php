<?php
$edit = $_GET['edit'];
$id = $_GET['id'];

include "../config.php";
include "../default.css";
include 'auth.php';
?>

<html>
<head>
<title>Settings</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
</head>
<body bgcolor="#FFFFFF" text="#000000" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
<table width="100%" border="5" cellspacing="0" cellpadding="0" bordercolor="#FFFFFF">
  <tr> 
        <td> 
          <?PHP
$SQL = "SELECT * from SETTINGS";
$result = mysql_query( $SQL );
while( $row = mysql_fetch_array( $result ) ) {
$path = $row["PATH"];
$id = $row["ID"];
$receiver_email = $row["RECEIVER_EMAIL"];
$currency = $row["CURRENCY"];
$logo_url = $row["LOGO_URL"];
$success_url = $row["SUCCESS_URL"];
$cancel_url = $row["CANCEL_URL"];
}

?>
          
          <table width="100%" border="0" cellspacing="1" cellpadding="2" bgcolor="#FFFFFF" bordercolor="#FFFFFF">
                
                <tr bgcolor="#0066CC"> 
                  <td width="100%" colspan="2"> <font face="Verdana, Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">&raquo;<b> 
                        Paths &amp; Settings</b></font></td>
                </tr>
                <tr> 
                  <td bgcolor="#EEEEEE" width="10%"> <br>
                  </td>
                  <td bgcolor="#F9F9F9" width="90%"> 
                        
                        <form name="form1" method="post" action="function.php?which=SETTINGS&t1=PATH&return=settings&edit=tru&id=<?php echo $id; ?>&t2=RECEIVER_EMAIL&t3=CURRENCY&t4=LOGO_URL&t5=SUCCESS_URL&t6=CANCEL_URL">
                          <div align="left">
                                <table border="0" cellspacing="1" cellpadding="2" bgcolor="#CCCCCC" bordercolor="#F9F9F9" align="center">
                                  <tr valign="middle" bgcolor="#FFFFFF"> 
                                        <td> 
                                          <div align="left"><font color="#666666"><b>PAYPAL EMAIL</b></font></div>
                                        </td>
                                        <td> 
                                          <div align="left"><b> 
                                                <input type="text" name="2" value="<?php echo $receiver_email; ?>" size="30">
                                                </b></div>
                                        </td>
                                        <td><font color="#666666">&raquo; Your Paypal account email 
                                          address </font></td>
                                  </tr>
                                  <tr bgcolor="#FFFFFF" valign="middle"> 
                                        <td> 
                                          <div align="left"><font color="#666666"><b>CURRENCY</b></font></div>
                                        </td>
                                        <td> 
                                          <div align="left"> <b> 
                                                <select name="3">
                                                  <option selected><font color="#000000"> 
                                                  <?PHP echo $currency; ?>
                                                  </font></option>
                                                  <option value="USD"><font color="#000000">US Dollars</font></option>
                                                  <option value="CAD"><font color="#000000">Canadian Dollars</font></option>
                                                  <option value="EUR"><font color="#000000">Euros</font></option>
                                                  <option value="GBP"><font color="#000000">Pounds Sterling</font></option>
                                                  <option value="JPY"><font color="#000000">YEN</font></option>
                                                  <option value="AUD"><font color="#000000">Australian Dollars</font></option>
                                                </select>
                                                </b></div>
                                        </td>
                                        <td><font color="#666666">&raquo; The currency you would like 
                                          to sell in</font></td>
                                  </tr>
                                  <tr bgcolor="#FFFFFF" valign="middle"> 
                                        <td> 
                                          <div align="left"><font color="#666666"><b> LOGO URL</b></font></div>
                                        </td>
                                        <td> 
                                          <div align="left"><b> 
                                                <input type="text" name="4" value="<?php echo $logo_url; ?>" size="30">
                                                </b></div>
                                        </td>
                                        <td><font color="#666666">&raquo; The full URL to your company 
                                          logo, (will appear during Paypal checkout)</font></td>
                                  </tr>
                                  <tr bgcolor="#FFFFFF" valign="middle"> 
                                        <td> 
                                          <div align="left"><font color="#666666"><b> RETURN PAGE</b></font></div>
                                        </td>
                                        <td> 
                                          <div align="left"><b> 
                                                <input type="text" name="5" value="<?php echo $success_url; ?>" size="30">
                                                </b></div>
                                        </td>
                                        <td><font color="#666666">&raquo; The return page on your 
                                          site after purchase is completed. <i>Reccommend : http://www.yourdomain.com/textads/clients/cp.php</i></font></td>
                                  </tr>
                                  <tr bgcolor="#FFFFFF" valign="middle"> 
                                        <td><b><font color="#666666">CANCEL RETU</font></b><font color="#666666"><b>R</b></font><b><font color="#666666">N 
                                          PAGE</font></b></td>
                                        <td><b> 
                                          <input type="text" name="6" value="<?php echo $cancel_url; ?>" size="30">
                                          </b></td>
                                        <td bgcolor="#FFFFFF"><font color="#666666">&raquo; The return 
                                          page on your site if visitor cancels checkout.</font></td>
                                  </tr>
                                  <tr bgcolor="#FFFFFF" valign="middle"> 
                                        <td bgcolor="#FFFFFF"> <font color="#666666"><b>URL TO TEXT 
                                          ADS</b></font> </td>
                                        <td> 
                                          <input type="text" name="1" value="<?php echo $path; ?>" size="30">
                                        </td>
                                        <td><font color="#666666">&raquo; http://www.yourdomain.com/textads/</font></td>
                                  </tr>
                                  <tr bgcolor="#EEEEEE" valign="middle"> 
                                        <td colspan="3"> 
                                          <div align="right"> 
                                                <input type="submit" name="Apply2" value="Apply">
                                          </div>
                                        </td>
                                  </tr>
                                </table>
                          </div>
                        </form>
                  </td>
                </tr>
          </table>
        </td>
  </tr>
</table>
</body>
</html>


