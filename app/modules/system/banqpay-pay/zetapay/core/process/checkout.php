<?
if($_POST['merchantAccount']){
	$receiver = $_POST['merchantAccount'];
}else{
	$receiver = $_POST['receiver'];
}
$amount = $_POST['amount'];
if($_POST['item_id']){
	$itemid = $_POST['item_id'];
}else{
	$itemid = $_POST['item_name'];
}
$returnurl = $_POST['return_url'];
$notifyurl = $_POST['notify_url'];
$cancelurl = $_POST['cancel_url'];
?>
<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
<tr bgcolor="#FFFFFF">
    <td width="20"></td>
    <td width="510" valign="top">
		<table height="100%" width="100%" border="0" cellspacing="0" cellpadding="0" class="empty">
		<tr bgcolor="#FFFFFF">
			<td height="25" colspan="2">
				<span class="text4">Payment Details</span>
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
					<td width="100%" class="pptext" align="left">
<?
					$balance = buyer_balance($user);
					if ($_POST['transfer']){
/*
						$posterr = 0;
						$amount = $_POST['amount'];
						$amount = myround($amount);

						#echo "-->".$balance."<bR>";

						// Check funds
						if ($balance < $amount){
							errform('You do not have enough money in your account<br>Required Funds: '.$amount, 'amount');
							$posterr = 1;
						}
						if ($amount < 0){
							errform('Please enter a valid amount', 'amount');
							$posterr = 1;
						}

						// Check username
						$r = mysql_fetch_object(mysql_query(
							"SELECT id FROM zetapay_users WHERE (username='".addslashes($_POST['receiver'])."' OR email='".addslashes($_POST['receiver'])."')"
						));
						if (!$r){
							errform("There are no users with the specified username", 'username');
							$posterr = 1;
						}
						if( $r->id == $user ){
							errform("You cannot send money to yourself", 'username');
						}
						$afrom = dpuserObj($user);
						$from = $afrom->email;
						$username = $afrom->username;
						if($username == $_POST['receiver'] || $from == $_POST['receiver']){
							errform("You cannot send money to yourself", 'username');
						}
*/
					}

					if ($_POST['transfer'] && !$posterr){
/*
						$comments = "Payment For {$_POST['item_name']}";//<br>".$_POST['memo'];
						if($transfer_percent || $transfer_fee){
							$fee = myround($amount * $transfer_percent / 100, 2) + $transfer_fee;
							$amount = $amount - $fee;
						}
						transact($user,$r->id,$amount,$comments,'',$fee);
						$action = 'account';
						$req = "";
						$qarray = array();
						while ( list($key,$value) = each($_POST) ){
							$arr[$key] = urlencode($value);
							array_push( $qarray, $key."=" . urlencode($value) );		
							if($req){
								$req .= "&";
							}else{
								$req = "?";
							}
							$req .= $key."=".urlencode($value);
						}
						$query = implode('&', $qarray);
						if( $_POST['notify_url'] ){
							$notifyurl = $_POST['notify_url'];
							$gotourl = $_POST['return_url'];
							$result = mycurl($notifyurl,$query);
						}
						if( $_POST['return_url'] ){
							$gotourl = $_POST['return_url'];
					//		$gotourl .= $req;
						}
						$merch = dpuserObj2($_POST['receiver']);
?>
						<CENTER>
						<br><br>
						<TABLE class=design width=100% cellpadding=0 cellspacing=0 border=0>
						<form action="<?=$gotourl?>">
						<TR>
							<th>Payment Sucessful!!!</th>
						</tr>
						<tr>
							<td>
								<p>
									The	payment was successful.<br>
									Thank you for using <?=$sitename?><br>
									Please press "Continue" to return to the Merchant's web site and exit <?=$sitename?><br>
								</p>
							</td>
						</tr>
						<tr>
							<th><input type="submit" value="Continue"></th>
						</tr>
<?
						while ($a = each($_POST)){
							if (substr($a[0], 0, 1) == '_'){
								echo "<input type=hidden name=\"",htmlspecialchars($a[0]),"\" value=\"",htmlspecialchars($a[1]),"\">";
							}
						}
?>
						</form>
						</TABLE>
<?
*/
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
						<input type="hidden" name="a2" value="checkout_2">
						<input type="hidden" name="return_url" value="<?=$_POST['return_url'];?>">
						<input type="hidden" name="notify_url" value="<?=$_POST['notify_url'];?>">
						<input type="hidden" name="cancel_url" value="<?=$_POST['cancel_url'];?>">
						<TABLE class=design cellspacing=0>
						<TR>
							<TH colspan=2>Check Out</TH>
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
						<TR>
							<TD>Amount:</TD>
							<TD>
								<?=$currency?> <?=$_POST['amount']?>
								<INPUT type=hidden name=amount value="<?=$_POST['amount']?>">
								<INPUT type=hidden name=total value="<?=$_POST['amount']?>">
							</TD>
						</TR>
						<TR><TD>Notes: (optional)</TD>
							<TD><textarea name="memo" cols="30" rows="6"><?=$_POST['SUGGESTED_MEMO']?></textarea></TD></TR>
						<TR><TH class=submit colspan=2><input type=submit name=confirm value='Confirm >>'></TH></TR>
						<?=$id_post?>
<?
						$required = array('notify_url','return_url', 'cancel_url', 'receiver', 'item_name', 'amount','memo','cartImage');	
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