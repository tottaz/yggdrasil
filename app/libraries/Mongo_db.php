<? if ( ! defined('BASEPATH')) exit('No direct script access allowed');


/* PLEASE NOTE: Alex Bilbe (http://www.alexbilbie.com) has merged this fork of his original code back into his own. http://bitbucket.org/alexbilbie/codeigniter-mongo-library/wiki/Home
*/

/**
 * CodeIgniter MongoDB Active Record Library
 *
 * A library to interface with the NoSQL database MongoDB. For more information see http://www.mongodb.org
 * Originally created by Alex Bilbie, but extended and updated by Kyle J. Dye
 *
 * @package		CodeIgniter
 * @author		Kyle J. Dye | www.kyledye.com | kyle@kyledye.com
 * @copyright	Copyright (c) 2010, Kyle J. Dye.
 * @license		http://codeigniter.com/user_guide/license.html
 * @link		http://kyledye.com
 * @version		Version 0.2
 */

class Mongo_db {
	
	private $CI;
	private $config_file = 'mongo_db';
	
	private $connection;
	private $db;
	private $connection_string;
	
	private $host;
	private $port;
	private $user;
	private $pass;
	private $dbname;
	private $persist;
	private $persist_key;
	
	private $selects = array();
	private $wheres = array();
	private $sorts = array();
	
	private $limit = 999999;
	private $offset = 0;
	
	/**
	 *	--------------------------------------------------------------------------------
	 *	CONSTRUCTOR
	 *	--------------------------------------------------------------------------------
	 *
	 *	Automatically check if the Mongo PECL extension has been installed/enabled.
	 *	Generate the connection string and establish a connection to the MongoDB.
	 */
	
	public function __construct() {
		if(!class_exists('Mongo')):
			show_error("The MongoDB PECL extension has not been installed or enabled", 500);
		endif;
		$this->CI =& get_instance();
		$this->connection_string();
		$this->connect();
	}
	
	/**
	 *	--------------------------------------------------------------------------------
	 *	Switch_db
	 *	--------------------------------------------------------------------------------
	 *
	 *	Switch from default database to a different db
	 */
	
	public function switch_db($database = '') {
		if(empty($database)):
			show_error("To switch MongoDB databases, a new database name must be specified", 500);
		endif;
		$this->dbname = $database;
		try {
			$this->db = $this->connection->{$this->dbname};
			return(TRUE);
		} catch(Exception $e) {
			show_error("Unable to switch Mongo Databases: {$e->getMessage()}", 500);
		}
	}
	
	/**
	 *	--------------------------------------------------------------------------------
	 *	SELECT FIELDS
	 *	--------------------------------------------------------------------------------
	 *
	 *	Determine which fields to include OR which to exclude during the query process.
	 *	Currently, including and excluding at the same time is not available, so the 
	 *	$includes array will take precedence over the $excludes array.  If you want to 
	 *	only choose fields to exclude, leave $includes an empty array().
	 *
	 *	@usage: $this->mongo_db->select(array('foo', 'bar'))->get('foobar');
	 */
	 
	public function select($includes = array(), $excludes = array()) {
	 	if(!is_array($includes))
	 		$includes = array();
	 	if(!is_array($excludes))
	 		$excludes = array();
	 	if(!empty($includes)):
	 		foreach($includes as $col):
	 			$this->selects[$col] = 1;
	 		endforeach;
	 	else:
	 		foreach($excludes as $col):
	 			$this->selects[$col] = 0;
	 		endforeach;
	 	endif;
		return($this);
	}
	
	/**
	 *	--------------------------------------------------------------------------------
	 *	WHERE PARAMETERS
	 *	--------------------------------------------------------------------------------
	 *
	 *	Get the documents based on these search parameters.  The $wheres array should 
	 *	be an associative array with the field as the key and the value as the search
	 *	criteria.
	 *
	 *	@usage = $this->mongo_db->where(array('foo' => 'bar'))->get('foobar');
	 */
	 
	 public function where($wheres = array()) {
	 	foreach($wheres as $wh => $val):
	 		$this->wheres[$wh] = $val;
	 	endforeach;
	 	return($this);
	 }
	 
