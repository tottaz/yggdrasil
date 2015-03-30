<?
	//
	// DO NOT CHANGE ANYTHING HERE.
	//
	error_reporting( E_ALL ^ E_WARNING ^ E_NOTICE );
	set_magic_quotes_runtime(0);
	if (ini_get('register_globals')){
		while ($_ = each($GLOBALS)){
			if (substr($_[0], 0, 1) != '_' && $_[0] != 'GLOBALS'){
				unset($GLOBALS[$_[0]]);
			}
		}
		reset($GLOBALS);
	}
	if (ini_get('magic_quotes_gpc')){
		while ($_ = each($_GET)) $_GET[$_[0]] = stripslashes($_[1]);{
			reset($_GET);
		}
		while ($_ = each($_POST)) $_POST[$_[0]] = stripslashes($_[1]);{
			reset($_POST);
		}
	}
	ignore_user_abort(true);
	if (!ini_get("zlib.output_compression")){
		//ob_start("ob_gzhandler");
	}
  
// Load Application level constants'
    include_once('../zetapay/core/include/appconstants.php');
    
//    require('../zetapay/mobile_connect.php');// Include config data
    require('../zetapay/mobile_connect.php');// Include config data
    require('../zetapay/sys-config1.php');
    require('../zetapay/sys-config2.php');
//    require($rootDir.$subDir.'core/include/select_values.php');
    include_once('../zetapay/core/adodb/adodb.inc.php');
    require('../zetapay/core/include/ipsecure.php');	// Secure IP Stuff


	$defaultmail = "From: $replymail\nReturn-Path: $replymail\n";
	$defaultmail2 = "From: $sitename admin <$replymail>\nReturn-Path: $replymail\n";
	$session_mins = 120;
    
	// Functions
	function errform($msg, $var = ''){
		global $posterr, $_POST;
		$posterr = 1;
		echo "<div class=error>$msg</div>";
		if ($var) $_POST[$var] = '';
	}

	function dpsumm($summ, $design = 0){
		global $currency;
		if ($design){
			return $currency.number_format(($summ > 0 ? $summ : -$summ), 2);
		}else{
			return $currency.number_format($summ, 2, '.', '');
		}
	}
	function dpsumm2($summ, $design = 0){
		global $currency;
		if ($design){
			return $currency.number_format( ($summ > 0 ? $summ : -$summ), 2);
		}else{
			return $currency.number_format($summ, 2, '.', '');
		}
	}

	function confirmStr($user){
		global $siteurl;
		$myUsr = dpObj($user);
		if($myUsr->CC_CONFIRM)$confirmed_cc = " <images src=$siteurl/zetapay/images/creditcard.gif alt='Credit card confirmed'>";
		if($myUsr->P_CONFIRM)$confirmed = " <images src=$siteurl/zetapay/images/cc_address.gif alt='Billing & Payment Info confirmed'>";
		if($myUsr->PH_CONFIRM)$confirmed_ph = " <images src=$siteurl/zetapay/images/telephone.gif alt='Telephone confirmed'>";
		$confirm = $confirmed.$confirmed_cc.$confirmed_ph;
		return $confirm;
	}

	function dp($user, $uname = '', $sp = -1){
		global $id,$siteurl,$zetadb;
		if (!$uname || $sp == -1){
            $rs = $zetadb->Execute("SELECT email FROM ".TBL_SYSTEM_USERS." WHERE id=$user");
            $r1 = $rs->FetchRow();
            $uname = $r1[0];
		}
		$myUsr = dpObj($user);
		if ($user <= 100){
			return $uname;
		}
		$tr = $zetadb->Execute("SELECT * FROM ".TBL_USER_TRANSACTIONS." WHERE paidto=$user AND (paidby>10 AND paidby<100) AND pending=0 LIMIT 1");

		if($myUsr->CC_CONFIRM)$confirmed_cc = " <images src=$siteurl/zetapay/images/creditcard.gif alt='Credit card confirmed'>";
		if($myUsr->P_CONFIRM)$confirmed = " <images src=$siteurl/zetapay/images/cc_address.gif alt='Billing & Payment Info confirmed'>";
		if($myUsr->PH_CONFIRM)$confirmed_ph = " <images src=$siteurl/zetapay/images/telephone.gif alt='Telephone confirmed'>";
		if ($tr->RecordCount()) {
			$confirmed = " <images src=zetapay/images/creditcard.gif alt='Payment confirmed'>";
		}
		$tr = $zetadb->Execute("SELECT * FROM ".TBL_USER_TRANSACTIONS." WHERE paidto=$user AND (paidby>10 AND paidby<100) AND pending=0 LIMIT 1");
		if ($tr->RecordCount()) {
			$confirmed_cc = " <images src=zetapay/images/cc_address.gif alt='Credit card confirmed'>";
		}
		return $uname;
	}

	function dpObj($user){
        global $zetadb;
		$rs = $zetadb->Execute("SELECT * FROM ".TBL_SYSTEM_USERS." WHERE id=$user");
        $user = $rs->FetchNextObject();
		return $user;
	}

	function dpObj2($user){
        global $zetadb;
        $rs = $zetadb->Execute("SELECT * FROM ".TBL_SYSTEM_USERS." WHERE (id='$user')");
		$user = $rs->FetchNextObject();
		return $user;
	}

	function getheader($id){
        global $zetadb;
		$qr1 = $zetadb->Execute("SELECT * FROM ".TBL_AREA_LIST." WHERE id='$id'");
		$a = FetchNextObject($qr1);
		if ($a->TITLE){
			$title = $a->TITLE;
		}
		return $title;
	}

function dpareas($areas, $sep = ', ',$tarea=''){
    global $enum_areas, $zetadb;
		if (!$enum_areas){
			if ($tarea){
				$qr1 = $zetadb->Execute("SELECT * FROM ".TBL_AREA_LIST." WHERE parent='".$tarea."'");
			}else{
				$qr1 = $zetadb->Execute("SELECT * FROM ".TBL_AREA_LIST."");
			}
			while ($a = $qr1->FetchRow()){
				if ($a[1]){
					$enum_areas[$a[0]] = $a[1];
				}
			}
		}
		$i = 0;
		while ($areas){
			if ($areas % 2 && $enum_areas[$i]){
				if ($r){
					$r .= $sep;
				}
				$r .= $enum_areas[$i];
			}
			$areas >>= 1;
			$i++;
		}
		return $r;
	}

function dpareas2($tarea){
        global $zetadb;
		$qr1 = $zetadb->Execute("SELECT * FROM ".TBL_AREA_LIST." WHERE parent='".$tarea."'");
		while ($a = $qr1->FetchRow()){
			if ($a[1]){
				$enum_areas[$a[0]] = $a[1];
			}
		}
		return $enum_areas;
	}

function dpareas3($tarea = 0){
        global $zetadb;
		$qr1 = $zetadb->Execute("SELECT id,title FROM ".TBL_AREA_LIST." WHERE parent='".$tarea."'");
		while ($a = $qr1->FetchRow()){
			if ($a[1]){
				$enum_areas[$a[0]] = $a[1];
			}
		}
		return $enum_areas;
	}

function adpareas($areas, $sep = ', ',$tarea=''){
		global $aenum_areas, $zetadb;
		if (!$aenum_areas){
			if ($tarea){
				$qr1 = $zetadb->Execute("SELECT * FROM ".TBL_AREA_LIST." WHERE parent='".$tarea."' ORDER By parent ASC");
			}else{
				$qr1 = $zetadb->Execute("SELECT * FROM ".TBL_AREA_LIST." ORDER BY parent ASC");
			}
			while ($a = $qr1->FetchNextObject()){
				if ($a->TITLE){
					if ( $a->PARENT ){
						$hdr = getheader($a->PARENT);
					}
					if ($hdr){
						$txt = $hdr." - ".$a->TITLE;
					}else{
						$txt = $a->TITLE;
					}
					$aenum_areas[$a->ID] = $txt;
				}
			}
		}
		$i = 0;
		while ($areas){
			if ($areas % 2 && $aenum_areas[$i]){
				if ($r){
					$r .= $sep;
				}
				$r .= $aenum_areas[$i];
			}
			$areas >>= 1;
			$i++;
		}
		return $r;
	}

