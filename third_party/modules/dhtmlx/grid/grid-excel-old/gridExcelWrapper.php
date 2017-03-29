<?php

error_reporting(0);

require_once './lib/PHPExcel.php';
require_once './lib/PHPExcel/IOFactory.php';

class gridExcelWrapper {
    private $currentRow = 1;
	private $columns;

    public function createXLS($headerFileName, $headerLinesNum, $creator, $lastModifiedBy, $title, $subject, $dsc, $keywords, $category) {
		if ($headerFileName) {
			$this->excel = PHPExcel_IOFactory::load($headerFileName);
		} else {
			$this->excel = new PHPExcel();
		}

		$this->headerLinesNum = $headerLinesNum;
		$this->currentRow += $this->headerLinesNum;
        $this->excel->getProperties()->setCreator($creator)
                ->setLastModifiedBy($lastModifiedBy)
                ->setTitle($title)
                ->setSubject($subject)
                ->setDescription($dsc)
                ->setKeywords($keywords)
                ->setCategory($category);
    }

    public function headerPrint($columns, $widthProp, $headerHeight, $textColor, $headerColor, $lineColor, $headerFontSize, $fontFamily, $without_header = false) {
		$this->textColor = $textColor;
		$this->columns = $columns;
		$this->types = Array();
        for ($i = 0; $i < count($columns); $i++) {
			if ($without_header == false)
				$this->excel->getActiveSheet()->getRowDimension($this->currentRow)->setRowHeight($headerHeight);
			for ($j = 0; $j < count($columns[$i]); $j++) {
				if ($without_header == false) {
					$this->excel->setActiveSheetIndex(0);
					$this->excel->getActiveSheet()->setCellValueByColumnAndRow($j, $this->currentRow, $columns[$i][$j]['text']);
					$this->excel->getActiveSheet()->getColumnDimension($this->getColName($j))->setWidth(($columns[0][$j]['width'])/$widthProp);
					$this->excel->getActiveSheet()->getStyle($this->getColName($j).$this->currentRow)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
					$this->excel->getActiveSheet()->getStyle($this->getColName($j).$this->currentRow)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
					$this->excel->getActiveSheet()->getStyle($this->getColName($j).$this->currentRow)->getFont()->getColor()->setRGB($textColor);
					$this->excel->getActiveSheet()->getStyle($this->getColName($j).$this->currentRow)->getAlignment()->setWrapText(true);
				}
				if (($i == 0)&&(isset($columns[0][$j]))) {
					if ($columns[0][$j]['excel_type'] != "")
						$this->types[$j] = $columns[0][$j]['excel_type'];
					else
						$this->types[$j] = $columns[0][$j]['type'];
				}
			}
			if ($without_header == false)
				$this->currentRow++;
        }
		if ($without_header == false) {
			for ($i = 0; $i < count($columns); $i++) {
				for ($j = 0; $j < count($columns[$i]); $j++) {
					if (isset($columns[$i][$j]['colspan'])) {
						$this->excel->getActiveSheet()->mergeCells($this->getColName($j).($this->headerLinesNum + $i + 1).':'.$this->getColName($j + $this->columns[$i][$j]['colspan'] - 1).($this->headerLinesNum + $i + 1));
					}
					if (isset($columns[$i][$j]['rowspan'])) {
						$this->excel->getActiveSheet()->mergeCells($this->getColName($j).($this->headerLinesNum + $i + 1).':'.$this->getColName($j).($this->headerLinesNum + $i + min($this->columns[$i][$j]['rowspan'], count($this->columns))));
					}
				}
			}
			$styleArray = array(
				'borders' => array(
					'allborders' => array(
						'style' => PHPExcel_Style_Border::BORDER_THIN,
						'color' => array('argb' => $this->processColor($lineColor)),
					),
				),
				'fill' => array(
					'type' => PHPExcel_Style_Fill::FILL_SOLID,
					'rotation' => 90,
					'startcolor' => array(
						'argb' => $this->processColor($headerColor)
					)
				),
				'font' => array(
					'bold' => true,
					'name' => $fontFamily,
					'size' => $headerFontSize
				)
			);
			$this->excel->getActiveSheet()->getStyle(($this->getColName(0).($this->headerLinesNum + 1).':'.$this->getColName(count($columns[0]) - 1).($this->headerLinesNum + $this->currentRow - 1)))->applyFromArray($styleArray);
			$this->excel->getActiveSheet()->freezePane("A".($this->headerLinesNum + count($columns) + 1));
		}
    }


