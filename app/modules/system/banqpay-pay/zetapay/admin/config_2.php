<?
	if ($_POST['change2'] && $action == 'config'){
		$a_int = array(
			'att_max_size', 'max_feedback_len', 'max_comment_len', 'suspend_days', 'suspend_notice',
			'ulist_page','cobrand','securelogin','turing_difficulty'
		);
		$a_string = array(
			'sitename', 'siteurl', 'superpass', 'att_path', 'bkp_path', 'adminemail', 'replymail'
		);
		$a_check = array(
			'cat_multi', 'att_enable', 'allow_same_email', 'dep_notify', 'wdr_notify',
			'display_categories', 'featured_show_all','useturingnumber','allow_same_ip',
			'use_escrow','use_sell','use_send','use_req','use_pin','use_subscription','use_donate','use_shop',
			'use_wysiwyg','mail_html','block_view_source','announcements','use_iplogging','use_mass'
		);
		$a_textarea = array(
			'emailtop', 'emailbottom'
		);
		mysql_query("DELETE FROM zetapay_config");
		$str = "<?\n";
		while ($a = each($_POST)){
			if (substr($a[0], 0, 9) == 'separator'){
//				$str .= "\n// $a[1]\n";
			}elseif (in_array($a[0], $a_int)){
//				$str .= '$'."{$a[0]} = ".(int)$a[1].";\n";
				$name = $a[0];
				$value = (int)$a[1];
			}elseif (in_array($a[0], $a_string)){
//				$str .= '$'."{$a[0]} = \"".preg_replace("/[\"\\\\]/", "\\\\\\0", $a[1])."\";\n";
				$name = $a[0];
				$value = preg_replace("/[\"\\\\]/", "\\\\\\0", $a[1]);
			}elseif (in_array($a[0], $a_check)){
//				$str .= '$'."{$a[0]} = ".($a[1] ? '1' : '0').";\n";
				$name = $a[0];
				$value = ($a[1] ? '1' : '0');
			}elseif (in_array($a[0], $a_textarea)){
//				$str .= '$'."{$a[0]} = \"".str_replace(array("\r","\n"), array("","\\n"), preg_replace("/[\"\\\\]/", "\\\\\\0", $a[1]))."\";\n";
				$name = $a[0];
				$value = str_replace(
							array("\r","\n"), array("","\\n"), 
							preg_replace("/[\"\\\\]/", "\\\\\\0", $a[1])
						);
			}
			if($name){
				mysql_query("INSERT INTO zetapay_config SET name='$name',value='$value'");
			}
		}
		$str .= "\n?>";
/*
		$f = fopen("config.php", "w");
		if ($f){
			fwrite($f, $str);
			fclose($f);
			echo "<div style='color: red;'>Update variables successful.</div><br>";
		}else{
			echo "<div style='color: red;'>Update variables failed. Check write permissions for file \"config.php\".</div><br>";
		}
*/
		echo "<div style='color: red;'>Update variables successful.</div><br>";
		include("config.php");
	}
?>
<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
Site Options, General<input type=hidden name=separator1 value="SITE">:
</b></div>
<!------///////////////--->
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding-left:10px;">&nbsp;</td>
	<TD>
		<TABLE class=design width=100% cellspacing=0>
		<!-- SITE -->
		<TR><TD width=60%><b>Site Name</b> - Your website Title (e.g. "zetapay")
			<TD><input type=text size=40 name=sitename value="<?=htmlspecialchars($sitename)?>">
		<TR><TD width=60%><b>Site URL</b> - Your site URL. Must include "http://" in the beginning and must not include trailing slash. (e.g. "http://www.zetapay.com")</TD>
			<TD><input type=text size=40 name=siteurl value="<?=htmlspecialchars($siteurl)?>"></TD></TR>
		<TR><TD width=60%><b>Admin Email Address</b> - Main admin's email address. Notifications about money transfers will be sent to this address.</TD>
			<TD><input type=text size=40 name=adminemail value="<?=htmlspecialchars($adminemail)?>"></TD></TR>
		<TR><TD width=60%><b>Email Auto Replies</b> - Reply-To email for some outgoing letters. This should be some ficticious "drop" mailbox (e.g. donotreply@donotreply.com).</TD>
			<TD><input type=text size=40 name=replymail value="<?=htmlspecialchars($replymail)?>"></TD></TR>
		<TR><TD width=60%><b>Admin Panel Password</b> - Administration password. This password will be used to access the administration part of the site. To change it just enter one that you will easily remember and click "Update Variables" below. <b>NOTE:</b> Same username (e.g. admin/admin) will allow you to login and administer user interface.
			<TD><input type=text size=40 name=superpass value="<?=htmlspecialchars($superpass)?>">
		</table>
	</TD>
