<?php
/*
 * Begin of server-side processing
 */
class ChallengeGenerator{
  // constructor
  function ChallengeGenerator($clearSession=true){
    if($clearSession){
      $this->clearVars();
    }
    session_start();
  }
  // public method clearVars()
  function clearVars(){
    // destroy existing session
    session_start();
    session_unset();
    session_destroy();
  }
  // public method setChallengeVar()
  function setChallengeVar($name='challenge'){
    if(!is_string($name)||!$name){
      trigger_error('Invalid variable name');
      exit();
    }
    // register session variable
    $_SESSION[$name]=$this->getRandomString();
  }
  // public method getSessionVar()
  function getChallengeVar($name){
    if(!$_SESSION[$name]){
      trigger_error('Invalid variable name');
      exit();
    }
    return $_SESSION[$name];
  }
  function deleteChallengeVar($name){
            if(!$_SESSION[$name]){
      trigger_error('Invalid variable name');
      exit();
    }
            unset($_SESSION[$name]);
  }
  // private method "getRandomString()"
  function getRandomString($length=40){
    if(!is_int($length)||$length<1){
      trigger_error('Invalid length for random string');
      exit();
    }
    $chars=
"abcdefghijklmnopqrstuvwxyz
ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    $randstring='';
    $maxvalue=strlen($chars)-1;
    for($i=0;$i<$length;$i++){
      $randstring.=substr($chars,rand(0,$maxvalue),1);
    }
    return $randstring;
  }
}
// instantiate a ChallengeGenerator object
$chlgen=&new ChallengeGenerator();
// register challenge variable
$chlgen->setChallengeVar();
/*
 * End of server-side processing
 */
?>
<!doctype html public "-//W3C//DTD HTML 4.01//EN">
<html>
<head>
<title>CHAP LOGIN SYSTEM EXAMPLE</title>
<script language="javascript" src="md5.js"></script>
<script language="javascript">
/*
 * validate form fields &
 * implement the Challenge Handshaking Authentication Protocol
 */
function checkForm(){
  valid=true;
  // get 'userid' field
  var usrid=document.getElementById('userid');
  if(!usrid){return};
  if(!usrid.value){showError(usrid,'Enter your ID')};
  // get 'password' field
  var psw=document.getElementById('passwd');
  if(!psw){return};
  if(!psw.value){showError(psw,'Enter your password')};
  // get 'challenge' field
  var chlng=document.getElementById('challenge');
  if(!chlng){return};
  // make MD5 hash of password and concatenate challenge value
  // next calculate MD5 hash of combined values
  chlng.value=MD5(MD5(psw.value)+'<?php echo $chlgen->getChallengeVar('challenge')?>');
  // clear password field
  psw.value='';
  return valid;
}
/*
 * display error messages
 */
function showError(obj,message){
  if(!obj.errorNode){
    obj.onchange=hideError;
    var p=document.createElement('p');
    p.appendChild(document.createTextNode(message));
    obj.parentNode.appendChild(p);
   obj.errorNode=p;
 }
  valid=false;
  return
}
/*
 * hide error messages
 */
function hideError(){
  this.parentNode.removeChild(this.errorNode);
  this.errorNode=null;
  this.onchange=null;
}
/*
 * execute 'checkForm()' function when page is loaded
 */
window.onload=function(){
  var W3CDOM=document.getElementById&&document.
  getElementsByTagName&&document.createElement;
  // check if browser is W3CDOM compatible
  if(W3CDOM){
    document.getElementsByTagName('form')
[0].onsubmit=function(){
      return checkForm();
    }
  }
}
</script>
</head>
<body>
<!-- login form -->
<form method="post" action="chaps-processlogin.php">
User ID <input type="text" name="userid" id="userid"/><br />
Password <input type="password" name="passwd" id="passwd"/><br />
<input type="hidden" name="challenge" id="challenge" />
<input type="submit" name="login" value="Log In" />
</form>
</body>
</html>