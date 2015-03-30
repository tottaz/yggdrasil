<table width="100%" border="0" align="center" bgcolor="#FFFFFF">
<tr>
	<td bgcolor="#FFFFFF">
		<table width="100%" border="0" align="center" cellpadding="3" cellspacing="3" bgcolor="#FFFFFF">
		<tr>
			<td width=20> </td>
			<td width="519" valign="top">
			<table width="100%" border="0" cellspacing="0" cellpadding="3" bgcolor="#FFFFFF">
			<tr>
				<td>
					<span class="text4">Submit Your Site to <?=$sitename?> Shops</span><br>
					<hr width="100%" size="1"><br>
				</td>
			</tr>
			<tr>
				<td bgcolor="#FFFFFF">
<?
	adpareas(0);
	dpareas(0);
	if( ($_POST['name']) && ($_POST['url']) ){
		$name = addslashes($_POST['name']);
		$url = addslashes($_POST['url']);
		$area = $_POST['area'];
		$comment = addslashes($_POST['comment']);
		if($_POST['edit']){
			$query = "UPDATE ".TBL_MERCHANT_SHOPS." SET
							owner='$user',
							name='$name',
							url='$url',
							area='$area',
							comment='$comment'
							WHERE id=".$_POST['edit'];
			$pid = $_POST['edit'];
		}else{
			$query = "INSERT INTO ".TBL_MERCHANT_SHOPS." SET
							owner='$user',
							name='$name',
							url='$url',
							area='$area',
							comment='$comment',
							imgfile='".($filename ? "'$filename'" : "NULL")."'";
		}
       $zetadb->Execute($query);
		if(!$pid)$pid = $zetadb->Insert_ID();
		if ($_POST['delimg']){
			$handle=opendir($att_path);
			while (false!==($file = readdir($handle))) {
				if ($file != "." && $file != "..") {
					if( strstr($file , "x".$_POST['edit']."_") ){
						unlink($att_path."/".$file);
					}
				}
			}
			closedir($handle);
		}
		$filename = (!$_FILES['imgfile']['error'] ? substr( basename($_FILES['imgfile']['name']), -30 ) : '');
		$x = strtolower(substr($filename, -4));
		if ($x == '.php' || $x == '.cgi'|| $x == '.html'|| $x == '.htm'|| $x == '.pl'|| $x == '.txt'|| $x == '.dat'|| $x == '.doc'){
//			$filename = substr($filename, -26).'.txt';
			echo "$filename is not a valid file. Upload halted<br>";
		}else{
			if ($filename){
				$newname = $att_path."x".$pid."_".$filename;
				copy($_FILES['imgfile']['tmp_name'], $newname);
			}
		}
		echo "Your site has been successfully added<br>";
	}else{
		if($_REQUEST['edit']){
            $qr1 = $zetadb->Execute("SELECT * FROM ".TBL_MERCHANT_SHOPS." WHERE id={$_REQUEST['edit']}");
            $row = $qr1->FetchNextObject();
			$_POST['name'] = $row->NAME;
			$_POST['url'] = $row->URL;
			$_POST['area'] = $row->AREA;
			$_POST['comment'] = $row->COMMENT;
		}
?>   		
		<BR>
		<CENTER>
		<TABLE class=design cellspacing=0 width=100% align=left>
		<tr><FORM method=post enctype='multipart/form-data'>
<?		if($_REQUEST['edit']){	?>
			<input type="hidden" name="edit" value="<?=$_REQUEST['edit']?>">
<?		}	?>
		<tr>
			<th colspan=2>Submit your Site to <?=$sitename?> Shops</th>
		</tr>
		<tr>
			<td><font size="2" face="Verdana, Arial, Helvetica, sans-serif">Category</font></td>
			<td width="80%">
					<select name="area">
<?
						reset($aenum_areas);
						reset($enum_areas);
						while ($a = each($aenum_areas)){
							echo "<option value=$a[0]",($_POST['area'] == $a[0] ? ' selected' : ''),"> $a[1]";
						}
?>
				</select>
			</td>
		</tr>
		<tr>
			<td align="center"><font size="2" face="Verdana, Arial, Helvetica, sans-serif">Url</font></td>
			<td><input name="url" type="text" size="60" maxlength="130" value="<?=$_POST['url']?>"></td>
		</tr>
		<tr>
			<td height="24" align="center"><font size="2" face="Arial, Helvetica, sans-serif">Title</font></td>
			<td><input name="name" type="text" size="60" value="<?=$_POST['name']?>"></td>
		</tr>
		<tr> 
			<td align="center" valign="top"><font size="2" face="Arial, Helvetica, sans-serif">Description</td>
			<td>
				<textarea name="comment" cols="60" rows="8"><?=$_POST['comment']?></textarea>
			</td>
		</tr>
		<tr> 
			<td align="center"><font size="2" face="Arial, Helvetica, sans-serif">Image</td>
			<td>
				<input name="imgfile" type="file" size="45">
<?
				$handle=opendir($att_path); 
				while (false!==($file = readdir($handle))) { 
					if ($file != "." && $file != "..") { 
						if( strstr($file , "x".$_REQUEST['edit']."_") ){
							$furl = $siteurl."//zetapay/".(str_replace("./","",$att_path))."/".$file;
							echo "<br><input type=checkbox class=checkbox name=delimg value=1> Delete image (<a href='$furl' target=_blank>See current</a>)";
						}
					} 
				}
				closedir($handle); 
?>

			</td>
		</tr>
		<tr>
			<th colspan=2 align=right><input name="create" type="submit" id="create" value="Submit Site"></td>
		</tr>
		</table>
		</form>
<?	}	?>
			</td>
		</tr>
		</table>
	</td>
</tr>
</table>
</table>