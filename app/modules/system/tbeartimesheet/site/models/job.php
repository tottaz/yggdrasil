<?php
/**
 * @package JobBoard
 * @copyright Copyright (c)2010 Tandolin
 * @license GNU General Public License version 2, or later
 */

   // Protect from unauthorized access
   defined('_JEXEC') or die('Restricted Access');

   class JobboardModelJob extends JModel
   {

     /**
     * Address ID
     *
     * @var int
     */
       var $_id;


     /**
     * Address action result
     *
     * @var boolean
     */
       var $_result;
       var $_db;
       var $_query;
       var $_sql;


     /**
     * Constructor, builds object and determines the Address ID
     *
     */
       function __construct()
       {
         parent :: __construct();

         //$address = json_decode(JRequest :: getVar('json', '', 'post', 'string', JREQUEST_ALLOWRAW));
         //$this->setAddress($address);
         /*$this->_query = null;
         $this->_sql = null;
         $this->_db = null;
         $this->_result = null;*/
       }

     /**
     * Sets the Address ID and data
     *
     * @param object Address
     */
       function setAddress($address)
       {
         $this->_id = (int)$address->id;
         $this->_address = $address;
         $this->_result = null;
       }

     /**
     * Saves Address data
     *
     * @return boolean
     */
       function saveAddress()
       {
           $db = & JFactory :: getDBO();
           $query = 'UPDATE #__service_center_client_companies
                SET `address`="'.$this->_address->address.'"
                    , `city`="'.$this->_address->city.'"
                    , `state`="'.$this->_address->state.'"
                    , `zipcode`="'.$this->_address->zipcode.'"
                    , `country`="'.$this->_address->country.'"
                WHERE `clientid` = '.$this->_id;
           $db->setQuery($query);
           $this->_result = $db->Query();
        // return the address save response
         return $this->_result;
       }

       function findAddress($client_name) {
           $db = & JFactory :: getDBO();
           $sql = 'SELECT
                  c.address
                  , c.city
                  , c.state
                  , c.zipcode
                  , c.country
              FROM
                  #__service_center_client_companies AS c
                  INNER JOIN #__users AS u
                      ON (c.clientid = u.id)
                      WHERE u.name = "' . $db->getEscaped($client_name, true) . '"';
           $db->setQuery($sql);
           return $db->loadAssoc();
       }

       function getData($id) {
           $db = & $this->getDBO();
           $sql = 'SELECT
                       j.post_date
                      , j.job_title
                      , j.job_type
                      , j.country
                      , j.salary
                      , c.id AS catid
                      , c.type AS category
                      , jc.country_name
                      , jc.country_region
                      , cl.description AS job_level
                      , j.description
                      , j.positions
                      , j.job_tags
                      , j.city
                      , j.num_applications
                      , j.hits
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

       function getJobdata($id) {
           $db = & $this->getDBO();
           $sql = 'SELECT j.job_title 
                      , j.city
                  FROM
                      #__jobboard_jobs AS j
                      WHERE j.id = ' . $id;
           $db->setQuery($sql);
           return $db->loadObject();
       }

       function getTopfive() {
           $db = & $this->getDBO();
           $sql = 'SELECT  SELECT  j.id
                      , j.job_title
                      , j.city
                      , j.hits
                  FROM
                      #__jobboard_jobs AS j
                      ORDER BY j.hits DESC LIMIT 5';
           $db->setQuery($sql);
           return $db->loadObjectList();
       }

       function getLatestfive() {
           $db = & $this->getDBO();
           $sql = 'SELECT  j.id
                      , j.job_title
                      , j.city
                      , j.num_applications
                  FROM
                      #__jobboard_jobs AS j
                      ORDER BY j.id DESC LIMIT 5';
           $db->setQuery($sql);
           return $db->loadObjectList();
       }

       function getDefaultprefix() {
           $db = & $this->getDBO();
           $sql = 'SELECT  j.id
                      , j.job_title
                      , j.city
                      , j.num_applications
                  FROM
                      #__jobboard_jobs AS j
                      ORDER BY j.id DESC LIMIT 5';
           $db->setQuery($sql);
           return $db->loadObjectList();
       }
}

?>