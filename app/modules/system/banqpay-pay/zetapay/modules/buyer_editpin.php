<?
	if ($_POST['edit']){
		$posterr = 0;
		if($data->PIN){
			$old = $_POST['old_pin'];
			if($old != $data->pin){
				errform('You have entered an invalid pincode.'); // #err
			}
		}
		$newpin = $_POST['new_pin'];
		$newpin2 = $_POST['new2_pin'];
		if( $newpin != $newpin2 ){
			errform('the new pin must match what you re-type'); // #err
		}
	}
	if ($_POST['edit'] && !$posterr){
		$newpin = $_POST['new_pin'];
		$newpin2 = $_POST['new2_pin'];
		$query = "UPDATE zetapay_buyer_users SET pin='".$newpin."' WHERE buyer_id=$user";
		$zetadb->Execute($query);
		// Go to account
		$action = 'account';
	    $rs = $zetadb->Execute("SELECT * FROM zetapay_buyer_users WHERE buyer_id=$user");
        $data = $rs->FetchNextObject();
		include('buyer/a_buyer_account.php');
	}else{
?>
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
					<span class="text4">Edit Your Pincode</span><br>
					<hr width="100%" size="1"><br>
				</td>
			</tr>
			<tr>
				<td bgcolor="#FFFFFF">
<CENTER>
<TABLE class=design cellspacing=0 width=100% align=left>
	<FORM method=post enctype='multipart/form-data' name="form1">
<TR><TD>Current Pincode:</TD>
	<TD><INPUT type=password name=old_pin size=16 maxLength=6></TD></TR>
<TR><TD>New Pincode:</TD>
	<TD><INPUT type=password name=new_pin size=16 maxLength=16 value=""></TD></TR>
<TR><TD>Retype New Pincode:</TD>
	<TD><INPUT type=password name=new2_pin size=16 maxLength=16 value=""></TD></TR>
<TR><TH colspan=2 class=submit><INPUT type=submit class=button name=edit value='Change info >>'></TH></TR>
  <?=$id_post?>
</FORM>
</TABLE>
</CENTER>
			</td>
		</tr>
		</table>
	</td>
</tr>
</table>
</table>
<?
	}
?>