<?
if ($_POST['descr']){
	$filename = $bkp_path.date("ymd")." ".$_POST['descr'].".gz";
	$f = gzopen($filename, "w");
	if ($f){
		require("admin/backup_info.php");
		while (list($k,$table) = each($tables)){
			echo "Backing up <i>$table</i> table...<br>";
			flush();
			$qr = mysql_query("SELECT * FROM $table");

			$n = mysql_num_fields($qr);
			for ($i = 0; $i < $n; $i++)
				gzwrite($f, mysql_field_name($qr, $i).chr(1));
			gzwrite($f, "\n");

			list($num) = mysql_fetch_row(mysql_query("SELECT COUNT(*) FROM $table"));
			gzwrite($f, $num."\n");

			while ($r = mysql_fetch_row($qr)){
				$str = str_replace(array("\r","\n"), array(chr(2),chr(3)), $r);
				gzwrite($f, implode(chr(1), $str)."\n");
			}
			set_time_limit(30);
		}
		echo "Backing up config file...<br>";
		$config1 = join( "", file("config.php") );
		$config2 = join( "", file("config2.php") );
		$config = $config1."@!%!@".$config2;
		gzwrite($f, $config);
		gzclose($f);
		echo "<br><b>$filename</b> was created successfully<br>Size: ",ceil(filesize($filename) / 1024),"Kb";
		exit;
	}else{
		echo "<div class=error>Cannot create file <b>$filename</b></div><br>";
	}
}
?>
<CENTER>
<TABLE class=design cellspacing=0>
<form method=post>
<TR><TH>Backup Database</TH></TR>
<TR><TD>Enter backup description: <input type=text name=descr size=30>
<TR><TH class=submit><input type=submit class=button value="Create Backup >>"></TH>
<?=$id_post?>
</TR>
</FORM>
</TABLE>
</CENTER>

