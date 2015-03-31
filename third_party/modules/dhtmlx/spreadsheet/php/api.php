<?php

require_once('db_common.php');
require_once('math.php');

class SpreadSheet {

	protected $connection;
	protected $wrapper;
	protected $sheetid = "";
	protected $prefix;
	public static $processed = Array();

	/** contructor
	 *	@param connection
	 *		mysql connection
	 *	@param sheetid
	 *		id of sheet
	 */
	public function __construct($connection, $sheetid, $prefix, $db_type = "MySQL") {
		$this->connection = $connection;
		$driver_name = $db_type.'DBDataWrapper';
		if (class_exists($driver_name))
			$this->wrapper = new $driver_name($connection, null);
		else
			throw new Exception("Data driver is not found");
		$this->db_type = $db_type;
		$this->sheetid = $sheetid;
		$this->prefix = $prefix;
	}

	/** sets text by coord
	 *	@param coord
	 *		cell coordinate (string or array)
	 *	@param text
	 *		cell text
	 *	@return
	 *		true if successful or false otherwise
	 */
	public function setValue($coord, $text) {
		$cell = $this->getCell($coord);
		return $cell->setValue($text);
	}

	/** get value by coord
	 *	@param coord
	 *		cell coord
	 *	@return
	 *		text if cell exists or false
	 */
	public function getValue($coord) {
		$cell = $this->getCell($coord);
		return $cell->getValue();
	}

	/** get calculated value by coord
	 *	@param coord
	 *		cell coord
	 *	@return
	 *		text if cell exists or false
	 */
	public function getCalculatedValue($coord) {
		$cell = $this->getCell($coord);
		return $cell->getCalculatedValue();
	}

	/** sets style by coord
	 *	@param coord
	 *		cell coordinate (string or array)
	 *	@param style
	 *		cell associative array or serialized string
	 *	@return
	 *		true if successful or false otherwise
	 */
	public function setStyle($coord, $style) {
		$cell = $this->getCell($coord);
		return $cell->setStyle($style);
	}

	/** get style by coord
	 *	@param coord
	 *		cell coord
	 *	@return
	 *		style as associative array if cell exists or false
	 */
	public function getStyle($coord) {
		$cell = $this->getCell($coord);
		return $cell->getStyle();
	}

	/** get cell object by coordinate
	 *	@param coord
	 *		cell coord
	 *	@return
	 *		cell object
	 */
	public function getCell($coord) {
		$cell = new SpreadSheetCell($this->connection, $this->sheetid, $coord, $this->prefix, $this->db_type);
		return $cell;
	}

	/** check if it's correct coordinate
	 *	@param coord
	 *		cell coord
	 *	@return
	 *		cell object or false
	 */
	public function isCell($coord) {
		$cell = new SpreadSheetCell($this->connection, $this->sheetid, $coord, $this->prefix, $this->db_type);
		if ($cell->isIncorrect())
			return false;
		return $cell;
	}

	/** set id of sheet
	 *	@param sheetid
	 *		id of sheet
	 */
	public function setSheetId($sheetid) {
		$this->sheetid = $sheetid;
	}

	/** get all sheet cells
	 *	@return
	 *		array of cell objects
	 */
	public function getCells() {
		$cells = Array();
		$query = "SELECT `rowid`, `columnid` FROM {$this->prefix}data WHERE `sheetid`='".$this->e($this->sheetid)."'";
		$res = $this->wrapper->query($query);
		while ($coord = $this->wrapper->get_next($res)) {
			$cells[] = new SpreadSheetCell($this->connection, $this->sheetid, $coord, $this->prefix, $this->db_type);
		}
		return $cells;
	}
	
	protected function e($str) {
		return $this->wrapper->escape($str);
	}

}

class SpreadSheetCell {

	protected $sheetid;
	protected $col;
	protected $colLetter;
	protected $row;
	protected $wrapper;
	protected $incorrect = false;
	protected $prefix;
	protected $value = "";
	protected $parsed = "";
	protected $calculated = "";
	protected $style = array();
	protected $connection;
	protected $db_type;
	protected $where;
	protected $stylenames = Array("bold", "italic", "color", "bgcolor", "align", "validator", "lock");
	protected $defaultstyle = "0;0;000000;ffffff;left;none;0";

