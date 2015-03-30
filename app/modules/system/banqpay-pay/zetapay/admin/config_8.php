<?
	$n1 = $n2 = 0;
	if ( preg_match("/delete/i", $_POST['change3']) ){
		$qr1 = mysql_query("SELECT * FROM zetapay_ads");
		$max = 0;
		while ($d = mysql_fetch_object($qr1)){
			$key = $_POST["delete{$d->id}"];
			if($key){
				if($d->id == $key){
					$id=$d->id;
					@mysql_query("DELETE FROM zetapay_ads WHERE id=$id");
					echo "{$d->html} was deleted<bR>";
					$uC++;
				}
			}
		}
	}
	if ($_POST['change3']){
		$qr1 = mysql_query("SELECT * FROM zetapay_ads");
		$max = 0;
		while ($a = mysql_fetch_object($qr1)){
			$x[$a->id] = 1;
			if ($a->id > $max) $max = $a->id;
			if (preg_match("/update/i", $_POST['change3'])){
				$query = "UPDATE zetapay_ads SET html='".addslashes($_POST["html$a->id"])."' WHERE id=$a->id";
				mysql_query($query) or die( mysql_error()."<br>$query<br>" );
			}
		}
		for ($i = 0; $i <= $max; $i++){
			if (!$x[$i]) break;
			$sel_id = $i;
		}
	}
?>
<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
Banner Ads
</b></div>
<!------///////////////--->
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding-left:10px;">&nbsp;</td>
	<TD>
		<TABLE class=design width=90% cellspacing=0>
		<FORM name=form1 method=post>
		<TR>
			<TH>&nbsp;
			<TH>ID
			<TH>Code
			<TH>Owner
			<TH>Posted
			<TH>Expires On
			<TH>Impressions
			<TH>Click-thrus
			<TH>Ratio
<?
		if($b_width){
			$imgstr = " width=$b_width";
		}
		if($b_height){
			$imgstr .= " height=$b_height";
		}
		$qr1 = mysql_query("SELECT * FROM zetapay_ads ORDER BY id ASC");
		$qr2 = mysql_query("SELECT * FROM zetapay_ads ORDER BY id ASC");
		$itotal = 0;
		for ($i = mysql_num_rows($qr2) - 1; $i >= 0; $i--){
				$itotal++;
		}
		$i = 1;
		while ($a = mysql_fetch_object($qr1)){
			if($a->numImps > 0){
				$ratio = number_format( (($a->numClicks / $a->numImps) * 100), 2 )." %";
			}else{
				$ratio = "0 %";
			}
		    $qr2 = mysql_fetch_object(mysql_query("SELECT username FROM zetapay_users WHERE id=$a->user"));
?>
			<TR>
				<TD width=15><input type=checkbox name="delete<?=$a->id?>" value="<?=$a->id?>">
				<TD width=15><?=$i?></TD> 
				<TD>
<?
			$handle=opendir($att_path); 
			while (false!==($file = readdir($handle))) { 
				if ($file != "." && $file != "..") { 
					if( strstr($file , "xban".$a->id."_") ){
					$furl = $siteurl."//zetapay/".(str_replace("./","",$att_path))."/".$file;
?>
					<img src="<?=$furl?>" border=0 <?=$imgstr?>><br>
<?
					}
				} 
			}
			closedir($handle); 
?>
				<input type=text name=html<?=$a->id?> size=50 value="<?=htmlspecialchars($a->html)?>">
			</TD>
			<TD>
				<a href="main.php?a=user&id=<?=$qr2->username?>&<?=$id?>"><?=$qr2->username?></a>
			</TD>
			<TD><?=date("d M Y", $a->date );?>
			<TD><?=expire($a->date);?>
			<TD><?=$a->numImps?>
			<TD><?=$a->numClicks?>
			<TD><?=$ratio?>		
<?
	}
