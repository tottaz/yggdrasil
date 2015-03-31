<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * Greengarden
 *
 * @package		Greengarden
 * @author		Greengarden Dev Team
 * @since		Version 1.0
 */

// ------------------------------------------------------------------------

/**
 * Installer Library
 *
 * @subpackage	Libraries
 * @category	Installer
 */
class Installer {

	/**
	 * @var	object	The global CI object
	 */
	private $_ci;

	/**
	 * Loads in the CI super object
	 *
	 * @access	public
	 * @return	void
	 */
	public function __construct()
	{
		$this->_ci =& get_instance();
	}

	public function install($data)
	{
		$config['port']     = $this->_ci->session->userdata('port');
		$config['hostname'] = $this->_ci->session->userdata('hostname');
		$config['database'] = $this->_ci->session->userdata('database');
		$config['username'] = $this->_ci->session->userdata('username');
		$config['password'] = $this->_ci->session->userdata('password');
		$config['dbdriver'] = 'mysql';
		$config['dbprefix'] = $this->_ci->session->userdata('dbprefix');
		$config['db_debug'] = TRUE;
		$config['char_set'] = "utf8";
		$config['dbcollat'] = "utf8_general_ci";
		$config['autoinit'] = TRUE;

		$this->_ci->load->database($config);
		$this->_ci->load->dbforge();

		$schema = file_get_contents(APPPATH.'schema/yggdrasil.sql');

		if ( ! $this->_write_db_config($config))
		{
			return FALSE;
		}

		$replace = array();

		$data['dbprefix'] = $config['dbprefix'];
		$data['version'] = file_get_contents(APPPATH.'VERSION');
//		$data['rss_password'] = random_string('alnum', 12);
//		$data['timezone'] = @date_default_timezone_get();

		// Include migration config to know which migration to start from
		include './app/config/migration.php';

		$data['migration'] = $config['migration_version'];

		foreach ($data as $key => $val)
		{
			$schema = str_replace('{'.strtoupper($key).'}', mysqli_real_escape_string($this->_ci->db, $val), $schema);
		}

		$schema = explode('-- split --', $schema);

		foreach ($schema as $query)
		{
			if ( ! $this->_ci->db->query(rtrim(trim($query), "\n;")))
			{
				show_error('MySQL ERROR: '.mysql_error());
			}
		}

		return TRUE;
	}

	private function _write_db_config($config)
	{
		$replace = array(
			'{HOSTNAME}' 	=> $config['hostname'],
			'{USERNAME}' 	=> $config['username'],
			'{PASSWORD}' 	=> $config['password'],
			'{DATABASE}' 	=> $config['database'],
			'{PORT}'	=> $config['port'],
			'{DBPREFIX}'	=> $config['dbprefix'],
		);

                
		$template = <<<TEMP
<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*
| -------------------------------------------------------------------
| DATABASE CONNECTIVITY SETTINGS
| -------------------------------------------------------------------
| This file will contain the settings needed to access your database.
|
| For complete instructions please consult the 'Database Connection'
| page of the User Guide.
|
| -------------------------------------------------------------------
| EXPLANATION OF VARIABLES
| -------------------------------------------------------------------
|
|	['hostname'] The hostname of your database server.
|	['username'] The username used to connect to the database
|	['password'] The password used to connect to the database
|	['database'] The name of the database you want to connect to
|	['dbdriver'] The database type. ie: mysql.  Currently supported:
				 mysql, mysqli, postgre, odbc, mssql, sqlite, oci8
|	['dbprefix'] You can add an optional prefix, which will be added
|				 to the table name when using the  Active Record class
|	['pconnect'] TRUE/FALSE - Whether to use a persistent connection
|	['db_debug'] TRUE/FALSE - Whether database errors should be displayed.
|	['cache_on'] TRUE/FALSE - Enables/disables query caching
|	['cachedir'] The path to the folder where cache files should be stored
|	['char_set'] The character set used in communicating with the database
|	['dbcollat'] The character collation used in communicating with the database
|	['swap_pre'] A default table prefix that should be swapped with the dbprefix
|	['autoinit'] Whether or not to automatically initialize the database.
|	['stricton'] TRUE/FALSE - forces 'Strict Mode' connections
|							- good for ensuring strict SQL while developing
|
| The \$active_group variable lets you choose which connection group to
| make active.  By default there is only one group (the 'default' group).
|
| The \$active_record variables lets you determine whether or not to load
| the active record class
*/

\$active_group = 'default';
\$active_record = TRUE;

\$db['default']['hostname'] = '{HOSTNAME}';
\$db['default']['username'] = '{USERNAME}';
\$db['default']['password'] = '{PASSWORD}';
\$db['default']['database'] = '{DATABASE}';
\$db['default']['dbdriver'] = 'mysqli';
\$db['default']['dbprefix'] = '{DBPREFIX}';
\$db['default']['pconnect'] = FALSE;
\$db['default']['db_debug'] = TRUE;
\$db['default']['cache_on'] = FALSE;
\$db['default']['cachedir'] = '';
\$db['default']['char_set'] = 'utf8';
\$db['default']['dbcollat'] = 'utf8_general_ci';
\$db['default']['swap_pre'] = '';
\$db['default']['autoinit'] = TRUE;
\$db['default']['stricton'] = FALSE;
\$db['default']['port']	   = {PORT};

/* End of file database.php */
/* Location: ./application/config/database.php */
TEMP;
           
		$new_file  	= str_replace(array_keys($replace), $replace, $template);

		$handle 	= @fopen(FCPATH.'app/config/database.php','w+');

		if($handle !== FALSE)
		{
			return @fwrite($handle, $new_file);
		}

		return FALSE;
	}
}

/* End of file installer.php */