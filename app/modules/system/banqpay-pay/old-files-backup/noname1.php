<?php
// Screen scraping your way into RSS
// Example script, by Dennis Pallett
// http://www.phpit.net/tutorials/screenscrap-rss

// Get page
$url = "http://www.banqpay.com/";
$data = implode("", file($url)); 

// Get content items
preg_match_all ("/<div class=\"contentitem\">([^`]*?)<\/div>/", $data, $matches);

// Begin feed
header ("Content-Type: text/xml; charset=ISO-8859-1");
echo "<?xml version=\"1.0\" encoding=\"ISO-8859-1\" ?>\n";
?>
<rss version="2.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:admin="http://webns.net/mvcb/"
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
        <channel>
                <title>PHPit Latest Content</title>
                <description>The latest content from PHPit (http://www.phpit.net), screen scraped!</description>
                <link>http://www.phpit.net</link>
                <language>en-us</language> 
<?
// Loop through each content item
foreach ($matches[0] as $match) {
        // First, get title
        preg_match ("/\">([^`]*?)<\/a><\/h3>/", $match, $temp);
        $title = $temp['1'];
        $title = strip_tags($title);
        $title = trim($title); 
        // Second, get url
        preg_match ("/<a href=\"([^`]*?)\">/", $match, $temp);
        $url = $temp['1'];
        $url = trim($url);

        // Third, get text
        preg_match ("/<p>([^`]*?)<span class=\"byline\">/", $match, $temp);
        $text = $temp['1'];
        $text = trim($text);

        // Fourth, and finally, get author
        preg_match ("/<span class=\"byline\">By ([^`]*?)<\/span>/", $match, $temp);
        $author = $temp['1'];
        $author = trim($author);

        // Echo RSS XML
        echo "<item>\n";
                echo "\t\t\t<title>" . strip_tags($title) . "</title>\n";
                echo "\t\t\t<link>http://www.phpit.net" . strip_tags($url) . "</link>\n";
                echo "\t\t\t<description>" . strip_tags($text) . "</description>\n";
                echo "\t\t\t<content:encoded><![CDATA[ \n";
                echo $text . "\n";
                echo " ]]></content:encoded>\n";
                echo "\t\t\t<dc:creator>" . strip_tags($author) . "</dc:creator>\n";
        echo "\t\t</item>\n";
}
?>
</channel>
</rss>

