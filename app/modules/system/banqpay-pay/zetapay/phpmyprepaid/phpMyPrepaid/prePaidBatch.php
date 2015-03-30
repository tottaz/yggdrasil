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




//printf('<form action="index.php?site=generiereprePaidMehrfach"method="post">');
printf('<form  name="center" id="center" action="index.php?site=genPrePaidMulti"method="post">');

echo('<table STYLE="width: 500px">');
echo "<tr>";
echo('<td colspan=2><h2>Timed Card Creation</h2></td></tr><tr>');
echo('<td class="fieldcell">');
//echo "<td width=150>";
// English by CP
echo('<p>How many tickets would you like?</p></td>');
echo('<td class="fieldcell" STYLE="text-align: left">');



echo('<input type=text size=5 class="text" name=\'AnzahlSeiten\' id="name" tabindex="1" STYLE="width: 50px">');
echo "</td></tr><tr>";
echo('<td class="fieldcell"');

// English by CP
echo "<p>How long are the accounts good for?</p></td>";
echo('<td class="fieldcell" STYLE="text-align: left">');

$elements = array(
    array('name' => '30  Minutes', 'value' => '1800'),
    array('name' => '60  Minutes', 'value' => '3600'),
    array('name' => '120 Minutes',  'value' => '7200')
);

foreach ($elements as $element) {
    printf('<input type="radio" name="zeit" value="%s" %s/> %s<br />',
        $element['value'],
        (isset($_REQUEST['zeit']) and $_REQUEST['zeit'] == $element['value']) ? 'checked="checked" ' : '',
        $element['name']);
}

echo "</td>";
echo "</tr>";
echo('<tr><td></td>');
echo('<td class="fieldcell"');
printf('<center><input type="submit" name="Erzeugen" value="CREATE CARDS"/></center></td></tr>');
echo "</table>";
echo '</form>';

?>
