<?php
/**
 * mb_stripos all occurences
 * based on http://www.php.net/manual/en/function.strpos.php#87061
 *
 * Find all occurrences of a needle in a haystack
 *
 * @param string $haystack
 * @param string $needle
 * @return array or false
*/
class Analysis {
		var $minlength=3;
		var $minoc=2;

		function getHost($url) {

			$handle = fopen($url, "r");
			if($handle)
			{
				$contents = '';
				while (!feof($handle)) {$contents .= fread($handle, 8192);}
				return $contents;
			}
			else return false;	
		}
		//parse tags function (extracting title,description , keywords of the page)
	
		function _parseTags($page) {
			//$page=strtolower($page);
			//echo "<br>".$page;

		    $title = $description = $keywords = '';
		    if (preg_match('/<title>(.*)<\/title>/i',$page,$ar)) 
				$title = $ar[1];
			else
			{
				$title=$this->ExtractString(strtolower($page),'<title>','</title>');
			}
			
		    if (preg_match('/<meta name="description" content="(.*)"/i',$page,$ar)) 
			{				 
				$description = $ar[1];
				//echo "<br>in if:";
			}
			else
			{
				$description=$this->ExtractString(strtolower($page),'<meta http-equiv="description" content="','"');
				if($description =="")
					$description=$this->ExtractString(strtolower($page),'<meta name="description" content="','"');		
				//echo "<br>in else if:";
			}
			
			
			
			if (preg_match('/<meta name="keywords" content="(.*)"/i',$page,$ar)) 
				$keywords = $ar[1];
			else
			{
				$keywords=$this->ExtractString(strtolower($page),'<meta http-equiv="keywords" content="','"');
				if($keywords == "")
					$keywords=$this->ExtractString(strtolower($page),'<meta name="keywords" content="','"');
				
			}
			
		    $res = array(
				 'title'=>$title,
				 'description'=>$description,
				 'keywords'=>$keywords,
				 );
		    return $res;
	}

	function getWords($text) {
	    $text = preg_replace('/</',' <',$text);
	    $text = preg_replace('/>/','> ',$text);
		$text = preg_replace("/(\<script)(.*?)(script>)/si", " ", "$text");
		$text = preg_replace("/(\<a)(.*?)(a>)/si", " ", "$text");
		$text = strip_tags($text);
		$text = str_replace("<!--", "&lt;!--", $text);
		$text = preg_replace("/(\<)(.*?)(--\>)/mi", "".nl2br("\\2")."", $text);
		while($text != strip_tags($text)) {$text = strip_tags($text);}
		$text=preg_replace('/&nbsp;/'," ",$text);
		$text = preg_replace("#[^a-z0-9.,]#i", " ", $text);
		return $text;
	}

	function getskippedWords($text) {

		$text = preg_replace("#[^a-z0-9]#i", " ", $text);
		while(strpos($text,'  ')!==false) $text = preg_replace("/  /", " ", $text);
		$text=$string=strtolower($text);
		$text=explode(" ",$text);
		return count($text);
	}

	function getValues($url) {
		$res=array();
		$page=$this->getHost($url);
		$res['url']=$url;
		$res['html']=$page;
		$res['meta_tags']=$this->_parseTags($page);
		$res['size']=strlen($page);
		$res['text']=$this->getWords($page);
		$res['no_words']=$this->getskippedWords($res['text']);
		$res['no_distinct_words']=$this->getUniqueWords($res['text']);
		$text=$res['text'];
		$handle = fopen("components/com_pageanalysis/include/skipped_words.txt", "r");
		while (!feof($handle)) 
		{
	  		$buffer = fgets($handle, 4096);
			$buffer=" ".trim($buffer)." ";
	   		if(strlen(trim($buffer))>0) $text = str_replace(strtolower($buffer)," ",strtolower($text));
	   	}
		fclose($handle);
		//getting 1 word
		$nrWords=$this->getskippedWords($text);
		
		$res['keywords']['1']=$this->getNum($text);
		$res['keywords']['2']=$this->getNum_2($text);
		$res['keywords']['3']=$this->getNum_3($text);
		
		return $res;		
	}

