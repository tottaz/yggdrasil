<?php
/**
 * log4php is a PHP port of the log4j java logging package.
 * 
 * <p>This framework is based on log4j see {@link http://jakarta.apache.org/log4j log4j}.
 * Design, strategies and part of the methods documention are developed by log4j team 
 * (Ceki Gulcu as log4j project founder and 
 * {@link http://jakarta.apache.org/log4j/docs/contributors.html contributors}).
 *
 * Copyright (C) The Apache Software Foundation. All rights reserved.</p>
 *
 * <p>PHP port, extensions and modifications by VxR. All rights reserved.</p>
 * <p>For more information, please see {@link http://www.vxr.it/log4php/}.</p>
 *
 * <p>This software is published under the terms of the LGPL License
 * a copy of which has been included with this distribution in the LICENSE file.
 * 
 * @package log4php
 */

/**
 * @ignore 
 */
if (!defined('LOG4PHP_DIR')) define('LOG4PHP_DIR', dirname(__FILE__));
 
/**
 */
require_once(LOG4PHP_DIR . '/LoggerLog.php');

/**
* The ALL has the lowest possible rank and is intended to turn on all logging
*/
define('LOGGER_LEVEL_ALL',                            0);

/**
 * The DEBUG Level designates fine-grained informational events that are most useful to debug an application.
 */
define('LOGGER_LEVEL_DEBUG',                          10);

/**
 * The INFO level designates informational messages that highlight the progress of the application at coarse-grained level.
 */
define('LOGGER_LEVEL_INFO',                           20);

/**
 * The WARN level designates potentially harmful situations.
 */
define('LOGGER_LEVEL_WARN',                           30);

/**
 * The ERROR level designates error events that might still allow the application to continue running.
 */
define('LOGGER_LEVEL_ERROR',                          40);

/**
 * The FATAL level designates very severe error events that will presumably lead the application to abort.
 */
define('LOGGER_LEVEL_FATAL',                          50);

/**
 * The OFF has the highest possible rank and is intended to turn off logging.
 */
define('LOGGER_LEVEL_OFF',                          256);

/**
 * Encapsulate Level mechanics
 *
 * @author VxR <vxr@vxr.it>
 * @package log4php
 */
class LoggerLevel {

    /**
     * Convert a string level to costant
     *
     * @param string $str string level
     * @return integer mapped level
     * @static
     */
    function toCode($str)
    {
        if (is_int($str)) {
            switch (is_int($str)) {
                case LOGGER_LEVEL_ALL:
                case LOGGER_LEVEL_DEBUG:
                case LOGGER_LEVEL_INFO:
                case LOGGER_LEVEL_WARN:
                case LOGGER_LEVEL_ERROR:
                case LOGGER_LEVEL_FATAL:
                case LOGGER_LEVEL_OFF:
                    return $str;
                default:
                    return LOGGER_LEVEL_ALL;
            }                                                                    
        } else {
            switch (strtoupper($str)) {
                case 'ALL':     return LOGGER_LEVEL_ALL;
                case 'DEBUG':   return LOGGER_LEVEL_DEBUG;
                case 'INFO':    return LOGGER_LEVEL_INFO;
                case 'WARN':    return LOGGER_LEVEL_WARN;
                case 'ERROR':   return LOGGER_LEVEL_ERROR;
                case 'FATAL':   return LOGGER_LEVEL_FATAL;
                case 'OFF':     return LOGGER_LEVEL_OFF;
                default:
                                return LOGGER_LEVEL_ALL;                                                                    
            }
        }
    }
    
    /**
     * Convert a constant level to string
     *
     * @param integer $level
     * @return string mapped level
     * @static
     */
    function toString($level)
    {
        switch ($level) {
            case LOGGER_LEVEL_ALL:    return 'all';    
            case LOGGER_LEVEL_DEBUG:  return 'debug';   
            case LOGGER_LEVEL_INFO:   return 'info';   
            case LOGGER_LEVEL_WARN:   return 'warn';   
            case LOGGER_LEVEL_ERROR:  return 'error';   
            case LOGGER_LEVEL_FATAL:  return 'fatal';   
            case LOGGER_LEVEL_OFF:    return 'off';
            default:                  
                LoggerLog::warn("LoggerLevel::toString() undefined level. Returning ''"); 
                return '';
        }
    }
    
    /**
     * Validate a level
     *
     * @param mixed $level the string to validate
     * @return boolean
     * @static
     */
    function isLevel($level)
    {
        if (is_string($level)) {
            switch (strtoupper($level)) {
                case 'ALL':     
                case 'DEBUG':   
                case 'INFO':    
                case 'WARN':    
                case 'ERROR':   
                case 'FATAL':   
                case 'OFF':     return true;
            }
        } else {
            switch ($level) {
                case LOGGER_LEVEL_ALL:     
                case LOGGER_LEVEL_DEBUG:   
                case LOGGER_LEVEL_INFO:    
                case LOGGER_LEVEL_WARN:    
                case LOGGER_LEVEL_ERROR:   
                case LOGGER_LEVEL_FATAL:   
                case LOGGER_LEVEL_OFF:     return true;
            }
        }
        return false;
    }
}
?>