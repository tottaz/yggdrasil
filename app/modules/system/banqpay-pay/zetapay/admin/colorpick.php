<?php
	$PHP_SELF=$_SERVER['PHP_SELF'];
?>
<HTML>
<HEAD>
	<TITLE>Color Picker Tool</TITLE>
	<STYLE>
		BODY{font-family:Verdana}
		TD{font-family:Verdana}
		A{text-decoration:none}
		INPUT{border:1px solid;border-color:silver;font-size:11px;font-family:Verdana}
		TEXTAREA{border:1px solid;border-color:silver;font-size:11px;font-family:Verdana}
		SELECT{border:1px solid;border-color:silver;font-size:11px;font-family:Verdana}
		</STYLE>
		<style>
		<!--
		BODY{
		scrollbar-face-color:#003366;
		scrollbar-arrow-color:#FFFFFF;
		scrollbar-track-color:#e4e4e4;
		scrollbar-shadow-color:'#ffffff';
		scrollbar-highlight-color:'#f5f5f5';
		scrollbar-3dlight-color:'#f5f5f5';
		scrollbar-darkshadow-Color:'#ffffff';
		}
		-->
		</style>
	<SCRIPT LANGUAGE=JavaScript>
		function pickColor(hexcode){
			var x=window.opener;
			window.opener.form2.<?php echo $f; ?>.value=('#'+hexcode);
		}
	</SCRIPT>
	</HEAD>
<BODY BGCOLOR=#FFFFFF LINK=white VLINK=white LEFTMARGIN=0 TOPMARGIN=0 MARGINWIDTH=0 MARGINHEIGHT=0>
<P>
<CENTER>
<TABLE BORDER=2 BORDERCOLOR=#f5f5f5 CELLPADDING=0 CELLSPACING=0 WIDTH=120>
<TR>
	<TD COLSPAN=6 BGCOLOR=#f5f5f5>
		<CENTER>
		<FORM METHOD=POST ACTION="colorpick.php?f=<?php echo $f; ?>">
		<FONT SIZE=-2><B>Sort Colors by : </B>
		<SELECT NAME="sort">
			<OPTION VALUE=r>red</OPTION>
			<OPTION VALUE=g>green</OPTION>
			<OPTION VALUE=b>blue</OPTION>
		</SELECT>&nbsp;<INPUT TYPE=submit VALUE="view">
		</FONT>
		</FORM>
		</CENTER>
	</TD>
</TR>
<?php
	$hexarray[0]= "FF"; 
	$hexarray[1]= "CC"; 
	$hexarray[2]= "99"; 
	$hexarray[3]= "66"; 
	$hexarray[4]= "33"; 
	$hexarray[5]= "00"; 

	if(!isset($sort)){ 
		$sort= "b"; 
	} 
	for ($i=0; $i<6; $i++) { 
		for ($j=0; $j<6; $j++) { 
			echo "<TR>";
			for ($k=0; $k<6; $k++) { 
				if ($sort== "r"){
					echo "<td width=20 height=20 align=center bgcolor=\"#" . $hexarray[$i].$hexarray[$j].$hexarray[$k] . "\"><A STYLE=\"color:#" . $hexarray[$i].$hexarray[$j].$hexarray[$k] . "\" HREF=\"javascript:pickColor('" . $hexarray[$i].$hexarray[$j].$hexarray[$k] . "')\"><B>X</B></A></td>\n";
				}else if ($sort== "g"){
					echo "<td width=20 height=20  align=center  bgcolor=\"#" . $hexarray[$k].$hexarray[$i].$hexarray[$j]. "\"><A STYLE=\"color:#" . $hexarray[$k].$hexarray[$i].$hexarray[$j]. "\"  HREF=\"javascript:pickColor('" . $hexarray[$k].$hexarray[$i].$hexarray[$j] . "')\"><B>X</B></A></td>\n";
				}else{
					echo "<td width=20 height=20  align=center  bgcolor=\"#" . $hexarray[$j].$hexarray[$k].$hexarray[$i]. "\"><A STYLE=\"color:#" . $hexarray[$j].$hexarray[$k].$hexarray[$i]. "\"  HREF=\"javascript:pickColor('" . $hexarray[$j].$hexarray[$k].$hexarray[$i] . "')\"><B>X</B></A></td>\n";
				}
			} 
			echo "</TR>";
		} 
	} 
?>
</TABLE>
</CENTER>
</BODY>
</HTML>