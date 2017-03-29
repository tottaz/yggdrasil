<?php

class TCPDFExt extends TCPDF {

	public function Footer() {				
		$cur_y = $this->GetY();
		$ormargins = $this->getOriginalMargins();
		$this->SetTextColor(0, 0, 0);			
		//set style for cell border
		$line_width = 0.85 / $this->getScaleFactor();
		$this->SetLineStyle(array('width' => $line_width, 'cap' => 'butt', 'join' => 'miter', 'dash' => 1, 'color' => array(0, 0, 0)));
		//print document barcode
		$barcode = $this->getBarcode();
		if (!empty($barcode)) {
			$this->Ln($line_width);
			$barcode_width = round(($this->getPageWidth() - $ormargins['left'] - $ormargins['right'])/3);
			$this->write1DBarcode($barcode, 'C128B', $this->GetX(), $cur_y + $line_width, $barcode_width, (($this->getFooterMargin() / 3) - $line_width), 0.3, '', '');	
		}
		if (empty($this->pagegroups)) {
			$pagenumtxt = $this->l['w_page'].' '.$this->getAliasNumPage().' / '.$this->getAliasNbPages();
		} else {
			$pagenumtxt = $this->l['w_page'].' '.$this->getPageNumGroupAlias().' / '.$this->getPageGroupAlias();
		}		
		$this->SetY($cur_y);
		//Print page number
		if ($this->getRTL()) {
			$this->SetX($ormargins['right']);
			$this->Cell(0, 0, $pagenumtxt, 0, 0, 'L');
		} else {
			$this->SetX($ormargins['left']);
			$this->Cell(0, 0, $pagenumtxt, 0, 0, 'R');
		}
	}

}


class gridPdfWrapper {

	private $imgsPath = './imgs/';
	private $noPages = false;
	private $currentRow = 0;

	private $pageWidth;
	private $pageHeight;
	private $offsetTop;
	private $offsetBottom;
	private $offsetLeft;
	private $offsetRight;
	private $cb;
	private $rows;
	private $columns;
	private $rowsNum;

	private $headerHeight;
	private $summaryWidth;
	private $rowHeader;
	private $gridHeight;

	private $orientation;

	private $headerFontSize;
	private $pageFontSize;
	private $gridFontSize;
	
	
	private $bgColor;
	private $lineColor;
	private $headerTextColor;
	private $scaleOneColor;
	private $scaleTwoColor;
	private $gridTextColor;
	private $pageTextColor;
	private $profile;
	private $dpi;

	public function gridPdfWrapper($offsetTop, $offsetRight, $offsetBottom, $offsetLeft, $orientation='P', $fontSize = 8, $dpi = 72, $lang) {
		// pdf-component initialization
		$this->cb = new TCPDFExt($orientation, 'mm', 'A4', true, 'UTF-8', false); 

		$this->orientation = $orientation;
		
		// sets minimal offsets
		$this->minOffsetTop = $offsetTop;
		$this->minOffsetRight = $offsetRight;
		$this->minOffsetBottom = $offsetBottom;
		$this->minOffsetLeft = $offsetLeft;
		
		// sets offsets
		$this->offsetTop = $offsetTop;
		$this->offsetRight = $offsetRight;
		$this->offsetBottom = $offsetBottom;
		$this->offsetLeft = $offsetLeft;
		$this->fontSize = $fontSize;
		$this->dpi = $dpi;

		// calculation page height and width
		$this->pageWidth = $this->cb->getPageWidth() - $this->offsetLeft - $this->offsetRight;
		$this->pageHeight = $this->cb->getPageHeight() - $this->offsetTop - $this->offsetBottom;

		// sets header and footer
		$this->cb->setPrintHeader(false);
		$this->cb->setPrintFooter(true);
		$this->cb->SetMargins($this->offsetLeft, $this->offsetTop, $this->offsetRight);
		$this->cb->SetAutoPageBreak(FALSE, $this->offsetBottom);
		$this->cb->SetFooterMargin($this->offsetBottom);
		$this->cb->setLanguageArray($lang);

		// sets output PDF information
		$this->cb->SetCreator('DHTMLX LTD');
		$this->cb->SetAuthor('DHTMLX LTD');
		$this->cb->SetTitle('dhtmlxGrid');
		$this->cb->SetSubject('DHTMLX LTD');
		$this->cb->SetKeywords('');
		
		// sets font family and size
		$this->cb->SetFont('freesans', '', $this->fontSize);
	}


