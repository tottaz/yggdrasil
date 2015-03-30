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

if(isset($_POST['print1'])) { $qwprint =1;}
if(isset($_POST['print2'])) { $qwprint =1;}
if(isset($_POST['print3'])) { $qwprint =1;}

if(isset($qwprint)) {
	include('genPrePaidMulti.php');
	}

			
	
$card1 = $time1/60;
$card2 = $time2/60;
$card3 = $time3/60;



//printf('<form action="index.php?site=generiereprePaidMehrfach"method="post">');


echo('<table STYLE="width: 100px">');
echo "<tr>";
	echo('<td><h2>Quick Print</h2></td>');
echo('</tr><tr>');
	echo('<td class="fieldcell">');
	printf('<form  name="center" id="center" action="index.php?site=main"method="post">');
	printf('<input type="hidden" name="print1" value="print1">');
	printf('<center><input type="submit" name="print1" value="');
	echo("$card1");
	printf(' Min"/></center></td></tr>');
	echo '</form>';
	echo('</td>');
echo('</tr><tr>');
	echo('<td class="fieldcell">');
	printf('<form  name="center" id="center" action="index.php?site=main"method="post">');
	printf('<input type="hidden" name="print2" value="print2">');
	printf('<center><input type="submit" name="print2" value="');
	echo("$card2");
	printf(' Min"/></center></td></tr>');
	echo '</form>';
	echo('</td>');
echo('</tr><tr>');
	echo('<td class="fieldcell">');
	printf('<form  name="center" id="center" action="index.php?site=main"method="post">');
	printf('<input type="hidden" name="print3" value="print1">');
	printf('<center><input type="submit" name="print3" value="');
	echo("$card3");
	printf(' Min"/></center></td></tr>');
	echo '</form>';
	echo('</td>');
echo('</tr>');
if(isset($qwprint)) { 
	echo('<tr><td class="fieldcell">');
	echo '<a href="cards.ppc"><img src="images/ppc-32.png" title="Download and auto-print .ppc file" border=0></a></p>';
	
}

echo "</table>";

?>
