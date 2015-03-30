<?php
/**
 * Chainsaw is a simple socket server that reads 
 * an {@link LoggerXmlLayout} stream.
 *
 * @package chainsaw 
 */

/**
 * @ignore
 */
define('LOG4PHP_DIR', '../log4php');

/**
 * @ignore
 */
define('LOG4PHP_INIT_OVERRIDE', true);

if (!extension_loaded('sockets')) {
    if (substr(php_uname(), 0, 7) == "Windows") {
        $socketExtension = 'php_sockets.dll';
    } else {
        $socketExtension = 'php_sockets.dll';
    }
    if (!dl($socketExtension))
        die ("Cannot load socket extension [{$socketExtension}]");
}

ini_set('html_errors', '0');
error_reporting (E_ALL);

require_once('./ChainsawEventsXmlParser.php');

/* Allow the script to hang around waiting for connections. */
set_time_limit (0);

/* Turn on implicit output flushing so we see what we're getting
 * as it comes in. */
ob_implicit_flush ();

define('CHAINSAW_HOSTNAME', 'localhost');
define('CHAINSAW_PORT', 4445);
define('CHAINSAW_TIMEOUT', 30);

$chainsaw = new ChainSaw();
$chainsaw->main();

/**
 * Chainsaw is a simple socket server that reads 
 * an {@link LoggerXmlLayout} stream.
 *
 * @package chainsaw 
 */
class ChainSaw {

    function ChainSaw()
    {
        return;        
    }

    function main()
    {
        trigger_error("ChainSaw::main()", E_USER_NOTICE);    
    
        if (($sock = socket_create (AF_INET, SOCK_STREAM, 0)) < 0) {
            trigger_error("ChainSaw::main() sockect_create() failed: Reason: " . socket_strerror ($sock), E_USER_ERROR);
        }
        
        if (($ret = socket_bind ($sock, gethostbyname(CHAINSAW_HOSTNAME), CHAINSAW_PORT)) < 0) {
            trigger_error("ChainSaw::main() socket_bind() failed: reason: " . socket_strerror ($ret), E_USER_ERROR);
        }
        
        if (($ret = socket_listen ($sock, 5)) < 0) {
            trigger_error("ChainSaw::main() socket_listen() failed: reason: " . socket_strerror ($ret), E_USER_ERROR);
        }
        
        $parser = new ChainsawEventsXmlParser($this);
       
        do {
            trigger_error("ChainSaw::main() loop 1", E_USER_NOTICE);    
        
            if (($msgsock = socket_accept($sock)) < 0) {
                trigger_error("ChainSaw::main() socket_accept() failed: reason: " . socket_strerror ($msgsock), E_USER_WARNING);
                break;
            }
            
            $parser->startParse();
            $parser->parse("<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>\r\n");
    
            do {
                
//                trigger_error("ChainSaw::main() loop 2", E_USER_NOTICE);    
            
                if (FALSE === ($buf = socket_read ($msgsock, 512))) {
                    trigger_error("ChainSaw::main() socket_read() failed: reason: " . socket_strerror (socket_last_error()), E_USER_WARNING);
                    break 2;
                }
                if ($buf == '') {
                    trigger_error("ChainSaw::main() buffer is empty", E_USER_NOTICE);                    
//                    socket_close ($msgsock);
                    break;
                }
                echo "\n----------------------------------------------------\n";
                echo $buf;
                echo "\n----------------------------------------------------\n";
                $parser->parse($buf);
            } while (true);
            $parser->stopParse();            
            socket_close ($msgsock);
        } while (true);

        socket_close ($sock);
    }
    
    function receive($event)
    {
        trigger_error("ChainSaw::receive() ".$event->getRenderedMessage(), E_USER_NOTICE);
    }
    
}
?>