	/** constructor
	 *	@param connection
	 *		mysql connection
	 *	@param sheetid
	 *		id of sheet
	 *	@param coord
	 *		cell coordinate
	 */
	public function __construct($connection, $sheetid, $coord, $prefix, $db_type = 'MySQL') {
		$driver_name = $db_type.'DBDataWrapper';
		if (class_exists($driver_name))
			$this->wrapper = new $driver_name($connection, null);
		else
			throw new Exception("Data driver is not found");
		$this->sheetid = $sheetid;
		$this->prefix = $prefix;
		$coords = $this->parse_coord($coord);
		if ($coords === false) {
			$this->incorrect = true;
			return false;
		}
		$this->col = $coords['col'];
		$this->colLetter = $coords['colLetter'];
		$this->row = $coords['row'];
		$this->connection = $connection;
		$this->db_type = $db_type;
		$this->where = "sheetid='".$this->e($this->sheetid)."' AND columnid='".$this->e($this->col)."' AND rowid='".$this->e($this->row)."'";
		$this->style = $this->parseStyle($this->defaultstyle);
		$this->load();
	}

	/** parse cell coordinate
	 *	@param coord
	 *		cell coordinate as string or array
	 *	@return
	 *		array ('col' => $col, 'row' => $row, 'colLetter' => colLetter)
	 */
	public static function parse_coord($coord) {

		if (is_array($coord)) {
			if (isset($coord[0])) $row = $coord[0];
			if (isset($coord[1])) $col = $coord[1];
			if (isset($coord['r'])) $row = $coord['r'];
			if (isset($coord['row'])) $row = $coord['row'];
			if (isset($coord['rowid'])) $row = $coord['rowid'];
			if (isset($coord['c'])) $col = $coord['c'];
			if (isset($coord['col'])) $col = $coord['col'];
			if (isset($coord['column'])) $col = $coord['column'];
			if (isset($coord['columnid'])) $col = $coord['columnid'];

			if (isset($coord['cLetter'])) $colLetter = $coord['cLetter'];
			else if (isset($coord['colLetter'])) $colLetter = $coord['colLetter'];
			else if (isset($coord['columnLetter'])) $colLetter = $coord['columnLetter'];

			if (!isset($col) && !isset($colLetter))
				return false;
			if (!isset($col))
				$col = SpreadSheetCell::getColIndex($colLetter);
			if (!isset($colLetter))
				$colLetter = SpreadSheetCell::getColName($col);

			else SpreadSheetCell::getColName($col);
			return Array('col' => $col, 'row' => $row, 'colLetter' => $colLetter);
		}

		$coords = "";
		preg_match("/^([a-z]+)([0-9]+)$/i", $coord, $coords);
		if (count($coords) != 3)
			return false;
		$colLetter = $coords[1];
		$row = $coords[2];
		$col = SpreadSheetCell::getColIndex($colLetter);
		return Array('col' => $col, 'row' => $row, 'colLetter' => $colLetter);
	}

	/** gets column index by name
	 *	@param col
	 *		column name like A, B, C,...
	 *	@return
	 *		column index
	 */
	public static function getColIndex($col) {
		$value = 0;
		for ($i = 0; $i < strlen($col); $i++) {
			$ch = strtolower($col[$i]);
			$ord = ord($ch) - 96;
			if ($ord < 0 || $ord > 26) continue;
			$value += $ord*pow(26, strlen($col) - $i - 1);
		}
		return $value;
	}

	private function load() {
		$query = "SELECT `data`, `parsed`, `calc`, `style` FROM {$this->prefix}data WHERE {$this->where}";
		$result = $this->wrapper->query($query);
		$result = $this->wrapper->get_next($result);
		$this->value = $result['data'];
		$this->parsed = $result['parsed'];
		$this->calc = $result['calc'];
		if ($result['style'])
			$this->style = $this->parseStyle($result['style']);
	}

