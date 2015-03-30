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
						<span class="text4">Send Username and Password</span><br>
						<hr width="100%" size="1"><br>
					</td>
				</tr>
				<tr>
					<td bgcolor="#FFFFFF">
<?
	if ($_POST['buyer_remind']){
		$posterr = 0;
		// Check email
        $rs = $zetadb->Execute("SELECT * FROM zetapay_buyer_users WHERE email='".addslashes($_POST['email'])."'");
		$data = $rs->FetchNextObject();
		if (!$data)
			errform('There are no accounts registered with the email address you specified.');
	}
	if ($_POST['buyer_remind'] && !$posterr){
		wrapmail($_POST['email'], "$sitename Username and Password", $emailtop.gettemplate('email_remindpsw', '', $data->NAME, $data->PASSWORD).$emailbottom, $defaultmail);
		prpage('html_remindpsw');
	}else{
?>
						<BR>
						<CENTER>
						<TABLE class=design cellspacing=0>
						<FORM method=post>
						<TR>
							<TH colspan=2> Send Username and Password</TH>
						</TR>
						<TR>
							<TD>Enter your email:</TD>
							<TD><INPUT type=text name=email size=30 maxLength=30 value="<?=htmlspecialchars($_POST['email'])?>"></TD>
						</TR>
						<TR>
							<TH colspan=2 class=submit><INPUT type=submit class=button name=buyer_remind value='Submit >>'></TH>
							<?=$id_post?>
						</TR>
						</FORM>
						</TABLE>
						</CENTER>
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