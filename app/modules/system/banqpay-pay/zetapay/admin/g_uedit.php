<?
// $_fpr_add
// $_fpr_rep, $_fpr_err, $_fpr_data, $_fpr_orig, $i, $j, $_fpr_view
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

$_GET['id'] = addslashes($_GET['id']);

if (!$_fpr_add){
	$_fpr_data = mysql_fetch_array(mysql_query(
		"SELECT * FROM zetapay_users WHERE id='{$_GET['id']}'"
	), MYSQL_ASSOC);
	$_fpr_orig = $_fpr_data;
}

if ($_POST['77'])
{
  	// Check E-mail (email)
  	$_fpr_data['email'] = trim($_POST['email']);
  	if ($_fpr_data['email'] != '' && !email_check($_fpr_data['email']) ){
    	_fpr_fail("You have entered incorrect E-mail", 'email');
	}
  // Check Password (password)
  $_fpr_data['password'] = trim($_POST['password']);
  if (strlen($_fpr_data['password']) > 16)
    _fpr_fail("Password should be no longer than 16 characters", 'password', 16);
  elseif ($_fpr_data['password'] != '' && !preg_match("/^[\\w\\-]*$/i", $_fpr_data['password']))
    _fpr_fail("You have entered incorrect Password", 'password');

  // Check Full name (name)
  $_fpr_data['name'] = trim($_POST['name']);
  if (strlen($_fpr_data['name']) > 40)
    _fpr_fail("Full name should be no longer than 40 characters", 'name', 40);

  $_fpr_data['regnum'] = trim($_POST['regnum']);
  // Check Notify (notify)
  $_fpr_data['notify'] = ($_POST['notify'] ? 1 : 0);

  $_fpr_data['area'] = 0;
}

