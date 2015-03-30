<?
	chdir('..');
	require('src/common.php');
	($suid = $_POST['suid']) or ($suid = $_GET['suid']);
	$id = "suid=$suid";
	$query = "INSERT INTO zetapay_area_list SET id='".$_POST["nextid"]."',title='".addslashes($_POST["title_new"])."',parent='".addslashes($_POST["parent_new"])."'";
	mysql_query($query) or die( mysql_error()."<BR>$query<br>");
?>
<form name="form1" action="main.php" method="POST">
	<input type="hidden" name="a" value="config">
	<input type="hidden" name="what" value="3">
	<input type="hidden" name="suid" value="<?=$suid?>">
</form>
<script>
	form1.submit();
</script>