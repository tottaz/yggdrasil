<table width="100%" border="0" align="center" bgcolor="#FFFFFF">
<tr>
	<td>
		<table width="100%" border="0" align="center" cellpadding="3" cellspacing="3" bgcolor="#FFFFFF">
		<tr>
			<td width=20> </td>
			<td width="519" valign="top">
				<table width="100%" border="0" cellspacing="0" cellpadding="3">
				<tr>
    				<td valign="top">
<?
	$balance = balance($user);
	if( $_POST['advertise'] ){
		$posterr = 0;
		// Check funds
		if ($balance < $banner_fee){
			errform('You do not have enough money in your account to purchase banner space.<br>You must have at least '.$currency.' '.$banner_fee, 'amount');
		}
	}
	if( ($_POST['advertise']) && (!$posterr) ){
		$html = $_POST['html'];
		if($_POST['edit']){
			$query = "UPDATE zetapay_ads SET
							user='$user',
							html='$html',
							WHERE id=".$_POST['edit'];
		}else{
			$now = time();
			$query = "INSERT INTO zetapay_ads SET
							user='$user',
							html='$html',
							date='$now'";
		}
		mysql_query($query);
		$pid = mysql_insert_id();
		$filename = (!$_FILES['imgfile']['error'] ? substr( basename($_FILES['imgfile']['name']), -30 ) : '');
		$x = strtolower(substr($filename, -4));
		if ($x == '.php' || $x == '.cgi'){
			$filename = substr($filename, -26).'.txt';
		}
		if ($filename){
			$newname = $att_path."xban".$pid."_".$filename;
			copy($_FILES['imgfile']['tmp_name'], $newname);
		}
		transact($user,97,$banner_fee,"Payment For Advertising",'',0);
		echo "Your site has been successfully added<br>";
	}else{
		if($_REQUEST['edit']){
			$qr1 = mysql_query("SELECT * FROM zetapay_shops WHERE id={$_REQUEST['edit']}");
			$row = mysql_fetch_object($qr1);
			$_POST['name'] = $row->name;
			$_POST['html'] = $row->html;
			$_POST['area'] = $row->area;
			$_POST['comment'] = $row->comment;
		}
?>   		
	    				<table width="100%" border="0" cellspacing="0" cellpadding="3">
		        		<tr>
							<td>
								<span class="text4">Advertise With Us</span><br>
								<hr width="100%" size="1"><br>
							</td>
		        		</tr>
		        		<tr>
	        			<td>
	        				<p>
	        					Advertise with <?=$sitename?> today for <?=$banner_days?> days. <?=$currency?> <?=$banner_fee?> will be deducted from your account<br>
	        				</p>
							<FORM method=post enctype='multipart/form-data'>
<?						if($_REQUEST['edit']){	?>
							<input type="hidden" name="edit" value="<?=$_REQUEST['edit']?>">
<?						}	?>
							<table width="100%" border="0" cellspacing="0" cellpadding="0" class=design>
							<tr>
								<th colspan=2>Advertise</th>
							</tr>
							<tr> 
								<th align="center">
									<font size="2" face="Arial, Helvetica, sans-serif">Banner Image<br>
									<span class=tiny>
<?
	if($b_width && $b_height){
		echo $b_width." x ".$b_height;
	}
?>
									</span>
								</th>
								<td><input name="imgfile" type="file" size="45"></td>
							</tr>
							<tr> 
								<th align="center"><font size="2" face="Arial, Helvetica, sans-serif">Banner URL</th>
								<td><input name="html" size="45" value="<?=$_POST['html']?>"></td>
							</tr>
							<TR><TH class=submit colspan=2><input type=submit name=advertise value='Advertise >>'></TH></TR>
							</table>
							</form>
						</td>
					</tr>
					</table>
	    			<table width="100%" border="0" cellspacing="0" cellpadding="3">
	        		<tr>
						<td>
							<span class="text4">Banners you're currently advertising</span><br>
							<hr width="100%" size="1"><br>
						</td>
	        		</tr>
	        		<tr>
	        			<td>
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
			if( expirecheck($a->date) ){
				if($a->numImps > 0){
					$ratio = number_format( (($a->numClicks / $a->numImps) * 100), 2 )." %";
				}else{
					$ratio = "0 %";
				}
				$qr2 = mysql_fetch_object(mysql_query("SELECT username FROM zetapay_users WHERE id=$a->user"));
?>
	        				<table width="100%" border="0" cellspacing="0" cellpadding="0" class=design>
							<TR>
								<TD colspan=5 style="padding-bottom:5px; padding-top:5px;"><div align=center>
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
									<?=htmlspecialchars($a->html)?>
								</TD>
							</TR>
							<TR>
								<TH>Posted
								<TH>Expires
								<TH>Imps.
								<TH>Click-thrus
								<TH>Ratio
							</TR>
							<TR>
								<TD><?=date("d M Y", $a->date );?>
								<TD><?=expire($a->date);?>
								<TD><?=$a->numImps?>
								<TD><?=$a->numClicks?>
								<TD><?=$ratio?>
							</TR>
							</table>
							<br>
<?
			}else{
//				@mysql_query("DELETE FROM zetapay_ads WHERE id='{$a->id}'");
			}
?>
<?
		}
	}
?>
						</td>
					</tr>
					</table>
				</td>
			</tr>
			</table>
		</td>
	</tr>
	</table>
</table>
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
	function expirecheck($dateposted){
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
		$hours = $fptime->DateDiff( "h",time(),$interval );
		if ($hours <= 0){
			return 0;
		}
		return $hours;
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