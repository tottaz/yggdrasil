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
    PageRank Checker for Joomla
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
Version 2.5
Created date: April 2010
Creator: Urmila Champatiray
Email: admin@joomlaseo.org
*/

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );
JToolBarHelper::title( JText::_( 'Page Rank Checker' ), 'generic.png' );
?>

PageRank Checker for Joomla<br />
Version 2.5 <br />
Created date: April 25 2010<br />
Date Updated: September 10 2010<br />
Creator: Urmila Champatiray<br />
Email: admin@joomlaseo.org<br />
Website: <a href="http://www.joomlaseo.org" target="_blank">http://www.joomlaseo.org</a><br />
<H1><IMG SRC="components/com_pagerankchecker/images/logo.jpg" ALT="Thanks for Using Our Component"></H1><br /><br />
<table>
<tr>
<th>
<h2> Get Yahoo and Google API's from the links given below. Follow these links to register your site and get an API.</h2></th></tr>
<tr>
<th><H2 >GET YAHOO API</H2></th>
<td><a href="http://developer.yahoo.com/search/siteexplorer/V1/inlinkData.html" target="_blank"><IMG SRC="components/com_pagerankchecker/images/yapi.jpg" ALT="Click to get Yahoo API"></a></td></tr>
<tr>
<th>
<H2 >GET Google API</H2></th>
<td>
<a href="http://code.google.com/apis/ajaxsearch/signup.html" target="_blank"><IMG SRC="components/com_pagerankchecker/images/gapi.jpg" ALT="Click to get Google API"></a></td></tr>
<tr>
<th>
<H2 >For Technorati API follow this link</H2>
</th>
<td>
<a href="http://technorati.com/developers" target="_blank"><IMG SRC="components/com_pagerankchecker/images/tech.jpg" ALT="Get Technorati API"></a>
</td>
</tr>
</table>
<h2> After getting the API's for your Site enter the API's in respective fields inside COMPONENT parameter in the Menu Settings.</h2>
<H2>Kindly Vote for the Component if you liked it<a href="http://extensions.joomla.org/extensions/site-management/ranks/12348" target="_blank"><IMG SRC="components/com_pagerankchecker/images/clicktovote.jpg" ALT="Click to Vote"></a></H2><br />
<h2><a href="http://www.google.com/recaptcha" target="_blank">Get your Public and Private API Key for Recaptcha </a></h2><br />
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
?><?php

	echo '<h2>To Use this component create a menu item linking to this component</h2>';

?>