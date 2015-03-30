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
$SQL = "SELECT * from PREFERENCES";
$result = mysql_query( $SQL );
while( $row = mysql_fetch_array( $result ) ) {
$id = $row["ID"];
$maxads = $row["MAXADS"];

}
$ic = "$maxads";
if (empty($ic)) {$x='&edit=';}else{$x='&edit=tru';}

?>
          
          <table width="100%" border="0" cellspacing="1" cellpadding="2" bgcolor="#FFFFFF" bordercolor="#FFFFFF">
                
                <tr bgcolor="#0066CC"> 
                  <td width="100%" colspan="2"> <font face="Verdana, Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">&raquo;<b> 
                        Preferences</b></font></td>
                </tr>
                <tr> 
                  <td bgcolor="#EEEEEE" width="10%"> <br>
                  </td>
                  <td bgcolor="#F9F9F9" width="90%"> 
                        
                        <form name="form1" method="post" action="function.php?which=PREFERENCES&t1=MAXADS&return=preferences<?php echo $x; ?>&id=<?php echo $id; ?>">
                          <div align="left">
                                <table border="0" cellspacing="1" cellpadding="2" bgcolor="#CCCCCC" bordercolor="#F9F9F9" align="center" width="100%">
                                  <tr bgcolor="#FFFFFF" valign="middle"> 
                                        <td bgcolor="#FFFFFF"> <font color="#666666"><b>MAX ADS</b></font></td>
                                        <td> 
                                          <input type="text" name="1" value="<?php echo $maxads; ?>" size="30" maxlength="4">
                                        </td>
                                        <td><font color="#666666">&raquo; Maximum number of ads to 
                                          display at once from pool of active advertisments</font></td>
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


