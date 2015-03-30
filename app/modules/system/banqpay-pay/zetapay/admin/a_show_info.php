<?
	$id = $_GET['user'];
	$q = "SELECT * FROM zetapay_verify WHERE user='$id'";
	$qr1 = mysql_query($q);
	$row = mysql_fetch_object( $qr1 );
	$row->phone = $row->bank_phone_ext."-".$row->bank_phone_number;
?>
<a href="" onclick="history.back()"> Back </a>
<br><br>
<center>Member Account Info </center>
<br><br>
<table border=1 width=70% align="center">
<tr>
	<td width="25%"><b>Account Holder Name </td>
	<td> <?=$row->name?> </td>
</tr>
<tr>
	<Td><b>Address </td>
	<td> <?=$row->acc_address?> </td>
</tr>
<tr>
	<td><b>Phone # </td>
	<td> <?=$row->acc_phone?> </td>
</tr>
<tr>
	<td><b>Bank Name </td>
	<td> <?=$row->bank_name?> </td>
</tr>
<tr>
	<td><b>Bank Address </td>
	<td> <?=$row->bank_address?> </td>
</tr>
<tr>
	<td><b>Bank Address1 </td>
	<td> <?=$row->bank_city?> </td>
</tr>
<tr>
	<td><b>Bank Phone Number </td>
	<td> <?=$row->phone?> </td>
</tr>
<tr>
	<td><b>ABA Number </td>
	<td> <?=$row->aba_number?> </td>
</tr>
<tr>
	<td><b>Account Number </td>
	<td> <?=$row->account_number?> </td>
</tr>
<tr>
	<td><b>Cheque Number </td>
	<td> <?=$row->chk_number?> </td>
</tr>
<tr>
	<td><b>Routing Number </td>
	<td> <?=$row->routing_number?> </td>
</tr>
</table>