	// draws grid header
	public function headerDraw($headerHeight, $columns, $summaryWidth, $headerTextColor, $bgColor, $lineColor) {
		$this->columns = $columns;
		$this->bgColor = $this->convertColor($bgColor);
		$this->lineColor = $this->convertColor($lineColor);
		$this->headerTextColor = $this->convertColor($headerTextColor);
		$this->summaryWidth = $summaryWidth;
		$this->lineStyle = Array('width' => 0.1, 'cap' => 'round', 'join' => 'round', 'dash' => '0', 'color' => $this->lineColor);
		$this->cb->SetLineStyle($this->lineStyle);
		$this->cb->SetFillColor($this->bgColor['R'], $this->bgColor['G'], $this->bgColor['B']);
		$this->cb->SetTextColor($this->headerTextColor['R'], $this->headerTextColor['G'], $this->headerTextColor['B']);

		$this->cb->setX($this->offsetLeft);
		$this->cb->setY($this->offsetTop, false);

		// circle for every header row
		for ($i = 0; $i < count($columns); $i++) {
			// circle for every header cell in row
			for ($j = 0; $j < count($columns[$i]) - 1; $j++) {
				// check if cell is not part of colspan cell
				if ($columns[$i][$j]['width'] != 0) {
					// check if cell is not part of rowspan cell
					if (((isset($columns[$i][$j]['rowspanPos']))&&($columns[$i][$j]['rowspanPos'] == 'top'))||(!isset($columns[$i][$j]['rowspanPos']))) {
						// calculation width of cell
						$width = $this->pageWidth*$columns[$i][$j]['width']/$columns[0]['width'];

						// calculation height: if cell hasn't rowspan its height = rowHeight, else its height = rowspan*rowHeight;
						if ($columns[$i][$j]['rowspan'] != '') {
							$height = $columns[$i][$j]['rowspan']*$headerHeight;
						} else {
							$height = $headerHeight;
						}
						// draws header cell
						$this->cb->Cell($width, $height, $columns[$i][$j]['text'], 1, 0, 'C', 1);
					} else {
						// add width of cell that is part of cell with rowspan
						$width = $this->pageWidth*$columns[$i][$j]['width']/$columns[0]['width'];
						$this->cb->setX($this->cb->getX() + $width);
					}
				}
			}
			// sets new row
			$this->cb->setY($this->cb->getY() + $headerHeight);
		}
	}


	// draws grid footer
	public function footerDraw($footerHeight, $columns) {
		$this->footerColumns = $columns;
		$this->footerHeight = $footerHeight;
	}


