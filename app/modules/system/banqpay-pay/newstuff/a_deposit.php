<?
?>
<SCRIPT language=javascript type='text/javascript'>
<!--
function amount() {
	var f0 = document.getElementById('f');
	var amount1 = document.getElementById('amount1');

	if (f0.amount0.selectedIndex == 0) {
		amount1.style.display = '';
	} else {
		amount1.style.display = 'none';
	}
}

function redirect(url) {
	var ifrm = document.getElementById('RS0_06093_AAEdcgLA');
	ifrm.src = '/blank.html';
	location = url;
}

function done() {
	location = "/spend/account/reports/funding.html?range=fixed&fixed=n0";
}

function lock(btnId) {
	var btn = document.getElementById('btn');
	btn.disabled = true;

	var wait = document.getElementById('wait');
	wait.style.display = '';

	var main = document.getElementById('main');
	main.style.display = 'none';

	var progress = document.getElementById('progress');
	progress.src = '/img/progress.gif';
}

function unlock(btnId) {
	var btn = document.getElementById('btn');
	btn.disabled = false;

	var wait = document.getElementById('wait');
	wait.style.display = 'none';

	var main = document.getElementById('main');
	main.style.display = '';
}

function select() {
	var s0 = document.getElementById('method');

	var pn0 = document.getElementById('ppcard');
	var pn1 = document.getElementById('addfund');

	if (s0.selectedIndex == 0) {
		pn0.style.display = 'none';
		pn1.style.display = 'none';

		return;
	}

	if (s0.selectedIndex == 1) {
		pn0.style.display = '';
		pn1.style.display = 'none';

		return;
	}

	if (s0.selectedIndex > 1) {
		pn0.style.display = 'none';
		pn1.style.display = '';

		var f0 = document.getElementById('f');
		f0.method.value = s0.options[s0.selectedIndex].value;

		amount();
		return;
	}

}

function proceed() {
	var s0 = document.getElementById('method');
	var f0 = document.getElementById('f');

	var amount;
	if (f0.amount0.selectedIndex == 0) {
		amount = f0.amount1.value;
		amount = 0 + amount.replace(/[^0123456789\.]/g, '');

		if (amount == 0) {
			alert('Please enter an amount');
			f0.amount1.focus();
			return;
		}
		verb = 'enter';
	} else {
		amount = f0.amount0.value;
		verb = 'select';
	}

	if (amount < 3) {
		alert('Please '+verb+' an amount above the minimum: $3.00');
		return;
	}

	if (amount > 1000) {
		alert('Please '+verb+' an amount below the maximum: $1,000.00');
		return;
	}

	if (s0.value == 'CC:0') {
		location.href = './creditcard.html?amount='+amount;
	} else {
		f0.submit();
	}
}
//-->
</SCRIPT>

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
						<span class="text4">Fund your account</span><br>
						<hr width="100%" size="1"><br>
					</td>
				</tr>
				<tr>
					<td> </td>
				</tr>
				<tr>
					<td bgcolor="#FFFFFF">
