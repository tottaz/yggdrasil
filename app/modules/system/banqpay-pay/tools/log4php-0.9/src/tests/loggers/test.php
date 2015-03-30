<?php
/**
 * @package tests
 * @subpackage loggers
 * @author VxR <vxr@vxr.it>
 * @version $Revision: 1.2 $
 * @since 0.6
 */

/**
 * @var array Test array
 */
$tests = array(
    'MyLogger_01'     => array(
        '__COMMENT__'           => 'Configured using LoggerPropertyConfigurator. Note "Hi, by MyLogger" in DEBUG/MyTest.',
        'LOG4PHP_CONFIGURATION' => './configs/MyLogger.properties'
     ),
    'MyLogger_02'     => array(
        '__COMMENT__'           => 'Configured using LoggerDOMConfigurator. Note "Hi, by MyLogger" in DEBUG/MyTest.',
        'LOG4PHP_CONFIGURATION' => './configs/MyLogger.xml'
     ),
);

require_once('../test_core.php');

?>