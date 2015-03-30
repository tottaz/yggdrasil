<?php
class EmailComponent extends Object
{
  var $controller;
  var $mail = null;
  var $emailSubject = null;
  var $emailHtml = null;
  var $emailText = null;
  var $emailVars = array();

  function startup(&$controller) {
    $this->controller = &$controller;

  }

  function init($email=null, $name=null, $host=null, $user=null, $pass=null)
  {
    vendor('phpmailer'.DS.'class.phpmailer');
    $this->mail = new PHPMailer();
    $this->mail->Port     = 25;
    $this->mail->Priority = 3;
    $this->mail->Encoding = "8bit";
    $this->mail->CharSet  = "iso-8859-1";
    $this->mail->IsHTML = true;
    $this->mail->WordWrap = 50;
    $this->mail->Mailer = 'smtp';
    $this->mail->SMTPAuth = true;
    $this->mail->Host = $host ? $host : CONFIG_SMTP_HOST;
    $this->mail->Username = $user ? $user : CONFIG_SMTP_USER;
    $this->mail->Password = $pass ? $pass : CONFIG_SMTP_PASS;
    $this->mail->From = $email ? $email : CONFIG_SITE_EMAIL;
    $this->mail->FromName = $name ? $name : CONFIG_SITE_NAME;
  }

  function address($type, $email, $name=null)
  {
    switch ($type)
    {
      case 'to':
        $this->mail->AddAddress($email, $name);
        break;
      case 'cc':
        $this->mail->AddCC($email, $name);
        break;
      case 'bcc':
        $this->mail->AddBCC($email, $name);
        break;
      case 'from':
        $this->mail->AddReplyTo($email,$name);
        break;
    }
  }

  function attachment($file, $name=null)
  {
    $this->mail->AddAttachment($file,$name);
  }

  function send()
  {
    $this->mail->Subject = strtr($this->emailSubject, $this->emailVars);
    $this->mail->Body = strtr($this->emailHtml, $this->emailVars);
    $this->mail->AltBody = strtr($this->emailText, $this->emailVars);
    return $this->mail->Send();
  }

}
?>