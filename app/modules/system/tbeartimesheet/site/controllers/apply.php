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

   class JobboardControllerApply extends JController
   {

     function display()
     {
       global $option;
       $id = JRequest :: getVar('job_id', '', '', 'int');
       $this->getApplicationForm($id);
     }

     function getApplicationForm($id)
     {
       $job_model =& $this->getModel('Apply');
       $job_data = $job_model->getJobData($id);
       $catid = JRequest :: getVar('catid', '', '', 'int');

       //set the view parameters
       JRequest :: setVar('job_id', $id);
       JRequest :: setVar('catid', $catid);
       JRequest :: setVar('data', $job_data);


       JRequest :: setVar('view', 'apply');
       parent :: display();
     }
                      
   }

   $controller = new JobboardControllerApply();
   $controller->execute($task);
   $controller->redirect();
?>
