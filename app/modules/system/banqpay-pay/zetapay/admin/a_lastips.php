<?
	$n1 = $n2 = 0;
	if ( preg_match("/delete/i", $_POST['change3']) ){
		$qr1 = mysql_query("SELECT * FROM zetapay_logins");
		$max = 0;
		while ($d = mysql_fetch_object($qr1)){
			$key = $_POST["ip_{$d->id}"];
			if($key){
				if($d->ipaddress == $key){
					$id=$d->id;
					@mysql_query("DELETE FROM zetapay_logins WHERE id=$id");
					echo "{$d->ipaddress} was deleted<bR>";
					$uC++;
				}
			}
		}
	}
	if ($_POST['change3']){
		$qr1 = mysql_query("SELECT * FROM zetapay_logins");
		$max = 0;
		while ($a = mysql_fetch_object($qr1)){
			$x[$a->id] = 1;
			if ($a->id > $max) $max = $a->id;
			if (preg_match("/block/i", $_POST['change3'])){
				$query = "INSERT INTO zetapay_blocked_ip SET ip='".addslashes($_POST["ip_$a->id"])."'";
				mysql_query($query) or die( mysql_error()."<BR>$query<br>");
			}
		}
		for ($i = 0; $i <= $max; $i++){
			if (!$x[$i]) break;
			$sel_id = $i;
		}
	}
?>
<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
IP Logins
</b></div>
<!------///////////////--->
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding-left:10px;">&nbsp;</td>
	<TD>
		<TABLE class=design width=90% cellspacing=0>
		<FORM name=form1 method=post>
<?
		$qr1 = mysql_query("SELECT * FROM zetapay_logins ORDER BY id ASC $limit");
		$qr2 = mysql_query("SELECT * FROM zetapay_logins ORDER BY id ASC $limit");
		$itotal = 0;
		for ($i = mysql_num_rows($qr2) - 1; $i >= 0; $i--){
				$itotal++;
		}
		$i = 1;
		while ($a = mysql_fetch_object($qr1)){
			$userObj = dpuserObj($a->user);
			$ahref = "main.php?a=user&id=$userObj->username&$id";
?>
			<TR>
				<TD width=15><input type=checkbox name="ip_<?=$a->id?>" value="<?=$a->ipaddress?>">
				<TD width=15><?=$i?></TD> 
				<TD><a href="<?=$ahref?>"><?=htmlspecialchars($userObj->username)?></a></TD>
				<TD><?=htmlspecialchars($a->ipaddress)?></TD>
				<TD><?=dpdate($a->date);?></TD>
					<input type="hidden" name="parent<?=$a->id?>" value="<?=$a->parent?>">
					<input type="hidden" name="akey<?=$a->id?>" value="<?=$a->akey?>">
<?
		}
?>
	<input type="hidden" name="itotal" value="<?=$itotal?>">
<TR><TH colspan=7><P align=center><input type=submit name=change3 value="Block selected" <?=$del_confirm?>>
<input type=submit name=change3 value="Delete selected" <?=$del_confirm?>>
</TH></TR>
	<INPUT type=hidden name=up>
	<INPUT type=hidden name=down>
	<input type="hidden" name="nextid" value="<?if(!$itotal){$nextid=0;}else{$nextid=$itotal;}echo $nextid;?>">
	<input type="hidden" name="suid" value="<?=$suid;?>">
</FORM>
</TABLE>
</td></tr>
</table>
</CENTER>
<?
	function whois($ip){
		$buffer = "";
		$locate = "";
		if( !$sock = @fsockopen(whois.ripe.net, 43, &$num, &$error, 10) ){
			unset($sock);
		}else{
			fputs($sock, getIP()."\n");
			while (!feof($sock)) $buffer .= fgets($sock, 10240);
				fclose($sock);
			$pos = strpos ($msg, "country:"); // Country Extract
			if ($pos>0)	$rest = substr ($msg, $pos+44, 2);
			$rest = str_replace(" ", "", $rest);

			$pos1 = strpos ($msg, "descr:"); // ISP Extract
			if ($pos1>0)	$rest1 = substr ($msg, $pos1+54, 100);
			$rest2 = split("\n", $rest1);
			$rests = eregi_replace("<BR />","",$rest2[0]);

			$rests = (!eregi("The whole IPv4 address space", $rests) && $rests != "")?$rests:"Unknown ISP";
			$rest  = (!$rest || (eregi("The whole IPv4 address space", $rest)))?"US":$rest;
			$locate[isp] = $rests;
			$locate[c] = $rest;
		}
		return $locate;
	}
?>