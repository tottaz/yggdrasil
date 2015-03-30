<?
	if($_GET['del']){
		mysql_query("DELETE FROM ".TBL_MERCHANT_SHOPS." WHERE id={$_GET['del']}");
	}
?>
<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
<tr bgcolor="#FFFFFF">
    <td width="20"></td>
    <td width="510" valign="top">
		<table height="100%" width="100%" border="0" cellspacing="0" cellpadding="0" class="empty">
		<tr bgcolor="#FFFFFF">
			<td height="25" colspan="2">
				<span class="text4">ZetaPay Marketplace<br>Browse. Find. Enjoy.</span>
				<hr width="100%" size="1"><br>
			</td>
		</tr>
		<tr>
			<td width=20> </td>
			<td width="519" valign="top">
				<table width="100%" border="0" cellspacing="0" cellpadding="3">
<?
	if($_GET['area']){
		$area = $_GET['area'];
		$where = "WHERE area='$area'";
	}else{
		$limit = "LIMIT 0,15";
	}
	$sql = "SELECT * FROM ".TBL_MERCHANT_SHOPS." $where ORDER BY id $limit";
	$qr1 = $zetadb->Execute($sql);
	if($qr1 && (mysql_num_rows($qr1) > 0) ){
		while( $row = mysql_fetch_object($qr1) ){
			$pid = $row->id;
?>
				<tr>
					<td valign=top>
						<table width="80%" cellpadding="0" cellspacing="0" class="design">
						<tr>
							<th colspan=3><a href="<?=$row->url?>" target="_new" style="color:#FFFFFF;"><?=$row->name?></a></th>
						</tr>
						<tr>
							<td colspan=3 height="8"></td>
						</tr>
						<tr>
							<td style="padding:5px">
<?
		$handle=opendir($att_path); 
		while (false!==($file = readdir($handle))) { 
			if ($file != "." && $file != "..") { 
				if( strstr($file , "x".$pid."_") ){
					$furl = $siteurl."//zetapay/".(str_replace("./","",$att_path))."/".$file;
					echo "<a href=\"{$row->url}\" target=\"_new\"><img src='$furl' border=0></a>";
				}
			} 
		}
		closedir($handle); 
?>
							</td>
							<td width=5>&nbsp;</td>
							<td>
								<?=$row->comment?>
							</td>
						</tr>
						</table>
<?
				if( ($user == $row->owner) || ($user == 3) ){
					echo "<a href=?a=submit_site&edit=$pid>edit shop</a> | ";
					echo "<a onClick=\"return confirm('are you sure you want to delete this item?');\" href=?a=browse&del=$pid>delete shop</a>";					
				}
?>
					</td>
				</tr>
<?
		}
	}else{
?>
				<tr>
					<td>
						There are no shops in this area
					</td>
				</td>
<?
	}
?>
				</table>
			</td>
		</tr>
		</table>
	</td>
</tr>
</table>