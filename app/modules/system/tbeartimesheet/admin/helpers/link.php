<?php
class LinkHelper extends Helper
{
  var $hiddenParams = array();

  function getLink($url)
  {
    if (substr($url, -1, 1)!="/")
    {
      $url .= "/";
    }

    $namedArgs = $this->view->controller->namedArgs;
    $argSeparator = $this->view->controller->argSeparator;

    $getParams = $this->params['url'];
    unset($getParams['url']);
    $this->getParams = $getParams;

    $urlParams = am($getParams,$namedArgs);

    $getString = Array();
    $namedString = Array();

    foreach($namedArgs as $key => $value)
    {
      if (!in_array($key,$this->hiddenParams))
      {
        $namedString[] = $key.$argSeparator.urlencode($value);
      }
    }
    foreach($getParams as $key => $value)
    {
      if (!in_array($key,$this->hiddenParams))
      {
        $getString[] = $key."=".urlencode($value);
      }
    }

    if ($namedString)
    {
      $namedString = implode ("/", $namedString);
      $url .= $namedString;
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