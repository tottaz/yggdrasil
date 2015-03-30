<?php
 /*     This file is used to display all cards that have been created
	It is expected that in production, this feature will be rather
	useless because of the number of accounts that will build up
	over time.  Some sort of method for clearing old accounts will
	need to be implemented.  For now, AllCards is the first step
	in building a reporting system.

	This file C. Carl H. Peterson 2004 and released under the GPL.
	If you didn't get a copy of the GPL with this, do a search for
	GPL and find it your self.  Remember, I copyrighted this so if
	you are using it you better have a license to use it.  GPl 
	works for me.
*/
include("config.inc.php");

if(isset($_GET[$s])) { echo($s); }    // <--- This somehow makes $s not empty FIXME

if(isset($_GET[$so])) { $sort = $_GET[$so]; } // <--- This currently does nothing FIXME
                                                      // <--- so that paged sorting works



if(!isset($sort)) {
	if(isset($_POST['time'])) { $sort = 'Value';}
	if(isset($_POST['sortname'])) { $sort = 'UserName';}
	if(isset($_POST['date'])) { $sort = 'CrDate';}
	//if(isset($_POST['used'])) { $sort = 'TotalSessionTime';}
	if(!isset($sort)) { $sort = NULL; }
	if(!isset($sort)) { $order = NULL; }else{ $order = 'ORDER by '; }
}
if(isset($_POST['limit'])) { $limit = $_POST['limit']; }else{ $limit = 20; } // <-- Hook for later feature

if(isset($addcr)) { $cr = ', CrDate'; }else{ $cr = NULL; }

$q1 = "SELECT UserName, Value $cr FROM radcheck WHERE Attribute LIKE 'Max-All-Session' $order $sort"; // get all the timed cards
echo "All Prepaid cards listed in the Database <br><br>";

 
$numresults=mysql_query($q1);  // <------ FIGURE OUT HOW MANY RESULTS WE ARE PULLING
        $numrows=mysql_num_rows($numresults);

        if (empty($s)) {  // <---- Requires the wierd non functional echo above FIXME
        $s=0;             // <---- I think an if(!isset($s) might work if we pull the GET
        }

        $q1 .= " limit $s,$limit";


