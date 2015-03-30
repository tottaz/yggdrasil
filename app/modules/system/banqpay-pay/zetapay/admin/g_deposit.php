<?
$formrep = error_reporting(0);
unset($form);
unset($formx);
unset($formerr);

function form_fail($msg, $var, $limit = 0)
{
  global $form, $formx, $formerr;
  $formerr[$var] = 1;
  echo "<div class=error>$msg</div>\n";
  if (!$limit) $form[$var] = $formx[$var];
    else $form[$var] = substr($form[$var], 0, $limit);
}

if (!$_add)
{
  $form['id'] = addslashes($GLOBALS['_'.$_SERVER['REQUEST_METHOD']]['id']);
  $form = mysql_fetch_array(mysql_query(
    "SELECT * FROM zetapay_transactions WHERE id='{$form['id']}'"
  ), MYSQL_ASSOC);
  $formx = $form;
}

if ($_POST['de'])
{
  // Check User
  list($uid) = mysql_fetch_row(mysql_query("SELECT id FROM zetapay_users WHERE username='".addslashes($_POST['user'])."'"));
  if (!$uid)
    form_fail("There are no users with the specified username", 'user');
  
  // Check Description (comment)
  $form['comment'] = trim($_POST['comment']);
  if ($form['comment'] == '')
    form_fail("Please enter Description", 'comment');
  elseif (strlen($form['comment']) > 40)
    form_fail("Description should be no longer than 40 characters", 'comment', 40);

  // Check Deposit amount (amount)
  $form['amount'] = trim($_POST['amount']);
  if ($form['amount'] == '')
    form_fail("Please enter Deposit amount", 'amount');
  else
    $form['amount'] = (double)$form['amount'];
  if ($form['amount'] <= 0)
    form_fail("You have entered an incorrect value for Amount", 'amount');

  // Check Fees (fees)
  $form['fees'] = trim($_POST['fees']);
  $form['fees'] = (double)$form['fees'];
  if ($form['fees'] < 0)
    form_fail("You have entered an incorrect value for Fees", 'fees');

  // Check Order No (orderno)
  $form['orderno'] = trim($_POST['orderno']);
  if (strlen($form['orderno']) > 40)
    form_fail("Order No should be no longer than 40 characters", 'orderno', 40);

  // Check Additional info (addinfo)
  $form['addinfo'] = trim($_POST['addinfo']);

  if ($formerr) echo '<br>';
}

if ($_POST['de'] && !$formerr)
{
  while ($i = each($form))
    $formx[$i[0]] = addslashes($i[1]);

  if ($_add)
  {
    transact( (int)$_POST['type'],$uid,$formx['amount'],$formx['comment'],'',$formx['fees'],'',$formx['addinfo'],$formx['orderno'] );
  }
}
else
{
?>
<!------///////////////--->
<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
Make new deposit
</b></div>
<!------\\\\\\\\\\\\\\\--->
<TABLE width=100% cellspacing=0>
<tr>
	<td style="padding-left:10px;">&nbsp;</td>
	<TD>
		<TABLE class=design cellspacing=0 width=90%>
		<FORM method=post>
		<!-- Row 2 -->
		<TR><TD><SPAN<?=($formerr['paidto'] ? ' class=error' : '')?>>Members Name:</SPAN>
			<TD><INPUT type=text name=user value="<?=$form['paidto']?>"></TR>

		<!-- Row 3 -->
		<TR><TD>Deposit Type:
			<TD><SELECT name=type>
			  <OPTION value=1>Other (not displayed in reports)
			  <OPTION value=11>PayPal
			  <OPTION value=15>E-Gold
			  <OPTION value=17>Authorize.Net
			  <OPTION value=18>NetPay
			  <OPTION value=12>Check</SELECT></TR>

		<!-- Row 4 -->
		<TR><td><SPAN<?=($formerr['comment'] ? ' class=error' : '')?>>Description:</SPAN>
			<TD><INPUT type=text name="comment" size=40 maxLength=40 value="<?=htmlspecialchars($form['comment'])?>"></TR>

		<!-- Row 5 -->
		<TR><TD><SPAN<?=($formerr['amount'] ? ' class=error' : '')?>>Deposit amount:</SPAN>
			<TD><?=$currency?> <input type=text name="amount" value="<?=$form['amount']?>" size=5></TR>

		<!-- Row 6 -->
		<TR><TD><SPAN<?=($formerr['fees'] ? ' class=error' : '')?>>Fees:</SPAN>
			<TD><?=$currency?> <INPUT type=text name="fees" value="<?=$form['fees']?>" size=5> 
			<SMALL>(In addition to withdrawal amount)</SMALL></TR>

		<!-- Row 7 -->
		<TR><TD><SPAN<?=($formerr['orderno'] ? ' class=error' : '')?>>Order No:</SPAN>
			<TD><INPUT type=text name="orderno" size=20 maxLength=40 value="<?=htmlspecialchars($form['orderno'])?>"></TR>

		<!-- Row 8 -->
		<TR><TD><SPAN<?=($formerr['addinfo'] ? ' class=error' : '')?>>Additional info:</SPAN>
			<TD><TEXTAREA name="addinfo" cols=40 rows=3><?=htmlspecialchars($form['addinfo'])?></TEXTAREA></TR>
		</TR>
		</TABLE>
		<BR>
		<TABLE class=design cellspacing=0 width=90%>
		<!-- Row 9 -->
		<TR><TH colspan=2 class=submit><INPUT type=submit class=button name=de value="Submit &gt;&gt;"></TH></TR>
		<!-- Pass variables -->
		<INPUT type=hidden name="id" value="<?=htmlspecialchars(stripslashes($form['id']))?>">
		</FORM>
		</TABLE>
	</TD>
</TR>
</TABLE>
<?
  $formerr[''] = 1;
}
error_reporting($formrep);
?>