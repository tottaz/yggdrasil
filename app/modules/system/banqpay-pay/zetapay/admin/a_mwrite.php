<?
$a = mysql_fetch_object(mysql_query("SELECT * FROM zetapay_mailing WHERE id='".addslashes($_REQUEST['id'])."'"));

if ($_POST['message'] && $a)
{
  wrapmail($a->email, $_POST['subject'], $_POST['message'], $defaultmail2);
  die("Your email was sent.");
}
?>
<CENTER>
<TABLE class=design cellspacing=0>
<FORM method=post>

<TR><TH colspan=2>Send Email
<TR><TD>To:
	<TD>
	<b><?=$a->email?></b><BR>
<TR><TD>Subject:
	<TD><INPUT type=text size=30 name=subject>
<TR><TD>Message:
	<TD><TEXTAREA cols=60 rows=8 name=message><? echo $emailtop,($emailbottom ? "\n" : ""),$emailbottom; ?></TEXTAREA>
<TR><TH colspan=2>
    <INPUT type=submit value='Send Mail'>
</TH>
<?=$id_post?>
</FORM>
</TABLE>
</CENTER>