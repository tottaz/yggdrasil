<?
// include ‘challenge generator class’
require_once('chap-challengeclass.php');
// include ‘MySQL abstraction class’
require_once('mysqlclass.php');
// instantiate a ChallengeGenerator object
$chlgen=&new ChallengeGenerator(false);
// get challenge variable
$challenge=$chlgen->getChallengeVar('challenge');
// get a "fresh" version of the page
header('Cache-control:must-revalidate');
// connect to MySQL
$db=new MySQLarray('host'=>'host','user'=>'user','password'=>'password','database'=>'database'));
// run query to obtain user data
$result=$db->query("SELECT userid,password FROM users WHERE userid='".$_POST['userid']."'");
$row=$result->fetchRow();
// check to see if user credentials are valid
if(md5($row['password'].$challenge)==$_POST['challenge']&&$row['userid']==$_POST['userid']){
  echo '<html><head><title>Login Successful</title><body><h1>Thank you for logging in!
</h1></body></html>';
}
else{
  echo '<html><head><title>Access denied!</title><h1>Access
denied!</h1></body></html>';
}
// delete session data and destroy session
$chlgen->clearVars();