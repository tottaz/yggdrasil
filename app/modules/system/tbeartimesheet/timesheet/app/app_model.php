<?php
class AppModel extends Model
{

  var $assocs;
  var $disabledValidate;

  function __construct()
  {
    $this->assocs = array();
    foreach ($this->belongsTo as $model=>$info)
    {
      $this->assocs[$model] = $info;
      $this->assocs[$model]['type'] = 'belongsTo';
    }
    foreach ($this->hasOne as $model=>$info)
    {
      $this->assocs[$model] = $info;
      $this->assocs[$model]['type'] = 'hasOne';
    }
    foreach ($this->hasMany as $model=>$info)
    {
      $this->assocs[$model] = $info;
      $this->assocs[$model]['type'] = 'hasMany';
    }
    foreach ($this->hasAndBelongsToMany as $model=>$info)
    {
      $this->assocs[$model] = $info;
      $this->assocs[$model]['type'] = 'hasAndBelongsToMany';
    }

    parent::__construct();
  }

  function loadValidation() {
    // placeholder for overloading
  }

  function invalidFields($data = array())
  {
    $this->loadValidation();

    if (is_array($this->disabledValidate))
    {
      foreach($this->disabledValidate as $field => $params)
      {
        if (is_string($field) && is_array($params))
        {
          foreach($params as $param)
          {
            if (is_string($param))
            {
              $this->validate[$field][$param] = false;
            }
          }
        }
        else if (is_int($field) && is_string($params))
        {
          $this->validate[$params] = false;
        }
      }
    }

    if (!isset($this->validate) || !empty($this->validationErrors))
    {
      if (!isset($this->validate))
      {
        return true;
      }
      else
      {
        return $this->validationErrors;
      }
    }

    if (isset($this->data))
    {
      $data = array_merge($data, $this->data);
    }

    $errors = array();
    $this->set($data);

    foreach ($data as $table => $field)
    {
      foreach ($this->validate as $field_name => $validators)
      {
        if ($validators)
        {
          foreach($validators as $validator)
          {
            if (isset($validator['method']))
            {
              if (method_exists($this, $validator['method']))
              {
                $parameters = (isset($validator['parameters'])) ? $validator['parameters'] : array();
                $parameters['var'] = $field_name;

                if (isset($data[$table][$field_name]) && !call_user_func_array(array(&$this, $validator['method']),array($parameters)))
                {
                  if (!isset($errors[$field_name]))
                  {
                    $errors[$field_name] = isset($validator['message']) ? $validator['message'] : 1;
                  }
                }
              }
              else
              {
                if (isset($data[$table][$field_name]) && !preg_match($validator['method'], $data[$table][$field_name]))
                {
                  if (!isset($errors[$field_name]))
                  {
                    $errors[$field_name] = isset($validator['message']) ? $validator['message'] : 1;
                  }
                }
              }
            }
          }
        }
      }
    }
    $this->validationErrors = $errors;
    return $errors;
  }

  function validateEmail($params)
  {
    return $this->data[$this->name][$params['var']] ? preg_match(VALID_EMAIL, $this->data[$this->name][$params['var']]) : true;
  }

  function validateExists($params)
  {
    return $this->data[$this->name][$params['var']] ? $this->$params['model']->hasAny($params['conditions']) : true;
  }

  function validateMultiOptional($params)
  {
    foreach ($params as $param)
    {
      if ($this->data[$this->name][$param])
      {
        return true;
      }
    }
    return false;
  }

  function validateUnique($params)
  {
    $val = $this->data[$this->name][$params['var']];
    $db = $this->name . '.' . $params['var'];
    $id = $this->name . '.id';
    if($this->id == null )
    {
      return(!$this->hasAny(array($db => $val ) ));
    }
    else
    {
      return(!$this->hasAny(array($db => $val, $id => '!='.$this->data[$this->name]['id'] ) ) );
    }
  }

  function validateMatch($params)
  {
    if (!$params[1] || !$params[2])
    {
      return true;
    }
    if ($params[1]=='equal')
    {
      return ($params[1]==$params[2]);
    }
    else
    {
      return ($params[1]!=$params[2]);
    }
  }

  function validateLengthWithin($params)
  {
    if (!isset($this->data[$this->name][$params['var']]))
    {
      return true;
    }

    $val = $this->data[$this->name][$params['var']];
    $length = strlen($val);

    if (array_key_exists('min', $params) && array_key_exists('max', $params))
    {
      return $length >= $params['min'] && $length <= $params['max'];
    }
    else if (array_key_exists('min', $params))
    {
      return $length >= $params['min'];
    }
    else if (array_key_exists('max', $params))
    {
      return $length <= $params['max'];
    }
  }

  function validateUploadFile($params)
  {
    if ($this->data[$this->name][$params['check']])
    {
      return true;
    }
    if (!$this->data[$this->name][$params['var']]['error'] && is_array($params['types']))
    {
      $filename_info = pathinfo($this->data[$this->name][$params['var']]['name']);
      $extension = strtolower($filename_info['extension']);
      if (!in_array($extension,$params['types']))
      {
        return false;
      }
    }
    return is_uploaded_file($this->data[$this->name][$params['var']]['tmp_name']);
  }

  function validateInArray($params)
  {
    if (!isset($this->data[$this->name][$params['var']]) || $this->data[$this->name][$params['var']]=='')
    {
      return true;
    }
    return (in_array($this->data[$this->name][$params['var']], $params['values']));
  }

  function blankToNull($field)
  {
    if (isset($this->data[$this->name][$field]) && !$this->data[$this->name][$field])
    {
      $this->data[$this->name][$field] = null;
    }
  }

  function expects($array) {
    $this->unbindModelAll();
    foreach ($array as $assoc) {
      $this->bindModel(array($this->assocs[$assoc]['type'] => array($assoc => $this->assocs[$assoc])));
    }
  }

  function unbindModelAll()
  {
    $unbind = array();
    foreach ($this->belongsTo as $model=>$info)
    {
      $unbind['belongsTo'][] = $model;
    }
    foreach ($this->hasOne as $model=>$info)
    {
      $unbind['hasOne'][] = $model;
    }
    foreach ($this->hasMany as $model=>$info)
    {
      $unbind['hasMany'][] = $model;
    }
    foreach ($this->hasAndBelongsToMany as $model=>$info)
    {
      $unbind['hasAndBelongsToMany'][] = $model;
    }
    $this->unbindModel($unbind);
  }

}
?>