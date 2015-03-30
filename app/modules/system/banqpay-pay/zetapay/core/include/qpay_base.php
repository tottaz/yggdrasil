<?php

class qpay_base {

    var $input  = array();
    var $cookie = array();
    var $magic_quotes = "";

    /*-------------------------------------------------------------------------*/
    // Constructor - Initialize class
    /*-------------------------------------------------------------------------*/
    function qpay_base() {

        // Get environment settings
        $this->magic_quotes = get_magic_quotes_gpc();
        // Automatically parse our incoming variables, this prevents us from
        //  having to call this method each time we include this class ;)
        $this->input = $this->parse_data();
        // And do the same for cookies
        $this->cookie = $this->parse_cookies();
        return $this;
    }

    /*-------------------------------------------------------------------------*/
    // Parse any and all GET and POST data 'safely'
    /*-------------------------------------------------------------------------*/
    function parse_data() {
        // Our variable we will be returning
        $output = array();
        // Do we have any GET data?
		if( is_array($_GET) ) {
            // Loop through each pair
			while( list($key, $value) = each($_GET) ) {
                // Make them 'safe'
				$output[$this->safe_key($key)] = $this->safe_value($value);
			}
		}

        // Do we have any POST data?  If so, overwrite GET data.
        if( is_array($_POST) ) {
            // Loop through each pair
            while( list($key, $value) = each($_POST) ) {
                // Make them 'safe', overriding any GET key/value pair
                $output[$this->safe_key($key)] = $this->safe_value($value);
            }
        }
        return $output;
    }

    /*-------------------------------------------------------------------------*/
    // Parse any present cookies
    /*-------------------------------------------------------------------------*/
    function parse_cookies() {
        // Our variable we will be returning
        $output = array();
        // Do we have any COOKIE data?
		if( is_array($_COOKIE) ) {
            // Loop through each pair
			while( list($key, $value) = each($_COOKIE) ) {
                // Make them 'safe'
				$output[$this->safe_key($key)] = $this->safe_value($value);
			}
		}
        return $output;
    }

    /*-------------------------------------------------------------------------*/
    // Ensure safe keys
    /*-------------------------------------------------------------------------*/
    function safe_key($key) {
        // Do we have anything to worry about?
    	if ($key == "") {
    		return "";
    	}
        // Yup, so let's kill bad stuff
        $key = preg_replace( "/\.\./"           , ""  , $key );
    	$key = preg_replace( "/\_\_(.+?)\_\_/"  , ""  , $key );
    	$key = preg_replace( "/^([\w\.\-\_]+)$/", "$1", $key );
    	return $key;
    }

    /*-------------------------------------------------------------------------*/
    // Ensure safe values
    /*-------------------------------------------------------------------------*/
    function safe_value($value) {
        // Do we have anything to worry about?
    	 
    	if ($value == "") {
    		return "";
    	}
        // Take care of encoded spaces
    	$value = str_replace( "&#032;", " ", $value );
        // Even sneaky ones ;)
        $value = str_replace( chr(0xCA), "", $value );
        
        // Here we convert unsafe, or convenient characters
        $value = str_replace( "&"            , "&amp;"         , $value );
        $value = str_replace( "<!--"         , "&#60;&#33;--"  , $value );
        $value = str_replace( "-->"          , "--&#62;"       , $value );
        $value = preg_replace( "/<script/i"  , "&#60;script"   , $value );
        $value = str_replace( ">"            , "&gt;"          , $value );
        $value = str_replace( "<"            , "&lt;"          , $value );
        $value = str_replace( "\""           , "&quot;"        , $value );
        $value = preg_replace( "/\\\$/"      , "&#036;"        , $value );
        $value = str_replace( "!"            , "&#33;"         , $value );

        // Helps make SQL safer
      
        $value = str_replace( "'"            , "&#39;"         , $value );
  
        // Handy replaces as needed?
        $value = preg_replace( "/\n/"        , "<br />"        , $value );
        $value = preg_replace( "/\r/"        , ""              , $value );

        // Depending on environment strip slashes
    	if ( $this->magic_quotes ) {
    		$value = stripslashes($value);
    	}
        return $value;
    }

} // end class
?>