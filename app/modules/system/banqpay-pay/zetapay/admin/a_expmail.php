<?
if ($_POST['export']){
	$expList = "";
	if( ($_POST['to'] == 1) || ($_POST['to'] == 3) ){
		$where = "WHERE type!='sys'";
		$qr1 = mysql_query("SELECT email FROM zetapay_users $where");
		while ($a = mysql_fetch_object($qr1)){
			if($a->email){
				$expList[] = $a->email;//.$_POST['seperate'];
			}
		}
	}
	if( ($_POST['to'] == 2) || ($_POST['to'] == 3) ){
		$qr1 = mysql_query("SELECT email FROM zetapay_mailing");
		while ($a = mysql_fetch_object($qr1)){
			if($a->email){
				$expList[] = $a->email;//.$_POST['seperate'];
			}
		}
	}
	if($expList){
		if( !$_POST['seperate'] ){
			$_POST['seperate'] = "@DP@";
		}
		$expList = implode($_POST['seperate'],$expList);
		$expList = str_replace("\\n","\r\n",$expList);
		$expList = str_replace("@DP@","\r\n",$expList);
		$_POST['seperate'] = str_replace("@DP@","",$_POST['seperate']);
	}
}
?>
<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
	Export E-mails
</b></div>
<!------\\\\\\\\\\\\\\\--->
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding-left:10px;">&nbsp;</td>
	<TD>
		<FORM method=post>
		<TABLE class=design cellspacing=0 width=80%>
<?	if($expList){	?>
		<TR>
			<TD valign=top>Exported List:
			<TD><TEXTAREA cols=100 rows=18 name=message><?=$expList?></textarea><hr>
<?	}	?>
		<TR>
			<TD nowrap>Seperate e-mails by:
			<TD><INPUT type=text size=30 name=seperate value="<?=$_POST['seperate']?>"> (ie: '\n','|'...)
		<TR>
			<TD nowrap>Export:
			<TD>
				<select name=to>
					<option value=1>Registered <?=$sitename?> Users
					<option value=2>Mailing List
					<option value=3>Everyone
				</select>
			</TD>
		</TR>
		<TR>
			<TH colspan=2><INPUT type=submit name="export" value='Export'></TH>
		</TR>
			<?=$id_post?>
		</FORM>
		</TABLE>
	</td>
</tr>
</table>