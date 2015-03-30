<?php
session_start();
require('fpdf/fpdf.php');
include('fpdf/fpdf.inc.php');

//error_reporting(E_ALL);
$NO_OF_FIELDS=4;
$pdf=new PDF();
$pdf->Open();
$pdf->SetFont('Arial','',14);
$f=0;
/*---------------------------------------------------------------------------------------*/
//$title=' Account Statement ';
$pdf->AddPage(); 

 $pdf->SetLineWidth("250");
// ####### This code is used to Gent Vendor Name and Campaign Name to be displayed at top ############//

	$inserted=0;
	$num_variable=1;

	$headerArr=array();
	$dataArr=array();


	$headerArr[]=$_SESSION['title'];
	$align=array('C');
	$wid=array(245);
	$pdf->SetFillColor(220,233,231);			
	$pdf->Row($headerArr,$wid,$align);
	$headerArr=Null;
	$pdf->Ln();$pdf->Ln();


if($_SESSION[top_item]!="")
{
	$top=explode(";",$_SESSION[top_item]);
	$headerArr[]='CLI Account Number';
  	$headerArr[]=$top[0];

	$headerArr[]='Statement Date';
	$headerArr[]=$top[1];
	$headerArr[]='Account Name ';
	$headerArr[]=$top[2];
	
	$headerArr[]='Terminal Id ';
	$headerArr[]=$top[3];
	$headerArr[]='Currency';
	$headerArr[]=$top[4];

	$headerArr[]='Total Amount Billed This Period';
	$headerArr[]=$top[5];
	
	
 	$pdf->AgentInfo($headerArr);
}
else if($_SESSION[top_item_index]!="")
{
	$top=explode(";",$_SESSION[top_item_index]);

	$headerArr[]='CLI Chain ID';
  	$headerArr[]=$top[0];

	$headerArr[]='No of Transactions';
	$headerArr[]=$top[1];
	$headerArr[]='Account Name ';
	$headerArr[]=$top[2];
	
	$headerArr[]='Transactions $ Volume';
	$headerArr[]=$top[3];
	$headerArr[]='Number Terminals ';
	$headerArr[]=$top[4];

	$headerArr[]='Current Billing Cycle';
	$headerArr[]=$top[5];

	$headerArr[]='Total Amount Billed This Period';
	$headerArr[]=$top[6];

	$headerArr[]=' ';
	$headerArr[]='';
	$pdf->AgentInfo($headerArr);
}

	$pdf->Ln(); 
	$title1[]='Billing Summary';
	$align=array('C');
	$wid=array(245);
	$pdf->SetFillColor(220,233,231);			
	$pdf->Row($title1,$wid,$align);
	
	$pdf->Ln(); 

	$header=NULL;	
	$header[]="Card Type ";
	$header[]="Discount Rate";
	$header[]="#of Transactions Totals ";
	$header[]="Settlement";
	$header[]="Transaction Fees";
	$header[]="Transaction Surcharge";
	$header[]="Billing Total";
	//$pdf->ParamHeading_periodic($header);
	$align=array('C','C','C','C','C','C','C','C','C');
	$wid=array(35,35,35,35,35,35,35);
	$pdf->SetFillColor(192,160,98);			
	$pdf->Row($header,$wid,$align);
	

	$data=explode(",",$_SESSION['acc_str']);
	$header=Null;
 	$j=0;
	if(count($data)>0)
	{
		for($i=1;$i<count($data);$i++)
		{
			if($j<=6)
			{
				$header[]=$data[$i];
				$j++;
			}
			else
			{
				 
				$pdf->SetFillColor(241,242,234);
				$align=array('C','C','C','C','C','C','C');
				$wid=array(35,35,35,35,35,35,35);
				$pdf->Row($header,$wid,$align);
				$j=0;
				$i=$i-1;
				$header=Null;
			}
		}
				$pdf->SetFillColor(192,160,98);
				$align=array('C','C','C','C','C','C','C');
				$wid=array(35,35,35,35,35,35,35);
				$pdf->Row($header,$wid,$align);
	}
	else
	{
		$header=NULL;	
		$header[]="No Record Found";
		$pdf->SingleRow_report($header);
	}

	$pdf->Ln(); 
	$title2[]='Transaction Summary';
	$align=array('C');
	$wid=array(245);
	$pdf->SetFillColor(220,233,231);			
	$pdf->Row($title2,$wid,$align);
	
	$pdf->Ln(); 

/*$pdf->Ln();$pdf->Ln();

if($_SESSION[top_item]!="")
{
	$top=explode(";",$_SESSION[top_item]);
	$headerArr[]='CLI Account Number';
  	$headerArr[]=$top[0];

	$headerArr[]='Statement Date';
	$headerArr[]=$top[1];
	$headerArr[]='Account Name ';
	$headerArr[]=$top[2];
	
	$headerArr[]='Terminal Id ';
	$headerArr[]=$top[3];
	$headerArr[]='Currency';
	$headerArr[]=$top[4];

	$headerArr[]='Total Amount Billed This Period';
	$headerArr[]=$top[5];
	
	*/
 
$pdf->Ln();$pdf->Ln();$pdf->Ln();$pdf->Ln();$pdf->Ln();
	

//$file=basename(tempnam(getcwd(),'tmp'));
$file="merchantsummary.pdf";
$pdf->Output($file);
 echo "<html><SCRIPT>document.location='merchantsummary.pdf?f=$file'; </SCRIPT></html>";
?>
