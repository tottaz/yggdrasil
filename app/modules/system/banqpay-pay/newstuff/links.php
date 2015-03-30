<?php

/************************************************************************/
/************************************************************************/

require_once("mainfile.php");

/********************************************/
/* Function to display banners in all pages */
/********************************************/

function viewbanner() {
    global $prefix, $dbi, $admin;
    $bresult = sql_query("select * from ".$prefix."_banner WHERE type='0' AND active='1'", $dbi);
    $numrows = sql_num_rows($bresult, $dbi);

/* Get a random banner if exist any. */
/* More efficient random stuff, thanks to Cristian Arroyo from http://www.planetalinux.com.ar */

    if ($numrows>1) {
	$numrows = $numrows-1;
	mt_srand((double)microtime()*1000000);
	$bannum = mt_rand(0, $numrows);
    } else {
	$bannum = 0;
    }
    $bresult2 = sql_query("select bid, imageurl from ".$prefix."_banner WHERE type='0' AND active='1' limit $bannum,1", $dbi);
    list($bid, $imageurl) = sql_fetch_row($bresult2, $dbi);
    
    //if (is_admin($admin)) {
    //} else {
	sql_query("update ".$prefix."_banner set impmade=impmade+1 where bid='$bid'", $dbi);
    //}
    if($numrows>0) {
	$aborrar = sql_query("select cid, imptotal, impmade, clicks, date from ".$prefix."_banner where bid=$bid", $dbi);
	list($cid, $imptotal, $impmade, $clicks, $date) = sql_fetch_row($aborrar, $dbi);

/* Check if this impression is the last one and print the banner */

	if (($imptotal <= $impmade) AND ($imptotal != 0)) {
	    sql_query("update ".$prefix."_banner set active='0' WHERE bid='$bid'", $dbi);
	}
    echo"<center><a href=\"http://www.epaymentsnews.com/banners.php?op=click&amp;bid=$bid\" target=\"_blank\"><img src=\"$imageurl\" border=\"1\" alt=\"\"></a></center>";
    }
}

/********************************************/
/* Function to redirect the clicks to the   */
/* correct url and add 1 click              */
/********************************************/

function clickbanner($bid) {
    global $prefix, $dbi;
    $bresult = sql_query("select clickurl from ".$prefix."_banner where bid=$bid", $dbi);
    list($clickurl) = sql_fetch_row($bresult, $dbi);
    sql_query("update ".$prefix."_banner set clicks=clicks+1 where bid=$bid", $dbi);
    Header("Location: $clickurl");
}

/********************************************/
/* Function to redirect the impressions to the   */
/* correct url and add 1 click              */
/********************************************/

function clickimp($bid) {
    global $prefix, $dbi;
    sql_query("update ".$prefix."_banner set impmade=impmade+1 where bid=$bid", $dbi);
}

/********************************************/
/* Function to let your client login to see */
/* the stats                                */
/********************************************/

function clientlogin() {
    echo"
    <html>
    <body bgcolor=\"#AA9985\" text=\"#000000\" link=\"#006666\" vlink=\"#006666\">
    <center><br><br><br><br>
    <table width=\"200\" cellpadding=\"0\" cellspacing=\"1\" border=\"0\" bgcolor=\"#000000\"><tr><td>
    <table width=\"100%\" cellpadding=\"5\" cellspacing=\"1\" border=\"0\" bgcolor=\"#FFFFFF\"><tr><td bgcolor=\"#EECFA1\">
    <center><b>Advertising Statistics</b></center>
    </td></tr><tr><td bgcolor=\"#FFFACD\">
    <form action=\"banners.php\" method=\"post\">
    Login: <input type=\"text\" name=\"login\" size=\"12\" maxlength=\"10\"><br>
    Password: <input type=\"password\" name=\"pass\" size=\"12\" maxlength=\"10\"><br>
    <input type=\"hidden\" name=\"op\" value=\"Ok\">
    <input type=\"submit\" value=\"Login\">
    </td></tr><tr><td bgcolor=\"#EECFA1\">
    <font class=\"content\">
    <center>Please type your client information</center>
    </font></form>
    </td></tr></table></td></tr></table>
    </body>
    </html>
    ";
}

