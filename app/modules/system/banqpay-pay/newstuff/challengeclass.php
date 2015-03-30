<?
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
    $chars="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    $randstring='';
    $maxvalue=strlen($chars)-1;
    for($i=0;$i<$length;$i++){
      $randstring.=substr($chars,rand(0,$maxvalue),1);
    }
    return $randstring;
  }
}