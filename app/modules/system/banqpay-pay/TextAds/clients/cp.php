<?php
$ip = $_SERVER["REMOTE_ADDR"];
include 'default.css';
include '../config.php';

$id = $_GET['id'];
$id = $_GET['idm'];
$type = $_GET['type'];
$return = $_GET['return'];
$edit = $_GET['edit'];
$username = $_GET['username'];


$usernameild = $_POST['username'];
$passwordild = $_POST['password'];


///////////////////////////
///////////////////////////

if ($login == tru) {$IP = 'USERNAME';}else {$IP = IP;}

$SQL = "SELECT * from SETTINGS";
$result = mysql_query( $SQL );
while( $row = mysql_fetch_array( $result ) ) {
$isadmin = $row["$IP"];
}
if ($isadmin == $ip) {}else{

$SQL = "SELECT * from CLIENTS WHERE IP = '$ip'";
$result = mysql_query( $SQL );
while( $row = mysql_fetch_array( $result ) ) {
$isclient = $row["$IP"];
}
if ($ip == $isclient) {} else {

$SQL = "SELECT * from CLIENTS WHERE USERNAME = '$usernameild' AND PASSWORD = '$passwordild'";
$result = mysql_query( $SQL );
while( $row = mysql_fetch_array( $result ) ) {
$is = $row["USERNAME"];
$idqrst = $row["ID"];
$client = $row["PASSWORD"];
$isclient = "$is$client";
}
if (empty($isclient)) {include 'auth.php';
}else {$sql = "UPDATE CLIENTS SET IP ='$ip' where ID = '$idqrst'";
$query = mysql_query($sql) or die("Cannot query the database.<br>" . mysql_error());}
}
}

?>

<html>
<head>
<script type="text/JavaScript">
function limitLength(element, maxLength)
{
if (element.value.length > maxLength)
{
element.value = element.value.substring(0, maxLength);
return 0;
}
}
</script>
<title>Text Ads Member Control Panel</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
</head>

<body bgcolor="#FFFFFF" text="#000000" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" link="000000" vlink="000000" alink="000000">
<div align="center"> <br>
  Advertise with <b>&quot;Your Company&quot;</b> <br>
  <?PHP
$SQL = "SELECT * from CLIENTS WHERE IP = '$ip'";
$result = mysql_query( $SQL );
while( $row = mysql_fetch_array( $result ) ) {
$username = $row["USERNAME"];
$iidd = $row["ID"];
}
?>
  Welcome 
  <?php echo $username; ?>
  ! <br>
  <br>
  <hr size="1" width="90%">
  <br>
  <table border="0" cellspacing="0" cellpadding="0" bordercolor="#FFFFFF" width="90%">
        <tr> 
          
          <td valign="top" bgcolor="#FFFFFF" width="30%"> 
                <table cellspacing="0" cellpadding="7" border="1" bordercolor="#0066CC" bgcolor="#CCCCCC" width="100%">
                  <tr bgcolor="#0066CC"> 
                        <td> <font color="#FFFFFF"><b>YOUR CAMPAIGNS</b></font></td>
                  </tr>
                </table>
                <?PHP