	/**
	 *	--------------------------------------------------------------------------------
	 *	WHERE_IN PARAMETERS
	 *	--------------------------------------------------------------------------------
	 *
	 *	Get the documents where the value of a $field is in a given $in array().
	 *
	 *	@usage = $this->mongo_db->where_in('foo', array('bar', 'zoo', 'blah'))->get('foobar');
	 */
	 
	 public function where_in($field = "", $in = array()) {
	 	$this->where_init($field);
	 	$this->wheres[$field]['$in'] = $in;
	 	return($this);
	 }
	 
	/**
	 *	--------------------------------------------------------------------------------
	 *	WHERE_NOT_IN PARAMETERS
	 *	--------------------------------------------------------------------------------
	 *
	 *	Get the documents where the value of a $field is not in a given $in array().
	 *
	 *	@usage = $this->mongo_db->where_not_in('foo', array('bar', 'zoo', 'blah'))->get('foobar');
	 */
	 
	 public function where_not_in($field = "", $in = array()) {
	 	$this->where_init($field);
	 	$this->wheres[$field]['$nin'] = $in;
	 	return($this);
	 }
	 
	/**
	 *	--------------------------------------------------------------------------------
	 *	WHERE GREATER THAN PARAMETERS
	 *	--------------------------------------------------------------------------------
	 *
	 *	Get the documents where the value of a $field is greater than $x
	 *
	 *	@usage = $this->mongo_db->where_gt('foo', 20);
	 */
	 
	 public function where_gt($field = "", $x) {
	 	$this->where_init($field);
	 	$this->wheres[$field]['$gt'] = $x;
	 	return($this);
	 }

	/**
	 *	--------------------------------------------------------------------------------
	 *	WHERE GREATER THAN OR EQUAL TO PARAMETERS
	 *	--------------------------------------------------------------------------------
	 *
	 *	Get the documents where the value of a $field is greater than or equal to $x
	 *
	 *	@usage = $this->mongo_db->where_gte('foo', 20);
	 */
	 
	 public function where_gte($field = "", $x) {
	 	$this->where_init($field);
	 	$this->wheres[$field]['$gte'] = $x;
	 	return($this);
	 }

	/**
	 *	--------------------------------------------------------------------------------
	 *	WHERE LESS THAN PARAMETERS
	 *	--------------------------------------------------------------------------------
	 *
	 *	Get the documents where the value of a $field is less than $x
	 *
	 *	@usage = $this->mongo_db->where_lt('foo', 20);
	 */
	 
	 public function where_lt($field = "", $x) {
	 	$this->where_init($field);
	 	$this->wheres[$field]['$lt'] = $x;
	 	return($this);
	 }

	/**
	 *	--------------------------------------------------------------------------------
	 *	WHERE LESS THAN OR EQUAL TO PARAMETERS
	 *	--------------------------------------------------------------------------------
	 *
	 *	Get the documents where the value of a $field is less than or equal to $x
	 *
	 *	@usage = $this->mongo_db->where_lte('foo', 20);
	 */
	 
	 public function where_lte($field = "", $x) {
	 	$this->where_init($field);
	 	$this->wheres[$field]['$lte'] = $x;
	 	return($this);
	 }
	
	/**
	 *	--------------------------------------------------------------------------------
	 *	WHERE BETWEEN PARAMETERS
	 *	--------------------------------------------------------------------------------
	 *
	 *	Get the documents where the value of a $field is between $x and $y
	 *
	 *	@usage = $this->mongo_db->where_between('foo', 20, 30);
	 */
	 
	 public function where_between($field = "", $x, $y) {
	 	$this->where_init($field);
	 	$this->wheres[$field]['$gte'] = $x;
	 	$this->wheres[$field]['$lte'] = $y;
	 	return($this);
	 }
	
	/**
	 *	--------------------------------------------------------------------------------
	 *	WHERE BETWEEN AND NOT EQUAL TO PARAMETERS
	 *	--------------------------------------------------------------------------------
	 *
	 *	Get the documents where the value of a $field is between but not equal to $x and $y
	 *
	 *	@usage = $this->mongo_db->where_between_ne('foo', 20, 30);
	 */
	 
	 public function where_between_ne($field = "", $x, $y) {
	 	$this->where_init($field);
	 	$this->wheres[$field]['$gt'] = $x;
	 	$this->wheres[$field]['$lt'] = $y;
	 	return($this);
	 }
	
