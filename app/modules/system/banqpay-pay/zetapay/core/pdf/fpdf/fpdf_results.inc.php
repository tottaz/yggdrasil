<?php
define("lightBrownBg","241,242,234");//#f1f2ea
define("lightBlueBg","220,233,231"); //#DCE9E7
define("grayBg","204,204,204"); //#cccccc
define("darkGrayBg","148,174,190"); //#94aebe
define("orangeHead","192,160,98"); //#c0a062

define("white","255,255,255");
define("black","0,0,0");
define('FPDF_FONTPATH','../../../extra/fpdf/font/');
class PDF extends FPDF
{
	function Header()
	{ 
		//Logo
		global $title;
		global $CLIENT_LOGO;
		$this->SetFont('Arial','B',10);
		//Calculate width of title and position
		$w=192;
		$this->SetY($this->GetY()+35);
		$dim=$this->Image('../../../extra/images/log.jpg',10,20,100);
		if($CLIENT_LOGO=='TLFW')
			$dim=$this->Image('../../../extra/images/TLlogo.jpg',150,20,20);
		elseif($CLIENT_LOGO=='SLEE')
		  $dim=$this->Image('../../../extra/images/saraleecorplogo.jpg',150,20,50);
		$this->SetDrawColor(black);
		$this->SetFillColor(192,160,98);
		$this->SetTextColor(black);
		//Thickness of frame (1 mm)
		$this->SetLineWidth(0);
		//Title
		$this->Cell($w,5,$title,1,1,'C',1); //Cell(width,height,,,align,))
		//Line break
		//$this->Ln();
	}

	//Page footer
	function Footer()
	{
		//Position at 1.5 cm from bottom
		$this->SetY(-15);
		//Arial italic 8
		$this->SetFont('Arial','I',8);
		//Page number
		$this->Cell(0,10,'Page '.$this->PageNo(),0,0,'C');
	}
	
//Simple table	
	function HeaderTable($headerArr,$dataArr=NULL)
	{
    	//Colors, line width and bold font
		$this->SetDrawColor(0,0,0);
		$this->SetFillColor(0,0,0);

		$this->SetLineWidth(.3);
		$this->SetFont('','B',10);
		//Header
		$w=array(50,70);
		$fill=0;
		//top heading
		for($i=0;$i<count($headerArr);$i++)
		{  
			$this->SetTextColor(black);
			$this->Cell($w[0],4,$headerArr[$i],0,0,'L');
			$this->SetTextColor(black);
			$this->Cell($w[1],4,$dataArr[$i],0,0,'L');
			$this->Ln();
		}
		$this->Ln(); 
	    //$this->Cell(array_sum($w),0,'','T');
	}
	function SingleRow($header=Null,$color='') // this function prints a single colored row with one string as argument
	{
		if($color=='')
			$this->SetFillColor(148,174,190);
		else
			$this->SetFillColor($color);
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		$this->Cell(190,4,$header[0],1,0,'L',1);
		$this->Ln(); 
	}
	function SingleRow_trile($header=Null,$color='') // this function prints a single colored row with one string as argument
	{
		if($color=='')
			$this->SetFillColor(148,174,190);
		else
			$this->SetFillColor($color);
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		$this->Cell(175,4,$header[0],1,0,'L',1);
		$this->Cell(15,4,$header[1],1,0,'C',1);
		$this->Ln(); 
	}
//Colored table

