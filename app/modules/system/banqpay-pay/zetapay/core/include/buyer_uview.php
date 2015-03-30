<script>
function popUp(URL) {
    day = new Date();
    id = day.getTime();
    eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0,location=0,status=1,menubar=0,scrollbars=1,resizable=1,width=600,height=470');");
}
</script>
<?
if ($_GET['ed'] && $user == 3){
	$_fpr_add = 0;
	$_GET['id'] = $_GET['ed'];
	require("admin/g_uedit.php");
	if (!$_fpr_err){
		unset($x);
		while (list($k,$v) = each($_GET))
			if ($k != "ed")
				$x[] = urlencode($k)."=".urlencode($v);
		header("Location: index.php?".implode("&", $x));
		exit;
	}
}else {
    $rs = $zetadb->Execute("SELECT * FROM zetapay_buyer_users WHERE buyer_id=".(int)$_GET['user']);
    $r = $rs->FetchNextObject();
	if ($r){
		$r->VIEW_COUNTER++;
		$zetadb->Execute("UPDATE zetapay_buyer_users SET view_counter={$r->VIEW_COUNTER} WHERE buyer_id={$r->ID}");

		$info = userinfo($r->ID);
		$x = preg_replace( "/((http(s?):\\/\\/)|(www\\.))([\\w\\.]+)(.*?)(?=\\s)/i", "<a href=\"http$3://$4$5$6\" target=\"_blank\">$4$5</a>", htmlspecialchars($r->PROFILE." ") );

		$confirm = confirmStr($_GET['user']);
?>
		<table width="100%" border="0" align="center" bgcolor="#FFFFFF">
		<tr>
			<td>
				<table width="100%" border="0" align="center" cellpadding="3" cellspacing="3" bgcolor="#FFFFFF">
				<tr>
					<td width=20> </td>
					<td width="519" valign="top">
						<table width="100%" border="0" cellspacing="0" cellpadding="3">
						<tr>
							<td>
								<span class="text4">User Profile</span><br>
								<hr width="100%" size="1"><br>
							</td>
						</tr>
						<tr>
							<td>
<?
		echo 	"<TABLE class=design cellspacing=0 width=100%>\n",
				"<TR><TH colspan=2>User Profile\n", $subtype,
				"<TR><TD class=row1 width=25%>Username:\n",
				"<TD class=row1>$r->EMAIL $confirm\n",
				($user == 3 ? " <a href=index.php?a=buyer_uview&user=$r->BUYER_ID&$id&ed=$r->BUYER_ID>Edit</a>" : ""),
				"<TR><TD class=row2 width=25%>E-mail:\n",
				"<TD class=row2>",($r->email ? htmlspecialchars($r->EMAIL) : '&nbsp;'),
				"<TR><TD class=row1>Name:\n",
				"<TD class=row1>",($r->name ? htmlspecialchars($r->NAME) : '&nbsp;');
		echo 	"</FORM></TABLE>",
				"<br>Profile Viewed <b>{$r->VIEW_COUNTER}</b> times.<br>";
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
<?
	}else{
		$action = '';
	}
}
?>