<?
	if(!$_POST['what'])$_POST['what'] = $_GET['what'];
?>
<TABLE width=100% cellspacing=0>
<FORM name=form1 method=post>
<?=$id_post?>
<input type=hidden name=what value="<?=(int)$_POST['what']?>">
<TR><TD style="padding: 10px;">
	<? include("admin/config_".(int)$_POST['what'].".php"); ?>
</TD></TR>
</FORM>
</TABLE>