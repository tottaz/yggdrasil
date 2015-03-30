<?
	chdir('zetapay');
	require('core/include/common.php');
?>
<html>
<head>
<title><?=$sitename?></title>
<LINK CONTENT="zetapay style sheet" href="zetapay/style.css" type=text/css rel=stylesheet>
</head>
<body style="background: #FFFFFF;" topmargin="0" leftmargin="0" marginwidth="0" marginheight="0">
<table class="design" border="0" width="100%" cellpadding="0" cellspacing="0">
<tr>
	<TD>
<?
	if ($_REQUEST['read']){
		if (!@include('help/'.$_REQUEST['read'])){
			echo "Cannot find file: <i>help/",$_REQUEST['read'],"</i><br>";
		}
	}
?>
	</TD>
</tr>
</table>
</body>
</html>