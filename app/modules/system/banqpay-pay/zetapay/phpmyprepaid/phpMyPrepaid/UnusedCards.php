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

	// We need to select all accounts in radcheck that don't have any usage in radacct
	// this is easier because the accounts don't get added to radacct till they are used.
	// A left join does the trick and gives us some nice clean SQL

	echo "All Unused Accounts <br><br>";  // <--- just here as a lable for now
	if(isset($_GET[$s])) { echo($s); }    // <--- This somehow makes $s not empty FIXME
	
	//////////////////////////////////////////////////////////////////
	//	SET UP THE TABLE AND SORT BUTTONS			//
	//////////////////////////////////////////////////////////////////

	echo "<table border=1>";
   	echo"<tr>";
    	echo "<td width=100>";
	

	
	
	printf('<form action="index.php?site=UnusedCards"method="post">');
	printf('<input type="submit" tabindex="3" class="button"  name="sortname" value="sort by Name">');	
	printf('</form>');

    	echo "</td>";
    	echo "<td width=80>";

	printf('<form action="index.php?site=UnusedCards"method="post">');
        printf('<input type="submit" tabindex="3" class="button" name="time" value="Purchased">');
	printf('</form>');

    	echo "</td>";
	echo "</tr>";

	//////////////////////////////////////////////////////////////////
	//        GET THE POSTED DATA AND SET VARS			//
	//////////////////////////////////////////////////////////////////

	if(isset($_GET[$so])) { $sort = $_GET[$so]; } // <--- This currently does nothing FIXME
						      // <--- so that paged sorting works

	if(!isset($sort)) {
		if(isset($_POST['time'])) { $sort = 'Value';}
		if(isset($_POST['sortname'])) { $sort = 'UserName';}
		if(!isset($sort)) { $sort = NULL; }
		if(!isset($sort)) { $order = NULL; }else{ $order = 'ORDER by '; }
	}

	if(isset($_POST['limit'])) { $limit = $_POST['limit']; }else{ $limit = 20; } // <-- Hook for later feature
	
	//////////////////////////////////////////////////////////////////
	//	SET UP THE QUERRY					//
	//////////////////////////////////////////////////////////////////
	$query = "SELECT radcheck.* FROM radcheck LEFT JOIN radacct ON radcheck.UserName=radacct.UserName
	  WHERE radacct.Username IS NULL AND radcheck.Attribute LIKE 'Max-All-Session' $order $sort";
	
	$numresults=mysql_query($query);  // <------ FIGURE OUT HOW MANY RESULTS WE ARE PULLING
	$numrows=mysql_num_rows($numresults);

	if (empty($s)) {  // <---- Requires the wierd non functional echo above FIXME
  	$s=0;             // <---- I think an if(!isset($s) might work if we pull the GET      
  	}
	
	$query .= " limit $s,$limit";

     	$result = mysql_query($query) or die(mysql_error());
	$count = 1 + $s; // <-- sets the page number
	while($row = mysql_fetch_object($result)) {
        		echo"<tr>";
			if(!isset($shade)) { $shade = 2; }
			echo("<tr>");

			if($shade == 1) { echo('<td STYLE="background-color: #F2F7FB">'); }
			else{ echo('<td STYLE="background-color: #cde5f4">'); }

			echo $row->UserName;
			echo "</td>";
			if($shade == 1) { echo('<td STYLE="background-color: #F2F7FB">'); }
                        else{ echo('<td STYLE="background-color: #cde5f4">'); }

			$sec = $row->Value; // number of seconds
			$min = ($sec /60); // devide by 60 
			echo round($min); // we round just in case.  no need for .666 min 
			echo "Min"; 

                        echo "</td></tr>";

			$count++ ; // <--- adds 0ne to the page number
			if($shade == 2) { $shade = 1; }else{ $shade = 2; } // switches the shade
			}
	$currPage = (($s/$limit) + 1);
	echo"</table>";	
	
	//////////////////////////////////////////////////////////////////
	//	SET UP THE REST OF THE RESULTS PAGES			//
	//   Some of this code once came from an online tutorial	//
	//   I used when I was building a website.  I will find 	//
	//   The author later or re-write.  CP				//
	//////////////////////////////////////////////////////////////////

	if ($s>=1) { // <---- Don't need a back button if this is the first page 
		$prevs=($s-$limit);
  		print "&nbsp;<a href=\"index.php?site=UnusedCards&so=$sort&s=$prevs&q=$var\">&lt;&lt; 
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
  


?>
