<?php

/*
Copyright (C)  2010 Urmila Champatiray.
    Permission is granted to copy, distribute and/or modify this document
    under the terms of the GNU Free Documentation License, Version 1.3
    or any later version published by the Free Software Foundation;
    with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.
    A copy of the license is included in the section entitled "GNU
    Free Documentation License"
	@license GNU/GPL http://www.gnu.org/copyleft/gpl.html
    Keyword Rank Checking for Joomla
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
Version 1.0
Created date: September 2010
Creator: Urmila Champatiray
Email: admin@joomlaseo.org
*/

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>

Yahoo Keywords Rank Checker<br />
Version 1.0<br />
Created date: September 15 2010<br />
Date Updated: September 15 2010<br />
Creator: Urmila Champatiray<br />
Email: admin@joomlaseo.org<br />
Website: <a href="http://www.joomlaseo.org" target="_blank">http://www.joomlaseo.org</a><br />
<H1 ALIGN=center><IMG SRC="components/com_keywordsrankchecker/images/logo.jpg" ALT="Thanks for Using Our Component"></H1>
<h2>Create a Menu Item to access the Keywords Rank Checker.</h2><br /> 
<h2>This extension requires certain PHP functions, which if disabled from control panel by your service provider, it wont let this component work properly. So also check in your php.info file whether any functions are disabled. For any help you can reach me at urmila.ray@hotmail.com</h2>
<H2 ALIGN=center><a href="http://extensions.joomla.org/extensions/site-management/ranks/12681"><IMG SRC="components/com_keywordsrankchecker/images/clicktovote.jpg" ALT="Click to Vote"></a></H2>

<br />
<?php
if(date("Y") < 2011)
{
	echo '<h1><a href="http://www.joomlaseo.org" target="_blank">Check for New Version</a></h1>';
}
else
{
	echo '<h1><a href="http://joomlaseo.org" target="_blank">Free Website Tips</a></h1>';
}

?>