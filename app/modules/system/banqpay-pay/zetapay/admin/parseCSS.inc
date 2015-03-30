<?
	class CSS{

		# associative array containing css-tags $this->CSS["body"]["background-color"] 
		var $css;

		# array containing all css-tags 
		var $csstags;

		# CSS String
		var $cssstr;

		function CSS() {
			/* Init */
			$this->css="";
			$this->csstags="";
			$this->cssstr="";
		}

		function parseFile($filename)  {
			/* Open File and Parse it */
			$fp=fopen($filename,"r") or die("Error opening file $filename");
			$css_str = fread($fp, filesize ($filename));
			fclose($fp);
			return($this->parse($css_str));
		}

		function parse($css_str) {
			/* Parse CSS to Array */
			$this->cssstr=$css_str;
			$this->css="";
			$this->csstags="";
			$css_str = clean($css_str);
//			$css_str=preg_replace("/[\s]+/","_",$css_str);
//			$css_str=wsstrip( $css_str );
			$css_class = explode("}", $css_str);

			while (list($key,$val) = each ($css_class)){
				$aCSSObj=explode("{",$val);
				$aCSSObj[0] = wsstrip( $aCSSObj[0] );
				if ($aCSSObj[0]) {
					$this->csstags[]=$aCSSObj[0];
	#    			echo "<pre>".$aCSSObj[0]."</pre>\n\n";
					$aCSSObj[1]=preg_replace("/[\s]+/","_",$aCSSObj[1]);
					$a=explode(";",$aCSSObj[1]);
					while(list($key,$val0) = each ($a)){
						if($val0){
	#    	 		   		echo "<pre>\t$key:$val0</pre>\n";		  
							$aCSSSub=explode(":",$val0);
							$aCSSSub[1]=str_replace("_"," ",$aCSSSub[1]);
							$aCSSSub[0]=str_replace("_","",$aCSSSub[0]);
							if($aCSSSub[0]){
								$aCSSItem[$aCSSSub[0]]=wsstrip($aCSSSub[1]);
							}
						}
					}
					$this->css[$aCSSObj[0]]=$aCSSItem;
					unset($aCSSItem);
				}
				if (strstr($aCSSObj[0],",")) {
					/* there is a comma - duplicate tag name and delete original tag */
					$aTags=explode(",",$aCSSObj[0]);
					foreach($aTags as $key0 => $value0) {
						$this->css[$value0]=$this->css[$aCSSObj[0]];
					}
					unset($this->css[$aCSSObj[0]]);
				}				
			} 
			unset($css_str,$css_class,$aCSSSub,$aCSSItem,$aCSSObj);
			return $this->css;
		}

		function buildcss() {
			/* Builds CSS on Base of Array */
			$this->cssstr="";
			foreach($this->css as $key0 => $value0) {
				$this->cssstr .= "$key0 {\n";
				foreach($this->css[$key0] as $key1 => $value1) {
					$this->cssstr .= "\t$key1:$value1;\n";
				}
				$this->cssstr .="}\n";
			}
			return ($this->cssstr);
		}
	}
	function wsstrip($str){
		$str=ereg_replace (' +', ' ', trim($str));
		$str=ereg_replace("[\r\t\n]","",$str);
		$str=trim($str);
		return $str;
	}
	function clean($str){
		$str = str_replace("/*","<script>",$str);
		$str = str_replace("*/","</script>",$str);
		$search = array ("'<script[^>]*?>.*?</script>'si",  // Strip out javascript
						 "'<[\/\!]*?[^<>]*?>'si",           // Strip out html tags
						 "'([\r\n])[\s]+'",                 // Strip out white space
						 "'&(quot|#34);'i",                 // Replace html entities
						 "'&(amp|#38);'i",
						 "'&(lt|#60);'i",
						 "'&(gt|#62);'i",
						 "'&(nbsp|#160);'i",
						 "'&(iexcl|#161);'i",
						 "'&(cent|#162);'i",
						 "'&(pound|#163);'i",
						 "'&(copy|#169);'i",
						 "'&#(\d+);'e");                    // evaluate as php
		$replace = array ("",
						  "",
						  "\\1",
						  "\"",
						  "&",
						  "<",
						  ">",
						  " ",
						  chr(161),
						  chr(162),
						  chr(163),
						  chr(169),
						  "chr(\\1)");
		$text = preg_replace ($search, $replace, $str);
		return $text;
	}
?>