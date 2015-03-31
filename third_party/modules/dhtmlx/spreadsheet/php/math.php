<?php

class Math {

	public $num = "\d+(\.\d+)?";
	public $sign = "[\-\+]?";
	public $plus = "[\+]?";
	public $minus = "[\-]";
	public $exception = false;
	public $max = 1E11;

	public function calculate($expr, $inner = false) {
		if ($inner === false)
			$this->exception = false;
		$expr = $this->processBefore($expr);
		$expr = $this->processBrackets($expr);
		if ($this->exception !== false) return $this->exception;
		$expr = $this->processMult($expr);
		if ($this->exception !== false) return $this->exception;
		$expr = $this->processDiv($expr);
		if ($this->exception !== false) return $this->exception;
		$expr = $this->processSub($expr);
		if ($this->exception !== false) return $this->exception;
		$expr = $this->processSum($expr);
		if ($this->exception !== false) return $this->exception;
		$expr = $this->processDblMinus($expr);
		if ($this->exception !== false) return $this->exception;
		$expr = trim($expr);
		if ($this->isNumber($expr)) {
			$expr = $this->toString((float) $expr, $inner ? 20 : 8);
			if ($this->exception !== false)
				return $this->exception;
			else
				return $expr;
		} else {
			if ($this->exception === false) $this->exception = '#SYNTAX_ERROR';
			if ($inner == false)
				return $this->exception;
			else
				return $expr;
		}
	}

	public function processBefore($expr) {
		$expr = strtoupper($expr);
		return $expr;
	}

	public function processBrackets($expr) {
		$regexp = "/([A-Z0-9]+)?\(([^\(\)]*)\)/";
		while(preg_match($regexp, $expr))
			$expr = preg_replace_callback($regexp, Array($this, 'processBracketsCallback'), $expr);
		return $expr;
	}

	public function processBracketsCallback($matches) {
		if (($matches[1] !== "")&&(method_exists($this, $matches[1]))) {
			$args = explode(";", $matches[2]);
			$args_pr = Array();
			for ($i = 0; $i < count($args); $i++)
				if ($args[$i] !== '') {
					$args_pr[] = $this->calculate($args[$i], true);
					if ($this->exception !== false) {
						if ($this->exception === '#SYNTAX_ERROR') {
							$arg = $args_pr[count($args_pr) - 1];
							if (!$this->isNumber($arg))
								$this->exception = '#NOT_A_NUMBER';
							return $this->exception;
						} else
							return $this->exception;
					}
				}
			$result = call_user_func_array(Array($this, $matches[1]), $this->parseArgs($args_pr));
			$result = $this->toString($result);
		} else
			$result = $this->calculate($matches[2], true);
		return $result;
	}

	public function processSum($expr) {
		$regexp = "/({$this->minus}{$this->num}|{$this->num})\s*(\s*\+\s*({$this->minus}{$this->num}|{$this->num}))+/";
		$expr = preg_replace_callback($regexp, Array($this, 'processSumCallback'), $expr);
		return $expr;
	}

	public function processSumCallback($matches) {
		$args = explode("+", $matches[0]);
		for ($i = 0; $i < count($args); $i++)
			$args[$i] = trim($args[$i]);
		$result = call_user_func_array(Array($this, "SUM"), $args);
		$result = $this->toString($result);
		return $result;
	}

	public function processSub($expr) {
		$regexp = "/({$this->minus}{$this->num}|{$this->num})\s*(\s*\-\s*({$this->minus}{$this->num}))+/";
		$expr = preg_replace_callback($regexp, Array($this, 'processSubCallback'), $expr);
		$regexp = "/({$this->minus}{$this->num}|{$this->num})\s*(\s*\-\s*({$this->minus}{$this->num}|{$this->num}))+/";
		$expr = preg_replace_callback($regexp, Array($this, 'processSubCallback'), $expr);
		return $expr;
	}

