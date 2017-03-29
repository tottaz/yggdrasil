<?php

class Request {
	protected $settings = Array();
	public function __construct() {
		foreach ($_GET as $k => $v)
			$this->set($k, $this->encode($v));
		foreach ($_POST as $k => $v)
			$this->set($k, $this->encode($v));
	}

	public function set($name, $value) {
		$this->settings[$name] = $value;
	}

	public function get($name) {
		if (isset($this->settings[$name]))
			return $this->settings[$name];
		return false;
	}

	public function get_all() {
		return $this->settings;
	}

	public function encode($value) {
		if (is_array($value))
			foreach($value as $k => $v)
				$value[$k] = $this->encode($value[$k]);
		if (is_string($value))
			return rawurldecode($value);
		return $value;
	}
}

?>