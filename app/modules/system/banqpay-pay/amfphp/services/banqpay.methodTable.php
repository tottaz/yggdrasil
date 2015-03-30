<?php 
$this->methodTable = array(
	"linkexist" => array(
		"description" => "Check if Link Exist\n First argument is the merchant id\n Second argument is the link_id",
		"arguments" => array("merchant_id - merchant id", "link_id - link id"),
		"access" => "remote\n",
		"returns" => "int"
	),
	"activelink" => array(
		"description" => "Check if Link Exist\n First argument is the merchant id\n Second argument is the link_id\n Third Argument is active status",
		"arguments" => array("merchant_id - merchant id", "link_id - link id", "active - active"),
		"access" => "remote\n",
		"returns" => "int"
	),
	"updatelink" => array(
		"description" => "Check if Link Exist\n First argument is the merchant id\n Second argument is the link_id\n Third Argument is active status",
		"arguments" => array("merchant_id - merchant id", "link_id - link id", "active - active"),
		"access" => "remote\n",
		"returns" => "int"
	),
	"_queryDataSource" => array(
		"description" => "_queryDataSource is a private method used to actually perform the sql transaction on the data source",
		"arguments" => array("sql - string The sql string to execute"),
		"access" => "private"
	),
	"_escape" => array(
		"description" => "Escape a SQL string",
		"arguments" => array("sql"),
		"access" => "private"
	)
);
?>