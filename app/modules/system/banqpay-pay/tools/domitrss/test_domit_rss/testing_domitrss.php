<html>
<!-- The DOMIT! RSS Testing Interface -->
<head><title>DOMIT! RSS Testing Interface</title>
<link rel="stylesheet" href="testing_domitrss.css" />

<script language="javascript">
	function showWindow(url) {
		window.open(url, "", "width=760,height=540,scrollbars,resizable,menubar");
	} //showWindow
</script>
</head>

<body>
<h2>DOMIT! RSS Testing Interface</h2>

<form action="testing_domitrss.php" method="POST">

<?php
	
class test_domitrss {
	var $rssdoc;
	var $rssurl = "";
	var $rssparser = 'domit_rss_lite';
	var $doParseRSS = false;

	function start() {
		$this->updateVars();
		$this->buildInterface();
		$this->parse();
	} //start
	
	function parse() {
		if ($this->doParseRSS) {
			require_once("timer.php");
			$timer = new Timer();
			
			$success = false;
			$timer->start();

		    switch($this->rssparser){
		    	case ("domit_rss_lite"):
					//change this to the domit rss path
					require_once('xml_domit_rss_lite.php');
					$this->rssdoc = new xml_domit_rss_document_lite($this->rssurl);
					
					//if Cache Lite support is desired...
					//$this->rssdoc = new xml_domit_rss_document_lite();
					//$this->rssdoc->useCacheLite(true, '../cache/Lite.php');
					//$this->rssdoc->loadRSS($this->rssurl);
					break;
					
		    	case ("domit_rss"):
					//change this to the domit rss path
		    		require_once('xml_domit_rss.php');
					$this->rssdoc = new xml_domit_rss_document($this->rssurl);
					break;
		    } // switch
			
			$timer->stop();
			
			$this->displayFeed();
			
			echo "<br /><br />Time elapsed: " . $timer->getTime() . "seconds<br /><br />\n";
			
		}
	} //parse
	
	function displayFeed() {
	    //SPACER
		echo "<p>&nbsp;</p>\n\n";
		echo "<p>&nbsp;</p>\n\n";
		echo "<hr />\n\n";
		echo "<p>&nbsp;</p>\n\n";
		
	    //FEEDHEADER
		echo "<p class='row0'>Current Feed at: " . $this->rssurl . "</p>\n";

		//SPACER
		echo "<p>&nbsp;</p>\n\n";
	
		//get total number of channels
		$totalChannels = $this->rssdoc->getChannelCount();

		//loop through each channel
		for ($i = 0; $i < $totalChannels; $i++) {
			//get reference to current channel
			$currChannel =& $this->rssdoc->getChannel($i);

			//echo channel info
			echo "<h2><a href=\"" . $currChannel->getLink() . "\" target=\"_child\">" .
								$currChannel->getTitle() . "</a>";
			echo "  " . $currChannel->getDescription() . "</h2>\n\n";

			//get total number of items
			$totalItems = $currChannel->getItemCount();

			//loop through each item
			for ($j = 0; $j < $totalItems; $j++) {
				//get reference to current item
				$currItem =& $currChannel->getItem($j);

				//echo item info
				echo "<p><a href=\"" . $currItem->getLink() . "\" target=\"_child\">" .
						$currItem->getTitle() . "</a> " . $currItem->getDescription() . "</p>\n\n";

			}
		}
		
		//SPACER
		echo "<p>&nbsp;</p>\n\n";
		echo "<p>&nbsp;</p>\n\n";
		echo "<hr />\n\n";
		echo "<p>&nbsp;</p>\n\n";

	    //FEEDHEADER
		echo "<p class='row0'>RSS Data: " . $this->rssurl . "</p>\n";

		//SPACER
		echo "<p>&nbsp;</p>\n\n";

		echo $this->rssdoc->toNormalizedString(true);
	} //displayFeed
	
