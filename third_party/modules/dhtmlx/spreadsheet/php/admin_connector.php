<?php

require_once('mysql.php');
require_once('request.php');
require_once('config.php');
require_once('auth.php');

class adminConnector {

	public function __construct($res) {
		$this->wrapper = new mysql($res);
		$this->request = new Request();
	}

	public function render() {
		$this->checkUserRights();
		$action = $this->request->get('action');
		if ($this->request->get('edit')) $action = 'edit';
		switch ($action) {
			case 'remove':
				$sheet = $this->request->get('sheet');
				$this->removeSheet($sheet);
				break;
			case 'edit':
				$this->editSheet();
				break;
			default:
				$this->getSheetsList();
				break;
		}
	}

	protected function getSheetsList() {
		$res = $this->wrapper->query("SELECT * FROM sheet");
		$sheets_list = Array();
		$preview_btn_start = '<div class="preview_btn" onclick="previewSheet(';
		$preview_btn_end = ');"></div>';
		$remove_btn_start = '<div class="remove_btn" onclick="removeSheet(';
		$remove_btn_end = ');"></div>';
		while ($data = $this->wrapper->next($res)) {
			$id = $data['sheetid'];
			$item = "\n\t{ id: '{$id}', data: [ '{$id}', ";
			$item .= "'{$data['rows']}', '{$data['cols']}', '{$data['key']}', ";
			$item .= "'{$preview_btn_start}{$id}{$preview_btn_end}', '{$remove_btn_start}{$id}{$remove_btn_end}'] }";
			$sheets_list[] = $item;
		}
		$sheets_list = "{ rows: [".implode(',', $sheets_list)." ] }";
		echo $sheets_list;
	}

	protected function removeSheet($sheet) {
		$res = $this->wrapper->query("DELETE FROM sheet WHERE sheetid='{$sheet}' LIMIT 1");
		$res = $this->wrapper->query("DELETE FROM header WHERE sheetid='{$sheet}'");
		$res = $this->wrapper->query("DELETE FROM data WHERE sheetid='{$sheet}'");
	}

	protected function editSheet() {
		$fields = Array("sheetid", "rows", "cols", "key");
		$sheet = $this->request->get("gr_id");
		for ($i = 0; $i < 10000; $i++) {
			if ($this->request->get("c".$i) !== false) {
				$value = $this->request->get("c".$i);
				$col = $i;
				break;
			}
		}
		$field = $fields[$col];
		$res = $this->wrapper->query("UPDATE sheet SET `{$field}`='{$value}' WHERE sheetid='{$sheet}'");
		header("Content-type: text/xml");
		echo '<data><action sid="'.$sheet.'" type="updated" tid="'.$sheet.'" /></data>';
	}

	protected function checkUserRights() {
		if (!User::check_cookie()) {
			die("You should log in");
		}
	}

}

$res = mysql_connect($db_host, $db_user, $db_pass);
mysql_select_db($db_name, $res);
$conn = new adminConnector($res);
$conn->render();



?>