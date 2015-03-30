<?
$receiver = $_POST['receiver'];
$amount = $_POST['amount'];
$itemid = $_POST['item_name'];
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
				<span class="text4">Donation Details</span>
				<span class=small><b>(Step 2 of 2)</b></span>
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
						if($enforce_do){
							if ($amount >= $minimal_transfer){
								// asdfasdfsdaafd
							}else{
								errform('Sorry, but the minimum amount you can transfer is '.$currency.$minimal_transfer,'amount');
							}
						}
						// Check merchant
                        $rs = $zetadb->Execute("SELECT merchant_id FROM zetapay_merchant_users WHERE (email='".addslashes($_POST['receiver'])."')");
		                $r = $rs->FetchNextObject();
						if (!$r){
							errform("There are no users with the specified username", 'username');
							$posterr = 1;
						}
						if( $r->ID == $user ){
							errform("You cannot send money to yourself", 'username');
						}
						$afrom = dpbuyerObj($user);
						$from = $afrom->EMAIL;
						$username = $afrom->NAME;
						if($username == $_POST['receiver'] || $from == $_POST['receiver']){
							errform("You cannot send money to yourself", 'username');
						}
					}

					if ($_POST['transfer'] && !$posterr){
						$comments = "Donation For {$_POST['item_name']}";//<br>".$_POST['memo'];
						$_POST['from'] = $from;
						$_POST['from_email'] = $afrom->EMAIL;
						$_POST['from_name'] = $afrom->NAME;
						$_POST['from_address'] = $afrom->ADDRESS;
						$_POST['from_city'] = $afrom->CITY;
						$_POST['from_zipcode'] = $afrom->ZIPCODE;
						$_POST['from_country'] = $afrom->COUNTRY;
						$_POST['from_state'] = $afrom->STATE;
						$_POST['from_phone'] = $afrom->PHONE;

						if($transfer_percent || $transfer_fee){
							$fee = myround($amount * $transfer_percent / 100, 2) + $transfer_fee;
							$amount = $amount - $fee;
						}
						buyer_transact($user,$r->MERCHANT_ID,$amount,$comments,'',$fee,0,$_POST['memo']);
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
						$merch = dpmerchantObj2($_POST['receiver']);
?>
						<CENTER>
						<br><br>
						<TABLE class=design width=100% cellpadding=0 cellspacing=0 border=0>
						<form action="<?=$gotourl?>">
						<TR>
							<th>Donation Sucessful!!!</th>
						</tr>
						<tr>
							<td>
								<p>
									The	Donation was successful.<br>
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
						<input type="hidden" name="return_url" value="<?=$_POST['return_url'];?>">
						<input type="hidden" name="notify_url" value="<?=$_POST['notify_url'];?>">
						<input type="hidden" name="cancel_url" value="<?=$_POST['cancel_url'];?>">
						<TABLE class=design cellspacing=0 width=40%>
						<TR>
							<TH colspan=2>Donate</TH>
						<TR>
							<TD>Pay To:</TD>
							<TD>
								<?=$_POST['receiver']?>
								<INPUT type=hidden name=receiver value="<?=$_POST['receiver']?>">
							</TD>
						</TR>
						<TR>
							<TD>Donation Towards:</TD>
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
<?	if($_POST['memo']){	?>
						<TR><TD>Notes: (optional)</TD>
							<TD><?=$_POST['memo']?></TD></TR>
							<INPUT type=hidden name=memo value="<?=$_POST['memo']?>">
<?	}	?>
						<TR><TH class=submit colspan=2><input type=submit name=transfer value='Donate >>'></TH></TR>
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