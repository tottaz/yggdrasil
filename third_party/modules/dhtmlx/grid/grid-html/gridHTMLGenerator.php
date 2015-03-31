<?php

class gridHTMLGenerator {

	public $strip_tags = true;
	public $fontSize = false;
	public $fontFamily = 'TimesNewRoman';
	protected $headerCols = Array();
	protected $footerCols = Array();

	public function printGrid($xml) {
		if (isset($_GET['fontsize']))
			$this->fontSize = $_GET['fontsize'];
		$this->setProfile();
		$this->renderStart();
		$this->headerParse($xml->head);
		$this->renderHeader($this->headerCols);

		$this->renderRows($xml->row);

		$this->footerParse($xml->foot);
		$this->renderFooter($this->footerCols);
		$this->renderEnd();
//		$this->printGridExcel();
	}


	private function setProfile($profile = 'color') {
		switch ($profile) {
			case 'color':
				$this->bgColor = 'D1E5FE';
				$this->lineColor = 'A4BED4';
				$this->scaleOneColor = 'FFFFFF';
				$this->scaleTwoColor = 'E3EFFF';
				$this->textColor = '000000';
				break;
			case 'gray':
				$this->bgColor = 'E3E3E3';
				$this->lineColor = 'B8B8B8';
				$this->scaleOneColor = 'FFFFFF';
				$this->scaleTwoColor = 'EDEDED';
				$this->textColor = '000000';
				break;
			case 'bw':
				$this->bgColor = 'FFFFFF';
				$this->lineColor = '000000';
				$this->scaleOneColor = 'FFFFFF';
				$this->scaleTwoColor = 'FFFFFF';
				$this->textColor = '000000';
				break;
		}
	}


	private function mainParse($xml) {
		$this->profile = (string) $xml->attributes()->profile;
		$this->setProfile();
		if (!file_exists($this->headerFileName)) {
			$this->headerLinesNum = 0;
			$this->headerFileName = false;
		}
		if (isset($xml->attributes()->without_header))
			$this->without_header = true;
	}

	private function headerParse($header) {
		if (isset($header->column)) {
			$columns = Array($header->column);
		} else {
			$columns = $header->columns;
		}
		foreach ($columns as $row) {
			$cols = Array();
			foreach ($row as $column) {
				$hidden = ($column->attributes()->hidden == 'true') ? true : false;
				if ($hidden == true) {
					$this->hiddenCols[$k] = true;
					continue;
				}
				$col = $this->strip(trim((string) $column));
				$cols[] = $col;
			}
			$this->headerCols[] = $cols;
		}
	}
	
	
	private function renderStart() {
		header("Content-type: application/vnd.ms-excel; charset=UTF-8");
		header("Content-Disposition: attachment;filename=grid.xls");
		header("Cache-Control: max-age=0");
		
		echo "<html><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"><body>";
		echo "<style>";

		$fontsize = ($this->fontSize == false) ? "" : "font-size: ".$this->fontSize."pt;";
		$fontsize .= "font-family: '".$this->fontFamily."';";
		$header_css = "background-color: #".$this->bgColor."; border:.5pt solid #".$this->lineColor.";".$fontsize;
		$cell_odd_css = "background-color: #".$this->scaleOneColor."; border:.5pt solid #".$this->lineColor.";".$fontsize;
		$cell_even_css = "background-color: #".$this->scaleTwoColor."; border:.5pt solid #".$this->lineColor.";".$fontsize;
		$footer_css = "background-color: #".$this->bgColor."; border:.5pt solid #".$this->lineColor.";".$fontsize;

		echo ".header { height: 30pt; vertical-align: middle; text-align: center; ".$header_css." }";
		echo ".cell_odd { height: 20pt; vertical-align: middle; ".$cell_odd_css." }";
		echo ".cell_even { height: 20pt; vertical-align: middle; ".$cell_even_css."}";
		echo ".footer { height: 30pt; vertical-align: middle; text-align: center; ".$footer_css." }";
		echo "</style>";
		if ($this->fontSize != false)
			echo "<style>.format { font-size: ".$this->fontSize."pt; }</style>";
		
		echo "<table>";
	}

	private function renderEnd() {
		echo "</table></body></html>";
	}
	
	private function renderHeader($cols) {
		for ($i = 0; $i < count($cols); $i++) {
			echo "<tr>";
			for ($j = 0; $j < count($cols[$i]); $j++) {
				echo "<td class=\"header\">{$cols[$i][$j]}</td>";
			}
			echo "</tr>\n";
		}
		
	}


	private function footerParse($footer) {
		if (isset($footer->columns)) {
			$columns = $footer->columns;
			foreach ($columns as $row) {
				$cols = Array();
				foreach ($row as $column) {
					$col = $this->strip(trim((string) $column));
					$cols[] = $col;
				}
				$this->footerCols[] = $cols;
			}
		}
	}
	
	
	private function renderFooter($cols) {
		for ($i = 0; $i < count($cols); $i++) {
			echo "<tr>";
			for ($j = 0; $j < count($cols[$i]); $j++) {
				echo "<td class=\"footer\">{$cols[$i][$j]}</td>";
			}
			echo "</tr>\n";
		}
		
	}

	
	private function renderRows($rows) {
		$i = 0;
		foreach ($rows as $row) {
			echo "<tr>";
			$className = ($i%2 == 0) ? "cell_even" : "cell_odd";
			$j = 0;
			foreach ($row as $cell) {
				$text = $this->strip(trim((string) $cell));
				echo "<td class=\"{$className}\">{$text}</td>";
				$j++;
			}
			echo "</tr>";
			$i++;
		}
	}

	private function rowsParse($rows) {
		$i = 0;
		foreach ($rows as $row) {
			$rowArr = Array();
			$cellColors = Array();
			$cells = $row->cell;
			$k = 0;
			foreach ($cells as $cell) {
				if (isset($this->hiddenCols[$k])) {
					$k++;
					continue;
				}
				$cell_p = Array();
				if (isset($this->coll_options[$k][trim((string) $cell)]))
					$cell_p['text'] = $this->strip($this->coll_options[$k][trim((string) $cell)]);
				else
					$cell_p['text'] = $this->strip(trim((string) $cell));

				if (isset($cell->attributes()->bgColor)) {
					$cell_p['bg'] = (string) $cell->attributes()->bgColor;
				} else {
					$color = ($i%2 == 0) ? $this->scaleOneColor : $this->scaleTwoColor;
					$cell_p['bg'] = $color;
				}
				if (isset($cell->attributes()->textColor)) {
					$cell_p['textColor'] = (string) $cell->attributes()->textColor;
				} else {
					$cell_p['textColor'] = $this->textColor;
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

	private function strip($param) {
		if ($this->strip_tags == true) {
			$param = strip_tags($param);
		}
		return $param;
	}

}

?>