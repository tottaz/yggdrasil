<?php
/**
 * Pagination Helper, responsible for managing the LINKS required for pagination.
 * ALL parameters are specified in the component.
 */
class PaginationHelper extends Helper
{
/**
 * Options to be passed to ajax links if used
 *
 * @var array
 * @access public
 */
  var $ajaxLinkOptions = array();
/**
 * Placeholder for the link style - defined in/by the component
 *
 * @var boolean
 * @access private
 */
  var $style = 'html';
/**
 * Placeholder for the parameter style - defined in/by the component
 *
 * @var boolean
 * @access private
 */
  var $paramStyle = 'get';
/**
 * Placeholder for the pagination details
 *
 * @var array
 * @access private
 */
  var $_pageDetails = Array();
/**
 * Helpers
 *
 * @var array
 * @access private
 */
  var $helpers = Array("Html","Ajax");

/**
 * Sets the default pagination options. Fails if the value $paging is not set
 *
 * @param array $paging an array detailing the page options
 * @return boolean
 */
  function setPaging($paging)
  {
    if (empty($paging)) {return false;}
    $this->_pageDetails = $paging;
    $this->_pageDetails['previousPage'] = ($paging['page']>1) ? $this->_pageDetails['page']-1 : '';
    $this->_pageDetails['nextPage'] = ($paging['page'] < $this->_pageDetails['pageCount']) ? $this->_pageDetails['page']+1 : '';

    $this->url = $this->_pageDetails['url'];

    $getParams = $this->params['url'];
    unset($getParams['url']);
    $this->getParams = $getParams;

    $this->showLimits = $this->_pageDetails['showLimits'];
    $this->style = isset($this->_pageDetails['style'])?$this->_pageDetails['style']:$this->style;

    if (($this->_pageDetails['maxPages'] % 2)==0) // need odd number of page links
    {
      $this->_pageDetails['maxPages'] = $this->_pageDetails['maxPages']-1;
    }

    $this->maxPages = $this->_pageDetails['maxPages'];
    $this->pageSpan = ($this->_pageDetails['maxPages']-1)/2;

    return true;
  }

/**
* Displays the list of pages for the given parameters.
*
* @param string text to display before limits
* @param string display a separate between limits
* @param boolean whether to escape the title or not
* @return unknown the html string for modifying the number of results per page
**/
  function resultsPerPage($t="Results per page: ", $separator=" ",$escapeTitle=true)
  {
    if (empty($this->_pageDetails)) { return false; }
    $pageDetails = $this->_pageDetails;
    if ( !empty($pageDetails['pageCount']) )
    {
      if(is_array($pageDetails['resultsPerPage']))
      {
        $OriginalValue = $pageDetails['show'];
        $t .= $separator;
        foreach($pageDetails['resultsPerPage'] as $value)
        {
          if($OriginalValue == $value)
          {
            $t .= '<em>'.$value.'</em>'.$separator;
          }
          else
          {
            $pageDetails['show'] = $value;
            $t .= $this->_generateLink($value,1,$escapeTitle,$pageDetails).$separator;
          }
        }
      }
      return $t;
    }
    return false;
  }

  /**
   * Generate a select box for options for results per page
   *
   * @param string prefix text
   * @return unknown the html string for the select box for modifying the number of results per page
   **/
  function resultsPerPageSelect($t="Results per page: ")
  {
    if (empty($this->_pageDetails)) { return false; }
    if ( !empty($this->_pageDetails['pageCount']) )
    {
      $Options = Array();
      if(is_array($this->_pageDetails['resultsPerPage']))
      {
        foreach($this->_pageDetails['resultsPerPage'] as $value)
        {
          $Options[$value] = $value;
        }
      }
      return $t.$this->Html->selectTag("pagination/show", $Options, $this->_pageDetails['show'], NULL, NULL,FALSE);
    }
    return false;
  }

