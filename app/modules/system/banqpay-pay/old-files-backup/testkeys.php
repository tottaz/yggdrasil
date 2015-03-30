<?php

    $secret = 'c2VjcmV0MTEyNzI0NDQzOA==';   
    
    $hash = md5(implode(':', array($secret, $cpath, $qstr, $passexp)));
    $hash = md5($secret.$hash);
    $merchant_link .= md5($link_to_go);


?>