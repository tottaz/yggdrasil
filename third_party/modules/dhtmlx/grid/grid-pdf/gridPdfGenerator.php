<?php

class gridPdfGenerator {

	public $minOffsetTop = 10;
	public $minOffsetBottom = 10;
	public $minOffsetLeft = 10;
	public $minOffsetRight = 10;
	public $headerHeight = 7;
	public $rowHeight = 5;
	public $minColumnWidth = 13;
	public $pageNumberHeight = 10;
	public $fontSize = 8;
	public $dpi = 96;
	public $strip_tags = false;

	public $bgColor = 'D1E5FE';
	public $lineColor = 'A4BED4';
	public $headerTextColor = '000000';
	public $scaleOneColor = 'FFFFFF';
	public $scaleTwoColor = 'E3EFFF';
	public $gridTextColor = '000000';
	public $pageTextColor = '000000';

	public $footerImgHeight = 50;
	public $headerImgHeight = 50;
	public $lang = Array('a_meta_charset' => 'UTF-8', 'a_meta_dir' => 'ltr', 'a_meta_language' => 'en', 'w_page' => 'Page');

	private $orientation = 'P';
	private $columns = Array();
	private $rows = Array();
	private $summaryWidth;
	private $profile;
	private $header = false;
	private $footer = false;
	private $headerFile;
	private $footerFile;
	private $pageHeader = false;
	private $pageFooter = false;
	private $coll_options = Array();
	private $hiddenCols = Array();

	// print grid
	public function printGrid($xml) {
		$this->headerParse($xml->head);
		$this->footerParse($xml->foot);
		$this->mainParse($xml);
		$this->collectionsParse($xml->coll_options);
		$this->rowsParse($xml->row);
		$this->printGridPdf();
	}
	
	
	// sets colors according profile
	private function setProfile() {
		switch ($this->profile) {
			case 'color':
				$this->bgColor = 'D1E5FE';
				$this->lineColor = 'A4BED4';
				$this->headerTextColor = '000000';
				$this->scaleOneColor = 'FFFFFF';
				$this->scaleTwoColor = 'E3EFFF';
				$this->gridTextColor = '000000';
				$this->pageTextColor = '000000';
				break;
			case 'gray':
				$this->bgColor = 'E3E3E3';
				$this->lineColor = 'B8B8B8';
				$this->headerTextColor = '000000';
				$this->scaleOneColor = 'FFFFFF';
				$this->scaleTwoColor = 'EDEDED';
				$this->gridTextColor = '000000';
				$this->pageTextColor = '000000';
				break;
			case 'bw':
				$this->bgColor = 'FFFFFF';
				$this->lineColor = '000000';
				$this->headerTextColor = '000000';
				$this->scaleOneColor = 'FFFFFF';
				$this->scaleTwoColor = 'FFFFFF';
				$this->gridTextColor = '000000';
				$this->pageTextColor = '000000';
				break;
		}
	}


	// parses main settings
	private function mainParse($xml) {
		$this->profile = (string) $xml->attributes()->profile;
		if ($xml->attributes()->header) {
			$this->header = (string) $xml->attributes()->header;
		}
		if ($xml->attributes()->footer) {
			$this->footer = (string) $xml->attributes()->footer;
		}
		if ($xml->attributes()->pageheader) {
			$this->pageHeader = (string) $xml->attributes()->pageheader;
		}
		if ($xml->attributes()->pagefooter) {
			$this->pageFooter = $xml->attributes()->pagefooter;
		}

		if (100/count($this->widths) < $this->minColumnWidth) {
			$this->orientation = 'L';
		}

		if ($xml->attributes()->orientation) {
			if ($xml->attributes()->orientation == 'landscape') {
				$this->orientation = 'L';
			} else {
				$this->orientation = 'P';
			}
		}
		$this->setProfile();
	}


