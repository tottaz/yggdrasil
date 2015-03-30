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
	you are using it you need a license to use it.  You don't need
	to agree to the terms of the GPL, but nothing else gives you 
	permission to use this code.  
*/
include("config.inc.php");

        if(isset($_GET[$s])) { echo($s); }    // <--- This somehow makes $s not empty FIXME

	// We need to select all accounts in radcheck that have a Max-All-Session Value
	// which is >= to SUM(AcctSessionTime)

echo('All Partialy Used Acconts');
echo "<table>";
    echo"<tr>";
    echo "<td width=100>";
	printf('<form action="index.php?site=UsedCards"method="post">');
	printf('<input type="submit" name="sortname" class="button" value="Sort-Name">');	
    echo "</td></form>";
    echo "<td width=60>";
	printf('<form action="index.php?site=UsedCards"method="post">');
        printf('<input type="submit" name="buy" class="button" value="Value"');
    echo "</td></form>";
    echo "<td width=60>";
        printf('<form action="index.php?site=UsedCards"method="post">');
        printf('<input type="submit" name="used" class="button" value="Used">');
    echo "</td></form>";
    echo "</tr>";


//if(isset($_POST['used'])) { $sort = 'SUM(AcctSessionTime)';}  // ----> I can't make this work. FIXME
//if(!isset($sort)) { $sort = NULL; }
//if(!isset($sort)) { $order = NULL; }else{ $order = 'ORDER by '; }

       if(isset($_GET[$so])) { $sort = $_GET[$so]; } // <--- This currently does nothing FIXME
                                                      // <--- so that paged sorting works
        if(!isset($sort)) {
		if(isset($_POST['buy'])) { $sort = 'BINARY Value';}
		if(isset($_POST['sortname'])) { $sort = 'UserName';}
		if(!isset($sort)) { $sort = NULL; }
		if(!isset($sort)) { $order = NULL; }else{ $order = 'ORDER by '; }
		if(isset($_POST['buy'])) { $num = 'varcharcolumn'; }else{ $num= NULL; }
		}

       if(isset($_POST['limit'])) { $limit = $_POST['limit']; }else{ $limit = 20; } // <-- Hook for later feature



// ----> I would like a JOIN of som sort here.  Couldn't figure it out. FIXME
// SUM(AcctSessionTime) as TotalSessionTime
//$query = "SELECT SUM(a.AcctSessionTime) as TotalSessionTime, c.UserName FROM radacct AS a, radcheck AS c 
//	  WHERE c.Attribute LIKE 'Max-All-Session' AND SUM(a.AcctSessionTime) >= radcheck.Value
//	  GROUP BY a.TotalSessionTime, c.UserName";
 	


 $query = "SELECT UserName, Value FROM radcheck WHERE Attribute LIKE 'Max-All-Session' $order '$sort'";

        $result = mysql_query($query) or die(mysql_error());
	while($row = mysql_fetch_object($result)) {
        		
        		$user = $row->UserName; 
			$Val = $row->Value;


			$q2 = "SELECT SUM(AcctSessionTime) as TotalSessionTime FROM radacct WHERE UserName LIKE '$user'"; 
//			AND 'SUM(AcctSessionTime)' >= '$Val'";

				$numresults=mysql_query($q2);  // <------ FIGURE OUT HOW MANY RESULTS WE ARE PULLING
				$numrows=mysql_num_rows($numresults);
				if (empty($s)) {  // <---- Requires the wierd non functional echo above FIXME
				$s=0;             // <---- I think an if(!isset($s) might work if we pull the GET
				}

				$q2 .= " limit $s,$limit";
			
				$res2 = mysql_query($q2) or die(mysql_error());
				while($r2 = mysql_fetch_object($res2)) {
					$used = $r2->TotalSessionTime;
					
					if(!isset($used)) { $used = 0; }  // These lines are to catch errors, NULLS and non numbers
					if(!is_numeric($used)) { $used = 0; }
					
			//		if(!isset($Val)) { $Val = NULL; }
			//		if(!is_numeric($Val)) { $Val = NULL; }
					
					if($used > 0) {
						if(!isset($shade)) { $shade = 2; }	
						echo("<tr>");
						if($shade == 1) { echo('<td STYLE="background-color: #F2F7FB">'); }
						else{ echo('<td STYLE="background-color: #cde5f4">'); }
						printf('<form action="index.php?site=PartialUsed" method="post">');
						printf('<input type="hidden" name="username" value="'); echo("$user"); printf('">');
        					printf('<input type="submit" name="user" class="button" value="'); 
						echo("$user");
						if(isset($_POST['username'])) { $seluser = $_POST['username']; }	
						printf('"/></form>');

						$Val = ($Val/60);  // ---> For Min
						$Val = round($Val); // ---> round it
						$used = ($used/60);
						$used = round($used);	
						echo("</td>");
						if($shade == 1) { echo('<td STYLE="background-color: #F2F7FB">'); }
                                                else{ echo('<td STYLE="background-color: #cde5f4">'); }
						echo("$Val MIN </td>");
						if($shade == 1) { echo('<td STYLE="background-color: #F2F7FB">'); }
                                                else{ echo('<td STYLE="background-color: #cde5f4">'); }
						echo("$used MIN</td></tr>");
						  $count++ ; // <--- adds 0ne to the page number
					        if($shade == 2) { $shade = 1; }else{ $shade = 2; }
						}
					$currPage = (($s/$limit) + 1);
					}


                       
                        }
       
                        
		
