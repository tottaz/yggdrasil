<?php
/**
 * @package JobBoard
 * @copyright Copyright (c)2010 Tandolin
 * @license GNU General Public License version 2, or later
 */

   // Protect from unauthorized access
   defined('_JEXEC') or die('Restricted Access');

   class JobboardModelUpload extends JModel
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
       var $_session;

     /**
     * Constructor, builds object and determines the Address ID
     *
     */
       function __construct()
       {
         parent :: __construct();

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
     * Saves Application data
     *
     * @return boolean
     */
       function saveApplication($fileobj, $field_array)
       {
           $id = $field_array->job_id;
           $first_name = $field_array->fields->first_name;
           $last_name = $field_array->fields->last_name;
           $email = $field_array->fields->email;
           $tel = $field_array->fields->tel;
           $title = $field_array->fields->title;
           $cover_note = $field_array->fields->cover_note;

           $db = & JFactory :: getDBO();
           $query = 'INSERT INTO #__jobboard_applicants
                (request_date, job_id, first_name, last_name, email, tel, title, filename, file_hash, cover_note)
                VALUES (UTC_TIMESTAMP
                  , "'.$db->getEscaped($id).'"
                  , "'.$db->getEscaped($first_name).'"
                  , "'.$db->getEscaped($last_name).'"
                  , "'.$db->getEscaped($email).'"
                  , "'.$db->getEscaped($tel).'"
                  , "'.$db->getEscaped($title).'"
                  , "'.$db->getEscaped($fileobj[0]).'"
                  , "'.$db->getEscaped($fileobj[1]).'"
                  , "'.$db->getEscaped($cover_note).'")';
           $db->setQuery($query);
           $this->_result = $db->Query();
        // return the save response
         return $this->_result;
       }


     /**
     * Saves Unsolicited Application data
     *
     * @return boolean
     */
       function saveUnsolicited($fileobj, $field_array)
       {

           $id = $field_array->job_id;
           $first_name = $field_array->fields->first_name;
           $last_name = $field_array->fields->last_name;
           $email = $field_array->fields->email;
           $tel = $field_array->fields->tel;
           $title = $field_array->fields->title;
           $cover_note = $field_array->fields->cover_note;

           $db = & JFactory :: getDBO();
           $query = 'INSERT INTO #__jobboard_unsolicited
                (request_date, first_name, last_name, email, tel, title, filename, file_hash, cover_note)
                VALUES (UTC_TIMESTAMP
                  , "'.$db->getEscaped($first_name).'"
                  , "'.$db->getEscaped($last_name).'"
                  , "'.$db->getEscaped($email).'"
                  , "'.$db->getEscaped($tel).'"
                  , "'.$db->getEscaped($title).'"
                  , "'.$db->getEscaped($fileobj[0]).'"
                  , "'.$db->getEscaped($fileobj[1]).'"
                  , "'.$db->getEscaped($cover_note).'")';
           $db->setQuery($query);
           $this->_result = $db->Query();
        // return the save response
         return $this->_result;
       }

       function incrApplications($id) {
           $db = & JFactory :: getDBO();
           $query = 'UPDATE #__jobboard_jobs SET
                num_applications =  num_applications + 1
                WHERE id='. $id;
           $db->setQuery($query);
           $this->_result = $db->Query();
        // return the save response
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
           $db = & JFactory :: getDBO();
           $sql = 'SELECT
                       j.post_date
                      , j.job_title
                      , j.job_type
                      , j.country
                      , c.id AS catid
                      , c.type AS category
                      , jc.country_name
                      , jc.country_region
                      , cl.description AS job_level
                      , j.description
                      , j.positions
                      , j.city
                      , j.num_applications
                  FROM
                      #__jobboard_jobs AS j
                      INNER JOIN #__jobboard_categories  AS c
                          ON (j.category = c.id)
                      INNER JOIN #__jobboard_career_levels AS cl
                          ON (j.career_level = cl.id)
                      INNER JOIN #__jobboard_countries AS jc
                          ON (j.country = jc.country_id)
                      WHERE j.id = ' . $id;
           $db->setQuery($sql);
           return $db->loadObject();
       }

}

?>