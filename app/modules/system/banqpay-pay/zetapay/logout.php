<?
		session_start();
	 	require('config.php');
		require('zetapay/core/include/common.php');
        require_once($rootDir.$subDir.'core/include/qpay_base.php');
    
        $base = new qpay_base();

	    if($base->input['chg_pass']=='y')
		   $_SESSION['msg_login']="Your Password Has Been Changed";
		else
		   $_SESSION['msg_login']="";

		$zetadb->Execute("UPDATE ".TBL_SYSTEM_USER_DETAIL."  SET suid='xxx".uniqid('')."' WHERE suid='".$_SESSION[suid]."'");
		$zetadb->Execute("DELETE FROM ".TBL_SYSTEM_VISITORS." WHERE ip='$userip'");
		
		$duplicate_user_msg=$_SESSION['duplicate_user_msg'];
		session_destroy(); //Will clear all session data
		$_SESSION['duplicate_user_msg']=$duplicate_user_msg;
		
		// header("location:index.php");


?>
<script>window.location.href="index.php"</script>