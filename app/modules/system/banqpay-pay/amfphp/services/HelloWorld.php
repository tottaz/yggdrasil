<?php
class HelloWorld
{
    function HelloWorld()
    {
        $this->methodTable = array
        (
            "say" => array
            (
                "access" => "remote",
                "description" => "Pings back a message"
            )
        );
    }
 
    function say($sMessage)
    {
        return 'You said: ' . $sMessage;
    }
}
?>