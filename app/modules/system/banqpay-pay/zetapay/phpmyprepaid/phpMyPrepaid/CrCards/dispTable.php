<?php
	print('<table border="1">');
	print('<tr><td>Username</td><td>Password</td><td>Good For</td></tr>');
	      foreach($UserPass as $id => $pass ) {
	               echo("<tr><td><b>"), ($id), ("</b></td><td><b>"),
	               ($pass), ("<td><b>"), ($min), ("</b></td>"), ("</tr>");
	}
?>
										    
