<?php
/**
 * @package JobBoard
 * @copyright Copyright (c)2010 Tandolin
 * @license GNU General Public License version 2, or later
 */

defined('_JEXEC') or die('Restricted access');

jimport('joomla.application.component.model');
jimport('joomla.utilities.date');

class JobboardModelList extends JModel
{
	var $_total = null;
	var $_pagination = null;
	var $_search = null;
	var $_keysrch = null;
	var $_locsrch = null;
	var $data = null;
	
	function __construct()
	{
		parent::__construct();

        global $mainframe, $option;

        // Get pagination request variables
        $limit = $mainframe->getUserStateFromRequest('global.list.limit', 'limit', $mainframe->getCfg('list_limit'), 'int');
        $limitstart = JRequest::getVar('limitstart', 0, '', 'int');

        // $limit = 10;
        // In case limit has been changed, adjust it
        $limitstart = ($limit != 0 ? (floor($limitstart / $limit) * $limit) : 0);
 
        $this->setState('limit', $limit);
        $this->setState('limitstart', $limitstart);
	}

	function _buildQuery()
	{
			global $mainframe, $option;

            //$category_id = $mainframe->getUserStateFromRequest('jb_list.catid','catid','');
//            $category_id = (!is_int($category_id))? intval($category_id) : $category_id;
             $category_id = JRequest::getVar('selcat', '');
             $category_id = (!is_numeric($category_id))? 1 : $category_id;

			$daterange = $mainframe->getUserStateFromRequest("$option.daterange", 'daterange', '', 'int');
            $daterange = intval($daterange);
            $dateNow = new JDate($mainframe->get('requestTime'));
            $startdate = $dateNow->toFormat('%Y-%m-%d');

            if ($category_id == 1 ) {
              $where = '';
              if($daterange <> 0) {
                $where = ' WHERE DATE_FORMAT(j.post_date,"%Y-%m-%d") >= DATE_SUB("'.$startdate.'",INTERVAL '.$daterange.' DAY) ';
              }
            } else {
              $where =' WHERE c.id = '.$category_id ;
              if($daterange <> 0) {
                 $where .= ' AND DATE_FORMAT(j.post_date,"%Y-%m-%d") >= DATE_SUB("'.$startdate.'",INTERVAL '.$daterange.' DAY) ';
               }
            }

			$search = $this->getSearch();
            $keysrch = $this->getKeySearch();
            $locsrch = $this->getLocSearch();

        if($search != '')  // filter by job title
			{
			    $fields = array('j.job_title');
				$s_where = array();
				$search = $this->_db->getEscaped($search,true);

                    foreach($fields as $field)
    				{
    					$s_where[] = $field." LIKE '%{$search}%'";
    				}
                    $where .= ' AND ('.implode(' OR ',$s_where).')';
			}

        if($keysrch != '') // filter by job skills/keywords
			{
				$fields = array('j.job_title','j.job_tags');
				$ks_where = array();
				$keysrch = $this->_db->getEscaped($keysrch,true);
                $keys_array = explode(',', $keysrch);

                foreach($keys_array as $keywd) {
                    $keywd = trim($keywd);
                    foreach($fields as $field)
    				{
    					$ks_where[] = $field." LIKE '%{$keywd}%'";
    				}
                    $where .= ' AND ('.implode(' OR ',$ks_where).')';
                }
			}

        if($locsrch != '')  // filter by location
			{
			    $fields = array('j.city');
				$l_where = array();
				$locsrch = $this->_db->getEscaped(trim($locsrch),true);

                    foreach($fields as $field)
    				{
    					$l_where[] = $field." LIKE '%{$locsrch}%'";
    				}
                    $where .= ' AND ('.implode(' OR ',$l_where).')';
			}
			//build ORDER BY clause based on order parameter
			$order = trim($mainframe->getUserStateFromRequest('jb_list.order','order',''));
			switch ($order)
			{
				case 'date':
					$orderby = ' ORDER BY j.post_date';
					break;
				case 'title':
					$orderby = ' ORDER BY j.job_title';
					break;
				case 'level':
					$orderby = ' ORDER BY cl.description';
					break;
				case 'city':
					$orderby = ' ORDER BY j.city';
					break;
				case 'type':
					$orderby = ' ORDER BY c.type';
					break;
				default:
					$orderby = ' ORDER BY j.post_date';
					break;
			}
			
			//sort order ASC or DESC depending on sort parameter
			$sort = trim($mainframe->getUserStateFromRequest('jb_list.sort','sort',''));
			switch ($sort)
			{
				case 'a':
					$orderby = $orderby.' ASC';
					break;
				case 'd':
					$orderby = $orderby.' DESC';
					break;
				default:
					$orderby = $orderby.' DESC';
					break;
			}
            $layout = $mainframe->getUserStateFromRequest('jb_list.layout','layout','');
            $get_desc = ($layout == 'table')? '' : ' , j.description, j.salary ';
            $query = "SELECT
                      j.id
                      , j.post_date
                      , j.job_title
                      , j.job_type".$get_desc."
                      , c.id AS catid
                      , c.type AS category
                      , cl.description AS job_level
                      , j.city
                  FROM
                      #__jobboard_jobs AS j
                      INNER JOIN #__jobboard_categories  AS c
                          ON (j.category = c.id)
                      INNER JOIN #__jobboard_career_levels AS cl
                          ON (j.career_level = cl.id)";
			 $query = $query.$where;
             $query = $query.' AND published=1 ';
			 $query = $query.$orderby;
			return $query;
	}

