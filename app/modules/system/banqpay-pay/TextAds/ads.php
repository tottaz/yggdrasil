<?PHP include 'config.php';
$xSQL = "SELECT * from SETTINGS"; $xresult = mysql_query( $xSQL ); while( $xrow = mysql_fetch_array( $xresult ) ) {
	$xpath 		= $xrow["PATH"];
	}
?>

<?PHP
$xSQL = "SELECT * from PREFERENCES"; $xresult = mysql_query( $xSQL );
while( $xrow = mysql_fetch_array( $xresult ) ) {
	$xmaxads 	= $xrow["MAXADS"];
}
?>

<?PHP
$xSQL = "SELECT * from ADS WHERE STATUS ='Active' ORDER BY RAND() LIMIT $xmaxads"; $xresult = mysql_query( $xSQL );
while( $xrow = mysql_fetch_array( $xresult ) ) {
	$xidd 		= $xrow["ID"];
	$xtitle 		= $xrow["TITLE"];
	$xdescc 		= $xrow["DESCC"];
	$xurl 		= $xrow["URL"];
	$xdispurl 	= $xrow["DISPURL"];
	$ximpressions 	= $xrow["IMPRESSIONS"]+1;
	$xmaximpressions = $xrow["MAXIMPRESSIONS"];
?>
<table align="center" width="100%" CELLPADDING="4">
 <tr> 
  <td class=tdbox><a href="<?php echo $xpath;?>redirect.php?id=<?php echo $xidd;?>&url=<?php echo $xurl; ?>" target=blank> 
   <?php echo "<b>$xtitle</b>"; ?>
   </a><br>
   <?php echo $xdescc;?>
   <BR>
   <b> <A HREF="<?php echo $xpath;?>redirect.php?id=<?php echo $xidd;?>&url=<?php echo $xurl; ?>" TARGET=blank>
   <?php echo "<b>$xdispurl</b>"; ?>
   </A></b></td>
 </tr>
</table>

<?php
$xsql 	= "UPDATE ADS SET IMPRESSIONS ='$ximpressions' where ID = '$xidd'";
$xquery 	= mysql_query($xsql) or die("Cannot query the database.<br>" . mysql_error());

if ($xmaximpressions == $ximpressions) {
	$xsql = "UPDATE ADS SET STATUS ='Ended', IMPRESSIONS = '0' where ID = '$xidd'";
	$xquery = mysql_query($xsql) or die("Cannot query the database.<br>" . mysql_error());
}
?>
 <br>
 <?php } ?>
<a href="<?PHP ECHO $xpath; ?>clients/">Your Ad Here</a>