	/**
	 *	--------------------------------------------------------------------------------
	 *	WHERE NOT EQUAL TO PARAMETERS
	 *	--------------------------------------------------------------------------------
	 *
	 *	Get the documents where the value of a $field is not equal to $x
	 *
	 *	@usage = $this->mongo_db->where_between('foo', 20, 30);
	 */
	 
	 public function where_ne($field = "", $x) {
	 	$this->where_init($field);
	 	$this->wheres[$field]['$ne'] = $x;
	 	return($this);
	 }
	
	/**
	 *	--------------------------------------------------------------------------------
	 *	LIKE PARAMETERS
	 *	--------------------------------------------------------------------------------
	 *	
	 *	Get the documents where the (string) value of a $field is like a value. The defaults
	 *	allow for a case-insensitive search.
	 *
	 *	@param $flags
	 *	Allows for the typical regular expression flags:
	 *		i = case insensitive
	 *		m = multiline
	 *		x = can contain comments
	 *		l = locale
	 *		s = dotall, "." matches everything, including newlines
	 *		u = match unicode
	 *
	 *	@param $enable_start_wildcard
	 *	If set to anything other than TRUE, a starting line character "^" will be prepended
	 *	to the search value, representing only searching for a value at the start of 
	 *	a new line.
	 *
	 *	@param $enable_end_wildcard
	 *	If set to anything other than TRUE, an ending line character "$" will be appended
	 *	to the search value, representing only searching for a value at the end of 
	 *	a line.
	 *
	 *	@usage = $this->mongo_db->like('foo', 'bar', 'im', FALSE, TRUE);
	 */
	 
	 public function like($field = "", $value = "", $flags = "i", $enable_start_wildcard = TRUE, $enable_end_wildcard = TRUE) {
	 	$field = (string) trim($field);
	 	$this->where_init($field);
	 	$value = (string) trim($value);
	 	$value = quotemeta($value);
	 	if($enable_start_wildcard !== TRUE):
	 		$value = "^" . $value;
	 	endif;
	 	if($enable_end_wildcard !== TRUE):
	 		$value .= "$";
	 	endif;
	 	$regex = "/$value/$flags";
	 	$this->wheres[$field] = new MongoRegex($regex);
	 	return($this);
	 }
	 
	/**
	 *	--------------------------------------------------------------------------------
	 *	ORDER BY PARAMETERS
	 *	--------------------------------------------------------------------------------
	 *
	 *	Sort the documents based on the parameters passed. To set values to descending order,
	 *	you must pass values of either -1, FALSE, 'desc', or 'DESC', else they will be
	 *	set to 1 (ASC).
	 *
	 *	@usage = $this->mongo_db->where_between('foo', 20, 30);
	 */
	 
	 public function order_by($fields = array()) {
	 	foreach($fields as $col => $val):
	 		if($val == -1 || $val === FALSE || strtolower($val) == 'desc'):
	 			$this->sorts[$col] = -1; 
	 		else:
	 			$this->sorts[$col] = 1;
	 		endif;
	 	endforeach;
	 	return($this);
	 }
	
	/**
	 *	--------------------------------------------------------------------------------
	 *	LIMIT DOCUMENTS
	 *	--------------------------------------------------------------------------------
	 *
	 *	Limit the result set to $x number of documents
	 *
	 *	@usage = $this->mongo_db->limit($x);
	 */
	 
	 public function limit($x = 99999) {
	 	if($x !== NULL && is_numeric($x) && $x >= 1)
	 		$this->limit = (int) $x;
	 	return($this);
	 }
	
	/**
	 *	--------------------------------------------------------------------------------
	 *	OFFSET DOCUMENTS
	 *	--------------------------------------------------------------------------------
	 *
	 *	Offset the result set to skip $x number of documents
	 *
	 *	@usage = $this->mongo_db->offset($x);
	 */
	 
	 public function offset($x = 0) {
	 	if($x !== NULL && is_numeric($x) && $x >= 1)
	 		$this->offset = (int) $x;
	 	return($this);
	 }
	 
	/**
	 *	--------------------------------------------------------------------------------
	 *	GET_WHERE
	 *	--------------------------------------------------------------------------------
	 *
	 *	Get the documents based upon the passed parameters
	 *
	 *	@usage = $this->mongo_db->get_where('foo', array('bar' => 'something'));
	 */
	
