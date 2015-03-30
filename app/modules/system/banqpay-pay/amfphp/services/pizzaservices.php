<?php
/**
*    Sample pizzaService
*
*/
include('dbconfig.php');
class pizzaService {

    var $ordertable = "amfphp_orders"; // the orders table
    var $pizzatable = "amfphp_pizzas"; // the pizzas table

    /**
     *Constructor function.
     * Contains the methodTable metadata to enable the designated methods to
     * be available via the amfphp Gateway.
     */
    function pizzaService ()
    {
        include('pizzaService.methodTable.php');
        
        $conn = mysql_connect(DB_HOST, DB_USER, DB_PASS)
            or trigger_error("Could not connect: " . mysql_error()); // don't use die (Fatal Error), return useful info to the client
        mysql_select_db(DB_NAME, $conn)
            or trigger_error("Could not connect: " . mysql_error());
    }

    /**
     * Order is the remote method that places an order
     * First argument is the name of the person who orders it
     * Second argument is an array of pizzas, like so: [{quantity:3, details:'Some really good pizza with onions and anchovies'}]
     * @access remote
     * @param string The name to place the order ad
     * @param Array A list of pizza orders
     * @returns int - The new order id.
     */
    function order ($name, $orders)
    {
        $t = time(); // grab the time stamp
        $sql = $this->_escape("INSERT INTO $this->ordertable (order_status, order_time, order_name) VALUES (1, $t, '%s')", $name); // generate the SQL statement
        $this->_queryDataSource($sql); // execute the query
        $orderid = mysql_insert_id(); // grab the new id from the auto increment key
        
        foreach ($orders as $key => $value) { // loop over each order
            $sql = $this->_escape("INSERT INTO $this->pizzatable (order_id, pizza_details, pizza_quantity) VALUES ($orderid, '%s', %d)", $value['details'], $value['quantity']); // generate the SQL
            $result = $this->_queryDataSource($sql); // execute the transaction
        }
        return $orderid; // return the new order id
    }
    
    /**
     *    cancelOrder takes an order id as it's input and then sets the order_status field to 0.
     *
     * @access remote
     * @param int The order id
     * @returns boolean - Returns true if the update was successful
     */
    function cancelOrder ($orderId)
    {
        $sql = $this->_escape("UPDATE $this->ordertable SET order_status=0 WHERE order_id=%d", $orderId);
        $result = $this->_queryDataSource($sql);
        return true;
    }
    
    /**
     * getOrderList returns a recordset of all of the orders that have an order_status of 1
     * @access remote
     * @returns RecordSet - The recordset containing the order information
     */
    function getOrderList ()
    {
        $sql = "SELECT o.order_id as orderid, o.order_status as status, o.order_name as name, p.pizza_id as pizzaid, p.pizza_details as details, p.pizza_quantity as quantity FROM $this->ordertable o, $this->pizzatable p WHERE o.order_id = p.order_id AND o.order_status=1 ORDER BY o.order_time";
        return $this->_queryDataSource($sql);
    }
    
    /**
     * listToppings returns the available toppings as an array
     * @access remote
     */
    function listToppings ()
    {
        return array("cheese", "sausage", "pepperoni", "mushrooms", "tomatoes", "onions", "peppers", "garlic");
    }
    
    /**
     *    _queryDataSource is a private method used to actually perform the sql transaction on the data source
     *
     * @param string The sql string to execute
     */
    function _queryDataSource ($sql)
    {
        $result = mysql_query($sql)
            or trigger_error("Error executing query: " . mysql_error());
        return $result; // return the mysql result resource
    }
    
    /**
     * Escape a SQL string
     */
    function _escape($sql)
    {
        $args = func_get_args();
        foreach($args as $key => $val)
        {
            $args[$key] = mysql_real_escape_string($val);
        }
        
        $args[0] = $sql;
        return call_user_func_array('sprintf', $args);
    }
}
?>