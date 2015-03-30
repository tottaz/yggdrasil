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
                  <td colspan="2"><font color="#FFFFFF">&raquo;<b> Ad Managment</b></font></td>
                </tr>
                <tr> 
                  
                  <td bgcolor="#EEEEEE" width="10%">&nbsp;</td>
                  
                  <td bgcolor="#F9F9F9" width="90%"> 
                        <table border="0" cellspacing="1" cellpadding="2" bgcolor="#CCCCCC" bordercolor="#F9F9F9" align="center" width="100%">
                          <tr valign="middle" bgcolor="#FFFFFF"> 
                                <td width="15%"> 
                                  <div align="left"><b><font color="#666666">Campaign</font></b></div>
                                </td>
                                <td width="15%"> 
                                  <div align="left"><b><font color="#666666">Client </font></b></div>
                                </td>
                                <td width="15%"><b><font color="#666666">Status</font></b></td>
                                <td width="15%"><b><font color="#666666">Impressions</font></b></td>
                                <td width="20%"><b><font color="#666666">Override?</font></b></td>
                                <td width="10%"> 
                                  <div align="center"></div>
                                </td>
                                <td width="10%"> 
                                  <div align="center"></div>
                                  <div align="center"></div>
                                </td>
                          </tr>
                          <tr valign="middle" bgcolor="#FFFFFF"> 
                                <td colspan="7"><font color="#666666">Note, you cannot edit an 
                                  active campaign, disable it to edit, then re-enable it. This 
                                  will NOT reset impressions/clicks etc.</font></td>
                          </tr>
                        </table>
                        <br>
                        <?PHP
$SQL = "SELECT * from ADS";
$result = mysql_query( $SQL );
while( $row = mysql_fetch_array( $result ) ) {
$id = $row["ID"];
$name = $row["NAME"];
$client = $row["CLIENT"];
$status = $row["STATUS"];
$impressions = $row["IMPRESSIONS"];
$maximpressions = $row["MAXIMPRESSIONS"];
$clicks = $row["CLICKS"];
?>
                        <form name="form1" method="post" action="function.php?edit=tru&which=ADS&t1=STATUS&return=admanagment&id=<?php echo $id; ?>">
                          
                          <table border="0" cellspacing="1" cellpadding="2" bgcolor="#CCCCCC" bordercolor="#F9F9F9" align="center" width="100%">
                                <tr bgcolor="#FFFFFF"> 
                                  <td width="15%" valign="middle"> 
                                        <div align="left"><font color="#000000"> 
                                          <?php echo $name;?>
                                          </font></div>
                                  </td>
                                  <td width="15%" valign="middle"> 
                                        <div align="left"><b> 
                                          <?php echo $client;?>
                                          </b></div>
                                  </td>
                                  <td width="15%" valign="middle"> 
                                        <?php echo $status;?>
                                  </td>
                                  <td width="15%" valign="middle"> 
                                        <?php echo $impressions;?>
                                        / 
                                        <?php echo $maximpressions;?>
                                  </td>
                                  <td width="20%" valign="middle"> 
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                          <tr> 
                                                <td> 
                                                  <div align="center"> 
                                                        <select name="1">
                                                          <option value="Active">Activate</option>
                                                          <option value="Inactive">Disable</option>
                                                        </select>
                                                  </div>
                                                </td>
                                                <td> 
                                                  <div align="center"> 
                                                        <input type="submit" name="Submit" value="Go">
                                                  </div>
                                                </td>
                                          </tr>
                                        </table>
                                  </td>
                                  <td width="10%" valign="middle"> 
                                        <div align="center"><a href="../clients/cp.php?username=<?php echo $client; ?>" target="_blank"><img src="edit.jpg" width="12" height="17" border="0"></a> 
                                        </div>
                                  </td>
                                  <td width="10%" valign="middle"> 
                                        <div align="center"><a href="delete.php?id=<?php echo $id; ?>&type=ADS&return=admanagment"><img src="trash.jpg" width="14" height="17" border="0"></a></div>
                                        <div align="center"></div>
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


