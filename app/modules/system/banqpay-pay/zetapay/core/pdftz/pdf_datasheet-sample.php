<?php

/*define('FPDF_FONTPATH','core/pdf/fonts/');
require('core/pdf/pdf_config.php');
require('core/pdf/fpdf.php');*/

define('FPDF_FONTPATH','fonts/');
require('pdf_config.php');
require('fpdf.php');


class PDF extends FPDF

{

//Starting Y position

var $y0;



 function Header()

 {

    $this->Background();

    $this->SetFont('helvetica','B',18);

 	  $this->SetLineWidth(0);

    $w=$this->GetStringWidth(ePaymentsnews_Network)+6;

    //$this->SetX((210-$w)/2);

    $this->SetTextColor(200,0,0);

    $this->Cell($w,9,'ePaymentsnews Network',0,0,'C');

 

	  //Today's date

	  $this->SetTextColor(0,0,0);

//	  $date = strftime(DATE_FORMAT_LONG);



	  $this->SetFont('Arial','B',12);

	  $this->Cell(0,9,'',0,1,'R');

		

    $this->Ln(1);

//	  $x=$this->GetX();

//	  $y=$this->GetY();

//	  $this->Line($x,$y,190,$y);

//	  $this->Ln(1);

		

    //Keep Y position

    $this->y0=$this->GetY();

 }



 function Footer()

 {

    //Footer notes

    $this->SetY(-30);

    $footer_color_cell=explode(",",FOOTER_CELL_BG_COLOR);

    $this->SetFillColor($footer_color_cell[0], $footer_color_cell[1], $footer_color_cell[2]);

    $this->MultiCell(0,5,"",0,'L',1);

	  $x=$this->GetX();

	  $y=$this->GetY();

	  $this->SetLineWidth(0);

	  $this->Line($x,$y,190,$y);

    $this->SetFont('Arial','I',8);

    $this->Cell($w,9,'ePaymentsnews Network (epnn) - www.epnn.com - tzetter@epnn.com',0,0,'L');

    $this->Cell(0,10,'Page '.$this->PageNo().'/{nb}',0,0,'R');

 }



 function CheckPageBreak($h)

 {

	if($this->GetY()+$h>$this->PageBreakTrigger)

		$this->AddPage($this->CurOrientation);

 }

 

 function NbLines($w,$txt)

 {

	//Calculate number of lines for a "w" width Multicell

	$cw=&$this->CurrentFont['cw'];

	if($w==0)

		$w=$this->w-$this->rMargin-$this->x;

	$wmax=($w-2*$this->cMargin)*1000/$this->FontSize;

	$s=str_replace("\r",'',$txt);

	$nb=strlen($s);

	if($nb>0 and $s[$nb-1]=="\n")

		$nb--;

	$sep=-1;

	$i=0;

	$j=0;

	$l=0;

	$nl=1;

	while($i<$nb)

	{

		$c=$s[$i];

		if($c=="\n")

		{

			$i++;

			$sep=-1;

			$j=$i;

			$l=0;

			$nl++;

			continue;

		}

		if($c==' ')

			$sep=$i;

		$l+=$cw[$c];

		if($l>$wmax)

		{

			if($sep==-1)

			{

				if($i==$j)

					$i++;

			}

			else

				$i=$sep+1;

			$sep=-1;

			$j=$i;

			$l=0;

			$nl++;

		}

		else

			$i++;

	}

	return $nl;

}



 function LineString($x,$y,$txt,$cellheight)

 {

		//calculate the width of the string

		$stringwidth=$this->GetStringWidth($txt);



		//calculate the width of an alpha/numerical char

		$numberswidth=$this->GetStringWidth('1');



		$xpos=($x+$numberswidth);



	    $ypos=($y+($cellheight/2));



		$this->Line($xpos,$ypos,($xpos+$stringwidth),$ypos);

 }



 function ShowImage(&$width,&$height,$path)

 {

 	$width=min($width,MAX_IMAGE_WIDTH);

	$height=min($height,MAX_IMAGE_HEIGHT);

 	$this->SetLineWidth(1);

	$this->Cell($width,$height,"",0,0);

	$this->SetLineWidth(0.2);

	$this->Image($path,($this->GetX()-$width)+1, $this->GetY(), $width, $height);

 }



 function CalculatedSpace($y1,$y2,$imageheight)

 {

	if(($h2=$y2-$y1) < $imageheight)

	{

			$this->Ln(($imageheight-$h2)+3);

	}

	else

	{

						$this->Ln(3);

	}

 }

 

