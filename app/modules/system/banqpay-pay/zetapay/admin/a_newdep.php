<?$_add = 1;
include("admin/g_deposit.php");
if (!$formerr)
  echo "$currency{$form['amount']} was added to user's account.",$reload_left;
?>