<?php
/**
 * @package JobBoard
 * @copyright Copyright (c)2010 Tandolin
 * @license GNU General Public License version 2, or later
 */

   // Protect from unauthorized access
   defined('_JEXEC') or die('Restricted Access');

   class JobboardModelConfig extends JModel
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
     * Constructor, builds object and determines the ID  (always set to 1)
     *
     */
       function __construct()
       {
         parent :: __construct();

         $id = 1;
         $this->setId($id);
       }

     /**
     * Initialise the ID and data
     *
     * @param integer ID
     */
       function setId($id)
       {
         $this->_id = $id;
         $this->_result = null;
       }

       function getConfig() {
           $db = & $this->getDBO();
           $sql = 'SELECT * FROM #__jobboard_config
                      WHERE id = ' . $this->_id . '';
           $db->setQuery($sql);
           $this->_result = $db->loadObject();
           return $this->_result;
       }

       function getQuerycfg() {
           $db = & $this->getDBO();
           $sql = 'SELECT default_post_range, allow_unsolicited FROM #__jobboard_config
                      WHERE id = ' . $this->_id . '';
           $db->setQuery($sql);
           $this->_result = $db->loadObject();
           return $this->_result;
       }
}

?>