	/** check if cell exists
	 *	@param dont_create
	 *		create ot don't cell if it doesn't exist
	 *	@return
	 *		true if cell exists false otherwise (even if cell was created return false)
	 */
	public function exists($dont_create = false) {
		$query = "SELECT `data` FROM {$this->prefix}data WHERE {$this->where}";
		$result = $this->wrapper->query($query);
		if ($this->wrapper->get_next($result))
			return true;
		else {
			if (!$dont_create) {
				$query = "INSERT INTO `{$this->prefix}data` (`sheetid`, `rowid`, `columnid`,`data`,`calc`,`parsed`,`style`) VALUES ('".$this->e($this->sheetid)."', '".$this->e($this->row)."', '".$this->e($this->col)."','','','','{$this->defaultstyle}')";
				$this->wrapper->query($query);
			}
			// echo create new cell
			return false;
		}
	}

	/** gets column name by index
	 *	@param index
	 *		column index
	 *	@return
	 *		column name - A, B, C,...
	 */
	public static function getColName($index) {
		$letters = Array("A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z");
		$name = '';
		$ready = false;
		$ch = "";
		$length = count($letters);
		while (!$ready) {
			$rest = floor($index/$length);
			$c = $index - $rest*$length;
			$index = floor($index/$length);
			$c--;
			if ($c == -1) {
				$c = $length - 1;
				$index--;
			}
			$ch = $c + $ch;
			$name = $letters[$c].$name;
			if ($index <= 0)
				$ready = true;
		}
		return $name;
	}

	/** gets cell text
	 *	@return
	 *		cell text or false if not exists
	 */
	public function getValue() {
		$query = "SELECT `data` FROM {$this->prefix}data WHERE {$this->where}";
		$result = $this->wrapper->query($query);
		if (!$result) return false;
		$cell = $this->wrapper->get_next($result);
		return $cell['data'];
	}

	/** sets cell text
	 *	@param text
	 *		cell text
	 *	@return
	 *		true or false
	 */
	public function setValue($text) {
		$this->value = $text;
		if ((strlen($text) > 1)&&($text[0] == '=')) {
			$expr = $text;
			$expr = $this->replaceAreas($expr);
			$this->parsed = $expr;
			$triggers = $this->getTriggers($expr);
		} else {
			$this->parsed = $this->value;
			$triggers = array();
		}
		$this->process_triggers($triggers);
		
		SpreadSheet::$processed = array();
		return $this->calculate();
	}

	/** removes old triggers and save new
	 *	@param triggers
	 *		list of cells coordinate
	 */
	protected function process_triggers($triggers) {
		$coord = $this->colLetter.$this->row;
		// removes triggers of previous formulas
		$query = "DELETE FROM {$this->prefix}triggers WHERE `source`='".$this->e($coord)."' AND `sheetid`='".$this->e($this->sheetid)."'";
		$this->wrapper->query($query);

		// adds new triggers
		for ($i = 0; $i < count($triggers); $i++)
			$triggers[$i] = "('".$this->e($this->sheetid)."', '".$this->e($triggers[$i])."', '".$this->e($coord)."')";
		$triggers = implode(", ", $triggers);
		if ($triggers) {
			$query = "INSERT INTO {$this->prefix}triggers (`sheetid`, `trigger`, `source`) VALUES {$triggers}";
			$this->wrapper->query($query);
		}
	}

	/** detects type of saving
	 */
	protected function get_status() {
		// TODO: check if style is empty
		if ($this->value == '' && $this->serializeStyle($this->style) == $this->defaultstyle)
			// delete cell from database if its value and style is empty
			$status = "deleted";
		else {
			// if the same cell already save in DB we have to update it, have to insert it otherwise
			$res = $this->wrapper->query("SELECT * FROM {$this->prefix}data WHERE {$this->where}");
			$result = $this->wrapper->get_next($res);
			$status = ($result != false) ? "updated" : "inserted";
		}
		return $status;
	}

