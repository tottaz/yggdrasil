<?	if($use_wysiwyg){	?>
		<script>
			<!--
				_editor_url = "<?=$siteurl?>/zetapay/editor/";
				document.write('<scr'+'ipt src="' +_editor_url+ 'editor.js" language="JavaScript1.2"></scr'+'ipt>');
				var config = new Object(); // create new config object
				config.bodyStyle = 'background-color: white; font-family: "Verdana"; font-size: x-small;';
				config.debug = 0;
				config.toolbar = [
					['fontname'],
					['fontsize'],
					['bold','italic','underline','separator'],
					['justifyleft','justifycenter','justifyright','separator'],
					['OrderedList','UnOrderedList','Outdent','Indent','separator'],
					['forecolor','backcolor','separator'],
					['HorizontalRule','Createlink','InsertImage','htmlmode','popupeditor','separator'],
				]; 
			//-->
		</script>
<?	}	?>
<?
	$grouplist = array(
		"email" => "Common email templates",
		"html" => "Common page templates",
		"email_adm" => "Admin email templates",
		"funds" => "Email templates when money is requested / sent",
		"billing" => "invoice / receipt templates"
	);
	$email = array(
		"email_remindpsw" => "Email sent when a member requests his username and password.\n\n[info] = username\n[addinfo] = password",
		"email_signup" => "Email with URL leading to Step 2 of signup process.\n\n",
		"email_edit" => "Email with URL designated for members email change confirmation.\n\n",
		"email_suspend_warn" => "Email sent if a user has negative balance and does not login into his account for a long time.\n\n[info] = balance\n[addinfo] = days left",
		"email_suspend" => "Email sent to a user when his account gets suspended due to negative balance.\n\n[info] = admin email\n[addinfo] = inactive days"
	);
	$funds = array(
		"reqpay_unknown" => "Email sent to an unknown user when a request for money is made\n\n",
		"reqpay_email" => "Email sent to an $sitename member when a request for money is made\n\n",
		"transfer_unknown" => "Email sent to an unknown user when money is sent to them\n\n",
		"transfer_email" => "Email sent to an $sitename member when money is sent to them\n\n" 
	);
	$html = array(
		"html_remindpsw" => "Page displayed when a member requests his username and password.\n\n",
		"html_signup" => "Page displayed when a user completes Step 1 of signup process.\n\n",
		"html_edit" => "Page displayed when a member changes his email address.\n\n"
	);
	$email_adm = array(
		"email_new_user" => "Email sent to admin when a new user signs up.\n\n[info] = user email",
	);
	$billing = array(
		"invoice" => "Email sent when a user does a transaction",
		"receipt" => "Email sent when a user does a transaction"
	);

	function generate_group($group, $title){
		global $GLOBALS,$use_wysiwyg,$fieldlist;
?>
		<!------///////////////--->
		<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
		<?=$title?>
		</b></div>
		<!------\\\\\\\\\\\\\\\--->
		<TABLE width=100% cellspacing=0>
		<tr>
			<td style="padding-left:10px;">&nbsp;</td>
			<TD>
<?
		reset($GLOBALS[$group]);
		while ($a = each($GLOBALS[$group])){
			list($value) = mysql_fetch_row(mysql_query("SELECT title FROM zetapay_templates WHERE id='$a[0]'"));
			echo "<TABLE class=design width=100% cellspacing=0>\n";
			echo "<TR>\n",
				 "<TD valign=top><B>$a[0]</B><BR>",
				 "<small>",nl2br($a[1]),"</small>\n";
			if($use_wysiwyg){
				echo "<TR>\n",
					 "<TD><TEXTAREA cols=100 rows=10 name=$a[0]>",nl2br( htmlspecialchars($value) ),"</TEXTAREA>";
				$fieldlist[] = $a[0];
			}else{
				echo "<TR>\n",
					 "<TD><TEXTAREA cols=100 rows=10 name=$a[0]>",htmlspecialchars($value),"</TEXTAREA>";
			}
			echo "</TABLE><br>\n";
		}
?>
			</td>
		</table>
		<br>
<?
	}

	function update_group($group){
		global $GLOBALS, $_POST;
		while ( $a = each($GLOBALS[$group]) ){
			mysql_query("UPDATE zetapay_templates SET title='".addslashes($_POST[$a[0]])."' WHERE id='$a[0]'");
		}
	}

	if ($_POST['change1']){
		update_group($_POST['editgrp']);
/*
		update_group("email");
		update_group("html");
		update_group("email_adm");
		update_group("funds");
		update_group("billing");
*/
	}
?>
	<TABLE class=design width=100% cellspacing=0>
	<tr><TD>
		<small>
		Strings in square will be replaced with appropriate values. The following patterns are supported:
		<li>[sitename] - Site Mame</li>
		<li>[siteurl] - Site's URL</li>
		<li>[username] - Current member's name</li>
		<li>[usersite] - Current member's site name</li>
		<li>[account] - Link to member's account, makes sense only in page templates</li>
		<li>[url] - Link to related content, makes sense only in some page templates</li>
		<li>[info] - Some information, content differs for each template</li>
		<li>[addinfo] - Additional information, content differs for each template</li>
		<br>
		</small>
	</td></tr>
	</table>
	<Br><form method=post>
	<TABLE class=design width=100% cellspacing=0>
	<tr><TD>
		<small>
		Please Choose a group to edit:
		<select name='editgrp' onChange='self.form1.submit();'>
			<option value="">--- Please Select one ---</option>
<?
		while( list($title,$caption) = each($grouplist) ){
			echo "<option value='$title'";
			if($title == $_POST['editgrp']){
				echo "SELECTED";
			}
			echo ">$caption</option>\n";
		}
?>
		</select>
		<br>
		</small>
	</td></tr>
	</table>
	<Br>
<?
	if($_POST['editgrp']){
		generate_group( $_POST['editgrp'], $grouplist[$_POST['editgrp']] );
/*
		generate_group("html", "Common page templates");
		generate_group("email_adm", "Admin email templates");
		generate_group("funds", "Email templates when money is requested / sent");
		generate_group("billing", "invoice / receipt templates");
*/
	}
?>
	<br>
	<TABLE class=design width=100% cellspacing=0>
	<TR><TH colspan=2><INPUT type=submit name=change1 value="Update templates">
	</TABLE>
<?	if($use_wysiwyg){	?>
		<script language="JavaScript1.2">
<?		while( list(,$field) = each($fieldlist) ){	?>
				editor_generate('<?=$field?>',config);
<?		}	?>
		</script>
<?	}	?>