function balance($user, $exclude = 0){
        global $zetadb;
		if ($exclude) $optional = " AND pending=0";
        $r1 = &$zetadb->Execute("SELECT SUM(amount) FROM ".TBL_USER_TRANSACTIONS." WHERE paidto=$user".$optional);
		$r2 = &$zetadb->Execute("SELECT SUM(amount+fees) FROM ".TBL_USER_TRANSACTIONS." WHERE paidby=$user".$optional);
        $rsum1 = $r1->FetchRow();
        $rsum2 = $r2->FetchRow();
		return $rsum1[0] - $rsum2[0];
}

function userinfo($user){
		global $id, $zetadb;
        $qr1 = $zetadb->Execute("SELECT AVG(mark),COUNT(mark) FROM ".TBL_USER_REVIEWS." WHERE user=$user");
        $r = $qr1->FetchRow();
		if ($r[1]){
			$alt = myround($r[0], 1)."/10";
			$out[0] = $out[1] = "<a href=index.php?a=reviews&user=$user&$id class=small title=$alt>";
			for ($i = 0, $j = (int)myround($r[0]); $i < $j; $i++){
				$out[0] .= "<images src=zetapay/images/star.gif border=0 width=8>";
			}
			for (; $i < 10; $i++){
				$out[0] .= "<images src=zetapay/images/star2.gif border=0 width=8>";
			}
			$out[0] .= "</a>\n";
			$out[1] .= "($r[1]&nbsp;review".($r[1] == 1 ? '' : 's').")</a>";
			$out[2] = $r[1];
		}else{
			$out = array('<small>(No&nbsp;Feedback&nbsp;Yet)</small>', '', '0');
		}
		return $out;
	}

	function gettemplate($tid, $url = '', $info = '', $addinfo = ''){
		global $id, $data, $pid, $sitename, $siteurl,$charge_signup,$signup_fee,$currency, $zetadb;
        $rs = $zetadb->Execute("SELECT title FROM ".TBL_SYSTEM_TEMPLATES." WHERE id='$tid'");
        $r = $rs->FetchRow();
        $text = $r[0];
		if( strstr($info,"@@") ){
			$info = explode("@@",$info);
			$email = $info[0];
			$amount = $info[1];
		}
		if( strstr($info,"%%") ){
			$info = explode("%%",$info);
			$myname = $info[0];
			$pincode = $info[1];
		}
		// links
			$text = str_replace("[account]", "<a href=index.php?a=account&$id>account</a>", $text);
		// text
			$text = str_replace("[myname]",$myname,$text);
			$text = str_replace("[mypass]",$addinfo,$text);
			$text = str_replace("[mypin]",$pincode,$text);
			$text = str_replace("[sitename]", $sitename, $text);
			$text = str_replace("[siteurl]", $siteurl, $text);
			$text = str_replace("[sitename]", $sitename, $text);
			$text = str_replace("[siteurl]", $siteurl, $text);
		// special
			$text = str_replace("[url]", $url, $text);
			$text = str_replace("[email]", $email, $text);
			$text = str_replace("[amount]", $currency." ".myround($amount), $text);
			$text = str_replace("[info]", $info, $text);
			$text = str_replace("[addinfo]", $addinfo, $text);
		if($charge_signup){
			$signup_fee = floatval2($signup_fee);
			$text = str_replace("[total]", "$currency $signup_fee", $text);
		}
		return $text;
	}

	function sendbilling($type, $email,$username,$email2,$username2,$reason,$fees='0',$tax='0',$total='0'){
		global $id, $data, $pid, $sitename, $siteurl,$defaultmail,$emailtop,$emailbottom,$zetadb;
		if($type == "i"){
            $rs = $zetadb->Execute("SELECT title FROM ".TBL_SYSTEM_TEMPLATES." WHERE id='invoice'");
            $r = $rs->FetchRow();
            $text = $r[0];
			$title = "invoice";
		}else{
            $rs = $zetadb->Execute("SELECT title FROM ".TBL_SYSTEM_TEMPLATES." WHERE id='receipt'");
            $r = $rs->FetchRow();
            $text = $r[0];
			$title = "receipt";
		}
		// text
		if(!$total)$total=$fees;
		$text = str_replace("[username]", $username." (".$email.")", $text);
		$text = str_replace("[username2]", $username2." (".$email2.")", $text);
		$text = str_replace("[memo]", $reason, $text);
		$text = str_replace("[sitename]", $sitename, $text);
		$text = str_replace("[siteurl]", $siteurl, $text);
		$text = str_replace("[sitename]", $sitename, $text);
		$text = str_replace("[siteurl]", $siteurl, $text);
		$text = str_replace("[url]", $url, $text);
		$text = str_replace("[info]", $info, $text);
		$text = str_replace("[addinfo]", $addinfo, $text);

		$text = str_replace("[fees]", "$currency $fees", $text);
		$text = str_replace("[tax]", "$currency $tax", $text);
		$text = str_replace("[total]", "$currency $total", $text);
		if($email){
			if($type == "i"){
				wrapmail($email2, $title, $emailtop.$text.$emailbottom, $defaultmail);
			}else{
				wrapmail($email, $title, $emailtop.$text.$emailbottom, $defaultmail);
			}
		}
	}

	function calctax($amount){
		global $sales_tax;
		if($sales_tax){
			$tax = floatval2( ($amount * $sales_tax) / 100);
			$total = floatval2($tax + $amount);
		}else{
			$total = $amount;
		}
		return $total;
	}

	function calcrate($amount){
		global $ex_rate;
		if($ex_rate){
			$tax = floatval2( ($amount * $ex_rate) / 100);
			$total = floatval2($tax + $amount);
		}else{
			$total = $amount;
		}
		return $total;
	}

function transact($paidby,$paidto,$amount,$comment,$related='',$fees='',$pending='',$addinfo='',$orderno='',$taxon=1){
echo "<!--[ working.... ]-->\n";
		global $sales_tax,$send_i,$send_r,$referral_payout,$affil_on,$aff_levels, $zetadb;
		$total = $fees;
		if(!$total)$total=$fees;
		$afrusr = dpObj($paidby);
		if($paidby == 99){
			// Affiliate stuff
			$totals = explode("|",$amount);
			$total = $totals[0];
			$amount = $totals[1];
			$afrusr = dpObj($related);
	  		$rusr = dpObj($related);
	  		$rname = $rusr->EMAIL;
	  		$referredby = $rusr->REFERREDBY;
	  		$frusr = dpObj($related);
		}else if($afrusr->TYPE != 'sys'){
	  		$rusr = dpObj($paidto);
	  		$rname = $rusr->EMAIL;
	  		$referredby = $rusr->REFERREDBY;
	  		$frusr = dpObj($paidby);
	  	}
	  	if ($afrusr->SUSPENDED){
	  		$amount = 0;
	  	}
	  	if ($rusr->SUSPENDED){
	  		$amount = 0;
	  	}

	  	if($amount > 0){
			$sql = "INSERT INTO ".TBL_USER_TRANSACTIONS." SET
											paidby='$paidby',
											paidto='$paidto',
											trdate=NOW(),
											amount='$amount',
											comment='$comment',
											fees='$fees',
											pending='$pending',
											addinfo='$addinfo',
											orderno='$orderno',
											related='$related'";
			$zetadb->Execute($sql);
			if ($referredby && $aff_levels && $affil_on && $paidby != 99){
				$refusr = dpObj($referredby);
				if ($refusr->SUSPENDED){
					//	adfasdf
				}else{
					if($refusr->PAYOUT){
						$rpay = $refusr->PAYOUT;
					}else{
						$rpay = $referral_payout;
					}
					$ref = myround($total * $rpay / 100, 2);
					if ($ref){
						// ok, let's go through the list for the upline
						$refuid = $referredby;
						for($i = 1;$i <= $aff_levels;$i++){
							if($refuid){
								$comment = "Referral for $rname";
								transact(99,$refuid,$total."|".$ref,$comment,$paidto);
								$refUsr = dpObj($refuid);
								$refuid = "";
								if($refUsr->REFERREDBY){
									$refuid = $refUsr->REFERREDBY;
								}
							}
						}
					}
				}
			}
			if($afrusr->TYPE != 'sys'){
				if($paidby != 99){
					if($send_i){
						sendbilling("i", $rusr->EMAIL,$rusr->NAME,$frusr->EMAIL,$frusr->NAME,$comment,$total,$tax,$amount);
						if($send_r){
							sendbilling("r", $rusr->EMAIL,$rusr->NAME,$frusr->EMAIL,$frusr->NAME,$comment,$total,$tax,$amount);
						}
					}
				}
			}
		}
echo "<!--[ done... ]-->\n";
	}