  /**
   * Displays info of the current result set
   *
   * @param string prefix text
   * @param string
   * @param string
   * @return unknown the html string for the current result set.
   **/
  function result($t="Results: ",$of=" of ",$inbetween="-")
  {
    if (empty($this->_pageDetails)) { return false; }
    if ( !empty($this->_pageDetails['pageCount']) )
    {
      if($this->_pageDetails['pageCount'] > 1)
      {
        $start_row = (($this->_pageDetails['page']-1)*$this->_pageDetails['show'])+1;
        $end_row = min ((($this->_pageDetails['page'])*$this->_pageDetails['show']),($this->_pageDetails['total']));
        $t = $t.$start_row.$inbetween.$end_row.$of.$this->_pageDetails['total'];
      }
      else
      {
        $t .= $this->_pageDetails['total'];
      }
      return $t;
    }
    return false;
  }
  /**
   * Returns a list of page numbers separated by $separator
   *
   * @param string $separator - defaults to null
   * @param boolean
   * @param string $spacerLower - If there are more results than space for the links, the text inbetween
   * @param string $spacerUpper - If there are more results than space for the links, the text inbetween
   * @return string html for the list of page numbers
   **/
  function pageNumbers($separator=null,$escapeTitle=true,$spacerLower="...",$spacerUpper="...")
  {
    if (empty($this->_pageDetails) || $this->_pageDetails['pageCount'] == 1) { return "<em>1</em>"; }
    $total = $this->_pageDetails['pageCount'];
    $max = $this->maxPages;
    $span = $this->pageSpan;
    if ($total<$max)
    {
      $upperLimit = min($total,($span*2+1));
      $lowerLimit = 1;
    }
    elseif ($this->_pageDetails['page']<($span+1))
    {
      $lowerLimit = 1;
      $upperLimit = min($total,($span*2+1));
    }
    elseif ($this->_pageDetails['page']>($total-$span))
    {
      $upperLimit = $total;
      $lowerLimit = max(1,$total-$span*2);
    }
    else
    {
      $upperLimit = min ($total,$this->_pageDetails['page']+$span);
      $lowerLimit = max (1,($this->_pageDetails['page']-$span));
    }

    $t = array();
    if (($lowerLimit<>1)AND($this->showLimits))
    {
      $lowerLimit = $lowerLimit+1;
      $t[] = $this->_generateLink(1,1,$escapeTitle);
      if ($spacerLower)
      {
        $t[] = $spacerLower;
      }
    }
    if (($upperLimit<>$total)AND($this->showLimits))
    {
      $dottedUpperLimit = true;
    }
    else
    {
      $dottedUpperLimit = false;
    }
    if (($upperLimit<>$total)AND($this->showLimits))
    {
      $upperLimit = $upperLimit-1;
    }
    for ($i = $lowerLimit; $i <= $upperLimit; $i++)
    {
      if($i == $this->_pageDetails['page'])
      {
        $text = '<em>'.$i.'</em>';
      }
      else
      {
        $text = $this->_generateLink($i,$i,$escapeTitle);
      }
      $t[] = $text;
    }
    if ($dottedUpperLimit)
    {
      if ($spacerUpper)
      {
        $t[] = $spacerUpper;
      }
      $t[] = $this->_generateLink($this->_pageDetails['pageCount'],$this->_pageDetails['pageCount'],$escapeTitle);
    }
    $t = implode($separator, $t);
    return $t;
  }

  /**
   * Displays a link to the previous page, where the page doesn't exist then
   * display the $text
   *
   * @param string $text - text display: defaults to next
   * @return string html for link/text for previous item
   **/
  function prevPage($text='prev',$escapeTitle=true)
  {
    if (empty($this->_pageDetails)) { return false; }
    if ( !empty($this->_pageDetails['previousPage']) )
    {
      return $this->_generateLink($text,$this->_pageDetails['previousPage'],$escapeTitle);
    }
    return $text;
  }

  /**
   * Displays a link to the next page, where the page doesn't exist then
   * display the $text
   *
   * @param string $text - text to display: defaults to next
   * @return string html for link/text for next item
   **/
  function nextPage($text='next',$escapeTitle=true)
  {
    if (empty($this->_pageDetails)) { return false; }
    if (!empty($this->_pageDetails['nextPage']))
    {
      return $this->_generateLink($text,$this->_pageDetails['nextPage'],$escapeTitle);
    }
    return $text;
  }