echo "<table border=1>";
echo"<tr>";

    echo "<td width=80>";

        printf('<form action="index.php?site=AllCards"method="post">');
        printf('<input type="submit" name="sortname" class="button" value=" Username "/>');
    echo "</td>";
    echo "<td width=80>";
        printf('<form action="index.php?site=AllCards"method="post">');
        printf('<input type="submit" name="time" class="button" value="Purchased"/>');
    echo "</td>";
    echo "<td width=80>";
        printf('<form action="index.php?site=AllCards"method="post">');
        printf('<input type="submit" name="used" class="button" value="Total Use"/>');
    echo "</td>";
	if($addcr == 1) { // <-- This is true if you have the CrDate Field.  Set in config.inc.php
    		echo "<td width=100>";
        	printf('<form action="index.php?site=AllCards"method="post">');
        	printf('<input type="submit" name="date" class="button" value="Created"/>');
    		echo "</td>";
		}
    echo "</tr>";

	if(isset($_POST['used'])) { $sort2 = 'TotalSessionTime';}
	if(!isset($sort2)) { $sort2 = NULL; }
	if(!isset($sort2)) { $order2 = NULL; }else{ $order2 = 'ORDER by '; }



       $result1 = mysql_query($q1) or die(mysql_error());
	$count = 1 + $s; // <-- sets the page number

		while ($row = mysql_fetch_object($result1)) {
			if(!isset($shade)) { $shade = 2;}
			$array[] = $row; 
			$username = ($row->UserName);
			$sec = $row->Value;
			$min = ($sec /60);
			if($addcr == 1) { $date = ($row->CrDate); } // <--See conf file
			echo("<tr>");
			
			if($shade == 1) { echo('<td STYLE="background-color: #F2F7FB">'); }
                                                        else{ echo('<td STYLE="background-color: #cde5f4">'); }


			echo($username);
			echo("</td>");
			
			if($shade == 1) { echo('<td STYLE="background-color: #F2F7FB">'); }
                                                        else{ echo('<td STYLE="background-color: #cde5f4">'); }


			echo(round($min));
			echo("</td>");
				
			// now we query radacct for total usage
			// this is a hack and needs to be turned into a JOIN later...  It does work though
			$q2 = "SELECT SUM(AcctSessionTime) as TotalSessionTime FROM radacct WHERE UserName LIKE '$username' $order2 $sort2";
				$result2 = mysql_query($q2) or die(mysql_error());
					while($row2 = mysql_fetch_object($result2)) {
                                        	$use = $row2->TotalSessionTime;

				//		if ($use == null) { $use = 0; }
						$min_use = ($use /60); // for min 
						$min_use = round($min_use);
						$UserTime[$username] = $min_use; // for testing
						if($shade == 1) { echo('<td STYLE="background-color: #F2F7FB">'); }
                                                        else{ echo('<td STYLE="background-color: #cde5f4">'); }

						echo($min_use);
						echo("</td>");
						}
			if($addcr == 1) { 
				if($shade == 1) { echo('<td STYLE="background-color: #F2F7FB">'); }
					else{ echo('<td STYLE="background-color: #cde5f4">'); }
				echo($date);
				echo("</td>")
				; } // <--See conf file


			echo("</tr>");
		$count++ ; // <--- adds 0ne to the page number
		if($shade == 1) { $shade = 2;}else{ $shade = 1; }
                        }
        $currPage = (($s/$limit) + 1);


	echo "</table>";

        //////////////////////////////////////////////////////////////////
        //      SET UP THE REST OF THE RESULTS PAGES                    //
        //   Some of this code once came from an online tutorial        //
        //   I used when I was building a website.  I will find         //
        //   The author later or re-write.  CP                          //
        //////////////////////////////////////////////////////////////////

        if ($s>=1) { // <---- Don't need a back button if this is the first page
                $prevs=($s-$limit);
                print "&nbsp;<a href=\"index.php?site=AllCards&so=$sort&s=$prevs&q=$var\">&lt;&lt;
                Prev 10</a>&nbsp&nbsp;";
        }

        $pages=intval($numrows/$limit); // <--This figures out how many pages we have

        // $pages now contains int of pages needed unless there is a remainder from division

        if ($numrows%$limit) {
        // has remainder so add one page
        $pages++;
        }

        // check to see if last page
        if (!((($s+$limit)/$limit)==$pages) && $pages!=1) {

        // not last page so give NEXT link
        $next=$s+$limit;

        echo "&nbsp;<a href=\"index.php?site=AllCards&so=$sort&s=$next&q=$var\">Next 10 &gt;&gt;</a>";
        }

        $a = $s + ($limit) ;
        if ($a > $numrows) { $a = $numrows ; }
        $b = $s + 1 ;
        echo "<p>Showing results $b to $a of $numrows</p>";



///////////
// this is for testing array creation

//	print('<table border="1">');
  //      print('<tr><td>Username</td><td>Time Used</td></tr>');	
//	asort($UserTime);
  //      foreach($UserTime as $id => $TimeUsed ) {
    //            echo("<tr><td><b>"), ($id), ("</b></td><td><b>"), ($TimeUsed), ("</b></td>"), ("</tr>");
      //          }
	//print('</table>');
//
//	foreach($array as $key => $value) {
//		print($key);
//		print('<BR>');
//		foreach($value as $key2) {
//			print('User Name ');
//			echo($key2['UserName']);
//			print('<br>');
//			print('Purchased ');
//			echo($key2['Value']);
//			print(' Min<br>');
//			print('On ');
//			echo($key2['CrDate']);
//			}
//	print('<BR><BR>');
//	}
?>		