<?
	$source = $_POST['source'];
	$amount = (float)$_POST['amount'];
	$processed = 0;

	if($source){
		if( !$_POST['step'] ){
			if($use_pin){
				if (strlen($_POST['pincode']) < 1){
					errform('Please enter your pincode.'); // #err
				}else if($data->pin != $_POST['pincode']){
					errform('Please enter a valid pincode.'); // #err
				}
			}
		}

?>

<?
		// PayPal processing
		if ($paypal_use && $source == 'paypal'){
			include("src/g_paypal.php");
		}elseif ($cc_use && $source == 'cc'){
			// 2CheckOut Credit card processing
			include("src/g_2checkout.php");
		}elseif ($anet_use && $source == 'anet'){
			// Authorize.Net Credit card processing
			include("src/g_anet.php");
		}elseif ($anet_use && $source == 'anetc'){
			// Authorize.Net Credit card processing
			include("src/g_anetcheck.php");
		}elseif ($eg_use && $source == 'eg'){
			// E-Gold processing
			include("src/g_egold.php");
		}elseif ($np_use && $source == 'np'){
			// Netpay processing
			include("src/g_netpay.php");
		}elseif ($qchex_use && $source == 'qchex'){
			// Check processing
			include("src/g_qchex.php");
		}elseif ($check_use && $source == 'check'){
			// Check processing
			include("src/g_check.php");
		}
	}
	if (!$processed){
		// Generate form
?>
<P class=bodyhead>Fund your account<BR><IMG src='/img/rule.gif' width=440 height=2></P>
<TABLE width=530 border=0 cellpadding=1 cellspacing=0>
<TR>
 <TD height=5></TD>
</TR>
<TR>
 <TD>You can fund your account with Visa, MasterCard, Discover, American Express, PayPal, or a prepaid card.
</TD>
</TR>
<TR>
 <TD height=24></TD>
</TR>
<TR>
  <TD>
  <TABLE border=0 cellpadding=0 cellspacing=0>
  <TR>
   <TD valign=middle><B>1. Select funding source:</B>&nbsp;</TD>
   <TD valign=middle>
    <SELECT id=method onChange='select();'>
    <OPTION value=blank> </OPTION>
    <OPTION value=ppcard>BitPass prepaid card</OPTION>
    <OPTION value=paypal>PayPal</OPTION>
  <OPTION value=CC:0>Credit card</OPTION></SELECT>
   </TD>
  </TR>
  </TABLE>
 </TD>
</TR>
<TR>
 <TD height=80 valign=top>
  <DIV id=ppcard style='display:none'>
  <FORM action='/cmd/usr' method=post target='RS0_06093_AAEdcgLA'>
  <INPUT type=hidden name=cmd value=chkcard>
  <TABLE border=0 cellspacing=0 cellpadding=0>
  <TR>
   <TD colspan=2 height=16></TD></TR>
  <TR>
   <TD valign=middle><B>2. Enter BitPass card #:</B>&nbsp;</TD>
   <TD valign=middle><INPUT type=text size=45 name=card_no class=text></TD>
   </TR>
  <TR>
   <TD colspan=2 height=12></TD>
  </TR>
  <TR>
   <TD></TD>
   <TD valign=middle><INPUT type=submit value=' Register ' class=btn></TD>
  </TR>
  </TABLE>
  </FORM>
  </DIV>
  <DIV id=addfund style='display:none'>
  <FORM id=f name=f action='/cmd/usr' method=post target='RS0_06093_AAEdcgLA'>
  <INPUT type=hidden name=cmd value='init-txn'>
  <INPUT type=hidden name=method>
  <TABLE border=0 cellspacing=0 cellpadding=0>
  <TR>
   <TD colspan=3 height=16></TD>
  </TR>
  <TR>
   <TD valign=middle><B>2. Select amount:</B>&nbsp;</TD>
   <TD valign=middle>
    <SELECT name=amount0 style='width:125px;' onChange='amount();' onFocus='amount();'>
    <OPTION value=-1>Enter Amount</OPTION>
    <OPTION value=3.00>$3.00</OPTION>
    <OPTION value=5.00 selected>$5.00</OPTION>
    <OPTION value=10.00>$10.00</OPTION>
    <OPTION value=15.00>$15.00</OPTION>
    <OPTION value=20.00>$20.00</OPTION>
    <OPTION value=30.00>$30.00</OPTION>
    <OPTION value=40.00>$40.00</OPTION>
    <OPTION value=60.00>$60.00</OPTION>
    <OPTION value=100.00>$100.00</OPTION>
    <OPTION value=200.00>$200.00</OPTION>
    </SELECT>
   </TD>
   <TD>
   <TABLE id=amount1 border=0 cellspacing=0 cellpadding=0>
    <TR>
     <TD width=20 align=center valign=middle><B>&raquo;</B></TD>
     <TD valign=middle><INPUT type=text name=amount1 size=6 style='width:75px;'></TD>
     <TD valign=middle>&nbsp;($3.00 - $1,000.00)</TD>
    </TR>
   </TABLE>
  </TR>
  <TR>
   <TD colspan=3 height=8></TD>
  </TR>
  <TR>
   <TD></TD>
   <TD colspan=2><INPUT id=btn type=button value=' Proceed ' onClick='proceed();' class=btn></TD>
  </TR>
  </TABLE>
  </FORM>
  </DIV>
 </TD>
</TR>

<P class=bodyhead>Fund your account<BR></P>
<TABLE width=530 border=0 cellpadding=1 cellspacing=0>
<TR>
 <TD height=5></TD>
</TR>
<TR>
 <TD>You can fund your account with Visa, MasterCard, Discover, American Express, PayPal, or a prepaid card.
</TD>
</TR>
<TR>
 <TD height=24></TD>
</TR>
<TR>
  <TD>
  <TABLE border=0 cellpadding=0 cellspacing=0>
  <TR>
   <TD valign=middle><B>1. Select funding source:</B>&nbsp;</TD>
   <TD valign=middle>
    <SELECT id=method onChange='select();'>
    <OPTION value=blank> </OPTION>
    <OPTION value=ppcard>BitPass prepaid card</OPTION>
    <OPTION value=paypal>PayPal</OPTION>
  <OPTION value=CC:0>Credit card</OPTION></SELECT>
   </TD>
  </TR>
  </TABLE>
 </TD>
</TR>
<TR>
 <TD height=80 valign=top>
  <DIV id=ppcard style='display:none'>
  <FORM action='/cmd/usr' method=post target='RS0_35922_AAGxKcz8'>
  <INPUT type=hidden name=cmd value=chkcard>
  <TABLE border=0 cellspacing=0 cellpadding=0>
  <TR>
   <TD colspan=2 height=16></TD></TR>
  <TR>
   <TD valign=middle><B>2. Enter BitPass card #:</B>&nbsp;</TD>
   <TD valign=middle><INPUT type=text size=45 name=card_no class=text></TD>
   </TR>
  <TR>
   <TD colspan=2 height=12></TD>
  </TR>
  <TR>
   <TD></TD>
   <TD valign=middle><INPUT type=submit value=' Register ' class=btn></TD>
  </TR>
  </TABLE>
  </FORM>
  </DIV>
  <DIV id=addfund style='display:none'>
  <FORM id=f name=f action='/cmd/usr' method=post target='RS0_35922_AAGxKcz8'>
  <INPUT type=hidden name=cmd value='init-txn'>
  <INPUT type=hidden name=method>
  <TABLE border=0 cellspacing=0 cellpadding=0>
  <TR>
   <TD colspan=3 height=16></TD>
  </TR>
  <TR>
   <TD valign=middle><B>2. Select amount:</B>&nbsp;</TD>
   <TD valign=middle>
    <SELECT name=$currency style='width:125px;' onChange='amount();' onFocus='amount();'>
    <OPTION value=-1>Enter Amount</OPTION>
    <OPTION value=3.00>$3.00</OPTION>
    <OPTION value=5.00 selected>$5.00</OPTION>
    <OPTION value=10.00>$10.00</OPTION>
    <OPTION value=15.00>$15.00</OPTION>
    <OPTION value=20.00>$20.00</OPTION>
    <OPTION value=30.00>$30.00</OPTION>
    <OPTION value=40.00>$40.00</OPTION>
    <OPTION value=60.00>$60.00</OPTION>
    <OPTION value=100.00>$100.00</OPTION>
    <OPTION value=200.00>$200.00</OPTION>
    </SELECT>
   </TD>
   <TD>
   <TABLE id=amount1 border=0 cellspacing=0 cellpadding=0>
    <TR>
     <TD width=20 align=center valign=middle><B>&raquo;</B></TD>
     <TD valign=middle><INPUT type=text name=amount1 size=6 style='width:75px;'></TD>
     <TD valign=middle>&nbsp;($3.00 - $1,000.00)</TD>
    </TR>
   </TABLE>
  </TR>
  <TR>
   <TD colspan=3 height=8></TD>
  </TR>
  <TR>
   <TD></TD>
     <TD colspan=2>
     <INPUT type=submit class=button value='Proceed onClick='proceed();'>>'></TH>
	 <?=$id_post?>
   </TD>
  </TR>
  </TABLE>
  </FORM>
  </DIV>
 </TD>
</TR>

		<TR><TD>Amount to deposit:</TD>
			<TD><?=$currency?> <input type=text size=7 maxLength=7 name=amount></TD></TR>
<?	if($use_pin){	?>
		<TR><TD>Your pincode:</TD>
			<TD><INPUT type=password name=pincode size=6 maxLength=6></TD></TR>
<?	}	?>
		<TR><TD valign="top">Payment method:</TD>
		<TD>
<?
  		// PayPal
  		if ($paypal_use){
    			echo "<input type=radio class=checkbox name=source value='paypal' ",($source == 'paypal' ? 'checked' : ''),">","Paypal";
    			if ($dep_pp_percent || $dep_pp_fee){
    	  			echo " <span class=small>(cost: ",
					($dep_pp_percent ? "$dep_pp_percent%" : ""),
					($dep_pp_percent && $dep_pp_fee ? " + " : ""),
					($dep_pp_fee ? $currency.$dep_pp_fee : ""),
					")</span>";
			}
			echo "<br>\n";
		}
  		// 2CheckOut
  		if ($cc_use){
    			echo "<input type=radio class=checkbox name=source value='cc' ",($source == 'cc' ? 'checked' : ''),">","Credit Card / Online Check";
    			if ($dep_cc_percent || $dep_cc_fee){
      			echo " <span class=small>(cost: ",
					 ($dep_cc_percent ? "$dep_cc_percent%" : ""),
					 ($dep_cc_percent && $dep_cc_fee ? " + " : ""),
					 ($dep_cc_fee ? $currency.$dep_cc_fee : ""),
           			")</span>";
           	}
    			echo "<br>\n";
  		}
		// Authorize.Net
		if ($anet_use){
			echo "<input type=radio class=checkbox name=source value='anet' ",($source == 'anet' ? 'checked' : ''),">",
			"Credit Card";
			if ($dep_anet_percent || $dep_anet_fee)
				echo " <span class=small>(cost: ",
				($dep_anet_percent ? "$dep_anet_percent%" : ""),
				($dep_anet_percent && $dep_anet_fee ? " + " : ""),
				($dep_anet_fee ? $currency.$dep_anet_fee : ""),
				")</span>";
			echo "<br>\n";
			echo "<input type=radio class=checkbox name=source value='anetc' ",($source == 'anetc' ? 'checked' : ''),">",
			"Deposit from Bank Account";
			if ($dep_anet_percent || $dep_anet_fee)
				echo " <span class=small>(cost: ",
				($dep_anet_percent ? "$dep_anet_percent%" : ""),
				($dep_anet_percent && $dep_anet_fee ? " + " : ""),
				($dep_anet_fee ? $currency.$dep_anet_fee : ""),
				")</span>";
			echo "<br>\n";
		}
  		// E-Gold
  		if ($eg_use){
    			echo "<input type=radio class=checkbox name=source value='eg' ",($source == 'eg' ? 'checked' : ''),">","E-Gold";
    			if ($dep_eg_percent || $dep_eg_fee){
      			echo " <span class=small>(cost: ",
					 ($dep_eg_percent ? "$dep_eg_percent%" : ""),
					 ($dep_eg_percent && $dep_eg_fee ? " + " : ""),
					 ($dep_eg_fee ? $currency.$dep_eg_fee : ""),
           			")</span>";
           	}
    			echo "<br>\n";
  		}
  		// NetPay
  		if ($np_use){
    			echo "<input type=radio class=checkbox name=source value='np' ",($source == 'np' ? 'checked' : ''),">","NetPay";
    			if ($dep_np_percent || $dep_np_fee){
      			echo " <span class=small>(cost: ",
					 ($dep_np_percent ? "$dep_np_percent%" : ""),
					 ($dep_np_percent && $dep_np_fee ? " + " : ""),
					 ($dep_np_fee ? $currency.$dep_np_fee : ""),
           			")</span>";
           	}
    			echo "<br>\n";
  		}
  		// QChex
  		if ($qchex_use){
    			echo "<input type=radio class=checkbox name=source value='qchex' ",($source == 'qchex' ? 'checked' : ''),">","Check";
    			if ($dep_qc_percent || $dep_qc_fee){
      			echo " <span class=small>(cost: ",
					 ($dep_qc_percent ? "$dep_qc_percent%" : ""),
					 ($dep_qc_percent && $dep_qc_fee ? " + " : ""),
					 ($dep_qc_fee ? $currency.$dep_qc_fee : ""),
           			")</span>";
           	}
    			echo "<br>\n";
  		}
  		// Check
  		if ($check_use){
			echo "<input type=radio class=checkbox name=source value='check' ",($source == 'check' ? 'checked' : ''),">","Regular Mail";
			if ($dep_check_percent || $dep_check_fee){
				echo " <span class=small>(cost: ",
					($dep_check_percent ? "$dep_check_percent%" : ""),
					($dep_check_percent && $dep_check_fee ? " + " : ""),
					($dep_check_fee ? $currency.$dep_check_fee : ""),
					")</span>";
			}
			echo "<br>\n";
		}
?>
		</TD></TR>
		<TR><TH colspan=2 class=submit>
			<INPUT type=submit class=button value='Deposit >>'></TH>
			<?=$id_post?>
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
</table>