  /**
   * Displays a link to the first page
   * display the $text
   *
   * @param string $text - text to display: defaults to next
   * @return string html for link/text for next item
   **/
  function firstPage($text='first',$escapeTitle=true)
  {
    if (empty($this->_pageDetails)) { return false; }
    if ($this->_pageDetails['page']<>1)
    {
      return $this->_generateLink($text,1,$escapeTitle);
    }
    else
    {
      return false;
    }
  }

  /**
   * Displays a link to the last page
   * display the $text
   *
   * @param string $text - text to display: defaults to next
   * @return string html for link/text for next item
   **/
  function lastPage($text='last',$escapeTitle=true)
  {
    if (empty($this->_pageDetails)) { return false; }
    if ($this->_pageDetails['page']<>$this->_pageDetails['pageCount'])
    {
      return $this->_generateLink($text,$this->_pageDetails['pageCount'],$escapeTitle);
    }
    else
    {
      return false;
    }
  }


  /**
   * Generate link to sort the results by the given value
   *
   * @param string field to sort by
   * @param string title for link defaults to $value
   * @param string model to sort by - uses the default model class if absent
   * @param boolean escape title
   * @param string text to append to links to indicate sorted ASC
   * @param string text to append to links to indicate sorted DESC
   * @return string html for link to modify sort order
   **/
  function sortBy ($value, $title=NULL, $Model=NULL, $escapeTitle=false, $upText=null, $downText=null)
  {
    if (empty($this->_pageDetails)) { return false; }
    $upText = $upText ? $upText : '&nbsp;'.$this->Html->Image('action/arrow_up.gif', array('alt'=>'Up','title'=>'Click To Sort Descending'));
    $downText = $downText ? $downText : '&nbsp;'.$this->Html->Image('action/arrow_down.gif', array('alt'=>'Down','title'=>'Click To Sort Ascending'));
    $title = $title?$title:ucfirst($value);
    $value = strtolower($value);
    $Model = $Model?$Model:$this->_pageDetails['Defaults']['sortByClass'];

    $OriginalSort = $this->_pageDetails['sortBy'];
    $OriginalModel = $this->_pageDetails['sortByClass'];
    $OriginalDirection = $this->_pageDetails['direction'];

    if (($value==$OriginalSort)&&($Model==$OriginalModel))
    {
      if (up($OriginalDirection)=="DESC")
      {
        $this->_pageDetails['direction'] = "ASC";
        $title .= $upText;
      }
      else
      {
        $this->_pageDetails['direction'] = "DESC";
        $title .= $downText;
      }
    }
    else
    {
      if ($Model)
      {
        $this->_pageDetails['sortByClass'] = $Model;
        //echo "page details model class set to ".$this->_pageDetails['sortByClass']."<br>";
      }
      else
      {
        $this->_pageDetails['sortByClass'] = NULL;
      }
      $this->_pageDetails['sortBy'] = $value;
    }
    $link = $this->_generateLink ($title,1,$escapeTitle);
    $this->_pageDetails['sortBy'] = $OriginalSort;
    $this->_pageDetails['sortByClass'] = $OriginalModel;
    $this->_pageDetails['direction'] = $OriginalDirection;
    return $link;
  }

  /**
   * Generate a select box for options to sort results
   *
   * @param array array of text strings, formatted as "Field::Direction::Class".
   * @param string prefix text
   * @param string text to append to links to indicate sorted ASC
   * @param string text to append to links to indicate sorted DESC
   * @return unknown the html string for the select box for selecting sort order
   **/
  function sortBySelect($sortFields, $t="Sort By: ",$upText=" ^",$downText=" v")
  {
    if (empty($this->_pageDetails)) { return false; }
    if ( !empty($this->_pageDetails['pageCount']) )
    {
      $OriginalValue = $this->_pageDetails['sortBy']."::".$this->_pageDetails['direction']."::".$this->_pageDetails['sortByClass'];
      if(is_array($sortFields))
      {
        foreach($sortFields as $value)
        {
          $Vals = Array();
          $Vals = explode("::",$value);
          if (isset($Vals[2]))
          {
            $DisplayVal = $Vals[2]." ";
          }
          else
          {
            $DisplayVal = "";
          }
          $DisplayVal .= $Vals[0];
          if (up($Vals[1])=="ASC")
          {
            $DisplayVal .= $downText;
          }
          else
          {
            $DisplayVal .= $upText;
          }
          $Options[$value] = $DisplayVal;
        }
        return $t.$this->Html->selectTag("pagination/sortByComposite", $Options, $OriginalValue, NULL, NULL,FALSE);
      }
    }
    return false;
  }