	function FancyTable($header=NULL,$data=NULL) 
	{
    //Colors, line width and bold font
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		$this->SetFillColor(241,242,234);
		$w=array(132,25,35);
		
		//pk Mar20 Comment flowed out of column
		// Logic: Break comment into chunks of fised size and add extra rows
		//wordwrap with a special substr that cannot be found in the string
		//$header[2] is the comment
		$str= wordwrap(trim($header[2]),74,'##?pk?#');
		$strArr=explode('##?pk?#',$str);
		$rowPrinted=false;				
		for($k=0;$k<count($strArr);$k++)
		{	
			if(!$rowPrinted)
			{
				for($i=0;$i<count($header);$i++)
				{
					if($i==0)
					{	

						if($header[$i]=="") 
						$this->Cell($w[$i],4,"  ",1,0,'L',1);
						else
						$this->Cell($w[$i],4,$header[$i],1,0,'L',1);
					}
					elseif($i==1 || $i==3)
					{	

						if($header[$i]=="") 
						$this->Cell($w[$i],4," ",1,0,'C',1);
						else
						$this->Cell($w[$i],4,$header[$i],1,0,'C',1);
					}	
					else
					{
						$this->Cell($w[$i],4,$strArr[$k],1,0,'L',1);
					}	
				}
			}
			else
			{
				for($i=0;$i<count($header);$i++)
				{
					if($i==0)
					{	
						$this->Cell($w[$i],10," ",1,0,'L',1);
					}
					elseif($i==1 || $i==3)
					{	
						$this->Cell($w[$i],4," ",1,0,'C',1);
						
					}	
					else
					{
						$this->Cell($w[$i],4,$strArr[$k],1,0,'L',1);
					}	
				}
			
			
			
			}
			$this->Ln();
			$rowPrinted=true;
			
		}
		//}	 
		//Data
		$fill=0;
		if($data!=NULL)
		{
			foreach($data as $row)
			{
				$this->Cell($w[0],4,$row[0],'LR',0,'L',$fill);
				$this->Cell($w[1],4,$row[1],'LR',0,'L',$fill);
				$this->Cell($w[2],4,number_format($row[2]),'LR',0,'R',$fill);
				$this->Cell($w[3],4,number_format($row[3]),'LR',0,'R',$fill);
				$this->Ln();
				$fill=!$fill;
			}
			$this->Cell(array_sum($w),0,'','T');
		}	
    
	}
	function FancyTableCLR($header=NULL,$data=NULL) 
	{
    //Colors, line width and bold font
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		$this->SetFillColor(148,174,190);
		$w=array(132,25,35);
		
		//pk Mar20 Comment flowed out of column
		// Logic: Break comment into chunks of fised size and add extra rows
		//wordwrap with a special substr that cannot be found in the string
		//$header[2] is the comment
		$str= wordwrap(trim($header[2]),20,'##?pk?#');
		$strArr=explode('##?pk?#',$str);
		$rowPrinted=false;				
		for($k=0;$k<count($strArr);$k++)
		{	
			if(!$rowPrinted)
			{
				for($i=0;$i<count($header);$i++)
				{
					if($i==0)
					{	

						if($header[$i]=="") 
						$this->Cell($w[$i],4,"  ",1,0,'L',1);
						else
						$this->Cell($w[$i],4,$header[$i],1,0,'L',1);
					}
					elseif($i==1 || $i==3)
					{	

						if($header[$i]=="") 
						$this->Cell($w[$i],4," ",1,0,'C',1);
						else
						$this->Cell($w[$i],4,$header[$i],1,0,'C',1);
					}	
					else
					{
						$this->Cell($w[$i],4,$strArr[$k],1,0,'L',1);
					}	
				}
			}
			else
			{
				for($i=0;$i<count($header);$i++)
				{
					if($i==0)
					{	
						$this->Cell($w[$i],10," ",1,0,'L',1);
					}
					elseif($i==1 || $i==3)
					{	
						$this->Cell($w[$i],4," ",1,0,'C',1);
						
					}	
					else
					{
						$this->Cell($w[$i],4,$strArr[$k],1,0,'L',1);
					}	
				}
			
			
			
			}
			$this->Ln();
			$rowPrinted=true;
			
		}
		//}	 
		//Data
		$fill=0;
		if($data!=NULL)
		{
			foreach($data as $row)
			{
				$this->Cell($w[0],4,$row[0],'LR',0,'L',$fill);
				$this->Cell($w[1],4,$row[1],'LR',0,'L',$fill);
				$this->Cell($w[2],4,number_format($row[2]),'LR',0,'R',$fill);
				$this->Cell($w[3],4,number_format($row[3]),'LR',0,'R',$fill);
				$this->Ln();
				$fill=!$fill;
			}
			$this->Cell(array_sum($w),0,'','T');
		}	
    
	}
	function AgentInfo($header=NULL,$data=NULL) 
	{
    //Colors, line width and bold font
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		$w=array(102,90);  
		for($i=0;$i<count($header);$i++)
		{
			if(($i%2)==0)
			{	
				$this->SetFillColor(204,204,204);
				$this->Cell(102,4,$header[$i],1,0,'L',1);
			}
			else
			{
				
				$this->SetFillColor(241,242,234);
				$this->Cell(90,4,$header[$i],1,0,'L',1);
				$this->Ln();
			}	
			
		}
	}
		
