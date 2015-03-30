<?php

/*  dhalbe-Admin - a webbased application for simplifying working with 
    a Free-Radius server and an MySQL as Backend-Database. Common tasks
    are generating prePaid accounts / cards in various formats, designing
    layout of printable cards and much more.
    
    Copyright (C) 2004	dhalbe-Admin Project  
    Copyright (C) 2004  Michael Conrad (unreallity@users.sourceforge.net),
    Copyright (C) 2004  Christian Roedel (evilgenius13@users.sourceforge.net)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
*/
include('TotalCounter.php');
// -----------> This is the default gooey center
echo "<center>";
echo '<table border="1">';
	echo '<tr>';
	echo "<td width=30>";
	echo"</td>";
	echo '<td width=150 align = center>';
		
		echo($maintext); //set in config.inc.php
		echo($version);  //set in config.inc.php 
		echo "<img  src='$Logo' vspace='10' hspace='20'>";


	echo '</td>';
	echo '<td>';
	include('rightbar.php');
	echo '</td>';
	echo '</tr>';
	echo '<tr><td>';  
	echo '</td><td>'; print('Users Have used '); echo(round($hour)); print('Hours to Date');
	echo '</td><td>';
	echo '</td>';
	echo '<tr><td colspan="2">
	Quick Print PPC file requires a client app to process and send it to a printer.</td></tr>';
echo '</table>';
?>