    public function rowPrint($row, $rowHeight, $lineColor, $gridFontSize, $fontFamily) {
        $this->excel->getActiveSheet()->getRowDimension($this->currentRow)->setRowHeight($rowHeight);
		$styleArray = array(
			'borders' => array(
				'allborders' => array(
					'style' => PHPExcel_Style_Border::BORDER_THIN,
					'color' => array('argb' => $this->processColor($lineColor)),
				),
			),
			'fill' => array(
				'type' => PHPExcel_Style_Fill::FILL_SOLID,
				'rotation' => 90
			),
			'font' => array(
				'bold' => false,
				'name' => $fontFamily,
				'size' => $gridFontSize,
				'color'=> Array('rgb'=> $this->processColor($this->textColor))
			)
		);
		$this->excel->getActiveSheet()->getStyle(($this->getColName(0).$this->currentRow.':'.$this->getColName(count($row) - 1).$this->currentRow))->applyFromArray($styleArray);

        for ($i = 0; $i < count($row); $i++) {
			if ($i >= count($this->types)) continue;

			$this->excel->getActiveSheet()->getStyle(($this->getColName($i).$this->currentRow.':'.$this->getColName($i).$this->currentRow))->applyFromArray($styleArray);

			$styleArray['font']['bold'] = $row[$i]['bold'];
			$styleArray['font']['italic'] = $row[$i]['italic'];

            $this->excel->setActiveSheetIndex(0);
			$text = $row[$i]['text'];
			if ((isset($this->columns[0][$i]['type']))&&(($this->columns[0][$i]['type'] == 'ch')||($this->columns[0][$i]['type'] == 'ra'))) {
				if ($text == '1') {
					$text = 'Yes';
				} else {
					$text = 'No';
				}
			}

			switch (strtolower($this->types[$i])) {
				case 'string':
				case 'str':
				case 'txt':
				case 'edtxt':
				case 'rotxt':
				case 'ro':
				case 'co':
				case 'coro':
					$this->excel->getActiveSheet()->getCell($this->getColName($i).$this->currentRow)->setValueExplicit($text, PHPExcel_Cell_DataType::TYPE_STRING);
					break;
				case 'number':
				case 'num':
				case 'edn':
				case 'ron':
					$text = str_replace(",", ".", $text);
					$this->excel->getActiveSheet()->getCell($this->getColName($i).$this->currentRow)->setValueExplicit($text, PHPExcel_Cell_DataType::TYPE_NUMERIC);
					break;
				case 'boolean':
				case 'bool':
					$this->excel->getActiveSheet()->getCell($this->getColName($i).$this->currentRow)->setValueExplicit($text, PHPExcel_Cell_DataType::TYPE_BOOL);
					break;
				case 'formula':
					$this->excel->getActiveSheet()->getCell($this->getColName($i).$this->currentRow)->setValueExplicit($text, PHPExcel_Cell_DataType::TYPE_FORMULA);
					break;
				case 'date':
					$this->excel->getActiveSheet()->setCellValueByColumnAndRow($i, $this->currentRow, $text);
					$this->excel->getActiveSheet()->getStyle($this->getColName($i).$this->currentRow)->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_DATE_YYYYMMDD2);
					break;
				default:
					$this->excel->getActiveSheet()->setCellValueByColumnAndRow($i, $this->currentRow, $text);
					break;
			}
			$this->excel->getActiveSheet()->getStyle($this->getColName($i).$this->currentRow)->getFill()->getStartColor()->setRGB($this->getRGB($row[$i]['bg']));
			$this->excel->getActiveSheet()->getStyle($this->getColName($i).$this->currentRow)->getFont()->getColor()->setRGB($this->getRGB($row[$i]['textColor']));
			$this->excel->getActiveSheet()->getStyle($this->getColName($i).$this->currentRow)->getFont()->getColor()->setRGB($this->getRGB($row[$i]['textColor']));
			$align = $row[$i]['align'];
			if ($align == false) $align = $this->columns[0][$i]['align'];
			$this->excel->getActiveSheet()->getStyle($this->getColName($i).$this->currentRow)->getAlignment()->setHorizontal($align);
			$this->excel->getActiveSheet()->getStyle($this->getColName($i).$this->currentRow)->getAlignment()->setWrapText(true);
        }

