<?php
/**
 * @package tests
 * @subpackage layouts
 * @author VxR <vxr@vxr.it>
 * @version $Revision: 1.5 $
 * @since 0.3
 */

/**
 * @var array Test array
 */
$tests = array(
    'LoggerLayoutHtml'     => array( ),
    'LoggerLayoutSimple'   => array( ),
    'LoggerLayoutTTCC'     => array( ),
    'LoggerPatternLayout'  => array( ),
    'LoggerPatternLayoutLf5'  => array( 
        '__COMMENT__'       => 'Use a LogFactory 5 PatternLayout',
    ),
    'LoggerXmlLayout'      => array( 
        'TEST_SEND_HTML'    => false,
        'CONTENT_TYPE'      => 'application/xml',
        'HTML_HEADER'       => '<?xml version="1.0" encoding="ISO-8859-1"?>'
        ),
        
    'LoggerXmlLayout_Log4j'      => array(
        '__COMMENT__'           => 'xml layout with log4j namespace. Open with log4j chainsaw...',
        'LOG4PHP_CONFIGURATION' => './configs/LoggerXmlLayout_log4j_ns.xml',         
        'TEST_SEND_HTML'        => false,
        'CONTENT_TYPE'          => 'application/xml',
        'HTML_HEADER'           => '<?xml version="1.0" encoding="ISO-8859-1"?>'
        ),
);

require_once('../test_core.php');

?>