<?
	if($_POST['user'] && !$_GET['id'])$_GET['id'] = $_POST['user'];
	$r = mysql_fetch_object(mysql_query("SELECT * FROM zetapay_users WHERE username='".addslashes($_GET['id'])."' OR id='".addslashes($_GET['id'])."'"));
	if ($r->type == 'sys'){
//		exit;
	}

	function delete_user($id){
		mysql_query("UPDATE zetapay_users SET referredby=NULL WHERE referredby=$id");
		mysql_query("UPDATE zetapay_transactions SET paidby=100 WHERE paidby=$id");
		mysql_query("UPDATE zetapay_transactions SET paidto=100 WHERE paidto=$id");
		mysql_query("UPDATE zetapay_safetransfers SET paidby=100 WHERE paidby=$id");
		mysql_query("UPDATE zetapay_safetransfers SET paidto=100 WHERE paidto=$id");
		list($uname) = mysql_fetch_row(mysql_query("SELECT username FROM zetapay_users WHERE id=$id"));
		mysql_query("DELETE FROM zetapay_users WHERE id=$id");
	}

	if($_GET['verifyme']){
		$q = "DELETE FROM zetapay_verify WHERE user='{$_GET['user']}'";
		@mysql_query($q);
		$q = "INSERT INTO zetapay_verify SET verified=1,admin_verified=1,user='{$_GET['user']}'";
		@mysql_query($q);
	}else if($_GET['deverifyme']){
		$q = "DELETE FROM zetapay_verify WHERE user='{$_GET['user']}'";
		@mysql_query($q);
	}
	if($_POST['addnotes']){
		if($_POST['nid']){
			$sql = "UPDATE zetapay_notes SET notes='{$_POST['note']}' WHERE id='{$_POST['nid']}'";
		}else{
			$sql = "INSERT INTO zetapay_notes SET notes='{$_POST['note']}',user='{$_POST['user']}'";
		}
		mysql_query($sql) or die( mysql_error()."<br>$sql" );
	}

	$bqr = @mysql_query("SELECT * FROM zetapay_blocked_ip WHERE ip='$r->lastip'");
	$blocked = mysql_num_rows($bqr);

	if ($_GET['ssp']){
		mysql_query("UPDATE zetapay_users SET suspended=1-suspended WHERE id=".(int)$_GET['ssp']);
		$r->suspended = 1 - $r->suspended;
	}elseif ($_GET['sif']){
		if($r->fee){$nfee="0";}else{$nfee="1";}
		mysql_query("UPDATE zetapay_users SET fee=$nfee WHERE id=".(int)$_GET['sif']);
		$r->fee = $nfee;
	}else if ($_GET['iip']){
		if(!$blocked){
			$query = "INSERT INTO zetapay_blocked_ip SET ip='".addslashes($_GET["iip"])."'";
			mysql_query($query);
		}
	}elseif ($_GET['ip']){
		$query = "DELETE FROM zetapay_blocked_ip WHERE ip='".addslashes($_GET["ip"])."'";
		mysql_query($query);
	}elseif ($_GET['del']){
		delete_user((int)$_GET['del']);
		die("The user was deleted.".$reload_left);
	}elseif ($_GET['ed']){
		$tt = $_GET['id'];
		$_GET['id'] = $_GET['ed'];
		$_fpr_add = 0;
		require("admin/g_uedit.php");
		if ($_fpr_err) exit;
		$r = mysql_fetch_object(mysql_query("SELECT * FROM zetapay_users WHERE username='".addslashes($tt)."'"));
	}
	if ($use_images && !$_FILES['logo']['error']){
		if (strtolower(substr($_FILES['logo']['name'], -4)) != ".jpg")
			errform("File must have the .JPG extension", "img");
		elseif ($_FILES['logo']['size'] > 120 * 1024)
			errform("Your logo file is too large", "img");
		else
			$img = 1;
	}else{
		$img = 0;
	}
	if ($img)
		copy($_FILES['logo']['tmp_name'], $att_path.$data->username.".jpg");
	if ($_POST['delimg'])
		unlink($att_path.$data->username.".jpg");
?>
<CENTER>
<TABLE class=design cellspacing=0 width=100%>
	<FORM method=post enctype='multipart/form-data'>
<TR><TH colspan=2>Member Information
<TR><TD>Username:
	<TD><?=$r->username?>