function prpage($tid, $url = '', $info = '', $addinfo = ''){
		$text = gettemplate($tid, $url, $info, $addinfo);
		echo "<br><br>",nl2br($text),"<br><br>";
}

// Function to write HTML select
function writecombo($array_name, $name, $selected = "", $start = 0, $add_text = "", $add_text2 = "") {
		$length = count ($array_name);
		if (($array_name == "") || ($length == 0)){
			echo "<select name=\"$name\"></select>\n";
		}else{
			echo "<select name=\"$name\" $add_text $add_text2>\n";
			while (list($key, $val) = @each($array_name)) {
				if( !is_array($val) ){
					$select_name = $val;
					$i = $key;
					echo "  <option value=\"$i\"";
					if ($i == $selected){
						echo " selected";
					}
					echo ">$select_name</option>\n";
				}
			}
			echo "</select>\n";
		}
	}

	function writemulticombo($array_name, $name, $selected = array("0"), $size = 3) {
	    $length = count ($array_name);
	    if (($array_name == "") || ($length == 0))
		  echo "<select name=\"$name\"></select>\n";
	    else
	    {
		  echo "<select multiple size=$size name=\"$name\">\n";
		  for ($i = 1; $i < $length; $i++)
		  {
			$select_name = $array_name[$i];
			echo "  <option value=\"$i\"";
			if (in_array($i, $selected))
			   echo " selected";
			echo ">$select_name</option>\n";
		  }
		  echo "</select>\n";
	    }
	}

	function writecheckbox($array_name, $name, $selected = "", $tablesize = 665) {
		$length = count ($array_name);
		if (empty($selected)){
			$selected = split(":", "0:0");
		}
		if (($array_name == "") || ($length == 0)){
			exit;
		}else{
			$j = 0;
			echo "<table width=$tablesize><TR>";
			for ($i = 1; $i < $length; $i++){
				$j++;
				if ($j > 5) {
					echo "</TR><TR>";
					$j = 1;
				}
				$check_name = $array_name[$i];
				echo "<TD><input type=checkbox value=$i name=$name id=$i";
				if (in_array($i, $selected)){
					echo " checked";
				}
				echo ">&nbsp;<label for=$i><font size=1>$check_name</font></label></TD>";
			}
			echo "</table>\n";
		}
	}

	function writenamecombo($array_name, $name, $selected = "", $start = 0, $add_text = "", $add_text2 = "") {
		$length = count ($array_name);
		if (($array_name == "") || ($length == 0)){
			echo "<select name=\"$name\"></select>\n";
		}else{
			echo "<select $add_text $add_text2 name=\"$name\">\n";
			for ($i = $start; $i < $length; $i++){
				$select_name = $array_name[$i];
				echo "  <option value=\"$select_name\"";
				if ($select_name == $selected){
					echo " selected";
				}
				echo ">$select_name</option>\n";
			}
			echo "</select>\n";
		}
	}

	function buddy_smile($message) {
		$message = str_replace(":)", "<images SRC=\"zetapay/images/smilies/icon_smile.gif\">", $message);
		$message = str_replace(":-)", "<images SRC=\"zetapay/images/smilies/icon_smile.gif\">", $message);
		$message = str_replace(":(", "<images SRC=\"zetapay/images/smilies/icon_frown.gif\">", $message);
		$message = str_replace(":-(", "<images SRC=\"zetapay/images/smilies/icon_frown.gif\">", $message);
		$message = str_replace(":-D", "<images SRC=\"zetapay/images/smilies/icon_biggrin.gif\">", $message);
		$message = str_replace(":D", "<images SRC=\"zetapay/images/smilies/icon_biggrin.gif\">", $message);
		$message = str_replace(";)", "<images SRC=\"zetapay/images/smilies/icon_wink.gif\">", $message);
		$message = str_replace(";-)", "<images SRC=\"zetapay/images/smilies/icon_wink.gif\">", $message);
		$message = str_replace(":o", "<images SRC=\"zetapay/images/smilies/icon_eek.gif\">", $message);
		$message = str_replace(":O", "<images SRC=\"zetapay/images/smilies/icon_eek.gif\">", $message);
		$message = str_replace(":-o", "<images SRC=\"zetapay/images/smilies/icon_eek.gif\">", $message);
		$message = str_replace(":-O", "<images SRC=\"zetapay/images/smilies/icon_eek.gif\">", $message);
		$message = str_replace("8)", "<images SRC=\"zetapay/images/smilies/icon_cool.gif\">", $message);
		$message = str_replace("8-)", "<images SRC=\"zetapay/images/smilies/icon_cool.gif\">", $message);
		$message = str_replace(":?", "<images SRC=\"zetapay/images/smilies/icon_confused.gif\">", $message);
		$message = str_replace(":-?", "<images SRC=\"zetapay/images/smilies/icon_confused.gif\">", $message);
		$message = str_replace(":p", "<images SRC=\"zetapay/images/smilies/icon_razz.gif\">", $message);
		$message = str_replace(":P", "<images SRC=\"zetapay/images/smilies/icon_razz.gif\">", $message);
		$message = str_replace(":-p", "<images SRC=\"zetapay/images/smilies/icon_razz.gif\">", $message);
		$message = str_replace(":-P", "<images SRC=\"zetapay/images/smilies/icon_razz.gif\">", $message);
		$message = str_replace(":-|", "<images SRC=\"zetapay/images/smilies/icon_mad.gif\">", $message);
		$message = str_replace(":|", "<images SRC=\"zetapay/images/smilies/icon_mad.gif\">", $message);
		return($message);
	}

	function myheader($user){
		global $cobrand, $zetadb;
		if($user && $cobrand){
			$x = FetchNextObject($zetadb->Execute("SELECT header FROM ".TBL_SYSTEM_USERS." WHERE username='".addslashes($user)."'"));
			if ($x){
				$myheader = $x->HEADER;
			}
		}
		echo $myheader;
	}
	function myfooter($user){
		global $cobrand, $zetadb;
		if($user && $cobrand){
			$x = FetchNextObject($zetadb->Execute("SELECT footer FROM ".TBL_SYSTEM_USERS." WHERE username='".addslashes($user)."'") );
			if ($x){
				$myfooter = $x->FOOTER;
			}
		}
		echo $myfooter;
	}

	function getuserstatus($user){
		global $bronze,$silver,$gold,$platinum,$multi_special, $zetadb;
        $rs = $zetadb->Execute("SELECT special FROM ".TBL_SYSTEM_USERS." WHERE id=$user");
        $r = $qr1->FetchRow();
        $sp = $r->SPECIAL;
		$medal = " ";
		if($multi_special){
			if ($sp == 1){
				$medal .= $bronze;
			}else if ($sp == 2){
				$medal .= $silver;
			}else if ($sp == 3){
				$medal .= $gold;
			}else if ($sp == 4){
				$medal .= $platinum;
			}else{                                                                                         
			    $medal .= "";
			}
		}else{
			if($sp){
				$medal = "<images src=zetapay/images/special.gif border=0>";
			}
		}
		return $medal;
	}

	function floatval2( $strValue ){
		$floatValue = sprintf("%01.2lf", $strValue);
		return $floatValue;
	}

	function myround($amt,$dec=""){
		ob_start();
		printf("%6.2f",$amt);
		$amount = ob_get_contents();
		ob_end_clean();
		$amount = str_replace(" ","",$amount);
		return $amount;
	}

	function mycurl($url,$postfield){
		$ach = curl_init();

		curl_setopt ($ach, CURLOPT_URL,$url);
		curl_setopt($ach, CURLOPT_POST, 1);
		curl_setopt($ach, CURLOPT_POSTFIELDS, $postfield);
		$result = curl_exec ($ach);
		curl_close ($ach);
		return $result;
	}

	function email_check($email) {
               list (, $domain)  = explode('@', $email);
               if (checkdnsrr($domain, 'MX') || checkdnsrr($domain, 'A')) {
	               return 1;
              }
        return 0;
	}

	function CreatePincode() {
		for ($i = 0; $i < 4; $i++) {
			$str .= rand(0,9);
		}
		return $str;
	}

	function CreatePassword() {
		for ($i = 0; $i < 8; $i++) {
			switch(rand(1, 3)) {
				case 1: $pw .= chr(rand(48,57));  break;
				case 2: $pw .= chr(rand(65,90));  break;
				case 3: $pw .= chr(rand(97,122)); break;
			}
		}
		return $pw;
	}

   	function verifiedLink($user){
		global $id, $zetadb;
		$failed = "Unverified [<a href=index.php?a=merchant_add_card&$id>Verify your Account</a> ] ";
        $rs = $zetadb->Execute("SELECT COUNT(*) FROM ".TBL_SYSTEM_VERIFY_USER." WHERE user='$user'");
//        $r1 = $rs->FetchNextObject();
          $r1 = $rs->FetchRow();
		if ($r1[0] > 0){
            $rs = $zetadb->Execute("SELECT verified FROM ".TBL_SYSTEM_VERIFY_USER." WHERE user='$user'");
            $r2 = $rs->FetchNextObject();
			$admin_verify = $r2[0];
			if ($admin_verify == 0){
				return $failed;
			}else{
				return "Verified";
			}
		}else{
			return $failed;
		}
	}


	function verified($user){
		global $zetadb;

        $rs = $zetadb->Execute("SELECT COUNT(*) FROM ".TBL_SYSTEM_VERIFY_USER." WHERE user='$user'");
        $r1 = $qr1->FetchRow();
		if ($r1[0] > 0){
            $rs = $zetadb->Execute("SELECT verified FROM ".TBL_SYSTEM_VERIFY_USER." WHERE user='$user'");
            $r2 = $qr1->FetchRow();
			$admin_verify = $r2[0];
			if ($admin_verify == 0){
				return 0;
			}else{
				return 1;
			}
		}else{
			return 0;
		}
	}

	function wrapmail($to,$subject,$message,$from){
		global $mail_html;
		if($mail_html){
			$from = "Content-Type:text/html; charset=iso-8859-1\n".$from;
			$message = preg_replace(
					"/((http(s?):\\/\\/)|(www\\.))([\\w\\.]+)(.*?)(?=\\s)/i",
					"<a href=\"http$3://$4$5$6\" target=\"_blank\">$4$5$6</a>",
					htmlspecialchars($message)." ");
			$message = nl2br($message);
		}
		if($to){
			mail($to, $subject, $message, $from);
		}
	}
    
    function checkEmailValidity($email){

		global $zetadb;

		$select = " SELECT COUNT(*) FROM ".TBL_SYSTEM_USER_DETAIL." where email='$email'  and active='Y'";
		$rs = $zetadb->Execute($select);
		if(!$rs || $rs->FIELDS[0] <= 0){
			return false;
		}

		return true;
    }

    function changePassword($new_pass, $email){
    	global $zetadb;

    	$columns['password'] = $new_pass;

    	//$updateSQL = " UPDATE ".TBL_SYSTEM_USER_DETAIL." SET password='$new_pass' WHERE email='$email' ";
		//$rs=$zetadb->Execute($updateSQL);
		$status=$zetadb->AutoExecute(TBL_SYSTEM_USER_DETAIL, $columns, "UPDATE", " loginid='$email' and active='Y'");

		if($status){
			return true;
		}else{
			return false;
		}

    }

    function promptForChangePassword($email){
    	global $zetadb;

    	$columns['change_pwd_flag'] = '1';
		//$columns['suid'] = '1';
    	$status = $zetadb->Autoexecute(TBL_SYSTEM_USER_DETAIL, $columns, "UPDATE", " email='$email' and active='Y'");
		if($status){
			return true;
		}else{
			return false;
		}
    }