		$this->currentRow++;
	}


	public function footerPrint($columns, $headerHeight, $textColor, $headerColor, $lineColor, $headerFontSize, $fontFamily) {
		$this->footerColumns = $columns;
		if (count($columns) == 0)
			return false;
        for ($i = 0; $i < count($columns); $i++) {
			$this->excel->getActiveSheet()->getRowDimension($this->currentRow)->setRowHeight($headerHeight);
			for ($j = 0; $j < count($columns[$i]); $j++) {
				$this->excel->setActiveSheetIndex(0);
				$this->excel->getActiveSheet()->setCellValueByColumnAndRow($j, $this->currentRow, $columns[$i][$j]['text']);
				$this->excel->getActiveSheet()->getStyle($this->getColName($j).$this->currentRow)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
				$this->excel->getActiveSheet()->getStyle($this->getColName($j).$this->currentRow)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
				$this->excel->getActiveSheet()->getStyle($this->getColName($j).$this->currentRow)->getFont()->getColor()->setRGB($textColor);
			}
			$this->currentRow++;
        }
		$cr = $this->currentRow - count($columns);
		for ($i = 0; $i < count($columns); $i++) {
			for ($j = 0; $j < count($columns[$i]); $j++) {
				if (isset($columns[$i][$j]['colspan'])) {
					$this->excel->getActiveSheet()->mergeCells($this->getColName($j).($cr + $i).':'.$this->getColName($j + $columns[$i][$j]['colspan'] - 1).($cr + $i));
				}
				if (isset($columns[$i][$j]['rowspan'])) {
					$this->excel->getActiveSheet()->mergeCells($this->getColName($j).($cr + $i).':'.$this->getColName($j).($cr + $i - 1 + $columns[$i][$j]['rowspan']));
				}
			}
		}
        $styleArray = array(
            'borders' => array(
                'allborders' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array('argb' => $this->processColor($lineColor)),
                ),
            ),
            'fill' => array(
                'type' => PHPExcel_Style_Fill::FILL_SOLID,
                'rotation' => 90,
                'startcolor' => array(
                    'argb' => $this->processColor($headerColor)
                )
            ),
			'font' => array(
				'bold' => true,
				'name' => $fontFamily,
				'size' => $headerFontSize
			)
        );
		$this->excel->getActiveSheet()->getStyle(($this->getColName(0).($this->currentRow - count($columns)).':'.$this->getColName(count($columns[0]) - 1).($this->currentRow - 1)))->applyFromArray($styleArray);
	}


	public function outXLS($title, $type = 'Excel2007') {
		$this->excel->getActiveSheet()->setTitle($title);
		$this->excel->setActiveSheetIndex(0);

		switch (strtolower($type)) {
			case 'excel2003':
				$objWriter = PHPExcel_IOFactory::createWriter($this->excel, 'Excel5');
				header('Content-Type: application/vnd.ms-excel');
				header('Content-Disposition: attachment;filename="grid.xls"');
				header('Cache-Control: max-age=0');
				break;
			case 'csv':
				$objWriter = PHPExcel_IOFactory::createWriter($this->excel, 'CSV');
				$objWriter->setDelimiter(';');
				header("Content-type: application/csv");
				header("Content-Disposition: attachment; filename=grid.csv");
				header("Pragma: no-cache");
				header("Expires: 0");
				break;
			case 'excel2007':
			default:
				$objWriter = PHPExcel_IOFactory::createWriter($this->excel, 'Excel2007');
				header('Content-Type: application/xlsx');
				header('Content-Disposition: attachment;filename="grid.xlsx"');
				header('Cache-Control: max-age=0');
				break;
		}
		$objWriter->save('php://output'); 
	}


	public function headerDraw($img) {

	}


	public function footerDraw($img) {

	}

	private function getColName($index) {
		$index++;
		$letters = Array("A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z");
		$name = '';
		$ind = $index;
		$ready = false;
		$ch = "";
		$length = count($letters);
		while (!$ready) {
			$rest = floor($index/$length);
			$c = $index - $rest*$length;
			$index = floor($index/$length);
			$c--;
			if ($c == -1) {
				$c = $length - 1;
				$index--;
			}
			$ch = $c + $ch;
			$name = $letters[$c].$name;
			if ($index <= 0)
				$ready = true;
		}
		return $name;
	}


    private function processColor($color) {
		$color = $this->processColorForm($color);
//        if (!preg_match('/[0-9A-F]{6}/i', $color)) {
//            return false;
//        } else {
		if ($color != 'transparent') {
			return "FF".strToUpper($color);
		} else {
			return false;
		}
            
//        }
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

	private function getRGB($color) {
		$color = $this->processColorForm($color);
		if ($color == 'transparent') {
			return false;
		} else {
			return $color;
		}
	}
}

?>