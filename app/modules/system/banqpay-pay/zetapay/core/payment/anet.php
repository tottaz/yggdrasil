<?
	// Credit card processing
	$fee = myround($amount * $dep_anet_percent / 100, 2) + $dep_anet_fee;
	if ($amount >= $minimal_deposit){
?>
		<DIV class=large>Credit Card Payments</DIV>
		<BR>
		<BR>
<?			if( !$_POST['step'] ){	?>
			<SCRIPT LANGUAGE="JavaScript">
<?
				while (list($key) = @each($country_values)) {
					if ($key == "0"){continue;}
?>
					var <?=$key?>_array  =  new Array(
<?
					$states = $state_values[$key];
					$total = sizeof($states);
					$i = 0;
					while ( list($key, $val) = @each($states) ) {
						$i++;
						echo "\"$key:$val\"";
						if($i < $total) {
							echo ",\n";
						}
					} 
					echo ");\n";
				}
?>
			function my_submit_form() {
				obj = eval("document.form1.expbox");
				ki = 0;
				if (obj){
					var iNumItems = obj.length;
					// create product order
					for (i = 0; i < iNumItems; i++ ){
						if( obj.options[i].selected ){
							if (ki == 1){
								document.form1.myExp.value += ':' + obj.options[i].value;
							}else{
								document.form1.myExp.value = obj.options[i].value;
								ki = 1;
							}
						}
					}
				}
			}
			function populate(selected) {
				document.form1.elements['state'].selectedIndex = 0;
				var mychoice = "<?=$_POST['state']?>";
				var nochoice = 1;
				if ( eval(selected+"_array") ){
					var selectedArray = eval(selected+"_array");
					while (selectedArray.length < document.form1.elements['state'].options.length) {
						document.form1.elements['state'].options[(document.form1.elements['state'].options.length - 1)] = null;
					}
					eval("document.form1.elements['state'].options[0]=" + "new Option('--')");
					document.form1.elements['state'].options[0].value="0";
					for (var i=1; i < selectedArray.length; i++) {
						var id = selectedArray[i].substring(0,selectedArray[i].indexOf(":"));
						var val = selectedArray[i].substring(selectedArray[i].indexOf(":")+1, selectedArray[i].length);
						document.form1.elements['state'].options[i]=new Option(val);
						document.form1.elements['state'].options[i].value=id;
						if (id == mychoice){
							document.form1.elements['state'].selectedIndex = i;
							nochoice = 0;
						}
					}
				}else{
					document.form1.elements['state'].options[(document.form1.elements['state'].options.length - 1)] = null;
					eval("document.form1.elements['state'].options[0]=" + "new Option('--')");
					document.form1.elements['state'].options[0].value="0";
				}
				if (nochoice){
					document.form1.elements['state'].selectedIndex = 0;
				}
			}
			</script>
			<B><DIV width=100% class=highlight>Please confirm the following before depositing funds:<br><BR>
				Your transfer amount: <?=dpsumm($amount)?><BR>
				Processing Fee: -<?=dpsumm($fee)?><BR>
				Total Account Debit: <?=dpsumm($amount + $fee)?><BR>
			</DIV>
			<CENTER>
			<form method="post" name="form1">
				<INPUT type=HIDDEN name=step value="2">
				<INPUT type=HIDDEN name=source value="<?=$source?>">
				<INPUT type=HIDDEN name=amount value="<?=$amount?>">
				<TABLE class=design cellspacing=0>
				<TR><TH colspan=2>Billing Information</TH></TR>
				<TR><TD>Email address:<BR>
					<DIV class=small>(<a href=index.php?read=privacy.htm&<?=$id?>>Privacy Policy</a>)</DIV></TD>
					<TD><INPUT type=text name=email size=30 maxLength=60 value="<?=$data->email?>"></TD></TR>
				<TR><TD>First Name:</TD>
					<TD><input type=text name=firstname size=40 maxLength=40 value=""></TD>
				<TR><TD>Last Name:</td>
					<TD><input type=text name=lastname size=40 maxLength=40 value=""></TD>
				</TR>
				<TR><TD>Company:<BR></TD>
					<TD><input type=text name=company size=40 maxLength=40 value="<?=htmlspecialchars($data->name)?>"></TD></TR>
				<TR><TD>Address:<BR></TD>
					<TD><input type=text name=address1 size=40 maxLength=40 value="<?=htmlspecialchars($data->address)?>"></TD></TR>
				<TR><TD>City:<BR></TD>
					<TD><input type=text name=city size=40 maxLength=40 value="<?=htmlspecialchars($data->city)?>"></TD></TR>
				<TR><TD>Country:<BR></TD>
					<TD><? WriteCombo($country_values, "country", $data->country, 0,"onChange=\"populate(document.form1.country.options[document.form1.country.selectedIndex].value)\"");?></TD></TR>
				<TR><TD>State:<BR></TD>
				<?
					if ($data->country){
						$state_array = $state_values[ $data->country ];
					}
					if (!$state_array){
						$state_array = $state_values;
					}
				?>
					<TD><? WriteCombo($state_array, "state", $data->state, 0);?></TD></TR>
				<TR><TD>Postal Code:<BR></TD>
					<TD><input type=text name=zip size=40 maxLength=40 value="<?=htmlspecialchars($data->zipcode)?>"></TD></TR>
				<TR><TD>Phone:<BR></TD>
					<TD><input type=text name=phone size=40 maxLength=40 value="<?=htmlspecialchars($data->phone)?>"></TD></TR>
				<TR><TD>Credit Card Number:<BR></TD>
					<TD><input type=text name=cardnum size=40 value="4111111111111111"></TD></TR>
				<TR><TD>Card Verification<br>Number:<br></td>
					<td><input type="text" name="cvv2" size="4" maxlength="4" value="<?=$_POST['cvv2']; ?>">
				<TR><TD>Month:<BR></TD>
					<TD>
						<select name="expm" >
								<option value="01">01 - January</option>
								<option value="02">02 - February</option>
								<option value="03">03 - March</option>
								<option value="04">04 - April</option>
								<option value="05">05 - May</option>
								<option value="06" selected>06 - June</option>
								<option value="07">07 - July</option>
								<option value="08">08 - August</option>
								<option value="09">09 - September</option>
								<option value="10">10 - October</option>
								<option value="11">11 - November</option>
								<option value="12">12 - December</option>
							</select>
						</TD></TR>
				<TR><TD>Year:<BR></TD>
					<TD>
						<select name="expy">
						<option value="03" selected>2003</option>
						<option value="04">2004</option>
						<option value="05">2005</option>
						<option value="06">2006</option>
						<option value="07">2007</option>
						<option value="08">2008</option>
						</select>
					</td></tr>
				</table>
				<INPUT type=submit class=button value='Deposit Money'>
			</FORM>
			</DIV>
			</B>
<?
			$processed = 1;
		}else{
			echo "Processing...<br>";
			$processed = ChargeAuthorizeNet( $user,$_POST,$amount,$fee );
			if($processed){
				$processed = 1;
			}else{
				echo "<p><a href='javascript:history.back(-1);'><b>go back</b></a></p>\n";
				$processed = 1;
			}
		}
	}else{
		errform('Sorry, but the minimum amount you can deposit is '.$currency.$minimal_deposit);
	}
?>
<?
	function ChargeAuthorizeNet($user,$row,$amount,$fees){
		global $success_msg,$anet_sid,$anet_pwd,$sitename,$dep_anet_percent,$dep_anet_fee;
		global $adminemail,$defaultmail,$currency,$suid;
		$retVal = 0;
		$qarray = array();
//		$fees = myround($amount * $dep_anet_percent / 100, 2) + $dep_anet_fee;
		$row['expdate'] = $row['expm']."/".$row['expy'];
		if(!$row['method'])$row['method'] = 'CC';
		
		$inv = CreatePincode();
		array_push($qarray, "x_ADC_Delim_Data=TRUE");
		array_push($qarray, "x_ADC_URL=FALSE");
		array_push($qarray, "x_Address=" . urlencode($row['address1'] . ", " . $row['address2']));
		array_push($qarray, "x_Amount=" . urlencode( myround($amount) ));
		array_push($qarray, "x_Card_Code=" . urlencode($row['cvv2']));
		array_push($qarray, "x_Card_Num=" . urlencode($row['cardnum']));
		array_push($qarray, "x_City=" . urlencode($row['city']));
		array_push($qarray, "x_Company=" . urlencode($row['company']));
		array_push($qarray, "x_Country=" . urlencode($row['country']));
		array_push($qarray, "x_Cust_ID=" . urlencode($user));
		array_push($qarray, "x_Customer_IP=" . urlencode($_SERVER['REMOTE_ADDR']));
		array_push($qarray, "x_Customer_Organization_Type=" . urlencode((strlen($row['company']) > 0) ? "B" : "I"));
		array_push($qarray, "x_Description=" . urlencode("Deposit to $sitename Account"));
		array_push($qarray, "x_Email=" . urlencode($row['email']));
		array_push($qarray, "x_Exp_Date=" . urlencode($row['expdate']));
		array_push($qarray, "x_First_Name=" . urlencode($row['firstname']));
		array_push($qarray, "x_Last_Name=" . urlencode($row['lastname']));
		array_push($qarray, "x_Login=$anet_sid");
		array_push($qarray, "x_Method=".urlencode($row['method']));
		array_push($qarray, "x_Password=$anet_pwd");
		array_push($qarray, "x_Phone=" . urlencode($row['phone']));
		array_push($qarray, "x_Recurring_Billing=FALSE");
		array_push($qarray, "x_State=" . urlencode($row['state']));
		array_push($qarray, "x_Tax_Exempt=TRUE");
		array_push($qarray, "x_Trans_ID=" . urlencode(1));
		array_push($qarray, "x_invoice_num=" . urlencode($inv));
		array_push($qarray, "x_Type=AUTH_CAPTURE");
		array_push($qarray, "x_Version=3.1");
		array_push($qarray, "x_Zip=" . urlencode($row['zip']));
		$query = implode('&', $qarray);

		$ch = curl_init("https://secure.authorize.net/gateway/transact.dll");
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $query);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$result = curl_exec($ch);
		curl_close($ch);

		$rarray = array();
		$rarray = explode(',', $result);
		switch ($rarray[0]) {
			case 1:
				$r = mysql_fetch_object(mysql_query("SELECT * FROM zetapay_users WHERE suid='".$suid."'"));
				if ($r){
					transact(17,$r->id,$amount,'Deposit','',$fees,1,'',addslashes($orderno));
					// Notify admin
					$message = " $r->username has just deposited {$currency}$amount via Authorize.Net!";
					if ($dep_notify){
						wrapmail($adminemail, "$sitename Deposit", $message, $defaultmail);
					}
					$success_msg = "Funds have been successfully added to your account.";
					$retVal = 1;
				}
				break;
			case 2:
				$success_msg = "Credit card transaction was denied.";
				$retVal = 0;
				break;
			case 3:
				$success_msg = "An error occurred while trying to process your information.<br><br>" . $rarray[3];
				$retVal = 0;
				break;
		}
		echo $success_msg;
		return $retVal;
	}
?>