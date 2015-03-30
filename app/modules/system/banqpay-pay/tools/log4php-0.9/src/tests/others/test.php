<?php
/**
 * @package tests
 * @subpackage others
 * @author VxR <vxr@vxr.it>
 * @version $Revision: 1.1 $
 * @since 0.6
 */

/**
 * @var array Test array
 */
$tests = array(
    'Serialized'     => array(
        '__COMMENT__'           => 'echo the current hierarchy serialized', 
        'LOG4PHP_CONFIGURATION' => './configs/serialized.xml'
     ),
);

require_once('../test_core.php');

?>