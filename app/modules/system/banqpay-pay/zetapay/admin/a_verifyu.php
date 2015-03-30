<?
	if($_POST['submit'] == "Delete"){
		$user = $_POST['user'];
		mysql_query("DELETE FROM zetapay_verify WHERE user='$user'");
	}else if($_POST['submit']){
		while(list($key,$value)=each($_POST)){
			$$key=$value;
		}
		if ($amt == ""){
			echo ("<br><br><br><center><b>Please Enter an Amount to Proceed<br><br>");
		}else{
			$q = "update zetapay_verify set check_amount='$amt',admin_verified=1 where user='$user'";
			mysql_query($q);
			echo ("<br><br><br><center><b>User Check Amount Stored Successfully!</b><br><br>");
		}
		echo ("<a href=\"\" onclick=\"history.back()\">Go Back To List</a><br><br><br>");
	}else{
		if($_GET['pen']){
?>
			<center><b>Users Pending Verified Status </b></center>
			<br>
				The following are the list of users waiting to get their credit card to be verified. <br>
			<br>
			<li>Click on the username/email to get their Credit card details.
			<br><br>
			<TABLE class=design width=100% cellspacing=0>
			<tr>
				<th>Username/Email</th>
				<th>Amount</th>
				<th>Verified</th>
			</tr>
<?
			$q = "select * from zetapay_verify where admin_verified=0";
			$v = mysql_query($q);
			while( $row = mysql_fetch_object($v) ){
				$user = $row->user;
				$a = dpuserObj($user);
				$ahref = "main.php?a=show_info&user=$user&$id";
?>
				<!--STARTLOOP-->
				<form method=post>
				<input type=hidden name="user" value="<?=$user?>" >
				<tr>
					<td><a href="<?=$ahref?>"> <?=$a->email?>  </a></td>
					<td align="center"><input type=text name="amt" size=4></td>
					<td align=center>
						<input type=submit name="submit" value="Verified">
						<input type=submit name="submit" value="Delete">
				</tr>
				</form>
				<!--ENDLOOP-->
<?
			}
			echo ("<br><br>");
?>
			</table>
<?
		}else{
?>
			<center><b>Verified Users</b></center>
			<br>
				The following are the list of users how have been verified. <br>
			<br>
			<li>Click on the username/email to get their Credit card details.
			<br><br>
			<TABLE class=design width=100% cellspacing=0>
			<tr>
				<th>Username/Email</td>
				<th>&nbsp;&nbsp;</td>
			</tr>
<?
			if( $_GET['pen'] ){
				$q = "select * from zetapay_verify where admin_verified=0";
			}else{
				$q = "select * from zetapay_verify where verified = 1";
			}
			$v = mysql_query($q);
			while( $row = mysql_fetch_object($v) ){
				$user = $row->user;
				$a = dpuserObj($user);
				$ahref = "main.php?a=show_info&user=$user&$id";
				$ahref2 = "main.php?a=user&id=$a->username&$id";
?>
				<!--STARTLOOP-->
				<form method=post>
				<input type=hidden name="user" value="<?=$user?>" >
				<tr>
					<td><a href="<?=$ahref?>"> <?=$a->email?>  </a></td>
					<td align=center>
						<input type="button" onclick="window.location.href='<?=$ahref2?>';" value="Show Info">&nbsp;
						<input type=submit name="submit" value="Delete">
				</tr>
				</form>
				<!--ENDLOOP-->
<?
			}
			echo ("<br><br>");
?>
			</table>
<?
		}
	}
?>