function GetRandomPassword($length)
{
  $string = "1234567890abcdefghijklmnopqrstuvwxyz";

  for ($a = 0; $a <= $length; $a++)
  {
      $b = rand(0, strlen($string) - 1);
       $rndstring .= $string[$b];
   }
       return $rndstring;
}

function alert($str, $withTags=true){
	if($withTags)
		return "<script>alert('".$str."');</script>";
	else
		return "alert('".$str."');";
}

 function getPermittedTabsForUserFromDB(){

 	global $zetadb;

	$sql_qry = " select * from ".TBL_SYSTEM_PERMITTED_SUBMODULES." where login_id ='".$_SESSION['loginid']."'";
	$rs=$zetadb->Execute($sql_qry);
	if($data=$rs->FetchRow()){
		$array['permitted_tabs']=$data['allowed_tabs'];
		$array['permitted_subtabs']=$data['allowed_subtabs'];
		return $array;
	}else{
		echo "error";
		return array("No tab data found");
	}
 }

$HTML_SPECIAL_CHARS = array();

$HTML_SPECIAL_CHARS['&amp;']= '&';
$HTML_SPECIAL_CHARS['&#39;']= '\'';

function removeHTMLSpecialChars(&$dirtyString){
	global $HTML_SPECIAL_CHARS;	
	foreach($HTML_SPECIAL_CHARS as $regex=>$val){	
		$cleanString = ereg_replace($regex, $val, $dirtyString);	
		if($cleanString != $dirtyString){
			//$dirtyString = $cleanString;
			return $cleanString;
		}
	}
	
	$cleanString = ereg_replace("&[#]?[a-zA-Z0-9]+;", "",$dirtyString);
	$dirtyString = $cleanString;
	return $cleanString; 
}


/*********************************************************/

/* Get Month and Day                                    */

/*********************************************************/

