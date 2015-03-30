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



// Hauptseite index.php speichern
$designID="index";

$attribute="indexTitle";
$value=$_POST['indexTitle'];

$q1 = "DELETE FROM dhalbe_Print_Design  WHERE Design = '$designID' AND Attribute = '$attribute'";
$q2 = "INSERT INTO dhalbe_Print_Design (Design , Attribute, op, Value) VALUES ('$designID','$attribute','=','$value')";
mysql_query($q1);
mysql_query($q2);

$attribute="indexMainText";
$value=$_POST['indexMainText'];

$q1 = "DELETE FROM dhalbe_Print_Design  WHERE Design = '$designID' AND Attribute = '$attribute'";
$q2 = "INSERT INTO dhalbe_Print_Design (Design , Attribute, op, Value) VALUES ('$designID','$attribute','=','$value')";
mysql_query($q1);
mysql_query($q2);
      

// unhash by CP
mysql_query("INSERT INTO dhalbe_Print_Design (Design , Attribute, op, Value) VALUES('index','indexTitle',':=','$indexTitleSave'",$link);
// end unhash

echo "<center><br><br>Gespeichert !!! <br><br> <a href='index.php?site=admin'>zur Administration zur&uumlck";

?>
