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
						$merch = dpmerchantObj2($_POST['receiver']);
						$sql  = "INSERT INTO zetapay_merchant_link SET ";
						$sql .= "	merchant_id='$receiver',";
						$sql .= "	url_link='".$_POST['url_link']."',";
						$sql .= "	merchant_domain='".$_POST['merchant_domain']."',";
						$sql .= "	premium_link='".$_POST['premium_link']."',";
						$sql .= "	activated='".$_POST['activated']."',";
						$sql .= "	search_pattern='".$_POST['search_pattern']."',";
						$sql .= "	price='".$_POST['price']."',";
						$sql .= "	duration='".$_POST['duration']."',";
						$sql .= "	link_name='".$_POST['link_name']."',";
						$sql .= "	clicks='1',";
						$sql .= "	created='".time()."'";
						$zetadb->Execute($sql);
?>
							<td width="60%"><div align="center">
								<textarea name="textfield3" cols="110" rows="15">
<FORM action="<?=$siteurl?>/sublink.php" method="post">
	<input type=hidden name="link" value="<?=$_POST['link']?>">
</form>
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
							<td height="24" align="center"><font size="2" face="Arial, Helvetica, sans-serif">Activate</font></td>
							<td><input name="activate" type="text" id="activate" size="50"></td>
						</tr>
						<tr>
							<td width="20%" align="center"><font size="2" face="Verdana, Arial, Helvetica, sans-serif">Link Name</font></td>
							<td width="80%"><input name="link_name" type="text" id="link_name" value=""></td>
						</tr>
						<tr>
							<td height="24" align="center"><font size="2" face="Arial, Helvetica, sans-serif">Domain Name</font></td>
							<td><input name="merchant_domain" type="text" id="merchant_domain" size="50"></td>
						</tr>
						<tr>
							<td align="center"><font size="2" face="Arial, Helvetica, sans-serif">Search Patterm</font></td>
							<td><input name="search_pattern" type="text" id="search_pattern" size="50"></td>
						</tr>
						<tr>
							<td height="24" align="center"><font size="2" face="Arial, Helvetica, sans-serif">Price</font></td>
							<td><input name="price" type="text" id="price" size="50"></td>
						</tr>
						<tr>
							<td height="24" align="center"><font size="2" face="Arial, Helvetica, sans-serif">Duration</font></td>
							<td><input name="duration" type="text" id="duration" size="10"></td>
							<td>
	                        <td>
                                 <input type=radio name=period value=1 $sel1>&nbsp;Seconds&nbsp&nbsp;
                                 <input type=radio name=status value=2 $sel2>&nbsp;Minutes&nbsp&nbsp;
                                 <input type=radio name=status value=3 $sel3>&nbsp;Hours&nbsp&nbsp;
                                 <input type=radio name=status value=4 $sel4>&nbsp;Day(s)&nbsp&nbsp;
                                 <input type=radio name=status value=5 $sel5>&nbsp;Month(s)&nbsp&nbsp;
                                 <input type=radio name=status value=6 $sel6>&nbsp;Number of Times&nbsp&nbsp;
                            </td>
						</tr>
						<td align="center"></td>
						<tr>
                            <input name="merchant_id" type="submit" id="merchant_id" value="<?=$merchant_data->MERCHANT_ID?>">
							<th colspan=2><input name="create" type="submit" id="create" value="Create Link"></td>
						</tr>
						</table>
						</form>
<?
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