	 public function get_where($collection = "", $where = array(), $limit = 99999) {
	 	return($this->where($where)->limit($limit)->get($collection));
	 }
	 
	/**
	 *	--------------------------------------------------------------------------------
	 *	GET
	 *	--------------------------------------------------------------------------------
	 *
	 *	Get the documents based upon the passed parameters
	 *
	 *	@usage = $this->mongo_db->get('foo', array('bar' => 'something'));
	 */
	
	 public function get($collection = "") {
	 	if(empty($collection))
	 		show_error("In order to retreive documents from MongoDB, a collection name must be passed", 500);
	 	$results = array();
	 	$documents = $this->db->{$collection}->find($this->wheres, $this->selects)->limit((int) $this->limit)->skip((int) $this->offset)->sort($this->sorts);
	 	
	 	$returns = array();
	 	
	 	foreach($documents as $doc):
	 		$returns[] = $doc;
	 	endforeach;
	 	
	 	return($returns);
	 	
	 	//return(iterator_to_array($documents));
	 }
	 
	/**
	 *	--------------------------------------------------------------------------------
	 *	COUNT
	 *	--------------------------------------------------------------------------------
	 *
	 *	Count the documents based upon the passed parameters
	 *
	 *	@usage = $this->mongo_db->get('foo');
	 */
	 
	 public function count($collection = "") {
	 	if(empty($collection))
	 		show_error("In order to retreive a count of documents from MongoDB, a collection name must be passed", 500);
	 	$count = $this->db->{$collection}->find($this->wheres)->limit((int) $this->limit)->skip((int) $this->offset)->count();
	 	$this->clear();
	 	return($count);
	 }
	 
	/**
	 *	--------------------------------------------------------------------------------
	 *	INSERT
	 *	--------------------------------------------------------------------------------
	 *
	 *	Insert a new document into the passed collection
	 *
	 *	@usage = $this->mongo_db->insert('foo', $data = array());
	 */
	
	 public function insert($collection = "", $data = array()) {
	 	if(empty($collection))
	 		show_error("No Mongo collection selected to insert into", 500);
	 	if(count($data) == 0 || !is_array($data))
	 		show_error("Nothing to insert into Mongo collection or insert is not an array", 500);
	 	
	 	try {
	 		$this->db->{$collection}->insert($insert, array('safe' => TRUE));
	 		if(isset($insert['_id']))
	 			return($insert['_id']);
	 		else
	 			return(FALSE);
	 	} catch(MongoCursorException $e) {
	 		show_error("Insert of data into MongoDB failed: {$e->getMessage()}", 500);
	 	}
	 	
	 }
	 
	/**
	 *	--------------------------------------------------------------------------------
	 *	UPDATE
	 *	--------------------------------------------------------------------------------
	 *
	 *	Insert a new document into the passed collection
	 *
	 *	@usage = $this->mongo_db->update('foo', $data = array());
	 */
	
	 public function update($collection = "", $data = array()) {
	 	if(empty($collection))
	 		show_error("No Mongo collection selected to update", 500);
	 	if(count($data) == 0 || !is_array($data))
	 		show_error("Nothing to update in Mongo collection or update is not an array", 500);
	 	
	 	try {
	 		$this->db->{$collection}->update($this->wheres, array('$set' => $data), array('safe' => TRUE, 'multiple' => FALSE));
	 		return(TRUE);
	 	} catch(MongoCursorException $e) {
	 		show_error("Update of data into MongoDB failed: {$e->getMessage()}", 500);
	 	}
	 	
	 }
	 
	/**
	 *	--------------------------------------------------------------------------------
	 *	UPDATE_ALL
	 *	--------------------------------------------------------------------------------
	 *
	 *	Insert a new document into the passed collection
	 *
	 *	@usage = $this->mongo_db->update_all('foo', $data = array());
	 */
	
