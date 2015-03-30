<?
    include('config.php');  

	$root_dir="zetapay/";	
	require_once($rootDir.$subDir.'core/include/common.php');

	$cyclep["D"]="Day(s)";
	$cyclep["W"]="Week(s)";
	$cyclep["M"]="Month(s)";
	$cyclep["Y"]="Year(s)";
	$acyclep["D"]="DAY";
	$acyclep["W"]="DAY";
	$acyclep["M"]="MONTH";
	$acyclep["Y"]="YEAR";
?>
<?
//	$r = $zetadb->Execute("SELECT * FROM merchant_recur");
    $r = $zetadb->Execute("SELECT * FROM user_subscriptions WHERE ticks>'0' and subscription_type='rss-feeds'");
    
	while ($a = $r->FetchNextObject()){
		if($a->TICKS == 1){
			$last = 0;
		}else{
			$last = $a->TICKS - 1;
		}
		$dateStr = $a->CREATED;
		$today = date( "Y-m-d", time() );
		if($a->CYCLE_P == "W"){
			$a->CYCLE_D = $a->CYCLE_D * 7;
			$a->STOP = $a->STOP * 7;
		}
		$sqla  = "SELECT DATE_ADD('$dateStr', INTERVAL ".$a->STOP." ".$acyclep[$a->CYCLE_P].") AS expire,";
		$sqla .= " DATE_ADD('$dateStr', INTERVAL ".$last." ".$acyclep[$a->CYCLE_P].") AS last,";
		$sqla .= " DATE_ADD('$dateStr', INTERVAL ".($a->TICKS * $a->CYCLE_D)." ".$acyclep[$a->CYCLE_P].") AS next";
		$sqla .= " FROM user_subscriptions WHERE id=".$a->ID;
        $rs = $zetadb->Execute($sqla);
		$k = $rs->FetchNextObject();

		$sqla  = "SELECT DATE_ADD('".$k->LAST."', INTERVAL ".$a->CYCLE_D." ".$acyclep[$a->CYCLE_P].") AS next";
		$sqla .= " FROM user_subscriptions WHERE id=".$a->ID;
        $rs = $zetadb->Execute($sqla);
		$d = $rs->FetchNextObject();
		if( dpdate4($k->EXPIRE) == $today ){
			// expired
			$zetadb->Execute("UPDATE user_subscriptions SET ticks=0 WHERE id={$a->ID}");
            //			mysql_query("DELETE FROM zetapay_recur WHERE id={$a->id}");
		} else if ( dpdate4($d->NEXT) == $today ){
			// time to get money
			$balance = balance($a->USER);
			$amount = $a->AMOUNT;
			$id = $a->ID;
			$amount = myround($amount);
			$whofrom = dpObj($a->USER);
			$merch = dpObj2($a->MERCHANT_ID);
			// Check funds
			if ($balance < $amount){
				// send out error email
				$text = "A subscription payment was due today\n";
				$text .= "Please pay ".$currency.$amount." to ".$merch->EMAIL ."ASAP\n";
				$text .= "Thank you\n";
				wrapmail($whofrom->email, "Missed Subscription Payment", $emailtop.$text.$emailbottom, $defaultmail);
			}else{
				$comments = "Subscription Renewal";
				transact($a->USER,$a->MERCHANT_ID,$amount,$comments,'','');
       			$zetadb->Execute("UPDATE user_subscriptions SET ticks = ticks + 1 WHERE id={$a->ID}");
			}
		}
	}
?>