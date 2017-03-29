<?php

class dhxMigrate {

	private $wrapper = null;
	private $prefix = '';

	public function __construct($wrapper, $prefix) {
		$this->wrapper = $wrapper;
		$this->prefix = $prefix;
	}

	public function update() {
		$this->update_trigger_table();
		$this->styles();
	}

	// adds sheetid field into triggers table
	public function update_trigger_table() {
		$query = "ALTER TABLE {$this->prefix}triggers ADD sheetid VARCHAR(255) DEFAULT NULL";
		$this->wrapper->query($query);
	}

	// converts style format to new one
	public function styles() {
		$query = "SELECT sheetid, columnid, rowid, style FROM ".$this->prefix."data";
		$res = $this->wrapper->query($query);

		$number = 0;
		while ($data = $this->wrapper->get_next($res)) {
			$style = $data['style'];
			$style = explode(";", $style);
			for ($i = 0; $i < count($style); $i++) {
				$param = $style[$i];
				$param = explode(":", $param);
				if (isset($param[0]) && isset($param[1])) {
					$value = $param[1];
					if ($value == 'true') $value = '1';
					if ($value == 'false') $value = '0';
					$style[$i] = $value;
				}
			}
			if (count($style) == 5) $style[] = 'none;0';
			$style = implode(";", $style);
			$query = "UPDATE ".$this->prefix."data SET style='{$style}' WHERE ".
				"sheetid={$data['sheetid']} AND columnid={$data['columnid']} AND rowid={$data['rowid']}";
			$this->wrapper->query($query);
			$number++;
		}
	}

}

?>