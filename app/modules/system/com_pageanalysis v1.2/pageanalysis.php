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
    Webpage Analysis for Joomla
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
	analysis View for Joomla
	Version 1.2
	Created date: June 2010
	Creator: Urmila Champatiray
	Email: admin@joomlaseo.org
	support: support@joomlaseo.org
	Website: http://www.joomlaseo.org
*/

// no direct access
defined('_JEXEC') or die('Restricted access');

$urlcheck = JRequest::getVar('urlcheck');

$document =& JFactory::getDocument();
$document->addStyleSheet( "components/com_pageanalysis/style.css" );


if(!empty($urlcheck))
{
	if(strtolower($urlcheck) == "http://")
	{
	}
	else if ( ! preg_match('/^(http|https|ftp):\/\/([A-Z0-9][A-Z0-9_-]*(?:\.[A-Z0-9][A-Z0-9_-]*)+):?(\d+)?\/?/i', $urlcheck) )
	{
	?>
	<div class="errorurl" style="width: 395px">
	<strong class="redb">ERROR: Please Provide proper URL to index the page.</strong><br /><br />
	Kindly Provide a proper URL. <br /><br />The <b>Format of URL should be:</b> <br />http://www.example.com, or<br />http://www.example.com/sample-page.php, or<br />http://subdomain.example.com/sub-directory/sample-page.php,<br />or similar to the above formats.
	</div>
	<?php
	}
	else
	$url=str_replace('http://','',$urlcheck);
		$url='http://'.$url;
		$meta=New analysis;
		$res=$meta->getValues($url);
		$ext=NEW extractor($url);
		$links=$ext->ExtractLinks('');
		$res['links']=$ext->links;

	{
	$pch =  url_exists($urlcheck);
	?>
	<br />
	<?php
    // To Check Whether the url Exists or not
    
    if($pch)
    {    
         echo "<font color='cyan' size=4>The Domain is Live.</font>";
    }
    else {
         echo "<font color='red' size=4>The domain does not exist or is not yet purchased.</font>";
    }
   ?>

	<table width="456" cellspacing="0" summary="Overall Analysis of Webpage">
				<tr>
				 <td width="480" height="22" align="left" ><strong>Webpage Analysis for: <?php echo $res['url']?>
				 </strong></td>
			   </tr>
			   <tr>
				 <td style="width: 355px"><table border="0" cellspacing="1" width="87%">
					 <tr>
	   				   <td style="width: 355px">
						<table height="753" border="0" cellspacing="1" style="height: 740px; width: 380px;">
                         <tr align="left">
                           <th colspan="2" class="spec"><strong>Details</strong></th>
                         </tr>
                         <tr>
                           <th  class="spec" style="width: 74px"><strong>URL</strong></th>
                           <td style="width: 35px"><?php echo $res['url']?></td>
                         </tr>
                         <tr>
                           <th  class="spec" style="width: 74px"><strong>Speed Test</strong></th>
                           <td style="width: 35px">


<?php 

function checkImage() {
	if(@$_SESSION['image'])
	{
		return true;
	}
	if(@$_POST['image'])
	{
		if(@$_SESSION['chkimage']==@$_POST['image'])
		{
			$_SESSION['image'] = true;
		}
		else
		{
			$_SESSION['image'] = false;
		}
	}
    return true;
}
                           

$urls = trim(@$_REQUEST['urlcheck']);

if($urls && checkImage())
{
	$urls = str_replace("\r\n","\n",$urls);
	$urls = explode("\n",$urls);

	$results = array();
	foreach($urls as $link)
	{
		$link = preg_match("#\\w+://#",$link) ? $link : "http://".$link;
		$start = microtime(true);
		$content = @file_get_contents($link);
		if($content===FALSE)
		{
			continue;
		}
		$result['domain'] = $link;
		$result['time'] = sprintf("%01.3f",microtime(true)-$start);
		$result['size'] = sprintf("%01.2f", strlen($content) / 1000);
		$result['average'] = sprintf("%01.3f",$result['time'] / $result['size']);

		$results[] = $result;
	}

	if($results)
	{
		echo "<table cellpadding=\"3\" cellspacing=\"3\"><tr bgcolor=\"#E6E6E6\"><td>Size</td><td>Load time (secs)</td><td>Average speed per KB</td></tr>";
		foreach($results as $k=>$r)
		{
			echo "<tr bgcolor=\"#FFEAEA\"><td align=\"center\">$r[size] KB</td><td align=\"center\">$r[time]</td><td align=\"center\">$r[average]</td></tr>";
		}
		echo "</table>";
	}
}
 ?>
						</td>
                         </tr>

                         <tr>
                           <th valign="top" class="spec" style="width: 74px"><strong> Title</strong></th>
                           <td style="width: 35px"><?php echo $res['meta_tags']['title']?></td>
                         </tr>
                         <tr>
                           <th valign="top" class="spec" style="width: 74px"><strong> Description</strong></th>
                           <td style="width: 35px"><?php echo $res['meta_tags']['description']?></td>
                         </tr>
                         <tr>
                           <th valign="top" class="spec" style="width: 74px"><strong> Meta Keywords</strong></th>
                           <td style="width: 35px"><?php echo $res['meta_tags']['keywords']?></td>
                         </tr>
                         <tr>
                           <th valign="top" class="spec" style="width: 74px"><strong> Texts</strong></th>
                           <td style="width: 35px"><?php echo $res['text']?></td>
                         </tr>
                         <tr>
                           <th class="spec" style="width: 74px"><strong>No. of 
                             Words </strong></th>
                           <td style="width: 35px"><?php echo $res['no_words']?></td>
                         </tr>
                         <tr>
                           <th class="spec" style="width: 74px"><strong> Distinct Words</strong></th>
                           <td style="width: 35px"><?php echo $res['no_distinct_words']?></td>
                         </tr>
                         <tr>
                           <th valign="top" class="spec" style="width: 92px"><strong> View Source Code</strong></th>
                           <td style="width: 110px"><textarea name="textfield" rows="20" class="input-box-up" onfocus="event.srcElement.className='input-box-down';" onblur="event.srcElement.className='input-box-up';" style="width: 343px"><?php echo htmlentities($res['html']);?></textarea></td>
                         </tr>
                         <tr>
  <td style="width: 35px"><span class="spec" style="width: 74px"><strong>Keyword Density</strong></span></td><td style="width: 35px"><table border="0" cellspacing="1" width="151%">
    <td width = "auto" valign="top"><table border="0" cellspacing="1" width="100%">
      <tr valign="top">
        <td><strong>Word</strong></td>
        <td><strong>Count</strong></td>
        <td><strong>Density</strong></td>
      </tr>
      <?php
										$nr_total=count($res['keywords']['1']);
										$x=1;$i=0;
										foreach($res['keywords']['1'] as $k=>$t)
										{
											$density=$t*100/$res['no_words'];
											if($i%2==0)
											{
												?>
      <tr>
        <td><?php echo $k?></td>
        <td><?php echo $t?></td>
        <td><?php printf("%.2f",$density)?></td>
      </tr>
      <?php
											}
											else
											{
												?>
      <tr>
        <td><?php echo $k?></td>
        <td><?php echo $t?></td>
        <td><?php printf("%.2f",$density)?></td>
      </tr>
      <?php
											}
											$i++;
										}
									?>
    </table></td>
            <td valign="top" width = "auto"><table border="0" cellspacing="1" width="100%">
                <tr align="center" valign="top">
                  <td><strong>Words</strong></td>
                  <td><strong>Count</strong></td>
                  <td><strong>Density</strong></td>
                </tr>
                <?php
										$nr_total=count($res['keywords']['2']);
										$x=1;$i=0;
										foreach($res['keywords']['2'] as $k=>$t)
										{
											$density=$t*100/$res['no_words'];
											if($i%2==0)
											{
												?>
                <tr>
                  <td><?php echo $k?></td>
                  <td><?php echo $t?></td>
                  <td><?php printf("%.2f",$density)?></td>
                </tr>
                <?php
											}
											else
											{
												?>
                <tr>
                  <td><?php echo $k?></td>
                  <td><?php echo $t?></td>
                  <td><?php printf("%.2f",$density)?></td>
                </tr>
                <?php
											}
											$i++;
										}
									?>
                <tr>
                  <td><strong>Multi Words</strong></td>
                  <td><strong>Count</strong></td>
                  <td><strong>Density</strong></td>
                </tr>
                <?php
										$nr_total=count($res['keywords']['3']);
										$x=1;$i=0;
										foreach($res['keywords']['3'] as $k=>$t)
										{
											$density=$t*100/$res['no_words'];
											if($i%2==0)
											{
												?>
                <tr>
                  <td><?php echo $k?></td>
                  <td><?php echo $t?></td>
                  <td><?php printf("%.2f",$density)?></td>
                </tr>
                <?php
											}
											else
											{
												?>
                <tr>
                  <td><?php echo $k?></td>
                  <td><?php echo $t?></td>
                  <td><?php printf("%.2f",$density)?></td>
                </tr>
                <?php
											}
											$i++;
										}
									?>
            </table></td>
    </table></td>
  </tr>
                       </table></td>							
				   </tr>
				   </table>
				 </td>
			   </tr>
</table>
			
<?php echo JText::_('Powered by  ') ?><a href="http://www.joomlaseo.org">Joomla SEO Tips</a>		
	<?php
	}

}

?>