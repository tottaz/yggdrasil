<?
	$qr = mysql_query("SELECT * FROM zetapay_users WHERE NOW()>DATE_ADD(lastlogin, INTERVAL ".($suspend_days - $suspend_notice)." DAY)");
	while ($r = mysql_fetch_object($qr)){
		$balance = balance($r->id);
		if ($balance >= 0) continue;
		$tr = (int)(strtotime(time() - $r->lastlogin) / 86400);
		if ($tr > $suspend_days){
			wrapmail($r->email, "$sitename Account Suspended", 
			$emailtop.gettemplate("email_suspend_warn", "$siteurl/{$r->type}.php?a=account", $balance, $suspend_notice).$emailbottom, 
			$defaultmail);
		}else{
			wrapmail($r->email, "$sitename Account", 
			$emailtop.gettemplate("email_suspend", "$siteurl/{$r->type}.php?a=account", $adminemail, $suspend_days).$emailbottom, 
			$defaultmail);
		}
	}
?>