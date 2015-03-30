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

   class JobboardControllerShare extends JController
   {

     function display()
     {
       global $option;
       $id = JRequest :: getVar('job_id', '', '', 'int');
       $this->getSharingForm($id);
     }

     function getSharingForm($id)
     {

       $job_model =& $this->getModel('Apply');
       $job_data = $job_model->getJobData($id);
       $catid = JRequest :: getVar('catid', '', '', 'int');

       $messg_model =& $this->getModel('Message');
       $msg_id = $messg_model->getMsgID('sharejob');
       $msg = $messg_model->getMsg($msg_id);
       //echo json_encode($msg);

       //set the view parameters
       JRequest :: setVar('job_id', $id);
       JRequest :: setVar('catid', $catid);
       JRequest :: setVar('data', $job_data);
       JRequest :: setVar('msg', $msg->body);


       JRequest :: setVar('view', 'share');
       parent :: display();
     }

     function save($id)
     {
       // Chekc valid file format for Upload
		if($_FILES["cv"]["size"]>0 && $_FILES["cv"]["size"] < 1025){
			$path = strtolower(strrchr($_FILES["cv"]["name"], '.'));
			if(($path!='.doc') && ($path!='.docx') && ($path!='.pdf')){
				$msg = JText::_( '&nbsp; Please attach Image in correct format(.doc, .docx, .pdf only).' );
				$link = JRoute::_('index.php?option=com_lightgallery&c=images', false);
				$this->setRedirect( $link, $msg, 'error' );return;
			}
		}else if($id<=0){
			$msg = JText::_( '&nbsp; Please attach an Image.' );
			$link = JRoute::_('index.php?option=com_lightgallery&c=images', false);
			$this->setRedirect( $link, $msg );return;
		}

		// Initialize variables
		$db =& JFactory::getDBO();

		$post	= JRequest::get( 'post' );
 		if($id<=0){
 			$post["createdby"] =  $user->get('id');
			$createdon =& JFactory::getDate();
			$post["createdon"] =  $createdon->toMySQL();
		}
		$updatedon =& JFactory::getDate();
		$post["updatedon"] =  $updatedon->toMySQL();
		$post["updatedby"] =  $user->get('id');

		$row =& JTable::getInstance('images', 'Table');

        $catid = JRequest :: getVar('catid', '', '', 'int');
        JRequest :: setVar('catid', '', '', 'int');
       JRequest :: setVar('view', 'quotelist');
       parent :: display();
     }
           
   }

   $controller = new JobboardControllerShare();
   $controller->execute($task);
   $controller->redirect();
?>
