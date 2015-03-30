<?php
/*
* example.php
* class_http.php example usage
* Author: Troy Wolf (troy@troywolf.com)
* Comments: Please be a good neighbor when screen-scraping. Don't write code
            that will needlessly make hits to third-party websites. Use
            class_http's caching feature whenever possible. It is designed to
            make you a good neighbor!
*/

/*
Include the http class. Modify path according to where you put the class
file.
*/
require_once(dirname(__FILE__).'/class_http.php');

/* First, instantiate a new http object. */
$h = new http();

/*
Where do you want to store your cache files?
Default is current dir. You can set it here, or hard-code in the class.
You must end this value with a "/".
*/
$h->dir = "/"; 

/*
Screen-scrape the Google home page without caching.
*/
if (!$h->fetch("http://www.banqpay.com")) {
  /*
  The class has a 'log' property that contains a log of events. This log is
  useful for testing and debugging.
  */
  echo "<h2>There is a problem with the http request!</h2>";
  echo $h->log;
  exit();
}

/* Echo out the body content fetched from the url. */
//echo $h->body;

/* If you just want to know the HTTP status code: */
echo "Status: ".$h->status;

/* If you are interested in seeing all the response headers: */
echo "<pre>".$h->header."</pre>";


/*
Screen-scrape the MSFT stock page at moneycentral.com WITH caching.
You can pass in a TTL which is a Time-To-Live in seconds that you want the 
cached data to be considered "good". For example, if you set the ttl to 600, it
means that before going to the source site for the data, the local cache will be
checked. If the cache file exists, and is not more than 10 minutes old, the
class will use the cache. Otherwise, the source site will be scraped, and the
local cache file will be updated. This makes your page faster and makes you a
better neighbor to the external site.
*/
$url = "http://moneycentral.msn.com/detail/stock_quote?Symbol=MSFT";
if (!$h->fetch($url, 600)) {
  /*
  The class has a 'log' property that contains a log of events. This log is
  useful for testing and debugging.
  */
  echo "<h2>There is a problem with the http request!</h2>";
  echo $h->log;
  exit();
}

/*
There is a special ttl value of "daily". This tells the class to consider the
cached data "good" as long as it was scraped today. Otherwise, go get a fresh
copy of content from the source site and update the local cache.
*/
if (!$h->fetch($url, "daily")) {
  /*
  The class has a 'log' property that contains a log of events. This log is
  useful for testing and debugging.
  */
  echo "<h2>There is a problem with the http request!</h2>";
  echo $h->log;
  exit();
}

/*
Optionally, you can pass in a name that will be used to name the cache file.
This is useful if you want to be able to know which cache files are which.
If you do not pass a name, it will default to an MD5 hash of the url.
*/
if (!$h->fetch($url, 600, "MSFT_Info")) {
  /*
  The class has a 'log' property that contains a log of events. This log is
  useful for testing and debugging.
  */
  echo "<h2>There is a problem with the http request!</h2>";
  echo $h->log;
  exit();
}

/* Echo out the body content fetched from the url. */
echo $h->body;


/*
Extract a specific table of data out of scraped content. The class
comes with 2 static methods you can use for this purpose.
  table_into_array() will rip a single table into an array.
  table_into_xml() will internally call table_into_array() then create an 
  XML document from the array. I thought this would be cool, but in practice,
  I've never used this method since the array is so easy to work with.

This example builds on the previous example to extract the MSFT stats out
of the body content. Read the comments in the class file to learn how to use
this static method.
*/
$msft_stats = http::table_into_array($h->body, "Avg Daily Volume", 1, null);

/* Print out the array so you can see the stats data. */
echo "<pre>";
print_r($msft_stats);
echo "</pre>";


/*
Scraping content that is username/password protected. The class can do basic
authentication. Pass your username and password in like this:
*/
$url = "http://someprivatesite.net";
$h->fetch($url, 0, null, "MyUserName","MyPassword");


/*
If your need to access content on a port other than 80, just put the port in
the URL in the standard way:
*/
$h->fetch("http://somedomain.org:8088");


/*
Example of using the image_cache.php companion script to cache images. Why not
just link directly to a neighbor's images? If your site has a lot of traffic,
that's a lot of hits to your neighbor's site. So why not just copy their image
to your own server? That's fine for images that do not change, but some sites
create dynamic images such as stock charts that are generated new every minute.
image_cache.php in conjunction with class_http.php makes it easy to directly
link to third-party images and cache the image data for whatever ttl makes
sense for your application.

In this example, we will cache the chart image found at this moneycentral page:
http://moneycentral.msn.com/investor/charts/chartdl.asp?FC=1&Symbol=MSFT&CA=1&CB=1&CC=1&CD=1&CP=0&PT=5
You have to look at the page source code to find the url to their image. Then
you url encode their image url, and pass it as a parameter to image_cache.php.
*/
?>

<img src="image_cache.php?ttl=60&url=http%3A%2F%2Fdata.moneycentral.msn.com%2Fscripts%2Fchrtsrv.dll%3FSymbol%3DMSFT%26C1%3D0%26C2%3D1%26C9%3D2%26CA%3D1%26CB%3D1%26CC%3D1%26CD%3D1%26CF%3D0%26EFR%3D236%26EFG%3D246%26EFB%3D254%26E1%3D0" width="448" height="300" alt="Chart Graphic" />

<?


/*
The class has a 'log' property that is very useful for testing and debugging.
During development, I suggest you always print this out so you can see what is
happening.
*/
echo "<h3>http log</h3>";
echo $h->log;

?>