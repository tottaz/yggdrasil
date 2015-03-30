<?php
/**
*    Sample banqpayService
*
*/

class banqpay {

    /**
     *Constructor function.
     * Contains the methodTable metadata to enable the designated methods to
     * be available via the amfphp Gateway.
     */
    function banqpay ()
    {
        include('banqpay.methodTable.php');
        
        $conn = mysql_connect('localhost', 'zetaman', '55Z78Pqr5')
            or trigger_error("Could not connect: " . mysql_error()); // don't use die (Fatal Error), return useful info to the client
        mysql_select_db('zetapay', $conn)
            or trigger_error("Could not connect: " . mysql_error());
    }
    
    mysql_connect('localhost', 'zetaman', '55Z78Pqr5') or die('Cannot connect to MySQL server');
    mysql_connect('localhost', 'root', '') or die('Cannot connect to MySQL server');

    /**
     * Order is the remote method that places an order
     * First argument is the name of the person who orders it
     * Second argument is an array of banqpays, like so: [{quantity:3, details:'Some really good banqpay with onions and anchovies'}]
     * @access remote
     * @param string The name to place the order ad
     * @param Array A list of banqpay orders
     * @returns int - The new order id.
     */
        
    function linkexist ($merchant_id, $link_id)
    {
        $sql = $this->_escape("SELECT * FROM $this->merchant_link WHERE merchant_id=%m AND url_id=%l", $merchant_id, $link_id);
        $this->_queryDataSource($sql); // execute the query
        return $check_link; // return the new order id
    }

    function activelink ($merchant_id, $link_id, $active)
    {
        $sql = $this->_escape("SELECT * FROM $this->merchant_link WHERE merchant_id=%m AND url_id=%l", $merchant_id, $link_id);
        $this->_queryDataSource($sql); // execute the query
        return $check_link; // return the new order id
    }

    function updatelink ($merchant_id, $link_id)
    {
        $sql = $this->_escape("UPDATE $this->merchant_link SET clicks=clicks+1 WHERE merchant_id=%d AND url_id=%l", $merchant_id, $link_id);
        $check_link = $this->_queryDataSource($sql);
        return $check_link;
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
       $sql = "SELECT o.order_id as orderid, o.order_status as status, o.order_name as name, p.banqpay_id as banqpayid, p.banqpay_details as details, p.banqpay_quantity as quantity FROM $this->ordertable o, $this->banqpaytable p WHERE o.order_id = p.order_id AND o.order_status=1 ORDER BY o.order_time";
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