	 public function update_all($collection = "", $data = array()) {
	 	if(empty($collection))
	 		show_error("No Mongo collection selected to update", 500);
	 	if(count($data) == 0 || !is_array($data))
	 		show_error("Nothing to update in Mongo collection or update is not an array", 500);
	 	try {
	 		$this->db->{$collection}->update($this->wheres, array('$set' => $data), array('safe' => TRUE, 'multiple' => TRUE));
	 		return(TRUE);
	 	} catch(MongoCursorException $e) {
	 		show_error("Update of data into MongoDB failed: {$e->getMessage()}", 500);
	 	}
	 }
	 
	 /**
	 *	--------------------------------------------------------------------------------
	 *	DELETE
	 *	--------------------------------------------------------------------------------
	 *
	 *	delete document from the passed collection based upon certain criteria
	 *
	 *	@usage = $this->mongo_db->delete('foo', $data = array());
	 */
	
	 public function delete($collection = "") {
	 	if(empty($collection))
	 		show_error("No Mongo collection selected to delete from", 500);
	 	
	 	try {
	 		$this->db->{$collection}->remove($this->wheres, array('safe' => TRUE, 'justOne' => TRUE));
	 		return(TRUE);
	 	} catch(MongoCursorException $e) {
	 		show_error("Delete of data into MongoDB failed: {$e->getMessage()}", 500);
	 	}
	 	
	 }
	 
	/**
	 *	--------------------------------------------------------------------------------
	 *	DELETE_ALL
	 *	--------------------------------------------------------------------------------
	 *
	 *	Delete all documents from the passed collection based upon certain criteria
	 *
	 *	@usage = $this->mongo_db->delete_all('foo', $data = array());
	 */
	
	  public function delete_all($collection = "") {
	 	if(empty($collection))
	 		show_error("No Mongo collection selected to delete from", 500);
	 	
	 	try {
	 		$this->db->{$collection}->remove($this->wheres, array('safe' => TRUE, 'justOne' => FALSE));
	 		return(TRUE);
	 	} catch(MongoCursorException $e) {
	 		show_error("Delete of data into MongoDB failed: {$e->getMessage()}", 500);
	 	}
	 	
	 }
	
	/**
	 *	--------------------------------------------------------------------------------
	 *	ADD_INDEX
	 *	--------------------------------------------------------------------------------
	 *
	 *	Ensure an index of the keys in a collection with optional parameters. To set values to descending order,
	 *	you must pass values of either -1, FALSE, 'desc', or 'DESC', else they will be
	 *	set to 1 (ASC).
	 *
	 *	@usage = $this->mongo_db->add_index($collection, array('first_name' => 'ASC', 'last_name' => -1), array('unique' => TRUE));
	 */
	
	public function add_index($collection = "", $keys = array(), $options = array()) {
		if(empty($collection))
	 		show_error("No Mongo collection specified to add index to", 500);
	 	if(empty($keys) || !is_array($keys))
	 		show_error("Index could not be created to MongoDB Collection because no keys were specified", 500);

	 	foreach($keys as $col => $val):
	 		if($val == -1 || $val === FALSE || strtolower($val) == 'desc'):
	 			$keys[$col] = -1; 
	 		else:
	 			$keys[$col] = 1;
	 		endif;
	 	endforeach;
	 	
	 	if($this->db->{$collection}->ensureIndex($keys, $options) == TRUE):
	 		$this->clear();
	 		return($this);
	 	else:
	 		show_error("An error occured when trying to add an index to MongoDB Collection", 500);
		endif;
	}
	
	
	
	/**
	 *	--------------------------------------------------------------------------------
	 *	REMOVE_INDEX
	 *	--------------------------------------------------------------------------------
	 *
	 *	Remove an index of the keys in a collection. To set values to descending order,
	 *	you must pass values of either -1, FALSE, 'desc', or 'DESC', else they will be
	 *	set to 1 (ASC).
	 *
	 *	@usage = $this->mongo_db->remove_index($collection, array('first_name' => 'ASC', 'last_name' => -1));
	 */
	
	public function remove_index($collection = "", $keys = array()) {
		if(empty($collection))
	 		show_error("No Mongo collection specified to remove index from", 500);
	 	if(empty($keys) || !is_array($keys))
	 		show_error("Index could not be removed from MongoDB Collection because no keys were specified", 500);
	 	if($this->db->{$collection}->deleteIndex($keys, $options) == TRUE):
	 		$this->clear();
	 		return($this);
	 	else:
	 		show_error("An error occured when trying to remove an index from MongoDB Collection", 500);
		endif;
	}
	
