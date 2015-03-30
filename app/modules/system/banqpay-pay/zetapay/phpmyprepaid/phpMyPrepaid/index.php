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

	include("config.inc.php"); 

	/////////////////////////////////////////////////////////////////////
	//			HEADER INFORMATION			   //
	//      Copyright (C) 2004  dhalbe-Admin Project                   //
        //      Copyright (C) 2004  Michael Conrad                         //
        //      Copyright (C) 2004  Christian Roedel                       //
        /////////////////////////////////////////////////////////////////////

	/////////////////////////////////////////////////////////////////////
	// This is all going into a style sheet as soon as this project	   //
	//  makes enough money to pay Lars (my brother) to do it.  You	   //
	//  could also do it for the good or pay Lars yourself.		   //
	//  I could also just kick his butt and make it do it as he is 	   //
	//  my little brother...					   //
	/////////////////////////////////////////////////////////////////////

include ("head.php"); //  This includes the doctype, stylesheet, and favicon declarations.  
echo '<body>';
echo '<center>';
echo '<font face="$indexFont">';
// ------> END HEADER INFORMATION

// ------> THE CENTER OF THE PAGE IS INCLUDED HERE
if(isset($_GET['site'])) {$site =$_GET['site'];}  // Add new links to menu section


echo('<table class="pageLayout">');
echo("<tr>");
        echo("<td valign= 'top' height=80 colspan=2>");
	echo("<a href='index.php?site=main' target='_self'><img src='$Banner' border=0 title='Return to PHPMP Home'></a>");
	echo("</td>");
	echo("</tr>");
			
echo("</tr>");
echo("<tr>");


// ---> Begining of the menu
echo "<td valign='top' width='120'>";
	echo('<table width=118 height=\'598\' BORDER=0 CELLSPACING=5 CELLPADDING=5 class="leftcell"><tr><td valign=\'top\'>');
echo "<font size='2'>";
	echo"<a href='index.php?site=main' target='_self'>Home</a><br>";
	echo "<hr />";




	// Card Creation Menu
	echo "Create Cards:";  // English By CP
	
	printf('<form action="index.php?site=prePaidBatch"method="post">');
        printf('<input type="submit" class="leftButton" name="sortname" value="Timed Cards">');
	printf('</form>');	

	printf('<form action="index.php?site=prePaidMultiDay"method="post">');
        printf('<input type="submit" class="leftButton"  name="sortname" value="Daily Cards">');
	printf('</form>');

	echo "<hr />";
	
	// -------> Reporting Menu Added by CP
	echo "Display Cards:";
	
        printf('<form action="index.php?site=UnusedCards"method="post">');
        printf('<input type="submit"  class="leftButton"  name="sortname" value="Un-Used Cards">');
	printf('</form>');

        printf('<form action="index.php?site=PartialUsed"method="post">');
        printf('<input type="submit"  class="leftButton"  name="sortname" value="Partialy Used">');
	printf('</form>');	

	printf('<form action="index.php?site=UsedCards"method="post">');
        printf('<input type="submit"  class="leftButton"  name="sortname" value="Used Cards">');
	printf('</form>');

	printf('<form action="index.php?site=AllCards"method="post">');
        printf('<input type="submit"  class="leftButton"  name="sortname" value="All Cards">');
	printf('</form>');

	echo "<hr />";
	// --------> Settings menu <------ I haven't worked with this yet
	

echo "</font>";

echo "</td></tr></table>";
echo "</td>";
// <---End of menu


// Include Area
echo "<td valign='top' align='left'>";
echo "<table border=0 cellpadding=0 cellspacing=10>";
echo "<tr><td>";

if (!isset($site)) { $site="./main"; }

if (file_exists($site.".html")) { include($site.".html"); }

else if (file_exists($site.".php")) { include($site.".php"); }

else { echo " <br><b><center>Error 404<br><br>That link is not yet functional</center></b><br> "; }

echo "</td></tr></table>";
echo "</td>";
echo "</tr>";
echo '</body></html>';

?>
