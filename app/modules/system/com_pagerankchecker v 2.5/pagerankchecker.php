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
    Reference taken from http://www.phpeasycode.com for certain ccodes.
	PageRank Checker for Joomla
	Version 2.5
	Created date: April 2010
	Creator: Urmila Champatiray
	Email: admin@joomlaseo.org
	support: support@joomlaseo.org
	Website: http://www.joomlaseo.org
*/

// no direct access
defined('_JEXEC') or die('Restricted access');

$urlcheck = JRequest::getVar('urlcheck');
	
$document =& JFactory::getDocument();
$document->addStyleSheet( "components/com_pagerankchecker/style.css" );
include_once("components/com_pagerankchecker/functions.php");
require_once('recaptchalib.php');
?>
<div id="PRChecker">

<div class="componentheading">Page Rank Checker</div>
<h2>Complete Rank Analysis of Website:</h2>
<h3>Please enter the full url ex. "http://www.example.com" as results will differ for "http://example.com"</h3>
<form action="<?php echo JRoute::_('index.php?option=com_pagerankchecker'); ?>" method="post" name="formGPRC" id="formGPRC" enctype="multipart/form-data">
<div class="display-center">
	<div>
		<input name="option" value="com_pagerankchecker" type="hidden" />
		<input type="text" class="urlcheck" name="urlcheck" id="urlcheck" maxlength="255" value="http://<?PHP print substr($urlcheck,7) ; ?>" size="40" />
		<table cellspacing="0" summary="Select Parameters for Checking">
		<caption>Select the checkboxes below. Maximum of 7 Parameters can be selected for Analysis</caption>
		<tr><td>Google Page Rank</td><td><input type="checkbox" name="selection[]" id="check1" value="1" onclick="setChecks(this)"></td>
			<td>Alexa Popularity </td><td><input type="checkbox" name="selection[]" id="check2" value="2" onclick="setChecks(this)"></td>
			<td>Google Backlinks as per its API </td><td><input type="checkbox" name="selection[]" id="check3" value="3" onclick="setChecks(this)"></td>
		</tr>
		 
		<tr><td>Total Google Backlinks </td><td><input type="checkbox" name="selection[]" id="check4" value="4" onclick="setChecks(this)"></td>
			<td>Alexa Backlinks </td><td><input type="checkbox" name="selection[]" id="check5" value="5" onclick="setChecks(this)"></td>
			<td>Alexa Reach Rank </td><td><input type="checkbox" name="selection[]" id="check6" value="6" onclick="setChecks(this)"></td>
		</tr>
		
		<tr><td>Site Advisor Rating </td><td><input type="checkbox" name="selection[]" id="check7" value="7" onclick="setChecks(this)"></td>
			<td>Website Worth </td><td><input type="checkbox" name="selection[]" id="check8" value="8" onclick="setChecks(this)"></td>
			<td>WOT Rating </td><td><input type="checkbox" name="selection[]" id="check9" value="9" onclick="setChecks(this)"></td>
		</tr>
		 
		<tr><td>Bing Inbound Links </td><td><input type="checkbox" name="selection[]" id="check10" value="10" onclick="setChecks(this)"></td>
			<td>Altavista Links </td><td><input type="checkbox" name="selection[]" id="check11" value="11" onclick="setChecks(this)"></td>
			<td>All the Web Links</td><td><input type="checkbox" name="selection[]" id="check12" value="12" onclick="setChecks(this)"></td>
		</tr> 
		
		<tr><td>Yahoo Indexed Pages </td><td><input type="checkbox" name="selection[]" id="check13" value="13" onclick="setChecks(this)"></td>
			<td>Total Yahoo Inlinks </td><td><input type="checkbox" name="selection[]" id="check14" value="14" onclick="setChecks(this)"></td>
			<td>Yahoo Inbound Links as per its API </td><td><input type="checkbox" name="selection[]" id="check15" value="15" onclick="setChecks(this)"></td>
		</tr>
		 
		<tr><td>Google Indexed Pages </td><td><input type="checkbox" name="selection[]" id="check16" value="16" onclick="setChecks(this)"></td>
			<td>Bing Indexed Pages </td><td><input type="checkbox" name="selection[]" id="check17" value="17" onclick="setChecks(this)"></td>
			<td>Website Thumbnail </td><td><input type="checkbox" name="selection[]" id="check18" value="18" onclick="setChecks(this)"></td>
		</tr>
		
		<tr><td>Listed in DMOZ Directory </td><td><input type="checkbox" name="selection[]" id="check19" value="19" onclick="setChecks(this)"></td>
			<td>Domain Age </td><td><input type="checkbox" name="selection[]" id="check20" value="20" onclick="setChecks(this)"></td>
			<td>Yahoo Directory</td><td><input type="checkbox" name="selection[]" id="check21" value="21" onclick="setChecks(this)"></td>
		</tr>
		<tr><td>Daily Reach </td><td><input type="checkbox" name="selection[]" id="check19" value="22" onclick="setChecks(this)"></td>
			<td>Daily Traffic Rank </td><td><input type="checkbox" name="selection[]" id="check20" value="23" onclick="setChecks(this)"></td>
			<td>Daily Page Views </td><td><input type="checkbox" name="selection[]" id="check21" value="24" onclick="setChecks(this)"></td>
		</tr>
		</table>
		 <?php
		 $params = &JComponentHelper::getParams( 'com_pagerankchecker' );
         $publickey = $params->get( 'publickey' );
         echo recaptcha_get_html($publickey);
         ?>
				
		<input type="submit" class="urlsubmit" value="Get Statistics" />
	</div>