	public function processSubCallback($matches) {
		$args = explode("-", $matches[0]);
		for ($i = 0; $i < count($args); $i++)
			$args[$i] = trim($args[$i]);
		$result = call_user_func_array(Array($this, "SUB"), $args);
		$result = $this->toString($result);
		return $result;
	}

	public function processMult($expr) {
		$regexp = "/({$this->minus}{$this->num}|{$this->num})\s*(\s*\*\s*({$this->minus}{$this->num}|{$this->num}))+/";
		$expr = preg_replace_callback($regexp, Array($this, 'processMultCallback'), $expr);
		return $expr;
	}

	public function processMultCallback($matches) {
		$args = explode("*", $matches[0]);
		for ($i = 0; $i < count($args); $i++)
			$args[$i] = trim($args[$i]);
		$result = call_user_func_array(Array($this, "MULT"), $args);
		$result = $this->toString($result);
		return $result;
	}

	public function processDiv($expr) {
		$regexp = "/({$this->minus}{$this->num}|{$this->num})\s*(\s*\/\s*({$this->minus}{$this->num}|{$this->num}))+/";
		$expr = preg_replace_callback($regexp, Array($this, 'processDivCallback'), $expr);
		return $expr;
	}

	public function processDivCallback($matches) {
		$args = explode("/", $matches[0]);
		for ($i = 0; $i < count($args); $i++)
			$args[$i] = trim($args[$i]);
		$result = call_user_func_array(Array($this, "DIV"), $args);
		$result = $this->toString($result);
		return $result;
	}

	public function processDblMinus($expr) {
		$regexp = "/\-\-/";
		$expr = preg_replace($regexp, "+", $expr);
		return $expr;
	}

	public function parseArgs($args) {
		if (is_string($args))
			$args = explode(";", $args);
		for ($i = 0; $i < count($args); $i++) {
			if ($args[$i] == "") $args[$i] = "0";
			if ($this->isNumber($args[$i]))
				$args[$i] = (float) $args[$i];
			else
				$this->exception = "#NOT_A_NUMBER";
		}
		return $args;
	}

	public function isNumber($expr) {
		if (is_float($expr)) return true;
		$expr = trim($expr);
		if (strpos($expr, 'INF') !== false) {
			$this->exception = '#INF';
			return false;
		}
		if (preg_match("/^".$this->sign.$this->num."$/", $expr)) return true;
		return false;
	}

	public function toString($expr, $digits = 20) {
		if (abs($expr) >= $this->max) {
			$this->exception = '#TOO_BIG';
			return $this->exception;
		}
		$result = sprintf("%.{$digits}f", $expr);
		if (strpos($result, '.') !== false) {
			$result = preg_replace("/0*$/", "", $result);
			if ($result[strlen($result) - 1] == '.')
				$result = substr($result, 0, strlen($result) - 1);
		}
		if ($result === '-0') $result = '0';
		return $result;
	}

	public function checkArgsNumber($args, $num, $strict = false) {
		if ($strict)
			$result = (count($args) == $num);
		else
			$result = (count($args) >= $num);
		if (!$result) {
			$this->exception = "#ARG_ERROR";
			return false;
		}
		return true;
	}

	public function PI() {
		return M_PI;
	}

	public function SUM() {
		$sum = 0;
		$args = $this->parseArgs(func_get_args());
		if (!$this->checkArgsNumber($args, 1)) return "";
		for($i = 0; $i < count($args); $i++)
			$sum += $args[$i];
		return $sum;
	}

	public function SUB() {
		$args = $this->parseArgs(func_get_args());
		if (!$this->checkArgsNumber($args, 2)) return "";
		$result = (float) $args[0];
		for($i = 1; $i < count($args); $i++)
			$result -= $args[$i];
		return $result;
	}

