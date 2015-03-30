<?php
/**
 * @package tests
 * @author VxR <vxr@vxr.it>
 * @version $Revision: 1.8 $
 * @since 0.3
 */
 
error_reporting(E_ALL);
 
$which = @$_GET['test'];

if (!empty($which) and isset($tests[$which])) {

    if (isset($tests[$which]['LOG4PHP_DIR']) and $tests[$which]['LOG4PHP_DIR'] !== null) {
        /**
         * @ignore
         */
        define('LOG4PHP_DIR', $tests[$which]['LOG4PHP_DIR']);
    } else {
        /**
         * @ignore
         */
        define('LOG4PHP_DIR', '../../log4php');
    }

    if (isset($tests[$which]['LOG4PHP_CONFIGURATION'])) {
        /**
         * @ignore
         */
        define('LOG4PHP_CONFIGURATION', $tests[$which]['LOG4PHP_CONFIGURATION']);
    } else {
        /**
         * @ignore
         */
        define('LOG4PHP_CONFIGURATION', "./configs/{$which}.xml");
    }
    
    if (isset($tests[$which]['CONTENT_TYPE']))
        header("content-type: ".$tests[$which]['CONTENT_TYPE']);

    if (isset($tests[$which]['TEST_SEND_HTML']))
        /**
         * @ignore
         */
        define('TEST_SEND_HTML', $tests[$which]['TEST_SEND_HTML']);
        
    if (isset($tests[$which]['HTML_HEADER']))
        echo $tests[$which]['HTML_HEADER'];
    
    if (!defined('TEST_SEND_HTML'))
        define('TEST_SEND_HTML', true);
    
    if (TEST_SEND_HTML)
        echo "<pre>";
    
    include_once(LOG4PHP_DIR . '/LoggerManager.php');
    
    if (isset($tests[$which]['INCLUDES'])) {
        $includes = explode(',', $tests[$which]['INCLUDES']);
        if (sizeof($includes) > 0) {
            foreach($includes as $include) {
                include_once($include);
            }
        }
    }
    
    include_once('../test_body.php');
    if (file_exists('./test_body.php'))
        include_once('./test_body.php');    

    LoggerManager::shutdown();

    if (TEST_SEND_HTML)
        echo "</pre>";
    
    if (isset($tests[$which]['HTML_FOOTER']))
        echo $tests[$which]['HTML_FOOTER'];
    
    exit;
    
} else {
    if (isset($tests) and sizeof($tests) > 0) {
        foreach ($tests as $test => $value) {
            echo "<pre>\n";
            echo "Test <a href=\"test.php?test={$test}\">{$test}</a> ";
            echo isset($value['__COMMENT__']) ? "({$value['__COMMENT__']})" : "";
            echo "\n";
            echo "</pre>\n";
        }
    } else {
        echo "<pre>\n";
        echo "No Tests defined.\n";
        echo "</pre>\n";
    }    
}

?>