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
          <?PHP
$SQL = "SELECT * from ADPACKAGES WHERE ID='$id'";
$result = mysql_query( $SQL );
while( $row = mysql_fetch_array( $result ) ) {
$id = $row["ID"];
$impressions = $row["IMPRESSIONS"];
$cost = $row["COST"];
$name = $row["NAME"];
}?>
          
          
          <table width="100%" border="0" cellspacing="1" cellpadding="2" bgcolor="#FFFFFF" bordercolor="#FFFFFF">
                
                <tr bgcolor="#0066CC"> 
                  <td width="100%" colspan="2"> <font color="#FFFFFF">&raquo;<b> New Ad 
                        Package | <a href="adpackages.php"><font color="#CCCCCC">Refresh</font></a></b></font></td>
                </tr>
                <tr> 
                  <td bgcolor="#EEEEEE" width="10%"> <br>
                  </td>
                  <td bgcolor="#F9F9F9" width="90%"> 
                        
                        <form name="form1" method="post" action="function.php?which=ADPACKAGES&return=adpackages<?php echo $x; ?>&id=<?php echo $id; ?>&t1=NAME&t2=IMPRESSIONS&t3=COST">
                          <div align="left"> 
                                <table border="0" cellspacing="1" cellpadding="2" bgcolor="#CCCCCC" bordercolor="#F9F9F9">
                                  <tr valign="middle" bgcolor="#FFFFFF"> 
                                        <td> 
                                          <div align="left"><font color="#666666"><b>DISPLAY NAME</b></font></div>
                                        </td>
                                        <td><b> 
                                          <input type="text" name="1" value="<?php echo $name; ?>" size="30">
                                          </b></td>
                                        <td><font color="#666666">&raquo; Give this ad package a name</font></td>
                                  </tr>
                                  <tr bgcolor="#FFFFFF" valign="middle"> 
                                        <td> 
                                          <div align="left"><b><font color="#666666">IMPRESSIONS</font></b></div>
                                        </td>
                                        <td><b> 
                                          <input type="text" name="2" value="<?php echo $impressions; ?>" size="30">
                                          </b></td>
                                        
                                        <td><font color="#666666">&raquo; Number of impressions for 
                                          this package. (Do not seperate with commas or periods)</font></td>
                                  </tr>
                                  <tr bgcolor="#FFFFFF" valign="middle"> 
                                        <td><b><font color="#666666">PRICE</font></b></td>
                                        <td><b> 
                                          <input type="text" name="3" value="<?php echo $cost; ?>" size="30">
                                          </b></td>
                                        
                                        <td><font color="#666666">&raquo; Cost of this package. Format 
                                          example : 0.00</font></td>
                                  </tr>
                                  <tr bgcolor="#EEEEEE" valign="middle"> 
                                        <td colspan="3">
                                          <div align="right"><font color="#666666"> 
                                                <input type="submit" name="Apply" value="Apply">
                                                </font></div>
                                        </td>
                                  </tr>
                                </table>
                                
                          </div>
                        </form>
                  </td>
                </tr>
                
                <tr bgcolor="#0066CC"> 
                  <td colspan="2"><font color="#FFFFFF">&raquo;<b> Current Ad Packages</b></font></td>
                </tr>
                <tr> 
                  <td bgcolor="#EEEEEE" width="10%" height="76">&nbsp;</td>
                  <td bgcolor="#F9F9F9" width="90%" height="76"> 
                        <?PHP
$SQL = "SELECT * from ADPACKAGES";
$result = mysql_query( $SQL );
while( $row = mysql_fetch_array( $result ) ) {
$id = $row["ID"];
$impressions = $row["IMPRESSIONS"];
$cost = $row["COST"];
$name = $row["NAME"];
?>
                        <table cellspacing="1" cellpadding="2" border="5" bordercolor="#F9F9F9" bgcolor="#FFFFFF" width="100%">
                          <tr> 
                                <td bgcolor="#FCFCFC" width="40%"> 
                                  <?php echo $name;?>
                                </td>
                                <td width="10%" bgcolor="#F9F9F9"> 
                                  
                                  <div align="center"><a href="adpackages.php?edit=tru&id=<?php echo $id; ?>">EDIT</a></div>
                                </td>
                                <td width="30%" bgcolor="#FCFCFC"> 
                                  
                                  <div align="center"><a href="delete.php?id=<?php echo $id; ?>&type=ADPACKAGES&return=adpackages"><img src="ti.jpg" width="12" height="18" border="0"></a></div>
                                </td>
                          </tr>
                        </table>
                        <?php } ?>
                  </td>
                </tr>
          </table>
        </td>
  </tr>
</table>
</body>
</html>


