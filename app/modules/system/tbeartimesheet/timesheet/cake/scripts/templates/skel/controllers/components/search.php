<?php
class SearchComponent extends Object
{
  var $url;
  var $match = 'partial';
  var $catch = 'any';
  var $field = '';
  var $keywords = null;
  var $type = 'basic';
  var $search = array();
  var $conditions = null;
  var $controller = true;
  var $namedArgs = true;
  var $argSeparator = '-';
  var $Sanitize;

  function startup(&$controller)
  {
    $this->controller = $controller;
  }

  function init($fields=null,$parameters=null)
  {
    uses('sanitize');
    $this->Sanitize = & new Sanitize;

    $this->_initSearch($parameters);
    $this->_initUrl();

    $this->_setParameter('keywords',$parameters);
    $this->_setParameter('match',$parameters);
    $this->_setParameter('catch',$parameters);
    $this->_setParameter('field',$parameters);
    $this->_setParameter('type',$parameters);

    if (isset($this->controller->data['Search']))
    {
      $this->controller->redirect($this->_generateRedirectUrl());
    }

    $conditions = '';
    if ($this->search['data']['keywords'])
    {
      if ($this->search['data']['match']=='partial')
      {
        $keywords = explode(' ', $this->search['data']['keywords']);
        foreach ($keywords as $keyword)
        {
          if ($this->search['data']['field'])
          {
            $conditions .= "{$this->search['data']['field']} LIKE '%{$keyword}%' ";
            $conditions .= $this->search['data']['catch']=='all' ? 'AND ' : 'OR  ';
          }
          else
          {
            if (is_array($fields))
            {
              $conditions .= "( ";
              foreach ($fields as $field=>$name)
              {
                $conditions .= "{$field} LIKE '%{$keyword}%' ";
                $conditions .= "OR ";
              }
              $conditions = substr($conditions,0,-3);
              $conditions .= " ) ";
              $conditions .= $this->search['data']['catch']=='all' ? 'AND ' : 'OR  ';
            }
          }
        }
      }
      else
      {
        if ($this->search['data']['field'])
        {
          $conditions .= "{$this->search['data']['field']} = '{$this->search['data']['keywords']}' AND ";
        }
        else
        {
          if (is_array($fields))
          {
            $conditions .= "( ";
            foreach ($fields as $field=>$name)
            {
              $conditions .= "{$field} = '{$this->search['data']['keywords']}' ";
              $conditions .= "OR ";
            }
            $conditions = substr($conditions,0,-3);
            $conditions .= " ) AND ";
          }
        }
      }
    }

    $search['url'] = $this->_generateFormUrl();
    $search['type'] = $this->search['data']['type'];
    $search['fields'] = array_merge(array(null=>'All Fields'),$fields);
    $this->controller->set('search', $search);
    $this->controller->data['Search'] = $this->search['data'];

    return $conditions ? substr($conditions,0,-4) : null;
  }

  function _initSearch($parameters)
  {
    $this->search['Defaults'] = Array (
      'match'=>$this->match,
      'catch'=>$this->catch,
      'field'=>$this->field,
      'keywords'=>$this->keywords,
      'type'=>$this->type
    );
    $this->search['importParams'] = array();
    foreach ($parameters as $key => $value)
    {
    	if (!in_array($key,(array('match','catch','field','keywords','type','page'))))
    	{
        $this->search['importParams'][$key]=$value;
    	}
    }
  }

  function _setParameter($parameter,$parameters=Array(),$field=NULL)
  {
    $field = $field?$field:$parameter;

    if (isset($this->controller->data['Search'][$parameter]))
    {
      $this->search['data'][$field] = $this->Sanitize->paranoid($this->controller->data['Search'][$parameter],array('-','_','.',' '));
    }
    elseif (isset($parameters[$parameter]))
    {
      $this->search['data'][$field] = $this->Sanitize->paranoid($parameters[$parameter],array('-','_','.',' '));
    }
    elseif (isset($_GET[$parameter]))
    {
      $this->search['data'][$field] = $this->Sanitize->paranoid($_GET[$parameter],array('-','_','.',' '));
    }
    else
    {
      $this->search['data'][$field]= $this->$field;
    }
  }

  function _initUrl()
  {
    $this->url = '';
    if ($this->namedArgs)
    {
      if (isset($this->controller->params['admin']))
      {
        $this->url .= '/'.$this->controller->params['admin'];
        $action = substr($this->controller->action, strlen($this->controller->params['admin'].'_'));
      }
      else
      {
        $action = $this->controller->action;
      }
      if ($this->controller->plugin)
      {
        $this->url .= '/'.$this->controller->plugin;
      }
      $this->url .= '/'.Inflector::underscore($this->controller->name);
      $this->url .= '/'.$action.'/';
    }
    else
    {
      $this->url = str_replace($this->controller->webroot,'/',$this->controller->here);
    }
    if (defined('BASE_URL')) { // Hack for no mod_rewrite
      $this->url = preg_replace( '!'.BASE_URL.'!', '', $this->url); // Remove the base from the url
      $this->url = preg_replace('!\?.*!', '', $this->url); // Remove the get parameters
    }
  }

  function _generateFormUrl()
  {
    $getString = array();
    $namedString = array();
    $getParams = $this->controller->params['url'];
    $namedParams = $this->search['importParams'];
    unset($getParams['url']);
    foreach($namedParams as $key => $value)
    {
      $namedString[] = "$key{$this->argSeparator}$value";
    }
    foreach($getParams as $key => $value)
    {
      $getString[] = $key.'='.urlencode($value);
    }

    $url = $this->url;
    if ($namedString)
    {
      $namedString = implode('/', $namedString);
      $url .= $namedString.'/';
    }
    if ($getString)
    {
      $getString = implode('&amp;', $getString);
      $url .= '?'.$getString;
    }
    return $url;
  }

  function _generateRedirectUrl()
  {
    $getString = array();
    $namedString = array();
    $getParams = array();

    if ($this->namedArgs)
    {
      foreach($this->search['data'] as $key => $value)
      {
        if (isset($this->search['Defaults'][$key]))
        {
          if (up($this->search['Defaults'][$key])<>up($value))
          {
            $namedString[] = "$key{$this->argSeparator}$value";
          }
        }
        else
        {
          $namedString[] = "$key{$this->argSeparator}$value";
        }
      }
    }
    else
    {
      $getParams = am($getParams,$this->search['data']);
    }
    foreach($getParams as $key => $value)
    {
      if (isset($this->search['Defaults'][$key]))
      {
        if (up($this->search['Defaults'][$key])<>up($value))
        {
          $getString[] = $key.'='.urlencode($value);
        }
      }
      else
      {
        $getString[] = $key.'='.urlencode($value);
      }
    }
    $url = preg_replace('!\?.*!', '', $this->url);
    if ($namedString)
    {
      $namedString = implode('/', $namedString);
      $url .= $namedString;
    }
    if ($getString)
    {
      $getString = implode('&amp;', $getString);
      $url .= '?'.$getString;
    }

    return $url;
  }

}
?>