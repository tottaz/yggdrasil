<?php
/**
 * @package tests
 * @subpackage levels
 * @author VxR <vxr@vxr.it>
 * @version $Revision: 1.3 $
 * @since 0.5
 */

/**
 * @var array Test array
 */
$tests = array(
    'LoggerLevel_01'     => array(
        'LOG4PHP_CONFIGURATION' => './configs/LoggerLevel_01.properties'
     ),
    'LoggerLevel_02'     => array(
        'LOG4PHP_CONFIGURATION' => './configs/LoggerLevel_02.xml'
     ),
    'LoggerLevel_03'     => array(
        'LOG4PHP_CONFIGURATION' => './configs/LoggerLevel_03.properties',
        'INCLUDES'              => './MyLoggerLevel.php'
     ),
);

require_once('../test_core.php');

?>