<?
session_start();
$suid = $_SESSION['suid'];

// in: $atype, $requirelogin
// out: $userip, $suid, $user, $data, $id, $id_post

($action = $base->input['a']) or ($action = $base->input['a']) or ($action = $base->input['menu_type']);
($pid = (int)$base->input['pid']) or ($pid = (int)$base->input['pid']) or ($pid = '');
($userip = $_SERVER['HTTP_X_FORWARDED_FOR']) or ($userip = $_SERVER['REMOTE_ADDR']);
$justloggedin = 0;

if($base->input['login']) {
	$chk_ip="select ip from system_blocked_ip where ip='$userip'";    // for checking the Blocked IP
	$rs_ip = $zetadb->Execute($chk_ip);
	if($zetadb->Affected_Rows()) {
      		$errlogin = "Sorry, Your are trying to Login from Blocked IP";
		    $_SESSION['suid'] = "";
			$_SESSION['loginid'] = "";
			$_SESSION['username'] ="";
	 } else {
	$ok = 1;
	if($useturingnumber){
		if( $_SESSION['noautomationcode'] != $_POST['thecode'] ) {
			errform('The Turing Number code does not match', 'thecode'); // #err
			$ok = 0;
		}
	}
		$ok = 1;
		if(!empty($base->input['txt_password']) && !empty($base->input['username']))
		{
            $encryptedpassword=md5($base->input['txt_password']); //encrypt the password     
			$qry_sel="SELECT * FROM ".TBL_SYSTEM_USERS." WHERE (username='".addslashes($base->input['username'])."') AND password='".addslashes($encryptedpassword)."' and suspended=0  and active='Y'";  // suid=1 for new password
			 $rs = $zetadb->Execute($qry_sel);
			 $data = $rs->FetchNextObject();

			if ($data)
			{
				$suid = substr( md5($userip.time()), 8, 16 );
				$zetadb->Execute("UPDATE ".TBL_SYSTEM_USERS." SET suid='$suid',signed_on=NOW(),lastip='$userip' WHERE id=$data->ID and active='Y'");
				if($use_iplogging)
				{
					$zetadb->Execute("INSERT INTO ".TBL_SYSTEM_LOGINS." SET user='$data->ID',date=NOW(),ipaddress='$userip', username='".addslashes($base->input['username'])."'");
				}
					
					$_SESSION['suid'] = $suid;
					$_SESSION['loginid'] = $base->input['username'];
					$_SESSION['fname'] = $data->FIRSTNAME;					
					$_SESSION['username'] = $data->FIRSTNAME." ".$data->LASTNAME;
					$_SESSION['usergroup'] = $data->TYPE;
					
					$justloggedin = 1;

				if($data->CHANGE_PWD_FLAG == 1)
				{
					 $_SESSION['change_ur_pass']="First Change Your Password";
					 ?> <script>window.location.href="index.php?directory=modules&subdirectory=merchant&function=merchant_support&menu_type=change_password"</script>
					 <?
				}
				else
				{
					//$_SESSION['change_ur_pass']="";
				}
			}
			else
			{
			   $errlogin = "You have entered a wrong username or password";
			   $_SESSION['suid'] = "";
			   $_SESSION['loginid'] = "";
			   $_SESSION['username'] ="";
			}
		 }
		 else
		 {
			$errlogin = "User Name or Password Cannot Be Empty";
			$_SESSION['suid'] = "";
			$_SESSION['loginid'] = "";
			$_SESSION['username'] ="";
		 }
   } 

}

if($_SESSION['suid']!="")
{
	if (!$data)
	{
		//PRINT "SELECT * FROM ".TBL_SYSTEM_USER_DETAIL." WHERE suid='$_SESSION[suid]' AND DATE_ADD(lastlogin,INTERVAL $session_mins MINUTE)>NOW() AND lastip='$userip'";
		$qry_sel1="SELECT * FROM ".TBL_SYSTEM_USERS." WHERE suid='$_SESSION[suid]' AND DATE_ADD(lastlogin,INTERVAL $session_mins MINUTE)>NOW() AND lastip='$userip' and active='Y'";
		$rs = $zetadb->Execute($qry_sel1);
		$data = $rs->FetchNextObject();
    }
	if ($data)
	{
	    $user = $data->ID;
	    if ($data->SUSPENDED)
		{
		    $errlogin = "Your account is suspended, please contact administrator";
			$_SESSION['suid'] = "";
			$_SESSION['loginid'] = "";
	    }
		else
		{
			//print "UPDATE ".TBL_SYSTEM_USER_DETAIL." SET lastlogin=NOW() WHERE id=$user";
		    $zetadb->Execute("UPDATE ".TBL_SYSTEM_USERS." SET lastlogin=NOW() WHERE id=$user");
		    if($use_iplogging)
			{
			  $zetadb->Execute("INSERT INTO ".TBL_SYSTEM_LOGINS." SET user='$data->ID',date=NOW(),ipaddress='$userip', username='".addslashes($_POST['username'])."'");
			}
         }
     }

}

