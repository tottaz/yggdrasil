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

   class JobboardControllerUnsolicited extends JController
   {

     function display()
     {
       global $option;
       $this->getApplicationForm();
     }

     function getApplicationForm()
     {
       $catid = JRequest :: getVar('catid', '', '', 'int');

       //set the view parameters
       JRequest :: setVar('catid', $catid);


       JRequest :: setVar('view', 'unsolicited');
       parent :: display();
     }
        
   }

   $controller = new JobboardControllerUnsolicited();
   $controller->execute($task);
   $controller->redirect();
?>
