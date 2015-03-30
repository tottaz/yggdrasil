<?php
	//////////////////////////////////////////////////////////////////////////		
	//	File written by Carl Peterson including part of function 	//
	//	mkPassword by Max Dobbie-Holman					//
	//	Released under the GPL						//
	//	This file creates the username/password combos			//
	//	This file is a hack to get arround redclaired functions.	//
	//	If you can think of a better way of doing this, let me know.	//
	//////////////////////////////////////////////////////////////////////////


	//////////////////////////////////////////////////////////////////////////
	//	LOOP AS MANY TIMES AS $number FROM CARD CREATION		//
	//////////////////////////////////////////////////////////////////////////
	for ($i=0;$i < $number;$i++)
        	{
        	for ($j=0;$j<1;$j++) // ------> CLEAN ME
                {

	
	//////////////////////////////////////////////////////////////////////////
	//	CREATE A RANDOM ID CONSISTING OF 6 LETTERS AND A NUMBER		//
	//////////////////////////////////////////////////////////////////////////
	
	$consts='bcdgklmnprst';
        $vowels='aeiou';
	$num= (mt_rand(5, 15));
	for ($x=0; $x < 6; $x++) {
		$const[$x] = substr($consts,mt_rand(0,strlen($consts)-1),1);
                $vow[$x] = substr($vowels,mt_rand(0,strlen($vowels)-1),1);
	}
	$ID = ($const[0] . $vow[0] .$const[2] . $const[1] . $vow[1] . $const[3] . $num);

	//////////////////////////////////////////////////////////////////////////
	//		CREATE A RANDOM PASSWORD OF EIGHT LETTERS		//
	//////////////////////////////////////////////////////////////////////////

	$consts='bcdgklmnprst';
	$vowels='aeiou';

	for ($x=0; $x < 6; $x++) {
	//	mt_srand ((double) microtime() * 1000000); // no longer required
		$const[$x] = substr($consts,mt_rand(0,strlen($consts)-1),1);
		$vow[$x] = substr($vowels,mt_rand(0,strlen($vowels)-1),1);
	}
	$PASS = ($const[0] . $vow[0] .$const[2] . $const[1] . $vow[1] . $const[3] . $vow[3] . $const[4]);

	//////////////////////////////////////////////////////////////////////////
	//		ADD THE USERNAME AND PASSWORD TO AN ARRAY		//
	//	We cheat here and use the username as the key and the value	//
	//	as the password.  This has the added benifit of ensuring that	//
	//	they get all unique usernames although they would end up with	//
	//	a card less then they ordered.  We still need to error check	//
	//	the usernames and passwords to make sure they don't already 	//
	//	exist in the database.
	//////////////////////////////////////////////////////////////////////////
	
	$UserPass[$ID] = $PASS;	
	


	}
}
?>