	/**
	 *	--------------------------------------------------------------------------------
	 *	REMOVE_ALL_INDEXES
	 *	--------------------------------------------------------------------------------
	 *
	 *	Remove all indexes from a collection.
	 *
	 *	@usage = $this->mongo_db->remove_all_index($collection);
	 */
	
	public function remove_all_indexes($collection = "") {
		if(empty($collection))
	 		show_error("No Mongo collection specified to remove all indexes from", 500);
	 	$this->db->{$collection}->deleteIndexes();
	 	$this->clear();
	 	return($this);
	}
	
	/**
	 *	--------------------------------------------------------------------------------
	 *	LIST_INDEXES
	 *	--------------------------------------------------------------------------------
	 *
	 *	Lists all indexes in a collection.
	 *
	 *	@usage = $this->mongo_db->list_indexes($collection);
	 */
	public function list_indexes($collection = "") {
		if(empty($collection))
	 		show_error("No Mongo collection specified to remove all indexes from", 500);
	 	return($this->db->{$collection}->getIndexInfo());
	}
	 

	/**
	 *	--------------------------------------------------------------------------------
	 *	CONNECT TO MONGODB
	 *	--------------------------------------------------------------------------------
	 *
	 *	Establish a connection to MongoDB using the connection string generated in
	 *	the connection_string() method.  If 'mongo_persist_key' was set to true in the
	 *	config file, establish a persistent connection.  We allow for only the 'persist'
	 *	option to be set because we want to establish a connection immediately.
	 */
	
	private function connect() {
		$options = array();
		if($this->persist === TRUE):
			$options['persist'] = isset($this->persist_key) && !empty($this->persist_key) ? $this->persist_key : 'ci_mongo_persist';
		endif;
		try {
			$this->connection = new Mongo($this->connection_string, $options);
			$this->db = $this->connection->{$this->dbname};
			return($this);	
		} catch(MongoConnectionException $e) {
			show_error("Unable to connect to MongoDB: {$e->getMessage()}", 500);
		}
	}
	
	/**
	 *	--------------------------------------------------------------------------------
	 *	BUILD CONNECTION STRING
	 *	--------------------------------------------------------------------------------
	 *
	 *	Build the connection string from the config file.
	 */
	
	private function connection_string() {
		$this->CI->config->load($this->config_file);
		
		$this->host = trim($this->CI->config->item('mongo_host'));
		$this->port = trim($this->CI->config->item('mongo_port'));
		$this->user = trim($this->CI->config->item('mongo_user'));
		$this->pass = trim($this->CI->config->item('mongo_pass'));
		$this->dbname = trim($this->CI->config->item('mongo_db'));
		$this->persist = trim($this->CI->config->item('mongo_persist'));
		$this->persist_key = trim($this->CI->config->item('mongo_persist_key'));
		
		$connection_string = "mongodb://";
		
		if(empty($this->host)):
			show_error("The Host must be set to connect to MongoDB", 500);
		endif;
		
		if(empty($this->dbname)):
			show_error("The Database must be set to connect to MongoDB", 500);
		endif;
		
		if(!empty($this->user) && !empty($this->pass)):
			$connection_string .= "{$this->user}:{$this->pass}@";
		endif;
		
		if(isset($this->port) && !empty($this->port)):
			$connection_string .= "{$this->host}:{$this->port}";
		else:
			$connection_string .= "{$this->host}";
		endif;
		
		$this->connection_string = trim($connection_string);
	}
	
	/**
	 *	--------------------------------------------------------------------------------
	 *	CLEAR
	 *	--------------------------------------------------------------------------------
	 *
	 *	Resets the class variables to default settings
	 */
	
	private function clear() {
		$this->selects = array();
		$this->wheres = array();
		$this->limit = NULL;
		$this->offset = NULL;
		$this->sorts = array();
	}

	/**
	 *	--------------------------------------------------------------------------------
	 *	WHERE INITIALIZER
	 *	--------------------------------------------------------------------------------
	 *
	 *	Prepares parameters for insertion in $wheres array().
	 */
	
	private function where_init($param) {
		if(!isset($this->wheres[$param]))
			$this->wheres[$param] = array();
	}
	
}

?>