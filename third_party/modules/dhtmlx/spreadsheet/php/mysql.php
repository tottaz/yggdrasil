<?php

class mysql {
	protected $connection = null;

	public function __construct($connection) {
		$this->connection = $connection;
	}
	public function query($query) {
		LogMaster::log($query);
		$res = mysql_query($query, $this->connection);
		if (mysql_errno() != 0)
			LogMaster::log($this->error());
		return $res;
	}

	public function next($res) {
		if ($res == false) return false;
		return mysql_fetch_assoc($res);
	}

	public function error() {
		return mysql_error($this->connection);
	}
}

?>