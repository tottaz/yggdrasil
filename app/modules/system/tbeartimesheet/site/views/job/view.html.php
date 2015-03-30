<?php
/**
 * @package JobBoard
 * @copyright Copyright (c)2010 Tandolin
 * @license GNU General Public License version 2, or later
 */

defined('_JEXEC') or die('Restricted access');

jimport('joomla.application.component.view');

class JobboardViewJob extends JView
{
	function display($tpl = null)
	{
        jimport('joomla.utilities.date');

 		$this->_addScripts();
        $data = JRequest::getVar('data','');
        $this->assignRef('data', $data);
        $this->assign('post_date', $this->formatDate($data->post_date));
        $this->assign('id', JRequest::getVar('id',''));
        $this->assign('catid', JRequest::getVar('catid',''));
        $extra_keywords = ( strlen($this->data->job_tags) > 1 )? ', '.$this->data->job_tags : '';

        $document =& JFactory::getDocument();
        $document->setTitle($this->data->job_title. ', '.$this->data->city.' '.$this->data->post_date.' (UTC)');
        $document->setMetaData('robots', 'index,nofollow');
        $document->setMetaData('keywords', 'job details, '.$this->data->job_title.', '.$this->data->city.$extra_keywords);
        $document->setMetaData('description', 'View details for job posting: '.$this->data->job_title.', '.$this->data->city);
		parent::display($tpl);
	}

	function _addScripts()
	{
	    $document =& JFactory::getDocument();
	    $document->addStyleSheet('components/com_jobboard/css/base.css');
	    $document->addStyleSheet('components/com_jobboard/css/job.css');
        $document->setGenerator('Job Board for Joomla!1.5.x by www.tandolin.co.za');
	}

    function formatDate($date) {
      if(count($date) > 0){
        $i = 0;
          $cur_date = new JDate($date);
          $f_date = $cur_date->toFormat("%B %d, %Y");

      } return $f_date;
    }
}

?>