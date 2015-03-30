<?php
/**
 * Chainsaw is a simple socket server that reads 
 * an {@link LoggerXmlLayout} stream.
 *
 * @package chainsaw 
 */

/**
 */
require_once(LOG4PHP_DIR . '/LoggerLevel.php');
require_once(LOG4PHP_DIR . '/spi/LoggerLoggingEvent.php');

if (!defined('LOG4PHP_LOGGER_DOM_CONFIGURATOR_XMLNS'))
    /**
     * @ignore
     */
    define('LOG4PHP_LOGGER_DOM_CONFIGURATOR_XMLNS', 'HTTP://WWW.VXR.IT/LOG4PHP/');

/**
 * Parser the xml stream 
 *
 * @package chainsaw 
 */
class ChainsawEventsXmlParser {

    var $eventSetStarted = false;
    var $eventStarted = false;
    var $messageStarted = false;
    var $ndcStarted = false;
    var $locationInfoStarted = false;

    var $event = null;
    var $receiver = null;
    
    var $htmlEntititesTT;
    
    function ChainsawEventsXmlParser(&$receiver)
    {
        trigger_error("ChainsawEventsXmlParser::ChainsawEventsXmlParser()", E_USER_NOTICE);    
    
        $this->receiver =& $receiver;
        $this->htmlEntitiesTT = get_html_translation_table(HTML_ENTITIES, ENT_QUOTES);
        $this->htmlEntitiesTT = array_merge($this->htmlEntitiesTT, get_html_translation_table(HTML_SPECIALCHARS, ENT_QUOTES));
        $this->htmlEntitiesTT = array_flip($this->htmlEntitiesTT);
        $this->htmlEntitiesTT['&#039;'] = "'";
        
        print_r($this->htmlEntitiesTT);

    }
    
    function dispatch()
    {
        trigger_error("ChainsawEventsXmlParser::dispatch()", E_USER_NOTICE);    
    
        if ($this->event !== null) {
            $this->receiver->receive($this->event);
        }
    }
    
    function startParse()
    {
        trigger_error("ChainsawEventsXmlParser::startParse()", E_USER_NOTICE);    

    
        $this->parser = xml_parser_create_ns();
        
        xml_set_object($this->parser, &$this);
        xml_set_element_handler($this->parser, "starttag", "endtag");
        xml_set_character_data_handler($this->parser, "cdata");
        
    }
    
    function parse($data, $last = false)
    {
        trigger_error("ChainsawEventsXmlParser::parse()", E_USER_NOTICE);    
    
        if (!xml_parse($this->parser, $data, $last)) {
            $errorCode = xml_get_error_code($this->parser);
            $errorStr = xml_error_string($errorCode);
            $errorLine = xml_get_current_line_number($this->parser);
            trigger_error("ChainsawEventsXmlParser::parse() parsing error [{$errorCode}] {$errorStr}, line {$errorLine}", E_USER_ERROR);
        }
    }
    
    function stopParse()
    {
        trigger_error("ChainsawEventsXmlParser::stopParse()", E_USER_NOTICE);
    
        xml_parser_free($this->parser);

        $this->eventSetStarted = false;
        $this->eventStarted = false;
        $this->messageStarted = false;
        $this->ndcStarted = false;
        $this->locationInfoStarted = false;
        $this->event = null;
        $this->parser = null;
    }     

    function startTag($xp, $tag, $attribs)
    {
        switch ($tag) {
            
            case 'LOG4PHP:EVENTSET':
            case LOG4PHP_LOGGER_DOM_CONFIGURATOR_XMLNS.':EVENTSET':
            
                $this->eventSetStarted = true;
                break;

            case 'LOG4PHP:EVENT':
            case LOG4PHP_LOGGER_DOM_CONFIGURATOR_XMLNS.':EVENT':
            
/*
<!ATTLIST log4j:event
    logger     CDATA #REQUIRED
    level      CDATA #REQUIRED
    thread     CDATA #REQUIRED
    timestamp  CDATA #REQUIRED
>
*/            
                $this->eventStarted = true;
                $this->event = new LoggerLoggingEvent(
                    null, 
                    $attribs['LOGGER'],
                    LoggerLevel::toLevel($attribs['LEVEL']),
                    '',
                    (float)($attribs['TIMESTAMP'] / 1000)
                );
                $this->event->threadName    = (string)$attribs['THREAD'];
                $this->ndc = '';
                break;                                               
            
            case 'LOG4PHP:MESSAGE':
            case LOG4PHP_LOGGER_DOM_CONFIGURATOR_XMLNS.':MESSAGE':            
                $this->messageStarted = true;
                break;
            
            case 'LOG4PHP:NDC':
            case LOG4PHP_LOGGER_DOM_CONFIGURATOR_XMLNS.':NDC':
                $this->ndcStarted = true;                
                break;
            
/*
<!ATTLIST log4j:locationInfo
  class  CDATA  #REQUIRED
  method CDATA  #REQUIRED
  file   CDATA  #REQUIRED
  line   CDATA  #REQUIRED
>
*/
            case 'LOG4PHP:LOCATIONINFO':
            case LOG4PHP_LOGGER_DOM_CONFIGURATOR_XMLNS.':LOCATIONINFO':
                if ($this->event !== null) {
                    $this->event->locationInfo = new LoggerLocationInfo(array(
                        'line'      => $attribs['LINE'],
                        'file'      => $attribs['FILE'],
                        'class'     => $attribs['CLASS'],
                        'function'  => $attribs['METHOD']
                    ), null);
                }
                break;
            
        }
    }
    
    function endTag($xp, $tag)
    {
        switch ($tag) {
            
            case 'LOG4PHP:EVENTSET':
            case LOG4PHP_LOGGER_DOM_CONFIGURATOR_XMLNS.':EVENTSET':
                $this->eventSetStarted = false;
                break;
                
            case 'LOG4PHP:EVENT':
            case LOG4PHP_LOGGER_DOM_CONFIGURATOR_XMLNS.':EVENT':
                if ($this->eventStarted) {
                    $this->dispatch();
                }
                $this->eventStarted = false;
                break;
            
            case 'LOG4PHP:MESSAGE':
            case LOG4PHP_LOGGER_DOM_CONFIGURATOR_XMLNS.':MESSAGE':
                $translatedMessage = strtr($this->event->message, $this->htmlEntitiesTT);
                $this->event->message = $translatedMessage;
                $this->messageStarted = false;
                break;
            
            case 'LOG4PHP:NDC':
            case LOG4PHP_LOGGER_DOM_CONFIGURATOR_XMLNS.':NDC':
                $translatedNdc = strtr($this->event->ndc, $this->htmlEntitiesTT);            
                $this->event->ndc = $translatedNdc;            
                $this->ndcStarted = false;
                break;
            
        }
    }
    
    function cdata($xp, $data)
    {
        if ($this->event !== null) {
            if ($this->messageStarted) {
    
                trigger_error("ChainsawEventsXmlParser::cdata($data) MESSAGE", E_USER_NOTICE);
            
                $this->event->message .= $data;
            } elseif ($this->ndcStarted) {
            
                trigger_error("ChainsawEventsXmlParser::cdata($data) NDC", E_USER_NOTICE);
            
                $this->event->ndcLookupRequired = false;
                $this->event->ndc .= $data;
            }
        }
    }


}


?>