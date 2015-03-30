<?php
// File written by Carl Peterson including function
// mkPassword by Max Dobbie-Holman
// Released under the GPL
// This file creates the username/password combos



// creates a random ID
function mkUser() {
	$consts='bcdgklmnprst';
        $vowels='aeiou';
	$num= (mt_rand(5, 15));
	for ($x=0; $x < 6; $x++) {
		$const[$x] = substr($consts,mt_rand(0,strlen($consts)-1),1);
                $vow[$x] = substr($vowels,mt_rand(0,strlen($vowels)-1),1);
	}
	return $const[0] . $vow[0] .$const[2] . $const[1] . $vow[1] . $const[3] . $num;
}        
//$ID = mkUser();  // required for multi-cards to keep functions out of functions
// creates a random password
function mkPasswd() { // (C) Max Dobbie-Holman <max@blueroo.net> released under the GPL

	$consts='bcdgklmnprst';
	$vowels='aeiou';

	for ($x=0; $x < 6; $x++) {
	//	mt_srand ((double) microtime() * 1000000); // no longer required
		$const[$x] = substr($consts,mt_rand(0,strlen($consts)-1),1);
		$vow[$x] = substr($vowels,mt_rand(0,strlen($vowels)-1),1);
	}
	return $const[0] . $vow[0] .$const[2] . $const[1] . $vow[1] . $const[3] . $vow[3] . $const[4];

}
//$PASS = mkPasswd();  // required for multi-cards to keep functions out of functions
?>