function getmonth() {
		global $date_array;
		$today = getdate();
		$tday = $today[mday];
        $tmonth = $today[mon];
        $tyear = $today[year];
		$pyear = $tyear;
        $tmonthname = date("F",mktime (0,0,0,$today[mon],1,0));
        $pmonthname = date("F",mktime (0,0,0,$today[mon],0,0));
		if ($tday < 7) {
			 $pmonth = $tmonth-1;
		 if ($tmonth == 1) {
	 			$pday = 6 - $tday;
				$pday = 31 - $pday;
		  } elseif($tmonth == 2) {
	 			$pday = 6 - $tday;
				$pday = 31 - $pday;
  		  } elseif($tmonth == 3) {
	 			$pday = 6 - $tday;
				$pday = 28 - $pday;
		  } elseif($tmonth == 4) {
	 			$pday = 6 - $tday;
				$pday = 31 - $pday;
		  } elseif($tmonth == 5) {
	 			$pday = 6 - $tday;
				$pday = 30 - $pday;
		  } elseif($tmonth == 6) {
	 			$pday = 6 - $tday;
				$pday = 31 - $pday;
		  } elseif($tmonth == 7) {
	 			$pday = 6 - $tday;
				$pday = 30 - $pday;
		  } elseif($tmonth == 8) {
	 			$pday = 6 - $tday;
				$pday = 31 - $pday;
		   } elseif($tmonth == 9) {
	 			$pday = 6 - $tday;
				$pday = 31 - $pday;
		   } elseif($tmonth == 10) {
	 			$pday = 6 - $tday;
				$pday = 30 - $pday;
		   } elseif($tmonth == 11) {
	 			$pday = 6 - $tday;
				$pday = 31 - $pday;
		   } elseif($tmonth == 12) {
	 			$pday = 6 - $tday;
				$pday = 30 - $pday;
              }
		 } else {
			  $pday = $tday-6;
			  $pmonth = $tmonth;
     }
	  $date_array = array($tday, $pday, $tmonthname, $pmonthname, $tmonth, $pmonth, $tyear, $pyear);
	  return($date_array);
}

$month_array=array('01'=>'January','02'=>'February','03'=>'March','04'=>'April','05'=>'May','06'=>'June','07'=>'July','08'=>'August','09'=>'September','10'=>'October','11'=>'November','12'=>'December');
$month_array_all=array('ALL'=>'ALL','01'=>'January','02'=>'February','03'=>'March','04'=>'April','05'=>'May','06'=>'June','07'=>'July','08'=>'August','09'=>'September','10'=>'October','11'=>'November','12'=>'December');

function month($mon)
{
	if($mon=='01')
		$month='January';
	elseif($mon=='02')
		$month='February';
	elseif($mon=='03')
		$month='March';
	elseif($mon=='04')
		$month='April';
	elseif($mon=='05')
		$month='May';
	elseif($mon=='06')
		$month='June';
	elseif($mon=='07')
		$month='July';
	elseif($mon=='08')
		$month='August';
	elseif($mon=='09')
		$month='September';
	elseif($mon=='10')
		$month='October';
	elseif($mon=='11')
		$month='November';
	elseif($mon=='12')
		$month='December';
	else
		$month=date('F');

 return $month;
} 

function generateDateToTimestampSQL($inputDate){
	return " DATE_FORMAT('".$inputDate."', '%Y%m%d%H%i%S') ";	
		
}

function tokenizer($string, $delimiter, $useQuotes=false, $max = 1000){
	$length = strlen($string);	
	$tokens = array();
	if(strlen(trim($string)) == 0){
		return $tokens; 
	}
	$i =0;
	$lastDelim =0;
	$offset = strlen(trim($delimiter))==0?0:1;
	$quote = $useQuotes?"'":"";
	while(true && $i<$max){	
		$i++;
		$tokenLength = strpos($string, $delimiter,$lastDelim+1)-$lastDelim;		
		if($tokenLength <=0){
			$tokenLength = $length-($lastDelim);
			$tokens[] = $quote.trim(substr($string, $lastDelim, $tokenLength)).$quote;
			//echo $quote.trim(substr($string, $lastDelim, $tokenLength)).$quote."<br/>";		
			break;
		}
		
		$tokens[] = $quote.ltrim(substr($string, $lastDelim, $tokenLength)).$quote;
		//echo $quote.ltrim(substr($string, $lastDelim, $tokenLength)).$quote."<br/>";
		$lastDelim = strpos($string, $delimiter,$lastDelim+1)+$offset;		
	}
	
	//var_dump($tokens);
	
	return $tokens; 
}

function createStringFromArray($list, $quote=false, $useKey=true){
	if($list == "" || count($list) ==0)
		return "";
	if(!$quote)
		$quote="";
	$strBuffer = "";
	foreach($list as $key=>$value){
		if($useKey){
			$strBuffer .= $quote.$key.$quote.",";	
		}else{
			$strBuffer .= $quote.$value.$quote.",";
		}
	}
	
	$strBuffer = rtrim($strBuffer,",");
	return $strBuffer;
}

function getNextWeekDate($currDate, $weeks=1){
	$nextWeek = strtotime($currDate) + (7 * 24 * 60 * 60)*$weeks;	
	return date('Y-m-d', $nextWeek);
}

function getNextMonthDate($currDate, $months=1){	
	$currTime = strtotime($currDate);	
	return  date('Y-m-d', mktime(0, 0, 0, date("m", $currTime)+$months, date("d", $currTime),  date("Y", $currTime)));//date('Y-m-d', mktime(0, 0, 0, date("m")-1, date("d"),  date("Y")));
}

function getPrevWeekDate($currDate, $weeks=1){
	$nextWeek = strtotime($currDate) - (7 * 24 * 60 * 60)*$weeks;	
	return date('Y-m-d', $nextWeek);
}

function getPrevMonthDate($currDate, $months=1){	
	$currTime = strtotime($currDate);	
	return  date('Y-m-d', mktime(0, 0, 0, date("m", $currTime)-$months, date("d", $currTime),  date("Y", $currTime)));//date('Y-m-d', mktime(0, 0, 0, date("m")-1, date("d"),  date("Y")));
}


function convertUnixTimeToTS($unixTime, $defTS="00000000000000"){	
	//echo mktime(0,0,0,substr($unixTime, 4,2),substr($unixTime, 6,2),substr($unixTime, 0,4))."=";	
	return $unixTime!="00000000000000"?mktime(0,0,0,substr($unixTime, 4,2),substr($unixTime, 6,2),substr($unixTime, 0,4)):$defTS;
}

function getFirstName($fullName){
	return substr($fullName, 0, strpos($fullName," "));
}

function getLastName($fullName){
	return substr($fullName, strrpos($fullName," ")+1, strlen($fullName));
}