	// parses grid header
	private function headerParse($header) {
		if (isset($header->column)) {
			$columnsRows = Array($header->column);
		} else {
			$columnsRows = $header->columns;
		}
		$i = 0;
		foreach ($columnsRows as $columns) {
			$summaryWidth = 0;
			$k = 0;

			foreach ($columns as $column) {
				$columnArr = Array();
				$columnArr['hidden'] = ($column->attributes()->hidden == 'true') ? true : false;
				if ($columnArr['hidden'] == true) {
					$this->hiddenCols[$k] = true;
					$k++;
					continue;
				}
				if ($this->strip_tags == true) {
					$columnArr['text'] = strip_tags(trim((string) $column));
				} else {
					$columnArr['text'] = trim((string) $column);
				}
				$columnArr['width'] = trim((string) $column->attributes()->width);
				$columnArr['type'] = trim((string) $column->attributes()->type);
				$columnArr['align'] = trim((string) $column->attributes()->align);
				$columnArr['colspan'] = trim((string) $column->attributes()->colspan);
				$columnArr['rowspan'] = trim((string) $column->attributes()->rowspan);
				$summaryWidth += $columnArr['width'];
				$this->columns[$i][] = $columnArr;
				if ($i == 0) {
					$widths[] = $columnArr['width'];
				}
				if ($columnArr['colspan'] != '') {
					$columnArr['width'] = 0;
				}
				$k++;
			}
			$this->columns[$i]['width'] = $summaryWidth;
			if ($i == 0) {
				$this->summaryWidth = $summaryWidth;
			}
			$i++;
		}

		for ($i = 0; $i < count($this->columns); $i++) {
			$offset = 0;
			for ($j = 0; $j < count($widths); $j++) {
				if ($this->columns[$i][$j]['colspan'] != '') {
					$w = $widths[$j];
					for ($k = 1; $k < $this->columns[$i][$j]['colspan']; $k++) {
						$w += $widths[$j + $k];
						$this->columns[$i][$j + $k]['width'] = 0;
					}
					$this->columns[$i][$j]['width'] = $w;
					$j += $this->columns[$i][$j]['colspan'] - 1;
				} else {
					$this->columns[$i][$j]['width'] = $widths[$j];
				}
			}
		}

		for ($i = 0; $i < count($this->columns); $i++) {
			for ($j = 0; $j < count($widths); $j++) {
				if ((isset($this->columns[$i][$j]))&&($this->columns[$i][$j]['rowspan'] != '')&&(!isset($this->columns[$i][$j]['rowspanPos']))) {
					for ($k = 1; $k < $this->columns[$i][$j]['rowspan']; $k++) {
						$this->columns[$i + $k][$j]['rowspanPos'] = $this->columns[$i][$j]['rowspan'] - $k;
						$this->columns[$i + $k][$j]['rowspan'] = $this->columns[$i][$j]['rowspan'];
					}
					$this->columns[$i][$j]['rowspanPos'] = 'top';
				}
			}
		}
		$this->widths = $widths;
	}