if($_SESSION['suid']=="" AND $action=='login')
{
    $id = ($suid ? "suid=$suid" : "");
    $id_post = "<input type=hidden name=suid value=$suid><input type=hidden name=a value=$action><input type=hidden name=pid value=\"$pid\">";

     include($rootDir.$subDir.'header.php'); 
     
     // ------------------------------------------------------------
	// Generate login page
	if ($errlogin)
	{
  		echo "<div class=error align=center><B>$errlogin</B></div><br>";
	}
	if ($_SESSION['duplicate_user_msg']!="")
	{
  		echo "<div class=error align=center><B>".$_SESSION['duplicate_user_msg']."</B></div><br>";
		$_SESSION['duplicate_user_msg']="";
	}
	if ($_SESSION['msg_login']!="")
	{
  		echo "<div class=error align=center><B>".$_SESSION['msg_login']."</B></div><br>";
		$_SESSION['msg_login']="";
	}

?>
<table width="600" cellpadding=0 cellspacing=0 border=0 align=center>
<tr valign=top>
	<td width="100%" class="pptext" align="left">

    <script language="JavaScript" src="zetapay/core/javalib/md5.js"></script>
		<script language=JavaScript>
		function setCookie(name, value, minutes)
		{
			if (minutes) { now = new Date(); now.setTime(now.getTime() + minutes*60*1000); }
			var curCookie = name + "=" + escape(value) + ((minutes) ? "; expires=" + now.toGMTString() : "");
			document.cookie = curCookie;
		}

		function getCookie(name)
		{
			var prefix = name + "=";
			var cStartIdx = document.cookie.indexOf(prefix);
			if (cStartIdx == -1) return '';
			var cEndIdx = document.cookie.indexOf(";", cStartIdx+prefix.length);
			if (cEndIdx == -1) cEndIdx = document.cookie.length;
			return unescape( document.cookie.substring(cStartIdx + prefix.length, cEndIdx) );
		}

		function doc_onLoad()
		{
			if (getCookie('c_user'))
			{
				forml.username.value = getCookie('c_user');
				forml.txt_password.focus();
				//form1.remember_me.checked=true;
			}
			else
			{
				forml.username.focus();
			}
		 }

		function doc_onSubmit(doc)
		{
			if(doc.remember_me.checked==true)
			{
				setCookie('c_user', forml.username.value, 30*24*60);

			}
		}

		</script>
		<br><br>
		<div align=center>
		<table class=design cellspacing=0>
	        <tr>
		    <td>
			<form method=post name=forml>
             <table align="center" width="100%" cellspacing="2" cellpadding="1" class="outerTable">
               <tr>
                <br>
                <td class="formLabel" style="width:88px; padding-right:5px; line-height:20px;" align="right">User Name</td>
                <td class="formField">
                    <input type="text" name="username" maxlength="50" style="width:140px;" value="" />
                </td>
               </tr>
               <tr>
                <td class="formLabel" align="right" style="padding-right:5px; line-height:20px;">Password</td>
                <td class="formField">
                    <input type="password" name="txt_password" maxlength="50" style="width:140px;" value="" />
                </td>
               </tr>
               <tr>
                <td></td>
                <td class="formField" style="padding-left:5px; height:30px;">
                  <input type=submit name=login value="Log In" onclick="doc_onSubmit(this.form);" style="width:140px;">
                </td>
               </tr>
             </table>
            
	<?
		while ($action = each($_POST))
		{
				echo "<input type=hidden name=\"",htmlspecialchars($action[0]),"\" value=\"",htmlspecialchars($action[1]),"\">";
		}
	?>
	<? echo $id_post; ?>

	<tr>
	  <td align=center>
		  <input type="checkbox" name="remember_me" value="">&nbsp;&nbsp;<B>Remember my ID on this computer</B>
	  </td>
	</tr>
	<script language=JavaScript>doc_onLoad();</script>
	</form>
	</table>
<br>
	<a href="javascript:open_window()">Forgot your username or password ?</a>
    <br><br><br><br>
	<font size=2 text='vcerdana'><B>"This is a secure site, all access is monitored. <br>Invalid login attempts will record your IP address."</B></font>
    <br><br><br><br><br><br><br>
	</div>
	</td>
   </tr>
  </table>
 <script>

   function open_window()
   {
	 window.open("<?echo $popupwindow?>/forget_password.php?id=<?=$id?>","ForgetPassword","toolbar=no,directories=no,resize=yes,menubar=no,location=no,scrollbars=yes,width=600,height=200,maximize=null,top=70,left=80");
   }
 </script>

<?
	include($subDir.'footer.php');
	exit;
}
?>