

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

    Keyword Position Checker for Joomla

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

Keyword Position Checker for Joomla

Version 1.0.1

Created date: April 2010

Creator: Urmila Champatiray

Email: admin@joomlaseo.org

Website: http://www.joomlaseo.org

*/

// no direct access

defined('_JEXEC') or die('Restricted access');

jimport( 'joomla.application.component.view');

$url = JRequest::getVar('url');

$keyword1 = JRequest::getVar('keyword1');

$keyword2 = JRequest::getVar('keyword2');

$keyword3 = JRequest::getVar('keyword3');

$keyword4 = JRequest::getVar('keyword4');

$document =& JFactory::getDocument();

$document->addStyleSheet( "components/com_yahookeywordsrank/style.css" );

class KeywordPosition
{
	var $url='';
	var $keywords='';
	var $maxPosition=1;

function KeywordPosition($url,$keywords,$maxPosition)
	{

	$url=str_replace('http://www.','',$url);

		$url=str_replace('www.','',$url);

		$this->url=$url;

		$this->keywords=$keywords;

		if($maxPosition<1)

		$maxPosition=1;

		$this->maxPosition=$maxPosition;	

	}

	function GetPosition()

	{

		if(isset($this->url) && isset($this->keywords)) 

		{

   			 $make_url = 'http://search.yahoo.com/search?ei=UTF-8&p=' . rawurlencode($this->keywords) . '&b=';
   			 

			 $index=0; // counting start from here

			 $found=false; // set this flag to true when position found

   			 for ($page = 0; $page < $this->maxPosition; $page++) 

			 {

     			if($found==true) // break the loop when position found

	 			break;

	 			$readPage = fopen($make_url . $page  . 0 ,'r');

     			$contains = '';

      			if ($readPage) 

				{

        			while (!feof($readPage)) 

					{

            			$buffer = fgets($readPage, 4096);

            			$contains .= $buffer;

        			}

        			fclose($readPage);

      		     }

				$results = array();

				preg_match_all('/<a class="yschttl spt" href="([^"\?]+?)["\?].*?>/',$contains,$results);

				foreach ($results[1] as $link) 

				{

				$link = preg_replace('(^http://|/$)','',$link);

				$index=$index+1;

				if (strlen(stristr($link,$this->url))>0) 

				{

				$found=true;

				break;

				}

				}

			}	

			if($found==true)

			return $index;

			else

			return -1;

        }

   	return -1;	

   }
} 
?>

<div id="KRCheker">

<div class="componentheading">Keywords Rank Checker</div>

<h2>Yahoo Keywords Rank Checker:</h2>

<form action="<?php echo JRoute::_('index.php?option=com_yahookeywordsrank'); ?>" method="post" name="formGPRC" id="formGPRC" enctype="multipart/form-data">

<div class="display-center">

	<input name="option" value="com_yahookeywordsrank" type="hidden" />
      <input type="text" name="url" id="url" maxlength="255" value ="http://www.<?PHP print substr($url,11) ; ?>" size="35" />
            
      <br />

      <input type="text" name="keyword1" id="keyword1" maxlength="255" size="35" /> First Keyword  <br />
		
      <input type="text" name="keyword2" id="keyword2" maxlength="255" size="35" /> Second Keyword <br />
		
      <input type="text" name="keyword3" id="keyword3" maxlength="255" size="35" /> Third Keyword  <br />
		
      <input type="text" name="keyword4" id="keyword4" maxlength="255" size="35" /> Fourth Keyword <br />

	  <input type="submit" name="submit_button" value="SEARCH" onclick="this.value='Searching...';" />
      <input type="button" value="CANCEL" onclick="javascript: window.location='<?= $_SERVER['HTTP_REFERER'] ?>';" />
      <br />

      <br />

    </div>

</div>

</form>

<?php

if(!empty($url))

{

	if(strtolower($url) == "http://")

	{

	}

	else if ( ! preg_match('/^(http|https|ftp):\/\/([A-Z0-9][A-Z0-9_-]*(?:\.[A-Z0-9][A-Z0-9_-]*)+):?(\d+)?\/?/i', $url) )

	{

	?>

	<div class="errorurl" style="width: 480px">

	<strong class="redb">ERROR: Please Provide proper URL to index the page.</strong><br /><br />

	Kindly Provide a proper URL. <br /><br />The <b>Format of URL should be:</b> <br />http://www.example.com, or<br />http://www.example.com/sample-page.php, or<br />http://subdomain.example.com/sub-directory/sample-page.php,<br />or similar to the above formats.

	</div>

	<?php

	}

	else
	{
    
$position1=new KeywordPosition($url,$keyword1,10);

$index1=$position1->GetPosition();

$position2=new KeywordPosition($url,$keyword2,10);

$index2=$position2->GetPosition();

$position3=new KeywordPosition($url,$keyword3,10);

$index3=$position3->GetPosition();

$position4=new KeywordPosition($url,$keyword4,10);

$index4=$position4->GetPosition();

?>

<br />
	
 <table id="pager" cellspacing="0" summary="Keywords Rank Checker">
		<caption> Keywords Rank Checker for Yahoo </caption>
			   <tr>
  					<th scope="col" abbr="Keywords" class="nobg">Keywords</th>
  					<th scope="col" abbr="Positions">Positions</th>
  			   </tr>
			   <tr>
  					<th scope="row" class="spec">Webpage URL</th>
					<td><b><span class="web-page-url-show"><?php echo $url; ?></span></b></td>
  			   </tr>
			   <tr>
					<th scope="row" class="spec"><?php echo $keyword1; ?></th>
					<td><?php if($index1==-1)

                                echo 'Keyword not entered or not in top search results';
								else
                                echo 'The Keyword '.$_POST['keyword1']. ' is at '.$index1;?></td>
			    </tr>
				<tr>
					<th scope="row" class="spec"><?php echo $keyword2; ?></th>
					<td><?php if($index2==-1)

                                echo 'Keyword not entered or not in top search results';
								else
                                echo 'The Keyword '.$_POST['keyword2']. ' is at '.$index2;?></td>
			    </tr>
				<tr>
					<th scope="row" class="spec"><?php echo $keyword3; ?></th>
					<td><?php if($index3==-1)

                                echo 'Keyword not entered or not in top search results';
								else
                                echo 'The Keyword '.$_POST['keyword3']. ' is at '.$index3;?></td>
			    </tr>
				<tr>
					<th scope="row" class="spec"><?php echo $keyword4; ?></th>
					<td><?php if($index4==-1)

                                echo 'Keyword not entered or not in top search results';
								else
                                echo 'The Keyword '.$_POST['keyword4']. ' is at '.$index4;?></td>
			    </tr>
			
			</table>		

<?php echo JText::_('Powered by  ') ?><a href="http://www.joomlaseo.org">Joomla SEO Tips</a>
<?php
	}
}
?>