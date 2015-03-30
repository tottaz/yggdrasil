<?php
/**
 * @package JobBoard
 * @copyright Copyright (c)2010 Tandolin
 * @license GNU General Public License version 2, or later
 */

defined('_JEXEC') or die('Restricted access');
jimport('joomla.application.component.model');

class JobboardModelUnsolicited extends JModel
{
	var $_data = null;
    var $_id = null;
    var $_option = null;

	function getJobData($id)    {
           $db = & JFactory :: getDBO();
           $sql = 'SELECT
                       j.post_date
                      , j.job_title
                      , j.job_type
                      , j.country
                      , j.salary
                      , jc.country_name
                      , jc.country_region
                      , cl.description AS job_level
                      , j.positions
                      , j.city
                      , j.num_applications
                      , e.level AS education
                  FROM
                      #__jobboard_jobs AS j
                      INNER JOIN #__jobboard_categories  AS c
                          ON (j.category = c.id)
                      INNER JOIN #__jobboard_career_levels AS cl
                          ON (j.career_level = cl.id)
                      INNER JOIN #__jobboard_education AS e
                          ON (e.id = j.education)
                      INNER JOIN #__jobboard_countries AS jc
                          ON (j.country = jc.country_id)
                      WHERE j.id = ' . $id;
           $db->setQuery($sql);
           return $db->loadObject();
       }


    function getOption($id) {
        $query = 'SELECT option_type FROM #__jobboard_options
                  WHERE id ='.$id;
    	$db =& JFactory::getDBO();
    	$db->setQuery($query);
		$this->_option = $db->loadResult();

        return $this->_option;
    }

    function getQuoteData($id)
	{
        $query = 'SELECT * FROM #__jobboard_contributions
                  WHERE id='.$id;
    	$db =& JFactory::getDBO();
    	$db->setQuery($query);
		$this->data = $db->loadObject();

		return $this->data;
	}

    function saveQuote() {
      $this->name = JRequest::getVar('enqname','');
      $this->eml = JRequest::getVar('enqmail','');
      $this->tel = JRequest::getVar('enqtel','');
      $this->adults = JRequest::getVar('adults','');
      $this->children = JRequest::getVar('children','');
      $this->package = JRequest::getVar('package','');
      $this->contrib = JRequest::getVar('contrib','');
      $this->savings = JRequest::getVar('savings','');
      $query = 'INSERT INTO #__jobboard_applicants
            (`request_date`, `name`, `email`, `tel`, `package`, `num_adults`, `num_children`, `contribution`, `savings`)
                VALUES
             (UTC_TIMESTAMP, "'.$this->name.'", "'.$this->eml.'", "'.$this->tel.'", '.$this->package.', '.$this->adults.', '.$this->children.', '.$this->contrib.', '.$this->savings.')';
      $db =& JFactory::getDBO();
      $db->setQuery($query);
      $this->result = $db->Query();
      return $this->result;
    }
}
?>