<?
	($fn = $_POST['filename'] or $fn = $_GET['filename']);
	if (substr($fn, -4) != ".htm" && substr($fn, -5) != ".html" && substr($fn, -4) != ".php") exit;
	if( (strstr($fn,"header")) || (strstr($fn,"footer")) ){
		$use_wysiwyg = 0;
	}
	$use_wysiwyg = 0;
?>
<?	if($use_wysiwyg){	?>
		<script>
			<!--
				_editor_url = "<?=$siteurl?>/zetapay/editor/";
				document.write('<scr'+'ipt src="' +_editor_url+ 'editor.js" language="JavaScript1.2"></scr'+'ipt>');
				var config = new Object(); // create new config object
				config.bodyStyle = 'background-color: white; font-family: "Verdana"; font-size: x-small;';
				config.debug = 0;
				config.toolbar = [
					['fontname'],
					['fontsize'],
					['bold','italic','underline','separator'],
					['justifyleft','justifycenter','justifyright','separator'],
					['OrderedList','UnOrderedList','Outdent','Indent','separator'],
					['forecolor','backcolor','separator'],
					['HorizontalRule','Createlink','InsertImage','htmlmode','popupeditor','separator'],
				]; 
				config.stylesheet = "<?=$siteurl?>/zetapay/style.css";
			//-->
		</script>
<?	}	?>
<?
	if ($_POST['update']){
		$f = fopen($fn, 'w');
		if ($f){
			fwrite($f, $_POST['content']);
			fclose($f);
			echo "Edit page successful<br>";
		}else{
			echo "<div class=error>Check permissions for file <b>$fn</b></div>";
		}
	}
	$fc = join("", file($fn));
?>
<?	if( (strstr($fn,"src")) ){	?>
		<TABLE class=design width=100% cellspacing=0>
		<tr><TD>
			<small>
			Strings in square will be replaced with appropriate values. The following patterns are supported:
			<li>[[sitename]] - Site Name</li>
			<li>[[siteurl]] - Site's URL</li>
			<li>[[id]] - User's session id</li>
			<li>[[visitor]] - Visitors online (default page only)</li>
			<li>[[whoonline]] - Users online (default page only)</li>
			<li>[[breadcrumb]] - FAQ breadcrum (FAQ page only)</li>
			<li>[[faqs]] - FAQs (FAQ page only)</li>
			<li>[[cats]] - FAQ Category List (FAQ page only)</li>
			<br>
			</small>
		</td></tr>
		</table>
		<br>
<?	}	?>
<table class=design cellspacing=0 width=100%>
<form method=post>
<input type=hidden name=filename value="<?=$fn?>">
<?=$id_post?>
<tr><th>Edit page <?=$fn?>
<tr><td>
	<textarea name=content rows=30 style="width:100%;"><?=htmlspecialchars($fc);?></textarea>
<tr><th class=submit>
	<input type=submit class=button name=update value="Update >>">
</th>
</form>
</table>
<?	if($use_wysiwyg){	?>
		<script language="JavaScript1.2" defer>
			editor_generate('content',config);
		</script>
<?	}	?>