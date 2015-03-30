<?php
class AppController extends Controller  {

  var $appComponents = array('Cron','Configuration','Pagination','Search','Fieldlength');
  var $appHelpers = array('Html','Form','Ajax','Javascript','Error','Link','Tooltip','Pagination');
  var $beforeFilter = array('getNamedArgs');
  var $persistModel = CACHE_CHECK;
  var $namedArgs = true;
  var $argSeparator = "-";
  var $hiddenParams = array();

  function __construct()
  {
    $this->components = array_merge($this->appComponents, $this->components);
    $this->helpers = array_merge($this->appHelpers, $this->helpers);
    parent::__construct();
  }

  function getNamedArgs() {
    if ($this->namedArgs)
    {
      $this->namedArgs = array();
      if (!empty($this->params['pass']))
      {
        foreach ($this->params['pass'] as $param)
        {
          if (strpos($param, $this->argSeparator))
          {
            $params = explode($this->argSeparator, $param);
            $this->namedArgs[$params[0]] = substr($param, strlen($params[0])+1);
          }
        }
      }
    }
    return true;
  }

  function redirect($url, $ignoreParams=array())
  {
    if (substr($url, -1, 1)!="/")
    {
      $url .= "/";
    }

    $namedArgs = $this->namedArgs;
    $argSeparator = $this->argSeparator;
    $getParams = $this->params['url'];
    unset($getParams['url']);

    $getString = Array();
    $namedString = Array();

    foreach($namedArgs as $key => $value)
    {
      if (!in_array($key,$this->hiddenParams) && !in_array($key,$ignoreParams))
      {
        $namedString[] = $key.$argSeparator.urlencode($value);
      }
    }
    foreach($getParams as $key => $value)
    {
      if (!in_array($key,$this->hiddenParams) && !in_array($key,$ignoreParams))
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

    parent::redirect($url);
  }

}
?>