	// parses grid footer
	private function footerParse($footer) {
		if (isset($footer->columns)) {
			$this->footerColumns = Array();
			$columnsRows = $footer->columns;
			$i = 0;
			foreach ($columnsRows as $columns) {
				$summaryWidth = 0;
				$j = 0;
				foreach ($columns as $column) {
					$columnArr = Array();
					if ($this->strip_tags == true) {
						$columnArr['text'] = strip_tags(trim((string) $column));
					} else {
						$columnArr['text'] = trim((string) $column);
					}
					$columnArr['width'] = isset($this->columns[0][$j]['width']) ? $this->columns[0][$j]['width'] : 1;
					$columnArr['type'] = trim((string) $column->attributes()->type);
					$columnArr['align'] = trim((string) $column->attributes()->align);
					$columnArr['colspan'] = trim((string) $column->attributes()->colspan);
					$columnArr['rowspan'] = trim((string) $column->attributes()->rowspan);
					$summaryWidth += $columnArr['width'];
					$this->footerColumns[$i][] = $columnArr;
					if ($columnArr['colspan'] != '') {
						$columnArr['width'] = 0;
					}
					$j++;
				}
				$this->footerColumns[$i]['width'] = $summaryWidth;
				$i++;
			}

			for ($i = 0; $i < count($this->footerColumns); $i++) {
				$offset = 0;
				for ($j = 0; $j < count($this->widths); $j++) {
					if ($this->footerColumns[$i][$j]['colspan'] != '') {
						$w = $this->widths[$j];
						for ($k = 1; $k < $this->footerColumns[$i][$j]['colspan']; $k++) {
							$w += $this->widths[$j + $k];
							$this->footerColumns[$i][$j + $k]['width'] = 0;
						}
						$this->footerColumns[$i][$j]['width'] = $w;
						$j += $this->footerColumns[$i][$j]['colspan'] - 1;
					} else {
						$this->footerColumns[$i][$j]['width'] = $this->widths[$j];
					}
				}
			}

			for ($i = 0; $i < count($this->footerColumns); $i++) {
				for ($j = 0; $j < count($this->widths); $j++) {
					if (($this->footerColumns[$i][$j]['rowspan'] != '')&&(!isset($this->footerColumns[$i][$j]['rowspanPos']))) {
						for ($k = 1; $k < $this->footerColumns[$i][$j]['rowspan']; $k++) {
							$this->footerColumns[$i + $k][$j]['rowspanPos'] = $this->footerColumns[$i][$j]['rowspan'] - $k;
							$this->footerColumns[$i + $k][$j]['rowspan'] = $this->footerColumns[$i][$j]['rowspan'];
						}
						$this->footerColumns[$i][$j]['rowspanPos'] = 'top';
					}
				}
			}
 
		} else {
			$this->footerColumns = false;
		}
	}


	private function collectionsParse($coll_options) {
		for ($i = 0; $i < count($coll_options); $i++) {
			$index = (int) $coll_options[$i]->attributes()->for;
			$this->coll_options[$index] = Array();
			for ($j = 0; $j < count($coll_options[$i]->item); $j++) {
				$item = $coll_options[$i]->item[$j];
				$value = (string) $item->attributes()->value;
				$label = (string) $item->attributes()->label;
				$this->coll_options[$index][$value] = $label;
			}
		}
	}


	// parses rows
	private function rowsParse($rows) {
		$i = 0;
		foreach ($rows as $row) {
			$rowArr = Array();
			$cells = $row->cell;
			$k = 0;
			foreach ($cells as $cell) {
				if (isset($this->hiddenCols[$k])) {
					$k++;
					continue;
				}
				$cell_p = Array();
				if ($this->strip_tags == true) {
					if (isset($this->coll_options[$k][trim((string) $cell)]))
						$cell_p['text'] = strip_tags($this->coll_options[$k][trim((string) $cell)]);
					else
						$cell_p['text'] = strip_tags(trim((string) $cell));
				} else {
					if (isset($this->coll_options[$k][trim((string) $cell)]))
						$cell_p['text'] = $this->coll_options[$k][trim((string) $cell)];
					else
						$cell_p['text'] = trim((string) $cell);
				}
				if (isset($cell->attributes()->bgColor)) {
					$cell_p['bg'] = (string) $cell->attributes()->bgColor;
				} else {
					$color = ($i%2 == 0) ? $this->scaleOneColor : $this->scaleTwoColor;
					$cell_p['bg'] = $color;
				}
				if (isset($cell->attributes()->textColor)) {
					$cell_p['textColor'] = (string) $cell->attributes()->textColor;
				} else {
					$cell_p['textColor'] = $this->gridTextColor;
				}
				$cell_p['bold'] = (isset($cell->attributes()->bold) && $cell->attributes()->bold == 'bold') ? true : false;
				$cell_p['italic'] = (isset($cell->attributes()->italic) && $cell->attributes()->italic == 'italic') ? true : false;
				$cell_p['align'] = isset($cell->attributes()->align) ? $cell->attributes()->align : false;
				$rowArr[] = $cell_p;
				$k++;
			}
			$this->rows[] = $rowArr;
			$i++;
		}
	}


	// returns header image name
	private function headerImgInit() {
		if (file_exists('./header.png')) {
			$this->headerFile = './header.png';
			return true;
		}
		$this->header = false;
		$this->pageHeader = false;
		return false;
	}


