<?php 
$this->methodTable = array(
	"order" => array(
		"description" => "Order is the remote method that places an order\n First argument is the name of the person who orders it\n Second argument is an array of pizzas, like so: [{quantity:3, details:'Some really good pizza with onions and anchovies'}]",
		"arguments" => array("name - string The name to place the order ad", "orders - Array A list of pizza orders"),
		"access" => "remote\n",
		"returns" => "int"
	),
	"cancelOrder" => array(
		"description" => "cancelOrder takes an order id as it's input and then sets the order_status field to 0.",
		"arguments" => array("orderId - order id"),
		"access" => "remote\n",
		"returns" => "boolean"
	),
	"getOrderList" => array(
		"description" => "getOrderList returns a recordset of all of the orders that have an order_status of 1",
		"arguments" => array(),
		"access" => "remote\n",
		"returns" => "RecordSet"
	),
	"listToppings" => array(
		"description" => "listToppings returns the available toppings as an array",
		"arguments" => array(),
		"access" => "remote"
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