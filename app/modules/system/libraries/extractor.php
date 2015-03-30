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
class Extractor
{
	var $domain;
	var $html;
	var $links;
	
	function Extractor($url = '')
	{
		$this->domain = '';
		$this->links = array();
		if( strcmp($url,'') )
			$this->ConvertToHTML($url);	
		else
			$this->html = $url;
	}

	function ConvertToHTML($url)
	{
		$match_domain='_[hH][tT][tT][pP]:\/\/(.*?)(/|$)_';
		preg_match($match_domain, $url, $res); 
		$this->domain=$res[1];
		if (!$this->domain)
			return false;
		$this->html = $this->getHost($url);
		return true;
	}
	
	function DisplayHTML()
	{
		if( strlen($this->html) )
		{
			echo $this->html;
			return true;
		}
		else
			return false;
	}

	function ExtractLinks($filter, $sensitive = true)
	{ 
		$lookfor='/<[aA]\s.*?[hH][rR][eE][fF]=[ 					"\']{0,}([-.,\%_\(\)|=~;+:\?\&\/a-zA-Z0-9]+)[ "\'>]/';
		preg_match_all($lookfor, $this->html, $data);
		while (list($k, $v)=each($data[1]))
		{
			// filter by
			if( strlen($filter) )
			{
				if( $sensitive )
				{
					if( strpos($v, $filter) === false )
						continue;
				}
				else
				{
					if( strpos(strtolower($v), strtolower($filter)) === false )
						continue;
				}
			}
			if( stristr($v, 'javascript:') )
			{
				// ignore - contains javascript
			}
			elseif( stristr($v, '//') == $v ) 
			{ 
				$v = 'http:'.$v;
				$this->links[] = $v;
			} 
			elseif( stristr($v, 'http://') != $v ) 
			{ 
				if( stristr($v, '/') != $v )
					$sep = '/';
				else
					$sep = '';
				$v = 'http://' . $this->domain . $sep . $v; 
				$this->links[] = $v;
			} 
			else
				$this->links[] = $v;
		}
		if( count($this->links) )
		{
			$this->links = array_flip($this->links);
			$this->links = array_keys($this->links); 
		}
		else
			$this->links[] = 'No Data';
		return true; 
	}
	function getHost($url)
{
	$handle = fopen($url, "r");
	if($handle)
	{
		$contents = '';
		while (!feof($handle)) {$contents .= fread($handle, 8192);}
		return $contents;
	}
	else return false;
	
}
}