	/** saves value, parsed and calc into database
	 */
	protected function save_value() {
		$status = $this->get_status();

		// action running
		switch ($status) {
			case 'inserted':
				$res = $this->wrapper->query("INSERT INTO {$this->prefix}data (sheetid, columnid, rowid, data, parsed, calc) VALUES ('".$this->e($this->sheetid)."', ".$this->e($this->col).", ".$this->e($this->row).", '".$this->e($this->value)."', '".$this->e($this->parsed)."', '".$this->e($this->calc)."')");
				break;
			case 'updated':
				$res = $this->wrapper->query("UPDATE {$this->prefix}data SET data='".$this->e($this->value)."', parsed='".$this->e($this->parsed)."', calc='".$this->e($this->calc)."' WHERE {$this->where}");
				break;
			case 'deleted':
				$res = $this->wrapper->query("DELETE FROM {$this->prefix}data WHERE {$this->where}");
				break;
		}
		return $res;
	}
	
	/** recalculates depended cells
	 */
	protected function run_triggers() {
		$coord = $this->colLetter.$this->row;
		$query = "SELECT * FROM {$this->prefix}triggers WHERE `trigger`='".$this->e($coord)."' AND `sheetid`='".$this->e($this->sheetid)."'";
		$result = $this->wrapper->query($query);
		$triggers = Array();
		while ($trigger = $this->wrapper->get_next($result))
			$triggers[] = $trigger['source'];

		$response = array();
		for ($i = 0; $i < count($triggers); $i++) {
			$cell = new SpreadSheetCell($this->connection, $this->sheetid, $triggers[$i], $this->prefix, $this->db_type);
			$response = array_merge($response, $cell->calculate());
		}
		return $response;
	}
	
	/** forces recalculation of cell value
	 *	@return
	 *		array of recalculated cells
	 */
	public function calculate() {
		$response = Array();
		$coord = $this->colLetter.$this->row;

		if (isset(SpreadSheet::$processed[$coord]))
			$this->calc = '#CIRC_REFERENCE';
		else
			$this->calculateValue();

		$res = $this->save_value();
		$response[$coord] = Array(
			'row' => $this->row,
			'col' => $this->col,
			'value' => $this->value,
			'calc' => $this->calc,
			'status' => $res ? true : false
		);

		if ($this->calc === '#CIRC_REFERENCE') return $response;
		SpreadSheet::$processed[$coord] = true;
		$response = array_merge($response, $this->run_triggers());
		return $response;
	}

	public function replaceAreas($expr) {
		$expr = preg_replace_callback("/\\$?([A-Z]+)\\$?(\d+):\\$?([A-Z]+)\\$?(\d+)/i", Array($this, "replaceAreasCallback"), $expr);
		return $expr;
	}

	public function replaceAreasCallback($matches) {
		$c1_col = SpreadSheetCell::getColIndex($matches[1]);
		$c1_row = (int) $matches[2];
		$c2_col = SpreadSheetCell::getColIndex($matches[3]);
		$c2_row = (int) $matches[4];

		if ($c1_col > $c2_col)
			list($c2_col, $c1_col) = array($c1_col, $c2_col);

		if ($c1_row > $c2_row)
			list($c2_row, $c1_row) = array($c1_row, $c2_row);


		$diap = Array();
		for ($i = $c1_row; $i <= $c2_row; $i ++) {
			for ($j = $c1_col; $j <= $c2_col; $j++) {
				$diap[] = SpreadSheetCell::getColName($j).$i;
			}
		}
		return implode(";", $diap);
	}

	/** gets triggers from expression
	 *	@param expr
	 *		expression string
	 *	@return
	 *		array of triggers
	 */
	public function getTriggers($expr) {
		$matches = "";
		$expr = preg_match_all("/([A-Z]+\d+)[^\(]?/i", $expr, $matches);
		$triggers = Array();
		for ($i = 0; $i < count($matches[1]); $i++)
			$triggers[] = $matches[1][$i];
		return $triggers;
	}

	protected function calculateValue() {
		if ((strlen($this->parsed) > 1)&&($this->parsed[0] == '=')) {
			$expr = substr($this->parsed, 1);

			$subcell = new SpreadSheetCell($this->connection, $this->sheetid, $expr, $this->prefix, $this->db_type);
			if ($subcell->isIncorrect() === false) {
				$expr = $subcell->getCalculatedValue();
			} else {
				$expr = $this->replaceCells($expr);
				$math = new Math();
				$expr = $math->calculate($expr);
			}
			$this->calc = $expr;
		} else {
			$this->calc = $this->parsed;
		}
	}

