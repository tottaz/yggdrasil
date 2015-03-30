<?php if (!defined("BASEPATH")) exit("No direct script access allowed");

/**
 * @name		CodeIgniter Message Queue Library using PHP PHP-AMQPLib Client
 * @author		Jogi Silalahi
 * @link		http://jogisilalahi.com
 *
 * This message queue library is a wrapper CodeIgniter library using PHP-AMQPLib
 */

//require_once __DIR__ . '../../third_party/PhpAmqpLib/vendor/autoload.php';
        require_once("third_party/modules/PhpAmqpLib/vendor/autoload.php");

use PhpAmqpLib\Connection\AMQPConnection;
use PhpAmqpLib\Message\AMQPMessage;

class Queue {
    
    /**
     * Confirguration
     * Default configuration intialized from queue config file
     */
    var $host = '';
    var $port = '';
    var $user = '';
    var $pass = '';
    
    /**
     * Connection
     */
    var $connection = null;
    
    /**
     * Channel
     */
    var $channel = null;
     
    
    /**
     * Constructor with configuration array
     *
     * @param array $config
     */
    public function __construct($config=array()) {
	    
	    // Configuration
		if ( ! empty($config) ) {
			$this->initialize($config);
		}
		
		// Connecting to message server
		$this->connection = new AMQPConnection($this->host, $this->port, $this->user, $this->pass);
		$this->channel = $this->connection->channel();
	    
    }
    
    /**
     * Initialize with configuration array
     *
     * @param array $config
     */
    public function initialize($config=array()) {
	    foreach ($config as $key=>$value) {
		     $this->{$key} = $value;
	    }
    }    
    
    /**
     * Queuing new message
     *
     * @param string $job
     * @param array $data
     * @param string $route
     */
    public function push($job, $data=array(), $route=null) {
    
    	// AMQP Message in string, in this case we using JSON
    	if( is_array($data) ) {
	    	$data = json_encode($data);
    	}
    	$message = new AMQPMessage($data);
    
    	$this->channel->exchange_declare($job, 'direct', false, false, false);
    	$this->channel->basic_publish($message, $job, $route);
    }
    
    
    /**
     * Queuing scheduled message
     *
     * @param integer $delay
     * @param array $job
     * @param array $data
     * @param string $route
     */
    public function later($delay, $job, $data, $route=null) {
	    // TODO: implement scheduled message
    }    
    
    /**
     * Destructor
     */
    public function __destruct() {
    
    	// Channel closing
	    if( $this->channel) {
		    $this->channel->close();
	    }
	    
	    // Connection closing
	    if( $this->connection) {
		    $this->connection->close();
	    }
    }
    
}

/* End of file queue.php */
/* Location: ./application/libraries/queue.php */