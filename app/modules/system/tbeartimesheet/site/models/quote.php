<?php
/**
 * @package JobBoard
 * @copyright Copyright (c)2010 Tandolin
 * @license GNU General Public License version 2, or later
 */

defined('_JEXEC') or die('Restricted access');
jimport('joomla.application.component.model');

class JobboardModelQuote extends JModel
{
	var $data = null;
    var $id = null;
    var $option = null;

	function getQuoteId($plevel, $adults, $children)
	{
        $query = 'SELECT id FROM #__jobboard_categories
                  WHERE num_adults='.$adults.' AND num_children='.$children;
        if($plevel == 2) $query .= ' AND id>10';
        if($plevel == 3) $query .= ' AND id>20';
    	$db =& JFactory::getDBO();
    	$db->setQuery($query);
		$this->id = $db->loadResult();

		return $this->id;
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