 function DrawCells($data_array)

 {

 	 $totallines=0;

	

	 for($i=2;$i<(sizeof($data_array)-1);$i++)

	 {

	 	$totallines+=$this->NbLines((180-$data_array[0]),$data_array[$i]);

	 }

	 

	 //5 = cells height

	 $h=5*$totallines."<br>";

	 

	 //if products description takes the whole page height

	 if($h<260)

	 {

	 	$this->CheckPageBreak($h);

	 }

	 

		$data_array[0]=$data_array[1]=0;

		$y1=$this->GetY();

	

    $this->SetFont('times','',11);

	 

	 	$this->Cell($data_array[0]+3,5,"",0,0);

	 	$this->MultiCell(180-$data_array[0],5,$data_array[2],0,'L');



// 		$this->Cell($data_array[0]+3,5,"",0,0);

		$x=$this->GetX();

		$y=$this->GetY();

// 		$this->MultiCell(187-$data_array[0]- $this->rMargin,5,$data_array[8],0,'L',1);



	 $x2=$this->GetX();

	 $y2=$this->GetY();

	 

     //if newsbyte does not takes the whole page height

	 if($h<260)

	 {

		 $this->CalculatedSpace($y1,$y2,$data_array[1]);

 	 }

 }





  function DataSheet($sid){

      global $currencies;

	  

		//Convertion pixels -> mm

   	$imagewidth=SMALL_IMAGE_WIDTH*PDF_TO_MM_FACTOR;

	  $imageheight=SMALL_IMAGE_HEIGHT*PDF_TO_MM_FACTOR;

		

 	  /*$print_catalog_query = tep_db_query("select time, title, hometext, bodytext

                              from " . TABLE_STORIES . " where

                              sid = '" . $sid . "'");*/



		/* if ($print_catalog = tep_db_fetch_array($print_catalog_query)) {*/

         $print_catalog_array = array(

                        			  'date' => $print_catalog['time'],

   			                        'title' => $print_catalog['title'],

                        			  'hometext' => $print_catalog['hometext'],

                        			  'bodytext' => $print_catalog['bodytext']);

	//   }



     $this->AddPage();

      

		 $this->SetFont('helvetica','B',12);

     $name_color_table=explode(",",NAME_COLOR_TABLE);

     $this->SetFillColor($name_color_table[0], $name_color_table[1], $name_color_table[2]);

     $this->MultiCell(0,9,$print_catalog_array['title'],0,'L',1);

     $this->Ln(10);

		 

 		 $text = str_replace("&nbsp;","",rtrim(strip_tags($print_catalog_array['hometext'])));

		 $text .= "\n\n";

		 $text .= str_replace("&nbsp;","",rtrim(strip_tags($print_catalog_array['bodytext'])));

		 $text .= "\n\n\n";

		 $text .= "Published: ";		 

 		 $text .= $print_catalog_array['date'];

		 

		 $date = rtrim(strip_tags($print_catalog_array['date']));



		 $data_array=array($imagewidth,$imageheight,$text, $date);



		 $this->DrawCells($data_array);

                                           

   	 $this->SetTextColor(0,0,0);

     $x=$this->GetX();

	   $y=$this->GetY();

	   $this->SetLineWidth(0.5);

	   $this->SetDrawColor(210,210,210);

	   $this->Line(40,$y,170,$y);

	   $this->Ln(5);

	   $this->SetDrawColor(0,0,0);

	    

 }



 function ProductsPath($lib)

 {

    //Title

    $this->SetFont('arial','I',10);

    $header_color_table=explode(",",HEADER_COLOR_TABLE);

    $this->SetFillColor($header_color_table[0], $header_color_table[1], $header_color_table[2]);

    $this->Cell(0,5,$lib,0,0,'C',1);

    $this->Ln(10);

    //Keep Y position

    $this->y0=$this->GetY();

 }



 function Background()

 {

    $titles_color_table=explode(",",PAGE_BG_COLOR);

    $this->SetFillColor($titles_color_table[0], $titles_color_table[1], $titles_color_table[2]);

    $this->Rect($this->lMargin,0,190,$this->h,'F');

 }

}



$pdf=new PDF();

$pdf->Open();

$pdf->SetDisplayMode("real");

$pdf->AliasNbPages();

$pdf->DataSheet($sid);



// Prints content to browser

$pdf->Output("newsbyte$sid.pdf",true);



?>