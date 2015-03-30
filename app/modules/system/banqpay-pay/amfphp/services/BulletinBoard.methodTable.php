<?
$this->methodTable = array(
	"doPost" => array(
		"description" => "doPost First arguments is an object containing columns 'name', 'email', 'theurl', 'message'",
		"arguments" => array("in - "),
		"access" => "remote"
	),
	"doRead" => array(
		"description" => "doRead First argument is an int, the offset, second argument is the limit, an int",
		"arguments" => array("start - ", "limit - "),
		"access" => "remote"
	),
	"_escape" => array(
		"description" => "Escape a SQL string",
		"arguments" => array("sql"),
		"access" => "private"
	)
);
?>