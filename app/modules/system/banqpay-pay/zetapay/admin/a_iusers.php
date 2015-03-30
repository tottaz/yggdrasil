<TABLE class=design width=100% cellspacing=0>
<TR><TH colspan=6>Inactive Users List
<TR><TH>Username
  <TH>Balance
  <TH>Name
  <TH>Email
  <TH>Last login
  <TH>&nbsp;

<?
	$qr1 = mysql_query("SELECT * FROM zetapay_users WHERE NOW()>DATE_ADD(lastlogin, INTERVAL 1 MONTH) AND type!='sys'");
	while ($a = mysql_fetch_object($qr1)){
		echo "\n<TR>\n",
			   "<TD><a href=main.php?a=user&id=$a->username&$id>$a->username</a>\n",
			   "<TD>",dpsumm(balance($a->id), 1),"\n",
			   "<TD>",($a->name != '' ? htmlspecialchars($a->name) : "&nbsp;"),"\n",
			   "<TD>$a->email (<a href=main.php?a=write&id=$a->username&$id>write</a>)\n",
			   "<TD>",dpdate($a->lastlogin),"\n",
			   "<TD>&nbsp;";
		if ($a->suspended) echo "suspended ";
	}
	if (!mysql_num_rows($qr1))
		echo "<tr><td colspan=6>No inactive users.";
?>

</TABLE>