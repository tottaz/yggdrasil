<?
	$receiver = $_POST['receiver'];
	$amount = $_POST['amount'];
	$itemid = $_POST['item_name'];
	$returnurl = $_POST['return_url'];
	$notifyurl = $_POST['notify_url'];
	$cancelurl = $_POST['cancel_url'];
	$cyclep["D"]="Day(s)";
	$cyclep["W"]="Week(s)";
	$cyclep["M"]="Month(s)";
	$cyclep["Y"]="Year(s)";
?>
<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
<tr bgcolor="#FFFFFF">
    <td width="20"></td>
    <td width="510" valign="top">
		<table height="100%" width="100%" border="0" cellspacing="0" cellpadding="0" class="empty">
		<tr bgcolor="#FFFFFF">
			<td height="25" colspan="2">
				<span class="text4">Add Subscription Details</span>
				<span class=small><b>(Step 1 of 2)</b></span>
				<hr width="100%" size="1"><br>
			</td>
		</tr>
		<tr>
			<td width=20> </td>
			<td width="519" valign="top">
				<table width="100%" border="0" cellspacing="0" cellpadding="3">
				<tr valign=top> 
					<td width=6><img src="/images/pixel.gif" width=6 height=6></td>
					<td width="100%" align="left">
<?
					$balance = buyer_balance($user);
					if ($_POST['transfer']){
					}
					if ($_POST['transfer'] && !$posterr){
					}else{
						$merch = dpmerchantObj2($_POST['receiver']);
						if(!$_POST['amount']){
							$_POST['amount'] = $_POST['total'];
						}
?>
						<CENTER>
						<table width=100% cellpadding=0 cellspacing=0 border=0>
						<tr>
							<td>
								<span>
									<b><?=$sitename?> is the authorized payment processor for <?=$merch->EMAIL?>.
									[ <?=$merch->NAME?> ]
								</span><br><br>
							</td>
						</tr>
						</table>
						<br>
						<form method=post>
						<input type="hidden" name="a2" value="addsub_2">
						<input type="hidden" name="return_url" value="<?=$_POST['return_url'];?>">
						<input type="hidden" name="notify_url" value="<?=$_POST['notify_url'];?>">
						<input type="hidden" name="cancel_url" value="<?=$_POST['cancel_url'];?>">
						<TABLE class=design cellspacing=0>
						<TR>
							<TH colspan=2>Add Subscription</TH>
						<TR>
							<TD>Pay To:</TD>
							<TD>
								<?=$_POST['receiver']?>
								<INPUT type=hidden name=receiver value="<?=$_POST['receiver']?>">
							</TD>
						</TR>
						<TR>
							<TD>Payment For:</TD>
							<TD>
								<?=$_POST['item_name']?>
								<INPUT type=hidden name=item_name value="<?=$_POST['item_name']?>">
							</TD>
						</TR>
						<input type=hidden name="stop" value="<?=$_POST['stop']?>">
						<TR>
							<TD>Amount:</TD>
							<TD>
								<?=$currency?> <?=$_POST['amount']?>
								<INPUT type=hidden name=amount value="<?=$_POST['amount']?>">
								<INPUT type=hidden name=total value="<?=$_POST['amount']?>">
							</TD>
						</TR>
						<TR>
							<TD>Setup Fee:</TD>
							<TD>
								<?=$currency?> <?=$_POST['setup']?>
								<input type=hidden name="setup" value="<?=$_POST['setup']?>">
							</TD>
						</TR>
						<TR>
							<TD>Payment Cycle:</TD>
							<TD>
								Every <?=$_POST['cycle_d']?> <?=$cyclep[$_POST['cycle_p']]?>
								<input type=hidden name="cycle_d" value="<?=$_POST['cycle_d']?>">
								<input type=hidden name="cycle_p" value="<?=$_POST['cycle_p']?>">
							</TD>
						</TR>
						<TR>
							<TD>Stop After:</TD>
							<TD>
								<?=$_POST['stop']?> <?=$cyclep[$_POST['cycle_p']]?>
								<input type=hidden name="stop" value="<?=$_POST['stop']?>">
							</TD>
						</TR>
						<TR><TD>Notes: (optional)</TD>
							<TD><textarea name="memo" cols="30" rows="6"><?=$_POST['SUGGESTED_MEMO']?></textarea></TD></TR>
						<TR><TH class=submit colspan=2><input type=submit name=confirm value='Confirm >>'></TH></TR>
						<?=$id_post?>
<?
						$required = array('notify_url','return_url', 'cancel_url', 'receiver', 'item_name', 'amount','memo','cartImage','setup','cycle_d','cycle_p','stop');
						while (list($key, $val) = @each($_POST)) {
							if( !in_array($key, $required) ){
?>
								<INPUT type=hidden name="<?=$key?>" value="<?=$val?>">
<?
							}
						}
?>
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