	private function footerDrawAfterRows() {
		// saving pointer position
		$this->lineStyle = Array('width' => 0.1, 'cap' => 'round', 'join' => 'round', 'dash' => '0', 'color' => $this->lineColor);
		$this->cb->SetLineStyle($this->lineStyle);
		$this->cb->SetFillColor($this->bgColor['R'], $this->bgColor['G'], $this->bgColor['B']);
		$yPos = $this->cb->getPageHeight() - $this->offsetBottom - $this->footerHeight*count($this->footerColumns);

		if ($this->footerColumns) {
			for ($i = 0; $i < count($this->footerColumns); $i++) {
				for ($j = 0; $j < count($this->footerColumns[$i]) - 1; $j++) {
					if (((isset($this->footerColumns[$i][$j]['rowspanPos']))&&($this->footerColumns[$i][$j]['rowspanPos'] == 'top'))||(!isset($this->footerColumns[$i][$j]['rowspanPos']))) {
						// calculation width of cell
						$width = $this->pageWidth*$this->footerColumns[$i][$j]['width']/$this->footerColumns[0]['width'];

						// calculation height: if cell hasn't rowspan its height = rowHeight, else its height = rowspan*rowHeight;
						if ($this->footerColumns[$i][$j]['rowspan'] != '') {
							$height = $this->footerColumns[$i][$j]['rowspan']*$this->footerHeight;
						} else {
							$height = $this->footerHeight;
						}
						if ($width > 0) {
							// draws footer cell
							$this->cb->Cell($width, $height, $this->footerColumns[$i][$j]['text'], 1, 0, 'C', 1);
						}
					} else {
						// add width of cell that is part of cell with rowspan
						$width = $this->pageWidth*$this->footerColumns[$i][$j]['width']/$this->footerColumns[0]['width'];
						$this->cb->setX($this->cb->getX() + $width);
					}
				}
				$this->cb->setY($this->cb->getY() + $this->footerHeight);
			}
		}
	}


	// draws grid values
	public function gridDraw($rowHeight, $rows, $widths, $startRow, $rowsNum, $scaleOneColor, $scaleTwoColor, $profile) {
		$this->rows = $rows;
		$this->rowHeight = $rowHeight;
		$this->scaleOneColor = $this->convertColor($scaleOneColor);
		$this->scaleTwoColor = $this->convertColor($scaleTwoColor);
		$this->profile = $profile;
		$this->widths = $widths;
		
		// calculate the last row for using in circle
		if ($startRow + $rowsNum > count($rows)) {
			$limit = count($rows);
		} else {
			$limit = $startRow + $rowsNum;
		}

		$printedRowsHeight = 0;
		$printedRowsNum = 0;
		$last = '0';
		$limitY = $this->cb->getPageHeight() - $this->offsetBottom - count($this->footerColumns)*$this->footerHeight;
		while (($this->currentRow < count($this->rows))&&($this->cb->getY() + $this->getMaxRowHeight($this->currentRow) <= $limitY)) {
			$height = $this->getMaxRowHeight($this->currentRow);

			// circle for drawing cells
			for ($j = 0; $j < count($this->rows[$this->currentRow]); $j++) {
				// to start next cell from new line or not
				if ($j == count($rows[$this->currentRow]) - 1) {
					$newLn = 1;
				} else {
					$newLn = 0;
				}
				// calculation positions and sizes for cell
				$width = $this->pageWidth*$this->widths[$j]/$this->summaryWidth;
				$xImg = $this->cb->getX();
				$yImg = $this->cb->getY();
				$value = $this->rows[$this->currentRow][$j]['text'];
				if (($this->columns[0][$j]['type'] == 'ch')||($this->columns[0][$j]['type'] == 'ra')||($this->columns[0][$j]['type'] == 'img'))
					$value = '';

				$bg = $this->convertColor($this->rows[$this->currentRow][$j]['bg']);
				$this->cb->SetFillColor($bg['R'], $bg['G'], $bg['B']);
				$text = $this->convertColor($this->rows[$this->currentRow][$j]['textColor']);
				$this->cb->SetTextColor($text['R'], $text['G'], $text['B']);

				$bold = ($this->rows[$this->currentRow][$j]['bold']) ? 'b' : '';
				$italic = ($this->rows[$this->currentRow][$j]['italic']) ? 'i' : '';
				$this->cb->SetFont('freesans'.$bold.$italic, '', $this->fontSize);

				$align = $this->rows[$this->currentRow][$j]['align'];
				if ($align == false)
					$align = (isset($this->columns[0][$j]['align'])) ? $this->columns[0][$j]['align'] : 'center';
				switch ($align) {
					case 'left':
						$align = 'L';
						break;
					case 'right':
						$align = 'R';
						break;
					case 'center':
					default:
						$align = 'C';
						break;
				}
				// draws cell
				$this->cb->MultiCell($width, $height, $value, 1, $align, 1, $newLn, '', '', true, 0);
				$x = $this->cb->getX();
				$y = $this->cb->getY();
				// draws image if cell type is checkbox or radio-button
				if (($this->columns[0][$j]['type'] == 'ch')||($this->columns[0][$j]['type'] == 'ra')) {
					$xImg += $width/2 - 1.5;
					$yImg += 1.7;
					$img = $this->getImg($this->columns[0][$j]['type'], $this->rows[$this->currentRow][$j]['text'], $this->profile);
					$this->cb->Image($img, $xImg, $yImg, 3, 3, 'PNG', '', 'M', false, 96, 'L', false, false, 0, false, false);
					// sets next cell position
					$this->cb->setX($x);
					$this->cb->setY($y, false);
				}
				// draws image if type of cell is 'img'
				if (($this->columns[0][$j]['type'] == 'img')&&((strpos($this->rows[$this->currentRow][$j]['text'], 'http://') === 0)||(file_exists($this->rows[$this->currentRow][$j]['text'])))) {
					$imgSize = getimagesize($this->rows[$this->currentRow][$j]['text']);
					$widthImg = $imgSize[0]/$this->dpi*25.4;
					$heightImg = $imgSize[1]/$this->dpi*25.4;
					
					switch ($align) {
						case 'C':
							$xImg += ($width - $widthImg)/2;
							break;
						case 'R':
							$xImg += ($width - $widthImg - 0.5);
							break;
						case 'L':
							$xImg += 0.5;
							break;
					}
					$this->cb->Image($this->rows[$this->currentRow][$j]['text'], $xImg, $yImg + 0.5, $widthImg, $heightImg, '', '', 'M', false, $this->dpi, 'L', false, false, 0, false, false);
					$this->cb->setX($x);
					$this->cb->setY($y, false);
				}
			}
			$printedRowsHeight += $height;
			$printedRowsNum++;
			$this->currentRow++;
		}
		$this->footerDrawAfterRows();
		return $printedRowsNum;
	}