echo"</table>";	
       //////////////////////////////////////////////////////////////////
        //      SET UP THE REST OF THE RESULTS PAGES                    //
        //   Some of this code once came from an online tutorial        //
        //   I used when I was building a website.  I will find         //
        //   The author later or re-write.  CP                          //
        //////////////////////////////////////////////////////////////////

        if ($s>=1) { // <---- Don't need a back button if this is the first page
                $prevs=($s-$limit);
                print "&nbsp;<a href=\"index.php?site=UsedCards&so=$sort&s=$prevs&q=$var\">&lt;&lt;
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

        echo "&nbsp;<a href=\"index.php?site=UnusedCards&so=$sort&s=$next&q=$var\">Next 10 &gt;&gt;</a>";
        }

        $a = $s + ($limit) ;
        if ($a > $numrows) { $a = $numrows ; }
        $b = $s + 1 ;
        echo "<p>Showing results $b to $a of $numrows</p>";






if(isset($seluser)) {  // <---- If they selected a detailed view
	 
	echo("<table border=1><tr><td colspan=6>$seluser</td></tr>
		<tr> <td>Start</td> <td>Stop</td> <td>Time</td> <td>Reason</td><td>Download kb</td> <td>Upload kb</td></tr>"); 
		
	$q3 = "SELECT AcctStartTime, AcctStopTime, AcctSessionTime, AcctTerminateCause, AcctInputOctets,
                AcctOutputOctets FROM radacct WHERE UserName LIKE '$seluser'";
	$res3 = mysql_query($q3) or die(mysql_error());
	while($r3 = mysql_fetch_object($res3)) {
		$start = $r3->AcctStartTime;
		$stop = $r3->AcctStopTime;
		$time = $r3->AcctSessionTime;
			$min = ($time/60);
			$min = round($min);
		$logout = $r3->AcctTerminateCause;
		$down = $r3->AcctInputOctets;
			$down = ($down/ 1024); // kb
			$down = round($down);
		$up = $r3->AcctOutputOctets;
			$up = ($up/ 1024); // kb
			$up = round($up);
	

		echo("<tr>");
			if($shade == 1) { echo('<td STYLE="background-color: #F2F7FB">'); }
                                                else{ echo('<td STYLE="background-color: #cde5f4">'); }

			
			echo($start);
			echo("</td>");
			
			if($shade == 1) { echo('<td STYLE="background-color: #F2F7FB">'); }
                                                else{ echo('<td STYLE="background-color: #cde5f4">'); }


			echo($stop);
			echo("</td>");

			if($shade == 1) { echo('<td STYLE="background-color: #F2F7FB">'); }
                                                else{ echo('<td STYLE="background-color: #cde5f4">'); }


			echo($min);
			echo("</td>");

			if($shade == 1) { echo('<td STYLE="background-color: #F2F7FB">'); }
                                                else{ echo('<td STYLE="background-color: #cde5f4">'); }


			echo($logout);
			echo("</td>");

			if($shade == 1) { echo('<td STYLE="background-color: #F2F7FB">'); }
                                                else{ echo('<td STYLE="background-color: #cde5f4">'); }


			echo($down);
			echo("</td>");

			if($shade == 1) { echo('<td STYLE="background-color: #F2F7FB">'); }
                                                else{ echo('<td STYLE="background-color: #cde5f4">'); }


			echo($up);
			echo("</td></tr>");

			if($shade == 2) { $shade = 1; }else{ $shade = 2; }
		}
	echo('</table>');

	}
?>
