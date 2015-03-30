<?php
/**
 * @package JobBoard
 * @copyright Copyright (c)2010 Tandolin
 * @license GNU General Public License version 2, or later
 */

   // Protect from unauthorized access
   defined('_JEXEC') or die('Restricted Access');

   JTable::addIncludePath(JPATH_COMPONENT_ADMINISTRATOR.DS.'tables');
   // Load framework base classes
   jimport('joomla.application.component.controller');
   jimport('joomla.mail.helper');

   class JobboardControllerJob extends JController
   {

  	/**
  	 * constructor
  	 */
  	function __construct()
  	{
  		parent::__construct();

           $this->registerTask('share', 'emailFriend');
  	}


     function display()
     {
       global $option;
       $id = JRequest :: getVar('id', '', '', 'int');
       $this->getJob($id);
     }

     function emailFriend() {
       JRequest::checkToken() or jexit('Invalid Token');
       global $mainframe;
       $message = new JObject();
       $message->job_id = JRequest::getVar('job_id','','','int');
       $catid = JRequest::getVar('catid','','','int');
       $message->job_title = JRequest::getVar('job_title','','','string');
       $message->job_city = JRequest::getVar('job_city','','','string');
       $message->personal_message = JRequest::getVar('personal_message','','','string');
       $message->link = JRequest::getVar('job_path','','','string');

       $fields_valid = $this->validateFields();
       $message->sender_email = $fields_valid->sender_email;
       $message->sender_name = $fields_valid->sender_name;
       $message->rec_emails = $fields_valid->rec_emails;

       if($fields_valid->errors === true) {
          $errmsg = $fields_valid->errmsg.'</ul>';
          $mainframe->setUserState('sfields', $message);
          $link = JRoute::_('index.php?option=com_jobboard&view=share&errors=1&job_id='.$message->job_id.'&catid='.$catid, false);
          $this->setRedirect( $link, $errmsg, '' );return;
       } else {

         if(stristr($message->rec_emails, ',') === TRUE) {
            $rec_emailarray = explode(',', $message->rec_emails);
            foreach($rec_emailarray as $email_recipient) {
              $this->sendEmail($message, trim($email_recipient));
            }
          }  else {
             $this->sendEmail($message, trim($message->rec_emails));
          }

         $mesgModel = & $this->getModel('Message');
         $saved = $mesgModel->saveMessage($message);

         if($saved) {
            $msg = JText::_( '&nbsp; Your message was sent successfully.' );
            $link = JRoute::_('index.php?option=com_jobboard&view=job&id='.$message->job_id.'&catid='.$catid, false);
            $this->setRedirect( $link, $msg, '' );return;
         } else {
            $msg = JText::_( '&nbsp; There was an error sending your message. Please wait a few minutes and try again' );
            $link = JRoute::_('index.php?option=com_jobboard&view=job&id='.$message->job_id.'&catid='.$catid, false);
            $this->setRedirect( $link, $msg, '' );return;
         }
       }

       parent :: display();
     }

     function sendEmail($msgobj, $recipient)
     {
       $messg_model =& $this->getModel('Message');
       $msg_id = $messg_model->getMsgID('sharejpriv');
       $msg = $messg_model->getMsg($msg_id);

       $from = $msgobj->sender_email;
       $fromname = $msgobj->sender_name;
       $to_email = $recipient;

       $subject = $msg->subject;
       $body = $msgobj->personal_message;
       $body_b = str_replace('[location]', $msgobj->job_city, $msg->body);
       $body_b = str_replace('[jobtitle]', $msgobj->job_title, $body_b);
       $body = $body.$body_b.$msgobj->link;

       $sendresult = JUtility :: sendMail($from, $fromname, $to_email, $subject, $body);
     }

     function getJob($id)
     {
       $jobs =& JTable::getInstance('Job','Table');
       $jobs->hit($id);
       $job_model =& $this->getModel('Job');
       $job_data = $job_model->getData($id);
       $catid = JRequest :: getVar('catid', '', '', 'int');

       //set the view parameters
       JRequest :: setVar('id', $id);
       JRequest :: setVar('catid', $catid);
       JRequest :: setVar('data', $job_data);

       JRequest :: setVar('view', 'job');
       parent :: display();
     }

     function validateFields(){

         $message->sender_email = JRequest::getVar('sender_email','','','string');
         $message->sender_name = JRequest::getVar('sender_name','','','string');
         $message->rec_emails = JRequest::getVar('rec_emails','','','string');

         $msg = JText::_( 'There were some errors encountered whilst processing your request.' ).'<ul>';
           $errors = false;

           if($message->sender_email == '') {
            $msg .= '<li>'.JText::_( 'Please enter a valid sender Email Address' ).'</li>';
            $errors = true;
           }
           if($message->sender_name == '') {
            $msg .= '<li>'.JText::_( 'Please enter a valid sender Name' ).'</li>';
            $errors = true;
           }

           if(stristr($message->rec_emails, ',') === TRUE) {
              $rec_emailarray = explode(',', $message->rec_emails);
              foreach($rec_emailarray as $email_recipient) {
                if(trim($email_recipient) == '' || !JMailHelper::cleanAddress(trim($email_recipient)) || !JMailHelper::isEmailAddress(trim($email_recipient))){
                    $addr_errors = true;
                    $errors = true;
                }
              }
              if($addr_errors === true) {
                    $errors = true;
                    $msg .= '<li>'.JText::_( 'One or more of your recipient email addresses is invalid' ).'</li>';
                }
            }  else {
               if((stristr($message->rec_emails, ',') === FALSE) && ( trim($message->rec_emails) == '' || !JMailHelper::cleanAddress(trim($message->rec_emails)) || !JMailHelper::isEmailAddress(trim($message->rec_emails)) ) ){
                 $errors = true;
                 $msg .= '<li>'.JText::_( 'Your recipient email address is empty or invalid' ).'</li>';
               }
            }

           $results = new JObject();
           $results->sender_email = $message->sender_email;
           $results->sender_name = $message->sender_name;
           $results->rec_emails = $message->rec_emails;
           if($errors) {
             $results->errors = $errors;
             $results->errmsg = $msg;
           }   else {
             $results->errors = false;
           }
           return $results;
     }

   }

   $controller = new JobboardControllerJob();
   $controller->execute($task);
   $controller->redirect();
?>
