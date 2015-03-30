<?php
/**
 * @package tests
 * @subpackage loggers
 * @author VxR <vxr@vxr.it>
 * @version $Revision: 1.1 $
 * @since 0.6
 */
 
/**
 */
require_once(LOG4PHP_DIR . '/spi/LoggerFactory.php');
require_once('./MyLogger.php');

/**
 * A factory that makes new {@link MyLogger} objects.
 *
 * @package tests
 * @subpackage loggers
 * @author VxR <vxr@vxr.it>
 * @version $Revision: 1.1 $
 * @since 0.6
 */
class MyLoggerFactory extends LoggerFactory {

    /**
     *  The constructor should be public as it will be called by
     * configurators in different packages.  
     */
    function MyLoggerFactory()
    {
        return;
    }

    /**
     * @param string $name
     * @return Logger
     */
    function makeNewLoggerInstance($name)
    {
        return new MyLogger($name);
    }
}
?>