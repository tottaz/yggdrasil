<?php
/**
 * @package JobBoard
 * @copyright Copyright (c)2010 Tandolin
 * @license GNU General Public License version 2, or later
 */

// Protect from unauthorized access
defined('_JEXEC') or die('Restricted Access');


// Load framework base classes
jimport('joomla.application.component.controller');

class JobboardControllerDashboard extends JController
{

	function display()
	{   
		parent::display();
	}

}

$controller = new JobboardControllerDashboard();
$controller->execute($task);
$controller->redirect();

?>