function getFormattedString($input, $format){
	$output = $input;	
	
	if(strstr($format, "left-padding:") != ""){
		$offset  = strpos($format, "left-padding:")+13;
		$leftPadding = substr($format,$offset, strpos($format,";", $offset)-$offset);		
	}else{
		$leftPadding="";
	}
		
	if(strstr($format, "right-padding:") != ""){
		$offset  = strpos($format, "right-padding:")+14;
		$rightPadding = substr($format,$offset, strpos($format,";", $offset)-$offset);		
	}else{
		$rightPadding ="";
	}
	
	if(strstr($format, "prefix:") != ""){
		$offset = strpos($format, "prefix:")+7;
		$prefix = substr($format,$offset, strpos($format,";", $offset)-$offset);	
	}else{
		$prefix = "";
	}
	
	if(strstr($format, "suffix:") !=""){
		$offset = strpos($format, "suffix:")+7;		
		$suffix = substr($format,$offset, strpos($format,";", $offset)-$offset);
	}else{
		$suffix = "";
	}	
	
	$output = setPadding($output, $leftPadding, PAD, STR_PAD_LEFT);	
	$output = setPadding($output, $rightPadding, PAD, STR_PAD_RIGHT);		
	$output = setPrefixSuffix($output, $prefix, STR_PAD_LEFT);	
	$output = setPrefixSuffix($output, $suffix, STR_PAD_RIGHT);
		
	return $output;
}

    function setPadding($input, $paddingLen, $paddChar=PAD, $side=STR_PAD_LEFT){	 
	    $output = trim($input);
	    $output = str_pad($output, $paddingLen, "<", $side);
	    return str_ireplace("<",$paddChar,$output);
	
    }

    function setPrefixSuffix($input, $prefix, $side=STR_PAD_LEFT){
	    if($prefix=="") return $input;
	        if($side==STR_PAD_LEFT)
		    return $prefix.$input;
	    else
		    return $input.$prefix;
    }

    function create_date($d) {
	    $date=substr($d,0,4)."-".substr($d,4,2)."-".substr($d,6,2);
	    return $date;
    }

	function dpdate($date) {
		return date("d M Y \\@H:i", strtotime($date));
	}
	function dpdate3($date) {
		return date("d M Y", strtotime($date));
	}
	function dpdate4($date) {
		return date("Y-m-d", strtotime($date));
	}
	function dpdate2($date) {
		return date("d M Y", $date);
	}


    function setexpirydate($a, $expirydate) {
       global $a, $expirydate;    

	   $today = getdate();
       $seconds=$today[seconds];
       $minutes=$today[minutes];
       $hour=$today[hours];
       $day=$today[mday];
       $month=$today[mon];
       $year=$today[year];
       
       if($a->TIME_DURATION == '1') {   // seconds
       
            $seconds=$seconds+$a->TIME_PERIOD;
            if($seconds > 60 ) {
                $seconds=$seconds-60;
                $minutes=$minutes+1;
            }
                
       } elseif($a->TIME_DURATION == '2') { // minutes

            $minutes=$minutes+$a->TIME_PERIOD;
            if($minutes > 60 ) {
                $minutes=$minutes-60;
                $hour=$hour+1;
            }

    
       } elseif($a->TIME_DURATION == '3') { // hours

            $hour=$hour+$a->TIME_PERIOD;
            if($hour > 60 ) {
                $hour=$hour-60;
                $day=$day+1;
            }
    
       } elseif($a->TIME_DURATION == '4') {  // days

            $day=$day+$a->TIME_PERIOD;
            if($day > 60 ) {
                $day=$day-60;
                $month=$month+1;
            }
    
        } elseif($a->TIME_DURATION == '5') {  // month

            $month=$month+$a->TIME_PERIOD;
            if($month > 12 ) {
                $month=$month-12;
                $year=$year+1;
            }

         } elseif($a->TIME_DURATION == '6') {  //years
            $year=$year+$a->TIME_PERIOD;
        } else {
    
    }   
    $expirydate=$year."-".$month."-".$day." ".$hour.":".$minutes.":".$seconds;
    return $expirydate;
}

//
// Allows the users the ability to download files from closed directory. It supports multithread download and download resuming
//

function download_file($path) {

    $fname = $_GET['file'];
    $fpath = "downloads/$fname";
    $fsize = filesize($fpath);
    $bufsize = 20000;

if(isset($_SERVER['HTTP_RANGE']))  //Partial download 
{
   if(preg_match("/^bytes=(\\d+)-(\\d*)$/", $_SERVER['HTTP_RANGE'], $matches)) { //parsing Range header
       $from = $matches[1];
       $to = $matches[2];
       if(empty($to))
       {
           $to = $fsize - 1;  // -1  because end byte is included
                               //(From HTTP protocol:
// 'The last-byte-pos value gives the byte-offset of the last byte in the range; that is, the byte positions specified are inclusive')
       }
       $content_size = $to - $from + 1;

       header("HTTP/1.1 206 Partial Content");
       header("Content-Range: $from-$to/$fsize");
       header("Content-Length: $content_size");
       header("Content-Type: application/force-download");
       header("Content-Disposition: attachment; filename=$fname");
       header("Content-Transfer-Encoding: binary");

       if(file_exists($fpath) && $fh = fopen($fpath, "rb"))
       {
           fseek($fh, $from);
           $cur_pos = ftell($fh);
           while($cur_pos !== FALSE && ftell($fh) + $bufsize < $to+1)
           {
               $buffer = fread($fh, $bufsize);
               print $buffer;
               $cur_pos = ftell($fh);
           }

           $buffer = fread($fh, $to+1 - $cur_pos);
           print $buffer;

           fclose($fh);
       }
       else
       {
           header("HTTP/1.1 404 Not Found");
           exit;
       }
   }
   else
   {
       header("HTTP/1.1 500 Internal Server Error");
       exit;
   }
}
else // Usual download
{
   header("HTTP/1.1 200 OK");
   header("Content-Length: $fsize");
   header("Content-Type: application/force-download");
   header("Content-Disposition: attachment; filename=$fname");
   header("Content-Transfer-Encoding: binary");

   if(file_exists($fpath) && $fh = fopen($fpath, "rb")){
       while($buf = fread($fh, $bufsize))
           print $buf;
       fclose($fh);
   }
   else
   {
       header("HTTP/1.1 404 Not Found");
   }
}
}


/*---------------------------------------------------------------------------*/

function issue_pass ($host, $base, $path, $qstr, $passexp, $secret) {

    $validFor = 0;
    $cpath = canonical_path("$base/$path");

    // get path for the cookie
    if (substr($cpath, -1) == '/') {
        $cookiepath = dirname($cpath.'foo.bar').'/';
    } else {
        $cookiepath = dirname($cpath).'/';
    }

    // current time
    $now = time();

    // compute the hash
    $hash = md5(implode(':', array($secret, $cpath, $qstr, $now, $passexp)));
    $hash = md5($secret.$hash);

    // assemble pass cookie
    $Pass = array( 'time' => $now, 'hash' => $hash, 'path' => $cpath,
                   'qstr' => $qstr, 'expires' => $passexp );

    // send out cookie
    if (isSet($_POST['usrclock']) && is_numeric($_POST['usrclock'])) {
        $now = $_POST['usrclock'] + 600;
    }
    setcookie('Pass', base64_encode(serialize($Pass)), $now+$passexp, $cookiepath, $host, 0);
}

function verify_pass ($gateway, $secret) {

    // current path
    $uripath = canonical_path($gateway.'/'.$_SERVER['PATH_INFO']);


    // get query string
    $qstr = $_SERVER['QUERY_STRING'];
    $qstr = preg_replace('/_bp_[^&]*/', '', $qstr);
    $qstr = preg_replace('/&+/', '&', $qstr);
    $qstr = preg_replace('/^&/', '', $qstr);
    $qstr = preg_replace('/&$/', '', $qstr);


    // fetch cookie
    // $_COOKIE global variable has some quirkiness.
    // When there are more than one cookies which can be associated to a certain URL
    // ( consider two cookies with same name were issue for different pathes.
    //   e.g. setcookie('pass', 'val1', '/d1/'); setcookie('pass', 'val2', '/d1/d2/'); )
    // Then, request to /d1/d2/ comes with both cookies, val2 first followed by val1.
    // i.e. more specific cookie comes first.
    // However, PHP $_COOKIE has less specific values, 'val1' in this example.
    // This is a problem.
    // Workaround : parse the cookie manually...
    if (!isSet($_SERVER['HTTP_COOKIE'])) {
        return array(0, '00:No pass found', 0);
    }

    $cookie = explode(' ', $_SERVER['HTTP_COOKIE']);

    $rawpasses = array();
    $patharray = explode('/', $uripath);
    foreach ($cookie as $value) {
	if (substr($value, 0, 5) == 'Pass=') {
		$rawpass = substr($value, 5);
		array_push($rawpasses, $rawpass);
        }
    }

    if (count($rawpasses) == 0) {
        return array(0, '00:No pass found', 0);
    }

    $last_code = -1;
    $msg = '00:No pass found';
    $validFor = 0;
    foreach ($rawpasses as $rawpass) {
        list($ret, $newmsg, $validFor) = verify_rawpass ($uripath, $rawpass, $qstr, $secret);
        if ($ret == 1) {
            break;
        }

        list($newcode, $dummy) = split(':', $newmsg, 2);
        if ($lastcode < $newcode) {
            $msg = $newmsg;
        }
    }
    return array($ret, $msg, $validFor);
}


