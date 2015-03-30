<?php
include 'default.css';
include '../config.php';
?>

<html>
<head>
<title>Text Ads</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
</head>

<body bgcolor="#FFFFFF" text="#000000" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" link="#000000" vlink="000000" alink="000000">
<div align="center"> <br>
  Advertise with <b>&quot;Your Company&quot;</b> <br>
  <br>
  <hr size="1" width="90%">
  <br>
  <table border="0" cellspacing="0" cellpadding="0" bordercolor="#FFFFFF" width="90%">
	<tr> 
	  <td valign="top" bgcolor="#FFFFFF" width="30%"> 
		<table cellspacing="0" cellpadding="7" border="1" bordercolor="#FFFFFF" bgcolor="#CCCCCC" width="90%">
		  <tr> 
			<td bgcolor="#0066CC" width="58%"> <font color="#FFFFFF"><b>IMPRESSIONS 
			  / COST</b></font></td>
		  </tr>
		</table>
		<?PHP
$SQL = "SELECT * from ADPACKAGES";
$result = mysql_query( $SQL );
while( $row = mysql_fetch_array( $result ) ) {
$id = $row["ID"];
$impressions = $row["IMPRESSIONS"];
$cost = $row["COST"];
$name = $row["NAME"];
?>
		<table cellspacing="0" cellpadding="7" border="1" bordercolor="#FFFFFF" bgcolor="#CCCCCC" width="90%">
		  <tr> 
			<td bgcolor="#F9F9F9" width="50%"><b>
			  <?PHP ECHO $impressions; ?>
			  </b></td>
			<td bgcolor="#F9F9F9" width="50%"> $
			  <?PHP ECHO $cost; ?>
			</td>
		  </tr>
		</table>
		<?php } ?>
	  </td>
	  <td valign="top" bgcolor="#FFFFFF" width="70%"> 
		<table cellspacing="0" cellpadding="7" border="1" bordercolor="#0066CC" bgcolor="#CCCCCC" width="100%">
		  <tr> 
			<td bgcolor="#0066CC"> <font color="#FFFFFF"><b>ADVERTISE WITH US 
			  </b></font></td>
		  </tr>
		  <tr> 
			<td bgcolor="#F9F9F9">This system allows you to add your text advertisement 
			  to our website, activation is instant after payment is received. 
			  This system will use Paypal to take your order.<br>
			  <br>
			  Existing clients who want to view their campaign stats, <b>sign 
			  in</b>. If you dont have an account yet and want to get started 
			  advertising your website, start by creating a new account. </td>
		  </tr>
		</table>
	    <br>
		<table width="100%" border="0" cellspacing="0" cellpadding="0">
		  <tr> 
			<td width="49%" valign="top"> 
			  <form name="form1" method="post" action="lostpassword.php">
				<table cellspacing="0" cellpadding="7" border="1" bordercolor="#0066CC" bgcolor="#CCCCCC" width="100%">
				  <tr bgcolor="#0066CC"> 
					<td> <font color="#FFFFFF"><b>SIGN IN</b></font></td>
				  </tr>
				  <tr bgcolor="#0066CC">
					<td bgcolor="#F9F9F9">Already have an account with us? <a href="cp.php?login=tru"><b>SIGN 
					  IN</b></a>.. <br>
					  <br>
					  If you have already registered and lost your password, enter 
					  the email address you signed up with below :<br>
					  <br>
					  <table width="100%" border="0" cellspacing="5" cellpadding="0">
						<tr> 
						  <td width="50%">EMAIL</td>
						  <td width="50%"> 
							<input type="text" name="lost">
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
			</td>
			<td width="2%">&nbsp;</td>
			<td width="49%" valign="top"> 
			  <form name="form2" method="post" action="create.php">
				<table cellspacing="0" cellpadding="7" border="1" bordercolor="#0066CC" bgcolor="#CCCCCC" width="100%">
				  <tr bgcolor="#0066CC"> 
					<td> <font color="#FFFFFF"><b>CREATE ACCOUNT</b></font></td>
				  </tr>
				  <tr bgcolor="#F9F9F9"> 
					<td width="50%"> 
					  <table width="100%" border="0" cellspacing="5" cellpadding="0">
						<tr> 
						  <td width="50%">USERNAME</td>
						  <td width="50%"> 
							<input type="text" name="1">
						  </td>
						</tr>
						<tr> 
						  <td width="50%">PASSWORD</td>
						  <td width="50%"> 
							<input type="password" name="2">
						  </td>
						</tr>
						<tr> 
						  <td width="50%">PASSWORD*</td>
						  <td width="50%"> 
							<input type="password" name="3">
						  </td>
						</tr>
						<tr> 
						  <td> EMAIL</td>
						  <td>
							<input type="text" name="4">
						  </td>
						</tr>
						<tr> 
						  <td colspan="2"> 
							<div align="center"> <br>
							  <input type="submit" name="Submit" value="Submit">
							</div>
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
  <div align="right"><font color="#999999"><br>
	</font> <font color="#999999">Powered by <a href="http://www.idevspot.com" target="_blank"><font color="#666666">Text 
	Ads</font></a> </font></div>
  <p><br>
	<br>
	<br>
  </p>
</div>
</body>
</html>