    function getCategories(){
           $db = & JFactory :: getDBO();
           $sql = 'SELECT id, type
              FROM
                  #__jobboard_categories
                      WHERE enabled = true';
           $db->setQuery($sql);
           return $db->loadObjectList();
    }

    function getDefaultCat(){
           $db = & JFactory :: getDBO();
           $sql = 'SELECT default_category
              FROM
                  #__jobboard_config';
           $db->setQuery($sql);
           return $db->loadResult();
    }

	function getTotal()
	{
		// Load the content if it doesn't already exist
		if (empty($this->_total)) {
			$query = $this->_buildQuery();
			$this->_total = $this->_getListCount($query);    
		}
		return $this->_total;
	}
	
	function getPagination()
	{
        // Load the content if it doesn't already exist
        if (empty($this->_pagination)) {
            jimport('joomla.html.pagination');
            $this->_pagination = new JPagination($this->getTotal(), $this->getState('limitstart'), $this->getState('limit') );
        }
        return $this->_pagination;
	}

	function getData()
	{
		global $mainframe;
		
		if(empty($this->data))
		{
			$query = $this->_buildQuery();
            $this->data = $this->_getList($query, $this->getState('limitstart'), $this->getState('limit'));

			$this->count = $this->getTotal();
			$mainframe->setUserState('jb_list.count',$this->count);
		}
		
		return $this->data;
	}


	function getSearch()
	{
		if(!$this->_search)
		{
			global $mainframe, $option;
			$search = $mainframe->getUserStateFromRequest("$option.search", 'search', '', 'string');
			$this->_search = (strpos($search, '(') === 0)? '' : JString::strtolower($search);
		}

		return $this->_search;
	}

	function getKeySearch()
	{
		if(!$this->_keysrch)
		{
			global $mainframe, $option;
			$keysrch = $mainframe->getUserStateFromRequest("$option.keysrch", 'keysrch', '', 'string');
			$this->_keysrch = (strpos($keysrch, '(') === 0)? '' :  JString::strtolower($keysrch);
		}

		return $this->_keysrch;
	}

	function getLocSearch()
	{
		if(!$this->_locsrch)
		{
			global $mainframe, $option;
			$locsrch = $mainframe->getUserStateFromRequest("$option.locsrch", 'locsrch', '', 'string');
			$this->_locsrch = (strpos($locsrch, '(') === 0)? '' :  JString::strtolower($locsrch);
		}

		return $this->_locsrch;
	}
	
}