function verify_rawpass ($uripath, $rawpass, $qstr, $secret) {

    // fetch the pass
    $pass = @unserialize(base64_decode(urldecode($rawpass)));


    // check the integrity of the pass
    if (!($pass['time'] && $pass['hash'] && $pass['path']
          && $pass['expires'] && isSet($pass['qstr']))) {
        return array(0, '01:Integrity error', 0);
    }


    // check expiration time of cookie
    $elapsed = $pass['time'] - time();
    if (abs($elapsed) > $pass['expires']) {
        return array(0, '02:Expired pass', 0);
    }
    $validFor = $pass['expires'] - $elapsed;
    if ($validFor < 60) {
	$validFor = 60; 
    } 

    // compare the current path and the pass path
    if (substr($uripath, 0, strlen($pass['path'])) != $pass['path']) {
        return array(0, '03:Pass is not for this URL', 0);
    }


    // compare the current query string with the pass qstr
    //if ($qstr != $pass['qstr']) {
    //    return array(0, '05:Pass is not for this query string', 0);
    //}
    // if it's not directory,
    // compare the current query string with the pass qstr
    if (substr($pass['path'],-1) != "/" && $qstr != $pass['qstr']) {
        return array(0, '05:Pass is not for this query string', 0);
    }


    // compute new hash
    $newhash = md5(implode(':', array($secret, $pass['path'], $pass['qstr'], $pass['time'], $pass['expires']) ));
    $newhash = md5($secret.$newhash);


    // compare hashes
    if (strcmp($newhash, $pass['hash']) != 0 ) {
        return array(0, '04:Checksum error', 0);
    }

    return array(1, 'OK', $validFor);
}

/*---------------------------------------------------------------------------*/

function loadkey($pubid) {

    $keydata = file("http://www.banqpay.com/zetapay/download/pubkey.php?pubid=$pubid&type=php");

    if ($keydata == FALSE) {
        return FALSE;
    } else {
        list($keysize, $e, $n) = explode(':', $keydata[0]);
        $pubkey = array('keysize' => intval($keysize), 'e' => $e, 'n' => $n);
        return $pubkey;
    }
}

/*---------------------------------------------------------------------------*/

function canonical_path($path) {

    $host = '';
    $path = trim($path);
    if ($path == '') {
	return '';
    }
    if ( $GLOBALS['bp_config']['WINDOWS'] ) {
	$path = str_replace("\\", "/", $path);

        // handle UNC sytle path
	if (preg_match("/^\/\/(\.|[\w-_]+)\/+(.*)$/", $path, $matches)) {
	    if ($matches[1] != ".") {
	        $host = '//'.$matches[1].'/';
	    }
	    $path = $matches[2];
	}
    }
    $path_arr = explode('/', $path);
    $cpath = array();
    $e = '';

    while (count($path_arr)) {
        $e = array_shift($path_arr);
        if (strlen($e) == 0) { continue; }
        if ($e ==  '.') { continue; };
        if ($e == '..') { array_pop($cpath); continue; };
        array_push($cpath, $e);
    }

    if (stristr($e, '.') == FALSE) {
        array_push($cpath, '');
    }

    return $host.($path[0] == '/' ? '/' : '').implode('/', $cpath);
}

function isAbsPath($path) {

	if ($path == '') {
		return 0;
	}
	
	if ( $GLOBALS['bp_config']['WINDOWS'] ) {
		$path = str_replace("\\", "/", $path);
	}
	if ($path['0'] == '/') {
		return 1;
	}
	if ( $GLOBALS['bp_config']['WINDOWS'] == 0 ) {
		// Unix
		return 0;
	}

	// Windows, check the drive name
	$colon = strchr($path, ':');
	if ($colon == 0) {
		return 0;// ':' not found or placed at first
	}
	$slash = strchr($path, '/');
	if ($slash > 0) {
		return ($slash > $colon);
	}
	return 1;
}

/*---------------------------------------------------------------------------*/
//
// RSA_Verify implements RSA signature verification (using PKCS1 v1.5 SS)
//
/*---------------------------------------------------------------------------*/

function RSA_Verify ($msg, $sig, $pubkey) {

    $n = $pubkey['n'];
    $e = $pubkey['e'];
    $k = intval($pubkey['keysize'] / 8);

    if (strlen($sig) != $k) {
        return FALSE;   // Invalid signature
    }

    if (isSet($GLOBALS['BCMATH']) && $GLOBALS['BCMATH']) {
         $phase0 = OS2I($sig);
         $phase1 = bcpowmod_wrap($phase0, $e, $n);
         $em0 = I2OS($phase1, $k-1);
    } else {
         $phase0 = OS2I_E($sig);
         $phase1 = bc_powmod($phase0, $e, $n);
         $em0 = I2OS_E($phase1, $k-1);
    }

    if (! ($em1 = encode($msg, $k-1)) ) {
        return FALSE;
    }

    if (strcmp($em0, $em1) == 0) {
        return TRUE;
    }

    return FALSE;
}

// RSA PKCS v1.5 SS
function encode($M, $emlen) {
    $T = base64_decode('MCAwDAYIKoZIhvcNAgUFAAQQ').pack("H*", md5($M));

    if ($emlen < strlen($T) + 10)
        return;

    return chr(1).str_repeat(chr(0xff), $emlen - strlen($T) - 2).chr(0).$T;
}

//
// core RSA operations; utilizing bcmath
//
// change function name since, bcpowmod function was added in php 5
function bcpowmod_wrap($m, $e, $n) {
    if (function_exists('bcpowmod')) {
	return bcpowmod($m, $e, $n);
    }
    $m = bcmod($m, $n);

    $erb = strrev(bcbin($e));
    $q = '1';

    $a[0] = $m;

    for ($i = 1; $i < strlen($erb); $i++) {
    	$a[$i] = bcmod(bcmul($a[$i-1], $a[$i-1]), $n);
    }

    for ($i = 0; $i < strlen($erb); $i++) {
    	if ($erb[$i] == '1') {
    	  $q = bcmod(bcmul($q, $a[$i]), $n);
        }
    }

    return $q;
}

function bcbin($o) {
    $r = '';
    while ($o != '0') {
        $m = bcmod($o, '4096');
        $r = substr('000000000000'.decbin(intval($m)), -12).$r;
        $o = bcdiv($o, '4096');
    }

    $r = preg_replace('/^0+/', '', $r);
    if ($r == '') $r = '0';

    return $r;
}

function OS2I($s) {
    $l = strlen($s);

    $n = ''.ord($s[$l-1]); $b = '256';

    for ($i = 1; $i < $l; $i++) {
        $n = bcadd($n, bcmul(ord($s[$l-($i+1)]), $b));
        $b = bcmul($b, '256');
    }

    return $n;
}

function I2OS($n, $l = -1) {
    $s = '';

    if ($l < 0) {
        while ($n != '0') {
            $s = chr(bcmod($n, '256')).$s;
            $n = bcdiv($n, '256');
        }
    } else {
        for ($i = 0; $i < $l; $i++) {
            $s = chr(bcmod($n, '256')).$s;
            $n = bcdiv($n, '256');
        }
    }

    return $s;
}