	// calculates the maximum height of cell in row
	private function getMaxRowHeight($num) {
		// the min height is value setted by user
		$heightMax = $this->rowHeight;
		// circle for every row cell
		for ($j = 0; $j < count($this->rows[$num]); $j++) {
			// calculation width of cell
			$width = $this->pageWidth*$this->widths[$j]/$this->summaryWidth;
			// selecting type of data: img or other
			if ($this->columns[0][$j]['type'] == 'img') {
				// if file exists
				if ((strpos($this->rows[$this->currentRow][$j]['text'], 'http://') === 0)||(file_exists($this->rows[$this->currentRow][$j]['text']))) {
					$imgSize = getimagesize($this->rows[$num][$j]['text']);
					// calculation image size in mm
					$height = $imgSize[1]/$this->dpi*25.4;
				} else {
					// else height will setted as height of row setted by user
					$height = $this->rowHeight;
				}
			} else {
				// else gets number of line, that is nedd for printing text with some width
				$linesNum = $this->cb->getNumLines($this->rows[$num][$j]['text'],$width);
				// calculation cell height
				$height = $linesNum*$this->cb->getFontSize() + $this->cb->getFontSize()*0.5*($linesNum + 1);
			}
			// condition for saving max height
			if ($height > $heightMax) {
				$heightMax = $height;
			}
		}
		return $heightMax + 1;
	}


	// sets offsets
	public function setPageSize($offsetTop, $offsetRight, $offsetBottom, $offsetLeft) {
		$this->offsetTop = $offsetTop + $this->minOffsetTop;
		$this->offsetLeft = $offsetLeft;
		$this->offsetBottom = $offsetBottom + $this->minOffsetBottom;
		$this->offsetRight = $offsetRight;
		$this->pageWidth = $this->cb->getPageWidth() - $this->offsetLeft - $this->offsetRight;
		$this->pageHeight = $this->cb->getPageHeight() - $this->offsetBottom;
		$this->cb->SetMargins($this->offsetLeft, $this->offsetTop, $this->offsetRight);
		$this->cb->SetFooterMargin($this->offsetBottom);
	}


