<br><br>
<script>
function validate(){
	dm = document.verify;
	if (dm.elements['amount'].value == ""){
		alert ("Enter Your the amount");
		dm.amount.focus();
		return false;
	}
}
</script>
<center><u>
<b>Verify With <?=$sitename?></b></u><br><br>
<li>Please give the amount you get in your Bank Statements for <?=$sitename?>'s Verification.
<form method=post name=verify onsubmit="return validate()">
<TABLE class=design cellspacing=0 width=50%>
<tr>
	<td>Enter The Amount :</td>
	<td><input type=text name=amount size=4></td>
</tr>
<tr>
	<th colspan=2><input type=submit name=submit value="Submit"></th>
</tr>
</table>
</form>