//
// core RSA operations; utilizing bcmath emulation
//
function bc_powmod($m, $e, $n) {
    $m = bc_mod($m, $n);

    $erb = strrev(bc_bin($e));
    $q = '1';

    $a[0] = $m;

    for ($i = 1; $i < strlen($erb); $i++) {
    	$a[$i] = bc_mod(bc_mul($a[$i-1], $a[$i-1]), $n);
    }

    for ($i = 0; $i < strlen($erb); $i++) {
    	if ($erb[$i] == '1') {
    	  $q = bc_mod(bc_mul($q, $a[$i]), $n);
        }
    }

    return $q;
}

function bc_bin($o) {
    $r = '';
    while ($o != '0') {
        list($o, $m) = bdiv($o, '4096');
        $r = substr('000000000000'.decbin(intval($m)), -12).$r;
    }

    $r = preg_replace('/^0+/', '', $r);
    if ($r == '') $r = '0';

    return $r;
}

function OS2I_E($s) {
    $l = strlen($s);

    $n = ''.ord($s[$l-1]); $b = '256';

    for ($i = 1; $i < $l; $i++) {
        $n = bc_add($n, bc_mul(ord($s[$l-($i+1)]), $b));
        $b = bc_mul($b, '256');
    }

    return $n;
}

function I2OS_E($n, $l = -1) {
    $s = '';

    if ($l < 0) {
        while ($n != '0') {
            list($n, $m) = bdiv($n, '256');
            $s = chr($m).$s;
        }
    } else {
        for ($i = 0; $i < $l; $i++) {
            list($n, $m) = bdiv($n, '256');
            $s = chr($m).$s;
        }
    }

    return $s;
}

/*---------------------------------------------------------------------------*/
//
// Arbitrary length interger arithmetic
//
// - based on Perl bigint package
//
/*---------------------------------------------------------------------------*/

function bc_add($a, $b) {

    $x_ar = internal($a);
    $y_ar = internal($b);

    $car = 0;

    $cx = count($x_ar);
    for ($x = 0; $x < $cx; $x++) {
        if (!(count($y_ar) || $car)) break;
        if ($car = (($x_ar[$x] += array_shift($y_ar) + $car) >= 1E7) ? 1 : 0) {
            $x_ar[$x] -= 1E7;
        }
    }
    $cy = count($y_ar);
    for ($y = 0; $y < $cy; $y++) {
        if (!$car) break;
        if ($car = (($y_ar[$y] += $car) >= 1E7) ? 1 : 0) $y_ar[$y] -= 1E7;
    }

    return external(array_merge($x_ar, $y_ar, array($car)));
}

function bc_div($a, $b) {
    list($d, $m) = bdiv($a, $b);
    return $d;
}

function bc_mod($a, $b) {
    list($d, $m) = bdiv($a, $b);
    return $m;
}

function bc_pow($m, $e) {

    if ($e == 0) return '1';
    if ($e == 1) return $m;

    $r = bc_mul($m,$m);
    if ($e == 2) return $r;

    $i = 2;

    while (2*$i < $e) {
        $r = bc_mul($r, $r);
        $i *= 2;
    }

    for ( ;$i < $e; $i++) {
        $r = bc_mul($r, $m);
    }

    return $r;
}

function bc_mul($a, $b) {
    $x_ar = internal($a);
    $y_ar = internal($b);

    $prod = array(0);
    $cx = count($x_ar);
    for ($x = 0; $x < $cx; $x++) {
        $car = $cty = 0;
        $cy = count($y_ar);
        for ($y = 0; $y < $cy; $y++) {
            $p = $x_ar[$x] * $y_ar[$y] + @$prod[$cty] + $car;
            @$prod[$cty++] = $p - ($car = intval($p / 1E7)) * 1E7;
        }
        if ($car) @$prod[$cty] += $car;
        $x_ar[$x] = array_shift($prod);
    }
    return external(array_merge($x_ar, $prod));
}

/*---------------------------------------------------------------------------*/
// Utility functions

function internal($a) {
    $b = strrev($a);
    $ar = array();

    while (strlen($b)) {
        array_push($ar, strrev(substr($b, 0, 7)));
        $b = substr($b, 7);
    }

    return $ar;
}

function external($ar) {

    $r = '';

    $ca = count($ar);

    for ($i = 0; $i < $ca; $i++) {
        if (strlen($ar[$i]) == 7) {
            $r = $ar[$i].$r;
        } else {
            $r = substr('000000000'.$ar[$i], -7).$r;
        }
    }

    $r = preg_replace('/^0+/', '', $r);
    if ($r == '') $r = 0;

    return $r;
}

function bcmp($a, $b) {

    if (strcmp($a,$b) ==0) return 0;

    $ld = strlen($a) - strlen($b);

    if ($ld != 0) return $ld;

    return strcmp($a, $b);
}

function bdiv($a, $b) {

    if (bcmp($a, $b) < 0) return array('0', $a);

    $x_ar = internal($a);
    $y_ar = internal($b);


    $car = $bar = $prd = $dd = 0;

    if (($dd = intval(1E7/(end($y_ar)+1))) != 1) {
        $cx = count($x_ar);
        for ($x = 0; $x < $cx; $x++) {
            $x_ar[$x] = $x_ar[$x] * $dd + $car;
            $x_ar[$x] -= ($car = intval($x_ar[$x] / 1E7)) * 1E7;
        }
        array_push($x_ar, $car); $car = 0;
        $cy = count($y_ar);
        for ($y = 0; $y < $cy; $y++) {
            $y_ar[$y] = $y_ar[$y] * $dd + $car;
            $y_ar[$y] -= ($car = intval($y_ar[$y] / 1E7)) * 1E7;
        }
    } else {
        array_push($x_ar, 0);
    }

    $q_ar = array(); 
    $v1 = end($y_ar);
    $v2 = (count($y_ar) > 1) ? $y_ar[count($y_ar)-2] : '';

    $cx = count($x_ar) - 1;
    $cy = count($y_ar) - 1;
    while ($cx > $cy) {
        $u0 = end($x_ar);
        $u1 = (count($x_ar) > 1) ? $x_ar[count($x_ar)-2] : '';
        $u2 = (count($x_ar) > 2) ? $x_ar[count($x_ar)-3] : '';

        $q = ($u0 == $v1) ? (1E7 - 1) : intval(($u0*1E7+$u1)/$v1);
        while ($v2*$q > ($u0*1E7+$u1-$q*$v1)*1E7+$u2) --$q;

        if ($q) {
            $car = $bar = 0;

            for ($y = 0, $x = $cx-$cy-1; $y <= $cy; ++$y,++$x) {
        	$prd = $q * $y_ar[$y] + $car;
        	$prd -= ($car = intval($prd / 1E7)) * 1E7;
                if ($bar = (($x_ar[$x] -= $prd + $bar) < 0)) $x_ar[$x] += 1E7;
            }
            if ($x_ar[$cx] < $car + $bar) {
        	$car = 0; --$q;
        	for ($y = 0, $x = $cx-$cy-1; $y <= $cy; ++$y,++$x) {
                    if ($car = (($x_ar[$x] += $y_ar[$y] + $car) > 1E7)) {
                        $x_ar[$x] -= 1E7;
        	    }
        	}
            }   
        }
        array_pop($x_ar);
        array_unshift($q_ar, $q);

        $cx = count($x_ar) - 1;
    }

    $d_ar = array();
    if ($dd != 1) {
        $car = 0;
        $x_rar = array_reverse($x_ar);
        foreach ($x_rar as $x) {
            $prd = $car*1E7 + $x;
            $car = $prd - ($tmp = intval($prd / $dd)) * $dd;
            array_unshift($d_ar, $tmp);
        }
    } else {
        $d_ar = $x_ar;
    }
    array_push($d_ar, 0);

    return array(external($q_ar), external($d_ar));
}

/*---------------------------------------------------------------------------*/
?>