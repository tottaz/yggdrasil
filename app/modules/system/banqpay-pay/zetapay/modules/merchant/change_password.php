<form name="frm_changepass" method="post" action="<?echo $formaction;?>">

<table border="0" cellspacing="0" align=center cellpadding="0" width="100%">
<tr valign="top"><td width="100%">
<?
$loginid = $_SESSION['loginid'];

if(isset($_REQUEST['passbutton']) && $_REQUEST['passbutton']=='Change Password' && $isTokenValid)
 {
 	  $current_pass=md5($base->input['currentpass']);
	  $new_pass=md5($base->input['re_newpass']);

	  $select="select loginid,email,change_pwd_flag from ".TBL_SYSTEM_USER_DETAIL."  where password='$current_pass' and loginid='".$loginid."' and active='Y'";
	  $rs_select = $zetadb->Execute($select);

	  $to=$email;
	  $subject="Your Changed Password";
	  $msg="Your Password Has Been Changed.\r\n The New Password is : ".$base->input['re_newpass'];

	  if($rs_select->fields[0] != "")
	  {			
	  	 if(changePassword($new_pass, $loginid))
		 {
	  	  	if($rs_select->fields[change_pwd_flag]==1)
			 {
 				$update="update ".TBL_SYSTEM_USER_DETAIL."  set change_pwd_flag=0 where loginid='".$loginid."' and active='Y'";
			    $rs_update = $zetadb->Execute($update);

				$_SESSION['msg_change_pass_status']="Your Password Has Been Changed,Please Login Again";
				$_SESSION['change_ur_pass']="";
				?><script>window.location.href="logout.php?chg_pass=y"</script><?
			 }
		    else
			 {
				$_SESSION['msg_change_pass_status']="<span class='successmsg'>Password Changed Successfully.</span>";
		  	    //@mail($to,$subject,$msg);
			 }

		  }
		  else
		  {		  	
	  	  	$_SESSION['msg_change_pass_status']="<span class='errormsg'>Error: Password not modified.</span>";
	  	  }

	  }
	  else
	  {
	  	  	  $_SESSION['msg_change_pass_status']="<span class='errormsg'>The current password entered is incorrect</span>";
	  }  

 }
?>

<table width="100%" align="center">
	<?
	//$_SESSION['change_ur_pass']="";
//}

if($_SESSION['msg_change_pass_status']!="")
 {
?>
<tr valign="top" ><td>
 <table width="100%" align="left">
		<tr>
			<td align="left"><? echo $_SESSION['msg_change_pass_status']?></td>
		</tr>
	</table>
</td></tr>
<?
}
$_SESSION['msg_change_pass_status']="";
?>

	<tr>
		<td class="subtitle" height="28">Password Change</td>
	</tr>
</table>
</td></tr>

<?
//if($_SESSION['change_ur_pass']!="")
//{
 ?>

 <!-- <table width="100%" align="left">
		<tr>
			<td class="subtitle" height="28" color="blue" align=center><? echo $_SESSION['change_ur_pass']?></td>
		</tr>
 </table>
 -->
 
<tr valign="top" height="130"><td>
<table width="100%"  class="outerTable" align=center border=0>
<tr>
    <td class="formLabel" width="15%">Current Password</td>
    <td colspan="3" class="formFieldRequired" width="85%" style="padding-left:15px;" >
      <input type="password" name="currentpass" id="currentpas" maxlength="25" class="inputMed" value=""/>
    </td>
 </tr>
  <tr>
    <td class="formLabel" >New Password</td>
    <td colspan="3" class="formFieldRequired" style="padding-left:15px;" >
      <input type="password" name="newpass" id="newpass" maxlength="25" class="inputMed" value="" />
    </td>
  </tr>
  <tr>
    <td class="formLabel">Confirm New Password</td>
    <td colspan="3" class="formFieldRequired" style="padding-left:15px;" >
      <input type="password" name="re_newpass" id="re_newpass" maxlength="25" class="inputMed" value=""/>
    </td>
  </tr>
</table>
</td></tr>
<tr valign="top"><td>
<table width="100%" border="0">
  <tr>
   <td  align=right>
      <input type="submit" name="passbutton" id="passbutton" class='inputBtnMed' value="Change Password" onclick="return check_pass()"/>
    </td>
  </tr>
</table>
</td></tr>
</table>
</form>
</body>
<script>
 
function check_pass()
{
	 if(document.frm_changepass.currentpass.value=="")
	 {
		 alert("Please Enter the Current Password");
		 document.frm_changepass.currentpass.focus();
		 return false;
	 }
	 if(document.frm_changepass.newpass.value=="")
	 {
		 alert("Please Enter the New Password");
		 document.frm_changepass.newpass.focus();
		  return false;
	 }
	 if(document.frm_changepass.re_newpass.value=="")
	 {
		 alert("Please Retype the New Password");
		 document.frm_changepass.re_newpass.focus();
		  return false;
	 }
//	 alert(document.frm_changepass.newpass.value+" "+document.frm_changepass.re_newpass.value);
	 if(document.frm_changepass.newpass.value!=document.frm_changepass.re_newpass.value)
	 {
		 alert("Password Mismatch");
		 document.frm_changepass.re_newpass.focus();
		  return false;
	 }

 return true;
}

</script>

