<?
	session_start();
	if($_SESSION['admin_suid']){$admin_suid = $_SESSION['admin_suid'];}
	if (file_exists("install.php")){
  		header("Location: install.php");
  		exit;
	}
	if (file_exists("install_inc.php")){
		echo "Please Delete all install files before continuing<br>Thank You\n";
		exit;
	}

	chdir('..');
	require('src/common.php');

	if ( authcheck() ){
		($userip = $_SERVER['HTTP_X_FORWARDED_FOR']) or ($userip = $_SERVER['REMOTE_ADDR']);
		$admin_suid = substr( md5(date("my").$superpass), 8, 16 );
		$_SESSION['admin_suid'] = $admin_suid;
		mysql_query("UPDATE zetapay_users SET lastlogin=NOW(),lastip='$userip',admin_suid='$admin_suid' WHERE id=3");
		include("admin/daily.php");
?>
		<HEAD>
		<TITLE><?=$sitename?> Administration</TITLE>
		</HEAD>

		<FRAMESET framespacing="0" border="0" frameborder="0" ROWS="40,21,*">
		<FRAME NAME="top" SCROLLING="no" NORESIZE SRC="./top.php" style="border-bottom: #FFFFFF 1px solid;">
		<FRAME NAME="menu" SCROLLING="no" NORESIZE SRC="./menu.php">
		<FRAMESET framespacing="0" border="0" frameborder="0" cols="100%">
			<frame name="right" src="main.php?admin_suid=<?=$admin_suid?>">
		</FRAMESET></FRAMESET>
<?
		exit;
	}
	include("admin/login.php");

	function authCheck(){
		global $superpass,$use_iplogging,$licensekey;
		$phpver = phpversion();
		if(substr(phpversion(), 2, 1) > 0) {
			$ip = $_SERVER['SERVER_ADDR']; 
			$host = $_SERVER['HTTP_HOST'];
			$server = $_SERVER['SERVER_NAME'];
		}else {
			$ip = $HTTP_SERVER_VARS['SERVER_ADDR'];
			$host = $HTTP_SERVER_VARS['HTTP_HOST'];
			$server = $HTTP_SERVER_VARS['SERVER_NAME'];
		}
        ($userip = $_SERVER['HTTP_X_FORWARDED_FOR']) or ($userip = $_SERVER['REMOTE_ADDR']);
		list($adm_login) = mysql_fetch_row(mysql_query("SELECT username FROM zetapay_users WHERE id=3"));
		if ($_POST['username'] == $adm_login && $_POST['password'] == $superpass){
			if($use_iplogging){
				mysql_query("INSERT INTO zetapay_logins SET user='3',date=NOW(),ipaddress='$userip'") or die( mysql_error() );
			}
			return 1;
		}else{
//			include_once("admin/revue.php");
		}
	}
?>