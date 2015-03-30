<?php
session_start();
header("Content-type: application/octet-stream");
header("Content-Disposition: attachment; filename=\"transaction.csv\"");
if($_REQUEST['page']=='activity')
{
	$head="Date,Time,Pan,Transaction Status,Transaction Amount,Card Issuer Amount,Settlement Amount,Network Code,Card Acceptor Name\n";


	if($_REQUEST[val]=="")
		$data=$_SESSION['global_str'];
	else
		$data=$_REQUEST[val];

	echo $head.$data;
}
elseif($_REQUEST['page']=='account')
{
	
	$head="Billing Summary,Card Type,Discount Rate,#of Transactions Totals ,Settlement,Transaction Fees,Transaction Surcharge,Billing Total\n";


	//$data=$_SESSION['acc_str'];

    for($i=0;$i<count($_SESSION[creditcard_arr]);$i++)
	  {
	  	for($j=0;$j<count($_SESSION[creditcard_arr][$i]);$j++)
			$data=$data.",".$_SESSION[creditcard_arr][$i][$j];

			$data=$data."\n";
	  }

    for($i=0;$i<count($_SESSION[arr_otherCard]);$i++)
	{
	  	for($j=0;$j<count($_SESSION[arr_otherCard][$i]);$j++)
			   $data=$data.",".$_SESSION[arr_otherCard][$i][$j];

			$data=$data."\n";
	}	
	   
	echo $title.$_SESSION['title'].$head.$data.$_SESSION['txn_heading'].$_SESSION['txn_data'];
}

?> 