	public function replaceCells($expr) {
		$expr = preg_replace_callback("/(\\$?[A-Z]+\\$?\d+)([^\(]?)/i", Array($this, "replaceCellsCallback"), $expr);
		return $expr;
	}

	public function replaceCellsCallback($matches) {
		// LOG10 is a function, not a cell!
		if ($matches[0] == 'LOG10') return 'LOG10';
		$coord = str_replace(':', '', $matches[1]);
		$coord = str_replace('$', '', $matches[1]);
		$cell = new SpreadSheetCell($this->connection, $this->sheetid, $coord, $this->prefix, $this->db_type);
		$value = $cell->getCalculatedValue();
		if ($value === null) $value = '0';
		if ($value === '#CIRC_REFERENCE') $value = '0';
		return $value.$matches[2];
	}


	/** gets calculated cell value (formula result)
	 *	@return
	 *		cell text or false if not exists
	 */
	public function getCalculatedValue() {
		$query = "SELECT `calc` FROM {$this->prefix}data WHERE {$this->where}";
		$result = $this->wrapper->query($query);
		if (!$result) return false;
		$cell = $this->wrapper->get_next($result);
		if ($cell['calc'] === '')
			return '0';
		return $cell['calc'];
	}

	/** gets parsed cell formula
	 *	@return
	 *		cell text or false if not exists
	 */
	public function getParsedValue() {
		$query = "SELECT `parsed` FROM {$this->prefix}data WHERE {$this->where}";
		$result = $this->wrapper->query($query);
		if (!$result) return false;
		$cell = $this->wrapper->get_next($result);
		return $cell['parsed'];
	}


	/** gets cell style
	 *	@return
	 *		cell style as array
	 */
	public function getStyle() {
		$query = "SELECT `style` FROM {$this->prefix}data WHERE {$this->where}";
		$result = $this->wrapper->query($query);
		if (!$result) return false;
		$cell = $this->wrapper->get_next($result);
		return $this->parseStyle($cell['style']);
	}


	/** sets cell style
	 *	@param style
	 *		associative array or serialized string
	 *	@return
	 *		result of operation - true or false
	 */
	public function setStyle($style) {
		$this->exists();
		if (is_array($style))
			$style = $this->serializeStyle($style);

		$query = "UPDATE {$this->prefix}data SET `style`='".$this->e($style)."' WHERE {$this->where}";
		// sets new style to cell
		$this->style = $this->parseStyle($style);
		$result = $this->wrapper->query($query);
		return $result;
	}


	/** unserialize style string
	 *	@param style
	 *		style as string
	 *	@return
	 *		associative array of style
	 */
	public function parseStyle($style) {
		$style = explode(";", $style);
		$rules = Array();
		for ($i = 0; $i < count($style); $i++) {
			$rules[$this->stylenames[$i]] = $style[$i];
		}
		return $rules;
	}


	/** serialize style array
	 *	@param style
	 *		style as array
	 *	@return
	 *		serialized style
	 */
	public function serializeStyle($style) {
		$rules = Array();
		for ($i = 0; $i < count($this->stylenames); $i++) {
			$rules[] = isset($style[$this->stylenames[$i]]) ? $style[$this->stylenames[$i]] : "";
		}
		return implode(';', $rules);
	}


	/** get cell coordinate
	 *	@param mode
	 *		output type:
	 *			array,
	 *			array_lit (letter instead column index)
	 *			string,
	 *			array_assoc_lit,
	 *			array_assoc
	 *	@return
	 *		cell coordinate
	 */
	public function getCoords($mode = 'array_assoc') {
		switch ($mode) {
			case 'array':
			case 'arr':
				return Array($this->row, $this->col);
				break;
			case 'array_lit':
			case 'arr_lit':
				return Array($this->row, $this->colLetter);
				break;
			case 'string':
			case 'str':
				return $this->colLetter.$this->row;
				break;
			case 'array_assoc_lit':
			case 'arr_assoc_lit':
				return Array('row' => $this->row, 'column' => $this->colLetter);
				break;
			case 'array assoc':
			case 'arr_assoc':
			default:
				return Array('row' => $this->row, 'column' => $this->col);
				break;
		}
	}