	function AgentInfo_Head($header=NULL,$data=NULL) 
	{
    //Colors, line width and bold font
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		$w=array(85,16,63,23);
		for($i=0;$i<count($header);$i++)
		{
			$this->SetFillColor(148,174,190);
			if($header[$i]=='')
				$this->Cell($w[$i],4,"0",1,0,'L',1);
			else
				$this->Cell($w[$i],4,$header[$i],1,0,'L',1);
		}
		$this->Ln();
	}
	function ParamHeading($header)
	{
		$this->SetFillColor(192,160,98);
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		//Header
		if($header!=NULL)
		{
			$w=array(132,25,35);
			for($i=0;$i<count($header);$i++)
			{
				$this->Cell($w[$i],4,$header[$i],1,0,'L',1);
			}	
			$this->Ln();
			//Color and font restoration

		}	 
	}
	function ParamHeading_myron($header)
	{
		$this->SetFillColor(192,160,98);
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		//Header
		if($header!=NULL)
		{
			//$w=array(85,16,26,63);
			//$w=array(48,16,63,63);
			$w=array(87,14,63,26);
			for($i=0;$i<count($header);$i++)
			{
				$this->Cell($w[$i],4,$header[$i],1,0,'L',1);
			}	
			$this->Ln();
			//Color and font restoration

		}	 
	}
	function ParamHeading1($header)
	{
		$this->SetFillColor(222,333,444);
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		//Header
		if($header!=NULL)
		{
			$w=array(40,50,63,63);
			for($i=0;$i<count($header);$i++)
			{
				$this->Cell($w[$i],4,$header[$i],1,0,'L',1);
			}	
			$this->Ln();
			//Color and font restoration

		}	 
	}

	function ParamHeading2($header)
	{
		$this->SetFillColor(256,256,256);
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','',8);
		//Header
		if($header!=NULL)
		{
			$w=array(40,50,63,63);
			for($i=0;$i<count($header);$i++)
			{
				$this->Cell($w[$i],4,$header[$i],1,0,'L',1);
			}	
			$this->Ln();
			//Color and font restoration

		}	 
	}
	function SubParamHead($header)
	{
		$this->SetFillColor(220,233,231);
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		//Header
		if($header!=NULL)
		{
			$this->Cell(190,4,$header[0],1,0,'L',1);
			$this->Ln();
		}	 
	}
	function Score($header)
	{
		$this->SetFillColor(148,174,190);
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		//Header
		if($header!=NULL)
		{
			$w=array(167,23);
			for($i=0;$i<count($header);$i++)
			{
				if($i==0)
				$this->Cell($w[$i],4,$header[$i],1,0,'L',1);
				else
				$this->Cell($w[$i],4,$header[$i],1,0,'C',1);
			}	
			$this->Ln();
			//Color and font restoration

		}	 
	}
	function Score_trile($header)
	{
		$this->SetFillColor(148,174,190);
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		//Header
		if($header!=NULL)
		{
			$w=array(58,132);
			for($i=0;$i<count($header);$i++)
			{
				if($i==0)
				$this->Cell($w[$i],4,$header[$i],1,0,'L',1);
				else
				$this->Cell($w[$i],4,$header[$i],1,0,'L',1);
			}	
			$this->Ln();
			//Color and font restoration

		}	 
	}

	function Score_trile1($header)
	{
		$this->SetFillColor(148,174,190);
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		//Header
		if($header!=NULL)
		{
			$w=array(175,15);
			for($i=0;$i<count($header);$i++)
			{
				if($i==0)
				$this->Cell($w[$i],4,$header[$i],1,0,'L',1);
				else
				$this->Cell($w[$i],4,$header[$i],1,0,'C',1);
			}	
			$this->Ln();
			//Color and font restoration

		}	 
	}
	function SummaryHead($header)
	{
		$this->SetFillColor(241,242,234);
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		for($i=0;$i<count($header);$i++)
		{
			 
			$this->Cell(190,4,$header[$i],1,0,'L',1);
			$this->Ln();
		}	 
	}
	function Summary($header)
	{
		$this->SetFillColor(220,233,231);
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		//Header
		if($header!=NULL)
		{
			$w=array(192);  
			for($i=0;$i<count($header);$i++)
			{
				$this->Cell($w[$i],4,$header[$i],1,0,'L',1);
				$this->Ln();
			}	
			
			//Color and font restoration

		}	 
	}
}	
?>


