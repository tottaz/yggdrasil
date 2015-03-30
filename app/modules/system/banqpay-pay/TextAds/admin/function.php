<?php
include '../config.php';
include 'auth.php';

$edit = $_GET['edit'];
$which = $_GET['which'];
$return = $_GET['return'];
$id = $_GET['id'];

$t1 = $_GET['t1'];
$t2 = $_GET['t2'];
$t3 = $_GET['t3'];
$t4 = $_GET['t4'];
$t5 = $_GET['t5'];
$t6 = $_GET['t6'];
$t7 = $_GET['t7'];
$t8 = $_GET['t8'];
$t9 = $_GET['t9'];
$t10 = $_GET['t10'];
$t11 = $_GET['t11'];
$t12 = $_GET['t12'];
$t13 = $_GET['t13'];
$t14 = $_GET['t14'];
$t15 = $_GET['t15'];
$t16 = $_GET['t16'];
$t17 = $_GET['t17'];
$t18 = $_GET['t18'];
$t19 = $_GET['t19'];
$t20 = $_GET['t20'];

$a = $_POST['1'];
$b = $_POST['2'];
$c = $_POST['3'];
$d = $_POST['4'];
$e = $_POST['5'];
$f = $_POST['6'];
$g = $_POST['7'];
$h = $_POST['8'];
$i = $_POST['9'];
$j = $_POST['10'];

if (empty($a)) {$a = 'temp';}

if ($edit == 'tru') {

$v ="UPDATE $which SET";
$w =" WHERE ID = '$id'";

}else{
$v ="INSERT INTO $which SET";
$w = $nil;
}

if (empty($b)) {$bc = $no; } else {$bc=',';}
if (empty($c)) {$cc = $no; } else {$cc=',';}
if (empty($d)) {$dc = $no; } else {$dc=',';}
if (empty($e)) {$ec = $no; } else {$ec=',';}
if (empty($f)) {$fc = $no; } else {$fc=',';}
if (empty($g)) {$gc = $no; } else {$gc=',';}
if (empty($h)) {$hc = $no; } else {$hc=',';}
if (empty($i)) {$ic = $no; } else {$ic=',';}
if (empty($j)) {$jc = $no; } else {$jc=',';}
if (empty($k)) {$kc = $no; } else {$kc=',';}

if (empty($a)) {$t1= $nono; $q1 = $abc; $q2 = $def;}else{$q1a="'"; $q2a="=";}
if (empty($b)) {$t2= $nono; $q1 = $abc; $q2 = $def;}else{$q1b="'"; $q2b="=";}
if (empty($c)) {$t3= $nono; $q1 = $abc; $q2 = $def;}else{$q1c="'"; $q2c="=";}
if (empty($d)) {$t4= $nono; $q1 = $abc; $q2 = $def;}else{$q1d="'"; $q2d="=";}
if (empty($e)) {$t5= $nono; $q1 = $abc; $q2 = $def;}else{$q1e="'"; $q2e="=";}
if (empty($f)) {$t6= $nono; $q1 = $abc; $q2 = $def;}else{$q1f="'"; $q2f="=";}
if (empty($g)) {$t7= $nono; $q1 = $abc; $q2 = $def;}else{$q1g="'"; $q2g="=";}
if (empty($h)) {$t8= $nono; $q1 = $abc; $q2 = $def;}else{$q1h="'"; $q2h="=";}
if (empty($i)) {$t9= $nono; $q1 = $abc; $q2 = $def;}else{$q1i="'"; $q2i="=";}
if (empty($j)) {$t10=$nono; $q1 = $abc; $q2 = $def;}else{$q1j="'"; $q2j="=";}

$sql = "$v
$t1 $q2a$q1a$a$q1a$bc
$t2 $q2b$q1b$b$q1b$cc
$t3 $q2c$q1c$c$q1c$dc
$t4 $q2d$q1d$d$q1d$ec
$t5 $q2e$q1e$e$q1e$fc
$t6 $q2f$q1f$f$q1f$gc
$t7 $q2g$q1g$g$q1g$hc
$t8 $q2h$q1h$h$q1h$ic
$t9 $q2i$q1i$i$q1i$jc
$t10 $qj$q1j$j$q1j$kc
$w
";
$query = mysql_query($sql) or die("Cannot query the database.<br>" . mysql_error());

$variable = "$return.php";
include 'resend.php';
?>