?>
			<input type="hidden" name="itotal" value="<?=$itotal?>">
		<TR><TH colspan=14><P align=center><input type=submit name=change3 value="Update">
			<input type=submit name=change3 value="Delete selected" <?=$del_confirm?>></TH></TR>
		</FORM>
		</TABLE>
	</td>
</tr>
</table>
</CENTER>
<?
	function expire($dateposted){
		global $banner_days;
		$fptime = new fptime();
		$stamp = $dateposted;
		$year = date("Y",$stamp);
		$day = date("d",$stamp);
		$month = date("m",$stamp);
		$hour = date("h",$stamp);
		$min = date("i",$stamp);
		$sec = date("a",$stamp);
		$interval = $fptime->adddays($banner_days,$month,$day,$year,$hour,$min,$sec);
		$days = $fptime->DateDiff( "d",time(),$interval );
		$exp_str = $fptime->mytime($interval,"d M Y"). " ($days days)";
		return $exp_str;
	}
	class fptime{
		function fptime(){
			return 1;
		}

		function mytime($stamp="",$format="m/d/Y"){
			return date( $format,($stamp ? $stamp : time()) );
		}

		function stamp($mm,$dd,$yy,$hh=0,$min=0,$sec=0){
			return mktime($hh,$min,$sec,$mm,$dd,$yy);
		}

		function subhours($interval,$mm,$dd,$yy,$hh,$m,$s){
			return $this->stamp( $mm,$dd,$yy,($hh-$interval),$m,$s );
		}

		function addhours($interval,$mm,$dd,$yy,$hh,$m,$s){
			return $this->stamp( $mm,$dd,$yy,($hh+$interval),$m,$s );
		}

		function subdays($interval,$mm,$dd,$yy){
			return $this->stamp($mm,($dd-$interval),$yy);
		}

		function adddays($interval,$mm,$dd,$yy,$hh=0,$min=0,$sec=0){
			return $this->stamp($mm,($dd+$interval),$yy,$hh,$min,$sec);
		}

		function submonths($interval,$mm,$dd,$yy){
			return $this->stamp( ($mm-$interval),$dd,$yy );
		}

		function addmonths($interval,$mm,$dd,$yy){
			return $this->stamp( ($mm+$interval),$dd,$yy );
		}

		function subyears($interval,$mm,$dd,$yy){
			return $this->stamp( $mm,$dd,($yy-$interval) );
		}

		function addyears($interval,$mm,$dd,$yy){
			return $this->stamp( $mm,$dd,($yy+$interval) );
		}

		function DateDiff ($interval, $date1,$date2) {
			// get the number of seconds between the two dates
			$timedifference =  $date2 - $date1;
			switch ($interval) {
				case "w":
					$retval = $timedifference/604800;
					$retval = floor($retval);
					break;
				case "d":
					$retval = $timedifference/86400;
					$retval = floor($retval);
					break;
				case "h":
					$retval = $timedifference/3600;
					$retval = floor($retval);
					break;
				case "n":
					$retval = $timedifference/60;
					$retval = floor($retval);
					break;
				case "s":
					$retval  = floor($timedifference);
					break;
			}
			return $retval;
		}

		function dateNow($format="%Y%m%d"){
			return(strftime($format,time()));
		}

		function dateToday(){
			$ndate = time();
			return( $ndate );
		}

		function daysInMonth($month="",$year=""){
			if(empty($year)) {
				$year = $this->dateNow("%Y");
			}
			if(empty($month)) {
				$month = $this->dateNow("%m");
			}
			if($month == 2) {
				if($this->isLeapYear($year)) {
					return 29;
				} else {
					return 28;
				}
			} elseif($month == 4 or $month == 6 or $month == 9 or $month == 11) {
				return 30;
			} else {
				return 31;
			}
		}

		function isLeapYear($year=""){
			if(empty($year)) {
				$year = $this->dateNow("%Y");
			}
			if(strlen($year) != 4) {
				return false;
			}
			if(preg_match("/\D/",$year)) {
				return false;
			}
			return (($year % 4 == 0 && $year % 100 != 0) || $year % 400 == 0);
		}
	}
?>