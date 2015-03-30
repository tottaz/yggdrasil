<?php
/**
 * @package JobBoard
 * @copyright Copyright (c)2010 Tandolin
 * @license GNU General Public License version 2, or later
 */

   // Protect from unauthorized access
   defined('_JEXEC') or die('Restricted Access');

   class JobboardModelMessage extends JModel
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

     /**
     * Constructor, builds object and determines the Address ID
     *
     */
       function __construct()
       {
         parent :: __construct();

         //$address = json_decode(JRequest :: getVar('json', '', 'post', 'string', JREQUEST_ALLOWRAW));
         //$this->setAddress($address);
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
       function saveMessage($message)
       {

           $db = & JFactory :: getDBO();
           $query = 'INSERT INTO #__jobboard_msg
                (job_id, sender_name, sender_email, recipient_list, message, send_date)
                VALUES ("'.$db->getEscaped($message->job_id).'"
                  , "'.$db->getEscaped($message->sender_name).'"
                  , "'.$db->getEscaped($message->sender_email).'"
                  , "'.$db->getEscaped($message->rec_emails).'"
                  , "'.$db->getEscaped($message->personal_message).'"
                  , UTC_TIMESTAMP)';
           $db->setQuery($query);
           $this->_result = $db->Query();
        // return the save response
         return $this->_result;
       }

       function getMsgID($type)
       {
           $db = & $this->getDBO();
           $query = 'SELECT id
                FROM #__jobboard_emailmsg
                WHERE '.$db->getEscaped("type").' = "'.$db->getEscaped($type).'"';
           $db->setQuery($query);
           $this->_result = $db->loadResult();
         return $this->_result;
       }

       function getMsg($id) {

           $db = & $this->getDBO();
           $query = 'SELECT '.$db->getEscaped("subject").', '.$db->getEscaped("body").'
                FROM #__jobboard_emailmsg
                WHERE id = '.$id;
           $db->setQuery($query);
           $this->_result = $db->loadObject();
         return $this->_result;
       }
}

?>