/*********************************************/
/* Function to display the banners stats for */
/* each client                               */
/*********************************************/

function bannerstats($login, $pass) {
    global $prefix, $dbi, $sitename;
    $result = sql_query("select cid, name, passwd from ".$prefix."_bannerclient where login='$login'", $dbi);
    list($cid, $name, $passwd) = sql_fetch_row($result, $dbi);
    
    if($login=="" AND $pass=="" OR $pass=="") {
	echo "<center><br>Login Incorrect!!!<br><br><a href=\"javascript:history.go(-1)\">Back to Login Screen</a></center>";
    } else {
    
    if ($pass==$passwd) {
    
    echo"
    <html>
    <body bgcolor=\"#AA9985\" text=\"#000000\" link=\"#006666\" vlink=\"#006666\">
    <center>
    <table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"1\" bgcolor=\"#000000\"><tr><td>
    <table border=\"0\" width=\"100%\" cellpadding=\"8\" cellspacing=\"1\" bgcolor=\"#FFFACD\"><tr><td>
    <font class=\"option\">
    <center><b>Current Active Banners for $name</b></center><br>
    </font>
    <table width=\"100%\" border=\"0\"><tr>
    <td bgcolor=\"#887765\"><font color=\"Black\"><center><b>ID</b></td>
    <td bgcolor=\"#887765\"><font color=\"Black\"><center><b>Imp. Made</b></td>
    <td bgcolor=\"#887765\"><font color=\"Black\"><center><b>Imp. Total</b></td>
    <td bgcolor=\"#887765\"><font color=\"Black\"><center><b>Imp. Left</b></td>
    <td bgcolor=\"#887765\"><font color=\"Black\"><center><b>Clicks</b></td>
    <td bgcolor=\"#887765\"><font color=\"Black\"><center><b>% Clicks</b></td>
    <td bgcolor=\"#887765\"><font color=\"Black\"><center><b>Functions</b></td><tr>";
    $result = sql_query("select bid, imptotal, impmade, clicks, date from ".$prefix."_banner WHERE cid='$cid' AND active='1'", $dbi);
    while(list($bid, $imptotal, $impmade, $clicks, $date) = sql_fetch_row($result, $dbi)) {
        if($impmade==0) {
    	    $percent = 0;
        } else {
    	    $percent = substr(100 * $clicks / $impmade, 0, 5);
        }

        if($imptotal==0) {
    	    $left = "Unlimited";
        } else {
    	    $left = $imptotal-$impmade;
        }
        echo "
        <td bgcolor=\"#AA9985\" align=\"center\"><font color=\"White\">$bid</td>
        <td bgcolor=\"#AA9985\" align=\"center\"><font color=\"White\">$impmade</td>
        <td bgcolor=\"#AA9985\" align=\"center\"><font color=\"White\">$imptotal</td>
	<td bgcolor=\"#AA9985\" align=\"center\"><font color=\"White\">$left</td>
        <td bgcolor=\"#AA9985\" align=\"center\"><font color=\"White\">$clicks</td>
        <td bgcolor=\"#AA9985\" align=\"center\"><font color=\"White\">$percent%</td>
        <td bgcolor=\"#AA9985\" align=\"center\"><font color=\"White\"><a href=\"banners.php?op=EmailStats&login=$login&cid=$cid&bid=$bid\">E-mail Stats</a></td><tr>";
    }
    echo "
    </table>
    <center><br><br>
    Following are your running Banners in $sitename<br><br>";

    $result = sql_query("select bid, imageurl, clickurl from ".$prefix."_banner WHERE cid='$cid' AND active='1'", $dbi);
    while(list($bid, $imageurl, $clickurl) = sql_fetch_row($result, $dbi)) {

	$numrows = sql_num_rows($result, $dbi);
	if ($numrows>1) {
	    echo "<hr noshade width=\"80%\"><br>";
	}

	echo "<img src=\"$imageurl\" border=\"1\"><br>
	<font class=\"content\">Banner ID: $bid<br>
	Send <a href=\"banners.php?op=EmailStats&login=$login&cid=$cid&bid=$bid\">E-Mail Stats</a> for this Banner<br>
	This Banners points to <a href=\"$clickurl\">this URL</a><br>
	<form action=\"banners.php\" method=\"submit\">
	Change URL: <input type=\"text\" name=\"url\" size=\"50\" maxlength=\"200\" value=\"$clickurl\">
	<input type=\"hidden\" name=\"login\" value=\"$login\">
	<input type=\"hidden\" name=\"bid\" value=\"$bid\">
	<input type=\"hidden\" name=\"pass\" value=\"$pass\">
	<input type=\"hidden\" name=\"cid\" value=\"$cid\">
	<input type=\"submit\" name=\"op\" value=\"Change\"></form></font>";
    }
    echo "
    </td></tr></table></td></tr></table>
    ";


/* Finnished Banners */
    
    echo "
    <center><br>
    <table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"1\" bgcolor=\"000000\"><tr><td>
    <table border=\"0\" width=\"100%\" cellpadding=\"8\" cellspacing=\"1\" bgcolor=\"#FFFACD\"><tr><td>
    <font class=\"option\">
    <center><b>Banners Finished for $name</b></center><br>
    </font>
    <table width=\"100%\" border=\"0\"><tr>
    <td bgcolor=\"#887765\"><font color=\"Black\"><center><b>ID</b></td>
    <td bgcolor=\"#887765\"><font color=\"Black\"><center><b>Impressions</b></td>
    <td bgcolor=\"#887765\"><font color=\"Black\"><center><b>Clicks</b></td>
    <td bgcolor=\"#887765\"><font color=\"Black\"><center><b>% Clicks</b></td>
    <td bgcolor=\"#887765\"><font color=\"Black\"><center><b>Start Date</b></td>
    <td bgcolor=\"#887765\"><font color=\"Black\"><center><b>End Date</b></td>
    <td bgcolor=\"#887765\"><font color=\"Black\"><center><b>Functions</b></td></tr>";
    $result = sql_query("select bid, impmade, clicks, imageurl, date, dateend from ".$prefix."_banner where cid='$cid' AND active='0'", $dbi);
    while(list($bid, $impmade, $clicks, $imageurl, $date, $dateend) = sql_fetch_row($result, $dbi)) {
        $percent = substr(100 * $clicks / $impmade, 0, 5);
	echo "
        <tr><td bgcolor=\"#AA9985\" align=\"center\"><font color=\"White\">$bid</td>
        <td bgcolor=\"#AA9985\" align=\"center\"><font color=\"White\">$impmade</td>
        <td bgcolor=\"#AA9985\" align=\"center\"><font color=\"White\">$clicks</td>
	<td bgcolor=\"#AA9985\" align=\"center\"><font color=\"White\">$percent%</td>
        <td bgcolor=\"#AA9985\" align=\"center\"><font color=\"White\">$date</td>
        <td bgcolor=\"#AA9985\" align=\"center\"><font color=\"White\">$dateend</td>
	<td bgcolor=\"#AA9985\" align=\"center\"><font color=\"White\"><a href=\"$imageurl\" target=\"new\">View Banner</a></td></tr>";
    }
echo "
</table></td></tr></table></td></tr></table>
</body>
</html>
";
    
    } else {
	echo "<center><br>Login Incorrect!!!<br><br><a href=\"javascript:history.go(-1)\">Back to Login Screen</a></center>";
    }
}
}

