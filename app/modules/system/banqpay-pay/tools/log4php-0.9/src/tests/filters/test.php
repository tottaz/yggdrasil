<?php
/**
 * @package tests
 * @subpackage filters
 * @author VxR <vxr@vxr.it>
 * @version $Revision: 1.5 $
 * @since 0.3
 */

/**
 * @var array Test array
 */
$tests = array(
    'LoggerDenyAllFilter'       => array( 
        '__COMMENT__'  => 'Block all.'
    ),
    'LoggerStringMatchFilter'   => array( 
        '__COMMENT__'  => 'discard events with the string "test" in message.'
    ),
    'LoggerLevelMatchFilter'   => array( 
        '__COMMENT__'  => 'discard events with "DEBUG" level.'
    ),
    'LoggerLevelRangeFilter'   => array( 
        '__COMMENT__'  => 'report only "WARN" and "ERROR" events.'
    ),
);

require_once('../test_core.php');

?>