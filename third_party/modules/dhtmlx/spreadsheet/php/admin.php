<?php
	require_once('auth.php');
	if (User::check_cookie() === true) {
		if (isset($_GET['logout'])) {
			User::logout();
		}
	}
	$error = false;
	$login = "";
	if (isset($_POST["username"])) {
		$username_in = $_POST["username"];
		if (isset($_POST["password"])) {
			$password_in = $_POST["password"];
		} else {
			$error = "Incorrect registration information";
		}
		if (User::check_user($username_in, $password_in) == true) {
			User::login($username_in, $password_in);
			header('Location: admin.php');
			die();
		} else {
			$error = "Incorrect login/password";
		}
	}
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
	<title></title>
	<link rel="STYLESHEET" type="text/css" href="../dhtmlxgrid.css">
	<link rel="stylesheet" type="text/css" href="../skins/dhtmlxgrid_dhx_skyblue.css">
	<script src="../dhtmlxcommon.js"></script>
	<script src="../dhtmlxgrid.js"></script>
	<script src="../dhtmlxgridcell.js"></script>
</head>
<style>
	.main_app {
		width: 1024px;
		margin: 0px auto;
	}
	#sheets_list, .preview_cont {
		width: 500px;
		height: 350px;
		background-color:white;
		float: left;
	}
	.logo {
		font-size: 16px;
		font-family: Tahoma;
		font-weight: bold;
		display: block;
		float: left;
		padding-top: 4px;
	}

	.preview_btn {
		width: 100%;
		height: 16px;
		cursor: pointer;
		background-image: url('../imgs/true.gif');
		background-position: center center;
		background-repeat: no-repeat;
	}
	.remove_btn {
		width: 100%;
		height: 16px;
		cursor: pointer;
		background-image: url('../imgs/logout.gif');
		background-position: center center;
		background-repeat: no-repeat;
	}
	.logout_btn {
		background-image: url('../imgs/logout.gif');
		background-position: left center;
		background-repeat: no-repeat;
		background-color: transparent;
		border: none;
		padding-left: 18px;
		padding-right: 18px;
		cursor: pointer;
		height: 26px;
		position: relative;
		float: right;
	}
	.clear {
		clear: both;
}
	html, body {
		padding: 0px;
		margin: 0px;
		height: 100%;
		text-align: center;
		font-family: Tahoma;
		font-size: 12px;
	}

	div.login_form {
		border: 1px solid #cccccc;
		background-color: #eeeeee;
		width: 300px;
		height: 200px;
		margin: auto auto;
		position: relative;
		-moz-border-radius: 15px;
		border-radius: 15px;
	}

	div.login_form label {
		display: block;
		width: 100px;
		float: left;
		text-align: right;
		padding-right: 10px;
		padding-top: 4px;
	}

	div.login_form input {
		display: block;
		float: left;
		width: 140px;
		font-family: Tahoma;
		font-size: 12px;
	}

	div.login_form div.line {
		height: 24px;
	}

	div.login_form div.submit {
		height: 30px;
		padding-top: 10px;
	}

	div.login_form div.error {
		height: 40px;
		padding: 0px;
		margin: 0px;
		text-align: center;
	}

	div.login_form div.error_none {
		visibility: hidden;
		height: 40px;
	}

	div.login_form div.error_msg {
		border: 1px solid #ff0000;
		background-color: #efbdbd;
		width: 260px;
		padding: 4px;
		margin: 0px auto;
	}
</style>


<?php
	/*! Show login form if user isn't logged and admin panel if he's logged
	 */
	if ((!User::check_cookie())||(isset($_GET['logout']))) {
?>
<body onload="doOnLoad();">
	<script>
		function doOnLoad() {
			var top = (document.body.clientHeight - 200)/2;
			document.getElementById("login_form").style.top = top + "px";
			document.getElementById("username").focus();;
		}
	</script>
	<div class="login_form" id="login_form">
		<form method="post">
			<div class="line"></div>
			<div class="line <?php echo (($error != false) ? "error" : "error_none"); ?>">
				<div class="error_msg"><?php echo $error; ?></div>
			</div>
			<div class="line">
				<label for="username">Login:</label>
				<input type="text" name="username" id="username" value="<?php echo $login; ?>" />
			</div>
			<div class="line">
				<label for="password">Password:</label>
				<input type="password" name="password" id="password" value="" />
			</div>
			<div class="line submit">
				<label></label>
				<input type="submit" name="login" value="Log In" />
			</div>
		</form>
	</div>
</body>
<?php
	} else {
?>
<script src="../spreadsheet.php?sheet=1&parent=preview_cont"></script>
<body>
	<div class="main_app">
		<span class="logo">SpreadSheet admin panel</span>
		<input type="button" value="Log out" class="logout_btn" onclick="logout();" /><br>
		<div class="clear"></div>
		<div id="sheets_list"></div>
		<div id="preview_cont" class="preview_cont"></div>
	</div>
	<script>
		var sheets = new dhtmlXGridObject("sheets_list");
		sheets.setImagePath("./imgs/");
		sheets.setHeader("Sheet id,Rows,Columns,Key,Preview sheet,Remove sheet");
		sheets.setInitWidths("60,60,60,100,100,100")
		sheets.setColAlign("center,center,center,left,center,center")
		sheets.setColTypes("ro,ro,ro,ed,ro,ro");
		sheets.setSkin("dhx_skyblue")
		sheets.init();
		sheets.load("admin_connector.php", "json");
		dp = new dataProcessor("admin_connector.php?edit=true");
		dp.enablePartialDataSend(true);
		dp.init(sheets);

		function removeSheet(sheet) {
			if (confirm("Sheet '" + sheet + "' will be deleted. Do you want to continue?")) {
				dhtmlxAjax.get("admin_connector.php?action=remove&sheet=" + sheet, function() {
					sheets.deleteRow(sheet);
					dhx_sh.clearAll();
				});
			}
		}

		function previewSheet(sheet) {
			var key = sheets.cells(sheet, 3).getValue();
			dhx_sh.load(sheet, key);
		}

		function logout() {
			if (confirm("Do you want to quit?")) {
				window.location.href = "admin.php?logout=true";
			}
		}
	</script>
</body>
<?php
	}
?>
</html>