	// returns footer image name
	private function footerImgInit() {
		if (file_exists('./footer.png')) {
			$this->footerFile = './footer.png';
			return true;
		}
		$this->footer = false;
		$this->pageFooter = false;
		return false;
	}


	public function printGridPdf() {
		if (($this->header)||($this->pageHeader)) {
			$this->headerImgInit();
		}
		if (($this->footer)||($this->pageFooter)) {
			$this->footerImgInit();
		}

		// initials PDF-wrapper
		$this->wrapper = new gridPdfWrapper($this->minOffsetTop, $this->minOffsetRight, $this->minOffsetBottom, $this->minOffsetLeft, $this->orientation, $this->fontSize, $this->dpi, $this->lang);
		
		// checking if document will have one page
		$pageHeight = $this->wrapper->getPageHeight() - $this->minOffsetTop - $this->minOffsetBottom;
		if (($this->header)||($this->pageHeader)) {
			$pageHeight -= $this->headerImgHeight;
		}
		if (($this->footer)||($this->pageFooter)) {
			$pageHeight -= $this->footerImgHeight;
		}
		$numRows = floor(($pageHeight - $this->headerHeight)/$this->rowHeight);
		// denies page numbers if dpcument have one page
		if ($numRows >= count($this->rows)) {
			$this->wrapper->setNoPages();
		}
		
		$rows = Array();
		$pageNumber = 1;
		$startRow = 0;
		// circle for printing all pages
		while ($startRow < count($this->rows)) {
			$numRows = $this->printGridPage($startRow, $pageNumber);
			$startRow += $numRows;
			if ($numRows == 0) $startRow++;
			$pageNumber++;
		}
		
		// outputs PDF in browser
		$this->wrapper->pdfOut();
	}


	// prints one page
	private function printGridPage($startRow, $pageNumber) {
		// adds new page
		$this->wrapper->addPage();
	
		// calculates top offset
		if ((($this->header)&&($pageNumber == 1))||($this->pageHeader)) {
			$offsetTop = $this->headerImgHeight;
		} else {
			$offsetTop = 0;
		}

		// calculates bottom offset
		if ($this->pageFooter) {
			$offsetBottom = $this->footerImgHeight;
		} else {
			$offsetBottom = 0;
		}

		// calculates page height without top and bottom offsets
		$pageHeight = $this->wrapper->getPageHeight() - $offsetTop - $offsetBottom - $this->minOffsetTop - $this->minOffsetTop;
		// calculates rows number on current page
		$numRows = floor(($pageHeight - $this->headerHeight*count($this->columns) - $this->headerHeight*count($this->footerColumns))/$this->rowHeight);
		// check if it's last page
		$lastPage = ((count($this->rows) - $startRow) <= $numRows);

		// prints footer if needs
//		if (($this->footer)&&($lastPage)) {
//			$offsetBottom = $this->footerImgHeight;
//		}

		$offsetRight = $this->minOffsetRight;
		$offsetLeft = $this->minOffsetLeft;
		// sets page offsets
		$this->wrapper->setPageSize($offsetTop, $offsetRight, $offsetBottom, $offsetLeft);

		// prints grid header
		$this->wrapper->headerDraw($this->headerHeight, $this->columns, $this->summaryWidth, $this->headerTextColor, $this->bgColor, $this->lineColor);
		// prints grid footer
		$this->wrapper->footerDraw($this->headerHeight, $this->footerColumns);
		// prints grid values
		$rowsNum = $this->wrapper->gridDraw($this->rowHeight, $this->rows, $this->widths, $startRow, $numRows, $this->scaleOneColor, $this->scaleTwoColor, $this->profile);

		// prints footer if needs
		if (($this->pageFooter)||((count($this->rows) <= $startRow + $rowsNum)&&($this->footer))) {
			$this->wrapper->drawImgFooter($this->footerFile, $this->footerImgHeight);
		}

		// prints header if needs
		if ((($this->header)&&($pageNumber == 1))||($this->pageHeader)) {
			$this->wrapper->drawImgHeader($this->headerFile, $this->headerImgHeight);
		}
		// returns number of printed rows ;
		return $rowsNum;
	}
}


?>