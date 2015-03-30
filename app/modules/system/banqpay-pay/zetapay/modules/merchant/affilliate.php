	<table width="100%" border="0" align="center" bgcolor="#FFFFFF">
	<tr bgcolor="#FFFFFF">
		<td width=10> </td>
		<td width="519" valign="top" bgcolor="#FFFFFF">
			<table width="100%" border="0" align="center" cellpadding="3" cellspacing="3" bgcolor="#FFFFFF">
			<tr>
				<td width="519" valign="top">
					<table width="100%" border="0" cellspacing="0" cellpadding="3" bgcolor="#FFFFFF">
					<tr>
						<td>
							<span class="text4">Referral Program</span><br>
							<hr width="100%" size="1"><br>
						</td>
					</tr>
					<tr>
						<td> </td>
					</tr>
					<tr>
						<td bgcolor="#FFFFFF">
<?
	if( !$_REQUEST['be'] ){
		include("core/affilliate/g_dline.php");
/*
		$_REQUEST['read'] = "referrals.htm";
		if ($_REQUEST['read']){
			if (!@include('help/'.$_REQUEST['read'])){
				echo "Cannot find file: <i>help/",$_REQUEST['read'],"</i><br>";
			}
		}
*/
	}else if($_REQUEST['be'] == "stats"){
		include("core/affilliate/g_stats.php");
	}else if($_REQUEST['be'] == "dl"){
		include("core/affilliate/g_dline.php");
	}else if($_REQUEST['be'] == "code"){
		$_REQUEST['read'] = "referrals_code.htm";
		if ($_REQUEST['read']){
			if (!@include('help/'.$_REQUEST['read'])){
				echo "Cannot find file: <i>help/",$_REQUEST['read'],"</i><br>";
			}
		}
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