	// outputs PDF in browser
	public function pdfOut() {
		$this->cb->setFooterMargin($this->minOffsetBottom);
		// send PDF-file in browser
		$this->cb->Output('grid.pdf', 'I');
	}


	// forms image name for chackbox or radio-button values
	public function getImg($type, $value, $profile) {
		$img = '';
		if ($type == 'ch') {
			$img .= 'Ch';
		} else {
			$img .= 'Ra';
		}
		if ($value == '1') {
			$img .= 'On';
		} else {
			$img .= 'Off';
		}
		if ($profile == 'color') {
			$img .= 'Color';
		} elseif ($profile == 'gray') {
			$img .= 'Gray';
		} else {
			$img .= 'Bw';
		}
		$img = $this->imgsPath.$img.'.png';
		return $img;
	}


	// draws header image
	public function drawImgHeader($filename) {
		$y = $this->minOffsetTop;
		$headerWidth = $this->cb->getPageWidth() - $this->offsetLeft - $this->offsetRight;
		$headerHeight = $this->offsetTop - $this->minOffsetTop;
		$x = $this->offsetLeft;
		$this->cb->Image($filename, $x, $y, $headerWidth, $headerHeight, 'PNG', '', 'M', false, 96, 'L', false, false, 0, false, false);
	}


	// draws footer image
	public function drawImgFooter($filename, $footerImgHeight) {
		$footerWidth = $this->cb->getPageWidth() - $this->offsetLeft - $this->offsetRight;
		$footerHeight = $this->offsetBottom - $this->minOffsetBottom;
		$footerHeight = $footerImgHeight;
		$x = $this->offsetLeft;
		$y = $this->cb->getPageHeight() - $footerHeight - $this->minOffsetBottom;
		$this->cb->Image($filename, $x, $y, $footerWidth, $footerHeight, 'PNG', '', 'M', false, 96, 'L', false, false, 0, false, false);
	}


	// returns absolute page height in mm
	public function getPageHeight() {
		return $this->cb->getPageHeight();
	}


	// creates new page
	public function addPage() {
		$this->cb->setFooterMargin($this->minOffsetBottom);
		$this->cb->AddPage();
	}

	
	public function setNoPages() {
//		echo 'no pages';
		$this->cb->setPrintFooter(false);
	}


	// converts color from "ffffff" to Array('R' => 255, 'G' => 255, 'B' => 255)
	private function convertColor($colorHex) {
		$colorHex = strtoupper($this->processColorForm($colorHex));
		$final = Array();
		$final['R'] = hexdec(substr($colorHex, 0, 2));
		$final['G'] = hexdec(substr($colorHex, 2, 2));
		$final['B'] = hexdec(substr($colorHex, 4, 2));
		return $final;
	}

	private function processColorForm($color) {
		if ($color == 'transparent') {
			return $color;
		}

		if (preg_match("/#[0-9A-Fa-f]{6}/", $color)) {
			return substr($color, 1);
		}
		if (preg_match("/[0-9A-Fa-f]{6}/", $color)) {
			return $color;
		}
		$color = trim($color);
		$result = preg_match_all("/rgb\s?\(\s?(\d{1,3})\s?,\s?(\d{1,3})\s?,\s?(\d{1,3})\s?\)/", $color, $rgb);

		if ($result) {
			$color = '';
			for ($i = 1; $i <= 3; $i++) {
				$comp = dechex($rgb[$i][0]);
				if (strlen($comp) == 1) {
					$comp = '0'.$comp;
					}
				$color .= $comp;
			}
			return $color;
		} else {
			return 'transparent';
		}
	}

}


?>