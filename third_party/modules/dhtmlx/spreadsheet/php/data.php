<?php

require("config.php");
require("grid_cell_connector.php");

$db_server = $db_port !== '' ? $db_host.":".$db_port : $db_host;

switch (strtolower($db_type)) {
	case 'mysqli':
		$res = new mysqli($db_host, $db_user, $db_pass, $db_name, $db_port);
		break;
	case 'mssql':
		$res = mssql_connect($db_server, $db_user, $db_pass);
		mssql_select_db($db_name, $res);
		break;
	case 'postgre':
		$res = pg_connect("host=".$db_host." port=".$db_port." dbname=".$db_name." user=".$db_user." password=".$db_pass);
		break;
	case 'oracle':
		$res = oci_connect($db_user, $db_pass, $db_name);
		break;
	case 'mysql':
	default:
		$res = mysql_connect($db_server, $db_user, $db_pass);
		mysql_select_db($db_name, $res);
		break;
}

$conn = new GridCellConnector($res, $db_prefix, $db_type);
//$conn->enable_log();
$conn->render();

?>