<?	if ($r->type != 'sys'){	?>
		(<a href="<?=$siteurl?>/index.php?a=uview&user=<?=$r->id?>" target=mainsite>View on Site</a>)
		(<a href="main.php?a=user&id=<?=$r->username?>&ed=<?=$r->id?>&<?=$id?>">Edit</a>)
<TR><TD>E-mail:
	<TD><?=$r->email?> (<a href=main.php?a=write&id=<?=$r->username?>&<?=$id?>>Write mail</a>)
<TR><TD>Password:
	<TD><?=htmlspecialchars($r->password)?>
<TR><TD>Pincode:
	<TD><?=htmlspecialchars($r->pin)?>
<TR><TD>Name:
	<TD><?=( $r->name ? htmlspecialchars($r->name) : "&nbsp;" )?>
<?	if($allow_verify){	?>
<TR><TD>Status:
	<TD><?=( verified($r->id) ? "Verified" : "Not-Verified" )?>
<?
	$vhref = "<a href='main.php?a=user&id=".$r->username."&user=".$r->id."&verifyme=1&$id'>Verify</a>";
	$uvhref = "<a href='main.php?a=user&id=".$r->username."&user=".$r->id."&deverifyme=1&$id'>Unverify</a>";
?>
	(<?=( verified($r->id) ? $uvhref : $vhref )?>)
<?	}	?>
<TR><TD>Company Registration Number:
	<TD><?=( $r->regnum ? htmlspecialchars($r->regnum) : "&nbsp;" )?>
<TR><TD>Address:
	<TD><?=( $r->address ? htmlspecialchars($r->address) : "&nbsp;" )?>
<TR><TD>City:
	<TD><?=( $r->city ? htmlspecialchars($r->city) : "&nbsp;" )?>
<TR><TD>State / Region:
	<TD><?=$sflag?> <?=$state_values[$r->country][$r->state]?>
<TR><TD>Zip Code:
	<TD><?=( $r->zipcode ? htmlspecialchars($r->zipcode) : "&nbsp;" )?>
<TR><TD>Country:
	<TD><?=$cflag?><?=$country_values[$r->country]?>
<TR><TD>Phone:
	<TD><?=( $r->phone1 ? htmlspecialchars($r->phone1) : "&nbsp;" )?>
<TR><TD>Fax:
	<TD><?=( $r->fax ? htmlspecialchars($r->fax) : "&nbsp;" )?>
<TR><TD>Balance:
	<TD><?=( dpsumm(balance($r->id), 1) ? dpsumm(balance($r->id), 1) : "&nbsp;" )?>
<TR><TD valign=top>Confirmed:
	<TD>
<?
		echo ($r->cc_confirm ? "<LI>Credit card confirmed" : "&nbsp;");
		echo ($r->p_confirm ?  "<LI>Billing & Payment Info confirmed" : "&nbsp;");
		echo ($r->ph_confirm ? "<LI>Telephone confirmed" : "&nbsp;");
?>
	</TD></TR>
<TR><TD>Referred by:
	<TD><? if ($r->referredby) { list($uname) = mysql_fetch_row(mysql_query("SELECT username FROM zetapay_users WHERE id=$r->referredby")); echo "<a href=main.php?a=user&id=$uname&$id>$uname</a>"; } else echo "&nbsp;"; ?>
<TR><TD>ID:
	<TD><?=$r->id?>
<TR><TD>Last login:
	<TD><? echo dpdate($r->lastlogin)," from ",$r->lastip; ?> 
	(<?=($blocked ? "IP Blocked. (<a href=main.php?a=user&id=$r->username&ip=$r->lastip&$id>UnBlock</a>)" : "IP Not-Blocked. (<a href=main.php?a=user&id=$r->username&iip=$r->lastip&$id>Block</a>)")?>)
<TR><TD>Account
	<TD><?=($r->suspended ? "Suspended. (<a href=main.php?a=user&id=$r->username&ssp=$r->id&$id>Activate</a>)" : "Active. (<a href=main.php?a=user&id=$r->username&ssp=$r->id&$id>Suspend</a>)")?>
<TR><TD colspan=2 align=center><a href=main.php?a=user&id=<?=$r->username?>&del=<?=$r->id?>&<?=$id?> <?=$del_confirm?>>Delete account</a> (<span style='color:red;'>Will cause extensive database updates</span>)
  </TD><?=$id_post?></FORM>
<?	}	?>
</TABLE>
<BR>
<a href="main.php?a=reports&email=<?=$r->email?>&search=1&<?=$id?>" style="color:white;">View transactions</a>
<br><br>
<?	if ($r->type != 'sys'){	?>
<?
		$qr1 = mysql_query("SELECT * FROM zetapay_notes WHERE user=$r->id");
		$ba = mysql_fetch_object($qr1);
?>
	<TABLE cellspacing=0 width=100% cellpadding=5 cellspacing=5>
	<TR>
		<TD width=50%  valign=top>
			<TABLE class=design cellspacing=0 width=100%>
			<TR><TH>Notes
			<TR>
				<form method="POST">
				<input type="hidden" name="addnotes" value=1>
				<input type="hidden" name="user" value=<?=$r->id?>>
				<TD>
			<?	if($ba->id){	?>
					<input type="hidden" name="nid" value=<?=$ba->id?>>
			<?	}	?>
					<textarea name="note" class="fields" rows="7" style="width:100%"><?=$ba->notes?></textarea>
				</TD>
			</TR>
			<TR>
				<TH>
					<input type="submit" value="submit">
				</TH>
			</TR>
				</form>
			</TABLE>
		</TD>
		<TD width=50%  valign=top>
			<?
				$qr1 = mysql_query("SELECT username FROM zetapay_users WHERE referredby=$r->id ORDER BY username");
			?>
			<TABLE class=design cellspacing=0 width=100%>
			<TR><TH>Referred Users
			<?
				while ($a = mysql_fetch_object($qr1))
					echo "<tr><td><a href=main.php?a=user&id=$a->username&$id>$a->username</a>";
				if (mysql_num_rows($qr1) == 0) echo "<TR><TD>None.";
			?>
			</TABLE>
		</TD>
	</TR>
	</TABLE>
<?	}	?>
</CENTER>