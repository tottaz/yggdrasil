<table width="100%" border="0" align="center" bgcolor="#FFFFFF">
<tr>
	<td bgcolor="#FFFFFF">
		<table width="100%" border="0" align="center" cellpadding="3" cellspacing="3" bgcolor="#FFFFFF">
        <tr>
			<td width=20> </td>
			<td width="519" valign="top">

<?
if($_GET['process'] == 'delete') {
    $zetadb->Execute("DELETE FROM ".TBL_MERCHANT_LINK." WHERE url_id='$_GET[url_id]'");
}

if($_POST['process'] == 'update') {

						$sql  = "UPDATE ".TBL_MERCHANT_LINK." SET ";
						$sql .= "	url_link='".$_POST['url_link']."',";
						$sql .= "	merchant_domain='".$_POST['merchant_domain']."',";
						$sql .= "	active='".$_POST['active']."',";
						$sql .= "	search_pattern='".$_POST['search_pattern']."',";
						$sql .= "	price='".$_POST['price']."',";
						$sql .= "	duration='".$_POST['duration']."',";
						$sql .= "	time_duration='".$_POST['time_duration']."',";
						$sql .= "	time_period='".$_POST['time_period']."',";
						$sql .= "	link_name='".$_POST['link_name']."'";
                        $sql .= "   WHERE url_id='".$_POST['url_id']."'";
						$zetadb->Execute($sql);

?>
	<table width="100%" border="0" cellspacing="0" cellpadding="3" bgcolor="#FFFFFF">
			<tr>
				<td>
					<span class="text4">The Link has been updated </span><br>
					<hr width="100%" size="1"><br>
				</td>
			</tr>
    </table>
<?
} else if($_GET['process'] == 'edit') {

        $rs = $zetadb->Execute("SELECT * FROM ".TBL_MERCHANT_LINK." WHERE url_id='$_GET[url_id]'");
        $a = $rs->FetchNextObject();
?>
			<table width="100%" border="0" cellspacing="0" cellpadding="3" bgcolor="#FFFFFF">
			<tr>
				<td>
					<span class="text4">Edit Link </span><br>
					<hr width="100%" size="1"><br>
				</td>
			</tr>

			<table width="100%" border="0" cellspacing="0" cellpadding="3" bgcolor="#FFFFFF">
			<tr>
				<td>
						<FORM method=post>
						<BR>
						<CENTER>
						<TABLE class=design cellspacing=0 width=100% align=left>
						<tr>
							<td height="24" align="center"><font size="2" face="Arial, Helvetica, sans-serif">Active</font></td>

<?
                        if (($a->ACTIVE == Y) OR ($a->ACTIVE == "")) {
                            $act1 = "checked";
                            $act2 = "";
                        }

                        if ($a->ACTIVE == N) {
                        	$act1 = "";
                        	$act2 = "checked";
                        }
?>
						<td>
                                <input type=radio name=active value=Y <? echo $act1?>>&nbsp;Yes&nbsp&nbsp;
                                <input type=radio name=active value=N <? echo $act2?>>&nbsp;No&nbsp&nbsp;
                        </td>

						</tr>
						<tr>
							<td height="24" align="center"><font size="2" face="Arial, Helvetica, sans-serif">Domain&nbsp;Name</font></td>
							<td><input name="merchant_domain" type="text" id="merchant_domain" value="<?=$a->MERCHANT_DOMAIN?>" size="30"></td>
						</tr>
						<tr>
							<td width="20%" align="center"><font size="2" face="Verdana, Arial, Helvetica, sans-serif">Link&nbsp;Name</font></td>
							<td width="80%"><input name="link_name" type="text" id="link_name" value="<?=$a->LINK_NAME?>"></td>
						</tr>
						<tr>
							<td width="20%" align="center"><font size="2" face="Verdana, Arial, Helvetica, sans-serif">URL&nbsp;Link</font></td>
							<td width="80%"><input name="url_link" type="text" id="url_link" value="<?=$a->URL_LINK?>"></td>
						</tr>
						<tr>
							<td align="center"><font size="2" face="Arial, Helvetica, sans-serif">Search&nbsp;Patterm</font></td>
							<td><input name="search_pattern" type="text" id="search_pattern" size="30" value="<?=$a->SEARCH_PATTERN?>"></td>
						</tr>
						<tr>
							<td height="24" align="center"><font size="2" face="Arial, Helvetica, sans-serif">Price</font></td>
							<td><input name="price" type="text" id="price" size="10" value="<?=$a->PRICE?>"></td>
						</tr>
<?
                        if ($a->TIME_PERIOD == 1) {
                            $sel1 = "checked";
                            $sel2 = "";
                            $sel3 = "";
                            $sel4 = "";
                            $sel5 = "";
                            $sel6 = "";
                        }

                        if ($a->TIME_PERIOD == 2) {
                            $sel1 = "";
                            $sel2 = "checked";
                            $sel3 = "";
                            $sel4 = "";
                            $sel5 = "";
                            $sel6 = "";
                        }
                        if ($a->TIME_PERIOD == 3) {
                            $sel1 = "";
                            $sel2 = "";
                            $sel3 = "checked";
                            $sel4 = "";
                            $sel5 = "";
                            $sel6 = "";
                        }
                        if ($a->TIME_PERIOD == 4) {
                            $sel1 = "";
                            $sel2 = "";
                            $sel3 = "";
                            $sel4 = "checked";
                            $sel5 = "";
                            $sel6 = "";
                        }
                        if ($a->TIME_PERIOD == 5) {
                            $sel1 = "";
                            $sel2 = "";
                            $sel3 = "";
                            $sel4 = "";
                            $sel5 = "checked";
                            $sel6 = "";
                        }
                        if ($a->TIME_PERIOD == 6) {
                            $sel1 = "";
                            $sel2 = "";
                            $sel3 = "";
                            $sel4 = "";
                            $sel5 = "";
                            $sel6 = "checked";
                        }
?>
						<tr>
							<td height="24" align="center"><font size="2" face="Arial, Helvetica, sans-serif">Time&nbsp;Duration</font></td>
							<td><input name="time_duration" type="text" id="duration" size="10" value="<?=$a->TIME_DURATION?>">
                                 <input type=radio name=time_period value=1 <? echo $sel1?>>&nbsp;Seconds&nbsp&nbsp;
                                 <input type=radio name=time_period value=2 <? echo $sel2?>>&nbsp;Minutes&nbsp&nbsp;
                                 <input type=radio name=time_period value=3 <? echo $sel3?>>&nbsp;Hours&nbsp&nbsp;
                                 <input type=radio name=time_period value=4 <? echo $sel4?>>&nbsp;Day(s)&nbsp&nbsp;
                                 <input type=radio name=time_period value=5 <? echo $sel5?>>&nbsp;Week(s)&nbsp&nbsp;
                                 <input type=radio name=time_period value=6 <? echo $sel6?>>&nbsp;Month(s)&nbsp&nbsp;
                            </td>
						</tr>
						<tr>
							<td height="24" align="center"><font size="2" face="Arial, Helvetica, sans-serif">Duration</font></td>
							<td><input name="duration" type="text" id="duration" size="10" value="<?=$a->DURATION?>"></td>
						</tr>

						<tr>
                            <td>
                                <input type="hidden" name="merchant_id" value="<?=$data->ID?>">
							    <input type="hidden" name="url_id" value="<?=$a->URL_ID?>">
							    <input type="hidden" name="process" value="update">
							    <th colspan=2><input name="create" type="submit" id="create" value="Update Link">
                            </td>
						</tr>
						</table>
						</form>
				</td>
			</tr>
            </table>
<?
} else {
?>

			<table width="100%" border="0" cellspacing="0" cellpadding="3" bgcolor="#FFFFFF">
			<tr>
				<td>
					<span class="text4">Current Links</span><br>
					<hr width="100%" size="1"><br>
				</td>
			</tr>
<?
            $rs = $zetadb->Execute("SELECT * FROM ".TBL_MERCHANT_LINK." WHERE merchant_id='$data->ID'");
			while ($a = $rs->FetchNextObject()) {
?>
			    <tr>
                  <td>
                    <? echo $a->LINK_NAME ?> - <a href="index.php?a=merchant_add_links&process=edit&url_id=<?=$a->URL_ID?>"> Edit<a> | <a href="index.php?a=merchant_add_links&process=delete&url_id=<?=$a->URL_ID?>">Delete<a>
                  </td>
			   </tr>
<?
            }
?>
          </table>
          </td>
          </td>
          </tr>
          <tr>
			<td width=20> </td>
			<td width="519" valign="top">
			<table width="100%" border="0" cellspacing="0" cellpadding="3" bgcolor="#FFFFFF">
			<tr>
				<td>
					<span class="text4">Create Merchant Links</span><br>
					<hr width="100%" size="1"><br>
				</td>
			</tr>
			<tr>
				<td> </td>
			</tr>
			<tr>
				<td bgcolor="#FFFFFF">
<?
	if( ($_POST['receiver']) && ($_POST['price']) ){
?>
						<table width="100%" border="0" cellspacing="10" cellpadding="0">
						<tr>
							<td><div align="center"><font size="1" face="Verdana, Arial, Helvetica, sans-serif"><strong>
								Copy This Link and Replace your payment links with it
							</strong></font></div></td>
						</tr>
						<tr>
<?
						$merch = dpObj2($_POST['receiver']);
						$sql  = "INSERT INTO ".TBL_MERCHANT_LINK." SET ";
						$sql .= "	merchant_id=$merch->MERCHANT_ID,";
						$sql .= "	url_link='".$_POST['url_link']."',";
						$sql .= "	merchant_domain='".$_POST['merchant_domain']."',";
						$sql .= "	active='".$_POST['active']."',";
						$sql .= "	search_pattern='".$_POST['search_pattern']."',";
						$sql .= "	price='".$_POST['price']."',";
						$sql .= "	duration='".$_POST['duration']."',";
						$sql .= "	time_duration='".$_POST['time_duration']."',";
						$sql .= "	time_period='".$_POST['time_period']."',";
						$sql .= "	link_name='".$_POST['link_name']."',";
						$sql .= "	clicks='1',";
						$sql .= "	created=NOW()";
						$zetadb->Execute($sql);

                        $link_id = $zetadb->Insert_ID();

                        $premium_link = 'http://www.banqpay.com/sublink.php?$';
                        $premium_link .= $merch->MERCHANT_ID;
                        $premium_link .= '$';
                        $premium_link .= $link_id;
                        $premium_link .= '$';
		                $zetadb->Execute("UPDATE ".TBL_MERCHANT_LINK." SET premium_link=$premium_link WHERE url_id=$link_id");

?>
							<td width="60%"><div align="center">
								<textarea name="textfield3" cols="110" rows="15">
<? echo $premium_link ?>
								</textarea>
							</div></td>
						</tr>
						<tr>
							<td>
                            </td>
						</tr>
						</table>
<?
	}else{
?>
						<FORM method=post>
						<BR>
						<CENTER>
						<TABLE class=design cellspacing=0 width=100% align=left>
						<tr>
							<td height="24" align="center"><font size="2" face="Arial, Helvetica, sans-serif">Active</font></td>
							<td>
                                <input type=radio name=active value=Y>&nbsp;Yes&nbsp&nbsp;
                                <input type=radio name=active value=N>&nbsp;No&nbsp&nbsp;
                            </td>

						</tr>
						<tr>
							<td height="24" align="center"><font size="2" face="Arial, Helvetica, sans-serif">Domain&nbsp;Name</font></td>
							<td><input name="merchant_domain" type="text" id="merchant_domain" size="30"></td>
						</tr>
						<tr>
							<td width="20%" align="center"><font size="2" face="Verdana, Arial, Helvetica, sans-serif">Link&nbsp;Name</font></td>
							<td width="80%"><input name="link_name" type="text" id="link_name" value=""></td>
						</tr>
						<tr>
							<td width="20%" align="center"><font size="2" face="Verdana, Arial, Helvetica, sans-serif">URL&nbsp;Link</font></td>
							<td width="80%"><input name="url_link" type="text" id="url_link" value=""></td>
						</tr>
						<tr>
							<td align="center"><font size="2" face="Arial, Helvetica, sans-serif">Search&nbsp;Patterm</font></td>
							<td><input name="search_pattern" type="text" id="search_pattern" size="30"></td>
						</tr>
						<tr>
							<td height="24" align="center"><font size="2" face="Arial, Helvetica, sans-serif">Price</font></td>
							<td><input name="price" type="text" id="price" size="10"></td>
						</tr>
						<tr>
							<td height="24" align="center"><font size="2" face="Arial, Helvetica, sans-serif">Time&nbsp;Duration</font></td>
							<td><input name="time_duration" type="text" id="duration" size="10">
                                 <input type=radio name=time_period value=1>&nbsp;Seconds&nbsp&nbsp;
                                 <input type=radio name=time_period value=2>&nbsp;Minutes&nbsp&nbsp;
                                 <input type=radio name=time_period value=3>&nbsp;Hours&nbsp&nbsp;
                                 <input type=radio name=time_period value=4>&nbsp;Day(s)&nbsp&nbsp;
                                 <input type=radio name=time_period value=5>&nbsp;Week(s)&nbsp&nbsp;
                                 <input type=radio name=time_period value=6>&nbsp;Month(s)&nbsp&nbsp;
                             </td>
						</tr>
						<tr>
							<td height="24" align="center"><font size="2" face="Arial, Helvetica, sans-serif">Duration</font></td>
							<td><input name="duration" type="text" id="duration" size="10" value="0"></td>
						</tr>

						<tr>
                            <td>
                                <input type="hidden" name="merchant_id" value="<?=$data->ID?>">
							    <input type="hidden" name="receiver" value="<?=$data->EMAIL?>">
							    <input type="hidden" name="process" value="create">
                                <th colspan=2><input name="create" type="submit" id="create" value="Create Link">
                            </td>
						</tr>
						</table>
						</form>
<?
    }
}
?>
					</td>
				</tr>
				</table>
			</td>
		</tr>
		</table>
	</td>
</tr>
</table>