	public function isIncorrect() {
		return $this->incorrect;
	}

	protected function e($str) {
		return $this->wrapper->escape($str);
	}


	//Array("bold", "italic", "color", "bgcolor", "align", "validator", "lock")
	/** is cell's style bold or not
	 *	@return
	 *		(boolean) bold or not
	 */
	public function isBold() {
		return $this->style["bold"] == 1 ? true : false;
	}
	
	/** sets cell bold style
	 *	@param value
	 *		true - bold, false - normal
	 */
	public function setBold($value) {
		$this->style["bold"] = $value ? 1 : 0;
		$this->setStyle($this->style);
	}

	/** is cell's style italic or not
	 *	@return
	 *		(boolean) italic or not
	 */
	public function isItalic() {
		return $this->style["italic"] == 1 ? true : false;
	}
	
	/** sets cell italic style
	 *	@param value
	 *		true - italic, false - normal
	 */
	public function setItalic($value) {
		$this->style["italic"] = $value ? 1 : 0;
		$this->setStyle($this->style);
	}
	
	/** gets font color
	 *	@return
	 *		color in hex RGB format
	 */
	public function getColor() {
		return $this->style["color"];
	}

	/** sets font color
	 *	@param value
	 *		color in hex format - ffffff or #ffffff
	 *	@return
	 *		false if color is incorrect and ignored or true otherwise
	 */
	public function setColor($value) {
		if (preg_match("/^#[a-f0-9]{6}$/i", $value))
			$value = substr($value, 1);
		if (!preg_match("/^[a-f0-9]{6}$/i", $value)) return false;
		$this->style["color"] = $value;
		$this->setStyle($this->style);
		return true;
	}

	/** gets background color
	 *	@return
	 *		color in hex RGB format
	 */
	public function getBgColor() {
		return $this->style["bgcolor"];
	}

	/** sets background color
	 *	@param value
	 *		color in hex format - ffffff or #ffffff
	 *	@return
	 *		false if color is incorrect and ignored or true otherwise
	 */
	public function setBgColor($value) {
		if (preg_match("/^#[a-f0-9]{6}$/i", $value))
			$value = substr($value, 1);
		if (!preg_match("/^[a-f0-9]{6}$/i", $value)) return false;
		$this->style["bgcolor"] = $value;
		$this->setStyle($this->style);
		return true;
	}

	/** gets cell's align
	 *	@return
	 *		left, right, center, justify
	 */
	public function getAlign() {
		return $this->style["align"];
	}
	
	/** sets cell's align
	 *	@param value
	 *		left, right, center, justify
	 */
	public function setAlign($value) {
		$correct = array('left', 'right', 'center', 'justify');
		if (!in_array($value, $correct)) return false;
		$this->style["align"] = $value;
		$this->setStyle($this->style);
		return true;
	}
	
	/** gets cell's validator
	 *	@return
	 *		validator name - none, number, email, positive, not_empty
	 */
	public function getValidator() {
		return $this->style["validator"];
	}
	
	/** sets cell's validator
	 *	@param value
	 *		validator name - none, number, email, positive, not_empty
	 *	@return
	 *		true if value is correct or false otherwise
	 */
	public function setValidator($value) {
		$correct = array('none', 'number', 'email', 'positive', 'not_empty');
		if (!in_array($value, $correct)) return false;
		$this->style["validator"] = $value;
		$this->setStyle($this->style);
		return true;
	}
	
	/** is cell locked or not
	 *	@return
	 *		true or false
	 */
	public function isLocked() {
		return $this->style["lock"] == 1 ? true : false;
	}

	/** sets cell's lock
	 *	@param value
	 *		locked or not
	 */
	public function setLocked($value) {
		$this->style["lock"] = $value ? 1 : 0;
		$this->setStyle($this->style);
	}

	/** locks cell
	 */
	public function lock() {
		$this->setLocked(true);
	}

	/** unlocks cell
	 */
	public function unlock() {
		$this->setLocked(false);
	}
}


?>