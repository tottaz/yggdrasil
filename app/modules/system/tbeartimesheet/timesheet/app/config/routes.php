<?php
$Route->connect('/', array('controller' => 'reports', 'action' => 'index'));
$Route->connect('/pages/*', array('controller' => 'pages', 'action' => 'display'));
?>