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
					<span class="text4">Donation Buttons</span><br>
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
								Copy This Code and Paste into your page
							</strong></font></div></td>
						</tr>
						<tr>
							<td width="60%"><div align="center">
								<textarea name="textfield3" cols="110" rows="15">
<FORM action="<?=$siteurl?>/handle.php" method="post">
	<input type=hidden name="donation" value="1">
	<input type=hidden name="receiver" value="<?=$_POST['receiver']?>">
	<input type=hidden name="amount" value="<?=$_POST['price']?>">
	<input type=hidden name="item_name" value="<?=$_POST['name']?>">
	<input type=hidden name="return_url" value="<?=$_POST['ReturnUrl']?>">
	<input type=hidden name="notify_url" value="<?=$_POST['NotifyUrl']?>">
	<input type=hidden name="cancel_url" value="<?=$_POST['CancelUrl']?>">
<?	if($_POST['mybutton']){	?>
	<input type=image name="cartImage" src="<?=$siteurl?>/zetapay/img/donate_buttons/<?=$_POST['mybutton']?>">
<?	}else{	?>
	<input type=submit name="cartImage" value="Donate now">
<?	}	?>
</form>
								</textarea>
							</div></td>
						</tr>
						<tr>
							<td> </td>
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
							<td width="20%" align="center"><font size="2" face="Verdana, Arial, Helvetica, sans-serif">Pay To:</font></td>
							<td width="80%"><input name="receiver" type="name" id="receiver" value="<?=$merchant_data->EMAIL?>"></td>
						</tr>
						<tr>
							<td width="30%" align="center"><font size="2" face="Verdana, Arial, Helvetica, sans-serif">Donation Towards</font></td>
							<td width="80%"><input name="name" type="text" id="name" value=""></td>
						</tr>
						<tr>
							<td align="center"><font size="2" face="Verdana, Arial, Helvetica, sans-serif">Donation Price</font></td>
							<td><input name="price" type="text" size="10" maxlength="10"><span class="tiny">Do not put any $ Dollar Signs, enter only a number like 5.00</td>
						</tr>
						<tr>
							<td height="24" align="center"><font size="2" face="Arial, Helvetica, sans-serif">Return Url</font></td>
							<td><input name="ReturnUrl" type="text" id="ReturnUrl" size="50"></td>
						</tr>
						<tr>
							<td height="24" align="center"><font size="2" face="Arial, Helvetica, sans-serif">Notify Url</font></td>
							<td><input name="NotifyUrl" type="text" id="NotifyUrl" size="50"></td>
						</tr>
						<tr>
							<td align="center"><font size="2" face="Arial, Helvetica, sans-serif">Cancel Url</font></td>
							<td><input name="CancelUrl" type="text" id="CancelUrl" size="50"></td>
						</tr>
<?
	//$mybutton
	if( file_exists("images/donate_buttons")){
		$handle=opendir("images/donate_buttons");
		while (false!==($file = readdir($handle))) {
			if ($file != "." && $file != "..") {
				$x = strtolower(substr($file, -4));
				if($x && $x == ".jpg" || $x == ".gif" || $x == ".png"){
?>
					<tr>
						<td align="center"><input name="mybutton" type="radio" value="<?=$file?>"></td>
						<td>
							<img src="zetapay/img/donate_buttons/<?=$file?>">
						</td>
					</tr>
<?
				}
			}
		}
	}
?>						<tr>
							<td align="center"> </td>
							<td> </td>
						</tr>
						<tr>
							<th colspan=2><input name="create" type="submit" id="create" value="Create Button"></td>
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