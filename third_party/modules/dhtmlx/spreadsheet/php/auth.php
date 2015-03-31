<?php

class User {

	static function check_cookie() {
		require("config.php");
		if ((isset($_COOKIE["qb_login"]))&&(isset($_COOKIE["qb_password"]))) {
			$login_c = $_COOKIE["qb_login"];
			$password_c = $_COOKIE["qb_password"];
			if (($login_c == $username)&&(md5($password) == $password_c)) {
				return true;
			}
		}
		return false;
	}

	static function check_user($login_c, $password_c) {
		require("config.php");
		if (($login_c == $username)&&($password == $password_c)) {
			return true;
		}
		return false;
	}

	static function login($login, $password) {
		setcookie("qb_login", $login, time()+60*60*24*7);
		setcookie("qb_password", md5($password), time()+60*60*24*7);
	}

	static function logout() {
		setcookie("qb_login", "", time() - 3600);
		setcookie("qb_password", "", time() - 3600);
	}

}

?>