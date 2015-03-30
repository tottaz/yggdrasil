	<table width="150" cellpadding="0" cellspacing="0" class="design">
	<tr>
		<th>Sign In to <?=$sitename?></th>
	</tr>
	<tr>
		<td height="8"></td></tr>
	<tr>
		<td><div align=center>
			<form name="Login" method="post" action="?a=buyer_account&<?=$id?>">
			E-mail Address<br>
			<input name="username" type="text" style="width: 100%" value=""><br>
			Password<br>
			<input name="password" type="password" style="width: 80px"><br>
<?	if($useturingnumber){	?>
			Turing Number:<br>
			<INPUT type=text name=thecode size=10 maxLength=10 value=""><br>
<?
			$sid	=	session_id();
			if(!$sid){
				session_start();
				$sid	=	session_id();
			}
			$noautomationcode = "";
			for($i=0; $i<5;$i++){
				$noautomationcode = $noautomationcode.rand(0,9);
			}
			//save it in session
			$_SESSION['noautomationcode'] = $noautomationcode;
?>
			<img src='zetapay/humancheck/humancheck_showcode.php?turing_difficulty=<?=$turing_difficulty?>'><br>
<?	}	?>
			<br>
			<INPUT type=submit class=button name=login value='Login'><br><br>
			<input type='hidden' name='Submit' value='1'>
			<input id="login" type="hidden" name="login" value="Login >>">
			<a class=menulink href="?a=remind">Forgot your password?</a><br><br>
			Not a member yet?<br>
			<a class=menulink href=?a=signup&<?=$id?>>Signup now</a><br><br>
			</div>
		</td>
	</tr>
	</table>
	<br>