</div>

</form>
<script type="text/javascript">
<!--
//initial checkCount of zero
var checkCount=0

//maximum number of allowed checked boxes
var maxChecks= 7

function setChecks(obj){
//increment/decrement checkCount
if(obj.checked){
checkCount=checkCount+1
}else{
checkCount=checkCount-1
}
//if they checked a 4th box, uncheck the box, then decrement checkcount and pop alert
if (checkCount>maxChecks){
obj.checked=false
checkCount=checkCount-1
alert('you are supposed to choose only '+maxChecks+' options')
}
}
//-->
</script>

</div>
<?php
if(!empty($urlcheck))
{
	if(strtolower($urlcheck) == "http://")
	{
	}
	else if ( ! preg_match('/^(http|https|ftp):\/\/([A-Z0-9][A-Z0-9_-]*(?:\.[A-Z0-9][A-Z0-9_-]*)+):?(\d+)?\/?/i', $urlcheck) )
	{
	?>
	<div class="errorurl">
	<strong class="redb">ERROR: Please Provide proper URL to index the page.</strong><br /><br />
	Kindly Provide a proper URL. <br /><br />The <b>Format of URL should be:</b> <br />http://www.example.com, or<br />http://www.example.com/sample-page.php, or<br />http://subdomain.example.com/sub-directory/sample-page.php,<br />or similar to the above formats.
	</div>
	<?php
	}
		 $params = &JComponentHelper::getParams( 'com_pagerankchecker' );
         $privatekey = $params->get( 'privatekey' );
		 $resp = recaptcha_check_answer ($privatekey,
                               $_SERVER["REMOTE_ADDR"],
                               $_POST["recaptcha_challenge_field"],
                               $_POST["recaptcha_response_field"]);

 		if (!$resp->is_valid) {
  		 echo '<script>alert("Sorry You have Entered Wrong Code. Please Try again");history.go(-1);</script>';
  		  		} 
	else
	{
	$pch =  	url_exists($urlcheck);
	if($pch)
         {
    
         echo "<font color='cyan' size=4>The Domain is Live.<br /><br /></font>";
  
        }
    Else{
         echo "<font color='red' size=4>The domain does not exist or is not yet purchased.<br /><br /></font>";
    
    }
	if(isset($_POST['selection']))
	{
	
for ($i=0; $i<count($_POST['selection']);$i++)
	{
	switch($_POST['selection'][$i])
	{
case 1:
$pr  = getPageRank($urlcheck);
echo "<div class='box'>"."google page rank = $pr out of 10 <br /><br />"."</div>";
break;
case 2:
$ps  = get_alexa_popularity($urlcheck);
echo "<div class='box'>"."Alexa Popularity = $ps <br /><br />"."</div>" ;
break;
case 3:
$pb  = google_backs($urlcheck);
echo  "<div class='box'>"."Google Back links as per its API = $pb <br /><br />"."</div>";
break;
case 4:
$pgl =  getGoogleLinks($urlcheck2);
echo "<div class='box'>"."Total Google Back Links = $pgl <br /><br />"."</div>";
break;
case 5:
$pab = alexa_backlink($urlcheck);
echo  "<div class='box'>"."Number of Alexa Backlinks = $pab <br /><br />"."</div>";
break;
case 6:
$par =   alexa_reach_rank($urlcheck);
echo "<div class='box'>"."Alexa Reach Rank = $par <br /><br />"."</div>";
break;
case 7:
$psar=  getSiteAdvisorRating($urlcheck);
echo "<div class='box'>"."Site Advisor Rating = $psar <br /><br />"."</div>";
break;
case 8:
$pww =	webworth($domain2);
echo "  = Website Value  $pww <br /><br />";
break;
case 9:
$pwr = getWOTRating($urlcheck2);
echo "<div class='box'>"."WOT Rating = $pwr <br /><br />"."</div>";
break;
case 10:
$pbi = getBingLinks($urlcheck);
echo "<div class='box'>"."Number of Bing Inbound Links = $pbi <br /><br />"."</div>";
break;
case 11:
$pavl = altavista_link($urlcheck);
echo "<div class='box'>"."Number of Altavista Links = $pavl <br /><br />"."</div>";
break;
case 12:
$pawl = alltheweb_link($urlcheck);
echo "<div class='box'>"."Number of All the Web Links = $pawl <br /><br />"."</div>";
break;
case 13:
$domain_name = str_replace("http://www.","",$urlcheck);
$domain_name = strtolower(trim($domain_name));
$yahoo_url = 'http://siteexplorer.search.yahoo.com/search?p=http%3A%2F%2F'.$domain_name;
$yahoo_url_contents = get_yahoo_contents($yahoo_url);
if(preg_match('/Pages \(([0-9,]{1,})\)/im', $yahoo_url_contents, $regs))
{
$indexed_pages = trim($regs[1]);
echo "<div class='box'>".ucwords($domain_name).' Has <u>'.$indexed_pages.'</u> Pages Indexed @ Yahoo.com <br /><br />'."</div>";
}
else
{				
echo "<div class='box'>".ucwords($domain_name).' Has Not Been Indexed @ Yahoo.com! <br /><br />'."</div>";}
break;
case 14:
$pyil =	getYahooInlinks($urlcheck2);
echo "<div class='box'>"."Number of Yahoo Inlinks = $pyil <br /><br />"."</div>";
break;
case 15:
$pyi = 	getYahooLinks($urlcheck);
echo "<div class='box'>"."Number of Yahoo Inbound Links as per its API = $pyi <br /><br />"."</div>";
break;
case 16:
$pgix = getGooglePages($urlcheck);
echo "<div class='box'>"."Number of Google Indexed Pages = $pgix <br /><br />"."</div>";
break;
case 17:
$pmi = getBingPages($urlcheck);
echo "<div class='box'>"."Number of Bing Indexed Pages = $pmi <br /><br />"."</div>";
break;
case 18:
$domain6 = str_replace("http://www.","",$urlcheck);
$domain6 = strtolower(trim($domain6));
$image = '<img src="http://open.thumbshots.org/image.pxf?url='.$domain6.'" alt="Thumbnail"> <br /><br />"';
echo $image;
break;

case 19:
					$domain = str_replace("http://www.","",$urlcheck);
					$domain = strtolower(trim($domain));

					if(!empty($domain))
					{ 

					$result = "DMOZ Listing Query Result </b>"; 

					$path = 'http://search.dmoz.org/cgi-bin/search?search='.str_replace('www.', "", $domain); 
					$data = strip_tags(implode("", file($path))); 

					if(strpos($data, 'No Open Directory Project results found')) { 
					$data = ' is Not Listed '; 
					} else { 
					$data = ' is Listed '; 
} 
echo "<div class='box'>"."$domain $data <a href ='$path'>View DMOZ Site</a> <br /><br />"."</div>"; 
} 
break;
case 20:
$pda = getDomainAge($domain2);
echo "<div class='box'>"."Domain Age is = $pda <br /><br />"."</div>";
break;
case 21:
$yl =yahoo_listed($urlcheck);
echo "<div class='box'>"."Yahoo Directory Listing = $yl <br /><br />"."</div>";
break;
case 22:
$domain3 = str_replace("http://www.","",$urlcheck);
$domain3 = strtolower(trim($domain3));
$image2 = '<img src="http://traffic.alexa.com/graph?&amp;w=400&amp;h=220&amp;o=f&amp;c=1&amp;y=r&amp;b=ffffff&amp;r=1m&amp;u='.$domain3.'&amp" alt="Alexa Daily Reach"> <br /><br />"';
echo $image2;
break;
case 23:
$domain4 = str_replace("http://www.","",$urlcheck);
$domain4 = strtolower(trim($domain4));
$image3 = '<img src="http://traffic.alexa.com/graph?&amp;w=400&amp;h=220&amp;o=f&amp;c=1&amp;y=t&amp;b=ffffff&amp;r=1m&amp;u='.$domain4.'&amp" alt="Alexa Daily Traffic rank"> <br /><br />"';
echo $image3;
break;
case 24:
$domain5 = str_replace("http://www.","",$urlcheck);
$domain5 = strtolower(trim($domain5));
$image = '<img src="http://traffic.alexa.com/graph?&amp;w=400&amp;h=220&amp;o=f&amp;c=1&amp;y=p&amp;b=ffffff&amp;r=1m&amp;u='.$domain5.'&amp" alt="Alexa Daily Page Views"> <br /><br />"';
echo $image;
break;

}}
}
?>
 
<?php echo JText::_('Powered by  ') ?><a href="http://www.joomlaseo.org">Joomla SEO Tips</a>		
	<?php
	}

}

?>