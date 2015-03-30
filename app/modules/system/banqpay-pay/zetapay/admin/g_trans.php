<?
// $_fpr_add
// $_fpr_rep, $_fpr_err, $_fpr_data, $_fpr_orig, $i, $j
$_fpr_rep = error_reporting(0);
unset($_fpr_data);
unset($_fpr_orig);
unset($_fpr_err);

function _fpr_fail($msg, $var, $limit = 0)
{
  global $_fpr_data, $_fpr_orig, $_fpr_err;
  $_fpr_err[$var] = 1;
  echo "<div class=error>$msg</div>\n";
  if (!$limit) $_fpr_data[$var] = $_fpr_orig[$var];
    else $_fpr_data[$var] = substr($_fpr_data[$var], 0, $limit);
}

function _fpr_range($value, $range)
{
  if ($value == '') return true;
  $x = explode(',', $range);
  while (list($k,$v) = each($x))
  {
    if (is_int(strpos($v, '-')))
    {
      $r = explode('-', $v);
      if ($value >= $r[0] && $value <= $r[1]) continue;
    }
    if (substr($v, 0, 2) == '<=' && $value <= substr($v, 2)) continue;
    if (substr($v, 0, 1) == '<' && $value < substr($v, 1)) continue;
    if (substr($v, 0, 2) == '>=' && $value >= substr($v, 2)) continue;
    if (substr($v, 0, 1) == '>' && $value > substr($v, 1)) continue;
    return false;
  }
  return true;
}

$_GET['id'] = addslashes($_GET['id']);

if (!$_fpr_add)
{
  $_fpr_data = mysql_fetch_array(mysql_query(
    "SELECT * FROM zetapay_transactions WHERE id='{$_GET['id']}'"
  ), MYSQL_ASSOC);
  $_fpr_orig = $_fpr_data;
}

if ($_POST['0b'])
{
  // Check Amount (amount)
  $_fpr_data['amount'] = trim($_POST['amount']);
  if ($_fpr_data['amount'] == '')
    _fpr_fail("Please enter Amount", 'amount');
  else
    $_fpr_data['amount'] = (double)$_fpr_data['amount'];
  if (!_fpr_range($_fpr_data['amount'], '>0'))
    _fpr_fail("You have entered an incorrect value for Amount", 'amount');

  // Check Comment (comment)
  $_fpr_data['comment'] = trim($_POST['comment']);
  if (strlen($_fpr_data['comment']) > 40)
    _fpr_fail("Comment should be no longer than 40 characters", 'comment', 40);

  // Check Order No (orderno)
  $_fpr_data['orderno'] = trim($_POST['orderno']);
  if (strlen($_fpr_data['orderno']) > 40)
    _fpr_fail("Order No should be no longer than 40 characters", 'orderno', 40);

  // Check Additional (addinfo)
  $_fpr_data['addinfo'] = trim($_POST['addinfo']);

  // Check Pending (pending)
  $_fpr_data['pending'] = ($_POST['pending'] ? 1 : 0);

  // Check Fees (fees)
  $_fpr_data['fees'] = trim($_POST['fees']);
  $_fpr_data['fees'] = (double)$_fpr_data['fees'];
  if (!_fpr_range($_fpr_data['fees'], '>0'))
    _fpr_fail("You have entered an incorrect value for Fees", 'fees');

  if ($_fpr_err) echo '<br>';
}

if ($_POST['0b'] && !$_fpr_err)
{
  unset($j);
  while ($i = each($_fpr_data))
    $j[$i[0]] = addslashes($i[1]);

  if ($_fpr_add)
  {
    transact('','',$j['amount'],$j['comment'],'',$j['fees'],$j['pending'],$j['addinfo'],$j['orderno']);  }

  else
  {
    $i = mysql_query("UPDATE zetapay_transactions SET amount='{$j['amount']}',comment='{$j['comment']}',pending='{$j['pending']}',orderno='{$j['orderno']}',addinfo='{$j['addinfo']}',fees='{$j['fees']}' WHERE id='{$_GET['id']}'");
  }
  if (!$i) $_fpr_err = 'query';
}
else
{
?>
<div align=center>
<table class=design cellspacing=0>
<form method=post>

<!-- Row 1 -->
<tr>
  <th colspan=2 class=>
    Transaction Record
</tr>

<!-- Row 2 -->
<tr>
  <td>
    <span<?=($_fpr_err['amount'] ? ' class=error' : '')?>>Amount:</span>
  <td>
    <input type=text name="amount" value="<?=$_fpr_data['amount']?>" size=10>
</tr>

<!-- Row 3 -->
<tr>
  <td>
    <span<?=($_fpr_err['comment'] ? ' class=error' : '')?>>Comment:</span>
  <td>
    <input type=text name="comment" size=40 maxLength=40 value="<?=htmlspecialchars($_fpr_data['comment'])?>">
</tr>

<!-- Row 4 -->
<tr>
  <td>
    <span<?=($_fpr_err['orderno'] ? ' class=error' : '')?>>Order No:</span>
  <td>
    <input type=text name="orderno" size=40 maxLength=40 value="<?=htmlspecialchars($_fpr_data['orderno'])?>">
</tr>

<!-- Row 5 -->
<tr>
  <td>
    <span<?=($_fpr_err['addinfo'] ? ' class=error' : '')?>>Additional:</span>
  <td>
    <textarea name="addinfo" cols=40 rows=4><?=htmlspecialchars($_fpr_data['addinfo'])?></textarea>
</tr>

<!-- Row 6 -->
<tr>
  <td colspan=2>
    <input type=checkbox class=checkbox name="pending" value=1<?=($_fpr_data['pending'] ? ' checked' : '')?>>
    This amount is pending
</tr>

<tr>
  <td>
    <span<?=($_fpr_err['fees'] ? ' class=error' : '')?>>Fees:</span> <small>(where applicable)</small>
  <td>
    <input type=text name="fees" value="<?=$_fpr_data['fees']?>" size=10>
</tr>

<!-- Row 7 -->
<tr>
  <th colspan=2 class=submit>
    <input type=submit class=button name=0b value="Submit &gt;&gt;">
</th>
</tr>

</form>
</table>
</div>
<?
  $_fpr_err = 'form';
}
error_reporting($_fpr_rep);
?>