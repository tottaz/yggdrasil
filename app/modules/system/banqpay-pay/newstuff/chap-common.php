<?php 
   
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

function setChallengeVar($name='challenge'){
  if(!is_string($name)||!$name){
    trigger_error('Invalid variable name');
    exit();
  }
  session_start();
  // register session variable
  $_SESSION[$name]=getRandomString();
}

function getChallengeVar($name='challenge'){
  if(!$_SESSION[$name]){
    trigger_error('Invalid variable name');
    exit();
  }
  return $_SESSION[$name];
}