  /**
   * Internal method to generate links based upon passed parameters.
   *
   * @param string title for link
   * @param string page the page number
   * @param boolean escape title
   * @param string the div to be updated by AJAX updates
   * @return string html for link
   **/
  function _generateLink ($title,$page=NULL,$escapeTitle,$pageDetails = NULL)
  {
    $pageDetails = $pageDetails?$pageDetails:$this->_pageDetails;
    $url = $this->_generateUrl($page,$pageDetails);
    $AjaxDivUpdate = $pageDetails['ajaxDivUpdate'];
    if ($this->style=="ajax")
    {
      $options = am($this->ajaxLinkOptions,
      array(
      "update" => $pageDetails['ajaxDivUpdate']
      )
      );
      if (isset($pageDetails['ajaxFormId']))
      {
        $id = 'link' . intval(rand());
        $return = $this->Html->link(
        $title,
        $url,
        array('id' => $id, 'onclick'=>" return false;"),
        NULL,
        $escapeTitle
        );
        $options['with'] = "Form.serialize('{$this->_pageDetails['ajaxFormId']}')";
        $options['url'] = $url;
        $return .= $this->Ajax->Javascript->event("'$id'", "click", $this->Ajax->remoteFunction($options));
        return $return;
      }
      else
      {
        return $this->Ajax->link(
        $title,
        $url,
        $options,
        NULL,
        NULL,
        $escapeTitle
        );
      }
    }
    else
    {
      return $this->Html->link(
      $title,
      $url,
      NULL,
      NULL,
      $escapeTitle
      );
    }
  }

  function _generateUrl ($page=NULL,$pageDetails=NULL)
  {
    $pageDetails = $pageDetails?$pageDetails:$this->_pageDetails;
    $getParams = $this->getParams; // Import any other pre-existing get parameters
    if ($this->_pageDetails['paramStyle']=="pretty")
    {
      $pageParams=$pageDetails['importParams'];
    }
    $pageParams['show'] = $pageDetails['show'];
    $pageParams['sortBy'] = $pageDetails['sortBy'];
    $pageParams['direction'] = $pageDetails['direction'];
    $pageParams['page'] = $page?$page:$pageDetails['page'];
    if (isset($pageDetails['sortByClass']))
    {
      $pageParams['sortByClass'] = $pageDetails['sortByClass'];
    }
    $getString = Array();
    $prettyString = Array();
    if ($pageDetails['paramStyle']=="get")
    {
      $getParams = am($getParams,$pageParams);
    }
    else
    {
      foreach($pageParams as $key => $value)
      {
        if (isset($pageDetails['Defaults'][$key]))
        {
          if (up($pageDetails['Defaults'][$key])<>up($value))
          {
            $prettyString[] = "$key{$pageDetails['paramSeperator']}$value";
          }
        }
        else
        {
          $prettyString[] = "$key{$pageDetails['paramSeperator']}$value";
        }
      }
    }
    foreach($getParams as $key => $value)
    {
      if ($pageDetails['paramStyle']=="get")
      {
        if (isset($pageDetails['Defaults'][$key]))
        {
          if (up($pageDetails['Defaults'][$key])<>up($value))
          {
            $getString[] = $key."=".urlencode($value);
          }
        }
        else
        {
          $getString[] = $key."=".urlencode($value);
        }
      }
      else
      {
        $getString[] = $key."=".urlencode($value);
      }
    }
    $url = $this->url;
    if ($prettyString)
    {
      $prettyString = implode ("/", $prettyString);
      $url .= $prettyString;
    }
    if ($getString)
    {
      $getString = implode ("&amp;", $getString);
      $url .= "?".$getString;
    }

    return $url;
  }
}
?>