<?PHP
$sid	=	session_id();
if(!$sid){
	session_start();
	$sid	=	session_id();
}
require(dirname(__FILE__)."/humancheck_config.php");
//1) lets generate the code
$noautomationcode = "";
for($i=0; $i<$config_max_digits;$i++)	$noautomationcode = $noautomationcode.rand(0,9);
//save it in session
$HTTP_SESSION_VARS["noautomationcode"] = $noautomationcode;

//show form
################################################### HERE YOU MAY EDIT #######################################
$html_form =<<< EHTML
<!-- the secret image -->
<img src='humancheck_showcode.php?sid=$sid'>
<!-- the form -->
<form action='humancheck_check.php' method='post'>
	<input type='hidden' name='sid' value='$sid'>

	<input type='text' name='code'>
	<input type='Submit' name='Submit'>
</form>
EHTML;
#############################################################################################################
echo($html_form);
?>