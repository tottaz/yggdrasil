<?php
/**
 * @package JobBoard
 * @copyright Copyright (c)2010 Tandolin
 * @license GNU General Public License version 2, or later
 */

defined('_JEXEC') or die('Restricted access');
jimport( 'joomla.application.component.view');

class JobboardViewList extends JView
{
      function display($tpl = null)  {
        global $option;
        $catid = JRequest::getVar('catid', '');
        $catid = intval($catid);
        $document =& JFactory::getDocument();
        $document->setLink(JRoute::_('index.php?option=com_jobboard&catid='.$catid));
        $document->setGenerator('Job Board for Joomla!1.5.x by www.tandolin.co.za');

        $db =& JFactory::getDBO();
        $query = 'SELECT type FROM #__jobboard_categories WHERE id='.$catid;
        $db->setQuery($query);
        $seldesc = $db->loadResult();
        $document->setDescription(JText::_('Latest Jobs').': '.$seldesc);

        // get the items to add to the feed
        $where = ($catid == 1)? '' : ' WHERE c.id ='.intval($catid);
        $query = 'SELECT
                      j.id
                      , j.post_date
                      , j.job_title
                      , j.job_type
                      , c.type AS category
                      , cl.description AS job_level
                      , j.description
                      , j.city
                  FROM
                      #__jobboard_jobs AS j
                      INNER JOIN #__jobboard_categories  AS c
                          ON (j.category = c.id)
                      INNER JOIN #__jobboard_career_levels AS cl
                          ON (j.career_level = cl.id)
                      '.$where.'
                      ORDER BY j.post_date DESC';
        $db->setQuery($query);
        $rows = $db->loadObjectList();

        foreach ($rows as $row)
        {
            // create a new feed item
            $job = new JFeedItem();
            // assign values to the item

            $job->category = $row->category ;
            $job->date = date('r', strtotime($row->post_date));
            $job->description = html_entity_decode($this->escape($row->description));
            $link = htmlentities('index.php?option=com_jobboard&view=job&id='.$row->id.'&catid='.$catid);
            $job->link = JRoute::_($link);
            $job->pubDate = date(DATE_RFC822);
            $job->title = JText::_('Job Vacancy').': '.html_entity_decode($this->escape($row->job_title.', '.$row->city.' ('.$row->job_type.')'));
            // add item to the feed
            $document->addItem($job);
        }
      }
}
?>