/*********************************************/
/* Function to let the client E-mail his     */
/* banner Stats                              */
/*********************************************/

function EmailStats($login, $cid, $bid, $pass) {
    global $prefix, $dbi;
    $result2 = sql_query("select name, email from ".$prefix."_bannerclient where cid='$cid'", $dbi);
    list($name, $email) = sql_fetch_row($result2, $dbi);
    if ($email=="") {
	echo "
	<html>
	<body bgcolor=\"#AA9985\" text=\"#000000\" link=\"#006666\" vlink=\"#006666\">
	<center><br><br><br>
	<b>Statistics for Banner No. $bid can't be send because<br>
	there isn't an email associated with client $name<br>
	Please contact the Administrator<br><br></b>
	<a href=\"javascript:history.go(-1)\">Back to Banners Stats</a>
	";
    } else {
	$result = sql_query("select bid, imptotal, impmade, clicks, imageurl, clickurl, date from ".$prefix."_banner where bid='$bid' and cid='$cid'", $dbi);
	list($bid, $imptotal, $impmade, $clicks, $imageurl, $clickurl, $date) = sql_fetch_row($result, $dbi);
        if($impmade==0) {
    	    $percent = 0;
        } else {
    	    $percent = substr(100 * $clicks / $impmade, 0, 5);
        }

        if($imptotal==0) {
    	    $left = "Unlimited";
	    $imptotal = "Unlimited";
        } else {
    	    $left = $imptotal-$impmade;
        }
	$fecha = date("F jS Y, h:iA.");
	$subject = "Your Banner Statistics at $sitename";
	$message = "Following are the complete stats for your advertising investment at $sitename:\n\n\nClient Name: $name\nBanner ID: $bid\nBanner Image: $imageurl\nBanner URL: $clickurl\n\nImpressions Purchased: $imptotal\nImpressions Made: $impmade\nImpressions Left: $left\nClicks Received: $clicks\nClicks Percent: $percent%\n\n\nReport Generated on: $fecha";
	$from = "$sitename";
	mail($email, $subject, $message, "From: $from\nX-Mailer: PHP/" . phpversion());

	echo "
	<html>
	<body bgcolor=\"#AA9985\" text=\"#000000\" link=\"#006666\" vlink=\"#006666\">
	<center><br><br><br>
	<b>Statistics for Banner No. $bid has been send to<br>
	<i>$email</i> of $name<br><br></b>
	<a href=\"javascript:history.go(-1)\">Back to Banners Stats</a>
	";
    }
}

