<?php
	// ---> CLEAN ME  Need to look into one big insertion
	//                ATOMIC???
foreach($UserPass as $id => $pass ) {
	$q0= "INSERT INTO radcheck (UserName , Attribute, op, Value) VALUES('$id','User-Password',':=','$pass')";
	$insert0 = mysql_query($q0) or die(mysql_error());
	$q1= "INSERT INTO radcheck (UserName , Attribute, op, Value) VALUES('$id','Simultaneous-Use',':=','1')";
	$insert1 = mysql_query($q1) or die(mysql_error());
	$q2= "INSERT INTO radcheck (UserName , Attribute, op, Value) VALUES('$id','Max-All-Session',':=','$sec')";
	$insert2 = mysql_query($q2) or die(mysql_error());
}
	//------------> END database insertion
