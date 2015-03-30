
<table width="100%" border="0" cellspacing="5" cellpadding="0">
<tr>
<td nowrap height="29"><i><b>Logged Out    |</b></i></td>
<td background="i_01.jpg" width="100%" height="29"></td>
</tr>
<tr>
<td colspan="2">
<p>You have been logged out. Click <b><a href="index.php">HERE</a></b> to log in again.</p>
</td>
</tr>
</table>
<?php
include "../config.php";
$sql = "UPDATE SETTINGS SET IP='X'";
$query = mysql_query($sql) or die("Cannot query the database.<br>" . mysql_error());
?>
