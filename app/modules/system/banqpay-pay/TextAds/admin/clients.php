<?php
$edit = $_GET['edit'];
$id = $_GET['id'];
include "../config.php";
include "../default.css";
include 'auth.php';
if ($edit == 'tru') {

$SQL = "SELECT * from ADPACKAGES WHERE ID = '$id'";
$result = mysql_query( $SQL );
while( $row = mysql_fetch_array( $result ) ) {
$id = $row["ID"];
$impressions = $row["IMPRESSIONS"];
$cost = $row["COST"];
$name = $row["NAME"];
}
$x = '&edit=tru';
}

?>

<html>
<head>
<title>Paypal Information</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
</head>
<body bgcolor="#FFFFFF" text="#000000" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" link="#0066CC" vlink="#0066CC" alink="#0066CC">
<table width="100%" border="5" cellspacing="0" cellpadding="0" bordercolor="#FFFFFF">
  <tr> 
        
        <td> 
          <table width="100%" border="0" cellspacing="1" cellpadding="2" bgcolor="#FFFFFF" bordercolor="#FFFFFF">
                <tr bgcolor="#0066CC"> 
                  
                  <td colspan="2"><font color="#FFFFFF">&raquo;<b> Client List</b></font></td>
                </tr>
                <tr> 
                  
                  <td bgcolor="#EEEEEE" width="10%">&nbsp;</td>
                  
                  <td bgcolor="#F9F9F9" width="90%"> 
                        <table border="0" cellspacing="1" cellpadding="2" bgcolor="#CCCCCC" bordercolor="#F9F9F9" align="center" width="100%">
                          <tr valign="middle" bgcolor="#FFFFFF"> 
                                <td width="25%"> 
                                  <div align="left"><b><font color="#666666">Client Name</font></b></div>
                                </td>
                                <td width="25%"> 
                                  <div align="left"><b><font color="#666666">Password</font></b></div>
                                </td>
                                <td width="25%"> <b><font color="#666666">Email</font></b></td>
                                <td width="25%">
                                  <div align="center"><b><font color="#666666">Delete</font></b></div>
                                </td>
                          </tr>
                        </table>
                        <br>
                        <?PHP
$SQL = "SELECT * from CLIENTS";
$result = mysql_query( $SQL );
while( $row = mysql_fetch_array( $result ) ) {
$id = $row["ID"];
$username = $row["USERNAME"];
$password = $row["PASSWORD"];
$email = $row["EMAIL"];
?>
                        <form name="form1" method="post" action="function.php?edit=tru&which=ADS&t1=STATUS&return=admanagment&id=<?php echo $id; ?>">
                          
                          <table border="0" cellspacing="1" cellpadding="2" bgcolor="#CCCCCC" bordercolor="#F9F9F9" align="center" width="100%">
                                <tr bgcolor="#FFFFFF"> 
                                  <td width="25%" valign="middle"> 
                                        <div align="left"><font color="#000000"> 
                                          <?php echo $username;?>
                                          </font></div>
                                  </td>
                                  <td width="25%" valign="middle"> 
                                        <div align="left"><b> 
                                          <?php echo $password;?>
                                          </b></div>
                                  </td>
                                  <td width="25%" valign="middle"> 
                                        
                                        <a href="mailto:<?php echo $email; ?>"><?php echo $email; ?></a> </td>
                                  <td width="25%" valign="middle">
                                        <div align="center"><a href="delete.php?id=<?php echo $id; ?>&type=CLIENTS&return=clients"><img src="trash.jpg" width="14" height="17" border="0"></a></div>
                                  </td>
                                </tr>
                          </table>
                        </form>
                        <?php } ?>
                  </td>
                </tr>
          </table>
        </td>
  </tr>
</table>
</body>
</html>


