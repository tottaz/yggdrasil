<?php 
$this->methodTable = array(
	"returnString" => array(
		"description" => "Returns a string",
		"arguments" => array("in"),
		"access" => "remote"
	),
	"returnNumber" => array(
		"description" => "Returns 10 times a number",
		"arguments" => array("in"),
		"access" => "remote"
	),
	"returnArray" => array(
		"description" => "Returns the 'foo' key in an array",
		"arguments" => array("in - An object containing the key \'foo\'"),
		"access" => "remote"
	)
);
?>