/*********************************************/
/* Function to let the client to change the  */
/* url for his banner                        */
/*********************************************/

function change_banner_url_by_client($login, $pass, $cid, $bid, $url) {
    global $prefix, $dbi;
    $result = sql_query("select passwd from ".$prefix."_bannerclient where cid='$cid'", $dbi);
    list($passwd) = sql_fetch_row($result, $dbi);
    if (!empty($pass) AND $pass==$passwd) {
	sql_query("update ".$prefix."_banner set clickurl='$url' where bid='$bid'", $dbi);
	echo "<center><br>You changed the URL<br><br><a href=\"javascript:history.go(-1)\">Back to Stats Page</a></center>";
    } else {
	echo "<center><br>Your login/password doesn't match.<br><br>Please <a href=\"banners.php?op=login\">login again</a></center>";
    }
    
}

switch($op) {

    case "click":
	clickbanner($bid);
	break;

    case "imp":
	clickimp($bid);
	break;

    case "login":
	clientlogin();
	break;

    case "Ok":
	bannerstats($login, $pass);
	break;

    case "Change":
	change_banner_url_by_client($login, $pass, $cid, $bid, $url);
	break;

    case "EmailStats":
	EmailStats($login, $cid, $bid, $pass);
	break;
	
    default:
	viewbanner();
	break;
}

?>