	function updateVars() {
		global $HTTP_POST_VARS;
		
		if (isset($HTTP_POST_VARS['rssurl'])) {
			$this->rssurl = $HTTP_POST_VARS['rssurl'];
			
			if (substr($this->rssurl, 0, 7) !== "http://") {
				$this->rssurl = "http://" . $this->rssurl;
			}
		}

		if (isset($HTTP_POST_VARS['doParseRSS'])) {
			$this->doParseRSS = $HTTP_POST_VARS['doParseRSS'];
		}

		/*
		if (isset($HTTP_POST_VARS['rssparser'])) {
			$this->rssparser = $HTTP_POST_VARS['rssparser'];
		}
		*/
	} //updateVars
	
	function buildInterface() {
		$files = array('http://www.feedroom.com/rssout/att_rss_1ebaad7be9f5b75e7783f8b495e59bd0f58380b9.xml',
						'http://www.computerworld.com/news/xml/50/0,5009,,00.xml',
						'http://cyber.law.harvard.edu/blogs/gems/tech/sampleRss20.xml',
						'http://mosforge.net/export/rss_sfnews.php',
						'http://linuxtoday.com/backend/my-netscape.rdf',
						'http://headlines.internet.com/internetnews/bus-news/news.rss',
						'http://headlines.internet.com/internetnews/wd-news/news.rss',
						'http://www.bbc.co.uk/syndication/feeds/news/ukfs_news/technology/rss091.xml',
						'http://myrss.com/f/a/m/amazon102Minus3289784Minus3662556N6f8pb3.rss',
						'http://www.cancerletter.com/cancerletter.xml',
						'http://realbeer.com/rdf/realbeernews.rdf',
						'http://www.wired.com/news/feeds/rss2/0,2610,,00.xml',
						'http://www.incidents.org/rssfeed.xml',
						'http://www.alternet.org/module/feed/rss/',
						'http://plebian.com/rss.php',
						'http://www.comingsoon.net/news/rss-reviews-5.php',
						'http://www.usrbingeek.com/index91.xml',
						'http://www.pixelcharmer.com/fieldnotes/index.xml',
						'http://www.growinglifestyle.com/h75/garden/index.rss',
						'http://history1900s.about.com/b/index.xml',
						'http://www.vinayaksworld.com/index.xml',
						'http://weblogs.asp.net/cfrazier/rss.aspx',
						'http://www.networkscience.com/blog/index.rdf',
						'http://www.ladyandtramp.com/mars/rss/mars.rss',
						'http://www.brewedfreshdaily.com/blogger_rss.xml',
						'http://www.fool.com/xml/foolnews_rss091fn.xml',
						'http://www.phireworx.com/content/blog/pwrss.asp',
						'http://siteframe.org/rss.xml',
						'http://www.writenews.com/rss.xml',
						'http://xhp.sourceforge.net/rss.php',
						'http://drupal.org/node/feed',
						'http://blog.ctrlbreak.co.uk/index.rdf',
						'http://rss.topix.net/rss/who/hair-of-the-dog.xml',
						'http://www.betaland.net/joke/index.rdf',
						'http://rss.topix.net/rss/music/acoustic.xml',
						'http://baseballcrank.com/index.rdf',
						'http://www.solport.com/roundtable/index.xml',
						'http://sport.scotsman.com/tennis.cfm?format=rss',
						'http://radio.weblogs.com/0106123/categories/python/rss.xml',
						'http://www.peer-solutions.com/weblog/SyndicationService.asmx/GetRss?',
						'http://radio.weblogs.com/0105058/rss.xml',
						'http://mosforge.net/export/rss_sfnews.php');
		
		echo "<table width=\"760\" cellpadding=\"0\" cellspacing=\"0\">\n";
		
		/*
		//RSS PARSER TITLE
		echo "<tr class=\"row0\">\n";
		echo "<td><p>Choose an RSS Parser</p></td>\n";
		echo "</tr>\n\n";
		
		//CHOOSE RSS PARSER
		
		echo "<tr class=\"row1\">\n";
		echo "<td><p>\n";
		echo "<select name=\"rssparser\">\n";
		echo "<option value=\"domit_rss_lite\"" .
				(($this->rssparser == "domit_rss_lite") ? "selected" : "") .
				">DOMIT! RSS Lite</option>\n";
		echo "<option value=\"domit_rss\"" .
				(($this->rssparser == "domit_rss") ? "selected" : "") .
				">DOMIT! RSS</option>\n";
		echo "</select>\n";	
		echo "</p></td></tr>\n\n";

		//SPACER
		echo "<tr><td>&nbsp;</td><td>&nbsp;</td></tr>\n\n";
		*/

        //HIDDEN FIELDS
		echo "<tr><td><input type=\"hidden\" name=\"rssurl\" /></td></tr>\n\n";
		echo "<tr><td><input type=\"hidden\" name=\"doParseRSS\" /></td></tr>\n\n";
		
		//CHOOSE RSS EXISTING TITLING
		echo "<tr class=\"row0\">\n";
		echo "<td><p>Choose an RSS File and click \"Parse RSS\"</p></td>\n";
		echo "</tr>\n\n";
		
		//CHOOSE RSS EXISTING
		echo "<tr class=\"row1\">\n";
		echo "<td><p>\n";
		echo "<select name=\"rssexisting\" size=\"5\">\n";

		$total = count($files);
		
		for ($i = 0; $i < $total; $i++) {
			$currFile = $files[$i];
			
			echo "<option value=\"" . $currFile . "\"" . 
				(($this->rssurl == $currFile) ? "selected" : "") .
				">" .  $currFile . "</option>\n";
		}
	
		echo "</select>\n";	
		echo "</p>\n";
		echo "</td></tr>\n\n";
		
		//CHOOSE RSS EXISTING BUTTON
		echo "<tr class=\"row1\">\n";
		echo "<td><p>\n";
		echo "<input type=\"button\" name=\"parseexisting_button\" value=\"Parse RSS\" " .
				"onclick=\"this.form.rssurl.value=this.form.rssexisting.value;this.form.doParseRSS.value=true;this.form.submit();\" />\n";
		echo "</p></td>\n";
		echo "</tr>\n\n";
		
		//SPACER
		echo "<tr><td>&nbsp;</td></tr>\n\n";
		echo "<tr><td>&nbsp;</td></tr>\n\n";
		
		//PARSE CUSTOM RSS TITLING
		echo "<tr class=\"row0\">\n";
		echo "<td><p>Enter the url of an RSS file and click \"Parse RSS\"</p></td>\n";
		echo "</tr>\n\n";
		
		//PARSE CUSTOM RSS FIELD
		echo "<tr class=\"row1\">\n";
		echo "<td><p>\n";
		echo "http://<input type=\"text\" name=\"rsscustom\" size=\"100\" value=\"\" />\n";
		echo "</p></td></tr>\n\n";
		
		//SPACER
		echo "<tr><td>&nbsp;</td></tr>\n\n";
		
		//PARSE CUSTOM RSS BUTTON
		echo "<tr class=\"row1\">\n";
		echo "<td><p>\n";
		echo "<input type=\"button\" name=\"rsscustom_button\" value=\"Parse RSS\" " .
				"onclick=\"this.form.rssurl.value=this.form.rsscustom.value;this.form.doParseRSS.value=true;this.form.submit();\" />\n";
		echo "</p></td>\n";
		echo "</tr>\n\n";
		
		echo "</table>\n\n";
	} //buildInterface
} //test_domitrss

$testSuite = new test_domitrss();
$testSuite->start();

?>

</form>

<br />
<p><a href="http://www.engageinteractive.com/domit/"><img src='http://www.engageinteractive.com/domit/domitBanner.gif' width="120" height="60"></a></p>
</body>
</html>