if ($_POST['77'] && !$_fpr_err)
{
  unset($j);
  while ($i = each($_POST)){
	$j[$i[0]] = addslashes($i[1]);
  }
  if ($_fpr_add){
  	$sql = "INSERT INTO zetapay_users SET username='{$j['username']}',email='{$j['email']}',password='{$j['password']}',name='{$j['name']}',regnum='{$j['regnum']}',notify='{$j['notify']}',payout='{$j['payout']}',hourlyrate='{$j['hourlyrate']}',state='{$j['state']}',zipcode='{$j['zipcode']}',country='{$j['country']}',phone1='{$j['phone1']}',fax='{$j['fax']}',cc_confirm='{$j['cc_confirm']}',p_confirm='{$j['p_confirm']}',ph_confirm='{$j['ph_confirm']}'";
  	$i = mysql_query($sql);
  }
  else
  {
    $sql = "UPDATE zetapay_users SET email='{$j['email']}',password='{$j['password']}',name='{$j['name']}',regnum='{$j['regnum']}',notify='{$j['notify']}',payout='{$j['payout']}',hourlyrate='{$j['hourlyrate']}',state='{$j['state']}',zipcode='{$j['zipcode']}',country='{$j['country']}',phone1='{$j['phone1']}',fax='{$j['fax']}',cc_confirm='{$j['cc_confirm']}',p_confirm='{$j['p_confirm']}',ph_confirm='{$j['ph_confirm']}' WHERE id='{$_GET['id']}'";
    $i = mysql_query($sql) or die( mysql_error("<bR>$sql<br>") );
  }
  if (!$i)
  {
    $_fpr_err = 'query';
    echo "<div class=error>",mysql_error(),"</div>";
  }
}
else
{
  if (!$_fpr_add)
    $_fpr_view = mysql_fetch_array(mysql_query(
      "SELECT username FROM zetapay_users WHERE id='{$_GET['id']}'"
    ), MYSQL_ASSOC);
?>
<SCRIPT LANGUAGE="JavaScript">
<?
	while (list($key) = @each($country_values)) {
		if ($key == "0"){continue;}
?>
		var <?=$key?>_array  =  new Array(
<?
		$states = $state_values[$key];
		$total = sizeof($states);
		$i = 0;
		while ( list($key, $val) = @each($states) ) {
			$i++;
			echo "\"$key:$val\"";
			if($i < $total) {
				echo ",\n";
			}
		} 
		echo ");\n";
	}
?>

function my_submit_form() {
	obj = eval("document.form1.expbox");
	ki = 0;
	if (obj){
		var iNumItems = obj.length;
		// create product order
		for (i = 0; i < iNumItems; i++ ){
			if( obj.options[i].selected ){
				if (ki == 1){
					document.form1.myExp.value += '|' + obj.options[i].value;
				}else{
					document.form1.myExp.value = obj.options[i].value;
					ki = 1;
				}
			}
		}
	}
}
function populate(selected) {
	document.form1.elements['state'].selectedIndex = 0;
	var mychoice = "<?=$_fpr_data['state']?>";
	var nochoice = 1;
	if ( eval(selected+"_array") ){
		var selectedArray = eval(selected+"_array");
		while (selectedArray.length < document.form1.elements['state'].options.length) {
			document.form1.elements['state'].options[(document.form1.elements['state'].options.length - 1)] = null;
		}
		eval("document.form1.elements['state'].options[0]=" + "new Option('--')");
		document.form1.elements['state'].options[0].value="0";
		for (var i=1; i < selectedArray.length; i++) {
			var id = selectedArray[i].substring(0,selectedArray[i].indexOf(":"));
			var val = selectedArray[i].substring(selectedArray[i].indexOf(":")+1, selectedArray[i].length);
			document.form1.elements['state'].options[i]=new Option(val);
			document.form1.elements['state'].options[i].value=id;
			if (id == mychoice){
				document.form1.elements['state'].selectedIndex = i;
				nochoice = 0;
			}
		}
	}else{
		document.form1.elements['state'].options[(document.form1.elements['state'].options.length - 1)] = null;
		eval("document.form1.elements['state'].options[0]=" + "new Option('--')");
		document.form1.elements['state'].options[0].value="0";
	}
	if (nochoice){
		document.form1.elements['state'].selectedIndex = 0;
	}
}
</script>
<div align=center>
<table class=design cellspacing=0>
<form method=post name="form1">
<input type="hidden" name="myExp">
<!-- Row 1 -->
<tr>
  <th colspan=3 class=>
<?	if(!$_fpr_add){	?>
    Edit User Record
<?	}else{	?>
    Add User Record
<?	}	?>
</tr>

<!-- Row 2 -->
<tr>
  <td>
    Username:
  <td colspan=2>
<?	if(!$_fpr_add){	?>
    <?=( $_fpr_view['username'] != '' ? nl2br(htmlspecialchars($_fpr_view['username'])) : '&nbsp;' )?>
<?	}else{	?>
    <input type=text name="username" size=30 maxLength=30 value="<?=htmlspecialchars($_fpr_data['username'])?>">
<?	}	?>
</tr>

<!-- Row 3 -->
<tr>
  <td>
    <span<?=($_fpr_err['email'] ? ' class=error' : '')?>>E-mail:</span>
  <td colspan=2>
    <input type=text name="email" size=30 value="<?=htmlspecialchars($_fpr_data['email'])?>">
</tr>

<!-- Row 4 -->
<tr>
  <td>
    <span<?=($_fpr_err['password'] ? ' class=error' : '')?>>Password:</span>
  <td colspan=2>
    <input type=text name="password" size=16 maxLength=16 value="<?=htmlspecialchars($_fpr_data['password'])?>">
</tr>

<!-- Row 5 -->
<tr>
  <td>
    <span<?=($_fpr_err['name'] ? ' class=error' : '')?>>Full name:</span>
  <td colspan=2>
    <input type=text name="name" size=30 maxLength=40 value="<?=htmlspecialchars($_fpr_data['name'])?>">
</tr>
<tr>
  <td>
    <span<?=($_fpr_err['regnum'] ? ' class=error' : '')?>>Company Registration Number:</span>
  <td colspan=2>
    <input type=text name="regnum" size=30 maxLength=40 value="<?=htmlspecialchars($_fpr_data['regnum'])?>">
</tr>
<TR>
	<TD>Address:</TD>
	<td colspan=2>
	<input type=text name=address size=40 maxLength=40 value="<?=htmlspecialchars($_fpr_data['address'])?>"></TD></TR>
<TR>
	<TD>City:<BR></TD>
	<td colspan=2><input type=text name=city size=40 maxLength=40 value="<?=htmlspecialchars($_fpr_data['city'])?>"></TD></TR>
<TR>
	<TD>Country:<BR></TD>
	<td colspan=2><? WriteCombo($country_values, "country", $_fpr_data['country'], 0,"onChange=\"populate(document.form1.country.options[document.form1.country.selectedIndex].value)\"");?></TD></TR>
<TR>
	<TD>State:<BR></TD>
<?
	if ($_fpr_data['country']){
		$state_array = $state_values[ $_fpr_data['country'] ];
	}
	if (!$state_array){
		$state_array = $state_values;
	}
?>
	<td colspan=2><? WriteCombo($state_array, "state", $_fpr_data['state'], 0);?></TD></TR>
<TR>
	<TD>Postal Code:<BR></TD>
	<td colspan=2><input type=text name=zipcode size=40 maxLength=40 value="<?=htmlspecialchars($_fpr_data['zipcode'])?>"></TD></TR>
<TR>
	<TD>Phone:<BR></TD>
	<td colspan=2><input type=text name=phone size=40 maxLength=40 value="<?=htmlspecialchars($_fpr_data['phone'])?>"></TD></TR>
<TR><TD>Fax:<BR></TD>
	<td colspan=2><input type=text name=fax size=40 maxLength=40 value="<?=htmlspecialchars($_fpr_data['fax'])?>"></TD></TR>
<!-- Row 6 -->
<TR><td colspan=3><input type=checkbox class=checkbox name="cc_confirm" value=1<?=($_fpr_data['cc_confirm'] ? ' checked' : '')?>> Credit Card Confirmed</TD></TR>
<tr><td colspan=3><input type=checkbox class=checkbox name="p_confirm" value=1<?=($_fpr_data['p_confirm'] ? ' checked' : '')?>> Payment & Billing Info Confirmed</TD></tr>
<tr><td colspan=3><input type=checkbox class=checkbox name="ph_confirm" value=1<?=($_fpr_data['ph_confirm'] ? ' checked' : '')?>> Telephone Confirmed</TD></TR>
<tr>
  <td>
    <span<?=($_fpr_err['payout'] ? ' class=error' : '')?>>Referral Payout Rate:</span>
  <td colspan=2>
    <input type=text name=payout size=40 maxLength=40 value="<?=htmlspecialchars($_fpr_data['payout'])?>">
</tr>
<!-- Row 11 -->
<tr>
  <th colspan=3 class=submit>
    <input type=submit class=button name=77 value="Submit &gt;&gt;">
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