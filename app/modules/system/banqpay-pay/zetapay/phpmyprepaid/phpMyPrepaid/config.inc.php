<?php

/*  dhalbe-Admin - a webbased application for simplifying working with 
    a Free-Radius server and an MySQL as Backend-Database. Common tasks
    are generating prePaid accounts / cards in various formats, designing
    layout of printable cards and much more.
    
    Copyright (C) 2004	dhalbe-Admin Project  
    Copyright (C) 2004  Michael Conrad (unreallity@users.sourceforge.net),
    Copyright (C) 2004  Christian Roedel (evilgenius13@users.sourceforge.net)
    Copyright (C) 2004  Carl H. Peterson (petecarlson@cpete.com)	
	
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
/*
   Changes by Carl Peterson
   Copyright (C) 2004 Carl Peterson
   All changes released under the GPL as above
   You Need to put dbconnect outside of the document root and reference its location.
   This is for your safety as the username and pass are in clear text.
*/

include('dbconnect.php'); // the DB connection script.

$maintext = "<h2>PHP-my-Prepaid</h2><br>"; // under the logo on site main
$version = "version 0.1.3RC1";             // Version number
$indexTitle="phpMyAdmin Open Sorce GUI for generating radius PREPAID";
$indexTitleColor="#000066";
$indexMainTextColor="#000066";
$Banner = "images/banner.png"; // LP added this
$Logo = "images/logo.png";
$addcr = 1;  // <---Change to 1 to show CrDate field.  Requires additional field in DB.
$showSettings = 0; // <---- Change to 1 to show settings menu.  Soon gone 
$max = 100; // <-- maximum cards created at one time. 
$time1 = 1800;  // <-- card 1 time in seconds. Not yet implimented for everything
$time2 = 3600;  // <-- card 2 time in seconds. Some time is still hard coded
$time3 = 7200;  // <-- card 3 time in seconds. I will continue to move it over.  CP 
$mintime = $time1; // <-- Minimum time sold
$maxtime = $time3; // <-- Maximum time sold
	
?>