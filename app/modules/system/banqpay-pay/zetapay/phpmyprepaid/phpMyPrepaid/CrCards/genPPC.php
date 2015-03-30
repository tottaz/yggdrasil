<?php
//////////////////////////////////////////////////////////////////////////
//  Create XML doc for reciept printing program                         //
//////////////////////////////////////////////////////////////////////////


$fp = fopen("cards.ppc", "w") or die("Couldn't create new file");
foreach($UserPass as $id => $pass ) {
$numBytes = fwrite($fp, "<card>
<time>$min</time>
<username>$id</username>
<password>$pass</password>
<timestamp></timestamp>
</card>
");
fclose($fp);
}
											  
?>
