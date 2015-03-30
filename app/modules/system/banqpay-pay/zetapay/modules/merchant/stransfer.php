<?
	$balance = balance($user);
	
	if ($_GET['id']){
		if ($_GET['conf'] == 1){
			$r = mysql_fetch_object(mysql_query("SELECT * FROM zetapay_safetransfers WHERE id=".(int)$_GET['id']));
			if ($user == $r->paidby){
				$amount = $r->amount;
				if($escrow_percent || $escrow_fee){
					$fee = myround($amount * $escrow_percent / 100, 2) + $escrow_fee;
					$amount = $amount - $fee;
				}
				$comments = "Escrow Payment from $data->username";
				transact(2,$r->paidto,$amount,$comments,'',$fee);
				mysql_query("DELETE FROM zetapay_safetransfers WHERE id=".(int)$_GET['id']);
			}
		}else if ($_GET['canc'] == 1){
			$r = mysql_fetch_object(mysql_query("SELECT * FROM zetapay_safetransfers WHERE id=".(int)$_GET['id']));
			if ($user == $r->paidto){
				transact(2,$r->paidby,$r->amount,"Escrow Payment return from $data->username");
				mysql_query("DELETE FROM zetapay_safetransfers WHERE id=".(int)$_GET['id']);
			}
		}
		include("src/a_escrow.php");
	}else{
		if ($_POST['transfer']){
			$posterr = 0;
			$_POST['amount'] = myround($_POST['amount']);
			if($use_pin){
				if (strlen($_POST['pincode']) < 1){
					errform('Please enter your pincode.'); // #err
				}
				if($data->pin != $_POST['pincode']){
					errform('Please enter a valid pincode.'); // #err
				}
			}

			// Check funds
			if ($balance < $_POST['amount']){
				errform('Sorry, but you do not have enough money in your account to complete this transaction.', 'amount');
			}
			if ($_POST['amount'] < 0){
				errform('Please enter a valid amount', 'amount');
			}
			if ($_POST['amount'] >= $minimal_escrow){
				// asdfasdfsdaafd
			}else{
				errform('Sorry, but the minimum amount you can transfer is '.$currency.$minimal_escrow,'amount');
			}

			// Check username
			$r = mysql_fetch_row(mysql_query("SELECT id FROM zetapay_users WHERE (username='".addslashes($_POST['username'])."' OR email='".addslashes($_POST['username'])."')"));
			if (!$r){
				errform("There are no users with the specified username", 'username');
			}
			if($r["id"] == $user){
				errform("You cannot send money to yourself", 'username');
			}
			$afrom = dpuserObj($user);
			$from = $afrom->email;
			$username = $afrom->username;
			if($username == $_POST['username'] || $from == $_POST['username']){
				errform("You cannot send money to yourself", 'username');
			}

		}

		if ($_POST['transfer'] && !$posterr){
			// Update database
			transact($user,2,$_POST['amount'],"Escrow Payment to {$_POST['username']}");
			mysql_query("INSERT INTO zetapay_safetransfers(paidby,paidto,amount) VALUES($user,$r[0],{$_POST['amount']})");
			include("src/a_escrow.php");
		}else{
?>
			<table width="100%" border="0" align="center" bgcolor="#FFFFFF">
			<tr>
				<td bgcolor="#FFFFFF">
					<table width="100%" border="0" align="center" cellpadding="3" cellspacing="3" bgcolor="#FFFFFF">
					<tr>
						<td width=20> </td>
						<td valign="top">
							<table width="100%" border="0" cellspacing="0" cellpadding="3" bgcolor="#FFFFFF">
							<tr>
								<td>
									<span class="text4">Send Escrow</span><br>
									<hr width="100%" size="1"><br>
								</td>
							</tr>
							<tr>
								<td> </td>
							</tr>
							<tr>
								<td bgcolor="#FFFFFF">
									<P><FONT COLOR="#FF0000" FACE="Verdana,Tahoma,Arial,Helvetica,Sans-serif,sans-serif"><B>
									You must add funds to your account before you can transfer money to escrow. If you have already added funds to 
									your account then proceed by completing the form below. 
									</B></FONT></p>
									<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
									<tr bgcolor="#FFFFFF">
										<td width="20"></td>
										<td width="510" valign="top">
											<table height="100%" width="100%" border="0" cellspacing="0" cellpadding="0" class="empty">
											<tr bgcolor="#FFFFFF">
												<td colspan=2>
													<BR>
													<CENTER>
													<TABLE class=design cellspacing=0>
													<FORM method=post>
													<TR>
														<TH colspan=2>Escrow Payment</TH>
													</TR>
													<TR><TD>Send Money To:</TD>
														<TD><INPUT type=text name=username size=16 maxLength=16 value="<?=$_POST['username']?>">
													<TR><TD>Amount to transfer:</TD>
														<TD><?=$currency?> <input type=text name=amount size=5 maxLength=5 value="<?=$_POST['amount']?>"></TD></TR>
<?	if($use_pin){	?>
													<TR><TD>Your pincode:</TD>
														<TD><INPUT type=password name=pincode size=6 maxLength=6></TD></TR>
<?	}	?>
													<TR><TH class=submit colspan=2><input type=submit name=transfer value='Transfer >>'></TH></TR>
													<?=$id_post?>
													</FORM>
													</TABLE>
													</CENTER>
												</td>
											</tr>
											</table>
										</td>
										<td width="10"></td>
									</tr>
									</table>
									<br><br><br><br><br><br><br><br><br><br><br>
								</td>
							</tr>
							</table>
						</td>
					</tr>
					</table>
				</td>
			</tr>
			</table>
<?
		}
	}
?>