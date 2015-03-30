<?php
define("lightBrownBg","241,242,234");//#f1f2ea
define("lightBlueBg","220,233,231"); //#DCE9E7
define("grayBg","204,204,204"); //#cccccc
define("darkGrayBg","148,174,190"); //#94aebe
define("orangeHead","192,160,98"); //#c0a062

define("white","255,255,255");
define("black","0,0,0");
define('FPDF_FONTPATH','font/');

class PDF extends FPDF
{
	function Header()
	{ 
		global $title;
		global $CLIENT_LOGO;
		global $rootDir;
		global $subDir;
		$this->SetFont('Arial','B',10);
		//Calculate width of title and position
		//$w=190;
 		$w=245;
		$this->SetY($this->GetY()+40);
		$dim=$this->Image($rootDir.$subDir.'images/logo.jpg',150,20,100);//logo
		
		$this->SetDrawColor(black);
		$this->SetFillColor(192,160,98);
		$this->SetTextColor(black);
		//Thickness of frame (1 mm)
		$this->SetLineWidth(0);
		//Title
		//$this->Cell($w,5,$title,1,1,'C',1); //Cell(width,height,,,align,))
		//Line break
		$this->Ln();
	}
	function Header1()
	{ 
		global $title;
		global $CLIENT_LOGO;
		global $rootDir;
		global $subDir;
		$this->SetFont('Arial','B',10);
		//Calculate width of title and position
		//$w=190;
 		$w=245;
		$this->SetY($this->GetY()+40);
		$dim=$this->Image($rootDir.$subDir.'images/terminal.jpg',7,180,20,1);//logo
		
		$this->SetDrawColor(black);
		$this->SetFillColor(192,160,98);
		$this->SetTextColor(black);
		//Thickness of frame (1 mm)
		$this->SetLineWidth(0);
		//Title
		//$this->Cell($w,5,$title,1,1,'C',1); //Cell(width,height,,,align,))
		//Line break
		$this->Ln();
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
	function SingleRow_report($header=Null) // this function prints a single colored row with one string as argument
	{	
		$this->SetFillColor(148,174,190);		
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		$this->Cell(245,4,$header[0],1,0,'C',1);
		$this->Ln(); 
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
		// top heading
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


	function SingleRow_trile1($header=Null,$color='') // this function prints a single colored row with one string as argument
	{
		if($color=='')
			$this->SetFillColor(148,174,190);
		else
			$this->SetFillColor($color);
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		$this->Cell(140,4,$header[0],1,0,'L',1);
		$this->Cell(50,4,$header[1],1,0,'C',1);
		$this->Ln(); 
	}
//Colored table
function FancyTable_myron($header=NULL,$data=NULL) 
	{
    //Colors, line width and bold font
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		$this->SetFillColor(241,242,234);
		//$w=array(85,16,26,63);
		//$w=array(87,14,63,26);
		$w=array(87,14,63,26);
		//pk Mar20 Comment flowed out of column
		// Logic: Break comment into chunks of fised size and add extra rows
		//wordwrap with a special substr that cannot be found in the string
		//$header[2] is the comment
		$str= wordwrap(trim($header[2]),20,"<br />\n");
		$strArr=explode('##?pk?#',$str);
		$rowPrinted=false;				
		for($k=0;$k<count($strArr);$k++)
		{	
			$str1= wordwrap(trim($strArr[$k]),20,"\n",1);
			if(!$rowPrinted)
			{
				for($i=0;$i<count($header);$i++)
				{
					//$x=$this->GetX();
					//$y=$this->GetY();
					//$wid=$w[$i];//$this->widths[$i];
					$str= wordwrap(trim($header[$i]),20,"\n",1);
					if($i==0)
					{	
						if($header[$i]=="") 
						{
							//$this->MultiCell($w[$i],4,"  ",1,0,1);
							//$this->Write($w[$i],"  ");
							$this->Cell($w[$i],4,"  ",1,0,'L',1);
						}
						else
						{
							//$this->MultiCell($w[$i],4,$header[$i],1,0,1);
							//$this->Write($w[$i],$header[$i]);
							$this->Cell($w[$i],4,$header[$i],1,0,'L',1);
							//$this->Cell($w[$i],4,$str,1,0,'L',1);
						}
					}
					elseif($i==1 || $i==3)
					{	

						if($header[$i]=="") 
						{
							//$this->MultiCell($w[$i],4," ",1,0,1);
							//$this->Write($w[$i]," ");
							$this->Cell($w[$i],4," ",1,0,'C',1);
						}
						else
						{
							//$this->Write($w[$i],$header[$i]);
							//$this->MultiCell($w[$i],4,$header[$i],1,0,1);
							$this->Cell($w[$i],4,$header[$i],1,0,'C',1);
							//$this->Cell($w[$i],4,$str,1,0,'C',1);
						}
					}	
					else
					{
						//$this->MultiCell($w[$i],4,$strArr[$k],1,0,1);
						//$this->Write($w[$i],$strArr[$k]);
						$this->Cell($w[$i],4,$strArr[$k],1,0,'C',1);
						//$this->Cell($w[$i],4,$str1,1,0,'C',1);
					}	
				//$this->SetXY($x+$wid,$y);
				}
			}
			else
			{
				for($i=0;$i<count($header);$i++)
				{
			       // $x=$this->GetX();
					//$y=$this->GetY();
					//$wid=$this->widths[$i];
					if($i==0)
					{	
						//$this->MultiCell($w[$i],10," ",1,0,1);
						//$this->Write($w[$i]," ");
						$this->Cell($w[$i],10," ",1,0,'L',1);
					}
					elseif($i==1 || $i==3)
					{	
						//$this->Write($w[$i]," ");
						//$this->MultiCell($w[$i],4," ",1,0,1);
						$this->Cell($w[$i],4," ",1,0,'C',1);
						
					}	
					else
					{
						//$this->Write($w[$i],$strArr[$k]);
						//$this->MultiCell($w[$i],4,$strArr[$k],1,0,1);
						$this->Cell($w[$i],4,$strArr[$k],1,0,'L',1);
						//$this->Cell($w[$i],4,$str1,1,0,'L',1);
					}	
				//$this->SetXY($x+$wid,$y);			
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
				//$this->MultiCell($w[0],4,$row[0],1,0,$fill);
				$this->Cell($w[0],4,$row[0],'LR',0,'L',$fill);
				//$this->MultiCell($w[1],4,$row[1],1,0,$fill);
				$this->Cell($w[1],4,$row[1],'LR',0,'L',$fill);
				//$this->MultiCell($w[2],4,number_format($row[2]),1,0,$fill);
				$this->Cell($w[2],4,number_format($row[2]),'LR',0,'R',$fill);
				//$this->MultiCell($w[3],4,number_format($row[3]),1,0,$fill);
				$this->Cell($w[3],4,number_format($row[3]),'LR',0,'R',$fill);
				$this->Ln();
				$fill=!$fill;
			}
			//$this->MultiCell(array_sum($w),0,'','T',1,0,1,$fill);
			$this->Cell(array_sum($w),0,'','T');
		}	
    
	}
	function FancyTable($header=NULL,$data=NULL) 
	{
    //Colors, line width and bold font
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		$this->SetFillColor(241,242,234);
		$w=array(48,16,63,63);
		
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
	function FancyTable_trile($header=NULL,$data=NULL) 
	{
    //Colors, line width and bold font
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		$this->SetFillColor(241,242,234);
		$w=array(58,32,85,15);
		
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



function FancyTable_trile1($header=NULL,$data=NULL) 
	{
    //Colors, line width and bold font
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		$this->SetFillColor(220,233,231);
		$w=array(90,50,50);
		
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
					elseif($i==1)
					{	

						if($header[$i]=="") 
						$this->Cell($w[$i],4," ",1,0,'C',1);
						else
						$this->Cell($w[$i],4,$header[$i],1,0,'C',1);
					}	
					elseif($i==2)
					{
						$this->Cell($w[$i],4,$strArr[$k],1,0,'C',1);
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
					elseif($i==1)
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
		$w=array(61,142);  
		$j=0;
		for($i=0;$i<count($header);$i++)
		{
			if($j>=0 && $j<4)
			{	
				if(($j%2)==0)
					$this->SetFillColor(204,204,204);
				else
					$this->SetFillColor(241,242,234);
				$this->Cell(61,4,$header[$i],1,0,'L',1);
				$j++;
			}
			else
			{
				$this->Ln();
//				$this->SetFillColor(204,204,204);
//				$this->Cell(48,4,$header[$i],1,0,'L',1);
				$i=$i-1;
				$j=0;
			}
		}
		$this->Ln();
	}
	function AgentInfo_drc($header=NULL,$data=NULL) 
	{
    //Colors, line width and bold font
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		$w=array(48,48,48,46);  
		for($i=0;$i<count($header);$i++)
		{
			if(($i%4)==0)
			{	
				$this->Ln();
				//if(($i%2)==0)
					$this->SetFillColor(204,204,204);

				$this->Cell(48,4,$header[$i],1,0,'L',1);
				//if($i!=0)
				//$this->Ln();
			}
			else
			{
				if(($i%2)==0)
				{
					$this->SetFillColor(204,204,204);
					$this->Cell(48,4,$header[$i],1,0,'L',1);
				}
				else
				{
					$this->SetFillColor(241,242,234);
					$this->Cell(47,4,$header[$i],1,0,'L',1);
				}
				
				//$this->Cell(47,4,$header[$i],1,0,'L',1);
				//$this->Ln();
			}	
			
		}
		$this->Ln();
	}

	function AgentInfo_myron($header=NULL,$data=NULL) 
	{
    //Colors, line width and bold font
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		$w=array(50,30,30,30,20,15);  
		for($i=0;$i<count($header);$i++)
		{
			if(($i%4)==0)
			{	
				$this->Ln();
				//if(($i%2)==0)
					$this->SetFillColor(204,204,204);

				$this->Cell(50,4,$header[$i],1,0,'L',1);
				//if($i!=0)
				//$this->Ln();
			}
			else
			{	
				if(($i%2)==0)
				{
					if( $i==16 || $i==22)
					{
						$this->SetFillColor(241,242,234);// lightbrown color
						$this->Cell(46.5,4,$header[$i],1,0,'L',1);
					}
					/*
					elseif($i==18 || $i==26 || $i==28)
					{
						$this->SetFillColor(204,204,204);
						$this->Cell(45,4,$header[$i],1,0,'L',1);
					}*/
					else
					{
						$this->SetFillColor(204,204,204);
						$this->Cell(46.5,4,$header[$i],1,0,'L',1);
					}
				}
				else
				{
					if($i==19 || $i==23)
					{
						$this->SetFillColor(241,242,234);
						$this->Cell(46.5,4,$header[$i],1,0,'L',1);
					}
					elseif($i==25 || $i==27)
					{
						$this->SetFillColor(204,204,204);
						$this->Cell(46.5,4,$header[$i],1,0,'L',1);
					}
					elseif($i==29)
					{
						$this->SetFillColor(204,204,204);
						$this->Cell(46.5,4,$header[$i],1,0,'L',1);
					}
					else
					{
					$this->SetFillColor(241,242,234);
					$this->Cell(46.5,4,$header[$i],1,0,'L',1);
					}
				}
				
				//$this->Cell(47,4,$header[$i],1,0,'L',1);
				//$this->Ln();
			}	
			
		}
		//$this->Ln();
	}

function AgentInfo_myron2($header=NULL,$data=NULL) 
	{
    //Colors, line width and bold font
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		$w=array(65,15,10,15,70,15);  
		for($i=0;$i<count($header);$i++)
		{
			if(($i%5)==0)
			{	
				if($i!=0)
				$this->Ln();
				//if(($i%2)==0)
				if($i==0)
					$this->SetFillColor(148,174,190);
				else
					$this->SetFillColor(204,204,204);
				$this->Cell(38,4,$header[$i],1,0,'L',1);
				//if($i!=0)
				//$this->Ln();
			}
			else
			{
				if(($i%2)==0)
				{
					if($i==0 || $i==4){
						$this->SetFillColor(148,174,190);
						$this->Cell(38,4,$header[$i],1,0,'L',1);
					}
					elseif($i==2)
					{
						$this->SetFillColor(148,174,190);
						$this->Cell(20,4,$header[$i],1,0,'L',1);
					}
					elseif($i==12)
					{
						$this->SetFillColor(241,242,234);
						$this->Cell(20,4,$header[$i],1,0,'L',1);
						
					}
					elseif($i==8 || $i==18)
					{
						$this->SetFillColor(204,204,204);
						$this->Cell(56,4,$header[$i],1,0,'L',1);
						
					}
					else
					{
						$this->SetFillColor(204,204,204);
						$this->Cell(38,4,$header[$i],1,0,'L',1);
					}
				}
				else
				{	
					if($i==1 ||  $i==5 ){
						$this->SetFillColor(148,174,190);
						$this->Cell(38,4,$header[$i],1,0,'L',1);
					}
					elseif($i==3)
					{
						$this->SetFillColor(148,174,190);
						$this->Cell(56,4,$header[$i],1,0,'L',1);
					}
					elseif($i==7 || $i==17)
					{
						$this->SetFillColor(241,242,234);
						$this->Cell(20,4,$header[$i],1,0,'L',1);
					}
					elseif($i==13) 
					{
						$this->SetFillColor(204,204,204);
						$this->Cell(56,4,$header[$i],1,0,'L',1);
					}/*
					elseif($i==17 )
					{
						$this->SetFillColor(241,242,234);
						$this->Cell(30,4,$header[$i],1,0,'L',1);
					}*/
					else
					{
					$this->SetFillColor(204,204,204);
					$this->Cell(38,4,$header[$i],1,0,'L',1);
					}
				}
				
				//$this->Cell(47,4,$header[$i],1,0,'L',1);
				//$this->Ln();
			}	
			
		}
		$this->Ln();
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
			$w=array(48,16,63,63);
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
			$w=array(160,30);
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
			$w=array(190);  
			for($i=0;$i<count($header);$i++)
			{
				$this->Cell($w[$i],4,$header[$i],1,0,'L',1);
				$this->Ln();
			}	
			
			//Color and font restoration

		}	 
	}


 //For Notice in Merchant module
function NoticeUserInfo($header=NULL,$data=NULL) 
{
	
    //Colors, line width and bold font
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		$w=array(100,20,125);  
		$j=0;
	//	print count($header);
	//	die;
		//for($i=0;$i<count($header);$i++)
	//	{
		//	if($j==0)
		//	{
				$this->SetFillColor(241,242,234);
//				$this->Cell(100,4,$header[0],1,0,'L',1);

				$this->MultiCell(100,4,$header[0],1,'L',1);
		//	}
		//	elseif($j==1)
		//	{
				$this->SetFillColor(255,255,255);
//				$this->MultiCell(20,4,$header[1],1,'L',1);
//				$this->Cell(20,4,$header[1],0,0,'L',0);
		//	}
		//	elseif($j==2)
		//	{
				$this->SetFillColor(255, 255, 255);
				$this->MultiCell(125,4,$header[2],1,'L',1);
//				$this->Cell(125,4,$header[2],1,0,'C',1);
				//$this->Ln();
				$j=-1;	
		//	}
			
		//	$j++;
			
		//}
		
	}

function NoticeUserInfo1($header=NULL,$data=NULL) 
{
	
    //Colors, line width and bold font
		$this->SetTextColor(black);
		$this->SetDrawColor(black);
		$this->SetLineWidth(.3);
		$this->SetFont('','B',8);
		$w=array(100,20,125);  
		$j=0;
		for($i=0;$i<count($header);$i++)
		{
			if($j==0)
			{
				$this->SetFillColor(241,242,234);
			}
			elseif($j==1)
			{
				$this->SetFillColor(255,255,255);
			}
			elseif($j==2)
			{
				$this->SetFillColor(255, 255, 255);
				$j=-1;	
			}
			
			$j++;
			
		}
		
	}
	//Better table
function ImprovedTable($header,$data)
{
    //Column widths
    $w=array(40,35,40,45);
    //Header
    for($i=0;$i<count($header);$i++)
        $this->Cell($w[$i],7,$header[$i],1,0,'C');
    $this->Ln();
    //Data
    foreach($data as $row)
    {
        $this->Cell($w[0],6,$row[0],'LR');
        $this->Cell($w[1],6,$row[1],'LR');
        $this->Cell($w[2],6,number_format($row[2]),'LR',0,'R');
        $this->Cell($w[3],6,number_format($row[3]),'LR',0,'R');
        $this->Ln();
    }
    //Closure line
    $this->Cell(array_sum($w),0,'','T');
}

}
?>


