<?php
//
// TEST: test the date functions
//

$today = date("Y-m-d");
print "today = $today<p>";

$tomorrow  = date("Y-m-d", mktime(0, 0, 0, date("m")  , date("d")+1, date("Y")));
print "tomorrow = $tomorrow<p>";

$thenextday = date("Y-m-d", mktime(0, 0, 0, date("m")  , date("d")+2, date("Y")));
print "the next day = $thenextday<p>";

$thedayafterthat = date("Y-m-d", mktime(0, 0, 0, date("m")  , date("d")+3, date("Y")));
print "the day after that = $thedayafterthat<p>";

?>