	public function MULT() {
		$result = 1;
		$args = $this->parseArgs(func_get_args());
		if (!$this->checkArgsNumber($args, 1)) return "";
		for($i = 0; $i < count($args); $i++)
			$result *= $args[$i];
		return $result;
	}

	public function DIV() {
		$args = $this->parseArgs(func_get_args());
		if (!$this->checkArgsNumber($args, 2)) return "";
		$result = $args[0];
		for($i = 1; $i < count($args); $i++) {
			if ($args[$i] == 0) {
				$this->exception = "#INF";
				return "";
			} else
				$result /= $args[$i];
		}
		return $result;
	}

	public function SQRT() {
		$args = func_get_args();
		if (!$this->checkArgsNumber($args, 1, true)) return "";
		if ($args[0] < 0) {
			$this->exception = "#SQRT_FROM_NEGATIVE";
			return "";
		}
		return sqrt($args[0]);
	}

	public function SQR() {
		$args = func_get_args();
		if (!$this->checkArgsNumber($args, 1, true)) return "";
		return pow($args[0], 2);
	}

	public function POW() {
		$args = func_get_args();
		if (!$this->checkArgsNumber($args, 2, true)) return "";
		return pow($args[0], $args[1]);
	}

	public function MOD() {
		$args = func_get_args();
		if (!$this->checkArgsNumber($args, 2, true)) return "";
		if ($args[1] == 0) {
			$this->exception = '#INF';
			return '#INF';
		}
		return $args[0]%$args[1];
	}

	public function ABS() {
		$args = func_get_args();
		if (!$this->checkArgsNumber($args, 1, true)) return "";
		return abs($args[0]);
	}

	public function EXP() {
		$args = func_get_args();
		if (!$this->checkArgsNumber($args, 1, true)) return "";
		return exp($args[0]);
	}

	public function LN() {
		$args = func_get_args();
		if (!$this->checkArgsNumber($args, 1, true)) return "";
		if ($args[0] <= 0) {
			$this->exception = '#ARG_ERROR';
			return "";
		}
		return log($args[0]);
	}

	public function LOG() {
		$args = func_get_args();
		if (!$this->checkArgsNumber($args, 2, true)) return "";
		if ($args[0] <= 0 || $args[1] <= 0 || $args[1] == 1) {
			$this->exception = '#ARG_ERROR';
			return "";
		}
		return log($args[0], $args[1]);
	}

	public function LOG10() {
		$args = func_get_args();
		if (!$this->checkArgsNumber($args, 1, true)) return "";
		if ($args[0] <= 0) {
			$this->exception = '#ARG_ERROR';
			return "";
		}
		return log10($args[0]);
	}

	public function SIN() {
		$args = func_get_args();
		if (!$this->checkArgsNumber($args, 1, true)) return "";
		return sin($args[0]);
	}

	public function COS() {
		$args = func_get_args();
		if (!$this->checkArgsNumber($args, 1, true)) return "";
		return cos($args[0]);
	}

	public function TAN() {
		$args = func_get_args();
		if (!$this->checkArgsNumber($args, 1, true)) return "";
		if ($args[0] == M_PI/2) {
			$this->exception = '#INF';
			return '';
		}
		return tan($args[0]);
	}

	public function ASIN() {
		$args = func_get_args();
		if (!$this->checkArgsNumber($args, 1, true)) return "";
		if ($args[0] < -1 || $args[0] > 1) {
			$this->exception = '#ARG_ERROR';
			return '';
		}
		return asin($args[0]);
	}

	public function ACOS() {
		$args = func_get_args();
		if (!$this->checkArgsNumber($args, 1, true)) return "";
		if ($args[0] < -1 || $args[0] > 1) {
			$this->exception = '#ARG_ERROR';
			return '';
		}
		return acos($args[0]);
	}

	public function ATAN() {
		$args = func_get_args();
		if (!$this->checkArgsNumber($args, 1, true)) return "";
		return atan($args[0]);
	}
}

?>