$SQL = "SELECT * from ADS WHERE CLIENT = '$username'";
$result = mysql_query( $SQL );
while( $row = mysql_fetch_array( $result ) ) {
$id = $row["ID"];
$namee = $row["NAME"];
$clicks = $row["CLICKS"];
$maximpressions = $row["MAXIMPRESSIONS"];
$curimpressions = $row["IMPRESSIONS"];
$status = $row["STATUS"];?>
                <?PHP
$SQL2 = "SELECT * from ADPACKAGES WHERE IMPRESSIONS = '$maximpressions'";
$result2 = mysql_query( $SQL2 );
while( $row2 = mysql_fetch_array( $result2 ) ) {
$ID = $row2["ID"];
$impressions = $row2["IMPRESSIONS"];
$cost = $row2["COST"];
$name = $row2["NAME"];}

?>
                <?PHP
$SQL3 = "SELECT * from SETTINGS";
$result3 = mysql_query( $SQL3 );
while( $row3 = mysql_fetch_array( $result3 ) ) {
$path = $row3["PATH"];
$receiver_email = $row3["RECEIVER_EMAIL"];
$currency = $row3["CURRENCY"];
$logo_url = $row3["LOGO_URL"];
$return_url = $row3["SUCCESS_URL"];
$cancel_url = $row3["CANCEL_URL"];
}
?>
                
    <form name="form1" method="post" action="https://www.paypal.com/cgi-bin/webscr/mrb/pal=9QQVZHP6UK9L2">
     <table cellspacing="0" cellpadding="7" border="0" bordercolor="#0066CC" bgcolor="#CCCCCC" width="100%">
                        <tr bgcolor="#F9F9F9"> 
                          <td width="50%"> 
                                
                                <table width="100%" border="0" cellspacing="5" cellpadding="0">
                                  <tr> 
                                        <td width="50%">Campaign </td>
                                        <td width="50%"> 
                                          <?PHP ECHO $namee; ?>
                                        </td>
                                  </tr>
                                  <tr> 
                                        <td width="50%"><font color="#000000">Impressions</font></td>
                                        <td width="50%"> 
                                          <?php echo $maximpressions; ?>
                                        </td>
                                  </tr>
                                  <tr> 
                                        <td> <font color="#000000">Status </font></td>
                                        <td> 
                                          <?PHP ECHO $status; ?>
                                        </td>
                                  </tr>
                                  <tr> 
                                        <td> <font color="#999999"><a href="delete.php?id=<?php echo $id; ?>&type=ADS&return=cp"><br>
                                          </a> 
                                          <?php if ($status == Active) {?>
                                          <font color="#000000">Impressions</font> 
                                          <?php } ?>
                                          <?php if ($status == Active) {} else { ?>
                                          <a href="delete.php?id=<?php echo $id; ?>&type=ADS&return=cp"><img src="../admin/trash.jpg" width="14" height="17" border="0"></a> 
                                          <?php } ?>
                                          <?php if ($status == Active) {} else { ?>
                                          | <a href="cp.php?idm=<?php echo $id; ?>&edit=tru&username=<?php echo $username; ?>"><img src="../admin/edit.jpg" width="12" height="17" border="0"></a> 
                                          <?php } ?>
                                          </font></td>
                                        <td> <font color="#999999"><br>
                                          <?php if ($status == Active) {?>
                                          <font color="#999999"><font color="#000000"> 
                                          <?php echo $curimpressions; ?>
                                          </font></font><font color="#000000">/ 
                                          <?php echo $impressions; ?>
                                          </font> 
                                          <?php } ?>
                                          <?php if ($status == Active) {} else { ?>
                                          <input type="submit" name="Activate" value="Activate">
                                          <?php } ?>
                                          </font></td>
                                  </tr>
                                  <tr>
                                        <td><font color="#000000">Clicks</font></td>
                                        <td>
                                          <?PHP ECHO $clicks;?>
                                        </td>
                                  </tr>
                                </table>
                                <input type="hidden" name="bn" value="mirndtsoft-textads">
                                <input type=hidden name=cmd value=_xclick>
                                <input type="hidden" name="rm" value="1">
                                <input type=hidden name=business value=<?php echo $receiver_email; ?>>
                                <input type=hidden name=item_name value="<?php echo "$maximpressions"; ?>">
                                <input type=hidden name=item_number value="<?php echo $id; ?>">
                                <input type=hidden name=amount value=<?php echo $cost; ?>>
                                <input type=hidden name=currency_code value=<?php echo $currency; ?>>
                                <input type=hidden name=image_url value=<?php echo $logo_url; ?>>
                                <input type=hidden name=return value=<?php echo $return_url; ?>>
                                <input type=hidden name=cancel_return value=<?php echo $cancel; ?>>
                                <input type=hidden name=custom value=>
                                <input type="hidden" name="notify_url" value="<?php echo $path; ?>taipn.php">
                          </td>
                        </tr>
                  </table>
                </form>
                <?php } ?>
          </td>
          
          <td valign="top" bgcolor="#FFFFFF" width="70%"> 
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr> 
                        
                        <td width="49%" valign="top"> 
                          <table cellspacing="0" cellpadding="7" bordercolor="#0066CC" bgcolor="#CCCCCC" width="90%" align="center">
                                <tr bgcolor="#F9F9F9"> 
                                  
                                  <td width="50%">To begin, start by creating a new campaign on 
                                        your right. ---&gt;<br>
                                        <br>
                                        &lt;--- You may view and edit and activate your existing ad 
                                        campaigns on the left.<br>
                                        <br>
                                        Once you have created an advertisement, click 'Activate' to 
                                        make a payment for this ad. Your ad will be activated immediately 
                                        after payment.</td>
                                </tr>
                          </table>
                        </td>
                        <td width="49%" valign="top"> 
                          <?PHP
