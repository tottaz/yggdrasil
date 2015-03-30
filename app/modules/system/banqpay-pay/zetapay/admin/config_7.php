<?
	include_once("admin/parseCSS.inc");
	$oCSS=new CSS();
	$oCSS->parseFile("style.css");
?>
<script>
	function colorPick (f){
		var win=window.open('colorpick.php?f='+f,'','width=175,height=300,scrollbars=yes');
		win.moveTo((screen.width/2)-100,(screen.height/2)-100);
		win.focus ();
	}
</script>
<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
Site Design
</b></div>
<!------///////////////--->
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding-left:10px;">&nbsp;</td>
	<TD>
		<TABLE width=100% cellspacing=0 class=design>
		<TR><TD>Select a StyleSheet Class to Edit
			<TD><form method="POST" name="form1">
				<select name="name" onChange="form1.submit()">
				<option>----
<?
	foreach($oCSS->css as $key0 => $value0) {
		if($key0 == $_POST['name']){
			$sel = "SELECTED";
		}else{
			$sel = "";
		}
		echo "<option $sel>$key0\n";
	}
?>
				</select>
				</form>
			</TD></TR>
			</TABLE>
			<br>
<?
	if($_POST['submit2']){
		$stylesheet = "";
		foreach($oCSS->css as $key0 => $value0) {
			$stylesheet.= $key0."{\n";
			foreach($oCSS->css[$key0] as $key1 => $value1) {
//echo "----> ".$_POST["frm_".$key0."_".$key1]."<br>";
				$afield = $key0;
				$afield = str_replace(".","",$afield);
				$field = $key1;
				$field = str_replace("-","",$field);
				if( $_POST["frm_".$afield."_".$field] ){
					$value1 = $_POST["frm_".$afield."_".$field];
				}
				$stylesheet .= "\t$key1: $value1;\n";
			}
			$stylesheet .= "}\n\n";
		}
//		echo nl2br($stylesheet);
		$f = fopen("style.css", 'w');
		if ($f){
			fwrite($f, $stylesheet);
			fclose($f);
			echo "Stylesheet updated successfully";
		}else{
			echo "<B><font color=#00FF00>Please Note:</B>Check to make sure permissions (CHMOD) in this file <b>\"style.css\"</b> are set to 777.";
		}
	}else{
?>
		<form method="POST" name="form2">
<TABLE width=100% cellspacing=0 class=design>
<tr><th>Field
	<th>Value</tr>
<?
		if($_POST['name']){
			foreach($oCSS->css[$_POST['name']] as $key1 => $value1) {
				$field = $key1;
				$_POST['name'] = str_replace(".","",$_POST['name']);
				$field = str_replace("-","",$field);
				if( (strstr($field, "color")) && (!strstr($field, "-")) && (!strstr($value1, " ")) ){
?>
<tr><TD width=60%><b><?=$key1?></b>
	<td>
		<input type=text size=40 name="frm_<?=$_POST['name']?>_<?=$field?>" value="<?=$value1?>">
		<INPUT TYPE="button" VALUE="color"  onClick="javascript:colorPick('frm_<?=$_POST['name']?>_<?=$field?>')">
	</td>
</tr>
<?
				}else{
?>
<tr><TD width=60%><b><?=$key1?></b>
	<td><input type=text size=40 name="frm_<?=$_POST['name']?>_<?=$field?>" value="<?=$value1?>"></tr>
<?
				}
			}
		}
?>
</tr>
</table>
<br>
<TABLE width=100% cellspacing=0 class=design>
<TR><TH colspan=2><input type="submit" name="submit2" value="Update StyleSheet">
</TABLE>
</form>
<?
	}
?>
	</TD>
</TR>
</table>