</TR>
</TABLE>
<br>
<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
Site Options, Other
</b></div>
<!------\\\\\\\\\\\\\\\--->
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding-left:10px;">&nbsp;</td>
	<TD>
		<TABLE class=design width=100% cellspacing=0>
		<TR><TD width=60%><b>Upload Directory</b> - Path where uploaded files are stored. It should exist and should have write permissions (CHMOD 777) for PHP. Default: "files/"</TD>
			<TD><input type=text size=40 name=att_path value="<?=htmlspecialchars($att_path)?>"></TD></TR>
		<TR><TD width=60%><b>Backup Site</b> - Path to backup files are stored. It should exist and should have write permissions (CHMOD 777) for PHP. Default: "backup/"</TD>
			<TD><input type=text size=40 name=bkp_path value="<?=htmlspecialchars($bkp_path)?>"></TD></TR>
		<TR><TD width=60%><b>Use Turing Number</b> - Use a Turing Number on Signup. <br><FONT COLOR="#008000"><b>We Recommend: Enable</b></TD>
			<TD><input type=checkbox class=checkbox name=useturingnumber value=1 <? if ($useturingnumber) echo 'checked'; ?>></TD></TR>
		<TR><TD width=60%><b>Send Mail in HTML format?</b> - Use this to send e-mails as HTML or text. <br><FONT COLOR="#008000"><b>We Recommend: Enable</b></TD>
			<TD><input type=checkbox class=checkbox name=mail_html value=1 <? if ($mail_html) echo 'checked'; ?>></TD></TR>
		<TR><TD width=60%><b>Use WYSIWYG Editor</b> - Use a WYSIWYG Editor for editing templates. <br><FONT COLOR="#008000"><b>We Recommend: Enable only if you are using IE</b></TD>
			<TD><input type=checkbox class=checkbox name=use_wysiwyg value=1 <? if ($use_wysiwyg) echo 'checked'; ?>></TD></TR>
		<TR><TD width=60%><b>Block View Source</b> - You can enable this if you want to encrypt all HTML output for your system. Users would see an encrypted block if they tried to use the "View Source" button in their browsers. <br><FONT COLOR="#008000"><b>We Recommend: Enable</b></TD>
			<TD><input type=checkbox class=checkbox name=block_view_source value=1 <? if ($block_view_source) echo 'checked'; ?>></TD></TR>
		<TR><TD width=60%><b>Log IP logins</b> - You can enable this if you want to log all logins into your system.<br><FONT COLOR="#008000"><b>We Recommend: Enable</b></TD>
			<TD><input type=checkbox class=checkbox name=use_iplogging value=1 <? if ($use_iplogging) echo 'checked'; ?>></TD></TR>
		<TR><TD width=60%><b>Announcements</b> - You can enable this if you want to use the announcement system.<br><FONT COLOR="#008000"><b>We Recommend: Enable</b></TD>
			<TD><input type=checkbox class=checkbox name=announcements value=1 <? if ($announcements) echo 'checked'; ?>></TD></TR>
		<TR><TD width=60%><b>Turing Difficulty</b> - How difficult do you want the turing number to be? 1-3. Default: "1"</TD>
			<TD><input type=text size=5 name=turing_difficulty value="<?=htmlspecialchars($turing_difficulty)?>"></TD></TR>
		<TR><TD width=60%><b>Suspensions</b> - Number of days before suspending an account. The account will become suspended if a user has negative summ of money in his account and he doesn't deposit the money in the specified amount of days. Default: "30"</TD>
			<TD><input type=text size=10 name=suspend_days value="<?=htmlspecialchars($suspend_days)?>"></TD></TR>
		<TR><TD width=60%><b>Suspension Notice</b> - When to send account suspension notification. If you specify, for example "3", then a user will receive 3 letters, one each day, before account suspension. Default: "5"</TD>
			<TD><input type=text size=10 name=suspend_notice value="<?=htmlspecialchars($suspend_notice)?>"></TD></TR>
		<TR><TD width=60%><b>IP Address - Multiple Accounts</b> - Allow to register multiple accounts with one IP address. <br><FONT COLOR="#008000"><b>We Recommend: Disable</b></TD>
			<TD><input type=checkbox class=checkbox name=allow_same_ip value=1 <? if ($allow_same_ip) echo 'checked'; ?>></TD></TR>
		<TR><TD width=60%><b>Email - Multiple Accounts</b> - Allow to register multiple accounts with one email address. <br><FONT COLOR="#008000"><b>We Recommend: Disable</b></TD>
			<TD><input type=checkbox class=checkbox name=allow_same_email value=1 <? if ($allow_same_email) echo 'checked'; ?>></TD></TR>
		<TR><TD width=60%><b>Allow Secure Login</b> - Allows you to set the admin part of your side to allow only one administrator to be logged in to a time. <br><FONT COLOR="#008000"><b>We recommend: Enable</b></FONT></TD>
			<TD><input type=checkbox class=checkbox name=securelogin value=1 <? if ($securelogin) echo 'checked'; ?>></TD></TR>
		</table>
	</TD>