	function getUniqueWords($text) {
		$text = preg_replace("#[^a-z0-9]#i", " ", $text);
		while(strpos($text,'  ')!==false) $text = preg_replace("/  /", " ", $text);
		$text=$string=strtolower($text);
		$text=explode(" ",$text);
		$keywords=array();
		$text=array_unique($text);
		return count($text);
	}

	function getNum($text) {

		$text = preg_replace("#[^a-z0-9]#i", " ", $text);
		while(strpos($text,'  ')!==false) $text = preg_replace("/  /", " ", $text);
		$text=$string=strtolower($text);
		$text=explode(" ",$text);
		$keywords=array();
		$text=array_unique($text);
		$nr_words=$this->getNumtok($string);
		foreach($text as $t=>$k)
		{
			$nr_finds=$this->getposition($k,$string);	
			//here we will need to put min of the appearencies and min length
			if($nr_finds>=$this->minoc && strlen($k)>=$this->minlength) $keywords[$k]=$nr_finds;	
		}
		arsort($keywords);
		return $keywords;
	}

	function getNum_2($text) {
		$text = preg_replace("#[^a-z0-9]#i", " ", $text);
		while(strpos($text,'  ')!==false) $text = preg_replace("/  /", " ", $text);
		$text=$string=strtolower($text);
		$text=explode(" ",$text);
		$new_text=array();
		$i=0;
		foreach($text as $k=>$t)
		{
			if(strlen(trim($t))>0) $new_text[$i]=trim($t);
			$i++;
		}
		$text=$new_text;
		$keywords=array();
		//making array with 2 words
		while (list($key, $val) = each($text)) 
		{
			$tmp=$val;
			list($key, $val) = each($text);
			$tmp=$tmp." ".$val;
			$nr_finds=$this->getposition($tmp,$string);
			if($nr_finds>=$this->minoc && strlen($tmp)>=2*$this->minlength) $keywords[$tmp]=$nr_finds;	
		}
		arsort($keywords);
		return $keywords;
	}

	function getNum_3($text) {
		$text = preg_replace("#[^a-z0-9]#i", " ", $text);
		while(strpos($text,'  ')!==false) $text = preg_replace("/  /", " ", $text);
		$text=$string=strtolower($text);
		$text=explode(" ",$text);
		$new_text=array();
		$i=0;
		foreach($text as $k=>$t)
		{
			if(strlen(trim($t))>0) $new_text[$i]=trim($t);
			$i++;
		}
		$text=$new_text;
		
		$keywords=array();
		//making array with 3 words
		while (list($key, $val) = each($text)) 
		{
			$tmp=$val;
			list($key, $val) = each($text);
			$tmp=$tmp." ".$val;
			list($key, $val) = each($text);
			$tmp=$tmp." ".$val;
			$nr_finds=$this->getposition($tmp,$string);
			if($nr_finds>=$this->minoc && strlen($tmp)>=3*$this->minlength) $keywords[$tmp]=$nr_finds;	
		}
		arsort($keywords);
		return $keywords;
	}

	function getNumtok($str) {
		$tmp=0;
		$tok = strtok ($str," ");
	    while ($tok) {
		$tmp++;
	    $tok = strtok (" ");
		}
		return $tmp;
	}

	function getposition($key,$string) {
		$q=0;
		$nr=0;
		$key=strtolower($key);
		$string=strtolower($string);
		while($q==0)
		{
			if($key=="")
				$key = "dd";

			$pos = strpos($string,$key);
			
	  		if ($pos===false) $q=1;
			else 
			{
				$string = substr ($string,$pos+strlen($key));
				$nr++;
			}
		}
		return $nr;
	}

	function ExtractString($str, $start, $end) {
	   $str_low = strtolower($str);
	   $pos_start = strpos($str_low, $start);
	   $pos_end = strpos($str_low, $end, ($pos_start + strlen($start)));
	   if ( ($pos_start !== false) && ($pos_end !== false) ) {
	       $pos1 = $pos_start + strlen($start);
	       $pos2 = $pos_end - $pos1;
	       return substr($str, $pos1, $pos2);
	   }
	}
}