$SQL4 = "SELECT * from ADS WHERE ID = '$idm'";
$result4 = mysql_query( $SQL4 );
while( $row4 = mysql_fetch_array( $result4 ) ) {
$id2 = $row4["ID"];
$title2 = $row4["TITLE"];
$desc2 = $row4["DESCC"];
$url2 = $row4["URL"];
$dispurl2 = $row4["DISPURL"];
$maxi2 = $row4["MAXIMPRESSIONS"];
$imps2 = $row4["IMPRESSIONS"];
$name2 = $row4["NAME"];}
?>
                          
                          <form name="form1" method="post" action="nc.php?edit=<?php echo $edit; ?>&id=<?php echo $idm; ?>">
                                <table cellspacing="0" cellpadding="7" border="1" bordercolor="#0066CC" bgcolor="#CCCCCC" width="100%">
                                  <tr bgcolor="#0066CC"> 
                                        <td> <font color="#FFFFFF"><b>NEW CAMPAIGN | <a href="cp.php"><font color="#CCCCCC">RESET 
                                          FORM</font></a></b></font></td>
                                  </tr>
                                  <tr bgcolor="#F9F9F9"> 
                                        <td width="50%"> 
                                          <table width="100%" border="0" cellspacing="5" cellpadding="0">
                                                <tr> 
                                                  <td width="50%">Campaign</td>
                                                  <td width="50%"> 
                                                        <input type="text" name="1" value="<?php echo $name2; ?>">
                                                  </td>
                                                </tr>
                                                <tr> 
                                                  
                                                  <td width="50%">Title (max 75)</td>
                                                  <td width="50%"> 
                                                        
                                                        <input type="text" name="2" value="<?php echo $title2; ?>" maxlength="75">
                                                  </td>
                                                </tr>
                                                <tr> 
                                                  
                                                  <td> Description<br>
                                                        (max 150)</td>
                                                  <td> 
                                                        <textarea rows="7" onKeyDown="limitLength(this, 255);" onKeyUp="limitLength(this, 255);" wrap name="3"><?php echo $desc2; ?></textarea>
                                                  </td>
                                                </tr>
                                                <tr> 
                                                  <td><b>FULL</b> URL</td>
                                                  <td> 
                                                        <input type="text" name="4" value="<?php echo $url2; ?>">
                                                  </td>
                                                </tr>
                                                <tr> 
                                                  <td>Display URL</td>
                                                  <td> 
                                                        <input type="text" name="5" value="<?php echo $dispurl2; ?>">
                                                  </td>
                                                </tr>
                                                <tr> 
                                                  <td>Impressions</td>
                                                  <td> 
                                                        <select name="8">
                                                          <option value="<?php echo $maxi2; ?>" selected> 
                                                          <?php echo $maxi2; ?>
                                                          </option>
                                                          <?PHP
$SQL = "SELECT * from ADPACKAGES";
$result = mysql_query( $SQL );
while( $row = mysql_fetch_array( $result ) ) {
$id = $row["ID"];
$impressions = $row["IMPRESSIONS"];
$cost = $row["COST"];
$name = $row["NAME"];
?>
                                                          <option value="<?php echo $impressions; ?>"> 
                                                          <?php echo "$impressions | \$$cost"; ?>
                                                          </option>
                                                          <?php } ?>
                                                        </select>
                                                  </td>
                                                </tr>
                                                <tr> 
                                                  <td colspan="2"> 
                                                        <div align="center"><font color="#999999"> <br>
                                                          <input type="submit" name="Submit2" value="Submit">
                                                          <input type="hidden" name="6" value="<?php echo $username; ?>">
                                                          <input type="hidden" name="7" value="Inactive">
                                                          </font></div>
                                                  </td>
                                                </tr>
                                          </table>
                                        </td>
                                  </tr>
                                </table>
                          </form>
                        </td>
                  </tr>
                </table>
          </td>
        </tr>
  </table>
  <hr size="1" width="90%">
  <br>
  | <a href="logout.php?id=<?php echo $iidd; ?>">Log Out</a> | 
  <div align="right"><font color="#999999"> <br>
        Powered by <a href="http://www.mirndtsoft.com"><font color="#999999">Text 
        Ads</font></a></font> </div>
  <p><br>
        <br>
        <br>
  </p>
</div>
</body>
</html>
