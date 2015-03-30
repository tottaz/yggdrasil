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
require_once('./MyLoggerFactory.php');

/**
 * A simple example showing logger subclassing. 
 *
 * @package tests
 * @subpackage loggers
 * @author VxR <vxr@vxr.it>
 * @version $Revision: 1.1 $
 * @since 0.6
 */
class MyLogger extends Logger {

    var $fqcn = "MyLogger.";

    /**
     * Just calls the parent constuctor.
     *
     * @param string $name
     */
    function MyLogger($name)
    {
        $this->Logger($name);
    }

    /**
     * Overrides the standard debug method by appending " world" at the
     * end of each message.
     *
     * @param mixed $message
     * @param mixed $caller  
     */
    function debug($message, $caller = null)
    {
        if (is_string($message)) {
            $this->log(LoggerLevel::getLevelDebug(), $message . ' Hi, by MyLogger.', $caller);
        } else {    
            $this->log(LoggerLevel::getLevelDebug(), $message, $caller);
        }        
    }

    /**
     * This method overrides {@link Logger#getInstance} by supplying
     * its own factory type as a parameter.
     *
     * @param string $name
     * @return Logger
     * @static
     */
    function getInstance($name)
    {
        return Logger::getLogger($name, MyLogger::getMyFactory()); 
    }
  
    /**
     * This method overrides {@link Logger#getLogger} by supplying
     * its own factory type as a parameter.
     *
     * @param string $name
     * @return Logger
     * @static
     *
     */
    function getLogger($name)
    {
        return Logger::getLogger($name, MyLogger::getMyFactory()); 
    }

    /**
     * @return LoggerFactory
     * @static
     */
    function getMyFactory()
    {
        static $factory;
        
        if (!isset($factory))
            $factory = new MyLoggerFactory();

        return $factory;
    }
}
?>