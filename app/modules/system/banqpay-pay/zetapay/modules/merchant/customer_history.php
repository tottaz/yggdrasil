<!-- Copyright (C) 2002  Paul Yasi <paul@citrusdb.org>, read the README file for more information -->
<html>
<head>
<LINK href="citrus.css" type=text/css rel=STYLESHEET>
</head>
<body bgcolor="#eeeedd" marginheight=0 marginwidth=1 leftmargin=1 rightmargin=0>
	<?php
	// Includes
	require_once('include/citrus.inc.php');
	require_once('include/database.inc.php');
	require_once('include/user.inc.php');

	// GET Variables
	$account_number = $_GET['account_number'];
	
	echo '<table cellspacing=2 cellpadding=2 border=0>
		<td bgcolor="#ddddcc" width=130><b>Date Time</b></td>
		<td bgcolor="#ddddcc" width=80><b>Created By</b></td>
		<td bgcolor="#ddddcc" width=110><b>Notify</b></td>
		<td bgcolor="#ddddcc" width=80><b>Status</b></td>
		<td bgcolor="#ddddcc" width=320><b>Description</b></td>';

	$query = "SELECT * FROM customer_history WHERE account_number = '$account_number' ORDER BY creation_date DESC";
    $result = db_query($query) or die ("Query Failed $query ".db_error());

	while ($myresult = db_fetch_assoc($result))
	{
		$creation_date = $myresult['creation_date'];
		$created_by = $myresult['created_by'];
		$notify = $myresult['notify'];
		$status = $myresult['status'];
		$description = $myresult['description'];

		print "<tr bgcolor=\"#ffffee\">";
		print "<td>$creation_date</td>";
		print "<td>$created_by</td>";
		print "<td>$notify</td>";
		print "<td>$status</td>";
		print "<td>$description</td>";
	}

	echo '</table>';

	?>
</body>
</html>