</TR>
</TABLE>
<br>
<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
User options <input type=hidden name=separator3 value="EMAIL">
</b></div>
<!------\\\\\\\\\\\\\\\--->
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding-left:10px;">&nbsp;</td>
	<TD>
		<TABLE class=design width=100% cellspacing=0>
		<TR><TD width=60%><b>Allow Pin</b> - Allows users to have to enter a pin number for transactions. <br><FONT COLOR="#008000"><b>We recommend: Enable</b></FONT></TD>
			<TD><input type=checkbox class=checkbox name=use_pin value=1 <? if ($use_pin) echo 'checked'; ?>></TD></TR>
		<TR><TD width=60%><b>Allow Send Money</b> - Allows users to use the Send Money feature. <br><FONT COLOR="#008000"><b>We recommend: Enable</b></FONT></TD>
			<TD><input type=checkbox class=checkbox name=use_send value=1 <? if ($use_send) echo 'checked'; ?>></TD></TR>
		<TR><TD width=60%><b>Allow Request Money</b> - Allows users to use the Request Money feature. <br><FONT COLOR="#008000"><b>We recommend: Enable</b></FONT></TD>
			<TD><input type=checkbox class=checkbox name=use_req value=1 <? if ($use_req) echo 'checked'; ?>></TD></TR>
		<TR><TD width=60%><b>Allow Escrow</b> - Allows users to use the Escrow system. <br><FONT COLOR="#008000"><b>We recommend: Enable</b></FONT></TD>
			<TD><input type=checkbox class=checkbox name=use_escrow value=1 <? if ($use_escrow) echo 'checked'; ?>></TD></TR>
		<TR><TD width=60%><b>Allow Sell</b> - Allows users to use your site to sell items<br><FONT COLOR="#008000"><b>We recommend: Enable</b></FONT></TD>
			<TD><input type=checkbox class=checkbox name=use_sell value=1 <? if ($use_sell) echo 'checked'; ?>></TD></TR>
		<TR><TD width=60%><b>Allow Shop</b> - Allows users to list their web sites in your shop section<br><FONT COLOR="#008000"><b>We recommend: Enable</b></FONT></TD>
			<TD><input type=checkbox class=checkbox name=use_shop value=1 <? if ($use_shop) echo 'checked'; ?>></TD></TR>
		<TR><TD width=60%><b>Allow Donate System</b> - Allows users to create donation buttons?<br><FONT COLOR="#008000"><b>We recommend: Enable</b></FONT></TD>
			<TD><input type=checkbox class=checkbox name=use_donate value=1 <? if ($use_donate) echo 'checked'; ?>></TD></TR>
		<TR><TD width=60%><b>Allow Subscription System</b> - Allows users to create subscriptions?<br><FONT COLOR="#008000"><b>We recommend: Enable</b></FONT></TD>
			<TD><input type=checkbox class=checkbox name=use_subscription value=1 <? if ($use_subscription) echo 'checked'; ?>></TD></TR>
		<TR><TD width=60%><b>Allow Mass Pay</b> - Allows users to perform Mass Payments or Mass Payment Requests. <br><FONT COLOR="#008000"><b>We recommend: Enable</b></FONT></TD>
			<TD><input type=checkbox class=checkbox name=use_mass value=1 <? if ($use_mass) echo 'checked'; ?>></TD></TR>
		</table>
	</TD>
</TR>
</TABLE>
<br>
<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
Admin E-Mail options <input type=hidden name=separator3 value="EMAIL">
</b></div>
<!------\\\\\\\\\\\\\\\--->
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding-left:10px;">&nbsp;</td>
	<TD>
		<TABLE class=design width=100% cellspacing=0>
		<TR><TD width=60%><b>Header</b> - Header for all outgoing letters. If you want to separate header from message text, hit enter at the bottom line.</TD>
			<TD><textarea name=emailtop cols=45 rows=6><?=htmlspecialchars($emailtop)?></textarea></TD></TR>
		<TR><TD width=60%><b>Footer</b> - Footer for all outgoing letters. If you want to separate message text from footer, hit enter at the top line.</TD>
			<TD><textarea name=emailbottom cols=45 rows=6><?=htmlspecialchars($emailbottom)?></textarea></TD></TR>
		</TABLE>
	</TD>
</TR>
</TABLE>
<BR>
<TABLE class=design width=100% cellspacing=0>
<TR><th colspan=2 class=submit><input type=submit name=change2 value="Update variables">
</TD></TR>
</TABLE>
</TD>